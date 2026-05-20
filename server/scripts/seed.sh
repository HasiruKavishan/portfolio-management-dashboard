#!/bin/bash

echo "🚀 Starting bulk asset seeding..."

API="http://localhost:5000/api/assets/bulk"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FILE="$SCRIPT_DIR/../data.json"

curl -X POST "$API" \
  -H "Content-Type: application/json" \
  -d @"$FILE"

echo "✅ Seeding completed"