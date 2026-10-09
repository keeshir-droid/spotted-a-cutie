# VERIFY.md: Spotted a Cutie

## FINAL STATUS (Pass 4, last check), 2026-10-09

**Nothing is failing.** All Pass 4 items pass. Two cosmetic notes are listed below; neither blocks shipping.

**Done stamp (FILED / ON ITS WAY / SAVED), now below the card on the paper:**

| Check | Result | Evidence |
|---|---|---|
| Covers any pixel inside the card edge, on any of the 6 styles | **PASS: no.** Measured: the card bottom is y 218 and the stamp's rotated box starts at 220 at 390. At 360 it's 204 and 206. Zoomed at 3×, there's a clear paper gap on Trading, Wanted, Polaroid, Dating (♥ button and address fully visible), News and Minimal | p6-stamp-*-390.png, p6-stamp-*-360.png, p6-done-*-390/360.png |
| Runs off-screen | **PASS: no.** Stamp right edge 321 of 390 and 306 of 360; no horizontal scroll | (measured) |
| Hits the nudge note or buttons | **PASS: no.** The stamp ends at 280 (390) and 266 (360); the title starts at 320 and 290 | (measured) |
| Hits the scallop | **PASS at 390** (≈10 px clear). **At 360 the stamp's bottom edge just touches the top of the scallop bumps** (stamp bottom 266 = sheet bottom 266). It covers nothing and reads as a stamp at the sheet's edge. Cosmetic only. Optional: give the sheet ~6 px more bottom padding at ≤ 360. Owner: site-builder | p6-stamp-dating-360.png, p6-blocked-saved-360.png |
| "safe and sound" fully visible at 360 | **PASS.** The whole phrase is visible. Cosmetic: at 360 the arrow's tip now ends behind the card's left edge (on Dating it disappears into the card). It still points at the card | p6-done-minimal-360.png, p6-stamp-dating-360.png |
| Blocked variants | **PASS.** Sent: "Sent." / "Cutie #1." / **ON ITS WAY · sent, not filed**. Saved (Save image from a blocked session): "Saved." / **SAVED · to your photos**. Both have no "safe and sound" and no "strong start", and the "no binder here" note reads cleanly | p6-blocked-sent-390/360.png, p6-blocked-saved-390/360.png |
| Kind screen unchanged | **PASS**, identical to p5/p4/rv kind shots | p6-kind-390.png, p6-kind-360.png |

**Tests:** `node tests/page-check.js http://localhost:8001` **PASS** (0 failures).
- `binder-test`: pass
- `engine.test`: 39,316 checks, 0 failed
- `export-test`: pass
- `sample-test`: pass

No console errors, exceptions or failed requests in the run. No code or tests changed.

**Final Pass 4 counts:**

| Layer | PASS | FAIL |
|---|---|---|
| Function | 18 | 0 |
| Aesthetic | 19 | 0 |

The "Never" list has no hits. What remains is Rishi's real-phone list (the "Needs a real phone" sections below).

---

## Pass 4 re-check (superseded by FINAL STATUS above; item A is now fixed), 2026-10-09

**Still failing (top of the list):**

| # | Problem | Where | Owner |
|---|---|---|---|
| A | **The FILED stamp on Done still covers card text on 5 of 6 styles.** It now sits above the photo corner (that part is fixed) and lower, which clears **Trading**, whose address sits above its bottom border. But on the other five the colophon sits at the very bottom of the card, and the stamp lands on it:<br>• **Polaroid:** covers the tag and the address.<br>• **Minimal:** covers the tag and the address.<br>• **Dating:** covers the address and half the ♥ button.<br>• **News:** covers the address after "SPOTTE…".<br>• **Wanted:** the stamp's top border runs through the bottom of the address letters.<br>The blocked-route "ON ITS WAY" stamp does the same.<br>Fix: either move the stamp off the card's bottom edge entirely (e.g. on the paper to the right of the card, overlapping only the bottom-right photo corner, so drop it ~40 px and right ~30 px), or place it on the top-right corner, where no style has text under the corner mount. | p5-filed-polaroid/minimal/dating/news/wanted.png (pass: p5-filed-trading.png); p5-done-polaroid-360.png; p5-error-binder-390.png | site-builder (art-director if it moves to a new corner) |
| B | Minor: at 360×640 the Done aside "safe and sound" runs under the card's left edge ("sound" is clipped). | p5-done-polaroid-360.png | site-builder |

**Now passing (the other 6 items from the Pass 4 list):**

| # | Item | PASS / FAIL | Evidence |
|---|---|---|---|
| 1 | Landing aside at 360 | **PASS** | "real cats. fake names." and the arrow now sit above the fan, clear of the card and tape, at 360 and 390 (p5-landing-360.png, p5-landing-390.png) |
| 2 | FILED stamp vs photo corner | **PASS** | The stamp is now above the mount; no black corner through it (p5-filed-*.png) |
| 2b | FILED stamp vs card text | **FAIL** | See A |
| 3 | Reveal at 360×640: stamp / skip text / X / star | **PASS** | COMMON and GOLDEN stamps end above "tap to skip the drama"; the X and the star no longer overlap (p5-reveal-stamp-17-360.png, p5-reveal-golden-360.png) |
| 4 | Blocked Done wording + stamp | **PASS** | The real blocked route (`?screen=error-binder`) shows "Sent." + "Cutie #1." (no "strong start"), no "safe and sound" arrow, and a stamp reading **ON ITS WAY / sent, not filed**. The note is "no binder here" / "Mr. Giles can’t stay in this browser, but fits in your photos.", so it no longer repeats itself (p5-error-binder-390/360.png). Forcing `&nudge=blocked` on a working binder still shows FILED + "in your binder", which is expected for a dev override |
| 5 | In-app note clip | **PASS** | The clip moved to the top-right; it's clear of the title (p5-inapp-zoom.png) |
| 6 | Binder header at 360 / 390 | **PASS** | 360: "8 cuties / spotted · [1 golden]", with the dot and badge kept together. 390: one line (p5-binder-360.png, p5-binder-390.png) |
| 7 | Reveal underline width | **PASS** | The squiggle spans the name for "Ambrose the Third" (17 chars) and for "Rick" (p5-reveal-name-17-390.png, p5-reveal-name-4-390.png, p5-reveal-stamp-17-360.png) |
| — | Rewritten nudge lines | **PASS** | `{name}` is filled in each variant, no braces are left, and the icons show (share on iOS, ⋯ on in-app "menu"). The tone is warm and gender-neutral ("Send Mr. Giles to someone nice.", "Your binder has begun.") |

**Kind screen:** **PASS, unchanged.** It matches p4-kind and rv-kind at 390 and 360 (p5-kind-390.png, p5-kind-360.png).

**Regression scan (result, binder, empty binder, errors at 390 and 360):** **PASS**, nothing new. See p5-result-390/360.png, p5-binder-390/360.png, p5-binder-empty-390.png and p5-error-390/360.png. No console errors, exceptions or failed requests in the run.

**Tests:** page-check **PASS** (0 failures). Engine tests:
- `binder-test`: pass
- `engine.test`: 39,316 checks, 0 failed
- `export-test`: pass (it still prints a stack trace from what looks like its deliberate toBlob-failure case)
- `sample-test`: pass

No tests were changed.

**Pass 4 final counts:**

| Layer | PASS | FAIL |
|---|---|---|
| Function | 18 | 0 |
| Aesthetic | 18 | 1 |

The aesthetic FAIL is item A, under checklist #1 ("nothing covers card text"). Item B is minor. The "Never" list has no hits.

---

## Pass 4 (first run, superseded by the re-check above): The Scrapbook restyle + saving nudge (2026-10-09)

What was checked: every screen at 390×844 and 360×640, with `p4-*-390.png` and `p4-*-360.png` in `shots/`, all opened with Read. I drove the pages with `tests/cdp.js` in one Edge, waited up to 60 s for each sample-loading page, and changed no code.

### Still failing (fix list, most important first)

| # | Problem | Where on the image | Owner |
|---|---|---|---|
| 1 | **Landing at 360×640: the front card and its tomato tape cover the handwritten aside.** Only "…ats. fake names." shows, and the arrow is hidden. | top of the fan, p4-landing-360.png | site-builder |
| 2 | **FILED stamp on Done covers the card's own text and sits under a photo corner.** The stamp lies over the card's address ("SPOTTED-A-CUTIE…") at the bottom-right. The black bottom-right photo corner is drawn **on top of** the stamp, between "No. 001 ·" and "9 Oct". Fix: put the stamp above the mounts in z-order and move it ~24 px further off the card, so it overlaps only the corner mount and the paper. | p4-done-filed-zoom.png, p4-done-*-390.png | site-builder |
| 3 | **Reveal at 360×640: the COMMON stamp sits on "tap to skip the drama"**, and the close X overlaps the drawn tomato star. | bottom and top-left, p4-reveal-stamp-dog-360.png | site-builder |
| 4 | **Done when the binder is blocked still says "safe and sound" and shows a FILED stamp**, although nothing was filed. Its note also repeats itself: the title is "no binder here" and the body starts "No binder here, so…". | p4-error-binder-390.png | site-builder (hide the arrow and stamp when blocked); content-writer (the body line) |
| 5 | **Inapp nudge: the paper clip sits on the "y" of "you’re inside an app".** | top-left of the note, p4-done-inapp-note-zoom.png | site-builder |
| 6 | **Binder header at 360: "• 1 golden" wraps to its own line, starting with the middle dot.** Keep "· 1 golden" together with the count, or drop the dot when it wraps. | p4-binder-360.png | site-builder |
| 7 | **The reveal squiggle underline is a fixed width**, so long names outrun it ("Montgomery" is underlined only to "gom"). | p4-reveal-reduced-700ms.png | site-builder |

None of these are "Never" list hits: no cartoon characters, faces, candy palette, toy outlines, glow or emoji anywhere.

### Tests
- `node tests/page-check.js http://localhost:8001`: **PAGE CHECK: PASS** (0 failures, no console errors, no failed requests). It did not need updating for the new markup.
- `tests/engine/binder-test.js`: all passed. `engine.test.js`: 39,316 checks, 0 failed. `export-test.js`: all passed. It logs "Error: toBlob gave nothing", which looks like an intentional negative case because the test still reports pass; worth a glance (integrator). `sample-test.js`: all passed.
- **I changed no tests**: none asserted old markup.

### Function

| Item | PASS / FAIL | Why | Screenshot | Owner if failing |
|---|---|---|---|---|
| Kind screen unchanged | PASS | Same layout as the approved build (title, line, taped print with "tap your cutie", 9 line-icon tiles 01–09, beige). `git diff HEAD` shows no change to any Kind rule; the screen has no `data-kind`, and its background is still `#f6f2ea` | p4-kind-390.png vs rv-kind-390.png; p4-kind-360.png vs f-kind-360.png | |
| Nudge variants first / generic / ios / inapp / blocked | PASS | Each forced variant shows its own colour note, Caveat title and line; `{name}` is filled ("Mr. Giles"); no braces left | p4-done-first/generic/ios/inapp/blocked-390.png | |
| Nudge icons | PASS | iOS lines get the share icon after "Share"; in-app lines that say "menu" get the ⋯ dots (drawn SVG) | p4-done-ios-390.png, p4-done-inapp-note-zoom.png | |
| No immediate repeats | PASS | 6 reloads in a row of `generic` at each size: 0 back-to-back repeats | (log) | |
| Natural variant | PASS | After a real Save, a first card picks `first` ("Cutie #1: Mr. Giles. Kept in this browser, on this phone.") | p4-done-natural-390.png | |
| `SC.binder.keepStatus()` / persist | PASS | Returns `{persisted:false, standalone:false, platform:"other", browserOk:true}` in headless Edge; no console errors in any run | (log) | |
| Done: note + primary above the fold | PASS | 390×844: note ends at 487, Send to someone else ends at 561. 360×640: 491 / 566 of 640 | p4-done-*-390.png, p4-done-*-360.png | |
| Landing at 360×640: Snap, Pick and the trust stamp visible | PASS | Snap 501, Pick 567, trust stamp 633 of 640 (the aside is covered: fix 1) | p4-landing-360.png | |
| Result: tape vs top-bar buttons | PASS | Back and binder icons hit-test clean through the corner tape; tapping Back works | (log) | |
| Tape and clips vs card text, all 6 styles | PASS | Result tape crosses only the card's top corners (the Dating photo's rounded corner is just touched). Reveal tape crosses only the card-back corners. No card text is covered. Exceptions: the FILED stamp (fix 2) and the loading ticket. When forced over a card, the NOW PRINTING ticket covers the card's bottom lines, but it's a short-lived overlay | p4-result-trading/wanted/polaroid/minimal/dating/news-390.png, p4-reveal-stamp-*-390.png, p4-loading-390.png | |
| Reveal mid and landed, 3 kinds | PASS | Kind paper changes per kind (cat marigold, dog leaf, pigeon lilac); spin, squiggle, stamp, landing on the result | p4-reveal-mid/stamp/landed-cat/dog/pigeon-390.png | |
| Golden reveal + result | PASS | Foil GOLDEN ticket stamp; gold only on golden things | p4-reveal-golden-390.png, p4-result-golden-390.png | |
| Binder with 8 cards | PASS | Fits at 390 (right edge 362) and 360 (332); kind index tabs, foil "1 golden" badge, photo corners, paper clip, holes, pencilled 9–12 | p4-binder-390.png, p4-binder-full-390.png, p4-binder-360.png | |
| Empty binder | PASS | Taped sticky note "nothing filed yet" over the empty slots, then Snap a cutie | p4-binder-empty-390.png, p4-binder-empty-360.png | |
| Errors | PASS | Rose sheet, envelope with sky postage and RETURN TO SENDER ("not a photo" / "can't open this one"), one button | p4-error-notimage-390/360.png, p4-error-heic-390.png | |
| Loading (NOW PRINTING ticket) | PASS (forced) | Kraft ticket, "NOW PRINTING · No. 001", Caveat line, three dots. The real load is too fast to catch on this PC, so I forced the overlay to see it | p4-loading-390.png | |
| Reduced motion (emulated) | PASS | The fan doesn't cycle. The reveal runs only opacity animations and lands on the result in ~1.7 s. Done has no running animations | p4-reveal-reduced-700ms.png | |
| Gift tag "TO:" field, reasons, Story size | PASS | | p4-result-gifttag-390.png | |

**Pass 4 function counts: PASS 18 · FAIL 0** in this table. The 7 layout fails above are counted under the aesthetic layer.

### Aesthetic (DESIGN.md §10, Scrapbook checklist)

| # | Item | PASS / FAIL | Why | Screenshot |
|---|---|---|---|---|
| 1 | Photo is the hero; nothing covers photo or card text | **FAIL** | FILED stamp over the card address on Done (fix 2). Everything else passes | p4-done-filed-zoom.png |
| 2 | Kind screen untouched | PASS | See the function row | p4-kind-390.png |
| 3 | Colour moment on every other screen | PASS | Sky landing; kind paper on the reveal; kind band + tape on the result; marigold Done; lilac binder; rose error | p4-*-390.png |
| 4 | Playful, not childish | PASS | Every device is a real paper object (washi, sticky notes, clips, stamps, envelope, kraft tag, ticket) or a drawn ink mark. No faces, characters or toy shapes | all |
| 5 | One craft palette | PASS | Only §0.4 inks; no candy colours | all |
| 6 | Text on colour is ink | PASS | Ink on all notes and sheets; tomato-deep only for stamp text | p4-done-*-390.png |
| 7 | Flat controls | PASS | Same flat pill and outlined buttons, chips and tools | p4-result-trading-390.png |
| 8 | Saving nudge is a taped sticky note, right variant | PASS (one collision) | Clip on the in-app title (fix 5) | p4-done-inapp-note-zoom.png |
| 9 | Binder is a real album | PASS | | p4-binder-390.png |
| 10 | Three faces max | PASS | | all |
| 11 | No emoji | PASS | Share and ⋯ are drawn SVG | p4-done-ios-390.png |
| 12 | Gold discipline | PASS | | p4-binder-390.png, p4-reveal-golden-390.png |
| 13 | Card signature unchanged | PASS | Tag + address + `#001` on every card | p4-result-*-390.png |
| 14 | Big targets, one primary per view | PASS | | p4-done-*-390.png |
| 15 | Real typography | PASS | "you’re", "That doesn’t", "can’t", "…" | p4-error-*.png |
| 16 | Motion quiet / reduced motion | PASS (emulated) | | p4-reveal-reduced-700ms.png |
| 17 | Cards unchanged | PASS | Same renders as before | p4-result-*-390.png |
| 18 | Family | PASS | Paper, ink-blue primary, serif, Caveat, footer on landing, Done and binder | p4-landing-390.png, p4-done-*-390.png, p4-binder-empty-390.png |
| — | Nothing collides (layout) | **FAIL** | Fixes 1, 3, 5, 6, 7 | p4-landing-360.png, p4-reveal-stamp-dog-360.png, p4-binder-360.png |

**Pass 4 aesthetic counts: PASS 17 · FAIL 2** (the two FAIL rows group fixes 1–7).

**Matches the board** (board3-*-part*.png): same craft kit (tomato/marigold/leaf/sky/rose/lilac/kraft/note), the same landing composition (sky sheet, tomato dashes at the "?", tape and clip on the fan, scalloped edge, FREE · NO ACCOUNT stamp), FILED stamp, kraft TO: tag, lilac binder with tabs and foil badge, and the envelope error. No drift beyond the collisions above.

**Playful vs childish:** it lands on playful. The colour comes from paper and tape, not from characters. The sticky notes and the RETURN TO SENDER envelope are the best new moments: witty, adult, journal-like.

**Colour vs the old beige:** a clear step up. Every screen except Kind now has one confident sheet colour, and the cards still remain the loudest thing.

**Cohesion with the cards:** good. The washi, stamps and photo corners are the same vocabulary the cards already use (Polaroid tape, Wanted stamp, accession tag), so shell and cards now feel like one scrapbook.

**Gut check (would a 20-year-old send it?):**
- Landing: yes at 390; almost at 360 (aside hidden).
- Reveal: yes; the per-kind paper colour is a nice surprise.
- Result: yes.
- Done: yes; the sticky note is charming.
- Binder: yes, it's the best screen.
- Errors: yes.
- Kind: unchanged and still yes.

**Needs a real phone (new for pass 4):**
1. iPhone Safari (not added to Home Screen): Done should show the **ios** note with the share icon.
2. Open the site from an Instagram DM: Done should show the **inapp** note.
3. iPhone Private Browsing: Done should show the **blocked** note.
4. On Android Chrome, check `navigator.storage.persist()` doesn't prompt or error, and that the binder survives a week.
5. With Reduce Motion on (iOS Settings › Accessibility › Motion), notes and stamps should appear without the settle/thump.

---

## Pass 3 and earlier (kept for history)


## Final status (pass 3, 2026-10-09)

**Still failing: one item, not blocking.** Without a tap, auto-crop still frames the background for small or far animals (06 pigeon: hanging pots; 04 sleeping dog: the floor). The kind-screen "tap your cutie" now fixes this reliably when people use it. **Owner: engine-builder** (low priority).

**Fixed and confirmed in pass 3:**
- **Tap-to-centre, end to end.** I tapped on the actual animal in the kind print, then checked the card in all 6 styles and in Adjust at zoom 2, 3 and 4:
  - **06 pigeon:** on the card in all 6 styles, and the bird stays in the window at every zoom; at 4 it fills the window.
  - **04 sleeping dog:** the dog's head is in the window at zoom 4.
  - **08 cow:** the zoom stays on the tapped spot on the cow (I tapped the neck, so at zoom 4 the window shows neck and ear rather than the face).

  Screenshots: f-pigeon-1-after-tap.png, f-pigeon-card-*.png, f-pigeon-4-adjust-z2/z3/z4.png, f-dog-4-adjust-z4.png, f-dog-card-*.png, f-cow-4-adjust-z4.png, f-cow-card-*.png.
- **Reveal name descenders:** the "y" of "Barnaby" and the "p" of "Sprout" are whole once the name settles (f-reveal-settled-minimal.png, f-reveal-settled-trading.png).
- **Hint on one line at 360:** "tap your cutie" (f-kind-360.png).
- **Result at 360×640:** the tools row ends at y 546 and the bar starts at 555, so the tools are clear of the bar (f-result-360.png).
- **Return from Adjust:** opened from the top of the result, Done comes back with scrollY 0, so the card is in view (f-result-after-adjust-390.png). When Adjust is opened from further down, the page returns to that same spot, which is expected.
- **Landing fan:** all three sample cards are un-personalised (`to` is empty in sample.js; no banner or stamp in the fan) and cycle styles. **First paint of all 3 fan cards: about 0.4 s** on this PC, measured from navigation in a fresh profile (f-landing-390-first.png, f-landing-390-t1.png, f-landing-390-t2.png).
- **Regression scan at 390×844:**
  - landing, kind, result, Edit sheet and Done: no change and nothing broken (f-*-390.png);
  - binder: the empty state is correct (f-binder-390.png). The 8-card binder grid was verified in pass 2 at 360, 390 and 430 (rv-binder-*.png).
  - no console errors in any run.

**`node tests/page-check.js http://localhost:8001` (pass 3): PAGE CHECK: PASS**, with 0 failures.

**Final counts:**

| Layer | PASS | FAIL | UNSURE |
|---|---|---|---|
| Function | 36 | 1 (auto-crop without a tap, mitigated) | 3 (real phone) |
| Aesthetic | 23 | 0 | 2 (motion) |

"Never" list: no hits.

What's left is on Rishi's real phones: see "Needs a real phone" at the bottom. The pass-2 report follows, with its rows updated by the notes above.

---

## Pass 2 report (kept for history; superseded where pass 3 says so)

Verification by the ui-verifier, 2026-10-09, against http://localhost:8001. **Pass 1** found the problems; the builders fixed them; **pass 2 (this version)** re-ran everything that failed or was unsure, and re-checked the rest for regressions at 390×844, 360×640 and 430×932. No site code was changed by the verifier. No rows were "tested by hand" yet, so there was nothing of Rishi's to preserve.

How the shots were taken: the standard headless-Edge `--screenshot` command for single frames, and the project's own `tests/cdp.js` driver (one headless Edge, phone emulation with touch) for anything that needs timing, typing, tapping, a filled binder or odd photos. Pass-2 shots start with `rv-`; pass-1 shots keep their old names.

**`node tests/page-check.js http://localhost:8001` (pass 2): PAGE CHECK: PASS.** All ~150 checks passed with zero console errors or failed requests. They cover:
- every dev screen;
- the whole flow with a faked share sheet;
- the 6 card exports and the story export, at the right sizes and file names;
- binder save, list, reopen, delete, number never reused, kept after reload;
- the Back button;
- bad files;
- all 8 real photos (~530 ms each).

---

## Function layer

| Item | PASS / FAIL / UNSURE | Why | Screenshot | Tested by hand |
|---|---|---|---|---|
| Landing: headline, sub-line, fan, Snap + Pick, trust line, footer, "My cuties (n)" | PASS | All there at 390 and 430 | rv-landing-390.png, rv-landing-430.png | |
| Landing on a small phone (360×640) | **PASS (fixed)** | Snap, **Pick a photo** (bottom 545) and the trust line (573) are all above the fold | rv-landing-360.png | |
| Snap opens the camera app | UNSURE | `capture="environment"` input is in place; needs a real phone | (none) | |
| Pick a photo → kind screen | PASS | page-check + every odd photo | rv-tap-1-kind-before.png, odd-*-kind-phone.png | |
| HEIC / not-an-image message | PASS | Friendly title, one button; detail now balanced ("Choose a picture, / or snap a new one.") | rv-error-390.png, error-heic-phone.png | |
| Kind: 3×3 tiles, icons, photo print | PASS | | rv-kind-390.png, rv-kind-430.png | |
| Kind on a small phone (360×640) | **PASS (fixed)** | All 9 tiles visible (last tile bottom 624 of 640); the print shrinks to 119 px | rv-kind-360.png | |
| Tap the animal on the kind print to centre them: carries into the card | **PASS (fixed)** | Tapped the far-away pigeon, picked Pigeon: the bird is on the card in **all six styles** (it was missing before). Crop `{cx .448, cy .603, zoom 1.6}` | rv-tap-2-kind-after-tap.png, rv-tap-3-result.png, rv-tap-card-minimal/trading/polaroid/wanted/dating/news.png | |
| Tap-to-centre: zooming in Adjust stays on the animal | **PASS (fixed in pass 3)**. Pass-2 finding was: **FAIL** | Zoom keeps the stored centre (cx/cy don't change), but **that centre sits above the bird**: after the tap the print already shows the bird in its lower third. At zoom 2 the bird is at the window's bottom edge; at 3.1–4 only its head peeks in at the bottom and the card shows leaves. Either the tap maps to a point ~10% of the photo above where the finger was (rotation/offset in the print mapping), or it deliberately adds headroom, which then breaks when zooming. **Owner: integrator** (map the tap exactly; if headroom is wanted, add it only at low zoom). | rv-tz-1-after-tap.png, rv-tz-3-adjust-z2.png, rv-tz-3-adjust-z4.png, rv-tz-4-result-z4.png, rv-tap-6-result-zoomed.png | |
| Auto-crop without a tap (pigeon 06, sleeping dog 04) | FAIL (mitigated) | Unchanged: the auto-crop still frames pots / floor. The tap fixes it when people use it. Now low priority | pigeon-auto-result-phone.png, cards-real.png rows 4 and 6 | |
| Reveal: card back, "Meet…", name spin mid-way | PASS | | rv-reveal-mid.png | |
| Reveal: flip, underline, rarity stamp position on all 6 styles | **PASS (fixed)** | The stamp now lands on the card's bottom-right edge on every style. It no longer covers the Trading CHAOS roundel, the Dating seal area or the News EXCLUSIVE. The reveal also now shows the requested/remembered style | rv-reveal-stamp-minimal/trading/polaroid/wanted/dating/news.png | |
| Reveal golden: ray ring + GOLDEN foil stamp | PASS (frames) | Shimmer motion is UNSURE | rv-reveal-stamp-golden-trading.png, rv-reveal-stamp-golden-dating.png, reveal-golden-ring-phone.png | |
| Result: card, chips, tools, Where, Who's for, 8 reasons, Story size, sticky Send + Save | PASS | Nothing under the bar at 844/1900 tall | rv-result-tall.png, rv-result-390.png, rv-result-430.png, rv-result-personal-390.png | |
| Result on a small phone | PASS (note) | Card + chips visible; the tools row starts under the sticky bar until you scroll (acceptable, it scrolls) | rv-result-360.png | |
| Style chips / New name / New personality / Edit words | PASS | page-check | rv-edit-390.png | |
| Adjust photo | **PASS (improved)** | The window now fills the width (≈370 px), is centred and shows more of the cut photo; the slider and Done work. Pinch is UNSURE. Still ~200 px of empty paper below the slider on 844 (fine) | rv-adjust-390.png, rv-adjust-polaroid-390.png, rv-adjust-dating-390.png, rv-adjust-360.png, rv-adjust-430.png | |
| 6 styles match PLAN §5.4 structure | PASS | No regressions seen | rv-card-*-priya.png, card-*.png, card-*-golden.png | |
| No Pokémon frame or real dating-app look | PASS | | card-trading.png, card-dating.png | |
| Long recipient on Wanted ("Alexandrina Rose", 16 chars) | **PASS (fixed)** | "RETURN TO ALEXANDRINA ROSE" in full (drops "IF FOUND," when needed); line 2 wraps to two lines. Golden too. "Priya" keeps "IF FOUND, RETURN TO PRIYA" | rv-card-long-wanted-twin/replacement/soulmate/girlfriend.png, rv-card-long-wanted-golden.png, rv-card-wanted-priya.png | |
| Long recipient on Dating and Polaroid | **PASS (fixed)** | Dating banner: 3 lines now clear of each other and the rose rule; golden shifts left of the SUPER CUTIE seal. Polaroid: heart has a clear gap after "replaced" / "soulmate" | rv-card-long-dating-*.png, rv-card-long-dating-golden.png, rv-card-long-polaroid-*.png | |
| Long name (16 chars) | PASS | | card-long-*.png | |
| Long place (32 chars) | PASS (note) | Fits everywhere. The address shortcut and the field both cut a longer place at 32 characters ("…near the ba"). On the card this shows as a broken word, but the person sees the same cut text in the field, so it's their own text | rv-card-long-wanted-twin.png, rv-card-long-polaroid-*.png | |
| Non-Latin recipient | PASS | | card-hindi.png | |
| Empty fields fall back | PASS | | card-minimal.png | |
| Odd photos (60×75, 6000×4500, portrait, panorama) | PASS | 0.9–1.3 s each, no errors (pass 1; nothing in this area changed) | odd-*-result-phone.png, card-odd-*-polaroid.png | |
| Story image (PLAN §5.5) | PASS | Card at y≈285–1440, caption at ≈1490; rotated corners only touch the side margin with card edge | story-*.png | |
| Exports and file names | PASS | page-check | (page-check) | |
| Done screen | PASS | Title wraps cleanly at 360 | rv-done-390.png, rv-done-360.png, rv-done-430.png | |
| Binder-blocked note | **PASS (fixed)** | Now "Sent." + "Your browser won't keep cuties, so this one lives in your chat now." It reads right after a send | rv-error-binder-390.png | |
| Binder at 390 with 8 cards | **PASS (fixed)** | 3 columns fit (slots 109 px, rightmost edge 374 of 390, no sideways scroll). Names ellipsise, numbers stay | rv-binder-390.png | |
| Binder at 360 and 430 | **PASS (fixed)** | 360: 99 px slots, right edge 344. 430: 122 px slots. The header "8 cuties spotted · 1 golden" wraps onto 2 lines at 360, which is fine | rv-binder-360.png, rv-binder-430.png | |
| Binder reopen / delete / numbers / persists after reload | PASS | page-check | (page-check) | |
| Binder after closing the browser on iPhone | UNSURE | Real phone | (none) | |
| Share sheet → WhatsApp / Instagram | UNSURE | Real phone | (none) | |
| No lorem, no `{placeholders}`, no raw errors, no blank canvases | PASS | | all | |

**Function counts (pass 2): PASS 34 · FAIL 2 · UNSURE 3. Pass 3: PASS 36 · FAIL 1 · UNSURE 3.** The 2 FAILs are the tap-to-centre zoom drift and the un-tapped auto-crop (mitigated). Motion and real-device items are listed in "Needs a real phone".

---

## Aesthetic review

### Checklist (DESIGN.md §10)

| # | Item | PASS / FAIL | Why | Screenshot |
|---|---|---|---|---|
| 1 | Photo is the hero | PASS | | rv-card-*-priya.png, rv-result-390.png |
| 2 | Three faces max | PASS | | rv-landing-390.png, rv-card-polaroid-priya.png |
| 3 | No emoji | PASS | | rv-card-dating-priya.png |
| 4 | One icon set | PASS | | rv-kind-390.png |
| 5 | Gold discipline | PASS | | rv-binder-390.png, rv-reveal-stamp-golden-trading.png |
| 6 | Signature tag + address on every card | PASS | | rv-card-*-priya.png |
| 7 | `#014` numbers | PASS | | rv-card-*-priya.png |
| 8 | Nothing collides | **PASS (fixed)** | Dating banner, Polaroid heart and the reveal stamp over the roundel are all fixed. One small leftover: in the **reveal name window, descenders are faded out at rest**. The "p" and "y" of "Humphrey", the "p" of "Ophelia" and the "g" of "Smudge" lose their tails to the 18% bottom mask. I'm noting it here rather than failing the item. Owner: site-builder (make the window ~8 px taller or limit the mask to the spinning phase) | rv-card-long-dating-replacement.png, rv-card-long-polaroid-replacement.png, rv-reveal-stamp-*.png, rv-reveal-stamp-minimal.png, rv-reveal-mid.png |
| 9 | Contrast | PASS | | rv-card-dating-priya.png |
| 10 | One primary per view | PASS | | rv-result-tall.png, rv-done-390.png |
| 11 | Big targets | PASS | Tiles at 360 are ~101 px (≥ 96) | rv-kind-360.png |
| 12 | No shadow on UI panels | PASS | | rv-result-tall.png |
| 13 | Not everything a pill | PASS | | rv-result-tall.png |
| 14 | Texture felt, not seen | PASS | | rv-binder-390.png |
| 15 | Each style is its object at thumbnail size | PASS | Clear at 99–122 px | rv-binder-360.png, rv-binder-430.png |
| 16 | Golden unmistakable, not loud | PASS | | rv-card-long-dating-golden.png, rv-card-long-wanted-golden.png |
| 17 | The personal line is there and fits | **PASS (fixed)** | Wanted now shows the full 16-char name | rv-card-long-wanted-*.png |
| 18 | Real typography | PASS | | rv-card-long-wanted-replacement.png ("Rose’s") |
| 19 | One big moment | UNSURE | Motion; frames look right | rv-reveal-*.png |
| 20 | Reduced motion | UNSURE | Needs a phone with Reduce Motion | (none) |
| 21 | Muted colour | PASS | | rv-card-trading-priya.png |
| 22 | Messy photos look intentional | PASS | The tapped pigeon looks lovely on all six (best: Minimal, Polaroid, Wanted) | rv-tap-card-*.png, card-crow-*.png |
| 23 | Landing is a zine cover | PASS | | rv-landing-390.png |
| 24 | Binder is an album page | **PASS (fixed)** | Full album page at 360/390/430: holes, mounts, pencilled 9–12, gold edge on the golden one | rv-binder-390.png |
| 25 | Family | PASS | | rv-done-390.png |

**Aesthetic counts (pass 2): PASS 23 · FAIL 0 · UNSURE 2** (motion).

### "Never" list hits
**None**, re-checked on every `rv-` shot: no gradient blobs, glass/blur, glow, emoji or sparkles, cartoon outlines, mascots or faces, game chrome, primaries, SaaS hero layout, shadows on everything, all-pills, or a 4th typeface.

### Drift from the approved board (board-5*.png)
- Palette, type, icons, tiles, chips, edit sheet, sticky bar, card back and stamps all match.
- **Reveal stamp position** now differs from DESIGN §7.4 ("top-right corner"). It's the bottom-right edge, an agreed fix; **art-director should update DESIGN.md §6.2/§7.4** so the doc matches.
- The landing fan's front card can be a **personalised** sample ("Twin match! Pauline ♥ Priya"); the board had the plain Trading "Larry". Art-director call: keep the fan samples un-personalised.
- Kind-screen Caveat caption "tap your cutie to centre them" is a needed-ish instruction in Caveat (DESIGN §9 says Caveat never carries one). It wraps to 2 lines at 360 ("centre / them"). Art-director call.
- Binder thumbnails are 99–122 px (DESIGN says 104), which is fine now that they fit.

### Collection check
Unchanged and strong: the same notched tag + uppercase address on all six, the ink-blue personal line, one foil recipe. Each reads as its printed object: tea card, taped instant print, handbill, personal ad, front page, gallery label.

### Photo check
- Scooter cat: hero on all six.
- Crow in flight: excellent on all six.
- **Far-away pigeon: now great once tapped** (rv-tap-card-*.png). Without a tap it's still missing, and zooming in Adjust pushes it out the bottom (see function FAIL).

### Gut check (would a 20-year-old send it because it looks good?)
**Screens**
- Landing: **yes**, and at 360 it's now usable without scrolling.
- Kind: **yes**; all 9 tiles under the thumb at 360.
- Reveal: **yes**. The stamp hanging off the bottom edge reads like a real rubber stamp and no longer hides anything. It would be a full yes with the descenders fixed.
- Result: **almost**. Tasteful, but the 310 px card text is small until tapped.
- Edit sheet: **yes**.
- Adjust: **yes** now. Bigger window, less dead space.
- Done: **yes**.
- Binder: **yes** at every width now. It's a real album page.
- Errors: **yes**.

**Cards**
- Minimal: **almost**. It's the quietest of the six (gallery-label calm).
- Trading: **yes**.
- Polaroid: **yes**.
- Wanted: **yes**. "RETURN TO ALEXANDRINA ROSE / Wanted: Alexandrina Rose's replacement. Found." is very sendable.
- Dating: **yes**.
- News: **yes**.

### Ranked fixes (look), pass 2
1. **Tap-to-centre should centre exactly on the tap point.** Right now the stored centre sits above the animal, so zooming pushes the pigeon out of the bottom of the window and the card shows leaves. **Owner: integrator.** (rv-tz-3-adjust-z4.png, rv-tz-4-result-z4.png)
2. **Reveal name window clips descenders at rest.** Make the window taller, or drop the bottom mask once the name settles. **Owner: site-builder.** (rv-reveal-mid.png, rv-reveal-stamp-minimal.png)
3. **Un-personalised samples in the landing fan.** A front card saying "Pauline ♥ Priya" reads as someone else's card. **Owner: art-director** to decide, then site-builder.
4. **Update DESIGN.md for the new stamp spot (bottom-right edge)** and decide on the Caveat instruction caption on the kind print. At 360 that caption wraps to 2 lines, so consider shortening it to "tap your cutie". **Owner: art-director.**
5. **Auto-crop for small or far animals** (no tap): it still frames the pots or the floor. Now lower priority because of the tap. **Owner: engine-builder.**

---

## Other problems
- **Result at 360×640:** the tools row sits under the sticky bar until you scroll. It's acceptable, but the bar covers half a row of buttons on first view. Optional: shrink the card a little on short screens. Owner: site-builder. (rv-result-360.png)
- **Result scroll position after Adjust:** returning from Adjust lands the result scrolled to the middle (the card's top is off-screen). Scrolling to the top on return would show the change you just made. Owner: site-builder. (rv-tz-4-result-z4.png, rv-tap-6-result-zoomed.png)
- **Place cut at 32 characters** shows a broken word on the card when someone pastes something longer (see the function row). Low priority. Owner: integrator.
- **Dev frames with `seed=7`** all get a "the Third" suffix. Harmless, FYI.
- Content (pass 1, unchanged): no he/she/his/her, no lorem, no unfilled `{placeholders}`, nothing unkind. (cards-content-top.png)

---

## Needs a real phone
Rishi, on an iPhone (Safari) and an Android (Chrome):
1. **Snap opens the camera app.** Tap **Snap a cutie**: the phone's camera opens (no permission prompt), and the shot goes to "Who did you spot?". Repeat inside the **Instagram** and **WhatsApp** in-app browsers (open the link from a DM).
2. **iOS share sheet.** On a card tap **Send**: WhatsApp and Instagram should be listed with the image attached. Send to yourself on WhatsApp and check the 4:5 card is sharp. Then **Story size → Send** to Instagram Stories: nothing important under the top/bottom UI.
3. **Save image fallback.** Android with no share target, and iOS: **Save image** saves `spotted-a-cutie-<name>-<date>.jpg` to Photos or Downloads.
4. **Reveal feel.** Pick a photo, tap Cat:
   - the name slows and clicks into place;
   - the card flips in one smooth turn;
   - the stamp thumps onto the bottom edge (Android: a tiny buzz).

   Then open `?screen=reveal&golden=1`: you should see one shimmer sweep and the ray ring with no stutter. On the result, a golden card shimmers about every 7 s.
5. **Reduced motion.** iOS Settings › Accessibility › Motion › Reduce Motion: the reveal should only fade, and the landing fan should not cycle.
6. **Pinch on Adjust.** Pinch to zoom and drag with one finger; the card updates after Done.
7. **Tap-to-centre (fixed; confirm with a real finger).** With a small, far animal, tap it on the kind print, pick its kind, open Adjust and pinch in: the animal should stay in the middle of the window.
8. **Android Back.** Result → Back → kind; kind → Back → landing; one more Back leaves the site.
9. **Keyboard + sticky bar on iOS.** Tap "Who's this for?": the field stays above the keyboard, and the Send/Save bar doesn't float over it or jump. Do the same in the Edit words sheet.
10. **Binder after closing the browser.** Save 2 cards, swipe Safari away, reopen: "My cuties (2)" with both thumbnails. (iOS may clear site data after ~7 days unused.)
11. **Real render speed.** On a mid-range Android, time photo → tap kind → card on screen (target: the whole loop under 15 s; the PC takes ~0.5 s per real photo, ~1.3 s for a 27 MP one). Style switches should feel instant.
12. **Binder grid on a real phone** with 8+ cards: all three columns fit, nothing scrolls sideways.
