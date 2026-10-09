// The content system (PLAN.md section 5.3): turns SC.CONTENT_DATA into a card's words.
// Hand-written lists only, no AI. Reads SC.CONTENT_DATA lazily so load order only matters at call time.
//
//   SC.content.FIELDS                                   [{ id, label }]
//   SC.content.generate(kind, { seed, recent, locale, memory }) -> traits
//   SC.content.reroll(traits, fieldOrAll, { kind, recent, locale }) -> new traits
//   SC.content.fill(text, { name, kind, place, to }) -> string
//   SC.content.recipientLine(styleId, reasonId, { name, to, kind }) -> string
//   SC.content.fieldsFor(styleId) -> [fieldId]
//   SC.content.resetSession()                           forget the session's names and lines (tests)
//
// Every field has its own seed (traits.seeds[field]); a reroll gives only that field a new seed.
// A session memory (module level) keeps consecutive cards from repeating a name or a line.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  const FIELDS = [
    { id: "name", label: "Name" }, { id: "title", label: "Title" }, { id: "mood", label: "Mood" },
    { id: "habitat", label: "Natural habitat" }, { id: "diet", label: "Diet" }, { id: "knownFor", label: "Known for" },
    { id: "weakness", label: "Weakness" }, { id: "threat", label: "Threat level" }, { id: "aka", label: "Also known as" },
    { id: "catchphrase", label: "Catchphrase" }, { id: "crime", label: "Crime" }, { id: "reward", label: "Reward" },
    { id: "headline", label: "Headline" }, { id: "greenFlag", label: "Green flag" }, { id: "redFlag", label: "Red flag" },
    { id: "lookingFor", label: "Looking for" }, { id: "loveLanguage", label: "Love language" },
    { id: "distance", label: "Distance" }, { id: "flavour", label: "Card quote" }
  ];
  const LIST_FIELDS = FIELDS.map(function (f) { return f.id; }).filter(function (id) { return id !== "name"; });
  const KIND_ONLY = { title: true };
  const SHARED_ONLY = { reward: true, distance: true };
  const KIND_SHARE = 0.7;          // about 70% of a field comes from the kind's own list
  const NAME_MIX = { kind: 0.40, human: 0.45 };   // the rest (15%) is soft names
  const PREFIX_CHANCE = 0.25, SUFFIX_CHANCE = 0.08, DESI_CHANCE = 0.25;
  const MEMORY_LINES = 5;          // a line is not reused within the last 5 cards of that field
  const MEMORY_NAMES = 150;

  const KIND_WORD = { cat: "CAT", dog: "DOG", pigeon: "PIGEON", crow: "CROW", cow: "COW", squirrel: "SQUIRREL", monkey: "MONKEY", bird: "BIRD", mystery: "CREATURE" };

  // lines each style shows, for the Edit sheet
  const FIELDS_FOR = {
    minimal: ["name", "title", "mood", "habitat"],
    trading: ["name", "title", "weakness", "threat", "flavour"],
    polaroid: ["name", "mood", "habitat", "catchphrase"],
    wanted: ["name", "crime", "aka", "reward"],
    dating: ["name", "distance", "greenFlag", "redFlag", "lookingFor", "loveLanguage"],
    news: ["name", "headline", "catchphrase"]
  };

  // ---------- session memory ----------
  let memory = {};      // field -> [recent values]
  let usedNames = [];   // base names used this session (lower case)
  function resetSession() { memory = {}; usedNames = []; }

  function data() {
    const d = SC.CONTENT_DATA;
    if (!d) throw new Error("SC.CONTENT_DATA is not loaded");
    return d;
  }
  function kindData(kind) { const d = data(); return d.kinds[kind] || d.kinds.mystery; }
  function isIndianLocale(locale) {
    if (!locale) return false;
    return /-IN$/i.test(locale) || /^(hi|bn|ta|te|mr|gu|kn|ml|pa)(-|_|$)/i.test(locale);
  }

  // ---------- text ----------
  // straight quotes -> curly, three dots -> ellipsis
  function smart(t) {
    return String(t)
      .replace(/(^|[\s(\[—–])"/g, "$1“").replace(/"/g, "”")
      .replace(/(^|[\s(\[—–])'/g, "$1‘").replace(/'/g, "’")
      .replace(/\.\.\./g, "…");
  }
  function kindWord(kind) {
    if (!kind) return "CREATURE";
    return KIND_WORD[kind] || String(kind).toUpperCase();
  }
  function fill(text, ctx) {
    ctx = ctx || {};
    const out = String(text == null ? "" : text)
      .replace(/\{name\}/g, ctx.name != null && ctx.name !== "" ? ctx.name : "this one")
      .replace(/\{kind\}/g, kindWord(ctx.kind))
      .replace(/\{place\}/g, ctx.place != null && ctx.place !== "" ? ctx.place : "round here")
      .replace(/\{to\}/g, ctx.to != null && ctx.to !== "" ? ctx.to : "you");
    return smart(out);
  }
  function recipientLine(styleId, reasonId, ctx) {
    const r = data().recipient && data().recipient[styleId];
    if (!r || !r[reasonId]) return "";
    let s = fill(r[reasonId], ctx);
    if (styleId === "news") s = s.toUpperCase();
    return s;
  }

  // ---------- picking ----------
  function remember(field, value) {
    const m = memory[field] || (memory[field] = []);
    m.push(value);
    if (m.length > MEMORY_LINES) m.shift();
  }
  function pickLine(field, kind, rng, useMemory) {
    const d = data(), kl = kindData(kind)[field] || [], sl = d.shared[field] || [];
    function choose() {
      let list;
      if (SHARED_ONLY[field]) list = sl;
      else if (KIND_ONLY[field]) list = kl;
      else list = (kl.length && (!sl.length || rng() < KIND_SHARE)) ? kl : (sl.length ? sl : kl);
      return list[Math.floor(rng() * list.length)];
    }
    const mem = useMemory ? (memory[field] || []) : [];
    let v = choose();
    for (let i = 0; i < 12 && mem.indexOf(v) >= 0; i++) v = choose();
    if (useMemory) remember(field, v);
    return v;
  }
  function pickFrom(list, rng) { return list[Math.floor(rng() * list.length)]; }

  function makeName(kind, rng, opts) {
    const d = data(), kd = kindData(kind);
    const recentSet = {};
    (opts.recent || []).forEach(function (n) { recentSet[String(n).toLowerCase()] = true; });
    const useMemory = opts.memory !== false;
    const desi = isIndianLocale(opts.locale) && d.desiNames && d.desiNames.length;
    let base = "", tries = 0;
    do {
      let list;
      if (desi && rng() < DESI_CHANCE) list = d.desiNames;
      else {
        const r = rng();
        if (r < NAME_MIX.kind && kd.names && kd.names.length) list = kd.names;
        else if (r < NAME_MIX.kind + NAME_MIX.human) list = d.names.human;
        else list = d.names.soft;
      }
      base = pickFrom(list, rng);
      tries++;
    } while (tries < 30 && (recentSet[base.toLowerCase()] || (useMemory && usedNames.indexOf(base.toLowerCase()) >= 0)));
    let prefix = "", suffix = "";
    if (rng() < PREFIX_CHANCE && d.names.prefixes.length) prefix = pickFrom(d.names.prefixes, rng);
    if (rng() < SUFFIX_CHANCE && d.names.suffixes.length) suffix = pickFrom(d.names.suffixes, rng);
    const lim = SC.LIMITS.name;
    function join() { return [prefix, base, suffix].filter(Boolean).join(" "); }
    if (join().length > lim) suffix = "";
    if (join().length > lim) prefix = "";
    let name = join();
    if (name.length > lim) name = name.slice(0, lim).replace(/\s+\S*$/, "") || name.slice(0, lim);
    if (useMemory) {
      usedNames.push(base.toLowerCase());
      if (usedNames.length > MEMORY_NAMES) usedNames.shift();
    }
    return name;
  }

  function makeStats(kind, rng) {
    const bias = kindData(kind).statBias || {};
    const out = {};
    ["chaos", "fluff", "sass"].forEach(function (k) {
      const base = (1 + Math.floor(rng() * 10)) * 10;
      out[k] = Math.max(10, Math.min(100, Math.round((base + (bias[k] || 0)) / 10) * 10));
    });
    return out;
  }
  function makeMoves(kind, rng, useMemory) {
    const list = (kindData(kind).moves || []).slice();
    const mem = useMemory ? (memory.moves || []) : [];
    const out = [];
    let guard = 0;
    while (out.length < 2 && list.length && guard++ < 40) {
      const m = list[Math.floor(rng() * list.length)];
      if (out.some(function (o) { return o.name === m.name; })) continue;
      if (out.length === 0 && mem.indexOf(m.name) >= 0 && guard < 20) continue;
      out.push({ name: m.name, damage: m.damage, text: smart(m.text) });
    }
    if (useMemory && out[0]) { remember("moves", out[0].name); }
    return out;
  }

  // builds one field's value with its seed; `ctx` is the current name/kind for filling
  function buildField(field, kind, seed, ctx, useMemory) {
    const rng = SC.util.mulberry32(seed);
    if (field === "age") return 1 + Math.floor(rng() * 12);
    if (field === "stats") return makeStats(kind, rng);
    if (field === "moves") return makeMoves(kind, rng, useMemory);
    const raw = pickLine(field, kind, rng, useMemory);
    return raw;
  }

  // {name} lives inside a few lines (card quotes): setLine() keeps the raw text in traits.tpl so a
  // name reroll can refresh them.
  function generate(kind, opts) {
    opts = opts || {};
    const useMemory = opts.memory !== false;
    const seed = (opts.seed == null ? Math.floor(Math.random() * 4294967296) : opts.seed) >>> 0;
    const traits = { seeds: {}, tpl: {} };
    const seedOf = function (f) { return traits.seeds[f] = SC.util.hash(seed, f); };
    traits.name = makeName(kind, SC.util.mulberry32(seedOf("name")), opts);
    const ctx = { name: traits.name, kind: kind };
    LIST_FIELDS.forEach(function (f) {
      const raw = buildField(f, kind, seedOf(f), ctx, useMemory);
      setLine(traits, f, raw, ctx);
    });
    traits.age = buildField("age", kind, seedOf("age"), ctx, useMemory);
    traits.stats = buildField("stats", kind, seedOf("stats"), ctx, useMemory);
    traits.moves = buildField("moves", kind, seedOf("moves"), ctx, useMemory);
    return traits;
  }

  function setLine(traits, field, raw, ctx) {
    const filled = fill(raw, { name: ctx.name, kind: ctx.kind });
    traits[field] = filled;
    if (/\{name\}/.test(raw)) traits.tpl[field] = { raw: raw, filled: filled };
    else delete traits.tpl[field];
  }

  function reroll(traits, fieldOrAll, opts) {
    opts = opts || {};
    const kind = opts.kind || "mystery";
    const useMemory = opts.memory !== false;
    const t = JSON.parse(JSON.stringify(traits));
    t.seeds = t.seeds || {}; t.tpl = t.tpl || {};
    const bump = function (f) { return t.seeds[f] = SC.util.hash(t.seeds[f] || 1, "reroll", f); };
    let which;
    if (fieldOrAll === "all") which = LIST_FIELDS.concat(["age", "stats", "moves"]);
    else which = [fieldOrAll];
    which.forEach(function (f) {
      if (f === "name") {
        t.name = makeName(kind, SC.util.mulberry32(bump("name")), opts);
        // refresh the lines that quote the name, unless the person edited them
        Object.keys(t.tpl).forEach(function (k) {
          const e = t.tpl[k];
          if (t[k] === e.filled) setLine(t, k, e.raw, { name: t.name, kind: kind });
        });
      } else if (LIST_FIELDS.indexOf(f) >= 0) {
        setLine(t, f, buildField(f, kind, bump(f), null, useMemory), { name: t.name, kind: kind });
      } else if (f === "age" || f === "stats" || f === "moves") {
        t[f] = buildField(f, kind, bump(f), null, useMemory);
      }
    });
    return t;
  }

  // golden is rolled once when a card is created: SC.GOLDEN_CHANCE (0.05); the site passes &golden=1 to force it
  function rollGolden(seed) { return SC.util.mulberry32(SC.util.hash(seed, "golden"))() < SC.GOLDEN_CHANCE; }

  function fieldsFor(styleId) { return (FIELDS_FOR[styleId] || FIELDS_FOR.minimal).slice(); }

  SC.content = {
    FIELDS: FIELDS, LIST_FIELDS: LIST_FIELDS, KIND_WORD: KIND_WORD,
    generate: generate, reroll: reroll, fill: fill, smart: smart, kindWord: kindWord,
    recipientLine: recipientLine, fieldsFor: fieldsFor, resetSession: resetSession, rollGolden: rollGolden, isIndianLocale: isIndianLocale
  };
})();
