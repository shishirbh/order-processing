# Feature Ideas — future skills for the order-processing plugin

Prioritized list of skills we considered but didn't build in v0.3.0. Each entry lists what the skill does, trigger phrases, inputs/outputs, effort estimate, and priority. Use this as a roadmap when deciding what to build next.

Ordering: highest-priority first within each tier.

---

## Tier 2 — infrastructure and near-term wins

These complement the current six skills. Small build, high daily frequency.

### `stub-audit`

**What it does.** Scans every vendor folder's Process Document and Issue Resolution Notes; reports every section still marked `_(to be filled)_`. Groups by vendor, ranked by how often that vendor appears in recent issue reports (or by order volume if that signal exists elsewhere). Produces a prioritized "fill these stubs first" list so whoever has time on a Friday knows exactly where to put it.

**Triggers.** "What stubs are still unfilled?" / "show me which vendors need their process docs written" / "give me a stub backlog" / "audit the knowledge base."

**Inputs.** None required. Optional: a specific vendor to scope the audit, or a specific file type (only Process Documents, only Issue Resolution Notes).

**Outputs.** A markdown report grouped by vendor, with per-section stub counts and a ranking.

**Effort.** ~15 minutes to draft, one round of evals. Skill-writer template + a simple file walker.

**Priority.** High. Cheap to build, directly addresses the 99 auto-scaffolded stubs that need human time to fill.

---

### `check-order-status`

**What it does.** "Where's my Deltana PO from last week?" — reads `_shared_sops/SOP to check Vendor Order.md`, the vendor's Process Document, and the cross-vendor `SOP for Post Order status inquires and follow ups.md`. Emits the check steps tailored to that vendor (which system to look in, which contact to reach if the tracking is stale, what to say to the customer while waiting).

**Triggers.** "Where's the order," "status on PO X," "vendor order check," "has Hafele shipped yet."

**Inputs.** Vendor name (required). PO number, order date, customer name (optional; helps personalize the output).

**Outputs.** A step-by-step check list + a pre-filled status-inquiry email to the vendor (if reaching out is the next step).

**Effort.** ~30 minutes. Similar complexity to `draft-claim-email` — reads multiple SOPs, produces templated output.

**Priority.** High for CS. This is one of the top daily workflows.

---

### `vendor-compare`

**What it does.** Side-by-side comparison of 2–4 vendors on specific dimensions. "Which of Hafele, Amerock, and Hardware Resources has better dropship terms?" Emits a comparison table focused on whatever the user asked about — shipping, fees, lead times, expedite availability, DK point of contact coverage.

**Triggers.** "Compare X and Y," "which vendor is best for dropship," "side-by-side on these three vendors," "between X and Y who ships faster."

**Inputs.** 2–4 vendor names + the dimension to compare on.

**Outputs.** A markdown comparison table, plus a one-paragraph recommendation if the data supports one.

**Effort.** ~20 minutes. Mostly reading multiple Vendor Info files and formatting.

**Priority.** Medium. Valuable for Sales when quoting to optimize margin or delivery speed.

---

## Tier 3 — fills out the CS workflow

These are specific workflow skills that build on the foundation. Medium effort, medium frequency.

### `escalation-helper`

**What it does.** "CS is stuck with Deltana, who handles escalation?" Routes to the right DK internal contact (Elina for ETAs, Yana for some claims, Kirill for certain specialty vendors, Razel for claims) based on vendor + issue type. Drafts the internal handoff message so the rep doesn't have to explain the situation from scratch.

**Triggers.** "Who handles X at Y," "escalation for," "who do I loop in," "stuck on a claim."

**Inputs.** Vendor + issue description (both required).

**Outputs.** Name + email of the right internal contact + a pre-filled handoff message with the case summary.

**Effort.** ~25 minutes. Needs a small internal-contact routing table (probably derivable from the current `If not, DK point of contact:` fields across all vendors).

**Priority.** Medium. Unsticks CS reps when they hit a wall; reduces the "who do I ask?" friction.

---

### `draft-po`

**What it does.** Composes a purchase order email to a vendor following their specific rules: correct email address, correct PO day (some vendors only accept POs on Thursdays), correct account handling (ship under our account, their account, or neither). Flags if the user is trying to submit on a non-accepted day.

**Triggers.** "Submit a PO to X," "draft a PO for Y," "send the order to Z."

**Inputs.** Vendor + PO contents (SKU list, quantities, ship-to).

**Outputs.** Email ready to send. Warnings if the day-of-week or account rules would be violated.

**Effort.** ~30 minutes. Pattern is similar to `draft-claim-email`.

**Priority.** Medium. Daily for CS but requires tighter integration with PO data that likely lives in another system.

---

### `post-order-followup`

**What it does.** Generates a follow-up email to either the customer (status update) or the vendor (gentle nudge) based on where the order is in its lifecycle. Uses `SOP for Post Order status inquires and follow ups.md` as the template source.

**Triggers.** "Follow up on order X," "customer asked for status," "vendor hasn't shipped, write a nudge."

**Inputs.** Order identifier, who the follow-up is to (customer or vendor).

**Outputs.** The follow-up email.

**Effort.** ~25 minutes.

**Priority.** Medium. High frequency but most CS reps can write this manually without friction.

---

## Tier 4 — bigger builds or more specialized

These have real value but are heavier builds, narrower audiences, or depend on data we don't fully have.

### `onboard-customer-net30`

**What it does.** Walks through the 670-line NET 30 SOP as a guided flow for a specific applicant. Collects the right data, applies the credit-approval thresholds, produces the approval/decline decision with documentation. Post the new rule change in v0.3.0 era, enforces the <90-day-prepay rule.

**Effort.** ~2 hours including evals. Long SOP, many branches.

**Priority.** Medium-Low. Only Sales uses it, and it's a process they may already have internalized. Worth building when/if the SOP changes again and they want to enforce the new rules consistently.

---

### `draft-quote`

**What it does.** Uses `Sales - Quote and Follow Up SOP.md` + `Sales - Core Item & Fees SOP.md` + the vendor's shipping rules to compose a customer-facing quote. Includes the core fee line, disclosure language, shipping surcharge, and appropriate follow-up cadence.

**Effort.** ~1 hour. Depends on reliable pricing data.

**Priority.** Medium. Daily for Sales, but requires accurate SKU-level pricing that probably lives in another system (ERP). Worth building once that integration exists.

---

### `vendor-pulse`

**What it does.** Weekly rollup report: top-issue vendors by claim count, stub fill rate, new vendors added since last week, SOPs updated. This is more of a scheduled job than a skill — Cowork has a `schedule` mechanism that's a better fit than a trigger-based skill.

**Effort.** ~45 minutes as a scheduled task, more if interactive.

**Priority.** Medium. Valuable for a manager or team lead; not daily CS.

**Implementation note.** Build this as a Cowork scheduled task rather than a skill. Skills are for user-initiated queries; this is a cadenced report.

---

### `sop-lint`

**What it does.** Before an SOP update gets committed, checks it for house-style compliance: required sections present, contact info current (cross-checks against Vendor Info files), `(Updated: date)` tags formatted correctly, no orphaned old rules.

**Effort.** ~1 hour. Lots of edge cases in real-world SOP formatting.

**Priority.** Low. Nice-to-have for governance; `sop-refresh` already enforces most of this at write time.

---

### `consolidate-notes`

**What it does.** Given a bunch of ad-hoc notes about a vendor (email thread, chat excerpt, meeting notes), files them into the right sections of the vendor's Vendor Info / Process Document / Issue Resolution Notes. Deduplicates against existing content.

**Effort.** ~1 hour including evals.

**Priority.** Low-Medium. Useful when a single teammate accumulates knowledge in Slack and wants to dump it into the knowledge base in one shot. Depends on how much "loose notes" volume actually exists.

---

### `knowledge-gaps`

**What it does.** Different from `stub-audit`: finds vendors whose **critical** fields (phone, email, dropship rule, DK point of contact) are blank, ranked by how much that vendor is used. A way to triage which gaps hurt CS most.

**Effort.** ~20 minutes.

**Priority.** Low. `stub-audit` covers most of the same ground.

---

## Recommended build order for v0.4.0 and beyond

**v0.4.0 (data hygiene pair).** `stub-audit` + `knowledge-gaps`. Both small, both help the team prioritize where to spend time filling the 99 auto-scaffolded stubs.

**v0.5.0 (CS workflow round-out).** `check-order-status` + `escalation-helper`. Both daily workflows with real time savings; neither requires data outside the knowledge base.

**v0.6.0 (Sales).** `vendor-compare` + `post-order-followup`. Closes out the CS/Sales daily loop.

**v1.0.0 (polish and scale).** `sop-lint`, `consolidate-notes`, and any others based on what actually gets requested by the team. Also build the plugin marketplace at this point if the team has grown beyond 10 people.

**Scheduled tasks (not skills).** `vendor-pulse` and the daily `regenerate-vendor-rollup` run.

---

## How to propose a new skill

When adding to this doc: include the same fields used for entries above (what, triggers, inputs, outputs, effort, priority). That makes it easy to prioritize at the next planning review.

When actually building: follow the workflow in `README.md` under "Adding a new skill" — draft the SKILL.md, write 3–4 realistic test prompts, ask Claude to evaluate, iterate, rebuild the plugin, bump the version.
