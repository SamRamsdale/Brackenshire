// ---- art/b7 ----
// ===== Batch 7: the snowy fells (snow bunting, stoat, snowman and frost-imp lines) =====
(() => {
  // four-point frost sparkle (flat, readable on pale snow)
  const spark = (g, x, y, r, col) => { if (g.small) return; g.p([x, y - r, x + r * .3, y - r * .3, x + r, y, x + r * .3, y + r * .3, x, y + r, x - r * .3, y + r * .3, x - r, y, x - r * .3, y - r * .3], col, { shade: false, bevel: 0 }); };

  BEAST('snowpip', {
    pal: { a: '#fbfcff', b: '#c8935a', c: '#2c2c3a', d: '#f4a236', e: '#a9c2e8', f: '#855734' }, keep: ['a', 'c', 'd'], sh: 185,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const W = { mat: 'fur', dk: e };
      // cocked-up black tail feathers
      for (const [ang, len] of [[34, 12], [54, 14], [76, 12.5]]) K2.ear(g, 42.5, 45, ang, len, 2.7, c);
      // feathered snowshoe feet
      g.fur(38, 58.8, 3.8, 2.3, mix(a, e, .7), { n: 6, amp: .25, a0: 0, a1: 180 });
      // fluffed-up ball of a body
      const body = g.fur(32, 44, 14, 13.4, a, { n: 20, amp: .09, ...W });
      g.on(body, () => {
        g.e(37, 55, 10, 5, mix(a, e, .55));
        g.fur(30, 30.6, 8.6, 4.2, b, { n: 9, amp: .25, a0: 10, a1: 170 });
      });
      // little crest tuft
      K2.ear(g, 29, 31.5, -30, 5, 1.7, b, null, f); K2.ear(g, 31.5, 31, 12, 6, 1.8, b, null, f);
      // summer-brown wing, held a little out
      const wing = g.p([37, 43.8, 42.5, 42.2, 47.8, 44.6, 53, 51.2, 47.8, 50.8, 43.6, 52.6, 39, 50.2], b, { mat: 'fur' });
      K2.stripes(g, wing, 38, 42, 53, 53, 112, 3.3, 1, f);
      const foot = g.fur(27, 59, 4, 2.4, a, { n: 6, amp: .25, a0: 0, a1: 180, dk: e });
      void foot; K2.toes(g, 26.5, 60.6, 3, 4, c);
      if (!g.back) g.p([14.4, 45.6, 20.6, 43, 21.4, 47.2], d);
      g.eye(23.8, 40.4, 3.3, 'cute', { iris: '#d8862a', side: -1 });
      g.eye(32.8, 40, 2.9, 'cute', { iris: '#d8862a', side: 1 });
      g.blush(25.6, 46.8, 1.6); g.blush(34.4, 45.8, 1.4);
    }
  });

  BEAST('ptarmagale', {
    pal: { a: '#f8faff', b: '#c2d2ee', c: '#2a2a38', d: '#e4463c', e: '#86cdf4', f: '#a9bce4' }, keep: ['a', 'c'], sh: 185,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const W = { mat: 'fur', dk: f };
      // one big raised wing: scalloped flight feathers with icy tips
      const wingAt = (dx, dy, col, tipc, o) => {
        const pts = [34, 31, 37, 17, 43, 4, 46, 10.5, 50.5, 6.5, 52, 13.5, 56.5, 11, 56.5, 18.5, 60.8, 18, 59, 24.5, 62, 27, 55, 31.5, 47, 37, 40, 39];
        const w = g.p(pts.map((v, i) => v + (i % 2 ? dy : dx)), col, o);
        g.on(w, () => {
          for (const [x, y] of [[43, 5], [50.5, 7.5], [56.3, 12], [60.4, 19], [61.5, 27.5]]) g.c(x + dx, y + dy, 3.3, tipc);
          for (const [x, y] of [[46, 10.5], [52, 13.5], [56.5, 18.5], [59, 24.5]]) g.l(x + dx, y + dy, 41 + dx + (x - 46) * .25, 26 + dy + (y - 10) * .3, .45, mix(col, '#5a6aa0', .45), { shade: false });
        });
        return w;
      };
      wingAt(-11, 1.5, b, e, { dk: mix(f, '#5a6aa8', .4) });
      // black tail fan with snowy tips
      const fan = [40.5, 42]; for (let i = 0; i < 4; i++) { fan.push(...K.pt(41, 45, 84 + i * 16, 19.5)); if (i < 3) fan.push(...K.pt(41, 45, 92 + i * 16, 15)); } fan.push(38, 49);
      const tail = g.p(fan, a, { dk: f });
      g.on(tail, () => g.c(41, 45, 16.6, c));
      // far foot
      g.e(36, 52.5, 3.2, 3.6, mix(a, f, .7)); K2.claws(g, 35, 55.4, 3, 3.4, 2, -1, c);
      // plump body
      let bd, nk;
      g.group(() => { bd = g.re(33, 40, 10.4, 14, -50, a, W); nk = g.tube([28, 34, 23.5, 28, 21, 24], 6.4, 5.6, a, W); });
      g.on([bd, nk], () => { g.re(39.5, 46.5, 4.6, 11, -52, mix(a, f, .7)); if (!g.small) for (const [x, y] of [[25.5, 35.5], [29.5, 39.5], [25, 41.5], [29.5, 45]]) { g.l(x - 1.3, y - .6, x, y + .6, .45, f); g.l(x, y + .6, x + 1.3, y - .6, .45, f); } });
      g.e(29.5, 52.5, 3.6, 3.8, a, W); K2.claws(g, 28.5, 55.6, 3, 3.6, 2.2, -1, c);
      // near wing
      wingAt(0, 0, a, e, { dk: f });
      g.fur(38.5, 34, 6, 4.2, a, { n: 6, amp: .2, a0: 0, a1: 170, mat: 'fur', dk: f, line: false });
      // head: black lores, red combs over the eyes
      const head = g.e(19.5, 21.5, 8, 7.3, a, W);
      if (!g.back) { g.on(head, () => g.p([11.5, 22.6, 15.5, 21.4, 16.5, 23.6, 12, 24.8], c)); g.p([12.6, 21.8, 6, 25, 12.4, 26.8], c, { gloss: true }); }
      g.eye(17.2, 20.6, 2.9, 'angry', { iris: '#f2b01e', lid: d, side: -1 });
      g.eye(24.6, 20.1, 2.4, 'angry', { iris: '#f2b01e', lid: d, side: 1 });
      // the drift it bursts from, snow flying
      g.group(() => { for (const [x, y, rx, ry] of [[11, 59.2, 8, 3.8], [23, 60, 9, 3.2], [38, 60.2, 9, 3], [50.5, 59, 9.5, 4.2], [57.5, 56.8, 3.4, 2.4], [5.5, 57.4, 3, 2.2]]) g.e(x, y, rx, ry, a, { dk: f }); });
      g.tube([6, 48, 3, 42.5, 5.5, 37, 9.5, 38.5, 8.4, 42], 1.1, .6, e, { mat: 'glow' });
      spark(g, 9, 11, 2.2, e); spark(g, 6, 27, 1.8, e); spark(g, 59, 37, 2, e);
    }
  });

  BEAST('stoatling', {
    pal: { a: '#fbfbf8', b: '#b3c0e2', c: '#26262e', d: '#ffaab8', e: '#b98a5c', f: '#7c5636' }, keep: ['a', 'b', 'c', 'd'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const W = { mat: 'fur', dk: b }, far = mix(a, b, .75);
      // tail flicked up, black brush tip
      g.tube([48, 47, 55, 44, 58.5, 36, 56.5, 28], 2.7, 2.4, a, W);
      g.tube([58, 32, 56.5, 25.5, 53, 20.5], 2.9, 1.5, c, { mat: 'fur' });
      // far legs
      g.tube([30, 47, 30.5, 54, 30, 58.6], 2.5, 2.2, far); g.e(29, 59.6, 3.4, 1.8, far);
      g.e(51.5, 59, 4.4, 2.1, far);
      // long arched body with the last of its summer coat
      let bt, hn;
      g.group(() => { bt = g.tube([23, 46.5, 30, 43, 39, 39.5, 46, 41, 50, 47], 6, 6.8, a, W); hn = g.e(48, 50, 6.8, 7.2, a, W); });
      g.on([bt, hn], () => { g.e(38, 52.5, 13, 4, mix(a, b, .6)); g.fur(40.5, 34.5, 11, 5.4, e, { n: 9, amp: .3, a0: 0, a1: 180 }); g.c(53, 44.5, 1.5, e); g.c(28, 39.5, 1.2, e); });
      g.e(45, 59.3, 5, 2.2, a, W); K2.toes(g, 44, 60.6, 3, 3.6, f);
      g.tube([25, 48, 22.5, 54, 20, 58.4], 2.7, 2.3, a, W); g.e(18.6, 59.5, 3.8, 2, a, W); K2.toes(g, 17.8, 60.7, 3, 3, f);
      // head
      for (const [x, y] of [[11.5, 33.5], [23, 32.4]]) { const ear = g.c(x, y, 3.6, a, W); g.on(ear, () => g.c(x, y + .6, 2, d)); }
      const head = g.e(18, 41, 9.2, 8, a, W);
      g.e(11.2, 44.6, 4.6, 3.4, a, { ...W, line: false });
      g.on(head, () => g.fur(18.4, 34.2, 6.4, 3.6, e, { n: 7, amp: .3, a0: 0, a1: 180 }));
      g.eye(14.8, 40.6, 2.5, 'bead', { side: -1 });
      g.eye(22.2, 40.2, 2.1, 'bead', { side: 1 });
      g.nose(7.6, 43.8, 'button', { s: .8 });
      g.mo('smile', 11.6, 46.8, 3);
      g.blush(17.8, 45.8, 1.6);
    }
  });

  BEAST('erminess', {
    pal: { a: '#fbfbf9', b: '#b3c0e2', c: '#22222c', d: '#ffaec0', e: '#8fd6f8', f: '#b6384e', h: '#7c2238' }, keep: ['a', 'b', 'c', 'd'], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const W = { mat: 'fur', dk: b }, far = mix(a, b, .75);
      // tail held high like a sceptre
      g.tube([48, 57.5, 55, 57.5, 59, 50, 57.5, 41, 59, 33], 2.8, 2.4, a, W);
      g.tube([58.9, 36, 59.4, 29.5, 56.5, 23.5], 2.9, 1.4, c, { mat: 'fur' });
      // crimson mantle trailing from the shoulders, trimmed with ermine
      const cape = g.p([28, 25.5, 36, 25, 44, 30, 49.5, 41, 54, 53, 56, 60.5, 38, 60.5, 38, 50, 35, 38], f);
      g.on(cape, () => { g.l(41, 31, 49, 59, .6, h); g.l(37, 34, 43, 59, .6, h); });
      let t1, t2;
      g.group(() => { t1 = g.tube([36.5, 25.5, 44, 30, 49.5, 41, 54, 53, 56, 59.5], 1.9, 2.2, a, W); t2 = g.tube([39, 59.6, 48, 60, 56, 59.6], 2, 2.2, a, W); });
      K2.spots(g, [t1, t2], [[46.6, 34.6, .8, 1.3], [51.2, 45.5, .8, 1.3], [54.8, 55, .8, 1.3], [43, 59.8, 1.3, .8], [49, 60, 1.3, .8]], c);
      // far hind foot, far forepaw
      g.e(37.5, 59.8, 5, 1.8, far);
      // long upright body
      let hn, tr;
      g.group(() => { hn = g.e(36, 52, 8, 7.6, a, W); tr = g.tube([36, 52, 33.5, 43, 30.5, 34, 27.5, 27, 24.5, 20], 7, 4.6, a, W); });
      g.on([hn, tr], () => g.tube([40, 57, 37.5, 46, 34.5, 36, 31.5, 28], 3, 2, mix(a, b, .6)));
      g.e(30.5, 59.6, 5.6, 2, a, W); K2.toes(g, 28, 60.6, 3, 3.4, b);
      // ermine collar with an ice brooch
      const col = g.fur(27.5, 27.2, 7, 3.5, a, { n: 9, amp: .2, mat: 'fur', dk: b });
      K2.spots(g, col, [[31.2, 28.4, .9, 1.3], [27, 29.2, .9, 1.3]], c);
      g.p([20.6, 28.4, 22.8, 25.8, 25, 28.4, 22.8, 32], e, { gloss: true });
      // dainty forepaw
      g.tube([29.5, 33, 26, 36.5, 23, 37], 2.1, 1.8, a, W); g.c(22.2, 37.2, 2, a, W);
      // head and ice tiara
      for (const [x, y] of [[17.4, 9.4], [26.4, 8.8]]) { const ear = g.c(x, y, 3, a, W); g.on(ear, () => g.c(x, y + .5, 1.7, d)); }
      K.crystal(g, 19, 9.2, 1.4, 5, -22, e); K.crystal(g, 25.2, 8.8, 1.4, 5, 22, e); K.crystal(g, 22, 8.8, 1.7, 7.4, 0, e);
      g.e(21.5, 14.8, 7.6, 6.4, a, W);
      g.p([17, 12.6, 12.5, 15, 10.4, 17.2, 11.4, 19.4, 16.6, 20.6, 20.5, 19.4], a, { ...W, line: false });
      g.eye(17.2, 14.8, 2.6, 'sleepy', { iris: '#8a62f0', lid: '#c9b6f2', side: -1 });
      g.eye(24.8, 14.3, 2.2, 'sleepy', { iris: '#8a62f0', lid: '#c9b6f2', side: 1 });
      g.nose(10.9, 17.1, 'pink', { s: .7 });
      g.mo('line', 14.6, 18.7, 2);
      // the frost bows as she passes
      K.crystal(g, 4.5, 61, 1.5, 8, 26, e); K.crystal(g, 9.5, 61, 1.4, 6.4, 46, e); K.crystal(g, 14.5, 61, 1.2, 4.6, 64, e);
    }
  });

  BEAST('frostling', {
    pal: { a: '#fafcff', b: '#abc0e6', c: '#2a2a36', d: '#f28a2c', e: '#d2403c', f: '#6e4a2e', h: '#c8683c', k: '#ffe9c8' }, keep: ['a', 'b', 'c', 'd', 'f', 'k'], sh: 215,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const S = { dk: b };
      // twig arm waving goodbye
      g.l(42, 42.5, 52, 32, 1.1, f); g.l(52, 32, 56.5, 29.5, .9, f); g.l(52, 32, 52.5, 26.5, .9, f); g.l(49.5, 34.6, 55, 35.8, .8, f);
      // scarf tail in the wind
      const tail = g.tube([38, 43.5, 45, 47, 51, 46.5, 57, 50], 2.5, 2.9, e);
      K2.stripes(g, tail, 40, 40, 60, 53, 80, 3.8, 1.3, k);
      // snowballs
      const base = g.e(32, 50.6, 12.8, 10.4, a, S);
      g.on(base, () => g.e(37, 57, 10, 5, mix(a, b, .6)));
      if (!g.back) { g.c(26.4, 49.6, 1.5, c, { gloss: true }); g.c(26, 54.6, 1.5, c, { gloss: true }); }
      const head = g.e(31, 33, 10, 9.4, a, S); void head;
      // scarf
      const wrap = g.tube([21.5, 41.8, 27, 44.2, 36, 44.2, 41.5, 41.4], 2.3, 2.3, e);
      K2.stripes(g, wrap, 20, 39, 43, 47, 75, 3.8, 1.3, k);
      g.e(39.6, 43.8, 2.7, 2.5, e);
      // near twig arm
      g.l(21.5, 48, 12, 44.5, 1.1, f); g.l(12, 44.5, 8, 45.5, .9, f); g.l(12, 44.5, 9, 41, .9, f);
      // flowerpot hat with a snowdrop growing through the hole
      if (!g.small) { g.tube([32.5, 13, 33, 7.5, 36, 5, 38.5, 7], .7, .6, '#5aa64a'); g.p([38.4, 6.6, 40.6, 8.6, 40.4, 11.8, 38.6, 10.4, 37, 11.6, 37.2, 8.4], '#ffffff', { dk: b }); }
      g.p([24.2, 24, 26, 13.4, 37.6, 12, 40.6, 22.2], h);
      g.l(23.6, 24.6, 41.4, 22.5, 1.7, lt(h, .12));
      // face
      if (!g.back) { g.p([28.8, 33, 19.4, 35.8, 29, 36.2], d); for (const [x, y] of [[24.8, 38], [27, 39.2], [29.6, 39.7], [32.2, 39.3], [34.4, 38.1]]) g.dot(x, y, .8, c); }
      g.eye(26, 29.6, 2.9, 'button', { side: -1 });
      g.eye(34.2, 29.2, 2.5, 'button', { side: 1 });
      g.blush(22.6, 34, 1.4); g.blush(37, 34.2, 1.6);
    }
  });

  BEAST('rimeguard', {
    pal: { a: '#eef5fd', b: '#a6c8ea', c: '#6f88aa', d: '#8fe8ff', e: '#26365a', f: '#b4464c', h: '#ee8a34', k: '#7a5a3c' }, keep: ['a', 'b', 'c', 'e', 'h', 'k'], sh: 215,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const S = { dk: '#a4b8e2' }, G = { mat: 'gloss' };
      // far arm and fist
      g.tube([44, 32, 51, 36, 54, 43], 4.4, 4, mix(b, e, .25), G); g.c(54.5, 45.5, 4.4, mix(a, e, .18));
      // far pauldron
      K.crystal(g, 46, 29, 2.6, 10, 42, d); K.crystal(g, 43, 28, 2.4, 8, 14, d);
      // frozen scarf tail
      g.p([40, 26, 50, 28, 57, 25, 55.5, 30, 59, 32.5, 52, 34, 44, 32], f);
      // base ball with ice tassets
      const base = g.e(34, 50.4, 15.5, 10.4, a, S);
      g.on(base, () => g.e(38, 58, 13, 5, mix(a, '#a4b8e2', .6)));
      g.p([41, 43.2, 48, 45, 49, 52.6, 45, 56, 41.5, 53], mix(b, e, .15), G);
      g.p([21, 44, 29, 42.5, 30, 53.6, 25.5, 57.6, 20.5, 52.6], b, G); g.p([30.5, 42.5, 40, 43, 41, 53, 35.5, 58, 30.5, 53.6], b, G);
      // torso with breastplate
      const torso = g.e(33, 35, 13, 10, a, S); void torso;
      const plate = g.p([22, 31, 30, 28.5, 41, 29, 45, 33, 43, 41, 34, 45, 24.5, 41.5], b, { mat: 'metal' });
      g.on(plate, () => { g.l(33, 29, 34, 45, .5, c); g.c(26.5, 35, 1, c); g.c(40, 35, 1, c); });
      // head
      g.e(30.5, 22, 8.6, 7.6, a, S);
      g.tube([22, 27.5, 29, 29.5, 38, 28.5, 41, 26.5], 2.2, 2.2, f);
      // bucket helm
      const pail = g.p([21.6, 20.5, 23.4, 8, 37.4, 7, 40.2, 19.4], c, { mat: 'metal' });
      g.on(pail, () => { g.l(23, 10.4, 38, 9.4, .45, dk(c, .3)); if (!g.back) g.p([22.5, 13.2, 35, 12.4, 35.4, 16.4, 22.8, 17.2], e); });
      g.l(21, 21, 40.8, 19.8, 1.4, lt(c, .15), { mat: 'metal' });
      K.crystal(g, 27, 8, 1.8, 4.5, -18, d); K.crystal(g, 34, 7.6, 1.8, 4.5, 18, d); K.crystal(g, 30.5, 8, 2.2, 6.4, 0, d);
      // near pauldron and arm
      K.crystal(g, 19.5, 30, 3, 11, -42, d); K.crystal(g, 22.5, 28.5, 2.6, 9, -12, d);
      g.e(20.5, 31.5, 5.2, 3.6, b, G);
      g.tube([20, 33, 15, 38, 13, 44], 4.6, 4.2, b, G);
      // halberd: an old broom handle with an ice blade
      g.l(10.5, 60, 10.5, 14, 1.1, k);
      g.p([10.5, 12, 4.5, 10.5, 3, 17, 6, 22, 10.5, 21], d, { gloss: true });
      K.crystal(g, 10.5, 16, 2.4, 13.5, 0, d);
      g.c(12.5, 45, 4.6, a, S);
      // ground ice
      K.crystal(g, 49, 60.5, 2.2, 6.5, 58, d); K.crystal(g, 20, 61, 2, 5, -52, d);
      if (!g.back) g.p([24.5, 16, 15.5, 18.6, 24.8, 19], h);
      g.eye(26.2, 15, 1.9, 'glow', { iris: d, side: -1 });
      g.eye(32, 14.7, 1.6, 'glow', { iris: d, side: 1 });
    }
  });

  BEAST('flakelet', {
    pal: { a: '#aadcf8', b: '#ffffff', c: '#4a8cd8', d: '#7cc4f2', e: '#ff9cc8', f: '#2c4c80' }, keep: ['b'], sh: 80,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, f, .25), FR = { oc: c, shade: false };
      // imp tail with an ice-shard tip
      g.tube([38, 53, 46, 56.5, 53, 52.5, 53.5, 45], 1.4, 1, c);
      K.crystal(g, 53.5, 46, 2.4, 7.5, 4, b);
      // far limbs
      g.tube([37, 51, 39.5, 56, 39, 59], 2.2, 1.8, far); g.p([40.4, 58, 40.8, 61, 34.4, 61, 32.6, 58.8, 35.4, 59.2], mix(c, f, .25));
      g.tube([38, 44, 43.5, 46.5, 40.5, 50.5], 1.6, 1.4, far);
      // body
      const body = g.e(34, 47.5, 6.6, 7.6, a);
      g.on(body, () => g.e(31.5, 49.5, 4, 5.4, b));
      g.tube([31.5, 52, 30, 56, 29, 59], 2.3, 1.9, a); g.p([30.6, 58, 31, 61, 24, 61, 22, 58.6, 25, 59.2], c);
      // icicle hair swept by the wind
      K.crystal(g, 28.5, 25.5, 2, 7, -16, b); K.crystal(g, 40, 26.5, 2.2, 8.5, 52, d); K.crystal(g, 32.5, 24, 2.4, 10, 6, d); K.crystal(g, 36.5, 24.5, 2.4, 11, 30, b);
      // big pointed ears
      K2.ear(g, 23.6, 30.5, -68, 10, 3.2, a, e); K2.ear(g, 42.5, 30, 60, 11, 3.4, a, e);
      g.e(33, 32, 10.4, 9.2, a);
      // near arm reaching out to paint
      g.tube([30.5, 44.5, 24.5, 46.5, 19, 45.5], 1.8, 1.5, a); g.c(17.6, 45.2, 2, a); g.l(16.6, 44.8, 14.4, 44, .8, c);
      // frost fern drawn with a fingertip
      if (!g.small) {
        g.tube([7.5, 61, 7, 55, 8.5, 49.5, 11.5, 46, 13.2, 44.6], .8, .6, b, FR);
        for (const [x1, y1, x2, y2] of [[7.2, 57.4, 3.4, 55], [7.2, 57.4, 11, 55.4], [7.5, 53, 3.8, 50.4], [7.5, 53, 11.4, 51.4], [9, 49, 5.8, 46.4]]) g.l(x1, y1, x2, y2, .55, b, FR);
      }
      spark(g, 13.2, 43.6, 1.8, b);
      g.eye(28, 32, 3.3, 'round', { iris: '#3a5ae0', side: -1, look: -.5 });
      g.eye(37, 31.6, 2.9, 'round', { iris: '#3a5ae0', side: 1, look: -.5 });
      if (!g.back) g.dot(24.2, 35.6, 1, '#f070a8');
      g.mo('fang', 29, 38, 5.2, { fx: 1 });
      g.blush(23.8, 38.2, 1.5); g.blush(40.2, 36.6, 1.5);
    }
  });

  BEAST('crystaflake', {
    pal: { a: '#b6e0fa', b: '#ffffff', c: '#5a8ede', d: '#ffa6dc', e: '#dff2ff', f: '#74ecbc', h: '#b498ff' }, keep: ['b'], sh: 80,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const far = mix(a, c, .3), FR = { oc: c, shade: false }, WS = { dk: '#b4c8ee' };
      const shard = (x, y, ang, len, w, col, tip) => {
        const [tx, ty] = K.pt(x, y, ang, len), [mx, my] = K.pt(x, y, ang, len * .4), [lx, ly] = K.pt(mx, my, ang - 90, w), [rx, ry] = K.pt(mx, my, ang + 90, w);
        const id = g.p([x, y, lx, ly, tx, ty, rx, ry], col, { mat: 'gloss', oc: c });
        g.on(id, () => { if (tip) g.c(tx, ty, len * .3, tip); g.l(x, y, tx, ty, .35, c, { shade: false }); });
        return id;
      };
      // the northern lights she dances on
      const aur = g.tube([3, 55, 12, 59.4, 24, 58, 36, 60, 48, 56.5, 57, 49, 60, 40], 2.3, 1.2, f, { mat: 'glow' });
      g.on(aur, () => g.tube([3, 54, 12, 58.4, 24, 57, 36, 59, 48, 55.5, 56, 48.5, 59, 40], .9, .5, h, { mat: 'glow' }));
      // crystal wings
      shard(33.5, 29, 18, 24, 3.8, mix(e, c, .3), d);
      shard(35, 30, 44, 27, 4.8, e, d); shard(36, 33, 96, 17, 4, e, d);
      // back leg in arabesque
      const bl = g.tube([35, 46, 42, 49.5, 48.5, 48], 2.1, 1.2, a); g.on(bl, () => g.c(48.5, 48, 3.6, c));
      // torso, supporting leg en pointe
      g.tube([33, 43, 31.5, 36.5, 30.5, 30.5], 3.6, 2.8, a);
      const leg = g.tube([32, 46, 31.2, 53, 30.5, 60], 2.1, 1.1, a); g.on(leg, () => g.e(30.6, 58.4, 2.4, 3.6, c));
      // snowflake tutu
      const star = (cx, cy, rx, ry, k, tilt) => { const pts = [], ca = Math.cos(tilt), sa = Math.sin(tilt); for (let i = 0; i < 16; i++) { const th = i / 16 * Math.PI * 2 + .2, o = i % 2 ? k : 1, x = Math.cos(th) * rx * o, y = Math.sin(th) * ry * o; pts.push(cx + x * ca - y * sa, cy + x * sa + y * ca); } return pts; };
      g.p(star(33.2, 45, 12.5, 5.4, .6, -.2), d, { bevel: 1 });
      g.p(star(32.8, 43.2, 10, 4.2, .62, -.2), b, { ...WS, bevel: 1 });
      // head: tufted frost hair, pointed ears, crystal crown
      g.fur(34.5, 19, 5.4, 5, b, { n: 5, amp: .35, a0: -80, a1: 90, ...WS });
      K2.ear(g, 21.5, 20.5, -66, 8, 2.5, a, d); K2.ear(g, 35.6, 19.6, 62, 9, 2.7, a, d);
      K.crystal(g, 24.4, 15.4, 1.6, 5.5, -26, e); K.crystal(g, 32.6, 15, 1.6, 5.5, 24, e); K.crystal(g, 28.4, 14.4, 2, 9, 0, d);
      g.e(28.5, 21, 8.4, 7.6, a);
      // near arm; frost blooms into lace between her hands
      g.tube([30.5, 32.5, 24.5, 36, 18, 34.5], 1.7, 1.4, a); g.c(17, 34.2, 1.7, a);
      if (!g.small) {
        for (let i = 0; i < 3; i++) { const [x1, y1] = K.pt(10.5, 28.5, i * 60, 5), [x2, y2] = K.pt(10.5, 28.5, i * 60 + 180, 5); g.l(x1, y1, x2, y2, .5, b, FR); }
        g.c(10.5, 28.5, 1.3, d, { oc: c });
      } else spark(g, 10.5, 28.5, 3, b);
      g.eye(24.8, 21.8, 2.6, 'happy', { side: -1 });
      g.eye(32, 21.4, 2.2, 'happy', { side: 1 });
      g.mo('smile', 27.6, 25.6, 2.2);
      g.blush(22.4, 24.8, 1.3); g.blush(34, 24.2, 1.3);
    }
  });

})();