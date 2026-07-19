# Order Processing & Sales — Knowledge Base

This folder is the source of truth for all order-processing and sales questions.
Read this file before answering any question from this folder.

---

## 1. Folder layout

```
order_processing/
├── CLAUDE.md                    ← this file (read first)
├── Vendor Information.md        ← master table of all ~103 vendors (contacts, shipping, dropship, lead times)
├── Vendor Information.jsonl     ← same data, one vendor per line, machine-friendly
├── Issue resolution.md          ← cross-vendor issue/claims playbook
├── Order processing prompt.md   ← SOP-generation prompt template
├── general_flow.md              ← non-vendor-specific "General Flow" knowledge.
│                                  Used ONLY when the browser UI sends [Mode: General Flow].
│                                  Otherwise ignore it; the vendor knowledge base is canonical.
│
├── Vendors/                     ← parent folder containing every per-vendor folder
│   └── <Vendor Name>/           ← one folder per vendor (~103 total)
│       ├── <Vendor> - Vendor Info.md
│       ├── <Vendor> - Issue Resolution Notes.md
│       └── <Vendor> Process Document.md
│
├── _shared_sops/                ← cross-vendor Sales & Order SOPs (was "Sales/")
├── _skill_evals/                ← side-by-side eval HTML for each plugin skill
├── plugin/                      ← Cowork plugin source + built .plugin artifact
└── _source_docx/                ← archived .docx / .xlsx originals. DO NOT read these
                                   when a .md version exists; the .md is canonical.
```

All ~103 vendors from `Vendor Information.jsonl` have folders inside `Vendors/`.
4 are hand-curated (`Vendors/Deltana/`, `Vendors/IML/`,
`Vendors/STRUCTURE GLASS SOLUTIONS/`, `Vendors/TopNotch/`); the rest were
auto-scaffolded on 2026-04-24 — their `Vendor Info.md` is populated from the jsonl
row, and their `Process Document.md` / `Issue Resolution Notes.md` are stubs marked
`_(to be filled)_`. When a stub is the only source, fall back to the root
`Vendor Information.md` and `Issue resolution.md`.

Slashed vendor names like `Assa Abloy/Pemco/Rockwood` became folders with slashes
replaced by ` - ` (Windows doesn't allow `/` in folder names):
`Vendors/Assa Abloy - Pemco - Rockwood/`. The original name stays in the file
content and in the `Aliases / sub-brands` section so sub-brand lookups still work.

---

## 2. Source-of-truth rules

- **Per-vendor folder is master.** Each vendor's
  `Vendors/<Vendor>/<Vendor> - Vendor Info.md` is authoritative. The root
  `Vendor Information.md` and `Vendor Information.jsonl` are **generated rollups** —
  they carry a "do not edit by hand" banner and are rebuilt from the per-vendor files
  by the `regenerate-vendor-rollup` skill. Never edit the root files directly; edit
  the per-vendor file and regenerate.
- **`.md` is canonical; `.docx` / `.xlsx` are archives.** Always prefer the `.md` version.
  Only open files in `_source_docx/` if no `.md` equivalent exists.
- **Do not invent data.** If a field is blank in the source, say it's blank — don't guess.

---

## 3. How to answer a question (routing)

### Step 1 — Resolve the vendor

1. Check the user's message for a vendor name.
2. Look it up in **[INDEX.md](INDEX.md)** (case-insensitive) — this maps every
   vendor name, sub-brand alias, and common variant to the correct `Vendors/` folder.
   Matching order: aliases > canonical names > variants.
3. If not found in INDEX.md, try exact match against folder names inside `Vendors/`.
4. Fallback: scan `Vendor Information.md` — the master table contains all ~100+ vendors.
5. **If still ambiguous, do NOT guess.** List the 2–4 most likely candidate folders /
   vendor names and ask the user to confirm.

### Step 2 — Pick the right file for the question

| Question type | Where to look |
|---|---|
| Vendor contact / email / phone | `Vendors/<Vendor>/<Vendor> - Vendor Info.md` → fallback `Vendor Information.md` |
| Can we dropship? Ship under our account? Expedited? | same as above |
| PO submission day / receipt day | same as above |
| "How do I place an order with X?" / process | `Vendors/<Vendor>/<Vendor> Process Document.md` |
| Damage / missing / wrong item / return / claim | `Vendors/<Vendor>/<Vendor> - Issue Resolution Notes.md` → fallback root `Issue resolution.md` |
| Cross-vendor sales / quote / NET 30 / problem-order / chat SOP | `_shared_sops/` |
| Post-order status / vendor-order check | `_shared_sops/SOP for Post Order status inquires and follow ups.md`, `_shared_sops/SOP to check Vendor Order.md` |
| Core items, fees, pricing policy | `_shared_sops/Sales - Core Item & Fees SOP.md` |

### Step 3 — Cite sources

Every answer must end with a **Sources:** section listing the exact files you pulled
from. Use relative paths from this folder, e.g.:

```
Sources:
- Vendors/Deltana/Deltana - Vendor Info.md
- Vendor Information.md (row: Deltana)
```

Cite the master table with the specific row name when you used the rollup.

---

## 4. Output contract

- Lead with the direct answer. Keep it short.
- Quote values verbatim from the source where the exact wording matters
  (email addresses, phone numbers, day-of-week rules, dollar amounts).
- If the source is blank or says "in progress" / "in process", say so explicitly;
  do not fill in a plausible-sounding value.
- If the question spans multiple vendors, answer per-vendor with a clear header
  for each, and cite each vendor's source file.
- Always include the `Sources:` section.

---

## 5. Known gaps (validated by `npm run kb:check`)

- `Vendors/` contains 105 folders, 103 Vendor Info files, and 103 vendor-specific Issue Resolution files. Ideal Security and Pamex are explicitly classified as `known_incomplete` in `config/vendor-exceptions.json`; each currently has only process documentation.
- 99 vendor-specific Issue Resolution files are stubs marked `_(to be filled)_`. For those vendors, route claims questions to the root `Issue resolution.md`. See `reports/vendor-completeness.json` for the complete generated list.
- `orignal files/` is a leftover from the pre-cleanup layout. Excel held a lock
  on `Vendor Information.xlsx` so the folder could not be fully removed. Ignore
  it; the canonical archive is `_source_docx/`.
- `INDEX.md` now exists (added 2026-05-12). It maps every vendor name, sub-brand alias,
  and name variant to its `Vendors/` folder. Use it as the primary lookup in Step 1.
  If a lookup isn't covered, fall back to scanning `Vendor Information.md` and vendor
  `Vendor Info.md` files.

---

## 6. When the user asks to update knowledge

- Edit the per-vendor `.md` file (it's master), never a generated rollup or index.
- Regenerate `Vendor Information.md`, `Vendor Information.jsonl`, `INDEX.md`, and the completeness report with `npm run kb:generate`.
- Inspect the generated diff, then validate it with `npm run kb:check`.
- In the hosted application, use `knowledge_publish`; it versions the source document and regenerates these artifacts atomically in persistent storage.
- Never edit files in `_source_docx/`.
