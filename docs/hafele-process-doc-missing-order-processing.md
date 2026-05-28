# Hafele Process Document Missing Order-Processing Steps

Compared with `docs/orders_sample.md`, these Hafele order-processing parts are not present or are only partially present in `Vendors/Hafele/Hafele Process Document_v2.md`.

## Missing Or Partial Sections

### 1. Customer And Payment Verification

The sample Hafele flow includes customer verification before processing:

- Check billing and shipping address against customer details.
- Use Google and Whitepages to verify the customer/address relationship.
- Check the payment method.
- For credit-card payments, confirm postal code shows `(M)` and street address shows `(M)`.
- If both AVS values do not match, verify the customer more thoroughly.
- Check whether the customer has previous orders with the same credit card and addresses.
- For ApplePay, PayPal, and AmazonCheckout, no thorough payment verification is required, but the address should still be checked with Google Maps or Bing Maps.

The Hafele process document only mentions address confirmation in the fulfillment workflow. It does not document this customer/payment verification step.

### 2. PO Box Handling

The sample flow says that if the shipping address is a PO Box, it is advisable to move the order In-House.

The Hafele process document does not mention PO Box routing.

### 3. Detailed Hafele Item Check

The sample flow includes specific Hafele website checks:

- Click the item code to open the item page on the vendor website.
- Enter the required quantity in the quantity field below the item.
- Wait for the page to load and show entered quantity and stock.
- Compare the item on the vendor website against the DK website item page.
- Confirm item code, item description, and item specifications match.

The Hafele process document says to check stock, ETA, and pricing, but it does not include the exact quantity-entry stock check or item-code/specification comparison.

### 4. Process Incoming Order Page Workflow

The sample flow includes an order-processing step before PO creation:

- Click the blue `Process incoming Order page` button.
- Assign the item quantity in the first box.
- Click `Authorize and charge`.
- Select `Create new order`.
- Choose the `dropship` option.
- Click `Process Changes` to create the dropship.

The Hafele process document starts from `Backoffice -> Create PO` and does not document this earlier workflow.

### 5. Opening The Dropship Vendor Order From Order Notes

The sample flow says to open the Dropship Vendor Order by:

- Going back to the customer order.
- Scrolling to order notes.
- Finding the note that item quantity was assigned to an order.
- Clicking that order to open the Dropship Vendor Order.

The Hafele process document does not describe this navigation step.

### 6. Specific PO Submission UI Steps

The sample flow includes exact UI instructions:

- Check the vendor order one last time.
- Confirm correct quantities are assigned.
- Click `CREATE PO` on the right side.
- For non-expedited dropship orders, do not change the shipping method.
- Click `PLACE ORDER`.

The Hafele process document covers Create PO, Standard Ground, and Submit PO conceptually, but it does not include these exact UI steps.

### 7. Replacement Order Workflow

The sample includes a Hafele replacement-order flow:

- Replacement orders must be approved by Vitali and Ksenia before processing.
- Check order notes for an `APPROVED` note from Vitali or Ksenia.
- Most replacement orders are processed as coming In-House until approved by Elina.
- Replacement orders do not have a payment method because the customer paid on the original order.
- Open the original order to understand why the replacement was created.
- Process the replacement as coming In-House.
- On the process incoming order page, assign item quantity, click `Authorize and charge`, select the already-created order from the dropdown, and click `Process Changes`.

The Hafele process document has issue and exception routing, but it does not include an actual replacement-order processing workflow.

## Not Hafele-Specific

The Emery Jensen example in `docs/orders_sample.md` is for a different vendor, so it should not be treated as missing from the Hafele process document.
