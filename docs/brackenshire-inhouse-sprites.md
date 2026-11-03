# Brackenshire in-house sprite painter (no SpriteCook credits)

Started 4 Oct 2026 after Sam asked whether new Beasties could be made here from what the SpriteCook templates taught us. First trial: journal entry after the Chapter 1 bird (its only evolution), front and rear, plus a rear view of the Chapter 1 bird itself. In the game since preview version 5. **Sam has not yet said whether the quality is good enough to roll out**; check the changelog before doing more.

## Method
1. **Paint large, then shrink** (`tools/inhouse/paint.py`). Shapes (ellipses, smoothed polygons) are filled on an 8x canvas with a light direction from the upper left, darker rims for roundness, feather scallops, flecks and strokes. `finish()` box-shrinks to battle size, cuts to about 36 colours and adds the dark outline tinted by the colour it borders. This is the same route the SpriteCook raws take (`tools/beasts20.py`), which is why the result sits beside them.
2. **Take the family colours from the base form.** Sample the palette of the existing sprite (`art/out/b_<base>_f.png`) and reuse it; add one or two new colours for the evolved stage. Keep the family's signature traits (for the bird: brown back, orange breast, cream eye ring, orange feet) and add features rather than only growing.
3. **Template habits to copy:** big round head, large glossy eye (dark rim, coloured iris, dark pupil, two glints), inner dark lines where one big part overlaps another (`p.edge`), far-side limbs darker, dark tips and bands for contrast, 60 to 80 px tall for a second stage (first stages are about 50).
4. **Rear views.** Either paint with `back=True` (no face, no belly markings, then mirror so it faces away), or derive one from an existing front (`tools/inhouse/pipwren_back.py`: mirror, keep the outer outline, repaint the face side as plumage with the sprite's own browns).
5. Save as `art/out/b_<id>_f.png` / `_b.png`, then `python3 tools/build_assets.py && python3 build.py`; `creatureSprite` picks them up by name. Check with `python3 test/birds.py brackenshire.html shots/birds_battle.png` (edit the species pair) and the regression script.

Honest limits: each species is hand-written code (roughly 60 lines and three or four look-and-fix passes), poses come out stiffer than SpriteCook's, and fur or complicated anatomy is harder than a bird. Good for evolutions of species that already have a template sprite and for rear views; less sure for brand-new complicated creatures.

## tools/inhouse/paint.py
```python
#!/usr/bin/env python3
# In-house sprite painter: shapes are painted large with soft shading and feather/fur texture, then shrunk to battle
# size, reduced to a small palette and given a dark outline, the same way the SpriteCook raws are turned into sprites.
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage

def hexrgb(h):
    if not isinstance(h, str): return np.asarray(h, float)
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)
def mix(a, b, t): return hexrgb(a) * (1 - t) + hexrgb(b) * t if isinstance(a, str) else a * (1 - t) + (hexrgb(b) if isinstance(b, str) else b) * t

class Paint:
    def __init__(s, size=80, ss=8):
        s.n, s.ss, s.N = size, ss, size * ss
        s.rgb = np.zeros((s.N, s.N, 3), float); s.a = np.zeros((s.N, s.N), bool)
        yy, xx = np.mgrid[0:s.N, 0:s.N]; s.xx, s.yy = xx / ss, yy / ss
    def poly(s, pts):
        im = Image.new('L', (s.N, s.N), 0); ImageDraw.Draw(im).polygon([(x * s.ss, y * s.ss) for x, y in pts], fill=255); return np.array(im) > 127
    def ell(s, cx, cy, rx, ry, rot=0):
        t = np.radians(rot); dx, dy = s.xx - cx, s.yy - cy
        u = dx * np.cos(t) + dy * np.sin(t); v = -dx * np.sin(t) + dy * np.cos(t)
        return (u / rx) ** 2 + (v / ry) ** 2 <= 1
    def smooth(s, m, r=1.2):   # round off polygon corners
        return ndimage.gaussian_filter(m.astype(float), r * s.ss) > .5
    def fill(s, m, col, light=.22, shade=.3, rim=.22, rimw=3.0, direction=(-.55, -.8), clip=None):
        if clip is not None: m = m & clip
        if not m.any(): return m
        col = hexrgb(col) if isinstance(col, str) else col
        ys, xs = np.where(m); cx, cy = xs.mean() / s.ss, ys.mean() / s.ss
        ext = max(xs.max() - xs.min(), ys.max() - ys.min()) / s.ss / 2 + 1e-6
        g = ((s.xx - cx) * direction[0] + (s.yy - cy) * direction[1]) / ext          # +1 toward the light
        g = np.clip(g, -1, 1)
        f = 1 + np.where(g > 0, g * light, g * shade)
        d = ndimage.distance_transform_edt(m) / s.ss                                   # darker toward the edge = roundness
        f *= (1 - rim) + rim * np.clip(d / rimw, 0, 1)
        out = np.clip(col[None, None, :] * f[..., None], 0, 255)
        s.rgb[m] = out[m]; s.a |= m; return m
    def tint(s, m, col, amount=.5):
        col = hexrgb(col) if isinstance(col, str) else col
        s.rgb[m] = s.rgb[m] * (1 - amount) + col * amount
    def edge(s, m, col='#1c1420', w=.55, amount=.75):
        # dark line just inside a shape's border, where it sits on top of other painted parts (an inner outline)
        k = max(1, int(w * s.ss)); er = ndimage.binary_erosion(m, iterations=k)
        s.tint(m & ~er & ndimage.binary_dilation(s.a & ~m, iterations=k + 1), col, amount)
    def scallops(s, m, step=4.0, size=2.2, col='#000000', amount=.3, angle=20, jitter=.35, seed=1):
        # rows of little feather arcs clipped to a shape
        rng = np.random.default_rng(seed); t = np.radians(angle)
        u = s.xx * np.cos(t) + s.yy * np.sin(t); v = -s.xx * np.sin(t) + s.yy * np.cos(t)
        row = np.floor(v / step); uu = (u + (row % 2) * step * .5) % step - step / 2; vv = v % step - step * .35
        arc = (np.abs(np.hypot(uu / (step * .5), vv / size) - 1) < .22) & (vv > 0)
        s.tint(m & arc, col, amount)
    def flecks(s, m, n=30, r=.7, col='#000000', amount=.5, seed=2):
        rng = np.random.default_rng(seed); ys, xs = np.where(m)
        if not len(xs): return
        for i in rng.integers(0, len(xs), n):
            cx, cy = xs[i] / s.ss, ys[i] / s.ss; s.tint(m & (((s.xx - cx) / (r * 1.4)) ** 2 + ((s.yy - cy) / r) ** 2 <= 1), col, amount)
    def stroke(s, pts, w, col, clip=None):
        im = Image.new('L', (s.N, s.N), 0); ImageDraw.Draw(im).line([(x * s.ss, y * s.ss) for x, y in pts], fill=255, width=max(1, int(w * s.ss)), joint='curve')
        m = np.array(im) > 127
        if clip is not None: m &= clip
        s.rgb[m] = hexrgb(col); s.a |= m; return m
    def dot(s, cx, cy, r, col, ry=None):
        m = s.ell(cx, cy, r, ry or r); s.rgb[m] = hexrgb(col); s.a |= m; return m
    def eye(s, cx, cy, r, iris='#e8901a', look=(-.25, 0), brow=None):
        # big glossy eye in the template manner: dark rim, coloured iris, dark pupil, two white glints
        s.dot(cx, cy, r * 1.12, '#1a1218', r * 1.2); s.dot(cx, cy, r * .92, iris, r)
        s.dot(cx + look[0] * r, cy + look[1] * r + r * .08, r * .62, '#1a1218', r * .72)
        s.dot(cx - r * .38, cy - r * .42, r * .3, '#ffffff'); s.dot(cx + r * .3, cy + r * .42, r * .16, '#e8f0ff')
        if brow: s.stroke([(cx - r * 1.5, cy - r * 1.25 + brow[0]), (cx + r * 1.3, cy - r * 1.25 + brow[1])], r * .45, '#1a1218')
    def finish(s, colors=34, outline='#1c1420', path=None, crop=True):
        ss = s.ss; A = s.a.reshape(s.n, ss, s.n, ss).mean(axis=(1, 3)); pm = (s.rgb * s.a[..., None]).reshape(s.n, ss, s.n, ss, 3).mean(axis=(1, 3))
        rgb = pm / np.maximum(A[..., None], 1e-6); al = A >= .5
        q = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), 'RGB').quantize(colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'); rgb = np.array(q).astype(float)
        # dark outline: the ring just outside the shape, tinted by what it borders
        ring = ndimage.binary_dilation(al, structure=np.ones((3, 3))[[0, 1, 2]][:, [0, 1, 2]] > 0) & ~al
        ring = ndimage.binary_dilation(al, structure=ndimage.generate_binary_structure(2, 1)) & ~al
        near = ndimage.uniform_filter(np.where(al[..., None], rgb, 0), size=(3, 3, 1)) / np.maximum(ndimage.uniform_filter(al.astype(float), size=3)[..., None], 1e-6)
        oc = hexrgb(outline); rgb[ring] = near[ring] * .22 + oc * .78; al = al | ring
        out = np.dstack([rgb, np.where(al, 255, 0)]).astype(np.uint8); out[~al] = 0
        im = Image.fromarray(out, 'RGBA')
        if crop: im = im.crop(im.getbbox())
        if path: im.save(path)
        return im
```

## tools/inhouse/galewing.py
```python
#!/usr/bin/env python3
# Galewing (the wren's evolution), painted in-house to sit beside the SpriteCook wren: same browns, orange breast,
# cream eye ring and orange feet; new for this stage: spread hovering wings with dark tips, a slate-blue cap and tail fan,
# a hooked beak and a sharper eye.
import sys; sys.path.insert(0, 'tools/inhouse')
from paint import Paint, mix
BR, BR_D, BR_L, BR_DD = '#86552b', '#5e3b1f', '#a4703e', '#3c2513'
OR, CREAM, CREAM_D = '#e77a06', '#f2deab', '#caa56a'
SLATE, SLATE_D, SLATE_L = '#6f86ad', '#465a80', '#9db2d2'
def galewing(path=None, back=False):
    p = Paint(80, 8)
    import numpy as np
    # --- far wing (behind the head), darker, pointed
    fw = p.smooth(p.poly([(35, 35), (28, 23), (21, 11), (14, 2), (21, 3), (22, 8), (27, 9), (29, 15), (34, 17), (37, 25), (42, 31)]), .55)
    p.fill(fw, mix(BR, '#241a2a', .3), light=.12, shade=.2, rimw=2.5); p.scallops(fw, 4.0, 2.2, '#1a1016', .3, angle=60, seed=3)
    p.fill(p.poly([(10, 0), (24, 0), (24, 10), (18, 12), (12, 6)]), BR_DD, clip=fw, rim=0, light=.05, shade=.1)
    # --- tail fan: slate, with a dark band and a cream tip
    tail = p.smooth(p.poly([(48, 53), (57, 55), (71, 60), (77, 67), (73, 75), (63, 78), (55, 73), (47, 62)]), 1.0)
    p.fill(tail, SLATE, light=.22, shade=.3, rimw=3)
    t = ((p.xx - 49) * 21 + (p.yy - 54) * 19) / (21 * 21 + 19 * 19)
    for k in range(5): p.stroke([(50 + k * 1.1, 55 + k * 1.6), (62 + k * 3.6, 77 - k * 3.4)], .4, SLATE_D, clip=tail)
    p.fill(tail & (t > .74) & (t <= .93), '#2c2434', rim=0, light=.05, shade=.1)
    p.fill(tail & (t > .93), CREAM, rim=0, light=.05, shade=.15)
    # --- body (tilted teardrop), brown back, cream belly flecked, orange breast
    body = p.ell(43, 48, 11, 14.5, rot=-30) | p.ell(48, 54, 7, 8)
    p.fill(body, BR, light=.2, shade=.34, rimw=4); p.edge(body, w=.6)
    if not back:
        belly = p.ell(37.5, 52, 8.5, 12, rot=-26); p.fill(belly, CREAM, clip=body, light=.12, shade=.22, rimw=3)
        breast = p.ell(34.5, 44.5, 8.5, 7.5); p.fill(breast, OR, clip=body & belly, light=.16, shade=.22, rimw=2.5)
        p.flecks(belly & body & ~breast, 14, .7, BR_D, .8, seed=5)
        p.scallops(body & ~belly, 3.8, 2.1, BR_DD, .3, angle=35, seed=4)
    else:
        p.scallops(body, 3.8, 2.1, BR_DD, .34, angle=35, seed=4)
    # --- feet tucked under
    for fx, fy in (() if back else ((37.5, 63.6), (44, 65.4))):
        p.stroke([(fx + .6, fy - 3.2), (fx, fy)], 1.5, mix(OR, '#3c2513', .25))
        p.fill(p.ell(fx, fy, 2.7, 1.9), OR, light=.1, shade=.2, rimw=1.5)
        for dx, ex in ((-2.3, -3.6), (0, -.4), (2.2, 2.8)): p.stroke([(fx + dx, fy + 1.2), (fx + ex, fy + 3.4)], .75, '#3c2513')
    # --- near wing: long and pointed with stepped flight feathers
    nw = p.smooth(p.poly([(38, 40), (45, 27), (55, 14), (66, 6), (76, 2), (75, 9), (71, 10), (71, 17), (66, 18), (65, 26), (60, 27), (58, 35), (53, 36), (50, 45), (43, 48)]), .5)
    p.fill(nw, BR_L, light=.24, shade=.3, rimw=3); p.edge(nw, w=.7)
    covert = p.smooth(p.poly([(38, 40), (45, 27), (53, 17), (58, 21), (55, 31), (49, 41), (43, 47)]), 1.0); p.fill(covert, BR, clip=nw, light=.2, shade=.26, rimw=2.6)
    p.scallops(covert & nw, 3.4, 1.9, BR_DD, .36, angle=-52, seed=6)
    prim = nw & ~covert
    for a0, a1 in (((57, 22), (74, 6)), ((56, 28), (70, 13)), ((55, 33), (65, 22)), ((52, 39), (59, 31))): p.stroke([a0, a1], .6, BR_DD, clip=prim)
    tt = ((p.xx - 38) * 38 + (p.yy - 40) * -38) / (38 * 38 * 2)
    p.fill(nw & (tt > .74), BR_DD, rim=0, light=.08, shade=.12)
    p.flecks(covert & nw, 8, .65, '#2a1a10', .7, seed=8)
    p.stroke([(38.5, 40.5), (45, 28), (54.5, 15), (65, 7.5)], .5, BR_DD, clip=nw)                 # leading edge
    if not back:
        # --- head: big and round like the wren's, slate cap, cream face, dark cheek stripe, hooked beak
        head = p.ell(26, 31, 12.4, 11.6)
        p.fill(head, BR, light=.22, shade=.3, rimw=3.5); p.edge(head, w=.7)
        face = p.ell(21.5, 33.5, 8.2, 8.4); p.fill(face, CREAM, clip=head, light=.06, shade=.16, rimw=2.5)
        cap = p.ell(28, 21.5, 14, 7.4, rot=-10); p.fill(cap, SLATE, clip=head, light=.28, shade=.22, rimw=2.2)
        p.stroke([(14.5, 26.2), (22, 24.6), (31, 25.6), (37.5, 28.5)], .5, SLATE_D, clip=head)       # cap edge
        p.stroke([(23.5, 35.5), (24.2, 39.2), (26.4, 42)], 1.5, BR_DD, clip=head)                    # cheek stripe
        p.eye(22.8, 30.6, 4.5, iris='#f2a01e', look=(-.25, .02), brow=(-.3, 1.5))
        beak = p.smooth(p.poly([(15.2, 31.2), (8.6, 32.6), (5.6, 36.6), (6.8, 39.8), (10.2, 37.2), (15.2, 37.2)]), .4); p.fill(beak, '#f6bd2a', light=.18, shade=.24, rimw=1.2)
        p.fill(p.poly([(3, 36.4), (9.2, 35.6), (9.6, 41), (3, 41)]), '#3c2513', clip=beak, rim=0, light=0, shade=0)
        p.fill(p.smooth(p.poly([(36, 19.5), (44, 13.5), (42, 20), (46.5, 21.5), (38.5, 26.5)]), .4), SLATE_D, light=.2, shade=.2, rimw=1.5)   # crest tuft
    else:
        # rear three-quarter view: the back of the head, cap and crest, with only the beak tip showing
        beak = p.smooth(p.poly([(16, 31.5), (11, 33.4), (10, 36.4), (15.5, 36.6)]), .4); p.fill(beak, '#f6bd2a', light=.18, shade=.24, rimw=1.2)
        head = p.ell(26, 31, 12.4, 11.6); p.fill(head, BR, light=.22, shade=.3, rimw=3.5); p.edge(head, w=.7)
        cap = p.ell(28.5, 25.5, 14, 10.5, rot=-10); p.fill(cap, SLATE, clip=head, light=.28, shade=.22, rimw=2.6)
        p.stroke([(15, 30.5), (22, 33.6), (31, 34.4), (37.6, 32.2)], .5, SLATE_D, clip=head)
        p.scallops(head & ~cap, 3.2, 1.8, BR_DD, .3, angle=20, seed=9)
        p.fill(p.smooth(p.poly([(36, 19.5), (44, 13.5), (42, 20), (46.5, 21.5), (38.5, 26.5)]), .4), SLATE_D, light=.2, shade=.2, rimw=1.5)
    im = p.finish(colors=36)
    if back: im = im.transpose(0)      # mirrored, so it faces away from the player
    if path: im.save(path)
    return im
if __name__ == '__main__':
    bk = galewing('art/out/b_galewing_b.png', back=True); im = galewing('art/out/b_galewing_f.png'); print('galewing', im.size, bk.size)
    from PIL import Image
    S = 6; wren = Image.open('art/out/b_pipwren_f.png'); fox = Image.open('art/out/b_cindle_f.png')
    sh = Image.new('RGBA', ((wren.width + im.width + fox.width + 40) * S, 84 * S), '#c8d8a0'); x = 8
    for s in (wren, im, fox): sh.alpha_composite(s.resize((s.width * S, s.height * S), Image.NEAREST), (x * S, (82 - s.height) * S)); x += s.width + 12
    sh.alpha_composite(bk.resize((bk.width * 2, bk.height * 2), Image.NEAREST), (4, 4)); sh.convert('RGB').save('shots/view.png')
```

## tools/inhouse/pipwren_back.py
```python
#!/usr/bin/env python3
# Rear view of the wren made from its own front sprite: mirrored so it faces away, with the face, eye ring and breast
# repainted as back feathers using the browns already in the sprite. No new art credits.
from PIL import Image
import numpy as np, colorsys
src = Image.open('art/out/b_pipwren_f.png').convert('RGBA').transpose(0)
a = np.array(src).astype(float); h, w = a.shape[:2]
ramp = [np.array(c, float) for c in ((60, 37, 19), (94, 59, 31), (118, 76, 38), (134, 85, 43), (150, 100, 52), (164, 112, 62))]
rng = np.random.default_rng(4)
from scipy import ndimage
alpha = a[..., 3] > 127; lum = (a[..., :3] * [.3, .59, .11]).sum(-1)
edge = alpha & ~ndimage.binary_erosion(alpha, iterations=1)       # the outer outline, which stays
out = a.copy(); feet_y = int(h * .84); x0 = int(w * .40)
yy, xx = np.mgrid[0:h, 0:w]
# repaint the face side as plumage: smooth round shading, lit from the upper left like the rest
cx, cy, R = w * .6, h * .47, h * .5
g = ((xx - cx) * -.5 + (yy - cy) * -.8) / R
k = np.clip(np.round(2.6 + g * 3.2 + rng.normal(0, .18, g.shape)), 0, len(ramp) - 1).astype(int)
fade = np.clip((xx - x0) / 5.0, 0, 1)                               # blend into the untouched back
for y in range(h):
    for x in range(w):
        if not alpha[y, x] or edge[y, x] or y >= feet_y: continue
        pale = lum[y, x] > 150 or (a[y, x, 0] > 190 and a[y, x, 2] < 90)
        if x < x0 and not pale: continue
        if x >= x0 and not pale and rng.random() > fade[y, x]: continue
        out[y, x, :3] = ramp[k[y, x]]
m = (np.abs(out[..., :3] - a[..., :3]).sum(-1) > 0)
for cy_ in range(9, feet_y - 2, 5):
    for cx_ in range(x0 + (cy_ // 5 % 2) * 3, w, 6):
        for dx, dy in ((-1, 0), (0, 1), (1, 0)):
            x, y = cx_ + dx, cy_ + dy
            if 0 <= x < w and 0 <= y < h and m[y, x] and not edge[y, x]: out[y, x, :3] = out[y, x, :3] * .74
Image.fromarray(out.astype(np.uint8), 'RGBA').save('art/out/b_pipwren_b.png')
S = 6; im = Image.open('art/out/b_pipwren_b.png'); sh = Image.new('RGBA', ((src.width * 2 + 12) * S, (h + 8) * S), '#c8d8a0')
sh.alpha_composite(Image.open('art/out/b_pipwren_f.png').resize((w * S, h * S), Image.NEAREST), (4 * S, 4 * S)); sh.alpha_composite(im.resize((w * S, h * S), Image.NEAREST), ((w + 8) * S, 4 * S))
sh.convert('RGB').save('shots/wren_back.png'); print(im.size)
```

## test/birds.py
```python
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
```
