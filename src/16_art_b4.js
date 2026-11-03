// ---- art/b4 ----
// ===== Batch b4: mine, rock, fossil, oak and wayhouse Beasties =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // rotated ellipse placed from a base point along an angle (ears, leaves, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
  // mark drawn on existing parts; returns the new mark's id
  const mk = (g, ids, fn) => { let r; g.on(ids, () => { r = fn(); }); return r; };
  // rotate offsets (dx, dy) by ang degrees clockwise around (cx, cy)
  const rot = (cx, cy, ang) => { const a = ang * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return (dx, dy) => [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
  // rounded rectangle outline (slabs, blocks); pinch > 0 narrows the top edge
  const rrect = (cx, cy, w, h, r, ang = 0, pinch = 0) => {
    const f = rot(cx, cy, ang), out = [], hw = w / 2, hh = h / 2;
    for (const [qx, qy, a0] of [[hw - r, -hh + r, -90], [hw - r, hh - r, 0], [-hw + r, hh - r, 90], [-hw + r, -hh + r, 180]])
      for (let i = 0; i <= 3; i++) { const a = (a0 + i * 30) * Math.PI / 180, x = qx + Math.cos(a) * r, y = qy + Math.sin(a) * r; out.push(...f(x * (1 - pinch * (hh - y) / (2 * hh)), y)); }
    return out;
  };
  // hairline crack (polyline) painted onto parts
  const crack = (g, ids, pts, col, w = .42) => g.on(ids, () => { for (let i = 0; i + 3 < pts.length; i += 2) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], w, col, { shade: false }); });

  // bat wing: arm from shoulder to wrist, fingers fanning to the tips, scalloped membrane back to the body
  const batWing = (g, o) => {
    const { sx, sy, wx, wy, tips, bx, by, mem, bone } = o;
    const pts = [sx, sy, wx, wy], k = o.sag ?? .28;
    tips.forEach(([tx, ty], i) => {
      if (i) { const [px, py] = tips[i - 1], mx = (px + tx) / 2, my = (py + ty) / 2; pts.push(mx + (wx - mx) * k, my + (wy - my) * k); }
      pts.push(tx, ty);
    });
    const [lx, ly] = tips[tips.length - 1], mx = (lx + bx) / 2, my = (ly + by) / 2, k2 = o.sag2 ?? .2;
    pts.push(mx + (wx - mx) * k2, my + (wy - my) * k2, bx, by);
    const id = g.p(pts, mem, { bevel: 1.4, ...(o.opt || {}) });
    g.on(id, () => {
      if (o.edge) { for (let i = 0; i < pts.length - 2; i += 2) if (i >= 4) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], o.edgeW || 1.3, o.edge); }
      if (o.spots) for (const [x, y, r] of o.spots) g.c(x, y, r, o.spotCol, { mat: 'glow' });
      tips.forEach(([tx, ty], i) => g.l(wx, wy, tx, ty, i ? .45 : .6, bone));
    });
    g.tube([sx, sy, (sx + wx) / 2 + (o.bx2 || 0), (sy + wy) / 2 + (o.by2 || -1.2), wx, wy], o.aw || 1.5, o.aw2 || 1, bone);
    const [cx1, cy1] = K.pt(wx, wy, o.thumb ?? -20, 2.6);
    g.p([wx - .9, wy + .2, wx + .9, wy - .2, cx1, cy1], o.claw || bone, { bevel: .5 });
    return id;
  };

  // ---------------------------------------------------------------- Flitter
  BEAST('flitter', {
    pal: { a: '#6a5a8a', b: '#a890c8', c: '#3a2e50', d: '#ff9ab0', e: '#b8e060', f: '#e2d6f0' }, keep: ['f'], sh: 170,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // far wing, raised behind
      batWing(g, { sx: 38, sy: 38, wx: 47, wy: 27.5, tips: [[60, 23], [61, 34], [55.5, 43.5]], bx: 41, by: 47, mem: far(b, .25), bone: far(c, .15), spots: [[53.5, 33, 1.7]], spotCol: far(e, .2), thumb: 10 });
      // near wing
      batWing(g, { sx: 26, sy: 39, wx: 15, wy: 29.5, tips: [[3, 28.5], [2.5, 39.5], [8.5, 49]], bx: 25, by: 49, mem: b, bone: c, spots: [[8, 37, 2], [12.5, 43, 1.4]], spotCol: e, thumb: -25 });
      // dangling feet
      g.tube([30, 49, 29.5, 53, 28.4, 55.6], 1.1, .9, c); g.tube([35.5, 49, 36.5, 53, 37.2, 55.2], 1.1, .9, far(c, .1));
      K2.claws(g, 28.2, 55.6, 2, 1.8, 1.3, -1, c); K2.claws(g, 37.2, 55.2, 2, 1.8, 1.3, 1, far(c, .1));
      // ears
      K2.ear(g, 37.5, 32, 24, 12.5, 4.3, far(a, .2), mix(d, far(a, .2), .3));
      K2.ear(g, 25, 32.5, -24, 13.5, 4.6, a, d);
      // fluffy round body
      const body = g.fur(31.5, 41, 10.2, 9.6, a, { n: 18, amp: .07, mat: 'fur' });
      g.fur(30, 30.8, 3.6, 2.2, a, { n: 6, amp: .4, a0: -175, a1: -5, mat: 'fur', line: false });
      g.on(body, () => g.fur(29.5, 48.5, 6.5, 4.5, f, { n: 8, amp: .25, a0: -170, a1: -10 }));
      if (!g.back) g.on(body, () => g.e(28.5, 43.5, 5.5, 3.6, lt(a, .3)));
      g.eye(25.8, 39.2, 3.3, 'cute', { iris: '#86c830', side: -1 });
      g.eye(34.6, 38.8, 3, 'cute', { iris: '#86c830', side: 1 });
      g.nose(28.6, 42.6, 'pink', { s: .75 });
      g.mo('fang', 28.8, 45, 3.6, { fx: .7 });
      g.blush(22.8, 43.3, 1.5); g.blush(37.5, 42.6, 1.4);
    }
  });

  // ---------------------------------------------------------------- Vespermaus
  BEAST('vespermaus', {
    pal: { a: '#4a3a6a', b: '#8a70b0', c: '#2a1e3a', d: '#e070a0', e: '#a6e040', f: '#ddd0ee' }, keep: ['f'], sh: 170,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // twilight streaks trailing behind
      for (const [pts, r] of [[[40, 50, 48, 55, 56, 55, 62, 50], .7], [[44, 45, 52, 47, 58, 44], .55]]) g.tube(pts, r, .3, e, { mat: 'glow', line: false });
      // far wing, swept up behind
      batWing(g, { sx: 37, sy: 28, wx: 47.5, wy: 13.5, tips: [[61, 4], [62, 18], [59, 30], [52.5, 38.5]], bx: 39, by: 42, mem: far(b, .22), bone: far(c, .1), edge: far(d, .25), spots: [[55, 21, 1.6]], spotCol: far(e, .15), thumb: 15, aw: 1.8, aw2: 1.2 });
      // long mouse tail with a glowing tip
      g.tube([38, 44, 43, 51, 50, 54, 55, 51.5, 56, 47.5], 1.3, .6, c);
      g.c(56.2, 46.5, 1.8, e, { mat: 'glow' });
      // near wing, swept down and forward
      batWing(g, { sx: 26, sy: 30, wx: 12, wy: 18.5, tips: [[2.5, 9], [2, 25], [5, 37], [13, 46]], bx: 27, by: 44, mem: b, bone: c, edge: d, spots: [[8, 25, 2], [11, 33.5, 1.5]], spotCol: e, thumb: -30, aw: 1.9, aw2: 1.2 });
      // feet
      g.tube([30, 45, 29.5, 49, 28.5, 51.5], 1.2, 1, c); K2.claws(g, 28.2, 51.5, 2, 2, 1.5, -1, c);
      g.tube([35, 44, 36, 48, 36.8, 50.5], 1.1, .9, far(c, .1)); K2.claws(g, 36.8, 50.5, 2, 1.8, 1.3, 1, far(c, .1));
      // lean body with a pale chest
      const body = g.re(32, 37, 7.5, 10.5, -14, a, { mat: 'fur' });
      g.on(body, () => g.re(29.5, 39, 4, 8, -14, lt(a, .22)));
      // big oval mouse ears
      const fe = blade(g, 32.5, 18.5, 22, 15, 4.6, far(a, .2));
      g.on(fe, () => blade(g, 32.5, 19, 22, 11.5, 2.6, mix(d, far(a, .2), .35)));
      // fluffy collar
      g.fur(28, 30, 8.5, 4.8, f, { n: 11, amp: .24, mat: 'fur', dk: '#b8a8d0' });
      // head with a pointed snout
      const head = g.e(25, 23.5, 7.4, 6.8, a, { mat: 'fur' });
      const snout = g.p([21, 21, 15.5, 24, 13.2, 26.2, 14.5, 28, 20, 28.6, 25, 27.5], a);
      const ne = blade(g, 22, 18.5, -18, 16, 5, a);
      g.on(ne, () => blade(g, 22.3, 19.5, -18, 12, 2.9, d));
      g.fur(24.5, 17.2, 3.5, 2, a, { n: 5, amp: .4, a0: -175, a1: -5, mat: 'fur', line: false });
      if (!g.back) g.on([head, snout], () => g.e(18.5, 27, 5, 2.2, lt(a, .22)));
      g.eye(20.5, 22.3, 2.6, 'glowcool', { sc: '#d8ff70', side: -1 });
      g.eye(27.3, 21.8, 2.1, 'glowcool', { sc: '#d8ff70', side: 1 });
      g.nose(13.9, 25.8, 'pink', { s: .75 });
      g.whiskers(15, 26.5, -1, 2, 4.5, '#c8b8e0');
      g.mo('fangs', 17.5, 28.4, 3.8);
    }
  });

  // miner's helmet with a lamp (sized by s)
  const helmet = (g, x, y, ang, s, col, lens, o = {}) => {
    const f = loc(x, y, ang);
    const dome = []; for (let i = 0; i <= 16; i++) { const t = Math.PI * i / 16; dome.push(...f(Math.sin(t) * 7.8 * s, -Math.cos(t) * 10.5 * s)); }
    g.re(...f(-.6 * s, 0), 12.5 * s, 2.3 * s, ang, dk(col, .12), { mat: 'gloss' });
    const d = g.p(dome, col, { mat: 'gloss' });
    g.on(d, () => { g.re(...f(3.8 * s, 1.5 * s), 1.1 * s, 7.8 * s, ang + 90 + 4, lt(col, .25)); if (o.band) g.re(...f(1.4 * s, 0), 1.4 * s, 10.8 * s, ang, o.band); });
    const [lx, ly] = f(4 * s, -9.6 * s);
    g.e(lx, ly, 3.3 * s, 3.4 * s, o.rim || '#9a9aa6', { mat: 'metal' });
    g.e(lx - .35 * s, ly, 2.3 * s, 2.4 * s, lens, { mat: 'glow', lt: '#ffffff' });
    return d;
  };

  // ---------------------------------------------------------------- Pitmole
  BEAST('pitmole', {
    pal: { a: '#5a4a5a', b: '#ffb0bc', c: '#f0e8d8', d: '#f0d040', e: '#fff8c0', f: '#7a6a7a' }, keep: ['b', 'c', 'e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // stubby tail and far digging paw
      g.tube([43, 55, 47, 56.5, 49, 55], 1.4, 1, far(b, .15));
      const fp = g.e(47, 45.5, 4.5, 4.2, far(b, .25));
      void fp; for (const [x, y, ang] of [[50.5, 42.5, 60], [51.5, 45.5, 90], [50.8, 48.6, 120]]) K2.ear(g, x, y, ang, 3, 1, far(c, .15));
      // hind feet
      g.e(42, 59.4, 4, 2.2, far(b, .2)); g.e(27, 59.6, 4.2, 2.3, b);
      K2.toes(g, 25.5, 60.6, 3, 3, dk(b, .35));
      // plump velvety body
      const body = g.e(34, 48.5, 12, 11, a, { mat: 'soft' });
      g.on(body, () => { g.e(30.5, 52, 7.5, 7.5, f); });
      // near digging paw held out
      g.tube([26, 46, 21.5, 49, 18.5, 50], 3, 2.6, a, { mat: 'soft' });
      const np = g.e(16, 50.5, 5.2, 4.8, b);
      g.on(np, () => { g.e(17, 51.5, 3, 2.6, lt(b, .25)); });
      for (const [x, y, ang] of [[12.2, 47.2, -55], [11, 50.5, -85], [11.8, 53.8, -115], [14.5, 55.5, -150]]) K2.ear(g, x, y, ang, 3.4, 1.1, c);
      // head and pink snout
      const head = g.e(28, 37.5, 10, 8.6, a, { mat: 'soft' });
      g.on(head, () => g.e(24, 41.5, 6, 3.5, f));
      g.tube([21, 40, 15, 40.8, 9.5, 40.4], 3.2, 1.9, b, { mat: 'soft' });
      helmet(g, 29, 32.5, -14, .95, d, e, { band: dk(d, .18) });
      g.eye(20.6, 36.4, 1.7, 'bead');
      g.eye(28, 35.6, 1.5, 'bead');
      g.nose(9.4, 40.1, 'pink', { s: .95 });
      g.mo('open', 16, 44, 3.2, { h: 2.3 });
      g.blush(21.5, 40.5, 1.4); g.blush(33.5, 39.8, 1.3);
    }
  });

  // ---------------------------------------------------------------- Colliermole
  BEAST('colliermole', {
    pal: { a: '#4a3a4a', b: '#ff9aa8', c: '#e8e0d0', d: '#f0c030', e: '#fff8b0', f: '#6a5a6a', h: '#c83838' }, keep: ['b', 'c', 'e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      // far claw dug into the ground
      g.tube([44, 42, 50, 46, 53.5, 51], 3.6, 3, far(a, .2), { mat: 'soft' });
      g.e(54.5, 53.5, 5.2, 4.5, far(b, .25));
      for (const [x, y, ang] of [[58, 51.5, 110], [58.5, 55, 140], [55.5, 57.5, 170]]) K2.ear(g, x, y, ang, 4, 1.2, far(c, .15));
      // hind legs
      g.e(45, 59.2, 5.5, 2.6, far(b, .2));
      // hefty body
      const body = g.re(38, 45, 15.5, 13, -10, a, { mat: 'soft' });
      g.on(body, () => { g.e(33, 51, 10, 8, f); for (const [x, y] of [[44, 36], [49, 40], [47, 45]]) g.l(x, y, x + 2, y - 1, .4, lt(a, .15)); });
      g.e(31, 59.4, 5.8, 2.6, b); K2.toes(g, 28.5, 60.6, 3, 4, dk(b, .35));
      // miner's neckerchief
      const nk = g.tube([21, 36, 27, 40.5, 34, 40, 38, 36], 2.4, 2.4, h, { mat: 'soft' });
      g.on(nk, () => { g.dot(26, 40, .6, lt(h, .5)); g.dot(31, 40.5, .6, lt(h, .5)); });
      g.p([24.5, 40, 29, 41, 26.5, 46], h);
      // great near claw, raised and crackling
      g.tube([27, 45, 20, 45, 14, 40], 4, 3.4, a, { mat: 'soft' });
      const np = g.e(11.5, 37.5, 6, 5.4, b);
      g.on(np, () => g.e(12.5, 38.5, 3.6, 3, lt(b, .25)));
      for (const [x, y, ang] of [[7.5, 32.5, -30], [6, 36.5, -60], [6.2, 40.5, -90], [8.5, 43.5, -125]]) K2.ear(g, x, y, ang, 5, 1.4, c);
      // head
      const head = g.e(24, 30, 10, 8.5, a, { mat: 'soft' });
      g.on(head, () => g.e(20, 34, 6.5, 3.4, f));
      g.tube([17, 33, 11, 34.5, 5.5, 34.5], 3.4, 2, b, { mat: 'soft' });
      helmet(g, 25.5, 25, -16, 1.08, d, e, { band: dk(d, .2) });
      // static sparks
      const bolt = (x, y, s, ang, col) => { const a2 = ang * Math.PI / 180, ca = Math.cos(a2), sa = Math.sin(a2), P = [-1, -4, 1.9, -4, .5, -.7, 2.4, -.9, -1.3, 4.8, .1, .7, -1.9, .9], out = []; for (let i = 0; i < P.length; i += 2) out.push(x + (P[i] * ca - P[i + 1] * sa) * s, y + (P[i] * sa + P[i + 1] * ca) * s); return g.p(out, col, { mat: 'glow', bevel: .5 }); };
      bolt(8, 14.5, .9, -30, lt(d, .2)); bolt(3.5, 28, .7, -60, lt(d, .2)); bolt(14.5, 11.5, .6, 10, lt(d, .2));
      g.eye(17.5, 29.8, 2.3, 'sharp', { iris: '#e89a20', side: -1, brow: 1, look: -.4 });
      g.eye(24.8, 29, 2, 'sharp', { iris: '#e89a20', side: 1, brow: 1, look: -.4 });
      g.nose(5.5, 34.2, 'pink', { s: 1 });
      g.mo('grin', 11.5, 37.2, 4, { h: 1.8 });
    }
  });

  // ---------------------------------------------------------------- Pebblit
  BEAST('pebblit', {
    pal: { a: '#a8a4a0', b: '#f2eee4', c: '#6a6660', d: '#6a9a4a', e: '#8ac060' }, keep: ['b'], sh: 200,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      // stubby feet
      g.e(40, 58.8, 3.8, 2.6, far(c, .15)); g.e(25, 59.2, 4, 2.7, c);
      // smooth beach pebble with a quartz band and speckles
      const body = g.re(32.5, 47.5, 14, 11.5, -6, a, { mat: 'stone' });
      g.on(body, () => {
        g.re(34.5, 47, 2.2, 15, 24, b);
        g.re(40.5, 46, .7, 13, 28, lt(b, .1));
        for (const [x, y, r] of [[21.5, 51, 1.1], [27, 55, .9], [44.5, 52.5, 1], [43, 40.5, .8], [36.5, 56, .8]]) g.e(x, y, r, r * .8, dk(a, .22), { shade: false });
        for (const [x, y, r] of [[22, 44, .7], [45.5, 46.5, .7], [30, 57, .7], [26, 40, .6]]) g.dot(x, y, r, dk(a, .3));
        for (const [x, y] of [[29, 38.5], [24, 47.5], [45, 50], [31.5, 53]]) g.dot(x, y, .5, lt(a, .4));
      });
      crack(g, body, [46.3, 43, 44.2, 45.2, 45, 47.4, 43.2, 49.4], dk(a, .38));
      // moss cap and a sprout
      const moss = g.fur(35, 37, 5.5, 2.4, d, { n: 7, amp: .35, a0: -180, a1: 0, mat: 'fur' });
      void moss;
      g.tube([35, 36, 35.5, 32, 34.5, 29.5], .55, .45, d);
      K.leaf(g, 34.8, 30.5, -60, 5.5, 1.8, e); K.leaf(g, 35.2, 30, 45, 5, 1.7, d);
      g.eye(25.5, 45.6, 2.7, 'angry', { iris: '#c87a2a', lid: a, side: -1, look: -.2 });
      g.eye(34, 45, 2.4, 'angry', { iris: '#c87a2a', lid: a, side: 1, look: -.2 });
      g.mo('frown', 28.5, 51, 3.8);
    }
  });

  // ---------------------------------------------------------------- Cobblore
  BEAST('cobblore', {
    pal: { a: '#9a968e', b: '#f2eee4', c: '#5e5a54', d: '#6a9a4a', e: '#8ac060', f: '#b6b0a4', h: '#a8927c' }, keep: ['b'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const cob = (x, y, rx, ry, ang, col) => g.re(x, y, rx, ry, ang, col, { mat: 'stone' });
      const speck = (id, list, col) => g.on(id, () => { for (const [x, y, r] of list) g.e(x, y, r, r * .8, col, { shade: false }); });
      // far arm and the back of the heap
      cob(52.5, 37, 4.6, 4.2, 20, far(a, .3)); cob(56, 44.5, 4.2, 4, 0, far(f, .3));
      const ff = cob(56.5, 52.5, 6, 5.2, -10, far(h, .3));
      crack(g, ff, [58, 48.5, 56.5, 51, 58, 53], far(c, .3));
      cob(46, 45, 9.5, 9, 10, far(f, .22)); cob(43, 30.5, 7.5, 6, -8, far(a, .22));
      // feet
      g.e(42, 59.7, 5.6, 2.3, far(c, .15)); g.e(19.5, 60, 5.8, 2.4, c);
      // base cobbles
      const bs2 = cob(38.5, 52.5, 10, 7, 6, h);
      speck(bs2, [[41, 50, .9], [44, 54, .8], [35, 56, .7]], dk(h, .25));
      crack(g, bs2, [44.5, 47, 42.5, 49.5, 43.5, 52], dk(h, .4));
      const bs1 = cob(20.5, 53, 8.8, 6.6, -8, f);
      speck(bs1, [[16, 52, .9], [20, 56.5, .8], [25, 55, .7]], dk(f, .25));
      // top cobbles
      const t1 = cob(36, 26.5, 7.8, 6, 12, f);
      speck(t1, [[38, 24.5, .8], [41, 28, .7]], dk(f, .25));
      crack(g, t1, [33, 21.5, 34.5, 24, 33.5, 26], dk(f, .4));
      const t2 = cob(25.5, 28.5, 5.8, 4.6, -15, h);
      void t2;
      // moss creeping between the stones, and the sprout grown into a leafy sprig
      g.fur(31, 31.5, 6, 2.6, d, { n: 7, amp: .35, a0: -180, a1: 0, mat: 'fur' });
      g.tube([32, 30.5, 32.5, 25, 31, 19.5], .7, .55, d);
      K.leaf(g, 32.2, 25.5, 55, 6.5, 2, d, dk(d, .25)); K.leaf(g, 32, 23.5, -65, 6, 1.9, e, d);
      K.leaf(g, 31.4, 20.5, -25, 6, 2, e, d); K.leaf(g, 31.2, 20.3, 30, 5.2, 1.8, d, dk(d, .25));
      // the big face stone, still wearing Pebblit's quartz band
      const face = cob(28.5, 40.5, 13.2, 11.2, -4, a);
      g.on(face, () => { g.re(35, 40.5, 2.3, 14, 26, b); g.re(40.5, 39.5, .7, 12, 30, lt(b, .1)); });
      speck(face, [[19, 45, 1], [24, 49.5, .9], [38, 47, .9], [30, 31.5, .7], [17, 37, .7]], dk(a, .22));
      crack(g, face, [15.8, 41, 18, 42.5, 17.4, 44.8, 19.5, 46], dk(a, .38));
      g.fur(28.5, 51, 7.5, 2, d, { n: 8, amp: .4, a0: 0, a1: 180, mat: 'fur' });
      // near arm: a chain of cobbles ending in a fist stone
      cob(16.5, 45, 4.6, 4.2, 0, h); cob(12, 49.5, 4.2, 4, 0, a);
      const fist = cob(9.5, 55, 6.3, 5.3, -12, f);
      speck(fist, [[7, 55, .9], [11.5, 57.5, .8]], dk(f, .25));
      crack(g, fist, [12.5, 50.5, 11, 52.5, 12, 54.5], dk(f, .4));
      // stubborn face
      g.eye(22.8, 38.8, 2.8, 'sleepy', { iris: '#d0702a', lid: a, side: -1, brow: 1, browCol: dk(a, .5), look: -.3 });
      g.eye(31.6, 38.2, 2.5, 'sleepy', { iris: '#d0702a', lid: a, side: 1, brow: 1, browCol: dk(a, .5), look: -.3 });
      g.mo('teeth', 26.2, 44.2, 5.4, { h: 2.6 });
    }
  });

  // ---------------------------------------------------------------- Torgolem
  BEAST('torgolem', {
    pal: { a: '#948f88', b: '#f2eee4', c: '#524e48', d: '#5a8a3a', e: '#8ab860', f: '#b4ada0', h: '#a862b0', k: '#d4c870' }, keep: ['b'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const slab = (cx, cy, w, hh, r, ang, col) => g.p(rrect(cx, cy, w, hh, r, ang), col, { mat: 'stone', bevel: 2.4 });
      const lichen = (id, list) => g.on(id, () => { for (const [x, y, r, col] of list) g.fur(x, y, r, r * .75, col, { n: 6, amp: .3, shade: false }); });
      const heather = (x, y, n, s = 1) => { for (let i = 0; i < n; i++) { const ang = -40 + i * 80 / Math.max(1, n - 1), [tx, ty] = K.pt(x, y, ang, 4.2 * s); g.l(x, y, tx, ty, .45, dk(d, .2)); g.fur(tx, ty - .3, 1.5 * s, 1.3 * s, i % 2 ? h : lt(h, .15), { n: 5, amp: .35, mat: 'fur' }); } };
      // far arm: stacked blocks down to a fist resting on the moor
      slab(51.5, 28, 13, 10, 4, 10, far(a)); slab(55, 39, 10.5, 10, 3.6, 5, far(f));
      const ffist = slab(55.5, 51.5, 13, 11, 4.2, -4, far(a));
      crack(g, ffist, [58, 46, 56, 50, 57.5, 53.5], far(c, .2));
      // legs
      slab(42.5, 55.5, 13, 10, 3.6, 0, far(a, .15));
      const lg = slab(23, 55.5, 14, 10, 3.6, 0, f);
      crack(g, lg, [21, 51, 22.5, 54, 21.5, 57.5], dk(f, .4));
      // wind-bent rowan growing from the far shoulder
      g.tube([44, 22, 46, 15, 50, 10, 55, 7], 1.3, .8, dk(c, .1));
      g.tube([48.5, 12, 45.5, 8, 46, 5], .7, .5, dk(c, .1));
      for (const [x, y, rx, ry, col] of [[54.5, 6.5, 5.2, 3.6, d], [47.5, 5.5, 4, 2.8, d], [58.5, 9.5, 3.2, 2.4, dk(d, .1)], [52, 5, 3.2, 2.4, e]]) g.fur(x, y, rx, ry, col, { n: 8, amp: .3, mat: 'fur' });
      for (const [x, y] of [[53, 9.2], [55, 9.8], [49, 8.2]]) g.c(x, y, .9, '#d8402a', { gloss: true });
      // torso: three weathered slabs stacked like a tor
      const s1 = slab(33, 46.5, 30, 11, 4.5, -2, a);
      const s2 = slab(34, 36, 36, 11, 4.8, 2, f);
      const s3 = slab(32, 25, 34, 11, 4.8, -3, a);
      const slabs = [s1, s2, s3];
      g.on(slabs, () => { g.l(40, 18, 30, 52, 1, b); g.l(41.5, 19, 31.5, 52, .45, lt(b, .1)); });
      crack(g, s2, [24, 31.5, 25.5, 35, 24, 38.5, 25, 41], dk(f, .42));
      crack(g, s3, [47, 20, 45.5, 23.5, 47, 27], dk(a, .42));
      crack(g, s1, [44, 41.5, 42.5, 45, 44, 48.5, 43, 51.5], dk(a, .42));
      lichen(s2, [[46, 34.5, 2.2, k], [20, 39, 1.8, lt(k, .25)], [50, 38.5, 1.3, lt(k, .25)]]);
      lichen(s1, [[22, 48, 1.8, k], [38, 50, 1.4, lt(k, .25)]]);
      lichen(s3, [[22, 22.5, 1.6, lt(k, .25)], [44, 27, 1.4, k]]);
      // moss along the ledges
      g.fur(45, 30.5, 7, 1.8, d, { n: 7, amp: .45, a0: -180, a1: 0, mat: 'fur' });
      g.fur(22, 41.5, 6, 1.6, d, { n: 6, amp: .45, a0: -180, a1: 0, mat: 'fur' });
      // head: a capstone sunk between the shoulders
      const hd = slab(27.5, 14.5, 18, 12, 5, 3, f);
      lichen(hd, [[33.5, 10.5, 1.5, k]]);
      heather(24, 9, 4, 1); heather(31, 8.6, 3, .9);
      g.fur(27, 9.5, 7.5, 1.8, d, { n: 8, amp: .4, a0: -180, a1: 0, mat: 'fur' });
      // near arm
      slab(12.5, 28, 13, 10, 4, -10, a); slab(9.5, 39, 10.5, 10, 3.6, -5, f);
      const fist = slab(9.5, 51.5, 14, 11.5, 4.4, 4, a);
      crack(g, fist, [7, 46, 9, 49.5, 7.5, 53], dk(a, .42));
      lichen(fist, [[12.5, 55, 1.6, k]]);
      heather(10, 23, 3, .9);
      // deep-set glowing eyes under a mossy brow, with a moss beard
      if (!g.back) g.on(hd, () => { g.e(22.5, 14.5, 3.4, 2.6, dk(f, .45)); g.e(31, 14, 3, 2.4, dk(f, .45)); });
      g.eye(22.5, 14.8, 2, 'glow', { iris: '#ffd860' });
      g.eye(31, 14.3, 1.8, 'glow', { iris: '#ffd860' });
      if (!g.back) g.fur(26, 20.2, 6.5, 2.4, d, { n: 9, amp: .3, a0: 0, a1: 180, mat: 'fur' });
      g.mo('line', 25.5, 20.6, 3.6);
    }
  });

  // glowing seam (molten crack): hot line clipped to parts, with brighter spots along it
  const seam = (g, ids, pts, w = .55, c1 = '#ff7a1c', c2 = '#ffe060') => {
    const r = g.tiny ? Math.max(w, 1.25) : g.small ? Math.max(w, .85) : w, got = [];
    g.on(ids, () => { for (let i = 0; i + 3 < pts.length; i += 2) got.push(g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], r, c1, { shade: false })); });
    if (c2 && !g.small) g.on(got, () => { for (let i = 2; i + 2 < pts.length; i += 2) g.e(pts[i], pts[i + 1], r * 1.5, r * 1.2, c2, { shade: false }); });
    return got;
  };

  // ---------------------------------------------------------------- Coalby
  BEAST('coalby', {
    pal: { a: '#3a353f', b: '#625c6c', c: '#ff7020', d: '#ffd040', e: '#fff2b0' }, keep: [], sh: 170,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const pad = (id, x, y, s) => g.on(id, () => { g.e(x, y, 2.3 * s, 1.8 * s, c, { mat: 'glow' }); for (const k of [-1, 0, 1]) g.e(x + k * 1.9 * s, y - 2.5 * s + Math.abs(k) * .5 * s, .75 * s, .7 * s, c, { mat: 'glow' }); });
      const glint = (id, pts) => g.on(id, () => { for (let i = 0; i + 3 < pts.length; i += 2) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], .4, lt(b, .45), { shade: false }); });
      // stub tail and far foot
      g.p([43, 52, 47.5, 50, 49.5, 54, 46, 57], far(a, .2), { mat: 'stone', bevel: 1.4 });
      const ff = g.e(38.5, 57.6, 4.3, 3.3, far(a, .22), { mat: 'stone' });
      if (!g.back) pad(ff, 37.9, 58.2, .85);
      // body: a squat lump of coal
      const body = g.p([21.5, 58, 19.5, 50, 22, 43.5, 28, 40, 38, 40.5, 44, 44.5, 46, 52, 43.5, 58.5, 33, 60, 25, 59.5], a, { mat: 'gloss', bevel: 3 });
      g.on(body, () => g.p([38.5, 42, 43.5, 45.5, 45, 51, 40.5, 48], b));
      if (!g.back) {
        // the warm ember showing through its belly
        const glow = mk(g, body, () => g.e(30.5, 50.5, 6.6, 5.6, c, { mat: 'glow' }));
        const core = mk(g, glow, () => g.e(30, 51, 4.2, 3.4, d, { mat: 'glow' }));
        g.on([glow, core], () => { for (const [x1, y1, x2, y2] of [[30.5, 44.5, 29.5, 48.5], [29.5, 48.5, 25.5, 51], [29.5, 48.5, 33.5, 52], [33.5, 52, 37.5, 51], [33.5, 52, 32.5, 57]]) g.l(x1, y1, x2, y2, .4, a, { shade: false }); });
      } else seam(g, body, [33, 42, 31, 46.5, 33.5, 50, 31.5, 54.5], .55);
      // near foot, sole forward, and a stubby arm
      const nf = g.e(23, 57.4, 4.8, 3.6, a, { mat: 'stone' });
      if (!g.back) pad(nf, 22.2, 58, 1);
      g.tube([23.5, 45, 20.8, 48.5, 20.5, 51.5], 2.8, 2.4, a, { mat: 'stone' });
      // ears: two rounded coal nubs lit from inside
      const e2 = g.p([35.5, 22, 36, 16.5, 40, 13.8, 44.2, 16.5, 45, 22.5], far(a, .2), { mat: 'stone', bevel: 1.4 });
      g.on(e2, () => g.p([38, 21, 38.2, 17.6, 40.2, 16.2, 42.2, 17.8, 42.6, 21.5], mix(c, a, .3), { mat: 'glow' }));
      const e1 = g.p([15.5, 23.5, 15.2, 17, 19.8, 14, 24.8, 16.2, 26, 22.5], a, { mat: 'stone', bevel: 1.4 });
      g.on(e1, () => g.p([17.8, 22, 17.6, 18, 20, 16.2, 22.6, 17.8, 23.2, 21.5], c, { mat: 'glow' }));
      // head: a bigger, shinier lump
      const head = g.p([15.5, 33.5, 15, 26.5, 18.5, 21, 25, 18, 35, 18, 42, 21.5, 45.5, 28, 44.5, 35, 39.5, 40.5, 29, 42, 20.5, 40], a, { mat: 'gloss', bevel: 3.2 });
      g.on(head, () => { g.p([20.5, 22.5, 26.5, 19.5, 33.5, 20, 29, 23.6, 22.5, 25.6], b); g.p([40.5, 24, 43.6, 28.5, 43, 33.5, 39.5, 30], b); });
      glint(head, [22.5, 25.6, 29, 23.6, 33.5, 20]);
      glint(body, [40.5, 48, 38.5, 42]);
      seam(g, head, [39.5, 20.5, 38, 24, 40, 26.5, 38.5, 29.5], .5);
      if (!g.back) g.on(head, () => g.e(24.5, 36, 7, 4.6, lt(b, .12)));
      // little flame tuft
      K2.flame(g, 30.5, 18.6, 8.5, 3.6, -6, c, d, e);
      // drowsy face, mid-yawn
      g.eye(22.6, 28.8, 3.3, 'sleepy', { iris: '#ff9a1e', lid: a, side: -1 });
      g.eye(33.4, 28.4, 3, 'sleepy', { iris: '#ff9a1e', lid: a, side: 1 });
      g.nose(21.6, 33.4, 'tri', { s: .9 });
      g.mo('o', 24.2, 37.2, 5.4, { col: '#ff8a1e' });
      flat(g, f => { f.fe(24.2, 37.8, 1, .9, '#ffe060'); f.fe(17.6, 34.4, 1.6, 1, '#ff7a28'); f.fe(39.5, 34.2, 1.6, 1, '#ff7a28'); });
    }
  });

  // ---------------------------------------------------------------- Cinderock
  BEAST('cinderock', {
    pal: { a: '#3e363e', b: '#625866', c: '#ff6010', d: '#ffd040', e: '#ff9a30', f: '#a89ca4' }, keep: ['f'], sh: 170,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const plate = (pts, col, bev = 2) => g.p(pts, col, { mat: 'stone', bevel: bev });
      const ash = (id, list) => g.on(id, () => { for (const [x, y, rx, ry] of list) g.e(x, y, rx, ry, mix(b, f, .45)); });
      // smoke drifting off the back vent
      g.tube([40, 9, 44.5, 6.5, 43, 2.8], 1.1, 2.3, f, { mat: 'glow', oc: dk(f, .35) });
      // stub tail
      plate([52.5, 36, 58.5, 33.5, 60.5, 38, 57, 42.5], far(a, .15));
      // far legs
      g.tube([46, 44, 48.5, 52, 47.5, 58], 4.4, 3.8, far(a)); plate([42, 61, 42.5, 57.6, 47, 56.5, 52.5, 57.6, 53, 61], far(b, .35), 1.3);
      g.tube([19.5, 44, 16.5, 51, 16, 57.5], 4.2, 3.6, far(a)); plate([10.5, 61, 11, 57.6, 15.5, 56.5, 21, 57.6, 21.5, 61], far(b, .35), 1.3);
      // clinker crags and the main vent along the spine
      plate([24.5, 30, 24.5, 21.5, 28.5, 16.5, 32, 21.5, 33, 29], far(b, .12));
      plate([43, 30, 44.5, 22.5, 49, 20.5, 51.5, 26, 51.5, 32], far(b, .12));
      plate([50, 34, 52, 28, 55.5, 27.5, 57, 32.5, 56, 37], far(b, .2));
      const vent = plate([32, 28, 34, 15.5, 42, 15.5, 44, 28], b);
      g.on(vent, () => g.e(38, 16.2, 3.6, 1.5, c, { mat: 'glow' }));
      seam(g, vent, [36, 19, 37.5, 22.5, 36.5, 26], .5);
      K2.flame(g, 38, 15.8, 10.5, 3.6, 5, c, d, '#fff6c8');
      // body
      const body = g.re(38, 38, 18, 12.5, 8, a, { mat: 'stone' });
      g.on(body, () => { g.p([30, 28, 39, 27, 47, 30, 44, 35, 34, 34], b); g.p([45, 36, 53, 38, 54, 44, 48, 42], b); });
      ash(body, [[38, 28.5, 5, 1.2], [49, 38.5, 2.6, 1]]);
      seam(g, body, [34, 27.5, 36.5, 32.5, 34.5, 37, 38, 41.5, 37, 47], .6);
      seam(g, body, [36.5, 32.5, 41.5, 35, 44.5, 33.5], .55);
      seam(g, body, [38, 41.5, 42.5, 44], .55);
      // near hind leg
      const haunch = g.e(49, 43, 8, 9, a, { mat: 'stone' });
      seam(g, haunch, [46, 37.5, 49, 41, 47.5, 45, 50.5, 48], .6);
      const hl = g.tube([50, 48.5, 52, 54, 51, 58], 4.8, 4.2, a, { mat: 'stone' });
      seam(g, hl, [52.5, 51.5, 50.5, 54.5, 52, 57], .5);
      plate([45, 61.4, 45.5, 57.8, 49.5, 56.4, 55.5, 57.4, 57, 61.4], b, 1.4);
      K2.claws(g, 47.2, 60.2, 3, 4, 1.4, -1, f);
      // near front leg and shoulder
      const sho = g.e(27, 40.5, 8.6, 10.5, a, { mat: 'stone' });
      g.on(sho, () => g.p([21, 34.5, 27, 31.5, 33, 34.5, 30, 39.5, 23, 39.5], b));
      ash(sho, [[27, 32.6, 3.4, 1]]);
      seam(g, sho, [22, 37.5, 25.5, 41, 24.5, 45, 28, 47.5], .6);
      const fl = g.tube([26.5, 47.5, 25, 54, 25.5, 58], 5, 4.4, a, { mat: 'stone' });
      seam(g, fl, [27.5, 50.5, 25, 53.5, 26.5, 56.5], .5);
      plate([19, 61.4, 19.5, 57.8, 24, 56.4, 30.5, 57.4, 32, 61.4], b, 1.4);
      K2.claws(g, 21.4, 60.2, 3, 4, 1.4, -1, f);
      // chimney ears
      const h1 = plate([21.5, 22.5, 22, 15.8, 26.6, 15.8, 27.6, 23], b, 1.2);
      g.on(h1, () => g.e(24.3, 16.3, 2.4, 1, c, { mat: 'glow' }));
      K2.flame(g, 24.3, 16, 4.6, 2.1, -4, c, d, null);
      const h2 = plate([8.2, 24.5, 8.6, 17.8, 13.2, 17.4, 14.4, 23.5], b, 1.2);
      g.on(h2, () => g.e(10.9, 18.2, 2.2, 1, c, { mat: 'glow' }));
      K2.flame(g, 10.9, 17.8, 4.4, 2, -10, c, d, null);
      // lower jaw, dropped in a growl
      const jaw = plate([4.5, 38.5, 12, 39.5, 19, 38.5, 20.5, 42.5, 16.8, 46, 8.5, 46.2, 4.2, 43], b, 1.8);
      // broad skull and short muzzle
      const head = plate([6, 30.5, 7.5, 24.5, 13, 20.5, 21.5, 20, 27.5, 23.5, 30, 30, 28.5, 36.5, 23, 40.5, 13, 40.8, 7.5, 37.5], a, 3.2);
      ash(head, [[17.5, 21.8, 4.5, 1]]);
      seam(g, head, [25.5, 26.5, 27.5, 30.5, 26, 34.5], .5);
      const muz = plate([2.4, 32.5, 7.5, 30, 13.2, 31, 14.2, 37.2, 8, 38.8, 3, 37.2], b, 1.8);
      if (!g.back) {
        // the furnace glow behind its teeth
        g.on([head, jaw, muz], () => { g.p([4, 37.4, 10, 38.4, 18.5, 38, 19.5, 41.4, 12, 42, 5, 41.4], e, { mat: 'glow' }); g.p([6, 38.8, 11, 39.5, 17.5, 39.2, 17.5, 40.6, 11.5, 41, 6.5, 40.6], d, { mat: 'glow' }); });
        K2.ear(g, 5.6, 37.2, 184, 3.4, 1.2, f); K2.ear(g, 11, 38.2, 178, 3, 1.1, f);
        K2.ear(g, 8, 42.2, -6, 3.8, 1.2, f); K2.ear(g, 14, 42.4, 6, 3.4, 1.1, f);
      }
      // brow plate
      plate([8.5, 26.2, 14.5, 22.4, 23.5, 22.6, 26.8, 26, 19.5, 26, 11.5, 27.8], b, 1.5);
      g.eye(13.4, 29.8, 2.6, 'angry', { iris: '#ff5a10', sc: '#ffd84a', lid: b, side: -1 });
      g.eye(21.2, 29.2, 2.2, 'angry', { iris: '#ff5a10', sc: '#ffd84a', lid: b, side: 1 });
      g.nose(4.6, 33.6, 'nostrils', { s: .9 });
    }
  });

  // ---------------------------------------------------------------- crystal helpers
  // points along an ellipse arc (t in degrees: 0 = right, 90 = down), rotated by ang around its centre
  const arc = (cx, cy, rx, ry, ang, t0, t1, n = 10) => { const f = rot(cx, cy, ang), out = []; for (let i = 0; i <= n; i++) { const t = (t0 + (t1 - t0) * i / n) * Math.PI / 180; out.push(...f(Math.cos(t) * rx, Math.sin(t) * ry)); } return out; };
  // faceted crystal growing from (x, y) along ang (degrees clockwise from up); w = half width, h = length
  const gem = (g, x, y, w, h, ang, col, o = {}) => {
    const f = loc(x, y, ang), k = o.tip ?? .7;
    const id = g.p([...f(0, -w), ...f(h * k, -w), ...f(h, 0), ...f(h * k, w), ...f(0, w)], col, { mat: 'gloss', bevel: Math.min(1.3, w * .7), lt: lt(col, .5), ...(o.opt || {}) });
    if (!g.tiny) g.on(id, () => {
      g.p([...f(0, w * .2), ...f(h * k, w * .2), ...f(h, 0), ...f(h * k, w), ...f(0, w)], dk(col, .17));
      if (w > 1.2) g.p([...f(0, -w), ...f(h * k, -w), ...f(h * k + (h - h * k) * .45, -w * .5), ...f(h * k, -w * .4), ...f(0, -w * .4)], lt(col, .38));
    });
    return id;
  };
  // four-point sparkle
  const twinkle = (g, x, y, s, col = '#ffffff') => { if (g.tiny) return; g.dot(x, y, .5, col); if (g.small) return; flat(g, f => { f.fl(x - s, y, x + s, y, .42, col, true); f.fl(x, y - s, x, y + s, .42, col, true); }); };

  // ---------------------------------------------------------------- Glintle
  BEAST('glintle', {
    pal: { a: '#9a8a7a', b: '#c0b0a0', c: '#b478ec', d: '#ecd6ff', e: '#6a5a4a', f: '#f6efe6' }, keep: ['f'], sh: 140,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const rind = (id, pits, bumps) => g.on(id, () => { for (const [x, y, r] of pits) g.e(x, y, r, r * .8, dk(a, .2), { shade: false }); for (const [x, y, r] of bumps) g.e(x, y, r, r * .7, b); });
      // stubby feet
      g.e(39.5, 58.9, 3.7, 2.4, far(e, .15), { mat: 'stone' }); g.e(25.5, 59.3, 3.9, 2.5, e, { mat: 'stone' });
      // the lid: the top of the nodule, lifted on a psychic hum
      const cf = rot(40.5, 26.5, 18);
      for (const [dx, h, col] of [[-5, 3, c], [-.5, 4, d], [4, 3, c]]) gem(g, ...cf(dx, .6), 1.1, h, 198, col);
      const dome = arc(40.5, 26.5, 9.6, 6.4, 18, 180, 360, 12); dome.push(...cf(9.6, 1.4), ...cf(-9.6, 1.4));
      const cap = g.p(dome, a, { mat: 'stone', bevel: 2.6 });
      g.on(cap, () => g.re(...cf(0, 1.1), 10.5, .8, 18, f));
      rind(cap, [[37, 23.5, .9], [44.5, 24.5, .8], [41, 21.6, .7]], [[35.5, 21.5, 1.6]]);
      // the nodule itself: a dull, knobbly bowl
      const bowl = g.e(32, 48.6, 13.6, 10.8, a, { mat: 'stone' });
      rind(bowl, [[21.5, 47, 1], [23.5, 54.5, .9], [41, 55, 1], [43.5, 48.5, .9], [31, 57.5, .8], [36.5, 56.5, .7]], [[22.5, 43.5, 1.8], [41.5, 44, 1.5]]);
      crack(g, bowl, [44.5, 44, 42.8, 46.2, 44, 48.4, 42.4, 50.2], dk(a, .4));
      // opening: agate bands around a crystal-lined hollow
      const rim = g.re(32, 40.4, 12.4, 4.7, -4, f, { g: 901 });
      const band = mk(g, rim, () => g.re(32, 40.7, 10.9, 3.8, -4, d));
      mk(g, band, () => g.re(32, 41, 9.5, 2.9, -4, dk(c, .55)));
      // rows of little crystals
      for (const [x, h, w, ang, col] of [[25, 6.5, 1.5, -24, c], [29, 10, 1.8, -9, d], [33.5, 11.5, 2, 4, c], [38, 8, 1.6, 20, d]]) gem(g, x, 41.8, w, h, ang, col);
      for (const [x, h, w, ang, col] of [[27, 5, 1.3, -14, c], [31.2, 6.5, 1.4, -2, d], [35.8, 5.5, 1.3, 12, c]]) gem(g, x, 43, w, h, ang, lt(col, .12));
      const lip = g.p([...arc(32, 40.4, 12.4, 4.7, -4, 0, 180), ...arc(32, 41, 9.5, 2.9, -4, 180, 0)], f, { g: 901, bevel: .8 });
      g.on(lip, () => g.re(32, 40.7, 10.9, 3.8, -4, d));
      twinkle(g, 24, 31, 1.5, d); twinkle(g, 49.5, 37.5, 1.2, d);
      // shy, sparkly face
      g.eye(26.4, 49.6, 2.9, 'star', { iris: '#9a58e4', side: -1, look: -.3 });
      g.eye(35.2, 49.2, 2.6, 'star', { iris: '#9a58e4', side: 1, look: -.3 });
      g.mo('o', 30.4, 54.4, 2.6);
      g.blush(22.6, 53, 1.6); g.blush(39.2, 52.4, 1.5);
    }
  });

  // ---------------------------------------------------------------- Geodazzle
  BEAST('geodazzle', {
    pal: { a: '#8a7a6a', b: '#b0a090', c: '#b070e8', d: '#f0d4ff', e: '#78dcf4', f: '#f6efe6', h: '#f48ac4', k: '#f6d860', m: '#84e0a4' }, keep: ['f'], sh: 140,
    draw(g) {
      const { a, b, c, d, e, f, h, k, m } = g.P;
      const rind = (id, pits, bumps) => g.on(id, () => { for (const [x, y, r] of pits) g.e(x, y, r, r * .8, dk(a, .2), { shade: false }); for (const [x, y, r] of bumps) g.e(x, y, r, r * .7, b); });
      // a curved shard of the old lid, still lined with agate and tiny crystals on its inner face
      const piece = (cx, cy, R, r, t0, t1, tips) => {
        for (const [t, col] of tips) { const q = t * Math.PI / 180, px = cx + Math.cos(q) * (r + .6), py = cy + Math.sin(q) * (r + .6); gem(g, px, py, 1, 3, Math.atan2(cx - px, py - cy) * 180 / Math.PI, col); }
        const id = g.p([...arc(cx, cy, R, R, 0, t0, t1, 8), ...arc(cx, cy, r, r, 0, t1, t0, 8)], a, { mat: 'stone', bevel: 1.3 });
        g.on(id, () => { const q = arc(cx, cy, r + .55, r + .55, 0, t0, t1, 8); for (let i = 0; i + 3 < q.length; i += 2) g.l(q[i], q[i + 1], q[i + 2], q[i + 3], .55, f); });
        return id;
      };
      // crystal legs: far one first
      gem(g, 36, 53, 2, 8, 172, far(c, .3));
      // crystals bursting through the sides of the shell
      gem(g, 16, 46, 1.9, 7.5, -98, h); gem(g, 17.5, 51.5, 1.5, 5.5, -122, k);
      gem(g, 46, 44, 2, 8, 84, e); gem(g, 45, 50.5, 1.6, 6, 112, m);
      // the great fan of crystals (back row)
      gem(g, 20.5, 37.5, 2.3, 15, -40, k); gem(g, 41.5, 37.5, 2.3, 15, 38, m);
      gem(g, 25, 37, 2.8, 21, -18, h); gem(g, 37, 37, 2.8, 21, 17, e);
      gem(g, 31, 36.5, 3.3, 26, 0, c);
      // the cracked shell
      const bowl = g.e(31, 45.5, 17, 12.4, a, { mat: 'stone' });
      rind(bowl, [[17.5, 43, 1], [19.5, 52, 1], [43, 53, 1.1], [45, 45.5, 1], [29, 56.2, .9], [36, 55.4, .8]], [[18, 40, 2], [43.5, 40.5, 1.8]]);
      seam(g, bowl, [15.5, 44.5, 19, 46.2, 18.2, 49.6, 21.5, 51.8], .5, c, d);
      seam(g, bowl, [46.5, 42, 43.6, 44.4, 44.8, 47.6, 42, 49.6, 43.2, 53], .5, c, d);
      seam(g, bowl, [29.5, 57.5, 31, 54.5, 29.8, 52.6], .45, c, d);
      // crystal legs
      gem(g, 23.5, 54.5, 2.2, 7.5, 196, c); gem(g, 39.5, 54.5, 2.1, 7.2, 160, lt(c, .1));
      // opening: agate bands around the hollow
      const rim = g.re(31, 36.6, 15.6, 5.4, -3, f, { g: 902 });
      const band = mk(g, rim, () => g.re(31, 36.9, 13.9, 4.4, -3, d));
      mk(g, band, () => g.re(31, 37.2, 12.3, 3.5, -3, dk(c, .55)));
      // front row of smaller crystals
      for (const [x, hh, w, ang, col] of [[22.5, 6, 1.4, -34, d], [27, 9, 1.7, -10, lt(c, .25)], [34.8, 8.5, 1.7, 9, d], [39.6, 6, 1.4, 30, lt(h, .2)]]) gem(g, x, 39.2, w, hh, ang, col);
      const lip = g.p([...arc(31, 36.6, 15.6, 5.4, -3, 0, 180, 12), ...arc(31, 37.2, 12.3, 3.5, -3, 180, 0, 12)], f, { g: 902, bevel: .8 });
      g.on(lip, () => g.re(31, 36.9, 13.9, 4.4, -3, d));
      // shards of the old lid, ringing around the crown
      piece(16.5, 19.5, 9.6, 6.4, 148, 262, [[172, c], [205, d], [238, c]]);
      piece(45.5, 19, 9.6, 6.4, 278, 378, [[300, d], [330, c], [358, d]]);
      gem(g, 6.5, 33, 1.5, 4.2, 0, e, { tip: .5 }); gem(g, 6.5, 33.6, 1.5, 4.2, 180, e, { tip: .5 });
      gem(g, 57, 31, 1.5, 4.2, 0, h, { tip: .5 }); gem(g, 57, 31.6, 1.5, 4.2, 180, h, { tip: .5 });
      twinkle(g, 43.5, 8, 1.6, d); twinkle(g, 18.5, 9.5, 1.4, d); twinkle(g, 11, 38.5, 1.2, d);
      // serene, humming face with a third-eye gem
      if (!g.back) { const te = g.p([30.4, 41.2, 32.6, 43.6, 30.4, 46, 28.2, 43.6], e, { mat: 'gloss', bevel: .9, lt: lt(e, .6) }); void te; }
      g.eye(23.6, 48.6, 3, 'closed', { side: -1, lash: true });
      g.eye(37, 48.2, 2.7, 'closed', { side: 1, lash: true });
      g.mo('smile', 30, 52.6, 3.4);
      g.blush(20.4, 51.6, 1.7); g.blush(40.6, 51, 1.6);
    }
  });

  // ---------------------------------------------------------------- Ichthlet
  // bedding lines of the rock a stony part was cut from (the same grain runs through every part)
  const grain = (g, id, col, gap = 2, ang = 14) => { if (!g.small) K2.stripes(g, id, 0, 0, 64, 64, ang, gap, .5, col); return id; };
  // paddle-shaped flipper from a shoulder point: ang is the direction it points (degrees clockwise from up)
  const paddle = (g, x, y, ang, len, w, col, o = {}) => { const F = loc(x, y, ang); return g.p([...F(0, -w * .55), ...F(len * .45, -w), ...F(len * .86, -w * .72), ...F(len, -w * .1), ...F(len * .92, w * .55), ...F(len * .5, w * .85), ...F(0, w * .5)], col, { mat: 'stone', bevel: 1.3, ...o }); };

  BEAST('ichthlet', {
    pal: { a: '#86a2ac', b: '#dce8e4', c: '#4e6874', d: '#c4a472', e: '#e8d6a6' }, keep: ['b'], sh: 150,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const stone = (id, col = d) => grain(g, id, dk(col, .3));
      // far front flipper
      stone(paddle(g, 20.5, 47.5, 262, 10.5, 2.7, far(d, .28)), far(d, .28));
      // tail fluke, still solid stone
      stone(g.p([52.4, 32.6, 53.8, 25.4, 58.6, 18, 57.2, 26.6, 61, 34.4, 56.2, 31.8], d, { mat: 'stone', bevel: 1.2 }));
      // dorsal fin: a slab of the same stone
      stone(g.p([32.5, 42, 39.5, 31, 41.6, 42.5], d, { mat: 'stone', bevel: 1.2 }));
      // chubby body and a tapering head
      let body, head;
      g.group(() => {
        body = g.tube([24, 42, 33, 47.8, 43, 47, 50, 41, 53.4, 33.5], 8.8, 2.2, a, { taper: t => Math.pow(t, 1.8) });
        head = g.tube([23, 37.2, 17, 35.2, 10.5, 35.8, 5.6, 35.6], 8.8, 1.8, a, { taper: t => Math.pow(t, .85) });
      });
      g.on([body, head], () => {
        g.tube([9, 32, 18, 29.4, 26, 35.5, 35, 42, 44, 42, 49.5, 37.5, 52, 32], 3.4, 2.2, mix(a, c, .55));
        g.tube([4.5, 38.8, 11, 41.6, 19, 46, 30, 55.4, 42, 54.6, 50, 46.5], 2, 3.4, b);
      });
      K2.spots(g, body, [[37, 45, 1.5, 1.1], [42.5, 44.6, 1.1, .9]], mix(a, c, .6));
      // stone scutes down the tail
      for (const [x, y, ang] of [[45, 40.2, -30], [49.2, 35.8, -55]]) stone(g.p(rrect(x, y, 4, 2.4, .9, ang), d, { mat: 'stone', bevel: 1 }));
      // stony flippers
      stone(paddle(g, 42.5, 51, 140, 8.5, 2.5, d));
      stone(paddle(g, 26.5, 49.5, 226, 14, 3.7, d));
      // great round eye in a ring of bone
      if (!g.back) {
        const ring = g.e(18.4, 33.2, 5, 5, e, { mat: 'stone' });
        if (!g.small) g.on(ring, () => { for (let i = 0; i < 10; i++) { const [x1, y1] = K.pt(18.4, 33.2, i * 36 + 10, 3.4), [x2, y2] = K.pt(18.4, 33.2, i * 36 + 10, 5.1); g.l(x1, y1, x2, y2, .3, dk(e, .3), { shade: false }); } });
      }
      g.eye(18.4, 33.2, 3.6, 'cute', { iris: '#2ab4a4', side: -1 });
      flat(g, f => { f.fchain([5.6, 37, 9.5, 38, 14, 39.2, 16.6, 38.2], .42, '#1b1328'); f.fp([8.2, 37.8, 9.6, 38.2, 8.8, 39.4], '#ffffff'); });
      g.blush(22.4, 40.4, 1.9);
    }
  });

  // ---------------------------------------------------------------- Ichthorn
  BEAST('ichthorn', {
    pal: { a: '#64808e', b: '#d2deda', c: '#32465a', d: '#b89058', e: '#ead8a8' }, keep: ['b'], sh: 150,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const stone = (id, col = d) => grain(g, id, dk(col, .3));
      const plate = (x, y, w, hh, ang, col = d) => stone(g.p(rrect(x, y, w, hh, 1.5, ang), col, { mat: 'stone', bevel: 1.6 }), col);
      // far front flipper
      stone(paddle(g, 21, 40, 248, 15.5, 3.6, far(d, .3)), far(d, .3));
      // tail fluke
      stone(g.p([55.2, 32, 53.8, 23, 49.6, 12.5, 56, 18.6, 61.8, 14.6, 59.8, 24.6, 59, 32], d, { mat: 'stone', bevel: 1.4 }));
      // dorsal fin: a blade of stone
      stone(g.p([37, 36, 47.8, 22.5, 48.6, 32.5, 46.5, 42.5], d, { mat: 'stone', bevel: 1.5 }));
      // body rearing up, tail curled behind
      let body, head, uj, lj;
      g.group(() => {
        body = g.tube([22, 24.5, 29, 33, 38, 42, 47, 48.5, 55, 47, 58.5, 39, 57, 30], 9.2, 2.6, a, { taper: t => Math.pow(t, 2.2) });
        head = g.e(17.5, 21, 9.4, 8.4, a);
        lj = g.p([3.4, 30, 14, 27.6, 18, 30.6, 15, 33, 5.2, 32.2], a, { bevel: 1.2 });
        uj = g.p([10, 14.4, 1.2, 26.4, 1.8, 28.6, 14.5, 27.6], a, { bevel: 1.6 });
      });
      g.on([body, head, uj], () => g.tube([8, 16.5, 16, 13.4, 25, 18, 32, 27, 41, 36.5, 50, 43, 56.5, 41, 57.5, 31], 3.8, 2, mix(a, c, .6)));
      g.on([body, head, lj], () => g.tube([4, 32, 12, 32.6, 17, 35, 22, 42, 30, 50, 41, 57, 52, 55.5], 1.5, 3.6, b));
      K2.spots(g, body, [[36.5, 43, 1.8, 1.3], [42, 47.5, 1.4, 1], [53, 46.6, 1.2, .9]], mix(a, c, .65));
      // plates of fossil stone down the back
      plate(28.4, 20.4, 8, 5, 50); plate(34.8, 27.6, 8, 5, 48); plate(51, 43.2, 7, 4.4, 28); plate(57.6, 37, 5, 3.4, -78);
      // near hind flipper
      stone(paddle(g, 44, 53, 236, 9.5, 2.9, d));
      // near front flipper propping it up, under a stone shoulder with an ammonite in it
      stone(paddle(g, 26, 40.5, 216, 22, 5, d));
      const sh = g.p([21.5, 33.5, 27.5, 30.5, 33.5, 34, 34, 41, 28.5, 45, 22.5, 42.5], e, { mat: 'stone', bevel: 1.8 });
      if (!g.small) g.on(sh, () => { let px = 28, py = 37.9; for (let i = 1; i <= 26; i++) { const t = i * .52, r = .5 + i * .135, x = 28 + Math.cos(t) * r, y = 37.9 + Math.sin(t) * r * .92; g.l(px, py, x, y, .32, dk(e, .38), { shade: false }); px = x; py = y; } });
      // stone brow and the narwhal horn
      stone(g.p([9.6, 15.6, 14, 11.4, 21.5, 11, 25.5, 14.4, 21.5, 16.6, 14.5, 16.4], d, { mat: 'stone', bevel: 1.4 }));
      const horn = g.tube([13, 13.5, 8.6, 7.4, 4.4, 1.6], 2.1, .5, e, { mat: 'gloss' });
      K2.stripes(g, horn, 2, 1, 15, 15, 28, 2.1, .55, dk(e, .32));
      // eye in its ring of bone
      if (!g.back) {
        const ring = g.e(15.8, 20.6, 4.2, 4.2, e, { mat: 'stone' });
        if (!g.small) g.on(ring, () => { for (let i = 0; i < 10; i++) { const [x1, y1] = K.pt(15.8, 20.6, i * 36 + 10, 2.8), [x2, y2] = K.pt(15.8, 20.6, i * 36 + 10, 4.3); g.l(x1, y1, x2, y2, .3, dk(e, .3), { shade: false }); } });
        // open jaws full of teeth
        g.p([2.6, 28.2, 14, 27, 15.2, 28.8, 4, 30.4], '#5a1830', { shade: false });
        K2.zig(g, 2.6, 27.8, 13.6, 26.8, 5, 1.5, '#fbf8ee', { bevel: .5 });
        K2.zig(g, 13.4, 29.6, 4.6, 30.6, 4, 1.4, '#fbf8ee', { bevel: .5 });
      }
      g.eye(15.8, 20.6, 2.8, 'slit', { sc: '#f6d44a', side: -1, brow: 1 });
    }
  });

  // ---------------------------------------------------------------- Ambrix
  BEAST('ambrix', {
    pal: { a: '#c07a28', b: '#f4c458', c: '#5a3614', d: '#fbeab8', e: '#e25a22', f: '#2aa69a' }, keep: [], sh: 140,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // long glassy wing with veins and a stigma near the tip
      const wing = (x, y, ang, len, w, col, vein) => {
        const F = loc(x, y, ang);
        const id = g.p([...F(0, -w * .2), ...F(len * .22, -w * .7), ...F(len * .6, -w), ...F(len * .9, -w * .8), ...F(len, -w * .15), ...F(len * .95, w * .5), ...F(len * .7, w * .85), ...F(len * .3, w * .6), ...F(0, w * .2)], col, { mat: 'gloss', bevel: 1.2, oc: mix(vein, '#1b1328', .25), lt: '#fffaf0' });
        g.on(id, () => {
          g.l(...F(len * .04, -w * .05), ...F(len * .95, -w * .5), .42, vein);
          if (!g.small) { g.l(...F(len * .12, w * .12), ...F(len * .9, w * .3), .32, mix(col, vein, .45), { shade: false }); for (const t of [.3, .52, .72]) g.l(...F(len * t, -w * .4), ...F(len * (t + .06), w * .8), .3, mix(col, vein, .45), { shade: false }); }
          g.re(...F(len * .87, -w * .66), w * .26, len * .05, ang, e);
        });
        return id;
      };
      const leg = (pts, col = c, r = .8) => { g.tube(pts, r, r * .7, col); const n = pts.length, x = pts[n - 2], y = pts[n - 1]; g.p([x - .7, y - .5, x + .7, y - .2, x - .9, y + 1.9], col, { bevel: .4 }); };
      // far wings
      wing(25.5, 24, -34, 22, 4.2, mix(d, a, .32), mix(c, a, .35)); wing(30, 24.5, 30, 22, 4.4, mix(d, a, .32), mix(c, a, .35));
      // far legs
      leg([30.5, 36, 31, 40.5, 30.5, 44.5], mix(c, a, .3), .65);
      // long segmented abdomen ending in a bead of amber
      const ab = g.tube([34, 31.5, 43, 35, 51, 41, 55, 49, 52.5, 56, 46.5, 57.5], 3.2, 1.7, a, { mat: 'gloss' });
      g.on(ab, () => { g.tube([34, 33.4, 43, 37, 50.4, 42.6, 53.6, 49.4, 51.6, 54.8, 46.5, 58.4], 1.2, .9, b); for (const [x, y, ang] of [[40, 33.8, 22], [46, 37.4, 38], [50.8, 41.4, 54], [54, 46.4, 76], [54.2, 51.8, 110], [50.8, 56.4, 152]]) { const [x1, y1] = K.pt(x, y, ang, 3.4), [x2, y2] = K.pt(x, y, ang + 180, 3.4); g.l(x1, y1, x2, y2, .45, c); } });
      const drop = g.e(44.6, 57.2, 3, 2.6, b, { mat: 'gloss' });
      g.on(drop, () => g.e(44.2, 57.6, .9, .7, c, { shade: false }));
      // thorax still locked in a nugget of raw amber
      const nug = g.p([20.5, 29, 23.5, 23.6, 30.5, 22.4, 35.6, 26, 36.2, 32.6, 32, 36.6, 24.5, 36.2, 21, 33.4], b, { mat: 'gloss', bevel: 2.2, lt: '#fff4c8' });
      g.on(nug, () => { g.e(28.5, 30, 5, 3.6, mix(a, c, .25)); g.p([29.5, 23.2, 35, 26.6, 35.4, 31.5, 32.5, 28], lt(b, .3)); });
      if (!g.small) g.on(nug, () => { g.e(24, 33.6, .7, .7, d, { shade: false }); g.e(33.2, 34, .6, .6, d, { shade: false }); });
      // near legs
      leg([23, 35.4, 18, 37, 15.5, 41.5]); leg([27.5, 36.8, 25, 41.5, 26.5, 46.5]); leg([33, 36, 37, 40, 36, 46]);
      // head
      g.tube([17.5, 21.6, 16, 18.4, 13, 17], .45, .35, c); g.tube([20.4, 21, 21, 17.6, 19, 15.2], .45, .35, c);
      const head = g.e(17, 27.4, 6.2, 5.8, a, { mat: 'gloss' });
      g.on(head, () => g.e(15.5, 29.8, 4, 2.8, b));
      if (!g.back) { K2.ear(g, 11.8, 31.6, -150, 4.2, 1.2, d); K2.ear(g, 15.4, 32.6, -168, 3.6, 1.1, d); }
      // near wings
      wing(26.5, 24.6, -66, 27, 4.8, d, c); wing(31, 25, 60, 28, 5.2, d, c);
      g.eye(12.6, 25.8, 3.7, 'compound', { iris: f });
      g.eye(20.2, 23.8, 2.8, 'compound', { iris: f });
    }
  });

  // ---------------------------------------------------------------- Saplet
  // lobed oak leaf growing from a stalk point; ang = direction (degrees clockwise from up), w = half width
  const oakLeaf = (g, x, y, ang, len, w, col, vein, o = {}) => {
    const F = loc(x, y, ang), L = [], R = [];
    for (const [t, k] of [[0, .14], [.1, .3], [.2, .62], [.3, .4], [.42, .95], [.54, .58], [.66, 1], [.77, .56], [.87, .72], [.95, .34], [1, 0]]) { L.push(...F(len * t, -w * k)); if (t < 1) R.unshift(...F(len * t, w * k)); }
    const id = g.p([...L, ...R], col, { bevel: 1.1, ...o });
    if (vein) g.on(id, () => { g.l(...F(len * .04, 0), ...F(len * .92, 0), .4, vein, { shade: false }); if (!g.small && len > 8) for (const [t, k] of [[.42, .7], [.66, .75]]) { g.l(...F(len * (t - .12), 0), ...F(len * t, -w * k), .3, vein, { shade: false }); g.l(...F(len * (t - .12), 0), ...F(len * t, w * k), .3, vein, { shade: false }); } });
    return id;
  };
  // bark ridges: short dark strokes painted onto a part
  const bark = (g, id, list, col) => g.on(id, () => { for (const [x1, y1, x2, y2] of list) g.l(x1, y1, x2, y2, .45, col, { shade: false }); });

  BEAST('saplet', {
    pal: { a: '#9a7048', b: '#72c858', c: '#3a8a3a', d: '#e2c08c', e: '#c8f08a' }, keep: ['d'], sh: -60,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      // little roots planted in the ground
      for (const [pts, col] of [[[37.5, 56, 41, 58.5, 44.5, 60.8], far(a, .18)], [[36, 57, 37.5, 59.5, 38.5, 61.4], far(a, .18)], [[26.5, 56, 23, 58.5, 19.5, 60.8], a], [[28, 57, 26.5, 59.5, 25.5, 61.4], a], [[32, 58, 32, 60, 31.5, 61.6], a]]) g.tube(pts, 1.7, .8, col);
      // far leaf
      oakLeaf(g, 32.6, 33.5, 56, 14, 5, far(b, .16), far(c, .1));
      // stubby trunk of a body
      const body = g.e(32, 49.5, 9.2, 9.6, a);
      bark(g, body, [[38.5, 43.5, 39.5, 48], [40, 50, 39.5, 55], [36.5, 55, 36, 58], [25, 43.5, 24.4, 46.5]], dk(a, .3));
      if (!g.back) g.on(body, () => g.e(29.4, 50.4, 6.9, 7.3, d));
      else bark(g, body, [[30, 44, 29.4, 49], [33.5, 50, 34, 56], [27, 52, 27.4, 56.5]], dk(a, .3));
      // sprout and near leaf
      g.tube([32.2, 41, 32.6, 37, 32, 33], 1.2, .9, c);
      oakLeaf(g, 32, 34, -62, 15.5, 5.4, b, c);
      K.leaf(g, 32.2, 33.4, 4, 5.5, 1.9, e, b);
      // fast asleep in the sun
      g.eye(26.4, 49.6, 2.7, 'closed', { side: -1 });
      g.eye(33, 49.2, 2.4, 'closed', { side: 1 });
      g.mo('smile', 29.6, 53.6, 2.8);
      g.blush(23.8, 52.6, 1.7); g.blush(35.6, 52.2, 1.5);
    }
  });

  // ---------------------------------------------------------------- Oakling
  BEAST('oakling', {
    pal: { a: '#8a6040', b: '#5cb04a', c: '#2e6e32', d: '#dcb884', e: '#8ad468', f: '#b07a3c' }, keep: ['d'], sh: -60,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const clump = (x, y, rx, ry, col, n) => g.fur(x, y, rx, ry, col, { n, amp: .16, mat: 'fur' });
      const acorn = (x, y, s = 1) => { g.e(x, y + 1.3 * s, 1.5 * s, 1.9 * s, f, { gloss: true }); g.e(x, y, 1.9 * s, 1.2 * s, dk(a, .15)); };
      const toes = (x, y, dir, col) => { for (const k of [-1, 0, 1]) g.tube([x, y, x + dir * 3 + k * 2.2, y + 2.2 - Math.abs(k) * .5], 1.5, .8, col); };
      // far arm, fist on hip
      g.tube([40.5, 43, 47.5, 44.5, 46.5, 50, 42.5, 51], 2.2, 1.9, far(a, .2));
      // root legs, planted wide
      g.tube([38, 54, 41, 57.5, 42, 59], 3.2, 2.6, far(a, .2)); toes(42.5, 59, 1, far(a, .2));
      g.tube([26.5, 54, 23.5, 57.5, 22.5, 59], 3.4, 2.8, a); toes(22, 59, -1, a);
      // back of the crown
      clump(43, 24.5, 8.4, 6.6, far(c, .1), 9); clump(38.5, 14.5, 7.4, 5.8, far(c, .1), 8);
      // trunk
      const body = g.e(32, 45.5, 10.4, 12.2, a);
      bark(g, body, [[39.5, 38, 41, 44], [41.5, 47, 40.5, 53], [37, 52, 36.6, 56.5], [24, 38.5, 23, 42]], dk(a, .32));
      if (!g.back) g.on(body, () => g.e(29, 46, 7.6, 8.6, d));
      else bark(g, body, [[29, 37, 28, 44], [33.5, 44, 34.5, 52], [26.5, 48, 27, 55]], dk(a, .32));
      // leafy crown with acorns
      clump(21, 25.5, 8.4, 6.6, c, 9);
      clump(32, 21.5, 13, 9.6, b, 13);
      clump(26.5, 15, 7.2, 5.6, b, 8);
      const top = clump(34.5, 13.5, 6.4, 5, e, 8);
      void top;
      g.on(g.parts.length, () => {});
      if (!g.small) for (const [x, y, ang] of [[27, 21, -40], [36, 20.5, 30], [22, 26, -70], [31.5, 26.5, 10], [40.5, 24.5, 60]]) K.leaf(g, x, y, ang, 4.2, 1.5, e, null);
      acorn(24.5, 30.5); acorn(39.5, 30, .9);
      // near arm raised, wagging a twiggy finger
      g.tube([23.5, 42.5, 16.5, 42, 12, 37], 2.4, 1.9, a);
      g.tube([12, 37, 10.6, 32.5, 10.4, 28.4], 1.5, .8, a);
      g.tube([12.4, 36.6, 14.8, 34.2], 1.2, .8, a); g.tube([11.6, 37.2, 8.6, 35.2], 1.2, .8, a);
      K.leaf(g, 10.6, 31, -62, 4.6, 1.6, e, null);
      // twig nose
      if (!g.back) { g.tube([27, 47.4, 22.5, 46.6, 19.5, 45.2], 1.4, .8, a); K.leaf(g, 21.4, 46, -30, 4.2, 1.5, b, null); }
      // stern little face
      g.eye(25.4, 43.2, 2.7, 'round', { iris: '#4a8a2a', side: -1, brow: 1, look: -.4 });
      g.eye(32.6, 42.8, 2.4, 'round', { iris: '#4a8a2a', side: 1, brow: 1, look: -.4 });
      g.mo('open', 28.6, 50.2, 4, { h: 2.6 });
    }
  });

  // ---------------------------------------------------------------- Greenwarden
  BEAST('greenwarden', {
    pal: { a: '#6a4a30', b: '#4a9a3c', c: '#236030', d: '#dcc090', e: '#f0dc60', f: '#8ad06a', h: '#b07a3c' }, keep: ['d'], sh: -60,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const acorn = (x, y, s = 1) => { g.e(x, y + 1.3 * s, 1.5 * s, 1.9 * s, h, { gloss: true }); g.e(x, y, 1.9 * s, 1.2 * s, dk(a, .15)); };
      const twigs = (x, y, list, col) => { for (const [ang, len] of list) { const [tx, ty] = K.pt(x, y, ang, len); g.tube([x, y, tx, ty], 1.1, .6, col); } };
      const mote = (x, y, r) => { g.c(x, y, r, e, { mat: 'glow', lt: '#fffbd0' }); };
      // far bough, raised
      const fa = far(a, .2);
      g.tube([41, 42, 49.5, 41, 55, 34.5, 57.5, 26.5], 2.9, 1.5, fa);
      twigs(57.5, 26.5, [[-28, 5], [8, 6], [42, 5]], fa);
      for (const [x, y, ang] of [[54.5, 22, -30], [58.6, 20, 10], [61, 23.4, 48], [53, 31, -60]]) oakLeaf(g, x, y, ang, 6, 2.2, far(b, .15), null);
      // roots
      g.tube([39, 50, 45, 55.5, 52, 59.6], 3.6, 1.5, fa); g.tube([46, 56, 47, 60.6], 1.3, .8, fa);
      g.tube([25, 50, 19, 55.5, 12, 59.6], 3.8, 1.6, a); g.tube([18, 56, 17, 60.8], 1.4, .8, a);
      g.tube([32, 52, 31, 57, 28.5, 61.2], 3.2, 1.5, a);
      // leaves behind the head
      for (let i = 0; i < 9; i++) { const ang = -136 + i * 34; const [x, y] = K.pt(31, 23, ang, 7.5); oakLeaf(g, x, y, ang, 12.5, 4, c, dk(c, .3)); }
      // trunk and a mantle of leaves
      const body = g.e(32, 46.5, 10.2, 10.4, a);
      bark(g, body, [[27, 44, 26, 50], [31.5, 46, 32.5, 53], [37.5, 43.5, 38.5, 50], [35, 52, 34.6, 56]], dk(a, .32));
      g.fur(32, 39.5, 13.6, 6.2, c, { n: 11, amp: .3, a0: -10, a1: 190, mat: 'fur' });
      // near bough, with a mote of forest light above its hand
      g.tube([23, 42, 14.5, 40.5, 9, 33.5, 7, 25.5], 3.1, 1.6, a);
      twigs(7, 25.5, [[-40, 5], [-4, 6], [34, 5]], a);
      for (const [x, y, ang] of [[11, 37.5, -110], [8, 30.5, -80]]) oakLeaf(g, x, y, ang, 6, 2.2, b, null);
      mote(6.6, 14.2, 2.5); mote(12.6, 10.6, 1.1); mote(2.8, 20, .9);
      // inner ring of leaves
      for (let i = 0; i < 8; i++) { const ang = -119 + i * 34; const [x, y] = K.pt(31, 23.5, ang, 7); oakLeaf(g, x, y, ang, 9.5, 3.4, i % 2 ? b : f, c); }
      acorn(22, 9.5); acorn(41, 10.5, .9);
      // the face: pale heartwood, carved like the Green Man
      const face = g.p([22.6, 19, 26, 14.6, 36, 14.6, 39.4, 19, 39, 27, 35.6, 33, 31, 35.6, 26.4, 33, 23, 27], d, { bevel: 2 });
      void face;
      if (!g.back) {
        // beard and moustache of leaves spilling from the mouth
        oakLeaf(g, 27.4, 32.4, 204, 8.5, 2.8, b, c); oakLeaf(g, 34.4, 32.4, 158, 8, 2.7, b, c); oakLeaf(g, 30.8, 33, 180, 10, 3.2, f, c);
        flat(g, ff => { ff.fe(30.6, 31.2, 2.2, 1.3, '#1b1328'); });
        oakLeaf(g, 29.6, 30.8, -112, 10, 2.8, b, c); oakLeaf(g, 31.8, 30.8, 110, 9.4, 2.7, c, dk(c, .3));
        g.p([30.2, 22.6, 28.4, 28.4, 31.8, 28.8], dk(d, .14), { bevel: .9 });
        // leafy brows
        oakLeaf(g, 30, 20.4, -74, 8.6, 2.4, c, null); oakLeaf(g, 31.6, 20.2, 70, 8, 2.3, c, null);
      }
      g.eye(26.6, 23.8, 2.5, 'hollow', { iris: e, side: -1 });
      g.eye(34.6, 23.4, 2.2, 'hollow', { iris: e, side: 1 });
    }
  });
})();