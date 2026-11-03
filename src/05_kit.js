// ---- kit ----
// ================= CREATURE PART KIT =================
// Shared parts for hand-composed sprites (64-unit space). Angles are degrees clockwise from straight up.
const K = {
  pt(x, y, ang, d) { const a = ang * Math.PI / 180; return [x + Math.sin(a) * d, y - Math.cos(a) * d]; },
  re(g, cx, cy, rx, ry, ang, col, o) { return g.re(cx, cy, rx, ry, ang, col, o); }, // rotated ellipse
  ear(g, x, y, ang, len, w, col, inner) { // pointed ear
    const [tx, ty] = K.pt(x, y, ang, len), [lx, ly] = K.pt(x, y, ang - 90, w), [rx, ry] = K.pt(x, y, ang + 90, w);
    g.p([lx, ly, tx, ty, rx, ry], col);
    if (inner) { const [ix, iy] = K.pt(x, y, ang, len * .62), [a1, b1] = K.pt(x, y, ang - 90, w * .45), [a2, b2] = K.pt(x, y, ang + 90, w * .45); g.p([a1, b1, ix, iy, a2, b2], inner, { ring: false }); }
  },
  earR(g, x, y, r, col, inner) { g.c(x, y, r, col); if (inner) g.c(x, y + r * .15, r * .55, inner, { ring: false }); },
  earL(g, x, y, ang, len, w, col, inner) { const [cx, cy] = K.pt(x, y, ang, len / 2); K.re(g, cx, cy, w, len / 2, ang, col); if (inner) K.re(g, cx, cy + 1, w * .45, len / 2 - 2.5, ang, inner, { ring: false }); },
  leg(g, x, y, len, w, col, foot) { g.l(x, y, x, y + len, w, col); if (foot) g.e(x, y + len, w + 1.2, w * .6, foot); },
  tail(g, pts, r0, r1, col) { const n = pts.length / 2 - 1; for (let i = 0; i < n; i++) { const r = r0 + (r1 - r0) * i / Math.max(1, n - 1); g.l(pts[i * 2], pts[i * 2 + 1], pts[i * 2 + 2], pts[i * 2 + 3], r, col); } },
  bushy(g, x, y, ang, len, w, col, tip) { const [cx, cy] = K.pt(x, y, ang, len / 2); K.re(g, cx, cy, w, len / 2, ang, col); if (tip) { const [tx, ty] = K.pt(x, y, ang, len * .82); K.re(g, tx, ty, w * .72, len * .2, ang, tip, { ring: false }); } },
  wing(g, x, y, ang, len, w, col, col2, n = 4) { // feathered wing fanning from a shoulder
    const pts = [x, y]; for (let i = 0; i <= n; i++) { const a = ang - 35 + 70 * i / n, d = len * (1 - Math.abs(i - n * .3) / n * .45); const [px, py] = K.pt(x, y, a, d); const [qx, qy] = K.pt(x, y, a + 35 / n, d * .78); pts.push(px, py, qx, qy); }
    g.p(pts, col);
    if (col2) for (let i = 1; i < n; i++) { const a = ang - 35 + 70 * i / n; const [px, py] = K.pt(x, y, a, len * .35), [qx, qy] = K.pt(x, y, a, len * .72); g.l(px, py, qx, qy, .5, col2, { ring: false, shade: false }); }
    void w;
  },
  batwing(g, x, y, dir, span, h, col, mem) {
    const s = dir; const pts = [x, y, x + s * span * .45, y - h, x + s * span, y - h * .7, x + s * span * .88, y + h * .1, x + s * span * .66, y - h * .05, x + s * span * .5, y + h * .3, x + s * span * .3, y + h * .05, x + s * span * .15, y + h * .35];
    g.p(pts, col); if (mem) { g.l(x, y, x + s * span * .45, y - h, .7, mem, { ring: false }); g.l(x + s * span * .45, y - h, x + s * span * .66, y - h * .05, .5, mem, { ring: false, shade: false }); g.l(x + s * span * .45, y - h, x + s * span * .3, y + h * .05, .5, mem, { ring: false, shade: false }); }
  },
  bugwing(g, cx, cy, rx, ry, ang, col, vein) { K.re(g, cx, cy, rx, ry, ang, col, { oc: vein || '#7a98c0' }); if (vein) { const [a, b] = K.pt(cx, cy, ang, -ry * .8), [c2, d] = K.pt(cx, cy, ang, ry * .8); g.l(a, b, c2, d, .4, vein, { ring: false, shade: false }); } },
  spikes(g, cx, cy, r, a0, a1, n, len, col, w = 3) { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (n === 1 ? .5 : i / (n - 1)); const [bx, by] = K.pt(cx, cy, a, r); K.ear(g, bx, by, a, len, w, col); } },
  flame(g, x, y, s, c1, c2, ang = 0) {
    const seq = [[0, 1.45], [28, .8], [42, 1.05], [80, .62], [130, .56], [180, .55], [230, .56], [280, .62], [318, 1.0], [334, .78]], pts = [];
    for (const [a, d] of seq) pts.push(...K.pt(x, y, ang + a, s * d));
    g.p(pts, c1); if (c2) { const [ix, iy] = K.pt(x, y, ang, s * .2); K.re(g, ix, iy, s * .3, s * .55, ang, c2, { ring: false }); }
  },
  leaf(g, x, y, ang, len, w, col, vein) {
    const [mx, my] = K.pt(x, y, ang, len * .5), [tx, ty] = K.pt(x, y, ang, len), [lx, ly] = K.pt(mx, my, ang - 90, w), [rx, ry] = K.pt(mx, my, ang + 90, w);
    const [l2x, l2y] = K.pt(x, y, ang - 60, w * .5), [r2x, r2y] = K.pt(x, y, ang + 60, w * .5);
    g.p([x, y, l2x, l2y, lx, ly, tx, ty, rx, ry, r2x, r2y], col);
    if (vein) g.l(x, y, ...K.pt(x, y, ang, len * .85), .45, vein, { ring: false, shade: false });
  },
  horn(g, x, y, ang, len, w, col, curl = 0) { const [mx, my] = K.pt(x, y, ang + curl * .5, len * .55), [tx, ty] = K.pt(mx, my, ang + curl, len * .5), [lx, ly] = K.pt(x, y, ang - 90, w), [rx, ry] = K.pt(x, y, ang + 90, w); const [m1x, m1y] = K.pt(mx, my, ang - 90, w * .55), [m2x, m2y] = K.pt(mx, my, ang + 90, w * .55); g.p([lx, ly, m1x, m1y, tx, ty, m2x, m2y, rx, ry], col); },
  crystal(g, x, y, w, h, ang, col) { const [tx, ty] = K.pt(x, y, ang, h), [m1x, m1y] = K.pt(x, y, ang - 90, w), [m2x, m2y] = K.pt(x, y, ang + 90, w); const [s1x, s1y] = K.pt(m1x, m1y, ang, h * .7), [s2x, s2y] = K.pt(m2x, m2y, ang, h * .7); g.p([m1x, m1y, s1x, s1y, tx, ty, s2x, s2y, m2x, m2y], col, { lt: lt(col, .55) }); g.l(x, y, tx, ty, .5, lt(col, .6), { ring: false, shade: false }); },
  eyes(g, x1, x2, y, r, stage, o = {}) { const ty = stage >= 2 || o.cool ? (o.glow ? 'glow' : 'cool') : 'cute'; g.eye(x1, y, r, ty, { ...o, side: -1 }); g.eye(x2, y, r, ty, { ...o, side: 1 }); },
  eye1(g, x, y, r, stage, o = {}) { g.eye(x, y, r, stage >= 2 || o.cool ? (o.glow ? 'glow' : 'cool') : 'cute', { side: -1, ...o }); },
  snout(g, x, y, rx, ry, col, nose = '#2a1a1a') { g.e(x, y, rx, ry, col); g.face(() => g.dot(x - rx * .75, y - ry * .35, 1.2, nose)); },
  stripes(g, x0, x1, y, h, n, col) { for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + .5) / n; g.l(x, y - h / 2, x + 1, y + h / 2, .9, col, { ring: false, shade: false }); } },
  spots(g, list, col) { for (const [x, y, r] of list) g.c(x, y, r, col, { ring: false, shade: false }); },
  shine(g, x, y) { g.dot(x, y, .8, '#ffffff'); },
};
// Registers a new species; stats/moves/xp/catch rate are filled in by finaliseSpecies().
function SP(id, n, types, bst, prof, o) { SPECIES[id] = { n, types, bst, prof, ...o }; }