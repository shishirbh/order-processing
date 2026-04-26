# SOP Refresh — Global Changelog

This file accumulates one entry per `sop-refresh` (Mode B) run. Each entry is a
summary; per-row detail lives in the corresponding `bulk_changes/<csv>.changelog.md`.
Newest entries go at the top. Do not edit by hand — the `sop-refresh` skill
appends here automatically.

---

## 2026-04-26 — `26April2026_ffedback_elina.csv`

- **Source CSV:** `bulk_changes/26April2026_ffedback_elina.csv`
- **Reviewer(s):** Elina
- **Rows:** 24 total — 8 applied, 3 flagged for human review (full rewrite), 2 applied (actionable) + flagged (discussion), 8 skipped (already Completed), 1 skipped (no vendor folder — ERP), 2 skipped (no change required — CRL, FHC)
- **Vendors touched (applied):** TopNotch, Cal-Royal, D&D Technologies, Jeske, ACE - Emery Jensen (Main Warehouse + Other Warehouses), Home Depot - US lock - HD Supply, Lavi Industries, MSC Direct, Hardware Resources
- **Vendors flagged for full rewrite/discussion:** STRUCTURE GLASS SOLUTIONS (row 3), Aria Vetri (row 8), Imperial Dade (row 10)
- **Vendors with mixed apply + discussion flag:** IML Security Supply (row 2 — in-house clarity), Lavi Industries (row 4 — in-house ordering section missing), Hardware Resources (row 11 — dropship routing logic)
- **Skipped — no vendor folder:** ERP (row 13 — internal system, not a supplier)
- **Per-CSV detail:** [`bulk_changes/26April2026_ffedback_elina.changelog.md`](bulk_changes/26April2026_ffedback_elina.changelog.md)

---
