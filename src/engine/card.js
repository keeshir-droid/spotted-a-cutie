// The card object: settings, display strings, the render cache and the story scene (PLAN.md sections 6.2, 5.5, 7.3).
//
//   SC.card.create({ photo, crop, kind, traits, style, golden, number, place, to: {name, reason}, when, seed }) -> Promise<Card>
//   SC.card.fromSaved(saved) -> Promise<Card>
//   card.settings                         everything except the photo
//   card.update(partial) -> Promise<void> any of crop, traits, style, place, to, number, golden, kind, when
//   card.render(scale, format) -> canvas  "card" (1080x1350 * scale) or "story" (1080x1920 * scale), cached
//   card.window(style?) -> { x, y, w, h, radius, rotate }
//   card.data() -> plain object (no photo)
//
// Caches: the graded photo (per card: style, window size, crop, kind), the static art of each style (shared:
// style, seed, kind, golden, scale) and the last few finished renders. A text reroll only redraws text.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});
  const U = SC.util;

  const ART_CACHE_MAX = 10, RENDER_CACHE_MAX = 8, GRADE_CACHE_MAX = 10;
  const artCache = new Map();
  let artSeq = 0;

  function lru(map, key, make, max) {
    if (map.has(key)) { const v = map.get(key); map.delete(key); map.set(key, v); return v; }
    const v = make();
    map.set(key, v);
    while (map.size > max) map.delete(map.keys().next().value);
    return v;
  }

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function dates(when) {
    const d = new Date(when);
    return {
      short: d.getDate() + " " + MONTHS[d.getMonth()],
      long: (DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS_LONG[d.getMonth()] + " " + d.getFullYear()).toUpperCase()
    };
  }

  function kindRarity(kind) {
    const k = SC.KINDS.filter(function (x) { return x.id === kind; })[0];
    return k ? k.rarity : "common";
  }

  // every string a style might draw, with placeholders filled
  function display(set) {
    const C = SC.content, t = set.traits || {}, to = set.to || {};
    const place = (set.place || "").trim();
    const ctx = { name: t.name, kind: set.kind, place: place || t.habitat || "", to: to.name };
    const f = function (k) { return C.fill(t[k] == null ? "" : t[k], ctx); };
    const v = { name: C.fill(t.name || "", ctx) };
    C.LIST_FIELDS.forEach(function (k) { v[k] = f(k); });
    v.lastSeen = place ? C.fill(place, ctx) : f("habitat");
    v.age = t.age == null ? 1 : t.age;
    const st = t.stats || { chaos: 10, fluff: 10, sass: 10 };
    let best = "chaos";
    ["chaos", "fluff", "sass"].forEach(function (k) { if (st[k] > st[best]) best = k; });
    v.stat = [best, st[best]];
    v.moves = (t.moves || []).map(function (m) { return { name: C.fill(m.name, ctx), damage: m.damage, text: C.fill(m.text, ctx) }; });
    return v;
  }

  function personalLine(set, mark) {
    const to = set.to || {};
    if (!to.name) return "";
    const reason = to.reason || "hi";
    const name = set.traits && set.traits.name;
    return SC.content.recipientLine(set.style, reason, { name: name, to: mark ? SC.text.MARK_ON + to.name + SC.text.MARK_OFF : to.name, kind: set.kind });
  }

  // a place longer than the limit ends at a word with a real ellipsis, never mid-word
  function clipPlace(p) {
    p = String(p || "").trim();
    const lim = SC.LIMITS.place;
    if (p.length <= lim) return p;
    let cut = p.slice(0, lim - 1);
    const sp = cut.lastIndexOf(" ");
    if (sp >= 8) cut = cut.slice(0, sp);
    return cut.replace(/[\s,;:.\-]+$/, "") + "…";
  }

  class Card {
    constructor(photo, settings) {
      this.photo = photo;
      this.settings = settings;
      this._renders = new Map();
      this._graded = new Map();
    }

    _env(scale, styleId) {
      const set = this.settings, self = this, id = styleId || set.style, style = SC.styles.get(id);
      const reason = SC.REASONS.filter(function (r) { return r.id === ((set.to && set.to.reason) || "hi"); })[0];
      const sset = Object.assign({}, set, { style: id });
      const env = {
        s: scale, kind: set.kind, K: SC.PALETTE.kinds[set.kind] || SC.PALETTE.kinds.mystery, golden: !!set.golden,
        rarity: kindRarity(set.kind), number: set.number || 1, seed: set.seed >>> 0,
        v: display(set), to: (set.to && set.to.name) || "", place: (set.place || "").trim(),
        personal: personalLine(sset, false), personalMarked: personalLine(sset, true),
        reasonLabel: reason ? reason.label : "", date: dates(set.when)
      };
      env.photo = function (win) { return self._gradedWindow(id, win, scale, env); };
      env.style = style; env.styleId = id;
      return env;
    }

    _gradedWindow(styleId, win, scale, env) {
      const w = Math.max(1, Math.round(win.w * scale)), h = Math.max(1, Math.round(win.h * scale));
      const set = this.settings, photo = this.photo;
      const crop = SC.photo.clampCrop(photo, set.crop, win.w / win.h);
      const key = [styleId, set.kind, w, h, crop.cx.toFixed(4), crop.cy.toFixed(4), crop.zoom.toFixed(3), set.seed].join("|");
      return lru(this._graded, key, function () {
        return SC.grade.window(photo, crop, w, h, styleId, set.kind, set.seed, scale);
      }, GRADE_CACHE_MAX);
    }

    _art(style, env, scale) {
      const key = style.artKey(env) + "|" + scale;
      return lru(artCache, key, function () {
        const cv = U.createCanvas(Math.round(SC.CARD.w * scale), Math.round(SC.CARD.h * scale));
        const c = cv.getContext("2d");
        c.setTransform(scale, 0, 0, scale, 0, 0);
        SC.art.useFoil(env.golden ? SC.PALETTE.styles[env.styleId].golden.foil : null);
        try { style.art(c, scale, env); } finally { SC.art.useFoil(null); }
        return cv;
      }, ART_CACHE_MAX);
    }

    _renderCard(scale) {
      const env = this._env(scale), style = env.style;
      const cv = U.createCanvas(Math.round(SC.CARD.w * scale), Math.round(SC.CARD.h * scale));
      const c = cv.getContext("2d");
      c.setTransform(scale, 0, 0, scale, 0, 0);
      c.drawImage(this._art(style, env, scale), 0, 0, SC.CARD.w, SC.CARD.h);
      SC.art.useFoil(env.golden ? SC.PALETTE.styles[env.styleId].golden.foil : null);
      try { style.draw(c, scale, env); } finally { SC.art.useFoil(null); }
      return cv;
    }

    _renderStory(scale) {
      const P = SC.PALETTE, set = this.settings, st = P.styles[set.style], K = P.kinds[set.kind] || P.kinds.mystery, art = SC.art, S = SC.STORY;
      const bg = st.storyBg, self = this;
      const bgKey = ["storybg", set.style, set.kind, set.seed, scale].join("|");
      const base = lru(artCache, bgKey, function () {
        const cv = U.createCanvas(Math.round(S.w * scale), Math.round(S.h * scale)), c = cv.getContext("2d");
        c.setTransform(scale, 0, 0, scale, 0, 0);
        c.fillStyle = bg.color === "kindDark" ? K.dark : bg.color; c.fillRect(0, 0, S.w, S.h);
        if (bg.hatch) art.hatch(c, 0, 0, S.w, S.h, st.texture.hatch);
        if (bg.dotGrid) art.dotGrid(c, S.w, S.h, set.seed);
        if (bg.stains) art.stains(c, S.w, S.h, set.seed + 2, bg.stains);
        art.grain(c, 0, 0, S.w, S.h, bg.grain);
        return cv;
      }, ART_CACHE_MAX);
      const cv = U.createCanvas(Math.round(S.w * scale), Math.round(S.h * scale)), c = cv.getContext("2d");
      c.setTransform(scale, 0, 0, scale, 0, 0);
      c.drawImage(base, 0, 0, S.w, S.h);
      const cardCv = self.render(scale * S.card.w / SC.CARD.w, "card");
      const cx = S.card.x + S.card.w / 2, cy = S.card.y + S.card.h / 2;
      c.save(); c.translate(cx, cy); c.rotate(S.card.rotate * Math.PI / 180);
      art.printShadow(c, scale, function (x) { x.beginPath(); x.rect(-S.card.w / 2 + 6, -S.card.h / 2 + 6, S.card.w - 12, S.card.h - 12); }, "#000000");
      c.drawImage(cardCv, -S.card.w / 2, -S.card.h / 2, S.card.w, S.card.h);
      c.restore();
      const cap = P.story.caption;
      SC.text.draw(c, cap.text, { x: 0, y: 0, w: S.w, h: 0, font: cap.font, size: cap.size, align: "center", baseline: cap.y, color: bg.captionColor || cap.color, alpha: bg.captionAlpha || cap.alpha });
      return cv;
    }

    render(scale, format) {
      scale = scale || 1; format = format === "story" ? "story" : "card";
      const set = this.settings;
      const key = [format, scale, set.style, set.kind, set.golden ? 1 : 0, set.number, set.place, set.when, set.seed,
        JSON.stringify(set.crop), JSON.stringify(set.to), JSON.stringify(set.traits)].join("|");
      const self = this, t0 = U.now();
      let cached = true;
      const cv = lru(this._renders, key, function () {
        cached = false;
        return format === "story" ? self._renderStory(scale) : self._renderCard(scale);
      }, RENDER_CACHE_MAX);
      SC.card.lastTiming = { ms: U.now() - t0, scale: scale, format: format, cached: cached };
      return cv;
    }

    window(styleId) {
      const id = styleId || this.settings.style;
      return SC.styles.get(id).window({ seed: this.settings.seed >>> 0 });
    }

    update(partial) {
      const s = this.settings, p = partial || {};
      ["crop", "traits", "style", "place", "number", "golden", "kind", "when", "seed"].forEach(function (k) {
        if (p[k] !== undefined) s[k] = k === "crop" || k === "traits" ? JSON.parse(JSON.stringify(p[k])) : p[k];
      });
      if (p.place !== undefined && typeof p.place === "string") s.place = clipPlace(p.place);
      if (p.to !== undefined) s.to = p.to ? { name: String(p.to.name || "").slice(0, SC.LIMITS.to), reason: p.to.reason || "" } : { name: "", reason: "" };
      return SC.text.ready();
    }

    data() { return JSON.parse(JSON.stringify(this.settings)); }
  }

  async function create(o) {
    await SC.text.ready();
    const traits = o.traits || SC.content.generate(o.kind || "mystery", { seed: o.seed });
    const settings = {
      kind: o.kind || "mystery",
      traits: JSON.parse(JSON.stringify(traits)),
      style: o.style || SC.DEFAULTS.style,
      golden: !!o.golden,
      number: o.number || 1,
      place: clipPlace(o.place),
      to: o.to ? { name: String(o.to.name || "").slice(0, SC.LIMITS.to), reason: o.to.reason || "" } : { name: "", reason: "" },
      crop: JSON.parse(JSON.stringify(o.crop || SC.photo.autoCrop(o.photo))),
      when: o.when || Date.now(),
      seed: ((o.seed != null ? o.seed : (traits.seeds && traits.seeds.name) || ++artSeq) >>> 0)
    };
    return new Card(o.photo, settings);
  }

  // saved = what the binder stores: the card's data() plus `photo` (a Blob or File) and createdAt
  async function fromSaved(saved) {
    const img = await SC.decode.fileToImageData(saved.photo, { maxSide: 1600 });
    const photo = SC.photo.from(img);
    return create({
      photo: photo, crop: saved.crop, kind: saved.kind, traits: saved.traits, style: saved.style, golden: saved.golden,
      number: saved.number, place: saved.place, to: saved.to, when: saved.when || saved.createdAt, seed: saved.seed
    });
  }

  SC.card = { clipPlace: clipPlace, create: create, fromSaved: fromSaved, lastTiming: null };
})();
