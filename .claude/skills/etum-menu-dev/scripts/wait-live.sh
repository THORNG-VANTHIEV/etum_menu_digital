#!/usr/bin/env bash
# Wait until the live GitHub Pages build contains a marker string (polls the site, not the rate-limited API).
# Usage: wait-live.sh '<string only the new build contains>' [baseUrl] [timeoutSeconds]
set -u
marker="$1"
base="${2:-https://thorng-vanthiev.github.io/etum_menu_digital}"
timeout="${3:-600}"
deadline=$(( $(date +%s) + timeout ))
while [ "$(date +%s)" -lt "$deadline" ]; do
  page=$(curl -s "$base/?t=$RANDOM")
  for asset in $(echo "$page" | grep -oE 'assets/index-[^"]+\.(js|css)'); do
    if curl -s "$base/$asset" | grep -qF -- "$marker"; then
      echo "live: $asset contains the marker"
      exit 0
    fi
  done
  sleep 15
done
echo "timed out after ${timeout}s; live assets: $(echo "$page" | grep -oE 'assets/index-[^"]+' | tr '\n' ' ')" >&2
exit 1
