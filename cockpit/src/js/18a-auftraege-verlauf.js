// ===== Aufträge & Verlauf: ein Dialog über alle Abteilungen (Etappe 1) =====
// Zuordnung eines Auftrags: Agent (direkt, aus dem Ablauf oder keiner = „Claude – frei“), Abteilung (beim Anlegen gemerkt, sonst aktuelle Platzierung des Agenten)
function jobAgent(j){if(!j)return null;const byId=id=>id?AG.find(x=>x.id===id)||null:null;
  if((j.art==="agent"||j.art==="abteilung")&&j.aid)return byId(j.aid);if(j.art==="abteilung")return null;
  if(j.f&&!j.f.frei&&Array.isArray(j.path)){const c=curN(j),a=(c&&c.a)||(j.f.N.find(n=>n.type==="task"&&n.a)||{}).a;if(a)return a}
  return byId(j.aid)}
const jobOrg=j=>j.org||(ORGS()[0]||{}).id;
function jobAbt(j,a){if(j.abt)return j.abt;const p=a?PL(a,jobOrg(j)):{};return p.abt||""}
function jobPlatz(j){const a=jobAgent(j);if(!a)return;const p=PL(a,jobOrg(j));if(p.abt)j.abt=p.abt;if(p.team)j.team=p.team}
const runCnt=aid=>AU.filter(j=>j.st==="run"&&(jobAgent(j)||{}).id===aid).length;

const AVSIDE=()=>window.innerWidth>860||!!(UI.av&&UI.av.side);
let AVOPEN=false,AVN=50,AVARCH=null,AVLOAD=false;
function AVS(){const s=UI.av=UI.av||{};s.tab=s.tab||"offen";s.st=s.st||"alle";s.zeit=s.zeit||"heute";s.sel=s.sel||{};if(!orgById(s.org))s.org=OC||(ORGS()[0]||{}).id;return s}
function avSel(o){const s=AVS();if(!s.sel[o])s.sel[o]={d:null,ax:[]};return s.sel[o]}
function avOpen(opt){opt=opt||{};const s=AVS();if(opt.org)s.org=opt.org;const S=avSel(s.org);
  if(opt.all){S.d=null;S.ax=[]}
  if(opt.d){S.d=[...opt.d];S.ax=[]}
  if(opt.only){S.d=[PL(opt.only,s.org).abt||"_none"];S.ax=AG.filter(x=>x.id!==opt.only.id).map(x=>x.id).concat(["_frei","_tl"])}
  if(opt.tab)s.tab=opt.tab;if(opt.st)s.st=opt.st;AVN=50;saveUI();AVOPEN=true;avRender()}
function avClose(){AVOPEN=false;const d=$("#avdlg");if(d)d.remove()}
function avRefresh(){if(AVOPEN&&$("#avdlg"))avRender(true)}

// Zeitfenster der Erledigt-Ansicht (Heute · Diese Woche · Dieser Monat · Letzter Monat · Älter)
function avFenster(){const t=new Date();t.setHours(0,0,0,0);const mo=new Date(t);mo.setDate(t.getDate()-((t.getDay()+6)%7));const m1=new Date(t.getFullYear(),t.getMonth(),1),lm=new Date(t.getFullYear(),t.getMonth()-1,1);
  return {heute:[t,null],woche:[mo,null],monat:[m1,null],letzter:[lm,m1],aelter:[null,lm]}}
const AVZ=[["heute","Heute"],["woche","Diese Woche"],["monat","Dieser Monat"],["letzter","Letzter Monat"],["aelter","Älter"]];
const inFenster=(d,w)=>(!w[0]||d>=w[0])&&(!w[1]||d<w[1]);

function avZeilen(o){const R=AU.filter(j=>jobOrg(j)===o).map(j=>{const a=jobAgent(j);return {j,a,abt:jobAbt(j,a)||"_none",ak:a?a.id:j.art==="abteilung"?"_tl":"_frei",end:isEnd(j),d:isEnd(j)?doneAt(j):null}});
  if(AVARCH)AVARCH.filter(x=>x.org===o&&!R.some(r=>r.j.id===x.id)).forEach(x=>{const a=x.aid?AG.find(y=>y.id===x.aid)||null:null;R.push({j:x,a,abt:x.abt||(a&&PL(a,o).abt)||"_none",ak:a?a.id:"_frei",end:true,d:new Date(x.fertig),arch:true})});
  return R}
async function avArchivLaden(){if(AVARCH||AVLOAD||!DB)return;AVLOAD=true;try{const L=await Store.list("archiv");AVARCH=L.flatMap(a=>(a.items||[]).map(x=>({...x,org:x.org||a.org})))}catch(e){AVARCH=[];toast("Archiv nicht lesbar")}AVLOAD=false;avRefresh()}

function avRender(keep){const s=AVS(),o=s.org,S=avSel(o),O=orgById(o)||{},F=avFenster();
  const q=(s.q||"").trim().toLowerCase(),R0=avZeilen(o).filter(r=>!q||[r.j.id,r.j.t,r.j.in,r.a&&r.a.n].some(v=>String(v||"").toLowerCase().includes(q)));
  const inTab=r=>s.tab==="offen"?!r.end:(r.end&&(s.abg||r.j.st!=="cancel")&&inFenster(r.d,F[s.zeit]));
  const inSel=r=>(S.d===null||S.d.includes(r.abt))&&!S.ax.includes(r.ak);
  const RT=R0.filter(inTab),R=RT.filter(inSel);
  // linke Seite: Abteilungen mit ihren Agenten, Zahlen = Aufträge in der aktuellen Ansicht (ohne Auswahl)
  const D=deptsOf(o).map(d=>({id:d.id,n:d.n}));if(RT.some(r=>r.abt==="_none")||AG.some(a=>inOrg(a,o)&&!PL(a,o).abt))D.push({id:"_none",n:"Ohne Abteilung"});
  const dOn=k=>S.d===null||S.d.includes(k);
  const tree=D.map(d=>{const A=AG.filter(a=>inOrg(a,o)&&(PL(a,o).abt||"_none")===d.id).map(a=>({k:a.id,n:a.n}));
      RT.filter(r=>r.abt===d.id&&!A.some(x=>x.k===r.ak)).forEach(r=>{if(!A.some(x=>x.k===r.ak))A.push({k:r.ak,n:r.a?r.a.n:r.ak==="_tl"?"✦ KI-Teamleiter (wählt noch)":"Claude – frei"})});
      const n=RT.filter(r=>r.abt===d.id).length;
      return `<label class="dl"><input type="checkbox" data-avd="${d.id}" ${dOn(d.id)?"checked":""}> ${esc(d.n)}<span class="n">${n}</span></label>`+
        A.map(a=>`<label class="al"><input type="checkbox" data-ava="${a.k}" data-avad="${d.id}" ${dOn(d.id)&&!S.ax.includes(a.k)?"checked":""}> ${esc(a.n)}<span class="n">${RT.filter(r=>r.abt===d.id&&r.ak===a.k).length}</span></label>`).join("")}).join("");
  const selN=S.d===null?"alle Abteilungen":D.filter(d=>S.d.includes(d.id)).map(d=>d.n).join(", ")||"keine Abteilung gewählt";
  // Leisten
  const RO=R0.filter(r=>!r.end&&inSel(r)),cnt=st=>RO.filter(r=>st==="alle"||r.j.st===st).length;
  const tabs=`<div class="seg2"><button data-avt="offen" class="${s.tab==="offen"?"on":""}">Offen<span class="c">${R0.filter(r=>!r.end&&inSel(r)).length}</span></button><button data-avt="erledigt" class="${s.tab==="erledigt"?"on":""}">Erledigt</button></div>`;
  let bar2="";
  if(s.tab==="offen"){const L=[["alle","Alle"],["run","Läuft"],["wait","Wartet auf dich"],["inbox","📥 Gesammelt"]];
    bar2=`<div class="seg2">${L.map(([k,l])=>`<button data-avs="${k}" class="${s.st===k?"on":""}">${l}${k==="alle"?"":`<span class="c">${cnt(k)}</span>`}</button>`).join("")}</div>${s.st==="inbox"?`<div class="seg2"><button data-avso="prio" class="${s.sort!=="due"?"on":""}" title="Priorität, darin Fälligkeit">Priorität</button><button data-avso="due" class="${s.sort==="due"?"on":""}" title="Fälligkeit, darin Priorität">Fälligkeit</button></div>`:""}`}
  else{const RE=R0.filter(r=>r.end&&(s.abg||r.j.st!=="cancel")&&inSel(r));
    bar2=`<div class="seg2">${AVZ.map(([k,l])=>`<button data-avz="${k}" class="${s.zeit===k?"on":""}">${l}${k==="aelter"&&!AVARCH?"":`<span class="c">${RE.filter(r=>inFenster(r.d,F[k])).length}</span>`}</button>`).join("")}</div>
      <label class="cb" style="margin:0"><input type="checkbox" id="avabg" ${s.abg?"checked":""}> Abgebrochene zeigen</label>`}
  // Tabelle
  const agc=r=>r.a?`<div class="avag">${av(usr(r.a.owner),24,1)}<span>${esc(r.a.n)}</span></div>`:`<div class="avag"><span class="avfr">✦</span><span>${r.ak==="_tl"?"KI-Teamleiter":"Claude – frei"}</span></div>`;
  const dn=r=>{const d=dept(r.abt);return d?d.n:"Ohne Abteilung"};
  const ttl=r=>`<td class="t"><b>${esc(r.j.t||"–")}</b><small>${esc(dn(r))}${teilTxt(r.j)?" · "+esc(teilTxt(r.j)):""}</small></td>`;
  let rows,head,foot0="";
  if(s.tab==="offen"){const OR={wait:0,run:1,inbox:2},pr=j=>PRN[j.prio||"n"]??2,du=j=>j.due||"9999",ib=(a,b)=>s.sort==="due"?du(a.j).localeCompare(du(b.j))||pr(a.j)-pr(b.j):pr(a.j)-pr(b.j)||du(a.j).localeCompare(du(b.j));
    rows=R.filter(r=>s.st==="alle"||r.j.st===s.st).sort((a,b)=>(OR[a.j.st]??1)-(OR[b.j.st]??1)||(a.j.st==="inbox"&&b.j.st==="inbox"?ib(a,b):0)||(+String(b.j.id).slice(2)||0)-(+String(a.j.id).slice(2)||0));
    const NIB=rows.filter(r=>r.j.st==="inbox").length;
    if(NIB)foot0=`<div class="avfoot"><span><label class="cb" style="margin:0"><input type="checkbox" id="avsall"> alle gesammelten wählen</label></span><button class="btn sm p" id="avstart" disabled>▶ Ausgewählte starten</button></div>`;
    head=`<th>Status</th><th>Nr.</th><th>Auftrag · Abteilung</th><th class="hm">Agent</th><th class="hm">Stand</th><th></th>`;
    rows=rows.map(r=>{const j=r.j,L=(j.log||[]).filter(x=>x&&!LOGSKIP.test(x[1]||"")),last=L[L.length-1];
      const st=j.st==="wait"?'<span class="kst wait">■ wartet auf dich</span>':j.st==="inbox"?`<label class="avsel"><input type="checkbox" data-avsel="${j.id}"> <span class="kst">📥 gesammelt</span></label>${prioB(j)}`:'<span class="kst run">● läuft</span>';
      const stand=istPlan(j)?"✦ Plan zur Freigabe ("+j.plan.steps.length+" Teile)":Array.isArray(j.teile)&&j.st==="run"?esc(teilTxt(j)):j.st==="wait"?esc(j.q?(j.q.kind==="Rückfrage"?"Rückfrage":"Zur Freigabe")+(j.q.from&&j.q.from!=="Company OS"?" · "+j.q.from:""):"Wartet auf dich"):j.st==="inbox"?esc([(j.nach||[]).length?"wartet auf "+j.nach.join(", "):"",j.due?"fällig "+new Date(j.due+"T12:00").toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}):"",j.gesammelt?"gesammelt "+new Date(j.gesammelt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"}):""].filter(Boolean).join(" · ")):j.st==="run"?esc([j.fired?"seit "+new Date(j.fired).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}):"",last?last[1]:""].filter(Boolean).join(" · ")):"";
      const act=j.st==="wait"?`<button class="btn sm p" data-avres="${j.id}">${istPlan(j)?"Plan prüfen":"Prüfen &amp; freigeben"}</button>`:j.st==="inbox"?`<button class="btn sm" data-avgo="${j.id}">▶ Starten</button> <button class="ic" data-avdrop="${j.id}" title="Aus dem Eingang verwerfen">✕</button>`:"";
      return `<tr class="${j.st==="inbox"?"ib":"cl"}" ${j.st==="inbox"?"":`data-avj="${j.id}"`}><td>${st}</td><td class="nr">${esc(j.id)}</td>${ttl(r)}<td class="hm">${agc(r)}</td><td class="hm sm">${stand}</td><td class="ac">${act}</td></tr>`})}
  else{const all=R.sort((a,b)=>b.d-a.d);rows=all.slice(0,AVN);
    head=`<th>Erledigt</th><th>Nr.</th><th>Auftrag · Abteilung</th><th class="hm">Agent</th><th>Status</th><th class="hm">Ergebnis</th>`;
    const tot=all.length;
    rows=rows.map(r=>{const j=r.j,[c,l]=okTxt(j),e=(j.erg||[]).find(x=>x&&/^https?:\/\//.test(x.url||""));
      const dt=+r.d?r.d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" <b>"+r.d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+"</b>":"–";
      return `<tr class="${r.arch?"arch":"cl"}" ${r.arch?`title="${esc((j.sum||"")+" (aus dem Archiv)")}"`:`data-avj="${j.id}"`}><td class="nr">${dt}</td><td class="nr">${esc(j.id)}</td>${ttl(r)}<td class="hm">${agc(r)}</td><td><span class="kst ${c}">${esc(l.replace("Erledigt","erledigt").replace("Abgebrochen","abgebrochen"))}</span></td><td class="hm">${e?`<a href="${esc(e.url)}" target="_blank" rel="noopener">↗ ${esc(e.t||"Öffnen")}</a>`:"—"}</td></tr>`});
    rows.foot=`<div class="avfoot"><span>${Math.min(AVN,tot)} von ${tot} angezeigt${s.zeit==="aelter"?(AVLOAD?" · Archiv wird geladen …":AVARCH?" · inkl. Archiv":""):""}</span>${tot>AVN?'<button class="btn sm" id="avmore">Weitere laden</button>':""}</div>`}
  const foot=rows.foot||foot0,empty=`<tr><td colspan="6" class="avempty">${s.tab==="offen"?"Keine offenen Aufträge in dieser Auswahl.":"Keine Aufträge in diesem Zeitraum."}</td></tr>`;
  const html=`<div class="modal" id="avm"><div class="avbox" role="dialog" aria-label="Aufträge und Verlauf">
    <div class="avhead"><h3>🕘 Aufträge &amp; Verlauf</h3><span class="sub">· ${esc(selN)}</span><button class="ic" id="avx" title="Schließen" style="font-size:18px">✕</button></div>
    <div class="avgrid"><details class="avside" id="avside" ${AVSIDE()?"open":""}><summary><h4>Einschränken</h4><span class="avsn">${esc(selN)}</span></summary>
      ${ORGS().length>1?`<div class="seg2 full" style="margin-bottom:8px">${ORGS().map(x=>`<button data-avo="${x.id}" class="${x.id===o?"on":""}">${esc(x.kurz||x.n)}</button>`).join("")}</div>`:""}
      <div class="avtree">${tree||'<div class="hint">Keine Abteilungen</div>'}</div><div class="avall"><button class="lnk" id="avalle">Alle</button> · <button class="lnk" id="avkeine">Keine</button></div></details>
     <div class="avmain"><div class="avbar">${tabs}${bar2}<input type="search" class="avq" id="avq" placeholder="🔍 Suchen …" value="${esc(s.q||"")}"></div>
      <div class="avtw"><table class="avt"><thead><tr>${head}</tr></thead><tbody>${rows.length?rows.join(""):empty}</tbody></table>${foot}</div></div></div>
    <div class="hint" style="margin:0">Auswahl links und Filter bleiben gespeichert. Ältere Aufträge (über 90 Tage) stehen als Kurzfassung im Archiv unter „Älter“.</div></div></div>`;
  let d=$("#avdlg");const sc=d&&d.querySelector(".avtw")?d.querySelector(".avtw").scrollTop:0,qf=document.activeElement&&document.activeElement.id==="avq",pos=qf?document.activeElement.selectionStart:0;
  if(!d){d=document.createElement("div");d.id="avdlg";document.body.appendChild(d)}d.innerHTML=html;if(keep)d.querySelector(".avtw").scrollTop=sc;
  if(qf){const i=$("#avq");i.focus();try{i.setSelectionRange(pos,pos)}catch(e){}}
  const rr=()=>{saveUI();avRender(true)};const sd=$("#avside");sd.ontoggle=()=>{if(window.innerWidth<=860){s.side=sd.open;saveUI()}};
  $("#avx").onclick=avClose;$("#avm").onclick=e=>{if(e.target.id==="avm")avClose()};
  d.querySelectorAll("[data-avo]").forEach(b=>b.onclick=()=>{s.org=b.dataset.avo;AVN=50;rr()});
  d.querySelectorAll("[data-avt]").forEach(b=>b.onclick=()=>{s.tab=b.dataset.avt;AVN=50;rr()});
  d.querySelectorAll("[data-avs]").forEach(b=>b.onclick=()=>{s.st=b.dataset.avs;rr()});
  d.querySelectorAll("[data-avz]").forEach(b=>b.onclick=()=>{s.zeit=b.dataset.avz;AVN=50;if(s.zeit==="aelter")avArchivLaden();rr()});
  const ab=$("#avabg");if(ab)ab.onchange=()=>{s.abg=ab.checked;rr()};
  $("#avq").oninput=e=>{s.q=e.target.value;AVN=50;rr()};
  const allK=()=>D.map(x=>x.id);
  d.querySelectorAll("[data-avd]").forEach(c=>c.onchange=()=>{const k=c.dataset.avd;let L=S.d===null?allK():[...S.d];L=c.checked?[...new Set([...L,k])]:L.filter(x=>x!==k);S.d=L.length===allK().length&&allK().every(x=>L.includes(x))?null:L;rr()});
  d.querySelectorAll("[data-ava]").forEach(c=>c.onchange=()=>{const k=c.dataset.ava,dk=c.dataset.avad;if(c.checked){S.ax=S.ax.filter(x=>x!==k);if(S.d!==null&&!S.d.includes(dk))S.d=[...S.d,dk]}else S.ax=[...new Set([...S.ax,k])];rr()});
  $("#avalle").onclick=()=>{S.d=null;S.ax=[];rr()};$("#avkeine").onclick=()=>{S.d=[];S.ax=[];rr()};
  const mo=$("#avmore");if(mo)mo.onclick=()=>{AVN+=50;avRender(true)};
  d.querySelectorAll("[data-avres]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();const j=AU.find(x=>x.id===b.dataset.avres);if(j)kiFresh(j).then(()=>resultModal(j))});
  d.querySelectorAll("[data-avj]").forEach(t=>t.onclick=ev=>{if(ev.target.closest("a,button"))return;const j=AU.find(x=>x.id===t.dataset.avj);if(!j)return;KINEW.delete(j.id);if(j.ki)kiFresh(j).then(()=>resultModal(j));else jobModalK(j)});
  d.querySelectorAll("[data-avso]").forEach(b=>b.onclick=()=>{s.sort=b.dataset.avso;rr()});
  const selIds=()=>[...d.querySelectorAll("[data-avsel]:checked")].map(c=>c.dataset.avsel),upd=()=>{const b=$("#avstart");if(b){const n=selIds().length;b.disabled=!n;b.textContent="▶ Ausgewählte starten"+(n?" ("+n+")":"")}};
  d.querySelectorAll("[data-avsel]").forEach(c=>c.onchange=upd);
  const sa=$("#avsall");if(sa)sa.onchange=()=>{d.querySelectorAll("[data-avsel]").forEach(c=>c.checked=sa.checked);upd()};
  const sb=$("#avstart");if(sb)sb.onclick=()=>eingangStarten(selIds());
  d.querySelectorAll("[data-avgo]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();eingangStarten([b.dataset.avgo])});
  d.querySelectorAll("[data-avdrop]").forEach(b=>b.onclick=async ev=>{ev.stopPropagation();const j=AU.find(x=>x.id===b.dataset.avdrop);if(!j||!await askOk("„"+j.t+"“ aus dem Eingang verwerfen? Der Eintrag bleibt als „abgebrochen“ im Verlauf.","Ja, verwerfen"))return;
    j.st="cancel";markDone(j);j.log.push([now(),"Aus dem Eingang verworfen von "+ICH()+"",1]);try{await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j))}catch(e){schedule()}avRefresh();if(!$("#org").classList.contains("hide"))org()});
  if(s.tab==="erledigt"&&s.zeit==="aelter")avArchivLaden()}
const prioB=j=>j.prio==="d"?' <span class="prio d">Dringend</span>':j.prio==="h"?' <span class="prio h">Hoch</span>':j.prio==="l"?' <span class="prio l">Niedrig</span>':"";
const inboxCnt=(o,did)=>AU.filter(j=>j.st==="inbox"&&jobOrg(j)===o&&jobAbt(j,jobAgent(j))===did).length;
async function eingangStarten(ids){const L=ids.map(id=>AU.find(j=>j.id===id)).filter(j=>j&&j.st==="inbox");if(!L.length)return;
  if(L.length>1&&!await askOk(L.length+" gesammelte Aufträge starten? Jeder startet eine eigene Claude-Sitzung.","Ja, starten"))return;
  for(const j of L){j.log.push([now(),"Aus dem Eingang gestartet"]);kiStart(j,"starten");await new Promise(r=>setTimeout(r,400))}
  avRefresh();if(!$("#org").classList.contains("hide"))org()}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&AVOPEN&&!$("#modal").innerHTML&&!$("#dlg"))avClose()});
