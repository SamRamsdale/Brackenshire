// ---- art/c1 ----
// ===== Batch c1: workshop bolts and dynamos, the river gudgeon and its sea wyrm, rock-pool sea angels =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // screen-space offsets rotated clockwise by ang degrees around (x, y)
  const rot = (x, y, ang, pts, s = 1) => { const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), out = []; for (let i = 0; i < pts.length; i += 2) { const dx = pts[i] * s, dy = pts[i + 1] * s; out.push(x + dx * ca - dy * sa, y + dx * sa + dy * ca); } return out; };
  // little lightning zigzag (sparks)
  const bolt = (g, x, y, s, ang, col, o = {}) => g.p(rot(x, y, ang, [-1, -4, 1.9, -4, .5, -.7, 2.4, -.9, -1.3, 4.8, .1, .7, -1.9, .9], s), col, { mat: 'glow', bevel: .5, ...o });
  // open-ended spanner jaw pointing along ang (a hand for the workshop family)
  const spanner = (g, x, y, ang, s, col, o = {}) => g.p(poly(x, y, ang, [0, -1.1, 1.2, -2.8, 4.9, -2.8, 4.9, -1.15, 2.5, -1.15, 2.5, 1.15, 4.9, 1.15, 4.9, 2.8, 1.2, 2.8, 0, 1.1].map(v => v * s)), col, { mat: 'metal', bevel: .8, ...o });
  // dense Catmull-Rom samples through control points (the same curve g.tube draws), as a flat [x, y, ...] list
  const spl = (pts, k = 6) => {
    const P = []; for (let i = 0; i < pts.length; i += 2) P.push([pts[i], pts[i + 1]]);
    const at = i => P[Math.max(0, Math.min(P.length - 1, i))], S = [];
    for (let i = 0; i < P.length - 1; i++) { const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      for (let j = 0; j < k; j++) { const t = j / k, t2 = t * t, t3 = t2 * t; for (const q of [0, 1]) S.push(.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3)); } }
    S.push(P[P.length - 1][0], P[P.length - 1][1]); return S;
  };
  // offset a path sideways: d > 0 is to the left of the direction of travel (d may be a function of the point index)
  const off = (pts, d) => {
    const n = pts.length / 2, out = [];
    for (let i = 0; i < n; i++) { const p = Math.max(0, i - 1), q = Math.min(n - 1, i + 1), tx = pts[q * 2] - pts[p * 2], ty = pts[q * 2 + 1] - pts[p * 2 + 1], m = Math.hypot(tx, ty) || 1, k = typeof d === 'function' ? d(i, n) : d; out.push(pts[i * 2] + ty / m * k, pts[i * 2 + 1] - tx / m * k); }
    return out;
  };
  // closed band between two offsets of a path (belly stripes, fins, frills)
  const band = (pts, d0, d1) => { const A = off(pts, d0), B = off(pts, d1), out = A.slice(); for (let i = B.length - 2; i >= 0; i -= 2) out.push(B[i], B[i + 1]); return out; };

  // closed eyes for icon sizes: a short dash of whole pixels each, so they never smear into a bar
  const dashEyes = (g, list, w) => { if (g.back) return; const U = g.U; for (const [x, y] of list) for (let px = Math.floor((x - w) * U); px <= Math.floor((x + w) * U); px++) g.feat.fpx((px + .5) / U, y, '#1b1328'); };
  // rotated ellipse placed from a base point along an angle (wings, flippers, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
  // scallop shell: a ribbed fan with a wavy rim, opening along ang from its hinge at (x, y)
  const scallop = (g, x, y, ang, R, spread, n, col, rib, o = {}) => {
    const pts = [...K.pt(x, y, ang - 90, R * .13)], m = n * 6;
    for (let i = 0; i <= m; i++) { const t = i / m, k = .9 + .1 * Math.abs(Math.sin(t * n * Math.PI)); pts.push(...K.pt(x, y, ang - spread / 2 + spread * t, R * k)); }
    pts.push(...K.pt(x, y, ang + 90, R * .13));
    const id = g.p(pts, col, o);
    if (rib && !g.tiny) g.on(id, () => { for (let j = 1; j < n; j++) { const an = ang - spread / 2 + spread * j / n, [x1, y1] = K.pt(x, y, an, R * .22), [x2, y2] = K.pt(x, y, an, R * .9); g.l(x1, y1, x2, y2, .4, rib); } });
    return id;
  };
  // four-pointed twinkle (flat, skipped when small)
  const twinkle = (g, x, y, r, col = '#ffe680') => { if (g.small) return; flat(g, F => { const U = g.U, cx = (Math.floor(x * U) + .5) / U, cy = (Math.floor(y * U) + .5) / U, t = .3 / U; F.fl(cx - r, cy, cx + r, cy, t, col, true); F.fl(cx, cy - r, cx, cy + r, t, col, true); }); };
  // cream markings: warm shadows instead of grey ones
  const CR = { dk: '#d9c592' };
  // a hex bolt head in 3/4 view: lit top, shaded flank, machined face. Returns [face id, place(dx, dy)]
  const hexHead = (g, x, y, tilt, w, h, a, c, b) => {
    const H = pts => rot(x, y, tilt, pts), kx = w * .56, ox = w * .34, oy = -h * .25;
    g.p(H([-w, 0, -kx, -h, -kx + ox, -h + oy, kx + ox, -h + oy, w + ox, oy, kx + ox, h + oy, kx, h, -kx, h]), mix(a, c, .55), { mat: 'metal' });
    g.p(H([kx, -h, kx + ox, -h + oy, w + ox, oy, w, 0]), mix(a, c, .28), { mat: 'metal' });
    g.p(H([-kx, -h, -kx + ox, -h + oy, kx + ox, -h + oy, kx, -h]), lt(a, .3), { mat: 'metal' });
    const face = g.p(H([-w, 0, -kx, -h, kx, -h, w, 0, kx, h, -kx, h]), a, { mat: 'metal' });
    if (!g.back) g.on(face, () => g.re(x, y, w * .77, h * .85, tilt, lt(b, .45), { dk: b }));
    return [face, (dx, dy) => rot(x, y, tilt, [dx, dy])];
  };

  // ---------------------------------------------------------------- Nutbolt
  BEAST('nutbolt', {
    pal: { a: '#aab2c6', b: '#e2e8f2', c: '#555d78', d: '#dc8c40', e: '#ffe040' }, keep: ['a', 'b', 'c'], sh: 160,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      // far arm, waving its spanner about
      g.tube([33, 47.4, 40, 48.4, 45.6, 44.8], .95, .95, far(c, .2));
      spanner(g, 45.8, 44.8, 58, 1.12, far(b, .28));
      // far leg and foot
      g.l(34.4, 54, 36.6, 58, 1, far(c, .2)); g.e(37.6, 59, 3.5, 2, far(d, .25));
      // the born-from-a-spark cowlick
      bolt(g, 32.4, 14.4, 1.25, 10, e);
      // threaded shank
      const shank = g.l(30.5, 39, 30.5, 56.4, 3.5, c, { mat: 'metal' });
      K2.stripes(g, shank, 26, 38, 35, 58, 14, 2.4, .9, lt(c, .55));
      // near leg and foot
      g.l(27, 54, 25, 58, 1.05, c); g.e(24, 59.3, 4, 2.2, d, { mat: 'metal' });
      // the brass nut it wears round its middle, working loose
      const N = pts => rot(30.5, 52, -11, pts);
      const nut = g.p(N([-9.4, 0, -7.6, -3.7, 7.6, -3.7, 9.4, 0, 7.6, 3.7, -7.6, 3.7]), d, { bevel: .8 });
      g.on(nut, () => { g.p(N([-3.6, -3.7, 3.6, -3.7, 3.6, 3.7, -3.6, 3.7]), lt(d, .3)); g.p(N([3.6, -3.7, 7.6, -3.7, 9.4, 0, 7.6, 3.7, 3.6, 3.7]), dk(d, .22)); });
      // hex head
      const [face, at] = hexHead(g, 29.5, 30.6, -8, 12.5, 8.6, a, c, b);
      void face;
      // near arm, spanner raised
      g.tube([28, 47, 21.5, 47.4, 15.6, 43], 1, 1, c);
      spanner(g, 15.8, 43.4, -42, 1.2, b);
      const [lx, ly] = at(-5, -1.2), [rx, ry] = at(3.8, -1.3);
      g.eye(lx, ly, 3.2, 'button'); g.eye(rx, ry, 2.8, 'button');
      const [mx, my] = at(-.8, 3.6); g.mo('smile', mx, my, 3.8);
      const [c1x, c1y] = at(-8.4, 2.4), [c2x, c2y] = at(7, 2.3);
      g.cheek(c1x, c1y, 1.3, d); g.cheek(c2x, c2y, 1.2, d);
      if (!g.small) bolt(g, 8.6, 31.6, .8, -24, e);
    }
  });

  // ---------------------------------------------------------------- Dynacoil
  BEAST('dynacoil', {
    pal: { a: '#9aa2b6', b: '#dde3ee', c: '#474e68', d: '#d98842', e: '#ffe040', f: '#fff6c4' }, keep: ['a', 'b', 'c', 'f'], sh: 160,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // the rotor on its back: a ring of pitched blades round a bolted hub
      const rotor = () => {
        const cx = 44.5, cy = 23.5;
        for (let i = 0; i < 9; i++) { const t = i * 40 + 6; g.p([...K.pt(cx, cy, t - 10, 5), ...K.pt(cx, cy, t - 2, 17.4), ...K.pt(cx, cy, t + 15, 16.6), ...K.pt(cx, cy, t + 12, 5)], i % 2 ? b : lt(a, .12), { mat: 'metal' }); }
        g.c(cx, cy, 6, c, { mat: 'metal' });
        const hub = []; for (let i = 0; i < 6; i++) hub.push(...K.pt(cx, cy, i * 60 + 12, 3.1));
        g.p(hub, d, { mat: 'metal', bevel: .9 });
      };
      if (!g.back) rotor();
      // far arm: a ribbed cable ending in a heavy spanner
      g.tube([46.5, 38.5, 53.5, 41.5, 56.6, 48], 2.5, 2.3, far(c, .2));
      spanner(g, 56.8, 49, 180, 1.45, far(b, .25));
      // far leg
      g.l(42.6, 54.6, 43.4, 58, 2.5, far(c, .2)); g.e(44, 59, 5.4, 2.5, far(a, .3), { mat: 'metal' });
      // drum of copper windings between two steel end plates
      g.e(35, 53, 11.6, 3.9, a, { mat: 'metal' });
      const coil = g.e(35, 44, 13.6, 10.2, d);
      K2.stripes(g, coil, 21, 34, 49, 55, -4, 2.5, .8, dk(d, .32));
      g.on(coil, () => g.e(35, 33.6, 12, 3.6, dk(d, .4)));
      const cap = g.e(35, 35, 12.4, 3.9, a, { mat: 'metal' });
      if (!g.small) g.on(cap, () => { for (const x of [26.5, 32, 38, 43.5]) g.c(x, 36.6 - Math.abs(x - 35) * .09, .85, d); });
      // near leg
      g.l(27.6, 55, 27, 58, 2.7, c); g.e(26.4, 59.3, 6, 2.7, a, { mat: 'metal' });
      g.e(27.2, 56.2, 3.6, 1.5, d, { mat: 'metal' });
      // the gauge on its chest: the needle sits deep in the red
      const dial = g.c(38.6, 45, 4.1, '#f6f2e6', { oc: '#3a3448' });
      g.on(dial, () => { g.p([38.6, 45, 42.8, 41.4, 43.4, 45.6], '#e8483a'); g.l(38.2, 45.6, 41.6, 42.6, .45, '#2a2030'); g.c(38.4, 45.4, .9, '#2a2030'); });
      // threaded neck and hex head
      const neck = g.l(27.6, 27, 29.6, 33.4, 3.3, c, { mat: 'metal' });
      K2.stripes(g, neck, 23, 26, 34, 35, 10, 2.1, .75, lt(c, .42));
      const [face, at] = hexHead(g, 25, 20, -5, 11.4, 8, a, c, b);
      void face;
      // near arm, holding a lit bulb out in front like a lantern
      const arm = g.tube([24, 38.6, 18.6, 45.4, 12.6, 48, 9.2, 45.6], 2.5, 2.2, c);
      K2.stripes(g, arm, 8, 37, 25, 50, 60, 2.2, .6, lt(c, .3));
      spanner(g, 8.9, 46, 0, 1.3, b);
      g.p([7.1, 37.8, 10.7, 37.8, 10.4, 41.6, 7.4, 41.6], d, { mat: 'metal', bevel: .7 });
      const bulb = g.c(8.9, 33.2, 4.5, f, { mat: 'glow', oc: mix(e, '#5a3a00', .55) });
      g.on(bulb, () => { g.c(8.5, 32.6, 2.7, '#ffffff'); g.l(7.6, 35.6, 8.9, 33.2, .3, mix(e, '#a05a00', .5)); g.l(8.9, 33.2, 10.2, 35.6, .3, mix(e, '#a05a00', .5)); });
      flat(g, F => { if (g.small) return; for (const [x1, y1, x2, y2] of [[4.4, 28.6, 3.2, 27.2], [8.9, 27.2, 8.9, 25.4], [13.2, 28.8, 14.4, 27.4]]) F.fl(x1, y1, x2, y2, .35, e, true); });
      if (g.back) rotor();
      // face: furious, glowing
      const [lx, ly] = at(-4.6, -.6), [rx, ry] = at(3.6, -.9);
      g.eye(lx, ly, 2.9, 'angry', { sc: '#fff3a0', iris: '#ff9a14', lid: b, side: -1, look: -.5 });
      g.eye(rx, ry, 2.5, 'angry', { sc: '#fff3a0', iris: '#ff9a14', lid: b, side: 1, look: -.5 });
      const [mx, my] = at(-1, 3.3); g.mo('teeth', mx, my, 5.6, { h: 2.3 });
      bolt(g, 57.6, 7, .72, 22, e);
    }
  });

  // ---------------------------------------------------------------- Gudgle
  BEAST('gudgle', {
    pal: { a: '#b2ad6a', b: '#f3ebcd', c: '#716c3a', d: '#ee9a4a', e: '#58a848' }, keep: ['b'], sh: 100,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const ray = (id, x0, y0, list) => { if (!g.small) g.on(id, () => { for (const [x, y] of list) g.l(x0, y0, x, y, .3, dk(d, .28)); }); };
      // far fin, raised in a shrug
      const ff = g.p([37.5, 45, 40.5, 35, 44, 32.6, 45.4, 36, 48.4, 36.4, 46.5, 41.5, 43, 46.5], far(d, .18), { gloss: true });
      ray(ff, 39.5, 45, [[43.6, 34], [47, 37.4]]);
      // limp tail fin
      const tf = g.p([52, 54.6, 57, 48.6, 60.8, 50, 59, 54.4, 61.6, 58, 57.4, 60.4, 52.4, 58.6], d, { gloss: true });
      ray(tf, 52.5, 56.5, [[59.4, 50.4], [60, 54.4], [59.6, 58.6]]);
      // body, flat on its tummy
      const body = g.tube([32, 49.6, 41, 52.4, 48.5, 54.4, 54, 56.4], 8.6, 2.5, a);
      const head = g.e(27, 46.6, 13.2, 11.8, a);
      g.on([head, body], () => g.e(29, 59.4, 26, 6.4, b, CR));
      K2.spots(g, [head, body], [[39.6, 44, 3, 1.9], [45.4, 48.4, 2.5, 1.7], [50.4, 52, 2, 1.4], [33.4, 38.4, 2.4, 1.5]], c);
      if (!g.back) g.on(head, () => g.e(24, 53.6, 8.6, 5.4, b, CR));
      // a scrap of river weed stuck to its head, curled like a question mark
      g.tube([28.6, 36, 27.6, 31, 30, 27, 33.6, 27.6, 34.4, 31, 32, 32.6], .95, .8, e);
      K.leaf(g, 32.4, 32.4, 205, 5, 1.9, e, dk(e, .3));
      // near fin, raised in a shrug
      const nf = g.p([16, 54.4, 9.4, 44.6, 6.4, 46.4, 6.6, 49.6, 3.4, 50.4, 5, 54.4, 9, 58.4, 15.4, 58.2], d, { gloss: true });
      ray(nf, 15, 56.4, [[8.6, 46.6], [5.6, 51], [8, 56.6]]);
      // barbels
      g.tube([20.2, 53.6, 18.4, 56, 18.8, 59], .7, .5, dk(d, .12));
      g.tube([28, 53.8, 29.8, 56.2, 29.2, 59.2], .7, .5, dk(d, .12));
      // face: looking two ways at once
      g.eye(19.4, 44.4, 3.8, 'round', { iris: '#c9a227', side: -1, look: -1, brow: -1, browCol: c });
      g.eye(31.8, 44, 3.5, 'round', { iris: '#c9a227', side: 1, look: 1, brow: -1, browCol: c });
      g.nose(25, 48.6, 'nostrils', { s: .7 });
      g.mo('o', 24.2, 53, 4.6);
      g.blush(15.6, 50.2, 1.8); g.blush(36, 49.6, 1.7);
    }
  });

  // ---------------------------------------------------------------- Leviarch
  BEAST('leviarch', {
    pal: { a: '#d49a3a', b: '#f7e4a6', c: '#8c5222', d: '#4f9440', h: '#a6cc5a', e: '#6acdf8', f: '#ffffff' }, keep: ['b', 'e', 'f'], sh: 100,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(a, .26), vd = dk(d, .32);
      // tail tip breaking the surface, flying a pair of fronds
      K.leaf(g, 56.8, 45, -44, 9, 2.7, d, vd); K.leaf(g, 57.4, 45, 10, 7.5, 2.4, h, d);
      g.tube([58.6, 62, 60, 55, 59.2, 48.5, 56.8, 44.6], 2.4, 1.1, far(a, .14));
      // the arch of its back, with kelp fronds standing along it
      K.leaf(g, 38.2, 43.4, -26, 9.5, 2.8, d, vd); K.leaf(g, 42, 41.4, 6, 11, 3, h, d); K.leaf(g, 46.4, 43.8, 36, 9, 2.7, d, vd);
      const M = [32.6, 62, 35, 51.5, 41, 46.4, 47, 51.5, 49.4, 62], SM = spl(M);
      const hump = g.tube(M, 5, 4.8, a);
      g.on(hump, () => g.p(band(SM, -2, -9), b, CR));
      K2.spots(g, hump, [[35.8, 48, 2.2, 1.7], [41, 43.2, 2.5, 1.5], [46.4, 48, 2.2, 1.7]], c);
      // fronds down the back of the neck
      K.leaf(g, 30.6, 27, 62, 9.5, 2.8, d, vd); K.leaf(g, 31.4, 33.4, 84, 9, 2.7, h, d); K.leaf(g, 28.6, 41, 100, 9.5, 2.8, d, vd);
      // neck, held like a swan's
      const Nk = [28.6, 62, 22.4, 51.5, 22, 42, 26.8, 33.4, 28, 26, 24.6, 20.4], SN = spl(Nk), n = SN.length / 2;
      const neck = g.tube(Nk, 7, 5, a);
      const Q = off(SN, -3.4), A1 = off(SN, 1.6), A2 = off(SN, 9);
      g.on(neck, () => {
        g.p(band(SN, 1.6, 12), b, CR);
        if (!g.small) for (let i = 4; i < n - 3; i += 4) g.l(A1[i * 2], A1[i * 2 + 1], A2[i * 2], A2[i * 2 + 1], .3, mix(b, c, .4));
        for (let i = 5; i < n - 2; i += 6) g.e(Q[i * 2], Q[i * 2 + 1], 2.2, 2.6, c);
      });
      // a frond drifting from the chest
      K.leaf(g, 17.6, 46, 218, 8.5, 2.5, h, d);
      // crown of fronds and cheek frond
      K.leaf(g, 20.6, 11.8, -22, 8.5, 2.5, d, vd); K.leaf(g, 24.6, 11, 6, 9.4, 2.7, h, d); K.leaf(g, 28, 13, 36, 8.5, 2.5, d, vd);
      K.leaf(g, 27.4, 20.6, 112, 7.6, 2.5, h, d);
      // head
      const head = g.e(21, 17, 8.6, 6.9, a);
      const snout = g.p([15.4, 11.4, 8, 14.4, 3.2, 18.2, 3.6, 21.8, 11, 23.8, 18.6, 23.6], a);
      if (!g.back) g.on([head, snout], () => { g.e(10.6, 24.2, 9.4, 2.7, b, CR); g.e(20, 24.6, 5, 2, b, CR); });
      g.on([head], () => g.e(25.6, 12.4, 3.2, 1.8, c));
      // leaf-tipped barbels trailing from the chin
      g.tube([6.6, 22.6, 5.2, 27, 7.6, 31, 6, 34.6], .8, .55, dk(a, .22));
      K.leaf(g, 6, 34.2, 196, 5.8, 2.1, h, d);
      g.tube([12.4, 23.6, 13.2, 27.6, 11.8, 30.4], .75, .5, dk(a, .22));
      g.eye(16.4, 16.6, 3.2, 'sharp', { iris: '#35d6c4', side: -1, slit: true });
      g.eye(24, 16, 2.5, 'sharp', { iris: '#35d6c4', side: 1, slit: true });
      g.nose(5.4, 18.6, 'nostrils', { s: .75 });
      g.mo('smirk', 9.2, 22.4, 4.6);
      // the sea
      const sea = g.e(35, 60.2, 27, 2.1, e, { gloss: true });
      g.on(sea, () => { g.e(22, 59.4, 5, .6, f); g.e(44, 59.6, 6, .6, f); g.e(57, 59.6, 2.6, .5, f); });
    }
  });

  // ---------------------------------------------------------------- Pearlet
  BEAST('pearlet', {
    pal: { a: '#eef0fc', b: '#ffffff', c: '#b6bfec', d: '#ff9cc6', e: '#a4dcf4', f: '#7f88c2' }, keep: ['a', 'b'], sh: 72,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const W = { dk: '#c8caf0', lt: '#ffffff', gloss: true };
      // far wing
      const fw = blade(g, 35.5, 43, 62, 12, 4.4, far(e, .14), { gloss: true });
      void fw;
      // the scallop shell it hatched from, worn like a halo
      const shell = () => { const sh = scallop(g, 31, 28.6, 10, 13.4, 150, 5, c, f, { gloss: true }); if (!g.back) g.on(sh, () => g.c(31, 28.6, 9.4, lt(d, .35))); };
      if (!g.back) shell();
      // body: a see-through teardrop with a curl of a tail
      const body = g.tube([30.5, 41, 30.6, 47, 32.6, 52.6, 37.4, 56.4], 6.4, .9, a, { ...W, taper: t => t ** 1.3 });
      g.on(body, () => g.c(30, 46.6, 4.5, lt(d, .6)));
      if (!g.back) { const pearl = g.c(30, 46.6, 2.9, d, { mat: 'glow', oc: dk(d, .35) }); g.on(pearl, () => g.c(29.2, 45.8, 1.3, '#ffffff')); }
      // near wing
      const nw = blade(g, 25.4, 43.6, -68, 13, 4.8, e, { gloss: true });
      if (!g.small) g.on(nw, () => { g.l(24, 43.4, 15.6, 40, .35, dk(e, .25)); g.l(22, 45.4, 16.6, 43.6, .3, dk(e, .25)); });
      // head
      const head = g.e(30, 32, 10.2, 9.4, a, W);
      void head; void b;
      if (g.back) shell();
      g.eye(25.6, 32.4, 3.4, 'cute', { iris: '#5a5ae0', side: -1 });
      g.eye(34.4, 32, 3.1, 'cute', { iris: '#5a5ae0', side: 1 });
      if (!g.small) g.mo('smile', 29.6, 37, 2.8);
      g.blush(22.4, 36.2, 1.7); g.blush(37.8, 35.8, 1.6);
      twinkle(g, 47.6, 27, 2.2); twinkle(g, 13.6, 30.6, 1.6);
    }
  });

  // ---------------------------------------------------------------- Pearlustre
  BEAST('pearlustre', {
    pal: { a: '#b3bce8', b: '#f6f3ff', c: '#7a82b8', d: '#ffffff', e: '#ff94c4', f: '#9cdcf4' }, keep: ['b', 'd'], sh: 72,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const W = { dk: '#c6c6ee', lt: '#ffffff', gloss: true };
      // the two valves of its shell, opened into wings
      const wings = () => {
        const w1 = scallop(g, 33, 33, 3, 25.5, 60, 5, far(a, .12), far(c, .1), { gloss: true });
        const w2 = scallop(g, 33, 35, 80, 23.5, 62, 5, a, c, { gloss: true });
        if (!g.back) { g.on(w1, () => g.c(33, 33, 12, mix(a, e, .5))); g.on(w2, () => g.c(33, 35, 11, mix(a, e, .55))); }
      };
      if (!g.back) wings();
      // veil tail fin
      blade(g, 53, 47.4, 28, 9.5, 3, far(f, .12), { gloss: true });
      blade(g, 53.4, 47.6, 74, 8.6, 2.8, f, { gloss: true });
      // far flipper
      blade(g, 23, 33.4, -100, 8.4, 2.4, far(f, .1), { gloss: true });
      // body: a long glide of a tail
      const body = g.tube([27, 27, 27.5, 36, 31, 44.5, 39, 50, 47.5, 51, 53.5, 47], 6.8, 1.2, b, { ...W, taper: t => t ** 1.2 });
      g.on(body, () => { g.e(50, 50, 9, 5, mix(b, f, .6)); g.c(25.6, 36.6, 5.2, lt(e, .6)); });
      if (!g.back) { const pearl = g.c(25.6, 36.6, 3.4, e, { mat: 'glow', oc: dk(e, .35) }); g.on(pearl, () => g.c(24.7, 35.7, 1.5, '#ffffff')); }
      // near flipper
      blade(g, 26, 40.4, -128, 9, 2.7, f, { gloss: true });
      if (g.back) wings();
      // a little shell for a crown
      const cr = scallop(g, 25.8, 13.6, -4, 8.8, 120, 3, lt(e, .25), dk(e, .2), { gloss: true });
      void cr;
      // head
      const head = g.e(25, 19.6, 10.2, 9.3, b, W);
      void head; void d;
      // serene, eyes closed against the moonlight
      if (g.small) dashEyes(g, [[19.8, 20.8], [29.6, 20.4]], 1.2);
      else {
        const big = g.N >= 72;
        g.eye(19.8, 20.6, 3.4, 'closed', { side: -1, lash: big });
        g.eye(29.6, 20.2, 3, 'closed', { side: 1, lash: big });
        g.mo('smile', 24.4, 25, 2.6); g.blush(17, 24, 1.6); g.blush(32.6, 23.6, 1.5);
      }
      // a trail of spilled pearls
      for (const [x, y, r] of [[41.4, 56.4, 2.3], [47.6, 58, 2], [53.4, 57.4, 1.7], [58.2, 55.2, 1.4]]) { const pl = g.c(x, y, r, lt(e, .5), { gloss: true, oc: dk(e, .45) }); g.on(pl, () => g.c(x - r * .3, y - r * .3, r * .45, '#ffffff')); }
      twinkle(g, 59.6, 49.6, 1.8); twinkle(g, 36, 58.6, 1.6); twinkle(g, 9.6, 11.6, 2);
    }
  });
})();