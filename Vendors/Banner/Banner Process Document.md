# **VENDOR - BANNER SOLUTIONS**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Rules

1.2 Order Types & How to Process

1.3 Discontinued Item Handling

1.4 Special Scenarios & Edge Cases

**SECTION 2 — PROCESSING ORDERS**

2.1 Processing a Customer Order — Dropship (Post-Quote Workflow)

2.2 Processing a Customer Order — Expedited Orders

**SECTION 3 — DECISION MATRIX**

3.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Backorders

Table 2 - Master Decision Matrix (All Scenarios)

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Rules**

  - > Banner vendor orders are processed directly on the vendor website.

  - > Minimum Order Value (MOV) requirement for this vendor is $150 for all order types.

  - > Dropship is carried through FedEx Only.

  - > Expedited Orders require shipping cost verification before processing.

  - > Blind Shipping is mandatory for all dropship orders.

  - > Discontinued Items should never be processed and customer must be notified.

  - > Vendor acknowledgment is mandatory before order is considered placed.

### **1.2 Order Types & How to Process**

#### **1.2.1 In-House Orders**

**When to Use:**

  - > Item ships to DKH warehouse

  - > Item is not dropship-only

  - > Order meets $150 MOV

**How to Process:**

1.  > Confirm item is available and purchasable

2.  > Place order via vendor website

3.  > Select Standard Ground (vendor’s carrier)

4.  > Complete checkout

⚠️ **Never place in-house orders for discontinued or special-order items without Sales approval.**

#### **1.2.2 Dropship Orders**

**When to Use:**

  - > Item ships directly to customer

  - > Order meets $150 MOV

  - > Item is in stock OR approved via quote

**Mandatory Dropship Steps:**

1.  > Confirm item is not discontinued

2.  > Enter customer shipping address

3.  > Add FedEx account \# in order notes

4.  > Select Blind Shipping

5.  > Review for oversize or handling charges

⚠️ **Failure to blind ship exposes vendor pricing — this is a compliance breach.**

**1.3 Discontinued Item Handling**

### **1.3.1 How to Identify Discontinued Items:**

An item is DISCONTINUED if ANY of the following occur:

  - > Item page states “Discontinued” / “No longer available”

  - > Item appears available but shows discontinued in cart

  - > Item cannot be added to cart, even with ETA shown

### **1.3.2 Required Action:**

❌ **DO NOT :**

  - > Create PO

  - > Submit order

  - > Request dropship

✅ **DO :**

  - > Notify customer immediately

  - > Offer:
    
      - > Alternative item
    
      - > Backorder (ONLY if valid ETA exists)
    
      - > Refund

📌 **If discontinued status appears AFTER adding to cart → treat as discontinued.**

**1.4 Special Scenarios & Edge Cases**

### **1.4.1 Special Order Items**

**Definition:**

  - > Item marked as ‘Special Order’

  - > Pricing or availability requires vendor confirmation

**Process:**

  - > Move order to **Sales for vendor quote**

  - > Validate:
    
      - > Item
    
      - > Quantity
    
      - > Price

  - > Once approved → process as dropship order

❌ **Never submit special orders without a confirmed quote.**

### **1.4.2 Backorders**

Table 1

| **ETA**              | **Action**                                  |
| -------------------- | ------------------------------------------- |
| ≤ 30 days            | Proceed ONLY after customer acknowledgement |
| \> 30 days / Unknown | Notify customer → offer wait or cancel      |

📌 **Backorders without ETA are treated as high-risk and require customer confirmation.  
**

### **1.4.3 Oversize / Heavy Items**

**Processor Must:**

  - > Check checkout screen for:
    
      - > Oversize fees
    
      - > Handling charges

  - > Pause order if extra fees appear

**Action:**

  - > Notify customer

  - > Get approval **before checkout**

⚠️ **Never absorb oversize charges without approval.**

**SECTION 2 — PROCESSING ORDERS**

## **2.1 PROCESSING A CUSTOMER ORDER — DROPSHIP (Post-Quote Workflow)**

### **2.1.1 Step 1 — Vendor Quote Validation**

Verify:

  - > Correct item

  - > Correct quantity

  - > Correct price

### **2.1.2 Step 2: System Actions**

  - > Move order to **Dropship system**

  - > Mark as **Submitted to Vendor**

  - > Remove **item-level notes**

  - > Print PO

  - > Save with correct PO naming convention

### **2.1.3 Step 3: Vendor Email Submission**

**To**: Vendor Rep  
**CC**: Sales Rep

**Subject:** Please Convert This Quote into an Order

**Email Body (MANDATORY FORMAT):**

Please convert this quote into an order.

DKH-2755808

Please change the shipping address to:

{{Example}}  
Drew Caldwell  
Titan Manufacturing, Inc.  
1425 NE Greenwood Ave  
Redmond OR 97756  
United States

PLEASE SHIP USING OUR FEDEX ACCOUNT \# 632647611

PLEASE BLIND SHIP

### **2.1.4 Step 4: Attach PO  
**  
**2.1.5 Step 5: Paste customer address in email body  
** 📌 If item cost \< $150 → FedEx line is still mandatory

### **2.1.6 Step 6: Confirmation & Follow-Up**

  - > Await vendor confirmation

  - > If no response in 24 hours → follow up

\------------------------------------------------------------------------------------------------------------------------

## **2.2 PROCESSING A CUSTOMER ORDER — EXPEDITED DROPSHIP**

### **2.2.1 Mandatory Verification**

Verify:

  - > Add item to cart

  - > Enter customer address

  - > Review shipping cost

### **2.2.2 Decision Logic:**

  - > Customer paid correct shipping → Proceed with processing steps discussed in Section 2.1

  - > Customer underpaid → Contact customer for approval and after approval, only then process the order as per steps discussed in Section 2.1

❌ **Never guess or assume expedited shipping cost.**

## 

**SECTION 3 — DECISION MATRIX**

Table 2 - Banner Solutions Processing Decision Matrix

| **Scenario**         | **MOV ≥ $150** | **In Stock** | **Discontinued** | **ETA** | **Action**              |
| -------------------- | -------------- | ------------ | ---------------- | ------- | ----------------------- |
| In-house, available  | Yes            | Yes          | No               | N/A     | Place order             |
| Dropship, available  | Yes            | Yes          | No               | N/A     | Dropship w/ FedEx       |
| Discontinued item    | Any            | Any          | Yes              | Any     | Stop → Notify customer  |
| Backorder ≤ 30 days  | Yes            | No           | No               | ≤30d    | Confirm → Proceed       |
| Backorder \> 30 days | Yes            | No           | No               | \>30d   | Notify → Wait/Cancel    |
| Special order        | Any            | Any          | No               | Any     | Send to Sales for quote |
| Oversize fee appears | Yes            | Yes          | No               | N/A     | Get customer approval   |
| Expedited order      | Yes            | Yes          | No               | N/A     | Verify shipping cost    |
| MOV \< $150          | No             | Any          | Any              | Any     | Do NOT process          |
