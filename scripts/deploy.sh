#!/bin/bash

# ==========================================
# PRODUCTION DEPLOYMENT SCRIPT
# ==========================================
# Usage: ./scripts/deploy.sh [version]
# Example: ./scripts/deploy.sh v1.2.3

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
APP_NAME="sgg-api"
DOCKER_IMAGE="${APP_NAME}:latest"
VERSION="${1:-latest}"
BACKUP_DIR="./backups"
COMPOSE_FILE="docker-compose.prod.yml"

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

check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi

    if [ ! -f ".env.production" ]; then
        log_error ".env.production file not found"
        exit 1
    fi

    if [ ! -f "${COMPOSE_FILE}" ]; then
        log_error "${COMPOSE_FILE} not found"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

create_backup() {
    log_info "Creating database backup..."

    mkdir -p "${BACKUP_DIR}"

    BACKUP_FILE="${BACKUP_DIR}/db-backup-$(date +%Y%m%d-%H%M%S).sql"

    docker-compose -f ${COMPOSE_FILE} exec -T postgres pg_dump \
        -U ${DB_USER} ${DB_NAME} > "${BACKUP_FILE}"

    if [ -f "${BACKUP_FILE}" ]; then
        gzip "${BACKUP_FILE}"
        log_success "Backup created: ${BACKUP_FILE}.gz"
    else
        log_error "Backup failed"
        exit 1
    fi
}

build_image() {
    log_info "Building Docker image..."

    docker build -t ${DOCKER_IMAGE} -t ${APP_NAME}:${VERSION} .

    log_success "Docker image built successfully"
}

run_database_migrations() {
    log_info "Running database migrations..."

    docker-compose -f ${COMPOSE_FILE} exec -T api npm run migrate:deploy

    log_success "Database migrations completed"
}

deploy_application() {
    log_info "Deploying application..."

    # Pull latest images (if using registry)
    # docker-compose -f ${COMPOSE_FILE} pull

    # Stop and remove old containers
    docker-compose -f ${COMPOSE_FILE} down

    # Start new containers
    docker-compose -f ${COMPOSE_FILE} up -d

    log_success "Application deployed"
}

wait_for_health() {
    log_info "Waiting for application to be healthy..."

    MAX_ATTEMPTS=30
    ATTEMPT=0

    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if docker-compose -f ${COMPOSE_FILE} exec -T api wget -q -O- http://localhost:3000/health > /dev/null 2>&1; then
            log_success "Application is healthy"
            return 0
        fi

        ATTEMPT=$((ATTEMPT + 1))
        echo -n "."
        sleep 2
    done

    log_error "Application failed to become healthy"
    return 1
}

verify_deployment() {
    log_info "Verifying deployment..."

    # Check if containers are running
    if ! docker-compose -f ${COMPOSE_FILE} ps | grep -q "Up"; then
        log_error "Some containers are not running"
        docker-compose -f ${COMPOSE_FILE} ps
        exit 1
    fi

    # Check health endpoint
    if ! wait_for_health; then
        log_error "Health check failed"
        docker-compose -f ${COMPOSE_FILE} logs --tail=50 api
        exit 1
    fi

    log_success "Deployment verified successfully"
}

cleanup_old_images() {
    log_info "Cleaning up old Docker images..."

    docker image prune -f

    log_success "Cleanup completed"
}

rollback() {
    log_error "Deployment failed! Rolling back..."

    # Restore from latest backup
    LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/db-backup-*.sql.gz | head -1)

    if [ -f "${LATEST_BACKUP}" ]; then
        log_info "Restoring from backup: ${LATEST_BACKUP}"
        gunzip -c "${LATEST_BACKUP}" | docker-compose -f ${COMPOSE_FILE} exec -T postgres \
            psql -U ${DB_USER} -d ${DB_NAME}
    fi

    # Restart previous containers
    docker-compose -f ${COMPOSE_FILE} up -d

    log_error "Rollback completed"
    exit 1
}

# ------------------------------------------
# Main Deployment Process
# ------------------------------------------
main() {
    log_info "Starting deployment of ${APP_NAME} version ${VERSION}"
    log_info "================================================"

    # Set trap for errors
    trap rollback ERR

    # Load environment variables
    export $(grep -v '^#' .env.production | xargs)

    # Execute deployment steps
    check_prerequisites
    create_backup
    build_image
    deploy_application
    run_database_migrations
    verify_deployment
    cleanup_old_images

    log_success "================================================"
    log_success "Deployment completed successfully!"
    log_success "Version: ${VERSION}"
    log_success "Time: $(date)"
    log_success "================================================"
}

# Run main function
main "$@"
