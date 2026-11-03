// ---- art/b3 ----
// ===== Batch b3: Kingsbridge streets, canal, Saltmarsh shore and open-sea Beasties =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // rotated ellipse placed from a base point along an angle (ears, leaves, petals, fins)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
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
  const tri = (i, step) => Math.abs(((i / step) % 2) - 1);
  // rotate screen points clockwise by deg around (cx, cy)
  const rotP = (cx, cy, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return (x, y) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
  // crab pincer pointing along ang (degrees clockwise from up); s = size, gap = how far it gapes, flip = -1 mirrors it
  const pincer = (g, x, y, ang, s, col, tip, gap = .12, flip = 1, o = {}) => {
    const pk = o.pk || 1, fl = o.fl || 1;
    const P = pts => poly(x, y, ang, pts.map((v, i) => i % 2 ? v * s * flip : v * s * fl));
    const f1 = g.p(P([.45, -.66, 1.3, -.64, 2.0, -.2 - gap, 1.25, -.1 - gap, .5, -.12]), col, o);
    const f2 = g.p(P([.5, .1, 1.2, .16 + gap, 1.92, .08 + gap, 1.35, .6, .45, .62]), col, o);
    if (tip) g.on([f1, f2], () => { const [ax, ay] = loc(x, y, ang)(1.98 * s * fl, (-.2 - gap) * s * flip), [bx, by] = loc(x, y, ang)(1.9 * s * fl, (.1 + gap) * s * flip); g.c(ax, ay, .5 * s, tip); g.c(bx, by, .46 * s, tip); });
    const [cx, cy] = loc(x, y, ang)(.2 * s, 0);
    const palm = g.re(cx, cy, .72 * s * pk, .78 * s * pk, ang, col);
    return [f1, f2, palm];
  };

  // ---------------------------------------------------------------- Moggle
  BEAST('moggle', {
    pal: { a: '#dba565', b: '#fff5e6', c: '#94623a', d: '#ff9aa8', e: '#e2474c', f: '#4a8ee0', h: '#f8cc3c' }, keep: ['b', 'd', 'e', 'f', 'h'], sh: 195,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(a, .28);
      // tail held straight up with a hooked tip: the friendly-cat greeting
      const tail = g.tube([45.5, 46, 50.5, 40, 51.8, 31, 50, 24, 45.5, 22.2], 2.9, 2.5, a, { mat: 'fur' });
      K2.stripes(g, tail, 44, 22, 54, 44, 8, 4.4, 1.5, c);
      g.on(tail, () => g.c(45, 22.2, 3.3, b));
      // far legs: the front one is lifted mid-trot
      g.tube([42.5, 49, 44, 54, 43, 58.8], 2.6, 2.3, fa); g.e(42.4, 59.5, 3, 1.7, far(b, .22));
      g.tube([28, 49, 25.4, 54, 24.2, 58.6], 2.5, 2.2, fa); g.e(23.2, 59.4, 3, 1.7, far(b, .22));
      // body
      const body = g.re(36.5, 46.2, 12, 8.6, -6, a, { mat: 'fur' });
      g.on(body, () => { g.e(33, 53, 10, 3.6, b); for (const x of [34.5, 38.8, 43, 47]) g.l(x, 36, x + 1.6, 43.5, .85, c); });
      // near legs with white socks
      const hip = g.e(45.2, 47.6, 6, 6.6, a, { mat: 'fur' });
      g.on(hip, () => { g.l(44.5, 43, 47.5, 46.5, .7, c); g.l(47.8, 42.8, 50.2, 46, .7, c); });
      const hl = g.tube([46.5, 50, 47.6, 55, 46.2, 59], 3, 2.6, a, { line: false });
      g.on(hl, () => g.e(46.4, 59, 4, 3.2, b));
      g.e(45.4, 59.8, 3.5, 1.9, b);
      const fl = g.tube([30.5, 49, 31.2, 55, 30.6, 59], 2.9, 2.6, a);
      g.on(fl, () => g.e(30.6, 59, 4, 3.2, b));
      g.e(29.8, 59.8, 3.4, 1.9, b);
      K2.toes(g, 29.4, 60.6, 2, 2, c); K2.toes(g, 45, 60.6, 2, 2, c);
      // two collars from two different households
      g.tube([19.5, 48.6, 26.5, 52.4, 34, 48], 1.2, 1.2, f);
      g.tube([18.5, 46.4, 25.5, 50.2, 33, 45.8], 1.2, 1.2, e);
      g.c(24.4, 52.4, 1.9, h, { gloss: true });
      // head
      K2.ear(g, 14.6, 30.5, -28, 10.5, 4.5, a, d);
      K2.ear(g, 29, 28.6, 22, 10.5, 4.5, a, d);
      const head = g.e(22.5, 37, 11, 9.4, a, { mat: 'fur' });
      const cheek = g.fur(22.5, 40.4, 12, 6, a, { n: 11, amp: .22, a0: 10, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on([head, cheek], () => {
        g.e(16, 42, 6.2, 4.2, b);
        g.l(19, 29.4, 19.7, 32.6, .5, c); g.l(22.2, 28.6, 22.2, 32.2, .5, c); g.l(25.4, 29.4, 24.7, 32.6, .5, c);
        g.l(30.2, 39, 33.6, 38.2, .5, c); g.l(30.2, 41.6, 33.6, 41.8, .5, c);
      });
      else g.on([head, cheek], () => { for (const x of [18, 22.5, 27]) g.l(x, 29, x, 34, .7, c); });
      g.eye(17, 36.9, 3.1, 'round', { iris: '#5aa838', side: -1, look: -.4, brow: -1, browCol: c });
      g.eye(27, 36.3, 2.8, 'round', { iris: '#5aa838', side: 1, look: -.4, brow: -1, browCol: c });
      g.nose(12.2, 40.4, 'pink', { s: .95 });
      g.mo('cat', 14.6, 43.2, 3.6);
      g.whiskers(11, 41.6, -1, 2, 4); g.whiskers(31.5, 42, 1, 2, 3.6);
      g.blush(13.4, 42.2, 1.4); g.blush(30.6, 41.4, 1.5);
    }
  });

  // ---------------------------------------------------------------- Moggadon
  BEAST('moggadon', {
    pal: { a: '#625862', b: '#bdb4be', c: '#342b36', d: '#e4587e', e: '#f2d23e' }, keep: ['e'], sh: 160,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .32), fb = far(b, .3);
      // bottle-brush tail, bristled straight up
      g.tube([48.5, 40, 53, 37, 55.4, 31], 3.4, 3.4, a, { mat: 'fur' });
      const tail = g.fur(55.6, 21.5, 3.9, 14.5, a, { n: 17, amp: .26, ph: .4, mat: 'fur', line: false });
      K2.stripes(g, tail, 50, 8, 61, 34, 4, 5.2, 1.7, c);
      g.on(tail, () => g.e(55.6, 8.5, 6, 4.6, c));
      // far legs
      g.tube([47, 44, 49.6, 51, 48.2, 58.4], 3, 2.5, fa); g.e(47.4, 59.4, 3.6, 1.9, fb);
      g.tube([24.5, 45, 22.2, 52, 21.6, 58.4], 2.9, 2.5, fa); g.e(20.8, 59.4, 3.6, 1.9, fb);
      // hackles along the arched spine
      g.fur(36.5, 25.5, 13.4, 8.6, c, { n: 22, amp: .2, a0: -166, a1: -14, mat: 'fur' });
      // body arched high
      const body = g.tube([24, 43, 27.5, 31, 36.5, 24.5, 45.5, 29.5, 48.5, 41], 7, 7.4, a, { mat: 'fur' });
      g.on(body, () => { for (const ang of [-46, -23, 0, 23, 46]) { const [x1, y1] = K.pt(36.5, 41, ang, 17.5), [x2, y2] = K.pt(36.5, 41, ang, 11.5); g.l(x1, y1, x2, y2, .8, c); } });
      // near hind leg, old claw scars on the haunch
      const hip = g.e(47, 41.5, 6.4, 7.6, a, { mat: 'fur', line: false });
      g.on([hip, body], () => { for (const k of [0, 1, 2]) g.l(44.4 + k * 2.2, 37.5 + k * .5, 46.2 + k * 2.2, 43 + k * .5, .45, d); });
      g.tube([48.5, 46, 51, 52, 49.8, 58.4], 3.4, 2.8, a, { line: false });
      g.e(48.8, 59.6, 4.3, 2.1, b); K2.claws(g, 47.8, 60.6, 3, 3.4, 1.5, -1);
      // near front leg
      g.tube([27.6, 44, 28.6, 52, 27.8, 58.4], 3.5, 2.9, a);
      g.e(26.8, 59.6, 4.5, 2.2, b); K2.claws(g, 25.6, 60.6, 3, 3.6, 1.5, -1);
      // head: broad tom-cat jowls, one torn ear
      K2.ear(g, 25.6, 25.4, 24, 8.6, 4.8, a, d);
      const ear = g.p([5.4, 29, 4.6, 18.8, 7.8, 22.4, 9.2, 17.2, 13, 21.6, 15.8, 25], a);
      g.on(ear, () => g.p([7.2, 27.6, 6.4, 21.8, 8.4, 24.6, 9.8, 20.4, 12, 23.8, 13, 26.4], d));
      const head = g.e(17, 33.5, 11.2, 9.4, a, { mat: 'fur' });
      const jowl = g.fur(18.6, 37.8, 11.8, 6.4, a, { n: 10, amp: .24, a0: 6, a1: 174, mat: 'fur', line: false });
      // a fish-bone trophy from the bins
      if (!g.small && !g.back) { const W = '#f6f1e4', o = { shade: false }; g.l(9.4, 42.5, 6.2, 50.4, .5, W, o); for (const t of [.3, .52, .74]) { const x = 9.4 - 3.2 * t, y = 42.5 + 7.9 * t; g.l(x - 1.9, y - .8, x + 1.9, y + .8, .42, W, o); } g.p([4.2, 50.2, 7.8, 51.6, 5, 54.6], W, o); }
      if (!g.back) g.on([head, jowl], () => {
        g.e(11, 38.8, 4.8, 3.5, b);
        g.l(13.4, 25.4, 14, 28.6, .55, c); g.l(17, 24.8, 17, 28.2, .55, c); g.l(20.6, 25.4, 20, 28.6, .55, c);
        g.l(25.4, 36.6, 29, 35.8, .55, c); g.l(25.4, 39.4, 29, 39.6, .55, c);
      });
      flat(g, F => F.fl(8.6, 26.6, 11.4, 38, .6, '#f4aab8'));
      g.eye(11.4, 32.6, 3.5, 'sharp', { iris: e, slit: true, side: -1, brow: 1, look: -.4 });
      g.eye(22, 32, 3, 'sharp', { iris: e, slit: true, side: 1, brow: 1, look: -.4 });
      g.nose(7.6, 36.8, 'tri', { s: .95 });
      g.mo('fang', 10, 40.4, 4.4, { fx: -1 });
      g.whiskers(7.2, 38.6, -1, 2, 3.4, '#e6dce6');
    }
  });
  // ---------------------------------------------------------------- Zapeel
  BEAST('zapeel', {
    pal: { a: '#3d5f93', b: '#f2e468', c: '#ffd83a', d: '#9cc4f0', e: '#ee5a3c', f: '#fff6e0' }, keep: ['b', 'c', 'e', 'f'], sh: -75,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const B = [21, 41, 25.5, 51, 33, 56, 41.5, 53, 46.5, 46.5, 52, 44.5, 56.5, 40], S = spl(B);
      // a snapped fishing line with its float, bobbing above the tail like a balloon
      g.tube([56.4, 40, 55.2, 35.5, 56.8, 32, 55.8, 28.5], .42, .42, f, { shade: false });
      g.l(55.8, 29, 55.7, 27, .5, '#3a3040', { shade: false });
      const flo = g.e(55.6, 24, 2.9, 3.5, f, { gloss: true });
      g.on(flo, () => g.e(55.6, 21.8, 3.4, 2.5, e));
      g.l(55.6, 20.4, 55.4, 17.2, .5, e);
      // ribbon fin along the back
      g.p(band(S, 0, (i, n) => 8.2 - 5 * (i / n) ** 2), d, { gloss: true });
      // body
      const body = g.tube(B, 5.4, 1.7, a, { taper: t => t * t });
      g.on(body, () => {
        g.p(band(S, i => -(.4 + 2.4 * tri(i, 3)), -9), b);
        for (const i of [10, 17, 24]) g.c(S[i * 2] + .4, S[i * 2 + 1] - 1.7, 1.25, c);
        g.l(54.2, 41.6, 57, 43.6, .5, f); g.l(55.4, 39.6, 58.2, 41.4, .5, f);
      });
      // pectoral fin
      g.p([24.6, 46.4, 30.6, 48, 28.4, 53.4], d, { gloss: true });
      // head with a little serrated crest
      g.p([13, 32.5, 14.4, 26.6, 17.2, 30.4, 19.2, 25.6, 21.4, 30.2, 23.4, 27.4, 24.6, 33.5], d, { gloss: true });
      const head = g.e(16.6, 38.4, 9.4, 7.8, a);
      if (!g.back) g.on(head, () => g.e(13, 45.4, 10, 5, b));
      g.eye(12.4, 36.6, 3.2, 'cute', { iris: '#f0c020', side: -1 });
      g.eye(21.2, 36, 2.9, 'cute', { iris: '#f0c020', side: 1 });
      g.mo('grin', 12.8, 40.8, 5.6, { h: 2 });
      // sparks running up the line
      if (!g.small) { g.dot(52.2, 33.4, 1, c); g.dot(59.4, 30.4, 1, c); }
    }
  });

  // ---------------------------------------------------------------- Fulgurel
  BEAST('fulgurel', {
    pal: { a: '#2a4680', b: '#f4e676', c: '#ffdc3c', d: '#7fb0ee', e: '#a4f2ff' }, keep: ['b', 'c'], sh: -75,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .3), fd = far(d, .25);
      // tail flicking up behind the coil
      const T = [44, 53.5, 52, 54.2, 58, 50.5, 60, 43.5, 57.6, 37.5], TS = spl(T);
      K.leaf(g, 58.4, 39.5, -32, 11, 3, fd, far(d, .5));
      g.p(band(TS, 0, (i, n) => 5 - 2.4 * i / n), fd);
      g.tube(T, 3.7, 1.3, fa);
      // far side of the coil
      g.tube([23, 52, 30, 47.6, 42, 47.6, 50, 52.5], 5, 5, fa);
      // body: the near side of the coil, then rearing up like a tower
      const C = [50, 52.5, 44, 57.2, 30, 57.6, 21.5, 53.5, 17.5, 45, 22, 36.5, 29.5, 30, 31.5, 22, 27, 15.5], S = spl(C), n = S.length / 2;
      // lightning-edged back fin
      g.p(band(S, 0, i => i < 20 ? 0 : -(6.6 + 3.2 * tri(i, 2))), d, { gloss: true });
      const body = g.tube(C, 5.3, 5, a);
      const Q = off(S, -1.8);
      g.on(body, () => {
        g.p(band(S, i => .4 + 2.6 * tri(i, 3), 9), b);
        for (let i = 3; i < n - 6; i += 5) g.c(Q[i * 2], Q[i * 2 + 1], 1.25, e);
      });
      // sail crest: rays fanned out like a lighthouse beam
      const fan = []; for (let i = 0; i <= 10; i++) fan.push(...K.pt(25.5, 15.5, -34 + i * 11.5, i % 2 ? 10 : 14.5)); fan.push(27, 20, 22, 17);
      const crest = g.p(fan, d, { gloss: true });
      g.on(crest, () => { for (let i = 0; i <= 10; i += 2) { const [x, y] = K.pt(25.5, 15.5, -34 + i * 11.5, 13.5); g.l(25.5, 15.5, x, y, .5, c); } });
      // lower jaw and mouth
      g.p([7.4, 18, 5.2, 20.6, 6.8, 22.6, 14, 23.2, 21.5, 21.6, 21, 17], b);
      if (!g.back) g.p([6, 18, 13, 19, 19.5, 19.6, 13.6, 21, 7.6, 20.4], '#4a1628', { shade: false, line: false });
      // head and upper jaw
      const head = g.e(21, 15, 8.4, 6.6, a);
      g.p([16.5, 9.8, 9, 12, 4, 15.2, 4.6, 17.8, 12.5, 19, 19.5, 19.2], a, { line: false });
      flat(g, F => { for (const x of [7, 10.2, 13.4]) F.fp([x - .8, 18 + (x - 7) * .14, x + .8, 18.2 + (x - 7) * .14, x + .1, 20 + (x - 7) * .14], '#ffffff'); });
      // the lamp
      g.c(23.6, 9.6, 2.7, '#fff6bc', { mat: 'glow', oc: mix(c, '#5a3a00', .5) });
      // zigzag barbel
      if (!g.back) { const x = 6.6, y = 22.4; g.l(x, y, x - 2.2, y + 3.2, .62, c, { mat: 'glow' }); g.l(x - 2.2, y + 3.2, x + .6, y + 5.2, .62, c, { mat: 'glow' }); g.l(x + .6, y + 5.2, x - 1.6, y + 9, .58, c, { mat: 'glow' }); }
      g.eye(16.4, 14.4, 2.9, 'glowcool', { sc: e, side: -1 });
      g.eye(24.4, 14.2, 2.2, 'glowcool', { sc: e, side: 1 });
      void head;
    }
  });
  // ---------------------------------------------------------------- Gullnip
  BEAST('gullnip', {
    pal: { a: '#f8f8f2', b: '#b2bdcd', c: '#f2b230', d: '#e84a30', e: '#f29a52', f: '#f8e08c', h: '#3a3c4a' }, keep: ['a', 'c', 'd', 'e', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fb = far(b, .22), fe = far(e, .22);
      // stubby tail
      const tail = g.p([42, 47, 51, 43.5, 55, 46.5, 52, 49, 54.5, 52, 49.5, 53, 43, 53.5], b);
      g.on(tail, () => g.p([50, 42, 57, 44, 57, 54, 51, 54, 52.4, 48.6], h));
      // far wing flung up behind
      const fw = g.p([37, 40, 41, 30, 47.5, 24, 48, 28, 45.5, 30, 47, 33, 44, 34.5, 44.5, 38, 41, 41.5], fb);
      g.on(fw, () => g.p([43.6, 21, 50, 21, 50, 29.4, 44.6, 30], far(h, .2)));
      // far leg kicked back mid-dash
      g.l(38, 54, 42.4, 57.2, 1, fe); g.re(44.6, 58.4, 3.3, 1.5, 28, fe);
      // downy body, leaning into the getaway
      const body = g.re(33, 46, 11.8, 10.2, -18, a, { mat: 'fur' });
      K2.spots(g, body, [[38, 39.5, 1.2], [42, 42.5, 1], [41, 47.5, 1.1], [37, 52.5, 1], [33.5, 54.5, .9]], b);
      // near leg and big webbed foot
      g.l(30, 55, 28.6, 59, 1.1, e);
      const foot = g.e(26.4, 59.8, 4.5, 1.7, e);
      g.on(foot, () => { g.l(25.2, 58.6, 24.2, 61, .35, dk(e, .35)); g.l(27.6, 58.6, 27.6, 61.2, .35, dk(e, .35)); });
      // near wing swept back
      const nw = g.p([36.5, 43.5, 44, 38.5, 53.5, 36.5, 52, 40, 48.5, 40.5, 49.5, 44, 45.5, 44.5, 45.5, 48, 41, 48.5, 37, 48.5], b);
      g.on(nw, () => { g.p([48, 35, 55, 35, 54, 41, 49.5, 41.5, 49, 38.5], h); g.l(38, 46.5, 44, 42.5, .4, dk(b, .25)); });
      // head with a wave-curl of down
      g.tube([27, 23.5, 28, 19.5, 31.5, 18.6, 33.4, 21, 31.6, 22.4], 1.7, .9, a, { mat: 'fur' });
      const head = g.e(26.5, 31, 9.6, 9, a, { mat: 'fur' });
      K2.spots(g, head, [[29, 24.4, 1.1], [33, 27.4, 1], [32, 32, .9]], b);
      // a stolen chip, held crosswise in the beak
      g.p([19, 33.8, 13, 33.9, 11.4, 35.8, 19, 36.8], dk(c, .14));
      const chip = g.p([8.7, 27.9, 11.3, 27.3, 14.1, 38.5, 11.5, 39.1], f, { bevel: .9 });
      g.on(chip, () => { g.l(8.6, 28, 11.4, 27.3, .7, mix(f, '#c07a24', .6)); g.l(11.4, 39.1, 14.2, 38.5, .7, mix(f, '#c07a24', .6)); });
      g.p([19, 29.4, 12.6, 31, 9.2, 33.6, 10.6, 34.6, 13, 33.9, 19, 34], c);
      flat(g, F => F.fe(14.6, 35.4, .7, .6, d));
      g.eye(22.8, 29.4, 2.9, 'round', { iris: '#f4cc34', side: -1, look: -.5, brow: 1, browCol: '#565c6e' });
      g.eye(30.8, 28.8, 2.5, 'round', { iris: '#f4cc34', side: 1, look: -.5, brow: 1, browCol: '#565c6e' });
      g.blush(22, 34.6, 1.5);
    }
  });

  // ---------------------------------------------------------------- Galegull
  BEAST('galegull', {
    pal: { a: '#fafaf5', b: '#8e9fb8', c: '#f2b230', d: '#e84830', e: '#f09058', h: '#30323e' }, keep: ['a', 'c', 'd', 'e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, h } = g.P;
      const fb = far(b, .28), fh = far(h, .2);
      // far wing sweeping up
      const fw = g.p([26.5, 30.5, 33.5, 11.5, 57, 3.5, 53.5, 9, 50.5, 8.2, 48.5, 13, 45, 12.4, 43.5, 17.5, 40.5, 17.4, 39.5, 22.5, 37.5, 23, 37, 30], fb);
      g.on(fw, () => { g.p([44.5, 1, 60, 1, 55, 10.5, 50.6, 9.6, 48.8, 12.6, 46.4, 10.6], fh); g.c(51.6, 6.2, .95, a); g.l(29.5, 29, 35.5, 14, .4, lt(fb, .3)); g.l(35.5, 14, 47, 9, .4, lt(fb, .3)); });
      // tail fan
      const tail = g.p([41, 31.5, 52, 29.5, 57, 31.5, 54, 34, 58, 37, 54.5, 39, 56.5, 43, 50, 42.5, 41, 40], a);
      g.on(tail, () => { g.l(44, 34, 54, 32.5, .35, b); g.l(44, 37, 55, 37.6, .35, b); g.l(44, 39, 53, 41.6, .35, b); });
      // feet tucked back
      g.re(43.4, 42.4, 3.4, 1.5, 20, e); g.re(40, 43.4, 3.4, 1.5, 16, e);
      // body
      const body = g.re(31, 34.5, 12.5, 7.4, 8, a, { mat: 'fur' });
      g.on(body, () => g.re(34, 30.4, 11.5, 3.6, 8, b));
      // near wing sweeping down
      const nw = g.p([27, 37, 35.5, 54, 58, 61, 54, 55.6, 51, 56.4, 49, 51.4, 45.5, 52, 44, 47, 41, 47.2, 40.5, 42, 38, 41.5, 37, 35.5], b);
      g.on(nw, () => {
        g.p([45, 63, 61, 63, 56, 54.2, 51.4, 56.2, 49.4, 53, 47, 55.2], h); g.c(53, 58.6, 1.05, a);
        g.l(29.5, 38.5, 37, 52.6, .45, lt(b, .4)); g.l(37, 52.6, 47, 56.6, .45, lt(b, .4));
        g.l(38.6, 42.4, 40.4, 46.4, .4, a); g.l(41.8, 47.6, 43.8, 51.2, .4, a);
      });
      // cloud-white ruff
      g.fur(24.6, 33.6, 6.4, 6.6, a, { n: 9, amp: .26, mat: 'fur', dk: '#c9d3e2' });
      // head with a breaking-wave crest
      g.tube([17.4, 23.4, 20.6, 18, 26, 16.4, 29.4, 19.4, 27.6, 22.4, 25.2, 21.2], 2.2, .9, a, { mat: 'fur', dk: '#c9d3e2' });
      const head = g.e(15.4, 28.4, 7.4, 6.8, a, { mat: 'fur', dk: '#c9d3e2' });
      // beak thrown open in a cry
      if (!g.back) g.p([9.5, 28, 4.6, 29.6, 5.6, 32.6, 9.5, 32.6], '#b03048', { shade: false, line: false });
      g.p([10, 31.4, 5.2, 33.6, 3.4, 36, 6.4, 35.6, 10, 34], dk(c, .14));
      g.p([10, 25.6, 4.4, 25.8, 1.6, 27.4, 1.9, 29.6, 3.8, 28.6, 10, 29.4], c);
      flat(g, F => F.fe(5.4, 34.5, .7, .6, d));
      g.eye(13, 26.8, 2.7, 'angry', { iris: '#f6e070', lid: a, side: -1, look: -.5 });
      g.eye(19.6, 26.2, 2.2, 'angry', { iris: '#f6e070', lid: a, side: 1, look: -.5 });
      void head;
    }
  });
  // barnacle: a little pale volcano
  const barnacle = (g, x, y, r, col, hole) => { g.p([x - r, y + r * .8, x - r * .5, y - r * .7, x + r * .5, y - r * .7, x + r, y + r * .8], col, { mat: 'stone', bevel: .7 }); if (!g.small) g.dot(x, y - r * .5, .6, hole); };

  // ---------------------------------------------------------------- Pinchet
  BEAST('pinchet', {
    pal: { a: '#e2683e', b: '#ffd8ac', c: '#a53c22', d: '#2c2530', e: '#cf4f58', f: '#ffecd6', h: '#c2b8a8' }, keep: ['b', 'd', 'e', 'f', 'h'], sh: 190,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(a, .24);
      // legs: stretched out on the leading side, bunched on the trailing side
      for (const [x1, y1, x2, y2, x3, y3] of [[19, 46, 11, 45.5, 5.5, 54], [18.5, 49, 10.5, 50.5, 7.5, 59.5], [21, 52, 15.5, 55, 14, 61], [43, 46, 50, 44.5, 55, 52.5], [43.5, 49, 51.5, 49.5, 55.5, 58.5], [41, 52, 47.5, 54.5, 50, 61]]) {
        g.l(x1, y1, x2, y2, 1.5, fa);
        const lo = g.tube([x2, y2, (x2 + x3) / 2 + (x3 < 32 ? -.6 : .6), (y2 + y3) / 2, x3, y3], 1.4, .7, a);
        g.on(lo, () => g.c(x3, y3, 1.7, c));
      }
      // the prize: a rasher of bacon won from a crabbing line, carried off like a banner
      const R = spl([43.6, 23.6, 47.4, 20.6, 51.6, 23.6, 55.8, 20.6, 60, 23.4]);
      g.tube([59.6, 24, 60.4, 28, 58.6, 31, 59.8, 34.6], .42, .42, f, { shade: false });
      const rash = g.p(band(R, -2.3, 2.3), e, { bevel: .8 });
      g.on(rash, () => { g.p(band(R, 1.1, 2.8), f); g.p(band(R, -1.2, -.5), f); });
      // big claw held high
      g.l(43, 43.5, 49, 39.5, 2.1, a);
      pincer(g, 50.4, 37.4, 4, 6.8, a, d, .1, -1);
      // small leading claw
      g.l(19, 44.5, 13.6, 42, 1.7, a);
      pincer(g, 13.4, 42, -58, 4.4, a, d, .16, -1);
      // shell with a pie-crust rim
      const shell = g.e(31, 45.4, 15.5, 10, a);
      g.on(shell, () => {
        g.e(31, 58, 13.5, 7.4, b);
        for (let i = 0; i <= 8; i++) { const x = 18.6 + i * 3.1; g.c(x, 50.6 + 2 * (1 - ((x - 31) / 12.4) ** 2), 1.75, lt(a, .34)); }
      });
      K2.spots(g, shell, [[36.5, 40.4, 1.2], [41, 43.6, 1.2], [38, 46.4, 1], [23.6, 46, 1], [27.6, 42.4, .9]], c);
      // a limpet riding on its back
      const lim = g.p([15.6, 42.4, 19.4, 37.4, 20.8, 37.2, 24.6, 40.4], h, { mat: 'stone', bevel: .8 });
      g.on(lim, () => { g.l(20, 37.2, 18, 42, .35, dk(h, .32)); g.l(20.2, 37.2, 21.6, 41.4, .35, dk(h, .32)); });
      // eye stalks
      g.l(27.4, 38, 26.6, 31.5, 1.1, a); g.l(36.4, 37.6, 37, 31.6, 1.05, a);
      g.eye(26.5, 29.4, 3.3, 'button'); g.eye(37.1, 29.8, 2.9, 'button');
      g.mo('smile', 30, 48.4, 4);
      g.blush(23.6, 49.6, 1.5); g.blush(36.4, 49.4, 1.5);
    }
  });

  // ---------------------------------------------------------------- Clawcliff
  BEAST('clawcliff', {
    pal: { a: '#c24e32', b: '#eaa684', c: '#74767e', d: '#a9abb4', e: '#5e9440', f: '#f08aa6', h: '#2c2530', k: '#ece6d6' }, keep: ['c', 'd', 'e', 'f', 'h', 'k'], sh: 190,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const fa = far(a, .26);
      // thick armoured legs
      for (const [x1, y1, x2, y2, x3, y3] of [[19, 50.5, 11, 52, 7.5, 60.5], [23, 53.5, 17, 56.5, 15.5, 61.5], [50, 47, 57, 45.5, 60.5, 54], [50, 50.5, 57.5, 51.5, 60.8, 60], [47, 53.5, 53.5, 56.5, 56, 61.5]]) {
        g.l(x1, y1, x2, y2, 2.1, fa);
        const lo = g.tube([x2, y2, (x2 + x3) / 2 + (x3 < 32 ? -.8 : .8), (y2 + y3) / 2, x3, y3], 2, .9, a);
        g.on(lo, () => g.c(x3, y3, 2.2, h));
      }
      // small claw
      g.l(49, 45, 54.5, 41.5, 2.1, fa);
      pincer(g, 55.4, 41, 26, 5, a, h, .1, 1);
      // shell
      const shell = g.e(35, 47, 18.5, 10.6, a);
      g.on(shell, () => {
        g.e(35, 60, 16, 7, b);
        for (let i = 0; i <= 9; i++) { const x = 20.9 + i * 3.15; g.c(x, 53 + 1.8 * (1 - ((x - 35) / 14.2) ** 2), 1.75, lt(a, .3)); }
      });
      // the cliff on its back
      const rock = g.p([17, 41.5, 15.5, 33, 19, 26.5, 18, 20.5, 24, 15.5, 33, 16.5, 38, 13.5, 46, 15, 51, 21.5, 50, 28.5, 54, 34.5, 52.5, 41.5, 35, 44.5], c, { mat: 'stone' });
      g.on(rock, () => {
        g.p([19, 26.5, 18, 20.5, 24, 15.5, 33, 16.5, 30, 23, 24, 27.5], d);
        g.p([33, 16.5, 38, 13.5, 46, 15, 43, 21, 36, 22], lt(d, .25));
        g.p([30, 23, 36, 22, 43, 21, 45, 29, 38, 33, 29, 31.5], d);
        g.l(16, 33.5, 29, 31.5, .4, dk(c, .3)); g.l(29, 31.5, 38, 33, .4, dk(c, .3)); g.l(38, 33, 53.5, 34.5, .4, dk(c, .3));
        g.l(24, 27.5, 30, 23, .4, dk(c, .3)); g.l(43, 21, 50.5, 21.5, .4, dk(c, .3));
      });
      // turf and sea-thrift on the cliff top
      K2.ruff(g, 33.5, 16.8, 10.5, 3.4, e, 13, .3, -152, -28);
      if (!g.small) for (const [x, y] of [[26.5, 11.8], [32, 9.6], [38.5, 9.4], [44, 12]]) { g.l(x, y + 1, x + .3, y + 4.6, .4, dk(e, .2)); g.c(x, y, 1.5, f); }
      // barnacles and bladderwrack
      for (const [x, y, r] of [[24, 37.4, 2.1], [28.4, 38.6, 1.5], [46.4, 38, 1.9], [40.5, 26, 1.7], [35.4, 38.8, 1.3]]) barnacle(g, x, y, r, k, mix(c, h, .6));
      const weed = g.tube([49, 24, 52.5, 29, 51, 35, 54.5, 40, 53.5, 45], 1.5, 1, e);
      g.tube([46, 27, 47.6, 32.5, 45.6, 37, 47, 41], 1.3, .9, dk(e, .12));
      g.on(weed, () => { g.c(52.4, 29.4, 1, lt(e, .4)); g.c(51.4, 35.4, 1, lt(e, .4)); });
      // eyes glaring out from under the overhang
      g.eye(29, 47.6, 3.1, 'angry', { iris: '#f2c23a', lid: a, side: -1 });
      g.eye(40.4, 47.2, 2.7, 'angry', { iris: '#f2c23a', lid: a, side: 1 });
      g.mo('frown', 34, 53.2, 3.6);
      // the great claw, crusted with rock
      g.l(22, 48, 16, 47, 3.2, a);
      const f1 = g.p([3.8, 43, 2.6, 34.5, 5.5, 26.5, 12.5, 20.5, 11.2, 27.5, 9.6, 33, 11, 40], a);
      const f2 = g.p([12.5, 40, 12.8, 33.5, 14.2, 27, 15.6, 22.5, 19.5, 27.5, 20.2, 35, 19.5, 42], a);
      g.on([f1, f2], () => { g.c(11.6, 21.5, 4.2, h); g.c(16.2, 23, 3.6, h); });
      const palm = g.e(11.8, 46.4, 8.8, 8.2, a);
      g.on(palm, () => { g.p([1, 50, 5.5, 42.5, 12, 43.5, 17.5, 49.5, 13, 55.5, 4, 55], c); g.l(5.5, 42.5, 9.5, 48.5, .4, dk(c, .3)); g.l(9.5, 48.5, 17.5, 49.5, .4, dk(c, .3)); });
      barnacle(g, 7.6, 50.6, 1.7, k, mix(c, h, .6));
    }
  });
  // ---------------------------------------------------------------- Jellop
  BEAST('jellop', {
    pal: { a: '#bcaef2', b: '#eee9ff', c: '#8676cc', d: '#ff94c2' }, keep: ['b'], sh: 150,
    draw(g) {
      const { a, b, c, d } = g.P;
      const OC = mix(c, '#241a4a', .5), A = -10, R = rotP(31, 31, A);
      const path = pts => { const out = []; for (let i = 0; i < pts.length; i += 2) out.push(...R(pts[i], pts[i + 1])); return out; };
      // thin stinging tentacles trailing from the rim
      for (const [x, sw, len] of [[19.5, -1, 12], [23.5, 1, 16.5], [39, -1, 16.5], [43, 1, 11.5]])
        g.tube(path([x, 41, x + sw * 1.3, 41 + len * .35, x - sw * 1.1, 41 + len * .7, x + sw * .8, 41 + len]), .75, .5, c, { oc: OC });
      // frilly oral arms
      for (const [x, sw, len] of [[27.4, -1, 13], [35, 1, 12], [31.2, 1, 16.5]])
        g.tube(path([x, 42, x + sw * 1.5, 42 + len * .33, x - sw * 1.1, 42 + len * .66, x + sw * 1.1, 42 + len]), 2, 1.1, b, { oc: OC, gloss: true });
      // the bell
      const bell = g.re(31, 31, 14.6, 12.6, A, a, { gloss: true, oc: OC });
      g.on(bell, () => {
        g.re(...R(31, 41.5), 14, 5.6, A, c);
        for (let i = 0; i <= 7; i++) { const x = 19.1 + i * 3.4; g.c(...R(x, 36.6 + 1.5 * (1 - ((x - 31) / 12) ** 2)), 1.7, b); }
        // four rings like a clover: you can see right into it
        for (const [x, y] of [[26.4, 22.4], [34.2, 22], [28.6, 27.2], [36.4, 26.8]]) { g.re(...R(x, y), 3, 2.3, A, d); g.re(...R(x, y), 1.5, 1.05, A, a); }
      });
      g.eye(...R(24.6, 32.4), 2.3, 'happy'); g.eye(...R(35.4, 32.2), 2.1, 'happy');
      g.mo('smile', ...R(30.4, 35.6), 2.2);
      g.blush(...R(21.6, 34.6), 1.5); g.blush(...R(38.6, 34.2), 1.4);
    }
  });

  // ---------------------------------------------------------------- Menajelly
  BEAST('menajelly', {
    pal: { a: '#ea7c52', b: '#ffd4a6', c: '#a8432f', d: '#b257d4', e: '#ffe6c8' }, keep: ['b', 'e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const m2 = mix(a, c, .4), face = mix(a, b, .5), CX = 24, CY = 27;
      // long stinging tentacles: longer than a bus
      for (const [pts, col, r] of [
        [[38, 34, 47, 33, 53, 25.5, 60.5, 25], c, 1.4], [[40, 41, 49, 43.5, 55, 38, 61, 40.5], a, 1.5], [[40, 45, 48, 51, 55, 48.5, 61, 53], b, 1.6],
        [[37, 48, 43, 55.5, 51, 55.5, 57, 60.5], a, 1.5], [[32, 49, 35.5, 56.5, 42.5, 58, 45.5, 61.5], c, 1.4], [[26, 49, 27, 55.5, 32.5, 58.5, 33, 61.5], b, 1.4], [[18.5, 46, 16, 52.5, 19.5, 57, 18, 61.5], a, 1.3]]) {
        const id = g.tube(pts, r, r * .6, col);
        g.on(id, () => g.c(pts[pts.length - 2], pts[pts.length - 1], 2.6, d));
      }
      // the mane: thick shaggy locks streaming back from the bell
      g.fur(30, 32, 16, 15, c, { n: 15, amp: .14, mat: 'fur' });
      const lock = (ang, len, col, r, sw = 1) => { const f = loc(CX, CY, ang); return g.tube([...f(10, 0), ...f(10 + len * .36, 2.2 * sw), ...f(10 + len * .7, -1.5 * sw), ...f(10 + len, 1.2 * sw)], r, r * .4, col, { mat: 'fur', taper: t => t ** 2.2 }); };
      for (const [ang, len, col, r, sw] of [[38, 10, c, 3.4, 1], [84, 13, c, 3.8, -1], [128, 13, c, 4, 1], [172, 13, c, 4, -1], [216, 11, c, 3.6, 1], [250, 7, c, 3, -1],
        [61, 12, m2, 3.6, -1], [106, 14, m2, 3.9, 1], [150, 14, m2, 4, -1], [194, 13, m2, 3.8, 1], [234, 9, m2, 3.3, -1],
        [73, 7, a, 3, 1], [118, 8, a, 3.2, -1], [162, 8, a, 3.2, 1], [206, 7, a, 3, -1]]) lock(ang, len, col, r, sw);
      // the bell: an eight-lobed disc, worn like a lion's face
      const lobes = [];
      g.group(() => { for (let i = 0; i < 8; i++) lobes.push(g.c(...K.pt(CX, CY - .5, i * 45 + 22, 10.6), 4.3, face, { depth: 2.2 })); lobes.push(g.e(CX, CY - .5, 12, 11.6, face, { depth: 2.6, gloss: true })); });
      g.on(lobes, () => {
        for (let i = 0; i < 8; i++) g.c(...K.pt(CX, CY - .5, i * 45 + 22, 11.6), 1.5, a);
        if (!g.back) g.p([18.6, 21.6, 19.6, 16.6, 22, 19.8, 24, 15.6, 26, 19.8, 28.4, 16.6, 29.4, 21.6], d);
      });
      g.eye(18.8, 27.8, 3.5, 'sharp', { iris: '#f09a1c', side: -1, brow: 1 });
      g.eye(29.2, 27.4, 3.1, 'sharp', { iris: '#f09a1c', side: 1, brow: 1 });
      g.mo('fangs', 23.4, 33.8, 5);
    }
  });
  // ---------------------------------------------------------------- Sealby
  BEAST('sealby', {
    pal: { a: '#f7f7f3', b: '#d6dce8', c: '#2b2b3b', d: '#ffb2c2', e: '#9fabbf' }, keep: ['a', 'c', 'd'], sh: 170,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const W = { mat: 'fur', dk: '#cbd3e3' };
      // hind flippers held up: the banana pose
      g.p([50.5, 45, 48.6, 38.6, 49.6, 33.6, 51.6, 37, 53.2, 32.6, 55, 37.4, 55.6, 44], far(e, .22));
      g.p([53, 46, 52.4, 39.6, 54.4, 34.6, 56, 38.4, 58, 34.4, 59.4, 38.6, 61, 37.2, 60.4, 43, 57.6, 47.4], e);
      // body
      const body = g.tube([24, 46, 31, 51.4, 41, 52.4, 49.6, 48.6, 54.4, 43.6], 9.2, 3.8, a, W);
      g.fur(37.5, 47, 12.5, 7.6, a, { n: 15, amp: .13, a0: -168, a1: -12, ...W, line: false });
      K2.spots(g, body, [[46.5, 46.4, 1.5], [50.4, 44.6, 1.2], [43.4, 49.6, 1.1]], mix(b, e, .5));
      // fore flipper
      const ff = g.re(29.4, 57.4, 6.6, 2.6, -14, mix(a, b, .6), { dk: '#b9c2d6' });
      g.on(ff, () => { g.l(25, 57.4, 23.4, 59.6, .35, e); g.l(27.6, 58.4, 26.4, 60.6, .35, e); });
      // head: a fluffy hood of fur with the face peeking out
      const head = g.fur(19.5, 38, 11.4, 10.8, a, { n: 15, amp: .13, ...W });
      if (!g.back) g.on(head, () => { g.e(17.2, 39.6, 8.4, 7.6, b); g.e(13.6, 43.4, 4.8, 3.2, lt(b, .55)); });
      g.eye(14, 38.2, 3.8, 'cute', { iris: '#4a6ab4', side: -1 });
      g.eye(23, 37.6, 3.4, 'cute', { iris: '#4a6ab4', side: 1 });
      flat(g, F => { for (const [x, y] of [[12.2, 33.4], [14.6, 32.6], [21.6, 32.2], [24, 32.8], [10.4, 44.6], [12.4, 46], [16.4, 45.6]]) F.fe(x, y, .45, .45, '#6f7890'); });
      g.nose(11.4, 41.6, 'button', { s: 1.15 });
      g.mo('cat', 12.8, 44.6, 3.2);
      g.whiskers(9.4, 43.4, -1, 2, 3.6, '#aab2c4');
      g.blush(18.4, 43, 1.7); void d;
    }
  });

  // ---------------------------------------------------------------- Selkara
  BEAST('selkara', {
    pal: { a: '#8c9aab', b: '#e0e8f0', c: '#4b5b6c', d: '#57a878', e: '#f2b8da', f: '#b494f2' }, keep: ['b', 'e'], sh: 170,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const rim = dk(a, .34);
      // kelp streamers tied to the hood
      g.tube([35, 13, 43, 14, 48, 20, 55, 21, 59, 27], 1.9, 1, d);
      g.tube([35, 17, 41, 21, 45, 28, 51, 31, 53, 38], 1.7, .9, dk(d, .16));
      // tail and hind flippers
      g.tube([36, 54, 45, 57.5, 52, 56], 4.6, 2.6, a);
      g.p([50, 54, 55.5, 47.5, 58, 50.5, 61, 49, 60, 55, 55, 58], c);
      g.p([50.5, 57, 56, 56, 61, 58.5, 59, 61.5, 54, 60, 51, 60.4], dk(c, .12));
      // the sealskin, worn as a cloak
      const cloak = g.fur(28, 40.5, 15.2, 19.5, a, { n: 20, amp: .09, a0: 24, a1: 156, mat: 'fur' });
      K2.spots(g, cloak, [[36, 30, 2.1, 1.7], [40.4, 37, 1.7], [36.6, 44, 2.2, 1.8], [41, 49.5, 1.6], [34.4, 53, 1.7], [31.6, 37, 1.3], [16.4, 51, 1.4]], c);
      K2.spots(g, cloak, [[36, 30, .9, .7], [36.6, 44, 1, .8]], lt(a, .3));
      g.on(cloak, () => { g.e(22.6, 45, 7.4, 15.4, rim); g.e(22.4, 45.4, 6.2, 14.4, b); });
      // fore flippers cradling a moon pearl
      g.tube([16.4, 37.6, 17.6, 41.6, 20.4, 43.6], 1.9, 1.5, b);
      g.tube([28.4, 37.2, 27.4, 41.4, 24.4, 43.6], 1.9, 1.5, b);
      g.c(22.4, 40.2, 3.7, f, { mat: 'glow' });
      g.on([g.c(22.4, 40.2, 3.7, f, { mat: 'glow' })], () => g.c(21.4, 39.2, 2.2, lt(f, .6)));
      // hood
      g.p([30, 8, 39.5, 4.6, 37, 12.6], a);
      const hood = g.e(25.6, 17.6, 12.6, 11.6, a, { mat: 'fur' });
      K2.spots(g, hood, [[33.4, 11.6, 1.9, 1.5], [35.4, 18.6, 1.6], [31, 25, 1.4], [27, 8.4, 1.2]], c);
      if (!g.back) g.on(hood, () => { g.e(21.8, 19.4, 9.4, 8.8, rim); g.e(21.4, 19.8, 8.4, 7.8, b); });
      // shell clasp and forehead gem
      g.c(22.6, 29.8, 2.3, e, { gloss: true });
      g.c(21.8, 11.6, 1.7, f, { gloss: true });
      g.eye(17.6, 19.4, 3, 'sleepy', { iris: '#9a6cf0', lid: b, side: -1, lash: true });
      g.eye(25, 19, 2.6, 'sleepy', { iris: '#9a6cf0', lid: b, side: 1, lash: true });
      g.nose(14.4, 22.6, 'button', { s: 1 });
      g.mo('cat', 16.4, 25.2, 3);
      g.blush(21.4, 23.6, 1.5);
    }
  });
})();