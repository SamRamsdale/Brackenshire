#!/usr/bin/env python3
# Galewing (the wren's evolution), painted in-house to sit beside the SpriteCook wren: same browns, orange breast,
# cream eye ring and orange feet; new for this stage: spread hovering wings with dark tips, a slate-blue cap and tail fan,
# a hooked beak and a sharper eye.
import sys; sys.path.insert(0, 'tools/inhouse')
from paint import Paint, mix
BR, BR_D, BR_L, BR_DD = '#86552b', '#5e3b1f', '#a4703e', '#3c2513'
OR, CREAM, CREAM_D = '#e77a06', '#f2deab', '#caa56a'
SLATE, SLATE_D, SLATE_L = '#6f86ad', '#465a80', '#9db2d2'
def galewing(path=None, back=False):
    p = Paint(80, 8)
    import numpy as np
    # --- far wing (behind the head), darker, pointed
    fw = p.smooth(p.poly([(35, 35), (28, 23), (21, 11), (14, 2), (21, 3), (22, 8), (27, 9), (29, 15), (34, 17), (37, 25), (42, 31)]), .55)
    p.fill(fw, mix(BR, '#241a2a', .3), light=.12, shade=.2, rimw=2.5); p.scallops(fw, 4.0, 2.2, '#1a1016', .3, angle=60, seed=3)
    p.fill(p.poly([(10, 0), (24, 0), (24, 10), (18, 12), (12, 6)]), BR_DD, clip=fw, rim=0, light=.05, shade=.1)
    # --- tail fan: slate, with a dark band and a cream tip
    tail = p.smooth(p.poly([(48, 53), (57, 55), (71, 60), (77, 67), (73, 75), (63, 78), (55, 73), (47, 62)]), 1.0)
    p.fill(tail, SLATE, light=.22, shade=.3, rimw=3)
    t = ((p.xx - 49) * 21 + (p.yy - 54) * 19) / (21 * 21 + 19 * 19)
    for k in range(5): p.stroke([(50 + k * 1.1, 55 + k * 1.6), (62 + k * 3.6, 77 - k * 3.4)], .4, SLATE_D, clip=tail)
    p.fill(tail & (t > .74) & (t <= .93), '#2c2434', rim=0, light=.05, shade=.1)
    p.fill(tail & (t > .93), CREAM, rim=0, light=.05, shade=.15)
    # --- body (tilted teardrop), brown back, cream belly flecked, orange breast
    body = p.ell(43, 48, 11, 14.5, rot=-30) | p.ell(48, 54, 7, 8)
    p.fill(body, BR, light=.2, shade=.34, rimw=4); p.edge(body, w=.6)
    if not back:
        belly = p.ell(37.5, 52, 8.5, 12, rot=-26); p.fill(belly, CREAM, clip=body, light=.12, shade=.22, rimw=3)
        breast = p.ell(34.5, 44.5, 8.5, 7.5); p.fill(breast, OR, clip=body & belly, light=.16, shade=.22, rimw=2.5)
        p.flecks(belly & body & ~breast, 14, .7, BR_D, .8, seed=5)
        p.scallops(body & ~belly, 3.8, 2.1, BR_DD, .3, angle=35, seed=4)
    else:
        p.scallops(body, 3.8, 2.1, BR_DD, .34, angle=35, seed=4)
    # --- feet tucked under
    for fx, fy in (() if back else ((37.5, 63.6), (44, 65.4))):
        p.stroke([(fx + .6, fy - 3.2), (fx, fy)], 1.5, mix(OR, '#3c2513', .25))
        p.fill(p.ell(fx, fy, 2.7, 1.9), OR, light=.1, shade=.2, rimw=1.5)
        for dx, ex in ((-2.3, -3.6), (0, -.4), (2.2, 2.8)): p.stroke([(fx + dx, fy + 1.2), (fx + ex, fy + 3.4)], .75, '#3c2513')
    # --- near wing: long and pointed with stepped flight feathers
    nw = p.smooth(p.poly([(38, 40), (45, 27), (55, 14), (66, 6), (76, 2), (75, 9), (71, 10), (71, 17), (66, 18), (65, 26), (60, 27), (58, 35), (53, 36), (50, 45), (43, 48)]), .5)
    p.fill(nw, BR_L, light=.24, shade=.3, rimw=3); p.edge(nw, w=.7)
    covert = p.smooth(p.poly([(38, 40), (45, 27), (53, 17), (58, 21), (55, 31), (49, 41), (43, 47)]), 1.0); p.fill(covert, BR, clip=nw, light=.2, shade=.26, rimw=2.6)
    p.scallops(covert & nw, 3.4, 1.9, BR_DD, .36, angle=-52, seed=6)
    prim = nw & ~covert
    for a0, a1 in (((57, 22), (74, 6)), ((56, 28), (70, 13)), ((55, 33), (65, 22)), ((52, 39), (59, 31))): p.stroke([a0, a1], .6, BR_DD, clip=prim)
    tt = ((p.xx - 38) * 38 + (p.yy - 40) * -38) / (38 * 38 * 2)
    p.fill(nw & (tt > .74), BR_DD, rim=0, light=.08, shade=.12)
    p.flecks(covert & nw, 8, .65, '#2a1a10', .7, seed=8)
    p.stroke([(38.5, 40.5), (45, 28), (54.5, 15), (65, 7.5)], .5, BR_DD, clip=nw)                 # leading edge
    if not back:
        # --- head: big and round like the wren's, slate cap, cream face, dark cheek stripe, hooked beak
        head = p.ell(26, 31, 12.4, 11.6)
        p.fill(head, BR, light=.22, shade=.3, rimw=3.5); p.edge(head, w=.7)
        face = p.ell(21.5, 33.5, 8.2, 8.4); p.fill(face, CREAM, clip=head, light=.06, shade=.16, rimw=2.5)
        cap = p.ell(28, 21.5, 14, 7.4, rot=-10); p.fill(cap, SLATE, clip=head, light=.28, shade=.22, rimw=2.2)
        p.stroke([(14.5, 26.2), (22, 24.6), (31, 25.6), (37.5, 28.5)], .5, SLATE_D, clip=head)       # cap edge
        p.stroke([(23.5, 35.5), (24.2, 39.2), (26.4, 42)], 1.5, BR_DD, clip=head)                    # cheek stripe
        p.eye(22.8, 30.6, 4.5, iris='#f2a01e', look=(-.25, .02), brow=(-.3, 1.5))
        beak = p.smooth(p.poly([(15.2, 31.2), (8.6, 32.6), (5.6, 36.6), (6.8, 39.8), (10.2, 37.2), (15.2, 37.2)]), .4); p.fill(beak, '#f6bd2a', light=.18, shade=.24, rimw=1.2)
        p.fill(p.poly([(3, 36.4), (9.2, 35.6), (9.6, 41), (3, 41)]), '#3c2513', clip=beak, rim=0, light=0, shade=0)
        p.fill(p.smooth(p.poly([(36, 19.5), (44, 13.5), (42, 20), (46.5, 21.5), (38.5, 26.5)]), .4), SLATE_D, light=.2, shade=.2, rimw=1.5)   # crest tuft
    else:
        # rear three-quarter view: the back of the head, cap and crest, with only the beak tip showing
        beak = p.smooth(p.poly([(16, 31.5), (11, 33.4), (10, 36.4), (15.5, 36.6)]), .4); p.fill(beak, '#f6bd2a', light=.18, shade=.24, rimw=1.2)
        head = p.ell(26, 31, 12.4, 11.6); p.fill(head, BR, light=.22, shade=.3, rimw=3.5); p.edge(head, w=.7)
        cap = p.ell(28.5, 25.5, 14, 10.5, rot=-10); p.fill(cap, SLATE, clip=head, light=.28, shade=.22, rimw=2.6)
        p.stroke([(15, 30.5), (22, 33.6), (31, 34.4), (37.6, 32.2)], .5, SLATE_D, clip=head)
        p.scallops(head & ~cap, 3.2, 1.8, BR_DD, .3, angle=20, seed=9)
        p.fill(p.smooth(p.poly([(36, 19.5), (44, 13.5), (42, 20), (46.5, 21.5), (38.5, 26.5)]), .4), SLATE_D, light=.2, shade=.2, rimw=1.5)
    im = p.finish(colors=36)
    if back: im = im.transpose(0)      # mirrored, so it faces away from the player
    if path: im.save(path)
    return im
if __name__ == '__main__':
    bk = galewing('art/out/b_galewing_b.png', back=True); im = galewing('art/out/b_galewing_f.png'); print('galewing', im.size, bk.size)
    from PIL import Image
    S = 6; wren = Image.open('art/out/b_pipwren_f.png'); fox = Image.open('art/out/b_cindle_f.png')
    sh = Image.new('RGBA', ((wren.width + im.width + fox.width + 40) * S, 84 * S), '#c8d8a0'); x = 8
    for s in (wren, im, fox): sh.alpha_composite(s.resize((s.width * S, s.height * S), Image.NEAREST), (x * S, (82 - s.height) * S)); x += s.width + 12
    sh.alpha_composite(bk.resize((bk.width * 2, bk.height * 2), Image.NEAREST), (4, 4)); sh.convert('RGB').save('shots/view.png')
