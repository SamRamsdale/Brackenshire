// ---- sp4 ----
// ================= NEW SPECIES: DRAGONS, FOLKLORE & LEGENDS =================
SP('drakling', 'Drakling', ['Dragon'], 300, 'phys', { evo: [30, 'wyvernette'], opener: 'scratch',
  pal: { a: '#d03a38', b: '#f8d8a0', c: '#801e20', d: '#f0c040', e: '#ffffff' },
  dex: 'A baby dragon that hatched in a sea cave near Ravenscar. It tries very hard to breathe fire, but only manages hiccups.',
  draw(g) { const { a, b, c, d } = g.P;
    K.batwing(g, 40, 38, 1, 13, 10, c, dk(c, .3));
    K.tail(g, [42, 54, 50, 56, 56, 52], 3.5, 2, a); g.p([54, 48, 60, 50, 57, 55], a);
    g.e(34, 48, 11, 10, a); g.e(31, 51, 6, 6, b, { ring: false });
    g.e(26, 59, 4.5, 2.5, a); g.e(38, 59.5, 4.5, 2.5, a); g.l(25, 45, 21, 50, 2, a);
    K.batwing(g, 26, 38, -1, 11, 9, a, c);
    K.horn(g, 20, 23, -25, 6, 2, d); K.horn(g, 30, 22, 20, 6, 2, d);
    g.c(24, 32, 11, a); g.e(17, 36, 6, 4.5, b); g.face(() => { g.dot(13.5, 34.5, .9, c); g.dot(16, 34, .9, c); });
    K.eyes(g, 20, 29, 30, 2.8, 1); g.blush(25, 37, 1.4);
  } });
SP('wyvernette', 'Wyvernette', ['Dragon'], 420, 'phys', { evo: [50, 'pendrake'], opener: 'scratch', extra: [[34, 'dragondance']],
  pal: { a: '#c02e30', b: '#f4d0a0', c: '#6a1618', d: '#f0c040', e: '#ffe070' },
  dex: 'It practises flying from cliff to cliff and rarely lands gracefully. Its fire is hot enough to toast bread now.',
  draw(g) { const { a, b, c, d } = g.P;
    K.batwing(g, 40, 30, 1, 20, 18, c, dk(c, .35));
    K.tail(g, [42, 50, 52, 54, 58, 48, 60, 40], 3.5, 1.8, a); g.p([56, 36, 62, 36, 60, 42], a);
    g.l(40, 48, 44, 60, 3, dk(a, .15)); g.e(33, 44, 11, 11, a); g.e(30, 47, 6, 8, b, { ring: false });
    g.l(28, 48, 26, 60, 3.2, a); g.e(25, 61, 4, 1.6, c); g.e(45, 61, 4, 1.6, c);
    K.batwing(g, 26, 32, -1, 16, 14, a, c);
    g.l(28, 36, 22, 24, 4.5, a); K.spikes(g, 26, 30, 4, 20, 70, 3, 4, d, 1.5);
    g.e(17, 20, 8, 6.5, a); g.p([4, 22, 12, 18, 12, 25], a); g.e(9, 23, 4, 2, b, { ring: false });
    K.horn(g, 18, 14, -30, 8, 1.8, d, -15); K.horn(g, 22, 14, 15, 8, 1.8, d, 15);
    K.eye1(g, 16, 19, 2.4, 2, { brow: a, sc: '#fff0a0' });
  } });
SP('pendrake', 'Pendrake', ['Dragon', 'Flying'], 600, 'sweep', { opener: 'scratch', extra: [[55, 'outrage'], [60, 'hurricane']],
  pal: { a: '#c02428', b: '#f8d8a0', c: '#5a1014', d: '#f0c848', e: '#ffe070', f: '#ff7a30' },
  dex: 'The great red dragon of the western hills. Its likeness has flown on banners for a thousand years.',
  draw(g) { const { a, b, c, d, f } = g.P;
    K.batwing(g, 38, 24, 1, 26, 22, c, dk(c, .4)); K.batwing(g, 26, 24, -1, 24, 20, a, c);
    K.tail(g, [38, 48, 48, 54, 56, 50, 58, 40, 52, 34], 4, 1.8, a); g.p([48, 30, 54, 28, 54, 36], a);
    g.l(38, 46, 44, 60, 3.6, dk(a, .15)); g.e(33, 40, 11, 13, a); g.e(30, 44, 6, 9, b, { ring: false });
    g.l(28, 46, 24, 60, 3.8, a); g.e(23, 61, 4.5, 1.6, c); g.e(45, 61, 4.5, 1.6, c);
    g.l(26, 36, 16, 30, 2.8, a); for (let i = 0; i < 3; i++) K.horn(g, 15, 29, -80 + i * 30, 4, 1, d);
    g.l(30, 30, 24, 18, 5, a); K.spikes(g, 28, 24, 5, 10, 80, 4, 5, d, 1.8);
    g.e(18, 13, 9, 7, a); g.p([3, 16, 12, 11, 12, 19], a); g.e(8, 17, 4, 2, b, { ring: false });
    K.horn(g, 20, 7, -20, 10, 2, d, -25); K.horn(g, 24, 8, 25, 10, 2, d, 25);
    K.eye1(g, 16, 11, 2.3, 3, { brow: a, sc: '#fff0a0', pupil: '#401010' });
    K.flame(g, 0, 16, 3, f, '#ffe070', -95);
  } });
SP('lindlet', 'Lindlet', ['Dragon', 'Water'], 310, 'spec', { evo: [36, 'lindwyrm'], opener: 'pound', extra: [[1, 'watergun']],
  pal: { a: '#3a9a8a', b: '#d8f0d0', c: '#1e5a50', d: '#90e0c0', e: '#f0d060' },
  dex: 'A small lake serpent with just two stubby legs. It paddles about in reedy shallows, blowing bubbles at ducks.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [30, 50, 40, 54, 50, 50, 56, 42], 5, 2, a); g.p([54, 38, 60, 36, 58, 44], d);
    K.tail(g, [24, 44, 30, 50], 6, 6, a); g.e(28, 50, 5, 3, b, { ring: false });
    g.l(24, 50, 22, 58, 2, a); g.l(30, 52, 31, 59, 2, a); g.e(22, 59, 3, 1.2, c); g.e(31, 60, 3, 1.2, c);
    K.spikes(g, 36, 50, 7, -60, 30, 3, 4, d, 2);
    g.c(20, 36, 10, a); g.e(14, 40, 5, 3.5, b);
    K.re(g, 28, 30, 5, 2.2, 50, d); K.re(g, 13, 29, 4, 2, -40, d);
    K.eyes(g, 16, 24, 34, 2.7, 1); g.blush(21, 40, 1.4); g.mouth(12, 42, 15, 42.5, c);
  } });
SP('lindwyrm', 'Lindwyrm', ['Dragon', 'Water'], 505, 'spec', { extra: [[44, 'dragonpulse'], [50, 'hydropump']],
  pal: { a: '#2a7a6a', b: '#c8e8c0', c: '#124a40', d: '#7ad8b0', e: '#f0c850' },
  dex: 'It coils beneath the deepest lake in Highfell. Old maps mark its home with a warning in faded ink.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [26, 50, 38, 56, 50, 54, 58, 46, 60, 36], 7, 2.5, a); g.p([58, 30, 64, 28, 62, 38], d);
    K.spikes(g, 44, 54, 9, -60, 60, 4, 5, d, 2.2);
    K.tail(g, [22, 40, 26, 50], 8, 8, a); g.e(24, 50, 6, 4, b, { ring: false });
    g.l(20, 50, 16, 60, 3, a); g.l(28, 52, 30, 61, 3, a); for (const x of [14, 17, 29, 32]) g.l(x + 1, 60, x, 62.5, .7, c);
    g.l(22, 38, 18, 26, 6, a); g.e(18, 32, 3.5, 5, b, { ring: false });
    g.e(14, 20, 10, 7, a); g.e(6, 23, 5, 3.5, a); g.e(9, 25, 5, 1.8, b, { ring: false });
    for (let i = 0; i < 4; i++) K.re(g, 22 + i * 1.5, 16 - i * 2.5, 5, 1.6, 60 - i * 10, d);
    K.horn(g, 16, 13, -15, 8, 1.6, e, -10);
    K.tail(g, [5, 26, 1, 32, 3, 38], .8, .5, e);
    K.eye1(g, 12, 18, 2.4, 3, { brow: a, sc: '#fff4a0' });
  } });
SP('salamber', 'Salamber', ['Fire'], 300, 'spec', { evo: [32, 'salamandrake'], opener: 'scratch', extra: [[1, 'ember']],
  pal: { a: '#f08030', b: '#ffe0a0', c: '#2a2a2a', d: '#ffd040', e: '#ff5020' },
  dex: 'Old folk believed salamanders were born in fire. Salamber certainly seems happiest curled up in a hearth.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [42, 50, 50, 52, 56, 48, 58, 42], 3.5, 1.8, a); K.flame(g, 58, 38, 3.5, e, d);
    g.l(40, 52, 44, 60, 2, a); g.l(24, 52, 20, 60, 2, a);
    K.tail(g, [24, 48, 32, 52, 42, 50], 7, 6, a); K.spots(g, [[28, 48, 1.8], [36, 49, 1.8], [42, 47, 1.5]], c);
    g.l(38, 54, 40, 61, 2.2, a); g.l(28, 54, 26, 61, 2.2, a);
    g.e(18, 42, 9, 7, a); g.e(14, 46, 6, 3, b, { ring: false }); K.spots(g, [[20, 37, 1.5]], c);
    K.eyes(g, 14, 22, 40, 2.6, 1); g.mouth(10, 46, 15, 47, dk(a, .4)); g.blush(22, 45, 1.3);
  } });
SP('salamandrake', 'Salamandrake', ['Fire', 'Dragon'], 500, 'mixed', { extra: [[40, 'dragonclaw'], [46, 'flamethrower']], opener: 'scratch',
  pal: { a: '#e06020', b: '#ffd080', c: '#2a1e1a', d: '#ffd040', e: '#ff3818' },
  dex: 'It walks through bonfires unharmed. Villages light beacon fires on midsummer night hoping to glimpse one.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [44, 46, 54, 50, 60, 44, 62, 34], 5, 2.5, a); K.flame(g, 62, 30, 4.5, e, d);
    g.l(44, 48, 50, 60, 3, dk(a, .2)); g.l(24, 48, 18, 60, 3, dk(a, .2));
    K.tail(g, [20, 40, 30, 46, 44, 44], 10, 8.5, a); K.spots(g, [[26, 40, 2.2], [34, 42, 2.2], [42, 40, 2]], c);
    for (let i = 0; i < 5; i++) K.flame(g, 22 + i * 5, 33 - (i % 2) * 2, 2.8, e, d);
    g.l(40, 50, 44, 61, 3.2, a); g.l(28, 50, 24, 61, 3.2, a); for (const x of [21, 24, 27, 41, 44, 47]) g.l(x + 1, 60, x, 62.5, .7, c);
    g.e(14, 34, 10, 8, a); g.p([2, 36, 10, 31, 12, 40], a); g.e(10, 39, 7, 3, b, { ring: false });
    K.horn(g, 14, 27, -40, 7, 1.8, d, -20); K.horn(g, 19, 27, 10, 7, 1.8, d, 20);
    K.eye1(g, 12, 32, 2.4, 3, { brow: a, sc: '#fff080', pupil: c });
  } });
SP('omenkit', 'Omenkit', ['Psychic'], 300, 'sspd', { evo: [30, 'sibylynx'], opener: 'scratch',
  pal: { a: '#2a2a3e', b: '#4a4a66', c: '#f0e070', d: '#c080ff', e: '#ff9ab8' },
  dex: 'Some say a black kitten crossing your path is unlucky. Omenkit simply knows where you are going before you do.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [44, 56, 52, 50, 54, 40, 50, 34], 2.8, 2.2, a); for (const [x, y] of [[53, 44], [52, 38], [50, 51]]) g.dot(x, y, .7, c);
    g.e(34, 48, 10, 11, a); g.e(31, 51, 5, 6, b, { ring: false });
    g.l(28, 52, 27, 61, 2.2, a); g.l(34, 53, 34, 61, 2.2, a);
    K.ear(g, 20, 24, -30, 10, 4, a, e); K.ear(g, 35, 23, 28, 10, 4, a, e);
    g.c(28, 31, 11, a); g.e(26, 35.5, 5, 3.5, b); g.face(() => g.dot(25, 33.5, 1.1, e));
    g.p([28, 20, 30, 23, 28, 26, 26, 23], d, { ring: false });
    K.eyes(g, 23, 32, 30, 3, 1); g.face(() => { g.e(23, 30, 2.2, 3, c, { ring: false, shade: false }); g.e(32, 30, 2.2, 3, c, { ring: false, shade: false }); g.e(23, 30, .8, 2.4, a, { ring: false, shade: false }); g.e(32, 30, .8, 2.4, a, { ring: false, shade: false }); });
  } });
SP('sibylynx', 'Sibylynx', ['Psychic', 'Dark'], 490, 'sspd', { extra: [[36, 'darkpulse'], [42, 'calmmind']], opener: 'scratch',
  pal: { a: '#3a3456', b: '#6a6090', c: '#f0e070', d: '#c080ff', e: '#9af0ff' },
  dex: 'It reads fortunes in the stars. Three crystal orbs orbit its head, each showing a different possible tomorrow.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [48, 44, 56, 40, 58, 32], 3, 2.8, a); g.c(58, 30, 3, c);
    g.l(44, 46, 45, 60, 2.6, dk(a, .2)); g.l(26, 47, 24, 60, 2.6, dk(a, .2));
    g.e(36, 40, 14, 9, a); for (const [x, y] of [[32, 37], [38, 39], [44, 37], [36, 43]]) g.dot(x, y, .8, c);
    g.l(47, 46, 48, 61, 2.8, a); g.l(29, 47, 28, 61, 2.8, a);
    K.ear(g, 14, 22, -22, 11, 3.5, a, b); K.ear(g, 24, 21, 22, 11, 3.5, a, b); K.horn(g, 11, 12, -22, 5, .8, a); K.horn(g, 27, 11, 22, 5, .8, a);
    g.e(18, 30, 9, 8, a); K.spikes(g, 18, 34, 7, 110, 250, 5, 4, b, 2); g.e(12, 33, 4.5, 3.5, b);
    g.p([18, 22, 20, 25, 18, 28, 16, 25], d, { ring: false });
    K.eye1(g, 16, 29, 2.5, 3, { brow: a, sc: c, pupil: '#1a1030' });
    for (const [x, y] of [[4, 16], [30, 8], [40, 18]]) { g.c(x, y, 3.2, e); K.shine(g, x - 1, y - 1); }
  } });
SP('dozelet', 'Dozelet', ['Psychic'], 200, 'spec', { evo: [16, 'snoozer'], opener: 'confusion', extra: [[1, 'hypnosis']],
  pal: { a: '#d8a878', b: '#fff0e0', c: '#6a58b0', d: '#b8e0ff', e: '#ffd060', f: '#ffb8b0' },
  dex: 'A dormouse that naps up to twenty-two hours a day, curled up on a bubble of its own dreams. Waking it is considered very rude.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.c(32, 44, 15, d, { oc: '#8ab0e0' }); g.e(24, 36, 5, 3, '#ffffff', { ring: false });
    K.bushy(g, 42, 50, -60, 16, 4, a, lt(a, .2));
    g.e(32, 47, 10, 8, a); g.e(30, 49, 6, 4, b, { ring: false });
    K.earR(g, 21, 36, 4, a, f); K.earR(g, 31, 34, 4, a, f);
    g.c(26, 42, 7, a); g.e(22, 45, 3.5, 2.5, b); g.face(() => g.dot(19.5, 44.5, .9, '#3a2a2a'));
    g.face(() => { g.l(22, 41.5, 24.5, 42.5, .6, '#3a2a50', { ring: false, shade: false }); g.l(27.5, 42.5, 30, 41.5, .6, '#3a2a50', { ring: false, shade: false }); });
    g.blush(23, 45.5, 1.1);
    for (const [x, y, s] of [[46, 24, 7], [52, 18, 6], [56, 12, 5]]) txtZ(g, x, y, s, c); void e;
  } });
function txtZ(g, x, y, s, col) { g.l(x, y, x + s * .5, y, .5, col, { ring: false, shade: false }); g.l(x + s * .5, y, x, y + s * .5, .5, col, { ring: false, shade: false }); g.l(x, y + s * .5, x + s * .5, y + s * .5, .5, col, { ring: false, shade: false }); }
SP('snoozer', 'Snoozer', ['Psychic'], 355, 'spec', { evo: [36, 'somnarch'], opener: 'confusion', extra: [[1, 'hypnosis']],
  pal: { a: '#c8966a', b: '#fff0e0', c: '#5a48a0', d: '#b8e0ff', e: '#ffd060', f: '#ffb0a8' },
  dex: 'It sleepwalks everywhere clutching its pillow, tail swishing. Its psychic powers are strongest when it is fast asleep.',
  draw(g) { const { a, b, c, e, f } = g.P;
    K.bushy(g, 40, 54, 50, 20, 4.5, a, lt(a, .2));
    g.l(26, 50, 24, 61, 2.6, a); g.l(38, 50, 40, 61, 2.6, a); g.e(23, 61.5, 3.5, 1.4, a); g.e(41, 61.5, 3.5, 1.4, a);
    g.e(32, 42, 11, 13, a); g.e(30, 46, 6, 8, b, { ring: false });
    g.p([14, 38, 30, 34, 32, 48, 16, 50], b); g.l(18, 40, 28, 38, .5, '#c8c0d8', { ring: false, shade: false });
    g.l(24, 36, 20, 42, 2.4, a); g.l(40, 36, 42, 44, 2.4, a);
    K.earR(g, 23, 14, 5, a, f); K.earR(g, 41, 14, 5, a, f);
    g.c(32, 22, 10, a); g.e(28, 26, 5, 3.5, b); g.face(() => g.dot(24, 25, 1, '#3a2a2a'));
    g.p([24, 16, 32, 8, 44, 11, 50, 22, 42, 17], c); g.c(51, 23, 2.2, e);
    g.face(() => g.l(27, 21, 30.5, 22, .6, '#3a2a50', { ring: false, shade: false })); g.eye(36, 21, 2.2, 'cute');
    g.blush(27, 27, 1.2);
    txtZ(g, 8, 18, 6, c); txtZ(g, 4, 10, 5, c);
  } });
SP('somnarch', 'Somnarch', ['Psychic'], 515, 'sspd', { extra: [[40, 'psychic'], [46, 'calmmind'], [52, 'psystrike']], opener: 'confusion',
  pal: { a: '#2a2a58', b: '#e0b088', c: '#f0d060', d: '#8a70e0', e: '#b8e0ff', f: '#ffb0a8' },
  dex: 'The dormouse sovereign of dreams. It wanders into sleepers\' dreams and chases away nightmares, though it may leave behind strange ideas.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.bushy(g, 44, 58, 70, 22, 5, b, lt(b, .25));
    g.p([12, 62, 22, 26, 42, 26, 52, 62, 42, 58, 32, 62, 22, 58], a); for (const [x, y] of [[18, 52], [26, 44], [36, 50], [44, 42], [30, 58], [46, 56]]) { g.l(x - 1.5, y, x + 1.5, y, .5, c, { ring: false, shade: false }); g.l(x, y - 1.5, x, y + 1.5, .5, c, { ring: false, shade: false }); }
    g.l(22, 32, 12, 40, 2.6, a); g.l(42, 32, 52, 40, 2.6, a); g.c(11, 41, 2.4, b); g.c(53, 41, 2.4, b);
    g.c(53, 34, 4, e); K.shine(g, 52, 33);
    K.earR(g, 22, 13, 5.5, b, f); K.earR(g, 42, 13, 5.5, b, f);
    g.c(32, 21, 10, b); g.e(30, 25, 5, 3.5, lt(b, .3)); g.face(() => g.dot(27, 24, 1, '#3a2a2a'));
    g.c(32, 8, 6, c); g.c(35, 6, 5, a, { ring: false }); K.shine(g, 28, 6);
    K.eyes(g, 28, 36, 20, 2.3, 3, { glow: true, sc: d });
  } });
SP('postling', 'Postling', ['Steel', 'Psychic'], 300, 'spec', { evo: [30, 'pillarbox'], opener: 'tackle', extra: [[1, 'confusion']],
  pal: { a: '#d82828', b: '#f05050', c: '#1e1e24', d: '#f0d040', e: '#fff8f0' },
  dex: 'It gobbles up letters and somehow always delivers them. Nobody knows how, but it gets them there by teatime.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.e(26, 59, 4, 2, c); g.e(38, 59, 4, 2, c); g.l(27, 52, 26, 58, 2, c); g.l(37, 52, 38, 58, 2, c);
    g.l(21, 42, 14, 46, 1.8, a); g.l(43, 42, 50, 38, 1.8, a); g.p([48, 32, 58, 32, 58, 39, 48, 39], e); g.l(48, 32, 53, 36, .5, '#c0b8b0', { ring: false, shade: false }); g.l(58, 32, 53, 36, .5, '#c0b8b0', { ring: false, shade: false });
    g.p([21, 54, 21, 30, 23, 24, 32, 20, 41, 24, 43, 30, 43, 54], a); g.p([24, 30, 28, 26, 30, 26, 27, 50, 24, 50], b, { ring: false });
    g.e(32, 23, 12, 4, c); g.e(32, 22, 10, 3, a, { ring: false });
    g.p([25, 34, 39, 34, 39, 37, 25, 37], c); g.p([28, 42, 36, 42, 36, 48, 28, 48], d, { ring: false });
    K.eyes(g, 27.5, 36.5, 30, 2.3, 1); g.blush(24, 38.5, 1.2); g.blush(40, 38.5, 1.2);
  } });
SP('pillarbox', 'Pillarbox', ['Steel', 'Psychic'], 485, 'spec', { extra: [[36, 'flashcannon'], [42, 'psychic']], opener: 'tackle',
  pal: { a: '#c82020', b: '#e84848', c: '#1a1a20', d: '#e8c040', e: '#fff8f0', f: '#8ad0ff' },
  dex: 'It has stood on the same street corner for a hundred years, reading every letter it swallows. It knows everyone\'s secrets and keeps them all.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.p([16, 62, 48, 62, 46, 58, 18, 58], c);
    g.l(20, 36, 8, 30, 3, a); g.c(7, 29, 2.8, a); g.l(44, 36, 56, 30, 3, a); g.c(57, 29, 2.8, a);
    for (const [x, y] of [[4, 18], [60, 16], [56, 6]]) { g.p([x - 4, y - 2.5, x + 4, y - 2.5, x + 4, y + 2.5, x - 4, y + 2.5], e); g.l(x - 4, y - 2.5, x, y, .4, '#c0b8b0', { ring: false, shade: false }); g.l(x + 4, y - 2.5, x, y, .4, '#c0b8b0', { ring: false, shade: false }); }
    g.p([18, 58, 18, 18, 22, 12, 32, 9, 42, 12, 46, 18, 46, 58], a); g.p([21, 20, 26, 14, 29, 14, 26, 54, 21, 54], b, { ring: false });
    g.e(32, 11, 15, 4, c); g.e(32, 10, 13, 3, a, { ring: false }); g.p([28, 7, 29, 2, 32, 5, 35, 2, 36, 7], d);
    g.p([23, 26, 41, 26, 41, 30, 23, 30], c);
    g.p([26, 38, 38, 38, 38, 46, 26, 46], d, { ring: false }); g.p([28, 40, 36, 40, 32, 44], e, { ring: false });
    K.eyes(g, 27, 37, 21, 2.3, 2, { glow: true, sc: f });
  } });
SP('bullnip', 'Bullnip', ['Fighting'], 300, 'phys', { evo: [28, 'bulwark'], opener: 'tackle', extra: [[1, 'rocksmash']],
  pal: { a: '#e8dcc8', b: '#c8a878', c: '#6a4a30', d: '#ff9aa8', e: '#fffaf0' },
  dex: 'It looks grumpy but loves a cuddle. Once it bites onto a tug-of-war rope, it will never, ever let go.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(42, 48, 44, 60, 3, a); g.l(24, 50, 22, 60, 3, a); K.tail(g, [46, 42, 50, 38], 1.8, 1.6, a);
    g.e(34, 46, 13, 10, a); g.e(38, 42, 5, 4, b, { ring: false });
    g.l(40, 52, 41, 60, 3.2, a); g.l(28, 52, 27, 60, 3.2, a); for (const x of [27, 41]) g.e(x, 61, 3, 1.3, e);
    K.earR(g, 14, 25, 4, b, d); K.earR(g, 32, 24, 4, b, d);
    g.e(23, 34, 12, 10, a); g.e(21, 40, 9, 5, e); g.l(16, 30, 30, 30, .6, dk(a, .2), { ring: false, shade: false });
    g.face(() => { g.e(20, 36.5, 3, 2, c); g.p([15, 42, 26, 42, 25, 44, 16, 44], dk(a, .35), { ring: false }); g.p([16, 42, 17.5, 42, 16.8, 39.5], '#fff', { ring: false }); g.p([24, 42, 25.5, 42, 24.8, 39.5], '#fff', { ring: false }); });
    K.eyes(g, 17, 27, 31, 2.4, 2, { brow: a });
  } });
SP('bulwark', 'Bulwark', ['Fighting', 'Steel'], 495, 'phys', { extra: [[36, 'bulkup'], [44, 'ironhead'], [50, 'closecombat']], opener: 'tackle',
  pal: { a: '#e0d0b8', b: '#b8986a', c: '#5a3a24', d: '#8a94a8', e: '#fffaf0', f: '#c83838' },
  dex: 'A stubborn bulldog clad in iron plates. It plants itself in doorways and refuses to budge. Nothing gets past.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(46, 44, 49, 60, 4.5, a); g.l(24, 46, 20, 60, 4.5, a);
    g.e(38, 42, 17, 12, a); g.p([30, 32, 44, 30, 54, 36, 52, 42, 32, 42], d); K.spikes(g, 42, 34, 5, -60, 60, 3, 4, lt(d, .3), 2);
    g.l(44, 50, 46, 61, 4.8, a); g.l(28, 52, 26, 61, 4.8, a); for (const x of [26, 46]) g.e(x, 61.5, 4, 1.5, e);
    g.l(14, 38, 32, 44, 3, f); K.spikes(g, 23, 41, 3, 150, 250, 3, 3, d, 1.5);
    K.earR(g, 10, 20, 4.2, b, '#ff9aa8'); K.earR(g, 28, 18, 4.2, b, '#ff9aa8');
    g.e(19, 29, 13, 11, a); g.e(17, 36, 10, 5.5, e); g.p([10, 22, 20, 18, 28, 22, 20, 26], d);
    g.face(() => { g.e(15, 32.5, 3.5, 2.2, c); g.p([9, 38, 24, 38, 23, 41, 10, 41], dk(a, .4), { ring: false }); g.p([10, 38, 12, 38, 11, 34.5], '#fff', { ring: false }); g.p([21, 38, 23, 38, 22, 34.5], '#fff', { ring: false }); });
    K.eyes(g, 13, 24, 26, 2.3, 3, { brow: a, sc: '#ffe070' });
  } });
SP('calfling', 'Calfling', ['Normal'], 300, 'hp', { evo: [30, 'highhorn'], opener: 'tackle',
  pal: { a: '#c8703a', b: '#e8a060', c: '#6a3a1a', d: '#ffc0b0', e: '#f0e0c0' },
  dex: 'A shaggy calf from the northern glens. Its fringe is so long it walks into gates, but it never seems to mind.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(42, 48, 43, 60, 2.6, dk(a, .15)); g.l(26, 48, 25, 60, 2.6, dk(a, .15)); K.tail(g, [48, 42, 51, 50], 1, 1, a); g.c(51, 52, 2, b);
    g.e(36, 43, 13, 9, a); for (let i = 0; i < 6; i++) K.ear(g, 26 + i * 4, 51, 180 + (i % 2) * 15, 4, 1.5, a);
    g.l(44, 50, 45, 60, 2.8, a); g.l(29, 50, 28, 60, 2.8, a); for (const x of [28, 45]) g.e(x, 61, 2.6, 1.2, c);
    K.earL(g, 12, 32, -110, 7, 2.5, a, d); K.earL(g, 28, 30, 110, 7, 2.5, a, d); K.horn(g, 15, 26, -40, 4, 1.4, e); K.horn(g, 25, 25, 40, 4, 1.4, e);
    g.e(20, 34, 9, 8, a); g.e(18, 40, 6.5, 4, d); g.face(() => { g.dot(15.5, 40, .9, c); g.dot(20.5, 40, .9, c); });
    for (let i = 0; i < 6; i++) K.ear(g, 13 + i * 3, 28, 170 + (i - 2.5) * 8, 7, 1.8, b);
    g.face(() => { g.eye(16, 34.5, 1.6); g.eye(24, 34.5, 1.6); }); g.blush(13, 37, 1.2);
  } });
SP('highhorn', 'Highhorn', ['Normal', 'Fighting'], 490, 'phys', { extra: [[38, 'bulkup'], [44, 'doubleedge']], opener: 'tackle',
  pal: { a: '#b8602a', b: '#e09050', c: '#4a2a14', d: '#e8dcc8', e: '#ffb8a0' },
  dex: 'Its great sweeping horns can span a farm gate. It is gentle with its herd and fearless against anything that threatens it.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.l(48, 44, 50, 60, 3.8, dk(a, .15)); g.l(26, 46, 24, 60, 3.8, dk(a, .15)); K.tail(g, [54, 36, 57, 48], 1.2, 1.2, a); g.c(57, 50, 2.5, b);
    g.e(40, 40, 16, 12, a); for (let i = 0; i < 8; i++) K.ear(g, 26 + i * 4, 50, 180 + (i % 2) * 12, 5, 2, i % 2 ? a : b);
    g.l(50, 48, 52, 60, 4, a); g.l(30, 48, 28, 60, 4, a); for (const x of [28, 52]) g.e(x, 61, 3.6, 1.5, c);
    K.horn(g, 12, 22, -85, 16, 3, d, 60); K.horn(g, 28, 21, 85, 16, 3, d, -60);
    g.e(20, 30, 10, 9, a); g.e(17, 37, 7, 4.5, e); g.face(() => { g.dot(14, 37, 1, c); g.dot(20, 37, 1, c); });
    for (let i = 0; i < 7; i++) K.ear(g, 11 + i * 3, 23, 172 + (i - 3) * 8, 9, 2, b);
    g.face(() => { g.eye(15, 30.5, 1.8, 'cool', { side: -1, brow: b }); g.eye(24, 30.5, 1.8, 'cool', { side: 1, brow: b }); });
  } });
SP('martip', 'Martip', ['Dark'], 290, 'fast', { evo: [26, 'nightmarten'], opener: 'scratch',
  pal: { a: '#6a3e24', b: '#f8dca0', c: '#2a1a14', d: '#ffb8a0' },
  dex: 'A pine marten kit that scampers through the treetops at night. It pinches eggs from nests and blames the squirrels.',
  draw(g) { const { a, b, c, d } = g.P;
    K.bushy(g, 42, 54, 55, 24, 6, a, dk(a, .2));
    g.e(33, 48, 10, 10, a); g.e(29, 46, 5, 6, b, { ring: false });
    g.l(27, 52, 26, 60, 2.2, c); g.l(34, 53, 34, 60, 2.2, c);
    K.earR(g, 18, 25, 4.2, a, d); K.earR(g, 34, 24, 4.2, a, d); g.c(18, 25, 4.8, b, { ring: false }); g.c(18, 25.5, 2.6, d, { ring: false }); g.c(34, 24, 4.8, b, { ring: false }); g.c(34, 24.5, 2.6, d, { ring: false });
    g.c(26, 33, 10.5, a); g.e(24, 39, 6, 4, b); g.face(() => g.dot(20.5, 37.5, 1.4, c));
    K.eyes(g, 21, 30, 31, 2.8, 1); g.face(() => g.mouth(20, 41.5, 24, 41, c));
  } });
SP('nightmarten', 'Nightmarten', ['Dark'], 470, 'sweep', { extra: [[34, 'foulplay'], [40, 'nastyplot']], opener: 'scratch',
  pal: { a: '#4a2a1a', b: '#f8d890', c: '#1a1210', d: '#e0a070', e: '#f0d060' },
  dex: 'It moves through the forest canopy without a sound. Gamekeepers have spent lifetimes trying to catch one, and never have.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.bushy(g, 50, 42, 60, 28, 7, a, dk(a, .25));
    g.l(46, 46, 47, 60, 2.4, c); g.l(26, 47, 24, 60, 2.4, c);
    K.tail(g, [48, 42, 38, 42, 28, 40], 7.5, 7, a); g.p([22, 36, 32, 40, 30, 48, 22, 46], b, { ring: false });
    g.l(49, 46, 50, 61, 2.6, c); g.l(30, 47, 29, 61, 2.6, c);
    K.earR(g, 12, 21, 4.4, a, d); K.earR(g, 24, 20, 4.4, a, d); g.c(12, 21, 5, b, { ring: false }); g.c(12, 21.5, 2.8, d, { ring: false }); g.c(24, 20, 5, b, { ring: false }); g.c(24, 20.5, 2.8, d, { ring: false });
    g.e(18, 30, 9, 8, a); g.p([4, 34, 12, 30, 16, 38, 8, 38], a); g.e(14, 36, 5, 3, b, { ring: false }); g.face(() => g.dot(4.5, 34, 1.4, c));
    K.eye1(g, 15, 28, 2.3, 3, { brow: a, sc: e, pupil: c }); g.face(() => g.mouth(7, 37.5, 12, 37, c));
  } });
SP('grimpup', 'Grimpup', ['Dark'], 300, 'phys', { evo: [34, 'barghest'], opener: 'bite',
  pal: { a: '#2a2a30', b: '#4a4a54', c: '#ff4040', d: '#e0e0e8' },
  dex: 'A shaggy black puppy seen at crossroads after dark. It follows lonely walkers home, wagging, to make sure they get there.',
  draw(g) { const { a, b, c, d } = g.P;
    K.tail(g, [44, 52, 50, 46, 52, 40], 2.6, 2, a); K.spikes(g, 50, 44, 3, -20, 60, 3, 3, a, 1.2);
    g.e(34, 48, 11, 10, a); K.spikes(g, 34, 48, 10, 140, 220, 4, 4, a, 2);
    g.l(28, 52, 27, 61, 2.2, a); g.l(34, 53, 34, 61, 2.2, a);
    K.earL(g, 18, 24, -60, 10, 3.2, b); K.earL(g, 32, 23, 45, 10, 3.2, b);
    g.c(25, 32, 11, a); K.spikes(g, 25, 32, 10, -60, 60, 5, 4, a, 2); g.e(18, 37, 6, 4, b); g.face(() => g.dot(13.5, 35.5, 1.5, '#101014'));
    K.eyes(g, 21, 30, 30, 2.8, 1); g.face(() => { g.dot(21, 30, 1.2, c); g.dot(30, 30, 1.2, c); }); g.face(() => g.e(18, 41.5, 1.4, 1.8, '#ff90a0', { ring: false })); void d;
  } });
SP('barghest', 'Barghest', ['Dark', 'Ghost'], 500, 'phys', { extra: [[40, 'crunch'], [46, 'phantomforce']], opener: 'bite',
  pal: { a: '#1e1e26', b: '#3a3a4a', c: '#ff3a30', d: '#9ad0c0', e: '#a0a0b0' },
  dex: 'A phantom hound as big as a calf. Its howl on the moor is heard for miles, and its eyes burn like coals.',
  draw(g) { const { a, b, c, d, e } = g.P;
    for (let i = 0; i < 4; i++) K.flame(g, 50 + i * 3, 50 - i * 5, 3, lt(d, .1), '#e0fff8', 60);
    g.l(46, 46, 48, 60, 3.4, a); g.l(26, 47, 22, 60, 3.4, a);
    K.tail(g, [52, 38, 58, 32, 60, 24], 3, 2, a);
    g.e(38, 40, 16, 11, a); K.spikes(g, 38, 38, 14, -70, 20, 6, 5, b, 2.5);
    g.l(50, 48, 52, 61, 3.8, a); g.l(30, 48, 28, 61, 3.8, a); for (const x of [28, 52]) K.flame(g, x, 60, 2.2, d, '#ffffff', 180);
    K.tail(g, [22, 38, 28, 44, 34, 42, 40, 46], .9, .9, e);
    K.ear(g, 14, 20, -25, 12, 4, a, b); K.ear(g, 24, 19, 20, 12, 4, a, b);
    g.e(18, 28, 11, 9, a); g.p([2, 32, 12, 28, 16, 38, 6, 38], b); g.face(() => g.dot(3, 32, 1.6, '#08080a'));
    g.face(() => { g.p([6, 37, 16, 37, 14, 40, 8, 40], '#50101a', { ring: false }); g.p([8, 37, 9.5, 37, 8.8, 39.5], '#fff', { ring: false }); g.p([13, 37, 14.5, 37, 13.8, 39.5], '#fff', { ring: false }); });
    K.eye1(g, 16, 25, 2.5, 3, { glow: true, sc: c });
  } });
SP('yewling', 'Yewling', ['Grass', 'Poison'], 300, 'spec', { evo: [32, 'yewdirge'], opener: 'absorb', extra: [[1, 'poisonsting']],
  pal: { a: '#2a5a3a', b: '#4a8a58', c: '#e02838', d: '#9af0d0', e: '#6a4028' },
  dex: 'Found in the shade of churchyard yews. Its bright red berries look tasty but are terribly poisonous, as it proudly warns everyone.',
  draw(g) { const { a, b, c, d } = g.P;
        g.c(32, 36, 11, b);
    for (let k = 0; k < 9; k++) { const an = -100 + k * 25; const [x, y] = K.pt(32, 34, an, 9); K.leaf(g, x, y, an, 8, 2, k % 2 ? a : b); }
    K.spots(g, [[22, 30, 1.8], [42, 30, 1.8], [32, 22, 1.8]], c);
    K.eyes(g, 27, 37, 37, 2.6, 1, { col: '#102018' }); g.mouth(30, 42, 34, 42, a); g.blush(23, 40, 1.3); g.blush(41, 40, 1.3); g.l(32, 47, 32, 58, 1.4, '#6a4028'); K.leaf(g, 32, 56, -60, 6, 2, b); K.leaf(g, 32, 55, 60, 6, 2, a);
  } });
SP('yewdirge', 'Yewdirge', ['Grass', 'Poison'], 480, 'spec', { extra: [[40, 'sludgebomb'], [44, 'gigadrain']], opener: 'absorb',
  pal: { a: '#1e4a2e', b: '#3a7a48', c: '#e02030', d: '#9af0d0', e: '#5a3a24', f: '#2a1a14' },
  dex: 'Some yew trees are older than the churches beside them. Yewdirge is the oldest of all, and every part of it is toxic except its kindly heart.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(24, 48, 18, 62, 4.5, e); g.l(40, 48, 46, 62, 4.5, e); g.l(32, 50, 32, 63, 4, e);
    g.p([18, 54, 20, 30, 44, 30, 46, 54, 32, 58], e); g.l(26, 34, 24, 52, .8, dk(e, .3), { ring: false, shade: false }); g.l(38, 34, 40, 52, .8, dk(e, .3), { ring: false, shade: false });
    for (const [x, y, r] of [[32, 18, 16], [16, 24, 9], [48, 24, 9], [22, 10, 8], [42, 10, 8], [32, 4, 6]]) g.c(x, y, r, a);
    for (const [x, y, r] of [[26, 14, 5], [38, 16, 5], [18, 24, 4], [46, 22, 4]]) g.c(x, y, r, b, { ring: false });
    K.spots(g, [[14, 18, 2], [50, 18, 2], [24, 6, 2], [40, 6, 2], [32, 26, 2], [10, 28, 1.8], [54, 28, 1.8]], c);
    g.e(32, 40, 9, 7, dk(e, .25)); K.eyes(g, 28, 36, 40, 2.4, 3, { sc: '#f0e8c0', brow: e }); g.mouth(29, 45, 35, 45, f);
  } });
SP('wreckling', 'Wreckling', ['Ghost', 'Water'], 300, 'spec', { evo: [34, 'shipwraith'], opener: 'astonish', extra: [[1, 'watergun']],
  pal: { a: '#c8e8f0', b: '#f0fcff', c: '#2a4a6a', d: '#5a8a4a', e: '#e8c050' },
  dex: 'It rose from a wrecked fishing boat, still wearing the skipper\'s cap. It hands out lost buttons it finds on the seabed.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [26, 50, 24, 56, 28, 60], 1.2, .8, d); K.tail(g, [38, 50, 40, 58, 36, 62], 1.2, .8, d);
    g.p([20, 36, 20, 50, 24, 56, 28, 52, 32, 58, 36, 52, 40, 56, 44, 50, 44, 36], a); g.c(32, 36, 12, a); g.e(28, 32, 5, 4, b, { ring: false });
    g.l(20, 42, 14, 46, 2, a); g.l(44, 42, 50, 38, 2, a); g.l(50, 38, 52, 30, .8, e); g.c(52, 28, 2, e, { ring: false }); g.l(49, 29, 55, 29, .8, e);
    g.e(32, 25, 13, 3.5, c); g.p([22, 25, 24, 16, 40, 16, 42, 25], c); g.l(24, 21, 40, 21, 1, b, { ring: false }); g.e(32, 18, 4, 1.4, e, { ring: false });
    K.eyes(g, 27, 37, 36, 2.6, 1, { col: '#102038' }); g.mouth(30, 42, 34, 42, c); g.blush(23, 40, 1.3); g.blush(41, 40, 1.3);
  } });
SP('shipwraith', 'Shipwraith', ['Ghost', 'Water'], 490, 'spec', { extra: [[40, 'shadowball'], [46, 'hydropump']], opener: 'astonish',
  pal: { a: '#e8e0c8', b: '#6a4a30', c: '#2a2a3a', d: '#9af0e0', e: '#f0c050', f: '#3a5a7a' },
  dex: 'A phantom galleon with sails of mist. On foggy nights it drifts along the coast, lantern swinging, searching for its lost crew.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(32, 6, 32, 50, 1.6, b); g.l(18, 14, 46, 14, 1.2, b); g.l(20, 30, 44, 30, 1.2, b);
    g.p([18, 14, 46, 14, 44, 28, 40, 24, 36, 29, 30, 24, 24, 29, 20, 24], a); g.p([20, 30, 44, 30, 42, 42, 36, 38, 30, 44, 24, 38, 22, 42], a);
    g.l(24, 18, 28, 26, .5, dk(a, .25), { ring: false, shade: false }); g.l(38, 32, 34, 40, .5, dk(a, .25), { ring: false, shade: false });
    g.p([6, 44, 58, 44, 52, 56, 12, 56], b); g.l(8, 48, 56, 48, .8, e, { ring: false }); K.spots(g, [[18, 52, 1.4], [28, 52, 1.4], [38, 52, 1.4], [48, 52, 1.4]], c);
    g.p([2, 40, 10, 44, 8, 48], b); g.l(58, 44, 62, 38, 1, b); g.l(62, 38, 62, 44, .6, e); g.p([59, 44, 64, 44, 64, 50, 59, 50], e); K.flame(g, 61.5, 48, 1.6, d, '#fff');
    for (const [x, y] of [[10, 60], [30, 61], [50, 60]]) g.e(x, y, 8, 2, f);
    g.c(32, 8, 4, c); K.eyes(g, 30, 34, 8, 1.3, 3, { glow: true, sc: d });
    for (const [x, y] of [[14, 20], [52, 24]]) K.flame(g, x, y, 2.2, d, '#ffffff');
  } });
SP('addersnip', 'Addersnip', ['Poison'], 290, 'fast', { evo: [28, 'viperion'], opener: 'poisonsting', extra: [[1, 'bite']],
  pal: { a: '#b8a070', b: '#2a2420', c: '#e8d8b0', d: '#e06040' },
  dex: 'It basks on sunny heath paths. The zigzag on its back is a warning, so walkers wisely step around it.',
  draw(g) { const { a, b, c, d } = g.P;
    g.c(38, 50, 11, a); g.c(38, 50, 6, dk(a, .1), { ring: false });
    K.tail(g, [48, 54, 56, 56, 60, 52], 3, 1, a);
    for (let k = 0; k < 10; k++) { const [x, y] = K.pt(38, 50, k * 36, 8.5); g.dot(x, y, 1, b); }
    K.tail(g, [30, 46, 24, 38, 22, 30], 5, 4.5, a); for (const [x, y] of [[26, 42], [23, 35]]) g.p([x - 2, y, x, y - 2, x + 2, y, x, y + 2], b, { ring: false });
    g.e(20, 25, 8, 6, a); g.e(16, 28, 5, 2.5, c, { ring: false }); g.p([16, 20, 22, 18, 24, 22], b, { ring: false });
    g.face(() => { g.l(11, 28, 8, 30, .4, d, { ring: false, shade: false }); g.l(8, 30, 6, 29, .4, d, { ring: false, shade: false }); g.l(8, 30, 6, 31.5, .4, d, { ring: false, shade: false }); });
    K.eye1(g, 18, 24, 2.3, 1); g.blush(21, 28, 1.2);
  } });
SP('viperion', 'Viperion', ['Poison', 'Dark'], 480, 'sweep', { extra: [[38, 'poisonjab'], [44, 'crunch']], opener: 'poisonsting',
  pal: { a: '#9a8250', b: '#1e1a18', c: '#e0d0a8', d: '#c83020', e: '#a6e040' },
  dex: 'The great adder of the heath. Its horned brow and zigzag markings warn of the venom within. It strikes faster than the eye can follow.',
  draw(g) { const { a, b, c, d, e } = g.P;
    g.c(40, 50, 15, a); g.c(40, 50, 9, dk(a, .12), { ring: false }); K.tail(g, [55, 54, 60, 58, 63, 54], 3, 1, a);
    for (let k = 0; k < 12; k++) { const [x, y] = K.pt(40, 50, k * 30, 12); g.p([x - 2.2, y, x, y - 2.2, x + 2.2, y, x, y + 2.2], b, { ring: false }); }
    K.tail(g, [30, 46, 22, 36, 22, 26], 7, 6.5, a); for (const [x, y] of [[26, 41], [22, 33]]) g.p([x - 2.5, y, x, y - 2.5, x + 2.5, y, x, y + 2.5], b, { ring: false });
    g.e(24, 36, 3, 6, c, { ring: false });
    g.e(20, 20, 11, 8, a); g.p([4, 22, 12, 16, 14, 26], a); g.e(14, 24, 7, 3, c, { ring: false });
    K.horn(g, 18, 13, -30, 7, 2, dk(a, .25), -20); K.horn(g, 25, 13, 20, 6, 2, dk(a, .25), 20);
    g.p([14, 14, 26, 14, 22, 18, 18, 18], b, { ring: false });
    g.face(() => { g.p([8, 25, 10, 25, 9, 28.5], '#fff', { ring: false }); g.p([13, 25, 15, 25, 14, 28.5], '#fff', { ring: false }); g.dot(9, 29, .7, e); g.l(4, 24, 0, 22, .4, d, { ring: false, shade: false }); });
    K.eye1(g, 17, 18, 2.2, 3, { sc: '#f0d050', pupil: b, brow: a });
  } });
SP('foalet', 'Foalet', ['Normal'], 300, 'fast', { evo: [32, 'shiremane'], opener: 'tackle',
  pal: { a: '#8a6040', b: '#f0e0c8', c: '#3a2618', d: '#e8d0b0', e: '#ffb0a0' },
  dex: 'A little pony foal with a big wild fringe. Children on the moor adore it and it adores their apples.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [46, 38, 50, 44, 50, 52], 2.4, 1.6, c);
    g.l(42, 44, 43, 60, 2.2, dk(a, .15)); g.l(28, 44, 27, 60, 2.2, dk(a, .15));
    g.e(36, 40, 12, 8, a); g.e(34, 44, 6, 3, lt(a, .2), { ring: false });
    g.l(45, 44, 46, 61, 2.4, a); g.l(31, 44, 30, 61, 2.4, a); for (const x of [30, 46]) g.e(x, 61.5, 2.6, 1.2, c);
    g.l(28, 38, 22, 26, 4.5, a); for (let i = 0; i < 4; i++) K.ear(g, 25 - i * 1.8, 34 - i * 3.5, 60, 5, 2, c);
    K.ear(g, 20, 17, -15, 7, 2.2, a, e); K.ear(g, 25, 17, 15, 7, 2.2, a, e);
    g.e(19, 23, 7, 6, a); g.e(12, 28, 5, 4, d); g.face(() => { g.dot(9, 27.5, .9, c); });
    for (let i = 0; i < 5; i++) K.ear(g, 15 + i * 2.5, 18, 180 + (i - 2) * 15, 6, 1.6, c);
    K.eye1(g, 18, 22, 2.5, 1); void b;
  } });
SP('shiremane', 'Shiremane', ['Normal'], 485, 'phys', { extra: [[40, 'doubleedge'], [46, 'earthquake']], opener: 'tackle',
  pal: { a: '#4a3020', b: '#f4ece0', c: '#1e140c', d: '#e0c050', e: '#8a2a2a' },
  dex: 'The gentle giant of the farms. It once pulled ploughs across all of Brackenshire. Its feathered hooves shake the ground.',
  draw(g) { const { a, b, c, d, e } = g.P;
    K.tail(g, [54, 30, 58, 40, 57, 52], 3, 2, c);
    g.l(48, 44, 50, 57, 3.4, dk(a, .15)); g.l(28, 44, 26, 57, 3.4, dk(a, .15)); for (const x of [26, 50]) { g.e(x, 59, 4.5, 3, b); }
    g.e(40, 36, 16, 11, a); g.p([30, 30, 50, 30, 50, 34, 30, 34], e, { ring: false }); K.spots(g, [[34, 32, 1.4], [40, 32, 1.4], [46, 32, 1.4]], d);
    g.l(51, 44, 52, 57, 3.6, a); g.l(31, 44, 30, 57, 3.6, a); for (const x of [30, 52]) { g.e(x, 59, 5, 3.2, b); g.e(x, 62, 4, 1.2, c); }
    g.l(28, 30, 20, 16, 6, a); for (let i = 0; i < 6; i++) K.ear(g, 27 - i * 1.6, 30 - i * 3, 55, 7, 2.5, c);
    K.ear(g, 18, 6, -15, 7, 2.2, a); K.ear(g, 23, 6, 15, 7, 2.2, a);
    g.e(16, 13, 7, 7, a); g.e(9, 20, 6, 5, a); g.p([12, 8, 18, 6, 20, 22, 14, 24], b, { ring: false }); g.face(() => { g.dot(5, 21, 1, c); });
    for (let i = 0; i < 4; i++) K.ear(g, 14 + i * 2.5, 7, 180 + (i - 1.5) * 18, 6, 1.6, c);
    K.eye1(g, 16, 12, 2.2, 2, { brow: a });
  } });
SP('rimehorn', 'Rimehorn', ['Ice', 'Fairy'], 580, 'spec', { legend: 1, opener: 'powdersnow', extra: [[40, 'icebeam'], [45, 'moonlight'], [50, 'blizzard'], [55, 'moonblast']],
  pal: { a: '#f4faff', b: '#d0e8f8', c: '#7ab8e8', d: '#c8f0ff', e: '#b8a8f0', f: '#ffffff' },
  dex: 'The frost unicorn of the northern peaks, carved on old coats of arms. Snow begins to fall wherever it gallops.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    for (let i = 0; i < 4; i++) K.tail(g, [50, 34, 56 + i * 2, 42 + i * 3, 54 - i, 54 + i * 2], 1.8, .8, i % 2 ? d : e);
    g.l(46, 42, 50, 58, 2.4, b); g.l(28, 42, 22, 56, 2.4, b);
    g.e(38, 36, 14, 8, a); g.e(36, 40, 8, 3, b, { ring: false });
    g.l(48, 42, 54, 58, 2.6, a); g.l(30, 42, 26, 58, 2.6, a); for (const x of [22, 26, 50, 54]) K.crystal(g, x, 60, 1.8, 4, 180, c);
    g.l(28, 32, 20, 20, 5, a);
    for (let i = 0; i < 6; i++) K.crystal(g, 27 - i * 1.4, 30 - i * 2.6, 1.6, 7, 60 + i * 5, i % 2 ? d : e);
    K.ear(g, 18, 10, -10, 6, 2, a); K.ear(g, 22, 10, 18, 6, 2, a);
    g.e(17, 16, 6.5, 6, a); g.e(10, 21, 5, 4, a); g.face(() => g.dot(6.5, 21, .9, c));
    K.horn(g, 16, 10, -30, 14, 1.8, d, -5); for (let i = 1; i < 4; i++) { const [x, y] = K.pt(16, 10, -32, i * 3.5); g.l(x - 1.2, y, x + 1.2, y - .5, .4, c, { ring: false, shade: false }); }
    K.eye1(g, 15, 15, 2.2, 3, { brow: a, sc: '#ffffff', pupil: '#5070c0' }); void f;
  } });
SP('stormane', 'Stormane', ['Electric', 'Fighting'], 580, 'phys', { legend: 1, opener: 'thundershock', extra: [[40, 'wildcharge'], [45, 'bulkup'], [50, 'closecombat'], [55, 'thunder']],
  pal: { a: '#e8b830', b: '#fff0a0', c: '#5a5a78', d: '#8a8aa8', e: '#fff8d0', f: '#2a2a3a' },
  dex: 'The storm lion of the old banners. Its mane is a living thundercloud, and its roar is the thunderclap that follows the lightning.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    K.tail(g, [50, 40, 56, 34, 58, 24], 2.2, 1.6, a); g.c(58, 22, 3.5, c); g.p([56, 16, 60, 20, 58, 20, 62, 26, 56, 21, 58, 21], b, { oc: '#8a6a10' });
    g.l(46, 46, 48, 60, 3.4, dk(a, .15)); g.l(28, 46, 24, 60, 3.4, dk(a, .15));
    g.e(40, 40, 15, 9, a); g.e(38, 44, 9, 4, lt(a, .25), { ring: false });
    g.l(49, 46, 50, 61, 3.6, a); g.l(31, 46, 30, 61, 3.6, a); for (const x of [24, 30, 48, 50]) g.e(x, 61.5, 3.2, 1.3, lt(a, .3));
    for (const [x, y, r] of [[20, 28, 14], [10, 22, 7], [30, 18, 8], [12, 36, 7], [28, 38, 7], [20, 14, 7], [32, 28, 6]]) g.c(x, y, r, c);
    for (const [x, y, r] of [[16, 20, 4], [26, 16, 4], [10, 30, 3.5]]) g.c(x, y, r, d, { ring: false });
    for (const [x, y] of [[6, 14], [34, 10], [4, 40], [36, 36]]) g.p([x, y, x + 3, y + 4, x + 1.5, y + 4.5, x + 4, y + 9, x - .5, y + 4, x + 1.5, y + 3.5], b, { oc: '#8a6a10' });
    g.c(18, 28, 9, a); g.e(12, 32, 5.5, 4, lt(a, .35)); g.face(() => { g.dot(8, 30.5, 1.5, f); g.mouth(8, 35, 13, 35.5, f); });
    K.eye1(g, 16, 26, 2.4, 3, { brow: a, sc: e, pupil: '#304080' });
  } });
SP('brandtusk', 'Brandtusk', ['Fire', 'Ground'], 580, 'phys', { legend: 1, opener: 'ember', extra: [[40, 'flamethrower'], [45, 'bulkup'], [50, 'earthquake'], [55, 'flareblitz']],
  pal: { a: '#5a2a1a', b: '#8a4a2a', c: '#ff6a20', d: '#ffd040', e: '#f8f0d8', f: '#2a1410' },
  dex: 'The great boar of the old tales, hunted by kings and never caught. Its bristles are living flame and its tusks glow like embers.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.l(48, 46, 50, 60, 4, dk(a, .2)); g.l(24, 46, 22, 60, 4, dk(a, .2)); K.tail(g, [54, 36, 58, 40, 57, 44], 1.2, 1, a);
    g.e(38, 38, 18, 13, a); g.e(36, 44, 12, 5, b, { ring: false });
    for (let i = 0; i < 7; i++) K.flame(g, 22 + i * 5, 25 + Math.abs(i - 2) * 1.2, 4, c, d, (i - 3) * 8);
    g.l(50, 48, 52, 61, 4.4, a); g.l(28, 48, 26, 61, 4.4, a); for (const x of [26, 52]) g.e(x, 62, 3.4, 1.4, f);
    g.e(16, 38, 11, 10, a); g.e(8, 42, 5.5, 5, b); g.face(() => { g.e(5, 42, 1.2, 1.8, f, { ring: false }); g.e(9, 42.5, 1.2, 1.8, f, { ring: false }); });
    K.horn(g, 11, 46, -20, 10, 2, e, -35); K.horn(g, 17, 47, 10, 9, 1.8, e, 35); g.dot(4, 37, .9, d);
    K.ear(g, 18, 29, -30, 7, 3, a, c); K.ear(g, 25, 29, 20, 7, 3, a, c);
    K.eye1(g, 15, 34, 2.3, 3, { brow: a, sc: d, pupil: f });
    for (const x of [22, 26, 50, 54]) K.flame(g, x, 59, 2, c, d, 180);
  } });
SP('albionne', 'Albionne', ['Psychic', 'Fairy'], 600, 'bal', { legend: 1, opener: 'confusion', extra: [[40, 'moonblast'], [45, 'psychic'], [50, 'calmmind'], [55, 'psystrike']],
  pal: { a: '#fafaf6', b: '#e4e0dc', c: '#9ae0f0', d: '#f0c0e0', e: '#6a8ab0', f: '#fff4c8' },
  dex: 'The spirit of the land itself: a hare that sits on the ancient hills and gazes at the full moon. Where it runs, the ley lines glow.',
  draw(g) { const { a, b, c, d, e, f } = g.P;
    g.c(46, 12, 9, f); g.c(46, 12, 7, lt(f, .5), { ring: false });
    K.tail(g, [16, 58, 28, 54, 40, 58, 52, 54], .6, .6, c); K.tail(g, [12, 50, 22, 44], .6, .6, d);
    g.e(40, 50, 13, 10, a); g.e(46, 56, 9, 4, b); g.c(52, 44, 4, a);
    g.e(32, 48, 9, 12, a); g.e(30, 52, 5, 7, b, { ring: false }); g.l(28, 54, 27, 61, 2, a); g.l(33, 55, 33, 61, 2, a);
    for (const [x1, y1, x2, y2] of [[34, 40, 44, 46], [44, 46, 48, 54], [30, 44, 30, 56]]) g.l(x1, y1, x2, y2, .5, c, { ring: false, shade: false });
    K.earL(g, 22, 22, -10, 20, 3.5, a, d); K.earL(g, 28, 22, 18, 20, 3.5, a, d);
    g.e(25, 30, 8, 7.5, a); g.e(19, 34, 4, 3, b); g.face(() => g.dot(16, 33, 1, e));
    K.eye1(g, 24, 28, 2.4, 3, { glow: true, sc: c });
    for (const [x, y] of [[8, 20], [58, 30], [12, 8]]) { g.l(x - 2, y, x + 2, y, .5, c, { ring: false, shade: false }); g.l(x, y - 2, x, y + 2, .5, c, { ring: false, shade: false }); }
  } });