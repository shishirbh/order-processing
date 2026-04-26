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
2. Try exact match against folders inside `Vendors/` (case-insensitive).
3. If no folder match, scan `Vendor Information.md` — the master table contains all
   ~103 vendor names, including combined/slashed names like
   `Assa Abloy/Pemco/Rockwood`, `ACE / Emery Jensen`, `Home Depot/US lock/HD Supply`.
4. If the query uses a sub-brand (e.g. "Pemco", "Rockwood", "US lock", "HD Supply",
   "Emery Jensen"), match it to its parent row in the master table.
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

## 5. Known gaps (as of 2026-04-26)

- Folders exist for all ~103 vendors inside `Vendors/`, but most Process Documents
  and Issue Resolution Notes are stubs marked `_(to be filled)_`. For those vendors,
  routing shipping/contact questions to the per-folder `Vendor Info.md` is
  reliable; process and claims questions should fall back to `_shared_sops/`
  and the root `Issue resolution.md`.
- `orignal files/` is a leftover from the pre-cleanup layout. Excel held a lock
  on `Vendor Information.xlsx` so the folder could not be fully removed. Ignore
  it; the canonical archive is `_source_docx/`.
- No `INDEX.md` or alias table yet. Use the master `Vendor Information.md` and
  the `Aliases / sub-brands` section of each vendor's `Vendor Info.md` for
  sub-brand → parent lookups (e.g. "Pemco" → `Vendors/Assa Abloy - Pemco - Rockwood/`).

---

## 6. When the user asks to update knowledge

- Edit the per-vendor `.md` file (it's master), not the root rollup.
- If the change affects a field that also appears in `Vendor Information.md`,
  update both and flag that the rollup should be regenerated.
- Never edit files in `_source_docx/`.
