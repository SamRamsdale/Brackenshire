// ---- art/b5 ----
// ===== Batch b5: nettle-patch, millpond, hedgerow, marsh, harvest-field and dream Beasties =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // flat decorations that also show on the back view (sparkles, letters); skipped at tiny sizes
  const deco = (g, fn) => { if (!g.tiny) fn(g.feat); };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // rotated ellipse placed from a base point along an angle (ears, leaves, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
  // four-pointed sparkle star (solid part)
  const star4 = (g, x, y, r, col, o) => g.p([x, y - r, x + r * .3, y - r * .3, x + r, y, x + r * .3, y + r * .3, x, y + r, x - r * .3, y + r * .3, x - r, y, x - r * .3, y - r * .3], col, { bevel: .5, ...o });
  // toothed leaf (nettle, dandelion): teeth per side n, depth 0..1
  const toothLeaf = (g, x, y, ang, L, W, col, o = {}) => {
    const n = o.n || 6, depth = o.depth ?? .24, pw = o.pw ?? .7, pts = [0, 0], back = [], bite = o.bite;
    for (let k = 1; k < n * 2; k++) {
      const t = k / (n * 2), w = W * Math.sin(Math.PI * Math.pow(t, pw)) * (k % 2 ? 1 : 1 - depth), u = L * t - (k % 2 ? 0 : L / (n * 4));
      const nb = bite && t > bite[0] && t < bite[1] ? 1 - bite[2] * Math.sin(Math.PI * (t - bite[0]) / (bite[1] - bite[0])) : 1;
      pts.push(u, w); back.unshift(u, -w * nb);
    }
    pts.push(L, 0, ...back);
    const id = g.p(poly(x, y, ang, pts), col, o.opt || {});
    if (o.vein) g.on(id, () => { const f = loc(x, y, ang); g.l(...f(0, 0), ...f(L * .9, 0), .4, o.vein); if (!g.small) for (let k = 1; k < n; k++) { const u = L * k / n; g.l(...f(u - L * .08, 0), ...f(u + L * .06, W * .6), .3, o.vein); g.l(...f(u - L * .08, 0), ...f(u + L * .06, -W * .6), .3, o.vein); } });
    return id;
  };
  // peacock-style eyespot painted onto parts: dark rim, cream ring, blue iris, dark pupil
  const eyespot = (g, ids, x, y, r, rim, ring, iris, pupil, o = {}) => {
    const q = o.sq || 1;
    // marks only land on pixels the listed parts still own, so paint the centre first and work outwards
    g.on(ids, () => { g.e(x + r * .14, y + r * .1, r * .36, r * .4 * q, pupil); g.e(x + r * .05, y + r * .04, r * .7, r * .7 * q, iris); g.e(x, y, r, r * q, ring); if (rim) g.e(x, y, r * 1.24, r * 1.24 * q, rim); });
    if (!g.small) g.dot(x - r * .2, y - r * .28, .5, '#ffffff');
  };

  // a little "z" of sleep
  const zed = (g, x, y, s, col) => deco(g, F => { F.fl(x, y, x + s, y, .42, col); F.fl(x + s, y, x, y + s, .42, col); F.fl(x, y + s, x + s, y + s, .42, col); });

  // ---------------------------------------------------------------- Crawlie
  BEAST('crawlie', {
    pal: { a: '#96d25a', b: '#e4f6aa', c: '#3f8242', d: '#f8ecb8', e: '#4a86e0', f: '#3a2a38', h: '#4c9c5a' }, keep: ['d', 'f', 'h'], sh: -62,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      // body segments, tail first; each carries a false eye on its flank and stinging bristles on top
      const segs = [[56.6, 56.2, 3.8], [51, 54.6, 5.6], [43.2, 53, 6.6], [35.4, 51, 7.2], [30, 44.6, 6.6], [27, 38.4, 6]];
      segs.forEach(([x, y, r], i) => {
        for (const ang of (i === 0 ? [8, 50] : i < 4 ? [-20, 26] : [50, 90])) { const [bx, by] = K.pt(x, y, ang, r - 1.2); K2.ear(g, bx, by, ang, i ? 4.2 : 3.4, 1.3, c); }
        if (i > 0 && i < 4) g.e(x - .5, 59.6, 2.4, 1.8, c);
        const s = g.e(x, y, r, r, a);
        if (i > 0 && i < 4) eyespot(g, s, x + r * .3, y - r * .18, r * .52, null, d, e, f);
        g.on(s, () => g.e(x - r * .3, y + r * .8, r * .95, r * .5, b));
      });
      // nettle leaf held in the front legs, with a bite out of it
      toothLeaf(g, 11.5, 58.5, 21, 21.5, 6.4, h, { n: 5, vein: dk(h, .3), bite: [.42, .86, .62] });
      for (const [x, y] of [[21, 41.6], [22, 45.8], [24, 49.8]]) g.e(x, y, 1.9, 1.4, a);
      // head with a little mohawk of bristles
      for (const [x, y, ang] of [[19.5, 24, -16], [23, 23, 4], [26.5, 23.6, 22]]) K2.ear(g, x, y, ang, 4.2, 1.3, c);
      for (const [x0, y0, x1, y1] of [[16.5, 25.5, 13, 19.5], [28.5, 24.5, 31, 18.5]]) { g.tube([x0, y0, (x0 + x1) / 2 - .6, (y0 + y1) / 2, x1, y1], .8, .6, f); g.c(x1, y1 - .6, 1.6, d); }
      const head = g.e(22.5, 31.5, 10, 9.2, a);
      if (!g.back) g.on(head, () => g.e(18, 35.5, 7.5, 5, b));
      g.eye(17.2, 31, 3.6, 'bead'); g.eye(26.4, 30.4, 3.1, 'bead');
      g.mo('open', 17.6, 35.6, 4.2, { h: 3 });
      g.blush(12.6, 35, 1.7); g.blush(29.4, 34.4, 1.6);
    }
  });

  // ---------------------------------------------------------------- Cocoonle
  BEAST('cocoonle', {
    pal: { a: '#c8bc82', b: '#efeac2', c: '#8c8454', d: '#6e4c2e', e: '#4a86e0', f: '#f2cc40', h: '#d2443a', k: '#3a2a38' }, keep: ['d', 'f', 'k'], sh: -62,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      // twig and silk thread
      g.tube([4, 9.5, 18, 6.5, 38, 7.5, 60, 4], 1.8, 1.2, d, { mat: 'stone' });
      g.tube([44, 6.6, 48, 4.5, 51, 2.5], .9, .6, d);
      K.leaf(g, 13, 7, -60, 7, 2.6, '#4c9c5a', '#2f6e3c');
      g.l(32, 9, 32, 16, .45, '#f6f6ee', { oc: '#9a9ab2', shade: false });
      // ringed tail end at the top, round head end at the bottom
      let top, body;
      g.group(() => {
        top = g.tube([32, 17, 31.8, 22, 31.5, 28], 2.6, 7, a);
        body = g.e(31.5, 42, 12.2, 14.2, a);
      });
      K2.stripes(g, top, 24, 17, 40, 27, 4, 3, .9, c);
      g.on([top], () => { for (const [x, y] of [[26.6, 25.4], [29.8, 26.2], [33.2, 26.3], [36.4, 25.6]]) g.c(x, y, 1.05, f); });
      // face window (paler shell)
      if (!g.back) g.on(body, () => g.e(29.5, 47, 9.6, 8.2, b));
      // wing cases folded down each side like a bonnet; the near one has gone clear before hatching
      const wl = g.p([29, 28.5, 24, 30, 19.6, 36, 18.8, 43, 20.4, 48.5, 22.5, 42.5, 26.5, 36.5, 31, 33.5], dk(a, .08));
      const wr = g.p([31, 28.5, 38, 29.5, 43.2, 35, 44.2, 43, 42.6, 50.5, 39.5, 53.5, 39.8, 45, 37, 38.5, 31, 33.5], mix(h, a, .32));
      void wl;
      eyespot(g, wr, 39.6, 37.2, 2.9, k, '#f8ecb8', e, k);
      g.on(wr, () => { g.l(33, 31, 41.5, 49, .35, mix(h, k, .45)); g.l(33, 31, 43.5, 41.5, .35, mix(h, k, .45)); });
      // little head horns pointing down like dangling toes
      K2.ear(g, 27.5, 55, 190, 3.6, 1.5, a); K2.ear(g, 34.5, 55.2, 172, 3.6, 1.5, a);
      // dreaming of flying
      if (!g.small) {
        g.c(47.5, 28.5, 1.1, '#f4f0ff', { oc: '#8a86b0' }); g.c(50.2, 25.2, 1.7, '#f4f0ff', { oc: '#8a86b0' });
        const cl = g.fur(55, 18.5, 5.6, 4.8, '#f4f0ff', { n: 7, amp: .16, oc: '#8a86b0', dk: '#d8d2f0' });
        g.on(cl, () => { g.p([55, 18.8, 51.6, 15.6, 52, 19.6], h); g.p([55, 18.8, 58.4, 15.6, 58, 19.6], h); g.p([55, 18.8, 52.6, 21.6, 54.4, 21.2], h); g.p([55, 18.8, 57.4, 21.6, 55.6, 21.2], h); g.l(55, 17.2, 55, 21, .4, k); });
      }
      g.eye(25.6, 45.6, 2.7, 'happy'); g.eye(33.2, 45.2, 2.4, 'happy');
      g.mo('smile', 29, 49.6, 3);
      g.blush(22.8, 48.6, 1.6); g.blush(36, 48.2, 1.5);
    }
  });

  // ---------------------------------------------------------------- Flutterbye
  BEAST('flutterbye', {
    pal: { a: '#d2443a', b: '#3a2a38', c: '#f8ecb8', d: '#4a86e0', e: '#f6dcea', f: '#f2cc40' }, keep: ['c', 'e'], sh: -62,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .26), fb = far(b, .2);
      const wing = (pts, col, rim, root, spots, veins) => {
        const id = g.p(pts, col, { bevel: 1.6 });
        for (const [x, y, r] of spots) eyespot(g, id, x, y, r, mix(col, b, .8), col === a ? c : far(c, .2), col === a ? d : far(d, .2), b);
        g.on(id, () => {
          for (let i = 0; i + 3 < rim.length; i += 2) g.l(rim[i], rim[i + 1], rim[i + 2], rim[i + 3], 1.5, mix(col, b, .78));
          for (const [x, y] of veins) g.l(root[0], root[1], x, y, .32, mix(col, b, .35));
          g.e(root[0], root[1], root[2], root[3], mix(col, b, .5));
        });
        return id;
      };
      // far wings
      wing([23, 37, 14, 34, 7, 35, 4, 39.5, 5, 45, 8, 47.5, 9, 52, 13, 50.5, 16, 54.5, 19.5, 50, 23.5, 44], fa, [7, 35, 4, 39.5, 5, 45, 8, 47.5, 9, 52, 13, 50.5, 16, 54.5, 19.5, 50], [23, 39, 4, 4], [[11.5, 42, 3.1]], [[8, 37], [7, 46], [14, 52]]);
      wing([24, 30, 18, 19, 10, 9, 4, 6.5, 2.5, 9.5, 4.5, 14, 3.5, 18, 6.5, 21, 6, 25, 10, 27.5, 18, 31.5, 23, 34.5], fa, [4, 6.5, 2.5, 9.5, 4.5, 14, 3.5, 18, 6.5, 21, 6, 25, 10, 27.5], [23, 31, 4.5, 4], [[9.5, 15.5, 3.7]], [[6, 10], [5, 19], [9, 26]]);
      // near wings
      wing([31, 35.5, 42, 33, 53, 32.5, 58.5, 36, 59, 42, 56, 46, 56, 50, 52, 53, 49, 51.5, 46, 56, 42.5, 54, 39, 57, 35.5, 52, 32, 46], a, [53, 32.5, 58.5, 36, 59, 42, 56, 46, 56, 50, 52, 53, 49, 51.5, 46, 56, 42.5, 54, 39, 57, 35.5, 52], [31, 39, 5, 4.5], [[49.5, 42, 4.2]], [[56, 38], [54, 49], [43, 54]]);
      wing([30, 30, 38, 17, 48, 7, 58, 3.5, 61.5, 7, 59.5, 13, 60.5, 17, 57.5, 21, 58, 25, 54, 28, 46, 31, 36, 35, 31, 35.5], a, [58, 3.5, 61.5, 7, 59.5, 13, 60.5, 17, 57.5, 21, 58, 25, 54, 28, 46, 31], [31, 32, 5.5, 4.5], [[51.5, 14, 5]], [[55, 6], [58, 16], [52, 27]]);
      // abdomen with cream bands
      const ab = g.tube([28.5, 40, 29.5, 47, 32, 53, 33.5, 57], 3.3, 1.2, b, { mat: 'fur' });
      K2.stripes(g, ab, 26, 42, 36, 58, 20, 3.2, 1, c);
      g.fur(27, 36.5, 5.2, 5.6, b, { n: 10, amp: .22, mat: 'fur' });
      // lace ruff and head
      K2.ruff(g, 26, 31.8, 6.8, 3.4, c, 10, .3);
      g.tube([21.5, 18, 18.5, 12, 13, 9.5], .7, .55, b); g.c(12, 9, 1.7, f, { gloss: true });
      g.tube([28, 17.5, 29.5, 10.5, 34.5, 7.5], .7, .55, b); g.c(35.4, 7, 1.7, f, { gloss: true });
      const head = g.e(24.5, 23.6, 8, 7.4, e);
      g.on(head, () => g.back ? g.e(25.5, 20.5, 8.4, 6, b) : g.e(27.5, 16.6, 6.5, 2.4, b));
      g.eye(20.4, 24.4, 2.6, 'round', { iris: '#b050d8', side: -1, lash: true, look: -.4 });
      g.eye(27.8, 24, 2.2, 'round', { iris: '#b050d8', side: 1, look: -.4 });
      g.mo('smile', 23.4, 28.6, 2.4);
      g.blush(17.8, 27.6, 1.4); g.blush(30.6, 27, 1.3);
    }
  });
  // ---------------------------------------------------------------- Tadlet
  BEAST('tadlet', {
    pal: { a: '#5a9c7c', b: '#e8f0c2', c: '#2c5c4c', d: '#b0e6d2', e: '#f2b830' }, keep: ['b'], sh: -105,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      // tail flicked up: a see-through fin around a muscular core
      g.tube([37, 50, 46, 55, 55, 50.5, 57.5, 40, 52, 31.5], 6.4, 2.6, d, { mat: 'gloss', oc: dk(d, .5) });
      const tail = g.tube([36, 49.5, 45.5, 53.8, 54, 49.8, 56, 40.5, 51.8, 33.5], 4.2, 1, a);
      K2.spots(g, tail, [[46, 53.5, 1.1], [52.5, 50, .9], [55.6, 44, .8]], c);
      // hind legs just budding
      g.e(37.5, 58.4, 3.4, 1.9, far(a, .22));
      // body with eye bumps
      let body, b1, b2;
      g.group(() => { body = g.e(25, 46.5, 14, 12.2, a); b1 = g.c(16.5, 35.4, 5.4, a); b2 = g.c(30, 34, 5, a); });
      g.on(body, () => g.e(20.5, 52.5, 11, 7, b));
      K2.spots(g, [body], [[33.5, 41.5, 1.6], [37, 47, 1.3], [31, 45.5, 1], [26.5, 40, 1.1]], c);
      g.e(30.5, 58.6, 3.6, 2, a);
      void b1; void b2;
      // bubbles
      if (!g.small) for (const [x, y, r] of [[7.6, 39.5, 1.3], [6.6, 32, 1.9], [10.5, 23.5, 2.7]]) g.c(x, y, r, '#e6f8ff', { gloss: true, oc: '#6fa8d0' });
      g.eye(16.5, 35.8, 3.9, 'cute', { iris: e, side: -1 });
      g.eye(30, 34.4, 3.5, 'cute', { iris: e, side: 1 });
      g.nose(13.2, 43.6, 'nostrils', { s: .6 });
      g.mo('smile', 17.5, 47.4, 9);
      g.blush(10.4, 47, 1.7); g.blush(28.5, 47.6, 1.7);
    }
  });

  // ---------------------------------------------------------------- Frogley
  BEAST('frogley', {
    pal: { a: '#5cb078', b: '#f2ecb4', c: '#2a6a50', d: '#f4c63c', e: '#ffeaa4' }, keep: ['b'], sh: -105,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .28);
      // far hind leg
      g.re(47, 51, 7.4, 5.4, 25, fa); g.e(51, 59.4, 6.4, 2, fa);
      // body, sitting upright and leaning back to sing
      const body = g.re(37, 43.5, 12, 14, -14, a);
      g.on(body, () => g.re(31, 46, 7.6, 12, -14, b));
      K2.spots(g, [body], [[45, 36, 1.6], [47.5, 42, 1.2], [42.5, 31.5, 1.1]], c);
      // near hind leg folded, long webbed foot
      const thigh = g.re(46, 52.5, 9, 6.2, 18, a);
      K2.stripes(g, thigh, 38, 46, 55, 58, 62, 4, 1.2, c);
      const foot = g.e(39.5, 59.3, 9, 2.3, a);
      g.on(foot, () => g.e(39.5, 60.4, 9, 1.2, c));
      // front legs planted
      g.tube([25, 44, 22.5, 52, 21.5, 57.6], 2.5, 2, fa); g.e(19.8, 59.2, 3.6, 1.9, fa);
      g.tube([31.5, 41, 30.5, 50, 29.5, 57.4], 2.9, 2.3, a);
      g.e(27.6, 59.2, 4.2, 2.1, a);
      for (const [x, y] of [[24, 59.8], [26.4, 60.8], [29.4, 61]]) g.c(x, y, 1.15, lt(a, .3));
      // head tipped up
      let head;
      g.group(() => { head = g.re(27, 24.5, 13, 9, -10, a); g.c(21.5, 15.8, 5.3, a); g.c(33.6, 14.4, 4.9, a); });
      if (!g.back) g.on(head, () => g.re(24, 29.6, 11, 3.4, -8, b));
      K2.spots(g, [head], [[37.5, 24.5, 1.5], [34.5, 27.5, 1]], c);
      // throat sac swollen with song
      const sac = g.e(20, 36.4, 9.4, 8.6, e, { gloss: true });
      g.on(sac, () => { g.l(13.6, 37.5, 16.6, 43.4, .35, dk(e, .16)); g.l(18, 30.4, 19.5, 44.8, .35, dk(e, .16)); g.l(23.5, 30, 24.5, 44, .35, dk(e, .16)); });
      // notes
      deco(g, F => { const n = '#2c3a5e'; for (const [x, y] of [[6.5, 25], [12.5, 12.5], [4.5, 44]]) { F.fe(x, y, 1.6, 1.25, n); F.fl(x + 1.35, y, x + 1.35, y - 5, .42, n); F.fl(x + 1.35, y - 5, x + 3.2, y - 3.8, .5, n); } });
      g.eye(21.5, 16, 3.3, 'round', { iris: '#f09a20', side: -1, look: -.2 });
      g.eye(33.6, 14.6, 2.9, 'round', { iris: '#f09a20', side: 1, look: -.2 });
      g.nose(14.6, 21.6, 'nostrils', { s: .7 });
      flat(g, F => F.fchain([14.4, 25.8, 18.5, 28, 25, 29, 32, 28.4, 37.8, 26.2], .5, '#1b1328'));
    }
  });

  // ---------------------------------------------------------------- Toadwarden
  BEAST('toadwarden', {
    pal: { a: '#3f8a6c', b: '#ece2a8', c: '#20483c', d: '#f2b838', e: '#8acc50', f: '#8a5a30', h: '#ffb4cc', k: '#4c9a48' }, keep: ['b', 'f', 'h'], sh: -105,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const fa = far(a, .3), root = mix(f, c, .45);
      // bulrush mace held upright in the far hand
      g.l(55, 60.5, 54.2, 4, .85, k);
      K.leaf(g, 55, 58, 14, 24, 1.8, k, dk(k, .3));
      g.l(54.3, 10, 54.5, 21.5, 2.7, f, { mat: 'fur' });
      // far leg and rooted foot
      g.l(43.5, 48, 46, 57, 5.2, fa);
      g.tube([47, 59.6, 52, 60.4, 56, 59.8], 1.2, .5, root); g.e(46.5, 59.4, 6.2, 2.3, fa);
      // far arm
      g.tube([44, 29, 50.5, 32.5, 54.5, 30.5], 4, 3.2, fa); g.e(54.8, 29.6, 3.3, 3, fa);
      // body
      const body = g.e(33, 40.5, 16.5, 16, a, { mat: 'stone' });
      g.on(body, () => g.e(27, 44.5, 11, 13, b));
      // pauldron of reed leaves over the shoulder
      for (const [ang, len] of [[168, 12], [142, 14], [116, 15], [92, 13]]) K.leaf(g, 40.5, 23.5, ang, len, 3, k, lt(k, .3));
      // near leg, toes rooting into the mud
      g.l(26, 51, 24.5, 57.5, 5.6, a);
      for (const pts of [[19, 59.8, 13.5, 60.8, 9, 60.2], [23, 60.4, 26, 61.2, 31, 60.6]]) g.tube(pts, 1.2, .5, root);
      g.e(22.5, 59.4, 7, 2.5, a);
      // head
      let head;
      g.group(() => { head = g.e(29, 20.5, 15.2, 9.8, a, { mat: 'stone' }); g.c(20.5, 12.8, 5.5, a, { mat: 'stone' }); g.c(35.6, 11.6, 5.1, a, { mat: 'stone' }); });
      if (!g.back) g.on(head, () => g.e(24, 28, 12.5, 4.6, b));
      K2.spots(g, [body, head], [[45, 36, 1.7], [47.5, 43, 1.3], [43, 48.5, 1.5], [41, 20, 1.3], [38, 25, 1], [44.5, 30.5, 1]], dk(a, .25));
      // near arm and lily-pad shield
      g.tube([23, 32, 16, 36.5, 14.5, 42], 4.4, 3.6, a);
      const cx = 14.5, cy = 45, pad = [cx - 1.2, cy - 2];
      for (let an = 318; an <= 642; an += 12) pad.push(cx + Math.sin(an * Math.PI / 180) * 11.4, cy - Math.cos(an * Math.PI / 180) * 12.6);
      const shield = g.p(pad, e, { bevel: 1.5 });
      g.on(shield, () => { for (let an = 0; an < 280; an += 40) g.l(cx, cy, cx + Math.sin(an * Math.PI / 180) * 10.4, cy - Math.cos(an * Math.PI / 180) * 11.6, .35, dk(e, .28)); });
      g.group(() => { for (let i = 0; i < 6; i++) blade(g, cx + .6, cy + 1.4, i * 60 + 8, 5.4, 1.9, h); });
      g.group(() => { for (let i = 0; i < 5; i++) blade(g, cx + .6, cy + 1.4, i * 72 + 36, 3.2, 1.3, '#fff6f8', { line: false }); });
      g.c(cx + .6, cy + 1.4, 1.3, d);
      for (const [x, y] of [[12.2, 33.4], [15.2, 32.6], [18, 33.2]]) g.c(x, y, 1.5, lt(a, .2));
      g.eye(20.5, 13.2, 3.1, 'angry', { iris: '#f08a1c', lid: a, side: -1 });
      g.eye(35.6, 12, 2.8, 'angry', { iris: '#f08a1c', lid: a, side: 1 });
      g.nose(13.6, 19.4, 'nostrils', { s: .8 });
      flat(g, F => F.fchain([14.5, 25.6, 19, 24, 29, 24.2, 38, 25.4, 42.5, 27.4], .5, '#1b1328'));
    }
  });
  // ---------------------------------------------------------------- Puffseed
  BEAST('puffseed', {
    pal: { a: '#fbfbf4', b: '#d6dac8', c: '#62ac4c', d: '#f2da96', e: '#c4925a', f: '#fff8e0' }, keep: ['a', 'b', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(d, .22);
      // its own tail: a stem ending in a seed clock that catches every breeze
      g.tube([37.5, 40, 43, 36, 42.5, 29.5, 38.5, 25], 1.25, 1, c);
      const puff = g.fur(36.5, 15, 11, 10.4, a, { n: 18, amp: .2, dk: b, oc: '#7e8478' });
      g.on(puff, () => { g.c(36.5, 16.5, 2.8, mix(e, a, .3)); for (let i = 0; i < 12; i++) { const [x, y] = K.pt(36.5, 16.5, i * 30 + 15, 9); g.l(36.5, 16.5, x, y, .32, b); } });
      // loose seeds drifting off
      if (!g.small) for (const [x, y] of [[55, 27], [58.5, 12.5]]) { g.l(x, y + 1, x - .8, y + 5, .34, e, { oc: '#8e8a78' }); g.fur(x, y, 2.4, 1.7, a, { n: 5, amp: .35, a0: -180, a1: 0, oc: '#7e8478' }); }
      // far legs dangling
      g.tube([28.5, 47, 28.6, 52, 28.2, 55], 2, 1.7, fa); g.tube([38, 43, 39, 47.5, 38.8, 51], 2, 1.7, fa);
      // body hangs by the tail, rump up
      const body = g.re(31.5, 43.5, 8.2, 5.8, -22, d);
      g.on(body, () => g.re(30, 46.6, 6.5, 2.8, -22, f));
      // near legs with seed-brown paws
      g.tube([25.5, 48, 24.6, 53, 24.2, 56], 2.2, 1.8, d); g.e(24, 57, 2.5, 2.1, e);
      g.tube([35, 45, 35.8, 49.5, 35.4, 52.6], 2.2, 1.8, d); g.e(35.2, 53.6, 2.5, 2.1, e);
      // collar of toothed leaves
      toothLeaf(g, 26.5, 40, 62, 8.5, 2.6, c, { n: 3, vein: dk(c, .3) });
      toothLeaf(g, 27, 42.5, 104, 7.5, 2.4, c, { n: 3, vein: dk(c, .3) });
      // head
      for (const [x, y, r] of [[14, 37.6, 3], [25.4, 36.2, 2.8]]) { const ear = g.c(x, y, r, d); g.on(ear, () => g.c(x + .2, y + .6, r * .55, e)); }
      const head = g.e(20.5, 44.5, 8.8, 8.2, d);
      if (!g.back) g.on(head, () => g.e(15.5, 48, 5, 3.4, f));
      g.eye(16.8, 43.2, 2.6, 'round', { iris: '#3ea040', side: -1, look: -.5 });
      g.eye(24.4, 42.6, 2.2, 'round', { iris: '#3ea040', side: 1, look: -.5 });
      g.nose(14.4, 46.6, 'pink', { s: .7 });
      g.mo('o', 15.4, 49.4, 2.4);
      g.blush(20.4, 47.4, 1.4); g.blush(27, 46.4, 1.2);
    }
  });

  // ---------------------------------------------------------------- Dandelyon
  BEAST('dandelyon', {
    pal: { a: '#f6cc1e', b: '#f6e6a6', c: '#5aa448', d: '#dc9a12', e: '#b07a38', f: '#fbfbf4', h: '#d6dac8' }, keep: ['f', 'h'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(b, .22), seed = (x, y) => { g.l(x, y + 1, x - .8, y + 5, .34, e, { oc: '#8e8a78' }); g.fur(x, y, 2.4, 1.7, f, { n: 5, amp: .35, a0: -180, a1: 0, oc: '#7e8478' }); };
      // tail: a stem carrying a seed clock
      g.tube([51, 38, 57.5, 35, 60, 26, 57, 16.5], 1.4, 1.1, c);
      const puff = g.fur(55.5, 10.5, 6.2, 6, f, { n: 12, amp: .22, dk: h, oc: '#7e8478' });
      g.on(puff, () => { g.c(55.5, 11.4, 1.8, mix(e, f, .3)); for (let i = 0; i < 8; i++) { const [x, y] = K.pt(55.5, 11.4, i * 45 + 20, 5.2); g.l(55.5, 11.4, x, y, .32, h); } });
      // far legs
      g.tube([26.5, 44, 24.6, 51, 24, 58], 2.9, 2.4, fa); g.e(23.2, 59.4, 3.4, 1.8, far(e, .2));
      g.tube([46.5, 44, 47.8, 51, 47.6, 58], 2.9, 2.4, fa); g.e(47, 59.4, 3.4, 1.8, far(e, .2));
      // body: deep chest, lean flank
      let body, chest, hip;
      g.group(() => { body = g.re(39.5, 41, 13.6, 8.6, -5, b, { mat: 'fur' }); chest = g.e(29.5, 40.5, 8, 9, b, { mat: 'fur' }); hip = g.e(49, 42.5, 6.6, 7.4, b, { mat: 'fur' }); });
      g.on([body, chest], () => g.e(35, 48.6, 11, 2.6, lt(b, .45)));
      // leaf wing swept back from the shoulder
      toothLeaf(g, 35.5, 34.5, 56, 20, 4.8, c, { n: 5, depth: .42, vein: dk(c, .3) });
      // near legs
      g.tube([31, 46, 30, 52, 29.6, 58], 3.3, 2.7, b); g.e(29, 59.5, 3.9, 2.1, e); K2.toes(g, 28.4, 60.6, 3, 3.2, dk(e, .4));
      g.tube([50.5, 47, 52.6, 53, 51.6, 58], 3.1, 2.6, b, { line: false }); g.e(51, 59.5, 3.9, 2.1, e); K2.toes(g, 50.4, 60.6, 3, 3.2, dk(e, .4));
      void hip;
      // rosette of toothed leaves under the mane
      toothLeaf(g, 25.5, 36, 128, 11, 3, c, { n: 4, depth: .4, vein: dk(c, .3) });
      toothLeaf(g, 21, 38, 172, 9.5, 2.8, c, { n: 4, depth: .4, vein: dk(c, .3) });
      // mane of ray petals in three rings; the back of it has already gone to seed
      const mx = 20, my = 25;
      g.fur(mx, my, 14.2, 13.8, d, { n: 22, amp: .13, depth: 2, dk: '#b86e0e' });
      for (const [ang, r] of [[30, 13.6], [54, 14.4], [78, 13.6]]) { const [x, y] = K.pt(mx, my, ang, r); g.fur(x, y, 3.6, 3.4, f, { n: 7, amp: .3, dk: h, oc: '#7e8478' }); }
      if (!g.small) { seed(41, 7.5); seed(46.5, 15); }
      g.fur(mx, my, 11.6, 11.2, a, { n: 18, amp: .14, ph: .5, depth: 2, dk: '#dc9a12' });
      for (const [x, y, r] of [[12.4, 16.8, 3], [27, 15.8, 2.8]]) { const ear = g.c(x, y, r, b); g.on(ear, () => g.c(x + .2, y + .6, r * .55, e)); }
      g.fur(mx - .4, my + .4, 9.6, 9.2, lt(a, .4), { n: 14, amp: .14, depth: 2, dk: a });
      // face (from behind, the mane closes over the head)
      if (g.back) g.fur(mx - .6, my + .6, 6.6, 6.2, a, { n: 10, amp: .16, ph: .5, depth: 2, dk: '#dc9a12' });
      else { const head = g.e(19.2, 25.8, 8, 7.6, b); g.on(head, () => g.e(14.6, 29.4, 5.4, 3.8, lt(b, .5))); }
      g.eye(16, 23.8, 2.7, 'sharp', { iris: '#3ea040', side: -1, look: -.4 });
      g.eye(23.2, 23.2, 2.3, 'sharp', { iris: '#3ea040', side: 1, look: -.4 });
      g.nose(12.6, 27.4, 'tri', { s: .9 });
      g.mo('cat', 13, 30, 3.6);
      g.blush(18.6, 28, 1.5); g.blush(25, 27.2, 1.3);
    }
  });
  // ---------------------------------------------------------------- Wisplet
  BEAST('wisplet', {
    pal: { a: '#9af0e0', b: '#e8fff8', c: '#40b0ac', d: '#ffffff', e: '#ffe9a0' }, keep: ['d', 'e'], sh: 115,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const glow = { mat: 'glow' };
      // trailing wisp
      g.tube([33, 54, 38.5, 58.6, 45, 57.2, 47.2, 51.8], 3.4, .8, c, glow);
      // little beckoning hands
      K2.flame(g, 43.5, 46.5, 4.4, 2.3, 52, c, a, null);
      // flame body whose tip curls over like a pixie hood
      let body, curl;
      g.group(() => {
        curl = g.tube([29, 39, 29.5, 30, 35, 23, 42.5, 22.5, 46, 27.5, 43, 31.5], 7.6, 1, c, glow);
        body = g.e(29, 46.5, 12, 10.8, c, glow);
      });
      let m1, m2;
      g.on([body, curl], () => { m2 = g.e(28.6, 47, 9.8, 8.8, a, glow); m1 = g.tube([28.6, 40, 29.6, 31.5, 35, 25.5, 41.5, 24.8, 44.2, 28], 5.2, .6, a, glow); });
      g.on([m2], () => g.e(27.6, 47.8, 7.4, 6.6, b, glow));
      void m1;
      K2.flame(g, 15.6, 50.5, 4.8, 2.5, -48, c, a, null);
      // spark dangling from the tip, and stray sparks
      star4(g, 42.6, 35.4, 2.5, e, { mat: 'glow', oc: '#b08a3a' });
      void d;
      g.eye(23.4, 45.6, 3.5, 'cute', { iris: '#22b0a4', side: -1 });
      g.eye(32.2, 45.2, 3.1, 'cute', { iris: '#22b0a4', side: 1 });
      g.mo('tongue', 27.2, 50.6, 4.2);
      g.blush(19, 49.6, 1.6); g.blush(36, 49, 1.5);
    }
  });

  // ---------------------------------------------------------------- Wispwarden
  BEAST('wispwarden', {
    pal: { a: '#2e3e66', b: '#40b0ac', c: '#9af0e0', d: '#e8fff8', e: '#d0aa5a', f: '#5a6ea4', h: '#7a5a3c' }, keep: ['e', 'h'], sh: 115,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const glow = { mat: 'glow' }, dark = '#131a30';
      // lost souls following behind
      K2.flame(g, 54.5, 45, 6.4, 3.1, 12, b, c, d);
      K2.flame(g, 58.6, 31.5, 4.4, 2.2, -6, b, c, null);
      // mist where feet would be
      for (const [x, y, hh, ang] of [[19, 53, 7, 196], [27, 54, 8, 184], [35.5, 54, 8, 176], [43.5, 53, 7, 164]]) K2.flame(g, x, y, hh, 3.4, ang, b, c, null);
      // long cloak with a ragged hem
      const cloak = g.p([21, 27, 17.5, 38, 14.5, 49, 13.5, 55.5, 17.5, 53.6, 20.5, 57, 24.5, 54, 28.5, 57.6, 33, 54.4, 37, 57.6, 41, 54.2, 45, 57, 48.5, 53.4, 46.5, 42, 42.5, 31, 38, 25.5, 28, 24.5], a, { bevel: 2.6 });
      g.on(cloak, () => { for (const [x, y] of [[20, 48.5], [26, 50.5], [32.5, 49], [39, 50.6], [44, 47.5], [23.5, 43.5], [36, 44], [41.5, 41]]) g.c(x, y, .7, c); });
      // capelet with a gilt edge
      const cape = g.p([19.5, 31, 23, 25, 30, 22.5, 38, 23.5, 43.5, 28, 45.5, 34.5, 42, 37.5, 38, 35, 34, 38.5, 30, 35.5, 26, 38.5, 22.5, 35.5, 19.5, 37], f, { bevel: 1.6 });
      g.on(cape, () => { const hem = [19.5, 37, 22.5, 35.5, 26, 38.5, 30, 35.5, 34, 38.5, 38, 35, 42, 37.5, 45.5, 34.5]; for (let i = 0; i + 3 < hem.length; i += 2) g.l(hem[i], hem[i + 1], hem[i + 2], hem[i + 3], .7, e); });
      // crook with the lantern, held out ahead
      g.tube([15.5, 60.5, 15, 42, 14.6, 24, 13, 14, 9, 11, 6.6, 14.6], 1, .8, h);
      g.l(7, 15.5, 7.2, 18, .4, e);
      g.p([4.8, 20.2, 9.8, 20.2, 8.6, 17.8, 6, 17.8], e, { bevel: .6, gloss: true });
      const glass = g.e(7.3, 25, 3.9, 4.9, d, glow);
      g.on(glass, () => { K2.flame(g, 7.3, 26.2, 5, 2.2, 0, b, c, null); });
      if (!g.small) { g.dot(6.5, 26.4, .5, dark); g.dot(8.3, 26.4, .5, dark); }
      g.p([4.8, 29.4, 9.8, 29.4, 8.8, 31.6, 5.8, 31.6], e, { bevel: .6, gloss: true });
      // sleeve and hand of marsh-fire
      g.tube([25, 32.5, 20, 37.5, 16.5, 38.6], 3.3, 2.6, a);
      g.e(15, 38.8, 2.5, 2.3, c, glow);
      // hood, its tip drooping like the wisp's
      let hood;
      g.group(() => { g.tube([36, 9.5, 43, 6.5, 49.5, 9.5, 51.5, 16, 48.5, 20], 4.6, .9, a); hood = g.e(30, 16.5, 10.6, 10.6, a); });
      if (!g.back) g.on(hood, () => { g.e(25.4, 18.6, 6.4, 7.2, dark, { shade: false }); g.e(25.6, 18.4, 8, 8.8, f); });
      star4(g, 47.6, 23.8, 2.3, '#ffe9a0', { mat: 'glow', oc: '#b08a3a' });
      g.c(28.6, 27.6, 1.7, e, { gloss: true });
      g.eye(22.8, 18.4, 2.4, 'glow', { iris: c, side: -1 });
      g.eye(28.4, 18, 2, 'glow', { iris: c, side: 1 });
    }
  });

  // ---------------------------------------------------------------- Strawby
  BEAST('strawby', {
    pal: { a: '#ecca62', b: '#c2923a', c: '#8a5a30', d: '#e05048', e: '#5a8ac8', f: '#fff0b8' }, keep: ['d', 'e'], sh: 70,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const wheat = (x, y, ang, len) => {
        const [sx, sy] = K.pt(x, y, ang, 3.5); g.l(x, y, sx, sy, .5, b);
        for (const da of [-16, 0, 16]) { const [tx, ty] = K.pt(sx, sy, ang, len * .8), [ax, ay] = K.pt(tx, ty, ang + da, 3.4); if (!g.small) g.l(tx, ty, ax, ay, .3, b); }
        const ear = blade(g, sx, sy, ang, len, 1.9, a);
        if (!g.small) K2.stripes(g, ear, sx - 5, sy - 10, sx + 5, sy + 2, ang + 40, 1.9, .5, b);
      };
      // sheaf skirt
      const hem = [18.5, 58.6, 20.8, 60.6, 23, 58.6, 25.5, 61, 28, 59, 30.5, 61.2, 33, 59, 35.5, 61.2, 38, 59, 40.5, 61, 43, 58.6, 45.2, 60.6, 47, 58.6];
      const skirt = g.p([26.5, 46, 21.5, 52, ...hem, 44, 52, 38.5, 46], a, { bevel: 1.4 });
      g.on(skirt, () => { for (let i = 0; i < hem.length; i += 4) g.l(32.5, 43, hem[i], hem[i + 1] + 2, .32, b); });
      g.on(skirt, () => g.p([38.5, 51.5, 43, 51, 43.6, 55.6, 39, 56], e));
      // arms thrown up in alarm, tied at the wrists
      for (const [x0, y0, x1, y1, s] of [[27, 42, 15.5, 36.5, -1], [38, 42, 48.5, 37, 1]]) {
        const ang = Math.atan2(x1 - x0, y0 - y1) * 180 / Math.PI;
        for (const da of [-26, 0, 26]) K2.ear(g, x1, y1, ang + da, 4.6, 1, b);
        const arm = g.l(x0, y0, x1, y1, 1.9, a);
        g.on(arm, () => g.l(x1 - s * 1.2, y1 + 2.4, x1 - s * 2.6, y1 - 2.2, .7, d));
      }
      // torso and twine belt
      const torso = g.p([26.5, 46.5, 26, 39.5, 38.5, 39.5, 38.5, 46.5], a, { bevel: 1.6 });
      g.on(torso, () => { for (const x of [29, 32.3, 35.6]) g.l(x, 38, x, 47, .32, b); });
      g.l(26.6, 46.4, 38.4, 46.4, 1.2, d);
      // wheat ears sprouting from the topknot
      wheat(30.5, 24.5, -32, 8); wheat(32.5, 24, 2, 9); wheat(34.5, 24.5, 34, 8);
      g.e(32.4, 24.4, 2.6, 1.5, c);
      // head: a plaited ball of straw
      const head = g.e(31.5, 32.5, 9.6, 8.8, a);
      g.on(head, () => { for (const x of [33.5, 36.2, 38.8]) g.tube([32.4, 24.5, x + 1.5, 30, x + 1, 41], .3, .3, b); for (const x of [29, 25.6, 23]) g.tube([32.4, 24.5, x - 1.4, 27.5, x - 2.6, 31], .3, .3, b); });
      // ribbon bow at the neck
      g.p([30.5, 40.6, 25.5, 38.4, 25, 43], d, { bevel: .7 }); g.p([32.5, 40.6, 37.5, 38.4, 38, 43], d, { bevel: .7 }); g.c(31.5, 40.8, 1.4, dk(d, .15));
      // sweat drop
      if (!g.small) g.p([44.5, 22, 46.4, 25.6, 44.5, 27.4, 42.6, 25.6], '#bfe6ff', { bevel: .8, gloss: true, oc: '#5a8ac8' });
      g.eye(26.2, 31.8, 2.9, 'button'); g.eye(34, 31.4, 2.6, 'button');
      flat(g, F => {
        F.fl(23.4, 28.2, 27.4, 26.8, .45, '#3a2616'); F.fl(32.4, 26.6, 36.2, 27.6, .45, '#3a2616');
        F.fchain([25, 36.4, 26.8, 35.5, 28.6, 36.5, 30.4, 35.5, 32.2, 36.4], .45, '#1b1328');
      });
      void f;
    }
  });

  // ---------------------------------------------------------------- Scarecrone
  BEAST('scarecrone', {
    pal: { a: '#ece4c8', b: '#6a4a8a', c: '#8a5a30', d: '#dcb44c', e: '#ff9a30', f: '#2e2e40', h: '#a24a8e', k: '#5a9a44' }, keep: ['a', 'f', 'e'], sh: 70,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const crow = (x, y, s) => {
        // s = 1 faces right, -1 faces left
        g.p([x - s * 3.4, y - .6, x - s * 8, y + 1.6, x - s * 3.6, y + 2.2], f, { bevel: .7 });
        g.l(x - s * .6, y + 2.6, x - s * .8, y + 5, .4, '#c8a040'); g.l(x + s * 1.2, y + 2.6, x + s * 1, y + 5, .4, '#c8a040');
        const body = g.e(x, y, 4.2, 3.2, f, { lt: '#5a5a7a' });
        g.on(body, () => g.e(x - s * 1, y + .4, 2.8, 1.8, '#42425c'));
        g.p([x + s * 4.6, y - 3.6, x + s * 7.6, y - 2.6, x + s * 4.6, y - 1.8], '#c8a040', { bevel: .5 });
        g.c(x + s * 3.2, y - 2.8, 2.5, f, { lt: '#5a5a7a' });
        g.dot(x + s * 3.8, y - 3.2, .5, '#ffffff');
      };
      // stake and crossbar
      g.p([32, 50, 35, 50, 35, 58, 33.5, 62.4, 32, 58], c, { mat: 'stone', bevel: .8 });
      g.l(5.5, 29.5, 59, 25.5, 1.4, c, { mat: 'stone' });
      // straw hands and hem
      for (const da of [-150, -120, -92, -64]) K2.ear(g, 9, 30, da, 6, 1, d);
      for (const da of [60, 88, 116, 146]) K2.ear(g, 56.5, 26.5, da, 6, 1, d);
      for (const [x, ang] of [[25, 196], [29.5, 186], [37, 174], [41.5, 164]]) K2.ear(g, x, 52, ang, 7, 1.1, d);
      // ragged coat
      let coat;
      g.group(() => {
        g.p([8.5, 27.4, 23, 25, 25, 36, 18.5, 34.6, 15, 37.6, 12, 34, 9, 35.6], b, { bevel: 1.6 });
        g.p([41, 24.2, 56.5, 23.4, 57, 31.4, 54, 29.6, 52, 33.6, 48.5, 31.4, 45.5, 35, 41, 34], b, { bevel: 1.6 });
        coat = g.p([23, 26, 42, 24.5, 45, 38, 48.5, 52, 45, 50.5, 42.5, 55, 39, 51.5, 36, 56, 32.5, 52.5, 29, 56.5, 25.5, 52, 22, 55.5, 18.5, 51, 20.5, 38], b, { bevel: 2.4 });
      });
      g.on(coat, () => { g.p([23, 25.5, 42, 24, 39.5, 30.5, 32.6, 36.6, 25.6, 31], dk(b, .28)); g.p([36.5, 41, 42, 40.4, 42.6, 46, 37, 46.6], d); g.p([22.5, 44, 26.5, 43.6, 27, 48, 23, 48.4], h); g.l(21, 38.6, 45, 37.4, .8, '#e05048'); });
      for (const y of [40.5, 44.5]) g.c(31.6, y, 1.1, d, { gloss: true });
      // crows on duty
      crow(15, 21.6, -1); crow(50.5, 19.6, -1);
      // straw ruff
      g.fur(32, 25.2, 7.4, 3.2, d, { n: 9, amp: .36, mat: 'fur' });
      // turnip-lantern head with leafy top
      K.leaf(g, 30, 6.5, -40, 8.5, 2.8, k, dk(k, .3)); K.leaf(g, 34.5, 6.5, 38, 8, 2.6, k, dk(k, .3)); K.leaf(g, 32.4, 6, 2, 5, 2.4, k, dk(k, .3));
      const head = g.e(32, 15, 10.6, 9.6, a);
      g.on(head, () => g.e(32.5, 6.4, 12, 5.4, h));
      flat(g, F => {
        const cut = '#6a3410', core = '#ffe680';
        F.fp([23.6, 11.4, 30.4, 13.6, 25.2, 17.4], cut); F.fp([24.6, 12.6, 29, 14, 25.6, 16.4], e); F.fp([25.4, 13.6, 27.6, 14.2, 25.9, 15.5], core);
        F.fp([39.6, 11, 33.6, 13.4, 38.4, 17], cut); F.fp([38.8, 12.2, 35, 13.8, 38, 16], e); F.fp([38.2, 13.2, 36.4, 14, 37.8, 15.2], core);
        F.fp([31, 16, 33, 16, 32, 18.6], cut);
        F.fp([23.6, 19, 27, 20.6, 29, 19.2, 31.4, 20.8, 34, 19.2, 36.4, 20.6, 40, 18.8, 37.6, 23.6, 35, 22.2, 32.4, 24.4, 29.8, 22.4, 27.2, 23.8], cut);
        F.fp([25.2, 20.2, 27.2, 21.4, 29, 20.4, 31.4, 21.8, 34, 20.4, 36.2, 21.4, 38.4, 20.2, 37, 22.6, 35, 21.4, 32.4, 23.2, 29.8, 21.6, 27.4, 22.8], e);
      });
    }
  });
  // ---------------------------------------------------------------- Omenkit
  BEAST('omenkit', {
    pal: { a: '#36334f', b: '#5c5884', c: '#f6e070', d: '#c080ff', e: '#ff9ab8' }, keep: ['c', 'e'], sh: -60,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .35);
      // tail held up in a question mark, with a star for the dot
      g.tube([46.5, 46, 52.5, 42.5, 55, 34.5, 52, 26.5, 46, 24.6, 42.6, 28.6, 44.6, 32.4], 2.4, 1.7, a, { mat: 'fur' });
      star4(g, 44.8, 37, 2.2, c, { mat: 'glow', oc: '#a08428' });
      // far legs, one lifted mid-step
      g.tube([28.5, 48, 24.5, 52.5, 20.5, 53], 2.3, 1.9, fa); g.e(19.4, 53, 2.6, 2, fa);
      g.tube([44, 50, 46.5, 54.5, 47.5, 58.6], 2.3, 1.9, fa); g.e(47, 59.6, 3, 1.6, fa);
      // body
      const body = g.re(37.5, 46.5, 11.5, 7.2, -4, a, { mat: 'fur' });
      const hip = g.e(44.5, 48.5, 5.6, 6.2, a, { mat: 'fur', line: false });
      // a constellation on its flank
      g.on([body, hip], () => {
        const st = [[34.5, 43.6], [39.5, 42.4], [44, 45.2], [41, 49.4], [47, 50]];
        for (const [x, y] of st) g.c(x, y, .85, c);
        for (let i = 0; i + 1 < st.length; i++) g.l(st[i][0], st[i][1], st[i + 1][0], st[i + 1][1], .3, mix(c, a, .5));
      });
      // near legs
      g.tube([44.5, 52, 45.4, 56, 44.6, 58.6], 2.5, 2, a, { line: false }); g.e(43.8, 59.6, 3.1, 1.7, a);
      g.tube([31.5, 49.5, 31.6, 55, 31, 58.6], 2.5, 2, a); g.e(30.2, 59.6, 3.1, 1.7, a);
      g.fur(28, 47, 4.2, 4.6, b, { n: 6, amp: .3, a0: 20, a1: 200, mat: 'fur' });
      // ears with lynx tufts
      for (const [x, y, ang, len] of [[15.5, 28.5, -28, 11.5], [30.5, 27, 22, 11]]) {
        const [tx, ty] = K.pt(x, y, ang, len - 1); K2.ear(g, tx, ty, ang, 4.4, .8, a);
        K2.ear(g, x, y, ang, len, 4.4, a, d);
      }
      // head
      const head = g.e(23.5, 34.5, 10.2, 9, a, { mat: 'fur' });
      const cheek = g.fur(23.5, 38, 11, 5.4, a, { n: 9, amp: .22, a0: 10, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on([head, cheek], () => { g.e(18.2, 39.4, 5.6, 3.4, b); g.p([23, 24.6, 23.8, 27, 26.2, 27.8, 23.8, 28.6, 23, 31, 22.2, 28.6, 19.8, 27.8, 22.2, 27], c); });
      g.eye(18.2, 34, 3.6, 'slit', { sc: c, side: -1, look: -.3 });
      g.eye(28.2, 33.4, 3.2, 'slit', { sc: c, side: 1, look: -.3 });
      flat(g, F => { F.fe(15.2, 38.2, 1.1, .8, e); F.fchain([13.4, 40, 14.4, 40.8, 15.4, 39.8, 16.6, 40.8, 17.8, 40], .4, '#a7a2d2'); });
      g.whiskers(12.6, 39.4, -1, 2, 4, '#8a86b0');
    }
  });

  // ---------------------------------------------------------------- Sibylynx
  BEAST('sibylynx', {
    pal: { a: '#3b3660', b: '#7168a4', c: '#f6e070', d: '#c080ff', e: '#a6f2ff', f: '#ff9ab8' }, keep: ['c', 'f'], sh: -60,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .35), k = 13 * Math.PI / 180;
      const rp = t => { const x = Math.cos(t * Math.PI / 180) * 21, y = Math.sin(t * Math.PI / 180) * 9.6; return [25 + x * Math.cos(k) - y * Math.sin(k), 22.5 + x * Math.sin(k) + y * Math.cos(k)]; };
      const ring = (t0, t1) => { const pts = []; for (let i = 0; i <= 12; i++) pts.push(...rp(t0 + (t1 - t0) * i / 12)); return pts; };
      const orb = (x, y, r, inner) => { const o = g.c(x, y, r, e, { gloss: true, oc: '#3a7aa8' }); g.on(o, () => inner(x, y)); };
      // the far side of the orbit, and the orb passing behind the head
      g.tube(ring(180, 360), .4, .4, d, { mat: 'glow', oc: '#6a4aa0' });
      orb(...rp(292), 3.6, (x, y) => { g.c(x + 1.1, y - .4, 1.6, e); g.c(x + .2, y, 1.9, c); });
      // far front leg
      g.tube([32.5, 40, 33.5, 50, 33.5, 58], 2.7, 2.3, fa); g.e(33, 59.5, 3.4, 1.7, fa);
      // seated body
      const torso = g.re(35.5, 42.5, 9.6, 13.6, 14, a, { mat: 'fur' });
      const hip = g.e(44, 50.5, 9, 8.6, a, { mat: 'fur' });
      // star chart across its back
      g.on([torso, hip], () => {
        const st = [[38.5, 36.5], [42.5, 40], [40.5, 45], [46, 46.5], [50, 50.5], [45, 54]];
        for (const [x, y] of st) g.c(x, y, .95, c);
        for (let i = 0; i + 1 < st.length; i++) g.l(st[i][0], st[i][1], st[i + 1][0], st[i + 1][1], .3, mix(c, a, .5));
        for (const [x, y] of [[36, 41], [45, 42], [39.5, 50], [49, 55.5]]) g.c(x, y, .5, d);
      });
      g.e(41.5, 59.4, 5, 1.9, a);
      // near front leg and chest ruff
      g.tube([27.5, 40, 27, 50, 27, 58], 3.1, 2.6, a); g.e(26, 59.5, 3.7, 1.9, a);
      K2.toes(g, 25.4, 60.4, 3, 3, b);
      K2.ruff(g, 27.5, 37, 6.6, 8, b, 9, .26, -30, 210);
      // tail wrapped round its feet, tipped with a star
      g.tube([51.5, 54, 50, 58.6, 42, 60.4, 35, 59.6], 2.6, 2, a, { mat: 'fur' });
      star4(g, 32.6, 58.6, 2.3, c, { mat: 'glow', oc: '#a08428' });
      // near side of the orbit crosses the shoulders
      g.tube(ring(0, 180), .4, .4, d, { mat: 'glow', oc: '#6a4aa0' });
      orb(...rp(28), 3.9, (x, y) => { g.c(x, y + .2, 1.7, f); });
      // tufted ears
      for (const [x, y, ang, len] of [[15, 17.5, -20, 11.5], [29, 16.5, 16, 11.5]]) {
        const [tx, ty] = K.pt(x, y, ang, len - 1); K2.ear(g, tx, ty, ang, 5, .8, a);
        K2.ear(g, x, y, ang, len, 3.9, a, d);
      }
      // head with heavy cheek ruffs
      g.fur(22.5, 26.5, 12.6, 6.6, b, { n: 8, amp: .34, a0: 0, a1: 180, mat: 'fur' });
      const head = g.e(22.5, 23.5, 9.8, 8.4, a, { mat: 'fur' });
      if (!g.back) g.on([head], () => { g.e(17.2, 27.8, 5.4, 3.4, b); g.p([21, 13.2, 21.9, 16.2, 24.8, 17.2, 21.9, 18.2, 21, 21.2, 20.1, 18.2, 17.2, 17.2, 20.1, 16.2], c); });
      orb(...rp(184), 3.6, (x, y) => { g.p([x, y - 2, x + .6, y - .6, x + 2, y, x + .6, y + .6, x, y + 2, x - .6, y + .6, x - 2, y, x - .6, y - .6], '#ffffff'); });
      g.eye(17, 22.8, 3.1, 'sharp', { iris: '#e8961c', sc: c, slit: true, side: -1 });
      g.eye(24.8, 22.2, 2.7, 'sharp', { iris: '#e8961c', sc: c, slit: true, side: 1 });
      flat(g, F => { F.fp([12.4, 25.4, 14.8, 25.4, 13.6, 27], '#1b1328'); F.fchain([12.6, 28.6, 14, 29.2, 16.4, 28.8, 17.6, 28], .4, '#1b1328'); });
    }
  });

  // ---------------------------------------------------------------- Dozelet
  BEAST('dozelet', {
    pal: { a: '#dca876', b: '#fff2e2', c: '#6a58b0', d: '#bfe4ff', e: '#ffd060', f: '#ffb8b0' }, keep: ['b', 'e', 'f'], sh: 180,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // the dream bubble it sleeps on
      const bub = g.c(32, 46, 13.5, d, { gloss: true, oc: '#5f8fc8', dk: '#98c2ee' });
      g.on(bub, () => {
        g.re(23.4, 39.6, 1.3, 3.6, 40, '#ffffff', { shade: false });
        g.c(29.6, 46.4, 3.4, d); g.c(27.6, 47.4, 4.2, e);
        for (const [x, y, r] of [[38, 42.6, 1.7], [40.5, 51, 1.3], [33, 54.5, 1.1]]) g.p([x, y - r, x + r * .32, y - r * .32, x + r, y, x + r * .32, y + r * .32, x, y + r, x - r * .32, y + r * .32, x - r, y, x - r * .32, y - r * .32], '#ffffff');
      });
      // curled-up body
      g.e(36, 27.8, 10.4, 7, a, { mat: 'fur' });
      // ears and head tucked down
      for (const [x, y, r] of [[18.4, 20.4, 3.6], [28.6, 19.4, 3.4]]) { const ear = g.c(x, y, r, a); g.on(ear, () => g.c(x + .2, y + .5, r * .58, f)); }
      const head = g.e(24, 27.2, 8.8, 7.6, a, { mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(19.4, 30.8, 4.8, 3, b));
      // bushy tail wrapped round like a blanket
      const tail = g.tube([46.5, 28.5, 46, 33, 39, 36, 31.5, 35], 2.6, 3.2, mix(a, '#8a5a3a', .3), { mat: 'fur' });
      g.on(tail, () => g.e(31.5, 35, 3.4, 3.4, b));
      // paws tucked under the chin
      g.e(21.4, 34.8, 1.9, 1.4, f); g.e(25.2, 35.4, 1.9, 1.4, f);
      zed(g, 43.5, 15.5, 3, c); zed(g, 49, 10, 3.8, c); zed(g, 55, 4.4, 4.6, c);
      g.eye(20.6, 27.6, 2.8, 'closed', { side: -1 }); g.eye(27.6, 27.2, 2.2, 'closed', { side: 1 });
      flat(g, F => F.fe(16.2, 30, 1.1, .85, '#e8748e'));
      g.mo('smile', 18, 32, 2);
      g.blush(23, 31, 1.5);
    }
  });

  // ---------------------------------------------------------------- Snoozer
  BEAST('snoozer', {
    pal: { a: '#cf9a6c', b: '#fff2e2', c: '#5a48a0', d: '#bfe4ff', e: '#ffd060', f: '#ffb4ac', h: '#f4f6ff', k: '#a8c4f0' }, keep: ['b', 'e', 'f', 'h'], sh: 180,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const fa = far(a, .26);
      // tail swishing behind
      const tail = g.tube([42, 50, 50, 51, 56, 45, 55, 36], 3.2, 4.6, mix(a, '#8a5a3a', .3), { mat: 'fur' });
      g.on(tail, () => g.e(55, 34.5, 4.8, 4, b));
      // far leg and far arm stretched out ahead
      g.tube([36, 52, 37.5, 56, 37, 58.6], 2.6, 2.2, fa); g.e(36, 59.6, 4, 1.8, fa);
      g.tube([28, 36.5, 20, 37, 13.5, 38], 2.2, 1.9, fa); g.e(11.8, 38.2, 2.3, 2, mix(f, fa, .4));
      // body
      const body = g.e(33.5, 44, 10, 11.6, a, { mat: 'fur' });
      g.on(body, () => g.e(29, 46.5, 6, 8.5, b));
      // near leg shuffling forward
      g.tube([30, 53, 27.5, 57, 26.4, 58.8], 2.8, 2.3, a); g.e(24.8, 59.6, 4.4, 1.9, a);
      // pillow hugged under one arm
      const pil = g.p([20, 40.5, 22.6, 38.6, 31.5, 37, 34.4, 38, 35.4, 40.5, 36, 46.6, 35, 49.6, 32.4, 50.6, 23.6, 52.2, 21, 51.2, 20, 48.6, 19.6, 43], h, { bevel: 2.2, dk: '#cdd6f2' });
      K2.stripes(g, pil, 19, 37, 37, 53, 80, 3.4, .9, k);
      g.tube([36.5, 37.6, 33.6, 43.6, 28, 45.6], 2.5, 2.1, a); g.e(26.4, 45.8, 2.4, 2.1, f);
      // ears, head
      for (const [x, y, r] of [[22.4, 17, 3.7], [39.4, 16.4, 3.5]]) { const ear = g.c(x, y, r, a); g.on(ear, () => g.c(x + .2, y + .6, r * .58, f)); }
      const head = g.e(30.5, 25, 10.6, 9.2, a, { mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(25, 29, 6.2, 4.2, b));
      // nightcap flopping back, with a star on the end
      let cap;
      g.group(() => { cap = g.tube([31.5, 15.5, 36.5, 8.5, 45, 7.5, 51, 12.5, 52, 19], 6.4, 1.3, c); });
      g.on(cap, () => { for (const [x, y] of [[36, 9.5], [43.5, 8.6], [31.6, 13.6]]) g.c(x, y, .9, e); });
      g.fur(31, 17.2, 9.6, 2.7, b, { n: 9, amp: .2, mat: 'fur' });
      star4(g, 52, 22.6, 2.6, e, { mat: 'glow', oc: '#a08428' });
      // snore bubble
      g.c(15.6, 26, 2.9, d, { gloss: true, oc: '#5f8fc8' });
      zed(g, 9, 15, 3.6, c); zed(g, 4.4, 8.4, 4.4, c);
      // dozing on its feet: eyes shut flat, mid-yawn
      if (g.tiny) { g.eye(25.2, 24.8, 2.6, 'closed'); g.eye(33.6, 24.6, 2.2, 'closed'); }
      flat(g, F => { F.fl(22.6, 25.4, 27.8, 24.4, .5, '#1b1328'); F.fl(31.8, 24.2, 35.8, 25, .5, '#1b1328'); F.fe(20.4, 27.4, 1.2, .9, '#e8748e'); });
      g.mo('open', 23, 30, 3.2, { h: 3 });
      g.blush(28, 28.4, 1.5);
    }
  });

  // ---------------------------------------------------------------- Somnarch
  BEAST('somnarch', {
    pal: { a: '#2f2d66', b: '#e2b48a', c: '#f2d266', d: '#8a70e0', e: '#bfe4ff', f: '#ffb4ac', h: '#fff2e2' }, keep: ['c', 'f', 'h'], sh: 180,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      // great plume of a tail
      const tail = g.tube([44, 50, 54, 48.5, 59, 38.5, 56.5, 27, 50.5, 21], 4, 6, mix(b, '#8a5a3a', .3), { mat: 'fur' });
      g.on(tail, () => g.e(50.5, 20.5, 6.4, 5.4, h));
      // robe of night sky
      const hemPts = [13.5, 60.4, 20, 61.6, 27, 60.2, 34, 61.6, 41, 60.2, 48, 61.4, 52.5, 60];
      const robe = g.p([22.5, 30, 18.5, 42, 14.5, 55, ...hemPts, 51, 50, 47, 38, 42.5, 29.5, 33, 27], a, { bevel: 2.8 });
      g.on(robe, () => {
        for (let i = 0; i + 3 < hemPts.length; i += 2) g.l(hemPts[i], hemPts[i + 1] - .8, hemPts[i + 2], hemPts[i + 3] - .8, 1.2, c);
        g.c(36.6, 46.4, 3, a); g.c(35, 47, 3.6, c);
        for (const [x, y, r] of [[26, 42, 1.6], [43.5, 51, 1.5], [24, 52.5, 1.3], [41.5, 37.5, 1.2], [31, 54.5, 1]]) g.p([x, y - r, x + r * .32, y - r * .32, x + r, y, x + r * .32, y + r * .32, x, y + r, x - r * .32, y + r * .32, x - r, y, x - r * .32, y - r * .32], c);
        for (const [x, y] of [[30.5, 38], [46, 44], [20.5, 47.5], [37, 55.5]]) g.c(x, y, .55, d);
      });
      // sceptre topped with a dream bubble
      g.l(13.2, 57, 14.6, 17.5, .9, c, { gloss: true });
      g.p([11, 17.5, 18.2, 17.5, 16.4, 20, 12.8, 20], c, { bevel: .6, gloss: true });
      const orb = g.c(14.6, 11.6, 5.4, e, { gloss: true, oc: '#5f8fc8', dk: '#98c2ee' });
      g.on(orb, () => { g.c(15.8, 11.4, 2.2, e); g.c(14.6, 12, 2.8, c); });
      // sleeve and paw
      g.tube([26, 34, 20.5, 38.6, 16, 38.4], 3.4, 2.8, a); g.l(17, 36, 16.6, 41, .8, c); g.e(13.8, 38.6, 2.4, 2.2, b);
      // ermine collar
      const col = K2.ruff(g, 31.5, 30.4, 10.6, 4.4, h, 11, .22);
      K2.spots(g, col, [[24.5, 31.4, .7], [29, 32.8, .7], [34.4, 32.8, .7], [39, 31.2, .7]], '#3a3050');
      // ears, head and crown
      for (const [x, y, r] of [[23.4, 12, 3.9], [40.6, 11.4, 3.7]]) { const ear = g.c(x, y, r, b); g.on(ear, () => g.c(x + .2, y + .6, r * .58, f)); }
      const head = g.e(32, 20, 10.2, 9, b, { mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(26.6, 24, 6, 4.2, h));
      const crown = g.p([26.5, 12.2, 26, 5.6, 29, 8.8, 31.6, 3.8, 34.2, 8.8, 37.2, 5.6, 36.8, 12.2], c, { bevel: .9, gloss: true });
      g.on(crown, () => g.c(31.6, 9.6, 1.1, d));
      // drifting dream bubbles
      if (!g.small) { g.c(47.5, 9, 2.2, e, { gloss: true, oc: '#5f8fc8' }); g.c(53.5, 13.5, 1.4, e, { gloss: true, oc: '#5f8fc8' }); }
      g.eye(26.8, 19.6, 3, 'sleepy', { iris: '#7a52e0', lid: b, side: -1, look: -.3 });
      g.eye(35.2, 19, 2.6, 'sleepy', { iris: '#7a52e0', lid: b, side: 1, look: -.3 });
      flat(g, F => F.fe(22.2, 22.6, 1.2, .9, '#e8748e'));
      g.mo('smile', 24.4, 26, 3.2);
    }
  });
})();