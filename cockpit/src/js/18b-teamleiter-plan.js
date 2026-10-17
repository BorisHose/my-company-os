// ===== KI-Teamleiter: Plan mit mehreren Teilaufträgen (Etappe 3) =====
// Der Teamleiter (Claude-Sitzung) schreibt in den Auftrag plan = {sum, steps:[{t, aid, sk, nach:[Schrittnummern]}]} und q.kind = "Plan".
// Nach Boris' Freigabe legt das Cockpit je Schritt einen Teilauftrag an (art "agent", parent, nach = Auftragsnummern),
// startet Schritte ohne Vorgänger sofort und die übrigen, sobald ihre Vorgänger erledigt sind. Der Hauptauftrag endet, wenn alle Teile enden.
const istPlan=j=>!!(j&&j.st==="wait"&&j.q&&j.q.kind==="Plan"&&j.plan&&Array.isArray(j.plan.steps)&&j.plan.steps.length);
const teileVon=p=>(p.teile||[]).map(id=>AU.find(x=>x.id===id));
function leitungTxt(did){const d=dept(did),u=d&&usr(d.lead);return u?u.n:"Boris (Leitung offen)"}
function planHtml(j){const P=j.plan,S=P.steps,o=jobOrg(j),AGO=AG.filter(a=>inOrg(a,o)),nA=new Set(S.map(s=>s.aid)).size;
  const opt=s=>{const D=deptsOf(o);return D.map(d=>{const L=AGO.filter(a=>PL(a,o).abt===d.id);return L.length?`<optgroup label="${esc(d.n)}">${L.map(a=>`<option value="${a.id}" ${a.id===s.aid?"selected":""}>${esc(a.n)}</option>`).join("")}</optgroup>`:""}).join("")+
    (AGO.some(a=>!PL(a,o).abt)?`<optgroup label="Ohne Abteilung">${AGO.filter(a=>!PL(a,o).abt).map(a=>`<option value="${a.id}" ${a.id===s.aid?"selected":""}>${esc(a.n)}</option>`).join("")}</optgroup>`:"")+
    (s.aid&&!AGO.some(a=>a.id===s.aid)?`<option value="${esc(s.aid)}" selected>⚠ unbekannter Agent (${esc(s.aid)})</option>`:"")};
  return `<div class="plbox"><div class="plh"><span class="plic">✦</span><b>KI-Teamleiter ${esc(tlName(jobOrg(j),j.abt,j.team||"").replace(/^Abteilung /,""))} schlägt vor: ${S.length} Teilauftr${S.length===1?"ag":"äge"} an ${nA} Agent${nA===1?"":"en"}</b></div>
    ${S.map((s,i)=>{const a=AG.find(x=>x.id===s.aid),fremd=a&&j.abt&&PL(a,o).abt&&PL(a,o).abt!==j.abt;
      return `<div class="plstep">${av(a&&usr(a.owner),36,1)}<div class="plt"><div class="plrow"><b>${i+1}</b><select data-plag="${i}" aria-label="Agent für Schritt ${i+1}">${opt(s)}</select></div>
        <div>${esc(s.t||"")}${(s.nach||[]).length?` <span class="hint" style="margin:0">· startet nach ${s.nach.join(", ")}</span>`:""}${s.sk?` <span class="hint" style="margin:0">· Skill: ${esc(s.sk)}</span>`:""}</div>
        ${fremd?`<div class="plab">Abteilung ${esc((dept(PL(a,o).abt)||{}).n||"?")} · Zustimmung: ${esc(leitungTxt(PL(a,o).abt))} – mit deiner Freigabe erteilt</div>`:""}</div></div>`}).join("")}
    ${P.sum?`<div class="plsum"><b>Begründung:</b> ${esc(P.sum)}</div>`:""}</div>`}
function planBind(j,close){document.querySelectorAll("[data-plag]").forEach(s=>s.onchange=()=>{j.plan.steps[+s.dataset.plag].aid=s.value;const sc=$("#box").scrollTop;resultModal(j);$("#box").scrollTop=sc});
  const go=$("#plgo");if(go)go.onclick=async()=>{go.disabled=true;try{await planFreigeben(j);close();jobs()}catch(e){go.disabled=false;toast("Freigabe nicht möglich: "+((e&&e.message)||e))}}}
async function planFreigeben(j){await kiFresh(j);if(!istPlan(j))throw {message:"Plan ist nicht mehr offen"};
  const S=j.plan.steps,o=jobOrg(j),F=FREE(),st=F&&F.N.find(n=>n.type==="start");if(!F||!st)throw {message:"Systemablauf „Freie Aufgabe“ fehlt"};
  for(const s of S)if(!AG.some(a=>a.id===s.aid))throw {message:"Schritt mit unbekanntem Agenten – bitte Agent wählen"};
  const ids=[];for(let i=0;i<S.length;i++)ids.push("A-"+await nextJobNo());
  const kids=S.map((s,i)=>{const a=AG.find(x=>x.id===s.aid),p=PL(a,o),skx=s.sk&&a.s.map(id=>sk(id)).find(x=>x&&(x.n===s.sk||x.id===s.sk));
    const k={id:ids[i],f:F,fid:F.id,art:"agent",aid:a.id,org:o,t:s.t&&s.t.length<80?s.t:(j.t+" – Teil "+(i+1)),in:"Teilauftrag "+(i+1)+" von "+S.length+" aus Plan "+j.id+" „"+j.t+"“: "+(s.t||"")+"\n\nUrsprüngliche Aufgabe von Boris: "+(j.in||j.t),
      path:[st.id],st:"inbox",ki:1,tempo:j.tempo||"schnell",parent:j.id,step:i+1,nach:(s.nach||[]).map(n=>ids[n-1]).filter(Boolean),auto:1,gesammelt:new Date().toISOString(),
      log:[[now(),"Teilauftrag "+(i+1)+"/"+S.length+" aus Plan "+j.id]]};
    if(p.abt)k.abt=p.abt;if(p.team)k.team=p.team;if(skx)k.sk=skx.id;if(j.vorab)k.vorab=1;if(j.prio)k.prio=j.prio;if(j.due)k.due=j.due;if((j.anh||[]).length)k.anh=j.anh;return k});
  for(const k of kids){await Store.set("jobs/"+k.id,JSON.parse(jobSer(k)));LAST.set("jobs/"+k.id,jobSer(k));AU.unshift(k)}
  const fremd=[...new Set(kids.map(k=>k.abt).filter(a=>a&&a!==j.abt))];
  j.teile=ids;j.st="run";delete j.q;j.plan.frei=new Date().toISOString();j.log.push([now(),"Plan freigegeben von Boris – "+S.length+" Teilaufträge",1]);
  fremd.forEach(a=>j.log.push([now(),"Zustimmung für Abteilung "+((dept(a)||{}).n||a)+" erteilt von Boris"+(usr((dept(a)||{}).lead)?" (Leitung: "+usr(dept(a).lead).n+")":" (Leitung offen)")]));
  await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j));toast("Plan freigegeben – "+S.length+" Teilaufträge angelegt");await planWeiter()}
let PLBUSY=false;
async function planWeiter(){if(PLBUSY||!DB||RO)return;PLBUSY=true;try{
  for(const p of AU.filter(x=>Array.isArray(x.teile)&&x.st==="run")){const K=teileVon(p);if(K.some(k=>!k))continue;
    for(const k of K){if(k.st!=="inbox"||!k.auto)continue;const V=(k.nach||[]).map(id=>AU.find(x=>x.id===id));if(V.some(v=>!v||!isEnd(v)))continue;
      if(V.some(v=>v.st==="cancel"||v.ok==="nein")){if(!k.blk){k.blk=1;p.log.push([now(),"Teilauftrag "+k.id+" wartet auf dich – Vorschritt nicht erledigt",1]);k.log.push([now(),"Nicht automatisch gestartet: Vorschritt nicht erledigt",1]);
        try{await Store.set("jobs/"+k.id,JSON.parse(jobSer(k)));LAST.set("jobs/"+k.id,jobSer(k));await Store.set("jobs/"+p.id,JSON.parse(jobSer(p)));LAST.set("jobs/"+p.id,jobSer(p))}catch(e){}}continue}
      if(!await Store.lease("jobs/"+k.id,60000))continue;const f=await Store.get("jobs/"+k.id);if(!f||f.st!=="inbox")continue;
      if(V.length)k.in=(k.in||"")+"\n\nErgebnisse der Vorschritte:\n"+V.map(v=>"– "+v.id+" „"+v.t+"“: "+(v.sum||"erledigt")+((v.erg||[]).length?" · "+v.erg.map(e=>(e.t||"Ergebnis")+(e.url?" "+e.url:"")).join(" · "):"")).join("\n");
      k.log.push([now(),V.length?"Startet nach "+V.map(v=>v.id).join(", "):"Startet mit dem Plan"]);kiStart(k,"starten");await new Promise(r=>setTimeout(r,400))}
    if(K.every(isEnd)){const ja=K.filter(k=>k.st==="done"&&k.ok!=="nein"&&k.ok!=="teilweise").length,nein=K.filter(k=>k.st==="cancel"||k.ok==="nein").length;
      p.st="done";markDone(p);p.ok=ja===K.length?"ja":nein===K.length?"nein":"teilweise";p.erg=K.flatMap(k=>(k.erg||[]).map(e=>({...e,t:(e.t||"Ergebnis")+" ("+k.id+")"})));
      p.sum="Plan aus "+K.length+" Teilaufträgen: "+ja+" erledigt"+(K.length-ja-nein?", "+(K.length-ja-nein)+" teilweise":"")+(nein?", "+nein+" nicht erledigt oder abgebrochen":"")+".";
      p.log.push([now(),"Auftrag fertig"]);try{await Store.set("jobs/"+p.id,JSON.parse(jobSer(p)));LAST.set("jobs/"+p.id,jobSer(p))}catch(e){}}}}
  finally{PLBUSY=false}}
function teileHtml(j){const K=teileVon(j).filter(Boolean);if(!K.length)return "";const n=K.filter(isEnd).length;
  return `<div class="flabel">Teilaufträge (${n} von ${K.length} beendet)</div>${K.map(k=>{const [c,l]=okTxt(k),a=jobAgent(k);return `<div class="ergit pltl" data-plk="${k.id}"><div class="ergh"><b>${esc(k.id)} · ${esc(k.t)}</b><span style="flex:1"></span><span class="okb ${c}">${esc(k.st==="inbox"?((k.nach||[]).length?"wartet auf "+k.nach.join(", "):"gesammelt"):l)}</span></div><div class="hint" style="margin:2px 0 0">${esc(a?a.n:"")}</div></div>`}).join("")}`}
const teilTxt=j=>j.parent?`Teil ${j.step||"?"} von ${j.parent}`:Array.isArray(j.teile)?`Plan: ${teileVon(j).filter(k=>k&&isEnd(k)).length}/${j.teile.length} Teile beendet`:"";
