#!/usr/bin/env python3
# Cut a Retro Diffusion 3x3 creature sheet (256x256, plain white background) into battle sprites.
# Usage: rd_slice.py sheet.png id1 id2 ... id9   (ids in reading order; '-' skips a cell)
import sys
from PIL import Image
import numpy as np
from scipy import ndimage
src, ids = sys.argv[1], sys.argv[2:]
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int); H, W = a.shape[:2]
white = (a.min(-1) >= 244)
# background = white pixels connected to the border; enclosed whites (eye glints, wool) are kept
lab, n = ndimage.label(white); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(edge)); fg = ~bg
# strip the pale fringe the generator leaves just outside the dark outline (two passes)
# ...but not pale areas inside the creature's own outline (glassy wings): 'sil' is the outline closed and filled
sil = ndimage.binary_erosion(ndimage.binary_fill_holes(ndimage.binary_closing(a.min(-1) < 228, structure=np.ones((3, 3)))), structure=np.ones((3, 3)))
for _ in range(2):
    rim = fg & ndimage.binary_dilation(~fg, structure=np.ones((3, 3))) & (a.min(-1) >= 228) & ~sil
    fg &= ~rim
# pockets of pure background white enclosed by dark outline (between antennae, talons): clear them; keep eye glints and pale wings
pl, pn = ndimage.label(fg & (a.min(-1) >= 250))
for k in range(1, pn + 1):
    m = pl == k
    if m.sum() < 6: continue
    ring = ndimage.binary_dilation(m, structure=np.ones((3, 3))) & ~m
    if (a[ring] * [.3, .59, .11]).sum(-1).mean() < 120: fg &= ~m      # only pockets bounded by dark outline (not glassy wings)
comp, n = ndimage.label(fg, structure=np.ones((3, 3)))
cw, ch = W / 3, H / 3; cells = {}
for k in range(1, n + 1):
    ys, xs = np.where(comp == k); cx, cy = xs.mean(), ys.mean(); c = (min(2, int(cy // ch)), min(2, int(cx // cw)))
    cells.setdefault(c, []).append((k, len(xs), (xs.min(), ys.min(), xs.max(), ys.max())))
for (r, c), parts in sorted(cells.items()):
    name = ids[r * 3 + c] if r * 3 + c < len(ids) else '-'
    print((r, c), name, [(p[1], p[2]) for p in parts])
    if name == '-': continue
    keep = []
    cy1 = max(p[2][3] for p in parts)
    for p in parts:
        if p[1] < 3: continue
        px = a[comp == p[0]]
        # a detached flat blob at the very bottom is a ground shadow: drop it
        if len(parts) > 1 and p[1] < 200 and p[2][1] >= cy1 - 8 and len(np.unique(px, axis=0)) <= 3: continue
        keep.append(p[0])
    m = np.isin(comp, keep)
    ys, xs = np.where(m); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    out = np.dstack([a[y0:y1, x0:x1], np.where(m[y0:y1, x0:x1], 255, 0)]).astype(np.uint8); out[~m[y0:y1, x0:x1]] = 0
    Image.fromarray(out, 'RGBA').save(f'art/out/b_{name}_f.png'); print('  saved', name, (x1 - x0, y1 - y0))
