# Vendor SOP — Hafele

| Field | Value |
|---|---|
| Parent brand | — |
| Aliases / sub-brands | Hafele, Häfele, Hafele America Co. |
| Tier | 1 |
| Scope | Primary |
| Parent SOP | — |
| Document version | 2026-05-26 |
| Owner | Operations |
| Source-of-truth contact | See `Hafele - Vendor Info.md` |

## Section 1. Vendor Overview

### 1.1 Vendor Identity

Hafele is a vendor that supports Dropship and In-House processing through Backoffice PO creation. The Hafele website is used for stock availability, ETA checks, discontinued-item review, free-item identification, and vendor pricing validation.

### 1.2 Contact Routing

For contact details, use `Hafele - Vendor Info.md`.

- Primary contact: Rhandy Diaz
- Order email: `orders@hafele.us`
- Phone: `800-423-3531` for general inquiries; `954-218-0294` for Rhandy escalations
- CS may contact the vendor directly.
- Claims, missing items, wrong items, defects, returns, and RMAs route through `Hafele - Issue Resolution Notes.md` first, then root `Issue resolution.md`.

### 1.3 Account & Portal Setup

- Primary processing system: Backoffice → Create PO
- Vendor website use: stock checks, ETA checks, discontinued-item checks, free-item checks, and price validation
- Shipping account: vendor does not ship under DK's account
- Expedited availability: next day only

Create PO is available only when the order status is `New`. If the status is not `New`, stop and resolve the status before creating the PO.

### 1.4 Glossary

| Term | Meaning |
|---|---|
| In-House | Ships to DK / handled as coming in-house |
| Dropship | Vendor ships direct to customer |
| VO | Vendor Order — the PO DK sends to Hafele |
| Customer Order | The order DK's customer placed with DK |
| MOV | Minimum Order Value — dollar threshold |
| ETA | Estimated Time of Arrival |
| HAWA | Hafele sliding-system collections that require salesperson review and signed quote |

## Section 2. Order Rules

### 2.1 Fulfillment Decision

- Required: ✅ Dropship orders above the MOV when the item is eligible and in stock.
- Required: ✅ Process as In-House when the order is below MOV.
- Required: ✅ Process as In-House for international orders, Canada, Hawaii, Alaska, Puerto Rico, and all marketplace orders.
- Required: ✅ Use Backoffice → Create PO for In-House, standard Dropship, and next-day Dropship orders.
- Do not: ❌ Create a PO unless the order status is `New`.
- Do not: ❌ Dropship out-of-stock items.
- Do not: ❌ Process HAWA collection items without salesperson involvement and a signed quote.

### 2.2 Eligibility Constraints

- MOV: $10. (Updated in Vendor Info on 2026-05-15)
- Dropship eligibility: dropship everything above $10, including items with cutting instructions and orders to non-tax-exempt states. (Updated in Vendor Info on 2026-05-19)
- In-House-only exceptions: international, Canada, Hawaii, Alaska, Puerto Rico, and marketplace orders. (Updated in Vendor Info on 2026-05-19)
- Expedited eligibility: next day only.
- Backorder / ETA gate: if ETA is more than 1 month, inform the customer before processing.

### 2.3 Pricing & Fees

- Hafele does not ship under DK's account.
- Standard Ground is available through Backoffice PO creation.
- FedEx Next Day is available for eligible expedited orders.
- Price differences must be adjusted to match the Hafele website.
- No manual overrides beyond vendor pricing.
- Legacy note from the prior SOP said freight items above MOV received free shipping. Confirm before relying on that rule; see Open Gaps.

### 2.4 ETA & Lead Times

- In-House ETA from the prior SOP: generally 5–6 days.
- Backordered items show ETA on the Hafele portal.
- ETA ≤ 1 month: process without informing the customer.
- ETA > 1 month: inform the customer before processing.

### 2.5 Always Avoid

- Do not create a PO when the Customer Order status is not `New`.
- Do not proceed without stock confirmation.
- Do not enter the customer's address for In-House orders.
- Do not place next-day orders without reviewing shipping cost.
- Do not absorb a large next-day shipping cost difference without customer approval.
- Do not process discontinued items before informing the customer and offering alternatives when available.
- Do not process HAWA collection items without salesperson support and signed quote.

### 2.6 Discontinued Items & Alternatives

- Discontinued items show as unavailable in red on the Hafele portal.
- If an item is discontinued, do not process the order immediately.
- Inform the customer.
- Offer alternatives if available.

### 2.7 Free Item Handling

- Free items appear below the main item on the Hafele product page.
- Copy the free item code and quantity.
- Free item quantity may differ from the ordered quantity; proceed with the free item quantity shown by Hafele.
- Paste the free item code and quantity into item notes on the order.

### 2.8 HAWA Collections

Any order for HAWA collections requires a salesperson working with the customer and a signed quote before processing. HAWA products are sliding systems that are expensive, require many components, and need a thorough understanding of what the customer is buying and needs.

## Section 3. Processing Workflows

### 3.1 In-House Vendor Order

**When to use:** Use for orders below MOV, marketplace orders, international / restricted-region orders, and any order that cannot be Dropshipped.

**Pre-checks:**
- Required: ✅ Customer Order status is `New`.
- Required: ✅ Create PO option is available in Backoffice.
- Required: ✅ Stock and ETA have been checked on the Hafele website.
- Do not: ❌ Use the customer's shipping address for In-House orders.

**Steps:**

**Step 1 — Verify Order Status**
- Confirm the Customer Order status is `New`.
- System: Backoffice
- Expected outcome: Create PO is available.

**Step 2 — Verify Stock and ETA**
- Check all items on the Hafele website.
- If any item is out of stock, review the portal ETA.
- If ETA is more than 1 month, inform the customer before processing.
- System: Hafele website
- Expected outcome: Stock and ETA are known before PO creation.

**Step 3 — Create Vendor Order**
- Navigate to Backoffice → Create PO.
- Select In-House as the fulfillment method.
- System: Backoffice
- Expected outcome: In-House Vendor Order draft is created.

**Step 4 — Assign Shipping Address**
- Use the saved DK warehouse address.
- Do not enter the customer's address.
- System: Backoffice
- Expected outcome: PO ships to DK / warehouse address.

**Step 5 — Verify PO Details**
- Enter the correct PO number.
- Confirm item quantities and pricing match the Customer Order and Hafele website.
- Add free item code and quantity in item notes when applicable.
- System: Backoffice / Hafele website
- Expected outcome: PO matches customer order and vendor pricing.

**Step 6 — Submit PO**
- Submit the PO in Backoffice.
- Copy the Hafele reference number.
- System: Backoffice
- Expected outcome: PO is submitted to Hafele.

**Step 7 — Record Reference**
- Paste the Hafele reference number into the order record immediately.
- System: Backoffice
- Expected outcome: Order record contains vendor reference for follow-up.

**Submission template:** n/a — Backoffice PO creation.

**Post-submission:**
- Record the Hafele reference number.
- Add notes for ETA, free items, discontinued alternatives, or customer approval when applicable.

### 3.2 Dropship — Standard Ground

**When to use:** Use for eligible orders above the $10 MOV when items are in stock and the order is not marketplace, international, Canada, Hawaii, Alaska, or Puerto Rico.

**Pre-checks:**
- Required: ✅ Customer Order status is `New`.
- Required: ✅ Order value is above MOV.
- Required: ✅ All items are in stock on the Hafele website.
- Do not: ❌ Dropship marketplace, international, Canada, Hawaii, Alaska, or Puerto Rico orders.
- Do not: ❌ Dropship discontinued or out-of-stock items without customer communication.

**Steps:**

**Step 1 — Verify Order Status**
- Confirm the Customer Order status is `New`.
- Confirm Create PO is available.
- System: Backoffice
- Expected outcome: Order is ready for PO creation.

**Step 2 — Verify Dropship Eligibility**
- Confirm order value is above $10.
- Confirm the destination is not international, Canada, Hawaii, Alaska, or Puerto Rico.
- Confirm the order is not a marketplace order.
- System: Backoffice
- Expected outcome: Order qualifies for standard Dropship.

**Step 3 — Verify Stock, ETA, and Pricing**
- Check stock availability on the Hafele website.
- Check ETA if any item is not immediately available.
- Match pricing to the Hafele website.
- System: Hafele website
- Expected outcome: Stock, ETA, and pricing are confirmed.

**Step 4 — Create Vendor Order**
- Navigate to Backoffice → Create PO.
- Select Dropship as the fulfillment method.
- System: Backoffice
- Expected outcome: Dropship Vendor Order draft is created.

**Step 5 — Assign Customer Address**
- Enter the customer's shipping address.
- Confirm address accuracy before submission.
- System: Backoffice
- Expected outcome: PO is set to ship direct to customer.

**Step 6 — Submit PO**
- Select Standard Ground unless the order is approved for next-day expedited processing.
- Submit the PO in Backoffice.
- Copy the Hafele reference number.
- System: Backoffice
- Expected outcome: Dropship PO is submitted to Hafele.

**Step 7 — Record Reference**
- Paste the Hafele reference number into the order record immediately.
- Record any customer communication, ETA note, free-item note, or discontinued-item note.
- System: Backoffice
- Expected outcome: Order record is complete for follow-up.

**Submission template:** n/a — Backoffice PO creation.

**Post-submission:**
- Record the Hafele reference number.
- Confirm any relevant ETA or exception notes are visible in the order record.

### 3.3 Dropship — Expedited (Next Day Only)

**When to use:** Use only when the customer selected or approved next-day shipping and the item is in stock.

**Pre-checks:**
- Required: ✅ Customer Order status is `New`.
- Required: ✅ All items are in stock on the Hafele website.
- Required: ✅ Customer shipping address is verified.
- Required: ✅ Next-day shipping cost is reviewed.
- Do not: ❌ Process 2nd Day Air as active expedited Hafele procedure unless Vendor Info is updated.
- Do not: ❌ Absorb a large shipping-cost difference without customer approval.

**Steps:**

**Step 1 — Verify Order Status**
- Confirm the Customer Order status is `New`.
- Confirm Create PO is available.
- System: Backoffice
- Expected outcome: Order can be processed through Create PO.

**Step 2 — Verify Stock**
- Verify all items are in stock on the Hafele website.
- If any item is out of stock, do not proceed as next-day expedited.
- System: Hafele website
- Expected outcome: Items are confirmed available for next-day processing.

**Step 3 — Create Vendor Order**
- Navigate to Backoffice → Create PO.
- Select Dropship as the fulfillment method.
- System: Backoffice
- Expected outcome: Dropship Vendor Order draft is created.

**Step 4 — Assign Customer Address**
- Enter the customer's shipping address.
- Confirm address accuracy before proceeding.
- System: Backoffice
- Expected outcome: PO is addressed correctly for direct shipment.

**Step 5 — Assign Shipping Method**
- Select FedEx Next Day.
- Review the next-day shipping cost.
- System: Backoffice
- Expected outcome: Next-day shipping method and cost are visible before submission.

**Step 6 — Confirm Cost Approval**
- If shipping cost is within the customer-paid amount, allowing only a small difference, proceed.
- If shipping cost is significantly higher, inform the customer and obtain approval before proceeding.
- System: Backoffice / customer communication channel
- Expected outcome: Shipping cost is approved before submission.

**Step 7 — Verify PO Details**
- Enter the Dropship PO number.
- Confirm item quantities and pricing match the Customer Order and Hafele website.
- System: Backoffice / Hafele website
- Expected outcome: PO is accurate.

**Step 8 — Submit PO**
- Submit the PO in Backoffice.
- Copy the Hafele reference number.
- System: Backoffice
- Expected outcome: Next-day Dropship PO is submitted to Hafele.

**Step 9 — Record Reference**
- Paste the Hafele reference number into the order record immediately.
- Record customer approval when shipping cost was higher than expected.
- System: Backoffice
- Expected outcome: Order record contains vendor reference and approval notes.

**Submission template:** n/a — Backoffice PO creation.

**Post-submission:**
- Record the Hafele reference number.
- Record shipping-cost approval when applicable.

### 3.5 Special Order / Quote

**When to use:** Use for HAWA collections and any order requiring salesperson review, signed quote, or vendor-specific quote validation.

**Pre-checks:**
- Required: ✅ Salesperson is working with the customer.
- Required: ✅ Signed quote is available before processing.
- Do not: ❌ Process HAWA collection items as a normal Dropship or In-House order.

**Steps:**

**Step 1 — Verify Quote Requirement**
- Identify whether the order contains HAWA collection items or another quote-required configuration.
- System: Customer Order / Hafele website
- Expected outcome: Quote-required items are identified before processing.

**Step 2 — Confirm Sales Review**
- Confirm a salesperson is working with the customer.
- Confirm the signed quote is available.
- System: Internal sales communication / order notes
- Expected outcome: Required sales review is complete.

**Step 3 — Create Vendor Order**
- After signed quote confirmation, create the PO through Backoffice if the order is approved to proceed.
- System: Backoffice
- Expected outcome: PO is created only after quote approval.

**Step 4 — Record Quote Details**
- Record quote reference, salesperson involvement, and any customer approval in order notes.
- System: Backoffice
- Expected outcome: Order record contains the quote trail.

**Submission template:** n/a — Backoffice PO creation unless a vendor quote request is needed.

**Post-submission:**
- Keep signed quote and approval context visible in order notes.

### 3.6 International / Restricted Region

**When to use:** Use for international, Canada, Hawaii, Alaska, Puerto Rico, and marketplace orders.

**Pre-checks:**
- Required: ✅ Destination and marketplace status have been checked.
- Required: ✅ Order is routed as In-House.
- Do not: ❌ Dropship restricted-region or marketplace orders unless Vendor Info is updated.

**Steps:**

**Step 1 — Verify Restricted Status**
- Check destination country/state/region.
- Check whether the order is a marketplace order.
- System: Backoffice
- Expected outcome: Restricted-region or marketplace status is confirmed.

**Step 2 — Assign In-House Workflow**
- Process using §3.1 In-House Vendor Order.
- System: Backoffice
- Expected outcome: Order is handled as coming In-House.

**Step 3 — Record Routing Reason**
- Add an order note explaining why the order was processed In-House.
- System: Backoffice
- Expected outcome: Restricted-region / marketplace routing is auditable.

**Submission template:** n/a — Backoffice PO creation.

**Post-submission:**
- Follow §3.1 post-submission steps.

## Section 5. Decision Matrix

| Scenario | Condition | Action | Workflow | Notes |
|---|---|---|---|---|
| Below MOV | Order value < $10 | Process as In-House | §3.1 | Confirm whether any exception applies before PO creation. |
| Standard Dropship | Order value > $10 AND item in stock AND destination eligible | Process as standard Dropship | §3.2 | Vendor Info says dropship everything above $10. |
| Marketplace order | Any marketplace order | Process as In-House | §3.1 | Marketplace orders are In-House-only exceptions. |
| International / restricted region | International, Canada, Hawaii, Alaska, or Puerto Rico | Process as In-House | §3.6 | Do not Dropship unless Vendor Info changes. |
| In-House order | Stock available | Create PO to DK warehouse | §3.1 | Prior SOP ETA: generally 5–6 days. |
| Backorder / long ETA | ETA > 1 month | Inform customer before processing | §3.1 or §3.2 | Applies to In-House, Dropship, and expedited checks. |
| Next-day expedited | Customer approved next-day AND items in stock | Process as next-day Dropship | §3.3 | Hafele expedited availability is next day only. |
| High next-day shipping cost | Shipping cost significantly exceeds customer-paid amount | Get customer approval before PO submission | §3.3 | Record approval in order notes. |
| 2nd Day Air request | Customer requests 2nd Day Air | Do not process as active expedited workflow | §3.3 | Vendor Info says expedited is only next day. Add to Open Gaps if business wants review. |
| Discontinued item | Item unavailable / discontinued on portal | Inform customer and offer alternative | §2.6 | Do not process immediately. |
| Free item present | Hafele product page shows free item | Copy free item code and quantity to notes | §2.7 | Free item quantity may differ from ordered quantity. |
| HAWA collection | Order contains HAWA products | Require salesperson and signed quote | §3.5 | Do not process as normal Dropship or In-House. |

## Section 6. Issue & Exception Routing

For Hafele order issues, check `Hafele - Issue Resolution Notes.md` first. If no vendor-specific rule exists there, use root `Issue resolution.md`.

Process docs should not duplicate damage, missing-item, wrong-item, defect, return, or RMA handling. Keep those details in the issue-resolution files.

## Open Gaps

| Gap | Needed From | Owner | Status | Last Checked |
|---|---|---|---|---|
| Confirm whether the old `$30` MOV and free-freight-above-MOV language is fully superseded by Vendor Info's `$10` MOV. | Vendor Info owner / Procurement | Operations | Open | 2026-05-26 |
| Confirm whether any 2nd Day Air Hafele workflow should remain active; Vendor Info currently says expedited is only next day. | Vendor Info owner / Procurement | Operations | Open | 2026-05-26 |
| Confirm current standard-ground freight/free-shipping behavior for Hafele orders above MOV. | Vendor / Procurement | Operations | Open | 2026-05-26 |
| Populate Hafele-specific issue-resolution rules, if any. | CS / Claims owner | Operations | Open | 2026-05-26 |

## Changelog

| Date | Owner | Change |
|---|---|---|
| 2026-05-26 | Operations | Rewrote Hafele process document into the rev 3 Vendor SOP template; aligned active rules to newer Vendor Info where conflicts existed. |
