// ---- ui ----
// ================= UI =================
const UI = [];
function push(ui) { return new Promise(res => { ui.done = v => { const i = UI.indexOf(ui); if (i >= 0) UI.splice(i, 1); res(v); }; UI.push(ui); }); }
function frame(x, y, w, h, st = 'msg') {
  const S = {
    msg: ['#2c3242', '#fbfbf6', '#7c94c8'], menu: ['#2c3242', '#fbfbf6', '#d08a4c'], dark: ['#14161e', '#262a38', '#4a5270'], panel: ['#2c3242', '#f2f4ea', '#8ab468'],
    battle: ['#2c3242', '#f8f4e8', '#c8a060']
  }[st] || st;
  const [o, f, b] = S; x = Math.round(x); y = Math.round(y);
  R(x + 2, y, w - 4, h, o); R(x, y + 2, w, h - 4, o); R(x + 1, y + 1, w - 2, h - 2, o);
  R(x + 2, y + 1, w - 4, h - 2, b); R(x + 1, y + 2, w - 2, h - 4, b);
  R(x + 2, y + 1, w - 4, 1, lt(b, .4)); R(x + 1, y + 2, 1, h - 4, lt(b, .25)); R(x + 2, y + h - 2, w - 4, 1, dk(b, .28)); R(x + w - 2, y + 2, 1, h - 4, dk(b, .15));
  R(x + 3, y + 3, w - 6, h - 6, dk(b, .35));
  R(x + 4, y + 4, w - 8, h - 8, f); R(x + 4, y + 4, w - 8, 1, dk(f, .06));
}
function wrap(text, width, size = 8) {
  const out = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) { const t = line ? line + ' ' + word : word; if (tw(t, size) > width && line) { out.push(line); line = word; } else line = t; }
    out.push(line);
  }
  return out;
}
const sub = s => s.replace(/\{P\}/g, G.name || 'Sam').replace(/\{R\}/g, 'Crispin');
let textSpeed = 2; // chars per frame
class MsgBox {
  constructor(text, o = {}) {
    this.o = o; const lines = wrap(sub(text), 226);
    this.pages = []; for (let i = 0; i < lines.length; i += 2) this.pages.push(lines.slice(i, i + 2));
    this.pi = 0; this.ch = 0; this.t = 0; this.resolved = false;
  }
  get full() { return this.pages[this.pi].join('').length; }
  update() {
    if (this.ch < this.full) { this.ch += textSpeed; if (A() || Bk()) this.ch = this.full; if (Math.floor(this.ch) % 3 === 0) sfx('blip'); return; }
    if (this.o.hold && this.pi === this.pages.length - 1) { if (!this.resolved) { this.resolved = true; this.o.onHold && this.o.onHold(); this.done2(); } return; }
    this.t++;
    if (A() || Bk() || (this.o.auto && this.t > this.o.auto)) { if (this.pi < this.pages.length - 1) { this.pi++; this.ch = 0; this.t = 0; sfx('blip'); } else this.done(); }
  }
  draw() {
    const y = 144; frame(2, y, 252, 46, this.o.style || 'msg');
    let left = Math.floor(this.ch);
    this.pages[this.pi].forEach((ln, i) => { const s = ln.slice(0, Math.max(0, left)); left -= ln.length; txt(s, 12, y + 9 + i * 16, '#383840', '#d0ccc0'); });
    if (this.ch >= this.full && !this.o.hold && !this.o.auto && Math.floor(NOW / 300) % 2) { R(238, y + 34, 6, 2, '#d06040'); R(239, y + 36, 4, 1, '#d06040'); R(240, y + 37, 2, 1, '#d06040'); }
  }
}
function msg(text, o = {}) { const b = new MsgBox(text, o); if (o.hold) { return new Promise(res => { b.done2 = () => res(b); push(b); }); } return push(b); }
async function say(lines, o) { if (!Array.isArray(lines)) lines = [lines]; for (const l of lines) await msg(l, o); }
class ListMenu {
  constructor(items, o = {}) { this.items = items; this.o = o; this.i = o.start || 0; this.w = o.w || Math.max(...items.map(s => tw(typeof s === 'string' ? s : s.label))) + 30; this.h = items.length * 15 + 12; this.x = o.x !== undefined ? o.x : 250 - this.w; this.y = o.y !== undefined ? o.y : 140 - this.h; }
  update() {
    if (dirPressed('up')) { this.i = (this.i + this.items.length - 1) % this.items.length; sfx('blip'); }
    if (dirPressed('down')) { this.i = (this.i + 1) % this.items.length; sfx('blip'); }
    if (A()) { sfx('select'); this.done(this.i); }
    else if (Bk() && this.o.cancel !== false) { sfx('back'); this.done(-1); }
  }
  draw() {
    frame(this.x, this.y, this.w, this.h, 'menu');
    this.items.forEach((s, i) => { hot(this.x + 3, this.y + 5 + i * 15, this.w - 6, 15, () => { this.i = i; }); const lab = typeof s === 'string' ? s : s.label; txt(lab, this.x + 16, this.y + 7 + i * 15, s.dim ? '#a0a0a0' : '#383840', '#d8d0c0'); if (i === this.i) { const cy = this.y + 10 + i * 15; R(this.x + 7, cy, 2, 7, '#383840'); R(this.x + 9, cy + 1, 1, 5, '#383840'); R(this.x + 10, cy + 2, 1, 3, '#383840'); } });
  }
}
const choose = (items, o) => push(new ListMenu(items, o));
async function ask(text, o = {}) { const b = await msg(text, { hold: true }); const r = await choose(['Yes', 'No'], { x: 204, y: 104, cancel: true, ...o }); b.done(); return r === 0; }
class NumMenu {
  constructor(max, price) { this.v = 1; this.max = max; this.price = price; }
  update() {
    if (dirPressed('up')) { this.v = this.v >= this.max ? 1 : this.v + 1; sfx('blip'); }
    if (dirPressed('down')) { this.v = this.v <= 1 ? this.max : this.v - 1; sfx('blip'); }
    if (dirPressed('right')) { this.v = Math.min(this.max, this.v + 10); sfx('blip'); }
    if (dirPressed('left')) { this.v = Math.max(1, this.v - 10); sfx('blip'); }
    if (A()) { sfx('select'); this.done(this.v); } else if (Bk()) { sfx('back'); this.done(0); }
  }
  draw() { frame(150, 106, 100, 34, 'menu'); txt('x' + String(this.v).padStart(2, '0'), 160, 118); txt('£' + this.v * this.price, 242, 118, '#383840', '#d8d0c0', 8, 'right'); R(168, 111, 4, 2, '#d06040'); R(168, 133, 4, 2, '#d06040'); }
}
// fade overlay
let FADE = 0;
const fadeOut = (ms = 250) => tween(ms, t => FADE = t);
const fadeIn = (ms = 250) => tween(ms, t => FADE = 1 - t);
function hpBar(x, y, w, frac) {
  R(x, y - 1, w, 5, '#2c3242'); R(x - 1, y, w + 2, 3, '#2c3242'); R(x, y, w, 3, '#5c6474');
  const col = frac > .5 ? '#48d070' : frac > .2 ? '#f0c030' : '#f05040', fw = Math.max(frac > 0 ? 1 : 0, Math.round(w * Math.max(0, Math.min(1, frac))));
  R(x, y, fw, 3, col); R(x, y, fw, 1, lt(col, .5)); R(x, y + 2, fw, 1, dk(col, .18));
}
function pill(x, y, w, h, c) { R(x + 1, y, w - 2, h, dk(c, .45)); R(x, y + 1, w, h - 2, dk(c, .45)); R(x + 1, y + 1, w - 2, h - 2, c); R(x + 1, y + 1, w - 2, 1, lt(c, .35)); R(x + 1, y + h - 2, w - 2, 1, dk(c, .15)); }
function typeBadge(t, x, y) { const w = 36; pill(x, y, w, 9, TCOL[t]); txt(t, x + w / 2, y + 2, '#ffffff', null, 5.5, 'center'); }
const STATUS_COL = { psn: ['PSN', '#a040a0'], brn: ['BRN', '#f08030'], par: ['PAR', '#d8b020'], slp: ['SLP', '#8888a0'], fnt: ['FNT', '#c83838'] };
function statusBadge(st, x, y) { if (!st) return; const [s, c] = STATUS_COL[st]; pill(x, y, 20, 9, c); txt(s, x + 10, y + 2, '#fff', null, 5.5, 'center'); }
const BGPAT = {};
function bgScreen(col = '#2a3448', col2 = '#34405a') {
  const key = col + col2;
  if (!BGPAT[key]) { const [c, x] = mk(W + 16, H + 16); x.fillStyle = col; x.fillRect(0, 0, W + 16, H + 16); x.fillStyle = col2;
    for (let y = 0; y < H + 16; y++) for (let X = 0; X < W + 16; X++) { const a = ((X + y) & 15) < 8, b = ((X - y + 512) & 15) < 8; if (a !== b) x.fillRect(X, y, 1, 1); }
    x.fillStyle = lt(col2, .08); for (let y = 0; y < H + 16; y += 16) for (let X = 0; X < W + 16; X += 16) x.fillRect(X + 7, y, 2, 1);
    BGPAT[key] = c; }
  const o = Math.floor(NOW / 90) % 16; blit(BGPAT[key], -o, -o);
}

// ---------- Party ----------
class PartyScreen {
  constructor(mode = 'view', o = {}) { this.mode = mode; this.o = o; this.i = 0; this.swapFrom = -1; }
  update() {
    const n = G.party.length + 1;
    if (dirPressed('up')) { this.i = (this.i + n - 1) % n; sfx('blip'); }
    if (dirPressed('down')) { this.i = (this.i + 1) % n; sfx('blip'); }
    if (dirPressed('left') && this.i < G.party.length && this.i % 2 === 1) { this.i--; sfx('blip'); }
    if (dirPressed('right') && this.i < G.party.length - 1 && this.i % 2 === 0) { this.i++; sfx('blip'); }
    if (Bk()) { if (this.swapFrom >= 0) { this.swapFrom = -1; sfx('back'); return; } if (this.o.forced) return; sfx('back'); this.done(-1); return; }
    if (A()) {
      sfx('select');
      if (this.i === G.party.length) { if (!this.o.forced) this.done(-1); return; }
      if (this.swapFrom >= 0) { const a = this.swapFrom, b = this.i; [G.party[a], G.party[b]] = [G.party[b], G.party[a]]; this.swapFrom = -1; return; }
      this.menu();
    }
  }
  async menu() {
    const m = G.party[this.i];
    this.busy = true;
    if (this.mode === 'pick') { this.done(this.i); return; }
    if (this.mode === 'battle') {
      const r = await choose(['Send out', 'Summary', 'Cancel'], { x: 176, y: 120 });
      if (r === 0) { this.done(this.i); return; }
      if (r === 1) await push(new SummaryScreen(this.i));
      return;
    }
    const opts = ['Summary', 'Switch', 'Cancel'];
    const r = await choose(opts, { x: 176, y: 106 });
    if (r === 0) await push(new SummaryScreen(this.i));
    else if (r === 1) { this.swapFrom = this.i; }
  }
  draw() {
    bgScreen('#3a5a48', '#426450');
    G.party.forEach((m, i) => {
      const x = 4 + (i % 2) * 126, y = 4 + Math.floor(i / 2) * 44, sel = i === this.i;
      hot(x, y, 122, 40, () => { this.i = i; });
      frame(x, y, 122, 40, sel ? ['#30384a', '#fff8e0', '#f0a040'] : this.swapFrom === i ? ['#30384a', '#e0f0ff', '#4080d0'] : ['#30384a', '#e8ece0', '#7a9a80']);
      const ic = creatureSprite(m.sp, 32, { shiny: m.shiny }); blit(ic, x + 3, y + 4 + (sel && Math.floor(NOW / 250) % 2 ? -1 : 0));
      txt(monName(m), x + 38, y + 5, '#383840', '#d0ccc0', 7); if (m.shiny) txt('★', x + 112, y + 5, '#e0a020', null, 6, 'right');
      txt('Lv' + m.lvl, x + 38, y + 16, '#383840', null, 6);
      hpBar(x + 66, y + 19, 48, m.hp / m.st.hp);
      txt(`${m.hp}/${m.st.hp}`, x + 114, y + 25, '#383840', null, 6, 'right');
      if (m.hp <= 0) statusBadge('fnt', x + 38, y + 27); else statusBadge(m.status, x + 38, y + 27);
    });
    const cy = 4 + 3 * 44 + 2; hot(170, cy, 82, 22, () => { this.i = G.party.length; }); frame(170, cy, 82, 22, this.i === G.party.length ? ['#30384a', '#fff8e0', '#f0a040'] : 'menu'); txt(this.o.forced ? '' : 'Back', 211, cy + 6, '#383840', null, 7, 'center');
    frame(4, cy, 162, 22, 'panel'); txt(this.swapFrom >= 0 ? 'Move to where?' : this.o.prompt || (this.mode === 'battle' ? 'Choose a Beastie.' : this.mode === 'pick' ? 'Use on which Beastie?' : 'Your team'), 12, cy + 6, '#383840', null, 7);
  }
}
// ---------- Summary ----------
class SummaryScreen {
  constructor(i, list) { this.list = list || G.party; this.i = i; this.page = 0; }
  update() {
    if (dirPressed('up') && this.list.length > 1) { this.i = (this.i + this.list.length - 1) % this.list.length; sfx('blip'); }
    if (dirPressed('down') && this.list.length > 1) { this.i = (this.i + 1) % this.list.length; sfx('blip'); }
    if (dirPressed('right')) { this.page = (this.page + 1) % 3; sfx('blip'); } if (dirPressed('left')) { this.page = (this.page + 2) % 3; sfx('blip'); }
    if (Bk() || A()) { sfx('back'); this.done(); }
  }
  draw() {
    const m = this.list[this.i], sp = SPECIES[m.sp];
    bgScreen('#4a4058', '#52486a');
    frame(4, 4, 104, 118, ['#30384a', '#f0f4e8', '#9ab8d0']);
    R(8, 8, 96, 70, '#d8e8d0'); R(8, 62, 96, 16, '#c0d8b8');
    blit(creatureSprite(m.sp, 64, { shiny: m.shiny }), 24, 10);
    if (m.shiny) txt('★ Shiny', 100, 9, '#d09010', null, 6, 'right');
    txt(monName(m), 10, 80, '#383840', '#d0ccc0', 8); txt('Lv' + m.lvl, 101, 81, '#383840', null, 7, 'right');
    sp.types.forEach((t, k) => typeBadge(t, 10 + k * 38, 94));
    txt('#' + String(DEX_ORDER.indexOf(m.sp) + 1).padStart(3, '0') + ' ' + sp.n, 10, 107, '#6a6a78', null, 6);
    frame(112, 4, 140, 184, 'panel');
    ['STATS', 'MOVES', 'INFO'].forEach((t, i) => { const x = 120 + i * 42; if (i === this.page) pill(x - 2, 9, 40, 11, '#6a9a50'); txt(t, x + 18, 12, i === this.page ? '#ffffff' : '#8a9a80', null, 5.5, 'center'); });
    if (this.page === 0) {
      txt('HP', 120, 26, '#383840', null, 7); txt(`${m.hp}/${m.st.hp}`, 244, 26, '#383840', null, 7, 'right'); hpBar(160, 38, 84, m.hp / m.st.hp);
      const lab = { atk: 'Attack', def: 'Defence', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
      ['atk', 'def', 'spa', 'spd', 'spe'].forEach((k, j) => { txt(lab[k], 120, 48 + j * 13, '#383840', null, 7); txt(String(m.st[k]), 244, 48 + j * 13, '#383840', null, 7, 'right'); });
      const nx = m.lvl >= 100 ? 0 : xpFor(m.lvl + 1) - m.xp;
      txt('To next Lv', 120, 118, '#383840', null, 7); txt(String(nx), 244, 118, '#383840', null, 7, 'right');
      const fr = m.lvl >= 100 ? 1 : (m.xp - xpFor(m.lvl)) / (xpFor(m.lvl + 1) - xpFor(m.lvl)); R(120, 131, 124, 3, '#505860'); R(120, 131, Math.round(124 * fr), 3, '#48a8e8');
    } else if (this.page === 2) {
      txt('No. ' + String(DEX_ORDER.indexOf(m.sp) + 1).padStart(3, '0'), 120, 26, '#383840', null, 7);
      sp.types.forEach((t, k) => typeBadge(t, 170 + k * 38, 27));
      wrap(sp.dex, 124, 7).forEach((l, j) => txt(l, 120, 44 + j * 12, '#4a4a58', null, 7));
      txt('Met at Lv ' + (m.metLvl || m.lvl), 120, 170, '#8a9a80', null, 7);
    } else {
      m.moves.forEach((mv, j) => { const M = MOVES[mv.id]; const y = 24 + j * 38; typeBadge(M.t, 120, y); txt(M.n, 158, y, '#383840', null, 7); txt(`PP ${mv.pp}/${M.pp}`, 244, y + 12, '#383840', null, 6, 'right'); txt(M.c === 'st' ? 'Status' : `Power ${M.pw}`, 120, y + 12, '#6a6a78', null, 6); txt(M.ac ? `Acc ${M.ac}` : 'Acc --', 120, y + 22, '#6a6a78', null, 6); });
    }
    frame(4, 126, 104, 62, ['#30384a', '#f0f4e8', '#9ab8d0']);
    txt('Status', 10, 132, '#383840', null, 6); if (m.status) statusBadge(m.status, 80, 132); else txt('OK', 100, 132, '#4a8a4a', null, 6, 'right');
    txt('↑↓ Beastie', 10, 148, '#8a8a98', null, 7); txt('◀▶ Page', 10, 161, '#8a8a98', null, 7); txt('X Back', 10, 174, '#8a8a98', null, 7);
  }
}
// ---------- Bag ----------
const POCKETS = [['ITEMS', k => !['ball', 'key'].includes(ITEMS[k].kind)], ['ORBS', k => ITEMS[k].kind === 'ball'], ['KEY ITEMS', k => ITEMS[k].kind === 'key']];
class BagScreen {
  constructor(mode = 'field') { this.mode = mode; this.i = 0; this.top = 0; this.pk = mode === 'battle' ? 0 : 0; }
  items() { return ITEM_ORDER.filter(k => G.bag[k] > 0 && POCKETS[this.pk][1](k)); }
  update() {
    if (this.busy) return;
    const it = this.items(); const n = it.length + 1;
    if (dirPressed('left') || dirPressed('right')) { this.pk = (this.pk + (dirPressed('left') ? 2 : 1)) % 3; this.i = 0; this.top = 0; sfx('blip'); return; }
    if (dirPressed('up')) { this.i = (this.i + n - 1) % n; sfx('blip'); }
    if (dirPressed('down')) { this.i = (this.i + 1) % n; sfx('blip'); }
    if (this.i < this.top) this.top = this.i; if (this.i > this.top + 8) this.top = this.i - 8;
    if (Bk()) { sfx('back'); this.done(null); return; }
    if (A()) { sfx('select'); if (this.i >= it.length) { this.done(null); return; } this.use(it[this.i]); }
  }
  async use(k) {
    this.busy = true;
    const I = ITEMS[k];
    try {
      if (I.kind === 'ball') {
        if (this.mode === 'battle') { this.done({ item: k }); return; }
        await msg("There's a time and place for everything. Save it for a wild Beastie!");
      } else if (I.kind === 'key') {
        await msg(k === 'oldrod' ? 'Face some water and press Z to cast your line.' : k === 'coachpass' ? 'Show it to a coach driver at any Wayhouse.' : this.mode === 'battle' ? "That can't be used now." : 'Better keep that safe.');
      } else if (I.kind === 'spray') {
        if (this.mode === 'battle') await msg("That can't be used in a battle.");
        else if (G.flags.repel > 0) await msg('The last Beastie Spray is still working.');
        else { G.bag[k]--; G.flags.repel = I.amt; sfx('heal'); await msg(`${G.name} used a ${I.n}. Wild Beasties will keep away for a while.`); }
      } else {
        const r = await choose(['Use', 'Cancel'], { x: 180, y: 100 });
        if (r === 0) {
          const pi = await push(new PartyScreen('pick'));
          if (pi >= 0) {
            const m = G.party[pi]; const ok = useItemOn(k, m);
            if (!ok) await msg("It won't have any effect.");
            else if (this.mode === 'battle') { this.done({ item: k, target: pi, text: ok }); return; }
            else { sfx('heal'); await msg(ok); }
          }
        }
      }
    } finally { this.busy = false; }
    if (this.i > this.items().length) this.i = this.items().length;
  }
  draw() {
    bgScreen('#6a4a30', '#74523a');
    frame(4, 4, 150, 184, ['#30384a', '#fbf4e4', '#c89060']);
    txt('◀ ' + POCKETS[this.pk][0] + ' ▶', 79, 10, '#8a5a30', null, 7, 'center');
    const it = this.items(), rows = [...it, null].slice(this.top, this.top + 9);
    rows.forEach((k, j) => { const y = 28 + j * 16; hot(8, y - 4, 144, 16, () => { this.i = this.top + j; }); if (k) { txt(ITEMS[k].n, 22, y, '#383840', null, 7); if (ITEMS[k].kind !== 'key') txt('x' + G.bag[k], 146, y, '#383840', null, 7, 'right'); } else txt('Close', 22, y, '#383840', null, 7); });
    if (!it.length) txt('(empty)', 79, 60, '#b0a090', null, 7, 'center');
    const cy = 31 + (this.i - this.top) * 16; R(12, cy, 2, 7, '#383840'); R(14, cy + 1, 1, 5, '#383840'); R(15, cy + 2, 1, 3, '#383840');
    txt('£' + G.money, 146, 173, '#8a5a30', null, 7, 'right');
    frame(158, 4, 94, 184, 'panel');
    const k = it[this.i];
    if (k) { const I = ITEMS[k]; if (I.kind === 'ball') blit(orbSprite(I.col), 196, 18); else if (I.kind === 'key') { R(194, 16, 18, 14, '#8a6a3a'); R(195, 17, 16, 12, '#e8c878'); R(198, 20, 10, 2, '#8a6a3a'); R(198, 24, 7, 2, '#8a6a3a'); } else { R(196, 16, 14, 16, '#6a8a4a'); R(198, 14, 10, 4, '#c8a060'); R(197, 20, 12, 10, I.kind === 'revive' ? '#f0c040' : I.kind === 'cure' ? '#f0f0e0' : I.kind === 'pp' ? '#b070e0' : I.kind === 'spray' ? '#70d0a0' : k === 'supertonic' ? '#e05070' : k === 'hypertonic' ? '#e09030' : k === 'maxtonic' ? '#f0e060' : '#70c0e0'); }
      wrap(I.desc, 80, 6).forEach((l, j) => txt(l, 164, 44 + j * 11, '#383840', null, 6)); }
    if (G.flags.repel > 0 && this.pk === 0) txt(`Spray: ${G.flags.repel} steps`, 205, 176, '#5a8a5a', null, 5.5, 'center');
  }
}
function useItemOn(k, m) {
  const I = ITEMS[k];
  if (I.kind === 'heal') { if (m.hp <= 0 || m.hp >= m.st.hp) return false; const h = Math.min(I.amt, m.st.hp - m.hp); m.hp += h; G.bag[k]--; return `${monName(m)} recovered ${h} HP.`; }
  if (I.kind === 'cure') { if (!m.status || m.hp <= 0) return false; m.status = null; m.slp = 0; G.bag[k]--; return `${monName(m)} feels much better.`; }
  if (I.kind === 'revive') { if (m.hp > 0) return false; m.hp = Math.floor(m.st.hp / 2); m.status = null; G.bag[k]--; return `${monName(m)} is back on its feet!`; }
  if (I.kind === 'pp') { if (m.moves.every(mv => mv.pp >= MOVES[mv.id].pp)) return false; m.moves.forEach(mv => mv.pp = Math.min(MOVES[mv.id].pp, mv.pp + I.amt)); G.bag[k]--; return `${monName(m)}'s moves had their PP restored.`; }
  return false;
}
// ---------- Journal ----------
class JournalScreen {
  constructor() { this.i = 0; this.top = 0; }
  update() {
    const n = DEX_ORDER.length;
    if (dirPressed('up')) { this.i = Math.max(0, this.i - 1); sfx('blip'); }
    if (dirPressed('down')) { this.i = Math.min(n - 1, this.i + 1); sfx('blip'); }
    if (dirPressed('left')) { this.i = Math.max(0, this.i - 8); sfx('blip'); }
    if (dirPressed('right')) { this.i = Math.min(n - 1, this.i + 8); sfx('blip'); }
    if (this.i < this.top) this.top = this.i; if (this.i > this.top + 8) this.top = this.i - 8;
    if (Bk() || A()) { sfx('back'); this.done(); }
  }
  draw() {
    bgScreen('#6a2a2a', '#743434');
    frame(4, 4, 112, 184, ['#30384a', '#fbf0e0', '#d07060']);
    txt('FIELD JOURNAL', 10, 9, '#a04040', null, 7);
    DEX_ORDER.slice(this.top, this.top + 9).forEach((id, j) => {
      const k = this.top + j, y = 24 + j * 16, seen = G.seen[id], caught = G.caught[id];
      if (k === this.i) R(8, y - 2, 104, 14, '#f4d8b8');
      txt(String(k + 1).padStart(3, '0'), 12, y, '#8a6a60', null, 6);
      if (caught) blit(orbSprite(), 31, y - 2, { dw: 10, dh: 10 });
      txt(seen ? SPECIES[id].n : '-----', 44, y, '#383840', null, 7);
    });
    frame(120, 4, 132, 184, ['#30384a', '#f4f0e8', '#d07060']);
    const id = DEX_ORDER[this.i], seen = G.seen[id], caught = G.caught[id];
    R(126, 10, 120, 76, '#e8e0d0');
    if (seen) blit(creatureSprite(id, 64), 154, 16); else txt('?', 186, 30, '#c8bca8', null, 28, 'center');
    txt(seen ? SPECIES[id].n : '???', 128, 92, '#383840', null, 8);
    if (seen) SPECIES[id].types.forEach((t, k) => typeBadge(t, 128 + k * 38, 106));
    const d = caught ? SPECIES[id].dex : seen ? 'Catch one to learn more about it.' : 'Not yet seen.';
    wrap(d, 116, 7).slice(0, 7).forEach((l, j) => txt(l, 128, 120 + j * 10, '#4a4a58', null, 7));
    const nc = Object.keys(G.caught).length, ns = Object.keys(G.seen).length;
    R(8, 170, 104, 1, '#e0c8b0'); txt(`SEEN ${ns}`, 12, 176, '#a06050', null, 5.5); txt(`CAUGHT ${nc}`, 108, 176, '#a06050', null, 5.5, 'right');
  }
}
// ---------- Trainer card ----------
class CardScreen {
  update() { if (A() || Bk()) { sfx('back'); this.done(); } }
  draw() {
    bgScreen('#2a4a6a', '#305274');
    frame(12, 16, 232, 150, ['#30384a', '#f4f8ff', '#e0b040']);
    txt('TRAINER CARD', 24, 24, '#3a5a8a', null, 8);
    blitPerson(LOOKS.player, 210, 78, 32, 44);
    const pt = Math.floor(G.playtime / 60000);
    const rows = [['Name', G.name], ['Money', '£' + G.money], ['Journal', `${Object.keys(G.caught).length} caught`], ['Play time', `${Math.floor(pt / 60)}:${String(pt % 60).padStart(2, '0')}`], ['Time of day', timeName()]];
    rows.forEach(([a, b], i) => { txt(a, 24, 44 + i * 16, '#6a7088', null, 7); txt(b, 170, 44 + i * 16, '#383840', null, 7, 'right'); });
    txt('BADGES', 24, 128, '#6a7088', null, 7);
    for (let i = 0; i < 8; i++) { const x = 24 + i * 26, y = 140; R(x, y, 20, 18, '#d8dce8'); if (G.flags['badge' + (i + 1)]) drawBadge(x + 1, y, 1, i + 1); }
    if (G.flags.champion) { txt('CHAMPION', 214, 128, '#c89020', '#6a4a10', 7, 'right'); }
  }
}
const BADGES = {};
const BADGE_INFO = [null, ['Honeycomb', 'Hazel'], ['Spark', 'Ada'], ['Tide', 'Maren'], ['Flint', 'Gideon'], ['Bloom', 'Briony'], ['Iron', 'Sir Percival'], ['Frost', 'Elspeth'], ['Wyrm', 'Caradoc']];
function makeBadge(n) {
  const [c, bx] = mk(17, 17); const { p } = pctx(bx);
  const inHex = (X, Y, rr) => { for (let a = 0; a < 6; a++) { const ang = Math.PI / 3 * a; if ((X - 8.5) * Math.cos(ang) + (Y - 8.5) * Math.sin(ang) > rr * .866) return false; } return true; };
  if (n === 1) {
    for (let Y = 0; Y < 17; Y++) for (let X = 0; X < 17; X++) { const X2 = X + .5, Y2 = Y + .5; if (inHex(X2, Y2, 5)) p(X, Y, (X + Y) < 14 ? '#fff4c0' : '#f8d860'); else if (inHex(X2, Y2, 7.4)) p(X, Y, (X2 - 8.5) + (Y2 - 8.5) < 0 ? '#ffd848' : '#e0a820'); else if (inHex(X2, Y2, 8.6)) p(X, Y, '#6a4a10'); }
    for (const [X, Y] of [[6, 7], [7, 6], [9, 6], [10, 7], [8, 9], [7, 10], [9, 10]]) p(X, Y, '#3a3040');
    return c;
  }
  const PAL = { 2: ['#a8d8ff', '#4a88e0', '#2a58a8', '#1a2a58', '#ffe040'], 3: ['#c8f0ff', '#48b8f0', '#2878c0', '#123a60', '#ffffff'], 4: ['#e8dcc8', '#b8a488', '#7a6a58', '#3a3028', '#f4ecd8'],
    5: ['#ffd8e8', '#f08ab0', '#c04a80', '#5a1a38', '#ffe060'], 6: ['#f4f6fa', '#c0c8d4', '#8a94a4', '#3a4250', '#3a58a8'], 7: ['#ffffff', '#c8e8fa', '#8ab8e0', '#2a4a70', '#ffffff'], 8: ['#ffb0a0', '#e04a3a', '#a02820', '#4a0e0a', '#ffd040'] }[n];
  const shape = {
    2: (x, y, g) => x * x + y * y <= (7.6 + g) ** 2,
    3: (x, y, g) => y > -1 ? x * x + (y - 2) ** 2 <= (6 + g) ** 2 : Math.abs(x) <= (y + 8.5) * .62 + g,
    4: (x, y, g) => Math.abs(x) + Math.abs(y) <= 8 + g,
    5: (x, y, g) => [0, 1, 2, 3, 4].some(i => { const a = i / 5 * Math.PI * 2 - Math.PI / 2; return (x - Math.cos(a) * 4.4) ** 2 + (y - Math.sin(a) * 4.4) ** 2 <= (3.6 + g) ** 2; }) || x * x + y * y <= (3 + g) ** 2,
    6: (x, y, g) => y <= 1 ? Math.abs(x) <= 7 + g && y >= -7.5 - g : Math.abs(x) <= 7 + g - (y - 1) * 1.05,
    7: (x, y, g) => { const r = Math.hypot(x, y), a = Math.atan2(y, x); return r <= 4.2 + 3.8 * Math.abs(Math.cos(3 * a)) ** 3 + g || r <= 3 + g; },
    8: (x, y, g) => x * x + y * y <= (7.8 + g) ** 2 && !((x - 3.5) ** 2 + (y + 4.5) ** 2 < (3.5 - g) ** 2),
  }[n];
  for (let Y = 0; Y < 17; Y++) for (let X = 0; X < 17; X++) { const x = X - 8, y = Y - 8;
    if (shape(x, y, 0)) { const edge = !shape(x, y, -1.1); p(X, Y, edge ? ((x + y) < 0 ? PAL[0] : PAL[2]) : ((x + y) < -3 ? PAL[0] : (x + y) > 4 ? PAL[2] : PAL[1])); }
    else if (shape(x, y, 1)) p(X, Y, PAL[3]); }
  const E = PAL[4], dots = {
    2: [[9, 3], [8, 4], [9, 4], [7, 5], [8, 5], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [9, 7], [8, 8], [9, 8], [7, 9], [8, 9], [7, 10], [6, 11], [7, 11], [6, 12]],
    3: [[5, 11], [6, 10], [7, 10], [8, 11], [9, 11], [10, 10], [11, 10], [6, 13], [7, 12], [8, 12], [9, 13], [10, 13], [11, 12]],
    4: [[8, 3], [8, 4], [7, 5], [9, 6], [8, 7], [7, 8], [8, 9], [9, 10], [8, 11]],
    5: [[7, 7], [8, 7], [9, 7], [7, 8], [8, 8], [9, 8], [7, 9], [8, 9], [9, 9], [8, 6], [6, 8], [10, 8], [8, 10]],
    6: [[8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [5, 6], [6, 6], [7, 6], [9, 6], [10, 6], [11, 6]],
    7: [[8, 8], [7, 8], [9, 8], [8, 7], [8, 9], [8, 4], [8, 12], [5, 6], [11, 10], [5, 10], [11, 6]],
    8: [[6, 7], [7, 7], [8, 7], [5, 8], [6, 8], [8, 8], [9, 8], [6, 9], [7, 9], [8, 9], [7, 8]],
  }[n];
  for (const [X, Y] of dots) p(X, Y, n === 8 && X === 7 && Y === 8 ? '#2a0a08' : E);
  return c;
}
function drawBadge(x, y, k = 1, n = 1) { if (!BADGES[n]) BADGES[n] = makeBadge(n); blit(BADGES[n], x, y, { dw: 17 * k, dh: 17 * k }); }
// ---------- Shop ----------
class ShopScreen {
  constructor(stock) { this.stock = stock; this.i = 0; this.top = 0; }
  update() {
    const n = this.stock.length + 1;
    if (this.busy) return;
    if (dirPressed('up')) { this.i = (this.i + n - 1) % n; sfx('blip'); }
    if (dirPressed('down')) { this.i = (this.i + 1) % n; sfx('blip'); }
    if (this.i < this.top) this.top = this.i; if (this.i > this.top + 6) this.top = this.i - 6;
    if (Bk()) { sfx('back'); this.done(); return; }
    if (A()) { sfx('select'); if (this.i === this.stock.length) { this.done(); return; } this.buy(this.stock[this.i]); }
  }
  async buy(k) {
    this.busy = true; const I = ITEMS[k];
    const max = Math.min(99, Math.floor(G.money / I.price));
    if (max < 1) await msg("You don't have enough money for that.");
    else {
      const n = await push(new NumMenu(max, I.price));
      if (n > 0) { G.money -= n * I.price; G.bag[k] = (G.bag[k] || 0) + n; sfx('item'); await msg(`Here you are! ${n} ${I.n}${n > 1 ? 's' : ''}.`); if (k === 'leyorb' && n >= 10) { G.bag.greatorb = (G.bag.greatorb || 0) + 1; await msg("Buying in bulk? Have a Great Orb on the house."); } }
    }
    this.busy = false;
  }
  draw() {
    bgScreen('#3a6a4a', '#427452');
    frame(4, 4, 160, 140, ['#30384a', '#f4fbf0', '#6aa060']);
    txt('WAYHOUSE SHOP', 12, 10, '#3a7a4a', null, 7);
    [...this.stock, null].slice(this.top, this.top + 7).forEach((k, j) => { const y = 28 + j * 16; if (k) { txt(ITEMS[k].n, 22, y, '#383840', null, 7); txt('£' + ITEMS[k].price, 156, y, '#383840', null, 7, 'right'); } else txt('Done', 22, y, '#383840', null, 7); });
    const cy = 31 + (this.i - this.top) * 16; R(12, cy, 2, 7, '#383840'); R(14, cy + 1, 1, 5, '#383840'); R(15, cy + 2, 1, 3, '#383840');
    frame(168, 4, 84, 40, 'panel'); txt('Money', 176, 10, '#6a7a60', null, 6); txt('£' + G.money, 244, 24, '#383840', null, 8, 'right');
    const k = this.stock[this.i];
    frame(168, 48, 84, 96, 'panel'); if (k) { txt('In bag: ' + (G.bag[k] || 0), 174, 54, '#6a7a60', null, 6); wrap(ITEMS[k].desc, 72, 6).forEach((l, j) => txt(l, 174, 68 + j * 11, '#383840', null, 6)); }
  }
}
// ---------- Storage ----------
class StorageScreen {
  constructor() { this.side = 0; this.i = 0; }
  update() {
    if (this.busy) return;
    const list = this.side ? G.box : G.party;
    if (dirPressed('left') || dirPressed('right')) { this.side = 1 - this.side; this.i = 0; sfx('blip'); }
    if (dirPressed('up')) { this.i = Math.max(0, this.i - 1); sfx('blip'); }
    if (dirPressed('down')) { this.i = Math.min(Math.max(0, list.length - 1), this.i + 1); sfx('blip'); }
    if (Bk()) { sfx('back'); this.done(); return; }
    if (A() && list.length) { sfx('select'); this.act(); }
  }
  async act() {
    this.busy = true;
    if (this.side === 0) {
      const r = await choose(['Deposit', 'Summary', 'Cancel'], { x: 176, y: 120 });
      if (r === 0) { if (G.party.length <= 1) await msg("You can't deposit your last Beastie!"); else { G.box.push(G.party.splice(this.i, 1)[0]); this.i = Math.max(0, this.i - 1); } }
      if (r === 1) await push(new SummaryScreen(this.i));
    } else {
      const r = await choose(['Withdraw', 'Summary', 'Cancel'], { x: 176, y: 120 });
      if (r === 0) { if (G.party.length >= 6) await msg('Your team is full.'); else { G.party.push(G.box.splice(this.i, 1)[0]); this.i = Math.max(0, this.i - 1); } }
      if (r === 1) await push(new SummaryScreen(this.i, G.box));
    }
    this.busy = false;
  }
  draw() {
    bgScreen('#3a3a5a', '#424264');
    [['TEAM', G.party], ['STORAGE', G.box]].forEach(([t, list], s) => {
      const x = 4 + s * 126; frame(x, 4, 122, 184, this.side === s ? ['#30384a', '#fff8e0', '#f0a040'] : 'panel');
      txt(t, x + 8, 10, '#5a5a8a', null, 7); txt(`${list.length}${s ? '' : '/6'}`, x + 114, 10, '#8a8a98', null, 6, 'right');
      const top = Math.max(0, (this.side === s ? this.i : 0) - 7);
      list.slice(top, top + 8).forEach((m, j) => { const y = 26 + j * 20; if (this.side === s && top + j === this.i) R(x + 4, y - 2, 114, 18, '#f4d8a8'); blit(creatureSprite(m.sp, 28, { shiny: m.shiny }), x + 6, y - 6, { dw: 18, dh: 18, w: 28, h: 28 }); txt(monName(m), x + 28, y + 2, '#383840', null, 7); txt('Lv' + m.lvl, x + 114, y + 2, '#383840', null, 6, 'right'); });
      if (!list.length) txt('Empty', x + 61, 90, '#9a9aa8', null, 7, 'center');
    });
  }
}
// ---------- Start menu ----------
class StartMenu {
  constructor() { this.i = 0; }
  get items() { const a = []; if (G.flags.journal) a.push('Journal'); if (G.party.length) a.push('Beasties'); a.push('Bag', 'Types', G.name, 'Save', 'Options', 'Close'); return a; }
  update() {
    const it = this.items;
    if (this.busy) return;
    if (dirPressed('up')) { this.i = (this.i + it.length - 1) % it.length; sfx('blip'); }
    if (dirPressed('down')) { this.i = (this.i + 1) % it.length; sfx('blip'); }
    if (Bk() || pressed.start && !pressed.a) { sfx('back'); this.done(); return; }
    if (pressed.a) { sfx('select'); this.pick(it[this.i]); }
  }
  async pick(k) {
    this.busy = true;
    if (k === 'Journal') await push(new JournalScreen());
    else if (k === 'Beasties') await push(new PartyScreen('view'));
    else if (k === 'Bag') await push(new BagScreen('field'));
    else if (k === 'Types') await push(new TypeGuide(null, G.party.length ? 0 : 1));
    else if (k === G.name) await push(new CardScreen());
    else if (k === 'Save') { if (await ask('Save your progress?')) { await saveGame(true); sfx('item'); await msg(`${G.name} saved the game.`); } }
    else if (k === 'Options') await optionsMenu();
    else if (k === 'Close') { this.done(); return; }
    this.busy = false;
  }
  draw() {
    const it = this.items, w = 84, h = it.length * 15 + 12;
    frame(W - w - 4, 4, w, h, 'menu');
    it.forEach((s, i) => { hot(W - w - 1, 9 + i * 15, w - 6, 15, () => { this.i = i; }); txt(s, W - w + 12, 11 + i * 15); if (i === this.i) { const cy = 14 + i * 15; R(W - w + 3, cy, 2, 7, '#383840'); R(W - w + 5, cy + 1, 1, 5, '#383840'); R(W - w + 6, cy + 2, 1, 3, '#383840'); } });
  }
}
async function optionsMenu() {
  const r = await choose([`Sound: ${soundOn ? 'On' : 'Off'}`, `Text: ${['Slow', 'Normal', 'Fast'][textSpeed === 1 ? 0 : textSpeed === 2 ? 1 : 2]}`, 'Back'], { x: 110, y: 60 });
  if (r === 0) { setSound(!soundOn); G.opts.sound = soundOn; return optionsMenu(); }
  if (r === 1) { textSpeed = textSpeed === 1 ? 2 : textSpeed === 2 ? 4 : 1; G.opts.text = textSpeed; return optionsMenu(); }
}
// ---------- Type Guide ----------
// Opens from battle (C key) or the menu. Pages: the foe's weak spots, your Beastie's weak spots, and the full chart.
function defProfile(types) { const out = { 4: [], 2: [], .5: [], .25: [], 0: [] }; for (const t of TYPES) { const m = eff(t, types); if (out[m]) out[m].push(t); } return out; }
class TypeGuide {
  constructor(bt, start) {
    this.bt = bt; this.tabs = bt ? ['foe', 'you', 'chart'] : ['team', 'chart']; this.tab = start || 0;
    this.cx = 0; this.cy = 0; this.pi = 0;
    if (bt) { this.cx = TYPES.indexOf(SPECIES[bt.foe.sp].types[0]); const mv = bt.me.moves.find(m => MOVES[m.id].c !== 'st'); this.cy = mv ? TYPES.indexOf(MOVES[mv.id].t) : 0; }
  }
  update() {
    if (Bk() || pressed.guide) { sfx('back'); this.done(); return; }
    if (A()) { this.tab = (this.tab + 1) % this.tabs.length; sfx('select'); return; }
    const t = this.tabs[this.tab];
    if (t === 'chart') {
      if (dirPressed('left')) { this.cx = (this.cx + 17) % 18; sfx('blip'); } if (dirPressed('right')) { this.cx = (this.cx + 1) % 18; sfx('blip'); }
      if (dirPressed('up')) { this.cy = (this.cy + 17) % 18; sfx('blip'); } if (dirPressed('down')) { this.cy = (this.cy + 1) % 18; sfx('blip'); }
    } else if (t === 'team' && G.party.length > 1) {
      if (dirPressed('up')) { this.pi = (this.pi + G.party.length - 1) % G.party.length; sfx('blip'); } if (dirPressed('down')) { this.pi = (this.pi + 1) % G.party.length; sfx('blip'); }
    }
  }
  drawTabs() {
    const names = { foe: 'VS FOE', you: 'VS YOU', team: 'YOUR TEAM', chart: 'FULL CHART' };
    txt('TYPE GUIDE', 8, 5, '#ffffff', '#1a2030', 8);
    let x = 250; for (let i = this.tabs.length - 1; i >= 0; i--) { const s = names[this.tabs[i]], w = tw(s, 5.5) + 10; x -= w + 2; if (i === this.tab) pill(x, 5, w, 11, '#e0a030'); else pill(x, 5, w, 11, '#46506a'); txt(s, x + w / 2, 8, i === this.tab ? '#ffffff' : '#b8c0d8', null, 5.5, 'center'); }
    txt('Z: NEXT PAGE   X OR C: CLOSE', 128, 184, '#b8c0d8', null, 5.5, 'center');
  }
  drawProfile(m, title, extra) {
    const sp = SPECIES[m.sp];
    frame(4, 20, 90, 100, 'panel');
    R(8, 24, 82, 60, '#dde8d4'); blit(creatureSprite(m.sp, 64, { shiny: m.shiny }), 17, 22);
    txt(monName(m), 49, 87, '#383840', '#d0ccc0', 8, 'center');
    sp.types.forEach((t, k) => typeBadge(t, sp.types.length === 1 ? 31 : 11 + k * 38, 100));
    frame(98, 20, 154, 160, 'panel');
    txt(title, 106, 26, '#4a6a3a', null, 5.5);
    const pr = defProfile(sp.types); let y = 36;
    const rows = [[4, 'VERY WEAK TO  X4', '#d03020'], [2, 'WEAK TO  X2', '#e06030'], [.5, 'RESISTS  X1/2', '#3070c0'], [.25, 'STRONGLY RESISTS  X1/4', '#2050a0'], [0, 'IMMUNE TO  X0', '#404048']];
    for (const [k, lab, col] of rows) {
      const list = pr[k]; if (!list.length) continue;
      txt(lab, 106, y, col, null, 5.5); y += 8;
      list.forEach((t, i) => { if (i && i % 4 === 0) y += 11; typeBadge(t, 106 + (i % 4) * 36, y); });
      y += 14; if (y > 168) break;
    }
    if (y === 36) txt('No weaknesses or resistances.', 106, 40, '#383840', null, 7);
    frame(4, 122, 90, 58, 'panel');
    if (extra) extra();
  }
  movesPanel(me, foe) {
    txt('YOUR MOVES', 10, 128, '#4a6a3a', null, 5.5);
    me.moves.forEach((mv, i) => { const M = MOVES[mv.id], y = 137 + i * 10; txt(M.n, 10, y, '#383840', null, 5.5);
      if (M.c === 'st') { txt('STATUS', 88, y, '#8a8a98', null, 5.5, 'right'); return; }
      const e = eff(M.t, SPECIES[foe.sp].types); txt(multLabel(e), 88, y, e > 1 ? '#c02818' : e === 0 ? '#404048' : e < 1 ? '#3070c0' : '#6a6a78', null, 5.5, 'right'); });
  }
  threatPanel(me, foe) {
    txt("FOE'S TYPE MOVES", 10, 128, '#4a6a3a', null, 5.5);
    SPECIES[foe.sp].types.forEach((t, i) => { const e = eff(t, SPECIES[me.sp].types), y = 140 + i * 13; typeBadge(t, 9, y - 1); txt(multLabel(e), 88, y + 1, e > 1 ? '#c02818' : e < 1 ? '#3070c0' : '#6a6a78', null, 5.5, 'right'); });
    txt('ON YOU', 10, 168, '#8a8a98', null, 5.5);
  }
  drawChart() {
    const x0 = 24, y0 = 26, cw = 12, ch = 7;
    R(x0 - 21, y0 - 9, 18 * cw + 23, 18 * ch + 11, '#1e2434');
    TYPES.forEach((t, i) => {
      const hot = i === this.cx; R(x0 + i * cw, y0 - 8, cw - 1, 7, hot ? '#e0a030' : dk(TCOL[t], .25)); txt(TABBR2[t], x0 + i * cw + 5, y0 - 7, '#ffffff', null, 5.5, 'center');
      const hr = i === this.cy; R(x0 - 20, y0 + i * ch, 19, ch - 1, hr ? '#e0a030' : dk(TCOL[t], .25)); txt(TABBR[t], x0 - 10, y0 + i * ch + 1, '#ffffff', null, 5.5, 'center');
    });
    const foeT = this.bt ? SPECIES[this.bt.foe.sp].types : [];
    for (let a = 0; a < 18; a++) for (let d = 0; d < 18; d++) {
      const m = eff(TYPES[a], [TYPES[d]]), x = x0 + d * cw, y = y0 + a * ch;
      const col = m === 2 ? '#48b058' : m === .5 ? '#c85848' : m === 0 ? '#101014' : ((a + d) % 2 ? '#e8ecf0' : '#dde2ea');
      R(x, y, cw - 1, ch - 1, col);
      if (m !== 1) txt(m === 2 ? '2' : m === 0 ? '0' : '.5', x + 6, y + 1, m === 0 ? '#9090a0' : '#ffffff', null, 5.5, 'center');
      if (foeT.includes(TYPES[d]) && m === 1) R(x + 5, y + 3, 1, 1, '#a0a8c0');
    }
    const hx = x0 + this.cx * cw, hy = y0 + this.cy * ch;
    R(hx - 1, y0 - 1, 1, 18 * ch + 1, '#e0a030'); R(hx + cw - 1, y0 - 1, 1, 18 * ch + 1, '#e0a030'); R(x0 - 1, hy - 1, 18 * cw + 1, 1, '#e0a030'); R(x0 - 1, hy + ch - 1, 18 * cw + 1, 1, '#e0a030');
    const a = TYPES[this.cy], d = TYPES[this.cx], m = eff(a, [d]);
    const verdict = m === 2 ? 'super effective' : m === .5 ? 'not very effective' : m === 0 ? 'has no effect' : 'normal damage';
    frame(2, 156, 252, 22, ['#2c3242', '#f8f6ea', '#e0a030']);
    txt(`${a} vs ${d}: ${verdict} (${multLabel(m)})`, 128, 162, '#383840', null, 7, 'center');
  }
  draw() {
    bgScreen('#26304a', '#2c3856');
    const t = this.tabs[this.tab];
    if (t === 'chart') { this.drawChart(); txt('ATTACKER DOWN THE SIDE, DEFENDER ALONG THE TOP. ARROWS MOVE.', 128, 186, '#b8c0d8', null, 5.5, 'center'); }
    else if (t === 'foe') this.drawProfile(this.bt.foe, `HITTING ${monName(this.bt.foe).toUpperCase()}`, () => this.movesPanel(this.bt.me, this.bt.foe));
    else if (t === 'you') this.drawProfile(this.bt.me, `HITTING YOUR ${monName(this.bt.me).toUpperCase()}`, () => this.threatPanel(this.bt.me, this.bt.foe));
    else if (t === 'team') { const m = G.party[this.pi]; if (m) this.drawProfile(m, `HITTING ${monName(m).toUpperCase()}`, () => { txt('UP/DOWN', 10, 130, '#4a6a3a', null, 5.5); txt('CHANGES BEASTIE', 10, 139, '#4a6a3a', null, 5.5); txt(`${this.pi + 1} OF ${G.party.length}`, 10, 156, '#8a8a98', null, 5.5); }); }
    if (t !== 'chart') this.drawTabs(); else { txt('TYPE CHART', 8, 5, '#ffffff', '#1a2030', 8); const names = { foe: 'VS FOE', you: 'VS YOU', team: 'YOUR TEAM', chart: 'FULL CHART' }; txt('Z: ' + names[this.tabs[(this.tab + 1) % this.tabs.length]] + '  X: CLOSE', 250, 8, '#b8c0d8', null, 5.5, 'right'); }
  }
}