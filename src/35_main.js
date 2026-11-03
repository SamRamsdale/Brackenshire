// ---- main ----
// ================= GAME STATE =================
const G = {
  scene: 'title', name: 'Sam', map: MAPS.home, pl: null, fol: null, npcs: [], party: [], box: [], bag: {}, money: 3000,
  flags: {}, seen: {}, caught: {}, playtime: 0, lastHeal: { map: 'home', x: 6, y: 5 }, opts: {}, lock: 0, banner: null,
};
const DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
function timeOfDay() { const h = new Date().getHours(); return h >= 5 && h < 10 ? 'morning' : h >= 10 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'evening' : 'night'; }
function timeName() { return { morning: 'Morning', day: 'Daytime', evening: 'Evening', night: 'Night' }[timeOfDay()]; }

class Ent {
  constructor(o) { Object.assign(this, o); this.px = this.x * 16; this.py = this.y * 16; this.mv = null; this.step = 0; }
  moveTo(dir, dur) {
    return new Promise(res => { const [dx, dy] = DIRV[dir]; this.dir = dir; this.mv = { fx: this.x, fy: this.y, tx: this.x + dx, ty: this.y + dy, t: 0, dur, res }; this.x += dx; this.y += dy; this.step ^= 1; });
  }
  update(dt) {
    if (!this.mv) { this.px = this.x * 16; this.py = this.y * 16; return; }
    const m = this.mv; m.t += dt; const k = Math.min(1, m.t / m.dur);
    this.px = (m.fx + (m.tx - m.fx) * k) * 16; this.py = (m.fy + (m.ty - m.fy) * k) * 16;
    if (k >= 1) { this.mv = null; m.res(); }
  }
  get wf() { if (!this.mv) return 0; const k = this.mv.t / this.mv.dur; return k < .55 ? (this.step ? 1 : 2) : 0; }
}

// ================= MAP HELPERS =================
function tileAt(m, x, y) {
  if (x >= 0 && y >= 0 && x < m.w && y < m.h) return m.grid[y][x];
  if (!m.outdoor) return null;
  const e = y < 0 ? 'n' : y >= m.h ? 's' : x < 0 ? 'w' : 'e', ex = m.exits[e];
  if (ex) {
    const n = MAPS[ex.to]; let nx = x, ny = y;
    if (e === 'n') { nx = x + ex.dx; ny = n.h + y; } else if (e === 's') { nx = x + ex.dx; ny = y - m.h; } else if (e === 'w') { nx = n.w + x; ny = y + ex.dx; } else { nx = x - m.w; ny = y + ex.dx; }
    if (nx >= 0 && ny >= 0 && nx < n.w && ny < n.h) return n.grid[ny][nx];
  }
  return m['border' + e.toUpperCase()] || m.border;
}
function buildingAt(x, y) { return G.map.buildings.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h); }
function npcAt(x, y) { return G.npcs.find(n => n.x === x && n.y === y && !n.hidden); }
function blocked(x, y, who) {
  const t = tileAt(G.map, x, y);
  if (t === null || SOLID.has(t)) return true;
  if (x < 0 || y < 0 || x >= G.map.w || y >= G.map.h) return true;
  if (buildingAt(x, y)) return true;
  if (npcAt(x, y)) return true;
  if (who !== G.pl && G.pl.x === x && G.pl.y === y) return true;
  if (who !== G.pl && who !== G.fol && G.fol && !G.fol.hidden && G.fol.x === x && G.fol.y === y) return true;
  return false;
}
function spawnNPCs() {
  G.npcs = G.map.npcs.filter(n => (!n.cond || n.cond()) && !(n.item && G.flags['got_' + G.map.id + n.id])).map(n => new Ent({ ...n, hx: n.x, hy: n.y, wt: 1000 + Math.random() * 2000 }));
}
function lead() { return G.party.find(m => m.hp > 0); }
function loadMap(id, x, y, dir) {
  const prev = G.map;
  G.map = MAPS[id];
  G.pl = new Ent({ x, y, dir: dir || 'down', look: 'player' });
  spawnNPCs();
  const [dx, dy] = DIRV[OPP[G.pl.dir]];
  G.fol = new Ent({ x: x + dx, y: y + dy, dir: G.pl.dir });
  if (blocked(x + dx, y + dy, G.fol) || tileAt(G.map, x + dx, y + dy) === null) { G.fol.x = x; G.fol.y = y; G.fol.hidden = true; }
  G.fol.update(0);
  playMusic(G.map.music === 'route' && timeOfDay() === 'night' ? 'night' : G.map.music);
  if (prev !== G.map && (G.map.outdoor || ['gym', 'wayhouse', 'cave', 'castle', 'league', 'champion', 'legend'].includes(G.map.music))) G.banner = { text: G.map.name, t: NOW };
  if (G.map.outdoor) G.flags['v_' + id] = 1;
}
async function warp(id, x, y, dir) {
  G.lock++; sfx('door');
  await fadeOut(220); loadMap(id, x, y, dir); await wait(60); await fadeIn(220);
  G.lock--;
  autosave();
  if (G.map.onEnter) await G.map.onEnter();
}

// ================= OVERWORLD =================
function updateWorld(dt) {
  const p = G.pl;
  if (!G.lock && !UI.length && !p.mv) {
    if (pressed.start) { sfx('select'); G.lock++; push(new StartMenu()).then(() => G.lock--); return; }
    if (pressed.a) { interact(); return; }
    const d = ['up', 'down', 'left', 'right'].find(k => pressed[k]) || ['up', 'down', 'left', 'right'].find(k => held[k]);
    if (d) {
      if (d !== p.dir && pressed[d]) { p.dir = d; p.turnUntil = NOW + 110; }
      else if (!p.turnUntil || NOW >= p.turnUntil) tryMove(d);
    }
  }
}
function updateEntities(dt) {
  G.pl.update(dt); if (G.fol) G.fol.update(dt);
  for (const n of G.npcs) {
    n.update(dt);
    if (n.wander && !n.mv && !G.lock && !UI.length) {
      n.wt -= dt;
      if (n.wt <= 0) {
        n.wt = 1500 + Math.random() * 3000;
        const d = ['up', 'down', 'left', 'right'][rnd(0, 3)], [dx, dy] = DIRV[d];
        if (Math.abs(n.x + dx - n.hx) <= 1 && Math.abs(n.y + dy - n.hy) <= 1 && !blocked(n.x + dx, n.y + dy, n) && chance(.6)) n.moveTo(d, 300); else n.dir = d;
      }
    }
  }
}
async function tryMove(d) {
  const p = G.pl, m = G.map; p.dir = d;
  const [dx, dy] = DIRV[d], nx = p.x + dx, ny = p.y + dy;
  // leaving the map
  if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) {
    if (!m.outdoor) { if (d === 'down' && m.grid[p.y][p.x] === 'E') { const e = m.exitTo; await warp(e.map, e.x, e.y, 'down'); } else bump(); return; }
    const e = ny < 0 ? 'n' : ny >= m.h ? 's' : nx < 0 ? 'w' : 'e', ex = m.exits[e];
    const t = tileAt(m, nx, ny);
    if (ex && t && !SOLID.has(t)) {
      const n = MAPS[ex.to]; let tx = nx, ty = ny;
      if (e === 'n') { tx = nx + ex.dx; ty = n.h - 1; } else if (e === 's') { tx = nx + ex.dx; ty = 0; } else if (e === 'w') { tx = n.w - 1; ty = ny + ex.dx; } else { tx = 0; ty = ny + ex.dx; }
      G.lock++;
      const run = held.run, dur = run ? 130 : 230;
      await p.moveTo(d, dur);
      const fdir = G.fol && !G.fol.hidden;
      loadMap(ex.to, tx, ty, d);
      if (fdir) { const [bx, by] = DIRV[OPP[d]]; G.fol.x = tx + bx; G.fol.y = ty + by; G.fol.hidden = false; G.fol.dir = d; G.fol.update(0); }
      G.lock--;
      autosave();
      await onStep();
      return;
    }
    bump(); return;
  }
  const b = buildingAt(nx, ny);
  if (b) {
    if (!b.decor && d === 'up' && nx === b.door && ny === b.y + b.h - 1) {
      if (b.locked && b.locked()) { G.lock++; try { if (b.lockMsg) await say(b.lockMsg); else await S.gymLocked(); } finally { G.lock--; } return; }
      await warp(b.to, b.tx, b.ty, 'up'); return;
    }
    bump(); return;
  }
  if (G.fol && !G.fol.hidden && G.fol.x === nx && G.fol.y === ny) { /* swap with follower */ }
  else if (blocked(nx, ny, p)) { bump(); return; }
  G.lock++;
  const run = held.run, dur = run ? 130 : 230;
  const ox = p.x, oy = p.y;
  const pm = p.moveTo(d, dur);
  if (G.fol && lead()) {
    const f = G.fol;
    if (f.hidden || Math.abs(f.x - ox) + Math.abs(f.y - oy) !== 1) { f.x = ox; f.y = oy; f.hidden = false; f.dir = d; f.update(0); f.appear = NOW; }
    else { const fd = f.x < ox ? 'right' : f.x > ox ? 'left' : f.y < oy ? 'down' : 'up'; f.moveTo(fd, dur); }
  }
  await pm;
  G.lock--;
  await onStep();
}
let bumpT = 0;
function bump() { if (NOW - bumpT > 250) { sfx('bump'); bumpT = NOW; } }
async function onStep() {
  const p = G.pl, m = G.map;
  const t = tileAt(m, p.x, p.y);
  if (t === ',' || t === 'h' || t === 'v') G.rustle = { x: p.x, y: p.y, t: NOW };
  const wp = m.warps && m.warps[p.x + ',' + p.y];
  if (wp && (!wp[4] || G.flags[wp[4]])) { await warp(wp[0], wp[1], wp[2], wp[3]); return; }
  const tr = m.triggers.find(q => q.x === p.x && q.y === p.y);
  if (tr) { G.lock++; try { await tr.run(); } finally { G.lock--; } if (G.map !== m) return; }
  for (const n of G.npcs) {
    if (!n.trainer || G.flags[trKey(n)] || n.hidden) continue;
    const [dx, dy] = DIRV[n.dir];
    for (let i = 1; i <= n.trainer.sight; i++) {
      const x = n.x + dx * i, y = n.y + dy * i;
      if (x === p.x && y === p.y) { G.lock++; try { await trainerSpotted(n, i); } finally { G.lock--; } return; }
      const tt = tileAt(m, x, y); if (tt === null || SOLID.has(tt) || npcAt(x, y) || buildingAt(x, y)) break;
    }
  }
  if (G.flags.repel > 0) { G.flags.repel--; if (!G.flags.repel) { G.lock++; try { await msg('The Beastie Spray wore off.'); } finally { G.lock--; } } }
  if (ENC_TILES.has(t) && m.enc && m.enc[t] && lead() && !(G.flags.repel > 0) && chance(t === 'c' ? .07 : .09)) await wildBattle(m.enc[t]);
}
function pickEnc(list) {
  const night = timeOfDay() === 'night';
  const tab = list.filter(e => !e.time || (e.time === 'night') === night);
  if (!tab.length) return null;
  let r = Math.random() * tab.reduce((s, e) => s + e.w, 0), pick = tab[0];
  for (const e of tab) { r -= e.w; if (r <= 0) { pick = e; break; } }
  return pick;
}
async function wildBattle(list) {
  const pick = pickEnc(list); if (!pick) return;
  G.lock++;
  try {
    const res = await battle({ wild: newMon(pick.sp, rnd(pick.min, pick.max)) });
    if (res === 'lose') await blackout(); else autosave();
  } finally { G.lock--; }
}
async function fish() {
  const m = G.map;
  if (!m.fish) { await msg('Nothing seems to be biting here.'); return; }
  sfx('throw'); await msg(`${G.name} cast the line...`, { auto: 30 });
  await wait(500 + Math.random() * 900);
  if (Math.random() < .25) { await msg('Not even a nibble...'); return; }
  G.pl.emote = { s: '!', t: NOW }; sfx('alert'); await wait(500);
  await msg('Oh! A bite!', { auto: 25 });
  const pick = pickEnc(m.fish); if (!pick) return;
  const res = await battle({ wild: newMon(pick.sp, rnd(pick.min, pick.max)), bg: 'water' });
  if (res === 'lose') await blackout(); else autosave();
}
const trKey = n => 'tr_' + G.map.id + '_' + n.id;
async function trainerSpotted(n, dist) {
  playMusic('trainer'); n.alert = NOW; sfx('alert'); await wait(700); n.alert = 0;
  const [dx, dy] = DIRV[n.dir];
  for (let i = 1; i < dist; i++) await n.moveTo(n.dir, 230);
  G.pl.dir = OPP[n.dir];
  await trainerBattle(n);
  // a beaten trainer walks back to their post, so they can never be left blocking a narrow corridor
  if (dist > 1 && G.npcs.includes(n)) { const d0 = n.dir; for (let i = 1; i < dist; i++) await n.moveTo(OPP[d0], 180); n.dir = d0; }
}
async function trainerBattle(n) {
  await say(n.trainer.intro);
  const res = await battle({ trainer: { ...n.trainer, look: n.look } });
  if (res === 'lose') { await blackout(); return; }   // not marked as beaten: they will challenge again
  G.flags[trKey(n)] = 1;
  autosave();
}
async function blackout() {
  await fadeOut(400);
  healAll();
  if (/^(e4_|champ)/.test(G.map.id)) for (let i = 1; i <= 4; i++) delete G.flags['e4_' + i];
  const h = G.lastHeal; loadMap(h.map, h.x, h.y, 'up');
  await fadeIn(400);
  await say(h.map === 'home' ? ["Oh, love! You're back! You look worn out.", "Here, have a sit down... There. Your Beasties are right as rain again."] : ['Your Beasties have been restored to full health.', 'Please be careful out there!']);
  autosave();
}
function healAll() { G.party.forEach(healMon); }
async function interact() {
  const p = G.pl, [dx, dy] = DIRV[p.dir];
  let fx = p.x + dx, fy = p.y + dy;
  let n = npcAt(fx, fy);
  if (!n && tileAt(G.map, fx, fy) === 'C') { n = npcAt(fx + dx, fy + dy); }
  G.lock++;
  try {
    if (n) {
      if (n.item) { sfx('item'); const k = n.item, c = n.n || 1; G.bag[k] = (G.bag[k] || 0) + c; G.flags['got_' + G.map.id + n.id] = 1; G.npcs.splice(G.npcs.indexOf(n), 1); await msg(`${G.name} found ${c > 1 ? c + ' ' : aan(ITEMS[k].n)}${ITEMS[k].n}${c > 1 ? 's' : ''}!`); await msg(`${G.name} put the ${ITEMS[k].n} in the Bag.`); return; }
      if (!n.mv) n.dir = OPP[p.dir];
      if (n.trainer) { if (!G.flags[trKey(n)]) { await trainerBattle(n); } else await say(n.trainer.after); return; }
      if (n.talk) await n.talk(n);
      return;
    }
    if (G.fol && !G.fol.hidden && G.fol.x === fx && G.fol.y === fy && lead()) { await followerChat(); return; }
    const key = fx + ',' + fy;
    if (G.map.signs[key]) { await say(G.map.signs[key]); return; }
    if (G.map.machines && G.map.machines[key]) { await G.map.machines[key](); return; }
    const t = tileAt(G.map, fx, fy);
    if (G.map.id === 'lab' && t === 'D') { await S.labTable(fx); return; }
    if (t === 'O') { await say(G.flags.stones ? 'An ancient standing stone. Faint green lines glimmer deep in the rock.' : 'An ancient standing stone, crusted with lichen. It feels faintly warm.'); return; }
    if (t === 'B') { await say(['It\'s crammed with books.', ['"Beasties of the Northern Fells"', '"Ley Lines and You"', '"A Field Guide to Hedgerow Creatures"', '"101 Scones"'][rnd(0, 3)]]); return; }
    if (t === 't') { await say(['A programme about sheepdog trials is on.', 'The dogs are doing very well.']); return; }
    if (t === 'M' && G.map.id === 'lab') { await say('A research machine. It is printing a long list of numbers labelled "STONEBARROW - HUM READINGS".'); return; }
    if (t === '~' || (t === 'p' && tileAt(G.map, fx + dx, fy + dy) === '~')) { if (G.bag.oldrod && await ask('The water looks deep. Fish here?')) { await fish(); return; } await say('The water is cool and clear.'); return; }
    const b = buildingAt(fx, fy);
    if (b && b.decor && SETPIECE_TEXT[b.type]) { await say(SETPIECE_TEXT[b.type]()); return; }
    if (t === 'D') { await say('A sturdy wooden table.'); return; }
    if (t === 'Z') { await say(G.map.id.startsWith('rv_') ? 'A glass case holding a dragon scale as big as a dinner plate.' : 'A glass display case. Everything inside is labelled in tiny, neat handwriting.'); return; }
    if (t === 'U') { await say('A suit of armour. It seems to be watching you.'); return; }
    if (t === 'Y') { await say('A humming machine covered in dials and blinking lights.'); return; }
    if (t === 'I') { await say('A block of glittering blue ice. It never seems to melt.'); return; }
    if (t === 'G') { await say(['An old gravestone, worn smooth by the rain.', 'You can just make out the words: "Here sleeps a friend."']); return; }
  } finally { G.lock--; }
}
async function followerChat() {
  const m = lead(), tod = timeOfDay(), sp = SPECIES[m.sp], name = monName(m);
  G.fol.dir = OPP[G.pl.dir]; G.fol.heart = NOW;
  sfx('select');
  const lines = [`${name} is looking at you happily.`, `${name} is sniffing the air.`, `${name} gives you a nudge.`, `${name} seems very pleased to be out and about.`];
  if (tod === 'night') lines.push(`${name} is gazing up at the stars.`, `${name} yawns sleepily.`);
  if (tod === 'morning') lines.push(`${name} stretches in the morning sun.`);
  if (G.map.id === 'moor') lines.push(`${name} is staring towards the standing stones.`);
  if (G.map.ground === 'snow') lines.push(`${name} is catching snowflakes.`, `${name} is shivering a little.`);
  if (G.map.ground === 'cave') lines.push(`${name} is peering into the dark.`);
  if (G.map.music === 'sea') lines.push(`${name} is watching the waves.`);
  if (G.map.music === 'league' || G.map.music === 'champion') lines.push(`${name} looks ready for anything.`);
  if (G.map.ground === 'forest') lines.push(`${name} is sniffing the mossy logs.`);
  if (sp.types.includes('Fire')) lines.push(`${name}'s flame flickers cheerfully.`);
  if (sp.types.includes('Water')) lines.push(`${name} wants to go for a swim.`);
  if (sp.types.includes('Grass')) lines.push(`${name} is soaking up the fresh air.`);
  if (m.hp < m.st.hp / 3) lines.push(`${name} looks tired. Maybe it needs a rest.`);
  if (m.shiny) lines.push(`${name}'s unusual colours shimmer.`);
  await msg(lines[rnd(0, lines.length - 1)]);
}

// ================= RENDER WORLD =================
function camera() {
  const m = G.map, p = G.pl;
  let cx = p.px + 8 - W / 2, cy = p.py + 8 - H / 2;
  if (!m.outdoor) { if (m.w * 16 <= W) cx = (m.w * 16 - W) / 2; else cx = Math.max(0, Math.min(m.w * 16 - W, cx)); if (m.h * 16 <= H) cy = (m.h * 16 - H) / 2; else cy = Math.max(-16, Math.min(m.h * 16 - H + 16, cy)); }
  return [Math.round(cx), Math.round(cy)];
}
const PATHLIKE = new Set([':', 'X', 'p', 's', 'w', '=']), WATERLIKE = new Set(['~', 'p', 'w']), SANDLIKE = new Set(['s', ':', 'X', 'p', 'w', '=', '~']);
function nbMask(m, x, y, same) {
  const t = (dx, dy) => { const X = x + dx, Y = y + dy, c = tileAt(m, X, Y); if (c === null) return true; if (same === PATHLIKE && m.buildings.some(b => X >= b.x && X < b.x + b.w && Y >= b.y && Y < b.y + b.h)) return true; if (same === WATERLIKE && c === 'T' && (X < 0 || Y < 0 || X >= m.w || Y >= m.h)) return true; return same.has(c); };
  return (t(0, -1) ? 1 : 0) | (t(1, 0) ? 2 : 0) | (t(0, 1) ? 4 : 0) | (t(-1, 0) ? 8 : 0) | (t(1, -1) ? 16 : 0) | (t(1, 1) ? 32 : 0) | (t(-1, 1) ? 64 : 0) | (t(-1, -1) ? 128 : 0);
}
const GKEY = { moor: 'm', snow: 'n', cave: 'c', sand: 's', forest: 'f', indoor: 'i' };
const LGK = { n: 'n', v: 'n', s: 's', m: 'm', h: 'm', g: 'f', '.': 'g', ',': 'g' };
function localGround(m, x, y, gk) {
  const cnt = {}; let best = null, bn = 0;
  for (const [a, b] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { const g = LGK[tileAt(m, x + a, y + b)]; if (g) { cnt[g] = (cnt[g] || 0) + 1; if (cnt[g] > bn) { bn = cnt[g]; best = g; } } }
  return best || gk;
}
function tileInfo(m, ch, x, y) {
  const gk = GKEY[m.ground] || (m.outdoor ? 'g' : 'i');
  if (ch === '~' || ch === 'p') { const nb = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([a, b]) => tileAt(m, x + a, y + b)); return nbMask(m, x, y, WATERLIKE) + '|' + (nb.filter(c => c === 's').length >= 1 ? 's' : gk); }
  if (ch === ':' && m.outdoor) return nbMask(m, x, y, PATHLIKE) + '|' + gk;
  if (ch === 's') return nbMask(m, x, y, SANDLIKE) + '|' + gk;
  if (ch === 'r' || ch === 'o' || ch === 'N') { if (!m.outdoor) return m.floor === 'stone' || m.ground === 'cave' ? 'c' : 'i'; const lg = localGround(m, x, y, gk); return lg === 'm' ? 'moor' : lg; }
  if (m.outdoor && 'SufLTGFH'.includes(ch)) return localGround(m, x, y, gk);
  if (ch === '^' || ch === 'V' || ch === 'K') return (tileAt(m, x, y - 1) === ch || tileAt(m, x, y - 1) === '^' || tileAt(m, x, y - 1) === 'K' ? '' : 't') + (['^', 'V', 'K'].includes(tileAt(m, x, y + 1)) ? '' : 'b') + '|' + gk;
  if (ch === 'Q') return (tileAt(m, x, y + 1) === 'Q' || tileAt(m, x, y + 1) === null ? '' : 'b') + '|';
  if (m.outdoor) return '';
  const fl = m.floor || 'wood';
  if (ch === '#') { const below = tileAt(m, x, y + 1); return `|${fl}|${below === '#' || below === null || below === '@' ? 'top' : ''}|${m.wall || '#f0e0c0'}`; }
  if (ch === 'b') return `|${fl}|${tileAt(m, x, y - 1) === 'b' ? '' : 'top'}`;
  return `|${fl}`;
}
function drawWorld() {
  const m = G.map, [cx, cy] = camera();
  const f = Math.floor(NOW / 400) % 4, f2 = Math.floor(NOW / 600) % 2;
  R(0, 0, W, H, '#000');
  const x0 = Math.floor(cx / 16) - 1, y0 = Math.floor(cy / 16) - 1, x1 = x0 + 18, y1 = y0 + 15;
  const talls = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const ch = tileAt(m, x, y); if (ch === null) continue;
    const v = Math.floor(hash(x, y) * 4);
    const fr = ch === '~' || ch === 'p' ? f : ch === 'f' || ch === 'M' || ch === 't' ? f2 : 0;
    blit(tileCanvas(ch, v, fr, tileInfo(m, ch, x, y)), x * 16 - cx, y * 16 - cy);
    if (TALLTILE.has(ch)) talls.push({ y: y * 16 + 15.5, draw: () => { const lit = ch === 'L' ? timeOfDay() !== 'day' : ch === 'O' ? (G.stoneGlow || G.flags.stones) : ch === 'N' ? (m.ground === 'snow' || tileAt(m, x, y + 1) === 'n' || tileAt(m, x, y + 1) === 'v' || tileAt(m, x, y - 1) === 'n') : false; const s = tallSprite(ch, v, lit); blit(s, x * 16 - cx - (lw(s) - 16) / 2, y * 16 + 16 - lh(s) - cy); } });
    else { const it = interiorTall(m, ch, x, y, v); if (it) talls.push({ y: y * 16 + 15.5, draw: () => blit(it, x * 16 - cx - (lw(it) - 16) / 2, y * 16 + 16 - lh(it) - cy) }); }
  }
  const talls2 = [];
  for (const b of m.buildings) { if (drawBuildingArt(b, cx, cy, talls2)) continue; const bx = b.x * 16 - cx, by = b.y * 16 - cy, bh = b.h * 16, bw = b.w * 16; if (!b.decor) { R(bx + 3, by + bh - 1, bw - 3, 3, 'rgba(20,40,20,.2)'); R(bx + bw, by + Math.round(bh * .45), 3, Math.round(bh * .55) + 2, 'rgba(20,40,20,.2)'); } blit(buildingCanvas(b), bx, by); }
  // entities
  const ents = [...talls, ...talls2];
  for (const n of G.npcs) if (!n.hidden) ents.push({ y: n.py + 16, draw: () => drawEnt(n, cx, cy) });
  if (G.fol && !G.fol.hidden && lead()) ents.push({ y: G.fol.py + 15.9, draw: () => drawFollower(cx, cy) });
  ents.push({ y: G.pl.py + 16, draw: () => drawEnt(G.pl, cx, cy) });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  // grass overlays
  const over = e => { const t = tileAt(m, Math.round(e.px / 16), Math.round(e.py / 16)); if ((t === ',' || t === 'h') && !e.mv) { blit(grassOverlay(t), Math.round(e.px / 16) * 16 - cx, Math.round(e.py / 16) * 16 - cy); return; } if ((t === ',' || t === 'h' || t === 'v') && !e.mv) { const v = Math.floor(hash(Math.round(e.px / 16), Math.round(e.py / 16)) * 4); const key = 'ov' + t + v; if (!TILECACHE[key]) { const [c, x] = mk(16, 16); drawTall(x, t === ',' ? TALL : t === 'v' ? SNOWTALL : HEATH, v, true); TILECACHE[key] = c; } blit(TILECACHE[key], e.px - cx, e.py - cy + 1); } };
  [G.pl, ...G.npcs].forEach(over); if (G.fol && !G.fol.hidden) over(G.fol);
  if (G.rustle && NOW - G.rustle.t < 300) { const k = (NOW - G.rustle.t) / 300; const X = G.rustle.x * 16 - cx, Y = G.rustle.y * 16 - cy; for (let i = 0; i < 4; i++) R(X + 2 + i * 4 + Math.sin(i + k * 6) * 2, Y + 4 - k * 6, 2, 2, '#5cbc4c'); }
  // lighting
  if (m.outdoor) {
    const tod = timeOfDay();
    if (tod !== 'day') {
      ctx.save(); ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = { morning: '#fff0dc', evening: '#f4c098', night: '#6676b4' }[tod]; ctx.fillRect(0, 0, W * P, H * P);
      ctx.globalCompositeOperation = 'lighter';
      if (tod !== 'morning') {
        const glow = (x, y, r, a) => { const g = ctx.createRadialGradient(x * P, y * P, 0, x * P, y * P, r * P); g.addColorStop(0, `rgba(255,210,120,${a})`); g.addColorStop(1, 'rgba(255,200,100,0)'); ctx.fillStyle = g; ctx.fillRect((x - r) * P, (y - r) * P, r * 2 * P, r * 2 * P); };
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (tileAt(m, x, y) === 'L') glow(x * 16 + 8 - cx, y * 16 - 7 - cy, 34, tod === 'night' ? .35 : .18);
        for (const b of m.buildings) { buildingCanvas(b); for (const [wx, wy, ww, wh] of b.windows) { const X = b.x * 16 + wx - cx, Y = b.y * 16 + wy - cy; R(X, Y, ww, wh, tod === 'night' ? 'rgba(255,200,90,.55)' : 'rgba(255,200,90,.25)'); glow(X + ww / 2, Y + wh / 2, 16, tod === 'night' ? .22 : .1); } }
        if (tod === 'night') for (let i = 0; i < 7; i++) { const X = (i * 97 + Math.sin(NOW / 1400 + i) * 30) % W, Y = (i * 43 + Math.cos(NOW / 1700 + i * 2) * 20 + 40) % H; if (Math.sin(NOW / 300 + i * 3) > 0) R(X, Y, 1, 1, '#c8ff80'); }
      }
      ctx.restore();
    }
  }
  if (G.stoneFlash) R(0, 0, W, H, `rgba(120,255,220,${G.stoneFlash})`);
}
function drawEnt(e, cx, cy) {
  const X = Math.round(e.px) - cx, Y = Math.round(e.py) - cy;
  pell(X + 8, Y + 15, 6, 2, 'rgba(20,30,20,.22)');
  if (e.item) { blit(orbSprite(ITEMS[e.item].col), X + 2, Y + 3); return; }
  if (e.mon) { const img = creatureSprite(e.mon, 32, { hd: 1 }), bob = Math.round(Math.sin(NOW / 400 + e.x) * 1.5); pell(X + 8, Y + 15, 10, 3, 'rgba(20,30,20,.3)'); blit(img, X - 8, Y - 16 + bob); if (Math.floor(NOW / 260) % 6 === 0) { R(X + 14, Y - 14, 1, 3, '#fff8c0'); R(X + 13, Y - 13, 3, 1, '#fff8c0'); } return; }
  const look = LOOKS[e.look]; if (!look) return;
  const dir = e.dir === 'right' ? 'left' : e.dir;
  const ps = personSprite(look, dir, e.wf); blit(ps, X + 8 - lw(ps) / 2, Y + 16 - lh(ps), { flip: e.dir === 'right' });
  if (e.alert && NOW - e.alert < 700) { R(X + 4, Y - 20, 9, 11, '#383840'); R(X + 5, Y - 19, 7, 9, '#ffffff'); R(X + 7, Y - 18, 3, 5, '#e04040'); R(X + 7, Y - 12, 3, 2, '#e04040'); }
  if (e.emote && NOW - e.emote.t < 900) { R(X + 3, Y - 20, 11, 11, '#383840'); R(X + 4, Y - 19, 9, 9, '#ffffff'); txt(e.emote.s, X + 8.5, Y - 19.5, '#383840', null, 7, 'center'); }
}
function drawFollower(cx, cy) {
  const f = G.fol, m = lead(); if (!m) return;
  const X = Math.round(f.px) - cx, Y = Math.round(f.py) - cy;
  const back = f.dir === 'up', flip = f.dir === 'right';
  const img = creatureSprite(m.sp, 24, { back, shiny: m.shiny, hd: 1 });
  const [gx, bob, srx, dust] = gaitOffset(m.sp, f);
  let a = 1; if (f.appear && NOW - f.appear < 250) a = (NOW - f.appear) / 250;
  pell(X + 8, Y + 15, srx, 2, 'rgba(20,30,20,.22)');
  if (dust) { R(X + 1, Y + 14, 2, 1, 'rgba(240,230,200,.7)'); R(X + 13, Y + 13, 2, 1, 'rgba(240,230,200,.7)'); R(X + 3, Y + 12, 1, 1, 'rgba(240,230,200,.5)'); }
  blit(img, X - 4 + gx, Y - 7 + bob, { flip: back ? false : flip, alpha: a });
  if (f.heart && NOW - f.heart < 900) { const hy = Y - 20 - (NOW - f.heart) / 150; R(X + 5, hy, 2, 2, '#f05070'); R(X + 8, hy, 2, 2, '#f05070'); R(X + 4, hy + 1, 7, 2, '#f05070'); R(X + 5, hy + 3, 5, 1, '#f05070'); R(X + 6, hy + 4, 3, 1, '#f05070'); }
  if (m.shiny && Math.floor(NOW / 700) % 5 === 0) { R(X + 12, Y - 8, 1, 3, '#fff8a0'); R(X + 11, Y - 7, 3, 1, '#fff8a0'); }
}
function drawBanner() {
  const b = G.banner; if (!b) return; const k = (NOW - b.t) / 2400; if (k > 1) { G.banner = null; return; }
  const off = Math.round(k < .12 ? (1 - k / .12) * -34 : k > .88 ? ((k - .88) / .12) * -34 : 0);
  const w = Math.max(96, tw(b.text) + 28), x = 6, y = 4 + off, h = 26;
  R(x + 1, y + h, w - 2, 2, 'rgba(0,0,0,.25)');
  R(x + 1, y, w - 2, h, '#3a2412'); R(x, y + 1, w, h - 2, '#3a2412');
  R(x + 1, y + 1, w - 2, h - 2, '#b8804a');
  for (let yy = y + 2; yy < y + h - 2; yy += 6) { R(x + 2, yy + 5, w - 4, 1, '#8a5a30'); R(x + 2, yy, w - 4, 1, '#cc9660'); }
  R(x + 3, y + 3, w - 6, h - 6, 'rgba(90,50,20,.18)');
  for (const [px, py] of [[x + 4, y + 4], [x + w - 6, y + 4], [x + 4, y + h - 6], [x + w - 6, y + h - 6]]) { R(px, py, 2, 2, '#5a3a1c'); R(px, py, 1, 1, '#e8c090'); }
  txt(b.text, x + w / 2, y + 8, '#fff4dc', '#5a3418', 8, 'center');
}

// ================= SAVE =================
const SAVE_KEY = 'brackenshire_save_v1';
let CLOUD = null, cloudSave = null, cloudBusy = false, cloudPending = false, lastCloud = 0;
function serialize() {
  const clean = m => { const o = { ...m }; delete o._fainted; delete o.st; return o; };
  return { v: 1, t: Date.now(), name: G.name, map: G.map.id, x: G.pl.x, y: G.pl.y, dir: G.pl.dir, party: G.party.map(clean), box: G.box.map(clean), bag: G.bag, money: G.money, flags: G.flags, seen: G.seen, caught: G.caught, playtime: Math.round(G.playtime), lastHeal: G.lastHeal, opts: G.opts };
}
function readLocal() { try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function bestSave() { const l = readLocal(); if (l && cloudSave) return l.t >= cloudSave.t ? l : cloudSave; return l || cloudSave; }
async function saveGame(manual) {
  if (G.scene !== 'world' || !G.pl || !G.flags.intro) return;
  const d = serialize();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch (e) { }
  if (CLOUD && (manual || NOW - lastCloud > 20000)) {
    if (cloudBusy) { cloudPending = true; return; }
    cloudBusy = true; lastCloud = NOW;
    try { await CLOUD.set({ save: JSON.stringify(d), t: d.t }); cloudSave = d; } catch (e) { }
    cloudBusy = false;
    if (cloudPending) { cloudPending = false; saveGame(true); }
  }
}
function autosave() { saveGame(false); }
function restore(d) {
  G.name = d.name || 'Sam'; G.party = (d.party || []).map(m => { calcStats(m); m.hp = Math.min(m.hp, m.st.hp); return m; }); G.box = (d.box || []).map(m => { calcStats(m); return m; });
  G.bag = d.bag || {}; G.money = d.money ?? 3000; G.flags = d.flags || {}; G.seen = d.seen || {}; G.caught = d.caught || {}; G.playtime = d.playtime || 0; G.lastHeal = d.lastHeal || G.lastHeal; G.opts = d.opts || {};
  if (G.opts.sound === false) setSound(false); if (G.opts.text) textSpeed = G.opts.text;
  if (G.flags.starter) G.flags.v_hollowmere = 1; if (G.flags.stones) G.flags.v_millbrook = 1;
  UID = Date.now() % 100000;
  G.scene = 'world'; loadMap(d.map || 'home', d.x ?? 6, d.y ?? 5, d.dir || 'down');
  if (G.map.onEnter) { const f = G.map.onEnter; Promise.resolve().then(() => f()).catch(e => console.error(e)); }
}
(async () => {
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) return;
    const id = await user.id(); if (!id) return;
    const ref = db.doc('data/users/' + id + '/save');
    const snap = await ref.get();
    CLOUD = ref;
    if (snap.exists) { const d = snap.data(); if (d && d.save) cloudSave = JSON.parse(d.save); }
  } catch (e) { CLOUD = null; }
})();