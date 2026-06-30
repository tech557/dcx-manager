#!/usr/bin/env python3
"""itemize-source-csv.py — (Re)generate the RS-R5 per-source-item seed dataset.

Writes one record per CSV source item (no range-grouping, core.md §36c), with a per-FAMILY
chain_layer (not a uniform value), to the path RS-R6 consumes directly:
  docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv

Schema (kept stable for RS-R6):
  source_row, source_id, category, status, chain_layer, suggested_node_id, source_path, seed_action

Reproducible / idempotent; counts computed, never hand-typed.
Usage:  python3 scripts/requirements/itemize-source-csv.py
"""
import csv
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(REPO, "dcx-requirements-master.csv")
OUT = os.path.join(REPO, "docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv")
COLS = ["source_row", "source_id", "category", "status", "chain_layer",
        "suggested_node_id", "source_path", "seed_action"]

# Per-family decomposition chain (by ID prefix). Behaviour-bearing families get BHV.
CHAIN_BHV_RSP = {"DM", "BC", "VL", "SBC"}          # REQ -> BHV -> RSP
CHAIN_BHV     = {"RV", "FCS", "KBI", "RDY"}        # REQ -> BHV
# everything else (CR, PR, SC, UP, VR, FI, STG, DZ, IFX, VHB, EVI, SPS, ...) -> REQ -> RSP


def node_for(status: str):
    """(node_type, id_prefix, seed_action) from CSV Status."""
    s = (status or "").strip().lower()
    if "needs decision" in s:
        return ("OpenQuestion", "QST", "Seed as QST- (OpenQuestion; PO decision)")
    if s.startswith("deferred"):
        return ("Intent", "INT", "Seed as INT- (deferred Intent)")
    if s.startswith("proposed"):
        return ("Requirement", "REQ", "Seed as REQ- (confirmation_status: proposed)")
    return ("Requirement", "REQ", "Seed as REQ-")  # Confirmed / default


def chain_for(node_type: str, prefix: str) -> str:
    if node_type == "OpenQuestion":
        return "QST"
    if node_type == "Intent":
        return "INT"
    if prefix in CHAIN_BHV_RSP:
        return "REQ->BHV->RSP"
    if prefix in CHAIN_BHV:
        return "REQ->BHV"
    return "REQ->RSP"


def main() -> int:
    rows = []
    with open(SRC, newline="", encoding="utf-8") as f:
        for i, row in enumerate(csv.DictReader(f)):
            rid = (row.get("ID") or "").strip()
            if not rid:
                continue
            fam = rid.split("-")[0]
            ntype, prefix, seed_action = node_for(row.get("Status"))
            rows.append({
                "source_row": i + 1,  # 1-indexed data row (matches OpenCode's prior numbering)
                "source_id": rid,
                "category": (row.get("Category") or "").strip().replace(",", ";"),
                "status": (row.get("Status") or "").strip(),
                "chain_layer": chain_for(ntype, fam),
                "suggested_node_id": f"{prefix}-{rid}",
                "source_path": "dcx-requirements-master.csv",
                "seed_action": seed_action,
            })

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)

    csv_data_rows = sum(1 for _ in open(SRC, encoding="utf-8")) - 1
    from collections import Counter
    chains = Counter(r["chain_layer"] for r in rows)
    print(f"wrote {os.path.relpath(OUT, REPO)}: {len(rows)} item rows")
    print(f"CSV data rows={csv_data_rows}  itemized rows={len(rows)}  match={csv_data_rows == len(rows)}")
    print(f"chain_layer distribution: {dict(chains)}")
    return 0 if csv_data_rows == len(rows) else 1


if __name__ == "__main__":
    sys.exit(main())
