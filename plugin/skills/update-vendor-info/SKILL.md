---
name: update-vendor-info
description: Updates one or more fields for an existing vendor in the order_processing knowledge base. Use when the user wants to change a phone, email, contact, dropship rule, or similar field. Resolves sub-brands (Pemco, US Lock). Also handles bulk feedback delivered as a CSV in bulk_changes/ — picks the newest file, applies vendor-info changes from each row to the right vendor's Vendor Info.md, writes a per-CSV detail changelog, and appends a one-line summary to the global Vendor-Info-Update-Changelog.md at the root so every batch is traceable in one place. Do not use for new vendors.
---

# update-vendor-info

Make a surgical edit to an existing vendor's `Vendor Info.md`, timestamp the change, keep everything else untouched. Two modes:

- **Mode A — Single vendor update.** User names a specific vendor and a specific change (phone, email, dropship policy, alias, etc.). Find the right file, change the right line, timestamp it, report back. (This is the original update-vendor-info contract — unchanged.)
- **Mode B — Bulk CSV from `bulk_changes/`.** User says "apply the latest feedback CSV" / "process the bulk changes" / "run update-vendor-info on the new csv from Elina." Skill picks the newest CSV in `bulk_changes/`, scans each row for vendor-info-related changes (phone, email, address, dropship policy, etc.), applies them to the matching vendor's `Vendor Info.md`, and appends a per-CSV changelog so the batch is auditable.

If the user just says "update Hafele's phone" or "add Pemko as an alias," you're in Mode A. If they reference the CSV / Elina's feedback / `bulk_changes/`, you're in Mode B.

## What this skill is for

Vendor data drifts: reps change, phones update, dropship policies evolve. When someone tells you "Hafele's phone is now 954-218-0294" or "Pemco no longer ships expedited," the job is to find the right file, change the right line, timestamp it, and not accidentally touch anything else. This is different from `add-new-vendor` (new supplier, new folder) and different from `sop-refresh` (SOP document, multi-line changes, difference-summary format).

Bulk vendor feedback (Elina's reviews, etc.) arrives as a CSV in `bulk_changes/`. Some rows contain vendor-info corrections — address changes, rep updates, dropship policy reversals — mixed in with the SOP-level feedback. The CSV-driven mode lets you extract just the vendor-info changes from a batch and apply them surgically, without touching the Process Documents (that's `sop-refresh` Mode B's job). Every row's outcome lands in two places — the shared per-CSV detail changelog (`bulk_changes/<csv>.changelog.md`) alongside the `sop-refresh` entries, and a separate global changelog at the root (`Vendor-Info-Update-Changelog.md`) that accumulates one summary entry per run.

## Mode A — Single vendor update

### Step 1 — Resolve the vendor

Same rules as `vendor-lookup`. Per-vendor folders live inside `order_processing/Vendors/`:

1. Exact folder match first (case-insensitive) inside `Vendors/`. Slashes in the canonical name become ` - ` in folder names (`Assa Abloy/Pemco/Rockwood` → `Vendors/Assa Abloy - Pemco - Rockwood/`).
2. Sub-brand / alias match via the `Aliases / sub-brands` section of each Vendor Info file or the master table.
3. If ambiguous, list 2–4 candidates and ask. Do not guess which vendor the user meant — editing the wrong vendor is a silent data-corruption bug that's hard to catch later.

### Step 2 — Identify which field(s) to change

The user's message tells you. Map their phrasing to a field in the Vendor Info template:

- "phone," "phone number" → `**Phone:**`
- "email," "contact email," "their address" → `**Email / contact info:**`
- "rep," "contact," "who to talk to" → `**Primary contact:**`
- "can we reach them?" / "can sales contact?" → `**Can CS contact vendor directly?**` / `**Can Sales contact vendor?**`
- "point of contact," "DK contact," "escalation" (when "not" they can be reached) → `**If not, DK point of contact:**`
- "dropship" → `**Can we dropship?**`
- "ships under our account / their account" → `**Ships under our account?**`
- "expedited," "rush," "next day" → `**Ships expedited?**`
- "PO day," "when do we submit" → `**When is a PO submitted?**`
- "receipt day," "when do we get shipments" → `**When do we receive coming-in-house shipments?**`
- "alias," "also known as," "sub-brand" → `## Aliases / sub-brands` section

If the user's update doesn't map to any existing field cleanly, add it as a bullet under a new "Notes" subsection rather than inventing a new standard field.

### Step 3 — Make the edit

Read the current `Vendors/<Folder>/<Folder> - Vendor Info.md`. Change only the specific line(s) the user is updating. Append `(Updated: YYYY-MM-DD)` to each touched line using today's date. Leave every other line untouched.

Also update the "Last updated" line at the top of the file to today's date, and append the changer's name if known:

```
Last updated: 2026-04-24 (edited by <user or "Claude update-vendor-info skill">)
```

### Step 4 — Remind about the rollup

The root `Vendor Information.md` and `Vendor Information.jsonl` are generated from per-vendor files. Your edit invalidated them until someone runs `regenerate-vendor-rollup`. Include a one-line reminder in your user-facing report:

> Updated `Vendors/<Folder>/<Folder> - Vendor Info.md`. The root rollup (`Vendor Information.md` / `.jsonl`) is now stale — run `regenerate-vendor-rollup` (or ask me to) when you want bulk queries to reflect this change.

### Step 5 — Report back

Show:

- Which vendor you updated (canonical name with slashes, not folder name)
- Which field(s) changed, with old value and new value
- The file path that was modified
- The rollup-stale reminder

## Mode B — Bulk CSV from `bulk_changes/`

Use this mode when the user references the CSV / `bulk_changes/` folder / batch feedback. The same surgical-edit discipline from Mode A applies per row — resolve the vendor, identify the field, edit only that line, tag with `(Updated: YYYY-MM-DD)`, update the `Last updated` line. The only differences are: input is a CSV row instead of a user's message, target file is always `Vendors/<Vendor>/<Vendor> - Vendor Info.md`, the skill scans the `Changes Requested` text and extracts only vendor-info-related changes (ignoring SOP/process corrections), and every row's outcome appends to two changelogs — the per-CSV file and a global one.

**⚠️ This is an active execution mode, not a simulation.** You MUST use the `read` tool to open each Vendor Info file, the `edit` tool to modify lines, and the `write` tool for new files. Do NOT just describe what would change — actually change the files. Every modified `Vendor Info.md` file must show visible diffs on disk after this run.

### Step B1 — Pick the CSV

1. List `order-processing/bulk_changes/*.csv`. Pick the file with the most recent mtime.
2. Confirm with the user before proceeding (show the filename, mtime, and row count):

   > I'll process `bulk_changes/26April2026_ffedback_elina.csv` (last modified 2026-04-26, 24 rows from Elina). I'll extract any vendor-info changes (phone, email, address, dropship policy, etc.) and apply them to the matching Vendor Info files. Process/SOP changes will be logged but not applied — those belong in `sop-refresh` Mode B. Proceed?

3. Read the CSV. Try encodings in this order: `utf-8-sig`, `utf-8`, `cp1252`, `latin-1`. The Windows export from Excel is usually `cp1252`.

### Step B2 — Validate columns

Expected columns: `S No`, `Vendor`, `Changes Requested By`, `Changes Requested`, `Completed`. If the columns differ, stop and report the mismatch — don't guess at which column is which.

### Step B3 — Create the tracking file

Before processing any rows, create (or resume from) a progress tracking file at:

```
bulk_changes/.update-vendor-info-progress.md
```

**If the file doesn't exist yet**, create it with `write`, containing the current run's header:

```markdown
# Update Vendor Info — Progress Tracker

**CSV:** bulk_changes/26April2026_ffedback_elina.csv
**Started:** 2026-04-26 15:00
**Reviewer:** Elina
**Total rows:** 24

This file is the authoritative record of this batch run's progress.
It survives across messages so the skill can resume after context loss.
Each row gets one line below — append after processing.
Do NOT edit previous lines; only append.

---

```

**If the file already exists** (from a previous message or interrupted run), `read` it. Scan the processed rows to find the last one completed. Resume from the next unprocessed row. The file keeps you from re-processing rows when context is lost.

### Step B4 — Iterate rows

For each row in the CSV, process in order starting from the first unprocessed row (as determined by the tracking file). **After every row where you make a file edit, you MUST actually use the `edit` tool to write the change to disk.** Do not batch up edits or just describe them in the changelog — each edit must be a real tool call.

1. **Skip if `Completed` is `Yes`.** Already applied. Append to tracking file: `| 1 | Top-Notch | skipped — already Completed |` and move to next row.
2. **Skip if `Changes Requested` is blank or whitespace.** Nothing to apply. Append to tracking file: `| 2 | IML Security Supply | skipped — no change required |` and move on.
3. **Resolve the vendor.** Use the same alias resolution as Mode A and `vendor-lookup`:
   - Exact match against `Vendors/<folder>/` (case-insensitive).
   - Sub-brand / alias match via `Vendor Information.md` and each Vendor Info's `Aliases / sub-brands` section.
   - Common informal-name mappings: `Top-Notch` → `Vendors/TopNotch/`, `Structure Glass` → `Vendors/STRUCTURE GLASS SOLUTIONS/`, `Lavi Industries` → `Vendors/LAVI/`, `Emery Jensen` → `Vendors/ACE - Emery Jensen/`, `HD Supply` → `Vendors/Home Depot - US lock - HD Supply/`, `National Oak` → `Vendors/National oak/`.
   - If no folder/alias match (e.g. `ERP` is an internal system), append to tracking file: `| 13 | ERP | skipped — no vendor folder |` and move on.
   - If ambiguous (multiple candidates), stop and ask the user. Do NOT proceed.
4. **Use the `read` tool to open the Vendor Info file.** Path: `Vendors/<Vendor>/<Vendor> - Vendor Info.md`. Use the exact folder name (not alias) from step 3. If the file doesn't exist, log "Vendor Info file missing — skipped" and move on.
5. **Scan the `Changes Requested` cell for vendor-info keywords.** Look for sentences that match these patterns:

   | If you see... | Then the field to edit is... |
   |---|---|
   | Phone number, phone update, new phone | `**Phone:**` |
   | Email address, contact email, @ sign | `**Email / contact info:**` |
   | Rep name changed, contact person, who to talk to, primary contact | `**Primary contact:**` |
   | Address, moving to, relocating, new location | New entry under `## Notes` (no standard address field) |
   | Can/cannot dropship, dropship allowed/not allowed, "WE CAN DROPSHIP" | `**Can we dropship?**` |
   | Ships under our/their account, FedEx account | `**Ships under our account?**` |
   | Expedited, rush, next day | `**Ships expedited?**` |
   | PO submitted, submission day | `**When is a PO submitted?**` |
   | Receive shipments, receipt day | `**When do we receive coming-in-house shipments?**` |
   | Can CS/Sales contact directly | `**Can CS contact vendor directly?**` / `**Can Sales contact vendor?**` |
   | DK point of contact, escalation contact | `**If not, DK point of contact:**` |
   | Alias, also known as, spelling variant | `## Aliases / sub-brands` |
   | "min order is $", "minimum order value", "orders under $" | New entry under `## Notes` — pricing thresholds |

   **If nothing in the row matches any of these patterns** (the feedback is about in-house procedures, how to submit, marketplace routing, decision trees, rewrite requests, etc.): this is SOP/process feedback, not vendor info. Do NOT edit the Vendor Info file. Append to tracking file: `| 2 | IML Security Supply | skipped — SOP/process only |` and move on.

6. **EXECUTE the edit now, before moving to the next row.** Use the `edit` tool on the target file:
   - **For a standard field** (Phone, Email, Primary Contact, etc.): find the exact line in the file (e.g. `- **Phone:** 888-285-8605`). Use `edit` with `oldText` matching that line and `newText` replacing the value plus appending ` (Updated: 2026-04-26)` to the value portion. Example: `newText` = `- **Phone:** 954-555-1212 (Updated: 2026-04-26)`.
   - **For a Notes or Alias addition**: use `edit` to insert a new bullet under the right section.
   - **If the `## Notes` section doesn't exist yet**: use `edit` to append it at the end of the file (before the `---` / `Source:` line).
   - **If the CSV confirms an existing value** (no change needed but you want to timestamp review): still use `edit` to append ` (Updated: 2026-04-26)` to that line.
   - **If the new value is similar but not identical to an existing value** (e.g. file has two phone numbers, CSV says "phone is now X" where X matches only the second number): STOP. Do NOT edit. Flag for human review and ask the user to clarify.

   After the field edit, also use `edit` to update the `Last updated:` line at the top:
   ```
   Last updated: 2026-04-26 (edited by <reviewer name> via update-vendor-info batch)
   ```

7. **Append to the tracking file immediately.** After the edit succeeds, append one line to `bulk_changes/.update-vendor-info-progress.md`:

   ```
   | 4 | LAVI | applied | Address added to Notes |
   ```

   For rows skipped without edits, still append:

   ```
   | 13 | ERP | skipped | no vendor folder |
   ```

   The format is: `| <S No> | <Vendor> | <outcome> | <detail> |`

   This file is your source of truth for what's been done. If you ever lose context and see this file, `read` it to resume from the next unlisted row.

### Step B5 — Per-CSV changelog

After ALL rows have been processed AND all file edits have been executed, read the tracking file to collect all outcomes. Then write the accumulated changelog in ONE operation.

For every CSV processed, write/append vendor-info entries to the same per-CSV changelog file that `sop-refresh` Mode B uses:

```
order-processing/bulk_changes/<csv_basename>.changelog.md
```

This file accumulates all changes from the same CSV — both SOP (via `sop-refresh`) and vendor-info (via `update-vendor-info`). Append, don't overwrite. If the file doesn't exist yet (e.g. `sop-refresh` hasn't run), create it with the same header:

```markdown
# Changelog for <csv_basename>.csv

Source CSV: `bulk_changes/<csv_basename>.csv`
Reviewer(s): <unique values from "Changes Requested By">
This file accumulates one entry per row processed. Re-running any skill on the
same CSV appends new entries rather than overwriting — the file is the audit
trail for the batch.

---
```

Each row with a vendor-info change appends a section like:

```markdown
### Row 4 — Lavi Industries — applied (vendor info)
- **Run at:** 2026-04-26 15:00 (skill: update-vendor-info, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/LAVI/LAVI - Vendor Info.md`
- **Status:** applied
- **Changes:**

  | Field | Old Value | New Value |
  |-------|-----------|-----------|
  | Vendor address | 27810 Avenue Hopkins, Valencia, CA 91355 | Lavi is relocating to Texas — confirm current address with Xavier (old CA address invalid) |

- **Notes:** Address is not a standard field — added to `## Notes` section. Also detected SOP/process changes (in-house ordering, pricing) — not applied (belongs in `sop-refresh`).
```

Rows with no vendor-info changes still get an entry (so every row is accounted for):

```markdown
### Row 2 — IML Security Supply — skipped (no vendor-info change)
- **Run at:** 2026-04-26 15:00 (skill: update-vendor-info, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/IML/IML - Vendor Info.md` (not modified)
- **Status:** skipped — no vendor-info change detected (row contains SOP/process feedback only)
- **Notes:** —
```

Status values:
- `applied` — at least one vendor-info field edited.
- `applied (confirmed existing)` — values already matched; timestamp updated only.
- `skipped — already marked Completed` — `Completed = Yes` in the CSV.
- `skipped — no vendor-info change detected` — row contains only SOP/process feedback.
- `skipped — no change required` — `Changes Requested` is blank or "All good".
- `skipped — no vendor folder` — vendor name didn't resolve.
- `flagged for human review` — ambiguous change that needs clarification.

### Step B6 — Global root changelog

After all rows have been processed, append a single rollup entry to the global changelog at:

```
order-processing/Vendor-Info-Update-Changelog.md
```

This file is the one-stop history of every `update-vendor-info` Mode B run, ever — across every CSV — so a reviewer can scan it top-to-bottom and see what vendor info changed without opening each per-CSV file. The per-CSV changelog from Step B4 keeps the row-level detail; this global file keeps the run-level summary.

If the file does not exist yet, create it with this header (only on first creation):

```markdown
# Vendor Info Update — Global Changelog

This file accumulates one entry per `update-vendor-info` (Mode B) run. Each entry is a
summary; per-row detail lives in the corresponding `bulk_changes/<csv>.changelog.md`.
Newest entries go at the top. Do not edit by hand — the `update-vendor-info` skill
appends here automatically.

---
```

Then prepend (newest entry on top, just under the `---` separator) a new entry:

```markdown
## 2026-04-26 15:00 — `26April2026_ffedback_elina.csv`

- **Source CSV:** `bulk_changes/26April2026_ffedback_elina.csv`
- **Reviewer(s):** Elina
- **Rows:** 24 total — 3 vendor-info applied, 2 confirmed existing, 17 SOP-only (skipped), 1 no-vendor-folder, 1 no-change-required
- **Vendors touched:** LAVI (address updated), Cal-Royal (min order noted), Pool Corp (min order noted)
- **Rollup status:** ⚠️ Root `Vendor Information.md` and `Vendor Information.jsonl` are now stale — run `regenerate-vendor-rollup` to sync.
- **Per-CSV detail:** [`bulk_changes/26April2026_ffedback_elina.changelog.md`](bulk_changes/26April2026_ffedback_elina.changelog.md)

---
```

Rules for the global entry:

1. **One entry per run, prepended at the top** (newest first). Multiple runs of the same CSV produce multiple entries.
2. **Use the run's actual numbers**, not a template.
3. **Always link to the per-CSV detail file** so a reader can drill in.
4. **Never edit older entries.** Append-only history.
5. **Always include the rollup-stale reminder** in the entry — this is the primary signal that `regenerate-vendor-rollup` needs to run.

### Step B7 — Verify, then report to the user

**Before giving the summary, verify your work:** use `bash` with `ls -la` on at least one of the Vendor Info files you edited to confirm the modification timestamp changed. If a file's date didn't update, something went wrong — re-check that row.

After verification, give a one-screen summary with actual counts from this run:

> Processed `bulk_changes/26April2026_ffedback_elina.csv` (24 rows) for vendor-info changes.
> - Vendor-info applied: 3 (rows 4, 5, 15)
> - Confirmed existing: 2 (rows 10, 11)
> - Skipped — SOP/process only: 17
> - Skipped — already Completed: 0
> - Skipped — no vendor folder: 1 (row 13: "ERP")
> - Skipped — no change required: 1 (row 17: "None")
>
> Per-row detail: `bulk_changes/26April2026_ffedback_elina.changelog.md`
> Run-level history (all CSVs, newest first): `Vendor-Info-Update-Changelog.md`
>
> ⚠️ **Rollup stale:** 3 vendors had info changes. Root `Vendor Information.md` and `.jsonl` need regeneration — run `regenerate-vendor-rollup` (or ask me to) when ready.

Also remind the user that SOP/process changes in the CSV were not applied — they should run `sop-refresh` Mode B separately for those. The two skills work from the same CSV but target different files.

Finally, delete the tracking file (`bulk_changes/.update-vendor-info-progress.md`) now that the run is complete, so the next batch run starts fresh.

## Examples

### Mode A Examples

**Example 1 — phone change**

User: "update hafele's phone - it's now 954-218-0294, rhandy's new direct line"

Flow:
1. Resolve: `Vendors/Hafele/` — exact folder match.
2. Identify field: phone. The existing value is `800-423-3531 - General inquiries / 954-218-0294 - Rhandy for escalations`.
3. The user's update says the NEW phone is 954-218-0294 and notes it's Rhandy's direct line. This is actually already in the file — but they may be saying the general line is now this one, OR that 954-218-0294 is now the default. **When the field already contains similar data, ask before changing.** "The Hafele file already lists 954-218-0294 as Rhandy's escalation line. Are you saying that's now the general number too, or should I replace the general-inquiries line with something else?"

Don't silently change — phone fields are the exact thing that causes real downstream damage (calls to a number that doesn't belong to the right person).

**Example 2 — dropship policy change (straightforward)**

User: "pemco changed - they only dropship under their own account now, we can't use ours anymore"

Flow:
1. Resolve: "Pemco" → `Vendors/Assa Abloy - Pemco - Rockwood/`.
2. Identify field: `**Ships under our account?**`. Current value is "No" (meaning they already ship under the vendor account).
3. Check if the user's update actually changes anything. In this case: the existing file says "Ships under our account: No" which matches the user's claim. But they might be adding context — that dropship is only their account. That maps to `**Can we dropship?**` remaining "Yes," and a note somewhere about the account.
4. Action: add a note under `## Notes` or append a clarification to the dropship line, e.g. `**Can we dropship?** Yes — dropships only under vendor's own account (not ours) (Updated: 2026-04-24)`.
5. Update Last updated line.
6. Report + rollup reminder.

**Example 3 — new alias**

User: "add 'Pemko' as another spelling for Pemco, saw it on one of their emails"

Flow:
1. Resolve: `Vendors/Assa Abloy - Pemco - Rockwood/`.
2. Open the `## Aliases / sub-brands` section.
3. Add `- Pemko` as a bullet, tagged `(Updated: 2026-04-24)`.
4. This alias will be picked up by `vendor-lookup` the next time someone asks about "Pemko." No rollup regeneration strictly needed for aliases, but mention it for consistency.

**Example 4 — ambiguous vendor**

User: "update cal-royal's fedex account info"

Flow:
1. Resolve: `Vendors/Cal-Royal/` folder exists — match is clean.
2. But the instruction "update FedEx account info" doesn't map to a specific field, and the existing file may not have explicit FedEx account info (it has `**Ships under our account?**` which is where FedEx accounts effectively live).
3. Ask: "The Cal-Royal file doesn't have a dedicated FedEx-account line. Do you want me to update `Ships under our account?` (currently 'No'), add a new `Notes` section with the FedEx account info, or both?"

### Mode B Example

**Example 5 — bulk CSV with mixed feedback**

User: "apply elina's latest feedback csv — just the vendor info part"

Flow:
1. List `bulk_changes/*.csv`. Newest by mtime is `26April2026_ffedback_elina.csv`. Confirm with the user, explicitly noting that only vendor-info changes will be applied and SOP changes will be logged but skipped.
2. After confirmation, read the CSV (encoding: `cp1252`). Validate columns.
3. Create the tracking file at `bulk_changes/.update-vendor-info-progress.md` with the run header.
4. Process each row in order, appending to the tracking file after each. For example:
   - **Row 1 — Top-Notch.** Read `Changes Requested`: "Order value < $500 Customer order In-house MOV not met... Marketplace order... Do NOT dropship... WE CAN DROPSHIP MARKETPLACE..." This is about dropship policy for marketplace orders — it touches `**Can we dropship?**` (the "marketplace dropship IS allowed" clarification) and some SOP-level routing logic. Use `edit` to update the dropship line in `Vendors/TopNotch/TopNotch - Vendor Info.md`. Append to tracking file: `| 1 | Top-Notch | applied | Dropship policy updated for marketplace |`.
   - **Row 4 — LAVI.** Read `Changes Requested`: "Vendor address Step 1... IS incorrect, they are moving to TX in January..." This is a clear vendor-info change (address/Notes). Use `edit` to add a `## Notes` section at the end of `Vendors/LAVI/LAVI - Vendor Info.md` with the address note. Append to tracking: `| 4 | LAVI | applied | Address added to Notes |`.
   - **Row 15 — Pool Corp.** Read `Changes Requested`: "min order is $150.00". This is a vendor-info fact (pricing threshold). Use `edit` to add it under `## Notes` in `Vendors/Pool Corp/Pool Corp - Vendor Info.md`. Append to tracking: `| 15 | Pool Corp | applied | Min order value noted |`.
   - **Row 2 — IML Security Supply.** Read: "All good except not clear on what how are we ordering in house". This is purely SOP/process feedback. No vendor-info field match. Append to tracking: `| 2 | IML Security Supply | skipped | SOP/process only |` and move on.
   - **Row 13 — ERP.** "ERP" doesn't match any vendor folder. Append to tracking: `| 13 | ERP | skipped | no vendor folder |` and move on.
5. After all rows are processed, read the tracking file to gather outcomes, then write the per-CSV changelog (Step B5) and global changelog (Step B6). Verify with `ls -la` (Step B7), give the user the screen summary, delete the tracking file, and remind them to run `sop-refresh` Mode B for the SOP parts and `regenerate-vendor-rollup` to sync the rollup.

## Anti-patterns to avoid

1. **Don't silently change phone, email, or account numbers when the new value is similar but not identical to the existing one.** The downside (wrong contact used for months) is worse than asking a clarifying question.
2. **Don't touch fields the user didn't ask about.** Every Updated tag is a promise that the specific line changed deliberately. Spreading tags across unrelated lines dilutes the signal.
3. **Don't forget to update `Last updated:` at the top of the file.** That line is how readers know freshness at a glance.
4. **Don't skip the rollup-stale reminder.** The user may not realize the root files are now out of date until they run a bulk query and get old data. Even a single sentence is enough.
5. **Don't create the folder if the vendor isn't found — that's `add-new-vendor`'s job.** If the user asks to update vendor X and no folder exists, stop and ask: "I don't see X in the knowledge base. Do you want me to create a new folder for X using `add-new-vendor`, or did you mean a different existing vendor?"
6. **Don't apply SOP/process changes in Mode B.** The `Changes Requested` column often mixes vendor info and process feedback. Apply only the parts that map to vendor info fields. Log the SOP parts — don't silently redirect them to the Vendor Info file. The user can run `sop-refresh` Mode B separately for those.
7. **Don't silently skip a row in Mode B.** Every CSV row gets exactly one entry in the per-CSV changelog, even if the entry is "skipped — no vendor-info change detected". A row that vanishes from the changelog looks like a data-loss bug.
8. **Don't modify the source CSV.** Even after applying every row, leave the CSV alone. The reviewer flips `Completed` to `Yes` themselves so they own the sign-off.
9. **Don't edit older entries in `Vendor-Info-Update-Changelog.md`.** It's append-only history. If a previous run's summary was wrong, note the correction in the next run's entry — don't rewrite the past.
10. **Don't forget to coordinate with `sop-refresh` Mode B.** The same CSV feeds both skills. `sop-refresh` writes to Process Documents; `update-vendor-info` writes to Vendor Info files. Both append to the same per-CSV changelog. If the user runs both, remind them which parts each skill handled so there's no double-application or confusion.
