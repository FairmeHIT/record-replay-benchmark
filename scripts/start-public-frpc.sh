#!/usr/bin/env bash
set -euo pipefail

FRPC_BIN="/opt/homebrew/Cellar/frpc/0.71.0/bin/frpc"
BIFROST_FRPC_CONFIG="/Users/fairme/frpc-bifrost.toml"
GENERATED_CONFIG="/private/tmp/frpc-record-replay.toml"

TOKEN="$(awk -F '"' '/auth\.token/ { print $2; exit }' "$BIFROST_FRPC_CONFIG")"
SERVER_ADDR="$(awk -F '"' '/serverAddr/ { print $2; exit }' "$BIFROST_FRPC_CONFIG")"

if [[ -z "$TOKEN" || -z "$SERVER_ADDR" ]]; then
  echo "Missing frp auth token or serverAddr in $BIFROST_FRPC_CONFIG" >&2
  exit 1
fi

cat > "$GENERATED_CONFIG" <<EOF
serverAddr = "$SERVER_ADDR"
serverPort = 7000
auth.token = "$TOKEN"

[[proxies]]
name = "record-replay-demo-9876"
type = "tcp"
localIP = "127.0.0.1"
localPort = 5173
remotePort = 9876
EOF

exec "$FRPC_BIN" -c "$GENERATED_CONFIG"
