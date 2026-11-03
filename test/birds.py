#!/usr/bin/env python3
# Battle screenshots of the bird line (front as the foe, rear view as the player's own). Usage: birds.py build.html out.png
import sys, asyncio, os, io
from playwright.async_api import async_playwright
from PIL import Image
html = os.path.abspath(sys.argv[1]); out = sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1100, 'height': 860})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); try { localStorage.clear(); } catch (e) {} 0")
        await pg.mouse.click(550, 400); await pg.keyboard.press('z')
        for _ in range(120):
            if await pg.evaluate("G.scene === 'world' && !UI.length && !G.lock"): break
            await pg.keyboard.press('z'); await pg.wait_for_timeout(120)
        shots = []
        for mine, foe in (('pipwren', 'galewing'), ('galewing', 'pipwren')):
            await pg.evaluate(f"UI.length = 0; G.party = [newMon('{mine}', 22, {{shiny:false}})]; loadMap('route1', 10, 20, 'down'); G.lock++; battle({{ wild: newMon('{foe}', 20, {{shiny:false}}) }}).then(() => {{ G.lock--; }}); 0")
            for _ in range(14): await pg.keyboard.press('z'); await pg.wait_for_timeout(260)
            await pg.wait_for_timeout(500)
            shots.append(Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB'))
            await pg.reload(); await pg.wait_for_function('window.__ready === true', timeout=15000)
            await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); 0")
            await pg.mouse.click(550, 400); await pg.keyboard.press('z')
            for _ in range(120):
                if await pg.evaluate("G.scene === 'world' && !UI.length && !G.lock"): break
                await pg.keyboard.press('z'); await pg.wait_for_timeout(120)
        w = sum(s.width for s in shots) + 12; sh = Image.new('RGB', (w, shots[0].height), '#202020'); x = 0
        for s in shots: sh.paste(s, (x, 0)); x += s.width + 12
        sh.save(out); print('saved', out, sh.size, 'errors:', errs[:3])
        await b.close()
asyncio.run(main())
