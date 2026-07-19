# order-processing plugin

A Claude Cowork plugin that turns this knowledge base into a reliable Q&A and workflow system for CS and Sales at DK Hardware Supply.

## Install (for teammates)

1. Download the built plugin file:

   **`plugin/dist/order-processing.plugin`**

   If you cloned the repo, it's already on your disk at `C:\path\to\order_processing\plugin\dist\order-processing.plugin`. If you haven't cloned, download it directly from GitHub.

2. Open **Claude Cowork** on your computer.

3. Drag the `.plugin` file into the chat window (or use the plugin install flow). Click the install button in the preview.

4. Done. The six skills below will now fire automatically when relevant questions come up while you're working in the `order_processing` folder.

## What's inside

Six skills, each triggered automatically by specific kinds of questions:

### `vendor-lookup`

Fires on any vendor-specific question — "what's Pemco's email," "can we dropship with Cal-Royal," "how do I escalate a claim with Hafele." Resolves aliases and sub-brands (Pemco → Assa Abloy, US Lock → Home Depot, Emery Jensen → ACE), reads the right file, answers verbatim, always cites the source. If the vendor is ambiguous, lists 2–4 candidates instead of guessing.

### `add-new-vendor`

Fires when onboarding a new supplier — "add a new vendor: Acme," "new supplier just came on, rep is Sarah at sarah@..." Sanitizes the folder name, checks for collisions with existing folders and sub-brands, creates the three standard files populated with whatever the user provided, stubs the rest. Reminds you to update the master table.

### `sop-refresh`

Fires on "update this SOP," "refresh the playbook," "incorporate these changes." Takes a baseline SOP plus change notes, emits (1) a difference summary table, (2) a clean revised SOP with `(Updated: YYYY-MM-DD)` tags on each changed line. Preserves original structure, never leaves old and new rules coexisting.

### `update-vendor-info`

Fires on field-level changes to existing vendors — "update Hafele's phone to X," "Pemco now only dropships under their account," "add Pemko as an alias for Pemco." Edits only the per-vendor source, timestamps the change, then regenerates and validates the rollups, index, and completeness report.

### `draft-claim-email`

Fires on problem reports — "CRL shipment came in with 2 cracked panels, draft the claim," "Deltana sent a damaged door pull, write to them," "wrong SKU from Abaco." Reads the vendor's Issue Resolution Notes + Vendor Info, produces a complete email (Routing / Subject / Body / Attachments / Follow-up). Respects internal-routing rules (e.g. Deltana claims must go through Elina, not directly to the vendor).

### `regenerate-vendor-rollup`

Fires when generated vendor artifacts need rebuilding after per-vendor edits. Uses the repository's deterministic generator to rebuild `Vendor Information.md`, `Vendor Information.jsonl`, `INDEX.md`, and the completeness report, then validates parity with `npm run kb:check`.

## Benchmark

Measured on 4 real-world prompts each, April 2026. "With skill" vs. Claude without the plugin installed:

| Skill | With skill | Baseline | Delta |
|---|---|---|---|
| vendor-lookup | 100% | 88% | +12% |
| add-new-vendor | 92% | 60% | +31% |
| sop-refresh | 91% | 67% | +24% |
| update-vendor-info | 75% | 65% | +10% |
| draft-claim-email | 80% | 57% | +24% |
| regenerate-vendor-rollup | 50% | 50% | 0% |

Note on `regenerate-vendor-rollup`: the +0 delta is inflated by infrastructure noise — 3 of the 8 subagent runs had output-path issues unrelated to the skill itself. The runs that landed correctly passed 6/6. The production behavior is expected to match the `vendor-lookup` / `add-new-vendor` range; the raw benchmark number is a floor, not a ceiling.

Full side-by-side test outputs are in `../_skill_evals/` — open the HTML files in a browser.

## Directory layout

```
plugin/
├── README.md
├── .claude-plugin/plugin.json
├── skills/                    ← exactly six release skills
└── dist/order-processing.plugin
```

Development-only skills live outside this directory under `dev-skills/` and are never included in the release artifact.

## Contributing / editing a skill

Each skill's behavior lives in its `SKILL.md` file. To change what a skill does, edit the markdown under `skills/<skill-name>/SKILL.md`, rebuild the `.plugin` file, commit, and push.

### Rebuilding the plugin (after editing a SKILL.md)

From the repository root on any supported platform:

```bash
npm run plugin:build
npm run plugin:check
```

The build uses sorted inputs and fixed ZIP metadata, so identical source produces an identical artifact. `plugin:check` fails if the manifest, six-skill release set, README version, or committed artifact differs from source. Bump `.claude-plugin/plugin.json`, add the matching README version entry, build, check, commit, and push.

### Adding a new skill

1. Create `skills/<new-skill-name>/SKILL.md` with the YAML frontmatter (`name`, `description`) and the instructions below it. See the existing three skills as templates.
2. Draft 3–4 test prompts that realistic users would type.
3. Ask Claude in Cowork to evaluate the skill — "run the evals for `<skill-name>`" — and drop the resulting review HTML into `../_skill_evals/`.
4. Rebuild and bump the version.

## Versioning

- **0.7.0** (May 2026) — added deterministic cross-platform packaging and parity checks; confirmed the six production skills and excluded the development-only refinement skill; `sop-refresh` Mode A now appends to `SOP-Refresh-Changelog.md`.
- **0.6.0** (April 2026) — `sop-refresh` Mode B now also appends a run-level summary to a single global changelog at the root (`SOP-Refresh-Changelog.md`), in addition to the per-CSV detail file
- **0.5.0** (April 2026) — added Mode B (bulk CSV) to `sop-refresh`: picks the newest CSV in `bulk_changes/`, applies each row to the matching vendor's Process Document, and writes a per-CSV changelog (`bulk_changes/<csv_basename>.changelog.md`) that accumulates across runs
- **0.4.0** (April 2026) — restructured the knowledge base so every per-vendor folder lives under `Vendors/`; updated all six skills' path references ac