/* src/engine/palette.js: SC.PALETTE, every visual value the card engine needs.
   Owner: art-director (see DESIGN.md, "The Footpath Museum"). The engine reads from here and never
   hard-codes a colour, font, size or texture strength. If this file and DESIGN.md disagree, this file wins.
   Classic script. Loads in Node: touches nothing but globalThis.SC.

   UNITS: pixels on the 1080x1350 card at scale 1 (multiply by `scale` when rendering smaller).
   Colours are "#rrggbb"; when a value needs transparency it sits next to it as `alpha` (0..1).
   Tracking is in em (multiply by the font size). Sizes written [max, min] mean "fit": shrink from max to min,
   then wrap to `lines`, then ellipsis (…). Angles are in degrees.

   SHAPE
   SC.PALETTE = {
     version,
     fonts: { serif, serifItalic, gothic, hand }      each { family, weight, style, fallback, file }
                                                      canvas font = `${style} ${weight} ${px}px "${family}", ${fallback}`
     ink: { personal, cream, black }                  shared inks (personal = the sender's ink-blue)
     ui: {...}                                        the screen palette (mirrors design-tokens.css), for the story scene and DOM bits
     kinds: { <kindId>: { label, ink, tint, dark, story, spot, cream } }   the 9 printed inks; spot = the Trading card's second ink
     foil: { shadow, base, light, hi, ink, angle, stops:[[t, hex]], bands, brushed, emboss, alpha }
     rarity: { common|uncommon|rare|golden: { shape, ... } }         the marks (drawn shapes, never glyphs)
     tag: {...}                                       the accession tag (the shared signature) incl. the number treatment
     address: {...}                                   the colophon address beside the tag
     texture: {...}                                   recipes: grain, fibres, inkSpread, dropout, misregistration,
                                                      stamp, washi, cornerMount, nail, stains, edgeBurn, crease,
                                                      dotGrid, halftone, vignette, printShadow
     grades: { <styleId>: { contrast, saturation, warmth, lift, split, ramp, gamma, grain, vignette, halftone } }
     story: { caption: {...} }                        the line under the card on the 1080x1920 story
     styles: { <styleId>: Style }
   }

   Style = {
     name, object,                         a label and the real object it imitates
     paper, ink, ink2, ink3, accent,       the style's own palette (accent may be "kind" = the kind ink)
     texture: { grain, ... },              strengths for this style (0..1 alphas unless named otherwise)
     window: { x, y, w, h, radius, rotate?, ... },   the photo window (card.window() returns x,y,w,h,radius,rotate)
     slots: { <slotId>: Slot },            every text slot
     parts: { ... },                       style-specific drawn parts (frames, ribbons, chips, buttons…)
     colophon: { tag: { x, y }, address: { align, x, onDark? } },
     personal: { ... },                    where and how the recipient line sits
     golden: { ... },                      what changes on a golden card
     storyBg: { color, grain, ... },       the story image background
     swatch: { ... }                       the 14x18 mini card in the UI style chip
   }

   Slot = { x, y, w, h,                   the box (text never leaves it)
            font: "serif"|"serifItalic"|"gothic"|"hand",
            size: [max, min],             px at scale 1 (a single number = fixed)
            lines,                        max lines (default 1)
            lineHeight,                   multiple of size (default 1.1)
            baseline,                     y of the first baseline (absent: vertically centre the cap height in the box)
            align: "left"|"center"|"right",
            color, alpha,                 alpha default 1
            tracking,                     em, default 0
            upper,                        true = UPPERCASE the text
            quotes,                       true = wrap in curly quotes “…”
            rotate,                       degrees around the box centre (default 0)
            inkSpread }                   true = draw the ink-spread second pass (texture.inkSpread)
*/
(function () {
  var SC = globalThis.SC = globalThis.SC || {};

  var CREAM = "#f8f1e2";
  var PERSONAL = "#1f3a5f";
  var INK = "#1c2433";

  var FOIL = {
    shadow: "#7a5a1c",
    base: "#b8913f",
    light: "#e3c77a",
    hi: "#f6e7b8",
    ink: "#8a6420",           /* gold text on light paper */
    angle: 28,                /* the ramp runs top-left -> bottom-right across the shape's bounding box */
    stops: [[0, "#7a5a1c"], [0.16, "#b8913f"], [0.33, "#e3c77a"], [0.41, "#f6e7b8"], [0.50, "#c9a24f"], [0.64, "#9c7631"], [0.80, "#d9b866"], [1, "#8a6420"]],
    bands: { count: 3, color: "#fff6d8", alpha: 0.30, widthMin: 0.03, widthMax: 0.07, angle: 118 }, /* canvas rotate() angle (y down): "/" bands, parallel to the ramp's colour stripes. width = fraction of the box diagonal; positions seeded */
    brushed: { every: 3, width: 1, color: "#ffffff", alpha: 0.06 },   /* horizontal hairlines */
    emboss: { dx: 1, dy: 1, color: "#7a5a1c", alpha: 0.5 },          /* for foil TEXT: drawn first, under the clip-filled text */
    textOn: INK                                                         /* text sitting on a foil fill */
  };

  SC.PALETTE = {
    version: 1,

    fonts: {
      serif:       { family: "DM Serif Display", weight: 400, style: "normal", fallback: "Georgia, \"Times New Roman\", serif", file: "fonts/dm-serif-display-400.woff2" },
      serifItalic: { family: "DM Serif Display", weight: 400, style: "italic", fallback: "Georgia, \"Times New Roman\", serif", file: "fonts/dm-serif-display-400-italic.woff2" },
      gothic:      { family: "League Gothic", weight: 400, style: "normal", fallback: "\"Arial Narrow\", \"Roboto Condensed\", Impact, sans-serif", file: "fonts/league-gothic-400.woff2" },
      hand:        { family: "Caveat", weight: 600, style: "normal", fallback: "\"Segoe Print\", \"Bradley Hand\", cursive", file: "fonts/caveat-600.woff2" },
      /* Glyph notes: none of the three has ♥ ★ ◆ ✕ (draw them). All have ’ ‘ “ ” … – — · # ×.
         League Gothic's figures are proportional (0.24–0.36 em): see tag.number.cell. */
      nonLatinFallback: "system-ui, sans-serif"
    },

    ink: { personal: PERSONAL, cream: CREAM, black: INK },

    ui: {
      paper: "#f6f2ea", stock: "#fffdf8", album: "#efe8da", ink: INK, ink2: "#3a4252", ink3: "#5f5c55",
      line: "#e6dfd1", line2: "#cbbfa8", accent: "#1f3a5f", accent2: "#2a4a78", accentSoft: "#e7edf6",
      gold: "#b8913f", goldInk: "#8a6420", bad: "#a33a2b",
      /* PIVOT 2 (UI only, not used by any card): the Scrapbook craft inks, mirrors --sc-craft-* in design-tokens.css */
      craft: { tomato: "#d4553a", tomatoDeep: "#b5432c", marigold: "#e8a83e", sky: "#6ea7cc", leaf: "#7ea35b", rose: "#e2898c", lilac: "#a897c9", kraft: "#c8a679", note: "#f4d97a" },
      kindTape: { cat: "#e8a83e", dog: "#7ea35b", pigeon: "#a897c9", crow: "#6ea7cc", cow: "#7ea35b", squirrel: "#d4553a", monkey: "#e2898c", bird: "#6ea7cc", mystery: "#a897c9" },
      cardBack: { field: "#1f3a5f", line: CREAM, hatchAlpha: 0.07, hatchEvery: 6, rule1: { inset: 10, alpha: 0.7 }, rule2: { inset: 14, alpha: 0.35 }, plate: { w: 168, h: 112, cut: 10, color: CREAM } }
    },

    /* The nine printed inks. tint = ink at 20% over paper; dark = ink x 0.65; story = ink at 30% over paper.
       spot = the Trading card's second ink (brick #a84a2c or teal), chosen for hue contrast with the kind ink.
       Cream on every ink and every spot is >= 4.6:1; spot on cream >= 5:1. "kindSpot"/"kindDark" in a style = these. */
    kinds: {
      cat:      { label: "Burnt ochre",    ink: "#9a5f22", tint: "#e4d5c2", dark: "#643e16", story: "#dac6ae", spot: "#2f6a68", cream: CREAM },
      dog:      { label: "Bottle teal",    ink: "#2f6a68", tint: "#ced7d0", dark: "#1f4544", story: "#bac9c3", spot: "#a84a2c", cream: CREAM },
      pigeon:   { label: "Slate",          ink: "#4f5d6e", tint: "#d5d4d1", dark: "#333c48", story: "#c4c5c5", spot: "#a84a2c", cream: CREAM },
      crow:     { label: "Blue-black",     ink: "#2a2b33", tint: "#cdcac5", dark: "#1b1c21", story: "#b9b6b3", spot: "#a84a2c", cream: CREAM },
      cow:      { label: "Moss",           ink: "#4c6b3c", tint: "#d4d7c7", dark: "#314627", story: "#c3c9b6", spot: "#a84a2c", cream: CREAM },
      squirrel: { label: "Rust",           ink: "#9b4a2c", tint: "#e4d0c4", dark: "#65301d", story: "#dbc0b1", spot: "#2f6a68", cream: CREAM },
      bird:     { label: "Dusty cerulean", ink: "#3c6e8f", tint: "#d1d8d8", dark: "#27485d", story: "#becacf", spot: "#a84a2c", cream: CREAM },
      monkey:   { label: "Plum",           ink: "#6e3b55", tint: "#dbcdcc", dark: "#482637", story: "#cdbbbd", spot: "#3d6f6a", cream: CREAM },
      mystery:  { label: "Aubergine",      ink: "#5a4e7c", tint: "#d7d1d4", dark: "#3b3351", story: "#c7c1c9", spot: "#3d6f6a", cream: CREAM }
    },

    foil: FOIL,

    /* Rarity marks: drawn shapes, centred on (cx, cy), in the style's ink (foil when golden). Sizes at scale 1. */
    rarity: {
      common:   { shape: "circle", d: 18 },
      uncommon: { shape: "diamond", w: 18, h: 18 },
      rare:     { shape: "star", points: 5, outer: 11, inner: 4.6 },
      golden:   { shape: "star", points: 5, outer: 11, inner: 4.6, ring: { r: 14, width: 1.5 }, fill: "foil" }
    },

    /* THE SIGNATURE: the accession tag, identical on all six styles. (x, y) of the top-left comes from each style's colophon. */
    tag: {
      w: 176, h: 56, radius: 6,
      notch: { r: 9 },                       /* a semicircle cut into the middle of each short end */
      stroke: 2.5,                           /* in the style's ink (or colophon.tag.color), inside transparent */
      dropout: 0.03,                         /* texture.dropout applied to the stroke */
      mark: { cx: 26, size: 18 },            /* the rarity mark's centre x from the tag's left edge; vertically centred */
      number: {
        x: 48,                               /* left edge of the first cell, from the tag's left */
        font: "gothic", size: 38, tracking: 0.04,
        prefix: "#", pad: 3,                 /* #014; 4 digits past 999 */
        cell: 0.37,                          /* each digit centred in a fixed 0.37em cell: League Gothic has proportional figures */
        hashCell: 0.62,                      /* the # gets its own wider cell */
        nudgeY: 1                            /* optical: cap-height centring, then 1 px down */
      },
      golden: { fill: "foil", stroke: FOIL.shadow, text: INK, mark: INK }
    },

    /* The colophon address, beside the tag on the tag's vertical centre. */
    address: {
      text: "SPOTTED-A-CUTIE.VERCEL.APP",
      font: "gothic", size: 26, tracking: 0.14,
      gap: 18,                               /* px between the tag and the address */
      alpha: 0.55,                           /* the style's ink at .55 on light paper (>= 3.3:1) */
      onDark: { color: CREAM, alpha: 0.70 }  /* on a kind-ink band (>= 3.1:1) */
    },

    texture: {
      grain: { tile: 256, op: "overlay" },                                  /* seeded grey noise tile; strength per style */
      fibres: { lenMin: 6, lenMax: 18, width: 1, alpha: 0.05 },             /* density per style = fibres per 100x100 px */
      inkSpread: { blur: 0.8, alpha: 0.35 },                                /* second pass with shadowBlur, same colour */
      dropout: { rMin: 0.6, rMax: 2.2 },                                    /* destination-out speckles until `coverage` is gone */
      misregistration: { dx: 1, dy: 1, minScale: 0.75 },                    /* 0 below that scale */
      stamp: { outer: 3, gap: 5, inner: 1.5, radius: 6, alpha: 0.86, dropout: 0.09, rotate: [-8, -4], padX: 26, padY: 12 },   /* padY 16 -> 12 (M1): the Wanted return stamp must fit under the reward line */
      washi: { w: 280, h: 72, alpha: 0.42, stripe: { width: 6, every: 18, color: "#ffffff", alpha: 0.12, angle: 45 }, teeth: 9, tooth: 4, rotate: 4, rotateJitter: 3 },
      cornerMount: { leg: 12, ink: INK, alpha: 0.88, highlight: { color: "#ffffff", alpha: 0.15 }, emptyAlpha: 0.22 },
      nail: { r: 11, rim: "#4a3a28", top: "#8a7a66", topR: 8, hi: "#c9bba4", hiR: 2.5, hiAt: [-3, -3], shadow: { color: "#2a2118", alpha: 0.35, w: 14, h: 6, dx: 4, dy: 6 } },
      stains: { color: "#a07a3c", count: [3, 5], alpha: [0.06, 0.12], r: [60, 220], ring: { width: 3, r: [90, 130], alpha: 0.10, breaks: 2 } },
      edgeBurn: { color: "#6b4a1e", alpha: 0.22, depth: 90 },
      crease: { light: { color: "#ffffff", alpha: 0.10 }, dark: { color: "#6b4a1e", alpha: 0.08 }, width: 1, near: 0.33, jitter: 0.06 },
      dotGrid: { r: 2, every: 40, color: INK, alpha: 0.12 },
      halftone: { cell: 5, minCell: 3, angle: 45, k: 0.62, ink: "#1d1b18", alpha: 0.92 },   /* dot r = cell * k * sqrt(darkness) */
      vignette: { from: 0.6 },                                                             /* starts at 60% of the half-diagonal */
      printShadow: [ { color: "#3c280a", alpha: 0.18, blur: 4, y: 2 }, { color: "#3c280a", alpha: 0.16, blur: 36, y: 18 } ]
    },

    /* Photo grades, applied in this order: contrast (around mid-grey), saturation, warmth (+R, -B, 0..255),
       lift (out = lift + (1 - lift) * in), split (shadows by amount*(1-L)^2, highlights by amount*L^2),
       ramp (luminance through stops), gamma, grain, vignette, halftone. "kind" = the card's kind ink.
       Street-photo rule: no style raises saturation by more than 6%. */
    grades: {
      minimal:  { contrast: 1.05, saturation: 1.00, warmth: 3, lift: 0.03, split: null, ramp: null, vignette: 0 },
      trading:  { contrast: 1.08, saturation: 0.94, warmth: 2, lift: 0.02, split: { shadows: "kind", shadowAmount: 0.10, highlights: CREAM, highlightAmount: 0.05 }, ramp: null, vignette: 0.06, vignetteColor: "#000000" },
      polaroid: { contrast: 0.96, saturation: 0.90, warmth: 5, lift: 0.08, split: { shadows: "#2f5a55", shadowAmount: 0.05, highlights: "#fff1d6", highlightAmount: 0.08 }, ramp: null, vignette: 0.14, vignetteColor: "#000000" },
      wanted:   { contrast: 1.06, saturation: 0, warmth: 0, lift: 0, split: null, ramp: [[0, "#2a2118"], [0.5, "#8a6a44"], [1, "#efe0bf"]], grain: 0.06, vignette: 0.18, vignetteColor: "#3a2a14" },
      dating:   { contrast: 1.04, saturation: 1.06, warmth: 4, lift: 0.02, split: { shadows: null, shadowAmount: 0, highlights: "#fff0e6", highlightAmount: 0.05 }, ramp: null, vignette: 0.06, vignetteColor: "#000000" },
      news:     { contrast: 1.0, saturation: 0, warmth: 0, lift: 0, split: null, ramp: null, gamma: 1.22, halftone: true, vignette: 0 }   /* M1: was contrast 1.15 / gamma .95, which blew white fur into a dotless blob. gamma > 1 pulls light greys down so fur keeps small dots */
    },

    story: {
      caption: { text: "Spotted a cutie? spotted-a-cutie.vercel.app", font: "hand", size: 40, color: INK, alpha: 0.86, y: 1500 },
      card: { shadow: "printShadow" }
    },

    styles: {

      /* ------------------------------------------------------------------ */
      minimal: {
        name: "Minimal", object: "a museum postcard / gallery wall label",
        paper: "#f7f3ec", ink: INK, ink2: "#3a4252", ink3: "#5f5c55", accent: PERSONAL,
        texture: { grain: 0.035 },
        window: { x: 40, y: 40, w: 1000, h: 900, radius: 6, keyline: { width: 1, color: INK, alpha: 0.10 } },
        slots: {
          name:     { x: 40, y: 966, w: 1000, h: 112, font: "serif", size: [112, 72], lines: 1, baseline: 1058, align: "left", color: INK, tracking: -0.01 },
          title:    { x: 40, y: 1078, w: 1000, h: 50, font: "serifItalic", size: [44, 32], lines: 1, baseline: 1118, align: "left", color: "#3a4252" },
          personal: { x: 40, y: 1124, w: 1000, h: 44, font: "serifItalic", size: [36, 28], lines: 1, baseline: 1150, align: "left", color: PERSONAL },
          rowLabel: { x: 40, w: 150, font: "gothic", size: 24, align: "left", color: "#5f5c55", tracking: 0.14, upper: true },
          rowValue: { x: 200, w: 620, font: "serif", size: [32, 26], lines: 1, align: "left", color: INK }
        },
        rows: { fields: ["mood", "habitat"], baselines: [1180, 1226] },
        personal: {
          slot: "personal",
          /* when personalised the name block tightens so the rows clear the colophon */
          shift: { name: { baseline: 1046, size: [100, 68] }, title: { baseline: 1100 }, personal: { baseline: 1146 }, rows: { baselines: [1196, 1238] } }
        },
        colophon: { tag: { x: 864, y: 1270 }, address: { align: "right", x: 846 } },  /* the address ends 18 px left of the tag */
        golden: {
          photoRule: { width: 3, outset: 12, radius: 10, fill: "foil" },   /* the gilded mat line */
          name: "foil"
        },
        storyBg: { color: "#ece6da", grain: 0.04 },
        swatch: { bg: "#f7f3ec", mark: { type: "rect", color: INK, inset: [2, 2, 2, 6], width: 1 } }
      },

      /* ------------------------------------------------------------------ */
      trading: {
        name: "Trading card", object: "a 1950s–70s tea card, printed in two inks on card stock",
        /* REVISED (Rishi, step 2): the kind ink carries the card; a second spot ink (kinds[k].spot) for the
           type ribbon and the damage; one move instead of two; nothing under 30 px except the address (26)
           and the stamp's label (26). Background = the kind's dark ink with an engraved cross-hatch, not beige. */
        paper: "kindDark", ink: INK, ink2: "#3a4252", ink3: "#5f5c55", accent: "kind", spot: "kindSpot",
        stock: CREAM,                                   /* the cream border and the cream panel */
        texture: { grain: 0.06, inkGrain: 0.10, misregistration: true,
          hatch: { color: CREAM, alpha: 0.06, every: 14, width: 1.5, angles: [45, -45] } },   /* the backdrop, like the card back */
        card: { x: 36, y: 36, w: 1008, h: 1278, radius: 30, border: 18, borderColor: CREAM, innerRadius: 14, fill: "kind", shadow: "printShadow" },
        window: { x: 84, y: 210, w: 912, h: 520, radius: 4,
          bevel: { outer: { color: CREAM, width: 4, offset: 4 }, inner: { color: "kindDark", width: 1.5 } } },   /* flat lines only */
        slots: {
          series:    { x: 84, y: 72, w: 760, h: 36, font: "gothic", size: [32, 26], lines: 1, baseline: 104, align: "left", color: CREAM, alpha: 0.86, tracking: 0.16, upper: true,
                       format: "{series} \u00B7 No. {number}" },          /* "STREET CATS · NO. 014": the tea-card series line */
          name:      { x: 84, y: 112, w: 760, h: 84, font: "serif", size: [84, 58], lines: 1, baseline: 186, align: "left", color: CREAM, tracking: -0.01 },
          statLabel: { font: "gothic", size: 26, tracking: 0.16, color: CREAM, upper: true, dy: -24 },   /* inside the stat stamp, above centre */
          statValue: { font: "gothic", size: 66, color: CREAM, dy: 34 },                                 /* inside the stat stamp, below centre */
          type:      { x: 112, y: 748, w: 856, h: 60, font: "serifItalic", size: [36, 30], lines: 1, baseline: 789, align: "center", color: CREAM },
          moveName:  { x: 112, w: 640, font: "serif", size: [46, 36], lines: 1, baseline: 886, align: "left", color: INK },
          moveDamage:{ x: 768, w: 200, font: "gothic", size: 84, baseline: 896, align: "right", color: "kindSpot" },
          moveText:  { x: 112, w: 700, font: "serif", size: [32, 30], lines: 1, baseline: 932, align: "left", color: "#3a4252" },
          bottomLabel: { xs: [112, 456, 812], ws: [320, 332, 156], font: "gothic", size: 30, baseline: 998, align: "left", color: "#5f5c55", tracking: 0.1, upper: true },
          bottomValue: { xs: [112, 456, 812], ws: [320, 332, 156], font: "serif", size: [34, 30], lines: 2, lineHeight: 1.08, baseline: 1038, align: "left", color: INK },
          flavour:   { x: 112, y: 1104, w: 856, h: 92, font: "serifItalic", size: [34, 30], lines: 2, lineHeight: 1.15, baseline: 1140, align: "left", color: "#3a4252", quotes: true },
          personal:  { x: 112, y: 1104, w: 856, h: 92, font: "serif", size: [36, 30], lines: 2, lineHeight: 1.12, baseline: 1142, align: "left", color: PERSONAL }
        },
        parts: {
          typeStrip: { x: 84, y: 748, w: 912, h: 60, fill: "kindSpot", notch: 10, keyline: { color: CREAM, width: 2, inset: 5 } },  /* the tinted ribbon */
          panel: { x: 84, y: 826, w: 912, h: 380, fill: CREAM, radius: 8, grain: 0.03 },
          rule: { y: 958, x1: 112, x2: 968, width: 2, color: "kind", alpha: 0.55 },
          divider: { y: 1094, x1: 112, x2: 968, width: 1, color: INK, alpha: 0.18 },          /* between the bottom row and the flavour */
          bottomLabels: ["Weakness", "Threat", "Retreat"], retreatValue: "never",
          moves: 1,                                     /* ONE move (the first of traits.moves); the second is cut for legibility */
          stat: "highest",                              /* whichever of chaos / fluff / sass is highest */
          statStamp: { cx: 936, cy: 130, r: 66, rotate: -8, color: CREAM, ring: { outer: 3, gap: 5, inner: 1.5 }, dropout: 0.06 },  /* an ink-stamped roundel */
          series: { cat: "Street cats", dog: "Street dogs", pigeon: "Pigeons", crow: "Crows", cow: "Cows", squirrel: "Squirrels", monkey: "Monkeys", bird: "Birds", mystery: "Unclassified" }
        },
        personal: { slot: "personal", replaces: "flavour" },
        colophon: { tag: { x: 84, y: 1226, color: CREAM }, address: { align: "right", x: 996, onDark: true } },
        golden: {
          band: "foil",                                /* the inked field (inside the cream border) becomes foil */
          nameColor: INK, seriesColor: INK, statColor: INK,
          typePrefix: { text: "GOLDEN", font: "gothic", size: 32, tracking: 0.16, color: CREAM, sep: " \u00B7 " },   /* on the spot ribbon */
          star: { cx: 996, cy: 210, r: 28, inner: 12, fill: "foil", stroke: FOIL.shadow, strokeWidth: 1.5 },
          tagColor: INK,
          address: { color: INK, alpha: 0.72 }         /* cream fails on foil */
        },
        storyBg: { color: "kindDark", grain: 0.06, hatch: true, captionColor: CREAM, captionAlpha: 0.92 },   /* the story caption is cream on the dark ink */
        swatch: { bg: "#4f5d6e", mark: { type: "rect", color: CREAM, inset: [2, 2, 2, 7], width: 0, fill: true } }
      },
      /* ------------------------------------------------------------------ */
      polaroid: {
        name: "Polaroid", object: "an instant print taped into a dot-grid journal",
        paper: "#efe7d8", ink: INK, ink2: "#3a4252", ink3: "#5f5c55", accent: "kind",
        frame: "#fbf8f1",
        texture: { grain: 0.05, frameGrain: 0.03, dotGrid: true },
        print: { x: 100, y: 50, w: 880, h: 1020, rotate: -3, rotateJitter: 1, shadow: "printShadow" },   /* rotate around its centre */
        window: { x: 140, y: 90, w: 800, h: 800, radius: 0, rotate: -3, innerShadow: { color: INK, alpha: 0.12, width: 1 } },
        strip: { y: 890, h: 180 },                      /* the caption strip, inside the print (rotates with it) */
        slots: {
          /* caption slots are relative to the print (x from the print's left, baseline from the strip's top) and rotate with it */
          caption:   { x: 40, w: 800, font: "hand", size: [64, 44], lines: 1, baselineInStrip: 104, align: "center", color: INK, alpha: 0.92 },
          caption1:  { x: 40, w: 800, font: "hand", size: [56, 40], lines: 1, baselineInStrip: 74, align: "center", color: INK, alpha: 0.92 },
          caption2:  { x: 40, w: 800, font: "hand", size: [52, 38], lines: 1, baselineInStrip: 140, align: "center", color: PERSONAL, heart: { size: 24, stroke: 3, gap: 12, replaces: "♥" } },  /* strip a trailing ♥ from the line and draw the heart instead */
          note1:     { x: 70, y: 1104, w: 460, h: 100, font: "hand", size: [44, 34], lines: 2, lineHeight: 1.0, align: "left", color: "#3a4252", rotate: -2, field: "habitat" },
          note2:     { x: 604, y: 1100, w: 420, h: 100, font: "hand", size: [44, 34], lines: 2, lineHeight: 1.0, align: "left", color: "#3a4252", rotate: 2.5, field: "catchphrase", quotes: true }
        },
        parts: {
          tape: { cx: 540, cy: 50, color: "kind" },     /* texture.washi; overlaps the frame ~40 px */
          arrow: { from: [572, 1160], via: [554, 1120], to: [598, 1094], head: 15, stroke: 3, color: "#3a4252" },   /* in the gap left of note 2, pointing up at the print (jitter the points by up to 6 px, seeded) */
          captionFormat: "{name} · {mood} · {date}"     /* date like "9 Oct" from `when` */
        },
        personal: { slot: "caption2", lineOne: "caption1" },
        colophon: { tag: { x: 864, y: 1272 }, address: { align: "right", x: 846 } },
        golden: {
          tape: { fill: "foil", alpha: 0.85 },
          starDoodle: { size: 44, stroke: 4, color: FOIL.ink, gap: 14 }   /* a one-stroke star right after the name in the caption */
        },
        storyBg: { color: "#efe7d8", grain: 0.05, dotGrid: true },
        swatch: { bg: "#fbf8f1", mark: { type: "polaroid", color: "#9aa1a8" } }
      },

      /* ------------------------------------------------------------------ */
      wanted: {
        name: "Wanted", object: "a letterpress handbill, aged and nailed up",
        paper: "#e9d8b4", ink: "#2a2118", ink2: "#4a3b2a", ink3: "#4a3b2a", accent: "#a07a3c",
        texture: { grain: 0.07, fibres: 0.6, stains: true, edgeBurn: true, creases: ["h", "v"] },
        nails: [[64, 58], [1016, 58]],
        window: { x: 160, y: 334, w: 760, h: 640, radius: 0,
          border: { width: 3, color: "#2a2118" }, rule: { width: 1, color: "#2a2118", offset: 10 } },
        slots: {
          wanted:  { x: 80, y: 56, w: 920, h: 206, font: "gothic", fit: "width", size: [300, 200], baseline: 252, align: "center", color: "#2a2118", tracking: 0.02, upper: true, inkSpread: true, dropout: 0.02, text: "WANTED" },
          crime:   { x: 80, y: 268, w: 920, h: 52, font: "serifItalic", size: [46, 32], lines: 1, baseline: 306, align: "center", color: "#4a3b2a" },
          name:    { x: 80, y: 990, w: 920, h: 86, font: "serif", size: [96, 60], lines: 1, baseline: 1064, align: "center", color: "#2a2118", tracking: 0.04, upper: true },
          alias:   { x: 80, y: 1080, w: 920, h: 40, font: "serifItalic", size: [38, 28], lines: 1, baseline: 1106, align: "center", color: "#4a3b2a", prefix: "alias " },
          lastSeenLabel: { font: "gothic", size: 28, tracking: 0.12, color: "#4a3b2a", upper: true, text: "Last seen", gap: 12 },
          lastSeen:      { x: 120, w: 840, font: "serif", size: [34, 26], lines: 1, baseline: 1162, align: "center", color: "#2a2118" },
          rewardLabel:   { font: "gothic", size: 40, tracking: 0.08, color: "#2a2118", upper: true, text: "Reward", gap: 14 },
          reward:        { x: 120, w: 840, font: "serif", size: [36, 26], lines: 1, baseline: 1208, align: "center", color: "#2a2118" }
        },
        parts: {
          ruleGroup: { y: 1120, x1: 200, x2: 880, lines: [1, 4, 1], gap: 3, color: "#2a2118", alpha: 0.85 }
        },
        personal: {
          stamp: { cx: 806, cy: 1284, maxW: 420, rotate: -3, color: PERSONAL, alpha: 0.88,   /* bottom-right, on paper, balancing the bottom-left colophon. M1: the stamp's top edge stays BELOW the reward line (descenders end ~1217; the stamp's top-right corner is ~1219), so it can never strike through even the longest reward. The bottom-left corner reaches ~1349 */
            line1: { font: "gothic", size: [38, 30], tracking: 0.08, upper: true },
            line2: { font: "serifItalic", size: [28, 22] },
            lineGap: 8 }
        },
        colophon: { tag: { x: 64, y: 1262 }, address: { align: "left" } },   /* bottom-left: the right stays free for the stamp */
        golden: {
          wanted: "foil",
          /* M1: the standard foil is too pale on the tan paper. On a golden Wanted card, EVERY foil fill (the word, the ribbon,
             the tag) uses this deeper ramp instead of SC.PALETTE.foil, and the WANTED word uses wordDropout instead of
             slots.wanted.dropout (the specks showed as tan holes in the gold). Same shape as SC.PALETTE.foil. */
          foil: { shadow: "#5a4012", base: "#8a6420", light: "#c9a24f", hi: "#e3c77a", ink: "#6f5018", angle: 28,
            stops: [[0, "#5e4313"], [0.18, "#8a6420"], [0.36, "#b08a3a"], [0.44, "#d6b765"], [0.52, "#9c7631"], [0.70, "#6f5018"], [0.86, "#a07a2e"], [1, "#674a15"]],
            bands: { count: 2, color: "#fff1c8", alpha: 0.16, widthMin: 0.03, widthMax: 0.05, angle: 118 },
            brushed: { every: 3, width: 1, color: "#ffffff", alpha: 0.05 },
            emboss: { dx: 2, dy: 2, color: "#3a2a10", alpha: 0.45 },
            textOn: INK },
          wordDropout: 0.004,
          ribbon: { cx: 540, y: 312, w: 440, h: 64, fork: 18, fill: "foil", text: "MOST WANTED", font: "gothic", size: 38, tracking: 0.24, color: INK }
        },
        storyBg: { color: "#d9c49c", grain: 0.06, stains: 2 },
        swatch: { bg: "#e9d8b4", mark: { type: "bar", color: "#2a2118", h: 3 } }
      },

      /* ------------------------------------------------------------------ */
      dating: {
        name: "Dating", object: "a printed personal-ads page (no real app)",
        paper: "#f3e3da", ink: "#2b2026", ink2: "#5a4650", ink3: "#5a4650", accent: "#9e3a4f",
        cream: "#fbf5f0",
        texture: { grain: 0.03 },
        window: { x: 36, y: 36, w: 1008, h: 1012, radius: 36,
          fade: { from: 0.55, color: "#2b2026", alpha: 0.72, curve: "smoothstep" } },   /* bottom 45% of the window */
        slots: {
          name:     { x: 76, y: 866, w: 760, h: 96, font: "serif", size: [88, 60], lines: 1, baseline: 940, align: "left", color: "#fbf5f0", format: "{name}, {age}" },
          distance: { x: 116, w: 700, font: "gothic", size: 34, baseline: 990, align: "left", color: "#fbf5f0", alpha: 0.88, tracking: 0.1, upper: true,
                      pin: { x: 76, size: 30, stroke: 3, color: "#fbf5f0", gap: 10 } },
          chipLabel: { font: "gothic", size: 22, tracking: 0.1, upper: true, color: "#9e3a4f", padX: 28, gap: 10 },
          chipValue: { font: "serif", size: [30, 22], lines: 1, color: "#2b2026" }
        },
        parts: {
          chips: { x: 36, y: 1064, w: 1008, h: 164, cols: 2, chipW: 496, chipH: 74, gap: 16, radius: 37, stroke: 2, color: "#2b2026", alpha: 0.85,
                   fields: ["greenFlag", "redFlag", "lookingFor", "loveLanguage"], labels: ["Green flag", "Red flag", "Looking for", "Love language"] },
          nope: { cx: 470, cy: 1284, d: 88, stroke: 2.5, color: "#2b2026", cross: { size: 30, width: 3 } },
          like: { cx: 590, cy: 1284, d: 88, fill: "#9e3a4f", heart: { size: 34, color: "#fbf5f0" } }
        },
        personal: {
          banner: { x: 120, y: 70, w: 840, h: 128, radius: 8, rotate: -2, fill: "#fbf5f0", rule: { inset: 8, width: 2, color: "#9e3a4f" },
            tape: { w: 120, h: 40, color: "#9e3a4f", alpha: 0.4, at: "top-left" },
            line1: { font: "serifItalic", size: [46, 34], color: "#2b2026", text: "It’s a match!" },
            line2: { font: "serif", size: [40, 30], color: "#2b2026", toColor: PERSONAL, heart: { size: 26, color: "#9e3a4f", replaces: "♥" } },
            line3: { font: "gothic", size: 22, tracking: 0.12, upper: true, color: "#5a4650", dropIfTight: true } }
        },
        colophon: { tag: { x: 36, y: 1258 }, address: { align: "right", x: 1044 } },
        golden: {
          seal: { cx: 930, cy: 150, d: 168, scallops: 24, depth: 7, fill: "foil", ring: { inset: 10, width: 1.5, color: FOIL.shadow },
                  lines: ["SUPER", "CUTIE"], font: "gothic", size: 30, tracking: 0.12, color: INK },
          bannerShift: { x: 80, w: 760 }
        },
        storyBg: { color: "#ecd6cc", grain: 0.03 },
        swatch: { bg: "#f3e3da", mark: { type: "dot", color: "#9e3a4f", r: 2.5 } }
      },

      /* ------------------------------------------------------------------ */
      news: {
        name: "Breaking news", object: "the front page of a small-town daily",
        paper: "#f2efe6", ink: "#1d1b18", ink2: "#45413a", ink3: "#45413a", accent: "#b0412e",
        texture: { grain: 0.06, fibres: 0.4, creases: ["h"], creaseY: 700 },
        window: { x: 40, y: 540, w: 1000, h: 560, radius: 0, halftone: true },
        slots: {
          masthead: { x: 40, y: 62, w: 1000, h: 96, font: "serif", size: [84, 64], lines: 1, baseline: 140, align: "center", color: "#1d1b18", tracking: 0.06, upper: true, text: "The Daily Street" },
          dateline: { x: 40, w: 600, font: "gothic", size: 26, baseline: 196, align: "left", color: "#45413a", tracking: 0.12, upper: true },
          price:    { x: 640, w: 400, font: "gothic", size: 26, baseline: 196, align: "right", color: "#45413a", tracking: 0.12, upper: true, text: "Price: 1 treat" },
          headline: { x: 40, y: 236, w: 1000, h: 284, font: "gothic", size: [150, 88], lines: 3, lineHeight: 0.92, align: "left", color: "#1d1b18", tracking: 0.01, upper: true, inkSpread: true },
          caption:  { x: 40, w: 1000, font: "serifItalic", size: [28, 24], lines: 1, baseline: 1136, align: "left", color: "#45413a", format: "{name}, pictured, declined to comment." },
          pull:     { x: 564, y: 1162, w: 476, h: 92, font: "serifItalic", size: [34, 26], lines: 2, lineHeight: 1.1, align: "left", color: "#1d1b18", quotes: true },
          vol:      { x: 840, w: 200, font: "gothic", size: 26, align: "right", color: "#45413a", tracking: 0.12, upper: true, text: "Vol. 1", optional: true }
        },
        parts: {
          rules: [ { y: 40, w: 1 }, { y: 46, w: 3 }, { y: 162, w: 1 }, { y: 212, w: 3 }, { y: 218, w: 1 } ],   /* x 40 -> 1040, ink */
          columns: { x: 40, y: 1156, w: 1000, h: 104, colW: 476, gutter: 48, rule: { width: 1, color: "#1d1b18", alpha: 0.25 } },
          bars: { h: 10, pitch: 26, color: "#1d1b18", alpha: 0.16, lastMin: 0.4, lastMax: 0.8 },
          pullRules: { width: 1, color: "#1d1b18", alpha: 1 },
          exclusive: { cx: 900, cy: 580, rotate: -8, color: "#b0412e", alpha: 0.86, text: "EXCLUSIVE", font: "gothic", size: 54, tracking: 0.18 }
        },
        personal: { slot: "headline", note: "the headline itself is the personal line" },
        colophon: { tag: { x: 40, y: 1278 }, address: { align: "left" } },
        golden: {
          banner: { x: 0, y: 0, w: 1080, h: 56, fill: "foil", text: "SPECIAL EDITION", font: "gothic", size: 34, tracking: 0.3, color: INK, star: { r: 9, inner: 3.8, gap: 24, color: INK } },
          shiftY: 40, headlineH: 244
        },
        storyBg: { color: "#e4e0d4", grain: 0.06 },
        swatch: { bg: "#f2efe6", mark: { type: "bars", color: "#1d1b18", count: 3 } }
      }
    }
  };
})();
