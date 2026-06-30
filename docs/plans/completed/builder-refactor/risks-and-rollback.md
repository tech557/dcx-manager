# Builder Refactor — Risks and Rollback

## Rollback principle

Every sprint is a bounded git commit. If gates fail after a sprint, revert only that sprint's commits. Prior sprints are unaffected.

## Risk table

| Risk | Sprint | Likelihood | Mitigation |
|---|---|---|---|
| StageProvider re-renders after B0 | B0 | Low | Verify Focus Island and editor column immediately after |
| B-FIL migration regressions | B-FIL | Medium | Extract hook (B-FIL.1) first, verify, then do UI tasks |
| B-CRD breaks existing click behaviour | B-CRD | Medium | Test Phase/Action/Task click before and after |
| B5 multi-session breaks single editor | B5 | Medium | Rollback = revert useEditorPanel.ts only |
| B6 presentation mode corrupts expanded state | B6 | Medium | usePresentationMode.ts isolated — revert that file |
| B8 View Context interferes with Day drag | B8 | Medium | Test day card drag after B8 |
| Gemini edits out-of-scope files | Every Gemini sprint | High | Include "Preserve-Semantic Boundaries" explicitly; check consumer list |
| Agent silently decides open question | Any | Medium | All ❓ items have explicit temporary defaults; progress log must note them |

## Critical preserve-semantic boundaries

These must not change semantically during any sprint. Controlled additions allowed.

- `readiness.rules.ts` — never compute readiness in UI
- `actions/` — never call setNodes from UI components
- `api-mappers.ts` — never skip the mapping layer
- `brand/tokens.ts` — never hardcode colours elsewhere
- `ui/motion/effects.registry.ts` — never create parallel animation systems
