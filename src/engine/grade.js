// Photo grades (pixel maths) and the halftone, for the 6 styles. Every number comes from SC.PALETTE.grades.
//
//   SC.grade.window(photo, crop, w, h, styleId, kindId, seed, scale) -> canvas (w x h px)
//       the crop drawn into a w x h canvas, then graded (contrast, saturation, warmth, lift, split, ramp,
//       gamma, grain, vignette, halftone, in that order)
//   SC.grade.apply(canvas, spec, opts)      grade a canvas in place (no halftone)
//   SC.grade.halftone(canvas, opts)         turn a canvas into dots on paper, in place
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  function hex(h) { const c = SC.util.hexToRgb(h); return [c.r / 255, c.g / 255, c.b / 255]; }
  function rgba(h, a) { const c = SC.util.hexToRgb(h); return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a + ")"; }

  function apply(canvas, g, o) {
    o = o || {};
    const P = SC.PALETTE, w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    const rng = SC.util.mulberry32(o.seed || 5);
    const kindInk = o.kindInk || "#000000";
    const sp = g.split || null;
    const shc = sp && sp.shadows ? hex(sp.shadows === "kind" ? kindInk : sp.shadows) : null;
    const hic = sp && sp.highlights ? hex(sp.highlights) : null;
    const shA = sp ? sp.shadowAmount || 0 : 0, hiA = sp ? sp.highlightAmount || 0 : 0;
    const ramp = g.ramp ? g.ramp.map(function (st) { return [st[0], hex(st[1])]; }) : null;
    const contrast = g.contrast == null ? 1 : g.contrast, sat = g.saturation == null ? 1 : g.saturation;
    const warm = (g.warmth || 0) / 255, lift = g.lift || 0, gamma = g.gamma || 1, grain = g.grain || 0;
    for (let i = 0; i < d.length; i += 4) {
      let R = d[i] / 255, G = d[i + 1] / 255, B = d[i + 2] / 255, L, k;
      R = (R - 0.5) * contrast + 0.5; G = (G - 0.5) * contrast + 0.5; B = (B - 0.5) * contrast + 0.5;
      L = 0.299 * R + 0.587 * G + 0.114 * B;
      R = L + (R - L) * sat; G = L + (G - L) * sat; B = L + (B - L) * sat;
      if (warm) { R += warm; B -= warm; }
      if (lift) { R = lift + (1 - lift) * R; G = lift + (1 - lift) * G; B = lift + (1 - lift) * B; }
      L = 0.299 * R + 0.587 * G + 0.114 * B;
      L = L < 0 ? 0 : (L > 1 ? 1 : L);
      if (shc) { k = shA * (1 - L) * (1 - L); R += (shc[0] - R) * k; G += (shc[1] - G) * k; B += (shc[2] - B) * k; }
      if (hic) { k = hiA * L * L; R += (hic[0] - R) * k; G += (hic[1] - G) * k; B += (hic[2] - B) * k; }
      if (ramp) {
        let j = 1;
        for (; j < ramp.length - 1; j++) if (L <= ramp[j][0]) break;
        const a0 = ramp[j - 1], a1 = ramp[j];
        let t = (L - a0[0]) / (a1[0] - a0[0]); t = t < 0 ? 0 : (t > 1 ? 1 : t);
        R = a0[1][0] + (a1[1][0] - a0[1][0]) * t; G = a0[1][1] + (a1[1][1] - a0[1][1]) * t; B = a0[1][2] + (a1[1][2] - a0[1][2]) * t;
      } else if (sat === 0) { R = G = B = L; }
      if (gamma !== 1) {
        R = Math.pow(R < 0 ? 0 : R, gamma); G = Math.pow(G < 0 ? 0 : G, gamma); B = Math.pow(B < 0 ? 0 : B, gamma);
      }
      if (grain) { k = (rng() - 0.5) * grain * 2; R += k; G += k; B += k; }
      d[i] = R * 255; d[i + 1] = G * 255; d[i + 2] = B * 255;
    }
    ctx.putImageData(id, 0, 0);
    if (g.vignette) {
      const hd = Math.hypot(w, h) / 2;
      const vg = ctx.createRadialGradient(w / 2, h / 2, hd * P.texture.vignette.from, w / 2, h / 2, hd);
      vg.addColorStop(0, rgba(g.vignetteColor || "#000000", 0));
      vg.addColorStop(1, rgba(g.vignetteColor || "#000000", g.vignette));
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }
  }

  // Grey photo -> dots on a 45 degree screen, ink on paper. cell is in output pixels.
  function halftone(canvas, o) {
    const P = SC.PALETTE, T = P.texture.halftone, w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const d = ctx.getImageData(0, 0, w, h).data;
    const lum = new Float32Array(w * h);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) lum[p] = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    const cell = Math.max(T.minCell, T.cell * (o.scale || 1));
    const soft = SC.util.boxBlur(lum, w, h, Math.max(1, Math.round(cell * 0.45)), 1);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = o.paper; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = rgba(T.ink, T.alpha);
    const a = T.angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const reach = Math.ceil(Math.hypot(w, h) / cell) + 2;
    ctx.beginPath();
    for (let u = -reach; u <= reach; u++) {
      for (let v = -reach; v <= reach; v++) {
        const x = w / 2 + (u * ca - v * sa) * cell, y = h / 2 + (u * sa + v * ca) * cell;
        if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
        const xi = x < 0 ? 0 : (x >= w ? w - 1 : x | 0), yi = y < 0 ? 0 : (y >= h ? h - 1 : y | 0);
        const dark = 1 - soft[yi * w + xi];
        if (dark <= 0.02) continue;
        const r = cell * T.k * Math.sqrt(dark);
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.2832);
      }
    }
    ctx.fill();
  }

  function windowCanvas(photo, crop, w, h, styleId, kindId, seed, scale) {
    const P = SC.PALETTE, g = P.grades[styleId] || {};
    const cw = Math.max(1, Math.round(w)), ch = Math.max(1, Math.round(h));
    const c = SC.util.createCanvas(cw, ch);
    const ctx = c.getContext("2d", { willReadFrequently: true });
    SC.photo.drawRegion(ctx, photo, crop, 0, 0, cw, ch);
    const kindInk = P.kinds[kindId] ? P.kinds[kindId].ink : "#000000";
    apply(c, g, { seed: seed, kindInk: kindInk });
    if (g.halftone) halftone(c, { scale: scale || 1, paper: P.styles[styleId].paper });
    return c;
  }

  SC.grade = { window: windowCanvas, apply: apply, halftone: halftone };
})();
