// Node tests for the M1 engine: content logic and crop maths. Run: node tests/engine/engine.test.js
// Loads the classic scripts the way the page does (globalThis.SC); nothing here needs a browser.
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..", "..", "src", "engine");
["util", "palette", "content-data", "content", "photo", "card"].forEach(function (f) {
  vm.runInThisContext(fs.readFileSync(path.join(dir, f + ".js"), "utf8"), { filename: f + ".js" });
});
const SC = globalThis.SC, C = SC.content;
let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log("FAIL  " + msg); } }
function section(t) { console.log("\n" + t); }

const kinds = SC.KINDS.map(function (k) { return k.id; });
const HESHE = /\b(he|she|him|her|his|hers|himself|herself)\b/i;

// ---------- 200 cards ----------
section("200 generated cards");
C.resetSession();
const cards = [];
for (let i = 0; i < 200; i++) {
  const kind = kinds[i % kinds.length];
  const t = C.generate(kind, { seed: 1000 + i * 7919, locale: "en-GB" });
  cards.push({ kind: kind, t: t });
}
cards.forEach(function (cd, i) {
  const t = cd.t, ctx = { name: t.name, kind: cd.kind, place: "on a scooter seat", to: "Priya" };
  C.FIELDS.forEach(function (f) {
    const raw = t[f.id];
    ok(typeof raw === "string" && raw.trim().length > 0, "card " + i + " empty field " + f.id);
    const s = C.fill(raw, ctx);
    ok(!/[{}]/.test(s), "card " + i + " unfilled placeholder in " + f.id + ": " + s);
    ok(!HESHE.test(s), "card " + i + " he/she in " + f.id + ": " + s);
    ok(s.length <= SC.LIMITS.line, "card " + i + " " + f.id + " longer than " + SC.LIMITS.line + ": " + s);
    ok(!/["']/.test(s), "card " + i + " straight quote in " + f.id + ": " + s);
  });
  ok(t.name.length <= SC.LIMITS.name, "name too long: " + t.name);
  ok(t.age >= 1 && t.age <= 12 && Number.isInteger(t.age), "age " + t.age);
  ["chaos", "fluff", "sass"].forEach(function (k) {
    ok(t.stats[k] >= 10 && t.stats[k] <= 100 && t.stats[k] % 10 === 0, "stat " + k + "=" + t.stats[k]);
  });
  ok(t.moves.length === 2 && t.moves[0].name !== t.moves[1].name, "two different moves");
  t.moves.forEach(function (m) { ok(m.name && m.text && m.damage >= 10 && m.damage <= 120, "move " + JSON.stringify(m)); });
  ok(t.seeds && Object.keys(t.seeds).length >= 20, "per-field seeds");
  ok(!/[{}]/.test(C.fill(t.flavour, ctx)), "flavour filled");
});
ok(new Set(cards.map(function (c) { return c.t.name.toLowerCase(); })).size >= 195, "names are (nearly) all different across 200 cards");
let sameNeighbour = 0;
for (let i = 1; i < cards.length; i++) ["crime", "flavour", "headline", "catchphrase", "mood"].forEach(function (f) { if (cards[i][f] && 0) sameNeighbour++; if (cards[i].t[f] === cards[i - 1].t[f]) sameNeighbour++; });
ok(sameNeighbour === 0, "consecutive cards never share a crime/flavour/headline/catchphrase/mood (" + sameNeighbour + " did)");
// repeat rate of the worst field over 200 cards
(function () {
  const worst = {};
  C.LIST_FIELDS.forEach(function (f) { const m = {}; cards.forEach(function (c) { m[c.t[f]] = (m[c.t[f]] || 0) + 1; }); worst[f] = Math.max.apply(null, Object.keys(m).map(function (k) { return m[k]; })); });
  console.log("  most repeats of any single line over 200 cards:", JSON.stringify(worst));
})();

// ---------- reroll ----------
section("reroll");
C.resetSession();
let changed = 0, total = 0;
let base = C.generate("cat", { seed: 42 });
C.LIST_FIELDS.concat(["age", "stats", "moves"]).forEach(function (f) {
  for (let n = 0; n < 5; n++) {
    base = C.generate("cat", { seed: 42 + n * 13 });
    const r = C.reroll(base, f, { kind: "cat" });
    Object.keys(base).forEach(function (k) {
      if (k === "seeds" || k === "tpl" || k === f) return;
      ok(JSON.stringify(r[k]) === JSON.stringify(base[k]), "reroll " + f + " changed " + k);
    });
    ok(r.name === base.name, "reroll " + f + " changed the name");
    total++; if (JSON.stringify(r[f]) !== JSON.stringify(base[f])) changed++;
    ok(r.seeds[f] !== base.seeds[f], "reroll gives " + f + " a new seed");
    Object.keys(base.seeds).forEach(function (k) { if (k !== f) ok(r.seeds[k] === base.seeds[k], "reroll " + f + " moved seed of " + k); });
  }
});
ok(changed / total >= 0.9, "a reroll almost always changes its field (" + changed + "/" + total + ")");
base = C.generate("cat", { seed: 4242 });
const all = C.reroll(base, "all", { kind: "cat" });
ok(all.name === base.name, "'all' keeps the name");
ok(C.LIST_FIELDS.filter(function (f) { return all[f] !== base[f]; }).length >= 12, "'all' changes most fields");
const nm = C.reroll(base, "name", { kind: "cat" });
ok(nm.name !== base.name, "name reroll changes the name");
ok(base.mood === nm.mood && base.title === nm.title, "name reroll leaves the lines alone");
// {name} inside a line follows a name reroll
(function () {
  let t = null;
  for (let s = 1; s < 400 && !t; s++) { const x = C.generate("dog", { seed: s, memory: false }); if (x.tpl && x.tpl.flavour) t = x; }
  ok(!!t, "found a flavour that quotes the name");
  if (t) {
    ok(t.flavour.indexOf(t.name) >= 0, "flavour has the name filled in");
    const r = C.reroll(t, "name", { kind: "dog", memory: false });
    ok(r.flavour.indexOf(r.name) >= 0 && r.name !== t.name, "name reroll refreshes {name} in the flavour");
    const edited = JSON.parse(JSON.stringify(t)); edited.flavour = "My own words.";
    ok(C.reroll(edited, "name", { kind: "dog", memory: false }).flavour === "My own words.", "an edited line is not overwritten");
  }
})();

// ---------- names ----------
section("names, prefix, suffix, locale, golden");
C.resetSession();
const D = SC.CONTENT_DATA;
const human = new Set(D.names.human), soft = new Set(D.names.soft), desi = new Set(D.desiNames), pref = new Set(D.names.prefixes), suf = new Set(D.names.suffixes);
function stats(locale, n) {
  let kindN = 0, humanN = 0, softN = 0, desiN = 0, pre = 0, su = 0, tooLong = 0;
  for (let i = 0; i < n; i++) {
    const t = C.generate(kinds[i % 9], { seed: 77000 + i * 31, locale: locale, memory: false });
    let nm = t.name, w = nm.split(" ");
    if (pref.has(w[0]) && w.length > 1) { pre++; w.shift(); }
    const lastTwo = w.slice(-2).join(" ");
    if (suf.has(lastTwo)) { su++; w = w.slice(0, -2); } else if (suf.has(w[w.length - 1]) && w.length > 1) { su++; w.pop(); }
    const base = w.join(" ");
    if (desi.has(base)) desiN++; else if (soft.has(base)) softN++; else if (human.has(base)) humanN++; else kindN++;
    if (t.name.length > SC.LIMITS.name) tooLong++;
  }
  return { kindN: kindN / n, humanN: humanN / n, softN: softN / n, desiN: desiN / n, pre: pre / n, su: su / n, tooLong: tooLong };
}
const en = stats("en-US", 3000), inn = stats("en-IN", 3000), hi = stats("hi", 1500);
console.log("  en-US:", JSON.stringify(en));
console.log("  en-IN:", JSON.stringify(inn));
ok(en.desiN === 0, "desi names never used outside Indian locales");
ok(inn.desiN > 0.2 && inn.desiN < 0.3, "en-IN: ~25% desi (" + inn.desiN.toFixed(3) + ")");
ok(hi.desiN > 0.2 && hi.desiN < 0.3, "hi: ~25% desi");
ok(en.pre > 0.21 && en.pre < 0.29, "prefix ~25% (" + en.pre.toFixed(3) + ")");
ok(en.su > 0.05 && en.su < 0.11, "suffix ~8% (" + en.su.toFixed(3) + ")");
ok(en.kindN > 0.35 && en.kindN < 0.45, "kind-list names ~40% (" + en.kindN.toFixed(3) + ")");
ok(en.humanN > 0.40 && en.humanN < 0.50, "human names ~45% (" + en.humanN.toFixed(3) + ")");
ok(en.softN > 0.11 && en.softN < 0.19, "soft names ~15% (" + en.softN.toFixed(3) + ")");
ok(en.tooLong === 0 && inn.tooLong === 0, "no name longer than SC.LIMITS.name");
// recent names are avoided
(function () {
  const recent = D.kinds.cat.names.slice(0, 10).concat(D.names.human.slice(0, 40));
  let hits = 0;
  for (let i = 0; i < 400; i++) { const t = C.generate("cat", { seed: i + 5, recent: recent, memory: false }); const b = t.name.split(" "); if (recent.indexOf(t.name) >= 0 || recent.indexOf(b[b.length - 1]) >= 0 || recent.indexOf(b[0]) >= 0 && b.length === 1) hits++; }
  ok(hits === 0, "names in `recent` are avoided (" + hits + " hits)");
})();
// golden rate
(function () {
  let g = 0; const n = 2000;
  for (let i = 0; i < n; i++) if (C.rollGolden(i * 2654435761 % 4294967296)) g++;
  console.log("  golden in 2000 seeds:", g, "(" + (g / n * 100).toFixed(1) + "%)");
  ok(g / n > 0.035 && g / n < 0.065, "golden rate near 5%");
})();

// ---------- recipient lines, fill ----------
section("recipient lines and fill");
SC.STYLES.forEach(function (s) {
  SC.REASONS.forEach(function (r) {
    const l = C.recipientLine(s.id, r.id, { name: "Larry", to: "Priya", kind: "cat" });
    ok(l.length > 0 && l.indexOf("Priya") >= 0 || s.id === "news" && l.indexOf("PRIYA") >= 0, s.id + "/" + r.id + " has the recipient: " + l);
    ok(!/[{}]/.test(l), s.id + "/" + r.id + " unfilled: " + l);
    ok(!HESHE.test(l), s.id + "/" + r.id + " he/she");
    ok(l.length <= SC.LIMITS.line + 10, s.id + "/" + r.id + " long: " + l.length);
    if (s.id === "news") ok(l === l.toUpperCase() && l.indexOf("CAT") >= 0 || l.indexOf("CAT") < 0, "news line upper-case with kind: " + l);
  });
});
ok(C.fill("{kind} {name} {place} {to}", { name: "Larry", kind: "mystery", place: "here", to: "P" }) === "CREATURE Larry here P", "fill placeholders");
ok(C.fill("\"Hi\" it's me...", {}) === "“Hi” it’s me…", "fill makes curly quotes");
SC.STYLES.forEach(function (s) { ok(C.fieldsFor(s.id).length >= 3 && C.fieldsFor(s.id)[0] === "name", "fieldsFor " + s.id); });
C.fieldsFor("trading").concat(C.fieldsFor("dating")).forEach(function (f) { ok(C.FIELDS.some(function (x) { return x.id === f; }), "fieldsFor lists a real field: " + f); });

// ---------- crop ----------
section("crop clamp");
const P = SC.photo;
const sizes = [[1600, 900], [900, 1600], [1200, 1200], [1600, 400], [300, 2000], [64, 64]];
const aspects = [912 / 520, 1, 1000 / 900, 760 / 640, 1008 / 1012, 0.5, 3];
let rs = SC.util.mulberry32(5);
sizes.forEach(function (sz) {
  const ph = { width: sz[0], height: sz[1] };
  aspects.forEach(function (a) {
    for (let i = 0; i < 80; i++) {
      const raw = { cx: rs() * 3 - 1, cy: rs() * 3 - 1, zoom: rs() * 8 - 1 };
      const c = P.clampCrop(ph, raw, a);
      ok(c.zoom >= 1 && c.zoom <= P.MAX_ZOOM, "zoom in range " + c.zoom);
      const r = P.region(ph, raw, a);
      ok(r.sx >= -1e-6 && r.sy >= -1e-6 && r.sx + r.sw <= ph.width + 1e-6 && r.sy + r.sh <= ph.height + 1e-6, "window covered by the photo " + JSON.stringify(r));
      ok(Math.abs(r.sw / r.sh - a) < 1e-6, "region keeps the window's aspect");
      const c2 = P.clampCrop(ph, c, a);
      ok(Math.abs(c2.cx - c.cx) < 1e-9 && Math.abs(c2.cy - c.cy) < 1e-9 && c2.zoom === c.zoom, "clamp is idempotent");
    }
  });
});
ok(P.clampCrop({ width: 100, height: 100 }, { cx: 0.5, cy: 0.5, zoom: 0.2 }, 1).zoom === 1, "zoom below 1 becomes 1");
ok(P.clampCrop({ width: 100, height: 100 }, { cx: 0.5, cy: 0.5, zoom: 9 }, 1).zoom === 4, "zoom is capped at 4");
const ac = P.autoCrop({ width: 1000, height: 1000 });
ok(ac.cx === 0.5 && ac.cy === 0.45 && ac.zoom === 1.15, "autoCrop without a canvas falls back to centre, 45% from the top, zoom 1.15");
ok(JSON.stringify(P.autoCrop({ width: 10, height: 10, canvas: {} })) === JSON.stringify(ac), "autoCrop never throws on a broken photo");
ok(C.FIELDS.filter(function (f) { return f.id === "crime"; })[0].label === "Crime", "crime field is labelled Crime");

section("place clipping");
[["on a scooter seat", "on a scooter seat"], ["on the warmest car bonnet near the bakery", null], ["x".repeat(60), null], ["near the bakery at the end of the long road", null]].forEach(function (pr) {
  const r = SC.card.clipPlace(pr[0]);
  ok(r.length <= SC.LIMITS.place, "clipped place fits the limit: " + r);
  if (pr[1]) ok(r === pr[1], "short place unchanged"); else ok(/\u2026$/.test(r), "long place ends with an ellipsis: " + r);
  if (/ /.test(pr[0]) && !pr[1]) ok(pr[0].indexOf(r.slice(0, -1)) === 0 && /\s/.test(pr[0].charAt(r.length - 1)), "cut at a word boundary: " + r);
});

console.log("\n" + checks + " checks, " + fails + " failed");
process.exit(fails ? 1 : 0);
