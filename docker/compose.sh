#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

ENVIRONMENT="${1:-development}"
shift || true

COMPOSE_FILE="${SCRIPT_DIR}/${ENVIRONMENT}.compose.yml"
ENV_FILE="${PROJECT_ROOT}/.env.${ENVIRONMENT}"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "Compose file ${COMPOSE_FILE} not found" >&2
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Env file ${ENV_FILE} not found" >&2
  exit 1
fi

cd "${PROJECT_ROOT}"
exec docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" "$@"
