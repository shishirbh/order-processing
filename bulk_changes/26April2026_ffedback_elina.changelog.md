# Changelog for 26April2026_ffedback_elina.csv

Source CSV: `bulk_changes/26April2026_ffedback_elina.csv`
Reviewer(s): Elina
This file accumulates one entry per row processed. Re-running the skill on the
same CSV appends new entries rather than overwriting — the file is the audit
trail for the batch.

---

### Row 1 — Top-Notch — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/TopNotch/Top-Notch Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Marketplace dropship | "Customer order is non-marketplace (NO Amazon/Walmart/eBay/Wayfair)" listed as a dropship eligibility criterion | Marketplace orders (Amazon/Walmart/eBay/Wayfair) are eligible for dropship | Removes false restriction; CS can now dropship marketplace orders from TopNotch |
  | Decision matrix — Order value < $500 | Explicit row: "Order value < $500 → In-house (MOV not met)" | Row removed — covered implicitly by dropship eligibility criteria | Reduces confusion; < $500 in-house behavior unchanged, just no redundant row |
  | Decision matrix — Marketplace row | "Do NOT dropship — Always in-house" | "Dropship allowed — No restriction on marketplace dropship" | Aligns matrix with corrected policy |

- **Notes:** —

---

### Row 2 — IML Security Supply — flagged for human review (partial)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/IML/IML Security Supply Process Document.md`
- **Status:** skipped — no change required (all good) + flagged for human review (discussion)

- **Notes:** Elina says "All good" for most of the document. She also flags that in-house ordering clarity is missing ("not clear on what how are we ordering in house"). Section 3.1 has in-house steps, but Elina finds them unclear. No edit applied. **Flagged for human review:** Clarify/expand Section 3.1 (Processing Vendor Order — In-House) based on a walkthrough with Elina.

---

### Row 3 — Structure Glass (STRUCTURE GLASS SOLUTIONS) — flagged for human review
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/STRUCTURE GLASS SOLUTIONS/STRUCTURE GLASS SOLUTIONS Process Document.md`
- **Status:** flagged for human review

- **Notes:** Elina says the document needs to be completely rewritten and requests a discussion with the processing team. Some actionable notes exist (oversized items without restriction up to 240"/144"; vendor in Miami so in-house preferred; dropship only for Next Day/Second Day orders; driver pickup from vendor possible). No changes applied per user's instruction to skip and log. **Action required:** Discuss with Elina and processing team, then rewrite from scratch.

---

### Row 4 — Lavi Industries — applied (actionable parts) + flagged for human review (gap)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/LAVI/LAVI Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Price fluctuation label | "Lavi pricing changes frequently. Mandatory Pricing Workflow:" | "Lavi pricing does not change frequently, but always wait for price confirmation before proceeding." | Removes incorrect characterization while preserving mandatory confirmation step |
  | In-house vs dropship pricing | Inline raw note from Elina (not formatted) | Clean rule: "DK has separate pricing for in-house and dropship orders. Backoffice shows in-house pricing. Use correct price set based on order type." | Properly incorporated into the document |
  | Vendor address (BOL freight workflow) | Embedded raw note: "IS incorrect, they are moving to TX in January" | Clean instruction: "Lavi is relocating to Texas — confirm current address with Xavier before calculating freight. Previous CA address (27810 Avenue Hopkins, Valencia, CA 91355) is no longer valid." | Removes confusing inline markup, makes action clear |

- **Notes:** Elina also notes that nothing in the document covers in-house ordering (when to order in-house, how to submit/revise in-house orders). **Flagged for human review:** Add in-house ordering section after discussing with Elina.

---

### Row 5 — Cal-Royal — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Cal-Royal/Cal-Royal Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | In-house order minimum | "No Minimum Order Value for In-House orders" | "In-house orders under $50.00 are subject to a service charge" | Adds missing service charge rule |
  | Online order minimum | Not stated | "Orders cannot be submitted online if order total is less than $100.00" | Adds the online submission threshold |

- **Notes:** Elina confirmed "everything else is good."

---

### Row 6 — MSC Direct — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/MSC Direct/MSC Direct Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Customization signed quote | "Vendor Quote + Signed Customer Quote Required" for all customizations | Vendor Quote required; Signed Customer Quote only for special/modified items or large qty/high-value orders | Removes unnecessary friction for routine customization quotes |
  | Stock quantity rule | "NEVER exceed available quantity" (blanket) contradicted by "backorders allowed" in step 2.1.2 | Two-tier rule: (1) Do NOT exceed qty when price is for available stock only. (2) For regular items, can order more — vendor will backorder. | Resolves internal contradiction; clarifies when each rule applies |

- **Notes:** —

---

### Row 7 — D&D Technologies — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/D&D Technologies/D&D Technologies Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Standard ground order method | Section 1.2.2: Dropship standard ground when customer selects normal shipping | Process standard ground orders In-House — most items have case minimums for better pricing; reserve dropship for expedited only | Aligns doc with actual practice; prevents unnecessary dropship on standard orders |
  | Decision matrix — Standard Ground | "Customer Order – Standard Ground → Dropship → Dropship Standard Template" | "Customer Order – Standard Ground → In-House → Standard Template — Order in-house for case min / better pricing" | Matches section 1.2.2 correction |

- **Notes:** —

---

### Row 8 — Aria Vetri — flagged for human review
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Aria Vetri/Aria Vetri Process Document.md`
- **Status:** flagged for human review

- **Notes:** Elina says the whole document is incorrect and requests a discussion with the processing team to rewrite completely. No changes applied per user's instruction to skip and log. **Action required:** Discuss with Elina and rewrite from scratch.

---

### Row 9 — Jeske — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Jeske/Jeske Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Oversized/freight item dropship threshold | "Dropship allowed at $1,500+" (MOV threshold for oversized) | Dropship oversized items up to 95" preferred — keeps in-house order flowing at the lower $350 in-house MOV. Exception: if vendor has min order qty and customer ordered less → order in-house. Check shipping cost at checkout before confirming. | Removes false $1,500 barrier; allows in-house order to proceed without waiting |
  | Section 2.3 (Freight Dropship) | "Allowed only if MOV ≥ $1,500" | Threshold removed; process by selecting $0 freight shipping | Aligned with updated eligibility rule |
  | Section 2.4 (Non-Freight Oversized) | "If MOV met ($1,500) → dropship; if not → charge shipping or move in-house" | Dropship preferred for items up to 95"; check vendor min qty, review checkout shipping cost, decide accordingly | Practical decision flow replaces fixed dollar gate |
  | Decision matrix — Oversized/Freight | Two rows: ≥$1,500 → Dropship; <$1,500 → Charge shipping or in-house | Single row: "Dropship preferred — check shipping cost at checkout; if vendor min qty not met, order in-house" | Simplifies matrix |

- **Notes:** —

---

### Row 10 — Imperial Dade — flagged for human review
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Imperial Dade/Imperial Dade Process Document.md`
- **Status:** flagged for human review

- **Notes:** Elina says everything is incorrect and asks to contact her for correct information. No changes applied per user's instruction to skip and log. **Action required:** Contact Elina and rewrite the document.

---

### Row 11 — Hardware Resources — applied (actionable part) + flagged for human review (discussion)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Hardware Resources/Hardware Resources Process Document.md`
- **Status:** applied (partial) + flagged for human review

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | In-house order submission method | "Vendor orders are processed only by email using Backoffice (BO)" | "In-house orders are processed via the vendor website. Dropship orders are processed by email using BO." | Corrects the inaccurate blanket email-only rule |
  | Section 3.1 Step 4 | "Send Email — Click By Email — Use Account 1 template" | "Submit via Website — In-house (Account 1) orders placed on the vendor website, not by email" | Matches Section 1.1 correction |

- **Notes:** Elina also flags "many points are incorrect" regarding dropship determination logic and asks to discuss this vendor. **Flagged for human review:** Review full dropship routing logic (Account 1 vs Account 2, when to dropship) with Elina before further edits.

---

### Row 12 — Emery Jensen (ACE - Emery Jensen) — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/ACE - Emery Jensen/ACE - Emery Jensen Process Document - Main Warehouse.md` and `ACE - Emery Jensen Process Document - Other Warehouses.md`
- **Status:** applied
- **Notes:** Main `ACE - Emery Jensen Process Document.md` is a stub. The FL02 dropship rule lives in the Main Warehouse and Other Warehouses sub-documents — both updated. Consider moving to main doc after stub is filled.

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | FL02 (Florida) warehouse dropship | "Never dropship from FL02" (hard rule in Section 1.1, Always Avoid, and decision matrix) | "Dropship from FL02 is allowed" | Removes false restriction; CS can now dropship from the primary FL warehouse |

---

### Row 13 — ERP — skipped (no vendor folder)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** N/A
- **Status:** skipped — no vendor folder

- **Notes:** "ERP" is an internal system, not a supplier. No vendor folder found. Elina's note (ERP says we can't dropship; dropship IS allowed with a $20 fee including shipping and handling) appears to be about an internal system configuration, not a vendor SOP. Flagged for human review to address in the appropriate internal documentation.

---

### Row 14 — HD Supply (Home Depot - US lock - HD Supply) — applied
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Home Depot - US lock - HD Supply/Home Depot - US lock - HD Supply Process Document.md`
- **Status:** applied

- **Difference summary:**

  | Area | Old Rule | New Rule | Impact |
  |------|----------|----------|--------|
  | Marketplace orders | Not stated (stub doc) | "Marketplace orders are allowed in some instances depending on the item — evaluate per order; do not apply a blanket 'no marketplace' rule" | Adds missing marketplace policy to stub |

- **Notes:** Document was a stub. Applied to "Special handling / gotchas" section and updated Last Updated date.

---

### Row 15 — National Oak — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/National oak/National oak Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 16 — Hager — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Hager/Hager Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 17 — Amerock — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Amerock/Amerock Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 18 — Richelieu — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Richelieu/Richelieu Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 19 — Pool Corp — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Pool Corp/Pool Corp Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 20 — US Horizon — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/US Horizon/US Horizon Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 21 — Glass Warehouse — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Glass Warehouse/Glass Warehouse Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 22 — Southern Lock — skipped (already marked Completed)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/Southern Lock/Southern Lock Process Document.md`
- **Status:** skipped — already marked Completed in source CSV

---

### Row 23 — CRL — skipped (no change required)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/CRL/CRL Process Document.md`
- **Status:** skipped — no change required per reviewer (Changes Requested field is blank)

---

### Row 24 — FHC — skipped (no change required)
- **Run at:** 2026-04-26 (skill: sop-refresh, mode: bulk-csv)
- **Reviewer:** Elina
- **Target file:** `Vendors/FHC/FHC Process Document.md`
- **Status:** skipped — no change required per reviewer (Changes Requested field is blank)
