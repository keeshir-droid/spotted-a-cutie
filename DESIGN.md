# DESIGN.md: Spotted a Cutie

The source of truth for the **look**: how it looks, feels and moves. PLAN.md stays the source of truth for the flow, the contract (§7) and each card style's structure. Written by the art director at M0, step 1 (2026-10-09). Step 2 adds `src/design-tokens.css`, `src/engine/palette.js` and `design/board.html`, which turn every value below into code. If a number here and a number there ever disagree, **palette.js / design-tokens.css win** (they are newer), and this file gets fixed.

All card measurements are in pixels on the **1080×1350 card** (scale 1). The engine multiplies by `scale` for the on-screen render. All screen measurements are CSS pixels on a **390×844 phone**.

---

## 1. Concept: The Footpath Museum

> **Every street animal you pass gets catalogued with the straight face of a natural-history museum: numbered, labelled, stamped and filed in an album. The only unserious thing is what the label says.**

The joke works because of the contrast. The craft is calm, careful and a little old-fashioned. The words say *Larry · Feline, menace class · Mood: judging you*. Every decision below comes back to that: **serious object, silly label**. Collectibility comes from print craft (series numbers, rubber stamps, foil, corner mounts, paper), never from game chrome. The real photo is always the exhibit.

### References (objects and eras, and why they fit)

1. **Tea cards and cigarette cards (1920s–1970s).** Think of Brooke Bond's wildlife series, collected in Britain and in India, and Liebig's chromo cards. They're small numbered cards in a series ("No. 14 of 50"). They used only a few inks, had cream borders and a deadpan paragraph of facts. *Use:* the numbering, the series feeling and the Trading card's whole manner. This is a trading card from before trading cards were games, so it's collectible without being Pokémon.
2. **Natural-history museum labels and herbarium sheets (Victorian era to the 1950s).** Typed or hand-inked labels with *Locality · Date · Collector*, a red accession number, a specimen pinned in a tray. *Use:* the **accession tag** on every card (the shared signature, §8.0), "Where did you spot them?" as the *locality*, and label/value layouts with small capital labels. Also the deadpan tone of the whole site.
3. **Drugstore photo albums and instant prints (1970s–1990s).** Cream album pages, black corner mounts, captions in blue ballpoint, the fat white bottom of an instant print. *Use:* the binder as a real album page, the Polaroid style, and **ballpoint blue as the colour of the personal line** (the sender's pen). It's also the reason the photo is always the hero.
4. **Rubber stamps and postmarks (post offices, library date stamps, "RECEIVED" office stamps).** Imperfect ink, a slight angle, double-ruled borders, ink that's missing in speckles. *Use:* the rarity stamp that thumps on in the reveal, Wanted's "If found, return to…", News' EXCLUSIVE.
5. **Risograph zines (1990s to now).** Flat, slightly grainy colour from a small set of inks, and a hair of misregistration. *Use:* the nine kind colours are muted, printed-ink colours, the flat colour on cards has grain, and the Trading card's colour layer sits 1 px off.

**Why these and not others:** this audience already keeps these things: film prints, journals, stickers, zines, postcards from museum gift shops. They're nostalgic and handmade-looking, never toys. They also share one quality: they're **sincere objects**, which is exactly what makes a silly label on them funny.

---

## 2. Palette

### 2.1 The site (UI) palette: one paper, one ink, one accent, one special

The family tokens stay underneath (`../shared-kit/tokens.css`). This site adds `--sc-*` tokens on top. Only one family value is overridden (`--muted`, see the note).

| Token | Hex | Role | Notes |
|---|---|---|---|
| `--sc-paper` | `#f6f2ea` | **Paper.** The page | = family `--bg` |
| `--sc-stock` | `#fffdf8` | Panels, fields, tiles, the bottom sheet | = family `--card` |
| `--sc-album` | `#efe8da` | The binder's album page, the mount behind small prints | a darker paper, binder only |
| `--sc-ink` | `#1c2433` | **Ink.** Text, icons, outlines | = family `--text` |
| `--sc-ink-2` | `#3a4252` | Softer text, Caveat asides | = family `--ink-2` |
| `--sc-ink-3` | `#5f5c55` | Labels, helper text, placeholders, counters | **overrides family `--muted` `#6c6a64`** (4.8:1 on paper), which is too faint in sunlight. This one is 6.0:1 |
| `--sc-line` | `#e6dfd1` | Hairlines between sections, tile borders | = family `--line` |
| `--sc-line-2` | `#cbbfa8` | Visible field and tile borders | |
| `--sc-accent` | `#1f3a5f` | **Accent.** Primary button, selected chips, links, focus, the reveal stamp, the personal line | = family `--accent` (ink-blue, "the sender's pen") |
| `--sc-accent-2` | `#2a4a78` | Pressed primary | = family `--accent-2` |
| `--sc-accent-soft` | `#e7edf6` | Pressed tiles and quiet buttons, the focus ring | = family `--accent-soft` |
| `--sc-gold` | `#b8913f` | **Special.** Foil mid-tone, golden only | |
| `--sc-gold-ink` | `#8a6420` | Gold text on paper ("1 golden") | 4.8:1 on paper |
| `--sc-bad` | `#a33a2b` | The delete confirm only | = family `--bad` |

**Usage ratio on any screen (cards excluded):** paper and stock **~70%**, ink **~20%** (text, icons, hairlines), accent **~8%** (one primary button, selected chips, the focus ring), gold **0%**. Gold is allowed only on the golden reveal, a golden card's edge in the binder, the binder's golden count, and inside golden card images (≤ 2% of a screen). Colour on screen comes from **the photos and the cards**. The UI is quieter than both.

**Contrast pairs (WCAG, computed):**

| Pair | Ratio | Use |
|---|---|---|
| ink `#1c2433` on paper `#f6f2ea` | 13.9 : 1 | body |
| ink-2 `#3a4252` on paper | 9.0 : 1 | secondary text, Caveat |
| ink-3 `#5f5c55` on paper | 6.0 : 1 | labels, helper, placeholder |
| white on accent `#1f3a5f` | 11.5 : 1 | primary button |
| white on accent-2 `#2a4a78` | 8.9 : 1 | pressed primary |
| accent on accent-soft `#e7edf6` | 9.8 : 1 | selected / pressed quiet |
| accent on paper | 10.3 : 1 | links, the personal line |
| gold-ink `#8a6420` on paper | 4.8 : 1 | "1 golden" |
| gold `#b8913f` on paper | 2.9 : 1 | **never text**; foil shapes only |

### 2.2 Gold and foil (golden cards)

A foil effect is faked in flat print with a **diagonal multi-stop ramp plus thin light bands**. On screen, a moving shimmer is added (§6). One recipe is used everywhere, so golden reads the same on all six styles.

| Name | Hex | Use |
|---|---|---|
| `foil.shadow` | `#7a5a1c` | ramp ends, foil outlines, emboss shadow |
| `foil.base` | `#b8913f` | ramp body |
| `foil.light` | `#e3c77a` | ramp highlight |
| `foil.hi` | `#f6e7b8` | the brightest stop, light bands |
| `foil.ink` | `#8a6420` | gold text on light paper |

**The foil fill**, drawn on any shape's bounding box: a linear gradient at **28°** (top-left to bottom-right) with stops `0 #7a5a1c · .16 #b8913f · .33 #e3c77a · .41 #f6e7b8 · .50 #c9a24f · .64 #9c7631 · .80 #d9b866 · 1 #8a6420`. Then **3 light bands** in `#fff6d8` at **alpha .30**, each **3–7%** of the box's diagonal wide, leaning "/" (canvas `rotate(118°)`, parallel to the ramp's colour stripes), positioned by seed. Then **brushed lines**: 1 px horizontal lines every 3 px, white at **alpha .06**. For foil *text*, the text is the clip; add an emboss with a 1 px offset (+1,+1) copy in `foil.shadow` at alpha .5 drawn first.

### 2.3 Kind colours (the Trading card, the binder tabs, story backgrounds)

These are muted printed-ink colours (think riso inks), never primaries. Every ink carries cream `#f8f1e2` text at **≥ 4.5 : 1**. The **tint** is that ink at 20% over paper `#f6f2ea`. The **dark** is the ink × 0.65 (for the bevel line and the stat numbers).

| Kind | Ink name | Ink | Tint | Dark | Cream-on-ink |
|---|---|---|---|---|---|
| `cat` | Burnt ochre | `#9a5f22` | `#e4d5c2` | `#643e16` | 4.6 : 1 |
| `dog` | Bottle teal | `#2f6a68` | `#ced7d0` | `#1f4544` | 5.5 : 1 |
| `pigeon` | Slate | `#4f5d6e` | `#d5d4d1` | `#333c48` | 6.0 : 1 |
| `crow` | Blue-black | `#2a2b33` | `#cdcac5` | `#1b1c21` | 12.4 : 1 |
| `cow` | Moss | `#4c6b3c` | `#d4d7c7` | `#314627` | 5.4 : 1 |
| `squirrel` | Rust | `#9b4a2c` | `#e4d0c4` | `#65301d` | 5.4 : 1 |
| `bird` | Dusty cerulean | `#3c6e8f` | `#d1d8d8` | `#27485d` | 4.9 : 1 |
| `monkey` | Plum | `#6e3b55` | `#dbcdcc` | `#482637` | 7.7 : 1 |
| `mystery` | Aubergine | `#5a4e7c` | `#d7d1d4` | `#3a3351` | 6.6 : 1 |

**Spot inks** (the Trading card's second ink, `kinds[k].spot`): brick `#a84a2c` (dog, pigeon, crow, cow, bird) · teal `#2f6a68` (cat, squirrel) · `#3d6f6a` (monkey, mystery).

### 2.4 Card palettes (per style, summarised; full values in §8)

Each card style has its own **paper, ink, one accent**. It also shares two things with every other style: **ink-blue `#1f3a5f` for the personal line** and **the foil recipe for golden**.

| Style | Paper | Ink | Accent |
|---|---|---|---|
| Minimal | `#f7f3ec` | `#1c2433` | ink-blue (personal line) |
| Trading | the kind ink inside a cream `#f8f1e2` border, on the kind's dark ink | `#1c2433` (cream on the ink) | the kind ink + a second spot ink (brick or teal, §8.2) |
| Polaroid | journal `#efe7d8`, frame `#fbf8f1` | `#1c2433` | kind ink washi tape |
| Wanted | aged `#e9d8b4` | `#2a2118` | stain `#a07a3c`; stamp in ink-blue |
| Dating | blush `#f3e3da` | `#2b2026` | rose `#9e3a4f` |
| News | newsprint `#f2efe6` | `#1d1b18` | brick red `#b0412e` (the EXCLUSIVE stamp only) |

---

## 3. Type

### 3.1 The three families (the whole site, cards included)

| Face | Weights | Where | Never |
|---|---|---|---|
| **DM Serif Display** | 400 Regular, 400 Italic | Screen headings, the name spin, card names, titles (italic), card values and captions | body copy or buttons on screen; anything under 20 px on screen |
| **League Gothic** | 400 (the default width) | **On cards only:** WANTED, headlines, stats, damage numbers, small capital labels, the card number and the address | anywhere in the screen UI |
| **Caveat** | 600 (from the kit) | The handwritten layer: "Meet…", one aside per screen, the Polaroid caption and notes, pencil numbers in the binder, the story line | long text; anything you must read to use the site |

The screen UI also uses the family's **system sans** (`--sans`) for body text, buttons, fields, chips and labels. It costs nothing to download and keeps the family look. **So any screen has at most 3 typefaces in its UI: DM Serif Display + system sans + Caveat.** League Gothic lives only inside card images. A card image is artwork, so it isn't counted in the screen's three. Each card uses at most DM Serif Display + League Gothic + Caveat.

*Why League Gothic instead of the PLAN's Anton:* both are free condensed gothics. Anton is very heavy and close to Impact, the meme and thumbnail face, which pulls toward "loud". League Gothic comes from 1900s wood-type and poster gothics (Alternate Gothic). Its colour is lighter and more elegant, it gives WANTED the look of a real letterpress handbill and News the look of a real tabloid, and it's legible as tiny tracked capitals. (Checked at step 2: its figures are **proportional**, 0.24–0.36 em, so the engine sets card numbers in fixed cells, see §8.0.) *Why keep DM Serif Display:* its high-contrast roman makes names look like museum titles, and its italic is warm and a little funny for *Feline, menace class*.

### 3.2 Font download list (for the main session, M0)

| # | Family | Weights | Folder | Files to take | Make into | Latin woff2, approx. |
|---|---|---|---|---|---|---|
| 1 | DM Serif Display | 400, 400 italic | `github.com/google/fonts/tree/main/ofl/dmserifdisplay` | `DMSerifDisplay-Regular.ttf`, `DMSerifDisplay-Italic.ttf`, `OFL.txt` | `fonts/dm-serif-display-400.woff2`, `fonts/dm-serif-display-400-italic.woff2`, `fonts/OFL-dm-serif-display.txt` | ~25 KB + ~26 KB |
| 2 | League Gothic | 400 (wdth 100) | `github.com/google/fonts/tree/main/ofl/leaguegothic` | `LeagueGothic[wdth].ttf` (the one TTF in the folder), `OFL.txt` | `fonts/league-gothic-400.woff2`, `fonts/OFL-league-gothic.txt` | ~20–35 KB |
| (kit) | Caveat | 600 | `../shared-kit/fonts/` | `caveat-600.woff2`, `OFL.txt` | `fonts/caveat-600.woff2`, `fonts/OFL-caveat.txt` | already made |

- **Subset** to Google's "latin" range: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`. This keeps ’ “ ” … – — · #.
- **League Gothic is a variable font with a width axis.** If fontTools is available, pin it to the default width first (`fonttools varLib.instancer LeagueGothic[wdth].ttf wdth=100`), then subset to woff2. If that isn't possible, subset the variable file as it is; the browser uses the default width.
- **Fallback if the League Gothic folder isn't there or differs:** `ofl/anton/Anton-Regular.ttf` → `fonts/anton-400.woff2`, and tell me. Anton is wider and heavier, so palette.js sizes would drop about 12%.
- **Total new:** about 75–90 KB, plus Caveat. That's inside the ~150 KB budget.

### 3.3 Screen type scale (390 px phone)

| Token | Face | Size / line-height | Tracking | Use |
|---|---|---|---|---|
| `--sc-fs-hero` | DM Serif Display | `clamp(2.4rem, 11vw, 2.85rem)` / 1.0 | −0.01em | Landing "Spotted a cutie?" |
| `--sc-fs-h1` | DM Serif Display | 2rem (32) / 1.1 | −0.005em | Screen titles ("Who did you spot?") |
| `--sc-fs-h2` | DM Serif Display | 1.375rem (22) / 1.2 | 0 | Section titles ("Who's this for?") |
| `--sc-fs-name` | DM Serif Display | 3.25rem (52) / 1.05 | −0.01em | The reveal name spin |
| `--sc-fs-body` | system sans 400 | 1rem (16) / 1.5 | 0 | Sub-lines, detail |
| `--sc-fs-btn` | system sans 600 | 1.0625rem (17) / 1 | 0.005em | Primary and secondary buttons |
| `--sc-fs-chip` | system sans 600 | 0.9375rem (15) / 1 | 0 | Chips, tile labels, tool labels |
| `--sc-fs-field` | system sans 500 | 1.0625rem (17) / 1.2 | 0 | Text field input (≥ 16 so iOS doesn't zoom) |
| `--sc-fs-label` | system sans 600 | 0.75rem (12) / 1 | 0.1em, UPPERCASE | Small labels above fields and groups |
| `--sc-fs-small` | system sans 400 | 0.8125rem (13) / 1.4 | 0.01em | Trust line, binder note, counters |
| `--sc-fs-hand` | Caveat 600 | 1.5rem (24) / 1.1 | 0 | Asides, "Meet…" (1.875rem, 30) |

### 3.4 Card type scale (1080×1350)

| Role | Face | Size range (max → min) |
|---|---|---|
| Hero name | DM Serif Display | 120 → 72 (Minimal), 64 → 44 (Trading), 96 → 60 (Wanted, capitals), 88 → 60 (Dating) |
| Poster word / headline | League Gothic | WANTED fits a 920 px box (~270); News headline 150 → 88, up to 3 lines |
| Title / alias / caption | DM Serif Display Italic | 46 → 30 |
| Values | DM Serif Display | 36 → 26 |
| Small capital labels | League Gothic, UPPERCASE | 22–32, tracking 0.12–0.14em |
| Card number `#014` | League Gothic | 38, tracking 0.04em (inside the accession tag) |
| Address | League Gothic, UPPERCASE | 26, tracking 0.14em, style ink at 55% (or cream at 70% on dark) |
| Handwriting | Caveat 600 | 64 → 40 |

### 3.5 Typographic rules

- **Case:** sentence case everywhere in the UI ("Snap a cutie", "Who's this for?"). Never Title Case. UPPERCASE only for small labels (12 px, +0.1em) and, on cards, League Gothic.
- **Quotes and marks:** curly quotes “ ” and ‘ ’, the apostrophe ’ (Who’s), a real ellipsis … (one character), a middle dot with a space on both sides as the separator (Larry · Feline), an en dash – for ranges (10–100), a × sign for "seen ×4". No straight quotes ' or " anywhere, on screen or on cards. The engine's `fill()` should convert straight quotes in user edits to curly ones.
- **Numbers:** every number on screen uses `font-variant-numeric: tabular-nums lining-nums`. On cards, numbers are League Gothic. **The card number is always 3 digits zero-padded with a # on cards (`#014`)**, with 4 digits past 999. The UI sentence on Done keeps PLAN's "Cutie #14".
- **Exclamation marks:** none in the UI. On cards only where the joke is the format (Dating's "It's a match!").
- **Tracking:** DM Serif Display gets a tiny negative tracking at display sizes (−0.01em). Capitals always get positive tracking (+0.04 to +0.14em). Never track lowercase.
- **Rag:** headlines `text-wrap: balance`. No orphan words on two-line card titles: the engine's wrap avoids leaving a single short word on the last line when it can.

---

## 4. Texture and materials

Everything is drawn in code. The strengths are numbers the engine reads from `SC.PALETTE.texture` and each style's `texture` block. **Rule: texture is felt, not seen.** At phone size (a card shown 300 px wide), grain should read as "paper", never as "noise filter".

| Material | What it is (engine recipe) | Where | Strength |
|---|---|---|---|
| **Paper grain** | A seeded 256×256 tile of random grey values (0–255), tiled and drawn with `globalCompositeOperation = "overlay"` at `alpha = grain` | Every card paper, plus the binder album page (CSS) | Minimal .035, Trading mount .04 and ink frame .10, Polaroid board .05 and frame .03, Wanted .07, Dating .03, News .06; album page .03 |
| **Fibres** | Seeded short curved hairlines, 6–18 px long, 1 px wide, ink at alpha .05, random angle | Wanted, News | per 100×100 px: Wanted 0.6, News 0.4 |
| **Ink spread** | Text drawn once, then a second pass with `shadowBlur` 0.8 px (scale 1) in the same colour at alpha .35. Gives a letterpress edge | League Gothic poster type (WANTED, News headline), the accession tag | on/off per slot |
| **Ink dropout (stamp texture)** | After drawing a stamp, erase seeded small circles (r 0.6–2.2 px) with `destination-out` until `coverage` of the stamp's area is gone. Gives a rubber-stamp look | Stamps, the accession tag | stamps .09, the tag .03, WANTED word .02 |
| **Misregistration** | The colour layer is offset (+1, +1) px from the ink layer | Trading (the cream panels vs the kind-ink frame) | 1 px at scale 1, 0 below scale 0.75 |
| **Foil** | §2.2 | Golden only | — |
| **Stamp** | A rectangle with a double border (outer 3 px, gap 5 px, inner 1.5 px), radius 6, text inside. Colour at alpha .86, rotated −4° to −8° (seeded), then dropout .09 | The reveal stamp (DOM version), Wanted's return stamp, News' EXCLUSIVE | — |
| **Washi tape** | A 280×72 rectangle in the tape colour at alpha .42; diagonal stripes 6 px wide every 18 px in white at alpha .12; both short ends torn (zigzag, 9 teeth, amplitude 4 px); rotated +4° ± 3° (seeded); no shadow | Polaroid (gold foil at alpha .85 when golden) | — |
| **Corner mounts** | Right triangles with 12 px legs (screen; 14 felt heavy on 104 px thumbnails) at each corner of a thumbnail, ink `#1c2433` at .88, with a 1 px highlight on the long edge in white at .15 | Binder album page; the Done screen | — |
| **Nail** | A circle r 11: rim `#4a3a28`, top `#8a7a66` r 8, highlight dot `#c9bba4` r 2.5 at (−3, −3), shadow ellipse `rgba(42,33,24,.35)` 14×6 offset (4, 6) | Wanted, the two top corners | — |
| **Stains** | 3–5 seeded blobs: radial gradient of `#a07a3c` from alpha .10 at the centre to 0, radius 60–220 px. One of them is a coffee ring (a 3 px stroke circle r 90–130 at alpha .10, broken in 2 places) | Wanted | count 3–5, alpha .06–.12 |
| **Edge burn** | Inner gradient from each edge: `#6b4a1e`, alpha .22 at the edge → 0 at 90 px | Wanted | .22 / 90 px |
| **Fold creases** | One horizontal and one vertical line across the paper, at seeded positions near ⅓: a 1 px light line (white .10) and a 1 px dark line (`#6b4a1e` .08) beside it | Wanted, News (horizontal only) | — |
| **Dot grid** | Dots r 2 px every 40 px, ink at alpha .12, grid offset by seed | Polaroid board (and its story background) | — |
| **Halftone** | B&W photo → dots on a 45° screen, cell 5 px (scale 1; minimum 3 px on screen), dot radius `= cell × 0.62 × sqrt(darkness)`, ink `#1d1b18` at .92 on the newsprint | News photo | cell 5 |
| **Vignette** (on photos) | Radial darkening from 60% of the half-diagonal to the corners | per style grade (§8) | 0–.18 |
| **Print shadow** (objects on a background) | Two layers: `0 2px 4px rgba(60,40,10,.18)` and `0 18px 36px rgba(60,40,10,.16)` (scale 1, canvas: `shadowBlur`/`shadowOffsetY`) | The Trading card on its mount, the Polaroid print, the story card | — |

**On screen (CSS):** only physical objects get a shadow: the card, the landing fan, binder thumbnails, the small print on the Kind screen. `--sc-shadow-print: 0 1px 2px rgba(60,40,10,.16), 0 10px 22px -8px rgba(60,40,10,.30)`. **UI panels, fields, tiles and chips have no shadow**, just hairlines.

---

## 5. Icons

One drawn set, inline SVG. The canonical paths will be in `design/board.html` (step 2) and the site-builder copies them from there.

**The style, precisely:**
- **Grid:** 24×24 viewBox, 2 px padding (live area 20×20).
- **Stroke:** `1.75` at 24 px, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`, `stroke: currentColor`. In kind tiles the icon renders at **40 px** with `stroke-width: 1.4` (about 2.3 px on screen). That's a fine line, never a thick cartoon outline.
- **Corners:** rectangles in icons use radius 2.5 (3.5 for the die).
- **Fills:** none, with two exceptions: the die's pips and the pin's centre, which are filled circles r 1.25.
- **Detail level:** a silhouette in 1–3 strokes, like museum wayfinding pictograms or a field-guide margin drawing. Animals are drawn **in profile, with no eyes, mouths or faces of any kind**. Each one is recognisable from its outline: ears, tail, beak, horns.
- **Never:** faces, smiles, blush marks, paws as decoration, emoji shapes, sparkles, gradients, two-tone fills.

| Icon | Drawing |
|---|---|
| **cat** | Sitting cat in side profile, facing right: a rounded back, two pointed ears, a tail curling up around the front feet. One continuous stroke plus the ear stroke |
| **dog** | Sitting dog in profile, facing left: a longer snout, one drooping ear, a straight chest line, a short upright tail |
| **pigeon** | A plump bird in profile: a round breast, a small head, a short beak, a short square tail, two short leg strokes |
| **crow** | A taller bird in profile: a long heavy beak, a flat head, a wedge tail angled down, a long body |
| **cow** | A cow head, front-ish three-quarter: two curved horns, two side ears, a long face ending in a wide muzzle line. No eyes, no nostrils |
| **squirrel** | Sitting upright in profile: a small body, a big S-curve tail rising behind and above the head, tiny paws together |
| **monkey** | Sitting in profile: a rounded back, a round head with one ear, a long tail curling into a spiral at the end |
| **bird (other bird)** | A small songbird perched on a short twig line: a pointed tail, a tiny beak |
| **mystery (something else)** | A dashed circle (dash 2, gap 2.2) with a question mark inside, drawn with the same stroke |
| **dice** (reroll) | One die rotated 12°, rounded square 15×15 r 3.5, three pips on the diagonal |
| **pencil** (edit) | A pencil at 45°: the body, the cone tip, a ferrule line |
| **crop** (adjust) | Two interlocking L crop marks |
| **share** (Send) | A tray (an open-top rounded rectangle) with an arrow rising out of it |
| **save** | The same tray with an arrow coming down into it |
| **binder** | A closed binder seen from the front: a rectangle, a spine line 4 px in, three short ring strokes crossing the spine |
| **close** | An X, 12×12 |
| **back** | A chevron pointing left (not an arrow), 7×14 |
| **pin** (place) | A teardrop map pin with a filled centre dot |
| **heart** | An outline heart, slightly asymmetric (hand-drawn feel), no fill on screen. On the Dating card it's drawn filled in cream on the rose button |
| *extra:* **camera** | A camera body with a lens circle and a small top bump (Snap a cutie) |
| *extra:* **photos** | Two stacked prints, the back one offset up and right (Pick a photo) |
| *extra:* **lock** | A padlock (the trust line) |
| *extra:* **trash** | A bin with a lid line (Delete) |
| *extra:* **check** | A check mark (Done) |
| *extra:* **story** | A tall rounded rectangle 10×18 (Story size) |

These icons **replace every emoji in PLAN.md** (the dice and the pin placeholders). The ♥ and ✕ on the Dating card and the ★ ◆ ● rarity marks are **drawn as shapes on the canvas**, never as text glyphs. (Checked at step 2: none of the three fonts has ♥ ★ ◆ ✕. Content lines that end in ♥, like the Polaroid's "Priya, found your twin ♥", have the glyph stripped and the heart drawn; `SC.PALETTE` marks these slots with `heart.replaces`.) **The canonical SVG paths are in `design/board.js` (`ICONS`).**

**Rarity marks (cards and binder):** common = a filled circle d 18; uncommon = a filled diamond 18×18; rare = a filled 5-point star, outer r 11, inner r 4.6. **Golden** = the 5-point star in foil inside a 1.5 px foil ring of r 14. The mark takes the style's ink colour, and foil when golden.

---

## 6. Motion

**Principle:** one big moment (the reveal). Everything else is quick, quiet and functional. Only `transform` and `opacity` animate.

### 6.1 Easing and duration tokens

| Token | Value | Use |
|---|---|---|
| `--sc-ease` | `cubic-bezier(.2, .75, .25, 1)` | default ease-out (= family `--ease`) |
| `--sc-ease-in` | `cubic-bezier(.4, 0, .8, .3)` | things leaving |
| `--sc-ease-flip` | `cubic-bezier(.45, .05, .2, 1)` | the card flip |
| `--sc-ease-stamp` | `cubic-bezier(.2, 1.3, .4, 1)` | the stamp: **one** small overshoot (about 4%). The only overshoot on the site |
| `--sc-dur-press` | 80 ms | press feedback |
| `--sc-dur-quick` | 160 ms | crossfades, chip colour |
| `--sc-dur-screen` | 220 ms | screen change |
| `--sc-dur-sheet` | 280 ms | sheet open |

### 6.2 The reveal (t = 0 when the Reveal screen shows)

Layout: "Meet…" and the name window sit **above** the card back, so the name is big enough to read in a reel. The card back is centred below, 300 px wide (4:5, 375 tall).

| t (ms) | What | How |
|---|---|---|
| 0–260 | The card back arrives | opacity 0 → 1, translateY 16 px → 0, `--sc-ease` |
| 260–560 | "Meet…" is written | Caveat 30 px, ink-2. `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, 300 ms, linear, so it's revealed left to right like ink |
| 560–1960 | **The name spin** | 9 throwaway names, then the real one, in a window one line tall (DM Serif Display 52 px, window height 62 px, `overflow: hidden`, top and bottom edges faded with a `mask-image` gradient over 18%). Each name slides up from below (translateY 100% → 0, previous one 0 → −100%). Step durations in ms: **45, 45, 50, 60, 72, 88, 110, 140, 180, 230** (sum 1020). Then the real name **settles**: it slides 6 px past its rest position and returns in 160 ms with `--sc-ease`, like a slot reel clicking into place. Any name too wide for the window shrinks to fit (min 32 px) |
| 1960–2400 | Hold | The name rests. A 2 px ink-blue underline draws left to right under it in 260 ms (scaleX 0 → 1, origin left) |
| 2400–2900 | **The flip** | The card turns `rotateY(0 → 180deg)`, 500 ms, `--sc-ease-flip`, with `perspective: 1100px` on the parent. Mid-flip it lifts: scale 1 → 1.035 → 1. The front is the rendered card canvas, `backface-visibility: hidden` |
| 2900–3120 | **The stamp** | The DOM rubber stamp (§7.3) lands on the card's bottom-right corner, hanging off the edge (moved from top-right at M2: there it collided with the Trading card's stat roundel): scale 1.55 → 1, opacity 0 → 1, rotate −14° → −9°, 220 ms, `--sc-ease-stamp`. At 3000 the whole card nudges down 2 px and back (80 ms), the "thump". Android only: `navigator.vibrate(12)` when supported |
| 3120–3700 | Settle | Nothing moves. Reels need this beat |
| 3700–4050 | Into the result | The stamp fades (200 ms). The name heading crossfades into the result screen's top bar. The card moves and scales to its result position (350 ms, `--sc-ease`). The controls fade in, in 3 groups 40 ms apart (chips, tools, the rest), 220 ms each |

**Tap anywhere** during the reveal jumps to the end state (for repeat users). `&reveal=0` skips it entirely.

**The golden moment** (golden cards) replaces 2900–3700 and runs to 4600:
- 2900: **the ray ring.** Behind the card, 36 thin rays (2 × 38 px each, `#b8913f`) are arranged in a circle at radius 210–250 px around the card's centre, like an engraved starburst on an old label. It goes scale .82 → 1.06, opacity 0 → 1 → 0, over 900 ms, `--sc-ease`. No particles, no confetti, no glow.
- 3000–4600: **the shimmer.** A diagonal band of light sweeps across the card once: a `linear-gradient(105deg, transparent 0 40%, rgba(255,246,216,.55) 50%, transparent 60% 100%)` layer at `background-size: 250% 100%`, moved from −100% to 200%, over 1600 ms, `ease-in-out`, with `mix-blend-mode: soft-light`.
- 3300: the stamp reads **GOLDEN**, in foil (§2.2), same thump.
- On the result screen, golden cards repeat the shimmer **once every 7 s** (1600 ms each, peak alpha .35). This is the one allowed loop, because it marks the card as special.

### 6.3 Small motions

| Moment | Motion |
|---|---|
| Button press | translateY(1 px) and background → `--sc-accent-2` (primary) or `--sc-accent-soft` (secondary), 80 ms. No scale bounce |
| Chip select | background and colour change in 160 ms. No scale, no pop |
| Kind tile tap | Pressed: scale .97 and accent-soft background (80 ms). Selected: 2 px accent border for 140 ms, then the screen changes |
| Reroll (New name, New personality, a line's die) | The die icon turns 180° in 300 ms `--sc-ease`. The card crossfades from the old render to the new one (old canvas snapshot on top, opacity 1 → 0, 160 ms) |
| Style change | The same 160 ms crossfade. The new style's chip slides into view (`scrollIntoView({ inline: "center", behavior: "smooth" })`) |
| Bottom sheet | Open: translateY(100% → 0) in 280 ms `--sc-ease`, and the scrim fades in (0 → .38) in 200 ms. Close: 200 ms `--sc-ease-in` |
| Screen change | The outgoing screen fades in 120 ms. The incoming content rises 8 px and fades in over 220 ms |
| Landing fan | Every 2.5 s, **one** card of the three (in turn: front, left, right) changes style with a 400 ms crossfade. Nothing floats or bobs |
| Done | The card thumbnail drops into an album slot: translateY(−24 px → 0), rotate(−4° → −1.5°), 360 ms `--sc-ease`. Then the 4 corner mounts appear (opacity, 120 ms, staggered 30 ms) |
| Toast | Rises 8 px and fades in, 200 ms. Leaves after 2.4 s |

### 6.4 Reduced motion (`prefers-reduced-motion: reduce`)

- **Reveal:** no spin, no flip. "Meet…" and the final name appear together (fade 200 ms). The card back crossfades to the front (250 ms). The stamp fades in (150 ms, no scale, no thump, no vibration). Golden: no ray ring, no shimmer. The printed foil in the card image carries it, plus the GOLDEN stamp. Total about 1.2 s, then the result screen.
- **Everything else:** crossfades only (≤ 160 ms). No sliding sheet (it fades), no die rotation, no fan cycling (the fan stays still on its first styles), no repeating shimmer, no Done drop.

---

## 7. Screens

**Global layout:** one column, 20 px side gutter, max width 480 px centred on desktop. The background outside the column is the same paper, and the column gets a 1 px `--sc-line` border on the left and right on wide screens. Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 56. Light theme only. `theme-color` is `#f6f2ea`.

### 7.1 Components (sizes and states)

**Primary button** (`Snap a cutie`, `Send`, `Done`)
- Size: 56 px tall, full width or flex. Pill radius 999 (**pills are for buttons only**). Padding 0 24 px. Icon 22 px + 10 px gap + label.
- Rest: `--sc-accent` fill, white label (system sans 600, 17 px).
- Pressed: `--sc-accent-2` fill, translateY(1 px).
- Focus: 3 px outline in `--sc-accent-soft`, offset 2 px, plus a 1.5 px inner ink ring.
- Busy (the file is being made): the label stays, and a 12 px ring spinner of two 1.75 px arcs replaces the icon. Still enabled.
- No hard shadows, no gloss, no gradient.

**Secondary button** (`Pick a photo`, `Save image`, `Try another style`)
- Same size and shape. Transparent fill, 1.5 px `--sc-ink` inset ring, ink label.
- Pressed: `--sc-accent-soft` fill.

**Quiet button** (`Story size`, `My cuties`, `Spot another cutie`, `Delete`). This is the "disabled-looking-but-enabled" case. It's an **optional** action, so it's visually quiet but plainly tappable.
- 44 px tall, no border, icon 20 px + label in system sans 600, 15 px, `--sc-ink-2`, underlined (1.5 px, offset 4 px, `--sc-line-2`).
- Pressed: `--sc-accent-soft` background, radius 10.
- **Rule: never grey out a control that works.** Quiet means ink-2 plus an underline, never 40% opacity. Contrast stays at 9 : 1.

**Icon button** (back, close, binder in the top bar): 44×44, radius 12, no border at rest, icon 24 px ink. Pressed: accent-soft fill.

**Tool button** (the result screen's 4 tools: New name · New personality · Edit words · Adjust photo)
- A row of 4 equal cells (each ≈ 84×64 at 390). Stock fill, 1 px `--sc-line-2` border, radius 12. Icon 22 px on top, label below in system sans 600, 13 px, ink, 2 lines max, centred.
- Pressed: accent-soft fill, and the die icon turns (§6.3).

**Style chip** (6, horizontal scroll)
- 44 px tall, radius **8**, padding 0 14 px 0 10 px. A mini swatch (14×18, a 4:5 card in that style's colours: §8 table, row "swatch") with a 1 px ink line at .3, 8 px gap, then the name in system sans 600, 15 px.
- Rest: stock fill, 1 px `--sc-line-2` border, ink text.
- Pressed: accent-soft fill.
- Selected: `--sc-accent` fill, white text, the swatch gets a 1.5 px white ring. `aria-pressed="true"`.
- Row: 8 px gaps, scroll-snap, a 20 px fade mask at whichever edge has more to scroll.

**Reason chip** (8, wrapping in rows of 2–3): the same chip without a swatch, padding 0 14 px. Tap a selected one to clear it.

**Kind tile** (3×3)
- Size: (390 − 40 − 2×10) / 3 = **110×110**, radius 14, gap 10. Stock fill, 1 px `--sc-line-2` border.
- Content: the icon (40 px, ink) centred at 42% height. The label below (system sans 600, 15 px, ink). A catalogue number top-left: "01"–"09" in system sans 600, 11 px, tabular, `--sc-ink-3`, tracking 0.06em. It's the museum-drawer detail.
- Pressed: scale .97, accent-soft fill. Selected (140 ms before the screen changes): 2 px accent border.
- No colour per kind on the tiles. They stay calm, and kind colours belong to the cards.

**Text field** (Where, the recipient's name, the Edit lines). It's a ruled form line, like a museum label form.
- Label above: `--sc-fs-label` (12 px, UPPERCASE, +0.1em, `--sc-ink-3`), 8 px gap.
- Box: 52 px tall, stock fill, radius 10 10 4 4, 1 px `--sc-line-2` border with a **2 px `--sc-ink-3` bottom border**. Padding 0 56 px 0 14 px. Optional leading icon (the pin) at 14 px, then the text at 40 px. Input in system sans 500, 17 px, ink. Placeholder in `--sc-ink-3`.
- Counter right inside: "0/32", system sans 13 px, tabular, ink-3. It turns `--sc-bad` at the limit.
- Focus: bottom border becomes 2 px `--sc-accent`, plus a 3 px `--sc-accent-soft` ring outside.
- Line reroll (in the Edit sheet): a 44×44 icon button to the right of the field (stock fill, 1 px line-2 border, radius 10, the die icon).

**Bottom sheet** (Edit words)
- Rises from the bottom, max height 88svh, `--sc-paper` background (not stock: it should feel like a page), top radius 20.
- A grab handle 36×4 in ink at .2, 8 px from the top. Title "Edit words" (DM Serif Display 24 px) and a close icon button.
- Rows: label + field + die, 16 px apart, separated by nothing (the labels are enough).
- Done: a sticky primary button at the bottom with paper behind it.
- Scrim: flat `rgba(28,36,51,.38)`. **No blur.**

**Sticky bar**
- Full width, solid `--sc-paper` (no transparency, no blur), a 1 px `--sc-line` top border. Padding 12 px 20 px, plus 12 px plus the safe area at the bottom.
- Result screen: **Send** (primary, flex 1.35, share icon) and **Save image** (secondary, flex 1, save icon), 10 px gap.
- **Story size** sits **above** the bar, as a quiet button, right-aligned, at the end of the scrolling content.

**Top bar**: 52 px. Back icon button on the left, a centred small title (system sans 600, 15 px, ink-2, e.g. "Cutie #014" in tabular figures), an icon button on the right (binder). No background, no border, so the paper continues.

**Section** (on the result screen): an H2 (DM Serif Display 22) or a small label, 12 px gap, then the content. Sections are separated by 24 px of space plus a 1 px `--sc-line` rule. No boxes or panels around sections.

**Wordmark** (landing top bar): "Spotted a cutie" in DM Serif Display 20 px, ink, preceded by a tiny accession tag outline (20×12, the notched-ticket shape, 1.5 px stroke). The favicon: the notched tag in ink-blue with a cream "?".

### 7.2 Landing (Step 1)

Top to bottom at 390×844:
1. **Top bar** (52): the wordmark on the left. On the right, when cards exist, a quiet link "My cuties (12)" with the binder icon.
2. **Headline** (left-aligned, 20 px gutter, 12 px below the bar): "Spotted a cutie?" in `--sc-fs-hero`, one line if it fits, otherwise two. **Left-aligned, not centred.** It reads like a zine cover, not a SaaS hero.
3. **Sub-line** (8 px below): PLAN's line, system sans 17/1.45, ink-2, max 32ch, left-aligned.
4. **The sample-card fan** (24 px below, about 300 px tall, centred, the visual centre of the page): three sample cards rendered at 0.4, **never personalised** (no recipient line or stamp, so the first impression is the card itself, not someone else's gift), laid out like a hand of cards:
   - front card 236 px wide (295 tall), rotated −2°, z-index 3
   - left card 188 px wide, rotated −7°, centre offset x −70, bottom +14, z-index 1
   - right card 188 px wide, rotated +6°, centre offset x +70, bottom +18, z-index 2
   - (step 2: bigger than first planned, because the landing had ~170 px spare above the fold; the fan box is 368 px tall and full-bleed, so the rotated side cards never clip)
   - each with `--sc-shadow-print`, a 3 px radius, and the rotation origin at the bottom centre
   - **One Caveat aside** next to the fan (Caveat 24 px, ink-2, rotated −4°, top-right of the fan), with a hand-drawn arrow (1.75 px stroke, round caps) curving toward the front card. The words come from the content-writer or Rishi, e.g. "real cats. fake names."
5. **Buttons** (24 px below the fan): **Snap a cutie** (primary, camera icon, full width) and, 12 px below, **Pick a photo** (secondary, photos icon, full width).
6. **Trust line** (14 px below, centred, `--sc-fs-small`, ink-3, the lock icon at 14 px): "Free. No account. Your photos stay on your phone."
7. **Footer**: "More from Risheek" (the kit footer, unchanged, on paper).

Nothing else: no feature list, no three cards with icons, no explainer.

### 7.3 Kind: "Who did you spot?" (Step 3)

- **Top bar**: back.
- **Title first** (8 px below the bar, left-aligned): "Who did you spot?" (`--sc-fs-h1`, one line) and under it one quiet line (`--sc-fs-small`, ink-3) from the content-writer, e.g. "Tap what it is. We'll handle the paperwork."
- **The photo as a print** (changed at step 2: the side-by-side version left a dead gap and made the photo too small): a 168×210 crop (4:5, the auto-crop centre) on a stock border (8 px sides and top, 26 px bottom, like an instant print), rotated −3°, `--sc-shadow-print`, centred in the space between the title and the tiles (auto margins).
- **The 3×3 tile grid**, pinned to the bottom (28 px above the screen's bottom edge), under the thumb. Tiles as in §7.1, in the PLAN's order. A two-word label ("Something else") wraps to two centred lines (max width 92 px).
- **Nothing else.** No continue button: a tap on a tile goes straight to the reveal.

### 7.4 Reveal (Step 4)

- Paper background, no top bar (a 44 px close icon button sits top-left at 30% opacity and becomes 100% when tapped. It cancels to the kind screen).
- Vertical stack, centred: "Meet…" (Caveat 30, ink-2) → the name window (DM Serif Display 52, ink, window 62 px tall, width 350) → 24 px → **the card back** → the card front after the flip.
- **The card back** (CSS + inline SVG, 300×375, radius 14):
  - ink-blue `#1f3a5f` field
  - a fine engraved cross-hatch: two `repeating-linear-gradient`s at 45° and −45°, 1 px cream `#f8f1e2` lines at alpha .07 every 6 px (like old card backs and banknotes)
  - a double rule inset 10 px (1 px cream at .7) and 14 px (1 px cream at .35)
  - in the centre, **a cream bookplate** 168×112, `#f8f1e2`, with **concave (cut-in) corners** of radius 10 (the label shape of an old specimen label), holding a large "?" in DM Serif Display 72 px, ink
  - under the plate, the next number: "#014" in system sans 600, 12 px, tracking 0.2em, cream at .8, tabular
  - at the bottom, "SPOTTED A CUTIE" in system sans 600, 10 px, tracking 0.24em, cream at .6
- **The stamp** (DOM, on the reveal only, never in the image): a 104×64 rubber stamp (§4 recipe in CSS/SVG: double border, radius 6), in `--sc-accent` at .86, rotated −9°, centred on the card's **bottom-right corner**, hanging off the edge by about 30% (moved from top-right: it collided with the Trading card's stat roundel). Inside, the rarity word in system sans 700, 15 px, tracking 0.18em ("COMMON", "UNCOMMON", "RARE"), and under it the rarity mark (§5) at 10 px. The texture: an SVG mask of speckles (dropout .09). Golden: the word is **GOLDEN**, the stamp is filled with foil, and the text is ink.
- Motion: §6.2.

### 7.5 Result (Steps 5 and 6)

Scrolling content above the sticky bar, top to bottom:
1. **Top bar**: back (to the kind screen) · "Cutie #014" · binder icon.
2. **The card** (8 px below): the `card.render(0.5, "card")` canvas shown at **310×388** (40 px side margins), radius 3, `--sc-shadow-print`, no rotation. Tap opens it full screen on paper, with a close button. When personalised, nothing extra is added on screen: the card itself shows it.
3. **Style chips** (16 px below): a sideways scroll, full bleed to the screen edges, starting at the 20 px gutter.
4. **Tools row** (12 px below): New name · New personality · Edit words · Adjust photo (tool buttons, §7.1).
5. Rule, then **"Where did you spot them?"**: the H2, then the field with the pin icon (placeholder "on a scooter seat", counter 0/32).
6. Rule, then **"Who's this for?"**: the H2, the name field (placeholder "Priya", counter 0/16), 12 px, then the 8 reason chips, wrapping.
7. 16 px, then **Story size** (quiet button, story icon), right-aligned. Under it 96 px of space so the bar never covers it.
8. **Sticky bar**: Send · Save image.

At 844 tall, the card, the chips, the tools and the top of the "where" field are visible without scrolling, with the bar under the thumb.

### 7.6 Edit words (the sheet)

Section 7.1's bottom sheet. Its rows come from `SC.content.fieldsFor(style)`: each row has a label (the FIELDS label, e.g. "MOOD"), a field (max `SC.LIMITS.line`, the name limited to `SC.LIMITS.name`) and a die. Edits update the card live, debounced 150 ms. The sheet sits above the keyboard (visualViewport).

### 7.7 Adjust photo

- Top bar: back ("Cancel" as a quiet text button on the right).
- **The window, big**: the current style's photo window (`card.window()`), scaled to 350 px wide, centred. The photo outside the window shows at **.35 opacity** over paper, so you can see what's cut. The window has a 1.5 px ink frame at .6 and the style's corner radius.
- One Caveat hint under it (Caveat 22, ink-2): "drag to move · pinch to zoom".
- A zoom slider for one-thumb use: a 44 px tall range, 2 px ink track, 22 px stock thumb with a 1.5 px ink ring, accent fill to the left. Labelled with tiny minus/plus marks.
- Sticky bar: **Done** (primary, check icon).

### 7.8 Done (Step 7)

- Paper. A small **album slot** at the top (about 150×188): the card's thumbnail drops in with corner mounts (§6.3).
- Under it: "Larry is in your binder." (DM Serif Display 30, ink, centred, balanced) and "Cutie #14." in Caveat 30, ink-2, rotated −2°.
- Buttons, stacked, 12 px apart: **Send to someone else** (primary) · **Try another style** (secondary) · **Spot another cutie** (secondary) · **My cuties** (quiet, binder icon).
- Footer.

### 7.9 Binder: "My cuties" (Step 8). A real album page

- **Top bar**: back · "My cuties" · nothing.
- **Header** (on paper, left-aligned): "14 cuties spotted" in DM Serif Display 30, then " · 1 golden" in the same face in `--sc-gold-ink` (only when golden > 0). Under it, the per-kind counts in system sans 14 px, ink-2, tabular: "5 cats · 4 dogs · 3 pigeons · 2 crows".
- **The album page** (16 px below, full bleed): `--sc-album` background with grain .03 (a CSS SVG-noise tile). A soft binding shadow along the left edge: 14 px gradient `rgba(60,40,10,.07)` → 0. **Three punched holes** in the left margin (circles 10 px, `#e2d8c4`, inset shadow `inset 0 1px 2px rgba(60,40,10,.25)`) at 15%, 50% and 85% of the page height. Padding 24 px top, 20 px right, 28 px left.
- **The grid**: 3 columns, 12 px column gap, 22 px row gap. Each slot is about 104×130 (4:5):
  - **Filled slot:** the card's thumbnail (radius 2, `--sc-shadow-print`), held by **4 black corner mounts** (§4). Under it, the name in Caveat 18 px, ink, and "#014" in system sans 11 px, ink-3, tabular, on one line. **Golden:** a 2 px foil edge (`border-image` with the foil ramp), foil corner mounts instead of black, and the rarity mark in foil next to the number.
  - **Empty slots:** after the last card, the page always shows empty slots up to the end of the row plus one more row (at least 3). Each has 4 corner mounts outlined at .22 (1 px ink, no fill) and the **next number pencilled in** (Caveat 22 px, ink at .3, centred: "15", "16", "17"…). It's the collector's itch, done with craft.
- Under the page, on paper: "Your cuties live on this phone only. Clearing your browser clears them." (`--sc-fs-small`, ink-3, centred).
- **The opened card** (Result) gets **Delete** as a quiet button (trash icon, `--sc-bad` text) at the very end of the content. The confirm is a small sheet: "Remove Larry from your binder?" with **Remove** (a filled `--sc-bad` button, white text) and **Keep** (secondary).
- **Empty binder** (the first visit): one album page with 3 empty slots ("1", "2", "3" pencilled in) and a primary **Snap a cutie**.

### 7.10 Errors (one friendly message, one button)

- Centred stack: **the empty specimen frame** (an 88×110 outline: four corner mounts at .5 and a dashed 1 px rectangle inside, ink-3, rotated −2°). Then the title (DM Serif Display 28, ink, balanced), the detail (system sans 16, ink-2, max 30ch) and one primary button. The engine's `title` and `detail` are used as they are.
- The binder-unavailable case isn't a full screen: it shows as a one-line note on the Done/landing screens (`--sc-fs-small`, ink-2, with the lock icon).

---

## 8. The 6 card styles: art direction

PLAN.md §5.4 fixes the structure. This section sets the look. Boxes are `x, y, w, h` on the 1080×1350 card. "Fit" means the shrink → wrap → ellipsis rule, with the max → min size given.

### 8.0 Shared across all six: the collection

These are the things that make six styles read as one collection:

1. **The accession tag (the signature).** Every card carries the same small tag, in the same construction and at the same size: **176×56**, radius 6, with a **semicircle notch r 9 cut into the middle of each short end** (a museum label or ticket stub). Inside: the **rarity mark** (§5, 18 px) at x+22, then **`#014`** in League Gothic 38, tracking 0.04em, from x+50, vertically centred. Drawn as a 2.5 px stroke in the style's ink with ink dropout .03, transparent inside. **Golden: the tag is filled with foil, the stroke is `foil.shadow`, and the text is `#1c2433`.** To keep figures tabular, the engine draws each digit centred in a fixed **0.37em** cell (the # in a 0.62em cell), with 0.04em between cells (`SC.PALETTE.tag.number`).
2. **The colophon.** The address always sits **beside the tag**, on the tag's vertical centre, 18 px away: **"SPOTTED-A-CUTIE.VERCEL.APP"**, League Gothic 26, UPPERCASE, tracking 0.14em, the style's ink at **.55** (or cream `#f8f1e2` at **.70** on a dark band). Tag + address = the colophon. Its placement per style is in each section below.
3. **The personal line is in ink-blue `#1f3a5f`**, the sender's pen, wherever the personalisation is its own line or stamp (Minimal, Trading, Polaroid, Wanted, Dating's banner name). News makes the headline itself personal.
4. **One foil recipe** (§2.2) for every golden variant, and golden always reaches the tag.
5. **The same three faces** and the same grain recipe (§4).
6. **The photo is always the largest element** on the card.

**Grades:** the parameters the engine's `grade.js` reads, in this order: `contrast` (multiplier around mid-grey), `saturation` (multiplier), `warmth` (add to R and subtract from B, 0–255 units), `lift` (blacks raised: `out = lift + (1 − lift) × in`), `split` (shadows tinted toward a colour by `amount × (1 − L)²`, highlights toward a colour by `amount × L²`), `ramp` (map luminance through colour stops), `vignette` (alpha). **The street-photo rule:** street backgrounds are loud (red-and-white tiles, green bins, saris, auto-rickshaws), so no style raises saturation by more than 6%. Calming the colours is what makes a messy photo look intentional.

| Style | contrast | saturation | warmth | lift | split | ramp / other | vignette |
|---|---|---|---|---|---|---|---|
| minimal | 1.05 | 1.00 | +3 | .03 | — | — | 0 |
| trading | 1.08 | 0.94 | +2 | .02 | shadows → kind ink .10; highlights → `#f8f1e2` .05 | — | .06 |
| polaroid | 0.96 | 0.90 | +5 | .08 | shadows → `#2f5a55` .05; highlights → `#fff1d6` .08 | — | .14 |
| wanted | 1.06 | 0 (grey) | — | — | — | ramp `#2a2118` → `#8a6a44` (.5) → `#efe0bf`; photo grain .06 | .18 (`#3a2a14`) |
| dating | 1.04 | 1.06 | +4 | .02 | highlights → `#fff0e6` .05 | — | .06 |
| news | 1.0 | 0 (grey) | — | — | — | gamma 1.22, then halftone (cell 5). (M1: was contrast 1.15 / gamma .95, which blew white fur into a dotless blob; gamma > 1 pulls light greys down so white animals keep small dots) | 0 |

**Style chip swatches** (14×18, for the UI chip): minimal `#f7f3ec` with an ink 1 px inner rectangle; trading `#4f5d6e` with a `#f8f1e2` inner rectangle; polaroid `#fbf8f1` with a grey square top and a thick bottom; wanted `#e9d8b4` with a dark top bar; dating `#f3e3da` with a rose dot; news `#f2efe6` with 3 thin black bars.

---

### 8.1 Minimal: "The gallery label"

*The object:* a museum postcard or a gallery wall label. A lot of restraint. The joke lands harder because nothing else is going on.

- **Palette:** paper `#f7f3ec`; ink `#1c2433`; ink-2 `#3a4252`; ink-3 `#5f5c55`; ink-blue `#1f3a5f` for the personal line. Grain .035. No other texture.
- **Photo window:** `40, 40, 1000, 900`, corner **radius 6** (see Proposed PLAN changes: a photo-print corner instead of an app-like 28), plus a 1 px inner keyline in ink at .10, as if printed.
- **Name:** box `40, 966, 1000, 112`, DM Serif Display, ink, fit **112 → 72**, 1 line, baseline 1058, tracking −0.01em.
- **Title:** box `40, 1078, 1000, 50`, DM Serif Display Italic 44 → 32, ink-2, 1 line.
- **Personal line** (if any): box `40, 1130, 1000, 44`, DM Serif Display Italic 36 → 28, **ink-blue**: "for Priya: found your twin" (from the style×reason table).
- **Two rows** (mood, habitat): starting at y 1188 (y 1222 when personalised), with 44 px row pitch. Label column x 40, w 150: League Gothic 24, UPPERCASE, tracking 0.14em, ink-3 ("MOOD", "HABITAT"). Value from x 200, w 620: DM Serif Display 32 → 26, ink, 1 line. When personalised, the rows tighten to a 40 px pitch.
- **Colophon:** right-aligned. The tag at `864, 1270, 176, 56`, the address to its left (ending at x 846). It shares the bottom band with the second row, which never goes past x 820.
- **Golden:** a **3 px foil rule** around the photo, 12 px outside its edge (a gilded mat line), radius 10. The **name is in foil** (clip-filled with the ramp, plus the emboss). The tag is foil.
- **Story background:** `#ece6da`, grain .04.

### 8.2 Trading card: "The tea card" (revised after Rishi's review, step 2)

*The object:* a 1950s–70s tea or cigarette card, **printed in two inks on cream card stock**, the kind you'd find in a shoebox. It's our own frame: no yellow border, no energy symbols, no "HP".

*Why it was revised:* the first version had a beige mount around the card, two moves and 22–26 px text. Rishi said it felt "slightly minimalist rather than playful", and the text didn't read on a story. Now the kind ink carries the card, a second spot ink adds playfulness, there's one move, and **no card text is under 30 px** except the address (26, the family rule) and the label inside the stat stamp (26). At the 310 px result size the smallest text is about 8.6 px, and on a story viewed on a phone it's about 9 px. That's the limit for a card with this much on it. Everything else is bigger.

- **Backdrop (outside the card):** the **kind's dark ink** (e.g. `#643e16` for cats), with an **engraved cross-hatch** (cream at .06, 1.5 px lines every 14 px at ±45°, like the card back) and grain .06. No beige.
- **The card:** `36, 36, 1008, 1278`, radius 30, print shadow. A **18 px printed cream border** (`#f8f1e2`, grain .03), then the **inked field** in the kind ink (inner radius 14, grain .10). This is what makes it read as a printed card.
- **The second spot ink** (`kinds[k].spot`): brick `#a84a2c` for dog, pigeon, crow, cow and bird; teal `#2f6a68` for cat and squirrel; `#3d6f6a` for monkey and mystery. It's chosen for hue contrast with the kind ink. Cream on every spot ≥ 5 : 1, and spot on cream ≥ 5 : 1. Used for **the type ribbon and the damage number only**.
- **Header (on the ink):**
  - **Series line** at baseline 104: League Gothic 32 → 26, UPPERCASE, tracking 0.16em, cream at .86: **"STREET CATS · NO. 001"**. This is the tea-card "No. 14 of 50" line. The series names (Street cats, Street dogs, Pigeons, Crows, Cows, Squirrels, Monkeys, Birds, Unclassified) are in `parts.series`.
  - **Name** at baseline 186: DM Serif Display 84 → 58, cream, box w 760.
  - **The stat stamp:** an **ink-stamped roundel**, r 66, centred `(936, 130)`, rotated −8°. Cream double ring (3 px, 5 px gap, 1.5 px) with dropout .06. Inside: "CHAOS" League Gothic 26, tracking 0.16em, then "90" League Gothic 66. It shows the highest of chaos, fluff and sass.
- **Photo window:** `84, 210, 912, 520`, radius 4, with the same printed bevel (4 px cream line offset 4, 1.5 px kind-dark line at the edge). It's still the largest element.
- **Type ribbon:** `84, 748, 912, 60`, **filled with the spot ink**, notched ends r 10, a 2 px cream keyline inset 5. Text DM Serif Display Italic 36 → 30, cream, centred: "Feline, menace class · Lv. 4".
- **Cream panel:** `84, 826, 912, 380`, radius 8, drawn 1 px off-register:
  - **One move.** Name DM Serif Display 46 → 36 at baseline 886. Damage League Gothic 84 in the **spot ink**, right-aligned to x 968, at baseline 896. Line DM Serif Display 32 → 30, ink-2, 1 line, w 700, at baseline 932.
  - A rule at y 958: 2 px kind ink at .55.
  - **Bottom row:** three columns at x 112 / 456 / 812 (w 320 / 332 / 156). Labels League Gothic 30, UPPERCASE, tracking 0.1em, ink-3, at baseline 998. Values DM Serif Display 34 → 30, ink, **up to 2 lines** (line-height 1.08), from baseline 1038. "Retreat: never" stays.
  - A hairline at y 1094 (ink .18).
  - **Card quote:** DM Serif Display Italic 34 → 30, ink-2, up to 2 lines, curly quotes, from baseline 1140.
  - **Personal line** replaces the quote, in the same box, in **ink-blue**, DM Serif Display 36 → 30, up to 2 lines: "Gifted to Priya. Separated at birth."
- **Colophon** (on the ink, under the panel): tag at `84, 1226`, stroked and lettered in cream. The address right-aligned to x 996, cream at .70.
- **Golden:** the **inked field becomes foil** inside the cream border. The series line, name and stat stamp turn ink `#1c2433`. The ribbon stays in the spot ink and starts with "GOLDEN" in League Gothic 32, cream, plus a middle dot. A foil star (r 28) sits on the photo's top-right corner, and the tag is foil. The address is ink at .72.
- **Story background:** the same dark kind ink with the hatch and grain .06; the story caption is **cream** at .92 (ink would fail on the dark).
- **Grade:** unchanged (§8.0).

### 8.3 Polaroid: "The journal page"

*The object:* an instant print taped into a dot-grid journal, captioned in marker, with notes scribbled around it. It's the scrapbook and journaling habit this audience actually has. **A journal page instead of cork** (PLAN allows "cork-board or paper"): cork drawn in code reads as brown noise, and a dot grid reads as journaling.

- **Board:** `#efe7d8`, grain .05, the **dot grid** (§4: r 2, every 40 px, ink .12).
- **The print** (see Proposed PLAN changes: 800 instead of 860): frame `#fbf8f1`, grain .03, frame box `100, 50, 880, 1020` (sides and top 40, bottom 180). Photo window `140, 90, 800, 800`, square corners, a 1 px inner shadow (ink .12). Rotated **−3° ± 1°** (seeded) around the frame's centre. Print shadow (§4).
- **Washi tape:** centred on the frame's top edge (x 540, y 50), 280×72, rotated +4° ± 3°, in the **kind ink at .42** with white stripes (§4). It overlaps the frame by about 40 px.
- **Caption** (on the frame's bottom strip, rotated with the frame): Caveat, ink `#1c2433` at .92, like a fine marker.
  - Not personalised: one line, "Larry · judging me · 9 Oct", 64 → 44, centred, baseline at strip top + 104.
  - Personalised: line 1 at 56 → 40, baseline strip top + 74; **line 2 in ink-blue**, 52 → 38, baseline strip top + 140: "Priya, found your twin" plus a **drawn heart** (24 px, 3 px stroke, ink-blue, the same path as the icon).
  - The date is "9 Oct" from `when`.
- **The two notes** (on the board, under the print, unrotated board coordinates), Caveat, ink-2:
  - note 1 (habitat): box `70, 1104, 460, 100`, 44 → 34, max 2 lines, rotated −2°
  - note 2 (catchphrase, in curly quotes): box `604, 1100, 420, 100`, 44 → 34, max 2 lines, rotated +2.5°
  - a small **hand-drawn arrow** (3 px stroke, ink-2, round caps) in the gap left of note 2: from `(572, 1160)` via `(554, 1120)` to `(598, 1094)`, pointing up at the print (points jittered ≤ 6 px by seed)
- **Colophon:** bottom right. The tag at `864, 1272, 176, 56`, the address to its left.
- **Golden:** the washi tape is **foil at .85** (stripes kept). A **gold star doodle** (a hand-drawn 5-point star as a single stroke path, 4 px, `foil.ink`, 44 px) sits right after the name in the caption. The tag is foil.
- **Story background:** the same journal board and dot grid, continued.

### 8.4 Wanted: "The handbill"

*The object:* a letterpress handbill, aged, nailed up. It's printed with care, and it's ridiculous because of what it says.

- **Paper:** `#e9d8b4`, grain .07, fibres 0.6, 3–5 **stains**, **edge burn** .22 / 90 px, **fold creases** (one horizontal, one vertical). Ink `#2a2118`, ink-2 `#4a3b2a`.
- **Nails** at `(64, 58)` and `(1016, 58)` (§4).
- **WANTED:** box `80, 56, 920, 206`, League Gothic, UPPERCASE, tracking 0.02em, **fit to the box width** (about 270 px), centred, ink, with **ink spread** and dropout .02.
- **Crime line:** box `80, 268, 920, 52`, DM Serif Display Italic 46 → 32, ink-2, centred: "for stealing hearts".
- **Photo window:** `160, 334, 760, 640`, square corners, a **3 px ink border** directly on the photo's edge, plus a 1 px ink rule 10 px outside it (a printed frame).
- **Name:** box `80, 990, 920, 86`, DM Serif Display, **UPPERCASE**, tracking 0.04em, 96 → 60, ink, centred.
- **Alias:** box `80, 1080, 920, 40`, baseline 1106, DM Serif Display Italic 38 → 28, ink-2, centred: "alias The Mayor of Lane 4"
- **A rule group** at y 1120: 1 px / 4 px / 1 px lines at 3 px gaps, ink at .85, from x 200 to 880.
- **Last seen:** baseline 1162, centred: "LAST SEEN" League Gothic 28, tracking 0.12em, ink-2, then 12 px, then the place in DM Serif Display 34 → 26, ink (`{place}` or a random habitat).
- **Reward:** baseline 1208, centred: "REWARD" League Gothic 40, tracking 0.08em, ink, then 14 px, then the reward in DM Serif Display 36 → 26, ink. (M1: the whole block moved up 6–20 px so the return stamp fits under it.)
- **Colophon:** bottom left. The tag at `64, 1262, 176, 56`, the address to its right. (Bottom-left, so the right side stays free for the return stamp.)
- **Personal stamp** ("If found, return to Priya" plus the reason line): a **rubber stamp in ink-blue** `#1f3a5f` at .88, rotated **−3°**, centred on `(806, 1284)`: bottom right, on the paper, balancing the bottom-left colophon. **Its top edge always sits below the reward line** (reward descenders end at ~1217; the stamp's highest corner is at ~1219), so it never reads as a strikethrough, even with the longest reward ("exposure (they’ll tell their friends)"); the lowest corner reaches ~1349. Max 420 wide. Line 1 League Gothic 38 → 30, UPPERCASE, tracking 0.08em. Line 2 DM Serif Display Italic 28 → 22. Double border, dropout .09 (§4); the global stamp padY is now 12. (Changed at step 2 from over the photo, where blue on sepia was ~2 : 1, and at M1 from cy 1266, where its top border struck through long rewards.)
- **Golden:** **WANTED in foil** (clip-filled, emboss, keeping the ink spread). A **"MOST WANTED" ribbon** in foil, 440×64 with **forked ends** (V cuts 18 px deep), centred at x 540, y 312–376, overlapping the photo's top edge; text League Gothic 38, UPPERCASE, tracking 0.24em, ink. The tag is foil. **M1: a deeper foil for Wanted only** (`styles.wanted.golden.foil`, same shape as `SC.PALETTE.foil`): stops `#5e4313 → #8a6420 → #b08a3a → #d6b765 (a narrow highlight) → #9c7631 → #6f5018 → #a07a2e → #674a15`, 2 light bands at .16, a 2 px emboss in `#3a2a10` at .45. Every foil fill on a golden Wanted card (word, ribbon, tag) uses it, because the standard ramp's pale highlights vanish on the tan paper. The WANTED word's dropout drops to `golden.wordDropout` .004 on gold (the specks read as tan holes).
- **Story background:** `#d9c49c` (the poster paper, darker), grain .06, stains 2.

### 8.5 Dating profile: "The personal ad"

*The object:* a profile card printed like a glossy personal-ads page from a magazine. **Not any real app:** no flame, no app name, no swipe chrome, no gradient buttons. The buttons are flat printed circles.

- **Paper:** blush `#f3e3da`, grain .03. Ink `#2b2026`, ink-2 `#5a4650`, rose `#9e3a4f`, cream `#fbf5f0`.
- **Photo window:** `36, 36, 1008, 1012` (75% of the height), **radius 36**. **The dark fade:** a gradient over the bottom 45% of the window, from ink `#2b2026` at 0 to **.72** at the bottom edge (smoothstep), so the text sits on at least .55.
- **On the fade:**
  - Name and age: box `76, 866, 760, 96`, DM Serif Display 88 → 60, cream, baseline 940: "Larry, 4".
  - Distance: baseline 990. The **drawn pin** (30 px, 3 px stroke, cream), 10 px, then League Gothic 34, UPPERCASE, tracking 0.1em, cream at .88: "1 WALL AWAY".
- **Chips:** a 2×2 grid at `36, 1064, 1008, 160`. Each chip is 496×74, gap 16, radius 37, **outlined** (2 px ink at .85, no fill). Inside, left-aligned at +28: the label in League Gothic 22, UPPERCASE, tracking 0.1em, **rose** ("GREEN FLAG"), and the value in DM Serif Display 30 → 22, ink, 1 line, on the same baseline 10 px after the label.
- **The two round buttons**, drawn at y 1240–1328: ✕ is a circle d 88 centred at x 470 (2.5 px ink stroke, a 30 px ✕ drawn with 3 px strokes); ♥ is a circle d 88 centred at x 590, filled **rose**, with a **cream drawn heart** (34 px). Flat, no shadow.
- **Colophon:** the tag at `36, 1258, 176, 56`. The address right-aligned to x 1044 on the same centre line.
- **Personal banner** (top of the photo): a cream `#fbf5f0` paper label `120, 70, 840, 128`, radius 8, rotated **−2°**, a 2 px rose inner rule inset 8 px, with a small piece of washi tape (rose at .4, 120×40) at its top-left corner. Line 1: "It's a match!" in DM Serif Display Italic 46 → 34, ink. Line 2: "Larry ♥ Priya" in DM Serif Display 40 → 30, with "Priya" in **ink-blue** and the ♥ a **drawn rose heart** (26 px). Line 3 (small): the reason in League Gothic 22, UPPERCASE, tracking 0.12em, ink-2 ("FOUND YOUR TWIN"). The label fits its 128 px height; if all three lines don't fit, line 3 drops.
- **Golden:** a **"Super cutie" seal** on the photo's top-right: a **scalloped circle** (24 scallops), d 168, centred at `(930, 150)`, filled with **foil**, a 1.5 px `foil.shadow` ring inset 10 px, and the text "SUPER" / "CUTIE" on two lines in League Gothic 30, UPPERCASE, tracking 0.12em, ink. It's like the award sticker on a prize-winning book. When personalised, the banner shifts left (x 80, w 760) so the seal stays clear. The tag is foil.
- **Story background:** `#ecd6cc`, grain .03.

### 8.6 Breaking news: "The local paper"

*The object:* the front page of a small-town daily. Very serious type, an absurd headline.

- **Paper:** newsprint `#f2efe6`, grain .06, fibres 0.4, one horizontal fold crease at about y 700. Ink `#1d1b18`, ink-2 `#45413a`, brick red `#b0412e` (the stamp only).
- **Masthead:** a rule pair at y 40 (1 px) and y 46 (3 px), from x 40 to 1040. "THE DAILY STREET" in **DM Serif Display, UPPERCASE, 84 → 64, tracking 0.06em**, centred, baseline 140 (see Proposed PLAN changes: no blackletter). A rule at y 162 (1 px).
- **Dateline row:** baseline 196, League Gothic 26, UPPERCASE, tracking 0.12em, ink-2. "THURSDAY, 9 OCTOBER 2026" on the left (x 40), "PRICE: 1 TREAT" on the right (to x 1040). A rule pair at y 212 (3 px) and y 218 (1 px).
- **Headline:** box `40, 236, 1000, 284`, League Gothic, UPPERCASE, tracking 0.01em, **150 → 88, up to 3 lines**, line-height 0.92, ink, left-aligned, with ink spread.
- **Photo window:** `40, 540, 1000, 560`, square corners, **halftone** (§4, cell 5).
- **The EXCLUSIVE stamp:** brick red at .86, rotated −8°, centred on `(900, 580)` overlapping the photo's top-right corner. League Gothic 54, UPPERCASE, tracking 0.18em, double border, dropout .09.
- **Caption:** baseline 1136, DM Serif Display Italic 28 → 24, ink-2, left x 40: "Larry, pictured, declined to comment."
- **Columns:** `40, 1156, 1000, 104`, two columns 476 wide with a 48 px gutter and a 1 px column rule (ink .25) in the middle. **Left column:** grey text bars, 10 px tall, line pitch 26, ink at .16, square ends, the last bar of each paragraph 40–80% long (seeded). **Right column:** the **pull quote**, the catchphrase in curly quotes, DM Serif Display Italic 34 → 26, ink, max 2 lines, between a 1 px rule above and below; the bars continue under it if there's room.
- **Colophon:** the tag at `40, 1278, 176, 56`. The address to its right. (Optionally "VOL. 1" League Gothic 26, ink-2, right-aligned to x 1040 on the same line: a newspaper touch, allowed because the address stays the main item.)
- **Personal headline:** the headline slot uses the style×reason line ("LOCAL CAT ASKS ABOUT PRIYA"). No extra mark, because the headline *is* the personal line.
- **Golden:** a **"SPECIAL EDITION" foil banner** across the full width, `0, 0, 1080, 56`, text League Gothic 34, UPPERCASE, tracking 0.3em, ink, centred, with a small drawn 5-point star (r 9, ink) 24 px either side. Everything below moves down 40 px, and the headline box shrinks to 244. The tag is foil.
- **Story background:** `#e4e0d4`, grain .06.

---

## 9. Voice on screen (how the words look and sit)

The content-writer writes the jokes. This section is about how UI words are set:

- **Headings are questions or plain statements, set in the serif:** "Spotted a cutie?", "Who did you spot?", "Who's this for?", "Larry is in your binder." One heading per screen.
- **One handwritten aside per screen at most** (Caveat). It's the human margin note and the only place for an extra wink. It never carries an instruction you need. **One deliberate exception:** on the Kind screen, the hint “tap your cutie” is written in Caveat on the printed photo's bottom strip, like a note on an instant print, and shows only until the first use. It's a hint, and the screen still works without it.
- **Buttons are 1–3 word verbs in sentence case:** Snap a cutie, Pick a photo, Send, Save image, New name, New personality, Edit words, Adjust photo, Done. No icons-only buttons except back, close and binder in the top bar, and those have `aria-label`s.
- **Helper text is one line, under the thing it explains,** in ink-3. Never a paragraph.
- **Deadpan beats exclamation:** the UI doesn't cheer ("Awesome!", "Yay!"). It states things like a museum would: "Larry is in your binder." The card is where the fun goes.
- **Never:** upload, process, render, filter, AI, generate, magic. Say *the card*, *styles*, *snap*, *pick*, *keep*, *send*.
- **Numbers read like a catalogue:** "Cutie #14", "14 cuties spotted · 1 golden", "#014" on cards.
- **No emoji, anywhere.** If a line needs a heart, it's a drawn heart on a card. The UI doesn't need one.
- **Errors** use the engine's friendly `title` and `detail` as they are. The title is in the serif, and there's one button.

---

## 10. The aesthetic checklist (for the ui-verifier)

Mark each PASS or FAIL against the named screenshots.

1. **The photo is the hero.** On every card, the photo window is the largest single element by area. On the result screen, the card is the largest element.
2. **Three faces max.** The UI chrome of any screen uses only DM Serif Display, the system sans and Caveat. League Gothic never appears outside a card image. No card uses more than DM Serif Display + League Gothic + Caveat.
3. **No emoji, anywhere.** None in the UI, on cards or in the reveal. Hearts, pins, dice, ✕ and rarity marks are drawn shapes.
4. **One icon set.** Every icon has the same stroke (1.75 at 24 px), round caps, no fills except dots, and no faces on animals.
5. **Gold discipline.** Gold or foil appears only on golden cards, golden binder edges and mounts, the golden reveal, and the binder's golden count. Never on a normal button, chip, tile or heading.
6. **The signature is on every card.** The notched accession tag (`#NNN` + rarity mark, 176×56 at scale 1) and the uppercase address beside it appear on all six styles, identical in construction. On golden cards the tag is foil.
7. **Card numbers are `#014`:** 3 digits, zero-padded, evenly spaced figures.
8. **Nothing collides.** No text overflows its box, overlaps another text slot or touches a photo edge (≥ 12 px clear at scale 1). The exceptions are deliberate overlaps: stamps, tape, the ribbon, the seal, the banner.
9. **Contrast.** Body text ≥ 4.5 : 1, large text and the address ≥ 3 : 1, in the screen UI and on cards (the token pairs in §2).
10. **One primary per view.** One ink-blue filled button per screen view. Selected chips are the only other ink-blue fills.
11. **Big targets.** Primary buttons 56 px, chips and icon buttons ≥ 44 px, kind tiles ≥ 96 px (110 at 390 wide).
12. **No shadow on UI panels.** Shadows appear only on physical objects: cards, prints, thumbnails, the fan.
13. **Not everything is a pill.** Pills are only buttons. Chips have 8 px corners, tiles 14 px, fields a ruled bottom line.
14. **Texture is felt, not seen.** Grain reads as paper at phone size and never as a noise filter. The UI page itself has no texture (only the binder's album page, ≤ 3%).
15. **Each style is its object at thumbnail size.** At 104 px wide in the binder, you can tell Minimal, Trading, Polaroid, Wanted, Dating and News apart by shape and colour alone.
16. **Golden is unmistakable but not loud.** At thumbnail size the foil is visible. There's no glow, neon, rainbow or particles.
17. **The personal line is there.** It sits where PLAN §5.4 says, in ink-blue (or as the headline on News), and it fits.
18. **Real typography.** Curly quotes and apostrophes, a single-character ellipsis, middle dots with spaces, en dashes. No straight quotes on screen or on cards.
19. **One big moment.** The reveal (spin, flip, stamp) is the only long animation. Every other transition is ≤ 300 ms, and nothing bounces except the stamp's single overshoot.
20. **Reduced motion.** With reduced motion on, there's no spin, flip, shimmer, fan cycling or slide: only fades.
21. **Muted colour.** No primary red, yellow or blue anywhere. Trading cards use exactly the kind ink and its spot ink in §2.3 / §8.2. No card text under 30 px on the Trading card (the address 26 and the stamp label 26 excepted).
22. **Messy photos look intentional.** The scooter cat (loud tiles and a bin), the zoomed far-away pigeon and the crow in flight look deliberate in every style. Colours are calmed, nothing is blown out or muddy, and the halftone and sepia still read as an animal.
23. **The landing is a zine cover, not a SaaS page.** The headline is left-aligned, the sample-card fan is the visual centre, there are two buttons, and there's no feature list or icon cards.
24. **The binder is an album page.** Cream page, punched holes, black corner mounts, pencil-numbered empty slots. It isn't a plain image grid.
25. **Family.** Warm paper, the serif headings, the ink-blue accent, Caveat, and the "More from Risheek" footer on the landing, Done and binder screens.

### FAIL triggers (the "Never" list). Any hit is a FAIL, with the file and the spot

- purple/blue/pink gradient backgrounds, glassmorphism or backdrop blur, neon glow, mesh blobs, "aurora" effects
- sparkles, rockets or emoji used as UI icons or decoration
- thick black cartoon outlines, comic speech bubbles, bouncy mascots, googly eyes, clipart animals, kawaii faces (including faces on the kind icons)
- game-UI chrome: health or XP bars, glossy 3D buttons, primary red/yellow/blue, Pokémon-yellow borders, energy symbols, "HP"
- the generic SaaS layout (centred hero + three feature cards with icons), drop shadows on every card or panel, everything a pill
- Inter or Roboto everywhere, or more than three typefaces on one screen
- bounce or elastic on every element, confetti, animation without purpose
- stock photos or illustration filler, lorem ipsum, the words "magic", "AI", "generate", "upload", "process", "render", "filter"

---

## Proposed PLAN changes

These are look-level decisions that touch numbers written in PLAN §5.4. None of them changes the flow, the contract (§7) or what's on any card. Rishi, please confirm or reject each.

1. **Polaroid: the photo is 800×800 instead of 860×860, and the bottom border is 180 instead of 220.** At 860 plus borders the print is 940 wide, which leaves 70 px each side of a 1080 card. There's no room for the two notes "next to the photo", the third personal line and the address without cramming. At 800, the notes sit **under** the print on the journal page, the personal line goes on the print's caption strip, and the photo is still the biggest thing on the card (44% of its area).
2. **Polaroid: a dot-grid journal page instead of cork.** PLAN already allows "cork-board or paper". Code-drawn cork reads as brown noise. A journal page is the scrapbooking habit this audience has. The story background follows it (PLAN §5.5 says "cork").
3. **News: no blackletter masthead.** A blackletter would be a 4th font family. The masthead is DM Serif Display capitals between rules, which still reads as a newspaper.
4. **Minimal: photo corners of 6 px instead of 28 px.** 28 px reads like a phone widget. 6 px reads like a printed photo or a museum postcard. The size and margin are unchanged.
5. **Grades: lower saturation and tone toward the card's ink, not up.** PLAN's Trading grade is +12% saturation. On these real photos (red-and-white tiles and a green bin behind the cat, saris and auto-rickshaws behind the cow) that makes the background shout. Trading becomes −6% saturation with the shadows toned toward the kind ink; Dating stays at +6%. Table in §8.0.
6. **The Anton → League Gothic swap** (§3.1): same role, quieter and more period-correct. Anton remains the fallback.
7. **The card number sits inside the accession tag** on all six styles. That's the shared signature PLAN asks the art director for. `#014` stays exactly as PLAN writes it.
8. **The Wanted return stamp and the personal lines are in ink-blue** (the family accent, "the sender's pen") rather than a new colour. It makes the personal touch read the same on every style.
9. **Trading card: one move instead of two** (added after Rishi's step-2 review, for legibility on stories and on the 310 px result card). The card shows `traits.moves[0]` only; `moves` still holds two, and "New personality" still rerolls them. The bottom row (weakness · threat · retreat: never) and the quote / personal line stay, with values allowed 2 lines.
10. **Trading card: no mount colour, and a second ink.** PLAN describes "a rounded card on a colour by kind" with a "thick inner border". It's now a cream-bordered card whose field is the kind ink, on the kind's dark ink, with a second spot ink for the type ribbon and the damage. A series line ("STREET CATS · NO. 001") is added on top, and the stat shows as a stamped roundel.
11. **Trading story background:** the kind's dark ink with the engraved hatch, instead of PLAN §5.5's "kind colour at 30%". The story caption is cream there.
