---
name: add-new-vendor
description: Scaffolds a new vendor folder in the order_processing knowledge base with the standard Vendor Info, Process Document, and Issue Resolution Notes files. Use when onboarding, adding, or setting up a new supplier. Do not use for updates to existing vendors.
---

# add-new-vendor

Create a new vendor folder inside `order_processing/Vendors/` with the 3 standard files, pre-populated from whatever the user has given you.

## What this skill is for

The knowledge base stores one folder per supplier, with three files inside:

- `<Vendor> - Vendor Info.md` — contacts, shipping rules, timing
- `<Vendor> Process Document.md` — how to order, track, escalate
- `<Vendor> - Issue Resolution Notes.md` — damage, missing, returns

When a new supplier appears, someone needs to create the folder, match the file naming convention exactly, sanitize the vendor name into a valid Windows folder name, capture whatever details the user has, and remind the user to update the root master table. This skill does all of that in one pass so new vendors are consistent with the existing 103.

## How to use this skill

### Step 1 — Gather what you know

The user will give you a vendor name and usually some fields — a contact email, a phone, a dropship rule. Extract what you have:

- **Vendor name** (required)
- Primary contact person
- Email(s)
- Phone
- CS / Sales communication rules (can we contact directly? who's the DK point of contact if not?)
- Shipping: dropship yes/no, ships under our account, expedited support
- Timing: PO submission day, receipt day
- Aliases or sub-brands

**If you don't have a field, that's fine** — leave it as `_(to be filled)_`. Do NOT invent values. The fallback behavior is documented and expected; fabricating a phone number or email could cause real downstream errors (misrouted emails, wrong orders).

### Step 2 — Sanitize the folder name

Windows doesn't allow certain characters in folder names. Apply these rules:

- Replace `/` with ` - ` (space-dash-space). `Assa Abloy/Pemco/Rockwood` → `Assa Abloy - Pemco - Rockwood`.
- Replace `\` with ` - ` same way.
- Strip the Windows-reserved chars `< > : " | ? *`.
- Collapse runs of spaces to a single space.
- Trim leading/trailing whitespace.

Keep the original slashed name in the file content and in the `Aliases / sub-brands` section so sub-brand lookups still work. Use the sanitized name for the folder and for the filename prefix (e.g. `Acme - Subsidiary - Acme - Subsidiary - Vendor Info.md`).

### Step 3 — Check for collisions before creating

Before creating the folder:

1. Check if a folder with the sanitized name already exists inside `order_processing/Vendors/`.
2. Check if the name or any alias appears in `order_processing/Vendor Information.md` (master table).
3. Check if the vendor might be a sub-brand of an existing combined folder (e.g. "Pemco" would already be covered by `Vendors/Assa Abloy - Pemco - Rockwood/`).

If any of the above, **stop and ask the user how to proceed**. Options: (a) update the existing folder instead, (b) add the new name as an alias to the existing folder, (c) create as a separate folder anyway (rare). Do not silently overwrite existing vendor folders — they may contain hand-curated content.

### Step 4 — Create the folder and three files

**Create the folder first inside `order_processing/Vendors/`, then write the three files INSIDE that folder.** The end result must look like:

```
order_processing/
└── Vendors/
    └── <Sanitized Folder Name>/
        ├── <Sanitized Folder Name> - Vendor Info.md
        ├── <Sanitized Folder Name> Process Document.md
        └── <Sanitized Folder Name> - Issue Resolution Notes.md
```

Do NOT place the new vendor folder at the root of `order_processing/` — every per-vendor folder lives inside `Vendors/`. Do NOT place the three files at the same level as the other vendor folders — they must be inside their own vendor folder. The existing `Vendors/Deltana/`, `Vendors/IML/`, `Vendors/STRUCTURE GLASS SOLUTIONS/`, `Vendors/TopNotch/` layout is the pattern to match exactly.

Use the templates below. Fill in today's date as the "Last updated" value. Every field the user didn't provide becomes `_(to be filled)_`.

#### File 1: `<Folder> - Vendor Info.md`

```markdown
# <Canonical Name> — Vendor Info

Last updated: <YYYY-MM-DD> (added by <user or "Claude add-new-vendor skill">)

## Contacts
- **Primary contact:** <value or _(to be filled)_>
- **Email / contact info:** <value or _(to be filled)_>
- **Phone:** <value or _(to be filled)_>

## Communication rules
- **Can CS contact vendor directly?** <value or _(to be filled)_>
- **Can Sales contact vendor?** <value or _(to be filled)_>
- **If not, DK point of contact:** <value or _(to be filled)_>

## Shipping
- **Can we dropship?** <value or _(to be filled)_>
- **Ships under our account?** <value or _(to be filled)_>
- **Ships expedited?** <value or _(to be filled)_>

## Timing
- **When is a PO submitted?** <value or _(to be filled)_>
- **When do we receive coming-in-house shipments?** <value or _(to be filled)_>

## Aliases / sub-brands
<only include this section if the vendor has aliases — e.g. sub-brands or a slashed canonical name>
- <alias 1>
- <alias 2>

---
Source: added via add-new-vendor skill on <YYYY-MM-DD>
```

#### File 2: `<Folder> Process Document.md`

```markdown
# <Canonical Name> — Process Document

Last updated: _(to be filled)_

This document describes how to place, track, and escalate orders with <Canonical Name>.
If this file is still a stub, fall back to the general process in `_shared_sops/`.

## How to place an order
_(to be filled)_

## How to check order status
_(to be filled — for general guidance see `_shared_sops/SOP to check Vendor Order.md`)_

## Escalation path
_(to be filled — who to contact when CS can't resolve)_

## Lead times / cutoffs
_(to be filled)_

## Special handling / gotchas
_(to be filled)_
```

#### File 3: `<Folder> - Issue Resolution Notes.md`

```markdown
# <Canonical Name> — Issue Resolution Notes

Last updated: _(to be filled)_

For any issue with <Canonical Name> orders:
1. Check this file first — vendor-specific rules override the general playbook.
2. Fall back to root `Issue resolution.md` for the cross-vendor playbook.

## Damage claims
_(to be filled)_

## Missing items
_(to be filled)_

## Wrong items / defects
_(to be filled)_

## Returns / RMAs
_(to be filled)_

## Vendor-specific gotchas
_(to be filled)_
```

### Step 5 — Remind the user about the master table

The per-vendor folder is the source of truth for that vendor, but the root `order_processing/Vendor Information.md` and `Vendor Information.jsonl` are cross-vendor rollups used by other workflows. After creating the folder, tell the user:

> Created `Vendors/<Folder>/` with the 3 standard files. To finish onboarding, also add a row to `Vendor Information.md` and a record to `Vendor Information.jsonl` with the fields you have — the per-vendor folder is canonical, but the root rollup is used for bulk lookups.

Offer to do that update if they want — you can write the row yourself once they confirm.

### Step 6 — Report back

Give a concise summary:

- Folder path created
- Which fields were populated
- Which fields are stubs
- Reminder about the master table

## Examples

**Example 1 — minimal info**

User: "Add a new vendor: Bulldog Fasteners."

1. No alias. Folder name = `Bulldog Fasteners`, created at `Vendors/Bulldog Fasteners/`.
2. No existing collision.
3. Create folder with 3 files. All fields in Vendor Info are `_(to be filled)_` except vendor name.
4. Report:

> Created `Vendors/Bulldog Fasteners/` with:
> - Bulldog Fasteners - Vendor Info.md (stub — only name is populated)
> - Bulldog Fasteners Process Document.md (stub)
> - Bulldog Fasteners - Issue Resolution Notes.md (stub)
>
> Next: add a row for Bulldog Fasteners to `Vendor Information.md` and `Vendor Information.jsonl`. Want me to do that?

**Example 2 — with contact card**

User: "New supplier — Acme Hardware, rep is Sarah Kim at sarah@acmehw.com, phone 555-123-4567. They let us dropship under their account."

1. Folder name = `Acme Hardware`, created at `Vendors/Acme Hardware/`.
2. Populate Vendor Info with: primary contact = Sarah Kim, email = sarah@acmehw.com, phone = 555-123-4567, ships under our account = "No — under vendor account" (or similar, based on how the user phrased it), dropship = Yes.
3. Other fields stay as stubs.
4. Report.

**Example 3 — slashed name**

User: "Let's onboard Monroe/Stellar/Blue Ribbon — they're one company with three brands."

1. Folder name sanitized: `Vendors/Monroe - Stellar - Blue Ribbon/`.
2. Vendor Info has `Aliases / sub-brands` section listing Monroe, Stellar, Blue Ribbon.
3. Canonical name inside the file body is `Monroe/Stellar/Blue Ribbon` (with slashes).

**Example 4 — collision**

User: "Add Pemco as a new vendor."

1. "Pemco" is a sub-brand of the existing `Vendors/Assa Abloy - Pemco - Rockwood/` folder.
2. Don't create. Ask:

> `Pemco` is already captured under the `Vendors/Assa Abloy - Pemco - Rockwood/` folder (Assa Abloy is the parent company). Do you want to: (a) update the existing folder, (b) add Pemco as a separate entry (only if you're sure it's a distinct supplier relationship), or (c) something else?

## Anti-patterns to avoid

1. **Don't invent data.** If the user didn't give a phone, the file says `_(to be filled)_`. Fabricating values is worse than leaving blanks because someone will later trust and act on them.
2. **Don't silently collide.** If a folder or alias exists, stop and ask. The 4 hand-curated folders (Deltana, IML, STRUCTURE GLASS SOLUTIONS, TopNotch) and any combined-bran