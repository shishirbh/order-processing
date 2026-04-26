# **VENDOR - HD SUPPLY**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Overview  
1.2 Dropship Rules

1.3 Dropship Stock and ETA Logic  
1.4 Discontinued Item Logic  
1.5 Ready to Process Notes

**SECTION 2 — PROCESSING ORDERS**

2.1 Processing Vendor Order — In-House  
2.2 Processing Vendor Order — Dropship

2.3 Processing Customer Order — In-House

**SECTION 3 — DECISION MATRIX**

3.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Master Decision Matrix (All Scenarios)

# 

#   
  

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Overview**

HD Supply is used by DKH in two distinct ways:

**1.1.1 HD SUPPLY — IN-HOUSE VENDOR ORDER**

Used when:

  - > Dropship is not eligible

  - > Marketplace orders

  - > Address NOT eligible for dropship

  - > Low-value items (\<$50)

  - > Vendor shipping restrictions

  - > Customer-level requirements (pickup, shipping-account orders)

**1.1.2 HD SUPPLY — DROPSHIP**

Used when:

  - > Customer address is valid (no restricted regions)

  - > Order is NOT a marketplace order

  - > HD Supply cart shows “In Stock”

  - > ETA is visible

  - > Item value is ≥ $50. Any dropship under $50 incurs a mandatory $10 handling fee.

  - > HD Supply is cheaper/faster than US Lock

**1.2 Dropship Rules**

### **✔ DROPSHIP ALLOWED WHEN:**

  - > Customer address is valid (continental US only)

  - > Not a marketplace order

  - > Cart shows In Stock

  - > ETA is visible

  - > Item value ≥ $50

  - > Cost/ETA is favorable compared to US Lock

  - > Customer requires 1–2 Day delivery

  - > Item qualifies via weight/size (5+ lbs or 18”+ long)

<!-- end list -->

  - > Order is **“Ships from Manufacturer”** and value is ≥ $50

⚠️ **Important Points:**

  - > If a ‘Ships from Manufacturer’ item is below $50, enter the customer address to check shipping.

  - > Any dropship under $50 incurs a mandatory $10 handling fee.

  - > If shipping + tax + handling significantly reduces profit, bring the order In-House.

### **❌ DROPSHIP NOT ALLOWED WHEN:**

  - > Marketplace orders: Amazon, Walmart, eBay, Wayfair, Zoro

  - > Address is:
    
      - > AK / HI
    
      - > PR / Canada
    
      - > International
    
      - > Islands
    
      - > PO Box
    
      - > APO/FPO

  - > Item value \< $50 (unless exception approved with $10 handling)

  - > Cart shows Out of Stock

  - > Cart shows NO ETA → item considered Discontinued

  - > Customer uses their own shipping account

  - > Pickup orders

⚠️ **Exception Handling:**

  - > If an item shows In Stock when shipping to our warehouse but becomes Discontinued after adding the customer address → process In-House.

  - > If the reverse occurs (OOS to warehouse, In Stock to customer) → Dropship or escalate to a supervisor.

**1.3 Dropship Stock and ETA Logic**

### **✔** If HD Supply CART = “In Stock” → Eligible

### ❌ If CART = “Out of Stock” → Discontinued

### ❌ If ETA is missing → Discontinued

### **✔** If ETA = 1–3 business days → Dropship allowed

### ❌ “Ships from Manufacturer” (display text) → Ignore → rely on CART

⚠️ **Additional Rules:**

  - > “Ships from Manufacturer” items under $50 must be tested with the **customer address**.

  - > If the site charges shipping even after the $10 handling fee:
    
      - > Absorb cost only if profit impact is minimal
    
      - > If it significantly reduces margin → process **In-House**

### **1.4 Discontinued Item Logic**

An item is discontinued if:

  - > HD Supply CART shows Out-of-Stock

  - > ETA is not shown

  - > Item not listed on HD Supply

  - > Multiple prior cancellation attempts

  - > “While Supplies Last” and insufficient quantity

➡ Customer must be informed and offered an alternative

### **1.5 Ready to Process Notes**

  - > Always trust CART stock, never display stock.

  - > For any mismatch between cart & DKH system → STOP and correct.

  - > Always copy order confirmation number into vendor notes.

  - > Never use HD Supply for marketplaces.

  - > Never dropship for restricted addresses.

  - > Never dropship items \< $50 value.

**SECTION 2 — PROCESSING ORDERS**

# **2.1 PROCESSING VENDOR ORDER — IN-HOUSE**

### **2.1.1 Step 1 — Open Vendor Order**

  - > Go to Vendor Orders

  - > Select the vendor order created/updated

### **2.1.2 Step 2 — Update Vendor Order Status**

Change:

  - > **New → Submitted to Vendor**

### **2.1.3 Step 3 — Add Items to HD Supply Cart**

  - > Open HD Supply site

  - > Add all items EXACTLY as per vendor order

  - > SKU, quantity, specs must match

### **2.1.4 Step 4 — Match Totals**

Compare:

  - > System Vendor Order Total

  - > HD Supply Cart Total

If matching:

  - > Copy cart total → paste into Vendor Order Notes

  - > Enter PO Number in HD Supply checkout PO field

### **2.1.5 Step 5 — Shipping Method (In-House Orders)**

Shipping must ALWAYS be:  
➡ **DK Hardware Warehouse address**

(If not saved → manually add)

### **2.1.6 Step 6 — Checkout**

  - > Click Checkout

  - > Enter card and billing details

  - > Confirm shipping method (warehouse delivery)

  - > Submit Secure Order

### **2.1.7 Step 7 — Finalize**

After placing the order:

  - > Copy HD Supply order confirmation \#

  - > Paste into Vendor Order Notes

  - > Save vendor order

  - > Add ETA

# **2.2 PROCESSING VENDOR ORDER — DROPSHIP**

### **2.2.1 Step 1 — Confirm Dropship Eligibility**

Verify:

  - > Not marketplace

  - > Address allowed

  - > CART shows **In Stock**

  - > ETA visible

  - > Item value ≥ $50

  - > Customer delivery requirements fit (1–2 Day)

  - > If item is “Ships from Manufacturer” and below $50:

<!-- end list -->

  - > Enter the customer address to check shipping

  - > Dropship only if viable, noting the mandatory $10 handling fee

  - > If the site charges shipping even after the $10 handling fee:
    
      - > Absorb cost only if profit impact is minimal
    
      - > If it significantly reduces margin → process In-House

**2.2.2 Step 2 — Assign & Create Vendor Order**

1.  > Go to Process Incoming Order

2.  > Under product assignment → select HD Supply

3.  > Create Vendor Order → Shipping = Dropship

4.  > Inline Comment: 24 Hours Request

5.  > Click on process change

### **2.2.3 Step 3 — Validate on HD Supply Website**

  - > Search item

  - > Match image

  - > Match description

  - > Match price

  - > Add qty to cart

  - > Confirm ETA

  - > Confirm shipping (can show “0” → acceptable)

### **2.2.4 Step 4 — Enter Customer Address**

Under “Ship To”:

  - > Enter customer name

  - > Add customer phone

  - > Full customer address

  - > Validate → select **Use Address As Entered**

### **2.2.5 Step 5 — Checkout**

  - > Check totals

  - > Enter PO Number (must match DKH)

  - > Payment Method → Credit Card ( need to put credit card details then uncheck the box and put billing address of credit card(Art Goldman - DKHardware) )

  - > Submit Secure Order

### **2.2.6 Step 6 — Finalize Vendor Order in DKH**

  - > Paste HD Supply order confirmation number

  - > Add cart total in notes

  - > Set ETA as per ETA mentioned on the website

# **2.3 PROCESSING CUSTOMER ORDER — IN-HOUSE**

### **2.3.1 Step 1 — Process Incoming Order**

  - > Go to Process Incoming Order

  - > Assign item qty to HD Supply vendor

  - > Under HD Supply Warehouses:
    
      - > Select Use Existing Vendor Order, OR
    
      - > Create New Order if needed

  - > Click Process Changes

### **Step 2 — Payment Processing**

Payment must be processed unless:

  - > Amazon

  - > Zoro

  - > Net 30 customers

After payment:

  - > Order status → Coming In-House

**SECTION 3 — DECISION MATRIX**

Table 1 - HD Supply Processing Decision Matrix

| **Condition**                                                                 | **Action**                                | **Notes / Examples**                                             |
| ----------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| Marketplace order (Amazon/eBay/Walmart/Wayfair)                               | No dropship                               | Exception: Allowed only for freight if HD Supply ships for free. |
| Zoro order                                                                    | ❌ Never dropship                          | Hard rule                                                        |
| Address restricted (AK/HI/PR/Canada/Intl/Islands/PO Box/APO)                  | ❌ In-house                                | Dropship blocked                                                 |
| Item value \< $50                                                             | **Conditional (see rows below)**          | Low-value rules apply                                            |
| Item \< $50 AND ships from manufacturer for FREE AND customer shipping \> $10 | **✔** Dropship allowed                    | Example: Heavy item; DKH shipping = $16 → Dropship cheaper       |
| Item \< $50 AND ships from manufacturer with shipping charges                 | ❌ In-house                                | Dropship too expensive                                           |
| Item \< $50 AND heavy, and HD Supply ships free                               | **✔** Dropship allowed                    | Must validate weight                                             |
| Item value ≥ $50 AND item ships from manufacturer                             | **✔** Dropship allowed                    | Review shipping charge before finalizing                         |
| HD Supply CART shows “In Stock”                                               | **✔** Eligible                            | CART overrides display stock                                     |
| HD Supply CART shows “Out of Stock”                                           | ❌ Discontinued                            | Offer alternatives                                               |
| ETA missing in cart                                                           | ❌ Discontinued                            | No exceptions                                                    |
| ETA visible (1–3 days)                                                        | **✔** Dropship allowed                    | Meets service level                                              |
| Marketplace freight AND vendor ships free (except Zoro)                       | **✔** Dropship allowed                    | Only marketplace exception                                       |
| Customer uses own shipping account                                            | ❌ In-house                                | Cannot dropship                                                  |
| Pickup order                                                                  | ❌ In-house                                | Must ship from DKH                                               |
| Cart total ≠ Vendor Order total                                               | ❌ STOP                                    | Fix mismatch before checkout                                     |
| Payment exceptions                                                            | Amazon, Zoro, Net 30                      | Do NOT charge payment                                            |
| All dropship conditions met                                                   | **✔** Follow HD Supply Dropship Procedure | —                                                                |
| Dropship not allowed                                                          | **✔** In-house vendor order               | Follow HD Supply In-House steps                                  |
