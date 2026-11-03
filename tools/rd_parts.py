#!/usr/bin/env python3
# Cut a loosely laid out Retro Diffusion sheet into its separate creatures (no grid assumed).
# Usage: rd_parts.py sheet.png outdir   -> outdir/NN.png numbered in reading order; then copy the good ones to art/out/b_<id>_f.png
import sys, os
from PIL import Image
import numpy as np
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
a = np.array(Image.open(src).convert('RGB')).astype(int)
white = a.min(-1) >= 244
lab, n = ndimage.label(white); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ~np.isin(lab, list(edge))
sil = ndimage.binary_erosion(ndimage.binary_fill_holes(ndimage.binary_closing(a.min(-1) < 228, structure=np.ones((3, 3)))), structure=np.ones((3, 3)))
for _ in range(2):
    fg &= ~(fg & ndimage.binary_dilation(~fg, structure=np.ones((3, 3))) & (a.min(-1) >= 228) & ~sil)
comp, n = ndimage.label(ndimage.binary_dilation(fg, structure=np.ones((3, 3)), iterations=2))   # join nearby bits (sparks, wisps)
boxes = []
for k in range(1, n + 1):
    m = (comp == k) & fg
    if m.sum() < 150: continue
    ys, xs = np.where(m); boxes.append((int(ys.mean() // 60), xs.min(), m, (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
boxes.sort(key=lambda b: (b[0], b[1]))
for i, (_, _, m, (x0, y0, x1, y1)) in enumerate(boxes):
    o = np.dstack([a[y0:y1, x0:x1], np.where(m[y0:y1, x0:x1], 255, 0)]).astype(np.uint8); o[~m[y0:y1, x0:x1]] = 0
    Image.fromarray(o, 'RGBA').save(f'{out}/{i + 1:02d}.png'); print(i + 1, (x1 - x0, y1 - y0))
