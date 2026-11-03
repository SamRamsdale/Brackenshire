// ---- art/b6 ----
// ===== Batch b6: Ironhold castle, household and farm Beasties (knights, beetles, gargoyles, living objects, bulldogs, cattle) =====
(() => {
  'use strict';
  const SHADE = '#1a1030';
  const far = (c, t = .3) => mix(c, SHADE, t);
  // flat face-only details (skipped on the back view and at tiny sizes)
  const flat = (g, fn) => { if (!g.back && !g.tiny) fn(g.feat); };
  // local frame at (x, y): u runs along ang (degrees clockwise from up), v to its right
  const loc = (x, y, ang) => { const a = ang * Math.PI / 180, s = Math.sin(a), c = Math.cos(a); return (u, v) => [x + s * u + c * v, y - c * u + s * v]; };
  const poly = (x, y, ang, pts) => { const f = loc(x, y, ang), out = []; for (let i = 0; i < pts.length; i += 2) out.push(...f(pts[i], pts[i + 1])); return out; };
  // rotated ellipse placed from a base point along an angle (ears, petals)
  const blade = (g, x, y, ang, len, w, col, o) => { const [cx, cy] = K.pt(x, y, ang, len / 2); return g.re(cx, cy, w, len / 2, ang, col, o); };
  // small rivets / studs (dropped at small sizes, where they turn to noise)
  const rivets = (g, list, col) => { if (g.small) return; for (const [x, y] of list) g.dot(x, y, .6, col); };
  // a curled feather / plume: base at (x, y), pointing along ang
  const feather = (g, x, y, ang, len, w, col, quill) => {
    const L = len, W = w;
    const id = g.p(poly(x, y, ang, [0, -.14 * W, .22 * L, -.74 * W, .52 * L, -W, .8 * L, -.8 * W, L, -.08 * W, .87 * L, .28 * W, .8 * L, .82 * W, .67 * L, .5 * W, .57 * L, W, .43 * L, .6 * W, .3 * L, .92 * W, .15 * L, .42 * W, 0, .14 * W]), col, { bevel: W * .7 });
    if (quill) g.on(id, () => { const f = loc(x, y, ang); g.l(...f(0, 0), ...f(L * .86, -W * .12), .32, quill); });
    return id;
  };
  // pixel sparkle on polished metal
  const glint = (g, x, y, n = 1, col = '#ffffff') => { if (g.small) return; g.dot(x, y, .5, col); for (let i = 1; i <= n; i++) { g.dot(x - .8 * i, y, .5, col); g.dot(x + .8 * i, y, .5, col); g.dot(x, y - .8 * i, .5, col); g.dot(x, y + .8 * i, .5, col); } };
  // straight sword: (x, y) is the middle of the crossguard, the blade runs along ang
  const sword = (g, x, y, ang, len, w, o = {}) => {
    const f = loc(x, y, ang), gold = o.guard || '#e4b440';
    g.l(...f(-.6, 0), ...f(-(o.grip || 4), 0), o.gw || .95, o.gripCol || '#5a3c2c');
    g.c(...f(-(o.grip || 4) - .9, 0), o.pr || 1.35, gold, { mat: 'metal' });
    const bl = g.p([...f(0, -w), ...f(len - w * 2.2, -w * .86), ...f(len, 0), ...f(len - w * 2.2, w * .86), ...f(0, w)], o.blade || '#dfe6f2', { mat: 'metal', bevel: w * .8 });
    g.on(bl, () => g.l(...f(1.2, 0), ...f(len - w * 2.6, 0), .3, o.fuller || '#8a96b0'));
    g.l(...f(0, -(o.gl || w * 2.4)), ...f(0, o.gl || w * 2.4), o.gr || .95, gold, { mat: 'metal' });
    return bl;
  };

  // leathery wing: arm from shoulder (sx, sy) to wrist (wx, wy), finger bones fanning to the tips, scalloped membrane back to (bx, by)
  const batWing = (g, o) => {
    const { sx, sy, wx, wy, tips, bx, by, mem, bone } = o, sag = o.sag ?? .3;
    const pts = [sx, sy, wx, wy];
    tips.forEach(([tx, ty], i) => { if (i) { const [qx, qy] = tips[i - 1], mx = (qx + tx) / 2, my = (qy + ty) / 2; pts.push(mx + (wx - mx) * sag, my + (wy - my) * sag); } pts.push(tx, ty); });
    const [lx, ly] = tips[tips.length - 1], mx = (lx + bx) / 2, my = (ly + by) / 2;
    pts.push(mx + (wx - mx) * sag * .7, my + (wy - my) * sag * .7, bx, by);
    const id = g.p(pts, mem, { bevel: 1.4, ...(o.opt || {}) });
    g.on(id, () => tips.forEach(([tx, ty], i) => g.l(wx, wy, tx, ty, i ? .45 : .6, bone)));
    g.tube([sx, sy, (sx + wx) / 2 + (o.ex || 0), (sy + wy) / 2 + (o.ey || 0), wx, wy], o.aw || 1.6, o.aw2 || 1.1, bone, o.aopt || {});
    return id;
  };

  // four-pointed sparkle
  const star4 = (g, x, y, s, col, o = {}) => g.p([x, y - s, x + s * .26, y - s * .26, x + s, y, x + s * .26, y + s * .26, x, y + s, x - s * .26, y + s * .26, x - s, y, x - s * .26, y - s * .26], col, { mat: 'glow', bevel: .4, ...o });
  // wraps g so a whole design can be tilted (degrees clockwise) and scaled about (ox, oy) without rewriting its coordinates
  const tiltG = (g, ang, ox, oy, k = 1) => {
    const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const T = (x, y) => [ox + ((x - ox) * ca - (y - oy) * sa) * k, oy + ((x - ox) * sa + (y - oy) * ca) * k];
    const pts = arr => { const out = []; for (let i = 0; i < arr.length; i += 2) out.push(...T(arr[i], arr[i + 1])); return out; };
    const h = Object.create(g);
    h.T = T;
    h.e = (cx, cy, rx, ry, col, o) => rx === ry || (o && o.fur) ? g.e(...T(cx, cy), rx * k, ry * k, col, o) : g.re(...T(cx, cy), rx * k, ry * k, ang, col, o);
    h.c = (cx, cy, r, col, o) => g.e(...T(cx, cy), r * k, r * k, col, o);
    h.fur = (cx, cy, rx, ry, col, o) => g.fur(...T(cx, cy), rx * k, ry * k, col, o);
    h.re = (cx, cy, rx, ry, an, col, o) => g.re(...T(cx, cy), rx * k, ry * k, an + ang, col, o);
    h.l = (x1, y1, x2, y2, r, col, o) => g.l(...T(x1, y1), ...T(x2, y2), r * k, col, o);
    h.tube = (arr, r0, r1, col, o) => g.tube(pts(arr), r0 * k, r1 * k, col, o);
    h.p = (arr, col, o) => g.p(pts(arr), col, o);
    h.dot = (x, y, r, col) => g.dot(...T(x, y), r * k, col);
    h.eye = (x, y, r, type, o) => g.eye(...T(x, y), r * k, type, o);
    h.mo = (type, x, y, w, o) => g.mo(type, ...T(x, y), w * k, o);
    h.nose = (x, y, type, o) => g.nose(...T(x, y), type, o);
    h.blush = (x, y, r) => g.blush(...T(x, y), r * k);
    h.feat = { fe: (cx, cy, rx, ry, col) => g.feat.fe(...T(cx, cy), rx * k, ry * k, col), fl: (x1, y1, x2, y2, r, col, ne) => g.feat.fl(...T(x1, y1), ...T(x2, y2), r * k, col, ne),
      fp: (arr, col) => g.feat.fp(pts(arr), col), fpx: (x, y, col) => g.feat.fpx(...T(x, y), col), fchain: (arr, r, col) => g.feat.fchain(pts(arr), r * k, col) };
    return h;
  };
  // chain of alternating face-on and edge-on links along a path
  const chain = (g, pts, col, dark) => {
    for (let i = 0; i + 3 < pts.length; i += 2) {
      const x1 = pts[i], y1 = pts[i + 1], x2 = pts[i + 2], y2 = pts[i + 3], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, len = Math.hypot(x2 - x1, y2 - y1);
      if ((i / 2) % 2) g.l(x1 + (x2 - x1) * .12, y1 + (y2 - y1) * .12, x2 - (x2 - x1) * .12, y2 - (y2 - y1) * .12, .8, col, { mat: 'metal' });
      else { const id = g.re(mx, my, len * .64, 1.45, ang, col, { mat: 'metal' }); if (!g.small) g.on(id, () => g.re(mx, my, len * .3, .5, ang, dark)); }
    }
  };

  // a letter: centre, size, tilt (degrees clockwise); optional wax seal
  const envelope = (g, cx, cy, w, h, ang, col, seal) => {
    const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), f = (dx, dy) => [cx + dx * ca - dy * sa, cy + dx * sa + dy * ca];
    const id = g.p([...f(-w / 2, -h / 2), ...f(w / 2, -h / 2), ...f(w / 2, h / 2), ...f(-w / 2, h / 2)], col, { bevel: .7 });
    g.on(id, () => { if (seal) g.c(...f(0, h * .08), h * .19, seal); g.l(...f(-w / 2, -h / 2), ...f(0, h * .14), .32, '#b4aabe'); g.l(...f(w / 2, -h / 2), ...f(0, h * .14), .32, '#b4aabe'); });
    return id;
  };
  // points along a tilted elliptical arc (angles in degrees, 0 = right, 90 = down)
  const arcPts = (cx, cy, rx, ry, tilt, a0, a1, n = 8) => { const t = tilt * Math.PI / 180, ct = Math.cos(t), st = Math.sin(t), out = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push(cx + x * ct - y * st, cy + x * st + y * ct); } return out; };

  // ---------------------------------------------------------------- Pageling
  BEAST('pageling', {
    pal: { a: '#8c98b0', b: '#c6d0de', c: '#23263c', d: '#dc4a3e', e: '#9ae6ff', f: '#8a5a30', h: '#566080' }, keep: ['a', 'b', 'c', 'h'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const band = mix(b, h, .5);
      // far leg stretched back in a lunge
      g.l(36.5, 55, 38.5, 58, 2.1, far(a, .28));
      g.e(39.8, 59.5, 3.8, 2.1, far(h, .3));
      // neckerchief tail fluttering behind
      g.p([37, 45.5, 44.5, 43, 48, 45.5, 44.2, 46.5, 46.8, 50, 39.5, 48.2], d);
      // little body
      const body = g.e(32.5, 51, 7.6, 6.6, a);
      g.on(body, () => g.e(29.5, 52.5, 4.6, 4.4, lt(a, .22)));
      g.e(31.5, 45.8, 7.4, 2.4, d);
      // near leg forward
      g.l(28.5, 55.5, 26, 58, 2.3, a);
      g.e(25, 59.7, 4.2, 2.3, h);
      // the stick it drills with, still sprouting a leaf
      g.tube([19.8, 53, 17, 47.5, 12.5, 37, 9, 27.5], 1.05, .75, f);
      g.l(13.2, 38.6, 8.6, 37.2, .62, f);
      K.leaf(g, 8.6, 37.2, -78, 4.6, 1.7, '#6cb44a', '#3a8434');
      // the old helmet: far too big, dented, with a feather stuck in it
      feather(g, 33, 21.6, 55, 15, 3.4, d, lt(d, .35));
      const helm = g.e(30, 32, 13.5, 12, b, { mat: 'metal' });
      g.on(helm, () => {   // (marks drawn first sit on top)
        if (!g.back) g.e(27, 35, 8, 5.6, c, { shade: false });
        g.tube([33, 20.2, 29, 23.5, 27, 28.6], .9, .9, band);
        g.tube([16.5, 31.5, 21.5, 28.8, 29, 27.6, 37.5, 28.4, 43.6, 31.4], .8, .8, band);
        g.e(38.2, 34.6, 2.4, 1.8, mix(b, h, .45)); g.l(36.2, 36.4, 40, 36.2, .35, lt(b, .5));
        g.l(18.6, 26.4, 21.2, 24.2, .35, mix(b, h, .6));
      });
      g.tube([16.6, 39.4, 22, 43.4, 30, 44.8, 38, 43.4, 43.8, 39], 1.3, 1.3, band, { mat: 'metal' });
      if (!g.back) g.l(26.5, 28.6, 26.2, 40.4, 1.15, b, { mat: 'metal' });
      rivets(g, [[20.4, 30], [24.4, 28.6], [32.6, 28], [37.4, 28.8], [41.4, 30.4]], dk(h, .3));
      // arm and mitten gripping the stick
      g.tube([26.5, 49, 22, 50.5, 17.5, 48], 2.1, 1.9, a);
      g.c(17, 47.6, 2.3, lt(a, .15));
      g.eye(22.6, 35, 2.7, 'glow', { iris: e, side: -1 });
      g.eye(31, 34.8, 2.5, 'glow', { iris: e, side: 1 });
    }
  });

  // ---------------------------------------------------------------- Squirex
  BEAST('squirex', {
    pal: { a: '#98a4ba', b: '#d6deea', c: '#23263c', d: '#c83c3c', e: '#9ae6ff', f: '#e4b440', h: '#56607e' }, keep: ['a', 'b', 'c', 'h', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const fa = far(a, .28);
      // far leg
      g.l(35.5, 46, 37.5, 56.5, 2.5, fa, { mat: 'metal' });
      g.p([35, 57.4, 41.5, 57.4, 43.6, 60.9, 35, 61], far(h, .25));
      // far arm with a buckler
      g.tube([37.5, 32.5, 41, 35, 43, 38], 2.1, 1.9, fa);
      const bk = g.c(44.2, 39, 6.2, f, { mat: 'metal' });
      g.on(bk, () => g.c(44.2, 39, 4.8, d));
      g.c(44.2, 39, 1.7, f, { mat: 'metal' });
      // near leg
      g.l(28.5, 46.5, 27, 56.5, 2.8, a, { mat: 'metal' });
      g.c(27.6, 51.6, 2.4, b, { mat: 'metal' });
      g.p([22.5, 57.2, 30.5, 57, 31, 61, 20.5, 61, 19.2, 59.8], h, { mat: 'metal' });
      // tabard skirt
      g.p([24.5, 41, 39, 41, 40.5, 49.5, 36.5, 48, 33, 51.5, 29.5, 48.5, 25.5, 51, 23.5, 47], d);
      // far pauldron and breastplate
      g.e(38.6, 30.5, 3.6, 3, fa, { mat: 'metal' });
      const torso = g.e(31.5, 36.5, 8, 8.2, a, { mat: 'metal' });
      g.on(torso, () => { g.l(23, 42.2, 40, 42.2, 1, h); g.l(31, 30, 30.4, 41, .4, lt(a, .5)); g.tube([25, 31.6, 30.5, 33.4, 37.6, 31.2], .5, .5, f); });
      rivets(g, [[30.6, 42.2]], f);
      // mail collar, bascinet with a pointed visor
      g.e(30.5, 28.6, 6.6, 2.6, h);
      feather(g, 34.5, 12.5, 72, 12, 2.6, dk(d, .18));
      feather(g, 32.5, 11.5, 56, 14, 3.1, d, lt(d, .35));
      g.e(31, 19.5, 8.2, 8.8, a, { mat: 'metal' });
      g.p([23.5, 15.5, 30.5, 15, 33.5, 20, 31.5, 26.5, 24, 27, 13.2, 23.2], b, { mat: 'metal', bevel: 2 });
      g.c(32.3, 19.8, 1.4, f, { mat: 'metal' });
      rivets(g, [[18.2, 23.4], [20.4, 24.6], [22.6, 23.6], [24.8, 24.8]], c);
      g.visor(20.4, 29.8, 19.5, 1.8, e);
      // sword raised in salute
      sword(g, 11, 31, -3, 22, 1.5, { guard: f, grip: 5 });
      // near arm
      g.e(25.2, 31, 4.2, 3.5, b, { mat: 'metal' });
      g.tube([24.5, 33.5, 19, 38.5, 12.5, 35.5], 2.2, 2, a, { mat: 'metal' });
      g.c(11.6, 34.6, 2.5, b, { mat: 'metal' });
      // it polishes its armour until it gleams
      glint(g, 35.6, 14.4, 2); glint(g, 23.6, 29.6, 1); glint(g, 10.6, 13, 1);
    }
  });

  // ---------------------------------------------------------------- Knightrix
  BEAST('knightrix', {
    pal: { a: '#8a96ae', b: '#dce4f0', c: '#1e2238', d: '#2c4ea6', e: '#9ae6ff', f: '#e8c048', h: '#4e5878', k: '#c83c3c' }, keep: ['a', 'b', 'c', 'h', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const fa = far(a, .28);
      const cape = () => {
        const id = g.p([20, 22, 46, 20, 55, 30, 60, 46, 61, 58, 55, 55.5, 51, 61, 45, 56, 40, 60.5, 20, 56], d);
        g.on(id, () => { g.l(52, 30, 57, 55, .5, dk(d, .3)); g.l(47, 34, 49, 58, .5, dk(d, .3)); if (g.back) { g.l(30, 30, 28, 57, .5, dk(d, .3)); g.l(38, 28, 39, 58, .5, dk(d, .3)); } });
      };
      if (!g.back) cape();
      // greatsword planted point-down
      sword(g, 53, 33, 178, 27, 1.9, { guard: f, grip: 5.5, gl: 5, gr: 1.2, pr: 1.7 });
      // legs
      g.l(39, 47, 41, 56, 3.4, fa, { mat: 'metal' });
      g.e(42.5, 59.6, 4.8, 2.2, far(h, .25));
      g.l(28, 47, 26, 56, 3.8, a, { mat: 'metal' });
      g.e(26.6, 51.6, 3, 2.6, b, { mat: 'metal' });
      g.p([20, 57.4, 30, 57, 31, 61, 18.6, 61], h, { mat: 'metal' });
      // tassets
      const skirt = g.p([22.5, 41, 43.5, 40, 45, 49, 39, 47.5, 34, 50.5, 29, 48, 22, 50], a, { mat: 'metal' });
      g.on(skirt, () => { g.l(22, 41.6, 44, 40.6, 1.1, f); g.l(29, 42, 29, 49, .4, h); g.l(34, 42, 34, 51, .4, h); g.l(39, 42, 39, 48, .4, h); });
      // breastplate with the cape's chain and clasp
      const torso = g.e(33, 33, 11.5, 10.5, a, { mat: 'metal' });
      g.on(torso, () => { g.c(33.4, 32.4, 1.7, e); g.c(33.4, 32.4, 2.5, f); g.tube([23, 28.6, 28, 31.8, 38.5, 31.6, 43.5, 27.6], .55, .55, f); g.l(33, 35, 32.6, 43, .4, lt(a, .5)); });
      if (g.back) cape();
      // far arm resting on the hilt
      g.e(44.5, 23.5, 6, 4.8, fa, { mat: 'metal' });
      g.tube([45.5, 25, 50.5, 27.5, 52.6, 30.4], 2.6, 2.3, fa, { mat: 'metal' });
      g.e(52.8, 30.6, 2.8, 2.5, a, { mat: 'metal' });
      // kite shield bearing the tower of Ironhold
      const sh = g.p([7, 30, 14, 28, 22, 29.5, 22.5, 43, 19, 52, 14.5, 59, 10, 52, 6.5, 43], f, { mat: 'metal' });
      g.on(sh, () => {
        g.p([11.4, 46.5, 11.4, 36.5, 12.8, 36.5, 12.8, 38.3, 13.9, 38.3, 13.9, 36.5, 15.3, 36.5, 15.3, 38.3, 16.4, 38.3, 16.4, 36.5, 17.8, 36.5, 17.8, 46.5], f);
        g.p([8.6, 31.6, 14, 30, 20.4, 31.2, 20.8, 42.6, 17.6, 51, 14.5, 56, 11.4, 51, 8.2, 42.6], d);
      });
      // gorget, plume and great helm
      g.e(32.5, 23.8, 6.6, 3, h);
      g.group(() => {
        g.tube([34, 7, 37.5, 3.4, 43.5, 3.6, 47.5, 8, 48, 14.5, 46, 19.5], 1.6, 2.5, k, { mat: 'fur' });
        g.tube([42, 3.6, 47, 5, 50.6, 10.5, 50.8, 16.5, 49.6, 21.5], 1.3, .9, k, { mat: 'fur' });
        g.tube([44.5, 8, 45.6, 13, 44.2, 18, 42.8, 21.5], 1.5, .8, k, { mat: 'fur' });
      });
      const helm = g.p([24.5, 9.5, 27.5, 5.5, 37.5, 5, 41, 8.5, 41.5, 20.5, 38, 24, 27.5, 24.5, 24, 21.5], a, { mat: 'metal', bevel: 3 });
      g.on(helm, () => {
        g.l(30.9, 5, 30.7, 24.5, .85, f); g.l(24, 11.4, 38.8, 10.8, .7, f); g.l(24, 18.2, 38.8, 17.6, .7, f);
        if (!g.back) { g.p([24, 11.8, 30.8, 13.6, 38.4, 11.2, 38.4, 16.8, 24, 17.4], c, { shade: false }); for (const x of [26.2, 28, 33.6, 35.4]) g.l(x, 20, x, 22.2, .35, c, { shade: false }); }
      });
      // near pauldron: layered plates and a spike
      g.p([15.6, 21.5, 14.6, 15.4, 16.6, 13.6, 19.4, 15, 22.6, 19.6], a, { mat: 'metal', bevel: 1.2 });
      g.e(20.6, 27.2, 7, 4.4, a, { mat: 'metal' });
      const pd = g.e(21, 23.8, 7.2, 5.2, b, { mat: 'metal' });
      g.on(pd, () => { g.e(21, 22.4, 7.6, 4.6, b); g.e(21, 23.8, 7.2, 5.2, f); });
      g.eye(27.2, 15, 2.3, 'glowcool', { sc: e, side: -1 });
      g.eye(34.5, 14.6, 2.1, 'glowcool', { sc: e, side: 1 });
    }
  });

  // ---------------------------------------------------------------- Stagnip
  BEAST('stagnip', {
    pal: { a: '#86432e', b: '#5c4038', d: '#281c20', e: '#d48a48', f: '#d8483a', h: '#f4d058', k: '#ece0c4' }, keep: ['f', 'h', 'k'], sh: 190,
    draw(g) {
      const { a, b, d, e, f, h, k } = g.P;
      const fd = far(d, .15), fe = far(e, .22);
      // far legs
      for (const [x1, y1, x2, y2, x3, y3] of [[37, 55.5, 38.5, 58.2, 37.5, 60.5], [45.5, 54.5, 48, 57.5, 47.5, 60.5], [52, 49, 56, 53, 57.5, 59]]) { g.l(x1, y1, x2, y2, 1.05, fd); g.l(x2, y2, x3, y3, .9, fd); }
      // the matchbox it is shoving along
      g.p([2.5, 51.5, 5.5, 48.5, 14.5, 48.5, 11.5, 51.5], k);
      g.p([11.5, 51.5, 14.5, 48.5, 14.5, 57.5, 11.5, 60.5], '#7a5a48');
      const box = g.p([2.5, 51.5, 11.5, 51.5, 11.5, 60.5, 2.5, 60.5], f, { bevel: .8 });
      g.on(box, () => g.p([4.2, 53.6, 9.8, 53.6, 9.8, 58.4, 4.2, 58.4], h));
      // far jaw and antenna
      g.tube([19.5, 44, 15.5, 43.4, 13.2, 46.4], 1.5, .7, fe, { mat: 'metal' });
      g.tube([32, 37.5, 32.5, 31.5, 30, 28.5], .6, .5, fd); g.e(29.2, 28, 1.6, 1.15, fe);
      // wing cases, tipped up as it pushes
      const shell = g.re(43, 42.5, 11.8, 10.8, -20, a, { mat: 'metal' });
      g.on(shell, () => { g.tube([32.5, 42, 42, 34.2, 53.5, 35.2], .45, .45, dk(a, .5)); g.tube([35, 49.5, 45, 42.5, 54.5, 41.5], .35, .35, dk(a, .28)); });
      // near legs
      for (const [x1, y1, x2, y2, x3, y3] of [[35.5, 56, 33.5, 58.4, 31, 60.6], [44, 54.5, 45.5, 57.6, 44, 60.7], [52.5, 50.5, 56.5, 54.5, 58, 60.5]]) { g.l(x1, y1, x2, y2, 1.3, d); g.l(x2, y2, x3, y3, 1.05, d); }
      // big head
      g.e(27, 46.5, 10, 9.2, b, { mat: 'gloss' });
      g.tube([27.5, 38, 25, 32.5, 21.5, 30.6], .6, .5, d); g.e(20.6, 30.4, 1.7, 1.2, e);
      // near jaw with one tine
      g.p([15.2, 51.4, 14.6, 48, 17.4, 50.6], e, { mat: 'metal', bevel: .6 });
      g.tube([18.5, 51.5, 14.5, 52.8, 12.2, 50], 1.8, .8, e, { mat: 'metal' });
      g.eye(22.8, 45, 3.3, 'round', { iris: '#f0a030', side: -1, brow: 1 });
      g.eye(31.4, 44.2, 2.9, 'round', { iris: '#f0a030', side: 1, brow: 1 });
      g.mo('line', 25.8, 51.8, 2.6);
      g.blush(19.8, 49.2, 1.4); g.blush(34.4, 48.2, 1.3);
    }
  });

  // ---------------------------------------------------------------- Stagmajor
  BEAST('stagmajor', {
    pal: { a: '#6e3042', b: '#40304a', d: '#221a28', e: '#d88c48', f: '#a8845e' }, keep: [], sh: 190,
    draw(g) {
      const { a, b, d, e, f } = g.P;
      const fd = far(d, .1), fe = far(e, .25);
      // jointed leg: femur, tibia, claw, with a bronze knee
      const leg = (pts, r, col, knee) => {
        for (let i = 0; i + 3 < pts.length; i += 2) g.l(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], r * (1 - i * .09), col);
        if (knee && !g.small) g.c(pts[2], pts[3], r * .62, knee, { mat: 'metal' });
      };
      // far legs
      leg([37.5, 47.5, 35, 53.5, 33.5, 60.5], 1.5, fd); leg([49, 53, 54, 57, 57, 60.5], 1.5, fd);
      // far antler-jaw
      g.p([18, 13.6, 13.2, 11.4, 17.4, 9.8], fe, { mat: 'metal', bevel: .7 });
      g.tube([19.5, 18, 17.3, 11, 19.6, 5.6, 24.6, 2.8], 2.2, .8, fe, { mat: 'metal' });
      // abdomen: wing cases over a plated belly
      const shell = g.re(43, 43, 15, 10.5, 35, a, { mat: 'metal' });
      g.on(shell, () => {
        g.tube([31.5, 33.5, 45, 37.5, 56, 49.5], .5, .5, dk(a, .5));
        for (const t of [.25, .5, .75]) g.l(28 + t * 25, 39.5 + t * 16.5, 24 + t * 25, 45.5 + t * 16.5, .4, dk(f, .4));
        g.l(29, 41, 53.5, 56.5, .6, e);
        g.p([27, 39.5, 53.5, 56.2, 52, 62, 24, 62], f);
      });
      // near legs
      leg([34.5, 45, 28.5, 49.5, 26, 60.5], 1.9, d, e); leg([45, 51.5, 48.5, 56.5, 45, 60.5], 1.9, d, e);
      // thorax shield and broad head
      const thor = g.e(28.5, 30.5, 8.6, 8, b, { mat: 'metal' });
      g.on(thor, () => g.tube([20.5, 33.5, 26.5, 38.2, 34.5, 36.5], .6, .6, e));
      g.e(20.5, 22.5, 7.6, 6.6, b, { mat: 'gloss' });
      // near front leg raised
      leg([24.5, 36, 17, 41.5, 10.5, 36, 8.4, 33.6], 2, d, e);
      g.l(10.5, 36, 8, 37.6, .9, d);
      // near antler-jaw
      g.p([5.6, 19.6, 10.2, 16.4, 5, 15.6], e, { mat: 'metal', bevel: .7 });
      g.p([4, 13.2, 8.4, 10, 3.8, 9.4], e, { mat: 'metal', bevel: .7 });
      g.tube([14.5, 23.5, 8, 22, 4, 15.5, 4.5, 7], 2.6, .9, e, { mat: 'metal' });
      glint(g, 6, 20.6, 1);
      g.eye(17.6, 22.6, 2.6, 'angry', { iris: '#f6c030', lid: b, side: -1 });
      g.eye(24.2, 21.7, 2.1, 'angry', { iris: '#f6c030', lid: b, side: 1 });
    }
  });

  // ---------------------------------------------------------------- Grotling
  BEAST('grotling', {
    pal: { a: '#8e8e9a', b: '#b8b8c2', c: '#5e5e6c', d: '#6c9c58', e: '#f0627c' }, keep: ['d'], sh: 150,
    draw(g) {
      const { a, b, c, d, e } = g.P;
      const fa = far(a, .28), S = { mat: 'stone' };
      // a broken length of church gutter to perch on
      const ledge = g.p([10, 55.5, 52, 55.5, 54, 61, 8, 61], b, S);
      g.on(ledge, () => { g.e(46, 56, 5, 1.6, d); g.e(13, 60.6, 3, 1.4, d); g.l(18, 57.5, 22, 60.5, .35, c); g.l(36, 56, 34.5, 59, .35, c); });
      // wings
      batWing(g, { sx: 37, sy: 41, wx: 45, wy: 28, tips: [[49.5, 22.5], [54, 25]], bx: 42, by: 39, mem: far(c, .25), bone: fa });
      batWing(g, { sx: 39, sy: 42, wx: 48, wy: 30, tips: [[55.5, 26.5], [58, 34.5], [53.5, 41]], bx: 43, by: 46, mem: c, bone: a, aopt: S });
      // tail with a spade tip
      g.tube([43, 54, 49, 55.5, 55.5, 54.5, 59, 51], 1.6, .9, a, S);
      g.p([57, 51, 59.4, 45.4, 61.6, 50.8, 59.4, 49.6], a, S);
      // crouched body
      g.tube([30.5, 44, 29, 50, 29.5, 54.5], 2.1, 1.9, fa); g.e(29, 55.6, 2.6, 1.8, fa);
      const torso = g.e(34.5, 46.5, 8.5, 8.5, a, S);
      g.on(torso, () => g.e(31, 48.5, 4.6, 5.6, lt(a, .18)));
      g.e(39.5, 50.5, 6, 5.5, a, S);
      g.e(35, 55.8, 4.6, 2.2, a, S); K2.claws(g, 33.6, 57, 3, 3.8, 1.6, -1, b);
      g.tube([27, 44.5, 24, 50, 24, 54.5], 2.3, 2.1, a, S); g.e(23.6, 55.6, 3, 2, a, S); K2.claws(g, 22.6, 56.8, 3, 3.6, 1.6, -1, b);
      // head: big ears, stubby horns
      K2.ear(g, 18.5, 31, -72, 10, 3.4, a, mix(a, e, .4));
      K2.ear(g, 36.5, 27.5, 40, 9.5, 3.2, a, mix(a, e, .4));
      const head = g.e(28, 33, 11.5, 9.8, a, S);
      g.on(head, () => { g.e(33.5, 24.6, 5, 2.2, d); g.l(36, 33, 38.5, 36.5, .35, c); });
      K.horn(g, 23, 25.6, -20, 5.6, 1.9, b, -18); K.horn(g, 32.4, 24.6, 18, 5.4, 1.8, b, 18);
      // pulling a face
      g.eye(22.6, 31.2, 3.5, 'round', { iris: '#f4c430', side: -1, look: -.2 });
      g.eye(32.8, 31, 2.7, 'happy', { side: 1 });
      g.nose(25.4, 35, 'nostrils', { s: .8 });
      g.mo('open', 25.4, 37, 8, { h: 3.2, tongue: e });
      flat(g, F => { F.fe(24.4, 41, 2.4, 3.2, '#1b1328'); F.fe(24.4, 40.7, 1.7, 2.7, e); F.fl(24.4, 39.2, 24.4, 41.4, .3, dk(e, .3)); F.fp([21.6, 37, 23, 37, 22.3, 38.6], '#ffffff'); F.fp([28, 37, 29.4, 37, 28.7, 38.6], '#ffffff'); });
    }
  });

  // ---------------------------------------------------------------- Gargrim
  BEAST('gargrim', {
    pal: { a: '#7e7e8a', b: '#acacb6', c: '#4c4c5a', d: '#5c8c4a', e: '#ff5a3a', f: '#8cd0f4' }, keep: ['d', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f } = g.P;
      const fa = far(a, .28), S = { mat: 'stone' };
      // wings raised
      batWing(g, { sx: 36, sy: 27, wx: 39, wy: 6.5, tips: [[32.5, 2.6], [28.5, 10.5], [32, 19]], bx: 34.5, by: 27, mem: far(c, .25), bone: fa });
      batWing(g, { sx: 41, sy: 27, wx: 50, wy: 8, tips: [[59.5, 4], [61, 17], [57, 29]], bx: 47, by: 34, mem: c, bone: a, aw: 2, aw2: 1.3, aopt: S });
      // tower corbel
      const pl = g.p([27, 52.5, 60, 52.5, 61.5, 61, 25.5, 61], dk(b, .12), S);
      g.on(pl, () => { g.l(40, 54, 39.5, 61, .35, c); g.l(51, 56, 54, 59, .35, c); });
      const cap = g.p([25, 50.5, 61.5, 50.5, 61.5, 53.5, 25, 53.5], b, S);
      g.on(cap, () => g.e(55, 50.8, 4.5, 1.5, d));
      // far limbs
      g.e(50, 44, 6, 6, fa, S);
      g.tube([34, 39, 34.5, 45.5, 35.5, 49.5], 2.5, 2.2, fa); g.e(35.5, 50.4, 3, 1.8, fa);
      // tail
      g.tube([52, 46, 57, 49, 57.5, 55, 54, 58.5], 1.8, 1, a, S);
      g.p([55.5, 56.6, 50.6, 60, 55.6, 61.2], a, S);
      // body
      const body = g.re(42.5, 37, 12, 8, 25, a, S);
      g.on(body, () => { g.e(43, 31, 6, 2, d); g.l(46, 36, 49, 40, .35, c); });
      g.e(48.5, 43.5, 7.5, 7.5, a, S);
      g.tube([45, 47.5, 41.5, 50.5, 40.5, 51.5], 2.6, 2.3, a, S);
      g.e(39.5, 51.6, 4.4, 2.2, a, S); K2.claws(g, 38, 53, 3, 4, 2, -1, b);
      g.e(31.5, 36, 7.5, 8, a, S);
      g.tube([30, 37.5, 27.5, 44.5, 29.5, 49.5], 2.9, 2.5, a, S);
      g.e(29.5, 50.4, 3.6, 2.2, a, S); K2.claws(g, 28.4, 51.8, 3, 4, 2.2, -1, b);
      // neck and head thrust out like a waterspout
      g.tube([31, 32, 23, 28.5, 16, 29.5], 5.2, 4.4, a, S);
      K2.zig(g, 31.5, 27.6, 21, 24.4, 3, 2.3, b, S);
      g.tube([16.5, 24, 19.5, 16.5, 25, 12.5], 1.8, .6, far(b, .2));
      K2.ear(g, 19, 27.5, 75, 7, 2.2, a, c);
      // rain pouring from the mouth
      const W = { mat: 'glow', oc: '#4a86c4' };
      g.tube([5.6, 36, 3.9, 39.5, 3.5, 49, 3.8, 57.5], 1.1, .8, f, W);
      g.e(3.9, 59.6, 2.7, 1.1, f, W);
      if (!g.small) { g.e(7.6, 56.6, .8, .9, f, W); g.e(7, 44, .7, 1, f, W); }
      const skull = g.e(13.5, 29.5, 7.5, 6.2, a, S);
      g.on(skull, () => g.e(16, 24.4, 4, 1.6, d));
      g.p([8, 35, 4, 37, 3.4, 39.2, 6, 40.4, 13, 39.5, 15.5, 35.5], a, S);
      if (!g.back) g.p([4.5, 33.6, 11, 33.6, 13.5, 36.8, 6, 37.6], '#3a1626', { shade: false });
      g.p([9, 26.5, 3, 29.5, 2.2, 32.5, 4, 34.2, 11, 34], a, S);
      if (!g.back) K2.zig(g, 4.4, 34.2, 10.6, 34, 3, 1.5, '#ffffff', { shade: false, bevel: .3 });
      g.tube([13.5, 24.5, 16.5, 18.5, 22.5, 15], 2, .6, b);
      g.eye(10.2, 29.8, 1.9, 'glow', { iris: e, side: -1, brow: 1 });
      g.eye(15.4, 29.2, 1.6, 'glow', { iris: e, side: 1, brow: 1 });
    }
  });

  // ---------------------------------------------------------------- Keyhaunt
  BEAST('keyhaunt', {
    pal: { a: '#8a8a9e', b: '#c4c4d4', c: '#4a4a5e', d: '#a8f0e0', e: '#161a28', f: '#c49c48', h: '#a8643c' }, keep: ['a', 'b', 'c', 'e', 'h'], sh: 150,
    draw(g0) {
      const g = tiltG(g0, -6, 32, 38);
      const { a, b, c, d, e, f, h } = g.P;
      const GL = { mat: 'glow', oc: mix(d, '#1a4a5a', .55) };
      // ghostly tail
      g.tube([32.5, 52, 30, 57.5, 33.5, 61, 38, 59.6], 3.8, .7, d, GL);
      // rattling chains: a dungeon key on one, a broken manacle on the other
      chain(g, [17.5, 37, 13.5, 34, 10, 32.6, 6.8, 33.8, 5.2, 37], a, e);
      g.l(4.6, 42.5, 3.4, 53, .9, f, { mat: 'metal' });
      g.p([3.9, 48.4, 7.2, 48.8, 7, 50.2, 5.6, 50, 5.5, 51, 6.9, 51.2, 6.7, 52.8, 3.4, 52.6], f, { mat: 'metal', bevel: .5 });
      const bow = g.c(4.9, 40.2, 2.6, f, { mat: 'metal' }); g.on(bow, () => g.c(4.9, 40.2, 1.1, e));
      chain(g, [47.5, 37, 51.5, 34.6, 55, 34.2, 58, 36.2, 59.2, 39.6, 58.8, 43.2], a, e);
      const cuff = g.c(58.4, 47.4, 3.3, a, { mat: 'metal' }); g.on(cuff, () => g.c(58.4, 47.4, 1.8, e));
      // shackle
      g.tube([23, 28, 22.6, 16.5, 26, 9.5, 32, 7, 38, 9.5, 41.4, 16.5, 41, 28], 2.9, 2.9, b, { mat: 'metal' });
      // old iron lock body
      const shape = [17, 28, 19, 25.5, 45, 25.5, 47, 28, 47.5, 41, 45, 48.5, 39, 53.5, 32, 55.5, 25, 53.5, 19, 48.5, 16.5, 41];
      g.p(shape.map((v, i) => i % 2 ? v + .8 : v + 2.4), c, { mat: 'metal' });
      const body = g.p(shape, a, { mat: 'metal', bevel: 2.6 });
      g.on(body, () => {
        g.p([15, 26.4, 49, 26.4, 49, 30.2, 15, 30.2], f);
        g.e(42.5, 50, 4, 2.6, h); g.e(19.5, 44, 2.2, 3.4, h); g.e(44.5, 33.5, 1.8, 1.3, h);
        g.l(22, 49, 25, 51.5, .35, c); g.l(38, 32.5, 41, 33.5, .35, c);
      });
      rivets(g, [[20, 28.3], [26, 28.3], [32, 28.3], [38, 28.3], [44, 28.3]], dk(f, .45));
      // keyhole plate; the keyhole glows when someone tells a lie
      g.c(32, 45.8, 5.6, f, { mat: 'metal' });
      flat(g, F => {
        F.fe(32, 44, 2.6, 2.6, e); F.fp([30.8, 45, 33.2, 45, 34.4, 50.4, 29.6, 50.4], e);
        F.fe(32, 44, 1.6, 1.6, d); F.fp([31.3, 45, 32.7, 45, 33.4, 49.6, 30.6, 49.6], d);
      });
      g.eye(25.2, 35.6, 3.1, 'hollow', { iris: d, side: -1, look: -.4 });
      g.eye(37.6, 35.2, 2.7, 'hollow', { iris: d, side: 1, look: -.4 });
    }
  });

  // ---------------------------------------------------------------- Coppet
  BEAST('coppet', {
    pal: { a: '#c8783e', b: '#f0b078', c: '#8a4a22', d: '#58b098', e: '#fff2b0' }, keep: ['e'], sh: 160,
    draw(g0) {
      const g = tiltG(g0, -7, 31.5, 58);
      const { a, b, c, d, e } = g.P;
      // legs
      g.l(35.5, 53, 36.5, 58, 1.5, far(c, .25)); g.e(37, 59.6, 3, 1.7, far(c, .25));
      g.l(28, 53.5, 27.5, 58, 1.6, c); g.e(27, 59.8, 3.2, 1.8, c);
      // far arm
      g.l(42, 43, 46.5, 46, 1.4, far(c, .25)); g.c(47, 46.4, 1.7, far(c, .25));
      // the penny: milled edge and a worn face
      const edge = g.e(34.6, 40, 12, 13.5, dk(a, .25), { mat: 'metal' });
      if (!g.small) g.on(edge, () => { for (let k = -5; k <= 5; k++) g.l(40, 40 + k * 2.3, 48, 40 + k * 2.3, .3, dk(a, .5)); });
      const face = g.e(31.5, 40, 12, 13.5, a, { mat: 'metal' });
      g.on(face, () => {
        g.e(38.2, 48.6, 3.4, 2.2, d); g.e(24.4, 31.6, 2.3, 1.6, d); g.e(40, 33.4, 1.5, 1.2, d);
        g.tube([22.8, 46.4, 24.4, 49.6, 28, 51.6], .4, .4, dk(a, .25)); g.tube([40.2, 46, 38.6, 49.4, 35, 51.4], .4, .4, dk(a, .25));
        g.e(31.5, 40, 10.2, 11.6, a); g.e(31.5, 40, 12, 13.5, b);
      });
      // near arm holding up a wish
      g.tube([20.5, 41, 16, 38.5, 13.5, 33.5], 1.5, 1.3, c); g.c(13.2, 32.8, 1.9, c);
      star4(g, 10.5, 25.4, 4, e, { oc: '#c89a3a' });
      if (!g.small) star4(g, 16.6, 22.2, 1.9, e, { oc: '#c89a3a' });
      g.eye(26.4, 39, 3.3, 'cute', { iris: '#2e9a84', side: -1 });
      g.eye(35.6, 38.6, 2.9, 'cute', { iris: '#2e9a84', side: 1 });
      g.mo('smile', 29.6, 45.4, 4.2);
      g.blush(22.6, 43.6, 1.6); g.blush(39.2, 43, 1.5);
    }
  });

  // ---------------------------------------------------------------- Sovrain
  BEAST('sovrain', {
    pal: { a: '#ecbc34', b: '#fff2a8', c: '#a87814', d: '#c8385e', e: '#8cdcff', f: '#fffaf2', h: '#2a2030' }, keep: ['f', 'h'], sh: 160,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      // royal mantle
      const mantle = g.p([12.5, 33, 51.5, 33, 56, 46, 52, 55, 46.5, 51.5, 42.5, 58.5, 37, 53.5, 32, 61, 27, 53.5, 21.5, 58.5, 17.5, 51.5, 12, 55, 8, 46], d);
      g.on(mantle, () => { for (const [x1, y1, x2, y2] of [[22, 47, 21.5, 57], [32, 48, 32, 59], [42, 47, 42.5, 57], [13, 44, 12, 53], [51, 44, 52, 53]]) g.l(x1, y1, x2, y2, .45, dk(d, .3)); });
      // far hand
      g.c(54.6, 33, 2.4, f);
      // the coin
      const edge = g.e(34.8, 29.5, 15, 15.8, dk(a, .22), { mat: 'metal' });
      if (!g.small) g.on(edge, () => { for (let k = -6; k <= 6; k++) g.l(42, 29.5 + k * 2.3, 52, 29.5 + k * 2.3, .3, dk(a, .5)); });
      const face = g.e(32, 29.5, 15, 15.8, a, { mat: 'metal' });
      g.on(face, () => {
        g.tube([20.4, 34, 22.6, 39, 27, 42.4], .45, .45, c); g.tube([43.6, 33.6, 41.4, 38.8, 37, 42.2], .45, .45, c);
        g.e(32, 29.5, 12.8, 13.6, a); g.e(32, 29.5, 15, 15.8, b);
      });
      // ermine collar
      const col = g.fur(32, 46, 13.6, 4.6, f, { n: 11, amp: .22, a0: 0, a1: 180, mat: 'fur', dk: '#d8cce0' });
      g.on(col, () => { for (const [x, y] of [[22, 46.4], [27, 48], [37, 48], [42, 46.4]]) g.e(x, y, .7, 1.1, h); });
      g.c(32, 46.4, 2, a, { mat: 'metal' }); g.c(32, 46.4, 1, d, { gloss: true });
      // crown
      g.e(31.6, 11.4, 9, 4, d);
      const crown = g.p([21, 14.5, 19.8, 6.5, 25, 11.2, 28.2, 3.8, 31.6, 10.4, 36, 2.6, 38.2, 9.6, 43.4, 4.2, 41.5, 11.5, 42.3, 15.6, 21.8, 18.8], a, { mat: 'metal' });
      g.on(crown, () => g.p([21, 15, 42, 12, 42.4, 15.8, 21.8, 19], c));
      for (const [x, y, col2] of [[19.8, 6.2, e], [28.2, 3.6, d], [36, 2.6, e], [43.4, 4, d]]) g.c(x, y, 1.5, col2, { gloss: true });
      rivets(g, [[26, 15.6], [31.6, 14.8], [37.2, 14]], b);
      // sceptre
      g.l(10.4, 47, 12.8, 22, .9, a, { mat: 'metal' });
      g.c(13, 19.6, 2.7, e, { gloss: true });
      g.c(11.6, 37.4, 2.6, f);
      // sparkles
      star4(g, 5.6, 26, 2.6, b, { oc: c }); star4(g, 56, 18.6, 3, b, { oc: c });
      if (!g.small) star4(g, 58, 43, 2, b, { oc: c });
      g.eye(25.8, 28, 3.2, 'sleepy', { iris: '#c8385e', lid: a, side: -1, lash: true });
      g.eye(36, 27.6, 2.8, 'sleepy', { iris: '#c8385e', lid: a, side: 1, lash: true });
      g.mo('smirk', 30, 35.6, 4.4);
      g.blush(22.4, 33.4, 1.6); g.blush(40.2, 32.8, 1.5);
    }
  });

  // ---------------------------------------------------------------- Kettlet
  BEAST('kettlet', {
    pal: { a: '#3e9068', c: '#22262e', d: '#e0b448', e: '#ff7a30', f: '#f4f8ff', h: '#ffd650' }, keep: ['c', 'd', 'f'], sh: 150,
    draw(g) {
      const { a, c, d, e, f, h } = g.P;
      const ST = { mat: 'glow', oc: '#9aa6c4' };
      // far legs
      g.l(31, 56, 31.5, 59, 1.9, far(c, .1)); g.l(43.5, 55, 44.5, 58.8, 1.9, far(c, .1));
      // pilot-light tail
      g.tube([46.5, 48, 52, 49, 55, 45.5, 54.5, 41], .9, .7, c);
      K2.flame(g, 54.3, 38.4, 6.5, 3, 8, e, h, '#fff6c8');
      // handle
      g.tube([24.5, 39, 24, 31, 29.5, 25.5, 38.5, 25.5, 44, 31, 43.5, 39], 1.6, 1.6, c, { gloss: true });
      // enamel body, hot at the base
      const body = g.e(34, 46.5, 13, 11, a, { mat: 'metal' });
      g.on(body, () => { g.e(34, 59, 9, 2.4, h); g.e(34, 58, 11.5, 3.6, e); });
      // near legs
      g.l(27.5, 56, 27, 59.2, 2.1, c); g.e(26.6, 60.1, 2.8, 1.6, c);
      g.l(40.5, 56, 41, 59.2, 2.1, c); g.e(41.2, 60.1, 2.8, 1.6, c);
      // lid and knob
      g.e(34, 36.2, 7.6, 2.5, d, { mat: 'metal' });
      g.c(34, 32.8, 2.1, c, { gloss: true });
      // steam and a whistle
      g.c(9.6, 21.4, 2.5, f, ST); g.c(6.6, 26.6, 3.5, f, ST); g.c(10, 31.6, 2.9, f, ST);
      // spout
      g.tube([25, 50, 19, 49, 14.5, 44, 13, 38.5], 3.3, 2.1, a, { mat: 'metal' });
      g.e(12.8, 37.6, 2.6, 1.5, d, { mat: 'metal' });
      flat(g, F => { F.fe(12.8, 37.4, 1.3, .7, '#1b1328'); F.fe(16.6, 30.4, 1.05, .85, '#1b1328'); F.fl(17.3, 30.2, 17.3, 26.2, .32, '#1b1328'); F.fl(17.3, 26.2, 19.2, 27.2, .4, '#1b1328'); });
      g.eye(28, 43.6, 2.7, 'happy', { side: -1 });
      g.eye(37, 43, 2.4, 'happy', { side: 1 });
      g.mo('smile', 33, 49.6, 3.4);
      g.blush(31.4, 47, 1.5); g.blush(40.6, 46.2, 1.4);
    }
  });

  // ---------------------------------------------------------------- Locomotor
  BEAST('locomotor', {
    pal: { a: '#2a6e4c', b: '#3e9264', c: '#1e2228', d: '#dcb244', e: '#ff7426', f: '#dfe3ee', h: '#b82a26', k: '#ffd650' }, keep: ['c', 'd', 'f'], sh: 150,
    draw(g) {
      const { a, b, c, d, e, f, h, k } = g.P;
      const SM = { mat: 'glow', oc: '#8088a0' }, steel = '#9aa0b2';
      // smoke streaming back from the funnel
      g.c(46.5, 7.4, 2.3, '#c8ccd8', SM); g.c(40.5, 5.6, 3.1, '#d4d8e2', SM); g.c(33.2, 6, 3.6, '#dfe3ee', SM); g.c(27, 7, 3.1, '#eceef6', SM);
      // tail: a coupling chain with a lit tuft
      g.tube([56, 33, 59.5, 31.5, 60.5, 27.5], 1, .8, c);
      K2.flame(g, 60.3, 24.6, 6.5, 2.7, 6, e, k, '#fff6c8');
      // far legs
      g.tube([21, 44, 18.5, 51, 20.5, 58], 2.8, 2.4, far(c, .05)); g.e(20.5, 59.8, 3.2, 1.7, far(steel, .3));
      g.tube([50, 44, 53, 51, 52, 58], 2.8, 2.4, far(c, .05)); g.e(52, 59.8, 3.2, 1.7, far(steel, .3));
      // funnel, dome and whistle
      g.p([21.6, 26, 22.4, 12.5, 28.2, 12.5, 29, 26], c, { bevel: 1.6 });
      g.p([20.8, 10, 29.8, 10, 29.4, 13.4, 21.2, 13.4], d, { mat: 'metal', bevel: 1 });
      g.e(38, 24.4, 3.8, 3.4, d, { mat: 'metal' });
      g.l(45.2, 25, 45.2, 20.6, .8, d, { mat: 'metal' }); g.c(45.2, 20, 1.3, d, { mat: 'metal' });
      g.c(48, 17, 1.9, f, SM);
      // boiler body
      const body = g.l(25, 34.6, 46.5, 35.4, 11, a, { mat: 'metal' });
      g.on(body, () => {
        for (const x of [29.5, 37, 44.5]) g.l(x, 20, x, 50, .7, d);
        g.p([8, 18, 21.5, 18, 21.5, 52, 8, 52], c);
      });
      // firebox door glowing at the rear
      const door = g.c(52, 34.5, 3.4, d, { mat: 'metal' }); g.on(door, () => g.c(52, 34.5, 2.2, e));
      // near legs
      g.tube([24, 47, 21.5, 53, 23.5, 58.5], 3.2, 2.7, c); g.e(23.5, 60, 3.6, 1.9, steel, { mat: 'metal' });
      g.tube([47.5, 48, 50.5, 53.5, 49, 58.5], 3, 2.6, c); g.e(49, 60, 3.4, 1.9, steel, { mat: 'metal' });
      // driving wheels at shoulder and hip, joined by a coupling rod
      const wheel = (x, y, r) => {
        const w = g.c(x, y, r, steel, { mat: 'metal' });
        g.on(w, () => { g.c(x, y, r * .27, d); if (!g.small) for (let i = 0; i < 6; i++) { const [px, py] = K.pt(x, y, i * 60 + 15, r * .8); g.l(x, y, px, py, .35, dk(h, .4)); } g.c(x, y, r * .8, h); });
      };
      wheel(24.5, 43, 6.2); wheel(47.5, 43.5, 5.6);
      g.l(24.5, 45.4, 47.5, 45.8, 1, f, { mat: 'metal' });
      rivets(g, [[24.5, 45.4], [47.5, 45.8]], c);
      // bull's head, lowered to charge
      g.tube([17, 29.5, 19, 23.5, 16, 18.5], 2, .6, far(f, .25));
      K2.ear(g, 20.5, 31.5, 62, 5.5, 2, a);
      const head = g.e(13.5, 36.5, 9, 8.2, a, { mat: 'metal' });
      g.on(head, () => g.e(13, 30, 5.5, 1.8, b));
      g.c(3.4, 48.4, 1.5, f, SM);
      g.e(8.4, 43, 6, 4.5, c, { gloss: true });
      g.tube([5.8, 46.8, 5.4, 49.8, 7.9, 51, 10.4, 49.8, 10, 46.8], .75, .75, d, { mat: 'metal' });
      g.tube([9, 30.5, 4.6, 28.5, 2.8, 22.5], 2.2, .6, f, { mat: 'metal' });
      g.eye(10, 35.6, 2.5, 'glow', { iris: '#ffb030', side: -1, brow: 1 });
      g.eye(17, 35.2, 2.1, 'glow', { iris: '#ffb030', side: 1, brow: 1 });
      flat(g, F => { F.fe(5.8, 42.8, .85, .95, e); F.fe(9.8, 42.4, .85, .95, e); });
    }
  });

  // ---------------------------------------------------------------- Postling
  BEAST('postling', {
    pal: { a: '#d82c2c', b: '#f46a5c', c: '#1e1e26', d: '#f0cc48', e: '#fff8f0', f: '#b48cf0' }, keep: ['c', 'd', 'e'], sh: 120,
    draw(g0) {
      const g = tiltG(g0, -5, 32, 58);
      const { a, b, c, d, e, f } = g.P;
      const PS = { oc: '#6a4ab0' };
      // a letter floating along behind it
      envelope(g, 51, 31.5, 9.4, 6.6, -16, e, a);
      star4(g, 46.4, 41.4, 2, f, PS); if (!g.small) star4(g, 57, 40, 1.5, f, PS);
      // feet
      g.l(36.5, 55, 37, 58.4, 1.8, c); g.e(37.6, 59.7, 3.4, 1.9, c);
      g.l(28, 55, 27.5, 58.4, 1.9, c); g.e(27.2, 59.8, 3.6, 2, c);
      // pillar body and black base
      const body = g.l(32, 37, 32, 46, 10, a, { mat: 'metal' });
      g.on(body, () => g.l(25.2, 34, 25.2, 50, .55, b));
      g.p([21.4, 51, 42.6, 51, 43.4, 57, 20.6, 57], c, { bevel: 1 });
      // domed cap
      const cap = g.e(32, 30, 12.2, 5.2, a, { mat: 'metal' });
      g.on(cap, () => { g.e(32, 28.8, 12.8, 4.8, a); g.e(32, 30, 12.2, 5.2, dk(a, .3)); });
      g.c(32, 24.6, 1.5, d, { mat: 'metal' });
      // posting slot, mid-gobble
      flat(g, F => F.fp([23.6, 41.2, 37.4, 40.8, 37.4, 43.6, 23.6, 44], '#1b1328'));
      if (!g.back) { const let1 = g.p([25.4, 42.6, 35.4, 42, 36.8, 48, 26.6, 49], e, { bevel: .7 }); g.on(let1, () => { g.c(31.4, 46, 1.1, a); g.l(26.6, 49, 31.2, 45.4, .32, '#b4aabe'); g.l(36.8, 48, 31.2, 45.4, .32, '#b4aabe'); }); }
      g.eye(27, 37.2, 2.5, 'button', { side: -1 });
      g.eye(35.4, 36.8, 2.2, 'button', { side: 1 });
      g.blush(23.6, 40, 1.4); g.blush(38.8, 39.4, 1.3);
    }
  });

  // ---------------------------------------------------------------- Pillarbox
  BEAST('pillarbox', {
    pal: { a: '#cc2424', b: '#f0564c', c: '#1c1c24', d: '#e8c248', e: '#fff8f0', f: '#b48cf0', h: '#6a9c58' }, keep: ['c', 'd', 'e', 'h'], sh: 120,
    draw(g) {
      const { a, b, c, d, e, f, h } = g.P;
      const PS = { oc: '#6a4ab0' }, ring = { mat: 'glow', oc: '#7a56c8' };
      // far side of the orbit: letters circling by thought alone
      g.tube(arcPts(32, 31, 26, 8, -10, 185, 355, 10), .45, .45, f, ring);
      envelope(g, 9.5, 21.5, 8, 5.6, -22, far(e, .18));
      envelope(g, 54.5, 14, 7.6, 5.2, 14, far(e, .18));
      // pillar
      const body = g.l(32, 22, 32, 45, 13, a, { mat: 'metal' });
      g.on(body, () => {
        for (const y of [38.6, 40.3, 42]) g.l(26.6, y, y > 41 ? 31.5 : 34, y, .3, '#8a8494');
        g.p([25, 36.6, 35.6, 36.6, 35.6, 43.8, 25, 43.8], e);
        g.p([27.4, 50.4, 26.9, 46.6, 28.8, 48.4, 30.3, 46, 31.8, 48.4, 33.7, 46.6, 33.2, 50.4], d);
        g.e(22, 53, 3.6, 1.8, h); g.e(41.5, 53.4, 3, 1.5, h);
        g.l(23.6, 20, 23.6, 51, .6, b);
        g.l(38.6, 33.5, 38.6, 52, .35, dk(a, .3));
      });
      g.p([17, 53.5, 47, 53.5, 48.6, 61, 15.4, 61], c, { bevel: 1.2 });
      // slot with its hood
      flat(g, F => F.fp([23, 27.4, 39.4, 27.4, 39.4, 30.6, 23, 30.6], '#1b1328'));
      if (!g.back) { g.l(22.6, 26.4, 39.8, 26.4, .9, b, { mat: 'metal' }); g.p([27.2, 28.8, 35, 28.4, 35.6, 32, 27.8, 32.6], e, { bevel: .6 }); }
      // fluted cap and finial
      const dome = g.e(32, 11, 12.4, 6, a, { mat: 'metal' });
      g.on(dome, () => { for (const x of [24.5, 32, 39.5]) g.l(32, 4.6, x, 15, .35, dk(a, .3)); });
      g.e(32, 14.8, 15, 3.4, a, { mat: 'metal' });
      g.c(32, 4.6, 2, d, { mat: 'metal' });
      // near side of the orbit
      g.tube(arcPts(32, 31, 26, 8, -10, 5, 60, 5), .45, .45, f, ring);
      g.tube(arcPts(32, 31, 26, 8, -10, 120, 175, 5), .45, .45, f, ring);
      envelope(g, 54.5, 39, 9, 6.4, -14, e, a);
      envelope(g, 9.5, 43.5, 9, 6.4, 12, e, a);
      star4(g, 51.5, 27, 2, f, PS); if (!g.small) { star4(g, 13, 31.5, 1.7, f, PS); star4(g, 57.5, 48, 1.4, f, PS); }
      // reading spectacles
      flat(g, F => { F.fe(26.4, 21.4, 4.1, 4.5, d); F.fe(35.8, 21.1, 3.7, 4.1, d); F.fl(29.8, 20.6, 32.6, 20.4, .45, d); });
      g.eye(26.4, 21.6, 2.7, 'round', { iris: '#8a5ae0', side: -1, look: .1 });
      g.eye(35.8, 21.3, 2.4, 'round', { iris: '#8a5ae0', side: 1, look: .1 });
    }
  });
})();