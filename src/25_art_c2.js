// ---- art/c2 ----
// ===== c2: the nurse lambs, the tug-of-war bulldogs and the glen cattle =====
(() => {
  // puffy wool cloud: a core ellipse with n curls round its edge, merged into one part list
  const cloud = (g, cx, cy, rx, ry, n, r, col, o = {}, a0 = 0, a1 = 360) => {
    const ids = [];
    g.group(() => {
      const full = a1 - a0 >= 360, m = full ? n : n - 1;
      for (let i = 0; i < n; i++) {
        const t = (a0 + (a1 - a0) * (m ? i / m : 0)) * Math.PI / 180;
        ids.push(g.c(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, r * (i % 2 ? .9 : 1.06), col, o));
      }
      ids.push(g.e(cx, cy, rx, ry, col, o));
    });
    return ids;
  };
  const heart = (g, x, y, s, col, o = {}) => {
    const ids = [];
    g.group(() => {
      ids.push(g.p([x - 1.02 * s, y + .1 * s, x + 1.02 * s, y + .1 * s, x, y + 1.25 * s], col, o));
      ids.push(g.c(x - .5 * s, y - .22 * s, .56 * s, col, o));
      ids.push(g.c(x + .5 * s, y - .22 * s, .56 * s, col, o));
    });
    return ids;
  };
  const curl = (g, x, y, s, col) => g.tube([x - s, y + .5 * s, x - .2 * s, y - .8 * s, x + s, y - .1 * s, x + .3 * s, y + .7 * s], .42, .42, col, { ring: false, shade: false });

  BEAST('kindlet', {
    pal: { a: '#fff3f6', b: '#ffc2d2', c: '#e8709a', d: '#ffffff', e: '#efcbd9' }, keep: ['a', 'd'], sh: -105,
    draw(g) {
      const { a, b, c, e } = g.P;
      const far = mix(b, '#6a3060', .22);
      // tail pom
      cloud(g, 48, 52, 2.6, 2.4, 5, 2.2, a, { mat: 'soft' });
      // far arm, raised for a cuddle
      g.tube([28, 45, 21.5, 44.8, 16.5, 43], 2.5, 2.2, far); g.c(15.8, 42.6, 2.3, mix(c, '#6a3060', .2));
      // woolly body, sitting upright
      const body = cloud(g, 35.5, 48.5, 9.6, 8.2, 10, 4.4, a, { mat: 'soft' });
      g.on(body, () => heart(g, 40.5, 46.2, 3.5, c, { ring: false }));
      if (!g.small) { curl(g, 31.5, 52.5, 1.5, e); curl(g, 44.5, 53.5, 1.4, e); curl(g, 35, 43.4, 1.3, e); }
      // hind feet poking out
      for (const [x, y] of [[37.5, 59.2], [25.5, 58.6]]) { const f = g.e(x, y, 4, 2.7, b); g.on(f, () => g.e(x - 2.6, y, 2.2, 3, c)); }
      // near arm reaching out
      g.tube([31.5, 48, 25, 51, 19.5, 50.6], 2.7, 2.4, b); g.c(18.8, 50.4, 2.5, c);
      // head: wool hood, droopy ears, pink face
      cloud(g, 31.5, 27.5, 9.6, 8.4, 9, 4.1, a, { mat: 'soft' }, -178, 62);
      K2.ear(g, 17.5, 28.4, -104, 9.5, 3.6, b, c);
      K2.ear(g, 37.5, 28, 104, 9, 3.4, b, c);
      if (g.back) cloud(g, 28.5, 31, 8.4, 7, 9, 3.8, a, { mat: 'soft' });
      else { const face = g.e(27, 32.6, 10.2, 9.2, b); g.on(face, () => g.e(21.5, 37.4, 6.2, 4, lt(b, .6))); }
      // forelock curl
      cloud(g, 27.5, 23.4, 4.6, 2.2, 5, 2.7, a, { mat: 'soft' }, -180, 0);
      g.eye(22, 30.4, 3.1, 'cute', { iris: '#d2508e', side: -1 });
      g.eye(31.8, 30, 2.8, 'cute', { iris: '#d2508e', side: 1 });
      if (!g.back) g.e(21, 35, 1.5, 1.1, c, { ring: false, shade: false });
      g.mo('smile', 21.8, 37.5, 3.8);
      g.blush(26.4, 35.6, 1.6); g.blush(35, 34.4, 1.3);
    }
  });

  BEAST('carefluff', {
    pal: { a: '#fff5f8', b: '#ffbacd', c: '#e0608a', d: '#ffffff', e: '#ffe6a0', f: '#ecc6d6', h: '#a8c0f0' }, keep: ['a', 'd', 'e'], sh: -105,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(b, '#6a3060', .22);
      // tail pom
      cloud(g, 57, 50, 2.6, 2.6, 5, 2.4, a, { mat: 'soft' });
      // a little patient napping in the fleece
      K2.ear(g, 45.5, 19, -24, 6, 2.4, h, lt(h, .45)); K2.ear(g, 53.5, 19.5, 26, 6, 2.4, h, lt(h, .45));
      const nap = g.e(49.5, 23.5, 6.6, 5.8, h);
      if (!g.small) {
        g.on(nap, () => { g.l(46.6, 19.6, 50.4, 18.8, 1.1, '#fff6e0', { ring: false }); });
        g.tube([45, 24.2, 46.2, 25.2, 47.6, 24.4], .5, .5, '#2a2440', { ring: false, shade: false });
        g.tube([50.6, 24.4, 52, 25.2, 53.2, 24.2], .5, .5, '#2a2440', { ring: false, shade: false });
      }
      // great fleece
      const body = cloud(g, 37, 43.5, 17.6, 12.4, 13, 6, a, { mat: 'soft' });
      if (!g.small) for (const [x, y, s] of [[45, 37, 1.9], [51, 46, 1.8], [36, 51, 1.9], [43, 55, 1.6], [28, 45, 1.7], [52.5, 34.5, 1.5]]) curl(g, x, y, s, f);
      void body;
      // front feet
      for (const [x, y, col] of [[18.5, 59, far], [31.5, 59.6, b]]) { const ft = g.e(x, y, 4.6, 2.8, col); g.on(ft, () => g.e(x - 3, y, 2.5, 3, c)); }
      // far horn and ear
      g.tube([16.5, 12.5, 11.5, 11.4, 7, 15, 8, 20.6, 12, 21.4, 12.4, 17.6], 3, 1.5, dk(e, .12), { gloss: true });
      K2.ear(g, 12.5, 24.5, -122, 8, 3, far, c);
      // neck ruff
      cloud(g, 24, 35.5, 9.5, 4.6, 9, 3.6, a, { mat: 'soft' });
      // heart charm
      if (!g.back) { const hz = heart(g, 19.5, 38.6, 3.3, c, { gloss: true }); g.on(hz, () => { g.l(19.5, 37.6, 19.5, 40.6, .55, d, { ring: false, shade: false }); g.l(18, 39.1, 21, 39.1, .55, d, { ring: false, shade: false }); }); }
      // head
      K2.ear(g, 28, 24.5, 122, 8.5, 3.2, b, c);
      if (g.back) cloud(g, 21.5, 23.5, 7, 7.6, 9, 3.4, a, { mat: 'soft' });
      else { const face = g.e(20.5, 24, 8.6, 10, b); g.on(face, () => g.e(17, 29.6, 6.2, 4.6, lt(b, .55))); }
      cloud(g, 21, 14.5, 6.4, 2.6, 6, 3.3, a, { mat: 'soft' }, -190, 10);
      // near horn: a tight golden spiral
      const horn = g.tube([25.5, 12.6, 31, 10.6, 36.2, 14.6, 35.4, 21, 30, 22.6, 27.6, 18.6, 31, 16.6], 3.3, 1.7, e, { gloss: true });
      K2.stripes(g, horn, 22, 6, 40, 26, 60, 2.6, .5, dk(e, .22));
      g.eye(16, 22.6, 2.9, 'happy', { side: -1 });
      g.eye(24.6, 22.1, 2.6, 'happy', { side: 1 });
      if (!g.back) g.e(15.2, 27.4, 1.7, 1.2, c, { ring: false, shade: false });
      g.mo('smile', 16.4, 30, 4.2);
      g.blush(22.6, 26.8, 1.8); g.blush(11.4, 26.6, 1.2);
    }
  });

  BEAST('bullnip', {
    pal: { a: '#eadfcb', b: '#c9a474', c: '#5e3f2a', d: '#ff8fa3', e: '#fffaf0', f: '#d9a94e', h: '#d8343c' }, keep: ['e', 'f', 'h'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, '#3a2238', .26);
      // stub tail, mid-wag
      g.tube([50, 43.5, 54, 41, 55, 37.5], 2.1, 1.5, b);
      // far legs, braced against the pull
      g.tube([45, 48, 48.5, 53.5, 47.5, 58.6], 2.9, 2.5, far); g.e(47, 59.4, 3.3, 1.9, far);
      g.tube([27, 48, 22, 53, 20, 58.6], 2.9, 2.5, far); g.e(19.4, 59.4, 3.3, 1.9, far);
      // barrel body leaning back
      const body = g.re(40.5, 46, 11.8, 8.4, 8, a);
      g.on(body, () => { g.e(46, 40.5, 7.5, 5, b); });
      const hl = g.tube([48, 49, 52, 54.5, 51, 59], 3.4, 2.9, a); void hl;
      g.e(50.4, 60, 3.9, 2.1, e);
      const fl = g.tube([32, 49.5, 28.5, 55, 27.5, 59], 3.4, 2.9, a); void fl;
      g.e(27, 60, 3.9, 2.1, e);
      // ears: one pricked, one flopped
      K2.ear(g, 13.5, 29, -40, 8.5, 3.8, b, d);
      g.p([29.5, 27.5, 35.5, 24.6, 39, 30.4, 34.4, 32.6], b);
      const head = g.e(23, 36, 12.6, 10.6, a);
      if (!g.back) {
        g.on(head, () => g.e(30, 32, 6.2, 6.6, b));
        // jowls and jutting chin
        g.e(19, 46.2, 7.6, 3.4, a);
        g.e(18.5, 41.6, 9.8, 4.9, e);
        if (!g.small) { g.l(20.5, 29.4, 22.6, 30.6, .45, dk(a, .32), { ring: false, shade: false }); g.l(24.6, 30.6, 26.4, 29.2, .45, dk(a, .32), { ring: false, shade: false }); }
      }
      // the rope it will never let go of
      const rope = g.tube([2.5, 49.5, 8, 47.6, 15, 46, 27, 45.4, 31.4, 46.4], 1.7, 1.7, f);
      K2.stripes(g, rope, 0, 42, 34, 52, 30, 2.3, .6, dk(f, .32));
      g.c(31.4, 46.4, 2.5, f);
      g.p([7.6, 48, 9.4, 48.4, 11.6, 54, 9.2, 53, 8.6, 55.4, 6.2, 51], h); g.c(8.2, 47.6, 1.9, h);
      if (!g.back) { g.p([13.4, 47.6, 14.6, 43.6, 16, 47.6], '#ffffff'); g.p([22.4, 47.4, 23.6, 43.6, 25, 47.4], '#ffffff'); }
      g.eye(17, 33.4, 3, 'round', { iris: '#8a5426', side: -1, brow: 1, look: -.4 });
      g.eye(27.8, 32.8, 2.7, 'round', { iris: '#8a5426', side: 1, brow: 1, look: -.4 });
      g.nose(14.4, 39.4, 'button', { s: 1.35 });
      g.blush(31.4, 38.4, 1.6);
    }
  });

  BEAST('bulwark', {
    pal: { a: '#e2d3ba', b: '#b99668', c: '#523522', d: '#8f9bb0', e: '#fffaf0', f: '#c9343a', h: '#c8d2e2' }, keep: ['e', 'd', 'h'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, '#2a1a30', .28), M = { mat: 'metal' };
      // stub tail
      g.tube([56, 32, 60, 29.5, 60.5, 26], 2.2, 1.6, b);
      // far legs
      g.l(50, 44, 51.5, 56.5, 4.6, far); g.e(51, 59, 5, 2.4, dk(e, .25));
      g.l(13, 42, 10.5, 56, 5, far); g.e(9.8, 59, 5.6, 2.6, dk(e, .25));
      // barrel body with segmented back plates
      const body = g.e(42.5, 38, 16.5, 12, a);
      g.on(body, () => g.e(49, 45, 9, 5, b));
      g.p([44, 27, 52, 26, 60, 32, 59, 38.5, 49, 36], d, M);
      g.p([36, 25.5, 46, 24.5, 52, 28, 50, 36, 40, 34.5], d, M);
      // near hind leg
      const hl = g.l(54, 45, 56, 57, 5, a); void hl; g.e(56, 59.6, 5.6, 2.6, e);
      // deep chest
      const chest = g.e(24.5, 43, 13, 11, a);
      g.on(chest, () => g.e(21.5, 46, 8.5, 8, e));
      // near foreleg with an iron bracer
      const fl = g.l(32.5, 45, 33.5, 57, 5.6, a);
      g.on(fl, () => g.e(33.2, 52.4, 7, 3.2, d, M));
      g.e(33, 59.6, 6.2, 2.8, e);
      K2.toes(g, 33, 61, 3, 5, dk(e, .4)); K2.toes(g, 9.8, 60.4, 3, 4.4, dk(e, .5));
      // spiked shoulder plate
      for (const [x, y, ang] of [[34, 27.5, -18], [40, 27, 14], [45, 31, 44]]) K2.ear(g, x, y, ang, 6.5, 2.2, h);
      const pau = g.e(38.5, 34, 9, 7.6, d, M);
      g.on(pau, () => g.e(38.5, 39.6, 10, 2.6, dk(d, .3)));
      // red collar with studs
      const col = g.tube([6.5, 34, 12, 42, 23, 44.6, 33, 39], 2.5, 2.5, f);
      void col;
      for (const [x, y, ang] of [[10.6, 43, 215], [17, 46, 190], [24.5, 46.6, 170], [30.5, 43.6, 140]]) K2.ear(g, x, y, ang, 4.2, 1.6, h);
      // cropped ears, head, iron helm
      K2.ear(g, 8.5, 16, -38, 7, 3.4, b, '#ff9aa8'); K2.ear(g, 32, 14.5, 36, 7, 3.4, b, '#ff9aa8');
      const head = g.e(20, 25, 13.6, 11.6, a);
      void head;
      if (!g.back) {
        g.e(17.6, 37.2, 9, 3.6, a);
        g.e(18, 31.8, 11.6, 6.2, e);
      }
      const helm = g.p([7, 21.5, 9, 14.5, 15, 10.6, 22, 9.6, 29, 11.6, 33.4, 17, 33.6, 21, 26, 19.6, 21.4, 22.6, 14.6, 20.4], d, M);
      g.on(helm, () => { g.l(8, 20, 33, 19, .5, dk(d, .35), { ring: false, shade: false }); });
      g.p([19, 12, 21.4, 3.6, 24.4, 12.4, 22.6, 22.8, 20.6, 22.8], h, M);
      if (!g.small) for (const [x, y] of [[11.6, 16.6], [15.6, 13.4], [28.4, 14.4], [31, 18]]) g.dot(x, y, .7, lt(h, .5));
      if (!g.back) { g.p([10, 38.4, 11.6, 32.6, 13.6, 38.4], '#ffffff'); g.p([21.6, 38.2, 23.6, 32.6, 25.4, 38.2], '#ffffff'); }
      g.eye(14.2, 24.6, 2.7, 'angry', { iris: '#f2c22e', lid: d, side: -1 });
      g.eye(26.6, 24.2, 2.4, 'angry', { iris: '#f2c22e', lid: d, side: 1 });
      g.nose(15, 29.6, 'button', { s: 1.7 });
    }
  });

  BEAST('calfling', {
    pal: { a: '#c8703a', b: '#eaa765', c: '#633618', d: '#ffc6b6', e: '#f2e4c6' }, keep: ['d', 'e'], sh: 185,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const far = mix(a, '#34162c', .3), F = { mat: 'fur' };
      // tail with a tuft
      g.tube([49, 41, 54, 43.5, 55.4, 50], 1.3, 1, a);
      g.fur(55.6, 53, 2.6, 3.6, b, { n: 7, amp: .3, a0: 0, a1: 180, mat: 'fur' });
      // far legs
      g.l(44.5, 49, 45.5, 57.5, 2.8, far); g.e(45.4, 59.4, 3.1, 1.8, c);
      g.l(27, 50, 25.5, 57.5, 2.8, far); g.e(25, 59.4, 3.1, 1.8, c);
      // shaggy little barrel
      const body = g.e(39, 44, 12.6, 9, a, F);
      const skirt = g.fur(39, 47.5, 12.4, 6.6, a, { n: 11, amp: .3, a0: 8, a1: 172, mat: 'fur', line: false });
      if (!g.small) g.on([body, skirt], () => { for (const [x, y, l] of [[37, 41, 7], [42, 39.5, 8], [46.5, 41.5, 7]]) g.tube([x, y, x + 1.2, y + l * .55, x + .5, y + l], .5, .3, dk(a, .2), { ring: false }); });
      // near legs
      g.l(48, 50, 48.6, 58, 3.1, a); g.e(48.6, 59.8, 3.4, 1.9, c);
      g.l(32.5, 51, 32, 58, 3.1, a); g.e(31.6, 59.8, 3.4, 1.9, c);
      // head, carried low
      K2.ear(g, 31, 34.6, 96, 9, 3.4, a, d);
      K2.ear(g, 11.5, 35.4, -96, 8.5, 3.2, far, d);
      g.tube([14.6, 29, 12.6, 26.4, 12.8, 24], 1.5, .9, e, { gloss: true });
      g.tube([27.6, 28, 30, 25.6, 30, 23], 1.5, .9, e, { gloss: true });
      const head = g.e(21.5, 36.5, 10.4, 9.6, a, F);
      void head;
      if (!g.back) {
        const muz = g.e(17.6, 42.6, 7.4, 5, d);
        void muz;
        // a plaster on its much-bumped nose
        if (!g.small) { g.l(19.4, 39.8, 23.4, 42, 1.2, '#f7e3b2'); g.dot(21.4, 40.9, 1, '#dcbc80'); }
      }
      g.eye(16.4, 35.4, 3, 'bead');
      g.nose(14, 41.6, 'nostrils', { s: .9 });
      g.mo('tongue', 16, 44.8, 3.6);
      // the fringe it cannot see through
      for (const [x, y, ang, len, col] of [[29.4, 29.6, 162, 9, dk(b, .1)], [13.4, 30.4, 202, 7, dk(b, .1)], [25.4, 28.8, 172, 11, b], [17.4, 29.4, 188, 6, b], [21.2, 28.6, 180, 9.6, lt(b, .12)]]) K2.ear(g, x, y, ang, len, 2.7, col);
      g.fur(21.6, 29.4, 9.4, 5, b, { n: 8, amp: .3, a0: 186, a1: 354, mat: 'fur', line: false });
    }
  });

  BEAST('highhorn', {
    pal: { a: '#b65e28', b: '#e39556', c: '#45260f', d: '#ebe0cb', e: '#ffbda6', h: '#b672e0' }, keep: ['d', 'e', 'h'], sh: 185,
    draw(g) {
      const { a, b, c, d, e, h } = g.P;
      const far = mix(a, '#2a1024', .32), F = { mat: 'fur' };
      // tail swishing
      g.tube([57, 29, 61, 33, 60.4, 42], 1.5, 1.1, a);
      g.fur(60, 46.4, 2.8, 4.6, b, { n: 7, amp: .3, a0: 0, a1: 180, mat: 'fur' });
      // far legs
      g.l(50.5, 45, 51.5, 56.5, 4, far); g.e(51.4, 59.2, 4.2, 2.2, c);
      g.l(22.5, 47, 20.5, 56.5, 4, far); g.e(20, 59.2, 4.2, 2.2, c);
      // great shaggy body with a muscled shoulder hump
      const body = g.e(43, 36.5, 16.6, 12.4, a, F);
      g.e(34, 28.5, 10.5, 8.4, a, { mat: 'fur', line: false });
      const skirt = g.fur(43, 42, 16.6, 10, a, { n: 13, amp: .26, a0: 6, a1: 174, mat: 'fur', line: false });
      if (!g.small) g.on([body, skirt], () => { for (const [x, y, l] of [[40, 33, 9], [45, 31, 11], [50, 33, 10], [54.5, 36, 8], [36.5, 38, 8]]) g.tube([x, y, x + 1.4, y + l * .55, x + .6, y + l], .5, .3, dk(a, .2), { ring: false }); });
      // near legs with feathered fetlocks
      g.l(55, 46, 56, 56.5, 4.4, a); g.fur(56, 55.6, 4.8, 2.6, b, { n: 6, amp: .3, a0: 0, a1: 180, mat: 'fur' }); g.e(56, 59.6, 4.6, 2.3, c);
      g.l(32.5, 47, 31.5, 56.5, 4.6, a); g.fur(31.4, 55.6, 5, 2.6, b, { n: 6, amp: .3, a0: 0, a1: 180, mat: 'fur' }); g.e(31, 59.6, 4.8, 2.4, c);
      // chest mane
      g.fur(25, 44.5, 8, 8, b, { n: 9, amp: .3, a0: 10, a1: 190, mat: 'fur' });
      // gate-wide horns
      const h1 = g.tube([11, 25, 5, 25.5, 2.6, 18, 5.6, 9], 3, .9, d, { gloss: true });
      const h2 = g.tube([29, 23.5, 38, 24, 45.5, 16, 44, 5], 3.1, .9, d, { gloss: true });
      g.on([h1], () => g.e(5, 10, 3.4, 4.4, c)); g.on([h2], () => g.e(44.6, 7, 3.4, 5, c));
      // ears
      K2.ear(g, 30.5, 29.5, 100, 8, 3, a, e); K2.ear(g, 9.5, 31, -100, 7, 2.8, far, e);
      // a sprig of glen heather caught on a horn
      if (!g.small) { K.leaf(g, 32, 22, 60, 5, 1.8, '#5c9a48', '#3c6e34'); for (const [x, y, r] of [[33.6, 19.4, 1.5], [36, 20.4, 1.4], [34.8, 17.2, 1.3]]) g.c(x, y, r, h); }
      const head = g.e(20, 32, 11, 10, a, F);
      void head;
      if (!g.back) g.e(15.6, 40.4, 7.4, 4.9, e);
      g.eye(14.8, 31.6, 2.9, 'sharp', { iris: '#f0a41c', side: -1, look: -.3 });
      g.eye(25.2, 31, 2.5, 'sharp', { iris: '#f0a41c', side: 1, look: -.3 });
      g.nose(12.8, 39.6, 'nostrils', { s: 1.25 });
      g.mo('line', 15.2, 43, 4.4);
      // parted fringe
      g.fur(13.6, 24.6, 5.6, 3.8, b, { n: 5, amp: .34, a0: 20, a1: 200, mat: 'fur' });
      g.fur(25.8, 24, 6, 3.8, b, { n: 5, amp: .34, a0: -20, a1: 160, mat: 'fur' });
      g.fur(20, 22.6, 7, 3.4, b, { n: 7, amp: .28, a0: 180, a1: 360, mat: 'fur', line: false });
    }
  });
})();