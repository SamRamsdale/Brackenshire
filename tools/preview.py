#!/usr/bin/env python3
# Preview sheet: shows Beasties the way the game draws them, so new art can be judged at a glance.
# Each row is one Beastie: a real battle screenshot (front view as the wild Beastie, back view as yours), then the
# walking follower facing down, left, right and up on grass, then the sprite checker's verdict.
#   python3 tools/preview.py sproutle pipwren            named Beasties
#   python3 tools/preview.py --random 3                  random Beasties that have new art
#   python3 tools/preview.py --pool burrabit,pipwren,buzzlet --random 2
#   -o shots/preview.png   (default)        --html brackenshire.html   (default; run build.py first)
# Rows are labelled by Journal number only, so the sheet does not give names away.
import sys, os, io, asyncio, random, argparse, base64, glob
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_sprites
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SETUP = "showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); try { localStorage.clear(); } catch (e) {} 0"
FOLLOW = """(id) => {
  const cw = 64, ch = 56, dirs = ['down', 'left', 'right', 'up'];
  const [c, x] = mk(cw * 4, ch);
  for (let tx = 0; tx < cw * 4; tx += 32) for (let ty = 0; ty < ch; ty += 32) { x.save(); x.translate(tx, ty); hdGrass(x, (tx / 32 + ty / 16) % 5); x.restore(); }
  dirs.forEach((d, i) => {
    const back = d === 'up', flip = d === 'right' && !back;
    const img = creatureSprite(id, 24, { back, hd: 1 });
    const X = i * cw + (cw - img.width) / 2, Y = ch - img.height - 2;
    x.fillStyle = 'rgba(20,30,20,.22)'; x.beginPath(); x.ellipse(i * cw + cw / 2, ch - 5, 12, 4, 0, 0, Math.PI * 2); x.fill();
    x.save(); if (flip) { x.translate(X + img.width, Y); x.scale(-1, 1); x.drawImage(img, 0, 0); } else x.drawImage(img, X, Y); x.restore();
  });
  return c.toDataURL('image/png');
}"""

async def ready(pg, html):
    await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=20000)
    await pg.evaluate(SETUP)
    await pg.mouse.click(550, 400); await pg.keyboard.press('z')
    for _ in range(150):
        if await pg.evaluate("G.scene === 'world' && !UI.length && !G.lock"): return
        await pg.keyboard.press('z'); await pg.wait_for_timeout(100)

async def shoot(ids, html):
    rows = []
    async with async_playwright() as p:
        exe = '/opt/pw-browsers/chromium'                 # the cloud workspace's browser; elsewhere Playwright's own
        b = await p.chromium.launch(executable_path=exe) if os.path.exists(exe) else await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1100, 'height': 860})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        for id in ids:
            await ready(pg, html)
            num = await pg.evaluate(f"DEX_ORDER.indexOf('{id}') + 1")
            fol = await pg.evaluate(f"({FOLLOW})('{id}')")
            await pg.evaluate(f"UI.length = 0; G.party = [newMon('{id}', 20, {{shiny:false}})]; G.party[0].nick = '#{num:03d}'; loadMap('route1', 10, 20, 'down'); G.lock++; const w = newMon('{id}', 20, {{shiny:false}}); w.nick = '#{num:03d}'; battle({{ wild: w }}).then(() => {{ G.lock--; }}); 0")
            for _ in range(40):                           # click through the intro until the FIGHT/BAG menu is up
                if await pg.evaluate("UI.length && UI[UI.length - 1] instanceof ActionMenu"): break
                await pg.keyboard.press('z'); await pg.wait_for_timeout(200)
            await pg.wait_for_timeout(1200)               # let the slide-in and flashes settle
            bat = Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB')
            rows.append((id, num, bat, Image.open(io.BytesIO(base64.b64decode(fol.split(',')[1]))).convert('RGB')))
        await b.close()
    if errs: print('page errors:', errs[:3])
    return rows

def sheet(rows, out):
    S = 3; bw = 480                                       # battle shot width on the sheet; followers scaled S times
    bh = round(rows[0][2].height * bw / rows[0][2].width)
    fw, fh = rows[0][3].width * S, rows[0][3].height * S
    notew = 330; W = bw + 24 + fw + 24 + notew + 24; RH = max(bh, fh + 40) + 24
    sh = Image.new('RGB', (W, 44 + RH * len(rows)), '#1e1a24'); d = ImageDraw.Draw(sh)
    d.text((12, 12), 'Battle (front = wild, back = yours)', fill='#e8dcc8')
    d.text((bw + 36, 12), 'Following you: down, left, right, up', fill='#e8dcc8')
    d.text((bw + fw + 60, 12), 'Sprite check', fill='#e8dcc8')
    for i, (id, num, bat, fol) in enumerate(rows):
        y = 44 + i * RH
        sh.paste(bat.resize((bw, bh), Image.LANCZOS), (12, y))
        d.text((bw + 36, y), f'Journal #{num:03d}', fill='#ffd88a')
        sh.paste(fol.resize((fw, fh), Image.NEAREST), (bw + 36, y + 20))
        ty = y
        for side in ('f', 'b'):
            res = check_sprites.check_species(id, side)
            for line in res: d.text((bw + fw + 60, ty), line, fill='#e8dcc8' if not line.startswith('  ') else '#b8acc8'); ty += 15
            ty += 6
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True); sh.save(out); print('saved', out, sh.size)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('ids', nargs='*'); ap.add_argument('--random', type=int, default=0)
    ap.add_argument('--pool', default=''); ap.add_argument('-o', default=os.path.join(root, 'shots/preview.png'))
    ap.add_argument('--html', default=os.path.join(root, 'brackenshire.html')); a = ap.parse_args()
    ids = list(a.ids)
    if a.random:
        pool = a.pool.split(',') if a.pool else sorted({os.path.basename(f)[2:-6] for f in glob.glob(os.path.join(root, 'art/out/b_*_f.png'))})
        pool = [p for p in pool if p not in ids]; ids += random.sample(pool, min(a.random, len(pool)))
    if not ids: sys.exit('name some Beasties or use --random N')
    sheet(asyncio.run(shoot(ids, os.path.abspath(a.html))), a.o)
