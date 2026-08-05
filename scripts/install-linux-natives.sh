#!/usr/bin/env bash
# Installs the Linux x64 (glibc) native bindings that the Coolify builder's npm
# fails to install due to npm/cli#4828. Safe to re-run; only used during deploy.
set -euo pipefail

install_pkg() {
  local name="$1" version="$2" dest="$3"
  local base="${name##*/}" # strip scope for the tarball filename
  echo "installing ${name}@${version} -> ${dest}"
  rm -rf "$dest"
  mkdir -p "$dest"
  curl -fsSL "https://registry.npmjs.org/${name}/-/${base}-${version}.tgz" \
    | tar -xz -C "$dest" --strip-components=1
}

# Versions must match package-lock.json
install_pkg "@rolldown/binding-linux-x64-gnu" "1.2.1" "node_modules/@rolldown/binding-linux-x64-gnu"
install_pkg "@tailwindcss/oxide-linux-x64-gnu" "4.3.3" "node_modules/@tailwindcss/oxide-linux-x64-gnu"
install_pkg "lightningcss-linux-x64-gnu" "1.33.0" "node_modules/lightningcss-linux-x64-gnu"
# @tailwindcss/node pins its own nested lightningcss@1.32.0
install_pkg "lightningcss-linux-x64-gnu" "1.32.0" "node_modules/@tailwindcss/node/node_modules/lightningcss-linux-x64-gnu"

echo "native bindings installed:"
ls node_modules/@rolldown/binding-linux-x64-gnu \
   node_modules/@tailwindcss/oxide-linux-x64-gnu \
   node_modules/lightningcss-linux-x64-gnu \
   node_modules/@tailwindcss/node/node_modules/lightningcss-linux-x64-gnu
