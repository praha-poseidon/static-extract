#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${1:-}"

if [[ -z "$VERSION" ]]; then
  VERSION="$(sed -n '0,/<version>\([^<]*\)<\/version>/s//\1/p' "$ROOT_DIR/pom.xml")"
fi
if [[ -z "$VERSION" ]]; then
  echo "ERROR: Could not determine project version." >&2
  exit 1
fi

DIST_DIR="$ROOT_DIR/dist"
WORK_DIR="$ROOT_DIR/target/release"
PACKAGE_NAME="static-extract-$VERSION"
PACKAGE_DIR="$WORK_DIR/$PACKAGE_NAME"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

command_exists zip || {
  echo "ERROR: zip command was not found." >&2
  exit 1
}

echo "Building Java CLI distribution..."
(cd "$ROOT_DIR" && mvn -B -pl java/cli -am package)

echo "Installing TS runtime dependencies..."
(cd "$ROOT_DIR/ts/runtime" && npm ci)

echo "Assembling release package: $PACKAGE_NAME"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/bin" "$PACKAGE_DIR/runtime-ts" "$DIST_DIR"

cp -R "$ROOT_DIR/java/cli/target/appassembler/bin/." "$PACKAGE_DIR/bin/"
cp -R "$ROOT_DIR/java/cli/target/appassembler/repo" "$PACKAGE_DIR/repo"
cp -R "$ROOT_DIR/ts/runtime/bin" "$PACKAGE_DIR/runtime-ts/"
cp -R "$ROOT_DIR/ts/runtime/src" "$PACKAGE_DIR/runtime-ts/"
cp -R "$ROOT_DIR/ts/runtime/rules" "$PACKAGE_DIR/runtime-ts/"
cp -R "$ROOT_DIR/ts/runtime/node_modules" "$PACKAGE_DIR/runtime-ts/"
cp "$ROOT_DIR/ts/runtime/package.json" "$PACKAGE_DIR/runtime-ts/"
cp "$ROOT_DIR/ts/runtime/package-lock.json" "$PACKAGE_DIR/runtime-ts/"
cp -R "$ROOT_DIR/skills" "$PACKAGE_DIR/skills"
cp -R "$ROOT_DIR/spec" "$PACKAGE_DIR/spec"
cp "$ROOT_DIR/README.md" "$ROOT_DIR/LICENSE" "$PACKAGE_DIR/"
cp "$ROOT_DIR/packaging/install.sh" "$PACKAGE_DIR/install.sh"

cat > "$PACKAGE_DIR/bin/static-extract-ts" <<'EOF'
#!/usr/bin/env sh
PRG="$0"
while [ -h "$PRG" ]; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`/"$link"
  fi
done
PRGDIR=`dirname "$PRG"`
BASEDIR=`cd "$PRGDIR/.." >/dev/null; pwd`
exec node "$BASEDIR/runtime-ts/bin/static-extract-ts.mjs" "$@"
EOF

chmod +x "$PACKAGE_DIR/install.sh" \
  "$PACKAGE_DIR/bin/static-extract-java" \
  "$PACKAGE_DIR/bin/static-extract-ts" \
  "$PACKAGE_DIR/runtime-ts/bin/static-extract-ts.mjs" \
  "$PACKAGE_DIR/skills/ser-author/scripts/generate_ser.mjs" \
  "$PACKAGE_DIR/skills/ser-author/scripts/run_static_extract.mjs"

rm -f "$DIST_DIR/static-extract.zip" "$DIST_DIR/$PACKAGE_NAME.zip"
(cd "$WORK_DIR" && zip -qr "$DIST_DIR/$PACKAGE_NAME.zip" "$PACKAGE_NAME")
cp "$DIST_DIR/$PACKAGE_NAME.zip" "$DIST_DIR/static-extract.zip"

echo "Created:"
echo "  $DIST_DIR/$PACKAGE_NAME.zip"
echo "  $DIST_DIR/static-extract.zip"
