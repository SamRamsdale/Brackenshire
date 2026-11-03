// ---- creatures ----
// ================= SPECIES =================
// base: [hp, atk, def, spa, spd, spe]
const SPECIES = {
  cindle: {
    n: 'Cindle', types: ['Fire'], base: [39, 52, 43, 60, 50, 65], cr: 45, xp: 62, evo: [15, 'scorchvix'], sh: 175, keep: ['b'],
    moves: [[1, 'scratch'], [1, 'growl'], [6, 'ember'], [10, 'quickattack'], [13, 'flamewheel'], [18, 'bite'], [22, 'willowisp'], [27, 'firefang'], [32, 'flamethrower']],
    pal: { a: '#e8603c', b: '#fff0d4', c: '#ffd050', d: '#ff8a30', e: '#8a3428' },
    dex: 'A fox kit found curled on warm hearthstones. The ember on its tail flares brighter whenever it is praised.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(40, 52, 49, 40, 5, a); g.e(51, 32, 6.5, 9, d); g.e(51, 35, 3.5, 5, c, { ring: false });
      g.e(38, 57, 5, 4, a);
      g.e(32, 48, 12, 11, a); g.e(28, 51, 6, 7, b);
      g.e(24, 57, 4, 4, a); g.e(32, 58, 4, 3.5, a);
      g.p([16, 31, 15, 11, 27, 23], a); g.p([34, 23, 45, 11, 43, 31], a);
      g.p([18.5, 27, 18, 16, 24, 23], e, { ring: false }); g.p([37, 23, 42.5, 16, 41, 27], e, { ring: false });
      g.e(30, 34, 13, 11, a); g.e(26, 39, 7, 5, b);
      g.p([25, 25, 29.5, 13, 34, 25], d); g.p([27.5, 24, 29.5, 17.5, 31.5, 24], c, { ring: false });
      g.eye(23.5, 32, 3.2); g.eye(35, 32, 3.2);
      g.face(() => { g.dot(24, 38, 1.2, '#3a1c1c'); g.mouth(25, 41, 28, 42); });
      g.blush(20, 37, 2); g.blush(39, 37, 2);
    }
  },
  scorchvix: {
    n: 'Scorchvix', types: ['Fire'], base: [58, 64, 58, 80, 65, 80], cr: 45, xp: 142, evo: [34, 'infernix'], sh: 175, keep: ['b'],
    moves: [[1, 'scratch'], [1, 'growl'], [1, 'ember'], [10, 'quickattack'], [13, 'flamewheel'], [18, 'bite'], [23, 'willowisp'], [28, 'firefang'], [33, 'flamethrower']],
    pal: { a: '#d8502c', b: '#fff0d4', c: '#ffd850', d: '#ff7428', e: '#5a2020' },
    dex: 'It darts along hedgerows at dusk, leaving little curls of smoke. Farmers say it keeps the rats out of the barns.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(45, 40, 55, 26, 4, a); g.e(56, 20, 5.5, 8, d); g.e(56, 23, 2.5, 4.5, c, { ring: false });
      g.l(46, 43, 58, 38, 4, a); g.e(60, 33, 4, 6.5, d); g.e(60, 35, 2, 3.5, c, { ring: false });
      g.l(41, 46, 44, 59, 3, dk(a, .2)); g.l(23, 46, 20, 59, 3, dk(a, .2));
      g.e(34, 42, 14, 8, a); g.e(31, 46, 9, 4, b);
      g.l(38, 46, 38, 60, 3.2, a); g.l(27, 46, 26, 60, 3.2, a);
      g.e(38, 60, 3.5, 1.6, e, { ring: false }); g.e(26, 60, 3.5, 1.6, e, { ring: false });
      g.p([18, 40, 18, 22, 25, 29, 29, 19, 33, 36], d); g.p([21, 38, 21, 27, 25, 31, 28, 25, 30, 36], c, { ring: false });
      g.p([14, 23, 12, 7, 21, 17], a); g.p([19, 19, 25, 5, 27, 21], a); g.p([15, 20, 14, 12, 19, 17], e, { ring: false });
      g.e(18, 28, 9, 8, a); g.p([4, 32, 13, 25, 15, 35], a); g.e(11, 33, 5, 3, b);
      g.eye(16, 27, 2.6, 'cool', { brow: a, side: -1 });
      g.face(() => { g.dot(5, 31.5, 1.2, '#2a1414'); g.mouth(7, 35, 11, 35.5); });
    }
  },
  infernix: {
    n: 'Infernix', types: ['Fire', 'Ghost'], base: [78, 84, 72, 109, 85, 100], cr: 45, xp: 240, sh: 120, keep: ['b'],
    moves: [[1, 'ember'], [1, 'astonish'], [1, 'flamewheel'], [1, 'willowisp'], [34, 'shadowball'], [38, 'hex'], [44, 'flamethrower']],
    pal: { a: '#433260', b: '#f4ecff', c: '#aaf6ff', d: '#48b0ff', e: '#ff7a3c' },
    dex: 'Travellers lost on the moors follow its cold blue fire. Whether it leads them home or further astray depends on its mood.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([38, 50, 48, 30, 56, 6, 55, 30, 45, 54], d); g.p([41, 47, 49, 30, 54, 13, 52, 32, 45, 50], c, { ring: false });
      g.p([40, 52, 56, 42, 62, 22, 58, 44, 44, 56], d); g.p([44, 51, 55, 43, 60, 29, 56, 45, 46, 53], c, { ring: false });
      g.p([22, 52, 12, 40, 6, 18, 16, 38, 26, 50], d); g.p([20, 49, 13, 40, 9, 26, 16, 40, 24, 48], c, { ring: false });
      g.l(28, 46, 26, 59, 3.6, a); g.l(37, 46, 39, 59, 3.6, a);
      g.e(25, 60, 4, 2, e); g.e(40, 60, 4, 2, e);
      g.p([22, 51, 25, 25, 39, 25, 43, 51, 32, 55], a); g.e(32, 40, 5, 9, b);
      g.l(24, 30, 18, 43, 3, a); g.l(40, 30, 45, 42, 3, a); g.e(17, 46, 3.5, 4.5, d); g.e(46, 45, 3.5, 4.5, d);
      g.p([20, 29, 23, 20, 27, 26, 32, 17, 37, 26, 41, 20, 44, 29, 32, 33], d); g.p([24, 28, 27, 24, 32, 21, 37, 24, 40, 28, 32, 31], c, { ring: false });
      g.p([25, 12, 22, 2, 31, 9], a); g.p([34, 9, 42, 2, 40, 13], a);
      g.e(32, 16, 9, 8, a); g.p([21, 19, 28, 14, 28, 22], a); g.e(29, 18, 6, 5, b);
      g.eye(28, 15.5, 2.4, 'cool', { sc: c, brow: a, side: -1 }); g.eye(36, 15.5, 2.4, 'cool', { sc: c, brow: a, side: 1 });
      g.face(() => g.dot(21.5, 18.5, 1.1, '#221a30'));
    }
  },
  sproutle: {
    n: 'Sproutle', types: ['Grass'], base: [45, 49, 55, 55, 55, 45], cr: 45, xp: 64, evo: [15, 'thistlehog'], sh: -70, keep: ['b', 'e'],
    moves: [[1, 'tackle'], [1, 'tailwhip'], [6, 'vinewhip'], [9, 'absorb'], [12, 'harden'], [15, 'razorleaf'], [19, 'sleeppowder'], [23, 'megadrain'], [28, 'seedbomb'], [34, 'energyball']],
    pal: { a: '#6cc44a', b: '#f2dcb0', c: '#3e8a36', d: '#a0784c', e: '#ff9ab0' },
    dex: 'Its leafy spines unfurl in sunshine and curl up tight when it rains. It naps under hawthorn hedges.',
    draw(g) {
      const { a, b, c, d } = g.P;
      const sp = [[36, 32, 44, 22, 46, 34], [42, 34, 54, 27, 51, 39], [46, 40, 60, 38, 53, 47], [47, 47, 60, 52, 50, 54], [28, 34, 32, 22, 38, 32]];
      for (const s of sp) g.p([s[0], s[1], s[2], s[3], s[4], s[5]], c);
      g.e(37, 46, 15, 13, a);
      g.p([34, 36, 40, 30, 42, 38], c, { ring: false }); g.p([42, 42, 48, 37, 48, 45], c, { ring: false });
      g.e(24, 48, 11, 10.5, b);
      g.e(22, 59, 4.5, 2.5, d); g.e(36, 59.5, 4.5, 2.5, d);
      g.e(14, 51, 4.5, 3.2, b); g.face(() => g.dot(10.5, 50.5, 1.5, '#3a2a2a'));
      g.l(29, 36, 28, 28, 1, c); g.e(24.5, 26, 4.5, 2.4, a); g.e(32.5, 25, 4.5, 2.4, a);
      g.eye(19.5, 46, 2.8); g.eye(28, 46, 2.8);
      g.blush(16, 51, 1.8); g.blush(31, 51, 1.8);
      g.mouth(19, 53, 22, 54);
    }
  },
  thistlehog: {
    n: 'Thistlehog', types: ['Grass'], base: [60, 64, 70, 70, 70, 58], cr: 45, xp: 141, evo: [34, 'bramblord'], sh: -70, keep: ['b'],
    moves: [[1, 'tackle'], [1, 'vinewhip'], [1, 'absorb'], [12, 'harden'], [15, 'razorleaf'], [20, 'sleeppowder'], [24, 'megadrain'], [29, 'seedbomb'], [35, 'energyball']],
    pal: { a: '#58b040', b: '#f0d8a8', c: '#2e7430', d: '#9a6a44', f: '#b070d8' },
    dex: 'The purple thistle heads on its back release a sleepy pollen. Beekeepers are fond of it; bees even more so.',
    draw(g) {
      const { a, b, c, d, f } = g.P;
      const sp = [[22, 30, 26, 16, 32, 28], [30, 26, 38, 12, 42, 26], [40, 26, 52, 16, 52, 30], [48, 32, 62, 28, 56, 40], [52, 42, 63, 46, 54, 50]];
      for (const s of sp) g.p(s, c);
      g.l(24, 48, 22, 59, 3.4, d); g.l(46, 48, 48, 59, 3.4, d);
      g.e(36, 42, 21, 14, a);
      g.p([30, 32, 36, 26, 38, 36], c, { ring: false }); g.p([44, 34, 50, 30, 50, 40], c, { ring: false });
      for (const [x, y] of [[29, 26], [42, 25], [52, 34]]) { g.e(x, y + 4, 3, 2.4, c); g.c(x, y, 4.2, f); g.p([x - 3, y - 2, x, y - 7, x + 3, y - 2], f, { ring: false }); }
      g.l(31, 50, 30, 60, 3.6, d); g.l(41, 50, 42, 60, 3.6, d);
      g.e(19, 45, 11, 9.5, b); g.p([3, 48, 12, 42, 13, 52], b); g.face(() => g.dot(4, 47.5, 1.5, '#3a2a2a'));
      g.eye(15, 43, 2.7, 'cool', { brow: b, side: -1 }); g.eye(23.5, 43, 2.7, 'cool', { brow: b, side: 1 });
      g.mouth(8, 51, 13, 51.5);
    }
  },
  bramblord: {
    n: 'Bramblord', types: ['Grass', 'Ground'], base: [80, 100, 100, 70, 80, 70], cr: 45, xp: 236, sh: -70, keep: ['b', 'g'],
    moves: [[1, 'vinewhip'], [1, 'razorleaf'], [1, 'harden'], [1, 'megadrain'], [34, 'bulldoze'], [38, 'seedbomb'], [44, 'dig'], [50, 'energyball']],
    pal: { a: '#4a8a3a', b: '#d8c098', c: '#2a5a2a', d: '#6a4a30', f: '#5a1a4a', g: '#fff4d8' },
    dex: 'An ancient guardian of hedgerows. Its bramble mantle bears berries so sweet that birds risk its thorns to reach them.',
    draw(g) {
      const { a, b, c, d, f } = g.P;
      for (let i = 0; i < 7; i++) { const x = 18 + i * 6.5, y = 26 - Math.sin(i / 6 * Math.PI) * 8; g.p([x - 4, y + 8, x + 1, y - 7, x + 5, y + 8], c); }
      g.l(22, 44, 20, 59, 5, dk(d, .2)); g.l(52, 44, 55, 59, 5, dk(d, .2));
      g.e(38, 38, 24, 15, a);
      for (const [x, y] of [[26, 30], [36, 26], [48, 28], [56, 36]]) { g.l(x - 5, y + 3, x + 5, y - 2, 1.3, c, { ring: false }); }
      g.e(46, 45, 11, 8, d); g.e(28, 47, 8, 6, d);
      for (const [x, y] of [[32, 24], [44, 23], [54, 30], [24, 30]]) { g.c(x, y, 2.6, f); g.dot(x - .8, y - .8, .9, lt(f, .5)); }
      g.l(30, 48, 30, 60, 5, d); g.l(46, 48, 46, 60, 5, d);
      g.e(30, 60, 5.5, 2.2, '#3a2a20'); g.e(46, 60, 5.5, 2.2, '#3a2a20');
      g.e(16, 42, 12, 10.5, b); g.p([1, 47, 10, 39, 12, 52], b);
      g.p([7, 50, 3, 40, 10, 47], g.P.g);
      g.face(() => g.dot(2.5, 46, 1.6, '#2a1a1a'));
      g.eye(13, 38.5, 2.8, 'cool', { brow: b, side: -1, sc: '#ffe880' }); g.eye(22, 39, 2.6, 'cool', { brow: b, side: 1, sc: '#ffe880' });
      g.p([8, 29, 12, 20, 16, 30], c); g.p([17, 29, 23, 19, 25, 31], c);
    }
  },
  splotter: {
    n: 'Splotter', types: ['Water'], base: [50, 55, 50, 50, 50, 50], cr: 45, xp: 63, evo: [15, 'rivotter'], sh: 150, keep: ['b', 'e'],
    moves: [[1, 'tackle'], [1, 'tailwhip'], [6, 'watergun'], [10, 'aquajet'], [14, 'bite'], [18, 'bubblebeam'], [23, 'headbutt'], [28, 'aquatail'], [35, 'surf']],
    pal: { a: '#4a9ee0', b: '#fff4dc', c: '#2a6aa8', d: '#90e0ff', e: '#303040' },
    dex: 'It carries a favourite pebble everywhere and sulks if it is lost. Families of them slide down riverbanks for fun.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([40, 55, 57, 50, 62, 56, 44, 61], c);
      g.e(34, 46, 11.5, 12.5, a); g.e(31, 49, 7, 8.5, b);
      g.e(26, 59.5, 4.5, 2.5, a); g.e(39, 59.5, 4.5, 2.5, a);
      g.c(30, 48, 3, '#b0b0c4'); g.e(25.5, 47, 3, 3.6, a); g.e(35, 47, 3, 3.6, a);
      g.c(19.5, 22.5, 3.2, a); g.c(40, 22.5, 3.2, a);
      g.e(30, 30, 12.5, 10.5, a); g.e(27, 34.5, 6.5, 4.2, b);
      g.face(() => { g.e(26.5, 32.4, 2, 1.4, e, { ring: false, shade: false }); g.mouth(24, 36.5, 28, 37); });
      g.c(30, 17, 3.2, d); g.p([27.5, 16, 30, 10, 32.5, 16], d, { ring: false });
      g.eye(23.5, 29, 3); g.eye(35, 29, 3);
      if (!g.back) { g.l(18, 34, 13, 33, .4, e, { ring: false, shade: false }); g.l(18, 36, 13, 37, .4, e, { ring: false, shade: false }); }
      g.blush(20, 34, 1.8); g.blush(38, 34, 1.8);
    }
  },
  rivotter: {
    n: 'Rivotter', types: ['Water'], base: [65, 75, 65, 60, 60, 70], cr: 45, xp: 142, evo: [34, 'tidalord'], sh: 150, keep: ['b'],
    moves: [[1, 'tackle'], [1, 'watergun'], [1, 'aquajet'], [14, 'bite'], [19, 'bubblebeam'], [24, 'headbutt'], [29, 'aquatail'], [36, 'surf']],
    pal: { a: '#3a8ad0', b: '#fff0d0', c: '#205a98', d: '#80d8ff', e: '#28283a' },
    dex: 'It patrols chalk streams with a cheeky swagger, tail fin slapping the water to warn off anglers.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(38, 54, 52, 57, 3.5, c); g.p([50, 50, 62, 50, 58, 60, 50, 60], c);
      g.l(28, 48, 26, 59, 3.8, a); g.l(37, 48, 39, 59, 3.8, a);
      g.e(26, 60, 4.5, 2, c); g.e(40, 60, 4.5, 2, c);
      g.p([36, 30, 48, 22, 44, 36], d);
      g.e(32, 40, 9.5, 14, a); g.e(30, 43, 5.5, 10, b);
      g.l(25, 32, 18, 42, 2.8, a); g.l(39, 32, 44, 40, 2.8, a); g.p([19, 36, 13, 40, 18, 44], d);
      g.c(24, 11, 3, a); g.c(37, 11, 3, a);
      g.e(30, 18, 9.5, 8, a); g.e(25.5, 21.5, 5.5, 3.6, b);
      g.p([29, 11, 37, 2, 38, 12], d);
      g.face(() => { g.e(21.5, 20, 1.6, 1.1, e, { ring: false, shade: false }); g.mouth(21, 24, 26, 24.5); });
      g.eye(25.5, 16.5, 2.4, 'cool', { brow: a, side: -1 }); g.eye(33, 16.5, 2.4, 'cool', { brow: a, side: 1 });
    }
  },
  tidalord: {
    n: 'Tidalord', types: ['Water'], base: [85, 105, 90, 80, 80, 90], cr: 45, xp: 239, sh: 150, keep: ['b', 'f'],
    moves: [[1, 'watergun'], [1, 'aquajet'], [1, 'bite'], [1, 'bubblebeam'], [34, 'aquatail'], [40, 'bodyslam'], [46, 'surf']],
    pal: { a: '#2a6ab8', b: '#f0e8d0', c: '#183e78', d: '#6ad0ff', f: '#ffffff' },
    dex: 'Said to have turned back a flood by standing in the river until the waters bowed. It is fiercely loyal.',
    draw(g) {
      const { a, b, c, d, f } = g.P;
      g.p([40, 50, 56, 44, 62, 30, 58, 50, 46, 58], d); g.p([46, 50, 57, 45, 60, 36, 56, 50], f, { ring: false });
      g.l(26, 46, 24, 59, 5, a); g.l(38, 46, 40, 59, 5, a);
      g.e(23, 60, 5.5, 2.2, c); g.e(41, 60, 5.5, 2.2, c);
      g.e(32, 36, 15, 16, a); g.e(31, 40, 8, 11, b);
      g.l(19, 28, 11, 44, 4.2, a); g.l(45, 28, 52, 42, 4.2, a);
      g.e(10, 46, 4.5, 4, c); g.e(53, 44, 4.5, 4, c);
      g.e(18, 25, 7.5, 6, c); g.e(46, 25, 7.5, 6, c); g.l(12, 22, 24, 22, 1.2, f, { ring: false }); g.l(40, 22, 52, 22, 1.2, f, { ring: false });
      g.p([22, 10, 26, 2, 31, 6, 35, 2, 40, 8, 44, 4, 42, 14, 22, 14], d); g.l(26, 5, 40, 8, .8, f, { ring: false });
      g.e(31, 15, 10, 8, a); g.e(26, 18.5, 6, 4, b);
      g.face(() => { g.e(22, 17, 1.7, 1.2, '#1a1a2a', { ring: false, shade: false }); g.mouth(21, 21, 27, 21.5); });
      g.eye(26.5, 13, 2.5, 'cool', { brow: a, side: -1 }); g.eye(35, 13, 2.5, 'cool', { brow: a, side: 1 });
    }
  },
  burrabit: {
    n: 'Burrabit', types: ['Normal'], base: [40, 50, 40, 35, 40, 60], cr: 255, xp: 51, evo: [14, 'harehaste'], sh: 200, keep: ['b', 'e'],
    moves: [[1, 'tackle'], [1, 'tailwhip'], [5, 'quickattack'], [9, 'growl'], [12, 'bite'], [17, 'headbutt'], [24, 'bodyslam']],
    pal: { a: '#c8a47a', b: '#fff6e8', c: '#8a6a4a', e: '#ff9aa8' },
    dex: 'Common in meadows. Its twitching nose can smell a fox three fields away, at which point it simply vanishes.',
    draw(g) {
      const { a, b, c, e } = g.P;
      g.c(46, 52, 5.5, b);
      g.e(34, 48, 11.5, 10.5, a); g.e(31, 51, 6.5, 6.5, b);
      g.e(24, 59.5, 5.5, 2.6, a); g.e(38, 59.5, 5.5, 2.6, a);
      g.e(22, 13, 3.8, 11.5, a); g.e(22, 14, 1.8, 8.5, e, { ring: false });
      g.e(34, 12, 3.8, 11.5, a); g.e(34, 13, 1.8, 8.5, e, { ring: false });
      g.e(28, 32, 11.5, 10, a); g.e(26, 37, 5.5, 3.6, b);
      g.face(() => { g.dot(25, 34.8, 1.2, e); g.p([24.5, 39, 27, 39, 26.5, 41.5, 25, 41.5], '#ffffff', { oc: '#8a7a70' }); });
      g.eye(22, 30.5, 3); g.eye(33, 30.5, 3);
      g.blush(18, 35, 1.8); g.blush(36.5, 35, 1.8);
    }
  },
  harehaste: {
    n: 'Harehaste', types: ['Normal'], base: [65, 80, 60, 50, 60, 100], cr: 90, xp: 145, sh: 200, keep: ['b'],
    moves: [[1, 'tackle'], [1, 'quickattack'], [1, 'tailwhip'], [12, 'bite'], [18, 'headbutt'], [25, 'agility'], [30, 'bodyslam'], [38, 'hypervoice']],
    pal: { a: '#b8845a', b: '#fff0dc', c: '#6a4a30', e: '#1e1a26' },
    dex: 'It boxes rivals in spring fields at dawn. Clocked at motorway speeds across open downland.',
    draw(g) {
      const { a, b, c } = g.P;
      g.l(22, 20, 34, 5, 3, a); g.l(25, 22, 42, 9, 3, a); g.l(24, 19, 32, 8, 1.2, c, { ring: false });
      g.c(55, 38, 4, b);
      g.e(46, 48, 8, 9, a); g.e(48, 59.5, 9, 2.4, c);
      g.e(35, 40, 15, 8.5, a); g.e(32, 44, 9, 4, b);
      g.l(30, 30, 38, 38, 1, c, { ring: false }); g.l(36, 31, 44, 38, 1, c, { ring: false });
      g.l(24, 44, 20, 59, 2.4, a); g.l(29, 45, 30, 59, 2.4, a);
      g.e(18, 29, 8.5, 7.5, a); g.p([7, 32, 14, 27, 15, 35], a);
      g.face(() => g.dot(7.5, 31.5, 1.2, '#2a1a1a'));
      g.eye(16, 27.5, 2.5, 'cool', { brow: a, side: -1 });
    }
  },
  pipwren: {
    n: 'Pipwren', types: ['Normal', 'Flying'], base: [40, 45, 40, 35, 35, 56], cr: 255, xp: 50, evo: [15, 'galewing'], sh: 150, keep: ['d'],
    moves: [[1, 'peck'], [1, 'growl'], [5, 'quickattack'], [9, 'gust'], [14, 'wingattack'], [19, 'agility'], [24, 'aerialace'], [30, 'airslash']],
    pal: { a: '#8a6040', b: '#ff8a4a', c: '#5a3e2a', d: '#f8e8c8', e: '#f0c040' },
    dex: 'It follows gardeners, hopping after worms turned up by the spade. Sings loudly at first light.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([40, 44, 50, 25, 55, 28, 47, 48], c);
      g.l(28, 54, 27, 60, .9, '#d89050', { ring: false }); g.l(35, 54, 36, 60, .9, '#d89050', { ring: false });
      g.e(33, 44, 12, 11, a); g.e(27, 47, 7, 8, b);
      g.e(38, 45, 7.5, 6.5, c); g.l(34, 46, 42, 48, .6, dk(c, .4), { ring: false });
      g.e(28, 30, 9.5, 8.5, a);
      g.p([16, 31.5, 20.5, 28.5, 20.5, 34], e);
      g.face(() => g.l(22, 25, 34, 24, .7, d, { ring: false, shade: false }));
      g.eye(23.5, 29.5, 2.6); g.eye(31.5, 29.5, 2.6);
      g.blush(22, 34, 1.4);
    }
  },
  galewing: {
    n: 'Galewing', types: ['Normal', 'Flying'], base: [63, 70, 55, 50, 55, 95], cr: 120, xp: 147, sh: 150, keep: ['b', 'e'],
    moves: [[1, 'peck'], [1, 'quickattack'], [1, 'gust'], [14, 'wingattack'], [20, 'agility'], [25, 'aerialace'], [32, 'airslash']],
    pal: { a: '#b87848', b: '#f6e6c8', c: '#5a78b0', d: '#3a2a1a', e: '#f0c848' },
    dex: 'It hangs perfectly still above verges, then drops like a stone. Motorists often spot it hovering by the road.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([30, 34, 10, 16, 2, 22, 8, 28, 2, 34, 10, 38, 26, 44], a); g.p([6, 23, 2, 22, 8, 28, 2, 34], d, { ring: false });
      g.p([36, 32, 54, 12, 62, 18, 56, 26, 62, 32, 54, 36, 40, 44], a); g.p([58, 16, 62, 18, 56, 26, 62, 32], d, { ring: false });
      g.p([27, 50, 38, 50, 42, 62, 24, 62], a); g.l(27, 60, 40, 60, 1, d, { ring: false });
      g.e(33, 40, 9, 13, b); for (const [x, y] of [[29, 38], [35, 36], [31, 44], [37, 42], [33, 49]]) g.dot(x, y, 1, d);
      g.l(29, 52, 28, 58, 1, e, { ring: false }); g.l(36, 52, 37, 58, 1, e, { ring: false });
      g.e(33, 22, 8, 7, c); g.p([23, 23, 27, 20.5, 28, 27], e); g.dot(24, 25.5, .9, d);
      g.face(() => g.l(29, 25, 29, 30, .7, d, { ring: false, shade: false }));
      g.eye(30, 21, 2.3, 'cool', { brow: c, side: -1, sc: '#ffe070' }); g.eye(37, 21, 2.2, 'cool', { brow: c, side: 1, sc: '#ffe070' });
    }
  },
  buzzlet: {
    n: 'Buzzlet', types: ['Bug', 'Flying'], base: [40, 45, 35, 40, 40, 60], cr: 200, xp: 54, evo: [12, 'bumbellow'], sh: 100, keep: ['c'],
    moves: [[1, 'stringshot'], [1, 'poisonsting'], [6, 'bugbite'], [9, 'gust'], [13, 'silverwind'], [18, 'wingattack'], [23, 'xscissor']],
    pal: { a: '#ffd040', b: '#3a3040', c: '#eef8ff', d: '#ff9a40' },
    dex: 'It bumbles from flower to flower and sometimes bumps into windows. Harmless, unless you tread on one.',
    draw(g) {
      const { a, b, c, d } = g.P;
      g.e(40, 27, 7.5, 5.5, c, { oc: '#8aa8c8' }); g.e(45, 34, 6, 4, c, { oc: '#8aa8c8' });
      g.p([45, 46, 53, 49, 45, 52], b);
      g.e(35, 45, 12, 11, a);
      g.e(38.5, 45, 2.4, 10, b, { ring: false }); g.e(44.5, 45, 1.8, 7.5, b, { ring: false });
      g.l(28, 54, 27, 59, .9, b, { ring: false }); g.l(36, 55, 36, 60, .9, b, { ring: false });
      g.l(22, 28, 18, 18, .8, b, { ring: false }); g.c(17.5, 17.5, 2, b); g.l(28, 28, 30, 18, .8, b, { ring: false }); g.c(30.5, 17.5, 2, b);
      g.e(24, 36, 10, 9, a);
      g.eye(20, 35, 3.2); g.eye(29, 35, 3.2);
      g.blush(16.5, 40, 1.8); g.blush(31, 40, 1.8); g.mouth(22.5, 41.5, 25, 42);
    }
  },
  bumbellow: {
    n: 'Bumbellow', types: ['Bug', 'Flying'], base: [65, 80, 60, 55, 65, 80], cr: 75, xp: 152, sh: 100, keep: ['c', 'f'],
    moves: [[1, 'poisonsting'], [1, 'bugbite'], [1, 'gust'], [13, 'silverwind'], [19, 'wingattack'], [24, 'xscissor'], [30, 'airslash']],
    pal: { a: '#f0b830', b: '#2e2638', c: '#e4f2ff', d: '#ff8030', f: '#fff4d0' },
    dex: 'Its deep drone can be heard across a whole valley. A colony will defend its queen, and its keeper, to the last.',
    draw(g) {
      const { a, b, c, d, f } = g.P;
      g.e(43, 18, 11, 7.5, c, { oc: '#7a98c0' }); g.e(52, 28, 9, 5.5, c, { oc: '#7a98c0' }); g.l(36, 20, 52, 16, .5, '#a8c0e0', { ring: false });
      g.p([48, 46, 62, 50, 48, 55], b);
      g.e(36, 44, 16, 14, a);
      g.e(40, 44, 3, 13, b, { ring: false }); g.e(48, 44, 2.4, 10, b, { ring: false });
      g.l(26, 55, 24, 61, 1.3, b); g.l(36, 57, 37, 62, 1.3, b); g.l(22, 44, 14, 50, 1.5, b);
      g.e(24, 36, 10, 5, f);
      g.l(18, 24, 12, 12, .9, b, { ring: false }); g.c(11, 11, 2.4, b); g.l(26, 23, 28, 10, .9, b, { ring: false }); g.c(29, 9.5, 2.4, b);
      g.e(20, 29, 10.5, 9, a);
      g.eye(15.5, 28, 3, 'cool', { brow: a, side: -1 }); g.eye(24.5, 28, 3, 'cool', { brow: a, side: 1 });
      g.mouth(17, 35, 21, 34);
    }
  },
  wickmoth: {
    n: 'Wickmoth', types: ['Bug', 'Fire'], base: [45, 40, 45, 60, 55, 60], cr: 190, xp: 60, evo: [18, 'lanternmoth'], sh: 200, keep: [],
    moves: [[1, 'stringshot'], [1, 'ember'], [7, 'gust'], [10, 'silverwind'], [14, 'willowisp'], [19, 'flamewheel'], [25, 'airslash']],
    pal: { a: '#ece0c4', b: '#b89a78', c: '#ff8a30', d: '#ffd860', e: '#6a5040' },
    dex: 'Only seen after dark. It is drawn to candles and cottage windows, and its antennae glow like little wicks.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([29, 34, 10, 14, 3, 20, 5, 34, 20, 42], a); g.p([35, 34, 54, 14, 61, 20, 59, 34, 44, 42], a);
      g.e(17, 45, 9, 6.5, a); g.e(47, 45, 9, 6.5, a);
      g.c(13, 24, 3.4, c); g.dot(13, 24, 1.2, d); g.c(51, 24, 3.4, c); g.dot(51, 24, 1.2, d);
      g.l(8, 30, 20, 38, .6, dk(a, .3), { ring: false }); g.l(56, 30, 44, 38, .6, dk(a, .3), { ring: false });
      g.e(32, 44, 5.5, 12, b); g.l(28, 44, 36, 44, .6, e, { ring: false }); g.l(28, 49, 36, 49, .6, e, { ring: false });
      g.e(32, 30, 8, 4.5, lt(a, .4));
      g.l(29, 25, 22, 12, .7, e, { ring: false }); g.l(35, 25, 42, 12, .7, e, { ring: false });
      g.p([19, 12, 22, 3, 25, 12], c); g.e(22, 12, 2.4, 2.6, d, { ring: false }); g.p([39, 12, 42, 3, 45, 12], c); g.e(42, 12, 2.4, 2.6, d, { ring: false });
      g.e(32, 26, 7, 6, b);
      g.eye(28.5, 26, 2.3); g.eye(35.5, 26, 2.3);
      g.blush(26.5, 29.5, 1.2); g.blush(37.5, 29.5, 1.2);
    }
  },
  lanternmoth: {
    n: 'Lanternmoth', types: ['Bug', 'Fire'], base: [60, 55, 60, 95, 80, 85], cr: 75, xp: 160, sh: 200, keep: [],
    moves: [[1, 'ember'], [1, 'gust'], [1, 'silverwind'], [14, 'willowisp'], [20, 'flamewheel'], [26, 'airslash'], [34, 'flamethrower']],
    pal: { a: '#d8a050', b: '#6a4a38', c: '#ff6a20', d: '#ffe070', e: '#3a2a20' },
    dex: 'The glow of its abdomen once guided miners home. A lanternmoth at the window is thought to bring good fortune.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([28, 30, 6, 4, 1, 12, 2, 30, 18, 38], a); g.p([36, 30, 58, 4, 63, 12, 62, 30, 46, 38], a);
      g.p([28, 38, 10, 44, 6, 56, 18, 56, 28, 46], a); g.p([36, 38, 54, 44, 58, 56, 46, 56, 36, 46], a);
      g.l(6, 12, 24, 30, .6, e, { ring: false }); g.l(58, 12, 40, 30, .6, e, { ring: false });
      for (const [x, y] of [[12, 16], [52, 16], [12, 50], [52, 50]]) { g.c(x, y, 3.6, c); g.c(x, y, 1.8, d, { ring: false }); }
      g.e(32, 46, 7, 11, d, { oc: c }); g.e(32, 48, 4, 7, '#fffbe0', { ring: false, shade: false });
      g.l(26, 42, 38, 42, .7, b, { ring: false }); g.l(26, 50, 38, 50, .7, b, { ring: false }); g.e(32, 57.5, 3, 2, b);
      g.e(32, 32, 7, 6, b);
      g.p([27, 20, 18, 6, 22, 6], lt(a, .2)); g.p([37, 20, 46, 6, 42, 6], lt(a, .2));
      g.e(32, 23, 6.5, 5.5, b);
      g.eye(28.5, 23, 2.2, 'glow', { sc: d }); g.eye(35.5, 23, 2.2, 'glow', { sc: d });
    }
  },
  hollowl: {
    n: 'Hollowl', types: ['Ghost', 'Flying'], base: [60, 55, 60, 75, 75, 60], cr: 90, xp: 130, sh: 250, keep: ['e'],
    moves: [[1, 'astonish'], [1, 'peck'], [6, 'hypnosis'], [11, 'wingattack'], [16, 'hex'], [22, 'shadowball'], [28, 'airslash']],
    pal: { a: '#f0e8e0', b: '#caa880', c: '#8a70c0', d: '#fff8f2', e: '#ffd860' },
    dex: 'A pale owl that glides out of churchyard yews. It has no feet; below its feathers is only drifting mist.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.p([22, 48, 42, 48, 46, 60, 40, 56, 35, 63, 30, 56, 24, 61, 20, 55], c); g.p([26, 50, 38, 50, 40, 56, 34, 58, 28, 56], lt(c, .3), { ring: false });
      g.e(21, 41, 5.5, 10, b); g.e(43, 41, 5.5, 10, b);
      g.e(32, 40, 11, 12.5, b); g.e(32, 44, 7, 8.5, a);
      for (const [x, y] of [[30, 42], [34, 45], [31, 48]]) g.dot(x, y, .9, dk(b, .2));
      g.e(32, 22, 13, 11, b);
      g.face(() => { g.c(27, 21, 6.2, d, { ring: false }); g.c(37, 21, 6.2, d, { ring: false }); g.p([21.5, 23, 42.5, 23, 32, 33], d, { ring: false }); });
      g.eye(27.5, 22, 2.8, 'glow', { sc: e }); g.eye(36.5, 22, 2.8, 'glow', { sc: e });
      g.face(() => g.p([31, 26, 33, 26, 32, 30], '#c89050', { ring: false }));
    }
  },
  brockling: {
    n: 'Brockling', types: ['Ground'], base: [55, 60, 55, 35, 45, 40], cr: 190, xp: 60, evo: [20, 'brockhorn'], sh: 30, keep: ['b', 'c'],
    moves: [[1, 'scratch'], [1, 'leer'], [5, 'mudslap'], [9, 'bite'], [14, 'mudshot'], [19, 'bulldoze'], [25, 'dig'], [31, 'bodyslam']],
    pal: { a: '#8e8e96', b: '#f6f4ee', c: '#2a2a32', d: '#c89060' },
    dex: 'It snuffles out of its sett at twilight to dig for grubs. Sturdy and stubborn; it will not give up a burrow.',
    draw(g) {
      const { a, b, c, d } = g.P;
      g.l(48, 50, 54, 46, 2, a);
      g.l(42, 52, 43, 59, 3, c); g.l(28, 52, 27, 59, 3, c);
      g.e(37, 48, 15, 10, a); g.e(38, 44, 12, 4, lt(a, .15), { ring: false });
      g.l(34, 53, 34, 60, 3, c); g.l(22, 53, 21, 60, 3, c);
      g.dot(19, 60, .9, d); g.dot(22, 60, .9, d);
      g.c(22, 32, 3.6, c); g.c(33, 33, 3.6, c); g.dot(22, 31, 1, b); g.dot(33, 32, 1, b);
      g.e(23, 41, 11, 9.5, b);
      g.p([13, 42, 21, 32, 26, 33, 18, 45], c, { ring: false }); g.p([27, 34, 32, 33, 34, 43, 29, 44], c, { ring: false });
      g.e(12, 45.5, 5, 3.5, b); g.face(() => g.dot(8, 45, 1.6, c));
      g.eye(19.5, 39.5, 2.2); g.eye(29.5, 39.5, 2.2);
      g.mouth(10, 49, 14, 49.5);
    }
  },
  brockhorn: {
    n: 'Brockhorn', types: ['Ground'], base: [85, 95, 85, 45, 65, 55], cr: 60, xp: 165, sh: 30, keep: ['b', 'c'],
    moves: [[1, 'scratch'], [1, 'leer'], [1, 'mudslap'], [1, 'bite'], [14, 'mudshot'], [20, 'bulldoze'], [27, 'dig'], [33, 'bodyslam'], [40, 'rockslide']],
    pal: { a: '#6e6e78', b: '#f0eee6', c: '#22222a', d: '#b07a50', e: '#9a8a70' },
    dex: 'Its setts are centuries old, dug by generation after generation. The rocky plate on its brow can split a gatepost.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(52, 42, 60, 38, 2.4, a);
      g.l(46, 48, 48, 59, 4.4, c); g.l(24, 48, 23, 59, 4.4, c);
      g.e(38, 40, 20, 14, a);
      g.p([26, 30, 34, 24, 44, 25, 52, 30, 44, 32, 34, 31], e); g.p([32, 26, 38, 22, 42, 26], lt(e, .2));
      g.l(38, 50, 38, 60, 4.6, c); g.l(18, 50, 17, 60, 4.6, c);
      for (let i = 0; i < 3; i++) { g.l(13 + i * 2.5, 59, 11 + i * 2.5, 62, .8, d, { ring: false }); g.l(34 + i * 2.5, 59, 32 + i * 2.5, 62, .8, d, { ring: false }); }
      g.c(20, 24, 4, c); g.c(33, 25, 4, c);
      g.e(20, 35, 12.5, 11, b);
      g.p([9, 36, 18, 25, 24, 26, 15, 40], c, { ring: false }); g.p([26, 27, 32, 26, 33, 38, 28, 39], c, { ring: false });
      g.p([12, 26, 20, 18, 30, 22, 22, 28], e);
      g.e(8, 40, 6, 4.2, b); g.face(() => g.dot(3, 39.5, 1.8, c));
      g.eye(17, 33, 2.5, 'cool', { brow: c, side: -1, sc: '#ffe070' }); g.eye(28, 33, 2.4, 'cool', { brow: c, side: 1, sc: '#ffe070' });
      g.mouth(5, 44, 11, 44.5);
    }
  },
  woolt: {
    n: 'Woolt', types: ['Electric'], base: [55, 40, 40, 65, 45, 35], cr: 235, xp: 56, evo: [15, 'ramvolt'], sh: 260, keep: ['b'],
    moves: [[1, 'tackle'], [1, 'growl'], [5, 'thundershock'], [9, 'thunderwave'], [13, 'spark'], [18, 'headbutt'], [24, 'thunderbolt']],
    pal: { a: '#f8f4e8', b: '#34344c', c: '#ffe040', d: '#b8c4dc' },
    dex: 'Its fleece builds static as it grazes the windy tops. Stroking one is a hair-raising experience.',
    draw(g) {
      const { a, b, c, d } = g.P;
      g.l(26, 52, 25, 60, 2, b); g.l(44, 52, 45, 60, 2, b);
      for (const [x, y, r] of [[34, 38, 9], [45, 43, 8.5], [24, 43, 8], [30, 49, 9], [42, 51, 8], [48, 50, 6]]) g.c(x, y, r, a, { dk: d });
      g.l(31, 54, 31, 61, 2, b); g.l(38, 54, 39, 61, 2, b);
      g.e(13, 38, 4.5, 2.2, b); g.e(29, 36, 4, 2, b);
      g.e(21, 41, 7.5, 8.5, b);
      g.c(21, 32.5, 4.5, a, { dk: d }); g.c(17, 34, 3, a, { dk: d });
      g.eye(18, 41, 2.2, 'glow', { sc: '#ffffff' }); g.eye(24.5, 41, 2.2, 'glow', { sc: '#ffffff' });
      g.face(() => g.mouth(20, 47, 22.5, 47.5, '#8a8aa8'));
      g.p([50, 26, 54, 31, 51.5, 31.5, 56, 38, 49, 31.5, 51.5, 31], c, { oc: '#8a6a10' });
      g.p([10, 50, 7, 54, 9.5, 54.5, 5, 60, 12, 54.5, 9.5, 54], c, { oc: '#8a6a10' });
    }
  },
  ramvolt: {
    n: 'Ramvolt', types: ['Electric'], base: [80, 70, 65, 95, 70, 55], cr: 90, xp: 160, sh: 260, keep: [],
    moves: [[1, 'tackle'], [1, 'thundershock'], [1, 'thunderwave'], [13, 'spark'], [19, 'headbutt'], [26, 'thunderbolt'], [33, 'bodyslam']],
    pal: { a: '#727294', b: '#26263a', c: '#ffe040', d: '#9a9ab8', e: '#f0e0a8' },
    dex: 'When storm clouds gather over the fells, herds of them stand on the ridges with their horns crackling.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(44, 48, 46, 60, 2.8, b); g.l(26, 48, 24, 60, 2.8, b);
      for (const [x, y, r] of [[36, 32, 10], [48, 38, 9.5], [30, 44, 10], [44, 47, 9], [54, 46, 6.5], [24, 36, 8]]) g.c(x, y, r, a, { dk: d });
      g.l(34, 50, 34, 61, 3, b); g.l(40, 50, 41, 61, 3, b);
      g.e(16, 36, 8, 10, b);
      g.l(16, 26, 26, 22, 3.2, e); g.c(28, 27, 5, e); g.c(28, 27, 2.2, c, { ring: false });
      g.l(10, 27, 6, 22, 2.4, e); g.c(4, 26, 3.4, e);
      g.eye(12, 34, 2.2, 'cool', { sc: c, brow: b, side: -1 }); g.eye(19.5, 34, 2.2, 'cool', { sc: c, brow: b, side: 1 });
      g.face(() => g.mouth(13, 43, 17, 43.5, '#8a8aa8'));
      g.p([44, 14, 48, 20, 45, 20.5, 50, 28, 42, 20.5, 45.5, 20], c, { oc: '#8a6a10' });
      g.p([58, 30, 61, 35, 58.5, 35.5, 62, 42, 56, 35.5, 58.5, 35], c, { oc: '#8a6a10' });
    }
  },
  cairnling: {
    n: 'Cairnling', types: ['Rock'], base: [50, 55, 80, 35, 45, 25], cr: 190, xp: 60, evo: [22, 'cairnback'], sh: 90, keep: ['c', 'd'],
    moves: [[1, 'tackle'], [1, 'harden'], [6, 'rockthrow'], [10, 'bite'], [14, 'rocktomb'], [19, 'bulldoze'], [25, 'rockslide']],
    pal: { a: '#9aa864', b: '#8a7a6a', c: '#c0bcb0', d: '#76767e' },
    dex: 'Walkers add a stone to its back for luck. After many years the pile becomes a proper cairn.',
    draw(g) {
      const { a, b, c, d } = g.P;
      g.e(28, 57, 4, 3.5, a); g.e(46, 57, 4, 3.5, a); g.p([48, 50, 56, 52, 49, 55], a);
      g.e(37, 48, 14, 9.5, b); g.l(26, 50, 48, 50, .8, dk(b, .35), { ring: false }); g.l(37, 40, 37, 56, .8, dk(b, .35), { ring: false });
      g.e(36, 37, 7, 4.2, c); g.e(38, 31, 5.5, 3.6, d); g.e(36, 25.5, 4, 3.2, c); g.e(37.5, 21, 2.5, 2.2, d);
      g.e(33, 59, 4.5, 2.8, a);
      g.e(18, 47, 7.5, 6.5, a);
      g.eye(15, 45.5, 2.4); g.eye(21.5, 45.5, 2.3);
      g.mouth(14, 50.5, 17, 51);
    }
  },
  cairnback: {
    n: 'Cairnback', types: ['Rock', 'Ground'], base: [80, 85, 115, 50, 65, 30], cr: 75, xp: 170, sh: 90, keep: ['c', 'd', 'e'],
    moves: [[1, 'tackle'], [1, 'harden'], [1, 'rockthrow'], [1, 'bite'], [14, 'rocktomb'], [20, 'bulldoze'], [27, 'rockslide'], [34, 'dig']],
    pal: { a: '#86945a', b: '#6e6254', c: '#c4c0b4', d: '#7a7a84', e: '#a8d070' },
    dex: 'A slow tortoise carrying a ring of standing stones. Some say the old stone circles were built by sleeping cairnbacks.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(20, 52, 18, 60, 5, a); g.l(52, 52, 54, 60, 5, a);
      g.e(38, 46, 22, 12, b);
      for (const [x, y] of [[22, 44], [30, 46], [38, 47], [46, 46], [54, 44]]) g.l(x, y - 4, x, y + 6, .7, dk(b, .35), { ring: false });
      for (const [x, h, col] of [[20, 14, c], [28, 20, d], [37, 23, c], [46, 20, d], [54, 14, c]]) { g.p([x - 3.5, 38, x - 2.8, 38 - h, x + 2.5, 37 - h, x + 3.5, 38], col); g.dot(x - 1, 36 - h / 2, 1, e); }
      g.l(30, 54, 30, 61, 5, a); g.l(44, 54, 45, 61, 5, a);
      g.e(10, 44, 8.5, 7.5, a); g.p([2, 48, 6, 44, 8, 50], a);
      g.eye(8, 42, 2.4, 'cool', { brow: a, side: -1 }); g.eye(15, 42, 2.2, 'cool', { brow: a, side: 1 });
      g.mouth(3, 49, 9, 49.5);
    }
  },
  mushlet: {
    n: 'Mushlet', types: ['Poison', 'Grass'], base: [45, 45, 50, 60, 55, 30], cr: 190, xp: 58, evo: [16, 'toadcap'], sh: 200, keep: ['c'],
    moves: [[1, 'absorb'], [1, 'poisonsting'], [5, 'poisonpowder'], [8, 'acid'], [12, 'sleeppowder'], [16, 'megadrain'], [21, 'sludge']],
    pal: { a: '#9a5ad0', b: '#d8ff70', c: '#f4e8d8', d: '#5a3080' },
    dex: 'It pops up in damp woods overnight. Its spores cause a nasty rash, so admire it from a polite distance.',
    draw(g) {
      const { a, b, c, d } = g.P;
      g.e(26, 59.5, 4.5, 2.4, c); g.e(38, 59.5, 4.5, 2.4, c);
      g.e(32, 49, 9.5, 10, c);
      g.p([14, 37, 16, 26, 24, 18, 32, 16, 40, 18, 48, 26, 50, 37], a);
      g.e(32, 37.5, 17.5, 3.5, a);
      g.e(32, 39, 13, 2.2, d, { ring: false });
      for (const [x, y, r] of [[24, 24, 2.8], [35, 21, 2.4], [43, 29, 2.6], [21, 32, 1.8], [31, 29, 2]]) g.c(x, y, r, b, { ring: false });
      g.eye(28, 47.5, 2.4); g.eye(36, 47.5, 2.4);
      g.blush(25, 52, 1.5); g.blush(39, 52, 1.5); g.mouth(31, 53, 33, 53.5);
    }
  },
  toadcap: {
    n: 'Toadcap', types: ['Poison', 'Grass'], base: [70, 70, 75, 80, 75, 45], cr: 75, xp: 158, sh: 200, keep: ['d'],
    moves: [[1, 'absorb'], [1, 'poisonpowder'], [1, 'acid'], [12, 'sleeppowder'], [16, 'megadrain'], [22, 'sludge'], [28, 'seedbomb'], [34, 'energyball']],
    pal: { a: '#7a9a50', b: '#e8e0a0', c: '#a04ad0', d: '#d8ff70', e: '#4a6030' },
    dex: 'A squat toad wearing a toadstool like a hat. It sits so still in the leaf litter that foragers pick it by mistake.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.e(48, 54, 8, 6, a); g.e(50, 60, 8, 2, e);
      g.e(34, 48, 17, 11, a); g.e(30, 52, 11, 6.5, b);
      for (const [x, y] of [[40, 42], [46, 46], [36, 40]]) g.dot(x, y, 1.2, e);
      g.p([22, 34, 26, 22, 36, 16, 46, 16, 56, 22, 60, 34], c); g.e(41, 34, 19, 3.5, c); g.e(41, 35.5, 15, 2, dk(c, .45), { ring: false });
      for (const [x, y, r] of [[32, 24, 2.8], [44, 20, 2.6], [53, 27, 2.6], [40, 29, 2]]) g.c(x, y, r, d, { ring: false });
      g.e(18, 57, 6, 3, a); g.e(28, 59, 5, 2.5, a);
      g.e(16, 43, 3.8, 3.4, a); g.e(27, 42, 3.8, 3.4, a);
      g.eye(16, 43, 2.3, 'cool', { brow: a, side: -1, sc: '#f8f070' }); g.eye(27, 42, 2.3, 'cool', { brow: a, side: 1, sc: '#f8f070' });
      g.mouth(14, 50, 26, 50, e);
    }
  },
  grimrat: {
    n: 'Grimrat', types: ['Poison'], base: [45, 60, 40, 35, 40, 70], cr: 200, xp: 57, sh: 40, keep: ['d'], evo: [24, 'blightrat'],
    moves: [[1, 'tackle'], [1, 'tailwhip'], [4, 'poisonsting'], [8, 'bite'], [11, 'quickattack'], [15, 'poisonfang'], [22, 'sludge']],
    pal: { a: '#8a9a78', b: '#c8c8a8', c: '#a6e040', d: '#ff90a4', e: '#4a5040' },
    dex: 'Thrives in drains and spoil heaps. Villains keep them because they will eat anything and fear nothing.',
    draw(g) {
      const { a, b, c, d, e } = g.P;
      g.l(46, 54, 54, 50, 1.3, d); g.l(54, 50, 60, 54, 1.3, d); g.l(60, 54, 62, 48, 1.3, d);
      g.l(42, 52, 44, 59, 2.2, dk(a, .2)); g.e(37, 48, 12, 9, a); g.e(35, 51, 7, 4.5, b);
      for (const [x, y] of [[36, 40], [42, 41], [46, 45]]) g.l(x, y, x + 2, y - 4, .8, e, { ring: false });
      g.l(32, 53, 32, 60, 2.2, a); g.l(26, 52, 24, 60, 2.2, a);
      g.c(24, 33, 5.2, a); g.c(24, 33, 3, d, { ring: false });
      g.e(20, 42, 9, 8, a); g.p([6, 46, 14, 39, 16, 50], a); g.c(6, 46, 1.8, d);
      g.face(() => { g.p([10, 49, 13, 49, 12, 52.5], '#fff8e8', { oc: '#8a8070' }); g.e(12, 54.5, 1.2, 2, c, { ring: false }); });
      g.eye(16, 40.5, 2.3, 'cool', { sc: '#ff6a5a', brow: a, side: -1 });
      for (const [x, y] of [[20, 52], [48, 42]]) g.dot(x, y, 1, c);
    }
  },
  leywyrm: {
    n: 'Leywyrm', types: ['Dragon', 'Rock'], base: [110, 120, 110, 120, 100, 80], cr: 3, xp: 306, sh: 200, keep: [], legend: 1,
    moves: [[1, 'ancientpower'], [1, 'dragonbreath'], [1, 'bulldoze'], [30, 'rockslide'], [40, 'dragonpulse'], [45, 'earthpower'], [50, 'stoneedge'], [55, 'dracometeor']],
    pal: { a: '#5a6272', b: '#8a92a4', c: '#6affd8', d: '#2a3040' },
    dex: 'The Sleeper beneath the standing stones. Ley lines run through its body like rivers of light, and when it stirs, the whole county trembles.',
    draw(g) {
      const { a, b, c, d } = g.P;
      const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([56 - t * 40 + Math.sin(t * 7) * 6, 58 - t * 34 + Math.cos(t * 6) * 5, 7 - t * 2]); }
      for (const [x, y, r] of pts) g.c(x, y, r, a);
      for (const [x, y] of pts.filter((_, i) => i % 2 === 0)) g.dot(x, y, 1, c);
      g.p([10, 22, 4, 6, 14, 16], b); g.p([18, 18, 22, 2, 24, 16], b);
      g.e(14, 24, 10, 7, a); g.p([2, 30, 8, 22, 12, 32], a);
      g.eye(12, 22, 2.4, 'glow', { sc: c }); g.eye(19, 22, 2.2, 'glow', { sc: c });
    }
  },
};