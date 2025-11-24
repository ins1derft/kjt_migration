#!/usr/bin/env bash
set -euo pipefail
ENVIRONMENT="${1:-development}"
./docker/compose.sh "$ENVIRONMENT" run --rm backend-php php artisan migrate --force
