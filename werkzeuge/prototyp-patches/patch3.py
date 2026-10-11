import sys
D='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/'
p=D+'ai-head-office-prototyp.html'
s=open(p,encoding='utf-8').read()
demo=open(D+'v17/demo.js',encoding='utf-8').read()
def rep(a,b):
    global s
    if a not in s: sys.exit('MISSING '+a[:80])
    s=s.replace(a,b,1)
# demo bar toggle
rep('<div class="demo"><b>Prototyp</b><span>Klickbare Vorschau · Beispieldaten · nichts wird gespeichert oder ausgeführt</span></div>',
    '<div class="demo"><b>Prototyp</b><span id="modeTxt">Vorführung „Musterfirma“ · erfundene Daten</span><button class="modebtn" id="modeBtn">Pilotdaten zeigen</button></div>')
# render through demoTxt
rep('$("#view").innerHTML=V();','$("#view").innerHTML=demoTxt(V());')
rep('$("#crumb").textContent=CO[state.co].name+" · "+CO[state.co].sys;','$("#crumb").textContent=demoTxt(CO[state.co].name+" · "+CO[state.co].sys);')
rep('function ai(h){$("#msgs").insertAdjacentHTML("beforeend",`<div class="msg ai">${h}</div>`)','function ai(h){h=demoTxt(h);$("#msgs").insertAdjacentHTML("beforeend",`<div class="msg ai">${h}</div>`)')
rep('function toast(t){const e=$("#toast");e.textContent=t;','function toast(t){const e=$("#toast");e.textContent=typeof demoTxt==="function"?demoTxt(t):t;')
# pkgView links only for real ids
rep('${p.t.map(x=>`<li><a href="${B+ids[x[0]]}" target="_blank" rel="noopener"><code>${x[0]}</code></a>','${p.t.map(x=>`<li>${ids[x[0]]?`<a href="${B+ids[x[0]]}" target="_blank" rel="noopener"><code>${x[0]}</code></a>`:`<code>${x[0]}</code>`}')
# vStep demo variant
rep('function vStep(){','''function vStepDemo(){
  const st=["Anliegen erkennen und dem Kunden zuordnen.","Passende Information oder Vorlage aus der Bibliothek wählen.","Antwort im Hausstil formulieren, Zusagen nur im Rahmen der Freigaben.",...(assistStage>1?["Bei Beschwerden die Leitung Kundenservice informieren."]:[]),"Vorgang im CRM dokumentieren."];
  const draft=assistStage?"Ziel: Kundenanfrage vollständig und freundlich beantworten.\\nVorgehen:\\n"+st.map((x,i)=>(i+1)+". "+x).join("\\n")+"\\nErgebnis: Antwortentwurf zur Freigabe.\\nNicht: keine Preis- oder Terminzusagen ohne Freigabe.":"Kundenanfrage beantworten";
  return `<div class="card"><h2>Schritt bearbeiten · Kundenanfrage beantworten</h2><div class="sub">Beispiel aus den Vorlagen Kundenservice. Anweisungstext ist ein Beispiel.</div>
   <div class="two"><div class="field"><label>Abteilung</label><div class="val">Kundenservice</div></div><div class="field"><label>Ergebnisverantwortlich</label><div class="val">Leitung Kundenservice (Beispiel)</div></div><div class="field"><label>Agent</label><div class="val">◆ Annahme-Agent</div></div><div class="field"><label>Ersatz-Agent</label><div class="val">◆ Ticket-Agent (Beispiel)</div></div><div class="field"><label>Skill (Methode)</label><div class="val">anfrage-einordnen</div></div></div>
   <div class="field"><label for="ins">Arbeitsanweisung</label><textarea id="ins" class="ta" rows="${assistStage?10:2}">${esc(draft)}</textarea></div>
   <div class="acts" style="justify-content:flex-start"><button class="btn pri" data-assist="1">✦ Anweisung per KI erstellen</button><button class="btn" data-toast="Testlauf mit Beispieldaten im Dev-System gestartet (Prototyp)">Testlauf im Dev-System</button><span class="sub">Fassung ${assistStage?2:1} · frühere Fassungen bleiben erhalten</span></div>
   ${assistStage===1?`<div class="assist"><b>Anweisungs-Assistent (Haupt-KI)</b><div>Ich habe einen Entwurf geschrieben. Eine Rückfrage: Soll bei Beschwerden immer die Leitung Kundenservice informiert werden?</div><div class="q"><button class="btn sm" data-assist="2">Ja, aufnehmen</button><button class="btn sm" data-toast="Bleibt wie im Entwurf (Prototyp)">Nein</button></div></div>`:assistStage===2?`<div class="assist"><b>Anweisungs-Assistent</b><div>Übernommen. Möchtest du noch etwas ergänzen, z. B. Antwortzeiten?</div></div>`:""}
   <div class="two"><div class="field"><label>KI-Profil</label><div class="val">Texte → Claude (Beispiel)</div></div><div class="field"><label>Datenstufe</label><div class="val"><span class="lock">🔒 1 · pseudonymisiert – im Setup festgelegt</span></div></div><div class="field"><label>Bibliothek</label><div class="val">Vorlage „Antwort-E-Mail Kundenservice“</div></div><div class="field"><label>Freigabe</label><div class="val">Antwort nach Freigabe durch den Kundenservice</div></div></div></div>`;
}
function vStep(){if(DEMO)return vStepDemo();''')
# chat chip clicks use current SCRIPT keys (already dynamic). insert demo before final render
rep('render();\nsetTimeout(popNote,3500);\n</script>',demo+'\nrender();\nsetTimeout(popNote,3500);\n</script>')
rep('@media (prefers-reduced-motion:reduce)','''.modebtn{margin-left:auto;border:1px solid rgba(255,255,255,.35);background:none;color:inherit;border-radius:999px;padding:1px 10px;font-size:11.5px;font-weight:600;flex:none}
@media (prefers-reduced-motion:reduce)''')
open(p,'w',encoding='utf-8').write(s);print('ok',len(s))
