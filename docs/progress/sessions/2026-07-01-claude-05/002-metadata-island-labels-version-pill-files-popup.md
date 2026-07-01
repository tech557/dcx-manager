Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.4.0
Change-Class: source

# Metadata island — lighter labels, version pill, anchored files popup

## Request
PO: on the project metadata island — (1) use less heavy weights for labels, smaller, all in Gilroy
Light; (2) fix the version number so the pill reads `V1` directly, not `VV1`; (3) make the files
popup the same appearance and behavior as the status popup — anchored to the field location, with
the same font tokens across status / dates / files.

## What changed

| File | Change |
|---|---|
| `src/ui/atoms/labels.ts` (new) | `ISLAND_LABEL_CLASS` — one shared header-label token: Gilroy Light, `text-dcx-3xs`, wide tracking. Pinned to `font-[family-name:Gilroy]` because this theme's `font-sans` resolves to Geist (theme.css `@theme inline`), so `font-sans` would NOT give Gilroy. |
| `CampaignDetailsGroup.tsx` | Campaign label → `ISLAND_LABEL_CLASS`. Version rendered in an accent pill; normalizes any leading `v`/`V` so it reads `V1` (never `VV1`). |
| `StatusDropdownBadge.tsx` | Minimalist "Project Status" label → `ISLAND_LABEL_CLASS`. |
| `CommunicationDateField.tsx` | New optional `labelClassName` prop (defaults to `FIELD_LABEL_CLASS` so the editor is unchanged); island passes `ISLAND_LABEL_CLASS` for "Launch Window". |
| `MetadataFilesField.tsx` (new) | Self-contained files field = trigger + **anchored dropdown** mirroring `StatusDropdownBadge` (relative container, motion in/out, outside-mousedown close) + same glass/font tokens. Replaces the old centered modal. |
| `MetadataFilePreviews.tsx` (new) | The floating file-preview windows + minimized pills, split out of the old popup. |
| `MetadataDetailsContent.tsx` | Renders `MetadataFilesField` (gets `attachments` + `filePreview`); date label uses the shared token. |
| `MetadataIsland.tsx` | Passes `attachments`/`filePreview` down; `versionNumber` passed raw (was `v${versionNumber}` → `VV1`); removed the separate modal + files toggle state. |
| `MetadataFilesPopup.tsx` | **Deleted** — replaced by `MetadataFilesField` + `MetadataFilePreviews`. |

## Design notes
- Scope respected: only LABELS were lightened; values (status text, date, counts) and the title keep
  their weight. The version pill uses `font-medium` for legibility (it's data, not a label).
- `§17 Popup ≠ Modal`: the files experience moves from a centered `fixed inset-0` modal to an anchored
  dropdown beside its field — closer to the rule, and matching the status popup.
- Import boundaries: shared token lives in `src/ui/atoms/` so `ui/status`, `ui/forms/date`, and the
  island can all import it (no upward imports).

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS — 0 errors |
| `eslint` (8 changed files) | PASS — 0 warnings |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |
| File-size caps (§6) | PASS — all new/edited files ≤ 191 lines |

## Browser verification (Preview MCP + Playwright, own server on :3000)
- Version pill: `#metadata-version-pill` textContent = **"V1"** (was "VV1"). Rendered as an accent pill.
- Labels: campaign + status labels computed `font-family: Gilroy`, `font-weight: 300`. Screenshot
  confirms lighter, smaller, wide-tracked header labels.
- Files popup: opens as an anchored glass dropdown below its field (right-aligned, in-viewport),
  titled "PROJECT ATTACHMENTS", with light Gilroy section labels — matching the status popup styling.
- Files popup close behavior: verified with a **trusted Playwright outside-click** — menu opens on
  click, closes on outside-click (`filesMenuOpen: false`), same as the status popup. (Preview MCP's
  synthetic events don't reliably drive React handlers — a known harness limitation — so the close
  was confirmed via Playwright, which fires trusted mousedown events.)
- No console errors throughout.
</content>
