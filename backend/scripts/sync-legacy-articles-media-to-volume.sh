#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/backend/storage/app/public"

if [[ ! -d "$PUBLIC_DIR/articles" ]]; then
  echo "Expected directory not found: $PUBLIC_DIR/articles" >&2
  exit 1
fi

echo "Syncing legacy articles media into Docker storage volume..."

tar -C "$PUBLIC_DIR" -cf - articles seo \
  | "$ROOT_DIR/docker/compose.sh" development exec -T backend-php sh -lc \
    'mkdir -p /var/www/backend/storage/app/public && tar -C /var/www/backend/storage/app/public -xf -'

echo "Done."

