import sys
p='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/ai-head-office-prototyp.html'
s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    if a not in s: sys.exit('MISSING '+a[:80])
    s=s.replace(a,b,1)
rep('function avatar(n){return `','function avatar(n){if(typeof DEMO!=="undefined"&&DEMO)return `<span class="ava" role="img" aria-label="Alex Beispiel" style="display:inline-grid;place-items:center;width:${n}px;height:${n}px;min-width:${n}px;border-radius:50%;background:#C8641A;color:#fff;font-weight:700;font-size:${Math.round(n*.38)}px;pointer-events:none">AB</span>`;return `')
rep('<span><b>Boris Hose</b><small>Einstellungen</small>','<span><b id="meName">Boris Hose</b><small>Einstellungen</small>')
rep('  $("#modeBtn").textContent=DEMO?','  $("#meName").textContent=DEMO?"Alex Beispiel":"Boris Hose";$("#meAva").innerHTML=avatar(32);\n  $("#modeBtn").textContent=DEMO?')
rep('if(d.lead[0]==="DK")d.lead[0]="LE";','if(d.lead[0]==="DK")d.lead[0]="LE";if(d.lead[0]==="BH")d.lead[0]="AB";')
# extra DMAP pairs (prepend so specific ones win)
rep('const DMAP=[\n','''const DMAP=[
 ["Einführung Bodo beim Mieterverein","Einführung CRM bei Kunde Beispiel GmbH"],
 ["offen, mit Dominik zu entscheiden","offen, mit der Entwicklung zu entscheiden"],
 ["„das Mitglied“, „der Mandant“","„der Kunde“, „der Ansprechpartner“"],
 ["Mitgliederdaten","Kundendaten"],["Mitgliedsnummer","Kundennummer"],["Mitglieder","Kunden"],["Mitglied","Kunde"],
 ["Inkasso-Übergabe","Übergabe an Dienstleister"],
 ["Boris Hose","Alex Beispiel"],["Hallo Boris","Hallo Alex"],["an Boris","an Alex"],
''')
open(p,'w',encoding='utf-8').write(s);print('ok')
