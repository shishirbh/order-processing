# Process Document Standardization Proposal
_Last updated: 2026-05-26 (rev 3 — current corpus alignment) — author: Shishir's Cowork session_

This proposal is based on a structural and content sweep of every `*Process Document*.md` file in `Vendors/` (105 vendor folders; 112 process documents; 77 docs with real content; 35 still stubs; 13 large docs with 10KB+). The count is document-based, not folder-based, because several vendors have account- or warehouse-specific process documents.

Rev 3 adds: current scope counts, multi-document vendor handling, fixed `_rules/` location, rule IDs, role token syntax, routing-matrix vs rule-table distinction, expanded step verbs, open-gap tracking, and direct incorporation of `docs/naming-convention-audit.md`. Rev 2 added: cross-vendor rule duplication evidence, workflow-name collapse mapping, step-verb controlled vocabulary, decision-matrix column lock-down, named-person-as-gatekeeper findings, and a markdown style guide.

---

## 1. What's actually inconsistent today

The docs roughly share a skeleton (`SECTION 1 OVERVIEW → SECTION 2 EMAIL TEMPLATES (sometimes) → SECTION 3 PROCESSING → SECTION 4 DECISION MATRIX`), but the variations make them painful to consume — by humans and by the lookup skills.

**Section structure drift**

| Section 2 heading | Count |
|---|---|
| `SECTION 2 — PROCESSING ORDERS` | 49 |
| `SECTION 2 — EMAIL TEMPLATES` | 19 |
| `SECTION 2 — DECISION MATRIX` | 4 |
| `SECTION 2 — DROPSHIP EMAIL TEMPLATES` | 2 |
| `SECTION 2 — EMAIL TEMPLATES STANDARDS AND RESTRICTIONS` | 1 |
| `SECTION 2 - ITEM CATEGORIES AND SHIPPING METHODS` (CRL) | 1 |
| `SECTION 2 — SHIPPING METHODS & PROCEDURES` | 1 |

So "Processing" can be section 2 _or_ section 3 depending on whether the vendor has a dedicated Email Templates block. CRL is its own beast with 12 custom sections.

**First-subsection drift (the 1.1 of every doc)**

| 1.1 heading | Count |
|---|---|
| `1.1 Vendor Overview` | 28 |
| `1.1 Vendor Rules` | 26 |
| `1.1 Key Rules & Notes` | 12 |
| `1.1 MANDATORY FIRST STEP - Orders Classification` | 5 |
| `1.1 General Rules` | 2 |
| `1.1 Critical Rules Summary:` | 1 |
| `1.1 OFS ORDER RULES` | 1 |
| `1.1 Warehouse Locations` | 1 |

These are all the same idea written six different ways.

**Order-type taxonomy drift**

The same workflow is named multiple ways across docs:

- `PROCESSING A VENDOR ORDER — IN-HOUSE` (12) vs `PROCESSING VENDOR ORDER — IN-HOUSE` (4) — article inconsistency
- `PROCESSING A CUSTOMER ORDER — STANDARD DROPSHIP` vs `PROCESSING CUSTOMER ORDER — DROPSHIP`
- `PROCESSING A VENDOR and CUSTOMER ORDER — IN-HOUSE` — combined when other docs split them
- "Vendor Order" and "Customer Order" are sometimes used as synonyms, sometimes as distinct concepts (PO-to-vendor vs the originating customer order)

**113 workflow-heading variants is too many.** Re-running the heading sweep across the current 77 non-stub process docs produces **113 distinct heading-like workflow names**. The increase is mostly from split warehouse/account docs and minor formatting variants (article placement, "Standard Dropship" vs "Dropship", account-number suffixes, hyphen vs em-dash). They still map cleanly to the same six canonical workflows — see §3.2 for the full collapse table.

Compounding this: **15 of the 77 non-stub docs declare zero explicit workflow headings** by the current heading pattern. They have content under generic processing sections or rulebook-style sections but never name an In-House vs Dropship vs Freight branch. So a reader can't tell which rules apply to which fulfillment type without inferring from prose.

**Multi-document vendor drift**

The standard must handle vendors with more than one process document. Today four vendor folders already do this:

| Vendor folder | Process docs | Why this matters |
|---|---:|---|
| `ACE - Emery Jensen` | 3 | Main warehouse vs other warehouse flows need separate scope. |
| `Do it best` | 3 | Main vs OFS / other warehouse flows use different rules. |
| `Home Depot - US lock - HD Supply` | 2 | One primary stub plus one real US Lock flow. |
| `True Value` | 3 | Main vs RDC warehouse flows are distinct. |

Without a parent/child convention, these split docs look like duplicates, and counts like "one SOP per vendor" become misleading.

**Title format drift**

`VENDOR - HAFELE AMERICA CO.`, `VENDOR - ATF` (abbreviation only), `VENDOR - DOOR CONTROLS USA (DCU)`, `VENDOR - FWP Customer Orders` (workflow leaked into title), `VENDOR - D\&D TECHNOLOGIES` (escape artifact), and so on.

**Decision Matrix is uneven**

Some docs (Hafele, Strybuc, FHC, ORS Nasco, Bohle) have proper markdown tables. Others have only the header with the table missing or rendered as bullet lists. CRL has 231 table rows; Glass Warehouse has 22.

Worse: **decision-matrix and nearby rule tables do not share a reliable schema.** The rev 2 sweep found 18 distinct decision-matrix header rows; the current broader sweep finds 72 distinct pipe-table header shapes near decision-matrix areas once split docs and category/rule tables are included. Some examples:

- `Scenario | Condition | Action | Notes`
- `Scenario | Order Type | Item Type | Stock | Action`
- `Scenario | Item Length | Shipping Speed | In Stock | Order Type | MOV Required | Ship To | FedEx Note`
- `Scenario | Addons? | Classification | Inline Comments | Email Addon List | Dropship | OA + Tracking Required | Action`

Same intent, different schemas. A reader (or a Q&A skill) can't reliably extract "what action does vendor X take when condition Y is met?" because column Y might not exist in vendor X's matrix at all. §3.5 below pins the **routing matrix** to a fixed five-column shape while still allowing detailed category/rule tables in Section 2 or appendices.

**Heading hierarchy is messy**

Section labels are written as bold paragraphs (`**SECTION 1 — OVERVIEW**`) rather than real H2 headings, while sub-points use `###` H3, `####` H4, sometimes `##` H2. That breaks markdown TOC tooling and makes programmatic linting hard.

**Step numbering is inconsistent**

- Deltana / AM Auto / Strybuc: `### **3.1.1 Step 1 — Verify & Move Order to Submit**` (4-level number + step label)
- ORS Nasco: `### **2.2.6 Step 6** — **Assign Products (Dropship)**` (split bold runs)
- Hafele: skips early steps and starts at `2.3.6 Step 6` (renumbering broke after edit)
- FHC: no numbered steps at all in Section 2

**Conversion artifacts**

29 current process docs still contain `\>` and `\[` escapes from the original docx → md conversion. Several have `"Tables of Content:"` duplicated.

**Vocabulary**

`MOV`, `MOQ`, `BOL`, `ETA`, `VO`, `CX`, `PO`, `IH`, `DS`, `DCU` are used widely but defined in only a handful of docs (Strybuc, CRL, ORS Nasco). New staff have to infer.

**Emoji conventions**

55 docs use ✅ ❌ ⚠️ as decision markers; 13 don't. When they do appear, the meaning is consistent (good) — that's a pattern worth promoting.

**Cross-vendor rule duplication (this is the biggest hidden cost)**

Cross-cutting rules — ones that have nothing to do with any specific vendor — are copy-pasted into the vendor docs verbatim. Examples found verbatim in multiple docs:

- `FedEx and BOL instructions must NEVER be mixed` — present in Taymor, Perfect Score, EPCO, Contacta, and several more (40 process docs reference FedEx in a vendor-agnostic way).
- `❌ Mixing FedEx + BOL instructions` — same paragraph, different docs.
- HI/AK/PR shipping rules — appear in only 7 docs but the rule itself is global; the other vendors that allow shipping there have the rule silently missing.
- The DK FedEx account number `632647611` appears in 21 process docs and multiple formattings (`Account 632647611`, `Account #632647611`, `account No : 632647611`, etc.). One number, many presentations.
- 17 process docs duplicate vendor email addresses that already live in `<Vendor> - Vendor Info.md` (which is itself a rollup of `Vendor Information.md`).
- 73 process docs mention damage / claim / return / issue-resolution-adjacent language — but per `CLAUDE.md`, claims belong in `<Vendor> - Issue Resolution Notes.md` and the root `Issue resolution.md`. That's the wrong file for that content unless the note is only a pointer.

When a global rule changes (e.g., a new FedEx account, a new freight threshold), it has to be edited in dozens of vendor docs. That's how rules drift out of sync. §4 below proposes a Cross-Vendor Rules Library that fixes this at the root.

**Named individuals as approval gatekeepers**

Marina appears in **30 process docs**, Elina in **23 process docs** — typically as the approver for freight, BOL, expedited, or unusual-region orders. Examples from real text:

- `Request shipping review from Marina`
- `Send Info to Marina`
- `Yes (Elina)` (in a decision matrix Approval column)
- `❌ Sending expedited orders without Elina's approval`
- `Confirm with Marina/Justin`

Two problems: (1) when Marina or Elina change role, every doc has to be edited; (2) the docs imply only one person can approve, which makes the process brittle. The fix is to use **role tokens** (`{{PROCUREMENT_APPROVER}}`, `{{DK_COORDINATOR}}`) and keep the name-to-role mapping in one place. See §4.

**Casing and spelling chaos for the most-used terms**

These three terms appear in nearly every doc and are spelled four different ways each:

| Term | Variants observed | Current audit signal |
|---|---|---|
| In-House | `In-House`, `in-house`, `IN-HOUSE`, `In-house`, `inhouse`, `INHOUSE` | High variation; see naming audit §2 |
| Dropship | `Dropship`, `dropship`, `DROPSHIP`, `drop-ship`, `ds`, `DS` | ~1,200 total mentions; see naming audit §3 |
| Backoffice | `Backoffice`, `Back Office`, `backoffice`, `back office`, `BackOffice` | Five spelling/spacing variants; see naming audit §7 |

**Currency and threshold formatting**

`$2,000` (46×) vs `$2000` (3×); `$1,500` (19×) vs `$1500` (2×); some thresholds carry trailing zeros (`$20.00`, `$50.00`, `$0.00`), others don't. Thirteen distinct dollar-format variants for what should be a fixed numeric style.

**MOV vs MOQ are conflated**

`MOV` (Minimum Order Value, dollar threshold) appears in 55 process docs. `MOQ` (Minimum Order Quantity, per-line item count) appears in only 7. In several docs the terms are used interchangeably for the same concept, which is wrong — they're different gates that produce different decisions. Worth making this distinction explicit in the glossary and using each term only where it actually applies.

The newer naming audit (`docs/naming-convention-audit.md`) expands this into a full term-convention list across all 112 process docs. That audit is now the source of truth for vocabulary linting; this proposal owns the document structure and migration plan.

**Step-verb chaos**

The first step of every workflow uses a different verb. Across the docs:

| First-step verb | Count |
|---|---|
| Verify | 25 |
| Create | 14 |
| Confirm | 13 |
| Request | 7 |
| Open | 6 |
| Click | 5 |
| Identify | 4 |
| Visit / Update / Review / Add | 3 each |

These aren't all interchangeable. "Verify" implies a check; "Create" implies a write; "Click" is an UI gesture, not a process step. A controlled step-verb vocabulary makes workflows scannable. See §3.3.

---

## 2. Why this matters

Three concrete costs:

1. **Junior-staff onboarding.** Each vendor doc has to be re-learned because the section numbers don't mean the same thing across vendors. "Section 3" is Processing in some docs and Decision Matrix in others.
2. **Skill / Q&A reliability.** The `vendor-lookup` skill has to do fuzzy matches because section headings drift. Anything that's ever going to be machine-queried (RAG, agents, future internal tools) needs predictable anchors.
3. **Edit drift.** When a global rule changes — e.g., the FedEx dropship rule, or a freight threshold — finding every place to update is hard because the rule lives under different sub-headings in each doc. The recent `sop-refresh` bulk-changes flow already runs into this.

---

## 3. Proposed canonical template

A single skeleton, applied at three tiers based on vendor complexity. Every doc starts from the same shape; tiers determine which sections are required vs optional.

### 3.1 Document header (every doc)

```
# Vendor SOP — <Canonical Vendor Name>

| Field | Value |
|---|---|
| Parent brand | <e.g., Assa Abloy, or "—"> |
| Aliases / sub-brands | <comma list, or "—"> |
| Tier | 1 / 2 / 3 |
| Scope | Primary / Main Warehouse / Other Warehouse / Account 1 / Account 2 / etc. |
| Parent SOP | <relative link, or "—" if this is the parent SOP> |
| Document version | YYYY-MM-DD |
| Owner | <name / team> |
| Source-of-truth contact | See Vendor Info.md |
```

The header replaces the current `# **VENDOR - X**` titles and the embedded "Tables of Content" / "Figures" blocks (which are docx leftovers and add no value in markdown).

**Multi-document vendor convention.** A vendor can have one parent SOP plus child SOPs when warehouse, account, or fulfillment flows are materially different. The parent SOP carries vendor-wide rules and links to child SOPs; child SOPs must set `Parent SOP` and `Scope` in the header and contain only the scoped deviations and workflows. File names use:

- Parent: `Vendors/<Vendor>/<Vendor> Process Document.md`
- Child: `Vendors/<Vendor>/<Vendor> Process Document - <Scope>.md`

Examples: `ACE - Emery Jensen Process Document - Main Warehouse.md`, `Do it best Process Document - OFS & OW.md`, `True Value Process Document - RDC 41 Central.md`.

### 3.2 Six fixed sections

```
## Section 1. Vendor Overview
### 1.1 Vendor Identity         (name, parent, aliases — pulls from Vendor Info.md)
### 1.2 Contact Routing         (sales / claims / expedites — references, not duplicates)
### 1.3 Account & Portal Setup  (URLs, account #s, login owner)
### 1.4 Glossary                (only the abbreviations actually used in this doc)

## Section 2. Order Rules
### 2.1 Fulfillment Decision    (when In-House vs Dropship vs Special Order)
### 2.2 Eligibility Constraints (MOV, MOQ, freight thresholds, region restrictions)
### 2.3 Pricing & Fees          (handling, freight, BOL, expedite uplifts)
### 2.4 ETA & Lead Times
### 2.5 Always Avoid            (consolidated; no scattered "always avoid" callouts)

## Section 3. Processing Workflows
### 3.1 In-House Vendor Order
### 3.2 Dropship — Standard Ground
### 3.3 Dropship — Expedited (1–2 Business Day)
### 3.4 Dropship — Freight / BOL
### 3.5 Special Order / Quote
### 3.6 International / Restricted Region (HI, AK, PR, CA)

## Section 4. Email Templates              (only if vendor takes email POs)
### 4.1 Standard PO submission
### 4.2 Expedited request
### 4.3 Freight / BOL request
### 4.4 Special order / quote request

## Section 5. Decision Matrix
   Single table with fixed five-column schema (see §3.5)

## Section 6. Issue & Exception Routing
   One paragraph + pointer to <Vendor> - Issue Resolution Notes.md
   (do not duplicate claim handling here)

## Open Gaps
   Table of unresolved information gaps (see below)

## Changelog
   Last five material changes
```

A vendor that doesn't support a workflow simply omits its 3.x sub-section — but the section numbers stay the same. Section 3.4 is **always** "Freight / BOL", whether the vendor has it or not. `Open Gaps` and `Changelog` are tail blocks, not numbered sections, so the six-section anchor contract stays stable.

Every doc must include an `Open Gaps` table, even if it is empty:

| Gap | Needed From | Owner | Status | Last Checked |
|---|---|---|---|---|
| — | — | — | Closed / none | YYYY-MM-DD |

**Workflow-name collapse: 113 → 6.** Every existing workflow heading in the corpus maps to one of the six canonical 3.x slots:

| Existing name (sample) | Canonical |
|---|---|
| `PROCESSING A VENDOR ORDER — IN-HOUSE`, `PROCESSING VENDOR ORDER — IN-HOUSE`, `PROCESSING CUSTOMER ORDER — IN-HOUSE`, `PROCESSING VENDOR ORDER — ACCOUNT 1 (IN-HOUSE)` | **3.1 In-House Vendor Order** |
| `PROCESSING A CUSTOMER ORDER — STANDARD DROPSHIP`, `PROCESSING CUSTOMER ORDER — DROPSHIP`, `PROCESSING A CUSTOMER ORDER — DROPSHIP (SMALL ITEMS)`, `PROCESSING A VENDOR ORDER — DROPSHIP`, `PROCESSING SMALL ITEMS / SMALL QUANTITY ORDERS - DROPSHIP` | **3.2 Dropship — Standard Ground** |
| `PROCESSING A CUSTOMER ORDER — 1-2 BUSINESS DAY`, `PROCESSING EXPEDITED ORDERS (1–2 BUSINESS DAYS)`, `PROCESSING CUSTOMER ORDER - EXPEDITED DROPSHIP ORDERS` | **3.3 Dropship — Expedited (1–2 Business Day)** |
| `PROCESSING A CUSTOMER ORDER — FREIGHT DROPSHIP`, `PROCESSING DROPSHIP ORDERS — LARGE / FREIGHT ITEMS`, `PROCESSING A CUSTOMER ORDER — LARGE ITEM DROPSHIP (BOL REQUIRED)`, `PROCESSING A DROPSHIP ORDER - LARGE / FREIGHT ITEMS` | **3.4 Dropship — Freight / BOL** |
| `PROCESSING SPECIAL ORDERS/QUOTE ORDERS — DROPSHIP`, `PROCESSING SPECIAL ORDERS (EMAIL ONLY)`, `PROCESSING A SPECIAL ORDER — (CUSTOM / MADE-TO-ORDER)` | **3.5 Special Order / Quote** |
| `PROCESSING A CUSTOMER ORDER — INTERNATIONAL DROPSHIP`, `PROCESSING A CUSTOMER ORDER — HI / AK / PR DROPSHIP (Restricted States)`, `PROCESSING A CUSTOMER ORDER — CANADA DROPSHIP` | **3.6 International / Restricted Region** |

Vendors with branched accounts (`ACCOUNT 1` / `ACCOUNT 2`) split into 3.1a / 3.1b within the in-house slot rather than getting their own sections — this preserves the flat numbering that everything else depends on.

### 3.3 Workflow sub-section shape (rigid)

Every 3.x sub-section uses the same five blocks, in this order:

```
### 3.X <Workflow Name>

**When to use:** <single-sentence trigger>

**Pre-checks:**
- Required: ✅ <required precondition>
- Do not: ❌ <hard disqualifier>
- Caution: ⚠️ <edge case, if any>

**Steps:**
**Step 1 — <action>**
- <detail>
- System: <DK Backoffice / Vendor portal / Email>
- Expected outcome: <what success looks like>

**Step 2 — <action>**
...

**Submission template:** see §4.X (or inline if vendor-unique)

**Post-submission:**
- <e.g., move VO to "Submitted" status, log tracking #, etc.>
```

Steps live as **bold paragraphs**, not headings. Today's `### **3.1.1 Step 1 — …**` pattern means inserting/removing a step renumbers every anchor below it. With bold paragraphs, the section number stays stable while step counts can change freely.

**Step-verb controlled vocabulary.** Every Step opens with one of these verbs:

| Verb | Means |
|---|---|
| **Verify** | Read a value and check it against a reference. No write. |
| **Confirm** | Get explicit confirmation from a person or system. May involve a reply. |
| **Create** | Open a new record (VO, PO, draft, ticket). |
| **Update** | Modify an existing record's fields. |
| **Assign** | Attach an order, item, product, warehouse, or shipping method to the correct target. |
| **Attach** | Add a file, PO, quote, BOL, label, or supporting document. |
| **Submit** | Send the order to the vendor (email, portal, EDI). |
| **Request** | Ask the vendor or an internal role for something (a quote, a dimension, an approval). |
| **Escalate** | Route to a named role for sign-off. |
| **Notify** | Send a status or issue update to a customer, vendor, or internal team. |
| **Hold** | Pause processing until a required condition is satisfied. |
| **Cancel** | Stop or void an order, line, request, or draft. |
| **Record** | Write a note, tracking #, or status update back into our system. |
| **Finalize** | Complete the workflow after all checks and submissions are done. |

UI gestures (`Click`, `Open`, `Visit`) are not Step verbs — they belong in the step's detail bullets, not the verb slot. This rule makes workflow steps scannable across vendors while still preserving real operational actions like `Assign Products`, `Attach PO`, and `Notify Customer`.

### 3.4 Glossary (canonical, not per-doc)

Define these once in `_shared_sops/Glossary.md` and link from every doc's §1.4. The full vocabulary source is `docs/naming-convention-audit.md`; the glossary is the operational version that gets linked from SOPs.

| Term | Meaning |
|---|---|
| IH | In-House — ships from DK warehouse |
| DS | Dropship — vendor ships direct to customer |
| VO | Vendor Order — the PO DK sends to the vendor |
| CX | Customer Order — the order DK's customer placed with DK |
| PO | Purchase Order |
| MOV | Minimum Order Value (dollar threshold) |
| MOQ | Minimum Order Quantity (per-line threshold) |
| BOL | Bill of Lading (freight) |
| ETA | Estimated Time of Arrival |
| Lead time | Processing time before dispatch |
| SO | Special Order (custom / made-to-order / quote-required) |
| SKU | DK's internal item identifier |
| Vendor Part # | Vendor/manufacturer item identifier |

Each doc's §1.4 only lists the subset of terms that doc uses — the master is `_shared_sops/Glossary.md`.

### 3.5 Decision Matrix — fixed schema

Every doc has one **routing matrix** with exactly five columns, in this order:

| Column | Contents |
|---|---|
| **Scenario** | Short label for the situation (e.g., "Standard order, in-stock") |
| **Condition** | The boolean test (e.g., "Order ≥ $30 AND in stock") |
| **Action** | The single instruction (e.g., "Process as Dropship") |
| **Workflow** | Pointer to a 3.x sub-section (e.g., "§3.2") |
| **Notes** | Edge cases, approver names by role, exceptions |

No additional columns in the routing matrix. Vendors that today have `Approval Needed?`, `Email Template`, `Stock Verified?`, etc. as separate columns fold those into **Notes**. The Action column always references **a single workflow** in §3 — the matrix doesn't re-state the workflow's logic, it routes to it.

A vendor's matrix should fit on one screen. If you need more than ~15 rows, you're using the matrix to duplicate Section 2 rules — push them back to Section 2 and keep the matrix to genuine corner cases.

Detailed rule tables are still allowed outside the routing matrix. CRL-style warehouse, item-category, rate, length, marketplace, or freight rule tables belong in Section 2 or an appendix, can use their natural columns, and must have a short label such as `Rule Table — Item Categories`. The lint rule is: only the table under `Section 5. Decision Matrix` must use the five-column schema.

### 3.6 Formatting & style rules

**Markdown structure**

- Headings only: `#` for the doc title (once), `##` for sections, `###` for subsections, `####` for sub-subsections. **No bold-paragraph section labels.**
- Em-dash `—` everywhere (not `-` or `–`) for separator dashes.
- Decision markers: only `Required: ✅`, `Do not: ❌`, `Caution: ⚠️`. The text label is mandatory so the meaning is searchable; strip every other emoji.
- Numbers as digits, not bold-wrapped: `2.1.3 Step 3 — Verify cart` not `**2.1.3 Step 3 — Verify cart**`.
- Tables: pipe-style markdown, header row required, no merged cells.
- One blank line between blocks; no double blank lines (catches some docx artifacts).
- Strip all `\>` and `\[` escapes — they were never intended.

**Controlled vocabulary (canonical spellings)**

Pick one spelling and use it everywhere. The lint gate enforces these:

| Concept | Canonical | Reject |
|---|---|---|
| In-house fulfillment | `In-House` (Title Case, hyphenated) | `in-house`, `IN-HOUSE`, `In-house`, `In House` |
| Dropship fulfillment | `Dropship` (one word, capitalised at start of sentence/heading) | `DROPSHIP`, `drop ship`, `drop-ship`, `Drop ship` |
| The DK ops system | `Backoffice` (one word) | `Back Office`, `back-office`, `BackOffice` |
| Vendor Order | `Vendor Order` (PO from DK to vendor) | `vendor order`, `VO order` (use `VO` only when the abbrev. is needed) |
| Customer Order | `Customer Order` (order from DK's customer) | `cx order`, `customer's order` |
| Backorder | `Backorder` | `BO` (reserved for Backoffice only) |
| Minimum order dollar amount | `Minimum Order Value (MOV)` on first use, then `MOV` | `Min Order`, `minimum`, `MOQ` unless quantity-based |
| Vendor/manufacturer item code | `Vendor Part #` | `SKU` when referring to vendor codes |
| Quantity | `Qty` in tables, `quantity` in prose | `count` where quantity is meant |
| Bill of Lading | `Bill of Lading (BOL)` on first use, then `BOL` | bare `BOL` without definition |

**Currency**

- Always use a comma in 4-digit-and-up amounts: `$1,500`, `$2,000` — never `$1500` or `$2000`.
- Trailing `.00` only when fractional cents are meaningful. Default: integer dollars.
- Comparison operators: `≥`, `≤` (Unicode), not `>=`, `<=`.

**MOV vs MOQ**

Use the term that actually applies — they're not interchangeable.

- **MOV (Minimum Order Value)**: a dollar threshold (e.g., "MOV ≥ $150"). Most vendor "minimums" are MOVs.
- **MOQ (Minimum Order Quantity)**: a per-line item count (e.g., "MOQ = 12 units / line"). Use only when the vendor enforces a unit count.

If a vendor enforces both, list both — but never label one with the other's term.

### 3.7 Three tiers

Not every vendor needs the full skeleton. Tier the doc by complexity:

**Tier 1 — Strategic / Complex.** All six sections plus Open Gaps and Changelog required. Tier 1 is assigned by operational complexity, not just file size. Current candidates: CRL, ORS Nasco, Bohle - Portals, Strybuc, Exact Replacement Parts, HD Supply Solutions, MSC Direct, Perfect Score, Hafele, FHC, Deltana, ACE - Emery Jensen Main Warehouse, True Value 04 Main, and Home Depot / US Lock. Confirm final membership before conversion.

**Tier 2 — Standard.** Sections 1, 2, 3, 5 required. Section 4 only if email is the submission channel. Section 6 required (one-line pointer is enough). Open Gaps and Changelog required. Most middle-band vendors.

**Tier 3 — Light / Low Volume.** Single-page doc. Sections 1.1, 1.2, 2.1, 3.x (only the workflows the vendor supports), a 4-row routing matrix, Open Gaps, and Changelog. Roughly the 35 stub docs plus any others with simple, mostly-portal flows.

Tier is recorded in the header table so consumers know upfront how much detail to expect.

---

## 4. Cross-Vendor Rules Library and Roles Registry

The single biggest hidden cost in the current docs is **rules that aren't vendor-specific being copy-pasted into vendor docs**. These need to live in one place and be referenced — not duplicated.

### 4.1 What moves to `_rules/`

Use a root-level `_rules/` folder for cross-vendor operational rules. `_shared_sops/` remains for broader SOPs and the glossary. Each rule file gets a stable rule ID; vendor docs cite the rule ID and file instead of fragile prose or section-number links.

| File | Rule ID prefix | Replaces text currently scattered across | Why it's shared |
|---|---|---|---|
| `_rules/FedEx-Account-and-Shipping.md` | `RULE-FEDEX-*` | FedEx account `632647611` mentions in 21 process docs; "FedEx and BOL must NEVER be mixed" in multiple docs | Same account, same rule — applies to every vendor that uses our FedEx |
| `_rules/Freight-and-BOL.md` | `RULE-FREIGHT-*` | Freight thresholds, BOL approval flow, palletization notes scattered across 10+ docs | Identical procedure regardless of vendor |
| `_rules/Restricted-Regions-HI-AK-PR.md` | `RULE-REGION-*` | HI/AK/PR rules in only a small subset of docs, silently missing from others | Should apply to every vendor that ships there |
| `_rules/Expedited-Approval.md` | `RULE-EXPEDITE-*` | "Expedited needs Elina" text in many docs, "1–2 Business Day" eligibility in 8+ | Approval logic doesn't change per vendor |
| `_rules/Damage-and-Claims.md` | `RULE-CLAIMS-*` | Damage/claim/return text in 73 process docs (wrong file unless pointer-only) | Already partly exists in root `Issue resolution.md` — consolidate here |
| `_shared_sops/Glossary.md` | n/a | Per-doc glossary entries for IH/DS/VO/CX/PO/MOV/MOQ/BOL/ETA/SO | Defined once, used everywhere |

In every vendor doc, references look like: `Apply RULE-FREIGHT-001 (see /_rules/Freight-and-BOL.md).` The vendor doc only contains **the deviations from the shared rule** — e.g., "Vendor X requires shipping under their account, not ours."

### 4.2 Roles registry — replace named individuals with role tokens

Current: `Marina` appears in 30 process docs, `Elina` in 23, plus scattered `Justin`, `Elizabeth` in process flows.

Proposed: one root file `_rules/Roles.md` that maps roles to current people:

```
## Roles

| Role token | Current holder | Owns |
|---|---|---|
| {{PROCUREMENT_APPROVER}} | Marina | Freight / BOL approval, large-item shipping review |
| {{DK_COORDINATOR}}       | Elina  | Expedited approval, vendor-side liaison for Deltana etc. |
| {{DK_PURCHASING_LEAD}}   | Justin | Backup approver, regional confirmations (NYC, LI, CA, Mountain) |
| {{SALES_LIAISON}}        | Elizabeth | Vendor sales contact for selected vendors |
```

Every vendor doc uses the **token**, not the name:

> Before submitting, request shipping review from `{{PROCUREMENT_APPROVER}}`.

When Marina swaps roles, you edit `_rules/Roles.md` once. `{{UPPER_SNAKE}}` is the required syntax because it is unambiguous in Markdown, easy to lint, and compatible with future templating.

### 4.3 What stays in vendor docs

Only vendor-specific facts:

- Vendor-only minimums, lead times, ETA, MOV/MOQ.
- Vendor-only submission portal / email format.
- Vendor-specific exceptions to a shared rule (e.g., "Deltana ships under our account *only* for next-day").
- Workflow steps that genuinely differ from the shared playbook.

Anything that would read identically across two or more vendors belongs in `_rules/`, not in the vendor doc.

---

## 5. Migration plan

A six-stage rollout that minimises risk and keeps Q&A working throughout.

**Stage 0 — Lock the standard.** Add `_templates/process_doc_tier1.md`, `_tier2.md`, `_tier3.md` under the project root. Update `CLAUDE.md` to point at them. Add `_shared_sops/Glossary.md` and `_rules/Roles.md`.

**Stage 1 — Extract cross-vendor rules first.** Before touching any vendor doc, build out the `_rules/` library described in §4.1: FedEx-Account-and-Shipping, Freight-and-BOL, Restricted-Regions-HI-AK-PR, Expedited-Approval, Damage-and-Claims. Doing this first means Stage 2 can *delete* duplicated text rather than rewrite it.

**Stage 2 — Refit Tier 1 exemplars.** Manual conversion of the complex / high-impact set: CRL, ORS Nasco, Bohle - Portals, Strybuc, Exact Replacement Parts, HD Supply Solutions, MSC Direct, Perfect Score, Hafele, FHC, Deltana, plus the large split docs for ACE - Emery Jensen, True Value, and Home Depot / US Lock as applicable. For each doc: (a) set parent/child scope where needed; (b) replace duplicated cross-vendor text with `_rules/` references; (c) rename workflows per the §3 collapse table; (d) reshape Section 5 to the five-column routing matrix while moving rule tables to Section 2 or appendices; (e) replace named approvers with `{{ROLE}}` tokens; (f) add Open Gaps and Changelog. These set the bar — every later doc references them as exemplars. Estimate: half a day per doc with the existing `sop-refresh` skill assisting; CRL may require a full day because it is a rulebook, not just a process doc.

**Stage 3 — Batch-normalize the remaining non-stub docs.** Two-pass on each:
1. **Structural pass** (cheap, scriptable): rename section headings to canonical names, demote bold-paragraph sections to `##` H2, strip docx escapes, replace casing variants (`IN-HOUSE` → `In-House`, `Back Office` → `Backoffice`), normalise currency formatting, swap named gatekeepers for `{{ROLE}}` tokens, add missing Scope / Parent SOP fields.
2. **Content pass** (judgement required): map each existing workflow to the canonical 3.x sub-section, fill missing pre-checks/post-steps, consolidate "Always Avoid" callouts under §2.5, **delete** any text now covered by `_rules/` and replace with a one-line reference.

**Stage 4 — Promote 35 stubs to Tier 3.** The stubs already have the right idea (they're the section skeleton with `_(to be filled)_` markers). Replace the skeleton with the Tier 3 single-page template, populated from `Vendor Info.md`. Anything that still genuinely lacks data stays marked `_(to be filled)_` so the gap is visible.

**Stage 5 — Lint gate.** Add a `process-doc-lint` skill that every doc must pass:
- required sections present, heading levels valid, no escape artifacts;
- header has Tier, Scope, Parent SOP, Owner, and Document version;
- every order type declared in `Vendor Info.md` has a matching `### 3.x` sub-section;
- Section 5 routing matrix has exactly the five canonical columns;
- non-routing rule tables are outside Section 5 and have labels;
- no named individuals appear where `{{ROLE}}` tokens are expected (configurable allowlist for genuine vendor-side names);
- no duplication of FedEx account, BOL/freight rule, HI-AK-PR rule (must be a `_rules/` reference);
- spelling: `In-House`, `Dropship`, `Backoffice` only;
- naming-audit terms enforced (`Backorder` not `BO`, `Minimum Order Value (MOV)`, `Vendor Part #`, `Qty`, etc.);
- currency uses commas at 4-digit threshold;
- all glossary and rule references resolve;
- Open Gaps and Changelog blocks exist.

Failures get listed in a root-level `_lint_report.md` regenerated on demand.

---

## 6. Tooling changes (existing skills)

- **`add-new-vendor`** — accept `--tier`, `--scope`, and `--parent-sop` arguments. Scaffold from `_templates/process_doc_tier<N>.md` instead of the current generic stub, default to Tier 3, and support split warehouse/account child SOPs.
- **`sop-refresh`** — gain a `--normalize` mode that takes any process doc and re-shapes it to canonical without changing the underlying rules. It must preserve detailed rule tables outside Section 5 instead of flattening them into the routing matrix. This is the workhorse for Stage 2.
- **`update-vendor-info`** — when a field that affects fulfillment changes (e.g., dropship rule, MOV, freight threshold), tag the corresponding Section 3.x in the Process Document with `<!-- review: vendor-info changed YYYY-MM-DD -->` so reviewers know to look.
- **`vendor-lookup`** — once Section IDs stabilise, anchor lookups by canonical section number rather than fuzzy matching. Significantly improves answer accuracy.
- **New skill `process-doc-lint`** — see Stage 5.

---

## 7. What to decide before starting

1. **Final Tier 1 membership.** Confirm the expanded complex-doc candidate list in §3.7. Tier 1 should mean operational complexity / business importance, not only file size.
2. **Email Templates as Section 4 vs inline.** Keep templates in Section 4 for email-submission vendors because 19 docs already do this and it keeps templates reusable. If a vendor has exactly one tiny email snippet, the workflow can point to a one-row Section 4.
3. **Child SOP boundaries.** For ACE, Do it best, True Value, and Home Depot / US Lock, decide which file is the parent and which are scoped children before conversion.
4. **Issue Resolution deletion sweep.** Section 6 is pointer-only. `<Vendor> - Issue Resolution Notes.md` stays the source of truth for claims. Process docs should only retain vendor-specific processing exceptions, not full claim handling.
5. **Rule ownership.** Assign an owner for each `_rules/` file so rule IDs do not become orphaned.
6. **Versioning.** Use both inline `(Updated: YYYY-MM-DD)` annotations for local traceability and a 5-row `## Changelog` tail table for reviewer scanability.

---

## 8. What this fixes

- Every doc has the same "shape," so junior staff learn one structure, not 77 non-stub variants.
- Section 3.4 is **always** Freight / BOL, so the Q&A skill can answer "what's the freight rule for X?" by jumping directly to that anchor.
- Cross-vendor rule changes (new FedEx account, new freight threshold, role swap) are made **once** in `_rules/` and propagate to every vendor that references the rule. Today the same change can require editing 40+ docs.
- The lint gate prevents regression: future edits can't drop required sections, reintroduce docx escape artifacts, hard-code an approver's name, or invent a new decision-matrix column.
- Tiering keeps the standard light enough to apply to the long tail of low-volume vendors without forcing everyone into a 12-section CRL-shaped doc.
- Multi-document vendors become explicit parent/child SOPs instead of accidental duplicates.
- CRL-style rulebooks can keep detailed rule tables without breaking the standard routing matrix.
- Open Gaps turns unknowns into owned work instead of hidden `_to be filled_` text.

---

## Appendix A — Evidence summary

Numbers behind the recommendations, updated from the current 112 `*Process Document*.md` files on 2026-05-26. Naming-convention counts are backed by `docs/naming-convention-audit.md` (2026-05-01).

| Finding | Count |
|---|---|
| Vendor folders / process docs total / non-stub docs / stubs | 105 / 112 / 77 / 35 |
| Vendor folders with multiple process docs | 4 |
| Process docs over 10KB | 13 |
| Distinct names for the same `1.1` subsection | 8 |
| Distinct workflow heading-like names ("PROCESSING …") | 113 |
| Non-stub docs that declare zero explicit workflow headings | 15 |
| Distinct table header schemas near decision-matrix areas | 72 |
| Process docs containing docx-conversion artifacts (`\>`, `\[`) | 29 |
| Process docs that reference FedEx (cross-cutting rule) | 40 |
| Process docs containing FedEx account `632647611` | 21 |
| Process docs that mention damage / claim / return / issue-resolution-adjacent text | 73 |
| Process docs that duplicate vendor email addresses already in `Vendor Info.md` | 17 |
| Process docs mentioning "Marina" | 30 |
| Process docs mentioning "Elina" | 23 |
| Casing variants of "In-House" | 4 |
| Casing variants of "Backoffice" | 6 |
| Process docs using ✅ / ❌ / ⚠️ markers | 62 / 112 |
| Process docs that mention MOV | 55 |
| Process docs that mention MOQ | 7 |

---

_Sources surveyed: all 112 `*Process Document*.md` files in `Vendors/`, the per-vendor `Vendor Info.md` rollups, the cross-vendor SOPs in `_shared_sops/`, the root `Issue resolution.md`, `Order processing prompt.md`, and `docs/naming-convention-audit.md`._
