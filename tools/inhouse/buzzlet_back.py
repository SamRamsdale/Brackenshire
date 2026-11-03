#!/usr/bin/env python3
# Rear view of Journal #014 (the Route 1 bee), made with the back-view kit. Colours from its front sprite.
import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backkit import *
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GOLD, GOLD_D, BROWN, BROWN_D = '#f4bd34', '#caa64f', '#5d3c1d', '#23170e'
WING, VEIN = '#c6d6e6', '#7f95ad'

def buzzlet_back(path=None):
    p = BackPaint(64)
    for fx in (22, 31, 40): foot(p, fx, 55.5, 2.6, 2.6, BROWN_D)                              # stubby legs
    # antennae curling up from the far side of the head
    for (x0, y0), (x1, y1), (x2, y2) in (((22, 16), (19, 7), (13, 5)), ((29, 14), (30, 5), (25, 1.5))):
        p.stroke([(x0, y0), (x1, y1), (x2, y2)], 1.3, BROWN_D)
        p.dot(x2, y2, 1.5, BROWN_D)
    body = mass(p, [(31, 34, 22, 21.5)], GOLD, light=.24, shade=.32, rimw=5)
    bands(p, body, BROWN, ys=(31, 43, 55), h=5.6, curve=-.014, cx=31)
    p.fill(p.ell(31, 15, 11, 3.5), BROWN, clip=body, light=.2, shade=.3, rim=.1)          # dark cap where the head is
    fur(p, body, mix(GOLD, BROWN, .5), n=60, length=1.3, angle=-90, amount=.4, seed=6)
    p.fill(p.ell(11, 31, 2.6, 4.2), '#1a1022', clip=body, rim=0, light=0, shade=0)          # back edge of the big eye
    p.dot(10.5, 29.3, .7, '#ffffff')
    sting = p.smooth(p.poly([(36, 53), (41, 53), (38.5, 60)]), .3); p.fill(sting, BROWN_D, light=.2, shade=.2, rimw=1)
    # the wings, spread up from the middle of the back: the main thing you see from behind
    insect_wings(p, (34, 20), 19, WING, VEIN, angle=-55, spread=40)
    return finish_back(p, path)

if __name__ == '__main__':
    im = buzzlet_back(os.path.join(root, 'art/out/b_buzzlet_b.png')); print('buzzlet back', im.size)
    compare(os.path.join(root, 'art/out/b_buzzlet_f.png'), os.path.join(root, 'art/out/b_buzzlet_b.png'), os.path.join(root, 'shots/buzzlet_fb.png'))
