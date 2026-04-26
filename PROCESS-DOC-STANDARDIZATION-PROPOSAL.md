# Process Document Standardization Proposal
_Last updated: 2026-04-26 (rev 2 — deeper sweep) — author: Shishir's Cowork session_

This proposal is based on a structural and content sweep of every `Vendors/<Vendor>/<Vendor> Process Document.md` file in this knowledge base (105 vendor folders; 68 docs with real content, 35 still stubs, 9 large docs with 10KB+).

Rev 2 adds: cross-vendor rule duplication evidence, workflow-name collapse mapping (69 → 6), step-verb controlled vocabulary, decision-matrix column lock-down, named-person-as-gatekeeper findings, and a markdown style guide. Original structure preserved; only added where evidence changed a recommendation.

---

## 1. What's actually inconsistent today

The docs roughly share a skeleton (`SECTION 1 OVERVIEW → SECTION 2 EMAIL TEMPLATES (sometimes) → SECTION 3 PROCESSING → SECTION 4 DECISION MATRIX`), but the variations make them painful to consume — by humans and by the lookup skills.

**Section structure drift**

| Section 2 heading | Count |
|---|---|
| `SECTION 2 — PROCESSING ORDERS` | 41 |
| `SECTION 2 — EMAIL TEMPLATES` | 19 |
| `SECTION 2 — DECISION MATRIX` | 4 |
| `SECTION 2 — DROPSHIP EMAIL TEMPLATES` | 2 |
| `SECTION 2 — EMAIL TEMPLATES STANDARDS AND RESTRICTIONS` | 1 |
| `SECTION 2 - ITEM CATEGORIES AND SHIPPING METHODS` (CRL) | 1 |

So "Processing" can be section 2 _or_ section 3 depending on whether the vendor has a dedicated Email Templates block. CRL is its own beast with 12 custom sections.

**First-subsection drift (the 1.1 of every doc)**

| 1.1 heading | Count |
|---|---|
| `1.1 Vendor Rules` | 25 |
| `1.1 Vendor Overview` | 22 |
| `1.1 Key Rules & Notes` | 12 |
| `1.1 MANDATORY FIRST STEP - Orders Classification` | 5 |
| `1.1 General Rules` | 2 |
| `1.1 Warehouse Locations` | 1 |

These are all the same idea written six different ways.

**Order-type taxonomy drift**

The same workflow is named multiple ways across docs:

- `PROCESSING A VENDOR ORDER — IN-HOUSE` (12) vs `PROCESSING VENDOR ORDER — IN-HOUSE` (4) — article inconsistency
- `PROCESSING A CUSTOMER ORDER — STANDARD DROPSHIP` vs `PROCESSING CUSTOMER ORDER — DROPSHIP`
- `PROCESSING A VENDOR and CUSTOMER ORDER — IN-HOUSE` — combined when other docs split them
- "Vendor Order" and "Customer Order" are sometimes used as synonyms, sometimes as distinct concepts (PO-to-vendor vs the originating customer order)

**69 unique workflow names is too many.** I extracted every `# **N.M PROCESSING …**` heading across the 68 real docs and got **69 distinct names**. The top six account for the majority of usage; the remaining ~50 are minor variants (article placement, "Standard Dropship" vs "Dropship", account-number suffixes, hyphen vs em-dash). They map cleanly to six canonical workflows — see §3.7 for the full collapse table.

Compounding this: **24 of the 68 non-stub docs declare zero explicit workflows.** They have content under a generic `SECTION 2 — PROCESSING ORDERS` header but never name an in-house vs dropship vs freight branch. So a reader can't tell which rules apply to which fulfillment type without inferring from prose.

**Title format drift**

`VENDOR - HAFELE AMERICA CO.`, `VENDOR - ATF` (abbreviation only), `VENDOR - DOOR CONTROLS USA (DCU)`, `VENDOR - FWP Customer Orders` (workflow leaked into title), `VENDOR - D\&D TECHNOLOGIES` (escape artifact), and so on.

**Decision Matrix is uneven**

Some docs (Hafele, Strybuc, FHC, ORS Nasco, Bohle) have proper markdown tables. Others have only the header with the table missing or rendered as bullet lists. CRL has 231 table rows; Glass Warehouse has 22.

Worse: **no two decision-matrix tables share the same column schema.** I counted 18 distinct header rows across the docs that do have tables. Some examples:

- `Scenario | Condition | Action | Notes`
- `Scenario | Order Type | Item Type | Stock | Action`
- `Scenario | Item Length | Shipping Speed | In Stock | Order Type | MOV Required | Ship To | FedEx Note`
- `Scenario | Addons? | Classification | Inline Comments | Email Addon List | Dropship | OA + Tracking Required | Action`

Same intent, different schemas. A reader (or a Q&A skill) can't reliably extract "what action does vendor X take when condition Y is met?" because column Y might not exist in vendor X's matrix at all. §3.5 below pins this down to a fixed five-column shape.

**Heading hierarchy is messy**

Section labels are written as bold paragraphs (`**SECTION 1 — OVERVIEW**`) rather than real H2 headings, while sub-points use `###` H3, `####` H4, sometimes `##` H2. That breaks markdown TOC tooling and makes programmatic linting hard.

**Step numbering is inconsistent**

- Deltana / AM Auto / Strybuc: `### **3.1.1 Step 1 — Verify & Move Order to Submit**` (4-level number + step label)
- ORS Nasco: `### **2.2.6 Step 6** — **Assign Products (Dropship)**` (split bold runs)
- Hafele: skips early steps and starts at `2.3.6 Step 6` (renumbering broke after edit)
- FHC: no numbered steps at all in Section 2

**Conversion artifacts**

29 of the 68 real process docs still contain `\>` and `\[` escapes from the original docx → md conversion. Several have `"Tables of Content:"` duplicated.

**Vocabulary**

`MOV`, `MOQ`, `BOL`, `ETA`, `VO`, `CX`, `PO`, `IH`, `DS`, `DCU` are used widely but defined in only a handful of docs (Strybuc, CRL, ORS Nasco). New staff have to infer.

**Emoji conventions**

55 docs use ✅ ❌ ⚠️ as decision markers; 13 don't. When they do appear, the meaning is consistent (good) — that's a pattern worth promoting.

**Cross-vendor rule duplication (this is the biggest hidden cost)**

Cross-cutting rules — ones that have nothing to do with any specific vendor — are copy-pasted into the vendor docs verbatim. Examples found verbatim in multiple docs:

- `FedEx and BOL instructions must NEVER be mixed` — present in Taymor, Perfect Score, EPCO, Contacta, and several more (36 of 68 docs reference FedEx in a vendor-agnostic way).
- `❌ Mixing FedEx + BOL instructions` — same paragraph, different docs.
- HI/AK/PR shipping rules — appear in only 7 docs but the rule itself is global; the other vendors that allow shipping there have the rule silently missing.
- The DK FedEx account number `632647611` appears in 8 different formattings (`Account 632647611`, `Account #632647611`, `account No : 632647611`, etc.). One number, eight presentations.
- 17 process docs duplicate vendor email addresses that already live in `<Vendor> - Vendor Info.md` (which is itself a rollup of `Vendor Information.md`).
- 65 of 68 docs mention damage / claim / return language — but per `CLAUDE.md`, claims belong in `<Vendor> - Issue Resolution Notes.md` and the root `Issue resolution.md`. That's the wrong file for that content.

When a global rule changes (e.g., a new FedEx account, a new freight threshold), it has to be edited in dozens of vendor docs. That's how rules drift out of sync. §4 below proposes a Cross-Vendor Rules Library that fixes this at the root.

**Named individuals as approval gatekeepers**

Marina is named **23 times**, Elina **19 times** across the process docs — typically as the approver for freight, BOL, expedited, or unusual-region orders. Examples from real text:

- `Request shipping review from Marina`
- `Send Info to Marina`
- `Yes (Elina)` (in a decision matrix Approval column)
- `❌ Sending expedited orders without Elina's approval`
- `Confirm with Marina/Justin`

Two problems: (1) when Marina or Elina change role, every doc has to be edited; (2) the docs imply only one person can approve, which makes the process brittle. The fix is to use **role tokens** (`<PROCUREMENT_APPROVER>`, `<DK_COORDINATOR>`) and keep the name-to-role mapping in one place. See §4.

**Casing and spelling chaos for the most-used terms**

These three terms appear in nearly every doc and are spelled four different ways each:

| Term | Variants observed | Counts |
|---|---|---|
| In-House | `In-House`, `in-house`, `IN-HOUSE`, `In-house` | 53, 39, 38, 17 |
| Dropship | `Dropship`, `dropship`, `DROPSHIP`, `drop-ship` | 68, 64, 46, 1 |
| Backoffice | `Backoffice`, `Back Office`, `back office`, `Back office`, `BackOffice`, `back-office` | 35, 20, 2, 2, 1, 1 |

**Currency and threshold formatting**

`$2,000` (46×) vs `$2000` (3×); `$1,500` (19×) vs `$1500` (2×); some thresholds carry trailing zeros (`$20.00`, `$50.00`, `$0.00`), others don't. Thirteen distinct dollar-format variants for what should be a fixed numeric style.

**MOV vs MOQ are conflated**

`MOV` (Minimum Order Value, dollar threshold) appears in 38 docs. `MOQ` (Minimum Order Quantity, per-line item count) appears in only 7. In several docs the terms are used interchangeably for the same concept, which is wrong — they're different gates that produce different decisions. Worth making this distinction explicit in the glossary and using each term only where it actually applies.

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
| Document version | YYYY-MM-DD |
| Owner | <name / team> |
| Source-of-truth contact | See Vendor Info.md |
```

The header replaces the current `# **VENDOR - X**` titles and the embedded "Tables of Content" / "Figures" blocks (which are docx leftovers and add no value in markdown).

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
```

A vendor that doesn't support a workflow simply omits its 3.x sub-section — but the section numbers stay the same. Section 3.4 is **always** "Freight / BOL", whether the vendor has it or not.

**Workflow-name collapse: 69 → 6.** Every existing workflow heading in the corpus maps to one of the six canonical 3.x slots:

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
- ✅ <required precondition>
- ❌ <hard disqualifier>

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

**Step-verb controlled vocabulary.** Every Step opens with one of these verbs — no others:

| Verb | Means |
|---|---|
| **Verify** | Read a value and check it against a reference. No write. |
| **Confirm** | Get explicit confirmation from a person or system. May involve a reply. |
| **Create** | Open a new record (VO, PO, draft, ticket). |
| **Update** | Modify an existing record's fields. |
| **Submit** | Send the order to the vendor (email, portal, EDI). |
| **Request** | Ask the vendor or an internal role for something (a quote, a dimension, an approval). |
| **Escalate** | Route to a named role for sign-off. |
| **Record** | Write a note, tracking #, or status update back into our system. |

UI gestures (`Click`, `Open`, `Visit`) are not Step verbs — they belong in the step's detail bullets, not the verb slot. This rule alone makes workflow steps scannable across vendors: the reader sees `Verify → Confirm → Create → Submit → Record` and knows the shape before reading the details.

### 3.4 Glossary (canonical, not per-doc)

Define these once in `_shared_sops/Glossary.md` and link from every doc's §1.4:

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
| SO | Special Order (custom / made-to-order / quote-required) |

Each doc's §1.4 only lists the subset of terms that doc uses — the master is `_shared_sops/Glossary.md`.

### 3.5 Decision Matrix — fixed schema

One table per doc, exactly five columns, in this order:

| Column | Contents |
|---|---|
| **Scenario** | Short label for the situation (e.g., "Standard order, in-stock") |
| **Condition** | The boolean test (e.g., "Order ≥ $30 AND in stock") |
| **Action** | The single instruction (e.g., "Process as Dropship") |
| **Workflow** | Pointer to a 3.x sub-section (e.g., "§3.2") |
| **Notes** | Edge cases, approver names by role, exceptions |

No additional columns. Vendors that today have `Approval Needed?`, `Email Template`, `Stock Verified?`, etc. as separate columns fold those into **Notes**. The Action column always references **a single workflow** in §3 — the matrix doesn't re-state the workflow's logic, it routes to it.

A vendor's matrix should fit on one screen. If you need more than ~15 rows, you're using the matrix to duplicate Section 2 rules — push them back to Section 2 and keep the matrix to genuine corner cases.

### 3.6 Formatting & style rules

**Markdown structure**

- Headings only: `#` for the doc title (once), `##` for sections, `###` for subsections, `####` for sub-subsections. **No bold-paragraph section labels.**
- Em-dash `—` everywhere (not `-` or `–`) for separator dashes.
- Decision markers: only `✅` (required do), `❌` (must-not-do), `⚠️` (caution). Strip every other emoji.
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

**Tier 1 — Strategic / High-Volume.** All six sections required. ~10 vendors today: CRL, Hafele, Strybuc, Deltana, FHC, ORS Nasco, MSC Direct, Bohle, HD Supply Solutions, Perfect Score.

**Tier 2 — Standard.** Sections 1, 2, 3, 5 required. Section 4 only if email is the submission channel. Section 6 required (one-line pointer is enough). Most ~50-vendor middle band.

**Tier 3 — Light / Low Volume.** Single-page doc. Sections 1.1, 1.2, 2.1, 3.x (only the workflows the vendor supports), and a 4-row Decision Matrix. Roughly the 35 stub vendors plus any others with simple, mostly-portal flows.

Tier is recorded in the header table so consumers know upfront how much detail to expect.

---

## 4. Cross-Vendor Rules Library and Roles Registry

The single biggest hidden cost in the current docs is **rules that aren't vendor-specific being copy-pasted into vendor docs**. These need to live in one place and be referenced — not duplicated.

### 4.1 What moves to `_shared_sops/` (or a new `_rules/` folder)

Each of these is a single-purpose document that vendor docs link to instead of restating:

| File | Replaces text currently scattered across | Why it's shared |
|---|---|---|
| `_rules/FedEx-Account-and-Shipping.md` | FedEx account `632647611` mentions in 36 docs (8 different formattings); "FedEx and BOL must NEVER be mixed" verbatim in 4+ docs | Same account, same rule — applies to every vendor that uses our FedEx |
| `_rules/Freight-and-BOL.md` | Freight thresholds, BOL approval flow, palletization notes scattered across 10+ docs | Identical procedure regardless of vendor |
| `_rules/Restricted-Regions-HI-AK-PR.md` | HI/AK/PR rules in 7 docs (and silently missing from the rest) | Should apply to every vendor that ships there |
| `_rules/Expedited-Approval.md` | "Expedited needs Elina" text in 19 docs, "1–2 Business Day" eligibility in 8+ | Approval logic doesn't change per vendor |
| `_rules/Damage-and-Claims.md` | Damage/claim/return text in 65 of 68 process docs (wrong file per CLAUDE.md) | Already partly exists in root `Issue resolution.md` — consolidate here |
| `_shared_sops/Glossary.md` | Per-doc glossary entries for IH/DS/VO/CX/PO/MOV/MOQ/BOL/ETA/SO | Defined once, used everywhere |

In every vendor doc, references look like: `→ Apply Freight rule (see /_rules/Freight-and-BOL.md §2)`. The vendor doc only contains **the deviations from the shared rule** — e.g., "Vendor X requires shipping under their account, not ours."

### 4.2 Roles registry — replace named individuals with role tokens

Current: 23 mentions of `Marina`, 19 of `Elina`, plus scattered `Justin`, `Elizabeth` in process flows.

Proposed: one root file `_rules/Roles.md` that maps roles to current people:

```
## Roles

| Role token | Current holder | Owns |
|---|---|---|
| <PROCUREMENT_APPROVER> | Marina | Freight / BOL approval, large-item shipping review |
| <DK_COORDINATOR>       | Elina  | Expedited approval, vendor-side liaison for Deltana etc. |
| <DK_PURCHASING_LEAD>   | Justin | Backup approver, regional confirmations (NYC, LI, CA, Mountain) |
| <SALES_LIAISON>        | Elizabeth | Vendor sales contact for selected vendors |
```

Every vendor doc uses the **token**, not the name:

> Before submitting, request shipping review from `<PROCUREMENT_APPROVER>`.

When Marina swaps roles, you edit `_rules/Roles.md` once. Today you'd have to grep 23+ docs.

### 4.3 What stays in vendor docs

Only vendor-specific facts:

- Vendor-only minimums, lead times, ETA, MOV/MOQ.
- Vendor-only submission portal / email format.
- Vendor-specific exceptions to a shared rule (e.g., "Deltana ships under our account *only* for next-day").
- Workflow steps that genuinely differ from the shared playbook.

Anything that would read identically across two or more vendors belongs in `_rules/`, not in the vendor doc.

---

## 5. Migration plan

A five-stage rollout that minimises risk and keeps Q&A working throughout.

**Stage 0 — Lock the standard.** Add `_templates/process_doc_tier1.md`, `_tier2.md`, `_tier3.md` under the project root. Update `CLAUDE.md` to point at them. Add `_shared_sops/Glossary.md` and `_rules/Roles.md`.

**Stage 1 — Extract cross-vendor rules first.** Before touching any vendor doc, build out the `_rules/` library described in §4.1: FedEx-Account-and-Shipping, Freight-and-BOL, Restricted-Regions-HI-AK-PR, Expedited-Approval, Damage-and-Claims. Doing this first means Stage 2 can *delete* duplicated text rather than rewrite it.

**Stage 2 — Refit the 9 large docs.** Manual conversion of CRL, ORS Nasco, Bohle, Perfect Score, Hafele, Strybuc, HD Supply Solutions, Exact Replacement Parts, MSC Direct to Tier 1 shape. For each doc: (a) replace duplicated cross-vendor text with `_rules/` references; (b) rename workflows per the §3 collapse table; (c) reshape decision matrix to the five-column schema; (d) replace named approvers with role tokens. These nine set the bar — every later doc references them as exemplars. Estimate: half a day per doc with the existing `sop-refresh` skill assisting.

**Stage 3 — Batch-normalize the 42 medium docs.** Two-pass on each:
1. **Structural pass** (cheap, scriptable): rename section headings to canonical names, demote bold-paragraph sections to `##` H2, strip docx escapes, replace casing variants (`IN-HOUSE` → `In-House`, `Back Office` → `Backoffice`), normalise currency formatting, swap named gatekeepers for role tokens.
2. **Content pass** (judgement required): map each existing workflow to the canonical 3.x sub-section, fill missing pre-checks/post-steps, consolidate "Always Avoid" callouts under §2.5, **delete** any text now covered by `_rules/` and replace with a one-line reference.

**Stage 4 — Promote 35 stubs to Tier 3.** The stubs already have the right idea (they're the section skeleton with `_(to be filled)_` markers). Replace the skeleton with the Tier 3 single-page template, populated from `Vendor Info.md`. Anything that still genuinely lacks data stays marked `_(to be filled)_` so the gap is visible.

**Stage 5 — Lint gate.** Add a `process-doc-lint` skill that every doc must pass:
- required sections present, heading levels valid, no escape artifacts;
- every order type declared in `Vendor Info.md` has a matching `### 3.x` sub-section;
- decision matrix has exactly the five canonical columns;
- no named individuals appear where role tokens are expected (configurable allowlist for genuine vendor-side names);
- no duplication of FedEx account, BOL/freight rule, HI-AK-PR rule (must be a `_rules/` reference);
- spelling: `In-House`, `Dropship`, `Backoffice` only;
- currency uses commas at 4-digit threshold;
- all glossary references resolve.

Failures get listed in a root-level `_lint_report.md` regenerated on demand.

---

## 6. Tooling changes (existing skills)

- **`add-new-vendor`** — accept a `--tier` argument and scaffold from `_templates/process_doc_tier<N>.md` instead of the current generic stub. Default to Tier 3.
- **`sop-refresh`** — gain a `--normalize` mode that takes any process doc and re-shapes it to canonical without changing the underlying rules. This is the workhorse for Stage 2.
- **`update-vendor-info`** — when a field that affects fulfillment changes (e.g., dropship rule, MOV, freight threshold), tag the corresponding Section 3.x in the Process Document with `<!-- review: vendor-info changed YYYY-MM-DD -->` so reviewers know to look.
- **`vendor-lookup`** — once Section IDs stabilise, anchor lookups by canonical section number rather than fuzzy matching. Significantly improves answer accuracy.
- **New skill `process-doc-lint`** — see Stage 5.

---

## 7. What to decide before starting

1. **Tier assignments.** Confirm the proposed Tier 1 list of ~10 vendors. Anything to add or remove?
2. **Email Templates as Section 4 vs inline.** I've put templates in their own section because 19 docs already do this and it's easier to keep templates DRY. Alternative: keep templates inline inside each Workflow sub-section. Pick one and commit.
3. **Decision Matrix scope.** Should it duplicate the rules from Section 2 (current style) or only cover edge cases / corner conditions? I'd recommend the latter — it shrinks the matrix and stops the Section 2 ↔ Matrix drift problem. The fixed five-column schema in §3.5 enforces that scope.
4. **Issue Resolution duplication.** Confirm that Section 6 will be a pointer only — the `<Vendor> - Issue Resolution Notes.md` stays the source of truth for claims. (This matches the current CLAUDE.md routing rules.) 65 of 68 process docs currently leak claim text into the wrong file — this needs a deletion sweep.
5. **Cross-vendor rules library location.** New `_rules/` folder at the project root, or keep adding to `_shared_sops/`? I'd vote for `_rules/` because the existing `_shared_sops/` is sales-shaped (quote SOPs, post-order status SOPs) and the rule library is a different concept — but happy either way as long as the location is canonical.
6. **Role tokens as `<UPPER_SNAKE>` or `{role.token}` style.** Picking a syntax matters because the lint regex depends on it. `<UPPER_SNAKE>` is my default; `{{ROLE}}` (Mustache-style) is the alternative if we ever templatize.
7. **Versioning.** Add a single `## Changelog` table at the bottom of each doc, or stick with the existing `(Updated: YYYY-MM-DD)` inline annotations from the SOP-refresh prompt? My recommendation: both — inline annotations for traceability, plus a 5-row tail changelog so reviewers can see the doc's history at a glance.

---

## 8. What this fixes

- Every doc has the same "shape," so junior staff learn one structure, not 68.
- Section 3.4 is **always** Freight / BOL, so the Q&A skill can answer "what's the freight rule for X?" by jumping directly to that anchor.
- Cross-vendor rule changes (new FedEx account, new freight threshold, role swap) are made **once** in `_rules/` and propagate to every vendor that references the rule. Today the same change requires editing 36+ docs.
- The lint gate prevents regression: future edits can't drop required sections, reintroduce docx escape artifacts, hard-code an approver's name, or invent a new decision-matrix column.
- Tiering keeps the standard light enough to apply to the long tail of low-volume vendors without forcing everyone into a 12-section CRL-shaped doc.

---

## Appendix A — Evidence summary

Numbers behind the recommendations, all derived from a sweep of the 68 non-stub `Vendors/<Vendor>/<Vendor> Process Document.md` files on 2026-04-26.

| Finding | Count |
|---|---|
| Process docs total / non-stub / stubs | 105 / 68 / 35 |
| Distinct names for the same `1.1` subsection | 6 |
| Distinct workflow heading names ("PROCESSING …") | 69 |
| Non-stub docs that declare zero explicit workflows | 24 |
| Distinct decision-matrix column schemas | 18 |
| Process docs containing docx-conversion artifacts (`\>`, `\[`) | 29 |
| Process docs that reference FedEx (cross-cutting rule) | 36 |
| Distinct formattings of the FedEx account number | 8 |
| Process docs that mention damage / claim / return text | 65 |
| Process docs that duplicate vendor email addresses already in `Vendor Info.md` | 17 |
| Mentions of "Marina" as approver | 23 |
| Mentions of "Elina" as approver | 19 |
| Casing variants of "In-House" | 4 |
| Casing variants of "Backoffice" | 6 |
| Process docs using ✅ / ❌ / ⚠️ markers | 55 / 68 |
| Process docs that mention MOV | 38 |
| Process docs that mention MOQ | 7 |

---

_Sources surveyed: all 68 non-stub `Vendors/<Vendor>/<Vendor> Process Document.md` files, plus the per-vendor `Vendor Info.md` rollup at `Vendor Information.md`, the cross-vendor SOPs in `_shared_sops/`, the root `Issue resolution.md`, and the existing `Order processing prompt.md`._
