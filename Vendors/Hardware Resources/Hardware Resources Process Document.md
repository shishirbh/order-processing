# **VENDOR - HARDWARE RESOURCES**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Rules

1.2 Account Routing Rules

1.3 Universal MOQ Protocol

**SECTION 2 — EMAIL TEMPLATES**

2.1 Mandatory Email Recipients  
2.2 Template for Account 1 (In-House / Warehouse)

2.3 Template for Account 2 (Dropship)

**SECTION 3 — PROCESSING ORDERS**

3.1 Processing a Vendor Order — Account 1 (In-House)

3.2 Processing a Customer Order — Account 2 (Standard Dropship)

**SECTION 4 — DECISION MATRIX**

4.1 Master Decision Matrix (All Scenarios)

# **Tables of Content:**

Table 1 - Account Selection Matrix

Table 2 - Master Decision Matrix (All Scenarios)

#   
  

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Rules**

→ Hardware Resources in-house orders are processed via the vendor website. Dropship orders are processed by email using Backoffice (BO). (Updated: 2026-04-26)

→ Hardware Resources orders are processed using **two vendor accounts**, determined by:

  - > Unit cost

  - > Freight feasibility

  - > Minimum Order Quantity (MOQ)

→ Orders may be processed as:

  - > In-House (Warehouse Delivery)

  - > Dropship (Direct to Customer)

→ Always ensure:

  - > Vendor MOQ matches Backoffice MOQ

  - > SKU matches vendor portal

  - > Vendor email recipients are correct

  - > PO number is included in subject line

### **1.2 Account Routing Rules**

Account selection must always follow the routing rules outlined below:

Table 1 - Account Selection Matrix

<table>
<thead>
<tr class="header">
<th>Criteria</th>
<th>Assigned Account</th>
<th>Destination</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Unit Cost &lt; $25</td>
<td>Account 1</td>
<td>In-House / Warehouse</td>
</tr>
<tr class="even">
<td>Unit Cost ≥ $25</td>
<td>Account 2</td>
<td>Dropship (Direct to Customer)</td>
</tr>
<tr class="odd">
<td>Heavy / Bulky</td>
<td>Account 1</td>
<td><p>In-House (To save on freight).</p>
<p>Dropship if shipping costs are covered - subject to Elina’s approval</p></td>
</tr>
<tr class="even">
<td>Price Advantage</td>
<td>Account 1 and 2</td>
<td><p>Use if Account 1 is significantly cheaper.</p>
<p>Use Account 2 if price is cheaper and item cost is above $25</p></td>
</tr>
</tbody>
</table>

**Always evaluate cost efficiency and freight impact before finalizing the account.**

**1.3 Universal MOQ Protocol**

Before submitting any order, verify the MOQ on the Hardware Resources website.

### **1.3.1 Re-Routing Rule:**

→ If the item qualifies for Account 2 (Dropship) but:

Customer quantity \< Vendor Website MOQ

→ Then:

❌ Do NOT dropship.

✔ Reassign the order to Account 1 (In-House).

### **1.3.2 Quantity Adjustment:**

→ Increase the **PO quantity** to meet the vendor MOQ.

→ Process:

  - > Order full MOQ to warehouse

  - > Ship customer's quantity

  - > Remaining units stay in stock

### **1.3.3 Data Accuracy Rule:**

→ If the Backoffice MOQ field differs from the vendor website:

✔ Always follow the **vendor website value**.

→ Update the Backoffice MOQ field to match the vendor website.

**SECTION 2 — EMAIL TEMPLATES**

## **2.1 Mandatory Email Recipients**

**TO:  
**[<span class="underline">tiphanie.withrow@hardwareresources.com</span>](mailto:tiphanie.withrow@hardwareresources.com)

**CC:  
**[<span class="underline">miguel.torre@hardwareresources.com</span>](mailto:miguel.torre@hardwareresources.com)

**→ Emails must always include both recipients.**

\------------------------------------------------------------------------------------------------------------------------

## **2.2 Template for Account 1 (In-House / Warehouse)**

Subject:

STOCK ORDER - Account 1 - PO \#\[PO Number\]

Hi Tiphanie,

Please process the attached order for our warehouse.

Note: Quantities have been adjusted to meet MOQs.

Thanks and Regards,

Purchasing Team

\------------------------------------------------------------------------------------------------------------------------

## **2.3 Template for Account 2 (Dropship)**

Subject:

DROPSHIP ORDER - Account 2 - PO \#\[PO Number\]

Hi Tiphanie,

\[IF EXPEDITED: Please ship X business day(s)\]

Please ship this order directly to our customer.

Kindly let us know if there are any changes.

Regards,

Purchasing Team

\------------------------------------------------------------------------------------------------------------------------

**SECTION 3 — PROCESSING ORDERS**

# **3.1 PROCESSING VENDOR ORDER — ACCOUNT 1 (IN-HOUSE)**

### **→ Used when:**

  - ### Item cost \< $25

  - ### MOQ prevents dropship

  - ### Item is heavy or bulky

  - ### Account 1 pricing is significantly cheaper

### **Steps:**

### **3.1.1 Step 1 — Verify & Move Order to Submit**

### Check vendor website for::

  - ### Pricing correct

  - ### MOQ

  - > SKU

  - > Description

### **3.1.2 Step 2 — Adjust Quantity for MOQ**

  - ### If MOQ applies:

<!-- end list -->

  - ### Increase PO quantity to meet vendor MOQ.

### **3.1.3 Step 3 — Move Order to Submit**

  - ### In Backoffice:

<!-- end list -->

  - ### Change vendor order status to: Submit

### **3.1.4 Step 4 — Submit via Website (Updated: 2026-04-26)**

  - ### In-house (Account 1) orders are placed on the vendor website, not by email. (Updated: 2026-04-26)

<!-- end list -->

  - ### Log in to Hardware Resources vendor website and place the order with the adjusted quantities.

### **3.1.5 Step 5 — Record Vendor Response**

  - > Monitor vendor reply for:

<!-- end list -->

  - > order confirmation

  - > shipping updates

  - > stock availability

# **3.2 PROCESSING VENDOR ORDER — ACCOUNT 2 (DROPSHIP)**

**→ Used when:**

  - > Unit cost ≥ $25

  - > MOQ is satisfied

  - > Dropship is feasible

**Steps:**

**3.2.1 Step 1 — Verify Product**

  - > Confirm on vendor website:

<!-- end list -->

  - > SKU

  - > Description

  - > Price

  - > MOQ

**3.2.2 Step 2 — Confirm Dropship Eligibility**

  - > Ensure:

<!-- end list -->

  - > customer quantity meets MOQ

  - > shipping is feasible

**3.2.3 Step 3 — Move Order to Submit**

  - ### In Backoffice:

<!-- end list -->

  - ### Change vendor order status to: Submit

**3.2.4 Step 4 — Send Dropship Email**

  - > Use Account 2 dropship template.

  - > Include customer shipping details.

  - > For urgent orders, add this line at the very top of the email body:

<!-- end list -->

  - > **Next Day - Please ship 1 business day**

  - > **Second Day - Please ship 2 business days**

### **3.2.5 Step 5 — Monitor Confirmation**

  - > Wait for vendor confirmation and shipment updates.

**SECTION 4 — DECISION MATRIX**

Table 2 - Hardware Resources Processing Decision Matrix

| **Scenario**                               | **Action**               | **Notes**                      |
| ------------------------------------------ | ------------------------ | ------------------------------ |
| Item cost \< $25                           | Account 1                | Process In-House               |
| Item cost ≥ $25                            | Account 2                | Dropship                       |
| Customer qty \< website MOQ                | Re-route to Account 1    | Increase PO qty to MOQ         |
| Heavy or bulky item                        | Account 1                | Reduce freight cost            |
| Account 1 significantly cheaper            | Account 1                | Prefer lower cost              |
| Expedited order                            | Add shipping instruction | Must appear at top of email    |
| Backoffice MOQ differs from vendor website | Update Backoffice        | Website value is authoritative |
