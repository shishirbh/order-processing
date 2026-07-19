# Order Processing & Sales Knowledge Base

Internal source of truth for all vendor order-processing and sales questions at DK Hardware Supply. Designed to be answered against by Claude (Cowork mode) — see [`CLAUDE.md`](./CLAUDE.md) for the routing rules Claude follows.

## Layout

- `CLAUDE.md` — routing guide: read-first instructions, folder map, vendor-name resolution, file-to-question mapping, citation contract.
- `Vendor Information.md` / `Vendor Information.jsonl` — master table across all ~103 vendors.
- `Issue resolution.md` — cross-vendor claims/damage/returns playbook.
- `Order processing prompt.md` — SOP-generation prompt template.
- `Vendors/` — parent folder containing one `<Vendor>/` subfolder per supplier. Each per-vendor folder contains `<Vendor> - Vendor Info.md`, `<Vendor> Process Document.md`, `<Vendor> - Issue Resolution Notes.md`. The per-vendor folder is master; the root master table is a rollup.
- `_shared_sops/` — cross-vendor Sales & Order SOPs (post-order status, vendor-order check, NET 30, core items/fees, quoting, problem orders, chats).
- `plugin/` — the Cowork plugin that turns this knowledge base into callable skills. See [`plugin/README.md`](./plugin/README.md) for install instructions (download `plugin/dist/order-processing.plugin` and drag into Cowork).
- `_skill_evals/` — side-by-side test results for each skill in the plugin. Open the HTML files to see what each skill does with real prompts.

## Source-of-truth rules

1. Per-vendor files are master. `Vendor Information.md`, `Vendor Information.jsonl`, and `INDEX.md` are generated and must never be edited directly.
2. Every vendor change follows one workflow: edit the per-vendor file, run `npm run kb:generate`, inspect the diff, then run `npm run kb:check`.
3. `.md` is canonical. `.docx` / `.xlsx` originals are archive-only and excluded from git (see `.gitignore`).
4. Don't invent data. If a field is blank in the source, say it's blank.

## Adding a new vendor

1. Match the canonical name from `Vendor Information.md` exactly.
2. Replace `/` with ` - ` in folder names (Windows doesn't allow slashes).
3. Create the new vendor folder inside `Vendors/`, then add the three standard files using `Vendors/Deltana/` or `Vendors/IML/` as a template.
4. Add aliases / sub-brands at the top of the Vendor Info file.
5. Run `npm run kb:generate`, inspect the generated rollup/index/completeness diff, then run `npm run kb:check`.
6. Keep `.docx` originals (if any) in `_source_docx/` — don't commit them.

## Install the Cowork plugin (for CS and Sales)

Every teammate should install the `order-processing` plugin so Claude answers vendor questions consistently with these documents as the source of truth.

**Quick install:**
1. Pull the latest version of this repo.
2. Open Claude Cowork.
3. Drag `plugin/dist/order-processing.plugin` into the chat window.
4. Click install in the preview.

That's it. See [`plugin/README.md`](./plugin/README.md) for what each skill does and how to contribute changes.

## Deploy to Railway

This repository deploys as one Node.js service: the same process serves the browser UI, API, knowledge base, and pi agent.

1. Create a Railway service from this repository, or run `railway up` from the repository root.
2. Set these service variables:
   - `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
   - `ADMIN_USERNAME` (defaults to `dk`; used only to bootstrap the first account)
   - `ADMIN_PASSWORD` (use a long, random value)
   - `SESSION_SECRET` (an independent random value of at least 32 bytes)
3. Attach a Railway volume mounted at `/data` and set `DATA_DIR=/data`. Accounts, conversations, feedback, immutable Knowledge Document versions, publishing history, and rollback state all persist there.
4. Generate a Railway domain after the deployment succeeds.

Railway supplies `PORT` automatically. `railway.json` configures Railpack, `npm start`, and the unauthenticated `/health` health check. Employees sign in with individual accounts; Administrators manage accounts in the browser UI. Conversations are isolated by Employee under `DATA_DIR`, and Standard Users receive read-only agent tools.

`APP_USERNAME` and `APP_PASSWORD` remain accepted as legacy aliases for the initial Administrator bootstrap. Do not expose this internal knowledge base publicly without setting `ADMIN_PASSWORD` and `SESSION_SECRET`.

## Status (as of 2026-04-26)

- `Vendors/` contains 105 folders, 103 Vendor Info files, and 103 Issue Resolution files. Ideal Security and Pamex are classified known-incomplete exceptions; 99 Issue Resolution files are stubs that fall back to the root playbook. `reports/vendor-completeness.json` is the generated source for current counts and paths.
- Plugin v0.7.0 ships six production skills: `vendor-lookup`, `add-new-vendor`, `sop-refresh`, `update-vendor-info`, `draft-claim-email`, `regenerate-vendor-rollup`. The development-only `skill-refinement` workflow lives under `dev-skills/` and is excluded from releases.
