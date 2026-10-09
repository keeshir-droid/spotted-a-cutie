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

  // UA classification
  const UAS = [
    ["iPhone Safari", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", "iPhone", 5, "ios"],
    ["iPhone Instagram", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21E219 Instagram 330.0.0.34.108 (iPhone14,5; iOS 17_4; en_GB; en-GB; scale=3.00; 1170x2532; 570212345)", "iPhone", 5, "inapp"],
    ["iPhone WhatsApp", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WhatsApp/24.7.80 Safari/604.1", "iPhone", 5, "inapp"],
    ["iPhone Facebook", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21E219 [FBAN/FBIOS;FBAV/450.0.0.38.108;FBBV/5;FBDV/iPhone14,5]", "iPhone", 5, "inapp"],
    ["iPadOS desktop site", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15", "MacIntel", 5, "ios"],
    ["Mac Safari", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15", "MacIntel", 0, "other"],
    ["Android Chrome", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36", "Linux armv8l", 5, "android"],
    ["Android Instagram", "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 Instagram 330.0.0.40.97 Android (34/14; 420dpi; 1080x2400; Google/google; Pixel 8; shiba; shiba; en_GB; 570212345)", "Linux armv8l", 5, "inapp"],
    ["Android TikTok", "Mozilla/5.0 (Linux; Android 13; SM-S918B Build/TP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 musical_ly_2023405030 BytedanceWebview/d8a21c6", "Linux armv8l", 5, "inapp"],
    ["Android Snapchat", "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 Snapchat/12.80.0.34", "Linux armv8l", 5, "inapp"],
    ["Line", "Mozilla/5.0 (Linux; Android 13; SM-S918B Build/TP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 Line/14.5.0/IAB", "Linux armv8l", 5, "inapp"],
    ["Desktop Chrome", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "Win32", 0, "other"]
  ];
  UAS.forEach(function (r) { eq(L.classifyUA(r[1], r[2], r[3]), r[4], "UA " + r[0]); });

  // persist(): once, after the first successful save only; never blocks or throws
  let persistCalls = 0;
  B._hooks.env = function () { return { ua: UAS[0][1], navPlatform: "iPhone", touchPoints: 5, standalone: true, storage: { persist: function () { persistCalls++; throw new Error("boom"); }, persisted: async function () { return false; } } }; };
  B._reset();
  eq(await B.keepStatus().then(function (s) { return s.persisted; }), false, "persisted false");
  eq(persistCalls, 0, "not asked before a save");
  await B.save(fakeCard({ seed: 50, number: 50, traits: { name: "Persist1" } }));
  await B.save(fakeCard({ seed: 51, number: 51, traits: { name: "Persist2" } }));
  eq(persistCalls, 1, "persist asked once, errors swallowed");
  eq(await B.keepStatus(), { persisted: false, standalone: true, platform: "ios", browserOk: true }, "keepStatus shape");
  B._hooks.env = function () { return { ua: "", navPlatform: "", touchPoints: 0, standalone: false, storage: null }; };
  eq(await B.keepStatus(), { persisted: null, standalone: false, platform: "other", browserOk: true }, "unsupported storage -> null");
  eq(await S0.binder.keepStatus(), { persisted: null, standalone: false, platform: "other", browserOk: false }, "Node, no idb");

  console.log(fails ? fails + " FAILED" : "binder-test: all passed");
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.log("CRASH", e); process.exit(1); });
