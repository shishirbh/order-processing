# Vendor Process Document — Naming Convention Audit

**Date:** 2026-05-01  
**Scope:** 112 Process Documents across 103 vendors in `Vendors/`  
**Method:** Term frequency analysis across all `*Process Document*.md` files

---

## Summary

Vendor Process Documents have accumulated **inconsistent naming** for the same concepts over time. This leads to:
- Searchability gaps (e.g., searching "MOV" misses "Minimum Order Value")
- Agent confusion when a skill is told to look for "In-House" but the file says "INHOUSE"
- Human readability issues for new team members

Below is a categorized audit of every conflicting term found, ranked by severity (frequency × confusion potential).

---

## 1. Minimum Order Value (Critical — most variation)

| Term | Occurrences | Files using it |
|------|-------------|----------------|
| **MOV** | 194 | Deltana, ACE, Banner, FHC, Hafele, Contacta, FWP, Haven, Do it best, and ~20 more |
| **Minimum Order Value (MOV)** | 12 | Deltana, Banner, FHC |
| **Minimum Order** | 52 | Amerock, Ameriseal, Assa Abloy, Door Controls, Fairchild, and ~30 more |
| **Minimum Order Requirement** | 3 | Fairchild, Assa Abloy |
| **Minimum Order Quantity (MOQ)** | 3 | FHC (used alongside MOV for a different concept) |
| **Min Order** | 4 | Drill America |
| **minimum** (bare word) | 34 | Scattered across files |

**Problem:** A skill told to "check MOV" will fail silently on Amerock's document, which uses "Minimum Order" without the acronym. An agent searching for "Minimum Order Value" won't match "Min Order" or bare "minimum."

**Recommended standard:** `Minimum Order Value (MOV)` on first use, then `MOV` thereafter.

---

## 2. In-House (High variation)

| Term | Occurrences | Example files |
|------|-------------|---------------|
| **In-House** | 384 | Deltana, Amerock, EPCO, Cal-Royal, and ~40 more |
| **in-house** | 137 | Mixed case within same files |
| **IN-HOUSE** | 59 | Headers and decision matrices |
| **In-house** | 34 | Sentence-case starts |
| **inhouse** | 3 | EPCO (edge case: "inhouse orders too") |
| **INHOUSE** | 2 | Rare |
| **IN House** | 1 | One file |

**Problem:** `inhouse` vs `in-house` vs `IN HOUSE` — minor typos cause grep misses. The hyphenated form dominates but isn't universal.

**Recommended standard:** `In-House` (title case with hyphen).

---

## 3. Dropship (Medium variation)

| Term | Occurrences |
|------|-------------|
| **Dropship** / **dropship** / **DROPSHIP** | ~1,200 total |
| **ds** (lowercase abbreviation) | 205 |
| **DS** (uppercase abbreviation) | 9 |
| **drop-ship** (hyphenated) | 1 |

**Problem:** `ds` and `DS` are ambiguous (could also mean "direct ship" or be a typo). Not all files define the abbreviation.

**Recommended standard:** `Dropship` on first use, optionally `DS` after definition.

---

## 4. Backorder / BO (Medium — dangerous ambiguity)

| Term | Occurrences |
|------|-------------|
| **Backorder** / **backorder** | 156 |
| **BO** / **bo** / **Bo** | 344 |

**🚨 Critical:** `BO` also means **Backoffice** in many files (e.g., EPCO: "processed only by email using Backoffice (BO)"). An agent seeing "BO" in one context may misinterpret it entirely.

| File | `BO` means |
|------|-----------|
| Deltana | (not used) |
| EPCO | **Backoffice** |
| Contacta | **Backoffice** |
| Amerock | (not used — says "Backorder" in full) |

**Recommended standard:** Never abbreviate "Backorder" as `BO`. Use `Backorder` in full. Reserve `BO` exclusively for **Backoffice**.

---

## 5. ETA / Lead Time (Medium variation)

| Term | Occurrences |
|------|-------------|
| **ETA** / **eta** | 401 |
| **Lead time** / **lead time** | 49 |
| **processing time** | 1 |

**Problem:** "Lead time" and "ETA" are used interchangeably but mean different things (lead time = before shipping, ETA = arrival date). Most files use "ETA" for both concepts.

**Recommended standard:** Distinguish them. `ETA` = arrival date. `Lead time` = processing time before dispatch.

---

## 6. Vendor Order / PO (Medium)

| Term | Occurrences |
|------|-------------|
| **PO** / **po** | 406 |
| **Vendor Order** / **vendor order** | 329 |
| **Purchase Order** / **purchase order** | 11 |

**Problem:** `PO` is universally understood but "Vendor Order" is the more common full form in these docs. Some files use "VO" (Vendor Order) informally — not captured above but present in headers.

**Recommended standard:** `Vendor Order` or `VO` (consistent with the Backoffice UI). Define once per document.

---

## 7. Backoffice (Medium)

| Term | Occurrences |
|------|-------------|
| **Backoffice** | 88 |
| **Back Office** | 33 |
| **backoffice** | 8 |
| **back office** | 3 |
| **BackOffice** | 1 |

**Problem:** Same word, three spacing/casing conventions. Trivial to standardize.

**Recommended standard:** `Backoffice` (one word, title case).

---

## 8. SKU / Item Number (Low variation but worth noting)

| Term | Occurrences |
|------|-------------|
| **SKU** | 48 |
| **item number** / **Item Number** | 11 |
| **part number** / **Part number** | 5 |
| **item #** | 1 |

**Problem:** "Item Number" and "SKU" may or may not be the same thing depending on the vendor. Some vendors use "Part Number" for manufacturer codes.

**Recommended standard:** `SKU` for DK's internal identifier. `Vendor Part #` for vendor-specific codes.

---

## 9. Freight / LTL / Ground / Expedited (Low — domain consistency)

| Term | Occurrences |
|------|-------------|
| **Freight** / **freight** | 541 |
| **Ground** / **ground** | 193 |
| **Expedited** / **expedited** | 243 |
| **LTL** | 22 |
| **shipping cost** / **Shipping cost** | 91 |

**Problem:** `LTL` is used without definition in most files. "Shipping cost" and "freight" are used as synonyms when they may not be (freight often implies LTL/truck).

**Recommended standard:** Define `LTL` on first use. Use `Shipping` for small-package, `Freight` for LTL/truck.

---

## 10. Quantity / QTY / Count

| Term | Occurrences |
|------|-------------|
| **count** / **COUNT** | 299 |
| **quantity** / **Quantity** | 124 |
| **qty** / **Qty** / **QTY** | 40 |
| **units** / **Units** | 19 |

**Problem:** `count` is used heavily (likely from column headers in tables). `qty` and `quantity` are used interchangeably in prose.

**Recommended standard:** `Qty` in tables/columns, `quantity` in prose.

---

## 11. Customer Order / CO

| Term | Occurrences |
|------|-------------|
| **co** (lowercase, mostly in URLs/paths) | 1,490 |
| **Co** (title case) | 857 |
| **Customer Order** | 111 |
| **CO** (uppercase) | 122 |

**Problem:** `CO` suffers the same ambiguity as `BO`. In some contexts it's "Customer Order," in others it could be "Company" or part of a filename/path.

**Recommended standard:** Spell out `Customer Order` in prose. `CO` is acceptable in tables and decision matrices after definition.

---

## 12. BOL / Bill of Lading

| Term | Occurrences |
|------|-------------|
| **BOL** | ~30 (EPCO, Contacta, others) |
| **Bill of Lading** | ~5 |

**Problem:** `BOL` is used extensively in EPCO and Contacta docs without being defined. Not all team members may know the term.

**Recommended standard:** `Bill of Lading (BOL)` on first use.

---

## 13. Email Fields: Subject / CC

| Term | Occurrences |
|------|-------------|
| **Subject:** | 39 |
| **CC:** | 6 |
| **subject:** | 5 |

**Problem:** Minor but inconsistent casing on template fields.

**Recommended standard:** `Subject:` (title case with colon). `CC:` (uppercase with colon).

---

## Recommendations

### Immediate (fix the dangerous one)

1. **Ban `BO` for Backorder.** Replace all instances of `BO` meaning "Backorder" with the full word. Reserve `BO` exclusively for Backoffice. This is the single highest-risk ambiguity.

### Short-term (standardize the top 5)

2. **Adopt `Minimum Order Value (MOV)`** as the canonical first-use form across all documents.
3. **Standardize `In-House`** (with hyphen, title case).
4. **Write a one-page style guide** (see appendix below) and add it to `_shared_sops/`.
5. **Add a pre-commit or CI check** that flags known discouraged abbreviations (`bo` for backorder, `inhouse`, `IN HOUSE`).

### Long-term

6. **Retrofit existing documents** — a bulk find-and-replace using the style guide.
7. **Add the style guide to the `add-new-vendor` skill** so new documents follow conventions from day one.

---

## Appendix: Proposed Style Guide Snippet

```markdown
## Term Conventions for Vendor Process Documents

| Concept | Use this | Do NOT use |
|---------|----------|------------|
| Minimum order dollar amount | Minimum Order Value (MOV) | Min Order, MOQ (unless QTY-based), bare "minimum" |
| Stocked at DK warehouse | In-House | inhouse, INHOUSE, IN HOUSE |
| Shipped directly to customer | Dropship (DS after first use) | ds, drop-ship |
| Items not in stock / pending | Backorder | BO (reserved for Backoffice) |
| Order processing system | Backoffice | Back Office, BackOffice |
| Estimated arrival | ETA | (use Lead Time for processing duration) |
| DK's internal identifier | SKU | item #, Item Number |
| Vendor's product code | Vendor Part # | SKU (when referring to vendor codes) |
| Quantity | Qty (tables), quantity (prose) | count (ambiguous) |
| Customer's order | Customer Order (CO in tables) | bare "co" |
| Truck/large freight | Freight / LTL | (define LTL on first use) |
| Bill of Lading | Bill of Lading (BOL) | bare BOL without definition |
```

---

*Generated from analysis of 112 Process Documents across 103 vendor folders in `order_processing/Vendors/`.*
