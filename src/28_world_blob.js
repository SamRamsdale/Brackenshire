// ---- blob autotile edges: mask bits = neighbour is the SAME terrain (N1 E2 S4 W8 NE16 SE32 SW64 NW128) ----
const WOB = [2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 3, 2, 2, 3];
function landAt(mask, px, py) {
  const N = mask & 1, E = mask & 2, S = mask & 4, Wd = mask & 8;
  if (px < 0) return !Wd; if (px > 15) return !E; if (py < 0) return !N; if (py > 15) return !S;
  if (!N && py < WOB[px]) return true; if (!S && py > 15 - WOB[(px + 5) % 16]) return true;
  if (!Wd && px < WOB[(py + 3) % 16]) return true; if (!E && px > 15 - WOB[(py + 9) % 16]) return true;
  const rc = (cx, cy) => (px + .5 - cx) ** 2 + (py + .5 - cy) ** 2;
  if (!N && !Wd && px < 6 && py < 6 && rc(6, 6) > 12) return true;
  if (!N && !E && px > 9 && py < 6 && rc(10, 6) > 12) return true;
  if (!S && !Wd && px < 6 && py > 9 && rc(6, 10) > 12) return true;
  if (!S && !E && px > 9 && py > 9 && rc(10, 10) > 12) return true;
  if (N && Wd && !(mask & 128) && rc(0, 0) < 9) return true;
  if (N && E && !(mask & 16) && rc(16, 0) < 9) return true;
  if (S && Wd && !(mask & 64) && rc(0, 16) < 9) return true;
  if (S && E && !(mask & 32) && rc(16, 16) < 9) return true;
  return false;
}
function applyEdges(x, mask, land, rimIn, rimOut, rim2) {
  if (mask === 255) return;
  const { p } = pctx(x);
  const L = []; for (let y = 0; y < 16; y++) for (let X = 0; X < 16; X++) L.push(landAt(mask, X, y));
  const at = (X, y) => (X < 0 || y < 0 || X > 15 || y > 15) ? landAt(mask, X, y) : L[y * 16 + X];
  for (let y = 0; y < 16; y++) for (let X = 0; X < 16; X++) {
    const me = at(X, y), nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    if (me) { const hash2 = hash(X, y, 31); p(X, y, hash2 > .85 ? land.dk : hash2 > .72 ? land.lt : land.base); if (nb.some(([a, b]) => !at(X + a, y + b))) p(X, y, rimOut); }
    else if (nb.some(([a, b]) => at(X + a, y + b))) p(X, y, rimIn);
    else if (rim2 && [[2, 0], [-2, 0], [0, 2], [0, -2], [1, 1], [-1, 1], [1, -1], [-1, -1]].some(([a, b]) => at(X + a, y + b))) p(X, y, rim2);
  }
}
const MOORGR = { base: '#90a862', dk: '#6a8646', lt: '#b0c47e' };
const BLADE = ['..d.', '.dld', '.dlm', 'dlmm', 'dlmd', 'dmmd', 'dmd.'];
function drawTall(x, pal, v, onlyBottom) {
  const { p, r } = pctx(x);
  if (!onlyBottom) r(0, 0, 16, 16, pal.base);
  const rows = onlyBottom ? [8] : [0, 8];
  for (const y0 of rows) for (let i = 0; i < 4; i++) {
    const x0 = (i * 4 + (y0 ? 2 : 0)) % 16;
    BLADE.forEach((row, yy) => [...row].forEach((ch, xx) => { if (ch === '.') return; p((x0 + xx) % 16, y0 + yy + 1, ch === 'd' ? pal.d : ch === 'l' ? pal.l : pal.m); }));
    if (pal.f && (i + v + y0) % 3 === 0) { p((x0 + 1) % 16, y0 + 1, pal.f); p((x0 + 2) % 16, y0 + 1, pal.f2); }
  }
}
const TALL = { base: '#4aa444', d: '#2a6a2e', l: '#9ee07a', m: '#5cbc4c' };
const HEATH = { base: '#6c8a4a', d: '#4a3a5a', l: '#d8a4e4', m: '#a468b8', f: '#f0c8f4', f2: '#c080d0' };
const TILEDEF = {};
const SOLID = new Set(['T', '~', 'F', 'W', 'H', 'S', 'L', 'O', 'r', 'X', '#', 'C', 'D', 'B', 'b', 'P', 'M', 't', 'j', 'Z', '^', 'K', 'Q', 'Y', 'I', 'U', 'G', 'N', 'o']);
const TALLTILE = new Set(['T', 'O', 'L', 'N']);
const ENC_TILES = new Set([',', 'h', 'v', 'c']);
const SANDPAL = { base: '#f0dca8', dk: '#d8c088', lt: '#fff0c8' }, SNOWPAL = { base: '#eef4fa', dk: '#c8d8e8', lt: '#ffffff' }, CAVEPAL = { base: '#8a7a66', dk: '#6a5c4c', lt: '#a8987e' }, FORESTPAL = { base: '#5e8e4a', dk: '#446e36', lt: '#7aa85e' };
const SNOWTALL = { base: '#e4eef6', d: '#6a8aa8', l: '#ffffff', m: '#a8c4dc' };
function groundFill(x, gk, v) { if (gk === 'm') drawGrass(x, v, MOORGR); else if (gk === 'n') drawGrass(x, v, SNOWPAL); else if (gk === 'c') drawGrass(x, v, CAVEPAL); else if (gk === 's') drawGrass(x, v, SANDPAL); else if (gk === 'f') drawGrass(x, v, FORESTPAL); else if (gk === 'i') { pctx(x).r(0, 0, 16, 16, '#8a8490'); } else drawGrass(x, v); }
const RIMCOL = { m: '#5e7a40', n: '#a8bcd0', f: '#446e36', c: '#6a5c4c', s: '#d8c088' };
function groundPal(gk) { return gk === 'm' ? MOORGR : gk === 'n' ? SNOWPAL : gk === 's' ? SANDPAL : gk === 'c' ? CAVEPAL : gk === 'f' ? FORESTPAL : GR; }
function tileCanvas(ch, v, f, ctxInfo) {
  const key = ch + v + '_' + f + '_' + (ctxInfo || '');
  if (TILECACHE[key]) return TILECACHE[key];
  const [c, x] = mk(16, 16); const { p, r } = pctx(x);
  const floor = (ctxInfo || '').split('|');
  switch (ch) {
    case '.': drawGrass(x, v); break;
    case ',': drawTall(x, TALL, v); break;
    case 'h': drawTall(x, HEATH, v); break;
    case 'm': { r(0, 0, 16, 16, '#90a862'); const s = [[[3, 4], [11, 11]], [[10, 3], [4, 12]], [[6, 8], [13, 13]], [[12, 6], [2, 10]]][v % 4]; for (const [a, b] of s) { p(a, b, '#6a8646'); p(a + 1, b - 1, '#6a8646'); p(a + 2, b, '#6a8646'); p(a + 1, b, '#b0c47e'); } if (v === 2) { r(8, 2, 3, 2, '#a89060'); } break; }
    case ':': {
      r(0, 0, 16, 16, '#e0c690'); for (let i = 0; i < 9; i++) { const X = Math.floor(hash(v, i, 3) * 16), Y = Math.floor(hash(i, v, 5) * 16); p(X, Y, i % 3 ? '#cdb078' : '#f0dcae'); if (i % 4 === 0) p(X + 1, Y, '#cdb078'); }
      const [mk2, gk] = (ctxInfo || '255|g').split('|');
      applyEdges(x, +mk2, groundPal(gk), '#c2a068', RIMCOL[gk] || '#5a9e48');
      break;
    }
    case '=': { r(0, 0, 16, 16, '#9a9284'); for (let yy = 0; yy < 4; yy++) for (let xx = -1; xx < 3; xx++) { const X = xx * 6 + (yy % 2) * 3, Y = yy * 4; r(X + 1, Y + 1, 5, 3, '#c8c0b0'); r(X + 1, Y + 1, 5, 1, '#dcd6c8'); } break; }
    case 'N': groundFill(x, ctxInfo, v); r(3, 13, 12, 3, 'rgba(20,40,30,.25)'); break;
    case 'T': case 'L': { groundFill(x, ctxInfo || 'g', v); const sh = dk(groundPal(ctxInfo || 'g').base, .12); if (ch === 'T') { r(2, 13, 12, 3, sh); r(4, 12, 8, 1, sh); } else { r(4, 14, 8, 2, sh); } break; }
    case 'O': r(0, 0, 16, 16, '#90a862'); r(2, 12, 12, 4, '#6a8646'); break;
    case '~': case 'p': {
      r(0, 0, 16, 16, '#4a90e0');
      for (let yy = 0; yy < 16; yy += 4) for (let xx = 0; xx < 16; xx++) if (Math.sin((xx + f * 2) * .8 + yy) > .82) p(xx, yy + ((xx >> 2) % 2), '#6aa8f0');
      for (let i = 0; i < 3; i++) { const X = (i * 5 + f * 2 + (i % 2) * 7) % 13, Y = (i * 5 + 2) % 14; r(X, Y, 3, 1, '#a8d8ff'); p(X + 3, Y, '#8ac4fa'); }
      const [mk2, gk] = (ctxInfo || '255|g').split('|');
      applyEdges(x, +mk2, groundPal(gk), '#c8ecff', gk === 'n' ? '#98b0c8' : gk === 's' ? '#c8a868' : '#3e6e34', '#80bcf4');
      if (ch === 'p') { r(0, 1, 16, 14, '#b88a58'); for (let X = 0; X < 16; X += 4) { r(X, 1, 1, 14, '#7a5430'); r(X + 1, 1, 1, 14, '#d0a474'); } r(0, 0, 16, 2, '#6a4424'); r(0, 14, 16, 2, '#6a4424'); r(0, 15, 16, 1, '#2a5a9a'); }
      break;
    }
    case 'f': { groundFill(x, ctxInfo || 'g', v); const fl = [[3, 3, '#f05050'], [10, 9, '#ffffff'], [11, 2, '#f8d040'], [4, 11, '#f080c0']]; fl.forEach(([X, Y, col], i) => { if ((i + v) % 4 === 3) return; const o = (f + i) % 2; p(X + o, Y, col); p(X - 1 + o, Y + 1, col); p(X + 1 + o, Y + 1, col); p(X + o, Y + 2, col); p(X + o, Y + 1, '#ffd840'); p(X, Y + 3, '#4a9a3a'); }); break; }
    case 'F': { groundFill(x, ctxInfo || 'g', v); r(0, 5, 16, 2, '#c08a50'); r(0, 7, 16, 1, '#6a4020'); r(0, 10, 16, 2, '#c08a50'); r(0, 12, 16, 1, '#6a4020'); r(6, 2, 4, 13, '#6a4020'); r(7, 3, 2, 11, '#d8a060'); r(6, 14, 4, 2, '#4a8a3a'); break; }
    case 'W': {
      r(0, 0, 16, 16, '#6e6a5e'); const rowsY = [1, 5, 9]; rowsY.forEach((Y, ri) => { let X = -((ri * 3 + v) % 5); while (X < 16) { const w = 4 + Math.floor(hash(X + 20, ri, v) * 3); const col = ['#b4b0a4', '#a8a498', '#c4c0b4'][(X + ri + 9) % 3]; r(X + 1, Y, w - 1, 3, col); r(X + 1, Y, w - 1, 1, '#d8d4c8'); X += w; } });
      r(0, 0, 16, 1, '#8a867a'); r(0, 13, 16, 3, '#5a8a44'); r(1, 13, 14, 1, '#44683a');
      if (v % 2) { p(3, 4, '#7aa048'); p(4, 4, '#7aa048'); p(11, 8, '#7aa048'); }
      break;
    }
    case 'H': {
      groundFill(x, ctxInfo || 'g', v);
      const top = [3, 2, 1, 1, 1, 2, 3, 2, 1, 1, 1, 2, 3, 2, 1, 1];
      for (let X = 0; X < 16; X++) { r(X, top[X], 1, 15 - top[X], '#3a8a3e'); p(X, top[X] - 1, '#1e4a22'); }
      for (let X = 0; X < 16; X++) { p(X, top[X], '#6cc060'); if (top[X] < 2) p(X, top[X] + 1, '#58a850'); }
      for (let i = 0; i < 7; i++) { const X = Math.floor(hash(i, v, 11) * 13), Y = 5 + Math.floor(hash(v, i, 13) * 7); p(X, Y, '#58a850'); p(X + 1, Y, '#58a850'); p(X + 1, Y + 1, '#2a6a30'); p(X + 2, Y + 1, '#2a6a30'); }
      r(0, 12, 16, 2, '#2a6a30'); r(0, 14, 16, 1, '#1e4a22'); r(0, 15, 16, 1, '#4a8a3a');
      if (v % 2) { p(4, 6, '#fff4f4'); p(11, 9, '#fff4f4'); p(8, 4, '#ffe0e8'); p(13, 5, '#fff4f4'); }
      break;
    }
    case 'S': { groundFill(x, ctxInfo || 'g', v); r(7, 9, 2, 6, '#6a4020'); r(2, 2, 12, 8, '#6a4020'); r(3, 3, 10, 6, '#d8a060'); r(4, 4, 8, 1, '#a07040'); r(4, 6, 6, 1, '#a07040'); break; }
    case 'r': { groundFill(x, ctxInfo === 'moor' ? 'm' : ctxInfo, v); const snow = ctxInfo === 'n'; pcirc(x, 8, 9.5, 6.5, '#3e3e48'); pcirc(x, 8, 9, 5.5, snow ? '#a8b0c0' : '#9a9aa4'); pcirc(x, 7, 7.5, 3, snow ? '#ffffff' : '#bcbcc4'); pcirc(x, 10, 11.5, 3, '#7a7a84', (X, Y) => Y > 10); break; }
    case 'o': { groundFill(x, ctxInfo, v); pcirc(x, 8, 9, 7.2, '#3a3028'); pcirc(x, 8, 8.5, 6.3, '#8a7a66'); pcirc(x, 6.5, 6.5, 3.2, '#a8987e'); pcirc(x, 10, 11.5, 3.5, '#6a5c4c', (X, Y) => Y > 10); break; }
    case 's': { const { r: rr, p: pp } = pctx(x); rr(0, 0, 16, 16, SANDPAL.base); for (let i = 0; i < 8; i++) { const X = Math.floor(hash(v, i, 41) * 16), Y = Math.floor(hash(i, v, 43) * 16); pp(X, Y, i % 3 ? SANDPAL.dk : SANDPAL.lt); } if (v === 3) { pp(5, 6, '#e8a0a0'); pp(6, 6, '#f0c0b0'); } const [mk2, gk] = (ctxInfo || '255|g').split('|'); applyEdges(x, +mk2, groundPal(gk), '#e0c890', '#5a9e48'); break; }
    case 'n': drawGrass(x, v, SNOWPAL); if (v === 1) { p(4, 9, '#b8c8d8'); p(11, 4, '#b8c8d8'); } break;
    case 'v': drawTall(x, SNOWTALL, v); break;
    case 'g': { drawGrass(x, v, FORESTPAL); const lc = ['#b8742c', '#d8a040', '#8a5a2a']; for (let i = 0; i < 5; i++) { const X = Math.floor(hash(v, i, 51) * 15), Y = Math.floor(hash(i, v, 53) * 15); p(X, Y, lc[i % 3]); p(X + 1, Y, lc[(i + 1) % 3]); } break; }
    case 'u': { groundFill(x, ctxInfo || 'g', v); for (const [X, Y, cc] of [[4, 5, '#e04040'], [11, 9, '#e04040'], [6, 12, '#f0d8c0']]) { r(X, Y + 2, 1, 2, '#f4ecd8'); r(X - 1, Y, 3, 2, cc); p(X, Y, '#ffffff'); } break; }
    case 'G': { groundFill(x, ctxInfo || 'g', v); r(4, 4, 8, 11, '#5a5a62'); r(5, 3, 6, 1, '#5a5a62'); r(5, 4, 6, 10, '#9a9aa4'); r(6, 3, 4, 1, '#9a9aa4'); r(7, 6, 2, 5, '#6a6a74'); r(6, 7, 4, 1, '#6a6a74'); r(3, 14, 10, 2, '#4a7a3a'); if (v % 2) { p(5, 12, '#6aa048'); p(10, 5, '#6aa048'); } break; }
    case '^': case 'V': {
      const [fl2, gk] = (ctxInfo || '|g').split('|'); const topOpen = fl2.includes('t'), botOpen = fl2.includes('b');
      r(0, 0, 16, 16, '#8a7a68'); for (let Y = 3; Y < 16; Y += 5) { r(0, Y, 16, 1, '#6a5a4a'); r(0, Y + 1, 16, 1, '#a8987e'); }
      for (let i = 0; i < 4; i++) { const X = Math.floor(hash(v, i, 61) * 14), Y = Math.floor(hash(i, v, 63) * 14); r(X, Y, 2, 1, '#9e8e76'); p(X, Y + 1, '#5a4a3a'); }
      if (topOpen) { const pal = groundPal(gk); r(0, 0, 16, 3, pal.base); for (let X = 0; X < 16; X++) p(X, 3 + (X % 3 === 0 ? 1 : 0), pal.dk); r(0, 3, 16, 1, '#4a3a2a'); }
      if (botOpen) { r(0, 13, 16, 3, '#5a4a3a'); r(0, 15, 16, 1, 'rgba(0,0,0,.2)'); }
      if (ch === 'V') { r(3, 4, 10, 12, '#3a2e24'); r(4, 3, 8, 1, '#3a2e24'); r(4, 5, 8, 11, '#120e0c'); r(5, 4, 6, 1, '#120e0c'); r(3, 4, 1, 12, '#6a5a4a'); }
      break;
    }
    case 'K': { const [fl2] = (ctxInfo || '|').split('|'); r(0, 0, 16, 16, '#8a8890'); for (let Y = 0; Y < 16; Y += 4) for (let X = (Y / 4) % 2 * 4; X < 16; X += 8) { r(X, Y, 7, 3, '#a8a6ae'); r(X, Y, 7, 1, '#bcbac2'); }
      if (fl2.includes('t')) { r(0, 0, 16, 4, groundPal('g').base); r(0, 4, 4, 3, '#8a8890'); r(8, 4, 4, 3, '#8a8890'); r(4, 4, 4, 3, groundPal('g').base); r(12, 4, 4, 3, groundPal('g').base); r(0, 7, 16, 1, '#5a5860'); }
      if (fl2.includes('b')) r(0, 14, 16, 2, '#5a5860'); break; }
    case 'w': { r(0, 0, 16, 16, '#4a90e0'); r(1, 0, 14, 16, '#b88a58'); for (let Y = 0; Y < 16; Y += 4) { r(1, Y, 14, 1, '#7a5430'); r(1, Y + 1, 14, 1, '#d0a474'); } r(0, 0, 1, 16, '#6a4424'); r(15, 0, 1, 16, '#6a4424'); break; }
    case 'c': drawGrass(x, v, CAVEPAL); if (v === 2) { pcirc(x, 11, 11, 1.6, '#6a5c4c'); p(10, 10, '#a8987e'); } break;
    case 'A': { drawGrass(x, v, CAVEPAL); r(3, 0, 2, 16, '#6a4424'); r(11, 0, 2, 16, '#6a4424'); for (let Y = 2; Y < 16; Y += 4) r(3, Y, 10, 2, '#a07040'); break; }
    case 'Q': { const [fl2] = (ctxInfo || '|').split('|'); r(0, 0, 16, 16, '#3e342c'); for (let i = 0; i < 5; i++) { const X = Math.floor(hash(v, i, 71) * 13), Y = Math.floor(hash(i, v, 73) * 13); r(X, Y, 3, 2, '#554a3e'); p(X, Y, '#6a5c4c'); } if (fl2.includes('b')) { r(0, 11, 16, 5, '#5a4c3e'); r(0, 11, 16, 1, '#7a6a58'); for (let X = 0; X < 16; X += 3) p(X, 12 + (X % 2), '#3e342c'); } break; }
    case 'X': { r(0, 0, 16, 16, '#9a9284'); r(1, 6, 14, 5, '#f4f4f4'); for (let i = 0; i < 14; i += 4) r(1 + i, 6, 2, 5, '#e04040'); r(1, 5, 14, 1, '#303038'); r(1, 11, 14, 1, '#303038'); r(2, 12, 2, 4, '#303038'); r(12, 12, 2, 4, '#303038'); break; }
    // ---- interior ----
    case '_': case 'k': case 'y': case 'E': case 'R': case 'D': case 'P': case 'M': case 't': case 'b': case 'B': case 'j': case 'C': case 'Z': case 'Y': case 'I': case 'U': case '@': {
      const fl = ch === '_' ? (floor[1] || 'wood') : (ch === 'k' ? 'tile' : ch === 'y' ? 'honey' : (floor[1] || 'wood'));
      if (fl === 'wood') { r(0, 0, 16, 16, '#d8a868'); for (let Y = 3; Y < 16; Y += 4) r(0, Y, 16, 1, '#b8884a'); p((v * 5) % 16, 1, '#b8884a'); p((v * 7 + 8) % 16, 5, '#b8884a'); p((v * 3 + 4) % 16, 9, '#b8884a'); p((v * 9) % 16, 13, '#b8884a'); }
      else if (fl === 'tile') { r(0, 0, 16, 16, '#e4e8ee'); r(0, 0, 8, 8, '#d0d8e6'); r(8, 8, 8, 8, '#d0d8e6'); r(0, 15, 16, 1, '#b8c0d0'); r(15, 0, 1, 16, '#b8c0d0'); }
      else if (fl === 'honey') { r(0, 0, 16, 16, '#f4cc58'); x.strokeStyle = '#c89a30'; x.lineWidth = 1; for (const [hx, hy] of [[4, 4], [12, 4], [8, 12], [0, 12], [16, 12]]) { x.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; x.lineTo(hx + Math.cos(a) * 4.5 + .5, hy + Math.sin(a) * 4 + .5); } x.closePath(); x.stroke(); } }
      else if (fl === 'metal') { r(0, 0, 16, 16, '#9aa2b0'); r(0, 0, 16, 1, '#b8c0cc'); r(0, 15, 16, 1, '#6a7280'); r(15, 0, 1, 16, '#6a7280'); p(2, 2, '#6a7280'); p(13, 2, '#6a7280'); p(2, 13, '#6a7280'); p(13, 13, '#6a7280'); if (v === 1) r(4, 7, 8, 2, '#e8c040'); }
      else if (fl === 'stone') { r(0, 0, 16, 16, '#8a8478'); r(0, 0, 8, 8, '#948e82'); r(8, 8, 8, 8, '#948e82'); r(0, 15, 16, 1, '#6a6458'); r(15, 0, 1, 16, '#6a6458'); if (v === 2) p(5, 5, '#6a6458'); }
      else if (fl === 'ice') { r(0, 0, 16, 16, '#c8e8f8'); r(0, 0, 16, 1, '#e8f8ff'); r(0, 15, 16, 1, '#98c0dc'); r(15, 0, 1, 16, '#98c0dc'); if (v % 2) { p(4, 5, '#ffffff'); p(5, 6, '#ffffff'); p(10, 10, '#ffffff'); } }
      else if (fl === 'moss') { drawGrass(x, v, FORESTPAL); }
      else if (fl.startsWith('carpet')) { const cc = { carpet: '#a83a3a', carpetb: '#3a58a8', carpetp: '#6a3a98', carpetg: '#3a7a4a', carpeto: '#2a2a38', carpety: '#b8902a' }[fl] || '#a83a3a'; r(0, 0, 16, 16, cc); r(0, 0, 16, 1, lt(cc, .2)); for (let X = 2; X < 16; X += 8) for (let Y = 2; Y < 16; Y += 8) { p(X + 2, Y, lt(cc, .35)); p(X + 1, Y + 1, lt(cc, .35)); p(X + 3, Y + 1, lt(cc, .35)); p(X + 2, Y + 2, lt(cc, .35)); } }
      if (ch === 'E') { r(2, 4, 12, 11, '#6a2a2a'); r(3, 5, 10, 9, '#a84848'); r(3, 7, 10, 1, '#c86060'); r(3, 10, 10, 1, '#c86060'); }
      if (ch === 'R') { r(0, 0, 16, 16, '#b84848'); r(1, 1, 14, 14, '#d06050'); r(3, 3, 10, 10, '#b84848'); r(0, 0, 16, 1, '#f0d070'); r(0, 15, 16, 1, '#f0d070'); p(8, 8, '#f0d070'); p(7, 7, '#f0d070'); p(9, 9, '#f0d070'); }
      if (ch === 'D') { r(0, 3, 16, 10, '#7a4a24'); r(0, 3, 16, 8, '#c8884a'); r(0, 3, 16, 1, '#e0a868'); r(1, 13, 2, 3, '#6a3a1a'); r(13, 13, 2, 3, '#6a3a1a'); }
      if (ch === 'P') { r(4, 10, 8, 6, '#6a2a1a'); r(5, 10, 6, 5, '#c86a40'); pcirc(x, 8, 6, 5.5, '#2a6a2a'); pcirc(x, 7, 5, 4, '#4a9a3a'); p(6, 3, '#7ac85a'); p(9, 6, '#7ac85a'); }
      if (ch === 'M') { r(1, 1, 14, 15, '#50586a'); r(2, 2, 12, 13, '#b8c0cc'); r(4, 3, 8, 6, '#2a3040'); r(5, 4, 6, 4, f % 2 ? '#48d8a8' : '#38b890'); r(4, 11, 3, 2, '#e04848'); r(9, 11, 3, 2, '#4868e0'); }
      if (ch === 't') { r(2, 11, 12, 5, '#6a3a1a'); r(1, 2, 14, 10, '#2a2a34'); r(2, 3, 12, 8, f % 2 ? '#6aa0f0' : '#5890e0'); r(3, 4, 4, 2, '#a8d0ff'); }
      if (ch === 'b') { if (floor[2] === 'top') { r(1, 1, 14, 15, '#6a3a1a'); r(2, 2, 12, 5, '#ffffff'); r(2, 7, 12, 9, '#5a88d8'); r(2, 7, 12, 1, '#7aa8f0'); } else { r(1, 0, 14, 14, '#6a3a1a'); r(2, 0, 12, 12, '#5a88d8'); r(2, 3, 12, 1, '#4a70b8'); r(1, 13, 14, 3, '#4a2a10'); } }
      if (ch === 'B') { r(0, 0, 16, 16, '#5a3418'); r(1, 1, 14, 14, '#8a5a30'); for (const Y of [2, 9]) { r(1, Y + 5, 14, 1, '#5a3418'); for (let X = 2; X < 14; X += 2) r(X, Y + ((X * 3 + v) % 2), 2, 5 - ((X * 3 + v) % 2), ['#d04848', '#4868c8', '#48a860', '#e8c040', '#9a58c0'][(X + Y + v) % 5]); } }
      if (ch === 'j') { r(0, 6, 16, 10, '#6a4020'); r(1, 7, 14, 8, '#b07840'); r(1, 7, 14, 1, '#d09860'); for (let X = 1; X < 15; X += 3) { pcirc(x, X + 1, 5, 2.2, '#3a8a3a'); p(X + 1, 3, ['#f0d040', '#ffffff', '#f08040'][X % 3]); } }
      if (ch === 'C') { r(0, 0, 16, 16, '#7a4020'); r(0, 0, 16, 7, '#e0a060'); r(0, 0, 16, 1, '#f0c080'); r(0, 7, 16, 9, '#a86838'); r(2, 9, 5, 5, '#98582c'); r(9, 9, 5, 5, '#98582c'); }
      if (ch === 'Z') { r(3, 4, 10, 12, '#8a8a90'); r(4, 5, 8, 10, '#b0b0b8'); pcirc(x, 8, 4, 4, '#f0c030'); pcirc(x, 8, 4, 2, '#3a3040'); }
      if (ch === 'Y') { r(1, 1, 14, 15, '#3a4250'); r(2, 2, 12, 13, '#6a7688'); r(3, 3, 10, 5, '#2a3040'); p(7, 4, f % 2 ? '#ffe040' : '#fff8a0'); p(8, 4, f % 2 ? '#ffe040' : '#fff8a0'); p(6, 5, '#ffe040'); p(7, 5, '#ffe040'); p(8, 6, '#ffe040'); p(9, 5, '#ffe040'); r(4, 10, 3, 3, '#e04848'); r(9, 10, 3, 3, f % 2 ? '#48e070' : '#2a8040'); }
      if (ch === 'I') { r(1, 2, 14, 14, '#5a98c8'); r(2, 3, 12, 12, '#a8dcf8'); r(3, 4, 4, 2, '#ffffff'); r(3, 6, 2, 3, '#e8f8ff'); r(1, 14, 14, 2, '#3a78a8'); }
      if (ch === 'U') { r(5, 13, 6, 3, '#4a4a54'); r(6, 5, 4, 9, '#9aa2b0'); r(4, 6, 8, 5, '#b8c0cc'); r(5, 7, 6, 3, '#d8e0ec'); r(6, 1, 4, 4, '#9aa2b0'); r(6, 2, 4, 1, '#2a2a34'); r(3, 6, 1, 7, '#7a8290'); r(12, 6, 1, 7, '#7a8290'); r(12, 2, 1, 12, '#c8c8d4'); }
      if (ch === '@') { r(2, 0, 12, 16, '#2a2028'); r(3, 0, 10, 16, '#120c10'); r(2, 0, 1, 16, '#5a4a52'); r(13, 0, 1, 16, '#5a4a52'); }
      break;
    }
    case '#': {
      const top = floor[2] === 'top', wc = floor[3] || '#f0e0c0';
      if (top) { r(0, 0, 16, 16, '#3e3040'); r(0, 13, 16, 3, '#5a4a58'); }
      else { r(0, 0, 16, 16, wc); for (let X = 1; X < 16; X += 4) r(X, 0, 1, 12, dk(wc, .08)); r(0, 12, 16, 4, '#8a6a4a'); r(0, 12, 16, 1, '#a8886a'); }
      break;
    }
    default: r(0, 0, 16, 16, '#000');
  }
  TILECACHE[key] = c; return c;
}
const TILECACHE = {};
// tall parts drawn in the entity layer so characters can walk behind them
const TALLCACHE = {};
function tallSprite(ch, v, lit) {
  const key = ch + v + (lit ? 'L' : '');
  if (TALLCACHE[key]) return TALLCACHE[key];
  let c, x;
  if (ch === 'T') {
    [c, x] = mk(22, 30); const { r, p } = pctx(x);
    // trunk
    r(9, 19, 5, 10, '#3a2412'); r(10, 19, 3, 9, '#7a5030'); r(10, 19, 1, 9, '#946438'); r(12, 19, 1, 9, '#5a3820'); r(8, 27, 7, 2, '#3a2412'); r(9, 27, 5, 1, '#6a4428');
    const blobs = [[11, 13, 9.2], [6.5, 11, 5.6], [15.5, 11, 5.6], [11, 6.5, 6], [7, 16, 5], [15, 16, 5]];
    const inC = (X, Y, g = 0) => blobs.some(([bx, by, br]) => (X + .5 - bx) ** 2 + (Y + .5 - by) ** 2 <= (br + g) ** 2);
    const alt = v % 2;
    const base = alt ? '#3c8e46' : '#358442', mid = alt ? '#2e7438' : '#2a6c36', dark = '#1f5229', lite = '#5aac56', hl = '#86cc6e';
    for (let Y = 0; Y < 24; Y++) for (let X = 0; X < 22; X++) {
      if (inC(X, Y)) {
        const d = (X - 11) * .55 + (Y - 11) * 1;
        let col = d > 7 ? dark : d > 2.5 ? mid : base;
        const tl = blobs.some(([bx, by, br]) => { const dx = X + .5 - bx, dy = Y + .5 - by; const q = dx * dx + dy * dy; return q <= br * br && q >= (br - 2.2) ** 2 && dx < 0 && dy < -1; });
        if (tl && d < 4) col = lite;
        p(X, Y, col);
      } else if (inC(X, Y, 1)) p(X, Y, '#163c1e');
    }
    for (const [X, Y] of [[7, 7], [9, 5], [5, 10], [12, 4], [8, 9]]) { p(X, Y, hl); p(X + 1, Y, lite); }
    for (let i = 0; i < 8; i++) { const X = 4 + Math.floor(hash(i, v, 7) * 14), Y = 6 + Math.floor(hash(v, i, 9) * 13); if (inC(X, Y) && inC(X + 1, Y + 1)) { p(X, Y, mid); p(X + 1, Y + 1, dark); } }
  } else if (ch === 'O') {
    [c, x] = mk(16, 30); const { r, p } = pctx(x);
    x.fillStyle = '#34343e'; x.beginPath(); x.moveTo(3, 29); x.lineTo(2, 8); x.lineTo(5, 2); x.lineTo(10, 1); x.lineTo(13, 6); x.lineTo(13, 29); x.fill();
    x.fillStyle = '#8e8e94'; x.beginPath(); x.moveTo(4, 28); x.lineTo(3, 9); x.lineTo(6, 3); x.lineTo(10, 2); x.lineTo(12, 7); x.lineTo(12, 28); x.fill();
    r(9, 6, 3, 22, '#6e6e76'); r(4, 9, 2, 16, '#b4b4b8');
    for (let i = 0; i < 5; i++) p(4 + Math.floor(hash(i, v, 2) * 7), 6 + Math.floor(hash(v, i, 4) * 20), '#b8c870');
    if (lit) { for (let Y = 8; Y < 26; Y += 5) { r(6, Y, 3, 1, '#7affe0'); r(7, Y + 1, 1, 2, '#7affe0'); } }
  } else if (ch === 'N') {
    [c, x] = mk(18, 30); const { r, p } = pctx(x); const snow = lit;
    r(8, 22, 3, 7, '#3a2412'); r(9, 22, 1, 6, '#6a4428');
    const tiers = [[9, 22, 9], [9, 16, 7.5], [9, 10, 6], [9, 4, 4]];
    for (const [cx, by, hw] of tiers) for (let Y = 0; Y < 9; Y++) { const w = Math.round(hw * (Y + 1) / 9); for (let X = -w; X <= w; X++) { const px = cx + X, py = by - 8 + Y; const edge = Math.abs(X) === w || Y === 8; p(px, py, edge ? '#143a24' : (X > w * .3 ? '#1e5a34' : X < -w * .4 ? '#3a8a50' : '#2a7040')); } }
    if (snow) for (const [cx, by, hw] of tiers) { for (let X = -Math.round(hw * .5); X <= Math.round(hw * .2); X++) p(cx + X, by - 8 + Math.round((Math.abs(X) / hw) * 8) + 1, '#ffffff'); p(cx, by - 8, '#ffffff'); }
  } else if (ch === 'L') {
    [c, x] = mk(16, 28); const { r } = pctx(x);
    r(7, 8, 2, 20, '#2a2a34'); r(6, 26, 4, 2, '#2a2a34'); r(4, 2, 8, 7, '#2a2a34'); r(5, 3, 6, 5, lit ? '#fff0a0' : '#d8d0a8'); r(6, 0, 4, 2, '#2a2a34');
  }
  TALLCACHE[key] = c; return c;
}

// ================= BUILDINGS =================
const SPECIALB = {
  museum(x, w, h, b) { const { r, p } = pctx(x); const dx = (b.door - b.x) * 16;
    r(2, 20, w - 4, h - 20, '#6a6258'); r(3, 20, w - 6, h - 21, '#e8e0d0'); for (let Y = 24; Y < h - 3; Y += 5) r(3, Y, w - 6, 1, '#d4ccbc');
    x.fillStyle = '#6a6258'; x.beginPath(); x.moveTo(0, 22); x.lineTo(w / 2, 2); x.lineTo(w, 22); x.fill(); x.fillStyle = '#d8d0c0'; x.beginPath(); x.moveTo(4, 20); x.lineTo(w / 2, 5); x.lineTo(w - 4, 20); x.fill();
    r(0, 20, w, 3, '#b8b0a0'); r(0, 20, w, 1, '#f0e8dc'); pcirc(x, w / 2, 14, 3, '#c8a040');
    for (let i = 0; i < 5; i++) { const cx = 8 + i * (w - 16) / 4; r(cx - 3, 23, 6, h - 27, '#f8f4ec'); r(cx + 1, 23, 2, h - 27, '#d8d0c4'); r(cx - 4, 23, 8, 2, '#c8c0b0'); r(cx - 4, h - 6, 8, 2, '#c8c0b0'); }
    r(dx + 2, h - 17, 12, 16, '#3a2a1e'); r(dx + 3, h - 16, 10, 15, '#6a4424'); r(dx + 7, h - 16, 2, 15, '#3a2a1e'); r(0, h - 3, w, 3, '#b8b0a0'); r(0, h - 3, w, 1, '#d8d0c4'); },
  power(x, w, h, b) { const { r, p } = pctx(x); const dx = (b.door - b.x) * 16;
    r(w - 22, 0, 12, h - 20, '#6a6a74'); for (let Y = 4; Y < h - 20; Y += 8) r(w - 22, Y, 12, 3, '#d84040'); r(w - 23, 0, 14, 3, '#3a3a44');
    r(2, 24, w - 4, h - 24, '#5a2a1e'); r(3, 25, w - 6, h - 26, '#a85a40'); for (let Y = 27; Y < h - 3; Y += 3) for (let X = 3 + ((Y / 3) % 2) * 3; X < w - 4; X += 6) r(X, Y, 5, 2, '#b86a50');
    r(0, 20, w, 6, '#3a3a44'); r(1, 21, w - 2, 3, '#5a5a66');
    for (let X = 8; X + 12 < w - 4; X += 20) if (Math.abs(X + 6 - (dx + 8)) > 14) { r(X, 30, 12, 14, '#2a2a34'); r(X + 1, 31, 10, 12, '#e8d880'); r(X + 6, 31, 1, 12, '#2a2a34'); r(X + 1, 37, 10, 1, '#2a2a34'); }
    r(dx, h - 20, 16, 20, '#2a2a34'); r(dx + 1, h - 19, 14, 19, '#7a8494'); for (let Y = h - 17; Y < h; Y += 3) r(dx + 1, Y, 14, 1, '#5a6474');
    p(dx + 7, h - 26, '#ffe040'); p(dx + 8, h - 25, '#ffe040'); p(dx + 7, h - 24, '#ffe040'); p(dx + 8, h - 23, '#ffe040'); },
  lighthouse(x, w, h, b) { const { r, p } = pctx(x); const cx = w / 2;
    for (let Y = 22; Y < h; Y++) { const hw = 9 + (Y - 22) / (h - 22) * 5; const band = Math.floor((Y - 22) / 10) % 2; r(Math.round(cx - hw), Y, Math.round(hw * 2), 1, band ? '#f4f0ea' : '#d83838'); p(Math.round(cx - hw), Y, '#3a2a2a'); p(Math.round(cx + hw) - 1, Y, '#3a2a2a'); r(Math.round(cx + hw) - 5, Y, 4, 1, band ? '#d0ccc6' : '#a82828'); }
    r(cx - 11, 20, 22, 3, '#2a2a34'); for (let X = cx - 10; X < cx + 11; X += 3) r(X, 16, 1, 4, '#2a2a34'); r(cx - 11, 15, 22, 1, '#2a2a34');
    r(cx - 7, 6, 14, 10, '#2a2a34'); r(cx - 6, 7, 12, 8, G.flags && G.flags.lighthouse ? '#fff4a0' : '#8a9aa8'); r(cx - 1, 7, 2, 8, '#2a2a34');
    x.fillStyle = '#d83838'; x.beginPath(); x.moveTo(cx - 9, 7); x.lineTo(cx, 0); x.lineTo(cx + 9, 7); x.fill();
    r(cx - 5, h - 14, 10, 14, '#3a2a1e'); r(cx - 4, h - 13, 8, 13, '#6a4424'); r(cx - 3, 34, 6, 6, '#3a3a44'); r(cx - 2, 35, 4, 4, '#a8d8f0'); },
  castle(x, w, h, b) { const { r, p } = pctx(x); const dx = (b.door - b.x) * 16, st = '#9a98a2', sd = '#6a6872', sl = '#bab8c2';
    const block = (X, Y, W, H) => { r(X, Y, W, H, sd); r(X + 1, Y + 1, W - 2, H - 2, st); for (let yy = Y + 4; yy < Y + H - 2; yy += 5) for (let xx = X + 2 + ((yy / 5) % 2) * 4; xx < X + W - 4; xx += 8) r(xx, yy, 6, 1, sl); for (let xx = X; xx < X + W; xx += 6) r(xx, Y - 4, 4, 5, sd), r(xx + 1, Y - 3, 2, 4, st); };
    block(16, 30, w - 32, h - 30); block(0, 14, 28, h - 14); block(w - 28, 14, 28, h - 14);
    for (const tx of [14, w - 14]) { r(tx - 1, 0, 2, 14, '#4a3a2a'); r(tx + 1, 1, 9, 6, '#3a58a8'); r(tx + 2, 3, 3, 2, '#e8c040'); }
    for (const [ax, ay] of [[8, 26], [8, 44], [w - 12, 26], [w - 12, 44], [44, 42], [w - 48, 42]]) { r(ax, ay, 3, 7, '#2a2830'); }
    r(dx - 6, h - 30, 28, 30, sd); r(dx - 4, h - 28, 24, 28, '#2a2028'); x.fillStyle = sd; x.beginPath(); x.arc(dx + 8, h - 28, 12, Math.PI, 0); x.fill(); x.fillStyle = '#2a2028'; x.beginPath(); x.arc(dx + 8, h - 28, 10, Math.PI, 0); x.fill();
    for (let X = dx - 4; X < dx + 20; X += 4) r(X, h - 40, 1, 8, '#5a5048'); r(dx - 4, h - 33, 24, 2, '#5a5048'); },
  oak(x, w, h, b) { const { r, p } = pctx(x); const healed = G.flags && G.flags.glade;
    r(w / 2 - 7, h - 26, 14, 24, '#3a2412'); r(w / 2 - 5, h - 26, 10, 24, '#6a4428'); r(w / 2 - 5, h - 26, 3, 24, '#8a5a34');
    for (const [rx, ry, rw] of [[w / 2 - 14, h - 6, 8], [w / 2 + 6, h - 6, 9], [w / 2 - 10, h - 4, 5]]) { r(rx, ry, rw, 4, '#3a2412'); r(rx + 1, ry, rw - 2, 2, '#6a4428'); }
    const blobs = [[w / 2, 22, 21], [w / 2 - 17, 28, 13], [w / 2 + 17, 28, 13], [w / 2 - 9, 12, 12], [w / 2 + 10, 12, 12]];
    const base = healed ? '#3c8e46' : '#6a7a5a', mid = healed ? '#2a6c36' : '#566448', lite = healed ? '#6abc5e' : '#8a9a6a', dark = healed ? '#1f5229' : '#3e4a36';
    for (let Y = 0; Y < h - 16; Y++) for (let X = 0; X < w; X++) { const inb = blobs.some(([bx, by, br]) => (X + .5 - bx) ** 2 + (Y + .5 - by) ** 2 <= br * br); if (!inb) { if (blobs.some(([bx, by, br]) => (X + .5 - bx) ** 2 + (Y + .5 - by) ** 2 <= (br + 1) ** 2)) p(X, Y, '#163c1e'); continue; }
      const d = (X - w / 2) * .4 + (Y - 20) * .9; p(X, Y, d > 10 ? dark : d > 2 ? mid : (hash(X, Y, 3) > .9 ? lite : base)); }
    for (let i = 0; i < 18; i++) { const X = 6 + Math.floor(hash(i, 1, 9) * (w - 12)), Y = 4 + Math.floor(hash(1, i, 9) * 34); p(X, Y, healed ? '#9ee07a' : '#a0a888'); }
    if (healed) for (let i = 0; i < 8; i++) { const X = 8 + Math.floor(hash(i, 2, 4) * (w - 16)), Y = 6 + Math.floor(hash(2, i, 4) * 30); p(X, Y, '#7affe0'); } },
  beacon(x, w, h, b) { const { r, p } = pctx(x);
    r(2, h - 12, w - 4, 12, '#5a5048'); r(3, h - 11, w - 6, 10, '#9a9080'); r(3, h - 11, w - 6, 2, '#b8b0a0'); for (let X = 4; X < w - 4; X += 6) r(X, h - 7, 4, 1, '#7a7060');
    r(6, h - 20, w - 12, 8, '#2a2428'); r(7, h - 19, w - 14, 6, '#4a4048'); r(8, h - 22, 2, 3, '#2a2428'); r(w - 10, h - 22, 2, 3, '#2a2428');
    for (let i = 0; i < 14; i++) { const X = 9 + Math.floor(hash(i, 5, 2) * (w - 18)), H2 = 4 + Math.floor(hash(5, i, 2) * 9); r(X, h - 20 - H2, 2, H2, i % 3 ? '#f08030' : '#ffd040'); p(X, h - 21 - H2, '#fff0a0'); } },
  league(x, w, h, b) { const { r } = pctx(x); const dx = (b.door - b.x) * 16;
    r(2, 30, w - 4, h - 30, '#5a5a6a'); r(3, 31, w - 6, h - 32, '#f4f0ea'); for (let i = 0; i < 7; i++) { const cx = 10 + i * (w - 20) / 6; r(cx - 3, 34, 6, h - 38, '#ffffff'); r(cx + 1, 34, 2, h - 38, '#d8d4cc'); }
    pcirc(x, w / 2, 26, 20, '#8a6a20', (X, Y) => Y < 30); pcirc(x, w / 2, 26, 18, '#e8c040', (X, Y) => Y < 30); pcirc(x, w / 2 - 5, 18, 5, '#fff0a0', (X, Y) => Y < 22);
    r(0, 28, w, 4, '#8a6a20'); r(0, 28, w, 1, '#e8c040'); r(w / 2 - 1, 0, 2, 8, '#4a3a2a'); r(w / 2 + 1, 1, 8, 5, '#d83838');
    r(dx, h - 18, 16, 18, '#3a2a1e'); r(dx + 1, h - 17, 14, 17, '#b83838'); r(dx + 7, h - 17, 2, 17, '#e8c040'); r(0, h - 3, w, 3, '#c8c4bc'); },
  church(x, w, h, b) { const { r, p } = pctx(x); const dx = (b.door - b.x) * 16;
    r(2, 34, w - 4, h - 34, '#5a5850'); r(3, 35, w - 6, h - 36, '#b8b4a4'); for (let Y = 38; Y < h - 3; Y += 5) for (let X = 3 + ((Y / 5) % 2) * 4; X < w - 4; X += 8) r(X, Y, 7, 1, '#a8a494');
    x.fillStyle = '#4a4a52'; x.beginPath(); x.moveTo(0, 36); x.lineTo(w / 2, 16); x.lineTo(w, 36); x.fill();
    r(w - 26, 4, 18, 34, '#5a5850'); r(w - 25, 5, 16, 32, '#b8b4a4'); x.fillStyle = '#4a4a52'; x.beginPath(); x.moveTo(w - 28, 6); x.lineTo(w - 17, -12); x.lineTo(w - 6, 6); x.fill(); r(w - 18, 14, 3, 8, '#2a2a34'); pcirc(x, w - 16.5, 14, 1.5, '#2a2a34');
    for (const wx of [12, w - 44]) { r(wx, 42, 10, 14, '#3a3a44'); r(wx + 1, 43, 8, 12, '#6a58c8'); r(wx + 4, 43, 2, 12, '#3a3a44'); pcirc(x, wx + 5, 43, 4, '#3a3a44', (X, Y) => Y < 43); }
    r(dx + 2, h - 16, 12, 16, '#3a2a1e'); r(dx + 3, h - 15, 10, 15, '#6a4424'); pcirc(x, dx + 8, h - 15, 5, '#3a2a1e', (X, Y) => Y < h - 15); },
};
function buildingCanvas(b) {
  if (b._c) return b._c;
  if (SPECIALB[b.type]) { const [c, x] = mk(b.w * 16, b.h * 16); SPECIALB[b.type](x, b.w * 16, b.h * 16, b); b.windows = []; b._c = c; return c; }
  const w = b.w * 16, h = b.h * 16; const [c, x] = mk(w, h); const { p, r } = pctx(x);
  const roofH = b.roofH || Math.round(h * .52);
  const wallCol = { cottage: '#f4eedc', house: '#c87858', lab: '#dfe0e8', wayhouse: '#f6ecd8', gym: '#cdbd92', mill: '#a8a498' }[b.type];
  const roofCol = b.roof || { cottage: '#c8a050', house: '#5a6a8a', lab: '#4a526c', wayhouse: '#d24a48', gym: '#e8b030', mill: '#5a5060' }[b.type];
  const top = roofH - 3;
  r(1, top, w - 2, h - top, dk(wallCol, .5)); r(2, top, w - 4, h - top - 1, wallCol);
  if (b.type === 'house') for (let Y = top + 2; Y < h - 3; Y += 3) for (let X = 2 + ((Y / 3) % 2) * 3; X < w - 3; X += 6) r(X, Y, 5, 2, lt(wallCol, .08)), r(X, Y + 2, 6, 1, dk(wallCol, .15));
  if (b.type === 'mill' || b.type === 'gym') for (let Y = top + 2; Y < h - 3; Y += 4) for (let X = 2 + ((Y / 4) % 2) * 4; X < w - 3; X += 8) r(X, Y, 7, 3, lt(wallCol, .1)), r(X, Y + 3, 8, 1, dk(wallCol, .2));
  if (b.type === 'cottage') { for (let i = 0; i < 12; i++) p(3 + Math.floor(hash(i, b.x, 1) * (w - 6)), top + 2 + Math.floor(hash(b.y, i, 2) * (h - top - 6)), '#e0d8c0'); r(2, top, 2, h - top - 1, '#6a4a2a'); r(w - 4, top, 2, h - top - 1, '#6a4a2a'); }
  r(2, h - 3, w - 4, 2, dk(wallCol, .25));
  r(2, roofH - 1, w - 4, 3, dk(wallCol, .22)); r(2, roofH + 2, w - 4, 1, dk(wallCol, .1));
  // roof
  const ov = 1;
  x.fillStyle = dk(roofCol, .55); x.beginPath(); x.moveTo(-ov, roofH); x.lineTo(5, 2); x.lineTo(w - 5, 2); x.lineTo(w + ov, roofH); x.closePath(); x.fill();
  x.fillStyle = roofCol; x.beginPath(); x.moveTo(1, roofH - 1); x.lineTo(6, 3); x.lineTo(w - 6, 3); x.lineTo(w - 1, roofH - 1); x.closePath(); x.fill();
  if (b.type === 'cottage') { for (let Y = 5; Y < roofH - 1; Y += 3) for (let X = 3; X < w - 3; X += 2) if (hash(X, Y, 3) > .4) r(X, Y, 1, 2, dk(roofCol, .22)); r(5, 2, w - 10, 2, dk(roofCol, .35)); r(1, roofH - 2, w - 2, 2, dk(roofCol, .3)); }
  else if (b.type === 'gym') { for (let Y = 6; Y < roofH - 1; Y += 4) r(3, Y, w - 6, 1, dk(roofCol, .2)); for (let X = 6; X < w - 6; X += 6) r(X, 4, 1, roofH - 6, dk(roofCol, .15)); }
  else { for (let Y = 5; Y < roofH - 1; Y += 3) { r(2, Y, w - 4, 1, dk(roofCol, .22)); for (let X = 4 + (Y % 2) * 3; X < w - 3; X += 6) r(X, Y - 2, 1, 2, dk(roofCol, .18)); } r(4, 3, w - 8, 1, lt(roofCol, .3)); }
  // chimney
  if (b.type === 'cottage' || b.type === 'house' || b.type === 'mill') { const X = w - 18; r(X, 0, 7, 8, '#4a3a3a'); r(X + 1, 1, 5, 7, '#8a5a4a'); r(X, 0, 7, 2, '#5a4a4a'); }
  // windows + door
  b.windows = [];
  const dxp = (b.door - b.x) * 16;
  const winY = top + 5, winH = Math.min(9, h - top - 12);
  const winXs = [];
  for (let X = 5; X + 10 < w - 3; X += 16) if (Math.abs(X + 5 - (dxp + 8)) > 10) winXs.push(X);
  for (const X of winXs) {
    r(X - 1, winY - 1, 12, winH + 2, '#4a3020'); r(X, winY, 10, winH, '#9cd4f4'); r(X + 4, winY, 2, winH, '#4a3020'); r(X, winY + Math.floor(winH / 2), 10, 1, '#4a3020'); r(X + 1, winY + 1, 2, 2, '#e4f4ff');
    if (b.type === 'cottage') { r(X - 1, winY + winH + 1, 12, 2, '#6a8a3a'); p(X + 1, winY + winH + 1, '#f06080'); p(X + 5, winY + winH + 1, '#f0d040'); p(X + 8, winY + winH + 1, '#f06080'); }
    b.windows.push([X, winY, 10, winH]);
  }
  const dh = 14;
  if (b.type === 'wayhouse' || b.type === 'gym' || b.type === 'lab') { r(dxp + 2, h - dh - 1, 12, dh + 1, '#3a3a44'); r(dxp + 3, h - dh, 10, dh, '#a8d8f0'); r(dxp + 7, h - dh, 2, dh, '#6a8aa0'); r(dxp + 4, h - dh + 1, 2, 5, '#e4f4ff'); }
  else { r(dxp + 3, h - dh - 1, 10, dh + 1, '#3a2010'); r(dxp + 4, h - dh, 8, dh, '#8a5a30'); r(dxp + 5, h - dh + 2, 6, 4, '#7a4a24'); r(dxp + 5, h - dh + 8, 6, 4, '#7a4a24'); p(dxp + 10, h - 7, '#f0d060'); }
  // signage
  if (b.type === 'wayhouse') { const X = dxp - 2, Y = top - 2; r(X, Y, 20, 8, '#303848'); r(X + 1, Y + 1, 18, 6, '#f4f4f8'); pcirc(x, X + 10, Y + 4, 2.6, '#d24a48'); r(X + 9, Y + 2, 2, 5, '#ffffff'); r(X + 8, Y + 3, 4, 2, '#ffffff'); }
  if (b.type === 'gym') { const X = dxp - 1, Y = top - 6; x.fillStyle = '#6a4a10'; x.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; x.lineTo(X + 9 + Math.cos(a) * 8, Y + 6 + Math.sin(a) * 8); } x.fill(); x.fillStyle = '#ffd860'; x.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; x.lineTo(X + 9 + Math.cos(a) * 6, Y + 6 + Math.sin(a) * 6); } x.fill(); r(X + 7, Y + 4, 4, 4, '#3a3040'); }
  if (b.type === 'lab') { r(dxp - 10, top + 3, 8, 6, '#b89030'); r(dxp - 9, top + 4, 6, 4, '#f0d070'); }
  if (b.type === 'mill') { const X = w - 6, Y = h - 20; pcirc(x, X, Y, 9, '#3a2412'); pcirc(x, X, Y, 7.5, '#8a5a30'); pcirc(x, X, Y, 5, '#3a2412'); pcirc(x, X, Y, 3.5, '#8a5a30'); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; r(Math.round(X + Math.cos(a) * 7) - 1, Math.round(Y + Math.sin(a) * 7) - 1, 2, 2, '#c89a60'); } }
  b._c = c; return c;
}

// ================= PEOPLE =================
const PEOPLE = {};
function personSprite(look, dir, fr) {
  const key = JSON.stringify(look) + dir + fr;
  if (PEOPLE[key]) return PEOPLE[key];
  const Wd = 16, Hd = 22, buf = new Array(Wd * Hd).fill(null);
  const set = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < Wd && y < Hd) buf[y * Wd + x] = c; };
  const rect = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
  const ell = (cx, cy, rx, ry, c, f) => { for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) if (((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1 && (!f || f(x, y))) set(x, y, c); };
  const side = dir === 'left' || dir === 'right';
  const skin = look.skin || '#f8d0a8', hair = look.hair || '#5a3a28', shirt = look.shirt || '#4868b8', pants = look.pants || '#383848', shoe = look.shoes || '#3a2a2a';
  const sd = dk(shirt, .25), pd = dk(pants, .25);
  // legs
  if (!side) {
    const l1 = fr === 1 ? -1 : 0, l2 = fr === 2 ? -1 : 0;
    rect(5, 16 + l1, 2, 4, pants); rect(9, 16 + l2, 2, 4, pd); rect(4, 20 + l1, 3, 1, shoe); rect(9, 20 + l2, 3, 1, shoe);
  } else {
    if (fr === 0) { rect(6, 16, 3, 4, pants); rect(5, 20, 4, 1, shoe); }
    else { rect(4, 16, 2, 4, pd); rect(9, 16, 2, 4, pants); rect(3, 20, 3, 1, shoe); rect(9, 20, 3, 1, shoe); }
  }
  // torso
  const long = look.coat;
  rect(4, 11, 8, long ? 8 : 6, shirt); rect(4, 15, 8, long ? 4 : 2, sd);
  if (look.accent) { if (dir === 'down') { rect(7, 12, 2, 2, look.accent); } else if (dir === 'up') rect(4, 11, 8, 1, look.accent); else rect(side ? 7 : 4, 12, 2, 2, look.accent); }
  if (look.apron && dir !== 'up') rect(side ? 5 : 5, 13, side ? 4 : 6, long ? 6 : 4, look.apron);
  // arms
  if (!side) { const a = fr === 1 ? 1 : 0, b2 = fr === 2 ? 1 : 0; rect(3, 11, 1, 4 - a, shirt); rect(12, 11, 1, 4 - b2, shirt); set(3, 15 - a, skin); set(12, 15 - b2, skin); }
  else { const sw = fr === 1 ? 1 : fr === 2 ? -1 : 0; rect(7 + sw, 12, 2, 3, sd); rect(7 + sw, 15, 2, 1, skin); }
  // head
  ell(8, 6.5, 5.3, 4.9, skin);
  const st = look.style || 'short';
  const hd = dk(hair, .25);
  if (st === 'hood') {
    ell(8, 6.5, 5.6, 5.3, hair); if (dir !== 'up') ell(side ? (dir === 'left' ? 6 : 10) : 8, 7.6, side ? 3 : 3.6, 3.2, skin);
    if (look.veil) rect(2, 8, 12, 1, look.veil);
  } else if (dir === 'up') {
    ell(8, 6.3, 5.4, 5, hair); ell(8, 8.5, 4.5, 2.5, hd, (x, y) => y > 8);
    if (st === 'bun') ell(8, 1.5, 2.2, 1.8, hair); if (st === 'long') rect(3, 8, 10, 5, hair);
    if (st === 'cap') { ell(8, 4, 5.4, 3.2, look.cap || '#d83838', (x, y) => y < 5); }
  } else {
    // hair shapes
    if (st === 'prof' || st === 'bald') { ell(8, 3.8, 4.8, 2.2, skin); rect(2, 4, 2, 5, hair); rect(12, 4, 2, 5, hair); if (st === 'prof') ell(8, 2.8, 4, 1.5, hair); }
    else {
      ell(8, 4.2, 5.4, 3.4, hair, (x, y) => y < 6);
      if (!side) { rect(3, 4, 1, 4, hair); rect(12, 4, 1, 4, hair); if (st === 'slick') { set(5, 5, hair); set(6, 5, hair); set(10, 2, lt(hair, .3)); } else { set(6, 6, hair); set(10, 6, hair); } }
      else { const bx = dir === 'left' ? 9 : 3; rect(bx, 3, 4, 6, hair); set(dir === 'left' ? 4 : 11, 6, hair); }
      if (st === 'long') { if (!side) { rect(2, 5, 2, 8, hair); rect(12, 5, 2, 8, hair); } else rect(dir === 'left' ? 10 : 2, 5, 4, 8, hair); }
      if (st === 'bun') ell(side ? (dir === 'left' ? 11 : 5) : 8, 1.6, 2.2, 1.8, hair);
      if (st === 'cap') { const cc = look.cap || '#d83838'; ell(8, 4.2, 5.5, 3.2, cc, (x, y) => y < 5); if (!side) rect(3, 5, 10, 1, dk(cc, .35)); else rect(dir === 'left' ? 1 : 7, 5, 8, 1, dk(cc, .35)); set(8, 2, lt(cc, .5)); }
    }
    // face
    const eye = '#282030';
    if (!side) { rect(5, 7, 1, 2, eye); rect(10, 7, 1, 2, eye); if (look.glasses) { rect(4, 7, 3, 1, '#606070'); rect(9, 7, 3, 1, '#606070'); } }
    else { const ex = dir === 'left' ? 4 : 11; rect(ex, 7, 1, 2, eye); set(dir === 'left' ? 3 : 12, 9, dk(skin, .1)); }
    if (look.beard) rect(side ? (dir === 'left' ? 3 : 8) : 5, 9, side ? 5 : 6, 2, look.beard);
  }
  // hooded faces still need eyes
  if (st === 'hood' && dir !== 'up') { if (!side) { rect(5, 7, 1, 2, '#282030'); rect(10, 7, 1, 2, '#282030'); } else rect(dir === 'left' ? 4 : 11, 7, 1, 2, '#282030'); }
  // hair highlight streak
  if (st !== 'hood' && st !== 'bald' && st !== 'prof') { const hl = lt(hair, .38); if (dir === 'down') { set(5, 2, hl); set(6, 2, hl); set(4, 3, hl); } else if (dir === 'up') { set(5, 3, hl); set(6, 2, hl); set(7, 2, hl); } else { set(dir === 'left' ? 9 : 5, 2, hl); set(dir === 'left' ? 10 : 6, 3, hl); } }
  // light from the top-left: soft highlight on upper-left edges, shade on right edges
  const sh = buf.slice(), filled = (x, y) => x >= 0 && y >= 0 && x < Wd && y < Hd && buf[y * Wd + x];
  for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) { const c = buf[y * Wd + x]; if (!c || c === '#282030') continue;
    if (!filled(x + 1, y) || (x >= 10 && !filled(x + 2, y))) sh[y * Wd + x] = dk(c, .2);
    else if ((!filled(x, y - 1) || !filled(x - 1, y)) && x < 9) sh[y * Wd + x] = lt(c, .22); }
  // coloured outline (sel-out): each edge takes a deep tone of the colour it borders
  const out = sh.slice();
  for (let y = 0; y < Hd; y++) for (let x = 0; x < Wd; x++) {
    if (buf[y * Wd + x]) continue;
    const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].map(([a, b]) => filled(a, b)).filter(Boolean);
    if (nb.length) out[y * Wd + x] = mix(nb[0], '#1a1022', .72);
  }
  const [c, cx] = mk(Wd, Hd); const img = cx.createImageData(Wd, Hd);
  out.forEach((col, i) => { if (!col) return; const [r, g, b] = h2r(col); img.data.set([r, g, b, 255], i * 4); });
  cx.putImageData(img, 0, 0);
  PEOPLE[key] = c; return c;
}
const LOOKS = {
  player: { skin: '#f8d0a8', hair: '#5a3a28', style: 'cap', cap: '#d83838', shirt: '#3a60b0', pants: '#34344a', shoes: '#d84040', accent: '#f0d060' },
  mum: { hair: '#8a4a2a', style: 'long', shirt: '#e87890', pants: '#5a5a88', apron: '#fff4f0' },
  prof: { hair: '#d0d0d4', style: 'prof', shirt: '#f4f4f4', pants: '#6a5a4a', coat: 1, glasses: 1, beard: '#d0d0d4' },
  rival: { hair: '#f0d060', style: 'slick', shirt: '#243466', pants: '#e8e0cc', shoes: '#5a3a20', accent: '#e8c040' },
  grunt: { style: 'hood', hair: '#646a62', shirt: '#646a62', pants: '#32362f', accent: '#a6e040', coat: 1 },
  admin: { hair: '#3a2a4a', style: 'long', shirt: '#44424e', pants: '#2a2830', accent: '#a6e040', coat: 1 },
  hazel: { hair: '#8a5a30', style: 'bun', shirt: '#f0c030', pants: '#6a5030', accent: '#3a3040' },
  nurse: { hair: '#f0a0b0', style: 'bun', shirt: '#ffffff', pants: '#f090a8', apron: '#ffe0e8' },
  shop: { hair: '#3a3a3a', style: 'short', shirt: '#4a9a58', pants: '#3a3a48', apron: '#f4f0e0' },
  oldman: { hair: '#c8c8c8', style: 'cap', cap: '#7a6a4a', shirt: '#8a7a5a', pants: '#5a4a3a', beard: '#c8c8c8' },
  nan: { hair: '#e0e0e8', style: 'bun', shirt: '#9a6ab8', pants: '#5a4a6a', glasses: 1 },
  boy: { hair: '#2a2a2a', style: 'cap', cap: '#3a9a58', shirt: '#f08030', pants: '#3a4a8a' },
  girl: { hair: '#c8602a', style: 'long', shirt: '#e84a6a', pants: '#f4f0e8' },
  farmer: { hair: '#6a4a2a', style: 'cap', cap: '#4a5a3a', shirt: '#6a8a4a', pants: '#4a3a2a', beard: '#6a4a2a' },
  keeper: { style: 'hood', hair: '#f0ead8', shirt: '#f0ead8', pants: '#8a7a5a', veil: '#5a5a5a' },
  bugfan: { hair: '#3a2a1a', style: 'short', shirt: '#6ab04a', pants: '#8a6a3a', glasses: 1 },
  miller: { hair: '#8a8a8a', style: 'short', shirt: '#b8a888', pants: '#5a4a3a', apron: '#e8e0d0', beard: '#8a8a8a' },
  hiker: { hair: '#4a3a2a', style: 'cap', cap: '#c85030', shirt: '#4a7a9a', pants: '#6a5a3a', beard: '#4a3a2a' },
  aide: { hair: '#2a2a3a', style: 'short', shirt: '#f4f4f4', pants: '#4a4a5a', coat: 1, glasses: 1 },
  driver: { hair: '#4a3a2a', style: 'cap', cap: '#2a3a6a', shirt: '#2a3a6a', pants: '#2a2a38', accent: '#e8c040' },
  engineer: { hair: '#6a4a2a', style: 'cap', cap: '#f0c030', shirt: '#e87830', pants: '#3a4a6a' },
  ada: { hair: '#e8e8f0', style: 'bun', shirt: '#3a4a6a', pants: '#2a2a38', accent: '#f0e040', glasses: 1, coat: 1 },
  sailor: { hair: '#3a2a1a', style: 'cap', cap: '#f4f4f4', shirt: '#f4f4f4', pants: '#2a3a7a', accent: '#2a3a7a' },
  swimmer: { hair: '#e0b040', style: 'short', shirt: '#3aa0e0', pants: '#3aa0e0', skin: '#f0c098' },
  maren: { hair: '#2a4a8a', style: 'long', shirt: '#2a5aa8', pants: '#f4f0e8', coat: 1, accent: '#e8c040' },
  fisher: { hair: '#8a7a6a', style: 'cap', cap: '#4a6a3a', shirt: '#6a8a5a', pants: '#4a4a3a', beard: '#8a7a6a' },
  curator: { hair: '#b0b0b0', style: 'prof', shirt: '#6a3a3a', pants: '#3a2a2a', coat: 1, glasses: 1 },
  gentleman: { hair: '#6a6a6a', style: 'slick', shirt: '#3a3a4a', pants: '#2a2a38', accent: '#f4f4f4', coat: 1 },
  rook: { hair: '#1a1a22', style: 'short', shirt: '#44463e', pants: '#22241f', accent: '#a6e040', coat: 1, beard: '#1a1a22' },
  miner: { hair: '#4a3a2a', style: 'cap', cap: '#e8c030', shirt: '#6a5a4a', pants: '#3a3a44', beard: '#4a3a2a' },
  gideon: { hair: '#e0e0e0', style: 'cap', cap: '#e8c030', shirt: '#8a6a48', pants: '#4a3a2a', beard: '#e0e0e0' },
  guard: { hair: '#2a2a2a', style: 'cap', cap: '#2a3a6a', shirt: '#3a4a7a', pants: '#2a2a38', accent: '#e8c040' },
  briony: { hair: '#e86a8a', style: 'long', shirt: '#58b048', pants: '#6a4a2a', accent: '#f0a0c0', apron: '#a8d890' },
  gardener: { hair: '#6a4a2a', style: 'cap', cap: '#d8c890', shirt: '#6aa04a', pants: '#5a4a3a', apron: '#8a6a4a' },
  vicar: { hair: '#9a9a9a', style: 'short', shirt: '#2a2a30', pants: '#2a2a30', accent: '#ffffff', coat: 1 },
  knight: { hair: '#8a8a94', style: 'hood', shirt: '#a8b0bc', pants: '#6a7280', accent: '#d83838' },
  percival: { hair: '#c8ccd4', style: 'hood', shirt: '#c8ccd4', pants: '#7a8290', accent: '#3a58a8', coat: 1 },
  scientist: { hair: '#646a62', style: 'short', shirt: '#e8ece4', pants: '#32362f', accent: '#a6e040', coat: 1, glasses: 1 },
  skier: { hair: '#c85030', style: 'cap', cap: '#3a8ad8', shirt: '#e84a4a', pants: '#2a3a6a' },
  elspeth: { hair: '#e8f0f8', style: 'long', shirt: '#6ab0e8', pants: '#e8f0f8', coat: 1, accent: '#ffffff' },
  ranger: { hair: '#5a3a2a', style: 'cap', cap: '#4a6a3a', shirt: '#6a7a4a', pants: '#4a4a3a' },
  caradoc: { hair: '#2a1a1a', style: 'long', shirt: '#8a2a2a', pants: '#2a2a2a', coat: 1, accent: '#e8c040', beard: '#2a1a1a' },
  acem: { hair: '#3a2a1a', style: 'slick', shirt: '#d83838', pants: '#2a2a38', accent: '#f4f4f4' },
  acef: { hair: '#2a2a3a', style: 'long', shirt: '#d83838', pants: '#2a2a38', accent: '#f4f4f4' },
  blackbelt: { hair: '#1a1a1a', style: 'short', shirt: '#f4f4f4', pants: '#f4f4f4', accent: '#1a1a1a', skin: '#e8b890' },
  tamer: { hair: '#8a2a2a', style: 'long', shirt: '#4a2a5a', pants: '#2a2a38', coat: 1, accent: '#e8c040' },
  rosalind: { hair: '#c8c8d8', style: 'bun', shirt: '#4a2a6a', pants: '#2a1a3a', coat: 1, accent: '#a8e0c8' },
  bertram: { hair: '#3a2a1a', style: 'short', shirt: '#e87830', pants: '#2a2a38', beard: '#3a2a1a', skin: '#d8a878' },
  seren: { hair: '#f0d8f0', style: 'long', shirt: '#b890e8', pants: '#6a4a9a', coat: 1, accent: '#fff4a0' },
  wulfric: { hair: '#2a2a2a', style: 'slick', shirt: '#26262e', pants: '#1a1a22', coat: 1, accent: '#c83838' },
  ambrose: { hair: '#e8e8e8', style: 'slick', shirt: '#243466', pants: '#1a1a22', coat: 1, accent: '#a6e040', beard: '#e8e8e8' },
};
function orbSprite(col = '#48c8b0') {
  const key = 'orb' + col; if (PEOPLE[key]) return PEOPLE[key];
  const [c, x] = mk(12, 12); pcirc(x, 6, 6, 5.6, '#241c2c'); pcirc(x, 6, 6, 4.6, '#f4f4f0'); pcirc(x, 6, 6, 4.6, col, (X, Y) => Y < 6); x.fillStyle = '#c89a30'; x.fillRect(1, 5, 10, 2); pcirc(x, 6, 6, 1.8, '#241c2c'); pcirc(x, 6, 6, 1, '#fff'); x.fillStyle = '#ffffff'; x.fillRect(3, 3, 2, 1);
  PEOPLE[key] = c; return c;
}