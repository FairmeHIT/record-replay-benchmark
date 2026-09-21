#!/usr/bin/env bash
set -euo pipefail

cd /Users/fairme/Codes/record-and-replay

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [[ ! -f dist/index.html ]]; then
  npm run build
fi

exec npm run preview -- --port 5173
