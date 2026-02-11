#!/bin/bash

# ==========================================
# DATABASE BACKUP SCRIPT
# ==========================================
# Usage: ./scripts/backup.sh [retention_days]
# Example: ./scripts/backup.sh 30

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
BACKUP_DIR="./backups"
RETENTION_DAYS="${1:-30}"
COMPOSE_FILE="docker-compose.prod.yml"
S3_BUCKET="${AWS_S3_BACKUP_BUCKET:-}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

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

create_backup_directory() {
    log_info "Creating backup directory..."

    mkdir -p "${BACKUP_DIR}/database"
    mkdir -p "${BACKUP_DIR}/uploads"
    mkdir -p "${BACKUP_DIR}/configs"

    log_success "Backup directories created"
}

backup_database() {
    log_info "Backing up PostgreSQL database..."

    BACKUP_FILE="${BACKUP_DIR}/database/db-${TIMESTAMP}.sql"

    # Load environment variables
    export $(grep -v '^#' .env.production | xargs)

    # Create database dump
    docker-compose -f ${COMPOSE_FILE} exec -T postgres pg_dump \
        -U ${DB_USER} \
        -d ${DB_NAME} \
        --clean \
        --if-exists \
        --create \
        > "${BACKUP_FILE}"

    # Compress backup
    gzip "${BACKUP_FILE}"

    BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)

    log_success "Database backup created: ${BACKUP_FILE}.gz (${BACKUP_SIZE})"
}

backup_uploads() {
    log_info "Backing up uploaded files..."

    UPLOAD_BACKUP="${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz"

    if [ -d "./uploads" ]; then
        tar -czf "${UPLOAD_BACKUP}" ./uploads

        BACKUP_SIZE=$(du -h "${UPLOAD_BACKUP}" | cut -f1)
        log_success "Uploads backup created: ${UPLOAD_BACKUP} (${BACKUP_SIZE})"
    else
        log_warning "Uploads directory not found, skipping..."
    fi
}

backup_configs() {
    log_info "Backing up configuration files..."

    CONFIG_BACKUP="${BACKUP_DIR}/configs/configs-${TIMESTAMP}.tar.gz"

    tar -czf "${CONFIG_BACKUP}" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='logs' \
        --exclude='uploads' \
        --exclude='backups' \
        .env.production \
        docker-compose.prod.yml \
        nginx/ \
        monitoring/ \
        2>/dev/null || true

    BACKUP_SIZE=$(du -h "${CONFIG_BACKUP}" | cut -f1)
    log_success "Config backup created: ${CONFIG_BACKUP} (${BACKUP_SIZE})"
}

backup_redis() {
    log_info "Backing up Redis data..."

    REDIS_BACKUP="${BACKUP_DIR}/database/redis-${TIMESTAMP}.rdb"

    # Trigger Redis save
    docker-compose -f ${COMPOSE_FILE} exec -T redis redis-cli --no-auth-warning -a ${REDIS_PASSWORD} BGSAVE

    # Wait for save to complete
    sleep 5

    # Copy RDB file
    docker cp sgg-redis-prod:/data/dump.rdb "${REDIS_BACKUP}" 2>/dev/null || true

    if [ -f "${REDIS_BACKUP}" ]; then
        gzip "${REDIS_BACKUP}"
        BACKUP_SIZE=$(du -h "${REDIS_BACKUP}.gz" | cut -f1)
        log_success "Redis backup created: ${REDIS_BACKUP}.gz (${BACKUP_SIZE})"
    else
        log_warning "Redis backup failed or no data to backup"
    fi
}

upload_to_s3() {
    if [ -z "${S3_BUCKET}" ]; then
        log_warning "S3_BUCKET not configured, skipping cloud backup"
        return 0
    fi

    log_info "Uploading backups to S3..."

    if ! command -v aws &> /dev/null; then
        log_warning "AWS CLI not installed, skipping S3 upload"
        return 0
    fi

    # Upload database backup
    aws s3 cp "${BACKUP_DIR}/database/db-${TIMESTAMP}.sql.gz" \
        "s3://${S3_BUCKET}/backups/database/" --quiet

    # Upload uploads backup
    if [ -f "${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz" ]; then
        aws s3 cp "${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz" \
            "s3://${S3_BUCKET}/backups/uploads/" --quiet
    fi

    # Upload config backup
    aws s3 cp "${BACKUP_DIR}/configs/configs-${TIMESTAMP}.tar.gz" \
        "s3://${S3_BUCKET}/backups/configs/" --quiet

    log_success "Backups uploaded to S3"
}

cleanup_old_backups() {
    log_info "Cleaning up backups older than ${RETENTION_DAYS} days..."

    # Delete old local backups
    find "${BACKUP_DIR}" -type f -mtime +${RETENTION_DAYS} -delete

    # Delete old S3 backups
    if [ -n "${S3_BUCKET}" ] && command -v aws &> /dev/null; then
        CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d)

        aws s3 ls "s3://${S3_BUCKET}/backups/" --recursive | \
        while read -r line; do
            BACKUP_DATE=$(echo $line | awk '{print $1}')
            BACKUP_FILE=$(echo $line | awk '{print $4}')

            if [[ "${BACKUP_DATE}" < "${CUTOFF_DATE}" ]]; then
                aws s3 rm "s3://${S3_BUCKET}/${BACKUP_FILE}" --quiet
            fi
        done
    fi

    log_success "Old backups cleaned up"
}

verify_backups() {
    log_info "Verifying backup integrity..."

    # Verify database backup
    DB_BACKUP="${BACKUP_DIR}/database/db-${TIMESTAMP}.sql.gz"
    if [ -f "${DB_BACKUP}" ]; then
        if gunzip -t "${DB_BACKUP}" 2>/dev/null; then
            log_success "Database backup verified"
        else
            log_error "Database backup is corrupted!"
            exit 1
        fi
    fi

    # Verify uploads backup
    UPLOAD_BACKUP="${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz"
    if [ -f "${UPLOAD_BACKUP}" ]; then
        if tar -tzf "${UPLOAD_BACKUP}" > /dev/null 2>&1; then
            log_success "Uploads backup verified"
        else
            log_error "Uploads backup is corrupted!"
            exit 1
        fi
    fi

    log_success "All backups verified"
}

generate_manifest() {
    log_info "Generating backup manifest..."

    MANIFEST="${BACKUP_DIR}/manifest-${TIMESTAMP}.txt"

    cat > "${MANIFEST}" <<EOF
# Backup Manifest
# Generated: $(date)
# Retention: ${RETENTION_DAYS} days

## Database Backup
$(ls -lh ${BACKUP_DIR}/database/db-${TIMESTAMP}.sql.gz 2>/dev/null || echo "N/A")

## Redis Backup
$(ls -lh ${BACKUP_DIR}/database/redis-${TIMESTAMP}.rdb.gz 2>/dev/null || echo "N/A")

## Uploads Backup
$(ls -lh ${BACKUP_DIR}/uploads/uploads-${TIMESTAMP}.tar.gz 2>/dev/null || echo "N/A")

## Configs Backup
$(ls -lh ${BACKUP_DIR}/configs/configs-${TIMESTAMP}.tar.gz 2>/dev/null || echo "N/A")

## Environment
DATABASE: ${DB_NAME}
HOST: $(hostname)
TIMESTAMP: ${TIMESTAMP}
EOF

    log_success "Manifest created: ${MANIFEST}"
}

# ------------------------------------------
# Main Backup Process
# ------------------------------------------
main() {
    log_info "Starting backup process..."
    log_info "================================================"

    create_backup_directory
    backup_database
    backup_redis
    backup_uploads
    backup_configs
    verify_backups
    generate_manifest
    upload_to_s3
    cleanup_old_backups

    log_success "================================================"
    log_success "Backup completed successfully!"
    log_success "Timestamp: ${TIMESTAMP}"
    log_success "Location: ${BACKUP_DIR}"
    log_success "================================================"
}

# Run main function
main "$@"
