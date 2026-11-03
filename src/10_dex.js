// ---- dex ----
// ================= DEX ORDER & FINALISING =================
const DEX_ORDER = ['cindle', 'scorchvix', 'infernix', 'sproutle', 'thistlehog', 'bramblord', 'splotter', 'rivotter', 'tidalord',
  'burrabit', 'harehaste', 'pipwren', 'galewing', 'buzzlet', 'bumbellow', 'wickmoth', 'lanternmoth', 'hollowl', 'brockling', 'brockhorn', 'woolt', 'ramvolt',
  'cairnling', 'cairnback', 'mushlet', 'toadcap', 'grimrat', 'blightrat',
  'scurrip', 'squirrage', 'pucklet', 'pucksprite', 'oberwick', 'slimble', 'shellump', 'crowlet', 'ravenor', 'fawnet', 'oakhart', 'spinnet', 'arachnell',
  'plugpup', 'voltweiler', 'nutbolt', 'dynacoil', 'moggle', 'moggadon', 'zapeel', 'fulgurel',
  'gullnip', 'galegull', 'pinchet', 'clawcliff', 'jellop', 'menajelly', 'sealby', 'selkara', 'gudgle', 'leviarch', 'pearlet', 'pearlustre',
  'flitter', 'vespermaus', 'pitmole', 'colliermole', 'pebblit', 'cobblore', 'torgolem', 'coalby', 'cinderock', 'glintle', 'geodazzle', 'ichthlet', 'ichthorn', 'ambrix',
  'crawlie', 'cocoonle', 'flutterbye', 'tadlet', 'frogley', 'toadwarden', 'puffseed', 'dandelyon', 'wisplet', 'wispwarden', 'strawby', 'scarecrone',
  'saplet', 'oakling', 'greenwarden', 'kindlet', 'carefluff',
  'pageling', 'squirex', 'knightrix', 'stagnip', 'stagmajor', 'grotling', 'gargrim', 'keyhaunt', 'coppet', 'sovrain', 'kettlet', 'locomotor',
  'snowpip', 'ptarmagale', 'stoatling', 'erminess', 'frostling', 'rimeguard', 'flakelet', 'crystaflake', 'kidstone', 'billycrag', 'eaglet', 'aquilord',
  'omenkit', 'sibylynx', 'dozelet', 'snoozer', 'somnarch', 'postling', 'pillarbox', 'bullnip', 'bulwark', 'calfling', 'highhorn',
  'martip', 'nightmarten', 'grimpup', 'barghest', 'yewling', 'yewdirge', 'wreckling', 'shipwraith', 'addersnip', 'viperion', 'foalet', 'shiremane',
  'salamber', 'salamandrake', 'lindlet', 'lindwyrm', 'drakling', 'wyvernette', 'pendrake',
  'stormane', 'rimehorn', 'brandtusk', 'leywyrm', 'albionne'];
function finaliseSpecies() {
  const pre = {}; for (const id in SPECIES) { const e = SPECIES[id].evo; if (e) pre[e[1]] = id; }
  const stage = id => pre[id] ? 1 + stage(pre[id]) : 1;
  for (const id in SPECIES) {
    const sp = SPECIES[id]; sp.id = id; sp.stage = stage(id);
    if (!sp.base) sp.base = statsFrom(sp.bst, sp.prof || 'bal');
    const bst = sp.base.reduce((a, b) => a + b, 0);
    if (!sp.xp) sp.xp = Math.round(bst * (sp.legend ? .55 : .2 + .06 * (sp.stage - 1) + (sp.evo ? 0 : .04)));
    if (!sp.cr) sp.cr = sp.legend ? 25 : Math.max(25, Math.min(255, Math.round(255 - (bst - 250) * .75)));
    if (sp.sh === undefined) sp.sh = 150;
    if (!sp.keep) sp.keep = [];
  }
  // learnsets: hand-written sets keep their early moves and gain later ones; evolved forms inherit the family set
  const auto = {};
  for (const id in SPECIES) auto[id] = autoLearnset(SPECIES[id]);
  for (const id in SPECIES) {
    const sp = SPECIES[id];
    if (sp.moves) {
      const top = Math.max(...sp.moves.map(m => m[0])), best = Math.max(...sp.moves.map(m => MOVES[m[1]].pw || 0));
      const late = auto[id].filter(([l, mv]) => !sp.moves.some(m => m[1] === mv) && (l > top || (MOVES[mv].pw || 0) > best));
      late.forEach((m, i) => { if (m[0] <= top) m[0] = top + 4 + i * 5; });
      sp.moves = [...sp.moves, ...late].sort((a, b) => a[0] - b[0]);
    }
    else { let set = auto[id]; if (pre[id]) { const fam = SPECIES[pre[id]].moves || auto[pre[id]]; set = [...fam.filter(([l]) => l < 20), ...set]; } const seen = new Set(); sp.moves = set.filter(([l, mv]) => !seen.has(mv) && seen.add(mv)).sort((a, b) => a[0] - b[0]); }
  }
}
finaliseSpecies();

// ================= MONSTER INSTANCES =================
const STATN = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
let UID = 1;
function xpFor(l) { return l <= 1 ? 0 : l * l * l; }
function calcStats(m) {
  const sp = SPECIES[m.sp]; const s = {};
  STATN.forEach((k, i) => { const b = sp.base[i], iv = m.iv[i]; s[k] = k === 'hp' ? Math.floor((2 * b + iv) * m.lvl / 100) + m.lvl + 10 : Math.floor((2 * b + iv) * m.lvl / 100) + 5; });
  m.st = s; return s;
}
function newMon(sp, lvl, o = {}) {
  const m = { sp, lvl, metLvl: lvl, xp: xpFor(lvl), iv: STATN.map(() => rnd(0, 15)), status: null, shiny: o.shiny !== undefined ? o.shiny : chance((typeof G !== 'undefined' && G.bag && G.bag.shinycharm ? 3 : 1) / 200), uid: UID++ + '' + Date.now() % 100000 };
  calcStats(m); m.hp = m.st.hp;
  const learn = SPECIES[sp].moves.filter(([l]) => l <= lvl).map(x => x[1]);
  let ms = [...new Set(learn)];
  if (ms.length > 4) { const dmg = ms.filter(id => MOVES[id].c !== 'st'), st = ms.filter(id => MOVES[id].c === 'st'); ms = [...dmg.slice(-3), ...(st.length ? st.slice(-1) : dmg.slice(-4, -3))]; ms = ms.slice(-4); }
  m.moves = ms.map(id => ({ id, pp: MOVES[id].pp }));
  return m;
}
const monName = m => m.nick || SPECIES[m.sp].n;
function healMon(m) { calcStats(m); m.hp = m.st.hp; m.status = null; m.moves.forEach(mv => mv.pp = MOVES[mv.id].pp); }
for (let i = DEX_ORDER.length - 1; i >= 0; i--) if (!SPECIES[DEX_ORDER[i]]) { console.warn('missing species', DEX_ORDER[i]); DEX_ORDER.splice(i, 1); }