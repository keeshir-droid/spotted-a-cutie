// Node test for src/engine/binder.js with a tiny fake IndexedDB. Run: node tests/engine/binder-test.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..", "..");
let fails = 0;
function ok(c, m) { if (!c) { fails++; console.log("FAIL " + m); } }
function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + " (got " + JSON.stringify(a) + ", want " + JSON.stringify(b) + ")"); }

function load(withIDB) {
  const g = { console: console, Date: Date, Math: Math, JSON: JSON, Promise: Promise, setTimeout: setTimeout };
  g.globalThis = g;
  if (withIDB) g.indexedDB = fakeIDB();
  vm.createContext(g);
  vm.runInContext(fs.readFileSync(path.join(root, "src/engine/binder.js"), "utf8"), g);   // loading must not need document/window/navigator
  return g.SC;
}

function fakeIDB() {
  const stores = {};
  const storeOf = function (name) { return stores[name] || (stores[name] = new Map()); };
  const req = function (fn) {
    const r = { result: undefined };
    r._run = function () { r.result = fn(); };
    return r;
  };
  return {
    open: function () {
      const r = { result: null };
      setTimeout(function () {
        r.result = {
          objectStoreNames: { contains: function () { return true; } },
          createObjectStore: function () {},
          transaction: function () {
            const t = {};
            const pending = [];
            t.objectStore = function (name) {
              const data = storeOf(name || "cards"), keyOf = function (v) { return v.id !== undefined ? v.id : v.key; };
              const add = function (fn) { const q = req(fn); pending.push(q); return q; };
              return {
                put: function (v) { return add(function () { data.set(keyOf(v), JSON.parse(JSON.stringify(v, function (k, x) { return x; }))); data.get(keyOf(v)).photo = v.photo; data.get(keyOf(v)).thumb = v.thumb; return keyOf(v); }); },
                get: function (id) { return add(function () { return data.get(id); }); },
                getAll: function () { return add(function () { return Array.from(data.values()); }); },
                delete: function (id) { return add(function () { data.delete(id); }); }
              };
            };
            setTimeout(function () { pending.forEach(function (q) { q._run(); }); t.oncomplete && t.oncomplete(); }, 0);
            return t;
          }
        };
        r.onsuccess && r.onsuccess();
      }, 0);
      return r;
    },
    _stores: stores
  };
}

function fakeCard(over) {
  const d = Object.assign({ kind: "cat", golden: false, seed: 11, traits: { name: "Larry" }, style: "trading", place: "x", to: { name: "P", reason: "twin" }, crop: { cx: .5, cy: .5, zoom: 1 }, number: 1, when: 1 }, over || {});
  return { data: function () { return JSON.parse(JSON.stringify(d)); } };
}

(async function () {
  // pure logic
  const L = load(false).binder._logic;
  eq(L.nextNumberOf([]), 1, "next number of empty");
  eq(L.nextNumberOf([{ number: 3 }, { number: 9 }, { number: 4 }]), 10, "highest + 1");
  eq(L.nextNumberOf([{ number: 3 }, { number: 4 }]), 5, "after deleting 1 and 2 it is still highest + 1");
  const recs = [{ kind: "cat", golden: true, number: 1, createdAt: 1, traits: { name: "A" } }, { kind: "cat", golden: false, number: 2, createdAt: 3, traits: { name: "B" } }, { kind: "dog", golden: false, number: 3, createdAt: 2, traits: { name: "C" } }];
  eq(L.statsOf(recs), { total: 3, golden: 1, byKind: { cat: 2, dog: 1 }, nextNumber: 4 }, "stats");
  eq(L.recentNamesOf(recs, 2), ["B", "C"], "recentNames newest first, limited");
  eq(L.newestFirst(recs).map(function (r) { return r.number; }), [2, 3, 1], "newest first");

  // no IndexedDB: everything rejects with binder-unavailable, available() is false
  const S0 = load(false);
  eq(await S0.binder.available(), false, "available false without idb");
  for (const fn of ["list", "stats", "recentNames"]) {
    try { await S0.binder[fn](); ok(false, fn + " should reject"); }
    catch (e) { ok(e.code === "binder-unavailable" && e.title && e.detail, fn + " error shape"); eq(e.title, "This browser won’t keep your cuties.", "title text"); }
  }
  try { await S0.binder.save(fakeCard()); ok(false, "save should reject"); } catch (e) { eq(e.code, "binder-unavailable", "save code"); }

  // with the fake IndexedDB
  const S = load(true), B = S.binder;
  let t = 1000;
  B._hooks.now = function () { return t += 10; };
  B._hooks.makeBlobs = async function (card, needPhoto) { return { thumb: "T", photo: needPhoto ? "P" : null }; };
  B._hooks.urlFor = function (b) { return "blob:" + b; };
  eq(await B.available(), true, "available with idb");
  eq((await B.stats()).nextNumber, 1, "empty nextNumber");

  const c1 = fakeCard({ seed: 1, number: 1, traits: { name: "Larry" } });
  const id1 = await B.save(c1);
  ok(typeof id1 === "string" && id1, "save returns an id");
  eq(c1.binderId, id1, "card remembers its id");
  const id1b = await B.save(c1);
  eq(id1b, id1, "saving the same card twice updates");
  eq((await B.list()).length, 1, "no duplicate");
  eq((await B.get(id1)).photo, "P", "photo kept on update");
  eq((await B.get(id1)).createdAt, 1010, "createdAt kept on update");

  // same seed/kind/number but a fresh card object (e.g. reopened) still dedupes
  const idDup = await B.save(fakeCard({ seed: 1, number: 1, traits: { name: "Larry Edited" } }));
  eq(idDup, id1, "dedupe by seed+kind+number");
  eq((await B.get(id1)).traits.name, "Larry Edited", "update changes traits");

  // explicit id updates
  const c2 = fakeCard({ seed: 2, number: 2, kind: "dog", golden: true, traits: { name: "Pam" } });
  const id2 = await B.save(c2);
  ok(id2 !== id1, "different card, new id");
  await B.save(fakeCard({ seed: 99, number: 2, kind: "dog", traits: { name: "Pam2" } }), { id: id2 });
  eq((await B.list()).length, 2, "explicit id updates, no duplicate");

  // number clash: a card claiming a taken number gets the next one
  const id3 = await B.save(fakeCard({ seed: 3, number: 1, traits: { name: "Third" } }));
  eq((await B.get(id3)).number, 3, "taken number -> next number");

  const list = await B.list();
  eq(list.map(function (x) { return x.name; }), ["Third", "Pam2", "Larry Edited"], "list newest first");
  eq(list[0].thumbUrl, "blob:T", "thumbUrl");
  eq(Object.keys(list[0]).sort(), ["createdAt", "golden", "id", "kind", "name", "number", "style", "thumbUrl"], "list item keys");

  const st = await B.stats();
  eq(st, { total: 3, golden: 0, byKind: { cat: 2, dog: 1 }, nextNumber: 4 }, "stats after saves");
  await B.remove(id3);
  eq((await B.stats()).nextNumber, 4, "the number of a removed top card is never reused");
  const id4 = await B.save(fakeCard({ seed: 4, number: 3, traits: { name: "Fourth" } }));
  eq((await B.get(id4)).number, 4, "a card claiming the freed number gets a fresh one");
  eq((await B.stats()).nextNumber, 5, "counter moves on after the next save");
  await B.remove(id4);
  eq((await B.stats()).nextNumber, 5, "still 5 after removing it too");
  eq((await B.list()).length, 2, "removed");
  eq(await B.recentNames(5), ["Pam2", "Larry Edited"], "recentNames");
  eq(L.nextNumberOf([{ number: 2 }], 7), 8, "counter beats the highest saved number");
  try { await B.get("nope"); ok(false, "get missing should reject"); } catch (e) { ok(e.code, "get missing has a code"); }

  console.log(fails ? fails + " FAILED" : "binder-test: all passed");
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.log("CRASH", e); process.exit(1); });
