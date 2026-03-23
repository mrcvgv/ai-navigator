#!/bin/bash
# Run after creating OAuth apps. Reads from .env.local and pushes to Vercel.
set -e
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "Error: .env.local not found"
  exit 1
fi

source_val() {
  grep "^$1=" .env.local | cut -d= -f2-
}

GOOGLE_ID=$(source_val GOOGLE_CLIENT_ID)
GOOGLE_SECRET=$(source_val GOOGLE_CLIENT_SECRET)
GITHUB_ID=$(source_val GITHUB_CLIENT_ID)
GITHUB_SECRET=$(source_val GITHUB_CLIENT_SECRET)

if [ -z "$GOOGLE_ID" ] || [ -z "$GOOGLE_SECRET" ] || [ -z "$GITHUB_ID" ] || [ -z "$GITHUB_SECRET" ]; then
  echo "Fill in all 4 values in .env.local first, then re-run."
  exit 1
fi

for ENV in production preview development; do
  echo "$GOOGLE_ID"     | vercel env add GOOGLE_CLIENT_ID     "$ENV"
  echo "$GOOGLE_SECRET" | vercel env add GOOGLE_CLIENT_SECRET "$ENV"
  echo "$GITHUB_ID"     | vercel env add GITHUB_CLIENT_ID     "$ENV"
  echo "$GITHUB_SECRET" | vercel env add GITHUB_CLIENT_SECRET "$ENV"
done

echo ""
echo "All 4 OAuth env vars added to Vercel (production + preview + development)."
echo "Trigger a redeploy: vercel --prod"
