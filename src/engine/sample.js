// The three sample cards for "Try a sample" (PLAN.md 7.3). Fixed seeds, kinds, styles; golden is not forced.
//
//   SC.sample.load() -> Promise<[Card]>   cat in Trading, dog in Wanted, sleeping dog in Polaroid
//
// Photos are fetched from assets/sample/ (same site, nothing leaves the device). The folder is found from this script's own
// address (../../assets/sample/ from src/engine/), so it works from index.html and from tests/*.html. SC.sample.base overrides it.
// Uses SC.decode, SC.photo, SC.content and SC.card.create at run time only.
(function () {
  const SC = (globalThis.SC = globalThis.SC || {});

  let BASE = "assets/sample/";
  try {
    if (typeof document !== "undefined" && document.currentScript && document.currentScript.src) {
      BASE = document.currentScript.src.replace(/[^\/]*$/, "") + "../../assets/sample/";
    } else if (typeof document !== "undefined" && document.scripts) {
      for (let i = 0; i < document.scripts.length; i++) {
        const s = document.scripts[i].src || "";
        if (/\/sample\.js(\?|$)/.test(s)) { BASE = s.replace(/[^\/]*$/, "") + "../../assets/sample/"; break; }
      }
    }
  } catch (e) { /* keep the default */ }

  const WHEN = Date.UTC(2026, 9, 9, 12, 0, 0);   // fixed so the sample never changes day to day
  const SAMPLES = [
    { file: "cat.jpg",          kind: "cat", style: "trading",  seed: 7311, number: 1, place: "Old Town",  to: { name: "", reason: "" } },
    { file: "dog.jpg",          kind: "dog", style: "wanted",   seed: 2048, number: 2, place: "Main Road", to: { name: "", reason: "" } },
    { file: "dog-sleeping.jpg", kind: "dog", style: "polaroid", seed: 9127, number: 3, place: "The Park",  to: { name: "", reason: "" } }
  ];

  function fail(e) {
    if (typeof console !== "undefined" && e) console.error(e);
    return SC.util && SC.util.error ? SC.util.error("unreadable") : Object.assign(new Error("I couldn’t open that picture."), { code: "unreadable" });
  }

  async function one(s, base) {
    const res = await fetch(base + s.file);
    if (!res.ok) throw new Error("HTTP " + res.status + " for " + s.file);
    const blob = await res.blob();
    const imageData = await SC.decode.fileToImageData(blob);
    const photo = SC.photo.from(imageData);
    const crop = SC.photo.autoCrop(photo);
    const traits = SC.content.generate(s.kind, { seed: s.seed, recent: [], locale: "en-GB" });
    return SC.card.create({
      photo: photo, crop: crop, kind: s.kind, traits: traits, style: s.style, golden: false, seed: s.seed,
      number: s.number, place: s.place, to: { name: s.to.name, reason: s.to.reason }, when: WHEN
    });
  }

  async function load() {
    try {
      await (SC.text && SC.text.ready ? SC.text.ready() : null);
      const base = SC.sample.base || BASE;
      const cards = [];
      for (let i = 0; i < SAMPLES.length; i++) cards.push(await one(SAMPLES[i], base));   // one at a time: light on memory
      return cards;
    } catch (e) { throw fail(e); }
  }

  SC.sample = { load: load, base: null, _samples: SAMPLES };
})();
