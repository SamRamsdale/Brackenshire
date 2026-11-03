#!/usr/bin/env python3
import sys, asyncio, os
from playwright.async_api import async_playwright
html = os.path.abspath(sys.argv[1])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); Object.assign(G, { party: [newMon('cindle', 12, {shiny:false})], flags: { intro: 1, starter: 'cindle' } }); loadMap('route1', 10, 20, 'down'); G.scene = 'world'; FADE = 0; G.lock++; window.__b = 0; battle({ wild: newMon('burrabit', 3, {shiny:false}) }).then(() => { G.lock--; window.__b = 1; }); 0")
        box = await pg.locator('canvas').first.bounding_box()
        async def click(x, y, button='left'): await pg.mouse.click(box['x'] + x / 256 * box['width'], box['y'] + y / 192 * box['height'], button=button)
        top = lambda: pg.evaluate("UI.length ? UI[UI.length - 1].constructor.name : ''")
        ok = []
        for _ in range(40):
            if await top() == 'ActionMenu': break
            await click(128, 100); await pg.wait_for_timeout(250)
        ok.append(('clicks advance messages to the action menu', await top() == 'ActionMenu'))
        await click(160, 155); await pg.wait_for_timeout(300); ok.append(('clicking FIGHT opens the moves', await top() == 'MoveMenu'))
        await click(128, 60, 'left'); await pg.wait_for_timeout(300); ok.append(('clicking the scene goes back', await top() == 'ActionMenu'))
        await click(160, 155); await pg.wait_for_timeout(300)
        await click(60, 155); await pg.wait_for_timeout(600); ok.append(('clicking a move uses it', await top() != 'MoveMenu'))
        for _ in range(60):
            if await pg.evaluate("window.__b"): break
            t = await top()
            if t == 'ActionMenu': await click(160, 155); await pg.wait_for_timeout(250); await click(60, 155)
            else: await click(128, 100)
            await pg.wait_for_timeout(300)
        ok.append(('battle can be finished by mouse alone', bool(await pg.evaluate("window.__b"))))
        await pg.evaluate("UI.length = 0; push(new StartMenu()); 0"); await pg.wait_for_timeout(200)
        await click(128, 100, 'right'); await pg.wait_for_timeout(250); ok.append(('right-click closes a menu', await top() == ''))
        ok.append(('no script errors', not errs))
        for n, v in ok: print(('PASS ' if v else 'FAIL ') + n)
        if errs: print(errs[:3])
        await b.close()
asyncio.run(main())
