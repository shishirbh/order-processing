---
name: update-vendor-info
description: Updates one or more fields for an existing vendor in the order_processing knowledge base. Use when the user wants to change a phone, email, contact, dropship rule, or similar field. Resolves sub-brands (Pemco, US Lock). Do not use for new vendors.
---

# update-vendor-info

Make a surgical edit to an existing vendor's `Vendor Info.md`, timestamp the change, keep everything else untouched.

## What this skill is for

Vendor data drifts: reps change, phones update, dropship policies evolve. When someone tells you "Hafele's phone is now 954-218-0294" or "Pemco no longer ships expedited," the job is to find the right file, change the right line, timestamp it, and not accidentally touch anything else. This is different from `add-new-vendor` (new supplier, new folder) and different from `sop-refresh` (SOP document, multi-line changes, difference-summary format).

## How to use this skill

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

## Examples

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

## Anti-patterns to avoid

1. **Don't silently change phone, email, or account numbers when the new value is similar but not identical to the existing one.** The downside (wrong contact used for months) is worse than asking a clarifying question.
2. **Don't touch fields the user didn't ask about.** Every Updated tag is a promise that the specific line changed deliberately. Spreading tags across unrelated lines dilutes the signal.
3. **Don't forget to update `Last updated:` at the top of the file.** That line is how readers know freshness at a glance.
4. **Don't skip the rollup-stale reminder.** The user may not realize the root files are now out of date until they run a bulk query and get old data. Even a single sentence is enough.
5. **Don't create the folder if the vendor isn't found — that's `add-new-vendor`'s job.** If the user asks to update vendor X and no folder exists, stop and ask: "I don't see X in the knowledge base. Do you want me to create a new folder for X using `add-new-vendor`, or did you mean a different existing vendor?"
