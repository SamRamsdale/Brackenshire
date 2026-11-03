#!/usr/bin/env python3
# Back views made by reshaping a good existing back (a "template") instead of painting from a blank page.
# 1. retarget(): recolour the template with the new Beastie's own front colours, family by family
#    (each template colour family, like "fur" or "cream", is mapped to a front family by matching brightness order).
# 2. paint the parts that differ (a squirrel's tail, a puppy's floppy ears) on top with the paint kit,
#    drawn straight in final orientation (head to the upper right, light from the top-left).
# 3. tidy(): snap everything to the front's colours and give it the front's style of outline.
# Run: python3 tools/inhouse/template_backs.py [name ...]  -> art/drafts/b_<name>_b.png and shots/<name>_fb.png
# Drafts go to art/drafts/ first; copy one to art/out/ and run tools/build_assets.py to put it in the game.
import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backkit import *
from paint import Paint
from scipy.ndimage import binary_erosion, distance_transform_edt
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = lambda n, s: os.path.join(root, f'art/out/b_{n}_{s}.png')

def _rgb(h): return hexrgb(h).astype(float)

def retarget(template, front, pairs, scale=1.0, near=70):
    """pairs: [(template colour, front colour)]. Every template pixel joins the nearest template colour's family and
    is given the colour at the same brightness rank among the front pixels of the matching family."""
    t = template.convert('RGBA')
    if scale != 1: t = t.resize((round(t.width * scale), round(t.height * scale)), Image.NEAREST)
    a = np.array(t).astype(float); f = np.array(front.convert('RGBA')).astype(float)
    tm, fm = a[..., 3] > 127, f[..., 3] > 127
    ts = np.array([_rgb(p[0]) for p in pairs]); fs = np.array([_rgb(p[1]) for p in pairs])
    tp, fp = a[..., :3][tm], f[..., :3][fm]
    tg = ((tp[:, None] - ts[None]) ** 2).sum(-1).argmin(1)
    fd = ((fp[:, None] - fs[None]) ** 2).sum(-1); fg = fd.argmin(1)
    fg[fd.min(1) > near ** 2] = -1                                           # front pixels far from every family (a tongue, eyes) are left out
    out = tp.copy()
    for g in range(len(pairs)):
        src, dst = tp[tg == g], fp[(fd[:, g] == fd.min(1)) & (fg >= 0)]      # two template families may share a front one
        if not len(src) or not len(dst): continue
        sl = src @ [.299, .587, .114]; dl = dst @ [.299, .587, .114]
        rank = sl.argsort().argsort() / max(1, len(sl) - 1)                # 0 darkest .. 1 lightest within the family
        order = dl.argsort(); out[tg == g] = dst[order[np.clip((rank * (len(dl) - 1)).round().astype(int), 0, len(dl) - 1)]]
    a[..., :3][tm] = out
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def overlay(base, draw, light=(-.55, -.8)):
    """Paint extra parts on top of an image, in its own coordinates. draw(p) paints onto a Paint canvas."""
    n = max(base.size) + 8; p = Paint(n); p.light_dir = light; draw(p)
    part = p.finish(crop=False).crop((0, 0) + base.size)
    out = base.copy(); out.alpha_composite(part); return out

def tidy(im, front):
    """Snap to the front's colours and copy the front's outline habit (which edge colour goes next to which fill)."""
    b = np.array(im.convert('RGBA')); f = np.array(front.convert('RGBA'))
    m = b[..., 3] > 127; pal = front_palette(front)
    b[..., :3][m] = snap(b[..., :3][m][None].astype(float), pal)[0]
    def ring(a):
        mm = a[..., 3] > 127; inner = binary_erosion(mm); e = mm & ~inner
        _, idx = distance_transform_edt(~inner, return_indices=True); ys, xs = np.where(e)
        return ys, xs, a[idx[0][ys, xs], idx[1][ys, xs], :3].astype(float)
    fy, fx, fin = ring(f); by, bx, bin_ = ring(b)
    d = ((bin_[:, None] - fin[None]) ** 2).sum(-1); b[by, bx, :3] = f[fy, fx, :3][d.argmin(1)]
    b[~m] = 0
    return Image.fromarray(b, 'RGBA')

# ---------------------------------------------------------------- the Beasties

def bumbellow():          # Journal #015: big fluffy bee <- the Route 1 bee's back (#014), bigger, with a cream ruff
    f = Image.open(OUT('bumbellow', 'f'))
    t = retarget(Image.open(OUT('buzzlet', 'b')), f, [('#f4bd34', '#f4cc55'), ('#5d3c1d', '#614330'), ('#23170e', '#140905'),
                                                       ('#c6d6e6', '#e6ecea')], scale=1.18)
    def ruff(p):           # the fluffy cream collar round the back of the head (top right, where the head is)
        m = p.ell(47, 30, 11, 13) & ~p.ell(41, 28, 10, 13)
        p.fill(m, '#fae7b0', light=.15, shade=.3, rimw=2.2); p.scallops(m, step=3, size=1.8, col='#d7b36d', amount=.5, angle=-30)
        p.edge(m, w=.5)
    return tidy(overlay(t, ruff), f)

def martip():             # Journal #128: red squirrel <- the Route 1 bunny's back (#010), shorter ears, big curled tail
    f = Image.open(OUT('martip', 'f'))
    t = retarget(Image.open(OUT('burrabit', 'b')), f, [('#bb7a34', '#ab412d'), ('#fcf0c5', '#e7b96c'), ('#2a1a10', '#24110f')])
    a = np.array(t); a[:27] = 0; t = Image.fromarray(a, 'RGBA')            # trim the long ears; the squirrel's are short
    def parts(p):
        head = p.ell(23, 33, 13, 10.5); p.fill(head, '#ab412d', light=.3, shade=.34, rimw=4); p.edge(head, w=.6)
        fur(p, head, '#892e1f', n=25, length=1.6, angle=-100, seed=3)
        p.fill(p.ell(35, 36, 2.6, 4), '#e7b96c', clip=head, light=.1, shade=.2, rim=.1)   # cheek on the face side
        for cx, tip in ((15, (11, 12)), (30, (33, 12))):                    # short pointed ears with tufts
            ear(p, (cx, 27), tip, 4.2, '#ab412d'); p.stroke([tip, (tip[0] + (-1 if cx < 20 else 1), tip[1] - 4)], .9, '#591f16')
        tail = p.smooth(p.ell(19, 64, 7, 9) | p.ell(15, 49, 9, 11) | p.ell(13, 33, 10, 9) | p.ell(19, 24, 7, 6), 1.5)
        p.fill(tail, '#b1462d', light=.3, shade=.36, rimw=4); p.edge(tail, w=.6)
        p.stroke([(20, 70), (15, 52), (12, 36), (16, 25), (21, 27)], .7, '#7c261a', clip=tail)   # the curl
        fur(p, tail, '#892e1f', n=40, length=2, angle=-100, seed=8)
    return tidy(overlay(t, parts), f)

def grimpup():            # Journal #130: black puppy <- the Route 1 badger's back (#019), all dark, floppy ears, collar, tail
    f = Image.open(OUT('grimpup', 'f'))
    t = retarget(Image.open(OUT('brockling', 'b')), f, [('#b5a89d', '#3f3837'), ('#8e7f74', '#3f3837'), ('#54463f', '#272325'),
                                                         ('#1f1b1b', '#090402')], scale=1.15, near=40)
    def parts(p):
        head = p.ell(36, 11, 13.5, 10); p.fill(head, '#3f3837', light=.3, shade=.34, rimw=3.5); p.edge(head, w=.6)
        fur(p, head, '#190b05', n=25, length=1.6, angle=-80, seed=3)
        for base, tip in (((25, 6), (19, 22)), ((47, 6), (53, 22))):      # floppy ears hanging down the sides of the head
            ear(p, base, tip, 5, '#272325')
        col = p.ell(36, 22, 15, 4) & ~p.ell(36, 17.5, 15, 4); p.fill(col, '#a8362a', light=.25, shade=.3, rimw=1.5); p.edge(col, w=.45)
    return tidy(overlay(t, parts), f)

def painted(name):        # cairnling (#023) and foalet (#138): the painted version is already fine; just tidy it
    from chapter1_backs import ALL
    return tidy(finish_back(ALL[name]()), Image.open(OUT(name, 'f')))

ALL = dict(bumbellow=bumbellow, martip=martip, grimpup=grimpup,
           cairnling=lambda: painted('cairnling'), foalet=lambda: painted('foalet'))

if __name__ == '__main__':
    for name in sys.argv[1:] or ALL:
        dst = os.path.join(root, f'art/drafts/b_{name}_b.png'); os.makedirs(os.path.dirname(dst), exist_ok=True)
        im = ALL[name](); im = im.crop(im.getbbox()); im.save(dst)
        print(name, 'back', im.size, 'score', score(im, Image.open(OUT(name, 'f'))))
        compare(OUT(name, 'f'), dst, os.path.join(root, f'shots/{name}_fb.png'))
