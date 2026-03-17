#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"

mkdir -p "$BUILD_DIR"
cmake -S "$SCRIPT_DIR" -B "$BUILD_DIR" \
	-DCMAKE_BUILD_TYPE=Debug \
	-DCMAKE_PREFIX_PATH="${CMAKE_PREFIX_PATH:-/opt/homebrew}"
cmake --build "$BUILD_DIR"