// Fonts and text fitting for the card engine (PLAN.md sections 5.4 and 6.4).
//
//   SC.text.ready() -> Promise<void>     loads the fonts listed in SC.PALETTE.fonts (never rejects; cards fall back to system fonts)
//   SC.text.fit(ctx, str, slot) -> { px, lines }        shrink -> wrap -> ellipsis, never wider than slot.w
//   SC.text.draw(ctx, str, slot, overrides?) -> { px, lines, width, baseline, height }
//   SC.text.width(ctx, str, fontKey, px, tracking?, slot?) -> number
//   SC.text.cap(fontKey) -> cap-height ratio (measured once the font is loaded)
//
// What a slot is: see the top comment of palette.js. Text is never allowed outside its box: it shrinks from
// size[0] to size[1], then wraps to slot.lines, then gets an ellipsis.
//   - Hearts, stars, diamonds, crosses and dots (U+2665 U+2605 U+25C6 U+2715 U+25CF) are in none of the fonts,
//     so they are stripped from the text and drawn as shapes in the same colour (SC.art.glyph).
//   - Text in a script the fonts don't cover is drawn in the system font instead.
//   - Tracking is applied character by character so that every browser gives the same result.
//   - Colour runs: a name wrapped in U+E000 ... U+E001 is drawn in slot.toColor.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  const MARK_ON = "", MARK_OFF = "";
  const GLYPH_RE = /[♥★◆✕●]/;
  const NON_LATIN_RE = /[^\u0000-ɏ -⁯™€↑↓−∕﻿�♥★◆✕●]/;
  const FALLBACK_CAP = { serif: 0.66, serifItalic: 0.66, gothic: 0.735, hand: 0.61 };

  let readyPromise = null;
  const capCache = {};
  let measureCtx = null;

  function css(col, a) {
    if (a == null || a >= 1) return col;
    if (col.charAt(0) === "#") {
      const c = SC.util.hexToRgb(col);
      return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a + ")";
    }
    return col;
  }

  // ---------- font loading ----------
  function fontBase() {
    if (SC.text && SC.text.fontBase) return SC.text.fontBase;
    try {
      const list = document.getElementsByTagName("script");
      for (let i = 0; i < list.length; i++) {
        if (/engine\/text\.js/.test(list[i].src || "")) return new URL("../../fonts/", list[i].src).href;
      }
    } catch (e) { /* not in a page */ }
    return "fonts/";
  }
  function ready() {
    if (readyPromise) return readyPromise;
    if (typeof document === "undefined" || typeof FontFace === "undefined" || !document.fonts) {
      readyPromise = Promise.resolve();
      return readyPromise;
    }
    const P = SC.PALETTE, base = fontBase();
    readyPromise = Promise.all(["serif", "serifItalic", "gothic", "hand"].map(function (key) {
      const f = P.fonts[key];
      const url = base + f.file.replace(/^.*\//, "");
      const face = new FontFace(f.family, "url(" + url + ")", { weight: String(f.weight), style: f.style });
      return face.load().then(function (loaded) { document.fonts.add(loaded); }).catch(function () { /* system fallback */ });
    })).then(function () { /* fonts ready */ });
    return readyPromise;
  }

  // ---------- fonts ----------
  function fontString(key, px, str) {
    const f = SC.PALETTE.fonts[key];
    if (str && NON_LATIN_RE.test(str)) return f.style + " " + f.weight + " " + px + "px " + SC.PALETTE.fonts.nonLatinFallback;
    return f.style + " " + f.weight + " " + px + "px \"" + f.family + "\", " + f.fallback;
  }
  function setFont(c, key, px, str) { c.font = fontString(key, px, str); }
  function scratch() {
    if (!measureCtx) measureCtx = SC.util.createCanvas(8, 8).getContext("2d");
    return measureCtx;
  }
  function cap(key) {
    if (capCache[key]) return capCache[key];
    let r = FALLBACK_CAP[key] || 0.7;
    try {
      const c = scratch();
      c.font = fontString(key, 100);
      const m = c.measureText("H");
      if (m && m.actualBoundingBoxAscent > 30 && m.actualBoundingBoxAscent < 100) r = m.actualBoundingBoxAscent / 100;
      if (typeof document !== "undefined" && document.fonts && document.fonts.check && document.fonts.check(fontString(key, 100))) capCache[key] = r;
    } catch (e) { /* keep fallback */ }
    return r;
  }

  // ---------- strings ----------
  const smart = function (t) { return SC.content && SC.content.smart ? SC.content.smart(t) : String(t); };
  function prep(str, o) {
    let t = smart(String(str == null ? "" : str)).replace(/\s+/g, " ").trim();
    if (o.prefix) t = o.prefix + t;
    if (o.quotes) t = "“" + t.replace(/^[“‘"']+|[”’"']+$/g, "") + "”";
    if (o.upper) t = t.toUpperCase();
    return t;
  }

  // segments of one line: text runs and glyphs, each with an optional colour override
  function segments(line) {
    const out = [];
    let on = false, buf = "";
    function flush() { if (buf) { out.push({ t: "t", s: buf, mark: on }); buf = ""; } }
    for (let i = 0; i < line.length; i++) {
      const ch = line.charAt(i);
      if (ch === MARK_ON) { flush(); on = true; }
      else if (ch === MARK_OFF) { flush(); on = false; }
      else if (GLYPH_RE.test(ch)) { flush(); out.push({ t: "g", g: ch, mark: on }); }
      else buf += ch;
    }
    flush();
    return out;
  }
  function stripMarks(s) { return s.replace(/[]/g, ""); }

  function glyphLead(px, i) { return i > 0 ? px * 0.24 : 0; }   // air between the text before a glyph and the glyph
  function glyphSize(px, o) { return (o && o.heart && o.heart.size) ? o.heart.size : px * 0.6; }

  function runWidth(c, s, px, tr) {
    if (!tr) return c.measureText(s).width;
    let w = 0;
    for (let i = 0; i < s.length; i++) w += c.measureText(s.charAt(i)).width + tr * px;
    return w - tr * px;
  }
  // width of one line at a size, in px
  function width(c, line, key, px, tr, o) {
    tr = tr || 0;
    const clean = stripMarks(line);
    c.font = fontString(key, px, clean);
    const segs = segments(line);
    let w = 0;
    segs.forEach(function (sg, i) {
      if (sg.t === "g") w += glyphLead(px, i) + glyphSize(px, o) + (tr && i < segs.length - 1 ? tr * px : 0);
      else w += runWidth(c, sg.s, px, tr) + (tr && i < segs.length - 1 ? tr * px : 0);
    });
    return w;
  }

  // ---------- wrapping ----------
  function greedy(c, t, key, px, tr, w, o) {
    const words = t.split(" "), lines = [];
    let cur = "";
    words.forEach(function (wd) {
      const test = cur ? cur + " " + wd : wd;
      if (!cur || width(c, test, key, px, tr, o) <= w) cur = test;
      else { lines.push(cur); cur = wd; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  // the same number of lines, as even as possible (no lonely last word)
  function wrap(c, t, key, px, tr, w, o) {
    let lines = greedy(c, t, key, px, tr, w, o);
    if (lines.length < 2) return lines;
    const n = lines.length;
    for (let k = 0.96; k > 0.45; k -= 0.04) {
      const tryLines = greedy(c, t, key, px, tr, w * k, o);
      if (tryLines.length !== n) break;
      lines = tryLines;
    }
    return lines;
  }

  function fit(c, str, o) {
    const t = prep(str, o);
    const sz = Array.isArray(o.size) ? o.size : [o.size, o.size];
    const L = o.lines || 1, tr = o.tracking || 0, key = o.font;
    const lhMul = o.lineHeight || 1.1, capR = cap(key);
    const step = (sz[0] - sz[1]) > 40 ? 2 : 1;
    function blockH(n, px) { return (n - 1) * lhMul * px + capR * px; }
    for (let px = sz[0]; px >= sz[1]; px -= step) {
      if (L === 1) { if (width(c, t, key, px, tr, o) <= o.w) return { px: px, lines: [t] }; }
      else {
        const ls = wrap(c, t, key, px, tr, o.w, o);
        const okH = !o.h || blockH(ls.length, px) <= o.h + 2;
        if (ls.length <= L && okH && ls.every(function (l) { return width(c, l, key, px, tr, o) <= o.w; })) return { px: px, lines: ls };
      }
    }
    const px = sz[1];
    let ls = L === 1 ? [t] : wrap(c, t, key, px, tr, o.w, o);
    const cut = ls.length > L;
    ls = ls.slice(0, L);
    let last = ls[ls.length - 1];
    if (cut || width(c, last, key, px, tr, o) > o.w) {
      while (last.length > 1 && width(c, last + "…", key, px, tr, o) > o.w) last = last.slice(0, -1).replace(/\s+$/, "");
      ls[ls.length - 1] = last + "…";
    }
    return { px: px, lines: ls };
  }

  // ---------- drawing ----------
  function drawLine(c, line, x, base, key, px, tr, o, color, alpha) {
    const clean = stripMarks(line);
    const capR = cap(key);
    c.font = fontString(key, px, clean);
    c.textAlign = "left"; c.textBaseline = "alphabetic";
    let cx = x;
    const segs = segments(line);
    segs.forEach(function (sg, i) {
      const col = sg.mark && o.toColor ? o.toColor : color;
      const gap = tr && i < segs.length - 1 ? tr * px : 0;
      if (sg.t === "g") {
        const gs = glyphSize(px, o);
        const hs = o.heart || {};
        cx += glyphLead(px, i);
        const gcol = sg.mark && o.toColor ? o.toColor : (hs.color || o.glyphColor || color);
        SC.art.glyph(c, sg.g, cx + gs / 2, base - capR * px * 0.5, gs, { color: css(gcol, alpha), stroke: hs.stroke });
        c.font = fontString(key, px, clean);
        cx += gs + gap;
      } else {
        c.fillStyle = css(col, alpha);
        if (!tr) { c.fillText(sg.s, cx, base); cx += c.measureText(sg.s).width + gap; }
        else {
          for (let k = 0; k < sg.s.length; k++) {
            const ch = sg.s.charAt(k);
            c.fillText(ch, cx, base);
            cx += c.measureText(ch).width + tr * px;
          }
          cx -= tr * px; cx += gap;
        }
      }
    });
  }

  function draw(c, str, slot, ov) {
    const o = ov ? Object.assign({}, slot, ov) : slot;
    const r = fit(c, str, o), tr = o.tracking || 0, key = o.font, capR = cap(key);
    const al = o.align || "left";
    const lh = (o.lineHeight || 1.1) * r.px;
    const alpha = o.alpha == null ? 1 : o.alpha;
    let base;
    if (o.baseline != null) base = o.baseline;
    else if (o.top) base = o.y + capR * r.px;
    else base = o.y + o.h / 2 + capR * r.px / 2;
    if (o.lines > 1 && o.baseline == null && !o.top) base = o.y + capR * r.px;   // multi-line: from the top
    const widths = r.lines.map(function (l) { return width(c, l, key, r.px, tr, o); });
    const ox = o.x, ow = o.w;
    c.save();
    if (o.rotate) {
      const cx = o.x + o.w / 2, cy = (o.y != null && o.h != null) ? o.y + o.h / 2 : base;
      c.translate(cx, cy); c.rotate(o.rotate * Math.PI / 180); c.translate(-cx, -cy);
    }
    function pass(extra) {
      r.lines.forEach(function (l, i) {
        const lx = al === "center" ? ox + (ow - widths[i]) / 2 : al === "right" ? ox + ow - widths[i] : ox;
        drawLine(c, l, lx, base + i * lh, key, r.px, tr, o, o.color, extra == null ? alpha : extra);
      });
    }
    pass();
    if (o.inkSpread) {
      const s = Math.hypot(c.getTransform().a, c.getTransform().b) || 1, T = SC.PALETTE.texture.inkSpread;
      c.shadowColor = css(o.color, T.alpha); c.shadowBlur = T.blur * s * 2;
      pass(T.alpha * alpha);
    }
    c.restore();
    return { px: r.px, lines: r.lines, width: Math.max.apply(null, widths), baseline: base, height: (r.lines.length - 1) * lh + capR * r.px, widths: widths };
  }

  SC.text = {
    MARK_ON: MARK_ON, MARK_OFF: MARK_OFF,
    ready: ready, fontString: fontString, setFont: setFont, cap: cap, prep: prep, width: width,
    wrap: wrap, fit: fit, draw: draw, css: css, stripMarks: stripMarks
  };
})();
