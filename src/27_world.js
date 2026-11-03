// ---- world ----
// ================= TILES =================
function pctx(x) { return { p: (X, Y, c) => { x.fillStyle = c; x.fillRect(X, Y, 1, 1); }, r: (X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(X, Y, w, h); } }; }
function pcirc(x, cx, cy, r, c, clip) { x.fillStyle = c; for (let Y = Math.floor(cy - r); Y <= cy + r; Y++) for (let X = Math.floor(cx - r); X <= cx + r; X++) { if ((X + .5 - cx) ** 2 + (Y + .5 - cy) ** 2 <= r * r && (!clip || clip(X, Y))) x.fillRect(X, Y, 1, 1); } }
const GR = { base: '#8ccc68', dk: '#5ca848', lt: '#b4e490' };
function drawGrass(x, v, pal = GR) {
  const { p, r } = pctx(x); r(0, 0, 16, 16, pal.base);
  const mid = mix(pal.base, pal.dk, .35), hi = mix(pal.base, pal.lt, .5);
  for (let i = 0; i < 10; i++) { const X = Math.floor(hash(v, i, 21) * 16), Y = Math.floor(hash(i, v, 23) * 16); p(X, Y, i % 3 ? mid : hi); }
  const spots = [[[2, 3], [10, 10], [12, 2]], [[9, 2], [3, 11], [13, 13]], [[5, 7], [12, 12], [1, 14]], [[12, 4], [2, 9], [8, 13]]][v % 4];
  for (const [sx, sy] of spots) { p(sx, sy + 1, pal.dk); p(sx + 1, sy, pal.dk); p(sx + 2, sy + 1, pal.dk); p(sx + 1, sy + 1, mid); p(sx + 1, sy - 1, hi); }
}