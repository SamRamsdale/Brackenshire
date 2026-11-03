// ---- battle ----
// ================= BATTLE =================
let BT = null;
const STATLAB = { atk: 'Attack', def: 'Defence', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
const stageMul = s => s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
const mon = side => side === 'me' ? BT.me : BT.foe;
const other = side => side === 'me' ? 'foe' : 'me';
const nm = side => side === 'me' ? monName(BT.me) : (BT.kind === 'wild' ? 'The wild ' : 'The foe\'s ') + monName(BT.foe);
function freshStages() { return { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; }
function speedOf(side) { const m = mon(side); let s = m.st.spe * stageMul(BT.stages[side].spe); if (m.status === 'par') s /= 2; return s; }

async function battle(o) {
  BT = {
    kind: o.trainer ? 'trainer' : 'wild', tr: o.trainer || null, foeParty: o.trainer ? o.trainer.party.map(([s, l]) => newMon(s, l, { shiny: false })) : [o.wild],
    fi: 0, stages: { me: freshStages(), foe: freshStages() }, participants: new Set(), evolve: new Set(), fx: [], disp: {}, escapes: 0,
    foeX: -BTG.slide, meX: BTG.slide, foeDrop: 0, meDrop: 0, foeVis: false, meVis: false, foeScale: 1, meScale: 1, foeLunge: 0, meLunge: 0, foeFlash: 0, meFlash: 0, trVis: false, trX: 0, orb: null, shake: 0, bg: o.bg || curBg(),
  };
  BT.foe = BT.foeParty[0];
  const prevMusic = curTrack;
  playMusic(o.trainer ? (o.trainer.champion ? 'champion' : o.trainer.boss ? 'boss' : 'trainer') : o.legend ? 'legendbattle' : 'battle');
  await battleTransition(!!o.trainer);
  G.scene = 'battle';
  await fadeIn(200);
  let result;
  try { result = await battleMain(); } catch (e) { console.error(e); result = 'run'; }
  await fadeOut(300);
  for (let i = UI.length - 1; i >= 0; i--) if (UI[i] instanceof ActionMenu || UI[i] instanceof MoveMenu) UI.splice(i, 1);
  G.scene = 'world';
  for (const m of G.party) if (m.status === 'slp' && m.hp > 0) { /* sleep persists */ }
  const evolveList = [...BT.evolve];
  BT = null;
  if (result !== 'lose') for (const m of evolveList) await evolveScene(m);
  playMusic(prevMusic || G.map.music);
  await fadeIn(300);
  return result;
}
async function battleTransition(trainer) {
  sfx('encounter');
  for (let i = 0; i < 3; i++) { await tween(70, t => FADE = t * .8); await tween(70, t => FADE = .8 - t * .8); }
  WIPE = 0; await tween(520, t => WIPE = t); FADE = 1; WIPE = 0;
}
let WIPE = 0;
function sendOutIdx() { return G.party.findIndex(m => m.hp > 0); }
async function battleMain() {
  const tr = BT.tr;
  // intro
  // both platforms glide in from opposite sides and settle (the foe, or its trainer, rides in on the far one)
  const slideIn = () => tween(540, t => { const k = (1 - t) ** 3; BT.foeX = -BTG.slide * k; BT.meX = BTG.slide * k; });
  if (tr) {
    BT.trVis = true; BT.trX = 0; await slideIn();
    await msg(`${tr.name} would like to battle!`);
    await tween(280, t => BT.trX = t * t * 120); BT.trVis = false;
    await msg(`${tr.name} sent out ${monName(BT.foe)}!`, { auto: 20 });
    await popIn('foe');
  } else {
    BT.foeVis = true; await slideIn();
    if (BT.foe.shiny) await sparkle('foe');
    await msg(`A wild ${monName(BT.foe)} appeared!`);
  }
  G.seen[BT.foe.sp] = 1;
  const mi = sendOutIdx(); BT.mi = mi; BT.me = G.party[mi]; BT.participants.add(mi);
  await msg(`Go, ${monName(BT.me)}!`, { auto: 20 });
  await popIn('me');
  // turns
  while (true) {
    const act = await chooseAction();
    let foeActs = true;
    if (act.type === 'run') {
      if (BT.kind === 'trainer') { await msg("No! There's no running away from a trainer battle!"); continue; }
      BT.escapes++;
      const ok = speedOf('me') >= speedOf('foe') || chance(.4 + BT.escapes * .2);
      if (ok) { sfx('back'); await msg('Got away safely!'); return 'run'; }
      await msg("Couldn't get away!");
    } else if (act.type === 'item') {
      const I = ITEMS[act.item];
      if (I.kind === 'ball') { const r = await throwOrb(act.item); if (r === 'caught') return 'caught'; }
      else { sfx('heal'); await msg(`${G.name} used ${I.n}.`); BT.disp.me = null; await animHp('me'); await msg(act.text); }
    } else if (act.type === 'switch') {
      await switchTo(act.idx, true);
    }
    if (act.type === 'move') {
      const foeMv = aiMove();
      const pm = act.slot ? MOVES[act.slot.id] : MOVES.struggle, fm = foeMv ? MOVES[foeMv.id] : MOVES.struggle;
      let first = 'me';
      const pp = pm.prio || 0, fp = fm.prio || 0;
      if (fp > pp || (fp === pp && (speedOf('foe') > speedOf('me') || (speedOf('foe') === speedOf('me') && chance(.5))))) first = 'foe';
      const order = first === 'me' ? [['me', act.slot], ['foe', foeMv]] : [['foe', foeMv], ['me', act.slot]];
      // a Beastie sent in to replace one that fainted this turn does not act (and is not attacked) until the next turn
      const acting = { me: BT.me, foe: BT.foe };
      for (const [side, slot] of order) {
        if (mon(side) !== acting[side] || mon(other(side)) !== acting[other(side)]) continue;
        if (mon(side).hp <= 0 || mon(other(side)).hp <= 0) continue;
        await doMove(side, slot);
        const r = await afterFaints(); if (r) return r;
      }
      foeActs = false;
    }
    if (foeActs && BT.foe.hp > 0 && BT.me.hp > 0) { await doMove('foe', aiMove()); const r = await afterFaints(); if (r) return r; }
    // end of turn
    for (const side of ['me', 'foe']) {
      const m = mon(side); if (m.hp <= 0) continue;
      if (m.status === 'psn' || m.status === 'brn') {
        const d = Math.max(1, Math.floor(m.st.hp / (m.status === 'psn' ? 8 : 16)));
        await flash(side, m.status === 'psn' ? '#c060e0' : '#ff8040');
        m.hp = Math.max(0, m.hp - d); await animHp(side);
        await msg(`${nm(side)} is hurt by its ${m.status === 'psn' ? 'poison' : 'burn'}!`, { auto: 40 });
        const r = await afterFaints(); if (r) return r;
      }
    }
  }
}
async function afterFaints() {
  if (BT.foe.hp <= 0 && !BT.foe._fainted) {
    BT.foe._fainted = true; sfx('faint');
    await wait(90); await tween(300, t => BT.foeDrop = t * t * 84); BT.foeVis = false;
    await msg(`${nm('foe')} fainted!`);
    await giveXP();
    if (BT.kind === 'trainer') {
      BT.fi++;
      if (BT.fi < BT.foeParty.length) {
        BT.foe = BT.foeParty[BT.fi]; BT.stages.foe = freshStages(); BT.foeDrop = 0; BT.disp.foe = null;
        BT.participants = new Set([BT.mi]);
        if (BT.me.hp > 0 && G.party.filter(m => m.hp > 0).length > 1 && await ask(`${BT.tr.name} is about to send out ${monName(BT.foe)}. Switch Beasties?`)) {
          const i = await push(new PartyScreen('battle', { prompt: 'Switch to which Beastie?' }));
          if (i >= 0 && i !== BT.mi && G.party[i].hp > 0) await switchTo(i, true);
        }
        await msg(`${BT.tr.name} sent out ${monName(BT.foe)}!`, { auto: 20 });
        G.seen[BT.foe.sp] = 1;
        await popIn('foe');
        if (BT.me.hp <= 0) return await meFainted();
        return null;
      }
      playMusic('victory');
      BT.trVis = true; await tween(400, t => BT.trX = 120 * (1 - t) ** 3);
      await msg(`You defeated ${BT.tr.name}!`);
      if (BT.tr.lose) await msg(BT.tr.lose);
      if (BT.tr.money) { G.money += BT.tr.money; await msg(`${G.name} got £${BT.tr.money} for winning!`); }
      return 'win';
    }
    playMusic('victory');
    return 'win';
  }
  if (BT.me.hp <= 0 && !BT.me._fainted) return await meFainted();
  return null;
}
async function meFainted() {
  BT.me._fainted = true; sfx('faint');
  await wait(90); await tween(300, t => BT.meDrop = t * t * 84); BT.meVis = false;
  await msg(`${monName(BT.me)} fainted!`);
  delete BT.me._fainted;
  BT.participants.delete(BT.mi);
  if (sendOutIdx() < 0) {
    await msg(`${G.name} is out of usable Beasties!`);
    const lost = Math.floor(G.money / 2); G.money -= lost;
    await msg(BT.kind === 'trainer' ? `${G.name} paid £${lost} to the winner...` : `${G.name} panicked and dropped £${lost}...`);
    await msg('...');
    return 'lose';
  }
  const i = await push(new PartyScreen('battle', { forced: true, prompt: 'Choose your next Beastie.' }));
  const idx = G.party[i] && G.party[i].hp > 0 ? i : sendOutIdx();
  await switchTo(idx, false);
  return null;
}
async function switchTo(i, withdraw) {
  if (withdraw && BT.me.hp > 0) { await msg(`${monName(BT.me)}, come back!`, { auto: 18 }); await tween(250, t => BT.meScale = 1 - t); BT.meVis = false; }
  delete BT.me._fainted;
  BT.mi = i; BT.me = G.party[i]; BT.stages.me = freshStages(); BT.meDrop = 0; BT.disp.me = null; BT.participants.add(i);
  await msg(`Go, ${monName(BT.me)}!`, { auto: 18 });
  await popIn('me');
}
async function popIn(side) {
  sfx('throw');
  BT[side + 'Vis'] = true; BT[side + 'Drop'] = 0; BT[side + 'Flash'] = 1;
  // pops out as a white silhouette, overshoots a touch, then settles
  await tween(280, t => BT[side + 'Scale'] = t < .72 ? .2 + t / .72 * .9 : 1.1 - (t - .72) / .28 * .1);
  BT[side + 'Flash'] = 0; BT[side + 'Scale'] = 1;
  const P0 = BTG[side], gy = P0.y + 2;
  for (let i = 0; i < 6; i++) BT.fx.push({ x: P0.x + (i - 2.5) * 9, y: gy, vx: (i - 2.5) * .5, vy: -.5 - (i % 2) * .3, life: 11 + (i % 3) * 2, col: i % 2 ? '#fff8c0' : '#ffffff', s: 2 });
  if (mon(side).shiny) await sparkle(side);
}
async function sparkle(side) {
  sfx('shiny'); const c = BTG[side].c;
  for (let i = 0; i < 10; i++) BT.fx.push({ x: c[0] + Math.cos(i) * 20, y: c[1] + Math.sin(i * 1.7) * 20, vx: 0, vy: -.2, life: 40 + i * 3, col: i % 2 ? '#fff8a0' : '#ffffff', s: 3, star: 1 });
  await wait(600);
}
// two quick flashes plus a short recoil jolt (drawn by drawMonB)
async function flash(side, col = '#ffffff') { BT[side + 'Hit'] = NOW; for (let i = 0; i < 2; i++) { BT[side + 'Flash'] = col; await wait(70); BT[side + 'Flash'] = 0; await wait(55); } }
async function animHp(side) {
  const m = mon(side); const from = BT.disp[side] ?? m.hp; const to = m.hp;
  if (from === to) { BT.disp[side] = to; return; }
  const ms = Math.min(700, 150 + Math.abs(from - to) * 12);
  await tween(ms, t => BT.disp[side] = from + (to - from) * t); BT.disp[side] = to;
}
function aiMove() {
  const f = BT.foe; const us = f.moves.filter(m => m.pp > 0);
  if (!us.length) return null;
  if (BT.kind === 'wild') return us[rnd(0, us.length - 1)];
  let best = null, bs = -1;
  for (const s of us) {
    const M = MOVES[s.id]; let sc;
    if (M.c === 'st') {
      if (M.fx.heal) sc = f.hp < f.st.hp * .45 ? 75 : 0;
      else if (M.fx.st) sc = BT.me.status ? 0 : 45;
      else if (M.fx.self) sc = BT.stages.foe[selfList(M.fx.self)[0][0]] >= 2 ? 0 : 24;
      else sc = BT.stages.me[M.fx.stat[0]] <= -2 ? 0 : 18;
    } else sc = M.pw * eff(M.t, SPECIES[BT.me.sp].types) * (SPECIES[f.sp].types.includes(M.t) ? 1.5 : 1) * (M.ac || 100) / 100;
    sc *= .75 + Math.random() * .5;
    if (sc > bs) { bs = sc; best = s; }
  }
  return best;
}
const selfList = x => Array.isArray(x[0]) ? x : [x];
async function doMove(side, slot) {
  const user = mon(side), tgt = mon(other(side)), ts = other(side);
  if (user.status === 'slp') {
    user.slp = (user.slp || 1) - 1;
    if (user.slp > 0) { await msg(`${nm(side)} is fast asleep.`, { auto: 40 }); return; }
    user.status = null; await msg(`${nm(side)} woke up!`, { auto: 40 });
  }
  if (user.status === 'par' && chance(.25)) { await msg(`${nm(side)} is paralysed! It can't move!`, { auto: 40 }); return; }
  const id = slot ? slot.id : 'struggle', M = MOVES[id];
  if (slot) slot.pp = Math.max(0, slot.pp - 1);
  await msg(`${nm(side)} used ${M.n}!`, { auto: 26 });
  if (M.ac && Math.random() * 100 >= M.ac * stageMul(0)) { await msg(`${nm(side)}'s attack missed!`, { auto: 40 }); return; }
  if (M.c === 'st') {
    await statusAnim(M, side);
    const fx = M.fx;
    if (fx.heal) {
      if (user.hp >= user.st.hp) { await msg(`${nm(side)}'s HP is already full!`, { auto: 40 }); return; }
      BT.disp[side] = user.hp; user.hp = Math.min(user.st.hp, user.hp + Math.ceil(user.st.hp * fx.heal)); sfx('heal'); await animHp(side);
      await msg(`${nm(side)} restored its health!`, { auto: 40 });
    } else if (fx.self) { for (const [st, n] of selfList(fx.self)) await changeStat(side, st, n); }
    else if (fx.stat) await changeStat(ts, fx.stat[0], fx.stat[1]);
    else if (fx.st) await inflict(ts, fx.st, true);
    return;
  }
  const e = eff(M.t, SPECIES[tgt.sp].types);
  if (e === 0) { await msg(`It doesn't affect ${nm(ts).replace(/^The/, 'the')}...`); return; }
  await moveAnim(M, side);
  const phys = M.c === 'p';
  let A = (phys ? user.st.atk : user.st.spa) * stageMul(BT.stages[side][phys ? 'atk' : 'spa']);
  const D = (phys ? tgt.st.def : tgt.st.spd) * stageMul(BT.stages[ts][phys ? 'def' : 'spd']);
  if (phys && user.status === 'brn') A *= .5;
  const crit = chance(M.fx && M.fx.hc ? 1 / 8 : 1 / 16);
  let d = Math.floor(Math.floor(Math.floor(2 * user.lvl / 5 + 2) * M.pw * A / D) / 50) + 2;
  if (crit) d = Math.floor(d * 1.5);
  if (SPECIES[user.sp].types.includes(M.t)) d = Math.floor(d * 1.5);
  d = Math.floor(d * e * (85 + Math.random() * 15) / 100);
  d = Math.max(1, Math.min(d, tgt.hp));
  sfx(e > 1 ? 'super' : e < 1 ? 'weak' : 'hit');
  if (e > 1) BT.shake = 10;
  const fl = flash(ts);
  BT.disp[ts] = BT.disp[ts] ?? tgt.hp;
  tgt.hp -= d;
  await Promise.all([fl, animHp(ts)]);
  if (crit) await msg('A critical hit!', { auto: 40 });
  if (e > 1) await msg("It's super effective!", { auto: 40 });
  else if (e < 1) await msg("It's not very effective...", { auto: 40 });
  if (M.fx && M.fx.drain && user.hp < user.st.hp) { const h = Math.max(1, Math.floor(d * M.fx.drain)); BT.disp[side] = user.hp; user.hp = Math.min(user.st.hp, user.hp + h); await animHp(side); await msg(`${nm(ts).replace(/^The/, 'The')} had its energy drained!`, { auto: 40 }); }
  if (M.fx && M.fx.recoil) { BT.disp[side] = user.hp; user.hp = Math.max(0, user.hp - Math.max(1, Math.floor(d * M.fx.recoil))); await animHp(side); await msg(`${nm(side)} is damaged by recoil!`, { auto: 40 }); }
  if (tgt.hp > 0 && M.fx) {
    if (M.fx.st && chance(M.fx.ch)) await inflict(ts, M.fx.st, false);
    if (M.fx.stat && chance(M.fx.ch || 1)) await changeStat(ts, M.fx.stat[0], M.fx.stat[1]);
    if (M.fx.self && user.hp > 0 && chance(M.fx.ch || 1)) for (const [st, n] of selfList(M.fx.self)) await changeStat(side, st, n);
  }
}
async function inflict(side, st, loud) {
  const m = mon(side), types = SPECIES[m.sp].types;
  const immune = (st === 'brn' && types.includes('Fire')) || (st === 'psn' && types.includes('Poison')) || (st === 'par' && types.includes('Electric'));
  if (m.status || m.hp <= 0 || immune) { if (loud) await msg('But it failed!', { auto: 40 }); return; }
  m.status = st; if (st === 'slp') m.slp = rnd(2, 4);
  await flash(side, { psn: '#c060e0', brn: '#ff8040', par: '#ffe040', slp: '#a0a0c0' }[st]);
  await msg(`${nm(side)} ${{ psn: 'was poisoned!', brn: 'was burned!', par: 'is paralysed! It may be unable to move!', slp: 'fell asleep!' }[st]}`, { auto: 50 });
}
async function changeStat(side, stat, n) {
  const s = BT.stages[side], old = s[stat]; s[stat] = Math.max(-6, Math.min(6, old + n));
  if (s[stat] === old) { await msg(`${nm(side)}'s ${STATLAB[stat]} won't go any ${n > 0 ? 'higher' : 'lower'}!`, { auto: 40 }); return; }
  sfx(n > 0 ? 'stat' : 'statdown');
  const c = BTG[side].c;   // a tidy column of arrows: rising for a boost, sinking for a drop
  for (let i = 0; i < 10; i++) BT.fx.push({ x: c[0] - 24 + (i % 5) * 12, y: c[1] + (n > 0 ? 22 : -22) + (i >= 5 ? (n > 0 ? 12 : -12) : 0) + (i % 2) * 5, vx: 0, vy: n > 0 ? -1.3 : 1.3, life: 30, col: n > 0 ? '#ff9a50' : '#6aa0ff', s: 2, arrow: n > 0 ? 1 : -1 });
  await wait(450);
  await msg(`${nm(side)}'s ${STATLAB[stat]} ${n > 0 ? (n > 1 ? 'rose sharply!' : 'rose!') : (n < -1 ? 'harshly fell!' : 'fell!')}`, { auto: 40 });
}
const FXCOL = { Ice: ['#a8f0f8', '#ffffff'], Fighting: ['#e05030', '#ffb080'], Psychic: ['#f070b0', '#ffd0f0'], Dragon: ['#8050f0', '#c0a8ff'], Dark: ['#4a3a50', '#a08890'], Steel: ['#c0c8d8', '#ffffff'], Fairy: ['#ffb0d0', '#ffffff'], Fire: ['#ff7030', '#ffd040'], Water: ['#4890f0', '#c8e8ff'], Grass: ['#58c040', '#a8f080'], Electric: ['#ffe040', '#ffffff'], Bug: ['#a8c020', '#e0f080'], Flying: ['#ffffff', '#c8d8ff'], Rock: ['#a08858', '#d0c098'], Ground: ['#b08850', '#e0c080'], Poison: ['#a040c0', '#e090f0'], Ghost: ['#6a4aa0', '#b098f0'], Normal: ['#ffffff', '#f0f0c0'] };
function burst(x, y, t, n = 12) { const [a, b] = FXCOL[t]; for (let i = 0; i < n; i++) { const ang = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 2.5; BT.fx.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 18 + rnd(0, 10), col: i % 2 ? a : b, s: rnd(2, 4) }); } }
async function moveAnim(M, side) {
  const from = BTG[side].c, to = BTG[other(side)].c;
  if (M.c === 'p') { await tween(160, t => BT[side + 'Lunge'] = Math.sin(t * Math.PI) * 14); burst(to[0], to[1], M.t, 14); }
  else {
    const [a, b] = FXCOL[M.t];
    for (let i = 0; i < 9; i++) { const k = i; setTimeout(() => { if (!BT) return; const dx = to[0] - from[0], dy = to[1] - from[1]; BT.fx.push({ x: from[0], y: from[1], vx: dx / 22, vy: dy / 22 + (k % 3 - 1) * .3, life: 22, col: k % 2 ? a : b, s: 3 + (k % 2) }); }, i * 35); }
    await wait(560); burst(to[0], to[1], M.t, 16);
  }
}
async function statusAnim(M, side) {
  const tgt = M.fx.self || M.fx.heal ? side : other(side); const c = BTG[tgt].c;
  const [a, b] = FXCOL[M.t];
  for (let i = 0; i < 10; i++) BT.fx.push({ x: c[0] + Math.cos(i / 10 * 6.28) * 22, y: c[1] + Math.sin(i / 10 * 6.28) * 16, vx: -Math.cos(i / 10 * 6.28) * .8, vy: -Math.sin(i / 10 * 6.28) * .6, life: 26, col: i % 2 ? a : b, s: 3 });
  await wait(380);
}
// ---------- action choice ----------
function bigButton(x, y, w, h, c, sel) {
  const o = sel ? '#ffffff' : '#1e2230';
  R(x + 2, y, w - 4, h, o); R(x, y + 2, w, h - 4, o); R(x + 1, y + 1, w - 2, h - 2, o);
  const f = sel ? lt(c, .12) : c;
  R(x + 2, y + 1, w - 4, h - 2, f); R(x + 1, y + 2, w - 2, h - 4, f);
  R(x + 2, y + 1, w - 4, Math.floor(h / 2) - 1, lt(f, .18)); R(x + 2, y + 1, w - 4, 1, lt(f, .5));
  R(x + 2, y + h - 3, w - 4, 2, dk(f, .22));
  if (sel) { const b = Math.floor(NOW / 250) % 2; R(x - 2 - b, y + h / 2 - 3, 2, 6, '#ffffff'); R(x - 3 - b, y + h / 2 - 2, 1, 4, '#ffffff'); }
}
class ActionMenu {
  constructor() { this.i = 0; }
  update() {
    if (!BT) { this.done(-1); return; }
    if (pressed.guide) { sfx('select'); push(new TypeGuide(BT)); return; }
    if (dirPressed('left') || dirPressed('right')) { this.i ^= 1; sfx('blip'); }
    if (dirPressed('up') || dirPressed('down')) { this.i ^= 2; sfx('blip'); }
    if (A()) { sfx('select'); this.done(this.i); }
  }
  draw() {
    if (!BT) return;
    frame(2, 144, 128, 46, 'msg'); txt('What will', 12, 150); txt(`${monName(BT.me)} do?`, 12, 164); txt('C: TYPE GUIDE', 12, 179, '#8a92b0', null, 5.5);
    const cols = [['FIGHT', '#e0544a'], ['BAG', '#e8a830'], ['TEAM', '#44a862'], ['RUN', '#4a80d8']];
    cols.forEach(([s2, c], k) => { const x = 133 + (k % 2) * 61, y = 145 + Math.floor(k / 2) * 23; hot(x, y, 59, 21, () => { this.i = k; }); bigButton(x, y, 59, 21, c, k === this.i); txt(s2, x + 30, y + 6, '#ffffff', dk(c, .5), 8, 'center'); });
  }

}
class MoveMenu {
  constructor() { this.i = 0; }
  update() {
    if (!BT) { this.done(-1); return; }
    if (pressed.guide) { sfx('select'); push(new TypeGuide(BT)); return; }
    const n = BT.me.moves.length;
    if (dirPressed('left') || dirPressed('right')) { const j = this.i ^ 1; if (j < n) { this.i = j; sfx('blip'); } }
    if (dirPressed('up') || dirPressed('down')) { const j = this.i ^ 2; if (j < n) { this.i = j; sfx('blip'); } }
    if (Bk()) { sfx('back'); this.done(-1); }
    if (A()) { if (BT.me.moves[this.i].pp <= 0) { sfx('bump'); this.nopp = 40; return; } sfx('select'); this.done(this.i); }
    if (this.nopp) this.nopp--;
  }
  draw() {
    if (!BT) return;
    R(0, 142, W, 50, '#2c3242'); hot(0, 0, W, 142, null, () => { pressed.b = true; });   // clicking the scene goes back
    BT.me.moves.forEach((mv, k) => {
      const M = MOVES[mv.id], x = 3 + (k % 2) * 126, y = 145 + Math.floor(k / 2) * 23, c = mv.pp ? TCOL[M.t] : '#9a9aa0';
      hot(x, y, 124, 21, () => { this.i = k; });
      bigButton(x, y, 124, 21, mix(c, '#ffffff', .15), k === this.i);
      txt(M.n, x + 7, y + 3, '#ffffff', dk(c, .55), 8);
      txt(M.t, x + 7, y + 13, lt(c, .75), null, 5.5);
      txt(`PP ${mv.pp}/${M.pp}`, x + 118, y + 13, mv.pp / M.pp < .25 ? '#ffe0a0' : '#ffffff', null, 5.5, 'right');
      if (M.c !== 'st') { const e = eff(M.t, SPECIES[BT.foe.sp].types); const lab = e > 1 ? 'SUPER ' + multLabel(e) : e === 0 ? 'NO EFFECT' : e < 1 ? 'WEAK ' + multLabel(e) : ''; if (lab) { const w2 = tw(lab, 5.5) + 6; pill(x + 118 - w2, y + 3, w2, 8, e > 1 ? '#f0c030' : e === 0 ? '#303038' : '#5a6a90'); txt(lab, x + 118 - w2 / 2, y + 5, e > 1 ? '#402800' : '#ffffff', null, 5.5, 'center'); } }
    });
    if (this.nopp) { frame(70, 118, 116, 22, 'msg'); txt('No PP left!', 128, 124, '#383840', '#d0ccc0', 8, 'center'); }
  }

}
async function chooseAction() {
  while (true) {
    const a = await push(new ActionMenu());
    if (a === 0) {
      if (!BT.me.moves.some(m => m.pp > 0)) { await msg(`${monName(BT.me)} has no moves left!`); return { type: 'move', slot: null }; }
      const i = await push(new MoveMenu()); if (i >= 0) return { type: 'move', slot: BT.me.moves[i] };
    } else if (a === 1) {
      const r = await push(new BagScreen('battle'));
      if (r && r.item) { if (ITEMS[r.item].kind === 'ball' && BT.kind === 'trainer') { await msg("You can't catch another trainer's Beastie!"); continue; } return { type: 'item', item: r.item, text: r.text }; }
    } else if (a === 2) {
      const i = await push(new PartyScreen('battle'));
      if (i >= 0) { if (i === BT.mi) await msg(`${monName(BT.me)} is already out!`); else if (G.party[i].hp <= 0) await msg(`${monName(G.party[i])} has no energy left to battle!`); else return { type: 'switch', idx: i }; }
    } else if (a === 3) return { type: 'run' };
  }
}
// ---------- catching ----------
async function throwOrb(k) {
  G.bag[k]--; const I = ITEMS[k];
  await msg(`${G.name} threw a ${I.n}!`, { auto: 16 });
  sfx('throw');
  const OX = BTG.foe.x, OY = BTG.foe.c[1] - 4, OG = BTG.foe.y - 3;   // the orb flies to the foe, then drops onto its platform
  BT.orb = { x: 40, y: 136, col: I.col, rot: 0 };
  await tween(520, t => { BT.orb.x = 40 + (OX - 40) * t; BT.orb.y = 136 + (OY - 136) * t - Math.sin(t * Math.PI) * 52; BT.orb.rot = t * 12; });
  BT.foeFlash = '#ffffff'; await tween(240, t => BT.foeScale = 1 - t); BT.foeVis = false; BT.foeFlash = 0;
  await tween(220, t => BT.orb.y = OY + t * t * (OG - OY)); BT.orb.rot = 0;
  const m = BT.foe, rate = SPECIES[m.sp].cr, bonus = { slp: 2, par: 1.5, psn: 1.5, brn: 1.5 }[m.status] || 1;
  const a = ((3 * m.st.hp - 2 * m.hp) * rate * I.rate) / (3 * m.st.hp) * bonus;
  let shakes = 0;
  if (a >= 255) shakes = 4; else { const b = 1048560 / Math.sqrt(Math.sqrt(16711680 / a)); while (shakes < 4 && Math.random() * 65536 < b) shakes++; }
  for (let i = 0; i < Math.min(3, shakes); i++) { await wait(350); sfx('shake'); await tween(300, t => BT.orb.rot = Math.sin(t * Math.PI * 2) * .5); BT.orb.rot = 0; }
  await wait(350);
  if (shakes >= 4) {
    sfx('catch'); BT.orb.dim = true;
    for (let i = 0; i < 6; i++) BT.fx.push({ x: OX, y: OG, vx: (i - 2.5) * .7, vy: -1.5, life: 30, col: '#fff8a0', s: 3, star: 1 });
    playMusic('victory');
    await msg(`Gotcha! ${monName(m)} was caught!`);
    G.caught[m.sp] = 1; G.seen[m.sp] = 1;
    await giveXP();
    const fresh = { ...m }; delete fresh._fainted; fresh.status = m.status;
    if (G.party.length < 6) { G.party.push(fresh); }
    else { G.box.push(fresh); await msg(`${monName(m)} was sent to Wayhouse storage.`); }
    if (!G.flags.firstCatch) { G.flags.firstCatch = 1; await msg(`${monName(m)}'s details were added to the Field Journal.`); }
    return 'caught';
  }
  sfx('break'); BT.orb = null; BT.foeVis = true; BT.foeFlash = '#ffffff';
  await tween(200, t => BT.foeScale = t); BT.foeScale = 1; BT.foeFlash = 0;
  await msg(['Oh no! It broke free!', 'Aww! It appeared to be caught!', 'Argh! Almost had it!', 'Gah! It was so close, too!'][Math.min(3, shakes)]);
  return 'free';
}
// ---------- XP, levels, moves ----------
async function giveXP() {
  const f = BT.foe; const gain = Math.floor(SPECIES[f.sp].xp * f.lvl / 7 * (BT.kind === 'trainer' ? 1.5 : 1) * (G.bag.expcharm ? 1.5 : 1));
  const parts = [...BT.participants].map(i => G.party[i]).filter(m => m && m.hp > 0);
  if (!parts.length) return;
  const each = Math.max(1, Math.floor(gain / parts.length));
  for (const m of parts) { await msg(`${monName(m)} gained ${each} EXP. Points!`, { auto: 40 }); await addXP(m, each); }
}
async function addXP(m, n) {
  let left = n;
  while (left > 0 && m.lvl < 100) {
    const need = xpFor(m.lvl + 1) - m.xp, step = Math.min(need, left);
    const from = m.xp; m.xp += step; left -= step;
    if (BT && m === BT.me) await tween(Math.min(600, 120 + step * 4), t => BT.xpDisp = from + (m.xp - from) * t);
    if (BT) BT.xpDisp = null;
    if (m.xp >= xpFor(m.lvl + 1)) await levelUp(m);
  }
}
class LevelPanel {
  constructor(a, b) { this.a = a; this.b = b; this.page = 0; }
  update() { if (A() || Bk()) { if (this.page === 0) { this.page = 1; sfx('blip'); } else this.done(); } }
  draw() {
    frame(150, 20, 104, 112, 'panel');
    const lab = { hp: 'Max HP', atk: 'Attack', def: 'Defence', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
    STATN.forEach((k, j) => { txt(lab[k], 158, 28 + j * 16, '#383840', null, 7); txt(this.page ? String(this.b[k]) : '+' + (this.b[k] - this.a[k]), 246, 28 + j * 16, '#383840', null, 7, 'right'); });
  }
}
async function levelUp(m) {
  const old = { ...m.st }; m.lvl++; calcStats(m); if (m.hp > 0) m.hp = Math.min(m.st.hp, m.hp + m.st.hp - old.hp);
  sfx('levelup');
  if (BT && m === BT.me) BT.disp.me = m.hp;
  await msg(`${monName(m)} grew to Lv. ${m.lvl}!`);
  await push(new LevelPanel(old, m.st));
  for (const [l, id] of SPECIES[m.sp].moves) if (l === m.lvl) await learnMove(m, id);
  const ev = SPECIES[m.sp].evo; if (ev && m.lvl >= ev[0] && BT) BT.evolve.add(m);
}
async function learnMove(m, id) {
  if (m.moves.find(x => x.id === id)) return;
  const M = MOVES[id];
  if (m.moves.length < 4) { m.moves.push({ id, pp: M.pp }); sfx('item'); await msg(`${monName(m)} learned ${M.n}!`); return; }
  await msg(`${monName(m)} wants to learn ${M.n}, but it already knows four moves.`);
  while (true) {
    if (await ask(`Forget a move to make room for ${M.n}?`)) {
      const r = await choose([...m.moves.map(x => MOVES[x.id].n), 'Keep old moves'], { x: 140, y: 40 });
      if (r >= 0 && r < 4) { const old = MOVES[m.moves[r].id].n; m.moves[r] = { id, pp: M.pp }; await msg(`1, 2 and... Poof! ${monName(m)} forgot ${old} and learned ${M.n}!`); return; }
    }
    if (await ask(`Stop trying to teach ${M.n}?`)) { await msg(`${monName(m)} did not learn ${M.n}.`); return; }
  }
}
// ---------- evolution ----------
let EVO = null;
async function evolveScene(m) {
  const from = m.sp, to = SPECIES[m.sp].evo[1];
  if (!SPECIES[to]) return;
  G.scene = 'evo'; EVO = { from, to, shiny: m.shiny, t: 0, show: 'from', glow: 0 };
  await fadeIn(300);
  await msg(`What? ${monName(m)} is evolving!`);
  playMusic('evolve'); sfx('evolve');
  let cancelled = false;
  const dur = 3200; const t0 = NOW;
  while (NOW - t0 < dur) {
    const p = (NOW - t0) / dur; EVO.glow = Math.min(1, p * 3);
    const period = 420 * (1 - p) + 60; EVO.show = Math.floor((NOW - t0) / period) % 2 ? 'to' : 'from';
    if (Bk()) { cancelled = true; break; }
    await nextFrame();
  }
  if (cancelled) { EVO.show = 'from'; EVO.glow = 0; await msg(`Huh? ${monName(m)} stopped evolving!`); }
  else {
    EVO.show = 'to'; EVO.glow = 1; await tween(500, t => EVO.glow = 1 - t);
    const oldName = monName(m), old = { ...m.st };
    m.sp = to; calcStats(m); if (m.hp > 0) m.hp = Math.min(m.st.hp, m.hp + m.st.hp - old.hp);
    G.seen[to] = 1; G.caught[to] = 1;
    sfx('catch'); playMusic('victory');
    await msg(`Congratulations! Your ${oldName} evolved into ${SPECIES[to].n}!`);
    for (const [l, id] of SPECIES[to].moves) if (l === m.lvl) await learnMove(m, id);
  }
  await fadeOut(300); EVO = null; G.scene = 'world';
}
function drawEvo() {
  R(0, 0, W, H, '#1a1830');
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28 + NOW / 900; R(128 + Math.cos(a) * (70 + Math.sin(NOW / 300 + i) * 10), 70 + Math.sin(a) * 50, 2, 2, i % 2 ? '#8a7ad8' : '#f8e8a8'); }
  const img = creatureSprite(EVO.show === 'from' ? EVO.from : EVO.to, 64, { shiny: EVO.shiny });
  blit(img, 96, 38); if (EVO.glow > 0) blit(tinted(img, '#ffffff'), 96, 38, { alpha: EVO.glow });
}
// ---------- drawing ----------
function curBg() {
  const m = G.map;
  if (m.id === 'gym') return 'gym';
  if (m.outdoor) return m.ground === 'moor' ? 'moor' : m.ground === 'snow' ? 'snow' : m.ground === 'forest' ? 'forest' : m.music === 'sea' ? 'sea' : 'field';
  if (m.ground === 'cave') return 'cave';
  const FL = { wood: '#d8a868', tile: '#e4e8ee', metal: '#9aa2b0', stone: '#948e82', ice: '#c8e8f8', moss: '#6e9e52', carpet: '#a83a3a', carpetb: '#3a58a8', carpetp: '#6a3a98', carpetg: '#3a7a4a', carpeto: '#2a2a38', carpety: '#b8902a' };
  return 'hall|' + (m.wall || '#dfe6ee') + '|' + (FL[m.floor] || '#e8ecf2');
}
const BGCACHE = {};
function battleTheme(bg, tod) {
  const night = tod === 'night', eve = tod === 'evening', morn = tod === 'morning';
  if (bg === 'gym') return { kind: 'gym' };
  if (bg === 'indoor') return { kind: 'hall', wall: '#dfe6ee', floor: '#e8ecf2' };
  if (bg.startsWith('hall|')) { const [, wall, floor] = bg.split('|'); return { kind: 'hall', wall, floor }; }
  if (bg === 'cave') return { kind: 'cave' };
  const moor = bg === 'moor', snow = bg === 'snow', sea = bg === 'sea', forest = bg === 'forest';
  const sky = night ? ['#101838', '#34457a'] : eve ? ['#e87860', '#f8d8a0'] : morn ? ['#98c8f0', '#fce8cc'] : snow ? ['#9ab8d8', '#e8f0f8'] : ['#5ca0e8', '#cce8f8'];
  const base = moor ? { far: '#a898b8', trees: '#7a6a8a', g: ['#9cb06c', '#90a462'], plat: ['#b8c47e', '#8a9a5a', '#6a6a48', '#d0dc9a'] }
    : snow ? { far: '#c8d8ea', trees: '#5a7a90', g: ['#eef4fa', '#dfe9f3'], plat: ['#ffffff', '#c8d8e8', '#98b0c8', '#ffffff'] }
    : sea ? { far: '#5aa0e8', trees: '#3a80d0', g: ['#f0dca8', '#e6d098'], plat: ['#f8e8b8', '#d8c088', '#b09860', '#fff4d0'] }
    : forest ? { far: '#5a8a5a', trees: '#2e5a36', g: ['#6e9e52', '#62924a'], plat: ['#8ab86a', '#62924a', '#44683a', '#a8d488'] }
    : { far: '#8ec0b0', trees: '#4a8a58', g: ['#8ccc68', '#80c05e'], plat: ['#a4dc7c', '#78b458', '#5a8040', '#c4f0a0'] };
  const tint = night ? c => mix(c, '#1a2448', .55) : eve ? c => mix(c, '#c07850', .25) : c => c;
  return { kind: 'field', moor, snow, sea, night, sky, far: tint(base.far), trees: tint(base.trees), g: base.g.map(tint), plat: base.plat.map(tint) };
}
function battleBg(bg, tod) {
  const key = bg + tod; if (BGCACHE[key]) return BGCACHE[key];
  const th = battleTheme(bg, tod); const [c, x] = mk(W, H); const { r, p } = pctx(x);
  if (th.kind === 'field') {
    const HZ = 78, steps = 6, pal = []; for (let i = 0; i <= steps; i++) pal.push(mix(th.sky[0], th.sky[1], i / steps));
    for (let y = 0; y < HZ; y++) for (let X = 0; X < W; X++) { const t = y / HZ * steps + ((X + y) & 1 ? .22 : -.22); p(X, y, pal[Math.max(0, Math.min(steps, Math.floor(t)))]); }
    if (th.night) { for (let i = 0; i < 46; i++) { const X = Math.floor(hash(i, 1, 5) * W), Y = Math.floor(hash(1, i, 7) * 60); p(X, Y, i % 5 ? '#c8d4ff' : '#fff8d0'); if (i % 9 === 0) { p(X - 1, Y, '#6a78b0'); p(X + 1, Y, '#6a78b0'); p(X, Y - 1, '#6a78b0'); p(X, Y + 1, '#6a78b0'); } }
      for (let Y = 0; Y < 20; Y++) for (let X = 0; X < 20; X++) { const d = (X - 10) ** 2 + (Y - 10) ** 2, d2 = (X - 14) ** 2 + (Y - 7) ** 2; if (d < 64 && d2 > 42) p(200 + X, 8 + Y, d < 30 ? '#fff4d8' : '#e8dcb8'); } }
    // far hills
    for (let X = 0; X < W; X++) { const h = th.sea ? 14 : 20 + Math.sin(X / 37 + 1) * 7 + Math.sin(X / 13) * 2.5; r(X, Math.round(HZ - h), 1, Math.ceil(h), th.far); p(X, Math.round(HZ - h), lt(th.far, .25)); if (th.sea && (X * 7) % 23 < 4) p(X, HZ - 6 - (X % 3) * 3, lt(th.far, .4)); }
    if (th.moor) for (const [sx, sh] of [[196, 15], [205, 18], [215, 20], [225, 17], [234, 14]]) { const y0 = Math.round(HZ - 20 - Math.sin(sx / 37 + 1) * 7) - sh + 6; r(sx, y0, 5, sh, th.night ? '#20283c' : '#6a6478'); r(sx, y0, 1, sh, th.night ? '#2c3650' : '#847e92'); r(sx + 1, y0 - 1, 3, 1, th.night ? '#20283c' : '#6a6478'); }
    // tree line
    if (!th.sea) for (let i = -1; i < 30; i++) { const tx = i * 9 + Math.floor(hash(i, 3, 1) * 5), tr = 5 + Math.floor(hash(i, 4, 2) * 3), ty = HZ - 2 - Math.floor(hash(i, 5, 3) * 4);
      for (let Y = -tr; Y <= tr + 3; Y++) for (let X = -tr; X <= tr; X++) { if (X * X + Y * Y <= tr * tr || (Y > 0 && Math.abs(X) <= tr)) p(tx + X, ty + Y, (X + Y < -tr * .6) ? lt(th.trees, .18) : (X - Y > tr * .5) ? dk(th.trees, .15) : th.trees); } }
    // meadow with perspective stripes
    r(0, HZ, W, H - HZ, th.g[0]);
    let y = HZ + 2, k = 2, alt = 0; while (y < H) { if (alt) r(0, y, W, k, th.g[1]); y += k; k = Math.ceil(k * 1.3); alt ^= 1; }
    for (let i = 0; i < 60; i++) { const X = Math.floor(hash(i, 9, 1) * W), Y = HZ + 4 + Math.floor(hash(9, i, 2) * (H - HZ - 4)); const s2 = Y > 130 ? 2 : 1; p(X, Y, dk(th.g[0], .18)); p(X + s2, Y - s2, dk(th.g[0], .18)); p(X + 2 * s2, Y, dk(th.g[0], .18)); }
    r(0, HZ, W, 1, dk(th.g[0], .12));
  } else if (th.kind === 'gym') {
    r(0, 0, W, 86, '#f2c860');
    for (let row = 0; row < 8; row++) for (let col = -1; col < 20; col++) { const hx = col * 16 + (row % 2) * 8, hy = row * 12;
      for (let a = 0; a < 6; a++) { const a1 = Math.PI / 3 * a, a2 = a1 + Math.PI / 3; for (let t = 0; t <= 1; t += .1) p(Math.round(hx + Math.cos(a1 + (a2 - a1) * t) * 7.5), Math.round(hy + Math.sin(a1 + (a2 - a1) * t) * 6.5), '#d8a440'); } }
    for (let y = 0; y < 86; y += 2) r(0, y, W, 1, 'rgba(255,240,200,.08)');
    r(0, 86, W, 4, '#9a6a28'); r(0, 86, W, 1, '#c89048');
    r(0, 90, W, H - 90, '#d8a458'); let y = 92, k = 3; while (y < H) { r(0, y, W, 1, '#b8843c'); y += k; k = Math.ceil(k * 1.35); }
    for (let X = -60; X < W + 60; X += 22) for (let y2 = 90; y2 < H; y2++) p(Math.round(128 + (X - 128) * (1 + (y2 - 90) / 60)), y2, '#c4904a');
  } else if (th.kind === 'cave') {
    r(0, 0, W, H, '#2e2620');
    for (let i = 0; i < 26; i++) { const X = Math.floor(hash(i, 2, 9) * W), len = 8 + Math.floor(hash(2, i, 9) * 22); for (let y = 0; y < len; y++) { const w2 = Math.max(1, Math.round((1 - y / len) * 5)); r(X - w2, y, w2 * 2, 1, y < 2 ? '#5a4c3e' : '#453a30'); } }
    for (let i = 0; i < 40; i++) p(Math.floor(hash(i, 7, 3) * W), 10 + Math.floor(hash(7, i, 3) * 60), i % 4 ? '#3e342c' : '#7affe0');
    r(0, 76, W, H - 76, '#5a4c3e'); let y = 78, k = 2; while (y < H) { r(0, y, W, 1, '#4a3e32'); y += k; k = Math.ceil(k * 1.3); }
    for (let i = 0; i < 30; i++) { const X = Math.floor(hash(i, 4, 1) * W), Y = 80 + Math.floor(hash(4, i, 1) * (H - 80)); r(X, Y, 2, 1, '#6a5c4c'); }
  } else {
    const wall = th.wall || '#dfe6ee', fl = th.floor || '#e8ecf2';
    r(0, 0, W, 80, wall); for (let X = 0; X < W; X += 12) r(X, 0, 1, 66, dk(wall, .06)); r(0, 64, W, 16, dk(wall, .3)); r(0, 64, W, 2, dk(wall, .18)); r(0, 78, W, 2, dk(wall, .45));
    for (let y = 80; y < H; y++) for (let X = 0; X < W; X++) { const sc = 1 + (y - 80) / 40, u = Math.floor(((X - 128) / sc + 512) / 14), v2 = Math.floor(Math.log(y - 78) * 3); p(X, y, (u + v2) % 2 ? lt(fl, .06) : dk(fl, .06)); }
  }
  BGCACHE[key] = c; return c;
}
function platformSprite(bg, tod, rx, ry) {
  const key = 'plat' + bg + tod + rx; if (BGCACHE[key]) return BGCACHE[key];
  const th = battleTheme(bg, tod);
  const pal = th.kind === 'gym' ? ['#f8d070', '#d8a440', '#9a6a28', '#fff0a8'] : th.kind === 'hall' ? [lt(th.floor, .15), dk(th.floor, .15), dk(th.floor, .35), lt(th.floor, .35)] : th.kind === 'cave' ? ['#8a7a66', '#6a5c4c', '#4a3e32', '#a8987e'] : th.plat;
  const w = rx * 2 + 2, h = ry * 2 + 6; const [c, x] = mk(w, h); const { p } = pctx(x);
  const inE = (X, Y, cx, cy, a, b) => ((X + .5 - cx) / a) ** 2 + ((Y + .5 - cy) / b) ** 2 <= 1;
  for (let Y = 0; Y < h; Y++) for (let X = 0; X < w; X++) {
    const top = inE(X, Y, rx + 1, ry + 1, rx, ry), side = inE(X, Y, rx + 1, ry + 4, rx, ry);
    if (top) {
      const rim = !inE(X, Y, rx + 1, ry + 1, rx - 1.6, ry - 1.2), hi = inE(X, Y, rx - rx * .15, ry - ry * .1, rx * .62, ry * .55);
      p(X, Y, rim ? pal[1] : hi ? mix(pal[0], pal[3], .45) : pal[0]);
    } else if (side) p(X, Y, Y > ry + 3 ? pal[2] : mix(pal[1], pal[2], .5));
  }
  if (th.kind === 'field') for (let i = 0; i < 18; i++) { const a = hash(i, rx, 3) * Math.PI * 2, X = Math.round(rx + 1 + Math.cos(a) * rx * .8), Y = Math.round(ry + 1 + Math.sin(a) * ry * .75); p(X, Y, pal[1]); p(X + 1, Y - 1, pal[1]); p(X + 2, Y, pal[1]); }
  BGCACHE[key] = c; return c;
}
// battle layout: platform centres (x, y), sprite sizes (N) and body centres (c) used to aim effects
const BTG = { slide: 256, foe: { x: 188, y: 84, N: 80, c: [188, 50] }, me: { x: 64, y: 138, N: 96, c: [66, 100] } };
function drawBattle() {
  const tod = timeOfDay(), bg = BT.bg;
  const sh = BT.shake > 0 ? (BT.shake-- % 2 ? 2 : -2) : 0;
  ctx.save(); ctx.translate(sh * P, 0);
  blit(battleBg(bg, tod), 0, 0);
  const th = battleTheme(bg, tod);
  if (th.kind === 'field' && !th.night) for (let i = 0; i < 3; i++) { const cx = ((i * 97 + NOW / 400 * (1 + i * .3)) % (W + 60)) - 30, cy = 12 + i * 14; for (const [dx, dy, r2] of [[0, 3, 5], [6, 0, 6], [13, 3, 5], [5, 5, 5]]) pell(cx + dx, cy + dy, r2 + 1, (r2 - 1) * .7 + 1, 'rgba(255,255,255,.85)'); pell(cx + 7, cy + 7, 12, 1.5, 'rgba(190,215,240,.8)'); }
  const F = BTG.foe, M = BTG.me;
  blit(platformSprite(bg, tod, 46, 11), F.x + BT.foeX - 47, F.y - 12);
  blit(platformSprite(bg, tod, 62, 14), M.x + BT.meX - 63, M.y - 15);
  if (BT.trVis) { blitPerson(LOOKS[BT.tr.look || 'grunt'], F.x + BT.foeX + BT.trX, F.y + 4, 48, 66); }
  if (BT.foeVis) drawMonB(BT.foe, 'foe', F.x - F.N / 2 + BT.foeX - BT.foeLunge, F.y - Math.round(F.N * 60 / 64), F.N, false, F.y + 8);
  if (BT.meVis) drawMonB(BT.me, 'me', M.x - M.N / 2 + BT.meX + BT.meLunge, M.y - Math.round(M.N * 60 / 64), M.N, true, 144);
  if (BT.orb) { const s = orbSprite(BT.orb.col); ctx.save(); ctx.translate(Math.round(BT.orb.x) * P, Math.round(BT.orb.y) * P); ctx.rotate(Math.round(BT.orb.rot * 4) / 4); ctx.drawImage(s, -7 * P, -7 * P, 14 * P, 14 * P); ctx.restore(); }
  for (let i = BT.fx.length - 1; i >= 0; i--) { const p = BT.fx[i]; p.x += p.vx; p.y += p.vy; p.life--; if (p.life <= 0) { BT.fx.splice(i, 1); continue; } if (p.star) { R(p.x - 1, p.y, 3, 1, p.col); R(p.x, p.y - 1, 1, 3, p.col); } else { R(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s, p.col); if (p.s > 2) R(p.x - p.s / 2, p.y - p.s / 2, 1, 1, 'rgba(255,255,255,.7)'); } }
  ctx.restore();
  if (BT.foeVis || BT.foeDrop) hud('foe', 4, 10); if (BT.meVis) hud('me', 130, 98);
}
function drawMonB(m, side, x, y, N, back, clipY) {
  const img = creatureSprite(m.sp, N, { back, shiny: m.shiny });
  const sc = BT[side + 'Scale'], drop = BT[side + 'Drop'], fl = BT[side + 'Flash'];
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * P, clipY * P); ctx.clip();
  const hit = BT[side + 'Hit'] ? NOW - BT[side + 'Hit'] : 999, jolt = hit < 220 ? Math.round((side === 'foe' ? 3 : -3) * (1 - hit / 220) * (Math.floor(hit / 40) % 2 ? .4 : 1)) : 0;
  const w = N * sc, X = x + (N - w) / 2 + jolt, Y = y + (N - w) * 60 / 64 + drop;
  if (fl && typeof fl === 'string') blit(tinted(img, fl), X, Y, { dw: w, dh: w, w: N, h: N });
  else if (fl === 1) blit(tinted(img, '#ffffff'), X, Y, { dw: w, dh: w, w: N, h: N });
  else blit(img, X, Y + (side === 'me' && !drop ? Math.round(Math.sin(NOW / 260)) : 0), { dw: w, dh: w, w: N, h: N });
  ctx.restore();
}
function hudBox(x, y, w, h, accent, point) {
  const o = '#2c3242', f = '#f8f6ea', f2 = '#e6e2cc';
  // pointer tab
  if (point === 'right') for (let i = 0; i < 8; i++) R(x + w - 2 + Math.min(i, 7 - i), y + h - 12 + i, 3, 1, o);
  if (point === 'left') for (let i = 0; i < 8; i++) R(x - 1 - Math.min(i, 7 - i), y + h - 12 + i, 3, 1, o);
  R(x + 2, y, w - 4, h, o); R(x, y + 2, w, h - 4, o); R(x + 1, y + 1, w - 2, h - 2, o);
  R(x + 2, y + 1, w - 4, h - 2, f); R(x + 1, y + 2, w - 2, h - 4, f);
  R(x + 1, y + h - 5, w - 2, 3, f2); R(x + 2, y + h - 2, w - 4, 1, f2);
  R(x + 2, y + 1, w - 4, 1, '#ffffff');
  R(x + 1, y + 2, 3, h - 4, accent); R(x + 2, y + 1, 2, 1, accent); R(x + 2, y + h - 2, 2, 1, accent); R(x + 1, y + 2, 1, h - 4, lt(accent, .3));
}
function hpPill(x, y, w, frac) {
  R(x + 1, y, w - 2, 7, '#3a4252'); R(x, y + 1, w, 5, '#3a4252');
  txt('HP', x + 3, y + 1, '#f8c040', null, 5.5);
  hpBar(x + 14, y + 2, w - 17, frac);
}
function hud(side, x, y) {
  const m = mon(side), foe = side === 'foe', w = foe ? 118 : 122, h = foe ? 32 : 42;
  hudBox(x, y, w, h, foe ? '#e0904a' : '#48a8a0', foe ? 'right' : 'left');
  txt(monName(m), x + 8, y + 4, '#303038', '#d8d4c0', 8);
  if (m.shiny) txt('★', x + 8 + tw(monName(m)) + 4, y + 4, '#e0a020', '#8a6010', 8);
  txt('LV', x + w - 26, y + 7, '#303038', null, 5.5); txt(String(m.lvl), x + w - 6, y + 4, '#303038', '#d8d4c0', 8, 'right');
  if (foe && BT.kind === 'wild' && G.caught[m.sp]) blit(orbSprite(), x + w - 41, y + 4, { dw: 10, dh: 10 });
  const hp = Math.max(0, BT.disp[side] ?? m.hp);
  if (m.status) statusBadge(m.status, x + 7, y + 17);
  hpPill(x + 30, y + 16, w - 36, hp / m.st.hp);
  if (!foe) {
    txt(`${Math.ceil(hp)}/${m.st.hp}`, x + w - 7, y + 25, '#303038', '#d8d4c0', 8, 'right');
    const xp = BT.xpDisp ?? m.xp, fr = m.lvl >= 100 ? 1 : Math.max(0, Math.min(1, (xp - xpFor(m.lvl)) / (xpFor(m.lvl + 1) - xpFor(m.lvl))));
    const bx = x + 8, bw = w - 14, by = y + h - 5;
    R(bx, by - 1, bw, 4, '#3a4252'); R(bx, by - 2, 16, 1, '#3a4252'); txt('EXP', bx + 2, by - 2, '#78c8f8', null, 5.5);
    R(bx + 15, by, bw - 17, 2, '#586070'); R(bx + 15, by, Math.round((bw - 17) * fr), 2, '#48b0f0'); R(bx + 15, by, Math.round((bw - 17) * fr), 1, '#a8e0ff');
  }
}