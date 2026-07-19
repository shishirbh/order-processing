---
name: regenerate-vendor-rollup
description: Rebuilds and validates Vendor Information.md, Vendor Information.jsonl, INDEX.md, and the vendor completeness report from per-vendor source files. Use after vendor changes or when asked to regenerate, check, rebuild, refresh, or sync generated vendor artifacts.
---

# regenerate-vendor-rollup

Use the repository's deterministic generator. Do not reproduce parsing or rendering logic inside the agent, and never edit generated artifacts by hand.

## Source-of-truth workflow

Every vendor-information change follows exactly this sequence:

1. Edit the applicable `Vendors/<Vendor>/<Vendor> - Vendor Info.md` source.
2. Run `npm run kb:generate`.
3. Review the generated diff for `Vendor Information.md`, `Vendor Information.jsonl`, `INDEX.md`, and `reports/vendor-completeness.json`.
4. Run `npm run kb:check`; do not call the workflow complete unless it passes.

In the hosted application, use `knowledge_publish` for the source document instead. It creates an immutable version and performs generation and validation atomically in persistent storage. Generated documents cannot be published directly.

## Commands

From the repository root:

```bash
npm run kb:generate
npm run kb:check
```

`kb:generate` provides deterministic ordering, normalized values, atomic writes, index generation, and anomaly classification. `kb:check` performs a dry generation and fails when committed artifacts differ or an unclassified required-file gap exists.

## Reporting

Report:

- vendor folder, Vendor Info, Issue Resolution, and stub counts;
- generated files changed by the diff;
- known exceptions and any unexpected anomalies;
- whether `npm run kb:check` passed.

If a removed vendor or unexpected missing file appears, stop and ask the user to resolve or explicitly classify it in `config/vendor-exceptions.json`. Do not silently omit it.

## Rules

- Per-vendor files are canonical.
- `Vendor Information.md`, `Vendor Information.jsonl`, `INDEX.md`, and `reports/vendor-completeness.json` are generated.
- Never use the obsolete rollup scripts; they were replaced by `scripts/vendor-kb.mjs`.
- Never include volatile timestamps in generated output.
- Never claim synchronization until the generated diff has been reviewed and `kb:check` passes.
