#!/usr/bin/env bash
# gen-manifest.sh — Generate docs/references/codebase-manifest.md
# Manual annotations are preserved between `# MANUAL:` and the end of the file.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST_FILE="${PROJECT_DIR}/docs/references/codebase-manifest.md"
SRC_DIR="${PROJECT_DIR}/src"

echo "=== Codebase Manifest Generator ==="
echo "Source: $SRC_DIR"
echo "Output: $MANIFEST_FILE"

# Extract manual block from existing manifest (if any)
MANUAL_BLOCK=""
if [ -f "$MANIFEST_FILE" ]; then
  MANUAL_BLOCK=$(awk '/^# MANUAL:/{found=1} found{print}' "$MANIFEST_FILE" 2>/dev/null || true)
fi

# Build output
OUTPUT=""
GENDATE=$(date +%Y-%m-%d)

OUTPUT+="# Codebase Manifest"
OUTPUT+=$'\n\n'
OUTPUT+="_Auto-generated: ${GENDATE} | Regenerate: bash scripts/gen-manifest.sh_"
OUTPUT+=$'\n\n'

# --- Overview table ---
OUTPUT+="## src/ — Overview"
OUTPUT+=$'\n\n'
OUTPUT+="| Directory | Files | Lines (TS/TSX) | Purpose |"
OUTPUT+=$'\n'
OUTPUT+="|---|---|---|---|"
OUTPUT+=$'\n'

for dir in "$SRC_DIR"/*/; do
  name=$(basename "$dir")
  file_count=$(find "$dir" -type f ! -name '.gitkeep' 2>/dev/null | wc -l | tr -d ' ')
  ts_lines=0
  if find "$dir" -name '*.ts' -o -name '*.tsx' 2>/dev/null | grep -q .; then
    ts_lines=$(find "$dir" -name '*.ts' -o -name '*.tsx' 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
    [ -z "$ts_lines" ] && ts_lines=0
  fi
  purpose=""
  case "$name" in
    actions) purpose="Domain-action functions (create, update, move, delete) for phases/actions/tasks/nodes" ;;
    brand)   purpose="Theme config, design tokens, global CSS, font files" ;;
    builder) purpose="Core builder workspace: page shell, stage, islands, cards, drag-drop, focus, import" ;;
    components) purpose="Reusable UI components: forms, buttons, modals, feedback indicators" ;;
    hooks)   purpose="App-wide React hooks: autosave, permissions, preferences, theme" ;;
    mock)    purpose="Mock data for channels, compositions, subtask definitions" ;;
    pages)   purpose="Top-level route pages: RootLayout, HomePage, VersionPage" ;;
    queries) purpose="TanStack Query hooks for builder, channels, subtask-defs, users, versions" ;;
    rules)   purpose="Business-rule pure functions: readiness, date, permissions, validation" ;;
    services) purpose="API client abstraction, mappers, and per-domain service modules" ;;
    store)   purpose="Zustand stores: appStore (global), builderStore (builder state)" ;;
    telemetry) purpose="Event-name constants and opt-in check" ;;
    types)   purpose="Domain model types, API DTOs, builder-node types, card types" ;;
    ui)      purpose="Low-level UI primitives: backgrounds, dividers, badges, motion, glass surfaces" ;;
    utils)   purpose="Pure utility functions: node helpers, date helpers, composition helpers" ;;
    *)       purpose="—" ;;
  esac
  OUTPUT+="$name | $file_count | $ts_lines | $purpose"
  OUTPUT+=$'\n'
done

# --- Builder sub-directories ---
OUTPUT+=$'\n'
OUTPUT+="### Builder Sub-Directories (\`src/builder/\`)"
OUTPUT+=$'\n\n'
OUTPUT+="| Sub-directory | Files | Lines (TS/TSX) | Purpose |"
OUTPUT+=$'\n'
OUTPUT+="|---|---|---|---|"
OUTPUT+=$'\n'

for dir in "$SRC_DIR/builder"/*/; do
  name=$(basename "$dir")
  file_count=$(find "$dir" -type f ! -name '.gitkeep' 2>/dev/null | wc -l | tr -d ' ')
  ts_lines=0
  if find "$dir" -name '*.ts' -o -name '*.tsx' 2>/dev/null | grep -q .; then
    ts_lines=$(find "$dir" -name '*.ts' -o -name '*.tsx' 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
    [ -z "$ts_lines" ] && ts_lines=0
  fi
  purpose=""
  case "$name" in
    cards)   purpose="Card shell, drag helpers, registry, and card templates (Phase/Action/Task/Day)" ;;
    islands) purpose="All builder islands (EditorViewer, Metadata, Focus, Selection, Kanban, etc.)" ;;
    stage)   purpose="Stage core, provider, layout, views (Kanban/Timeline/Weekly/Monthly/Matrix)" ;;
    dropzones) purpose="Drop-target components and registry" ;;
    focus)   purpose="Focus engine and useFocus hook" ;;
    import)  purpose="Import helpers and useImport hook" ;;
    *)       purpose="—" ;;
  esac
  OUTPUT+="$name | $file_count | $ts_lines | $purpose"
  OUTPUT+=$'\n'
done

# --- Key exports helper ---
export_exports_section() {
  local dir="$1"
  local dir_path="$SRC_DIR/$dir"
  if [ ! -d "$dir_path" ]; then return; fi

  echo ""
  echo "### \`src/$dir\`"
  echo ""
  echo "| File | Key exports |"
  echo "|---|---|"

  while IFS= read -r file; do
    fname=$(basename "$file")
    exports=$(grep "^export" "$file" 2>/dev/null | sed 's/export //' | sed 's/{[^}]*}//g' | head -5 | tr '\n' ', ' | sed 's/,$//')
    [ -z "$exports" ] && exports="—"
    exports=$(echo "$exports" | sed 's/|/\\|/g')
    echo "\`$fname\` | $exports"
  done < <(find "$dir_path" -maxdepth 1 -name '*.ts' -o -name '*.tsx' 2>/dev/null | sort)
}

OUTPUT+=$'\n'
OUTPUT+="## Key Exports by Directory"
OUTPUT+=$'\n'

for d in actions "builder/cards" "builder/stage" hooks rules services types ui; do
  OUTPUT+=$(export_exports_section "$d")
  OUTPUT+=$'\n'
done

# Islands section
OUTPUT+="### \`src/builder/islands/\`"
OUTPUT+=$'\n\n'
OUTPUT+="| Island / File | Key exports |"
OUTPUT+=$'\n'
OUTPUT+="|---|---|"
OUTPUT+=$'\n'

while IFS= read -r file; do
  fname=$(basename "$file")
  exports=$(grep "^export" "$file" 2>/dev/null | sed 's/export //' | sed 's/{[^}]*}//g' | head -3 | tr '\n' ', ' | sed 's/,$//')
  [ -z "$exports" ] && exports="—"
  exports=$(echo "$exports" | sed 's/|/\\|/g')
  OUTPUT+="\`$fname\` | $exports"
  OUTPUT+=$'\n'
done < <(find "$SRC_DIR/builder/islands" -maxdepth 2 \( -name '*.ts' -o -name '*.tsx' \) ! -path '*/node_modules/*' 2>/dev/null | sort)

# --- Write manifest ---
{
  printf '%s' "$OUTPUT"
  echo ""
  echo ""
  echo "# MANUAL:"
  echo "# Add or edit annotations below this line. They are preserved across regeneration."
  echo "# Do not edit anything above this line — it is auto-generated."
  if [ -n "$MANUAL_BLOCK" ]; then
    echo "$MANUAL_BLOCK" | tail -n +4
  else
    echo ""
    echo "## Manual Annotations"
    echo ""
    echo "### actions/"
    echo "- All mutations go through useBuilderActions() — never call setNodes from cards/islands/stage"
    echo "- action.guards.ts enforces permission checks before mutations"
    echo ""
    echo "### builder/cards/"
    echo "- Card templates never import from src/rules/ — use useCardBehavior()"
    echo "- Card templates never import from src/services/"
    echo "- card.registry.ts is the extension point for new card types"
    echo ""
    echo "### builder/islands/"
    echo "- EditorViewerIsland pushes stage (stage narrows when editor opens)"
    echo "- FocusIsland filters visibility — does not move anything"
    echo "- SelectionIsland bounded by maxWidth: 420px"
    echo "- ViewHelperIsland uses position: fixed for overflow"
    echo ""
    echo "### builder/stage/"
    echo "- StageProvider is stage-level state only — island state must not live in stage context"
    echo "- stage.registry.ts maps ViewKind -> renderer"
    echo "- StageCore is the single render entry point"
    echo ""
    echo "### hooks/"
    echo "- useAutosave calls domainPhasesToApi() mapper — do not regress"
    echo ""
    echo "### rules/"
    echo "- readiness.rules.ts is the single source of readiness — never compute readiness in UI"
    echo ""
    echo "### services/"
    echo "- api-mappers.ts is the mandatory mapping layer — never pass domain types to services with as any"
    echo ""
    echo "### types/"
    echo "- Never create src/types.ts — import from src/types/index.ts"
    echo ""
    echo "### ui/"
    echo "- effects.registry.ts is the only animation entry point — never create parallel animation systems"
  fi
} > "$MANIFEST_FILE"

echo ""
echo "=== Manifest written to $MANIFEST_FILE ==="
echo "Lines: $(wc -l < "$MANIFEST_FILE")"
