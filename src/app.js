// Spotted a Cutie: screens, state and events. Classic script, no libraries.
// Order in this file:
//   1. the family footer (MAKER_NAME, SIBLINGS, footer code), copied from ../shared-kit/footer/
//   2. THE ENGINE ADAPTER: every SC.* call the site makes lives in the object `E` (one place to fix a mismatch)
//   3. helpers, state, screens (landing, kind, reveal, result, edit sheet, adjust, done, binder, errors)
//   4. dev shortcuts (PLAN.md 7.4) and start-up

// ---------------------------------------------------------------------------------------------
// 1. Footer (shared-kit/footer/siblings.js, this site's own entry dropped, Pocket Booth added)
// ---------------------------------------------------------------------------------------------
const MAKER_NAME = "Risheek";

// Every live site. icon is a key of SIB_SVG below.
const SIBLINGS = [
  { name: "Pocket Booth", url: "https://the-pocket-booth.vercel.app", blurb: "Four shots, one strip.", icon: "underline" },
  { name: "Look Up", url: "https://look-up-sky.vercel.app", blurb: "Saw a shape in the clouds? Send it to someone.", icon: "cloud" },
  { name: "Underline", url: "https://underline-it.vercel.app", blurb: "Highlight the line you love, without ruining your book.", icon: "underline" },
  { name: "Doodle Alive", url: "https://doodle-alive.vercel.app", blurb: "Snap a doodle, watch it come alive.", icon: "doodle" },
  { name: "Handwriting → Font", url: "https://handwriting-font-converter.vercel.app", blurb: "Type in your own handwriting.", icon: "aa" }
];

// shared-kit/footer/footer.js (copied)
var SIB_SVG = {
  aa: "Aa",
  doodle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 16c2-5 4-5 5-1s3 3 4-2 3-6 4-2 2 5 3 3"/><path d="M19 4l.8 1.8L21.6 6.6 19.8 7.4 19 9.2 18.2 7.4 16.4 6.6 18.2 5.8z"/></svg>',
  underline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 8h14M5 12h10"/><path d="M4 17.5c3-.8 6 .6 9-.2s5-.6 7 .2" stroke-width="3" opacity=".55"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.1 9.6 4.2 4.2 0 0 0 7 18z"/></svg>'
};

function footerEsc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function footerHTML() {
  var cards = SIBLINGS.map(function (s) {
    return '<a class="sib-card" href="' + footerEsc(s.url) + '" target="_blank" rel="noopener">' +
      '<span class="sib-ico" aria-hidden="true">' + (SIB_SVG[s.icon] || "") + "</span>" +
      '<span class="sib-text"><strong>' + footerEsc(s.name) + "</strong><span>" + footerEsc(s.blurb) + "</span></span></a>";
  }).join("");
  return '<footer class="site-footer"><p class="more-from">More from ' + footerEsc(MAKER_NAME) + "</p>" + cards + "</footer>";
}

function fillFooter() {
  Array.prototype.forEach.call(document.querySelectorAll("[data-footer]"), function (el) { el.innerHTML = footerHTML(); });
}

// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var d = document;

  // -------------------------------------------------------------------------------------------
  // 2. THE ENGINE ADAPTER. The only place that touches SC.* (PLAN.md 7.3). Fix mismatches here.
  // -------------------------------------------------------------------------------------------
  var E = {
    sc: function () { return globalThis.SC || {}; },

    // names the site cannot run without; the binder, sample and share parts degrade gracefully
    missing: function () {
      var sc = E.sc(), miss = [];
      [
        "KINDS", "STYLES", "REASONS", "LIMITS",
        "content.generate", "content.reroll", "content.fill", "content.fieldsFor", "content.FIELDS",
        "decode.fileToImageData",
        "photo.from", "photo.autoCrop", "photo.clampCrop", "photo.drawCrop",
        "text.ready", "card.create", "card.fromSaved",
        "export.image", "share.canShare", "share.share", "share.save"
      ].forEach(function (path) {
        var o = sc, parts = path.split("."), i;
        for (i = 0; i < parts.length; i++) {
          if (o == null || o[parts[i]] == null) { miss.push("SC." + path); return; }
          o = o[parts[i]];
        }
      });
      return miss;
    },
    hasBinder: function () {
      var b = E.sc().binder;
      return !!(b && b.available && b.save && b.list && b.get && b.remove && b.stats && b.recentNames);
    },
    hasSample: function () { var s = E.sc().sample; return !!(s && s.load); },

    // constants
    kinds: function () { return E.sc().KINDS || []; },                  // [{ id, name, rarity }]
    styles: function () { return E.sc().STYLES || []; },                // [{ id, name }]
    reasons: function () { return E.sc().REASONS || []; },              // [{ id, label }]
    limits: function () { var l = E.sc().LIMITS || {}; return { name: l.name || 20, place: l.place || 32, to: l.to || 16, line: l.line || 60 }; },
    defaultStyle: function () { var df = E.sc().DEFAULTS; return (df && df.style) || "trading"; },
    goldenChance: function () { var g = E.sc().GOLDEN_CHANCE; return typeof g === "number" ? g : 0.05; },

    // content
    generate: function (kind, opt) { return E.sc().content.generate(kind, opt); },                 // -> traits
    reroll: function (traits, what, opt) { return E.sc().content.reroll(traits, what, opt); },     // what: "name" | "all" | a field id -> new traits
    fill: function (text, ctx) { return E.sc().content.fill(text, ctx); },                         // ctx: { name, kind, place, to }
    fieldsFor: function (style) { return E.sc().content.fieldsFor(style); },                       // -> [fieldId]
    fields: function () { return E.sc().content.FIELDS; },                                         // [{ id, label }]

    // photos
    decode: function (file, opt) { return E.sc().decode.fileToImageData(file, opt); },             // -> Promise<ImageData>
    photoFrom: function (imageData) { return E.sc().photo.from(imageData); },                      // -> Photo { width, height, canvas }
    autoCrop: function (photo) { return E.sc().photo.autoCrop(photo); },                           // -> { cx, cy, zoom }
    clampCrop: function (photo, crop, aspect) { return E.sc().photo.clampCrop(photo, crop, aspect); },
    drawCrop: function (canvas, photo, crop) { return E.sc().photo.drawCrop(canvas, photo, crop); },

    // the card
    textReady: function () { var t = E.sc().text; return Promise.resolve(t && t.ready ? t.ready() : undefined); },
    cardCreate: function (settings) { return Promise.resolve(E.sc().card.create(settings)); },     // -> Promise<Card>
    cardFromSaved: function (saved) { return Promise.resolve(E.sc().card.fromSaved(saved)); },
    update: function (card, partial) { return Promise.resolve(card.update(partial)); },
    render: function (card, scale, format) { return card.render(scale, format); },                 // -> canvas
    windowOf: function (card, style) { return card.window(style); },                               // -> { x, y, w, h, radius, rotate }

    // binder
    binderAvailable: function () { return Promise.resolve(E.sc().binder.available()); },
    binderSave: function (card, opt) { var b = E.sc().binder; return Promise.resolve(opt ? b.save(card, opt) : b.save(card)); },
    binderList: function () { return Promise.resolve(E.sc().binder.list()); },
    binderGet: function (id) { return Promise.resolve(E.sc().binder.get(id)); },
    binderRemove: function (id) { return Promise.resolve(E.sc().binder.remove(id)); },
    binderStats: function () { return Promise.resolve(E.sc().binder.stats()); },
    binderRecent: function (n) { return Promise.resolve(E.sc().binder.recentNames(n)); },

    // samples, export, share
    sampleLoad: function () { return Promise.resolve(E.sc().sample.load()); },                     // -> [Card, Card, Card]
    exportImage: function (card, format) { return Promise.resolve(E.sc().export.image(card, format)); }, // -> File
    canShare: function (file) { return !!E.sc().share.canShare(file); },
    share: function (file) { return Promise.resolve(E.sc().share.share(file)); },                  // -> "shared" | "cancelled" | "failed"
    save: function (file) { return Promise.resolve(E.sc().share.save(file)); }                     // -> "saved" | "shared" | "cancelled" | "failed"
  };

  // -------------------------------------------------------------------------------------------
  // 3. helpers
  // -------------------------------------------------------------------------------------------
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function on(el, ev, fn, o) { if (el) el.addEventListener(ev, fn, o); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function pad3(n) { var s = String(Math.max(0, n | 0)); while (s.length < 3) s = "0" + s; return s; }
  function noop() { }

  var Q = new URLSearchParams(location.search);
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reduced() { return !!(mq && mq.matches); }

  // the canonical drawn icon set (design/board.js ICONS): 24x24, stroke 1.75, round caps, no faces on animals
  var ICONS = {
    cat: '<path d="M13.2 9.1 13.6 4.3l2 2.1c.7-.2 1.4-.2 2 0l1.5-2.2.2 4.4c0 1.9-.9 3.1-2.5 3.6-.5 2.6-.3 5.3.3 8.3H8.8c-2.3 0-3.2-1.6-3-4.3.3-4.5 2.7-6.6 7.4-7.1Z"/><path d="M8.8 20.5c-3.5.4-5.3-.9-5.3-2.9 0-1.1.6-1.8 1.4-2.1"/>',
    dog: '<path d="M3.6 8.3 7 7.3l1.6-1.9c.8-.6 2.3-.7 3.2 0 .7.6 1 1.6.9 3l-.1 1.9c2.7.8 4.7 2.6 5.3 5.4.4 1.8.3 3.4-.1 4.8H9.2c-.4-2.4-.4-4.6 0-6.6-.2-1.3-1-2.2-2.2-2.5l-2.6-.4c-.8-.2-1.1-.8-.8-1.6Z"/><path d="M9.6 5.6c-.9 1.4-.8 2.9.3 4.2"/><path d="M17.6 15.2c1.2-.6 2-1.6 2.4-3.2"/><path d="M13.6 20.5c-.4-2 .3-3.6 1.8-4.6"/>',
    pigeon: '<path d="M4.6 8.4 6.3 7.3c.4-1.6 1.4-2.2 2.6-2 1.1.2 1.6 1 1.4 2.3-.1 1.3.5 2.2 1.6 2.7 3 .3 5.8 1.1 8.3 2.1l-.9 2.1c-1.8.2-3.4.8-4.8 1.9-1.6 1.2-3.4 1.6-5.3 1.1-2.6-.7-3.6-2.6-3.3-5.4.1-.9.3-1.6.5-2.2-.9-.4-1.8-.6-2.8-.5Z"/><path d="M10.9 11.8c1.9.3 3.6 1 5 2.1"/><path d="m10.1 17.4-.4 2.8m3.1-2.9.4 2.9"/>',
    crow: '<path d="M2.8 7.9 7 6.6c1.1-1.4 2.6-1.8 3.8-.9.9.6 1.2 1.6 1.1 2.9 2.2 1.2 4 3 5.3 5.1l3.8 4.6-2.9-.1-2.3-1.6c-2 .9-4.2.9-6-.3-1.5-1-2.1-2.8-1.9-5l-.9-1.8c-1.4-.2-2.8-.7-4.2-1.5Z"/><path d="m11.5 16.6-.6 3.9m2.5-3.4v3.4"/>',
    cow: '<path d="M8.5 7.7c2.3-.9 4.7-.9 7 0l-.5 7.3c1 .9 1.4 2.1 1.1 3.5-.3 1.4-1.6 2.1-4.1 2.1s-3.8-.7-4.1-2.1c-.3-1.4.1-2.6 1.1-3.5Z"/><path d="M8.6 7.7C6.7 7 5.8 5.5 5.7 3.6m9.7 4.1c1.9-.7 2.8-2.2 2.9-4.1"/><path d="M8.7 9.4c-2 .5-3.7.2-5.1-1 .8 2 2.6 3.2 5.1 3.2m6.6-2.2c2 .5 3.7.2 5.1-1-.8 2-2.6 3.2-5.1 3.2"/><path d="M9.1 16.5c1.9.7 3.9.7 5.8 0"/>',
    squirrel: '<path d="M8.4 20.5c-1.3-.3-1.8-1.4-1.6-3.3.2-2 .8-3.6 1.6-4.6-.9-.4-1.6-1.1-1.9-2.1-.9 0-1.4-.4-1.5-1 .3-1.3 1.2-2 2.4-2.2l.2-1.9 1.3 1.8c1.6.6 2.4 1.7 2.4 3.4.8 1.4 1.1 3 1 4.8-.1 2-.6 3.7-1.5 5.1Z"/><path d="M11.4 19.6c3.3.5 5.5-.7 6.1-3.4.6-2.8-.1-4.5-2-5.6-1.6-.9-2-2.5-1.3-4.3.8-1.9 3-2.4 4.8-1.6 1.3.6 1.7 1.8 1.2 3"/><path d="M7.7 13.8c.6.6 1.3.6 1.8 0"/>',
    monkey: '<path d="M8.4 4.1c1.8 0 3.1 1.4 3.1 3.1 0 1.8-1.4 3.1-3.1 3.1-1 0-1.8-.4-2.4-1.1l-1-.1c-.6-.2-.8-.9-.4-1.4l.6-.6c.1-1.7 1.5-3 3.2-3Z"/><path d="M10.4 9.7c2.8.6 4.5 2.8 4.5 5.8 0 1.8-.5 3.5-1.6 5H7.8c-.3-1.5.2-2.8 1.3-3.6"/><path d="M8.8 10.3c.1 2.4-.7 4.4-2.4 5.7"/><path d="M13.8 19.6c3.2.9 5.6-.4 6-3 .3-1.8-.6-3.2-2-3.2-1.2 0-1.8 1-1.4 2 .3.7 1.1.8 1.5.3"/>',
    bird: '<path d="M4.4 9.6 6.5 8.7c.6-1.7 1.8-2.4 3.2-2 1.1.3 1.7 1.2 1.7 2.5 2.1 2 4.9 3.5 8.4 4.5-2.4.5-4.8.9-7.2 1.4-2.3.8-4.3.4-5.3-1.3-.6-1-.7-2.2-.4-3.3-.9-.5-1.7-.8-2.5-.9Z"/><path d="M3 18.4c5.9-1.2 11.9-1.2 18 0"/><path d="m10.1 15.9-.3 1.7m1.9-1.9.2 1.6m3.8.2 1.4-1.9"/>',
    mystery: '<circle cx="12" cy="12" r="8.6" stroke-dasharray="2 2.2"/><path d="M9.7 9.7c.1-1.5 1-2.4 2.3-2.4 1.4 0 2.4.9 2.4 2.2 0 1.1-.6 1.7-1.5 2.2-.7.4-.9.9-.9 1.9"/><circle cx="12" cy="16.3" r=".95" fill="currentColor" stroke="none"/>',
    dice: '<g transform="rotate(12 12 12)"><rect x="4.5" y="4.5" width="15" height="15" rx="3.5"/><circle cx="8.6" cy="8.6" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.4" cy="15.4" r="1.25" fill="currentColor" stroke="none"/></g>',
    pencil: '<path d="m4.2 19.8 1-4.4L15.9 4.7a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3L8.6 18.8Z"/><path d="m14.2 6.4 3.4 3.4M5.2 15.4l3.4 3.4"/>',
    crop: '<path d="M7 3v14h14"/><path d="M3 7h14v14"/>',
    share: '<path d="M5 13.5v5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M12 15V3.8M8.2 7.5 12 3.7l3.8 3.8"/>',
    save: '<path d="M5 13.5v5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M12 3.8V15M8.2 11.2 12 15l3.8-3.8"/>',
    binder: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 3v18M7 7.5h4M7 12h4M7 16.5h4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    pin: '<path d="M12 21c-4.3-4.2-6.5-7.9-6.5-11.2a6.5 6.5 0 0 1 13 0c0 3.3-2.2 7-6.5 11.2Z"/><circle cx="12" cy="9.8" r="1.6" fill="currentColor" stroke="none"/>',
    heart: '<path d="M12 19.8c-5-3.2-8-6.4-8-10.2 0-2.4 1.7-4.1 3.8-4.1 1.8 0 3.2 1 4.2 2.7 1-1.8 2.5-2.8 4.4-2.7 2.1.1 3.7 1.9 3.6 4.3-.2 3.6-3.1 6.9-8 10Z"/>',
    camera: '<path d="M3.5 8.6A1.6 1.6 0 0 1 5.1 7h2.7l1.6-2.2h5.2L16.2 7h2.7a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/><circle cx="12" cy="12.8" r="3.5"/>',
    photos: '<path d="M7.5 4h11A1.5 1.5 0 0 1 20 5.5v10.5"/><rect x="4" y="7.5" width="12.5" height="12.5" rx="2"/><path d="m4.4 17 3.6-3.4 2.6 2.4 1.8-1.6 4 3.4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    trash: '<path d="M4 6.5h16M9.5 6.5v-2h5v2M6 6.5l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 10v7m4-7v7"/>',
    check: '<path d="m4.5 12.6 5 5 10-11"/>',
    story: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 17.6h3"/>'
  };
  function icon(name, size, sw) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.75) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || ICONS.mystery) + "</svg>";
  }
  function fillIcons(root) {
    $$("[data-icon]", root).forEach(function (el) {
      el.innerHTML = icon(el.getAttribute("data-icon"), +(el.getAttribute("data-size") || 24), el.getAttribute("data-sw"));
    });
  }

  // friendly words for the cases the engine's own message is not available (dev shortcuts, last resort)
  var MSG = {
    "not-image": { title: "That doesn’t look like a photo.", detail: "Choose a picture, or snap a new one." },
    "heic": { title: "Your phone saved this in a format we can’t read.", detail: "Take a screenshot of it and use that." },
    "unreadable": { title: "We couldn’t open that picture.", detail: "Try a different photo, or take a screenshot of it and use that." },
    "export-failed": { title: "That didn’t work.", detail: "Please try again. You can still save the picture." },
    "binder-unavailable": { title: "This browser won’t keep your cuties.", detail: "Your card still works. Send or save it so you don’t lose it." }
  };
  function info(e) {
    var code = (e && e.code) || "other", m = MSG[code] || { title: "That didn’t work.", detail: "Give it another go." };
    return { code: code, title: (e && e.title) || m.title, detail: (e && e.detail) || m.detail };
  }

  // -------------------------------------------------------------------------------------------
  // state
  // -------------------------------------------------------------------------------------------
  var STYLE_KEY = "spotted-a-cutie:style";
  function loadStyle() { try { return localStorage.getItem(STYLE_KEY); } catch (e) { return null; } }
  function saveStyle(id) { try { localStorage.setItem(STYLE_KEY, id); } catch (e) { /* the site works without it */ } }
  function validStyle(id) { return E.styles().some(function (s) { return s.id === id; }); }
  function kindName(id) { var k = E.kinds().filter(function (x) { return x.id === id; })[0]; return k ? k.name : id; }
  function kindRarity(id) { var k = E.kinds().filter(function (x) { return x.id === id; })[0]; return (k && k.rarity) || "common"; }
  function locale() { try { return navigator.language || ""; } catch (e) { return ""; } }
  function emptyTo() { return { name: "", reason: "" }; }

  var S = {
    screen: "landing",
    style: null,
    photo: null, photoBlob: null, crop0: null,    // the photo of the card being made, and its auto-crop
    kind: null,
    card: null, cur: null,                        // the engine card and my live copy of its settings
    binderId: null, dirty: false, backTo: "kind",
    rev: 0, files: {}, tFile: 0, pend: null, pendFade: false, flushing: null,
    session: [], localCount: 0,
    binderOK: null, binderBlocked: false, binderReady: null, stats: null, binderCount: null,
    thumbs: [], rv: null, adj: null, sheet: null, errAct: null, done: null, doneNote: null,
    reasonSel: "", resScroll: 0, shimmerT: 0, keepP: null, fontsP: null,
    hdepth: 0, ign: 0, relabel: null, fromPop: false       // browser history (the Android back button), see hist()
  };

  window.__cutie = {};
  Object.defineProperties(window.__cutie, {
    screen: { enumerable: true, get: function () { return S.screen; } },
    card: { enumerable: true, get: function () { return S.card || null; } },
    settings: { enumerable: true, get: function () { return S.card && S.card.settings ? S.card.settings : (S.cur ? clone(S.cur) : null); } },
    binderCount: { enumerable: true, get: function () { return S.binderCount == null ? null : S.binderCount; } }
  });

  function ensureFonts() {
    if (!S.fontsP) S.fontsP = E.textReady().catch(noop);
    return S.fontsP;
  }

  // -------------------------------------------------------------------------------------------
  // small UI pieces: toast, busy, layers (crossfading canvases), screens
  // -------------------------------------------------------------------------------------------
  var toastT = 0;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 2400);
  }
  function busy(msg) {
    var no = S.binderOK && S.stats && S.stats.nextNumber ? S.stats.nextNumber : (S.cur && S.cur.number) || (S.localCount + 1);
    $("#busyHead").textContent = "NOW PRINTING · No. " + pad3(no);
    $("#busyText").textContent = msg || "One moment…";
    $("#busy").classList.add("is-on");
  }
  function unbusy() { $("#busy").classList.remove("is-on"); }

  // a host element holding two canvases; painting a new picture crossfades from the old one
  function layersIn(el) {
    var host = $(".layers", el);
    if (!host) { host = d.createElement("div"); host.className = "layers"; el.appendChild(host); }
    initLayers(host);
    return host;
  }
  function initLayers(host) {
    if (host._now) return host;
    var old = d.createElement("canvas"), now = d.createElement("canvas");
    old.className = "cv-old"; old.setAttribute("aria-hidden", "true"); now.className = "cv-now";
    host.appendChild(now); host.appendChild(old);
    host._now = now; host._old = old; host._painted = false;
    return host;
  }
  function paintLayers(host, src, fadeMs) {
    initLayers(host);
    var now = host._now, old = host._old, fade = fadeMs && host._painted && now.width > 1;
    if (fade) {
      old.width = now.width; old.height = now.height;
      old.getContext("2d").drawImage(now, 0, 0);
      old.style.transition = "none"; old.style.opacity = "1";
    }
    if (now.width !== src.width || now.height !== src.height) { now.width = src.width; now.height = src.height; }
    var x = now.getContext("2d"); x.clearRect(0, 0, now.width, now.height); x.drawImage(src, 0, 0);
    host._painted = true;
    if (fade) {
      void old.offsetWidth;
      old.style.transition = "opacity " + fadeMs + "ms linear"; old.style.opacity = "0";
    }
  }

  function anim(el, frames, ms, easing, opts) {
    if (!el || !el.animate) {
      var last = frames[frames.length - 1];
      if (el && last && !(opts && opts.nofill)) { Object.keys(last).forEach(function (k) { if (k !== "offset") el.style[k] = last[k]; }); }
      return { cancel: noop };
    }
    var o = { duration: ms, easing: easing || "linear", fill: (opts && opts.nofill) ? "none" : "forwards" };
    if (opts && opts.delay) { o.delay = opts.delay; o.fill = "both"; }
    return el.animate(frames, o);
  }

  // the browser bar follows the screen's sheet colour (never on Kind: it stays paper)
  function setTheme(name) {
    var meta = d.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var v = "--sc-paper";
    if (name === "landing") v = "--sc-moment-landing";
    else if (name === "done") v = "--sc-moment-done";
    else if (name === "binder") v = "--sc-moment-binder";
    else if (name === "error") v = "--sc-moment-error";
    else if ((name === "reveal" || name === "result") && S.kind) v = "--sc-kind-paper-" + S.kind;
    try {
      var c = getComputedStyle(d.documentElement).getPropertyValue(v).trim();
      if (c) meta.setAttribute("content", c);
    } catch (e) { /* the bar colour is a nicety */ }
  }

  var SCREENS = ["landing", "kind", "reveal", "result", "adjust", "done", "binder", "error", "broken"];
  function show(name, opt) {
    opt = opt || {};
    var prev = S.screen;
    if (prev !== name) {
      if (prev === "landing") stopFan();
      if (prev === "binder") revokeThumbs();
      if (prev === "result" && name !== "adjust") leaveResult();
    }
    SCREENS.forEach(function (n) {
      var el = $("#screen-" + n);
      if (!el) return;
      el.classList.toggle("is-active", n === name);
      el.classList.toggle("is-quiet", n === name && !!opt.quiet);
    });
    d.body.setAttribute("data-screen", name);
    S.screen = name;
    setTheme(name);
    if (prev !== name && !S.fromPop) hist(name);
    if (opt.scrollTo != null) window.scrollTo(0, opt.scrollTo); else window.scrollTo(0, 0);
    var h = $("#screen-" + name + " [tabindex='-1']");
    if (h && !opt.noFocus) { try { h.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    if (name === "landing") enterLanding();
  }

  // -------------------------------------------------------------------------------------------
  // browser history: one entry per step deeper, so the phone's Back button goes to the previous screen instead of
  // leaving the site. show() is the only place that moves the history (hist); the popstate handler (onPop) only shows
  // screens, and sets S.fromPop so show() does not touch the history again. history.go() is asynchronous: its own
  // popstate is skipped with the S.ign counter.
  // -------------------------------------------------------------------------------------------
  var LEVEL = { landing: 0, kind: 1, binder: 1, reveal: 2, result: 2, adjust: 3, done: 3 };
  function hist(name) {
    if (!window.history || !history.pushState) return;
    try {
      if (name === "error" || name === "broken") { history.replaceState({ sc: "error", d: S.hdepth }, ""); return; }
      var target = Math.min(LEVEL[name] || 0, S.hdepth + 1), dep = S.hdepth;
      if (target > dep) { history.pushState({ sc: name, d: target }, ""); S.hdepth = target; }
      else if (target === dep) { history.replaceState({ sc: name, d: dep }, ""); }
      else { S.ign++; S.relabel = { sc: name, d: target }; S.hdepth = target; history.go(target - dep); }
    } catch (e) { /* history is a nicety: the site works without it */ }
  }
  function onPop(e) {
    if (S.ign > 0) {
      S.ign--;
      if (S.ign === 0 && S.relabel) { try { history.replaceState(S.relabel, ""); } catch (err) { /* ignore */ } S.relabel = null; }
      return;
    }
    var st = e.state || {}, name = st.sc || "landing";
    S.hdepth = st.d || 0;
    S.fromPop = true;
    try {
      if ($("#viewer") && !$("#viewer").hidden) closeViewer();
      closeSheets();
      var scr = S.screen;
      if (scr === "reveal" && S.rv) { S.rv.cancelled = true; rvClear(S.rv); }
      if (scr === "adjust" && S.adj) {
        if (name === "result" && S.card) closeAdjust(false);
        else { S.adj = null; goTo(name); }
      } else goTo(name);
    } finally { S.fromPop = false; }
  }
  function goTo(name) {
    if (name === "kind" || name === "reveal") { if (S.photo) enterKind(); else show("landing"); }
    else if (name === "result" || name === "adjust" || name === "done") { if (S.card) enterResult({ fade: true }); else show("landing"); }
    else if (name === "binder") { if (S.binderOK) openBinder(); else show("landing"); }
    else show("landing");
  }

  // -------------------------------------------------------------------------------------------
  // errors: the engine's title and detail, one clear button
  // -------------------------------------------------------------------------------------------
  function showError(e, opt) {
    unbusy(); closeSheets();
    var i = info(e); opt = opt || {};
    if (i.code === "cancelled") return;
    var label = opt.label, act = opt.act;
    if (!label) {
      if (i.code === "not-image" || i.code === "heic" || i.code === "unreadable") { label = "Pick another photo"; act = function () { $("#fPick").click(); }; }
      else if (i.code === "export-failed") { label = "Try again"; act = function () { if (S.card) backToResult(); else show("landing"); }; }
      else { label = "Start over"; act = function () { show("landing"); }; }
    }
    $("#errTitle").textContent = i.title;
    $("#errDetail").textContent = i.detail;
    $("#errStampSub").textContent = ({ "not-image": "not a photo", "heic": "can’t open this one", "unreadable": "can’t open this one", "export-failed": "lost in the post" })[i.code] || "give it another go";
    $("#errBtn .lbl").textContent = label;
    S.errAct = act || function () { show("landing"); };
    show("error");
  }

  // -------------------------------------------------------------------------------------------
  // landing (Step 1)
  // -------------------------------------------------------------------------------------------
  var FAN = { cards: [], hosts: [], styles: [], timer: 0, k: 0, ready: false };

  function enterLanding() {
    refreshBinderInfo().then(updateBinderLinks);
    updateBinderLinks();
    startFan();
  }

  function loadFan() {
    if (!E.hasSample()) { $("#fan").classList.add("is-empty"); return; }
    ensureFonts().then(function () { return E.sampleLoad(); }).then(function (cards) {
      if (!cards || cards.length < 3) throw new Error("samples");
      FAN.cards = [cards[0], cards[2], cards[1]];     // front (the cat), left (the sleeping dog), right (the dog)
      ["f1", "f2", "f3"].forEach(function (cls, i) {
        var host = layersIn($("#fan ." + cls));
        FAN.hosts[i] = host;
        FAN.styles[i] = FAN.cards[i].settings && FAN.cards[i].settings.style;
        paintLayers(host, E.render(FAN.cards[i], 0.4, "card"), 0);
      });
      FAN.ready = true;
      if (S.screen === "landing") startFan();
    }).catch(function () { $("#fan").classList.add("is-empty"); });
  }
  function startFan() {
    stopFan();
    if (!FAN.ready || reduced()) return;            // reduced motion: the fan stays still on its first styles
    FAN.timer = setInterval(stepFan, 2500);
  }
  function stopFan() { if (FAN.timer) { clearInterval(FAN.timer); FAN.timer = 0; } }
  function stepFan() {
    if (d.hidden || S.screen !== "landing") return;
    var i = FAN.k % 3; FAN.k++;
    var ids = E.styles().map(function (s) { return s.id; }), cur = FAN.styles[i], idx = ids.indexOf(cur), next = cur, j;
    for (j = 1; j <= ids.length; j++) {
      var cand = ids[(idx + j) % ids.length];
      if (FAN.styles.indexOf(cand) < 0) { next = cand; break; }
    }
    if (next === cur) return;
    FAN.styles[i] = next;
    E.update(FAN.cards[i], { style: next }).then(function () {
      if (S.screen === "landing") paintLayers(FAN.hosts[i], E.render(FAN.cards[i], 0.4, "card"), 400);
    }).catch(noop);
  }

  // -------------------------------------------------------------------------------------------
  // the binder link and the "binder not available" notes
  // -------------------------------------------------------------------------------------------
  function refreshBinderInfo() {
    if (!S.binderOK) return Promise.resolve();
    return E.binderStats().then(function (st) { S.stats = st; S.binderCount = st ? st.total : null; }).catch(noop);
  }
  function updateBinderLinks() {
    var ok = !!S.binderOK, n = S.stats && S.stats.total ? S.stats.total : 0;
    $("#lnkBinder").hidden = !(ok && n > 0);
    $("#lnkCount").textContent = n > 0 ? "(" + n + ")" : "";
    $("#resBinder").hidden = !ok; $("#resBinderSp").hidden = ok;
    $("#doneBinder").hidden = !ok;
    var note = $("#landNote");
    note.hidden = !S.binderBlocked;
    if (S.binderBlocked) $("#landNoteText").textContent = MSG["binder-unavailable"].title;
  }

  // -------------------------------------------------------------------------------------------
  // the photo (Step 2) and the kind screen (Step 3)
  // -------------------------------------------------------------------------------------------
  function openCamera() { var f = $("#fSnap"); f.value = ""; f.click(); }
  function openPicker() { var f = $("#fPick"); f.value = ""; f.click(); }

  function onPhotoPicked(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    busy("Looking at your photo…");
    E.decode(file, { maxSide: 1600 }).then(function (img) {
      S.photo = E.photoFrom(img); S.photoBlob = null; S.crop0 = E.autoCrop(S.photo);
      input.value = "";                              // so the same photo can be chosen again
      unbusy();
      enterKind();
    }).catch(function (e) {
      input.value = "";
      showError(e, { label: "Pick another photo", act: function () { $("#fPick").click(); } });
    });
  }

  function buildTiles() {
    var host = $("#tiles");
    host.innerHTML = E.kinds().map(function (k, i) {
      return '<button class="tile" type="button" data-kind="' + esc(k.id) + '"><span class="no">' + (i < 9 ? "0" : "") + (i + 1) +
        '</span><span class="ico">' + icon(k.id, 40, 1.4) + '</span><span class="lab">' + esc(k.name) + "</span></button>";
    }).join("");
  }
  function enterKind() {
    S.kindLock = false;
    $$("#tiles .tile").forEach(function (t) { t.classList.remove("is-sel"); });
    $("#printHint").hidden = !!S.hintGone;
    try { E.drawCrop($("#kindPhoto"), S.photo, S.crop0); } catch (e) { /* the print just stays blank */ }
    show("kind");
  }

  // tap the print to centre the animal: the tapped point becomes the crop centre
  function styleAspect() {
    try {
      var w = globalThis.SC.PALETTE.styles[S.style].window;
      if (w && w.w && w.h) return w.w / w.h;
    } catch (e) { /* fall back to the print's own 4:5 */ }
    return 0.8;
  }
  function centreOn(fx, fy) {
    if (!S.photo || !S.crop0) return;
    var ph = S.photo, W = 1, H = 1.25;
    // map through the crop the print really shows: drawCrop clamps it to the print's own 4:5, and the auto-crop
    // (and any earlier tap) can sit outside that, so taking it raw put the tapped point up to ~10% off
    var c = S.crop0;
    try { c = E.clampCrop(ph, S.crop0, W / H) || S.crop0; } catch (e) { c = S.crop0; }
    var s = Math.max(W / ph.width, H / ph.height) * c.zoom;       // the print's own cover scale (units per photo px)
    var next = {
      cx: c.cx + (fx - 0.5) * W / s / ph.width,
      cy: c.cy + (fy - 0.5) * H / s / ph.height,
      zoom: Math.max(c.zoom, 1.6)
    };
    try { next = E.clampCrop(ph, next, W / H) || next; } catch (e) { /* keep the unclamped crop */ }   // what the print shows; every card style clamps again to its own window when it draws
    S.crop0 = next;
    try { E.drawCrop($("#kindPhoto"), ph, next); } catch (e) { /* ignore */ }
    var ring = $("#tapRing");
    ring.style.left = (fx * 100) + "%"; ring.style.top = (fy * 100) + "%";
    ring.classList.remove("go"); void ring.offsetWidth; ring.classList.add("go");
    S.hintGone = true; $("#printHint").hidden = true;
  }
  function wirePrint() {
    var hit = $("#printHit"), cv = $("#kindPhoto");
    on(hit, "click", function (e) {
      var w = cv.clientWidth || 168, h = cv.clientHeight || 210;
      var fx = Math.min(1, Math.max(0, e.offsetX / w)), fy = Math.min(1, Math.max(0, e.offsetY / h));
      if (e.target === hit) { fx = 0.5; fy = 0.5; }
      centreOn(fx, fy);
    });
    on(hit, "keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); centreOn(0.5, 0.5); } });
  }

  // -------------------------------------------------------------------------------------------
  // making a card: traits, number, golden roll
  // -------------------------------------------------------------------------------------------
  function getRecent() {
    var p = S.binderOK ? E.binderRecent(40).catch(function () { return []; }) : Promise.resolve([]);
    return p.then(function (r) { return (r || []).concat(S.session); });
  }
  function getNextNumber() {
    if (S.binderOK) {
      return E.binderStats().then(function (st) { return (st && st.nextNumber) || 1; }).catch(function () { return ++S.localCount; });
    }
    return Promise.resolve(++S.localCount);
  }
  function randSeed() { return Math.floor(Math.random() * 2147483646) + 1; }

  // dev shortcuts that shape a card (PLAN.md 7.4); harmless when absent
  function applyQ(s) {
    if (Q.get("style") && validStyle(Q.get("style"))) s.style = Q.get("style");
    if (Q.get("golden") === "1") s.golden = true; else if (Q.get("golden") === "0") s.golden = false;
    if (Q.has("place")) s.place = (Q.get("place") || "").slice(0, E.limits().place);
    if (Q.has("number")) s.number = Math.max(1, parseInt(Q.get("number"), 10) || 1);
    if (Q.has("when")) s.when = parseInt(Q.get("when"), 10) || Date.now();
    if (Q.has("to") || Q.has("reason")) {
      var name = (Q.get("to") || "").slice(0, E.limits().to);
      s.to = name ? { name: name, reason: Q.get("reason") || "" } : emptyTo();
    }
    return s;
  }

  function spinNames(kindId, recent, real, seed) {
    var out = [], seen = {}, tries = 0;
    seen[real] = 1;
    while (out.length < 9 && tries < 40) {
      tries++;
      try {
        var t = E.generate(kindId, { seed: seed + 1013 * tries + Math.floor(Math.random() * 100000), recent: recent, locale: locale() });
        if (t && t.name && !seen[t.name]) { seen[t.name] = 1; out.push(t.name); }
      } catch (e) { break; }
    }
    var spare = ["Biscuit", "Kevin", "Mochi", "Auntie Pam", "Pickle", "Bruno", "Sir Waffles", "Gary", "Noodle"], k = 0;
    while (out.length < 9) { if (!seen[spare[k % spare.length]]) out.push(spare[k % spare.length]); k++; if (k > 40) break; }
    return out;
  }

  function prepareNew(kindId, base) {
    return getRecent().then(function (recent) {
      var s, traits, seed = Q.has("seed") ? (parseInt(Q.get("seed"), 10) || 1) : randSeed();
      var numP;
      if (base) {
        s = {
          photo: S.photo, crop: base.crop || S.crop0, kind: base.kind, traits: base.traits, style: base.style || S.style,
          golden: !!base.golden, number: base.number || 1, place: base.place || "", to: base.to || emptyTo(), when: base.when || Date.now()
        };
        numP = Promise.resolve(s.number);
      } else {
        traits = E.generate(kindId, { seed: seed, recent: recent, locale: locale() });
        s = {
          photo: S.photo, crop: S.crop0, kind: kindId, traits: traits, style: S.style,
          golden: Math.random() < E.goldenChance(), number: 1, place: "", to: emptyTo(), when: Date.now()
        };
        numP = getNextNumber();
      }
      return numP.then(function (num) {
        s.number = num;
        applyQ(s);
        var names = spinNames(s.kind, recent, s.traits.name, seed);
        var cardP = ensureFonts().then(function () { return E.cardCreate(s); });
        cardP.catch(noop);
        return { settings: s, names: names, cardP: cardP };
      });
    });
  }

  // a new card becomes the one on the result screen
  function adoptCard(card, s) {
    S.card = card;
    S.cur = { traits: clone(s.traits), style: s.style, place: s.place || "", to: clone(s.to) || emptyTo(), crop: clone(s.crop), number: s.number, kind: s.kind, golden: !!s.golden };
    S.kind = s.kind;
    S.reasonSel = (s.to && s.to.reason) || "";
    S.binderId = null; S.dirty = false; S.doneNote = null;
    S.rev++; S.files = {}; S.pend = null;
    if (S.cur.traits && S.cur.traits.name) S.session.push(S.cur.traits.name);
  }

  // -------------------------------------------------------------------------------------------
  // the reveal (Step 4): name spin, flip, stamp, golden burst
  // -------------------------------------------------------------------------------------------
  var DUR = [45, 45, 50, 60, 72, 88, 110, 140, 180, 230];     // the name spin's step lengths (DESIGN 6.2)
  var STAMP_MARK = {
    common: '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="currentColor"/></svg>',
    uncommon: '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 .8 9.2 5 5 9.2.8 5Z" fill="currentColor"/></svg>',
    rare: '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.7 6.4 6.8.5-5.2 4.4 1.7 6.7L12 16.9l-6 3.6 1.7-6.7-5.2-4.4 6.8-.5z" fill="currentColor"/></svg>'
  };
  STAMP_MARK.golden = STAMP_MARK.rare;

  function buildRing() {
    var ring = $("#rvRing"), n = 36, i, s = '<svg width="520" height="520" viewBox="0 0 520 520" aria-hidden="true" focusable="false" stroke="#b8913f" stroke-width="2" stroke-linecap="round">';
    for (i = 0; i < n; i++) {
      var a = i * 2 * Math.PI / n, c = Math.cos(a), sn = Math.sin(a);
      s += '<line x1="' + (260 + c * 212).toFixed(1) + '" y1="' + (260 + sn * 212).toFixed(1) + '" x2="' + (260 + c * 250).toFixed(1) + '" y2="' + (260 + sn * 250).toFixed(1) + '"/>';
    }
    ring.innerHTML = s + "</svg>";
  }

  function rvClear(R) { if (R) { R.timers.forEach(clearTimeout); R.timers = []; } }
  function rvReset() {
    $("#rvMeet").classList.remove("is-on");
    $("#rvReel").innerHTML = "";
    var line = $("#rvLine"); line.classList.remove("is-on"); line.style.width = "0";
    $("#rvFlip").classList.remove("is-flipped");
    var st = $("#rvStamp"); st.getAnimations && st.getAnimations().forEach(function (a) { a.cancel(); });
    st.style.opacity = "0"; st.innerHTML = ""; st.className = "rv-stamp";
    var ring = $("#rvRing"); ring.getAnimations && ring.getAnimations().forEach(function (a) { a.cancel(); }); ring.style.opacity = "0";
    $("#rvShine").classList.remove("go");
    $("#rvLive").textContent = "";
    var stage = $("#rvStage"); stage.style.animation = "none"; void stage.offsetWidth; stage.style.animation = "";
  }

  function startReveal(kindId) {
    S.kind = kindId;
    if (Q.get("reveal") === "0") {                     // dev: skip the animation
      busy("Making your card…");
      prepareNew(kindId).then(function (prep) {
        return prep.cardP.then(function (card) { adoptCard(card, prep.settings); unbusy(); S.backTo = "kind"; enterResult({}); });
      }).catch(function (e) { showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
      return;
    }
    rvReset();
    $("#screen-reveal").setAttribute("data-kind", kindId);
    var R = S.rv = { t0: Date.now(), timers: [], done: false, cancelled: false, wantSkip: false, prep: null };
    $("#rvBackNo").textContent = "#" + pad3(S.binderOK && S.stats && S.stats.nextNumber ? S.stats.nextNumber : (S.localCount + 1));
    show("reveal");
    R.timers.push(setTimeout(function () { $("#rvMeet").classList.add("is-on"); }, 260));
    prepareNew(kindId).then(function (prep) {
      if (R.cancelled) return;
      R.prep = prep;
      $("#rvBackNo").textContent = "#" + pad3(prep.settings.number);
      if (R.wantSkip) { finishReveal(R, true); return; }
      var wait = Math.max(0, 560 - (Date.now() - R.t0));
      R.timers.push(setTimeout(function () { runReveal(R); }, wait));
    }).catch(function (e) { if (!R.cancelled) showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
  }

  function rvStamp(R) {
    var s = R.prep.settings, gold = s.golden, rar = gold ? "golden" : kindRarity(s.kind);
    var st = $("#rvStamp");
    st.className = "rv-stamp" + (gold ? " gold" : "");
    st.innerHTML = "<b>" + (gold ? "GOLDEN" : rar.toUpperCase()) + "</b>" + (STAMP_MARK[rar] || STAMP_MARK.common);
    if (reduced()) { anim(st, [{ opacity: 0 }, { opacity: gold ? 1 : 0.86 }], 150, "linear"); return; }
    anim(st, [{ opacity: 0, transform: "rotate(-14deg) scale(1.55)" }, { opacity: gold ? 1 : 0.86, transform: "rotate(-9deg) scale(1)" }], 220, "cubic-bezier(.2,1.3,.4,1)");
  }
  function rvThump() {
    anim($("#rvStage"), [{ transform: "translateY(0)" }, { transform: "translateY(2px)" }, { transform: "translateY(0)" }], 80, "ease-out", { nofill: true });
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) { try { navigator.vibrate(12); } catch (e) { /* ignore */ } }
  }

  function runReveal(R) {
    if (R.done || R.cancelled) return;
    var prep = R.prep, s = prep.settings, gold = !!s.golden, real = s.traits.name;
    var reel = $("#rvReel"), W = Math.min(350, reel.parentNode.clientWidth || 350);
    function T(ms, fn) { R.timers.push(setTimeout(fn, ms)); }
    $("#rvMeet").classList.add("is-on");
    $("#rvLive").textContent = "Meet " + real;

    function mkName(text) {
      var sp = d.createElement("span"); sp.className = "rv-nm";
      var b = d.createElement("b"); b.textContent = text; sp.appendChild(b); reel.appendChild(sp);
      var w = b.offsetWidth;
      if (w > W) sp.style.fontSize = Math.max(32, Math.floor(52 * W / w)) + "px";
      return sp;
    }
    function underline(sp) {
      var line = $("#rvLine"), b = sp.firstChild, lw = Math.max(40, Math.round(Math.min(W, b.offsetWidth)));
      // a squiggle built to the name's measured width (small waves, so a long name gets a long line)
      var dd = "M2 8", x = 2, up = true, nx;
      while (x < lw - 2) { nx = Math.min(x + 14, lw - 2); dd += " Q" + ((x + nx) / 2) + " " + (up ? 1 : 15) + " " + nx + " 8"; x = nx; up = !up; }
      line.setAttribute("viewBox", "0 0 " + lw + " 14");
      line.firstElementChild.setAttribute("d", dd);
      line.style.width = lw + "px"; line.classList.add("is-on");
    }
    function flip() {
      R.prep.cardP.then(function (card) {
        if (R.cancelled || R.done) return;
        paintLayers($("#rvCardHost"), E.render(card, 0.5, "card"), 0);
        $("#rvFlip").classList.add("is-flipped");
        if (!reduced()) anim($("#rvLift"), [{ transform: "scale(1)" }, { transform: "scale(1.035)", offset: 0.5 }, { transform: "scale(1)" }], 500, "ease-in-out", { nofill: true });
      }).catch(function (e) { if (!R.cancelled) showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
    }

    if (reduced()) {
      // no spin, no flip: "Meet…" and the name arrive together, the back crossfades to the front, the stamp fades in
      var one = mkName(real); one.classList.add("is-fade"); underline(one);
      T(500, flip);
      T(800, function () { rvStamp(R); });
      T(1200, function () { finishReveal(R, false); });
      return;
    }

    // the spin: 9 throwaway names, then the real one, each sliding up; then the real name clicks into place
    var prev = null, i, at = 0;
    function step(k) {
      var name = k < 9 ? prep.names[k] : real, sp = mkName(name), dur = DUR[k];
      var last = k === 9;
      anim(sp, [{ transform: "translateY(100%)" }, { transform: last ? "translateY(-6px)" : "translateY(0)" }], dur, "cubic-bezier(.2,.75,.25,1)");
      if (prev) { var p = prev; var a = anim(p, [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], dur, "cubic-bezier(.2,.75,.25,1)"); if (a && "onfinish" in a) a.onfinish = function () { if (p.parentNode) p.parentNode.removeChild(p); }; else setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, dur + 20); }
      prev = sp;
      if (last) {
        T(dur, function () {
          anim(sp, [{ transform: "translateY(-6px)" }, { transform: "translateY(0)" }], 160, "cubic-bezier(.2,.75,.25,1)");
        });
        R.finalName = sp;
      }
    }
    for (i = 0; i < DUR.length; i++) { (function (k, when) { T(when, function () { step(k); }); })(i, at); at += DUR[i]; }
    // spin runs 0..1020, settle to 1180; hold; underline; flip; stamp; end
    T(1400, function () { if (R.finalName) underline(R.finalName); });
    T(1840, flip);
    if (!gold) {
      T(2340, function () { rvStamp(R); });
      T(2440, rvThump);
      T(3140, function () { finishReveal(R, false); });
    } else {
      T(2340, function () {
        anim($("#rvRing"), [{ opacity: 0, transform: "scale(.82)" }, { opacity: 1, transform: "scale(.96)", offset: 0.4 }, { opacity: 0, transform: "scale(1.06)" }], 900, "cubic-bezier(.2,.75,.25,1)", { nofill: true });
      });
      T(2440, function () { $("#rvShine").classList.remove("go"); void $("#rvShine").offsetWidth; $("#rvShine").classList.add("go"); });
      T(2740, function () { rvStamp(R); rvThump(); });
      T(4040, function () { finishReveal(R, false); });
    }
  }

  function finishReveal(R, instant) {
    if (R.done || R.cancelled) return;
    R.done = true; rvClear(R);
    R.prep.cardP.then(function (card) {
      adoptCard(card, R.prep.settings);
      S.backTo = "kind";
      var from = null;
      if (!instant && !reduced()) { try { from = $("#rvCardHost").getBoundingClientRect(); } catch (e) { from = null; } }
      if (from && from.width > 10) {
        anim($("#rvStamp"), [{ opacity: 0.86 }, { opacity: 0 }], 200, "linear", { nofill: false });
        setTimeout(function () { enterResult({ from: from }); }, 200);
      } else {
        enterResult({});
      }
    }).catch(function (e) { showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
  }
  function rvSkip(e) {
    var R = S.rv;
    if (!R || R.done || R.cancelled || S.screen !== "reveal") return;
    if (e && e.target && e.target.closest && e.target.closest("#rvClose")) return;
    R.wantSkip = true;
    if (R.prep) { rvClear(R); finishReveal(R, true); }
  }
  function rvCancel() {
    var R = S.rv;
    if (R) { R.cancelled = true; rvClear(R); }
    S.kindLock = false;
    if (S.photo) enterKind(); else show("landing");
  }

  // -------------------------------------------------------------------------------------------
  // result (Steps 5 and 6)
  // -------------------------------------------------------------------------------------------
  function buildResultControls() {
    $("#styleChips").innerHTML = E.styles().map(function (s) {
      return '<button class="style-chip" type="button" data-style="' + esc(s.id) + '" aria-pressed="false"><i class="mini ' + esc(s.id) + '"></i><span>' + esc(s.name) + "</span></button>";
    }).join("");
    $("#reasons").innerHTML = E.reasons().map(function (r) {
      return '<button class="reason-chip" type="button" data-reason="' + esc(r.id) + '" aria-pressed="false">' + esc(r.label) + "</button>";
    }).join("");
    var L = E.limits();
    $("#inWhere").maxLength = L.place; $("#inTo").maxLength = L.to;
    $("#cntWhere").textContent = "0/" + L.place; $("#cntTo").textContent = "0/" + L.to;
  }
  function setCount(field, counter, len, max) {
    $(counter).textContent = len + "/" + max;
    $(field).classList.toggle("is-limit", len >= max);
  }
  function chipMask(el) {
    var l = el.scrollLeft > 4, r = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    el.classList.toggle("m-l", l); el.classList.toggle("m-r", r);
  }

  function syncResultUI() {
    var c = S.cur, L = E.limits();
    $("#screen-result").setAttribute("data-kind", c.kind);
    $("#resTitle").textContent = "Cutie #" + pad3(c.number);
    $$("#styleChips .style-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-style") === c.style)); });
    $("#inWhere").value = c.place || "";
    setCount("#fldWhere", "#cntWhere", (c.place || "").length, L.place);
    $("#inTo").value = (c.to && c.to.name) || "";
    setCount("#fldTo", "#cntTo", $("#inTo").value.length, L.to);
    $$("#reasons .reason-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-reason") === S.reasonSel)); });
    $("#toHelp").hidden = !(S.reasonSel && !$("#inTo").value.trim());
    $("#delRow").hidden = !S.binderId;
    updateBinderLinks();
  }
  // needs the result screen to be on show (offsets are zero while it is hidden)
  function centerChip() {
    var chips = $("#styleChips"), sel = $("#styleChips .style-chip[aria-pressed='true']");
    if (sel) chips.scrollLeft = Math.max(0, sel.offsetLeft - (chips.clientWidth - sel.offsetWidth) / 2);
    chipMask(chips);
  }

  function paintResult(fade) {
    if (!S.card) return;
    var c;
    try { c = E.render(S.card, 0.5, "card"); }
    catch (e) { showError({ code: "export-failed" }, { label: "Try again", act: function () { show("landing"); } }); return; }
    paintLayers(layersIn($("#resCard")), c, fade ? 160 : 0);
    $("#resCard").classList.toggle("is-golden", !!S.cur.golden);
  }

  function enterResult(o) {
    o = o || {};
    layersIn($("#resCard"));
    syncResultUI();
    show("result", { quiet: !!o.from || !!o.fade, noFocus: true });
    paintResult(false);
    if (o.from) flipIn(o.from);
    setupShimmer();
    centerChip();
    scheduleCardFile();
  }
  function flipIn(from) {
    var el = $("#resCard"), to = el.getBoundingClientRect();
    if (!to.width) return;
    var dx = from.left - to.left, dy = from.top - to.top, sc = from.width / to.width;
    el.style.transformOrigin = "0 0";
    anim(el, [{ transform: "translate(" + dx + "px," + dy + "px) scale(" + sc + ")" }, { transform: "none" }], 350, "cubic-bezier(.2,.75,.25,1)", { nofill: true });
    ["g1", "g2", "g3"].forEach(function (cls, k) {
      var g = $("#screen-result ." + cls);
      if (g && g.animate) g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 350 + 40 * k, fill: "backwards", easing: "linear" });
    });
  }
  function setupShimmer() {
    clearInterval(S.shimmerT); S.shimmerT = 0;
    if (!S.cur || !S.cur.golden || reduced()) return;
    S.shimmerT = setInterval(function () {
      if (S.screen !== "result" || d.hidden) return;
      var sh = $("#resCard .shine"); sh.classList.remove("go"); void sh.offsetWidth; sh.classList.add("go");
    }, 7000);   // golden cards repeat the shimmer once every 7 s: the one allowed loop
  }
  function leaveResult() {
    clearInterval(S.shimmerT); S.shimmerT = 0;
    closeSheets();
    if (S.binderId && S.dirty) keepInBinder();
  }
  function backToResult() { enterResult({ fade: true }); }
  function resultBack() {
    if (S.backTo === "binder") openBinder();
    else if (S.backTo === "landing" || !S.photo) show("landing");
    else enterKind();
  }

  // every change goes through apply(): my copy updates at once, the engine follows, the picture crossfades
  function apply(partial, fade) {
    if (!S.card) return Promise.resolve();
    Object.assign(S.cur, partial);
    S.rev++; S.dirty = true; unarmAll();
    S.pend = Object.assign(S.pend || {}, partial);
    if (fade) S.pendFade = true;
    if (S.flushing) return S.flushing;
    S.flushing = (async function () {
      await 0;
      try {
        while (S.pend) {
          var p = S.pend, f = S.pendFade;
          S.pend = null; S.pendFade = false;
          await E.update(S.card, p);
          paintResult(f);
        }
      } catch (e) {
        S.pend = null;
        S.flushing = null;
        showError(e, { label: "Try again", act: function () { backToResult(); } });
        return;
      }
      S.flushing = null;
      scheduleCardFile();
    })();
    return S.flushing;
  }

  function recentNow() { return S.session.slice(-40); }
  function rerollWhat(what) {
    var traits;
    try { traits = E.reroll(S.cur.traits, what, { kind: S.cur.kind, recent: recentNow(), locale: locale() }); }
    catch (e) { showError(e, { label: "Try again", act: function () { backToResult(); } }); return; }
    if (traits && traits.name && traits.name !== S.cur.traits.name) S.session.push(traits.name);
    apply({ traits: traits }, true);
    syncEditValues();
  }
  function spinDie(btn) {
    var ic = $(".ico", btn); if (!ic) return;
    ic._n = (ic._n || 0) + 1; ic.style.transform = "rotate(" + (ic._n * 180) + "deg)";
  }
  function setStyle(id) {
    if (id === S.cur.style) return;
    S.style = id; saveStyle(id);
    $$("#styleChips .style-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-style") === id)); });
    var sel = $("#styleChips .style-chip[aria-pressed='true']");
    if (sel && sel.scrollIntoView) { try { sel.scrollIntoView({ inline: "center", block: "nearest", behavior: reduced() ? "auto" : "smooth" }); } catch (e) { /* ignore */ } }
    apply({ style: id }, true);
  }
  function pushTo() {
    var name = $("#inTo").value.trim();
    $("#toHelp").hidden = !(S.reasonSel && !name);
    apply({ to: name ? { name: name, reason: S.reasonSel || "" } : emptyTo() }, false);
  }
  var debT = {};
  function debounce(key, fn, ms) { clearTimeout(debT[key]); debT[key] = setTimeout(fn, ms); }

  // -------------------------------------------------------------------------------------------
  // the 4:5 file is made 300 ms after the last change; the story is made on tap
  // -------------------------------------------------------------------------------------------
  function scheduleCardFile() {
    clearTimeout(S.tFile);
    S.tFile = setTimeout(function () { if (S.card) makeFile("card").catch(noop); }, 300);
  }
  function makeFile(kind) {
    var slot = S.files[kind] || (S.files[kind] = {}), rev = S.rev;
    if (slot.file && slot.rev === rev) return Promise.resolve(slot.file);
    if (slot.p && slot.prev === rev) return slot.p;
    slot.prev = rev;
    slot.p = Promise.resolve(S.flushing).then(function () { return E.exportImage(S.card, kind); }).then(function (file) {
      if (slot.prev === rev) { slot.file = file; slot.rev = rev; slot.p = null; }
      return file;
    }, function (e) { if (slot.prev === rev) slot.p = null; throw e; });
    return slot.p;
  }

  function setBusy(btn, yes) { btn.classList.toggle("is-busy", !!yes); btn.setAttribute("aria-busy", String(!!yes)); }
  function lblOf(btn) { return $(".lbl", btn); }
  function arm(btn, fn) {
    var l = lblOf(btn); if (!btn._lbl) btn._lbl = l.textContent;
    l.textContent = "Share now"; btn._now = fn;
  }
  function unarm(btn) {
    if (!btn || !btn._now) return;
    btn._now = null; var l = lblOf(btn); if (l && btn._lbl) l.textContent = btn._lbl;
  }
  function unarmAll() { ["btnSend", "btnSave", "btnStory"].forEach(function (id) { unarm($("#" + id)); }); }

  function failOut() { showError({ code: "export-failed" }, { label: "Try again", act: function () { backToResult(); } }); }
  function shareNow(file) {
    var p = E.canShare(file) ? E.share(file) : Promise.resolve("failed");
    return p.then(function (r) { return r === "failed" ? E.save(file) : r; });
  }
  function finishOut(kind, how, r) {
    S.done = { kind: kind, how: how, r: r };
    keepInBinder().then(function () { fillDone(!!S.binderOK && !S.doneNote); show("done"); });
  }
  // called inside the tap (file already made) or straight after the file was made
  function deliver(file, how, kind, btn) {
    var p;
    try { p = how === "save" ? E.save(file) : (E.canShare(file) ? E.share(file) : E.save(file)); }
    catch (e) { failOut(); return; }
    p.then(function (r) {
      if (r === "cancelled") return;
      if (r === "failed") {                              // the phone wants a fresh tap: the button becomes "Share now"
        arm(btn, function () {
          shareNow(file).then(function (r2) { if (r2 === "cancelled") return; if (r2 === "failed") failOut(); else finishOut(kind, how, r2); });
        });
        return;
      }
      finishOut(kind, how, r);
    }).catch(failOut);
  }
  function out(kind, how, btn) {
    var rev0 = S.rev, slot = S.files[kind];
    if (slot && slot.file && slot.rev === rev0) { deliver(slot.file, how, kind, btn); return; }
    var t0 = Date.now();
    setBusy(btn, true);
    makeFile(kind).then(function (file) {
      setBusy(btn, false);
      if (rev0 !== S.rev) return;                        // something changed meanwhile: they can tap again
      if (Date.now() - t0 < 900) deliver(file, how, kind, btn);
      else arm(btn, function () { deliver(file, how, kind, btn); });
    }).catch(function (e) { setBusy(btn, false); showError(e && e.code ? e : { code: "export-failed" }, { label: "Try again", act: function () { backToResult(); } }); });
  }
  function bindOut(id, kind, how) {
    var btn = $("#" + id);
    on(btn, "click", function () {
      if (btn._now) { var f = btn._now; unarm(btn); f(); return; }
      out(kind, how, btn);
    });
  }

  // keep the card in the binder: once per card, later changes update the same id
  function keepInBinder() {
    S.keepP = (S.keepP || Promise.resolve()).then(function () {
      return (S.binderReady || Promise.resolve()).then(function () {
        if (!S.card) return;
        if (!S.binderOK) { S.doneNote = S.binderBlocked ? info({ code: "binder-unavailable" }) : null; return; }
        var p = S.binderId ? E.binderSave(S.card, { id: S.binderId }) : E.binderSave(S.card);
        return p.then(function (id) {
          if (id != null) S.binderId = id;
          if (S.card.settings && S.card.settings.number != null && S.cur) S.cur.number = S.card.settings.number;   // the binder may hand out a fresh number
          S.dirty = false; S.doneNote = null;
          return refreshBinderInfo();
        }).catch(function (e) {
          var i = info(e);
          if (i.code === "binder-unavailable") { S.binderOK = false; S.binderBlocked = true; }
          S.doneNote = i;
        });
      });
    }).catch(noop);
    return S.keepP;
  }

  // -------------------------------------------------------------------------------------------
  // edit words (the bottom sheet)
  // -------------------------------------------------------------------------------------------
  function fillCtx() {
    var c = S.cur;
    return { name: c.traits.name, kind: c.kind, place: c.place || c.traits.habitat || "", to: (c.to && c.to.name) || "" };
  }
  function fieldText(id) {
    var raw = S.cur.traits[id];
    if (raw == null) return "";
    try { return String(E.fill(String(raw), fillCtx())); } catch (e) { return String(raw); }
  }
  function syncEditValues() {
    if (S.sheet !== "sheetEdit") return;
    $$("#editRows .erow").forEach(function (row) {
      var id = row.getAttribute("data-id"), inp = $("input", row);
      if (d.activeElement !== inp) { inp.value = fieldText(id); updateRowCount(row); }
    });
  }
  function updateRowCount(row) {
    var inp = $("input", row), f = $(".field", row);
    $(".count", row).textContent = inp.value.length + "/" + inp.maxLength;
    f.classList.toggle("is-limit", inp.value.length >= inp.maxLength);
  }
  var editPending = null;
  function openEdit() {
    var ids = [], labels = {}, L = E.limits(), host = $("#editRows");
    try { ids = E.fieldsFor(S.cur.style) || []; E.fields().forEach(function (f) { labels[f.id] = f.label; }); } catch (e) { ids = ["name"]; }
    host.innerHTML = "";
    ids.forEach(function (id) {
      var row = d.createElement("div"); row.className = "erow"; row.setAttribute("data-id", id);
      var label = labels[id] || id;
      row.innerHTML = '<label class="field-l" for="ef-' + esc(id) + '">' + esc(label) + '</label>' +
        '<div class="field-row"><div class="field"><input id="ef-' + esc(id) + '" type="text" autocomplete="off" autocapitalize="sentences" enterkeyhint="done"><span class="count" aria-hidden="true"></span></div>' +
        '<button class="die-btn" type="button" aria-label="New ' + esc(label.toLowerCase()) + '"><span class="ico">' + icon("dice", 22) + "</span></button></div>";
      var inp = $("input", row);
      inp.maxLength = id === "name" ? L.name : L.line;
      inp.value = fieldText(id);
      updateRowCount(row);
      on(inp, "input", function () {
        updateRowCount(row);
        editPending = editPending || {}; editPending[id] = inp.value;
        debounce("edit", function () {
          var traits = Object.assign({}, S.cur.traits);
          Object.keys(editPending).forEach(function (k) { traits[k] = editPending[k]; });
          editPending = null;
          apply({ traits: traits }, false);
          if (S.sheet === "sheetEdit") $$("#editRows .erow").forEach(function (r) { if (r !== row) { var i2 = $("input", r); if (d.activeElement !== i2) { i2.value = fieldText(r.getAttribute("data-id")); updateRowCount(r); } } });
        }, 150);
      });
      on($(".die-btn", row), "click", function () {
        spinDie(this);
        rerollWhat(id);
        inp.value = fieldText(id); updateRowCount(row);
      });
      host.appendChild(row);
    });
    $("#sheetEdit").style.setProperty("--kt", "var(--sc-kind-tape-" + S.cur.kind + ")");
    openSheet("sheetEdit");
    try { $("#editClose").focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }

  function lockApp(yes) { var a = $("#app"); if (yes) a.setAttribute("inert", ""); else a.removeAttribute("inert"); }
  function openSheet(id) {
    $("#scrim").classList.add("is-on"); $("#" + id).classList.add("is-on");
    lockApp(true); S.sheet = id;
  }
  function closeSheets() {
    if (!S.sheet && !$("#scrim").classList.contains("is-on")) return;
    ["sheetEdit", "sheetConfirm"].forEach(function (id) { $("#" + id).classList.remove("is-on"); });
    $("#scrim").classList.remove("is-on");
    lockApp(false); S.sheet = null;
    var a = d.activeElement; if (a && a.blur && a !== d.body) a.blur();
  }

  // -------------------------------------------------------------------------------------------
  // the full-screen viewer
  // -------------------------------------------------------------------------------------------
  function openViewer() {
    var c;
    try { c = E.render(S.card, 1, "card"); } catch (e) { try { c = E.render(S.card, 0.5, "card"); } catch (e2) { return; } }
    var cv = $("#viewCanvas"); cv.width = c.width; cv.height = c.height; cv.getContext("2d").drawImage(c, 0, 0);
    $("#viewer").hidden = false; lockApp(true);
    try { $("#viewClose").focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  function closeViewer() { $("#viewer").hidden = true; lockApp(false); }

  // -------------------------------------------------------------------------------------------
  // adjust photo: drag and pinch inside the style's photo window
  // -------------------------------------------------------------------------------------------
  function ensurePhoto() {
    if (S.photo) return Promise.resolve();
    if (!S.photoBlob) return Promise.reject({ code: "unreadable" });
    var f;
    try { f = new File([S.photoBlob], "photo.jpg", { type: S.photoBlob.type || "image/jpeg" }); } catch (e) { f = S.photoBlob; }
    return E.decode(f, { maxSide: 1600 }).then(function (img) { S.photo = E.photoFrom(img); });
  }
  function rrPath(x, px, py, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
  }
  function openAdjust() {
    if (!S.card) return;
    busy("Getting the photo ready…");
    ensurePhoto().then(function () {
      unbusy();
      S.resScroll = window.scrollY || 0;
      var win = E.windowOf(S.card, S.cur.style);
      var crop0 = clone(S.cur.crop);
      try { crop0 = E.clampCrop(S.photo, crop0, win.w / win.h) || crop0; } catch (e) { /* keep as is */ }
      S.adj = { win: win, crop: crop0, ptrs: {}, g: null, raf: 0, dpr: Math.min(2, window.devicePixelRatio || 1) };
      show("adjust", { quiet: true, noFocus: true });
      sizeAdjust(); drawAdjust(); syncSlider();
    }).catch(function (e) { showError(e, { label: "Back", act: function () { backToResult(); } }); });
  }
  function sizeAdjust() {
    var A = S.adj, stageW = Math.max(240, Math.min($("#adjStage").clientWidth || 390, 480)), padY = 36;
    // as big as the screen allows: width up to the column, height up to what is left above the slider and the bar
    var maxH = Math.max(220, (window.innerHeight || 640) - 52 - 96 - 130 - padY * 2);
    A.dispW = Math.min(stageW - 24, 456, maxH * A.win.w / A.win.h); A.k = A.dispW / A.win.w; A.dispH = A.win.h * A.k;
    A.cssW = stageW; A.cssH = Math.round(A.dispH + padY * 2); A.wx = (A.cssW - A.dispW) / 2; A.wy = padY;
    var cv = $("#adjCanvas");
    cv.width = Math.round(A.cssW * A.dpr); cv.height = Math.round(A.cssH * A.dpr);
    cv.style.width = A.cssW + "px"; cv.style.height = A.cssH + "px";
    A.winCanvas = d.createElement("canvas");
    A.winCanvas.width = Math.max(1, Math.round(A.dispW * A.dpr)); A.winCanvas.height = Math.max(1, Math.round(A.dispH * A.dpr));
  }
  function drawAdjust() {
    var A = S.adj; if (!A) return;
    var cv = $("#adjCanvas"), x = cv.getContext("2d"), ph = S.photo, iw = ph.width, ih = ph.height, c = A.crop;
    x.setTransform(A.dpr, 0, 0, A.dpr, 0, 0); x.clearRect(0, 0, A.cssW, A.cssH);
    var s = Math.max(A.dispW / iw, A.dispH / ih) * c.zoom;
    var px = A.wx + A.dispW / 2 - c.cx * iw * s, py = A.wy + A.dispH / 2 - c.cy * ih * s;
    x.save(); x.globalAlpha = 0.35; x.drawImage(ph.canvas, px, py, iw * s, ih * s); x.restore();   // the cut-off part, faint
    E.drawCrop(A.winCanvas, ph, c);
    x.save(); rrPath(x, A.wx, A.wy, A.dispW, A.dispH, A.win.radius * A.k); x.clip();
    x.drawImage(A.winCanvas, A.wx, A.wy, A.dispW, A.dispH); x.restore();
    x.save(); rrPath(x, A.wx, A.wy, A.dispW, A.dispH, A.win.radius * A.k); x.lineWidth = 1.5; x.strokeStyle = "rgba(28,36,51,.6)"; x.stroke(); x.restore();
  }
  function queueDraw() { var A = S.adj; if (!A || A.raf) return; A.raf = requestAnimationFrame(function () { A.raf = 0; drawAdjust(); }); }
  function clampAdj() {
    var A = S.adj; A.crop.zoom = Math.min(4, Math.max(1, A.crop.zoom));
    A.crop = E.clampCrop(S.photo, A.crop, A.win.w / A.win.h);
    syncSlider();
  }
  function syncSlider() {
    var A = S.adj, z = $("#adjZoom"); if (!A) return;
    z.value = A.crop.zoom; z.style.setProperty("--pct", ((A.crop.zoom - 1) / 3 * 100) + "%");
  }
  function adjPan(dx, dy) {
    var A = S.adj, ph = S.photo, sd = Math.max(A.dispW / ph.width, A.dispH / ph.height) * A.crop.zoom;
    A.crop.cx -= dx / (sd * ph.width); A.crop.cy -= dy / (sd * ph.height); clampAdj();
  }
  function adjZoom(f) { var A = S.adj; A.crop.zoom = A.crop.zoom * f; clampAdj(); }
  function adjGesture() {
    var A = S.adj, pts = Object.keys(A.ptrs).map(function (k) { return A.ptrs[k]; });
    if (!pts.length) return null;
    if (pts.length === 1) return { n: 1, mx: pts[0].x, my: pts[0].y, dist: 0 };
    return { n: 2, mx: (pts[0].x + pts[1].x) / 2, my: (pts[0].y + pts[1].y) / 2, dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) };
  }
  function wireAdjust() {
    var cv = $("#adjCanvas");
    on(cv, "pointerdown", function (e) {
      var A = S.adj; if (!A) return;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      A.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; A.g = adjGesture();
    });
    on(cv, "pointermove", function (e) {
      var A = S.adj; if (!A || !A.ptrs[e.pointerId]) return;
      A.ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var g = adjGesture();
      if (A.g && g && g.n === A.g.n) {
        adjPan(g.mx - A.g.mx, g.my - A.g.my);
        if (g.n === 2 && A.g.dist > 0) adjZoom(g.dist / A.g.dist);
        queueDraw();
      }
      A.g = g;
    });
    function up(e) { var A = S.adj; if (!A) return; delete A.ptrs[e.pointerId]; A.g = adjGesture(); }
    on(cv, "pointerup", up); on(cv, "pointercancel", up);
    on(cv, "wheel", function (e) { if (!S.adj) return; e.preventDefault(); adjZoom(Math.exp(-e.deltaY * 0.0015)); queueDraw(); }, { passive: false });
    on($("#adjZoom"), "input", function () { var A = S.adj; if (!A) return; A.crop.zoom = +this.value; clampAdj(); queueDraw(); });
  }
  function closeAdjust(save) {
    var A = S.adj; S.adj = null;
    show("result", { quiet: true, noFocus: true, scrollTo: 0 });
    setupShimmer();
    if (save && A) apply({ crop: A.crop }, false);
    requestAnimationFrame(function () { chipMask($("#styleChips")); });
  }

  // -------------------------------------------------------------------------------------------
  // done (Step 7)
  // -------------------------------------------------------------------------------------------
  function fillDone(kept) {
    var name = (S.cur && S.cur.traits && S.cur.traits.name) || "Your cutie", num = S.cur ? S.cur.number : 1;
    var how = S.done && S.done.how;
    $("#doneTitle").textContent = kept ? name + " is in your binder." : (how === "save" ? "Saved." : "Sent.");
    $("#doneHand").textContent = "Cutie #" + num + "." + (num === 1 ? " A strong start." : (S.cur && S.cur.golden ? " Gold, no less." : ""));
    var filedDate = "";
    try { filedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }); } catch (e) { filedDate = ""; }
    $(".done-top").classList.toggle("unkept", !kept);
    if (kept) {
      $("#doneFiledB").textContent = "Filed";
      $("#doneFiled").textContent = "No. " + pad3(num) + (filedDate ? " · " + filedDate : "");
    } else {                                           // nothing was filed: the stamp says what really happened
      $("#doneFiledB").textContent = how === "save" ? "Saved" : "On its way";
      $("#doneFiled").textContent = how === "save" ? "to your photos" : "sent, not filed";
      $("#doneHand").textContent = "Cutie #" + num + ".";
    }
    var note = $("#doneNote");
    note.hidden = !S.doneNote;
    if (S.doneNote) $("#doneNoteText").textContent = how === "save"
      ? "Your browser won’t keep cuties, so this one lives in your photos now."
      : "Your browser won’t keep cuties, so this one lives in your chat now.";
    try { paintLayers(layersIn($("#doneMount")), E.render(S.card, 0.5, "card"), 0); } catch (e) { /* the slot just stays empty */ }
    var m = $("#doneMount"); m.classList.remove("drop"); void m.offsetWidth; m.classList.add("drop");
    updateBinderLinks();
    fillNudge(name);
  }

  // the saving nudge: one taped note after every send or save (lines: SC.CONTENT_DATA.nudges)
  var NUDGE_TITLE = { first: "first one in the book", generic: "tiny reminder", ios: "keep them safe", inapp: "you’re inside an app", blocked: "no binder here" };
  var DOTS = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></g></svg>';
  function nudgeVariant() {
    var forced = Q.get("nudge");
    if (forced && NUDGE_TITLE[forced]) return Promise.resolve(forced);
    if (!S.binderOK) return Promise.resolve("blocked");
    var b = E.sc().binder, p = b && b.keepStatus ? Promise.resolve(b.keepStatus()).catch(function () { return null; }) : Promise.resolve(null);
    return p.then(function (st) {
      if (st && st.browserOk === false) return "blocked";
      if (S.stats && S.stats.total === 1) return "first";
      if (st && st.platform === "inapp") return "inapp";
      if (st && st.platform === "ios" && st.standalone === false) return "ios";
      return "generic";
    });
  }
  function pickNudge(list, variant) {
    var key = "spotted-a-cutie:nudge:" + variant, last = -1, i;
    try { last = parseInt(localStorage.getItem(key), 10); if (isNaN(last)) last = -1; } catch (e) { last = -1; }
    i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === last) i = (i + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
    try { localStorage.setItem(key, String(i)); } catch (e) { /* fine without it */ }
    return list[i];
  }
  function fillNudge(name) {
    var host = $("#nudge"), tok = (S.nudgeTok = (S.nudgeTok || 0) + 1);
    host.hidden = true; $("#doneNote").hidden = true;
    var data = E.sc().CONTENT_DATA && E.sc().CONTENT_DATA.nudges;
    if (!data) return;
    nudgeVariant().then(function (variant) {
      if (tok !== S.nudgeTok || S.screen === "landing") return;
      var list = data[variant]; if (!list || !list.length) return;
      var html = esc(String(pickNudge(list, variant)).replace(/\{name\}/g, name).replace(/'/g, "’"));
      if (variant === "ios") html = html.replace(/\bShare\b/, 'Share <span class="nico">' + icon("share", 16, 2) + "</span>");
      if (variant === "inapp") html = html.replace(/\bmenu\b/, 'menu <span class="nico">' + DOTS + "</span>");
      $("#nudgeTitle").textContent = NUDGE_TITLE[variant];
      $("#nudgeBody").innerHTML = html;
      host.className = "note nudge v-" + variant;
      host.hidden = false;
    }).catch(noop);
  }

  // -------------------------------------------------------------------------------------------
  // binder (Step 8): an album page
  // -------------------------------------------------------------------------------------------
  var PLURAL = {
    cat: ["cat", "cats"], dog: ["dog", "dogs"], pigeon: ["pigeon", "pigeons"], crow: ["crow", "crows"], cow: ["cow", "cows"],
    squirrel: ["squirrel", "squirrels"], monkey: ["monkey", "monkeys"], bird: ["bird", "birds"], mystery: ["mystery creature", "mystery creatures"]
  };
  function countLine(byKind) {
    var parts = [];
    E.kinds().forEach(function (k) {
      var n = byKind && byKind[k.id] || 0, p = PLURAL[k.id] || [k.id, k.id + "s"];
      if (n > 0) parts.push(n + " " + (n === 1 ? p[0] : p[1]));
    });
    return parts.join(" · ");
  }
  var TAB_LABEL = { cat: "Cats", dog: "Dogs", pigeon: "Pigeons", crow: "Crows", cow: "Cows", squirrel: "Squirrels", monkey: "Monkeys", bird: "Birds", mystery: "Mystery" };
  var STAR = '<svg class="gstar" width="9" height="9" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.7 6.4 6.8.5-5.2 4.4 1.7 6.7L12 16.9l-6 3.6 1.7-6.7-5.2-4.4 6.8-.5z" fill="currentColor"/></svg>';
  function revokeThumbs() {
    S.thumbs.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) { /* ignore */ } });
    S.thumbs = [];
    $("#albumGrid").innerHTML = "";
  }
  function openBinder() {
    if (!S.binderOK) { show("landing"); return; }
    show("binder");
    renderBinder();
  }
  function renderBinder() {
    Promise.all([E.binderStats(), E.binderList()]).then(function (res) {
      if (S.screen !== "binder") { (res[1] || []).forEach(function (it) { if (it.thumbUrl) try { URL.revokeObjectURL(it.thumbUrl); } catch (e) { /* ignore */ } }); return; }
      var st = res[0] || { total: 0, golden: 0, byKind: {}, nextNumber: 1 }, list = res[1] || [];
      S.stats = st; S.binderCount = st.total; updateBinderLinks();
      S.thumbs = list.map(function (it) { return it.thumbUrl; }).filter(Boolean);
      var total = st.total || list.length;
      $("#bindTitle").innerHTML = total === 0 ? "No cuties yet" : total + (total === 1 ? " cutie" : " cuties") + (st.golden > 0 ? ' <span class="nw">spotted ·</span> <span class="badge-gold">' + st.golden + " golden</span>" : " spotted");
      var tabs = "", dots = "";
      E.kinds().forEach(function (k) {
        var n = st.byKind && st.byKind[k.id] || 0;
        if (n > 0) {
          tabs += '<span class="ktab" style="--t:var(--sc-kind-tape-' + esc(k.id) + ')"><small>' + esc(TAB_LABEL[k.id] || k.name) + "</small>" + n + "</span>";
          dots += '<i style="--t:var(--sc-kind-tape-' + esc(k.id) + ')"></i>';
        }
      });
      $("#bindCounts").innerHTML = total === 0 ? '<span class="ktab hint">Snap one and it lands here.</span>' : tabs;
      $("#albumTabs").innerHTML = dots;
      var html = list.map(function (it) {
        var gold = !!it.golden;
        return '<button class="slot' + (gold ? " golden" : "") + '" type="button" data-id="' + esc(it.id) + '" aria-label="' + esc(it.name) + ", cutie number " + esc(it.number) + '">' +
          '<span class="ph mounted' + (gold ? " gold" : "") + '"><i></i><i></i><i></i><i></i><span class="thumb"><img alt="" decoding="async" src="' + esc(it.thumbUrl || "") + '"></span></span>' +
          '<span class="cap"><b>' + esc(it.name) + "</b><span>" + (gold ? STAR : "") + "#" + pad3(it.number) + "</span></span></button>";
      }).join("");
      var n = list.length, extra = (3 - (n % 3)) % 3 + 3, next = st.nextNumber || (n + 1), i;
      for (i = 0; i < extra; i++) {
        html += '<div class="slot empty" aria-hidden="true"><span class="ph mounted empty"><i></i><i></i><i></i><i></i><span class="pencil">' + (next + i) + "</span></span></div>";
      }
      $("#albumGrid").innerHTML = html;
      $("#bindCta").hidden = n > 0;
      $("#emptyNote").hidden = n > 0;
    }).catch(function (e) { showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
  }
  function openSaved(id) {
    busy("Opening your cutie…");
    E.binderGet(id).then(function (saved) {
      return E.cardFromSaved(saved).then(function (card) { return { saved: saved, card: card }; });
    }).then(function (r) {
      unbusy();
      var st = r.card.settings || {};
      S.photo = null; S.photoBlob = r.saved && r.saved.photo || null;
      adoptCard(r.card, {
        traits: st.traits, style: st.style, place: st.place, to: st.to, crop: st.crop, number: st.number != null ? st.number : r.saved.number,
        kind: st.kind || r.saved.kind, golden: st.golden != null ? st.golden : r.saved.golden
      });
      S.binderId = id; S.backTo = "binder";
      enterResult({ fade: true });
    }).catch(function (e) { showError(e, { label: "Back to my cuties", act: openBinder }); });
  }
  function askDelete() {
    var name = (S.cur && S.cur.traits && S.cur.traits.name) || "this cutie";
    $("#confirmTitle").textContent = "Remove " + name + " from your binder?";
    openSheet("sheetConfirm");
    try { $("#confirmNo").focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  function doDelete() {
    var id = S.binderId;
    closeSheets();
    if (!id) return;
    E.binderRemove(id).then(function () {
      S.binderId = null; S.dirty = false;
      return refreshBinderInfo();
    }).then(function () { toast("Removed."); openBinder(); })
      .catch(function (e) { showError(e, { label: "Back", act: function () { backToResult(); } }); });
  }

  // -------------------------------------------------------------------------------------------
  // keyboard: text fields stay visible above the keyboard (visualViewport)
  // -------------------------------------------------------------------------------------------
  function initKeyboard() {
    var vv = window.visualViewport, root = d.documentElement;
    function isText(el) { return !!(el && el.matches && el.matches("input[type=text]")); }
    function upd() {
      if (!vv) return;
      var kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.style.setProperty("--kb", kb + "px");
      root.style.setProperty("--vvh", Math.round(vv.height) + "px");
      var a = d.activeElement;
      if (kb > 110 && isText(a) && !a.closest(".sheet")) {
        setTimeout(function () { try { a.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { /* ignore */ } }, 60);
      }
    }
    on(d, "focusin", function (e) { if (isText(e.target)) { d.body.classList.add("kb"); setTimeout(upd, 250); } });
    on(d, "focusout", function () {
      setTimeout(function () { if (!isText(d.activeElement)) { d.body.classList.remove("kb"); upd(); } }, 80);
    });
    on(d, "keydown", function (e) { if (e.key === "Enter" && isText(e.target)) { e.preventDefault(); e.target.blur(); } });
    if (vv) { vv.addEventListener("resize", upd); vv.addEventListener("scroll", upd); }
    upd();
  }

  // -------------------------------------------------------------------------------------------
  // wiring
  // -------------------------------------------------------------------------------------------
  function wire() {
    // landing: Snap opens the phone's camera app, Pick opens the photo library (no getUserMedia)
    on($("#btnSnap"), "click", openCamera);
    on($("#btnPick"), "click", openPicker);
    on($("#fSnap"), "change", function () { onPhotoPicked(this); });
    on($("#fPick"), "change", function () { onPhotoPicked(this); });
    on($("#lnkBinder"), "click", openBinder);

    // kind
    on($("#kindBack"), "click", function () { show("landing"); });
    wirePrint();
    on($("#tiles"), "click", function (e) {
      var t = e.target.closest && e.target.closest(".tile");
      if (!t || S.kindLock) return;
      S.kindLock = true; t.classList.add("is-sel");
      var id = t.getAttribute("data-kind");
      setTimeout(function () { startReveal(id); }, reduced() ? 0 : 140);
    });

    // reveal
    on($("#screen-reveal"), "pointerdown", rvSkip);
    on($("#rvClose"), "click", rvCancel);

    // result
    on($("#resBack"), "click", resultBack);
    on($("#resBinder"), "click", openBinder);
    on($("#resCard"), "click", openViewer);
    on($("#resCard"), "keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(); } });
    on($("#styleChips"), "click", function (e) { var b = e.target.closest && e.target.closest(".style-chip"); if (b) setStyle(b.getAttribute("data-style")); });
    on($("#styleChips"), "scroll", function () { chipMask(this); }, { passive: true });
    on($("#toolName"), "click", function () { spinDie(this); rerollWhat("name"); });
    on($("#toolAll"), "click", function () { spinDie(this); rerollWhat("all"); });
    on($("#toolEdit"), "click", openEdit);
    on($("#toolAdjust"), "click", openAdjust);
    on($("#inWhere"), "input", function () {
      var v = this.value; setCount("#fldWhere", "#cntWhere", v.length, E.limits().place);
      debounce("where", function () { apply({ place: v.trim() }, false); }, 150);
    });
    on($("#inTo"), "input", function () {
      setCount("#fldTo", "#cntTo", this.value.length, E.limits().to);
      debounce("to", pushTo, 150);
    });
    on($("#reasons"), "click", function (e) {
      var b = e.target.closest && e.target.closest(".reason-chip"); if (!b) return;
      var id = b.getAttribute("data-reason");
      S.reasonSel = S.reasonSel === id ? "" : id;                 // tap again to clear
      $$("#reasons .reason-chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-reason") === S.reasonSel)); });
      pushTo();
    });
    bindOut("btnSend", "card", "share");
    bindOut("btnSave", "card", "save");
    bindOut("btnStory", "story", "share");
    on($("#btnDelete"), "click", askDelete);
    on($("#confirmYes"), "click", doDelete);
    on($("#confirmNo"), "click", closeSheets);

    // edit sheet
    on($("#editClose"), "click", closeSheets);
    on($("#editDone"), "click", closeSheets);
    on($("#scrim"), "click", closeSheets);
    on(d, "keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!$("#viewer").hidden) closeViewer(); else if (S.sheet) closeSheets();
    });

    // viewer
    on($("#viewer"), "click", closeViewer);
    on($("#viewClose"), "click", closeViewer);

    // adjust
    wireAdjust();
    on($("#adjDone"), "click", function () { closeAdjust(true); });
    on($("#adjCancel"), "click", function () { closeAdjust(false); });
    on($("#adjBack"), "click", function () { closeAdjust(false); });

    // done
    on($("#doneAgain"), "click", function () {
      S.reasonSel = ""; apply({ to: emptyTo() }, true);
      enterResult({ fade: true });
      var g = $("#hTo"); if (g) window.scrollTo(0, Math.max(0, g.getBoundingClientRect().top + window.scrollY - 80));
      setTimeout(function () { try { $("#inTo").focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 120);
    });
    on($("#doneStyle"), "click", function () { enterResult({ fade: true }); window.scrollTo(0, 0); });
    on($("#doneNew"), "click", function () { S.card = null; S.cur = null; S.binderId = null; S.photo = null; show("landing"); });
    on($("#doneBinder"), "click", openBinder);

    // binder
    on($("#bindBack"), "click", function () { show("landing"); });
    on($("#bindSnap"), "click", openCamera);
    on($("#albumGrid"), "click", function (e) {
      var s = e.target.closest && e.target.closest(".slot[data-id]");
      if (s) openSaved(s.getAttribute("data-id"));
    });

    // errors
    on($("#errBtn"), "click", function () { var f = S.errAct; if (f) f(); else show("landing"); });
    on($("#brokenBtn"), "click", function () { location.reload(); });

    try { history.replaceState({ sc: "landing", d: 0 }, ""); } catch (e) { /* ignore */ }
    on(window, "popstate", onPop);
    on(d, "visibilitychange", function () { if (d.hidden) stopFan(); else if (S.screen === "landing") startFan(); });
    on(window, "resize", function () { chipMask($("#styleChips")); });
    if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (S.screen === "landing") startFan(); });
  }

  // -------------------------------------------------------------------------------------------
  // 4. dev shortcuts (PLAN.md 7.4)
  // -------------------------------------------------------------------------------------------
  var DEV_ERR = {
    "error-not-image": "not-image",
    "error-heic": "heic"
  };

  function loadDevPhoto(kindId) {
    var p = Q.get("photo"), url;
    if (p) url = p.indexOf("/") >= 0 ? p : "assets/sample/" + p + (/\.\w+$/.test(p) ? "" : ".jpg");
    else url = kindId === "dog" ? "assets/sample/dog.jpg" : "assets/sample/cat.jpg";
    return fetch(url).then(function (r) { if (!r.ok) throw { code: "unreadable" }; return r.blob(); }).then(function (b) {
      var f; try { f = new File([b], url.split("/").pop(), { type: b.type || "image/jpeg" }); } catch (e) { f = b; }
      return E.decode(f, { maxSide: 1600 });
    }).then(function (img) { S.photo = E.photoFrom(img); S.photoBlob = null; S.crop0 = E.autoCrop(S.photo); });
  }
  function devKind() { var k = Q.get("kind"); return E.kinds().some(function (x) { return x.id === k; }) ? k : "cat"; }
  function buildDevCard() {
    var kindId = devKind();
    return loadDevPhoto(kindId).then(function () { return ensureFonts(); }).then(function () {
      if (!Q.has("kind") && !Q.has("seed") && E.hasSample()) {          // ?sample=1: the first sample card (the cat, in Trading)
        return E.sampleLoad().then(function (cards) { return cards && cards[0] && cards[0].settings; }).catch(function () { return null; });
      }
      return null;
    }).then(function (base) { return prepareNew(kindId, base); }).then(function (prep) {
      return prep.cardP.then(function (card) { adoptCard(card, prep.settings); S.backTo = "landing"; });
    });
  }
  function devRoute(scr) {
    busy("Getting the sample ready…");
    var photoOnly = scr === "kind" || scr === "reveal";
    var p = photoOnly ? loadDevPhoto(devKind()) : buildDevCard();
    p.then(function () {
      unbusy();
      if (scr === "frame") return devFrame();
      if (scr === "kind") return enterKind();
      if (scr === "reveal") return startReveal(devKind());       // &reveal=0 is handled inside startReveal
      if (scr === "done" || scr === "error-binder") {
        S.done = { kind: "card", how: "share", r: "shared" };
        if (scr === "error-binder") { S.doneNote = info({ code: "binder-unavailable" }); S.binderOK = false; S.binderBlocked = true; fillDone(false); }
        else { S.doneNote = null; fillDone(true); }
        return show("done");
      }
      enterResult({});
      if (scr === "edit") openEdit();
      else if (scr === "adjust") openAdjust();
    }).catch(function (e) { showError(e, { label: "Back to the start", act: function () { show("landing"); } }); });
  }
  function devFrame() {
    var fmt = Q.get("format") === "story" ? "story" : "card";
    var c = E.render(S.card, 1, fmt), cv = $("#frameCanvas");
    cv.width = c.width; cv.height = c.height; cv.getContext("2d").drawImage(c, 0, 0);
    d.body.classList.add("is-frame"); d.body.setAttribute("data-screen", "frame"); S.screen = "frame";
  }
  function route() {
    var scr = Q.get("screen") || "", sample = Q.get("sample") === "1";
    if (DEV_ERR[scr]) { showError({ code: DEV_ERR[scr] }); return true; }
    if (scr === "landing") { return false; }
    if (scr === "binder") { (S.binderReady || Promise.resolve()).then(openBinder); return true; }
    if (sample || scr) {
      if (scr === "error-binder") { devRoute("error-binder"); return true; }
      devRoute(scr || "result"); return true;
    }
    return false;
  }

  // -------------------------------------------------------------------------------------------
  // start-up
  // -------------------------------------------------------------------------------------------
  function init() {
    fillIcons(d); fillFooter();
    var miss = E.missing();
    if (miss.length) {
      if (window.console && console.warn) console.warn("Spotted a Cutie: the card engine is missing " + miss.join(", "));
      on($("#brokenBtn"), "click", function () { location.reload(); });
      show("broken");
      return;
    }
    var remembered = loadStyle();
    S.style = remembered && validStyle(remembered) ? remembered : (validStyle(E.defaultStyle()) ? E.defaultStyle() : E.styles()[0].id);
    buildTiles(); buildResultControls(); buildRing();
    wire(); initKeyboard();

    // the binder: only offered when the browser will keep it
    if (E.hasBinder()) {
      S.binderReady = E.binderAvailable().then(function (ok) { S.binderOK = !!ok; S.binderBlocked = !ok; }).catch(function () { S.binderOK = false; S.binderBlocked = true; });
    } else {
      S.binderReady = Promise.resolve(); S.binderOK = false; S.binderBlocked = false;
    }
    S.binderReady.then(refreshBinderInfo).then(updateBinderLinks);

    loadFan();
    if (!route()) { show("landing"); }
  }
  init();
})();
