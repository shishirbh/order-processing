# Order Processing & Sales Knowledge Base

Internal source of truth for all vendor order-processing and sales questions at DK Hardware Supply. Designed to be answered against by Claude (Cowork mode) — see [`CLAUDE.md`](./CLAUDE.md) for the routing rules Claude follows.

## Layout

- `CLAUDE.md` — routing guide: read-first instructions, folder map, vendor-name resolution, file-to-question mapping, citation contract.
- `Vendor Information.md` / `Vendor Information.jsonl` — master table across all ~103 vendors.
- `Issue resolution.md` — cross-vendor claims/damage/returns playbook.
- `Order processing prompt.md` — SOP-generation prompt template.
- `<Vendor>/` — per-vendor folder. Each contains `<Vendor> - Vendor Info.md`, `<Vendor> Process Document.md`, `<Vendor> - Issue Resolution Notes.md`. The per-vendor folder is master; the root master table is a rollup.
- `_shared_sops/` — cross-vendor Sales & Order SOPs (post-order status, vendor-order check, NET 30, core items/fees, quoting, problem orders, chats).
- `plugin/` — the Cowork plugin that turns this knowledge base into callable skills. See [`plugin/README.md`](./plugin/README.md) for install instructions (download `plugin/dist/order-processing.plugin` and drag into Cowork).
- `_skill_evals/` — side-by-side test results for each skill in the plugin. Open the HTML files to see what each skill does with real prompts.

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

## Install the Cowork plugin (for CS and Sales)

Every teammate should install the `order-processing` plugin so Claude answers vendor questions consistently with these documents as the source of truth.

**Quick install:**
1. Pull the latest version of this repo.
2. Open Claude Cowork.
3. Drag `plugin/dist/order-processing.plugin` into the chat window.
4. Click install in the preview.

That's it. See [`plugin/README.md`](./plugin/README.md) for what each skill does and how to contribute changes.

## Status (as of 2026-04-24)

- 103 vendor folders exist. 4 are hand-curated (`Deltana`, `IML`, `STRUCTURE GLASS SOLUTIONS`, `TopNotch`); 99 were auto-scaffolded from the jsonl — their Vendor Info is populated, but Process Document and Issue Resolution Notes are stubs marked `_(to be filled)_`.
- Plugin v0.3.0 shipped with six skills: `vendor-lookup`, `add-new-vendor`, `sop-refresh`, `update-vendor-info`, `draft-claim-email`, `regenerate-vendor-rollup`. Evaluated against real DK prompts — see `_skill_evals/` for details.
