#!/usr/bin/env python3
# Bring the cheaper Retro Diffusion sprites (no reference image, softer style) closer to the best-tier look, in-house:
# ground shadow removed, edge pixels darkened into a proper dark outline, optional recolour, optional template-style eyes.
# Reads art/rd/parts<N>/<NN>.png (from tools/rd_parts.py), writes art/out/b_<id>_f.png.
from PIL import Image
import numpy as np, colorsys
from scipy import ndimage
SHADOW = {3: [(166, 165, 222)], 4: [(199, 187, 180)], 5: [(205, 191, 188), (184, 170, 161)]}
OUT = np.array([38, 24, 20], float)
def hsv_map(a, test, fn):
    h, w = a.shape[:2]
    for y in range(h):
        for x in range(w):
            if not a[y, x, 3]: continue
            hh, ss, vv = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255.0))
            if test(hh, ss, vv): a[y, x, :3] = np.array(colorsys.hsv_to_rgb(*fn(hh, ss, vv))) * 255
def eye(a, cx, cy, w=5, h=6, iris=None):
    for y in range(cy - h // 2, cy - h // 2 + h):
        for x in range(cx - w // 2, cx - w // 2 + w):
            dx, dy = (x - cx) / (w / 2), (y - cy + .5) / (h / 2)
            if dx * dx + dy * dy <= 1.25 and 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3]: a[y, x, :3] = (26, 18, 24)
    if iris:
        a[cy:cy + 2, cx - 1:cx + 2, :3] = iris
    a[cy - 2:cy, cx - 2:cx, :3] = (255, 255, 255)
def enhance(sheet, part, name, recolour=None, eyes=(), paint=(), mouth=None):
    a = np.array(Image.open(f'art/rd/parts{sheet}/{part:02d}.png').convert('RGBA')).astype(float); h, w = a.shape[:2]
    # 1 shadow off: the flat shadow colour, wherever it touches the bottom fifth
    for col in SHADOW[sheet]:
        m = (np.abs(a[..., :3] - col).sum(-1) <= 14) & (a[..., 3] > 0)
        lab, n = ndimage.label(m)
        for k in range(1, n + 1):
            ys = np.where(lab == k)[0]
            if ys.max() >= h * .8: a[lab == k] = 0
    al = a[..., 3] > 0; lab, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(al, lab, range(1, n + 1)); a[np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < 10])] = 0
    al = a[..., 3] > 0; ys, xs = np.where(al); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; oy = ys.min(); ox = xs.min()
    # 2 optional fixes
    if recolour: hsv_map(a, *recolour)
    for (x0, y0, x1, y1, src) in paint: a[y0 - oy:y1 - oy, x0 - ox:x1 - ox, :3] = a[src[1] - oy, src[0] - ox, :3]
    for e in eyes: eye(a, e[0] - ox, e[1] - oy, *e[2:])
    if mouth: a[mouth[1] - oy, mouth[0] - ox:mouth[2] - ox, :3] = (60, 30, 30)
    # 3 a little more punch, then a dark outline in place of the soft one
    rgb = a[..., :3]; mean = rgb.mean(-1, keepdims=True); rgb[:] = np.clip((mean + (rgb - mean) * 1.08 - 128) * 1.06 + 128, 0, 255)
    al = a[..., 3] > 0; edge = al & ~ndimage.binary_erosion(np.pad(al, 1), structure=ndimage.generate_binary_structure(2, 1))[1:-1, 1:-1]
    a[edge, :3] = a[edge, :3] * .22 + OUT * .78
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(f'art/out/b_{name}_f.png'); return name
brown = lambda h, s, v: (h < .09 or h > .95) and s > .45
blue = lambda h, s, v: .5 < h < .68 and s > .3
JOBS = [
    (3, 1, 'martip'), (3, 2, 'vespermaus', (brown, lambda h, s, v: (.76, s * .7, min(1, v * 1.05)))), (3, 3, 'flitter'), (3, 4, 'scurrip'),
    (3, 5, 'puffseed'), (3, 7, 'fawnet'), (3, 8, 'slimble'), (3, 9, 'crowlet'),
    (4, 1, 'pucklet'), (4, 2, 'postling'), (4, 3, 'moggle'), (4, 4, 'nutbolt'), (4, 5, 'calfling'), (4, 6, 'gullnip'),
    (5, 1, 'pinchet'), (5, 2, 'sealby', (blue, lambda h, s, v: (h, s * .13, min(1, v * .35 + .68)))), (5, 3, 'jellop'), (5, 4, 'pitmole'), (5, 9, 'glintle'),
]
EXTRA = {
    'puffseed': dict(eyes=[(11, 15, 4, 5), (20, 15, 4, 5)], mouth=(14, 19, 17)),
    'postling': dict(eyes=[(16, 23), (28, 23)], mouth=(20, 28, 25)),
    'nutbolt': dict(paint=[(15, 17, 31, 24, (10, 20))], eyes=[(16, 11), (29, 11)], mouth=(20, 20, 26)),
    'glintle': dict(eyes=[(15, 28), (27, 28)]),
}
if __name__ == '__main__':
    for j in JOBS:
        print(enhance(j[0], j[1], j[2], recolour=j[3] if len(j) > 3 else None, **EXTRA.get(j[2], {})), end=' ')
    print()
