// ---- art0 ----
// ================= BEASTIE ART =================
// Each species' look is defined here (one file per batch in src/art/). An entry can replace the palette and
// the draw function. Designs are drawn facing the viewer's left, in a 64x64 design space, feet near y = 60.
const ART = {};
function BEAST(id, o) { ART[id] = o; }
// Extra parts shared by the designs
const K2 = {
  // layered flame: outer, middle and core colours; ang tilts it (degrees clockwise), h is height, w is half-width
  flame(g, x, y, h, w, ang, c1, c2, c3, o = {}) {
    const lick = o.licks || 3, pts = [];
    const at = (dx, dy) => { const a = ang * Math.PI / 180; return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)]; };
    const sh = (s) => { const p = []; for (let i = 0; i <= 24; i++) { const t = i / 24, th = t * Math.PI * 2; const bx = Math.sin(th) * w * s, by = -Math.cos(th); let r;
        if (by < 0) { const k = -by; r = 1 + k * (h * s / (w * s) - 1); const wob = Math.sin(t * Math.PI * 2 * lick) * .12 * k; p.push(...at(Math.sin(th) * w * s * (1 - k * .75) + wob * w, -k * h * s)); }
        else p.push(...at(bx, by * w * s * .85)); void r; } return p; };
    const ids = [g.p(sh(1), c1, { mat: 'glow', ...o })];
    if (c2) ids.push(g.p(sh(.68).map((v, i) => i % 2 ? v + h * .06 : v), c2, { mat: 'glow', ring: false }));
    if (c3) ids.push(g.p(sh(.38).map((v, i) => i % 2 ? v + h * .12 : v), c3, { mat: 'glow', ring: false }));
    return ids;
  },
  // simple claws/toes along the front of a paw
  toes(g, x, y, n, span, col) { if (g.small) return; for (let i = 0; i < n; i++) { const tx = x - span / 2 + span * (n === 1 ? .5 : i / (n - 1)); g.l(tx, y - 1, tx, y + .4, .38, col, { ring: false, shade: false }); } },
  claws(g, x, y, n, span, len, dir, col = '#f4ecdc') { for (let i = 0; i < n; i++) { const tx = x - span / 2 + span * (n === 1 ? .5 : i / (n - 1)); g.p([tx - .8, y, tx + .8, y, tx + dir * len * .4, y + len], col, { bevel: .6 }); } },
  // row of pointed teeth/spikes along a line
  zig(g, x1, y1, x2, y2, n, h, col, o = {}) { const pts = []; for (let i = 0; i <= n * 2; i++) { const t = i / (n * 2), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; const nx = -(y2 - y1), ny = x2 - x1, m = Math.hypot(nx, ny) || 1; pts.push(x + (i % 2 ? nx / m * h : 0), y + (i % 2 ? ny / m * h : 0)); } pts.push(x2, y2 + .01, x1, y1 + .01); return g.p(pts, col, o); },
  // stripes across an existing part (clipped): angle in degrees, spacing and width in units
  stripes(g, ids, x0, y0, x1, y1, ang, gap, w, col) { g.on(ids, () => { const a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a); const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2; for (let d = -R; d <= R; d += gap) { const px = cx - dy * d, py = cy + dx * d; g.l(px - dx * R, py - dy * R, px + dx * R, py + dy * R, w / 2, col); } }); },
  spots(g, ids, list, col) { g.on(ids, () => { for (const [x, y, r, r2] of list) g.e(x, y, r, r2 || r, col); }); },
  // tufted fur ruff/mane: a fuzzy ellipse
  ruff(g, cx, cy, rx, ry, col, n = 9, amp = .22, a0, a1, o = {}) { return g.fur(cx, cy, rx, ry, col, { n, amp, a0, a1, mat: 'fur', ...o }); },
  // stubby paw with toe lines
  paw(g, x, y, rx, ry, col, toeCol) { const id = g.e(x, y, rx, ry, col); if (toeCol && !g.small) { g.on(id, () => { g.l(x - rx * .25, y - ry * .2, x - rx * .25, y + ry, .35, toeCol, { shade: false }); g.l(x + rx * .25, y - ry * .2, x + rx * .25, y + ry, .35, toeCol, { shade: false }); }); } return id; },
  // pointed ear/horn-like fin with optional inner colour and tip colour; returns the part id
  ear(g, x, y, ang, len, w, col, inner, tip) {
    const [tx, ty] = K.pt(x, y, ang, len), [lx, ly] = K.pt(x, y, ang - 90, w), [rx, ry] = K.pt(x, y, ang + 90, w);
    const [m1x, m1y] = K.pt(x, y, ang - 90, w * .6), [m2x, m2y] = K.pt(x, y, ang + 90, w * .6);
    const [q1x, q1y] = K.pt(m1x, m1y, ang, len * .55), [q2x, q2y] = K.pt(m2x, m2y, ang, len * .55);
    const id = g.p([lx, ly, q1x, q1y, tx, ty, q2x, q2y, rx, ry], col);
    if (inner) { const [ix, iy] = K.pt(x, y, ang, len * .7), [a1, b1] = K.pt(x, y, ang - 90, w * .45), [a2, b2] = K.pt(x, y, ang + 90, w * .45); g.on(id, () => g.p([a1, b1, ix, iy, a2, b2], inner)); }
    if (tip) { const [tx2, ty2] = K.pt(x, y, ang, len * .82); g.on(id, () => g.c(tx2, ty2, w * .8, tip)); }
    return id;
  },
};