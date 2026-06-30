#!/usr/bin/env bash
set -euo pipefail

VERSION_FILE="docs/VERSION.md"

usage() {
  echo "Usage: $0 {patch|minor}"
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

COMMAND="$1"

if [ "$COMMAND" != "patch" ] && [ "$COMMAND" != "minor" ]; then
  usage
fi

# Extract current version from VERSION.md
CURRENT=$(grep '^| current' "$VERSION_FILE" | sed 's/.*| `\(v[0-9]*\.[0-9]*\.[0-9]*\)` .*/\1/')

if [ -z "$CURRENT" ]; then
  echo "Error: could not parse current version from $VERSION_FILE"
  exit 1
fi

echo "Current version: $CURRENT"

# Parse semver
BASE="${CURRENT#v}"
MAJOR="${BASE%%.*}"
REST="${BASE#*.}"
MINOR="${REST%%.*}"
PATCH="${REST#*.}"

if [ "$COMMAND" = "patch" ]; then
  NEW_PATCH=$((PATCH + 1))
  NEW="v${MAJOR}.${MINOR}.${NEW_PATCH}"
  echo "Bumping patch: $CURRENT -> $NEW"

  # Update VERSION.md
  sed -i '' "s/| current .*/| current | \`${NEW}\` |/" "$VERSION_FILE"
  sed -i '' "s/| previous_minor .*/| previous_minor | \`${CURRENT}\` (archived when minor was bumped) |/" "$VERSION_FILE"

  echo "Updated $VERSION_FILE to $NEW"
fi

if [ "$COMMAND" = "minor" ]; then
  NEW_MINOR=$((MINOR + 1))
  NEW="v${MAJOR}.${NEW_MINOR}.0"
  echo "Bumping minor: $CURRENT -> $NEW"

  # Run archive script first
  echo "Running archive-version.sh for $CURRENT -> $NEW ..."
  bash scripts/archive-version.sh "$CURRENT" "$NEW"

  # Update VERSION.md
  sed -i '' "s/| current .*/| current | \`${NEW}\` |/" "$VERSION_FILE"
  sed -i '' "s/| previous_minor .*/| previous_minor | \`${CURRENT}\` (archived: docs\/archive\/v${MAJOR}.${MINOR}\/) |/" "$VERSION_FILE"
  # Reset next_planned
  NEXT_MINOR=$((NEW_MINOR + 1))
  sed -i '' "s/| next_planned .*/| next_planned | \`v${MAJOR}.${NEXT_MINOR}.0\` |/" "$VERSION_FILE"

  echo "Updated $VERSION_FILE to $NEW"
fi

echo "Done."
