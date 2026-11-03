#!/usr/bin/env python3
# Redo the sprites Sam flagged as bad in the Beastie Journal viewer.
# The viewer's "Copy flags" / "Download flags" gives JSON like
#   {"version":1,"flags":[{"id":"martip","side":"b","note":"looks flat"}]}
# On the online Journal the flags live in its page database (collection "sprite-flags", doc "current"); Claude reads
# them with the ArtifactData tool. Save them as art/flags.json, then run:  python3 tools/redo_flagged.py
# Every flagged sprite the in-house tools know how to make is redrawn into art/drafts/ and shown front-and-back in
# shots/<id>_fb.png. Anything they can't make yet is listed as "needs SpriteCook". Use --clear to remove the flags
# that were redone (after the drafts have been checked and copied into art/out/).
import json, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(root, 'tools/inhouse'))
FLAGS = os.path.join(root, 'art/flags.json')

def makers():
    """side -> {species id: function returning a PIL image}, from every in-house generator that exists."""
    import template_backs
    return {'b': dict(template_backs.ALL), 'f': {}}

def main():
    if not os.path.exists(FLAGS): print('no art/flags.json yet: nothing flagged'); return
    data = json.load(open(FLAGS)); flags = data.get('flags', [])
    from backkit import compare, score
    from PIL import Image
    mk = makers(); done, todo = [], []
    for fl in flags:
        sid, side, note = fl.get('id'), fl.get('side', 'b'), fl.get('note', '')
        fn = mk.get(side, {}).get(sid)
        if not fn: todo.append(fl); continue
        im = fn(); im = im.crop(im.getbbox())
        dst = os.path.join(root, f'art/drafts/b_{sid}_{side}.png'); os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst)
        other = os.path.join(root, f'art/out/b_{sid}_{"f" if side == "b" else "b"}.png')
        front = os.path.join(root, f'art/out/b_{sid}_f.png')
        if os.path.exists(other): compare(other if side == 'b' else dst, dst if side == 'b' else other, os.path.join(root, f'shots/{sid}_fb.png'))
        sc = score(im, Image.open(front)) if side == 'b' and os.path.exists(front) else None
        print(f'redone  {sid} {side}  {note!r}  score {sc}'); done.append(fl)
    for fl in todo: print(f'needs SpriteCook  {fl.get("id")} {fl.get("side")}  {fl.get("note", "")!r}')
    if '--clear' in sys.argv:
        data['flags'] = todo; json.dump(data, open(FLAGS, 'w'), indent=1); print(f'cleared {len(done)} flag(s)')

if __name__ == '__main__': main()
