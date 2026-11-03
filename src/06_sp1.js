// ---- sp1 ----
// ================= NEW SPECIES: WOODS, CITY & COAST =================
SP('scurrip', 'Scurrip', ['Normal'], 290, 'fast', { evo: [18, 'squirrage'], opener: 'scratch',
  pal: { a: '#c86c38', b: '#fff0dc', c: '#8a4424', d: '#7a5028', e: '#d8a060', f: '#ffb0a0' },
  dex: 'It buries acorns all over the woods and forgets where most of them are. Many an oak has Scurrip to thank.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.bushy(g, 42, 54, 12, 34, 9, a, lt(a, .2)); g.c(47, 21, 8, a); g.c(44.5, 18.5, 4, lt(a, .2), { ring: false });
    g.e(32, 47, 11, 12, a); g.e(29, 50, 6.5, 8, b, { ring: false });
    g.e(24, 59.5, 5, 2.5, c); g.e(37, 59.5, 5, 2.5, c);
    g.l(23, 43, 27, 46, 2, a); g.l(36, 43, 32, 46, 2, a);
    g.e(29, 45.5, 3.4, 4, e); g.e(29, 41.8, 4, 2, d); g.l(29, 40, 30, 38, .6, d, { ring: false });
    K.ear(g, 20, 21, -22, 10, 3.6, a, f); K.ear(g, 35, 20, 20, 10, 3.6, a, f);
    g.c(28, 29, 11, a); g.e(24, 34, 6, 4, b);
    K.eyes(g, 23, 32, 28, 3.1, 1);
    g.face(() => { g.dot(24.5, 33, 1.3, '#3a1c1c'); g.mouth(24, 36, 26.5, 37); }); g.blush(19, 33, 1.8); g.blush(37, 33, 1.8);
  } });
SP('squirrage', 'Squirrage', ['Normal'], 470, 'fast', { opener: 'scratch', extra: [[30, 'swordsdance']],
  pal: { a: '#b85c2c', b: '#fff0dc', c: '#6a3418', d: '#6a4422', e: '#d8a060', f: '#ffb0a0' },
  dex: 'It guards its winter hoard with terrifying fury. Its tail can puff up to twice its size when it is angry.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.bushy(g, 44, 58, 16, 50, 13, a, lt(a, .2)); K.spikes(g, 52, 28, 11, -50, 100, 6, 5, a, 3);
    g.e(30, 45, 12, 14, a); g.e(28, 48, 7, 10, b, { ring: false });
    g.e(23, 59.5, 6.5, 3, c); g.e(38, 59.5, 6.5, 3, c); g.l(36, 38, 41, 46, 3, a);
    K.ear(g, 20, 16, -18, 12, 4, a, f); K.ear(g, 35, 15, 18, 12, 4, a, f); K.ear(g, 17, 6, -18, 4, 1.6, c); K.ear(g, 38, 5, 18, 4, 1.6, c);
    g.c(28, 24, 11.5, a); g.e(21, 29, 7, 5.5, b); g.e(35, 29, 5.5, 5, b);
    g.l(20, 38, 15, 45, 3.2, a); g.e(13, 49, 4.5, 5.5, e); g.e(13, 44.5, 5, 2.4, d);
    K.eyes(g, 23, 32, 23, 2.7, 2);
    g.face(() => { g.dot(22.5, 28, 1.3, '#2a1414'); g.p([25, 31, 29, 31, 28.5, 35, 25.5, 35], '#ffffff', { oc: '#8a7a70' }); });
  } });
SP('pucklet', 'Pucklet', ['Fairy'], 290, 'spec', { evo: [16, 'pucksprite'], opener: 'pound',
  pal: { a: '#f6dce2', b: '#6cc05a', c: '#3a8a40', d: '#d4b8f8', e: '#ffb8c8' },
  dex: 'A mischievous woodland sprite. It ties bootlaces together and hides car keys, then giggles from the hedge.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.bugwing(g, 43, 38, 9, 5, 40, d, '#9a80d0'); K.bugwing(g, 19, 38, 9, 5, -40, d, '#9a80d0');
    g.l(28, 55, 27, 61, 1.6, a); g.l(34, 55, 35, 61, 1.6, a);
    g.e(31, 49, 9, 9, b); K.leaf(g, 24, 53, -150, 8, 3.5, b, c); K.leaf(g, 38, 53, 150, 8, 3.5, b, c); K.leaf(g, 31, 55, 180, 7, 3.5, c);
    g.l(23, 45, 19, 49, 1.6, a); g.l(39, 45, 43, 49, 1.6, a);
    K.ear(g, 21, 31, -75, 10, 3.2, a, e); K.ear(g, 41, 31, 75, 10, 3.2, a, e);
    g.c(31, 31, 11, a);
    g.e(31, 22, 11.5, 5.5, b); g.e(31, 20, 8, 3, lt(b, .25), { ring: false }); g.l(32, 16, 35, 11, 1, c); K.leaf(g, 35, 12, 60, 6, 2.5, b);
    K.eyes(g, 26, 36, 32, 3.5, 1); g.blush(22, 36, 1.8); g.blush(40, 36, 1.8); g.mouth(30, 38, 32, 38.5);
  } });
SP('pucksprite', 'Pucksprite', ['Fairy'], 405, 'sspd', { evo: [32, 'oberwick'], opener: 'pound',
  pal: { a: '#f0d4dc', b: '#58b04c', c: '#2e7a36', d: '#c8b0f8', e: '#ffb0c8', f: '#fff49a' },
  dex: 'It leads travellers in circles through the woods with its glowing twig. It only stops once they laugh at themselves.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.bugwing(g, 44, 27, 11, 6, 35, d, '#9a80d0'); K.bugwing(g, 45, 41, 9, 4.5, 70, d, '#9a80d0'); K.bugwing(g, 18, 27, 11, 6, -35, d, '#9a80d0'); K.bugwing(g, 17, 41, 9, 4.5, -70, d, '#9a80d0');
    g.l(28, 50, 27, 61, 1.8, a); g.l(34, 50, 36, 61, 1.8, a);
    g.p([22, 56, 26, 36, 36, 36, 40, 56, 35, 53, 31, 57, 27, 53], b); g.l(26, 41, 36, 41, 1, c, { ring: false });
    g.l(26, 38, 22, 45, 1.7, a); g.l(36, 38, 43, 33, 1.7, a); g.l(44, 34, 46, 20, .9, '#8a5a30'); g.c(46.5, 18, 2.8, f); K.shine(g, 45.5, 17);
    K.ear(g, 23, 24, -78, 10, 2.8, a, e); K.ear(g, 39, 24, 78, 10, 2.8, a, e);
    g.c(31, 25, 9, a); g.e(31, 18, 9.5, 5, c); K.leaf(g, 27, 15, -35, 9, 3, b); K.leaf(g, 34, 14, 25, 9, 3, b);
    K.eyes(g, 27, 35, 26, 2.8, 2, { brow: c }); g.mouth(29, 30.5, 33, 30);
  } });
SP('oberwick', 'Oberwick', ['Fairy', 'Grass'], 530, 'spec', { opener: 'pound', extra: [[40, 'moonlight']],
  pal: { a: '#e8d0e0', b: '#4a9a48', c: '#2a5a30', d: '#c0e0ff', e: '#8a6038', f: '#f8d0f0', h: '#ffe070' },
  dex: 'The monarch of the fairy rings. On midsummer night it holds court in the oldest oak in the county.',
  draw(g) { const { a, b, c, d, e, f, h } = g.P;
    K.bugwing(g, 48, 22, 14, 8, 40, d, '#80a0d0'); K.bugwing(g, 50, 41, 11, 6, 75, d, '#80a0d0'); K.bugwing(g, 14, 22, 14, 8, -40, d, '#80a0d0'); K.bugwing(g, 12, 41, 11, 6, -75, d, '#80a0d0');
    g.p([17, 62, 24, 30, 38, 30, 46, 62], b); for (let i = 0; i < 5; i++) K.leaf(g, 20 + i * 6.5, 59, 180, 5, 2.5, c);
    K.leaf(g, 26, 31, -120, 8, 3, c); K.leaf(g, 36, 31, 120, 8, 3, c);
    g.l(24, 34, 17, 44, 2, b); g.l(38, 34, 44, 42, 2, b); g.c(16.5, 45, 2, a); g.c(44.5, 43, 2, a);
    g.l(46, 52, 47, 14, 1.1, e); g.c(47, 12, 3, h); K.shine(g, 46, 11);
    g.l(23, 20, 22, 33, 2.5, c); g.l(39, 20, 40, 33, 2.5, c);
    g.c(31, 22, 8.5, a); g.e(31, 16.5, 9.5, 5, c);
    K.horn(g, 26, 14, -30, 11, 1.6, e, -20); K.horn(g, 36, 14, 30, 11, 1.6, e, 20); K.horn(g, 23, 9, -75, 5, 1, e); K.horn(g, 39, 9, 75, 5, 1, e);
    g.c(28.5, 12.5, 1.8, f); g.c(33.5, 12.5, 1.8, f);
    K.ear(g, 23, 22, -80, 7, 2.2, a, '#ffb0c8'); K.ear(g, 39, 22, 80, 7, 2.2, a, '#ffb0c8');
    K.eyes(g, 27.5, 34.5, 23, 2.5, 3, { glow: true, sc: '#e8ffd0' });
  } });
SP('slimble', 'Slimble', ['Bug'], 270, 'wall', { evo: [22, 'shellump'],
  pal: { a: '#c8c090', b: '#b8743c', c: '#e8c890', d: '#6a4020', e: '#3a3028' },
  dex: 'It comes out after rain to nibble lettuces. Gardeners grumble, but its silver trails glitter beautifully at dawn.',
  draw(g) { const { a, b, c } = g.P;
    g.e(34, 57, 24, 5, a); g.c(40, 40, 15, b); g.c(41, 40, 10.5, c, { ring: false }); g.c(42, 40, 7, b, { ring: false }); g.c(43, 40, 4.2, c, { ring: false }); g.c(43.5, 40, 1.8, b, { ring: false });
    g.l(18, 56, 14, 41, 6, a); g.c(14, 38, 7, a);
    g.l(12, 33, 9, 25, 1.2, a); g.l(16, 33, 18, 25, 1.2, a); g.c(9, 23, 2.8, a); g.c(18, 23, 2.8, a);
    g.eye(9, 23, 1.9); g.eye(18, 23, 1.9); g.mouth(9, 41, 13, 42); g.blush(13, 39, 1.5);
  } });
SP('shellump', 'Shellump', ['Bug', 'Rock'], 440, 'tank',
  { pal: { a: '#a8a878', b: '#7a7a82', c: '#a0a0a8', d: '#5a8a3a', e: '#68d8f0' },
    dex: 'Its shell grows heavier each year with pebbles and moss. Crystals sprout on the oldest ones.',
    draw(g) { const { a, b, c, d, e } = g.P;
      g.e(34, 58, 27, 5, a); g.c(38, 36, 20, b); g.c(39, 36, 13.5, c, { ring: false }); g.c(40, 36, 8.5, b, { ring: false }); g.c(41, 36, 4, c, { ring: false });
      g.e(29, 19, 7, 3, d); g.e(51, 23, 5, 2.5, d);
      K.crystal(g, 44, 18, 3, 10, 15, e); K.crystal(g, 36, 18, 2.5, 8, -10, e); K.crystal(g, 53, 24, 2.5, 8, 45, e);
      g.l(18, 56, 12, 39, 7, a); g.c(12, 37, 8, a);
      g.l(10, 31, 6, 21, 1.4, a); g.l(15, 31, 17, 21, 1.4, a); g.c(6, 20, 2.6, a); g.c(17, 20, 2.6, a);
      g.eye(6, 20, 1.9, 'glow', { sc: '#fff4c0' }); g.eye(17, 20, 1.9, 'glow', { sc: '#fff4c0' }); g.mouth(6, 41, 11, 41.5);
    } });
SP('crowlet', 'Crowlet', ['Dark', 'Flying'], 280, 'fast', { evo: [20, 'ravenor'], opener: 'peck',
  pal: { a: '#34344a', b: '#50506a', c: '#f0c040', d: '#8a60d8', e: '#7a7a88' },
  dex: 'It collects shiny things: bottle caps, buttons, the odd wedding ring. It never gives anything back.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(27, 54, 26, 61, 1, e, { ring: false }); g.l(34, 54, 35, 61, 1, e, { ring: false });
    K.ear(g, 44, 50, 115, 10, 3, a); K.ear(g, 42, 53, 140, 9, 3, b);
    g.e(32, 45, 12, 11, a); g.e(38, 46, 7, 6, b); g.l(35, 43, 41, 47, .7, d, { ring: false, shade: false });
    K.ear(g, 29, 20, -12, 7, 2.2, a); K.ear(g, 32, 20, 18, 6, 2, a);
    g.c(28, 30, 10, a); g.p([13, 31, 20, 27.5, 20, 34], c);
    K.eye1(g, 24, 29, 2.9, 1); g.blush(25, 35, 1.4);
  } });
SP('ravenor', 'Ravenor', ['Dark', 'Flying'], 470, 'sweep', { opener: 'peck', extra: [[34, 'nightslash']],
  pal: { a: '#282838', b: '#40405a', c: '#e8b030', d: '#9a70e8', e: '#e04040', f: '#5a5a68' },
  dex: 'Legend says that if the ravens ever leave Ironhold Castle, the kingdom will fall. Ravenor has never shown any sign of leaving.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(28, 52, 27, 61, 1.2, f); g.l(36, 52, 37, 61, 1.2, f); g.l(24, 61, 30, 61, .8, f); g.l(34, 61, 40, 61, .8, f);
    K.ear(g, 46, 50, 125, 14, 4, a); K.ear(g, 44, 53, 145, 12, 3.5, b);
    K.wing(g, 40, 30, 72, 27, 0, b, a, 5);
    g.e(33, 40, 12, 15, a); K.spikes(g, 27, 33, 5, 170, 255, 4, 5, b, 2.5);
    g.e(37, 43, 8, 12, b); K.ear(g, 39, 54, 172, 6, 3, b); g.l(34, 37, 39, 48, .6, d, { ring: false, shade: false });
    g.c(28, 22, 9, a); K.spikes(g, 30, 21, 8, -35, 30, 3, 6, a, 2.5);
    g.p([10, 24, 20, 19.5, 21, 27], c); g.l(13, 24, 20, 24, .4, dk(c, .4), { ring: false, shade: false });
    g.eye(25.5, 21, 2.4, 'cool', { side: -1, brow: a, sc: '#ffe0a0', pupil: e });
  } });
SP('fawnet', 'Fawnet', ['Grass'], 300, 'bal', { evo: [26, 'oakhart'],
  pal: { a: '#c8905a', b: '#fff4e0', c: '#62b050', d: '#5a3a20', e: '#3a8a40' },
  dex: 'Its dappled coat hides it in sun-speckled glades. It nibbles clover and never strays far from its mother.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(41, 48, 42, 60, 2, dk(a, .15)); g.l(25, 48, 24, 60, 2, dk(a, .15)); g.e(49, 39, 3, 3.5, b);
    g.e(36, 42, 13, 8, a); K.spots(g, [[34, 38, 1.3], [39, 40, 1.3], [43, 37, 1.2], [31, 41, 1.1], [45, 42, 1.1]], b);
    g.l(44, 48, 45, 60, 2.2, a); g.l(29, 48, 28, 60, 2.2, a); g.e(45, 61, 2.4, 1.1, d); g.e(28, 61, 2.4, 1.1, d);
    g.l(26, 38, 22, 29, 4, a); K.leaf(g, 21, 19, -60, 11, 3.2, c, e); K.leaf(g, 24, 18, 30, 11, 3.2, c, e);
    g.e(19, 24, 7, 6.5, a); g.e(13, 27, 4, 3, b); g.face(() => g.dot(9.5, 26, 1.3, d));
    K.eye1(g, 18, 23, 2.8, 1); g.blush(20, 28, 1.5);
  } });
SP('oakhart', 'Oakhart', ['Grass', 'Fighting'], 500, 'phys', { extra: [[36, 'bulkup']],
  pal: { a: '#9a6a40', b: '#e8d8b8', c: '#4a8a3a', d: '#3a2410', e: '#2e6a2e', f: '#7a5030', h: '#c8a060' },
  dex: 'Its antlers are gnarled oak, hung with acorns. Rival stags lock horns in autumn so fiercely that the whole valley echoes.',
  draw(g) { const { a, b, c, d, e, f, h } = g.P;
    g.l(46, 44, 48, 60, 3, dk(a, .2)); g.l(24, 46, 22, 60, 3, dk(a, .2)); g.e(54, 34, 3, 3.5, b);
    g.e(38, 38, 16, 11, a); g.e(26, 41, 8, 10, b);
    g.l(49, 44, 50, 60, 3.4, a); g.l(30, 46, 29, 60, 3.4, a); g.e(50, 61, 3, 1.3, d); g.e(29, 61, 3, 1.3, d);
    g.l(24, 34, 18, 23, 5.5, a); for (let i = 0; i < 5; i++) K.ear(g, 26 - i * 1.5, 38 - i * 3, 100, 6, 2.5, i % 2 ? c : e);
    K.horn(g, 16, 14, -25, 16, 2, f, -15); K.horn(g, 20, 13, 20, 18, 2, f, 25); K.horn(g, 12, 5, -80, 6, 1.4, f); K.horn(g, 26, 5, 70, 7, 1.4, f); K.horn(g, 9, 9, -120, 5, 1.2, f);
    for (const [x, y] of [[5, 5], [30, 3], [18, 1]]) { g.e(x, y + 1.5, 1.8, 2.2, h); g.e(x, y, 2.2, 1.2, f, { ring: false }); }
    g.e(15, 20, 7, 6, a); g.e(9, 23, 4, 3, dk(a, .1)); g.face(() => g.dot(5.5, 22, 1.5, d));
    K.eye1(g, 15, 18.5, 2.4, 2, { brow: a });
  } });
SP('spinnet', 'Spinnet', ['Bug', 'Poison'], 270, 'fast', { evo: [22, 'arachnell'],
  pal: { a: '#c89a40', b: '#fff0d0', c: '#5a3a20', d: '#a060c0' },
  dex: 'It weaves a new web every morning. Dew clings to the threads like strings of tiny pearls.',
  draw(g) { const { a, b, c, d } = g.P;
    const legs = [[26, 44, 15, 34, 10, 44], [26, 46, 13, 43, 8, 52], [27, 48, 15, 51, 11, 60], [29, 50, 20, 56, 17, 62]];
    for (const [x1, y1, x2, y2, x3, y3] of legs) { g.l(x1, y1, x2, y2, 1.2, c); g.l(x2, y2, x3, y3, 1.2, c); g.l(72 - x1, y1, 72 - x2, y2, 1.2, c); g.l(72 - x2, y2, 72 - x3, y3, 1.2, c); }
    g.c(36, 33, 12, a); g.l(36, 26, 36, 40, 1, b, { ring: false, shade: false }); g.l(30, 32, 42, 32, 1, b, { ring: false, shade: false });
    g.c(36, 48, 8.5, lt(a, .1));
    K.eyes(g, 32, 40, 47, 2.6, 1); g.face(() => { g.dot(34, 42.5, .8, '#221a30'); g.dot(38, 42.5, .8, '#221a30'); });
    g.l(33, 53, 32, 56.5, .9, d); g.l(39, 53, 40, 56.5, .9, d); g.blush(29, 51, 1.3); g.blush(43, 51, 1.3);
  } });
SP('arachnell', 'Arachnell', ['Bug', 'Poison'], 450, 'sweep',
  { pal: { a: '#6a3a8a', b: '#e8d040', c: '#2a1a30', d: '#a6e040', e: '#c8a0e0' },
    dex: 'It strings webs between church spires. Its venom is mild, but its stare could curdle milk.',
    draw(g) { const { a, b, c, d } = g.P;
      const legs = [[24, 40, 10, 22, 4, 48], [24, 44, 8, 34, 2, 60], [26, 48, 12, 48, 8, 62], [28, 50, 18, 56, 16, 63]];
      for (const [x1, y1, x2, y2, x3, y3] of legs) { g.l(x1, y1, x2, y2, 1.4, c); g.l(x2, y2, x3, y3, 1.2, c); g.l(64 - x1, y1, 64 - x2, y2, 1.4, c); g.l(64 - x2, y2, 64 - x3, y3, 1.2, c); }
      g.e(32, 28, 15, 13, a); K.spots(g, [[32, 23, 2.5], [27, 29, 1.8], [37, 29, 1.8], [32, 33, 1.4]], b); g.l(22, 20, 42, 20, .6, lt(a, .3), { ring: false, shade: false });
      g.c(32, 46, 9, a);
      K.eyes(g, 28, 36, 45, 2.6, 2, { sc: '#ffe040', brow: a }); g.face(() => { g.dot(30, 40, .9, '#ff4040'); g.dot(34, 40, .9, '#ff4040'); });
      g.l(29, 52, 28, 58, 1.1, d); g.l(35, 52, 36, 58, 1.1, d);
    } });
SP('plugpup', 'Plugpup', ['Electric'], 300, 'phys', { evo: [24, 'voltweiler'], opener: 'tackle',
  pal: { a: '#f0d040', b: '#fff8e0', c: '#404050', d: '#c89810', e: '#ff9aa8' },
  dex: 'It wags its plug-shaped tail so hard it sparks. Kingsbridge flats ban them after a few too many blown fuses.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(44, 54, 52, 46, 1.3, c); g.p([50, 42, 56, 40, 58, 46, 52, 48], c); g.l(55, 40.5, 57, 36, .7, '#c8c8d0'); g.l(57.5, 41.5, 59.5, 37.5, .7, '#c8c8d0');
    g.e(34, 48, 11, 10, a); g.e(31, 51, 6, 6, b, { ring: false }); g.e(42, 57, 5, 4, a);
    g.l(27, 52, 26, 61, 2.2, a); g.l(33, 53, 33, 61, 2.2, a);
    K.earL(g, 19, 23, -45, 12, 3.5, a); K.earL(g, 33, 22, 35, 12, 3.5, a); g.c(12, 17, 2.4, c); g.c(40, 15, 2.4, c);
    g.c(26, 31, 11, a); g.e(19, 35, 6, 4.5, b); g.face(() => g.dot(14.5, 33.5, 1.6, c));
    g.p([30, 32, 33.5, 28.5, 32, 32, 35, 31, 31, 35.5, 32.5, 32.5], d, { ring: false });
    K.eyes(g, 22, 30, 29, 2.9, 1); g.face(() => g.e(19, 39.5, 1.6, 1.8, e, { ring: false }));
  } });
SP('voltweiler', 'Voltweiler', ['Electric'], 480, 'phys', { extra: [[38, 'thunderfang']],
  pal: { a: '#303040', b: '#d88a40', c: '#ffe040', d: '#9090a0', e: '#ff5050' },
  dex: 'It guards Kingsbridge Power Station. Burglars report hearing a low growl, then seeing a very bright light.',
  draw(g) { const { a, b, c, d } = g.P;
    g.l(46, 46, 48, 60, 3.2, dk(a, .2)); g.l(24, 46, 22, 60, 3.2, dk(a, .2));
    g.l(52, 34, 56, 29, 2, a); g.p([56, 22, 60, 27, 58, 27.5, 62, 34, 55.5, 28.5, 58, 28], c, { oc: '#8a6a10' });
    g.e(37, 38, 17, 10, a); g.e(24, 42, 7, 7, b);
    g.l(49, 46, 50, 60, 3.4, a); g.l(29, 46, 28, 60, 3.4, a); g.e(50, 61, 3.5, 1.6, b); g.e(28, 61, 3.5, 1.6, b);
    g.l(20, 33, 27, 40, 2.6, d); K.spikes(g, 23.5, 36.5, 3, 205, 320, 3, 3, d, 1.5);
    K.ear(g, 16, 19, -20, 11, 3.5, a, c); K.ear(g, 24, 18, 15, 11, 3.5, a, c);
    g.e(18, 26, 9, 8, a); g.e(11, 30, 5.5, 4, b); g.face(() => g.dot(6.5, 28.5, 1.8, '#101018')); g.e(15, 21.5, 1.6, 1, b, { ring: false });
    K.eye1(g, 15, 24.5, 2.5, 2, { brow: a, sc: '#ffe880' });
    g.p([4, 40, 7, 37, 6, 40, 9, 39, 5, 44], c, { oc: '#8a6a10' });
  } });
SP('nutbolt', 'Nutbolt', ['Steel', 'Electric'], 310, 'spec', { evo: [28, 'dynacoil'], opener: 'tackle',
  pal: { a: '#a8b0c0', b: '#d8e0ec', c: '#5a6278', d: '#d88840', e: '#ffe040' },
  dex: 'Born from a spark in a dropped toolbox. It rattles around workshops, tightening itself onto anything that wobbles.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(25, 59, 3.5, 2, d); g.e(39, 59, 3.5, 2, d); g.l(26, 50, 25, 58, .9, d); g.l(38, 50, 39, 58, .9, d);
    K.tail(g, [19, 40, 13, 44, 10, 40], .9, .9, d); g.c(9, 38, 2.4, d); K.tail(g, [45, 40, 51, 44, 54, 40], .9, .9, d); g.c(55, 38, 2.4, d);
    g.p([29, 8, 35, 8, 35, 14, 29, 14], c); g.l(32, 14, 32, 30, 3, c); for (let y = 16; y < 30; y += 2.5) g.l(29.5, y, 34.5, y + 1, .5, lt(c, .35), { ring: false, shade: false });
    K.flame(g, 32, 5, 2, e, '#ffffff');
    const hx = []; for (let k = 0; k < 6; k++) { const an = Math.PI / 3 * k; hx.push(32 + Math.cos(an) * 15, 42 + Math.sin(an) * 13); } g.p(hx, a);
    g.p([20, 38, 26, 32, 38, 32, 44, 38], b, { ring: false }); g.c(32, 36, 3.2, c);
    K.eyes(g, 26, 38, 43, 2.6, 1); g.mouth(30, 48, 34, 48, c); g.blush(22, 46, 1.4); g.blush(42, 46, 1.4);
  } });
SP('dynacoil', 'Dynacoil', ['Steel', 'Electric'], 480, 'spec',
  { pal: { a: '#9aa2b4', b: '#d8dee8', c: '#5a6278', d: '#d88840', e: '#ffe040', f: '#4870e0' },
    dex: 'Its rotor spins faster the angrier it gets. One Dynacoil can light a whole village through a winter storm.',
    draw(g) { const { a, b, c, d, e, f } = g.P;
      g.e(22, 59, 6, 3, c); g.e(42, 59, 6, 3, c);
      g.l(16, 38, 8, 29, 2.6, c); K.horn(g, 7, 28, -40, 6, 2, d); K.horn(g, 9, 27, 20, 6, 2, f);
      g.l(48, 38, 56, 29, 2.6, c); K.horn(g, 55, 27, -20, 6, 2, f); K.horn(g, 57, 28, 40, 6, 2, d);
      g.e(32, 42, 16, 17, a);
      for (const y of [30, 35, 45, 50, 54]) { const hw = 16 * Math.sqrt(Math.max(0, 1 - ((y - 42) / 17) ** 2)) - 1.2; g.l(32 - hw, y, 32 + hw, y, 1.2, d, { ring: false }); }
      g.c(32, 40, 6.5, c); g.c(32, 40, 5, '#fff8c0', { ring: false }); g.eye(32, 40, 3.2, 'glow', { sc: e });
      g.l(32, 25, 32, 19, 2, c); K.re(g, 24, 17, 9, 2.2, -8, b); K.re(g, 40, 17, 9, 2.2, 8, b); g.c(32, 18, 2.6, c);
      g.p([48, 50, 51, 47, 50, 50, 53, 49, 49, 54], e, { oc: '#8a6a10' });
    } });
SP('moggle', 'Moggle', ['Normal'], 290, 'fast', { evo: [22, 'moggadon'], opener: 'scratch',
  pal: { a: '#d0a070', b: '#fff4e8', c: '#8a6038', d: '#ff9aa8' },
  dex: 'Every street in Kingsbridge has at least one. It visits six different houses for tea and each thinks it is theirs.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [44, 56, 52, 52, 54, 43, 50, 37], 3, 2.4, a);
    g.e(34, 48, 10, 11, a); g.e(31, 51, 6, 7, b, { ring: false }); K.stripes(g, 36, 43, 44, 7, 2, c);
    g.l(28, 52, 27, 61, 2.2, a); g.l(34, 53, 34, 61, 2.2, a); g.e(27, 61, 2.4, 1.2, b); g.e(34, 61, 2.4, 1.2, b);
    K.ear(g, 20, 24, -30, 9, 4, a, d); K.ear(g, 35, 23, 28, 9, 4, a, d);
    g.c(28, 31, 11, a); g.l(26, 21, 26, 25, .8, c, { ring: false, shade: false }); g.l(29, 20.5, 29, 25, .8, c, { ring: false, shade: false }); g.l(32, 21, 31.5, 25, .8, c, { ring: false, shade: false });
    g.e(26, 35.5, 5, 3.5, b); g.face(() => { g.dot(25, 33.5, 1.2, d); g.l(18, 35, 12, 34, .35, '#8a7a70', { ring: false, shade: false }); g.l(18, 37, 12, 38, .35, '#8a7a70', { ring: false, shade: false }); });
    K.eyes(g, 23, 32, 30, 3, 1); g.blush(20, 34, 1.5); g.blush(35, 34, 1.5);
  } });
SP('moggadon', 'Moggadon', ['Normal', 'Dark'], 460, 'sweep', { opener: 'scratch', extra: [[32, 'nightslash']],
  pal: { a: '#5a5058', b: '#b8b0b8', c: '#302830', d: '#e0507a', e: '#f0d040' },
  dex: 'The undisputed king of the back alleys. Its battle-scarred ear is a badge of honour among city cats.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [50, 40, 56, 32, 56, 22, 52, 16], 2.8, 2.2, a);
    g.l(45, 46, 46, 60, 2.6, dk(a, .2)); g.l(26, 47, 24, 60, 2.6, dk(a, .2));
    g.e(37, 39, 15, 9, a); K.stripes(g, 32, 48, 35, 6, 4, c);
    g.l(48, 46, 49, 60, 2.8, a); g.l(29, 47, 28, 60, 2.8, a); g.e(49, 61, 2.8, 1.2, b); g.e(28, 61, 2.8, 1.2, b);
    K.ear(g, 15, 24, -25, 10, 3.5, a, d); K.ear(g, 23, 23, 22, 8, 3.5, a, d);
    g.e(19, 31, 9, 8, a); g.e(13, 34, 4.5, 3.5, b); g.face(() => g.dot(9.5, 32.5, 1.3, d));
    K.eye1(g, 17, 29, 2.6, 2, { brow: a, sc: e, pupil: '#201820' });
    g.face(() => { g.l(16, 24.5, 20, 33, .5, '#e8d8d8', { ring: false, shade: false }); g.l(10, 36, 4, 35, .35, b, { ring: false, shade: false }); });
  } });
SP('zapeel', 'Zapeel', ['Water', 'Electric'], 300, 'spec', { evo: [28, 'fulgurel'],
  pal: { a: '#3a5a8a', b: '#e8e060', c: '#ffe040', d: '#8ab0e0' },
  dex: 'It lives in the canal under Kingsbridge. Fishermen who hook one get a tingle all the way up the line.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [18, 30, 26, 38, 34, 46, 42, 48, 50, 44, 56, 36], 5.5, 2.5, a);
    K.re(g, 40, 42.5, 6, 2, 15, d);
    g.e(16, 27, 8, 6.5, a); g.e(14, 31, 5, 2.5, b, { ring: false });
    K.spots(g, [[30, 41, 1.3], [40, 47, 1.2], [50, 43, 1.1]], c);
    g.p([55, 34, 60, 30, 58, 34.5, 62, 36, 56, 37.5], c, { oc: '#8a6a10' });
    K.eye1(g, 13, 25, 2.6, 1); g.blush(17, 29, 1.5); g.mouth(8, 29, 11, 29.5);
  } });
SP('fulgurel', 'Fulgurel', ['Water', 'Electric'], 480, 'spec',
  { pal: { a: '#243e70', b: '#f0e070', c: '#ffe040', d: '#6aa0e8', e: '#9af0ff' },
    dex: 'On stormy nights the whole estuary flickers with its light. Sailors once mistook it for a lighthouse.',
    draw(g) { const { a, b, c, d, e } = g.P;
      g.p([50, 40, 60, 30, 59, 42], d);
      g.c(38, 48, 13, a); g.c(38, 48, 7, dk(a, .12), { ring: false });
      K.tail(g, [30, 42, 24, 31, 22, 21], 7, 6, a);
      K.spikes(g, 23, 19, 6, -65, 45, 4, 6, d, 2.5);
      K.spots(g, [[30, 51, 1.5], [46, 53, 1.5], [41, 38, 1.5], [49, 45, 1.4], [26, 34, 1.3]], e);
      g.e(20, 17, 9, 7, a); g.e(17, 21.5, 6, 3, b, { ring: false });
      g.l(12, 20, 5, 25, .7, c); g.l(13, 22, 7, 29, .7, c);
      K.eye1(g, 17, 14.5, 2.5, 2, { brow: a, sc: e });
    } });
SP('gullnip', 'Gullnip', ['Water', 'Flying'], 280, 'fast', { evo: [22, 'galegull'], opener: 'peck',
  pal: { a: '#f8f8f4', b: '#b8c0cc', c: '#f0b030', d: '#e84830', e: '#f0a060', f: '#f0dca0' },
  dex: 'No chip on Saltmarsh pier is safe. It can snatch one from a cone in the blink of an eye.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(28, 54, 27, 61, 1, e, { ring: false }); g.l(34, 54, 35, 61, 1, e, { ring: false }); g.e(26, 61, 2.4, 1, e); g.e(36, 61, 2.4, 1, e);
    K.ear(g, 44, 48, 110, 8, 3, b);
    g.e(32, 46, 11, 10, a); g.e(37, 45, 7, 6, b); g.e(42, 48, 3, 2, '#303038');
    g.c(27, 31, 9, a); g.p([12, 33, 19.5, 30, 19.5, 35], c); g.dot(14, 34, .9, d);
    g.p([5, 29.5, 13, 31.5, 12, 34, 4, 32], f);
    K.eye1(g, 24, 29, 2.6, 1); g.blush(27, 34, 1.4);
  } });
SP('galegull', 'Galegull', ['Water', 'Flying'], 450, 'fast', { opener: 'peck',
  pal: { a: '#fafaf6', b: '#98a4b4', c: '#f0b030', d: '#e84830', e: '#e89060' },
  dex: 'It rides the sea wind for hours without a single flap. Its cry is the sound of every British summer holiday.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.wing(g, 40, 28, 62, 28, 0, b, dk(b, .2), 5); g.p([60, 30, 64, 36, 58, 36], '#2a2a30');
    g.l(28, 53, 27, 61, 1.2, e); g.l(35, 53, 36, 61, 1.2, e);
    K.ear(g, 44, 50, 130, 10, 3, b);
    g.e(32, 40, 12, 14, a); g.e(38, 42, 8, 11, b); g.p([40, 51, 48, 56, 42, 49], '#2a2a30');
    g.c(26, 22, 9, a); g.p([8, 24, 18, 20, 18, 27], c); g.p([8, 24, 12, 26.5, 9, 27], c); g.dot(11, 25, .9, d);
    K.eye1(g, 24, 20, 2.4, 2, { brow: a, sc: '#ffe070' });
  } });
SP('pinchet', 'Pinchet', ['Water'], 290, 'pwall', { evo: [26, 'clawcliff'], opener: 'scratch',
  pal: { a: '#e8603a', b: '#ffd0a0', c: '#a83a20' },
  dex: 'It scuttles sideways between rock pools. Children dangle bacon on string to catch them, then politely put them back.',
  draw(g) { const { a, b } = g.P;
    for (const [x1, y1, x2, y2, x3, y3] of [[20, 47, 12, 50, 9, 57], [21, 50, 14, 55, 12, 61], [24, 52, 19, 57, 18, 62]]) { g.l(x1, y1, x2, y2, 1.2, a); g.l(x2, y2, x3, y3, 1.1, a); g.l(64 - x1, y1, 64 - x2, y2, 1.2, a); g.l(64 - x2, y2, 64 - x3, y3, 1.1, a); }
    g.l(20, 42, 12, 37, 1.8, a); g.e(10, 34, 5, 4.5, a); K.horn(g, 8, 30.5, -20, 6, 2.2, a, 20);
    g.l(44, 42, 52, 35, 2, a); g.e(54, 31, 7, 6, a); K.horn(g, 52, 25.5, 10, 7, 2.5, a, 20);
    g.e(32, 46, 14, 9, a); g.e(32, 50, 9, 3.5, b, { ring: false });
    g.l(28, 40, 27, 33, 1, a); g.l(36, 40, 37, 33, 1, a); g.c(27, 31.5, 2.6, a); g.c(37, 31.5, 2.6, a);
    g.eye(27, 31.5, 2.2); g.eye(37, 31.5, 2.2); g.mouth(30.5, 45, 33.5, 45.5); g.blush(25, 45, 1.4); g.blush(39, 45, 1.4);
  } });
SP('clawcliff', 'Clawcliff', ['Water', 'Rock'], 470, 'tank',
  { pal: { a: '#c04a30', b: '#e8a080', c: '#7a7a80', d: '#a8a8b0', e: '#5a8a3a' },
    dex: 'Its great claw can crack a boulder. Barnacles and seaweed grow on its back, so it often passes for part of the cliff.',
    draw(g) { const { a, b, c, d, e } = g.P;
      for (const [x1, y1, x2, y2, x3, y3] of [[16, 46, 8, 49, 5, 57], [18, 50, 11, 55, 9, 62], [22, 52, 17, 57, 16, 63]]) { g.l(x1, y1, x2, y2, 1.6, a); g.l(x2, y2, x3, y3, 1.4, a); g.l(62 - x1, y1, 62 - x2, y2, 1.6, a); g.l(62 - x2, y2, 62 - x3, y3, 1.4, a); }
      g.l(16, 44, 9, 38, 2, a); g.e(7, 33, 4.5, 5, a); K.horn(g, 5, 29, -15, 5, 2, a, 15);
      g.e(30, 45, 17, 11, a); g.e(30, 50, 11, 4, b, { ring: false });
      g.p([14, 40, 18, 30, 28, 26, 40, 27, 48, 33, 46, 40], c); g.p([20, 36, 26, 30, 34, 29, 30, 36], d, { ring: false });
      K.spots(g, [[21, 33, 2], [34, 30, 2.2], [42, 35, 1.8]], d); K.spots(g, [[21, 33, .8], [34, 30, .9], [42, 35, .7]], c);
      g.e(29, 27, 6, 2, e); g.e(44, 30, 4, 1.8, e);
      g.l(44, 44, 51, 37, 3.2, a); g.e(55, 27, 9, 10, a); K.horn(g, 50, 18, -10, 10, 3.5, a, -15); g.p([50, 30, 58, 26, 60, 32, 54, 35], c, { ring: false });
      g.l(26, 38, 25, 31, 1, a); g.l(34, 38, 35, 30, 1, a); g.eye(25, 29, 2.3, 'cool', { side: -1, brow: a }); g.eye(35, 28.5, 2.3, 'cool', { side: 1, brow: a });
    } });
SP('jellop', 'Jellop', ['Water', 'Poison'], 290, 'spec', { evo: [28, 'menajelly'], opener: 'pound',
  pal: { a: '#b8a8f0', b: '#ece6ff', c: '#8070c8', d: '#ff90c0' },
  dex: 'It drifts into bays on warm currents. It is almost see-through, so paddlers are advised to look where they step.',
  draw(g) { const { a, b, c, d } = g.P;
    for (let i = 0; i < 6; i++) { const x = 21 + i * 4.4, s = i % 2 ? 2 : -2; K.tail(g, [x, 38, x + s, 46, x, 54, x - s * .5, 60], 1.6, .8, lt(a, .15)); }
    g.e(32, 30, 15, 12, a); g.e(32, 38, 15, 3.2, c);
    g.e(27, 24, 5, 3, b, { ring: false }); K.spots(g, [[38, 21, 1.1], [33, 18, 1], [42, 27, 1]], b);
    K.eyes(g, 27, 37, 30, 2.8, 1); g.mouth(31, 34, 33, 34.5); g.blush(22, 33, 1.6); g.blush(42, 33, 1.6);
    void d;
  } });
SP('menajelly', 'Menajelly', ['Water', 'Poison'], 475, 'wall',
  { pal: { a: '#e87850', b: '#ffd0a0', c: '#a04030', d: '#b050d0', e: '#ffe0c0' },
    dex: 'Its trailing mane can stretch longer than a bus. It rules the cold northern bays like a lion rules the plains.',
    draw(g) { const { a, b, c, d, e } = g.P;
      for (let i = 0; i < 9; i++) { const x = 12 + i * 5, s = i % 2 ? 2.5 : -2.5; K.tail(g, [x, 36, x + s, 45, x - s * .3, 53, x + s * .8, 62], 1.8, 1, i % 3 ? a : b); }
      g.e(32, 25, 18, 14, a); for (let i = 0; i < 8; i++) g.c(14 + i * 5.2, 36.5, 3.2, c);
      g.e(26, 18, 6, 3.5, e, { ring: false }); K.spots(g, [[40, 15, 1.4], [44, 22, 1.2]], e);
      K.eyes(g, 26, 38, 26, 2.7, 2, { sc: '#fff4c0', brow: a }); g.mouth(29, 32, 35, 32);
      K.spots(g, [[17, 48, 1.3], [37, 52, 1.3], [48, 46, 1.2]], d);
    } });
SP('sealby', 'Sealby', ['Water'], 300, 'hp', { evo: [30, 'selkara'], opener: 'pound',
  pal: { a: '#f4f4f0', b: '#d8dce4', c: '#2a2a3a', d: '#ffb0c0' },
  dex: 'Its fluffy white coat keeps it snug on the winter beaches. It gazes at passers-by with huge, soulful eyes.',
  draw(g) { const { a, b, c, d } = g.P;
    K.re(g, 58, 49, 5, 3, 40, b); K.re(g, 57, 55, 5, 3, -20, b);
    g.e(37, 48, 20, 11, a); g.c(26, 38, 3, a); g.c(40, 38, 3, a);
    g.e(28, 57, 6, 3, b);
    g.c(20, 40, 11, a);
    K.eyes(g, 15, 24, 39, 3.5, 1); g.face(() => { g.dot(18.5, 45, 1.6, c); g.mouth(16, 47.5, 20, 48); K.spots(g, [[13, 46, .5], [23, 46, .5]], '#8a8a98'); });
    g.blush(12, 44, 1.6); g.blush(27, 44, 1.6); void d;
  } });
SP('selkara', 'Selkara', ['Water', 'Psychic'], 490, 'spec', { extra: [[40, 'calmmind']],
  pal: { a: '#8a98a8', b: '#dce4ec', c: '#4a5a6a', d: '#58a878', e: '#f0c0e0', f: '#b090f0' },
  dex: 'Old tales say it can shed its skin and walk ashore on moonlit nights. It always returns to the sea by dawn.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.re(g, 50, 58, 7, 3, 20, c); K.re(g, 54, 54, 7, 3, -30, c);
    K.leaf(g, 32, 17, 60, 24, 4, d, dk(d, .3)); K.leaf(g, 28, 16, 95, 22, 3.8, d, dk(d, .3)); K.leaf(g, 25, 17, 130, 18, 3.4, d);
    g.e(36, 44, 14, 15, a); g.e(31, 48, 8, 11, b, { ring: false }); K.spots(g, [[42, 38, 1.5], [45, 46, 1.3], [40, 53, 1.2]], c);
    g.e(25, 55, 7, 3.5, a);
    g.c(24, 25, 10, a); g.e(17, 28, 5, 4, b); g.face(() => g.dot(13, 27, 1.5, c));
    K.spots(g, [[21, 35, 1.4], [25, 37, 1.4], [29, 37.5, 1.4], [33, 36, 1.4]], e);
    g.c(24, 17.5, 1.8, f); K.eyes(g, 19, 27, 23, 2.4, 2, { glow: true, sc: '#e0c8ff' });
  } });
SP('gudgle', 'Gudgle', ['Water'], 200, 'bal', { evo: [20, 'leviarch'], opener: 'tackle',
  pal: { a: '#a8a070', b: '#e8e0c0', c: '#6a6040', d: '#e0a040' },
  dex: 'Possibly the least impressive creature in any river. It flops about looking baffled by everything.',
  draw(g) { const { a, b, c, d } = g.P;
    g.p([45, 40, 58, 29, 55, 40, 58, 51], d);
    K.re(g, 33, 30, 5, 2, -10, d); K.re(g, 35, 50, 4, 2, 20, d);
    g.e(32, 40, 15, 11, a); g.e(30, 45, 11, 5, b, { ring: false }); K.spots(g, [[36, 36, .8], [40, 39, .8], [37, 42, .8], [42, 35, .8]], c);
    g.l(19, 45, 15, 51, .6, c); K.eye1(g, 22, 37, 3.8, 1); g.face(() => g.e(17, 43, 2, 1.6, '#5a3030', { ring: false }));
  } });
SP('leviarch', 'Leviarch', ['Water', 'Dragon'], 540, 'phys', { extra: [[30, 'dragondance'], [44, 'outrage']],
  pal: { a: '#c88a3a', b: '#f4d890', c: '#7a4a1a', d: '#6a9a3a', e: '#6ad0ff', f: '#ffffff', h: '#a8c860' },
  dex: 'A patient Gudgle becomes this regal sea dragon. Its leafy fronds make it look like drifting kelp until it strikes.',
  draw(g) { const { a, b, c, d, e, f, h } = g.P;
    K.tail(g, [36, 50, 42, 58, 50, 60, 54, 54, 50, 48, 46, 52], 5, 2, a);
    K.tail(g, [30, 40, 34, 48, 36, 50], 8, 7, a);
    for (const [x, y, an] of [[40, 56, 150], [50, 60, 190], [36, 44, 110], [30, 30, 60], [26, 22, 40]]) { K.leaf(g, x, y, an, 11, 3.5, d, dk(d, .3)); K.leaf(g, x, y, an + 35, 8, 2.8, h); }
    K.tail(g, [26, 36, 24, 26, 22, 18], 7, 6, a);
    for (const [x, y] of [[29, 40], [26, 31], [24, 24]]) g.e(x - 3, y, 3, 2.4, b, { ring: false });
    g.e(20, 14, 8, 6.5, a); g.p([2, 17, 14, 12, 14, 19], a); g.e(9, 17, 5, 1.6, b, { ring: false });
    K.leaf(g, 22, 8, -20, 10, 3, d, dk(d, .3)); K.leaf(g, 26, 9, 30, 9, 3, h);
    K.eye1(g, 18, 12.5, 2.4, 3, { brow: a, sc: '#fff4a0', pupil: '#8a2010' });
    g.e(14, 62, 10, 2.5, e); g.e(40, 63, 12, 2.5, e); g.e(30, 61, 4, 1, f, { ring: false }); void c;
  } });
SP('pearlet', 'Pearlet', ['Water', 'Fairy'], 300, 'wall', { evo: [28, 'pearlustre'], opener: 'pound',
  pal: { a: '#e4e8f8', b: '#ffffff', c: '#8a90c8', d: '#ffc8e0', e: '#a0d8f0' },
  dex: 'A tiny sea angel that flutters through rock pools. A pearly glow pulses in its chest like a heartbeat.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.re(g, 20, 40, 7, 3.5, -30, e); K.re(g, 44, 40, 7, 3.5, 30, e);
    g.p([26, 50, 38, 50, 36, 58, 32, 62, 28, 58], a);
    g.e(32, 44, 9, 10, a); g.c(32, 45, 3.2, d); K.shine(g, 31, 44);
    g.c(32, 30, 9, a); K.ear(g, 27, 22, -30, 5, 2.5, a); K.ear(g, 37, 22, 30, 5, 2.5, a);
    K.eyes(g, 28.5, 35.5, 30, 2.4, 1, { col: '#3a3a70' }); g.blush(25, 34, 1.3); g.blush(39, 34, 1.3); g.mouth(31, 35, 33, 35.4, c); void b;
  } });
SP('pearlustre', 'Pearlustre', ['Water', 'Fairy'], 470, 'spec', { extra: [[36, 'moonlight']],
  pal: { a: '#b0b8d8', b: '#f4f0ff', c: '#7078a0', d: '#ffffff', e: '#ff9ac8', f: '#9ad8f0' },
  dex: 'It glides through moonlit shallows trailing a shimmer like spilled pearls. Finding one is said to mean a lifetime of luck.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    for (let k = -3; k <= 3; k++) { const [x, y] = K.pt(32, 30, k * 26, 18); g.c(x, y, 5.2, a); } g.c(32, 30, 16, a);
    for (let k = -3; k <= 3; k++) { const [x, y] = K.pt(32, 30, k * 26, 17); g.l(32, 30, x, y, .5, c, { ring: false, shade: false }); }
    K.re(g, 20, 48, 7, 3, -40, f); K.re(g, 44, 48, 7, 3, 40, f); g.p([28, 56, 36, 56, 41, 62, 32, 59, 23, 62], f);
    g.e(32, 46, 9, 12, b); g.c(32, 30, 9, b);
    g.c(32, 44, 3.5, e); K.shine(g, 31, 43);
    K.eyes(g, 28.5, 35.5, 30, 2.4, 2, { sc: '#ffffff', pupil: '#6a58c8', brow: b }); g.blush(26, 34, 1.3); g.blush(38, 34, 1.3); void d;
  } });
SP('blightrat', 'Blightrat', ['Poison', 'Dark'], 440, 'sweep', { opener: 'tackle', sh: 40, keep: ['d'],
  pal: { a: '#6a7a58', b: '#b8b89a', c: '#a6e040', d: '#ff90a4', e: '#3a4230' },
  dex: 'Team Blight breeds them in their hideouts. The toxic spines on its back glow in the dark.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [46, 54, 54, 52, 60, 56, 62, 48], 1.6, 1.2, d);
    g.l(42, 50, 43, 60, 2.4, dk(a, .2)); g.l(28, 50, 27, 60, 2.4, dk(a, .2));
    K.spikes(g, 37, 44, 11, -70, 45, 5, 7, e, 2.5); for (const an of [-70, -41, -12, 16, 45]) { const [x, y] = K.pt(37, 44, an, 17); g.dot(x, y, .9, c); }
    g.e(36, 44, 15, 11, a); g.e(33, 49, 9, 5, b, { ring: false });
    g.l(45, 50, 47, 61, 2.6, a); g.l(29, 50, 27, 61, 2.6, a);
    K.earR(g, 20, 29, 5, a, d); K.earR(g, 27, 31, 4, a, d);
    g.e(18, 38, 10, 8, a); g.p([4, 42, 12, 34, 14, 45], a); g.dot(4.5, 42, 1.6, d);
    g.face(() => { g.p([8, 44, 11, 44, 10, 48], '#fff8e8', { oc: '#8a8070' }); g.e(9.5, 50.5, 1.2, 2, c, { ring: false }); });
    K.eye1(g, 15, 36, 2.5, 2, { sc: '#ff6a5a', brow: a });
  } });