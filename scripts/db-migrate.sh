#!/usr/bin/env bash
set -euo pipefail
ENVIRONMENT="${1:-development}"
./docker/compose.sh "$ENVIRONMENT" exec backend-php php artisan migrate --force
