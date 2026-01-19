#!/usr/bin/env bash
# Create WebP versions of JPG/JPEG images in assets/.
# Portable for older bash (avoids mapfile).
# Usage:
#   ./create-webp-assets.sh            # convert assets/slider-*.jpg -> .webp (quality 80)
#   ./create-webp-assets.sh --all      # convert all .jpg/.jpeg in assets/
#   ./create-webp-assets.sh --small 800 --quality 75 --force
#
# Requires: cwebp (libwebp). Install:
#  - macOS (Homebrew): brew install webp
#  - Ubuntu/Debian: sudo apt install webp

set -euo pipefail

CONVERT_ALL=false
SMALL_WIDTH=0
QUALITY=80
FORCE=false

usage() {
  cat <<EOF
Usage: $0 [--all] [--small WIDTH] [--quality N] [--force]

Examples:
  $0
  $0 --small 800
  $0 --all --quality 75 --force
EOF
  exit 1
}

# Parse args
while [ "$#" -gt 0 ]; do
  case "$1" in
    --all) CONVERT_ALL=true; shift ;;
    --small) SMALL_WIDTH="$2"; shift 2 ;;
    --quality) QUALITY="$2"; shift 2 ;;
    --force) FORCE=true; shift ;;
    --help|-h) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

if ! command -v cwebp >/dev/null 2>&1; then
  cat >&2 <<'ERR'
Error: cwebp not found. Install libwebp tools first.

macOS (Homebrew):
  brew install webp

Ubuntu/Debian:
  sudo apt update && sudo apt install webp

Windows:
  Download WebP binaries and add to PATH:
  https://developers.google.com/speed/webp/download

ERR
  exit 2
fi

ASSETS_DIR="assets"
mkdir -p "$ASSETS_DIR"

# Build find command depending on mode
if [ "$CONVERT_ALL" = true ]; then
  FIND_PATTERN=( -iname '*.jpg' -o -iname '*.jpeg' )
else
  FIND_PATTERN=( -iname 'slider-*.jpg' -o -iname 'slider-*.jpeg' )
fi

# Use find -print0 and a while read loop to handle spaces
found_any=false
find "$ASSETS_DIR" -type f \( "${FIND_PATTERN[@]}" \) -print0 | while IFS= read -r -d '' src; do
  found_any=true
  base="$(basename "$src")"
  name="${base%.*}"                # e.g. slider-2
  out="$ASSETS_DIR/$name.webp"

  if [ -f "$out" ] && [ "$FORCE" != "true" ]; then
    echo "Skipping (exists): $out"
  else
    printf 'Creating %s ... ' "$out"
    if cwebp -q "$QUALITY" "$src" -o "$out" >/dev/null 2>&1; then
      echo "OK"
    else
      echo "FAILED"
      continue
    fi
  fi

  if [ "$SMALL_WIDTH" -gt 0 ]; then
    out_small="$ASSETS_DIR/${name}-small.webp"
    if [ -f "$out_small" ] && [ "$FORCE" != "true" ]; then
      echo "Skipping (exists): $out_small"
    else
      printf 'Creating %s (width %spx) ... ' "$out_small" "$SMALL_WIDTH"
      if cwebp -q "$QUALITY" -resize "$SMALL_WIDTH" 0 "$src" -o "$out_small" >/dev/null 2>&1; then
        echo "OK"
      else
        echo "FAILED"
        continue
      fi
    fi
  fi
done

# The 'found_any' flag is inside the subshell created by the pipe; re-run a check to show summary
count=$(find "$ASSETS_DIR" -maxdepth 1 -type f \( "${FIND_PATTERN[@]}" \) | wc -l | tr -d ' ')
if [ "$count" -eq 0 ]; then
  echo "No matching JPG/JPEG files found in $ASSETS_DIR"
else
  echo "Done. Converted $count source file(s)."
  echo "Remember to: git add $ASSETS_DIR/*.webp && git commit -m 'Add WebP images' && git push"
fi

exit 0