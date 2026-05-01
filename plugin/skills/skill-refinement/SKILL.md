---
name: skill-refinement
description: Interactive human-in-the-loop loop for refining and improving agent skills. Use when the user creates a new skill, wants to improve an existing skill, or mentions feedback, refinement, tuning, or iteration on skills. Always proactively offer the refinement loop when the user creates or edits a skill — ask "Would you like to refine this skill through a test loop?" before doing anything else.
---

# Skill Refinement Loop

Refine any skill through iterative testing with human feedback. Each loop cycle: ask a test prompt → execute the skill → user gives feedback → edit the skill → repeat.

## When to trigger

Proactively offer this loop in three situations:

1. **User creates a new skill** — after writing/reviewing the SKILL.md, say: *"The skill is created. Would you like to refine it with a few test prompts? I'll run the skill, you give feedback, I'll tune it — 3-4 rounds usually gets it solid."*

2. **User asks to improve/refine a skill** — jump straight into Phase 1.

3. **User gives feedback after a skill-produced answer** — if the user says something like "that's wrong" or "you should have checked X" after you followed a skill, say: *"Good feedback — want to run the skill-refinement loop and bake this fix into the skill so it doesn't happen again?"*

## Phase 1 — Identify target & gather test prompts

Ask the user two setup questions (can be answered together):

```
Which skill are we refining? (name, or path to SKILL.md)

What test prompts should we run? List 3-5 prompts that cover:
- A happy-path case
- An edge case (ambiguous input, missing data, tricky variant)
- Something that currently fails or could be better
```

If the user doesn't have prompts ready, offer to brainstorm them based on the skill's description and the knowledge base it operates on.

Record the list of test prompts — we'll reuse them every round to prevent regressions.

## Phase 2 — The refinement loop

Run this loop until the user says "done" or "stop":

### 2.1 Run a test prompt

```
Iteration N — running prompt: <prompt text>
------------------------------------------
```

Follow the target skill EXACTLY as written (do not fix it mid-test — the point is to see what breaks). Produce the answer.

### 2.2 Ask for feedback

After the answer, ask:

```
How was that?
- Good? → say "ok" and we'll move to the next prompt
- Missing something? → "should have also mentioned X"
- Wrong routing? → "you should have checked <file> instead"
- Too verbose/terse? → "too long" / "too short"
- Wrong answer? → just describe what the correct answer should be
```

### 2.3 Apply feedback to the skill

Based on feedback, edit the target SKILL.md. Common fixes and where to apply them:

| Feedback | Where to fix in SKILL.md |
|---|---|
| Wrong file consulted | Step 2 routing table |
| Should have checked X too | Add X to routing table or add a note |
| Hallucinated / made up data | Strengthen Step 3 (stubs & blanks) |
| Too verbose | Add "be concise" / "one sentence" to Step 4 |
| Missing source citation | Reinforce Step 4 requirements |
| Vendor not resolved correctly | Add alias to Step 1 or the alias mappings |
| Didn't ask when ambiguous | Strengthen Step 1 rule 4 |
| Wrong answer entirely | Check if the correct file exists; if not, the skill may need new source files |

**Editing rule:** Make the SMALLEST change that fixes the issue. A one-line routing entry, a bullet point, a sentence in the anti-patterns section. Don't rewrite the whole skill mid-refinement — you'll lose track of what you fixed.

### 2.4 Offer next action

```
Applied change: <one-line summary of what I edited>

Options:
- "next" → continue to the next prompt
- "re-test <prompt #>" → re-run a specific prompt
- "stop" → end the refinement loop
- "add prompt" → add a new test prompt to the list
```

If all prompts passed without feedback, say: *"All prompts passed this round. The skill looks solid — want to do a bonus round with new edge cases, or call it done?"*

## Phase 3 — Wrap up

When the user says stop:

1. Show a summary of changes made:
   ```
   Refinement summary for <skill-name>:
   - Iterations: N
   - Changes made: N
   - Test prompts: N (all passing / X failing)
   ```

2. Save test prompts to `_skill_evals/skill-refinement/<skill-name>-tests.md` so they can be re-run later:
   ```
   # Regression tests for <skill-name>
   (Last refined: YYYY-MM-DD)
   
   1. <prompt>
   2. <prompt>
   ...
   ```

3. Save a changelog entry in the skill directory:
   ```
   # Changelog
   
   YYYY-MM-DD — Refinement loop (N iterations)
   - Fixed: <change 1>
   - Fixed: <change 2>
   ```

## Loop rules

- **Run the skill AS-IS** during tests. Don't pre-fix — the whole point is to find what's broken.
- **One change per feedback.** Resist the urge to fix three things at once. Iterate.
- **Keep the skill concise.** Adding too many rules makes it hard to follow. When in doubt, tighten existing rules rather than adding new ones.
- **3-4 rounds is typical.** If you're past 5-6 rounds with major changes each time, the skill may be trying to handle too broad a scope — suggest splitting it.
- **Don't drop test prompts.** Always re-run all prompts from previous rounds to catch regressions. A fix for prompt 2 that breaks prompt 1 is not a fix.

## Anti-patterns

1. **Don't fix the skill silently.** Every change goes through the user. "I edited the routing table to add..." not a silent edit.
2. **Don't skip feedback.** If the user says "ok" or "fine", confirm: "No improvements needed for that one?"
3. **Don't keep going forever.** After 3 rounds with no feedback needed, the skill is done. Suggest wrapping up.
4. **Don't rewrite from scratch.** Incremental edits, not full rewrites — otherwise you lose all the earlier fixes.
