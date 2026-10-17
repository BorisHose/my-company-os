// ===== KI-Aufträge: Ausführung durch Claude über die geplante Aufgabe „Organigraph – KI-Auftrag ausführen“ (Abo, keine API) =====
// Absender eigener Rückfragen: „Organigraph“, bei älteren Aufträgen noch „Company OS“ (bis v72)
const SYSFROM=f=>f==="Organigraph"||f==="Company OS";
const RUNNERS={schnell:{get tid(){return (SET.trig&&SET.trig.schnell)||"trig_01KVgWuBkveHDgWXWRsLvMjw"},n:"Organigraph – KI-Auftrag ausführen (schnell)",l:"⚡ Schnell (Sonnet)"},gruendlich:{get tid(){return (SET.trig&&SET.trig.gruendlich)||"trig_01ThbM4bYY6h31M3hVDg4fDf"},n:"Organigraph – KI-Auftrag ausführen (gründlich)",l:"🔍 Gründlich (Opus)"}};const RUNNER=j=>RUNNERS[(j&&j.tempo)||"gruendlich"]||RUNNERS.gruendlich;const CCR="Claude Code Remote";
// Aufrufe an die geplanten Aufgaben laufen über dieselbe MCP-Verbindung wie die Adapter (07a-adapter-basis.js)
const ccr=(tool,input)=>mcpRufe(CCR,tool,input,{cache:false},"Claude");
function jobSer(j){const {f,...r}=j;return JSON.stringify({...r,fid:f?f.id:r.fid})}
async function kiFresh(j){if(!DB)return j;try{const o=await Store.get("jobs/"+j.id);if(!o)return j;Object.keys(j).forEach(k=>{if(k!=="f")delete j[k]});Object.assign(j,o);j.f=FL.find(f=>f.id===j.fid);LAST.set("jobs/"+j.id,jobSer(j))}catch(e){}return j}
async function kiReload(quiet){if(!DB)return;try{kiApply(await jobsLaden(),quiet)}catch(e){if(!quiet)toast("Laden nicht möglich")}}
let KISUB=null,KICT=null,KICL=0;function kiCheckSoon(){if(KICT)return;const w=Math.max(3000,20000-(Date.now()-KICL));KICT=setTimeout(()=>{KICT=null;KICL=Date.now();kiCheckRuns()},w)}function kiSubscribe(){if(!DB||KISUB)return;try{KISUB=jobsBeobachten(d=>{try{kiApply(d,true);if(AU.some(j=>j.ki&&j.fired&&j.st==="run"))kiCheckSoon()}catch(e){}},()=>{KISUB=null})}catch(e){KISUB=null}}
function kiApply(docs,quiet){/* docs: einfache Objekte aus Store */const M=new Map(AU.map(j=>[j.id,j])),before=new Map(AU.map(j=>[j.id,j.st+"|"+((j.log||[]).length)]));const IDS=new Set(docs.map(o=>(o||{}).id));const gone=AU.filter(j=>j.ki&&j!==KIEDIT&&!IDS.has(j.id)&&LAST.has("jobs/"+j.id));if(gone.length){AU=AU.filter(j=>!gone.includes(j));gone.forEach(j=>{LAST.delete("jobs/"+j.id);kiGone(j)})}docs.forEach(o0=>{const o=plain(o0);const j=M.get(o.id);if(j&&j===KIEDIT)return;if(j&&!j.ki&&!o.ki)return;if(j){Object.keys(j).forEach(k=>{if(k!=="f")delete j[k]});Object.assign(j,o);j.f=FL.find(f=>f.id===j.fid)}else{o.f=FL.find(f=>f.id===o.fid);AU.unshift(o)}LAST.set("jobs/"+o.id,jobSer(M.get(o.id)||o))});
  KIAT=new Date();const ch=AU.filter(j=>j.ki&&before.has(j.id)&&before.get(j.id)!==j.st+"|"+((j.log||[]).length)&&before.get(j.id).split("|")[0]!==j.st);
  ch.forEach(j=>{KINEW.add(j.id)});if(ch.length){const j=ch[0];toast(j.id+" „"+j.t+"“: "+(j.st==="cancel"?"✕ abgebrochen":j.st==="done"?(j.ok==="nein"?"✗ nicht erledigt":j.ok==="teilweise"?"◐ teilweise erledigt":"✓ erledigt"):j.st==="wait"?"⏸ wartet auf dich":"läuft")+(ch.length>1?" (+"+(ch.length-1)+" weitere)":""))}
  waitCnt();if(!$("#jobs").classList.contains("hide")&&!$("#modal").innerHTML)jobs();avRefresh();setTimeout(()=>planWeiter().catch(()=>{}),0);{const sig=AG.map(a=>runCnt(a.id)).join(",");if(sig!==ORGRUN){ORGRUN=sig;if(!$("#org").classList.contains("hide")&&!isEd("org"))org()}}if(!quiet&&!ch.length)toast("Stand geladen")}
let KIEDIT=null,ORGRUN="";
const KINEW=new Set();
const okTxt=j=>istPlan(j)?["wait","✦ Plan zur Freigabe"]:j.st==="inbox"?["wait","📥 Gesammelt"]:j.st==="cancel"?["no","✕ Abgebrochen"]:j.st==="done"?(j.ok==="nein"?["no","✗ Nicht erledigt"]:j.ok==="teilweise"?["part","◐ Teilweise erledigt"]:["ok","✓ Erledigt"]):j.st==="wait"?["wait","⏸ Wartet auf dich"]:["run","▶ Läuft"];
async function kiAnswer(j,a){await kiFresh(j);const Q=j.q||{};j.ans=[...(j.ans||[]),{q:Q.text||"",a,at:new Date().toISOString()}];j.log.push([now(),""+ICH()+": "+a,1]);delete j.q;kiStart(j,"fortsetzen",{a,q:Q.text,kind:Q.kind,from:Q.from})}
async function kiCancel(j){const F=[...(j.erg||[]).map(e=>e&&e.t).filter(Boolean),...teileVon(j).filter(k=>k&&!isEnd(k)).map(k=>"Teilauftrag "+k.id+" „"+k.t+"“ wird mit abgebrochen")];
  if(!await askOk("Auftrag „"+j.t+"“ abbrechen?","Ja, abbrechen",{text:"Claude führt danach nichts mehr aus. Bereits Angelegtes bleibt bestehen"+(F.length?":":"."),folgen:F,nein:"Weiterlaufen lassen"}))return false;await kiFresh(j);
  j.st="cancel";markDone(j);j.ok="nein";delete j.q;j.log.push([now(),"Auftrag abgebrochen von "+ICH()+"",1]);j.sum=(j.sum?j.sum+" ":"")+"Von "+ICH()+" abgebrochen – nichts weiter ausgeführt.";
  try{await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j))}catch(e){schedule()}
  for(const k of teileVon(j).filter(k=>k&&k.st==="inbox")){k.st="cancel";markDone(k);k.ok="nein";k.log.push([now(),"Mit dem Hauptauftrag "+j.id+" abgebrochen",1]);try{await Store.set("jobs/"+k.id,JSON.parse(jobSer(k)));LAST.set("jobs/"+k.id,jobSer(k))}catch(e){}}
  toast("Auftrag abgebrochen");return true}
// Ergebnis und Details zeigen seit v77 dasselbe Fenster (16a-auftrag-fenster.js)
function resultModal(j){jobView(j)}
let KIAT=null,KITMR=null;
function kiPoll(){clearInterval(KITMR);KITMR=setInterval(()=>{if($("#jobs").classList.contains("hide")||$("#modal").innerHTML)return;if(AU.some(j=>j.ki&&j.st==="run"))kiReload(true).then(kiCheckRuns)},30000)}
function kiContext(j){const f=j.f,L=[];if(!f)return "";const cur=j.path[j.path.length-1],c=nodeOf(f,cur);
  L.push("KONTEXT AUS ORGANIGRAPH (aktuell – nicht erneut aus der Datenbank lesen):");
  const JO=j.org&&orgById(j.org),JA=j.aid&&AG.find(a=>a.id===j.aid),JS=j.sk&&sk(j.sk);
  const JD=j.art==="abteilung"&&j.abt&&dept(j.abt),DA=JD?tlAgents(JO?JO.id:j.org,JD.id,j.team||""):[],JDN=JD?tlName(JO?JO.id:j.org,JD.id,j.team||""):"";
  if(f.frei&&JD)L.push(JA?"ABTEILUNG BEAUFTRAGT – "+JDN+": Der KI-Teamleiter hat „"+JA.n+"“ ("+JA.id+") gewählt. Handle weiter als dieser Agent (Angaben unten) und erledige die Aufgabe direkt; Freigaben vor Außenwirkung wie immer.":"ABTEILUNG BEAUFTRAGT – kein Prozess, "+JDN+": Du bist zuerst KI-TEAMLEITER von "+JDN+". Wähle aus den Agenten unten den EINEN, dessen Ziel, Regeln und Skills am besten zur Aufgabe passen. Im Start-Schreibvorgang zusätzlich aid = ID des gewählten Agenten und einen log-Eintrag „Teamleiter: an <Agentenname>“ mitschreiben, dann als dieser Agent handeln und die Aufgabe erledigen; Freigaben vor Außenwirkung wie immer. Passt keiner oder ist die Wahl unklar: nicht raten, sondern Rückfrage (q, kind „Rückfrage“, from „KI-Teamleiter“) mit den 2–3 passendsten Agenten als Antwortoptionen. Agenten dieser Abteilung: "+(DA.map(a=>a.n+" ("+a.id+")").join(", ")||"keine")+". PLAN STATT EINZELWAHL: Braucht die Aufgabe mehrere Arbeitsschritte oder mehrere Agenten, führe NICHTS aus, sondern schreibe in einem Schreibvorgang plan = {sum: Begründung in 1–3 Sätzen, steps: [{t: Teilauftrag in einem konkreten Satz, aid: Agenten-ID, sk: Skill-Name oder leer, nach: [Nummern der Schritte, die vorher fertig sein müssen, sonst leer]}]} (höchstens 6 Schritte, nur so viele wie nötig; Agenten bevorzugt aus dieser Abteilung, andere Abteilungen nur wenn fachlich nötig – Liste ALLE AGENTEN), st = \"wait\", q = {kind: \"Plan\", from: \"KI-Teamleiter "+JDN+"\", text: je Schritt eine Zeile „n · Agent · Teilauftrag“, why: Begründung, opts: [\"Plan freigeben & starten\"]} und log-Eintrag „Plan erstellt (n Teilaufträge)“ mit 1 – dann Ende. Die Teilaufträge legt der Organigraph nach "+ICH()+"' Freigabe selbst an und startet sie; du legst KEINE weiteren Aufträge in der Datenbank an. Beginnt "+ICH()+"' Antwort mit „Plan ändern:“, den Plan entsprechend neu schreiben (wieder als Plan).");
  if(f.frei&&JD&&!JA){const AO=AG.filter(a=>inOrg(a,JO||j.org));L.push("ALLE AGENTEN der Organisation (nur für Pläne): "+AO.map(a=>a.n+" ("+a.id+", Abteilung "+((dept(PL(a,JO?JO.id:j.org).abt)||{}).n||"ohne")+"): "+String(a.r||"–").slice(0,140)).join(" | "))}
  else if(f.frei)L.push(j.art==="agent"&&JA?"AGENT BEAUFTRAGT – kein Prozess: Handle als Agent „"+JA.n+"“ (Angaben unten) und erledige die Aufgabe direkt."+(JS?"":" Passenden Skill des Agenten selbst wählen.")+" Freigaben vor Außenwirkung wie immer. Den einen Schritt des Systemablaufs nur zum Fortschreiben von path nutzen.":"FREIE AUFGABE – kein Prozess: die Eingabe direkt erledigen (Frage beantworten, recherchieren oder eine einzelne Aktion)."+(JS?"":" Passenden Skill aus dem Konto selbst wählen.")+" Freigaben vor Außenwirkung wie immer.");
  if(JS)L.push("SKILL VERWENDEN: „"+JS.n+"“ – im Konto: "+(KS(JS).join(", ")||"nur im Cockpit, kein Konto-Skill")+(JS.d?" · "+JS.d:""));
  if(j.prj&&pj(j.prj))L.push(pjKontext(j));
  {const dk=dienstKontext(JO);if(dk)L.push(dk)}
  if(JO)L.push("Organisation des Auftrags: "+JO.n+(JO.prod?" (Produkt "+PN[JO.prod]+")":""));
  L.push("Auftrag "+j.id+": "+(j.t||"")+(j.in?"\nEingabe von "+ICH()+": "+j.in:""));
  if(j.prio&&j.prio!=="n"||j.due)L.push("Priorität des Auftrags: "+((PRIO.find(p=>p[0]===(j.prio||"n"))||[])[1]||"Normal")+(j.due?" · Fällig bis: "+new Date(j.due+"T12:00").toLocaleDateString("de-DE"):""));
  const seen=new Set(),order=[];(function walk(id){if(seen.has(id))return;seen.add(id);const n=nodeOf(f,id);if(!n)return;order.push(n);f.E.filter(e=>e.f===id&&!e.back).forEach(e=>walk(e.t))})((f.N.find(n=>n.type==="start")||{}).id);
  L.push("Ablauf „"+f.n+"“ ("+f.id+"), Schritte: "+order.map(n=>n.id+" "+n.type+(n.type==="task"?" ["+(n.a?.n||(n.free?"Claude – frei, kein fester Agent: direkt mit "+ICH()+"' Vorgaben handeln":"?"))+(n.sk?" · SKILL VERWENDEN: "+skLbl(n)+" ("+(sk(n.sk)?(KS(sk(n.sk)).join(", ")||"nur im Cockpit, kein Konto-Skill"):n.sk)+")"+(skOk(n)?"":" – Achtung: Skill ist dem Agenten nicht mehr zugeordnet"):"")+": "+(n.t||"–")+(n.o?" → "+n.o:"")+"]":n.label?" ["+n.label+"]":"")).join(" | "));
  L.push("Verbindungen: "+f.E.map(e=>e.f+">"+e.t+(e.l?" ("+e.l+")":"")+(e.back?" ↩":"")).join(", "));
  L.push("Aktueller Knoten: "+(c?c.id+" "+nlabel(c):cur)+" · path bisher: "+j.path.join(","));
  const A=[...new Set(f.N.filter(n=>n.type==="task"&&n.a).map(n=>n.a).concat(JA?[JA]:[],JA?[]:DA))];
  A.forEach(a=>L.push("Agent „"+a.n+"“ ("+a.id+", Produkt "+PN[a.p]+"): Ziel: "+(a.r||"–")+(a.own&&a.own.length?" · Regeln: "+a.own.join("; "):"")+" · Skills: "+a.s.map(id=>sk(id)?sk(id).n+" ["+(KS(sk(id)).join(", ")||"nur Cockpit")+"]":id).join(", ")+(a.mcp&&a.mcp.length?" · Systeme: "+a.mcp.join(", "):"")));
  if((j.anh||[]).length)L.push("ANHÄNGE – "+j.anh.length+" Bild(er) von "+ICH()+", gehören zum Auftrag und sind für die Aufgabe maßgeblich: "+j.anh.map((a,i)=>"Bild "+(i+1)+" „"+a.name+"“ ("+a.w+"×"+a.h+"): Sammlung anhaenge, Dokumente "+Array.from({length:a.n},(_,k)=>a.aid+"_"+k).join(", ")).join(" | ")+". So lesen: die Dokumente mit ArtifactData get (out_dir) holen, Feld data in Reihenfolge i aneinanderhängen, Base64 zu einer .jpg-Datei dekodieren und mit Read ansehen.");
  if(GLOBAL.length)L.push("Allgemeine Vorgaben: "+GLOBAL.join("; "));
  adapterListe().filter(a=>a.mand).forEach(a=>L.push("Eigene "+a.n+"-Mandanten (orgId): "+a.mandanten().map(o=>o.name+" = "+o.id).join("; ")+"."));
  L.push("Organisationen: "+ORGS().map(o=>o.n+(o.prod?" → Produkt "+PN[o.prod]:"")).join("; "));
  return L.join("\n")}
function kiStart(j,mode,ans){const R=RUNNER(j),cut=(s,n)=>(s=String(s||"")).length>n?s.slice(0,n)+" …":s;
  const text="Auftrag "+j.id+" "+mode+"\nPROTOKOLL: "+PV+(j.vorab?"\nVORAB-FREIGABE: ja (einfache CRM-Anlagen ohne Rückfrage, wenn eindeutig)":"")+"\n\n"+kiContext(j)+(ans?".\n\nAntwort von "+ICH()+""+(ans.kind?" auf die "+ans.kind:"")+(ans.from?" von "+ans.from:"")+":\n"+ans.a+(ans.q?"\n\nSie bezieht sich auf:\n"+cut(ans.q,2500):""):"");
  const close=()=>{};toast(mode==="starten"?"Claude-Sitzung wird gestartet …":"Wird mit deiner Antwort fortgesetzt …");
  (async()=>{
    j.log.push([now(),mode==="starten"?"Claude-Sitzung angefordert":"Fortsetzung angefordert"]);j.st="run";j.ki=1;j.pv=PV;j.fired=new Date().toISOString();delete j.run;jobs();
    try{await anhSave(j);await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j));const chk=await Store.get("jobs/"+j.id);if(!chk)throw {message:"Auftrag konnte nicht gespeichert werden"}}
    catch(e){j.log.push([now(),"Nicht gestartet – Auftrag nicht gespeichert: "+((e&&e.message)||(e&&e.code)||"unbekannt"),1]);close();jobs();return toast("Auftrag konnte nicht gespeichert werden – Claude wurde nicht gestartet")}
    try{await ccr("fire_trigger",{trigger_id:R.tid,text});close();toast("Claude startet – Verlauf erscheint hier in 1–2 Minuten");jobs();kiPoll()}
    catch(e){j.log.push([now(),"Start fehlgeschlagen: "+((e&&e.message)||(e&&e.code)||"unbekannt"),1]);schedule();close();jobs();
      toast(e&&(e.code==="not_granted"||e.code==="server_not_connected")?"Claude-Anbindung nicht erlaubt – im Menü der Seite unter Berechtigungen freigeben":"Start fehlgeschlagen – Details im Verlauf")}})()}
async function kiCheckRuns(){const P=AU.filter(j=>j.ki&&j.fired&&!Array.isArray(j.teile)&&(!(j.run&&j.run.done)||j.st==="run"));if(!P.length)return;
  let TL;try{const p=await ccr("list_triggers",{limit:50});TL=(p&&p.data)||[]}catch(e){return}
  for(const j of P){const lr=(TL.find(x=>x.id===RUNNER(j).tid)||{}).last_run;if(!lr||!lr.fired_at)continue;
    const lf=Date.parse(lr.fired_at),sid=lr.session_id||"",url=sid?"https://claude.ai/code/session_"+sid.replace(/^cse_/,""):"";
    if(lf<Date.parse(j.fired)-15000)continue;{const sx=sid.replace(/^cse_/,""),mine=!!sx&&(j.sess||[]).some(s=>(s.url||"").includes(sx)),later=AU.some(x=>x!==j&&x.ki&&x.fired&&RUNNER(x).tid===RUNNER(j).tid&&Date.parse(x.fired)>Date.parse(j.fired));if(later&&!mine)continue}await kiFresh(j);const fin=!!lr.finished_at,ok=/SUCCEEDED/.test(lr.status||""),prev=JSON.stringify(j.run||null),stPrev=j.st;
    j.run={sid,url,status:lr.status||"",fin:lr.finished_at||null,done:fin};
    if(fin&&Date.now()-Date.parse(lr.finished_at)<20000){j.run.done=false;continue}
    const wrote=(j.sess||[]).some(s=>s.at&&Date.parse(s.at)>=Date.parse(j.fired)-15000);
    if(fin&&j.st==="run"){j.st="wait";if(!wrote)j.sess=[...(j.sess||[]),{url,at:lr.fired_at,art:"ohne Rückmeldung"}];
      j.log.push([now(),(!ok?"⚠ Claude-Sitzung fehlgeschlagen ("+(lr.failure_reason||lr.status||"?")+")":wrote?"⚠ Claude-Sitzung beendet, bevor sie den Auftrag abgeschlossen hat":"⚠ Claude-Sitzung beendet, ohne den Auftrag zu aktualisieren")+" – Sitzung öffnen und Ergebnis im Zielsystem prüfen",1]);
      j.q={kind:"Rückfrage",from:"Organigraph",text:(wrote?"Die Claude-Sitzung hat angefangen, ist aber beendet, ohne das Ende des Auftrags einzutragen. Möglicherweise wurde die Aktion trotzdem ausgeführt – bitte im Zielsystem prüfen.":"Die Claude-Sitzung ist beendet, hat aber nichts in diesen Auftrag geschrieben.")+" Was dort passiert ist, siehst du in der Sitzung (Link unter „Claude-Sitzungen“).",why:"Sitzung beendet, Auftrag nicht abgeschlossen.",opts:["Erneut anstoßen: Stand prüfen und Auftrag abschließen","Ich prüfe das selbst"]}}
    if(JSON.stringify(j.run)===prev&&j.st===stPrev)continue;
    try{const pat=j.st==="wait"&&j.q&&SYSFROM(j.q.from)?{run:j.run,st:j.st,q:j.q,log:j.log,sess:j.sess||[]}:{run:j.run};await Store.update("jobs/"+j.id,pat);LAST.set("jobs/"+j.id,jobSer(j))}catch(e){}}
  if(!$("#jobs").classList.contains("hide"))jobs()}
async function kiRuns(){try{const p=await ccr("list_triggers",{limit:50,include_completed:false});const L=(p&&p.data)||[];const out=Object.values(RUNNERS).map(R=>{const t=L.find(x=>x.id===R.tid);if(!t)return R.l+": nicht gefunden";const r=t.last_run;return R.l+": "+(r?(String(r.status||"?").replace("ROUTINE_RUN_STATUS_","").toLowerCase())+" · "+(r.fired_at?new Date(r.fired_at).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"}):""):"noch kein Lauf")});toast(out.join("  |  "))}catch(e){toast("Abfrage nicht möglich: "+((e&&e.message)||(e&&e.code)||""))}}
function doneAt(j){if(j.fertig)return new Date(j.fertig);const L=j.log||[];for(let i=L.length-1;i>=0;i--){const m=/^(\d\d)\.(\d\d)\.\s+(\d\d):(\d\d)/.exec(L[i][0]||"");if(m){const n=new Date();let d=new Date(n.getFullYear(),+m[2]-1,+m[1],+m[3],+m[4]);if(d-n>864e5)d.setFullYear(d.getFullYear()-1);return d}}
  const r=j.run&&j.run.fin||((j.sess||[]).slice(-1)[0]||{}).at||j.fired;return r?new Date(r):new Date(0)}
function dayBucket(d){const t=new Date();t.setHours(0,0,0,0);const y=new Date(t-864e5),mo=new Date(t);mo.setDate(t.getDate()-((t.getDay()+6)%7));const lw=new Date(mo);lw.setDate(mo.getDate()-7);
  if(d>=t)return 0;if(d>=y)return 1;if(d>=mo)return 2;if(d>=lw)return 3;return 4}
const KGRP=["Heute","Gestern","Diese Woche","Letzte Woche","Älter"];
function doneTxt(j){const d=doneAt(j);if(!+d)return "erledigt";const k=dayBucket(d),hm=d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
  return '<span title="Als erledigt gekennzeichnet am '+d.toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"})+' um '+hm+' Uhr">'+(j.st==="cancel"?"✕ abgebrochen ":"✓ erledigt ")+(k===0?"heute":k===1?"gestern":d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}))+", "+hm+' Uhr</span>'}
function waitCnt(){const w=AU.filter(j=>j.st==="wait"&&j.f).length,e=$("#wcnt");if(e){e.textContent=w||"";e.style.display=w?"":"none"}const f=$("#kifab .n");if(f){f.textContent=w||"";f.style.display=w?"":"none"}}
// Endzustände: done (fertig) und cancel (abgebrochen). Beim Ende werden Datum, Tag und Monat für Filter und Archiv gesetzt.
const PV=2,isEnd=j=>!!j&&(j.st==="done"||j.st==="cancel");
const berlinTag=d=>new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Berlin"}).format(d);
function endFelder(j){if(!j.fertig||!+new Date(j.fertig)){const d=doneAt({...j,fertig:null});j.fertig=(+d?d:new Date()).toISOString()}j.fTag=berlinTag(new Date(j.fertig));j.fMon=j.fTag.slice(0,7);return j}
function markDone(j){j.fertig=new Date().toISOString();endFelder(j)}
// Auftrag fehlt in beiden Abfragen: nachsehen statt löschen. Erledigt ohne Datum → Datum nachtragen, dann erscheint er wieder.
async function kiGone(j){try{const o=await Store.get("jobs/"+j.id);if(o&&isEnd(o)&&!o.fTag){endFelder(o);await Store.update("jobs/"+j.id,{fertig:o.fertig,fTag:o.fTag,fMon:o.fMon})}}catch(e){}}
const KOPEN=new Set();
const LOGSKIP0=/^(KI-Auftrag angelegt|Auftrag gestartet|Claude-Sitzung (angefordert|gestartet)|Fortsetzung angefordert|Boris:|Auftrag fertig|fertig$|weiter:|↩)/;
const LOGSKIP={test:t=>LOGSKIP0.test(t)||String(t).startsWith(ICH()+": ")};
function flowOrder(f){const seen=new Set(),o=[];(function w(id){if(seen.has(id))return;seen.add(id);const n=nodeOf(f,id);if(!n)return;o.push(n);f.E.filter(e=>e.f===id&&!e.back).forEach(e=>w(e.t))})((f.N.find(n=>n.type==="start")||{}).id);return o}
function jobSteps(j){const L=[];
  if(j.f&&!j.f.frei){const O=flowOrder(j.f).filter(n=>n.type==="task"||n.type==="human"),cur=j.path[j.path.length-1],idx=O.findIndex(n=>n.id===cur);
    O.forEach((n,i)=>{const lab=n.type==="human"?(n.label||"Deine Entscheidung"):(n.t||nlabel(n));const st=isEnd(j)||(j.path.includes(n.id)&&n.id!==cur)||(idx>=0&&i<idx)?"done":n.id===cur?"now":"todo";L.push([lab,st])});
    if(L.length>5){const k=Math.max(0,L.findIndex(x=>x[1]!=="done")-2);return L.slice(k,k+5)}return L}
  const lg=(j.log||[]).filter(x=>x&&x[1]&&!LOGSKIP.test(x[1])&&!/^(Freigabe nötig|Rückfrage)/.test(x[1])).map(x=>x[1].replace(/^[^:]{2,40}: /,"")).slice(-3);
  lg.forEach(t=>L.push([t.length>70?t.slice(0,68)+"…":t,"done"]));
  if(!L.length&&!isEnd(j))L.push(["Auftrag verstanden",j.st==="run"&&!(j.sess||[]).length?"now":"done"]);
  if(j.st==="wait")L.push([j.q&&j.q.kind==="Rückfrage"?"Deine Antwort":"Deine Zustimmung","now"],["Abschließen","todo"]);
  else if(j.st==="run")L.push(["In Arbeit …","now"],["Abschließen","todo"]);
  else L.push([j.ok==="nein"?"Nicht abgeschlossen":"Abgeschlossen",j.ok==="nein"?"bad":"done"]);
  return L}
function jobWho(j){let a=null;if((j.art==="agent"||j.art==="abteilung")&&j.aid)a=AG.find(x=>x.id===j.aid);else if(j.art==="abteilung")return {n:"✦ KI-Teamleiter",u:null,sub:tlName(jobOrg(j),j.abt,j.team||"")};else if(j.f&&!j.f.frei){const c=curN(j);a=c&&c.a||(j.f.N.find(n=>n.type==="task"&&n.a)||{}).a||null}
  return a?{n:a.n,u:usr(a.owner),sub:"digitaler Mitarbeiter"}:{n:"Claude direkt",u:null,sub:"ohne festen Agenten"}}
function jobCard(j){const W=jobWho(j),comp=!KOPEN.has(j.id),[oc,ot]=okTxt(j),neu=KINEW.has(j.id);
  const stTxt=isEnd(j)?`<span class="kst ${oc}">${doneTxt(j)}</span>`:j.st==="wait"?'<span class="kst wait">wartet auf dich</span>':'<span class="kst run"><i class="pulse"></i>läuft</span>';
  const badges=`${j.ki?'<span class="kib2" title="Wird von Claude ausgeführt – '+esc(RUNNER(j).l)+'">KI'+(j.tempo==="schnell"?" ⚡":"")+'</span>':''}${(j.anh||[]).length?' <span title="'+j.anh.length+' Bild(er) angehängt">📎'+j.anh.length+'</span>':''}${j.vorab?' <span class="badge" title="Einfache CRM-Anlagen ohne Rückfrage, wenn eindeutig">vorab</span>':''}${(j.sess||[]).some(s=>s.art==="ohne Rückmeldung")&&j.st==="wait"?' <span title="Sitzung ohne Rückmeldung">⚠</span>':''}${j.beispiel?' <span class="badge neu">Beispiel</span>':''}`;
  const head=`<div class="khd"><span>${esc(j.id)} · ${esc(jobLbl(j))}</span>${stTxt}</div>
    <div class="kwho">${av(W.u,40,1)}<div><b>${esc(j.t||"Auftrag")} ${badges}</b><small>${esc(W.n)} · ${W.u?"verantwortlich: "+esc(W.u.n):esc(W.sub)}${pj(j.prj)?` · <span class="pjchip">▣ ${esc(pj(j.prj).n)}</span>`:""}</small></div></div>`;
  const stamp=isEnd(j)&&neu&&j.ok!=="nein"?'<div class="kstamp" aria-hidden="true">ERLEDIGT</div>':"";
  const qt=j.in?`<div class="kq"><span>„${esc(mdText(j.in))}“</span></div>`:"";
  if(comp){let line="",btn="";
    if(isEnd(j)){line=`<div class="kmini ${oc}">${esc((j.sum||"").split(/(?<=[.!?])\s/)[0]||ot)}</div>`;btn=(j.erg||[]).length||j.ki?`<button class="btn sm" data-res="${j.id}">Ergebnis ansehen${(j.erg||[]).length?" ("+j.erg.length+")":""}</button>`:""}
    else if(j.st==="wait"){const fl=(j.q&&j.q.text||"").split("\n").map(x=>x.trim()).filter(Boolean),ln=fl.find(x=>!/^(entwurf|freigabe|rückfrage)/i.test(x))||fl[0]||"";line=`<div class="kmini wait"><b>${esc(j.q&&j.q.kind==="Rückfrage"?"Rückfrage":"Zustimmung")}:</b> ${esc(ln)}</div>`;btn=`<button class="btn sm p" data-res="${j.id}">${j.q&&j.q.kind==="Rückfrage"?"Antworten":"Prüfen & freigeben"}</button>`}
    else{const l=(j.log||[]).slice(-1)[0];line=`<div class="kmini run"><b>Arbeitet:</b> ${esc(l?l[1]:"Sitzung startet …")}</div>`}
    return `<div class="jcard kc compact ${neu?'neu':''}" data-j="${j.id}">${head}${isEnd(j)?"":qt}${line}<div class="kact">${btn}<button class="lnk" data-kx="${j.id}" aria-expanded="false">Details ▾</button></div>${stamp}</div>`}
  const S=jobSteps(j);
  const steps=`<ul class="ksteps">${S.map(([t,st])=>`<li class="${st}"><span class="d">${st==="done"?"✓":st==="now"?(j.st==="wait"?"!":"•"):st==="bad"?"✗":""}</span>${esc(t)}</li>`).join("")}</ul>`;
  let box="";
  if(j.st==="wait"){const first=(j.q&&j.q.text||"").split("\n").map(x=>x.trim()).filter(Boolean);const ln=first.find(x=>!/^(entwurf|freigabe|rückfrage)/i.test(x))||first[0]||"";
    box=`<div class="kbox wait"><b>${esc(j.q?(j.q.kind==="Rückfrage"?"Rückfrage an dich":"Deine Zustimmung"):"Wartet auf dich")}</b><div>${esc(ln.length>110?ln.slice(0,108)+"…":ln)}</div><div class="kact"><button class="btn sm p" data-res="${j.id}">${j.q&&j.q.kind==="Rückfrage"?"Antworten":"Prüfen & freigeben"}</button><button class="lnk" data-kx="${j.id}" aria-expanded="true">Weniger ▴</button></div></div>`}
  else if(j.st==="run"){const l=(j.log||[]).slice(-1)[0];box=`<div class="kbox run"><b>Arbeitet gerade</b><div>${esc(l?l[1]:"Sitzung startet …")}</div><div class="kact"><button class="lnk" data-kx="${j.id}" aria-expanded="true">Weniger ▴</button></div></div>`}
  else box=`<div class="kbox ${oc}"><b>${esc(ot.replace(/^[^ ]+ /,""))}</b><div>${esc(j.sum||"")}</div>${(j.erg||[]).filter(e=>e&&/^https?:\/\//.test(e.url||"")).length?`<div class="klinks">${j.erg.filter(e=>e&&/^https?:\/\//.test(e.url||"")).map(e=>`<a class="kopen" href="${esc(e.url)}" target="_blank" rel="noopener" title="${esc(e.url)}">↗ Öffnen: ${esc(e.t||"Ergebnis")}</a>`).join("")}</div>`:""}<div class="kact"><button class="btn sm" data-res="${j.id}">Ergebnis ansehen${(j.erg||[]).length?" ("+j.erg.length+")":""}</button><button class="lnk" data-kx="${j.id}" aria-expanded="true">Weniger ▴</button></div></div>`;
  return `<div class="jcard kc ${neu?'neu':''}" data-j="${j.id}">${head}${qt}${steps}${box}${stamp}</div>`}
function jobs(){
  $("#kirun").innerHTML=`<span class="dot ${mcpBereit()?'':'off'}"></span><span>Ausführung durch Claude über geplante Aufgaben – <b>⚡ schnell</b> (Sonnet) oder <b>🔍 gründlich</b> (Opus), Sitzungen in deinem Abo${KIAT?" · Stand von "+KIAT.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):""}</span><span style="flex:1"></span><button class="btn sm" id="kirl">⟳ Stand laden</button><button class="btn sm" id="kiruns">Letzten Lauf prüfen</button>`;
  $("#kirl").onclick=()=>kiReload().then(kiCheckRuns);$("#kiruns").onclick=kiRuns;
  const ex=AU.filter(j=>j.beispiel).length;$("#exjobs").innerHTML=ex?`<span class="mark">${ex} Beispiel-Aufträge</span> <button class="btn sm" id="delEx">Beispiele löschen</button>`:"";
  const de=$("#delEx");if(de)de.onclick=async()=>{if(await askOk("Alle "+ex+" Beispiel-Aufträge löschen?")){AU=AU.filter(j=>!j.beispiel);jobs();schedule()}};
  const col=(st,title,cls,LL)=>{const L=LL?LL.flat():AU.filter(j=>j.st===st&&j.f);const cards=L.map(jobCard).join("");return LL?cards:`<div class="kcol ${cls||''}"><h3>${title} <span class="badge">${L.length}</span></h3>${cards||'<div class="hint">–</div>'}</div>`};
  const DM=UI.kidone||"heute",DN=AU.filter(j=>isEnd(j)&&j.f),DH=DN.filter(j=>dayBucket(doneAt(j))===0).length;
  const NIB=AU.filter(j=>j.st==="inbox").length;
  $("#kfilt").innerHTML=(NIB?`<button class="btn sm" id="kiinbox" title="Gesammelte Aufgaben im Eingang">📥 ${NIB} gesammelt</button>`:"")+`<span>Erledigte:</span><div class="seg">${[["alle","Alle anzeigen",DN.length],["heute","Nur heute erledigt",DH],["aus","Ausblenden",""]].map(([k,l,n])=>`<button data-kd="${k}" class="${DM===k?'on':''}">${l}${n!==""?'<span class="n">'+n+'</span>':''}</button>`).join("")}</div>${DM!=="alle"&&DN.length>(DM==="heute"?DH:0)?`<span class="hint">${DM==="heute"?(DN.length-DH)+" ältere erledigte":DN.length+" erledigte"} ausgeblendet</span>`:""}`;
  document.querySelectorAll("[data-kd]").forEach(b=>b.onclick=()=>{UI.kidone=b.dataset.kd;saveUI();jobs()});
  const kib=$("#kiinbox");if(kib)kib.onclick=()=>avOpen({tab:"offen",st:"inbox"});
  const card=g=>col(null,null,null,[g]);
  let doneCol="";
  if(DM!=="aus"){const G=[[],[],[],[],[]];DN.map(j=>[doneAt(j),j]).sort((a,b)=>b[0]-a[0]).forEach(([d,j])=>{const k=dayBucket(d);if(DM==="alle"||k===0)G[k].push(j)});
    const n=G.reduce((s,g)=>s+g.length,0);
    doneCol=`<div class="kcol"><h3>✓ Erledigt${DM==="heute"?" heute":""} <span class="badge">${n}</span></h3>${G.map((g,k)=>!g.length?"":(DM==="heute"?"":`<div class="kgrp">${KGRP[k]} <span class="badge">${g.length}</span>${k===4?`<button class="btn sm" id="kiold">${UI.kiold?"zuklappen":"aufklappen"}</button>`:""}</div>`)+(k===4&&!UI.kiold?"":card(g))).join("")||'<div class="hint">'+(DM==="heute"?"Heute noch nichts erledigt.":"–")+'</div>'}</div>`}
  $("#kb").className="kb"+(DM==="aus"?" two":"");
  $("#kb").innerHTML=col("wait","⏸ Wartet auf dich","wait")+col("run","▶ Läuft")+doneCol;
  const ko=$("#kiold");if(ko)ko.onclick=()=>{UI.kiold=!UI.kiold;saveUI();jobs()};
  document.querySelectorAll("[data-kx]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();const id=b.dataset.kx;KOPEN.has(id)?KOPEN.delete(id):KOPEN.add(id);jobs()});
  document.querySelectorAll("[data-j]").forEach(e=>e.onclick=ev=>{if(ev.target.closest("[data-res],[data-kx],a"))return;const j=AU.find(x=>x.id===e.dataset.j);KINEW.delete(j.id);if(j.ki)kiFresh(j).then(()=>resultModal(j));else jobModalK(j)});
  document.querySelectorAll("[data-res]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();resultModal(AU.find(j=>j.id===b.dataset.res))});
  waitCnt();
}
async function jobModalK(j){if(j.ki)await kiFresh(j);jobModal(j)}
function jobModal(j){jobView(j)}
$("#newJ").onclick=()=>{if(blocked())return;startModal(null)};$("#kifab").onclick=()=>{if(blocked())return;startModal(null)};
$("#newF").onclick=()=>{if(blocked())return;const a=AG.find(x=>x.p===FF)||AG[0];
  FL.push({id:uid("fl"),n:"Neuer Ablauf",p:FF,goal:"",start:"",nt:NTD(),rec:"manuell",N:[{id:nid(),type:"start",x:20,y:120,label:"Start"}],E:[]});
  const f=FL[FL.length-1],t={id:nid(),type:"task",x:110,y:108,a,t:"",o:"",ho:[1,1,1,1]},e={id:nid(),type:"end",x:340,y:120,label:"Ergebnis an dich"};
  f.N.push(t,e);f.E.push({f:f.N[0].id,t:t.id,l:""},{f:t.id,t:e.id,l:""});fcur=FL.length-1;startEdit("flow",f.id,null,["flows/"+f.id],true);SEL=null;flows();$("#fn").focus();$("#fn").select()};

const AGRP=["build","skills","matrix"];
function show(v){if(v==="users"){UI.sets="users";v="settings"}if(v==="agrp")v=AGRP.includes(UI.agv)?UI.agv:"build";if(EDIT&&!$("#"+v).classList.contains("hide"))return;if(blocked())return;document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("on",x.dataset.v===v||(x.dataset.v==="agrp"&&AGRP.includes(v))));
  {agMenu(false);$("#agmenu").querySelectorAll("[data-sv]").forEach(b=>{const on=b.dataset.sv===v;b.classList.toggle("on",on);b.setAttribute("aria-checked",on?"true":"false")});if(AGRP.includes(v)&&UI.agv!==v){UI.agv=v;saveUI()}}
  ["build","matrix","flows","jobs","projects","org","skills","settings"].forEach(id=>$("#"+id).classList.toggle("hide",id!==v));{const g=$("#gear");if(g)g.classList.toggle("on",v==="settings")}if(v==="settings")einst();
  if(v==="skills")lib();
  if(v==="org")org();
  if(v==="projects")prj();
  if(v==="build"||v==="matrix")render()
  if(v==="flows")flows();if(v==="jobs"){jobs();if(AU.some(j=>j.ki))kiReload(true).then(kiCheckRuns);kiPoll()}}
// Menü „Agenten ▾“: Klick öffnet eine Auswahlliste (Agenten · Skills · Matrix) unter dem Knopf
function agMenu(auf){const m=$("#agmenu"),b=$("#agbtn");if(!m||!b)return;if(auf==null)auf=m.hidden;
  if(auf){const r=b.getBoundingClientRect();m.style.top=Math.round(r.bottom+6)+"px";m.style.left=Math.round(Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8,innerWidth-188)))+"px";m.hidden=false;b.setAttribute("aria-expanded","true");(m.querySelector(".on")||m.querySelector("button")).focus()}
  else{m.hidden=true;b.setAttribute("aria-expanded","false")}}
document.querySelectorAll("nav button[data-v]").forEach(b=>b.onclick=e=>{if(b.dataset.v==="agrp"){e.stopPropagation();agMenu();return}show(b.dataset.v)});
document.querySelectorAll("#agmenu [data-sv]").forEach(b=>b.onclick=e=>{e.stopPropagation();agMenu(false);show(b.dataset.sv);$("#agbtn").focus()});
document.addEventListener("click",e=>{const m=$("#agmenu");if(m&&!m.hidden&&!m.contains(e.target))agMenu(false)});
document.addEventListener("keydown",e=>{const m=$("#agmenu");if(!m||m.hidden)return;const L=[...m.querySelectorAll("button")],i=L.indexOf(document.activeElement);
  if(e.key==="Escape"){e.preventDefault();agMenu(false);$("#agbtn").focus()}else if(e.key==="ArrowDown"){e.preventDefault();L[(i+1)%L.length].focus()}else if(e.key==="ArrowUp"){e.preventDefault();L[(i-1+L.length)%L.length].focus()}else if(e.key==="Tab")agMenu(false)});
addEventListener("resize",()=>agMenu(false));
document.querySelector("nav").addEventListener("scroll",()=>agMenu(false),{passive:true});
