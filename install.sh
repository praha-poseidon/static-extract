#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${STATIC_EXTRACT_JAVA_BIN_DIR:-${JAVA_STATIC_EXTRACT_BIN_DIR:-$HOME/.local/bin}}"
INSTALL_CLI=1
INSTALL_SKILLS=1
MVN_CMD=""

usage() {
  cat <<'USAGE'
Usage: ./install.sh [options]

Options:
  --bin-dir DIR       Install the static-extract-java command into DIR.
  --no-cli            Do not build or install the CLI command.
  --no-skills         Do not install Codex/Claude skills.
  -h, --help          Show this help.

Environment:
  STATIC_EXTRACT_JAVA_BIN_DIR      Default Java runtime CLI install directory.
  JAVA_STATIC_EXTRACT_BIN_DIR      Legacy alias for the CLI install directory.
  CODEX_SKILLS_DIR                 Default: ~/.codex/skills
  CLAUDE_SKILLS_DIR                Default: ~/.claude/skills
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bin-dir)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --bin-dir" >&2
        usage >&2
        exit 2
      fi
      BIN_DIR="$2"
      shift 2
      ;;
    --no-cli)
      INSTALL_CLI=0
      shift
      ;;
    --no-skills)
      INSTALL_SKILLS=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

die() {
  echo "ERROR: $*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

detect_maven() {
  if [[ -x "$ROOT_DIR/mvnw" ]]; then
    MVN_CMD="$ROOT_DIR/mvnw"
    return
  fi
  if command_exists mvn; then
    MVN_CMD="mvn"
    return
  fi
  die "Maven was not found. Install Maven, add it to PATH, or add a Maven wrapper as ./mvnw."
}

java_major_version() {
  local version
  version="$("$1" -version 2>&1 | sed -n 's/.*version "\([^"]*\)".*/\1/p' | head -n 1)"
  if [[ -z "$version" ]]; then
    return 1
  fi
  if [[ "$version" == 1.* ]]; then
    echo "$version" | cut -d. -f2
  else
    echo "$version" | cut -d. -f1
  fi
}

check_cli_prerequisites() {
  command_exists java || die "Java was not found. Install JDK 21 and make sure java is on PATH."
  command_exists javac || die "javac was not found. Install a full JDK 21, not only a JRE."
  detect_maven

  local major
  major="$(java_major_version javac || true)"
  if [[ -z "$major" || "$major" -lt 21 ]]; then
    die "JDK 21 or newer is required. Current javac version is: $(javac -version 2>&1)"
  fi
}

install_cli() {
  check_cli_prerequisites
  echo "Building static-extract Java runtime CLI..."
  (cd "$ROOT_DIR" && "$MVN_CMD" -pl static-extract-runtime-java-cli -am package)

  local source_bin="$ROOT_DIR/static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java"
  if [[ ! -x "$source_bin" ]]; then
    echo "CLI script was not generated: $source_bin" >&2
    exit 1
  fi

  mkdir -p "$BIN_DIR"
  if ! ln -sfn "$source_bin" "$BIN_DIR/static-extract-java" 2>/dev/null; then
    echo "Symlink failed. Copying the command script instead..."
    cp "$source_bin" "$BIN_DIR/static-extract-java"
    chmod +x "$BIN_DIR/static-extract-java"
  fi
  echo "Installed command: $BIN_DIR/static-extract-java"
}

install_skill_dir() {
  local target_root="$1"
  local source_dir="$ROOT_DIR/skills/static-extract-java"
  local target_dir="$target_root/static-extract-java"

  if [[ ! -d "$source_dir" ]]; then
    die "Skill source directory was not found: $source_dir"
  fi
  mkdir -p "$target_root"
  rm -rf "$target_dir"
  cp -R "$source_dir" "$target_dir"
  echo "Installed skill: $target_dir"
}

install_skills() {
  local codex_dir="${CODEX_SKILLS_DIR:-$HOME/.codex/skills}"
  local claude_dir="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

  install_skill_dir "$codex_dir"
  install_skill_dir "$claude_dir"
}

if [[ "$INSTALL_CLI" -eq 1 ]]; then
  install_cli
fi

if [[ "$INSTALL_SKILLS" -eq 1 ]]; then
  install_skills
fi

cat <<EOF

Done.

Try:
  static-extract-java --help

If the command is not found, add this to your shell profile:
  export PATH="$BIN_DIR:\$PATH"
EOF
