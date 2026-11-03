#!/usr/bin/env python3
"""Join src/ pieces (in src/ORDER) back into brackenshire.html."""
import pathlib
root = pathlib.Path(__file__).parent
order = (root / 'src' / 'ORDER').read_text().split()
out = '\n'.join((root / 'src' / f).read_text(encoding='utf-8') for f in order)
(root / 'brackenshire.html').write_text(out, encoding='utf-8')
print('built brackenshire.html', len(out), 'chars')
