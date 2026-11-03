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
