// ---- art/b2 ----
// ===== Batch b2: squirrels, fairies, snails, crows, deer, spiders, electric dogs and dynamos =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  const INKC = '#2a1a2a';
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // rotate a local point (u along the direction, v to its right) around (x, y); ang is degrees clockwise from up
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // screen-space offsets rotated clockwise by ang degrees around (x, y)
  const rot = (x, y, ang, pts, s = 1) => { const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), out = []; for (let i = 0; i < pts.length; i += 2) { const dx = pts[i] * s, dy = pts[i + 1] * s; out.push(x + dx * ca - dy * sa, y + dx * sa + dy * ca); } return out; };
  // little lightning zigzag (sparks)
  const bolt = (g, x, y, s, ang, col, o = {}) => g.p(rot(x, y, ang, [-1, -4, 1.9, -4, .5, -.7, 2.4, -.9, -1.3, 4.8, .1, .7, -1.9, .9], s), col, { mat: 'glow', bevel: .5, ...o });
  // rotated ellipse placed from a base point along an angle (ears, leaves, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
  // a fan of small flat claws pointing along ang
  const claws = (g, x, y, n, span, len, ang, col = '#f6eedc', fan = 14) => { const f = loc(x, y, ang); for (let i = 0; i < n; i++) { const k = n === 1 ? 0 : i / (n - 1) - .5, [bx, by] = f(0, k * span); g.p(poly(bx, by, ang + k * fan * 2, [0, -.75, len, 0, 0, .75]), col, { shade: false }); } };
  // four-pointed twinkle (flat)
  const twinkle = (g, x, y, r, col = '#ffe680') => flat(g, F => { const U = g.U, cx = (Math.floor(x * U) + .5) / U, cy = (Math.floor(y * U) + .5) / U, t = .3 / U; F.fl(cx - r, cy, cx + r, cy, t, col, true); F.fl(cx, cy - r, cx, cy + r, t, col, true); });
  // pointed ear with an inner colour that also takes shading options (pale skin needs a warm shade ramp)
  const ear2 = (g, x, y, ang, len, w, col, inner, o) => { const id = g.p(poly(x, y, ang, [0, -w, len * .55, -w * .6, len, 0, len * .55, w * .6, 0, w]), col, o); if (inner) g.on(id, () => g.p(poly(x, y, ang, [0, -w * .45, len * .7, 0, 0, w * .45]), inner)); return id; };
  // cream fur markings: warm shadows instead of grey ones
  const CR = { dk: '#e6ceb0' };
  // fairy skin: rosy shadows instead of grey ones
  const SK = { dk: '#e6aec4', lt: '#fff3f4' };
  // buck teeth under a mouth
  const buck = (g, x, y, w, h) => flat(g, F => { const t = Math.max(.5, .85 / g.U); F.fp([x - w - t, y - t * .4, x + w + t, y - t * .4, x + w + t, y + h + t, x - w - t, y + h + t], INKC); F.fp([x - w, y, x + w, y, x + w, y + h, x - w, y + h], '#ffffff'); });
  // translucent fairy wing: a long glossy petal with veins
  const fwing = (g, x, y, ang, len, w, col, vein, o = {}) => {
    const id = blade(g, x, y, ang, len, w, col, { mat: 'gloss', oc: dk(vein, .25), ...o });
    if (!g.small) g.on(id, () => { const f = loc(x, y, ang); g.l(...f(len * .1, 0), ...f(len * .86, 0), .35, vein); for (const k of [-1, 1]) g.l(...f(len * .34, 0), ...f(len * .7, k * w * .6), .3, vein); });
    return id;
  };
  // acorn: nut with a textured cup, tilted by ang
  const acorn = (g, x, y, s, ang, nut, cup) => {
    const f = loc(x, y, ang);
    const [nx, ny] = f(-1.2 * s, 0);
    const n = g.re(nx, ny, 2.6 * s, 3.1 * s, ang, nut, { gloss: true });
    g.on(n, () => { const [px, py] = f(-3.6 * s, 0); g.c(px, py, .9 * s, dk(nut, .25)); });
    const [cx, cy] = f(1.2 * s, 0);
    const cp = g.re(cx, cy, 2.9 * s, 1.7 * s, ang, cup, { mat: 'fur' });
    if (!g.small) g.on(cp, () => { for (const [u, v] of [[.9, -1.6], [.9, 0], [.9, 1.6], [1.9, -.8], [1.9, .8]]) { const [px, py] = f(u * s, v * s); g.dot(px, py, .45 * s, dk(cup, .3)); } });
    const [s1x, s1y] = f(2.6 * s, 0), [s2x, s2y] = f(3.8 * s, .5 * s);
    g.l(s1x, s1y, s2x, s2y, .55 * s, dk(cup, .15));
    return n;
  };

  // ---------------------------------------------------------------- Scurrip
  BEAST('scurrip', {
    pal: { a: '#cc6a34', b: '#fff0dc', c: '#8a4424', d: '#7a5028', e: '#dcbc5e', f: '#ffb0a0' }, keep: ['b', 'd', 'e', 'f'], sh: -28,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .28);
      // big bushy tail rising behind and flicking back at the top
      g.group(() => {
        g.tube([36, 57, 45, 56, 51, 50, 52, 41, 49, 33, 49, 26, 53, 21, 58, 21], 4.2, 5.8, a, { mat: 'fur' });
        g.fur(50.5, 47, 5.6, 7.5, a, { n: 9, amp: .22, mat: 'fur' });
        g.fur(51, 33, 5.2, 7, a, { n: 8, amp: .22, mat: 'fur' });
        g.fur(55, 22, 6.2, 5, a, { n: 9, amp: .26, mat: 'fur' });
      });
      // far hind foot
      g.e(24, 59.4, 3.6, 1.9, fa);
      // body
      const body = g.e(31, 49.5, 9.5, 10.5, a, { mat: 'fur' });
      g.on(body, () => g.e(26.5, 51.5, 5.8, 8.6, b, CR));
      // haunch and long hind foot
      const hip = g.e(37, 54, 6.2, 6.2, a, { mat: 'fur' });
      g.on(hip, () => g.l(34, 51, 38.5, 55, .45, dk(a, .18)));
      const foot = g.e(32.5, 59.4, 6.6, 2.2, a);
      g.on(foot, () => g.e(32.5, 60.6, 6.6, 1.2, c));
      K2.toes(g, 27.5, 60.6, 3, 2.6, dk(c, .3));
      // an acorn held in both paws
      g.e(17.2, 51.8, 2, 1.9, fa);
      acorn(g, 20.8, 46.6, 1.45, -8, e, d);
      g.tube([28.5, 43.5, 27.6, 48.5, 25.6, 51.4], 2.3, 2, a);
      g.e(24.4, 52, 2.4, 2.1, a);
      // ears with long tufts
      K2.ear(g, 31.5, 25.5, 20, 9.5, 3.4, fa, mix(f, fa, .35));
      g.tube([K.pt(31.5, 25.5, 20, 8.5), K.pt(31.5, 25.5, 16, 12.5), K.pt(31.5, 25.5, 26, 15.5)].flat(), 1.5, .5, dk(c, .2));
      g.tube([K.pt(20.5, 26.5, -18, 9.5), K.pt(20.5, 26.5, -22, 13.5), K.pt(20.5, 26.5, -12, 17)].flat(), 1.7, .5, c);
      K2.ear(g, 20.5, 26.5, -18, 10.5, 3.8, a, f);
      // head
      const head = g.e(26.5, 33.5, 10.5, 9.4, a, { mat: 'fur' });
      const cheek = g.fur(26.5, 37, 11.2, 5.8, a, { n: 12, amp: .2, a0: 10, a1: 170, mat: 'fur', line: false });
      if (!g.back) g.on([head, cheek], () => g.e(19.5, 38, 6.8, 4.4, b, CR));
      g.eye(21.8, 32.8, 3.3, 'cute', { iris: '#b8741e', side: -1 });
      g.eye(30.8, 32.3, 3, 'cute', { iris: '#b8741e', side: 1 });
      g.nose(16, 35.8, 'button', { s: 1 });
      g.mo('smile', 18.8, 38.5, 3.2);
      buck(g, 18.7, 39.2, 1.15, 1.9);
      g.blush(23.4, 38.2, 1.5); g.blush(33.8, 37, 1.5);
    }
  });

  // ---------------------------------------------------------------- Squirrage
  BEAST('squirrage', {
    pal: { a: '#b85a2a', b: '#fff0dc', c: '#6a3018', d: '#7a5028', e: '#dcbc5e', f: '#ffb0a0', h: '#b07a3c' }, keep: ['b', 'd', 'e', 'f', 'h'], sh: -28,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(a, .3);
      // puffed-up tail: a huge bristling plume arching over the head
      g.group(() => {
        g.tube([42, 52, 52, 48, 58, 38, 58, 26, 54, 15, 46, 8, 37, 7], 5, 7, a, { mat: 'fur' });
        g.fur(55, 42, 7, 9, a, { n: 10, amp: .36, mat: 'fur' });
        g.fur(57, 26, 6.6, 9.5, a, { n: 10, amp: .38, mat: 'fur' });
        g.fur(50.5, 11, 9, 7, a, { n: 11, amp: .38, mat: 'fur' });
        g.fur(38, 8, 6.5, 5, a, { n: 8, amp: .36, mat: 'fur' });
      });
      // the hoard: a heap of acorns and hazelnuts underfoot
      for (const [x, y] of [[19.5, 55.4], [44, 55], [32, 54.6]]) g.c(x, y, 3, far(h, .25));
      for (const [x, y] of [[26, 56.8], [38.5, 56.6]]) { const n = g.c(x, y, 3.1, h, { gloss: true }); g.on(n, () => g.e(x - .4, y + 2.2, 2, 1, lt(h, .35))); }
      for (const [x, y, s, an] of [[14, 57.6, 1.3, -64], [49.5, 57.4, 1.3, 60], [32, 58.2, 1.35, 8]]) acorn(g, x, y, s, an, e, d);
      // far arm raised, claws out
      g.tube([37, 32, 43, 27, 45, 21], 2.8, 2.3, fa);
      g.e(45.3, 19.8, 2.7, 2.5, fa);
      K2.zig(g, 47.6, 18.6, 43.2, 18.6, 3, 2.7, '#f6eedc', { shade: false });
      // legs braced on the heap
      g.tube([37, 47, 41, 51, 39.5, 55], 4.2, 3.2, fa);
      g.e(38.5, 55.6, 4.6, 2, far(c, .1));
      // body
      const body = g.e(31, 41, 11, 12.5, a, { mat: 'fur' });
      g.on(body, () => g.e(26, 43.5, 6.2, 9.5, b, CR));
      const hip = g.e(28.5, 50, 7, 5.6, a, { mat: 'fur' });
      g.on(hip, () => g.l(24, 49, 31, 47.5, .5, dk(a, .2)));
      const foot = g.e(23.5, 55.3, 6.2, 2.2, a);
      g.on(foot, () => g.e(23.5, 56.4, 6.2, 1.2, c));
      K2.toes(g, 19.2, 56.6, 3, 2.6, dk(c, .3));
      // near arm cocked low, claws spread
      g.tube([27.5, 36.5, 21.5, 41, 15.5, 41.5], 3.1, 2.6, a);
      g.e(13.8, 41.6, 2.9, 2.7, a);
      K2.zig(g, 12, 39.2, 12, 44, 3, 2.7, '#f6eedc', { shade: false });
      // ears: tall bristling tufts
      g.tube([K.pt(30, 17, 18, 9), K.pt(30, 17, 22, 14), K.pt(30, 17, 10, 18)].flat(), 1.8, .5, c);
      K2.ear(g, 30, 17, 18, 10.5, 3.6, fa, mix(f, fa, .35));
      g.tube([K.pt(18, 18, -16, 10), K.pt(18, 18, -24, 14.5), K.pt(18, 18, -12, 19)].flat(), 2, .5, c);
      K2.ear(g, 18, 18, -16, 11.5, 4, a, f);
      // head with bristling cheeks
      const head = g.e(23.5, 25, 10, 8.6, a, { mat: 'fur' });
      const cheek = g.fur(22.5, 28.4, 11, 5.4, a, { n: 12, amp: .3, a0: 5, a1: 175, mat: 'fur', line: false });
      if (!g.back) g.on([head, cheek], () => g.e(16.5, 30, 6.5, 4, b, CR));
      g.eye(18.6, 24.2, 3, 'angry', { iris: '#f04a18', side: -1, lid: a, look: -.4 });
      g.eye(27.6, 23.6, 2.7, 'angry', { iris: '#f04a18', side: 1, lid: a, look: -.4 });
      g.nose(12.6, 26.6, 'tri', { s: 1.05 });
      g.mo('grin', 16.2, 29.4, 5, { h: 2.3 });
    }
  });

  // a brass key dangling from a bootlace (hangs from x, y)
  const key = (g, x, y, col) => {
    g.l(x, y, x - .3, y + 3.2, .42, '#8a5a3a');
    const bow = g.c(x - .4, y + 5.2, 2.4, col, { mat: 'metal' });
    g.on(bow, () => g.c(x - .4, y + 5.2, 1.05, dk(col, .5)));
    g.group(() => {
      g.l(x - .4, y + 7.6, x - .4, y + 12.4, .85, col, { mat: 'metal' });
      g.p([x - .4, y + 9.4, x - 2.8, y + 9.4, x - 2.8, y + 10.6, x - .4, y + 10.6], col, { mat: 'metal', bevel: .5 });
      g.p([x - .4, y + 11.4, x - 2.4, y + 11.4, x - 2.4, y + 12.8, x - .4, y + 12.8], col, { mat: 'metal', bevel: .5 });
    });
  };

  // ---------------------------------------------------------------- Pucklet
  BEAST('pucklet', {
    pal: { a: '#f8dde4', b: '#6cc05a', c: '#3a8a40', d: '#a996f0', e: '#ffb0c4', f: '#f2c240', h: '#e2d8fc' }, keep: ['a', 'e', 'f'], sh: -90,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const vein = mix(d, h, .35);
      // dragonfly wings
      fwing(g, 34, 43.5, 22, 13, 3.4, far(h, .16), far(vein, .1));
      const wings = () => { fwing(g, 36, 44.5, 62, 15.5, 4.2, h, vein); fwing(g, 36.5, 47.5, 106, 10.5, 3.2, h, vein); };
      if (!g.back) wings();
      // legs and curly-toed leaf shoes
      g.l(33.6, 55, 34.6, 58.6, 1.25, mix(a, '#b06a90', .3));
      g.p([32.2, 60.8, 32.6, 58.2, 35.8, 58, 38.4, 59, 39.6, 57.8, 39.4, 60.8], far(c, .22));
      g.l(28.8, 55.5, 27.8, 58.6, 1.35, a, SK);
      g.p([30.2, 61, 30.2, 58.2, 26.6, 58, 23.6, 59.2, 22, 57.8, 22.2, 61], c);
      // leaf tunic
      const tunic = g.p([25.2, 45.6, 36.4, 45.2, 39.6, 55.4, 36.8, 54.4, 34.8, 57.8, 31.8, 55, 28.8, 58, 26.4, 54.6, 22.8, 56], b);
      g.on(tunic, () => { g.l(31, 46, 31.8, 55, .4, c); g.l(31.3, 49.5, 27.4, 53, .32, c); g.l(31.5, 50.5, 36, 53, .32, c); });
      if (g.back) wings();
      // near arm dangling a stolen key
      key(g, 18.2, 47.4, f);
      g.tube([27, 46.6, 22.6, 48.4, 18.8, 46.8], 1.5, 1.3, a, SK);
      g.c(18.2, 46.6, 1.75, a, SK);
      // leaf collar
      for (const an of [118, 152, -152, -118]) K.leaf(g, 30.6, 43.6, an, 5.2, 2.2, c);
      // long pointed ears
      ear2(g, 38.6, 35.4, 68, 10, 2.8, mix(a, '#b06a90', .22), mix(e, '#b06a90', .3), SK);
      ear2(g, 21.4, 36.2, -66, 11, 3, a, e, SK);
      const head = g.e(30, 35, 10.2, 9.2, a, SK);
      void head;
      // bluebell cap with a curled stalk
      const cap = g.p([16.2, 31.2, 19, 27.5, 21.5, 23.5, 25.5, 20.6, 30.5, 19.6, 35.5, 20.8, 39, 24, 41, 28, 44, 30.6, 40.6, 31, 38, 29.4, 35.4, 31.8, 32.6, 29.6, 29.6, 32.2, 26.4, 29.8, 23.4, 32.2, 20.6, 30.4], d);
      g.on(cap, () => { g.l(30.4, 21.5, 29.6, 31.5, .4, lt(d, .4)); g.l(26.6, 22, 23.4, 31.5, .4, lt(d, .4)); g.l(34.2, 22, 35.4, 31, .4, lt(d, .4)); });
      g.e(30.6, 20.2, 3.4, 1.7, b);
      g.tube([30.6, 19.6, 31, 16.2, 33.6, 14.2, 36.4, 15.2, 36.6, 17.8], .95, .65, c);
      g.eye(25.2, 36.4, 3.2, 'star', { iris: '#4aa82e', side: -1, look: -.3 });
      g.eye(34, 36, 2.7, 'happy', { side: 1 });
      g.mo('tongue', 28.8, 40.6, 3.2);
      g.blush(21.8, 39.8, 1.6); g.blush(36.8, 39.2, 1.5);
      twinkle(g, 11, 40, 1.4, f); twinkle(g, 13.6, 55.4, 1.1, f);
    }
  });

  // ---------------------------------------------------------------- Pucksprite
  BEAST('pucksprite', {
    pal: { a: '#f4d6de', b: '#58b04c', c: '#2e7a36', d: '#9c88ee', e: '#ffaec4', f: '#fff08a', h: '#dcd2fc', k: '#8a6038' }, keep: ['a', 'e', 'f', 'k'], sh: -90,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const vein = mix(d, h, .35);
      // four long wings
      fwing(g, 33, 36.5, 30, 19, 4, far(h, .16), far(vein, .1));
      fwing(g, 34, 39, 128, 11, 3.2, far(h, .16), far(vein, .1));
      const wings = () => { fwing(g, 33.5, 37, 60, 22, 4.8, h, vein); fwing(g, 34, 39, 98, 15, 3.8, h, vein); };
      if (!g.back) wings();
      // far arm on the hip
      g.tube([32.6, 35, 37.2, 39, 34.6, 42.6], 1.4, 1.2, mix(a, '#b06a90', .3));
      // far leg kicked back
      g.tube([32.4, 45.6, 36, 49.6, 34.6, 53.6], 1.5, 1.25, mix(a, '#b06a90', .3));
      g.p([33.4, 56.6, 32.8, 53.4, 36, 53, 38.8, 54.2, 40.2, 52.8, 40, 56.2], far(c, .22));
      // near leg
      g.tube([28.6, 46.4, 26.8, 51.4, 28.4, 55], 1.6, 1.35, a, SK);
      g.p([30.4, 58.4, 30.6, 55, 27.2, 54.8, 24, 56.4, 22.2, 55, 22.6, 58.4], c);
      // leaf tunic with a belt
      const tunic = g.p([24, 33, 33.2, 32.4, 37, 45.4, 34.6, 44.2, 32.8, 47.8, 30.2, 45, 27.6, 48, 25.4, 44.6, 22.4, 46.2], b);
      g.on(tunic, () => { g.p([23.2, 40.6, 35.6, 39.6, 36, 41.4, 23, 42.6], c); g.c(28.8, 41.2, 1.1, f); });
      if (g.back) wings();
      // glowing twig, held out like a lure
      g.tube([20, 40, 13.4, 44.4, 8.8, 47.8], .85, .55, k);
      g.l(13.6, 44.2, 12.6, 41.2, .5, k);
      const orb = g.c(6.8, 50, 3.5, f, { mat: 'glow', oc: '#c8901c' });
      g.on(orb, () => g.c(6.2, 49.4, 1.7, '#ffffff'));
      // near arm
      g.tube([25, 35.4, 21.2, 39.6, 18.2, 40.8], 1.5, 1.3, a, SK);
      g.c(17.6, 41, 1.75, a, SK);
      // petal ruff
      for (const an of [104, 142, 180, -142]) K.leaf(g, 28.4, 32.4, an, 5.6, 2.4, c);
      // long ears
      ear2(g, 32.6, 26, 66, 10, 2.6, mix(a, '#b06a90', .22), mix(e, '#b06a90', .3), SK);
      ear2(g, 17.4, 27, -62, 11.5, 2.8, a, e, SK);
      const head = g.e(25, 25.4, 8.8, 8, a, SK);
      void head;
      // tall pixie hood with a hooked tip
      const hood = g.p([12.8, 23, 15.8, 18.8, 19.6, 14.6, 24.5, 11, 29.5, 7.2, 35, 4.2, 39.6, 4, 42, 6.6, 41.6, 9.6, 39.6, 7.8, 36.4, 7.6, 33.6, 10, 33, 13.5, 35, 17.4, 37.6, 22, 34.2, 20.4, 31, 22.6, 28, 20.6, 24.8, 23, 21.6, 20.8, 18.4, 23.2, 15.6, 21.6], d);
      g.on(hood, () => { g.l(27.6, 10.4, 24.8, 22, .4, lt(d, .4)); g.l(23.4, 13.6, 18.6, 22.4, .4, lt(d, .4)); g.l(30.6, 10, 31, 22, .4, lt(d, .4)); });
      g.c(41.8, 11, 1.7, f, { gloss: true });
      g.eye(20.6, 27, 3.2, 'sharp', { iris: '#a25cf6', side: -1, look: -.4 });
      g.eye(28.8, 26.6, 2.8, 'sharp', { iris: '#a25cf6', side: 1, look: -.4 });
      g.mo('fang', 24, 31.2, 3.4);
      g.blush(17.6, 30.4, 1.3);
      twinkle(g, 12.6, 55.4, 1.5, f); twinkle(g, 3.4, 42.8, 1.3, f); twinkle(g, 15.4, 49.6, 1.1, f);
    }
  });

  // ---------------------------------------------------------------- Oberwick
  BEAST('oberwick', {
    pal: { a: '#eed6e4', b: '#4a9a48', c: '#2a5a30', d: '#c4e2ff', e: '#8a6038', f: '#f8c8ec', h: '#ffe070', k: '#e87aa8' }, keep: ['a', 'e', 'h'], sh: -90,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const vein = '#86a4d6';
      const wing = (x, y, ang, len, w, col, vn) => { const id = fwing(g, x, y, ang, len, w, col, vn); g.on(id, () => { const [tx, ty] = K.pt(x, y, ang, len * .84); g.c(tx, ty, w * .62, mix(col, f, .7)); }); return id; };
      // great wings
      wing(25, 31, -50, 21, 6.2, far(d, .14), far(vein, .1));
      wing(25, 33, -100, 14, 4.6, far(d, .14), far(vein, .1));
      const wings = () => { wing(36, 31, 54, 25, 7.5, d, vein); wing(37, 34, 100, 18, 5.6, d, vein); };
      if (!g.back) wings();
      // fairy-ring toadstools
      const shroom = (x, y, s) => { g.l(x, y, x, y - 3 * s, 1 * s, '#fff4ea'); const cp = g.e(x, y - 3.6 * s, 3.2 * s, 1.9 * s, k); g.on(cp, () => { g.dot(x - 1.2 * s, y - 4 * s, .5 * s, '#fff4ea'); g.dot(x + 1.2 * s, y - 3.4 * s, .5 * s, '#fff4ea'); }); };
      shroom(53, 60.4, 1.1); shroom(58.4, 60.8, .8);
      // long mossy hair
      g.tube([23.6, 19, 21.4, 26, 22.6, 34], 2.6, 1.6, c, { mat: 'fur' });
      g.tube([36.6, 18.6, 39.4, 26, 38.4, 34], 2.6, 1.6, c, { mat: 'fur' });
      // robe of oak leaves
      g.p([24, 29, 37, 29, 41.5, 40, 47.5, 56, 48, 60.6, 13.5, 60.6, 15, 55, 21, 40], c);
      for (const [x, y, an] of [[18.5, 51, 196], [26, 52, 186], [34, 52, 176], [42, 51, 166]]) K.leaf(g, x, y, an, 10.5, 4.2, b, c);
      for (const [x, y, an] of [[22, 43, 192], [30.4, 44, 180], [38.6, 43, 168]]) K.leaf(g, x, y, an, 10, 4, b, c);
      for (const [x, y, an] of [[26.4, 35, 188], [34.6, 35, 172]]) K.leaf(g, x, y, an, 9.5, 3.8, b, c);
      if (g.back) wings();
      // sceptre: a gnarled oak staff cradling a midsummer light
      g.tube([12, 60.4, 11, 45, 9.6, 30, 8.2, 17, 6.2, 11.6, 8.4, 7.4, 12, 8.6], 1.15, .7, e);
      K.leaf(g, 10.9, 46, -62, 5, 2, b, c);
      g.c(9.2, 11.6, 2.9, h, { mat: 'glow', oc: '#c88a18' });
      g.on(g.parts.length, () => g.c(8.6, 11, 1.3, '#ffffff'));
      shroom(6, 60.6, .85);
      // arm reaching for the sceptre
      g.tube([25.4, 31.6, 18, 35.6, 12.6, 35], 1.9, 1.4, a, SK);
      g.c(11.4, 35, 1.9, a, SK);
      // petal ruff
      K2.ruff(g, 30.5, 29.4, 8.6, 3.4, f, 9, .34, undefined, undefined, { dk: mix(f, d, .5) });
      // ears, head
      ear2(g, 37, 20.6, 72, 9, 2.4, mix(a, '#b06a90', .22), mix('#ffb0c8', '#b06a90', .3), SK);
      ear2(g, 23, 21.4, -70, 9.5, 2.6, a, '#ffb0c8', SK);
      const head = g.e(30, 20, 7.6, 7.2, a, SK);
      void head;
      // crown of twigs
      g.tube([25.6, 14.6, 23, 9, 19.6, 4.6], 1.1, .6, e); g.tube([23.4, 9.6, 26, 6.6, 26.4, 3.4], .8, .5, e);
      g.tube([34.4, 14, 37.6, 8.6, 41.6, 4.2], 1.1, .6, e); g.tube([37.2, 9.2, 34.8, 6, 34.6, 3], .8, .5, e);
      K.leaf(g, 19.8, 5.4, -66, 4.6, 2, b); K.leaf(g, 41.4, 5, 64, 4.6, 2, b);
      g.tube([22.6, 17.2, 30, 14.4, 37.4, 16.2], 1.2, 1.2, e);
      g.c(29.8, 14.2, 1.6, h, { gloss: true });
      g.eye(26.4, 21.2, 2.6, 'sleepy', { iris: '#e8a818', lid: a, side: -1, lash: true, look: -.3 });
      g.eye(33.2, 20.8, 2.3, 'sleepy', { iris: '#e8a818', lid: a, side: 1, lash: true, look: -.3 });
      g.mo('line', 29.2, 25.2, 2.4);
      twinkle(g, 16.5, 8, 1.4, h); twinkle(g, 3.6, 17, 1.2, h);
    }
  });

  // spiral groove on a shell part: a logarithmic spiral from the rim (at angle a0, degrees, 0 = right, 90 = down) to the centre
  const spiral = (g, id, cx, cy, R, turns, a0, col, w, k = 1) => {
    const pts = [], n = Math.round(turns * 14);
    for (let i = 0; i <= n; i++) { const t = i / n, th = (a0 + 360 * turns * t) * Math.PI / 180, r = R * k * Math.pow(.5, turns * t); pts.push(cx + Math.cos(th) * r, cy + Math.sin(th) * r); }
    g.on(id, () => g.tube(pts, w, w * .55, col));
  };

  // a round eye on a stalk bulb with a heavy lid that follows the bulb's outline
  const lidded = (g, bulb, x, y, r, iris, lid, o = {}) => {
    if (g.back) return;
    const n0 = g.parts.length; g.eye(x, y, r, 'round', { iris, ...o });
    if (g.tiny) return;
    const ids = [bulb]; for (let i = n0 + 1; i <= g.parts.length; i++) ids.push(i);
    g.on(ids, () => g.p([x - r * 2, y - r * 2.4, x + r * 2, y - r * 2.4, x + r * 2, y - r * .12, x - r * 2, y - r * .12], lid));
    flat(g, F => F.fl(x - r * .96, y - r * .06, x + r * .96, y - r * .06, Math.max(.42, .95 / g.U), '#1b1328'));
  };

  // ---------------------------------------------------------------- Slimble
  BEAST('slimble', {
    pal: { a: '#d2ca92', b: '#c67a3a', c: '#f2d6a0', d: '#6e4222', e: '#7cc448', f: '#cfdcee' }, keep: ['e', 'f'], sh: 160,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // silver trail glittering behind
      g.e(51, 60.3, 10.6, 1.4, f, { mat: 'gloss', oc: '#8ea6c4' });
      // tail end of the foot
      g.tube([60, 59.4, 51, 58.8, 40, 58, 28, 58], 1.5, 4.6, a, { g: 61 });
      // spiral shell
      const shell = g.c(38.5, 43, 14.5, b, { gloss: true });
      spiral(g, shell, 39.5, 43.5, 14.5, 2.6, 140, c, 1.7, .76);
      spiral(g, shell, 39.5, 43.5, 14.5, 2.6, 140, d, .8);
      // lettuce leaf in its mouth
      const leaf = g.p([14, 44.6, 9.6, 43.8, 5.6, 45.4, 3.2, 48.6, 4.6, 50, 3.6, 52.4, 6.4, 52.6, 7.4, 54.6, 9.6, 52.8, 12, 53.2, 12.4, 50.4, 14, 48], e);
      g.on(leaf, () => { g.l(13, 46, 5.6, 51, .4, lt(e, .45)); g.l(9.6, 48.4, 9.4, 45.6, .32, lt(e, .45)); g.l(8, 49.6, 8.4, 52.6, .32, lt(e, .45)); });
      // eye stalks
      g.tube([12.6, 38, 10.6, 32, 9.6, 27.6], 1.4, 1.2, a);
      g.tube([17.8, 37.2, 20.4, 31.6, 22.2, 27.8], 1.35, 1.15, far(a, .12));
      // neck and head, in front of the shell
      const neck = g.tube([30, 58, 21.5, 56.6, 15.6, 50.4, 15, 43], 4.8, 5.2, a, { g: 61 });
      const head = g.e(15, 42, 6.6, 6.2, a, { g: 61 });
      g.on([neck], () => { for (const [x, y] of [[20.6, 53.6], [24.6, 55.6], [17.6, 49.8], [28, 57]]) g.dot(x, y, .7, dk(a, .16)); });
      void head;
      g.l(10, 45.2, 7.8, 46.4, .8, a);
      const b1 = g.c(9.4, 25.4, 3.7, a), b2 = g.c(22.6, 25.8, 3.4, far(a, .12));
      void b1; void b2;
      g.eye(9.2, 25.4, 2.3, 'round', { iris: '#7aaa2a', side: -1, look: -.9 });
      g.eye(22.8, 25.8, 2.1, 'round', { iris: '#7aaa2a', side: 1, look: .8 });
      g.mo('smile', 12, 45.2, 3);
      g.blush(16.6, 44.6, 1.5);
      twinkle(g, 47.5, 55.4, 1.5, '#9ad2ff'); twinkle(g, 57, 56.6, 1.2, '#9ad2ff');
      flat(g, F => { F.fl(46, 60.2, 48.4, 60.2, .3, '#ffffff', true); F.fl(54, 60.4, 56, 60.4, .3, '#ffffff', true); });
    }
  });

  // ---------------------------------------------------------------- Shellump
  BEAST('shellump', {
    pal: { a: '#a8a878', b: '#7c7c8a', c: '#a8a8b6', d: '#5a8a3a', e: '#68d8f0', f: '#c8a070', h: '#9a6652' }, keep: ['f', 'h'], sh: 160,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      // tail end of the foot
      g.tube([61.4, 59.6, 53, 58.6, 41, 57.6, 28, 57.6], 1.8, 5.6, a, { g: 62 });
      // boulder shell
      const shell = g.c(39, 34.5, 19.2, b, { mat: 'stone' });
      spiral(g, shell, 40.5, 35, 19.2, 2.4, 140, c, 2.3, .76);
      spiral(g, shell, 40.5, 35, 19.2, 2.4, 140, dk(b, .42), 1);
      g.on(shell, () => { g.l(50, 22, 52.6, 25.6, .4, dk(b, .42)); g.l(52.6, 25.6, 51.6, 28.2, .4, dk(b, .42)); });
      // pebbles grown into the shell
      for (const [x, y, rx, ry, col] of [[56.2, 40.4, 3.3, 2.7, f], [52, 48, 3, 2.5, h], [57.6, 32.4, 2.4, 2.1, dk(b, .3)], [46.4, 52, 2.6, 2, c], [24.6, 26.6, 2.6, 2.2, f]]) g.e(x, y, rx, ry, col, { mat: 'stone' });
      // crystals sprouting from the crown
      K.crystal(g, 33.6, 18.6, 2.4, 9, -24, dk(e, .12));
      K.crystal(g, 48, 20, 2.4, 9.6, 34, dk(e, .12));
      K.crystal(g, 41, 17, 3, 13, 6, e);
      K.crystal(g, 37.4, 17.4, 1.8, 6.4, -8, lt(e, .2));
      // moss
      g.fur(41, 18.4, 8.4, 2.6, d, { n: 9, amp: .3, mat: 'fur' });
      g.fur(28.4, 22.4, 6.2, 3.2, d, { n: 7, amp: .32, a0: 0, a1: 200, mat: 'fur' });
      g.fur(53.6, 26.4, 3.6, 2.4, d, { n: 5, amp: .32, mat: 'fur' });
      // eye stalks
      g.tube([10, 36.4, 8.4, 31, 7.8, 28], 1.9, 1.7, a);
      g.tube([15.6, 35.8, 17.8, 30.4, 19, 27.6], 1.8, 1.6, far(a, .12));
      // neck and head
      const neck = g.tube([31, 57.6, 21, 56.2, 14, 50.6, 12.6, 43.6], 5.6, 6.4, a, { g: 62 });
      const head = g.e(12.6, 41.6, 7.4, 6.8, a, { g: 62 });
      g.on([neck], () => { for (const [x, y, r] of [[19.6, 53.4, 1.3], [24, 55.6, 1.1], [16, 49.6, 1.2], [28.4, 56.6, 1], [22, 51, .9]]) g.e(x, y, r, r * .8, dk(a, .2)); });
      void head;
      // stony brow plate
      g.p([5.4, 38.6, 7.6, 35, 13.6, 34, 19.4, 36.4, 18.6, 39.2, 12.6, 38.2, 7.2, 40.2], b, { mat: 'stone' });
      const b1 = g.c(7.6, 25.6, 3.9, a), b2 = g.c(19.4, 25.6, 3.6, far(a, .12));
      lidded(g, b1, 7.6, 26, 2.7, '#30c0e0', a, { side: -1 });
      lidded(g, b2, 19.4, 26, 2.4, '#30c0e0', far(a, .12), { side: 1 });
      g.mo('frown', 9, 45.6, 3.8);
    }
  });

  // closed ring (finger ring, hoop) with a real hole
  const hoop = (g, cx, cy, r, w, col, o) => { const pts = []; for (let i = 0; i <= 12; i++) { const th = i / 12 * Math.PI * 2; pts.push(cx + Math.cos(th) * r, cy + Math.sin(th) * r); } return g.tube(pts, w, w, col, o); };

  // ---------------------------------------------------------------- Crowlet
  BEAST('crowlet', {
    pal: { a: '#3c3c58', b: '#5a5a7e', c: '#f2c440', d: '#8a62dc', e: '#8c8ca0', f: '#c9ced8' }, keep: ['c', 'e', 'f'], sh: 140,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // stubby tail
      const tail = g.p([41, 48.6, 51, 50, 55, 54.4, 50.6, 56.8, 46, 55.6, 41.6, 56], a);
      g.on(tail, () => { g.l(44, 51, 52, 54.6, .4, dk(a, .3)); g.l(43, 53, 49, 55.8, .4, dk(a, .3)); });
      // a button from the hoard
      const btn = g.e(16.4, 59.4, 3.8, 1.9, '#e2574f', { gloss: true });
      if (!g.small) g.on(btn, () => { const rim = g.e(16.4, 59.2, 2.6, 1.15, '#f08a78'); g.on([btn, rim], () => { g.e(15.3, 59.2, .7, .55, '#8a2a30'); g.e(17.6, 59.2, .7, .55, '#8a2a30'); }); });
      // far leg
      g.l(35.6, 54.6, 36.6, 58.8, .95, dk(e, .25)); g.l(36.6, 58.8, 33.8, 60.2, .75, dk(e, .25)); g.l(36.6, 58.8, 39.2, 60.2, .75, dk(e, .25));
      // fluffy body
      const body = g.fur(33.5, 46.5, 11.2, 10, a, { n: 14, amp: .1, mat: 'fur' });
      g.on(body, () => g.e(26.6, 49.6, 5.6, 6, mix(a, b, .55)));
      // folded wing with an oil-slick sheen
      const wing = g.p([30.6, 41.6, 36, 39.4, 42, 40.4, 46.6, 44.6, 49.4, 51, 44.2, 50.4, 39.6, 52, 34.6, 49.6, 31, 46], b);
      g.on(wing, () => { g.p([32, 41.4, 37, 40, 42.6, 41.6, 45.4, 44.4, 37, 44.6], mix(b, d, .6)); g.l(36, 45.6, 44.2, 50, .4, dk(b, .35)); g.l(33.4, 46.4, 39.6, 51.4, .4, dk(b, .35)); g.l(40, 44.8, 48.4, 50.2, .4, dk(b, .35)); });
      // near leg
      g.l(29, 55, 28.4, 58.8, 1.05, e); g.l(28.4, 58.8, 24.6, 60.2, .8, e); g.l(28.4, 58.8, 27.4, 60.4, .8, e); g.l(28.4, 58.8, 31, 60.2, .8, e);
      // scruffy crest
      K2.ear(g, 24.6, 23.6, -30, 6, 1.8, a); K2.ear(g, 27.6, 22.6, 4, 7.4, 1.9, a); K2.ear(g, 30.4, 23.6, 32, 6, 1.8, a);
      // head
      const head = g.e(25.5, 31.5, 10.5, 9.6, a, { mat: 'fur' });
      g.fur(26.4, 35.4, 10.8, 6, a, { n: 10, amp: .18, a0: 20, a1: 160, mat: 'fur', line: false });
      g.on(head, () => g.e(29.6, 25.2, 5.6, 2.6, mix(a, d, .5)));
      // somebody's wedding ring
      hoop(g, 9.8, 38.6, 2.5, .85, c, { mat: 'metal' });
      // beak
      g.p([17.8, 29.4, 11.6, 31.4, 7.4, 34.6, 9.6, 35.6, 17.8, 35.2], e, { gloss: true });
      g.p([17.6, 35, 10.4, 35.8, 12.6, 37.6, 17.6, 38.2], dk(e, .28));
      g.eye(21.4, 30.4, 3.3, 'round', { iris: '#8fd0f4', side: -1, look: -.4 });
      g.eye(30.6, 29.8, 2.9, 'round', { iris: '#8fd0f4', side: 1, look: -.4 });
      twinkle(g, 5.2, 34.6, 1.4, '#fff2a8');
    }
  });

  // ---------------------------------------------------------------- Ravenor
  BEAST('ravenor', {
    pal: { a: '#2c2c40', b: '#46465f', c: '#e8b030', d: '#8e64e0', e: '#e04040', f: '#70708a', h: '#8f8d98', k: '#5a8a3a' }, keep: ['c', 'h', 'k'], sh: 140,
    draw(g) {
      const { a, b, c, d, f, h, k } = g.P;
      const fb = far(b, .3);
      // tail feathers hanging behind the battlement
      const tail = g.p([42, 41, 49, 44, 55.6, 52.6, 57.6, 60.4, 53.8, 58.2, 51.6, 61.4, 48.6, 57.6, 46, 60, 43, 50], a);
      g.on(tail, () => { g.l(50, 50, 53.6, 58, .4, dk(a, .35)); g.l(47.6, 50, 48.6, 57.4, .4, dk(a, .35)); });
      // far wing, mantled
      g.p([19, 22, 12.6, 27, 8.8, 35, 8, 44.8, 10.6, 41.6, 11.4, 47.2, 13.8, 42.6, 15.4, 47.8, 17.6, 42.4, 20.2, 46, 22.4, 38, 24, 28], fb);
      // a merlon of Ironhold's battlements
      g.p([16.5, 48.6, 47.5, 48.6, 49.5, 51.6, 14.5, 51.6], lt(h, .22), { mat: 'stone' });
      const blk = g.p([14.5, 51.6, 49.5, 51.6, 49.5, 61.6, 14.5, 61.6], h, { mat: 'stone' });
      g.on(blk, () => { g.l(14.5, 56.6, 49.5, 56.6, .4, dk(h, .35)); for (const [x, y0, y1] of [[26, 51.6, 56.6], [39, 51.6, 56.6], [20.5, 56.6, 61.6], [32.5, 56.6, 61.6], [44, 56.6, 61.6]]) g.l(x, y0, x, y1, .4, dk(h, .35)); });
      g.fur(44.6, 60.4, 3.6, 1.7, k, { n: 5, amp: .3, a0: 180, a1: 360, mat: 'fur' });
      // body
      const body = g.e(31.5, 33.5, 10.5, 14, a, { mat: 'fur' });
      g.on(body, () => { for (const [x, y] of [[26.6, 35.6], [30.6, 37.6], [27.6, 40.6], [31.6, 42.4], [34, 34.6]]) g.p([x - 2, y, x, y + 1.9, x + 2, y, x, y + .7], b); });
      // feathered thighs, feet gripping the stone
      g.fur(34.6, 45.4, 3.8, 4.2, far(a, .2), { n: 6, amp: .25, a0: 20, a1: 160, mat: 'fur' });
      g.e(33, 49.3, 3.4, 1.4, dk(f, .2)); K2.claws(g, 31, 50, 3, 3.4, 1.9, -1, '#15151f');
      g.fur(27.6, 45.4, 4.2, 4.6, a, { n: 6, amp: .25, a0: 20, a1: 160, mat: 'fur' });
      g.l(26.6, 47.6, 29, 47.6, .95, c, { mat: 'metal' });
      g.e(25.4, 49.3, 3.8, 1.5, f); K2.claws(g, 23.2, 50, 3, 3.8, 2.1, -1, '#15151f');
      // near wing held out like a cloak
      const wing = g.p([36, 22, 39, 14.5, 44.5, 10.5, 50, 13.5, 54.5, 21, 57.5, 31, 59, 42, 58.6, 50.5, 56.4, 46.6, 55, 52, 52.8, 47.6, 51, 52.6, 49, 47.4, 46.6, 51, 45, 45.4, 42.4, 47.6, 41, 42, 38.6, 36, 37, 29], b);
      g.on(wing, () => {
        g.p([37, 22, 39.6, 15, 44.5, 11.6, 49.4, 14.4, 52, 20, 46, 26, 40, 27], a);
        g.p([40, 27, 46, 26, 52, 20, 54.6, 26, 48.6, 33, 41, 34], mix(b, d, .55));
        for (const [x1, y1, x2, y2] of [[56.4, 46.6, 53.6, 33], [52.8, 47.6, 50, 35], [49, 47.4, 46.6, 36.4], [45, 45.4, 43.4, 36.6], [41.6, 36, 54, 33]]) g.l(x1, y1, x2, y2, .4, dk(b, .4));
      });
      // shaggy throat hackles
      K2.ruff(g, 24.6, 27.6, 5.8, 8, mix(a, b, .55), 7, .36, 30, 190);
      // head crest
      K2.ear(g, 28.6, 11, 48, 6.5, 2, a); K2.ear(g, 30.6, 14.6, 70, 6.4, 1.9, a);
      const head = g.e(22.6, 16.8, 9.4, 8.4, a, { mat: 'fur' });
      g.on(head, () => { g.e(26.6, 10.4, 5, 2.2, mix(a, d, .45)); if (!g.back) g.e(21.6, 16.6, 8, 4.6, mix(a, b, .8)); });
      // heavy beak with bristles at the base
      g.p([15.6, 12.4, 9, 13.6, 4.4, 17, 2.4, 21.4, 5, 20.6, 8.6, 19.4, 15.6, 19], f, { gloss: true });
      g.p([15.4, 18.8, 8.4, 19.6, 5.6, 21.6, 9, 22.6, 15.4, 22.4], dk(f, .3));
      g.fur(15.4, 15, 3.2, 2.6, a, { n: 5, amp: .3, a0: 90, a1: 270, mat: 'fur' });
      g.eye(19.2, 16.2, 3.4, 'sharp', { iris: '#ff4848', side: -1, brow: 1, look: -.5 });
      g.eye(26.8, 15.6, 2.8, 'sharp', { iris: '#ff4848', side: 1, brow: 1, look: -.5 });
    }
  });

  // three-leaf clover
  const clover = (g, x, y, s, col, stem) => { g.group(() => { for (const an of [-90, 30, 150]) { const [px, py] = K.pt(x, y, an + 90, 1.25 * s); g.c(px, py, 1.3 * s, col); } }); if (stem) g.dot(x, y, .5 * s, stem); };

  // ---------------------------------------------------------------- Fawnet
  BEAST('fawnet', {
    pal: { a: '#cf9458', b: '#fff4e0', c: '#62b050', d: '#5a3a20', e: '#3a8a40', f: '#f4a8a0' }, keep: ['b', 'f'], sh: -75,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .28);
      // clover growing by its bed
      g.l(56.6, 60.6, 57, 57, .4, e); clover(g, 57, 55.8, 1.05, c, e);
      // tail flicked up, white underneath
      const tail = g.p(poly(50.6, 46.6, 38, [0, -2.4, 4.2, -2.2, 7.4, 0, 4.2, 2.2, 0, 2.4]), a);
      g.on(tail, () => g.p(poly(50.6, 46.6, 38, [0, 0, 4.2, 0, 7.4, 0, 4.2, 2.6, 0, 2.6]), b));
      // far foreleg folded under
      g.e(25, 58.6, 3.6, 2.2, fa);
      // body, lying down
      const body = g.e(38, 51, 13.5, 8.2, a, { mat: 'fur' });
      g.on(body, () => g.e(35, 58, 12, 3, b, CR));
      K2.spots(g, body, [[33, 46.6, 1.5, 1.1], [38.6, 45.2, 1.6, 1.1], [44, 46.2, 1.5, 1.1], [35.6, 50.2, 1.4, 1], [41.4, 49.4, 1.5, 1], [30.2, 50.4, 1.2, .9]], b);
      // haunch and folded hind leg
      const hip = g.e(46.6, 53, 6.6, 6, a, { mat: 'fur' });
      K2.spots(g, hip, [[46.6, 49.6, 1.4, 1], [50, 52.4, 1.2, .9], [44.4, 52.8, 1.1, .8]], b);
      g.tube([47, 57.8, 41, 59.6, 36, 59.6], 2, 1.6, a); g.e(34.4, 59.8, 2.3, 1.4, d);
      // near foreleg stretched out in front
      g.tube([27.6, 54.6, 21.6, 58.6, 15.4, 59.5], 2.3, 1.7, a); g.e(13.6, 59.7, 2.4, 1.5, d);
      // neck
      const neck = g.tube([29, 49.6, 25.6, 43.6, 23.6, 38.2], 4.5, 3.8, a, { mat: 'fur' });
      g.on(neck, () => g.e(22.8, 46, 2.7, 6, b, CR));
      // big ears
      const ear = (x, y, an, len, w, col, inn) => { const id = blade(g, x, y, an, len, w, col); g.on(id, () => blade(g, ...K.pt(x, y, an, len * .18), an, len * .68, w * .5, inn)); };
      ear(27.6, 28.6, 58, 11, 3.2, fa, mix(f, fa, .4));
      ear(17.6, 29.4, -62, 11.5, 3.4, a, f);
      // head and muzzle
      const head = g.e(22, 33.6, 7.8, 7, a, { mat: 'fur' });
      const snout = g.e(15.2, 36.4, 4.9, 3.8, a);
      if (!g.back) g.on([head, snout], () => { g.e(14.2, 38, 4.8, 2.4, b, CR); g.e(21.6, 28.6, 1.3, 1.6, b); });
      // leaf buds where antlers will grow
      K.leaf(g, 20.8, 27.6, -20, 5.6, 2.1, c, e); K.leaf(g, 24.4, 27.2, 24, 5.6, 2.1, c, e);
      // a clover to nibble
      g.l(12.6, 39.4, 9.4, 42.2, .42, e); clover(g, 8.4, 43.2, 1.15, c, e);
      g.eye(19, 33, 3.3, 'cute', { iris: '#a8762c', side: -1, lash: true });
      g.eye(26.6, 32.4, 2.8, 'cute', { iris: '#a8762c', side: 1, lash: true });
      g.nose(10.9, 35.6, 'button', { s: 1.05 });
      g.mo('smile', 13.6, 39, 3);
      g.blush(21.6, 38.4, 1.9);
    }
  });

  // ---------------------------------------------------------------- Oakhart
  BEAST('oakhart', {
    pal: { a: '#9a6a40', b: '#ecdcba', c: '#4a8a3a', d: '#3a2410', e: '#2e6a2e', f: '#7a5030', h: '#d9b85c', k: '#a8845c' }, keep: ['b', 'h', 'k'], sh: -75,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const fa = far(a, .3), ff = far(f, .3);
      // bark-clad lower leg and hoof
      const greave = (id, x0, y0, x1, y1, r, col) => { g.on(id, () => g.l(x0, y0, x1, y1, r + 1, col)); g.e(x1 - .4, y1 + .6, r + .5, 1.6, d); };
      // oak-leaf tail
      K.leaf(g, 54.6, 33.6, 64, 7, 3, c, e);
      // far legs
      const l1 = g.tube([47, 43, 50.6, 50.6, 48.6, 59], 2.8, 2.2, fa); greave(l1, 50, 52.6, 48.6, 59.4, 2.2, ff);
      const l2 = g.tube([27.6, 45, 25.6, 52, 26.4, 59], 2.7, 2.1, fa); greave(l2, 25.8, 52.6, 26.4, 59.4, 2.1, ff);
      // body
      const body = g.re(39.5, 38.5, 14.5, 9, -5, a, { mat: 'fur' });
      const chest = g.e(28.5, 39.5, 9, 10.5, a, { mat: 'fur' });
      g.on([body, chest], () => g.e(38, 47, 13, 2.6, b, CR));
      // old duelling scars
      g.on(body, () => { g.l(40, 33.6, 44, 36.6, .4, lt(a, .4)); g.l(41.6, 32.4, 46, 35.6, .4, lt(a, .4)); });
      // haunch and near hind leg
      g.e(48.5, 39.6, 7.4, 8.6, a, { mat: 'fur' });
      const l3 = g.tube([50.5, 45.5, 54.6, 51.6, 52.4, 59.2], 3.2, 2.4, a); greave(l3, 54, 52.6, 52.4, 59.4, 2.4, f);
      // near foreleg raised, pawing the ground
      const l4 = g.tube([29.5, 46, 24, 50, 22.6, 55.6], 3.2, 2.4, a); greave(l4, 23.6, 51.6, 22.6, 56.4, 2.4, f);
      // neck
      g.tube([31, 36, 26, 29.6, 21.6, 24.6], 6.6, 5, a, { mat: 'fur' });
      // mane of oak leaves down the chest
      for (const [x, y, an, col] of [[29.8, 32, 196, e], [29.4, 36.6, 200, e], [30, 41, 196, e], [26.2, 30.6, 222, c], [25, 34.8, 226, c], [24.8, 39.2, 220, c], [26, 43.4, 210, c]]) K.leaf(g, x, y, an, 7.2, 3, col, col === c ? e : dk(e, .3));
      // ears
      K2.ear(g, 12.6, 20, -62, 7, 2.2, fa, mix(b, fa, .5));
      K2.ear(g, 22.8, 21.4, 82, 8.5, 2.6, a, b);
      // antlers of gnarled oak, hung with leaves and acorns
      const fk = far(k, .3);
      g.tube([14.4, 19, 11, 13, 7, 9.4, 3.6, 9.6], 1.7, 1, fk, { mat: 'stone' });
      g.tube([10.8, 12.8, 11.6, 9.6, 11, 7.4], 1.2, .7, fk, { mat: 'stone' });
      K.leaf(g, 3.8, 9.8, -100, 4.6, 2.1, far(c, .2)); K.leaf(g, 11, 7.8, -24, 4.8, 2.1, far(c, .2));
      acorn(g, 26.6, 13.6, .85, 0, h, d); acorn(g, 37.8, 13.2, .85, 0, h, d);
      g.tube([19.6, 19, 22.4, 12.4, 28.4, 8.6, 35.4, 7.6, 41, 9.6], 2, 1.1, k, { mat: 'stone' });
      g.tube([22.6, 12.2, 22.4, 8.8, 21.4, 6.6], 1.3, .7, k, { mat: 'stone' });
      g.tube([29.4, 8.4, 30.8, 6.4, 31, 5], 1.2, .7, k, { mat: 'stone' });
      K.leaf(g, 21.4, 7, -24, 4.8, 2.2, c, e); K.leaf(g, 31, 5.6, 58, 5, 2.2, c, e); K.leaf(g, 40.6, 9.4, 100, 5.4, 2.4, c, e);
      // head, lowered in challenge
      const head = g.e(17, 24, 7.2, 6.4, a, { mat: 'fur' });
      const snout = g.p([13.6, 20.5, 7, 24.1, 3.6, 27.9, 4.4, 30.7, 11.4, 31.1, 16.4, 29.1], a);
      if (!g.back) g.on([head, snout], () => { g.e(8, 30.1, 6, 2.2, b, CR); g.e(15.4, 19.9, 3.6, 1.5, dk(a, .2)); });
      g.eye(14.6, 23.7, 2.7, 'angry', { iris: '#f0a020', lid: dk(a, .2), side: -1, look: -.5 });
      g.eye(20.8, 23.1, 2.2, 'angry', { iris: '#f0a020', lid: dk(a, .2), side: 1, look: -.5 });
      g.nose(5, 28.1, 'nostrils', { s: .85 });
      g.mo('line', 8.4, 30.9, 3.4);
    }
  });

  // jointed spider leg: thigh in one colour, shin and foot in another
  const sleg = (g, hx, hy, kx, ky, fx, fy, r, c1, c2) => { g.l(kx, ky, fx, fy, r * .82, c2); g.l(hx, hy, kx, ky, r, c1); };

  // ---------------------------------------------------------------- Spinnet
  BEAST('spinnet', {
    pal: { a: '#d2a03e', b: '#fff2d2', c: '#5a3a20', d: '#a868cc', e: '#ecc878', f: '#cfeaff' }, keep: ['b', 'f'], sh: 100,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fc = far(c, .15), fa = far(a, .25);
      // far legs
      sleg(g, 33, 48, 41, 50.6, 46.4, 60.4, 1.3, fa, fc);
      sleg(g, 32, 51, 37.6, 55.4, 38.6, 60.8, 1.3, fa, fc);
      // round abdomen with the garden spider's cross
      const abd = g.fur(41, 40, 12, 11, a, { n: 18, amp: .07, mat: 'fur' });
      K2.spots(g, abd, [[43.4, 33.6, 1.5, 2.1], [44, 38.8, 1.4, 2], [44.4, 43.6, 1.2, 1.6], [39.4, 37.8, 1.9, 1.3], [48.4, 38.2, 1.9, 1.3]], b);
      g.e(52, 44.6, 2.2, 2.6, d);
      // far front leg, raised
      sleg(g, 30, 42.6, 33.4, 34.6, 30.4, 26.6, 1.3, fa, fc);
      sleg(g, 29, 54, 31.6, 58, 30.6, 61, 1.2, a, c);
      // head
      const head = g.e(25, 47, 10, 8.6, e, { mat: 'fur' });
      void head;
      // little violet fangs
      g.e(22.6, 54.6, 1.4, 1.9, d); g.e(27.2, 54.6, 1.4, 1.9, d);
      // near legs: the front one raised
      sleg(g, 24, 54.6, 21.6, 58.4, 23, 61, 1.2, a, c);
      sleg(g, 20, 52.6, 13.6, 55.6, 13.6, 61, 1.3, a, c);
      sleg(g, 18, 49.4, 9.6, 49.4, 6, 60.4, 1.3, a, c);
      sleg(g, 18.4, 45, 11, 40.4, 8.6, 30.6, 1.3, a, c);
      // a thread strung with dew, held up like a string of pearls
      g.tube([8.6, 30.4, 13.6, 35.4, 20, 36.8, 26.4, 33, 30.4, 26.4], .42, .42, '#f6faff', { oc: '#9ab2d2', shade: false });
      for (const [x, y, r] of [[11.6, 33.8, 1.25], [16.8, 36.6, 1.4], [22.8, 35.6, 1.3], [27.8, 31, 1.2]]) { g.c(x, y, r, f, { gloss: true, oc: '#6c98cc' }); g.dot(x - .4, y - .4, .45, '#ffffff'); }
      g.eye(20.6, 46.8, 3.2, 'cute', { iris: '#9a50d8', side: -1 });
      g.eye(29.4, 46.4, 2.9, 'cute', { iris: '#9a50d8', side: 1 });
      g.eye(22.6, 41.2, 1.5, 'bead'); g.eye(27.6, 41, 1.4, 'bead');
      g.mo('smile', 24.9, 51.6, 2.6);
      g.blush(17.8, 50.6, 1.5); g.blush(32, 50.2, 1.4);
    }
  });

  // ---------------------------------------------------------------- Arachnell
  BEAST('arachnell', {
    pal: { a: '#6a3a8a', b: '#f0d440', c: '#2c1c34', d: '#a6e040', e: '#d4b0ea', f: '#8a58aa' }, keep: ['b'], sh: 100,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fc = far(c, .1);
      const leg = (pts, col) => { for (let i = 0; i + 3 < pts.length; i += 2) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], 1.5 - i * .16, col); for (let i = 2; i + 2 < pts.length; i += 2) g.c(pts[i], pts[i + 1], 1.5, b); };
      // far walking legs
      leg([34, 47, 47.4, 45.4, 54.6, 60.6], fc);
      leg([33, 50, 41.6, 53, 44.6, 61], fc);
      // far front leg raised like a spire
      leg([34, 41.6, 52, 36.4, 57, 21.6, 53, 5.6], fc);
      // spire-shaped abdomen with stained-glass markings
      const abd = g.p([37, 3.6, 41.5, 10, 46.5, 18, 49, 26, 48, 33, 43.5, 38.6, 37, 40.4, 30.5, 38.6, 26, 33, 25, 26, 27.5, 18, 32.5, 10], a, { gloss: true });
      g.on(abd, () => {
        g.p([37, 11.6, 39.8, 17.5, 39.8, 27, 34.2, 27, 34.2, 17.5], b);
        g.p([43.2, 20.5, 45, 24, 45, 31, 41.6, 31, 41.6, 24], b);
        g.p([30.8, 20.5, 32.4, 24, 32.4, 31, 29, 31, 29, 24], b);
        g.c(37, 33.4, 2.6, b);
      });
      // head
      const head = g.e(27, 46.4, 10.4, 8.6, f, { mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(26.6, 47.4, 8.6, 5.2, mix(f, e, .55)));
      // fangs, one beaded with venom
      g.tube([23.4, 52.6, 22.8, 56, 24.6, 58.6], 1.4, .5, e); g.tube([29.6, 52.6, 30.4, 56, 28.6, 58.6], 1.4, .5, e);
      g.c(24.8, 60.2, 1.1, d, { gloss: true });
      // near walking legs
      leg([30, 52.6, 34.6, 57, 34, 61.6], c);
      leg([23, 52.6, 19, 57, 20, 61.6], c);
      leg([20, 50, 12.6, 53, 11.6, 61], c);
      leg([19, 47, 9, 45, 4.6, 60.6], c);
      // near front leg raised like a spire
      leg([19, 43, 10.4, 32, 9, 18, 12.6, 5.6], c);
      g.eye(22.2, 46.6, 3.5, 'sharp', { iris: '#c4e828', side: -1, slit: true, brow: 1 });
      g.eye(31.4, 46.2, 3.2, 'sharp', { iris: '#c4e828', side: 1, slit: true, brow: 1 });
      flat(g, F => { for (const [x, y] of [[20.4, 41.2], [24.6, 39.8], [29.2, 39.6], [33.4, 40.8]]) { F.fe(x, y, 1.2, 1.2, '#1b1328'); F.fe(x, y, .72, .72, '#ff4a5a'); } });
      g.mo('line', 26.8, 51.4, 2.6);
    }
  });

  // three-pin plug on the end of a cable: (x, y) is where the cable enters, ang the way the pins point
  const plug = (g, x, y, ang, s, body, pin) => {
    const f = loc(x, y, ang);
    for (const [v, L] of [[-2.3, 2.6], [0, 3.6], [2.3, 2.6]]) g.l(...f(6 * s, v * s), ...f((6 + L) * s, v * s), .8 * s, pin, { mat: 'metal' });
    const id = g.p(poly(x, y, ang, [0, -2, 1.4, -3.8, 5.4, -4.2, 6.6, -3, 6.6, 3, 5.4, 4.2, 1.4, 3.8, 0, 2].map(v => v * s)), body);
    g.on(id, () => { g.l(...f(2.4 * s, -3.4 * s), ...f(2.4 * s, 3.4 * s), .35, dk(body, .25)); g.l(...f(3.8 * s, -3.6 * s), ...f(3.8 * s, 3.6 * s), .35, dk(body, .25)); });
    return id;
  };

  // ---------------------------------------------------------------- Plugpup
  BEAST('plugpup', {
    pal: { a: '#f4d03c', b: '#fff8e0', c: '#46465c', d: '#dc9c1c', e: '#ff9aa8', f: '#d8a838' }, keep: ['b', 'c', 'e', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .25);
      // cable tail, wagging hard enough to spark
      g.tube([48.6, 41.6, 54.4, 38.6, 56.6, 31.6, 54, 25.4], 1.5, 1.4, c);
      plug(g, 54.2, 25.6, -22, 1, b, f);
      bolt(g, 43.6, 20, .8, -30, '#ffe040'); bolt(g, 59.4, 14.6, .7, 30, '#ffe040');
      // far legs
      g.tube([40.6, 49, 41.6, 54, 40.6, 58.6], 2.6, 2.2, fa); g.e(40, 59.6, 3.1, 1.8, far(c, .1));
      g.tube([27, 52, 20, 56.2, 13.6, 57.2], 2.6, 2.2, fa); g.e(12, 57.6, 3, 1.9, far(c, .1));
      // play bow: chest down, rump up
      const body = g.re(36, 46.4, 13, 8, -22, a, { mat: 'fur' });
      g.on(body, () => g.re(32, 52, 10, 3.2, -22, b, CR));
      const hip = g.e(44.6, 43.4, 7.6, 8, a, { mat: 'fur' });
      g.on([body, hip], () => g.p(rot(41.5, 42.5, 20, [-1, -4, 1.9, -4, .5, -.7, 2.4, -.9, -1.3, 4.8, .1, .7, -1.9, .9], 1.1), d));
      // near hind leg
      g.tube([46.4, 48, 48.2, 54, 46.8, 58.8], 3, 2.5, a); g.e(46.2, 59.6, 3.7, 2, c);
      // near foreleg stretched out
      g.tube([29, 54, 22, 58.4, 15.4, 59.2], 3, 2.5, a); g.e(13.2, 59.6, 3.5, 2, c);
      // ears: one flopped, one flying
      blade(g, 30.6, 33.6, 56, 11.5, 4, far(d, .12));
      const head = g.e(22, 39.6, 10.6, 9.6, a, { mat: 'fur' });
      if (!g.back) g.on(head, () => { g.e(16.4, 44, 7, 5, b, CR); g.p([21.6, 30, 24.2, 30, 23.4, 36.6, 22.2, 36.6], b); });
      blade(g, 13.6, 33.4, -168, 11.5, 3.9, d);
      g.eye(17.8, 37.8, 3.3, 'bead'); g.eye(26.8, 37.2, 3, 'bead');
      flat(g, F => { F.fe(17.2, 33.6, 1.4, .9, b); F.fe(26.8, 33, 1.3, .85, b); });
      g.nose(12.6, 41.6, 'button', { s: 1.3 });
      g.mo('open', 16.8, 45, 4.8, { h: 3.6 });
    }
  });

  // ---------------------------------------------------------------- Voltweiler
  BEAST('voltweiler', {
    pal: { a: '#363650', b: '#dc8c40', c: '#ffe040', d: '#9a9aae', e: '#ff5050', f: '#f4f0e8' }, keep: ['c', 'd', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, f } = g.P;
      const fa = far(a, .3), fb = far(b, .3);
      const paw = (x, y, col) => { const id = g.e(x, y, 4.2, 2.2, col); if (!g.small) g.on(id, () => { g.l(x - 1.8, y - .2, x - 1.8, y + 2.2, .35, dk(col, .4)); g.l(x, y - .2, x, y + 2.2, .35, dk(col, .4)); }); };
      // tail: a stack of pylon insulators, arcing at the tip
      g.l(54.6, 32, 58.4, 19.6, 1, '#5a5a70');
      for (const [x, y] of [[55.6, 28.6], [56.7, 25], [57.8, 21.4]]) g.re(x, y, 3.2, 1.5, 17, f, { gloss: true });
      g.c(58.8, 18.2, 1.7, d, { mat: 'metal' });
      bolt(g, 55.6, 11.6, .9, -14, c);
      // far legs
      const l1 = g.tube([46, 43, 48.6, 51, 47.6, 58.6], 3.2, 2.6, fa); g.on(l1, () => g.l(48.2, 54, 47.6, 59, 3.6, fb)); paw(47, 59.5, fb);
      const l2 = g.l(24.6, 44, 23, 58.6, 3.1, fa); g.on(l2, () => g.l(23.4, 54, 23, 59, 3.6, fb)); paw(22.4, 59.5, fb);
      // body
      const body = g.re(38.5, 37.5, 15, 10, -4, a, { mat: 'fur' });
      const chest = g.e(27, 38.5, 9.5, 11.5, a, { mat: 'fur' });
      g.on(chest, () => g.e(22.6, 43, 4.6, 6.6, b));
      const hip = g.e(49.5, 37.6, 8, 9.6, a, { mat: 'fur' });
      // hazard-stripe lightning along the flank
      g.on([body, hip], () => g.p([31.6, 36, 39, 32.4, 38, 36.4, 46, 33, 45, 37, 53, 34.6, 43.4, 40.6, 44.4, 37, 36.4, 40, 37.2, 36.2], c));
      // hackles up
      K2.zig(g, 44, 28.6, 28, 27.6, 5, 2.6, a);
      // near legs
      const l3 = g.tube([51.5, 44, 55.4, 51, 53.6, 58.6], 3.7, 2.9, a); g.on(l3, () => g.l(54.6, 54, 53.6, 59, 4, b)); paw(53, 59.6, b);
      const l4 = g.l(29.6, 46, 28.6, 58.6, 3.6, a); g.on(l4, () => g.l(28.9, 54, 28.6, 59, 4, b)); paw(28, 59.6, b);
      // neck and steel collar with a warning tag
      g.tube([29, 34, 24, 27, 20.6, 22], 7, 6.2, a, { mat: 'fur' });
      g.re(25.6, 30.4, 7.4, 2.3, 38, d, { mat: 'metal' });
      K2.zig(g, 20.4, 26.6, 29.6, 33.8, 4, 1.9, lt(d, .3), { mat: 'metal' });
      const tag = g.p([22.2, 34.4, 25.6, 40, 18.8, 40], c);
      flat(g, F => { F.fl(22.4, 36.4, 21.8, 38, .3, '#1b1328', true); F.fl(21.8, 38, 22.8, 38, .3, '#1b1328', true); F.fl(22.8, 38, 22.2, 39.4, .3, '#1b1328', true); });
      void tag;
      // drop ears
      g.p([22.6, 11.6, 28.6, 12.6, 29.6, 20.6, 26, 18.6, 23, 15], fa);
      // head and blocky muzzle
      const head = g.e(18.6, 18.6, 9, 8.2, a, { mat: 'fur' });
      const snout = g.p([14, 16.6, 6.4, 18.4, 3.4, 21.4, 3.4, 26.4, 6.4, 28.8, 14, 29, 18.6, 26.4], a);
      if (!g.back) g.on([head, snout], () => { g.p([3, 23.6, 9, 23, 14.6, 25.4, 20.6, 24.6, 19, 30, 3, 30], b); g.e(14.2, 12.8, 1.6, 1.1, b); g.e(21.4, 12.2, 1.4, 1, b); });
      g.p([11.4, 12.4, 15.6, 9.6, 13.6, 17.6, 10.4, 20.4, 9.6, 16], a);
      g.eye(14.4, 17.4, 2.7, 'glow', { iris: '#ffe85a', side: -1, brow: 1 });
      g.eye(21.6, 16.8, 2.3, 'glow', { iris: '#ffe85a', side: 1, brow: 1 });
      g.nose(4.8, 20.8, 'button', { s: 1.4 });
      g.mo('teeth', 9.6, 25.6, 7.4, { h: 2.8 });
      bolt(g, 4.4, 33.4, .62, -20, c);
    }
  });
})();