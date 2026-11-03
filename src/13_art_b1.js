// ---- art/b1 ----
// ===== Batch b1: meadow, garden, woodland and fell Beasties =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // wraps g so a whole design can be scaled about (ox, oy) (usually the feet) without rewriting its coordinates
  const scaleG = (g, k, ox, oy) => {
    const X = x => ox + (x - ox) * k, Y = y => oy + (y - oy) * k, R = r => r * k;
    const pts = a => a.map((v, i) => i % 2 ? Y(v) : X(v));
    const h = Object.create(g);
    h.e = (cx, cy, rx, ry, col, o) => g.e(X(cx), Y(cy), R(rx), R(ry), col, o);
    h.c = (cx, cy, r, col, o) => g.c(X(cx), Y(cy), R(r), col, o);
    h.fur = (cx, cy, rx, ry, col, o) => g.fur(X(cx), Y(cy), R(rx), R(ry), col, o);
    h.re = (cx, cy, rx, ry, ang, col, o) => g.re(X(cx), Y(cy), R(rx), R(ry), ang, col, o);
    h.l = (x1, y1, x2, y2, r, col, o) => g.l(X(x1), Y(y1), X(x2), Y(y2), R(r), col, o);
    h.tube = (a, r0, r1, col, o) => g.tube(pts(a), R(r0), R(r1), col, o);
    h.p = (a, col, o) => g.p(pts(a), col, o && o.bevel !== undefined ? { ...o, bevel: R(o.bevel) } : o);
    h.dot = (x, y, r, col) => g.dot(X(x), Y(y), R(r), col);
    h.eye = (x, y, r, type, o) => g.eye(X(x), Y(y), R(r), type, o);
    h.mo = (type, x, y, w, o = {}) => g.mo(type, X(x), Y(y), R(w), o.h ? { ...o, h: R(o.h) } : o);
    h.nose = (x, y, type, o = {}) => g.nose(X(x), Y(y), type, { ...o, s: (o.s || 1) * k });
    h.blush = (x, y, r) => g.blush(X(x), Y(y), R(r));
    h.cheek = (x, y, r, col) => g.cheek(X(x), Y(y), R(r), col);
    h.whiskers = (x, y, dir, n, len, col) => g.whiskers(X(x), Y(y), dir, n, R(len), col);
    h.feat = { fe: (cx, cy, rx, ry, col) => g.feat.fe(X(cx), Y(cy), R(rx), R(ry), col), fl: (x1, y1, x2, y2, r, col, ne) => g.feat.fl(X(x1), Y(y1), X(x2), Y(y2), R(r), col, ne),
      fp: (a, col) => g.feat.fp(pts(a), col), fpx: (x, y, col) => g.feat.fpx(X(x), Y(y), col), fchain: (a, r, col) => g.feat.fchain(pts(a), R(r), col) };
    return h;
  };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // annulus sector (bands on fanned tails, wing bars); angles clockwise from up
  const arc = (g, cx, cy, r0, r1, a0, a1, col, o) => { const pts = [], n = 10; for (let i = 0; i <= n; i++) pts.push(...K.pt(cx, cy, a0 + (a1 - a0) * i / n, r1)); for (let i = n; i >= 0; i--) pts.push(...K.pt(cx, cy, a0 + (a1 - a0) * i / n, r0)); return g.p(pts, col, o); };
  // rotated ellipse placed from a base point along an angle (ears, leaves, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };

  // bird wing built from a covert arm and scalloped flight feathers (local u along the wing, v toward the trailing edge)
  const wingPts = (L, W, np = 4, ns = 4) => {
    const pts = [0, -.22 * W, .32 * L, -.4 * W, .56 * L, -.34 * W, .8 * L, -.16 * W, L, .02 * W];
    for (let i = 1; i <= np; i++) { const u = L - i * .1 * L, v = .02 * W + i * .19 * W; pts.push(u + .05 * L, v - .15 * W, u, v); }
    for (let i = 0; i < ns; i++) { const u = .52 * L - i * (.5 / ns) * L, v = .9 * W + (i % 2) * .05 * W; pts.push(u + .07 * L, v - .14 * W, u, v); }
    pts.push(0, .55 * W); return pts;
  };
  const birdWing = (g, x, y, ang, L, W, col, o = {}) => {
    const id = g.p(poly(x, y, ang, wingPts(L, W, o.np, o.ns)), col, o.opt || {});
    const f = loc(x, y, ang);
    g.on(id, () => {
      if (o.prim) g.p([...f(.5 * L, -W), ...f(1.2 * L, -W), ...f(1.2 * L, 1.6 * W), ...f(.62 * L, 1.2 * W), ...f(.56 * L, .2 * W)], o.prim);
      if (o.band) g.p([...f(.12 * L, .52 * W), ...f(.56 * L, .4 * W), ...f(.6 * L, 1.2 * W), ...f(.05 * L, 1.2 * W)], o.band);
      if (o.lines) for (let i = 1; i <= (o.np || 4); i++) { const u = L - i * .1 * L, v = .02 * W + i * .19 * W; const [a1, b1] = f(u + .05 * L, v - .15 * W), [a2, b2] = f(u - .2 * L, v - .3 * W); g.l(a1, b1, a2, b2, .4, o.lines); }
    });
    return id;
  };

  // ---------------------------------------------------------------- Burrabit
  BEAST('burrabit', {
    pal: { a: '#c8a47a', b: '#fff6e8', c: '#8a6a4a', e: '#ff9aa8', f: '#e2c49c' }, keep: ['b', 'e'], sh: 200,
    draw(g) {
      const { a, b, c, e, f } = g.P;
      const fa = far(a, .28);
      // cotton tail
      g.fur(47.5, 51.5, 5.4, 5, b, { n: 9, amp: .3, mat: 'fur', dk: '#e0d2c4' });
      // far ear flops back
      const fe = blade(g, 33, 31, 58, 16, 3.4, fa);
      g.on(fe, () => { blade(g, 34, 31, 58, 12, 1.6, mix(e, fa, .35)); const [tx, ty] = K.pt(33, 31, 58, 14.5); g.c(tx, ty, 3, dk(c, .15)); });
      // far hind foot
      g.e(46, 59.4, 4.6, 2, fa);
      // body
      const body = g.e(35, 50, 11.5, 10, a, { mat: 'fur' });
      g.on(body, () => g.e(28, 52, 6.5, 8, b));
      // haunch and long hind foot
      g.e(41.5, 53, 6.6, 6.6, a, { mat: 'fur' });
      const foot = g.e(37, 59.3, 7.4, 2.4, a);
      g.on(foot, () => g.e(37, 60.6, 7.4, 1.3, f));
      // front paws
      g.e(24.5, 58.8, 2.7, 2.3, a); g.e(29.2, 59.3, 2.7, 2.2, a);
      K2.toes(g, 24.2, 60, 2, 1.8, c); K2.toes(g, 29, 60.5, 2, 1.8, c);
      // near ear stands up
      const ne = blade(g, 25, 31, -6, 17, 3.7, a);
      g.on(ne, () => { blade(g, 25.2, 29.5, -6, 13, 1.8, e); const [tx, ty] = K.pt(25, 31, -6, 16); g.c(tx, ty, 3.4, c); });
      // head
      const head = g.e(27.5, 38.5, 11, 9.5, a, { mat: 'fur' });
      const cheeks = g.fur(27.5, 42, 11.8, 6.2, a, { n: 12, amp: .2, a0: 10, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on([head, cheeks], () => { g.e(21, 43, 6.5, 4.4, b); g.p([24, 29, 26.4, 29, 25, 35.5, 24.2, 35.5], b); });
      g.eye(21.4, 37.6, 3.3, 'cute', { iris: '#b06a24', side: -1 });
      g.eye(31.5, 37, 3, 'cute', { iris: '#b06a24', side: 1 });
      g.nose(16.6, 41.4, 'pink', { s: 1 });
      g.mo('cat', 19.5, 44.2, 3.6);
      flat(g, F => { F.fp([18.2, 44.7, 20.8, 44.7, 20.7, 47.3, 18.3, 47.3], '#5a3a44'); F.fp([18.8, 45, 20.2, 45, 20.1, 46.6, 18.9, 46.6], '#ffffff'); });
      g.whiskers(15.5, 42.4, -1, 2, 4.5);
      g.blush(17.8, 42.8, 1.5); g.blush(33.6, 41.8, 1.5);
    }
  });

  // ---------------------------------------------------------------- Harehaste
  BEAST('harehaste', {
    pal: { a: '#b8845a', b: '#fff0dc', c: '#6a4a30', e: '#1e1a26', f: '#ecc89a' }, keep: ['b'], sh: 200,
    draw(g) {
      const { a, b, c, e, f } = g.P;
      const fa = far(a, .3);
      // far ear
      const fe = blade(g, 27, 19, 42, 17, 3, fa);
      g.on(fe, () => { blade(g, 27.5, 19, 42, 12, 1.3, mix('#e8a0a0', fa, .4)); const [tx, ty] = K.pt(27, 19, 42, 15.5); g.c(tx, ty, 3.2, e); });
      // far hind foot and far arm (throwing a jab)
      g.e(47.5, 59, 7, 2.1, fa);
      g.tube([31, 33, 22, 33.5, 13, 33], 2.6, 2.3, fa);
      g.e(9.8, 33, 3.4, 3, far(c, .2));
      // tail: white puff, dark on top
      const tail = g.e(51.5, 44.5, 3.8, 3.4, b);
      g.on(tail, () => g.e(52.5, 42.5, 3.4, 2, e));
      // torso leaning into the punch
      const body = g.re(36, 41, 9, 13.5, -30, a, { mat: 'fur' });
      g.on(body, () => g.re(31.5, 43.5, 4.6, 11, -30, b));
      // big haunch and long hind foot
      const hip = g.e(43.5, 49.5, 8.4, 8.2, a, { mat: 'fur' });
      g.on(hip, () => { g.l(40, 45, 47, 53, .5, dk(a, .2)); for (const [x, y] of [[45, 44.5], [48.5, 47], [46, 51]]) g.l(x, y, x + 1.6, y + 1.2, .4, lt(a, .3)); });
      g.on(body, () => { for (const [x, y] of [[38, 32.5], [41, 36], [43, 40.5]]) g.l(x, y, x + 1.6, y + 1.3, .4, dk(a, .18)); });
      const foot = g.e(38.5, 59, 9, 2.5, a);
      g.on(foot, () => g.e(38.5, 60.4, 9, 1.3, c));
      // near arm in guard, dark "gloves"
      g.tube([30.5, 35, 26, 41.5, 21, 39.5], 2.8, 2.4, a);
      const glove = g.e(18.8, 38.3, 3.5, 3.1, c);
      g.on(glove, () => g.l(16.8, 37, 19.8, 36.2, .45, lt(c, .3)));
      // ears and head
      const ne = blade(g, 23, 19, 24, 18, 3.3, a);
      g.on(ne, () => { blade(g, 23.3, 18, 24, 13, 1.5, '#e8a0a0'); const [tx, ty] = K.pt(23, 19, 24, 16.5); g.c(tx, ty, 3.6, e); });
      const head = g.e(22.5, 24.5, 8, 7, a, { mat: 'fur' });
      const snout = g.p([19, 21, 13.5, 23, 11.2, 26, 12.5, 29, 18.5, 30, 23, 28.5], a);
      const cheek = g.fur(25.5, 28.2, 5.5, 3.4, a, { n: 6, amp: .35, a0: 20, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on([head, snout, cheek], () => { g.e(15, 28.4, 4.5, 2.4, b); g.e(21, 23.6, 4.2, 3.6, f); });
      g.eye(20.8, 23.6, 2.8, 'sharp', { iris: '#f0b020', side: -1, look: -.6 });
      g.eye(27.2, 22.8, 2.2, 'sharp', { iris: '#f0b020', side: 1, look: -.6 });
      g.nose(12.2, 25.6, 'tri', { s: .9 });
      g.mo('smirk', 15.2, 29.2, 4);
      g.whiskers(13, 26.8, -1, 2, 4.5);
    }
  });

  // ---------------------------------------------------------------- Pipwren
  BEAST('pipwren', {
    pal: { a: '#8a6040', b: '#ff8a4a', c: '#5a3e2a', d: '#f8e8c8', e: '#f0c040', f: '#d08a58' }, keep: ['d', 'e', 'f'], sh: 180,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // short cocked tail, barred
      const tail = g.p([40, 45, 43, 39, 44.5, 31.5, 47, 30, 50, 31, 49.5, 34, 46.5, 46], a);
      K2.stripes(g, tail, 41, 29, 51, 47, -22, 2.8, 1.1, c);
      // legs
      g.l(35.5, 53, 36.5, 59.6, .85, f); g.l(35.3, 59.7, 38.8, 59.9, .7, f);
      g.l(29, 53.5, 28.5, 59.6, .85, f); g.l(28.2, 59.7, 25, 60, .7, f);
      // body
      const body = g.e(33, 45, 11.5, 10.5, a, { mat: 'fur' });
      g.on(body, () => { g.e(25.5, 47, 7.5, 8.5, b); g.e(29, 54, 8, 3.5, d); });
      // folded wing with bars
      const wing = g.p([30, 41, 35, 38.5, 42, 39, 47, 44, 49.5, 51, 43, 51, 35, 49, 30.5, 45.5], c);
      K2.stripes(g, wing, 30, 37, 50, 52, 62, 2.8, .8, dk(c, .35));
      g.on(wing, () => { for (const [x, y] of [[33.5, 41.6], [37, 41], [40.5, 41.4]]) g.e(x, y, 1.3, .8, lt(c, .45)); });
      // head with a little crest
      g.tube([27.5, 26, 27, 22.5, 29.5, 20.8, 31.2, 22.4], 1.6, .8, a, { mat: 'fur' });
      const head = g.e(27.5, 32.5, 9.4, 8.5, a, { mat: 'fur' });
      if (!g.back) g.on(head, () => { g.re(29.5, 28.8, 8, 1.35, 8, d); g.e(22.5, 37.5, 5, 3, b); });
      // beak with a worm
      g.p([20, 31, 13.4, 33.2, 20, 34.8], e);
      g.tube([15.5, 33.6, 14.2, 36.8, 16.2, 39.6, 14.8, 43], .95, .75, '#f08a9a');
      g.eye(23.8, 31.2, 2.4, 'bead');
      g.eye(31, 30.8, 1.8, 'bead');
      flat(g, F => F.fl(20, 33, 16, 33.3, .4, dk(e, .5)));
    }
  });

  // ---------------------------------------------------------------- Galewing
  BEAST('galewing', {
    pal: { a: '#b87848', b: '#f6e6c8', c: '#6a84b8', d: '#3a2a1a', e: '#f0c848' }, keep: ['b', 'e'], sh: 180,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .3);
      // far wing raised high behind
      birdWing(g, 31, 29, -8, 27, 9, fa, { prim: far(d, .1), lines: dk(fa, .3) });
      // fanned tail with a dark band and pale tip
      const tp = [35, 43]; for (let k = 0; k <= 7; k++) { const [x, y] = K.pt(38.5, 44, 122 + k * 13, 18 + (k % 2 ? -1.3 : 0)); tp.push(x, y); } tp.push(42.5, 42);
      const tail = g.p(tp, c);
      g.on(tail, () => { arc(g, 38.5, 44, 13.2, 15.8, 110, 230, d); arc(g, 38.5, 44, 15.8, 20, 110, 230, b); for (let k = 0; k < 7; k++) { const [x, y] = K.pt(38.5, 44, 128.5 + k * 13, 13); g.l(38.5, 44, x, y, .35, dk(c, .22)); } });
      // body
      const body = g.re(31.5, 36.5, 8.4, 12.5, -30, a, { mat: 'fur' });
      g.on(body, () => { g.re(27.5, 39.5, 5.6, 10.5, -30, b); for (const [x, y] of [[27.5, 37.5], [30.5, 41.5], [26, 43], [29, 46.5], [33, 45.5], [25, 39.5]]) g.e(x, y, .8, 1.1, d); for (const [x, y] of [[36.5, 32], [39, 36.5], [35.5, 37.5]]) g.re(x, y, 1.2, .8, 30, d); });
      // feet tucked up
      g.e(31.5, 48.6, 2.4, 1.6, e); K2.claws(g, 30.5, 49.6, 3, 2.6, 1.2, -1, d);
      // near wing raised high
      const nw = birdWing(g, 35, 30, 50, 30, 10.5, a, { prim: d, lines: dk(a, .35) });
      g.on(nw, () => { const f = loc(35, 30, 50); for (const [u, v] of [[8, 1.5], [12, 4], [7, 5.5], [13, 8], [16, 1]]) { const [x, y] = f(u, v); g.re(x, y, 1.1, .7, 50, d); } });
      // head: blue-grey cap, pale cheek with a dark "tear" stripe
      const head = g.e(23, 23.5, 7.6, 7, c, { mat: 'fur' });
      if (!g.back) g.on(head, () => { g.e(20.5, 28, 6, 3.4, b); g.re(20.6, 27.4, .95, 2.9, 12, d); });
      g.p([17.5, 21.5, 14.3, 21.8, 11.7, 23.8, 12.1, 26.6, 13.7, 25, 17.1, 26], '#40404e');
      g.e(16.8, 23.2, 1.6, 1.6, e, { ring: false });
      g.eye(19.4, 22.6, 2.7, 'sharp', { iris: '#d8601c', side: -1, brow: 1, look: -.5 });
      g.eye(27.4, 21.9, 2, 'sharp', { iris: '#d8601c', side: 1, brow: 1, look: -.5 });
    }
  });

  // mark drawn on existing parts; returns the new mark's id so further marks can stack on it
  const mk = (g, ids, fn) => { let r; g.on(ids, () => { r = fn(); }); return r; };
  // tall faceted insect eye with an optional slanted lid (side -1 = near eye, 1 = far eye)
  const bugEye = (g, x, y, rx, ry, col, side, lid) => {
    if (g.back) return;
    if (g.tiny) { g.feat.fe(x, y, rx * .55, ry * .6, col); return; }
    const F = g.feat, I = '#1b1328';
    F.fe(x, y, rx + .5, ry + .5, I); F.fe(x, y, rx, ry, col);
    for (let yy = -ry; yy <= ry; yy += 1.25) for (let xx = -rx; xx <= rx; xx += 1.25) { const ox = xx + ((Math.round(yy / 1.25) & 1) ? .62 : 0); if ((ox / (rx * .9)) ** 2 + (yy / (ry * .92)) ** 2 < 1 && yy > -ry * .2) F.fpx(x + ox, y + yy, dk(col, .28)); }
    F.fe(x - rx * .3, y - ry * .42, rx * .38, ry * .2, lt(col, .65));
    if (lid) { // lid hugging the top of the eye, lowest at the inner corner (angry)
      const Rx = rx + .65, Ry = ry + .65, hi = y - ry * .98, lo = y - ry * .3, yL = side < 0 ? hi : lo, yR = side < 0 ? lo : hi;
      const lineY = u => yL + (yR - yL) * (u - (x - Rx)) / (2 * Rx), arcPts = [];
      for (let i = 0; i <= 28; i++) { const t = Math.PI + Math.PI * i / 28, px = x + Rx * Math.cos(t), py = y + Ry * Math.sin(t); if (py <= lineY(px) + .05) arcPts.push(px, py); }
      if (arcPts.length >= 4) { const x0 = arcPts[0], x1 = arcPts[arcPts.length - 2]; F.fp([x0, lineY(x0), ...arcPts, x1, lineY(x1)], lid); F.fl(x0, lineY(x0), x1, lineY(x1), .5, I); }
    }
  };
  const spot = (g, ids, x, y, r, c1, c2, c3) => { const s1 = mk(g, ids, () => g.c(x, y, r, c1)); if (c2) { const s2 = mk(g, s1, () => g.c(x - r * .08, y - r * .08, r * .62, c2)); if (c3) g.on(s2, () => g.c(x - r * .18, y - r * .18, r * .28, c3)); } return s1; };

  // ---------------------------------------------------------------- Buzzlet
  BEAST('buzzlet', {
    pal: { a: '#ffd040', b: '#3a3040', c: '#eef8ff', d: '#ff9a40', f: '#f6d2a8' }, keep: ['c', 'f'], sh: 100,
    draw(g) {
      const { a, b, c, d, f } = g.P;
      // little wings
      g.re(44.5, 33, 3.4, 6.2, 58, mix(c, '#a8c0e0', .3), { oc: '#6a86b0', mat: 'gloss' });
      g.re(40, 29.5, 4.4, 7.8, 28, c, { oc: '#6a86b0', mat: 'gloss' });
      // far legs
      g.tube([34, 52, 35.5, 56, 34.5, 58.5], .9, .8, far(b, .1));
      // fuzzy striped abdomen with an orange tail
      const abd = g.fur(40, 47, 10.5, 9, a, { n: 18, amp: .08, mat: 'fur' });
      g.on(abd, () => { g.re(39, 47, 2.6, 10, 12, b); g.re(45.5, 48, 1.9, 8, 18, b); g.e(49.5, 49, 3.2, 6, d); });
      g.p([50, 51, 54.5, 53.5, 50, 54], b);
      // legs dangling, pollen on the hind leg
      g.tube([40, 54, 42, 57.5, 40.5, 60], 1, .8, b); g.e(42.2, 56.8, 2, 1.7, d);
      g.tube([27, 48, 26, 52, 27.5, 55], .95, .8, b);
      // head
      const head = g.fur(26, 40, 10.5, 9.8, a, { n: 20, amp: .06, mat: 'fur' });
      g.fur(33, 45.5, 5, 6.5, lt(a, .25), { n: 8, amp: .2, mat: 'fur', line: false });
      // elbowed antennae with round tips
      g.tube([25, 31, 24, 25.5, 20, 23.5], .75, .7, b); g.c(19, 23.2, 1.7, b);
      g.tube([30.5, 32, 32, 26.5, 35.5, 24.5], .75, .7, b); g.c(36.5, 24.3, 1.6, b);
      // sticking plaster from bumping into a window
      if (!g.back) g.group(() => { const p1 = g.re(21.8, 33.6, 4.4, 1.6, -35, f, { mat: 'soft' }), p2 = g.re(21.8, 33.6, 4.4, 1.6, 35, f, { mat: 'soft' }); g.on([p1, p2], () => g.c(21.8, 33.6, 1.3, '#fff0e0')); });
      g.eye(21, 39.2, 2.6, 'happy'); g.eye(29.5, 38.7, 2.3, 'happy');
      g.mo('open', 23.5, 43.2, 4, { h: 3 });
      g.blush(17.8, 42.3, 1.6); g.blush(31.5, 41.6, 1.5);
      void head;
    }
  });

  // ---------------------------------------------------------------- Bumbellow
  BEAST('bumbellow', {
    pal: { a: '#f0b830', b: '#2e2638', c: '#e4f2ff', d: '#ff8030', f: '#fff4d0' }, keep: ['c', 'f'], sh: 100,
    draw(g) {
      const { a, b, c, d, f } = g.P;
      const wing = (x, y, ang, len, w, col) => { const id = blade(g, x, y, ang, len, w, col, { oc: '#5a78a8', mat: 'gloss' }); g.on(id, () => { const [x2, y2] = K.pt(x, y, ang, len * .85); g.l(x, y, x2, y2, .45, '#9ab4d8'); const [x3, y3] = K.pt(x, y, ang + 12, len * .6); g.l(x, y, x3, y3, .35, '#9ab4d8'); }); return id; };
      // four wings
      wing(34, 26, -24, 26, 6, mix(c, '#98b0d8', .35)); wing(36, 28, 6, 20, 5, mix(c, '#98b0d8', .35));
      wing(38, 27, 44, 27, 6.5, c); wing(40, 30, 76, 20, 5, c);
      // far legs
      g.tube([36, 46, 33, 53, 35, 58.5], 1.5, 1.2, far(b, .1)); g.e(35.5, 59, 2.2, 1.3, far(b, .1));
      // big fuzzy abdomen hanging behind
      const abd = g.fur(46, 45, 12, 13, a, { n: 24, amp: .06, mat: 'fur' });
      g.on(abd, () => { g.re(43, 44, 3, 14, 20, b); g.re(51, 47, 2.6, 12, 26, b); g.e(55, 53, 5, 7.5, d); });
      g.p([54, 56.5, 60, 61, 53, 59.5], b);
      // hind leg with a pollen basket
      g.tube([44, 53, 47.5, 57, 45.5, 61], 1.5, 1.2, b); g.e(47.8, 56.8, 2.8, 2.4, d, { mat: 'fur' });
      // far foreleg
      g.tube([27, 41, 22, 45.5, 17, 44], 2, 1.5, far(a, .35), { mat: 'fur' }); g.tube([17, 44, 12.5, 40.5], 1.4, 1.1, far(b, .1)); K2.claws(g, 11.8, 40.2, 2, 2, 1.4, -1, far(b, .1));
      // thorax with a dark band
      const th = g.fur(31, 37, 10.5, 9.5, a, { n: 20, amp: .06, mat: 'fur' });
      g.on(th, () => g.re(35.5, 38, 3.2, 11, 15, b));
      // near foreleg: fuzzy upper leg, dark lower leg, hooked claws
      g.tube([33, 43, 30, 49.5, 25, 51], 2.4, 1.9, a, { mat: 'fur' }); g.tube([25, 51, 19.5, 48.5], 1.6, 1.3, b); K2.claws(g, 18.6, 49.2, 2, 2.2, 1.6, -1, b);
      // cream collar
      K2.ruff(g, 26.5, 31, 9.5, 5.2, mix(a, f, .5), 12, .26, -30, 210, { dk: mix(a, '#b07820', .35) });
      // head with a fuzzy crown
      g.tube([19, 19, 15.5, 11.5, 11, 8.5], 1.2, 1, b); g.c(10, 8.2, 2, b);
      g.tube([24.5, 18.5, 26, 11, 30.5, 7], 1.2, 1, b); g.c(31.5, 6.6, 2, b);
      const head = g.fur(21.5, 23.5, 8.4, 7.6, a, { n: 16, amp: .08, mat: 'fur' });
      g.fur(22.5, 17.2, 5.5, 2.6, a, { n: 7, amp: .38, a0: -175, a1: -5, mat: 'fur', line: false });
      if (!g.back) g.on(head, () => g.e(19.5, 28.5, 6, 3, lt(a, .3)));
      bugEye(g, 17, 22.4, 2.8, 3.8, '#4a2c58', -1, a);
      bugEye(g, 25.9, 22, 2.2, 3.3, '#4a2c58', 1, a);
      // mandibles either side of a bellowing mouth
      if (!g.back) { g.p([14, 27.5, 12.2, 30.5, 14.2, 31.2, 15.8, 29], d); g.p([23.5, 28, 25.2, 30.8, 23.2, 31.5, 22, 29.2], far(d, .2)); }
      g.mo('open', 18.8, 28.6, 3.8, { h: 2.8 });
    }
  });

  // ---------------------------------------------------------------- Wickmoth
  BEAST('wickmoth', {
    pal: { a: '#ecdcb8', b: '#b89a78', c: '#ff8a30', d: '#ffd860', e: '#6a5040', f: '#f4b890' }, keep: [], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .22);
      // far wings (viewer's right), partly hidden
      const w1 = g.p([36, 39, 40, 32, 46, 26, 52, 24.5, 55.5, 27.5, 55, 34, 51, 39, 43, 41.5], fa);
      g.on(w1, () => g.p([49, 23, 58, 23, 58, 36, 54.5, 37, 53, 30], far(e, .1)));
      spot(g, w1, 48.5, 31.5, 2.8, far(c, .15), far(d, .15));
      g.on(w1, () => g.tube([39, 38, 44, 35, 47, 37, 51, 36.5], .4, .4, dk(fa, .2)));
      g.p([36, 44.5, 43, 44, 48.5, 47.5, 48.5, 53, 44.5, 55.5, 39.5, 53, 36, 48.5], far(f, .2));
      // near wings (viewer's left): cream forewing with a wavy band and a bright eye-spot
      const w3 = g.p([29, 39, 23, 31, 15, 24.5, 8.5, 23, 4.5, 26.5, 4.5, 34, 9.5, 39.5, 19, 42], a);
      g.on(w3, () => { g.p([10, 21, 2, 21, 2, 36, 6.5, 37.5, 6.2, 29.5], e); for (const [x, y] of [[8.4, 25], [7.4, 29], [8, 33.4]]) g.dot(x, y, .6, lt(a, .3)); });
      g.on(w3, () => g.tube([26, 38.5, 22, 37, 19.5, 39, 15.5, 37.5, 12.5, 39.2, 9.5, 37.5], .45, .45, dk(a, .22)));
      spot(g, w3, 14.5, 31, 3.4, c, d, '#fff6d0');
      const w4 = g.p([29.5, 44.5, 21, 44, 13.5, 47.5, 12, 53, 15.5, 57, 22, 56, 28.5, 50], f);
      g.on(w4, () => g.tube([27, 46.5, 21, 47.5, 16.5, 51, 15.5, 54], .4, .4, dk(f, .18)));
      spot(g, w4, 19.5, 51.5, 2.1, c);
      // plump body
      const abd = g.e(33, 52, 5.5, 7, b, { mat: 'fur' });
      g.on(abd, () => { g.l(28, 51, 38, 51, .5, dk(b, .25)); g.l(28.5, 55, 37.5, 55, .5, dk(b, .25)); });
      // fluffy collar
      K2.ruff(g, 32, 43, 8.5, 5, a, 11, .26, -20, 200, { dk: '#d8c8a4' });
      // feathery antennae tipped with wick flames
      const ant = (pts, tx, ty, ang) => { g.tube(pts, .7, .6, e); for (let i = 2; i < pts.length - 2; i += 2) { K.leaf(g, pts[i], pts[i + 1], ang - 60, 3.2, .9, dk(b, .1)); K.leaf(g, pts[i], pts[i + 1], ang + 60, 3.2, .9, dk(b, .1)); } K2.flame(g, tx, ty, 6, 2.5, ang, c, d, '#fff8e0'); };
      ant([27, 31, 24, 26, 22, 21.5, 20.5, 18], 20.2, 18.6, -20);
      ant([35, 31, 37.5, 26, 39.5, 21.5, 41, 18], 41.3, 18.6, 20);
      // head
      const head = g.e(31, 35, 7.8, 7, b, { mat: 'fur' });
      g.fur(31, 38, 8.2, 4.2, b, { n: 9, amp: .22, a0: 10, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on(head, () => g.e(29.5, 38.6, 4.8, 2.6, lt(b, .35)));
      g.eye(27.4, 34.2, 2.8, 'star', { iris: '#ff7a1a', side: -1, look: -.2 });
      g.eye(35, 33.8, 2.5, 'star', { iris: '#ff7a1a', side: 1, look: -.2 });
      g.mo('o', 30.5, 39.3, 2.4);
      g.blush(24.8, 37.8, 1.3); g.blush(37.2, 37.2, 1.2);
    }
  });

  // ---------------------------------------------------------------- Lanternmoth
  BEAST('lanternmoth', {
    pal: { a: '#d8a050', b: '#6a4a38', c: '#ff6a20', d: '#ffe070', e: '#3a2a20', f: '#f0d8a8' }, keep: [], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .25);
      // far wings
      const w1 = g.p([35, 30, 44, 12, 54, 5, 61, 8, 60, 18, 55, 27, 45, 34], fa);
      g.on(w1, () => { g.p([50, 4, 62, 4, 62, 20, 58, 19, 53, 9], far(e, .05)); });
      g.on(w1, () => g.tube([38, 29, 44, 23, 48, 25, 53, 21, 57, 22], .45, .45, dk(fa, .25)));
      spot(g, w1, 52, 15.5, 3.2, far(c, .1), far(d, .1));
      const w2 = g.p([36, 38, 48, 39, 55, 45, 54, 52, 49, 56, 43, 51, 37, 44], far(b, .2));
      spot(g, w2, 48.5, 46.5, 2.3, far(c, .15));
      // near wings: big forewing with a wavy band, tailed hindwing
      const w3 = g.p([28, 30, 19, 11, 9, 3, 3, 6, 2.5, 15, 5, 25, 11, 32, 22, 36], a);
      g.on(w3, () => { g.p([10, 2, 2, 2, 1, 20, 4.5, 21, 5, 11], e); for (const [x, y] of [[6.5, 8.5], [4.3, 12.5], [3.8, 16.8]]) g.dot(x, y, .6, f); });
      g.on(w3, () => { g.tube([25, 33, 20, 28, 17, 30, 13, 26, 10, 28.5, 7, 25], .5, .5, dk(a, .28)); g.tube([24.5, 30, 20.5, 22, 18.5, 17, 15.5, 12], .4, .4, dk(a, .18)); });
      spot(g, w3, 13.5, 17.5, 4.2, c, d, '#fffbe0');
      const w4 = g.p([27, 38, 14, 39, 7, 45, 6.5, 52, 10, 55.5, 7, 61, 13, 58.5, 20, 51, 27, 44], mix(a, b, .35));
      g.on(w4, () => g.p([4, 50, 12, 52, 11, 62, 3, 62], e));
      g.on(w4, () => g.tube([25, 40.5, 18, 42, 13, 46, 11, 51], .45, .45, dk(mix(a, b, .35), .25)));
      spot(g, w4, 15, 46, 2.8, c, d);
      // warm halo of light around the lantern
      g.e(32, 50, 9.5, 10.5, lt(d, .45), { mat: 'glow', oc: lt(d, .1), line: false });
      // the lantern: a glowing abdomen with a dark cap, cage bars and a ring
      const lamp = g.p([27, 43, 37, 43, 39, 47, 39, 53, 36.5, 57, 27.5, 57, 25, 53, 25, 47], d, { mat: 'glow', lt: '#fffbe8' });
      g.on(lamp, () => { const core = g.e(31.4, 49.5, 3.8, 5.5, '#fffbe8'); void core; });
      K2.flame(g, 32, 54.2, 8, 2.8, 0, c, d, '#fffbe8', { line: false });
      g.on(lamp, () => { for (const x of [28.2, 35.8]) g.l(x, 42, x, 58, .55, dk(e, .1)); });
      g.p([26, 40.5, 38, 40.5, 36.5, 43.8, 27.5, 43.8], e, { mat: 'metal' });
      g.p([27.5, 56.2, 36.5, 56.2, 35, 59, 29, 59], e, { mat: 'metal' });
      g.tube([30, 59, 30, 61.2, 34, 61.2, 34, 59], .55, .55, e, { mat: 'metal' });
      // furry thorax and ruff
      g.e(32, 38, 7, 6, b, { mat: 'fur' });
      K2.ruff(g, 32, 34, 9, 5, f, 11, .25, -20, 200, { dk: '#c8a878' });
      // feathery antennae with flame tips
      const ant = (pts, tx, ty, ang) => { g.tube(pts, .8, .6, e); for (let i = 2; i < pts.length - 2; i += 2) { K.leaf(g, pts[i], pts[i + 1], ang - 65, 3.6, 1, b); K.leaf(g, pts[i], pts[i + 1], ang + 65, 3.6, 1, b); } K2.flame(g, tx, ty, 6.5, 2.6, ang, c, d, '#fff8e0'); };
      ant([28, 22, 25, 16, 23, 11, 21.5, 7.5], 21.2, 8.2, -18);
      ant([35, 22, 38, 16, 40, 11, 41.5, 7.5], 41.8, 8.2, 18);
      // head with a pale fluffy crest
      const head = g.e(31.5, 26, 7, 6.2, b, { mat: 'fur' });
      g.fur(31.5, 21.8, 4.6, 2.2, f, { n: 6, amp: .35, a0: -175, a1: -5, mat: 'fur', line: false });
      void head;
      g.eye(28.2, 25.6, 2.6, 'glow', { iris: '#ffe890' });
      g.eye(35.2, 25.2, 2.3, 'glow', { iris: '#ffe890' });
      g.mo('smile', 31, 29.8, 2.6);
    }
  });

  // broad owl wing: a fan of rounded primaries under a covert shoulder, fringe tinted by o.tip
  const owlWing = (g, x, y, ang, len, col, o = {}) => {
    const n = o.n || 5, spread = o.spread || 70, ids = [];
    g.group(() => {
      for (let i = n - 1; i >= 0; i--) { const a = ang - spread / 2 + spread * i / (n - 1), L = len * (1 - Math.abs(i - (n - 1) * .35) / n * .5); ids.push(blade(g, x, y, a, L, len * .16, col, { mat: 'fur' })); }
      ids.push(blade(g, x, y, ang - 8, len * .62, len * .3, col, { mat: 'fur' }));
    });
    if (o.tip) g.on(ids, () => { for (let i = 0; i < n; i++) { const a = ang - spread / 2 + spread * i / (n - 1), L = len * (1 - Math.abs(i - (n - 1) * .35) / n * .5); const [tx, ty] = K.pt(x, y, a, L * .88); g.c(tx, ty, len * .17, o.tip); } });
    if (o.line) g.on(ids, () => { for (let i = 1; i < n; i++) { const a = ang - spread / 2 + spread * (i - .5) / (n - 1), L = len * .85; const [x1, y1] = K.pt(x, y, a, len * .45), [x2, y2] = K.pt(x, y, a, L); g.l(x1, y1, x2, y2, .35, o.line); } });
    return ids;
  };

  // ---------------------------------------------------------------- Hollowl
  BEAST('hollowl', {
    pal: { a: '#f0e8e0', b: '#caa880', c: '#8a70c0', d: '#fff8f2', e: '#ffd860', f: '#b8a8e0' }, keep: ['e'], sh: 250,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // drifting mist where its feet should be
      g.tube([30.5, 47, 29.5, 53, 33.5, 57.5, 40.5, 59, 47, 57, 49, 53.5, 46.5, 51.2], 5.4, .8, c, { mat: 'glow' });
      g.tube([26.5, 50, 22, 54.5, 16.5, 56, 13.2, 53.4], 2.8, .7, c, { mat: 'glow' });
      g.tube([31, 48.5, 31.5, 53.5, 35.5, 56.2, 40.5, 56.2], 2.5, .7, f, { mat: 'glow', ring: false });
      // far wing, its tips fading into mist
      const fw = owlWing(g, 38, 31, 118, 24, far(b, .3), { tip: far(mix(b, c, .6), .15), line: dk(far(b, .3), .25) });
      g.on(fw, () => { for (const [x, y] of [[44, 33.5], [47.5, 36.5], [43, 38.5]]) g.dot(x, y, .8, far(a, .3)); });
      // body: buff back, pale speckled front
      const body = g.e(32.5, 39.5, 10.5, 11.5, b, { mat: 'fur' });
      g.on(body, () => g.e(29.5, 43, 8, 9.5, a));
      g.on(body, () => { for (const [x, y] of [[27, 40.5], [31, 43], [28, 46.5], [33, 47.5], [25, 45]]) g.dot(x, y, .7, dk(b, .15)); });
      // near wing, draped like a shroud
      const nw = owlWing(g, 26, 31, -118, 25.5, b, { tip: mix(b, c, .55), line: dk(b, .25) });
      g.on(nw, () => { for (const [x, y] of [[19.5, 33], [15.5, 35.5], [20, 37], [16, 39.5]]) g.dot(x, y, .8, a); });
      // big round head with a heart-shaped face
      const head = g.e(31, 21, 12.5, 10.5, b, { mat: 'fur' });
      g.on(head, () => { for (const [x, y] of [[37, 13], [41, 16.5], [34, 11.8], [42.5, 21.5]]) g.dot(x, y, .7, a); });
      if (!g.back) {
        const disc = g.p([30.5, 16.5, 27.5, 13, 23, 12.8, 20, 15.8, 19.8, 21.5, 22, 26.5, 26.5, 30, 30.5, 32, 34.5, 29.8, 37.8, 26, 39.2, 21, 38.4, 16, 35.5, 13.2, 32.8, 13.8], d, { lt: '#ffffff', depth: .45 });
        g.on(disc, () => { g.l(30.5, 17, 30.5, 25, .55, lt(b, .4)); g.e(24.8, 22.2, 4.3, 4.9, mix(d, f, .2)); g.e(35, 21.6, 3.7, 4.5, mix(d, f, .2)); });
      }
      g.eye(25, 21.4, 3.2, 'hollow', { iris: e, look: -.4 });
      g.eye(35, 21, 2.8, 'hollow', { iris: e, look: -.4 });
      if (!g.back) g.p([29.2, 24.8, 31.8, 24.8, 31, 28.4, 30.2, 29], '#e8c0a0', { bevel: .6 });
    }
  });

  // ---------------------------------------------------------------- Brockling
  BEAST('brockling', {
    pal: { a: '#8e8e96', b: '#f6f4ee', c: '#2a2a32', d: '#c89060', e: '#6a4a30' }, keep: ['b', 'c', 'd'], sh: 180,
    draw(g0) {
      const g = scaleG(g0, 1.16, 30, 60.6);
      const { a, b, c, d, e } = g.P;
      const fc = far(c, .15);
      // far legs and stubby tail
      g.l(45.5, 51, 46.5, 59, 2.7, fc); g.e(47, 59.4, 3.2, 1.6, fc);
      g.l(30, 52, 29, 59, 2.7, fc); g.e(28.5, 59.4, 3.2, 1.6, fc);
      g.fur(51.5, 46, 3.6, 3, a, { n: 6, amp: .35, mat: 'fur' });
      // stout grey body, dark underside
      const body = g.e(38.5, 48, 13, 9, a, { mat: 'fur' });
      g.on(body, () => { g.e(37, 56, 12, 4.5, c); for (const [x, y] of [[36, 41], [41, 40.5], [46, 42], [44, 45.5], [39, 44.5]]) g.l(x, y, x + 1.5, y - 1.2, .4, lt(a, .3)); });
      // near legs with digging claws
      g.l(47.5, 52, 48, 59, 3, c); g.e(48, 59.5, 3.8, 1.9, c);
      g.l(32, 53, 31.5, 59, 3.1, c); g.e(30.5, 59.5, 4, 1.9, c);
      K2.claws(g, 28.8, 60.4, 3, 2.8, 1.3, -1, d); K2.claws(g, 46.3, 60.4, 3, 2.8, 1.3, -1, d);
      // ears
      K.earR(g, 30, 37, 2.8, c, b); K.earR(g, 22.5, 36.2, 3, c, b);
      // head: white with the black stripes
      const head = g.e(23, 44, 9.8, 8.4, b, { mat: 'fur' });
      const snout = g.p([19, 41.5, 12, 44.5, 7.8, 47, 8.8, 50, 14, 51, 21, 50], b);
      g.fur(26, 49.5, 6.5, 3.2, b, { n: 7, amp: .3, a0: 20, a1: 170, mat: 'fur', line: false });
      g.on([head, snout], () => {
        g.p([8.6, 46.2, 15, 41, 21, 37, 26, 35.5, 27.5, 38.5, 22.5, 42.5, 17.5, 45.5, 11, 48], c);
        g.p([23, 40.5, 28, 36, 31, 36.5, 33, 41, 30.5, 45, 27.5, 44], c);
      });
      if (!g.back) g.on([head, snout], () => { g.e(14, 44.8, 1.6, .9, mix(e, b, .35)); g.e(11.2, 45.6, 1, .7, mix(e, b, .35)); });
      g.eye(18.5, 42.8, 2.6, 'round', { iris: '#8a5a2a', side: -1, brow: 1, look: -.4 });
      g.eye(27.8, 42, 2.3, 'round', { iris: '#8a5a2a', side: 1, brow: 1, look: -.4 });
      g.nose(8.5, 46.8, 'button', { s: 1.2 });
      g.mo('line', 12.2, 50.2, 3);
    }
  });

  // ---------------------------------------------------------------- Brockhorn
  BEAST('brockhorn', {
    pal: { a: '#6e6e78', b: '#f0eee6', c: '#22222a', d: '#b07a50', e: '#9a8a70', f: '#6a5a44' }, keep: ['b', 'c', 'd'], sh: 180,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fc = far(c, .15);
      // far legs
      g.l(51, 46, 53, 57.5, 4.4, fc); g.e(54, 59, 5, 2.2, fc);
      g.l(27, 48, 25, 57.5, 4.4, fc); g.e(24, 59, 5, 2.2, fc);
      // tail
      g.fur(60, 37, 3, 3.6, a, { n: 6, amp: .3, mat: 'fur' });
      // massive body
      const body = g.re(40, 40, 20, 13.5, -6, a, { mat: 'fur' });
      g.on(body, () => { g.e(38, 51, 18, 5.5, c); for (const [x, y] of [[44, 35], [50, 37], [55, 41], [37, 36], [47, 42], [53, 46]]) g.l(x, y, x + 2, y - 1.6, .45, lt(a, .25)); });
      // the old sett's earth: stone plates along the spine
      for (const [pts, col] of [[[27, 30, 31, 25, 38, 24, 39, 30, 33, 32], e], [[38, 27.5, 42, 23, 49, 23.5, 51, 28.5, 44, 30.5], dk(e, .12)], [[50, 29, 54, 25, 59, 28, 59.5, 33, 54, 34], e]]) {
        const pl = g.p(pts, col, { mat: 'stone' });
        g.on(pl, () => g.l(pts[2], pts[3] + 1, pts[6] - 1, pts[7] - .5, .35, dk(col, .3)));
      }
      // near legs with great digging claws
      g.l(49, 48, 50, 58, 5, c); g.e(50, 59.3, 5.8, 2.4, c);
      g.l(29, 49, 27.5, 58, 5.2, c); g.e(26.5, 59.3, 6, 2.5, c);
      K2.claws(g, 23.5, 60.6, 3, 4.4, 2.2, -1, d); K2.claws(g, 47, 60.6, 3, 4.4, 2, -1, d);
      // ears
      K.earR(g, 29, 30, 3.4, c, b);
      // head: low and forward, white with black stripes
      const head = g.e(19.5, 39, 11.5, 9.8, b, { mat: 'fur' });
      const snout = g.p([14, 36.5, 7, 39.5, 3, 42.5, 4, 46, 10, 47.5, 20, 46.5], b);
      g.fur(22, 45.8, 8.5, 3.8, b, { n: 8, amp: .28, a0: 20, a1: 170, mat: 'fur', line: false });
      g.on([head, snout], () => {
        g.p([3.4, 41.8, 8.5, 38, 14, 34, 20.5, 30.5, 24.5, 33, 19, 38.8, 13, 42.8, 6.5, 45.5], c);
        g.p([22.5, 35.5, 27, 31.5, 31, 33, 31.5, 39, 29, 43, 25.5, 41.5], c);
      });
      // rocky brow plate with a stout stone horn
      const horn = g.p([7.5, 34.5, 5, 29.5, 2.5, 24, 6.5, 26, 10.5, 29, 13.5, 31.5], lt(e, .08), { mat: 'stone' });
      g.on(horn, () => { g.l(5.5, 27.5, 8.5, 31.5, .35, f); g.l(7.8, 27.6, 10.6, 31, .3, f); });
      const plate = g.p([7, 35.2, 10.5, 30.5, 17, 27.5, 24.5, 27, 30.5, 28.8, 32, 32.5, 26, 33.2, 18.5, 34.2, 11.5, 36.8], e, { mat: 'stone' });
      g.on(plate, () => { g.l(15, 28.6, 17, 32.6, .38, f); g.l(22.5, 27.6, 21.2, 31.2, .38, f); g.l(27.5, 29, 29.2, 31.8, .35, f); g.e(21, 28.6, 5.5, 1, lt(e, .25)); });
      g.eye(15.4, 37.6, 2.5, 'angry', { iris: '#e0501a', lid: c, side: -1, look: -.4 });
      g.eye(25.4, 36.8, 2.2, 'angry', { iris: '#e0501a', lid: c, side: 1, look: -.4 });
      g.nose(3.8, 42.8, 'button', { s: 1.35 });
      g.mo('fangs', 8.5, 46.4, 4.6);
    }
  });

  // little lightning zigzag (sparks)
  // screen-space offsets rotated clockwise by ang degrees around (x, y)
  const rot = (x, y, ang, pts, s = 1) => { const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), out = []; for (let i = 0; i < pts.length; i += 2) { const dx = pts[i] * s, dy = pts[i + 1] * s; out.push(x + dx * ca - dy * sa, y + dx * sa + dy * ca); } return out; };
  const bolt = (g, x, y, s, ang, col, o = {}) => g.p(rot(x, y, ang, [-1, -4, 1.9, -4, .5, -.7, 2.4, -.9, -1.3, 4.8, .1, .7, -1.9, .9], s), col, { mat: 'glow', bevel: .5, ...o });

  // ---------------------------------------------------------------- Woolt
  BEAST('woolt', {
    pal: { a: '#f8f4e8', b: '#34344c', c: '#ffe040', d: '#d8d0cc', e: '#fffdf8' }, keep: ['a', 'b', 'd', 'e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const legs = (x, y, len, col) => { const id = g.l(x, y, x - .3, y + len, 1.55, col); g.on(id, () => g.l(x - .3, y + len * .48, x - .3, y + len * .6, 1.7, b)); g.e(x - .5, y + len + .4, 2, 1.3, b); return id; };
      // far legs
      legs(45.5, 51, 8, far(e, .25)); legs(31, 51.5, 7.8, far(e, .25));
      // fleece puffed up on end with static
      const fleece = g.fur(38.5, 44, 12.5, 9.2, a, { n: 16, amp: .26, mat: 'fur', dk: d });
      g.on(fleece, () => { for (const [x, y, r] of [[43, 39, 2.5], [35.5, 40, 2.2], [48, 45, 2.3], [40, 47, 2.1], [31.5, 46, 1.9]]) g.c(x, y, r, e); });
      g.fur(51.5, 42, 3, 2.6, a, { n: 6, amp: .35, mat: 'fur', dk: d });
      // near legs: knobbly-kneed lamb legs
      legs(47.5, 51.5, 8.2, e); legs(33.5, 52, 7.8, e);
      // ears stick out sideways
      blade(g, 20.5, 31.5, -104, 7, 2, b);
      blade(g, 30, 31, 80, 6, 1.8, far(b, .1));
      // hair-raising tuft
      g.fur(25.5, 26, 5, 3.8, a, { n: 9, amp: .4, a0: -180, a1: 0, mat: 'fur', dk: d });
      // head: white face, black "spectacles" and muzzle
      const head = g.e(25, 34, 7, 7.6, e, { mat: 'soft' });
      g.fur(26, 28.8, 6.2, 2.8, a, { n: 8, amp: .3, a0: -170, a1: -10, mat: 'fur', dk: d, line: false });
      if (!g.back) g.on(head, () => { g.e(21.4, 33.4, 3, 3.2, b); g.e(30, 33, 2.3, 2.8, b); g.e(21.6, 39.6, 4, 2.6, b); });
      g.eye(21.4, 33.4, 2.1, 'round', { iris: '#3a9ae8', side: -1, look: -.3 });
      g.eye(30, 33, 1.7, 'round', { iris: '#3a9ae8', side: 1, look: -.3 });
      g.mo('open', 21.3, 39.3, 3.2, { h: 2.6 });
      // crackles of static
      bolt(g, 54, 32.5, .95, 25, c); bolt(g, 15, 46.5, .75, -25, c); bolt(g, 42.5, 28, .7, -10, c);
    }
  });

  // ---------------------------------------------------------------- Ramvolt
  BEAST('ramvolt', {
    pal: { a: '#6a6a90', b: '#26263a', c: '#ffe040', d: '#a8a8cc', e: '#f0e0a8', f: '#fffdf8' }, keep: ['b', 'e', 'f'], sh: 150,
    draw(g0) {
      const g = scaleG(g0, 1.08, 34, 60.5);
      const { a, b, c, d, e, f } = g.P;
      const leg = (x, y, len, col, w = 2.7) => { g.l(x, y, x - .4, y + len, w, col); g.on(g.parts.length, () => g.l(x - .4, y + len * .45, x - .4, y + len * .6, w + .2, b)); g.e(x - .6, y + len + .2, w + .9, 1.7, b); };
      // far horn (behind the head)
      const fh = g.tube([25, 18.5, 31, 14.5, 36, 17.5, 37, 24, 34, 29, 30, 29.5], 3.6, 1.4, far(e, .3), { mat: 'stone' });
      void fh;
      // far legs
      leg(51, 46, 12.5, far(f, .3)); leg(30.5, 47, 12, far(f, .3));
      // storm-cloud fleece: separate billows with bright tops, a dark heavy underside
      const billow = (x, y, rx, ry) => { const id = g.fur(x, y, rx, ry, a, { n: 9, amp: .1, mat: 'fur', dk: dk(a, .28) }); g.on(id, () => g.e(x - rx * .2, y - ry * .55, rx * .6, ry * .32, d)); return id; };
      const bl = [billow(52, 40, 8.5, 8), billow(45, 33.5, 9, 7.5), billow(33.5, 34, 8.5, 7), billow(43, 44, 13, 8.5), billow(29.5, 42, 8.5, 7.5)];
      g.fur(42, 49, 15, 4, dk(a, .35), { n: 12, amp: .22, a0: 0, a1: 180, mat: 'fur' });
      // lightning crackling through the fleece
      g.on(bl, () => g.p([57, 33, 49, 39.5, 52, 40.5, 42, 47, 47.5, 41.5, 44.5, 40.5, 52.5, 34], lt(c, .15), { mat: 'glow' }));
      // near legs, one stamping
      leg(53.5, 47, 12.5, f, 2.9);
      g.tube([32, 47, 30, 52.5, 27.5, 55.5], 2.9, 2.6, f); g.on(g.parts.length, () => g.l(30, 51.5, 29.5, 53.5, 3.2, b)); g.e(26.5, 56.8, 3.4, 1.8, b);
      // neck ruff and head
      g.fur(24, 32, 7, 8, a, { n: 8, amp: .2, mat: 'fur', dk: dk(a, .28) });
      const head = g.re(17, 29, 6.8, 9.5, 22, f, { mat: 'soft' });
      const muzzle = g.e(12.5, 36, 5, 4.4, f);
      if (!g.back) g.on([head, muzzle], () => { g.p([12.5, 20.5, 18, 21.5, 17, 30, 12, 31], b); g.e(11.5, 38.4, 4.2, 2.8, b); g.p([18.5, 34.5, 21.5, 36, 17.5, 38.5], b); });
      // great curled near horn, ridged
      const hn = g.tube([19, 20, 25, 13.5, 32, 14, 35.5, 20.5, 34, 28, 28.5, 31.5, 23.5, 30, 22.5, 26], 4.6, 1.5, e, { mat: 'stone' });
      g.on(hn, () => { for (const [x1, y1, x2, y2] of [[22, 16.5, 25, 19.5], [26.5, 13.8, 28, 17.5], [31, 14.5, 30.5, 18.5], [34.5, 18.5, 31.8, 21], [35.2, 24, 32, 24.5], [33, 28.8, 30.5, 27], [28.5, 31.2, 28, 28.5]]) g.l(x1, y1, x2, y2, .45, dk(e, .38)); });
      // sparks between the horn tips
      bolt(g, 39.5, 12, .85, 25, c); bolt(g, 6.5, 24.5, .75, -20, c);
      g.eye(13.8, 28, 2.3, 'glowcool', { sc: '#ffe860', side: -1 });
      g.eye(20.4, 27.4, 1.9, 'glowcool', { sc: '#ffe860', side: 1 });
      g.nose(9.6, 36.5, 'nostrils', { s: .75 });
      g.mo('line', 11.4, 40.4, 3.2);
    }
  });


  // dome polygon (mushroom caps): upper half-ellipse with a gently curved underside, tilted by ang degrees
  const dome = (cx, cy, rx, ry, ang = 0, sag = .16) => { const pts = []; for (let i = 0; i <= 16; i++) { const t = Math.PI * i / 16; pts.push(-rx * Math.cos(t), -ry * Math.sin(t)); } pts.push(rx * .7, ry * sag, 0, ry * sag * 1.3, -rx * .7, ry * sag); return rot(cx, cy, ang, pts); };

  // ---------------------------------------------------------------- Cairnling
  BEAST('cairnling', {
    pal: { a: '#9aa864', b: '#8a7a6a', c: '#c8c4b8', d: '#7a7a84', e: '#5e5044', f: '#e0d0a8' }, keep: ['c', 'd'], sh: 90,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .28);
      // far legs and tail
      g.e(47.5, 58, 3.3, 2.8, fa); g.e(31, 58.4, 3.3, 2.8, fa);
      g.p([50.5, 51, 56, 54.5, 50.5, 55.5], a);
      // domed shell: raised plates over a darker base, a pale rim
      const shell = g.e(39, 48.5, 13.5, 9.5, e, { mat: 'stone' });
      g.on(shell, () => g.e(39, 57.4, 14, 3, f));
      g.group(() => {
        for (const pts of [[26.5, 50, 28, 43.5, 33.5, 41, 35, 46, 33.5, 53, 28, 54], [35.5, 45.5, 36, 40.2, 42.5, 40.2, 43.5, 45.5, 41.5, 53, 36.5, 53], [44, 46, 44.5, 41, 49.5, 43.5, 51.5, 49.5, 49.5, 54, 45, 53]]) g.p(pts, b, { mat: 'stone', line: false });
      });
      g.on(shell, () => g.fur(47, 42.8, 2.4, 1.3, dk(a, .1), { n: 5, amp: .4 }));
      // the little cairn walkers have built on its back
      g.e(39.5, 38.8, 6.4, 2.6, c, { mat: 'stone' });
      g.e(38.5, 35, 4.8, 2.3, d, { mat: 'stone' });
      const p3 = g.e(39.6, 31.6, 3.6, 2, c, { mat: 'stone' });
      g.on(p3, () => g.l(36, 32.2, 43, 31, .55, '#fffbee'));
      g.e(39, 28.5, 2.3, 1.6, f, { mat: 'stone' });
      // near legs
      g.e(45.5, 58.8, 3.6, 3, a); K2.claws(g, 43.5, 60.6, 3, 2.6, 1, -1, f);
      g.e(28.5, 58.8, 3.8, 3.1, a); K2.claws(g, 26.5, 60.6, 3, 2.6, 1, -1, f);
      // neck and head
      g.tube([29, 51, 25.5, 49.5, 22, 48.5], 3.8, 3.6, a);
      const head = g.e(19.5, 47, 7.2, 6.6, a, { mat: 'soft' });
      if (!g.back) g.on(head, () => g.e(18, 51, 5.5, 2.4, lt(a, .3)));
      void head;
      g.eye(16.4, 45.6, 3.4, 'dot');
      g.eye(23.4, 45, 3, 'dot');
      g.mo('smile', 16.2, 50.2, 3.8);
      g.blush(13.8, 48.6, 1.5); g.blush(25.2, 48, 1.4);
    }
  });

  // ---------------------------------------------------------------- Cairnback
  BEAST('cairnback', {
    pal: { a: '#86945a', b: '#6e6254', c: '#c4c0b4', d: '#8a8a94', e: '#a8d070', f: '#cbb890' }, keep: ['c', 'd', 'e'], sh: 90,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .28);
      // far legs and tail
      g.l(49, 50, 50, 58, 4.6, fa); g.e(50.5, 59.2, 5.6, 2.2, fa);
      g.l(27, 51, 26, 58, 4.6, fa); g.e(25.5, 59.2, 5.6, 2.2, fa);
      g.p([58, 47, 63, 51, 57.5, 52], a);
      // great domed shell: plates, moss and a pale rim
      const shell = g.e(39, 44.5, 22.5, 14, dk(b, .22), { mat: 'stone' });
      g.on(shell, () => { g.e(39, 57, 23, 4.5, f); });
      g.group(() => { for (const pts of [[18, 46, 20, 38.5, 26.5, 35.5, 29, 41.5, 27.5, 50, 21, 52], [29.5, 41, 31, 34, 38.5, 32.5, 40, 38.5, 38.5, 51, 30.5, 51], [40.5, 38.5, 42, 32.5, 49, 33.5, 51, 41, 49, 51, 41.5, 51], [51.5, 41, 52.5, 35.5, 57.5, 39.5, 60.5, 46, 58, 52, 51.5, 51]]) g.p(pts, b, { mat: 'stone', line: false }); });
      g.on(shell, () => { for (const [x, y, rx, ry] of [[29, 33.5, 5, 2.4], [49, 34, 5.5, 2.2], [40, 31.5, 4, 1.6], [20, 42, 2.4, 3]]) g.fur(x, y, rx, ry, e, { n: 7, amp: .3 }); });
      // a ring of standing stones: back row first, then the great trilithon, then the front stones
      const stone = (x, by, w, h, col, lean = 0) => { const id = g.p([x - w, by, x - w * .85 + lean, by - h, x + w * .75 + lean, by - h - .6, x + w, by], col, { mat: 'stone' }); g.on(id, () => { g.e(x - w * .3 + lean * .5, by - h * .55, w * .45, h * .12, lt(col, .15)); g.dot(x + w * .2, by - h * .3, .9, e); }); return id; };
      stone(27.5, 33.5, 2.4, 11, d, -.5); stone(52, 34, 2.3, 10.5, d, .5);
      stone(35, 31.5, 2.7, 16, c); stone(45, 31.5, 2.7, 16, c);
      const lintel = g.p([31.5, 14.8, 48.5, 14, 48.8, 17.2, 31.2, 17.8], c, { mat: 'stone' });
      g.on(lintel, () => g.fur(36, 14.8, 3.5, 1.2, e, { n: 6, amp: .4 }));
      stone(22.5, 38.5, 2.6, 9.5, c, -.8); stone(57, 39.5, 2.2, 8, c, .8);
      // grass tufts between the stones
      for (const [x, y] of [[31, 33], [40.5, 32], [49, 33.5]]) for (const k of [-1, 0, 1]) blade(g, x + k * 1.2, y + 1, k * 25, 3.5, .7, dk(e, .15), { ring: false });
      // near legs: pillar-like, with toenails
      g.l(47, 51, 47.5, 58.5, 5.2, a); g.e(47.5, 59.5, 6.2, 2.4, a); K2.claws(g, 44.5, 60.8, 3, 5, 1.3, -1, f);
      g.l(29, 52, 28, 58.5, 5.4, a); g.e(27.5, 59.5, 6.4, 2.5, a); K2.claws(g, 24.5, 60.8, 3, 5, 1.3, -1, f);
      // wrinkled neck, heavy old head, mossy beard
      const neck = g.tube([25, 47, 19, 45, 14, 43], 6, 5.2, a, { mat: 'soft' });
      g.on(neck, () => { for (const x of [17, 20, 23]) g.l(x, 39, x + 1, 50, .4, dk(a, .22)); });
      const head = g.e(12, 40, 8.5, 7.5, a, { mat: 'soft' });
      const beak = g.p([6, 37.5, 3, 40, 2.6, 44, 4.5, 46.5, 9, 46.5, 10, 42], a, { mat: 'soft' });
      g.on([head, beak], () => { g.p([2.8, 43.2, 5, 45, 9, 45.4, 12, 44.4, 12, 47.8, 3.5, 47.8], lt(a, .25)); g.e(14, 34.5, 5, 1.1, dk(a, .18)); });
      // mossy beard hanging from the chin
      g.on(head, () => { g.fur(14.5, 33.8, 5.5, 2.4, e, { n: 7, amp: .35 }); g.fur(18.5, 37, 2.2, 1.4, e, { n: 5, amp: .35 }); });
      g.eye(8.6, 38.8, 2.6, 'sleepy', { iris: '#d89a2a', lid: a, side: -1, look: -.3 });
      g.eye(15.8, 38.2, 2.3, 'sleepy', { iris: '#d89a2a', lid: a, side: 1, look: -.3 });
      g.nose(4, 40.4, 'nostrils', { s: .6 });
      flat(g, F => F.fchain([3.2, 44.6, 6, 43.8, 9.5, 44, 12.4, 43.2], .42, '#1b1328'));
    }
  });

  // ---------------------------------------------------------------- Mushlet
  BEAST('mushlet', {
    pal: { a: '#9a5ad0', b: '#d8ff70', c: '#f4e8d8', d: '#5a3080', e: '#dcc8b0' }, keep: ['c', 'e'], sh: 200,
    draw(g0) {
      const g = scaleG(g0, .93, 31, 60.5);
      const { a, b, c, d, e } = g.P;
      // a baby mushroom popping up beside it
      g.e(49, 57.5, 1.8, 3, c); g.p(rot(49, 55.5, 10, [-3.6, 0, -3, -2.6, -1.2, -4.6, .6, -5, 2.4, -3.8, 3.6, -1, 3.8, .4, 0, .9]), a);
      // chubby stem body and feet
      g.e(26.5, 59, 3.4, 1.9, e); g.e(36.5, 59.3, 3.4, 1.9, e);
      g.e(31.5, 49.5, 9, 9.8, c, { mat: 'soft' });
      // frilly ring skirt
      g.fur(31.5, 43.8, 10.5, 3, c, { n: 12, amp: .3, a0: 5, a1: 175, mat: 'soft', dk: e });
      // gills, then a young bell-shaped cap that has not opened yet, its tip flopping over
      g.e(30.5, 40.5, 13, 2.6, d);
      const cap = g.p(rot(30.5, 40, -6, [-16, 0, -15.5, -5, -13.5, -10.5, -10, -16, -5.5, -20.5, -1, -23.5, 3.5, -24.5, 7.5, -23, 10, -20.5, 10.5, -18, 12.5, -13, 15, -7, 16.5, -1, 16, 1.2, 8, 2.2, 0, 2.5, -8, 2.2, -15.5, 1.2]), a, { mat: 'soft' });
      g.tube(rot(30.5, 40, -6, [3.5, -24, 8, -25.5, 11.5, -23.5, 12, -20.5]), 2.6, 1.3, a, { mat: 'soft', line: false });
      g.c(...rot(30.5, 40, -6, [12, -20]), 1.6, b);
      // flecks of veil left on the cap
      g.on(cap, () => { for (const [x, y, rx, ry, t] of [[20, 33.5, 2.6, 1.9, -20], [28.5, 25, 2.4, 1.8, 10], [36.5, 29.5, 2.8, 2, 25], [26, 35.5, 1.6, 1.2, 0], [39, 36.5, 1.7, 1.2, 15], [32.5, 20, 1.5, 1.1, 0], [15.5, 37.5, 1.4, 1, 0]]) g.re(x, y, rx, ry, t, b); });
      // floating spores
      for (const [x, y, r] of [[52, 27, 1.4], [55.5, 22.5, 1], [8, 26, 1.1]]) g.c(x, y, r, b, { mat: 'glow' });
      g.eye(27.4, 48.4, 2.4, 'button');
      g.eye(35.4, 48, 2.1, 'button');
      g.mo('tongue', 31, 52.8, 3.4);
      g.blush(24.8, 51.5, 1.5); g.blush(38, 51, 1.4);
    }
  });

  // ---------------------------------------------------------------- Toadcap
  BEAST('toadcap', {
    pal: { a: '#7a9a50', b: '#e8e0a0', c: '#a04ad0', d: '#d8ff70', e: '#4a6030', f: '#c08040' }, keep: ['b', 'f'], sh: 200,
    draw(g0) {
      const g = scaleG(g0, 1.1, 34, 61);
      const { a, b, c, d, e, f } = g.P;
      // leaf litter
      K.leaf(g, 22, 61, -78, 17, 3.6, f, dk(f, .3)); K.leaf(g, 38, 61.5, 82, 18, 3.4, mix(f, '#e0a848', .45), dk(f, .25));
      // far hind leg
      g.e(52, 55, 6, 5, far(a, .3)); g.e(55, 59.5, 5, 1.8, far(a, .3));
      // squat, warty body
      const body = g.e(38, 48.5, 16.5, 11, a, { mat: 'soft' });
      g.on(body, () => { g.e(31, 53.5, 11, 6, b); for (const [x, y, r] of [[40, 40, 1.5], [46, 42, 1.3], [50.5, 46, 1.2], [44, 46.5, 1.1], [35, 41, 1.1]]) g.c(x, y, r, e); });
      K2.spots(g, body, [[39.6, 39.6, .6], [45.6, 41.6, .5]], d);
      // near hind leg: big haunch
      const haunch = g.e(48, 52, 7.5, 6.5, a, { mat: 'soft' });
      g.on(haunch, () => g.c(49, 50, 1.2, e));
      g.e(47, 59.5, 7, 2, a); K2.toes(g, 43, 60.4, 3, 3.5, e);
      // splayed front legs
      g.tube([25, 51, 22.5, 56, 20, 59], 2.6, 2.2, a); g.e(19, 59.6, 3.6, 1.6, a); K2.toes(g, 18.5, 60.4, 3, 3, e);
      g.tube([31, 53, 30.5, 57, 31.5, 59.5], 2.5, 2.1, a); g.e(31.8, 59.9, 3.4, 1.5, a);
      // wide flat head
      const head = g.e(22.5, 42.5, 11, 7.8, a, { mat: 'soft' });
      if (!g.back) g.on(head, () => g.e(19, 47.2, 9, 3, b));
      // frilly ring collar, like the stem-ring of a toadstool
      const ruff = g.fur(27.5, 47.5, 7, 4.2, lt(b, .25), { n: 10, amp: .28, a0: 0, a1: 180, mat: 'soft', dk: dk(b, .12) });
      g.on(ruff, () => { for (const x of [23, 26, 29, 32]) g.l(x, 45, x + .4, 50.5, .35, dk(b, .12)); });
      // eye mounds
      const m1 = g.e(17.5, 38.5, 4.2, 3.6, a, { mat: 'soft' }), m2 = g.e(27.5, 37.5, 3.8, 3.3, a, { mat: 'soft' });
      void m1; void m2;
      // toadstool cap worn like a hat
      g.e(28, 33.5, 12, 2.6, dk(c, .45));
      const cap = g.p(dome(28.5, 32.5, 14.5, 11, 10), c, { mat: 'soft' });
      g.on(cap, () => { for (const [x, y, rx, ry] of [[22, 27, 2.8, 2.3], [31.5, 23.5, 3, 2.4], [39, 29.5, 2.4, 2], [27, 30.5, 1.6, 1.3], [35.5, 32.5, 1.5, 1.2]]) g.e(x, y, rx, ry, d); });
      g.eye(17.2, 38.6, 2.8, 'slit', { sc: '#e8b830', look: -.3 });
      g.eye(27.4, 37.7, 2.4, 'slit', { sc: '#e8b830', look: -.3 });
      flat(g, F => F.fchain([10.5, 44.8, 14, 46.2, 20, 46.6, 26, 46, 29.5, 44.6], .45, '#1b1328'));
      g.nose(12.2, 42.4, 'nostrils', { s: .55 });
    }
  });

  // ---------------------------------------------------------------- Grimrat
  BEAST('grimrat', {
    pal: { a: '#8a9a78', b: '#c8c8a8', c: '#a6e040', d: '#ff90a4', e: '#4a5040', f: '#6a4a3a' }, keep: ['d'], sh: 40,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .3);
      // long naked tail with a kink
      g.tube([46, 52, 53, 55.5, 58, 53, 58.5, 47.5, 61.5, 44], 1.9, .7, d);
      g.on(g.parts.length, () => { for (let k = 0; k < 5; k++) g.l(49 + k * 2.3, 54.5 - (k > 2 ? (k - 2) * 2.8 : 0), 49.6 + k * 2.3, 52.5 - (k > 2 ? (k - 2) * 2.8 : 0), .3, dk(d, .25)); });
      // far legs
      g.tube([43, 52, 45, 56, 43.5, 59.5], 2, 1.6, fa); g.e(42.5, 59.8, 2.6, 1.4, far(d, .3));
      g.tube([28, 52, 26.5, 56, 24.5, 59.5], 1.9, 1.6, fa); g.e(23.5, 59.8, 2.6, 1.4, far(d, .3));
      // hunched body with a scruffy, bristling back
      const body = g.e(37, 48.5, 12.5, 8.5, a, { mat: 'fur' });
      const scruff = g.fur(38, 47, 12.3, 8.2, a, { n: 17, amp: .15, a0: -172, a1: -20, mat: 'fur', line: false });
      g.on([body, scruff], () => { g.e(35, 54, 9.5, 4, b); g.e(44, 45.5, 2.4, 1.6, c); g.e(40, 50.5, 1.5, 1.1, c); g.e(47.5, 49.5, 1.2, .9, c); for (const [x, y] of [[36, 42], [40.5, 41], [45.5, 42.5]]) g.l(x, y, x + 1.4, y - 1.3, .4, dk(a, .22)); });
      // near legs
      g.tube([45.5, 53, 48, 56.5, 46.5, 59.5], 2.3, 1.8, a); g.e(45.5, 60, 3, 1.5, d); K2.claws(g, 43.6, 60.8, 3, 2, .9, -1, '#e8e4d0');
      g.tube([29, 53, 28.5, 56.5, 27, 59.5], 2.2, 1.8, a); g.e(26, 60, 3, 1.5, d); K2.claws(g, 24.2, 60.8, 3, 2, .9, -1, '#e8e4d0');
      // studded collar
      const collar = g.tube([29.5, 37, 31.5, 43, 30.5, 49.5], 2.1, 2.1, f, { mat: 'gloss' });
      g.on(collar, () => { for (const [x, y] of [[30.8, 39.5], [31.6, 43], [31.2, 46.6]]) g.c(x, y, .8, '#e0e0e8'); });
      g.c(29.2, 50.8, 1.5, '#e8c040', { mat: 'metal' });
      // ears: the near one torn
      K.earR(g, 30, 34, 4, fa, far(d, .3));
      const ear = g.p([19.5, 36.5, 18.5, 31.5, 20.5, 28.5, 23, 29.2, 22.6, 31.2, 25, 31, 27, 32.5, 26.5, 36.5], a);
      g.on(ear, () => g.p([21, 35.5, 20.5, 31.8, 21.8, 30.4, 22, 32, 24.6, 32.2, 25.4, 35], d));
      // pointed head
      const head = g.e(22.5, 42, 8.2, 7, a, { mat: 'fur' });
      const snout = g.p([18, 38.5, 11, 41.5, 6.5, 44.5, 7.5, 47, 13, 48, 20, 47.5], a);
      if (!g.back) g.on([head, snout], () => g.e(13, 47, 6, 2, b));
      g.fur(25, 46, 5.5, 3.4, a, { n: 6, amp: .35, a0: 20, a1: 170, mat: 'fur', line: false });
      g.eye(18.4, 40.6, 2.5, 'sharp', { iris: '#ff3a3a', side: -1, slit: true, look: -.5 });
      g.eye(25.4, 39.8, 2.1, 'sharp', { iris: '#ff3a3a', side: 1, slit: true, look: -.5 });
      g.nose(6.8, 44.6, 'pink', { s: .9 });
      g.whiskers(8.5, 45, -1, 2, 5, '#3a4030');
      // yellowed buck teeth and a drip of toxic drool
      flat(g, F => { F.fp([9.6, 47.6, 12.4, 47.6, 12.2, 50.4, 9.8, 50.4], '#1b1328'); F.fp([10.2, 47.9, 11.8, 47.9, 11.7, 49.8, 10.3, 49.8], '#f4e6a0'); F.fe(14.2, 50, .8, 1.2, c); F.fe(14.4, 52.4, .65, .9, c); });
    }
  });

  // ---------------------------------------------------------------- Blightrat
  BEAST('blightrat', {
    pal: { a: '#6a7a58', b: '#b8b89a', c: '#a6e040', d: '#ff90a4', e: '#3a4230', f: '#2e2630' }, keep: ['d'], sh: 40,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .32);
      // thick scaly tail ending in a glowing barb
      const tail = g.tube([48, 50, 56, 53, 61, 48, 61, 40, 57.5, 35], 3.2, 1, d);
      g.on(tail, () => { for (let k = 0; k < 7; k++) { const [x, y] = [[51, 51.5], [54, 52.8], [57, 52], [59.5, 49.5], [60.8, 46], [61, 42.5], [59.8, 39]][k]; g.l(x - 1.2, y - 1, x + 1.2, y + 1, .35, dk(d, .25)); } });
      K2.ear(g, 57.5, 35.5, -40, 5, 1.6, c, null, null);
      // far legs
      g.tube([48, 48, 51.5, 53, 49.5, 58.5], 3, 2.4, fa); g.e(49, 59.3, 3.6, 1.7, far(d, .35));
      g.tube([26, 49, 23, 53.5, 20.5, 58], 2.8, 2.3, fa); g.e(19.5, 59, 3.6, 1.7, far(d, .35));
      // glowing toxic spines along the back
      for (const [x, y, ang, len] of [[31, 34, -28, 9], [35, 32, -12, 12], [39.5, 31, 4, 14], [44, 31.5, 18, 12.5], [48.5, 33.5, 34, 11.5], [52, 37, 52, 9.5], [54.5, 41.5, 72, 7.5]]) {
        const sp = K2.ear(g, x, y, ang, len, 1.7, e);
        g.on(sp, () => { const [tx, ty] = K.pt(x, y, ang, len * .8); g.c(tx, ty, 1.5, c, { mat: 'glow' }); });
      }
      // prowling body
      const body = g.re(39, 43, 16, 10.5, -8, a, { mat: 'fur' });
      g.on(body, () => { g.e(36, 51.5, 14, 4.5, b); g.re(41, 34, 15.5, 4, -6, e); for (const [x, y] of [[44, 40], [49, 42.5], [39.5, 42], [53, 45.5]]) g.l(x, y, x + 1.8, y - 1.6, .4, dk(a, .25)); });
      // near legs with heavy claws
      g.tube([49, 49, 53, 54, 51.5, 59], 3.4, 2.7, a); g.e(51, 59.8, 4, 1.9, d); K2.claws(g, 48.5, 60.8, 3, 3, 1.4, -1, '#e8e4d0');
      g.tube([27, 50, 24, 55, 22, 59], 3.2, 2.6, a); g.e(21, 59.8, 4, 1.9, d); K2.claws(g, 18.5, 60.8, 3, 3, 1.4, -1, '#e8e4d0');
      // spiked collar
      const collar = g.tube([25.5, 31.5, 28.5, 37.5, 28, 44, 25.5, 49], 2.5, 2.5, f, { mat: 'gloss' });
      for (const [x, y, ang] of [[29.5, 35.5, 55], [30.2, 41.5, 90], [29.2, 47, 125]]) { const [bx, by] = K.pt(x, y, ang, .6); K2.ear(g, bx, by, ang, 3.8, 1.35, '#d8d8e8', null, null); }
      // ears
      K.earR(g, 25.5, 28.5, 4, fa, far(d, .3));
      const ear = g.p([13.5, 32, 12.5, 26.5, 15, 23.5, 18.5, 24.2, 21, 26.5, 20.5, 31.5], a);
      g.on(ear, () => g.p([15, 30.8, 14.5, 27, 16, 25.5, 18.4, 26, 19.4, 30.2], d));
      // long head, lowered to strike
      const head = g.e(16.5, 38, 8.8, 7.4, a, { mat: 'fur' });
      const snout = g.p([12, 34.5, 5, 38, 2.5, 41.5, 3.5, 44, 9, 45, 16, 44.5], a);
      if (!g.back) g.on([head, snout], () => { g.e(9, 44, 6.5, 2.2, b); g.p([7, 35, 11, 32.5, 21.5, 33, 23, 36.5, 13, 37.5], dk(a, .35)); });
      g.fur(19, 43, 6, 3.6, a, { n: 6, amp: .35, a0: 20, a1: 170, mat: 'fur', line: false });
      g.eye(11.4, 36.5, 2.4, 'glow', { iris: '#c8ff50', brow: 1, browCol: '#1b1328' });
      g.eye(18.8, 35.8, 2.1, 'glow', { iris: '#c8ff50', brow: 1, browCol: '#1b1328' });
      flat(g, F => F.fl(16.5, 31.5, 20.5, 39.5, .4, lt(a, .35)));
      g.nose(3, 41.8, 'pink', { s: .95 });
      g.whiskers(4.5, 42.5, -1, 2, 5, '#2a3020');
      g.mo('fangs', 7, 45, 4.6);
    }
  });
})();