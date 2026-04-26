---
name: sop-refresh
description: Updates an existing SOP by merging a baseline document with change notes. Produces a difference summary table and a clean revised SOP with timestamped changes. Use when refreshing, revising, or rolling changes into an SOP or process document. Also handles bulk feedback delivered as a CSV in bulk_changes/ — picks the newest file, applies each row to the right vendor's Process Document, writes a per-CSV detail changelog, and appends a one-line summary to the global SOP-Refresh-Changelog.md at the root so every batch is traceable in one place.
---

# sop-refresh

Merge change notes into a baseline SOP and produce an audit-ready revision. Two modes:

- **Mode A — Single SOP.** User gives a baseline (file path or pasted text) plus change notes. Output is a difference summary table and a clean revised SOP. (This is the original sop-refresh contract — unchanged.)
- **Mode B — Bulk CSV from `bulk_changes/`.** User says "apply the latest feedback CSV" / "process the bulk changes" / "run sop-refresh on the new csv from Elina." Skill picks the newest CSV in `bulk_changes/`, applies each row to the matching vendor's Process Document, and appends a per-CSV changelog so the batch is auditable.

If the user just says "refresh this SOP" with a file or pasted text, you're in Mode A. If they reference the CSV / Elina's feedback / `bulk_changes/`, you're in Mode B.

## What this skill is for

SOPs at DK Hardware Supply (e.g. `_shared_sops/Sales - NET 30 SOP.md`, vendor Process Documents) get updated whenever a rule changes — a new approval step, a revised fee, a dropped vendor option. The risk: staff merging the change inconsistently, leaving the old rule somewhere, or rewriting more than they should. This skill forces a disciplined merge — show exactly what changed, update only what needs updating, tag changes with today's date, and output a clean final that operations can use immediately.

Bulk vendor feedback (Elina's reviews, etc.) arrives as a CSV in `bulk_changes/`. The CSV-driven mode lets you process a whole batch in one pass without losing the discipline of the single-SOP merge: every row still goes through the same difference-table + surgical-edit + date-tag pipeline, and every row's outcome (applied / skipped / flagged) lands in two places — a per-CSV detail changelog (`bulk_changes/<csv>.changelog.md`) for the row-by-row trail, and a single global changelog at the root (`SOP-Refresh-Changelog.md`) that accumulates one summary entry per run across every CSV ever processed.

## Inputs you need from the user

### Mode A — Single SOP

1. **Baseline SOP** — the existing document. Can be:
   - A file path (e.g. `_shared_sops/Sales - NET 30 SOP.md` or `Vendors/Deltana/Deltana Process Document.md`). Read it.
   - Raw pasted text in the user's message.
2. **Changes / updates** — the new rules, corrections, or notes. Usually raw text in the user's message, sometimes a separate file.

If either is missing, ask once. Don't proceed guessing what the changes are.

### Mode B — Bulk CSV

1. **Which CSV to process.** Default: the newest file in `order-processing/bulk_changes/` by modification time. Always tell the user which CSV you picked and ask for confirmation before applying:

   > I'll process `bulk_changes/26April2026_ffedback_elina.csv` (last modified 2026-04-26, 24 rows from Elina). Proceed?

   If they want a different file, take the path they give you instead. If `bulk_changes/` has no CSVs, stop and say so.

## Mode A output contract (single SOP)

The output must be exactly two sections, in this order.

### SECTION 1 — Difference Summary Table

```markdown
## Difference Summary

| Area | Old Rule | New Rule | Impact |
|------|----------|----------|--------|
| ... | ... | ... | ... |
```

One row per meaningful change. "Area" is the section or topic (e.g. "Approval flow", "Core item fees", "Dropship eligibility"). "Impact" is one short phrase on who feels the change (e.g. "CS must now wait for manager approval", "Fees increased $5 on core items").

### SECTION 2 — Final Updated SOP

The full clean SOP with changes merged in. See "Rules" below.

---

## Rules for the merge

### Preserve structure
- Keep every original section heading and its order **exactly** as in the baseline.
- Do NOT reorganize, renumber, or rename sections unless the change explicitly demands it.
- Do NOT remove sections unless a change explicitly invalidates them.

### Apply changes surgically
- Replace only the lines that are now incorrect or outdated.
- Leave correct existing content untouched.
- Integrate new rules into the section where they logically belong. Only create a new section if no existing section fits.

### Tag every change
- Every updated or newly added line ends with `(Updated: <YYYY-MM-DD>)` using today's date.
- Removed / invalidated content does NOT appear in the final SOP — the difference table is where the removal is documented, not the body.

### Clean final output
- Audit-ready. No inline commentary like "this changed because...". No "(was: X, now: Y)" markers in the body. Only the final correct version.
- Zero duplicates — if a new rule supersedes an old one in two places, the old one goes from both.
- Zero contradictions — read the final SOP from top to bottom and verify no two rules conflict.

### Style
- Direct, instruction-first voice: "Submit the PO on Thursday" beats "You should submit the PO on Thursday".
- Prioritize operational clarity over theory. If an ambiguity existed in the baseline that the changes can resolve, resolve it.
- Keep language tight enough for a junior CS rep to follow without asking for help.

### Addition discipline
- If the updates introduce a brand-new concept (pickup windows, batching, approvals, etc.), integrate it into the most-related existing section first. Only add a new section when there is genuinely no home for it.

---

## Mode B — Bulk CSV processing

Use this mode when the user references the CSV / `bulk_changes/` folder / batch feedback. The same merge rules from Mode A apply per row — preserve structure, surgical edits, tag with `(Updated: YYYY-MM-DD)`. The only differences are: input is a CSV row instead of a pasted-in change blob, target file is always `Vendors/<Vendor>/<Vendor> Process Document.md`, and every row's outcome appends to a per-CSV changelog.

### Step B1 — Pick the CSV

1. List `order-processing/bulk_changes/*.csv`. Pick the file with the most recent mtime.
2. Confirm with the user before proceeding (show the filename, mtime, and row count).
3. Read the CSV. Try encodings in this order: `utf-8-sig`, `utf-8`, `cp1252`, `latin-1`. The Windows export from Excel is usually `cp1252`.

### Step B2 — Validate columns

Expected columns: `S No`, `Vendor`, `Changes Requested By`, `Changes Requested`, `Completed`. If the columns differ, stop and report the mismatch — don't guess at which column is which.

### Step B3 — Iterate rows

For each row, in CSV order:

1. **Skip if `Completed` is `Yes`.** Already applied. Note it in the changelog as "skipped — already marked Completed".
2. **Resolve the vendor.** Use the same alias resolution as `vendor-lookup`:
   - Exact match against `Vendors/<folder>/` (case-insensitive).
   - Sub-brand / alias match via `Vendor Information.md` and each Vendor Info's `Aliases / sub-brands` section.
   - Common informal-name mappings seen in past CSVs: `Top-Notch` → `Vendors/TopNotch/`, `Structure Glass` → `Vendors/STRUCTURE GLASS SOLUTIONS/`, `Lavi Industries` → `Vendors/LAVI/`, `Emery Jensen` → `Vendors/ACE - Emery Jensen/`, `HD Supply` → `Vendors/Home Depot - US lock - HD Supply/`, `National Oak` → `Vendors/National oak/`.
   - Some CSV rows are NOT vendors (e.g. `ERP` is an internal system). If no folder match and no alias match, log "no vendor folder found — skipped, please review" in the changelog and move on.
   - If ambiguous (multiple plausible candidates), stop and ask the user which one before applying.
3. **Pick the target file.** Always `Vendors/<Vendor>/<Vendor> Process Document.md`. Even if Elina's note is about contacts or claims, route it to the Process Document for now and flag in the changelog ("note: this looks like contact info; consider moving to Vendor Info.md after merge"). Keeps the per-row routing deterministic; the human reviewer can reroute later.
4. **Classify the row.** The `Changes Requested` cell is one of:
   - **Actionable edit** — concrete corrections or new rules (e.g. "Order value < $500 will already be processed in-house, so the dropship branch is unnecessary"). → Apply via the Mode A merge rules.
   - **No-op acknowledgement** — e.g. "All good", "looks fine", or just whitespace. → Don't touch the file. Log "no change required per reviewer".
   - **Discussion request** — e.g. "We need to discuss this", "needs to be completely rewritten", "Most of the logic is incorrect". → **Stop and ask the user how to proceed for this row.** Options to offer: (a) skip and log for human follow-up, (b) apply the reviewer's text verbatim under a `## Notes from <reviewer> (<date>)` section, (c) draft a rewrite together now. Do not silently merge a discussion request as if it were an edit.
   - **Mixed** — actionable + discussion. → Apply the actionable parts; ask about the discussion parts.
5. **Apply the edit (when actionable).** Read the current `<Vendor> Process Document.md`. Run the standard Mode A merge against it: identify which sections the change touches, edit only those lines, append `(Updated: YYYY-MM-DD)` to each touched line, update the "Last updated" line at the top (or add one if missing). Most per-vendor Process Documents are stubs marked `_(to be filled)_` — when that's the case, replace the stubbed section with the new content rather than appending under it.
6. **Append to the changelog.** See Step B4.

### Step B4 — Per-CSV changelog

For every CSV processed, write/append to a sibling file:

```
order-processing/bulk_changes/<csv_basename>.changelog.md
```

So `26April2026_ffedback_elina.csv` produces `26April2026_ffedback_elina.changelog.md` in the same folder. The file accumulates across runs of the same CSV (so re-running after fixes adds new entries rather than overwriting). Each row processed appends a section like:

```markdown
### Row 1 — Top-Notch — applied
- **Run at:** 2026-04-26 14:32 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/TopNotch/TopNotch Process Document.md`
- **Status:** applied
- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Order value < $500 | Listed as a dropship-blocking rule | Removed — under-$500 orders are already routed in-house upstream | CS no longer sees a redundant gate |
  | Marketplace orders (Amazon/Walmart/eBay/Wayfair) | "Do NOT dropship — always in-house" | Marketplace dropship is allowed | Removes false restriction; matches actual policy |

- **Notes:** —
```

Status values:
- `applied` — actionable edit, merged into the Process Document.
- `skipped — no change required` — reviewer wrote "All good" or similar.
- `skipped — already marked Completed` — `Completed = Yes` in the CSV.
- `skipped — no vendor folder` — vendor name didn't resolve (e.g. "ERP").
- `flagged for human review` — discussion request that the user chose to defer.
- `applied verbatim under Notes section` — discussion request that the user chose to dump under a Notes block.

Top of the changelog (only on first creation) gets this header:

```markdown
# Changelog for <csv_basename>.csv

Source CSV: `bulk_changes/<csv_basename>.csv`
Reviewer(s): <unique values from "Changes Requested By">
This file accumulates one entry per row processed. Re-running the skill on the
same CSV appends new entries rather than overwriting — the file is the audit
trail for the batch.

---
```

If the changelog file already exists, just append the new row sections; do NOT rewrite the header.

### Step B5 — Global root changelog

After all rows in the CSV have been processed (Steps B3 + B4 done), append a single rollup entry to the global changelog at:

```
order-processing/SOP-Refresh-Changelog.md
```

This file is the one-stop history of every Mode B run, ever — across every CSV — so a reviewer can scan it top-to-bottom and see what's changed without opening each per-CSV file. The per-CSV changelog from Step B4 keeps the row-level detail; this global file keeps the run-level summary.

If the file does not exist yet, create it with this header (only on first creation):

```markdown
# SOP Refresh — Global Changelog

This file accumulates one entry per `sop-refresh` (Mode B) run. Each entry is a
summary; per-row detail lives in the corresponding `bulk_changes/<csv>.changelog.md`.
Newest entries go at the top. Do not edit by hand — the `sop-refresh` skill
appends here automatically.

---
```

Then prepend (newest entry on top, just under the `---` separator) a new entry shaped like:

```markdown
## 2026-04-26 14:32 — `26April2026_ffedback_elina.csv`

- **Source CSV:** `bulk_changes/26April2026_ffedback_elina.csv`
- **Reviewer(s):** Elina
- **Rows:** 24 total — 14 applied, 6 flagged for human review, 2 already Completed, 1 no-vendor-match, 1 no-change-required
- **Vendors touched (applied):** TopNotch, Cal-Royal, MSC Direct, D&D Technologies, Aria Vetri, Jeske, Imperial Dade, Hardware Resources, ACE - Emery Jensen, Hager, Amerock, Richelieu, Pool Corp, US Horizon
- **Vendors flagged for review:** STRUCTURE GLASS SOLUTIONS (row 3), LAVI (row 4), Glass Warehouse (row 21), Southern Lock (row 22), CRL (row 23), FHC (row 24)
- **Skipped — no vendor folder:** ERP (row 13)
- **Per-CSV detail:** [`bulk_changes/26April2026_ffedback_elina.changelog.md`](bulk_changes/26April2026_ffedback_elina.changelog.md)

---
```

Rules for the global entry:

1. **One entry per run, prepended at the top** (newest first). Multiple runs of the same CSV produce multiple entries — that's intentional: each run's outcome is its own audit record.
2. **Use the run's actual numbers**, not a template — counts and vendor names come from what you actually processed in this run.
3. **Always link to the per-CSV detail file** so a reader can drill in.
4. **Never edit older entries.** Append-only history. If a previous run's summary turns out to be wrong, log a correction in the next run's entry — don't rewrite the past.
5. **Keep each entry tight.** This file is for scanning, not deep reading. Vendor lists rather than per-row narratives.

### Step B6 — Final summary to the user

After all rows are processed AND both changelogs are written, give a one-screen summary:

> Processed `bulk_changes/26April2026_ffedback_elina.csv` (24 rows).
> - Applied: 14
> - Flagged for human review: 6 (rows 3, 5, 14, 18, 21, 24)
> - Skipped — already Completed: 2
> - Skipped — no vendor folder: 1 (row 13: "ERP")
> - Skipped — no change required: 1 (row 2: "All good")
>
> Per-row detail: `bulk_changes/26April2026_ffedback_elina.changelog.md`
> Run-level history (all CSVs, newest first): `SOP-Refresh-Changelog.md`
> Reminder: the master `Vendor Information.md` rollup isn't affected by Process Document edits, so no `regenerate-vendor-rollup` is needed.

Also remind the user to flip `Completed` to `Yes` in the CSV for the rows that landed cleanly, so the next run of this skill skips them.

## Anti-patterns to avoid

1. **Do not rewrite sections that didn't change.** The goal is minimum surgical delta, not a fresh draft.
2. **Do not emit the final SOP without the difference table first.** The table is how the user verifies the merge before trusting the body.
3. **Do not put `(Updated: date)` on unchanged lines.** The tag means "this line was touched in this revision" — if it's everywhere, it's meaningless.
4. **Do not invent context.** If the changes say "approval now required for refunds > $500" and the baseline is silent on refunds, integrate the new rule plainly — don't backfill assumptions about the old rule.
5. **Do not leave both the old rule and the new rule in the SOP.** Pick the new rule only. The old rule lives in the difference table's "Old Rule" column.
6. **Do not modify the baseline file in place** (Mode A). The output is a new revision — the user decides when to replace the old file. Write to a sibling file like `<original>.v2.md` or present the new content for their review, but do not overwrite the existing file without explicit confirmation.
7. **Do not silently skip a row in Mode B.** Every CSV row gets exactly one entry in the per-CSV changelog, even if the entry is "skipped — already Completed". A row that vanishes from the changelog looks like a data-loss bug.
8. **Do not auto-merge a discussion request in Mode B.** "We need to discuss this" or "rewrite from scratch" means stop and ask. Treating it as an actionable edit produces a fake-confident SOP that the reviewer will have to roll back.
9. **Do not modify the source CSV.** Even after applying every row, leave the CSV alone. The reviewer flips `Completed` to `Yes` themselves so they own the sign-off.
10. **Do not edit older entries in `SOP-Refresh-Changelog.md`.** It's append-only history. If a previous run's summary was wrong, note the correction in the next run's entry — don't rewrite the past, or the audit trail becomes worthless.

## Examples

### Mode A — Example 1: small change to a vendor process

**User:**

> Update `Vendors/Deltana/Deltana Process Document.md` — Elizabeth changed her hours. She's now only reachable Mon–Thu 9am–4pm ET. Also, all RMA requests now need to go through Elina first, not to Elizabeth directly.

**Expected output:**

```markdown
## Difference Summary

| Area | Old Rule | New Rule | Impact |
|------|----------|----------|--------|
| Primary contact availability | Elizabeth reachable business hours | Elizabeth reachable Mon–Thu 9am–4pm ET | CS must not email Elizabeth Fri or outside the window |
| RMA routing | RMAs sent directly to Elizabeth | RMAs routed through Elina first | Adds one internal hop; prevents vendor escalation until DK reviews |

## Final Updated SOP

# Deltana Process Document
...
## Contacts
- Elizabeth Markowitz — Mon–Thu 9am–4pm ET (Updated: 2026-04-24)
- Elizabeth@deltana.net
- 800-665-2226

## RMAs
All RMA requests must go through Elina before contacting the vendor (Updated: 2026-04-24).
...
(rest of SOP unchanged)
```

### Mode A — Example 2: changes that span multiple sections

If the change is "We're dropping NET 30 for all new customers — new customers must prepay until they've been active for 90 days," the table has one row, but the final SOP updates every section that referenced NET 30 eligibility (intro, approval flow, escalation). Tag each touched line with `(Updated: <date>)`; leave unrelated sections untouched.

### Mode A — Example 3: ambiguous change

**User:** "Fees changed."

**You:** "Which fees — the core item restocking fee, the expedited-shipping surcharge, or something else? And what's the new amount?" Then proceed once the answer is clear. Never guess.

### Mode B — Example 4: bulk CSV from Elina

**User:** "apply elina's latest feedback csv"

Flow:

1. List `bulk_changes/*.csv`. Newest by mtime is `26April2026_ffedback_elina.csv`. Confirm:

   > I'll process `bulk_changes/26April2026_ffedback_elina.csv` (last modified 2026-04-26, 24 rows from Elina). Proceed?

2. After confirmation, read the CSV (encoding: `cp1252`). Validate columns.
3. Process each row in order. For example:
   - **Row 1 — Top-Notch.** Resolve "Top-Notch" → `Vendors/TopNotch/`. Read `TopNotch Process Document.md`. The reviewer's note has two clear actionable corrections (under-$500 routing is redundant; marketplace dropship is allowed). Apply both via the Mode A merge logic. Append a "Row 1 — applied" entry to `bulk_changes/26April2026_ffedback_elina.changelog.md`.
   - **Row 2 — IML Security Supply.** Reviewer wrote "All good / except not clear on what how are we ordering in house". The "All good" is a no-op; the second line is a discussion request. **Stop and ask:**

     > Row 2 (IML Security Supply, Elina): Elina says "all good" but flags ambiguity about in-house ordering. Want me to (a) skip and log for human follow-up, (b) drop her note under a `## Notes from Elina (2026-04-26)` section in the Process Document, or (c) draft a clarifying paragraph together?

     Take her direction, then log accordingly.
   - **Row 3 — Structure Glass.** Reviewer wrote "Structure Glass needs to be completely rewritten / We need to discuss this". This is purely a discussion request. **Stop and ask** before doing anything; default option is "skip and log for human follow-up". Do NOT silently rewrite.
4. After all 24 rows are processed, append the run-level summary to the global `SOP-Refresh-Changelog.md` at the root (Step B5), then give the user the screen summary (Step B6). The user can re-run the skill later after fixing the flagged rows; the per-CSV file will accumulate new row entries, and the global changelog will get a fresh dated entry on top.

### Mode B — Example 5: vendor name doesn't resolve

CSV row: `13, ERP, Elina, "we should integrate the ERP into the order flow", Pending`

- Resolve "ERP" → no folder match, no alias match in `Vendor Information.md`.
- Don't pick a wrong vendor. Don't create a new folder.
- Log to changelog: `Row 13 — ERP — skipped (no vendor folder; "ERP" is internal, not a supplier)`.
- Continue with the next row.

### Mode B — Example 6: row already Completed

CSV row: `7, Cal-Royal, Elina, "...", Yes`

- `Completed = Yes` means a previous run already handled this. Don't touch the file.
- Log to changelog: `Row 7 — Cal-Royal — skipped (already marked Completed in source CSV)`.
