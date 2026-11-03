// ---- sp3 ----
// ================= NEW SPECIES: CASTLE, MOUNTAINS & HOUSEHOLD =================
SP('pageling', 'Pageling', ['Steel'], 300, 'pwall', { evo: [22, 'squirex'], opener: 'tackle', extra: [[1, 'harden']],
  pal: { a: '#a8b0c0', b: '#dde3ec', c: '#5a6278', d: '#c84040', e: '#9ae0ff', f: '#8a5a30' },
  dex: 'It found an old helmet and decided to be a knight. It practises sword drills with a stick every morning.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.e(26, 59, 4.5, 2.5, c); g.e(38, 59, 4.5, 2.5, c); g.l(27, 52, 26, 58, 2, c); g.l(37, 52, 38, 58, 2, c);
    g.l(44, 46, 54, 30, 1.4, f); g.l(50, 38, 56, 40, 1.2, f);
    g.e(32, 48, 10, 8, a); g.e(30, 46, 5, 3, b, { ring: false }); g.l(24, 46, 18, 50, 2, a); g.l(40, 46, 45, 45, 2, a);
    K.flame(g, 33, 16, 4, d, lt(d, .3), 15);
    g.p([20, 38, 20, 28, 26, 20, 38, 20, 44, 28, 44, 38, 40, 42, 24, 42], a); g.p([24, 26, 28, 22, 34, 22, 30, 28], b, { ring: false });
    g.p([22, 30, 42, 30, 42, 34, 22, 34], c); g.l(32, 34, 32, 41, .7, c, { ring: false, shade: false });
    g.face(() => { g.e(27, 32, 2.2, 1.2, e, { ring: false, shade: false }); g.e(37, 32, 2.2, 1.2, e, { ring: false, shade: false }); });
  } });
SP('squirex', 'Squirex', ['Steel', 'Fighting'], 420, 'phys', { evo: [40, 'knightrix'], opener: 'tackle',
  pal: { a: '#9aa4b8', b: '#d8dee8', c: '#4a5268', d: '#b83838', e: '#9ae0ff', f: '#e0b040' },
  dex: 'It polishes its armour until it gleams and challenges any trainer it meets to a duel. It always bows first.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(26, 48, 23, 60, 3, a); g.l(38, 48, 41, 60, 3, a); g.e(22, 61, 4.5, 1.8, c); g.e(42, 61, 4.5, 1.8, c);
    g.l(46, 42, 58, 14, 1.8, b); g.l(46, 42, 58, 14, .6, '#ffffff', { ring: false, shade: false }); g.l(42, 40, 50, 44, 1.6, f);
    g.p([20, 50, 22, 32, 42, 32, 44, 50, 32, 54], a); g.p([24, 36, 30, 34, 30, 44, 24, 46], b, { ring: false }); g.l(22, 42, 42, 42, 1, d, { ring: false });
    g.p([8, 30, 20, 30, 20, 44, 14, 50, 8, 44], d); g.p([11, 34, 17, 34, 14, 42], f, { ring: false });
    g.l(40, 34, 45, 41, 2.4, a);
    K.flame(g, 34, 8, 4.5, d, lt(d, .3), 25);
    g.p([22, 30, 22, 18, 28, 12, 38, 12, 42, 18, 42, 30, 38, 33, 26, 33], a); g.p([26, 18, 30, 14, 36, 14, 32, 20], b, { ring: false });
    g.p([22, 21, 42, 21, 42, 26, 22, 26], c); for (let i = 0; i < 4; i++) g.l(26 + i * 4, 26, 26 + i * 4, 31, .5, c, { ring: false, shade: false });
    g.face(() => { g.p([25, 22.5, 30, 23.5, 25, 24.5], e, { ring: false, shade: false }); g.p([39, 22.5, 34, 23.5, 39, 24.5], e, { ring: false, shade: false }); });
  } });
SP('knightrix', 'Knightrix', ['Steel', 'Fighting'], 530, 'phys', { extra: [[44, 'swordsdance'], [50, 'closecombat']],
  pal: { a: '#8a94aa', b: '#e0e6f0', c: '#3a4258', d: '#2a4a9a', e: '#9ae0ff', f: '#e8c048' },
  dex: 'Tales of the Knightrix have been told since before Ironhold Castle was built. It has sworn never to lose to a bully.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.p([14, 60, 20, 26, 44, 26, 52, 60, 40, 56, 32, 62, 24, 56], d);
    g.l(26, 48, 22, 61, 4, a); g.l(40, 48, 44, 61, 4, a); g.e(21, 62, 5, 1.8, c); g.e(45, 62, 5, 1.8, c);
    g.l(50, 50, 60, 4, 2.2, b); g.l(50, 50, 60, 4, .7, '#ffffff', { ring: false, shade: false }); g.l(45, 46, 55, 50, 2, f); g.c(49, 51, 2, f);
    g.p([18, 50, 20, 28, 46, 28, 48, 50, 33, 56], a); g.p([22, 32, 30, 30, 30, 44, 22, 46], b, { ring: false });
    g.c(33, 38, 4, f); g.l(33, 34, 33, 42, .8, c, { ring: false, shade: false }); g.l(29, 38, 37, 38, .8, c, { ring: false, shade: false });
    g.p([4, 28, 18, 26, 20, 44, 12, 54, 4, 44], b); g.p([7, 31, 16, 30, 17, 43, 11, 50, 7, 42], d, { ring: false }); g.c(12, 40, 2.5, f, { ring: false });
    K.spikes(g, 22, 28, 3, -80, 10, 3, 5, a, 2); K.spikes(g, 44, 28, 3, -10, 80, 3, 5, a, 2);
    K.flame(g, 36, 5, 5, f, lt(f, .4), 30);
    g.p([23, 28, 23, 14, 30, 8, 38, 8, 43, 14, 43, 28, 39, 31, 27, 31], a); g.p([27, 14, 31, 10, 37, 10, 33, 16], b, { ring: false });
    g.p([23, 17, 43, 17, 43, 22, 23, 22], c);
    K.eyes(g, 28.5, 37.5, 19.5, 1.8, 3, { glow: true, sc: e });
  } });
SP('stagnip', 'Stagnip', ['Bug', 'Steel'], 290, 'phys', { evo: [26, 'stagmajor'],
  pal: { a: '#4a3a3a', b: '#7a5a50', c: '#b8a0a0', d: '#2a1e1e', e: '#c07040' },
  dex: 'It lives in old oak stumps. Children hold Stagnip contests to see whose can push a matchbox the furthest.',
  draw(g) { const { a, b, c, d, e } = g.P;
    for (const [x1, x2, x3] of [[28, 20, 16], [32, 32, 30], [36, 44, 48]]) { g.l(x1, 46, x2, 52, 1, d); g.l(x2, 52, x3, 58, 1, d); g.l(x1 + 8, 46, x2 + 10, 52, 1, d); g.l(x2 + 10, 52, x3 + 12, 58, 1, d); }
    g.e(38, 44, 13, 9, a); g.l(38, 35, 38, 53, .6, d, { ring: false, shade: false }); g.e(34, 40, 5, 3, lt(a, .3), { ring: false });
    g.e(22, 38, 8, 6.5, b);
    K.horn(g, 18, 34, -60, 12, 2.2, e, 25); K.horn(g, 20, 40, -110, 11, 2.2, e, -25);
    K.eyes(g, 19, 25, 36, 2, 1, { cool: false }); g.blush(22, 41, 1.2); void c;
  } });
SP('stagmajor', 'Stagmajor', ['Bug', 'Steel'], 485, 'phys', { extra: [[36, 'swordsdance'], [44, 'megahorn']],
  pal: { a: '#3a3040', b: '#5a4a60', c: '#c0b0c8', d: '#1e1822', e: '#d88848', f: '#e0d8e8' },
  dex: 'Its great jaws gleam like polished bronze. Two Stagmajors will wrestle for hours over a single sap-oozing branch.',
  draw(g) { const { a, b, d, e, f } = g.P;
    for (const [x1, x2, x3] of [[30, 20, 14], [36, 34, 30], [42, 48, 52]]) { g.l(x1, 46, x2, 54, 1.4, d); g.l(x2, 54, x3, 62, 1.4, d); }
    g.e(40, 40, 17, 12, a); g.l(40, 28, 40, 52, .7, d, { ring: false, shade: false }); g.e(34, 34, 7, 4, lt(a, .35), { ring: false }); g.e(47, 34, 5, 3, lt(a, .2), { ring: false });
    g.e(20, 36, 9, 8, b);
    K.horn(g, 16, 30, -45, 22, 3.2, e, 40); K.horn(g, 18, 40, -130, 18, 3, e, -40);
    K.horn(g, 7, 21, 60, 5, 1.2, e); K.horn(g, 8, 49, 150, 5, 1.2, e);
    K.eye1(g, 18, 33, 2.2, 2, { brow: b, sc: '#ffd040' }); void f;
  } });
SP('grotling', 'Grotling', ['Rock', 'Dark'], 300, 'phys', { evo: [30, 'gargrim'], opener: 'scratch',
  pal: { a: '#8a8a90', b: '#b0b0b4', c: '#5a5a62', d: '#6a9a5a', e: '#ff6040' },
  dex: 'It perches on church gutters pulling faces at people. When anyone looks up, it freezes and pretends to be carved.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.batwing(g, 24, 38, -1, 16, 11, c, dk(c, .3)); K.batwing(g, 40, 38, 1, 16, 11, c, dk(c, .3));
    g.e(32, 50, 10, 9, a); g.l(24, 56, 22, 60, 2.5, a); g.l(40, 56, 42, 60, 2.5, a); g.l(26, 50, 28, 56, 2, a); g.l(38, 50, 36, 56, 2, a);
    K.horn(g, 24, 28, -30, 8, 2, b, -15); K.horn(g, 40, 28, 30, 8, 2, b, 15);
    g.c(32, 34, 10, a); K.ear(g, 22, 34, -80, 6, 2.5, a); K.ear(g, 42, 34, 80, 6, 2.5, a); g.e(28, 29, 4, 2.2, b, { ring: false });
    K.eyes(g, 28, 36, 33, 2.4, 2, { sc: '#ffe080', pupil: e, brow: a });
    g.face(() => { g.p([26, 38, 38, 38, 36, 41, 28, 41], c, { ring: false }); g.p([28, 38, 29.5, 38, 28.8, 40], '#fff', { ring: false }); g.p([34.5, 38, 36, 38, 35.2, 40], '#fff', { ring: false }); });
    g.e(40, 52, 2, 1, d, { ring: false });
  } });
SP('gargrim', 'Gargrim', ['Rock', 'Dark'], 490, 'pwall', { extra: [[40, 'stoneedge']],
  pal: { a: '#7a7a82', b: '#a8a8ae', c: '#4a4a54', d: '#5a8a4a', e: '#ff5030' },
  dex: 'For centuries it has guarded the towers of Ironhold. Rain pours from its mouth in storms, which is how gutters were invented.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.batwing(g, 22, 30, -1, 22, 22, c, dk(c, .35)); K.batwing(g, 42, 30, 1, 22, 22, c, dk(c, .35));
    g.p([12, 62, 52, 62, 50, 56, 14, 56], b); g.l(12, 56, 52, 56, .7, c, { ring: false, shade: false });
    g.l(24, 50, 20, 56, 4, a); g.l(40, 50, 44, 56, 4, a); K.spikes(g, 20, 56, 2, 150, 210, 3, 3, b, 1); K.spikes(g, 44, 56, 2, 150, 210, 3, 3, b, 1);
    g.e(32, 42, 13, 13, a); g.e(32, 46, 8, 7, b, { ring: false });
    g.l(22, 36, 16, 46, 3, a); g.l(42, 36, 48, 46, 3, a);
    K.horn(g, 24, 16, -40, 12, 2.6, b, -25); K.horn(g, 40, 16, 40, 12, 2.6, b, 25);
    g.c(32, 23, 10, a); g.e(32, 30, 7, 4, a); K.ear(g, 22, 22, -85, 7, 2.5, a); K.ear(g, 42, 22, 85, 7, 2.5, a);
    K.eyes(g, 27.5, 36.5, 21, 2.4, 3, { glow: true, sc: e });
    g.face(() => { g.p([25, 29, 39, 29, 37, 34, 27, 34], c, { ring: false }); for (let i = 0; i < 4; i++) g.p([27 + i * 3, 29, 29 + i * 3, 29, 28 + i * 3, 31.5], '#fff', { ring: false }); });
    g.e(30, 14, 5, 1.6, d); g.e(46, 36, 3, 1.4, d);
  } });
SP('keyhaunt', 'Keyhaunt', ['Steel', 'Ghost'], 460, 'wall', { opener: 'astonish', extra: [[30, 'hex'], [40, 'shadowball']],
  pal: { a: '#8a8a98', b: '#c8c8d4', c: '#4a4a58', d: '#a8f0e0', e: '#1e2230', f: '#b89040' },
  dex: 'The spirit of the old dungeon padlock at Ironhold. It rattles its chains at midnight, and its keyhole glows when someone tells a lie.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    for (const s of [-1, 1]) { let x = 32 + s * 14, y = 42; for (let i = 0; i < 4; i++) { K.re(g, x + s * 2, y + 3, 1.8, 3, s * 20, f); x += s * 2.5; y += 5; } }
    K.tail(g, [32, 56, 30, 60, 34, 63], 3, 1, lt(d, .3));
    g.l(22, 24, 22, 12, 3, b); g.l(42, 24, 42, 12, 3, b); K.tail(g, [22, 12, 26, 6, 32, 5, 38, 6, 42, 12], 3, 3, b);
    g.p([16, 24, 48, 24, 50, 30, 50, 50, 46, 56, 18, 56, 14, 50, 14, 30], a); g.p([18, 27, 30, 27, 30, 36, 18, 36], b, { ring: false });
    for (const [x, y] of [[18, 28], [46, 28], [18, 52], [46, 52]]) g.c(x, y, 1.2, c, { ring: false });
    g.c(32, 42, 5, e); g.p([29, 44, 35, 44, 34, 54, 30, 54], e); g.c(32, 42, 3.5, d, { ring: false }); g.p([30.5, 44, 33.5, 44, 32.8, 52, 31.2, 52], d, { ring: false });
    K.eyes(g, 24, 40, 34, 2.4, 2, { glow: true, sc: d });
  } });
SP('coppet', 'Coppet', ['Steel'], 300, 'wall', { evo: [32, 'sovrain'], opener: 'tackle', extra: [[1, 'harden']],
  pal: { a: '#c87840', b: '#f0b078', c: '#8a4a20', d: '#5aa890' },
  dex: 'An old penny that came to life at the bottom of a wishing well. It grants no wishes, but it tries its best.',
  draw(g) { const { a, b, c, d } = g.P;
    g.l(27, 50, 25, 60, 1.6, c); g.l(37, 50, 39, 60, 1.6, c); g.e(24, 60.5, 3, 1.3, c); g.e(40, 60.5, 3, 1.3, c);
    g.l(19, 38, 12, 42, 1.6, c); g.l(45, 38, 52, 42, 1.6, c);
    g.c(32, 36, 15, a); g.c(32, 36, 12.5, b, { ring: false }); g.c(32, 36, 11.5, a, { ring: false });
    for (let k = 0; k < 24; k++) { const [x, y] = K.pt(32, 36, k * 15, 14); g.dot(x, y, .5, c); }
    g.e(38, 44, 3, 1.6, d, { ring: false }); g.e(26, 28, 2, 1, d, { ring: false });
    K.eyes(g, 27, 37, 35, 2.6, 1); g.mouth(30, 41, 34, 41, c); g.blush(23, 39, 1.3); g.blush(41, 39, 1.3);
  } });
SP('sovrain', 'Sovrain', ['Steel', 'Fairy'], 480, 'spec', { extra: [[36, 'dazzlinggleam'], [44, 'flashcannon']],
  pal: { a: '#e8b830', b: '#fff0a0', c: '#9a7010', d: '#c04070', e: '#80d0ff' },
  dex: 'A lucky golden coin that crowned itself. It floats above the crowd expecting to be bowed to, and it usually is.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.c(32, 38, 18, a); g.c(32, 38, 15, b, { ring: false }); g.c(32, 38, 14, a, { ring: false });
    for (let k = 0; k < 30; k++) { const [x, y] = K.pt(32, 38, k * 12, 16.5); g.dot(x, y, .6, c); }
    g.p([20, 20, 22, 10, 27, 16, 32, 6, 37, 16, 42, 10, 44, 20], a); g.p([20, 20, 44, 20, 44, 23, 20, 23], c);
    K.spots(g, [[22, 10, 1.5], [32, 6, 1.7], [42, 10, 1.5]], d); g.c(32, 21.5, 1.4, e, { ring: false });
    K.eyes(g, 26.5, 37.5, 36, 2.5, 2, { glow: true, sc: e });
    g.face(() => g.mouth(28, 44, 36, 43.5, c)); K.shine(g, 22, 30);
    for (const [x, y] of [[8, 30], [56, 44], [10, 50]]) { g.c(x, y, 2.2, e); K.shine(g, x - .5, y - .5); }
  } });
SP('kettlet', 'Kettlet', ['Fire', 'Steel'], 300, 'spec', { evo: [30, 'locomotor'], opener: 'tackle',
  pal: { a: '#a8b4c8', b: '#e0e8f4', c: '#5a6478', d: '#2a2a34', e: '#ff7030', f: '#f0f4ff' },
  dex: 'It whistles cheerfully whenever it is time for tea. Kettlet is found in almost every kitchen in Brackenshire.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.e(32, 58, 12, 2.5, c);
    g.l(20, 42, 8, 30, 3, a); g.l(8, 30, 5, 27, 2, a);
    g.e(32, 44, 14, 13, a); g.e(26, 38, 5, 6, b, { ring: false }); g.e(32, 56, 13, 2.5, e, { ring: false });
    g.p([22, 26, 32, 20, 42, 26], d); g.c(32, 19, 2.2, d);
    K.tail(g, [22, 32, 22, 24, 30, 16, 40, 16, 44, 24, 44, 32], 1.6, 1.6, d);
    for (const [x, y, r] of [[4, 22, 2.5], [2, 16, 3.2], [6, 11, 2.6]]) g.c(x, y, r, f, { ring: false });
    K.eyes(g, 27, 37, 42, 2.6, 1); g.mouth(30, 48, 34, 48.5, c); g.blush(22, 46, 1.4); g.blush(42, 46, 1.4);
  } });
SP('locomotor', 'Locomotor', ['Fire', 'Steel'], 485, 'phys', { extra: [[36, 'wildcharge'], [44, 'flareblitz']], opener: 'tackle',
  pal: { a: '#2a6a4a', b: '#3a8a60', c: '#1a2a24', d: '#d8b040', e: '#ff6a20', f: '#e8e8f0', h: '#a02020' },
  dex: 'A bull with a steam boiler for a body. It thunders along the old railway lines at dawn, whistle screaming.',
  draw(g) { const { a, b, c, d, e, f, h } = g.P;
    for (const [x, y, r] of [[14, 6, 3], [8, 2, 3.5], [18, 1, 2.5]]) g.c(x, y, r, f, { ring: false });
    g.p([10, 26, 14, 8, 20, 8, 20, 26], c); g.p([9, 8, 21, 8, 21, 11, 9, 11], d);
    for (const [x] of [[18], [34], [50]]) { g.c(x, 54, 8, c); g.c(x, 54, 5.5, h, { ring: false }); g.c(x, 54, 2, d, { ring: false }); g.l(x - 5, 54, x + 5, 54, .6, d, { ring: false, shade: false }); }
    g.l(18, 54, 50, 54, 1.4, f);
    g.p([6, 44, 6, 22, 46, 22, 46, 44], a); g.p([8, 26, 44, 26, 44, 29, 8, 29], b, { ring: false });
    for (const x of [16, 28, 40]) g.l(x, 22, x, 44, 1, d, { ring: false });
    g.p([40, 44, 40, 14, 60, 14, 60, 44], a); g.p([44, 18, 56, 18, 56, 28, 44, 28], '#ffe8a0'); g.p([38, 12, 62, 12, 62, 16, 38, 16], c);
    g.c(6, 33, 10, c); g.c(6, 33, 7.5, b, { ring: false });
    K.horn(g, 0, 26, -60, 9, 2, f, -30); K.horn(g, 10, 24, 20, 8, 2, f, 30);
    K.eye1(g, 3, 31, 2.2, 2, { brow: c, sc: '#fff0a0' }); g.face(() => { g.c(2, 38, 1.6, e, { ring: false }); g.p([-2, 44, 12, 44, 8, 48, 2, 48], d); });
  } });
SP('snowpip', 'Snowpip', ['Ice', 'Flying'], 280, 'fast', { evo: [24, 'ptarmagale'], opener: 'peck',
  pal: { a: '#f8f8fc', b: '#c89a60', c: '#303038', d: '#e8a040', e: '#b8d0e8' },
  dex: 'Flocks of them twitter on the snowy fells. They fluff up into little round balls when the wind blows cold.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(29, 53, 28, 60, .9, c, { ring: false }); g.l(35, 53, 36, 60, .9, c, { ring: false });
    K.ear(g, 44, 46, 110, 8, 3, c); g.c(32, 44, 13, a); g.e(38, 44, 7, 6, b); g.e(41, 47, 4, 3, c); g.e(30, 50, 8, 4, e, { ring: false });
    g.e(30, 32, 7, 3, b, { ring: false }); g.p([17, 41, 22, 39, 22, 43], d);
    K.eye1(g, 25, 39, 2.8, 1); g.blush(27, 44, 1.4);
  } });
SP('ptarmagale', 'Ptarmagale', ['Ice', 'Flying'], 450, 'fast', { extra: [[34, 'icebeam']], opener: 'peck',
  pal: { a: '#f4f6fc', b: '#d0dcec', c: '#2a2a34', d: '#e84040', e: '#9ad8f8' },
  dex: 'Its feathers turn white as snow each winter. It bursts from the drifts in a blizzard of its own making.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.wing(g, 38, 32, 58, 26, 0, a, b, 5); g.p([56, 34, 62, 40, 55, 40], c);
    g.e(26, 58, 5, 3, a); g.e(38, 58, 5, 3, a); K.spikes(g, 26, 58, 3, 150, 210, 3, 2, a, 1); K.spikes(g, 38, 58, 3, 150, 210, 3, 2, a, 1);
    K.ear(g, 44, 46, 120, 11, 3.5, c);
    g.e(32, 44, 14, 13, a); g.e(38, 44, 8, 10, b);
    g.c(24, 28, 9, a); g.p([12, 29, 17, 27, 17, 31], c); g.e(26, 23, 4, 1.6, d);
    K.eye1(g, 23, 27, 2.3, 2, { brow: d, sc: '#fff', pupil: c });
    for (const [x, y] of [[8, 14], [50, 12], [58, 26], [6, 40]]) { g.l(x - 2, y, x + 2, y, .5, e, { ring: false, shade: false }); g.l(x, y - 2, x, y + 2, .5, e, { ring: false, shade: false }); }
  } });
SP('stoatling', 'Stoatling', ['Ice'], 290, 'fast', { evo: [30, 'erminess'], opener: 'scratch',
  pal: { a: '#f8f8f4', b: '#e0e0e8', c: '#2a2a30', d: '#ffb0b8', e: '#c8a070' },
  dex: 'Its coat is brown in summer and pure white in winter. Only the black tip of its tail gives it away in the snow.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [48, 47, 54, 43, 57, 35], 2.5, 2, a); g.c(57, 33, 3, c);
    g.l(44, 49, 45, 57, 1.8, b); g.l(28, 49, 27, 57, 1.8, b);
    K.tail(g, [48, 47, 40, 49, 32, 49, 25, 45], 6, 5.5, a); g.e(36, 51, 8, 2.5, b, { ring: false });
    g.l(46, 51, 47, 58, 1.9, a); g.l(31, 51, 31, 58, 1.9, a); g.e(47, 58.5, 2, 1, b); g.e(31, 58.5, 2, 1, b);
    K.earR(g, 14, 32, 3.2, a, d); K.earR(g, 23, 31, 3.2, a, d);
    g.e(18, 38, 8, 7, a); g.e(12, 41, 4.5, 3, b); g.face(() => g.dot(8.5, 40, 1.3, c));
    K.eye1(g, 15.5, 36, 2.6, 1); g.blush(19, 42, 1.3);
  } });
SP('erminess', 'Erminess', ['Ice'], 470, 'fast', { extra: [[36, 'icebeam']], opener: 'scratch',
  pal: { a: '#fafaf8', b: '#e0e4ec', c: '#1e1e26', d: '#ffb0c0', e: '#9ad8f8', f: '#b83a50' },
  dex: 'Royal robes were once trimmed with fur like hers. She carries herself like a queen, and the frost bows as she passes.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.tail(g, [52, 44, 58, 38, 61, 28], 3, 2.6, a); g.c(61, 26, 3.4, c);
    g.l(46, 48, 47, 58, 2, b); g.l(28, 48, 27, 58, 2, b);
    K.tail(g, [52, 44, 42, 46, 32, 46, 24, 40], 7.5, 6.5, a);
    g.p([24, 35, 44, 37, 51, 43, 45, 50, 30, 48, 21, 43], f); for (const [x, y] of [[29, 41], [35, 43], [41, 44], [46, 45]]) { g.c(x, y, 1.4, a, { ring: false }); g.dot(x, y, .6, c); }
    g.l(48, 50, 49, 60, 2.2, a); g.l(32, 50, 31, 60, 2.2, a); g.e(49, 60.5, 2.2, 1, b); g.e(31, 60.5, 2.2, 1, b);
    K.earR(g, 13, 25, 3.5, a, d); K.earR(g, 23, 24, 3.5, a, d);
    g.e(18, 31, 8.5, 7.5, a); g.e(11, 34, 4.5, 3, b); g.face(() => g.dot(7, 33, 1.4, c));
    for (let k = 0; k < 5; k++) K.crystal(g, 13 + k * 3, 23.5, 1.2, 4 + (k % 2) * 3, (k - 2) * 12, e);
    K.eye1(g, 16, 30, 2.4, 2, { brow: a, sc: '#fff', pupil: '#304080' });
  } });
SP('frostling', 'Frostling', ['Ice'], 300, 'wall', { evo: [34, 'rimeguard'], opener: 'pound', extra: [[1, 'powdersnow']],
  pal: { a: '#f8fbff', b: '#d8e4f0', c: '#2a2a34', d: '#f08030', e: '#c83838', f: '#6a4a30' },
  dex: 'It appears in gardens after the first heavy snowfall. By spring it has melted away, promising to come back.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(20, 40, 10, 32, 1, f); g.l(12, 34, 9, 30, .8, f); g.l(44, 40, 54, 32, 1, f); g.l(52, 34, 56, 31, .8, f);
    g.c(32, 48, 13, a); g.e(36, 52, 7, 5, b, { ring: false }); K.spots(g, [[32, 42, 1.3], [32, 48, 1.3], [32, 54, 1.3]], c);
    g.l(22, 36, 42, 38, 2.4, e); g.l(38, 38, 42, 46, 2, e);
    g.c(32, 28, 9.5, a); g.e(36, 32, 5, 3, b, { ring: false });
    g.e(32, 20, 8, 3, c); g.p([26, 20, 27, 12, 37, 12, 38, 20], c);
    K.eyes(g, 28, 36, 27, 2, 1, { col: c }); g.face(() => { g.p([31, 30, 32, 29, 24, 31.5], d, { ring: false }); g.mouth(29, 34, 35, 34, c); });
  } });
SP('rimeguard', 'Rimeguard', ['Ice', 'Steel'], 500, 'tank', { extra: [[40, 'iciclecrash'], [46, 'irondefense']],
  pal: { a: '#e8f2fc', b: '#b8d0e8', c: '#5a7898', d: '#9ae0ff', e: '#2a3a58' },
  dex: 'An old snowman that never melted. Ice has hardened over it like armour, and it guards the mountain passes.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(22, 60, 8, 3, b); g.e(42, 60, 8, 3, b);
    g.l(54, 60, 58, 6, 1.4, c); K.crystal(g, 58, 8, 2.5, 10, 0, d);
    g.c(32, 46, 16, a); g.p([18, 40, 26, 34, 38, 34, 46, 40, 44, 52, 20, 52], b, { ring: false }); g.l(20, 44, 44, 44, .8, c, { ring: false, shade: false });
    g.l(18, 38, 8, 48, 4, b); g.c(7, 50, 4, a); g.l(46, 38, 56, 44, 4, b); g.c(57, 45, 3.5, a);
    K.spikes(g, 32, 34, 15, -90, -10, 3, 7, d, 2.5); K.spikes(g, 32, 34, 15, 10, 90, 3, 7, d, 2.5);
    g.c(32, 22, 11, a); g.p([21, 24, 43, 24, 43, 30, 21, 30], b); g.p([20, 16, 26, 8, 38, 8, 44, 16, 44, 20, 20, 20], c);
    K.crystal(g, 32, 8, 2.5, 8, 0, d);
    K.eyes(g, 27.5, 36.5, 22, 2.2, 3, { glow: true, sc: d }); void e;
  } });
SP('flakelet', 'Flakelet', ['Ice'], 290, 'spec', { evo: [32, 'crystaflake'], opener: 'pound', extra: [[1, 'powdersnow']],
  pal: { a: '#e0f4ff', b: '#ffffff', c: '#6ab0e0', d: '#a8e0ff', e: '#ffb8d8' },
  dex: 'A frost imp that nips at noses on cold mornings. It paints fern patterns on windowpanes with its fingertips while everyone sleeps.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(27, 52, 26, 60, 1.8, a); g.l(37, 52, 38, 60, 1.8, a); g.e(25, 61, 3, 1.3, d); g.e(39, 61, 3, 1.3, d);
    g.e(32, 46, 9, 9, a); g.e(32, 48, 5, 5, b, { ring: false });
    g.l(24, 42, 17, 38, 1.6, a); g.l(40, 42, 47, 36, 1.6, a);
    for (let k = 0; k < 6; k++) { const [x, y] = K.pt(49, 33, k * 60, 4); g.l(49, 33, x, y, .7, c, { ring: false }); }
    for (let k = 0; k < 7; k++) K.crystal(g, 23 + k * 3, 22 - Math.abs(k - 3) * 1.2, 1.4, 7 + (k % 2) * 3, (k - 3) * 14, k % 2 ? d : b);
    g.c(32, 30, 9.5, a); g.e(32, 33, 6, 3, b, { ring: false });
    K.ear(g, 22, 30, -80, 6, 2, a, d); K.ear(g, 42, 30, 80, 6, 2, a, d);
    K.eyes(g, 28, 36, 30, 2.3, 1, { col: '#2a4068' }); g.mouth(30, 35, 34, 34.5, c); g.blush(24.5, 33, 1.2); g.blush(39.5, 33, 1.2); void e;
  } });
SP('crystaflake', 'Crystaflake', ['Ice', 'Fairy'], 480, 'spec', { extra: [[40, 'moonblast'], [46, 'blizzard']],
  pal: { a: '#a8e0ff', b: '#ffffff', c: '#4a90d0', d: '#ffc0e0', e: '#e0f4ff' },
  dex: 'It dances on the northern lights. Where it passes, frost blooms into lacy patterns on every window.',
  draw(g) { const { a, b, c, d, e } = g.P;
    for (let k = 0; k < 6; k++) { const an = k * 60 + 30; const [x, y] = K.pt(32, 30, an, 18); g.l(32, 30, x, y, 1, e); K.crystal(g, x, y, 2, 7, an, k % 2 ? a : d); }
    K.bugwing(g, 18, 24, 10, 5, -50, e, c); K.bugwing(g, 46, 24, 10, 5, 50, e, c);
    g.p([24, 60, 28, 40, 36, 40, 40, 60, 32, 56], a); g.p([26, 58, 29, 44, 35, 44, 38, 58, 32, 55], b, { ring: false });
    g.l(26, 40, 20, 48, 1.4, a); g.l(38, 40, 44, 48, 1.4, a);
    g.c(32, 30, 9, b); K.crystal(g, 32, 22, 3, 9, 0, a); K.crystal(g, 26, 23, 2, 6, -40, a); K.crystal(g, 38, 23, 2, 6, 40, a);
    K.eyes(g, 28.5, 35.5, 31, 2.3, 2, { sc: '#fff', pupil: c, brow: b }); g.blush(26, 35, 1.2); g.blush(38, 35, 1.2);
  } });
SP('kidstone', 'Kidstone', ['Rock'], 300, 'phys', { evo: [28, 'billycrag'], opener: 'tackle',
  pal: { a: '#e8e0d0', b: '#c0b8a8', c: '#8a8278', d: '#5a5048', e: '#ffb0a0' },
  dex: 'It leaps from ledge to ledge with no fear at all. Its stony nubs of horns are always bumping into things.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(42, 46, 44, 60, 2, b); g.l(26, 46, 24, 60, 2, b); g.e(48, 39, 2.5, 3, a);
    g.e(36, 42, 12, 8, a); g.e(38, 38, 7, 3, lt(a, .2), { ring: false });
    g.l(45, 46, 46, 60, 2.2, a); g.l(29, 46, 28, 60, 2.2, a); for (const x of [24, 28, 44, 46]) g.e(x, 61, 2.2, 1, d);
    g.l(26, 38, 22, 30, 4, a);
    K.earL(g, 16, 24, -110, 8, 2.2, a, e); K.earL(g, 26, 22, 80, 7, 2.2, a, e);
    K.horn(g, 18, 20, -20, 6, 2.2, c); K.horn(g, 23, 19, 15, 6, 2.2, c);
    g.e(19, 26, 7, 6, a); g.e(13, 29, 4, 3, b); g.face(() => g.dot(10.5, 28, 1.2, d));
    K.eye1(g, 18, 25, 2.5, 1); g.blush(20, 29, 1.3);
  } });
SP('billycrag', 'Billycrag', ['Rock', 'Fighting'], 485, 'phys', { extra: [[36, 'headsmash'], [42, 'closecombat']], opener: 'tackle',
  pal: { a: '#d8d0c0', b: '#b0a898', c: '#7a746a', d: '#4a4038', e: '#e8e4dc' },
  dex: 'The king of the crags. It butts heads with rivals so hard the crack echoes across three valleys.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(46, 42, 48, 60, 3, b); g.l(26, 44, 24, 60, 3, b); g.e(54, 32, 3, 3.5, a);
    g.e(38, 38, 16, 11, a); K.spikes(g, 38, 38, 14, 150, 210, 4, 4, e, 2);
    g.l(49, 44, 50, 60, 3.2, a); g.l(30, 45, 29, 60, 3.2, a); for (const x of [24, 29, 48, 50]) g.e(x, 61, 2.8, 1.2, d);
    g.l(26, 34, 20, 24, 5, a);
    K.horn(g, 20, 14, -80, 14, 3.4, c, -120); K.horn(g, 24, 13, 40, 14, 3.4, c, 120);
    g.e(17, 21, 8, 7, a); g.e(10, 24, 4.5, 3.5, b); g.face(() => g.dot(7, 23, 1.4, d));
    K.tail(g, [14, 26, 14, 32, 12, 38], 2.4, 1.2, e);
    K.eye1(g, 16, 19, 2.3, 2, { brow: a, sc: '#ffe070', pupil: d });
  } });
SP('eaglet', 'Eaglet', ['Flying'], 300, 'phys', { evo: [34, 'aquilord'], opener: 'peck',
  pal: { a: '#b88a50', b: '#f0e0c0', c: '#6a4a28', d: '#f0c030', e: '#fff8e8' },
  dex: 'A fluffy chick that already thinks it is the king of the sky. It practises its fiercest glare on passing sheep.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(28, 54, 27, 61, 1.4, d); g.l(35, 54, 36, 61, 1.4, d);
    K.ear(g, 43, 50, 115, 8, 3, c);
    for (const [x, y, r] of [[32, 46, 12], [24, 42, 5], [40, 42, 5], [26, 52, 5], [38, 52, 5]]) g.c(x, y, r, e);
    g.e(40, 46, 6, 7, a); g.e(24, 46, 5, 6, a);
    g.c(30, 30, 10, e); K.spikes(g, 30, 30, 9, -40, 40, 3, 4, e, 2);
    g.p([16, 30, 23, 27, 23, 34], d); g.p([16, 30, 18, 34, 20, 33], dk(d, .15));
    K.eye1(g, 27, 28, 2.8, 2, { brow: c }); void b;
  } });
SP('aquilord', 'Aquilord', ['Flying', 'Fighting'], 500, 'phys', { extra: [[40, 'bravebird'], [46, 'closecombat']], opener: 'peck',
  pal: { a: '#6a4a2a', b: '#c89a50', c: '#3a2814', d: '#f0c030', e: '#f8f0e0' },
  dex: 'It rules the highest peaks. From a mile up it can spot a Burrabit twitching its nose in the heather.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.wing(g, 36, 26, 55, 30, 0, a, c, 6); K.wing(g, 28, 26, -55, 30, 0, a, c, 6);
    g.l(27, 50, 25, 60, 2, d); g.l(37, 50, 39, 60, 2, d); for (const x of [22, 25, 28, 36, 39, 42]) g.l(x + (x < 32 ? 3 : -3), 60, x, 62, .8, c);
    K.ear(g, 32, 52, 180, 10, 5, a);
    g.e(32, 40, 11, 13, a); g.e(32, 42, 6, 9, lt(a, .15), { ring: false });
    g.c(30, 22, 9, b); K.spikes(g, 30, 24, 8, 100, 200, 3, 4, b, 2);
    g.p([16, 22, 24, 18, 24, 27], d); g.p([16, 22, 17, 26, 20, 25], dk(d, .2));
    K.eye1(g, 27, 20, 2.3, 3, { brow: b, sc: '#ffe070', pupil: c }); void e;
  } });