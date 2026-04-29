---
name: vendor-lookup
description: Looks up vendor details in the order_processing knowledge base. Resolves aliases and sub-brands (Pemco to Assa Abloy, US Lock to Home Depot, Emery Jensen to ACE). Use for any question about a vendor's contact info, shipping rules, claims, or order process.
---

# vendor-lookup

Resolve the vendor, pick the right file, quote the answer verbatim, cite the source.

## What this skill is for

The `order_processing/` folder is the source of truth for ~103 vendor relationships plus cross-vendor sales SOPs. CS and Sales staff ask questions like "what's Pemco's email" or "can we dropship with Cal-Royal" and need fast, cite-backed answers. This skill does that routing deterministically so we never confidently answer about the wrong vendor and never fabricate data that's missing from the source.

## How to use this skill

Follow these four steps in order. Skipping a step leads to wrong-vendor errors or hallucinated fields.

### Step 1 — Resolve the vendor

The canonical vendor list lives in `order_processing/Vendor Information.md` (and the machine-friendly `Vendor Information.jsonl`). Per-vendor folders live in `order_processing/Vendors/`. Start there:

1. **Exact-name match.** Look for a folder inside `order_processing/Vendors/` whose name matches the vendor the user mentioned, case-insensitive. Slashes in the master list become ` - ` in folder names — `Assa Abloy/Pemco/Rockwood` is the folder `Vendors/Assa Abloy - Pemco - Rockwood`.
2. **Sub-brand / alias match.** If no folder matches, scan `Vendor Information.md` — many rows combine multiple brands. Common sub-brand → parent mappings:
   - Pemco, Rockwood, Pemko → `Vendors/Assa Abloy - Pemco - Rockwood/`
   - US Lock, HD Supply → `Vendors/Home Depot - US lock - HD Supply/`
   - Emery Jensen → `Vendors/ACE - Emery Jensen/`
   - Sentry → `Vendors/Prime-Line - Sentry/`
   - Portals → `Vendors/Bohle - Portals/`
   Also check each vendor's `Aliases / sub-brands` section inside `Vendors/<Vendor>/<Vendor> - Vendor Info.md`.
3. **Typos and casual phrasings.** Users write "Hafele" as "hafele", "Del-tana", "CRLaurence" for CRL, "Hardware Res" for Hardware Resources. Do a fuzzy pass against the master list if steps 1–2 miss.
4. **If still ambiguous, DON'T guess.** List 2–4 most-likely candidates and ask the user to confirm. Example: "I see three vendors whose names contain 'lock': `Lockey USA`, `Security Lock`, `Southern Lock`. Which did you mean?" This is the correct behavior — it's safer to ask than to confidently answer about the wrong company.

### Step 2 — Pick the right file for the question type

Once the vendor is resolved, route to the file that answers the question. Use this table:

| Question type | File to read |
|---|---|
| Contact / phone / email / who to reach | `Vendors/<Vendor>/<Vendor> - Vendor Info.md` |
| Can we dropship? Ships under our account? Expedited? | `Vendors/<Vendor>/<Vendor> - Vendor Info.md` |
| When is a PO submitted? When do we receive shipments? | `Vendors/<Vendor>/<Vendor> - Vendor Info.md` |
| DK point of contact (Elina, Yana, Kirill, etc.) for this vendor | `Vendors/<Vendor>/<Vendor> - Vendor Info.md` |
| How to place / track / escalate an order | `Vendors/<Vendor>/<Vendor> Process Document.md` |
| Damage, missing item, wrong item, defect, return, RMA | `Vendors/<Vendor>/<Vendor> - Issue Resolution Notes.md` |
| Cross-vendor: NET 30, quote follow-up, problem orders, chat SOP, core fees | `order_processing/_shared_sops/` |
| Post-order status inquiries, checking vendor order | `order_processing/_shared_sops/SOP for Post Order status inquires and follow ups.md`, `SOP to check Vendor Order.md` |

### Step 3 — Handle stubs and blanks correctly

Most Process Documents and Issue Resolution Notes are stubs marked `_(to be filled)_`. When the file is a stub:

1. Say so explicitly. Don't fabricate a process. Example: "The vendor-specific process document for Abaco Machines is still a stub."
2. Fall back to the cross-vendor resources: root `order_processing/Issue resolution.md` for claims, `_shared_sops/` for SOPs.
3. Cite both the stub (to show you checked) and the fallback file (where the answer actually came from).

Same rule for fields marked `_(blank in source)_` in the Vendor Info file — say the field is blank in the source rather than guessing a plausible value. The reason: vendor data gets acted on (emails sent, orders placed) and a wrong email or phone number has real downstream cost.

### Step 4 — Answer format

Start with the direct answer in one or two sentences. Quote verbatim when exact wording matters — email addresses, phone numbers, day-of-week rules, dollar amounts. Then end with:

```
Sources:
- <relative path from order_processing/>
- <second path if you consulted multiple files>
```

Use the vendor's canonical name (with slashes as they appear in `Vendor Information.md`) inside the answer body, even if the folder on disk uses ` - ` — that's what the user recognizes.

## Examples

**Example 1 — easy case**

User: "What's Deltana's email?"

1. Resolve: exact match, folder `Vendors/Deltana/`.
2. Pick file: contact question → `Vendors/Deltana/Deltana - Vendor Info.md`.
3. Read the file, find the email field.
4. Answer:

> Deltana's primary contact is Elizabeth Markowitz at **Elizabeth@deltana.net**, phone 800-665-2226.
>
> Sources:
> - Vendors/Deltana/Deltana - Vendor Info.md

**Example 2 — sub-brand resolution**

User: "Can we dropship with Pemco?"

1. Resolve: "Pemco" is not a folder; it's a sub-brand of `Vendors/Assa Abloy - Pemco - Rockwood`.
2. Pick file: shipping question → `Vendors/Assa Abloy - Pemco - Rockwood/Assa Abloy - Pemco - Rockwood - Vendor Info.md`.
3. Read the file.
4. Answer:

> Yes — Assa Abloy/Pemco/Rockwood allows dropshipping, but they don't ship under our account and there's a 5-7 day processing window before dispatch.
>
> Sources:
> - Vendors/Assa Abloy - Pemco - Rockwood/Assa Abloy - Pemco - Rockwood - Vendor Info.md

**Example 3 — ambiguous vendor, must ask**

User: "What's the phone for Glass?"

1. Resolve: "Glass" alone is not a match. Scan the master list — could be `Vendors/Glass Warehouse`, `Vendors/STRUCTURE GLASS SOLUTIONS`, or possibly a sub-brand.
2. Don't guess. List candidates.

> I see multiple glass-related vendors — `Glass Warehouse`, `STRUCTURE GLASS SOLUTIONS`. Which did you mean? (If you meant something else, tell me the full name and I'll look it up.)

**Example 4 — stub fallback**

User: "How do I place an order with Abaco Machines?"

1. Resolve: folder `Vendors/Abaco Machines/` exists.
2. Pick file: process question → `Vendors/Abaco Machines/Abaco Machines Process Document.md`.
3. Read — it's a stub marked `_(to be filled)_`.
4. Fall back to `_shared_sops/` and the vendor info for contact details.

> The vendor-specific process document for Abaco Machines hasn't been written yet — it's a stub. For the general order-placement flow, see the cross-vendor SOP. To contact Abaco directly: Sales@abacomachines.com / csm2@abacomachines.com, 310-532-0366.
>
> Sources:
> - Vendors/Abaco Machines/Abaco Machines - Vendor Info.md
> - Vendors/Abaco Machines/Abaco Machines Process Document.md (stub)
> - _shared_sops/SOP.md

## Anti-patterns to avoid

1. **Don't confidently answer when the vendor isn't matched.** If you're less than ~90% sure which vendor the user means, list candidates and ask. The cost of a wrong answer (wrong email sent, wrong process followed) is much higher than one extra conversational turn.
2. **Don't fabricate to fill blanks.** `_(blank in source)_` means blank. Say so.
3. **Don't skip the Sources section.** Every answer cites its file. This is how the user verifies and how the knowledge base stays trustworthy as it grows.
4. **Don't read `.docx` when `.md` exists.** The `.md` is canonical; `.docx` originals live in `_source_docx/` as archive only.
5. **Don't over-answer.** If the user asked for Pemco's email, give the email — don't dump the entire Vendor Info file on them. Offer more info if relevant, but lead with the direct answer.
