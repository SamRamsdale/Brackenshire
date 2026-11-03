// ---- hd ----

// ================= HD ART LAYER =================
// Art made from the SpriteCook template set replaces the code-drawn art wherever a template exists; anything
// without one falls back to the code-drawn version, so the game always runs. A canvas with .hd = 2 holds art
// at twice the game's pixel density (two art pixels per game pixel); blit() and lw()/lh() account for it.
const IMG = {};
function loadAssets() {
  return Promise.all(Object.entries(ASSET_SRC).map(([k, [den, b64]]) => new Promise(res => {
    const im = new Image();
    im.onload = () => { const [c, x] = mk(im.width, im.height); x.drawImage(im, 0, 0); c.hd = den; IMG[k] = c; res(); };
    im.onerror = () => res();
    im.src = 'data:image/png;base64,' + b64;
  })));
}
const lw = c => c.width / (c.hd || 1), lh = c => c.height / (c.hd || 1);
function mkHD(w, h) { const [c, x] = mk(w, h); c.hd = 2; return [c, x]; }
// per-pixel recolour of a sprite: fn(r, g, b) -> [r, g, b] or null to keep
function recolour(src, fn) {
  const [c, x] = mk(src.width, src.height); c.hd = src.hd; x.drawImage(src, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), a = d.data;
  for (let i = 0; i < a.length; i += 4) { if (!a[i + 3]) continue; const o = fn(a[i], a[i + 1], a[i + 2], (i / 4) % c.width, Math.floor(i / 4 / c.width)); if (o) { a[i] = o[0]; a[i + 1] = o[1]; a[i + 2] = o[2]; } }
  x.putImageData(d, 0, 0); return c;
}
function flipped(src) { const [c, x] = mk(src.width, src.height); c.hd = src.hd; x.translate(src.width, 0); x.scale(-1, 1); x.drawImage(src, 0, 0); return c; }
// move a sprite's hue to that of a target colour, keeping its shading (used for roofs, heather, shinies)
function toHue(src, target, test) {
  const [th, ts] = rgb2hsl(...h2r(target));
  return recolour(src, (r, g, b, X, Y) => { const [h, s, l] = rgb2hsl(r, g, b); if (!test(h * 360, s, l, X, Y)) return null; return hsl2rgb(th, Math.min(1, s * (ts / .55)), l); });
}

// ---------- Beasties: template sprites for the species that have them ----------
const creatureSprite1x = creatureSprite;
creatureSprite = function (id, N, o = {}) {
  let src = IMG['b_' + id + (o.back ? '_b' : '_f')];
  if (!src && o.back && IMG['b_' + id + '_f']) src = IMG['b_' + id + '_fm'] || (IMG['b_' + id + '_fm'] = flipped(IMG['b_' + id + '_f']));   // no back art yet: face the foe instead
  if (!src) return creatureSprite1x(id, N, o);
  const key = 'I' + id + '|' + N + '|' + (o.back ? 1 : 0) + (o.shiny ? 1 : 0) + (o.sil ? 1 : 0) + (o.hd ? 1 : 0);
  if (SPR[key]) return SPR[key];
  const M = o.hd ? N * 2 : N, pad = Math.round(M * .05);
  const sc = Math.min(1, (M - pad) / src.height, M / src.width);
  const w = Math.round(src.width * sc), h = Math.round(src.height * sc);
  const [c, x] = mk(M, M); if (o.hd) c.hd = 2;
  x.imageSmoothingEnabled = sc < 1; x.imageSmoothingQuality = 'high';
  x.drawImage(src, 0, 0, src.width, src.height, Math.round((M - w) / 2), M - pad - h, w, h);
  const d = x.getImageData(0, 0, M, M), a = d.data, sh = (SPECIES[id].sh || 150) / 360;
  for (let i = 0; i < a.length; i += 4) {
    if (a[i + 3] < 140) { a[i + 3] = 0; continue; }
    a[i + 3] = 255;
    if (o.sil) { a[i] = 22; a[i + 1] = 20; a[i + 2] = 34; }
    else if (o.shiny && Math.max(a[i], a[i + 1], a[i + 2]) - Math.min(a[i], a[i + 1], a[i + 2]) > 70) { const [hh, s, l] = rgb2hsl(a[i], a[i + 1], a[i + 2]); const q = hsl2rgb((hh + sh + 1) % 1, s, l); a[i] = q[0]; a[i + 1] = q[1]; a[i + 2] = q[2]; }
  }
  x.putImageData(d, 0, 0);
  return SPR[key] = c;
};

// ---------- Ground: double-density tiles in the template palette ----------
const HG = { base: '#7f9c2b', dk: '#6f8c27', lt: '#92ae37', dk2: '#56751f' };
Object.assign(GR, { base: HG.base, dk: HG.dk, lt: HG.lt });           // code-drawn tiles that sit on grass now match
Object.assign(MOORGR, { base: '#7b8838', dk: '#66742c', lt: '#929f48' });
Object.assign(TALL, { base: '#5c8226', d: '#2c4c16', l: '#9ab82e', m: '#6c962a' });
const hdPal = gk => { const p = groundPal(gk); return { base: p.base, dk: p.dk, lt: p.lt, dk2: dk(p.dk, .22) }; };
function hdGrass(x, v, pal = HG, seed = 0) {
  const p = (X, Y, c) => { x.fillStyle = c; x.fillRect(X, Y, 1, 1); };
  x.fillStyle = pal.base; x.fillRect(0, 0, 32, 32);
  for (let i = 0; i < 22; i++) { const X = Math.floor(hash(v + seed, i, 21) * 31), Y = Math.floor(hash(i, v + seed, 23) * 32); x.fillStyle = i % 3 ? pal.dk : pal.lt; x.fillRect(X, Y, i % 4 === 0 ? 2 : 1, 1); }
  for (let i = 0; i < 3; i++) { // little blade tufts
    const X = 3 + Math.floor(hash(v + seed, i, 31) * 24), Y = 5 + Math.floor(hash(i, v + seed, 33) * 22);
    p(X, Y + 1, pal.dk2); p(X + 1, Y, pal.dk2); p(X + 1, Y + 1, pal.dk); p(X + 2, Y - 1, pal.lt); p(X + 2, Y, pal.dk2); p(X + 3, Y + 1, pal.dk2); p(X + 4, Y, pal.dk);
  }
  if (v === 3 && pal === HG) { const X = 20, Y = 9; p(X, Y - 1, '#f6f4e4'); p(X - 1, Y, '#f6f4e4'); p(X + 1, Y, '#f6f4e4'); p(X, Y + 1, '#e2e0cc'); p(X, Y, '#e8c84a'); p(X, Y + 2, pal.dk2); }
}
// which pixels of a 32px edge tile belong to the surrounding land (same rules as landAt, twice as fine)
const WOB2 = Array.from({ length: 32 }, (_, i) => Math.round(4.6 + 1.3 * Math.sin(i * Math.PI / 8) + .8 * Math.sin(i * Math.PI * 3 / 16 + 1)));
function landAtHD(mask, px, py) {
  const N = mask & 1, E = mask & 2, S = mask & 4, Wd = mask & 8;
  if (px < 0) return !Wd; if (px > 31) return !E; if (py < 0) return !N; if (py > 31) return !S;
  if (!N && py < WOB2[px]) return true; if (!S && py > 31 - WOB2[(px + 10) % 32]) return true;
  if (!Wd && px < WOB2[(py + 6) % 32]) return true; if (!E && px > 31 - WOB2[(py + 18) % 32]) return true;
  const rc = (cx, cy) => (px + .5 - cx) ** 2 + (py + .5 - cy) ** 2;
  if (!N && !Wd && px < 13 && py < 13 && rc(13, 13) > 60) return true;
  if (!N && !E && px > 18 && py < 13 && rc(19, 13) > 60) return true;
  if (!S && !Wd && px < 13 && py > 18 && rc(13, 19) > 60) return true;
  if (!S && !E && px > 18 && py > 18 && rc(19, 19) > 60) return true;
  if (N && Wd && !(mask & 128) && rc(0, 0) < 40) return true;
  if (N && E && !(mask & 16) && rc(32, 0) < 40) return true;
  if (S && Wd && !(mask & 64) && rc(0, 32) < 40) return true;
  if (S && E && !(mask & 32) && rc(32, 32) < 40) return true;
  return false;
}
// paint the land part of an edge tile plus rings of rim colour: landRing on the land side, inRing on the inner side
function hdEdges(x, mask, land, landRing, inRing) {
  if (mask === 255) return;
  const L = new Uint8Array(36 * 36);
  for (let Y = -2; Y < 34; Y++) for (let X = -2; X < 34; X++) L[(Y + 2) * 36 + X + 2] = landAtHD(mask, X, Y) ? 1 : 0;
  const at = (X, Y) => L[(Y + 2) * 36 + X + 2];
  const near = (X, Y, v, r) => { for (let b = -r; b <= r; b++) for (let a = -r; a <= r; a++) if (Math.abs(a) + Math.abs(b) <= r && at(X + a, Y + b) === v) return true; return false; };
  for (let Y = 0; Y < 32; Y++) for (let X = 0; X < 32; X++) {
    let col = null;
    if (at(X, Y)) { const h2 = hash(X, Y, 31); col = h2 > .9 ? land.dk : h2 > .82 ? land.lt : land.base; if (near(X, Y, 0, 1)) col = landRing[0]; else if (landRing[1] && near(X, Y, 0, 2)) col = landRing[1]; }
    else if (near(X, Y, 1, 1)) col = inRing[0]; else if (inRing[1] && near(X, Y, 1, 2)) col = inRing[1];
    if (col) { x.fillStyle = col; x.fillRect(X, Y, 1, 1); }
  }
}
const HDT = {
  '.': (x, v) => hdGrass(x, v),
  'm': (x, v) => hdGrass(x, v, hdPal('m'), 7),
  ':': (x, v, f, info) => {
    const [mk2, gk] = (info || '255|g').split('|'), land = hdPal(gk);
    x.fillStyle = '#dcb65c'; x.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 30; i++) { const X = Math.floor(hash(v, i, 3) * 31), Y = Math.floor(hash(i, v, 5) * 32); x.fillStyle = i % 3 ? '#cda64c' : '#ecca76'; x.fillRect(X, Y, i % 5 === 0 ? 2 : 1, 1); }
    for (let i = 0; i < 2; i++) { const X = 4 + Math.floor(hash(v, i, 7) * 22), Y = 4 + Math.floor(hash(i, v, 9) * 22); x.fillStyle = '#b89242'; x.fillRect(X, Y + 1, 3, 1); x.fillStyle = '#e8cc84'; x.fillRect(X, Y, 2, 1); }
    hdEdges(x, +mk2, land, [land.dk2, null], ['#b48c3c', '#cba24a']);
  },
  '~': (x, v, f, info) => {
    const [mk2, gk] = (info || '255|g').split('|'), land = hdPal(gk);
    x.fillStyle = '#3c7ea8'; x.fillRect(0, 0, 32, 32);
    for (let Y = 2; Y < 32; Y += 7) for (let X = 0; X < 32; X++) if (Math.sin((X + f * 4) * .42 + Y * 1.3) > .78) { x.fillStyle = '#5797bd'; x.fillRect(X, Y + ((X >> 3) % 2), 1, 1); }
    for (let i = 0; i < 3; i++) { const X = (i * 11 + f * 3 + (i % 2) * 13) % 27, Y = (i * 11 + 4) % 28; x.fillStyle = '#a4d6ea'; x.fillRect(X, Y, 4, 1); x.fillStyle = '#7fbcd8'; x.fillRect(X + 4, Y, 2, 1); }
    const bank = gk === 'n' ? ['#93a8be', '#b9c8d8'] : gk === 's' ? ['#b89658', '#d8bc80'] : ['#5e4222', '#8a6436'];
    hdEdges(x, +mk2, land, bank, ['#234a66', '#62a4c8']);
  },
  ',': (x, v, f, info) => { const g = hdPal(info || 'g'); hdGrass(x, v, { base: dk(g.base, .1), dk: dk(g.dk, .1), lt: g.base, dk2: dk(g.dk2, .1) }, 3); x.drawImage(IMG.o_tuft, 2, 3); },
  'h': (x, v) => { hdGrass(x, v, hdPal('m'), 5); x.drawImage(heatherTuft(), 2, 3); },
  'f': (x, v, f, info) => { hdGrass(x, v, hdPal(info || 'g')); const s = IMG.o_flowers; x.drawImage(v % 2 ? flipped(s) : s, 3, 8); },
  'S': (x, v, f, info) => { hdGrass(x, v, hdPal(info || 'g')); hdShadow(x, 16, 28, 8, 2); const s = IMG.o_sign; x.drawImage(s, 7, 4); },
  'r': (x, v, f, info) => { hdGrass(x, v, hdPal(info === 'moor' ? 'm' : info || 'g')); const s = IMG.o_boulder; x.drawImage(v % 2 ? flipped(s) : s, 2, 5); },
  'T': (x, v, f, info) => { hdGrass(x, v, hdPal(info || 'g')); hdShadow(x, 16, 27, 13, 4); },
  'L': (x, v, f, info) => { hdGrass(x, v, hdPal(info || 'g')); hdShadow(x, 16, 29, 7, 2); },
  'O': (x, v) => { hdGrass(x, v, hdPal('m'), 7); hdShadow(x, 16, 28, 12, 3); },
  'N': (x, v, f, info) => { if ((info || 'g').length > 1) return false; hdGrass(x, v, hdPal(info || 'g')); hdShadow(x, 16, 28, 10, 3); },
  'F': (x, v, f, info) => hdRun(x, v, info, IMG.o_fence, 12),
  'W': (x, v, f, info) => hdRun(x, v, info, IMG.o_wall, 10),
  'H': (x, v, f, info) => hdRun(x, v, info, IMG.o_hedge, 7),
};
function hdShadow(x, cx, cy, rx, ry) { x.fillStyle = 'rgba(30,50,20,.28)'; for (let Y = -ry; Y <= ry; Y++) { const w = Math.round(rx * Math.sqrt(1 - (Y / (ry + .5)) ** 2)); x.fillRect(cx - w, cy + Y, w * 2, 1); } }
let _heather = null;
function heatherTuft() { return _heather || (_heather = recolour(IMG.o_tuft, (r, g, b, X, Y) => { const [h, s, l] = rgb2hsl(r, g, b); return l > .34 && Y < 15 ? hsl2rgb(.83, .42, Math.min(.8, l + .12)) : hsl2rgb(.24, .34, l * .9); })); }
// fences, walls and hedges: a 32px slice from the middle of the template piece repeats along a run; run ends get the piece's own end cap
function hdRun(x, v, info, s, top) {
  const [gk, e, w] = (info || 'g|0|0').split('|');
  hdGrass(x, v, hdPal(gk || 'g'));
  const mid = Math.floor((s.width - 32) / 2);
  x.drawImage(s, mid, 0, 32, s.height, 0, top, 32, s.height);
  if (w !== '1') { x.clearRect(0, top, 6, s.height); hdGrassPatch(x, v, gk, 0, top, 6, s.height); x.drawImage(s, 0, 0, 8, s.height, 2, top, 8, s.height); }
  if (e !== '1') { x.clearRect(26, top, 6, s.height); hdGrassPatch(x, v, gk, 26, top, 6, s.height); x.drawImage(s, s.width - 8, 0, 8, s.height, 22, top, 8, s.height); }
}
function hdGrassPatch(x, v, gk, X, Y, w, h) { const [c, cx] = mk(32, 32); hdGrass(cx, v, hdPal(gk || 'g')); x.drawImage(c, X, Y, w, h, X, Y, w, h); }
const tileCanvas1x = tileCanvas;
tileCanvas = function (ch, v, f, info) {
  const inside = typeof info === 'string' && info[0] === '|' && (ch === '#' || INTERIOR_CH.includes(ch));
  const fn = inside ? (x, v2, f2, info2) => (ch === '#' ? hdWall(x, v2, info2) : hdInteriorTile(x, ch, v2, f2, info2)) : HDT[ch];
  if (!fn) return tileCanvas1x(ch, v, f, info);
  const key = 'H' + ch + v + '_' + f + '_' + (info || '');
  if (TILECACHE[key]) return TILECACHE[key];
  const [c, x] = mkHD(32, 32);
  if (fn(x, v, f, info) === false) return TILECACHE[key] = tileCanvas1x(ch, v, f, info);
  return TILECACHE[key] = c;
};
const tileInfo1x = tileInfo;
tileInfo = function (m, ch, x, y) {
  let s = tileInfo1x(m, ch, x, y);
  if (m.outdoor && ch === 'W') s = localGround(m, x, y, GKEY[m.ground] || 'g');
  if (m.outdoor && ch === ',') s = GKEY[m.ground] || 'g';
  if (!m.outdoor && (ch === 'D' || ch === 'C')) return s + '||' + (tileAt(m, x + 1, y) === ch ? 1 : 0) + (tileAt(m, x - 1, y) === ch ? 1 : 0);
  if (m.outdoor && (ch === 'F' || ch === 'W' || ch === 'H')) return s + '|' + (tileAt(m, x + 1, y) === ch ? 1 : 0) + '|' + (tileAt(m, x - 1, y) === ch ? 1 : 0);
  return s;
};
// the strip of tall grass drawn over anything standing in it
function grassOverlay(t, v) {
  const key = 'HDov' + t; if (TILECACHE[key]) return TILECACHE[key];
  const [c, x] = mkHD(32, 32), s = t === 'h' ? heatherTuft() : IMG.o_tuft;
  x.drawImage(s, 0, 14, s.width, s.height - 14, 2, 17, s.width, s.height - 14);
  return TILECACHE[key] = c;
}

// ---------- Tall scenery ----------
const tallSprite1x = tallSprite;
tallSprite = function (ch, v, lit) {
  const key = 'HD' + ch + (v % 2) + (lit ? 'L' : '');
  if (TALLCACHE[key]) return TALLCACHE[key];
  let s = null;
  if (ch === 'T') s = v % 2 ? flipped(IMG.o_oak_tall) : IMG.o_oak_tall;
  else if (ch === 'N' && !lit) s = IMG.o_pine;
  else if (ch === 'L') s = lit ? IMG.o_lamp : recolour(IMG.o_lamp, (r, g, b) => (r > 170 && g > 110 && b < 120) ? [150, 146, 128] : null);
  else if (ch === 'O') s = lit ? recolour(IMG.o_stone, (r, g, b) => (r + g + b < 330) ? [90, 235, 205] : null) : IMG.o_stone;
  if (!s) return tallSprite1x(ch, v, lit);
  return TALLCACHE[key] = s;
};

// ---------- Buildings ----------
// template art per building type: [asset, where the door sits across the art (0..1)]
const BUILD_ART = { cottage: ['h_cottage_hd', .5], house: ['h_house', .5], wayhouse: ['h_wayhouse', .5], mill: ['h_mill', .3], lab: ['h_lab_hd', .5], gym: ['h_gym_hd', .5], shop: ['h_shop', .74] };
function buildingArt(b) {
  if (b._art !== undefined) return b._art;
  const def = BUILD_ART[b.type]; let s = def && IMG[def[0]];
  if (s && b.type === 'gym' && b.roof) { const [h] = rgb2hsl(...h2r(b.roof)); if (h < .08 || h > .17) s = toHue(s, b.roof, (hh, sat, l, X, Y) => hh > 28 && hh < 58 && sat > .45 && Y < s.height * .52); }
  if (s && b.type === 'house' && b.roof) { const [h] = rgb2hsl(...h2r(b.roof)); if (h < .5 || h > .75) s = toHue(s, b.roof, (hh, sat, l) => hh > 195 && hh < 250 && sat > .18); }
  return b._art = s || null;
}
function drawBuildingArt(b, cx, cy, ents) {
  const s = buildingArt(b); if (!s) return false;
  b.windows = [];
  const w = lw(s), h = lh(s), fx = b.x * 16, fw = b.w * 16, bottom = (b.y + b.h) * 16;
  let ax = Math.round((b.door + .5) * 16 - w * BUILD_ART[b.type][1]);
  ax = Math.max(fx - 3, Math.min(fx + fw - w + 3, ax));
  ents.push({ y: bottom - 1, draw: () => {
    R(ax + 2 - cx, bottom - 2 - cy, w - 2, 4, 'rgba(30,50,20,.25)');
    // spare footprint beside or behind the art becomes garden hedge, so nothing solid is invisible
    const hedge = IMG.o_hedge, hw = lw(hedge), hh = lh(hedge);
    if (bottom - h - b.y * 16 >= 10) for (let X = fx; X + hw <= fx + fw + 2; X += hw - 1) blit(hedge, X - cx, b.y * 16 + 2 - cy);
    for (let X = fx; X + hw <= ax + 3; X += hw) blit(hedge, X - cx, bottom - hh - 1 - cy);
    for (let X = fx + fw - hw; X >= ax + w - 3; X -= hw) blit(hedge, X - cx, bottom - hh - 1 - cy);
    blit(s, ax - cx, bottom + 1 - h - cy);
  } });
  return true;
}

// ---------- People ----------
const personSprite1x = personSprite;
personSprite = function (look, dir, fr) {
  if (!IMG.p_hero_f || typeof DOLL === 'undefined') return personSprite1x(look, dir, fr);
  if (dir === 'right') dir = 'left';
  const hero = look === LOOKS.player, key = 'HD' + (hero ? 'hero' : JSON.stringify(look)) + dir + fr; if (PEOPLE[key]) return PEOPLE[key];
  const k0 = 'HD' + (hero ? 'hero' : JSON.stringify(look)) + dir + 0;
  const stand = PEOPLE[k0] || (PEOPLE[k0] = hero ? IMG['p_hero_' + (dir === 'down' ? 'f' : dir === 'up' ? 'b' : 'l')] : personHD(look, dir));
  return PEOPLE[key] = walkFrame(stand, dir, fr, look);
};
// Walking poses made from a standing sprite. Front and back: one leg lifts while the opposite arm swings forward
// and the body dips; side: the feet stride apart and the arm swings. Frame 1 and 2 are the two halves of the cycle.
// legs for a walking pose, recoloured for anyone who is not the hero (trousers and shoes by colour)
function legStrip(look, v, fr) {
  const base = IMG['p_legs_' + v + fr]; if (!base) return null;
  if (!look || look === LOOKS.player) return base;
  const key = 'HDlegs' + JSON.stringify([look.pants, look.shoes]) + v + fr; if (PEOPLE[key]) return PEOPLE[key];
  const pants = rgb2hsl(...h2r(look.pants || '#383848')), shoes = rgb2hsl(...h2r(look.shoes || '#3a2a2a'));
  return PEOPLE[key] = recolour(base, (r, g, b) => { const [h, s2, l] = rgb2hsl(r, g, b), H = h * 360; if (l < .13) return null;
    if (s2 > .25 && H > 180 && H < 265) return hsl2rgb(pants[0], pants[1], Math.max(.06, Math.min(.92, pants[2] + (l - .2) * .9)));
    if (s2 > .4 && (H < 20 || H > 340)) return hsl2rgb(shoes[0], shoes[1], Math.max(.06, Math.min(.92, shoes[2] + (l - .45) * .9)));
    return null; });
}
function walkFrame(src, dir, fr, look) {
  if (!fr) return src;
  const side = dir === 'left' || dir === 'right';
  if (side) { const [c0, x0] = mk(src.width + 12, src.height); c0.hd = src.hd; x0.drawImage(src, 6, 0); src = c0; }   // room for a wide stride
  const w = src.width, h = src.height, [c, x] = mk(w, h); c.hd = src.hd;
  const bw = dir === 'down' ? 30 : dir === 'up' ? 27 : 28, px = Math.round((w - bw) / 2);
  const LEG = 10, top = h - LEG;                       // legs occupy the bottom 10 rows of the template
  const sd = src.getContext('2d');
  if (!side) {
    const mid = px + (dir === 'down' ? 15 : 13), L = fr === 1;      // which leg lifts
    x.drawImage(src, 0, 0, w, top, 0, 1, w, top);                    // body dips one pixel
    const strip = legStrip(look, dir === 'down' ? 'f' : 'b', fr);
    if (strip) x.drawImage(strip, Math.round(mid - strip.width / 2), h - strip.height);   // legs drawn for this pose (walk-cycle template)
    else {   // planted leg stays; lifted leg is drawn shorter, three pixels up
      const [ax, aw] = L ? [0, mid] : [mid, w - mid], [bx, bwid] = L ? [mid, w - mid] : [0, mid];
      x.drawImage(src, bx, top, bwid, LEG, bx, top, bwid, LEG);
      x.drawImage(src, ax, top + 1, aw, 2, ax, top + 1, aw, 2);
      x.drawImage(src, ax, top + 5, aw, LEG - 5, ax, top + 2, aw, LEG - 5);
    }
    // arms: the one opposite the lifted leg swings down, the other tucks up
    const armL = [px + (dir === 'down' ? 2 : 1), 6], armR = [px + (dir === 'down' ? 22 : 20), 6], ay = h - 26, ah = 17;
    const swing = (a, d) => { if (d < 0) x.clearRect(a[0], ay + 1 + ah - 1, a[1], 1); x.drawImage(src, a[0], ay, a[1], ah, a[0], ay + 1 + d, a[1], ah); };
    swing(L ? armR : armL, 1); swing(L ? armL : armR, -1);
  } else {
    const mid = px + 15, d = fr === 1 ? 3 : 1;                       // wide stride, then a narrow one
    x.drawImage(src, 0, 0, w, top, 0, fr === 1 ? 1 : 0, w, top);
    const strip = legStrip(look, 'l', fr);
    if (strip) x.drawImage(strip, Math.round(px + 14.5 - strip.width / 2), h - strip.height);
    else for (let i = 0; i < LEG; i++) {                              // legs swing from the hip: no shift at the top, full shift at the feet
      const sh = Math.round(d * i / (LEG - 1)), up = i > LEG - 4 ? 1 : 0;
      x.drawImage(src, mid, top + i, w - mid, 1, mid + sh, top + i - (fr === 1 ? up : 0), w - mid, 1);   // back leg behind
      x.drawImage(src, 0, top + i, mid, 1, -sh, top + i - (fr === 1 ? 0 : up), mid, 1);                  // front leg forward
    }
    // arm swing: slide the hand along the body
    const hx = px + 13, hy = h - 16, hw = 6, hh = 7, q = sd.getImageData(px + 19, h - 21, 1, 1).data, off = fr === 1 ? 2 : -2, by = fr === 1 ? 1 : 0;
    x.fillStyle = `rgb(${q[0]},${q[1]},${q[2]})`; x.fillRect(hx, hy + by, hw, hh - 1);
    x.drawImage(src, hx, hy, hw, hh, hx + off, hy + by, hw, hh);
  }
  return c;
}
// a person drawn at one art pixel per game pixel, feet at (x, bottom): used in menus and battle intros
function blitPerson(look, cxm, bottom, bw, bh) {
  const pk = Object.keys(PORTRAIT).find(k => LOOKS[k] === look);
  const s = (pk && IMG[PORTRAIT[pk]]) || personSprite(look, 'down', 0);
  if (!s.hd || s.hd === 1) { blit(s, cxm - bw / 2, bottom - bh, { dw: bw, dh: bh }); return; }
  blit(s, cxm - s.width / 2, bottom - s.height, { dw: s.width, dh: s.height });
}

// ---------- People made from the hero template ----------
// Every other character is the hero template recoloured region by region (DOLL holds the region maps), with the
// look's hair style, coat, apron, beard, glasses and so on added. Shading comes from the template's own pixels.
const DOLLMED = {};
function dollMedians(v) {
  if (DOLLMED[v]) return DOLLMED[v];
  const src = IMG['p_hero_' + v], map = DOLL[v], d = src.getContext('2d').getImageData(0, 0, src.width, src.height).data, by = {};
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) { const r = map[y][x]; if (r === '.' || r === 'K' || r !== r.toLowerCase()) continue; const i = (y * src.width + x) * 4; (by[r] = by[r] || []).push(rgb2hsl(d[i], d[i + 1], d[i + 2])[2]); }
  const med = {}; for (const r in by) { by[r].sort((a, b) => a - b); med[r] = by[r][by[r].length >> 1]; }
  return DOLLMED[v] = med;
}
function personHD(look, dir) {
  const v = dir === 'down' ? 'f' : dir === 'up' ? 'b' : 'l', src = IMG['p_hero_' + v], map = DOLL[v], med = dollMedians(v);
  const w = src.width, h = src.height, PX = 3, PY = 5, [c, x] = mk(w + PX * 2, h + PY); c.hd = 2;
  const sd = src.getContext('2d').getImageData(0, 0, w, h).data, out = x.createImageData(w + PX * 2, h + PY), o = out.data;
  const st = look.style || 'short', hair = look.hair || '#5a3a28', shirt = look.shirt || '#4868b8', pants = look.pants || '#383848', shoes = look.shoes || '#3a2a2a';
  const SKIN = '#f6cfa6', capless = st !== 'cap', mid = (w - 1) / 2;
  const target = (r, X, Y) => {
    switch (r) {
      case 'c': if (st === 'cap') return look.cap || '#d83838'; if (st === 'bald') return look.skin || SKIN; return hair;
      case 'm': if (st === 'cap') return lt(look.cap || '#d83838', .55); if (st === 'bald') return look.skin || SKIN; return dk(hair, .12);
      case 'h': if (st === 'bald' && v === 'f' && X > 7 && X < 22) return look.skin || SKIN; return st === 'hood' ? dk(hair, .3) : hair;
      case 's': if (look.beard && v !== 'b' && Y >= 22 && Y <= 26 && (v === 'f' ? X > 7 && X < 22 : X < 15)) return look.beard; return look.skin || null;
      case 'j': case 'y': case 't': {
        if (look.apron && Y >= 30 && (v === 'f' ? X > 8 && X < 21 : v === 'l' ? X < 16 : false)) return look.apron;
        return r === 'y' ? (look.accent || shirt) : shirt; }
      case 'p': if (look.apron && Y <= 46 && (v === 'f' ? X > 8 && X < 21 : v === 'l' ? X < 16 : false)) return look.apron; return look.coat && Y <= 45 ? dk(shirt, .08) : pants;
      case 'o': return shoes;
    }
    return null;
  };
  for (let Y = 0; Y < h; Y++) for (let X = 0; X < w; X++) {
    const R0 = map[Y][X]; if (R0 === '.') continue;
    if (v === 'l' && capless && X <= 4 && Y >= 10 && Y <= 14) continue;      // no cap, so no peak sticking out over the face
    const i = (Y * w + X) * 4, j = ((Y + PY) * (w + PX * 2) + X + PX) * 4, r = R0.toLowerCase(), line = R0 !== 'K' && R0 !== r;
    let col = [sd[i], sd[i + 1], sd[i + 2]];
    const nearStrap = R0 === 'K' && Y >= 27 && Y <= 42 && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([a2, b2]) => (map[Y + b2] || '')[X + a2] && map[Y + b2][X + a2] !== '.') && [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a2, b2]) => 'tT'.includes((map[Y + b2] || '')[X + a2] || '.')) && ![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a2, b2]) => 'sS'.includes((map[Y + b2] || '')[X + a2] || '.'));
    const flat = r === 't' || nearStrap;                    // the bag strap is painted out in plain jacket colour
    const T = nearStrap ? target('t', X, Y) : R0 === 'K' || r === 'e' ? null : target(r, X, Y);
    if (T) {
      if (flat) col = h2r(dk(T, .04));
      else if (line) col = h2r(mix(T, '#1a1022', .66));
      else { const [th, ts, tl] = rgb2hsl(...h2r(T)), pl = rgb2hsl(col[0], col[1], col[2])[2]; let l = Math.max(.05, Math.min(.97, tl + (pl - (med[r] || .5)) * (tl > .8 ? 1.25 : .95)));
        if (r === 'c' && capless && st !== 'bald' && hash(X >> 1, Y, 77) > .8) l = Math.max(.05, l - .07);   // strands
        col = hsl2rgb(th, ts * (l > .92 ? .5 : tl > .85 ? .3 : 1), l); }
    }
    o[j] = col[0]; o[j + 1] = col[1]; o[j + 2] = col[2]; o[j + 3] = 255;
  }
  if (v === 'l' && capless) { const W3 = w + PX * 2; for (let Y = 8 + PY; Y <= 16 + PY; Y++) for (let X = PX; X <= 8 + PX; X++) { const k = (Y * W3 + X) * 4; if (o[k + 3] && !o[k - 4 + 3]) { o[k] = 40; o[k + 1] = 28; o[k + 2] = 36; } } }
  x.putImageData(out, 0, 0);
  // extra shapes: long hair, buns, hood drapes. Each is filled, shaded on its right side and given a dark rim.
  const shapes = [];
  const blob = (cx, cy, rx, ry, col, under) => shapes.push({ cx: cx + PX, cy: cy + PY, rx, ry, col, under });
  const longish = st === 'long' || st === 'hood';
  if (longish) { const hc = st === 'hood' ? hair : hair, bot = st === 'hood' ? 30 : 34;
    if (v === 'f') { blob(3, (15 + bot) / 2, 2.6, (bot - 15) / 2 + 1, hc); blob(26, (15 + bot) / 2, 2.6, (bot - 15) / 2 + 1, hc); }
    else if (v === 'b') blob(13, (17 + bot) / 2, 10.5, (bot - 17) / 2 + 2, hc);
    else blob(22, (16 + bot) / 2, 4.6, (bot - 16) / 2 + 1, hc); }
  if (st === 'bun') { if (v === 'l') blob(23, 1, 4, 3.6, hair); else blob(v === 'f' ? 15 : 13, -1.5, 4.6, 3.8, hair); }
  const W2 = w + PX * 2, H2 = h + PY;
  for (const s of shapes) {
    const inS = (X, Y) => ((X + .5 - s.cx) / s.rx) ** 2 + ((Y + .5 - s.cy) / s.ry) ** 2 <= 1;
    const d = x.getImageData(0, 0, W2, H2), a = d.data;
    for (let Y = 0; Y < H2; Y++) for (let X = 0; X < W2; X++) {
      const k = (Y * W2 + X) * 4;
      if (inS(X, Y)) { const edge = !inS(X - 1, Y) || !inS(X + 1, Y) || !inS(X, Y - 1) || !inS(X, Y + 1); const q = h2r(edge ? mix(s.col, '#1a1022', .62) : X + .5 > s.cx + s.rx * .35 ? dk(s.col, .2) : X + .5 < s.cx - s.rx * .4 ? lt(s.col, .14) : s.col); a[k] = q[0]; a[k + 1] = q[1]; a[k + 2] = q[2]; a[k + 3] = 255; }
    }
    x.putImageData(d, 0, 0);
  }
  const p = (X, Y, col) => { x.fillStyle = col; x.fillRect(X + PX, Y + PY, 1, 1); }, r = (X, Y, ww, hh, col) => { x.fillStyle = col; x.fillRect(X + PX, Y + PY, ww, hh); };
  if (look.glasses && v === 'f') { const g = '#8498c0', hl = '#e6eefc'; for (const ex of [7, 16]) { r(ex + 1, 17, 5, 1, g); r(ex + 1, 24, 5, 1, g); r(ex, 18, 1, 6, g); r(ex + 6, 18, 1, 6, g); p(ex + 1, 18, hl); p(ex + 5, 23, hl); } r(14, 20, 2, 1, g); r(5, 20, 2, 1, g); r(23, 20, 2, 1, g); }
  if (look.glasses && v === 'l') { const g = '#8498c0'; r(7, 18, 5, 1, g); r(7, 24, 5, 1, g); r(6, 19, 1, 5, g); r(12, 19, 1, 5, g); p(7, 19, '#e6eefc'); r(13, 20, 7, 1, g); }
  if (look.veil && v !== 'b') { for (let Y = 16; Y <= 25; Y++) for (let X = v === 'f' ? 7 : 6; X <= (v === 'f' ? 22 : 15); X++) if ((X + Y) % 2 === 0) p(X, Y, look.veil); }
  return c;
}
const PORTRAIT = { prof: 'p_prof_f', mum: 'p_mum_f', rival: 'p_rival_f', grunt: 'p_grunt_f' };

// ---------- Capture orbs: a tinted glass orb of ley energy held in a brass ring ----------
const orbSprite1x = orbSprite;
orbSprite = function (col = '#48c8b0') {
  const key = 'HDorb' + col; if (PEOPLE[key]) return PEOPLE[key];
  const N = 24, c = N / 2, r = 10.2, [cv2, x] = mkHD(N, N), img = x.createImageData(N, N), a = img.data;
  const put = (X, Y, hex) => { if (X < 0 || Y < 0 || X >= N || Y >= N) return; const q = h2r(hex), i = (Y * N + X) * 4; a[i] = q[0]; a[i + 1] = q[1]; a[i + 2] = q[2]; a[i + 3] = 255; };
  const edge = mix(col, '#140e1e', .78), tones = [dk(col, .42), dk(col, .2), col, lt(col, .28), lt(col, .6)];
  for (let Y = 0; Y < N; Y++) for (let X = 0; X < N; X++) {
    const nx = (X + .5 - c) / r, ny = (Y + .5 - c) / r, d = Math.hypot(nx, ny);
    if (d > 1.06) continue; if (d > .9) { put(X, Y, edge); continue; }
    const nz = Math.sqrt(Math.max(0, 1 - d * d)), lum = -nx * .5 - ny * .62 + nz * .5;
    put(X, Y, tones[lum > .86 ? 4 : lum > .56 ? 3 : lum > .18 ? 2 : lum > -.15 ? 1 : 0]);
  }
  // swirl of energy inside the glass
  for (let t = 0; t < 1; t += .012) { const th = t * Math.PI * 2.4 + .6, rr = r * (.12 + .5 * t); const X = Math.round(c + Math.cos(th) * rr - .5), Y = Math.round(c + 1 + Math.sin(th) * rr * .8 - .5); put(X, Y, lt(col, .75)); }
  put(c - 1, c, '#ffffff'); put(c, c + 1, lt(col, .8));
  // brass ring, tilted, passing in front of the lower half; and a little cap on top
  const rot = -.32, ca = Math.cos(rot), sa = Math.sin(rot);
  for (let Y = 0; Y < N; Y++) for (let X = 0; X < N; X++) {
    const dx = X + .5 - c, dy = Y + .5 - c, u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
    const e = Math.hypot(u / (r + 1.2), v / (r * .44));
    if (v > -.3 && e > .66 && e < 1.16) put(X, Y, e > 1.03 || e < .76 ? '#5e4212' : u < -r * .3 ? '#fff0a8' : u > r * .5 ? '#b07e28' : '#e6b84c');
  }
  for (const [X, Y, h2] of [[c - 2, 0, '#7a5a1e'], [c - 1, 0, '#e6b84c'], [c, 0, '#e6b84c'], [c + 1, 0, '#7a5a1e'], [c - 2, 1, '#7a5a1e'], [c - 1, 1, '#fff0a8'], [c, 1, '#e6b84c'], [c + 1, 1, '#7a5a1e']]) put(X, Y, h2);
  put(c - 5, c - 6, '#ffffff'); put(c - 4, c - 6, '#ffffff'); put(c - 5, c - 5, '#ffffff'); put(c - 6, c - 4, lt(col, .8));
  x.putImageData(img, 0, 0);
  return PEOPLE[key] = cv2;
};

// ---------- How a following Beastie moves: hop, trot, lumber or float ----------
function gaitOf(id) {
  const sp = SPECIES[id]; if (sp._gait) return sp._gait;
  const total = sp.bst || (sp.base ? sp.base.reduce((s, v) => s + v, 0) : 400), t = sp.types || [];
  let g = 'trot';
  if (t.includes('Flying') || t.includes('Ghost')) g = 'float';
  else if (total < 340) g = 'hop';
  else if (total >= 470 && (['Rock', 'Ground', 'Steel', 'Ice', 'Dragon', 'Fighting'].some(k => t.includes(k)) || (sp.base && sp.base[5] < 60))) g = 'lumber';
  return sp._gait = g;
}
// offsets for the follower sprite and its shadow this frame: [dx, dy, shadowRx, dust]
function gaitOffset(id, f) {
  const g = gaitOf(id), k = f.mv ? Math.min(1, f.mv.t / f.mv.dur) : -1;
  if (g === 'float') return [0, -4 + Math.round(Math.sin(NOW / 380) * 2), 4, 0];
  if (g === 'hop') { if (k >= 0) return [0, -Math.round(Math.abs(Math.sin(k * Math.PI)) * 5), 6 - Math.round(Math.abs(Math.sin(k * Math.PI)) * 2), 0]; const ph = (NOW % 2600) / 2600; return [0, ph < .1 ? -Math.round(Math.sin(ph / .1 * Math.PI) * 2) : 0, 6, 0]; }
  if (g === 'lumber') { if (k >= 0) return [Math.round(Math.sin(k * Math.PI * 2)), k < .45 ? -1 : 0, 7, k > .45 && k < .8 ? 1 : 0]; return [0, Math.floor(NOW / 900) % 2 ? -1 : 0, 7, 0]; }
  if (k >= 0) return [0, -Math.round(Math.abs(Math.sin(k * Math.PI * 2)) * 1.6), 6, 0];
  return [0, Math.floor(NOW / 500) % 2 ? -1 : 0, 6, 0];
}

// ---------- Interiors: floors, walls and furniture matched to the cottage-interior template ----------
function hdFloor(x, fl, v) {
  const p = (X, Y, c) => { x.fillStyle = c; x.fillRect(X, Y, 1, 1); }, r = (X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(X, Y, w, h); };
  if (fl === 'wood') {
    r(0, 0, 32, 32, '#b4743c');
    for (let row = 0; row < 4; row++) { const Y = row * 8, tone = ['#b4743c', '#ba7a40', '#ae6e38', '#b87840'][(row + v) % 4];
      r(0, Y, 32, 8, tone); r(0, Y, 32, 1, '#c88a4c'); r(0, Y + 7, 32, 1, '#8a5428');
      const jx = Math.floor(hash(v, row, 91) * 26) + 3; r(jx, Y + 1, 1, 6, '#8a5428'); p(jx + 1, Y + 1, '#c88a4c');
      for (let i = 0; i < 3; i++) { const gx = Math.floor(hash(v + i, row, 93) * 28), gy = Y + 2 + Math.floor(hash(row, v + i, 95) * 4); r(gx, gy, 3 + (i % 2) * 2, 1, i % 2 ? '#a66a34' : '#c08046'); } }
    return true;
  }
  if (fl === 'tile') {
    r(0, 0, 32, 32, '#b9c4d2');
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const X = i * 16, Y = j * 16, c = (i + j) % 2 ? '#dfe7ee' : '#d2dce8'; r(X + 1, Y + 1, 15, 15, c); r(X + 1, Y + 1, 15, 1, '#f2f6fa'); r(X + 1, Y + 1, 1, 15, '#eaf0f6'); r(X + 2, Y + 15, 14, 1, dk(c, .08)); }
    if (v === 1) { p(9, 10, '#c2ccd8'); p(10, 11, '#c2ccd8'); }
    return true;
  }
  if (fl === 'honey') {
    r(0, 0, 32, 32, '#f2c650');
    const hexes = [[8, 8], [24, 8], [0, 24], [16, 24], [32, 24], [-8, 8], [40, 8], [0, -8], [16, -8], [32, -8], [8, 40], [24, 40]];
    for (let Y = 0; Y < 32; Y++) for (let X = 0; X < 32; X++) { let best = 1e9, second = 1e9; for (const [hx, hy] of hexes) { const d = Math.max(Math.abs(X + .5 - hx) * .92 + Math.abs(Y + .5 - hy) * .5, Math.abs(Y + .5 - hy)); if (d < best) { second = best; best = d; } else if (d < second) second = d; }
      if (second - best < 1.3) p(X, Y, '#c2902a'); else if (second - best < 2.6 && (X + Y) % 2 === 0) p(X, Y, '#f8dc7c'); }
    return true;
  }
  return false;
}
const HDF = {   // furniture drawn flat inside its tile, over the floor: fn(x, v, f, flags)
  D(x, v, f, fl) { const e = fl[0] === '1', w = fl[1] === '1', r = (X, Y, ww, hh, c) => { x.fillStyle = c; x.fillRect(X, Y, ww, hh); };
    const x0 = w ? 0 : 2, x1 = e ? 32 : 30;
    r(x0 + 1, 27, x1 - x0 - 2, 4, 'rgba(40,20,10,.25)');
    r(x0, 5, x1 - x0, 17, '#3a2414'); r(x0 + (w ? 0 : 1), 6, x1 - x0 - (w ? 0 : 1) - (e ? 0 : 1), 15, '#c08a4c'); r(x0 + (w ? 0 : 1), 6, x1 - x0 - (w ? 0 : 1) - (e ? 0 : 1), 2, '#dca866');
    for (let Y = 11; Y < 20; Y += 5) r(x0 + (w ? 0 : 1), Y, x1 - x0 - (w ? 0 : 1) - (e ? 0 : 1), 1, '#a8743c');
    r(x0, 22, x1 - x0, 5, '#3a2414'); r(x0 + (w ? 0 : 1), 22, x1 - x0 - (w ? 0 : 1) - (e ? 0 : 1), 4, '#8a5a2c');
    if (!w) { r(x0, 26, 5, 5, '#3a2414'); r(x0 + 1, 26, 3, 4, '#7a4c24'); } if (!e) { r(x1 - 5, 26, 5, 5, '#3a2414'); r(x1 - 4, 26, 3, 4, '#7a4c24'); } },
  C(x, v, f, fl) { const e = fl[0] === '1', w = fl[1] === '1', r = (X, Y, ww, hh, c) => { x.fillStyle = c; x.fillRect(X, Y, ww, hh); };
    r(0, 0, 32, 32, '#3a2414'); const a = w ? 0 : 1, b = e ? 32 : 31;
    r(a, 1, b - a, 11, '#d09a5a'); r(a, 1, b - a, 2, '#e8b876'); r(a, 10, b - a, 2, '#a8743c');
    r(a, 13, b - a, 18, '#a26a36'); for (let X = 2; X < 30; X += 14) { r(X, 15, 12, 14, '#3a2414'); r(X + 1, 16, 10, 12, '#8e5a2c'); r(X + 1, 16, 10, 1, '#b07a40'); } r(a, 30, b - a, 1, '#5a3618'); },
  E(x) { const s = IMG.i_mat; x.drawImage(s, Math.round((32 - s.width) / 2), 10); },                      // doormat at an exit
  R(x, v) { const r = (X, Y, ww, hh, c) => { x.fillStyle = c; x.fillRect(X, Y, ww, hh); };                    // rich red carpet
    r(0, 0, 32, 32, '#a83c3c'); r(0, 0, 32, 2, '#e2b24c'); r(0, 30, 32, 2, '#e2b24c'); r(0, 2, 32, 1, '#7a2626'); r(0, 29, 32, 1, '#7a2626');
    for (let Y = 6; Y < 28; Y += 10) for (let X = 3 + ((Y / 10 | 0) % 2) * 8; X < 32; X += 16) { r(X + 2, Y, 2, 1, '#d46a5a'); r(X + 1, Y + 1, 4, 2, '#d46a5a'); r(X + 2, Y + 3, 2, 1, '#d46a5a'); r(X + 2, Y + 1, 2, 2, '#e8c070'); } },
  t(x, v, f) { const r = (X, Y, ww, hh, c) => { x.fillStyle = c; x.fillRect(X, Y, ww, hh); };  // television on a cabinet
    r(3, 28, 26, 3, 'rgba(40,20,10,.25)'); r(2, 17, 28, 13, '#3a2414'); r(3, 18, 26, 11, '#9a6634'); r(3, 18, 26, 2, '#c08a4c'); r(6, 22, 8, 5, '#7a4c24'); r(18, 22, 8, 5, '#7a4c24'); r(9, 24, 2, 1, '#e6b84c'); r(21, 24, 2, 1, '#e6b84c');
    r(4, 2, 24, 16, '#1c1a22'); r(5, 3, 22, 13, '#3c3a46'); r(6, 4, 20, 11, f % 2 ? '#6aa4e8' : '#5a94dc'); r(7, 5, 7, 2, '#b4d8ff'); r(7, 7, 3, 2, '#9ac8f8'); r(13, 16, 6, 2, '#1c1a22'); },
};
const INTERIOR_CH = '_kyERDPMtbBjCZYIU@';
function hdInteriorTile(x, ch, v, f, info) {
  const parts = info.split('|'), fl = ch === 'k' ? 'tile' : ch === 'y' ? 'honey' : (parts[1] || 'wood');
  if (!hdFloor(x, fl, v)) x.drawImage(tileCanvas1x('_', v, 0, '|' + fl), 0, 0, 16, 16, 0, 0, 32, 32);
  if (ch === '_' || ch === 'k' || ch === 'y') return;
  if (ch === 'B' || ch === 'P' || ch === 'b') { if (ch !== 'b' || parts[2] !== 'top') hdShadowDark(x, 16, 28, ch === 'P' ? 7 : 14, 3); return; }   // drawn standing up, see interiorTall
  if (HDF[ch]) { HDF[ch](x, v, f, parts[3] || parts[2] || ''); return; }
  x.drawImage(tileCanvas1x(ch, v, f, '|none|' + (parts[2] || '')), 0, 0, 16, 16, 0, 0, 32, 32);          // not restyled yet: old art over the new floor
}
function hdShadowDark(x, cx, cy, rx, ry) { x.fillStyle = 'rgba(40,20,10,.28)'; for (let Y = -ry; Y <= ry; Y++) { const w = Math.round(rx * Math.sqrt(1 - (Y / (ry + .5)) ** 2)); x.fillRect(cx - w, cy + Y, w * 2, 1); } }
function hdWall(x, v, info) {
  const parts = info.split('|'), top = parts[2] === 'top', wc = parts[3] || '#f0e0c0', r = (X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(X, Y, w, h); };
  if (top) { r(0, 0, 32, 32, '#1d1a24'); r(0, 24, 32, 8, '#3a2414'); r(0, 25, 32, 5, '#8a5a2c'); r(0, 25, 32, 1, '#b07a40'); r(0, 29, 32, 1, '#5e3a1a'); return; }
  r(0, 0, 32, 32, wc); r(0, 0, 32, 2, dk(wc, .16));
  for (let i = 0; i < 10; i++) { const X = Math.floor(hash(v, i, 61) * 31), Y = 3 + Math.floor(hash(i, v, 63) * 14); r(X, Y, 1, 1, i % 2 ? dk(wc, .07) : lt(wc, .3)); }
  r(0, 19, 32, 13, '#3a2414'); r(0, 20, 32, 2, '#a26a36'); r(0, 20, 32, 1, '#c08a4c'); r(0, 22, 32, 8, '#7e4e28'); for (let X = 7; X < 32; X += 8) r(X, 22, 1, 8, '#5e3a1a'); r(0, 30, 32, 2, '#4a2c14');
  if (v === 0) { r(7, 3, 18, 14, '#3a2414'); r(8, 4, 16, 12, '#6a4424'); r(9, 5, 6, 4, '#8cc6ea'); r(17, 5, 6, 4, '#8cc6ea'); r(9, 11, 6, 4, '#74b2dc'); r(17, 11, 6, 4, '#74b2dc'); r(9, 5, 3, 1, '#d8f0ff'); r(17, 5, 3, 1, '#d8f0ff'); r(6, 17, 20, 2, '#3a2414'); r(7, 17, 18, 1, '#a26a36'); }
  else if (v === 2) { r(11, 5, 11, 9, '#3a2414'); r(12, 6, 9, 7, '#8a5a2c'); r(13, 7, 7, 5, '#9cc8e4'); r(13, 10, 7, 2, '#6e9a34'); }
}
function interiorTall(m, ch, x, y, v) {
  if (m.outdoor) return null;
  if (ch === 'B') return IMG.i_shelf; if (ch === 'P') return IMG.i_plant;
  if (ch === 'b' && tileAt(m, x, y - 1) === 'b') return IMG.i_bed;
  return null;
}