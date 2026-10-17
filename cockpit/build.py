#!/usr/bin/env python3
"""Baut die Cockpit-Seite aus src/ zusammen.

Reihenfolge: 0-kopf.html, 1*.css (1-stile.css, 1b-dunkel.css aus tools/dunkel.py), 2-markup.html, js/*.js (nach Name), 9-fuss.html.
Die Teile werden mit Zeilenumbruch verbunden; das Ergebnis ist dist/my-company-os.html.
Aufruf: python3 build.py [--check REFERENZDATEI]
"""
import glob, os, sys, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(HERE, 'src')
parts = [os.path.join(S, '0-kopf.html')] + sorted(glob.glob(os.path.join(S, '1*.css'))) + [os.path.join(S, '2-markup.html')]
parts += sorted(glob.glob(os.path.join(S, 'js', '*.js')))
parts += [os.path.join(S, '9-fuss.html')]
out = '\n'.join(open(p, encoding='utf-8').read() for p in parts)
out = out.replace('__VERSION__', open(os.path.join(HERE, 'VERSION'), encoding='utf-8').read().strip())
os.makedirs(os.path.join(HERE, 'dist'), exist_ok=True)
dst = os.path.join(HERE, 'dist', 'my-company-os.html')
open(dst, 'w', encoding='utf-8').write(out)
h = hashlib.sha256(out.encode('utf-8')).hexdigest()[:16]
print(f'gebaut: dist/my-company-os.html  {len(out.encode("utf-8"))} Bytes  sha256 {h}')
if '--check' in sys.argv:
    ref = open(sys.argv[sys.argv.index('--check') + 1], encoding='utf-8').read()
    if ref == out:
        print('identisch mit Referenz')
    else:
        print('ABWEICHUNG zur Referenz'); sys.exit(1)
