# Baut den eigenständigen ASS-Prototyp (erste Fassung, ohne Company-OS-Funktionen).
# Stil kommt aus basis/company-os-prototyp.html (Zeilen 3–263), Ergänzungen aus ../extra.css, Inhalt aus ass-app.html.
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
BASE=HERE.parents[3]/'basis'/'company-os-prototyp.html'
OUT=HERE.parents[1]/'prototyp'/'ass-prototyp-abcfinance.html'
L=BASE.read_text(encoding='utf-8').split('\n')
if L[2].strip()!='<style>' or L[262].strip()!='</style>': raise SystemExit('Basis hat sich geändert: Stilblock nicht in Zeile 3–263.')
css='\n'.join(L[3:262])
extra=(HERE.parent/'extra.css').read_text(encoding='utf-8')
fix='.mail .pill,.typerow .pill{justify-self:start}\n.typerow small{display:block}\n.canvas .node{width:126px}\n'
app=(HERE/'ass-app.html').read_text(encoding='utf-8').replace('padding-left:650px','padding-left:514px')
out='<title>ASS Prototyp abcfinance</title>\n'+L[1]+'\n<style>\n'+css+'\n'+extra.replace('.sw{display:inline-block',fix+'.sw{display:inline-block')+'</style>\n'+app
out=out.replace('.mail{display:grid;grid-template-columns:62px','.mail{display:grid;grid-template-columns:84px').replace('.mail{grid-template-columns:52px minmax(0,1fr) 110px}','.mail{grid-template-columns:84px minmax(0,1fr) 110px}')
OUT.write_text(out,encoding='utf-8');print('geschrieben:',OUT,len(out),'Zeichen')
