# General Flow - Order Processing

This document is the source of truth for non-vendor-specific order-processing
rules. It applies to customer orders, vendor orders, dropship orders, in-house
vendor orders, freight/oversize items, international orders, discontinued items,
NET 30 orders, expedited orders, payment checks, address checks, and general
customer communication.

When answering from the General tab, use only this file. Do not use
vendor-specific notes unless the user explicitly switches to a vendor context.

Purpose:

- Define mandatory end-to-end order processing rules.
- Support junior processors with step-by-step execution.
- Support senior operations with audit, escalation, and exception handling.

Non-compliance risks:

- Incorrect order flow.
- Fraud exposure.
- Shipping losses.
- Customer dissatisfaction.

---

## 1. Agent Response Contract

- Lead with the direct answer.
- Give the exact operational action the processor should take.
- Use the workflow or decision matrix below before giving exceptions.
- If the answer is not covered here, say that `general_flow.md` does not cover
  it.
- Do not invent vendor-specific instructions.
- End responses with `Sources: general_flow.md`.

---

## 2. Global Order Processing Rules

### 2.1 Processing Priority and Queue Order

1. Process customer orders from the bottom of the list toward the top.
2. Treat bottom-to-top processing as FIFO: first in, first out.
3. Expedited orders override FIFO.
4. Expedited orders must not wait more than 5-10 minutes.
5. Take immediate action on expedited orders.

Always avoid skipping older orders unless the skipped order is expedited.

### 2.2 Mandatory Status Updates

| Order type | Required status/action |
| --- | --- |
| Vendor orders: dropship or in-house | Change status to `Submitted to Vendor` after processing. |
| Customer orders | Use the correct system status and make sure required notes/attachments are present. |

Always avoid leaving vendor orders in an unsubmitted or draft status after they
have been processed.

### 2.3 Order Notes and Attachments

For customer orders:

- Always check the order notes.
- Attach order confirmation emails.
- Marketplace orders are the only exception to the confirmation-email attachment
  requirement.
- Add shipping charges, ETA issues, alternate items, and other discrepancies in
  order notes.
- Address all known issues at once to avoid repeated customer communications.

For NET 30 orders:

- A PO is mandatory.
- The PO must be attached.
- The PO must match the order's item names, quantities, and prices.
- If credit hold verification is needed, share the order with Art.

Always avoid processing NET 30 orders without a matching PO.

### 2.4 Payment and Address Verification

Applies to:

- Credit card orders.
- NET 30 orders.

Verification tools:

- Google.
- Whitepages.

Rules:

- Verify billing and shipping addresses when they do not match.
- For credit card orders, verify that the billing address matches.
- If the credit card billing address does not match, stop processing and
  escalate.
- If there are payment-detail issues or address discrepancies, escalate to the
  POCs.

Escalation path:

- POC.
- Toshiba.
- Art, for NET 30 credit hold verification.

---

## 3. Customer Order Processing

### 3.1 Standard Customer Order Workflow

1. Open the customer order.
2. Review billing address, shipping address, payment method, order notes, and
   attachments.
3. Verify payment method.
4. If billing and shipping addresses do not match, verify both addresses through
   Google or Whitepages.
5. If payment is by credit card and the billing address does not match, stop and
   contact the POC for verification.
6. Check every item's status:
   - In stock.
   - ETA available.
   - Discontinued.
7. Search for alternate items when applicable.
8. For international shipping, confirm the item can ship to the required
   country.
9. Add all necessary details to order notes:
   - Shipping charges.
   - ETA.
   - Alternate items.
   - Discrepancies or blockers.
10. Resolve or communicate all known issues in one customer contact whenever
    possible.

Always avoid drip-feeding issues to customers through multiple emails when the
issues can be gathered and sent together.

### 3.2 Payment or Address Issues

Use the `General Contact Request` email template when there are issues such as:

- Incorrect payment details.
- Payment verification problems.
- Incorrect customer address.
- Address verification problems.

If the issue is unresolved, move the order to the appropriate problem queue.

### 3.3 Discontinued or Out-of-Stock Items

If an item is discontinued and no replacement is available:

1. Move the order to `New Orders with Problems - Sales`.
2. Send a `General Contact Request` to the customer.

If an item is discontinued but an alternate item is available:

1. Search for and verify the alternate.
2. Offer the alternate item to the customer.

### 3.4 Expedited Customer Orders

If the customer requested 1-2 business day shipping:

1. Confirm the correct shipping method during checkout.
2. Use `Next Day` or `Second Day` as applicable.
3. If shipping cost exceeds the payment received, inform the customer about the
   price discrepancy before proceeding.

---

## 4. Vendor Order Processing - Dropship

### 4.1 Dropship Orders via Email

1. Use the correct vendor email template.
2. Remove internal product notes before sending.
3. Email the order to the vendor.
4. Wait for vendor acknowledgment before proceeding.
5. Confirm the correct shipping method, including expedited shipping when
   applicable.
6. Add this note when required: `PLEASE SHIP USING OUR FEDEX ACCOUNT #632647611`.
7. Save or attach the vendor acknowledgment/confirmation for internal records.
8. Change the order status to `Submitted to Vendor`.

Always avoid marking an email dropship order as submitted before receiving vendor
acknowledgment.

### 4.2 Dropship Orders via Vendor Website

1. Add items to the vendor website cart.
2. Verify item quantity and price.
3. Select the customer shipping address, not the DK Hardware warehouse address.
4. Copy and paste the PO number exactly from the internal order when prompted.
5. Select the correct shipping method, including expedited shipping when
   applicable.
6. Enter the FedEx account number in the appropriate section when required.
7. Ensure payment details are correct.
8. Save the order confirmation.
9. Change the order status to `Submitted to Vendor`.

Always avoid shipping dropship orders to the DK Hardware warehouse.

---

## 5. In-House Vendor Order Processing

### 5.1 In-House Orders via Vendor Website

1. Add items to the vendor website cart.
2. Verify item price and quantity.
3. Select the DK Hardware warehouse shipping address. It may be auto-selected or
   may need to be selected manually, depending on the vendor.
4. Copy and paste the PO number exactly from the internal order when prompted.
5. Confirm billing and shipping addresses before completing checkout.
6. Save the vendor order confirmation for internal records.
7. Change the order status to `Submitted to Vendor`.

### 5.2 In-House Orders via Email

1. Use the vendor-specific email template.
2. Email the order to the vendor.
3. Wait for vendor acknowledgment.
4. Save or attach the vendor acknowledgment/confirmation for internal records.
5. Change the order status to `Submitted to Vendor`.
6. Proceed with order fulfillment.

---

## 6. Freight, Oversize, and International Handling

### 6.1 Freight and Oversize Definition

Treat an item as freight/oversize if it meets any of these conditions:

- It is heavier than standard parcel limits.
- It is larger than 96 inches.
- It incurs additional shipping charges.
- It has excess weight.
- It has an added shipping surcharge.

### 6.2 Freight Processing Flow

1. Confirm item size, weight, and dimensions.
2. Coordinate with Kiril to get or update freight item weight and dimensions.
3. Share the order with Marina Kurillko for a shipping estimate.
4. For international freight, contact Justin Bennett for shipping coordination.

Always avoid guessing freight costs.

### 6.3 International Orders

1. Confirm with the vendor that the item can ship outside the US.
2. Verify that the item is available for international shipping.
3. If international shipping is not confirmed, stop and escalate.

---

## 7. Discontinued Items Handling

### 7.1 Identification

- Red text on the product page means the item is discontinued.
- A discontinued item is unavailable for ordering unless remaining stock or an
  ETA is confirmed.
- Double-check remaining stock and ETA before taking final action.

### 7.2 Action Paths

| Scenario | Action |
| --- | --- |
| Discontinued item with replacement available | Offer the alternate/replacement to the customer. |
| Discontinued item with no replacement available | Move to `New Orders with Problems - Sales` and email the customer. |

---

## 8. Customer Communication Rules

### 8.1 Email Standards

Attach confirmation emails in order notes for:

- NET 30 orders.
- Orders involving payment verification.

Use the correct template for the issue:

- `NOWP - ETA`.
- `NOWP - Shipping Charges`.
- `NOWP - Discontinued`.
- `NOWP - Discontinued with Replacement`.
- `General Contact Request`.

Use `General Contact Request` for:

- Payment issues.
- Incorrect payment details.
- Address issues.
- Incorrect customer address.
- Orders that cannot ship within 1-2 business days.

Always avoid free-form emails when a template applies.

### 8.2 One-Shot Customer Communication Rule

When there are shipping issues, delays, additional charges, ETA problems,
discontinued items, or replacement options:

1. Update order notes with all known issues.
2. Select the appropriate template.
3. Send one complete customer email whenever possible.

Always avoid repeated customer messages caused by incomplete issue gathering.

---

## 9. Decision Matrix

| Scenario | Order type | Required action | Status/queue | Escalation |
| --- | --- | --- | --- | --- |
| Expedited order | Any | Process immediately; do not let it wait more than 5-10 minutes. | Normal flow | None listed |
| NET 30 order without PO | Customer | Stop processing until PO is attached and matches item names, quantities, and prices. | Hold | Art if credit hold verification is needed |
| Billing and shipping do not match | Customer | Verify both addresses through Google or Whitepages. | Pending until verified | Toshiba/POC if unresolved |
| Credit card billing mismatch | Customer | Stop processing and escalate for verification. | Pending/hold | POC |
| Payment issue | Customer | Use `General Contact Request`; move to problem queue if unresolved. | Problem queue if unresolved | POC |
| Incorrect customer address | Customer | Use `General Contact Request`; verify address. | Problem queue if unresolved | POC |
| Discontinued item with no alternate | Customer | Move order to `New Orders with Problems - Sales` and email customer. | `New Orders with Problems - Sales` | Sales |
| Discontinued item with alternate | Customer | Offer alternate item to customer. | Per system | None listed |
| Dropship via email | Vendor | Send vendor email, wait for acknowledgment, save confirmation. | `Submitted to Vendor` after acknowledgment | None listed |
| Dropship via vendor website | Vendor | Ship to customer address, save confirmation. | `Submitted to Vendor` | None listed |
| In-house via vendor website | Vendor | Ship to DK Hardware warehouse, save confirmation. | `Submitted to Vendor` | None listed |
| In-house via email | Vendor | Send vendor email, wait for acknowledgment, save confirmation. | `Submitted to Vendor` | None listed |
| Freight or oversize item | Any | Confirm dimensions and get shipping estimate. | Hold until estimate | Kiril for dimensions; Marina Kurillko for estimate |
| International freight | Any | Coordinate international freight shipping. | Hold until coordinated | Justin Bennett |
| International order | Customer/vendor | Confirm vendor supports international shipping. | Hold/stop if unconfirmed | Escalate if unconfirmed |
| Multiple customer-facing issues | Customer | Gather all issues and communicate once. | Per system | None listed |

---

## 10. Quick Rule Sheet

- If expedited, process within 5-10 minutes.
- If NET 30, require a matching attached PO.
- If billing and shipping do not match, verify both.
- If credit card billing does not match, stop and escalate.
- If payment details are incorrect, use `General Contact Request`.
- If the customer address is incorrect, use `General Contact Request`.
- If discontinued with no alternate, move to `New Orders with Problems - Sales`.
- If discontinued with an alternate, offer the alternate to the customer.
- If dropship, ship to the customer.
- If in-house, ship to the DK Hardware warehouse.
- If freight or oversize, never guess shipping costs.
- If international, confirm vendor can ship outside the US.
- If vendor order, status must become `Submitted to Vendor`.
- If there are multiple issues, communicate them once.

---

## 11. What This File Is Not

- Not a vendor directory. Use `Vendor Information.md` or `Vendors/<Vendor>/`
  only when the user is in a vendor-specific context.
- Not a vendor-specific claims playbook. Use `Issue resolution.md` or vendor
  notes only when appropriate.
- Not a sales SOP. Use `_shared_sops/` for sales-specific workflows.
