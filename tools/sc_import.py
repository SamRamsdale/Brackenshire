#!/usr/bin/env python3
# Bring SpriteCook images (downloaded to art/sc/) into the game's sprite folder at the right size.
#   art/sc/<id>_b.png        -> art/out/b_<id>_b.png  (back: about the front's height, at most 88 px; the player's
#                                                      Beastie is drawn in a 96 px box, so up to ~91 px shows unscaled)
#   art/sc/<id>_f_raw.png    -> art/out/b_<id>_f.png  (new front: height from FRONT_H, or 64 px)
# Larger images are shrunk with a box filter on premultiplied colour, then cut back to ~40 colours with hard edges
# (same as tools/beasts20.py). Smaller ones are copied as they are. Usage: python3 tools/sc_import.py [ids...]
import sys, os, glob
import numpy as np
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC, OUT = os.path.join(root, 'art/sc'), os.path.join(root, 'art/out')
FRONT_H = {'martip': 62, 'infernix': 84, 'bramblord': 72, 'tidalord': 84}    # new fronts: target height in px
BACK_MAX = 88
def match_blue(target_hsv):
    """Pull the blues of an image toward a target hue/saturation/brightness (used when a back came out a lighter shade)."""
    import colorsys
    th, ts, tv = target_hsv
    def f(a):
        a = a.copy(); m = a[..., 3] > 0; rgb = a[..., :3][m] / 255
        hsv = np.array([colorsys.rgb_to_hsv(*c) for c in rgb]); blue = (hsv[:, 0] > .5) & (hsv[:, 0] < .7) & (hsv[:, 1] > .3)
        mh, ms, mv = hsv[blue].mean(0)
        hsv[blue, 0] = th + (hsv[blue, 0] - mh); hsv[blue, 1] = np.clip(hsv[blue, 1] * ts / ms, 0, 1); hsv[blue, 2] = np.clip(hsv[blue, 2] * tv / mv, 0, 1)
        a[..., :3][m] = (np.array([colorsys.hsv_to_rgb(*c) for c in hsv]) * 255).round().astype(np.uint8); return a
    return f
RECOLOUR = {'rivotter': match_blue((.571, .643, .63))}                         # id -> fix applied to the back before shrinking

def crop(im): return im.crop(im.getbbox())

def reduce(im, n=40):
    a = np.array(im); alpha = a[..., 3] > 0
    q = np.array(Image.fromarray(a[..., :3], 'RGB').quantize(n, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'))
    out = np.dstack([q, np.where(alpha, 255, 0)]).astype(np.uint8); out[~alpha] = 0; return Image.fromarray(out, 'RGBA')

def shrink(im, h):
    if im.height <= h: return reduce(im)
    s = h / im.height; arr = np.array(im).astype(float); A = arr[..., 3:4] / 255
    pm = np.dstack([arr[..., :3] * A, arr[..., 3:4]]); W, H = max(1, round(im.width * s)), h
    o = np.dstack([np.array(Image.fromarray(pm[..., c].astype(np.float32), 'F').resize((W, H), Image.BOX)) for c in range(4)])
    alpha = o[..., 3] >= 128; rgb = np.clip(o[..., :3] / np.clip(o[..., 3:4], 1e-3, 255) * 255, 0, 255).astype(np.uint8)
    q = Image.fromarray(rgb, 'RGB').quantize(40, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    out = np.dstack([np.array(q), np.where(alpha, 255, 0)]).astype(np.uint8); out[~alpha] = 0
    return crop(Image.fromarray(out, 'RGBA'))

def solid(im):
    a = np.array(im.convert('RGBA')); a[..., 3] = np.where(a[..., 3] >= 128, 255, 0); a[a[..., 3] == 0] = 0
    return Image.fromarray(a, 'RGBA')

def run(ids=None):
    done = []
    for f in sorted(glob.glob(os.path.join(SC, '*_f_raw.png'))):
        id = os.path.basename(f)[:-10]
        if ids and id not in ids: continue
        im = shrink(crop(solid(Image.open(f))), FRONT_H.get(id, 64)); im.save(os.path.join(OUT, f'b_{id}_f.png')); done.append((id, 'front', im.size))
    for f in sorted(glob.glob(os.path.join(SC, '*_b.png'))):
        id = os.path.basename(f)[:-6]
        if ids and id not in ids: continue
        fh = Image.open(os.path.join(OUT, f'b_{id}_f.png')).height
        im = crop(solid(Image.open(f)))
        if id in RECOLOUR: im = Image.fromarray(RECOLOUR[id](np.array(im)), 'RGBA')
        im = shrink(im, min(BACK_MAX, round(fh * 1.08))); im.save(os.path.join(OUT, f'b_{id}_b.png')); done.append((id, 'back', im.size))
    for d in done: print(*d)

if __name__ == '__main__': run(sys.argv[1:] or None)
