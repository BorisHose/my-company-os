# Baut die Fassung v2 (Aufbau nach dem Bodo-Muster) aus dem Kern-Entwurf und den abcfinance-Daten.
# kern.css / kern.js  = allgemeiner Kern (keine Kundendaten) – Kandidat für basis/kern
# ../data.js          = abcfinance-Daten, dieselben wie in der bisherigen Fassung
# abc-v2.css/.js      = abcfinance-Ansichten für den Kern
# Aufruf: python build_v2.py
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
OUT=HERE.parents[1]/'prototyp'/'company-os-abcfinance-v2.html'
r=lambda p:(HERE/p).read_text(encoding='utf-8')
out=('<title>Company OS abcfinance v2</title>\n<style>\n'+r('kern.css')+'\n'+r('abc-v2.css')+'</style>\n<div id="k-root"></div>\n<script>\n'
     +r('kern.js')+'\n'+(HERE.parent/'data.js').read_text(encoding='utf-8')+'\n'+r('abc-v2.js')+'\n</script>\n')
OUT.write_text(out,encoding='utf-8');print('geschrieben:',OUT,len(out),'Zeichen')
