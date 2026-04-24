---
name: regenerate-vendor-rollup
description: Rebuilds the root Vendor Information.md and Vendor Information.jsonl rollup from every per-vendor Vendor Info.md. Use when the user asks to regenerate, rebuild, refresh, or sync the master vendor table after vendor edits.
---

# regenerate-vendor-rollup

Walk every per-vendor `Vendor Info.md`, rebuild `Vendor Information.md` and `Vendor Information.jsonl`, report the diff.

## What this skill is for

The per-vendor folder is the source of truth. The root `Vendor Information.md` (human-readable table) and `Vendor Information.jsonl` (machine-friendly, one vendor per line) are generated rollups that exist for bulk lookups and programmatic access. They drift as soon as anyone edits a per-vendor file. This skill rebuilds them from scratch, overwriting the stale versions, and tells the user what changed.

Both rollup files carry a do-not-edit-by-hand banner. This skill writes the banner back every time so it can't be lost.

## How to use this skill

### Step 1 — Enumerate vendor folders

Walk `order_processing/` and find every directory that:

- Is NOT a top-level special folder (`_shared_sops/`, `_source_docx/`, `_skill_evals/`, `plugin/`, `.git/`, `.claude-plugin/`, etc. — anything starting with `_` or `.` should be skipped).
- Contains a `* - Vendor Info.md` file inside.

For each, read that Vendor Info file.

### Step 2 — Extract the canonical fields from each file

Parse each Vendor Info.md and pull these fields (exact strings to look for):

| Output column | Source line in Vendor Info.md |
|---|---|
| Vendor (canonical name with slashes) | The `# <Vendor> — Vendor Info` title line (strip ` — Vendor Info` suffix) — this keeps the slashed form even when the folder uses ` - ` |
| Vendor Contact | `**Primary contact:**` |
| Contact Info | `**Email / contact info:**` |
| Phone Number | `**Phone:**` |
| Can CS contact vendor directly? | `**Can CS contact vendor directly?**` |
| Can Sales contact Vendor? | `**Can Sales contact vendor?**` |
| If not, DK point of contact | `**If not, DK point of contact:**` |
| Can we dropship? | `**Can we dropship?**` |
| Ships Under our account | `**Ships under our account?**` |
| Ships Expedited? | `**Ships expedited?**` |
| When is a PO submitted? | `**When is a PO submitted?**` |
| When do we receive Coming In House Shipments? | `**When do we receive coming-in-house shipments?**` |

### Step 3 — Normalize values

- Strip `(Updated: YYYY-MM-DD)` tags off the end of a value before writing the rollup (the rollup isn't the right place to show per-field timestamps).
- `_(to be filled)_` and `_(blank in source)_` both become empty / `null` in the rollup.
- Multi-value fields that rendered as bullets in the per-vendor file (e.g. `Contact Info` with multiple emails on separate lines) collapse back to a single cell, joined with ` / ` or newline, matching the original master table style.
- Preserve the original vendor ordering if possible — sort by vendor name alphabetically (A→Z, case-insensitive) unless the user asks for a different order.

### Step 4 — Write `Vendor Information.md`

Overwrite the existing file with:

```markdown
# Vendor Information

<!--
  ⚠️  GENERATED FILE — DO NOT EDIT BY HAND.

  Source of truth for each vendor's data is in
  <Vendor Folder>/<Vendor Folder> - Vendor Info.md

  This rollup is rebuilt from those files by the `regenerate-vendor-rollup`
  skill (part of the order-processing Cowork plugin). If you edit this file
  directly, your changes will be lost on the next regeneration.

  To update a vendor: open the vendor's folder and edit its Vendor Info.md,
  then run `regenerate-vendor-rollup` (or ask Claude to).
-->

_Last regenerated: YYYY-MM-DD from N vendor folders._

## Sheet: Main Sheet

| Vendor | Vendor Contact | Contact Info | Phone Number | Can CS contact vendor directly? | Can Sales contact Vendor? | If not, DK point of contact | Can we dropship? | Ships Under our account | Ships Expedited? | When is a PO submitted? | When do we receive Coming In House Shipments? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <row> | ... |
```

Preserve the exact column order shown above — other tools read this file by column name.

### Step 5 — Write `Vendor Information.jsonl`

One vendor per line. First line is the banner record:

```json
{"_comment": "GENERATED FILE — DO NOT EDIT BY HAND. Regenerated from each <Vendor>/<Vendor> - Vendor Info.md by the regenerate-vendor-rollup skill. To update a vendor, edit its per-vendor file and run regenerate-vendor-rollup. This first line is a banner record; programmatic readers should skip records where '_comment' is present."}
```

Each subsequent line is a single-line JSON object with the exact key names from the column table above. Use `null` for blank values, not empty strings.

### Step 6 — Report the diff

Compare the new rollup to the old one (before overwriting, or diffing after). Report to the user:

- Count of vendors found, written
- **Added**: vendors present in folders but not in the previous rollup
- **Removed**: vendors in the previous rollup but no longer have a folder (the user should confirm — removing a vendor from the rollup may be intentional or may be a missing folder they didn't realize)
- **Changed**: vendors whose row values differ between old and new rollup — one line per changed field, showing old → new

If nothing changed, say so — "the rollup was already in sync; rewrote the file to refresh the timestamp."

### Step 7 — Warn on anomalies

Flag anything that suggests broken source files:

- A vendor folder with no `* - Vendor Info.md` inside — report it, don't add a row.
- A Vendor Info file missing the title line — use the folder name as fallback, but warn.
- A Vendor Info file where multiple fields are stubs — fine, just captured as blanks.
- Two vendor folders whose canonical names collide (e.g. someone accidentally created both `Pemco/` and `Assa Abloy - Pemco - Rockwood/` — the alias should be in the combined folder, not a separate one).

## Examples

**Example 1 — nothing changed**

User: "rebuild the master table"

Output:
> Regenerated `Vendor Information.md` and `Vendor Information.jsonl` from 103 vendor folders.
>
> **No changes detected.** The rollup was already in sync with the per-vendor files. The `_Last regenerated:` timestamp has been bumped to 2026-04-24.

**Example 2 — changes since last run**

User: "sync the rollup, I've been updating a few vendors"

Output:
> Regenerated `Vendor Information.md` and `Vendor Information.jsonl` from 103 vendor folders.
>
> **Changed rows (3):**
> - **Hafele** — Phone: `800-423-3531 - General inquiries / 954-218-0294 - Rhandy for escalations` → `954-218-0294 - Rhandy (Rhandy's new direct line)`
> - **Pemco (Assa Abloy/Pemco/Rockwood)** — Can we dropship?: `Yes` → `Yes — dropships only under vendor's own account (not ours)`
> - **Deltana** — Primary contact: `Elizabeth Markowitz` → `Elizabeth Markowitz (Mon-Thu 9am-4pm ET only)`
>
> No rows added or removed.

**Example 3 — a folder with no Vendor Info file**

User: "regenerate"

Output:
> Regenerated `Vendor Information.md` and `Vendor Information.jsonl` from 102 vendor folders.
>
> ⚠️ **Skipped 1 folder** with no Vendor Info file:
> - `Some Vendor/` — no `* - Vendor Info.md` found inside. Create one using the `add-new-vendor` skill, or delete the folder if it was created by mistake.
>
> **No other changes detected.**

**Example 4 — collision warning**

User: "rebuild"

Output:
> Regenerated from 104 vendor folders.
>
> ⚠️ **Potential alias collision:**
> - A new folder `Pemco/` has appeared. The existing `Assa Abloy - Pemco - Rockwood/` folder already lists "Pemco" as a sub-brand. Do you want me to merge Pemco/ into the Assa Abloy folder (and delete the duplicate), or is this a genuinely separate supplier relationship?
>
> Rollup rewritten regardless; please resolve the collision before the next regeneration so the data stays clean.

## Anti-patterns to avoid

1. **Don't skip the banner.** Every regeneration must rewrite the do-not-edit-by-hand header. If the banner is missing after a run, the skill failed.
2. **Don't silently drop vendors that couldn't be parsed.** Warn. A silent drop looks like a normal regeneration and the user won't notice the data loss.
3. **Don't reorder columns.** The column order is used by downstream readers; keeping it stable prevents accidental breakage.
4. **Don't preserve `(Updated: date)` tags in the rollup cells.** The rollup is a snapshot, not a history. The per-vendor file carries the edit history.
5. **Don't treat every blank as identical to every other blank.** `_(to be filled)_` means "we know this should be populated but haven't yet"; truly absent data is different. Both become empty in the rollup, but the per-vendor file should still use the right one so humans know which.
6. **Don't regenerate the rollup silently.** Always show the diff (added / changed / removed). That's how the user knows the run did what they wanted.
