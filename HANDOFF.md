# HANDOFF: building Spotted a Cutie (Day 7)

## Before you start (Rishi)

1. **Open a new Claude Code session in this folder:** `C:\creative technologist projects\spotted-a-cutie`. The six agents in `.claude/agents/` only load when the session opens here.
2. **Start the local server** in a separate terminal and leave it running. Stop Pocket Booth's server first if it's still on port 8000.
   ```bash
   cd "C:\creative technologist projects\spotted-a-cutie"
   ```
   ```bash
   python -m http.server 8000
   ```
3. **Test photos are already here:** 8 real street-animal photos from Wikimedia Commons in `tests/real/` (with `CREDITS.md`, never committed), and 3 landing samples in `assets/sample/`.
4. **The look comes first.** An art-director agent designs the aesthetic before anything is built. You'll approve it twice: first the concept (DESIGN.md), then a design board with mock screens and cards.
5. **One download to approve:** the fonts the art director picks (two free Google Fonts plus Caveat). The session will ask.
6. **You can test on your phone before deploying.** The site uses the phone's own camera app, not the browser camera, so it works over home Wi-Fi at `http://<your PC's IP>:8000`.
7. Paste the prompt below into the new session.

---

## The prompt to paste

```
You are the main session building Spotted a Cutie, Day 7 of my 21 Days of Creative Tech. Everything is planned. Your job is to coordinate the build with the agents in .claude/agents/ and get it right the first time.

Read first, fully: PLAN.md (the single source of truth), .claude/agents/README.md (the agents and the order to use them), ../shared-kit/README.md (the family kit we copy from), and the root ../CLAUDE.md (project-wide rules, loaded automatically). Decisions are already made and listed at the top of PLAN.md. Don't reopen them.

How to run the build:
- M0 is the aesthetic, and nothing visual is built before it (PLAN.md §8). Run the art-director (step 1: DESIGN.md) and the content-writer in parallel. Show me the art director's concept, palette, fonts and any proposed PLAN changes in plain English, and wait for my go. Then show me the font download (family, weights, the github.com/google/fonts ofl/ folder, file names, size) and wait for my okay. Convert/subset to woff2 Latin into fonts/ (check whether Python fontTools is installed; ask before installing anything) and copy Caveat from ../shared-kit/fonts/. Then run the art-director's step 2 (tokens, palette.js, the design board) and show me the board screenshots. Wait for my approval of the look.
- The brief for the look, which every agent must hold to: really playful, but aesthetic; not AI slop; collectible, never cartoonish. Our audience doesn't use kiddie or game-UI things.
- Then follow the order in .claude/agents/README.md exactly: M1 (engine-builder to DESIGN.md + content-writer, then a cards-only aesthetic pass by ui-verifier) → go/no-go with me → M2 + M3 in parallel (engine-builder + site-builder) → integrator → ui-verifier (function + aesthetic layers) → fix loop until both layers are clean → M4 phone test (Wi-Fi first, then the first deploy) → fix loop → M5 ship.
- Give each agent a precise task: the milestone, the PLAN.md sections it serves, and what "done" means. Agents don't see this conversation.
- After every agent finishes, read its report and open the key screenshots yourself before telling me it's done. "It passed" isn't proof; look at the actual output.
- Aesthetic FAILs from the ui-verifier go to the site-builder (screens) or engine-builder (cards), with the art-director when a fix needs a design decision. Don't let the integrator redesign anything.
- M1 is the go/no-go. Show me full-size cards: the cat on the scooter in all 6 styles, the far-away pigeon after zooming, one golden Trading card, one personalised card per style (to Priya), and notes/content-sample.md (20 random cards as text). Wait for my "go" before M2/M3. If I edit content-data.js myself, keep my lines.
- Keep the load on my laptop light: one heavy command at a time, never several Edge windows at once, and never start or stop the local server (I run it on port 8000).
- Stay inside this folder. Don't edit ../shared-kit/ or other projects without asking me.
- Ask me before: downloading anything, creating the GitHub repo, pushing, deploying, enabling analytics.
- If an agent's instructions conflict with PLAN.md, PLAN.md wins. Tell me about the conflict.
- Explain things to me in plain English. After each milestone, give me a short update: what works, what I should look at, and what's still unverified.

M4, phone test (with my okay at each step):
- First tell me my PC's local IP so I can open http://<IP>:8000 on my phone over Wi-Fi, with a short checklist: Snap a cutie (camera app opens), Pick a photo, the reveal, all 6 styles, rerolls, Who's this for, Send to WhatsApp, Story size, the binder after closing and reopening the browser.
- Then git init (with the .gitignore from PLAN.md §6.1; tests/real/, tests/out/ and shots/ must never be committed), create keeshir-droid/spotted-a-cutie, push, and create the Vercel project "spotted-a-cutie" (address spotted-a-cutie.vercel.app).
- Then a short checklist for the live site on both phones, including opening it from an Instagram DM link.

Ship (M5, with my okay at each step):
- Turn on Vercel Web Analytics.
- Write README.md with the standard sections from the root CLAUDE.md, including the sample photos' credit (assets/sample/ comes from tests/real/CREDITS.md: 01, 04 and 05, all CC BY 4.0).
- Update the root ../README.md (Day 7 row) and the ../CLAUDE.md "Where we are" table (Day 7 live).
- Ask me before adding Spotted a Cutie to ../shared-kit/footer/siblings.js and the earlier sites' footers.
- Then hand me the remaining checks from VERIFY.md "Needs a real phone".

Start now: confirm the local server answers at http://localhost:8000, then do M0.
```

---

## What "done" looks like
- See PLAN.md §10 for the full checklist.
- **The short version:** on a real phone, Snap a cutie → tap Cat → the name spins and lands on someone like *Larry* → pick a style → "Who's this for? Priya · found your twin" → Send works, and the friend laughs.
- The card is in the binder after closing and reopening the browser.
- It's live at `spotted-a-cutie.vercel.app` with the footer and the address on every card.
