// ---- types ----
// ================= TYPES =================
const TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
const TABBR = { Normal: 'NOR', Fire: 'FIR', Water: 'WAT', Electric: 'ELE', Grass: 'GRA', Ice: 'ICE', Fighting: 'FIG', Poison: 'POI', Ground: 'GRO', Flying: 'FLY', Psychic: 'PSY', Bug: 'BUG', Rock: 'ROC', Ghost: 'GHO', Dragon: 'DRA', Dark: 'DAR', Steel: 'STE', Fairy: 'FAI' };
const TABBR2 = { Normal: 'NO', Fire: 'FI', Water: 'WA', Electric: 'EL', Grass: 'GR', Ice: 'IC', Fighting: 'FG', Poison: 'PO', Ground: 'GD', Flying: 'FL', Psychic: 'PS', Bug: 'BU', Rock: 'RO', Ghost: 'GH', Dragon: 'DR', Dark: 'DK', Steel: 'ST', Fairy: 'FA' };
const TCOL = {
  Normal: '#a8a878', Fire: '#f08030', Water: '#6890f0', Electric: '#e0b818', Grass: '#70c048', Ice: '#78c8c8', Fighting: '#c03028', Poison: '#a040a0', Ground: '#d0a850',
  Flying: '#a890f0', Psychic: '#f05888', Bug: '#a0b020', Rock: '#b8a038', Ghost: '#705898', Dragon: '#7038f8', Dark: '#705848', Steel: '#a0a0c0', Fairy: '#e890b0',
};
// attacking type -> defending type multipliers (anything unlisted is x1)
const CHART = {
  Normal: { Rock: .5, Ghost: 0, Steel: .5 },
  Fire: { Fire: .5, Water: .5, Grass: 2, Ice: 2, Bug: 2, Rock: .5, Dragon: .5, Steel: 2 },
  Water: { Fire: 2, Water: .5, Grass: .5, Ground: 2, Rock: 2, Dragon: .5 },
  Electric: { Water: 2, Electric: .5, Grass: .5, Ground: 0, Flying: 2, Dragon: .5 },
  Grass: { Fire: .5, Water: 2, Grass: .5, Poison: .5, Ground: 2, Flying: .5, Bug: .5, Rock: 2, Dragon: .5, Steel: .5 },
  Ice: { Fire: .5, Water: .5, Grass: 2, Ice: .5, Ground: 2, Flying: 2, Dragon: 2, Steel: .5 },
  Fighting: { Normal: 2, Ice: 2, Poison: .5, Flying: .5, Psychic: .5, Bug: .5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: .5 },
  Poison: { Grass: 2, Poison: .5, Ground: .5, Rock: .5, Ghost: .5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: .5, Poison: 2, Flying: 0, Bug: .5, Rock: 2, Steel: 2 },
  Flying: { Electric: .5, Grass: 2, Fighting: 2, Bug: 2, Rock: .5, Steel: .5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: .5, Dark: 0, Steel: .5 },
  Bug: { Fire: .5, Grass: 2, Fighting: .5, Poison: .5, Flying: .5, Psychic: 2, Ghost: .5, Dark: 2, Steel: .5, Fairy: .5 },
  Rock: { Fire: 2, Ice: 2, Fighting: .5, Ground: .5, Flying: 2, Bug: 2, Steel: .5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: .5 },
  Dragon: { Dragon: 2, Steel: .5, Fairy: 0 },
  Dark: { Fighting: .5, Psychic: 2, Ghost: 2, Dark: .5, Fairy: .5 },
  Steel: { Fire: .5, Water: .5, Electric: .5, Ice: 2, Rock: 2, Steel: .5, Fairy: 2 },
  Fairy: { Fire: .5, Fighting: 2, Poison: .5, Dragon: 2, Dark: 2, Steel: .5 },
};
function eff(mt, types) { let m = 1; for (const t of types) { const v = CHART[mt][t]; if (v !== undefined) m *= v; } return m; }
function multLabel(m) { return m === 0 ? 'x0' : m === .25 ? 'x1/4' : m === .5 ? 'x1/2' : 'x' + m; }

// ================= MOVES =================
// c: p=physical s=special st=status. fx: st/ch status chance, stat/self stat changes, drain, heal, recoil, prio, hc (high crit). ac 0 = never misses
const MOVES = {
  // Normal
  tackle: { n: 'Tackle', t: 'Normal', c: 'p', pw: 40, ac: 100, pp: 35 }, scratch: { n: 'Scratch', t: 'Normal', c: 'p', pw: 40, ac: 100, pp: 35 },
  pound: { n: 'Pound', t: 'Normal', c: 'p', pw: 40, ac: 100, pp: 35 }, quickattack: { n: 'Quick Attack', t: 'Normal', c: 'p', pw: 40, ac: 100, pp: 30, prio: 1 },
  headbutt: { n: 'Headbutt', t: 'Normal', c: 'p', pw: 70, ac: 100, pp: 15 }, bodyslam: { n: 'Body Slam', t: 'Normal', c: 'p', pw: 85, ac: 100, pp: 15, fx: { st: 'par', ch: .3 } },
  hypervoice: { n: 'Hyper Voice', t: 'Normal', c: 's', pw: 90, ac: 100, pp: 10 }, swift: { n: 'Swift', t: 'Normal', c: 's', pw: 60, ac: 0, pp: 20 },
  doubleedge: { n: 'Double-Edge', t: 'Normal', c: 'p', pw: 120, ac: 100, pp: 15, fx: { recoil: .33 } }, hyperbeam: { n: 'Hyper Beam', t: 'Normal', c: 's', pw: 120, ac: 85, pp: 5 },
  growl: { n: 'Growl', t: 'Normal', c: 'st', ac: 100, pp: 40, fx: { stat: ['atk', -1] } }, tailwhip: { n: 'Tail Whip', t: 'Normal', c: 'st', ac: 100, pp: 30, fx: { stat: ['def', -1] } },
  leer: { n: 'Leer', t: 'Normal', c: 'st', ac: 100, pp: 30, fx: { stat: ['def', -1] } }, howl: { n: 'Howl', t: 'Normal', c: 'st', ac: 0, pp: 40, fx: { self: ['atk', 1] } },
  harden: { n: 'Harden', t: 'Normal', c: 'st', ac: 0, pp: 30, fx: { self: ['def', 1] } }, swordsdance: { n: 'Swords Dance', t: 'Normal', c: 'st', ac: 0, pp: 20, fx: { self: ['atk', 2] } },
  screech: { n: 'Screech', t: 'Normal', c: 'st', ac: 85, pp: 40, fx: { stat: ['def', -2] } }, recover: { n: 'Recover', t: 'Normal', c: 'st', ac: 0, pp: 10, fx: { heal: .5 } },
  // Fire
  ember: { n: 'Ember', t: 'Fire', c: 's', pw: 40, ac: 100, pp: 25, fx: { st: 'brn', ch: .1 } }, flamewheel: { n: 'Flame Wheel', t: 'Fire', c: 'p', pw: 60, ac: 100, pp: 25, fx: { st: 'brn', ch: .1 } },
  firefang: { n: 'Fire Fang', t: 'Fire', c: 'p', pw: 65, ac: 95, pp: 15, fx: { st: 'brn', ch: .1 } }, flamethrower: { n: 'Flamethrower', t: 'Fire', c: 's', pw: 90, ac: 100, pp: 15, fx: { st: 'brn', ch: .1 } },
  flareblitz: { n: 'Flare Blitz', t: 'Fire', c: 'p', pw: 120, ac: 100, pp: 15, fx: { recoil: .33, st: 'brn', ch: .1 } }, fireblast: { n: 'Fire Blast', t: 'Fire', c: 's', pw: 110, ac: 85, pp: 5, fx: { st: 'brn', ch: .1 } },
  willowisp: { n: 'Will-o-Wisp', t: 'Fire', c: 'st', ac: 85, pp: 15, fx: { st: 'brn', ch: 1 } },
  // Water
  watergun: { n: 'Water Gun', t: 'Water', c: 's', pw: 40, ac: 100, pp: 25 }, aquajet: { n: 'Aqua Jet', t: 'Water', c: 'p', pw: 40, ac: 100, pp: 20, prio: 1 },
  bubblebeam: { n: 'Bubble Beam', t: 'Water', c: 's', pw: 65, ac: 100, pp: 20, fx: { stat: ['spe', -1], ch: .1 } }, waterfall: { n: 'Waterfall', t: 'Water', c: 'p', pw: 80, ac: 100, pp: 15 },
  aquatail: { n: 'Aqua Tail', t: 'Water', c: 'p', pw: 90, ac: 90, pp: 10 }, surf: { n: 'Surf', t: 'Water', c: 's', pw: 90, ac: 100, pp: 15 },
  hydropump: { n: 'Hydro Pump', t: 'Water', c: 's', pw: 110, ac: 80, pp: 5 }, raindance: { n: 'Aqua Ring', t: 'Water', c: 'st', ac: 0, pp: 10, fx: { heal: .5 } },
  // Electric
  thundershock: { n: 'Thunder Shock', t: 'Electric', c: 's', pw: 40, ac: 100, pp: 30, fx: { st: 'par', ch: .1 } }, spark: { n: 'Spark', t: 'Electric', c: 'p', pw: 65, ac: 100, pp: 20, fx: { st: 'par', ch: .3 } },
  thunderfang: { n: 'Thunder Fang', t: 'Electric', c: 'p', pw: 65, ac: 95, pp: 15, fx: { st: 'par', ch: .1 } }, thunderbolt: { n: 'Thunderbolt', t: 'Electric', c: 's', pw: 90, ac: 100, pp: 15, fx: { st: 'par', ch: .1 } },
  wildcharge: { n: 'Wild Charge', t: 'Electric', c: 'p', pw: 90, ac: 100, pp: 15, fx: { recoil: .25 } }, thunder: { n: 'Thunder', t: 'Electric', c: 's', pw: 110, ac: 70, pp: 10, fx: { st: 'par', ch: .3 } },
  thunderwave: { n: 'Thunder Wave', t: 'Electric', c: 'st', ac: 90, pp: 20, fx: { st: 'par', ch: 1 } }, charge: { n: 'Charge', t: 'Electric', c: 'st', ac: 0, pp: 20, fx: { self: [['spa', 1], ['spd', 1]] } },
  // Grass
  vinewhip: { n: 'Vine Whip', t: 'Grass', c: 'p', pw: 45, ac: 100, pp: 25 }, absorb: { n: 'Absorb', t: 'Grass', c: 's', pw: 20, ac: 100, pp: 25, fx: { drain: .5 } },
  megadrain: { n: 'Mega Drain', t: 'Grass', c: 's', pw: 40, ac: 100, pp: 15, fx: { drain: .5 } }, razorleaf: { n: 'Razor Leaf', t: 'Grass', c: 'p', pw: 55, ac: 95, pp: 25, fx: { hc: 1 } },
  seedbomb: { n: 'Seed Bomb', t: 'Grass', c: 'p', pw: 80, ac: 100, pp: 15 }, gigadrain: { n: 'Giga Drain', t: 'Grass', c: 's', pw: 75, ac: 100, pp: 10, fx: { drain: .5 } },
  energyball: { n: 'Energy Ball', t: 'Grass', c: 's', pw: 90, ac: 100, pp: 10 }, leafblade: { n: 'Leaf Blade', t: 'Grass', c: 'p', pw: 90, ac: 100, pp: 15, fx: { hc: 1 } },
  woodhammer: { n: 'Wood Hammer', t: 'Grass', c: 'p', pw: 120, ac: 100, pp: 15, fx: { recoil: .33 } }, leafstorm: { n: 'Leaf Storm', t: 'Grass', c: 's', pw: 120, ac: 90, pp: 5 },
  sleeppowder: { n: 'Sleep Powder', t: 'Grass', c: 'st', ac: 75, pp: 15, fx: { st: 'slp', ch: 1 } }, growth: { n: 'Growth', t: 'Grass', c: 'st', ac: 0, pp: 20, fx: { self: [['atk', 1], ['spa', 1]] } },
  synthesis: { n: 'Synthesis', t: 'Grass', c: 'st', ac: 0, pp: 5, fx: { heal: .5 } },
  // Ice
  powdersnow: { n: 'Powder Snow', t: 'Ice', c: 's', pw: 40, ac: 100, pp: 25 }, iceshard: { n: 'Ice Shard', t: 'Ice', c: 'p', pw: 40, ac: 100, pp: 30, prio: 1 },
  icywind: { n: 'Icy Wind', t: 'Ice', c: 's', pw: 55, ac: 95, pp: 15, fx: { stat: ['spe', -1], ch: 1 } }, icefang: { n: 'Ice Fang', t: 'Ice', c: 'p', pw: 65, ac: 95, pp: 15 },
  iciclecrash: { n: 'Icicle Crash', t: 'Ice', c: 'p', pw: 85, ac: 90, pp: 10 }, icebeam: { n: 'Ice Beam', t: 'Ice', c: 's', pw: 90, ac: 100, pp: 10 },
  blizzard: { n: 'Blizzard', t: 'Ice', c: 's', pw: 110, ac: 70, pp: 5 }, mist: { n: 'Frost Veil', t: 'Ice', c: 'st', ac: 0, pp: 20, fx: { self: [['def', 1], ['spd', 1]] } },
  // Fighting
  rocksmash: { n: 'Rock Smash', t: 'Fighting', c: 'p', pw: 40, ac: 100, pp: 15, fx: { stat: ['def', -1], ch: .5 } }, lowkick: { n: 'Low Kick', t: 'Fighting', c: 'p', pw: 60, ac: 100, pp: 20 },
  brickbreak: { n: 'Brick Break', t: 'Fighting', c: 'p', pw: 75, ac: 100, pp: 15 }, aurasphere: { n: 'Aura Sphere', t: 'Fighting', c: 's', pw: 80, ac: 0, pp: 20 },
  drainpunch: { n: 'Drain Punch', t: 'Fighting', c: 'p', pw: 75, ac: 100, pp: 10, fx: { drain: .5 } }, closecombat: { n: 'Close Combat', t: 'Fighting', c: 'p', pw: 120, ac: 100, pp: 5 },
  focusblast: { n: 'Focus Blast', t: 'Fighting', c: 's', pw: 120, ac: 70, pp: 5 }, bulkup: { n: 'Bulk Up', t: 'Fighting', c: 'st', ac: 0, pp: 20, fx: { self: [['atk', 1], ['def', 1]] } },
  // Poison
  poisonsting: { n: 'Poison Sting', t: 'Poison', c: 'p', pw: 15, ac: 100, pp: 35, fx: { st: 'psn', ch: .3 } }, acid: { n: 'Acid', t: 'Poison', c: 's', pw: 40, ac: 100, pp: 30, fx: { stat: ['spd', -1], ch: .1 } },
  poisonfang: { n: 'Poison Fang', t: 'Poison', c: 'p', pw: 50, ac: 100, pp: 15, fx: { st: 'psn', ch: .3 } }, sludge: { n: 'Sludge', t: 'Poison', c: 's', pw: 65, ac: 100, pp: 20, fx: { st: 'psn', ch: .3 } },
  poisonjab: { n: 'Poison Jab', t: 'Poison', c: 'p', pw: 80, ac: 100, pp: 20, fx: { st: 'psn', ch: .3 } }, sludgebomb: { n: 'Sludge Bomb', t: 'Poison', c: 's', pw: 90, ac: 100, pp: 10, fx: { st: 'psn', ch: .3 } },
  gunkshot: { n: 'Gunk Shot', t: 'Poison', c: 'p', pw: 120, ac: 80, pp: 5, fx: { st: 'psn', ch: .3 } }, poisonpowder: { n: 'Poison Powder', t: 'Poison', c: 'st', ac: 75, pp: 35, fx: { st: 'psn', ch: 1 } },
  // Ground
  mudslap: { n: 'Mud-Slap', t: 'Ground', c: 's', pw: 20, ac: 100, pp: 10, fx: { stat: ['spe', -1], ch: .5 } }, mudshot: { n: 'Mud Shot', t: 'Ground', c: 's', pw: 55, ac: 95, pp: 15, fx: { stat: ['spe', -1], ch: 1 } },
  bulldoze: { n: 'Bulldoze', t: 'Ground', c: 'p', pw: 60, ac: 100, pp: 20, fx: { stat: ['spe', -1], ch: 1 } }, dig: { n: 'Earth Claw', t: 'Ground', c: 'p', pw: 80, ac: 100, pp: 10 },
  earthpower: { n: 'Earth Power', t: 'Ground', c: 's', pw: 90, ac: 100, pp: 10 }, earthquake: { n: 'Earthquake', t: 'Ground', c: 'p', pw: 100, ac: 100, pp: 10 },
  // Flying
  peck: { n: 'Peck', t: 'Flying', c: 'p', pw: 35, ac: 100, pp: 35 }, gust: { n: 'Gust', t: 'Flying', c: 's', pw: 40, ac: 100, pp: 35 },
  wingattack: { n: 'Wing Attack', t: 'Flying', c: 'p', pw: 60, ac: 100, pp: 35 }, aerialace: { n: 'Aerial Ace', t: 'Flying', c: 'p', pw: 60, ac: 0, pp: 20 },
  airslash: { n: 'Air Slash', t: 'Flying', c: 's', pw: 75, ac: 95, pp: 15 }, drillpeck: { n: 'Drill Peck', t: 'Flying', c: 'p', pw: 80, ac: 100, pp: 20 },
  bravebird: { n: 'Brave Bird', t: 'Flying', c: 'p', pw: 120, ac: 100, pp: 15, fx: { recoil: .33 } }, hurricane: { n: 'Hurricane', t: 'Flying', c: 's', pw: 110, ac: 70, pp: 10 },
  agility: { n: 'Agility', t: 'Psychic', c: 'st', ac: 0, pp: 30, fx: { self: ['spe', 2] } }, roost: { n: 'Roost', t: 'Flying', c: 'st', ac: 0, pp: 10, fx: { heal: .5 } },
  // Psychic
  confusion: { n: 'Confusion', t: 'Psychic', c: 's', pw: 50, ac: 100, pp: 25 }, psybeam: { n: 'Psybeam', t: 'Psychic', c: 's', pw: 65, ac: 100, pp: 20 },
  zenheadbutt: { n: 'Zen Headbutt', t: 'Psychic', c: 'p', pw: 80, ac: 90, pp: 15 }, psychic: { n: 'Psychic', t: 'Psychic', c: 's', pw: 90, ac: 100, pp: 10, fx: { stat: ['spd', -1], ch: .1 } },
  psystrike: { n: 'Mind Storm', t: 'Psychic', c: 's', pw: 110, ac: 90, pp: 10 }, calmmind: { n: 'Calm Mind', t: 'Psychic', c: 'st', ac: 0, pp: 20, fx: { self: [['spa', 1], ['spd', 1]] } },
  hypnosis: { n: 'Hypnosis', t: 'Psychic', c: 'st', ac: 60, pp: 20, fx: { st: 'slp', ch: 1 } }, amnesia: { n: 'Amnesia', t: 'Psychic', c: 'st', ac: 0, pp: 20, fx: { self: ['spd', 2] } },
  // Bug
  stringshot: { n: 'String Shot', t: 'Bug', c: 'st', ac: 95, pp: 40, fx: { stat: ['spe', -1] } }, bugbite: { n: 'Bug Bite', t: 'Bug', c: 'p', pw: 60, ac: 100, pp: 20 },
  silverwind: { n: 'Silver Wind', t: 'Bug', c: 's', pw: 60, ac: 100, pp: 5 }, signalbeam: { n: 'Signal Beam', t: 'Bug', c: 's', pw: 75, ac: 100, pp: 15 },
  xscissor: { n: 'X-Scissor', t: 'Bug', c: 'p', pw: 80, ac: 100, pp: 15 }, bugbuzz: { n: 'Bug Buzz', t: 'Bug', c: 's', pw: 90, ac: 100, pp: 10 },
  megahorn: { n: 'Megahorn', t: 'Bug', c: 'p', pw: 120, ac: 85, pp: 10 }, quiverdance: { n: 'Quiver Dance', t: 'Bug', c: 'st', ac: 0, pp: 20, fx: { self: [['spa', 1], ['spe', 1]] } },
  // Rock
  rockthrow: { n: 'Rock Throw', t: 'Rock', c: 'p', pw: 50, ac: 90, pp: 15 }, rocktomb: { n: 'Rock Tomb', t: 'Rock', c: 'p', pw: 60, ac: 95, pp: 15, fx: { stat: ['spe', -1], ch: 1 } },
  ancientpower: { n: 'Ancient Power', t: 'Rock', c: 's', pw: 60, ac: 100, pp: 5 }, rockslide: { n: 'Rock Slide', t: 'Rock', c: 'p', pw: 75, ac: 90, pp: 10 },
  powergem: { n: 'Power Gem', t: 'Rock', c: 's', pw: 80, ac: 100, pp: 20 }, stoneedge: { n: 'Stone Edge', t: 'Rock', c: 'p', pw: 100, ac: 80, pp: 5, fx: { hc: 1 } },
  headsmash: { n: 'Head Smash', t: 'Rock', c: 'p', pw: 130, ac: 80, pp: 5, fx: { recoil: .4 } }, rockpolish: { n: 'Rock Polish', t: 'Rock', c: 'st', ac: 0, pp: 20, fx: { self: ['spe', 2] } },
  // Ghost
  astonish: { n: 'Astonish', t: 'Ghost', c: 'p', pw: 30, ac: 100, pp: 15 }, lick: { n: 'Lick', t: 'Ghost', c: 'p', pw: 30, ac: 100, pp: 30, fx: { st: 'par', ch: .3 } },
  hex: { n: 'Hex', t: 'Ghost', c: 's', pw: 65, ac: 100, pp: 10 }, shadowclaw: { n: 'Shadow Claw', t: 'Ghost', c: 'p', pw: 70, ac: 100, pp: 15, fx: { hc: 1 } },
  shadowball: { n: 'Shadow Ball', t: 'Ghost', c: 's', pw: 80, ac: 100, pp: 15, fx: { stat: ['spd', -1], ch: .2 } }, phantomforce: { n: 'Phantom Force', t: 'Ghost', c: 'p', pw: 90, ac: 100, pp: 10 },
  // Dragon
  twister: { n: 'Twister', t: 'Dragon', c: 's', pw: 40, ac: 100, pp: 20 }, dragonbreath: { n: 'Dragon Breath', t: 'Dragon', c: 's', pw: 60, ac: 100, pp: 20, fx: { st: 'par', ch: .3 } },
  dragonclaw: { n: 'Dragon Claw', t: 'Dragon', c: 'p', pw: 80, ac: 100, pp: 15 }, dragonpulse: { n: 'Dragon Pulse', t: 'Dragon', c: 's', pw: 85, ac: 100, pp: 10 },
  outrage: { n: 'Outrage', t: 'Dragon', c: 'p', pw: 120, ac: 90, pp: 10 }, dracometeor: { n: 'Draco Meteor', t: 'Dragon', c: 's', pw: 120, ac: 90, pp: 5 },
  dragondance: { n: 'Dragon Dance', t: 'Dragon', c: 'st', ac: 0, pp: 20, fx: { self: [['atk', 1], ['spe', 1]] } },
  // Dark
  bite: { n: 'Bite', t: 'Dark', c: 'p', pw: 60, ac: 100, pp: 25 }, snarl: { n: 'Snarl', t: 'Dark', c: 's', pw: 55, ac: 95, pp: 15, fx: { stat: ['spa', -1], ch: 1 } },
  feintattack: { n: 'Feint Attack', t: 'Dark', c: 'p', pw: 60, ac: 0, pp: 20 }, nightslash: { n: 'Night Slash', t: 'Dark', c: 'p', pw: 70, ac: 100, pp: 15, fx: { hc: 1 } },
  crunch: { n: 'Crunch', t: 'Dark', c: 'p', pw: 80, ac: 100, pp: 15, fx: { stat: ['def', -1], ch: .2 } }, darkpulse: { n: 'Dark Pulse', t: 'Dark', c: 's', pw: 80, ac: 100, pp: 15 },
  foulplay: { n: 'Foul Play', t: 'Dark', c: 'p', pw: 95, ac: 100, pp: 15 }, nastyplot: { n: 'Nasty Plot', t: 'Dark', c: 'st', ac: 0, pp: 20, fx: { self: ['spa', 2] } },
  // Steel
  metalclaw: { n: 'Metal Claw', t: 'Steel', c: 'p', pw: 50, ac: 95, pp: 35 }, mirrorshot: { n: 'Mirror Shot', t: 'Steel', c: 's', pw: 65, ac: 85, pp: 10 },
  ironhead: { n: 'Iron Head', t: 'Steel', c: 'p', pw: 80, ac: 100, pp: 15 }, flashcannon: { n: 'Flash Cannon', t: 'Steel', c: 's', pw: 80, ac: 100, pp: 10, fx: { stat: ['spd', -1], ch: .1 } },
  meteormash: { n: 'Meteor Mash', t: 'Steel', c: 'p', pw: 100, ac: 90, pp: 10, fx: { self: ['atk', 1], ch: .2 } }, irondefense: { n: 'Iron Defence', t: 'Steel', c: 'st', ac: 0, pp: 15, fx: { self: ['def', 2] } },
  // Fairy
  fairywind: { n: 'Fairy Wind', t: 'Fairy', c: 's', pw: 40, ac: 100, pp: 30 }, drainingkiss: { n: 'Draining Kiss', t: 'Fairy', c: 's', pw: 50, ac: 100, pp: 10, fx: { drain: .75 } },
  dazzlinggleam: { n: 'Dazzling Gleam', t: 'Fairy', c: 's', pw: 80, ac: 100, pp: 10 }, playrough: { n: 'Play Rough', t: 'Fairy', c: 'p', pw: 90, ac: 90, pp: 10, fx: { stat: ['atk', -1], ch: .1 } },
  moonblast: { n: 'Moonblast', t: 'Fairy', c: 's', pw: 95, ac: 100, pp: 15, fx: { stat: ['spa', -1], ch: .3 } }, charm: { n: 'Charm', t: 'Fairy', c: 'st', ac: 100, pp: 20, fx: { stat: ['atk', -2] } },
  moonlight: { n: 'Moonlight', t: 'Fairy', c: 'st', ac: 0, pp: 5, fx: { heal: .5 } },
  struggle: { n: 'Struggle', t: 'Normal', c: 'p', pw: 50, ac: 0, pp: 1, fx: { recoil: .25 } },
};
// learnset building blocks: per type, [physical, special] moves by power tier
const POOL = {
  Normal: [['tackle', 'tackle'], ['quickattack', 'swift'], ['headbutt', 'swift'], ['bodyslam', 'hypervoice'], ['doubleedge', 'hyperbeam']],
  Fire: [['ember', 'ember'], ['flamewheel', 'flamewheel'], ['firefang', 'flamethrower'], ['firefang', 'flamethrower'], ['flareblitz', 'fireblast']],
  Water: [['watergun', 'watergun'], ['aquajet', 'bubblebeam'], ['waterfall', 'bubblebeam'], ['aquatail', 'surf'], ['aquatail', 'hydropump']],
  Electric: [['thundershock', 'thundershock'], ['spark', 'spark'], ['thunderfang', 'thunderbolt'], ['wildcharge', 'thunderbolt'], ['wildcharge', 'thunder']],
  Grass: [['vinewhip', 'absorb'], ['razorleaf', 'megadrain'], ['seedbomb', 'gigadrain'], ['leafblade', 'energyball'], ['woodhammer', 'leafstorm']],
  Ice: [['iceshard', 'powdersnow'], ['icefang', 'icywind'], ['icefang', 'icywind'], ['iciclecrash', 'icebeam'], ['iciclecrash', 'blizzard']],
  Fighting: [['rocksmash', 'rocksmash'], ['lowkick', 'lowkick'], ['brickbreak', 'aurasphere'], ['drainpunch', 'aurasphere'], ['closecombat', 'focusblast']],
  Poison: [['poisonsting', 'acid'], ['poisonfang', 'acid'], ['poisonfang', 'sludge'], ['poisonjab', 'sludgebomb'], ['gunkshot', 'sludgebomb']],
  Ground: [['mudslap', 'mudslap'], ['bulldoze', 'mudshot'], ['dig', 'mudshot'], ['dig', 'earthpower'], ['earthquake', 'earthpower']],
  Flying: [['peck', 'gust'], ['wingattack', 'gust'], ['aerialace', 'airslash'], ['drillpeck', 'airslash'], ['bravebird', 'hurricane']],
  Psychic: [['confusion', 'confusion'], ['zenheadbutt', 'psybeam'], ['zenheadbutt', 'psybeam'], ['zenheadbutt', 'psychic'], ['zenheadbutt', 'psystrike']],
  Bug: [['bugbite', 'silverwind'], ['bugbite', 'silverwind'], ['xscissor', 'signalbeam'], ['xscissor', 'bugbuzz'], ['megahorn', 'bugbuzz']],
  Rock: [['rockthrow', 'rockthrow'], ['rocktomb', 'ancientpower'], ['rockslide', 'ancientpower'], ['rockslide', 'powergem'], ['stoneedge', 'powergem']],
  Ghost: [['astonish', 'astonish'], ['lick', 'hex'], ['shadowclaw', 'hex'], ['shadowclaw', 'shadowball'], ['phantomforce', 'shadowball']],
  Dragon: [['twister', 'twister'], ['dragonbreath', 'dragonbreath'], ['dragonclaw', 'dragonbreath'], ['dragonclaw', 'dragonpulse'], ['outrage', 'dracometeor']],
  Dark: [['bite', 'snarl'], ['feintattack', 'snarl'], ['nightslash', 'darkpulse'], ['crunch', 'darkpulse'], ['foulplay', 'darkpulse']],
  Steel: [['metalclaw', 'metalclaw'], ['metalclaw', 'mirrorshot'], ['ironhead', 'mirrorshot'], ['ironhead', 'flashcannon'], ['meteormash', 'flashcannon']],
  Fairy: [['fairywind', 'fairywind'], ['drainingkiss', 'drainingkiss'], ['playrough', 'dazzlinggleam'], ['playrough', 'dazzlinggleam'], ['playrough', 'moonblast']],
};
const STATUSMV = { Normal: 'howl', Fire: 'willowisp', Water: 'raindance', Electric: 'thunderwave', Grass: 'sleeppowder', Ice: 'mist', Fighting: 'bulkup', Poison: 'poisonpowder', Ground: 'harden',
  Flying: 'roost', Psychic: 'calmmind', Bug: 'stringshot', Rock: 'rockpolish', Ghost: 'hypnosis', Dragon: 'dragondance', Dark: 'nastyplot', Steel: 'irondefense', Fairy: 'charm' };
// Builds a sensible learnset from a creature's types and stats. Tier levels track the game's difficulty curve.
function autoLearnset(sp) {
  const [t1, t2] = sp.types, b = sp.base, phys = b[1] >= b[3] ? 0 : 1, out = [];
  const add = (l, id) => { if (id && !out.some(x => x[1] === id)) out.push([l, id]); };
  add(1, t1 === 'Normal' || !sp.opener ? (sp.opener || 'tackle') : sp.opener);
  add(1, b[1] >= b[2] ? 'leer' : 'growl');
  const T = [4, 11, 20, 31, 43];
  POOL[t1].forEach((pr, i) => add(T[i] + (i ? rnd2(sp.n, i) : 0), pr[phys]));
  if (t2) POOL[t2].forEach((pr, i) => { if (i >= 1 && i <= 3) add(T[i] + 5 + rnd2(sp.n, i + 7), pr[phys]); });
  add(16 + rnd2(sp.n, 3), STATUSMV[t2 && (sp.n.length % 2) ? t2 : t1]);
  if (sp.extra) for (const [l, id] of sp.extra) add(l, id);
  return out.sort((a, b2) => a[0] - b2[0]);
}
function rnd2(s, k) { let h = k * 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 997; return h % 3; }
// Distribute a base stat total by role
const PROF = {
  bal: [1, 1, 1, 1, 1, 1], phys: [1, 1.35, 1, .7, .9, 1.05], spec: [.95, .7, .9, 1.35, 1.1, .95], tank: [1.2, 1.05, 1.45, .7, 1.05, .55],
  fast: [.85, 1.1, .8, 1, .85, 1.4], wall: [1.15, .7, 1.35, .75, 1.3, .75], sweep: [.9, 1.25, .85, 1.05, .85, 1.2], mixed: [1, 1.15, .95, 1.15, .95, .9],
  hp: [1.7, .85, .9, .85, 1, .7], sspd: [.9, .7, .8, 1.3, 1, 1.3], pwall: [1.05, 1.1, 1.3, .7, .9, .95],
};
function statsFrom(total, prof) {
  const w = PROF[prof] || PROF.bal, sum = w.reduce((a, b) => a + b, 0);
  const s = w.map(x => Math.max(15, Math.round(total * x / sum)));
  s[0] += total - s.reduce((a, b) => a + b, 0); return s;
}