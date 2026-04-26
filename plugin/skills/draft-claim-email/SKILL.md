---
name: draft-claim-email
description: Drafts a vendor-ready claim email for damaged, missing, wrong, or defective received goods. Respects internal routing rules (for example, Deltana claims go through Elina). Use when the user describes a problem with a shipment and wants to write the vendor.
---

# draft-claim-email

Produce an email that a CS rep can send as-is to resolve a vendor problem — with the right contact, subject, tone, CC list, and escalation flag.

## What this skill is for

When something goes wrong with received goods (damage, missing items, wrong SKU, defects, returns), the CS rep has to: find the right vendor contact, figure out whether DK routes the claim internally first or goes straight to vendor, write an email in the vendor's expected format, and make sure the right people are CCed. This skill does all of that using the knowledge base — the vendor's Issue Resolution Notes, their Vendor Info, and the cross-vendor `Issue resolution.md` playbook — so every claim goes out consistent, complete, and traceable.

## How to use this skill

### Step 1 — Resolve the vendor

Same name resolution as `vendor-lookup` / `update-vendor-info`. Exact folder match, sub-brand/alias match, or ask. Never guess.

### Step 2 — Classify the issue type

Claim types this skill handles:

- **Damage** — goods arrived broken, bent, crushed, finish damage
- **Missing** — item listed on PO not present in shipment
- **Wrong item / wrong SKU** — received a different product than ordered
- **Defect** — item looks fine on arrival but doesn't work / fails QC
- **Return / RMA** — customer-initiated return needing vendor authorization
- **Late / incomplete shipment** — delivery issue short of outright missing

If the user's description spans two types (e.g., "arrived damaged and also the wrong SKU"), treat them as two separate claims unless the user says otherwise — vendors usually process these via different flows.

### Step 3 — Read the right files, in this order

1. **`Vendors/<Vendor>/<Vendor> - Issue Resolution Notes.md`** — vendor-specific procedure, if not a stub. This is authoritative; its rules override the general playbook.
2. **`Vendors/<Vendor>/<Vendor> - Vendor Info.md`** — for primary contact, email, phone, and critically the `**If not, DK point of contact:**` line. If CS cannot contact the vendor directly (`**Can CS contact vendor directly?** No`), the email must be routed through the DK internal contact (Elina for ETA, Yana for claims, Kirill for certain specialty vendors, Razel for claims — confirm from the actual file).
3. **Root `Issue resolution.md`** — cross-vendor fallback playbook for whatever the vendor-specific file doesn't cover (photo requirements, BOL attachments, typical turnaround expectations).

### Step 4 — Decide the routing

Based on `**Can CS contact vendor directly?**`:

- **Yes** → email goes directly to vendor's primary contact.
- **No** → email goes to the DK point of contact first (Elina, Yana, etc.). The vendor email is still drafted, but it's delivered by the DK contact, not sent by CS.
- **Blank or ambiguous** → default to sending to the DK contact and noting "please forward to vendor if routing permits" in the body. Don't send directly to a vendor when authorization is unclear.

### Step 5 — Compose the email

Output exactly these sections in this order:

```
## Routing
To: <primary email>
CC: <list — include DK contact if applicable, plus claims@dkhardwaresupply.com or equivalent if that's in the playbook>
Internal handoff: <Yes/No — if routing through DK contact, name them here>

## Subject
<subject line — see format rules below>

## Body

<greeting>

<one-line problem statement>

<3-5 bullet facts: PO #, order date, SKU, quantity, specific issue, photos attached>

<desired resolution>

<sign-off with DK brand + rep name placeholder>

## Attachments to prepare
- Photos (if damage/wrong-item — list specific shots needed per playbook)
- BOL (if freight)
- PO copy or invoice
- <any vendor-specific requirement>
```

### Step 6 — Subject line format

Lead with the claim type so the vendor's CS intake filters correctly:

- `Damage Claim — PO <number> — <Vendor SKU or brief description>`
- `Missing Item — PO <number> — <SKU>`
- `Wrong Item Received — PO <number> — <what we got vs what we ordered>`
- `RMA Request — Order <customer order #> — <SKU>`

If the playbook specifies a different subject format for that vendor, use theirs.

### Step 7 — Tone rules

- Direct, factual, one page or less. No apologizing for raising the claim; it's legitimate business.
- State the fact, state the ask, done. Don't build up the narrative.
- If the vendor has a history of being difficult (captured in Issue Resolution Notes), match the tone the playbook recommends — usually firmer and with internal CC as backup.
- Never commit to a timeline on behalf of the vendor in the email ("please resolve within 5 business days" is fine; "we need this tomorrow" is a pressure tactic that backfires unless escalated).

### Step 8 — Flag follow-up

At the bottom of your deliverable, append a **Follow-up** note telling the CS rep what to watch for:

- Expected turnaround (from the playbook, or "no guidance in the file — check back in 3 business days")
- Whether to log this in any tracker
- Escalation path if no response (who to ping internally, when)

## Examples

**Example 1 — direct contact, standard damage claim**

User: "The CRL shipment that came in yesterday — 2 glass panels arrived cracked. PO #DK-12883. Customer's asking for an update. Draft the claim email to CRL."

Flow:
1. Resolve: `Vendors/CRL/` — exact match.
2. Read `Vendors/CRL/CRL - Issue Resolution Notes.md` and `Vendors/CRL/CRL - Vendor Info.md`. CRL allows CS direct contact (`Can CS contact vendor directly? Yes`). Email: crl@crlaurence.com or askus@crlaurence.com.
3. Compose:

```
## Routing
To: crl@crlaurence.com
CC: askus@crlaurence.com, <internal claims alias>
Internal handoff: No — CS can contact CRL directly

## Subject
Damage Claim — PO DK-12883 — 2 cracked glass panels

## Body
Hi CRL team,

We received shipment on PO DK-12883 yesterday with 2 glass panels cracked in transit.

- PO #: DK-12883
- Delivery date: 2026-04-23
- SKU: <fill in from order>
- Quantity damaged: 2 of <total>
- Issue: Crack running the full length of each panel; damage consistent with insufficient packaging or rough handling
- Photos attached (panel face + edge shots + packaging)

Please advise on replacement ETA and whether you'd like the damaged units returned or destroyed.

Thanks,
<CS rep name>
DK Hardware Supply

## Attachments to prepare
- Photos: face-on of each cracked panel, close-up of the crack edge, packaging condition, BOL
- PO DK-12883 copy
- Delivery date stamp if on BOL

## Follow-up
- CRL typically responds within 2 business days per their standard terms
- If no response by 2026-04-28, escalate via phone (800-421-6144) and loop in the internal claims alias
- Update customer with ETA once received
```

**Example 2 — routed through DK internal contact**

User: "deltana sent us a damaged door pull, customer is pissed. write the claim"

Flow:
1. Resolve: `Vendors/Deltana/`.
2. Read files. Deltana's `Can CS contact vendor directly? No`. The DK point of contact is `Elina` per the Vendor Info.
3. Email goes to Elina first; she forwards or handles it with Deltana. The skill still drafts the vendor-facing text so Elina can use it.

```
## Routing
To: <Elina's internal DK email>
CC: <CS rep manager>
Internal handoff: Yes — Elina handles all Deltana claims. Do NOT email Elizabeth@deltana.net directly.

## Subject (for internal handoff — Elina can forward as-is)
Damage Claim — PO <number> — Deltana door pull

## Body (for Elina to send on, or for her to rewrite in her own style)
Hi Elizabeth,

We received shipment on PO <number> with 1 Deltana door pull arriving with finish damage — a gouge across the decorative face.

- PO #: <fill in>
- SKU: <fill in>
- Customer order affected: <customer PO or name>
- Issue: finish damage, not functional damage
- Photos attached

Please advise on replacement or credit. Happy to return the damaged unit if you'd like it back.

Thanks,
<DK — Elina will sign>

## Attachments to prepare
- Face-on photo of the damaged pull
- Close-up of the gouge
- PO copy

## Follow-up
- Elina owns the timeline on Deltana claims; CS should check in with her after 2 business days if the customer needs an ETA
- Customer comms template is in _shared_sops/Sales - Problem Order SOP.md
```

**Example 3 — vendor stub, fallback to cross-vendor playbook**

User: "wrong SKU from abaco - they sent us 100mm instead of 150mm. need to write them."

Flow:
1. Resolve: `Vendors/Abaco Machines/`.
2. Read. `Vendors/Abaco Machines/Abaco Machines - Issue Resolution Notes.md` is a stub (`_(to be filled)_`). Fall back to root `Issue resolution.md`.
3. Vendor Info shows `Can CS contact vendor directly? yes`, contact: Sales@abacomachines.com / csm2@abacomachines.com, phone 310-532-0366.
4. Compose using the cross-vendor playbook format. Note in the Follow-up section that the Abaco-specific playbook is not yet written — suggest the user capture the outcome in `Vendors/Abaco Machines/Abaco Machines - Issue Resolution Notes.md` once resolved, so the next wrong-SKU claim has specific guidance.

## Anti-patterns to avoid

1. **Don't email the vendor directly when `Can CS contact vendor directly? No`.** This is the single most important routing rule — skipping it can damage the vendor relationship or violate account terms. Route through the DK contact.
2. **Don't fabricate PO numbers, SKUs, or order dates.** If the user didn't give them, leave `<fill in>` placeholders and note what's needed.
3. **Don't commit to a vendor turnaround in the body.** "Please advise on ETA" is fine; "we need it in 48 hours" is rarely a good look unless backed by a true escalation path.
4. **Don't skip the Attachments section.** Claims without photos/BOLs are the #1 reason vendors reject them. Make the CS rep gather the evidence before sending.
5. **Don't write from Claude's perspective or first-person.** The email is from the CS rep; Claude is drafting. Use "<CS rep name>" or "<Your name>" as the sign-off placeholder.
6. **Don't output a polished email without the Follow-up section.** Half the value of a consistent claim flow is knowing when to escalate — leaving that off defeats the purpose.
