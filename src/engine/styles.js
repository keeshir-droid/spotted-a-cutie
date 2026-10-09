// The six card layouts (PLAN.md section 5.4, look from DESIGN.md section 8). Every position, colour, size and
// texture strength is read from SC.PALETTE.styles[id]; this file only decides the order of drawing and how
// pieces fit together.
//
// Each style is { id, window(env), artKey(env), art(c, s, env), draw(c, s, env) }:
//   window(env)   the photo window at scale 1: { x, y, w, h, radius, rotate }
//   artKey(env)   what the static art depends on (paper, textures, frames), for the render cache
//   art(c,s,env)  the static art: nothing in it depends on the words, the photo or the card number
//   draw(c,s,env) everything else: photo, text, colophon (redrawn on every text change)
// c is a context scaled so that 1 unit = 1 px of the 1080x1350 card; s is that scale.
//
// env (built by card.js): { s, kind, K, golden, rarity, number, seed, v, to, personal, personalMarked,
//   reasonLabel, date: { short, long }, photo(win) -> graded canvas for the window }
//   v = every display string, with placeholders filled.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  function P() { return SC.PALETTE; }
  function A() { return SC.art; }
  function T() { return SC.text; }
  function W() { return 1080; }
  const H = 1350;

  // slot with its colour words resolved, plus overrides
  function slot(sl, env, extra) {
    const o = Object.assign({}, sl, extra || {});
    if (typeof o.color === "string") o.color = A().col(o.color, env.kind);
    return o;
  }
  function say(c, env, str, sl, extra) { return T().draw(c, str, slot(sl, env, extra)); }

  function photoInto(c, env, win, clipFn) {
    const pc = env.photo(win);
    c.save(); clipFn(c); c.clip();
    c.drawImage(pc, win.x, win.y, win.w, win.h);
    c.restore();
  }
  function rect(c, win) { c.beginPath(); c.rect(win.x, win.y, win.w, win.h); }
  function roundRect(c, win, r) { A().rr(c, win.x, win.y, win.w, win.h, r == null ? win.radius : r); }

  function ink(a, alpha) { return A().rgba(a, alpha); }
  function pers(env) { return P().ink.personal; }

  // =====================================================================================
  // MINIMAL: the gallery label
  // =====================================================================================
  const minimal = {
    id: "minimal",
    window: function () { const w = P().styles.minimal.window; return { x: w.x, y: w.y, w: w.w, h: w.h, radius: w.radius, rotate: 0 }; },
    artKey: function () { return "minimal"; },
    art: function (c, s, env) {
      const st = P().styles.minimal;
      c.fillStyle = st.paper; c.fillRect(0, 0, W(), H);
      A().grain(c, 0, 0, W(), H, st.texture.grain);
    },
    draw: function (c, s, env) {
      const st = P().styles.minimal, S = st.slots, win = st.window, art = A(), g = env.golden;
      const shift = env.to && st.personal.shift ? st.personal.shift : null;
      photoInto(c, env, win, function (x) { art.rr(x, win.x, win.y, win.w, win.h, win.radius); });
      c.save(); c.strokeStyle = ink(win.keyline.color, win.keyline.alpha); c.lineWidth = win.keyline.width;
      art.rr(c, win.x + 0.5, win.y + 0.5, win.w - 1, win.h - 1, win.radius); c.stroke(); c.restore();
      if (g) {
        const gr = st.golden.photoRule, o = gr.outset, b = { x: win.x - o - 4, y: win.y - o - 4, w: win.w + 2 * o + 8, h: win.h + 2 * o + 8 };
        art.layer(c, s, b, function (L) {
          art.rr(L, win.x - o, win.y - o, win.w + 2 * o, win.h + 2 * o, gr.radius); L.lineWidth = gr.width; L.strokeStyle = "#000"; L.stroke();
          art.foilize(L, b, env.seed + 3);
        });
      }
      // name
      const nameO = Object.assign({}, S.name, shift ? shift.name : {});
      if (g) {
        art.foilText(c, s, { x: 30, y: nameO.baseline - 130, w: 1020, h: 170 }, function (x, colr) { T().draw(x, env.v.name, slot(nameO, env, { color: colr })); }, env.seed + 4);
      } else say(c, env, env.v.name, nameO);
      say(c, env, env.v.title, S.title, shift ? shift.title : null);
      if (env.to && env.personal) say(c, env, env.personal, S.personal, shift ? shift.personal : null);
      // two rows: label + value
      const baselines = shift ? shift.rows.baselines : st.rows.baselines;
      const labels = { mood: "Mood", habitat: "Habitat" };
      st.rows.fields.forEach(function (f, i) {
        const b = baselines[i];
        say(c, env, labels[f], S.rowLabel, { baseline: b });
        say(c, env, env.v[f], S.rowValue, { baseline: b });
      });
      art.colophon(c, s, st, env, st.ink, P().address.alpha);
    }
  };

  // =====================================================================================
  // TRADING: the tea card
  // =====================================================================================
  const trading = {
    id: "trading",
    window: function () { const w = P().styles.trading.window; return { x: w.x, y: w.y, w: w.w, h: w.h, radius: w.radius, rotate: 0 }; },
    artKey: function (env) { return "trading|" + env.kind + "|" + (env.golden ? "g" : "n") + "|" + env.seed; },
    art: function (c, s, env) {
      const p = P(), st = p.styles.trading, K = env.K, art = A(), CR = p.ink.cream, pt = st.parts, cd = st.card, b = cd.border;
      const mis = s >= p.texture.misregistration.minScale ? p.texture.misregistration.dx : 0;
      c.fillStyle = K.dark; c.fillRect(0, 0, W(), H);
      art.hatch(c, 0, 0, W(), H, st.texture.hatch); art.grain(c, 0, 0, W(), H, st.texture.grain);
      const f = { x: cd.x + b, y: cd.y + b, w: cd.w - 2 * b, h: cd.h - 2 * b };
      art.printShadow(c, s, function (x) { art.rr(x, cd.x, cd.y, cd.w, cd.h, cd.radius); }, CR);
      c.fillStyle = CR; art.rr(c, cd.x, cd.y, cd.w, cd.h, cd.radius); c.fill(); art.grain(c, cd.x, cd.y, cd.w, cd.h, 0.03);
      if (env.golden) art.foilShape(c, s, { x: f.x - 2, y: f.y - 2, w: f.w + 4, h: f.h + 4 }, function (L) { art.rr(L, f.x, f.y, f.w, f.h, cd.innerRadius); }, env.seed);
      else {
        c.save(); art.rr(c, f.x, f.y, f.w, f.h, cd.innerRadius); c.clip();
        c.fillStyle = K.ink; c.fillRect(f.x, f.y, f.w, f.h); art.grain(c, f.x, f.y, f.w, f.h, st.texture.inkGrain); c.restore();
      }
      // cream panel and the spot-ink ribbon, 1 px off-register
      const pn = pt.panel, ts = pt.typeStrip;
      c.fillStyle = CR; art.rr(c, pn.x + mis, pn.y + mis, pn.w, pn.h, pn.radius); c.fill(); art.grain(c, pn.x, pn.y, pn.w, pn.h, pn.grain);
      c.fillStyle = K.spot; art.tagPath(c, ts.x + mis, ts.y + mis, ts.w, ts.h, 3, ts.notch); c.fill();
      art.grain(c, ts.x, ts.y, ts.w, ts.h, st.texture.inkGrain);
      const kl = ts.keyline;
      c.save(); c.strokeStyle = ink(kl.color, 0.75); c.lineWidth = kl.width;
      art.tagPath(c, ts.x + mis + kl.inset, ts.y + mis + kl.inset, ts.w - 2 * kl.inset, ts.h - 2 * kl.inset, 2, ts.notch - 1); c.stroke(); c.restore();
      const ru = pt.rule; c.fillStyle = ink(art.col(ru.color, env.kind), ru.alpha); c.fillRect(ru.x1, ru.y, ru.x2 - ru.x1, ru.width);
      const dv = pt.divider; c.fillStyle = ink(dv.color, dv.alpha); c.fillRect(dv.x1, dv.y, dv.x2 - dv.x1, dv.width);
      // the bottom row's labels never change
      const S = st.slots;
      pt.bottomLabels.forEach(function (lab, i) { T().draw(c, lab, slot(S.bottomLabel, env, { x: S.bottomLabel.xs[i], w: S.bottomLabel.ws[i] })); });
    },
    draw: function (c, s, env) {
      const p = P(), st = p.styles.trading, K = env.K, art = A(), CR = p.ink.cream, S = st.slots, pt = st.parts, g = env.golden, gl = st.golden, v = env.v;
      const win = st.window, bv = win.bevel;
      photoInto(c, env, win, function (x) { art.rr(x, win.x, win.y, win.w, win.h, win.radius); });
      c.save(); c.lineWidth = bv.outer.width; c.strokeStyle = g ? "#fbf3dc" : CR;
      art.rr(c, win.x - bv.outer.offset, win.y - bv.outer.offset, win.w + 2 * bv.outer.offset, win.h + 2 * bv.outer.offset, win.radius + bv.outer.offset); c.stroke();
      c.lineWidth = bv.inner.width; c.strokeStyle = K.dark; art.rr(c, win.x, win.y, win.w, win.h, win.radius); c.stroke(); c.restore();
      // series line, name
      const series = pt.series[env.kind] + " · No. " + String(env.number).padStart(3, "0");
      say(c, env, series, S.series, g ? { color: gl.seriesColor, alpha: 0.8 } : null);
      say(c, env, v.name, S.name, { color: g ? gl.nameColor : CR });
      // the stat stamp
      const ss = pt.statStamp, scol = g ? gl.statColor : ss.color, stat = v.stat;
      const b = { x: ss.cx - ss.r - 8, y: ss.cy - ss.r - 8, w: 2 * ss.r + 16, h: 2 * ss.r + 16 };
      art.layer(c, s, b, function (L) {
        L.translate(ss.cx, ss.cy); L.rotate(ss.rotate * Math.PI / 180); L.strokeStyle = scol;
        L.lineWidth = ss.ring.outer; L.beginPath(); L.arc(0, 0, ss.r - ss.ring.outer / 2, 0, 7); L.stroke();
        L.lineWidth = ss.ring.inner; L.beginPath(); L.arc(0, 0, ss.r - ss.ring.outer - ss.ring.gap - ss.ring.inner / 2, 0, 7); L.stroke();
        T().draw(L, stat[0], { x: -ss.r, y: 0, w: 2 * ss.r, h: 0, font: "gothic", size: S.statLabel.size, tracking: S.statLabel.tracking, align: "center", color: scol, upper: true, baseline: S.statLabel.dy });
        T().draw(L, String(stat[1]), { x: -ss.r, y: 0, w: 2 * ss.r, h: 0, font: "gothic", size: S.statValue.size, align: "center", color: scol, baseline: S.statValue.dy });
      }, function (L) { art.dropout(L, b, ss.dropout, env.seed + 12); });
      // type ribbon
      const typeLine = v.title + " · Lv. " + v.age;
      if (g) {
        const gp = gl.typePrefix, tt = T(), r = tt.fit(c, typeLine, slot(S.type, env, { w: S.type.w - 140 }));
        const pw = tt.width(c, gp.text, gp.font, gp.size, gp.tracking), sepw = tt.width(c, gp.sep, "serifItalic", r.px, 0), lw = tt.width(c, r.lines[0], "serifItalic", r.px, 0);
        const x0 = S.type.x + (S.type.w - pw - sepw - lw) / 2;
        tt.draw(c, gp.text, { x: x0, w: pw + 4, h: 0, y: 0, font: gp.font, size: gp.size, tracking: gp.tracking, align: "left", color: gp.color, baseline: S.type.baseline });
        tt.draw(c, gp.sep + r.lines[0], { x: x0 + pw + 6, w: sepw + lw + 8, y: 0, h: 0, font: "serifItalic", size: r.px, align: "left", color: CR, baseline: S.type.baseline });
      } else say(c, env, typeLine, S.type);
      // one move
      const m = v.moves[0];
      if (m) {
        say(c, env, String(m.damage), S.moveDamage);
        say(c, env, m.name, S.moveName);
        say(c, env, m.text, S.moveText);
      }
      // bottom row values
      const vals = [v.weakness, v.threat, pt.retreatValue];
      vals.forEach(function (val, i) { say(c, env, val, S.bottomValue, { x: S.bottomValue.xs[i], w: S.bottomValue.ws[i] }); });
      if (env.to && env.personal) say(c, env, env.personal, S.personal);
      else say(c, env, v.flavour, S.flavour);
      // colophon on the ink
      if (g) art.colophon(c, s, st, env, p.ink.black, 1, { addrColor: gl.address.color, addrAlpha: gl.address.alpha });
      else art.colophon(c, s, st, env, CR, 1, { addrColor: p.address.onDark.color, addrAlpha: p.address.onDark.alpha });
      if (g) {
        const gs = gl.star, sb = { x: gs.cx - gs.r - 4, y: gs.cy - gs.r - 4, w: 2 * gs.r + 8, h: 2 * gs.r + 8 };
        art.foilShape(c, s, sb, function (L) { art.starPath(L, gs.cx, gs.cy, gs.r, gs.inner); }, env.seed + 2, { width: gs.strokeWidth, color: gs.stroke });
      }
    }
  };

  // =====================================================================================
  // POLAROID: the journal page
  // =====================================================================================
  function polaroidRot(seed) {
    const st = P().styles.polaroid, r = SC.util.mulberry32((seed + 17) >>> 0);
    return st.print.rotate + (r() * 2 - 1) * st.print.rotateJitter;
  }
  function inPrint(c, rot, fn) {
    const pr = P().styles.polaroid.print, cx = pr.x + pr.w / 2, cy = pr.y + pr.h / 2;
    c.save(); c.translate(cx, cy); c.rotate(rot * Math.PI / 180); c.translate(-cx, -cy); fn(); c.restore();
  }
  const polaroid = {
    id: "polaroid",
    window: function (env) {
      const w = P().styles.polaroid.window;
      return { x: w.x, y: w.y, w: w.w, h: w.h, radius: 0, rotate: polaroidRot(env && env.seed != null ? env.seed : 0) };
    },
    artKey: function (env) { return "polaroid|" + env.seed; },
    art: function (c, s, env) {
      const p = P(), st = p.styles.polaroid, art = A(), pr = st.print, rot = polaroidRot(env.seed);
      c.fillStyle = st.paper; c.fillRect(0, 0, W(), H);
      art.grain(c, 0, 0, W(), H, st.texture.grain);
      art.dotGrid(c, W(), H, env.seed);
      inPrint(c, rot, function () {
        art.printShadow(c, s, function (x) { x.beginPath(); x.rect(pr.x, pr.y, pr.w, pr.h); }, st.frame);
        c.fillStyle = st.frame; c.fillRect(pr.x, pr.y, pr.w, pr.h);
        art.grain(c, pr.x, pr.y, pr.w, pr.h, st.texture.frameGrain);
      });
      // the hand-drawn arrow, up at the print
      const ar = st.parts.arrow, r = SC.util.mulberry32((env.seed + 23) >>> 0);
      const j = function (pt) { return [pt[0] + (r() * 2 - 1) * 6, pt[1] + (r() * 2 - 1) * 6]; };
      const A0 = j(ar.from), AV = j(ar.via), A1 = j(ar.to), ang = Math.atan2(A1[1] - AV[1], A1[0] - AV[0]), hl = ar.head;
      c.save(); c.strokeStyle = ar.color; c.lineWidth = ar.stroke; c.lineCap = "round"; c.lineJoin = "round";
      c.beginPath(); c.moveTo(A0[0], A0[1]); c.quadraticCurveTo(AV[0], AV[1], A1[0], A1[1]); c.stroke();
      c.beginPath(); c.moveTo(A1[0] - hl * Math.cos(ang - 0.5), A1[1] - hl * Math.sin(ang - 0.5)); c.lineTo(A1[0], A1[1]);
      c.lineTo(A1[0] - hl * Math.cos(ang + 0.5), A1[1] - hl * Math.sin(ang + 0.5)); c.stroke(); c.restore();
    },
    draw: function (c, s, env) {
      const p = P(), st = p.styles.polaroid, art = A(), pr = st.print, S = st.slots, v = env.v, g = env.golden;
      const rot = polaroidRot(env.seed), win = st.window, tt = T();
      inPrint(c, rot, function () {
        photoInto(c, env, win, function (x) { x.beginPath(); x.rect(win.x, win.y, win.w, win.h); });
        c.strokeStyle = ink(win.innerShadow.color, win.innerShadow.alpha); c.lineWidth = win.innerShadow.width;
        c.strokeRect(win.x + 0.5, win.y + 0.5, win.w - 1, win.h - 1);
        const top = st.strip.y;
        // the caption: name · mood · date; if it's too long the mood is shortened, never the date
        const gd = st.golden.starDoodle;
        const namePart = g ? v.name + " ★" : v.name;
        function line(slotDef, base, personalised) {
          const o = slot(slotDef, env, { x: pr.x + slotDef.x, baseline: top + base });
          if (g) o.heart = { size: gd.size, stroke: gd.stroke, color: gd.color };
          const words = v.mood.split(" ");
          let text = "";
          for (let n = words.length; n >= 1; n--) {
            const mood = words.slice(0, n).join(" ") + (n < words.length ? "…" : "");
            text = namePart + " · " + mood + " · " + env.date.short;
            const r = tt.fit(c, text, o);
            if (r.lines[0].slice(-1) !== "…" || n === 1) break;
          }
          return tt.draw(c, text, o);
        }
        if (env.to && env.personal) {
          const o2 = slot(S.caption2, env, { x: pr.x + S.caption2.x + 50, w: S.caption2.w - 100, baseline: top + S.caption2.baselineInStrip });
          const pl = env.personalMarked || env.personal, r2 = tt.fit(c, pl, o2);
          if (r2.lines[0].slice(-1) === "…" && tt.stripMarks(pl).slice(-1) !== "…") {
            // too long for one line: the personal line gets the strip, in two lines
            tt.draw(c, pl, Object.assign({}, o2, { size: [46, 34], lines: 2, lineHeight: 1.05, baseline: top + 82 }));
          } else {
            line(S.caption1, S.caption1.baselineInStrip);
            tt.draw(c, pl, o2);
          }
        } else line(S.caption, S.caption.baselineInStrip);
      });
      // the two notes on the journal page
      const note1 = env.place ? env.place : v.habitat;
      [["note1", note1], ["note2", v.catchphrase]].forEach(function (n) {
        const sl = S[n[0]];
        say(c, env, n[1], sl, { baseline: sl.y + 38, y: sl.y });
      });
      // washi tape across the top edge, riding the print's rotation
      const tp = st.parts.tape, pcx = pr.x + pr.w / 2, pcy = pr.y + pr.h / 2, dx = tp.cx - pcx, dy = tp.cy - pcy, rad = rot * Math.PI / 180;
      const tx = pcx + dx * Math.cos(rad) - dy * Math.sin(rad), ty = pcy + dx * Math.sin(rad) + dy * Math.cos(rad);
      const Wt = p.texture.washi, rr = SC.util.mulberry32((env.seed + 31) >>> 0);
      art.washi(c, s, tx, ty, rot + Wt.rotate + (rr() * 2 - 1) * Wt.rotateJitter, art.col(tp.color, env.kind), Wt.alpha, env.seed + 3, g);
      art.colophon(c, s, st, env, st.ink, p.address.alpha);
    }
  };

  // =====================================================================================
  // WANTED: the handbill
  // =====================================================================================
  const wanted = {
    id: "wanted",
    window: function () { const w = P().styles.wanted.window; return { x: w.x, y: w.y, w: w.w, h: w.h, radius: 0, rotate: 0 }; },
    artKey: function (env) { return "wanted|" + env.seed + "|" + (env.golden ? "g" : "n"); },
    art: function (c, s, env) {
      const p = P(), st = p.styles.wanted, art = A(), S = st.slots, ink0 = st.ink, win = st.window;
      c.fillStyle = st.paper; c.fillRect(0, 0, W(), H);
      art.stains(c, W(), H, env.seed);
      art.fibres(c, W(), H, st.texture.fibres, env.seed + 1);
      art.grain(c, 0, 0, W(), H, st.texture.grain);
      art.edgeBurn(c, W(), H);
      const r = SC.util.mulberry32(env.seed + 5), cz = p.texture.crease;
      art.crease(c, W(), H, "h", Math.round(H * (cz.near + (r() - 0.5) * cz.jitter * 2)));
      art.crease(c, W(), H, "v", Math.round(W() * (cz.near + (r() - 0.5) * cz.jitter * 2)));
      st.nails.forEach(function (n) { art.nail(c, n[0], n[1]); });
      // WANTED, as wide as its box allows
      const w = S.wanted, tt = T(), cap = tt.cap("gothic");
      let px = w.size[0];
      while (px > w.size[1] && (tt.width(c, w.text, "gothic", px, w.tracking) > w.w || cap * px > w.h - 16)) px -= 2;
      const o = { x: w.x, y: w.y, w: w.w, h: w.h, font: "gothic", size: px, baseline: w.baseline, align: "center", tracking: w.tracking, upper: true };
      const b = { x: w.x - 10, y: w.y - 10, w: w.w + 20, h: w.h + 20 };
      function drawWord(x, color) { tt.draw(x, w.text, Object.assign({}, o, { color: color, inkSpread: true })); }
      const post = function (L) { art.dropout(L, b, env.golden && st.golden.wordDropout != null ? st.golden.wordDropout : w.dropout, env.seed + 7); };
      if (env.golden) art.foilText(c, s, b, drawWord, env.seed + 6, post);
      else art.layer(c, s, b, function (L) { drawWord(L, ink0); }, post);
      // the printed frame outside the photo (rule 10 px out)
      c.save(); c.strokeStyle = win.rule.color; c.lineWidth = win.rule.width;
      c.strokeRect(win.x - win.rule.offset - 0.5, win.y - win.rule.offset - 0.5, win.w + 2 * win.rule.offset + 1, win.h + 2 * win.rule.offset + 1); c.restore();
      // the rule group under the alias
      const ag = st.parts.ruleGroup; let y = ag.y;
      c.fillStyle = ink(ag.color, ag.alpha);
      ag.lines.forEach(function (lw) { c.fillRect(ag.x1, y, ag.x2 - ag.x1, lw); y += lw + ag.gap; });
    },
    draw: function (c, s, env) {
      const p = P(), st = p.styles.wanted, art = A(), S = st.slots, v = env.v, win = st.window, tt = T(), g = env.golden;
      say(c, env, v.crime, S.crime);
      photoInto(c, env, win, function (x) { rect(x, win); });
      c.save(); c.strokeStyle = win.border.color; c.lineWidth = win.border.width;
      c.strokeRect(win.x + win.border.width / 2, win.y + win.border.width / 2, win.w - win.border.width, win.h - win.border.width); c.restore();
      if (g) {
        const rb = st.golden.ribbon, x0 = rb.cx - rb.w / 2, bb = { x: x0 - 4, y: rb.y - 4, w: rb.w + 8, h: rb.h + 8 };
        art.foilShape(c, s, bb, function (L) { art.ribbonPath(L, x0, rb.y, rb.w, rb.h, rb.fork); }, env.seed + 8);
        tt.draw(c, rb.text, { x: x0, y: rb.y, w: rb.w, h: rb.h, font: rb.font, size: rb.size, tracking: rb.tracking, align: "center", color: rb.color });
      }
      say(c, env, v.name, S.name);
      say(c, env, v.aka, S.alias);
      // last seen and reward: label + value, centred as one group
      function pair(lab, valSlot, val) {
        const label = lab.text.toUpperCase(), lw = tt.width(c, label, "gothic", lab.size, lab.tracking);
        const o = slot(valSlot, env, { w: valSlot.w - lw - lab.gap });
        const vr = tt.fit(c, val, o), vw = tt.width(c, vr.lines[0], "serif", vr.px, 0);
        const x0 = 540 - (lw + lab.gap + vw) / 2;
        tt.draw(c, label, { x: x0, y: 0, w: lw + 8, h: 0, font: "gothic", size: lab.size, tracking: lab.tracking, align: "left", color: lab.color, baseline: valSlot.baseline });
        tt.draw(c, val, { x: x0 + lw + lab.gap, y: 0, w: vw + 8, h: 0, font: "serif", size: vr.px, align: "left", color: A().col(valSlot.color, env.kind), baseline: valSlot.baseline });
      }
      pair(S.lastSeenLabel, S.lastSeen, v.lastSeen);
      pair(S.rewardLabel, S.reward, v.reward);
      art.colophon(c, s, st, env, st.ink, p.address.alpha);
      if (env.to && env.personal) {
        const ps = st.personal.stamp, SS = p.texture.stamp, slotW = ps.maxW - 2 * (SS.padX + SS.outer + SS.gap + SS.inner);
        let l2 = env.personal;
        const m = /^If found, return to [^.]*\.\s*(.*)$/i.exec(env.personal);
        if (m) l2 = m[1];
        // line 1: as much of "If found, return to NAME" as fits at the 30 px floor; the name is never cut
        const minPx = ps.line1.size[1], to = env.to.toUpperCase();
        const fits = function (txt) { return tt.width(c, txt.toUpperCase(), "gothic", minPx, ps.line1.tracking) <= slotW; };
        const lines = [];
        if (fits("If found, return to " + to)) lines.push({ text: "If found, return to " + env.to, font: "gothic", size: ps.line1.size, tracking: ps.line1.tracking, upper: true });
        else if (fits("Return to " + to)) lines.push({ text: "Return to " + env.to, font: "gothic", size: ps.line1.size, tracking: ps.line1.tracking, upper: true });
        else {
          lines.push({ text: "Return to", font: "gothic", size: [34, minPx], tracking: ps.line1.tracking, upper: true });
          lines.push({ text: env.to, font: "gothic", size: ps.line1.size, tracking: ps.line1.tracking, upper: true });
        }
        if (l2) lines.push({ text: l2, font: "serifItalic", size: ps.line2.size, lines: 2 });
        art.stamp(c, s, ps.cx, ps.cy, ps.rotate, ps.color, ps.alpha, lines, env.seed + 9, ps.maxW);
      }
    }
  };

  // =====================================================================================
  // DATING: the personal ad
  // =====================================================================================
  const dating = {
    id: "dating",
    window: function () { const w = P().styles.dating.window; return { x: w.x, y: w.y, w: w.w, h: w.h, radius: w.radius, rotate: 0 }; },
    artKey: function () { return "dating"; },
    art: function (c, s, env) {
      const p = P(), st = p.styles.dating, art = A(), pt = st.parts, ch = pt.chips;
      c.fillStyle = st.paper; c.fillRect(0, 0, W(), H);
      art.grain(c, 0, 0, W(), H, st.texture.grain);
      // chip outlines
      c.save(); c.strokeStyle = ink(ch.color, ch.alpha); c.lineWidth = ch.stroke;
      for (let i = 0; i < ch.fields.length; i++) {
        const cx = ch.x + (i % ch.cols) * (ch.chipW + ch.gap), cy = ch.y + Math.floor(i / ch.cols) * (ch.chipH + ch.gap);
        art.rr(c, cx + ch.stroke / 2, cy + ch.stroke / 2, ch.chipW - ch.stroke, ch.chipH - ch.stroke, ch.radius); c.stroke();
      }
      c.restore();
      // the two round buttons: flat printed circles
      const nope = pt.nope, like = pt.like;
      c.save(); c.strokeStyle = nope.color; c.lineWidth = nope.stroke; c.beginPath(); c.arc(nope.cx, nope.cy, nope.d / 2 - nope.stroke / 2, 0, 7); c.stroke(); c.restore();
      art.cross(c, nope.cx, nope.cy, nope.cross.size, nope.cross.width, nope.color);
      c.fillStyle = like.fill; c.beginPath(); c.arc(like.cx, like.cy, like.d / 2, 0, 7); c.fill();
      art.heart(c, like.cx, like.cy + 1, like.heart.size, { color: like.heart.color });
    },
    draw: function (c, s, env) {
      const p = P(), st = p.styles.dating, art = A(), S = st.slots, pt = st.parts, win = st.window, v = env.v, tt = T(), g = env.golden;
      photoInto(c, env, win, function (x) { art.rr(x, win.x, win.y, win.w, win.h, win.radius); });
      // the dark fade over the bottom of the photo
      c.save(); art.rr(c, win.x, win.y, win.w, win.h, win.radius); c.clip();
      const fd = win.fade, y0 = win.y + win.h * fd.from, gr = c.createLinearGradient(0, y0, 0, win.y + win.h);
      for (let i = 0; i <= 10; i++) gr.addColorStop(i / 10, ink(fd.color, fd.alpha * SC.util.smoothstep(i / 10)));
      c.fillStyle = gr; c.fillRect(win.x, y0, win.w, win.y + win.h - y0); c.restore();
      // name, age and distance
      say(c, env, v.name + ", " + v.age, S.name);
      const d = S.distance;
      art.pin(c, d.pin.x, d.baseline - 30, d.pin.size, d.pin.stroke, d.pin.color);
      say(c, env, v.distance, d);
      // chips
      const ch = pt.chips, cap = tt.cap("serif");
      ch.fields.forEach(function (f, i) {
        const cx = ch.x + (i % ch.cols) * (ch.chipW + ch.gap), cy = ch.y + Math.floor(i / ch.cols) * (ch.chipH + ch.gap);
        const lab = ch.labels[i], lx = cx + S.chipLabel.padX, mid = cy + ch.chipH / 2;
        const lw = tt.width(c, lab.toUpperCase(), "gothic", S.chipLabel.size, S.chipLabel.tracking);
        const vx = lx + lw + S.chipLabel.gap, vw = cx + ch.chipW - S.chipLabel.padX - vx, val = v[f];
        const one = { x: vx, w: vw, font: "serif", size: S.chipValue.size, lines: 1, color: S.chipValue.color };
        const fitOne = tt.fit(c, val, one);
        let base1;
        if (fitOne.lines[0].slice(-1) !== "…" || fitOne.lines[0] === val) {
          base1 = mid + cap * fitOne.px / 2;
          tt.draw(c, val, Object.assign({ y: 0, h: 0, baseline: base1 }, one));
        } else {
          // too long for one line: two smaller lines to the right of the label
          const two = { x: vx, w: vw, font: "serif", size: [26, 21], lines: 2, lineHeight: 1.0, color: S.chipValue.color, baseline: mid - 4 };
          tt.draw(c, val, Object.assign({ y: 0, h: 0 }, two));
          // keep the label level with the first line
          tt.draw(c, lab, { x: lx, y: 0, w: lw + 8, h: 0, font: "gothic", size: S.chipLabel.size, tracking: S.chipLabel.tracking, align: "left", color: S.chipLabel.color, upper: true, baseline: mid - 4 });
          return;
        }
        tt.draw(c, lab, { x: lx, y: 0, w: lw + 8, h: 0, font: "gothic", size: S.chipLabel.size, tracking: S.chipLabel.tracking, align: "left", color: S.chipLabel.color, upper: true, baseline: base1 });
      });
      // the personal banner, or the golden seal
      const bn = st.personal.banner, gold = st.golden;
      if (env.to && env.personal) {
        const bx = g ? gold.bannerShift.x : bn.x, bw = g ? gold.bannerShift.w : bn.w;
        c.save();
        const bcx = bx + bw / 2, bcy = bn.y + bn.h / 2;
        c.translate(bcx, bcy); c.rotate(bn.rotate * Math.PI / 180); c.translate(-bcx, -bcy);
        // shadow, label, inner rule, tape
        art.printShadow(c, s, function (x) { art.rr(x, bx, bn.y, bw, bn.h, bn.radius); }, bn.fill);
        c.fillStyle = bn.fill; art.rr(c, bx, bn.y, bw, bn.h, bn.radius); c.fill();
        c.strokeStyle = bn.rule.color; c.lineWidth = bn.rule.width;
        art.rr(c, bx + bn.rule.inset, bn.y + bn.rule.inset, bw - 2 * bn.rule.inset, bn.h - 2 * bn.rule.inset, 3); c.stroke();
        // split "Opener! rest" into line 1 and line 2
        const marked = env.personalMarked || env.personal;
        let l1 = bn.line1.text, l2 = marked;
        const m = /^(.{2,22}?[!?])\s+(.*)$/.exec(env.personal);
        if (m) { l1 = m[1]; l2 = marked.replace(/^.{2,22}?[!?]\s+/, ""); }
        const iw = bw - 80, ix = bx + 40;
        const l2plain = tt.stripMarks(l2);
        const l2fit = tt.fit(c, l2plain, { font: bn.line2.font, size: [34, 26], w: iw, lines: 1 });
        const l2cut = l2fit.lines[0].slice(-1) === "…" && l2plain.slice(-1) !== "…";
        tt.draw(c, l1, { x: ix, y: 0, w: iw, h: 0, font: bn.line1.font, size: [38, 30], align: "center", color: bn.line1.color, baseline: bn.y + (l2cut ? 36 : 40) });
        if (!l2cut) {
          tt.draw(c, l2, { x: ix, y: 0, w: iw, h: 0, font: bn.line2.font, size: [34, 26], align: "center", color: bn.line2.color, toColor: bn.line2.toColor, baseline: bn.y + 74, heart: { size: bn.line2.heart.size, color: bn.line2.heart.color } });
          if (env.reasonLabel) tt.draw(c, env.reasonLabel, { x: ix, y: 0, w: iw, h: 0, font: bn.line3.font, size: bn.line3.size, tracking: bn.line3.tracking, upper: true, align: "center", color: bn.line3.color, baseline: bn.y + 106 });
        } else {
          // a very long name + recipient: two lines, and the small reason line makes way
          tt.draw(c, l2, { x: ix, y: 0, w: iw, h: 0, font: bn.line2.font, size: [32, 24], lines: 2, lineHeight: 1.02, align: "center", color: bn.line2.color, toColor: bn.line2.toColor, baseline: bn.y + 72, heart: { size: bn.line2.heart.size, color: bn.line2.heart.color } });
        }
        // a little rose tape at the top-left corner
        c.save(); c.translate(bx + 22, bn.y + 8); c.rotate(-0.55);
        c.fillStyle = ink(bn.tape.color, bn.tape.alpha); c.fillRect(-bn.tape.w / 2, -bn.tape.h / 2, bn.tape.w, bn.tape.h); c.restore();
        c.restore();
      }
      if (g) {
        const sl = gold.seal, sb = { x: sl.cx - sl.d / 2 - 6, y: sl.cy - sl.d / 2 - 6, w: sl.d + 12, h: sl.d + 12 };
        art.layer(c, s, sb, function (L) {
          art.scallopPath(L, sl.cx, sl.cy, sl.d / 2, sl.scallops, sl.depth); L.fillStyle = "#000"; L.fill();
          art.foilize(L, sb, env.seed + 5);
          L.beginPath(); L.arc(sl.cx, sl.cy, sl.d / 2 - sl.ring.inset, 0, 7); L.lineWidth = sl.ring.width; L.strokeStyle = sl.ring.color; L.stroke();
        });
        const capG = tt.cap("gothic");
        sl.lines.forEach(function (ln, i) {
          tt.draw(c, ln, { x: sl.cx - sl.d / 2, y: 0, w: sl.d, h: 0, font: sl.font, size: sl.size, tracking: sl.tracking, align: "center", color: sl.color, upper: true, baseline: sl.cy + (i ? 31 : -6) + (capG * sl.size) / 2 - 11 });
        });
      }
      art.colophon(c, s, st, env, st.ink, p.address.alpha);
    }
  };

  // =====================================================================================
  // NEWS: the local paper
  // =====================================================================================
  const news = {
    id: "news",
    window: function () { const w = P().styles.news.window; return { x: w.x, y: w.y, w: w.w, h: w.h, radius: 0, rotate: 0 }; },
    artKey: function (env) { return "news|" + env.seed + "|" + (env.golden ? "g" : "n"); },
    art: function (c, s, env) {
      const p = P(), st = p.styles.news, art = A(), S = st.slots, pt = st.parts, g = env.golden, sy = g ? st.golden.shiftY : 0, tt = T();
      c.fillStyle = st.paper; c.fillRect(0, 0, W(), H);
      art.fibres(c, W(), H, st.texture.fibres, env.seed + 1, st.ink);
      art.grain(c, 0, 0, W(), H, st.texture.grain);
      art.crease(c, W(), H, "h", st.texture.creaseY);
      c.fillStyle = st.ink;
      pt.rules.forEach(function (r) { c.fillRect(40, r.y + sy, 1000, r.w); });
      tt.draw(c, S.masthead.text, slot(S.masthead, env, { baseline: S.masthead.baseline + sy }));
      tt.draw(c, S.price.text, slot(S.price, env, { baseline: S.price.baseline + sy }));
      // columns: a rule down the middle, grey text bars on the left, rules round the pull quote on the right
      const co = pt.columns, bars = pt.bars, r = SC.util.mulberry32(env.seed + 11);
      c.fillStyle = ink(co.rule.color, co.rule.alpha); c.fillRect(co.x + co.colW + co.gutter / 2, co.y, co.rule.width, co.h);
      c.fillStyle = ink(bars.color, bars.alpha);
      for (let i = 0, y = co.y + 6; y + bars.h <= co.y + co.h; i++, y += bars.pitch) {
        const last = i % 2 === 1, w = co.colW * (last ? bars.lastMin + (bars.lastMax - bars.lastMin) * r() : 1);
        c.fillRect(co.x, y, w, bars.h);
      }
      const px0 = co.x + co.colW + co.gutter;
      c.fillStyle = ink(pt.pullRules.color, pt.pullRules.alpha);
      c.fillRect(px0, co.y + 2, co.colW, pt.pullRules.width); c.fillRect(px0, co.y + co.h - 2, co.colW, pt.pullRules.width);
      if (g) {
        const bn = st.golden.banner, b = { x: 0, y: 0, w: bn.w, h: bn.h };
        art.foilShape(c, s, b, function (L) { L.beginPath(); L.rect(bn.x, bn.y, bn.w, bn.h); }, env.seed + 3);
        const word = bn.text, cap = tt.cap("gothic");
        const ww = tt.width(c, word, "gothic", bn.size, bn.tracking), gap = bn.star.gap + bn.star.r;
        tt.draw(c, word, { x: bn.x, y: 0, w: bn.w, h: 0, font: "gothic", size: bn.size, tracking: bn.tracking, align: "center", color: bn.color, baseline: bn.y + bn.h / 2 + cap * bn.size / 2 });
        [-1, 1].forEach(function (d) {
          art.starPath(c, 540 + d * (ww / 2 + gap), bn.y + bn.h / 2, bn.star.r, bn.star.inner); c.fillStyle = bn.star.color; c.fill();
        });
      }
    },
    draw: function (c, s, env) {
      const p = P(), st = p.styles.news, art = A(), S = st.slots, pt = st.parts, win = st.window, v = env.v, tt = T(), g = env.golden, sy = g ? st.golden.shiftY : 0;
      tt.draw(c, env.date.long, slot(S.dateline, env, { baseline: S.dateline.baseline + sy }));
      if (S.vol) tt.draw(c, S.vol.text, slot(S.vol, env, { baseline: st.colophon.tag.y + p.tag.h / 2 + tt.cap("gothic") * S.vol.size / 2 }));
      // headline, top-anchored
      const hl = env.to && env.personal ? env.personal : v.headline;
      tt.draw(c, hl, slot(S.headline, env, { y: S.headline.y + sy, h: g ? st.golden.headlineH : S.headline.h, top: true }));
      photoInto(c, env, win, function (x) { rect(x, win); });
      c.save(); c.strokeStyle = st.ink; c.lineWidth = 1; c.strokeRect(win.x + 0.5, win.y + 0.5, win.w - 1, win.h - 1); c.restore();
      // EXCLUSIVE
      const ex = pt.exclusive;
      art.stamp(c, s, ex.cx, ex.cy, ex.rotate, ex.color, ex.alpha, [{ text: ex.text, font: ex.font, size: ex.size, tracking: ex.tracking, upper: true }], env.seed + 9, 420);
      tt.draw(c, env.v.name + ", pictured, declined to comment.", slot(S.caption, env));
      const co = pt.columns, px0 = co.x + co.colW + co.gutter;
      tt.draw(c, v.catchphrase, slot(S.pull, env, { x: px0, w: co.colW, y: co.y + 8, h: co.h - 16 }));
      art.colophon(c, s, st, env, st.ink, p.address.alpha);
    }
  };

  const ALL = { minimal: minimal, trading: trading, polaroid: polaroid, wanted: wanted, dating: dating, news: news };
  SC.styles = {
    get: function (id) { return ALL[id] || ALL[SC.DEFAULTS.style]; },
    all: ALL,
    polaroidRot: polaroidRot
  };
})();
