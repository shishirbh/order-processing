# **VENDOR - EMERY JENSEN (Main Warehouse)**

# **Contents:**

**SECTION 1 — OVERVIEW & DEFINITIONS**  
1.1 Vendor Overview

1.2 Warehouse & Dropship Decision Logic  
1.3 Hard Stop Rules

1.4 Shipping Based Dropship Rules

1.5 Out-Of-Stock Rules

1.6 Warehouse Consolidation & Limited Stock Rule

**SECTION 2 — PROCESSING ORDERS**

2.1 Processing a Customer Order — In-House  
2.2 Processing a Customer Order — Dropship

2.3 Processing a Vendor Order — In-House

2.4 Processing a Vendor Order — Dropship

**SECTION 3 — DECISION MATRIX**

3.1 Master Decision Matrix

# **Tables of Content:**

Table 1 - Master Decision Matrix

# **SECTION 1 — OVERVIEW & DEFINITIONS**

### **1.1 Vendor Overview**

  - > EJ Main Warehouse orders are processed via the vendor portal.

  - > There is no MOV for EJ Other Warehouses

  - > Vendor Orders are placed every alternate day

  - > Primary Warehouse:

> → FL02 (Plant City, FL) — primary warehouse for DK Hardware.

  - > EJ operates 14 additional warehouses beyond the main facility.

  - > Orders for Other Warehouses are processed every alternate day.

  - > Always prefer FL02 for:

> → Freight items  
> → Long items (up to 96")  
> → All in-house orders when available  
> → Dropship from FL02 is allowed (Updated: 2026-04-26)

  - > Items are moved to EJ Other Warehousing when:

> → Not available in FL02, and  
> → Not available through alternate vendors.

  - > Dropship is allowed from FL02 and other warehouses. (Updated: 2026-04-26)

  - > Dropship is supported only under conditions outlined in Section 1.2.

  - > Always copy vendor confirmation number.

  - > Never mix dropship and in-house items in one vendor order.

**Key Points:**

✔ Evaluate nearest EJ warehouse for dropship  
✔ Verify parcel vs freight shipping before dropship  
✔ Keep CX orders consistent (no mixed fulfillment)  
✔ Move OFS items to OFS vendor order  
✔ Monitor OFS orders for restock  
✔ Maintain clean VO notes with confirmation

**Always Avoid:**

❌ Do NOT process cancelled / seasonal OFS items  
❌ Do NOT dropship freight or truck shipments  
❌ Do NOT dropship hazmat, clay, or heavy items  
❌ Do NOT process Canada/international as dropship  
❌ Do NOT mix in-house & dropship items in one order  
❌ Do NOT process items unavailable in EJ & alternates

## **1.2 Warehouse & Dropship Decision Logic**

## If an item is available at the customer’s nearest EJ warehouse, evaluate for dropship.

  - ## If the customer has paid sufficient shipping and dropship conditions are met → **Dropship**

  - ## Otherwise → **Process In-House**

## **1.3 Hard Stop Rules (DO NOT PROCESS)**

Immediately stop processing if item is:

❌ Cancelled  
❌ Seasonal + OFS → Mark Discontinued  
❌ ESCPO / Restricted item  
❌ Not available in any EJ warehouse (after checking alternates)

## **1.4 Shipping Based Dropship Rules**

### **1.4.1 Shipping-Based Dropship Rules (Critical)**

Dropship is allowed **ONLY** when cart shipping shows:

✔ FedEx / UPS Ground (Parcel)  
✔ No Truck / No Freight

Item must be:

  - > Not heavy

  - > Not freight

  - > Not clay

  - > Not hazmat

  - > U.S. domestic shipment only

➡ If all conditions match → Process as **CUSTOMER DROPSHIP**

### **1.4.2 Dropship is NOT Allowed When:**

  - > Cart shows Truck / Freight

  - > Item is heavy, clay, hazmat

  - > Canada or international shipment

  - > Customer order contains other in-house items  
    > *(Consolidation rule — keep fulfillment consistent)*

➡ Process **In-House**

## **1.5 Out-Of-Stock (OFS) Rules**

Move item to **EJ – OFS Vendor Order** when:

  - > Item OFS in all EJ warehouses, **OR**

  - > Available only as freight/truck and cannot be processed.

### **OFS Handling:**

  - > Submit OFS orders only after minimum order value is reached.

  - > Review OFS orders regularly.

  - > If item restocks → move back to active EJ Vendor Order.

### **1.6 Warehouse Consolidation & Limited Stock Rule**

  - > If a warehouse contains only one line item, dropship the item and close the warehouse.

  - > If the same item appears across multiple warehouses and stock is limited:
    
      - > Check with Elina before processing.
    
      - > Consolidate and process as a single line item whenever possible.

**SECTION 2 — PROCESSING ORDERS**

# **2.1 PROCESSING A CUSTOMER ORDER — IN-HOUSE**

**Steps:**

**2.1.1 Step 1 —** **Open Process Incoming Order**

**2.1.2 Step 2 — Assign item quantity to EJ**

**2.1.3 Step 3 — Select:**

  - > Use Existing Vendor Order, OR

  - > Create New Vendor Order

**2.1.4 Step 4 —** **Click Process Changes**

**2.1.5 Step 5 —** **Payment**

**Authorize & charge except:**

  - > Amazon

  - > Zoro

  - > Net 30

**2.1.6 Step 6** **— Order status**

  - > New → Coming In-House

### **2.2 PROCESSING A CUSTOMER ORDER — DROPSHIP**

**Steps:**

**2.2.1 Step 1 — Open Process Incoming Order**

**2.2.2 Step 2 — Assign item quantity to EJ**

**2.2.3 Step 3 — Create Vendor Order:**

  - > Shipping = Dropship

  - > Inline comment: 24 Hours Request

**2.2.4 Step 4 — Click Process Changes**

**2.2.5 Step 5 — Process Payment**

**Charge except:**

  - > Amazon

  - > Zoro

  - > Net 30

**2.2.6 Step 6 — Order status**

  - > New → Placed for Dropship

### **2.3 PROCESSING A VENDOR ORDER — IN-HOUSE**

**Steps:**

**2.3.1 Step 1 — Open Vendor Order**

**2.3.2 Step 2 — Update status**

  - > New → Submitted to Vendor

**2.3.3 Step 3 —** **Log in to EJ Portal**

**2.3.4 Step 4 — Add items exactly matching the VO:**

  - > SKU

  - > Quantity

  - > Specifications

  - > Price

**2.3.5 Step 5 — Validate**

  - > EJ Cart Total = BO Vendor Order Total

**2.3.6 Step 6 — Submit order**

**2.3.7 Step 7 — Paste into VO Notes:**

  - > EJ Confirmation Number

  - > ETA (per EJ schedule)

### **2.4 PROCESSING A VENDOR ORDER — DROPSHIP**

**Steps:**

**2.4.1 Step 1 — Open Vendor Order**

**2.4.2 Step 2 — Verify dropship eligibility via cart shipping**

**2.4.3 Step 3 —** **Create PO from BO**

*(do not manually add item again)*

**2.4.4 Step 4 — Confirm**

  - > Customer shipping address

  - > Shipping = Parcel (FedEx / UPS Ground)

**2.4.5 Step 5 — Submit order**

**2.4.6 Step 6 — Vendor Order status updates automatically**

**2.4.7 Step 7 — Paste confirmation number into VO Notes**

**SECTION 3 — DECISION MATRIX**

Table 1 - Emery Jensen (Other Warehouses) Decision Matrix

<table>
<thead>
<tr class="header">
<th><strong>Scenario</strong></th>
<th><strong>Condition</strong></th>
<th><strong>Shipping Type</strong></th>
<th><strong>Customer Location</strong></th>
<th><strong>Action</strong></th>
<th><strong>Notes</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Item available at nearest EJ warehouse</td>
<td>Yes</td>
<td><p>Parcel (FedEx/</p>
<p>UPS Ground)</p></td>
<td>U.S. Domestic</td>
<td>Evaluate Dropship</td>
<td>Proceed if customer paid sufficient shipping</td>
</tr>
<tr class="even">
<td>Dropship conditions met</td>
<td>Parcel shipping, non-heavy, non-hazmat</td>
<td>Parcel</td>
<td>U.S. Domestic</td>
<td>Dropship</td>
<td>Add inline note: 24 Hours Request</td>
</tr>
<tr class="odd">
<td>Dropship conditions NOT met</td>
<td>Truck / Freight required</td>
<td>Freight</td>
<td>Any</td>
<td>In-House</td>
<td>Dropship not allowed</td>
</tr>
<tr class="even">
<td>Item heavy / freight / clay / hazmat</td>
<td>Any</td>
<td><p>Freight/</p>
<p>Truck</p></td>
<td>Any</td>
<td>In-House</td>
<td>Safety &amp; carrier restrictions</td>
</tr>
<tr class="odd">
<td>Canada / International order</td>
<td>Any</td>
<td>Any</td>
<td>International</td>
<td>In-House</td>
<td>Dropship not allowed</td>
</tr>
<tr class="even">
<td>CX order contains other in-house items</td>
<td>Any</td>
<td>Any</td>
<td>Any</td>
<td>In-House</td>
<td>Consolidation rule</td>
</tr>
<tr class="odd">
<td>Customer did not pay sufficient shipping</td>
<td>Parcel</td>
<td>U.S. Domestic</td>
<td>In-House</td>
<td>Do not dropship without coverage</td>
<td></td>
</tr>
<tr class="even">
<td>Item not available in FL02 &amp; no alternates</td>
<td>Available in EJ other warehouse</td>
<td>Parcel</td>
<td>U.S. Domestic</td>
<td>Process via EJ Other Warehouse</td>
<td>Use standard logic</td>
</tr>
<tr class="odd">
<td>Item cancelled</td>
<td>Any</td>
<td>Any</td>
<td>Any</td>
<td>STOP — Do Not Process</td>
<td>Inform &amp; discontinue</td>
</tr>
<tr class="even">
<td>Seasonal + OFS</td>
<td>Any</td>
<td>Any</td>
<td>Any</td>
<td>Mark Discontinued</td>
<td>Notify customer</td>
</tr>
<tr class="odd">
<td>ESCPO / restricted item</td>
<td>Any</td>
<td>Any</td>
<td>Any</td>
<td>STOP</td>
<td>Do not process</td>
</tr>
<tr class="even">
<td>Not available in any EJ warehouse</td>
<td>N/A</td>
<td>N/A</td>
<td>Any</td>
<td>Check alternate vendors</td>
<td>If none → OFS order</td>
</tr>
<tr class="odd">
<td>Available only as freight/truck &amp; cannot process</td>
<td>Freight only</td>
<td>Freight</td>
<td>Any</td>
<td>Move to EJ OFS Order</td>
<td>Submit after MOV reached</td>
</tr>
<tr class="even">
<td>OFS item restocked</td>
<td>N/A</td>
<td>N/A</td>
<td>Any</td>
<td>Move back to active VO</td>
<td>Resume processing</td>
</tr>
</tbody>
</table>
