# Requirements Graph Store

Canonical typed graph store for the requirements system.

Built by RS-R1 from `docs/plans/active/requirements-system/output/RS-R0b-architecture.md`.

| Path | Purpose |
|---|---|
| `nodes/*.json` | Canonical graph nodes. |
| `trace-links/*.json` | First-class TraceLink records. |
| `ledger/decision-ledger.jsonl` | Append-only decision/sign-off ledger. |
| `proposals/*.json` | Staged mutations; RS-R2 applies after PO sign-off. |
| `views/*` | Generated human views; disposable. |
| `generated/*.json` | Generated low-token agent slices; disposable. |

Run validation:

```bash
npm run req:validate
```
