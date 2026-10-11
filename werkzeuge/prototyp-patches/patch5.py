import sys,re
p='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/ai-head-office-prototyp.html'
s=open(p,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    if a not in s: sys.exit('MISSING '+a[:90])
    s=s.replace(a,b,cnt)
# 1 real PKG data
i=s.index('const PKG=[');j=s.index('];',i)+2
s=s[:i]+'''const PKG=[
 {n:"Datenübernahme",c:"#147a5c",v:"Dominik Koppe",b:"Boris Hose",due:"31.10.",ag:"Datenübernahme-Agent",st:["p-bad","1 überfällig"],t:[["AG-1","Aktuelle Daten aus MIV Hagen Datenbank holen","p-ok","erledigt","",""],["AG-2","MIV Hagen Datenbank in Bodo importieren und als Dev Convex zur Verfügung stellen","p-ok","erledigt","02.08.","Dominik Koppe"],["AG-90","Migration von „Hinweisen“ am Kontakt","p-ok","erledigt","","Dominik Koppe"],["AG-81","Sachbearbeiter Klärung – welche User sind aktiv","p-ok","erledigt","",""],["AG-87","Bitfarm Dokumenten Migration","p-bad","in Bearbeitung · überfällig","18.09.","Dominik Koppe"],["AG-82","Lastschrift Oktober simulieren","p-open","offen","",""]]},
 {n:"Setup definieren",c:"#2457c5",v:"Boris Hose",b:"Dominik Koppe",due:"07.11.",ag:"Einrichtungs-Agent",st:["p-bad","1 überfällig"],t:[["AG-183","Nummernkreis-Übergabe MIV Hagen – Kontakt vs. Vertrag","p-bad","in Bearbeitung · überfällig","01.10.","Dominik Koppe"],["AG-85","Suchvorlagen & Listenexport (pdf / xlsx)","p-open","offen","",""],["AG-86","Auswertungen","p-open","offen","",""],["AG-84","Artikel zu Gewerbetarif bündeln","p-open","offen","","Dominik Koppe"],["AG-83","2 Jahre Kündigungsfrist an Verträgen festhalten","p-open","offen","",""]]},
 {n:"Anforderungen & Change Requests",c:"#c8641a",v:"Boris Hose",b:"Dominik Koppe",due:"14.11.",ag:"◆ Anforderungs-Prozessagent",st:["p-wait","Bewertung offen"],t:[["AG-114","Prozessübergabe an Inkasso durchdenken und definieren","p-bad","in Bearbeitung · überfällig","17.09.","Boris Hose"],["AG-88","Meldungen an den Landesverband","p-open","offen","",""]],ev:true},
 {n:"Dokumentvorlagen",c:"#6a4fb3",v:"offen",b:"–",due:"–",ag:"Vorlagen-Agent",st:["p-open","nicht geplant"],t:[]},
 {n:"Benutzerschulung",c:"#8a5a12",v:"offen",b:"–",due:"–",ag:"Einführungs-Agent",st:["p-open","nicht geplant"],t:[]},
 {n:"Übergabe Dev → Produktiv",c:"#14213d",v:"Boris Hose",b:"Dominik Koppe",due:"–",ag:"Einrichtungs-Agent",st:["p-wait","blockiert"],t:[],block:"KI-Zugang im Vereinssystem fehlt (Angabe zur Rechtsberatung)"},
 {n:"Projektsteuerung & Abstimmung",c:"#5d6579",v:"Boris Hose",b:"Dominik Koppe",due:"laufend",ag:"Persönlicher KI-Assistent",st:["p-run","laufend"],t:[["AG-100","Terminaufzeichnungen 8.9.26 mit Dominik teilen","p-ok","erledigt","08.09.","Boris Hose"],["AG-101","Neue Teams Termin Einladung für 15.09. rausschicken","p-ok","erledigt","25.09.","Boris Hose"]]}
];
const BO="https://bodo-app.com/o/k57bshnkdpahzs3fv4hvq6wz1s8aq2pm/";
const BLINK=[["MIV Hagen Migration",BO+"projekte/js7jm4cbk99fwprsngazz7a0ad8bbzjk"],["Bodo - Einführung bei MIV Hagen",BO+"projekte/js7yhx046fsx5nnmnvt8y4vbgs8fvj9g"],["K-0037",BO+"parties/kh7ayp3a941n1ft1fewvgkfq0d8ewt1x"]];
const HAGEN={stand:"11.10.2026",kunde:["Mietervereine Hagen","K-0037",BO+"parties/kh7ayp3a941n1ft1fewvgkfq0d8ewt1x"],kontakte:[["Kirsten Horn","Verwaltungsleitung",BO+"parties/kh7e8yxee73en3rf3tqt23bw0x8fdyna"],["Stefan Wintersohle","Rechtsanwalt",BO+"parties/kh74gnthgmgb2t8aafbnk6nbb18fg2tt"]],
 proj:[["MIV Hagen Migration","15 Aufgaben",BO+"projekte/js7jm4cbk99fwprsngazz7a0ad8bbzjk"],["Bodo - Einführung bei MIV Hagen","Projekttyp Bodo-Einführung, noch ohne Aufgaben",BO+"projekte/js7yhx046fsx5nnmnvt8y4vbgs8fvj9g"]],
 hot:[["AG-114","Prozessübergabe an Inkasso durchdenken und definieren","Boris Hose","17.09.","Feature Request · Priorität hoch · noch ohne Beschreibung","◆ Anforderungs-Prozessagent: Beschreibung als Entwurf schreiben, Kosten und Angebotsbezug bewerten, dir zur Freigabe vorlegen"],
      ["AG-87","Bitfarm Dokumenten Migration","Dominik Koppe","18.09.","Priorität hoch","Persönlicher KI-Assistent: Stand bei Dominik Koppe erfragen, neue Frist vorschlagen und in Bodo eintragen"],
      ["AG-183","Nummernkreis-Übergabe MIV Hagen – Kontakt vs. Vertrag","Dominik Koppe","01.10.","Priorität normal","Einrichtungs-Agent: Entscheidungsvorlage Kontaktnummer vs. Vertragsnummer vorbereiten"]]};
'''+s[j:]
# 2 ids map: keep as is (already has all 15)
# 3 pkgView rows: due + assignee + agent line
rep('<li>${ids[x[0]]?`<a href="${B+ids[x[0]]}" target="_blank" rel="noopener"><code>${x[0]}</code></a>`:`<code>${x[0]}</code>`}<span style="flex:1">${esc(x[1])}</span><span class="pill ${x[2]}">${x[3]}</span></li>',
    '<li>${ids[x[0]]?`<a href="${B+ids[x[0]]}" target="_blank" rel="noopener"><code>${x[0]}</code></a>`:`<code>${x[0]}</code>`}<span style="flex:1">${esc(x[1])}${(x[4]||x[5])?`<br><small class="sub">${[x[5]?"Bearbeitung: "+esc(x[5]):"",x[4]?"fällig "+x[4]:""].filter(Boolean).join(" · ")}</small>`:""}</span><span class="pill ${x[2]}">${x[3]}</span></li>')
rep('<span>Frist: ${p.due}</span><span class="pill ${p.st[0]}">${p.st[1]}</span></div>',
    '<span>Frist: ${p.due}</span><span class="pill ${p.st[0]}">${p.st[1]}</span></div>${p.ag?`<div class="sub">Agent im Paket: ${esc(p.ag)}</div>`:""}')
rep('Aufgaben und Status aus Bodo (Projekt „MIV Hagen Migration“, 10.10.2026); Verantwortliche und Fristen sind Beispielwerte.',
    '${DEMO?"Aufgaben und Status sind Beispieldaten.":"Aufgaben, Status, Bearbeitung und Fälligkeiten aus Bodo (Projekt „MIV Hagen Migration“, Stand "+HAGEN.stand+"); Paketzuschnitt, Paketverantwortliche, Paketfristen und Agenten sind Vorschläge von Company OS."}')
# 4 hagen panels before pkgView (pilot only)
rep('if(p.id==="hagen")return head+pkgView();','if(p.id==="hagen")return head+(DEMO?"":hagenBodo())+pkgView();')
rep('function pkgView(){','''function hagenBodo(){
  const H=HAGEN,lk=(t,u)=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`;
  return `<div class="card"><h2>Verbunden mit Bodo <span class="pill p-ok">echte Daten · Stand ${H.stand}</span></h2>
   <div class="sub">Company OS steuert die Arbeit, Bodo verwaltet Projekt, Aufgaben und Kontakte. Jede Aufgabennummer, jedes Projekt und jeder Kontakt öffnet den echten Datensatz in Bodo Solutions (Anmeldung in Bodo nötig).</div>
   <div class="two"><div class="field"><label>Projekte in Bodo</label><div class="val">${H.proj.map(x=>lk(x[0],x[2])+` <span class="sub">· ${esc(x[1])}</span>`).join("<br>")}</div></div>
    <div class="field"><label>Kunde</label><div class="val">${lk(H.kunde[0]+" ("+H.kunde[1]+")",H.kunde[2])}</div></div>
    <div class="field"><label>Ansprechpartner beim Kunden</label><div class="val">${H.kontakte.map(x=>lk(x[0],x[2])+` <span class="sub">· ${esc(x[1])}</span>`).join("<br>")}</div></div>
    <div class="field"><label>Kundensystem</label><div class="val">Bodo-Organisation „Mieterverein Hagen e.V.“ · <span class="pill p-bad">KI-Zugang deaktiviert</span> <span class="sub">Angabe zur Rechtsberatung fehlt</span></div></div></div></div>
  <div class="card"><h2>So arbeitet Company OS in diesem Projekt</h2><div class="three" style="grid-template-columns:repeat(4,1fr)">
    <div class="conseq"><span class="k">Bodo verwaltet</span><span>Projekt „MIV Hagen Migration“ mit 15 Aufgaben, Bearbeitern und Fälligkeiten – die einzige Stelle, an der gepflegt wird</span></div>
    <div class="conseq"><span class="k">Company OS steuert</span><span>ordnet die Aufgaben in 7 Pakete, zeigt Überfälliges und Lücken, startet Aufträge und eskaliert</span></div>
    <div class="conseq"><span class="k">KI-Agenten erledigen</span><span>Datenübernahme-, Einrichtungs- und Vorlagen-Agent, ◆ Anforderungs-Prozessagent, persönlicher KI-Assistent</span></div>
    <div class="conseq"><span class="k">Menschen entscheiden</span><span>Boris Hose verantwortet das Projekt, Dominik Koppe die Technik; Freigaben und Abnahmen bleiben beim Menschen</span></div></div>
   <div class="sub">Agenten und Paketzuschnitt sind Vorschläge von Company OS; im Pilot wird noch nichts ausgeführt.</div></div>
  <div class="card"><h2>Jetzt wichtig – überfällig laut Bodo <span class="pill p-bad">${H.hot.length}</span></h2><div class="list">${H.hot.map(x=>`<div class="item"><span class="bot">!</span><div class="t"><b><a href="${B+ids[x[0]]}" target="_blank" rel="noopener"><code>${x[0]}</code></a> ${esc(x[1])}</b><div class="sub">Bearbeitung: ${esc(x[2])} · fällig ${x[3]} · ${esc(x[4])}</div><div class="sub">Vorschlag: ${esc(x[5])}</div></div><button class="btn sm" data-toast="Auftrag zu ${x[0]} gestartet – Ergebnis kommt zur Freigabe (Prototyp: nichts ausgeführt)">Auftrag starten</button></div>`).join("")}</div></div>`;
}
function pkgView(){''')
# 5 "In Bodo öffnen" real link for hagen
rep('<button class="btn" data-toast="Öffnet das Projekt in ${p.sys} (Prototyp)">In ${p.sys} öffnen</button>',
    '${p.id==="hagen"&&!DEMO?`<a class="btn" href="${HAGEN.proj[0][2]}" target="_blank" rel="noopener">In Bodo öffnen</a>`:`<button class="btn" data-toast="Öffnet das Projekt in ${p.sys} (Prototyp)">In ${p.sys} öffnen</button>`}')
# 6 assistant answer stand
rep('Stand aus Bodo (10.10.2026): <ul><li>15 Aufgaben: 6 erledigt, 3 in Bearbeitung, 6 offen</li><li>Überfällig: AG-87 Dokumentenmigration, AG-114 Inkasso, AG-183 Nummernkreis</li>',
    'Stand aus Bodo (11.10.2026), Projekt MIV Hagen Migration: <ul><li>15 Aufgaben: 6 erledigt, 3 in Bearbeitung, 6 offen</li><li>Überfällig: AG-114 Inkasso (fällig 17.09., Boris Hose), AG-87 Dokumentenmigration (18.09., Dominik Koppe), AG-183 Nummernkreis (01.10., Dominik Koppe)</li>')
# 7 jobs for hagen (pilot data)
rep('["Anforderung AG-114 bewerten","Prozess Anforderung aufnehmen und bewerten · ◆ Anforderungs-Prozessagent","im Projekt: Einführung Mieterverein Hagen","p-bad","Eskalation"],',
    '["Anforderung AG-114 bewerten","Prozess Anforderung aufnehmen und bewerten · ◆ Anforderungs-Prozessagent","im Projekt: Einführung Mieterverein Hagen","p-bad","Eskalation"],\n     ["AG-87 nachhalten: neue Frist mit Dominik Koppe klären","Einzelaufgabe · Persönlicher KI-Assistent","im Projekt: Einführung Mieterverein Hagen","p-wait","wartet auf Antwort"],\n     ["Entscheidungsvorlage AG-183 Nummernkreis","Einzelaufgabe · Einrichtungs-Agent","im Projekt: Einführung Mieterverein Hagen","p-run","läuft"],')
# 8 linkifier (pilot only) + demo map extra
rep('const DMAP=[\n',' const _x=0;\nconst DMAP=[\n ["AG-183","T-6"],["AG-82","T-5"],\n'.replace(' const _x=0;\n',''))
rep('render();\nsetTimeout(popNote,3500);\n</script>','''function linkBodo(root){if(DEMO||!root)return;const re=/\\b(AG-\\d+|MIV Hagen Migration|Bodo - Einführung bei MIV Hagen|K-0037)\\b/;const W=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{if(!re.test(n.nodeValue))return NodeFilter.FILTER_REJECT;let e=n.parentElement;while(e&&e!==root.parentElement){if(/^(A|BUTTON|TEXTAREA|INPUT|SELECT|OPTION|SCRIPT|STYLE|LABEL)$/.test(e.tagName))return NodeFilter.FILTER_REJECT;e=e.parentElement}return NodeFilter.FILTER_ACCEPT}});const L=[];while(W.nextNode())L.push(W.currentNode);
  const url=t=>{if(/^AG-/.test(t))return ids[t]?B+ids[t]:null;const f=BLINK.find(x=>x[0]===t);return f?f[1]:null};
  L.forEach(n=>{const parts=n.nodeValue.split(new RegExp(re.source,"g"));if(parts.length<2)return;const fr=document.createDocumentFragment();parts.forEach((t,i)=>{const u=i%2?url(t):null;if(u){const a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener";a.textContent=t;a.className="bodolink";a.title="In Bodo öffnen";fr.appendChild(a)}else if(t)fr.appendChild(document.createTextNode(t))});n.parentNode.replaceChild(fr,n)})}
new MutationObserver(ms=>{if(DEMO)return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)linkBodo(n);else if(n.nodeType===3&&n.parentElement)linkBodo(n.parentElement)}))}).observe(document.body,{childList:true,subtree:true});
render();
setTimeout(popNote,3500);
</script>''')
rep('.modebtn{','.bodolink{color:inherit;text-decoration:underline;text-decoration-color:#C8641A;text-underline-offset:2px;font-weight:600}\n.modebtn{')
open(p,'w',encoding='utf-8').write(s);print('ok')
