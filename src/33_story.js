// ---- story ----
// ================= STORY =================
const STARTERS = [['cindle', 'Fire'], ['splotter', 'Water'], ['sproutle', 'Grass']];
const COUNTER = { cindle: 'splotter', splotter: 'sproutle', sproutle: 'cindle' };
const npc = id => G.npcs.find(n => n.id === id);
function faceEach(a, b) { const dx = b.x - a.x, dy = b.y - a.y; a.dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); b.dir = OPP[a.dir]; }
async function walk(e, path, dur = 250) { for (const d of path) await e.moveTo(d, dur); }
function greet() { return { morning: 'Morning, love!', day: 'Afternoon, love!', evening: 'Evening, love!', night: 'Up late again, love?' }[timeOfDay()]; }
const aan = s => /^[AEIOU]/i.test(s) ? 'an ' : 'a ';
async function give(item, n = 1) { G.bag[item] = (G.bag[item] || 0) + n; sfx('item'); await msg(`${G.name} received ${n > 1 ? n + ' ' : aan(ITEMS[item].n)}${ITEMS[item].n}${n > 1 ? 's' : ''}!`); }
class Preview { // shows a creature above the text box
  constructor(sp) { this.sp = sp; } update() { } draw() { frame(88, 32, 80, 80, ['#30384a', '#f0f4e8', '#9ab8d0']); blit(creatureSprite(this.sp, 64), 96, 40); }
}
async function showWhile(ui, fn) { UI.push(ui); try { return await fn(); } finally { UI.splice(UI.indexOf(ui), 1); } }

const S = {
  say: l => say(l),
  async tom() {
    if (!G.party.length) await say(["Afternoon, young'un.", "You'll be wanting the Prof, I expect. His lab's the big building down by the mere."]);
    else if (!G.flags.badge1) await say(['Got yourself a Beastie, eh? Grand!', "Bracken Lane leads up to Millbrook. Mind the tall grass, and don't let 'em bite."]);
    else await say(["A badge already? You'll be the talk of the Red Lion tonight."]);
  },
  async leaveTown() {
    if (G.party.length) return;
    const t = npc('tom'); t.dir = 'left'; t.alert = NOW; sfx('alert'); await wait(500);
    await say(['Hold on there!', "Bracken Lane's full of wild Beasties. You can't go wandering into the tall grass without one of your own!", 'Go and see Professor Hawthorn first. His lab is down by the mere.']);
    await G.pl.moveTo('down', 230); G.pl.dir = 'down';
  },
  async mum() {
    if (!G.flags.metMum) {
      G.flags.metMum = 1;
      await say([greet(), 'Professor Hawthorn popped round earlier looking for you.', "He wants you at his lab. Something about a very special job! It's the big building down by the mere.", "Go on then, don't keep him waiting."]);
    } else if (G.party.length && !G.flags.mumTonics) {
      G.flags.mumTonics = 1;
      await say([`Oh my! Is that your very own ${monName(G.party[0])}? Aren't you a sweetheart!`, "You'll be off on an adventure now, I suppose. Here, take these, just in case."]);
      await give('tonic', 5);
      await say(['Come home whenever you need a rest. And ring me! Well... you know what I mean.']);
    } else if (G.party.length) {
      await say(['You look tired, love. Have a sit down.']);
      await fadeOut(250); healAll(); sfx('heal'); await wait(900); await fadeIn(250);
      G.lastHeal = { map: 'home', x: 6, y: 5 };
      await say(["There. Your Beasties are right as rain. Now off you go, and mind you're careful!"]);
      autosave();
    } else await say(["The Prof's lab is the big building down by the mere, love."]);
  },
  async nan() {
    if (!G.flags.nanGift && G.party.length) {
      G.flags.nanGift = 1;
      await say(['Ooh, a trainer now, are we? Just like your grandad.', "Here, a Revival Herb from my garden. If one of your Beasties faints, this'll perk it right up."]);
      await give('revive');
    }
    if (G.flags.stones) await say(['So the stones on the moor really did glow...', 'My gran always said they were keeping something asleep. The Sleeper, she called it.', "I thought it was just a story to keep us kids off the moor at night. Maybe it wasn't."]);
    else await say(['When I was a girl, my gran told me the stones on Stonebarrow keep something asleep underneath.', '"The Sleeper," she called it. Old stories, love. Old stories.']);
  },
  async prof() {
    if (!G.flags.profAsked) {
      G.flags.profAsked = 1;
      await say([`Ah, ${G.name}! Right on time. Well, nearly.`, "I've three young Beasties here in need of a good home and a keen trainer.", "They're resting in those Ley Orbs on the table. Have a look, and choose the one you like best!"]);
    } else if (!G.flags.starter) await say(['Go on, have a look at the three on the table. Take your time!']);
    else if (!G.flags.stones) await say(['Your Field Journal records every Beastie you meet. Try to fill it up!', "And do keep an eye on those standing stones up on the moor, won't you? North of Millbrook."]);
    else if (!G.flags.badge1) await say(["The stones glowed? And the ground shook?! Remarkable. Absolutely remarkable.", "And Team Blight trying to drain the ley lines... I'll need to write to my colleagues in Kingsbridge at once."]);
    else await S.profLater();
  },
  async labTable(x) {
    const i = x - 5;
    if (i < 0 || i > 2) { await say('A tidy lab table covered in notes about ley lines.'); return; }
    const [sp, type] = STARTERS[i];
    if (G.flags.starter === sp || G.flags.rivalOrb === sp) { await say('Nothing left here but a warm spot on the table.'); return; }
    if (G.flags.starter) { await say("That's one of the Professor's. Best leave it be."); return; }
    if (!G.flags.profAsked) { await say('Three Ley Orbs sit on the table. Better talk to the Professor first.'); return; }
    const ok = await showWhile(new Preview(sp), async () => { sfx('select'); return await ask(`The ${type}-type Beastie, ${SPECIES[sp].n}! Will you take this one?`); });
    if (!ok) return;
    G.flags.starter = sp;
    const m = newMon(sp, 5, { shiny: false }); G.party.push(m); G.seen[sp] = 1; G.caught[sp] = 1;
    sfx('catch'); await msg(`${G.name} received ${SPECIES[sp].n}!`);
    await S.rival1();
  },
  async rival1() {
    const cs = COUNTER[G.flags.starter];
    G.flags.rivalInLab = 1; spawnNPCs();
    const r = npc('rival'); const prof = npc('prof');
    await say('Hold it!');
    await walk(r, ['up', 'up', 'up']);
    const tx = 5 + STARTERS.findIndex(s => s[0] === cs);
    const pl = G.pl;
    // step aside to the correct orb
    while (r.x !== tx) { const d = r.x < tx ? 'right' : 'left'; if (blocked(r.x + DIRV[d][0], r.y, r)) break; await r.moveTo(d, 250); }
    await walk(r, ['up']); r.dir = 'up';
    await say(['So YOU\'RE the village kid the Professor keeps banging on about.', "The name's Crispin. Crispin Ashworth-Vane. My family practically owns half of Kingsbridge.", 'Grandfather says a proper trainer needs a proper Beastie. So I\'ll be taking THIS one.']);
    G.flags.rivalOrb = cs; sfx('item');
    await msg(`Crispin received ${SPECIES[cs].n}!`);
    prof.dir = 'down'; await say(['Crispin! That one was meant for... oh, never mind.']);
    faceEach(r, pl);
    await say(["Right then, village kid. Let's see if you're worth the Professor's time.", 'Battle me!']);
    const res = await battle({ trainer: { name: 'Crispin', look: 'rival', party: [[cs, 5]], money: 300, lose: "Tch. Beginner's luck, obviously." } });
    if (res === 'lose') await say(["Ha! As expected. Don't feel too bad, village kid. Not everyone can be an Ashworth-Vane."]);
    else await say(['Hmph. My Beastie was clearly still waking up.']);
    healAll();
    await say(["I'm off to Millbrook to win my first badge. Try to keep up. Or don't. I really couldn't care less."]);
    r.dir = 'down';
    const path = []; for (let y = r.y; y < 9; y++) path.push('down');
    try { await walk(r, path, 200); } catch (e) { }
    sfx('door'); G.flags.rivalInLab = 0; G.npcs.splice(G.npcs.indexOf(r), 1);
    prof.dir = 'down';
    await say(['Well! That was... spirited.', `Here, ${G.name}, take this. It's a Field Journal.`]);
    G.flags.journal = 1; sfx('item'); await msg(`${G.name} received the Field Journal!`);
    await say(['It records every Beastie you meet. Seeing one fills in its page; catching one tells you all about it.', 'And take these Ley Orbs. Weaken a wild Beastie in battle first, then throw one!']);
    await give('leyorb', 5);
    await say(['Oh, and one more thing.', "The old standing stones up on Stonebarrow Moor have started humming. Especially at night.", "If you pass that way, keep your eyes open. The moor's north of Millbrook, up Bracken Lane.", "Now go on! Your mum will want to meet your new friend. Press Enter any time to open your menu."]);
    healAll(); autosave();
  },
  async gymLocked() {
    await say(["The door's locked. There's a note pinned to it:", '"Gone up Stonebarrow Moor to see what all the humming is about. Back soon! - Hazel"']);
  },
  async millVillager() {
    if (!G.flags.stones) await say(["If you're after a gym battle, you're out of luck. Leader Hazel went up Stonebarrow Moor this morning.", 'Folk in grey coats were seen heading that way too. Team Blight, they call themselves.', "The moor's straight up the road, north of town."]);
    else if (!G.flags.badge1) await say(["Hazel's back! She's been telling everyone how you chased Team Blight off the moor.", 'Go on, the gym is open now!']);
    else if (!G.flags.rival2) await say(["The Kingsbridge road's still shut for repairs. They say it'll open soon."]);
    else await say(["The Kingsbridge road's open again! Straight out the east side of town, over the bridge."]);
  },
  async miller() {
    if (!G.flags.millerGift) { G.flags.millerGift = 1; await say(["The wheel's been turning backwards some nights. Never seen owt like it in forty years.", 'Something odd is going on up on that moor. Here, take this for your travels.']); await give('supertonic'); }
    else await say(["Grinding flour since I were a lad. Best bread in Brackenshire, this."]);
  },
  async nurse() {
    if (await ask(`Welcome to the ${G.map.name}! Shall I restore your Beasties to full health?`)) {
      await say("Right you are! Just a moment...");
      await fadeOut(200); healAll(); sfx('heal'); await wait(1100); await fadeIn(200);
      G.lastHeal = { map: G.map.id, x: 2, y: 4 };
      await say(['All done! Your Beasties are fighting fit.', 'We hope to see you again!']);
      autosave();
    } else await say('We hope to see you again!');
  },
  async shop() {
    await say('Welcome! What can I get you?');
    const f = G.flags, league = G.map.id === 'lobby', stock = ['leyorb', 'tonic', 'salve'];
    if (f.stones) stock.push('supertonic'); if (f.badge1) stock.push('greatorb', 'revive'); if (f.badge2) stock.push('spray'); if (f.badge3) stock.push('ether');
    if (f.badge4) stock.push('hypertonic'); if (f.badge5) stock.push('royalorb'); if (f.badge6 || league) stock.push('maxtonic');
    stock.sort((a, b) => ITEM_ORDER.indexOf(a) - ITEM_ORDER.indexOf(b));
    await push(new ShopScreen(stock));
    await say('Cheers! Come again.');
  },
  async storage() { sfx('select'); await say(`${G.name} switched on the storage machine.`); await push(new StorageScreen()); },
  async stonesScene() {
    if (G.flags.stones) return;
    const pl = G.pl;
    const mor = npc('morwen'), h = npc('hazelm'), g3 = npc('grunt3'), g4 = npc('grunt4');
    if (!mor) return;
    playMusic('moor');
    // line up in front of the circle
    while (pl.x !== 12) await pl.moveTo(pl.x < 12 ? 'right' : 'left', 230);
    await pl.moveTo('up', 230); pl.dir = 'up';
    if (G.fol && !G.fol.hidden) { G.fol.x = 12; G.fol.y = 9; G.fol.dir = 'up'; }
    await say(['HAZEL: Stop it, all of you! You\'ll wake it!']);
    await say(["???: Wake it? Oh, Hazel. That's rather the point.", "???: The ley lines run through these stones like veins through a leaf. Drain them, and the Sleeper stirs.", '???: And when it wakes, it will answer to Team Blight.']);
    g3.dir = 'down'; g3.alert = NOW; sfx('alert'); await wait(600);
    await say(['GRUNT: Admin Morwen! There\'s a kid!']);
    mor.dir = 'down';
    await say(['MORWEN: A child. How tiresome.']);
    await h.moveTo('right', 250); h.dir = 'left';
    await walk(mor, ['down', 'down', 'down'], 260);
    await say(['MORWEN: I am Morwen, Admin of Team Blight.', 'MORWEN: Run along home, little one. Or my Beasties will make you run.']);
    const res = await battle({ trainer: { name: 'Admin Morwen', look: 'admin', boss: true, party: [['grimrat', 11], ['mushlet', 12]], money: 800, lose: "MORWEN: Hmph. You're stronger than you look." } });
    if (res === 'lose') { await blackout(); return; }
    // the Sleeper stirs
    sfx('rumble'); playMusic(null);
    for (let i = 0; i < 20; i++) { SHAKE = 3; await wait(60); }
    G.stoneGlow = true;
    await tween(300, t => G.stoneFlash = t * .6); await tween(700, t => G.stoneFlash = .6 * (1 - t)); G.stoneFlash = 0;
    await showWhile(new SleeperVision(), async () => { await wait(1600); await say(['The ground trembles...', 'Something vast turns over, deep beneath the moor.']); });
    await say(['A low hum rolls out from the stones... then silence.']);
    mor.dir = 'down';
    await say(['MORWEN: ...Did you feel that? It is closer to waking than we thought.', "MORWEN: This isn't over, child. Team Blight has big plans for Brackenshire.", 'MORWEN: Blight! We are leaving!']);
    await fadeOut(300);
    for (const e of [mor, g3, g4]) G.npcs.splice(G.npcs.indexOf(e), 1);
    G.flags.stones = 1;
    await fadeIn(300);
    playMusic('town');
    await walk(h, ['down', 'down'], 250); faceEach(h, pl);
    await say(["HAZEL: Thank you! Goodness, that was close.", "HAZEL: I'm Hazel, Leader of the Millbrook Gym. My Bug Beasties and I came up to see what the humming was about.", 'HAZEL: Those Blight lot were trying to drain the ley lines. Whatever sleeps under these stones... I don\'t think we want it woken.', "HAZEL: Come to my gym when you're ready. After today, I owe you a proper battle!"]);
    await fadeOut(250); G.npcs.splice(G.npcs.indexOf(h), 1); await fadeIn(250);
    playMusic('moor');
    autosave();
  },
  async hazel() {
    if (G.flags.badge1) { await say(['The road to Kingsbridge should open soon. That\'s where your adventure really takes off!', 'Do visit again. The bees have grown quite fond of you.']); return; }
    await say(["Welcome to the Honeycomb Gym! My Bug Beasties are as busy as they are brave.", "You saved the stones, so now let's see how you fare against the hive!"]);
    const res = await battle({ trainer: { name: 'Leader Hazel', look: 'hazel', boss: true, party: [['buzzlet', 12], ['wickmoth', 12], ['bumbellow', 14]], money: 1400, lose: "Well I never! You've a real knack for this." } });
    if (res === 'lose') { await blackout(); return; }
    await say('That was splendid! You and your Beasties work together beautifully. Please, take this.');
    sfx('badge'); G.flags.badge1 = 1;
    await showWhile(new BadgeShow(1), () => msg(`${G.name} received the Honeycomb Badge!`));
    await say("It shows you've beaten the Millbrook Gym. And have these too. You'll catch rarer Beasties with them.");
    await give('greatorb', 3);
    await say('Good luck out there. I have a feeling Team Blight will be back.');
    G.flags.rivalMill = 1; autosave();
  },
  async rival2() {
    if (!G.flags.badge1 || G.flags.rival2) return;
    G.lock++;
    try {
      const r = npc('rival'); if (!r) return;
      const cs = COUNTER[G.flags.starter];
      r.alert = NOW; sfx('alert'); await wait(600);
      G.pl.dir = 'down';
      await say(['There you are, village kid.', 'I beat Hazel ages ago, obviously. Three turns. Maybe four.', 'But people keep saying YOU chased Team Blight off the moor. Utter rubbish, surely.', "Let's settle this properly!"]);
      const res = await battle({ trainer: { name: 'Crispin', look: 'rival', party: [['pipwren', 12], ['woolt', 12], [cs, 14]], money: 900, lose: "What?! That's... that's not how this was supposed to go!" } });
      if (res === 'lose') { await blackout(); return; }
      await say(["Fine. FINE. You're... not completely useless.", "I'm heading to Kingsbridge the moment that road opens. Don't even think about following me."]);
      await walk(r, ['right', 'down', 'down', 'down'], 220);
      await fadeOut(200); G.npcs.splice(G.npcs.indexOf(r), 1); G.flags.rival2 = 1; G.flags.rivalMill = 0; await fadeIn(200);
      await S.chapterEnd(1);
    } finally { G.lock--; }
  },
  async chapterEnd(n) {
    if (G.flags['ch' + n + 'done']) return;
    G.flags['ch' + n + 'done'] = 1; autosave();
    playMusic('victory');
    await push(new ChapterCard(n));
    if (CHAPTER_HINT[n]) await say(CHAPTER_HINT[n]);
    playMusic(G.map.music);
  },
};
MAPS.millbrook.onEnter = () => S.rival2();
MAPS.millbrook.npcs.find(n => n.id === 'rival').talk = () => S.rival2();
MAPS.lab.decor = (cx, cy) => { STARTERS.forEach(([sp], i) => { if (G.flags.starter === sp || G.flags.rivalOrb === sp) return; blit(orbSprite(), (5 + i) * 16 + 2 - cx, 4 * 16 + 2 - cy); }); };
let SHAKE = 0;
class SleeperVision {
  update() { } draw() {
    R(0, 0, W, 144, 'rgba(10,20,30,.55)');
    const img = creatureSprite('leywyrm', 64, { sil: true }), rim = tinted(img, '#3aa894');
    ctx.save(); ctx.globalAlpha = .55 + Math.sin(NOW / 200) * .2;
    for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) ctx.drawImage(rim, (64 + dx) * P, (8 + dy) * P, 128 * P, 128 * P);
    ctx.globalAlpha = .95; ctx.drawImage(img, 64 * P, 8 * P, 128 * P, 128 * P); ctx.restore();
    if (Math.sin(NOW / 150) > -.6) { R(64 + 12 * 2 - 2, 8 + 22 * 2 - 2, 4, 3, '#7affe0'); R(64 + 19 * 2 - 2, 8 + 22 * 2 - 2, 4, 3, '#7affe0'); }
  }
}
class BadgeShow { constructor(n = 1) { this.n = n; } update() { } draw() { frame(96, 34, 64, 64, ['#2c3242', '#fff8e8', '#e0b040']); drawBadge(111, 49, 2, this.n); if (Math.floor(NOW / 200) % 3 === 0) { R(140, 50, 1, 5, '#fff'); R(138, 52, 5, 1, '#fff'); } } }
const CHAPTERS = [null, 'The Standing Stones', 'The Road to Kingsbridge', 'The Dark Lighthouse', 'Under Cragmoor', 'The Elder Oak', 'The Iron Castle', 'The Frozen Fells', 'The Sleeper Wakes', 'The Crown of Brackenshire'];
const CHAPTER_HINT = [null,
  ['The road east of Millbrook to Kingsbridge is open now.', 'Your journey continues!'],
  ['The Coast Road south of Kingsbridge leads to Saltmarsh Bay.'],
  ['They say the landslide on Cragmoor Pass, north of Kingsbridge, has been cleared.'],
  ['Fernwick Way runs east from Cragmoor to the woodland village of Fernwick.'],
  ['The Ironhold Road east of Fernwick should be open now.'],
  ['The Fellside Pass east of Ironhold climbs up into the snowy fells.'],
  ['The icy cliff road east of Highfell leads down to Ravenscar.'],
  ['Crowntor, north of Ravenscar, is open at last. The Brackenshire League awaits!']];
class ChapterCard {
  constructor(n = 1) { this.t = NOW; this.n = n; }
  update() { if (NOW - this.t > 1200 && (A() || Bk())) this.done(); }
  draw() {
    R(0, 0, W, H, '#141a2a');
    for (let i = 0; i < 40; i++) R((i * 61) % W, (i * 37) % H, 1, 1, i % 3 ? '#4a5a7a' : '#e8e0c8');
    txt(`CHAPTER ${this.n} COMPLETE`, 128, 30, '#f0e0b0', '#5a3a70', 12, 'center');
    txt(CHAPTERS[this.n], 128, 52, '#b8a8d8', null, 7, 'center');
    const nc = Object.keys(G.caught).length, nb = [1, 2, 3, 4, 5, 6, 7, 8].filter(i => G.flags['badge' + i]).length;
    const rows = [['Beasties caught', nc], ['Badges', nb], ['Money', '£' + G.money], ['Team', G.party.map(m => monName(m)).join(', ')]];
    rows.forEach(([a, b], i) => { txt(a, 24, 76 + i * 16, '#8a9ab8', null, 7); const t = String(b); txt(t, 232, 76 + i * 16, '#e8e0c8', null, tw(t, 7) > 150 ? 5.5 : 7, 'right'); });
    if (CHAPTERS[this.n + 1]) { txt('Next:', 128, 144, '#8a9ab8', null, 6, 'center'); txt(`Chapter ${this.n + 1}: ${CHAPTERS[this.n + 1]}`, 128, 156, '#f0c070', null, 7, 'center'); }
  }
}

// ================= MUSIC =================
const MUSIC = {
  title: { bpm: 90, ch: [{ n: 'D5 - - - A4 - D5 - | F#5 - - - E5 - D5 - | G5 - - - F#5 - E5 - | A5 - - - - - . . | B5 - - - A5 - F#5 - | G5 - - - F#5 - E5 - | D5 - E5 - F#5 - E5 - | D5 - - - - - . .', w: 'square', v: .7 }, { n: 'D3 - A3 - D3 - A3 - | B2 - F#3 - B2 - F#3 - | G2 - D3 - G2 - D3 - | A2 - E3 - A2 - E3 - | G2 - D3 - G2 - D3 - | E3 - B3 - E3 - B3 - | A2 - E3 - A2 - E3 - | D3 - A3 - D3 - . -', w: 'triangle', v: 1.5 }] },
  town: { bpm: 100, ch: [{ n: 'E5 - G5 - C6 - B5 A5 | G5 - - - E5 - F5 G5 | A5 - G5 - F5 - E5 D5 | E5 - - - - - . . | E5 - G5 - C6 - B5 A5 | G5 - - - E5 - D5 C5 | D5 - E5 - F5 - D5 B4 | C5 - - - - - . .', w: 'square', v: .6 }, { n: 'C3 - G3 - C3 - G3 - | E3 - G3 - E3 - G3 - | F3 - A3 - F3 - A3 - | C3 - G3 - C3 - G3 - | C3 - G3 - C3 - G3 - | E3 - G3 - E3 - G3 - | G3 - B3 - G3 - B3 - | C3 - G3 - C3 - . -', w: 'triangle', v: 1.5 }] },
  route: { bpm: 138, ch: [{ n: 'D5 - G5 - B5 - A5 G5 | A5 - - - F#5 - D5 - | E5 - G5 - C6 - B5 A5 | B5 - - - G5 - - - | D5 - G5 - B5 - A5 G5 | A5 - - - B5 - C6 - | D6 - C6 - B5 - A5 - | G5 - - - - - . .', w: 'square', v: .6 }, { n: 'G2 - D3 - G2 - D3 - | D3 - A3 - D3 - A3 - | C3 - G3 - C3 - G3 - | G2 - D3 - G2 - D3 - | G2 - D3 - G2 - D3 - | D3 - A3 - D3 - A3 - | C3 - D3 - C3 - D3 - | G2 - D3 - G2 - . -', w: 'triangle', v: 1.5 }] },
  night: { bpm: 88, ch: [{ n: 'A4 - C5 - E5 - - - | D5 - C5 - B4 - - - | C5 - E5 - A5 - G5 - | E5 - - - - - . . | F5 - E5 - D5 - C5 - | B4 - C5 - D5 - - - | C5 - B4 - A4 - G#4 - | A4 - - - - - . .', w: 'triangle', v: 1.3 }, { n: 'A2 - - - E3 - - - | G2 - - - D3 - - - | F2 - - - C3 - - - | A2 - - - E3 - - - | D3 - - - A3 - - - | G2 - - - D3 - - - | E3 - - - E3 - - - | A2 - - - . - - -', w: 'triangle', v: 1.4 }] },
  moor: { bpm: 96, ch: [{ n: 'D5 - - - F5 - E5 - | D5 - C5 - A4 - - - | C5 - D5 - E5 - G5 - | F5 - E5 - D5 - - - | A5 - - - G5 - F5 - | E5 - D5 - C5 - - - | D5 - E5 - F5 - E5 - | D5 - - - - - . .', w: 'square', v: .5 }, { n: 'D3 - A3 - D3 - A3 - | C3 - G3 - C3 - G3 - | Bb2 - F3 - Bb2 - F3 - | A2 - E3 - A2 - E3 - | D3 - A3 - D3 - A3 - | C3 - G3 - C3 - G3 - | G2 - D3 - G2 - D3 - | D3 - A3 - D3 - . -', w: 'triangle', v: 1.5 }] },
  battle: { bpm: 168, ch: [{ n: 'A5 - E5 - A5 - C6 - | B5 - A5 - G5 - E5 - | F5 - G5 - A5 - C6 - | B5 - - - G#5 - - - | A5 - E5 - A5 - C6 - | D6 - C6 - B5 - A5 - | G5 - F5 - E5 - D5 - | E5 - - - E5 - - -', w: 'square', v: .55 }, { n: 'A2 A3 A2 A3 A2 A3 A2 A3 | G2 G3 G2 G3 G2 G3 G2 G3 | F2 F3 F2 F3 F2 F3 F2 F3 | E2 E3 E2 E3 E2 E3 E2 E3 | A2 A3 A2 A3 A2 A3 A2 A3 | D3 D4 D3 D4 D3 D4 D3 D4 | G2 G3 G2 G3 C3 C4 C3 C4 | E2 E3 E2 E3 E2 E3 G#2 G#3', w: 'triangle', v: 1.5 }] },
  trainer: { bpm: 172, ch: [{ n: 'E5 E5 . E5 D5 E5 G5 - | A5 - G5 - E5 - D5 - | C5 - D5 - E5 - G5 - | A5 - - - A5 - - - | E5 E5 . E5 D5 E5 G5 - | A5 - C6 - B5 - G5 - | A5 - G5 - E5 - D5 - | E5 - - - . - - -', w: 'square', v: .55 }, { n: 'A2 A3 A2 A3 A2 A3 A2 A3 | G2 G3 G2 G3 G2 G3 G2 G3 | F2 F3 F2 F3 F2 F3 F2 F3 | E2 E3 E2 E3 E2 E3 E2 E3 | A2 A3 A2 A3 A2 A3 A2 A3 | D3 D4 D3 D4 D3 D4 D3 D4 | G2 G3 G2 G3 C3 C4 C3 C4 | E2 E3 E2 E3 E2 E3 G#2 G#3', w: 'triangle', v: 1.5 }] },
  boss: { bpm: 176, ch: [{ n: 'D5 - F5 - A5 - D6 - | C6 - A5 - F5 - A5 - | Bb5 - A5 - G5 - F5 - | E5 - F5 - G5 - A5 - | D5 - F5 - A5 - D6 - | E6 - D6 - C6 - A5 - | Bb5 - A5 - G5 - E5 - | D5 - - - D5 - - -', w: 'square', v: .55 }, { n: 'D3 D4 D3 D4 D3 D4 D3 D4 | F2 F3 F2 F3 F2 F3 F2 F3 | Bb2 Bb3 Bb2 Bb3 Bb2 Bb3 Bb2 Bb3 | A2 A3 A2 A3 A2 A3 A2 A3 | D3 D4 D3 D4 D3 D4 D3 D4 | C3 C4 C3 C4 C3 C4 C3 C4 | G2 G3 G2 G3 A2 A3 A2 A3 | D3 D4 D3 D4 A2 A3 A2 A3', w: 'triangle', v: 1.5 }] },
  gym: { bpm: 120, ch: [{ n: 'F5 - F5 A5 C6 - A5 - | Bb5 - A5 - G5 - - - | E5 - G5 - Bb5 - A5 G5 | F5 - - - C5 - - - | F5 - F5 A5 C6 - A5 - | D6 - C6 - Bb5 - A5 - | G5 - A5 - Bb5 - E5 - | F5 - - - . - - -', w: 'square', v: .55 }, { n: 'F3 - C3 - F3 - C3 - | Bb2 - F3 - Bb2 - F3 - | C3 - G3 - C3 - G3 - | F3 - C3 - F3 - C3 - | F3 - C3 - F3 - C3 - | Bb2 - F3 - Bb2 - F3 - | C3 - G3 - C3 - G3 - | F3 - C3 - F3 - . -', w: 'triangle', v: 1.5 }] },
  wayhouse: { bpm: 92, ch: [{ n: 'C5 - E5 - G5 - E5 - | F5 - A5 - G5 - - - | E5 - D5 - C5 - D5 - | C5 - - - - - . .', w: 'triangle', v: 1.3 }, { n: 'C3 - G3 - C3 - G3 - | F3 - C4 - F3 - C4 - | G3 - D4 - G3 - B3 - | C3 - G3 - C3 - . -', w: 'triangle', v: 1.3 }] },
  victory: { bpm: 130, ch: [{ n: 'G5 - G5 - G5 - D6 - | C6 - B5 - A5 - B5 - | G5 - - - D5 - - - | G5 - - - . - - -', w: 'square', v: .55 }, { n: 'G3 - D3 - G3 - D3 - | C3 - G3 - D3 - A3 - | G3 - D3 - B2 - D3 - | G2 - - - . - - -', w: 'triangle', v: 1.5 }] },
  evolve: { bpm: 150, ch: [{ n: 'C5 D5 E5 G5 C6 G5 E5 D5 | C5 D5 E5 G5 C6 G5 E5 D5', w: 'triangle', v: 1.2 }, { n: 'C3 - - - G3 - - - | C3 - - - G3 - - -', w: 'triangle', v: 1.3 }] },
};