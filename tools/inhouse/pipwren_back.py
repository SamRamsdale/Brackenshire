#!/usr/bin/env python3
# Rear view of the Chapter 1 bird (Journal #012), painted in-house as a proper back view rather than a recoloured
# front: back of the round head with the cream eye ring and beak tip just showing, both folded wings with rows of
# feathers, the cocked tail rising from the rump, an edge of orange breast and the orange feet.
# Colours are sampled from its front sprite. Painted facing left, then mirrored so it faces away from the player.
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paint import Paint, mix
import numpy as np
BR, BR_L, BR_D, BR_DD = '#85542c', '#a56f3b', '#5e381b', '#3e230e'
OR, CREAM, CREAM_D = '#ec7e04', '#f9e8b8', '#d6b67d'

def pipwren_back(path=None):
    p = Paint(64, 8); p.light_dir = (.55, -.8)          # lit from the upper right: after mirroring it comes from the top-left
    # --- the cocked tail first: it rises behind the far side of the body, like on the front sprite
    tail = p.smooth(p.poly([(38, 30), (44, 12), (46.5, 4), (51, 3.5), (55, 6), (52, 14), (46, 32)]), .8)
    p.fill(tail, BR_D, light=.3, shade=.3, rimw=2.2)
    for k in range(5): yb = 8 + k * 4.6; p.stroke([(41, yb + 2), (57, yb - 2)], .75, BR_DD, clip=tail)
    p.stroke([(42, 28), (50, 5)], .45, mix(BR_L, '#ffffff', .2), clip=tail)          # quill highlight
    # --- feet (mostly hidden under the body)
    for fx, fy in ((25, 57.2), (37, 57.6)):
        p.fill(p.ell(fx, fy, 3.2, 1.9), OR, light=.15, shade=.2, rimw=1.4)
        for dx in (-2.4, 0, 2.4): p.stroke([(fx + dx * .6, fy), (fx + dx, fy + 2.4)], .7, '#a75e1c')
    # --- one round ball of a body with the head as its upper part, lit from the upper left
    body = p.ell(31, 38, 19.5, 18) | p.ell(23, 22, 15, 13.5)
    p.fill(body, BR, light=.26, shade=.36, rimw=4.5)
    breast = p.ell(12, 39, 6.5, 10, rot=8); p.fill(breast, OR, clip=body, light=.2, shade=.25, rimw=2)
    belly = p.ell(20, 54.5, 12, 4.5); p.fill(belly, CREAM_D, clip=body & ~breast, light=.1, shade=.2, rimw=1.5)
    crown = p.ell(21, 14, 11, 6.5, rot=-8); p.fill(crown, BR_L, clip=body, light=.3, shade=.15, rim=.15)
    p.edge(body, w=.6)
    p.scallops(body & ~breast & ~belly & ~crown, 3.2, 1.7, BR_DD, .22, angle=-5, seed=3)
    # --- far wing: only a sliver shows on the left
    fw = p.smooth(p.poly([(13, 33), (18, 30), (21, 38), (21, 48), (17, 50), (13, 44)]), .8)
    p.fill(fw, BR_D, light=.15, shade=.25, rimw=1.8, clip=body); p.edge(fw & body, w=.5)
    for k in range(3): p.stroke([(14 + k * 2, 38), (17 + k * 1.2, 49)], .45, BR_DD, clip=fw & body)
    # --- near wing folded across the back: scalloped coverts, then long flight feathers ending in pointed tips
    w = p.smooth(p.poly([(22, 31), (31, 26.5), (41, 28), (47, 35), (46, 44), (40, 51), (34, 55.5), (31, 52), (25, 45), (21, 38)]), 1.1)
    p.fill(w, BR_L, light=.28, shade=.34, rimw=2.8); p.edge(w, w=.6)
    cov = w & ((p.xx - 34) * .35 + (p.yy - 37) < 0)
    p.fill(cov, mix(BR_L, '#ffffff', .1), light=.28, shade=.25, rim=.1)
    p.scallops(cov, 2.8, 1.6, BR_DD, .45, angle=-15, seed=6)
    p.stroke([(21, 40.5), (47, 31.5)], .55, BR_DD, clip=w)
    for k in range(5):                                       # flight feathers fanning down to the tip
        x0 = 26 + k * 4.2
        p.stroke([(x0, 39.5 - k * 1.3), (31 + k * 1.6, 55 - k * 1.8)], .6, BR_DD, clip=w)
        p.stroke([(x0 + .8, 39.6 - k * 1.3), (31.8 + k * 1.6, 54.4 - k * 1.8)], .35, CREAM_D, clip=w)
    # --- head details: eye ring and beak just showing on the left, orange cheek
    ring = p.ell(8.6, 20.5, 2.6, 4.6, rot=-10); p.fill(ring, CREAM, clip=body, light=.1, shade=.15, rim=.1)
    p.fill(p.ell(8.0, 21, 1.1, 2.4), '#1d130b', clip=body & ring, rim=0, light=0, shade=0)      # back edge of the eye
    beak = p.smooth(p.poly([(9, 25), (3.5, 26), (2.2, 28.3), (8.6, 29)]), .35)
    p.fill(beak, OR, light=.2, shade=.25, rimw=1)
    cheek = p.ell(10, 31.5, 3.6, 3.2); p.fill(cheek, OR, clip=body, light=.15, shade=.2, rim=.1)
    p.stroke([(11, 27.5), (17, 30.5), (25, 31), (33, 28.5)], .5, mix(BR_D, BR_DD, .5), clip=body & ~w)   # soft nape crease
    im = p.finish(colors=36).transpose(0)                    # mirror: faces away from the player
    if path: im.save(path)
    return im

if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    im = pipwren_back(os.path.join(root, 'art/out/b_pipwren_b.png')); print('pipwren back', im.size)
