#!/usr/bin/env python3
# Regression + UI contact sheet. Usage: regress.py build.html [out.png]
import sys, asyncio, os, io
from playwright.async_api import async_playwright
from PIL import Image
html = os.path.abspath(sys.argv[1]); out = sys.argv[2] if len(sys.argv) > 2 else None
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); try { localStorage.clear(); } catch (e) {} 0")
        shots = []; checks = []
        async def snap(): shots.append(Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB'))
        async def idle(maxp=80):
            for _ in range(maxp):
                if await pg.evaluate("G.scene === 'world' && !UI.length && !G.lock"): return True
                await pg.keyboard.press('z'); await pg.wait_for_timeout(120)
            return False
        # 1 new game through the intro
        await pg.mouse.click(600, 400); await pg.keyboard.press('z'); await pg.wait_for_timeout(1500); await snap()
        checks.append(('new game reaches the world', await idle(120)))
        # 2 walking
        x0 = await pg.evaluate("[G.pl.x, G.pl.y]")
        for k in ['ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowRight']:
            await pg.keyboard.down(k); await pg.wait_for_timeout(260); await pg.keyboard.up(k); await pg.wait_for_timeout(120)
        x1 = await pg.evaluate("[G.pl.x, G.pl.y]"); checks.append(('player walks', x0 != x1)); await snap()
        # 3 menus
        await pg.evaluate("G.party = [newMon('cindle', 9, {shiny:false}), newMon('splotter', 8, {shiny:false}), newMon('sproutle', 8, {shiny:true}), newMon('burrabit', 5, {shiny:false})]; G.flags.starter = 'cindle'; ['cindle','splotter','sproutle','burrabit'].forEach(s => { G.seen[s] = 1; G.caught[s] = 1; }); 0")
        for cls, arg in [('PartyScreen', ''), ('SummaryScreen', '0'), ('CardScreen', ''), ('JournalScreen', ''), ('StartMenu', '')]:
            await pg.evaluate(f"window.__ui = new {cls}({arg}); push(window.__ui); 0"); await pg.wait_for_timeout(350); await snap()
            await pg.evaluate("window.__ui.done(); UI.length = 0; 0"); await pg.wait_for_timeout(100)
        checks.append(('menus open and close', await pg.evaluate("UI.length === 0")))
        # 4 wild battle (template sprite as the foe) and a catch attempt
        await pg.evaluate("loadMap('route1', 10, 20, 'down'); G.bag.leyorb = 5; G.lock++; window.__b = 0; battle({ wild: newMon('splotter', 3, {shiny:false}) }).then(() => { G.lock--; window.__b = 1; }); 0")
        await pg.wait_for_timeout(2800)
        for i in range(3): await pg.keyboard.press('z'); await pg.wait_for_timeout(1300)
        await snap()
        for i in range(60):
            if await pg.evaluate("window.__b"): break
            await pg.keyboard.press('z'); await pg.wait_for_timeout(350)
        checks.append(('wild battle finishes', bool(await pg.evaluate("window.__b"))))
        # 5 trainer battle intro
        await pg.evaluate("healAll(); G.lock++; window.__b = 0; battle({ trainer: { name: 'Blight Grunt', look: 'grunt', party: [['burrabit', 3]], prize: 10 } }).then(() => { G.lock--; window.__b = 1; }); 0")
        await pg.wait_for_timeout(2300); await snap()
        for i in range(80):
            if await pg.evaluate("window.__b"): break
            await pg.keyboard.press('z'); await pg.wait_for_timeout(300)
        checks.append(('trainer battle finishes', bool(await pg.evaluate("window.__b"))))
        # 6 map change on foot, every chapter 1 map draws
        await pg.evaluate("UI.length = 0; G.scene = 'world'; loadMap('hollowmere', 10, 3, 'up'); 0")
        for i in range(6): await pg.keyboard.down('ArrowUp'); await pg.wait_for_timeout(300); await pg.keyboard.up('ArrowUp'); await idle(6)
        checks.append(('walks into the next map', await pg.evaluate("G.map.id") != 'hollowmere'))
        ok = await pg.evaluate("(() => { for (const id in MAPS) { try { loadMap(id, 2, 2, 'down'); drawWorld(); } catch (e) { return id + ': ' + e.message; } } return 'ok'; })()")
        checks.append(('every map draws (' + str(ok) + ')', ok == 'ok'))
        checks.append(('no script errors', not errs))
        for n, v in checks: print(('PASS ' if v else 'FAIL ') + n)
        if errs: print('errors:', errs[:6])
        print('ALL PASS' if all(v for _, v in checks) else 'SOME FAILED')
        if out:
            w, h = shots[0].size; cols = 3; rows = (len(shots) + cols - 1) // cols; k = 3
            sh = Image.new('RGB', (cols * (w // k) + (cols - 1) * 4, rows * (h // k) + (rows - 1) * 4))
            for i, im in enumerate(shots): sh.paste(im.resize((w // k, h // k), Image.LANCZOS), ((i % cols) * (w // k + 4), (i // cols) * (h // k + 4)))
            sh.save(out)
        await b.close()
asyncio.run(main())
