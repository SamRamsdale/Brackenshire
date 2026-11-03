#!/usr/bin/env python3
# Sprite checker: looks over the Beastie sprites in art/out/ and reports, in plain words, anything that breaks the
# style guide (docs/brackenshire-style-guide.md). Run it after adding or changing art.
#   python3 tools/check_sprites.py                 every Beastie sprite
#   python3 tools/check_sprites.py pipwren cindle  only these
#   python3 tools/check_sprites.py --strict        exit with an error if any sprite FAILS (for automatic checks)
# FAIL = will look wrong in the game.  WARN = probably off-style, have a look.  NOTE = good to know.
import sys, os, glob
import numpy as np
from PIL import Image
from scipy import ndimage
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(root, 'art/out')
BOX = 80          # foe battle box (style guide); the game shrinks anything taller than 76 px to fit
LUM = np.array([.299, .587, .114])

def load(path):
    a = np.array(Image.open(path).convert('RGBA')).astype(int); return a, a[..., 3] >= 128

def issues(path):
    """List of (level, message) for one sprite file."""
    a, al = load(path); rgb = a[..., :3]; out = []
    if not al.any(): return [('FAIL', 'the image is empty')]
    ys, xs = np.where(al); h, w = np.ptp(ys) + 1, np.ptp(xs) + 1
    # 1. see-through edges: the game only shows fully solid or fully clear pixels
    semi = ((a[..., 3] > 0) & (a[..., 3] < 255)).sum()
    if semi > 0: out.append(('FAIL', f'{semi} half-see-through pixels (soft edges vanish or go jagged in the game)'))
    # 2. size
    if max(w, h) > 120: out.append(('FAIL', f'far too big ({w}x{h} px); battle sprites fit an {BOX} px box'))
    elif h > BOX + 8 or w > BOX + 8: out.append(('NOTE', f'{w}x{h} px, the game shrinks it to fit the {BOX} px box (it may look softer)'))
    elif max(w, h) < 30: out.append(('WARN', f'very small ({w}x{h} px), it will look tiny in battle'))
    # 3. colours
    cols = len({tuple(c) for c in rgb[al]})
    if cols > 64: out.append(('WARN', f'{cols} colours; the look uses small palettes (about 16 to 48)'))
    # 4. outline: the border pixels should be dark, and dark brown or purple rather than pure black
    edge = al & ~ndimage.binary_erosion(al)
    el = (rgb[edge] * LUM).sum(-1)
    dark = (el < 90).mean()
    if dark < .6: out.append(('WARN', f'outline is patchy (only {dark:.0%} of the edge is dark)'))
    black = (rgb[edge].max(-1) < 12).mean()
    if black > .5: out.append(('NOTE', f'outline is mostly pure black ({black:.0%}); the guide prefers a dark coloured outline'))
    # 5. light from the top-left: the upper-left half should be brighter than the lower-right half
    inner = ndimage.binary_erosion(al, iterations=2)
    if inner.sum() > 40:
        yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]; s = (xx - xs.mean()) + (yy - ys.mean())
        lum = (rgb * LUM).sum(-1); diff = lum[inner & (s < 0)].mean() - lum[inner & (s > 0)].mean()
        if diff < -15: out.append(('WARN', 'looks lit from the right; the game lights everything from the top-left'))
    # 6. a ground shadow baked into the sprite (the game draws its own)
    bottom = al[ys.max() - 2: ys.max() + 1]
    if bottom.any():
        bl = (rgb[ys.max() - 2: ys.max() + 1][bottom] * LUM).sum(-1)
        sat = np.ptp(rgb[ys.max() - 2: ys.max() + 1][bottom], axis=-1)
        if bottom.any(0).sum() > .7 * w and (bl < 70).mean() > .8 and sat.mean() < 30:
            out.append(('WARN', 'flat dark strip along the bottom, possibly a baked-in ground shadow'))
    return out

def check_species(id, side):
    """Lines of text for the preview sheet."""
    label = 'Front' if side == 'f' else 'Back'
    p = os.path.join(OUT, f'b_{id}_{side}.png')
    if not os.path.exists(p):
        if side == 'b' and os.path.exists(os.path.join(OUT, f'b_{id}_f.png')): return [f'{label}: NOTE no back art yet', '  (the game shows the front, turned round)']
        return [f'{label}: NOTE still the old code-drawn art']
    found = issues(p)
    if not found: return [f'{label}: OK']
    return [f'{label}:'] + [f'  {lv} {msg}' for lv, msg in found]

def main(argv):
    strict = '--strict' in argv; ids = [x for x in argv if not x.startswith('--')]
    files = sorted(glob.glob(os.path.join(OUT, 'b_*.png')))
    if ids: files = [f for f in files if os.path.basename(f)[2:-6] in ids]
    counts = {'FAIL': 0, 'WARN': 0, 'NOTE': 0}; fronts = set(); backs = set()
    for f in files:
        name = os.path.basename(f)[:-4]; (fronts if name.endswith('_f') else backs).add(name[2:-2])
        found = issues(f)
        for lv, msg in found: counts[lv] += 1; print(f'{lv:4s}  {name:22s} {msg}')
    no_back = sorted(fronts - backs)
    print(f'\n{len(files)} sprites checked: {counts["FAIL"]} fail, {counts["WARN"]} warn, {counts["NOTE"]} note.')
    if no_back and not ids: print(f'{len(no_back)} Beasties have new front art but no back view yet.')
    return 1 if strict and counts['FAIL'] else 0

if __name__ == '__main__': sys.exit(main(sys.argv[1:]))
