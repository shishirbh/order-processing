---
name: sop-refresh
description: Updates an existing SOP by merging a baseline document with change notes. Produces a difference summary table and a clean revised SOP with timestamped changes. Use when refreshing, revising, or rolling changes into an SOP or process document.
---

# sop-refresh

Merge change notes into a baseline SOP and produce an audit-ready revision.

## What this skill is for

SOPs at DK Hardware Supply (e.g. `_shared_sops/Sales - NET 30 SOP.md`, vendor Process Documents) get updated whenever a rule changes — a new approval step, a revised fee, a dropped vendor option. The risk: staff merging the change inconsistently, leaving the old rule somewhere, or rewriting more than they should. This skill forces a disciplined merge — show exactly what changed, update only what needs updating, tag changes with today's date, and output a clean final that operations can use immediately.

## Inputs you need from the user

1. **Baseline SOP** — the existing document. Can be:
   - A file path (e.g. `_shared_sops/Sales - NET 30 SOP.md` or `Deltana/Deltana Process Document.md`). Read it.
   - Raw pasted text in the user's message.
2. **Changes / updates** — the new rules, corrections, or notes. Usually raw text in the user's message, sometimes a separate file.

If either is missing, ask once. Don't proceed guessing what the changes are.

## The output must be exactly two sections, in this order

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

## Anti-patterns to avoid

1. **Do not rewrite sections that didn't change.** The goal is minimum surgical delta, not a fresh draft.
2. **Do not emit the final SOP without the difference table first.** The table is how the user verifies the merge before trusting the body.
3. **Do not put `(Updated: date)` on unchanged lines.** The tag means "this line was touched in this revision" — if it's everywhere, it's meaningless.
4. **Do not invent context.** If the changes say "approval now required for refunds > $500" and the baseline is silent on refunds, integrate the new rule plainly — don't backfill assumptions about the old rule.
5. **Do not leave both the old rule and the new rule in the SOP.** Pick the new rule only. The old rule lives in the difference table's "Old Rule" column.
6. **Do not modify the baseline file in place.** The output is a new revision — the user decides when to replace the old file. Write to a sibling file like `<original>.v2.md` or present the new content for their review, but do not overwrite the existing file without explicit confirmation.

## Examples

### Example 1 — small change to a vendor process

**User:**

> Update `Deltana/Deltana Process Document.md` — Elizabeth changed her hours. She's now only reachable Mon–Thu 9am–4pm ET. Also, all RMA requests now need to go through Elina first, not to Elizabeth directly.

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

### Example 2 — changes that span multiple sections

If the change is "We're dropping NET 30 for all new customers — new customers must prepay until they've been active for 90 days," the table has one row, but the final SOP updates every section that referenced NET 30 eligibility (intro, approval flow, escalation). Tag each touched line with `(Updated: <date>)`; leave unrelated sections untouched.

### Example 3 — ambiguous change

**User:** "Fees changed."

**You:** "Which fees — the core item restocking fee, the expedited-shipping surcharge, or something else? And what's the new amount?" Then proceed once the answer is clear. Never guess.
