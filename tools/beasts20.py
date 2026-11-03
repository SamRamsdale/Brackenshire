#!/usr/bin/env python3
# Chapter 1 Beasties from SpriteCook image 20 (art/tpl/up20_raw.png, the full-size version): fronts only.
# Each creature is cut from the white background and shrunk in-house to battle size -> art/out/b_<id>_f.png
from PIL import Image
import numpy as np, sys
from scipy import ndimage
ORDER = [['burrabit', 'pipwren', 'buzzlet', 'crawlie'], ['woolt', 'cairnling', 'grimrat', 'mushlet']]
SCALE = float(sys.argv[1]) if len(sys.argv) > 1 else 0.24
im = Image.open('art/tpl/up20_raw.png').convert('RGB'); a = np.array(im).astype(int)
white = a.min(axis=2) > 232
lab, n = ndimage.label(white)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ndimage.binary_opening(~np.isin(lab, list(border)), iterations=1)
l2, n2 = ndimage.label(fg); objs = ndimage.find_objects(l2)
big = [(sl, i + 1) for i, sl in enumerate(objs) if (l2[sl] == i + 1).sum() > 8000]
rows = [sorted([b for b in big if b[0][0].start < 480], key=lambda b: b[0][1].start), sorted([b for b in big if b[0][0].start >= 480], key=lambda b: b[0][1].start)]
print([len(r) for r in rows])
def shrink(rgba, s):
    arr = rgba.astype(float); A = arr[..., 3:4] / 255; pm = np.dstack([arr[..., :3] * A, arr[..., 3:4]])
    W, H = max(1, round(rgba.shape[1] * s)), max(1, round(rgba.shape[0] * s))
    ch = [np.array(Image.fromarray(pm[..., c].astype(np.float32), 'F').resize((W, H), Image.BOX)) for c in range(4)]
    o = np.dstack(ch); AA = np.clip(o[..., 3:4], 1e-3, 255) / 255; alpha = o[..., 3] >= 128
    rgb = np.clip(o[..., :3] / AA, 0, 255).astype(np.uint8)
    q = Image.fromarray(rgb, 'RGB').quantize(36, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    out = np.dstack([np.array(q), np.where(alpha, 255, 0)]).astype(np.uint8); out[~alpha] = 0
    r = Image.fromarray(out, 'RGBA'); return r.crop(r.getbbox())
for row, names in zip(rows, ORDER):
    for (sl, k), name in zip(row, names):
        m = ndimage.binary_fill_holes(l2[sl] == k)
        rgba = np.dstack([a[sl], np.where(m, 255, 0)]).astype(np.uint8)
        r = shrink(rgba, SCALE * (.94 if name == 'burrabit' else 1)); r.save('art/out/b_' + name + '_f.png'); print(name, (sl[1].stop - sl[1].start, sl[0].stop - sl[0].start), '->', r.size)
