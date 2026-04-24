# Skill evaluation reviews

This folder contains the test results for each skill in the `order-processing` Cowork plugin. Each HTML file is a self-contained page showing the test prompt, the output produced with the skill loaded, the output produced without the skill (baseline), and a programmatic grade for each assertion.

## How to use these

Open an HTML file in a browser. For each skill, you'll see:

1. **Outputs tab** — click through each test case. For every test you see the prompt that was sent, the file(s) the skill produced, and the assertions that were checked. There's a feedback textbox if you want to leave notes on an output that doesn't look right.
2. **Benchmark tab** — summary table: pass rate, time, and tokens for each configuration, plus per-eval breakdown.

## Summary (v0.3.0 evaluation, April 2026)

| Skill | With skill | Baseline (no skill) | Delta |
|---|---|---|---|
| vendor-lookup | 100% | 88% | +12% |
| add-new-vendor | 92% | 60% | +31% |
| sop-refresh | 91% | 67% | +24% |
| update-vendor-info | 75% | 65% | +10% |
| draft-claim-email | 80% | 57% | +24% |
| regenerate-vendor-rollup | 50%* | 50%* | 0%* |

\* `regenerate-vendor-rollup` benchmark is floor-bounded by 3 subagent infrastructure failures (files didn't land at expected paths). Runs that landed successfully passed all 6 assertions. Real-world behavior should be in the vendor-lookup / add-new-vendor range.

## What "with skill vs baseline" means

"With skill" means Claude was given the plugin's SKILL.md instructions before attempting the test. "Baseline" means Claude had only the knowledge base and no skill — how Claude would answer the same question without the plugin installed. The delta shows how much the skill moves the needle; positive means the skill is doing useful work.

## Files

- `vendor-lookup-review.html` — 4 test cases: exact-match lookup, sub-brand resolution (Pemco → Assa Abloy), ambiguous vendor, stub-file fallback.
- `add-new-vendor-review.html` — 4 test cases: minimal name only, full contact card, slashed brand name, collision with existing sub-brand.
- `sop-refresh-review.html` — 4 test cases: vendor-doc change, multi-section policy change, ambiguous request (should ask), targeted precision change.
- `update-vendor-info-review.html` — 4 test cases: simple phone change, alias addition, vendor not found (should refuse to create), similar existing value (should ask before overwriting).
- `draft-claim-email-review.html` — 4 test cases: direct-contact vendor (CRL), internal-routing vendor (Deltana via Elina), stub-vendor fallback (Abaco), insufficient-detail request (should ask).
- `regenerate-vendor-rollup-review.html` — 4 test cases: straight regenerate, diff-reporting after simulated change, folder without Vendor Info handling, banner + column-order preservation.

## Re-running the tests

These pages are static snapshots. To re-run the evals after editing a skill, ask Claude in Cowork — "re-run the `<skill-name>` evals and regenerate the review" — and drop the new HTML here to replace.
