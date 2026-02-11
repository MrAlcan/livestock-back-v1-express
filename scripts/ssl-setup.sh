#!/bin/bash

# ==========================================
# SSL CERTIFICATE SETUP (Let's Encrypt)
# ==========================================
# Usage: ./scripts/ssl-setup.sh [domain] [email]
# Example: ./scripts/ssl-setup.sh sgg.com admin@sgg.com

set -e  # Exit on error

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
DOMAIN="${1:-sgg.com}"
EMAIL="${2:-admin@${DOMAIN}}"
STAGING="${3:-0}"  # Set to 1 for testing

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

    log_success "Prerequisites check passed"
}

setup_certbot() {
    log_info "Setting up Certbot..."

    mkdir -p ./nginx/ssl
    mkdir -p ./certbot/www

    # Determine staging flag
    STAGING_FLAG=""
    if [ "${STAGING}" = "1" ]; then
        STAGING_FLAG="--staging"
        log_warning "Using Let's Encrypt staging environment (test certificates)"
    fi

    # Request certificate
    docker run --rm \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/certbot/www:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${EMAIL} \
        --agree-tos \
        --no-eff-email \
        ${STAGING_FLAG} \
        -d ${DOMAIN} \
        -d www.${DOMAIN}

    log_success "SSL certificate obtained"
}

setup_auto_renewal() {
    log_info "Setting up auto-renewal..."

    # Create renewal script
    cat > /tmp/certbot-renew.sh <<'EOF'
#!/bin/bash
docker run --rm \
    -v $(pwd)/nginx/ssl:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot renew --quiet

docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
EOF

    chmod +x /tmp/certbot-renew.sh

    # Add to crontab (run twice daily)
    CRON_JOB="0 0,12 * * * cd $(pwd) && /tmp/certbot-renew.sh >> /var/log/certbot-renew.log 2>&1"

    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

    log_success "Auto-renewal configured (runs twice daily)"
}

reload_nginx() {
    log_info "Reloading Nginx configuration..."

    docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

    log_success "Nginx reloaded"
}

verify_ssl() {
    log_info "Verifying SSL certificate..."

    if openssl x509 -in nginx/ssl/live/${DOMAIN}/fullchain.pem -text -noout > /dev/null 2>&1; then
        EXPIRY=$(openssl x509 -in nginx/ssl/live/${DOMAIN}/fullchain.pem -noout -enddate | cut -d= -f2)
        log_success "SSL certificate is valid"
        log_info "Expires: ${EXPIRY}"
    else
        log_error "SSL certificate verification failed"
        exit 1
    fi
}

# ------------------------------------------
# Main Process
# ------------------------------------------
main() {
    log_info "Setting up SSL certificates for ${DOMAIN}"
    log_info "================================================"

    check_prerequisites
    setup_certbot
    setup_auto_renewal
    reload_nginx
    verify_ssl

    log_success "================================================"
    log_success "SSL setup completed successfully!"
    log_success "Domain: ${DOMAIN}"
    log_success "Email: ${EMAIL}"
    log_success "================================================"
    log_info "Test your SSL: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
}

# Run main function
main "$@"
