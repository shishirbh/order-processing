# Order Processing & Sales Knowledge Base

Internal source of truth for all vendor order-processing and sales questions at DK Hardware Supply. Designed to be answered against by Claude (Cowork mode) — see [`CLAUDE.md`](./CLAUDE.md) for the routing rules Claude follows.

## Layout

- `CLAUDE.md` — routing guide: read-first instructions, folder map, vendor-name resolution, file-to-question mapping, citation contract.
- `Vendor Information.md` / `Vendor Information.jsonl` — master table across all ~103 vendors.
- `Issue resolution.md` — cross-vendor claims/damage/returns playbook.
- `Order processing prompt.md` — SOP-generation prompt template.
- `<Vendor>/` — per-vendor folder. Each contains `<Vendor> - Vendor Info.md`, `<Vendor> Process Document.md`, `<Vendor> - Issue Resolution Notes.md`. The per-vendor folder is master; the root master table is a rollup.
- `_shared_sops/` — cross-vendor Sales & Order SOPs (post-order status, vendor-order check, NET 30, core items/fees, quoting, problem orders, chats).

## Source-of-truth rules

1. Per-vendor folder is master. The root `Vendor Information.md` may be out of date.
2. `.md` is canonical. `.docx` / `.xlsx` originals are archive-only and excluded from git (see `.gitignore`).
3. Don't invent data. If a field is blank in the source, say it's blank.

## Adding a new vendor

1. Match the canonical name from `Vendor Information.md` exactly.
2. Replace `/` with ` - ` in folder names (Windows doesn't allow slashes).
3. Create the three standard files using `Deltana/` or `IML/` as a template.
4. Add aliases / sub-brands at the top of the Vendor Info file.
5. Update the root master table and jsonl.
6. Keep `.docx` originals (if any) in `_source_docx/` — don't commit them.

## Status (as of 2026-04-24)

- 103 vendor folders exist. 4 are hand-curated (`Deltana`, `IML`, `STRUCTURE GLASS SOLUTIONS`, `TopNotch`); 99 were auto-scaffolded from the jsonl — their Vendor Info is populated, but Process Document and Issue Resolution Notes are stubs marked `_(to be filled)_`.
