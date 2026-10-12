# Baut den Company-OS-Prototyp für abcfinance aus dem generellen Prototyp (basis/) und der Konfiguration in diesem Ordner.
# Aufruf: python build.py   (aus beliebigem Ordner)
# ACHTUNG: übernimmt Funktionen über feste Zeilenbereiche aus basis/company-os-prototyp.html (Stand Commit ef475e3).
# Ändert sich die Basis, schlägt der Bau mit einer Meldung fehl, statt still etwas Falsches zu erzeugen.
import re, pathlib
HERE=pathlib.Path(__file__).resolve().parent
BASE=HERE.parents[2]/'basis'/'company-os-prototyp.html'
OUT=HERE.parent/'prototyp'/'company-os-prototyp-abcfinance.html'
L=BASE.read_text(encoding='utf-8').split('\n')
def rng(a,b): return '\n'.join(L[a-1:b])
css=rng(3,263)  # <style>...</style>
extra=open(HERE/'extra.css',encoding='utf-8').read()
css=css.replace('</style>',extra+'\n.pill{white-space:normal}\n</style>')
body=rng(265,298)
body=body.replace('<div class="demo"><b>Prototyp</b><span id="modeTxt">Vorführung „Musterfirma“ · erfundene Daten</span><button class="modebtn" id="modeBtn">Pilotdaten zeigen</button></div>',
 '<div class="demo"><b>Prototyp</b><span>Company OS · abcfinance · Posteingang mit KI (ASS) · Beispieldaten · nichts wird gespeichert oder ausgeführt</span></div>')
body=body.replace('<b id="meName">Boris Hose</b><small>Einstellungen</small>','<b id="meName">Sandra Weber</b><small>Einstellungen</small>')
body=body.replace('Sitzung „Elevator Pitch – Kostenfolie“ ist fertig','Auswertung Schattenbetrieb Woche 2 ist fertig')
body=body.replace('Frage oder Auftrag … (Diktat über die Tastatur möglich)','Frage zum Posteingang oder Auftrag …')
assert 'modeBtn' not in body
# Prüfung: stimmen die Zeilenanker der Basis noch?
ANK={300:'const $=s=>',443:'function chainHTML',512:'function agentFor',516:'function vProc',587:'const DSTL',602:'const N=',614:'function vProj',708:'const LVN',799:'function skillModal',805:'function vKi',872:'const activeN',914:'function bellModal',930:'function me(',948:'document.addEventListener("click"',1009:'document.addEventListener("keydown"'}
for n,a in ANK.items():
    if not L[n-1].startswith(a): raise SystemExit(f'Basis hat sich geändert: Zeile {n} beginnt nicht mit {a!r}. Zeilenbereiche in build.py anpassen.')
keep=[]
def K(a,b,reps=()):
    s=rng(a,b)
    for x,y in reps:
        assert x in s,(a,x); s=s.replace(x,y)
    keep.append(s)
K(300,302)
K(443,443)
K(512,514)
K(516,587,[('(Bodo bzw. sellify)','(sellify)'),
 ('<button class="add" data-toast="Branchenpaket Immobilien- und Gewerbeimmobilienverwaltung ist in Vorbereitung">Immobilienverwaltung · in Vorbereitung</button>','<button class="add" data-toast="Branchenpaket Leasing &amp; Finanzierung ist eine Idee, noch nicht vorhanden">Leasing &amp; Finanzierung · Idee</button>')])
K(602,604)
s=rng(614,638); s=s.replace('${state.co==="ba"?"sellify":"Bodo"}','sellify'); s=re.sub(r'\bBodo\b','sellify',s)
s=s.replace('nach „Konzept &amp; Mockup“ ist eine Verzweigung gesetzt','nach der Anbindung laufen Anlernen und Testmengen parallel')
keep.append(s)
K(708,736)
K(799,804)
K(805,827,[('z. B. Betriebskostenabrechnung prüfen','z. B. Reklamation vorprüfen'),('z. B. Termin dokumentieren','z. B. Mail lesen, Kontakt zuordnen'),('(Anschluss an Bodo/sellify)','(Anschluss an sellify)'),('„das Mitglied“, „der Mandant“','„der Kunde“, „der Vertragspartner“'),('Mitgliederdaten nur pseudonymisiert','Kundendaten nur pseudonymisiert'),('Besondere Kategorien (z. B. Gesundheit) nie an Stufe 0/1','Bankverbindungen nie an Zusatz-Anbieter')])
K(872,912,[('`<button class="btn sm ${big?"pri":""}" data-sact="${i}:open">Sitzung öffnen</button>','`${s.mail?`<button class="btn sm ${big?"pri":""}" data-job="${s.mail}">Vorgang öffnen</button>`:`<button class="btn sm ${big?"pri":""}" data-sact="${i}:open">Sitzung öffnen</button>`}'),
 ('<button class="btn sm" data-sact="${i}:open">Öffnen</button></div>`).join("")||','${s.mail?`<button class="btn sm" data-job="${s.mail}">Öffnen</button>`:`<button class="btn sm" data-sact="${i}:open">Öffnen</button>`}</div>`).join("")||'),
 ('["sess","Meine KI-Sitzungen"]','["sess","Meine Vorgänge & Sitzungen"]'),
 ('Sonntag, 11. Oktober','Montag, 12. Oktober'),('überfällig in Bodo','überfällig in sellify'),('aktive Sitzungen</span>','aktive Vorgänge</span>'),('aktive Sitzungen – unter','aktive Vorgänge – unter'),
 ('Beispieldaten aus den Themen der heutigen Arbeit; Status, Termine und Zeitschätzungen sind simuliert.','Beispieldaten: Vorgänge aus Prozessen, die auf dich eskaliert sind oder deine Freigabe brauchen, erscheinen hier wie KI-Sitzungen. Status und Termine sind simuliert.'),
 ('Termine aus Bodo und sellify','Termine aus sellify'),('ruhende Sitzungen aufräumen, Demo vorbereiten','Auswertung Schattenbetrieb mit dem Team besprechen'),
 ('<h2>Meine KI-Sitzungen</h2><div class="sub">Sitzungen aus Cowork, Claude Code, Handy-Chats und geplanten Aufgaben. Je Karte: Stand, was du jetzt tun musst, Ergebnis. Die KI ordnet Unternehmen und Projekt zu – oder fragt nach. Beispieldaten.</div>','<h2>Meine Vorgänge &amp; Sitzungen</h2><div class="sub">Vorgänge aus Prozessen, geplante Aufgaben und eigene KI-Sitzungen. Je Karte: Stand, was du jetzt tun musst, Ergebnis. Beispieldaten.</div>')])
K(914,920)
K(930,932)
K(948,1009)
data=open(HERE/'data.js',encoding='utf-8').read(); fn=open(HERE/'fn.js',encoding='utf-8').read()
js='\n'.join([keep[0],data]+keep[1:]+[fn,'render();\nsetTimeout(popNote,3500);'])
out='<title>Company OS Prototyp abcfinance</title>\n'+L[1]+'\n'+css+'\n'+body+'\n<script>\n'+js+'\n</script>\n'
OUT.write_text(out,encoding='utf-8')
print('geschrieben:',OUT,len(out),'Zeichen')
