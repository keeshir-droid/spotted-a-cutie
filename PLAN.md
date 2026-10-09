# PLAN.md: Spotted a Cutie (Day 7)

> **Spotted a cutie? Find out who they really are.**
> Snap the street cat, the balcony pigeon, the dog outside the chai stall. Get a goofy collectible card that says who they are: *Larry · Feline, menace class · Mood: judging you*. Make it for a friend ("found your twin"), pick a style, and send it. Free, no account, no AI, nothing uploaded.

This is the single planning file for the project. A build session opened in this folder (`spotted-a-cutie/`) should need only this file, the root `../CLAUDE.md` (loaded automatically), `../shared-kit/README.md` and the agents in `.claude/agents/`.

**Status (2026-10-09):** planned, nothing built. The folder holds this file, `HANDOFF.md`, the agents, the test photos in `tests/real/` and three sample images in `assets/sample/`. Build in a separate session, starting from `HANDOFF.md`.

**Decisions made by Rishi (2026-10-09):**
- Name **Spotted a Cutie**. Folder `spotted-a-cutie/`. Address **`spotted-a-cutie.vercel.app`** (no deployment there and no GitHub repo `keeshir-droid/spotted-a-cutie` on 2026-10-09). Repo `keeshir-droid/spotted-a-cutie`, Vercel project `spotted-a-cutie`.
- **It's for animals you don't own:** street cats and dogs, pigeons, crows, squirrels, cows, monkeys. You don't need a pet.
- **The animal gets a random, goofy identity:**
  - a human name (*Larry, Kevin, Auntie Pam*)
  - a title (*Feline, menace class*)
  - a mood (*judging you*)
  - natural habitat, diet, known for, weakness, catchphrase and more
  - every line is rerollable or editable
- **The card shows the real photo** of that animal, never clipart.
- **Personalised for one friend:** "Who's this for?", a name plus a reason (*found your twin*, *your new boyfriend*, *says hi*…). Every style uses the name in its own way.
- **Portrait cards, 6 styles today:** Minimal, Trading card (our own design, not Pokémon), Polaroid, Wanted poster, Dating profile, Breaking news. Passport, Tarot and Field guide are next steps.
- **Collectible:** each card is numbered and kept in a binder on the phone. 1 in 20 cards comes out **golden**.
- **No AI identifies the animal.** The person taps what it is. All names and lines are hand-written lists (§5.3).
- **Test material:** 8 free-licensed Wikimedia Commons photos of real street animals, already in `tests/real/` with `CREDITS.md`. The 3 landing samples in `assets/sample/` are CC BY 4.0 (credit in README).
- Footer siblings: Pocket Booth, Look Up, Underline, Doodle Alive, Handwriting → Font.
- **An art-director agent designs the whole aesthetic first** (DESIGN.md, tokens, palette, a design board), before the card styles and the screens are built. Rishi approves the board. The brief: **really playful but aesthetic, not AI slop, collectible but never cartoonish** (the audience doesn't use kiddie or game-UI things). The ui-verifier checks every screen and card against DESIGN.md's aesthetic checklist.

---

## 1. Why this, and for whom

**Audience:** young (teens to 20s), expressive, non-technical people. Not developers, not content creators.

**The behaviour, which everyone already has:**
1. You pass a street cat on a scooter seat.
2. You stop and take a quick photo.
3. You send it to a friend with "CAT 😭".

It happens daily, indoors and out, with no pet and no props.

**The tiny problem:** that photo is usually far away, blurry, or next to a bin, and the message is just "look". The moment deserves more, and then it gets lost in the camera roll.

**The fix:** the photo becomes a character card, a tiny celebrity profile of a stranger animal. It's funnier to send than the photo, it's made for one specific friend, and it goes into a collection you keep adding to.

**Why people would care:**
- **It pays off a moment you already have.** You were stopping for the cat anyway.
- **People already name strangers' animals.** "The office cat", "our gali dog", "Kevin the pigeon" are everywhere. We do it instantly, and funnier.
- **It's made for one person** (*found your twin, Priya*). The winners so far (Pocket Booth, Handwriting, Look Up) were all made with or for someone.
- **It's collectible.** The binder count, the numbered cards and the golden 1-in-20 give a reason to snap the next one.
- **The share is as simple as possible:** one image and nothing to explain. The card is the whole message.

**The "aha" moment (the reel):** someone points their phone at a cat on a wall. The card flips over, the name spins like a slot machine, and it lands on **Larry**. *Mood: judging you.* Cut to the friend's reaction to "found your twin".

**Honest risks:**
- **Repetition kills the joke.** If the third cat is also Larry, it's over. We need big, funny lists (§5.3), recent-name avoidance, and a gate at M1 where Rishi reads 20 random cards.
- **Toy risk.** It could be used once. Personalisation, the binder and golden cards are there to fight this. We'll judge it from real use.
- **Strangers' animals and kindness.** Every line must be affectionate, never cruel (§5.2).

## 2. The bar

- **Funny on first read.** A stranger laughs at a random card without context.
- **Cute and postable.** Every style looks like a designed object, not an app template, even with a messy, far-away street photo.
- **Fast:** photo → tap what it is → card in under 15 seconds.
- **The photo is the hero.** Framing is easy and every style flatters a bad photo.
- **Every card carries the address** `spotted-a-cutie.vercel.app`, small and tasteful.

---

## 3. The user flow, from the reel to the next person

### Step 0: the reel
- **What the viewer sees:** a walk past a cat on a wall, then a pigeon, then a sleeping dog. For each, a quick snap, the card flips, and the name spins: *Larry. Kevin. Auntie Pam.* Then the friend's reply to *"found your twin"*.
- **Caption hook:** *"every street animal has a name. this site tells you what it is"*.
- **Getting there:** `spotted-a-cutie.vercel.app`, on screen at the end and in the bio/link sticker.

### Step 1: landing (first 3 seconds)
- **Headline:** *"Spotted a cutie?"*
- **Sub-line:** *"Snap any street cat, dog or pigeon. Find out who they really are."*
- **Sample cards:** the three samples (§6.1), cycling every 2.5 s through different styles, slightly fanned like a hand of cards.
- **Buttons:**
  - one big button, **Snap a cutie**, which opens the phone's camera
  - a clear second button, **Pick a photo**
- **Binder link** (only once a card is saved): *"My cuties (12)"*.
- **Trust line:** *"Free. No account. Your photos stay on your phone."*

### Step 2: the photo
- **Snap a cutie** is `<input type="file" accept="image/*" capture="environment">`. It opens the phone's own camera app and works in Instagram and WhatsApp in-app browsers. **No getUserMedia, no camera permission screen.**
- **Pick a photo** is the same input without `capture`, for photos already in the camera roll. Animals run away, so this matters.
- The photo is decoded on the phone (kit `decode.js`). A HEIC file or a non-image gets a friendly message.

### Step 3: "Who did you spot?"
- A 3×3 grid of big tiles, one tap each. Each tile is a simple inline-SVG line icon with a label:
  - Cat · Dog · Pigeon
  - Crow · Cow · Squirrel
  - Monkey · Other bird · Something else
- The photo shows small above the grid so people remember what they snapped.

### Step 4: the reveal (the on-camera moment)
1. A card back (our pattern, a big "?") sits on screen.
2. *"Meet…"* appears, and the name spins like a slot machine through 8–10 names from the lists, slowing over about 1.4 s, then lands on the real name.
3. The card flips (CSS 3D, 0.5 s) to show the full card in the default style, **Trading card**. Later, the last style used is remembered.
4. The rarity stamp thumps on.
5. **Golden (1 in 20):** a gold burst and a slow shimmer sweeping over the card on screen. The image itself has a gold foil look (§5.4).
6. A soft "pop" sound is optional and off by default. No audio is needed for the moment.

`&reveal=0` skips this for screenshots.

### Step 5: make it theirs (the result screen)
- **The card, big:** on-screen render at half size, tappable to view full screen.
- **Style chips** (scrolling sideways): Minimal · Trading card · Polaroid · Wanted · Dating · Breaking news. Each one is live on tap.
- **🎲 New name** and **🎲 New personality**: the second rerolls every line except the name.
- **Edit words:** a bottom sheet listing the lines the current style shows (name, title, mood, habitat…). Each line has a text field and its own 🎲.
- **Where did you spot them?** (optional, max 32 characters), placeholder *"on a scooter seat"*. Styles that show a location use it: Wanted's "Last seen", the Polaroid caption, the news dateline. Otherwise they use the random habitat.
- **Who's this for?** (optional):
  - a name field (max 16 characters, placeholder *"Priya"*)
  - 8 reason chips (§5.3)
  - the card updates live with that style's personalised line (§5.4)
- **Adjust photo:** drag and pinch inside the card's photo window (§6.3).

### Step 6: keep it and send it
In a sticky bottom bar and just above it:
- **Send** (primary): the 4:5 card image (1080×1350) through the share sheet. Android without a share sheet: download.
- **Story size:** the 1080×1920 version (§5.5).
- **Save image:** the 4:5 image, saved.
- **Every output** carries *spotted-a-cutie.vercel.app*.
- **The binder:** every send or save also keeps the card in the binder automatically, at most once per card.
- **File names:**
  - `spotted-a-cutie-<name>-<YYYY-MM-DD>.jpg`
  - `spotted-a-cutie-<name>-story-<YYYY-MM-DD>.jpg`

  The name is lower case with only a–z, 0–9 and hyphens. If it's empty, it becomes `cutie`.

### Step 7: done
- *"Larry is in your binder. Cutie #14."*
- **Buttons:** **Send to someone else** (back to "Who's this for?"), **Try another style**, **Spot another cutie**, **My cuties**.

### Step 8: the binder ("My cuties")
- **The header:** *"14 cuties spotted · 1 golden"*, plus small counts per kind: *"5 cats · 4 dogs · 3 pigeons…"*.
- **A grid of saved cards** (thumbnails in their saved style), newest first. A golden card has a gold edge.
- **Tap a card** to open it on the result screen with the same photo and words. Change the style or recipient, send it again.
- **Delete** sits on the opened card, with a confirm.
- A line under the grid: *"Your cuties live on this phone only. Clearing your browser clears them."*

### Step 9: the next person (growth loop)
- The card is made for one friend, so it gets sent to that friend, often in a group chat.
- The friend laughs and asks "what is this?". The card carries the address, which leads them to Step 1.
- The next time *they* pass a dog, it becomes *Auntie Pam*, and gets sent back.

---

## 4. Scope for today

### In
- Snap (camera app) and pick a photo, with a HEIC/not-image message.
- The 9 kinds, the reveal (name spin, flip, stamp, golden shimmer).
- **The content system:** seeded random identity per kind, recent-name avoidance, rerolls per line and for all lines, edit any line.
- **6 card styles** at 1080×1350, drawn in code from the real photo.
- "Where did you spot them?" and "Who's this for?" (name plus 8 reasons) with per-style lines.
- Photo framing (drag and pinch) inside the style's photo window.
- **Outputs:** the 4:5 card and the 1080×1920 story. Share sheet with save fallbacks, good file names.
- The binder in IndexedDB: save, list, reopen, delete, counts.
- Landing with three sample cards. Remembers the last style. "More from Risheek" footer.
- Vercel Web Analytics (page views). README with the standard sections. Live on its own address.

### Not today (goes in the README's "next steps")
- More styles: Passport / ID, Tarot, Field guide, Employee of the month, Magazine cover.
- **"Met again":** add a new sighting to an existing card ("Larry, seen ×4").
- A binder export/import file (so iPhone users don't lose it), and a shareable binder page image.
- A shimmer **video** of golden cards (the kit's video export could do it).
- A sound pack, stickers, a speech bubble you can drag.
- A link that shows the card in the browser (needs a server or a big URL).

**If the day runs short,** cut in this order:
1. the binder's per-kind counts
2. the binder's reopen (keep save and list)
3. the Dating style

The reveal and personalisation are never cut.

---

## 5. Design

### 5.1 The site's look: set by the art director in DESIGN.md
**`DESIGN.md` is the source of truth for the look.** The `art-director` agent writes it at M0, along with:
- `src/design-tokens.css`
- `src/engine/palette.js`
- `design/board.html`

PLAN.md stays the source of truth for the flow, the contract and each card style's structure.

**What the art director must work within:**
- **The brief:** really playful, but aesthetic. The jokes live in the words and the details; the design is calm and confident.
- **Not AI slop:** no gradient blobs, glassmorphism, emoji-as-icons, sparkles, or the generic hero-plus-three-cards layout.
- **Collectible, never cartoonish:** no thick outlines, mascots, game-UI chrome or Pokémon yellow. Collectibility shows up as craft: numbering, foil, stamps, edition marks, paper. References are things this audience keeps: film and instant photos, sticker sheets, zines, field notebooks, vintage trading cards, photo albums.
- **The family stays:**
  - `../shared-kit/tokens.css` underneath: warm paper, serif headings, ink-blue accent, Caveat
  - the "More from Risheek" footer
  - always light
  - this site's personality is a layer on top
- **Phone first:** 56px primary buttons, 44px chips, kind tiles at least 96px square, one-handed.
- **The UI stays quieter than the cards.** The cards and the real photos are the loudest thing on screen.
- **Icons:** the emoji written in this plan (🎲, 📍) are placeholders. DESIGN.md defines a drawn icon set that replaces them.

### 5.2 Voice and content rules
- **The site's own words** are short, playful and warm: *Spotted a cutie? · Who did you spot? · Meet… · Who's this for?*
- Never "upload", "process", "render", "filter", "AI" or "generate". Call the looks **styles** and the result **the card**.
- **Card lines** (the lists in §5.3) must be:
  - **affectionate:** these are strangers' animals, and the joke is never that an animal is ugly, sick, dirty or hurt. "Chonk" is fine; "mangy" is not.
  - **gender-neutral:** no he/she/his/her. Use the name, "they", or no pronoun. Names can be any gender; that's part of the fun.
  - **brand-free:** no brand names (say "biscuits", not a brand).
  - **global first:** everyday things everyone gets (scooters, bins, balconies, car bonnets, snacks). A light sprinkle of things that also land in India (chai stall, samosa, auto-rickshaw) is welcome, at most about 1 in 5 lines.
  - **short:** most lines are under 40 characters so they fit on cards.
  - **safe:** nothing sexual, no insults about people, no politics or religion.

### 5.3 The content system (the heart of the product)
All lists live in **`src/engine/content-data.js`**, written by the `content-writer` agent and reviewed by Rishi at M1. The logic lives in `src/engine/content.js`, written by `engine-builder`.

**The 9 kinds:**

| id | Tile label | Base rarity | Notes |
|---|---|---|---|
| `cat` | Cat | common | |
| `dog` | Dog | common | |
| `pigeon` | Pigeon | common | |
| `crow` | Crow | common | |
| `cow` | Cow | uncommon | |
| `squirrel` | Squirrel | uncommon | |
| `bird` | Other bird | uncommon | parrots, mynas, sparrows, ducks… lines stay generic to "bird" |
| `monkey` | Monkey | rare | |
| `mystery` | Something else | rare | "Mystery creature, unclassified": lines work for anything (a goat, a lizard, a snail) |

**The fields every card has.** Every field draws from that kind's list plus a shared list, about 70% kind-specific.

| Field | Example | Minimum per kind | Shared minimum |
|---|---|---|---|
| `name` | Larry | 15 | 160 human names + 40 soft names (Biscuit, Mochi, Pickle) |
| name prefix (25% chance) | Sir · Auntie · Uncle · Little · Big · Captain · Dr. · Baby · Lord · Lady | — | 15 |
| name suffix (8% chance) | Jr. · the Third · Sr. · Esq. | — | 6 |
| `title` | Feline, menace class | 12 | — |
| `mood` | judging you | 12 | 40 |
| `habitat` | the warmest car bonnet on the street | 12 | 10 |
| `diet` | biscuits, your sympathy | 8 | 8 |
| `knownFor` | screaming at 3 am | 12 | 10 |
| `weakness` | pspsps | 8 | 6 |
| `threat` | will steal your heart (and your samosa) | 8 | 6 |
| `aka` | The Mayor of Lane 4 | 10 | 6 |
| `catchphrase` | "What are you looking at?" | 12 | 8 |
| `crime` (Wanted) | for loitering on scooters | 10 | 6 |
| `reward` (Wanted) | 1 biscuit, no questions asked | — | 15 |
| `headline` (News) | LOCAL {KIND} REFUSES TO LEAVE {PLACE} | 10 templates | 6 |
| `greenFlag`, `redFlag` (Dating) | shows up daily · bites | 8 each | 8 each |
| `lookingFor`, `loveLanguage` (Dating) | snacks · ignoring you | 6 each | 8 each |
| `distance` (Dating) | 1 wall away | — | 12 |
| `moves` (Trading) | Stare · 30 · "Looks at you until you leave." | 10 per kind (name, damage 10–120, short text) | — |
| `flavour` (Trading) | "Has never once been on time." | 8 | 6 |

**Placeholders inside lines:** `{name}`, `{kind}` (CAT, PIGEON…), `{place}` (the "where" text, or a random habitat), `{to}` (the recipient's name).

**Stats (Trading card):** `chaos`, `fluff` and `sass`, each 10–100 in steps of 10, seeded. Monkeys skew chaos-high, cows skew calm. Plus `age`, 1–12 (*"Larry, 4"*), on the Dating card.

**Names and India:** if `navigator.language` ends in `-IN` (or is `hi`, `bn`, `ta`, `te`, `mr`, `gu`, `kn`, `ml`, `pa`), 25% of names come from an extra list of 40 affectionate Indian nicknames (*Pappu, Bablu, Chintu, Guddu, Munna, Pinky, Sharmaji*…). Otherwise that list is never used.

**Randomness:**
- Every card has a `seed`, and every field has its own seed, so a reroll only changes that field. Seeded random comes from the kit's `util.js`.
- **Recent names:** the generator avoids the last 40 names in the binder, and never repeats a name inside one session.
- **Rarity:** the kind's base rarity, plus `golden` at `SC.GOLDEN_CHANCE = 0.05`, rolled once when the card is created. Rerolls don't change it, and `&golden=1` forces it.

**The reasons ("Who's this for?"):**

| id | Chip |
|---|---|
| `twin` | Found your twin |
| `soulmate` | Found your soulmate |
| `boyfriend` | Your new boyfriend |
| `girlfriend` | Your new girlfriend |
| `hi` | Says hi |
| `missyou` | Reminded me of you |
| `replacement` | Your replacement |
| `meet` | Wants to meet you |

For each style × reason, `content-data.js` holds the personalised line (§5.4 shows where it goes). That's 6 × 8 = 48 lines, each using `{to}` and often `{name}`.

### 5.4 The 6 card styles (1080×1350, portrait)
The table fixes each style's **structure**: what's on the card, the photo window, where the recipient line and golden variant go. The colours, fonts, textures and finishes in it are starting points; **DESIGN.md's art direction for each style wins** (read through `SC.PALETTE`). All six must feel like one collection.

**For all styles:**
- **Drawn in code** on a canvas from the real photo. The only images are the photo and the fonts.
- **Photo window:** each style has its own. The photo fills it using the card's crop (§6.3).
- **Address:** *spotted-a-cutie.vercel.app* appears small (22–26 px, about 55% ink), placed per style.
- **Card number:** shown as `#014`.
- **Golden:** each style has a golden variant, described per style below.
- **Photo grade:** each style also has a grade (pixel maths) for the photo, so a dull street photo looks intentional.

| id | Name | Layout | Photo grade | Recipient line goes | Golden |
|---|---|---|---|---|---|
| `minimal` | Minimal | Off-white `#f7f3ec`. The photo is large (1000×900, 40 px margin, 28 px corners). Below it: the name in big display serif, the title in italic, then two lines (mood, habitat) in small caps labels. Lots of space. | Gentle lift: contrast +5%, warmth +3 | One serif-italic line under the title: *"for Priya: found your twin"* | A thin gold rule around the photo and a gold name |
| `trading` | Trading card | Our own collectible card: rounded 1000×1270 card on a colour by kind (cat amber, dog teal, pigeon slate, crow ink, cow green, squirrel rust, bird sky, monkey plum, mystery violet), with a thick inner border. Top row: name (left) and **CHAOS 90** (right). Photo window 920×600 with a bevelled frame. A type strip: *"Feline, menace class · Lv. {age}"*. Two moves, each a name, a short line and damage on the right. A bottom row: weakness · threat · "retreat: never". Flavour text in italic. The rarity mark (● common, ◆ uncommon, ★ rare) and `#014`. | Saturation +12%, contrast +8% | Replaces the flavour text: *"Gifted to Priya. Found your twin."* | Gold foil border (diagonal light bands drawn in code), a gold star mark, **GOLDEN** in the type strip |
| `polaroid` | Polaroid | A warm cork-board or paper background with soft grain. An instant photo (860×860 square, 40 px white sides and top, 220 px bottom) rotated −3°, with a soft shadow and a strip of washi tape. A handwritten Caveat caption on the bottom: *"Larry · judging me · 9 Oct"*. Next to the photo, two small handwritten notes (habitat, catchphrase) like scribbles on the board. | Instant-film fade: lifted blacks 8%, warm highlights, saturation −10%, slight vignette | A third handwritten line: *"Priya, found your twin ♥"* | Gold washi tape and a tiny gold star doodle |
| `wanted` | Wanted | Aged paper `#e9d8b4` with code-drawn stains, darker edges and a nail at each top corner. **WANTED** huge in the condensed font; *"for stealing hearts"* (the crime line). The photo (760×640) has a thin black border. Then: **LARRY**, *"alias The Mayor of Lane 4"*, *"Last seen: {place}"*, **REWARD: 1 biscuit, no questions asked**. | Sepia: luminance through a brown ramp, grain 6% | A stamped line at the bottom: *"If found, return to Priya"* (plus the reason's line) | **WANTED** in gold ink with a gold "MOST WANTED" ribbon |
| `dating` | Dating profile | A generic dating-app profile card (no real app's look or name): the photo fills the top 75% with rounded 36 px corners and a dark fade at the bottom. On the fade: **Larry, 4** and *"📍 1 wall away"*. Below, rounded chips: *Green flag: shows up daily* · *Red flag: bites* · *Looking for: snacks* · *Love language: ignoring you*. Two round buttons drawn at the bottom (✕ and ♥). | Warm, clean: warmth +4, saturation +6% | A banner across the top: **It's a match! Larry ♥ Priya**, plus the reason line small | A gold "Super cutie" badge on the photo |
| `news` | Breaking news | Newsprint `#f2efe6` with fine grain. Masthead **THE DAILY STREET** in black-letter-ish serif, a dateline *"Thursday, 9 October 2026 · Price: 1 treat"*. A huge headline from the `headline` list. The photo (1000×560) in black-and-white halftone dots. Caption: *"{name}, pictured, declined to comment."* Two short columns of grey text bars (fake article lines) with one real pull quote (the catchphrase). A red **EXCLUSIVE** stamp. | Black and white, then a halftone dot pattern (dot size 5 px) | The headline becomes the personalised one: **"LOCAL CAT ASKS ABOUT PRIYA"**-style, from the style×reason table | A gold "SPECIAL EDITION" banner over the masthead |

**Text fitting:** every text slot has a box. Text shrinks down to a minimum size, then wraps to at most the slot's line count, then gets an ellipsis. It never overflows. Captions in non-Latin scripts fall back to the system font for that text.

**Fonts** (§6.4): chosen by the art director in DESIGN.md. The default is Caveat (in the kit) plus two free OFL fonts:
- a **display serif** (DM Serif Display) for names, Minimal and the newspaper
- a **bold condensed** (Anton) for WANTED, headlines and the trading card's stats

At most 3 families, Latin woff2, about 150 KB in total. The main session downloads them at M0 with Rishi's okay.

### 5.5 The story image (1080×1920)
- **Background:** a soft colour from the style (Minimal paper, Trading kind colour at 30%, cork, aged paper, blush, newsprint), with soft grain.
- **The card:** 900×1125, centred at y 300–1425, rotated −2°, with a two-layer soft shadow.
- **Below it:** at y about 1500, inside the safe zone, *"Spotted a cutie? spotted-a-cutie.vercel.app"* in Caveat, 40 px.
- Story safe zone: everything important stays between y 270 and 1540, with 90 px side margins.

### 5.6 Screens (phone first at 390×844, one-handed)
1. **Landing:** the headline, sub-line, the sample-card fan, **Snap a cutie**, **Pick a photo**, the binder link (if any), the trust line, the footer.
2. **Kind:** the photo thumbnail, *"Who did you spot?"*, the 3×3 tiles.
3. **Reveal:** the card back, *"Meet…"*, the name spin, the flip, the stamp, the golden burst.
4. **Result:**
   - the card
   - the style chips
   - 🎲 New name · 🎲 New personality · Edit words · Adjust photo
   - the "where" field
   - "Who's this for?" (name plus reason chips)
   - a sticky bar with **Send** (primary) · **Save image**, and **Story size** above the bar
5. **Edit words:** a bottom sheet with a field and a 🎲 per line.
6. **Adjust photo:** the card's photo window big, with drag and pinch, and **Done**.
7. **Done:** see Step 7.
8. **Binder:** the counts and the grid. Opening a card goes to Result.
9. **Errors** (one friendly message, one button): not an image, HEIC, export failed, binder storage blocked (the card still works; it just isn't kept).

**Desktop:** the same screens centred in a 480 px column.

---

## 6. Tech

Plain HTML, CSS and JavaScript, no build step, no framework, **no libraries**. Classic scripts attach to `globalThis.SC`. Every engine file must load in Node without touching `document`, `window` or `navigator` at load time.

### 6.1 Files

```
spotted-a-cutie/
├── index.html
├── assets/
│   └── sample/           cat.jpg, dog.jpg, dog-sleeping.jpg (CC BY 4.0, ≤1200 px, ≤200 KB; credit in README; already made)
├── fonts/                caveat-600.woff2 + OFL.txt (from ../shared-kit/fonts/), plus the 2 fonts from M0 with their OFL.txt
├── DESIGN.md             art-director: the aesthetic (concept, palette, type, texture, icons, motion, screens, card art direction, the aesthetic checklist)
├── design/
│   └── board.html        art-director: the design board (never deployed)
├── src/
│   ├── app.js            site-builder: screens, state, events; MAKER_NAME + SIBLINGS + footer from ../shared-kit/footer/
│   ├── design-tokens.css art-director: the site's --sc-* tokens and @font-face (loaded before styles.css)
│   ├── styles.css        site-builder: starts from ../shared-kit/tokens.css + ../shared-kit/footer/footer.css, then uses design-tokens.css
│   └── engine/
│       ├── util.js       engine-builder, from ../shared-kit/engine/util.js; UL → SC; constants block replaced with §7.3
│       ├── palette.js    art-director: SC.PALETTE, every colour, font and texture value the cards use
│       ├── decode.js     engine-builder, from the kit; UL → SC; DEFAULT_MAX_SIDE 1600
│       ├── content-data.js  content-writer: every list in §5.3 and the style×reason lines
│       ├── content.js    engine-builder: generate, reroll, fill placeholders, recent-name avoidance, locale names
│       ├── photo.js      engine-builder: photo object, auto-crop, clamp, draw crop
│       ├── grade.js      engine-builder: the 6 photo grades + halftone
│       ├── art.js        engine-builder: code-drawn textures (paper grain, stains, cork, tape, nails, foil bands, stamps, rarity marks)
│       ├── text.js       engine-builder: font loading, text fitting in boxes, wrapping, the system-font fallback
│       ├── styles.js     engine-builder: the 6 card layouts (photo window, draw function, grade id per style)
│       ├── card.js       engine-builder: the card object, render cache, story scene
│       ├── binder.js     engine-builder: IndexedDB save / list / get / remove / count / recent names
│       ├── sample.js     engine-builder: the three landing sample cards (fixed seeds, kinds, styles, crops)
│       ├── export.js     engine-builder: JPEG files, fileName (pattern from ../shared-kit/engine/export.js, no video)
│       └── share.js      engine-builder, from the kit; UL → SC; fallback name "spotted-a-cutie"
├── tests/                never deployed
│   ├── real/             the 8 Wikimedia test photos + CREDITS.md (gitignored; already here)
│   ├── cards.html        engine-builder: the M1 test page (§7.4)
│   ├── engine/           engine-builder: Node tests (content: 200 cards with no empty fields, no unfilled {placeholders}, no he/she, lengths; fileName; crop clamp)
│   ├── smoke.js          integrator (pattern from ../look-up/tests/smoke.js)
│   ├── page-check.js, cdp.js   integrator (adapt ../look-up/tests/page-check.js and cdp.js)
│   └── out/              test output (gitignored)
├── shots/                ui-verifier screenshots (gitignored)
├── notes/
├── README.md, VERIFY.md
├── .gitignore, .vercelignore, .gitattributes, vercel.json   copy from ../pocket-booth/ (fix project-specific lines)
```

**Copy, never link.** Never edit anything outside `spotted-a-cutie/`. If a kit file needs a fix, report it; the main session updates `../shared-kit/` with Rishi's okay.

**Script order in `index.html`:**
`util, palette, decode, content-data, content, photo, grade, art, text, styles, card, binder, sample, export, share`, then `app.js`.

**Stylesheets:** `src/design-tokens.css` then `src/styles.css`.

### 6.2 Speed targets (mid-range Android; Rishi's PC is several times faster)
- **Style change or reroll on screen:** under about 250 ms. Render on screen at scale 0.5 (540×675). Full 1080×1350 only for outputs.
- **Cache:** the graded photo per style at the window size, so a text reroll only redraws text and art. Cache the static art (paper, stains, cork) per style and seed.
- **Send:** make the 4:5 file 300 ms after the last change, so Send is instant.
- **Story:** made on tap. If it's not ready inside the tap, the button becomes **Share now** for a second tap (iOS).
- **The name spin** runs in the DOM, not on the canvas.

### 6.3 The photo and framing
- **Decode:** `SC.decode.fileToImageData(file, { maxSide: 1600 })`.
- **Crop:** `{ cx, cy, zoom }`.
  - `cx` and `cy` are the centre, 0–1 of the photo.
  - `zoom` is at least 1, relative to the cover fit of the *window being drawn*.
  - The same crop works in every style's window. A different aspect just shows a little more or less.
- **Auto-crop:** centred horizontally, 45% from the top, zoom 1.15. Street animals are usually a bit small in the frame, and a little zoom helps.
- **Adjust photo:**
  - draws the current style's window big, with drag and pinch (pointer events)
  - clamps so the window is always covered
  - zooms up to 4×, so a far-away pigeon can fill the window (the M1 test: `06-pigeon-balcony-taxila.jpg`)

### 6.4 Fonts
- **Faces:** the families in DESIGN.md (default Caveat 600 from the kit, DM Serif Display 400, Anton 400). Each is self-hosted woff2 in `fonts/` with its OFL licence, loaded with `FontFace` before the first render (`SC.text.ready()`).
- **Fallback:** if a font fails, cards still render with system serif or sans.
- **Download:** the main session downloads the two new fonts at M0 from the Google Fonts GitHub repository (`github.com/google/fonts`, OFL folder) with Rishi's okay. Each is subset to Latin (Python fontTools if available; otherwise use the full file if it's under 80 KB).

### 6.5 The binder (IndexedDB)
- **Database:** `spotted-a-cutie`, store `cards`, key `id`.
- **What's saved per card:**
  - `id`, `number`, `createdAt`
  - `kind`, `golden`, `seed`, the `traits` (all lines, including edits)
  - `style`, `place`, `to: { name, reason }`, `crop`
  - **`photo`:** a JPEG blob of the original photo scaled to 1200 px on the long side, quality 0.85
  - **`thumb`:** a JPEG blob of the card at 360×450
- **Numbering:** `number` = the highest saved number + 1, so deleted numbers aren't reused. A new, unsaved card shows the next number.
- **If IndexedDB is unavailable** (some private modes): the binder is hidden, cards still work, and one gentle line explains why.
- **Privacy:** this is the only place a photo is kept, and it's on the phone. The landing trust line and the binder line say so.

### 6.6 Saving, sharing and remembering
- **Share and story images:** JPEG quality 0.92.
- **Share the file only,** with no text. The image carries the address.
- **Remembered** in `localStorage` (try/catch): the last style. Nothing else.

---

## 7. The contract between screens and engine

Four builders work at once (§8). **This section keeps them in step.** Names, inputs and results must match exactly.

### 7.1 Who owns what
| Owner | Files |
|---|---|
| art-director | `DESIGN.md`, `design/`, `src/design-tokens.css`, `src/engine/palette.js`, `shots/board-*.png` |
| site-builder | `index.html`, `src/app.js`, `src/styles.css` |
| engine-builder | `src/engine/` except `content-data.js` and `palette.js`; `tests/cards.html`; `tests/engine/` |
| content-writer | `src/engine/content-data.js`, `notes/content-sample.md` |
| integrator | small fixes anywhere; `fonts/` (copying), `tests/smoke.js`, `tests/page-check.js`, `tests/cdp.js`, `.gitignore`, `.vercelignore`, `.gitattributes`, `vercel.json` |
| ui-verifier | `VERIFY.md`, `shots/` |
| main session | downloads (fonts), `assets/`, `tests/real/`, git, GitHub, Vercel, `README.md`, `../shared-kit/`, root `../README.md` and `../CLAUDE.md` |

### 7.2 Errors
Engine functions reject with `Error` objects carrying `{ code, title, detail }`, where `title` and `detail` are friendly and ready to show.

Codes:
- `not-image`, `heic`, `unreadable`
- `export-failed`
- `binder-unavailable`: *"This browser won't keep your cuties."* / *"Your card still works. Send or save it so you don't lose it."*
- `cancelled`, which the site ignores

### 7.3 Names
**Constants**
- `SC.KINDS = [{ id: "cat", name: "Cat", rarity: "common" }, { id: "dog", name: "Dog", rarity: "common" }, { id: "pigeon", name: "Pigeon", rarity: "common" }, { id: "crow", name: "Crow", rarity: "common" }, { id: "cow", name: "Cow", rarity: "uncommon" }, { id: "squirrel", name: "Squirrel", rarity: "uncommon" }, { id: "monkey", name: "Monkey", rarity: "rare" }, { id: "bird", name: "Other bird", rarity: "uncommon" }, { id: "mystery", name: "Something else", rarity: "rare" }]`
- `SC.STYLES = [{ id: "minimal", name: "Minimal" }, { id: "trading", name: "Trading card" }, { id: "polaroid", name: "Polaroid" }, { id: "wanted", name: "Wanted" }, { id: "dating", name: "Dating" }, { id: "news", name: "Breaking news" }]`
- `SC.REASONS = [{ id: "twin", label: "Found your twin" }, { id: "soulmate", label: "Found your soulmate" }, { id: "boyfriend", label: "Your new boyfriend" }, { id: "girlfriend", label: "Your new girlfriend" }, { id: "hi", label: "Says hi" }, { id: "missyou", label: "Reminded me of you" }, { id: "replacement", label: "Your replacement" }, { id: "meet", label: "Wants to meet you" }]`
- `SC.DEFAULTS = { style: "trading" }`
- `SC.CARD = { w: 1080, h: 1350 }`
- `SC.STORY = { w: 1080, h: 1920, card: { x: 90, y: 300, w: 900, h: 1125, rotate: -2 } }`
- `SC.GOLDEN_CHANCE = 0.05`
- `SC.LIMITS = { name: 20, place: 32, to: 16, line: 60 }`
- `SC.PALETTE`: written by the art director in `palette.js`; its shape is documented at the top of that file. The card engine reads every colour, font, size and texture strength from it, never hard-coding them.

**Content** (`content-data.js` exposes `SC.CONTENT_DATA`; `content.js` exposes `SC.content`)
- `SC.CONTENT_DATA`: `{ shared: {...}, kinds: { cat: {...}, ... }, desiNames: [...], recipient: { <styleId>: { <reasonId>: "line with {to} and {name}" } } }`. The exact shape is in `.claude/agents/content-writer.md` and must be followed by both sides.
- `SC.content.FIELDS = [{ id: "name", label: "Name" }, { id: "title", label: "Title" }, { id: "mood", label: "Mood" }, { id: "habitat", label: "Natural habitat" }, { id: "diet", label: "Diet" }, { id: "knownFor", label: "Known for" }, { id: "weakness", label: "Weakness" }, { id: "threat", label: "Threat level" }, { id: "aka", label: "Also known as" }, { id: "catchphrase", label: "Catchphrase" }, { id: "crime", label: "Wanted for" }, { id: "reward", label: "Reward" }, { id: "headline", label: "Headline" }, { id: "greenFlag", label: "Green flag" }, { id: "redFlag", label: "Red flag" }, { id: "lookingFor", label: "Looking for" }, { id: "loveLanguage", label: "Love language" }, { id: "distance", label: "Distance" }, { id: "flavour", label: "Card quote" }]`
- `SC.content.generate(kind, { seed, recent, locale }) → traits`: a plain object with every field id above, plus `age`, `stats: { chaos, fluff, sass }`, `moves: [{ name, damage, text }, { … }]` and `seeds: { <field>: number }`
- `SC.content.reroll(traits, fieldOrAll, { kind, recent, locale }) → traits`: a new object. `"all"` rerolls everything except `name`. `"moves"` and `"stats"` are valid too.
- `SC.content.fill(text, { name, kind, place, to }) → string`: replaces the placeholders
- `SC.content.recipientLine(styleId, reasonId, { name, to }) → string`
- `SC.content.fieldsFor(styleId) → [fieldId]`: the lines that style shows, for the Edit sheet

**Photos**
- `SC.decode.fileToImageData(file, { maxSide }) → Promise<ImageData>`
- `SC.photo.from(imageData) → Photo`, with `photo.width`, `photo.height`, `photo.canvas`
- `SC.photo.autoCrop(photo) → { cx, cy, zoom }`
- `SC.photo.clampCrop(photo, crop, aspect) → crop`
- `SC.photo.drawCrop(canvas, photo, crop)`: un-styled, sized to the canvas, for the Adjust screen

**The card**
- `SC.text.ready() → Promise<void>`
- `SC.card.create({ photo, crop, kind, traits, style, golden, number, place, to: { name, reason }, when }) → Promise<Card>`
  - `card.settings`: everything above except the photo
  - `card.update(partial) → Promise<void>`: any of crop, traits, style, place, to, number
  - `card.render(scale, format) → HTMLCanvasElement`, where `format` is `"card"` (1080×1350·scale) or `"story"` (1080×1920·scale); cached per settings and scale
  - `card.window(style?) → { x, y, w, h, radius, rotate }`: the photo window at scale 1, for the Adjust screen
  - `card.data() → object`: serialisable, without the photo
- `SC.card.fromSaved(saved) → Promise<Card>`

**Binder**
- `SC.binder.available() → Promise<boolean>`
- `SC.binder.save(card, { id? }) → Promise<id>`: updates if `id` is given
- `SC.binder.list() → Promise<[{ id, number, name, kind, golden, style, createdAt, thumbUrl }]>`, newest first
- `SC.binder.get(id) → Promise<saved>`
- `SC.binder.remove(id) → Promise<void>`
- `SC.binder.stats() → Promise<{ total, golden, byKind: { cat: n, ... }, nextNumber }>`
- `SC.binder.recentNames(n) → Promise<[string]>`

**Export, sample, share**
- `SC.export.image(card, format) → Promise<File>`: JPEG, `format` `"card"` | `"story"`
- `SC.export.fileName(card, format) → string` (§3 Step 6)
- `SC.sample.load() → Promise<[Card]>`: three cards (the cat in Trading, the dog in Wanted, the sleeping dog in Polaroid; fixed seeds)
- `SC.share.platform()`, `SC.share.canShare(file)`, `SC.share.share(file)`, `SC.share.save(file)`: as in the kit

### 7.4 Dev shortcuts in the address (for checks and screenshots)
- `?sample=1`: start on the result screen with the first sample card
- `&screen=landing|kind|reveal|result|edit|adjust|done|binder|frame|error-not-image|error-heic|error-binder`
- `&style=<id>&kind=<id>&seed=<n>&golden=1&place=...&to=Priya&reason=twin&number=14&when=<ms>`
- `&format=card|story` with `screen=frame`: draw that one output full size on a canvas and stop
- `&reveal=0`: skip the reveal animation
- **`tests/cards.html?set=real`:** every photo in `tests/real/` (auto-cropped; the pigeon also zoomed 3× on the bird) as a grid of all 6 styles at scale 0.5. There's a row of golden versions for one photo, and a row with `to=Priya&reason=twin`. Plus the render timings.
- **`tests/cards.html?set=real&photo=<file>&style=<id>&scale=1`:** one card at full size.
- **`tests/cards.html?set=content&n=20`:** 20 random cards as plain text (kind, every field, the recipient line), for Rishi's read-through.
- The site keeps `window.__cutie = { screen, card, settings, binderCount }` current.

---

## 8. Milestones (check on a phone-sized screen after each)

**M0. The aesthetic (art-director first; about 1 h; Rishi approves twice).**
- The test photos and samples are already in place (2026-10-09).
- **Step 1, art-director:** writes `DESIGN.md`. It covers:
  - the concept, palette, type, texture, icons and motion
  - every screen
  - the art direction of all 6 card styles
  - the aesthetic checklist
  - the font list

  **The content-writer starts at the same time** (it doesn't depend on the look).
- **Rishi reads DESIGN.md's concept and says go or adjust.**
- **Fonts (main session):**
  - show Rishi the font list (family, weights, the `github.com/google/fonts` `ofl/` folder, size) and download with his okay
  - convert and subset to Latin woff2 (Python fontTools if it's installed; ask before installing anything) into `fonts/`, with each OFL.txt
  - copy Caveat and its OFL.txt from `../shared-kit/fonts/`
- **Step 2, art-director:**
  - writes `src/design-tokens.css`, `src/engine/palette.js` and `design/board.html`
  - screenshots the board and self-critiques it (up to 3 rounds)
- **Rishi looks at the board and approves the look.** If not, the art director revises before anything else is built.

**M1. The card and the words: go / no-go (about 2 h).**
- **engine-builder:**
  - builds `util`, `decode`, `content` (logic), `photo`, `grade`, `art`, `text`, `styles` (all 6), `card` and `tests/cards.html`
  - follows DESIGN.md and reads every visual value from `SC.PALETTE`
  - checks every test photo in every style
  - until `content-data.js` exists, uses a tiny stand-in list in `tests/`
- **content-writer:** finishes `content-data.js` (every list in §5.3, the 48 recipient lines) and `notes/content-sample.md` (20 random cards in plain text).
- **ui-verifier, aesthetic pass on the cards only:** judges the M1 card screenshots against DESIGN.md's checklist before Rishi sees them. FAILs go back to engine-builder.
- **Show Rishi:**
  - full-size cards: the cat on the scooter in all 6 styles
  - the far-away pigeon after zooming
  - one golden Trading card
  - one personalised card per style (`to=Priya`)
  - the 20 random cards as text
- **Rishi decides:** are the cards cute and postable, and are the words actually funny? He edits or adds lines in `content-data.js` himself if he likes (recommended: 10–20 lines in his own voice). If not go, fix the cards or the words before anything else.

**M2 + M3 in parallel (about 1.5 h).**
- engine-builder: `binder`, `sample`, `export`, `share`, plus the story scene and Node tests.
- site-builder: every screen in §5.6, the reveal, the edit sheet, the adjust screen and the binder, using the §7 names, built to DESIGN.md with `design/board.html` as the visual reference.

**Join (integrator):** smoke and page checks passing.

**Verify (ui-verifier):** writes `VERIFY.md` with two layers:
- **Function:** does it work
- **Aesthetic review:** every screen and card scored against DESIGN.md's checklist and the "Never" list

**The fix loop runs until both layers are clean.** Function FAILs go to the integrator. Aesthetic FAILs go to the site-builder (screens) or engine-builder (cards). The art director is consulted if a fix needs a design decision.

**M4. Phone test.**
- There's no camera API, so Rishi can test on his phone over home Wi-Fi first: `http://<PC's IP>:8000`, with the phone on the same network. Snap with the camera app, pick a photo, reveal, styles, Send, binder.
- Then, with Rishi's okay:
  - `git init`
  - create the repo
  - deploy to Vercel (`spotted-a-cutie`)
- Test from a real Instagram/WhatsApp link on both phones.

**M5. Ship (main session, with Rishi's okay at each step).**
- Turn on Web Analytics.
- README with the standard sections, a demo GIF, and the sample photos' credit.
- Rishi marks the real-phone rows "tested by hand" in `VERIFY.md`.
- **Root updates:**
  - `../README.md` gets the Day 7 row
  - `../CLAUDE.md` "Where we are" gets Day 7 live
- **With Rishi's okay:** add Spotted a Cutie to `../shared-kit/footer/siblings.js` and to the earlier sites' footers.

---

## 9. Risks and what we do about them

| Risk | Plan |
|---|---|
| The words aren't funny, or repeat | Big lists, per-kind lines, recent-name avoidance; Rishi reads 20 random cards at M1 and adds his own lines |
| It looks like AI slop or a kids' game | The art director sets the look first with a "Never" list; Rishi approves the board; the ui-verifier's aesthetic layer fails anything generic or cartoonish |
| Cards look like app templates | Each style has a strong real-world reference (instant photo, poster, newspaper, collectible card); judged at full size on messy real photos at M1 |
| Far-away or blurry street photos look bad | Zoom up to 4× in Adjust; every style has a grade (sepia, halftone, instant film) that flatters soft photos; tested on the pigeon and the crow in flight |
| Looks like Pokémon or a real dating app | Our own layouts, names and marks; no yellow Pokémon border, energy symbols, flame logo or app names |
| Something unkind about an animal or a person slips into the lists | The §5.2 rules; a Node test scans for he/she and a short banned-word list; Rishi's read at M1 |
| iPhone clears the binder | The binder line says so; Send/Save keep a copy in Photos; an export file is in next steps |
| Share sheet needs a fresh tap on iOS | The 4:5 file is made ahead; the story becomes **Share now** if needed |
| Low-end Android slow on reroll | Half-size render, cached graded photo and art (§6.2) |

## 10. Definition of done

On top of the root `../CLAUDE.md` checklist:
- [ ] Rishi approved the design board (M0) and finds the cards cute and the words funny on real street photos (M1)
- [ ] VERIFY.md's aesthetic review is clean: playful, tasteful, not cartoonish, nothing from DESIGN.md's "Never" list
- [ ] Snap → tap kind → reveal → Send works on a real iPhone (Safari) and a real Android (Chrome), and from an Instagram link
- [ ] All 6 styles look right on real photos, including personalised and golden versions
- [ ] The 4:5 card looks good in WhatsApp and Instagram DMs; the story image posts inside the safe zones
- [ ] The binder keeps, lists and reopens cards on both phones
- [ ] Address on every output; "More from Risheek" footer; analytics on
- [ ] README (with the sample photos' credit and a demo GIF), live address, root README and CLAUDE.md updated
