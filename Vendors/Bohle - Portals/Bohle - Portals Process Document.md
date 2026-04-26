# **VENDOR - BOHLE PORTAL**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Overview  
1.2 Freight / Shipping

1.3 Order Types & Channels

1.4 Freight & Shipping Rules (All Orders)  
1.5 Identifying Special-Order Items

**SECTION 2 — PROCESSING ORDERS**

2.1 Processing Regular Website Orders  
2.2 Processing Special Orders (Email Only)

2.3 Corner Cases & Examples

2.4 Quality Checks & Always-Avoid Traps

**SECTION 3 — DECISION MATRIX**

3.1 Regular vs Special & Channel

3.2 In-House vs Dropship (for Regular Items)  
3.3 Freight & Shipping Logic

3.4 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Warehouse Locations  
Table 2 - In-House vs Dropship (for Regular Items)  
Table 3 - Freight & Shipping Logic

Table 4 - Master Decision Matrix (All Scenarios)

# **Figures:  
**Figure 1: Shipping Address on Vendor Website  
Figure 2: Delivery Method to be selected on Vendor Website  
Figure 3: Enter PO Number  
Figure 4: Billing Address Rule  
Figure 5: Special Order - “Price not available. Contact us”

#   
  

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Overview**

  - > **Kristy is Bohle Representative**. We communicate only VIA email: <span class="underline">kristy@portalshardware.com</span>

<!-- end list -->

  - > **DK FedEx Account: 632647611**

### **1.2 Freight / Shipping**

  - > Order subtotal ≥ $2,000:

> → Prepaid freight (vendor pays shipping / free freight to DK/customer as applicable)

  - > Order subtotal \< $2,000:

> → Ship using DK FedEx account 632647611

  - > Website shipping cost:

> → Estimate only; actual billed shipping is lower when using a DK account.
> 
> → Do not panic if the website shows a high shipping estimate.

**1.3 Order Types & Channels**

Bohle | Portals orders fall into two main types:

**1.3.1 Regular Website Orders**

  - > Items show a clear price on the vendor website

  - > “Add to Cart” button is available

  - > Used for both in-house and dropship orders

**1.3.2 Special Orders (Email Only)**

  - > One or more special indicators (see Section 1.5)

  - > Require manual quote and confirmation from Kristy

  - > PO and shipping instructions sent via email

**1.4 Freight & Shipping Rules (All Orders**)

**1.4.1 Freight Threshold**

  - > If total Bohle PO (before tax) ≥ $2,000:

<!-- end list -->

  - > Use Prepaid Freight (vendor free freight option).

  - > Do NOT use DK FedEx account for that PO.

<!-- end list -->

  - > If total Bohle PO \< $2,000:

<!-- end list -->

  - > Always ship using DK FedEx account \#632647611.

  - > For dropship: vendor ships directly to customer using this account.

  - > For in-house: vendor ships to DK warehouse using this account.

**1.4.2 Website Shipping Estimates**

  - > Website shipping charges shown during checkout are for reference only.

  - > Actual shipping when billed to our FedEx account is lower.

**Rule:** Do not adjust customer shipping charges solely because Bohle website shows an estimate that looks high or odd. Follow DK’s standard shipping rules.

**1.4.3 Edge Cases & Notes**

  - > If a cart has multiple items and some lines push the total just above $2,000, treat the entire PO as prepaid freight unless clearly instructed otherwise.

  - > If multiple POs are created on the same day and each is below $2,000, freight is evaluated per individual PO, not by daily combined total.

**1.5 Identifying Special-Order Items**

An item is Special Order (email only) if ANY of the following are true:

**1.5.1 Back Office Shows $0.00 Unit Cost**

  - > DK system (back office) displays Unit Cost = $0.00.

  - > This means we do not have a stored vendor price.

**Action:**

  - > Check previous Bohle orders (if available) for reference price.

  - > If not sure, or item looks large/expensive/unusual → treat as Special Order and email Kristy for a quote.

**1.5.2 Vendor Website Shows “Price Not Available / Contact Us”**

  - > Product page displays something like:

<!-- end list -->

  - > “Price not available. Contact us for pricing.”

**Action:**

  - > Treat as Special Order → email for quote.

**1.5.3 Vendor Website Does Not Show Stock Quantity**

  - > No visible stock quantity or availability on the product page.

**Action:**

  - > For bulk orders or time-sensitive orders → email vendor to confirm stock and lead time.

  - > If the item also has missing price / Add-to-Quote only → treat as Special Order.

**1.5.4 No “Add to Cart” – Only “Add to Quote”**

  - > Page shows “Add to Quote” instead of “Add to Cart”.

**Action:**

  - > This is definitely Special Order → email Kristy and process via email only.

**Always-Avoid Trap:**

  - > Never place Special-Order items as regular website orders even if you think you know the price. Always get written confirmation from vendor.

**SECTION 2 — PROCESSING ORDERS**

# **2.1 PROCESSING REGULAR WEBSITE ORDERS (In-House and Dropship)**

**2.1.1 Step 1 – Shipping Address**

  - > From cart, click Checkout.

  - > System asks for Shipping Address.

**<span class="underline">If In-House:</span>**

  - > Select default **DK Hardware Supply** warehouse address (configured in the account).

**<span class="underline">If Dropship:</span>**

  - > Click Add Address.

  - > Enter customer’s shipping address exactly as shown on the sales order.

  - > Verify:
    
      - > Full name
    
      - > Street, suite/apartment
    
      - > City, State, ZIP
    
      - > Phone number

**Trap to Avoid:  
**Do **not** use DK address for dropship orders “for now” and later manually forward. Bohle must ship directly to customer for dropship.

![](media/image2.png)

*Figure 1: Shipping Address on Vendor Website*

**2.1.2 Step 2 – Delivery Method**

On the Delivery Method page:

**<span class="underline">In-House Orders:</span>**

  - > Select FedEx Home Delivery or appropriate standard FedEx option.

  - > Ensure this aligns with DK’s preferred receiving method.

![](media/image1.png)

*Figure 2: Delivery Method to be selected on Vendor Website*

**<span class="underline">Dropship Orders:</span>**

  - > Choose the shipping method that best matches the customer’s requested method on the DK order (e.g., Ground, 2-Day, etc.).

  - > Do not upgrade shipping for free unless approved by supervisor.

**Freight Logic Here:**

  - > If order total ≥ $2,000 → Look for Prepaid / Free Freight option (if shown) and select it.

  - > If order total \< $2,000 → Use options that will be billed to DK FedEx account 632647611.

**2.1.3 Step 3 – Add Purchase Order (PO) Number**

On the PO field page:

  - > Enter the DK Purchase Order number exactly as in back office.

  - > DK Format example: as seen in DKH-2853600 (example only)

  - > This PO must match our internal PO so invoices can be reconciled easily.

![](media/image6.png)

*Figure 3: Enter PO Number*

**2.1.4 Step 4 – Billing Address**

Billing section:

  - > Billing address must ALWAYS be DK Hardware Supply.

  - > For dropship orders, uncheck “Same as shipping address” and enter DK billing details manually if needed.

**Trap to Avoid:  
**Never set a customer as a billing address. Bohle invoices DK Hardware, not the customer.

![](media/image5.png)

*Figure 4: Billing Address Rule*

# **2.2 PROCESSING SPECIAL ORDERS (EMAIL ONLY)**

### **2.2.1 Step 1 – Collect Details**

Before emailing, gather:

  - > Customer name and shipping address

  - > DK sales order & PO number (if already created)

  - > Item number, description, quantity

  - > Any drawings/notes if applicable (for custom/bulk items)

  - > Requested ship method (Ground, 2-Day, etc.)

**2.2.2 Step 2 – Email Kristy for Quote / Availability**

**Subject Line Example:**

Special Order Quote Request – \[DK PO\#\] – \[Item \# / Description\]

**Email Body Template (Quote Request):**

> Hi Kristy,
> 
> We would like to place a special order for the following item(s):  
> – Item: \[Item Number + Description\]  
> – Qty: \[X\]  
> – Ship To: \[Customer name + full address + phone\]
> 
> Could you please confirm:  
> – Unit price  
> – Stock availability  
> – Lead time  
> – Estimated shipping method using our FedEx account \# 632647611
> 
> Once we have your confirmation, we will proceed with the purchase order.
> 
> Thank you,  
> DK Hardware Purchasing Team

  - > **Wait for Kristy’s reply.**

#### **2.2.3 Step 3 – Review Vendor Response**

When Kristy replies:

  - > Confirm:
    
      - > **Price**
    
      - > **Stock availability**
    
      - > **Lead time / expected ship date**

  - > If anything seems off (very high price, unusual lead time, etc.), escalate to the supervisor before confirming with the customer.

#### **2.2.4 Step 4 – Send Purchase Order by Email**

Once you are ready to place the order, send the official PO email.

**Official PO Email Template (Special Order):**

> Hi Kristy,
> 
> Please ship directly to our customer as per the details below.
> 
> SHIP CUSTOMER FEDEX GROUND USING OUR FEDEX ACCOUNT \# 632647611
> 
> PO \#: \[DK PO Number\]  
> Customer: \[Customer Name\]  
> Ship To: \[Customer Shipping Address + Phone\]  
> Item(s):  
> – \[Item Number – Description – Qty – Confirmed Unit Price\]
> 
> Kindly let us know if there are any changes to price, availability, or lead time.
> 
> Regards,  
> Purchasing Team  
> DK Hardware

**Note:** For orders ≥ $2,000, align shipping with prepaid freight rules.  
If vendor confirms prepaid freight instead of FedEx Ground, adjust instructions accordingly.

**2.2.5 Step 5 – Update DK System**

  - > Update DK order with:
    
      - > Confirmed vendor cost
    
      - > Lead time note (“Vendor confirmed 7–10 business days”)
    
      - > Any special instructions (e.g., “Ship via FedEx Ground using DK account 632647611”)

  - > Attach or log the email confirmation in DK’s system for audit trail.

# **2.3 CORNER CASES AND EXAMPLES**

#### **2.3.1 Example 1 – Simple In-House Website Order (\<$2,000)**

  - > DK customer orders 2 hinges that will be stocked at DK.

  - > Bohle's website shows price and “Add to Cart”.

  - > Total = **$450**.

**Action:**

  - > Treat as **Regular Website Order – In-House**.

  - > Shipping Address → DK warehouse

  - > Delivery Method → FedEx Home Delivery (or similar) using DK account

  - > PO Number → Enter DK PO

  - > Billing Address → DK Hardware

  - > Freight → Under $2,000 → DK FedEx account 632647611 applies.

#### **2.3.2 Example 2 – Dropship Website Order (\<$2,000)**

  - > DK customer orders a shower hardware kit to be shipped directly to them.

  - > Bohle website shows price and Add to Cart.

  - > Total = **$800**.

**Action:**

  - > Regular website order – **Dropship**.

  - > Shipping Address → Customer address

  - > Delivery Method → Select shipping method matching customer request (e.g., FedEx Ground).

  - > PO Number → Enter DK PO

  - > Billing Address → DK Hardware (uncheck “Same as shipping”)

  - > Freight → Under $2,000 → Use DK FedEx account 632647611.

#### **2.3.3 Example 3 – Special Order (No Price / Add to Quote Only)**

  - > Customer wants a custom-sized glass hardware set.

  - > Back office shows **$0.00 cost**.

  - > Vendor website shows **“Price not available. Contact us”** and only **“Add to Quote”**.

**Action:**

1.  > Treat as **Special Order**.

2.  > Email Kristy with item details, quantity, and customer address.

3.  > Get quote (price, stock, lead time).

4.  > Confirm with customer if necessary.

5.  > Send **Purchase Order email** with shipping and FedEx 632647611 instructions.

6.  > Update DK system with final cost and lead time.

![](media/image3.png)  
*Figure 4: Special Order - “Price not available. Contact us”*

#### **2.3.4 Example 4 – Order Just Above $2,000**

  - > Combined Bohle order total = **$2,050**.

**Action:**

  - > Treat as **≥ $2,000** → **Prepaid freight**.

  - > Choose vendor’s prepaid/free freight shipping option on website or confirm via email for special orders.

  - > Do **not** use DK FedEx account for that PO unless vendor specifically requires.

### **2.4 Quality Checks and Always-Avoid Traps** 

**Always Check Before Finalizing:**

  - > Correct **shipping address** (DK vs customer)

  - > Billing always = **DK Hardware**

  - > PO numbers match between website/email and DK system

  - > Freight logic correctly applied (≥$2,000 vs \< $2,000)

  - > Special orders backed by **written confirmation** from vendor

**Always-Avoid Traps:**

  - > Placing **special-order items** as regular website orders without confirmation

  - > Using **customer** as billing address

  - > Ignoring freight threshold and accidentally using DK FedEx on orders ≥ $2,000

  - > Forgetting to uncheck “Same as shipping address” on dropship orders

  - > Not logging vendor emails in DK system for audit trail

**SECTION 3 — DECISION MATRIX**

### **3.1 REGULAR Vv/s SPECIAL CHANNEL**

Table 1 - Regular vs Special & Channel

| **\#**                                                                                                             | **Condition / Scenario**                                | **Price Visible?** | **Add to Cart?** | **Stock Shown?** | **Order Type**  | **Action**                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------ | ---------------- | ---------------- | --------------- | --------------------------------------------------------------------- |
| 1                                                                                                                  | Normal product page                                     | Yes                | Yes              | Yes/No\*         | Regular Website | Place via website; then choose In-House or Dropship as per DK rules.  |
| 2                                                                                                                  | Back office cost = $0.00                                | No                 | Any              | Any              | Special Order   | Email Kristy for price/stock/lead time; process via email PO.         |
| 3                                                                                                                  | Website: “Price not available / Contact us for pricing” | No                 | No / Quote       | Any              | Special Order   | Email Kristy; do not place via website.                               |
| 4                                                                                                                  | Website shows only “Add to Quote”                       | No                 | No               | Any              | Special Order   | Email Kristy; use email PO only.                                      |
| 5                                                                                                                  | Large/bulk qty & stock not shown                        | Maybe              | Maybe            | No               | Special (Check) | Email vendor to confirm stock/lead time before promising to customer. |
| \* Stock not shown alone does not always mean “Special Order”, but for bulk quantities you must confirm via email. |                                                         |                    |                  |                  |                 |                                                                       |

### **3.2 IN-HOUSE v/s DROPSHIP (for Regular Items)**

Table 2 - In-House vs Dropship (for Regular Items)

| **\#** | **Where should order ship?** | **Marketplace / Channel**                                | **Decision**               | **Action**                                                               |
| ------ | ---------------------------- | -------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------ |
| 1      | To DK warehouse              | Any                                                      | In-House                   | Ship to DK address; DK reships to customer.                              |
| 2      | Direct to customer           | Website order                                            | Dropship                   | Ship to customer address via vendor.                                     |
| 3      | Direct to customer           | Channel with dropship restrictions (per DK global rules) | Depends on DK global rules | If dropship not allowed, convert to in-house even if Bohle can dropship. |

### **3.3 FREIGHT AND SHIPPING LOGIC**

Table 3 - Freight & Shipping Logic

| **\#** | **Order Total (Bohle PO)** | **Destination** | **Freight Rule**               | **Shipping Method / Account**                                        |
| ------ | -------------------------- | --------------- | ------------------------------ | -------------------------------------------------------------------- |
| 1      | ≥ $2,000                   | DK warehouse    | Prepaid freight (free)         | Select vendor’s prepaid/free freight option; do not use DK FedEx.    |
| 2      | ≥ $2,000                   | Customer        | Prepaid freight (free)         | Confirm with vendor; do not force DK FedEx unless required.          |
| 3      | \< $2,000                  | DK warehouse    | DK pays freight via FedEx acct | Select FedEx (e.g., Home Delivery) billed to 632647611.              |
| 4      | \< $2,000                  | Customer        | DK pays freight via FedEx acct | Ship via FedEx Ground / customer’s requested method using 632647611. |

### **3.4 MASTER DECISION MATRIX (All Scenarios)**

Table 4 - Aria Vetri Master Decision Matrix (All Scenarios)

| **Scenario**                                               | **If X…**                             | **Do Y (Action)**                                                                         |
| ---------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| Standard item, price visible, Add to Cart                  | Normal product                        | Website order; apply in-house/dropship steps + freight rules.                             |
| Back office cost is 0.00                                   | No known cost                         | Treat as special; Dropship                                                                |
| Website shows “price not available” or only “Add to Quote” | Vendor wants manual pricing           | Treat as special; email quote + then send PO via email.                                   |
| Total Bohle PO ≥ $2,000                                    | Meets prepaid freight threshold       | Use vendor prepaid freight; no DK FedEx account.                                          |
| Total Bohle PO \< $2,000                                   | Below threshold                       | Use DK FedEx account 632647611.                                                           |
| Mixed cart: some lines look special, some regular          | Different item behaviors in one order | Regular items: website order; special items: email vendor; can split into separate POs.   |
| Bulk qty but no stock visibility                           | May risk backorder / delay            | Email vendor to confirm stock & lead time before promising to customer.                   |
| Customer requests rush / expedited shipping                | Higher shipping expectations          | Choose the fastest reasonable FedEx option; confirm extra charge with DK rules if needed. |

**Elina Inputs - Points to be Changed/Updates**
