#!/usr/bin/env python3
# Cut furniture out of the cottage-interior template (art/tpl/up14.png) -> art/out/i_*.png (double density).
# Each piece: a box in the template; pixels reachable from the box edge without crossing a dark outline are background.
from PIL import Image
import numpy as np
from scipy import ndimage
im = Image.open('art/tpl/up14.png').convert('RGB'); a = np.array(im).astype(int)
lum = (a[..., 0] * 299 + a[..., 1] * 587 + a[..., 2] * 114) / 1000
def cut(name, box, dark=62, grow=0, keep_bottom=False, extra=None):
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1]; L = lum[y0:y1, x0:x1]
    passable = L > dark
    lab, n = ndimage.label(passable)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    if keep_bottom: edge = set(np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    fg = ~bg
    fg = ndimage.binary_fill_holes(fg)
    # drop dark specks that are not attached to the main object
    l2, n2 = ndimage.label(fg); 
    if n2 > 1:
        sizes = ndimage.sum(fg, l2, range(1, n2 + 1)); fg = np.isin(l2, [i + 1 for i, s in enumerate(sizes) if s >= max(30, sizes.max() * .08)])
    if extra is not None: fg = extra(fg, sub, L)
    out = np.dstack([sub, np.where(fg, 255, 0)]).astype(np.uint8); out[~fg] = 0
    res = Image.fromarray(out, 'RGBA'); bb = res.getbbox(); res = res.crop(bb)
    q = res.convert('RGB').quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'); o = np.dstack([np.array(q), np.array(res)[..., 3]]); o[o[..., 3] == 0] = 0
    Image.fromarray(o.astype(np.uint8), 'RGBA').save('art/out/' + name + '.png'); print(name, res.size)
def rect(name, box, colors=48, clear=None):
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1].copy(); al = np.full(sub.shape[:2], 255)
    if clear is not None: al[clear(sub, lum[y0:y1, x0:x1])] = 0
    res = Image.fromarray(np.dstack([sub, al]).astype(np.uint8), 'RGBA')
    q = res.convert('RGB').quantize(colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'); o = np.dstack([np.array(q), al]); o[al == 0] = 0
    Image.fromarray(o.astype(np.uint8), 'RGBA').save('art/out/' + name + '.png'); print(name, res.size)
def find_rect(box, dark=70):   # tighten a rough box to the object's dark outline
    x0, y0, x1, y1 = box; L = lum[y0:y1, x0:x1] < dark
    cols = np.where(L.mean(axis=0) > .5)[0]; rows = np.where(L.mean(axis=1) > .5)[0]
    return (x0 + cols.min(), y0 + rows.min(), x0 + cols.max() + 1, y0 + rows.max() + 1)
def shelfclear(sub, L):   # paint the plant pot off the top of the shelf by copying the plain plank beside it
    sub[0:7, 15:31] = sub[0:7, 1:17]; return np.zeros(L.shape, bool)
rect('i_shelf', (33, 41, 73, 93), clear=shelfclear)
def bedclear(sub, L):      # floor showing above the arched headboard, between the posts
    m = np.zeros(L.shape, bool); passable = L > 66; lab, n = ndimage.label(passable[:9]); top = set(np.unique(lab[0])) - {0}; m[:9] = np.isin(lab, list(top)); return m
rect('i_bed', (23, 97, 54, 162), clear=bedclear)
def plant():
    x0, y0, x1, y1 = 75, 60, 100, 95; sub = a[y0:y1, x0:x1]; L = lum[y0:y1, x0:x1]
    r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    green = (g > r + 6) & (g > b + 14)
    yy = np.arange(sub.shape[0])[:, None]; xx = np.arange(sub.shape[1])[None, :]
    pot = (L > 95) & (abs(r - g) < 34) & (b > 60) & (yy > 12) & (xx > 3) & (xx < 22)
    seed = ndimage.binary_fill_holes(ndimage.binary_closing(green | pot, iterations=1))
    fg = seed | (ndimage.binary_dilation(seed, iterations=1) & (L < 75))
    l2, n2 = ndimage.label(fg); sizes = ndimage.sum(fg, l2, range(1, n2 + 1)); fg = l2 == (int(np.argmax(sizes)) + 1)
    out = np.dstack([sub, np.where(fg, 255, 0)]).astype(np.uint8); out[~fg] = 0
    res = Image.fromarray(out, 'RGBA'); res = res.crop(res.getbbox()); res.save('art/out/i_plant.png'); print('i_plant', res.size)
plant()
rect('i_mat', (108, 208, 137, 225))
import os
for f in ('i_tv', 'i_table', 'i_lampstand'):
    if os.path.exists('art/out/' + f + '.png'): os.remove('art/out/' + f + '.png')
