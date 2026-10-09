// Node test for src/engine/sample.js with stubs for decode/photo/content/card. Run: node tests/engine/sample-test.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..", "..");
let fails = 0;
function eq(a, b, m) { if (JSON.stringify(a) !== JSON.stringify(b)) { fails++; console.log("FAIL " + m + " (got " + JSON.stringify(a) + ", want " + JSON.stringify(b) + ")"); } }

(async function () {
  const fetched = [];
  const g = {
    console: console, Date: Date, Promise: Promise, JSON: JSON,
    fetch: async function (u) { fetched.push(u); return { ok: true, blob: async function () { return { u: u }; } }; }
  };
  g.globalThis = g; vm.createContext(g);
  vm.runInContext(fs.readFileSync(path.join(root, "src/engine/sample.js"), "utf8"), g);
  const SC = g.SC;
  SC.sample.base = "X/";
  SC.decode = { fileToImageData: async function (b) { return { w: b.u }; } };
  SC.photo = { from: function (i) { return { src: i.w }; }, autoCrop: function () { return { cx: .5, cy: .5, zoom: 1 }; } };
  SC.content = { generate: function (k, o) { return { name: k + o.seed }; } };
  SC.card = { create: async function (o) { return o; } };
  const cards = await SC.sample.load();
  eq(cards.length, 3, "three cards");
  eq(cards.map(function (c) { return c.style; }), ["trading", "wanted", "polaroid"], "styles");
  eq(cards.map(function (c) { return c.kind; }), ["cat", "dog", "dog"], "kinds");
  eq(fetched, ["X/cat.jpg", "X/dog.jpg", "X/dog-sleeping.jpg"], "files");
  eq(cards.map(function (c) { return c.golden; }), [false, false, false], "golden not forced");
  eq(cards.map(function (c) { return c.to; }), [{ name: "", reason: "" }, { name: "", reason: "" }, { name: "", reason: "" }], "not personalised");
  const again = await SC.sample.load();
  eq(again.map(function (c) { return c.traits.name; }), cards.map(function (c) { return c.traits.name; }), "fixed seeds");
  for (const f of ["cat.jpg", "dog.jpg", "dog-sleeping.jpg"]) if (!fs.existsSync(path.join(root, "assets/sample", f))) { fails++; console.log("missing " + f); }
  console.log(fails ? fails + " FAILED" : "sample-test: all passed");
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.log("CRASH", e); process.exit(1); });
