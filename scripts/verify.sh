#!/bin/bash

# ==========================================
# CONFIGURATION VERIFICATION SCRIPT
# ==========================================
# Usage: ./scripts/verify.sh [environment]
# Example: ./scripts/verify.sh development

set -e

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
ENVIRONMENT="${1:-development}"
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# ------------------------------------------
# Functions
# ------------------------------------------
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

# ------------------------------------------
# Verification Functions
# ------------------------------------------
verify_files() {
    print_header "Verifying Configuration Files"

    local files=(
        "Dockerfile"
        "docker-compose.yml"
        "docker-compose.prod.yml"
        ".env.example"
        ".dockerignore"
        "package.json"
        "tsconfig.json"
    )

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            log_success "$file exists"
        else
            log_error "$file missing"
            return 1
        fi
    done

    return 0
}

verify_environment() {
    print_header "Verifying Environment Configuration"

    if [ "$ENVIRONMENT" = "production" ]; then
        if [ -f ".env.production" ]; then
            log_success ".env.production exists"
        else
            log_error ".env.production missing"
            return 1
        fi
    else
        if [ -f ".env.development" ]; then
            log_success ".env.development exists"
        else
            log_warning ".env.development missing (using .env.example)"
        fi
    fi

    return 0
}

verify_docker() {
    print_header "Verifying Docker Configuration"

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        return 1
    fi
    log_success "Docker installed: $(docker --version)"

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed"
        return 1
    fi
    log_success "Docker Compose installed"

    # Validate docker-compose.yml
    if docker compose -f ${COMPOSE_FILE} config > /dev/null 2>&1; then
        log_success "Docker Compose configuration is valid"
    else
        log_error "Docker Compose configuration has errors"
        return 1
    fi

    return 0
}

verify_monitoring() {
    print_header "Verifying Monitoring Configuration"

    local monitoring_files=(
        "monitoring/prometheus/prometheus.yml"
        "monitoring/prometheus/alerts.yml"
        "monitoring/grafana/datasources/prometheus.yml"
        "monitoring/grafana/datasources/loki.yml"
        "monitoring/loki/loki-config.yml"
        "monitoring/promtail/promtail-config.yml"
        "monitoring/alertmanager/alertmanager.yml"
    )

    for file in "${monitoring_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "$file exists"
        else
            log_error "$file missing"
            return 1
        fi
    done

    return 0
}

verify_scripts() {
    print_header "Verifying Deployment Scripts"

    local scripts=(
        "scripts/deploy.sh"
        "scripts/backup.sh"
        "scripts/restore.sh"
        "scripts/ssl-setup.sh"
    )

    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                log_success "$script exists and is executable"
            else
                log_warning "$script exists but is not executable"
                chmod +x "$script"
                log_success "Made $script executable"
            fi
        else
            log_error "$script missing"
            return 1
        fi
    done

    return 0
}

verify_nginx() {
    print_header "Verifying Nginx Configuration"

    if [ -f "nginx/nginx.conf" ]; then
        log_success "nginx.conf exists"

        # Check for required directives
        if grep -q "upstream api_backend" nginx/nginx.conf; then
            log_success "Upstream configuration found"
        else
            log_warning "Upstream configuration not found"
        fi

        if grep -q "ssl_certificate" nginx/nginx.conf; then
            log_success "SSL configuration found"
        else
            log_warning "SSL configuration not found"
        fi
    else
        log_error "nginx.conf missing"
        return 1
    fi

    return 0
}

verify_github_actions() {
    print_header "Verifying GitHub Actions Workflows"

    local workflows=(
        ".github/workflows/ci.yml"
        ".github/workflows/cd.yml"
        ".github/workflows/monitoring.yml"
    )

    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            log_success "$workflow exists"
        else
            log_error "$workflow missing"
            return 1
        fi
    done

    return 0
}

verify_build() {
    print_header "Testing Docker Build"

    log_info "Building Docker image (this may take a few minutes)..."

    if docker build -t sgg-api:test . > /tmp/docker-build.log 2>&1; then
        log_success "Docker image built successfully"

        # Check image size
        SIZE=$(docker images sgg-api:test --format "{{.Size}}")
        log_info "Image size: $SIZE"

        # Cleanup
        docker rmi sgg-api:test > /dev/null 2>&1 || true

        return 0
    else
        log_error "Docker build failed"
        log_error "Check /tmp/docker-build.log for details"
        return 1
    fi
}

verify_security() {
    print_header "Security Checks"

    # Check for sensitive files
    if [ -f ".env.production" ]; then
        PERMS=$(stat -c "%a" .env.production)
        if [ "$PERMS" = "600" ]; then
            log_success ".env.production has correct permissions (600)"
        else
            log_warning ".env.production permissions are $PERMS (should be 600)"
            chmod 600 .env.production
            log_success "Fixed .env.production permissions"
        fi
    fi

    # Check .gitignore
    if grep -q ".env.production" .gitignore 2>/dev/null; then
        log_success ".env.production is in .gitignore"
    else
        log_warning ".env.production not in .gitignore"
    fi

    # Check for exposed secrets
    if grep -r "password.*=.*[a-zA-Z0-9]" .env.* 2>/dev/null | grep -v ".example" | grep -v ".env.development"; then
        log_warning "Possible hardcoded passwords found in environment files"
    else
        log_success "No obvious hardcoded passwords found"
    fi

    return 0
}

generate_report() {
    print_header "Verification Summary"

    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Date: $(date)"
    echo "User: $(whoami)"
    echo "Host: $(hostname)"
    echo ""

    if [ $TOTAL_ERRORS -eq 0 ]; then
        log_success "All checks passed! ✓"
        echo ""
        log_info "Next steps:"
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "  1. Review .env.production configuration"
            echo "  2. Setup SSL certificates: ./scripts/ssl-setup.sh"
            echo "  3. Deploy application: ./scripts/deploy.sh"
        else
            echo "  1. Start development environment: docker compose up -d"
            echo "  2. Run migrations: docker compose exec api npm run migrate:dev"
            echo "  3. Access API: http://localhost:3000"
        fi
    else
        log_error "Found $TOTAL_ERRORS error(s)"
        echo ""
        log_info "Please fix the errors and run verification again"
        return 1
    fi
}

# ------------------------------------------
# Main Verification Process
# ------------------------------------------
main() {
    log_info "Starting verification for $ENVIRONMENT environment..."
    echo ""

    TOTAL_ERRORS=0

    # Run all verifications
    verify_files || ((TOTAL_ERRORS++))
    verify_environment || ((TOTAL_ERRORS++))
    verify_docker || ((TOTAL_ERRORS++))
    verify_monitoring || ((TOTAL_ERRORS++))
    verify_scripts || ((TOTAL_ERRORS++))
    verify_nginx || ((TOTAL_ERRORS++))
    verify_github_actions || ((TOTAL_ERRORS++))
    verify_security || ((TOTAL_ERRORS++))

    # Optional: Build test (can be slow)
    if [ "${2}" = "--with-build" ]; then
        verify_build || ((TOTAL_ERRORS++))
    fi

    # Generate report
    generate_report

    if [ $TOTAL_ERRORS -gt 0 ]; then
        exit 1
    fi
}

# Run main function
main "$@"
