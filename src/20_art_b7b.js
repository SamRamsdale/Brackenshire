// ---- art/b7b ----
// ===== Batch 7b: crag goats, moor eagles, pine martens and the black dogs of the crossroads =====
(() => {
  // fan of broad, round-tipped feathers from a shoulder (angles clockwise from straight up)
  const plume = (g, x, y, angs, lens, r0, r1, col, o) => {
    for (let i = 0; i < angs.length; i++) {
      const [mx, my] = K.pt(x, y, angs[i], lens[i] * .5), [tx, ty] = K.pt(x, y, angs[i], lens[i]);
      g.tube([x, y, mx, my, tx, ty], r0, r1, col, o);
    }
  };

  // ---------- Kidstone line: mountain goats with stone horns ----------
  BEAST('kidstone', {
    pal: { a: '#f1e9d9', b: '#b8ae9e', c: '#8490ac', d: '#4a4654', e: '#ffaa9a', f: '#c9cf4e' }, keep: ['e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, '#4a4058', .28);
      // the pinnacle it is balancing on, all four hooves bunched together
      const rock = g.p([23, 61, 25.5, 55, 29.5, 51.5, 40, 51, 44.5, 54.5, 47.5, 61], c, { mat: 'stone' });
      g.on(rock, () => { g.l(33.5, 52, 31.5, 56.5, .45, dk(c, .35)); g.l(31.5, 56.5, 34, 60.5, .45, dk(c, .35)); g.e(41.5, 57, 2.6, 1.6, f); g.e(26.8, 59.2, 1.6, 1, f); });
      // far legs
      g.tube([31, 42, 31.5, 47, 33.2, 50.4], 2, 1.6, far); g.tube([42, 42, 40, 47, 38, 50.4], 2, 1.6, far);
      g.e(33, 51, 1.9, 1.2, d); g.e(37.8, 51, 1.9, 1.2, d);
      // tail
      g.tube([45, 35, 48.5, 32.5, 49.5, 28.5], 2, 1.5, a, { mat: 'fur' });
      // body
      const body = g.e(36.5, 38.5, 11, 7.6, a, { mat: 'fur' });
      K2.spots(g, body, [[40, 33.4, 3.4, 2.2], [45.5, 38, 2.2, 2.6], [33.5, 33.6, 1.6, 1.2]], b);
      // near legs
      g.tube([28.5, 42, 29, 47, 30.6, 50.6], 2.5, 1.9, a); g.tube([44.5, 41, 44.6, 46, 41, 50.6], 2.7, 1.9, a);
      g.e(30.2, 51.4, 2.3, 1.4, d); g.e(40.8, 51.4, 2.3, 1.4, d);
      // neck, ears, horn nubs
      g.tube([29, 36, 25.5, 32, 23.5, 29], 5, 4.6, a, { line: false });
      K2.ear(g, 14.5, 25.5, -105, 9.5, 3.1, a, e); K2.ear(g, 29, 24, 82, 9, 3, a, e);
      g.tube([18, 21.5, 16.6, 15], 2.4, 1.8, c, { mat: 'stone' }); g.tube([25.4, 20.6, 26.8, 14.6], 2.3, 1.7, c, { mat: 'stone' });
      const head = g.e(21.5, 28, 9.6, 8.6, a, { mat: 'fur' });
      const snout = g.e(13.4, 31.6, 5.2, 4, lt(a, .5));
      void head; void snout;
      g.fur(21.4, 20.6, 3.6, 2.4, a, { n: 5, amp: .35, a0: -170, a1: -10, line: false });
      // a sticking plaster from the latest bump
      if (!g.back && !g.small) { g.l(20.2, 22.2, 24, 24.8, .75, '#f2a488', { ring: false, shade: false }); g.l(20.4, 24.8, 23.8, 22.2, .75, '#f2a488', { ring: false, shade: false }); }
      g.eye(17.3, 27.6, 3.3, 'cute', { iris: '#e09a28', side: -1 });
      g.eye(25.8, 27.1, 3, 'cute', { iris: '#e09a28', side: 1 });
      g.nose(10, 30.6, 'pink', { s: 1 });
      g.mo('open', 14.2, 33, 3.2, { h: 2 });
      g.blush(18.2, 32.6, 1.7); g.blush(28, 31.8, 1.5);
    }
  });

  BEAST('billycrag', {
    pal: { a: '#e2d9c8', b: '#aaa092', c: '#74809e', d: '#3e3a48', e: '#faf6ee', f: '#c4ca48', h: '#f08a30' }, keep: ['e'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, '#40384e', .36), farc = mix(c, '#1a1030', .3);
      // far horn
      g.tube([22, 15, 28, 7, 38, 4.5, 47, 9, 50, 17], 3.2, 1.2, farc, { mat: 'stone' });
      // tail
      g.tube([50, 41, 54.5, 38, 55.5, 34], 2.2, 1.6, a, { mat: 'fur' });
      // far hind leg and far foreleg
      g.tube([47, 44, 52.5, 51, 50.5, 58.5], 3.4, 2.4, far); g.e(50, 59.5, 3.4, 1.8, d);
      g.tube([27, 32, 21, 38.5, 15.5, 43.5], 2.8, 2.1, far); g.e(14.4, 44.8, 2.5, 2, d);
      // body, rearing
      const body = g.tube([45, 45, 37, 37, 29, 28], 9.5, 9, a, { mat: 'fur' });
      void body;
      // crag plates along the spine
      for (const pts of [[37, 22, 42.5, 18.5, 46, 24.5, 41, 28], [44, 27, 50, 25.5, 52, 31.5, 46.5, 33.5], [49.5, 34.5, 54.5, 34.5, 54.5, 40, 50.5, 40]]) g.p(pts, c, { mat: 'stone' });
      // haunch and near hind leg
      g.e(45, 45.5, 7.6, 8.2, a, { mat: 'fur', line: false });
      const hl = g.tube([45, 49, 50.5, 54, 46, 59], 3.8, 2.8, a);
      g.on(hl, () => g.e(47, 56.5, 4, 1.4, c));
      g.e(45.3, 59.7, 3.9, 2, d);
      // shaggy chest
      K2.ruff(g, 27.5, 34, 7.5, 8, e, 10, .3, 20, 250, { dk: '#cfc6b6' });
      // near foreleg
      const fl = g.tube([31, 34, 25.5, 42, 23.5, 49], 3.1, 2.3, a);
      g.on(fl, () => g.e(23.8, 47, 3, 1.3, c));
      g.e(23, 50.2, 2.8, 2.1, d);
      // near horn, a great ridged crescent
      const horn = g.tube([18, 16, 23, 6.5, 34, 3.5, 44, 8.5, 47.5, 17.5], 4, 1.4, c, { mat: 'stone' });
      g.on(horn, () => {
        for (let t = -168; t <= -6; t += 18) { const r = t * Math.PI / 180, cx = 33, cy = 18.5; g.l(cx + Math.cos(r) * 10, cy + Math.sin(r) * 10, cx + Math.cos(r) * 19, cy + Math.sin(r) * 19, .5, dk(c, .32)); }
        g.e(36.5, 3.4, 3, 1.3, f);
      });
      // head, lowered to charge
      K2.ear(g, 26, 21.5, 72, 8.5, 2.8, a, '#e8a898');
      const head = g.e(18.5, 23, 8.4, 7.4, a, { mat: 'fur' });
      const snout = g.p([13, 21.5, 7.5, 26.5, 5.5, 30.5, 8, 33, 13.5, 32.2, 18, 29], a);
      if (!g.back) g.on([head, snout], () => g.e(9, 31, 5, 2.6, b));
      // beard
      g.p([8.4, 32.4, 14.2, 32, 13.6, 36.6, 11.4, 41, 10.2, 36.4], e);
      // stone boss across the brow
      const boss = g.p([10.5, 19.5, 14.5, 14.5, 22, 13.5, 27, 17, 23.5, 20.6, 14, 21.6], c, { mat: 'stone' });
      g.on(boss, () => { g.l(16, 15, 18, 18, .4, dk(c, .4)); g.l(18, 18, 16.6, 21, .4, dk(c, .4)); g.l(18, 18, 21.5, 18.6, .4, dk(c, .4)); });
      g.eye(15.6, 24.4, 2.6, 'angry', { iris: h, lid: dk(c, .15), side: -1 });
      g.eye(22.6, 23.8, 2.2, 'angry', { iris: h, lid: dk(c, .15), side: 1 });
      g.nose(7.3, 29.6, 'nostrils', { s: .9 });
      g.mo('frown', 10.6, 32.6, 3.4);
    }
  });

  // ---------- Eaglet line: moorland eagles ----------
  BEAST('eaglet', {
    pal: { a: '#b4824a', b: '#efe2c6', c: '#5e4026', d: '#f4c22e', e: '#fffaf0', f: '#3a2a20' }, keep: ['b', 'd', 'e'], sh: 190,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // stubby tail and far wing, held out to look big
      K2.ear(g, 42, 52, 118, 9, 3.2, c);
      plume(g, 25, 44, [-118, -96, -74], [8, 9.5, 8.5], 1.6, 2.2, mix(a, '#2a1830', .32));
      // feet far too big for it
      g.l(28.5, 54, 27.5, 59, 1.5, dk(d, .12)); g.l(37.5, 54, 38.5, 59, 1.5, dk(d, .12));
      g.e(26, 59.8, 4.2, 1.7, d); g.e(38.6, 59.8, 4.2, 1.7, d);
      K2.claws(g, 24.6, 60.2, 3, 4.6, 1.6, -1, f); K2.claws(g, 37.2, 60.2, 3, 4.6, 1.6, -1, f);
      // downy body
      const body = g.fur(33, 45.5, 11.5, 11, e, { n: 15, amp: .15, mat: 'fur', dk: b });
      K2.spots(g, body, [[29, 48, 1.1], [33.5, 51, 1.1], [27, 52.5, 1], [31.5, 44.5, 1]], mix(b, a, .45));
      // near wing
      plume(g, 40, 42, [112, 90, 68, 46], [9, 11.5, 12.5, 11], 1.8, 2.5, a);
      g.fur(40, 42.5, 4.4, 3.8, e, { n: 7, amp: .25, mat: 'fur', dk: b, line: false });
      // head with a little crown of down
      for (const [x, y, ang] of [[25.5, 22.5, -24], [30, 21, 0], [34.5, 22.5, 24]]) K2.ear(g, x, y, ang, 7, 2.1, e, null, a);
      const head = g.fur(29.5, 30, 10.2, 9.4, e, { n: 13, amp: .14, mat: 'fur', dk: b });
      if (!g.back) g.on(head, () => { g.e(24, 26.4, 5, 2.6, a); g.e(34, 26, 4.4, 2.4, a); });
      // oversized hooked beak
      g.p([20.5, 33.6, 16, 34.6, 15.4, 36.6, 20.5, 36.4], dk(d, .22));
      const beak = g.p([21, 29, 14.5, 29.6, 11.6, 32.6, 12.6, 37, 15.4, 34.4, 21, 34.2], d, { gloss: true });
      g.on(beak, () => g.e(12, 36, 2.2, 2.2, mix(d, f, .55)));
      g.eye(24.4, 28.6, 3.2, 'round', { iris: '#f08a10', side: -1, brow: 1, browCol: f, look: -.5 });
      g.eye(33.8, 28.2, 2.8, 'round', { iris: '#f08a10', side: 1, brow: 1, browCol: f, look: -.5 });
    }
  });

  BEAST('aquilord', {
    pal: { a: '#6e4a2a', b: '#dcae56', c: '#33231a', d: '#f4c430', e: '#fbf3e2', f: '#96693a' }, keep: ['d', 'e'], sh: 190,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, '#1a1030', .34), farc = mix(c, '#140a22', .2);
      // far wing, raised high: flight feathers then coverts
      plume(g, 36, 26, [-4, 8, 20, 32, 44, 56], [17, 20.5, 22, 22.5, 21, 18], 1.6, 2.5, farc);
      plume(g, 36, 26, [4, 20, 36, 52], [11, 13, 13, 11.5], 1.8, 2.6, far);
      // tail fan with a pale band
      const tail = g.p([36, 46, 41, 60.5, 46, 58.5, 50, 60, 53.5, 56.5, 47, 44], c);
      g.on(tail, () => g.l(39, 54.5, 52, 52, 1.3, e));
      // standing leg
      g.l(38.5, 52, 37.5, 58, 1.8, dk(d, .12));
      g.e(36.4, 59.6, 4.6, 1.8, d); K2.claws(g, 34.8, 60, 3, 5, 2, -1, c);
      // body with scalloped breast feathers
      const body = g.e(33.5, 37.5, 10.6, 13, a, { mat: 'fur' });
      g.on(body, () => { for (const [x, y] of [[26.5, 33.5], [31.5, 34.5], [28.5, 38.5], [33.5, 39.5], [26, 43], [31, 44], [36, 44.5]]) g.tube([x - 2.2, y - 1.2, x, y + 1, x + 2.2, y - 1.2], .5, .5, mix(a, b, .55)); });
      // near wing swept back like a cloak
      plume(g, 41, 29, [168, 156, 144, 132, 120, 108], [16, 20, 23, 24, 21, 19], 1.7, 2.6, c);
      plume(g, 41, 29, [160, 144, 128, 112], [10.5, 13, 13.5, 12.5], 1.9, 2.8, a);
      g.fur(40.5, 29.5, 6, 5, f, { n: 8, amp: .26, a0: -10, a1: 200, mat: 'fur' });
      // feathered trousers
      g.fur(38.5, 48.5, 5.2, 5.6, a, { n: 7, amp: .28, a0: 10, a1: 190, mat: 'fur' });
      // raised talon, clenched to strike
      g.fur(28.5, 47, 5, 5.2, a, { n: 7, amp: .28, a0: 30, a1: 210, mat: 'fur' });
      g.tube([27, 49.5, 22, 51, 17.5, 49], 1.9, 1.7, dk(d, .12));
      g.e(15, 48, 3.6, 3.2, d); K2.claws(g, 13.4, 50, 3, 4.4, 2.6, -1, c);
      // golden hackles
      K2.ruff(g, 29.5, 24.5, 8.8, 6.6, b, 11, .3, -20, 220);
      // crest crown, head
      for (const [x, y, ang, len] of [[27, 10, 30, 8], [29.5, 12, 52, 9], [30, 15, 76, 8]]) K2.ear(g, x, y, ang, len, 2.2, e, null, c);
      const head = g.e(24.5, 16, 8, 7, b, { mat: 'fur' });
      if (!g.back) g.on(head, () => g.e(21, 20.5, 6, 3, lt(b, .35)));
      g.p([19, 20.4, 13.6, 21.4, 13, 23.6, 19.5, 23.4], dk(d, .22));
      const beak = g.p([19.5, 14.6, 12, 15.4, 8.4, 19.4, 9.4, 24.4, 12.4, 21, 19.5, 21], d, { gloss: true });
      g.on(beak, () => g.e(8.4, 22.6, 3, 3, mix(d, c, .65)));
      g.eye(21.6, 15.8, 3.3, 'sharp', { iris: '#ffd630', side: -1, brow: 1, browCol: a });
      g.eye(28.5, 15.4, 2.6, 'sharp', { iris: '#ffd630', side: 1, brow: 1, browCol: a });
    }
  });

  // ---------- Martip line: pine martens of the night canopy ----------
  BEAST('martip', {
    pal: { a: '#7c4a2c', b: '#fbe2a6', c: '#36221c', d: '#f4a890', e: '#a8dcd4' }, keep: ['b', 'd', 'e'], sh: -50,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      // bushy tail held high, dark at the tip
      const tail = g.tube([46, 50, 54, 46, 56.5, 36, 53, 27], 3.6, 5.8, a, { mat: 'fur' });
      g.on(tail, () => g.e(52.5, 24.5, 8, 6.6, c));
      // far hind foot
      g.e(41.5, 59, 4, 2, mix(c, '#100818', .2));
      // the pinched egg, with a paw resting on it
      const egg = g.e(15.5, 56, 4, 5, e, { gloss: true });
      K2.spots(g, egg, [[14, 54.5, .7], [17, 57, .8], [15, 58.6, .6], [17.4, 53.6, .5]], '#8a6a4a');
      g.tube([23.5, 47, 20.5, 50.5, 18, 51.8], 2.3, 1.9, mix(a, c, .55));
      g.e(17.2, 52, 2.5, 1.9, c);
      // arched body
      const body = g.tube([27, 45.5, 36, 39, 45, 46], 7, 7.5, a, { mat: 'fur' });
      g.on(body, () => g.e(25.5, 49.5, 6, 6.5, b));
      g.e(45, 50, 6.6, 7, a, { mat: 'fur', line: false });
      g.e(42.6, 59.5, 4.8, 2.2, c);
      // near foreleg with a dark glove
      const fl = g.tube([29.5, 48, 29, 54, 28, 58.5], 2.8, 2.3, a);
      g.on(fl, () => g.e(28, 58.5, 4, 3.4, c));
      g.e(27.2, 59.7, 3.6, 1.9, c);
      // cream-rimmed ears and head
      g.on([g.c(28.6, 29.6, 3.7, b)], () => g.c(28.9, 30.2, 2.2, d));
      g.on([g.c(13.8, 30.6, 3.9, b)], () => g.c(14.1, 31.3, 2.4, d));
      const head = g.e(21, 37.5, 9.2, 7.8, a, { mat: 'fur' });
      const snout = g.p([15, 36, 9.5, 39.4, 7.8, 41.6, 9.2, 43.8, 15, 44.6, 19.5, 43.6], a);
      if (!g.back) g.on([head, snout], () => g.e(13.5, 43.4, 6.8, 3, b));
      g.fur(25.4, 42, 5.2, 3.6, a, { n: 6, amp: .3, a0: 20, a1: 160, mat: 'fur', line: false });
      g.eye(17.8, 36.8, 3, 'star', { iris: '#c8801c', side: -1, look: .8, brow: -1, browCol: c });
      g.eye(25.8, 36.2, 2.6, 'star', { iris: '#c8801c', side: 1, look: .8, brow: -1, browCol: c });
      g.nose(8.8, 41, 'tri', { s: .95 });
      g.mo('o', 12, 43.9, 2.2);
      g.blush(19.4, 41.8, 1.4);
    }
  });

  BEAST('nightmarten', {
    pal: { a: '#583220', b: '#f6d78c', c: '#241e40', e: '#d2ea48', f: '#7464b8', h: '#7a5c42' }, keep: ['b', 'h'], sh: -50,
    draw(g) {
      const { a, b, c, e, f, h } = g.P;
      const far = mix(a, '#120a20', .4);
      // the bough it stalks along
      g.tube([2.8, 58.6, 30, 60, 61, 57.6], 2.1, 2.3, h, { mat: 'stone' });
      if (!g.small) { K.leaf(g, 10, 57.5, -48, 8, 2.8, '#5a9a64', '#2f5a3c'); K.leaf(g, 13, 60, -110, 6, 2.2, '#4a8656', '#2f5a3c'); }
      // tail: a plume of night sky arching over its back
      g.tube([50, 36, 55.5, 32, 56.5, 24], 3.6, 5, a, { mat: 'fur' });
      g.tube([56.5, 25, 55, 15.5, 47, 10, 37, 11.5], 5, 4, c, { mat: 'fur', lt: f });
      g.fur(36, 12, 4.4, 3.8, c, { n: 7, amp: .35, a0: 80, a1: 280, mat: 'fur', lt: f, line: false });
      if (!g.small) for (const [x, y, r] of [[55.5, 20, .8], [52.5, 13.5, .6], [46.5, 11.5, .8], [40.5, 12.6, .6], [57.5, 15, .5]]) g.dot(x, y, r, '#fff4b8');
      // far legs
      g.tube([43, 42, 41, 49, 39.5, 55], 2.8, 2.1, far); g.e(38.6, 56.2, 3.2, 1.7, c);
      g.tube([30.5, 42, 31, 49, 30, 55], 2.6, 2, far); g.e(29, 56.3, 3.2, 1.7, c);
      // long low body
      const body = g.tube([47, 37, 37, 35.5, 27, 38.5], 7.2, 6.6, a, { mat: 'fur' });
      const haunch = g.e(46.5, 40, 7.4, 8, a, { mat: 'fur', line: false });
      g.on([body, haunch], () => { g.tube([24, 33, 37, 29.5, 54, 32.5], 2.4, 3.4, c); });
      // near hind leg, still trailing a gamekeeper's broken snare
      const hl = g.tube([47.5, 45, 50.5, 50.5, 46.5, 55], 3.2, 2.3, a);
      g.on(hl, () => g.e(46.6, 55.5, 4, 2.4, c));
      g.e(45.6, 56.3, 3.6, 1.9, c);
      if (!g.small) { g.on(hl, () => g.e(49.2, 52, 3.2, .8, '#e2d2a4')); g.tube([51, 52.2, 54.5, 53.8, 57, 52, 59.5, 53.6], .55, .45, '#e2d2a4'); }
      // neck, raised forepaw
      const neck = g.tube([29, 37, 23, 36, 19, 35.5], 6, 5.6, a, { mat: 'fur', line: false });
      g.on([body, neck], () => g.e(23.5, 42.5, 6.5, 4.4, b));
      const fl = g.tube([27.5, 42, 24.5, 47.5, 19.5, 49], 2.9, 2.2, a);
      g.on(fl, () => g.e(18.5, 49, 3.6, 3, c));
      g.e(17.4, 49.3, 3, 2.2, c); K2.claws(g, 15.6, 50.6, 3, 2.6, 1.5, -1);
      // ears and head
      g.on([g.c(22.8, 27.4, 3.7, b)], () => g.c(23, 28, 2.3, mix(a, c, .6)));
      g.on([g.c(11.8, 28, 4, b)], () => g.c(12, 28.7, 2.6, mix(a, c, .6)));
      const head = g.e(16, 34.5, 8.6, 7.2, a, { mat: 'fur' });
      const snout = g.p([12, 32, 6, 35, 3.6, 37.4, 4.8, 39.8, 11, 40.8, 16, 39.6], a);
      if (!g.back) g.on([head, snout], () => { g.e(9, 39.6, 7.5, 3, b); g.e(18, 40.8, 5, 2.4, b); g.p([7.5, 34.6, 12, 30.6, 22, 30, 25, 33.4, 21, 36, 10, 36.6], mix(a, c, .72)); });
      g.fur(21, 38.6, 4.6, 3.6, a, { n: 5, amp: .3, a0: 10, a1: 150, mat: 'fur', line: false });
      g.eye(12.9, 33.7, 3.4, 'glowcool', { sc: e, iris: e, side: -1 });
      g.eye(20, 33.1, 2.8, 'glowcool', { sc: e, iris: e, side: 1 });
      g.nose(4.6, 37.2, 'button', { s: .9 });
      g.mo('fang', 8.4, 40.4, 3.6);
    }
  });

  // ---------- Grimpup line: the black dogs of the crossroads ----------
  BEAST('grimpup', {
    pal: { a: '#34343f', b: '#62627a', c: '#ff9230', d: '#b04a3a', e: '#8e8ea4', f: '#ffd45a' }, keep: ['e'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      // wagging tail with a pale tip
      g.tube([42, 54, 49.5, 50.5, 54, 43.5], 2.6, 3.1, a, { mat: 'fur' });
      const tip = g.fur(55, 40.5, 3.4, 4.2, a, { n: 5, amp: .22, a0: -200, a1: 20, mat: 'fur', line: false });
      g.on(tip, () => g.e(55.6, 37.6, 3.6, 2.6, b));
      // shaggy sitting body
      g.fur(35.5, 48, 10.2, 11, a, { n: 12, amp: .2, a0: -30, a1: 200, mat: 'fur' });
      g.e(41.5, 54, 6.4, 6, a, { mat: 'fur', line: false });
      g.e(38.5, 59.6, 4.8, 2.2, b);
      // front legs and grey paws
      g.l(33.5, 50, 34, 58.4, 2.9, mix(a, '#0c0814', .25)); g.e(33.4, 59.7, 3.7, 2, mix(b, a, .4));
      g.l(27, 48, 26.6, 58.2, 3, a); g.e(25.8, 59.6, 3.9, 2.2, b);
      K2.toes(g, 25.4, 60.6, 3, 3.4, a);
      // chest tuft, collar and the little lantern it carries for walkers
      g.fur(28.5, 46.5, 5.4, 6, b, { n: 7, amp: .3, a0: 20, a1: 170, mat: 'fur' });
      g.tube([19.5, 41, 24, 44, 32, 44], 1.4, 1.4, d);
      g.l(23, 44.6, 23, 46, .5, e);
      g.p([20.4, 47, 23, 44.8, 25.6, 47], e, { mat: 'metal' });
      g.p([20.8, 47, 25.2, 47, 25.6, 51.6, 20.4, 51.6], f, { mat: 'glow' });
      g.e(23, 49.4, 1.1, 1.5, '#fff8d0', { ring: false, shade: false });
      g.l(20.4, 52, 25.6, 52, .6, e);
      // ears: one pricked, one flopped
      K2.ear(g, 35, 24.5, 26, 11, 3.8, a, b);
      // shaggy head
      const head = g.fur(26.5, 32, 12, 10.6, a, { n: 14, amp: .18, mat: 'fur' });
      void head;
      if (!g.back) g.e(19.4, 37, 6.4, 4.6, b);
      K2.ear(g, 17.4, 23.6, -158, 11, 3.7, mix(a, '#0c0814', .2), null, b);
      g.fur(26.5, 23.2, 5.2, 3.2, b, { n: 6, amp: .4, a0: -175, a1: -5, mat: 'fur' });
      g.eye(23.4, 31.2, 3.3, 'round', { iris: c, side: -1, look: -.4 });
      g.eye(32.6, 30.6, 2.9, 'round', { iris: c, side: 1, look: -.4 });
      if (!g.back && !g.small) { g.l(20.4, 27.4, 24.6, 26, .7, e, { ring: false }); g.l(31, 25.4, 35, 26.6, .7, e, { ring: false }); }
      if (g.tiny && !g.back) { g.dot(23.4, 31.2, 2.4, c); g.dot(32.6, 30.6, 2.1, c); }
      g.nose(15, 34.8, 'button', { s: 1.3 });
      g.mo('tongue', 19, 39.6, 4.4);
    }
  });

  BEAST('barghest', {
    pal: { a: '#2a2a36', b: '#50506a', c: '#ff5a2a', d: '#a4dccc', e: '#a8a8ba', f: '#ffd24a' }, keep: ['e'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, '#08060e', .35);
      // smoke tail
      g.tube([54, 30, 59.5, 25.5, 59, 17.5], 3, 1.7, a, { mat: 'fur' });
      g.tube([59, 18, 57.5, 13, 59.5, 8.5], 1.6, .8, d, { mat: 'glow' });
      // moor mist behind
      g.e(55.5, 55, 6, 3.6, dk(d, .2), { mat: 'glow' });
      // far legs
      g.tube([33.5, 40, 35.5, 50, 34.5, 57.5], 3.6, 2.8, far); g.e(33.6, 59.3, 4.2, 2.1, mix(b, far, .5));
      g.tube([50, 38, 54.5, 46, 53.5, 53], 3.6, 2.6, far);
      // hackles along the spine, then the deep-chested body
      K2.zig(g, 56, 30, 35, 24, 5, 3.6, b);
      g.tube([48.5, 35, 38, 33.5, 28.5, 30.5], 8.6, 11.2, a, { mat: 'fur' });
      g.fur(37, 41.5, 9, 4, a, { n: 8, amp: .3, a0: 10, a1: 170, mat: 'fur', line: false });
      // haunch and near hind leg, fading into mist
      g.e(49, 37.5, 7.4, 8, a, { mat: 'fur', line: false });
      g.tube([50, 42, 55, 48.5, 52.5, 54.5], 3.8, 2.8, a);
      g.group(() => { g.e(51.5, 58, 8.5, 3.3, d, { mat: 'glow' }); g.e(58.6, 56.2, 3.2, 2.6, d, { mat: 'glow' }); g.e(44, 59.4, 4.6, 2.1, d, { mat: 'glow' }); });
      g.tube([47, 55.5, 45.6, 52, 46.8, 49], 1.3, .6, d, { mat: 'glow' });
      // near foreleg
      g.tube([26.5, 38, 25.5, 49, 25, 57.5], 4.4, 3.3, a);
      g.e(24, 59.4, 5, 2.5, b); K2.claws(g, 22, 60.2, 3, 5, 1.6, -1, e);
      // shaggy mane
      K2.ruff(g, 28, 27.5, 9.6, 10.6, b, 13, .3, -40, 250, { lt: e });
      g.fur(25.5, 33, 6, 6.4, a, { n: 7, amp: .3, a0: 20, a1: 190, mat: 'fur' });
      // iron collar and broken chain
      g.tube([19.5, 26, 23.5, 30.5, 30, 31.5], 1.5, 1.5, e, { mat: 'metal' });
      if (!g.small) for (const [x, y] of [[21.4, 33.4], [20.8, 36.6], [21.6, 39.8], [23, 42.6]]) { g.e(x, y, 1.5, 1.9, e, { mat: 'metal' }); g.dot(x, y, .6, a); }
      // ears and head held high
      K2.ear(g, 25.5, 10.5, 24, 10, 3.4, far);
      K2.ear(g, 17, 10, -8, 10.5, 3.6, a, b);
      const head = g.e(19, 17.5, 9, 7.8, a, { mat: 'fur' });
      const snout = g.p([14.5, 13.5, 6.5, 14, 3.4, 17, 3.6, 20, 6, 23.4, 14, 24.5, 19, 22], a);
      if (!g.back) g.on([head, snout], () => g.e(8.5, 21.5, 7, 3.4, b));
      g.fur(23.5, 21.5, 5, 4.4, a, { n: 6, amp: .32, a0: 10, a1: 150, mat: 'fur', line: false });
      // eyes like live coals
      if (!g.back) { K2.flame(g, 17.6, 12.4, 4.6, 1.9, 38, c, f, null); K2.flame(g, 24.4, 12.2, 3.8, 1.6, 38, c, f, null); }
      g.eye(15.2, 16.4, 2.8, 'glow', { iris: c, side: -1 });
      g.eye(22.4, 15.8, 2.3, 'glow', { iris: c, side: 1 });
      g.nose(4.4, 17.2, 'tri', { s: 1.2 });
      g.mo('roar', 9.8, 21.4, 7.4, { h: 3.8 });
    }
  });
})();