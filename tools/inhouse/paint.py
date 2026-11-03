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
