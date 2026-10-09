// Node test for src/engine/export.js and share.js (no browser). Run: node tests/engine/export-test.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..", "..");
let fails = 0;
function eq(a, b, m) { if (a !== b) { fails++; console.log("FAIL " + m + " (got " + a + ", want " + b + ")"); } }

function load(files, extra) {
  const g = Object.assign({ console: console, Date: Date, Promise: Promise }, extra || {});
  g.globalThis = g; vm.createContext(g);
  files.forEach(function (f) { vm.runInContext(fs.readFileSync(path.join(root, "src/engine", f), "utf8"), g); });
  return g;
}
const card = function (name) { return { settings: { traits: { name: name } } }; };

(async function () {
  const g = load(["export.js", "share.js"]);
  const X = g.SC.export, d = new Date(2026, 9, 9);
  eq(X.fileName(card("Larry"), "card", d), "spotted-a-cutie-larry-2026-10-09.jpg", "plain");
  eq(X.fileName(card("Larry"), "story", d), "spotted-a-cutie-larry-story-2026-10-09.jpg", "story");
  eq(X.fileName(card("Auntie Pam!"), "card", d), "spotted-a-cutie-auntie-pam-2026-10-09.jpg", "spaces and punctuation");
  eq(X.fileName(card("Crème Brûlée"), "card", d), "spotted-a-cutie-creme-brulee-2026-10-09.jpg", "accents");
  eq(X.fileName(card(""), "card", d), "spotted-a-cutie-cutie-2026-10-09.jpg", "empty -> cutie");
  eq(X.fileName(card("Дима"), "story", d), "spotted-a-cutie-cutie-story-2026-10-09.jpg", "non-latin -> cutie");
  eq(X.fileName(card("  --A  B--  "), "card", d), "spotted-a-cutie-a-b-2026-10-09.jpg", "trim hyphens");
  eq(X.fileName({}, "card", d), "spotted-a-cutie-cutie-2026-10-09.jpg", "no traits");
  eq(X.fileName({ data: function () { return { traits: { name: "Moo" } }; } }, "card", d), "spotted-a-cutie-moo-2026-10-09.jpg", "name from data()");
  eq(/^spotted-a-cutie-larry-\d{4}-\d{2}-\d{2}\.jpg$/.test(X.fileName(card("Larry"), "card")), true, "today's date by default");

  // image(): fake canvas + File, check size request and quality
  let asked = null, q = null;
  const fakeCanvas = { toBlob: function (cb, type, quality) { q = [type, quality]; cb({ size: 5 }); } };
  const g2 = load(["export.js"], { File: function (parts, name, o) { this.name = name; this.type = o.type; } });
  const f = await g2.SC.export.image({ settings: { traits: { name: "Larry" } }, render: function (s, fmt) { asked = [s, fmt]; return fakeCanvas; } }, "story");
  eq(JSON.stringify(asked), JSON.stringify([1, "story"]), "render(1, story)");
  eq(JSON.stringify(q), JSON.stringify(["image/jpeg", 0.92]), "jpeg q0.92");
  eq(f.type, "image/jpeg", "file type");
  let err = null;
  try { await g2.SC.export.image({ render: function () { return { toBlob: function (cb) { cb(null); } }; } }, "card"); } catch (e) { err = e; }
  eq(err && err.code, "export-failed", "export-failed code");
  eq(!!(err && err.title && err.detail), true, "export-failed has title+detail");

  // share: loads in Node, safe defaults
  const S = g.SC.share;
  eq(S.platform(), "desktop", "platform in Node");
  eq(S.canShare({}), false, "canShare in Node");
  eq(await S.share({}), "failed", "share without sheet");

  console.log(fails ? fails + " FAILED" : "export-test: all passed");
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.log("CRASH", e); process.exit(1); });
