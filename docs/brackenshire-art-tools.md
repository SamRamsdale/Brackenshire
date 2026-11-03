# Brackenshire art tools (scripts used to build the SpriteCook-based art)

> The scripts below now live as real files in the repo (`tools/`, `test/`). See `tools/README.md`.

Recreate these files under `game/` in a new session. Template images (see `claude/brackenshire-template-images.md` for how to restore 1 to 17) go in `art/tpl/up01.png` .. `up17.png`, `up19.png` (walk cycle, pixel version), plus the full-size `up18_raw.png` (lab and gym) and `up20_raw.png` (Chapter 1 Beasties). If a raw image is missing, skip its script and take the finished sprites from `ASSET_SRC` in the build (name -> [density, base64 PNG]). Run order: `python3 tools/slice.py` (also runs tall_buildings.py) -> `tools/interior.py` -> `tools/walk.py` -> `tools/beasts20.py` -> `tools/doll.py` -> `tools/build_assets.py` -> `python3 build.py`.

## build.py
```python
#!/usr/bin/env python3
# Rebuild brackenshire.html from src/ sections. Usage: build.py [out.html]
import re, sys, os
base = os.path.dirname(os.path.abspath(__file__))
orig = open(os.path.join(base, 'brackenshire.orig.html')).read()
m = re.search(r'<script>(.*)</script>', orig, re.S)
head, tail = orig[:m.start(1)], orig[m.end(1):]
head = head.replace('  <span><kbd>M</kbd>Sound on/off</span>', '  <span><kbd>M</kbd>Sound on/off</span>\n  <span><kbd>Mouse</kbd>Click to choose, right-click back</span>')
names = open(os.path.join(base, 'src/_order.txt')).read().split('\n')
pre = open(os.path.join(base, 'src/_preamble.txt')).read()
js = pre
for n in names:
    js += '// ---- ' + n + ' ----\n' + open(os.path.join(base, 'src', n.replace('/', '__') + '.js')).read()
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(base, 'brackenshire.html')
head = head.replace('</style>', '.credits{min-height:17px;font-size:13px;color:var(--muted);letter-spacing:.04em;text-align:center}.credits::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#e6b84c;box-shadow:0 0 5px #e6b84c88;margin-right:8px;vertical-align:middle}\n</style>', 1)
head = head.replace('</div>\n<script>', '</div>\n<div class="credits" id="credits" aria-live="off"></div>\n<script>', 1)
open(out, 'w').write(head + js + tail)
open(os.path.join(base, '_joined.js'), 'w').write(js)
print('built', out, len(head + js + tail))
```

## tools/slice.py
```python
#!/usr/bin/env python3
# Slice the SpriteCook template images into individual sprites (art/out/*.png).
from PIL import Image
import numpy as np, os
from scipy import ndimage
T='art/tpl/'; O='art/out/'
def load(n): return Image.open(T+'up%02d.png'%n).convert('RGBA')
def clean(im, colors=None):
    a=np.array(im); a[...,3]=np.where(a[...,3]>=128,255,0); a[a[...,3]==0]=0
    im=Image.fromarray(a,'RGBA')
    if colors:
        rgb=im.convert('RGB').quantize(colors,method=Image.MEDIANCUT,dither=Image.NONE).convert('RGB')
        b=np.array(rgb); a2=np.dstack([b,a[...,3]]); a2[a[...,3]==0]=0; im=Image.fromarray(a2.astype(np.uint8),'RGBA')
    return im
def crop(im): return im.crop(im.getbbox())
def comps(im, min_area=30, merge=3):
    al=np.array(im)[...,3]>=128
    lab,n=ndimage.label(ndimage.binary_dilation(al,iterations=merge))
    out=[]
    for i,sl in enumerate(ndimage.find_objects(lab)):
        m=(lab[sl]==i+1)&al[sl]
        if m.sum()<min_area: continue
        sub=np.array(im)[sl].copy(); sub[~m]=0
        ys,xs=np.where(m); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        out.append((sl[1].start+x0, sl[0].start+y0, Image.fromarray(sub[y0:y1,x0:x1],'RGBA')))
    return out
def bands(mask, n, axis):
    occ=mask.any(axis=1-axis) if axis==0 else mask.any(axis=0)
    occ=mask.any(axis=1) if axis==0 else mask.any(axis=0)
    idx=np.where(occ)[0]; lo,hi=idx.min(),idx.max()+1
    # empty runs inside [lo,hi)
    runs=[]; i=lo
    while i<hi:
        if not occ[i]:
            j=i
            while j<hi and not occ[j]: j+=1
            runs.append((j-i,i,j)); i=j
        else: i+=1
    runs=sorted(sorted(runs,reverse=True)[:n-1],key=lambda r:r[1])
    cuts=[lo]+[(a+b)//2 for _,a,b in runs]+[hi]
    return [(cuts[k],cuts[k+1]) for k in range(len(cuts)-1)]
def grid(im, cols, rows):
    a=np.array(im); m=a[...,3]>=128; out=[]
    for (y0,y1) in bands(m,rows,0):
        row=[]
        for (x0,x1) in bands(m[y0:y1],cols,1): row.append(Image.fromarray(a[y0:y1,x0:x1],'RGBA'))
        out.append(row)
    return out
def gridc(im, cols, rows):
    a=np.array(im); m=a[...,3]>=128; out=[[None]*cols for _ in range(rows)]
    for ci,(x0,x1) in enumerate(bands(m,cols,1)):
        for ri,(y0,y1) in enumerate(bands(m[:,x0:x1],rows,0)): out[ri][ci]=Image.fromarray(a[y0:y1,x0:x1],'RGBA')
    return out
def rowsort(cs, tol=14):
    cs=sorted(cs,key=lambda c:c[1]+c[2].height)   # by bottom edge
    rows=[]; 
    for c in cs:
        b=c[1]+c[2].height
        if rows and abs(rows[-1][0]-b)<=tol: rows[-1][1].append(c)
        else: rows.append([b,[c]])
    return [sorted(r[1],key=lambda c:c[0]) for r in rows]
def save(im,name,colors=None):
    im=crop(clean(im,colors)); im.save(O+name+'.png'); print(name, im.size); return im
# --- Beasties
for n,name in [(1,'b_cindle_f'),(2,'b_cindle_b'),(3,'b_splotter_f'),(4,'b_splotter_b'),(5,'b_sproutle_f'),(6,'b_sproutle_b')]: save(load(n),name,40)
# --- scenery sheet
names=[['oak','pine','hedge'],['fence','wall','sign'],['lamp','boulder','stone'],['tuft','flowers','postbox']]
for r,nr in zip(gridc(load(12),3,4),names):
    for c,nm in zip(r,nr): save(c,'o_'+nm,48)
# --- buildings
for r,nr in zip(grid(load(13),2,2),[['house','wayhouse'],['shop','mill']]):
    for c,nm in zip(r,nr): save(c,'h_'+nm,64)
def scale_frac(im, num, den):   # exact num/den enlargement: nearest up, box-average down, hard alpha
    big=im.resize((im.width*num,im.height*num),Image.NEAREST)
    a=np.array(big).astype(float); h,w=a.shape[0]//den*den,a.shape[1]//den*den; a=a[:h,:w]
    al=a[...,3:4]/255; pm=a[...,:3]*al
    s=lambda z: z.reshape(h//den,den,w//den,den,-1).sum(axis=(1,3))
    A=s(al); C=s(pm)/np.maximum(A,1e-6)
    return Image.fromarray(np.concatenate([C,(A>=den*den/2)*255.0],axis=2).astype(np.uint8),'RGBA')
# lab and gym come from tools/tall_buildings.py (made in-house from the tall pair, image 18)
save(scale_frac(crop(clean(load(7))),4,3),'h_cottage_hd',64)   # 120 -> 160 = 5 tiles
# --- hero (4 poses) and villagers
for c,nm in zip(grid(load(9),4,1)[0],['f','b','l','l2']): save(c,'p_hero_'+nm,40)
for r,nr in zip(grid(load(10),2,2),[['prof','mum'],['rival','grunt']]):
    for c,nm in zip(r,nr): save(c,'p_'+nm+'_f',40)

# taller oak for forests: second canopy lobe behind, slightly longer trunk
oak=Image.open(O+'o_oak.png').convert('RGBA'); W_,H_=oak.size
a=np.array(oak.crop((0,0,W_,31))).astype(float); a[...,:3]*=0.88
tall=Image.new('RGBA',(W_,H_+18),(0,0,0,0)); tall.alpha_composite(Image.fromarray(a.astype(np.uint8),'RGBA').crop((4,0,W_-4,31)),(4,0))
body=Image.new('RGBA',(W_,H_+6),(0,0,0,0)); body.alpha_composite(oak.crop((0,0,W_,34)),(0,0))
for k in range(3): body.alpha_composite(oak.crop((0,33,W_,35)),(0,34+k*2))
body.alpha_composite(oak.crop((0,34,W_,H_)),(0,40)); tall.alpha_composite(body,(0,12)); tall.save(O+'o_oak_tall.png'); print('o_oak_tall',tall.size)

import subprocess, sys; subprocess.check_call([sys.executable, 'tools/tall_buildings.py'])
```

## tools/tall_buildings.py
```python
#!/usr/bin/env python3
# Lab and gym: made in-house from the tall SpriteCook pair (up18_raw.png). Each is cut out, widened and its roof
# flattened so it fills its map footprint at double density without towering over the cottage.
from PIL import Image
import numpy as np
from scipy import ndimage
im=Image.open('art/tpl/up18_raw.png').convert('RGB'); a=np.array(im).astype(int)
white=(a.min(axis=2)>236)
lab,n=ndimage.label(white)
border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
fg=ndimage.binary_opening(~np.isin(lab,list(border)),iterations=1)
l2,n2=ndimage.label(fg); objs=ndimage.find_objects(l2)
big=sorted([(sl[1].start,i+1,sl) for i,sl in enumerate(objs) if (l2[sl]==i+1).sum()>20000])
def build(k, sl, name, target_w, stretch, squash, roof_rows):
    m=(l2[sl]==k); rgb=a[sl]
    rgba=np.dstack([rgb,np.where(m,255,0)]).astype(np.uint8)
    h,w=m.shape
    top=Image.fromarray(rgba[:roof_rows],'RGBA'); bot=Image.fromarray(rgba[roof_rows:],'RGBA')
    s=target_w/(w*stretch)
    th=round(roof_rows*squash*s); bh=round((h-roof_rows)*s)
    def rs(img,W,H):
        arr=np.array(img).astype(float); al=arr[...,3:4]/255; pm=np.dstack([arr[...,:3]*al,arr[...,3:4]])
        chans=[Image.fromarray(pm[...,c].astype(np.float32),'F').resize((W,H),Image.LANCZOS) for c in range(4)]
        o=np.dstack([np.array(c) for c in chans]); A=np.clip(o[...,3:4],1e-3,255)/255
        return np.dstack([np.clip(o[...,:3]/A,0,255),np.where(o[...,3]>=128,255,0)]).astype(np.uint8)
    out=np.vstack([rs(top,target_w,th),rs(bot,target_w,bh)])
    q=Image.fromarray(out[...,:3],'RGB').quantize(72,method=Image.MEDIANCUT,dither=Image.NONE).convert('RGB')
    o=np.dstack([np.array(q),out[...,3]]); o[out[...,3]==0]=0
    res=Image.fromarray(o.astype(np.uint8),'RGBA'); res=res.crop(res.getbbox()); res.save('art/out/'+name+'.png'); print(name,res.size, 'raw',w,h)
# eave line (roof meets wall) is ~370 raw rows below the top of each cut-out
build(big[0][1],big[0][2],'h_lab_hd',192,1.22,.72,372)
build(big[1][1],big[1][2],'h_gym_hd',224,1.18,.68,372)
```

## tools/interior.py
```python
#!/usr/bin/env python3
# Cut furniture out of the cottage-interior template (art/tpl/up14.png) -> art/out/i_*.png (double density).
# Each piece: a box in the template; pixels reachable from the box edge without crossing a dark outline are background.
from PIL import Image
import numpy as np
from scipy import ndimage
im = Image.open('art/tpl/up14.png').convert('RGB'); a = np.array(im).astype(int)
lum = (a[..., 0] * 299 + a[..., 1] * 587 + a[..., 2] * 114) / 1000
def cut(name, box, dark=62, grow=0, keep_bottom=False, extra=None):
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1]; L = lum[y0:y1, x0:x1]
    passable = L > dark
    lab, n = ndimage.label(passable)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    if keep_bottom: edge = set(np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    fg = ~bg
    fg = ndimage.binary_fill_holes(fg)
    # drop dark specks that are not attached to the main object
    l2, n2 = ndimage.label(fg); 
    if n2 > 1:
        sizes = ndimage.sum(fg, l2, range(1, n2 + 1)); fg = np.isin(l2, [i + 1 for i, s in enumerate(sizes) if s >= max(30, sizes.max() * .08)])
    if extra is not None: fg = extra(fg, sub, L)
    out = np.dstack([sub, np.where(fg, 255, 0)]).astype(np.uint8); out[~fg] = 0
    res = Image.fromarray(out, 'RGBA'); bb = res.getbbox(); res = res.crop(bb)
    q = res.convert('RGB').quantize(48, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'); o = np.dstack([np.array(q), np.array(res)[..., 3]]); o[o[..., 3] == 0] = 0
    Image.fromarray(o.astype(np.uint8), 'RGBA').save('art/out/' + name + '.png'); print(name, res.size)
def rect(name, box, colors=48, clear=None):
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1].copy(); al = np.full(sub.shape[:2], 255)
    if clear is not None: al[clear(sub, lum[y0:y1, x0:x1])] = 0
    res = Image.fromarray(np.dstack([sub, al]).astype(np.uint8), 'RGBA')
    q = res.convert('RGB').quantize(colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB'); o = np.dstack([np.array(q), al]); o[al == 0] = 0
    Image.fromarray(o.astype(np.uint8), 'RGBA').save('art/out/' + name + '.png'); print(name, res.size)
def find_rect(box, dark=70):   # tighten a rough box to the object's dark outline
    x0, y0, x1, y1 = box; L = lum[y0:y1, x0:x1] < dark
    cols = np.where(L.mean(axis=0) > .5)[0]; rows = np.where(L.mean(axis=1) > .5)[0]
    return (x0 + cols.min(), y0 + rows.min(), x0 + cols.max() + 1, y0 + rows.max() + 1)
def shelfclear(sub, L):   # paint the plant pot off the top of the shelf by copying the plain plank beside it
    sub[0:7, 15:31] = sub[0:7, 1:17]; return np.zeros(L.shape, bool)
rect('i_shelf', (33, 41, 73, 93), clear=shelfclear)
def bedclear(sub, L):      # floor showing above the arched headboard, between the posts
    m = np.zeros(L.shape, bool); passable = L > 66; lab, n = ndimage.label(passable[:9]); top = set(np.unique(lab[0])) - {0}; m[:9] = np.isin(lab, list(top)); return m
rect('i_bed', (23, 97, 54, 162), clear=bedclear)
def plant():
    x0, y0, x1, y1 = 75, 60, 100, 95; sub = a[y0:y1, x0:x1]; L = lum[y0:y1, x0:x1]
    r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    green = (g > r + 6) & (g > b + 14)
    yy = np.arange(sub.shape[0])[:, None]; xx = np.arange(sub.shape[1])[None, :]
    pot = (L > 95) & (abs(r - g) < 34) & (b > 60) & (yy > 12) & (xx > 3) & (xx < 22)
    seed = ndimage.binary_fill_holes(ndimage.binary_closing(green | pot, iterations=1))
    fg = seed | (ndimage.binary_dilation(seed, iterations=1) & (L < 75))
    l2, n2 = ndimage.label(fg); sizes = ndimage.sum(fg, l2, range(1, n2 + 1)); fg = l2 == (int(np.argmax(sizes)) + 1)
    out = np.dstack([sub, np.where(fg, 255, 0)]).astype(np.uint8); out[~fg] = 0
    res = Image.fromarray(out, 'RGBA'); res = res.crop(res.getbbox()); res.save('art/out/i_plant.png'); print('i_plant', res.size)
plant()
rect('i_mat', (108, 208, 137, 225))
import os
for f in ('i_tv', 'i_table', 'i_lampstand'):
    if os.path.exists('art/out/' + f + '.png'): os.remove('art/out/' + f + '.png')
```

## tools/walk.py
```python
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
```

## tools/beasts20.py
```python
#!/usr/bin/env python3
# Chapter 1 Beasties from SpriteCook image 20 (art/tpl/up20_raw.png, the full-size version): fronts only.
# Each creature is cut from the white background and shrunk in-house to battle size -> art/out/b_<id>_f.png
from PIL import Image
import numpy as np, sys
from scipy import ndimage
ORDER = [['burrabit', 'pipwren', 'buzzlet', 'crawlie'], ['woolt', 'cairnling', 'grimrat', 'mushlet']]
SCALE = float(sys.argv[1]) if len(sys.argv) > 1 else 0.24
im = Image.open('art/tpl/up20_raw.png').convert('RGB'); a = np.array(im).astype(int)
white = a.min(axis=2) > 232
lab, n = ndimage.label(white)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ndimage.binary_opening(~np.isin(lab, list(border)), iterations=1)
l2, n2 = ndimage.label(fg); objs = ndimage.find_objects(l2)
big = [(sl, i + 1) for i, sl in enumerate(objs) if (l2[sl] == i + 1).sum() > 8000]
rows = [sorted([b for b in big if b[0][0].start < 480], key=lambda b: b[0][1].start), sorted([b for b in big if b[0][0].start >= 480], key=lambda b: b[0][1].start)]
print([len(r) for r in rows])
def shrink(rgba, s):
    arr = rgba.astype(float); A = arr[..., 3:4] / 255; pm = np.dstack([arr[..., :3] * A, arr[..., 3:4]])
    W, H = max(1, round(rgba.shape[1] * s)), max(1, round(rgba.shape[0] * s))
    ch = [np.array(Image.fromarray(pm[..., c].astype(np.float32), 'F').resize((W, H), Image.BOX)) for c in range(4)]
    o = np.dstack(ch); AA = np.clip(o[..., 3:4], 1e-3, 255) / 255; alpha = o[..., 3] >= 128
    rgb = np.clip(o[..., :3] / AA, 0, 255).astype(np.uint8)
    q = Image.fromarray(rgb, 'RGB').quantize(36, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    out = np.dstack([np.array(q), np.where(alpha, 255, 0)]).astype(np.uint8); out[~alpha] = 0
    r = Image.fromarray(out, 'RGBA'); return r.crop(r.getbbox())
for row, names in zip(rows, ORDER):
    for (sl, k), name in zip(row, names):
        m = ndimage.binary_fill_holes(l2[sl] == k)
        rgba = np.dstack([a[sl], np.where(m, 255, 0)]).astype(np.uint8)
        r = shrink(rgba, SCALE * (.94 if name == 'burrabit' else 1)); r.save('art/out/b_' + name + '_f.png'); print(name, (sl[1].stop - sl[1].start, sl[0].stop - sl[0].start), '->', r.size)
```

## tools/doll.py
```python
#!/usr/bin/env python3
# Region maps for the hero template (front, back, side) so other characters can be made by recolouring it.
# One letter per pixel: . empty  K outline  c cap  m cap brim/strap  h hair  s skin  e keep (eyes, whites, blush)
# j jacket  y jacket stripe  t bag strap  p trousers  o shoes.  Lower-case = that region, upper-case (except K) = a dark line inside it.
from PIL import Image
import colorsys, json, sys
def cls(r,g,b):
    h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255); h*=360
    if l<0.16: return '#'
    if s<0.16: return 'w' if l>0.7 else 'g'
    if h<18 or h>340: return 'R'
    if 18<=h<40: return 'S' if l>0.58 else 'b'
    if 40<=h<75: return 'Y' if s>0.5 and l<0.75 else ('S' if l>0.58 else 'b')
    if 180<=h<260: return 'B'
    return '?'
def region(view, x, y, c, w):
    if c=='#': return 'K'
    if view=='f':
        if y<=13: return 'm' if (c in 'wgS' and y>=9) else 'c'
        if y<=26: return ('h' if (y<=18 or x<=6 or x>=23) else 'e') if c=='b' else ('s' if c=='S' else 'e')
        if y<=42:
            if c=='B': return 'j'
            if c in 'SY':
                if 12<=x<=17 and y<=29: return 's'
                if x<=7 or x>=22: return 's'
                return 'y'
            if c in 'bR': return 't' if 6<x<24 else 's'
            return 'j'
        if y<=47: return 'p'
        return 'e' if c in 'wg' else 'o'
    if view=='b':
        if y<=17: 
            if c in 'wgS' and y>=13: return 'm'
            return 'h' if c=='b' else 'c'
        if y<=26: return 's' if c in 'SR' and (x<=6 or x>=19 or y>=24) else 'h'
        if y<=42:
            if c=='B': return 'j'
            if c in 'S' and (x<=5 or x>=21): return 's'
            if c in 'Rg' and (x<=5 or x>=21): return 's'
            return 't'
        if y<=48: return 'p'
        return 'o'
    if view=='l':
        if y<=14: return 'm' if (c in 'wgS') else ('h' if c=='b' else 'c')
        if y<=26: return 'h' if c=='b' and (x>=19 or y<=18) else ('s' if c in 'Sb' else 'e')
        if y<=42:
            if c=='B': return 'j'
            if c=='S': return 's'
            if c in 'bR': return 't'
            return 'j'
        if y<=47: return 'p'
        return 'e' if c in 'wg' else 'o'
out={}
for v in 'fbl':
    im=Image.open(f'art/out/p_hero_{v}.png').convert('RGBA'); W,H=im.size
    g=[['.']*W for _ in range(H)]
    for y in range(H):
        for x in range(W):
            r,gg,b,a=im.getpixel((x,y))
            if a>=128: g[y][x]=region(v,x,y,cls(r,gg,b),W)
    # dark pixels fully inside one region become that region's dark line
    g2=[row[:] for row in g]
    for y in range(H):
        for x in range(W):
            if g[y][x]!='K': continue
            nb=[g[yy][xx] if 0<=xx<W and 0<=yy<H else '.' for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1),(x-1,y-1),(x+1,y-1),(x-1,y+1),(x+1,y+1))]
            if '.' in nb[:4]: continue
            cnt={}
            for n in nb:
                if n not in '.Ke': cnt[n]=cnt.get(n,0)+1
            if cnt:
                best=max(cnt,key=cnt.get)
                if cnt[best]>=3 and len([k for k in cnt if cnt[k]>=2])==1: g2[y][x]=best.upper()
    for y in range(H):      # the dark underside of the hair at the back of the head is hair, not outline
        for x in range(W):
            if g2[y][x]!='K': continue
            inside=all(0<=xx<W and 0<=yy<H and g[yy][xx]!='.' for xx,yy in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)))
            if inside and ((v=='b' and 18<=y<=25 and 5<=x<=21) or (v=='l' and 19<=y<=25 and x>=17)): g2[y][x]='H'
    out[v]=[''.join(r) for r in g2]
    if '-v' in sys.argv:
        print(v); [print('%2d %s'%(i,r)) for i,r in enumerate(out[v])]
js="\n// region maps of the hero template (generated by tools/doll.py): see personHD() in the hd section\nconst DOLL = "+json.dumps(out)+";\n"
open('src/doll.js','w').write(js); print('doll.js', len(js))
```

## tools/build_assets.py
```python
#!/usr/bin/env python3
# Pack art/out/*.png into src/assets.js (palette PNGs as base64).  name -> [density, base64]
from PIL import Image
import glob, os, io, base64, numpy as np
ONE = {'o_lamp', 'o_stone'}           # drawn at 1 art px = 1 game px (same as buildings)
def density(n):
    if n.startswith('b_'): return 1
    if n.startswith('h_') and not n.endswith('_hd'): return 1
    if n in ONE: return 1
    return 2
def pal_png(im):
    a = np.array(im.convert('RGBA')); alpha = a[..., 3] >= 128
    rgb = Image.fromarray(a[..., :3], 'RGB')
    q = rgb.quantize(255, method=Image.MEDIANCUT, dither=Image.NONE)
    idx = np.array(q) + 1; idx[~alpha] = 0
    pal = [0, 0, 0] + q.getpalette()[:255 * 3]
    out = Image.fromarray(idx.astype(np.uint8), 'P'); out.putpalette(pal)
    buf = io.BytesIO(); out.save(buf, 'PNG', optimize=True, transparency=0)
    return buf.getvalue()
items = []
total = 0
for f in sorted(glob.glob('art/out/*.png')):
    n = os.path.basename(f)[:-4]; data = pal_png(Image.open(f)); total += len(data)
    items.append("  %s: [%d, '%s']" % (n, density(n), base64.b64encode(data).decode()))
open('src/assets.js', 'w').write("\n// ================= ART ASSETS (generated by tools/build_assets.py from the SpriteCook templates) =================\nconst ASSET_SRC = {\n" + ",\n".join(items) + "\n};\n")
print(len(items), 'assets,', total, 'bytes png')
```

## test/at.py
```python
#!/usr/bin/env python3
# Usage: at.py build.html out.png map,x,y[,dir] [map,x,y ...]  -> screenshots tiled 2 across (half size)
import sys, asyncio, os, io
from playwright.async_api import async_playwright
from PIL import Image
html, out, spots = os.path.abspath(sys.argv[1]), sys.argv[2], [a.split(',') for a in sys.argv[3:]]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => window.__tod || 'day'; setSound(false); Object.assign(G, { party: [newMon('cindle', 9, {shiny:false})], flags: { intro: 1, starter: 'cindle' } }); loadMap('home', 7, 3, 'down'); G.scene = 'world'; FADE = 0; 0")
        ims = []
        for s in spots:
            tod = s[4] if len(s) > 4 else 'day'
            await pg.evaluate("([m,x,y,d,t]) => { window.__tod = t; loadMap(m, +x, +y, d || 'down'); G.banner = null; }", [s[0], s[1], s[2], s[3] if len(s) > 3 else 'down', tod])
            await pg.wait_for_timeout(350)
            ims.append(Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB'))
        w, h = ims[0].size; k = 1 if len(ims) == 1 else 2; cols = min(2, len(ims)); rows = (len(ims) + cols - 1) // cols
        sh = Image.new('RGB', (cols * (w // k) + (cols - 1) * 4, rows * (h // k) + (rows - 1) * 4))
        for i, im in enumerate(ims): sh.paste(im.resize((w // k, h // k), Image.LANCZOS) if k > 1 else im, ((i % cols) * (w // k + 4), (i // cols) * (h // k + 4)))
        sh.save(out); print('saved', out, sh.size, 'errors:', errs[:3])
        await b.close()
asyncio.run(main())
```

## test/regress.py
```python
#!/usr/bin/env python3
# Regression + UI contact sheet. Usage: regress.py build.html [out.png]
import sys, asyncio, os, io
from playwright.async_api import async_playwright
from PIL import Image
html = os.path.abspath(sys.argv[1]); out = sys.argv[2] if len(sys.argv) > 2 else None
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); try { localStorage.clear(); } catch (e) {} 0")
        shots = []; checks = []
        async def snap(): shots.append(Image.open(io.BytesIO(await pg.locator('canvas').first.screenshot())).convert('RGB'))
        async def idle(maxp=80):
            for _ in range(maxp):
                if await pg.evaluate("G.scene === 'world' && !UI.length && !G.lock"): return True
                await pg.keyboard.press('z'); await pg.wait_for_timeout(120)
            return False
        # 1 new game through the intro
        await pg.mouse.click(600, 400); await pg.keyboard.press('z'); await pg.wait_for_timeout(1500); await snap()
        checks.append(('new game reaches the world', await idle(120)))
        # 2 walking
        x0 = await pg.evaluate("[G.pl.x, G.pl.y]")
        for k in ['ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowRight']:
            await pg.keyboard.down(k); await pg.wait_for_timeout(260); await pg.keyboard.up(k); await pg.wait_for_timeout(120)
        x1 = await pg.evaluate("[G.pl.x, G.pl.y]"); checks.append(('player walks', x0 != x1)); await snap()
        # 3 menus
        await pg.evaluate("G.party = [newMon('cindle', 9, {shiny:false}), newMon('splotter', 8, {shiny:false}), newMon('sproutle', 8, {shiny:true}), newMon('burrabit', 5, {shiny:false})]; G.flags.starter = 'cindle'; ['cindle','splotter','sproutle','burrabit'].forEach(s => { G.seen[s] = 1; G.caught[s] = 1; }); 0")
        for cls, arg in [('PartyScreen', ''), ('SummaryScreen', '0'), ('CardScreen', ''), ('JournalScreen', ''), ('StartMenu', '')]:
            await pg.evaluate(f"window.__ui = new {cls}({arg}); push(window.__ui); 0"); await pg.wait_for_timeout(350); await snap()
            await pg.evaluate("window.__ui.done(); UI.length = 0; 0"); await pg.wait_for_timeout(100)
        checks.append(('menus open and close', await pg.evaluate("UI.length === 0")))
        # 4 wild battle (template sprite as the foe) and a catch attempt
        await pg.evaluate("loadMap('route1', 10, 20, 'down'); G.bag.leyorb = 5; G.lock++; window.__b = 0; battle({ wild: newMon('splotter', 3, {shiny:false}) }).then(() => { G.lock--; window.__b = 1; }); 0")
        await pg.wait_for_timeout(2800)
        for i in range(3): await pg.keyboard.press('z'); await pg.wait_for_timeout(1300)
        await snap()
        for i in range(60):
            if await pg.evaluate("window.__b"): break
            await pg.keyboard.press('z'); await pg.wait_for_timeout(350)
        checks.append(('wild battle finishes', bool(await pg.evaluate("window.__b"))))
        # 5 trainer battle intro
        await pg.evaluate("healAll(); G.lock++; window.__b = 0; battle({ trainer: { name: 'Blight Grunt', look: 'grunt', party: [['burrabit', 3]], prize: 10 } }).then(() => { G.lock--; window.__b = 1; }); 0")
        await pg.wait_for_timeout(2300); await snap()
        for i in range(80):
            if await pg.evaluate("window.__b"): break
            await pg.keyboard.press('z'); await pg.wait_for_timeout(300)
        checks.append(('trainer battle finishes', bool(await pg.evaluate("window.__b"))))
        # 6 map change on foot, every chapter 1 map draws
        await pg.evaluate("UI.length = 0; G.scene = 'world'; loadMap('hollowmere', 10, 3, 'up'); 0")
        for i in range(6): await pg.keyboard.down('ArrowUp'); await pg.wait_for_timeout(300); await pg.keyboard.up('ArrowUp'); await idle(6)
        checks.append(('walks into the next map', await pg.evaluate("G.map.id") != 'hollowmere'))
        ok = await pg.evaluate("(() => { for (const id in MAPS) { try { loadMap(id, 2, 2, 'down'); drawWorld(); } catch (e) { return id + ': ' + e.message; } } return 'ok'; })()")
        checks.append(('every map draws (' + str(ok) + ')', ok == 'ok'))
        checks.append(('no script errors', not errs))
        for n, v in checks: print(('PASS ' if v else 'FAIL ') + n)
        if errs: print('errors:', errs[:6])
        print('ALL PASS' if all(v for _, v in checks) else 'SOME FAILED')
        if out:
            w, h = shots[0].size; cols = 3; rows = (len(shots) + cols - 1) // cols; k = 3
            sh = Image.new('RGB', (cols * (w // k) + (cols - 1) * 4, rows * (h // k) + (rows - 1) * 4))
            for i, im in enumerate(shots): sh.paste(im.resize((w // k, h // k), Image.LANCZOS), ((i % cols) * (w // k + 4), (i // cols) * (h // k + 4)))
            sh.save(out)
        await b.close()
asyncio.run(main())
```

## test/mouse.py
```python
#!/usr/bin/env python3
import sys, asyncio, os
from playwright.async_api import async_playwright
html = os.path.abspath(sys.argv[1])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        await pg.evaluate("showFocus = () => {}; focusBtn.hidden = true; focusBtn.style.display = 'none'; timeOfDay = () => 'day'; setSound(false); Object.assign(G, { party: [newMon('cindle', 12, {shiny:false})], flags: { intro: 1, starter: 'cindle' } }); loadMap('route1', 10, 20, 'down'); G.scene = 'world'; FADE = 0; G.lock++; window.__b = 0; battle({ wild: newMon('burrabit', 3, {shiny:false}) }).then(() => { G.lock--; window.__b = 1; }); 0")
        box = await pg.locator('canvas').first.bounding_box()
        async def click(x, y, button='left'): await pg.mouse.click(box['x'] + x / 256 * box['width'], box['y'] + y / 192 * box['height'], button=button)
        top = lambda: pg.evaluate("UI.length ? UI[UI.length - 1].constructor.name : ''")
        ok = []
        for _ in range(40):
            if await top() == 'ActionMenu': break
            await click(128, 100); await pg.wait_for_timeout(250)
        ok.append(('clicks advance messages to the action menu', await top() == 'ActionMenu'))
        await click(160, 155); await pg.wait_for_timeout(300); ok.append(('clicking FIGHT opens the moves', await top() == 'MoveMenu'))
        await click(128, 60, 'left'); await pg.wait_for_timeout(300); ok.append(('clicking the scene goes back', await top() == 'ActionMenu'))
        await click(160, 155); await pg.wait_for_timeout(300)
        await click(60, 155); await pg.wait_for_timeout(600); ok.append(('clicking a move uses it', await top() != 'MoveMenu'))
        for _ in range(60):
            if await pg.evaluate("window.__b"): break
            t = await top()
            if t == 'ActionMenu': await click(160, 155); await pg.wait_for_timeout(250); await click(60, 155)
            else: await click(128, 100)
            await pg.wait_for_timeout(300)
        ok.append(('battle can be finished by mouse alone', bool(await pg.evaluate("window.__b"))))
        await pg.evaluate("UI.length = 0; push(new StartMenu()); 0"); await pg.wait_for_timeout(200)
        await click(128, 100, 'right'); await pg.wait_for_timeout(250); ok.append(('right-click closes a menu', await top() == ''))
        ok.append(('no script errors', not errs))
        for n, v in ok: print(('PASS ' if v else 'FAIL ') + n)
        if errs: print(errs[:3])
        await b.close()
asyncio.run(main())
```

## test/sheet.py
```python
#!/usr/bin/env python3
# Usage: sheet.py build.html out.png "<js that returns a canvas>"   -> saves the canvas as a PNG
import sys, asyncio, os, base64
from playwright.async_api import async_playwright
html, out, js = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = await b.new_page(viewport={'width': 1200, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + html); await pg.wait_for_function('window.__ready === true', timeout=15000)
        data = await pg.evaluate('(() => { const c = (' + js + ')(); return c.toDataURL("image/png"); })()')
        open(out, 'wb').write(base64.b64decode(data.split(',')[1])); print('saved', out, 'errors:', errs[:3])
        await b.close()
asyncio.run(main())
```


## tools/rd_slice.py
Cuts a Retro Diffusion 3x3 creature sheet (256x256 on white, saved as `art/rd/rdNN.png`) into `art/out/b_<id>_f.png` at native battle size. Run: `python3 tools/rd_slice.py art/rd/rd01.png id1 ... id9` (reading order, `-` skips a cell), then `build_assets.py` and `build.py`.
```python
#!/usr/bin/env python3
# Cut a Retro Diffusion 3x3 creature sheet (256x256, plain white background) into battle sprites.
# Usage: rd_slice.py sheet.png id1 id2 ... id9   (ids in reading order; '-' skips a cell)
import sys
from PIL import Image
import numpy as np
from scipy import ndimage
src, ids = sys.argv[1], sys.argv[2:]
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int); H, W = a.shape[:2]
white = (a.min(-1) >= 244)
# background = white pixels connected to the border; enclosed whites (eye glints, wool) are kept
lab, n = ndimage.label(white); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(edge)); fg = ~bg
# strip the pale fringe the generator leaves just outside the dark outline (two passes)
# ...but not pale areas inside the creature's own outline (glassy wings): 'sil' is the outline closed and filled
sil = ndimage.binary_erosion(ndimage.binary_fill_holes(ndimage.binary_closing(a.min(-1) < 228, structure=np.ones((3, 3)))), structure=np.ones((3, 3)))
for _ in range(2):
    rim = fg & ndimage.binary_dilation(~fg, structure=np.ones((3, 3))) & (a.min(-1) >= 228) & ~sil
    fg &= ~rim
# pockets of pure background white enclosed by dark outline (between antennae, talons): clear them; keep eye glints and pale wings
pl, pn = ndimage.label(fg & (a.min(-1) >= 250))
for k in range(1, pn + 1):
    m = pl == k
    if m.sum() < 6: continue
    ring = ndimage.binary_dilation(m, structure=np.ones((3, 3))) & ~m
    if (a[ring] * [.3, .59, .11]).sum(-1).mean() < 120: fg &= ~m      # only pockets bounded by dark outline (not glassy wings)
comp, n = ndimage.label(fg, structure=np.ones((3, 3)))
cw, ch = W / 3, H / 3; cells = {}
for k in range(1, n + 1):
    ys, xs = np.where(comp == k); cx, cy = xs.mean(), ys.mean(); c = (min(2, int(cy // ch)), min(2, int(cx // cw)))
    cells.setdefault(c, []).append((k, len(xs), (xs.min(), ys.min(), xs.max(), ys.max())))
for (r, c), parts in sorted(cells.items()):
    name = ids[r * 3 + c] if r * 3 + c < len(ids) else '-'
    print((r, c), name, [(p[1], p[2]) for p in parts])
    if name == '-': continue
    keep = []
    cy1 = max(p[2][3] for p in parts)
    for p in parts:
        if p[1] < 3: continue
        px = a[comp == p[0]]
        # a detached flat blob at the very bottom is a ground shadow: drop it
        if len(parts) > 1 and p[1] < 200 and p[2][1] >= cy1 - 8 and len(np.unique(px, axis=0)) <= 3: continue
        keep.append(p[0])
    m = np.isin(comp, keep)
    ys, xs = np.where(m); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    out = np.dstack([a[y0:y1, x0:x1], np.where(m[y0:y1, x0:x1], 255, 0)]).astype(np.uint8); out[~m[y0:y1, x0:x1]] = 0
    Image.fromarray(out, 'RGBA').save(f'art/out/b_{name}_f.png'); print('  saved', name, (x1 - x0, y1 - y0))
```

## tools/rd_parts.py
For sheets that did not keep to the grid (the cheaper tiers): cuts every separate creature into `art/rd/parts<N>/NN.png` in reading order so the good ones can be picked by number.
```python
#!/usr/bin/env python3
# Cut a loosely laid out Retro Diffusion sheet into its separate creatures (no grid assumed).
# Usage: rd_parts.py sheet.png outdir   -> outdir/NN.png numbered in reading order; then copy the good ones to art/out/b_<id>_f.png
import sys, os
from PIL import Image
import numpy as np
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
a = np.array(Image.open(src).convert('RGB')).astype(int)
white = a.min(-1) >= 244
lab, n = ndimage.label(white); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = ~np.isin(lab, list(edge))
sil = ndimage.binary_erosion(ndimage.binary_fill_holes(ndimage.binary_closing(a.min(-1) < 228, structure=np.ones((3, 3)))), structure=np.ones((3, 3)))
for _ in range(2):
    fg &= ~(fg & ndimage.binary_dilation(~fg, structure=np.ones((3, 3))) & (a.min(-1) >= 228) & ~sil)
comp, n = ndimage.label(ndimage.binary_dilation(fg, structure=np.ones((3, 3)), iterations=2))   # join nearby bits (sparks, wisps)
boxes = []
for k in range(1, n + 1):
    m = (comp == k) & fg
    if m.sum() < 150: continue
    ys, xs = np.where(m); boxes.append((int(ys.mean() // 60), xs.min(), m, (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
boxes.sort(key=lambda b: (b[0], b[1]))
for i, (_, _, m, (x0, y0, x1, y1)) in enumerate(boxes):
    o = np.dstack([a[y0:y1, x0:x1], np.where(m[y0:y1, x0:x1], 255, 0)]).astype(np.uint8); o[~m[y0:y1, x0:x1]] = 0
    Image.fromarray(o, 'RGBA').save(f'{out}/{i + 1:02d}.png'); print(i + 1, (x1 - x0, y1 - y0))
```

## tools/rd_enhance.py
Brings the cheaper-tier cut-outs closer to the best tier: ground shadow removed, soft edge darkened into a dark outline, small contrast lift, optional recolour and template-style eyes. The `JOBS` list records which part became which species.
```python
#!/usr/bin/env python3
# Bring the cheaper Retro Diffusion sprites (no reference image, softer style) closer to the best-tier look, in-house:
# ground shadow removed, edge pixels darkened into a proper dark outline, optional recolour, optional template-style eyes.
# Reads art/rd/parts<N>/<NN>.png (from tools/rd_parts.py), writes art/out/b_<id>_f.png.
from PIL import Image
import numpy as np, colorsys
from scipy import ndimage
SHADOW = {3: [(166, 165, 222)], 4: [(199, 187, 180)], 5: [(205, 191, 188), (184, 170, 161)]}
OUT = np.array([38, 24, 20], float)
def hsv_map(a, test, fn):
    h, w = a.shape[:2]
    for y in range(h):
        for x in range(w):
            if not a[y, x, 3]: continue
            hh, ss, vv = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255.0))
            if test(hh, ss, vv): a[y, x, :3] = np.array(colorsys.hsv_to_rgb(*fn(hh, ss, vv))) * 255
def eye(a, cx, cy, w=5, h=6, iris=None):
    for y in range(cy - h // 2, cy - h // 2 + h):
        for x in range(cx - w // 2, cx - w // 2 + w):
            dx, dy = (x - cx) / (w / 2), (y - cy + .5) / (h / 2)
            if dx * dx + dy * dy <= 1.25 and 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3]: a[y, x, :3] = (26, 18, 24)
    if iris:
        a[cy:cy + 2, cx - 1:cx + 2, :3] = iris
    a[cy - 2:cy, cx - 2:cx, :3] = (255, 255, 255)
def enhance(sheet, part, name, recolour=None, eyes=(), paint=(), mouth=None):
    a = np.array(Image.open(f'art/rd/parts{sheet}/{part:02d}.png').convert('RGBA')).astype(float); h, w = a.shape[:2]
    # 1 shadow off: the flat shadow colour, wherever it touches the bottom fifth
    for col in SHADOW[sheet]:
        m = (np.abs(a[..., :3] - col).sum(-1) <= 14) & (a[..., 3] > 0)
        lab, n = ndimage.label(m)
        for k in range(1, n + 1):
            ys = np.where(lab == k)[0]
            if ys.max() >= h * .8: a[lab == k] = 0
    al = a[..., 3] > 0; lab, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(al, lab, range(1, n + 1)); a[np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < 10])] = 0
    al = a[..., 3] > 0; ys, xs = np.where(al); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; oy = ys.min(); ox = xs.min()
    # 2 optional fixes
    if recolour: hsv_map(a, *recolour)
    for (x0, y0, x1, y1, src) in paint: a[y0 - oy:y1 - oy, x0 - ox:x1 - ox, :3] = a[src[1] - oy, src[0] - ox, :3]
    for e in eyes: eye(a, e[0] - ox, e[1] - oy, *e[2:])
    if mouth: a[mouth[1] - oy, mouth[0] - ox:mouth[2] - ox, :3] = (60, 30, 30)
    # 3 a little more punch, then a dark outline in place of the soft one
    rgb = a[..., :3]; mean = rgb.mean(-1, keepdims=True); rgb[:] = np.clip((mean + (rgb - mean) * 1.08 - 128) * 1.06 + 128, 0, 255)
    al = a[..., 3] > 0; edge = al & ~ndimage.binary_erosion(np.pad(al, 1), structure=ndimage.generate_binary_structure(2, 1))[1:-1, 1:-1]
    a[edge, :3] = a[edge, :3] * .22 + OUT * .78
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(f'art/out/b_{name}_f.png'); return name
brown = lambda h, s, v: (h < .09 or h > .95) and s > .45
blue = lambda h, s, v: .5 < h < .68 and s > .3
JOBS = [
    (3, 1, 'martip'), (3, 2, 'vespermaus', (brown, lambda h, s, v: (.76, s * .7, min(1, v * 1.05)))), (3, 3, 'flitter'), (3, 4, 'scurrip'),
    (3, 5, 'puffseed'), (3, 7, 'fawnet'), (3, 8, 'slimble'), (3, 9, 'crowlet'),
    (4, 1, 'pucklet'), (4, 2, 'postling'), (4, 3, 'moggle'), (4, 4, 'nutbolt'), (4, 5, 'calfling'), (4, 6, 'gullnip'),
    (5, 1, 'pinchet'), (5, 2, 'sealby', (blue, lambda h, s, v: (h, s * .13, min(1, v * .35 + .68)))), (5, 3, 'jellop'), (5, 4, 'pitmole'), (5, 9, 'glintle'),
]
EXTRA = {
    'puffseed': dict(eyes=[(11, 15, 4, 5), (20, 15, 4, 5)], mouth=(14, 19, 17)),
    'postling': dict(eyes=[(16, 23), (28, 23)], mouth=(20, 28, 25)),
    'nutbolt': dict(paint=[(15, 17, 31, 24, (10, 20))], eyes=[(16, 11), (29, 11)], mouth=(20, 20, 26)),
    'glintle': dict(eyes=[(15, 28), (27, 28)]),
}
if __name__ == '__main__':
    for j in JOBS:
        print(enhance(j[0], j[1], j[2], recolour=j[3] if len(j) > 3 else None, **EXTRA.get(j[2], {})), end=' ')
    print()
```
