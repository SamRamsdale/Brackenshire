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
  const num = i => '#' + String(i + 1).padStart(3, '0');
  function paint(cv, id, o) {
    const s = creatureSprite(id, o.N, { hd: 1, back: !!o.back, shiny: !!o.shiny });
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cv.width, cv.height);
    x.drawImage(s, 0, 0, cv.width, cv.height);
  }
  const FRONT = { new: ['new', 'Front: new art'], old: ['old', 'Front: original code-drawn'] };
  const BACK = { new: ['new', 'Back: new art'], mirror: ['mirror', 'Back: none yet, shows the front flipped'], old: ['old', 'Back: original code-drawn'] };

  function show(i) {
    S.i = (i + IDS.length) % IDS.length;
    const id = IDS[S.i], sp = SPECIES[id], a = art(id);
    $('e-num').textContent = num(S.i);
    $('e-name').textContent = S.names ? sp.n : '';
    paint($('c-front'), id, { N: 80, shiny: S.shiny });
    paint($('c-back'), id, { N: 80, back: true, shiny: S.shiny });
    $('e-chips').innerHTML = [FRONT[a.f], BACK[a.b]].map(([c, t]) => `<span class="chip ${c}">${t}</span>`).join('');
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
    const ok = { all: true, newf: a.f === 'new', newb: a.b === 'new', needb: a.b !== 'new', oldf: a.f === 'old' }[S.f];
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
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') show(S.i - 1); else if (e.key === 'ArrowRight') show(S.i + 1);
      else if (e.key === 's' || e.key === 'S') $('t-shiny').click(); else if (e.key === 'b' || e.key === 'B') $('t-light').click();
    });
    const m = /^#no-(\d+)$/.exec(location.hash); show(m ? Math.max(0, Math.min(IDS.length - 1, +m[1] - 1)) : 0);
    window.__dexReady = true;
  }
  loadAssets().then(init);
})();
