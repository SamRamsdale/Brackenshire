#!/usr/bin/env python3
# Walking legs from SpriteCook image 19 (art/tpl/up19.png) -> art/out/p_legs_*.png
from PIL import Image
import numpy as np
from scipy import ndimage
im = Image.open('art/tpl/up19.png').convert('RGBA'); a = np.array(im); al = a[..., 3] >= 128
lab, n = ndimage.label(ndimage.binary_dilation(al, iterations=1))
boxes = []
for i, sl in enumerate(ndimage.find_objects(lab)):
    m = (lab[sl] == i + 1) & al[sl]
    if m.sum() < 200: continue
    sub = a[sl].copy(); sub[~m] = 0; ys, xs = np.where(m)
    boxes.append((sl[0].start // 40, sl[1].start, Image.fromarray(sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1], 'RGBA')))
boxes.sort(key=lambda b: (b[0], b[1]))
# The sheet draws the hero shorter than the standing template (43 px against 53) with the same head width, so whole
# poses cannot be swapped in. What does transfer cleanly is the legs: the bottom rows of each pose are saved as a strip
# and the game puts them under the standing sprite's body while walking. Each strip is padded so the hips sit at its centre.
LEGS = {'f1': 9, 'f2': 9, 'b1': 9, 'b2': 9, 'l1': 10, 'l2': 10}
for (_, _, img), name in zip(boxes, ['f1', 'f2', 'b1', 'b2', 'l1', 'l2']):
    n = LEGS[name]; arr = np.array(img); strip = arr[-n:]
    xs = np.where(strip[0, :, 3] > 0)[0]; hip = (xs.min() + xs.max() + 1) / 2
    cols = np.where(strip[..., 3].any(axis=0))[0]; half = int(np.ceil(max(hip - cols.min(), cols.max() + 1 - hip)))
    out = np.zeros((n, half * 2, 4), np.uint8); x0 = int(round(half - hip))
    for x in range(strip.shape[1]):
        if 0 <= x + x0 < half * 2: out[:, x + x0] = strip[:, x]
    q = Image.fromarray(out[..., :3], 'RGB').quantize(24, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    o = np.dstack([np.array(q), out[..., 3]]); o[out[..., 3] == 0] = 0
    Image.fromarray(o.astype(np.uint8), 'RGBA').save('art/out/p_legs_' + name + '.png'); print('p_legs_' + name, o.shape[1], 'x', n)
