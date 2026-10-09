// Image out. Pattern from ../shared-kit/engine/export.js (blob from canvas, File, fileName), no video, no muxer.
//
//   SC.export.image(card, format)             -> Promise<File>   JPEG q0.92; format "card" (1080x1350) | "story" (1080x1920); via card.render(1, format)
//   SC.export.fileName(card, format, date?)   -> "spotted-a-cutie-<name>-<YYYY-MM-DD>.jpg"  /  "spotted-a-cutie-<name>-story-<YYYY-MM-DD>.jpg"
//                                                name = lower case a-z 0-9 hyphens, empty -> "cutie". date (a Date) is for tests.
// Errors: "export-failed" (Error with {code, title, detail}).
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  function makeError(code) {
    if (SC.util && SC.util.error) return SC.util.error(code);
    const e = new Error("That didn’t work.");
    e.code = code; e.title = "That didn’t work."; e.detail = "Please try again. You can still save the picture.";
    return e;
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dayOf(d) { d = d || new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function slug(s) { // lower case, a-z 0-9 and hyphens, at most 40 characters
    s = String(s === undefined || s === null ? "" : s);
    try { s = s.normalize("NFKD").replace(/[̀-ͯ]/g, ""); } catch (e) { /* keep as is */ }
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");
  }
  function nameOf(card) {
    try {
      const s = (card && card.settings) || (card && typeof card.data === "function" ? card.data() : null) || {};
      return s.traits && s.traits.name;
    } catch (e) { return ""; }
  }

  function fileName(card, format, date) {
    const n = slug(nameOf(card)) || "cutie";
    return "spotted-a-cutie-" + n + (format === "story" ? "-story" : "") + "-" + dayOf(date) + ".jpg";
  }

  function canvasToBlob(canvas, quality) {
    return new Promise(function (res) {
      if (canvas.toBlob) canvas.toBlob(res, "image/jpeg", quality);
      else if (canvas.convertToBlob) canvas.convertToBlob({ type: "image/jpeg", quality: quality }).then(res, function () { res(null); });
      else res(null);
    });
  }

  async function image(card, format) {
    try {
      format = format === "story" ? "story" : "card";
      if (!card || typeof card.render !== "function") throw new Error("no card");
      const canvas = card.render(1, format);
      if (!canvas) throw new Error("render gave nothing");
      const blob = await canvasToBlob(canvas, 0.92);
      if (!blob) throw new Error("toBlob gave nothing");
      return new File([blob], fileName(card, format), { type: "image/jpeg" });
    } catch (e) {
      if (typeof console !== "undefined" && e) console.error(e);
      throw makeError("export-failed");
    }
  }

  SC.export = { image: image, fileName: fileName, _slug: slug };
})();
