// ---- art/b8b ----
// ===== Batch 8b: the three dragon families =====
// salamber > salamandrake (four-legged fire salamander-drake), lindlet > lindwyrm (serpentine lake lindworm),
// drakling > wyvernette > pendrake (two-legged winged heraldic wyvern-dragon)
(() => {
  const SHADE = '#1a1030', EMBER = '#4a1410';

  // ---------- SALAMBER: a hearth newt with flame gills and an ember-curl tail ----------
  BEAST('salamber', {
    pal: { a: '#f0812e', b: '#fff0c8', c: '#3a2a2e', d: '#ffd23e', e: '#ff5a1e', f: '#b8481c' }, keep: ['b', 'c'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, EMBER, .36);
      // spiral tail, curled like a fern frond round a glowing coal
      const tail = g.tube([41, 53, 50, 57, 58, 52.5, 59, 43, 53, 36.5, 46.5, 40, 48.5, 46], 4.8, 2, a, { mat: 'gloss' });
      if (!g.tiny) K2.spots(g, tail, [[54, 54.6, 2.2, 1.7], [59.4, 46, 1.7, 2.3], [55, 37.6, 2, 1.5]], c);
      g.c(49.4, 45.4, 2.7, d, { mat: 'glow' });
      g.dot(49.4, 45.4, 1.1, '#fff6c8');
      // far front leg
      g.tube([20, 50, 18.6, 56.6], 2.6, 2.3, far); g.e(17, 59.7, 3.5, 1.8, far);
      // plump body, propped up at the front
      let body, chest;
      g.group(() => { body = g.re(36, 51, 11.6, 7.6, -10, a, { mat: 'gloss' }); chest = g.e(27.6, 47.6, 8, 8.6, a, { mat: 'gloss' }); });
      if (!g.back) g.on([body, chest], () => g.e(26, 55.6, 13, 4.2, b));
      K2.spots(g, [body, chest], g.tiny ? [[39, 46.4, 3.2, 2.6]] : [[38.5, 45.6, 3, 2.1], [44.6, 49.6, 2.2, 1.8], [33, 49.6, 1.5, 1.2]], c);
      if (g.back) K2.spots(g, [body, chest], [[28, 50, 2.4, 1.8], [37, 54, 2, 1.5]], c);
      // near legs: short and splayed
      g.tube([44.6, 54, 47.6, 57, 48, 58.8], 3, 2.5, a); g.e(49, 59.9, 3.9, 1.8, a);
      g.tube([30, 50.6, 29.6, 56, 28.6, 58.8], 3, 2.5, a); g.e(27, 59.9, 3.9, 1.8, a);
      K2.toes(g, 26.6, 60.8, 3, 3.8, f); K2.toes(g, 48.6, 60.8, 3, 3.8, f);
      // flame gills fanning from behind the cheeks
      K2.flame(g, 32, 27, 9.5, 3, 34, e, d, null);
      K2.flame(g, 34.6, 33, 9, 2.9, 68, e, d, null);
      K2.flame(g, 33.6, 39.4, 7.4, 2.6, 102, e, d, null);
      K2.flame(g, 8, 29.6, 6, 2.3, -40, mix(e, EMBER, .2), d, null);
      // broad flat head with raised eye bumps
      let head, b0, b1;
      g.group(() => {
        b1 = g.c(26.6, 29.8, 4.7, a, { mat: 'gloss' });
        b0 = g.c(13.2, 30.8, 5, a, { mat: 'gloss' });
        head = g.e(19.6, 38.4, 13.2, 9.4, a, { mat: 'gloss' });
      });
      if (!g.back) g.on(head, () => g.e(16.6, 46.4, 12.6, 5, b));
      K2.spots(g, [head, b0, b1], [[20.2, 31, 2.3, 1.7], [30, 37, 1.7, 2.1]], c);
      if (g.back) K2.spots(g, [head, b0, b1], [[17, 39, 2.6, 2], [25, 42, 2, 1.5]], c);
      if (!g.back) g.tube([8, 40.8, 13, 43.4, 20, 42.6, 23.2, 40.8], .42, .42, dk(f, .45), { ring: false, shade: false });
      g.eye(13.4, 31.8, 3.5, 'cute', { iris: '#ff9a1e', side: -1 });
      g.eye(26.4, 30.8, 3.2, 'cute', { iris: '#ff9a1e', side: 1 });
      g.nose(9.4, 37.6, 'nostrils', { s: .85 });
      g.blush(25.4, 39.8, 1.6);
    }
  });

  // ---------- SALAMANDRAKE: a heavy four-legged fire drake wading through a bonfire ----------
  BEAST('salamandrake', {
    pal: { a: '#e2621e', b: '#ffd98e', c: '#33221f', d: '#ffd23e', e: '#ff4a1a', f: '#a83c14', h: '#f6ead2' }, keep: ['b', 'c', 'h'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, EMBER, .4), W = '#fff6c8';
      // bonfire glowing behind the legs
      if (!g.small) { K2.flame(g, 37, 56.5, 13, 5.5, 4, e, d, null); K2.flame(g, 58, 57.5, 9, 3.6, 10, e, d, null); }
      // tail arched over the back, its sooty tip burning like a wick
      const tail = g.tube([47, 42, 55, 46, 59.5, 38, 56, 28, 49.5, 24], 5.6, 2.3, a);
      K2.spots(g, tail, [[56.5, 44.5, 2.6, 2], [59.5, 35.5, 1.8, 2.6]], c);
      g.on(tail, () => g.c(50, 24, 4.2, c));
      K2.flame(g, 47.5, 19.5, 13, 5, -16, e, d, W, { licks: 4 });
      // flame crest along the spine
      for (const [x, y, hh, ang] of [[30.5, 30, 9, 14], [36.5, 29.6, 10.5, 20], [42.5, 31.6, 9, 26]]) K2.flame(g, x, y, hh, 3, ang, e, d, null);
      // far legs, soot-black to the knee
      const ffl = g.tube([25, 44, 19, 49, 13.5, 51.5], 3.6, 2.8, far);
      g.on(ffl, () => g.c(13, 51.6, 4.4, c)); K2.claws(g, 10.8, 52.2, 3, 3.6, 2.6, -1, h);
      const fhl = g.tube([43, 46, 46.5, 53, 45, 59], 3.6, 2.8, far);
      g.on(fhl, () => g.e(45.5, 57.5, 5, 3.6, c)); g.e(43.5, 59.6, 4.2, 2, mix(c, SHADE, .3));
      // barrel body
      let body, sh, hip;
      g.group(() => {
        body = g.re(38, 41, 14.5, 9, -5, a);
        sh = g.e(28, 40.5, 9, 10, a);
        hip = g.e(48.5, 43, 7.5, 8.2, a);
      });
      if (!g.back) g.on([body, sh], () => {
        g.e(33, 50.5, 14, 4, b);
        for (let i = 0; i < 5; i++) g.l(25 + i * 4, 47.5, 26 + i * 4, 52, .4, mix(b, f, .5), { shade: false });
      });
      K2.spots(g, [body, sh, hip], g.tiny ? [[33, 36.5, 3.4, 2.6], [45, 39, 3, 2.6]] : [[33, 36, 3.2, 2.3], [41, 37.5, 2.6, 2], [47.5, 40, 2.2, 2.6], [37, 42.5, 1.7, 1.4]], c);
      if (g.back) K2.spots(g, [body, sh, hip], [[30, 44, 2.6, 2], [42, 46, 2.4, 1.8]], c);
      // near legs with sooty socks
      const hl = g.tube([49.5, 46, 53, 53, 51, 58.5], 4.4, 3.3, a);
      const fl = g.tube([28.5, 45, 28, 52, 26, 58.5], 4.4, 3.4, a);
      g.on([hl, fl], () => { g.e(51.5, 58, 6, 4.2, c); g.e(26.6, 58, 6, 4.2, c); });
      if (!g.small) K2.spots(g, [hl, fl], [[52.6, 50, 1.6, 1.4], [28.6, 49.6, 1.6, 1.4]], c);
      g.e(49.5, 59.6, 5, 2.2, c); K2.claws(g, 46.6, 60, 3, 4, 2, -1, h);
      g.e(24.5, 59.6, 5, 2.2, c); K2.claws(g, 21.6, 60, 3, 4, 2, -1, h);
      // neck
      const neck = g.tube([28, 37, 23, 29, 19.5, 22], 6.8, 5.6, a);
      if (!g.back) g.on(neck, () => g.tube([22.5, 40, 17.5, 31, 14, 25], 3.2, 2.6, b));
      // horns and flame gills
      g.tube([24, 12.5, 29.5, 8.5, 35, 9.5], 2.1, .6, d, { gloss: true });
      g.tube([20, 11.5, 23.5, 5.5, 28, 3.5], 1.9, .6, mix(d, f, .3), { gloss: true });
      K2.flame(g, 26, 18.6, 7.4, 2.6, 76, e, d, null);
      K2.flame(g, 25, 23.4, 6.2, 2.3, 110, e, d, null);
      // head
      const head = g.e(18, 17.5, 9.6, 7.8, a);
      const snout = g.p([13, 11, 6.5, 14, 2.6, 18, 2.6, 22.6, 5.6, 25.4, 14, 26, 20.6, 24], a);
      if (!g.back) {
        g.on([head, snout], () => {
          g.e(10, 26, 9, 3, b); g.e(20.6, 25.4, 5, 2.4, b);
          // sooty mask running back from the snout through the eyes
          g.p([6, 18.6, 11, 14.2, 19, 11.6, 27.6, 11.6, 27.6, 16.8, 20, 19.4, 12, 20.4, 6.6, 20.2], c);
        });
        g.tube([3.4, 22, 9, 23.2, 16, 22.8, 20.8, 20.8], .4, .4, dk(f, .5), { ring: false, shade: false });
        g.p([5.4, 22.8, 7.6, 23.2, 6.4, 19.9], h); g.p([11, 23.4, 13.2, 23.4, 12.2, 20.3], h);
      } else K2.spots(g, [head, snout], [[19, 16, 3, 2.2]], c);
      g.eye(14.6, 16.8, 2.9, 'sharp', { iris: '#ffd23e', slit: true, side: -1 });
      g.eye(22, 15.8, 2.3, 'sharp', { iris: '#ffd23e', slit: true, side: 1 });
      g.nose(4.4, 18.2, 'nostrils', { s: .9 });
      // flames licking round the feet
      if (!g.small) {
        K2.flame(g, 11.5, 57.8, 7.5, 3.2, -8, e, d, W);
        K2.flame(g, 38, 58.4, 6, 2.8, 6, e, d, W);
        K2.flame(g, 59, 58.4, 5, 2.4, 10, e, d, null);
      }
    }
  });

  // ---------- LINDLET: a paddling lake serpentling with two stubby webbed legs ----------
  BEAST('lindlet', {
    pal: { a: '#3aa08e', b: '#eefadc', c: '#1e5e54', d: '#96e6c6', e: '#f2d060', f: '#c8f2ff' }, keep: ['b', 'e', 'f'], sh: 110,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, SHADE, .3);
      // two-lobed tail fluke
      const fluke = g.p([49.5, 39, 41.5, 36, 40, 28.5, 45.5, 32, 50.5, 26, 52.5, 34], d, { gloss: true });
      g.on(fluke, () => { g.l(49, 37, 42, 31.5, .35, c); g.l(49.5, 36.5, 50, 29.5, .35, c); });
      // back fins
      K2.zig(g, 47, 49.5, 32, 50.5, 3, 4.6, d);
      // far leg
      g.tube([22, 51, 19.5, 56.5], 2.4, 2.1, far); g.e(17.6, 59.2, 3.6, 1.7, mix(d, SHADE, .3));
      // body: neck down into a looping tail
      const body = g.tube([22, 34, 23, 43, 27.5, 51.5, 38, 55.5, 49, 53.5, 54.5, 46, 51, 39.5], 6.4, 2.3, a, { mat: 'gloss' });
      if (!g.back) g.on(body, () => {
        g.tube([17, 36, 18, 45, 23.5, 55.5, 37, 60.5, 50, 58], 3.4, 2.2, b);
        for (const [x1, y1, x2, y2] of [[17, 42, 20.4, 41.6], [18.4, 47, 21.6, 46], [21, 51.6, 24, 49.6], [29.4, 60, 30.4, 57], [35.6, 61, 36, 58], [41.6, 61, 41.4, 58]]) g.l(x1, y1, x2, y2, .35, mix(b, c, .4), { shade: false });
      });
      K2.spots(g, body, [[28.5, 45, 1.8], [35, 52, 1.9, 1.5], [43.5, 51.5, 1.7, 1.4], [51.5, 48, 1.3]], c);
      // near leg with a webbed foot
      g.tube([28, 53, 27.5, 57.5], 2.6, 2.3, a);
      const foot = g.p([29.5, 58, 31, 60.8, 21.6, 61, 23.2, 59.4, 21.4, 58.4, 26, 57.4], d);
      g.on(foot, () => { g.l(26.5, 58.2, 23, 60.4, .35, c); g.l(28, 58.4, 26.6, 60.8, .35, c); });
      // head fins
      g.p([11, 23, 5.6, 16.5, 10, 17.6, 12, 12.6, 17, 19], mix(d, SHADE, .22));
      const fin = g.p([27, 22, 30, 12, 33.4, 17.6, 38.6, 15.4, 36, 22, 40, 25.6, 31, 28], d, { gloss: true });
      g.on(fin, () => { g.l(29, 24, 30.6, 15, .35, c); g.l(30, 25, 37, 17.6, .35, c); g.l(31, 26.4, 38, 25, .35, c); });
      // head
      let head, muz;
      g.group(() => { head = g.e(20, 28, 11.4, 9.6, a, { mat: 'gloss' }); muz = g.e(11.6, 32, 6.4, 4.8, a, { mat: 'gloss' }); });
      if (!g.back) g.on([head, muz], () => g.e(13, 36.4, 10.5, 4.4, b));
      K2.spots(g, [head], [[26.5, 21.8, 1.7, 1.3], [30, 26, 1.2]], c);
      g.p([18.6, 20.4, 20.6, 14.4, 23.4, 19.8], e, { gloss: true });
      g.eye(15.6, 26.6, 3.4, 'star', { iris: '#f0a820', side: -1, look: -.4 });
      g.eye(25.4, 26, 3.1, 'star', { iris: '#f0a820', side: 1, look: -.4 });
      g.mo('o', 8.2, 33.8, 3);
      g.blush(19.6, 33, 1.6);
      // bubbles
      if (!g.tiny) for (const [x, y, r] of [[4.6, 27, 2.5], [8.4, 20, 1.8], [4.4, 14.6, 1.3]]) { g.c(x, y, r, f, { gloss: true, oc: '#4a98b8' }); g.dot(x - r * .35, y - r * .35, r * .3, '#ffffff'); }
    }
  });

  // ---------- LINDWYRM: the great coiled lindworm of the deep lake ----------
  BEAST('lindwyrm', {
    pal: { a: '#2a8070', b: '#d6f0cc', c: '#124a42', d: '#7adcb6', e: '#f0c850', f: '#c8f2ff' }, keep: ['b', 'e', 'f'], sh: 110,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const tick = mix(b, c, .45);
      // tail rising behind, ending in a two-lobed fluke
      const fluke = g.p([53.5, 16, 45.5, 13.5, 43.5, 5, 50, 9.5, 55.5, 3, 58.5, 12], d, { gloss: true });
      g.on(fluke, () => { g.l(52.5, 14, 45, 8, .4, c); g.l(53, 13.5, 55, 6, .4, c); });
      K2.zig(g, 51.6, 21, 53, 35, 3, 4, d);
      const tail = g.tube([44, 44, 53, 42, 58, 33, 56.5, 22, 52.5, 15], 5.4, 1.7, a);
      K2.spots(g, tail, [[58.6, 36, 1.6, 2.4], [58, 27, 1.4, 2.2], [55.4, 19.4, 1.2, 1.7]], c);
      // rear coil
      const c2 = g.tube([13, 48, 25, 43.2, 41, 42.8, 52, 46, 54, 51.5], 7.2, 7.2, mix(a, SHADE, .12));
      g.on(c2, () => { for (const x of [42, 50]) g.e(x, 37.4 + (x - 42) * .25, 3, 2.6, dk(c, .25)); });
      // sail fin down the back of the neck
      const sail = g.p([24, 12.5, 31.5, 13.5, 30, 18.5, 35.5, 21.5, 32.5, 26.5, 36, 31.5, 31, 35, 26, 36], d, { gloss: true });
      g.on(sail, () => { g.l(27, 16, 31, 14, .4, c); g.l(29, 22, 35, 21.6, .4, c); g.l(29, 30, 35.4, 31.4, .4, c); });
      // neck flowing down into the front coil
      const main = g.tube([20, 17, 26, 25, 24.5, 34.5, 17.5, 43, 10.5, 50, 16, 55, 30, 55.2, 44, 54.4, 53, 51, 56.5, 45.5], 5.4, 6.3, a);
      if (!g.back) g.on(main, () => {
        g.tube([15, 19, 20.5, 26, 19.5, 34, 12.5, 42, 5.5, 51, 13, 60.5, 30, 61.2, 45, 60.4, 56, 56], 2.7, 2.7, b);
        for (const [x1, y1, x2, y2] of [[18, 23.6, 21.6, 22.2], [20, 28.6, 23.4, 28.4], [19.4, 33.8, 22.6, 35], [15.4, 39, 18.2, 41], [11, 44, 13.6, 46.2], [7.4, 49.4, 10.4, 50.6], [10.4, 57.6, 12.6, 55.4], [18.6, 61, 19.6, 57.8], [25.6, 61, 26, 58], [32.6, 61, 32.6, 58], [39.6, 61, 39.4, 58], [46.4, 60.6, 45.6, 57.6], [52, 59, 50.6, 56.2]]) g.l(x1, y1, x2, y2, .38, tick, { shade: false });
      });
      g.on(main, () => { for (const [x, y] of [[21, 50.2], [30, 50.4], [39, 50], [47.5, 48.4]]) g.e(x, y, 3.1, 2.4, dk(c, .25)); g.e(28.4, 31.6, 1.6, 2.6, dk(c, .25)); g.e(27.6, 23.4, 1.4, 2.2, dk(c, .25)); });
      // webbed claw resting on its own coils
      g.tube([27.6, 37.4, 31.6, 41], 2.8, 2.4, a);
      const hand = g.p([30, 39, 39.4, 38, 36.4, 41.6, 41.6, 44.4, 36, 45.4, 36, 50, 29.4, 44.4], d, { gloss: true });
      g.on(hand, () => { g.l(31.6, 42, 38, 39, .4, c); g.l(31.6, 42.4, 40, 44, .4, c); g.l(31.6, 43, 35.6, 48.6, .4, c); });
      K2.ear(g, 39, 38.2, 80, 3.4, 1.1, e); K2.ear(g, 41.2, 44.4, 100, 3.4, 1.1, e); K2.ear(g, 36, 49.6, 165, 3.2, 1.1, e);
      // horns, frill and head
      g.tube([22.5, 9.5, 28.5, 5, 35, 5.4], 1.8, .55, e, { gloss: true });
      g.tube([19.5, 8.6, 23, 3.6, 27.6, 2.6], 1.5, .5, mix(e, c, .25), { gloss: true });
      const frill = g.p([23, 13, 31, 9.6, 28.6, 14.6, 33, 16.6, 28, 19, 30, 23, 23.5, 20.5], d, { gloss: true });
      g.on(frill, () => { g.l(24, 15, 30, 11.4, .4, c); g.l(24.4, 16.6, 31.6, 16.8, .4, c); g.l(24.4, 18.4, 29, 21.6, .4, c); });
      const head = g.e(17.6, 14.6, 8.6, 6.6, a);
      const snout = g.p([12.6, 9.4, 6.4, 12, 2.6, 15.4, 2.6, 18.6, 5.6, 21.2, 14, 22, 19.6, 20.4], a);
      if (!g.back) g.on([head, snout], () => { g.e(9.6, 21.8, 8.6, 2.6, b); g.e(19.6, 21.8, 5, 2.1, b); });
      K2.spots(g, [head], [[21, 9.8, 2.2, 1.3]], c);
      // barbels
      g.tube([5.6, 20.6, 3, 25.6, 5, 31], .8, .45, e);
      g.tube([9.6, 21.6, 8.6, 26.4, 11, 30], .7, .4, mix(e, c, .2));
      if (!g.back) g.tube([3.6, 19.4, 8, 20.2, 14.6, 19.8], .36, .36, dk(c, .3), { ring: false, shade: false });
      g.eye(14, 13.8, 3.1, 'glowcool', { sc: '#ffe98a', side: -1 });
      g.eye(21, 13.2, 2.5, 'glowcool', { sc: '#ffe98a', side: 1 });
      g.nose(4.6, 16.4, 'nostrils', { s: .85 });
      if (!g.small) for (const [x, y, r] of [[40.6, 29, 1.8], [44.4, 23.4, 1.3]]) g.c(x, y, r, f, { gloss: true, oc: '#4a98b8' });
    }
  });

  // ---------- dragon wing: arm bone, finger bones and scalloped membrane ----------
  const dwing = (g, sx, sy, wx, wy, tips, ax, ay, bone, mem, o = {}) => {
    const pull = o.pull == null ? .2 : o.pull, rb = o.rb || 1.6;
    const pts = [sx, sy, wx, wy];
    for (let i = 0; i < tips.length; i++) {
      const [tx, ty] = tips[i], [nx, ny] = i + 1 < tips.length ? tips[i + 1] : [ax, ay];
      const mx = (tx + nx) / 2, my = (ty + ny) / 2;
      pts.push(tx, ty, mx + (wx - mx) * pull, my + (wy - my) * pull);
    }
    pts.push(ax, ay);
    const m = g.p(pts, mem);
    g.on(m, () => {
      if (o.glow) for (let i = 0; i < tips.length; i++) { const [tx, ty] = tips[i], [nx, ny] = i + 1 < tips.length ? tips[i + 1] : [ax, ay]; g.l(wx + (tx + nx - 2 * wx) * .22, wy + (ty + ny - 2 * wy) * .22, wx + (tx + nx - 2 * wx) * .37, wy + (ty + ny - 2 * wy) * .37, o.gw || 1.3, o.glow); }
      for (const [tx, ty] of tips) g.l(wx, wy, tx, ty, o.fb || .65, bone);
    });
    if (o.claw) { const ang = Math.atan2(wx - sx, -(wy - sy)) * 180 / Math.PI; K2.ear(g, wx, wy, ang + (o.ca || 0), o.cl || 4, 1.3, o.claw); }
    g.tube([sx, sy, wx, wy], rb, rb * .8, bone);
    return m;
  };
  // barbed arrow tip for a heraldic tail (ang: degrees clockwise from up)
  const barb = (g, x, y, ang, s, col) => {
    const P = (a, d) => K.pt(x, y, ang + a, d * s);
    return g.p([...P(0, 7), ...P(118, 4.4), ...P(155, 2.2), ...P(180, 3.4), ...P(205, 2.2), ...P(242, 4.4)], col);
  };

  // ---------- DRAKLING: a hiccuping baby wyvern-dragon ----------
  BEAST('drakling', {
    pal: { a: '#d6403a', b: '#fbdca6', c: '#86222c', d: '#f2c440', e: '#fff4dc', f: '#ff8a3a', h: '#dcd6e4' }, keep: ['b', 'd', 'e', 'f', 'h'], sh: 215,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, SHADE, .3), fmem = mix(c, SHADE, .3);
      // tail with a little barbed tip
      barb(g, 57.6, 43, 6, .8, c);
      g.tube([41, 54.5, 50, 57.5, 56.6, 53, 57.4, 45], 4.2, 1.7, a);
      // far winglet
      dwing(g, 37, 38, 41, 25.5, [[49, 21], [50, 28.5]], 41, 36, far, fmem, { rb: 1.3 });
      // back spikes
      for (const [x, y, ang] of [[42.6, 42.5, 62], [44, 48, 80]]) K2.ear(g, x, y, ang, 3.6, 1.5, d);
      // round body with belly plates
      const body = g.e(33.5, 49, 10.5, 10.4, a);
      if (!g.back) g.on(body, () => { g.e(28.5, 51, 6.6, 8.6, b); for (const y of [46.4, 50, 53.6]) g.l(22, y, 34, y + .6, .4, mix(b, c, .5), { shade: false }); });
      // near winglet
      if (g.back) g.on(body, () => { for (const y of [43, 47.5, 52]) g.p([27.5, y + 2, 30, y - 1.6, 32.5, y + 2], d); });
      dwing(g, 40, 41.5, 48, 30.5, [[57, 27.5], [58.4, 37], [51.4, 42.6]], 43.4, 46.6, a, c, { rb: 1.5, claw: d, cl: 3.2 });
      // feet
      g.e(38.6, 59.4, 4.6, 2.3, a); K2.claws(g, 36, 59.8, 3, 3.6, 1.6, -1, e);
      g.e(24.6, 59.5, 4.8, 2.4, a); K2.claws(g, 21.6, 59.9, 3, 3.6, 1.6, -1, e);
      // head with horn nubs
      g.p([17.6, 23.4, 18.6, 16.4, 22.6, 21.4], d, { gloss: true });
      g.p([28, 20.6, 31.4, 14.6, 33.4, 21.4], d, { gloss: true });
      let head, snout;
      g.group(() => { head = g.c(25, 31, 11.4, a); snout = g.e(15.6, 35.6, 6.8, 5, a); });
      if (!g.back) g.on([head, snout], () => g.e(16, 40.4, 9.4, 3.8, b));
      g.eye(20.4, 29.4, 3.6, 'round', { iris: '#f0b020', side: -1, look: -.4 });
      g.eye(30.2, 28.8, 3.3, 'round', { iris: '#f0b020', side: 1, look: -.4 });
      g.nose(11, 33.8, 'nostrils', { s: .85 });
      g.mo('open', 13.4, 39.2, 3.4, { h: 2.6 });
      g.blush(23, 36.6, 1.6);
      // hiccup: a puff of smoke and one spark
      if (!g.back && !g.tiny) { g.c(5.6, 31.6, 2.3, h, { mat: 'soft' }); g.c(4.6, 26, 1.8, h, { mat: 'soft' }); g.c(6.6, 21.6, 1.3, h, { mat: 'soft' }); K2.flame(g, 7.6, 38.4, 2.8, 1.4, -70, f, '#ffe680', null); }
    }
  });

  // ---------- WYVERNETTE: a gangly young wyvern, mid-leap and about to land badly ----------
  BEAST('wyvernette', {
    pal: { a: '#c63034', b: '#f6d4a2', c: '#70181e', d: '#f2c440', e: '#fff4dc', f: '#ff8a3a' }, keep: ['b', 'd', 'e'], sh: 215,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const far = mix(a, SHADE, .3), fmem = mix(c, SHADE, .32);
      // far wing, flung straight up
      dwing(g, 34, 33, 32.5, 13, [[43, 4], [49.5, 13], [46, 25]], 40, 33, far, fmem, { claw: mix(d, SHADE, .2), rb: 1.6 });
      // tail streaming behind for balance
      barb(g, 60, 42.5, 4, .85, c);
      g.tube([43, 45, 50, 53.5, 57.2, 53, 59.6, 45], 4.4, 1.7, a);
      // far leg stretched out to brace
      g.tube([32, 47, 26, 52.5, 20, 51.5], 3, 2.3, far);
      for (const ang of [-125, -95, -65]) K2.ear(g, 19, 51.4, ang, 3.6, 1, e);
      // neck spikes
      for (const [x, y, ang] of [[28.5, 28.5, 20], [33, 31, 28]]) K2.ear(g, x, y, ang, 4.4, 1.6, d);
      // body
      const body = g.re(36, 40.5, 10.6, 8.6, -22, a);
      if (!g.back) g.on(body, () => { g.re(31, 45.6, 8.6, 4.4, -22, b); for (const x of [26, 29.6, 33.2, 36.8]) g.l(x, 42, x + 2.2, 50, .4, mix(b, c, .5), { shade: false }); });
      if (g.back) g.on(body, () => { for (const [x, y] of [[29, 41], [33, 43.4], [37, 45.6]]) g.p([x - 2, y + 2.6, x + .6, y - 1.4, x + 2.6, y + 2.2], d); });
      // near leg
      g.e(40.5, 47.5, 5.6, 6.6, a);
      g.tube([40.5, 51.5, 37, 55.5, 38.6, 58.8], 2.9, 2.4, a);
      g.e(36.6, 59.8, 4.6, 2, a); K2.claws(g, 33.8, 60, 3, 3.8, 1.8, -1, e);
      // neck
      const neck = g.tube([31, 37.5, 25.5, 31.5, 21.5, 27.5], 5.2, 4.4, a);
      if (!g.back) g.on(neck, () => g.tube([27, 42.5, 21, 36, 17, 32], 2.6, 2.2, b));
      // near wing swept back
      dwing(g, 39, 34.5, 50.5, 24, [[61, 19.5], [61.6, 32.5], [54, 41.5]], 43.5, 41, a, c, { claw: d, rb: 1.9 });
      // horns and head
      g.tube([22.4, 21.4, 27.4, 17, 32.4, 17.4], 1.6, .5, d, { gloss: true });
      g.tube([19.4, 20.4, 22.4, 15, 26.6, 13.4], 1.4, .5, mix(d, c, .25), { gloss: true });
      K2.ear(g, 24.6, 27.6, 105, 4.6, 1.8, c);
      const head = g.e(17.6, 25.6, 8, 6.4, a);
      const snout = g.p([13, 20.6, 7, 23.4, 3, 27, 3.2, 30, 6.6, 31.8, 14, 31.8, 19, 30.4], a);
      if (!g.back) g.on([head, snout], () => { g.e(9.6, 31.6, 8, 2.4, b); g.e(19, 31.4, 4.4, 2, b); });
      g.eye(14.2, 24.8, 2.9, 'sharp', { iris: '#f4b020', side: -1, look: -.3 });
      g.eye(21, 24.2, 2.3, 'sharp', { iris: '#f4b020', side: 1, look: -.3 });
      g.nose(4.8, 27.4, 'nostrils', { s: .85 });
      g.mo('grin', 9.4, 30.8, 5.6, { h: 2 });
    }
  });

  // ---------- PENDRAKE: the great red dragon of the banners, rearing with wings raised ----------
  BEAST('pendrake', {
    pal: { a: '#c22428', b: '#f8d89c', c: '#5c1018', d: '#f2c848', e: '#fff4dc', f: '#ff7a30', w: '#8e3420' }, keep: ['b', 'd', 'e', 'f'], sh: 215,
    draw(g) {
      const { a, b, c, d, e, f, w } = g.P;
      const far = mix(a, SHADE, .32), fmem = mix(c, SHADE, .35), tick = mix(b, c, .45);
      // far wing
      dwing(g, 34, 27, 36.5, 4.5, [[44, 2.6], [47, 9], [44, 20]], 39, 28, far, fmem, { rb: 1.9 });
      // tail looping round to a barbed arrow tip
      barb(g, 55.4, 40.6, -48, 1, d);
      for (const [x, y, ang] of [[46.6, 51.6, 20], [53.4, 50.6, -14]]) K2.ear(g, x, y, ang, 3.6, 1.5, d);
      const tail = g.tube([37, 48, 46, 56, 55.5, 55, 59.6, 47.5, 56.4, 41.6], 5.4, 1.8, a);
      if (!g.back) g.on(tail, () => g.tube([36, 53, 46, 60.5, 56, 59.5], 2.4, 1.6, b));
      // far leg
      g.tube([30, 47, 24, 53, 22.5, 58.4], 3.8, 3, far); g.e(20.6, 59.6, 4.6, 2.1, far); K2.claws(g, 17.6, 60, 3, 4, 2, -1, e);
      // spines down the neck
      for (const [x, y, ang, len] of [[30.4, 17, 70, 4.6], [31.6, 22.6, 64, 5]]) K2.ear(g, x, y, ang, len, 1.8, d);
      // body
      let chest, hips;
      g.group(() => { chest = g.e(31, 34.5, 9, 10.4, a); hips = g.e(35.6, 44, 8.6, 8.6, a); });
      if (!g.back) g.on([chest, hips], () => {
        g.e(25.4, 40, 6.2, 13.5, b);
        for (const y of [30.6, 34.4, 38.2, 42, 45.8, 49.6]) g.l(19, y, 32, y + 1, .4, tick, { shade: false });
      });
      if (g.back) g.on([chest, hips], () => { for (const y of [30, 35, 40, 45]) g.p([24, y + 2.2, 26.6, y - 1.8, 29, y + 2.2], d); });
      // near leg
      const thigh = g.e(38.6, 46.6, 6.8, 8, a);
      if (!g.small) K2.spots(g, [thigh, tail], [[36.6, 43.4, 1, .8], [40.2, 44.6, 1, .8], [37.6, 47.2, 1, .8], [41.4, 48.2, 1, .8], [50, 54.2, 1, .8], [53.6, 52.6, 1, .8], [56.8, 49.6, 1, .8]], dk(a, .2));
      g.tube([39, 52, 42.6, 56, 39.4, 59], 3.6, 3, a);
      g.e(37, 59.8, 5.2, 2.2, a); K2.claws(g, 34, 60.2, 3, 4.4, 2, -1, e);
      // neck
      const neck = g.tube([31, 30, 26.5, 22, 26, 15, 22.6, 11], 5.6, 4.6, a);
      if (!g.back) g.on(neck, () => {
        g.tube([26, 33, 21.5, 23, 21, 16, 18, 13], 2.6, 2.2, b);
        for (const [x1, y1, x2, y2] of [[21, 28, 25.4, 26.4], [20, 23.4, 24.4, 22.6], [19.6, 18.6, 24, 18.8]]) g.l(x1, y1, x2, y2, .4, tick, { shade: false });
      });
      // near wing
      dwing(g, 36.5, 29.5, 45, 7, [[60.5, 4], [61.8, 19], [56, 31]], 42, 38.5, a, c, { claw: d, rb: 2.2, cl: 4.6, glow: g.small ? null : w });
      // horns, cheek frill and head
      g.tube([23, 6.6, 27.6, 3.6, 32, 4.6], 1.8, .55, d, { gloss: true });
      g.tube([20, 5.6, 23.4, 2.6, 27.6, 2.2], 1.5, .5, mix(d, c, .25), { gloss: true });
      K2.ear(g, 25.6, 11.6, 96, 5.6, 2, c); K2.ear(g, 24.6, 15, 126, 4.8, 1.8, c);
      if (!g.back) g.p([6.4, 15.6, 15, 15.6, 21, 15.8, 15, 20.6, 8, 22], f, { mat: 'glow' });
      g.p([5.4, 11.4, 5.6, 6.4, 9.2, 9.6], d, { gloss: true });
      const head = g.e(19.4, 10.6, 7.6, 6, a);
      const up = g.p([15, 5.6, 8.6, 8, 3.2, 11.6, 3, 14.4, 6, 16, 15.6, 16.2, 21, 14.6], a);
      const jaw = g.p([13, 20, 6.8, 22.4, 5.6, 24.4, 8.2, 25.8, 17.6, 22.8, 22.4, 16.6, 19, 15.6], a);
      if (!g.back) { g.on(jaw, () => g.e(11, 25.4, 6.6, 1.7, b)); g.p([6.4, 15.8, 8.2, 15.8, 7.3, 18.8], e); g.p([11, 16, 12.8, 16, 11.9, 18.4], e); g.p([8, 23, 9.8, 22.2, 8.5, 20], e); }
      void head; void up;
      g.eye(14.8, 10, 2.5, 'angry', { iris: '#f8c020', lid: dk(a, .3), side: -1 });
      g.eye(21.2, 9.4, 2, 'angry', { iris: '#f8c020', lid: dk(a, .3), side: 1 });
      g.nose(5.6, 12.6, 'nostrils', { s: .85 });
    }
  });
})();