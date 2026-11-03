// ---- mouse ----

// ================= MOUSE / TOUCH =================
// Menus register clickable areas while they draw (hot). Pointing at one moves the selection there; clicking
// confirms it. A click where the top screen has no areas (messages, summaries) counts as Confirm, right-click
// is Back, and the wheel moves the selection up and down. Everything still works from the keyboard.
const HOT = []; let HOTOWNER = null;
const MOUSE = { x: -1, y: -1, moved: false, click: false, back: false, wheel: 0 };
function hot(x, y, w, h, hover, click) { HOT.push({ x, y, w, h, hover, click, ui: HOTOWNER }); }
function mouseStep() {
  const top = UI.length ? UI[UI.length - 1] : null, act = HOT.filter(r => r.ui === top);
  let hit = null; for (const r of act) if (MOUSE.x >= r.x && MOUSE.x < r.x + r.w && MOUSE.y >= r.y && MOUSE.y < r.y + r.h) hit = r;
  cv.style.cursor = hit ? 'pointer' : 'default';
  if (hit && (MOUSE.moved || MOUSE.click) && hit.hover) hit.hover();
  if (MOUSE.click) { if (hit) { if (hit.click) hit.click(); else pressed.a = true; } else if (!act.length) pressed.a = true; }
  if (MOUSE.back) pressed.b = true;
  if (MOUSE.wheel) pressed[MOUSE.wheel > 0 ? 'down' : 'up'] = true;
  MOUSE.moved = MOUSE.click = MOUSE.back = false; MOUSE.wheel = 0;
}
(() => {
  const at = e => { const r = cv.getBoundingClientRect(); MOUSE.x = (e.clientX - r.left) / r.width * W; MOUSE.y = (e.clientY - r.top) / r.height * H; };
  cv.addEventListener('pointermove', e => { at(e); MOUSE.moved = true; });
  cv.addEventListener('pointerdown', e => { at(e); if (e.button === 2) MOUSE.back = true; else if (e.button === 0) MOUSE.click = true; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('wheel', e => { e.preventDefault(); MOUSE.wheel = Math.sign(e.deltaY); }, { passive: false });
})();