// ---- art/b9 ----
// ===== The five legendary Beasties of Brackenshire =====
(() => {
  // ---------- LEYWYRM: the Sleeper beneath the seven standing stones ----------
  BEAST('leywyrm', {
    pal: { a: '#5c6578', b: '#a9b2c2', c: '#6affd8', d: '#2b3145', e: '#6e9a52', f: '#e4e8dc' }, keep: [], sh: 200,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, d, .45), halo = mix(c, a, .5), belly = mix(b, a, .3);
      // a standing stone: a leaning slab with a carved glowing rune and a cap of moss
      const slab = (x, y, ang, len, w, col = b) => {
        const [l0x, l0y] = K.pt(x, y, ang - 90, w), [r0x, r0y] = K.pt(x, y, ang + 90, w);
        const [l1x, l1y] = K.pt(l0x, l0y, ang - 3, len * .88), [r1x, r1y] = K.pt(r0x, r0y, ang + 3, len * .98);
        const [tx, ty] = K.pt(x, y, ang - 5, len * 1.1);
        const id = g.p([l0x, l0y, l1x, l1y, tx, ty, r1x, r1y, r0x, r0y], col, { mat: 'stone' });
        if (!g.small) g.on(id, () => g.c(tx, ty, w * 1.05, e));
        if (!g.small) { const [g0x, g0y] = K.pt(x, y, ang, len * .46), [g1x, g1y] = K.pt(x, y, ang, len * .8); g.l(g0x, g0y, g1x, g1y, .45, c, { ring: false, shade: false }); }
        return id;
      };
      const ley = (pts, w = .45) => { g.tube(pts, w * 2, w * 2, halo, { ring: false, shade: false }); g.tube(pts, w, w, c, { ring: false, shade: false }); };
      // far loop of the coil
      g.tube([10, 51, 15, 44.5, 26, 43, 38, 46], 5.4, 5.4, far, { mat: 'stone' });
      // standing stones along the spine (behind the neck)
      const spine = () => { slab(35.5, 21, 50, 10.5, 2.5); slab(30, 29, 72, 12.5, 2.8); slab(28, 37, 68, 12, 2.9); };
      if (!g.back) spine();
      // neck rearing in an S
      const neck = g.tube([38, 55, 27, 47, 21.5, 37, 25, 27.5, 32.5, 21, 32, 13.5], 7.4, 5.2, a, { mat: 'stone' });
      g.on(neck, () => { g.tube([31, 55, 20, 47, 14.6, 37, 18.6, 27.5, 26.5, 21, 27, 13.5], 3.8, 3, belly); });
      K2.stripes(g, neck, 12, 20, 30, 54, 8, 3.4, .6, mix(belly, d, .4));
      if (g.back) spine();
      // stones along the coil and tail
      slab(43, 50, 8, 11, 2.9); slab(49.6, 49, 24, 10.5, 2.7); slab(56, 44.5, -42, 8.5, 2.3); slab(56, 33, -66, 6.5, 1.9);
      // near coil sweeping up into the tail
      const coil = g.tube([9, 51.5, 14.5, 54.6, 30, 55, 46, 54.6, 56.5, 50, 60, 40, 57, 30, 58, 21], 6, 1.9, a, { mat: 'stone' });
      g.on(coil, () => {
        g.tube([9, 56.4, 16, 59.2, 30, 59.6, 46, 59.2, 58, 54], 2.6, 2.4, belly);
        if (!g.small) for (let x = 15; x < 56; x += 4.2) g.l(x, 57.4, x + .8, 61.5, .3, mix(belly, d, .45));
        // moss creeping over its back after a thousand years asleep
        g.fur(27, 49.2, 8, 2.2, e, { n: 8, amp: .35, a0: 0, a1: 180 }); g.fur(39.5, 49.4, 3.4, 1.8, e, { n: 5, amp: .35, a0: 0, a1: 180 });
      });
      // barbed tail tip
      g.p([58.2, 9, 62, 18, 59.6, 17.4, 59.4, 22, 56.8, 22, 56.6, 17.4, 54, 18.6], b, { mat: 'stone' });
      // near foreleg gripping the coil
      g.tube([23.5, 40, 15.5, 43, 13, 49], 3.5, 2.7, a, { mat: 'stone' });
      g.e(12.6, 50, 3.8, 2.7, a, { mat: 'stone' });
      K2.claws(g, 12, 51.4, 3, 5.4, 3.4, -1, f);
      // head: slab horns like a crown of menhirs
      g.p([25, 5.6, 34, 1.4, 40.4, 1.8, 39, 4.6, 29, 8], mix(b, d, .35), { mat: 'stone' });
      K2.ear(g, 29.6, 17.5, 112, 8, 2.4, b); K2.ear(g, 27.4, 20.6, 146, 6, 2, b);
      // lower jaw, with ley light leaking between the teeth
      K2.ear(g, 12.4, 23, 196, 4.6, 1.5, b); K2.ear(g, 17, 23.2, 186, 3.6, 1.3, b);
      g.p([8.6, 20, 7.4, 21.8, 10.8, 24, 21.5, 23.6, 29, 19, 21, 19.4], a, { mat: 'stone' });
      g.p([6, 18.2, 20, 18.8, 26.5, 17.4, 21, 20.6, 9.4, 20.8], c, { mat: 'glow' });
      const head = g.e(25, 12.6, 8.6, 7, a, { mat: 'stone' });
      const snout = g.p([20.5, 6.2, 13, 8.4, 8, 11, 4.6, 13.4, 3.2, 16, 4.4, 18.4, 8, 18.8, 20, 19.2], a, { mat: 'stone' });
      g.on([head, snout], () => g.p([19.4, 7, 12.4, 9.2, 6.4, 12.8, 8.4, 13.8, 19, 10.6], b));
      K2.zig(g, 6.4, 18.5, 19.6, 19, 5, 1.7, f);
      const horn = g.p([28.6, 7.4, 39, 3, 46.4, 3.4, 45.4, 7.2, 33.6, 11.8], b, { mat: 'stone' });
      void horn;
      if (!g.small) g.l(34, 8.4, 42, 5.4, .45, c, { ring: false, shade: false });
      g.p([13.6, 9, 20.6, 4.8, 30.4, 5.4, 28.8, 9, 20.2, 10.4], mix(a, d, .3), { mat: 'stone' });
      g.eye(20.6, 13.4, 3.1, 'glowcool', { sc: c, side: 1 });
      g.nose(5.8, 14.6, 'dot', { s: .9 });
      // ley lines: rivers of light through the body
      ley([13, 53.4, 22, 54.4, 32, 53.4, 42, 54.4, 51.5, 51.6, 57.4, 44, 58, 36, 57, 28]);
      ley([32, 48.5, 27, 40.5, 27.4, 31.5, 32.6, 24, 32.6, 17.5]);
      if (!g.small) { ley([22, 54.4, 24.4, 51], .35); ley([42, 54.4, 44.6, 57.4], .35); ley([27.4, 31.5, 23.6, 29], .35); ley([27, 40.5, 30.6, 38.6], .35); ley([51.5, 51.6, 52.6, 55], .35); }
      void e;
    }
  });

  // ---------- STORMANE: the storm horse of the lightning-struck tor ----------
  BEAST('stormane', {
    pal: { a: '#3f4578', b: '#fff6b4', c: '#8a8db6', d: '#e6e8f8', e: '#f5c535', f: '#1f2038' }, keep: ['b', 'd', 'e'], sh: 120,
    dex: 'The storm horse of the old banners. Its mane is a living thundercloud, and its hoofbeats are the thunderclap that follows the lightning.',
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, f, .5), bel = lt(a, .2), cdk = mix(c, f, .35);
      // a lightning bolt from (x, y) running len units along ang
      const bolt = (x, y, ang, len, wid, col = e, o = {}) => {
        const r = ang * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), px = Math.cos(r), py = Math.sin(r), pts = [];
        for (const [u, v] of [[.35, 0], [.95, 0], [.62, .4], [.98, .4], [.2, 1], [.44, .56], [.08, .56]]) pts.push(x + dx * v * len + px * (u - .5) * wid, y + dy * v * len + py * (u - .5) * wid);
        return g.p(pts, col, { shade: false, oc: '#7a5a10', ...o });
      };
      // billowing thundercloud: dark underside, bright crowns
      const cloud = (list) => { g.group(() => { for (const [x, y, r] of list) g.c(x, y, r, c, { lt: d, dk: cdk, mat: 'soft' }); }); if (!g.small) for (const [x, y, r] of list) g.c(x - r * .25, y - r * .32, r * .5, d, { ring: false }); };
      const hoof = (x, y, s, col) => g.p([x - 2.6 * s, y + 1.6 * s, x - 1.6 * s, y - 1.8 * s, x + 1.7 * s, y - 1.8 * s, x + 2.4 * s, y + 1.6 * s], col, { mat: 'metal' });
      // cloud tail with a bolt striking from it
      bolt(57.5, 52.5, 174, 8.5, 5.4);
      cloud([[54.5, 36.5, 4.2], [58.3, 40.5, 4.4], [59, 46.5, 4], [57.6, 52, 3.2]]);
      // far legs
      g.tube([51.5, 42, 48, 48, 53.5, 52.5, 51.5, 57.5], 3.6, 1.9, far); hoof(51.2, 59.2, .95, dk(e, .3));
      g.tube([23.5, 26, 13, 23.5, 8, 27.5], 2.9, 1.9, far); hoof(6.8, 30.4, .9, dk(e, .3));
      // thundercloud mane streaming off the neck
      bolt(41, 19.5, 52, 15.5, 7); bolt(44, 28.5, 84, 8.5, 4.4);
      cloud([[23.5, 5.6, 4], [29.5, 7.6, 5], [34.5, 12.5, 5.6], [38.5, 19, 5.2], [42, 25.5, 4]]);
      // torso: round haunch, barrel and deep chest
      let torso;
      g.group(() => { torso = [g.c(46.5, 40.5, 8.6, a, { mat: 'fur' }), g.tube([46, 40.5, 30, 28], 7.2, 7.4, a, { mat: 'fur' }), g.c(29, 27.5, 8.2, a, { mat: 'fur' })]; });
      g.on(torso, () => { g.tube([44, 49.5, 33, 41, 22, 33], 3.2, 3, bel); });
      // dappled haunch and a lightning vein across the shoulder
      K2.spots(g, torso, [[49, 36, 1.8], [45.4, 34, 1.4], [51.8, 40.6, 1.6], [47.6, 40, 1.3], [52, 45.4, 1.2]], lt(a, .32));
      if (!g.small) g.on(torso, () => { for (const [x1, y1, x2, y2] of [[31, 26, 35.6, 29.6], [35.6, 29.6, 33.6, 32], [33.6, 32, 39.6, 35.6], [39.6, 35.6, 37.8, 38], [37.8, 38, 42.4, 41.6]]) g.l(x1, y1, x2, y2, .6, e, { shade: false }); });
      // near hind leg
      g.tube([46.5, 44, 41, 49.5, 46.5, 54, 44.2, 58.5], 4.6, 2.1, a, { mat: 'fur' });
      g.fur(44.2, 57, 3, 2.2, c, { n: 6, amp: .3, lt: d });
      hoof(43.8, 60, 1.05, e);
      // neck and head
      g.tube([30.5, 26, 26.5, 18.5, 21.5, 13.5], 6.6, 4.8, a, { mat: 'fur' });
      K2.ear(g, 16.6, 7.6, -16, 6.5, 2.1, a, c); K2.ear(g, 22.4, 6.6, 10, 6.5, 2.1, a, c);
      const head = g.e(19, 12.4, 6.5, 5.7, a, { mat: 'fur' });
      const muz = g.p([13.6, 8.2, 8, 14, 4.6, 18.4, 4.8, 22, 9.4, 23.6, 15.6, 20.4, 21, 17.2], a, { mat: 'fur' });
      if (!g.back) g.on([head, muz], () => { g.e(7, 21.4, 4, 2.8, c); for (const [x1, y1, x2, y2] of [[18.9, 8, 17.9, 13.6], [17.9, 13.6, 13.4, 17.4], [13.4, 17.4, 10, 19]]) g.l(x1, y1, x2, y2, .75, b, { shade: false }); });
      // near foreleg, pawing the air
      g.tube([25, 31.5, 15.5, 32, 12.5, 38], 3.4, 2.2, a, { mat: 'fur' });
      g.fur(12.4, 38.6, 2.8, 2.1, c, { n: 6, amp: .3, lt: d });
      hoof(11.8, 41.6, 1, e);
      // crest of the mane tumbling over the neck
      cloud([[26, 12.5, 3.3], [30, 18, 3.7], [33.5, 24, 3.4]]);
      g.fur(19, 6.4, 3.2, 2.4, c, { n: 6, amp: .3, lt: d });
      g.eye(14.2, 12.6, 2.3, 'angry', { iris: e, lid: a, side: -1 });
      g.eye(21.8, 11.4, 1.9, 'angry', { iris: e, lid: a, side: 1 });
      g.nose(6, 20, 'nostrils', { s: .9 });
      // sparks off the hooves
      if (!g.small) { bolt(5.4, 33.6, 200, 5.5, 3.2); g.dot(16.4, 43.6, .7, e); g.dot(3.6, 26, .6, e); }
    }
  });

  // ---------- RIMEHORN: the white hart with antlers of crystal ----------
  BEAST('rimehorn', {
    pal: { a: '#f4f9ff', b: '#c9dcf0', c: '#62a8e2', d: '#bfeeff', e: '#b9a4f2', f: '#f2cf62' }, keep: ['a', 'b', 'f'], sh: 130,
    dex: 'The frost stag of the northern peaks, carved on old coats of arms. Snow begins to fall wherever it gallops.',
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(b, '#5a70a8', .3), cfar = mix(c, '#28407a', .25);
      const hoof = (x, y, col) => g.p([x - 2.1, y + 1.3, x - 1.3, y - 1.6, x + 1.3, y - 1.6, x + 2, y + 1.3], col, { gloss: true });
      const star = (x, y, r, col) => g.p([x, y - r, x + r * .28, y - r * .28, x + r, y, x + r * .28, y + r * .28, x, y + r, x - r * .28, y + r * .28, x - r, y, x - r * .28, y - r * .28], col, { mat: 'glow' });
      // snow-puff tail and frost crystals along the spine
      K2.ruff(g, 57, 33.6, 2.8, 3.8, a, 7, .3);
      K.crystal(g, 38, 33, 1.4, 5.2, 14, d); K.crystal(g, 42.6, 32.4, 1.5, 6, 22, e); K.crystal(g, 47.4, 32.6, 1.5, 5.4, 30, d); K.crystal(g, 52, 33.6, 1.3, 4.4, 40, e);
      // far legs
      g.tube([54.6, 41.6, 58, 48.6, 56, 53, 56.6, 58.2], 2.6, 1.4, far); hoof(56.2, 59.8, cfar);
      g.tube([33, 43, 32.6, 51, 32.4, 58.2], 2.4, 1.4, far); hoof(32, 59.8, cfar);
      // body
      let body;
      g.group(() => { body = [g.c(50, 38.4, 7.4, a, { mat: 'fur' }), g.e(42, 39, 12.5, 6.6, a, { mat: 'fur' }), g.c(32, 37.6, 7, a, { mat: 'fur' })]; });
      g.on(body, () => { g.e(41, 44.6, 11, 2.4, b); });
      // snowflake brand on the haunch
      if (!g.small) g.on(body, () => { for (let i = 0; i < 3; i++) { const [x1, y1] = K.pt(51, 37.6, i * 60, 3.4), [x2, y2] = K.pt(51, 37.6, i * 60 + 180, 3.4); g.l(x1, y1, x2, y2, .4, c, { shade: false }); } });
      // near legs: the foreleg is lifted, mid-step
      const hl = g.tube([50.5, 42, 53.6, 49, 51.4, 53.6, 51.8, 58.4], 3.2, 1.5, a); hoof(51.4, 60, c);
      const fl = g.tube([29.6, 42, 24, 45.4, 25.6, 51.4], 2.8, 1.5, a); hoof(26, 53.4, c);
      g.on([hl, fl], () => { g.e(51.6, 57.4, 3, 3.6, d); g.e(25.6, 51.4, 2.6, 2.6, d); });
      // neck and frosty chest ruff
      g.tube([32, 36.4, 27.4, 29.4, 22.8, 24.4], 5.8, 4, a, { mat: 'fur' });
      K2.ruff(g, 28.8, 36, 5.4, 7.2, lt(b, .5), 9, .3, 20, 200, { dk: b });
      // crown collar with a crystal pendant
      g.l(23, 31, 30, 26.4, 1, f, { mat: 'metal' });
      K.crystal(g, 24, 31.8, 1.2, 4.4, 186, e);
      // crystal antlers
      g.tube([18.5, 18, 14.4, 14, 10.4, 10.6, 6.4, 7.6], 2, 1.1, cfar, { gloss: true });
      K.crystal(g, 14.8, 14.6, 1.8, 10, 9, d); K.crystal(g, 10.6, 11, 1.8, 8.4, 0, e); K.crystal(g, 7, 8.2, 1.5, 5.6, -36, d);
      g.tube([22.5, 17.6, 26.6, 13.6, 31, 10.2, 35.6, 6.8], 2.2, 1.2, c, { gloss: true });
      K.crystal(g, 26.2, 14.2, 1.9, 10.4, -10, d); K.crystal(g, 30.8, 10.6, 1.9, 8.4, -1, e); K.crystal(g, 35, 7.4, 1.6, 6, 42, d);
      // ears and head
      K2.ear(g, 15, 19.4, -66, 6.5, 2.2, a, d); K2.ear(g, 25, 19.4, 66, 7.5, 2.4, a, d);
      const head = g.e(20, 21.6, 6.4, 5.4, a, { mat: 'fur' });
      const muz = g.p([15.4, 17.8, 10, 21.8, 6.4, 25.2, 6.6, 27.8, 10, 29, 15.5, 27.6, 21, 26], a, { mat: 'fur' });
      void head; void muz;
      if (!g.back) g.p([20, 15, 21.5, 17.2, 20, 19.4, 18.5, 17.2], e, { gloss: true });
      g.eye(15.6, 22, 2.7, 'cute', { iris: '#6a9cf0', side: -1 });
      g.eye(23.7, 21.4, 2.3, 'cute', { iris: '#6a9cf0', side: 1 });
      g.nose(7.3, 25.1, 'button', { s: .8 });
      // drifting snow
      if (!g.small) { star(8, 38, 2.6, d); star(58, 20, 2.4, d); star(13, 54, 2, d); }
    }
  });

  // ---------- BRANDTUSK: the great boar of the beacon hill ----------
  BEAST('brandtusk', {
    pal: { a: '#5a2a1a', b: '#8a4a2a', c: '#ff6a20', d: '#ffd040', e: '#f8f0d8', f: '#2a1410' }, keep: ['e'], sh: 190,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(a, f, .5), W = '#fff6c8';
      const hoof = (x, y, s, col) => { const id = g.p([x - 3.6 * s, y + 1.4, x - 2.8 * s, y - 2, x + 2.8 * s, y - 2, x + 3.4 * s, y + 1.4], col); if (!g.small) g.l(x - .3, y - 1.6, x - .5, y + 1.2, .35, c, { ring: false, shade: false }); return id; };
      // tail with a flame tuft
      g.tube([55, 37, 60, 36, 60.5, 41], 1.3, 1, a);
      K2.flame(g, 60.4, 43.6, 5, 2.2, 176, c, d, null);
      // far legs
      g.l(46, 47, 45, 57.6, 3.8, far); hoof(44.8, 59.6, .95, f);
      g.l(22, 48, 20.4, 57.6, 3.6, far); hoof(20, 59.6, .9, f);
      // bristles of living flame along the spine
      g.fur(41, 30, 17.5, 9, c, { n: 8, amp: .5, a0: -170, a1: -6, mat: 'glow' });
      for (const [x, y, h, w, ang] of [[30.5, 24, 17, 5.2, -4], [38, 25, 18.5, 5.4, 9], [45.6, 27.5, 15, 4.8, 22], [52, 31.5, 11.5, 4, 36]]) K2.flame(g, x, y, h, w, ang, c, d, W, { licks: 4 });
      // body: high shoulder hump sloping to the rump
      let body;
      g.group(() => { body = [g.c(49.5, 40.5, 10.4, a, { mat: 'fur' }), g.e(39, 40.5, 17, 11.4, a, { mat: 'fur' }), g.c(29.5, 36.5, 12, a, { mat: 'fur' })]; });
      g.on(body, () => { g.e(40, 50, 14, 3.4, b); });
      // glowing cracks in its baked-earth hide
      g.on(body, () => { for (const pts of [[32, 26, 30, 31.5, 33, 35, 31, 40], [42, 30, 44, 35, 41.6, 38.6, 44, 43.6], [51, 33, 53.2, 38.6, 50.6, 42.4]]) for (let i = 0; i + 3 < pts.length; i += 2) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], .5, c, { shade: false }); });
      // near legs
      g.tube([51, 46, 52.6, 52.6, 51.6, 57.6], 4.8, 3.6, a, { mat: 'fur' }); hoof(51.4, 59.8, 1, f);
      g.l(28.5, 48, 27.4, 57.6, 4.4, a, { mat: 'fur' }); hoof(27, 59.8, 1, f);
      // head
      K2.flame(g, 23.6, 28.6, 10, 3.6, -14, c, d, W);
      K2.ear(g, 18.4, 31, -30, 8, 3, a, c); K2.ear(g, 26, 31, 20, 8, 3, a, c);
      const head = g.e(17.5, 40, 10.5, 9.6, a, { mat: 'fur' });
      const snout = g.tube([15, 42, 9, 43.6, 6, 44.2], 6.4, 4.4, a, { mat: 'fur' });
      void head; void snout;
      g.fur(19, 46.6, 8, 4.2, b, { n: 9, amp: .3, a0: 10, a1: 170, mat: 'fur' });
      const disc = g.e(4.8, 44.2, 2.6, 3.9, b);
      if (!g.back) g.on(disc, () => { g.e(4, 43, .8, 1.1, d, { shade: false }); g.e(5.2, 45.6, .8, 1.1, d, { shade: false }); });
      // ember tusks
      const t1 = g.tube([12.5, 48.8, 8, 48.6, 5.4, 45, 5.8, 39], 2, .6, e, { gloss: true });
      const t2 = g.tube([18.4, 49.2, 15.6, 49, 14, 46, 14.6, 42], 1.6, .5, e, { gloss: true });
      g.on([t1, t2], () => { g.c(5.8, 39, 2.6, c); g.c(14.6, 42, 2.2, c); });
      g.eye(14.4, 37.6, 2.4, 'angry', { iris: d, lid: a, side: -1 });
      g.eye(21.4, 36.8, 2, 'angry', { iris: d, lid: a, side: 1 });
      // snorted flame
      K2.flame(g, 4.6, 37.6, 5.4, 2.1, -12, c, d, null);
      if (!g.small) { g.dot(10, 31.5, .7, c); g.dot(58, 28, .7, c); g.dot(46, 18.5, .6, d); }
    }
  });

  // ---------- ALBIONNE: the White Hare who sings the Sleeper back to sleep ----------
  BEAST('albionne', {
    pal: { a: '#fafaf6', b: '#dfe0ea', c: '#8fdcf0', d: '#f2bcd8', e: '#6f86b8', f: '#ffeeb0' }, keep: ['a', 'b', 'd', 'f'], sh: 80,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const far = mix(b, '#7a84b0', .28);
      const star = (x, y, r, col) => g.p([x, y - r, x + r * .28, y - r * .28, x + r, y, x + r * .28, y + r * .28, x, y + r, x - r * .28, y + r * .28, x - r, y, x - r * .28, y - r * .28], col, { mat: 'glow' });
      // long hare ear: a tall leaf shape with a soft inner and a dark tip
      const ear = (x, y, ang, len, w, col, bend = 0) => {
        const r = ang * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), px = Math.cos(r), py = Math.sin(r);
        const shape = (k) => { const L = [], R = []; for (const [t, ww] of [[0, .5], [.15, .78], [.35, .97], [.55, 1], [.75, .8], [.9, .48], [1, 0]]) { const bx = x + dx * len * t + px * bend * t * t, by = y + dy * len * t + py * bend * t * t, hw = w * ww * k; L.push(bx - px * hw, by - py * hw); R.unshift(bx + px * hw, by + py * hw); } return L.slice(0, -2).concat(R); };
        const id = g.p(shape(1), col, { mat: 'fur' });
        g.on(id, () => { g.p(shape(.52), d); const tx = x + dx * len * .93 + px * bend * .86, ty = y + dy * len * .93 + py * bend * .86; g.c(tx, ty, w * 1.25, e); });
        return id;
      };
      const crescent = (cx, cy, R, r, ox, oy, a0, a1, b0, b1, col, o) => { const pts = []; for (let i = 0; i <= 16; i++) { const t = (a0 + (a1 - a0) * i / 16) * Math.PI / 180; pts.push(cx + Math.cos(t) * R, cy + Math.sin(t) * R); } for (let i = 16; i >= 0; i--) { const t = (b0 + (b1 - b0) * i / 16) * Math.PI / 180; pts.push(cx + ox + Math.cos(t) * r, cy + oy + Math.sin(t) * r); } return g.p(pts, col, o); };
      // crescent moon behind it
      { const pts = [], R = 18.5, r = 16, cx = 41.5, cy = 26, ox = -6.8, oy = -4.6;
        for (let i = 0; i <= 20; i++) { const t = (-64 + i * 11.4) * Math.PI / 180; pts.push(cx + Math.cos(t) * R, cy + Math.sin(t) * R); }
        for (let i = 20; i >= 0; i--) { const t = (-40 + i * 8.8) * Math.PI / 180; pts.push(cx + ox + Math.cos(t) * r, cy + oy + Math.sin(t) * r); }
        g.p(pts, f, { mat: 'glow' }); }
      // scut
      K2.ruff(g, 53.4, 51, 3.8, 3.6, a, 8, .28);
      // far foreleg and ear
      g.tube([31.5, 47, 31.5, 54, 31, 58.6], 2.4, 2, far); g.e(30.4, 59.5, 2.8, 1.8, far);
      ear(26, 20.5, 14, 18.6, 3.2, far, 4.5);
      // haunch and upright chest
      const haunch = g.e(41, 48.5, 12.5, 10.5, a, { mat: 'fur' });
      const chest = g.e(28.5, 42.5, 8.6, 12, a, { mat: 'fur' });
      void chest;
      // spiral of ley light on the haunch
      g.on(haunch, () => { const pts = []; for (let i = 0; i <= 22; i++) { const t = i / 22, th = t * Math.PI * 3.6, r = .6 + t * 6.2; pts.push(43 + Math.cos(th) * r, 48 + Math.sin(th) * r * .9); } g.tube(pts, .55, .55, c, { shade: false }); });
      // long hind foot, foreleg
      const foot = g.e(35.5, 58.4, 9.4, 2.7, a, { mat: 'fur' });
      g.on(foot, () => g.e(27, 58.6, 2.6, 3, e));
      const leg = g.tube([26, 47, 25, 54, 24.6, 58.4], 2.7, 2.2, a, { mat: 'fur' });
      const paw = g.e(24, 59.5, 3, 1.9, a);
      g.on([leg, paw], () => g.e(24, 60, 4, 2.4, e));
      K2.ruff(g, 26.4, 38.4, 7, 6.4, a, 7, .2, 15, 185, { dk: b });
      // head
      ear(18.6, 21, -10, 18.6, 3.5, a, 4.5);
      const head = g.e(22.5, 26.5, 9.3, 8, a, { mat: 'fur' });
      const muz = g.e(15.4, 30, 5.4, 4.2, a, { mat: 'fur', line: false });
      void muz;
      g.fur(29.4, 31, 4.6, 4, a, { n: 5, amp: .26, a0: -20, a1: 120, mat: 'fur', line: false });
      if (!g.back) crescent(23.4, 21.2, 2.5, 2.2, 1.3, -.6, 60, 300, 95, 265, c, { shade: false, ring: false });
      g.eye(18.4, 26.4, 2.9, 'closed', { side: -1, lash: true });
      g.eye(27.6, 25.8, 2.5, 'closed', { side: 1, lash: true });
      g.nose(11.4, 28.6, 'pink', { s: .8 });
      g.mo('smile', 14.8, 32, 2.6);
      g.blush(19.4, 31.4, 1.5);
      if (!g.small) { star(8.5, 14, 2.6, c); star(9, 44, 2, f); star(57, 7, 2.2, c); }
    }
  });
})();