#!/usr/bin/env bash
set -e
VER=$(jq -r .version VERSION.json)
ZIP=focus-timer-pro.zip
rm -f "$ZIP"
mkdir -p dist && rsync -av --exclude='.git' --exclude='dist' --exclude='.github' ./ dist/ >/dev/null
( cd dist && zip -r "../$ZIP" . >/dev/null )

git tag -a "v$VER" -m "Release v$VER"
echo "Tagged v$VER. Push with: git push origin v$VER"
