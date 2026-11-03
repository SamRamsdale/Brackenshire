#!/usr/bin/env python3
# Back-view kit: reusable parts for painting a Beastie seen from behind, on top of paint.py.
# A back view is painted facing left (head toward the upper left), then mirrored by finish_back() so it faces away
# from the player, as the game expects. Colours should come from the Beastie's own front sprite (front_colours).
# Lessons from the first back views: one round mass for head and body (no hard line between them), show only a sliver
# of the face side (eye edge, beak or cheek), put the near limb or wing across the back with clear feather/fur rows,
# keep the tail or other signature silhouette parts, and let the outline and top-left light do the rest.
import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paint import Paint, mix, hexrgb
import numpy as np
from PIL import Image

def BackPaint(size=80, ss=8):
    """A Paint canvas for a back view: lit from the upper right, so after mirroring the light comes from the top-left."""
    p = Paint(size, ss); p.light_dir = (.55, -.8); return p

def front_colours(path, n=10):
    """Main colours of a front sprite, most used first, as hex strings (for picking a back palette)."""
    a = np.array(Image.open(path).convert('RGBA')); m = a[..., 3] > 127
    q = Image.fromarray(a[..., :3][m][None]).quantize(n, method=Image.MEDIANCUT); pal = q.getpalette()[:n * 3]
    cnt = np.bincount(np.array(q).ravel(), minlength=n)
    return ['#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]) for i in np.argsort(-cnt)]

def ramp(col):
    """light, base, dark, darker versions of one colour."""
    return mix(col, '#fff6e0', .22), hexrgb(col), mix(col, '#1a1022', .3), mix(col, '#1a1022', .55)

def mass(p, parts, col, light=.26, shade=.36, rimw=4.5):
    """One soft round mass from several ellipses (cx, cy, rx, ry[, rot]) with one outline: head + body together."""
    m = np.zeros_like(p.a)
    for e in parts: m |= p.ell(*e)
    p.fill(m, col, light=light, shade=shade, rimw=rimw); p.edge(m, w=.6); return m

def fur(p, m, col, n=40, length=2.2, angle=-70, amount=.55, seed=1):
    """Short strokes of fur clipped to a shape."""
    rng = np.random.default_rng(seed); ys, xs = np.where(m)
    if not len(xs): return
    t = np.radians(angle)
    for i in rng.integers(0, len(xs), n):
        x, y = xs[i] / p.ss, ys[i] / p.ss; L = length * (.7 + .6 * rng.random())
        p.stroke([(x, y), (x + np.cos(t) * L, y + np.sin(t) * L)], .45, col, clip=m)

def ear(p, base, tip, width, col, behind=None):
    """A long ear seen from behind (fur side, no pink): base and tip points, half-width at the base."""
    (bx, by), (tx, ty) = base, tip; d = np.array([tx - bx, ty - by]); L = np.hypot(*d); u = d / L; nrm = np.array([-u[1], u[0]])
    pts = [tuple(np.array(base) + nrm * width), tuple(np.array(base) + u * L * .55 + nrm * width * 1.05), tuple(np.array(tip) + nrm * width * .25),
           tip, tuple(np.array(tip) - nrm * width * .25), tuple(np.array(base) + u * L * .55 - nrm * width * 1.05), tuple(np.array(base) - nrm * width)]
    m = p.smooth(p.poly(pts), .9)
    if behind is not None: m &= ~behind
    p.fill(m, col, light=.25, shade=.32, rimw=2.2); p.edge(m, w=.55)
    p.stroke([tuple(np.array(base) + u * 2), tuple(np.array(tip) - u * 3)], .5, mix(col, '#1a1022', .3), clip=m)   # crease down the back
    return m

def puff(p, cx, cy, r, col, seed=3):
    """A fluffy round tail: scalloped outer edge, soft shading."""
    ang = np.linspace(0, 2 * np.pi, 15, endpoint=False); m = p.ell(cx, cy, r, r * .92)
    for a in ang: m |= p.ell(cx + np.cos(a) * r * .82, cy + np.sin(a) * r * .78, r * .34, r * .34)
    p.fill(m, col, light=.12, shade=.28, rimw=2.2); p.edge(m, w=.55)
    fur(p, m, mix(col, '#7a6040', .4), n=14, length=1.4, angle=-120, seed=seed); return m

def insect_wings(p, root, length, col='#dde2be', vein='#8a9a9a', angle=-60, spread=28):
    """A pair of clear wings seen from behind, rising from one root point."""
    out = np.zeros_like(p.a)
    for k, (scale, da) in enumerate(((1.0, -spread / 2), (.78, spread / 2))):
        t = np.radians(angle + da); L = length * scale
        cx, cy = root[0] + np.cos(t) * L * .5, root[1] + np.sin(t) * L * .5
        m = p.ell(cx, cy, L * .52, L * .3, rot=angle + da)
        p.fill(m, col, light=.25, shade=.12, rimw=1.6); p.edge(m, w=.5)
        p.stroke([root, (root[0] + np.cos(t) * L * .9, root[1] + np.sin(t) * L * .9)], .45, vein, clip=m)
        p.stroke([(cx - np.cos(t + .9) * L * .2, cy - np.sin(t + .9) * L * .2), (cx + np.cos(t) * L * .3, cy + np.sin(t) * L * .3)], .35, vein, clip=m)
        out |= m
    return out

def bands(p, m, col, ys, h=3.2, curve=.03, cx=None):
    """Curved stripes across a round body (bee, tiger): ys are band centres; curve bows them round the body."""
    ysm, xsm = np.where(m); cx = xsm.mean() / p.ss if cx is None else cx
    for y0 in ys:
        yc = y0 + curve * (p.xx - cx) ** 2
        p.fill(m & (np.abs(p.yy - yc) < h / 2), col, light=.18, shade=.3, rim=.15)

def foot(p, cx, cy, rx, ry, col, toes=0, toe_col=None):
    m = p.ell(cx, cy, rx, ry); p.fill(m, col, light=.15, shade=.25, rimw=1.4)
    for k in range(toes): p.stroke([(cx - rx * .6 + k * rx * .6, cy + ry * .1), (cx - rx * .7 + k * rx * .7, cy + ry)], .5, toe_col or mix(col, '#1a1022', .4), clip=m)
    return m

def finish_back(p, path=None, colors=36):
    im = p.finish(colors=colors).transpose(0)               # mirror: faces away from the player
    if path: im.save(path)
    return im

def compare(front_path, back_path, out, S=6):
    """Front and back side by side, enlarged, on light green (for a quick look)."""
    f, b = Image.open(front_path).convert('RGBA'), Image.open(back_path).convert('RGBA')
    sh = Image.new('RGBA', ((f.width + b.width + 12) * S, (max(f.height, b.height) + 8) * S), '#c8d8a0')
    sh.alpha_composite(f.resize((f.width * S, f.height * S), Image.NEAREST), (4 * S, (4 + max(f.height, b.height) - f.height) * S))
    sh.alpha_composite(b.resize((b.width * S, b.height * S), Image.NEAREST), ((f.width + 8) * S, (4 + max(f.height, b.height) - b.height) * S))
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True); sh.convert('RGB').save(out)
