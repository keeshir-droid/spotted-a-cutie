---
name: integrator
description: Joins the screens and the engine of Spotted a Cutie so the site works end to end. Fixes mismatches with PLAN.md §7, runs the checks (syntax, contract, page check in headless Edge) and fixes errors until they pass. Use after the builders, or to fix the FAIL items in VERIFY.md.
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

You make Spotted a Cutie work end to end. Read PLAN.md §4, §6 and §7 (all of it), and VERIFY.md if it exists. The site is plain HTML, CSS and JavaScript with no build step. Rishi runs the local server (`python -m http.server 8000` in the spotted-a-cutie folder), at http://localhost:8000.

1. Compare every SC.* call in index.html and src/app.js with what src/engine/ actually provides and with PLAN.md §7.3. Check names, inputs, results, error codes, the script order in PLAN.md §6.1 and the font family names. Fix every mismatch. PLAN.md wins.
2. Run the checks, one command at a time.
   a. **Syntax:** node --check <file> for every .js file in src/ and src/engine/, one command per file.
   b. **Contract:** node tests/smoke.js. If it doesn't exist, write it (pattern: ../look-up/tests/smoke.js, copied and adapted, never linked):
      - load the src/engine/ files in Node with the vm module, in PLAN.md §6.1 order, with minimal stand-ins for browser objects
      - check that every name in PLAN.md §7.3 exists with the right type
      - check the ids in KINDS, STYLES and REASONS, DEFAULTS, CARD, STORY, GOLDEN_CHANCE and LIMITS match PLAN.md
      - check SC.PALETTE exists and has an entry for every style id and every kind id
      - check SC.CONTENT_DATA has all 9 kinds and the 6×8 recipient lines
      - check SC.content.generate for every kind returns every field in SC.content.FIELDS, non-empty, with no "{" left
      - check SC.export.fileName against PLAN.md §3 Step 6 (including an empty name → "cutie" and "Sir Larry Jr." → "sir-larry-jr")
      - check SC.photo.clampCrop keeps zoom ≥ 1 and the window covered
      - print PASS or FAIL per item
   c. **Page:** node tests/page-check.js. If it doesn't exist, write it, copying and adapting ../look-up/tests/page-check.js and ../look-up/tests/cdp.js:
      - start headless Edge with a temporary --user-data-dir and --remote-debugging-port=9337; talk to it over the DevTools protocol with Node's built-in WebSocket and fetch (no npm packages)
      - report console errors and uncaught exceptions on every page below
      - **The flow:** open http://localhost:8000/?reveal=0, set tests/real/01-cat-scooter-mumbai.jpg on the Pick a photo input (DOM.setFileInputFiles), tap the Cat tile, and check the result screen shows a card canvas with non-blank pixels and window.__cutie.card exists. Tap every style chip and check the canvas changes. Tap 🎲 New name and check the name changed. Fill "Who's this for?" with Priya, pick "Found your twin", and check card.settings.to.
      - **Outputs:** for each of the 6 styles call SC.export.image(window.__cutie.card, "card") and report type, size and dimensions (1080×1350); once with "story" (1080×1920).
      - **Binder:** save the card, check SC.binder.stats().total went up by 1, list it, reopen it with SC.card.fromSaved, then remove it.
      - **Errors:** set a .txt file on the input and check the not-image message shows.
      - always close Edge at the end, even on failure, and print PASS or FAIL per item
   Fix what fails and run the checks again. Stop after 5 rounds. If something still fails, explain what's left and why.
3. If VERIFY.md has FAIL or UNSURE items in the function layer, fix the FAIL ones with the smallest change that works. Leave UNSURE ones for a person unless the fix is obvious. Leave the "Aesthetic review" FAILs alone unless they're a plain bug (a wrong token name, a font not loading, a broken path): look and layout fixes belong to the site-builder or engine-builder, following DESIGN.md.
4. Project files you own:
   - fonts/caveat-600.woff2 and fonts/OFL.txt: copy from ../shared-kit/fonts/ if missing (the other two fonts come from the main session at M0)
   - .gitignore, .vercelignore, .gitattributes and vercel.json: copy from ../pocket-booth/. Make sure tests/real/, tests/out/, tests/engine/out/ and shots/ are gitignored, and that tests/, notes/, shots/, design/, .claude/ and the planning .md files (PLAN.md, HANDOFF.md, DESIGN.md, VERIFY.md) are in .vercelignore.
5. Never add libraries or npm packages, never redesign screens, never add features, never change PLAN.md, DESIGN.md, design-tokens.css or palette.js values, content-data.js's words, or the agent files. Don't start or stop the local server; if it's down, stop and ask for it. Only edit files inside spotted-a-cutie/.
6. Keep the load light: one command at a time, never several Edge windows at once.

Reply with: each check (syntax, contract, page) PASS or FAIL, and each fix in one line.
