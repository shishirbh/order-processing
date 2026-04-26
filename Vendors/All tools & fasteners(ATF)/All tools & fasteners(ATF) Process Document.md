# **VENDOR - ATF**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Rules

1.2 Stock Availability & Inventory Control

1.3 Order Type Rules

1.4 High-Value Order Handling

**SECTION 2 — PROCESSING ORDERS**

2.1 Pre-Processing Verification Requirements

2.2 Processing a Customer Order — In-House

**SECTION 3 — DECISION MATRIX**

3.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Order Type Rules

Table 2 - Master Decision Matrix (All Scenarios)

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Rules**

  - > All AFT orders must be processed in-house.

  - > Inventory replenishment is managed by Yana.

  - > Dropshipping is not permitted under any circumstances.

  - > If the order value is very high, share the order with Yana to check if dropship is allowed as an exception.

  - > AFT functions as an internal stock supplier rather than a direct-to-customer shipper.

  - > All ATF vendor orders are submitted weekly by Yana.

  - > 1-Day and 2-Day Business shipping is NOT supported.

  - > AFT customer orders are processed via Backoffice only.

  - > Never promise faster shipping to customers for ATF orders.

### **1.2 Stock Availability & Inventory Control**

  - > Customer orders may be fulfilled **only from available inventory**.

  - > If an item is not in stock, the order must remain on hold until inventory is replenished (managed by Yana).

  - > Purchasing agents must **not create restock orders**.

### **1.3 Order Type Rules**

Table 1

| **Rule Area**      | **Standard Behavior**    |
| ------------------ | ------------------------ |
| Fulfillment        | In-House only            |
| Dropship           | Prohibited by default    |
| High-Value Orders  | Must be reviewed by Yana |
| Vendor Submission  | Weekly batch             |
| Expedited Shipping | Not supported            |

### **1.4 High-Value Order Handling**

If order value is unusually high (relative to typical ATF orders):

  - > Pause processing

  - > Share order details with Yana

  - > Await decision on:
    
      - > In-House continuation OR
    
      - > One-time dropship approval

❌ Never assume high value = dropship allowed. Approval is mandatory.

## 

**SECTION 2 — PROCESSING ORDERS**

# **2.1 PRE-PROCESSING VERIFICATION REQUIREMENTS**

Before processing any AFT order:

2.1.1 Step 1 — Open the Customer Order in Back Office.

2.1.2 Step 2 — Review customer details and payment information.

2.1.3 Step 3 — Confirm the order appears legitimate.

2.1.4 Step 4 — Click the DK item link and verify:

  - > description

  - > model number

  - > specifications

2.1.5 Step 5 — Open Item Order History and review for:

  - > backorders

  - > notes

  - > delays

2.1.6 Step 6 — If any information is unclear, stop and verify before proceeding.

**2.2 PROCESSING CUSTOMER ORDER — IN-HOUSE**

Order Creation Procedure once all verifications are complete:

2.2.1 Step 1 — Click Processing.  
  
2.2.2 Step 2 — Assign the item to AFT  
  
2.2.3 Step 3 — Select Create In-House Order.  
  
2.2.4 Step 4 — Open the order via the system hyperlink.

This action sends the request to the warehouse for picking, packing, and shipping.

## 

**SECTION 3 — DECISION MATRIX**

Table 2 - AFT Processing Decision Matrix

| **Scenario**                   | **Stock OK** | **Fraud OK** | **Order Value** | **Dropship Allowed?**   | **Action**                   |
| ------------------------------ | ------------ | ------------ | --------------- | ----------------------- | ---------------------------- |
| Normal ATF order               | Yes          | Yes          | Normal          | No                      | Create In-House Order        |
| High-value ATF order           | Yes          | Yes          | High            | Only with Yana approval | Pause → Escalate             |
| Fraud suspicion                | Any          | No           | Any             | No                      | Stop & Escalate              |
| Stock history issues           | No           | Yes          | Any             | No                      | Clarify stock                |
| Request for expedited shipping | Yes          | Yes          | Any             | No                      | Reject request               |
| Explicit Yana approval         | Yes          | Yes          | High            | Yes                     | Follow approval instructions |
