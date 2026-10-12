/* ---------- Rahmen ---------- */
function nav(){
  $("#meAva").innerHTML=avatar(32);
  $("#companies").innerHTML=Object.entries(CO).map(([k,c])=>`<button data-co="${k}" aria-current="true"><span class="dot" style="background:${c.color}"></span>${esc(c.name)}${WAIT[k]?.length?`<span class="cnt">${WAIT[k].length}</span>`:""}</button>`).join("");
  $("#areas").innerHTML=AREAS.map(([k,i,l])=>`<button data-area="${k}" aria-current="${state.area===k}"><span class="ic">${i}</span>${l}</button>`).join("");
  $("#chatCo").textContent=CO.af.name;
}
function go(o){Object.assign(state,o);state.co="af";render();$("#side").classList.remove("open")}
function render(){
  nav();
  const a=AREAS.find(x=>x[0]===state.area)||["settings","","Einstellungen"];
  $("#meBtn").setAttribute("aria-current",state.area==="settings");
  $("#crumb").textContent=CO.af.name+" · "+CO.af.sys;
  $("#title").textContent=a[2];
  const V={tag:vTag,cockpit:vCockpit,proj:vProjArea,proc:vProc,jobs:vJobs,abgl:vAbgl,settings:vSettings}[state.area];
  $("#view").innerHTML=V();$("#view").scrollTop=0;
}
function avatar(n){return `<span class="ava" role="img" aria-label="${ME.n}" style="display:inline-grid;place-items:center;width:${n}px;height:${n}px;min-width:${n}px;border-radius:50%;background:#2c4a5e;color:#fff;font-weight:700;font-size:${Math.round(n*.38)}px;pointer-events:none">${ME.ini}</span>`}
function hagenBodo(){return ""}function pkgView(){return ""}function cosView(){return ""}

/* ---------- Cockpit ---------- */
function waitCard(w){
  const cls={Freigabe:"p-wait",Rückfrage:"p-run",Eskalation:"p-bad"}[w.k]||"p-open";
  const open=w.mail?`<button class="btn sm" data-job="${w.mail}">Vorgang öffnen</button>`:"";
  const acts=w.k==="Freigabe"?`<button class="btn sm acc" data-toast="${esc(w.toast||"Freigegeben (Prototyp)")}">Freigeben</button>${open}<button class="btn sm" data-toast="Abgelehnt – bleibt bei der bisherigen Version (Prototyp)">Ablehnen</button>`:w.k==="Rückfrage"?`${(w.opt||[]).map(o=>`<button class="btn sm" data-toast="Vertrag ${esc(o)} gewählt – Vorgang läuft weiter, Korrektur als Lernbeispiel gespeichert (Prototyp)">Vertrag ${esc(o)}</button>`).join("")}${open}`:open;
  return `<div class="item"><span class="pill ${cls}">${w.k}</span><div class="t"><b>${esc(w.t)}</b><div class="sub">${esc(w.d)}</div>
  <div class="conseq" style="margin-top:8px">${w.c.map(([k,v])=>`<span class="k">${k}</span><span>${esc(v)}</span>`).join("")}</div>
  <div class="acts" style="margin-top:8px">${acts}</div></div></div>`}
function vCockpit(){
  const k="af";
  return `<div class="stack">
  <div class="card"><h2>Posteingang heute ${EX} ${EXT}</h2><div class="sub">Kennzahlen je Prozess gibt es im generellen Prototyp noch nicht. Für einen Prozess mit vielen Aufträgen am Tag sind sie nötig.</div>
   <div class="kpis"><div class="kpi"><b>214</b><span>Mails seit 7 Uhr</span></div><div class="kpi"><b>198</b><span>automatisch verteilt</span></div><div class="kpi warn"><b>16</b><span>Mensch prüft</span></div><div class="kpi bad"><b>1</b><span>Eskalation</span></div><div class="kpi"><b>4 Min.</b><span>Ø bis zum Arbeitskorb</span></div><div class="kpi"><b>91 %</b><span>richtig im Schattenbetrieb</span></div></div>
   <div class="acts" style="justify-content:flex-start"><button class="btn sm" data-area="jobs">Aufträge</button><button class="btn sm" data-proc="pe" data-area="proc">Prozess</button><button class="btn sm" data-stab="agents">Dokumenttypen</button></div></div>
  <div class="grid">
   <div class="card"><h2>Wartet auf dich</h2><div class="list">${WAIT[k].map(w=>waitCard(w)).join("")}</div></div>
   <div class="card"><h2>Läuft</h2><div class="list">${RUN[k].map(r=>`<div class="item"><div class="t"><b>${esc(r[0])}</b><div class="sub">${esc(r[1])}</div></div><span class="pill ${r[2]}">${r[3]}</span></div>`).join("")}</div></div>
  </div>
  <div class="grid">
   <div class="card"><h2>Projekte</h2><div class="kpis"><div class="kpi"><b>${PROJ[k].length}</b><span>laufend</span></div></div><div class="sub">Einführung ASS · Phase 1 Konzept &amp; Datenaufnahme</div><div class="acts" style="justify-content:flex-start"><button class="btn sm" data-ptabgo="proj">Projekte</button></div></div>
   <div class="card"><h2>Prozesse</h2><div class="kpis"><div class="kpi"><b>${PROC[k].filter(p=>p.st==="aktiv").length}</b><span>aktiv</span></div><div class="kpi"><b>${PROC[k].filter(p=>p.st==="im Test").length}</b><span>im Test</span></div><div class="kpi"><b>${PROC[k].filter(p=>p.st==="Entwurf").length}</b><span>Entwürfe</span></div><div class="kpi warn"><b>${SUG.filter(s=>s.s==="offen").length}</b><span>Vorschläge offen</span></div></div><div class="acts" style="justify-content:flex-start"><button class="btn sm" data-ptabgo="mine">Prozesse</button><button class="btn sm" data-ptabgo="sug">Vorschläge ansehen</button></div></div>
  </div>
  <div class="card"><h2>Abteilungen <button class="btn sm" data-stab="firmen" style="margin-left:auto">Organigramm</button></h2><div class="list">${ORG[k].map(d=>`<div class="item"><div class="ava lead" style="--c:${d.c}">${d.lead[0]}</div><div class="t"><b>${d.n}</b><div class="sub">Leitung ${esc(d.lead[1])} · ${d.ag.length} Agenten · ${d.ppl.length} Mitarbeitende</div></div><span class="pill ${d.al?"p-wait":"p-ok"}">${esc(d.al||d.ok)}</span></div>`).join("")}</div></div></div>`;
}
function vOrg(){
  const on=PSK.filter(x=>x[2]).length;
  return `<div class="stack"><div class="sub">Oben die Leitung Operations, daneben ihr persönlicher KI-Assistent. Darunter jede Abteilung mit Leitung, Vertretung, Mitarbeitenden, Prozessverantwortlichen Agenten und Agenten. Alle Namen sind Beispiele.</div>
  <div class="orgtop"><div></div>
   <div class="card gfbox">${avatar(72)}<div><h2 style="margin:0">${ME.rolle}</h2><div class="sub">${ME.n} · du</div><div class="sub">${ME.dep}</div></div></div>
   <div class="staff"><span class="hl"></span><div class="staffcol">
    <button class="asst" id="asstBtn"><span class="spark">✦</span><span><b>Persönlicher KI-Assistent</b><small>${on} Fähigkeiten</small></span></button>
   </div></div></div>
  <div class="orgline"></div>
  <div class="org orgrow">${ORG.af.map(d=>`<div class="card dept" style="border-top:4px solid ${d.c}">
   <div class="head"><div class="ava lead" style="--c:${d.c}">${d.lead[0]}</div><div><h3>${d.n}</h3><div class="sub">Leitung: ${esc(d.lead[1])}</div><div class="sub">${esc(d.dep)}</div></div></div>
   <div class="sec"><div class="lbl" style="padding:0">Mitarbeitende</div>${d.ppl.map(p=>`<div class="m"><span class="ava s" style="--c:#4b6b8a">${p[0]}</span>${esc(p[1])}</div>`).join("")}</div>
   <div class="sec"><div class="lbl" style="padding:0">Prozessführung</div>${d.pa.map(p=>`<div class="m"><span class="bot lead">◆</span><span><b>${esc(p[0])}</b><small class="sub" style="display:block">${esc(p[1])}</small></span></div>`).join("")}</div>
   <div class="sec"><div class="lbl" style="padding:0">Agenten</div>${d.ag.map(a=>`<div class="m"><span class="bot">◆</span>${esc(a)}</div>`).join("")}</div>
   <div class="conseq"><span class="k">Arbeitskorb in sellify ${UMD}</span><span>Vorgänge aus dem Posteingang landen hier; bearbeitet wird in sellify</span></div>
   <div class="alert ${d.al?"":"ok"}">${esc(d.al||d.ok)}</div></div>`).join("")}</div></div>`;
}

/* ---------- Designer ---------- */
function vDes(){
  const m=state.desMode,st=state.desStage;
  const def=m==="proc"?"Erstelle einen Prozess für den Posteingang: neue Mails lesen, Dokumenttyp erkennen, bei Unsicherheit einen Menschen prüfen lassen, Kontakt und Vertrag in sellify zuordnen und je Dokumenttyp den Folgeprozess starten.":"Lege eine Projektvorlage für die Einführung eines KI-Prozesses an: Konzept und Datenaufnahme, Anbindung, Anlernen mit parallel vorbereiteten Testmengen, Schattenbetrieb und Übernahme.";
  const pal=m==="proc"?["Schritt","Entscheidung","Freigabe","Parallel","Ende"]:["Phase","Meilenstein","Parallel","Prozess zuordnen","Aufgabenpaket"];
  const next=st<2?`<button class="btn pri" data-desstage="2">Prüfen</button>`:st<3?`<button class="btn pri" data-desstage="3">Testlauf im Testsystem</button>`:st<4?`<button class="btn acc" data-desstage="4">Aktivieren</button>`:`<span class="pill p-ok">aktiv · Version 1</span>`;
  return `<div class="card"><h2>${m==="proc"?"Prozess-Designer":"Projekt-Designer"}</h2><div class="sub">${m==="proc"?"Prozesse aus Schritten mit fest eingesetzten Agenten, Entscheidungen und Freigaben.":"Projektvorlagen mit Phasen, Verzweigungen und Meilensteinen; je Phase werden Prozesse zugeordnet."} Der KI-Entwurf ist der Einstieg, danach passt du an.</div>
   <div class="field"><label for="dp">✦ Mit KI entwerfen</label><textarea id="dp" class="ta" rows="2">${esc(state.desPrompt||def)}</textarea></div>
   <div class="acts" style="justify-content:flex-start"><button class="btn pri" data-desstage="1">✦ Entwurf erzeugen</button><button class="btn" ${m==="proc"?'data-ptab="tpl"':'data-pjtab="tpl"'}>Mit Vorlage beginnen</button><span class="sub">Simulation mit Beispieldaten – speichert nichts, legt nichts in sellify an</span></div></div>
  ${st?`<div class="card"><h2>${m==="proc"?"Posteingangsverarbeitung":"Projektvorlage Einführung KI-Prozess"} <span class="pill ${st>=4?"p-ok":"p-run"}">${DSTL[st-1]}</span></h2>
   <div class="skills">${pal.map(x=>`<button class="add" data-toast="Element „${x}“ auf die Fläche ziehen (Prototyp)">+ ${x}</button>`).join("")}</div>
   <div class="canvas">${m==="proc"?flowProc():flowProj()}</div>
   <div class="two">${m==="proc"?desInfoProc():desInfoProj()}</div>
   <div class="acts" style="justify-content:flex-start">${next}</div></div>`:`<div class="card"><div class="sub">Beschreibe oben den Ablauf und lass einen Entwurf erzeugen – oder beginne mit einer Vorlage.</div></div>`}`;
}
function flowProc(){return `<div class="flow"><div class="gwrap"><span class="ev"></span><small>neue E-Mail<br>(Ereignis)</small></div>${LN}${N("Mail lesen","◆ Posteingangs-Agent")}${LN}${N("Dokumenttyp erkennen","◆ Klassifizierungs-Agent<br>Skill posteingang-einordnen")}${LN}<div class="gwrap"><span class="gw"><span>?</span></span><small>sicher genug?<br>nein → Mensch prüft</small></div>${LN}${N("Kontakt & Vertrag zuordnen","◆ Zuordnungs-Agent<br>mehrdeutig → Mensch")}${LN}<div class="gwrap"><span class="gw"><span>×</span></span><small>je Dokumenttyp</small></div>${LN}<div class="parcol">${N("Folgeprozess starten","8 Wege · Übergabeweg je Typ")}${N("Lernbeispiel speichern","bei Korrektur durch einen Menschen")}</div>${LN}<span class="ev end" title="Ende"></span></div>`}
function flowProj(){return `<div class="flow"><span class="ev" title="Start"></span>${LN}${N("1 · Konzept & Datenaufnahme","Dokumenttypen aus sellify übernehmen")}${LN}${MS("Konzept freigegeben","Meilenstein")}${LN}${N("2 · Anbindung","sellify · Postfächer")}${LN}<div class="gwrap"><span class="gw"><span>+</span></span><small>parallel</small></div>${LN}<div class="parcol">${N("3 · Anlernen je Typ","Prozess: Dokumenttyp anlernen")}${N("3b · Testmengen","Beispiele je Typ")}</div>${LN}<div class="gwrap"><span class="gw"><span>+</span></span><small>alle fertig</small></div>${LN}${N("4 · Schattenbetrieb & Übernahme","Typ für Typ")}${LN}${MS("Abnahme","ASS übernimmt")}${LN}<span class="ev end" title="Ende"></span></div>`}
function desInfoProc(){return `<div class="sec2"><h3>Warum diese Agenten</h3><div class="list">
  <div class="item"><span class="bot">◆</span><div class="t"><b>Klassifizierungs-Agent</b><div class="sub">Skill posteingang-einordnen mit einem Profil je Dokumenttyp · Datenstufe 2 · darf nichts anlegen</div></div></div>
  <div class="item"><span class="bot">◆</span><div class="t"><b>Zuordnungs-Agent</b><div class="sub">liest Kontakte und Verträge, legt Aufgaben an · Datenstufe 2</div></div></div>
  <div class="item"><span class="bot lead">◆</span><div class="t"><b>Posteingangs-Prozessagent · prozessverantwortlich</b><div class="sub">entscheidet nach der Schwelle des Dokumenttyps · Ergebnisverantwortlich: Markus Hahn (Vorschlag)</div></div></div></div></div>
  <div class="sec2"><h3>Was der Designer dafür noch braucht ${EXT}</h3><div class="alert">Start durch ein Ereignis („neue E-Mail“) statt von Hand oder aus einem Projekt. Und eine Entscheidung, die einen Wert aus dem vorherigen Schritt (Sicherheit) mit einer Schwelle im Skill-Profil vergleicht.</div><div class="sub">Alles andere – Schritte, Agenten, Mensch-Schritt, Verzweigung je Dokumenttyp, Freigaben – gibt es schon.</div></div>`}
function desInfoProj(){return `<div class="sec2"><h3>Ablauf</h3><div class="sub">Phasen laufen nacheinander. Nach der Anbindung laufen Anlernen und Testmengen parallel. Der Schattenbetrieb startet erst, wenn beide fertig sind.</div></div>
  <div class="sec2"><h3>Meilensteine</h3><div class="sub">Die Abnahme jeder Phase ist ein Meilenstein mit Datum. Meilensteine werden an sellify übergeben. Verwaltet wird das Projekt in sellify, Company OS steuert die Arbeit.</div></div>`}

/* ---------- Aufträge ---------- */
function vJobs(){
  const F=["alle","Mensch prüft","Freigabe","Eskalation","läuft","erledigt"];const f=state.jobF;
  const L=JOBS.af.filter(r=>f==="alle"||r[4]===f);
  const cnt=[["Zahlungsklärung",61],["Vertragsreklamation",38],["Rechnungskopie / Anfrage",34],["Kündigung",27],["Adress- und Stammdaten",22],["Ablöseanfrage",15],["Versicherungsnachweis",9],["Insolvenzmitteilung",1],["unklar",7]];
  return `<div class="stack"><div class="card"><h2>Wie Aufträge entstehen</h2><div class="three" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
    <div class="conseq"><span class="k">intern</span><span>projektübergreifend oder ohne Projekt</span></div>
    <div class="conseq"><span class="k">im Projekt</span><span>von Hand im Projekt ausgelöst, optional mit einem Prozess</span></div>
    <div class="conseq"><span class="k">automatisch</span><span>aus einer Projektvorlage mit Ablauf</span></div>
    <div class="conseq" style="border:1px dashed var(--accent)"><span class="k">durch Ereignis ${EXT}</span><span>jede neue Mail im Postfach startet einen Auftrag im Prozess „Posteingangsverarbeitung“</span></div></div></div>
   <div class="card"><h2>Sammelansicht Posteingang ${EX} ${EXT}</h2><div class="sub">Bei mehreren hundert Aufträgen am Tag reicht die Einzelliste nicht. Vorschlag: Zählung je Dokumenttyp, einzeln angezeigt wird nur, was einen Menschen braucht.</div>
    <div class="terms">${cnt.map(([n,c])=>`<span class="term">${n} <i>${c}</i></span>`).join("")}</div></div>
   <div class="card"><h2>Aufträge</h2><div class="seg" role="group" aria-label="Filter">${F.map(x=>`<button data-jobf="${x}" aria-pressed="${x===f}">${x}</button>`).join("")}</div>
    <div class="list">${L.map(r=>`<div class="item"><div class="t"><b>${esc(r[0])}</b><div class="sub">${esc(r[1])}</div><div class="meta" style="margin-top:4px"><span class="pill p-open">${esc(r[2])}</span></div></div><span class="pill ${r[3]}">${r[4]}</span>${r[5]?`<button class="btn sm" data-job="${r[5]}">Protokoll</button>`:""}</div>`).join("")||'<div class="sub">Keine Aufträge mit diesem Status.</div>'}</div></div>
   <div class="card"><h2>Eskalation</h2><div class="sub">Gilt für jeden Auftrag, der in einem Prozess läuft. Beispiel heute: Insolvenzmitteilung → Stefan Krause abwesend → Vertretung ohne Reaktion → Leitung Operations.</div>${escChain()}</div></div>`;
}
function jobModal(id){
  const m=MAILS.find(x=>x.id===id);const t=T(m.type);const r=cover(m.body,t);const r2=m.also?cover(m.body,T(m.also[0])):{hits:[],pct:0};const s=MST[m.st];
  const low=m.ki<t.thr||t.st!=="aktiv";const unclear=/nicht eindeutig|möglich/.test(m.vertrag+m.kontakt);
  const STP=[
   ["Mail und Anhänge gelesen","◆ Posteingangs-Agent",`Postfach ${m.box} · ${m.tm} Uhr`,"ok"],
   ["Dokumenttyp erkannt","◆ Klassifizierungs-Agent",`${t.n}${m.also?" + "+T(m.also[0]).n:""} · Sicherheit ${m.ki} % · Kennbegriffe ${r.pct} % Deckungsgrad (live berechnet)`,"ok"],
   ["Entscheidung: sicher genug?","◆ Posteingangs-Prozessagent",low||unclear?`nein – ${t.st!=="aktiv"?"Dokumenttyp im Anlernen":m.ki<t.thr?`unter der Schwelle von ${t.thr} %`:"Vertrag nicht eindeutig"}`:`ja – über der Schwelle von ${t.thr} %`,low||unclear?"warn":"ok"],
   ["Mensch prüft","● Team Posteingang",m.st==="pruefen"?"offen – wartet auf Entscheidung":low||unclear?"bestätigt":"übersprungen",m.st==="pruefen"?"now":"skip"],
   ["Kontakt und Vertrag zugeordnet","◆ Zuordnungs-Agent",`${m.kontakt} · Vertrag ${m.vertrag}`,unclear&&m.st==="pruefen"?"warn":"ok"],
   ["Folgeprozess gestartet","◆ Zuordnungs-Agent",m.st==="pruefen"?"noch nicht":`„${t.proc}“ · ${target(t,m)}`,m.st==="pruefen"?"skip":"ok"]];
  const IC={ok:["p-ok","✓"],warn:["p-wait","!"],now:["p-wait","…"],skip:["p-open","–"]};
  $("#modal").innerHTML=`<div class="modal" data-close><div class="card wide" role="dialog" aria-modal="true" aria-label="Auftragsprotokoll">
   <div class="row" style="justify-content:space-between;flex-wrap:wrap"><h2 style="margin:0">${esc(m.subj)}</h2><span class="pill ${s[0]}">${s[1]}</span></div>
   <div class="meta"><span>Auftrag im Prozess „Posteingangsverarbeitung“</span><span>${esc(m.from)}</span>${EX}${EXT}</div>
   <div class="sub">Ein Protokoll je Auftrag mit Ergebnis, Sicherheit und Begründung jedes Schritts fehlt im generellen Prototyp. So könnte es aussehen.</div>
   <div class="split">
    <div class="sec2"><div class="doc">${markText(m.body,r.hits.concat(r2.hits))}</div><span class="sub">Markiert: Kennbegriffe aus dem Skill-Profil, die im Text vorkommen.</span>
     <div class="conseq"><span class="k">Begründung der KI</span>${esc(m.why)}</div></div>
    <div class="list">${STP.map(([n,a,res,k])=>`<div class="item"><span class="pill ${IC[k][0]}" style="min-width:26px;text-align:center">${IC[k][1]}</span><div class="t"><b>${n}</b><div class="sub">${esc(a)}</div><div style="font-size:12.5px">${esc(res)}</div></div></div>`).join("")}</div>
   </div>
   <div class="acts">${m.st==="pruefen"?`<button class="btn pri" data-jok="${m.id}">Bestätigen und weitergeben</button><button class="btn" data-jfix="${m.id}">Anders einordnen</button>`:m.st==="freigabe"?`<button class="btn pri" data-jok="${m.id}">Antwort freigeben</button>`:`<button class="btn" data-jfix="${m.id}">Einordnung korrigieren</button>`}<button class="btn" data-close-btn>Schließen</button></div>
   <div id="jfix"></div></div></div>`;
}

/* ---------- Anschlüsse ---------- */
function vConn(){
  return `<div class="stack"><div class="card"><h2>Anschlüsse</h2><div class="sub">Prozesse nennen nur Grundaufgaben – Kontakt, Aufgabe, Dokument, E-Mail, Übergabe. Hier steht, welches System welche Rolle übernimmt. Einträge sind Beispiele.</div>
   <div class="list">${CONN.af.map(c=>`<div class="item"><div class="conn"><div class="sym" style="background:${c[2]}">${c[1]}</div></div><div class="t"><b>${c[3]} <span class="pill p-open">${c[0]}</span></b><div class="sub">${esc(c[4])}</div><div class="sub">Grundaufgaben: ${esc(c[5])}</div></div>${c[7]==="Erweiterung"?EXT:`<span class="pill ${c[6]}">${c[7]}</span>`}</div>`).join("")}</div>
   <div class="alert">Neue Anschluss-Rolle „Eingangskanal“: Bisher kennt Company OS nur Systeme, in die es schreibt (CRM, Entwicklung, ERP, Bibliothek). Für den Posteingang braucht es eine Quelle, die einen Prozess auslöst. Offen ist, ob die Postfächer direkt angebunden werden oder sellify die Mails wie heute abholt und an Company OS meldet.</div></div>
  <div class="card"><h2>Übergabewege · Verteilung je Dokumenttyp ${UMD}</h2><div class="sub">Übergabewege sind eigentlich für Ziele wie „Entwicklungsauftrag → Ticketsystem“ gedacht. Hier legen sie fest, wohin ein Vorgang in sellify geht: Arbeitskorb oder zuständige Person. Der Prozess sagt nur „Aufgabe anlegen“, das Ziel steht hier.</div>
   <div class="tblw"><table><thead><tr><th>Dokumenttyp</th><th>geht an</th><th>Methode</th><th>Status</th></tr></thead><tbody>${ROUTES.af.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td><span class="pill ${r[3]}">${r[4]}</span></td></tr>`).join("")}</tbody></table></div>
   <div class="sub">Abwesenheit: zuerst die Vertretung aus sellify, sonst der Arbeitskorb des Teams.</div></div>
  <div class="card"><h2>KI-Anbieter</h2><div class="sub">Haupt-KI, weitere Anbieter, Profile und Datenstufen stehen unter „KI &amp; Daten“.</div><div class="acts"><button class="btn" data-stab="ki">Zu KI &amp; Daten</button></div></div></div>`;
}
function vSetup(){
  const s=SETUP[setupStep];
  return `<div class="wiz"><div class="card wsteps">${SETUP.map((x,i)=>`<button data-step="${i}" aria-current="${i===setupStep}" class="${i<setupStep?"done":""}"><span class="num">${i<setupStep?"✓":i+1}</span>${x[0]}</button>`).join("")}</div>
   <div class="card"><div class="sub">Setup der Instanz abcfinance · Beispieldaten · Schritt ${setupStep+1} von ${SETUP.length}</div><h2>${s[0]}</h2>
    ${s[1].map(([l,v])=>`<div class="field"><label>${l}</label><div class="val">${esc(v)}</div></div>`).join("")}
    ${s[0].startsWith("KI-Anbieter")?'<div class="alert ok">Ohne Haupt-KI kann Company OS nicht arbeiten – dieser Schritt ist Pflicht.</div>':""}
    <div class="acts"><button class="btn" data-step="${Math.max(0,setupStep-1)}" ${setupStep?"":"disabled"}>Zurück</button><button class="btn pri" data-step="${Math.min(SETUP.length-1,setupStep+1)}">${setupStep===SETUP.length-1?"Fertig":"Weiter"}</button></div></div></div>`;
}

/* ---------- Einstellungen ---------- */
function vSettings(){
  const t=state.setTab;
  const tabs=`<div class="tabs" role="tablist">${[["profil","Profil"],["tag","Mein Tag"],["firmen","Unternehmen"],["agents","Agenten & Skills"],["lib","Bibliothek"],["setup","Setup"],["conn","Anschlüsse"],["ki","KI & Daten"]].map(([k,l])=>`<button role="tab" aria-selected="${t===k}" data-stab="${k}">${l}</button>`).join("")}</div>`;
  if(t==="firmen")return `<div class="stack">${tabs}<div class="card"><h2>Unternehmen &amp; Organigramm</h2><div class="sub">Die Instanz abcfinance mit eigenem Organigramm, eigenen Prozessen und sellify als System, in dem die Arbeit gespeichert wird.</div>
    <div class="cobadges"><button class="cobadge" aria-pressed="true"><span class="dot" style="background:${CO.af.color}"></span>abcfinance</button></div>
    <div class="meta"><span>System: ${CO.af.sys}</span><span class="pill p-ok">verbunden</span></div></div>${vOrg()}</div>`;
  if(t==="tag")return `<div class="stack">${tabs}<div class="card"><h2>Mein Tag</h2><div class="sub">Persönliche Einstellungen. Werte sind Beispiele.</div>
   <div class="perm"><span><b>Morgenübersicht</b><br><span class="sub">Uhrzeit 7:30</span></span><div class="seg"><button data-opt aria-pressed="true">nur in der App</button><button data-opt aria-pressed="false">E-Mail über sellify</button></div></div>
   <div class="perm"><span><b>Benachrichtigungen</b><br><span class="sub">Eskalationen sofort, sonst gebündelt</span></span><div class="seg"><button data-opt aria-pressed="true">sofort</button><button data-opt aria-pressed="false">gebündelt stündlich</button></div></div>
   <div class="perm"><span><b>Vorgänge aus Prozessen in „Mein Tag“ ${UMD}</b><br><span class="sub">Was auf dich eskaliert oder deine Freigabe braucht, erscheint wie eine KI-Sitzung (Variante B: Vorgänge melden sich selbst)</span></span><span class="pill p-ok">an</span></div></div></div>`;
  if(t==="agents")return `<div class="stack">${tabs}${skillProfiles()}${vAgents()}</div>`;
  if(t==="lib")return `<div class="stack">${tabs}${vLib()}</div>`;
  if(t==="setup")return `<div class="stack">${tabs}${vSetup()}</div>`;
  if(t==="conn")return `<div class="stack">${tabs}${vConn()}</div>`;
  if(t==="ki")return `<div class="stack">${tabs}${vKi()}</div>`;
  const F=[["Name",ME.n],["Rolle",ME.rolle],["Unternehmen","abcfinance"],["Vertretung","Markus Hahn"],["Benachrichtigungen","Eskalationen sofort · sonst stündlich gebündelt"],["Sprache","Deutsch"]];
  return `<div class="stack">${tabs}<div class="card"><div class="prof">${avatar(96)}<div><h2>${ME.n}</h2><div class="sub">${ME.rolle} · Beispielperson</div></div></div></div>
   <div class="card"><h2>Profil &amp; persönliche Einstellungen</h2><div class="two">${F.map(([l,v])=>`<div class="field"><label>${l}</label><div class="val">${esc(v)}</div></div>`).join("")}</div></div></div>`;
}
function skillProfiles(){
  return `<div class="card"><h2>Skill „posteingang-einordnen“ · Kern + ${TYPES.length} Profile ${UMD}</h2>
   <div class="sub">Company OS kennt Skills mit gemeinsamem Kern und Profilen. Hier ist jedes Profil ein Dokumenttyp: Kennbegriffe mit Gewicht aus der heutigen sellify-Verarbeitung, Lernbeispiele aus der Bibliothek, Folgeprozess. Änderungen ergeben eine neue Profil-Version mit Testlauf und Freigabe – wie bei Agenten. Neu ist nur das Feld „Schwelle“ ${EXT}.</div>
   <div class="tblw"><table><thead><tr><th>Profil = Dokumenttyp</th><th>Kennbegriffe</th><th>Lernbeispiele</th><th>Treffsicherheit ${EX}</th><th>Schwelle</th><th>Folgeprozess</th><th>Version</th><th></th></tr></thead><tbody>
   ${TYPES.map(t=>`<tr><td><b>${t.n}</b></td><td>${t.terms.length}</td><td>${t.docs}</td><td style="min-width:150px">${t.rule?meter("Begriffe",t.rule):'<span class="sub">noch keine Regel</span>'}${meter("KI",t.ki,"ki")}</td><td>${t.thr} %</td><td>${esc(t.proc)}</td><td><span class="lv">${t.ver}</span> <span class="pill ${t.st==="aktiv"?"p-ok":"p-wait"}">${t.st}</span></td><td><button class="btn sm" data-prof="${t.id}">Öffnen</button></td></tr>`).join("")}</tbody></table></div>
   <div class="acts" style="justify-content:flex-start"><button class="btn" data-toast="Neuer Dokumenttyp: Name, Lernbeispiele in der Bibliothek ablegen, dann startet der Prozess „Dokumenttyp anlernen und pflegen“ (Prototyp)">+ Dokumenttyp anlernen</button></div></div>`;
}
function profModal(id){
  const t=T(id);const txt=state.ptest||MAILS.find(m=>m.type===id)?.body||"";const res=bestRule(txt);
  $("#modal").innerHTML=`<div class="modal" data-close><div class="card wide" role="dialog" aria-modal="true" aria-label="Profil ${esc(t.n)}">
   <div class="row" style="justify-content:space-between;flex-wrap:wrap"><h2 style="margin:0">Profil · ${t.n}</h2><span><span class="lv">${t.ver}</span> <span class="pill ${t.st==="aktiv"?"p-ok":"p-wait"}">${t.st}</span></span></div>
   <div class="sub">Teil des Skills posteingang-einordnen · Ziel: ${esc(target(t))} · Folgeprozess „${esc(t.proc)}“</div>
   <div class="sec2"><h3>Kennbegriffe mit Gewicht</h3><div class="terms">${t.terms.map(([d,,w])=>`<span class="term">${esc(d)} <i>×${w}</i></span>`).join("")}</div></div>
   <div class="sec2"><h3>Vorschläge aus ${t.docs} Lernbeispielen ${EX}</h3><div class="terms">${t.sug.map(([d,c])=>`<button class="term new" data-toast="„${esc(d)}“ zur Freigabe vorgelegt – wird Teil der nächsten Profil-Version (Prototyp)">+ ${esc(d)} <i>in ${c}</i></button>`).join("")}</div></div>
   <div class="sec2"><h3>Schwelle ${EXT}</h3><div class="rangewrap"><input type="range" id="thr" min="50" max="99" value="${t.thr}" data-thr="${t.id}" aria-label="Schwelle"><b id="thrv" style="width:44px;text-align:right">${t.thr} %</b></div><span class="sub">Darunter prüft ein Mensch. Höher heißt sicherer, aber mehr Handarbeit.</span></div>
   <div class="sec2"><h3>Ausprobieren</h3><textarea class="ta test" id="ptest" aria-label="Testtext">${esc(txt)}</textarea><div class="sec" id="ptestOut">${res.slice(0,4).map(r=>meter(r.t.n.split(" ")[0],r.pct,r.pct<35?"lo":"")).join("")}</div><span class="sub">Berechnet wird der Deckungsgrad nach heutigem Prinzip. Die KI-Einschätzung ist im Prototyp nicht live.</span></div>
   <div class="acts"><button class="btn" data-toast="Testlauf gegen ${t.docs} Lernbeispiele gestartet (Prototyp)">Testlauf</button><button class="btn" data-close-btn>Schließen</button></div></div></div>`;
}
function vStep(){
  const st=["Mail und Anhänge vollständig lesen, Scans per Texterkennung.","Anliegen bestimmen; je Anliegen den passenden Dokumenttyp aus den Profilen wählen.","Kennbegriffe des Profils gegenprüfen und den Deckungsgrad festhalten.",...(assistStage>1?["Weichen KI und Kennbegriffe deutlich voneinander ab, immer an einen Menschen geben."]:[]),"Sicherheit und Begründung im Auftrag festhalten."];
  const draft=assistStage?"Ziel: Jede eingehende Mail einem Dokumenttyp zuordnen, mehrere Anliegen getrennt erkennen.\nVorgehen:\n"+st.map((x,i)=>(i+1)+". "+x).join("\n")+"\nErgebnis: Dokumenttyp(en) mit Sicherheit, Deckungsgrad und Begründung.\nNicht: keine Antwort an den Kunden, keine Änderung in sellify.":"Dokumenttyp erkennen";
  return `<div class="card"><h2>Schritt bearbeiten · Dokumenttyp erkennen</h2><div class="sub">Prozess „Posteingangsverarbeitung“, Schritt 2. Anweisungstext ist ein Beispiel.</div>
   <div class="two"><div class="field"><label>Abteilung</label><div class="val">Posteingang &amp; Auftragssteuerung</div></div><div class="field"><label>Ergebnisverantwortlich</label><div class="val">Markus Hahn</div></div><div class="field"><label>Agent</label><div class="val">◆ Klassifizierungs-Agent</div></div><div class="field"><label>Ersatz-Agent</label><div class="val">– (bei Ausfall: Mensch prüft)</div></div><div class="field"><label>Skill (Methode)</label><div class="val">posteingang-einordnen · Kern + ${TYPES.length} Profile</div></div><div class="field"><label>Ergebnis an die Entscheidung ${EXT}</label><div class="val">Sicherheit je Anliegen, verglichen mit der Schwelle des Profils</div></div></div>
   <div class="field"><label for="ins">Arbeitsanweisung</label><textarea id="ins" class="ta" rows="${assistStage?10:2}">${esc(draft)}</textarea></div>
   <div class="acts" style="justify-content:flex-start"><button class="btn pri" data-assist="1">✦ Anweisung per KI erstellen</button><button class="btn" data-toast="Testlauf gegen die Lernbeispiele gestartet (Prototyp)">Testlauf</button><span class="sub">Fassung ${assistStage?2:1} · frühere Fassungen bleiben erhalten</span></div>
   ${assistStage===1?`<div class="assist"><b>Anweisungs-Assistent (Haupt-KI)</b><div>Ich habe einen Entwurf geschrieben. Eine Rückfrage: Soll bei deutlicher Abweichung zwischen KI und Kennbegriffen immer ein Mensch prüfen?</div><div class="q"><button class="btn sm" data-assist="2">Ja, aufnehmen</button><button class="btn sm" data-toast="Bleibt wie im Entwurf (Prototyp)">Nein</button></div></div>`:assistStage===2?`<div class="assist"><b>Anweisungs-Assistent</b><div>Übernommen. Möchtest du noch etwas ergänzen, z. B. wie mit Anhängen ohne Text umgegangen wird?</div></div>`:""}
   <div class="two"><div class="field"><label>KI-Profil</label><div class="val">Gründlich prüfen (Beispiel)</div></div><div class="field"><label>Datenstufe</label><div class="val"><span class="lock">🔒 2 · personenbezogen – Mails enthalten Kundendaten</span></div></div><div class="field"><label>Bibliothek</label><div class="val">Lernbeispiele je Dokumenttyp</div></div><div class="field"><label>Freigabe</label><div class="val">keine – unter der Schwelle prüft ein Mensch</div></div></div></div>`;
}
function vLib(){
  const L=[["Lernbeispiele","Vertragsreklamationen (600)","sellify · Dokumentarchiv","Profil Vertragsreklamation: Anlernen und Testmenge","freigegeben"],["Lernbeispiele","Zahlungsklärungen (510)","sellify · Dokumentarchiv","Profil Zahlungsklärung","freigegeben"],["Lernbeispiele","Ablöseanfragen (420)","sellify · Dokumentarchiv","Profil Ablöseanfrage","freigegeben"],["Lernbeispiele","Insolvenzmitteilungen (40)","sellify · Dokumentarchiv","Profil Insolvenzmitteilung","im Anlernen"],["Vorlage","Eingangsbestätigung Reklamation","sellify · E-Mail-Vorlage","Vertragsreklamation bearbeiten","aus sellify"],["Vorlage","Kündigungsbestätigung","sellify · Dokumentvorlage","Kündigung bearbeiten","aus sellify"],["Vorlage","Ablöseangebot","sellify · Dokumentvorlage","Ablöseanfrage beantworten","aus sellify"],["Vorlage","Antwort Rechnungskopie","sellify · E-Mail-Vorlage","Rechnungskopie senden","aus sellify"]];
  return `<div class="stack"><div class="card"><h2>Bibliothek</h2><div class="sub">Material wird unverändert versendet, Vorlagen werden befüllt. Neu für den Posteingang: die Art „Lernbeispiele“ ${UMD} – Beispieldokumente je Dokumenttyp, aus denen angelernt und gegen die getestet wird. Sie werden nie versendet. Einträge sind Beispiele.</div>
   <div class="tblw"><table><thead><tr><th>Art</th><th>Name</th><th>Quelle</th><th>Wofür</th><th>Stand</th></tr></thead><tbody>
   ${L.map(r=>`<tr><td><span class="pill ${r[0]==="Vorlage"?"p-wait":"p-open"}">${r[0]}</span></td><td><b>${r[1]}</b></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table></div></div></div>`;
}

/* ---------- ASS-Abgleich ---------- */
function vAbgl(){
  const B={v:["p-ok","vorhanden"],u:["p-run","Umdeutung"],e:["p-wait","Erweiterung"],s:["p-open","bleibt in sellify"]};
  const R=[
   ["Postfächer überwachen","Anschluss-Rolle „Eingangskanal“ + Prozess-Start durch Ereignis","e","Bisher starten Aufträge von Hand, im Projekt oder aus einer Projektvorlage.",'data-stab="conn"'],
   ["Mail und Anhänge lesen","Posteingangs-Agent mit Skill postfach-lesen","v","Skill ist neu zu schreiben, der Baustein Agent + Skill passt.",'data-stab="agents"'],
   ["Dokumenttypen mit Kennbegriffen","Skill posteingang-einordnen: Kern + ein Profil je Dokumenttyp","u","Passt zur bestehenden Skill-Architektur „Kern + Profile“.",'data-stab="agents"'],
   ["500–600 Beispieldokumente je Typ","Bibliothek, Art „Lernbeispiele“","u","Bibliothek kennt bisher nur Material und Vorlagen.",'data-stab="lib"'],
   ["Deckungsgrad und Schwelle","Entscheidung im Prozess + Feld „Schwelle“ im Profil","e","Kleine Erweiterung: Entscheidung vergleicht einen Wert mit der Schwelle.",'data-proc="pe" data-area="proc"'],
   ["Mensch prüft unsichere Fälle","Mensch-Schritt, Eskalationskette, „Wartet auf dich“, „Mein Tag“","v","Eskalation auf Vertretung und Leitung gibt es schon.",'data-area="tag"'],
   ["Kontakt und Vertrag zuordnen","Zuordnungs-Agent über den Anschluss sellify","v","",'data-stab="agents"'],
   ["Aufgaben je Dokumenttyp","Folgeprozess je Dokumenttyp (Prozesskette)","v","8 kleine Folgeprozesse statt Aufgabenlisten im Dokumenttyp.",'data-ptabgo="mine"'],
   ["Arbeitskorb oder Person","Übergabewege je Dokumenttyp","u","Übergabewege zeigen sonst auf Systeme, hier auf Körbe und Personen in sellify.",'data-stab="conn"'],
   ["Antworten nur nach Freigabe","Freigabe bei Außenwirkung, Pflicht-Freigabe je Skill","v","",'data-area="cockpit"'],
   ["Lernen aus Korrekturen, neue Begriffe","Prozess „Dokumenttyp anlernen und pflegen“, Profil-Versionen mit Testlauf und Freigabe","u","Versionierung mit Testlauf gibt es für Agenten, hier für Skill-Profile.",'data-proc="anl" data-area="proc"'],
   ["Jede Mail nachvollziehbar","Auftragsprotokoll mit Ergebnis, Sicherheit und Begründung je Schritt","e","Nützlich für jeden Prozess, nicht nur den Posteingang.",'data-job="4"'],
   ["Mehrere hundert Mails am Tag","Sammelansicht in „Aufträge“, Kennzahlen je Prozess im Cockpit","e","Die heutigen Listen sind für wenige Aufträge gebaut.",'data-area="jobs"'],
   ["Schattenbetrieb vor der Übernahme","Status „im Test“ + Testlauf; Vergleich mit der alten Regel","u","Der Vergleich beider Ergebnisse ist Teil der Erweiterung Kennzahlen.",'data-ptabgo="proj"'],
   ["Sachbearbeitung im Arbeitskorb","sellify","s","Grundsatz: sellify verwaltet, Company OS steuert. Kein eigener Arbeitskorb in Company OS.",'data-stab="firmen"']];
  const n=k=>R.filter(r=>r[2]===k).length;
  return `<div class="stack">
  <div class="card"><h2>Lässt sich ASS mit Company OS abbilden?</h2><div class="sub">Gegenüberstellung der Anforderungen an ASS mit den Bausteinen des generellen Prototyps. Die Bewertung ist eine Einschätzung von business//acts für das Konzept, keine Prüfung am fertigen System.</div>
   <div class="kpis"><div class="kpi"><b>${n("v")}</b><span>vorhanden</span></div><div class="kpi"><b>${n("u")}</b><span>mit Umdeutung</span></div><div class="kpi warn"><b>${n("e")}</b><span>Erweiterung nötig</span></div><div class="kpi"><b>${n("s")}</b><span>bleibt in sellify</span></div></div>
   <div class="conseq"><span class="k">Einschätzung</span><span>Es geht ohne eigenes Modul. Nötig sind vier Erweiterungen, die alle allgemein nützlich sind: Start durch Ereignis mit Anschluss-Rolle „Eingangskanal“, Schwelle in der Entscheidung, Auftragsprotokoll, Sammelansicht mit Kennzahlen.</span></div></div>
  <div class="card"><div class="tblw"><table><thead><tr><th>Anforderung ASS</th><th>Baustein in Company OS</th><th>Bewertung</th><th>Hinweis</th><th></th></tr></thead><tbody>
   ${R.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td><span class="pill ${B[r[2]][0]}">${B[r[2]][1]}</span></td><td class="sub">${esc(r[3])}</td><td><button class="btn sm" ${r[4]}>Ansehen</button></td></tr>`).join("")}</tbody></table></div></div>
  <div class="card"><h2>Was im Prototyp simuliert ist</h2><div class="sub">Sicherheit und Begründung der KI sind feste Beispielwerte. Live berechnet wird nur der Deckungsgrad der Kennbegriffe (Profil öffnen → Ausprobieren). Alle Namen, Mails und Zahlen sind erfunden.</div></div></div>`;
}

/* ---------- Chat & Neuer Auftrag ---------- */
function chatOpen(v){$("#chat").hidden=!v;$("#chatBtn").hidden=v;if(v&&!$("#msgs").innerHTML)ai(`Hallo ${ME.n.split(" ")[0]}. Ich kenne Organigramm, Prozesse und Aufträge von abcfinance und arbeite über den Anschluss an sellify – mit euren Freigaberegeln.`);$("#chips").innerHTML=Object.keys(SCRIPT).map(k=>`<button data-ask="${esc(k)}">${esc(k)}</button>`).join("")}
function newJob(){
  $("#modal").innerHTML=`<div class="modal" data-close><div class="card" role="dialog" aria-modal="true" aria-label="Neuer Auftrag"><h2>Neuer Auftrag</h2>
  <div class="field"><label for="jt">Was soll passieren?</label><textarea id="jt" rows="3" style="border:1px solid var(--line);border-radius:9px;padding:8px 10px;background:var(--bg)">Alle offenen Ablöseanfragen dieser Woche auf fehlende Angaben prüfen</textarea></div>
  <div class="sub">Vorschlag des Agenten</div>
  <div class="stack" style="gap:8px">
  <button class="opt" aria-pressed="true" data-opt><div><b>Einzelaufgabe an den Vertrags-Agenten</b><div class="sub">Ergebnis als Liste an Julia Neumann · nichts nach außen</div></div></button>
  <button class="opt" aria-pressed="false" data-opt><div><b>Prozess „Ablöseanfrage beantworten“ ab Schritt 2</b><div class="sub">je Anfrage ein Auftrag · ◆ Vertragsservice-Prozessagent führt</div></div></button></div>
  <div class="acts"><button class="btn" data-close>Abbrechen</button><button class="btn pri" data-start>Auftrag starten</button></div></div></div>`;
}

/* ---------- Zusätzliche Ereignisse (Posteingang) ---------- */
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset;
  if(d.job!==undefined&&+d.job){chatOpen(false);jobModal(+d.job);return}
  if(d.jobf){state.jobF=d.jobf;render();return}
  if(d.prof){state.ptest="";profModal(d.prof);return}
  if(d.jok){const m=MAILS.find(x=>x.id===+d.jok);const was=m.st;m.st=was==="freigabe"?"done":"auto";$("#modal").innerHTML="";render();toast(was==="freigabe"?"Antwort freigegeben – Versand über sellify (Prototyp: nichts ausgeführt)":`Bestätigt – ${target(T(m.type),m)} (Prototyp)`);return}
  if(d.jfix){const m=MAILS.find(x=>x.id===+d.jfix);$("#jfix").innerHTML=`<div class="sec2"><h3>Richtiger Dokumenttyp</h3><div class="sklist" style="max-height:none">${TYPES.map(t=>`<button class="sk" data-jpick="${m.id}|${t.id}" aria-pressed="${t.id===m.type}"><span class="bx">${t.id===m.type?"✓":""}</span><span><b>${t.n}</b><small>${esc(target(t))}</small></span></button>`).join("")}</div></div>`;return}
  if(d.jpick){const [id,ty]=d.jpick.split("|");const m=MAILS.find(x=>x.id===+id);m.type=ty;m.also=null;m.st="auto";$("#modal").innerHTML="";render();toast(`Als ${T(ty).n} weitergegeben · Lernbeispiel für das Profil gespeichert (Prototyp)`);return}
});
document.addEventListener("input",e=>{
  if(e.target.id==="thr"){T(e.target.dataset.thr).thr=+e.target.value;$("#thrv").textContent=e.target.value+" %"}
  if(e.target.id==="ptest"){state.ptest=e.target.value;$("#ptestOut").innerHTML=bestRule(state.ptest).slice(0,4).map(r=>meter(r.t.n.split(" ")[0],r.pct,r.pct<35?"lo":"")).join("")}
});
document.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.proc&&b.dataset.area){state.procSel=b.dataset.proc;state.procView="detail";state.projTab="mine";render()}});
