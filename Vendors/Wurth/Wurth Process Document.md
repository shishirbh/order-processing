# **VENDOR - WURTH**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Rules

1.2 Mandatory Vendor Charges

1.3 Order Types and Processing Methods

1.4 Freight and Fee Awareness

1.5 Exception Handling & Edge Cases

**SECTION 2 — PROCESSING ORDERS**

2.1 Processing a Vendor Order — In-House Only

**SECTION 3 — DECISION MATRIX**

3.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Mandatory Vendor Charges

Table 2 - Order Types and Processing Methods

Table 3 - ETA

Table 4 - Master Decision Matrix (All Scenarios)

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Rules**

  - > Wurth vendor orders are processed directly on the vendor website.

  - > There are no Minimum Order Value (MOV) requirements for this vendor.

  - > Fulfillment Type for all orders is In-House Only

  - > Dropship orders are not allowed.

  - > Expedited orders are not allowed.

**ALWAYS AVOID:**

❌ Attempting dropship checkout  
❌ Processing expedited shipping requests  
❌ Using email or phone orders

### **1.2 Mandatory Vendor Charges**

Table 1

| **Charge Type**                       | **Amount** | **Applies When**                                 |
| ------------------------------------- | ---------- | ------------------------------------------------ |
| Standard Freight                      | $12.50     | Every order                                      |
| Long Item Fee                         | $185.00    | Any item \> 95 inches                            |
| Dropship / Ship from Manufacturer Fee | Variable   | Item-level (even though dropship is not allowed) |

⚠️ **Critical Note:  
  
→** Even though Wurth **does not dropship**, items marked **“Dropship (Ship from Manufacturer)”** may still carry **additional freight charges**.

→ These charges must be **accounted for**, not ignored.

**1.3 ORDER TYPE & PROCESSING METHOD**

Table 2

| **Order Type**             | **Allowed** | **Ordering Method** |
| -------------------------- | ----------- | ------------------- |
| Standard Ground (In-House) | ✅ YES       | Vendor Portal       |
| Dropship                   | ❌ NO        | —                   |
| 1–2 Business Day           | ❌ NO        | —                   |

⚠️ **Always Avoid:** Forcing restricted order types through the vendor portal/website.

**1.4 FREIGHT & FEE AWARENESS**

Before finalizing, always confirm:

  - > $12.50 standard freight included

  - > $185 long item fee applied if any item \> 95”

  - > Additional freight on “Ship from Manufacturer” items accounted for

⚠️ **Always Avoid:**

  - > Assuming freight is “included”

  - > Ignoring item-level freight flags

## **1.5 Exception Handling & Edge Cases**

### **1.5.1 Item Over 95 Inches**

  - > Automatically incurs $185 long item fee

  - > Fee applies per order, not per item unless vendor specifies otherwise

### **1.5.2 Item Marked “Dropship (Ship from Manufacturer)”**

  - > Still processed in-house

  - > Expect extra freight

  - > Confirm charges before checkout

### **1.5.3 Any Rule Conflict or Portal Mismatch**

  - > STOP processing

  - > Escalate before placing order

## **1.6 ETA**

Table 3

| **Item Type**                  | **ETA Handling**          |
| ------------------------------ | ------------------------- |
| In-Stock (UPS Ground)          | Set ETA = 1 week          |
| Backorder Items                | ETA auto-displays in cart |
| “Ship from Manufacturer” Items | ETA auto-displays in cart |

**SECTION 2 — PROCESSING ORDERS**

## **2.1 PROCESSING A VENDOR ORDER — INHOUSE ONLY** 

## **2.1.1 Step 1 — Update Order Status**

  - > Change order status to **“Submitted to Vendor”**

  - > This signals processing has officially begun

⚠️ Do **not** proceed without updating status.

### **2.1.2 Step 2: Item Verification (Critical Control Step)**

Verify **each item** against:

  - > Vendor Portal

  - > Internal Portal

**Must match exactly:**

  - > Item code / SKU

  - > Item description

**Mismatch Rule:**

  - > ❌ **STOP immediately**

  - > ❌ **DO NOT place order**

  - > Escalate for correction

⚠️ **Always Avoid:**

  - > Assuming near-matches are acceptable

  - > Editing item details manually

### **2.1.3 Step 3: Add Items to Vendor Cart**

  - > Add **only verified items**

  - > Do not mix unverified or flagged SKUs

### **2.1.4 Step 4: ETA Review**

  - > In-Stock (UPS Ground) → Set ETA = **1 week**

  - > Backorder Items → ETA auto-displays in cart

  - > “Ship from Manufacturer” Items → ETA auto-displays in cart

**Example:  
**If an item shows “In Stock – UPS Ground”, system ETA must still be set to **1 week** (not immediate).

### **2.1.5 Step 5: Secure Checkout**

  - > Proceed only **after** ETA review is complete

  - > Do not bypass ETA validation

### **2.1.6 Step 6: Payment Method**

  - > Use **saved credit card only**

  - > ❌ No alternate payment methods allowed

⚠️ **Always Avoid:**

  - > Manual payment substitutions

  - > Requesting invoice terms

### **2.1.7 Step 7: PO Entry & Order Placement**

  - > Copy & paste the **PO number** exactly

  - > Place the order

### **2.1.8 Step 8: Order Confirmation**

  - > Retrieve vendor order confirmation

  - > Attach confirmation to the vendor order record

⚠️ **Always Avoid:** Closing the task without confirmation attached.

## 

**SECTION 3 — DECISION MATRIX**

Table 2 - Wurth Processing Decision Matrix

| **Scenario**                  | **Allowed?** | **Action**            | **Status**          | **Escalation** |
| ----------------------------- | ------------ | --------------------- | ------------------- | -------------- |
| Standard Ground order         | ✅            | Process via portal    | Submitted to Vendor | —              |
| Dropship request              | ❌            | Do not process        | Hold                | Ops            |
| 1–2 Business Day request      | ❌            | Do not process        | Hold                | Ops            |
| Item mismatch                 | ❌            | STOP                  | Pending             | Required       |
| Item \> 95 inches             | ✅            | Add $185 fee          | Submitted           | —              |
| “Ship from Manufacturer” item | ✅            | Account extra freight | Submitted           | —              |
| No confirmation attached      | ❌            | Incomplete            | Open                | Required       |
