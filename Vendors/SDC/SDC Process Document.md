# **VENDOR - IDEAL SECURITY**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Rules

1.2 Stock Availability Check

1.3 Edge Case Handling

**SECTION 2 — DROPSHIP EMAIL TEMPLATES**

2.1 Expedited Order - 1 Business Day Shipping  
2.2 Expedited Order - 2 Business Day Shipping

**SECTION 3 — PROCESSING ORDERS**

3.1 Processing a Vendor Order — In-House

3.2 Processing a Customer Order — Expedited Dropship Orders

**SECTION 4 — DECISION MATRIX**

4.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Master Decision Matrix (All Scenarios)

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Rules**

  - > There is no Minimum Order Value (MOV) requirement for this vendor.

  - > Dropship allowed only for Expedited 1 and 2 Business Day orders.

  - > Use DK Hardware FedEx account \#632647611 for expedited orders.

  - > Ordering Methods:
    
      - > **Expedited 1–2 Business Day:** SDC vendor orders are processed through emails via Backoffice (BO).
    
      - > **Standard Ground Orders:** Assigned to incoming in-house vendor order.

**Critical Limitation:**

SDC website must NEVER be used for:

  - > Stock availability

  - > ETA confirmation

  - > Shipping validation

**Always Avoid:**

❌ Process without stock confirmation  
❌ Use SDC website for any checks  
❌ Assign expedited orders to in-house  
❌ Use vendor shipping account  
❌ Change email wording or subject

### **1.2 Stock Availability Check (MANDATORY – NO EXCEPTIONS)**

### **Rule:** NO SDC order may be processed unless stock is confirmed using an approved method.

### Approved Stock Verification Methods (ONLY THESE ARE ALLOWED):

  - > Backoffice (BO) → Product → Stock Tab

  - > Review of recent SDC orders that were already shipped and paid

🚫 **Disallowed Methods:**

  - > Vendor website

  - > Verbal assumptions

  - > Old screenshots

  - > Customer urgency

  - > “It shipped last time” logic without confirmation

### **Example:**

  - > An SDC item shipped yesterday and payment was captured → **Valid reference**

  - > Stock tab shows quantity available → **Valid**

  - > No confirmation found → **STOP processing**

**SECTION 2 — DROPSHIP EMAIL TEMPLATES**

## **2.1 Expedited Order - 1 Business Day Shipping**

**Email Template:**

**Subject:** Expedited Dropship Order – 1 Business Day Shipping

Hi,

Please ship this order directly to our customer.

Please ship 1 BUSINESS DAY using our FedEx account \#632647611.

Thanks and Regards,

Purchasing Team

\------------------------------------------------------------------------------------------------------------------------

## **2.2 Expedited Order - 2 Business Day Shipping**

**Email Template:**

**Subject:** Expedited Dropship Order – 2 Business Day Shipping

Hi,

Please ship this order directly to our customer.

Please ship 2 BUSINESS DAY using our FedEx account \#632647611.

Thanks,

Purchasing Team

## 

**SECTION 3 — PROCESSING ORDERS**

# **3.1 PROCESSING A VENDOR ORDER — IN-HOUSE**

### **3.1.1 Step 1 — Confirm Stock**

  - > Use BO Stock tab **OR**

  - > Verify from recent shipped SDC orders

### **3.1.2 Step 2 — Process Customer Order**

  - > Once stock is confirmed, proceed normally

### **3.1.3 Step 3 — Assign Order**

  - > Assign item to **Incoming In-House Vendor Order**

  - > Do NOT email vendor

  - > Do NOT use FedEx account

### **Key Notes:**

  - > Standard Ground ≠ Dropship

  - > No vendor email required

  - > All fulfillment handled via incoming in-house flow

### **Example:**

  - > Customer selects standard shipping

  - > Stock confirmed via BO

  - > Order is added to incoming SDC in-house PO

**3.2 PROCESSING CUSTOMER ORDER - EXPEDITED DROPSHIP ORDERS**

### **2.2.1 Step 1 — Confirm Stock (MANDATORY)**

Use:

  - > BO → Product → Stock tab **OR**

  - > Recent shipped SDC orders

🚫 If stock is not confirmed → **DO NOT EMAIL VENDOR**

### **2.2.2 Step 2 — Prepare Vendor Email**

  - > Use **correct expedited template**

  - > Match shipping speed exactly (1-Day vs 2-Day)

  - > No modifications to wording unless approved

### **2.2.3 Step 3 — Shipping Account (MANDATORY)**

  - > All expedited dropship orders use DK Hardware FedEx account

  - > FedEx Account \#: 632647611

  - > Never use:
    
      - > Vendor account
    
      - > Customer account
    
      - > Any alternate carrier

### **2.2.4 Step 4 — Send Email & Monitor Response**

  - > Email vendor using correct template

  - > Confirm:
    
      - > Email received
    
      - > Order acknowledged
    
      - > Shipping method followed correctly

⚠️ No confirmation = **Follow up required**

**SECTION 4 — DECISION MATRIX**

Table 1 - SDC Processing Decision Matrix

| Scenario                      | Shipping Type | Stock Verified? | Action                            | Vendor Contact | Shipping Account |
| ----------------------------- | ------------- | --------------- | --------------------------------- | -------------- | ---------------- |
| Standard Ground order         | Ground        | Yes             | Assign to incoming in-house order | No             | N/A              |
| Standard Ground order         | Ground        | No              | STOP – verify stock               | No             | N/A              |
| Expedited order               | 1-Day         | Yes             | Email vendor using 1-Day template | Yes            | DK FedEx         |
| Expedited order               | 2-Day         | Yes             | Email vendor using 2-Day template | Yes            | DK FedEx         |
| Expedited order               | Any           | No              | STOP – do not email               | No             | N/A              |
| Stock checked on SDC website  | Any           | Invalid         | STOP – re-verify                  | No             | N/A              |
| Vendor hasn’t confirmed email | Expedited     | Yes             | Follow up until confirmed         | Yes            | DK FedEx         |
| Wrong template used           | Expedited     | Yes             | Correct & resend                  | Yes            | DK FedEx         |
