#!/usr/bin/env python3
# Usage: sheet.py build.html out.png "<js that returns a canvas>"   -> saves the canvas as a PNG
import sys, asyncio, os, base64
from playwright.async_api import async_playwright
html, out, js = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        data = await pg.evaluate('(() => { const c = (' + js + ')(); return c.toDataURL("image/png"); })()')
        open(out, 'wb').write(base64.b64decode(data.split(',')[1])); print('saved', out, 'errors:', errs[:3])
        await b.close()
asyncio.run(main())
