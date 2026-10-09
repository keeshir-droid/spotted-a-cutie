// Code-drawn art for the cards: paper grain, fibres, stains, nails, foil, stamps, washi tape, the accession tag,
// rarity marks and small shapes. Every colour, size and strength is read from SC.PALETTE (palette.js).
// Nothing here touches document/window at load time; canvases are only created when a function is called.
//
// Conventions
//   c        a 2D context already scaled so that 1 unit = 1 px of the 1080x1350 card
//   s        the scale of that context (card px -> device px), needed where a layer or a shadow needs real pixels
//   bounds   { x, y, w, h } in card px: the offscreen layer for foil, dropout and stamps covers only that box
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});
  const U = SC.util;

  function rgba(hexColor, a) {
    const c = U.hexToRgb(hexColor);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + (a == null ? 1 : a) + ")";
  }
  // "kind" / "kindDark" / "kindSpot" are the colour words used in palette.js
  function col(spec, kindId) {
    const K = SC.PALETTE.kinds[kindId] || SC.PALETTE.kinds.mystery;
    if (spec === "kind") return K.ink;
    if (spec === "kindDark") return K.dark;
    if (spec === "kindSpot") return K.spot;
    return spec;
  }

  // ---------- paths ----------
  function rr(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  // the accession tag: a rounded rectangle with a semicircle cut into the middle of each short end
  function tagPath(c, x, y, w, h, r, n) {
    const my = y + h / 2;
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, my - n); c.arc(x + w, my, n, -Math.PI / 2, Math.PI / 2, true);
    c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r); c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, my + n); c.arc(x, my, n, Math.PI / 2, -Math.PI / 2, true);
    c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
  }
  function starPath(c, cx, cy, ro, ri, pts) {
    pts = pts || 5; c.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 ? ri : ro, a = -Math.PI / 2 + i * Math.PI / pts;
      c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    c.closePath();
  }
  function scallopPath(c, cx, cy, R, n, depth) {
    c.beginPath();
    const steps = n * 12;
    for (let i = 0; i <= steps; i++) {
      const a = i / steps * Math.PI * 2, r = R - depth * (0.5 + 0.5 * Math.cos(a * n));
      c[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    c.closePath();
  }
  // a ribbon with a V cut into both ends
  function ribbonPath(c, x, y, w, h, fork) {
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w - fork, y + h / 2); c.lineTo(x + w, y + h);
    c.lineTo(x, y + h); c.lineTo(x + fork, y + h / 2); c.closePath();
  }

  // ---------- small shapes (the glyphs that no font has) ----------
  const HEART_D = "M12 19.8c-5-3.2-8-6.4-8-10.2 0-2.4 1.7-4.1 3.8-4.1 1.8 0 3.2 1 4.2 2.7 1-1.8 2.5-2.8 4.4-2.7 2.1.1 3.7 1.9 3.6 4.3-.2 3.6-3.1 6.9-8 10Z";
  const PIN_D = "M12 21c-4.3-4.2-6.5-7.9-6.5-11.2a6.5 6.5 0 0 1 13 0c0 3.3-2.2 7-6.5 11.2Z";
  let heartP = null, pinP = null;
  // the icon heart, `size` px wide, centred on (cx, cy). o.stroke = line width in px (outline); otherwise filled
  function heart(c, cx, cy, size, o) {
    o = o || {};
    if (!heartP) heartP = new Path2D(HEART_D);
    const k = size / 16;
    c.save();
    c.translate(cx - 12 * k, cy - 12.65 * k); c.scale(k, k);
    if (o.stroke) { c.lineWidth = o.stroke / k; c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = o.color; c.stroke(heartP); }
    else { c.fillStyle = o.color; c.fill(heartP); }
    c.restore();
  }
  // a map pin, size px tall, left edge at x, top at y
  function pin(c, x, y, size, stroke, color) {
    if (!pinP) pinP = new Path2D(PIN_D);
    const k = size / 18;      // the pin spans about 18 units
    c.save();
    c.translate(x - 5.5 * k, y - 3.3 * k); c.scale(k, k);
    c.lineWidth = stroke / k; c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = color; c.fillStyle = color;
    c.stroke(pinP); c.beginPath(); c.arc(12, 9.8, 1.6, 0, 7); c.fill();
    c.restore();
  }
  function cross(c, cx, cy, size, width, color) {
    c.save(); c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round";
    const h = size / 2;
    c.beginPath(); c.moveTo(cx - h, cy - h); c.lineTo(cx + h, cy + h); c.moveTo(cx + h, cy - h); c.lineTo(cx - h, cy + h); c.stroke();
    c.restore();
  }
  // one glyph by character: the text engine calls this for ♥ ★ ◆ ✕ ●
  function glyph(c, ch, cx, cy, size, o) {
    o = o || {};
    const color = o.color || "#000000";
    c.save();
    if (ch === "♥") heart(c, cx, cy, size, { color: color, stroke: o.stroke });
    else if (ch === "★") { starPath(c, cx, cy, size * 0.55, size * 0.23); if (o.stroke) { c.lineWidth = o.stroke; c.lineJoin = "round"; c.strokeStyle = color; c.stroke(); } else { c.fillStyle = color; c.fill(); } }
    else if (ch === "◆") { const h = size * 0.5; c.beginPath(); c.moveTo(cx, cy - h); c.lineTo(cx + h, cy); c.lineTo(cx, cy + h); c.lineTo(cx - h, cy); c.closePath(); c.fillStyle = color; c.fill(); }
    else if (ch === "✕") cross(c, cx, cy, size * 0.8, Math.max(2, size * 0.13), color);
    else { c.beginPath(); c.arc(cx, cy, size * 0.4, 0, 7); c.fillStyle = color; c.fill(); }
    c.restore();
  }

  // ---------- layers (offscreen, for foil fills, dropout and stamps) ----------
  // draw(ctx) and post(ctx) work in card px; the result is composited into c at `alpha`.
  function layer(c, s, b, draw, post, alpha) {
    const w = Math.max(1, Math.ceil(b.w * s)), h = Math.max(1, Math.ceil(b.h * s));
    const o = U.createCanvas(w, h), x = o.getContext("2d");
    x.setTransform(s, 0, 0, s, -b.x * s, -b.y * s);
    draw(x);
    if (post) post(x);
    c.save(); c.globalAlpha *= alpha == null ? 1 : alpha;
    c.drawImage(o, b.x, b.y, w / s, h / s);
    c.restore();
  }

  // ---------- foil ----------
  // A style may carry its own foil ramp (styles.<id>.golden.foil). card.js sets it while that style draws.
  let curFoil = null;
  function useFoil(f) { curFoil = f || null; }
  function foilSpec() { return curFoil || SC.PALETTE.foil; }
  function foilPaint(x, b, seed) {
    const f = foilSpec(), a = f.angle * Math.PI / 180, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const L = (Math.abs(b.w * Math.cos(a)) + Math.abs(b.h * Math.sin(a))) / 2;
    const g = x.createLinearGradient(cx - Math.cos(a) * L, cy - Math.sin(a) * L, cx + Math.cos(a) * L, cy + Math.sin(a) * L);
    f.stops.forEach(function (st) { g.addColorStop(st[0], st[1]); });
    x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    const r = U.mulberry32((seed || 3) >>> 0), d = Math.hypot(b.w, b.h);
    x.save(); x.globalAlpha = f.bands.alpha; x.fillStyle = f.bands.color;
    for (let i = 0; i < f.bands.count; i++) {
      const px = b.x + b.w * (0.12 + 0.76 * r()), py = b.y + b.h * (0.2 + 0.6 * r());
      const bw = d * (f.bands.widthMin + (f.bands.widthMax - f.bands.widthMin) * r());
      x.save(); x.translate(px, py); x.rotate(f.bands.angle * Math.PI / 180); x.fillRect(-d, -bw / 2, 2 * d, bw); x.restore();
    }
    x.restore();
    x.save(); x.globalAlpha = f.brushed.alpha; x.fillStyle = f.brushed.color;
    for (let y = b.y; y < b.y + b.h; y += f.brushed.every) x.fillRect(b.x, y, b.w, f.brushed.width);
    x.restore();
  }
  // paint foil only where the layer already has pixels
  function foilize(x, b, seed) { x.save(); x.globalCompositeOperation = "source-atop"; foilPaint(x, b, seed); x.restore(); }
  // a foil-filled shape: pathFn(ctx) builds the path (card px)
  function foilShape(c, s, b, pathFn, seed, strokeSpec) {
    layer(c, s, b, function (L) {
      pathFn(L); L.fillStyle = "#000"; L.fill();
      foilize(L, b, seed);
      if (strokeSpec) { pathFn(L); L.lineWidth = strokeSpec.width; L.strokeStyle = strokeSpec.color; L.stroke(); }
    });
  }
  // foil text: an embossed shadow copy under the clip-filled text. drawFn(ctx, colour) draws the text in that colour.
  function foilText(c, s, b, drawFn, seed, post) {
    const E = foilSpec().emboss;
    c.save(); c.translate(E.dx, E.dy); c.globalAlpha *= E.alpha; drawFn(c, E.color); c.restore();
    layer(c, s, b, function (L) { drawFn(L, "#000000"); foilize(L, b, seed); }, post);
  }
  // erase seeded speckles until `coverage` of the box is gone: the rubber-stamp look
  function dropout(x, b, coverage, seed) {
    const D = SC.PALETTE.texture.dropout, r = U.mulberry32((seed || 9) >>> 0);
    const avg = Math.PI * Math.pow((D.rMin + D.rMax) / 2, 2);
    const n = Math.round(coverage * b.w * b.h / avg);
    x.save(); x.globalCompositeOperation = "destination-out"; x.fillStyle = "#000"; x.beginPath();
    for (let i = 0; i < n; i++) {
      const rad = D.rMin + (D.rMax - D.rMin) * r(), px = b.x + r() * b.w, py = b.y + r() * b.h;
      x.moveTo(px + rad, py); x.arc(px, py, rad, 0, 6.2832);
    }
    x.fill(); x.restore();
  }

  // ---------- textures ----------
  let grainTile = null;
  function getGrainTile() {
    if (!grainTile) {
      const T = SC.PALETTE.texture.grain.tile;
      grainTile = U.createCanvas(T, T);
      const g = grainTile.getContext("2d"), id = g.createImageData(T, T), r = U.mulberry32(7);
      for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      g.putImageData(id, 0, 0);
    }
    return grainTile;
  }
  // paper grain: noise tile in device pixels, overlay blend, clipped to the box
  function grain(c, x, y, w, h, a) {
    if (!a) return;
    c.save();
    c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.globalCompositeOperation = SC.PALETTE.texture.grain.op; c.globalAlpha = a;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = c.createPattern(getGrainTile(), "repeat");
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    c.restore();
  }
  function fibres(c, w, h, density, seed, ink) {
    const F = SC.PALETTE.texture.fibres, r = U.mulberry32(seed >>> 0), n = Math.round(density * w * h / 10000);
    c.save(); c.strokeStyle = rgba(ink || "#2a2118", F.alpha); c.lineWidth = F.width; c.lineCap = "round"; c.beginPath();
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h, L = F.lenMin + (F.lenMax - F.lenMin) * r(), a = r() * Math.PI * 2, bend = (r() - 0.5) * 6;
      c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * L / 2 + bend, y + Math.sin(a) * L / 2 - bend, x + Math.cos(a) * L, y + Math.sin(a) * L);
    }
    c.stroke(); c.restore();
  }
  function dotGrid(c, w, h, seed) {
    const D = SC.PALETTE.texture.dotGrid, r = U.mulberry32(seed >>> 0), ox = r() * D.every, oy = r() * D.every;
    c.save(); c.fillStyle = rgba(D.color, D.alpha); c.beginPath();
    for (let y = oy; y < h; y += D.every) for (let x = ox; x < w; x += D.every) { c.moveTo(x + D.r, y); c.arc(x, y, D.r, 0, 6.2832); }
    c.fill(); c.restore();
  }
  function stains(c, w, h, seed, count) {
    const S = SC.PALETTE.texture.stains, r = U.mulberry32(seed >>> 0);
    const n = count || (S.count[0] + Math.floor(r() * (S.count[1] - S.count[0] + 1)));
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h, rad = S.r[0] + (S.r[1] - S.r[0]) * r(), a = S.alpha[0] + (S.alpha[1] - S.alpha[0]) * r();
      const g = c.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, rgba(S.color, a)); g.addColorStop(0.7, rgba(S.color, a * 0.5)); g.addColorStop(1, rgba(S.color, 0));
      c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // one coffee ring, broken in two places
    const cx = 160 + r() * (w - 320), cy = h * 0.72 + r() * h * 0.15, rad = S.ring.r[0] + (S.ring.r[1] - S.ring.r[0]) * r(), st = r() * 6;
    c.save(); c.strokeStyle = rgba(S.color, S.ring.alpha); c.lineWidth = S.ring.width;
    c.beginPath(); c.arc(cx, cy, rad, st, st + 2.6); c.stroke();
    c.beginPath(); c.arc(cx + 2, cy - 1, rad - 1, st + 2.9, st + 5.9); c.stroke();
    c.restore();
  }
  function edgeBurn(c, w, h) {
    const E = SC.PALETTE.texture.edgeBurn, d = E.depth;
    [[0, 0, 0, d, 0, 0, w, d], [0, h, 0, h - d, 0, h - d, w, d], [0, 0, d, 0, 0, 0, d, h], [w, 0, w - d, 0, w - d, 0, d, h]].forEach(function (q) {
      const g = c.createLinearGradient(q[0], q[1], q[2], q[3]);
      g.addColorStop(0, rgba(E.color, E.alpha)); g.addColorStop(1, rgba(E.color, 0));
      c.fillStyle = g; c.fillRect(q[4], q[5], q[6], q[7]);
    });
  }
  function crease(c, w, h, dir, at) {
    const C = SC.PALETTE.texture.crease;
    c.save();
    c.fillStyle = rgba(C.light.color, C.light.alpha);
    if (dir === "h") c.fillRect(0, at, w, 1); else c.fillRect(at, 0, 1, h);
    c.fillStyle = rgba(C.dark.color, C.dark.alpha);
    if (dir === "h") c.fillRect(0, at + 1, w, 1); else c.fillRect(at + 1, 0, 1, h);
    c.restore();
  }
  function nail(c, x, y) {
    const N = SC.PALETTE.texture.nail;
    c.save();
    c.fillStyle = rgba(N.shadow.color, N.shadow.alpha);
    c.beginPath(); c.ellipse(x + N.shadow.dx, y + N.shadow.dy, N.shadow.w, N.shadow.h, 0.5, 0, 7); c.fill();
    c.fillStyle = N.rim; c.beginPath(); c.arc(x, y, N.r, 0, 7); c.fill();
    c.fillStyle = N.top; c.beginPath(); c.arc(x, y, N.topR, 0, 7); c.fill();
    c.fillStyle = N.hi; c.beginPath(); c.arc(x + N.hiAt[0], y + N.hiAt[1], N.hiR, 0, 7); c.fill();
    c.restore();
  }
  // the engraved cross-hatch (Trading backdrop and its story background)
  function hatch(c, x, y, w, h, H) {
    const d = Math.hypot(w, h);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.strokeStyle = rgba(H.color, H.alpha); c.lineWidth = H.width;
    H.angles.forEach(function (a) {
      c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a * Math.PI / 180); c.beginPath();
      for (let i = -d; i < d; i += H.every) { c.moveTo(i, -d); c.lineTo(i, d); }
      c.stroke(); c.restore();
    });
    c.restore();
  }
  function printShadow(c, s, pathFn, fill) {
    SC.PALETTE.texture.printShadow.forEach(function (sh) {
      c.save(); c.shadowColor = rgba(sh.color, sh.alpha); c.shadowBlur = sh.blur * s; c.shadowOffsetY = sh.y * s;
      pathFn(c); c.fillStyle = fill; c.fill(); c.restore();
    });
  }

  // ---------- rarity marks, the accession tag, the colophon ----------
  // a mark centred on (cx, cy). Golden = a foil star inside a foil ring.
  function rarityMark(c, s, cx, cy, rarity, color, golden, seed) {
    const R = SC.PALETTE.rarity[golden ? "golden" : rarity] || SC.PALETTE.rarity.common;
    function shape(x) {
      x.beginPath();
      if (R.shape === "circle") x.arc(cx, cy, R.d / 2, 0, 7);
      else if (R.shape === "diamond") { x.moveTo(cx, cy - R.h / 2); x.lineTo(cx + R.w / 2, cy); x.lineTo(cx, cy + R.h / 2); x.lineTo(cx - R.w / 2, cy); x.closePath(); }
      else starPath(x, cx, cy, R.outer, R.inner, R.points);
    }
    if (golden) {
      layer(c, s, { x: cx - 18, y: cy - 18, w: 36, h: 36 }, function (x) {
        shape(x); x.fillStyle = "#000"; x.fill();
        x.beginPath(); x.arc(cx, cy, R.ring.r, 0, 7); x.lineWidth = R.ring.width; x.strokeStyle = "#000"; x.stroke();
        foilize(x, { x: cx - 18, y: cy - 18, w: 36, h: 36 }, seed);
      });
    } else { shape(c); c.fillStyle = color; c.fill(); }
  }
  // o = { color, rarity, number, golden, seed }
  function tag(c, s, x, y, o) {
    const P = SC.PALETTE, T = P.tag, golden = o.golden, T_ = SC.text;
    const ink = golden ? (curFoil ? curFoil.shadow : T.golden.stroke) : o.color, txt = golden ? T.golden.text : o.color;
    const b = { x: x - 3, y: y - 3, w: T.w + 6, h: T.h + 6 };
    if (golden) layer(c, s, b, function (L) { tagPath(L, x, y, T.w, T.h, T.radius, T.notch.r); L.fillStyle = "#000"; L.fill(); foilize(L, b, o.seed); });
    layer(c, s, b, function (L) {
      const i = T.stroke / 2;
      tagPath(L, x + i, y + i, T.w - 2 * i, T.h - 2 * i, T.radius, T.notch.r); L.lineWidth = T.stroke; L.strokeStyle = ink; L.stroke();
      if (!golden) rarityMark(L, s, x + T.mark.cx, y + T.h / 2, o.rarity, txt, false, o.seed);
      else { const R = P.rarity.golden; starPath(L, x + T.mark.cx, y + T.h / 2, R.outer, R.inner); L.fillStyle = txt; L.fill(); }
      const N = T.number, num = N.prefix + String(o.number).padStart(N.pad, "0"), px = N.size;
      let cx = x + N.x;
      const base = y + T.h / 2 + T_.cap(N.font) * px / 2 + N.nudgeY;
      L.font = T_.fontString(N.font, px); L.textAlign = "center"; L.fillStyle = txt;
      for (let k = 0; k < num.length; k++) {
        const cell = (num.charAt(k) === "#" ? N.hashCell : N.cell) * px;
        L.fillText(num.charAt(k), cx + cell / 2, base); cx += cell + N.tracking * px;
      }
    }, function (L) { dropout(L, b, T.dropout, (o.seed || 0) + 1); });
  }
  function address(c, tagX, tagY, align, ax, color, alpha) {
    const A = SC.PALETTE.address, T = SC.PALETTE.tag, W = 760;
    SC.text.draw(c, A.text, { x: align === "right" ? ax - W : ax, y: tagY, w: W, h: T.h, font: A.font, size: A.size, tracking: A.tracking, align: align, color: color, alpha: alpha });
  }
  // the colophon: tag + address. st = the palette style; env = { rarity, number, golden, seed, kind }
  function colophon(c, s, st, env, color, alpha, opts) {
    const T = SC.PALETTE.tag, A = SC.PALETTE.address, tg = st.colophon.tag, ad = st.colophon.address;
    opts = opts || {};
    tag(c, s, tg.x, tg.y, { color: opts.tagColor || color, rarity: env.rarity, number: env.number, golden: env.golden, seed: env.seed + 40 });
    const ax = ad.align === "right" ? (ad.x != null ? ad.x : tg.x - A.gap) : tg.x + T.w + A.gap;
    address(c, tg.x, tg.y, ad.align, ax, opts.addrColor || color, opts.addrAlpha || alpha || A.alpha);
  }

  // ---------- stamp and tape ----------
  // lines = [{ text, font, size:[max,min]|n, tracking, upper, lines? }]; an entry may wrap to `lines` lines
  // (never ellipsised unless it can't fit even then). Returns { w, h } of the stamp.
  function stamp(c, s, cx, cy, rot, color, alpha, lines, seed, maxW) {
    const S = SC.PALETTE.texture.stamp, inner = S.outer + S.gap + S.inner, T = SC.text;
    const slotW = (maxW || 600) - 2 * (S.padX + inner);
    const rows = [];   // every drawn line: { text, font, px, tracking, w, h, gap }
    lines.forEach(function (l) {
      const o = { font: l.font, size: l.size, tracking: l.tracking || 0, upper: l.upper, w: slotW, lines: l.lines || 1, lineHeight: 1.0 };
      const r = T.fit(c, l.text, o);
      r.lines.forEach(function (ln, k) {
        rows.push({ text: ln, font: l.font, px: r.px, tracking: o.tracking, w: T.width(c, ln, l.font, r.px, o.tracking),
          h: r.px * (l.font === "gothic" ? 0.78 : 0.95), gap: k === r.lines.length - 1 ? 10 : 2 });
      });
    });
    const w = Math.max.apply(null, rows.map(function (f) { return f.w; })) + 2 * (S.padX + inner);
    const h = rows.reduce(function (acc, f) { return acc + f.h + f.gap; }, -10) + 2 * (S.padY + inner);
    const R = Math.hypot(w, h) / 2 + 12, b = { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R };
    layer(c, s, b, function (L) {
      L.translate(cx, cy); L.rotate(rot * Math.PI / 180);
      L.strokeStyle = color; L.fillStyle = color;
      L.lineWidth = S.outer; rr(L, -w / 2 + S.outer / 2, -h / 2 + S.outer / 2, w - S.outer, h - S.outer, S.radius); L.stroke();
      const ii = S.outer + S.gap + S.inner / 2;
      L.lineWidth = S.inner; rr(L, -w / 2 + ii, -h / 2 + ii, w - 2 * ii, h - 2 * ii, Math.max(2, S.radius - 3)); L.stroke();
      let y = -h / 2 + S.padY + inner;
      rows.forEach(function (f) {
        y += f.h;
        T.draw(L, f.text, { x: -w / 2, y: 0, w: w, h: 0, font: f.font, size: f.px, tracking: f.tracking, align: "center", color: color, baseline: y - (f.font === "gothic" ? 0 : f.h * 0.12) });
        y += f.gap;
      });
    }, function (L) { dropout(L, b, S.dropout, seed); }, alpha);
    return { w: w, h: h };
  }
  // washi tape centred on (cx, cy), rotated rot degrees
  function washi(c, s, cx, cy, rot, color, alpha, seed, foil) {
    const W = SC.PALETTE.texture.washi, w = W.w, h = W.h, r = U.mulberry32(seed >>> 0);
    const jit = [];
    for (let i = 0; i <= W.teeth * 2 + 2; i++) jit.push((r() - 0.5) * 2);
    function path(L) {
      L.beginPath(); L.moveTo(-w / 2, -h / 2); L.lineTo(w / 2, -h / 2);
      for (let i = 1; i <= W.teeth; i++) L.lineTo(w / 2 + (i % 2 ? -W.tooth : 0) + jit[i], -h / 2 + h * i / W.teeth);
      L.lineTo(-w / 2, h / 2);
      for (let i = W.teeth - 1; i >= 0; i--) L.lineTo(-w / 2 + (i % 2 ? W.tooth : 0) + jit[W.teeth + 1 + i], -h / 2 + h * i / W.teeth);
      L.closePath();
    }
    const R = Math.hypot(w, h) / 2 + 6, b = { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R };
    layer(c, s, b, function (L) {
      L.save(); L.translate(cx, cy); L.rotate(rot * Math.PI / 180);
      path(L); L.fillStyle = foil ? "#000" : color; L.fill(); L.restore();
      if (foil) foilize(L, b, seed);
      L.save(); L.translate(cx, cy); L.rotate(rot * Math.PI / 180); path(L); L.clip();
      L.globalAlpha = W.stripe.alpha / (foil ? 1 : alpha); L.fillStyle = W.stripe.color; L.rotate(Math.PI / 4);
      for (let x = -w; x < w; x += W.stripe.every) L.fillRect(x, -w, W.stripe.width, 2 * w);
      L.restore();
    }, null, foil ? 0.85 : alpha);
  }

  SC.art = {
    rgba: rgba, col: col, rr: rr, tagPath: tagPath, starPath: starPath, scallopPath: scallopPath, ribbonPath: ribbonPath,
    heart: heart, pin: pin, cross: cross, glyph: glyph,
    useFoil: useFoil, foilSpec: foilSpec, layer: layer, foilPaint: foilPaint, foilize: foilize, foilShape: foilShape, foilText: foilText, dropout: dropout,
    grain: grain, fibres: fibres, dotGrid: dotGrid, stains: stains, edgeBurn: edgeBurn, crease: crease, nail: nail,
    hatch: hatch, printShadow: printShadow,
    rarityMark: rarityMark, tag: tag, address: address, colophon: colophon, stamp: stamp, washi: washi
  };
})();
