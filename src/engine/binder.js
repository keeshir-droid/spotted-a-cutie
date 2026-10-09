// The binder: saved cards in IndexedDB (PLAN.md 6.5). Database "spotted-a-cutie", store "cards", key "id".
//
//   SC.binder.available()          -> Promise<boolean>
//   SC.binder.save(card, {id?})    -> Promise<id>        updates when an id is given, or when this card was saved before (card.binderId)
//   SC.binder.list()               -> Promise<[{ id, number, name, kind, golden, style, createdAt, thumbUrl }]>  newest first
//   SC.binder.get(id)              -> Promise<saved>     the full record: photo and thumb are Blobs (feed it to SC.card.fromSaved)
//   SC.binder.remove(id)           -> Promise<void>
//   SC.binder.stats()              -> Promise<{ total, golden, byKind, nextNumber }>
//   SC.binder.recentNames(n)       -> Promise<[string]>  newest first
// Rejects with {code:"binder-unavailable", title, detail} when IndexedDB is missing or blocked.
//
// What it assumes of a card (see the report): card.data() -> plain object with kind, golden, seed, traits, style, place, to, crop, number, when;
// card.photo -> { canvas, width, height }; card.render(scale, "card") -> canvas; card.binderId may be set by us.
// Nothing touches document / window / navigator / indexedDB at load time.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  const DB_NAME = "spotted-a-cutie", DB_VERSION = 2, STORE = "cards", META = "meta", COUNTER = "counter", PHOTO_SIDE = 1200, THUMB_W = 360, THUMB_H = 450;

  // ---------- errors ----------
  const UNAVAILABLE = { title: "This browser won’t keep your cuties.", detail: "Your card still works. Send or save it so you don’t lose it." };
  function unavailable() {
    if (SC.util && SC.util.error) return SC.util.error("binder-unavailable", UNAVAILABLE);
    const e = new Error(UNAVAILABLE.title);
    e.code = "binder-unavailable"; e.title = UNAVAILABLE.title; e.detail = UNAVAILABLE.detail;
    return e;
  }
  function failed() {
    if (SC.util && SC.util.error) return SC.util.error("export-failed", { title: "That didn’t work.", detail: "Please try again." });
    const e = new Error("That didn’t work."); e.code = "export-failed"; e.title = e.message; e.detail = "Please try again.";
    return e;
  }

  // ---------- pure logic (no browser; tested in Node) ----------
  // numbers are never reused: `counter` is the highest number ever saved, kept in its own store ("meta") so that
  // deleting the newest card does not free its number
  function nextNumberOf(records, counter) {
    let m = Number(counter) || 0;
    for (let i = 0; i < records.length; i++) { const n = Number(records[i].number) || 0; if (n > m) m = n; }
    return m + 1;
  }
  function statsOf(records, counter) {
    const byKind = {};
    let golden = 0;
    records.forEach(function (r) {
      if (r.golden) golden++;
      byKind[r.kind] = (byKind[r.kind] || 0) + 1;
    });
    return { total: records.length, golden: golden, byKind: byKind, nextNumber: nextNumberOf(records, counter) };
  }
  function newestFirst(records) {
    return records.slice().sort(function (a, b) { return (b.createdAt - a.createdAt) || ((b.number || 0) - (a.number || 0)); });
  }
  function recentNamesOf(records, n) {
    const out = [];
    const sorted = newestFirst(records);
    for (let i = 0; i < sorted.length && out.length < (n === undefined ? 20 : n); i++) {
      const nm = sorted[i].traits && sorted[i].traits.name;
      if (nm) out.push(nm);
    }
    return out;
  }
  // the record this card already has in the binder, if any: by id, by card.binderId, else same seed + kind + number
  function findExisting(records, card, data, id) {
    const want = id || (card && card.binderId);
    if (want) { for (let i = 0; i < records.length; i++) if (records[i].id === want) return records[i]; }
    if (data.seed !== undefined && data.seed !== null) {
      for (let i = 0; i < records.length; i++) {
        const r = records[i];
        if (r.seed === data.seed && r.kind === data.kind && r.number === data.number) return r;
      }
    }
    return null;
  }
  function newId() { return "c" + Date.now().toString(36) + Math.floor(Math.random() * 1679616).toString(36); }
  function pickData(d) {
    return {
      kind: d.kind, golden: !!d.golden, seed: d.seed, traits: d.traits, style: d.style, place: d.place || "",
      to: d.to || { name: "", reason: "" }, crop: d.crop, when: d.when
    };
  }
  // builds the record to store. `existing` keeps its id, number, createdAt and photo
  function buildRecord(data, existing, records, blobs, now, idMaker, counter) {
    const rec = pickData(data);
    if (existing) {
      rec.id = existing.id; rec.number = existing.number; rec.createdAt = existing.createdAt;
      rec.photo = blobs.photo || existing.photo;
    } else {
      rec.id = (idMaker || newId)();
      const taken = records.some(function (r) { return r.number === data.number; });
      const floor = Number(counter) || 0;
      rec.number = (data.number && !taken && data.number > floor) ? data.number : nextNumberOf(records, floor);
      rec.createdAt = now;
      rec.photo = blobs.photo;
    }
    rec.thumb = blobs.thumb;
    return rec;
  }

  // ---------- IndexedDB ----------
  let dbPromise = null;
  function getIDB() { try { return typeof indexedDB !== "undefined" ? indexedDB : null; } catch (e) { return null; } }
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      const idb = getIDB();
      if (!idb) { reject(unavailable()); return; }
      let req;
      try { req = idb.open(DB_NAME, DB_VERSION); } catch (e) { reject(unavailable()); return; }
      req.onupgradeneeded = function () {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
        if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "key" });
      };
      req.onsuccess = function () {
        const db = req.result;
        db.onversionchange = function () { try { db.close(); } catch (e) { /* ignore */ } dbPromise = null; };
        resolve(db);
      };
      req.onerror = function () { reject(unavailable()); };
      req.onblocked = function () { reject(unavailable()); };
    }).catch(function (e) { dbPromise = null; throw (e && e.code ? e : unavailable()); });
    return dbPromise;
  }
  function tx(mode, fn) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        let t, result;
        try { t = db.transaction([STORE, META], mode); result = fn(t.objectStore(STORE), t.objectStore(META)); }
        catch (e) { reject(unavailable()); return; }
        t.oncomplete = function () { resolve(result && "result" in result ? result.result : undefined); };
        t.onerror = t.onabort = function () { reject(unavailable()); };
      });
    });
  }
  function counterNow() {
    return tx("readonly", function (s, m) { return m.get(COUNTER); }).then(function (r) { return (r && Number(r.max)) || 0; });
  }
  function all() { return tx("readonly", function (s) { return s.getAll(); }).then(function (r) { return r || []; }); }

  async function available() {
    try { await openDB(); return true; } catch (e) { return false; }
  }

  // ---------- blobs (browser; replaceable by tests through SC.binder._hooks) ----------
  function canvasBlob(canvas, quality) {
    return new Promise(function (res) {
      if (canvas.toBlob) canvas.toBlob(res, "image/jpeg", quality);
      else if (canvas.convertToBlob) canvas.convertToBlob({ type: "image/jpeg", quality: quality }).then(res, function () { res(null); });
      else res(null);
    });
  }
  function makeCanvas(w, h) {
    if (SC.util && SC.util.createCanvas) return SC.util.createCanvas(w, h);
    const c = document.createElement("canvas"); c.width = w; c.height = h; return c;
  }
  async function photoBlob(card) {
    const src = card && card.photo && card.photo.canvas;
    if (!src) return null;
    const k = Math.min(1, PHOTO_SIDE / Math.max(src.width, src.height));
    const w = Math.max(1, Math.round(src.width * k)), h = Math.max(1, Math.round(src.height * k));
    const c = makeCanvas(w, h), ctx = c.getContext("2d", { alpha: false });
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, w, h);
    return canvasBlob(c, 0.85);
  }
  async function thumbBlob(card) {
    const r = card.render(THUMB_W / SC_CARD_W(), "card");  // 1/3 scale -> 360 x 450
    let src = r;
    if (r.width !== THUMB_W || r.height !== THUMB_H) {
      src = makeCanvas(THUMB_W, THUMB_H);
      const ctx = src.getContext("2d", { alpha: false });
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(r, 0, 0, THUMB_W, THUMB_H);
    }
    return canvasBlob(src, 0.85);
  }
  function SC_CARD_W() { return (SC.CARD && SC.CARD.w) || 1080; }
  const hooks = {
    makeBlobs: async function (card, needPhoto) {
      const thumb = await thumbBlob(card);
      const photo = needPhoto ? await photoBlob(card) : null;
      return { photo: photo, thumb: thumb };
    },
    urlFor: function (blob) { return (typeof URL !== "undefined" && URL.createObjectURL && blob) ? URL.createObjectURL(blob) : ""; },
    revoke: function (url) { try { if (url && typeof URL !== "undefined" && URL.revokeObjectURL) URL.revokeObjectURL(url); } catch (e) { /* ignore */ } },
    now: function () { return Date.now(); },
    // read only when called, never at load: { ua, navPlatform, touchPoints, standalone, storage }
    env: function () {
      const e = { ua: "", navPlatform: "", touchPoints: 0, standalone: false, storage: null };
      try {
        if (typeof navigator !== "undefined" && navigator) {
          e.ua = navigator.userAgent || ""; e.navPlatform = navigator.platform || ""; e.touchPoints = navigator.maxTouchPoints || 0;
          e.storage = navigator.storage || null;
          if (navigator.standalone) e.standalone = true;
        }
        if (!e.standalone && typeof matchMedia === "function") e.standalone = !!matchMedia("(display-mode: standalone)").matches;
      } catch (x) { /* keep defaults */ }
      return e;
    }
  };

  // ---------- public ----------
  async function save(card, opts) {
    if (!card || typeof card.data !== "function") throw failed();
    const records = await all();                       // rejects binder-unavailable
    const counter = await counterNow();
    const data = card.data();
    const existing = findExisting(records, card, data, opts && opts.id);
    let blobs;
    try { blobs = await hooks.makeBlobs(card, !existing); }
    catch (e) { if (typeof console !== "undefined") console.error(e); throw failed(); }
    if (!blobs || !blobs.thumb || (!existing && !blobs.photo)) throw failed();
    const rec = buildRecord(data, existing, records, blobs, hooks.now(), undefined, counter);
    await tx("readwrite", function (s, m) {
      const r = s.put(rec);
      m.put({ key: COUNTER, max: Math.max(counter, Number(rec.number) || 0) });
      return r;
    });
    try { card.binderId = rec.id; } catch (e) { /* frozen card: fine */ }
    try { if (card.settings && card.settings.number !== rec.number && typeof card.update === "function") card.update({ number: rec.number }); } catch (e) { /* the card keeps its own number */ }
    askPersist();
    return rec.id;
  }

  // ---------- keeping it: persistent storage + status ----------
  // After the first successful save of a session, ask the browser once not to clear our data. Never throws, never waits.
  let persistAsked = false;
  function askPersist() {
    if (persistAsked) return;
    persistAsked = true;
    try {
      const st = hooks.env().storage;
      if (st && typeof st.persist === "function") { const p = st.persist(); if (p && p.catch) p.catch(function () { /* ignore */ }); }
    } catch (e) { /* ignore */ }
  }
  // 'inapp' (Instagram, Facebook, WhatsApp, Line, TikTok, Snapchat webviews), 'ios' (iPhone/iPad, incl. iPadOS as Macintosh with touch), 'android', else 'other'
  function classifyUA(ua, navPlatform, touchPoints) {
    ua = ua || "";
    if (/Instagram|FBAN|FBAV|FB_IAB|WhatsApp|\bLine\/|Musical_ly|musical\.ly|BytedanceWebview|TikTok|Snapchat/i.test(ua)) return "inapp";
    if (/iPhone|iPad|iPod/.test(ua)) return "ios";
    if (navPlatform === "MacIntel" && touchPoints > 1) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "other";
  }
  async function keepStatus() {
    const env = hooks.env();
    let persisted = null;
    try { if (env.storage && typeof env.storage.persisted === "function") persisted = !!(await env.storage.persisted()); } catch (e) { persisted = null; }
    return { persisted: persisted, standalone: !!env.standalone, platform: classifyUA(env.ua, env.navPlatform, env.touchPoints), browserOk: await available() };
  }

  let urls = {};
  async function list() {
    const records = newestFirst(await all());
    const old = urls; urls = {};
    Object.keys(old).forEach(function (k) { hooks.revoke(old[k]); });
    return records.map(function (r) {
      const url = hooks.urlFor(r.thumb);
      urls[r.id] = url;
      return {
        id: r.id, number: r.number, name: (r.traits && r.traits.name) || "", kind: r.kind, golden: !!r.golden,
        style: r.style, createdAt: r.createdAt, thumbUrl: url
      };
    });
  }
  async function get(id) {
    const r = await tx("readonly", function (s) { return s.get(id); });
    if (!r) { const e = failed(); e.title = "That cutie isn’t in your binder."; e.detail = "It may have been removed."; throw e; }
    return r;
  }
  async function remove(id) {
    await tx("readwrite", function (s) { return s.delete(id); });
    if (urls[id]) { hooks.revoke(urls[id]); delete urls[id]; }
  }
  async function stats() { const r = await all(); return statsOf(r, await counterNow()); }
  async function recentNames(n) { return recentNamesOf(await all(), n); }

  SC.binder = {
    available: available, save: save, list: list, get: get, remove: remove, stats: stats, recentNames: recentNames, keepStatus: keepStatus,
    _logic: { classifyUA: classifyUA, nextNumberOf: nextNumberOf, statsOf: statsOf, newestFirst: newestFirst, recentNamesOf: recentNamesOf, findExisting: findExisting, buildRecord: buildRecord },
    _hooks: hooks,
    _reset: function () { dbPromise = null; urls = {}; persistAsked = false; }
  };
})();
