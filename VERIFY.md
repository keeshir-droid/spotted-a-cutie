# VERIFY.md: Spotted a Cutie

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
