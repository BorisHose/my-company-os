import re,sys
D='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/'
s=open(D+'v17/backup-v16.html',encoding='utf-8').read()
proc=open(D+'v17/proc.js',encoding='utf-8').read()
def rep(a,b,count=1):
    global s
    if a not in s: sys.exit('MISSING: '+a[:80])
    s=s.replace(a,b,count)

# 1 replace chainHTML..vJobs block
i=s.index('function chainHTML(arr)'); j=s.index('const SKC=')
s=s[:i]+proc+'\n'+s[j:]

# 2 state
rep('let state={co:"all",area:"cockpit",projTab:"hagen",setTab:"profil"};',
    'let state={co:"all",area:"cockpit",projTab:"mine",setTab:"profil",procSel:null,procView:"list",tplF:"Branchenpaket Mieterverein",projSel:null,phaseSel:"p2",desMode:"proc",desStage:0,desPrompt:"",showNo:false};')

# 3 ORG: add process-leading agents
rep('ag:["Recherche-Agent","Vertriebsassistent Bodo","Produktinformations-Agent","Angebots-Agent"],al:"2 Freigaben warten"}',
    'pa:[["Lead-Prozessagent","führt: Lead-Gewinnung"],["Vertriebs-Prozessagent","führt: Vertrieb · Lead bis Abschluss"]],ag:["Recherche-Agent","Aufbereitungs-Agent","Vertriebsassistent Bodo","Produktinformations-Agent","Angebots-Agent"],al:"2 Freigaben warten"}')
rep('ag:["Einführungs-Agent","Einrichtungs-Agent","Datenübernahme-Agent","Vorlagen-Agent"]',
    'pa:[["Anforderungs-Prozessagent","führt: Anforderung aufnehmen und bewerten"]],ag:["Einführungs-Agent","Einrichtungs-Agent","Datenübernahme-Agent","Vorlagen-Agent"]')
rep('ag:["Annahme-Agent","Ticket-Agent"],ok:"Alles im Plan"}',
    'pa:[["Service-Prozessagent","führt: Betrieb · Anfrage bis Rückmeldung"]],ag:["Annahme-Agent","Ticket-Agent"],ok:"Alles im Plan"}')
rep('ag:["Ticket-Agent · unterstützt"],ok:',
    'pa:[["Projekt-Agent Entwicklung","projektverantwortlich: Entwicklungsprojekt Inkasso-Schnittstelle"]],ag:["Ticket-Agent · unterstützt"],ok:')
rep('ag:["Vertriebsassistent sellify","Angebots-Agent","Video-Agent"]',
    'pa:[["Angebots-Prozessagent","führt: Angebot erstellen"]],ag:["Vertriebsassistent sellify","Angebots-Agent","Video-Agent"]')
rep('ag:["Onboarding-Agent sellify","Einrichtungs-Agent"]',
    'pa:[["Onboarding-Prozessagent","führt: Onboarding sellify-Kunde (Entwurf)"]],ag:["Onboarding-Agent sellify","Einrichtungs-Agent"]')
rep('''   <div class="sec"><div class="lbl" style="padding:0">Agenten</div>''',
    '''   ${d.pa&&d.pa.length?`<div class="sec"><div class="lbl" style="padding:0">Prozessführung</div>${d.pa.map(p=>`<div class="m"><span class="bot lead">◆</span><span><b>${esc(p[0])}</b><small class="sub" style="display:block">${esc(p[1])}</small></span></div>`).join("")}</div>`:""}
   <div class="sec"><div class="lbl" style="padding:0">Agenten</div>''')
rep('Darunter jede Abteilung: eine Leitung, eine Vertretung, Mitarbeitende und Agenten mit einheitlichem Symbol.',
    'Darunter jede Abteilung: eine Leitung, eine Vertretung, Mitarbeitende, Prozessverantwortliche Agenten (führen je einen Prozess) und Agenten mit einheitlichem Symbol.')

# 4 SKC + AG
rep('"bodo-produktinformation":["Produktblatt im Hausstil",0,0]};',
    '"bodo-produktinformation":["Produktblatt im Hausstil",0,0],"lead-recherche":["Leads recherchieren",0,0],"lead-aufbereiten":["Leads aufbereiten und bewerten",1,0],"anfrage-einordnen":["Anfragen einordnen",1,0],"termin-vereinbaren":["Termine vereinbaren und erinnern",1,0],"prozess-fuehren":["Prozess führen: Schritte vergeben, prüfen, eskalieren",0,0]};')
i=s.index('const AG=['); j=s.index('];',i)+2
s=s[:i]+'''const AG=[
 {n:"Recherche-Agent",d:"Vertrieb",t:"Leads recherchieren, Dubletten prüfen",sk:["kontakt-anlegen","lead-recherche"],lim:-1,prof:"Schnell & günstig",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Lead-Gewinnung","Vertrieb · Lead bis Abschluss"],ver:"v4",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Aufbereitungs-Agent",d:"Vertrieb",t:"Leads aufbereiten und bewerten",sk:["lead-aufbereiten"],lim:-1,prof:"Texte",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Lead-Gewinnung"],ver:"v3 · geändert",p:{lesen:1,anlegen:0,mail:0,loeschen:0}},
 {n:"Lead-Prozessagent",d:"Vertrieb",t:"führt den Prozess Lead-Gewinnung",sk:["prozess-fuehren"],lim:-1,prof:"Gründlich prüfen",resp:"Boris Hose (ergebnisverantwortlich)",r:"Prozessverantwortlich",inn:["Lead-Gewinnung"],ver:"v1",p:{lesen:1,anlegen:0,mail:0,loeschen:0}},
 {n:"Angebots-Agent",d:"Vertrieb",t:"Angebote nach Vorlage",sk:["bodo-angebot","email-erstellung"],lim:-1,prof:"Texte",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Vertrieb · Lead bis Abschluss","Angebot erstellen"],ver:"v2",p:{lesen:1,anlegen:1,mail:1,loeschen:0}},
 {n:"Annahme-Agent",d:"Kundenservice",t:"Anfragen annehmen und einordnen",sk:["anfrage-einordnen","email-erstellung"],lim:-1,prof:"Schnell & günstig",resp:"Support",r:"Mitarbeiter",inn:["Betrieb · Anfrage bis Rückmeldung"],ver:"v2",p:{lesen:1,anlegen:1,mail:1,loeschen:0}},
 {n:"Einrichtungs-Agent",d:"Einführung",t:"Kataloge Bereich für Bereich einrichten",sk:["bodo-ersteinrichtung"],lim:0,prof:"Gründlich prüfen",resp:"Projektleitung",r:"Mitarbeiter",inn:["Onboarding sellify-Kunde"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Einführungs-Agent",d:"Einführung",t:"Einführungsprojekt anlegen, Anforderungen aufnehmen",sk:["bodo-einfuehrung-anlegen","termin-vereinbaren"],lim:-1,prof:"Schnell & günstig",resp:"Projektleitung",r:"Mitarbeiter",inn:["Anforderung aufnehmen und bewerten"],ver:"v2",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Ticket-Agent",d:"Kundenservice / Produktentwicklung",t:"Tickets ohne Dubletten, mit Screenshot",sk:["bodo-ticket-anlegen","feature-request-screenshot"],lim:-1,prof:"Gründlich prüfen",resp:"Support",r:"Mitarbeiter",inn:["Betrieb · Anfrage bis Rückmeldung","Anforderung aufnehmen und bewerten"],ver:"v3",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Projekt-Agent Entwicklung",d:"Produktentwicklung",t:"projektverantwortlich für das Entwicklungsprojekt Inkasso-Schnittstelle",sk:["prozess-fuehren"],lim:-1,prof:"Gründlich prüfen",resp:"Abnahmen: ergebnisverantwortliche Menschen je Phase",r:"Projektverantwortlich",inn:["Entwicklungsprojekt Inkasso-Schnittstelle"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Video-Agent",d:"Vertrieb",t:"Szenenvideos",sk:["bodo-video","sellify-video"],lim:0,prof:"Bilder",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:[],ver:"v1",p:{lesen:1,anlegen:0,mail:0,loeschen:0}}
];'''+s[j:]

# 5 vAgents
rep('''  return `<div class="stack"><div class="sub">Agenten heißen nach ihrer Funktion und arbeiten mit Skills – fein geschnittenen, geprüften Arbeitsanleitungen. Klick auf einen Agenten öffnet Skills und Einstellungen.</div>''',
    '''  return `<div class="stack"><div class="card"><h2>Agentenpool</h2><div class="sub">Alle Agenten des Unternehmens. Sie heißen nach ihrer Funktion und arbeiten mit Skills. Beim Entwerfen eines Prozesses werden sie fest eingesetzt (dazu je Schritt optional ein Ersatz-Agent) – keine Ausleihe zur Laufzeit. Ändert die Heimat-Abteilung einen Agenten, bekommen die betroffenen Prozesse einen Hinweis und einen Testlauf, bevor sie die neue Version übernehmen.</div></div>''')
rep('''<div class="sub">Skills: ${a.sk.join(" · ")}</div><div class="meta"><span class="pill p-wait">Freigabe bei Außenwirkung</span>${lvTag(agLv(a))}</div>''',
    '''<div class="sub">Skills: ${a.sk.join(" · ")}</div><div class="sub">Eingesetzt in: ${a.inn.length?esc(a.inn.join(" · ")):"noch in keinem Prozess"}</div><div class="meta"><span class="pill ${a.r==="Mitarbeiter"?"p-open":"p-run"}">${a.r}</span><span class="lv">${a.ver}</span>${lvTag(agLv(a))}</div>''')
rep('''<span class="bot">◆</span><div><h3>${a.n}</h3>''','''<span class="bot ${a.r==="Mitarbeiter"?"":"lead"}">◆</span><div><h3>${a.n}</h3>''')
rep('''<div class="two"><div class="field"><label>KI-Profil</label><div class="val">${a.prof} (Beispiel)</div></div><div class="field"><label>Verantwortlicher Mensch</label><div class="val">${a.resp}</div></div></div>''',
    '''<div class="two"><div class="field"><label>Rolle</label><div class="val">${a.r}</div></div><div class="field"><label>Eingesetzt in</label><div class="val">${a.inn.length?esc(a.inn.join(" · ")):"noch in keinem Prozess"}</div></div><div class="field"><label>Version</label><div class="val">${a.ver}</div></div><div class="field"><label>KI-Profil</label><div class="val">${a.prof} (Beispiel)</div></div><div class="field"><label>Zuständiger Mensch</label><div class="val">${esc(a.resp)}</div></div></div>''')

# 6 vStep
rep('<div class="field"><label>Verantwortlich</label><div class="val">Leitung Rechtsberatung (Beispiel)</div></div><div class="field"><label>Agent</label><div class="val">◆ Prüf-Agent</div></div>',
    '<div class="field"><label>Ergebnisverantwortlich</label><div class="val">Leitung Rechtsberatung (Beispiel)</div></div><div class="field"><label>Agent</label><div class="val">◆ Prüf-Agent</div></div><div class="field"><label>Ersatz-Agent</label><div class="val">◆ Rechtsprüf-Agent (Beispiel)</div></div>')

# 7 cockpit: process KPIs
rep('''  <div class="card"><h2>Abteilungen</h2><div class="list">${ORG[k]''',
    '''  <div class="card"><h2>Prozesse</h2><div class="kpis"><div class="kpi"><b>${PROC[k].filter(p=>p.st==="aktiv").length}</b><span>aktiv</span></div><div class="kpi"><b>${PROC[k].filter(p=>p.st==="im Test").length}</b><span>im Test</span></div><div class="kpi"><b>${PROC[k].filter(p=>p.st==="Entwurf").length}</b><span>Entwürfe</span></div><div class="kpi warn"><b>${SUG.filter(s=>s.s==="offen").length}</b><span>Vorschläge offen</span></div></div><div class="acts" style="justify-content:flex-start"><button class="btn sm" data-ptabgo="mine">Prozesse</button><button class="btn sm" data-ptabgo="sug">Vorschläge ansehen</button></div></div>
  <div class="card"><h2>Abteilungen</h2><div class="list">${ORG[k]''')

# 8 Setup
rep(''' ["Prozesse & Projekte",[["Aus dem Paket","Mitglied aufnehmen · Beratungstermin · Beitragslauf · Mieteranfrage · Betriebskosten prüfen"],["Je Schritt","Arbeitsanweisung · KI-Profil · Datenstufe"]]],''',
    ''' ["Prozesse & Projekte",[["Vorschlagsliste","aus dem Branchenpaket: Prozesse und Projektvorlagen – direkt übernehmen, anpassen, ablehnen oder später"],["Je Schritt","Arbeitsanweisung · Agent und Ersatz-Agent · KI-Profil · Datenstufe"],["Übernommenes","startet als Entwurf, aktiv erst nach Testlauf"],["Projekte","werden in Bodo bzw. sellify verwaltet; Meilensteine erscheinen dort unter Fristen"]]],''')
rep('''    ${setupStep===2?'<div class="alert">''','''    ${SETUP[setupStep][0]==="Prozesse & Projekte"?'<div class="acts" style="justify-content:flex-start"><button class="btn" data-ptabgo="sug">Vorschlagsliste öffnen</button></div>':""}
    ${setupStep===2?'<div class="alert">''')

# 9 Chat script
rep(''' "Was wartet heute auf mich?":''',''' "Entwirf einen Prozess für die Lead-Gewinnung":`Ich habe einen Entwurf im Designer vorbereitet: 5 Schritte, Agenten aus dem Pool mit Begründung, eine Lücke (kein Agent mit Skill „lead-bewertung“). Prozessverantwortlich: Lead-Prozessagent, ergebnisverantwortlich: du (Vorschlag).<div class="acts" style="margin-top:6px"><button class="btn sm acc" data-ptabgo="des" data-desgo="1">Im Designer öffnen</button></div>`,
 "Schlag mir weitere Prozesse vor":`Aus deinem Organigramm und dem Branchenpaket kämen dazu infrage:<ul><li>Mahnwesen bis Inkasso-Übergabe (Buchhaltung)</li><li>Beschwerde bearbeiten (Kundenservice)</li></ul>Soll ich beide auf die Vorschlagsliste setzen?`,
 "Was wartet heute auf mich?":''')

# 10 newJob with project context
i=s.index('function newJob(){'); j=s.index('\n}\n',i)+3
s=s[:i]+'''function newJob(ctx){
  const inP=!!ctx;
  $("#modal").innerHTML=`<div class="modal" data-close><div class="card" role="dialog" aria-modal="true" aria-label="Neuer Auftrag"><h2>Neuer Auftrag</h2>
  <div class="field"><label for="jt">Was soll passieren?</label><textarea id="jt" rows="3" style="border:1px solid var(--line);border-radius:9px;padding:8px 10px;background:var(--bg)">${inP?"Feedbackrunde 3 zum Mockup mit dem Kunden abstimmen":"Angebot für den Mieterverein Musterstadt vorbereiten, 2.400 Mitglieder"}</textarea></div>
  <div class="field"><label>Wo?</label><div class="seg"><button data-opt aria-pressed="${!inP}">intern · ohne Projekt</button><button data-opt aria-pressed="${inP}">im Projekt${inP?": "+esc(ctx):" …"}</button></div></div>
  <div class="sub">Vorschlag des Agenten</div>
  <div class="stack" style="gap:8px">
  <button class="opt" aria-pressed="true" data-opt><div><b>${inP?"Prozess „Klickbares Mockup erstellen und abstimmen“":"Prozess „Vertrieb“ ab Schritt „Angebot“"}</b><div class="sub">${inP?"Phase 2 · ◆ Projekt-Agent Entwicklung führt · Ergebnisverantwortlich: Boris Hose":"◆ Vertriebs-Prozessagent führt · Angebots-Agent · Ergebnisverantwortlich: Boris Hose · Freigabe vor Versand"}</div></div></button>
  <button class="opt" aria-pressed="false" data-opt><div><b>Einzelaufgabe an den persönlichen Assistenten</b><div class="sub">ohne Prozess, direkt erledigen</div></div></button></div>
  <div class="acts"><button class="btn" data-close>Abbrechen</button><button class="btn pri" data-start>Auftrag starten</button></div></div></div>`;
}
'''+s[j:]

# 11 events
rep('''  if(b.dataset.ptab){state.projTab=b.dataset.ptab;render();return}''',
'''  if(b.dataset.ptabgo){state.projTab=b.dataset.ptabgo;state.procView="list";if(b.dataset.desgo){state.desMode="proc";state.desStage=1;state.desPrompt=""}$("#modal").innerHTML="";if($("#chat").classList.contains("big")||innerWidth<900)chatOpen(false);go({area:"proc"});return}
  if(b.dataset.ptab){state.projTab=b.dataset.ptab;state.procView="list";if(b.dataset.desmode){state.desMode=b.dataset.desmode;state.desStage=1}render();return}
  if(b.dataset.proc){state.procSel=b.dataset.proc;state.procView="detail";render();return}
  if(b.hasAttribute("data-procback")){state.procView=state.procView==="step"?"detail":"list";render();return}
  if(b.hasAttribute("data-stepedit")){state.procView="step";render();return}
  if(b.dataset.tplf){state.tplF=b.dataset.tplf;render();return}
  if(b.dataset.tpl!==undefined){tplModal(+b.dataset.tpl);return}
  if(b.dataset.adopt!==undefined){const n=TPL[+b.dataset.adopt].n;$("#modal").innerHTML="";const sg=SUG.find(x=>x.n===n);if(sg)sg.s="übernommen";adopt(n);return}
  if(b.dataset.sugchk!==undefined){const i=+b.dataset.sugchk;sugSel.has(i)?sugSel.delete(i):sugSel.add(i);render();return}
  if(b.dataset.suga){const [i,a]=b.dataset.suga.split(":");sugAct(+i,a);return}
  if(b.hasAttribute("data-sugall")){const L=[...sugSel];sugSel.clear();L.forEach(i=>{SUG[i].s="übernommen";const t=TPL.find(x=>x.n===SUG[i].n);if(t&&!PROC[state.co].some(x=>x.n===t.n))PROC[state.co].push({id:"x"+i+Date.now(),n:t.n,dep:t.f,st:"Entwurf",v:"v1",pa:"wird im Designer vorgeschlagen",er:"offen",run:"–",steps:t.d.split(" → ").map(x=>S(x,"–","im Designer zuordnen","–",""))})});render();toast(L.length+" Vorschläge als Entwurf übernommen (Prototyp)");return}
  if(b.hasAttribute("data-sugno")){state.showNo=!state.showNo;render();return}
  if(b.dataset.desmode){state.desMode=b.dataset.desmode;state.desStage=0;state.desPrompt="";render();return}
  if(b.dataset.desstage){const v=+b.dataset.desstage;const ta=$("#dp");if(ta)state.desPrompt=ta.value;state.desStage=v;render();const M={1:"Entwurf erzeugt – bitte prüfen (Prototyp)",2:"Geprüft: keine Regelverstöße, 1 Hinweis offen (Prototyp)",3:"Testlauf im Dev-System mit Beispieldaten erfolgreich (Prototyp)",4:"Aktiviert als Version 1 (Prototyp)"};toast(M[v]);return}
  if(b.dataset.proj){state.projSel=b.dataset.proj;render();return}
  if(b.dataset.phase){state.phaseSel=b.dataset.phase;render();return}
  if(b.dataset.pjob!==undefined){newJob(b.dataset.pjob);return}''')
rep('''  if(b.hasAttribute("data-start")){$("#modal").innerHTML="";toast("Auftrag gestartet – Vertrieb ist informiert (Prototyp)");return}''',
    '''  if(b.hasAttribute("data-start")){$("#modal").innerHTML="";toast("Auftrag gestartet – der Prozessverantwortliche Agent übernimmt (Prototyp)");return}''')
rep('''  if(b.id==="newJob")newJob();''','''  if(b.id==="newJob")newJob("");''')

# 12 CSS
rep('@media (prefers-reduced-motion:reduce)','''.bot.lead{background:var(--ink);color:var(--surface);border-color:var(--ink)}
.three{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.canvas{background-color:var(--bg);background-image:radial-gradient(var(--line) 1px,transparent 1px);background-size:16px 16px;border:1px solid var(--line);border-radius:12px;padding:20px;overflow-x:auto}
.flow{display:flex;align-items:center;min-width:max-content}
.node{border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:8px 10px;width:170px;font-size:12.5px;display:flex;flex-direction:column;gap:3px}
.node.gap{border:2px dashed var(--accent)}
.ev{width:28px;height:28px;border-radius:50%;border:2px solid var(--ink);background:var(--surface);flex:none}
.ev.end{border-width:5px}
.gwrap{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11px;color:var(--muted);text-align:center;min-width:70px}
.gw{width:30px;height:30px;transform:rotate(45deg);border:2px solid var(--ink);background:var(--surface);flex:none;display:grid;place-items:center}
.gw span{transform:rotate(-45deg);font-weight:800;font-size:13px}
.gw.sm{width:22px;height:22px}
.ln{width:26px;height:2px;background:var(--muted);flex:none;position:relative}
.ln::after{content:"";position:absolute;right:-1px;top:-4px;border-left:7px solid var(--muted);border-top:5px solid transparent;border-bottom:5px solid transparent}
.parcol{display:flex;flex-direction:column;gap:10px;padding:8px;border:1px dashed var(--muted);border-radius:12px}
.msn{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11px;color:var(--muted);text-align:center;width:104px}
.dia{width:16px;height:16px;transform:rotate(45deg);background:var(--accent);border-radius:3px;display:inline-block;flex:none}
.dia.done{background:var(--ok)}
.phases{display:flex;align-items:center;gap:8px;overflow-x:auto;padding:6px 2px}
.ph{width:190px;flex:none;border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface);text-align:left;display:flex;flex-direction:column;gap:4px}
.ph[aria-current="true"]{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
.ph.st-done{border-left:4px solid var(--ok)}.ph.st-run{border-left:4px solid var(--info)}.ph.st-open{border-left:4px solid var(--line)}
.ms{display:flex;flex-direction:column;align-items:center;gap:8px;width:110px;flex:none;font-size:11px;color:var(--muted);text-align:center}
.par{display:flex;flex-direction:column;gap:8px;padding:8px;border:1px dashed var(--muted);border-radius:12px;flex:none}
@media (prefers-reduced-motion:reduce)''')

open(D+'ai-head-office-prototyp.html','w',encoding='utf-8').write(s)
print('ok',len(s))
