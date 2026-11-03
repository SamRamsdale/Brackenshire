// ---- sp2 ----
// ================= NEW SPECIES: CAVES, FOSSILS, GLADES & MEADOWS =================
SP('flitter', 'Flitter', ['Poison', 'Flying'], 265, 'fast', { evo: [22, 'vespermaus'], opener: 'astonish',
  pal: { a: '#6a5a8a', b: '#a890c8', c: '#3a2e50', d: '#ff9ab0', e: '#b8e060' },
  dex: 'It hangs in old mine shafts by day. At dusk, clouds of them pour out to snap up midges.',
  draw(g) { const { a, b, c, d } = g.P;
    K.batwing(g, 25, 40, -1, 22, 15, b, c); K.batwing(g, 39, 40, 1, 22, 15, b, c);
    g.l(29, 50, 28, 55, .9, c); g.l(35, 50, 36, 55, .9, c);
    K.ear(g, 26, 34, -22, 11, 4, a, d); K.ear(g, 38, 34, 22, 11, 4, a, d);
    g.c(32, 42, 9.5, a); g.e(32, 46, 5, 4, lt(a, .25), { ring: false });
    K.eyes(g, 28, 36, 40, 2.6, 1); g.face(() => { g.p([29.5, 45, 31, 45, 30.2, 47.5], '#ffffff', { oc: '#8a7a90' }); g.p([33, 45, 34.5, 45, 33.8, 47.5], '#ffffff', { oc: '#8a7a90' }); });
    g.blush(25, 44, 1.4); g.blush(39, 44, 1.4);
  } });
SP('vespermaus', 'Vespermaus', ['Poison', 'Flying'], 455, 'fast', { extra: [[34, 'crunch']],
  pal: { a: '#4a3a6a', b: '#8a70b0', c: '#2a1e3a', d: '#e070a0', e: '#a6e040' },
  dex: 'Its name means "evening mouse". It flits between chimney pots at twilight, leaving faint green streaks in the air.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.batwing(g, 24, 34, -1, 24, 20, b, c); K.batwing(g, 40, 34, 1, 24, 20, b, c);
    g.l(24, 26, 8, 36, .5, e, { ring: false, shade: false }); g.l(40, 26, 56, 36, .5, e, { ring: false, shade: false });
    g.l(28, 48, 27, 56, 1.1, c); g.l(36, 48, 37, 56, 1.1, c);
    K.ear(g, 25, 26, -25, 14, 4.5, a, d); K.ear(g, 39, 26, 25, 14, 4.5, a, d);
    g.e(32, 38, 10, 12, a); K.spikes(g, 32, 30, 8, 150, 210, 3, 4, lt(a, .2), 2);
    K.eyes(g, 28, 36, 34, 2.4, 2, { sc: '#e8ff90', brow: a });
    g.face(() => { g.p([28.5, 41, 30.5, 41, 29.5, 45], '#ffffff', { oc: '#8a7a90' }); g.p([33.5, 41, 35.5, 41, 34.5, 45], '#ffffff', { oc: '#8a7a90' }); });
  } });
SP('pitmole', 'Pitmole', ['Ground'], 300, 'phys', { evo: [26, 'colliermole'], opener: 'scratch',
  pal: { a: '#5a4a5a', b: '#ffb8c0', c: '#e8e0d0', d: '#f0d040', e: '#fff8c0' },
  dex: 'Miners adopted Pitmole as a mascot. It wears a helmet made from a lost lamp and happily burrows ahead to find seams.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(32, 47, 14, 12, a); g.e(32, 51, 9, 6, lt(a, .15), { ring: false });
    K.horn(g, 20, 54, -120, 5, 2, c); K.horn(g, 22, 56, -150, 5, 2, c); K.horn(g, 44, 54, 120, 5, 2, c); K.horn(g, 42, 56, 150, 5, 2, c);
    g.e(18, 54, 5, 4, b); g.e(46, 54, 5, 4, b);
    g.e(32, 35, 12.5, 6, d); g.e(32, 38.5, 14, 2, dk(d, .2)); g.c(32, 31, 3.2, '#8a7a50'); g.c(32, 31, 2.2, e, { ring: false });
    g.e(32, 45, 10, 6, lt(a, .35), { ring: false });
    g.face(() => { g.l(25, 42.5, 28.5, 43.5, .7, '#1a1020', { ring: false, shade: false }); g.l(35.5, 43.5, 39, 42.5, .7, '#1a1020', { ring: false, shade: false }); });
    g.e(32, 47.5, 4, 3, b); g.blush(24, 46, 1.5); g.blush(40, 46, 1.5);
  } });
SP('colliermole', 'Colliermole', ['Ground', 'Electric'], 470, 'phys', { extra: [[40, 'earthquake'], [44, 'wildcharge']], opener: 'scratch',
  pal: { a: '#4a3a4a', b: '#ff9aa8', c: '#e8e0d0', d: '#f0c030', e: '#fff8b0', f: '#6a5a6a' },
  dex: 'Its lamp shines with its own static charge, lighting up the deepest tunnels. It can dig a new seam faster than a whole shift of miners.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.p([2, 28, 18, 23, 18, 30], '#fff4b0', { ring: false, shade: false });
    g.e(38, 44, 18, 16, a); g.e(36, 50, 12, 8, lt(a, .15), { ring: false });
    g.e(24, 58, 7, 4, b); g.e(48, 58, 7, 4, b); for (let i = 0; i < 4; i++) { K.horn(g, 19 + i * 3, 60, 180 + (i - 1.5) * 15, 5, 1.6, c); K.horn(g, 43 + i * 3, 60, 180 + (i - 1.5) * 15, 5, 1.6, c); }
    g.l(22, 44, 12, 50, 4, a); g.e(9, 52, 6, 4.5, b); for (let i = 0; i < 4; i++) K.horn(g, 5 + i * 2.5, 54, 200 + i * 15, 6, 1.8, c);
    g.e(34, 26, 14, 7, d); g.e(34, 30, 16, 2.4, dk(d, .25)); g.c(22, 25, 4.2, f); g.c(22, 25, 3, e, { ring: false });
    g.e(28, 38, 9, 6, lt(a, .35), { ring: false }); g.face(() => { g.l(24, 36, 28, 37, .8, '#1a1020', { ring: false, shade: false }); g.l(32, 37, 35, 36, .8, '#1a1020', { ring: false, shade: false }); });
    g.e(26, 42, 5, 3.5, b);
    g.p([48, 22, 52, 18, 51, 22, 55, 21, 50, 28, 51.5, 23.5], d, { oc: '#8a6a10' });
  } });
SP('pebblit', 'Pebblit', ['Rock'], 285, 'tank', { evo: [25, 'cobblore'], opener: 'tackle',
  pal: { a: '#a8a4a0', b: '#c8c4c0', c: '#6a6660', d: '#6a9a4a', e: '#8ac060' },
  dex: 'It looks just like any other pebble on the path until it toddles off on its stubby legs. Trip over one and it will glare at you all day.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(25, 54, 24, 60, 2.4, c); g.l(39, 54, 40, 60, 2.4, c); g.e(23, 61, 3.5, 1.5, c); g.e(41, 61, 3.5, 1.5, c);
    g.e(32, 44, 16, 13, a); g.e(27, 38, 8, 5, b, { ring: false }); K.spots(g, [[40, 50, 1.2], [23, 50, 1], [44, 40, .9]], c);
    g.e(34, 31.5, 7, 2.2, d); K.leaf(g, 34, 31, -20, 6, 2, e); K.leaf(g, 34, 31, 30, 5, 1.8, d);
    K.eyes(g, 27, 38, 44, 2.6, 1); g.mouth(30, 50, 35, 50); g.blush(22, 47, 1.4); g.blush(43, 47, 1.4);
  } });
SP('cobblore', 'Cobblore', ['Rock'], 405, 'tank', { evo: [38, 'torgolem'], opener: 'tackle',
  pal: { a: '#9a968e', b: '#c0bcb4', c: '#62605a', d: '#6a9a4a' },
  dex: 'A heap of cobbles held together by sheer stubbornness. It rolls downhill to travel and uphill very slowly.',
  draw(g) { const { a, b, c } = g.P;
    g.e(24, 58, 7, 4, a); g.e(40, 58, 7, 4, a);
    g.l(14, 40, 6, 50, 3.4, a); g.c(6, 52, 4.4, b); g.l(50, 40, 58, 50, 3.4, a); g.c(58, 52, 4.4, b);
    for (const [x, y, rx, ry, col] of [[32, 48, 15, 10, a], [22, 40, 8, 7, b], [42, 40, 8, 7, a], [32, 32, 11, 9, b], [26, 50, 5, 4, c], [40, 50, 5, 4, b]]) g.e(x, y, rx, ry, col);
    K.eyes(g, 28, 36, 32, 2.5, 2, { brow: b }); g.mouth(29, 37, 35, 37);
  } });
SP('torgolem', 'Torgolem', ['Rock', 'Ground'], 505, 'tank', { extra: [[44, 'earthquake']], opener: 'tackle',
  pal: { a: '#8a8a88', b: '#b4b2ac', c: '#56544e', d: '#5a8a3a', e: '#8ab860' },
  dex: 'Hikers on the high moors have napped against a Torgolem, thinking it a granite tor. It never wakes them. It is very patient.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(18, 59, 9, 4.5, a); g.e(46, 59, 9, 4.5, a); g.l(20, 48, 18, 58, 7, a); g.l(44, 48, 46, 58, 7, a);
    g.l(10, 28, 4, 46, 6, a); g.e(4, 50, 6, 6, b); g.l(54, 28, 60, 46, 6, a); g.e(60, 50, 6, 6, b);
    g.p([10, 50, 12, 24, 20, 14, 44, 14, 52, 24, 54, 50, 44, 54, 20, 54], a);
    g.p([16, 26, 22, 18, 42, 18, 48, 26, 44, 30, 20, 30], b, { ring: false }); g.l(12, 34, 52, 34, .8, c, { ring: false, shade: false }); g.l(14, 44, 50, 44, .8, c, { ring: false, shade: false });
    g.l(32, 34, 32, 44, .8, c, { ring: false, shade: false }); g.l(24, 44, 22, 54, .8, c, { ring: false, shade: false }); g.l(40, 44, 42, 54, .8, c, { ring: false, shade: false });
    g.e(24, 15, 9, 3, d); g.e(42, 16, 7, 2.5, d); g.e(22, 13.5, 5, 1.5, e, { ring: false }); g.e(10, 28, 4, 2, d);
    K.eyes(g, 26, 38, 25, 2.6, 3, { glow: true, sc: '#ffe070' }); g.mouth(28, 30, 36, 30, c);
  } });
SP('coalby', 'Coalby', ['Rock', 'Fire'], 300, 'bal', { evo: [30, 'cinderock'], opener: 'tackle',
  pal: { a: '#2e2c30', b: '#4a4650', c: '#ff7020', d: '#ffd040' },
  dex: 'It sleeps in old coal seams and wakes up glowing. Miners used to carry one in winter as a hand-warmer.',
  draw(g) { const { a, b, c, d } = g.P;
    g.e(26, 58, 5, 2.5, a); g.e(38, 58, 5, 2.5, a);
    g.p([16, 52, 14, 38, 22, 28, 36, 26, 46, 34, 48, 50, 40, 56, 24, 56], a); g.p([22, 34, 28, 30, 36, 30, 32, 38], b, { ring: false });
    g.l(20, 48, 26, 44, .8, c, { ring: false, shade: false }); g.l(40, 48, 44, 42, .8, c, { ring: false, shade: false }); g.l(34, 52, 38, 49, .7, d, { ring: false, shade: false });
    K.flame(g, 32, 24, 3, c, d);
    K.eyes(g, 27, 37, 42, 2.6, 1, { col: '#1a1010' }); g.face(() => { g.dot(27, 42, 1.4, d); g.dot(37, 42, 1.4, d); });
    g.mouth(30, 48, 34, 48, c); g.blush(22, 46, 1.4); g.blush(42, 46, 1.4);
  } });
SP('cinderock', 'Cinderock', ['Rock', 'Fire'], 480, 'mixed', { extra: [[42, 'fireblast']],
  pal: { a: '#3a3438', b: '#5a5260', c: '#ff6010', d: '#ffd040', e: '#ff9a30' },
  dex: 'Molten rock seeps through the cracks in its hide. Where it walks, the heather is left smoking.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(20, 50, 16, 60, 6, a); g.l(44, 50, 48, 60, 6, a);
    g.l(12, 30, 6, 46, 5.5, a); g.e(6, 49, 6, 5, b); g.l(52, 30, 58, 46, 5.5, a); g.e(58, 49, 6, 5, b);
    g.p([10, 50, 10, 28, 18, 18, 46, 18, 54, 28, 54, 50, 44, 56, 20, 56], a);
    for (const [x1, y1, x2, y2] of [[14, 34, 22, 40], [22, 40, 20, 50], [42, 32, 48, 42], [48, 42, 44, 52], [30, 44, 36, 52]]) g.l(x1, y1, x2, y2, .9, c, { ring: false, shade: false });
    g.l(22, 17, 20, 8, 3, b); g.l(42, 17, 44, 8, 3, b); K.flame(g, 20, 6, 3.4, c, d); K.flame(g, 44, 6, 3.4, c, d);
    g.p([18, 24, 24, 20, 40, 20, 46, 24, 40, 28, 24, 28], b, { ring: false });
    K.eyes(g, 25, 39, 28, 2.8, 3, { glow: true, sc: e });
    g.face(() => g.p([26, 36, 38, 36, 36, 40, 28, 40], c, { oc: '#1a1010' }));
  } });
SP('glintle', 'Glintle', ['Rock', 'Psychic'], 300, 'wall', { evo: [32, 'geodazzle'], opener: 'tackle', extra: [[1, 'confusion']],
  pal: { a: '#9a8a7a', b: '#c0b0a0', c: '#c890f0', d: '#f0d8ff', e: '#6a5a4a' },
  dex: 'It looks like a dull round stone until it opens. Inside, rows of little crystals hum with a gentle psychic glow.',
  draw(g) { const { a, b, c, d } = g.P;
    g.e(32, 46, 16, 13, a); g.e(26, 38, 7, 4, b, { ring: false });
    g.e(32, 48, 11, 7, dk(c, .45)); for (let i = 0; i < 6; i++) K.crystal(g, 23 + i * 3.6, 53, 1.6, 5 + (i % 2) * 2, (i - 2.5) * 8, i % 2 ? c : d);
    K.eyes(g, 26, 38, 39, 2.5, 1); g.blush(21, 42, 1.4); g.blush(43, 42, 1.4);
    K.shine(g, 29, 50);
  } });
SP('geodazzle', 'Geodazzle', ['Rock', 'Psychic'], 480, 'spec', { extra: [[40, 'powergem'], [44, 'psychic']],
  pal: { a: '#8a7a6a', b: '#b0a090', c: '#b070e8', d: '#f0d0ff', e: '#80e0f8' },
  dex: 'Crystals of every colour grow from its cracked shell. When it hums, the crystals ring like glass bells and nearby minds go calm.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(24, 59, 6, 3, a); g.e(40, 59, 6, 3, a);
    g.e(32, 42, 18, 17, a); g.e(24, 30, 8, 5, b, { ring: false });
    g.e(32, 44, 13, 12, dk(c, .5));
    K.crystal(g, 32, 50, 4, 16, 0, c); K.crystal(g, 25, 51, 3, 11, -25, d); K.crystal(g, 39, 51, 3, 11, 25, e); K.crystal(g, 20, 48, 2.5, 7, -55, c); K.crystal(g, 44, 48, 2.5, 7, 55, d);
    K.crystal(g, 20, 26, 3, 9, -30, e); K.crystal(g, 44, 26, 3, 9, 30, c);
    g.c(12, 18, 2.2, d); g.c(52, 16, 2, e); g.c(32, 14, 2.4, c);
    K.eyes(g, 26, 38, 32, 2.4, 2, { sc: '#fff8ff', pupil: '#7040a0', brow: b });
  } });
SP('ichthlet', 'Ichthlet', ['Rock', 'Water'], 355, 'wall', { evo: [40, 'ichthorn'], fossil: 1, opener: 'tackle', extra: [[1, 'watergun']],
  pal: { a: '#8aa0a8', b: '#d8e4e0', c: '#5a6a70', d: '#c0a070', e: '#e0c890' },
  dex: 'Revived from a fossil found in the Saltmarsh cliffs. Its stony flippers still carry the grain of the rock it slept in.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.p([48, 38, 60, 30, 58, 40, 60, 50], d); g.l(52, 32, 56, 46, .5, e, { ring: false, shade: false });
    K.tail(g, [22, 40, 34, 40, 44, 40, 52, 40], 9, 4, a); g.e(32, 45, 12, 4, b, { ring: false });
    K.re(g, 30, 30, 6, 2.5, -30, d); K.re(g, 28, 52, 7, 3, 30, d); K.re(g, 44, 50, 5, 2.4, 40, d);
    K.spots(g, [[30, 36, 1.2], [38, 35, 1], [44, 37, 1]], c);
    g.e(18, 40, 9, 8, a); g.p([2, 42, 12, 37, 12, 45], a); g.e(8, 44, 5, 1.8, b, { ring: false });
    K.eye1(g, 16, 38, 3.2, 1); g.blush(19, 44, 1.3);
  } });
SP('ichthorn', 'Ichthorn', ['Rock', 'Water'], 500, 'mixed', { fossil: 1, extra: [[44, 'hydropump'], [48, 'stoneedge']], opener: 'tackle',
  pal: { a: '#6a8490', b: '#d0dcd8', c: '#3a4a54', d: '#b08a50', e: '#e0c890' },
  dex: 'The terror of ancient seas, with a horn like a narwhal and plates of fossil stone. Collectors once chipped its bones from the cliffs by lamplight.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.p([46, 34, 62, 22, 58, 36, 62, 50], d); g.l(52, 30, 58, 44, .6, e, { ring: false, shade: false });
    K.tail(g, [16, 36, 30, 36, 42, 36, 52, 36], 12, 5, a); g.e(28, 44, 16, 5, b, { ring: false });
    K.spikes(g, 34, 30, 8, -60, 60, 5, 6, d, 2.4);
    K.re(g, 26, 50, 9, 3.5, 35, d); K.re(g, 42, 48, 7, 3, 40, d); K.re(g, 32, 24, 7, 3, -25, d);
    for (const [x, y] of [[26, 30], [34, 32], [42, 31]]) g.p([x - 3, y, x, y - 2, x + 3, y, x, y + 2], c, { ring: false });
    g.e(14, 36, 10, 9, a); g.p([-2, 38, 8, 32, 8, 42], a); K.horn(g, 4, 34, -80, 14, 1.4, e, -5);
    K.eye1(g, 12, 33, 2.6, 3, { brow: a, sc: '#fff0a0' });
  } });
SP('ambrix', 'Ambrix', ['Bug', 'Rock'], 515, 'fast', { fossil: 1, opener: 'bite', extra: [[34, 'rockslide'], [42, 'xscissor']],
  pal: { a: '#b87a30', b: '#f0c870', c: '#6a4418', d: '#fff0c0', e: '#e05020', f: '#ffd890' },
  dex: 'Revived from a giant dragonfly trapped in amber. Its wings span wider than a man\'s arms, and they hum like a distant engine.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    for (const [x, y, an] of [[30, 26, -70], [36, 26, 70], [30, 32, -110], [36, 32, 110]]) { const [cx, cy] = K.pt(x, y, an, 14); K.re(g, cx, cy, 15, 4.5, an + 90, '#f4d890', { oc: c }); g.l(x, y, ...K.pt(x, y, an, 27), .5, c, { ring: false, shade: false }); }
    K.tail(g, [34, 36, 40, 44, 46, 52, 50, 60], 2.8, 1.6, a); for (let i = 0; i < 5; i++) { const t = i / 5; g.l(34 + 16 * t - 2, 36 + 24 * t, 34 + 16 * t + 2, 36 + 24 * t, .5, c, { ring: false, shade: false }); }
    g.e(33, 30, 5, 7, a); g.e(32, 28, 2.5, 4, b, { ring: false });
    for (const s of [-1, 1]) { g.l(33, 32, 33 + s * 8, 38, .8, c); g.l(33 + s * 8, 38, 33 + s * 10, 44, .8, c); }
    g.c(30, 20, 5.5, a); g.c(26, 18, 4.2, e); g.c(34, 17, 4.2, e); K.shine(g, 25, 17); K.shine(g, 33, 16);
    g.face(() => { g.p([27, 24, 29, 24, 28, 26.5], d, { ring: false }); g.p([31, 24, 33, 24, 32, 26.5], d, { ring: false }); }); void f;
  } });
SP('crawlie', 'Crawlie', ['Bug'], 200, 'bal', { evo: [7, 'cocoonle'], opener: 'tackle', extra: [[1, 'stringshot']],
  pal: { a: '#88c858', b: '#c8f090', c: '#4a8a3a', d: '#f0d040', e: '#e05050' },
  dex: 'It munches through nettle leaves all day. The spots on its back are false eyes to scare off hungry birds.',
  draw(g) { const { a, b, c, d, e } = g.P;
    const seg = [[50, 54, 6], [42, 53, 7], [34, 51, 7.5], [27, 46, 7.5]];
    for (const [x, y, r] of seg) { g.c(x, y, r, a); g.e(x, y + r * .5, r * .7, r * .35, b, { ring: false }); g.l(x - 1, y + r, x - 2, y + r + 2, .8, c, { ring: false, shade: false }); }
    K.spots(g, [[42, 49, 1.8], [34, 46, 1.8], [50, 50, 1.5]], d); K.spots(g, [[42, 49, .8], [34, 46, .8], [50, 50, .7]], '#222');
    g.c(20, 36, 10, a); g.l(16, 27, 13, 20, .8, c); g.l(22, 26, 24, 19, .8, c); g.c(13, 19, 1.5, e); g.c(24, 18.5, 1.5, e);
    K.eyes(g, 16, 24, 35, 2.8, 1); g.mouth(18, 41, 21, 41.5); g.blush(13, 39, 1.3);
  } });
SP('cocoonle', 'Cocoonle', ['Bug'], 205, 'wall', { evo: [10, 'flutterbye'], opener: 'harden', extra: [[1, 'harden']],
  pal: { a: '#b8b890', b: '#e0e0c0', c: '#7a7a58', d: '#6a4a2a' },
  dex: 'It dangles from a twig by a single silk thread. If you listen very closely, you can hear it dreaming.',
  draw(g) { const { a, b, c, d } = g.P;
    g.l(20, 4, 48, 6, 1.4, d); g.l(34, 5, 34, 14, .5, '#e8e8e8', { ring: false, shade: false });
    g.p([28, 16, 40, 16, 44, 30, 42, 46, 36, 58, 32, 60, 28, 58, 22, 46, 24, 30], a);
    for (let y = 22; y < 56; y += 6) g.l(26, y, 40, y + 2, .7, c, { ring: false, shade: false });
    g.e(30, 28, 3, 8, b, { ring: false });
    g.face(() => { g.l(28, 36, 31, 36, .6, '#2a2020', { ring: false, shade: false }); g.l(35, 36, 38, 36, .6, '#2a2020', { ring: false, shade: false }); });
    g.blush(28, 39, 1.2); g.blush(38, 39, 1.2);
  } });
SP('flutterbye', 'Flutterbye', ['Bug', 'Fairy'], 395, 'spec', { extra: [[16, 'quiverdance']],
  pal: { a: '#c83a38', b: '#3a2a38', c: '#f8e0a0', d: '#4a80e0', e: '#f0d8e8' },
  dex: 'The great eyespots on its wings startle predators. A garden full of them is said to bring a wedding within the year.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.re(g, 17, 22, 15, 11, -35, a); K.re(g, 47, 22, 15, 11, 35, a); K.re(g, 19, 44, 11, 8, 30, dk(a, .15)); K.re(g, 45, 44, 11, 8, -30, dk(a, .15));
    for (const [x, y] of [[14, 20], [50, 20]]) { g.c(x, y, 5, c, { ring: false }); g.c(x, y, 3.5, d, { ring: false }); g.c(x, y, 1.8, b, { ring: false }); K.shine(g, x - 1, y - 1); }
    g.e(8, 12, 3, 2, b, { ring: false }); g.e(56, 12, 3, 2, b, { ring: false });
    g.e(32, 38, 4, 14, b); g.c(32, 22, 5.5, b);
    g.l(30, 18, 25, 8, .6, b); g.l(34, 18, 39, 8, .6, b); g.c(25, 7.5, 1.3, b); g.c(39, 7.5, 1.3, b);
    K.eyes(g, 30, 34.5, 22, 1.8, 2, { sc: '#fff', brow: b }); void e;
  } });
SP('tadlet', 'Tadlet', ['Water'], 300, 'fast', { evo: [25, 'frogley'], opener: 'pound',
  pal: { a: '#5a6a3a', b: '#b8c890', c: '#3a4a24', d: '#7a8a50' },
  dex: 'Ponds wriggle with them every spring. Children fill jam jars with Tadlets, then pour them gently back.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [36, 42, 46, 38, 54, 42, 60, 36], 4, 1.5, d); K.re(g, 52, 40, 7, 3, -20, lt(d, .3));
    g.c(26, 40, 12, a); g.e(25, 46, 8, 4.5, b, { ring: false }); K.spots(g, [[30, 34, 1.2], [34, 38, 1], [22, 32, .9]], c);
    g.c(19, 32, 4.2, a); g.c(31, 32, 4.2, a); K.eyes(g, 19, 31, 32, 2.8, 1); g.mouth(23, 42, 28, 42.5, c); g.blush(15, 39, 1.4); g.blush(34, 39, 1.4);
  } });
SP('frogley', 'Frogley', ['Water'], 400, 'bal', { evo: [38, 'toadwarden'], opener: 'pound',
  pal: { a: '#8aa048', b: '#d8f0b0', c: '#2a6a38', d: '#f0d040', e: '#ff90a0' },
  dex: 'It sings in a deep baritone on warm evenings. A chorus of Frogley can keep a whole village awake.',
  draw(g) { const { a, b, c, d } = g.P;
    g.e(46, 54, 8, 6, a); g.e(50, 60, 9, 2.5, c); g.e(18, 58, 5, 2.5, a); g.e(30, 59, 5, 2.5, a);
    g.e(34, 46, 15, 11, a); g.e(30, 50, 10, 6, b, { ring: false }); K.spots(g, [[40, 40, 1.8], [46, 46, 1.5], [36, 38, 1.2]], c);
    g.e(26, 34, 12, 8, a); g.c(20, 27, 5, a); g.c(32, 26, 5, a);
    K.eyes(g, 20, 32, 26.5, 3, 2, { sc: d, brow: a }); g.mouth(18, 38, 32, 38, c); g.e(25, 40.5, 5, 2, b, { ring: false });
  } });
SP('toadwarden', 'Toadwarden', ['Water', 'Grass'], 510, 'phys', { extra: [[40, 'bulkup'], [46, 'woodhammer']],
  pal: { a: '#6a8a38', b: '#e8e0a0', c: '#3a4a1e', d: '#f0c040', e: '#4aa858', f: '#8a5a30' },
  dex: 'The guardian of the millponds. It holds a lily pad like a shield and roots itself in the mud to stop anything that pollutes its waters.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(24, 50, 18, 60, 5, a); g.l(40, 50, 46, 60, 5, a); g.e(16, 61, 6, 2, c); g.e(48, 61, 6, 2, c);
    g.e(32, 40, 16, 16, a); g.e(30, 44, 10, 11, b, { ring: false }); K.spots(g, [[42, 32, 2], [44, 42, 1.6]], c);
    g.l(46, 34, 54, 42, 4.5, a); g.c(55, 44, 4, a);
    g.c(18, 46, 11, e); g.p([18, 46, 26, 40, 28, 44], lt(e, .2), { ring: false }); g.l(18, 46, 10, 40, .7, c, { ring: false, shade: false }); g.l(18, 46, 12, 54, .7, c, { ring: false, shade: false });
    g.l(18, 32, 16, 42, 4.5, a);
    g.e(30, 20, 13, 8, a); g.c(23, 14, 4.8, a); g.c(35, 13, 4.8, a); g.l(18, 18, 42, 17, 1.4, f, { ring: false });
    K.eyes(g, 23, 35, 13.5, 2.8, 3, { sc: d, brow: a }); g.mouth(20, 24, 38, 24, c);
  } });
SP('puffseed', 'Puffseed', ['Grass', 'Flying'], 250, 'fast', { evo: [24, 'dandelyon'], opener: 'tackle', extra: [[1, 'absorb']],
  pal: { a: '#f8f8f0', b: '#e0e0d8', c: '#6ab050', d: '#c8a060' },
  dex: 'It floats wherever the breeze takes it. On a windy day you may find one clinging to your washing line.',
  draw(g) { const { a, b, c, d } = g.P;
    g.l(32, 44, 32, 58, 1, c); K.leaf(g, 32, 56, -60, 7, 2.5, c); K.leaf(g, 32, 55, 60, 7, 2.5, c);
    for (let k = 0; k < 14; k++) { const [x, y] = K.pt(32, 30, k * 360 / 14, 15); g.l(32, 30, x, y, .45, b, { ring: false, shade: false }); g.c(x, y, 2.4, a); }
    g.c(32, 30, 11, a); g.c(32, 30, 11, a, { ring: false });
    K.eyes(g, 28, 36, 30, 2.6, 1); g.mouth(31, 35, 33, 35.5); g.blush(24, 33, 1.3); g.blush(40, 33, 1.3); void d;
  } });
SP('dandelyon', 'Dandelyon', ['Grass', 'Flying'], 460, 'fast', { extra: [[32, 'leafblade']],
  pal: { a: '#f0c820', b: '#fff0a0', c: '#5aa048', d: '#c89010', e: '#8a6020' },
  dex: 'A proud lion with a mane of golden petals. In autumn the mane turns to fluff and blows away. It is quite embarrassed about this.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [50, 44, 56, 36, 58, 28], 1.8, 1.4, c); g.c(58, 26, 3.5, a);
    g.l(44, 46, 46, 60, 3, dk(b, .2)); g.l(26, 46, 24, 60, 3, dk(b, .2));
    g.e(38, 40, 14, 9, b); g.l(46, 46, 48, 61, 3.2, b); g.l(30, 47, 29, 61, 3.2, b); g.e(48, 61, 3, 1.3, d); g.e(29, 61, 3, 1.3, d);
    for (let k = 0; k < 16; k++) { const [x, y] = K.pt(20, 28, k * 22.5, 13); K.leaf(g, ...K.pt(20, 28, k * 22.5, 7), k * 22.5, 9, 3, k % 2 ? a : d); void x; void y; }
    g.c(20, 28, 9, b); g.e(15, 32, 5, 3.5, lt(b, .3));
    g.face(() => g.dot(12, 30.5, 1.4, e));
    K.eye1(g, 18, 26, 2.4, 2, { brow: d, sc: '#fff' }); K.eye1(g, 24.5, 26, 2.2, 2, { brow: d, sc: '#fff', side: 1 });
    g.mouth(13, 34.5, 17, 35, e);
  } });
SP('wisplet', 'Wisplet', ['Ghost', 'Fairy'], 300, 'sspd', { evo: [34, 'wispwarden'], opener: 'astonish',
  pal: { a: '#9af0e0', b: '#e0fff8', c: '#48b8b0', d: '#fff' },
  dex: 'A little flame that bobs over marshes at night. Follow it and you will find something wonderful, or get very wet.',
  draw(g) { const { a, b, c } = g.P;
    K.flame(g, 32, 38, 14, a, b);
    g.p([22, 46, 26, 52, 30, 48, 34, 54, 38, 48, 42, 52, 42, 44, 22, 44], a);
    K.eyes(g, 27, 37, 38, 2.8, 1, { col: '#1a4048' }); g.mouth(30, 43, 34, 43.5, c); g.blush(23, 41, 1.4); g.blush(41, 41, 1.4);
  } });
SP('wispwarden', 'Wispwarden', ['Ghost', 'Fairy'], 485, 'spec', { extra: [[40, 'moonblast']],
  pal: { a: '#2a3a5a', b: '#48b8b0', c: '#9af0e0', d: '#e0fff8', e: '#c0a060' },
  dex: 'It walks the marsh paths carrying its own wisp in a lantern, guiding lost souls, and lost hikers, safely home.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.p([16, 62, 22, 26, 42, 26, 50, 62, 44, 58, 38, 62, 32, 58, 26, 62, 20, 58], a); g.p([24, 30, 40, 30, 38, 40, 26, 40], dk(a, .2), { ring: false });
    g.l(40, 34, 48, 42, 2.2, a); g.l(48, 42, 48, 46, .6, e);
    g.p([44, 46, 52, 46, 53, 58, 43, 58], e); g.p([45, 48, 51, 48, 51.5, 56, 44.5, 56], d, { ring: false }); K.flame(g, 48, 53, 2.8, c, '#ffffff');
    g.c(32, 20, 10, a); g.c(32, 21, 7, dk(a, .45), { ring: false });
    K.ear(g, 32, 11, 0, 7, 5, a);
    K.eyes(g, 28.5, 35.5, 21, 2.3, 3, { glow: true, sc: c });
  } });
SP('strawby', 'Strawby', ['Grass'], 290, 'bal', { evo: [30, 'scarecrone'], opener: 'pound',
  pal: { a: '#e8c860', b: '#c89838', c: '#8a5a30', d: '#e05050', e: '#5a8ac8' },
  dex: 'A little bundle of straw that came to life in a harvest field. It gets terribly nervous around matches.',
  draw(g) { const { a, b, c, d, e } = g.P;
    for (let i = 0; i < 7; i++) K.ear(g, 24 + i * 2.7, 56, 180 + (i - 3) * 12, 6, 1.4, i % 2 ? a : b);
    g.e(32, 48, 9, 9, a); for (let i = 0; i < 4; i++) g.l(27 + i * 3.5, 42, 27 + i * 3.5, 55, .5, b, { ring: false, shade: false });
    g.l(26, 45, 36, 47, 1.2, e, { ring: false });
    for (let i = 0; i < 3; i++) { K.ear(g, 23, 45 + i, -100 - i * 10, 7, 1.2, a); K.ear(g, 41, 45 + i, 100 + i * 10, 7, 1.2, a); }
    g.c(32, 32, 10, a); K.spikes(g, 32, 32, 9, -80, 80, 6, 4, a, 1.5);
    g.e(32, 23.5, 12, 3, c); g.e(32, 20, 7, 4.5, c); g.l(25, 22, 39, 22, 1, d, { ring: false });
    K.eyes(g, 28, 36, 33, 2.4, 1); g.mouth(30, 38, 34, 38, c); g.blush(25, 36, 1.3); g.blush(39, 36, 1.3);
  } });
SP('scarecrone', 'Scarecrone', ['Grass', 'Ghost'], 480, 'mixed', { extra: [[38, 'shadowball']],
  pal: { a: '#e8e0c8', b: '#6a4a8a', c: '#8a5a30', d: '#d8b048', e: '#ff9a30', f: '#303040' },
  dex: 'Its turnip-lantern head glows on autumn nights. Crows perch on its arms. They are not afraid of it; they work for it.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(32, 40, 32, 63, 1.6, c); g.l(6, 30, 58, 30, 1.8, c);
    g.p([18, 56, 22, 30, 42, 30, 46, 56, 40, 52, 36, 58, 30, 52, 24, 58], b); g.l(24, 40, 40, 42, .8, dk(b, .3), { ring: false, shade: false });
    for (const x of [6, 58]) for (let i = 0; i < 3; i++) K.ear(g, x, 30, 180 + (i - 1) * 25, 7, 1.2, d);
    g.e(14, 25, 5, 4, f); g.p([8, 25, 11, 24, 10, 26], '#f0c040'); K.ear(g, 17, 24, 70, 5, 2, f);
    g.c(32, 18, 11, a); g.e(32, 8, 6, 3, lt(a, .2)); K.leaf(g, 32, 7, -20, 8, 3, '#6aa048'); K.leaf(g, 32, 7, 25, 7, 2.6, '#5a9a40');
    g.face(() => { g.p([25, 15, 30, 17, 25, 20], e, { oc: f }); g.p([39, 15, 34, 17, 39, 20], e, { oc: f }); g.p([24, 23, 40, 23, 38, 27, 35, 25, 32, 28, 29, 25, 26, 27], e, { oc: f }); });
    g.e(32, 7, 10, 2.2, c);
  } });
SP('saplet', 'Saplet', ['Grass'], 280, 'wall', { evo: [18, 'oakling'], opener: 'pound', extra: [[1, 'absorb']],
  pal: { a: '#9a7048', b: '#6ac058', c: '#3a8a3a', d: '#c8a070' },
  dex: 'It plants its roots in sunny spots to nap. If you see a sapling with its eyes shut, try not to water it.',
  draw(g) { const { a, b, c, d } = g.P;
    for (const x of [26, 32, 38]) K.tail(g, [x, 54, x + (x - 32) * .4, 58, x + (x - 32) * .8, 61], 1.6, 1, a);
    g.e(32, 46, 9, 10, a); g.e(30, 44, 4, 6, d, { ring: false });
    g.l(32, 36, 32, 26, 1.3, c); K.leaf(g, 32, 28, -55, 12, 4.5, b, c); K.leaf(g, 32, 26, 50, 13, 4.5, b, c);
    K.eyes(g, 28, 36, 45, 2.5, 1); g.mouth(31, 50, 33, 50.5); g.blush(25, 48, 1.3); g.blush(39, 48, 1.3);
  } });
SP('oakling', 'Oakling', ['Grass'], 390, 'tank', { evo: [36, 'greenwarden'], opener: 'pound',
  pal: { a: '#8a6040', b: '#58a848', c: '#2e6a30', d: '#b89060', e: '#7aca60' },
  dex: 'A young oak that walks. It stomps about the woods pruning brambles and scolding litterbugs.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(24, 50, 20, 60, 4, a); g.l(40, 50, 44, 60, 4, a); for (const x of [16, 22, 42, 48]) g.l(x + (x < 32 ? 2 : -2), 60, x, 62, 1, a);
    g.l(20, 38, 10, 30, 2.5, a); g.l(44, 38, 54, 30, 2.5, a); K.leaf(g, 10, 30, -40, 7, 3, b); K.leaf(g, 54, 30, 40, 7, 3, b);
    g.e(32, 44, 12, 12, a); g.l(28, 36, 30, 52, .7, dk(a, .3), { ring: false, shade: false }); g.l(36, 38, 35, 52, .7, dk(a, .3), { ring: false, shade: false });
    for (const [x, y, r] of [[32, 20, 12], [21, 24, 8], [43, 24, 8], [26, 14, 7], [38, 13, 7]]) g.c(x, y, r, b);
    K.spots(g, [[27, 14, 2], [38, 12, 1.8], [22, 22, 1.8]], e); K.spots(g, [[36, 26, 1.5], [44, 28, 1.3]], c);
    K.eyes(g, 28, 36, 42, 2.4, 2, { brow: a }); g.e(32, 48, 3, 1.5, dk(a, .4), { ring: false }); void d;
  } });
SP('greenwarden', 'Greenwarden', ['Grass', 'Psychic'], 525, 'spec', { extra: [[44, 'synthesis']],
  pal: { a: '#6a4a30', b: '#3a8a3a', c: '#1e5a28', d: '#8ad06a', e: '#e8d060' },
  dex: 'The face of the Green Man, carved on old church walls, is said to be this creature. It speaks with the voice of the whole forest.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(20, 48, 12, 62, 5, a); g.l(44, 48, 52, 62, 5, a); g.l(32, 50, 32, 63, 5, a);
    g.l(22, 36, 6, 26, 4, a); g.l(42, 36, 58, 26, 4, a); g.l(6, 26, 2, 16, 2, a); g.l(58, 26, 62, 16, 2, a);
    g.p([16, 52, 18, 30, 46, 30, 48, 52, 32, 56], a);
    for (const [x, y, r] of [[32, 14, 16], [14, 20, 9], [50, 20, 9], [20, 8, 8], [44, 8, 8], [32, 2, 7], [4, 14, 5], [60, 14, 5]]) g.c(x, y, r, b);
    for (let k = 0; k < 10; k++) { const [x, y] = K.pt(32, 30, -90 + k * 20, 16); K.leaf(g, x, y, -90 + k * 20, 9, 3.5, k % 2 ? c : b, d); }
    g.e(32, 32, 11, 12, d); K.leaf(g, 24, 30, -130, 8, 3, b); K.leaf(g, 40, 30, 130, 8, 3, b);
    K.eyes(g, 27.5, 36.5, 30, 2.5, 3, { glow: true, sc: e }); g.face(() => g.p([28, 38, 36, 38, 32, 42], c, { ring: false }));
    K.spots(g, [[26, 6, 1.6], [40, 5, 1.6], [12, 18, 1.4]], d);
  } });
SP('kindlet', 'Kindlet', ['Normal', 'Fairy'], 330, 'hp', { evo: [30, 'carefluff'], opener: 'pound', extra: [[20, 'recover']],
  pal: { a: '#fff0f4', b: '#ffc0d0', c: '#e87898', d: '#ffffff' },
  dex: 'Wayhouse nurses often keep one. It snuggles up to hurt Beasties, and its soft wool seems to ease their aches.',
  draw(g) { const { a, b, c } = g.P;
    g.e(25, 59, 4, 2.5, b); g.e(39, 59, 4, 2.5, b);
    for (const [x, y, r] of [[32, 46, 12], [22, 42, 6], [42, 42, 6], [24, 52, 6], [40, 52, 6], [32, 34, 9], [24, 32, 5], [40, 32, 5], [32, 26, 5]]) g.c(x, y, r, a);
    g.c(32, 38, 8, b); K.earL(g, 22, 36, -110, 8, 2.5, b); K.earL(g, 42, 36, 110, 8, 2.5, b);
    g.p([29, 48, 32, 45, 35, 48, 32, 52], c, { ring: false }); g.c(30.2, 47.5, 1.6, c, { ring: false }); g.c(33.8, 47.5, 1.6, c, { ring: false });
    K.eyes(g, 29, 35, 37, 2.2, 1); g.mouth(31, 41, 33, 41.3); g.blush(26, 40, 1.2); g.blush(38, 40, 1.2);
  } });
SP('carefluff', 'Carefluff', ['Normal', 'Fairy'], 470, 'hp', { extra: [[36, 'moonlight']],
  pal: { a: '#fff4f8', b: '#ffb8cc', c: '#e0608a', d: '#fff8d0' },
  dex: 'A great woolly guardian of the Wayhouses. Beasties that nap in its fleece wake up with their scrapes and bruises gone.',
  draw(g) { const { a, b, c, d } = g.P;
    g.e(22, 60, 6, 3, b); g.e(42, 60, 6, 3, b);
    for (const [x, y, r] of [[32, 44, 16], [18, 38, 8], [46, 38, 8], [20, 52, 8], [44, 52, 8], [32, 26, 12], [22, 22, 6], [42, 22, 6], [32, 14, 7], [26, 16, 5], [38, 16, 5]]) g.c(x, y, r, a);
    g.c(32, 28, 9, b); K.earL(g, 20, 24, -115, 10, 3, b); K.earL(g, 44, 24, 115, 10, 3, b);
    g.p([25, 46, 32, 40, 39, 46, 32, 54], c); g.c(28.5, 44.5, 3.6, c); g.c(35.5, 44.5, 3.6, c); g.l(29, 44, 35, 44, 1, d, { ring: false }); g.l(32, 41, 32, 47, 1, d, { ring: false });
    g.l(20, 40, 25, 46, 3, a); g.l(44, 40, 39, 46, 3, a);
    K.eyes(g, 28.5, 35.5, 27, 2.2, 2, { sc: '#fff', pupil: c, brow: b }); g.mouth(30.5, 32, 33.5, 32);
  } });