#!/usr/bin/env python3
"""Join src/ pieces (in src/ORDER) back into brackenshire.html, and build the Beastie Journal viewer (beastie-journal.html)
from the same code, so the viewer always shows the game's current sprites."""
import pathlib
root = pathlib.Path(__file__).parent
order = (root / 'src' / 'ORDER').read_text().split()
read = lambda f: (root / 'src' / f).read_text(encoding='utf-8')
out = '\n'.join(read(f) for f in order)
(root / 'brackenshire.html').write_text(out, encoding='utf-8')
print('built brackenshire.html', len(out), 'chars')

# Journal viewer: the game's code minus its page shell and boot, wrapped in the viewer's own page.
game = [f for f in order if f.endswith('.js') and f != '41_boot.js']
dex = '\n'.join([read('dex/head.html')] + [read(f) for f in game] + [read('dex/view.js'), read('shell_tail.html')])
(root / 'beastie-journal.html').write_text(dex, encoding='utf-8')
print('built beastie-journal.html', len(dex), 'chars')
