// Contract check: loads src/engine/*.js in Node (vm, PLAN.md 6.1 order, no browser) and checks that every
// name in PLAN.md 7.3 exists with the right type, that the constants match, that the palette and the words cover
// every style and kind, that generate fills every field, that fileName gives the names in PLAN.md section 3 Step 6,
// that clampCrop keeps the window covered, that app.js only calls SC names that exist, and the script order in index.html.
// Pattern copied from ../look-up/tests/smoke.js.
//   node tests/smoke.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ORDER = ["util", "palette", "decode", "content-data", "content", "photo", "grade", "art", "text", "styles", "card", "binder", "sample", "export", "share"];

// minimal stand-ins for the browser: nothing here may be needed at load time (no document, no window, no navigator)
const sandbox = {
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout, URL: URL, Promise: Promise, Intl: Intl, Date: Date, Math: Math,
  Uint8Array: Uint8Array, Float32Array: Float32Array, Float64Array: Float64Array, Int32Array: Int32Array, Uint8ClampedArray: Uint8ClampedArray,
  Uint32Array: Uint32Array, WeakMap: WeakMap, Map: Map, Set: Set, JSON: JSON, File: File, Blob: Blob
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

let fails = 0;
function report(ok, label, extra) {
  if (!ok) fails += 1;
  console.log((ok ? "PASS " : "FAIL ") + label + (extra ? "  (" + extra + ")" : ""));
}

for (const name of ORDER) {
  const file = path.join(ROOT, "src", "engine", name + ".js");
  try {
    vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
    report(true, "load src/engine/" + name + ".js");
  } catch (e) {
    report(false, "load src/engine/" + name + ".js", e && e.message);
  }
}

const SC = sandbox.SC || {};
function get(p) { return p.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, SC); }
function has(p, type) {
  const v = get(p);
  const t = Array.isArray(v) ? "array" : typeof v;
  report(v != null && t === type, "SC." + p + " is " + type, t === type ? "" : "found " + t);
}
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); } // objects from the vm have another realm's prototypes

// ---- PLAN.md 7.3 names ----
["KINDS", "STYLES", "REASONS"].forEach(function (n) { has(n, "array"); });
["DEFAULTS", "CARD", "STORY", "LIMITS", "PALETTE", "CONTENT_DATA"].forEach(function (n) { has(n, "object"); });
has("GOLDEN_CHANCE", "number");
has("content.FIELDS", "array");
["generate", "reroll", "fill", "recipientLine", "fieldsFor"].forEach(function (n) { has("content." + n, "function"); });
has("decode.fileToImageData", "function");
["from", "autoCrop", "clampCrop", "drawCrop"].forEach(function (n) { has("photo." + n, "function"); });
has("text.ready", "function");
has("card.create", "function");
has("card.fromSaved", "function");
["available", "save", "list", "get", "remove", "stats", "recentNames"].forEach(function (n) { has("binder." + n, "function"); });
has("export.image", "function");
has("export.fileName", "function");
has("sample.load", "function");
["platform", "canShare", "share", "save"].forEach(function (n) { has("share." + n, "function"); });
has("util.error", "function");

// ---- constants match PLAN.md 7.3 ----
report(same(SC.KINDS, [{ id: "cat", name: "Cat", rarity: "common" }, { id: "dog", name: "Dog", rarity: "common" }, { id: "pigeon", name: "Pigeon", rarity: "common" }, { id: "crow", name: "Crow", rarity: "common" }, { id: "cow", name: "Cow", rarity: "uncommon" }, { id: "squirrel", name: "Squirrel", rarity: "uncommon" }, { id: "monkey", name: "Monkey", rarity: "rare" }, { id: "bird", name: "Other bird", rarity: "uncommon" }, { id: "mystery", name: "Something else", rarity: "rare" }]), "KINDS match PLAN.md");
report(same(SC.STYLES, [{ id: "minimal", name: "Minimal" }, { id: "trading", name: "Trading card" }, { id: "polaroid", name: "Polaroid" }, { id: "wanted", name: "Wanted" }, { id: "dating", name: "Dating" }, { id: "news", name: "Breaking news" }]), "STYLES match PLAN.md");
report(same(SC.REASONS, [{ id: "twin", label: "Found your twin" }, { id: "soulmate", label: "Found your soulmate" }, { id: "boyfriend", label: "Your new boyfriend" }, { id: "girlfriend", label: "Your new girlfriend" }, { id: "hi", label: "Says hi" }, { id: "missyou", label: "Reminded me of you" }, { id: "replacement", label: "Your replacement" }, { id: "meet", label: "Wants to meet you" }]), "REASONS match PLAN.md");
report(same(SC.DEFAULTS, { style: "trading" }), "DEFAULTS match PLAN.md", JSON.stringify(SC.DEFAULTS));
report(same(SC.CARD, { w: 1080, h: 1350 }), "CARD matches PLAN.md");
report(same(SC.STORY, { w: 1080, h: 1920, card: { x: 90, y: 300, w: 900, h: 1125, rotate: -2 } }), "STORY matches PLAN.md");
report(SC.GOLDEN_CHANCE === 0.05, "GOLDEN_CHANCE is 0.05");
report(same(SC.LIMITS, { name: 20, place: 32, to: 16, line: 60 }), "LIMITS match PLAN.md", JSON.stringify(SC.LIMITS));
report(same((SC.content.FIELDS || []).map(function (f) { return f.id; }),
  ["name", "title", "mood", "habitat", "diet", "knownFor", "weakness", "threat", "aka", "catchphrase", "crime", "reward", "headline", "greenFlag", "redFlag", "lookingFor", "loveLanguage", "distance", "flavour"]), "content.FIELDS ids match PLAN.md");

// ---- palette and words cover every style and kind ----
const P = SC.PALETTE || {};
report(!!P.styles && SC.STYLES.every(function (s) { return !!P.styles[s.id]; }), "PALETTE.styles has an entry for every style id", SC.STYLES.filter(function (s) { return !(P.styles && P.styles[s.id]); }).map(function (s) { return s.id; }).join(","));
report(!!P.kinds && SC.KINDS.every(function (k) { return !!P.kinds[k.id]; }), "PALETTE.kinds has an entry for every kind id", SC.KINDS.filter(function (k) { return !(P.kinds && P.kinds[k.id]); }).map(function (k) { return k.id; }).join(","));

const CD = SC.CONTENT_DATA || {};
report(!!CD.kinds && SC.KINDS.every(function (k) { return !!CD.kinds[k.id]; }), "CONTENT_DATA has all 9 kinds");
let lines = 0, badLines = [];
SC.STYLES.forEach(function (s) {
  SC.REASONS.forEach(function (r) {
    const l = CD.recipient && CD.recipient[s.id] && CD.recipient[s.id][r.id];
    if (typeof l === "string" && l.length > 3) lines++; else badLines.push(s.id + "/" + r.id);
  });
});
report(lines === 48, "CONTENT_DATA has the 6x8 recipient lines", lines + "/48 " + badLines.slice(0, 4).join(","));

// ---- generate: every field, non-empty, no "{" left (after fill) ----
let genBad = [];
SC.KINDS.forEach(function (k) {
  for (let seed = 1; seed <= 5; seed++) {
    const t = SC.content.generate(k.id, { seed: seed * 977, recent: [], locale: "en-GB" });
    const ctx = { name: t.name, kind: k.id, place: "the wall", to: "Priya" };
    SC.content.FIELDS.forEach(function (f) {
      const v = t[f.id];
      const s = SC.content.fill(v == null ? "" : v, ctx);
      if (typeof v !== "string" || !v.trim() || /[{}]/.test(s) || /[{}]/.test(v)) genBad.push(k.id + "." + f.id);
    });
    if (!(t.age >= 1) || !t.stats || !Array.isArray(t.moves) || t.moves.length !== 2 || !t.seeds) genBad.push(k.id + ".age/stats/moves/seeds");
  }
});
report(genBad.length === 0, "content.generate gives every field, non-empty, no { left, for all 9 kinds", genBad.slice(0, 5).join(","));
const t0 = SC.content.generate("cat", { seed: 5 });
const t1 = SC.content.reroll(t0, "name", { kind: "cat" });
report(t1 !== t0 && t1.mood === t0.mood && t1.name !== undefined, "content.reroll returns a new object and leaves other fields");
report(SC.content.fill("{kind}", { kind: "cat" }) === "CAT", "content.fill renders {kind} as CAT");
report(SC.content.recipientLine("trading", "twin", { name: "Larry", to: "Priya", kind: "cat" }).indexOf("Priya") >= 0, "content.recipientLine uses {to}");
report(SC.STYLES.every(function (s) { const f = SC.content.fieldsFor(s.id); return Array.isArray(f) && f.length > 0 && f.every(function (id) { return SC.content.FIELDS.some(function (x) { return x.id === id; }); }); }), "content.fieldsFor gives valid field ids for every style");

// ---- fileName (PLAN.md section 3 Step 6) ----
(function () {
  const d = new Date(2026, 9, 9, 12, 0, 0);
  const mk = function (name) { return { settings: { traits: { name: name } } }; };
  const fn = SC.export.fileName;
  report(fn(mk("Larry"), "card", d) === "spotted-a-cutie-larry-2026-10-09.jpg", "fileName card", fn(mk("Larry"), "card", d));
  report(fn(mk("Larry"), "story", d) === "spotted-a-cutie-larry-story-2026-10-09.jpg", "fileName story", fn(mk("Larry"), "story", d));
  report(fn(mk(""), "card", d) === "spotted-a-cutie-cutie-2026-10-09.jpg", "fileName empty name -> cutie", fn(mk(""), "card", d));
  report(fn(mk("Sir Larry Jr."), "card", d) === "spotted-a-cutie-sir-larry-jr-2026-10-09.jpg", "fileName Sir Larry Jr. -> sir-larry-jr", fn(mk("Sir Larry Jr."), "card", d));
  report(/^spotted-a-cutie-[a-z0-9-]+-\d{4}-\d\d-\d\d\.jpg$/.test(fn(mk("Dr. Müller 3rd!"), "card", d)), "fileName only a-z 0-9 and hyphens", fn(mk("Dr. Müller 3rd!"), "card", d));
})();

// ---- clampCrop: zoom >= 1 and the window covered ----
(function () {
  const photo = { width: 1600, height: 1200, canvas: {} };
  let ok = true, why = "";
  [0.5, 1, 1.15, 2, 4, 9].forEach(function (z) {
    [0.45, 1].forEach(function (aspect) {
      [-1, 0, 0.5, 1, 2].forEach(function (cx) {
        const c = SC.photo.clampCrop(photo, { cx: cx, cy: cx, zoom: z }, aspect);
        // area shown in photo px
        let sw, sh;
        if (photo.width / photo.height > aspect) { sh = photo.height / c.zoom; sw = sh * aspect; } else { sw = photo.width / c.zoom; sh = sw / aspect; }
        const x0 = c.cx * photo.width - sw / 2, x1 = c.cx * photo.width + sw / 2, y0 = c.cy * photo.height - sh / 2, y1 = c.cy * photo.height + sh / 2;
        if (c.zoom < 1 || x0 < -0.001 || y0 < -0.001 || x1 > photo.width + 0.001 || y1 > photo.height + 0.001) { ok = false; why = JSON.stringify({ z: z, aspect: aspect, cx: cx, c: c }); }
      });
    });
  });
  report(ok, "photo.clampCrop keeps zoom >= 1 and the window covered", why);
  report(SC.photo.clampCrop(photo, { cx: 0.5, cy: 0.5, zoom: 0.2 }, 1).zoom === 1, "clampCrop lifts zoom 0.2 to 1");
})();

// ---- every SC.* call in index.html and src/app.js exists ----
(function () {
  const src = fs.readFileSync(path.join(ROOT, "src", "app.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const seen = {}, miss = [];
  const re = /E\.sc\(\)\.([A-Za-z_]+(?:\.[A-Za-z_]+)?)|\bSC\.([A-Za-z_]+(?:\.[A-Za-z_]+)?)/g;
  let m;
  while ((m = re.exec(src))) {
    const p = m[1] || m[2];
    if (seen[p]) continue; seen[p] = 1;
    if (get(p) === undefined) miss.push(p);
  }
  report(miss.length === 0, "every SC.* name used by app.js and index.html exists (" + Object.keys(seen).length + " names)", miss.join(","));
})();

// ---- script order in index.html (PLAN.md 6.1) ----
(function () {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const found = [];
  const re = /<script[^>]*\ssrc="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) if (/^src\//.test(m[1])) found.push(m[1].replace(/^src\/(engine\/)?/, "").replace(/\.js$/, ""));
  const want = ORDER.concat(["app"]);
  report(same(found, want), "index.html loads scripts in PLAN.md 6.1 order", found.join(","));
  const css = [], re2 = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g;
  while ((m = re2.exec(html))) css.push(m[1]);
  report(same(css, ["src/design-tokens.css", "src/styles.css"]), "index.html loads design-tokens.css then styles.css", css.join(","));
})();

// ---- fonts named in the CSS and the palette exist as files ----
(function () {
  const css = fs.readFileSync(path.join(ROOT, "src", "design-tokens.css"), "utf8");
  const files = [], re = /url\(["']?\.\.\/(fonts\/[^"')]+)["']?\)/g;
  let m;
  while ((m = re.exec(css))) files.push(m[1]);
  const missing = files.filter(function (f) { return !fs.existsSync(path.join(ROOT, f)); });
  report(files.length > 0 && missing.length === 0, "every font file named in design-tokens.css exists (" + files.length + ")", missing.join(","));
})();

console.log(fails === 0 ? "\nSMOKE: PASS" : "\nSMOKE: FAIL (" + fails + ")");
process.exit(fails === 0 ? 0 : 1);
