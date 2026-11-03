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
