// ---- art/b8 ----
// ===== Batch 8: churchyard yews, wreck ghosts, heath adders and moorland horses =====
(() => {
  // a flat spray of yew needles: a serrated feather shape
  const frond = (g, x, y, ang, len, w, col, n = 5, o) => {
    const L = [], R = [], st = len / (n + .7);
    for (let i = 0; i < n; i++) {
      const ww = w * (1 - .5 * i / n);
      const [ax, ay] = K.pt(x, y, ang, st * i), [bx, by] = K.pt(x, y, ang, st * (i + .85));
      const [n1x, n1y] = K.pt(ax, ay, ang - 90, ww * .38), [t1x, t1y] = K.pt(bx, by, ang - 90, ww);
      const [n2x, n2y] = K.pt(ax, ay, ang + 90, ww * .38), [t2x, t2y] = K.pt(bx, by, ang + 90, ww);
      L.push(n1x, n1y, t1x, t1y); R.unshift(t2x, t2y, n2x, n2y);
    }
    const [tx, ty] = K.pt(x, y, ang, len);
    return g.p([...L, tx, ty, ...R], col, o);
  };
  const flat = (P) => { const o = []; for (const [x, y] of P) o.push(x, y); return o; };
  // dense Catmull-Rom samples through flat [x, y, ...] control points
  const spline = (p, seg = 7) => {
    const P = []; for (let i = 0; i < p.length; i += 2) P.push([p[i], p[i + 1]]);
    const out = [], f = (a, b, c, d, t) => .5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
      for (let k = 0; k < seg; k++) out.push([f(p0[0], p1[0], p2[0], p3[0], k / seg), f(p0[1], p1[1], p2[1], p3[1], k / seg)]);
    }
    out.push(P[P.length - 1]); return out;
  };
  const arc = (cx, cy, rx, ry, a0, a1, n = 28) => { const P = []; for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * i / n) * Math.PI / 180; P.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); } return P; };
  // path shifted sideways (positive = right-hand side of travel)
  const shift = (P, d) => P.map(([x, y], i) => { const q = P[Math.min(i + 1, P.length - 1)], r = P[Math.max(i - 1, 0)], dx = q[0] - r[0], dy = q[1] - r[1], L = Math.hypot(dx, dy) || 1; return [x - dy / L * d, y + dx / L * d]; });
  // the adder's warning: a zigzag band running along a path, clipped to parts
  const zigzag = (g, ids, P, off, amp, w, col, step) => {
    const pts = []; let need = 0, k = 0;
    for (let i = 1; i < P.length; i++) {
      const dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1], L = Math.hypot(dx, dy) || 1e-6;
      while (need <= L) { const t = need / L, sd = off + (k++ % 2 ? amp : -amp); pts.push([P[i - 1][0] + dx * t - dy / L * sd, P[i - 1][1] + dy * t + dx / L * sd]); need += step; }
      need -= L;
    }
    g.on(ids, () => { for (let i = 1; i < pts.length; i++) g.l(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], w, col); });
  };
  // a yew berry: red cup with the dark seed peeping out
  const aril = (g, x, y, r, col) => { g.c(x, y, r, col, { gloss: true }); if (!g.tiny) g.dot(x - r * .1, y + r * .38, r * .42, '#2c2a1c'); };

  BEAST('yewling', {
    pal: { a: '#2a5a3a', b: '#7cba68', c: '#e02838', d: '#9af0d0', e: '#7a4c30', f: '#c89a6a' }, keep: ['c', 'e', 'f'], sh: -62,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      void d;
      // root feet
      g.tube([35, 56, 39, 58.5, 42.5, 59.6], 2.2, 1.2, dk(e, .2));
      g.tube([28, 56, 24, 58.6, 20, 59.8], 2.4, 1.3, e);
      g.tube([32, 57, 33, 59.4, 35.5, 60.4], 2.2, 1.2, e);
      // little trunk body with flaky bark
      const trunk = g.p([25, 44, 39, 44, 40.5, 52, 39, 58.5, 26, 58.5, 24, 52], e, { mat: 'stone' });
      g.on(trunk, () => {
        g.e(30, 54, 4.6, 5.4, f);
        for (const [x, y, h] of [[36.5, 47, 5], [38.2, 53, 3.5], [26.2, 50, 3]]) g.l(x, y, x + .4, y + h, .45, dk(e, .3));
      });
      // far arm on the hip
      g.tube([39, 47.5, 44.5, 49, 41.5, 53], 1.5, 1.2, dk(e, .15));
      // swept-back crest of needle sprays
      for (const [x, y, ang, len] of [[39, 27, 52, 15.5], [42, 34, 92, 13], [35, 25, 20, 13.5]]) frond(g, x, y, ang, len, 4.6, dk(a, .1), 5);
      // foliage head
      const head = g.fur(30.5, 33.5, 12.6, 11.2, a, { n: 13, amp: .1, mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(26, 36.6, 10.6, 7.8, b));
      // top-knot sprouts and a berry sprig on the crown
      frond(g, 30, 25, -16, 9.5, 3.2, b, 4); frond(g, 33, 25.5, 24, 8.5, 3, b, 4);
      aril(g, 22.6, 25.6, 2.6, c); aril(g, 27, 22.6, 2.8, c); aril(g, 19.4, 30, 2.1, c);
      // a pair dangling like an earring
      g.l(42.6, 39, 43.6, 42, .5, e, { ring: false }); aril(g, 44, 43.8, 2.3, c);
      // near arm raised: "don't eat these!"
      g.tube([25.5, 47.5, 19, 47, 15, 42], 1.6, 1.25, e);
      K.leaf(g, 15, 42.2, -50, 5.6, 2.1, b, a); K.leaf(g, 15, 42.2, 4, 6.4, 2.1, b, a);
      // proud little face
      g.eye(22.6, 35.8, 3, 'round', { iris: '#18a888', side: -1, look: -.4, brow: 1, browCol: a });
      g.eye(31.8, 35.6, 2.8, 'happy', { side: 1 });
      g.mo('smirk', 26.4, 41, 4.8);
      g.blush(19.4, 39.8, 1.6); g.blush(34.8, 39.2, 1.5);
    }
  });

  BEAST('yewdirge', {
    pal: { a: '#1e4a2e', b: '#3f8450', c: '#e02030', d: '#9af0d0', e: '#6a442a', f: '#2a1a14', h: '#b08a5e' }, keep: ['c', 'e', 'f', 'h'], sh: -62,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = dk(e, .25);
      // bare silver snags of dead wood
      g.tube([44, 12, 52, 6, 58, 4], 1.4, .7, '#b8b0a0'); g.tube([51, 7, 52, 3.4], .9, .5, '#b8b0a0');
      // far bough, drooping like a mourner's sleeve
      g.tube([44, 31, 52, 31, 56.5, 38, 55.5, 46], 3.2, 2, far, { mat: 'stone' });
      for (const [ang, len] of [[156, 9], [182, 11], [208, 9]]) frond(g, 55.5, 45, ang, len, 3, dk(a, .15), 4);
      // roots
      g.tube([42, 50, 50, 54, 57, 59.6], 4, 1.8, far, { mat: 'stone' });
      g.tube([24, 50, 16, 55, 8, 59.6], 4.2, 1.8, e, { mat: 'stone' });
      g.tube([37, 53, 40, 58, 45, 60], 3.4, 1.6, e, { mat: 'stone' });
      g.tube([29, 53, 27, 58, 23, 60.2], 3.4, 1.6, e, { mat: 'stone' });
      // ancient fluted trunk
      const trunk = g.p([20, 55, 19, 44, 21, 33, 23.5, 24, 43.5, 24, 46, 34, 47.5, 45, 46, 55, 33, 58], e, { mat: 'stone' });
      g.on(trunk, () => {
        for (const [x, y, x2, y2] of [[42, 27, 44.5, 50], [38.5, 26, 39.5, 37], [22.5, 42, 22, 54], [26, 44, 25.6, 56]]) g.l(x, y, x2, y2, .5, dk(e, .32));
        g.e(28, 34.5, 8.8, 7.8, h);
      });
      // the hollow, shaped like a church window, and the kindly heart within
      g.p([30, 55.5, 30, 48.5, 32, 44.6, 34.6, 42, 37.2, 44.6, 39.2, 48.5, 39.2, 55.5], f, { shade: false });
      g.c(34.6, 50.2, 3.4, mix(d, '#ffffff', .1), { mat: 'glow', oc: '#3a8a78' });
      g.dot(34.6, 50.2, 1.5, '#ffffff');
      // near bough
      g.tube([21, 31, 13, 30.5, 8.5, 37, 9, 45], 3.4, 2.1, e, { mat: 'stone' });
      for (const [ang, len] of [[152, 9], [180, 12], [206, 10]]) frond(g, 9, 44.5, ang, len, 3.2, a, 4);
      aril(g, 12.4, 47.4, 2, c);
      // canopy
      for (const [x, y, ang, len] of [[9.5, 20, 202, 8.5], [15, 23, 186, 8], [50, 23, 172, 8], [55, 19.5, 156, 8.5]]) frond(g, x, y, ang, len, 3.2, dk(a, .14), 4);
      g.fur(47, 15.5, 11, 8.6, dk(a, .1), { n: 12, amp: .16, mat: 'fur' });
      g.fur(17, 15.5, 11.5, 8.8, a, { n: 12, amp: .16, mat: 'fur' });
      g.fur(32, 14.4, 17, 10, a, { n: 18, amp: .13, mat: 'fur' });
      for (const [x, y, ang, len] of [[19, 11.5, -30, 7], [29, 10, -6, 7], [40, 10.5, 22, 7], [13, 16.5, -70, 7], [36, 16, 150, 8]]) frond(g, x, y, ang, len, 3, b, 4);
      for (const [x, y, r] of [[12.5, 20.5, 2.2], [22, 21.6, 2], [34, 7, 2.2], [45.5, 11, 2.3], [52.5, 18.6, 2.1], [41, 20.6, 2], [26.5, 12.6, 1.9]]) aril(g, x, y, r, c);
      // mossy brows and a gentle old face
      if (!g.back) {
        g.re(24.4, 28, 3.6, 1.5, -14, b); g.re(33.6, 27.6, 3.2, 1.4, 14, b);
        g.e(21.8, 35.6, 2.7, 2.2, mix(h, e, .4));
      }
      g.eye(25.2, 32, 2.7, 'sleepy', { iris: '#e8a030', lid: h, side: -1 });
      g.eye(33.2, 31.6, 2.4, 'sleepy', { iris: '#e8a030', lid: h, side: 1 });
      g.mo('smile', 27.6, 38.6, 5.6);
    }
  });

  BEAST('wreckling', {
    pal: { a: '#c8e8f0', b: '#f4fdff', c: '#2a4a6a', d: '#5a8a4a', e: '#e8c050', f: '#7ab4d0' }, keep: ['b', 'e'], sh: 100,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // drips
      if (!g.small) { g.e(27, 60.4, 5, 1.1, f, { shade: false }); g.dot(36, 57.6, .9, f); }
      // curling wave-tail
      g.tube([35, 49, 42, 55, 49, 53.5, 51.5, 48, 48, 45.6], 5, 1.3, a, { mat: 'soft' });
      // far hand, waving
      g.e(43.6, 41, 2.8, 2.5, mix(a, c, .16), { mat: 'soft' });
      // body: a salt-water wisp with a ragged hem
      const body = g.group(() => {
        g.e(30, 41, 12.2, 12.6, a, { mat: 'soft' });
        g.p([19.5, 46, 21, 55, 24.5, 51.5, 27, 57.5, 30.5, 52.5, 34, 57, 36.5, 51.5, 40, 53, 41, 46], a, { mat: 'soft' });
      });
      g.on(body, () => g.e(27, 44.5, 7.5, 6.5, b));
      // seaweed caught on the cap
      g.tube([40.5, 27.5, 44.5, 31, 43.5, 36], 1.5, .9, d); K.leaf(g, 43.8, 35.4, 150, 5.5, 1.8, d, dk(d, .3));
      // the skipper's cap, far too big
      const crown = g.re(31.5, 24.6, 12.4, 5.8, -9, c);
      g.on(crown, () => g.re(31, 22.6, 9, 2.6, -9, lt(c, .12)));
      const band = g.p([19.6, 28.6, 43, 24.8, 43.6, 28.6, 20.4, 32.6], dk(c, .22));
      g.on(band, () => g.l(20, 30.4, 43.4, 26.6, .5, e));
      g.re(21.5, 33.2, 8, 2.5, 8, dk(c, .4), { gloss: true });
      g.c(27.4, 28.4, 2.3, e, { mat: 'metal' }); g.dot(27.4, 28.4, .9, dk(e, .35));
      // offering a lost button
      g.tube([20.5, 44, 15.5, 45.5, 12, 44], 2.7, 2.3, a, { mat: 'soft' });
      g.c(9.2, 41.4, 4.5, e, { mat: 'metal' });
      g.c(9.2, 41.4, 2.9, dk(e, .14), { ring: false });
      for (const [x, y] of [[7.9, 40.1], [10.5, 40.1], [7.9, 42.7], [10.5, 42.7]]) g.dot(x, y, .8, '#5a3a14');
      // face
      g.eye(24.4, 39.4, 3.1, 'button', { side: -1 });
      g.eye(33.6, 38.9, 2.8, 'button', { side: 1 });
      g.mo('open', 28.4, 44.6, 4.2, { h: 3 });
      g.blush(20.6, 43.2, 1.7); g.blush(37.2, 42.4, 1.5);
    }
  });

  BEAST('shipwraith', {
    pal: { a: '#d4ecf0', b: '#6a4a30', c: '#2a2a3a', d: '#9af0e0', e: '#f0c050', f: '#2a4a6a' }, keep: ['b', 'e'], sh: 95,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const mist = mix(d, '#ffffff', .5), W = '#f4fffc', so = { mat: 'soft', oc: mix(f, a, .25) };
      // masts, yards and a tattered pennant
      g.l(43, 5, 43, 41, 1.1, dk(b, .15)); g.l(27.5, 11, 27.5, 41, 1, dk(b, .15));
      g.p([43, 2.6, 54, 3.6, 50, 5.4, 55.5, 8, 43, 7.6], f);
      g.l(34, 9.5, 52, 9.5, .8, b); g.l(32, 22.5, 55, 22.5, .8, b); g.l(19, 15.5, 36, 15.5, .8, b);
      // sails of mist, ragged where they fade away
      g.p([35, 10, 51, 10, 52.5, 16, 51, 21, 47.5, 18.6, 44, 21.4, 40, 18.6, 36, 20.8, 33.6, 15.5], a, so);
      g.p([33, 23, 54, 23, 56, 30, 54.5, 37.5, 50.5, 33.8, 46.5, 38.6, 42, 34.4, 37.5, 38, 34, 35.5, 31, 29.5], a, so);
      g.p([20, 16, 35, 16, 36, 24, 34.5, 33.5, 31, 30.4, 27.5, 34.6, 23.5, 31, 20, 34, 17.2, 25], a, so);
      if (!g.small) for (const [x, y] of [[27.5, 37], [42, 37.2], [51, 36.6], [20, 36.4]]) g.e(x, y, 1, 1.4, mist, { mat: 'glow', oc: mix(f, a, .4) });
      // hull
      const hull = g.p([12, 33.5, 12.6, 45, 18, 54.5, 28, 58.4, 49, 58.4, 57.5, 53.5, 61, 34, 52.5, 35.6, 46, 39.6, 27, 39.8, 18.5, 36.4], b);
      g.on(hull, () => {
        g.tube([12, 36.2, 19, 39.2, 27, 42, 46, 41.8, 53, 38.2, 61, 36.4], .75, .75, e);
        g.tube([34, 48.6, 48, 48.4, 59, 44.6], .38, .38, dk(b, .32));
        g.tube([30, 55, 48, 54.6, 57.6, 51], .38, .38, dk(b, .32));
        for (const [x, y] of [[53.4, 43], [57.4, 42]]) g.e(x, y, 1.3, 1.7, d, { mat: 'glow' });
      });
      // a stove-in hole, splintered planks round the edge
      g.p([41, 48.4, 44, 46.4, 45.6, 47.8, 48, 45.4, 50.8, 47.8, 52.4, 50.4, 49.6, 51.4, 50, 54, 46.4, 52.6, 43.8, 54, 43.2, 51, 40.4, 50.6], c, { shade: false });
      // bowsprit and the swinging lantern
      g.tube([15, 35, 9, 29.5, 4.4, 26], 1.4, .7, b);
      g.l(5.4, 27, 7, 30.6, .4, c, { ring: false });
      g.p([5.4, 30.4, 8.6, 30, 9.4, 31.4, 4.8, 32], c);
      g.p([4.6, 31.8, 9.6, 31.2, 10.8, 37.6, 5.6, 38.4], e, { mat: 'metal' });
      g.e(7.7, 34.8, 1.7, 2.2, '#fffbd8', { mat: 'glow', ring: false });
      // fog the hull rises from
      g.group(() => { for (const [x, y, rx, ry] of [[14, 58.4, 9, 2.8], [31, 59, 11, 2.8], [48, 58.8, 10, 2.8], [56.6, 57.4, 4.8, 2.4]]) g.e(x, y, rx, ry, mist, { mat: 'glow', oc: mix(f, a, .35) }); });
      // a lost soul-light keeping watch
      K2.flame(g, 59, 25, 5.6, 2.8, 8, d, mist, W);
      // the bow is its face
      g.eye(19.4, 46, 3.5, 'hollow', { iris: d, side: -1, brow: -1, browCol: dk(b, .45) });
      g.eye(29, 45.5, 3.1, 'hollow', { iris: d, side: 1, brow: -1, browCol: dk(b, .45) });
      g.mo('frown', 22.6, 52.6, 5.4);
    }
  });

  BEAST('addersnip', {
    pal: { a: '#c2a672', b: '#2a2420', c: '#f2e4be', d: '#e8603a' }, keep: ['b', 'c'], sh: 170,
    draw(g) {
      const { a, b, c, d } = g.P;
      // tail, held up with its little warning sign
      g.tube([46, 55.5, 54, 56.5, 58.6, 52, 57.2, 45.5], 3.2, 1.4, a);
      g.p([57.2, 47, 53.4, 42.4, 57, 36, 60.8, 42], d);
      // loose basking coils
      const c1 = g.e(34, 54, 16.5, 6.4, a);
      zigzag(g, c1, arc(34, 53.4, 12.8, 3.7, 0, 360, 40), 0, 1.4, .85, b, 3);
      const c2 = g.e(35.5, 48.4, 11.2, 5.2, a);
      zigzag(g, c2, arc(35.5, 47.8, 7.8, 2.6, 0, 360, 40), 0, 1.25, .85, b, 2.9);
      g.on(c2, () => g.e(36, 47.8, 3.4, 1.1, dk(a, .25)));
      // neck
      const np = spline([29.5, 48.5, 24.5, 43.5, 22.5, 37, 22.8, 31]);
      const neck = g.tube(flat(np), 5.2, 4.8, a);
      g.on(neck, () => g.tube(flat(shift(np, -3.6)), 2.6, 2.6, c));
      zigzag(g, neck, np, 1.6, 1.3, .8, b, 2.5);
      // head: a blunt wedge with the adder's V on the crown
      const head = g.re(21.5, 28.2, 10.6, 7.6, -8, a);
      g.on(head, () => { g.l(23.6, 20.8, 26.4, 23, .85, b); g.l(30, 21.8, 26.4, 23, .85, b); });
      if (g.back) g.on(head, () => { g.l(17.5, 23.5, 23.5, 30.5, 1.05, b); g.l(29.5, 23.5, 23.5, 30.5, 1.05, b); });
      if (!g.back) {
        g.on(head, () => { g.e(16, 35, 11.5, 4.6, c); g.l(29.4, 29, 32.4, 30.6, .85, b); });
        g.l(11, 33.6, 7.4, 34.6, .42, d, { ring: false, shade: false });
        g.l(7.4, 34.6, 5.4, 33.4, .38, d, { ring: false, shade: false }); g.l(7.4, 34.6, 5.6, 36.2, .38, d, { ring: false, shade: false });
      }
      g.eye(17.4, 27.6, 2.9, 'slit', { sc: '#ff9a3a', side: -1 });
      g.eye(26, 26.9, 2.5, 'slit', { sc: '#ff9a3a', side: 1 });
      g.nose(12, 30.4, 'nostrils', { s: .7 });
      g.mo('smile', 16.6, 32.6, 5);
      g.blush(22, 32, 1.5);
    }
  });

  BEAST('viperion', {
    pal: { a: '#a68c54', b: '#1e1a18', c: '#e8d8ae', d: '#d83a20', e: '#a6e040', f: '#4c4238' }, keep: ['b', 'c', 'e', 'f'], sh: 170,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // tail with a barbed tip
      g.tube([50, 55, 56.4, 55.4, 59.6, 50, 57.8, 43.5], 3.8, 1.5, a);
      g.p([57.8, 45.5, 53.8, 42, 57.6, 32.5, 61.4, 41.6], d);
      // heavy coils
      const c1 = g.e(33, 54.2, 23.5, 6.4, a);
      zigzag(g, c1, arc(33, 53.6, 19.4, 3.6, 0, 360, 60), 0, 1.7, 1.15, b, 3.9);
      const c2 = g.e(32, 47.6, 17.5, 6, a);
      zigzag(g, c2, arc(32, 47, 13.4, 3, 0, 360, 50), 0, 1.6, 1.15, b, 3.7);
      // rearing S of the neck
      const np = spline([23, 46.5, 33, 40.5, 43.5, 33.5, 45.5, 23.5, 38.5, 15.8, 28, 15], 9);
      for (let i = 14; i < np.length - 4; i += 5) { const q = shift(np, 5.4)[i], r = shift(np, 9.6)[Math.min(i + 2, np.length - 1)]; g.p([q[0] - 1.6, q[1] + 1, r[0], r[1], q[0] + 1.6, q[1] - 1], b); }
      const neck = g.tube(flat(np), 7.2, 5.8, a);
      g.on(neck, () => g.tube(flat(shift(np, -5)), 3.6, 3, f));
      zigzag(g, neck, np, 2.3, 2.1, 1.15, b, 3.5);
      // head: horned brow, gaping jaws
      K.horn(g, 25.5, 11, 28, 8.5, 1.9, b, 30);
      const jaw = g.p([27.5, 21.5, 13, 27.6, 9, 31.2, 12.5, 33.4, 21, 31, 28.5, 27], a);
      g.on(jaw, () => g.tube([10, 33, 20, 31.4, 28, 27.6], 1.5, 1.5, c));
      if (!g.back) g.p([9.5, 22, 26, 22.4, 26, 26.4, 12.5, 30.4], '#7c1a26', { shade: false });
      const head = g.e(21.5, 17, 9.4, 7.2, a);
      const snout = g.p([17, 11.5, 9, 15, 4.4, 19.4, 5.4, 22.4, 13, 24, 22, 24.2], a);
      g.on([head, snout], () => { g.l(22, 10.6, 25, 14, .9, b); g.l(28.6, 11.4, 25, 14, .9, b); });
      if (!g.back) {
        g.on([head, snout], () => { g.tube([5, 22, 13, 23.6, 24, 24], 1.1, 1.1, c); g.l(26, 19.4, 31, 22.4, 1.4, b); });
        g.p([8, 23, 10.6, 23.4, 9, 29.4], '#ffffff'); g.p([13.4, 24, 15.6, 24.2, 14.4, 29], '#ffffff');
        g.e(9, 31.4, .9, 1.3, e, { mat: 'glow' }); g.e(9.2, 36, .8, 1.2, e, { mat: 'glow' });
      }
      K.horn(g, 16.5, 11.8, -18, 9, 2, b, 32);
      g.eye(15.4, 17.6, 3.2, 'sharp', { iris: '#e8482a', side: -1, slit: true });
      g.eye(23.6, 17, 2.7, 'sharp', { iris: '#e8482a', side: 1, slit: true });
      g.nose(6.4, 19.8, 'nostrils', { s: .7 });
    }
  });

  BEAST('foalet', {
    pal: { a: '#9a6c46', b: '#f6ead6', c: '#3e2819', d: '#ecd6b4', e: '#ffb0a0' }, keep: ['b', 'd', 'e'], sh: 185,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const far = mix(a, '#1a1030', .28);
      // stubby brush of a tail, flicked up
      g.re(51.4, 35.4, 3.3, 7, 42, c, { mat: 'fur' });
      // far legs
      g.tube([41, 45, 42.5, 51, 41, 58], 2.3, 1.9, far); g.e(40.6, 59.6, 2.6, 1.6, c);
      g.tube([27, 45, 23.5, 51, 22, 58], 2.3, 1.9, far); g.e(21.5, 59.6, 2.6, 1.6, c);
      // barrel body
      const body = g.e(36, 42.5, 11.5, 8.2, a, { mat: 'fur' });
      g.on(body, () => { g.e(35, 49, 8, 3, lt(a, .22)); for (const [x, y, r] of [[43.5, 39, 1.3], [46.5, 42.4, 1.1], [41.6, 43, 1], [45, 46, .9]]) g.c(x, y, r, lt(a, .2)); });
      // near legs: knobbly knees, fluffy fetlocks
      for (const [pts, kx, ky, fx] of [[[45, 45, 48, 51.5, 46.5, 58], 47.8, 51.4, 46.2], [[30, 46, 30.6, 52, 29.5, 58], 30.6, 52, 29.3]]) {
        g.tube(pts, 2.7, 2.1, a); g.c(kx, ky, 2.5, a, { line: false });
        g.e(fx, 60, 3, 1.7, c);
        g.fur(fx, 57.6, 3.3, 2.3, b, { n: 5, amp: .3, a0: 0, a1: 180, mat: 'fur' });
      }
      // neck and tufty mane
      g.fur(30.6, 33.6, 3.8, 6.8, c, { n: 6, amp: .24, a0: -95, a1: 85, mat: 'fur' });
      g.tube([30, 40, 26, 34, 24.5, 30], 5.2, 5, a, { mat: 'fur' });
      // head
      K2.ear(g, 16.4, 21.6, -32, 7.5, 2.8, a, e); K2.ear(g, 29.6, 21, 26, 7.5, 2.8, a, e);
      const fhead = g.e(22.5, 28, 9.4, 8, a, { mat: 'fur' });
      const muz = g.e(13.6, 34, 6.2, 5, a, { line: false });
      if (!g.back) { g.on([fhead, muz], () => g.tube([20.5, 23, 17.4, 30, 12.4, 34, 9.6, 37], 1.5, 3.4, b)); g.on(muz, () => g.e(9, 37.4, 4.4, 2.6, e)); }
      // the big wild fringe: a cowlick on top, locks tumbling over the far eye
      g.fur(23.5, 21.4, 7.6, 4.2, c, { n: 7, amp: .36, a0: -205, a1: 25, mat: 'fur' });
      g.tube([20, 20.4, 17.4, 23, 16, 26.4], 2.3, .8, c, { mat: 'fur', line: false });
      g.tube([24, 21, 23, 25.4, 24.2, 29.6], 2.7, .9, c, { mat: 'fur', line: false });
      g.tube([28, 21, 28.8, 26, 27.6, 32], 2.8, .9, c, { mat: 'fur', line: false });
      // an apple, carried by the stalk
      if (!g.back) {
        g.l(10.8, 38, 9.2, 40, .42, '#5a3a1e', { ring: false, shade: false });
        g.c(8.6, 43.2, 3.6, '#dc3a30', { gloss: true });
        K.leaf(g, 9.4, 39.6, -70, 3.8, 1.5, '#5aa844', '#2e6a2c');
      }
      g.eye(17.6, 29.8, 3.7, 'cute', { iris: '#c07a30', side: -1, lash: true });
      g.nose(9.4, 33, 'nostrils', { s: .8 });
      g.blush(16, 34.8, 1.7);
    }
  });

  BEAST('shiremane', {
    pal: { a: '#4e3424', b: '#f6efe4', c: '#1e140c', d: '#e6c050', e: '#2a58a8', f: '#f0a8a0' }, keep: ['b', 'd', 'f'], sh: 185,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, '#120a1a', .32), fb = dk(b, .14);
      const feather = (x, y, s, col) => g.fur(x, y, 5.6 * s, 4.6 * s, col, { n: 7, amp: .3, a0: -15, a1: 195, mat: 'fur' });
      // tail, dressed with a ribbon
      g.tube([54, 29, 58.4, 34, 58.4, 45, 56.4, 54], 2.4, 3.5, c, { mat: 'fur' });
      g.p([54.4, 28.8, 51.4, 25, 56, 26], e); g.p([54.6, 28.8, 59.2, 25.6, 58.4, 30], e); g.c(54.6, 28.6, 1.3, d);
      // far legs
      g.l(46, 42, 47, 53, 3.6, far); g.e(47, 59.8, 4.6, 1.9, c); feather(47, 55.8, .9, fb);
      g.l(33, 42, 33.5, 53, 3.6, far); g.e(33.5, 59.8, 4.6, 1.9, c); feather(33.5, 55.8, .9, fb);
      // great barrel of a body
      const body = g.e(40.5, 34.5, 16.5, 11.5, a, { mat: 'fur' });
      g.on(body, () => { g.p([38, 22, 43.5, 22, 45, 33, 39, 33.6], e); for (const y of [25.5, 29.5]) g.c(41.6, y, 1.1, d); });
      g.e(50.5, 37, 7.6, 9.4, a, { mat: 'fur', line: false });
      // near hind leg
      g.tube([52, 42, 54.5, 49, 53, 55], 4.4, 3.6, a); g.e(52.6, 59.9, 5.4, 2, c); feather(52.8, 55.8, 1, b);
      // near foreleg raised to stamp
      g.tube([30, 41, 23.4, 42.6, 20.6, 47], 4.2, 3.3, a);
      g.re(19.2, 53.2, 4.2, 2.1, -18, c); feather(19.8, 49.6, .9, b);
      // mane falling down the far side, then the arched neck
      g.fur(32, 19.5, 5.5, 9.5, c, { n: 9, amp: .28, a0: -120, a1: 100, mat: 'fur' });
      g.tube([33.5, 31, 27, 23, 22, 17], 8.6, 6, a, { mat: 'fur' });
      // plaited crest with show flights
      for (const [x, y, k] of [[26.6, 12, 0], [29.4, 14.2, 1], [32, 16.8, 0], [34.4, 19.8, 1]]) K2.ear(g, x, y, 40, 5.4, 1.5, k ? d : e);
      // plough collar and a horse brass
      const col = g.tube([36.5, 22.5, 29.5, 26.5, 26.5, 33.5, 29, 41], 2.5, 2.5, e);
      g.on(col, () => g.tube([35.6, 21.6, 28.4, 25.8, 25.2, 33.5, 27.8, 41.6], .8, .8, d));
      g.c(37.2, 21.2, 1.7, d, { mat: 'metal' });
      g.c(27.6, 44.6, 2.3, d, { mat: 'metal' });
      // head
      K2.ear(g, 15.5, 9.8, -24, 7, 2.6, a, f); K2.ear(g, 24.4, 9, 14, 7, 2.6, a, f);
      const skull = g.e(19.5, 15.8, 7.8, 6.8, a, { mat: 'fur' });
      const face = g.tube([17, 18.5, 12.6, 24.4, 10.6, 28.4], 5.4, 4.7, a, { line: false });
      const nose = g.e(9.8, 29.8, 5.2, 4.2, a, { line: false });
      if (!g.back) {
        g.on([skull, face, nose], () => g.tube([20.4, 9.5, 17.8, 18, 12.6, 26, 9.4, 31.5], 1.4, 3.6, b));
        g.on(nose, () => g.e(7.6, 31.8, 4, 2.3, f));
      }
      // forelock swept to one side
      g.tube([19.6, 8.8, 22.6, 10.6, 25, 14.6], 2.5, .9, c, { mat: 'fur' }); g.tube([18.6, 8.6, 19.4, 11, 21, 13.4], 2, .8, c, { mat: 'fur', line: false });
      g.eye(14.2, 16.6, 2.6, 'round', { iris: '#b47c38', sc: '#2a1a10', side: -1, lash: true, look: -.3 });
      g.eye(23.8, 16, 2.2, 'round', { iris: '#b47c38', sc: '#2a1a10', side: 1, lash: true, look: -.3 });
      g.nose(7.4, 29.4, 'nostrils', { s: .9 });
      g.mo('smile', 11, 33, 3.6);
    }
  });
})();