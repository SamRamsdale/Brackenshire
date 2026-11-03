#!/usr/bin/env python3
# Rear view of Journal #010 (the Route 1 bunny), made with the back-view kit. Colours from its front sprite.
import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backkit import *
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FUR, FUR_L, FUR_D, FUR_DD = '#bb7a34', '#cf9550', '#864f22', '#5e3a1c'
CREAM, CREAM_D = '#fcf0c5', '#eed5ab'

def burrabit_back(path=None):
    p = BackPaint(80)
    # big hind feet, soles toward us
    for fx in (17, 35): foot(p, fx, 76, 6.5, 2.8, CREAM_D, toes=3, toe_col='#cfa377')
    # far ear first, splayed back and partly hidden by the head
    ear(p, (30, 28), (41, 6), 4.4, FUR_D)
    head = (24, 37, 15, 12.6)
    body = mass(p, [head, (26, 63, 19, 13.8), (25, 51, 12.5, 8)], FUR)
    p.fill(p.ell(10.2, 40, 3.2, 5.6), CREAM, clip=body, light=.1, shade=.2, rim=.1)          # cheek fluff on the face side
    p.fill(p.ell(11, 69, 3.6, 6.5), CREAM_D, clip=body, light=.1, shade=.25, rim=.15)        # a little belly on the near side
    p.stroke([(12, 47.5), (20, 50), (30, 49.5), (37, 46)], .55, FUR_D, clip=body)             # where the head sits on the body
    p.stroke([(25, 58), (24, 70)], .5, FUR_D, clip=body)                                      # dip between the haunches
    fur(p, body, FUR_D, n=80, length=2.0, angle=-100, seed=4)
    fur(p, body & p.ell(20, 30, 10, 6), FUR_L, n=20, length=1.8, angle=-100, seed=5)          # light on the crown
    # near ear in front, rising from the crown
    ear(p, (20, 28), (13, 3), 4.8, FUR)
    puff(p, 27, 68, 6.4, CREAM)                                                               # the fluffy tail
    return finish_back(p, path)

if __name__ == '__main__':
    im = burrabit_back(os.path.join(root, 'art/out/b_burrabit_b.png')); print('burrabit back', im.size)
    compare(os.path.join(root, 'art/out/b_burrabit_f.png'), os.path.join(root, 'art/out/b_burrabit_b.png'), os.path.join(root, 'shots/burrabit_fb.png'))
