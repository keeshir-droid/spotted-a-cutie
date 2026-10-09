// The photo object, the crop and its maths (PLAN.md section 6.3).
//
//   SC.photo.from(imageData) -> Photo { width, height, canvas }
//   SC.photo.autoCrop(photo) -> { cx, cy, zoom }
//   SC.photo.clampCrop(photo, crop, aspect) -> crop      zoom 1..MAX_ZOOM, window always covered
//   SC.photo.region(photo, crop, aspect) -> { sx, sy, sw, sh }   the part of the photo the window shows (photo px)
//   SC.photo.drawCrop(canvas, photo, crop)               un-styled, sized to the canvas (Adjust screen)
//   SC.photo.drawRegion(ctx, photo, crop, x, y, w, h)    draw the crop into a rectangle
//
// A crop is { cx, cy, zoom }: cx and cy are the centre (0..1 of the photo); zoom >= 1 is relative to the
// cover fit of the window being drawn, so the same crop works in every style's window.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  const MAX_ZOOM = 4;

  function from(imageData) {
    const canvas = SC.util.createCanvas(imageData.width, imageData.height);
    canvas.getContext("2d").putImageData(imageData, 0, 0);
    return { width: imageData.width, height: imageData.height, canvas: canvas };
  }

  // Auto-crop: no AI, a cheap centre-surround saliency on a small copy. Parts of the picture that differ from
  // their surroundings (an animal on a seat, a bird on a rail) pull the crop towards them; a centre prior keeps
  // the busy edges of a street photo from winning. Deterministic, about 5 ms for a 1600 px photo.
  const BASE = { cx: 0.5, cy: 0.45, zoom: 1.15 };
  function autoCrop(photo) {
    try {
      if (!photo || !photo.canvas || !photo.width) return Object.assign({}, BASE);
      const k = 72 / Math.max(photo.width, photo.height);
      const w = Math.max(8, Math.round(photo.width * k)), h = Math.max(8, Math.round(photo.height * k));
      const c = SC.util.createCanvas(w, h), x = c.getContext("2d", { willReadFrequently: true });
      x.imageSmoothingQuality = "high";
      x.drawImage(photo.canvas, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data, n = w * h;
      const ch = [new Float32Array(n), new Float32Array(n), new Float32Array(n)];
      for (let i = 0; i < n; i++) { ch[0][i] = d[i * 4] / 255; ch[1][i] = d[i * 4 + 1] / 255; ch[2][i] = d[i * 4 + 2] / 255; }
      const rs = 2, rl = Math.max(4, Math.round(Math.max(w, h) / 6));
      const sm = ch.map(function (a) { return SC.util.boxBlur(a, w, h, rs, 2); });
      const lg = ch.map(function (a) { return SC.util.boxBlur(a, w, h, rl, 2); });
      const sal = new Float32Array(n);
      let max = 0;
      for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
        const i = y * w + xx;
        let v = Math.abs(sm[0][i] - lg[0][i]) + Math.abs(sm[1][i] - lg[1][i]) + Math.abs(sm[2][i] - lg[2][i]);
        const dx = (xx / w - 0.5) / 0.38, dy = (y / h - 0.47) / 0.38;
        v *= Math.exp(-(dx * dx + dy * dy) / 2);
        sal[i] = v; if (v > max) max = v;
      }
      if (max <= 0) return Object.assign({}, BASE);
      // centroid of the strong part
      const thr = max * 0.35;
      let sw = 0, sx = 0, sy = 0;
      for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
        const v = sal[y * w + xx]; if (v < thr) continue;
        const q = (v - thr) * (v - thr); sw += q; sx += q * (xx + 0.5); sy += q * (y + 0.5);
      }
      if (sw <= 0) return Object.assign({}, BASE);
      const cx = sx / sw / w, cy = sy / sw / h;
      // how spread out is the strong part? a tight blob = a small, far-away animal: come in closer
      let vx = 0, vy = 0;
      for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
        const v = sal[y * w + xx]; if (v < thr) continue;
        const q = (v - thr) * (v - thr); vx += q * Math.pow((xx + 0.5) / w - cx, 2); vy += q * Math.pow((y + 0.5) / h - cy, 2);
      }
      const spread = Math.sqrt((vx + vy) / sw);
      const zoom = spread < 0.05 ? 1.6 : spread < 0.08 ? 1.4 : spread < 0.11 ? 1.25 : BASE.zoom;
      return { cx: cx, cy: cy, zoom: zoom };
    } catch (e) { return Object.assign({}, BASE); }
  }

  // size (in photo pixels) of the area a window of this aspect shows at this zoom
  function area(photo, zoom, aspect) {
    const iw = photo.width, ih = photo.height;
    let sw, sh;
    if (iw / ih > aspect) { sh = ih / zoom; sw = sh * aspect; }
    else { sw = iw / zoom; sh = sw / aspect; }
    return { sw: sw, sh: sh };
  }

  function clampCrop(photo, crop, aspect) {
    aspect = aspect > 0 ? aspect : 1;
    const c = crop || autoCrop(photo);
    let zoom = Number(c.zoom);
    if (!isFinite(zoom)) zoom = 1;
    zoom = Math.max(1, Math.min(MAX_ZOOM, zoom));
    const a = area(photo, zoom, aspect);
    const halfX = a.sw / 2 / photo.width, halfY = a.sh / 2 / photo.height;
    let cx = isFinite(c.cx) ? c.cx : 0.5, cy = isFinite(c.cy) ? c.cy : 0.5;
    cx = Math.max(halfX, Math.min(1 - halfX, cx));
    cy = Math.max(halfY, Math.min(1 - halfY, cy));
    return { cx: cx, cy: cy, zoom: zoom };
  }

  function region(photo, crop, aspect) {
    const c = clampCrop(photo, crop, aspect);
    const a = area(photo, c.zoom, aspect);
    const sx = Math.max(0, Math.min(photo.width - a.sw, c.cx * photo.width - a.sw / 2));
    const sy = Math.max(0, Math.min(photo.height - a.sh, c.cy * photo.height - a.sh / 2));
    return { sx: sx, sy: sy, sw: a.sw, sh: a.sh };
  }

  function drawRegion(ctx, photo, crop, x, y, w, h) {
    const r = region(photo, crop, w / h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(photo.canvas, r.sx, r.sy, r.sw, r.sh, x, y, w, h);
  }

  function drawCrop(canvas, photo, crop) {
    const ctx = canvas.getContext("2d");
    drawRegion(ctx, photo, crop, 0, 0, canvas.width, canvas.height);
  }

  SC.photo = {
    MAX_ZOOM: MAX_ZOOM, from: from, autoCrop: autoCrop, clampCrop: clampCrop,
    region: region, drawRegion: drawRegion, drawCrop: drawCrop
  };
})();
