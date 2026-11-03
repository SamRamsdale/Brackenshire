#!/usr/bin/env python3
# Rear views of the last five Chapter 1 Beasties (Journal #015, #023, #128, #130, #138), made with the back-view kit.
# Each is painted facing left (head to the upper left) and mirrored by finish_back(). Colours come from each front.
# Run: python3 tools/inhouse/chapter1_backs.py [name ...]   (writes art/drafts/b_<name>_b_painted.png and shots/<name>_fb.png)
import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backkit import *
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
INK = '#1a1022'

def bumbellow():                                   # Journal #015: big fluffy bee with a cream ruff
    GOLD, BROWN, CREAM, CREAM_D = '#f4cc55', '#614330', '#fae7b0', '#d7b36d'
    p = BackPaint(80)
    for fx, fy in ((26, 72), (36, 74), (46, 72)):                                     # dangling legs
        p.stroke([(fx, fy - 6), (fx - 1, fy)], 1.6, '#362018'); p.dot(fx - 1, fy, 1.4, '#140905')
    for pts in (((24, 18), (19, 7), (11, 4)), ((32, 15), (33, 5), (27, 1.5))):        # antennae
        p.stroke(list(pts), 1.4, '#362018'); p.dot(*pts[2], 1.7, '#140905')
    body = mass(p, [(38, 44, 27, 26)], GOLD, light=.24, shade=.34, rimw=5.5)
    bands(p, body, BROWN, ys=(46, 59), h=6.5, curve=-.012, cx=38)
    ruff = p.ell(26, 30, 16, 17) & body                                               # cream fluff round the face side
    p.fill(ruff, CREAM, light=.12, shade=.28, rim=.15)
    p.scallops(ruff, step=3.2, size=1.8, col=CREAM_D, amount=.45, angle=-30, seed=4)
    fur(p, body & ~ruff, mix(GOLD, BROWN, .45), n=80, length=1.5, angle=-95, seed=6)
    fur(p, ruff, CREAM_D, n=40, length=1.6, angle=-120, seed=7)
    p.fill(p.ell(13.5, 34, 2.4, 4.4), INK, clip=body, rim=0, light=0, shade=0)        # edge of the big eye
    p.dot(13, 32.4, .7, '#ffffff')
    insect_wings(p, (40, 22), 22, '#e6ecea', '#8aa2b6', angle=-58, spread=42)
    return p

def cairnling():                                   # Journal #023: mossy boulder with stacked stones on top
    STONE, STONE_L, MOSS, MOSS_D = '#84844d', '#9c956c', '#6b703a', '#4b4a2e'
    p = BackPaint(64)
    for fx in (14, 30, 46): foot(p, fx, 58, 6, 4, '#615e3f')
    body = mass(p, [(31, 41, 26, 18)], STONE, light=.24, shade=.36, rimw=5)
    moss = body & (p.yy < 40 + 4 * np.sin(p.xx / 5.0)) & (p.xx > 6)
    p.fill(moss, MOSS, light=.2, shade=.3, rim=.15)
    p.flecks(moss, n=60, r=.8, col=MOSS_D, amount=.55, seed=3)
    p.flecks(body & ~moss, n=30, r=.7, col=STONE_L, amount=.4, seed=5)
    p.stroke([(18, 50), (24, 52.5), (31, 51)], .5, MOSS_D, clip=body)                # cracks in the stone
    p.stroke([(40, 47), (44, 52)], .5, MOSS_D, clip=body)
    for cx, cy, rx, ry in ((32, 22, 18, 5.2), (31, 12, 12, 5)):                       # the cairn on its back
        s = p.ell(cx, cy, rx, ry); p.fill(s, '#615e3f', light=.3, shade=.4, rimw=2.4); p.edge(s, w=.55)
    return p

def martip():                                      # Journal #128: red squirrel with a big curled tail
    RED, RED_D, CREAM = '#ab412d', '#7c261a', '#e7b96c'
    p = BackPaint(72)
    for fx in (18, 31): foot(p, fx, 68, 5.2, 2.6, RED_D, toes=3)
    ear(p, (27, 21), (33, 5), 3.6, RED_D)
    body = mass(p, [(22, 30, 12.5, 11), (25, 52, 14, 15), (23, 41, 10, 7)], RED)
    p.fill(p.ell(10.5, 33, 2.8, 4.6), CREAM, clip=body, light=.1, shade=.2, rim=.1)    # cheek on the face side
    p.fill(p.ell(12, 56, 3, 7), CREAM, clip=body, light=.1, shade=.25, rim=.15)        # a little belly
    fur(p, body, RED_D, n=70, length=1.8, angle=-100, seed=4)
    ear(p, (17, 21), (13, 4), 3.8, RED)
    p.stroke([(15, 6), (12, 2)], .8, RED_D)                                           # ear tuft
    # the big tail rises up the middle of the back and curls over at the top
    tail = p.smooth(p.ell(37, 46, 11, 20, rot=12) | p.ell(43, 24, 12, 11) | p.ell(36, 62, 8, 6), 1.5)
    p.fill(tail, RED, light=.28, shade=.34, rimw=4); p.edge(tail, w=.6)
    p.stroke([(34, 63), (40, 46), (44, 30), (41, 21), (35, 23)], .7, RED_D, clip=tail)  # curl line
    fur(p, tail, RED_D, n=60, length=2.2, angle=-75, seed=8)
    fur(p, tail & p.ell(46, 22, 8, 6), mix(RED, CREAM, .35), n=18, length=1.8, angle=-60, seed=9)
    return p

def grimpup():                                     # Journal #130: black puppy with floppy ears and a red collar
    BLACK, BLACK_L, COLLAR = '#3f3837', '#5a5150', '#a8362a'
    p = BackPaint(84)
    for fx in (20, 40): foot(p, fx, 79, 6.5, 3.2, '#272325', toes=3, toe_col='#090402')
    tail = p.smooth(p.poly([(40, 66), (47, 60), (55, 44), (58, 40), (55, 47), (49, 65), (43, 70)]), .9)
    p.fill(tail, BLACK, light=.28, shade=.3, rimw=2); p.edge(tail, w=.55)
    body = mass(p, [(28, 30, 18, 16), (31, 61, 20, 17), (29, 46, 13, 9)], BLACK, light=.32, shade=.34)
    p.fill(body & (np.abs(p.yy - (44 + .012 * (p.xx - 29) ** 2)) < 2.2), COLLAR, light=.25, shade=.3, rim=.1)
    p.stroke([(30, 50), (30, 72)], .5, '#190b05', clip=body)                          # dip down the back
    fur(p, body, '#190b05', n=90, length=2.0, angle=-100, seed=4)
    fur(p, body & p.ell(26, 22, 12, 7), BLACK_L, n=30, length=1.8, angle=-100, seed=5)
    for base, tip, w in (((16, 22), (8, 40), 5.5), ((40, 22), (47, 39), 5.5)):        # floppy ears hanging down
        ear(p, base, tip, w, '#272325')
    p.fill(p.ell(10.5, 33, 2, 3), '#be8f79', clip=body, light=.1, shade=.2, rim=.1)    # a glimpse of muzzle
    return p

def foalet():                                      # Journal #138: brown foal with a dark mane and white socks
    COAT, COAT_D, MANE, SOCK = '#9e572a', '#67381c', '#422616', '#dfbe93'
    p = BackPaint(88)
    for lx, top, dark in ((24, 58, True), (38, 58, True), (19, 60, False), (43, 60, False)):
        c = COAT_D if dark else COAT
        leg = p.smooth(p.poly([(lx - 3.4, top), (lx + 3.4, top), (lx + 2.6, 80), (lx - 2.6, 80)]), .6)
        p.fill(leg, c, light=.2, shade=.3, rimw=1.6); p.edge(leg, w=.5)
        sock = leg & (p.yy > 75); p.fill(sock, SOCK, light=.1, shade=.2, rim=.1)
        h = p.ell(lx, 83, 3.2, 2.2); p.fill(h, '#1b0f0a', light=.2, shade=.2, rimw=1)
    neck = p.smooth(p.poly([(14, 46), (14, 24), (22, 14), (30, 22), (32, 46)]), 1.4)
    body = mass(p, [(31, 52, 17, 13), (22, 18, 11, 10)], COAT)
    p.fill(neck, COAT, light=.24, shade=.3, rimw=3, clip=None); p.edge(neck | body, w=.6)
    fur(p, body | neck, COAT_D, n=50, length=1.6, angle=-95, seed=4)
    p.stroke([(31, 42), (31, 64)], .55, COAT_D, clip=body)                            # dip between the haunches
    ear(p, (25, 10), (29, 1), 3, COAT_D); ear(p, (18, 10), (14, 1), 3.2, COAT)
    mane = p.smooth(p.poly([(16, 8), (28, 8), (31, 22), (28, 40), (22, 44), (20, 30)]), 1.3)
    p.fill(mane, MANE, light=.26, shade=.3, rimw=2); p.edge(mane, w=.55)
    for k in range(5): p.stroke([(20 + k * 2, 10 + k * 6), (24 + k * 1.2, 16 + k * 6)], .5, '#1b0f0a', clip=mane)
    tail = p.smooth(p.poly([(29, 44), (35, 44), (37, 58), (34, 70), (30, 66), (28, 54)]), 1.2)
    p.fill(tail, MANE, light=.24, shade=.3, rimw=2); p.edge(tail, w=.55)
    p.stroke([(32, 46), (32, 66)], .5, '#1b0f0a', clip=tail)
    return p

ALL = dict(bumbellow=bumbellow, cairnling=cairnling, martip=martip, grimpup=grimpup, foalet=foalet)

if __name__ == '__main__':
    for name in sys.argv[1:] or ALL:
        out = os.path.join(root, f'art/drafts/b_{name}_b_painted.png'); os.makedirs(os.path.dirname(out), exist_ok=True)
        im = finish_back(ALL[name](), out); print(name, 'back', im.size)
        compare(os.path.join(root, f'art/out/b_{name}_f.png'), out, os.path.join(root, f'shots/{name}_fb.png'))
