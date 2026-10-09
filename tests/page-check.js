// Page check: headless Edge (DevTools protocol, no npm packages) against the running local server.
//   node tests/page-check.js [baseUrl] [sections]
// baseUrl: argument 1, or the SC_BASE environment variable, or http://localhost:8001
// sections: comma list of  dev, flow, outputs, binder, back, errors, real, tap   (default: all). Screenshots go to shots/join-<name>.png.
// Fails on any console error, uncaught exception or failed network request (the Vercel analytics script is the one allowed 404),
// and on missing window.__cutie fields. Never starts or stops a server; one Edge at a time; always closes Edge.
const fs = require("fs");
const path = require("path");
const { launch, sleep } = require("./cdp");

const BASE = (process.argv[2] && /^https?:/.test(process.argv[2]) ? process.argv[2] : (process.env.SC_BASE || "http://localhost:8001")).replace(/\/+$/, "");
const SECTIONS = (process.argv[3] || process.argv.filter(function (a) { return /^(dev|flow|outputs|binder|back|errors|real|tap)(,|$)/.test(a); })[0] || "dev,flow,outputs,binder,back,errors,real,tap").split(",");
const REAL = path.join(__dirname, "real");
const OUT = path.join(__dirname, "out");

let fails = 0;
function report(ok, label, extra) {
  if (!ok) fails += 1;
  console.log((ok ? "PASS " : "FAIL ") + label + (extra !== undefined && extra !== "" ? "  (" + extra + ")" : ""));
}
function note(s) { console.log("     " + s); }

// ---- in-page helpers (run inside the page) ----
const INPAGE = `
window.__nb = function (sel) {
  var c = document.querySelector(sel);
  if (!c || !c.width || !c.height) return { ok: false, why: "no canvas or 0x0", w: c && c.width, h: c && c.height };
  var x = c.getContext("2d"), w = c.width, h = c.height;
  var d = x.getImageData(0, 0, w, h).data, seen = 0, lo = 255, hi = 0, n = 0;
  for (var y = 0; y < h; y += Math.max(1, h >> 6)) for (var i = 0; i < w; i += Math.max(1, w >> 6)) {
    var o = (y * w + i) * 4; n++;
    if (d[o + 3] > 8) { seen++; var l = (d[o] * 3 + d[o + 1] * 6 + d[o + 2]) / 10; if (l < lo) lo = l; if (l > hi) hi = l; }
  }
  return { ok: seen > n * 0.5 && hi - lo > 25, w: w, h: h, painted: Math.round(seen / n * 100) + "%", range: Math.round(hi - lo) };
};
window.__hash = function (sel) {
  var c = document.querySelector(sel);
  if (!c || !c.width) return 0;
  var x = c.getContext("2d"), w = c.width, h = c.height, d = x.getImageData(0, 0, w, h).data, s = 0, k = 0;
  for (var y = 0; y < h; y += 3) for (var i = 0; i < w; i += 3) { var o = (y * w + i) * 4; s = (s * 31 + d[o] * 3 + d[o + 1] * 5 + d[o + 2] * 7 + (k++ % 13)) | 0; }
  return s;
};
window.__fakeShare = function () {
  window.__shared = [];
  navigator.canShare = function (d) { return !!(d && d.files && d.files.length); };
  navigator.share = function (d) { window.__shared.push({ name: d.files[0].name, size: d.files[0].size, type: d.files[0].type }); return Promise.resolve(); };
  return true;
};
true;
`;

async function after(b, label) {
  await sleep(150);
  const errs = b.errors.slice(), exc = b.exceptions.slice(), net = b.failedRequests.slice();
  report(errs.length === 0 && exc.length === 0, label + ": no console errors or exceptions", errs.concat(exc).slice(0, 3).join(" | "));
  report(net.length === 0, label + ": no failed requests", net.slice(0, 3).join(" | "));
  b.clear();
}
async function openUrl(b, qs) {
  await b.open(BASE + "/" + qs);
  await b.waitFor("document.readyState === 'complete'", 15);
  await b.eval(INPAGE);
}
const J = JSON.stringify;
const screenIs = function (name) { return "document.body.dataset.screen === " + J(name); };
async function cutie(b) {
  return b.eval("(function(){var c=window.__cutie;if(!c)return null;return {screen:c.screen,hasCard:!!c.card,settings:c.settings?{name:c.settings.traits&&c.settings.traits.name,style:c.settings.style,place:c.settings.place,to:c.settings.to,number:c.settings.number,kind:c.settings.kind,crop:c.settings.crop}:null,binderCount:c.binderCount,keys:Object.keys(c)};})()");
}
async function pickPhoto(b, file) {
  await b.setFiles("#fPick", [file]);
}
async function toResult(b, file, kind) {
  await pickPhoto(b, file);
  if (!(await b.waitFor(screenIs("kind"), 15))) return false;
  await b.clickEl('#tiles .tile[data-kind="' + kind + '"]');
  return b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 25);
}

// ---------------------------------------------------------------- dev screens (PLAN.md 7.4)
async function devScreens(b) {
  console.log("\n== dev screens (390x844)");
  await b.viewport(390, 844, 1);

  await openUrl(b, "");
  report(await b.waitFor(screenIs("landing"), 10), "/ opens the landing screen");
  const fanOk = await b.waitFor("window.__nb('#fan .f1 .cv-now').ok && window.__nb('#fan .f2 .cv-now').ok && window.__nb('#fan .f3 .cv-now').ok", 25);
  report(fanOk, "landing: the three sample cards are painted in the fan", J(await b.eval("window.__nb('#fan .f1 .cv-now')")));
  report((await b.eval("document.querySelectorAll('#screen-landing .site-footer .sib-card').length")) === 5, "landing: the footer shows the five siblings");
  const c0 = await cutie(b);
  report(!!c0 && c0.keys.join() === "screen,card,settings,binderCount", "window.__cutie has screen, card, settings, binderCount", c0 && c0.keys.join());
  await sleep(2800);   // one fan step
  await b.shot("join-landing.png");
  await after(b, "landing");

  // [name, query string, data-screen, canvas to check, needs a card]
  const screens = [
    ["kind", "screen=kind&reveal=0", "kind", "#kindPhoto", false],
    ["result", "sample=1&reveal=0", "result", "#resCard .cv-now", true],
    ["result-kind-dog-wanted", "screen=result&kind=dog&style=wanted&seed=5&reveal=0", "result", "#resCard .cv-now", true],
    ["result-golden", "screen=result&golden=1&style=minimal&seed=9&to=Priya&reason=twin&place=on%20a%20scooter%20seat", "result", "#resCard .cv-now", true],
    ["done", "screen=done&reveal=0", "done", "#doneMount .cv-now", true],
    ["adjust", "screen=adjust&reveal=0", "adjust", "#adjCanvas", true],
    ["edit", "screen=edit&reveal=0", "result", "#resCard .cv-now", true],
    ["frame-card", "screen=frame&format=card", "frame", "#frameCanvas", true],
    ["frame-story", "screen=frame&format=story", "frame", "#frameCanvas", true]
  ];
  for (const s of screens) {
    await openUrl(b, "?" + s[1]);
    const ok = await b.waitFor(screenIs(s[2]) + " && window.__nb(" + J(s[3]) + ").ok", 25);
    report(ok, "?" + s[1] + " -> " + s[2] + " screen with a painted canvas", ok ? "" : J(await b.eval("({screen:document.body.dataset.screen,nb:window.__nb(" + J(s[3]) + ")})")));
    if (s[4]) {
      const c = await cutie(b);
      report(!!c && c.hasCard && !!c.settings && !!c.settings.name && !!c.settings.style, s[0] + ": __cutie.card and __cutie.settings are set", c && c.settings && c.settings.name);
    }
    if (s[0] === "edit") {
      const open = await b.waitFor("document.getElementById('sheetEdit').classList.contains('is-on') && document.querySelectorAll('#editRows .erow').length > 2", 5);
      report(open, "edit: the sheet is open with a row per line", String(await b.eval("document.querySelectorAll('#editRows .erow').length")));
    }
    if (s[0] === "result-golden") {
      const c = await cutie(b);
      report(c.settings.to && c.settings.to.name === "Priya" && c.settings.to.reason === "twin" && c.settings.place === "on a scooter seat", "golden: &to, &reason and &place reach card.settings", J(c.settings));
    }
    if (s[0] === "result" || s[0] === "done" || s[0] === "adjust" || s[0] === "result-golden") {
      await sleep(500);
      await b.shot("join-dev-" + s[0] + ".png");
    }
    await after(b, s[0]);
  }

  // the three samples: ?sample=1 starts on the first sample card (the cat, Trading)
  await openUrl(b, "?sample=1&reveal=0");
  await b.waitFor(screenIs("result"), 20);
  const sc = await cutie(b);
  report(sc && sc.settings && sc.settings.style === "trading" && sc.settings.kind === "cat", "?sample=1 shows the cat sample in Trading", sc && J(sc.settings));
  await after(b, "sample=1");

  // the reveal itself (no reveal=0): kind -> reveal -> result, with a golden one
  for (const q of ["?screen=reveal", "?screen=reveal&golden=1"]) {
    await openUrl(b, q);
    const sawReveal = await b.waitFor(screenIs("reveal"), 15);
    const landed = await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 20);
    report(sawReveal && landed, q + ": the reveal plays and lands on the result", "reveal seen " + sawReveal);
    await after(b, q);
  }
  await openUrl(b, "?screen=reveal");
  await b.waitFor(screenIs("reveal"), 15);
  await sleep(2100);
  await b.shot("join-reveal.png");
  await b.waitFor(screenIs("result"), 20);
  await b.clear();

  for (const q of ["screen=error-not-image", "screen=error-heic", "screen=error-binder", "screen=binder"]) {
    await openUrl(b, "?" + q);
    const want = q === "screen=binder" ? "binder" : q === "screen=error-binder" ? "done" : "error";
    report(await b.waitFor(screenIs(want), 15), q + " -> " + want + " screen");
    await after(b, q);
  }
}

// ---------------------------------------------------------------- the whole flow in one session
const STYLES = ["minimal", "trading", "polaroid", "wanted", "dating", "news"];
async function flow(b, state) {
  console.log("\n== flow: landing -> photo -> kind -> result -> styles -> reroll -> edit -> who's for -> adjust -> send -> done");
  await b.viewport(390, 844, 1);
  await openUrl(b, "?reveal=0");
  report(await b.waitFor(screenIs("landing"), 10), "flow: landing");
  await b.eval("window.__fakeShare()");
  await pickPhoto(b, path.join(REAL, "01-cat-scooter-mumbai.jpg"));
  report(await b.waitFor(screenIs("kind") + " && window.__nb('#kindPhoto').ok", 15), "flow: the photo input opens the kind screen with the photo");
  await b.shot("join-kind.png");
  await b.clickEl('#tiles .tile[data-kind="cat"]');
  report(await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 25), "flow: the Cat tile lands on the result with a painted card", J(await b.eval("window.__nb('#resCard .cv-now')")));
  let c = await cutie(b);
  report(c && c.hasCard && c.settings && c.settings.kind === "cat" && c.settings.number >= 1, "flow: __cutie.card exists, kind cat, a number", c && J(c.settings));
  state.name0 = c.settings.name;
  await b.shot("join-result.png");

  // every style chip changes the picture
  let prev = await b.eval("window.__hash('#resCard .cv-now')");
  const seen = { [c.settings.style]: prev };
  for (const st of STYLES) {
    if (c.settings.style === st && Object.keys(seen).length === 1) continue;
    await b.clickEl('#styleChips .style-chip[data-style="' + st + '"]');
    const ok = await b.waitFor("window.__cutie.settings.style === " + J(st) + " && window.__hash('#resCard .cv-now') !== " + prev, 10);
    const h = await b.eval("window.__hash('#resCard .cv-now')");
    report(ok && window_nb(await b.eval("window.__nb('#resCard .cv-now')")), "flow: style chip " + st + " changes the card", ok ? "" : "hash unchanged");
    prev = h;
    await sleep(350);
  }
  // back to trading for the rest
  await b.clickEl('#styleChips .style-chip[data-style="trading"]');
  await b.waitFor("window.__cutie.settings.style === 'trading'", 5);
  await sleep(400);

  // reroll the name, then the personality
  const n0 = (await cutie(b)).settings.name;
  const h0 = await b.eval("window.__hash('#resCard .cv-now')");
  await b.clickEl("#toolName");
  const nameOk = await b.waitFor("window.__cutie.settings.traits.name !== " + J(n0), 8);
  c = await cutie(b);
  report(nameOk, "flow: New name changes the name", n0 + " -> " + c.settings.name);
  await sleep(400);
  const h1 = await b.eval("window.__hash('#resCard .cv-now')");
  report(h1 !== h0, "flow: and the card is redrawn");
  const t0 = await b.eval("JSON.stringify(window.__cutie.card.settings.traits)");
  await b.clickEl("#toolAll");
  const allOk = await b.waitFor("JSON.stringify(window.__cutie.card.settings.traits) !== " + J(t0), 8);
  const t1 = await b.eval("window.__cutie.card.settings.traits");
  const t0o = JSON.parse(t0);
  report(allOk && t1.name === t0o.name, "flow: New personality rerolls the lines and keeps the name", t1.name + " / " + t0o.name);

  // edit words: change the name and one line
  await b.clickEl("#toolEdit");
  report(await b.waitFor("document.getElementById('sheetEdit').classList.contains('is-on') && document.querySelectorAll('#editRows .erow').length > 2", 5), "flow: Edit words opens the sheet");
  await b.clickEl("#editRows .erow[data-id='name'] input");
  await b.eval("(function(){var i=document.querySelector(\"#editRows .erow[data-id='name'] input\");i.select();})()");
  await b.typeText("Larry Jr.");
  report(await b.waitFor("window.__cutie.settings.traits.name === 'Larry Jr.'", 6), "flow: typing in the edit sheet changes the name on the card", (await cutie(b)).settings.name);
  await b.eval("document.querySelector(\"#editRows .erow[data-id='name'] input\").blur()");
  await b.clickEl("#editRows .erow:nth-child(2) .die-btn");
  await sleep(300);
  await b.clickEl("#editDone");
  report(await b.waitFor("!document.getElementById('sheetEdit').classList.contains('is-on')", 5), "flow: Done closes the sheet");
  await sleep(600);   // the sheet slides away
  c = await cutie(b);
  report(c.settings.name === "Larry Jr.", "flow: the edited name survives a line reroll", c.settings.name);

  // where + who's for
  await b.clickEl("#inWhere");
  await b.typeText("on a scooter seat");
  const placeOk = await b.waitFor("window.__cutie.settings.place === 'on a scooter seat'", 5);
  report(placeOk, "flow: Where did you spot them -> card.settings.place", placeOk ? "" : await b.eval("JSON.stringify({v:document.getElementById('inWhere').value,ae:document.activeElement&&document.activeElement.id,place:window.__cutie.settings.place,screen:document.body.dataset.screen,sheet:document.getElementById('sheetEdit').className,inert:document.getElementById('app').hasAttribute('inert')})"));
  await b.clickEl("#inTo");
  await b.typeText("Priya");
  await b.eval("document.getElementById('inTo').blur()");
  await b.clickEl('#reasons .reason-chip[data-reason="twin"]');
  const toOk = await b.waitFor("(function(){var t=window.__cutie.settings.to;return t&&t.name==='Priya'&&t.reason==='twin';})()", 6);
  c = await cutie(b);
  report(toOk, "flow: Who's this for Priya + Found your twin -> card.settings.to", J(c.settings.to));
  await sleep(500);
  await b.eval("window.scrollTo(0,0)");
  await b.shot("join-result-personal.png");

  // adjust photo: drag and see the crop move
  const crop0 = c.settings.crop;
  await b.clickEl("#toolAdjust");
  report(await b.waitFor(screenIs("adjust") + " && window.__nb('#adjCanvas').ok", 10), "flow: Adjust photo opens the adjust screen");
  const r = await b.eval("(function(){var r=document.getElementById('adjCanvas').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()");
  await b.touchDrag([{ x: r.x, y: r.y }, { x: r.x - 20, y: r.y - 10 }, { x: r.x - 50, y: r.y - 25 }, { x: r.x - 70, y: r.y - 30 }]);
  await b.eval("(function(){var z=document.getElementById('adjZoom');z.value=Math.min(+z.max,+z.value+0.5);z.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await sleep(200);
  await b.shot("join-adjust.png");
  await b.clickEl("#adjDone");
  report(await b.waitFor(screenIs("result"), 8), "flow: Done returns to the result");
  await sleep(500);
  c = await cutie(b);
  report(crop0 && c.settings.crop && (Math.abs(c.settings.crop.zoom - crop0.zoom) > 0.05 || Math.abs(c.settings.crop.cx - crop0.cx) > 0.001), "flow: the crop changed after adjusting", J(crop0) + " -> " + J(c.settings.crop));
  state.final = c.settings;

  // send (the share sheet is faked): the file arrives, the card is kept, the done screen shows
  const total0 = await b.eval("SC.binder.stats().then(function(s){return s.total;})");
  await b.eval("window.scrollTo(0, document.body.scrollHeight)");
  await sleep(500);   // the 4:5 file is made 300 ms after the last change
  await b.clickEl("#btnSend");
  report(await b.waitFor(screenIs("done"), 15), "flow: Send ends on the done screen");
  const sh = await b.eval("window.__shared");
  report(sh && sh.length === 1 && sh[0].type === "image/jpeg" && /^spotted-a-cutie-larry-jr-\d{4}-\d\d-\d\d\.jpg$/.test(sh[0].name) && sh[0].size > 20000, "flow: the shared file is a JPEG named spotted-a-cutie-larry-jr-<date>.jpg", sh && J(sh));
  const total1 = await b.eval("SC.binder.stats().then(function(s){return s.total;})");
  report(total1 === total0 + 1, "flow: sending kept the card in the binder (total +1)", total0 + " -> " + total1);
  const title = await b.eval("document.getElementById('doneTitle').textContent + ' | ' + document.getElementById('doneHand').textContent");
  report(/in your binder/.test(title) && /Larry Jr\./.test(title), "flow: done says the name is in the binder", title);
  report(await b.waitFor("window.__nb('#doneMount .cv-now').ok", 5), "flow: the done screen shows the card");
  await sleep(700);
  await b.shot("join-done.png");
  // sending again from the same card does not duplicate it
  await b.clickEl("#doneStyle");
  await b.waitFor(screenIs("result"), 5);
  await sleep(500);
  await b.clickEl('#styleChips .style-chip[data-style="polaroid"]');
  await b.waitFor("window.__cutie.settings.style === 'polaroid'", 5);
  await sleep(500);
  await b.clickEl("#btnSave");
  report(await b.waitFor(screenIs("done"), 15), "flow: Save image ends on the done screen too");
  const total2 = await b.eval("SC.binder.stats().then(function(s){return s.total;})");
  report(total2 === total1, "flow: a second save of the same card updates it (no duplicate)", total1 + " -> " + total2);
  await after(b, "flow");
}
function window_nb(o) { return !!(o && o.ok); }

// ---------------------------------------------------------------- outputs (1080x1350 and 1080x1920)
async function outputs(b) {
  console.log("\n== outputs");
  await openUrl(b, "?sample=1&reveal=0&to=Priya&reason=twin");
  await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 25);
  for (const st of STYLES) {
    const r = await b.eval("(async function(){var card=window.__cutie.card;await card.update({style:" + J(st) + "});var f=await SC.export.image(card,'card');var bm=await createImageBitmap(f);return {type:f.type,size:f.size,w:bm.width,h:bm.height,name:f.name};})()");
    report(r.type === "image/jpeg" && r.w === 1080 && r.h === 1350 && r.size > 30000, "export.image card, " + st, r.type + " " + r.w + "x" + r.h + " " + Math.round(r.size / 1024) + " KB " + r.name);
  }
  const s = await b.eval("(async function(){var card=window.__cutie.card;var f=await SC.export.image(card,'story');var bm=await createImageBitmap(f);return {type:f.type,size:f.size,w:bm.width,h:bm.height,name:f.name};})()");
  report(s.type === "image/jpeg" && s.w === 1080 && s.h === 1920 && s.size > 30000 && /-story-/.test(s.name), "export.image story", s.type + " " + s.w + "x" + s.h + " " + Math.round(s.size / 1024) + " KB " + s.name);
  await after(b, "outputs");
}

// ---------------------------------------------------------------- binder: save, list, reopen, delete, numbers, reload
async function binder(b) {
  console.log("\n== binder");
  await openUrl(b, "?sample=1&reveal=0");
  await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 25);
  const before = await b.eval("SC.binder.stats()");
  const id = await b.eval("SC.binder.save(window.__cutie.card)");
  const afterS = await b.eval("SC.binder.stats()");
  report(typeof id === "string" && afterS.total === before.total + 1, "binder: save returns an id and total goes up by 1", before.total + " -> " + afterS.total);
  const list = await b.eval("SC.binder.list().then(function(l){return l.map(function(i){return {id:i.id,number:i.number,name:i.name,kind:i.kind,golden:i.golden,style:i.style,thumbUrl:typeof i.thumbUrl==='string'&&i.thumbUrl.length>5};});})");
  const mine = list.filter(function (i) { return i.id === id; })[0];
  report(!!mine && mine.thumbUrl && mine.name && mine.number >= 1, "binder: list has the card with name, number and a thumbUrl", mine && J(mine));
  const re = await b.eval("(async function(){var s=await SC.binder.get(" + J(id) + ");var c=await SC.card.fromSaved(s);var cv=c.render(0.5,'card');return {name:c.settings.traits.name,style:c.settings.style,number:c.settings.number,w:cv.width,h:cv.height,saved:s.traits.name};})()");
  report(re.name === re.saved && re.w === 540 && re.h === 675, "binder: SC.card.fromSaved reopens it and renders 540x675", J(re));
  await b.eval("SC.binder.remove(" + J(id) + ")");
  const gone = await b.eval("SC.binder.stats()");
  report(gone.total === before.total, "binder: remove puts the total back", String(gone.total));
  report(gone.nextNumber > afterS.nextNumber - 1 && gone.nextNumber >= (list.filter(function (i) { return i.id === id; })[0].number + 1), "binder: the number of a removed card is not reused", "nextNumber " + gone.nextNumber + " (card was #" + mine.number + ")");
  await after(b, "binder api");

  // the UI side: state left by the flow section (two saves of one card -> one card in the binder)
  await openUrl(b, "?screen=binder");
  report(await b.waitFor(screenIs("binder"), 10), "binder: ?screen=binder opens the binder");
  const full = await b.waitFor("document.querySelectorAll('#albumGrid .slot[data-id]').length >= 1", 10);
  report(full, "binder: the flow's card is still there after a reload (persisted)", String(await b.eval("document.querySelectorAll('#albumGrid .slot[data-id]').length")));
  const loaded = await b.waitFor("(function(){var i=document.querySelector('#albumGrid .slot[data-id] img');return !!(i&&i.complete&&i.naturalWidth>0);})()", 10);
  report(loaded, "binder: the thumbnail image loads");
  await sleep(500);
  await b.shot("join-binder.png");
  const head = await b.eval("document.getElementById('bindTitle').textContent + ' | ' + document.getElementById('bindCounts').textContent");
  report(/cutie/.test(head), "binder: the header counts the cuties", head);
  // reopen from the grid, check it is the same card, then delete with the confirm
  const slotName = await b.eval("document.querySelector('#albumGrid .slot[data-id] .cap b').textContent");
  await b.clickEl("#albumGrid .slot[data-id]");
  report(await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 15), "binder: tapping a card reopens it on the result screen");
  const c = await cutie(b);
  report(c.settings.name === slotName, "binder: the reopened card has the saved name", c.settings.name + " / " + slotName);
  report(await b.eval("!document.getElementById('delRow').hidden"), "binder: the opened card shows Delete");
  await b.clickEl("#btnDelete");
  report(await b.waitFor("document.getElementById('sheetConfirm').classList.contains('is-on')", 5), "binder: Delete asks to confirm");
  await sleep(600);   // the sheet slides up
  await b.clickEl("#confirmYes");
  report(await b.waitFor(screenIs("binder") + " && document.querySelectorAll('#albumGrid .slot[data-id]').length === 0", 10), "binder: confirmed delete returns to an empty binder");
  const st = await b.eval("SC.binder.stats()");
  report(st.total === 0 && st.nextNumber >= 2, "binder: stats are empty but the next number moved on (never reused)", J(st));
  await after(b, "binder ui");
  // landing: no binder link when empty
  await openUrl(b, "");
  await b.waitFor(screenIs("landing"), 10);
  await sleep(600);
  report(await b.eval("document.getElementById('lnkBinder').hidden"), "binder: the landing hides My cuties when the binder is empty");
  await after(b, "landing after delete");
}

// ---------------------------------------------------------------- the back button
async function back(b) {
  console.log("\n== back button (history)");
  await openUrl(b, "?reveal=0");
  await b.waitFor(screenIs("landing"), 10);
  const len0 = await b.eval("history.length");
  const ok = await toResult(b, path.join(REAL, "03-cat-tabby-west-bengal.jpg"), "cat");
  report(ok, "back: got to the result");
  await b.eval("history.back()");
  report(await b.waitFor(screenIs("kind"), 5), "back: Back from the result goes to the kind screen");
  await b.eval("history.back()");
  report(await b.waitFor(screenIs("landing"), 5), "back: Back from the kind screen goes to the landing");
  report((await b.eval("location.pathname + location.search")) === "/?reveal=0", "back: and we are still on the site", await b.eval("location.href"));
  // result -> adjust -> back -> result; result -> done -> back -> result
  await b.eval("history.forward()");
  await b.waitFor(screenIs("kind"), 5);
  await b.eval("history.forward()");
  await b.waitFor(screenIs("result"), 8);
  await sleep(500);
  await b.clickEl("#toolAdjust");
  await b.waitFor(screenIs("adjust"), 8);
  await b.eval("history.back()");
  report(await b.waitFor(screenIs("result"), 5), "back: Back from Adjust goes to the result");
  await b.eval("document.getElementById('toolEdit').click()");
  await b.waitFor("document.getElementById('sheetEdit').classList.contains('is-on')", 5);
  await b.eval("history.back()");
  report(await b.waitFor(screenIs("kind") + " && !document.getElementById('sheetEdit').classList.contains('is-on')", 5), "back: Back with the edit sheet open closes it and leaves the result");
  // the in-page buttons keep the history tidy: Spot another cutie goes home with no stray entries
  await b.eval("history.forward()");
  await b.waitFor(screenIs("result"), 8);
  await sleep(300);
  await b.eval("window.__fakeShare()");
  await sleep(500);
  await b.clickEl("#btnSave");
  report(await b.waitFor(screenIs("done"), 15), "back: Save reaches the done screen");
  await b.eval("history.back()");
  report(await b.waitFor(screenIs("result"), 5), "back: Back from done goes to the result");
  await sleep(500);
  await b.clickEl("#btnSave");
  await b.waitFor(screenIs("done"), 15);
  await sleep(800);   // the card drops onto the page
  await b.clickEl("#doneNew");
  report(await b.waitFor(screenIs("landing"), 8), "back: Spot another cutie goes to the landing");
  await sleep(300);
  report((await b.eval("document.body.dataset.screen")) === "landing" && (await b.eval("location.pathname")) === "/", "back: still on the site after the buttons' history moves");
  await b.eval("history.back()");
  await sleep(500);
  report((await b.eval("location.host")).length > 0 && (await b.eval("location.pathname")) === "/", "back: one more Back from the landing stays inside the site's own entries (no trapped extra entries)", "history.length " + len0 + " -> " + (await b.eval("history.length")));
  await after(b, "back");
  // clean up what this section saved
  await b.eval("SC.binder.list().then(function(l){return Promise.all(l.map(function(i){return SC.binder.remove(i.id);}));})");
}

// ---------------------------------------------------------------- errors
async function errors(b) {
  console.log("\n== errors");
  fs.mkdirSync(OUT, { recursive: true });
  const txt = path.join(OUT, "not-a-photo.txt");
  fs.writeFileSync(txt, "this is not a picture\n");
  await openUrl(b, "?reveal=0");
  await b.waitFor(screenIs("landing"), 10);
  await b.setFiles("#fPick", [txt]);
  report(await b.waitFor(screenIs("error"), 10), "errors: a .txt file shows the error screen");
  const t = await b.eval("document.getElementById('errTitle').textContent + ' | ' + document.getElementById('errDetail').textContent + ' | ' + document.querySelector('#errBtn .lbl').textContent");
  report(/photo|picture/i.test(t) && !/undefined|\[object/.test(t), "errors: the not-image message is friendly", t);
  await b.shot("join-error.png");
  // the same input still takes a photo afterwards
  const ok = await toResult(b, path.join(REAL, "02-cat-street-mumbai.jpg"), "cat");
  report(ok, "errors: a real photo works right after the error");
  // a tiny broken 'jpg'
  const bad = path.join(OUT, "broken.jpg");
  fs.writeFileSync(bad, Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]));
  await openUrl(b, "?reveal=0");
  await b.waitFor(screenIs("landing"), 10);
  await b.setFiles("#fPick", [bad]);
  report(await b.waitFor(screenIs("error"), 10), "errors: a broken jpg shows the error screen");
  const errs = b.errors.filter(function (e) { return !/Failed to load resource|decode|image|broken|InvalidState/i.test(e); });
  report(b.exceptions.length === 0 && errs.length === 0, "errors: no uncaught exceptions from the bad files", b.exceptions.concat(errs).slice(0, 2).join(" | "));
  b.clear();
}

// ---------------------------------------------------------------- every real photo through the real flow
const REAL_KINDS = { "01": "cat", "02": "cat", "03": "cat", "04": "dog", "05": "dog", "06": "pigeon", "07": "crow", "08": "cow" };
async function real(b) {
  console.log("\n== every real photo");
  const files = fs.readdirSync(REAL).filter(function (f) { return /\.jpe?g$/i.test(f); }).sort();
  for (const f of files) {
    await openUrl(b, "?reveal=0");
    await b.waitFor(screenIs("landing"), 10);
    const kind = REAL_KINDS[f.slice(0, 2)] || "mystery";
    const t0 = Date.now();
    const ok = await toResult(b, path.join(REAL, f), kind);
    const ms = Date.now() - t0;
    const c = await cutie(b);
    report(ok && c && c.hasCard && c.settings.kind === kind, "real: " + f + " as " + kind + " -> a card", ms + " ms");
    if (f.indexOf("06-") === 0) { await sleep(400); await b.shot("join-real-pigeon.png"); }
    await after(b, f);
  }
}


// ---------------------------------------------------------------- tap-to-centre on the kind print (photo 06, the far-away pigeon)
async function tap(b) {
  console.log("\n== tap to centre (kind print -> crop -> Adjust zoom)");
  const points = [[0.5, 0.5], [0.35, 0.62], [0.62, 0.4]];
  for (const pt of points) {
    await openUrl(b, "?reveal=0");
    await b.waitFor(screenIs("landing"), 10);
    await pickPhoto(b, path.join(REAL, "06-pigeon-balcony-taxila.jpg"));
    await b.waitFor(screenIs("kind") + " && window.__nb('#kindPhoto').ok", 15);
    await sleep(400);
    // real click at a point of the print; the print is tilted -3deg about its centre
    const xy = await b.eval("(function(){var cv=document.getElementById('kindPhoto'),r=cv.getBoundingClientRect(),w=cv.offsetWidth,h=cv.offsetHeight;var dx=(" + pt[0] + "-0.5)*w,dy=(" + pt[1] + "-0.5)*h,a=-3*Math.PI/180;return {x:r.left+r.width/2+dx*Math.cos(a)-dy*Math.sin(a),y:r.top+r.height/2+dx*Math.sin(a)+dy*Math.cos(a)};})()");
    await b.click(xy.x, xy.y);
    await sleep(300);
    await b.clickEl('#tiles .tile[data-kind="pigeon"]');
    await b.waitFor(screenIs("result") + " && window.__nb('#resCard .cv-now').ok", 25);
    // expected: the photo point under the tap in the print drawn from the auto-crop (clamped to the print's own 4:5)
    const exp = await b.eval("(function(){var ph=window.__cutie.card.photo,c=SC.photo.clampCrop(ph,SC.photo.autoCrop(ph),0.8),r=SC.photo.region(ph,c,0.8);return {x:(r.sx+" + pt[0] + "*r.sw)/ph.width,y:(r.sy+" + pt[1] + "*r.sh)/ph.height};})()");
    let c = await cutie(b);
    let cr = c.settings.crop;
    const near = function (cr2) { return Math.abs(cr2.cx - exp.x) <= 0.03 && Math.abs(cr2.cy - exp.y) <= 0.03; };
    report(near(cr), "tap " + J(pt) + ": crop centre is within 3% of the tapped photo point", "tapped " + exp.x.toFixed(3) + "," + exp.y.toFixed(3) + " crop " + cr.cx.toFixed(3) + "," + cr.cy.toFixed(3) + " zoom " + cr.zoom.toFixed(2));
    await sleep(400);
    await b.clickEl("#toolAdjust");
    await b.waitFor(screenIs("adjust") + " && window.__nb('#adjCanvas').ok", 10);
    await b.eval("(function(){var z=document.getElementById('adjZoom');z.value=4;z.dispatchEvent(new Event('input',{bubbles:true}));})()");
    await sleep(200);
    if (pt[0] === 0.5) await b.shot("join-tap-adjust-z4.png");
    await b.clickEl("#adjDone");
    await b.waitFor(screenIs("result"), 8);
    await sleep(500);
    c = await cutie(b); cr = c.settings.crop;
    report(Math.abs(cr.zoom - 4) < 0.05 && near(cr), "tap " + J(pt) + ": after Adjust zoom 4 the centre is still within 3%", "crop " + cr.cx.toFixed(3) + "," + cr.cy.toFixed(3) + " zoom " + cr.zoom.toFixed(2));
  }
  await after(b, "tap");
}

// ---------------------------------------------------------------- run
(async function () {
  let b = null;
  const timer = setTimeout(function () { console.log("FAIL the page check ran for more than 8 minutes"); process.exit(1); }, 8 * 60 * 1000);
  try {
    try { const r = await fetch(BASE + "/index.html"); if (!r.ok) throw new Error("HTTP " + r.status); }
    catch (e) { console.log("The local server at " + BASE + " is not answering (" + e.message + "). Ask for it to be started; this check never starts one."); process.exit(2); }
    b = await launch({ width: 390, height: 844, dpr: 1 });
    const state = {};
    for (const sct of SECTIONS) {
      try {
        if (sct === "dev") await devScreens(b);
        else if (sct === "flow") await flow(b, state);
        else if (sct === "outputs") await outputs(b);
        else if (sct === "binder") await binder(b);
        else if (sct === "back") await back(b);
        else if (sct === "errors") await errors(b);
        else if (sct === "real") await real(b);
        else if (sct === "tap") await tap(b);
      } catch (e) {
        report(false, "section " + sct + " crashed", (e && e.message) || String(e));
      }
    }
  } catch (e) {
    report(false, "page check crashed", (e && e.message) || String(e));
  } finally {
    clearTimeout(timer);
    if (b) await b.close();
  }
  console.log(fails === 0 ? "\nPAGE CHECK: PASS" : "\nPAGE CHECK: FAIL (" + fails + ")");
  process.exit(fails === 0 ? 0 : 1);
})();
