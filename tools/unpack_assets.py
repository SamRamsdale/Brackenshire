#!/usr/bin/env python3
# Unpack the sprites stored inside src/36_assets.js into art/out/<name>.png, so they can be checked, previewed
# and edited as ordinary image files. tools/build_assets.py packs them back.  Usage: unpack_assets.py
import re, base64, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'src/36_assets.js')).read()
out = os.path.join(root, 'art/out'); os.makedirs(out, exist_ok=True)
n = 0
for name, dens, b64 in re.findall(r"^  (\w+): \[(\d), '([A-Za-z0-9+/=]+)'\]", src, re.M):
    open(os.path.join(out, name + '.png'), 'wb').write(base64.b64decode(b64)); n += 1
print('unpacked', n, 'sprites into art/out/')
