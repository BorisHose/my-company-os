# Baut die allgemeine Fassung v2 (Pilot business//acts + Bodo Solutions) aus dem gemeinsamen Kern.
# basis/kern/kern.css + kern.js = allgemeiner Kern (keine Kundendaten)
# pilot-alt.js  = Daten des bisherigen Pilot-Prototyps (Organigramm, Prozesse, Agenten, Aufträge …)
# pilot-mcp.js  = per MCP gelesene Daten (Bodo echt, sellify Testdaten) – Stand siehe Datei
# pilot-v2.css/.js = Ansichten des Pilots für den Kern
# Aufruf: python build_pilot_v2.py   ·   Ergebnis enthält echte Bodo-Daten: nur intern verwenden.
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
KERN=HERE.parents[3]/'basis'/'kern'
OUT=HERE.parents[1]/'prototyp'/'company-os-pilot-v2.html'
r=lambda p:(HERE/p).read_text(encoding='utf-8')
k=lambda p:(KERN/p).read_text(encoding='utf-8')
out=('<title>Company OS Pilot v2</title>\n<style>\n'+k('kern.css')+'\n'+r('pilot-v2.css')+'</style>\n<div id="k-root"></div>\n<script>\n'
     +k('kern.js')+'\n'+r('pilot-alt.js')+'\n'+r('pilot-mcp.js')+'\n'+r('pilot-v2.js')+'\n</script>\n')
OUT.write_text(out,encoding='utf-8');print('geschrieben:',OUT,len(out),'Zeichen')
