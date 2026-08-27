#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

if command -v npm >/dev/null 2>&1; then
  npm run build
elif command -v pnpm >/dev/null 2>&1; then
  pnpm run build
else
  echo "npm or pnpm is required to build the package." >&2
  exit 1
fi

required_files=(
  "out/index.html"
  "out/privacy-policy/index.html"
  "out/personal-data-consent/index.html"
  "out/cookie-policy/index.html"
  "out/robots.txt"
  "out/sitemap.xml"
  "out/api/lead.php"
)

for required_file in "${required_files[@]}"; do
  if [[ ! -f "$required_file" ]]; then
    echo "Required build file is missing: $required_file" >&2
    exit 1
  fi
done

mkdir -p artifacts
archive="artifacts/remontvariator-beget.zip"
rm -f "$archive"

(
  cd out
  zip -qr "../$archive" .
)

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$archive"
else
  shasum -a 256 "$archive"
fi
