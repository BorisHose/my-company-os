/* ===== Company OS · allgemeine Fassung v2 (Pilot business//acts + Bodo Solutions) =====
   Ansichten für den Kern. Daten: pilot-alt.js (bisheriger Pilot) + pilot-mcp.js (per MCP gelesen am 12.10.2026).
   Kennzeichnung: echte Bodo-Daten · sellify-Testdaten · Beispieldaten · Einschätzung. */
const MK=()=>K.st.m, ALL=()=>K.st.m==="all", CK=()=>ALL()?["bs","ba"]:[K.st.m];
const ECHT=K.chip("Bodo · echte Daten · Stand "+STAND,"info"), TEST=K.chip("sellify · Testdaten","ex"), BSP=K.chip("Beispieldaten","ex"), EIN=K.chip("Einschätzung","ai"), INTERN=K.chip("nur intern","warn");
const coChip=k=>`<span class="pv-co" style="--c:${CO[k].color}">${esc(CO[k].name)}</span>`;
const ext=(url,t)=>`<a class="k-lnk" href="${url}" target="_blank" rel="noopener">${t} ↗</a>`;
const eur=n=>n?n.toLocaleString("de-DE",{maximumFractionDigits:0})+" €":"–";
const agIdx=n=>AG.findIndex(a=>a.n===n.replace(/^◆ /,""));
const lv=a=>a.sk.reduce((m,k)=>Math.max(m,(SKC[k]||[0,0])[1]),0);
const procChip=p=>K.chip(p.st,{"aktiv":"ok","im Test":"info","Entwurf":""}[p.st]);
const allP=()=>CK().flatMap(k=>PROC[k].map(p=>Object.assign({co:k},p)));
const findP=id=>{for(const k of ["bs","ba"]){const p=PROC[k].find(x=>x.id===id);if(p)return Object.assign({co:k},p)}return null};
/* Bodo „Meine Arbeit“ mit Bezug business//acts – Zuordnung ist Claudes Einschätzung anhand der Titel */
const BA_TAG=["AG-172","AG-221","AG-234","AG-236","AG-288"];
const arbeit=()=>{const k=MK();return k==="ba"?BS_ARBEIT.filter(r=>BA_TAG.includes(r[2])):BS_ARBEIT};
const EIM=[["overdue","Überfällig"],["today","Heute"],["tomorrow","Morgen"],["thisWeek","Diese Woche"]];
const prio=p=>p==="high"?K.chip("hoch","warn"):"";
const stAG=s=>K.chip(s,{"Erledigt":"ok","In Bearbeitung":"info","Offen":"","Backlog":"","Termin":""}[s]??"");
const nr=r=>r[8]?ext(B+r[8],r[2]):r[1]==="termin"?"◷ Termin":"";
const chOpen=()=>BS_CHANCEN.filter(c=>c[7]==="open");
const wait=()=>CK().flatMap(k=>WAIT[k].map(w=>Object.assign({co:k},w)));
const jobs=()=>CK().flatMap(k=>JOBS[k].map(j=>j.concat([k])));
const projOf=()=>CK().flatMap(k=>PROJ[k].map(p=>Object.assign({co:k},p)));
const today=()=>BS_ARBEIT.filter(r=>r[0]==="today");

const V={};
/* ---------- Dashboard ---------- */
V.dashboard=()=>{const k=MK();const ov=arbeit().filter(r=>r[0]==="overdue").length;const W=wait();const sw=SESS.filter(s=>s.l==="wait").length;
 const hagenLate=BS_HAGEN.filter(t=>t[2]!=="Erledigt"&&t[3]).length;
 const att=[];
 if(k!=="ba")att.push({t:"Überfällig in Bodo",k:"Meine Arbeit",n:ov,c:"var(--danger)",d:"Älteste: AG-128 MMV Auftragsdatenverarbeitung (15.09.)",go:K.go("meinearbeit")});
 else att.push({t:"Bodo-Aufgaben mit Bezug business//acts",k:"überfällig",n:ov,c:"var(--danger)",d:"z. B. AG-172 Roadmap sellify für secunet · Zuordnung: Einschätzung",go:K.go("meinearbeit")});
 att.push({t:"Fristen",k:"Nächste Tage",kp:k==="ba"?[[ov,"überfällig"],[0,"morgen"],[arbeit().filter(r=>r[0]==="thisWeek").length,"diese Woche"]]:EIM.slice(1).map(([e,l])=>[BS_ARBEIT.filter(r=>r[0]===e).length,l.toLowerCase()]),c:"#C2650A",d:k==="ba"?"AG-288 AVV Hetzner (14.10.) · AG-236 Thomas Wang (16.10.)":"Heute 10:00 Anforderungsanalyse und GoLive-Absprache",go:K.go("meinearbeit")});
 att.push({t:"Freigaben & Rückfragen",k:"Für dich",n:W.length,c:"var(--brand)",d:W.map(w=>w.t).slice(0,2).join(" · "),go:K.go("meinearbeit","frei")});
 if(k!=="ba")att.push({t:"MIV Hagen Migration",k:"Projekt",kp:[[BS_HAGEN.filter(t=>t[2]==="In Bearbeitung").length,"in Bearbeitung"],[hagenLate,"mit Frist offen"]],c:"#C2650A",d:"AG-114 Inkasso · AG-87 Bitfarm · AG-183 Nummernkreis",go:K.go("projekt","hagen")});
 att.push({t:"KI-Sitzungen",k:"warten auf dich",n:sw,c:"var(--ai)",d:SESS.filter(s=>s.l==="wait").map(s=>s.t).join(" · "),go:K.go("meinearbeit","sess")});
 if(k!=="bs")att.push({t:"Vorschläge",k:"Prozesse",n:SUG.filter(s=>s.s==="offen").length,c:"var(--ai)",d:"z. B. „Angebote nachfassen“",go:K.go("prozesse","sug")});
 const P=allP();const bst=[];
 if(k!=="ba"){const ch=chOpen();bst.push({t:"Verkaufschancen Bodo",n:ch.length,d:`${eur(ch.reduce((s,c)=>s+c[6],0))} jährlich · ${eur(ch.reduce((s,c)=>s+c[5],0))} einmalig`,go:K.go("chancen")});
  bst.push({t:"Projekte in Bodo",n:BS_PROJ.filter(p=>p[2]==="Aktiv").length,d:`aktiv · ${BS_PROJ.reduce((s,p)=>s+p[3],0)} offene Aufgaben`,go:K.go("projekte")})}
 if(k!=="bs"){bst.push({t:"Chancen sellify",n:SF_COUNT.chancenOffen,d:"offen · Testdaten aus dem per MCP erreichbaren sellify",go:K.go("chancen")});
  bst.push({t:"Projekte sellify",n:SF_COUNT.projekteOffen,d:"offen · Testdaten",go:K.go("projekte")})}
 bst.push({t:"Prozesse",n:P.length,d:`${P.filter(p=>p.st==="aktiv").length} aktiv · ${P.filter(p=>p.st==="im Test").length} im Test · ${P.filter(p=>p.st==="Entwurf").length} Entwurf`,go:K.go("prozesse")});
 bst.push({t:"Agenten",n:AG.length,d:`${Object.keys(SKC).length} Skills im Pool`,go:K.go("agenten")});
 bst.push({t:"Abteilungen",n:CK().reduce((s,c)=>s+ORG[c].length,0),d:CK().map(c=>CO[c].name+" "+ORG[c].length).join(" · "),go:K.go("organigramm")});
 if(k!=="ba")bst.push({t:"Kontakte in Bodo",kp:[[BS_COUNT.organisationen,"Organisationen"],[BS_COUNT.personen,"Personen"]],d:"Organisation „Bodo Solutions“",go:K.go("anschluesse")});
 return K.dash({hello:"Guten Tag, <em>Boris</em>",sub:`Montag, 12. Oktober 2026 · ${ALL()?"Überblick über beide Unternehmen":esc(CO[k].name)}`,stand:"Bodo per MCP gelesen am "+STAND,groups:[
  {t:"BRAUCHT AUFMERKSAMKEIT",s:"Was heute hakt · Klick öffnet den Bereich",tiles:att},{t:"BESTAND",s:"Wie viel wovon da ist",tiles:bst}]})+
  `<div class="k-note">Kennzeichnung: Zahlen aus Bodo sind echt (Stand ${STAND}, nur intern). sellify-Zahlen stammen aus dem per MCP erreichbaren System – nach Claudes Einschätzung Test- und Demodaten. Prozesse, Agenten und Aufträge sind Beispieldaten aus dem bisherigen Prototyp.</div>`};

/* ---------- Meine Arbeit ---------- */
V.meinearbeit=id=>{if(id){K.st.tab.meinearbeit=id;K.st.id=null}const k=MK();const A=arbeit();const W=wait();
 const T=EIM.map(([e,l])=>[e,l,A.filter(r=>r[0]===e).length]).concat([["frei","Freigaben",W.length],["sess","KI-Sitzungen",SESS.length]]).concat(k!=="bs"?[["sf","sellify",SF_AUFG.length]]:[]);
 const cur=K.tab("meinearbeit","overdue");let body;
 if(cur==="frei")body=`<div class="k-card"><div class="k-lh"><b>${W.length} Freigaben und Rückfragen</b>${BSP}</div>${W.map((w,i)=>`<div class="pv-wait"><div class="abc-row">${K.chip(esc(w.k),w.k==="Freigabe"?"warn":"info")}${ALL()?coChip(w.co):""}<b>${esc(w.t)}</b></div><div class="k-lbl">${esc(w.d)}</div>${K.kv(w.c.map(([a,b])=>[esc(a),esc(b)]))}<div class="abc-row">${w.k==="Freigabe"?K.btn("Freigeben",`data-toast="Freigegeben – der Agent legt die Datensätze an (Prototyp, nichts wird ausgeführt)"`,true,true)+K.btn("Ablehnen",'data-toast="Abgelehnt (Prototyp)"',false,true):K.btn("Beantworten",'data-toast="Antwort an den Agenten (Prototyp)"',true,true)}</div></div>`).join("")||'<div class="k-sb k-note">Nichts offen.</div>'}</div>`;
 else if(cur==="sess"){const L=[["wait","wartet"],["check","zu prüfen"],["run","läuft"],["rest","ruht"]];body=`<div class="k-card"><div class="k-lh"><b>${SESS.length} KI-Sitzungen</b>${BSP}<span class="k-note">aus Cowork, Claude Code, Handy und geplanten Aufgaben</span></div>${K.table(["Quelle","Sitzung","Stand","Jetzt tun","Status"],SESS.map(s=>[`<span class="k-lbl">${SRC[s.src][0]} ${SRC[s.src][1]}<br>${s.ago}</span>`,`<span class="nm">${esc(s.t)}</span><br><span class="k-lbl">${esc(s.as||"Zuordnung offen")}</span>`,esc(s.st),`<b>${esc(s.nx)}</b>`,K.chip(L.find(x=>x[0]===s.l)[1],s.l==="wait"?"warn":s.l==="check"?"info":"")]))}</div>`}
 else if(cur==="sf")body=`<div class="k-card"><div class="k-lh"><b>${SF_AUFG.length} von ${SF_COUNT.aufgabenMeine} Aufgaben in sellify</b>${TEST}</div>${K.table(["fällig","Aufgabe","Organisation","Stand"],SF_AUFG.map(r=>[r[0],`<b>${esc(r[1])}</b>`,esc(r[2]),r[3]?K.chip("überfällig","warn"):K.chip("offen")]))}<div class="k-pg"><span>Testdaten aus dem per MCP erreichbaren sellify</span><span>Echtes business//acts-sellify: Anbindung offen</span></div></div>`;
 else{const R=A.filter(r=>r[0]===cur);body=`<div class="k-card"><div class="k-lh"><b>${R.length} ${esc(EIM.find(e=>e[0]===cur)[1])}</b>${ECHT}${k==="ba"?EIN:""}</div>${K.table(["Nr.","Titel","fällig","Bezug","Status",""],R.map(r=>[nr(r),`<span class="nm">${esc(r[3])}</span>`,esc(r[4]),esc(r[5]),stAG(r[6]),prio(r[7])]),{empty:"Nichts in diesem Eimer."})}<div class="k-pg"><span>Boris Hose · Bodo „Meine Arbeit“${k==="ba"?" · gefiltert auf Bezug business//acts (Einschätzung nach Titel)":""}</span><span>${cur==="overdue"&&k!=="ba"?`Bodo zählt ${BS_EIMER.overdue} überfällige Einträge, ${R.length} sind im Prototyp übernommen · `:""}Nr. öffnet die Aufgabe in Bodo</span></div></div>`}
 return K.pageHead("Meine Arbeit",{chips:[k==="ba"?TEST:ECHT,INTERN],actions:K.btn("✦ Tagesbriefing",'data-ask="Was ist heute wichtig?"')})+K.tabs("meinearbeit",T)+body};

/* ---------- Chancen ---------- */
V.chancen=()=>{const k=MK();const out=[];
 if(k!=="ba"){const ph=["Alle","Anbahnung","Testphase","Angebot","verloren"];const cur=K.tab("chancen","Alle");const R=BS_CHANCEN.filter(c=>cur==="Alle"||(cur==="verloren"?c[7]==="lost":c[3]===cur&&c[7]==="open"));
  out.push(K.tabs("chancen",ph.map(p=>[p,p,p==="Alle"?BS_CHANCEN.length:p==="verloren"?BS_CHANCEN.filter(c=>c[7]==="lost").length:BS_CHANCEN.filter(c=>c[3]===p&&c[7]==="open").length]))+
  `<div class="k-card"><div class="k-lh"><b>${R.length} Chancen Bodo Solutions</b>${ECHT}<span class="k-sp"></span><span class="k-lbl">offen: ${eur(chOpen().reduce((s,c)=>s+c[6],0))} jährlich · gewichtet ${eur(chOpen().reduce((s,c)=>s+(c[5]+c[6])*c[4]/100,0))}</span></div>${K.table(["Nr.","Chance","Organisation","Phase","Wahrsch.","einmalig","jährlich"],R.map(c=>[`<span class="k-lbl pv-n">${c[0]}</span>`,`<span class="nm">${esc(c[1])}</span>`,esc(c[2]),K.chip(c[7]==="lost"?"verloren":c[3],c[3]==="Angebot"?"ok":c[3]==="Testphase"?"info":c[7]==="lost"?"bad":""),c[4]+" %",`<span class="pv-n">${eur(c[5])}</span>`,`<span class="pv-n">${eur(c[6])}</span>`]),{rowGo:i=>K.go("chance",R[i][0])})}</div>`)}
 if(k!=="bs")out.push(`<div class="k-card"><div class="k-lh"><b>${SF_CHANCEN.length} von ${SF_COUNT.chancenOffen} offenen Chancen in sellify</b>${TEST}</div>${K.table(["Nr.","Chance","Organisation","Phase","einmalig"],SF_CHANCEN.map(c=>[`<span class="k-lbl">${c[0]}</span>`,`<b>${esc(c[1])}</b>`,esc(c[2]),K.chip(esc(c[3])),`<span class="pv-n">${eur(c[5])}</span>`]))}<div class="k-pg"><span>Test- und Demodaten (Einschätzung)</span><span>Echte business//acts-Chancen: Anbindung offen</span></div></div>`);
 return K.pageHead("Chancen",{chips:[k==="ba"?TEST:ECHT,INTERN],actions:K.btn("＋ Chance",'data-toast="Chance anlegen – Entwurf zur Freigabe, nichts wird in Bodo geschrieben (Prototyp)"',true)})+out.join("")};
V.chance=id=>{const c=BS_CHANCEN.find(x=>x[0]===id)||BS_CHANCEN[0];const T=BS_ARBEIT.filter(r=>c[2].split(" ")[0].length>3&&(r[3]+r[5]).includes(c[2].split(" ")[0]));
 return K.detail({title:esc(c[1]),num:c[0],chips:[K.chip("◇ Chance"),K.chip(c[7]==="lost"?"verloren":c[3],c[7]==="lost"?"bad":"info"),ECHT],actions:K.btn("In Bodo öffnen",'data-toast="Öffnet die Chance in Bodo (Link-Pfad im Prototyp noch nicht geprüft)"')+" "+K.btn("✦ Nachfassen vorbereiten",'data-toast="Der Vertriebsassistent entwirft eine Nachfass-Mail – Versand nur nach Freigabe (Prototyp)"',true),
  cards:[{t:"Steckbrief",b:K.kv([["Organisation",esc(c[2])],["Phase",esc(c[3])],["Wahrscheinlichkeit",c[4]+" %"]])},{t:"Wert",b:K.kv([["einmalig",eur(c[5])],["jährlich",eur(c[6])],["gewichtet",eur((c[5]+c[6])*c[4]/100)]])},{t:"Prozess",b:K.agent("Vertriebs-Prozessagent","führt: Vertrieb · Lead bis Abschluss")+`<span class="k-lbl">Zuordnung zum Prozess ist Beispiel</span>`}],
  sections:[{id:"auf",t:"☑ Aufgaben in Bodo",n:T.length,hide:!T.length,flush:true,b:K.table(["Nr.","Titel","fällig","Status"],T.map(r=>[nr(r),esc(r[3]),esc(r[4]),stAG(r[6])]))},
   {id:"nx",t:"✦ Nächster Schritt",a:EIN,b:`<div class="k-note">${c[3]==="Anbahnung"?"Erstkontakt nachhalten und Demo-Termin anbieten.":c[3]==="Testphase"?"Testphase auswerten, Rückmeldung einholen, Angebot vorbereiten.":"Angebot nachfassen, offene Punkte klären."} Vorschlag des Vertriebsassistenten, nicht aus Bodo.</div>`}],
  empty:["Dokumente","Chronik"].concat(T.length?[]:["Aufgaben in Bodo"])})};

/* ---------- Aufträge ---------- */
V.auftraege=()=>{const J=jobs();const S=["alle","läuft","wartet","Eskalation"];const cur=K.tab("auftraege","alle");const R=J.filter(r=>cur==="alle"||r[4].startsWith(cur==="wartet"?"wartet":cur));
 return K.list({title:"Aufträge",chips:[BSP],actions:K.btn("＋ Neuer Auftrag","data-neu",true),view:"auftraege",tabs:S.map(s=>[s,s==="alle"?"Alle":s,s==="alle"?J.length:J.filter(r=>r[4].startsWith(s)).length]),
  cols:["Auftrag","Prozess · Schritt","Herkunft","Status"].concat(ALL()?["Unternehmen"]:[]),rows:R.map(r=>[`<span class="nm">${esc(r[0])}</span>`,esc(r[1]),K.chip(esc(r[2])),`<span class="pill ${r[3]}">${esc(r[4])}</span>`].concat(ALL()?[coChip(r[5])]:[])),
  rowGo:i=>{const r=R[i];return /Hagen/.test(r[2])?K.go("projekt","hagen"):/Inkasso-Schnittstelle/.test(r[2])?K.go("projekt","dev"):/Company OS/.test(r[2])?K.go("projekt","cos"):/Lead/.test(r[1])?K.go("prozess","lead"):/Angebot/.test(r[1])?K.go("prozess","ang"):/Betrieb/.test(r[1])?K.go("prozess","bt"):""},
  note:"Ein Auftrag ist ein Lauf eines Prozesses oder eine Einzelaufgabe an einen Agenten."})};

/* ---------- Prozesse ---------- */
V.prozesse=id=>{if(id){K.st.tab.prozesse=id;K.st.id=null}const cur=K.tab("prozesse","mine");const P=allP();const agentFor=sk=>AG.find(a=>a.sk.includes(sk));let body;
 if(cur==="tpl"){const L=TPL;body=`<div class="k-card"><div class="k-lh"><b>${L.length} Vorlagen</b>${BSP}</div>${K.table(["Vorlage","Bereich","Ablauf","Abdeckung durch Agenten",""],L.map(t=>{const gaps=t.sk.filter(k=>!agentFor(k));return [`<b>${esc(t.n)}</b>`,esc(t.f),`<span class="k-lbl">${esc(t.d)}</span>`,gaps.length?`<span class="pill p-wait">Lücke: ${gaps.join(", ")}</span>`:'<span class="pill p-ok">Agenten vorhanden</span>',K.btn("Übernehmen",`data-toast="„${esc(t.n)}“ als Entwurf übernommen – aktiv erst nach Testlauf (Prototyp)"`,false,true)]}))}</div>`}
 else if(cur==="sug")body=`<div class="k-card"><div class="k-lh"><b>${SUG.length} Vorschläge</b>${BSP}</div>${K.table(["Vorschlag","Quelle","Warum","Status",""],SUG.map((s,i)=>[`<b>${esc(s.n)}</b>`,esc(s.src),esc(s.why),K.chip(s.s,s.s==="übernommen"?"ok":""),s.s==="offen"?K.btn("Übernehmen",`data-sug="${i}|übernommen"`,true,true)+" "+K.btn("Später",`data-sug="${i}|später"`,false,true):""]))}</div>`;
 else body=`<div class="k-card"><div class="k-lh"><b>${P.length} Prozesse</b></div>${K.table(["Prozess","Abteilung","Schritte","Prozessverantwortlich","Ergebnisverantwortlich","Status","Aufträge"].concat(ALL()?["Unternehmen"]:[]),P.map(p=>[`<span class="nm">${esc(p.n)}</span>`,esc(p.dep),p.steps.length,"✦ "+esc(p.pa),esc(p.er),procChip(p)+` <span class="k-lbl">${p.v}</span>`,`<span class="k-lbl">${esc(p.run)}</span>`].concat(ALL()?[coChip(p.co)]:[])),{rowGo:i=>K.go("prozess",P[i].id)})}</div>`;
 return K.pageHead("Prozesse",{chips:[BSP],actions:K.btn("✦ Neu mit KI-Designer",'data-ask="Entwirf einen Prozess für die Lead-Gewinnung"',true)})+K.tabs("prozesse",[["mine","Prozesse",P.length],["tpl","Vorlagen",TPL.length],["sug","Vorschläge",SUG.filter(s=>s.s==="offen").length]])+body};
V.prozess=id=>{const p=findP(id)||allP()[0];const ags=[...new Set(p.steps.map(s=>s.ag).filter(a=>a!=="–").concat([p.pa]))];const J=JOBS[p.co].filter(r=>r[1].includes(p.n.split(" ·")[0]));const vn=+p.v.slice(1);
 const agL=a=>agIdx(a)>=0?`<button class="k-lnk" ${K.go("agent",agIdx(a))}>✦ ${esc(a)}</button>`:"✦ "+esc(a);
 return K.detail({title:esc(p.n),num:p.v,chips:[K.chip("↝ Prozess"),procChip(p),coChip(p.co),BSP],
  actions:K.btn("Testlauf",'data-toast="Testlauf im Testsystem gestartet (Prototyp)"')+" "+K.btn("Auftrag starten","data-neu")+" "+K.btn("Im Designer öffnen",'data-toast="Prozess-Designer (Prototyp)"',true),
  cards:[{t:"Steckbrief",b:K.kv([["Unternehmen",esc(CO[p.co].name)],["Abteilung",esc(p.dep)],["Schritte",p.steps.length],["Aufträge",esc(p.run)]])},
   {t:"Verantwortung",b:K.agent(p.pa,"führt den Prozess")+K.person(K.ini(p.er),p.er,"ergebnisverantwortlich")},
   {t:"Hinweis",b:`<span class="k-note">${esc(p.note||"Keine offenen Hinweise.")}</span>`}],
  sections:[{id:"ablauf",t:"↝ Ablauf",n:p.steps.length,flush:true,b:K.table(["#","Schritt","Agent oder Mensch","Ersatz","Freigabe / Hinweis"],p.steps.map((s,i)=>[i+1,`<b>${esc(s.n)}</b>`,s.ag==="–"?"● Mensch":agL(s.ag),esc(s.ers||"–"),s.fr?`<span class="pill p-wait">${esc(s.fr)}</span>`:"–"]))},
   {id:"ag",t:"✦ Agenten",n:ags.length,b:ags.map(a=>`<div style="margin:4px 0">${agL(a)}${a===p.pa?' <span class="k-lbl">prozessverantwortlich</span>':""}</div>`).join("")},
   {id:"auf",t:"☰ Aufträge",n:J.length,hide:!J.length,flush:true,b:K.table(["Auftrag","Stand","Status"],J.map(r=>[`<span class="nm">${esc(r[0])}</span>`,esc(r[1]),`<span class="pill ${r[3]}">${esc(r[4])}</span>`]))},
   {id:"ver",t:"◷ Versionen",n:vn,flush:true,b:K.timeline(Array.from({length:vn},(_,i)=>vn-i).map(v=>[v===vn?"ok":"skip","v"+v,v===vn?`<b>Version ${v}</b> · ${esc(p.st)}`:`Version ${v} · abgelöst`,""]))}],
  empty:["Testläufe","Kommentare"].concat(J.length?[]:["Aufträge"])})};

/* ---------- Projekte ---------- */
const BSP_ID={"js7jm4cbk99fwprsngazz7a0ad8bbzjk":"hagen"};
V.projekte=()=>{const k=MK();const cur=K.tab("projekte","cos");const C=projOf();const out=[];
 const tabs=[["cos","Gesteuert in Company OS",C.length]].concat(k!=="ba"?[["bodo","In Bodo",BS_PROJ.length]]:[]).concat(k!=="bs"?[["sf","In sellify",SF_PROJ.length]]:[]);
 const c2=tabs.find(t=>t[0]===cur)?cur:"cos";
 if(c2==="cos")out.push(`<div class="k-card"><div class="k-lh"><b>${C.length} Projekte</b>${BSP}</div>${K.table(["Projekt","Art","Verwaltet in","Projektverantwortlich","Ablauf"].concat(ALL()?["Unternehmen"]:[]),C.map(p=>[`<span class="nm">${esc(p.n)}</span>`,esc(p.kind),esc(p.sys),(p.pv[0]==="KI-Agent"?"✦ ":"")+esc(p.pv[1]),esc(p.flow)].concat(ALL()?[coChip(p.co)]:[])),{rowGo:i=>K.go("projekt",C[i].id)})}</div>`);
 if(c2==="bodo")out.push(`<div class="k-card"><div class="k-lh"><b>${BS_PROJ.length} Projekte in Bodo Solutions</b>${ECHT}</div>${K.table(["Projekt","Status","Aufgaben aktiv / gesamt","Verantwortlich","Beschreibung",""],BS_PROJ.map(p=>[`<span class="nm">${esc(p[1])}</span>`,K.chip(p[2],p[2]==="Aktiv"?"info":"ok"),`${p[3]} / ${p[4]}`,esc(p[5]),`<span class="k-lbl">${esc(p[6])}</span>`,ext(BOU+"projekte/"+p[0],"Bodo")]),{rowGo:i=>BSP_ID[BS_PROJ[i][0]]?K.go("projekt",BSP_ID[BS_PROJ[i][0]]):K.go("projekt","b:"+BS_PROJ[i][0])})}</div>`);
 if(c2==="sf")out.push(`<div class="k-card"><div class="k-lh"><b>${SF_PROJ.length} von ${SF_COUNT.projekteOffen} Projekten in sellify</b>${TEST}</div>${K.table(["Nr.","Projekt","Art","Status"],SF_PROJ.map(p=>[`<span class="k-lbl">${p[0]}</span>`,`<b>${esc(p[1])}</b>`,esc(p[2]),K.chip(esc(p[3]))]))}</div>`);
 return K.pageHead("Projekte",{chips:[INTERN],actions:K.btn("＋ Projekt aus Vorlage",'data-toast="Projektvorlage wählen (Prototyp)"',true)})+K.tabs("projekte",tabs)+out.join("")+`<div class="k-note">Company OS verwaltet Projekte nicht selbst: Projekte, Meilensteine und Aufgaben bleiben im CRM (Bodo bzw. sellify). Company OS zeigt sie an und steuert die Arbeit der Agenten.</div>`};
V.projekt=id=>{
 if(String(id).startsWith("b:")){const p=BS_PROJ.find(x=>x[0]===id.slice(2))||BS_PROJ[0];
  return K.detail({title:esc(p[1]),num:"Projekt in Bodo",chips:[K.chip("▦ Projekt"),K.chip(p[2],"info"),ECHT],actions:`<a class="k-btn p" href="${BOU+"projekte/"+p[0]}" target="_blank" rel="noopener">In Bodo öffnen ↗</a>`,
   cards:[{t:"Steckbrief",b:K.kv([["Status",esc(p[2])],["Beschreibung",esc(p[6]||"–")]])},{t:"Aufgaben",b:K.kv([["aktiv",p[3]],["gesamt",p[4]],["erledigt",p[4]-p[3]]])},{t:"Verantwortlich",b:p[5].split(" · ").map(n=>n==="–"?'<span class="k-lbl">nicht gesetzt</span>':K.person(K.ini(n),n)).join("")}],
   sections:[{id:"st",t:"Steuerung in Company OS",b:`<div class="k-note">Für dieses Projekt ist in Company OS noch keine Steuerung angelegt. Möglich: Projektvorlage zuordnen (Aufgabenpakete oder Phasen), Agenten je Paket einsetzen, Fristen überwachen lassen.</div>`}],empty:["Aufgabenpakete","Phasen","Aufträge"]})}
 if(id==="hagen"){const pk=PKG;const nOpen=BS_HAGEN.filter(t=>t[2]!=="Erledigt").length;const late=BS_HAGEN.filter(t=>t[2]!=="Erledigt"&&t[3]);
  return K.detail({title:"Einführung Mieterverein Hagen",num:"Kunde "+HAGEN.kunde[1],chips:[K.chip("▦ Projekt"),K.chip("Aufgabenpakete"),K.chip("läuft","info",true),ECHT,K.chip("nur Dev-System","warn")],
   actions:`<a class="k-btn" href="${HAGEN.kunde[2]}" target="_blank" rel="noopener">Kunde in Bodo ↗</a> `+K.btn("✦ Stand zusammenfassen",'data-ask="Wie steht MIV Hagen?"',true),
   cards:[{t:"Kunde",b:K.kv([["Organisation",ext(HAGEN.kunde[2],esc(HAGEN.kunde[0]))],...HAGEN.kontakte.map(c=>[esc(c[1]),ext(c[2],esc(c[0]))])])},
    {t:"Projekte in Bodo",b:HAGEN.proj.map(p=>`<div style="margin:3px 0">${ext(p[2],esc(p[0]))}<br><span class="k-lbl">${esc(p[1])}</span></div>`).join("")},
    {t:"Aufgaben in Bodo",b:K.kv([["gesamt",BS_HAGEN.length],["erledigt",BS_HAGEN.length-nOpen],["in Bearbeitung",BS_HAGEN.filter(t=>t[2]==="In Bearbeitung").length],["offen",BS_HAGEN.filter(t=>t[2]==="Offen").length]])}],
   sections:[{id:"hot",t:"! Brennpunkte",n:late.length,a:'<span class="k-lbl">Frist überschritten · Vorschlag je Agent ist Beispiel</span>',flush:true,b:K.table(["Nr.","Aufgabe","fällig","Status","Vorschlag"],late.map(t=>{const h=HAGEN.hot.find(x=>x[0]===t[0]);return [ext(B+t[4],t[0]),`<b>${esc(t[1])}</b>`,t[3],K.chip(t[2]+" · überfällig","bad"),`<span class="k-lbl">${esc(h?h[5]:"–")}</span>`]}))},
    {id:"pk",t:"▦ Aufgabenpakete",n:pk.length,a:BSP,flush:true,b:K.table(["Paket","verantwortlich","Agent","fällig","Stand","Aufgaben"],pk.map(x=>[`<b>${esc(x.n)}</b>`,esc(x.v),"✦ "+esc(x.ag.replace(/^◆ /,"")),esc(x.due),`<span class="pill ${x.st[0]}">${esc(x.st[1])}</span>${x.block?`<br><span class="k-lbl">${esc(x.block)}</span>`:""}`,x.t.length]))},
    {id:"auf",t:"☑ Aufgaben in Bodo",n:BS_HAGEN.length,a:ECHT,flush:true,b:K.table(["Nr.","Aufgabe","Status","fällig"],BS_HAGEN.map(t=>[ext(B+t[4],t[0]),esc(t[1]),stAG(t[2]),esc(t[3]||"–")]))},
    {id:"reg",t:"Regel",b:`<div class="k-note">Beim Mieterverein Hagen arbeiten Agenten nur im Dev-System. Im Produktivsystem wird nichts ausgeführt. Der KI-Zugang im Vereinssystem fehlt noch (Angabe zur Rechtsberatung).</div>`}],
   empty:["Dokumente","Risiken"]})}
 if(id==="dev"){const run=PH.find(x=>x.st==="run");
  return K.detail({title:"Entwicklungsprojekt Inkasso-Schnittstelle",num:"Phasen",chips:[K.chip("▦ Projekt"),K.chip("Phasen"),K.chip("läuft","info",true),BSP],actions:K.btn("Auftrag im Projekt starten","data-neu",true),
   cards:[{t:"Steckbrief",b:K.kv([["Vorlage","Entwicklungsprojekt"],["Ablauf","automatisch aus der Vorlage"],["Verwaltet in","Bodo"]])},{t:"Verantwortung",b:K.agent("Projekt-Agent Entwicklung","projektverantwortlich")+K.person("BH","Boris Hose","Abnahmen")},{t:"Fortschritt",b:K.kv([["Aktuelle Phase",esc(run.n)],["Meilenstein",esc(run.ms[0])+" · "+run.ms[1]]])}],
   sections:[{id:"ph",t:"▦ Phasen",n:PH.length,flush:true,b:K.table(["Phase","Zeitraum","Ergebnisverantwortlich","Ablauf","Status"],PH.map(x=>[`<b>${esc(x.n)}</b>`,`${x.from}–${x.to}`,esc(x.er),x.par?"parallel":"nacheinander",`<span class="pill ${PHS[x.st][0]}">${PHS[x.st][1]}</span>`]))},
    {id:"ms",t:"◆ Meilensteine",n:PH.length,flush:true,b:K.timeline(PH.map(x=>[x.ms[2]?"ok":x.st==="run"?"now":"skip","◆",`<b>${esc(x.ms[0])}</b> · Abnahme durch ${esc(x.er)}`,x.ms[1]]))},
    {id:"pr",t:"↝ Prozesse je Phase",n:PH.reduce((s,x)=>s+x.pr.length,0),flush:true,b:K.table(["Phase","Prozess","Stand"],PH.flatMap(x=>x.pr.map(r=>[esc(x.n),`<b>${esc(r[0])}</b>`,esc(r[1])])))}],
   empty:["Dokumente","Risiken"]})}
 const p=projOf().find(x=>x.id===id)||PROJ.ba[0];
 return K.detail({title:esc(p.n),num:"Aufgabenpakete",chips:[K.chip("▦ Projekt"),K.chip("läuft","info",true),coChip("ba"),BSP],actions:K.btn("Setup ansehen",K.go("setup"),true),
  cards:[{t:"Steckbrief",b:K.kv([["Verwaltet in","sellify"],["Vorlage","–"],["Ablauf","manuell"]])},{t:"Verantwortung",b:K.person("BH","Boris Hose","projektverantwortlich")},{t:"Aufträge",b:K.kv(JOBS.ba.filter(j=>/Company OS/.test(j[2])).map(j=>[esc(j[0]),`<span class="pill ${j[3]}">${j[4]}</span>`]))}],
  sections:[{id:"pk",t:"▦ Setup-Pakete",n:SETUP.length,flush:true,b:K.table(["#","Paket","Inhalt"],SETUP.map((s,i)=>[i+1,`<b>${esc(s[0])}</b>`,`<span class="k-lbl">${esc(s[1].map(x=>x[0]).join(" · "))}</span>`]))}],
  empty:["Dokumente","Risiken","Meilensteine"]})};

/* ---------- Organigramm ---------- */
V.organigramm=()=>K.pageHead("Organigramm",{chips:[BSP],actions:K.btn("＋ Abteilung",'data-toast="Abteilung anlegen – ausblenden statt löschen (Prototyp)"')})+
 `<div class="k-card abc-orgtop"><span class="big">BH</span><div><b style="font-size:16px">Geschäftsführung</b><div class="k-note">Boris Hose · du${ALL()?"":" · "+esc(GF[MK()].dep)}</div></div><span class="k-sp"></span>${K.agent("Persönlicher KI-Assistent",PSK.filter(x=>x[2]).length+" Fähigkeiten")}</div>`+
 CK().map(k=>`${ALL()?`<div class="k-sect">${esc(CO[k].name.toUpperCase())}<span>${ORG[k].length} Abteilungen</span></div>`:""}<div class="k-org">${ORG[k].map((d,i)=>`<button class="k-card k-dep" style="--c:${d.c}" ${K.go("abteilung",k+":"+i)}><b style="font-size:15px">${esc(d.n)}</b>${K.person(d.lead[0],d.lead[1],"Leitung")}<span class="k-lbl">${esc(d.dep)} · ${d.ppl.length} Rollen · ${d.ag.length+d.pa.length} Agenten</span><span class="pill ${d.al?"p-wait":"p-ok"}" style="align-self:flex-start">${esc(d.al||d.ok)}</span></button>`).join("")}</div>`).join("");
V.abteilung=id=>{const [k,i]=String(id||"bs:0").split(":");const d=(ORG[k]||ORG.bs)[+i]||ORG.bs[0];const P=PROC[k].filter(p=>p.dep===d.n);const ags=d.pa.map(x=>x[0]).concat(d.ag);
 return K.detail({title:esc(d.n),num:CO[k].name,chips:[K.chip("⌂ Abteilung"),d.al?K.chip(esc(d.al),"warn",true):K.chip(esc(d.ok),"ok",true),BSP],actions:K.btn("Bearbeiten",'data-toast="Abteilung bearbeiten (Prototyp)"'),
  cards:[{t:"Leitung",b:K.person(d.lead[0],d.lead[1],"Leitung")+`<span class="k-lbl">${esc(d.dep)}</span>`},{t:"Besetzung",b:K.kv([["Rollen",d.ppl.length+1],["Agenten",ags.length],["Prozesse",P.length]])},{t:"Unternehmen",b:coChip(k)}],
  sections:[{id:"ma",t:"● Menschen und Rollen",n:d.ppl.length+1,b:K.person(d.lead[0],d.lead[1],"Leitung")+d.ppl.map(p=>K.person(p[0],p[1])).join("")},
   {id:"ag",t:"✦ Agenten",n:ags.length,b:ags.map(a=>`<div style="margin:4px 0">${agIdx(a)>=0?`<button class="k-lnk" ${K.go("agent",agIdx(a))}>${K.agent(a)}</button>`:K.agent(a)}${d.pa.find(x=>x[0]===a)?`<span class="k-lbl"> ${esc(d.pa.find(x=>x[0]===a)[1])}</span>`:""}</div>`).join("")},
   {id:"pr",t:"↝ Prozesse",n:P.length,hide:!P.length,flush:true,b:K.table(["Prozess","Status","Aufträge"],P.map(p=>[`<span class="nm">${esc(p.n)}</span>`,procChip(p),esc(p.run)]),{rowGo:j=>K.go("prozess",P[j].id)})}],
  empty:["Kennzahlen","Abwesenheiten"].concat(P.length?[]:["Prozesse"])})};

/* ---------- Agenten ---------- */
V.agenten=()=>{const cur=K.tab("agenten","ag");const SK=Object.keys(SKC);
 const body=cur==="sk"?`<div class="k-card"><div class="k-lh"><b>${SK.length} Skills</b></div>${K.table(["Skill","Beschreibung","Datenstufe","Pflicht-Freigabe","genutzt von"],SK.map(k=>[`<b class="pv-mono">${k}</b>`,esc(SKC[k][0]),"Stufe "+SKC[k][1],SKC[k][2]?K.chip("ja","warn"):"–",AG.filter(a=>a.sk.includes(k)).map(a=>esc(a.n)).join(", ")||"–"]))}</div>`
 :`<div class="k-card"><div class="k-lh"><b>${AG.length} Agenten</b><span class="k-note">ein gemeinsamer Pool für beide Unternehmen</span></div>${K.table(["Agent","Abteilung","Aufgabe","Skills","Rolle","Version","Datenstufe"],AG.map(a=>[`<span class="nm">✦ ${esc(a.n)}</span>`,esc(a.d),esc(a.t),a.sk.length,K.chip(a.r,a.r==="Mitarbeiter"?"":"info"),esc(a.ver),"Stufe "+lv(a)]),{rowGo:i=>K.go("agent",i)})}</div>`;
 return K.pageHead("Agenten & Skills",{chips:[BSP],actions:K.btn("＋ Agent",'data-toast="Agent anlegen und Skills zuordnen (Prototyp)"',true)})+K.tabs("agenten",[["ag","Agenten",AG.length],["sk","Skills",SK.length]])+body};
V.agent=id=>{const a=AG[+id]||AG[0];const R=[["lesen","Daten im CRM lesen"],["anlegen","Datensätze anlegen und ändern"],["mail","E-Mails versenden"]];const P=allP().filter(p=>a.inn.includes(p.n));
 return K.detail({title:"✦ "+esc(a.n),num:a.ver,chips:[K.chip("Agent"),K.chip(a.r,a.r==="Mitarbeiter"?"":"info"),K.chip("Datenstufe "+lv(a),lv(a)>1?"warn":""),BSP],actions:K.btn("Testlauf",'data-toast="Testlauf im Testsystem gestartet (Prototyp)"')+" "+K.btn("Bearbeiten",'data-toast="Skills und Rechte bearbeiten – neue Version mit Testlauf (Prototyp)"',true),
  cards:[{t:"Steckbrief",b:K.kv([["Abteilung",esc(a.d)],["Aufgabe",esc(a.t)],["KI-Profil",esc(a.prof)]])},{t:"Zuständig",b:K.person(K.ini(a.resp),a.resp.replace(/ \(.*\)/,""),"Mensch")},{t:"Rechte",b:K.kv(R.map(([k,l])=>[l,a.p[k]?K.chip("erlaubt","ok"):K.chip("nicht erlaubt")]).concat([["Löschen",K.chip("nie","bad")]]))}],
  sections:[{id:"sk",t:"Skills",n:a.sk.length,flush:true,b:K.table(["Skill","Beschreibung","Datenstufe","Pflicht-Freigabe"],a.sk.map(k=>[`<b class="pv-mono">${k}</b>`,esc((SKC[k]||["–"])[0]),"Stufe "+(SKC[k]||[0,0])[1],(SKC[k]||[])[2]?K.chip("ja","warn"):"–"]))},
   {id:"in",t:"↝ Eingesetzt in",n:a.inn.length,hide:!a.inn.length,flush:true,b:K.table(["Prozess oder Projekt","Unternehmen"],a.inn.map(n=>{const p=P.find(x=>x.n===n)||allP().find(x=>x.n===n);return [`<span class="nm">${esc(n)}</span>`,p?coChip(p.co):"–"]}),{rowGo:i=>{const p=findPByName(a.inn[i]);return p?K.go("prozess",p.id):""}})}],
  empty:["Testläufe","Kommentare"].concat(a.inn.length?[]:["Eingesetzt in"])})};
const findPByName=n=>{for(const k of ["bs","ba"]){const p=PROC[k].find(x=>x.n===n);if(p)return p}return null};

/* ---------- Bibliothek, Anschlüsse, KI, Setup, Profil ---------- */
const LIB=[["Material","Bodo Produktinformation","OneDrive · Vertrieb/Material","Vertrieb Bodo","bs"],["Material","sellify Produktinformation","OneDrive · Vertrieb/Material","Vertrieb sellify","ba"],["Vorlage","Angebot im Bodo-Stil","Bodo · Dokumentvorlage","Angebot erstellen","bs"],["Vorlage","Datenschutzvereinbarung (AVV)","OneDrive · Recht","Einführung, Datenimport","bs"],["Vorlage","Angebot sellify","sellify · Dokumentvorlage","Angebot erstellen","ba"],["Vorlage","Nachfass-Mail","Bodo · E-Mail-Vorlage","Vertrieb · Lead bis Abschluss","bs"],["Wissen","Branchenpaket Mieterverein","Company OS","Vorlagen, Agenten, Organigramm","bs"]];
V.bibliothek=()=>{const R=LIB.filter(r=>CK().includes(r[4]));
 return K.list({title:"Bibliothek",chips:[BSP],cols:["Art","Name","Quelle","Wofür"].concat(ALL()?["Unternehmen"]:[]),rows:R.map(r=>[`<span class="pill ${r[0]==="Vorlage"?"p-wait":"p-open"}">${r[0]}</span>`,`<b>${esc(r[1])}</b>`,esc(r[2]),esc(r[3])].concat(ALL()?[coChip(r[4])]:[])),note:"Vorlagen kommen aus dem CRM, Material aus dem Cloud-Ordner"})};
V.anschluesse=()=>K.detail({title:"Anschlüsse",chips:[K.chip("⇄ Einrichtung"),BSP],
 cards:CK().map(k=>({t:CO[k].name,b:K.kv([["System",esc(CO[k].sys)],["per MCP",k==="bs"?K.chip("verbunden · echte Daten","ok"):K.chip("verbunden · nur Testsystem","warn")],["Stand",k==="bs"?`${BS_COUNT.organisationen} Organisationen · ${BS_COUNT.personen} Personen · ${BS_COUNT.benutzer} Benutzer`:"Echtes business//acts-sellify: offen"]])})),
 sections:[{id:"an",t:"Anschlüsse",n:CK().reduce((s,k)=>s+CONN[k].length,0),flush:true,b:K.table(["System","Rolle","Was","Grundaufgaben","Status"].concat(ALL()?["Unternehmen"]:[]),CK().flatMap(k=>CONN[k].map(c=>[`<b>${esc(c[3])}</b>`,K.chip(c[0]),esc(c[4]),esc(c[5]),`<span class="pill ${c[6]}">${c[7]}</span>`].concat(ALL()?[coChip(k)]:[]))))},
  {id:"ue",t:"Übergabewege",n:CK().reduce((s,k)=>s+ROUTES[k].length,0),flush:true,b:K.table(["Was","geht an","Methode","Status"].concat(ALL()?["Unternehmen"]:[]),CK().flatMap(k=>ROUTES[k].map(r=>[`<b>${esc(r[0])}</b>`,esc(r[1]),esc(r[2]),`<span class="pill ${r[3]}">${esc(r[4])}</span>`].concat(ALL()?[coChip(k)]:[]))))}]});
V.ki=()=>K.detail({title:"KI & Daten",chips:[K.chip("⚙ Einrichtung"),BSP],
 sections:[{id:"haupt",t:"Haupt-KI",b:K.kv([["Haupt-KI","Claude – nur von business//acts freigegebene Anbieter wählbar"],["Weitere Anbieter","nur mit bestätigter AVV"],["Ausfall","Aufträge pausieren, kein automatischer Wechsel"]])},
  {id:"stufen",t:"Datenstufen",n:3,b:K.kv([["0","ohne Personendaten"],["1","pseudonymisiert"],["2","personenbezogen – nur mit AVV und passendem Datenstandort"]])},
  {id:"regeln",t:"Harte Regeln",b:K.kv([["Agenten dürfen nie","Rechtsberatung erteilen · Geld bewegen · löschen"],["Außenwirkung","Senden und Schreiben nach außen nur nach Freigabe"],["Mieterverein Hagen","nur Dev-System, nie Produktivsystem"]])}]});
V.setup=()=>K.detail({title:"Setup einer Kundeninstanz",num:"Beispiel Mieterverein Hagen",chips:[K.chip("☑ Einrichtung"),BSP],actions:K.btn("Verbindungstest",'data-toast="Verbindungstest (Prototyp)"',true),
 sections:SETUP.map((s,i)=>({id:"s"+i,t:`${i+1} · ${esc(s[0])}`,b:K.kv(s[1].map(([l,v])=>[esc(l),esc(v)]))}))});
V.profil=()=>K.detail({title:"Boris Hose",num:"Geschäftsführung",chips:[K.chip("du")],cards:[{t:"Unternehmen",b:coChip("bs")+" "+coChip("ba")},{t:"Benachrichtigungen",b:K.kv([["Eskalationen","sofort"],["Sonst","stündlich gebündelt"],["Ruhezeit","20–7 Uhr"]])},{t:"Persönlicher KI-Assistent",b:PSK.filter(x=>x[2]).map(x=>K.agent(x[0])).join("")}],sections:[{id:"ein",t:"Einstellungen",b:'<div class="k-note">Morgenübersicht 7:30 in der App · Tagesabschluss 18:00.</div>'}]});

/* ---------- KI-Assistent (vorbereitete Antworten aus den Daten) ---------- */
const KI={
 "Was ist heute wichtig?":()=>{const A=arbeit();return `Aus Bodo (Stand ${STAND}):<ul><li>Heute: ${today().map(r=>esc(r[3])+" "+r[4].split(" ")[1]).join(", ")||"keine Termine"}</li><li>Überfällig: ${A.filter(r=>r[0]==="overdue").length}, davon mit hoher Priorität ${A.filter(r=>r[0]==="overdue"&&r[7]==="high").length} – z. B. ${A.filter(r=>r[0]==="overdue"&&r[7]==="high").slice(0,3).map(r=>r[2]+" "+esc(r[3])).join("; ")}</li><li>Freigaben und Rückfragen: ${wait().length}</li></ul><span class="k-lbl">Reihenfolge der Vorschläge ist meine Einschätzung.</span><br><button class="btn acc" data-go="meinearbeit">Zu „Meine Arbeit“</button>`},
 "Wie steht MIV Hagen?":()=>{const L=BS_HAGEN.filter(t=>t[2]!=="Erledigt"&&t[3]);return `Projekt MIV Hagen Migration in Bodo (Stand ${STAND}): ${BS_HAGEN.length} Aufgaben, ${BS_HAGEN.filter(t=>t[2]==="Erledigt").length} erledigt, ${BS_HAGEN.filter(t=>t[2]==="In Bearbeitung").length} in Bearbeitung, ${BS_HAGEN.filter(t=>t[2]==="Offen").length} offen.<ul>${L.map(t=>`<li>${t[0]} ${esc(t[1])} – fällig ${t[3]}</li>`).join("")}</ul>Blocker: KI-Zugang im Vereinssystem fehlt. Gearbeitet wird nur im Dev-System.<br><button class="btn acc" data-go="projekt|hagen">Projekt öffnen</button>`},
 "Welche Chancen sind am wertvollsten?":()=>{const C=chOpen().slice().sort((a,b)=>(b[5]+b[6])*b[4]-(a[5]+a[6])*a[4]).slice(0,4);return `Offene Chancen Bodo Solutions, sortiert nach gewichtetem Wert (Wert × Wahrscheinlichkeit):<ul>${C.map(c=>`<li>${esc(c[1])} – ${c[3]}, ${c[4]} %, gewichtet ${eur((c[5]+c[6])*c[4]/100)}</li>`).join("")}</ul><span class="k-lbl">Gewichtung ist eine einfache Rechnung, keine Prognose.</span><br><button class="btn acc" data-go="chancen">Chancen öffnen</button>`},
 "Was hängt an business//acts?":()=>`In Bodo liegen bei dir ${BS_ARBEIT.filter(r=>BA_TAG.includes(r[2])).length} Aufgaben, die nach meiner Einschätzung zu business//acts gehören (sellify-Vertrieb, AVV):<ul>${BS_ARBEIT.filter(r=>BA_TAG.includes(r[2])).map(r=>`<li>${r[2]} ${esc(r[3])} – ${r[4]}</li>`).join("")}</ul>Das per MCP erreichbare sellify enthält nur Testdaten. Für echte business//acts-Zahlen fehlt die Anbindung an euer produktives sellify.`,
 "Entwirf einen Prozess für die Lead-Gewinnung":()=>`Entwurf im Designer: 5 Schritte, Agenten aus dem Pool, eine Lücke (kein Agent mit Skill „lead-bewertung“). Prozessverantwortlich: Lead-Prozessagent, ergebnisverantwortlich: du (Vorschlag).<br><button class="btn acc" data-go="prozess|lead">Bestehenden Prozess ansehen</button>`};
/* Antworten werden beim Fragen aus den aktuellen Daten gebaut */
const SCRIPT2={};Object.keys(KI).forEach(k=>Object.defineProperty(SCRIPT2,k,{enumerable:true,get:KI[k]}));

/* ---------- Aktionen ---------- */
function onClick(b,d){
 if(d.sug){const [i,s]=d.sug.split("|");SUG[+i].s=s;K.toast(`„${SUG[+i].n}“: ${s} (Prototyp)`);K.refresh();return true}
 if(d.neu!==undefined){onNeu();return true}
 return false}
function onNeu(){K.modal(`<h2 style="margin:0;font-size:16px">Neuer Auftrag</h2><label class="k-lbl" for="pv-nj">Was soll passieren?</label><textarea class="abc-ta" id="pv-nj" style="min-height:70px">Alle überfälligen Nachfass-Aufgaben aus Bodo durchgehen und je Kontakt eine Mail entwerfen</textarea><div class="k-lbl">Vorschlag des Agenten</div><button class="k-mi" data-toast="Auftrag gestartet – Entwürfe kommen zur Freigabe (Prototyp)"><span><b>Einzelaufgabe an den Vertriebsassistenten</b><br><span class="k-lbl">Entwürfe zur Freigabe an dich · nichts wird gesendet</span></span><span>→</span></button><button class="k-mi" data-toast="Prozess gestartet (Prototyp)"><span><b>Prozess „Angebote nachfassen“</b><br><span class="k-lbl">aus den Vorlagen · startet als Entwurf</span></span><span>→</span></button>`)}

/* ---------- Start ---------- */
const nOver=()=>arbeit().filter(r=>r[0]==="overdue").length;
K.start({start:"dashboard",neu:"Neuer Auftrag",onNeu,onClick,fuss:"Company OS",badge:"Entwurf v2 · Pilot · echte Bodo-Daten · nur intern",
 mandanten:{all:{name:"Alle Unternehmen",kurz:"Übersicht",rolle:"Geschäftsführung",farbe:CO.all.color,ini:"∑",user:"BH"},
  bs:{name:"Bodo Solutions",kurz:"Bodo",rolle:"Geschäftsführung",farbe:CO.bs.color,ini:"B",user:"BH"},
  ba:{name:"business//acts",kurz:"sellify",rolle:"Geschäftsführung",farbe:CO.ba.color,brand:"#1F7FAE",ini:"//",user:"BH"}},mstart:"all",
 tagesleiste:()=>`<b>Mo., 12.10.2026</b><span class="sep">·</span><button class="k-tl" ${K.go("meinearbeit","overdue")}>Überfällig <span class="k-bdg r">${nOver()}</span></button><span class="sep">·</span><button class="k-tl" ${K.go("meinearbeit","frei")}>Freigaben <span class="k-bdg o">${wait().length}</span></button>${MK()!=="ba"?`<span class="sep wide">·</span><button class="k-tl wide" ${K.go("meinearbeit","today")}>Heute 10:00 Anforderungsanalyse</button>`:""}<span class="sep wide">·</span><span class="wide k-lbl">Bodo · Stand ${STAND}</span>`,
 menu:[{t:"ARBEITSBEREICH",items:[{v:"dashboard",i:"⌂",l:"Dashboard"},{v:"meinearbeit",i:"☰",l:"Meine Arbeit",n:nOver},{v:"auftraege",i:"▤",l:"Aufträge",n:()=>jobs().length,g:1}]},
  {t:"VERTRIEB",items:[{v:"chancen",i:"◇",l:"Chancen",also:["chance"],n:()=>MK()==="ba"?null:chOpen().length,g:1}]},
  {t:"STEUERUNG",items:[{v:"prozesse",i:"↝",l:"Prozesse",also:["prozess"]},{v:"projekte",i:"▦",l:"Projekte",also:["projekt"]},{v:"organigramm",i:"⌗",l:"Organigramm",also:["abteilung"]}]},
  {t:"WISSEN",items:[{v:"agenten",i:"✦",l:"Agenten & Skills",also:["agent"]},{v:"bibliothek",i:"▣",l:"Bibliothek"}]},
  {t:"EINRICHTUNG",items:[{v:"anschluesse",i:"⇄",l:"Anschlüsse"},{v:"ki",i:"⚙",l:"KI & Daten"},{v:"setup",i:"☑",l:"Setup"}]}],
 views:V,
 ki:{hallo:"Hallo Boris. Ich kenne Organigramm, Prozesse und Aufträge von Bodo Solutions und business//acts und lese Bodo über den Anschluss – nur lesend, Schreiben nur nach deiner Freigabe.",script:SCRIPT2,sonst:"Im Prototyp sind nur die vorbereiteten Fragen hinterlegt."},
 suche:()=>BS_ARBEIT.filter(r=>r[2]).map(r=>[r[2]+" "+r[3],"Aufgabe Bodo",K.go("meinearbeit",r[0])]).concat(BS_CHANCEN.map(c=>[c[1],"Chance",K.go("chance",c[0])]),BS_PROJ.map(p=>[p[1],"Projekt Bodo",BSP_ID[p[0]]?K.go("projekt",BSP_ID[p[0]]):K.go("projekt","b:"+p[0])]),allP().map(p=>[p.n,"Prozess",K.go("prozess",p.id)]),AG.map((a,i)=>[a.n,"Agent",K.go("agent",i)]),["bs","ba"].flatMap(k=>ORG[k].map((d,i)=>[d.n+" · "+CO[k].name,"Abteilung",K.go("abteilung",k+":"+i)])))});
