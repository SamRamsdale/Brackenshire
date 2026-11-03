// ---- boot ----
// ================= TITLE / INTRO / LOOP =================
const TITLE = { i: 0 };
function titleItems() { const s = bestSave(); return s ? ['Continue', 'New Game'] : ['New Game']; }
function updateTitle() {
  if (G.lock) return;
  const it = titleItems();
  if (TITLE.i >= it.length) TITLE.i = 0;
  if (dirPressed('up') || dirPressed('down')) { TITLE.i = (TITLE.i + 1) % it.length; sfx('blip'); }
  if (A()) {
    sfx('select');
    const k = it[TITLE.i];
    G.lock++;
    (async () => {
      try {
        if (k === 'Continue') { await fadeOut(400); restore(bestSave()); await fadeIn(400); }
        else {
          if (bestSave() && !(await ask('Start a new game? Your old save will be replaced the next time you save.'))) return;
          await newGame();
        }
      } finally { G.lock--; }
    })();
  }
}
let TITLEBG = null;
function drawTitle() {
  if (!TITLEBG) { const [c, x] = mk(W, H); const { p, r } = pctx(x);
    const pal = ['#0c1230', '#141c40', '#1e2750', '#2a2f5c', '#3a3566', '#4a3a6a', '#5a4270'];
    for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) { const t = y / 150 * 6 + ((X + y) & 1 ? .25 : -.25); p(X, y, pal[Math.max(0, Math.min(6, Math.floor(t)))]); }
    for (let Y = 0; Y < 24; Y++) for (let X = 0; X < 24; X++) { const d = (X - 12) ** 2 + (Y - 12) ** 2, d2 = (X - 17) ** 2 + (Y - 8) ** 2; if (d < 100 && d2 > 70) p(218 + X, 64 + Y, d < 50 ? '#fff4d8' : '#e8dab4'); else if (d < 150 && d2 > 70 && (X + Y) % 2) p(218 + X, 64 + Y, '#2e3868'); }
    for (let X = 0; X < W; X++) { const h = 40 + Math.sin(X / 40) * 10 + Math.sin(X / 13) * 3; r(X, Math.round(H - h - 18), 1, Math.ceil(h + 18), '#1c2240'); p(X, Math.round(H - h - 18), '#2a3258'); }
    for (let X = 0; X < W; X++) { const h = 24 + Math.sin(X / 25 + 2) * 6 + Math.sin(X / 7) * 1.5; r(X, Math.round(H - h), 1, Math.ceil(h), '#11152a'); }
    TITLEBG = c; }
  blit(TITLEBG, 0, 0);
  for (let i = 0; i < 50; i++) { if (Math.sin(NOW / 400 + i * 1.7) > .3) R((i * 71) % W, (i * 29) % 110, 1, 1, i % 4 ? '#c8d0f0' : '#fff4d0'); }
  const glow = .5 + Math.sin(NOW / 700) * .5;
  [[60, 142, 1], [84, 138, 1.2], [110, 136, 1.3], [146, 136, 1.3], [172, 138, 1.2], [196, 142, 1]].forEach(([x, y, sc]) => {
    const w = Math.round(8 * sc), h = Math.round(22 * sc), X = Math.round(x - w / 2), Y = y - h;
    R(X, Y + 1, w, h - 1, '#0a0d1a'); R(X + 1, Y, w - 2, 1, '#0a0d1a'); R(X + 1, Y + 1, 1, h - 2, '#262c48');
    R(x - 1, Y + 6, 2, 2, `rgba(122,255,224,${glow})`); R(x - 1, Y + 12, 2, 2, `rgba(122,255,224,${glow * .7})`);
    R(x - 3, y, 6, 1, `rgba(122,255,224,${glow * .25})`);
  });
  txtOutline('BRACKENSHIRE', 128, 22, '#fff0c8', '#2a1238', 16, 'center', '#f0b868');
  txt('A Beastie Adventure', 128, 54, '#c8b4e8', '#1a1030', 8, 'center');
  const it = titleItems();
  it.forEach((s, i) => {
    const y = 152 + i * 14, sel = i === TITLE.i;
    hot(78, y - 3, 100, 14, () => { TITLE.i = i; });
    txt(s, 128, y, sel ? '#fff4c8' : '#8a90b0', '#10101c', 8, 'center');
    if (sel) { const x = 128 - tw(s) / 2 - 10 - (Math.floor(NOW / 300) % 2); R(x, y + 1, 2, 7, '#fff4c8'); R(x + 2, y + 2, 1, 5, '#fff4c8'); R(x + 3, y + 3, 1, 3, '#fff4c8'); }
  });
  const sv = bestSave();
  if (sv && it[TITLE.i] === 'Continue') { const pt = Math.floor((sv.playtime || 0) / 60000); txt(`${sv.name} · ${Object.keys(sv.caught || {}).length} caught · ${Math.floor(pt / 60)}h${String(pt % 60).padStart(2, '0')}`, 128, 181, '#6a7090', null, 7, 'center'); }
  else txt('Press Z', 128, 181, Math.floor(NOW / 600) % 2 ? '#8a90b0' : '#5a6080', null, 7, 'center');
}
let INTRO = null;
async function newGame() {
  await fadeOut(400);
  Object.assign(G, { name: 'Sam', party: [], box: [], bag: {}, money: 3000, flags: {}, seen: {}, caught: {}, playtime: 0, lastHeal: { map: 'home', x: 6, y: 5 } });
  G.scene = 'intro'; INTRO = { t: NOW }; playMusic('title');
  await fadeIn(500);
  await say(['Hello there! Welcome to the county of Brackenshire!', 'My name is Hawthorn, but everyone round here just calls me the Prof.',
    "Brackenshire's hedgerows, rivers and moors are home to all sorts of wild creatures. We call them Beasties!",
    'Some folk keep them as companions. Others train them for battle. Me? I study them... and the old standing stones they seem so fond of.',
    'And you must be Sam, from down the lane in Hollowmere!', 'Your very own adventure is about to begin. A county full of Beasties is waiting for you. Off we go!']);
  await fadeOut(500);
  G.flags.intro = 1; G.scene = 'world'; loadMap('home', 7, 3, 'down');
  await fadeIn(500);
  saveGame(true);
}
function drawIntro() {
  for (let y = 0; y < H; y += 2) R(0, y, W, 2, mix('#3a5a7a', '#8ab0c0', Math.floor(y / H * 8) / 8));
  pell(128, 99, 44, 9, '#3e5e4e'); pell(128, 98, 40, 7, '#4e7058');
  blitPerson(LOOKS.prof, 128, 96, 48, 66);
}

// ================= RENDER + LOOP =================
function render() {
  HOT.length = 0;
  ctx.save();
  if (SHAKE > 0) { ctx.translate((SHAKE % 2 ? 2 : -2) * P, 0); SHAKE--; }
  if (G.scene === 'world') { drawWorld(); if (G.map.decor) { const [cx, cy] = camera(); G.map.decor(cx, cy); } drawBanner(); }
  else if (G.scene === 'battle' && BT) drawBattle();
  else if (G.scene === 'evo' && EVO) drawEvo();
  else if (G.scene === 'title') drawTitle();
  else if (G.scene === 'intro') drawIntro();
  else R(0, 0, W, H, '#000');
  ctx.restore();
  for (const u of UI) { HOTOWNER = u; u.draw(); } HOTOWNER = null;
  if (WIPE > 0) for (let i = 0; i < 12; i++) { const k = Math.max(0, Math.min(1, WIPE * 1.7 - i * .06)), w = Math.ceil(W * ease(k)); if (i % 2) R(0, i * 16, w, 16, '#000'); else R(W - w, i * 16, w, 16, '#000'); if (k > 0 && k < 1) R(i % 2 ? w - 2 : W - w, i * 16, 2, 16, '#fff'); }
  if (FADE > 0) { ctx.fillStyle = `rgba(0,0,0,${FADE})`; ctx.fillRect(0, 0, W * P, H * P); }
}
let lastT = performance.now(), clockT = 0;
function loop(t) {
  const dt = Math.min(50, t - lastT); lastT = t; NOW += dt;
  if (G.scene === 'world' || G.scene === 'battle') G.playtime += dt;
  try {
    runTasks();
    if (pressed.mute) { setSound(!soundOn); G.opts.sound = soundOn; }
    mouseStep();
    if (UI.length) UI[UI.length - 1].update();
    else if (G.scene === 'world') updateWorld(dt);
    else if (G.scene === 'title') updateTitle();
    if (G.scene === 'world' && G.pl) updateEntities(dt);
    render();
  } catch (e) { console.error(e); }
  clearPressed();
  if (NOW - clockT > 1000) { clockT = NOW; const el = document.getElementById('clock'); if (el) el.textContent = G.scene === 'world' && G.map ? `${G.map.name} · ${timeName()}` : ''; }
  requestAnimationFrame(loop);
}
// focus handling: keyboard needs the page focused
const focusBtn = document.getElementById('focus');
function showFocus(v) { focusBtn.hidden = !v; }
focusBtn.addEventListener('click', () => { showFocus(false); cv.focus(); audioInit(); });
cv.addEventListener('pointerdown', () => { showFocus(false); cv.focus(); audioInit(); });
window.addEventListener('keydown', () => showFocus(false));
window.addEventListener('blur', () => showFocus(true));
if (!document.hasFocus()) showFocus(true);
// boot (keeps your place when the page is updated while open)
function start(data) {
  try { if (data && data.save) restore(data.save); } catch (e) { G.scene = 'title'; }
  playMusic(G.scene === 'title' ? 'title' : G.map.music);
  requestAnimationFrame(loop);
}
window.claude?.hot?.snapshot?.(() => ({ save: G.scene === 'world' && G.flags.intro && !UI.length ? serialize() : null }));
const startWhenLoaded = d => loadAssets().then(() => { start(d); window.__ready = true; });
window.claude?.hot?.ready ? window.claude.hot.ready(startWhenLoaded) : startWhenLoaded(window.claude?.hot?.data ?? {});