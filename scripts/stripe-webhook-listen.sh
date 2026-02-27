#!/bin/zsh
set -euo pipefail

PROJECT_DIR="/Users/chanshiti/ecommerce-platform"
STRIPE_BIN="/opt/homebrew/bin/stripe"
FORWARD_URL="http://localhost:3000/api/payments/stripe/webhook"

cd "$PROJECT_DIR"

if [[ -f ".env.local" ]]; then
  set -a
  source ".env.local"
  set +a
fi

if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "[stripe-webhook-listen] STRIPE_SECRET_KEY is missing in .env.local" >&2
  exit 1
fi

exec "$STRIPE_BIN" listen \
  --api-key "$STRIPE_SECRET_KEY" \
  --forward-to "$FORWARD_URL"
