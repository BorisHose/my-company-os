/* ===== abcfinance · Ansichten für den Kern v2 =====
   Nutzt die abcfinance-Daten aus ../data.js (dieselben Daten wie die bisherige Fassung)
   und baut daraus die Seiten nach dem Bodo-Muster. */
const A={sel:4};
const ATT={3:"Zahlungsavis_2026-08812.pdf",8:"Police_7781-3310.pdf"};
const short=n=>n.split(" / ")[0];
const stChip=m=>({pruefen:K.chip("Mensch prüft","warn",true),freigabe:K.chip("wartet auf Freigabe","info",true),auto:K.chip("verteilt","ok",true),done:K.chip("erledigt","ok",true)}[m.st]);
const unclear=m=>/nicht eindeutig|möglich/.test(m.vertrag+m.kontakt);
const pIdx=n=>PROC.af.findIndex(p=>p.n===n);
const agIdx=n=>AG.findIndex(a=>a.n===n);
const lv=a=>a.sk.reduce((m,k)=>Math.max(m,(SKC[k]||[0,0])[1]),0);
const LVN2=["0 · ohne Personendaten","1 · pseudonymisiert","2 · personenbezogen"];
const procChip=p=>K.chip(p.st,{"aktiv":"ok","im Test":"info","Entwurf":""}[p.st]);
const mailNum=m=>"V-2026-10-04"+String(m.id).padStart(2,"0");
const snippet=m=>m.body.split("\n").filter(l=>!/^(sehr geehrte|hallo|guten tag)/i.test(l.trim()))[0]||"";
function aiBox(m){const t=T(m.type);const R=[[t.n+(/^\d{4}-\d{4}$/.test(m.vertrag)?` zu Vertrag ${m.vertrag}`:unclear(m)&&m.id===4?" zu Vertrag 3120-1102":""),`→ ${target(t,m)} · Folgeprozess „${t.proc}“`]];
 if(m.also){const a=T(m.also[0]);R.push([a.n,`→ ${target(a)} · Änderung nach Freigabe`])}
 const done=m.st==="auto"||m.st==="done";
 return `<div class="k-ai"><div class="t">✦ Vorschlag der KI${R.length>1?` · ${R.length} Vorgänge`:""}</div>${R.map((r,i)=>`<div class="k-air"><span class="n">${i+1}</span><div><b>${esc(r[0])}</b><br><span class="k-lbl">${esc(r[1])}</span></div>${done?`<span class="r">${K.chip("übernommen","ok")}</span>`:`<span class="r">${K.btn("Übernehmen",`data-ok="${m.id}"`,true,true)}</span>`}</div>`).join("")}<div class="why">Warum: ${esc(m.why)}${m.ki<t.thr?` Sicherheit unter der Schwelle von ${t.thr} %, deshalb prüft ein Mensch.`:""}</div></div>`}
function mailBody(m){const t=T(m.type);const hits=cover(m.body,t).hits.concat(m.also?cover(m.body,T(m.also[0])).hits:[]);
 return `<div class="abc-from"><span class="k-pa">${K.ini(m.from)}</span><div><b>${esc(m.from)}</b><div class="k-lbl">an Postfach ${m.box} · 12.10.2026, ${m.tm} · ${ATT[m.id]?"1 Anhang":"keine Anhänge"}</div></div></div>
 <div class="abc-txt">${markText(m.body,hits)}</div>${ATT[m.id]?`<div style="margin-top:10px">${K.chip("📎 "+ATT[m.id])}</div>`:""}`}
function mailActs(m,sm){return m.st==="pruefen"?K.btn("Anders einordnen",`data-fix="${m.id}"`,false,sm)+" "+K.btn("Bestätigen und weitergeben",`data-ok="${m.id}"`,true,sm):m.st==="freigabe"?K.btn("Antwort ansehen",`data-toast="Antwortentwurf mit Rechnungskopie (Prototyp)"`,false,sm)+" "+K.btn("Antwort freigeben",`data-ok="${m.id}"`,true,sm):K.btn("Einordnung korrigieren",`data-fix="${m.id}"`,false,sm)}
function einMeters(m){const t=T(m.type),r=bestRule(m.body)[0];return meter("KI · "+short(t.n),m.ki,m.ki<t.thr?"lo":"ki")+(m.also?meter("KI · "+short(T(m.also[0]).n),m.also[1],"ki"):"")+meter("Kennbegriffe (heute)",cover(m.body,t).pct||r.pct)}
function protokoll(m){const t=T(m.type),low=m.ki<t.thr||t.st!=="aktiv",u=unclear(m);
 return [["ok","✓",`<b>Posteingangs-Agent</b> hat Mail und Anhänge gelesen`,m.tm],
  ["ok","✓",`<b>Klassifizierungs-Agent</b> hat ${m.also?"2 Anliegen":"das Anliegen"} erkannt · ${esc(t.n)} ${m.ki} %${m.also?` · ${esc(T(m.also[0]).n)} ${m.also[1]} %`:""} · Kennbegriffe ${cover(m.body,t).pct} %`,m.tm],
  [low||u?"warn":"ok",low||u?"!":"✓",`<b>Posteingangs-Prozessagent</b> entscheidet: ${low||u?`Mensch prüft – ${t.st!=="aktiv"?"Dokumenttyp im Anlernen":m.ki<t.thr?`unter der Schwelle von ${t.thr} %`:"Vertrag nicht eindeutig"}`:`sicher genug (Schwelle ${t.thr} %)`}`,m.tm],
  [m.st==="pruefen"?"now":low||u?"ok":"skip",m.st==="pruefen"?"…":low||u?"✓":"–",`<b>Team Posteingang</b> ${m.st==="pruefen"?"prüft – offen":low||u?"hat bestätigt":"– nicht nötig"}`,""],
  [u&&m.st==="pruefen"?"warn":"ok",u&&m.st==="pruefen"?"!":"✓",`<b>Zuordnungs-Agent</b> · ${esc(m.kontakt)} · Vertrag ${esc(m.vertrag)}`,m.tm],
  [m.st==="pruefen"?"skip":"ok",m.st==="pruefen"?"–":"✓",`<b>Zuordnungs-Agent</b> ${m.st==="pruefen"?"startet den Folgeprozess nach der Prüfung":`hat „${esc(t.proc)}“ gestartet · ${esc(target(t,m))}`}`,""]]}

/* ---------- Ansichten ---------- */
const V={};
V.dashboard=()=>{const nE=WAIT.af.filter(w=>w.k==="Eskalation").length,nP=MAILS.filter(m=>m.st==="pruefen").length,nF=MAILS.filter(m=>m.st==="freigabe").length+WAIT.af.filter(w=>w.k==="Freigabe").length;const pr=PROC.af;
 return K.dash({hello:`Guten Tag, <em>${ME.n.split(" ")[0]}</em>`,sub:"Montag, 12. Oktober 2026 · Dein Überblick für heute",stand:"Stand heute, 14:47 Uhr · Beispieldaten",groups:[
  {t:"BRAUCHT AUFMERKSAMKEIT",s:"Was heute hakt · Klick öffnet den Bereich",tiles:[
   {t:"Eskalationen",k:"Jetzt",n:nE,c:"var(--danger)",d:"Insolvenzmitteilung Nordlicht Events – an dich eskaliert",go:K.go("vorgang",6)},
   {t:"Mensch prüft",k:"Posteingang",n:nP,c:"#C2650A",d:"Ältester Fall seit 35 Min.: Hoffmann Druck",go:K.go("posteingang")},
   {t:"Freigaben",k:"Für dich",n:nF,c:"var(--brand)",d:"Kennbegriffe Vertragsreklamation v4 · Antwort Elektro Yilmaz",go:K.go("meinearbeit")},
   {t:"Fristen",k:"Nächste Tage",kp:[[0,"überfällig"],[2,"morgen"],[5,"diese Woche"]],c:"#C2650A",d:"Reklamation Metallbau Krüger fällig am 13.10.",go:K.go("auftraege")},
   {t:"Testläufe",k:"Laufend",n:1,c:"var(--info)",d:"Anlernlauf Insolvenzmitteilung · Schritt 3 von 5",go:K.go("dokumenttyp","ins")},
   {t:"Vorschläge",k:"Prozesse",n:SUG.filter(s=>s.s==="offen").length,c:"var(--ai)",d:"z. B. „Anfrage ohne Anliegen klären“",go:K.go("prozesse","sug")}]},
  {t:"BESTAND",s:"Wie viel wovon da ist · Klick öffnet die Übersicht",tiles:[
   {t:"Posteingang heute",n:214,d:"198 verteilt · 91 % richtig im Schattenbetrieb",go:K.go("auftraege")},
   {t:"Prozesse",n:pr.length,d:`${pr.filter(p=>p.st==="aktiv").length} aktiv · ${pr.filter(p=>p.st==="im Test").length} im Test · ${pr.filter(p=>p.st==="Entwurf").length} Entwurf`,go:K.go("prozesse")},
   {t:"Dokumenttypen",n:TYPES.length,d:`${TYPES.filter(t=>t.st==="aktiv").length} aktiv · ${TYPES.filter(t=>t.st!=="aktiv").length} im Anlernen`,go:K.go("dokumenttypen")},
   {t:"Agenten",n:AG.length,d:`in ${ORG.af.length} Abteilungen`,go:K.go("agenten")},
   {t:"Abteilungen",n:ORG.af.length,d:`${ORG.af.reduce((s,d)=>s+d.ppl.length+1,0)} Menschen`,go:K.go("organigramm")},
   {t:"Projekte",n:PROJ.af.length,d:"Einführung ASS · Phase 1",go:K.go("projekte")}]}]})+`<div class="k-note">Alle Zahlen sind Beispieldaten.</div>`};

V.meinearbeit=()=>{const L=[["wait","Wartet auf mich"],["check","Zu prüfen"],["run","Läuft"],["rest","Ruhend"]];const cur=K.tab("meinearbeit","wait");const R=SESS.filter(s=>s.l===cur);
 const goOf=s=>s.mail?K.go("vorgang",s.mail):/Kennbegriffe/.test(s.t)?K.go("dokumenttyp","rek"):/Insolvenz/.test(s.t)?K.go("dokumenttyp","ins"):/Schattenbetrieb/.test(s.t)?K.go("projekt","ass"):/Posteingang/.test(s.t)?K.go("posteingang"):`data-toast="Öffnet „${esc(s.t)}“ (Prototyp)"`;
 return K.list({title:"Meine Arbeit",chips:[K.chip("Beispieldaten","ex")],view:"meinearbeit",tabs:L.map(([k,l])=>[k,l,SESS.filter(s=>s.l===k).length]),
  cols:["Quelle","Vorgang","Stand","Jetzt tun","Zuordnung"],rows:R.map(s=>[`<span class="k-lbl">${SRC[s.src][0]} ${SRC[s.src][1]}</span><br><span class="k-lbl">${s.ago}</span>`,`<span class="nm">${esc(s.t)}</span>`,esc(s.st),`<b>${esc(s.nx)}</b>`,K.chip(esc(s.as||"offen"))]),rowGo:i=>goOf(R[i]),
  note:"Vorgänge aus Prozessen, die auf dich eskaliert sind oder deine Freigabe brauchen, erscheinen hier wie eigene Aufgaben."})};

V.posteingang=()=>{const box=K.tab("pe_box","Alle"),stf=K.tab("pe_st","alle");
 const boxes=["Alle","Service","Verträge","Buchhaltung"];const SF=[["pruefen","Mensch prüft"],["freigabe","Freigabe"],["auto","Verteilt"],["alle","Alle"]];
 const inBox=MAILS.filter(m=>box==="Alle"||m.box===box);const L=inBox.filter(m=>stf==="alle"||m.st===stf||(stf==="auto"&&m.st==="done"));
 if(!L.find(m=>m.id===A.sel)&&L[0])A.sel=L[0].id;const m=MAILS.find(x=>x.id===A.sel)||L[0];
 const list=`<div class="abc-filter">${SF.map(([k,l])=>`<button class="abc-f" data-tab="pe_st|${k}" aria-pressed="${k===stf}">${l} <small>${inBox.filter(x=>k==="alle"||x.st===k||(k==="auto"&&x.st==="done")).length}</small></button>`).join("")}</div>
  <div class="scroll">${L.map(x=>{const t=T(x.type);return `<button class="k-it" data-sel="${x.id}" aria-current="${x.id===m?.id}"><div class="a"><b>${esc(x.from)}</b><span class="k-lbl">${x.tm}</span></div><div class="s">${esc(x.subj)}</div><div class="x">${esc(snippet(x))}</div><div class="ch">${K.chip(esc(short(t.n))+(x.also?" + 1":""),"info")}${stChip(x)}</div></button>`}).join("")||'<div class="k-sb k-note">Keine Mails mit diesem Status.</div>'}</div>`;
 const det=m?`<div class="abc-dh"><div class="abc-row"><h2>${esc(m.subj)}</h2>${stChip(m)}<span class="k-sp"></span>${K.btn("⤢ Vorgang öffnen",K.go("vorgang",m.id),false,true)}</div>
  <div class="abc-row">${mailActs(m,true)}</div>${aiBox(m)}${mailBody(m)}
  <div class="k-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:8px"><b>Einordnung</b>${einMeters(m)}${K.kv([["Kontakt",esc(m.kontakt)],["Vertrag",esc(m.vertrag)],["Ziel",esc(target(T(m.type),m))]])}</div></div>`:'<div class="k-sb k-note">Keine Mail ausgewählt.</div>';
 return {fix:true,html:K.inbox({head:K.pageHead("Posteingang",{chips:[K.chip("Beispieldaten","ex")],actions:K.btn("Jetzt abrufen",'data-toast="Postfächer abgerufen – keine neuen Mails (Prototyp)"')})+`<div class="k-tabs" role="tablist">${boxes.map(b=>`<button class="k-tab" role="tab" aria-selected="${b===box}" data-tab="pe_box|${b}">${b==="Alle"?"Alle Postfächer":"Postfach "+b} <small>${MAILS.filter(x=>b==="Alle"||x.box===b).length}</small></button>`).join("")}</div>`,list,detail:det})}};

V.vorgang=id=>{const m=MAILS.find(x=>x.id===+id)||MAILS[3];const t=T(m.type);const pe=PROC.af[0];const u=unclear(m);
 const kon=m.kontakt.split(" · ");const fol=PROC.af[pIdx(t.proc)];const sim=MAILS.filter(x=>x.type===m.type&&x.id!==m.id);
 const chron=[["ok","✉",`Mail im Postfach ${m.box} eingegangen`,m.tm],["ok","✦",`KI-Einordnung: ${esc(t.n)} (${m.ki} %)`,m.tm]].concat(m.st==="pruefen"?[["warn","!","An Team Posteingang zur Prüfung gegeben",m.tm]]:[]).concat(m.id===6?[["warn","↑","Stefan Krause abwesend · Vertretung ohne Reaktion · an Sandra Weber eskaliert","10:52"]]:[]).concat(m.st==="auto"||m.st==="done"?[["ok","→",`Verteilt: ${esc(target(t,m))}`,m.tm]]:[]);
 const empty=["Wiedervorlagen","Notizen","Antworten"].concat(sim.length?[]:["Ähnliche Fälle"]);
 return K.detail({title:esc(m.subj),num:mailNum(m),
  chips:[K.chip("✉ Vorgang"),K.chip(esc(t.n)+(m.also?" + 1":""),"info"),stChip(m),K.chip(`KI ${m.ki} %`,m.ki<t.thr?"warn":"ok"),m.id===6?K.chip("hohe Priorität","bad"):m.st==="pruefen"?K.chip("seit 35 Min.","bad"):""],
  actions:mailActs(m),
  cards:[{t:"Einordnung",r:`<span class="k-lbl">Schwelle ${short(t.n)} ${t.thr} %</span>`,b:einMeters(m)+`<span class="k-lbl">${m.also?"Zwei Anliegen erkannt · ":""}Kennbegriffe als Gegenprüfung</span>`},
   {t:"Zuordnung in sellify",r:u?K.chip("nicht eindeutig","warn"):K.chip("eindeutig","ok"),b:K.kv([["Organisation",`<span class="k-lnk">${esc(kon[0])}</span>`],["Person",kon[1]?`<span class="k-lnk">${esc(kon[1])}</span>`:"–"],["Vertrag",esc(m.vertrag)],["Ziel",esc(target(t,m))]])},
   {t:"Zuständigkeit",r:K.btn("Übernehmen",'data-toast="Du hast den Vorgang übernommen (Prototyp)"',false,true),b:K.agent(pe.pa,"führt")+(m.st==="pruefen"?K.person("LK","Lisa Koch","prüft jetzt"):m.person?K.person(K.ini(m.person),m.person,"bearbeitet"):K.person("AK","Arbeitskorb "+TEAMS[t.team],"bearbeitet"))+K.person("MH",pe.er,"ergebnisverantwortlich")+`<span class="k-lbl">Prozess ${pe.n} · ${m.st==="pruefen"?"Schritt 4 von 6":"abgeschlossen → "+esc(t.proc)}</span>`}],
  sections:[
   {id:"mail",t:"✉ Mail & Anhänge",n:ATT[m.id]?2:1,a:K.btn("In sellify öffnen",'data-toast="Öffnet die Mail in sellify (Prototyp)"',false,true)+K.btn("Antworten",'data-toast="Antwort an den Kunden – Versand nach Freigabe (Prototyp)"',false,true),b:`<div class="abc-mail"><div>${mailBody(m)}</div>${aiBox(m)}</div>`},
   {id:"prot",t:"↝ Protokoll",n:6,a:`<span class="k-lbl">jeder Schritt mit Ergebnis, Sicherheit und Begründung</span> ${EXT}`,flush:true,b:K.timeline(protokoll(m))},
   {id:"aufg",t:"☑ Aufgaben",n:fol?fol.steps.length:0,a:`<span class="k-lbl">aus dem Folgeprozess „${esc(t.proc)}“</span>`,flush:true,b:fol?K.table(["Schritt","Wer","Freigabe / Hinweis","Status"],fol.steps.map((s,i)=>[esc(s.n),s.ag==="–"?"Mensch":"✦ "+esc(s.ag),esc(s.fr||"–"),m.st==="pruefen"?K.chip("noch nicht angelegt"):i===0?K.chip("angelegt","ok"):K.chip("geplant")])):""},
   {id:"chron",t:"◷ Chronik",n:chron.length,flush:true,b:K.timeline(chron)},
   {id:"aehn",t:"≈ Ähnliche Fälle",n:sim.length,hide:!sim.length,flush:true,b:K.table(["Vorgang","Absender","Status"],sim.map(x=>[`<span class="nm">${esc(x.subj)}</span>`,esc(x.from),stChip(x)]),{rowGo:i=>K.go("vorgang",sim[i].id)})}],
  empty})};

V.auftraege=()=>{const S=["alle","Mensch prüft","Freigabe","Eskalation","läuft","erledigt"];const cur=K.tab("auftraege","alle");const R=JOBS.af.filter(r=>cur==="alle"||r[4]===cur);
 const cnt=[["Zahlungsklärung",61],["Vertragsreklamation",38],["Rechnungskopie / Anfrage",34],["Kündigung",27],["Adress- und Stammdaten",22],["Ablöseanfrage",15],["Versicherungsnachweis",9],["Insolvenzmitteilung",1],["unklar",7]];
 return K.list({title:"Aufträge",chips:[K.chip("Beispieldaten","ex")],actions:K.btn("＋ Neuer Auftrag","data-neu",true),view:"auftraege",tabs:S.map(s=>[s,s==="alle"?"Alle":s,s==="alle"?JOBS.af.length:JOBS.af.filter(r=>r[4]===s).length]),
  tools:`<span class="k-sp"></span><span class="k-lbl">Heute insgesamt 214 · je Dokumenttyp:</span> ${cnt.slice(0,4).map(([n,c])=>K.chip(`${n} <b>${c}</b>`)).join("")} ${EXT}`,
  cols:["Auftrag","Prozess · Schritt","Herkunft","Status"],rows:R.map(r=>[`<span class="nm">${esc(r[0])}</span>`,esc(r[1]),K.chip(esc(r[2])),`<span class="pill ${r[3]}">${r[4]}</span>`]),rowGo:i=>R[i][5]?K.go("vorgang",R[i][5]):K.go("dokumenttyp","ins"),
  note:"Jede Mail ist ein Auftrag im Prozess „Posteingangsverarbeitung“"})};

V.prozesse=id=>{if(id){K.st.tab.prozesse=id;K.st.id=null}const cur=K.tab("prozesse","mine");const P=PROC.af;
 const agentFor=sk=>AG.find(a=>a.sk.includes(sk));
 let body;
 if(cur==="tpl"){const L=TPL.filter(t=>!t.proj);body=`<div class="k-card"><div class="k-lh"><b>${L.length} Prozessvorlagen</b><span class="k-sp"></span>${K.chip("Branchenpaket Leasing & Finanzierung · Idee","ex")}</div>${K.table(["Vorlage","Bereich","Ablauf","Abdeckung durch Agenten",""],L.map(t=>{const gaps=t.sk.filter(k=>!agentFor(k));return [`<b>${esc(t.n)}</b>`,esc(t.f),`<span class="k-lbl">${esc(t.d)}</span>`,gaps.length?`<span class="pill p-wait">Lücke: ${gaps.join(", ")}</span>`:'<span class="pill p-ok">Agenten vorhanden</span>',K.btn("Übernehmen",`data-toast="„${esc(t.n)}“ als Entwurf übernommen – aktiv erst nach Testlauf (Prototyp)"`,false,true)]}))}</div>`}
 else if(cur==="sug"){body=`<div class="k-card"><div class="k-lh"><b>${SUG.length} Vorschläge</b><span class="k-note">aus der Auswertung des Posteingangs, aus Vorlagen oder eigenem Prompt</span></div>${K.table(["Vorschlag","Quelle","Warum","Status",""],SUG.map((s,i)=>[`<b>${esc(s.n)}</b>`,esc(s.src),esc(s.why),s.s==="offen"?K.chip("offen"):K.chip(s.s,s.s==="übernommen"?"ok":""),s.s==="offen"?K.btn("Übernehmen",`data-sug="${i}|übernommen"`,true,true)+" "+K.btn("Später",`data-sug="${i}|später"`,false,true)+" "+K.btn("Ablehnen",`data-sug="${i}|abgelehnt"`,false,true):""]))}</div>`}
 else body=`<div class="k-card"><div class="k-lh"><b>${P.length} Prozesse</b><input class="k-search" placeholder="Prozess, Abteilung, Agent suchen …" aria-label="Suchen"></div>${K.table(["Prozess","Abteilung","Schritte","Prozessverantwortlich","Ergebnisverantwortlich","Status","Aufträge"],P.map(p=>[`<span class="nm">${esc(p.n)}</span>`,esc(p.dep),p.steps.length,"✦ "+esc(p.pa),esc(p.er),procChip(p)+` <span class="k-lbl">${p.v}</span>`,`<span class="k-lbl">${esc(p.run)}</span>`]),{rowGo:i=>K.go("prozess",P[i].id)})}</div>`;
 return K.pageHead("Prozesse",{chips:[K.chip("Beispieldaten","ex")],actions:K.btn("✦ Neu mit KI-Designer",'data-toast="Der Prozess-Designer wird im nächsten Schritt in den Kern übernommen (Prototyp)"',true)})+K.tabs("prozesse",[["mine","Meine Prozesse",P.length],["tpl","Vorlagen",TPL.filter(t=>!t.proj).length],["sug","Vorschläge",SUG.filter(s=>s.s==="offen").length]])+body};

V.prozess=id=>{const p=PROC.af.find(x=>x.id===id)||PROC.af[0];const ags=[...new Set(p.steps.map(s=>s.ag).filter(a=>a!=="–").concat([p.pa]))];const jobs=JOBS.af.filter(r=>r[1].includes(p.n));
 const isPe=p.id==="pe";
 return K.detail({title:esc(p.n),num:"P-"+String(PROC.af.indexOf(p)+1).padStart(3,"0"),chips:[K.chip("↝ Prozess"),procChip(p),K.chip(p.v),K.chip(esc(p.dep))],
  actions:K.btn("Testlauf",'data-toast="Testlauf mit Beispieldaten im Testsystem gestartet (Prototyp)"')+" "+K.btn("Auftrag starten","data-neu")+" "+K.btn("Im Designer öffnen",'data-toast="Der Prozess-Designer wird im nächsten Schritt in den Kern übernommen (Prototyp)"',true),
  cards:[{t:"Steckbrief",b:K.kv([["Abteilung",`<button class="k-lnk" ${K.go("abteilung",ORG.af.findIndex(d=>d.n===p.dep))}>${esc(p.dep)}</button>`],["Version",p.v],["Schritte",p.steps.length],["Aufträge",esc(p.run)]])},
   {t:"Verantwortung",b:K.agent(p.pa,"führt den Prozess")+K.person(K.ini(p.er),p.er,"ergebnisverantwortlich")+`<span class="k-lbl">Eskalation über Abteilungsleitung und Vertretung</span>`},
   isPe?{t:"Heute",r:EXT,b:K.kv([["Aufträge","214"],["automatisch","198"],["Mensch prüft","16"],["richtig","91 % im Schattenbetrieb"]])}:{t:"Hinweis",b:`<span class="k-note">${esc(p.note||"Keine offenen Hinweise.")}</span>`}],
  sections:[
   {id:"ablauf",t:"↝ Ablauf",n:p.steps.length,flush:true,a:p.note?`<span class="k-lbl">${esc(p.note)}</span>`:"",b:K.table(["#","Schritt","Agent oder Mensch","Ersatz","Freigabe / Hinweis"],p.steps.map((s,i)=>[i+1,`<b>${esc(s.n)}</b>`,s.ag==="–"?"● Mensch":`<button class="k-lnk" ${K.go("agent",agIdx(s.ag))}>✦ ${esc(s.ag)}</button>`,esc(s.ers||"–"),s.fr?`<span class="pill p-wait">${esc(s.fr)}</span>`:"–"]))},
   {id:"ag",t:"✦ Agenten",n:ags.length,b:ags.map(a=>`<button class="k-lnk" style="display:block;margin:4px 0" ${K.go("agent",agIdx(a))}>${K.agent(a,a===p.pa?"prozessverantwortlich":"")}</button>`).join("")},
   {id:"auf",t:"☰ Aufträge",n:jobs.length,hide:!jobs.length,flush:true,b:K.table(["Auftrag","Stand","Status"],jobs.map(r=>[`<span class="nm">${esc(r[0])}</span>`,esc(r[1]),`<span class="pill ${r[3]}">${r[4]}</span>`]),{rowGo:i=>jobs[i][5]?K.go("vorgang",jobs[i][5]):""})},
   {id:"esk",t:"↑ Eskalation",n:5,flush:true,b:K.timeline([["now","1","<b>Ausführender Agent</b> arbeitet den Schritt ab",""],["now","2",`<b>${esc(p.pa)}</b> wiederholt, nimmt den Ersatz-Agenten, stellt Rückfrage`,""],["now","3",`<b>${esc(p.er)}</b> entscheidet und nimmt ab`,""],["now","4","<b>Abteilungsleitung</b> wenn keine Reaktion",""],["now","5","<b>Vertretung</b> bei Abwesenheit oder Frist",""]])},
   {id:"ver",t:"◷ Versionen",n:+p.v.slice(1),flush:true,b:K.timeline(Array.from({length:+p.v.slice(1)},(_,i)=>+p.v.slice(1)-i).map(v=>[v===+p.v.slice(1)?"ok":"skip","v"+v,v===+p.v.slice(1)?`<b>Version ${v}</b> · ${esc(p.st)}`:`Version ${v} · abgelöst`,""]))}],
  empty:["Testläufe","Kommentare"].concat(jobs.length?[]:["Aufträge"])})};

V.projekte=()=>K.list({title:"Projekte",chips:[K.chip("Beispieldaten","ex")],actions:K.btn("＋ Projekt aus Vorlage",'data-toast="Projektvorlage „Einführung KI-Prozess“ (Prototyp)"',true),cols:["Projekt","Art","Verwaltet in","Projektverantwortlich","Aktuelle Phase","Nächster Meilenstein"],
 rows:PROJ.af.map(p=>[`<span class="nm">${esc(p.n)}</span>`,esc(p.kind),esc(p.sys),esc(p.pv[1]),esc(PH.find(x=>x.st==="run").n),"Konzept freigegeben · 06.11."]),rowGo:i=>K.go("projekt",PROJ.af[i].id),note:"Daten und Termine sind Annahmen"});

V.projekt=id=>{const p=PROJ.af[0];const run=PH.find(x=>x.st==="run");
 return K.detail({title:esc(p.n),num:"PR-2026-01",chips:[K.chip("▦ Projekt"),K.chip(p.kind),K.chip("läuft","info",true),K.chip("verwaltet in sellify")],actions:K.btn("In sellify öffnen",'data-toast="Öffnet das Projekt in sellify (Prototyp)"')+" "+K.btn("Auftrag im Projekt starten","data-neu",true),
  cards:[{t:"Steckbrief",b:K.kv([["Vorlage",esc(p.tpl)],["Ablauf","automatisch aus der Vorlage"],["Zeitraum","12.10.2026 – 29.01.2027"]])},{t:"Verantwortung",b:K.person("SW",p.pv[1],"projektverantwortlich")+K.person("MH","Markus Hahn","Anlernen")+K.person("IT","IT abcfinance","Anbindung")},{t:"Fortschritt",r:AN,b:K.kv([["Aktuelle Phase",esc(run.n)],["Meilenstein",esc(run.ms[0])+" · "+run.ms[1]],["Phasen",`1 von ${PH.length} läuft`]])}],
  sections:[{id:"ph",t:"▦ Phasen",n:PH.length,flush:true,b:K.table(["Phase","Zeitraum","Ergebnisverantwortlich","Ablauf","Status"],PH.map(x=>[`<b>${esc(x.n)}</b>`,`${x.from}–${x.to}`,esc(x.er),x.par?"parallel":"nacheinander",K.chip(PHS[x.st][1],x.st==="run"?"info":x.st==="done"?"ok":"")]))},
   {id:"ms",t:"◆ Meilensteine",n:PH.length,flush:true,b:K.timeline(PH.map(x=>[x.ms[2]?"ok":x.st==="run"?"now":"skip","◆",`<b>${esc(x.ms[0])}</b> · Abnahme durch ${esc(x.er)}`,x.ms[1]]))},
   {id:"pr",t:"↝ Prozesse je Phase",n:PH.reduce((s,x)=>s+x.pr.length,0),flush:true,b:K.table(["Phase","Prozess","Stand"],PH.flatMap(x=>x.pr.map(r=>[esc(x.n),`<b>${esc(r[0])}</b>`,esc(r[1])])))},
   {id:"auf",t:"☰ Aufträge",n:1,flush:true,b:K.table(["Auftrag","Stand","Status"],[[`<span class="nm">Anlernlauf Insolvenzmitteilung</span>`,"Dokumenttyp anlernen und pflegen · Schritt 3 von 5",'<span class="pill p-run">läuft</span>']],{rowGo:()=>K.go("dokumenttyp","ins")})}],
  empty:["Dokumente","Risiken"]})};

V.organigramm=()=>K.pageHead("Organigramm",{chips:[K.chip("Beispieldaten","ex")],actions:K.btn("＋ Abteilung",'data-toast="Abteilung anlegen – ausblenden statt löschen (Prototyp)"')})+
 `<div class="k-card abc-orgtop"><span class="big">${ME.ini}</span><div><b style="font-size:16px">${ME.rolle}</b><div class="k-note">${ME.n} · du · ${ME.dep}</div></div><span class="k-sp"></span>${K.agent("Persönlicher KI-Assistent",PSK.filter(x=>x[2]).length+" Fähigkeiten")}</div>
 <div class="k-org">${ORG.af.map((d,i)=>`<button class="k-card k-dep" style="--c:${d.c}" ${K.go("abteilung",i)}><b style="font-size:15px">${esc(d.n)}</b>${K.person(d.lead[0],d.lead[1],"Leitung")}<span class="k-lbl">${esc(d.dep)} · ${d.ppl.length} Mitarbeitende · ${d.ag.length+d.pa.length} Agenten</span><span class="pill ${d.al?"p-wait":"p-ok"}" style="align-self:flex-start">${esc(d.al||d.ok)}</span></button>`).join("")}</div>`;

V.abteilung=id=>{const d=ORG.af[+id]||ORG.af[0];const P=PROC.af.filter(p=>p.dep===d.n);const short2=d.n.split(" &")[0];const R=ROUTES.af.filter(r=>r[1].includes(short2));const ags=d.pa.map(x=>x[0]).concat(d.ag);
 return K.detail({title:esc(d.n),num:"Abteilung",chips:[K.chip("⌂ Abteilung"),d.al?K.chip(esc(d.al),"warn",true):K.chip(esc(d.ok),"ok",true)],actions:K.btn("Bearbeiten",'data-toast="Abteilung bearbeiten (Prototyp)"'),
  cards:[{t:"Leitung",b:K.person(d.lead[0],d.lead[1],"Leitung")+`<span class="k-lbl">${esc(d.dep)}</span>`},{t:"Arbeitskorb in sellify",r:UMD,b:K.kv([["Eingänge",`${R.length} Dokumenttypen`],["Offen","Beispiel: 9"],["Bearbeitung","in sellify"]])},{t:"Besetzung",b:K.kv([["Menschen",d.ppl.length+1],["Agenten",ags.length],["Prozesse",P.length]])}],
  sections:[{id:"ma",t:"● Mitarbeitende",n:d.ppl.length+1,b:K.person(d.lead[0],d.lead[1],"Leitung")+d.ppl.map(p=>K.person(p[0],p[1])).join("")},
   {id:"ag",t:"✦ Agenten",n:ags.length,b:ags.map(a=>`<button class="k-lnk" style="display:block;margin:4px 0" ${K.go("agent",agIdx(a))}>${K.agent(a,d.pa.some(x=>x[0]===a)?"prozessverantwortlich":"")}</button>`).join("")},
   {id:"pr",t:"↝ Prozesse",n:P.length,flush:true,b:K.table(["Prozess","Status","Aufträge"],P.map(p=>[`<span class="nm">${esc(p.n)}</span>`,procChip(p),esc(p.run)]),{rowGo:i=>K.go("prozess",P[i].id)})},
   {id:"korb",t:"⇥ Eingänge in den Arbeitskorb",n:R.length,hide:!R.length,flush:true,b:K.table(["Dokumenttyp","geht an","Status"],R.map(r=>[`<b>${esc(r[0])}</b>`,esc(r[1]),`<span class="pill ${r[3]}">${esc(r[4])}</span>`]))}],
  empty:["Kennzahlen","Abwesenheiten"]})};

V.dokumenttypen=()=>K.list({title:"Dokumenttypen",chips:[K.chip("Profile des Skills posteingang-einordnen","ai"),UMD],actions:K.btn("＋ Dokumenttyp anlernen",'data-toast="Neuer Dokumenttyp: Lernbeispiele in die Bibliothek, dann startet „Dokumenttyp anlernen und pflegen“ (Prototyp)"',true),
 cols:["Dokumenttyp","Kennbegriffe","Lernbeispiele","Treffsicherheit "+EX,"Schwelle","Folgeprozess","Status"],
 rows:TYPES.map(t=>[`<span class="nm">${esc(t.n)}</span>`,t.terms.length,t.docs,`<div style="min-width:190px">${t.rule?meter("Begriffe",t.rule):'<span class="k-lbl">noch keine Regel</span>'}${meter("KI",t.ki,"ki")}</div>`,t.thr+" %",esc(t.proc),K.chip(t.ver)+" "+K.chip(t.st,t.st==="aktiv"?"ok":"warn")]),rowGo:i=>K.go("dokumenttyp",TYPES[i].id)});

V.dokumenttyp=id=>{const t=T(id)||TYPES[0];const txt=A.test??(MAILS.find(m=>m.type===t.id)?.body||"");const M=MAILS.filter(m=>m.type===t.id);const fol=PROC.af[pIdx(t.proc)];
 return K.detail({title:esc(t.n),num:"Profil "+t.ver,chips:[K.chip("◆ Dokumenttyp"),K.chip("Skill posteingang-einordnen","ai"),K.chip(t.st,t.st==="aktiv"?"ok":"warn",true)],
  actions:K.btn("Testlauf",`data-toast="Testlauf gegen ${t.docs} Lernbeispiele gestartet (Prototyp)"`)+" "+K.btn("Neue Version vorschlagen",'data-toast="Entwurf einer neuen Profil-Version – Freigabe durch Leitung Posteingang und Fachabteilung (Prototyp)"',true),
  cards:[{t:"Treffsicherheit",r:EX,b:(t.rule?meter("Kennbegriffe",t.rule):'<span class="k-lbl">noch keine Begriffsregel</span>')+meter("KI-Agent",t.ki,"ki")+`<span class="k-lbl">gemessen an der Testmenge</span>`},
   {t:"Ziel & Folgeprozess",b:K.kv([["Ziel",esc(target(t))],["Folgeprozess",fol?`<button class="k-lnk" ${K.go("prozess",fol.id)}>${esc(t.proc)}</button>`:esc(t.proc)],["Team",esc(TEAMS[t.team])]])},
   {t:"Lernbasis",b:K.kv([["Lernbeispiele",t.docs],["Quelle","sellify-Dokumentarchiv"],["Kennbegriffe",t.terms.length],["Schwelle",t.thr+" %"]])}],
  sections:[{id:"kb",t:"Kennbegriffe",n:t.terms.length,a:'<span class="k-lbl">heute in sellify gepflegt · Gewicht in Klammern</span>',b:`<div class="abc-terms">${t.terms.map(([d,,w])=>`<span class="abc-term">${esc(d)} <i>×${w}</i></span>`).join("")}</div>`},
   {id:"vs",t:"✦ Vorschläge der KI",n:t.sug.length,a:EX,b:`<div class="abc-terms">${t.sug.map(([d,c])=>`<button class="abc-term new" data-toast="„${esc(d)}“ zur Freigabe vorgelegt – Teil der nächsten Profil-Version (Prototyp)">＋ ${esc(d)} <i>in ${c} Beispielen</i></button>`).join("")}</div><div class="k-note" style="margin-top:8px">Begriffe, die in vielen Lernbeispielen vorkommen, aber noch fehlen. Übernahme nur nach Freigabe.</div>`},
   {id:"sw",t:"Schwelle",a:EXT,b:`<div class="abc-row"><input type="range" id="abc-thr" min="50" max="99" value="${t.thr}" data-thr="${t.id}" aria-label="Schwelle" style="flex:1"><b id="abc-thrv" style="width:48px;text-align:right">${t.thr} %</b></div><div class="k-note">Darunter prüft ein Mensch. Höher heißt sicherer, aber mehr Handarbeit.</div>`},
   {id:"test",t:"Ausprobieren",b:`<textarea class="abc-ta" id="abc-test" aria-label="Testtext">${esc(txt)}</textarea><div id="abc-testout" style="display:flex;flex-direction:column;gap:4px;margin-top:8px">${bestRule(txt).slice(0,4).map(r=>meter(r.t.n,r.pct,r.pct<35?"lo":"")).join("")}</div><div class="k-note" style="margin-top:6px">Live berechnet: Deckungsgrad nach heutigem Prinzip. Die KI-Einschätzung ist im Prototyp nicht live.</div>`},
   {id:"vg",t:"✉ Vorgänge",n:M.length,hide:!M.length,flush:true,b:K.table(["Vorgang","Absender","Status"],M.map(x=>[`<span class="nm">${esc(x.subj)}</span>`,esc(x.from),stChip(x)]),{rowGo:i=>K.go("vorgang",M[i].id)})},
   {id:"ver",t:"◷ Versionen",n:+t.ver.slice(1),flush:true,b:K.timeline(Array.from({length:+t.ver.slice(1)},(_,i)=>+t.ver.slice(1)-i).map(v=>[v===+t.ver.slice(1)?"ok":"skip","v"+v,v===+t.ver.slice(1)?`<b>Version ${v}</b> · ${esc(t.st)}`:`Version ${v} · abgelöst`,""]))}],
  empty:M.length?["Kommentare"]:["Vorgänge","Kommentare"]})};

V.agenten=()=>{const cur=K.tab("agenten","ag");const SK=Object.keys(SKC);
 const body=cur==="sk"?`<div class="k-card"><div class="k-lh"><b>${SK.length} Skills</b></div>${K.table(["Skill","Beschreibung","Datenstufe","Pflicht-Freigabe","genutzt von"],SK.map(k=>[`<b style="font-family:var(--mono);font-size:12.5px">${k}</b>`,esc(SKC[k][0]),"Stufe "+SKC[k][1],SKC[k][2]?K.chip("ja","warn"):"–",AG.filter(a=>a.sk.includes(k)).map(a=>esc(a.n)).join(", ")||"–"]))}</div>`
 :`<div class="k-card"><div class="k-lh"><b>${AG.length} Agenten</b></div>${K.table(["Agent","Abteilung","Aufgabe","Skills","Rolle","Version","Datenstufe"],AG.map(a=>[`<span class="nm">✦ ${esc(a.n)}</span>`,esc(a.d),esc(a.t),a.sk.length,K.chip(a.r,a.r==="Mitarbeiter"?"":"info"),a.ver,"Stufe "+lv(a)]),{rowGo:i=>K.go("agent",i)})}</div>`;
 return K.pageHead("Agenten & Skills",{chips:[K.chip("Beispieldaten","ex")],actions:K.btn("＋ Agent",'data-toast="Agent anlegen und Skills zuordnen (Prototyp)"',true)})+K.tabs("agenten",[["ag","Agenten",AG.length],["sk","Skills",SK.length]])+body};

V.agent=id=>{const a=AG[+id]||AG[0];const P=[["lesen","Daten in sellify lesen"],["anlegen","Datensätze anlegen und ändern"],["mail","E-Mails versenden"]];
 return K.detail({title:"✦ "+esc(a.n),num:a.ver,chips:[K.chip("Agent"),K.chip(a.r,a.r==="Mitarbeiter"?"":"info"),K.chip("Datenstufe "+lv(a),lv(a)>1?"warn":"")],actions:K.btn("Testlauf",'data-toast="Testlauf im Testsystem gestartet (Prototyp)"')+" "+K.btn("Bearbeiten",'data-toast="Skills und Rechte bearbeiten – neue Version mit Testlauf (Prototyp)"',true),
  cards:[{t:"Steckbrief",b:K.kv([["Abteilung",esc(a.d)],["Aufgabe",esc(a.t)],["KI-Profil",esc(a.prof)+" (Beispiel)"]])},{t:"Zuständig",b:K.person(K.ini(a.resp),a.resp.replace(/ \(.*\)/,""),"Mensch")+`<span class="k-lbl">Ändert die Heimat-Abteilung den Agenten, bekommen betroffene Prozesse einen Testlauf.</span>`},{t:"Rechte",b:K.kv(P.map(([k,l])=>[l,a.p[k]?K.chip("erlaubt","ok"):K.chip("nicht erlaubt")]).concat([["Löschen",K.chip("nie","bad")]]))}],
  sections:[{id:"sk",t:"Skills",n:a.sk.length,flush:true,b:K.table(["Skill","Beschreibung","Datenstufe","Pflicht-Freigabe"],a.sk.map(k=>[`<b style="font-family:var(--mono);font-size:12.5px">${k}</b>`,esc(SKC[k][0]),"Stufe "+SKC[k][1],SKC[k][2]?K.chip("ja","warn"):"–"]))},
   {id:"in",t:"↝ Eingesetzt in",n:a.inn.length,flush:true,b:K.table(["Prozess","Status"],a.inn.map(n=>{const p=PROC.af[pIdx(n)];return [`<span class="nm">${esc(n)}</span>`,p?procChip(p):""]}),{rowGo:i=>{const p=PROC.af[pIdx(a.inn[i])];return p?K.go("prozess",p.id):""}})},
   {id:"daten",t:"Personenbezogene Daten",b:`<div class="abc-perm"><span>Datenstufe aus den Skills</span><b>${LVN2[lv(a)]}</b></div><div class="abc-perm"><span>Außenwirkung (Senden, Schreiben nach außen)</span>${K.chip("Freigabe nötig","warn")}</div><div class="k-note">Die Datenstufe lässt sich je Agent nur verschärfen, nie lockern.</div>`}],
  empty:["Testläufe","Kommentare"]})};

const LIB=[["Lernbeispiele","Vertragsreklamationen (600)","sellify · Dokumentarchiv","Profil Vertragsreklamation","freigegeben"],["Lernbeispiele","Zahlungsklärungen (510)","sellify · Dokumentarchiv","Profil Zahlungsklärung","freigegeben"],["Lernbeispiele","Ablöseanfragen (420)","sellify · Dokumentarchiv","Profil Ablöseanfrage","freigegeben"],["Lernbeispiele","Insolvenzmitteilungen (40)","sellify · Dokumentarchiv","Profil Insolvenzmitteilung","im Anlernen"],["Vorlage","Eingangsbestätigung Reklamation","sellify · E-Mail-Vorlage","Vertragsreklamation bearbeiten","aus sellify"],["Vorlage","Kündigungsbestätigung","sellify · Dokumentvorlage","Kündigung bearbeiten","aus sellify"],["Vorlage","Ablöseangebot","sellify · Dokumentvorlage","Ablöseanfrage beantworten","aus sellify"],["Vorlage","Antwort Rechnungskopie","sellify · E-Mail-Vorlage","Rechnungskopie senden","aus sellify"]];
V.bibliothek=()=>{const cur=K.tab("bibliothek","Alle");const R=LIB.filter(r=>cur==="Alle"||r[0]===cur);
 return K.list({title:"Bibliothek",chips:[K.chip("Beispieldaten","ex")],view:"bibliothek",tabs:[["Alle","Alle",LIB.length],["Lernbeispiele","Lernbeispiele",LIB.filter(r=>r[0]==="Lernbeispiele").length],["Vorlage","Vorlagen",LIB.filter(r=>r[0]==="Vorlage").length]],
  cols:["Art","Name","Quelle","Wofür","Stand"],rows:R.map(r=>[`<span class="pill ${r[0]==="Vorlage"?"p-wait":"p-open"}">${r[0]}</span>`,`<b>${esc(r[1])}</b>`,esc(r[2]),esc(r[3]),esc(r[4])]),note:"Lernbeispiele werden nie versendet"})};

V.anschluesse=()=>K.detail({title:"Anschlüsse",chips:[K.chip("⇄ Einrichtung"),K.chip("Beispieldaten","ex")],cards:[],
 sections:[{id:"an",t:"Anschlüsse",n:CONN.af.length,flush:true,b:K.table(["System","Rolle","Was","Grundaufgaben","Status"],CONN.af.map(c=>[`<b>${esc(c[3])}</b>`,K.chip(c[0]),esc(c[4]),esc(c[5]),c[7]==="Erweiterung"?EXT:`<span class="pill ${c[6]}">${c[7]}</span>`]))},
  {id:"ue",t:"Übergabewege · Verteilung je Dokumenttyp",n:ROUTES.af.length,a:UMD,flush:true,b:K.table(["Dokumenttyp","geht an","Methode","Status"],ROUTES.af.map(r=>[`<b>${esc(r[0])}</b>`,esc(r[1]),esc(r[2]),`<span class="pill ${r[3]}">${esc(r[4])}</span>`]))},
  {id:"hin",t:"Hinweis",b:`<div class="k-note">Neue Anschluss-Rolle „Eingangskanal“: Bisher kennt Company OS nur Systeme, in die es schreibt. Für den Posteingang braucht es eine Quelle, die einen Prozess auslöst. Offen ist, ob die Postfächer direkt angebunden werden oder sellify die Mails abholt und meldet.</div>`}]});

V.ki=()=>K.detail({title:"KI & Daten",chips:[K.chip("⚙ Einrichtung"),K.chip("Beispielwerte","ex")],
 sections:[{id:"haupt",t:"Haupt-KI",b:K.kv([["Haupt-KI","nur von business//acts freigegebene Anbieter wählbar"],["Verarbeitung","in der EU (Annahme)"],["Ausfall","Aufträge pausieren, kein automatischer Wechsel"]])},
  {id:"anb",t:"Anbieter",n:3,flush:true,b:K.table(["Anbieter","Rolle","Profile","Datenstufe","AVV","Budget im Monat"],[["<b>Claude</b>","Haupt-KI","Steuerung, Gründlich prüfen, Texte","2",K.chip("ja","ok"),"180 € / 250 €"],["<b>Mistral</b>","Zusatz","Schnell & günstig","1",K.chip("ja","ok"),"22 € / 60 €"],["<b>Gemini</b>","Zusatz","Bilder","0",K.chip("ja","ok"),"9 € / 40 €"]])},
  {id:"prof",t:"KI-Profile",n:4,flush:true,b:K.table(["Profil","Anbieter","Wofür"],[["<b>Gründlich prüfen</b>","Claude","Dokumenttyp erkennen, Reklamation vorprüfen"],["<b>Schnell & günstig</b>","Mistral","Mail lesen, Kontakt zuordnen"],["<b>Texte</b>","Claude","Antworten, Bestätigungen"],["<b>Bilder</b>","Gemini","–"]])},
  {id:"stufen",t:"Datenstufen",n:3,b:K.kv([["0","ohne Personendaten"],["1","pseudonymisiert – Name, Anschrift, Nummern, Bankdaten werden vor dem Senden entfernt"],["2","personenbezogen – nur mit AVV und passendem Datenstandort"]])+`<div class="k-note" style="margin-top:8px">Harte Regel: Bankverbindungen nie an Zusatz-Anbieter.</div>`}]});

V.setup=()=>K.detail({title:"Setup der Instanz abcfinance",chips:[K.chip("☑ Einrichtung"),K.chip("Beispieldaten","ex")],actions:K.btn("Verbindungstest",'data-toast="Verbindungstest sellify und KI-Anbieter erfolgreich (Prototyp)"',true),
 sections:SETUP.map((s,i)=>({id:"s"+i,t:`${i+1} · ${esc(s[0])}`,b:K.kv(s[1].map(([l,v])=>[esc(l),esc(v)]))}))});

V.abgleich=()=>{const B={v:["ok","vorhanden"],u:["info","Umdeutung"],e:["warn","Erweiterung"],s:["","bleibt in sellify"]};
 const R=[["Postfächer überwachen","Anschluss-Rolle „Eingangskanal“ + Prozess-Start durch Ereignis","e",K.go("anschluesse")],["Mail und Anhänge lesen","Posteingangs-Agent mit Skill postfach-lesen","v",K.go("agent",0)],["Dokumenttypen mit Kennbegriffen","Skill posteingang-einordnen: Kern + Profil je Dokumenttyp","u",K.go("dokumenttypen")],["500–600 Beispieldokumente je Typ","Bibliothek, Art „Lernbeispiele“","u",K.go("bibliothek")],["Deckungsgrad und Schwelle","Entscheidung im Prozess + Feld „Schwelle“ im Profil","e",K.go("dokumenttyp","rek")],["Mensch prüft unsichere Fälle","Mensch-Schritt, Eskalationskette, „Meine Arbeit“","v",K.go("meinearbeit")],["Kontakt und Vertrag zuordnen","Zuordnungs-Agent über den Anschluss sellify","v",K.go("vorgang",4)],["Aufgaben je Dokumenttyp","Folgeprozess je Dokumenttyp","v",K.go("prozesse")],["Arbeitskorb oder Person","Übergabewege je Dokumenttyp","u",K.go("anschluesse")],["Antworten nur nach Freigabe","Freigabe bei Außenwirkung","v",K.go("vorgang",7)],["Lernen aus Korrekturen","Prozess „Dokumenttyp anlernen“, Profil-Versionen","u",K.go("prozess","anl")],["Jede Mail nachvollziehbar","Protokoll auf der Vorgangsseite","e",K.go("vorgang",4)],["Mehrere hundert Mails am Tag","Postfach zweigeteilt, Sammelzahlen, Kennzahlen je Prozess","e",K.go("posteingang")],["Schattenbetrieb","Status „im Test“ + Vergleich mit der alten Regel","u",K.go("projekt","ass")],["Sachbearbeitung im Arbeitskorb","sellify","s",K.go("organigramm")]];
 const n=k=>R.filter(r=>r[2]===k).length;
 return K.detail({title:"ASS-Abgleich",chips:[K.chip("Einschätzung business//acts","ai")],
  cards:[{t:"Ergebnis",b:K.kv([["vorhanden",n("v")],["mit Umdeutung",n("u")],["Erweiterung",n("e")],["bleibt in sellify",n("s")]])},{t:"Einschätzung",b:`<span class="k-note">Es geht ohne eigenes Modul. Nötig sind vier allgemein nützliche Erweiterungen: Start durch Ereignis mit Eingangskanal, Schwelle in der Entscheidung, Protokoll je Auftrag, Sammelansicht mit Kennzahlen.</span>`},{t:"Neu in dieser Fassung",b:`<span class="k-note">Aufbau nach dem Bodo-Muster: Menü, Tagesleiste, Übersichten, Detailseiten mit Sprungmarken, zweigeteiltes Postfach. Alle Seiten kommen aus einem gemeinsamen Kern.</span>`}],
  sections:[{id:"tab",t:"Anforderungen und Bausteine",n:R.length,flush:true,b:K.table(["Anforderung ASS","Baustein in Company OS","Bewertung"],R.map(r=>[`<b>${esc(r[0])}</b>`,esc(r[1]),K.chip(B[r[2]][1],B[r[2]][0])]),{rowGo:i=>R[i][3]})},
   {id:"sim",t:"Was simuliert ist",b:`<div class="k-note">Sicherheit und Begründung der KI sind feste Beispielwerte. Live berechnet wird nur der Deckungsgrad der Kennbegriffe (Dokumenttyp → Ausprobieren). Alle Namen, Mails und Zahlen sind erfunden.</div>`}]})};

V.profil=()=>K.detail({title:esc(ME.n),num:ME.rolle,chips:[K.chip("Beispielperson","ex")],cards:[{t:"Profil",b:K.kv([["Rolle",ME.rolle],["Unternehmen","abcfinance"],["Vertretung","Markus Hahn"]])},{t:"Benachrichtigungen",b:K.kv([["Eskalationen","sofort"],["Sonst","stündlich gebündelt"]])},{t:"Persönlicher KI-Assistent",b:PSK.filter(x=>x[2]).map(x=>K.agent(x[0])).join("")}],sections:[{id:"ein",t:"Einstellungen",b:'<div class="k-note">Morgenübersicht 7:30 in der App · Ruhezeit 20–7 Uhr, Eskalationen ausgenommen.</div>'}]});

/* ---------- Aktionen ---------- */
function onClick(b,d){
 if(d.sel){A.sel=+d.sel;K.refresh();const det=$("#k-det");if(det)det.scrollTop=0;return true}
 if(d.ok){const m=MAILS.find(x=>x.id===+d.ok);const was=m.st;m.st=was==="freigabe"?"done":"auto";K.refresh();K.toast(was==="freigabe"?"Antwort freigegeben – Versand über sellify (Prototyp: nichts ausgeführt)":`Weitergegeben – ${target(T(m.type),m)} (Prototyp)`);return true}
 if(d.fix){const m=MAILS.find(x=>x.id===+d.fix);K.modal(`<h2 style="margin:0;font-size:16px">Anders einordnen</h2><div class="k-note">${esc(m.subj)} · ${esc(m.from)}</div>${TYPES.map(t=>`<button class="k-mi" data-pick="${m.id}|${t.id}"><span>${t.id===m.type?"✓ ":""}<b>${esc(t.n)}</b></span><span class="k-lbl">${esc(target(t))}</span></button>`).join("")}<div class="k-note">Die Korrektur wird als Lernbeispiel für das Profil gespeichert.</div>`);return true}
 if(d.pick){const [id,ty]=d.pick.split("|");const m=MAILS.find(x=>x.id===+id);m.type=ty;m.also=null;m.st="auto";K.modal("");K.refresh();K.toast(`Als ${T(ty).n} weitergegeben · Lernbeispiel gespeichert (Prototyp)`);return true}
 if(d.sug){const [i,s]=d.sug.split("|");SUG[+i].s=s;K.refresh();K.toast(`„${SUG[+i].n}“: ${s} (Prototyp)`);return true}
 if(d.neu!==undefined){onNeu();return true}
 /* Verweise aus den vorbereiteten Antworten des KI-Assistenten */
 if(d.job){if(innerWidth<900)K.chat(false);K.open("vorgang",d.job);return true}
 if(d.area==="jobs"){if(innerWidth<900)K.chat(false);K.open("auftraege");return true}
 if(d.gotag!==undefined){if(innerWidth<900)K.chat(false);K.open("meinearbeit");return true}
 return false}
function onNeu(){K.modal(`<h2 style="margin:0;font-size:16px">Neuer Auftrag</h2><label class="k-lbl" for="abc-nj">Was soll passieren?</label><textarea class="abc-ta" id="abc-nj" style="min-height:70px">Alle offenen Ablöseanfragen dieser Woche auf fehlende Angaben prüfen</textarea><div class="k-lbl">Vorschlag des Agenten</div><button class="k-mi" data-toast="Auftrag gestartet (Prototyp)"><span><b>Einzelaufgabe an den Vertrags-Agenten</b><br><span class="k-lbl">Ergebnis als Liste an Julia Neumann · nichts nach außen</span></span><span>→</span></button><button class="k-mi" data-toast="Prozess gestartet (Prototyp)"><span><b>Prozess „Ablöseanfrage beantworten“ ab Schritt 2</b><br><span class="k-lbl">je Anfrage ein Auftrag</span></span><span>→</span></button>`)}
document.addEventListener("input",e=>{if(e.target.id==="abc-thr"){T(e.target.dataset.thr).thr=+e.target.value;$("#abc-thrv").textContent=e.target.value+" %"}
 if(e.target.id==="abc-test"){A.test=e.target.value;$("#abc-testout").innerHTML=bestRule(A.test).slice(0,4).map(r=>meter(r.t.n,r.pct,r.pct<35?"lo":"")).join("")}});
document.addEventListener("dblclick",e=>{const b=e.target.closest("[data-sel]");if(b)K.open("vorgang",b.dataset.sel)});

/* ---------- Start ---------- */
const nP=()=>MAILS.filter(m=>m.st==="pruefen").length;
K.start({start:"dashboard",neu:"Neuer Auftrag",onNeu,onClick,fuss:"Company OS",badge:"Entwurf v2 · Bodo-Aufbau · Beispieldaten",
 mandant:{name:CO.af.name,rolle:ME.rolle,farbe:CO.af.color,ini:"a",user:ME.ini},
 tagesleiste:()=>`<b>Mo., 12.10.2026</b> <b>14:47</b><span class="sep">·</span><button class="k-tl" ${K.go("meinearbeit")}>Wartet auf dich <span class="k-bdg o">${SESS.filter(s=>s.l==="wait").length}</span></button><span class="sep">·</span><button class="k-tl" ${K.go("posteingang")}>Mensch prüft <span class="k-bdg">${nP()}</span></button><span class="sep wide">·</span><button class="k-tl wide" ${K.go("vorgang",6)}>Eskalation <span class="k-bdg r">1</span></button><span class="sep wide">·</span><span class="wide">Posteingang heute <b>214</b></span>`,
 menu:[{t:"ARBEITSBEREICH",items:[{v:"dashboard",i:"⌂",l:"Dashboard"},{v:"meinearbeit",i:"☰",l:"Meine Arbeit",n:()=>SESS.filter(s=>s.l==="wait").length},{v:"posteingang",i:"✉",l:"Posteingang",n:nP,also:["vorgang"]},{v:"auftraege",i:"▤",l:"Aufträge",n:()=>JOBS.af.length,g:1}]},
  {t:"STEUERUNG",items:[{v:"prozesse",i:"↝",l:"Prozesse",also:["prozess"]},{v:"projekte",i:"▦",l:"Projekte",also:["projekt"]},{v:"organigramm",i:"⌗",l:"Organigramm",also:["abteilung"]}]},
  {t:"WISSEN",items:[{v:"dokumenttypen",i:"◆",l:"Dokumenttypen",also:["dokumenttyp"]},{v:"agenten",i:"✦",l:"Agenten & Skills",also:["agent"]},{v:"bibliothek",i:"▣",l:"Bibliothek"}]},
  {t:"EINRICHTUNG",items:[{v:"anschluesse",i:"⇄",l:"Anschlüsse"},{v:"ki",i:"⚙",l:"KI & Daten"},{v:"setup",i:"☑",l:"Setup"}]},
  {t:"KONZEPT",items:[{v:"abgleich",i:"✓",l:"ASS-Abgleich"}]}],
 views:V,
 ki:{hallo:`Hallo ${ME.n.split(" ")[0]}. Ich kenne Organigramm, Prozesse und Aufträge von abcfinance und arbeite über den Anschluss an sellify – mit euren Freigaberegeln.`,script:SCRIPT,sonst:"Im Prototyp sind nur die vorbereiteten Fragen hinterlegt."},
 suche:()=>MAILS.map(m=>[m.subj+" · "+m.from,"Vorgang",K.go("vorgang",m.id)]).concat(PROC.af.map(p=>[p.n,"Prozess",K.go("prozess",p.id)]),AG.map((a,i)=>[a.n,"Agent",K.go("agent",i)]),TYPES.map(t=>[t.n,"Dokumenttyp",K.go("dokumenttyp",t.id)]),ORG.af.map((d,i)=>[d.n,"Abteilung",K.go("abteilung",i)]),PROJ.af.map(p=>[p.n,"Projekt",K.go("projekt",p.id)]))});
