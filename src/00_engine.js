// ---- engine ----
// ================= ENGINE =================
const W = 256, H = 192, T = 16;
const cv = document.getElementById('screen');
const ctx = cv.getContext('2d');
// Pixel-perfect scaling: the canvas backing store is always a whole-number multiple of the 256x192 game screen,
// and it is shown at exactly one canvas pixel per device pixel, so no pixel is ever stretched unevenly.
let P = 3;
function fitScreen() {
  const dpr = window.devicePixelRatio || 1, shell = cv.closest('.shell'), wrap = cv.parentElement;
  const brand = document.querySelector('.brand'), ctrl = document.querySelector('.controls');
  const cred = document.getElementById('credits');
  const chromeH = 32 + 14 + (ctrl ? ctrl.offsetHeight : 30) + 24 + (brand ? brand.offsetHeight + 8 : 30) + (cred ? cred.offsetHeight + 14 : 0);
  const availW = Math.max(256, window.innerWidth - 32 - 24), availH = Math.max(192, window.innerHeight - chromeH);
  let S = Math.max(1, Math.floor(Math.min(availW * dpr / W, availH * dpr / H, 1280 * dpr / W)));
  if (S > 2 && S % 2) S--; // double-density art needs a whole number of screen pixels per half game pixel
  if (S !== P || cv.width !== W * S) { P = S; cv.width = W * P; cv.height = H * P; }
  ctx.imageSmoothingEnabled = false;
  const cssW = W * P / dpr, cssH = H * P / dpr;
  cv.style.width = cssW + 'px'; cv.style.height = cssH + 'px';
  if (wrap) { wrap.style.width = cssW + 'px'; wrap.style.height = cssH + 'px'; }
  if (shell) shell.style.width = (cssW + 24) + 'px';
}
fitScreen();
window.addEventListener('resize', fitScreen);
if (window.matchMedia) { const watchDpr = () => { const mq = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`); mq.addEventListener ? mq.addEventListener('change', () => { fitScreen(); watchDpr(); }, { once: true }) : 0; }; watchDpr(); }
const FONT = '"Pixelify Sans", "Courier New", monospace';

function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; }
function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x) * P, Math.round(y) * P, Math.round(w) * P, Math.round(h) * P); }
function Rf(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x * P, y * P, w * P, h * P); }
function blit(img, x, y, o = {}) {
  const w = (o.w || img.width), h = (o.h || img.height);
  const sx = o.sx || 0, sy = o.sy || 0;
  const den = img.hd || 1; // art drawn at twice the game's pixel density carries hd = 2
  const dw = (o.dw || w / den) * P, dh = (o.dh || h / den) * P;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
  const X = Math.round(x) * P, Y = Math.round(y) * P;
  if (o.flip) { ctx.translate(X + dw, Y); ctx.scale(-1, 1); ctx.drawImage(img, sx, sy, w, h, 0, 0, dw, dh); }
  else ctx.drawImage(img, sx, sy, w, h, X, Y, dw, dh);
  ctx.restore();
}

// pixel-exact filled ellipse (no anti-aliasing)
function pell(cx, cy, rx, ry, col) {
  for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++) {
    const t = 1 - (y + .5 * Math.sign(y)) ** 2 / (ry * ry); if (t <= 0 && y !== 0) continue;
    const hw = Math.round(rx * Math.sqrt(Math.max(0, t))); if (hw <= 0) continue;
    R(Math.round(cx - hw), Math.round(cy + y), hw * 2, 1, col);
  }
}
// ---------- colour ----------
function h2r(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function r2h(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = h2r(a), B = h2r(b); return r2h(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
function dk(c, t = .3) { return mix(c, '#1c1034', t); }
function lt(c, t = .3) { return mix(c, '#fffbee', t); }
function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h, s, l = (mx + mn) / 2; if (mx === mn) { h = s = 0; } else { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
function hsl2rgb(h, s, l) { let r, g, b; if (s === 0) r = g = b = l; else { const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; const f = t => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; r = f(h + 1 / 3); g = f(h); b = f(h - 1 / 3); } return [r * 255, g * 255, b * 255]; }
function hue(c, deg) { const [h, s, l] = rgb2hsl(...h2r(c)); return r2h(...hsl2rgb((h + deg / 360 + 1) % 1, s, l)); }

// ---------- seeded rand ----------
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const chance = p => Math.random() < p;

// ---------- input ----------
const held = {}, pressed = {};
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  KeyZ: 'a', Space: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b', Enter: 'start', NumpadEnter: 'start', ShiftLeft: 'run', ShiftRight: 'run', KeyM: 'mute', KeyC: 'guide'
};
let lastKeyTime = 0;
window.addEventListener('keydown', e => {
  const b = KEYMAP[e.code]; if (!b) return;
  e.preventDefault();
  audioInit();
  if (!e.repeat) { pressed[b] = true; if (b === 'start') pressed.a2 = true; }
  held[b] = true; lastKeyTime = performance.now();
});
window.addEventListener('keyup', e => { const b = KEYMAP[e.code]; if (!b) return; held[b] = false; });
window.addEventListener('blur', () => { for (const k in held) held[k] = false; });
function clearPressed() { for (const k in pressed) pressed[k] = false; }
const A = () => pressed.a || pressed.a2; // confirm (Enter also confirms inside menus)
const Bk = () => pressed.b;
// menu key repeat
const repeatState = {};
function dirPressed(d) {
  if (pressed[d]) { repeatState[d] = performance.now() + 320; return true; }
  if (held[d] && repeatState[d] && performance.now() > repeatState[d]) { repeatState[d] = performance.now() + 90; return true; }
  return false;
}

// ---------- tween / timing ----------
const tasks = [];
let NOW = 0;
function wait(ms) { return new Promise(res => tasks.push({ end: NOW + ms, res })); }
function tween(ms, fn) { return new Promise(res => { const t0 = NOW; tasks.push({ t0, ms, fn, res, end: NOW + ms }); fn(0); }); }
function nextFrame() { return wait(0); }
function runTasks() {
  for (let i = tasks.length - 1; i >= 0; i--) {
    const t = tasks[i];
    if (t.fn) t.fn(Math.min(1, (NOW - t.t0) / t.ms));
    if (NOW >= t.end) { tasks.splice(i, 1); t.res(); }
  }
}
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// flash-white version for hit/level effects
function tinted(img, col) {
  const k = '__t' + col; if (img[k]) return img[k];
  const [c, x] = mk(img.width, img.height); x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = col; x.fillRect(0, 0, img.width, img.height);
  img[k] = c; return c;
}

// ================= AUDIO =================
let AC = null, master = null, musicGain = null, sfxGain = null, soundOn = true;
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = soundOn ? 1 : 0; master.connect(AC.destination);
    musicGain = AC.createGain(); musicGain.gain.value = .055; musicGain.connect(master);
    sfxGain = AC.createGain(); sfxGain.gain.value = .12; sfxGain.connect(master);
    if (pendingTrack) playMusic(pendingTrack, true);
  } catch (e) { AC = null; }
}
function setSound(on) { soundOn = on; if (master) master.gain.value = on ? 1 : 0; }
const NOTE = n => { const m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) return null; const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return 440 * Math.pow(2, (base + (+m[3] + 1) * 12 - 69) / 12); };
function tone(freq, t, dur, type = 'square', vol = 1, dest = sfxGain, slide = 0) {
  if (!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.setValueAtTime(vol, t + Math.max(.01, dur - .03)); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .02);
}
function noise(t, dur, vol = .6, hp = 800) {
  if (!AC) return;
  const len = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = AC.createBufferSource(); s.buffer = buf; const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = AC.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(sfxGain); s.start(t);
}
function sfx(name) {
  if (!AC || !soundOn) return;
  const t = AC.currentTime;
  switch (name) {
    case 'blip': tone(1320, t, .03, 'square', .35); break;
    case 'select': tone(880, t, .05, 'square', .5); tone(1320, t + .05, .06, 'square', .5); break;
    case 'back': tone(660, t, .05, 'square', .5); tone(440, t + .05, .06, 'square', .5); break;
    case 'bump': tone(110, t, .08, 'square', .5); break;
    case 'door': noise(t, .12, .5, 400); tone(220, t, .1, 'triangle', .5, sfxGain, .5); break;
    case 'hit': noise(t, .18, .9, 300); tone(160, t, .12, 'square', .5, sfxGain, .4); break;
    case 'super': noise(t, .28, 1, 200); tone(220, t, .2, 'sawtooth', .5, sfxGain, .3); break;
    case 'weak': noise(t, .1, .5, 1200); break;
    case 'faint': tone(600, t, .45, 'square', .5, sfxGain, .15); break;
    case 'throw': tone(400, t, .25, 'triangle', .5, sfxGain, 2.5); break;
    case 'shake': tone(180, t, .06, 'square', .5); tone(140, t + .07, .06, 'square', .5); break;
    case 'catch': [0, 4, 7, 12].forEach((s, i) => tone(523 * Math.pow(2, s / 12), t + i * .09, .12, 'square', .45)); break;
    case 'break': noise(t, .2, .8, 1500); tone(900, t, .15, 'square', .4, sfxGain, .5); break;
    case 'levelup': [0, 4, 7, 12, 7, 12].forEach((s, i) => tone(659 * Math.pow(2, s / 12), t + i * .08, .1, 'square', .45)); break;
    case 'heal': [0, 4, 7, 4, 7, 12].forEach((s, i) => tone(523 * Math.pow(2, s / 12), t + i * .13, .14, 'triangle', .7)); break;
    case 'item': [7, 7, 12, 16].forEach((s, i) => tone(523 * Math.pow(2, s / 12), t + i * .1, .12, 'square', .4)); break;
    case 'badge': [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => tone(392 * Math.pow(2, s / 12), t + i * .11, .18, 'square', .4)); break;
    case 'alert': tone(1046, t, .07, 'square', .5); tone(1568, t + .08, .12, 'square', .5); break;
    case 'encounter': for (let i = 0; i < 8; i++) tone(i % 2 ? 330 : 440, t + i * .05, .05, 'square', .4); break;
    case 'shiny': [0, 7, 12, 19, 24].forEach((s, i) => tone(1046 * Math.pow(2, s / 12), t + i * .05, .08, 'triangle', .5)); break;
    case 'rumble': for (let i = 0; i < 6; i++) { noise(t + i * .15, .3, .7, 60); tone(55, t + i * .15, .3, 'sawtooth', .5); } break;
    case 'evolve': for (let i = 0; i < 16; i++) tone(440 * Math.pow(2, (i % 8) / 12), t + i * .09, .08, 'triangle', .5); break;
    case 'stat': tone(500, t, .15, 'square', .4, sfxGain, 2); break;
    case 'statdown': tone(900, t, .15, 'square', .4, sfxGain, .5); break;
  }
}
// --- music sequencer ---
let curTrack = null, pendingTrack = null, seqTimer = null, seqStep = 0, seqNext = 0;
function parseSeq(s) { return s.trim().split(/\s+/).filter(x => x !== '|'); }
function playMusic(name, force) {
  if (!force && curTrack === name) return;
  curTrack = name; pendingTrack = name;
  if (!AC) return;
  if (seqTimer) clearInterval(seqTimer);
  if (!name || !MUSIC[name]) return;
  const tr = MUSIC[name];
  const chans = tr.ch.map(c => ({ ...c, notes: parseSeq(c.n) }));
  const stepDur = 60 / tr.bpm / 2;
  seqStep = 0; seqNext = AC.currentTime + .1;
  seqTimer = setInterval(() => {
    if (!AC) return;
    while (seqNext < AC.currentTime + .2) {
      for (const c of chans) {
        const n = c.notes[seqStep % c.notes.length];
        if (n && n !== '-' && n !== '.') {
          let len = 1; while (c.notes[(seqStep + len) % c.notes.length] === '-' && len < 16) len++;
          const f = NOTE(n); if (f) tone(f, seqNext, stepDur * len * .92, c.w || 'square', c.v || 1, musicGain);
        }
      }
      seqStep++; seqNext += stepDur;
    }
  }, 40);
}
function stopMusic() { if (seqTimer) clearInterval(seqTimer); seqTimer = null; curTrack = null; }