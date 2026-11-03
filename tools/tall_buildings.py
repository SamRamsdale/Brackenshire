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
