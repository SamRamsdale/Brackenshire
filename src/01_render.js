// ---- render ----
// ================= CREATURE SPRITE RENDERER =================
// Beasties are composed from simple shapes in a 64x64 design space (the draw functions in the species files).
// Every pixel remembers which shape owns it and how much light reaches it. A finishing pass then turns that
// into handheld-style pixel art: colour ramps with warm lights and cool shadows, contact shadows where one part
// sits in front of another, a dark outer outline, softer inner contour lines and tidy single-colour clusters.
const SPR = {};
const INK = '#1b1328';
const LIGHT = (() => { const l = [-0.55, -0.72, 0.58], m = Math.hypot(...l); return l.map(v => v / m); })();
const RAMPC = {};
function rampOf(col, o = {}) {
  const k = col + '|' + (o.lt || '') + '|' + (o.dk || '') + '|' + (o.oc || '');
  if (RAMPC[k]) return RAMPC[k];
  const r = { base: col };
  r.lt = o.lt || mix(col, '#fff6dc', .34);
  r.hi = mix(r.lt, '#ffffff', .6);
  r.sh = o.dk || mix(col, '#2e2160', .33);
  r.dp = mix(r.sh, '#1e1444', .34);
  r.il = mix(r.dp, INK, .5);
  r.ol = o.oc || mix(col, '#120a1e', .8);
  r.t = [r.dp, r.sh, r.base, r.lt, r.hi];
  return (RAMPC[k] = r);
}
// light thresholds per material: [highlight, light, base, shade] (below shade = deep shade)
const MATS = { soft: [9, .64, .1, -.36], gloss: [.86, .56, .06, -.34], metal: [.8, .46, .1, -.18], fur: [9, .6, .06, -.4], glow: [9, .45, -9, -9], stone: [9, .6, .16, -.3] };
const nrm = (x, y, z) => { const m = Math.hypot(x, y, z) || 1; return x / m * LIGHT[0] + y / m * LIGHT[1] + z / m * LIGHT[2]; };
const segDist = (u, v, x1, y1, x2, y2) => { const dx = x2 - x1, dy = y2 - y1, l = dx * dx + dy * dy || 1; let t = ((u - x1) * dx + (v - y1) * dy) / l; t = Math.max(0, Math.min(1, t)); const X = u - (x1 + t * dx), Y = v - (y1 + t * dy); return [Math.sqrt(X * X + Y * Y), X, Y, t]; };

function makeG(N, pal, opts = {}) {
  const U = N / 64, NN = N * N;
  const pid = new Int16Array(NN), lum = new Float32Array(NN);
  const parts = [];
  let clip = null, curGroup = 0, groupSeq = 0, markMode = false;
  const g = { U, N, P: pal, back: !!opts.back, small: N < 40, tiny: N < 30, parts };
  const px1 = 1 / U; // one pixel, in design units

  function part(col, o = {}, kind = {}) {
    const mark = kind.mark || o.ring === false || markMode;
    const p = { id: parts.length + 1, col, o, mark, feat: !!kind.feat, flat: !!kind.feat || o.shade === false, noLine: o.line === false || !!kind.feat,
      group: o.g !== undefined ? o.g : curGroup, mat: MATS[o.mat] || (o.gloss ? MATS.gloss : MATS.soft), ramp: kind.feat ? null : rampOf(col, o) };
    parts.push(p); return p;
  }
  function fill(bb, hit, p) {
    const x0 = Math.max(0, Math.floor(bb[0] * U) - 1), x1 = Math.min(N - 1, Math.ceil(bb[2] * U) + 1);
    const y0 = Math.max(0, Math.floor(bb[1] * U) - 1), y1 = Math.min(N - 1, Math.ceil(bb[3] * U) + 1);
    for (let py = y0; py <= y1; py++) for (let px = x0; px <= x1; px++) {
      const u = (px + .5) / U, v = (py + .5) / U, n = hit(u, v); if (!n) continue;
      const i = py * N + px;
      if (clip && !clip.has(pid[i])) continue;
      if (!(p.mark && pid[i]) && !p.feat) lum[i] = n === true ? .3 : nrm(n[0], n[1], n[2] * (p.o.depth || 1));
      pid[i] = p.id;
    }
    return p.id;
  }
  // ---------- shapes ----------
  const ellHit = (cx, cy, rx, ry, o = {}) => {
    const fur = o.fur, n = fur ? (fur.n || 9) : 0, amp = fur ? (fur.amp ?? .16) : 0, a0 = fur && fur.a0 !== undefined ? fur.a0 : -999, a1 = fur && fur.a1 !== undefined ? fur.a1 : 999, ph = fur ? (fur.ph || 0) : 0;
    return (u, v) => {
      const dx = (u - cx) / rx, dy = (v - cy) / ry; let d2 = dx * dx + dy * dy;
      let lim = 1;
      if (fur) { let a = Math.atan2(dy, dx) * 180 / Math.PI; if (a0 <= a1 ? (a >= a0 && a <= a1) : (a >= a0 || a <= a1)) { const t = ((a + 180) / 360 * n + ph) % 1; lim = 1 + amp * (1 - Math.abs(t * 2 - 1)) * 2 - amp * .5; } }
      if (d2 > lim * lim) return null;
      const k = d2 / (lim * lim); return [dx, dy, Math.sqrt(Math.max(0, 1 - k))];
    };
  };
  g.e = (cx, cy, rx, ry, col, o = {}) => { const p = part(col, o); const m = o.fur ? 1 + (o.fur.amp ?? .16) * 1.5 : 1; return fill([cx - rx * m, cy - ry * m, cx + rx * m, cy + ry * m], ellHit(cx, cy, rx, ry, o), p); };
  g.c = (cx, cy, r, col, o) => g.e(cx, cy, r, r, col, o);
  g.fur = (cx, cy, rx, ry, col, o = {}) => g.e(cx, cy, rx, ry, col, { ...o, fur: { n: o.n, amp: o.amp, a0: o.a0, a1: o.a1, ph: o.ph } });
  g.re = (cx, cy, rx, ry, ang, col, o = {}) => { // rotated ellipse; ang in degrees, clockwise
    const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), p = part(col, o), R = Math.max(rx, ry);
    return fill([cx - R, cy - R, cx + R, cy + R], (u, v) => {
      const du = u - cx, dv = v - cy, lx = (du * ca + dv * sa) / rx, ly = (-du * sa + dv * ca) / ry, d2 = lx * lx + ly * ly;
      if (d2 > 1) return null; return [lx * ca - ly * sa, lx * sa + ly * ca, Math.sqrt(1 - d2)];
    }, p);
  };
  g.l = (x1, y1, x2, y2, r, col, o = {}) => {
    const p = part(col, o);
    return fill([Math.min(x1, x2) - r, Math.min(y1, y2) - r, Math.max(x1, x2) + r, Math.max(y1, y2) + r], (u, v) => {
      const [d, X, Y] = segDist(u, v, x1, y1, x2, y2); if (d > r) return null; const k = d / r; return [X / r, Y / r, Math.sqrt(Math.max(0, 1 - k * k))];
    }, p);
  };
  g.tube = (pts, r0, r1, col, o = {}) => { // smooth tapered stroke through control points (tails, tentacles, horns, necks)
    const P = []; for (let i = 0; i < pts.length; i += 2) P.push([pts[i], pts[i + 1]]);
    const S = []; const at = (i) => P[Math.max(0, Math.min(P.length - 1, i))];
    for (let i = 0; i < P.length - 1; i++) { const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2); for (let k = 0; k < 6; k++) { const t = k / 6, t2 = t * t, t3 = t2 * t; S.push([.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); } }
    S.push(P[P.length - 1]);
    let L = 0; const acc = [0]; for (let i = 1; i < S.length; i++) { L += Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); acc.push(L); }
    const ease = o.taper || (t => t), rad = i => r0 + (r1 - r0) * ease(acc[i] / (L || 1));
    const segs = []; for (let i = 0; i < S.length - 1; i++) segs.push([S[i][0], S[i][1], S[i + 1][0], S[i + 1][1], rad(i), rad(i + 1)]);
    const R = Math.max(r0, r1); const xs = S.map(s => s[0]), ys = S.map(s => s[1]);
    const p = part(col, o);
    return fill([Math.min(...xs) - R, Math.min(...ys) - R, Math.max(...xs) + R, Math.max(...ys) + R], (u, v) => {
      let best = null, bs = 1e9;
      for (const [ax, ay, bx, by, ra, rb] of segs) { const [d, X, Y, t] = segDist(u, v, ax, ay, bx, by), r = ra + (rb - ra) * t; if (d <= r && d - r < bs) { bs = d - r; const k = d / r; best = [X / r, Y / r, Math.sqrt(Math.max(0, 1 - k * k))]; } }
      return best;
    }, p);
  };
  g.p = (pts, col, o = {}) => {
    const xs = [], ys = []; for (let i = 0; i < pts.length; i += 2) { xs.push(pts[i]); ys.push(pts[i + 1]); }
    const n = xs.length, bx0 = Math.min(...xs), by0 = Math.min(...ys), bx1 = Math.max(...xs), by1 = Math.max(...ys);
    const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, hw = Math.max(.5, (bx1 - bx0) / 2), hh = Math.max(.5, (by1 - by0) / 2);
    const bev = o.bevel ?? Math.max(1.1, Math.min(3.2, Math.min(hw, hh) * .5));
    const p = part(col, o);
    return fill([bx0, by0, bx1, by1], (u, v) => {
      let c = false; for (let i = 0, j = n - 1; i < n; j = i++) if (((ys[i] > v) !== (ys[j] > v)) && (u < (xs[j] - xs[i]) * (v - ys[i]) / (ys[j] - ys[i]) + xs[i])) c = !c;
      if (!c) return null;
      let bd = 1e9, bX = 0, bY = 0; for (let i = 0, j = n - 1; i < n; j = i++) { const [d, X, Y] = segDist(u, v, xs[j], ys[j], xs[i], ys[i]); if (d < bd) { bd = d; bX = -X; bY = -Y; } }
      let nx = (u - cx) / hw * .32, ny = (v - cy) / hh * .32, nz = 1;
      if (bd < bev) { const s = 1 - bd / bev, m = Math.hypot(bX, bY) || 1; nx += bX / m * s; ny += bY / m * s; nz = Math.sqrt(Math.max(0, 1 - s * s)); }
      return [nx, ny, nz];
    }, p);
  };
  // ---------- flat features (eyes, mouths, noses, marks) ----------
  const F = (col, noEdge) => { const p = part(col, {}, { feat: true }); if (noEdge) p.noEdge = true; return p; };
  const fe = (cx, cy, rx, ry, col) => { const p = F(col); return fill([cx - rx, cy - ry, cx + rx, cy + ry], (u, v) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 <= 1 ? true : null, p); };
  const fl = (x1, y1, x2, y2, r, col, noEdge) => { const p = F(col, noEdge); return fill([Math.min(x1, x2) - r, Math.min(y1, y2) - r, Math.max(x1, x2) + r, Math.max(y1, y2) + r], (u, v) => segDist(u, v, x1, y1, x2, y2)[0] <= r ? true : null, p); };
  const fchain = (pts, r, col) => { for (let i = 0; i + 3 < pts.length; i += 2) fl(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], r, col); };
  const fp = (pts, col) => { const xs = [], ys = []; for (let i = 0; i < pts.length; i += 2) { xs.push(pts[i]); ys.push(pts[i + 1]); } const n = xs.length, p = F(col);
    return fill([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], (u, v) => { let c = false; for (let i = 0, j = n - 1; i < n; j = i++) if (((ys[i] > v) !== (ys[j] > v)) && (u < (xs[j] - xs[i]) * (v - ys[i]) / (ys[j] - ys[i]) + xs[i])) c = !c; return c ? true : null; }, p); };
  const fpx = (x, y, col) => { const X = Math.floor(x * U), Y = Math.floor(y * U); if (X < 0 || Y < 0 || X >= N || Y >= N) return; const p = F(col); pid[Y * N + X] = p.id; };
  g.dot = (x, y, r, col) => { const rp = Math.max(0, Math.round(r * U) - 1), X = Math.floor(x * U), Y = Math.floor(y * U), p = F(col);
    for (let yy = -rp; yy <= rp; yy++) for (let xx = -rp; xx <= rp; xx++) { if (rp > 1 && xx * xx + yy * yy > rp * rp + 1) continue; const a = X + xx, b = Y + yy; if (a >= 0 && b >= 0 && a < N && b < N && (!clip || clip.has(pid[b * N + a]))) pid[b * N + a] = p.id; }
    return p.id; };
  g.feat = { fe, fl, fp, fpx, fchain };
  const TH = () => Math.max(.42, px1 * .95); // one-pixel-ish line thickness in units

  // ---------- eyes ----------
  // types: cute bead dot round sharp angry sleepy happy closed slit glow compound button star hollow wink(one happy)
  g.eye = (x, y, r = 3, type = 'cute', o = {}) => {
    if (g.back) return;
    if (type === 'cool') type = o.sc && o.sc !== '#fffaf0' ? 'glowcool' : 'sharp';
    const s = o.side || -1, look = o.look ?? -.35, iris = o.iris || o.pupil && o.pupil !== '#221a30' && o.pupil || '#5a3a8a', th = TH(), sc = o.sc && o.sc !== '#fffaf0' ? o.sc : '#fbf8ee';
    if (g.tiny) { if (type === 'happy' || type === 'closed') { fl(x - r * .7, y, x + r * .7, y, th, INK); return; } fe(x, y, Math.max(px1 * .6, r * .5), Math.max(px1 * .9, r * .75), type === 'glow' || type === 'glowcool' || type === 'hollow' ? (o.iris || '#8af0ff') : INK); return; }
    const glint = (gx, gy, gr) => { if (gr * U < .9) fpx(gx, gy, '#ffffff'); else fe(gx, gy, gr, gr * 1.1, '#ffffff'); };
    const brow = () => { if (o.brow === undefined || o.brow === false || typeof o.brow === 'string' && type !== 'sharp') return; const b = typeof o.brow === 'number' ? o.brow : 1, bc = o.browCol || (typeof o.brow === 'string' ? o.brow : INK);
      fl(x + s * r * 1.15, y - r * 1.35 - b * r * .25, x - s * r * .95, y - r * 1.25 + b * r * .35, th * 1.15, bc); };
    const lashes = () => { if (!o.lash) return; fl(x + s * r * .85, y - r * .7, x + s * r * 1.35, y - r * 1.05, th * .8, INK); fl(x + s * r * .55, y - r * .95, x + s * r * .85, y - r * 1.45, th * .8, INK); };
    switch (type) {
      case 'bead': fe(x, y, r * .6, r * .78, INK); glint(x - r * .2, y - r * .32, r * .18); break;
      case 'dot': fe(x, y, Math.max(px1 * .7, r * .42), Math.max(px1 * .9, r * .52), INK); break;
      case 'cute': {
        fe(x, y, r * .74, r, INK);
        fe(x - r * .05, y + r * .36, r * .5, r * .48, mix(INK, iris, .7));
        fe(x - r * .05, y + r * .5, r * .3, r * .26, mix(INK, lt(iris, .4), .75));
        glint(x - r * .24, y - r * .36, r * .3); if (r * U > 3) fpx(x + r * .24, y + r * .34, '#e8e4ff');
        break;
      }
      case 'round': case 'angry': case 'sleepy': case 'star': {
        fe(x, y - th * .4, r * .92 + th, r + th * 1.4, INK);
        fe(x, y, r * .92, r, sc);
        const ix = x + look * r * .22, iy = y + r * .1;
        fe(ix, iy, r * .7, r * .8, iris); fe(ix, iy + r * .3, r * .5, r * .4, lt(iris, .3)); fe(ix, iy - r * .38, r * .62, r * .34, dk(iris, .25));
        fe(ix, iy - r * .02, r * .34, r * .42, INK);
        if (type === 'star') { fl(ix - r * .34, iy - r * .38, ix - r * .34, iy + r * .02, th * .7, '#ffffff'); fl(ix - r * .54, iy - r * .18, ix - r * .14, iy - r * .18, th * .7, '#ffffff'); }
        else glint(ix - r * .24, iy - r * .3, r * .17);
        if (type === 'angry') { const lid = o.lid || g.P.a; fp([x - r * 1.3, y - r * 1.4, x + r * 1.3, y - r * 1.4, x + r * 1.3, y - r * (.9 + s * .45), x - r * 1.3, y - r * (.9 - s * .45)], lid); fl(x - r * 1.0, y - r * (.72 - s * .36), x + r * 1.0, y - r * (.72 + s * .36), th * 1.1, INK); }
        if (type === 'sleepy') { const lid = o.lid || g.P.a; fp([x - r * 1.2, y - r * 1.5, x + r * 1.2, y - r * 1.5, x + r * 1.2, y - r * .05, x - r * 1.2, y - r * .05], lid); fl(x - r * .92, y - r * .02, x + r * .92, y - r * .02, th * 1.1, INK); }
        brow(); lashes(); break;
      }
      case 'sharp': { // almond eye; the upper lid slants down toward the inner corner
        const oxr = x + s * r * 1.1, ixr = x - s * r * 1.0;
        const pts = [oxr, y - r * .42, x + s * r * .1, y - r * .78, ixr, y + r * .06, x - s * r * .1, y + r * .62];
        const ring = []; for (let i = 0; i < pts.length; i += 2) { const dx = pts[i] - x, dy = pts[i + 1] - y, m = Math.hypot(dx, dy) || 1; ring.push(pts[i] + dx / m * th * 1.1, pts[i + 1] + dy / m * th * 1.1 - (dy < 0 ? th * .6 : 0)); }
        fp(ring, INK); fp(pts, sc);
        const ix = x - s * r * .18 + look * r * .15, iy = y + r * .02;
        fe(ix, iy, r * .44, r * .58, iris); fe(ix, iy + r * .2, r * .3, r * .28, lt(iris, .3));
        if (o.slit) fe(ix, iy, r * .12, r * .5, INK); else fe(ix, iy, r * .22, r * .3, INK);
        glint(ix - r * .16, iy - r * .24, r * .13);
        fchain([oxr, y - r * .45, x + s * r * .1, y - r * .82, ixr, y + r * .02], th * 1.05, INK);
        brow(); lashes(); break;
      }
      case 'happy': fchain([x - r * .95, y + r * .3, x - r * .5, y - r * .32, x, y - r * .5, x + r * .5, y - r * .32, x + r * .95, y + r * .3], th * 1.15, INK); lashes(); break;
      case 'closed': fchain([x - r * .9, y - r * .1, x - r * .4, y + r * .3, x + r * .4, y + r * .3, x + r * .9, y - r * .1], th * 1.1, INK); lashes(); break;
      case 'slit': {
        fe(x, y - th * .3, r * .9 + th, r + th * 1.3, INK); fe(x, y, r * .9, r, o.sc || '#f2cc3a'); fe(x, y + r * .3, r * .62, r * .5, lt(o.sc || '#f2cc3a', .35));
        fe(x + look * r * .25, y, r * .16, r * .82, INK); glint(x - r * .42, y - r * .42, r * .16); brow(); break;
      }
      case 'glow': case 'glowcool': {
        const gc = o.iris || (type === 'glowcool' ? sc : '#8af0ff');
        if (type === 'glowcool') { const oxr = x + s * r * 1.1, ixr = x - s * r * 1.0; fp([oxr, y - r * .55, x + s * r * .1, y - r * .9, ixr, y - r * .05, x - s * r * .1, y + r * .7], INK); fp([oxr - s * th, y - r * .42, x + s * r * .1, y - r * .72, ixr + s * th, y + r * .02, x - s * r * .1, y + r * .5], gc); fe(x + s * r * .1, y - r * .1, r * .4, r * .28, lt(gc, .6)); }
        else { fe(x, y, r * .82 + th, r + th, INK); fe(x, y, r * .82, r, gc); fe(x - r * .12, y - r * .15, r * .45, r * .5, lt(gc, .55)); glint(x - r * .3, y - r * .45, r * .14); }
        brow(); break;
      }
      case 'compound': {
        const c = o.iris || '#4a2a6a';
        fe(x, y, r * 1.05 + th, r * 1.2 + th, INK); fe(x, y, r * 1.05, r * 1.2, c);
        for (let yy = -r; yy <= r; yy += 1.5) for (let xx = -r; xx <= r; xx += 1.5) { const ox = xx + ((Math.round(yy / 1.5) & 1) ? .75 : 0); if ((ox / (r * .95)) ** 2 + (yy / (r * 1.1)) ** 2 < 1) fpx(x + ox, y + yy, lt(c, .22)); }
        fe(x - r * .38, y - r * .5, r * .32, r * .24, lt(c, .7)); break;
      }
      case 'button': fe(x, y, r * .8, r * .8, INK); fe(x - r * .22, y - r * .22, r * .26, r * .26, '#ffffff'); fpx(x + r * .3, y + r * .3, '#8a8aa8'); break;
      case 'hollow': fe(x, y, r * .78, r, INK); fe(x + look * r * .1, y + r * .12, r * .3, r * .34, o.iris || '#ffe070'); break;
      default: fe(x, y, r * .74, r, INK); glint(x - r * .24, y - r * .36, r * .3);
    }
  };
  g.eyes = (x1, x2, y, r, type, o = {}) => { g.eye(x1, y, r, type, { ...o, side: -1 }); g.eye(x2, y + (o.dy || 0), r * (o.far || 1), type, { ...o, side: 1 }); };
  g.visor = (x1, x2, y, h, col) => { if (g.back) return; fe((x1 + x2) / 2, y, (x2 - x1) / 2 + TH(), h / 2 + TH(), INK); fe((x1 + x2) / 2, y, (x2 - x1) / 2, h / 2, col); fe((x1 + x2) / 2 - (x2 - x1) * .15, y - h * .15, (x2 - x1) * .25, h * .18, lt(col, .6)); };
  // ---------- mouths / noses / cheeks ----------
  g.mo = (type, x, y, w = 4, o = {}) => {
    if (g.back || g.tiny) return;
    const th = TH(), dark = o.col || '#4a1628', tongue = o.tongue || '#f07a92';
    const fang = (fx, fy, fw, fh) => { fp([fx - fw / 2 - th * .6, fy - th * .3, fx + fw / 2 + th * .6, fy - th * .3, fx, fy + fh + th * .8], INK); fp([fx - fw / 2, fy, fx + fw / 2, fy, fx, fy + fh], '#ffffff'); };
    switch (type) {
      case 'line': fl(x - w / 2, y, x + w / 2, y, th, INK); break;
      case 'smile': fchain([x - w / 2, y - w * .14, x - w * .22, y + w * .12, x + w * .22, y + w * .12, x + w / 2, y - w * .14], th, INK); break;
      case 'smirk': fchain([x - w / 2, y - w * .02, x - w * .1, y + w * .1, x + w * .3, y + w * .02, x + w / 2, y - w * .2], th, INK); break;
      case 'frown': fchain([x - w / 2, y + w * .14, x - w * .22, y - w * .1, x + w * .22, y - w * .1, x + w / 2, y + w * .14], th, INK); break;
      case 'cat': fchain([x - w / 2, y - w * .12, x - w / 4, y + w * .14, x, y - w * .04, x + w / 4, y + w * .14, x + w / 2, y - w * .12], th, INK); break;
      case 'fang': fchain([x - w / 2, y - w * .14, x - w * .22, y + w * .12, x + w * .22, y + w * .12, x + w / 2, y - w * .14], th, INK); fang(x + (o.fx ?? w * .18), y + w * .1, w * .2, w * .3); break;
      case 'fangs': fchain([x - w / 2, y - w * .12, x, y + w * .1, x + w / 2, y - w * .12], th, INK); fang(x - w * .24, y + w * .02, w * .2, w * .32); fang(x + w * .24, y + w * .02, w * .2, w * .32); break;
      case 'open': case 'roar': {
        const h = o.h || w * (type === 'roar' ? .8 : .55);
        fp([x - w / 2 - th, y - th, x + w / 2 + th, y - th, x + w * .38 + th, y + h * .62, x, y + h + th, x - w * .38 - th, y + h * .62], INK);
        fp([x - w / 2, y, x + w / 2, y, x + w * .36, y + h * .6, x, y + h, x - w * .36, y + h * .6], dark);
        fe(x + w * .06, y + h * .74, w * .28, h * .28, tongue);
        if (type === 'roar' || o.fangs) { fp([x - w * .42, y, x - w * .22, y, x - w * .32, y + h * .38], '#ffffff'); fp([x + w * .22, y, x + w * .42, y, x + w * .32, y + h * .38], '#ffffff'); }
        break;
      }
      case 'grin': { const h = o.h || w * .38; fp([x - w / 2 - th, y - th, x + w / 2 + th, y - th, x + w * .4 + th, y + h + th, x - w * .4 - th, y + h + th], INK); fp([x - w / 2, y, x + w / 2, y, x + w * .4, y + h, x - w * .4, y + h], '#ffffff'); fl(x - w * .44, y + h * .5, x + w * .44, y + h * .5, th * .6, '#8a8a9a'); for (let i = 1; i < 4; i++) fl(x - w / 2 + w * i / 4, y, x - w / 2 + w * i / 4, y + h, th * .5, '#8a8a9a'); break; }
      case 'teeth': { const h = o.h || w * .45; fe(x, y + h * .5, w / 2 + th, h / 2 + th, INK); fe(x, y + h * .5, w / 2, h / 2, dark); for (let i = 0; i < 4; i++) { const tx = x - w * .36 + i * w * .24; fp([tx - w * .09, y + h * .1, tx + w * .09, y + h * .1, tx, y + h * .52], '#ffffff'); fp([tx - w * .09 + w * .12, y + h * .9, tx + w * .09 + w * .12, y + h * .9, tx + w * .12, y + h * .5], '#ffffff'); } break; }
      case 'o': fe(x, y, w * .3 + th, w * .36 + th, INK); fe(x, y, w * .3, w * .36, dark); break;
      case 'tongue': fchain([x - w / 2, y - w * .1, x, y + w * .1, x + w / 2, y - w * .1], th, INK); fe(x + w * .12, y + w * .3, w * .2 + th, w * .24 + th, INK); fe(x + w * .12, y + w * .3, w * .2, w * .24, tongue); break;
      case 'beak': { const d = o.dir || -1, c1 = o.c1 || '#f4b030', c2 = o.c2 || '#d07818'; fp([x - d * w * .2, y - w * .35, x + d * w, y + w * .05, x - d * w * .2, y + w * .2], c1); fp([x - d * w * .2, y + w * .05, x + d * w * .8, y + w * .12, x - d * w * .2, y + w * .42], c2); fl(x - d * w * .2, y + w * .06, x + d * w * .75, y + w * .08, th * .7, INK); break; }
    }
  };
  g.mouth = (x1, y1, x2, y2) => { if (!g.back && !g.tiny) fl(x1, y1, x2, y2, TH(), INK); };
  g.nose = (x, y, type = 'dot', o = {}) => {
    if (g.back || g.tiny) return; const k = o.s || 1;
    switch (type) {
      case 'button': fe(x, y, 1.35 * k, 1.05 * k, INK); fe(x - .45 * k, y - .38 * k, .4 * k, .3 * k, '#a8a4c0'); break;
      case 'pink': fe(x, y, 1.3 * k + TH() * .8, 1 * k + TH() * .8, INK); fe(x, y, 1.3 * k, 1 * k, '#ee7e98'); fpx(x - .4 * k, y - .3 * k, '#ffd0dc'); break;
      case 'tri': fp([x - 1.3 * k, y - .7 * k, x + 1.3 * k, y - .7 * k, x, y + .9 * k], INK); break;
      case 'nostrils': fe(x - .9 * k, y, .45 * k + px1 * .3, .5 * k + px1 * .3, INK); fe(x + .9 * k, y, .45 * k + px1 * .3, .5 * k + px1 * .3, INK); break;
      default: fe(x, y, Math.max(px1 * .7, .85 * k), Math.max(px1 * .6, .65 * k), INK);
    }
  };
  g.blush = (x, y, r = 2) => { if (!g.back && !g.tiny) fe(x, y, r, r * .55, o2blush); };
  const o2blush = '#ff98ae';
  g.cheek = (x, y, r, col) => { if (!g.back) { fe(x, y, r + TH() * .8, r * .8 + TH() * .8, INK); fe(x, y, r, r * .8, col); fe(x - r * .3, y - r * .3, r * .35, r * .3, lt(col, .6)); } };
  g.whiskers = (x, y, dir = -1, n = 2, len = 5, col) => { if (g.back || g.small) return; const c = col || mix(g.P.a, INK, .55); for (let i = 0; i < n; i++) fl(x, y + i * 1.3, x + dir * len, y - .8 + i * 1.9, px1 * .5, c, true); };
  g.face = f => { if (!g.back) f(); };
  // ---------- structure helpers ----------
  g.group = fn => { const prev = curGroup; curGroup = ++groupSeq; try { fn(); } finally { curGroup = prev; } };
  g.on = (ids, fn) => { const prev = clip, pm = markMode; clip = new Set(Array.isArray(ids) ? ids : [ids]); markMode = true; try { fn(); } finally { clip = prev; markMode = pm; } };
  g.mark = fn => { const pm = markMode; markMode = true; try { fn(); } finally { markMode = pm; } };
  g.pix = () => ({ pid, lum });

  // ---------- finishing pass ----------
  g.finish = (o = {}) => {
    const P = parts, out = new Array(NN).fill(null), tone = new Int8Array(NN);
    const partOf = i => pid[i] ? P[pid[i] - 1] : null;
    const nb4 = (i, f) => { const x = i % N, y = (i - x) / N; if (x > 0) f(i - 1); if (x < N - 1) f(i + 1); if (y > 0) f(i - N); if (y < N - 1) f(i + N); };
    // 1. drop stray single pixels (shape noise from tiny slivers)
    for (let i = 0; i < NN; i++) { const p = partOf(i); if (!p || p.feat) continue; let k = 0; nb4(i, j => { if (pid[j]) k++; }); if (!k) pid[i] = 0; }
    // 2. light -> tone
    for (let i = 0; i < NN; i++) { const p = partOf(i); if (!p || p.flat) continue; const I = lum[i], m = p.mat; let t = I > m[0] ? 2 : I > m[1] ? 1 : I > m[2] ? 0 : I > m[3] ? -1 : -2; if (g.small) t = Math.max(-1, Math.min(1, t)); tone[i] = t; }
    // 3. contact shadows: parts in front cast a short shadow down and to the right onto parts behind them
    if (!g.small) {
      const sh = new Uint8Array(NN);
      for (let i = 0; i < NN; i++) {
        const p = partOf(i); if (!p || p.flat) continue; const x = i % N, y = (i - x) / N;
        for (const [dx, dy] of [[0, -1], [-1, 0], [-1, -1], [0, -2], [-2, 0], [-1, -2], [-2, -1]]) {
          const X = x + dx, Y = y + dy; if (X < 0 || Y < 0) continue; const q = partOf(Y * N + X);
          if (q && q.id > p.id && !q.mark && !q.feat && !(q.group && q.group === p.group)) { sh[i] = 1; break; }
        }
      }
      for (let i = 0; i < NN; i++) if (sh[i]) tone[i] = Math.max(-2, tone[i] - 1);
    }
    // 4. tidy the shading: a tone pixel with no same-tone neighbour inside its part takes the neighbours' tone
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < NN; i++) {
      const p = partOf(i); if (!p || p.flat) continue; const cnt = {}; let same = 0, n = 0;
      nb4(i, j => { if (pid[j] === pid[i]) { n++; if (tone[j] === tone[i]) same++; cnt[tone[j]] = (cnt[tone[j]] || 0) + 1; } });
      if (n >= 2 && !same) { let bt = tone[i], bc = 0; for (const k in cnt) if (cnt[k] > bc) { bc = cnt[k]; bt = +k; } tone[i] = bt; }
    }
    // 5. colour
    for (let i = 0; i < NN; i++) { const p = partOf(i); if (!p) continue; out[i] = p.feat || p.flat && !p.ramp ? p.col : p.flat ? p.col : p.ramp.t[tone[i] + 2]; }
    // 6. inner contour lines where a solid part overlaps something behind it
    const line = new Array(NN).fill(null);
    for (let i = 0; i < NN; i++) {
      const b = partOf(i); if (!b || b.feat) continue;
      nb4(i, j => { if (line[i]) return; const a = partOf(j); if (a && a.id > b.id && !a.mark && !a.feat && !a.noLine && !(a.group && a.group === b.group)) line[i] = a.ramp.il; });
    }
    for (let i = 0; i < NN; i++) if (line[i]) out[i] = line[i];
    // 7. outer outline
    const edge = new Array(NN).fill(null);
    for (let i = 0; i < NN; i++) { if (pid[i]) continue; let best = null; nb4(i, j => { const p = partOf(j); if (p && !p.noEdge && (!best || p.id > best.id)) best = p; }); if (best) edge[i] = best.feat ? mix(best.col, '#0e0818', .72) : best.ramp.ol; }
    for (let i = 0; i < NN; i++) if (edge[i]) out[i] = edge[i];
    return out;
  };
  return g;
}

function creatureSprite(id, N, o = {}) {
  const key = id + '|' + N + '|' + (o.back ? 1 : 0) + (o.shiny ? 1 : 0) + (o.sil ? 1 : 0);
  if (SPR[key]) return SPR[key];
  const sp = SPECIES[id];
  let pal = { ...sp.pal };
  if (o.shiny) for (const k in pal) if (!sp.keep || !sp.keep.includes(k)) pal[k] = hue(pal[k], sp.sh || 150);
  const g = makeG(N, pal, o);
  (sp.art || sp.draw)(g);
  const buf = g.finish();
  const [c, x] = mk(N, N);
  const img = x.createImageData(N, N);
  for (let i = 0; i < N * N; i++) {
    const col = buf[i]; if (!col) continue;
    let [r, gg, b] = h2r(col);
    if (o.sil) { r = 22; gg = 20; b = 34; }
    img.data[i * 4] = r; img.data[i * 4 + 1] = gg; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  let out = c;
  if (o.back) { const [c2, x2] = mk(N, N); x2.translate(N, 0); x2.scale(-1, 1); x2.drawImage(c, 0, 0); out = c2; }
  SPR[key] = out;
  return out;
}