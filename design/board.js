/* design/board.js: the design board's icons and hand-built card mocks. NEVER deployed.
   The card mocks read every value from SC.PALETTE (src/engine/palette.js), so the board doubles as
   a check that the palette is complete for Trading, Polaroid and Wanted. The real engine is the
   engine-builder's; this is a sketch of the intent, not the implementation. */
(function () {
  "use strict";
  var P = globalThis.SC.PALETTE;

  /* ================================================================
     ICONS: the canonical set. 24x24, 2 px padding, stroke 1.75, round caps and joins, no fills
     except the die's pips, the pin's centre and the question mark's dot. Animals are profile
     silhouettes with NO eyes, mouths or faces. The site-builder copies these paths.
     ================================================================ */
  var ICONS = {
    cat: '<path d="M13.2 9.1 13.6 4.3l2 2.1c.7-.2 1.4-.2 2 0l1.5-2.2.2 4.4c0 1.9-.9 3.1-2.5 3.6-.5 2.6-.3 5.3.3 8.3H8.8c-2.3 0-3.2-1.6-3-4.3.3-4.5 2.7-6.6 7.4-7.1Z"/><path d="M8.8 20.5c-3.5.4-5.3-.9-5.3-2.9 0-1.1.6-1.8 1.4-2.1"/>',
    dog: '<path d="M3.6 8.3 7 7.3l1.6-1.9c.8-.6 2.3-.7 3.2 0 .7.6 1 1.6.9 3l-.1 1.9c2.7.8 4.7 2.6 5.3 5.4.4 1.8.3 3.4-.1 4.8H9.2c-.4-2.4-.4-4.6 0-6.6-.2-1.3-1-2.2-2.2-2.5l-2.6-.4c-.8-.2-1.1-.8-.8-1.6Z"/><path d="M9.6 5.6c-.9 1.4-.8 2.9.3 4.2"/><path d="M17.6 15.2c1.2-.6 2-1.6 2.4-3.2"/><path d="M13.6 20.5c-.4-2 .3-3.6 1.8-4.6"/>',
    pigeon: '<path d="M4.6 8.4 6.3 7.3c.4-1.6 1.4-2.2 2.6-2 1.1.2 1.6 1 1.4 2.3-.1 1.3.5 2.2 1.6 2.7 3 .3 5.8 1.1 8.3 2.1l-.9 2.1c-1.8.2-3.4.8-4.8 1.9-1.6 1.2-3.4 1.6-5.3 1.1-2.6-.7-3.6-2.6-3.3-5.4.1-.9.3-1.6.5-2.2-.9-.4-1.8-.6-2.8-.5Z"/><path d="M10.9 11.8c1.9.3 3.6 1 5 2.1"/><path d="m10.1 17.4-.4 2.8m3.1-2.9.4 2.9"/>',
    crow: '<path d="M2.8 7.9 7 6.6c1.1-1.4 2.6-1.8 3.8-.9.9.6 1.2 1.6 1.1 2.9 2.2 1.2 4 3 5.3 5.1l3.8 4.6-2.9-.1-2.3-1.6c-2 .9-4.2.9-6-.3-1.5-1-2.1-2.8-1.9-5l-.9-1.8c-1.4-.2-2.8-.7-4.2-1.5Z"/><path d="m11.5 16.6-.6 3.9m2.5-3.4v3.4"/>',
    cow: '<path d="M8.5 7.7c2.3-.9 4.7-.9 7 0l-.5 7.3c1 .9 1.4 2.1 1.1 3.5-.3 1.4-1.6 2.1-4.1 2.1s-3.8-.7-4.1-2.1c-.3-1.4.1-2.6 1.1-3.5Z"/><path d="M8.6 7.7C6.7 7 5.8 5.5 5.7 3.6m9.7 4.1c1.9-.7 2.8-2.2 2.9-4.1"/><path d="M8.7 9.4c-2 .5-3.7.2-5.1-1 .8 2 2.6 3.2 5.1 3.2m6.6-2.2c2 .5 3.7.2 5.1-1-.8 2-2.6 3.2-5.1 3.2"/><path d="M9.1 16.5c1.9.7 3.9.7 5.8 0"/>',
    squirrel: '<path d="M8.4 20.5c-1.3-.3-1.8-1.4-1.6-3.3.2-2 .8-3.6 1.6-4.6-.9-.4-1.6-1.1-1.9-2.1-.9 0-1.4-.4-1.5-1 .3-1.3 1.2-2 2.4-2.2l.2-1.9 1.3 1.8c1.6.6 2.4 1.7 2.4 3.4.8 1.4 1.1 3 1 4.8-.1 2-.6 3.7-1.5 5.1Z"/><path d="M11.4 19.6c3.3.5 5.5-.7 6.1-3.4.6-2.8-.1-4.5-2-5.6-1.6-.9-2-2.5-1.3-4.3.8-1.9 3-2.4 4.8-1.6 1.3.6 1.7 1.8 1.2 3"/><path d="M7.7 13.8c.6.6 1.3.6 1.8 0"/>',
    monkey: '<path d="M8.4 4.1c1.8 0 3.1 1.4 3.1 3.1 0 1.8-1.4 3.1-3.1 3.1-1 0-1.8-.4-2.4-1.1l-1-.1c-.6-.2-.8-.9-.4-1.4l.6-.6c.1-1.7 1.5-3 3.2-3Z"/><path d="M10.4 9.7c2.8.6 4.5 2.8 4.5 5.8 0 1.8-.5 3.5-1.6 5H7.8c-.3-1.5.2-2.8 1.3-3.6"/><path d="M8.8 10.3c.1 2.4-.7 4.4-2.4 5.7"/><path d="M13.8 19.6c3.2.9 5.6-.4 6-3 .3-1.8-.6-3.2-2-3.2-1.2 0-1.8 1-1.4 2 .3.7 1.1.8 1.5.3"/>',
    bird: '<path d="M4.4 9.6 6.5 8.7c.6-1.7 1.8-2.4 3.2-2 1.1.3 1.7 1.2 1.7 2.5 2.1 2 4.9 3.5 8.4 4.5-2.4.5-4.8.9-7.2 1.4-2.3.8-4.3.4-5.3-1.3-.6-1-.7-2.2-.4-3.3-.9-.5-1.7-.8-2.5-.9Z"/><path d="M3 18.4c5.9-1.2 11.9-1.2 18 0"/><path d="m10.1 15.9-.3 1.7m1.9-1.9.2 1.6m3.8.2 1.4-1.9"/>',
    mystery: '<circle cx="12" cy="12" r="8.6" stroke-dasharray="2 2.2"/><path d="M9.7 9.7c.1-1.5 1-2.4 2.3-2.4 1.4 0 2.4.9 2.4 2.2 0 1.1-.6 1.7-1.5 2.2-.7.4-.9.9-.9 1.9"/><circle cx="12" cy="16.3" r=".95" fill="currentColor" stroke="none"/>',
    dice: '<g transform="rotate(12 12 12)"><rect x="4.5" y="4.5" width="15" height="15" rx="3.5"/><circle cx="8.6" cy="8.6" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.4" cy="15.4" r="1.25" fill="currentColor" stroke="none"/></g>',
    pencil: '<path d="m4.2 19.8 1-4.4L15.9 4.7a1.6 1.6 0 0 1 2.3 0l1.1 1.1a1.6 1.6 0 0 1 0 2.3L8.6 18.8Z"/><path d="m14.2 6.4 3.4 3.4M5.2 15.4l3.4 3.4"/>',
    crop: '<path d="M7 3v14h14"/><path d="M3 7h14v14"/>',
    share: '<path d="M5 13.5v5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M12 15V3.8M8.2 7.5 12 3.7l3.8 3.8"/>',
    save: '<path d="M5 13.5v5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M12 3.8V15M8.2 11.2 12 15l3.8-3.8"/>',
    binder: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 3v18M7 7.5h4M7 12h4M7 16.5h4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    pin: '<path d="M12 21c-4.3-4.2-6.5-7.9-6.5-11.2a6.5 6.5 0 0 1 13 0c0 3.3-2.2 7-6.5 11.2Z"/><circle cx="12" cy="9.8" r="1.6" fill="currentColor" stroke="none"/>',
    heart: '<path d="M12 19.8c-5-3.2-8-6.4-8-10.2 0-2.4 1.7-4.1 3.8-4.1 1.8 0 3.2 1 4.2 2.7 1-1.8 2.5-2.8 4.4-2.7 2.1.1 3.7 1.9 3.6 4.3-.2 3.6-3.1 6.9-8 10Z"/>',
    camera: '<path d="M3.5 8.6A1.6 1.6 0 0 1 5.1 7h2.7l1.6-2.2h5.2L16.2 7h2.7a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/><circle cx="12" cy="12.8" r="3.5"/>',
    photos: '<path d="M7.5 4h11A1.5 1.5 0 0 1 20 5.5v10.5"/><rect x="4" y="7.5" width="12.5" height="12.5" rx="2"/><path d="m4.4 17 3.6-3.4 2.6 2.4 1.8-1.6 4 3.4"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    trash: '<path d="M4 6.5h16M9.5 6.5v-2h5v2M6 6.5l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 10v7m4-7v7"/>',
    check: '<path d="m4.5 12.6 5 5 10-11"/>',
    story: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M10.5 17.6h3"/>'
  };
  var ICON_ORDER = ["cat", "dog", "pigeon", "crow", "cow", "squirrel", "monkey", "bird", "mystery",
    "dice", "pencil", "crop", "share", "save", "binder", "close", "back", "pin", "heart",
    "camera", "photos", "lock", "trash", "check", "story"];

  function iconSVG(name, size, sw) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="' +
      (sw || 1.75) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }
  function fillIcons(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-icon]"), function (el) {
      el.innerHTML = iconSVG(el.getAttribute("data-icon"), +(el.getAttribute("data-size") || 24), el.getAttribute("data-sw"));
    });
  }

  /* ================================================================
     small helpers
     ================================================================ */
  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function rgba(h, a) { var c = hex(h); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a == null ? 1 : a) + ")"; }
  function F(key, px) { var f = P.fonts[key]; return f.style + " " + f.weight + " " + px + "px \"" + f.family + "\", " + f.fallback; }
  var CAP = { serif: 0.66, serifItalic: 0.66, gothic: 0.735, hand: 0.61 };
  function smart(t) {
    return String(t)
      .replace(/(^|[\s(\[])"/g, "$1“").replace(/"/g, "”")
      .replace(/(^|[\s(\[])'/g, "$1‘").replace(/'/g, "’");
  }
  function setF(c, key, px, tr) { c.font = F(key, px); c.letterSpacing = ((tr || 0) * px) + "px"; }
  function tw(c, text, key, px, tr) { setF(c, key, px, tr); return c.measureText(text).width - (tr || 0) * px; }
  function rr(c, x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  /* the accession-tag outline: rounded rect with a semicircle notch in each short end */
  function tagPath(c, x, y, w, h, r, n) {
    var my = y + h / 2;
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, my - n); c.arc(x + w, my, n, -Math.PI / 2, Math.PI / 2, true);
    c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r); c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, my + n); c.arc(x, my, n, Math.PI / 2, -Math.PI / 2, true);
    c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
  }
  function starPath(c, cx, cy, ro, ri, pts) {
    pts = pts || 5; c.beginPath();
    for (var i = 0; i < pts * 2; i++) {
      var r = i % 2 ? ri : ro, a = -Math.PI / 2 + i * Math.PI / pts;
      c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    c.closePath();
  }
  /* the icon heart, as a canvas path, centred, `size` tall */
  function heartPath(c, cx, cy, size) {
    var k = size / 16, ox = cx - 12 * k, oy = cy - 12.6 * k;
    var p = new Path2D("M12 19.8c-5-3.2-8-6.4-8-10.2 0-2.4 1.7-4.1 3.8-4.1 1.8 0 3.2 1 4.2 2.7 1-1.8 2.5-2.8 4.4-2.7 2.1.1 3.7 1.9 3.6 4.3-.2 3.6-3.1 6.9-8 10Z");
    c.save(); c.translate(ox, oy); c.scale(k, k); return { path: p, done: function () { c.restore(); } };
  }

  /* ---------- text fitting: shrink -> wrap -> ellipsis ---------- */
  function wrap(c, t, key, px, tr, w) {
    var words = t.split(" "), lines = [], cur = "";
    words.forEach(function (wd) {
      var test = cur ? cur + " " + wd : wd;
      if (!cur || tw(c, test, key, px, tr) <= w) cur = test; else { lines.push(cur); cur = wd; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function prep(str, o) {
    var t = smart(str);
    if (o.quotes) t = "“" + t.replace(/^[“‘]+|[”’]+$/g, "") + "”";
    if (o.upper) t = t.toUpperCase();
    return t;
  }
  function fit(c, str, o) {
    var t = prep(str, o), sz = Array.isArray(o.size) ? o.size : [o.size, o.size], L = o.lines || 1, tr = o.tracking || 0, px, ls;
    for (px = sz[0]; px >= sz[1]; px -= 1) {
      if (L === 1) { if (tw(c, t, o.font, px, tr) <= o.w) return { px: px, lines: [t] }; }
      else {
        ls = wrap(c, t, o.font, px, tr, o.w);
        if (ls.length <= L && ls.every(function (l) { return tw(c, l, o.font, px, tr) <= o.w; })) return { px: px, lines: ls };
      }
    }
    px = sz[1];
    ls = L === 1 ? [t] : wrap(c, t, o.font, px, tr, o.w);
    var cut = ls.length > L; ls = ls.slice(0, L);
    var last = ls[ls.length - 1];
    if (cut || tw(c, last, o.font, px, tr) > o.w) {
      while (last.length > 1 && tw(c, last + "…", o.font, px, tr) > o.w) last = last.slice(0, -1).replace(/\s+$/, "");
      ls[ls.length - 1] = last + "…";
    }
    return { px: px, lines: ls };
  }
  /* draw a slot. o = palette slot (+ overrides). returns {px, lines, width} */
  function text(c, s, str, o) {
    var r = fit(c, str, o), tr = o.tracking || 0, al = o.align || "left";
    setF(c, o.font, r.px, tr);
    c.textAlign = al; c.textBaseline = "alphabetic";
    var x = al === "center" ? o.x + o.w / 2 : al === "right" ? o.x + o.w : o.x;
    if (tr && al === "center") x += tr * r.px / 2;
    if (tr && al === "right") x += tr * r.px;
    var base = o.baseline != null ? o.baseline : o.y + o.h / 2 + CAP[o.font] * r.px / 2;
    var lh = (o.lineHeight || 1.1) * r.px;
    var col = o.color, a = o.alpha == null ? 1 : o.alpha;
    c.fillStyle = rgba(col, a);
    r.lines.forEach(function (l, i) { c.fillText(l, x, base + i * lh); });
    if (o.inkSpread) {
      c.save(); c.shadowColor = rgba(col, P.texture.inkSpread.alpha); c.shadowBlur = P.texture.inkSpread.blur * s * 2;
      c.globalAlpha = P.texture.inkSpread.alpha;
      r.lines.forEach(function (l, i) { c.fillText(l, x, base + i * lh); });
      c.restore();
    }
    r.width = Math.max.apply(null, r.lines.map(function (l) { return tw(c, l, o.font, r.px, tr); }));
    r.baseline = base;
    setF(c, o.font, r.px, 0);
    return r;
  }

  /* ---------- layers (offscreen, for foil fills and ink dropout) ---------- */
  function layer(c, s, draw, post, alpha) {
    var o = document.createElement("canvas"); o.width = c.canvas.width; o.height = c.canvas.height;
    var x = o.getContext("2d"); x.setTransform(s, 0, 0, s, 0, 0);
    draw(x); if (post) post(x);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = alpha == null ? 1 : alpha; c.drawImage(o, 0, 0); c.restore();
  }
  function foilPaint(x, b, seed) {
    var f = P.foil, a = f.angle * Math.PI / 180, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    var L = (Math.abs(b.w * Math.cos(a)) + Math.abs(b.h * Math.sin(a))) / 2;
    var g = x.createLinearGradient(cx - Math.cos(a) * L, cy - Math.sin(a) * L, cx + Math.cos(a) * L, cy + Math.sin(a) * L);
    f.stops.forEach(function (st) { g.addColorStop(st[0], st[1]); });
    x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    var r = mulberry(seed || 3), d = Math.hypot(b.w, b.h);
    x.save(); x.globalAlpha = f.bands.alpha; x.fillStyle = f.bands.color;
    for (var i = 0; i < f.bands.count; i++) {
      var px = b.x + b.w * (0.12 + 0.76 * r()), py = b.y + b.h * (0.2 + 0.6 * r());
      var bw = d * (f.bands.widthMin + (f.bands.widthMax - f.bands.widthMin) * r());
      x.save(); x.translate(px, py); x.rotate(f.bands.angle * Math.PI / 180); x.fillRect(-d, -bw / 2, 2 * d, bw); x.restore();
    }
    x.restore();
    x.save(); x.globalAlpha = f.brushed.alpha; x.fillStyle = f.brushed.color;
    for (var y = b.y; y < b.y + b.h; y += f.brushed.every) x.fillRect(b.x, y, b.w, f.brushed.width);
    x.restore();
  }
  function foilize(x, b, seed) { x.save(); x.globalCompositeOperation = "source-atop"; foilPaint(x, b, seed); x.restore(); }
  function dropout(x, b, coverage, seed) {
    var r = mulberry(seed || 9), D = P.texture.dropout, avg = Math.PI * Math.pow((D.rMin + D.rMax) / 2, 2);
    var n = Math.round(coverage * b.w * b.h / avg);
    x.save(); x.globalCompositeOperation = "destination-out"; x.fillStyle = "#000";
    for (var i = 0; i < n; i++) { x.beginPath(); x.arc(b.x + r() * b.w, b.y + r() * b.h, D.rMin + (D.rMax - D.rMin) * r(), 0, 7); x.fill(); }
    x.restore();
  }

  /* ---------- textures ---------- */
  var grainTile = null;
  function grain(c, x, y, w, h, a) {
    if (!a) return;
    if (!grainTile) {
      grainTile = document.createElement("canvas"); grainTile.width = grainTile.height = P.texture.grain.tile;
      var g = grainTile.getContext("2d"), id = g.createImageData(grainTile.width, grainTile.height), r = mulberry(7);
      for (var i = 0; i < id.data.length; i += 4) { var v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      g.putImageData(id, 0, 0);
    }
    c.save(); c.globalCompositeOperation = P.texture.grain.op; c.globalAlpha = a;
    var t = c.getTransform(); c.setTransform(1, 0, 0, 1, 0, 0);   /* grain in device pixels: paper, never a noise filter */
    c.fillStyle = c.createPattern(grainTile, "repeat");
    c.fillRect(x * t.a + t.e, y * t.d + t.f, w * t.a, h * t.d);
    c.restore();
  }
  function fibres(c, w, h, density, seed) {
    var F_ = P.texture.fibres, r = mulberry(seed), n = Math.round(density * w * h / 10000);
    c.save(); c.strokeStyle = rgba("#2a2118", F_.alpha); c.lineWidth = F_.width; c.lineCap = "round";
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h, L = F_.lenMin + (F_.lenMax - F_.lenMin) * r(), a = r() * Math.PI * 2, bend = (r() - 0.5) * 6;
      c.beginPath(); c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * L / 2 + bend, y + Math.sin(a) * L / 2 - bend, x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
    }
    c.restore();
  }
  function dotGrid(c, w, h, seed) {
    var D = P.texture.dotGrid, r = mulberry(seed), ox = r() * D.every, oy = r() * D.every;
    c.save(); c.fillStyle = rgba(D.color, D.alpha);
    for (var y = oy; y < h; y += D.every) for (var x = ox; x < w; x += D.every) { c.beginPath(); c.arc(x, y, D.r, 0, 7); c.fill(); }
    c.restore();
  }
  function stains(c, w, h, seed) {
    var S = P.texture.stains, r = mulberry(seed), n = S.count[0] + Math.floor(r() * (S.count[1] - S.count[0] + 1));
    for (var i = 0; i < n; i++) {
      var x = r() * w, y = r() * h, rad = S.r[0] + (S.r[1] - S.r[0]) * r(), a = S.alpha[0] + (S.alpha[1] - S.alpha[0]) * r();
      var g = c.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, rgba(S.color, a)); g.addColorStop(0.7, rgba(S.color, a * 0.5)); g.addColorStop(1, rgba(S.color, 0));
      c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    /* one coffee ring, broken in two places */
    var cx = 160 + r() * 760, cy = 1000 + r() * 200, rr_ = S.ring.r[0] + (S.ring.r[1] - S.ring.r[0]) * r(), st = r() * 6;
    c.save(); c.strokeStyle = rgba(S.color, S.ring.alpha); c.lineWidth = S.ring.width;
    c.beginPath(); c.arc(cx, cy, rr_, st, st + 2.6); c.stroke();
    c.beginPath(); c.arc(cx + 2, cy - 1, rr_ - 1, st + 2.9, st + 5.9); c.stroke();
    c.restore();
  }
  function edgeBurn(c, w, h) {
    var E = P.texture.edgeBurn, d = E.depth, g;
    [[0, 0, 0, d, 0, 0, w, d], [0, h, 0, h - d, 0, h - d, w, d], [0, 0, d, 0, 0, 0, d, h], [w, 0, w - d, 0, w - d, 0, d, h]].forEach(function (q) {
      g = c.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, rgba(E.color, E.alpha)); g.addColorStop(1, rgba(E.color, 0));
      c.fillStyle = g; c.fillRect(q[4], q[5], q[6], q[7]);
    });
  }
  function crease(c, w, h, dir, at) {
    var C = P.texture.crease;
    c.save();
    c.fillStyle = rgba(C.light.color, C.light.alpha);
    if (dir === "h") c.fillRect(0, at, w, 1); else c.fillRect(at, 0, 1, h);
    c.fillStyle = rgba(C.dark.color, C.dark.alpha);
    if (dir === "h") c.fillRect(0, at + 1, w, 1); else c.fillRect(at + 1, 0, 1, h);
    c.restore();
  }
  function nail(c, x, y) {
    var N = P.texture.nail;
    c.save();
    c.fillStyle = rgba(N.shadow.color, N.shadow.alpha);
    c.beginPath(); c.ellipse(x + N.shadow.dx, y + N.shadow.dy, N.shadow.w, N.shadow.h, 0.5, 0, 7); c.fill();
    c.fillStyle = N.rim; c.beginPath(); c.arc(x, y, N.r, 0, 7); c.fill();
    c.fillStyle = N.top; c.beginPath(); c.arc(x, y, N.topR, 0, 7); c.fill();
    c.fillStyle = N.hi; c.beginPath(); c.arc(x + N.hiAt[0], y + N.hiAt[1], N.hiR, 0, 7); c.fill();
    c.restore();
  }
  function printShadow(c, s, pathFn, fill) {
    P.texture.printShadow.forEach(function (sh) {
      c.save(); c.shadowColor = rgba(sh.color, sh.alpha); c.shadowBlur = sh.blur * s; c.shadowOffsetY = sh.y * s;
      pathFn(c); c.fillStyle = fill; c.fill(); c.restore();
    });
  }

  /* ---------- the photo + grade ---------- */
  function photoCanvas(img, crop, w, h, g, kindInk, seed) {
    var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
    var x = c.getContext("2d"), iw = img.naturalWidth, ih = img.naturalHeight;
    var sc = Math.max(c.width / iw, c.height / ih) * crop.zoom, sw = c.width / sc, sh = c.height / sc;
    var sx = Math.min(Math.max(crop.cx * iw - sw / 2, 0), iw - sw), sy = Math.min(Math.max(crop.cy * ih - sh / 2, 0), ih - sh);
    x.imageSmoothingQuality = "high";
    x.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
    var id = x.getImageData(0, 0, c.width, c.height), d = id.data, r = mulberry(seed || 5);
    var sp = g.split || {}, shc = sp.shadows ? hex(sp.shadows === "kind" ? kindInk : sp.shadows).map(function (v) { return v / 255; }) : null;
    var hic = sp.highlights ? hex(sp.highlights).map(function (v) { return v / 255; }) : null;
    var ramp = g.ramp ? g.ramp.map(function (st) { return [st[0], hex(st[1]).map(function (v) { return v / 255; })]; }) : null;
    for (var i = 0; i < d.length; i += 4) {
      var R = d[i] / 255, G = d[i + 1] / 255, B = d[i + 2] / 255, L, k;
      R = (R - 0.5) * g.contrast + 0.5; G = (G - 0.5) * g.contrast + 0.5; B = (B - 0.5) * g.contrast + 0.5;
      L = 0.299 * R + 0.587 * G + 0.114 * B;
      R = L + (R - L) * g.saturation; G = L + (G - L) * g.saturation; B = L + (B - L) * g.saturation;
      if (g.warmth) { R += g.warmth / 255; B -= g.warmth / 255; }
      if (g.lift) { R = g.lift + (1 - g.lift) * R; G = g.lift + (1 - g.lift) * G; B = g.lift + (1 - g.lift) * B; }
      L = Math.min(1, Math.max(0, 0.299 * R + 0.587 * G + 0.114 * B));
      if (shc) { k = sp.shadowAmount * (1 - L) * (1 - L); R += (shc[0] - R) * k; G += (shc[1] - G) * k; B += (shc[2] - B) * k; }
      if (hic) { k = sp.highlightAmount * L * L; R += (hic[0] - R) * k; G += (hic[1] - G) * k; B += (hic[2] - B) * k; }
      if (ramp) {
        for (var j = 1; j < ramp.length; j++) if (L <= ramp[j][0] || j === ramp.length - 1) break;
        var a0 = ramp[j - 1], a1 = ramp[j], t = Math.min(1, Math.max(0, (L - a0[0]) / (a1[0] - a0[0])));
        R = a0[1][0] + (a1[1][0] - a0[1][0]) * t; G = a0[1][1] + (a1[1][1] - a0[1][1]) * t; B = a0[1][2] + (a1[1][2] - a0[1][2]) * t;
      }
      if (g.grain) { k = (r() - 0.5) * g.grain * 2; R += k; G += k; B += k; }
      d[i] = R * 255; d[i + 1] = G * 255; d[i + 2] = B * 255;
    }
    x.putImageData(id, 0, 0);
    if (g.vignette) {
      var hd = Math.hypot(c.width, c.height) / 2, vg = x.createRadialGradient(c.width / 2, c.height / 2, hd * P.texture.vignette.from, c.width / 2, c.height / 2, hd);
      vg.addColorStop(0, rgba(g.vignetteColor || "#000000", 0)); vg.addColorStop(1, rgba(g.vignetteColor || "#000000", g.vignette));
      x.fillStyle = vg; x.fillRect(0, 0, c.width, c.height);
    }
    return c;
  }
  function drawPhoto(c, s, card, win, styleId, path) {
    var pc = photoCanvas(card.img, card.crop, win.w * s, win.h * s, P.grades[styleId], P.kinds[card.kind].ink, card.seed);
    c.save(); (path || function () { rr(c, win.x, win.y, win.w, win.h, win.radius || 0); })(); c.clip();
    c.drawImage(pc, win.x, win.y, win.w, win.h); c.restore();
  }

  /* ---------- the shared signature: rarity mark, accession tag, address ---------- */
  function rarityMark(c, cx, cy, rarity, color, golden, s, seed) {
    var R = P.rarity[golden ? "golden" : rarity];
    function shape(x) {
      x.beginPath();
      if (R.shape === "circle") x.arc(cx, cy, R.d / 2, 0, 7);
      else if (R.shape === "diamond") { x.moveTo(cx, cy - R.h / 2); x.lineTo(cx + R.w / 2, cy); x.lineTo(cx, cy + R.h / 2); x.lineTo(cx - R.w / 2, cy); x.closePath(); }
      else starPath(x, cx, cy, R.outer, R.inner, R.points);
    }
    if (golden) {
      layer(c, s, function (x) {
        shape(x); x.fillStyle = "#000"; x.fill();
        x.beginPath(); x.arc(cx, cy, R.ring.r, 0, 7); x.lineWidth = R.ring.width; x.strokeStyle = "#000"; x.stroke();
        foilize(x, { x: cx - 16, y: cy - 16, w: 32, h: 32 }, seed);
      });
    } else { shape(c); c.fillStyle = color; c.fill(); }
  }
  function drawTag(c, s, x, y, o) {
    var T = P.tag, golden = o.golden, ink = golden ? T.golden.stroke : o.color, txt = golden ? T.golden.text : o.color;
    if (golden) layer(c, s, function (L) { tagPath(L, x, y, T.w, T.h, T.radius, T.notch.r); L.fillStyle = "#000"; L.fill(); foilize(L, { x: x, y: y, w: T.w, h: T.h }, o.seed); });
    layer(c, s, function (L) {
      var i = T.stroke / 2;
      tagPath(L, x + i, y + i, T.w - 2 * i, T.h - 2 * i, T.radius, T.notch.r); L.lineWidth = T.stroke; L.strokeStyle = ink; L.stroke();
      if (!golden) rarityMark(L, x + T.mark.cx, y + T.h / 2, o.rarity, txt, false, s);
      else { var R = P.rarity.golden; starPath(L, x + T.mark.cx, y + T.h / 2, R.outer, R.inner); L.fillStyle = txt; L.fill(); }
      var N = T.number, num = N.prefix + String(o.number).padStart(N.pad, "0"), px = N.size, cx = x + N.x, base = y + T.h / 2 + CAP.gothic * px / 2 + N.nudgeY;
      setF(L, "gothic", px, 0); L.textAlign = "center"; L.fillStyle = txt;
      for (var k = 0; k < num.length; k++) {
        var ch = num[k], cell = (ch === "#" ? N.hashCell : N.cell) * px;
        L.fillText(ch, cx + cell / 2, base); cx += cell + N.tracking * px;
      }
    }, function (L) { dropout(L, { x: x, y: y, w: T.w, h: T.h }, T.dropout, o.seed + 1); });
  }
  function drawAddress(c, x, y, align, color, alpha) {
    var A = P.address, T = P.tag, base = y + T.h / 2 + CAP.gothic * A.size / 2;
    setF(c, "gothic", A.size, A.tracking); c.textAlign = align; c.fillStyle = rgba(color, alpha);
    c.fillText(A.text, align === "right" ? x + A.tracking * A.size : x, base);
    setF(c, "gothic", A.size, 0);
  }
  function colophon(c, s, st, card, color, alpha, opts) {
    var T = P.tag, A = P.address, tg = st.colophon.tag, ad = st.colophon.address;
    drawTag(c, s, tg.x, tg.y, { color: (opts && opts.tagColor) || color, rarity: card.rarity, number: card.number, golden: card.golden, seed: card.seed + 40 });
    var ax = ad.align === "right" ? (ad.x != null ? ad.x : tg.x - A.gap) : tg.x + T.w + A.gap;
    drawAddress(c, ax, tg.y, ad.align, (opts && opts.addrColor) || color, (opts && opts.addrAlpha) || alpha || A.alpha);
  }

  /* ---------- stamp and tape ---------- */
  function stamp(c, s, cx, cy, rot, color, alpha, lines, seed, maxW) {
    var S = P.texture.stamp, inner = S.outer + S.gap + S.inner;
    var fitted = lines.map(function (l) { var o = { font: l.font, size: l.size, tracking: l.tracking || 0, upper: l.upper, w: (maxW || 600) - 2 * (S.padX + inner) }; var r = fit(c, l.text, o); r.o = o; r.w = tw(c, r.lines[0], l.font, r.px, o.tracking); return r; });
    var hs = fitted.map(function (f) { return f.px * (f.o.font === "gothic" ? 0.78 : 0.95); });
    var w = Math.max.apply(null, fitted.map(function (f) { return f.w; })) + 2 * (S.padX + inner);
    var h = hs.reduce(function (a, b) { return a + b; }, 0) + (lines.length - 1) * 10 + 2 * (S.padY + inner);
    layer(c, s, function (L) {
      L.translate(cx, cy); L.rotate(rot * Math.PI / 180);
      L.strokeStyle = color; L.fillStyle = color;
      L.lineWidth = S.outer; rr(L, -w / 2 + S.outer / 2, -h / 2 + S.outer / 2, w - S.outer, h - S.outer, S.radius); L.stroke();
      var ii = S.outer + S.gap + S.inner / 2; L.lineWidth = S.inner; rr(L, -w / 2 + ii, -h / 2 + ii, w - 2 * ii, h - 2 * ii, Math.max(2, S.radius - 3)); L.stroke();
      var y = -h / 2 + S.padY + inner;
      fitted.forEach(function (f, i) {
        y += hs[i]; setF(L, f.o.font, f.px, f.o.tracking); L.textAlign = "center";
        L.fillText(f.lines[0], (f.o.tracking || 0) * f.px / 2, y - (f.o.font === "gothic" ? 0 : hs[i] * 0.12));
        y += 10;
      });
    }, function (L) { dropout(L, { x: cx - w * 0.6, y: cy - h, w: w * 1.2, h: h * 2 }, S.dropout, seed); }, alpha);
  }
  function washi(c, s, cx, cy, rot, color, alpha, seed, foil) {
    var W = P.texture.washi, w = W.w, h = W.h, r = mulberry(seed);
    function path(L) {
      L.beginPath(); L.moveTo(-w / 2, -h / 2);
      L.lineTo(w / 2, -h / 2);
      for (var i = 1; i <= W.teeth; i++) L.lineTo(w / 2 + (i % 2 ? -W.tooth : 0) + (r() - 0.5) * 2, -h / 2 + h * i / W.teeth);
      L.lineTo(-w / 2, h / 2);
      for (i = W.teeth - 1; i >= 0; i--) L.lineTo(-w / 2 + (i % 2 ? W.tooth : 0) + (r() - 0.5) * 2, -h / 2 + h * i / W.teeth);
      L.closePath();
    }
    layer(c, s, function (L) {
      L.translate(cx, cy); L.rotate(rot * Math.PI / 180);
      path(L); L.fillStyle = foil ? "#000" : color; L.fill();
      if (foil) { L.save(); L.setTransform(s, 0, 0, s, 0, 0); foilize(L, { x: cx - w / 2 - 20, y: cy - h, w: w + 40, h: h * 2 }, seed); L.restore(); }
      L.save(); L.clip(); L.globalAlpha = W.stripe.alpha / (foil ? 1 : alpha); L.fillStyle = W.stripe.color; L.rotate(Math.PI / 4);
      for (var x = -w; x < w; x += W.stripe.every) L.fillRect(x, -w, W.stripe.width, 2 * w);
      L.restore();
    }, null, foil ? 0.85 : alpha);
  }

  /* ================================================================
     THE THREE BOARD STYLES (structure: PLAN §5.4; look: DESIGN §8; numbers: SC.PALETTE)
     ================================================================ */
  function hatch(c, x, y, w, h, H) {
    var d = Math.hypot(w, h);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.strokeStyle = rgba(H.color, H.alpha); c.lineWidth = H.width;
    H.angles.forEach(function (a) {
      c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a * Math.PI / 180);
      for (var i = -d; i < d; i += H.every) { c.beginPath(); c.moveTo(i, -d); c.lineTo(i, d); c.stroke(); }
      c.restore();
    });
    c.restore();
  }
  function drawTrading(c, s, card) {
    var st = P.styles.trading, K = P.kinds[card.kind], t = card.t, golden = card.golden, CR = P.ink.cream, S = st.slots, pt = st.parts;
    var mis = s >= P.texture.misregistration.minScale ? P.texture.misregistration.dx : 0;
    /* backdrop: the kind's dark ink with an engraved cross-hatch (echoes the card back) */
    c.fillStyle = K.dark; c.fillRect(0, 0, 1080, 1350); hatch(c, 0, 0, 1080, 1350, st.texture.hatch); grain(c, 0, 0, 1080, 1350, st.texture.grain);
    /* the card: printed cream border, then the inked field */
    var cd = st.card, b = cd.border, f = { x: cd.x + b, y: cd.y + b, w: cd.w - 2 * b, h: cd.h - 2 * b };
    printShadow(c, s, function (x) { rr(x, cd.x, cd.y, cd.w, cd.h, cd.radius); }, CR);
    c.fillStyle = CR; rr(c, cd.x, cd.y, cd.w, cd.h, cd.radius); c.fill(); grain(c, cd.x, cd.y, cd.w, cd.h, 0.03);
    if (golden) layer(c, s, function (L) { rr(L, f.x, f.y, f.w, f.h, cd.innerRadius); L.fillStyle = "#000"; L.fill(); foilize(L, f, card.seed); });
    else { c.save(); rr(c, f.x, f.y, f.w, f.h, cd.innerRadius); c.clip(); c.fillStyle = K.ink; c.fillRect(f.x, f.y, f.w, f.h); grain(c, f.x, f.y, f.w, f.h, st.texture.inkGrain); c.restore(); }
    /* cream panel + spot-ink ribbon, 1 px off-register */
    var pn = pt.panel, ts = pt.typeStrip;
    c.fillStyle = CR; rr(c, pn.x + mis, pn.y + mis, pn.w, pn.h, pn.radius); c.fill(); grain(c, pn.x, pn.y, pn.w, pn.h, pn.grain);
    c.fillStyle = K.spot; tagPath(c, ts.x + mis, ts.y + mis, ts.w, ts.h, 3, ts.notch); c.fill();
    grain(c, ts.x, ts.y, ts.w, ts.h, st.texture.inkGrain);
    var kl = ts.keyline; c.save(); c.strokeStyle = rgba(kl.color, 0.75); c.lineWidth = kl.width;
    tagPath(c, ts.x + mis + kl.inset, ts.y + mis + kl.inset, ts.w - 2 * kl.inset, ts.h - 2 * kl.inset, 2, ts.notch - 1); c.stroke(); c.restore();
    /* photo + printed bevel */
    var win = st.window, bv = win.bevel;
    drawPhoto(c, s, card, win, "trading", function () { rr(c, win.x, win.y, win.w, win.h, win.radius); });
    c.save(); c.lineWidth = bv.outer.width; c.strokeStyle = golden ? "#fbf3dc" : CR;
    rr(c, win.x - bv.outer.offset, win.y - bv.outer.offset, win.w + 2 * bv.outer.offset, win.h + 2 * bv.outer.offset, win.radius + bv.outer.offset); c.stroke();
    c.lineWidth = bv.inner.width; c.strokeStyle = K.dark; rr(c, win.x, win.y, win.w, win.h, win.radius); c.stroke(); c.restore();
    /* series line + name */
    var series = pt.series[card.kind] + " · No. " + String(card.number).padStart(3, "0");
    text(c, s, series, Object.assign({}, S.series, golden ? { color: st.golden.seriesColor, alpha: 0.8 } : {}));
    text(c, s, t.name, Object.assign({}, S.name, { color: golden ? st.golden.nameColor : CR }));
    /* the stat: an ink-stamped roundel */
    var ss = pt.statStamp, scol = golden ? st.golden.statColor : ss.color;
    layer(c, s, function (L) {
      L.translate(ss.cx, ss.cy); L.rotate(ss.rotate * Math.PI / 180); L.strokeStyle = scol; L.fillStyle = scol;
      L.lineWidth = ss.ring.outer; L.beginPath(); L.arc(0, 0, ss.r - ss.ring.outer / 2, 0, 7); L.stroke();
      L.lineWidth = ss.ring.inner; L.beginPath(); L.arc(0, 0, ss.r - ss.ring.outer - ss.ring.gap - ss.ring.inner / 2, 0, 7); L.stroke();
      setF(L, "gothic", S.statLabel.size, S.statLabel.tracking); L.textAlign = "center";
      L.fillText(t.stat[0].toUpperCase(), S.statLabel.tracking * S.statLabel.size / 2, S.statLabel.dy);
      setF(L, "gothic", S.statValue.size, 0); L.fillText(String(t.stat[1]), 0, S.statValue.dy);
    }, function (L) { dropout(L, { x: ss.cx - ss.r, y: ss.cy - ss.r, w: ss.r * 2, h: ss.r * 2 }, ss.dropout, card.seed + 12); });
    /* type ribbon */
    var typeLine = t.title + " · Lv. " + t.age;
    if (golden) {
      var gp = st.golden.typePrefix, r = fit(c, typeLine, Object.assign({}, S.type, { w: S.type.w - 140 }));
      var pw = tw(c, gp.text, gp.font, gp.size, gp.tracking), sepw = tw(c, gp.sep, "serifItalic", r.px, 0), lw = tw(c, r.lines[0], "serifItalic", r.px, 0);
      var x0 = S.type.x + (S.type.w - pw - sepw - lw) / 2;
      setF(c, gp.font, gp.size, gp.tracking); c.textAlign = "left"; c.fillStyle = gp.color; c.fillText(gp.text, x0, S.type.baseline);
      setF(c, "serifItalic", r.px, 0); c.fillStyle = CR; c.fillText(gp.sep + r.lines[0], x0 + pw, S.type.baseline);
    } else text(c, s, typeLine, S.type);
    /* ONE move */
    var m = t.moves[0];
    text(c, s, String(m[1]), Object.assign({}, S.moveDamage, { color: K.spot }));
    text(c, s, m[0], S.moveName);
    text(c, s, m[2], S.moveText);
    var ru = pt.rule; c.fillStyle = rgba(K.ink, ru.alpha); c.fillRect(ru.x1, ru.y, ru.x2 - ru.x1, ru.width);
    /* bottom row: labels + values (2 lines max) */
    var vals = [t.weakness, t.threat, pt.retreatValue];
    pt.bottomLabels.forEach(function (lab, i) {
      text(c, s, lab, Object.assign({}, S.bottomLabel, { x: S.bottomLabel.xs[i], w: S.bottomLabel.ws[i] }));
      text(c, s, vals[i], Object.assign({}, S.bottomValue, { x: S.bottomValue.xs[i], w: S.bottomValue.ws[i] }));
    });
    var dv = pt.divider; c.fillStyle = rgba(dv.color, dv.alpha); c.fillRect(dv.x1, dv.y, dv.x2 - dv.x1, dv.width);
    if (card.to) text(c, s, card.personal, S.personal); else text(c, s, t.flavour, S.flavour);
    /* colophon on the ink */
    if (golden) colophon(c, s, st, card, P.ink.black, 1, { addrColor: st.golden.address.color, addrAlpha: st.golden.address.alpha });
    else colophon(c, s, st, card, CR, 1, { addrColor: P.address.onDark.color, addrAlpha: P.address.onDark.alpha });
    if (golden) {
      var gs = st.golden.star;
      layer(c, s, function (L) { starPath(L, gs.cx, gs.cy, gs.r, gs.inner); L.fillStyle = "#000"; L.fill(); foilize(L, { x: gs.cx - gs.r, y: gs.cy - gs.r, w: gs.r * 2, h: gs.r * 2 }, card.seed + 2); L.lineWidth = gs.strokeWidth; L.strokeStyle = gs.stroke; L.stroke(); });
    }
  }

  /* the 1080x1920 story: background from the style, the card 900x1125 centred at y 862 rotated -2, the caption */
  function renderStory(card, s, cardCanvas) {
    var st = P.styles[card.style], K = P.kinds[card.kind], cv = document.createElement("canvas");
    cv.width = Math.round(1080 * s); cv.height = Math.round(1920 * s);
    var c = cv.getContext("2d"); c.setTransform(s, 0, 0, s, 0, 0);
    var bg = st.storyBg, bgc = bg.color === "kindDark" ? K.dark : bg.color;
    c.fillStyle = bgc; c.fillRect(0, 0, 1080, 1920);
    if (bg.hatch) hatch(c, 0, 0, 1080, 1920, st.texture.hatch);
    grain(c, 0, 0, 1080, 1920, bg.grain);
    c.save(); c.translate(540, 862); c.rotate(-2 * Math.PI / 180);
    P.texture.printShadow.forEach(function (sh) { c.save(); c.shadowColor = rgba("#000000", sh.alpha * 1.6); c.shadowBlur = sh.blur * s * 1.4; c.shadowOffsetY = sh.y * s * 1.4; c.fillStyle = "#000"; c.fillRect(-440, -552, 880, 1105); c.restore(); });
    c.drawImage(cardCanvas, -450, -562, 900, 1125); c.restore();
    var cap = P.story.caption;
    setF(c, "hand", cap.size, 0); c.textAlign = "center"; c.fillStyle = rgba(bg.captionColor || cap.color, bg.captionAlpha || cap.alpha);
    c.fillText(cap.text, 540, cap.y);
    return cv;
  }

  function drawPolaroid(c, s, card) {
    var st = P.styles.polaroid, K = P.kinds[card.kind], t = card.t, golden = card.golden, r = mulberry(card.seed);
    c.fillStyle = st.paper; c.fillRect(0, 0, 1080, 1350); grain(c, 0, 0, 1080, 1350, st.texture.grain); dotGrid(c, 1080, 1350, card.seed);
    var pr = st.print, rot = (pr.rotate + (r() * 2 - 1) * pr.rotateJitter) * Math.PI / 180, pcx = pr.x + pr.w / 2, pcy = pr.y + pr.h / 2;
    c.save(); c.translate(pcx, pcy); c.rotate(rot); c.translate(-pcx, -pcy);
    printShadow(c, s, function (x) { x.beginPath(); x.rect(pr.x, pr.y, pr.w, pr.h); }, st.frame);
    c.fillStyle = st.frame; c.fillRect(pr.x, pr.y, pr.w, pr.h);
    var win = st.window;
    drawPhoto(c, s, card, win, "polaroid", function () { c.beginPath(); c.rect(win.x, win.y, win.w, win.h); });
    c.strokeStyle = rgba(win.innerShadow.color, win.innerShadow.alpha); c.lineWidth = 1; c.strokeRect(win.x + 0.5, win.y + 0.5, win.w - 1, win.h - 1);
    /* caption, rotated with the print */
    var stripTop = st.strip.y, S = st.slots, cap = t.name + " · " + t.mood + " · " + card.date;
    function caption(slot, str, extra) {
      var o = Object.assign({}, slot, { x: pr.x + slot.x, baseline: stripTop + slot.baselineInStrip });
      var res = fit(c, str, o), w = tw(c, res.lines[0], "hand", res.px, 0), extraW = extra ? extra.w(res.px) : 0;
      var x0 = o.x + (o.w - w - extraW) / 2;
      setF(c, "hand", res.px, 0); c.textAlign = "left"; c.fillStyle = rgba(o.color, o.alpha == null ? 1 : o.alpha); c.fillText(res.lines[0], x0, o.baseline);
      if (extra) extra.draw(x0 + w, o.baseline, res.px);
    }
    if (card.to) {
      caption(S.caption1, cap);
      var H = S.caption2.heart;
      caption(S.caption2, card.personal.replace(/\s*♥\s*$/, ""), {
        w: function () { return H.gap + H.size; },
        draw: function (x, base, px) {
          var hp = heartPath(c, x + H.gap + H.size / 2, base - px * 0.3, H.size);
          c.lineWidth = H.stroke / (H.size / 16); c.strokeStyle = S.caption2.color; c.lineJoin = "round"; c.stroke(hp.path); hp.done();
        }
      });
    } else caption(S.caption, cap, golden ? {
      w: function () { return st.golden.starDoodle.gap + st.golden.starDoodle.size; },
      draw: function (x, base, px) { var sd = st.golden.starDoodle; c.save(); c.strokeStyle = sd.color; c.lineWidth = sd.stroke; c.lineJoin = "round"; starPath(c, x + sd.gap + sd.size / 2, base - px * 0.3, sd.size / 2, sd.size / 4.6); c.stroke(); c.restore(); }
    } : null);
    grain(c, pr.x, pr.y, pr.w, pr.h, st.texture.frameGrain);
    c.restore();
    /* tape at the rotated top-centre */
    var tp = st.parts.tape, dx = tp.cx - pcx, dy = tp.cy - pcy;
    var tx = pcx + dx * Math.cos(rot) - dy * Math.sin(rot), ty = pcy + dx * Math.sin(rot) + dy * Math.cos(rot);
    var W = P.texture.washi;
    washi(c, s, tx, ty, rot * 180 / Math.PI + W.rotate + (r() * 2 - 1) * W.rotateJitter, K.ink, W.alpha, card.seed + 3, golden);
    /* the two notes on the journal page */
    [["note1", t.habitat], ["note2", t.catchphrase]].forEach(function (n) {
      var sl = S[n[0]];
      c.save(); c.translate(sl.x + sl.w / 2, sl.y + sl.h / 2); c.rotate(sl.rotate * Math.PI / 180); c.translate(-(sl.x + sl.w / 2), -(sl.y + sl.h / 2));
      var o = Object.assign({}, sl, { baseline: sl.y + 38 });
      text(c, s, n[1], o); c.restore();
    });
    /* a small hand-drawn arrow from note 2 toward the print */
    var ar = st.parts.arrow;
    c.save(); c.strokeStyle = ar.color; c.lineWidth = ar.stroke; c.lineCap = "round"; c.lineJoin = "round";
    var A0 = ar.from, AV = ar.via, A1 = ar.to, ang = Math.atan2(A1[1] - AV[1], A1[0] - AV[0]), hl = ar.head;
    c.beginPath(); c.moveTo(A0[0], A0[1]); c.quadraticCurveTo(AV[0], AV[1], A1[0], A1[1]); c.stroke();
    c.beginPath(); c.moveTo(A1[0] - hl * Math.cos(ang - 0.5), A1[1] - hl * Math.sin(ang - 0.5)); c.lineTo(A1[0], A1[1]);
    c.lineTo(A1[0] - hl * Math.cos(ang + 0.5), A1[1] - hl * Math.sin(ang + 0.5)); c.stroke();
    c.restore();
    colophon(c, s, st, card, st.ink, P.address.alpha);
  }

  function drawWanted(c, s, card) {
    var st = P.styles.wanted, t = card.t, golden = card.golden, S = st.slots, ink = st.ink;
    c.fillStyle = st.paper; c.fillRect(0, 0, 1080, 1350);
    stains(c, 1080, 1350, card.seed); fibres(c, 1080, 1350, st.texture.fibres, card.seed + 1);
    grain(c, 0, 0, 1080, 1350, st.texture.grain); edgeBurn(c, 1080, 1350);
    var r = mulberry(card.seed + 5);
    crease(c, 1080, 1350, "h", Math.round(1350 * (0.33 + (r() - 0.5) * 0.12)));
    crease(c, 1080, 1350, "v", Math.round(1080 * (0.33 + (r() - 0.5) * 0.12)));
    st.nails.forEach(function (n) { nail(c, n[0], n[1]); });
    /* WANTED: fit to width, capped by the box height */
    var w = S.wanted, px = w.size[0];
    while (px > w.size[1] && (tw(c, w.text, "gothic", px, w.tracking) > w.w || CAP.gothic * px > w.h - 16)) px -= 1;
    layer(c, s, function (L) {
      text(L, s, w.text, Object.assign({}, w, { size: px, color: golden ? "#000000" : ink }));
      if (golden) foilize(L, { x: w.x, y: w.y, w: w.w, h: w.h }, card.seed + 6);
    }, function (L) { dropout(L, { x: w.x, y: w.y, w: w.w, h: w.h }, w.dropout, card.seed + 7); });
    text(c, s, t.crime, S.crime);
    /* photo, printed frame */
    var win = st.window;
    drawPhoto(c, s, card, win, "wanted", function () { c.beginPath(); c.rect(win.x, win.y, win.w, win.h); });
    c.strokeStyle = win.border.color; c.lineWidth = win.border.width; c.strokeRect(win.x + 1.5, win.y + 1.5, win.w - 3, win.h - 3);
    c.lineWidth = win.rule.width; c.strokeRect(win.x - win.rule.offset - 0.5, win.y - win.rule.offset - 0.5, win.w + 2 * win.rule.offset + 1, win.h + 2 * win.rule.offset + 1);
    if (golden) {
      var rb = st.golden.ribbon, x0 = rb.cx - rb.w / 2, f = rb.fork;
      layer(c, s, function (L) {
        L.beginPath(); L.moveTo(x0, rb.y); L.lineTo(x0 + rb.w, rb.y); L.lineTo(x0 + rb.w - f, rb.y + rb.h / 2); L.lineTo(x0 + rb.w, rb.y + rb.h);
        L.lineTo(x0, rb.y + rb.h); L.lineTo(x0 + f, rb.y + rb.h / 2); L.closePath(); L.fillStyle = "#000"; L.fill();
        foilize(L, { x: x0, y: rb.y, w: rb.w, h: rb.h }, card.seed + 8);
      });
      text(c, s, rb.text, { x: x0, y: rb.y, w: rb.w, h: rb.h, font: rb.font, size: rb.size, tracking: rb.tracking, align: "center", color: rb.color });
    }
    text(c, s, t.name, S.name);
    text(c, s, t.aka, Object.assign({}, S.alias, {}), null);
    var ag = st.parts.ruleGroup, y = ag.y;
    c.fillStyle = rgba(ag.color, ag.alpha);
    ag.lines.forEach(function (lw) { c.fillRect(ag.x1, y, ag.x2 - ag.x1, lw); y += lw + ag.gap; });
    /* last seen + reward: label and value centred as one group */
    function pair(lab, valSlot, val) {
      var lw = tw(c, lab.text.toUpperCase(), "gothic", lab.size, lab.tracking);
      var vr = fit(c, val, Object.assign({}, valSlot, { w: valSlot.w - lw - lab.gap })), vw = tw(c, vr.lines[0], "serif", vr.px, 0);
      var x0 = 540 - (lw + lab.gap + vw) / 2;
      setF(c, "gothic", lab.size, lab.tracking); c.textAlign = "left"; c.fillStyle = lab.color; c.fillText(lab.text.toUpperCase(), x0, valSlot.baseline);
      setF(c, "serif", vr.px, 0); c.fillStyle = valSlot.color; c.fillText(vr.lines[0], x0 + lw + lab.gap, valSlot.baseline);
    }
    pair(S.lastSeenLabel, S.lastSeen, t.lastSeen);
    pair(S.rewardLabel, S.reward, t.reward);
    colophon(c, s, st, card, ink, P.address.alpha);
    if (card.to) {
      var ps = st.personal.stamp;
      stamp(c, s, ps.cx, ps.cy, ps.rotate, ps.color, ps.alpha, [
        { text: "If found, return to " + card.to, font: "gothic", size: ps.line1.size, tracking: ps.line1.tracking, upper: true },
        { text: card.personal, font: "serifItalic", size: ps.line2.size }
      ], card.seed + 9, ps.maxW);
    }
  }
  /* override for the alias prefix */
  var _text = text;
  text = function (c, s, str, o) { if (o && o.prefix) { str = o.prefix + str; } return _text(c, s, str, o); };

  var DRAW = { trading: drawTrading, polaroid: drawPolaroid, wanted: drawWanted };
  function render(card, s) {
    var cv = document.createElement("canvas"); cv.width = Math.round(1080 * s); cv.height = Math.round(1350 * s);
    var c = cv.getContext("2d"); c.setTransform(s, 0, 0, s, 0, 0);
    DRAW[card.style](c, s, card);
    return cv;
  }

  /* ================================================================
     the board's cards (real photos from assets/sample and tests/real)
     ================================================================ */
  var CARDS = {
    larry: { style: "trading", kind: "cat", rarity: "common", number: 1, seed: 11, img: "../assets/sample/cat.jpg", crop: { cx: 0.47, cy: 0.35, zoom: 1.05 },
      t: { name: "Larry", title: "Feline, menace class", age: 4, stat: ["Chaos", 90],
        moves: [["Stare", 30, "Looks at you until you leave."], ["3 am Scream", 90, "Wakes the whole street. No reason."]],
        weakness: "pspsps", threat: "high, to anything on a table", flavour: "Owns the street. Pays no rent." } },
    mochi: { style: "polaroid", kind: "dog", rarity: "common", number: 2, seed: 23, img: "../assets/sample/dog-sleeping.jpg", crop: { cx: 0.54, cy: 0.655, zoom: 2.0 },
      date: "9 Oct", to: "Priya", personal: "Priya, found your twin ♥",
      t: { name: "Mochi", mood: "off duty", habitat: "the exact middle of a cool floor", catchphrase: "\"I'll walk you home.\"" } },
    pickle: { style: "polaroid", kind: "pigeon", rarity: "common", number: 3, seed: 31, img: "../tests/real/06-pigeon-balcony-taxila.jpg", crop: { cx: 0.45, cy: 0.71, zoom: 3.0 },
      date: "9 Oct",
      t: { name: "Sir Pickle", mood: "above it all", habitat: "every balcony railing on the block", catchphrase: "\"Is that bread?\"" } },
    bimla: { style: "wanted", kind: "cow", rarity: "uncommon", number: 4, seed: 47, img: "../tests/real/08-cow-street-madurai.jpg", crop: { cx: 0.66, cy: 0.57, zoom: 1.35 },
      t: { name: "Auntie Bimla", crime: "for blocking traffic, serenely", aka: "The Mayor of Lane 4", lastSeen: "the middle of the road", reward: "1 banana, no questions asked" } },
    kevin: { style: "trading", kind: "cat", rarity: "common", golden: true, number: 5, seed: 53, img: "../tests/real/03-cat-tabby-west-bengal.jpg", crop: { cx: 0.5, cy: 0.37, zoom: 1.45 },
      t: { name: "Kevin", title: "Senior Bonnet Inspector", age: 2, stat: ["Sass", 80],
        moves: [["Slow Blink", 20, "Heals your heart by 40."], ["The Look", 60, "You apologise. You don’t know why."]],
        weakness: "a cardboard box", threat: "low, until you move", flavour: "Answers to five names. Responds to none." } },
    coo: { style: "trading", kind: "pigeon", rarity: "common", number: 14, seed: 71, img: "../tests/real/06-pigeon-balcony-taxila.jpg", crop: { cx: 0.44, cy: 0.72, zoom: 2.6 },
      to: "Priya", personal: "Gifted to Priya. Separated at birth.",
      t: { name: "Dr. Coo", title: "Columba, balcony division", age: 7, stat: ["Sass", 70],
        moves: [["Bread Detector", 60, "Hears a packet open from 3 floors up."]],
        weakness: "anything that crinkles", threat: "will walk at you, slowly, forever", flavour: "" } },
    bruno: { style: "wanted", kind: "dog", rarity: "common", number: 6, seed: 61, img: "../assets/sample/dog.jpg", crop: { cx: 0.47, cy: 0.6, zoom: 1.05 },
      to: "Priya", personal: "Found your twin.",
      t: { name: "Bruno", crime: "for excessive tail wagging", aka: "Head of Security", lastSeen: "outside the chai stall", reward: "2 head scratches" } }
  };

  function loadImg(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; }); }
  function put(el, src) {
    var w = el.clientWidth || +el.getAttribute("width"), h = el.clientHeight || +el.getAttribute("height");
    var cv = document.createElement("canvas"), k = 2; cv.width = Math.round(w * k); cv.height = Math.round(h * k);
    var x = cv.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, cv.width, cv.height);
    el.appendChild(cv);
  }

  async function main() {
    fillIcons();
    var gallery = document.getElementById("icon-gallery");
    if (gallery) gallery.innerHTML = ICON_ORDER.map(function (n) { return '<figure><span>' + iconSVG(n, 24) + "</span><figcaption>" + n + "</figcaption></figure>"; }).join("");
    await Promise.all([
      document.fonts.load(F("serif", 40)), document.fonts.load(F("serifItalic", 40)),
      document.fonts.load(F("gothic", 40)), document.fonts.load(F("hand", 40))
    ]);
    var keys = Object.keys(CARDS);
    await Promise.all(keys.map(function (k) { return loadImg(CARDS[k].img).then(function (i) { CARDS[k].img = i; }); }));
    var full = {};
    keys.forEach(function (k) { full[k] = render(CARDS[k], 0.75); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-card]"), function (el) { put(el, full[el.getAttribute("data-card")]); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-story]"), function (el) {
      var k = el.getAttribute("data-story"); put(el, renderStory(CARDS[k], 0.75, render(CARDS[k], 1)));
    });
    /* the kind screen's small print: just the photo, auto-crop */
    Array.prototype.forEach.call(document.querySelectorAll("[data-photo]"), function (el) {
      var cd = CARDS[el.getAttribute("data-photo")], w = el.clientWidth * 2, h = el.clientHeight * 2;
      var pc = photoCanvas(cd.img, { cx: 0.5, cy: 0.38, zoom: 1.15 }, w, h, { contrast: 1, saturation: 1, warmth: 0, lift: 0 }, "#000000", 1);
      el.appendChild(pc);
    });
    document.documentElement.classList.add("ready");
  }
  main().catch(function (e) { document.body.insertAdjacentHTML("afterbegin", "<pre style='color:#a33a2b;white-space:pre-wrap'>" + (e && e.stack || e) + "</pre>"); });
})();
