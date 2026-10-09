# Build agents for Spotted a Cutie

Six agents build this project. Four are adapted from Day 6's (Pocket Booth). Two are new:
- an **art-director**, who sets the whole aesthetic before anything visual is built
- a **content-writer**, because the words are half the product

They're Claude Code subagents: each one is a Markdown file in this folder, and the main session hands work to them. All of them work from [`PLAN.md`](../../PLAN.md) (flow, contract, structure). The look comes from `DESIGN.md`, which the art director writes. §7 of PLAN.md keeps everyone in step.

| Agent | Builds / does | Owns (only edits) | Can run commands? |
|---|---|---|---|
| [`art-director`](art-director.md) | The aesthetic: concept, palette, type, texture, icons, motion, every screen's components, the art direction of the 6 card styles, the aesthetic checklist; a design board, self-critiqued. Playful but tasteful, never cartoonish, never AI slop | `DESIGN.md`, `design/`, `src/design-tokens.css`, `src/engine/palette.js`, `shots/board-*.png` | Yes: board screenshots only |
| [`content-writer`](content-writer.md) | Every word on a card: names, titles, moods, habitats, crimes, headlines, dating flags, moves, and the 48 "Who's this for?" lines; a 20-card sample for Rishi | `src/engine/content-data.js`, `notes/content-sample.md` | Yes: node checks only |
| [`engine-builder`](engine-builder.md) | Photo in, crop, content logic, the 6 grades, code-drawn art, text fitting, the 6 card styles (to DESIGN.md, via `SC.PALETTE`), the story scene, the binder, samples, export, sharing; tests on the real photos | `src/engine/` (except `content-data.js` and `palette.js`), `tests/cards.html`, `tests/engine/` | Yes: syntax checks, small Node tests, headless Edge screenshots |
| [`site-builder`](site-builder.md) | The screens, built to DESIGN.md and the board: landing, kind tiles, the reveal, result, edit words, adjust photo, done, binder | `index.html`, `src/app.js`, `src/styles.css` | No |
| [`integrator`](integrator.md) | Joins everything, runs the checks, fixes errors and the function FAILs in VERIFY.md | Small fixes anywhere (not the look); `fonts/` (copying), `tests/smoke.js`, `tests/page-check.js`, `tests/cdp.js`, the config files | Yes |
| [`ui-verifier`](ui-verifier.md) | Two layers. **Function:** does every screen, style and output work. **Aesthetic:** every screenshot judged against DESIGN.md's checklist and "Never" list, drift from the board, the gut check, ranked fixes. Writes VERIFY.md. Never changes code | `VERIFY.md`, `shots/` | Yes: screenshots and curl only |

## The order to use them

1. **Before anything:**
   - Open the build session **inside this folder** (`spotted-a-cutie/`) so these agents load.
   - Rishi starts the local server in a separate terminal, inside `spotted-a-cutie/`, and leaves it running:
     ```bash
     python -m http.server 8000
     ```
     (Stop any other project's server on port 8000 first.)
   - The test photos and samples are already here.
2. **M0, the aesthetic:**
   1. `art-director` step 1 writes `DESIGN.md` (with the font list). At the same time, `content-writer` starts on the words.
   2. **Rishi reads the concept and says go or adjust.**
   3. The main session downloads the fonts with Rishi's okay.
   4. `art-director` step 2 makes the tokens, `palette.js` and the design board, then self-critiques.
   5. **Rishi approves the board.**
3. **M1, the card and the words:**
   1. `engine-builder` builds the 6 card styles to DESIGN.md on the real photos.
   2. `content-writer` finishes and writes the 20-card sample.
   3. `ui-verifier` does a **cards-only aesthetic pass**, and FAILs go back to `engine-builder`.
   4. The main session shows Rishi full-size cards and the sample. **Rishi says go or no-go**, and may add lines of his own.
4. **M2 + M3, in parallel:** `engine-builder` (binder, sample, export, share, story) and `site-builder` (screens, to DESIGN.md and the board).
5. **Join:** `integrator`.
6. **Check:** `ui-verifier` writes `VERIFY.md`, covering both layers.
7. **Fix loop until both layers are clean:**
   - function FAILs go to `integrator`
   - aesthetic FAILs go to `site-builder` (screens) or `engine-builder` (cards), with `art-director` if a fix needs a design decision
   - word problems go to `content-writer`

   Then `ui-verifier` checks again.
8. **M4, phone test:** over home Wi-Fi first (there's no camera API, so plain http works), then the first deploy with Rishi's okay.
9. **Ship (M5):** the main session handles analytics, the README and the root updates (agents never push).

**Things agents can't do**, so the main session does them with Rishi's okay:
- downloading anything (the fonts)
- creating the GitHub repo, pushing, deploying, enabling analytics
- editing `../shared-kit/` or other projects (adding Spotted a Cutie to the sibling list and older footers)

## How agents work (for editing them)

- Claude Code picks these up **when the session is opened in the `spotted-a-cutie` folder**.
- Each agent works in its **own fresh context** and doesn't see the main conversation. Everything it needs is in its file, PLAN.md, DESIGN.md, or the task it's given.
- PLAN.md wins on the flow, the contract and each card style's structure; DESIGN.md wins on the look. Conflicts should be reported, not silently resolved.
- After editing an agent file, start a new session (or reload agents) so the change is picked up.
