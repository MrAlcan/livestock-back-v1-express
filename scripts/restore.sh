#!/bin/bash

# ==========================================
# DATABASE RESTORE SCRIPT
# ==========================================
# Usage: ./scripts/restore.sh [backup_file]
# Example: ./scripts/restore.sh backups/database/db-20240115-120000.sql.gz

set -e  # Exit on error
set -u  # Exit on undefined variable

# ------------------------------------------
# Colors for output
# ------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ------------------------------------------
# Configuration
# ------------------------------------------
BACKUP_FILE="${1:-}"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="./backups"

# ------------------------------------------
# Functions
# ------------------------------------------
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

confirm_restore() {
    log_warning "================================================"
    log_warning "WARNING: This will replace the current database!"
    log_warning "================================================"
    log_warning "Backup file: ${BACKUP_FILE}"
    log_warning ""

    read -p "Are you sure you want to continue? (yes/no): " -r
    echo

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi
}

list_available_backups() {
    log_info "Available backups:"
    echo ""

    if [ -d "${BACKUP_DIR}/database" ]; then
        ls -lht "${BACKUP_DIR}/database/"*.sql.gz 2>/dev/null || echo "No backups found"
    else
        log_error "Backup directory not found: ${BACKUP_DIR}/database"
        exit 1
    fi

    echo ""
}

validate_backup_file() {
    log_info "Validating backup file..."

    if [ -z "${BACKUP_FILE}" ]; then
        log_error "No backup file specified"
        list_available_backups
        exit 1
    fi

    if [ ! -f "${BACKUP_FILE}" ]; then
        log_error "Backup file not found: ${BACKUP_FILE}"
        list_available_backups
        exit 1
    fi

    # Test if file is valid gzip
    if ! gunzip -t "${BACKUP_FILE}" 2>/dev/null; then
        log_error "Backup file is corrupted or not a valid gzip file"
        exit 1
    fi

    log_success "Backup file validated"
}

create_safety_backup() {
    log_info "Creating safety backup of current database..."

    # Load environment variables
    export $(grep -v '^#' .env.production | xargs)

    SAFETY_BACKUP="${BACKUP_DIR}/database/pre-restore-$(date +%Y%m%d-%H%M%S).sql"

    docker-compose -f ${COMPOSE_FILE} exec -T postgres pg_dump \
        -U ${DB_USER} \
        -d ${DB_NAME} \
        > "${SAFETY_BACKUP}"

    gzip "${SAFETY_BACKUP}"

    log_success "Safety backup created: ${SAFETY_BACKUP}.gz"
}

stop_application() {
    log_info "Stopping application..."

    docker-compose -f ${COMPOSE_FILE} stop api

    log_success "Application stopped"
}

restore_database() {
    log_info "Restoring database from backup..."

    # Load environment variables
    export $(grep -v '^#' .env.production | xargs)

    # Drop existing connections
    docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${DB_USER} -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();"

    # Drop and recreate database
    docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${DB_USER} -d postgres -c \
        "DROP DATABASE IF EXISTS ${DB_NAME};"

    docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${DB_USER} -d postgres -c \
        "CREATE DATABASE ${DB_NAME};"

    # Restore from backup
    gunzip -c "${BACKUP_FILE}" | docker-compose -f ${COMPOSE_FILE} exec -T postgres \
        psql -U ${DB_USER} -d ${DB_NAME}

    log_success "Database restored"
}

restore_redis() {
    log_info "Checking for Redis backup..."

    # Extract timestamp from database backup filename
    TIMESTAMP=$(basename "${BACKUP_FILE}" | sed 's/db-\(.*\)\.sql\.gz/\1/')
    REDIS_BACKUP="${BACKUP_DIR}/database/redis-${TIMESTAMP}.rdb.gz"

    if [ -f "${REDIS_BACKUP}" ]; then
        log_info "Restoring Redis data..."

        # Stop Redis
        docker-compose -f ${COMPOSE_FILE} stop redis

        # Restore RDB file
        gunzip -c "${REDIS_BACKUP}" > /tmp/dump.rdb
        docker cp /tmp/dump.rdb sgg-redis-prod:/data/dump.rdb
        rm /tmp/dump.rdb

        # Start Redis
        docker-compose -f ${COMPOSE_FILE} start redis

        log_success "Redis data restored"
    else
        log_warning "No Redis backup found for this timestamp, skipping..."
    fi
}

restore_uploads() {
    log_info "Checking for uploads backup..."

    # Extract timestamp from database backup filename
    TIMESTAMP=$(basename "${BACKUP_FILE}" | sed 's/db-\(.*\)\.sql\.gz/\1/')
    UPLOAD_BACKUP="${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz"

    if [ -f "${UPLOAD_BACKUP}" ]; then
        log_warning "Found uploads backup. Do you want to restore it?"
        read -p "Restore uploads? (yes/no): " -r
        echo

        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Restoring uploads..."

            # Backup current uploads
            if [ -d "./uploads" ]; then
                mv ./uploads "./uploads.bak.$(date +%Y%m%d-%H%M%S)"
            fi

            # Extract backup
            tar -xzf "${UPLOAD_BACKUP}"

            log_success "Uploads restored"
        fi
    else
        log_warning "No uploads backup found for this timestamp"
    fi
}

run_migrations() {
    log_info "Running database migrations..."

    docker-compose -f ${COMPOSE_FILE} exec -T api npm run migrate:deploy

    log_success "Migrations completed"
}

start_application() {
    log_info "Starting application..."

    docker-compose -f ${COMPOSE_FILE} up -d api

    # Wait for health check
    log_info "Waiting for application to be healthy..."

    MAX_ATTEMPTS=30
    ATTEMPT=0

    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if docker-compose -f ${COMPOSE_FILE} exec -T api wget -q -O- http://localhost:3000/health > /dev/null 2>&1; then
            log_success "Application is healthy"
            break
        fi

        ATTEMPT=$((ATTEMPT + 1))
        echo -n "."
        sleep 2
    done

    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        log_error "Application failed to become healthy"
        docker-compose -f ${COMPOSE_FILE} logs --tail=50 api
        exit 1
    fi
}

verify_restore() {
    log_info "Verifying restore..."

    # Load environment variables
    export $(grep -v '^#' .env.production | xargs)

    # Check database connection
    docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT 1;" > /dev/null

    # Check table count
    TABLE_COUNT=$(docker-compose -f ${COMPOSE_FILE} exec -T postgres psql -U ${DB_USER} -d ${DB_NAME} -t -c \
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

    log_info "Tables found: ${TABLE_COUNT}"

    if [ "${TABLE_COUNT}" -gt 0 ]; then
        log_success "Restore verified successfully"
    else
        log_error "No tables found in database!"
        exit 1
    fi
}

# ------------------------------------------
# Main Restore Process
# ------------------------------------------
main() {
    log_info "Starting restore process..."
    log_info "================================================"

    validate_backup_file
    confirm_restore
    create_safety_backup
    stop_application
    restore_database
    restore_redis
    restore_uploads
    run_migrations
    start_application
    verify_restore

    log_success "================================================"
    log_success "Restore completed successfully!"
    log_success "Restored from: ${BACKUP_FILE}"
    log_success "Time: $(date)"
    log_success "================================================"
}

# Run main function
main "$@"
