// ---- journal viewer ----
// Runs on top of the game's own code (everything but the boot section), so every sprite is drawn exactly the way the
// game draws it: new art from src/36_assets.js where it exists, the original code-drawn art everywhere else.
// Rebuilding with build.py picks up any new sprite automatically.
(function () {
  const $ = id => document.getElementById(id);
  const store = { get(k) { try { return localStorage.getItem('bj_' + k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem('bj_' + k, v); } catch (e) {} } };
  const S = { i: 0, names: store.get('names') === '1', shiny: false, light: store.get('light') === '1', f: 'all', q: '' };
  const IDS = DEX_ORDER.filter(id => SPECIES[id]);
  const art = id => {
    const f = IMG['b_' + id + '_f'] ? 'new' : 'old';
    const b = IMG['b_' + id + '_b'] ? 'new' : f === 'new' ? 'mirror' : 'old';
    return { f, b };
  };
  // ---- flags: sprites Sam marks as bad, for the in-house sprite tool to redo ----
  // Format (shared with the sprite tool): {"version":1,"flags":[{"id":"<species id>","side":"f"|"b","note":"..."}]}
  // Online (claude.ai link) they live in the page's database at sprite-flags/current, where Claude reads them directly.
  // In a local copy they live in this browser, and "Copy flags" / "Download flags" hand them over.
  const FL = { list: [], db: null, ref: null, mode: 'local' };
  const fkey = (id, side) => id + '_' + side;
  const flagOf = (id, side) => FL.list.find(f => f.id === id && f.side === side);
  const flagJSON = () => JSON.stringify({ version: 1, flags: FL.list }, null, 1);
  function loadLocalFlags() { try { const v = JSON.parse(store.get('flags') || '{}'); FL.list = Array.isArray(v.flags) ? v.flags : []; } catch (e) { FL.list = []; } }
  async function saveFlags() {
    FL.list.sort((a, b) => IDS.indexOf(a.id) - IDS.indexOf(b.id) || a.side.localeCompare(b.side));
    store.set('flags', flagJSON());
    if (FL.ref) { try { await FL.ref.set({ version: 1, flags: FL.list, updated: new Date().toISOString() }); FL.err = ''; } catch (e) { FL.err = 'Could not save to the online Journal (' + (e.code || 'error') + '). Your flags are kept in this browser; use Copy flags.'; } }
    afterFlags();
  }
  function afterFlags() { renderFlagbar(); markCells(); if (S.f === 'flag') filter(); show(S.i, true); }
  function renderFlagbar() {
    const n = FL.list.length, where = FL.mode === 'online' ? 'Saved online, Claude can read them.' : 'Saved in this browser.';
    $('flagbar').innerHTML = `<span><strong>${n}</strong> sprite${n === 1 ? '' : 's'} flagged as bad. ${where}</span>` +
      (n ? '<button id="fcopy">Copy flags</button>' + (FL.mode === 'local' ? '<button id="fdl">Download flags</button>' : '') : '') +
      (FL.err ? `<span style="color:var(--bad)">${FL.err}</span>` : '');
    const c = $('fcopy'); if (c) c.onclick = async () => { try { await navigator.clipboard.writeText(flagJSON()); c.textContent = 'Copied'; } catch (e) { c.textContent = 'Copy failed'; } setTimeout(() => c.textContent = 'Copy flags', 1800); };
    const d = $('fdl'); if (d) d.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([flagJSON()], { type: 'application/json' })); a.download = 'sprite-flags.json'; document.body.appendChild(a); a.click(); a.remove(); };
  }
  function markCells() {
    document.querySelectorAll('.cell').forEach(c => { const id = IDS[+c.dataset.i], on = flagOf(id, 'f') || flagOf(id, 'b'); let m = c.querySelector('.flagmark'); if (on && !m) { m = document.createElement('span'); m.className = 'flagmark'; m.textContent = '⚑'; m.title = 'Flagged as bad'; c.appendChild(m); } else if (!on && m) m.remove(); });
  }
  let pending = null;
  function toggleFlag(side) {
    const id = IDS[S.i], f = flagOf(id, side);
    if (f) { FL.list = FL.list.filter(x => x !== f); $('flagbox').hidden = true; pending = null; saveFlags(); return; }
    pending = side; $('flaglabel').textContent = `What looks wrong with the ${side === 'f' ? 'front' : 'back'}? (optional)`;
    $('flagnote').value = ''; $('flagbox').hidden = false; $('flagnote').focus();
  }
  async function initFlags() {
    loadLocalFlags(); renderFlagbar(); markCells();
    $('fl-f').onclick = () => toggleFlag('f'); $('fl-b').onclick = () => toggleFlag('b');
    $('flagbox').addEventListener('submit', e => { e.preventDefault(); if (!pending) return; FL.list.push({ id: IDS[S.i], side: pending, note: $('flagnote').value.trim() }); pending = null; $('flagbox').hidden = true; saveFlags(); });
    $('flagcancel').onclick = () => { pending = null; $('flagbox').hidden = true; };
    const db = window.claude && window.claude.use ? await window.claude.use('db').catch(() => null) : null;
    if (!db) return;
    FL.db = db; FL.ref = db.doc('sprite-flags/current'); FL.mode = 'online';
    const local = FL.list.slice(); let first = true;
    FL.ref.onSnapshot(snap => {
      const v = snap.exists ? snap.data() : null; FL.list = v && Array.isArray(v.flags) ? v.flags : [];
      if (first) { first = false; const extra = local.filter(l => !flagOf(l.id, l.side)); if (extra.length) { FL.list.push(...extra); saveFlags(); return; } }
      store.set('flags', flagJSON()); afterFlags();
    }, e => { FL.err = 'Lost touch with the online Journal (' + (e.code || 'error') + ').'; renderFlagbar(); });
  }

  const num = i => '#' + String(i + 1).padStart(3, '0');
  function paint(cv, id, o) {
    const s = creatureSprite(id, o.N, { hd: 1, back: !!o.back, shiny: !!o.shiny });
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cv.width, cv.height);
    x.drawImage(s, 0, 0, cv.width, cv.height);
  }
  const FRONT = { new: ['new', 'Front: new art'], old: ['old', 'Front: original code-drawn'] };
  const BACK = { new: ['new', 'Back: new art'], mirror: ['mirror', 'Back: none yet, shows the front flipped'], old: ['old', 'Back: original code-drawn'] };

  function show(i, keepBox) {
    if (!keepBox && (i + IDS.length) % IDS.length !== S.i) { pending = null; $('flagbox').hidden = true; }
    S.i = (i + IDS.length) % IDS.length;
    const id = IDS[S.i], sp = SPECIES[id], a = art(id);
    $('e-num').textContent = num(S.i);
    $('e-name').textContent = S.names ? sp.n : '';
    paint($('c-front'), id, { N: 80, shiny: S.shiny });
    paint($('c-back'), id, { N: 80, back: true, shiny: S.shiny });
    const ff = flagOf(id, 'f'), fb = flagOf(id, 'b'), esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    $('e-chips').innerHTML = [FRONT[a.f], BACK[a.b]].map(([c, t]) => `<span class="chip ${c}">${t}</span>`).join('') +
      [[ff, 'Front'], [fb, 'Back']].filter(x => x[0]).map(([f, w]) => `<span class="chip bad">⚑ ${w} flagged${f.note ? ': ' + esc(f.note) : ''}</span>`).join('');
    [['fl-f', ff], ['fl-b', fb]].forEach(([b, f]) => { $(b).setAttribute('aria-pressed', f ? 'true' : 'false'); $(b).textContent = f ? '⚑ Flagged (undo)' : '⚑ Flag as bad'; });
    $('e-types').innerHTML = S.names ? sp.types.map(t => `<span class="type" style="background:${TCOL[t]}">${t}</span>`).join('') : '';
    $('e-dex').textContent = S.names ? (sp.dex || '') : 'Names, types and Journal notes are hidden so the game stays a surprise. Press "Show names" to see them.';
    $('e-dex').className = S.names ? 'blurb' : 'hidden-note';
    document.querySelectorAll('.cell.on').forEach(c => c.classList.remove('on'));
    const cell = document.querySelector(`.cell[data-i="${S.i}"]`);
    if (cell) cell.classList.add('on');
    try { history.replaceState(null, '', '#no-' + String(S.i + 1).padStart(3, '0')); } catch (e) {}
  }

  function match(i) {
    const id = IDS[i], a = art(id), q = S.q.trim().toLowerCase().replace(/^#/, '');
    const ok = { all: true, newf: a.f === 'new', newb: a.b === 'new', needb: a.b !== 'new', oldf: a.f === 'old', flag: !!(flagOf(id, 'f') || flagOf(id, 'b')) }[S.f];
    if (!ok) return false;
    if (!q) return true;
    if (/^\d+$/.test(q)) return String(i + 1).padStart(3, '0').includes(q.padStart(Math.min(3, q.length), '0')) || String(i + 1) === q;
    return S.names && SPECIES[id].n.toLowerCase().includes(q);
  }
  function filter() {
    let n = 0;
    document.querySelectorAll('.cell').forEach(c => { const v = match(+c.dataset.i); c.hidden = !v; if (v) n++; });
    $('empty').hidden = n > 0;
  }

  function buildGrid() {
    const g = $('grid'), cells = [];
    IDS.forEach((id, i) => {
      const a = art(id), el = document.createElement('div');
      el.className = 'cell'; el.dataset.i = i; el.tabIndex = 0; el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'Journal ' + num(i));
      el.innerHTML = `<canvas width="96" height="96"></canvas><span class="n">${num(i)}</span><span class="dots"><i class="dot ${a.f}" title="${FRONT[a.f][1]}"></i><i class="dot ${a.b}" title="${BACK[a.b][1]}"></i></span>`;
      el.addEventListener('click', () => show(i));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
      g.appendChild(el); cells.push([el.firstChild, id]);
    });
    let k = 0;                                   // draw thumbnails a few at a time so the page stays responsive
    (function step() { const end = Math.min(cells.length, k + 12); for (; k < end; k++) paint(cells[k][0], cells[k][1], { N: 48, shiny: S.shiny }); if (k < cells.length) setTimeout(step, 0); })();
  }
  function repaintThumbs() { document.querySelectorAll('.cell').forEach(c => paint(c.firstChild, IDS[+c.dataset.i], { N: 48, shiny: S.shiny })); }

  function tally() {
    let nf = 0, nb = 0; IDS.forEach(id => { const a = art(id); if (a.f === 'new') nf++; if (a.b === 'new') nb++; });
    $('tally').innerHTML = `<span><strong>${IDS.length}</strong> Beasties</span><span><strong>${nf}</strong> new fronts</span><span><strong>${nb}</strong> new backs</span><span><strong>${IDS.length - nb}</strong> still need new back art</span>`;
  }

  function setToggle(btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  function applyLight() { document.querySelectorAll('.view').forEach(v => v.classList.toggle('light', S.light)); setToggle($('t-light'), S.light); }
  function init() {
    tally(); buildGrid(); applyLight(); setToggle($('t-names'), S.names);
    $('q').placeholder = S.names ? 'Find #number or name' : 'Find #number';
    $('prev').onclick = () => show(S.i - 1); $('next').onclick = () => show(S.i + 1);
    $('t-names').onclick = () => { S.names = !S.names; store.set('names', S.names ? '1' : '0'); setToggle($('t-names'), S.names); $('q').placeholder = S.names ? 'Find #number or name' : 'Find #number'; show(S.i); filter(); };
    $('t-shiny').onclick = () => { S.shiny = !S.shiny; setToggle($('t-shiny'), S.shiny); show(S.i); repaintThumbs(); };
    $('t-light').onclick = () => { S.light = !S.light; store.set('light', S.light ? '1' : '0'); applyLight(); };
    document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { S.f = b.dataset.f; document.querySelectorAll('[data-f]').forEach(x => setToggle(x, x === b)); filter(); });
    $('q').addEventListener('input', e => { S.q = e.target.value; filter(); });
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
      if (e.key === 'ArrowLeft') show(S.i - 1); else if (e.key === 'ArrowRight') show(S.i + 1);
      else if (e.key === 's' || e.key === 'S') $('t-shiny').click(); else if (e.key === 'b' || e.key === 'B') $('t-light').click();
    });
    initFlags();
    const m = /^#no-(\d+)$/.exec(location.hash); show(m ? Math.max(0, Math.min(IDS.length - 1, +m[1] - 1)) : 0);
    window.__dexReady = true;
  }
  loadAssets().then(init);
})();
