// ---- story2 ----
// ================= STORY: CHAPTERS 2-9 =================
const STARTER_LINE = { cindle: ['cindle', 'scorchvix', 'infernix'], splotter: ['splotter', 'rivotter', 'tidalord'], sproutle: ['sproutle', 'thistlehog', 'bramblord'] };
const rivalMon = st => STARTER_LINE[COUNTER[G.flags.starter] || 'splotter'][st];
function spawnActor(id, x, y, dir, look, extra = {}) { const e = new Ent({ id, x, y, dir, look, hx: x, hy: y, wt: 99999, ...extra }); G.npcs.push(e); return e; }
function removeActor(e) { const i = G.npcs.indexOf(e); if (i >= 0) G.npcs.splice(i, 1); }
function hideFollower() { if (G.fol) G.fol.hidden = true; }
function freeNear(x, y) { for (const [dx, dy, d] of [[0, 1, 'up'], [1, 0, 'left'], [-1, 0, 'right'], [0, -1, 'down']]) if (!blocked(x + dx, y + dy, {}) && tileAt(G.map, x + dx, y + dy) !== null) return [x + dx, y + dy, d]; return [x, y + 1, 'up']; }
async function stepTo(e, x, y, dur = 230) { while (e.x !== x) await e.moveTo(e.x < x ? 'right' : 'left', dur); while (e.y !== y) await e.moveTo(e.y < y ? 'down' : 'up', dur); }
async function bossBattle(name, look, party, money, lose, o = {}) { return battle({ trainer: { name, look, boss: true, party, money, lose, ...o } }); }
const badgeCount = () => [1, 2, 3, 4, 5, 6, 7, 8].filter(i => G.flags['badge' + i]).length;
const SETPIECE_TEXT = {
  oak: () => G.flags.glade ? ['The Elder Oak. Its leaves shimmer with a faint green light.', 'You can feel the ley line humming through its roots.'] : ['The Elder Oak. Its leaves are grey and drooping.', 'Strange wires have been wrapped around its trunk.'],
  beacon: () => ['An ancient signal beacon. Its coals are still warm.', 'Something here likes the heat.'],
};

const COACH = [
  { map: 'hollowmere', n: 'Hollowmere', x: 5, y: 7 }, { map: 'millbrook', n: 'Millbrook', x: 6, y: 7 }, { map: 'kingsbridge', n: 'Kingsbridge', x: 6, y: 6 },
  { map: 'saltmarsh', n: 'Saltmarsh Bay', x: 6, y: 5 }, { map: 'cragmoor', n: 'Cragmoor', x: 6, y: 6 }, { map: 'fernwick', n: 'Fernwick', x: 6, y: 6 },
  { map: 'ironhold', n: 'Ironhold', x: 6, y: 13 }, { map: 'highfell', n: 'Highfell', x: 6, y: 8 }, { map: 'ravenscar', n: 'Ravenscar', x: 6, y: 7 }, { map: 'summit', n: 'Crowntor Summit', x: 10, y: 7 },
];

const LEADERS = {
  2: { name: 'Leader Ada', look: 'ada', badge: 'Spark', money: 2100, party: [['plugpup', 19], ['nutbolt', 19], ['ramvolt', 21]],
    intro: ["Ah, my rescuer! I'm Ada, Leader of the Kingsbridge Gym.", "I built half the machines in this town, and I've wired my Beasties to match.", "Let's see if you can handle a little voltage!"],
    lose: 'Well! That was positively electrifying.', win: ["Marvellous. Absolutely marvellous. You've earned this."],
    gift: ['spray', 3], giftLine: "And take some Beastie Sprays. They'll keep the wild ones away while you travel.", bye: ["Team Blight wanted my power for some sort of 'Ley Engine'.", "Whatever it is, I don't like the sound of it. Do be careful."],
    after: ["The lights haven't flickered once since you sorted out that Admin. Thank you!"] },
  3: { name: 'Captain Maren', look: 'maren', badge: 'Tide', money: 2600, party: [['jellop', 24], ['sealby', 25], ['galegull', 25], ['clawcliff', 27]],
    intro: ["Ahoy! Captain Maren, Leader of the Saltmarsh Gym.", "You saved my lighthouse. Now let's see if you can weather a proper storm!"],
    lose: 'Blow me down! What a squall you are!', win: ["You sail true, young one. The Tide Badge is yours."],
    gift: ['ether', 2], giftLine: "Here, take these Ethers. They top up your Beasties' moves when they run low.", bye: ["That Rook said every ley line meets at Stonebarrow.", "The sea's been restless for weeks. Something big is stirring, I can feel it in my bones."],
    after: ["The tide's calm again. Fair winds to you!"] },
  4: { name: 'Leader Gideon', look: 'gideon', badge: 'Flint', money: 3100, party: [['cairnback', 29], ['coalby', 29], ['shellump', 30], ['cobblore', 31]],
    intro: ["Hrmph. So you're the one who came through my old mine.", "I'm Gideon. I've been digging these hills for sixty years. My Beasties are harder than the rock they came from.", "Let's see what you're made of!"],
    lose: 'Well, blow me. Cracked like a walnut.', win: ["You've got grit. Real Cragmoor grit. Take the Flint Badge."],
    gift: ['hypertonic', 2], giftLine: 'And a couple of Hyper Tonics. Mining is thirsty work, and so is battling.', bye: ["Those Blight folk dug out every ley crystal they could find down there.", "Fernwick Way runs east from here. Mind how you go."],
    after: ["Still standing, am I? Takes more than one beating to knock over an old miner."] },
  5: { name: 'Leader Briony', look: 'briony', badge: 'Bloom', money: 3500, party: [['strawby', 33], ['toadcap', 33], ['dandelyon', 34], ['oakhart', 36]],
    intro: ["Thank you for saving the Elder Oak. I'm Briony, and this greenhouse is my gym.", "Every one of my Beasties grew up in that Glade. Let's show you how strong it made them!"],
    lose: 'Oh, you pruned us right back!', win: ["You've a gardener's patience and a storm's strength. The Bloom Badge is yours."],
    gift: ['royalorb', 3], giftLine: 'Have these Royal Orbs too. They catch Beasties better than anything you can buy round here.', bye: ["Poor Crispin. Imagine finding out your own grandfather is behind all this.", "The Ironhold Road is east of the village. They say Team Blight have been seen near the castle."],
    after: ["The Oak is flowering again. The whole forest feels lighter."] },
  6: { name: 'Sir Percival', look: 'percival', badge: 'Iron', money: 4000, party: [['squirex', 37], ['stagmajor', 37], ['dynacoil', 38], ['sovrain', 38], ['bulwark', 40]],
    intro: ["Welcome, champion of Ironhold! I am Sir Percival, knight and Gym Leader.", "Thou freed my castle. Now, as custom demands, I must test thy mettle. Have at thee!"],
    lose: 'I... yield! A fine duel!', win: ["Ironhold's armour has never been so thoroughly dented. The Iron Badge is thine!"],
    gift: ['maxtonic', 2], giftLine: 'Take these Max Tonics also. A knight never marches without provisions.', bye: ["Rook spoke of the Engine being moved to Stonebarrow.", "The Fellside Pass is open to thee now. Highfell lies beyond, high in the snow."],
    after: ["My squires talk of nothing but thy victory. Most embarrassing."] },
  7: { name: 'Leader Elspeth', look: 'elspeth', badge: 'Frost', money: 4500, party: [['ptarmagale', 42], ['erminess', 42], ['crystaflake', 43], ['rimeguard', 45]],
    intro: ["You climbed all the way up to Highfell. Impressive.", "I'm Elspeth. Up here, the cold is a teacher. It teaches you to keep calm, and to never waste a move.", "Show me what you've learned!"],
    lose: 'Oh! My composure has melted.', win: ["Cool head, warm heart. You deserve the Frost Badge."],
    gift: ['revive', 3], giftLine: 'Some Revival Herbs. They grow under the snow up here, if you know where to look.', bye: ["The rangers on Storm Tor will let you up now, if you're brave enough.", "And the cliff road to Ravenscar is open. The last gym is there."],
    after: ["The snow sparkles differently today. Or perhaps that's just me."] },
  8: { name: 'Leader Caradoc', look: 'caradoc', badge: 'Wyrm', money: 5000, party: [['salamandrake', 45], ['lindwyrm', 45], ['wyvernette', 46], ['leviarch', 46], ['pendrake', 48]],
    intro: ["So. The trainer everyone is talking about.", "I am Caradoc. Dragons are the oldest Beasties in Brackenshire, and the proudest.", "Earn their respect, and mine!"],
    lose: 'The dragons... bow to you.', win: ["It has been many years since anyone beat me. Take the Wyrm Badge. You have earned all eight."],
    gift: ['maxtonic', 3], giftLine: 'And take these. You will need them.', bye: ["Listen. My dragons have been crying all morning. The ley lines are screaming.", "It is Stonebarrow. Whatever Ambrose has planned, it is happening NOW.", "Take the coach from the Wayhouse to Millbrook. Go! The League can wait."],
    after: ["Go to Stonebarrow! The dragons will not settle until the Sleeper does."] },
};

const E4 = [null,
  { name: 'Elite Rosalind', look: 'rosalind', party: [['wispwarden', 50], ['shipwraith', 51], ['scarecrone', 51], ['keyhaunt', 52], ['barghest', 53]],
    intro: ["Welcome, child, to the Hall of Shadows. I am Rosalind of the Elite Four.", "My Beasties drift between this world and the next. Shall we see which side you end up on?"],
    lose: 'Oh my. The shadows part for you.', after: ["Go on, dear. The next Elite is waiting. And do mind the draughts."] },
  { name: 'Elite Bertram', look: 'bertram', party: [['bulwark', 51], ['highhorn', 52], ['billycrag', 52], ['aquilord', 53], ['knightrix', 54]],
    intro: ["HAAH! I am Bertram! My muscles are Elite, my Beasties are Elite, even my breakfast is Elite!", "No tricks, no fuss. Just power! Come on!"],
    lose: 'OOF! What a wallop!', after: ["You've got a heart of iron. Go on through!"] },
  { name: 'Elite Seren', look: 'seren', party: [['selkara', 52], ['crystaflake', 53], ['sibylynx', 53], ['oberwick', 54], ['somnarch', 55]],
    intro: ["I saw you coming, you know. In a dream, three nights ago.", "I'm Seren. In my dream, you won. But dreams can be wrong... Let's find out."],
    lose: 'Hmm. The dream was right after all.', after: ["Only one Elite remains. He does not dream at all, I think."] },
  { name: 'Elite Wulfric', look: 'wulfric', party: [['ravenor', 53], ['viperion', 54], ['moggadon', 54], ['nightmarten', 55], ['gargrim', 56]],
    intro: ["...So you beat the other three.", "I am Wulfric. The last of the Elite Four. My Beasties hunt in the dark, and they never, ever give up.", "Let's end this."],
    lose: '...Well fought.', after: ["The Champion waits beyond that door.", "He is young. Younger than you, maybe. Don't underestimate him."] },
];

Object.assign(S, {
  async profLater() {
    const f = G.flags;
    if (f.hof) return S.profPost();
    if (f.climax) await say(["The Leywyrm... the Sleeper itself! And you faced it!", "The League at Crowntor is open now. Go and show them what a Hollowmere trainer can do!"]);
    else if (f.badge8) await say(["Eight badges! Extraordinary!", "But Caradoc's letter says the ley lines are in uproar. Stonebarrow, above all. Please be careful."]);
    else if (f.glade) await say(["Ambrose Ashworth-Vane? Behind Team Blight? Good heavens.", "I've known the Ashworth-Vanes for years. He was always obsessed with the old legends. I never dreamed..."]);
    else await say([`${badgeCount()} badge${badgeCount() > 1 ? 's' : ''} already! Splendid work.`, "Your Field Journal is filling up nicely, too. Do keep at it!", "Remember, the coach drivers in every Wayhouse can take you back to any town you've visited."]);
  },
  async profPost() {
    const f = G.flags;
    if (!f.postGift) {
      f.postGift = 1;
      await say([`${G.name}! Our very own Champion! Hollowmere is so proud of you.`, "I have something for you. Two very special Beasties who never found a trainer..."]);
      for (const [sp] of STARTERS) if (sp !== f.starter) { const m = newMon(sp, 10); G.seen[sp] = G.caught[sp] = 1; if (G.party.length < 6) G.party.push(m); else G.box.push(m); sfx('catch'); await msg(`${G.name} received ${SPECIES[sp].n}!${G.party.includes(m) ? '' : ' It was sent to storage.'}`); }
      await say(["And this. It's a Crown Orb, the rarest orb in all Brackenshire. It never fails."]);
      await give('crownorb');
      await say(["The Leyheart, the chamber under the stones... my readings show something new down there.", "Something white, that moves like a hare. Perhaps you'd like to take a look?"]);
    } else if (Object.keys(G.caught).length >= 100 && !G.bag.shinycharm) {
      await say(["One hundred different Beasties! Now that is dedication.", "Here, you've more than earned this. It's a Shiny Charm."]);
      await give('shinycharm');
      await say(["Rare-coloured Beasties will turn up three times as often while you carry it."]);
    } else await say([`${Object.keys(G.caught).length} Beasties caught! Wonderful.`, "Catch one hundred different kinds and come back to see me. I'll have something special for you."]);
  },
  async coach() {
    if (!G.flags.coachIntro) { G.flags.coachIntro = 1; await say(["Wayhouse Coaches, at your service!", "I can take you to any town you've already visited. Hop on whenever you like!"]); }
    const here = G.map.exitTo && G.map.exitTo.map;
    const opts = COACH.filter(t => G.flags['v_' + t.map] && t.map !== here);
    if (!opts.length) { await say("You've not been anywhere else yet! Come back when you've seen a bit more of Brackenshire."); return; }
    const b = await msg('Where to, then?', { hold: true });
    const r = await choose([...opts.map(t => t.n), 'Cancel'], { x: 8, y: Math.max(2, 140 - (opts.length + 1) * 15 - 12) });
    b.done();
    if (r < 0 || r >= opts.length) { await say('Right you are. Safe travels on foot!'); return; }
    const t = opts[r];
    await say(`All aboard for ${t.n}!`);
    await fadeOut(350); sfx('door'); playMusic(null); await wait(700);
    loadMap(t.map, t.x, t.y, 'down'); await wait(200); await fadeIn(350);
    autosave();
    if (G.map.onEnter) await G.map.onEnter();
  },
  async teaLady() {
    await say(G.flags.teaLady ? ["Back again, pet? Sit yourself down. Tea's still hot."] : ["Welcome to the Kingsbridge Tea Room, pet!", "A nice cup of tea fixes everything. Your Beasties too, I shouldn't wonder."]);
    G.flags.teaLady = 1;
    await fadeOut(200); healAll(); sfx('heal'); await wait(900); await fadeIn(200);
    await say(["There. Everyone's had a biscuit and a sit down. Right as rain."]);
  },
  async aideCharm() {
    if (!G.bag.expcharm) {
      await say([`Oh! You must be ${G.name}. Professor Hawthorn wrote to me all about you.`, "I study how Beasties grow. Here, take this. It's an Exp. Charm."]);
      await give('expcharm');
      await say(["While you carry it, your Beasties earn half as much EXP. again from every battle.", "Think of it as a gift from the Professor and me."]);
    } else await say(["Beasties grow fastest when they battle often, and battle well.", "Keep that Exp. Charm safe!"]);
  },
  async curator() {
    for (const [key, sp] of [['cliffossil', 'ichthlet'], ['amberchunk', 'ambrix']]) {
      if (!G.bag[key]) continue;
      await say([`My word! Is that ${ITEMS[key].n === 'Old Amber' ? 'Old Amber' : 'a Cliff Fossil'}? May I?`, "...Remarkable. There's still ley energy inside. I believe I can bring this creature back!", "Give me a moment..."]);
      delete G.bag[key];
      await fadeOut(250); sfx('evolve'); await wait(1400); await fadeIn(250);
      const m = newMon(sp, 25); G.seen[sp] = G.caught[sp] = 1;
      if (G.party.length < 6) G.party.push(m); else G.box.push(m);
      sfx('catch'); await msg(`${G.name} received ${SPECIES[sp].n}!${G.party.includes(m) ? '' : ' It was sent to storage.'}`);
      await say(["Look after it. It's been waiting a very long time to see the sky again."]);
      return;
    }
    await say(["Welcome to the Kingsbridge Museum!", "Our speciality is fossils. Find any old fossils or amber on your travels and bring them to me.", "With a little ley energy, we can bring them back to life!"]);
  },
  async fisherman() {
    if (!G.bag.oldrod) {
      await say(["Ah, a young trainer! Do you fish?", "No? Then you're missing half the Beasties in Brackenshire! Here, take my spare rod."]);
      await give('oldrod');
      await say(["Face any water and press Z to cast your line. Different waters hide different Beasties.", "Try the sea here, then the ponds and rivers inland. And try at night, too!"]);
    } else await say(["Caught anything good? The sea off Ravenscar is meant to be something special."]);
  },
  async herbalist() {
    if (!G.flags.herbGift) { G.flags.herbGift = 1; await say(["Herbs from the Glade, dear. Best in Brackenshire.", "Take some Herbal Salves. You never know when a Beastie will need one."]); await give('salve', 3); }
    else await say(["The Glade's plants grow twice as fast as anywhere else. It's the ley line, you see."]);
  },
  async vicar() {
    await say(["Welcome to St Bede's. Our window is very old. Older than the church itself, some say.", "It shows the Sleeper beneath seven stones, and the White Hare who watches over its dreams.",
      G.flags.climax ? "They say the Hare has been seen again, now that the Sleeper has stirred. Deep beneath the stones." : "The old books say that if the Sleeper ever wakes, the Hare will come looking for it."]);
  },
  async armourer() {
    if (!G.flags.armourGift) { G.flags.armourGift = 1; await say(["Clang! Clang! Oh, a customer!", "I make armour for the knights. Also this spray. Keeps wild Beasties off. Knights hate getting ambushed."]); await give('spray', 3); }
    else await say(["Every knight in Ironhold wears my armour. And every Beastie of theirs is a Steel type. Coincidence? No."]);
  },
  async oldKnight() {
    if (G.flags.castle && !G.flags.knightGift) { G.flags.knightGift = 1; await say(["The castle is free! Oh, I wish I'd been young enough to help.", "Take these, with an old knight's thanks."]); await give('hypertonic', 2); }
    else await say(["Ironhold Castle was built to guard the ley road north.", G.flags.castle ? "Eight hundred years, and it only ever fell once. For one night. Thanks to you." : "Eight hundred years, and it never fell. Until now."]);
  },
  async skiLodge() {
    if (!G.flags.skiGift) { G.flags.skiGift = 1; await say(["Welcome to the Ski Lodge! Kettle's on.", "Found these Royal Orbs buried in a snowdrift. Better use for them in your hands than mine."]); await give('royalorb', 2); }
    else await say(["The powder's perfect on the Fellside slopes today. If you like crashing into pine trees."]);
  },
  async weatherman() {
    await say(["I measure the weather up here. It's been very odd lately.", "Storm Tor has had lightning every single day this month. Every day! Something up there is calling it down.",
      G.flags.badge7 ? "The rangers will let you up the Tor now. Take plenty of Ground types!" : "The rangers won't let anyone up without the Frost Badge. Very sensible."]);
  },
  async harbour() {
    if (!G.flags.harbourGift) { G.flags.harbourGift = 1; await say(["The sea here is deep, and full of dragons. Little blue ones.", "Here, you'll want these if you go fishing for one of them."]); await give('greatorb', 5); }
    else await say(["Fish off the end of the pier. The deeper the water, the stranger the catch."]);
  },
  async scholar() {
    await say(["I study dragons. Dragons, and the Sleeper.", "The Sleeper is a dragon, you know. The oldest of all. Part dragon, part stone. It curled up under Stonebarrow a thousand years ago and never woke.",
      "Some say the ley lines ARE its breath. If that's true, then waking it on purpose would be... well. Very silly indeed."]);
  },
  async abbot() {
    await say(["Peace be with you, traveller. Rest a while."]);
    await fadeOut(200); healAll(); sfx('heal'); await wait(900); await fadeIn(200);
    await say(["The Wyrm Chronicle tells of a white hare, bright as the moon, who sings the Sleeper back to sleep whenever it stirs.",
      G.flags.climax ? "If the Sleeper woke, perhaps the Hare is near. Look beneath the stones." : "Let us hope we never need her."]);
  },
  async legend(sp, lvl) {
    const n = SPECIES[sp].n;
    const intro = { brandtusk: ['The air shimmers with heat. A great beast lifts its head from the coals...', `${n} roared!`], stormane: ['Thunder cracks overhead. A horse made of storm clouds rears up...', `${n} neighed like a thunderclap!`],
      rimehorn: ['The cavern glitters. A white stag with antlers of crystal turns to face you...', `${n} lowered its antlers!`], leywyrm: ['Green light pulses through the chamber. The great stone serpent opens one eye...', `${n} rumbled!`],
      albionne: ['Something soft and white bounds between the crystals. It stops, and looks right at you...', `${n} sang a single, clear note!`] }[sp] || [`${n} appeared!`];
    await say(intro);
    const res = await battle({ wild: newMon(sp, lvl, { shiny: false }), legend: true });
    if (res === 'caught') { G.flags['leg_' + sp] = 1; spawnNPCs(); autosave(); }
    else if (res === 'lose') await blackout();
    else if (res === 'win') await say([`${n} vanished in a flash of light...`, 'It seems to have returned to its resting place. Perhaps you could try again.']);
  },
  async power() {
    const mor = npc('pmorwen'), ada = npc('pada');
    await say(["MORWEN: You. The brat from the moor.", "MORWEN: Do you know how much power it takes to wake something that has slept for a thousand years? More than this whole town can make.", "MORWEN: And I will take every last spark. Get out of my way!"]);
    const res = await bossBattle('Admin Morwen', 'admin', [['grimrat', 19], ['flitter', 19], ['toadcap', 20]], 1600, "MORWEN: Again?! How are you DOING this?");
    if (res === 'lose') { await blackout(); return; }
    await say(["MORWEN: Fine. Keep your precious lights.", "MORWEN: The Ley Engine will find its power elsewhere. Blight! Pull out!"]);
    await fadeOut(300); G.flags.power = 1; spawnNPCs(); await fadeIn(300);
    await say(["ADA: The generators are humming again! Oh, you absolute star.", "ADA: I'll be back at my gym. Come and challenge me when you're ready. I owe you a proper battle!"]);
    autosave();
  },
  async lighthouse() {
    await say(["ROOK: So you're the one Morwen keeps whining about. Small, aren't you?", "ROOK: This lamp sits right on top of the Coast ley line. We're draining the sea's power, one wave at a time.", "ROOK: Walk away, kid. Last warning."]);
    const res = await bossBattle('Admin Rook', 'rook', [['jellop', 23], ['blightrat', 24], ['vespermaus', 25]], 2000, "ROOK: ...Huh. Not bad.");
    if (res === 'lose') { await blackout(); return; }
    await say(["ROOK: Enjoy your little win. It changes nothing.", "ROOK: Every ley line in Brackenshire meets under Stonebarrow Moor. When the boss has drained enough of them, the Sleeper wakes. And it will listen to us.", "ROOK: We're done here."]);
    await fadeOut(300); G.flags.lighthouse = 1; spawnNPCs();
    for (const b of MAPS.saltmarsh.buildings) delete b._c;
    await fadeIn(300);
    sfx('item');
    await say(["The great lamp flickers... and blazes back to life!", "MAREN: The light's back! Ha! Every ship on this coast owes you a pint of cocoa.", "MAREN: I'm heading back to the gym. Come find me when you want a real battle!"]);
    autosave();
  },
  async leader(n) {
    const L = LEADERS[n];
    if (G.flags['badge' + n]) { await say(L.after); return; }
    await say(L.intro);
    const res = await bossBattle(L.name, L.look, L.party, L.money, L.lose);
    if (res === 'lose') { await blackout(); return; }
    await say(L.win);
    sfx('badge'); G.flags['badge' + n] = 1;
    await showWhile(new BadgeShow(n), () => msg(`${G.name} received the ${L.badge} Badge!`));
    if (L.gift) { await say(L.giftLine); await give(L.gift[0], L.gift[1]); }
    await say(L.bye);
    autosave();
    if (n < 8) await S.chapterEnd(n);
  },
  async rival3() {
    if (G.flags.rival3 || !G.party.length) return;
    hideFollower();
    const r = spawnActor('rival', 31, G.pl.y, 'left', 'rival');
    r.alert = NOW; sfx('alert'); await wait(500);
    await walk(r, ['left'], 250); G.pl.dir = 'right';
    await say(["Well, well. The village kid made it through the wood. Barely, I expect.", "I've already got my Kingsbridge badge. Well... nearly. The gym's closed. Something about a power cut.", "Doesn't matter. Let's see if you've improved at all!"]);
    const res = await battle({ trainer: { name: 'Crispin', look: 'rival', party: [['galewing', 17], ['woolt', 16], [rivalMon(1), 18]], money: 1200, lose: "Hmph! My Beasties are clearly tired from all my winning." } });
    G.flags.rival3 = 1;
    if (res === 'lose') { removeActor(r); await blackout(); return; }
    await say(["You know, Grandfather says the whole of Kingsbridge used to belong to the Ashworth-Vanes.", "He says one day it will again. Whatever that means. Anyway! Must dash."]);
    await walk(r, ['right'], 220); removeActor(r);
    autosave();
  },
  async rival4() {
    if (G.flags.rival4 || !G.flags.badge3) return;
    hideFollower();
    const r = spawnActor('rival', G.pl.x, 16, 'down', 'rival');
    r.alert = NOW; sfx('alert'); await wait(400);
    await stepTo(r, G.pl.x, 17, 220); G.pl.dir = 'up';
    await say(["There you are! Took you long enough to get through that grubby mine.", "I've got three badges now, same as you. But mine were won with STYLE.", "Grandfather's been ever so busy lately. Meetings at all hours with people in grey coats. Probably business.", "Anyway. Battle!"]);
    const res = await battle({ trainer: { name: 'Crispin', look: 'rival', party: [['galewing', 27], ['ramvolt', 27], ['cobblore', 28], [rivalMon(1), 30]], money: 2200, lose: "No! I trained for WEEKS for this!" } });
    G.flags.rival4 = 1;
    if (res === 'lose') { removeActor(r); await blackout(); return; }
    await say(["...Fine. You're good. There, I said it. Happy?", "Next time I'll have a team even Grandfather would be proud of. You'll see."]);
    await walk(r, ['up'], 220); removeActor(r);
    autosave();
  },
  async rival5() {
    if (G.flags.rival5 || !G.flags.badge7) return;
    hideFollower();
    const [rx, ry, rd] = freeNear(G.pl.x, G.pl.y);
    const r = spawnActor('rival', rx, ry, rd, 'rival', { appear: NOW });
    await wait(400);
    faceEach(G.pl, r); r.dir = rd;
    await say(["...Hello, " + G.name + ".", "I haven't been home since the Glade. I can't look at him.", "Everything I ever did, I did to make Grandfather proud. And he's... he's the villain. The actual villain.", "I need to know I'm not like him. I need to know I'm strong enough to stop him. Battle me. Properly."]);
    const res = await battle({ trainer: { name: 'Crispin', look: 'rival', party: [['galewing', 42], ['ramvolt', 42], ['torgolem', 43], ['lindwyrm', 43], [rivalMon(2), 45]], money: 4000, lose: "...Thank you. I needed that." } });
    G.flags.rival5 = 1;
    if (res === 'lose') { removeActor(r); await blackout(); return; }
    await say(["You're better than me. You always were, weren't you? Since that first day in the lab.", "But I'm going to be better than HIM. Whatever he's planning, I'll be there to stop it.", "See you soon, " + G.name + "."]);
    await fadeOut(250); removeActor(r); await fadeIn(250);
    autosave();
  },
  async glade() {
    if (G.flags.glade) return;
    if (!G.flags.badge4) { await say('Something about this place makes you want to turn back...'); await G.pl.moveTo('down', 230); return; }
    hideFollower();
    const pl = G.pl, rook = npc('grook'), bri = npc('gbriony'), g1 = npc('gg1'), g2 = npc('gg2');
    if (!rook) return;
    playMusic('boss');
    if (pl.x !== 12) await pl.moveTo('left', 230);
    await pl.moveTo('up', 230); pl.dir = 'up';
    await say(["BRIONY: Stop it! Can't you see you're killing it?!", "ROOK: It's a tree, Leader. A thousand years of ley energy in its roots, doing nothing. We're putting it to use."]);
    g1.dir = 'down'; g1.alert = NOW; sfx('alert'); await wait(500);
    await say(["GRUNT: Admin Rook! It's that kid again!"]);
    rook.dir = 'down';
    await say(["ROOK: Of course it is. The lighthouse brat.", "ROOK: I told Morwen you'd be trouble. Let's finish this properly."]);
    const res = await bossBattle('Admin Rook', 'rook', [['clawcliff', 30], ['blightrat', 30], ['vespermaus', 31], ['viperion', 32]], 3000, "ROOK: Tch. The boss won't like this.");
    if (res === 'lose') { await blackout(); return; }
    await say(["ROOK: You really don't know when to quit, do you?", "???: That's enough, Rook."]);
    const amb = spawnActor('ambrose', 12, 14, 'up', 'ambrose');
    pl.dir = 'down';
    await walk(amb, ['up', 'up', 'up', 'up'], 300);
    await say(["???: So this is the child who keeps spoiling my plans. Hmm. Smaller than I imagined.", "AMBROSE: Allow me to introduce myself. Ambrose Ashworth-Vane. Founder of Team Blight.", "AMBROSE: The Sleeper under Stonebarrow is the greatest power in Brackenshire. Once, it belonged to my family. It will again."]);
    const cr = spawnActor('rival', 13, 14, 'up', 'rival');
    await walk(cr, ['up', 'up', 'up'], 200);
    cr.alert = NOW; sfx('alert');
    await say(["CRISPIN: G-Grandfather?!"]);
    amb.dir = 'right'; cr.dir = 'left';
    await say(["AMBROSE: Crispin. You're meant to be training.", "CRISPIN: You're... Team Blight? All this time? The moor, the lighthouse, the grey coats at the house...", "AMBROSE: Everything I do, I do for this family, boy. One day you'll understand.", "AMBROSE: The Oak has given us enough. Rook. We're leaving."]);
    await fadeOut(400);
    removeActor(amb); for (const e of [rook, g1, g2]) removeActor(e);
    await wait(300); await fadeIn(400);
    cr.dir = 'down';
    await say(["CRISPIN: ...I didn't know. I swear I didn't know."]);
    await walk(cr, ['down', 'down', 'down', 'down'], 260); removeActor(cr);
    playMusic('forest');
    await walk(bri, ['right'], 250); faceEach(bri, pl);
    G.flags.glade = 1; for (const b of MAPS.glade.buildings) delete b._c;
    await tween(400, t => G.stoneFlash = t * .4); await tween(600, t => G.stoneFlash = .4 * (1 - t)); G.stoneFlash = 0;
    await say(["BRIONY: Look! The leaves... they're turning green again! The Oak is breathing!", "BRIONY: Thank you. I'm Briony, Leader of the Fernwick Gym.", "BRIONY: That poor boy. What a thing to find out.", "BRIONY: Come to my gym when you're ready. The Oak and I would both like to thank you properly."]);
    await fadeOut(250); removeActor(bri); spawnNPCs(); await fadeIn(250);
    autosave();
  },
  async castleKeep() {
    if (G.flags.castle) return;
    G.lock++;
    try {
      hideFollower();
      const pl = G.pl, rook = npc('krook'), sci = npc('ksci'), per = npc('kpercival');
      if (!rook) return;
      playMusic('boss');
      await say(["ROOK: Well, well. You made it all the way up here.", "ROOK: Morwen always did underestimate you. I won't make that mistake."]);
      await stepTo(pl, 7, 2, 230); pl.dir = 'down'; rook.dir = 'up';
      const res = await bossBattle('Admin Rook', 'rook', [['clawcliff', 37], ['blightrat', 37], ['viperion', 38], ['vespermaus', 38], ['gargrim', 39]], 3800, "ROOK: ...I'm done. I'm done.");
      if (res === 'lose') { await blackout(); return; }
      await say(["ROOK: Too late, anyway. The Ley Engine left this castle two days ago.", "ROOK: It's at Stonebarrow now, sitting right in the middle of the stones. When the boss drains the last ley line, the Sleeper wakes.", "ROOK: Blight! Retreat!"]);
      await fadeOut(350); removeActor(rook); removeActor(sci); await wait(200); await fadeIn(350);
      await walk(per, ['left', 'left', 'left', 'left', 'left'], 260); faceEach(per, pl);
      await say(["PERCIVAL: Well fought! Truly well fought!", "PERCIVAL: I am Sir Percival, knight of Ironhold and Leader of its gym. They locked me in my own keep. Humiliating!", "PERCIVAL: Ironhold owes thee a great debt. Come to my gym, and I shall repay it with the finest battle of thy life!"]);
      await fadeOut(250); G.flags.castle = 1; spawnNPCs(); await fadeIn(250);
      playMusic('castle');
      autosave();
    } finally { G.lock--; }
  },
  async moorTrigger() {
    if (!G.flags.stones) return S.stonesScene();
    if (G.flags.badge8 && !G.flags.climax) return S.climax();
  },
  async climax() {
    const pl = G.pl, amb = npc('cambrose'), mor = npc('cmorwen'), rook = npc('crook');
    if (!amb || (!G.flags.ambroseBeaten && (!mor || !rook))) return;
    hideFollower();
    playMusic('boss');
    while (pl.x !== 12) await pl.moveTo(pl.x < 12 ? 'right' : 'left', 230);
    await pl.moveTo('up', 230); pl.dir = 'up';
    if (!G.flags.ambroseBeaten) {
      await say(["AMBROSE: Ah. I wondered if you would come.", "AMBROSE: Look at it. The Ley Engine. Every ley line in Brackenshire now runs through these stones, and through my machine.", "AMBROSE: For a thousand years the Sleeper has dreamed down there. Tonight, it wakes. And the first thing it will see is me."]);
      const cr = spawnActor('rival', 12, 14, 'up', 'rival');
      await walk(cr, ['up', 'up', 'up', 'up'], 200);
      await say(["CRISPIN: Grandfather! STOP!"]);
      amb.dir = 'down';
      await say(["AMBROSE: Crispin. Stand aside.", "CRISPIN: No. Not this time.", `CRISPIN: ${G.name}, I'll deal with the Admins. You stop HIM!`]);
      mor.dir = 'down'; rook.dir = 'down';
      await say(["MORWEN: Brave words, little prince.", "ROOK: Let's see you back them up."]);
      await fadeOut(300); removeActor(mor); removeActor(rook); removeActor(cr); await wait(200); await fadeIn(300);
      await say(["You can hear battling somewhere out on the heather...", "AMBROSE: How touching. Very well, child. Let me show you why I founded Team Blight."]);
      await walk(amb, ['down'], 300);
      const res = await bossBattle('Boss Ambrose', 'ambrose', [['blightrat', 46], ['moggadon', 46], ['viperion', 47], ['gargrim', 47], ['sibylynx', 48], ['barghest', 49]], 8000, "AMBROSE: No... NO! Impossible!");
      if (res === 'lose') { await blackout(); return; }
      G.flags.ambroseBeaten = 1; autosave();
      await say(["AMBROSE: It doesn't matter. It doesn't MATTER!", "AMBROSE: The Engine is already running. It's too late to stop it!"]);
    } else await say(["The Ley Engine shrieks. The stones are glowing brighter and brighter..."]);
    sfx('rumble'); playMusic(null);
    for (let i = 0; i < 24; i++) { SHAKE = 4; await wait(60); }
    G.stoneGlow = true;
    await tween(300, t => G.stoneFlash = t * .8); await tween(900, t => G.stoneFlash = .8 * (1 - t)); G.stoneFlash = 0;
    await showWhile(new SleeperVision(), async () => { await wait(1400); await say(['The ground splits open between the stones...', 'The Sleeper has awoken!']); });
    await say(["AMBROSE: Yes! YES! Leywyrm! I am Ambrose Ashworth-Vane! I command you to...", "The Leywyrm roars! The Ley Engine shatters into a thousand pieces!", "AMBROSE: Aaagh!", "The great stone serpent turns its burning eyes... towards you!"]);
    let res;
    while (true) {
      res = await battle({ wild: newMon('leywyrm', 50, { shiny: false }), legend: true, bg: 'moor' });
      if (res !== 'run') break;
      await say(["There's no escaping the Leywyrm! It blocks the way!"]);
    }
    if (res === 'lose') { await blackout(); return; }
    if (res === 'caught') { G.flags.leg_leywyrm = 1; await say(["The Leywyrm has been calmed. Its great heart beats quietly inside the orb."]); }
    else await say(["The Leywyrm shudders... and sinks back down into the earth, deep beneath the stones.", "It seems calmer now. It has gone back to the chamber below."]);
    await S.climaxEnd();
  },
  async climaxEnd() {
    const pl = G.pl, amb = npc('cambrose');
    await fadeOut(400);
    G.flags.climax = 1; G.stoneGlow = true;
    spawnNPCs();
    const a = spawnActor('ambx', 12, 5, 'down', 'ambrose');
    const prof = spawnActor('profx', 11, 11, 'up', 'prof'), haz = spawnActor('hazelx', 14, 11, 'up', 'hazel'), cr = spawnActor('crx', 13, 11, 'up', 'rival');
    await wait(300); await fadeIn(400);
    playMusic('moor');
    await say(["AMBROSE: ...It looked at me. It looked right at me, and it saw nothing worth obeying.", "AMBROSE: A thousand years of legends, and the Sleeper chose a child from Hollowmere."]);
    await walk(cr, ['up', 'up'], 250); cr.dir = 'up';
    await say(["CRISPIN: It's over, Grandfather. Morwen and Rook have run off. The constables are coming.", "AMBROSE: ...Crispin. I did it all for you.", "CRISPIN: No. You did it for YOU. I'd rather be nobody than be like that."]);
    await fadeOut(350); removeActor(a); await wait(300); await fadeIn(350);
    await walk(prof, ['up'], 250); faceEach(prof, pl); faceEach(haz, pl);
    await say([`PROF: ${G.name}! Are you all right?! We saw the light from Hollowmere!`, "HAZEL: The whole moor lit up like a bonfire. And then that... that THING rose out of the ground!", "PROF: The Leywyrm. The Sleeper. The oldest Beastie in Brackenshire. I never thought I'd live to see it.",
      "PROF: And look! The stones have opened a passage down into the earth. The Leyheart. We'll need to study it, very carefully."]);
    faceEach(cr, pl);
    await say(["CRISPIN: " + G.name + ". Thank you. For everything.", "CRISPIN: I'm going to Crowntor. To the League. I need to prove that an Ashworth-Vane can do something good for once.", "CRISPIN: I'll be waiting for you at the top. Don't keep me waiting too long."]);
    await walk(cr, ['down', 'down', 'down'], 220); removeActor(cr);
    await say(["HAZEL: The ley lines are calming down. Crowntor will open again now.", `PROF: Go on, ${G.name}. The League awaits. You've more than earned the right to challenge it.`]);
    await fadeOut(300); removeActor(prof); removeActor(haz); await fadeIn(300);
    autosave();
    await S.chapterEnd(8);
  },
  async e4(n, trig) {
    const E = E4[n];
    if (G.flags['e4_' + n]) { if (!trig) await say(E.after); return; }
    const m = npc(E.look + 'a'); if (m) faceEach(m, G.pl);
    await say(E.intro);
    const res = await bossBattle(E.name, E.look, E.party, 5000 + n * 500, E.lose);
    if (res === 'lose') { await blackout(); return; }
    G.flags['e4_' + n] = 1;
    await say(E.after);
    await fadeOut(200); spawnNPCs(); await fadeIn(200);
    sfx('door'); await msg('The door at the back of the hall swung open!');
    autosave();
  },
  async champion(trig) {
    if (G.flags.champion) { if (!trig) await say(["Go on. The Hall of Fame's through there. You earned it."]); return; }
    const c = npc('rivala'); if (c) faceEach(c, G.pl);
    await say([`${G.name}. I knew it would be you.`, "I got here an hour before you. Beat all four Elites. First Ashworth-Vane Champion in history. Grandfather would have been proud.", "...No. I don't care what he'd think any more. I care what YOU think.", "This is the last battle. Everything we've got. Ready?"]);
    const res = await battle({ trainer: { name: 'Champion Crispin', look: 'rival', boss: true, champion: true, party: [['galewing', 55], ['ramvolt', 55], ['torgolem', 56], ['lindwyrm', 56], ['pendrake', 57], [rivalMon(2), 58]], money: 10000, lose: "...That's it, then. You win." } });
    if (res === 'lose') { await blackout(); return; }
    await say(["Ha. Ha ha. You know what? I'm not even angry.", "You're the Champion now. The real one. From the village kid to the best trainer in Brackenshire."]);
    const prof = spawnActor('profc', 6, 11, 'up', 'prof');
    await walk(prof, ['up', 'up', 'up', 'up', 'up', 'up'], 250);
    await say([`PROF: ${G.name}! You did it! Oh, I'm so proud I could burst!`, "PROF: Crispin, you battled wonderfully too, my boy.", "CRISPIN: Thanks, Professor.", `PROF: Come on, ${G.name}. There's one more room. The Hall of Fame, where every Champion's team is remembered forever.`]);
    G.flags.champion = 1; autosave();
    await warp('hall', 6, 8, 'up');
  },
  async hallOfFame() {
    if (G.flags.hof) return;
    G.lock++;
    try {
      hideFollower();
      const prof = spawnActor('profh', 5, 3, 'down', 'prof');
      const cr = spawnActor('crh', 8, 3, 'down', 'rival');
      await stepTo(G.pl, 6, 4, 260); G.pl.dir = 'up';
      await say(["PROF: This machine records every Champion and their Beasties. Your team will be remembered for as long as Brackenshire stands.", `PROF: Now, ${G.name}, place your Beasties on the machine...`]);
      healAll(); sfx('heal'); playMusic('hall');
      await push(new HallOfFame());
      await say(["CRISPIN: Congratulations, Champion. I mean it.", "CRISPIN: Next time, though? Next time I'm winning."]);
      await push(new Credits());
      G.flags.hof = 1;
      await fadeOut(400);
      removeActor(prof); removeActor(cr);
      G.lastHeal = { map: 'home', x: 6, y: 5 };
      loadMap('home', 4, 6, 'up'); await wait(300); await fadeIn(400);
      await say(["MUM: Oh, love! My little Champion! Come here!", "MUM: The whole village is talking about you. Nan's baked a cake the size of a cartwheel.", "MUM: Professor Hawthorn popped round, by the way. He said to visit his lab when you've had a rest. Something about a present?"]);
      autosave();
    } finally { G.lock--; }
  },
});

MAPS.castle3.onEnter = () => S.castleKeep();
MAPS.hall.onEnter = () => S.hallOfFame();
MAPS.moor.triggers = [10, 11, 12, 13, 14, 15].map(x => ({ x, y: 9, run: () => S.moorTrigger() }));
{
  const c = () => G.flags.badge8 && !G.flags.climax;
  MAPS.moor.npcs.push(
    PERSON('cambrose', 12, 5, 'down', 'ambrose', null, { cond: c }),
    PERSON('cmorwen', 10, 6, 'down', 'admin', null, { cond: () => c() && !G.flags.ambroseBeaten }),
    PERSON('crook', 14, 6, 'down', 'rook', null, { cond: () => c() && !G.flags.ambroseBeaten }),
    PERSON('cgrunt1', 11, 20, 'right', 'grunt', null, { cond: c, trainer: { name: 'Blight Grunt', party: [['blightrat', 44], ['vespermaus', 44], ['toadcap', 44]], money: 1400, sight: 3, intro: 'This is it! Tonight the Sleeper wakes!', lose: "No! Not tonight of all nights!", after: 'The boss is at the stones. You are too late!' } }),
    PERSON('cgrunt2', 14, 15, 'left', 'grunt', null, { cond: c, trainer: { name: 'Blight Grunt', party: [['viperion', 44], ['moggadon', 45]], money: 1400, sight: 3, intro: "Team Blight's finest hour! And you're not ruining it!", lose: 'Ruined...', after: "The Engine's already humming. Can't you feel it?" } }),
    PERSON('mhazel', 5, 18, 'right', 'hazel', () => S.say(["This is where it all began, isn't it? Right here on the moor.", "The stones are quiet now. But every so often, you can feel something breathing, deep down."]), { cond: () => G.flags.climax && !G.flags.hof }),
  );
}
MAPS.moor.decor = (cx, cy) => {
  if (G.flags.badge8 && !G.flags.climax) {
    const X = 12 * 16 - cx - 8, Y = 3 * 16 - cy - 4;
    R(X + 2, Y + 18, 28, 6, '#2a2a34'); R(X + 4, Y + 4, 24, 16, '#4a4a58'); R(X + 6, Y + 6, 20, 12, '#6a6a7a'); R(X + 10, Y, 12, 6, '#3a3a44');
    const on = Math.floor(NOW / 200) % 2; R(X + 9, Y + 9, 5, 5, on ? '#a6e040' : '#5a8a20'); R(X + 18, Y + 9, 5, 5, on ? '#5a8a20' : '#a6e040'); R(X + 14, Y + 1, 4, 3, '#7affe0');
    for (let i = 0; i < 4; i++) { const a = NOW / 300 + i * 1.57; R(X + 16 + Math.cos(a) * 20, Y + 12 + Math.sin(a) * 10, 2, 2, '#7affe0'); }
  } else if (G.flags.climax) {
    const X = 12 * 16 - cx, Y = 4 * 16 - cy;
    R(X + 1, Y + 3, 14, 11, '#1a1420'); R(X + 3, Y + 2, 10, 13, '#1a1420'); R(X + 3, Y + 4, 10, 9, '#0a0810');
    if (Math.floor(NOW / 400) % 2) { R(X + 6, Y + 7, 4, 3, '#7affe0'); } R(X + 2, Y + 13, 12, 1, '#7affe0');
  }
};

// ---------- Hall of Fame + credits ----------
class HallOfFame {
  constructor() { this.t = NOW; }
  update() { if (NOW - this.t > 2500 && (A() || Bk())) this.done(); }
  draw() {
    bgScreen('#3a2a10', '#48361a');
    frame(8, 6, 240, 180, ['#30220a', '#fff8e0', '#e0b040']);
    txt('HALL OF FAME', 128, 14, '#b88a20', '#6a4a10', 12, 'center');
    const k = Math.min(G.party.length, Math.floor((NOW - this.t) / 350) + 1);
    G.party.slice(0, k).forEach((m, i) => { const x = 20 + (i % 3) * 76, y = 42 + Math.floor(i / 3) * 66;
      R(x, y, 68, 60, '#f4e8c8'); blit(creatureSprite(m.sp, 40, { shiny: m.shiny }), x + 14, y + 1); txt(monName(m), x + 34, y + 43, '#383840', null, 6, 'center'); txt('Lv' + m.lvl, x + 34, y + 52, '#8a6a30', null, 5.5, 'center'); });
    txt(`Champion ${G.name}`, 128, 172, '#8a6a30', null, 7, 'center');
  }
}
class Credits {
  constructor() {
    this.t = NOW;
    this.lines = [['BRACKENSHIRE', 16], ['', 7], ['A Beastie adventure', 7], ['made for ' + G.name, 7], ['', 7], ['', 7], ['STARRING', 8], ['', 7], [G.name + ', the Champion', 7], ['Crispin Ashworth-Vane', 7], ['Professor Hawthorn', 7], ['Mum and Nan Edie', 7], ['', 7],
      ['THE GYM LEADERS', 8], ['', 7], ['Hazel of Millbrook', 7], ['Ada of Kingsbridge', 7], ['Captain Maren of Saltmarsh', 7], ['Gideon of Cragmoor', 7], ['Briony of Fernwick', 7], ['Sir Percival of Ironhold', 7], ['Elspeth of Highfell', 7], ['Caradoc of Ravenscar', 7], ['', 7],
      ['THE ELITE FOUR', 8], ['', 7], ['Rosalind', 7], ['Bertram', 7], ['Seren', 7], ['Wulfric', 7], ['', 7], ['TEAM BLIGHT', 8], ['', 7], ['Admin Morwen', 7], ['Admin Rook', 7], ['Ambrose Ashworth-Vane', 7], ['', 7],
      ['YOUR TEAM', 8], ['', 7], ...G.party.map(m => [`${monName(m)}  Lv${m.lvl}`, 7]), ['', 7], ['', 7], ['Thank you for playing!', 8], ['', 7], ['The adventure continues...', 7], ['Catch them all. Find the White Hare.', 7], ['', 7], ['', 7], ['THE END', 16]];
    this.total = this.lines.reduce((s, [, sz]) => s + (sz >= 16 ? 30 : sz >= 8 ? 18 : 14), 0);
  }
  update() { const off = (NOW - this.t) / 40; if (off > this.total + 40 && (A() || Bk())) this.done(); if ((A() || Bk()) && off > 60) this.t -= 400; }
  draw() {
    R(0, 0, W, H, '#10141e');
    for (let i = 0; i < 50; i++) { const X = (i * 53) % W, Y = (i * 29 + (NOW / 60) * (1 + i % 3) * .3) % H; R(X, Y, 1, 1, i % 4 ? '#3a4a6a' : '#c8c0a0'); }
    let y = H - (NOW - this.t) / 40; const end = H / 2 - 8;
    let last = 0;
    for (const [s, sz] of this.lines) { const h = sz >= 16 ? 30 : sz >= 8 ? 18 : 14; last = y; if (s === 'THE END' && y < end) y = end; if (y > -20 && y < H + 10) txt(s, 128, y, sz >= 8 ? '#f0d890' : '#d8d8e8', sz >= 16 ? '#5a3a70' : null, sz, 'center'); y += h; }
    const i = Math.floor((NOW - this.t) / 3000) % Math.max(1, G.party.length); const m = G.party[i];
    if (m) blit(creatureSprite(m.sp, 48, { shiny: m.shiny }), 200, 140, { alpha: .35 });
  }
}

// ---------- extra music ----------
Object.assign(MUSIC, {
  city: { bpm: 112, ch: [{ n: 'C5 - E5 G5 - E5 C6 - | B5 - A5 - G5 - E5 - | F5 - A5 C6 - A5 F5 - | G5 - - - - - . . | C5 - E5 G5 - E5 C6 - | D6 - C6 - B5 - A5 - | G5 - F5 - E5 - D5 - | C5 - - - - - . .', w: 'square', v: .55 }, { n: 'C3 - G3 - E3 - G3 - | G2 - D3 - B2 - D3 - | F2 - C3 - A2 - C3 - | G2 - D3 - G2 - D3 - | C3 - G3 - E3 - G3 - | F2 - C3 - A2 - C3 - | G2 - D3 - G2 - B2 - | C3 - G3 - C3 - . -', w: 'triangle', v: 1.5 }] },
  sea: { bpm: 96, ch: [{ n: 'G4 - B4 - D5 - - - | E5 - D5 - B4 - - - | C5 - E5 - G5 - - - | F#5 - E5 - D5 - - - | G5 - - - F#5 - E5 - | D5 - B4 - G4 - - - | A4 - C5 - E5 - D5 - | G4 - - - - - . .', w: 'triangle', v: 1.2 }, { n: 'G2 - D3 - G3 - D3 - | E2 - B2 - E3 - B2 - | C3 - G3 - C4 - G3 - | D3 - A3 - D4 - A3 - | G2 - D3 - G3 - D3 - | E2 - B2 - E3 - B2 - | A2 - E3 - D3 - A3 - | G2 - D3 - G2 - . -', w: 'triangle', v: 1.3 }] },
  forest: { bpm: 100, ch: [{ n: 'E5 - - G5 A5 - G5 - | E5 - D5 - B4 - - - | D5 - - E5 G5 - E5 - | D5 - B4 - A4 - - - | E5 - - G5 A5 - B5 - | D6 - B5 - A5 - G5 - | E5 - G5 - D5 - B4 - | E5 - - - - - . .', w: 'triangle', v: 1.2 }, { n: 'E3 - B3 - E3 - B3 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - A3 - | B2 - F#3 - B2 - F#3 - | E3 - B3 - E3 - B3 - | C3 - G3 - C3 - G3 - | A2 - E3 - B2 - F#3 - | E3 - B3 - E3 - . -', w: 'triangle', v: 1.3 }] },
  cave: { bpm: 84, ch: [{ n: 'A4 - - - C5 - - - | B4 - - - G#4 - - - | A4 - - - E5 - - - | D5 - C5 - B4 - - - | F4 - - - A4 - - - | G#4 - - - E4 - - - | A4 - C5 - B4 - G#4 - | A4 - - - - - . .', w: 'triangle', v: 1.1 }, { n: 'A2 - - - A2 - - - | E2 - - - E2 - - - | A2 - - - A2 - - - | E2 - - - G#2 - - - | F2 - - - F2 - - - | E2 - - - E2 - - - | D2 - - - E2 - - - | A2 - - - . - - -', w: 'triangle', v: 1.4 }] },
  castle: { bpm: 108, ch: [{ n: 'D5 - D5 F5 A5 - G5 F5 | E5 - C5 - A4 - - - | D5 - D5 F5 A5 - Bb5 A5 | G5 - - - - - . . | Bb5 - A5 - G5 - F5 - | E5 - F5 - G5 - A5 - | D5 - F5 - E5 - C#5 - | D5 - - - - - . .', w: 'square', v: .5 }, { n: 'D3 - A3 - D3 - A3 - | C3 - G3 - A2 - E3 - | D3 - A3 - D3 - A3 - | G2 - D3 - G2 - D3 - | Bb2 - F3 - Bb2 - F3 - | C3 - G3 - C3 - G3 - | A2 - E3 - A2 - C#3 - | D3 - A3 - D3 - . -', w: 'triangle', v: 1.5 }] },
  snow: { bpm: 88, ch: [{ n: 'B5 - - - F#5 - - - | G5 - A5 - B5 - - - | E5 - - - B4 - - - | C#5 - D5 - E5 - - - | F#5 - - - E5 - D5 - | C#5 - D5 - B4 - - - | A4 - B4 - C#5 - A4 - | B4 - - - - - . .', w: 'triangle', v: 1.2 }, { n: 'B2 - F#3 - B3 - F#3 - | E3 - B3 - E3 - B3 - | G2 - D3 - G3 - D3 - | A2 - E3 - A3 - E3 - | B2 - F#3 - B3 - F#3 - | F#2 - C#3 - F#3 - C#3 - | E2 - B2 - F#2 - C#3 - | B2 - F#3 - B2 - . -', w: 'triangle', v: 1.3 }] },
  league: { bpm: 120, ch: [{ n: 'G5 - D5 - G5 - B5 - | A5 - G5 - F#5 - D5 - | E5 - C5 - E5 - G5 - | F#5 - - - D5 - - - | G5 - D5 - G5 - B5 - | C6 - B5 - A5 - G5 - | A5 - F#5 - D5 - F#5 - | G5 - - - - - . .', w: 'square', v: .5 }, { n: 'G2 - D3 - G3 - D3 - | D3 - A3 - D3 - A3 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - A3 - | G2 - D3 - G3 - D3 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - F#3 - | G2 - D3 - G2 - . -', w: 'triangle', v: 1.5 }] },
  champion: { bpm: 180, ch: [{ n: 'E5 - G5 - B5 - E6 - | D6 - B5 - G5 - B5 - | C6 - A5 - E5 - A5 - | B5 - - - F#5 - - - | E5 - G5 - B5 - E6 - | F#6 - E6 - D6 - B5 - | C6 - B5 - A5 - F#5 - | E5 - - - E5 - - -', w: 'square', v: .55 }, { n: 'E3 E4 E3 E4 E3 E4 E3 E4 | G2 G3 G2 G3 G2 G3 G2 G3 | A2 A3 A2 A3 A2 A3 A2 A3 | B2 B3 B2 B3 B2 B3 B2 B3 | E3 E4 E3 E4 E3 E4 E3 E4 | D3 D4 D3 D4 D3 D4 D3 D4 | C3 C4 C3 C4 B2 B3 B2 B3 | E3 E4 E3 E4 B2 B3 B2 B3', w: 'triangle', v: 1.5 }] },
  legend: { bpm: 72, ch: [{ n: 'D5 - - - A5 - - - | G5 - F5 - E5 - - - | F5 - - - D5 - - - | C#5 - - - A4 - - - | D5 - - - A5 - - - | Bb5 - A5 - G5 - - - | F5 - E5 - D5 - C#5 - | D5 - - - - - . .', w: 'triangle', v: 1.2 }, { n: 'D2 - - - D3 - - - | C2 - - - C3 - - - | Bb1 - - - Bb2 - - - | A1 - - - A2 - - - | D2 - - - D3 - - - | G1 - - - G2 - - - | A1 - - - A2 - - - | D2 - - - . - - -', w: 'triangle', v: 1.5 }] },
  legendbattle: { bpm: 172, ch: [{ n: 'D5 D5 . F5 . A5 . D6 | C6 - A5 - F5 - E5 - | D5 D5 . F5 . A5 . C6 | Bb5 - - - A5 - - - | G5 G5 . Bb5 . D6 . G6 | F6 - D6 - Bb5 - A5 - | G5 - F5 - E5 - C#5 - | D5 - - - D5 - - -', w: 'square', v: .55 }, { n: 'D2 D3 D2 D3 D2 D3 D2 D3 | F2 F3 F2 F3 F2 F3 F2 F3 | D2 D3 D2 D3 D2 D3 D2 D3 | Bb1 Bb2 Bb1 Bb2 A1 A2 A1 A2 | G1 G2 G1 G2 G1 G2 G1 G2 | Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 | A1 A2 A1 A2 A1 A2 A1 A2 | D2 D3 D2 D3 A1 A2 A1 A2', w: 'triangle', v: 1.5 }] },
  hall: { bpm: 90, ch: [{ n: 'C5 - E5 - G5 - C6 - | B5 - G5 - D5 - G5 - | A5 - F5 - C5 - F5 - | G5 - - - - - . . | C5 - E5 - G5 - C6 - | D6 - C6 - B5 - A5 - | G5 - E5 - D5 - B4 - | C5 - - - - - . .', w: 'triangle', v: 1.2 }, { n: 'C3 - G3 - C4 - G3 - | G2 - D3 - G3 - D3 - | F2 - C3 - F3 - C3 - | G2 - D3 - G3 - D3 - | C3 - G3 - C4 - G3 - | F2 - C3 - F3 - C3 - | G2 - D3 - G2 - D3 - | C3 - G3 - C3 - . -', w: 'triangle', v: 1.3 }] },
});