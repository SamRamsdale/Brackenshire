#!/usr/bin/env python3
# Usage: at.py build.html out.png map,x,y[,dir] [map,x,y ...]  -> screenshots tiled 2 across (half size)
import sys, asyncio, os, io
from playwright.async_api import async_playwright
from PIL import Image
html, out, spots = os.path.abspath(sys.argv[1]), sys.argv[2], [a.split(',') for a in sys.argv[3:]]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => window.__tod || 'day'; setSound(false); Object.assign(G, { party: [newMon('cindle', 9, {shiny:false})], flags: { intro: 1, starter: 'cindle' } }); loadMap('home', 7, 3, 'down'); G.scene = 'world'; FADE = 0; 0")
        ims = []
        for s in spots:
            tod = s[4] if len(s) > 4 else 'day'
            await pg.evaluate("([m,x,y,d,t]) => { window.__tod = t; loadMap(m, +x, +y, d || 'down'); G.banner = null; }", [s[0], s[1], s[2], s[3] if len(s) > 3 else 'down', tod])
            await pg.wait_for_timeout(350)
            ims.append(Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB'))
        w, h = ims[0].size; k = 1 if len(ims) == 1 else 2; cols = min(2, len(ims)); rows = (len(ims) + cols - 1) // cols
        sh = Image.new('RGB', (cols * (w // k) + (cols - 1) * 4, rows * (h // k) + (rows - 1) * 4))
        for i, im in enumerate(ims): sh.paste(im.resize((w // k, h // k), Image.LANCZOS) if k > 1 else im, ((i % cols) * (w // k + 4), (i // cols) * (h // k + 4)))
        sh.save(out); print('saved', out, sh.size, 'errors:', errs[:3])
        await b.close()
asyncio.run(main())
