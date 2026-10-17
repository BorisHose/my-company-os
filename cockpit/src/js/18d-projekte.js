// ===== Projekte (Etappe 4b, Teil 1) =====
// Projekte werden in Company OS angelegt und gehalten (Sammlung projects). Ein Projekt kann mit einem Backend-Projekt verbunden werden
// (bk = {sys, orgId, orgN, id, n, url}); Aufträge tragen das Feld prj. Company OS arbeitet auch ohne Projekt („ohne Projekt“).
let PJ=[],PJSEL=null;
const PJST=[["aktiv","Aktiv"],["pausiert","Pausiert"],["abgeschlossen","Abgeschlossen"]];
const pj=id=>id?PJ.find(p=>p.id===id):null;
const pjOrg=o=>PJ.filter(p=>p.org===o);
const pjAktiv=o=>pjOrg(o).filter(p=>(p.st||"aktiv")==="aktiv");
const PJOHNE="_ohne";
// Aufträge eines Projekts (Teilaufträge zählen beim Hauptauftrag); id PJOHNE = Aufträge dieses Organigramms ohne Projekt
function pjJobs(id,o){return AU.filter(j=>j.f&&!j.parent&&(id===PJOHNE?(!j.prj||!pj(j.prj))&&jobOrg(j)===o:j.prj===id))}
function pjZahl(id,o){const L=pjJobs(id,o);return {offen:L.filter(j=>!isEnd(j)).length,wait:L.filter(j=>j.st==="wait").length,fertig:L.filter(j=>j.st==="done").length,alle:L.length,
  zuletzt:L.map(j=>j.fertig||(j.sess||[]).map(s=>s.at).filter(Boolean).pop()||j.gesammelt||"").filter(Boolean).sort().pop()||""}}
const pjBk=p=>p&&p.bk?`<a class="pjbk" href="${esc(p.bk.url||"#")}" target="_blank" rel="noopener" title="Im Backend öffnen">${esc(PN[p.bk.sys]||p.bk.sys)}${p.bk.orgN?" · "+esc(p.bk.orgN):""} ↗</a>`:"";
const pjOpts=(o,v)=>{const A=pjOrg(o).filter(p=>(p.st||"aktiv")==="aktiv"||p.id===v);return `<option value="">– ohne Projekt –</option>`+A.map(p=>`<option value="${p.id}" ${p.id===v?"selected":""}>${esc(p.n)}${(p.st||"aktiv")!=="aktiv"?" ("+esc(p.st)+")":""}</option>`).join("")};
function prj(){if(!orgById(OC))OC=ORGS()[0].id;const O=orgById(OC),F=UI.pjf||"aktiv";
  const L=pjOrg(OC),cnt=k=>L.filter(p=>(p.st||"aktiv")===k).length,V=L.filter(p=>F==="alle"||(p.st||"aktiv")===F).sort((a,b)=>String(a.n).localeCompare(String(b.n),"de"));
  if(PJSEL!==PJOHNE&&!(pj(PJSEL)&&pj(PJSEL).org===OC))PJSEL=V[0]?V[0].id:null;
  const card=(id,n,sub,st)=>{const z=pjZahl(id,OC);return `<button class="pjc ${id===PJSEL?"on":""} ${st||""}" data-pj="${id}"><b>${esc(n)}</b><small>${sub}</small><span class="pjz">${z.offen?`<span class="pjo" title="offene Aufträge">● ${z.offen} offen</span>`:""}${z.wait?`<span class="pjw" title="warten auf dich">⏸ ${z.wait}</span>`:""}<span title="erledigte Aufträge (letzte 90 Tage)">✓ ${z.fertig}</span>${(()=>{const v=vbSumme(pjJobs(id,OC));return v.n?`<span title="Laufzeit der KI-Sitzungen (gemessen)">⏱ ${fmtDauer(v.sek)}</span>`:""})()}</span></button>`};
  $("#pjl").innerHTML=`<div class="oorg" id="pjorg" style="margin-bottom:8px">${ORGS().map(o=>`<button data-pjo="${o.id}" class="${o.id===OC?"on":""}">${o.logo?`<img class="olg" src="${o.logo}" alt="">`:""}${esc(o.kurz||o.n)}</button>`).join("")}</div>
    <div class="seg" id="pjf" style="margin:0 0 8px">${[...PJST,["alle","Alle"]].map(([k,l])=>`<button data-pjf="${k}" class="${k===F?"on":""}">${l}<span class="n">${k==="alle"?L.length:cnt(k)}</span></button>`).join("")}</div>
    ${V.map(p=>card(p.id,p.n,[p.kunde,usr(p.verantw)&&usr(p.verantw).n,p.bk?"↔ "+(PN[p.bk.sys]||p.bk.sys):""].filter(Boolean).map(esc).join(" · ")||"&nbsp;",(p.st||"aktiv"))).join("")||`<div class="hint" style="margin:6px 0">${F==="aktiv"?"Noch keine aktiven Projekte in "+esc(O.kurz||O.n)+".":"Keine Projekte in dieser Auswahl."}</div>`}
    ${card(PJOHNE,"Ohne Projekt","Aufträge ohne Projektzuordnung","ohne")}
    <div class="btns" style="margin-top:10px"><button class="btn p" id="pjnew">+ Neues Projekt</button><button class="btn" id="pjimp" title="Aktive Projekte aus Bodo oder sellify übernehmen und verbinden">⇣ Aus Backend übernehmen …</button></div>
    <div class="hint">Projekte gehören zu ${esc(O.kurz||O.n)} und werden in Company OS geführt. Verbunden mit einem Bodo- oder sellify-Projekt legt Claude Aufgaben und Notizen eines Auftrags dort am Projekt an.</div>`;
  document.querySelectorAll("[data-pjo]").forEach(b=>b.onclick=()=>{OC=b.dataset.pjo;PJSEL=null;prj()});
  document.querySelectorAll("[data-pjf]").forEach(b=>b.onclick=()=>{UI.pjf=b.dataset.pjf;saveUI();PJSEL=null;prj()});
  document.querySelectorAll("[data-pj]").forEach(b=>b.onclick=()=>{PJSEL=b.dataset.pj;prj()});
  $("#pjnew").onclick=async()=>{const n=await askText("Name des neuen Projekts","");if(!n)return;const p={id:uid("pj"),org:OC,n,st:"aktiv",verantw:(ME()||{}).id||null,angelegt:new Date().toISOString()};PJ.push(p);PJSEL=p.id;UI.pjf="aktiv";saveUI();schedule();prj();toast("Projekt angelegt")};
  $("#pjimp").onclick=()=>pjBodoDlg(null);
  pjDetail()}
function pjDetail(){const C=$("#pjd"),o=OC;
  const L=pjJobs(PJSEL,o),off=L.filter(j=>!isEnd(j)),fer=L.filter(j=>isEnd(j)).sort((a,b)=>String(b.fertig||"").localeCompare(String(a.fertig||"")));
  const row=j=>{const [c,l]=okTxt(j),W=jobWho(j);return `<div class="pjr" data-pjj="${j.id}"><span class="pjid">${esc(j.id)}</span><span class="pjt"><b>${esc(j.t||"Auftrag")}</b><small>${esc(W.n)}${teilTxt(j)?" · "+esc(teilTxt(j)):""}</small></span><span class="pjvb">${vbKurz(vbJob(j))}</span><span class="okb ${c}">${esc(j.st==="inbox"?"📥 gesammelt":isEnd(j)?doneTxt(j):l)}</span></div>`};
  const liste=`<div class="flabel">Offene Aufträge (${off.length})</div>${off.map(row).join("")||'<div class="hint" style="margin:0 0 6px">Keine offenen Aufträge.</div>'}
    <div class="flabel">Erledigt in den letzten 90 Tagen (${fer.length})</div>${fer.slice(0,40).map(row).join("")||'<div class="hint" style="margin:0">Noch nichts erledigt.</div>'}${fer.length>40?`<div class="hint">… und ${fer.length-40} weitere – vollständig unter „Aufträge & Verlauf“.</div>`:""}
    <div class="flabel">Verbrauch</div>${vbPjHtml(L)}`;
  if(PJSEL===PJOHNE){C.innerHTML=`<h2>Ohne Projekt <span class="hint" style="margin:0 0 0 8px;text-transform:none;letter-spacing:0;font-weight:400">${esc((orgById(o)||{}).kurz||"")}</span></h2><div class="hint" style="margin:0 0 6px">Aufträge, die keinem Projekt zugeordnet sind. Zuordnen kannst du im Ergebnisfenster eines Auftrags unter „Projekt“.</div>${liste}`;pjBindRows();return}
  const p=pj(PJSEL);if(!p){C.innerHTML=`<div class="empty"><b>Kein Projekt gewählt</b>Lege links ein Projekt an oder übernimm aktive Projekte aus Bodo oder sellify.</div>`;return}
  C.innerHTML=`<h2 style="justify-content:space-between"><span>▣ ${esc(p.n)}</span><span><button class="btn sm p" id="pjgo" ${(p.st||"aktiv")!=="aktiv"?"disabled title=\"Nur aktive Projekte nehmen neue Aufträge an\"":""}>+ Auftrag in diesem Projekt</button></span></h2>
    <div class="row"><div class="field"><label>Name</label><input type="text" id="pjn" value="${esc(p.n||"")}"></div><div class="field"><label>Kunde / Bezug</label><input type="text" id="pjk" value="${esc(p.kunde||"")}" placeholder="z. B. Mieterverein Musterstadt"></div></div>
    <div class="row"><div class="field"><label>Status</label><div class="seg" id="pjst" style="margin:0">${PJST.map(([k,l])=>`<button data-pst="${k}" class="${k===(p.st||"aktiv")?"on":""}">${l}</button>`).join("")}</div></div><div class="field"><label>Verantwortlich</label>${usersSel("pjv",p.verantw||"","– offen –")}</div></div>
    <div class="field"><label>Beschreibung</label><textarea id="pjb" style="min-height:60px" placeholder="Worum geht es, was ist das Ziel?">${esc(p.beschr||"")}</textarea></div>
    <div class="field"><label>Backend</label>${p.bk?`<div class="pjlink"><span>Verbunden mit <b>${esc(PN[p.bk.sys]||p.bk.sys)}-Projekt „${esc(p.bk.n||"")}“</b>${p.bk.orgId?" im Mandanten "+esc(p.bk.orgN||p.bk.orgId):""}</span>${pjBk(p)}<button class="btn sm" id="pjun">Verbindung lösen</button></div><div class="hint">Claude legt Aufgaben, Notizen und Termine eines Auftrags in diesem Projekt an. Buchungsdaten (Zeit, Verbrauch) werden später dorthin übergeben.</div>`:`<div class="btns" style="margin:0"><button class="btn sm" id="pjln">↔ Mit Backend-Projekt verbinden …</button></div><div class="hint">Ohne Verbindung dient das Projekt nur zur Einordnung in Company OS.</div>`}</div>
    ${liste}
    <div class="btns" style="margin-top:14px;justify-content:flex-end"><button class="btn d" id="pjdel">Projekt löschen</button></div>`;
  const up=()=>{schedule()};
  $("#pjn").oninput=e=>{p.n=e.target.value.trim()||p.n;up()};$("#pjn").onchange=()=>prj();
  $("#pjk").oninput=e=>{p.kunde=e.target.value.trim();up()};$("#pjb").oninput=e=>{p.beschr=e.target.value;up()};
  $("#pjv").onchange=e=>{p.verantw=e.target.value||null;up();prj()};
  document.querySelectorAll("[data-pst]").forEach(b=>b.onclick=()=>{p.st=b.dataset.pst;up();prj()});
  $("#pjgo").onclick=()=>{if(blocked())return;startModal(null,{org:p.org,prj:p.id})};
  const un=$("#pjun");if(un)un.onclick=async()=>{if(await askOk("Verbindung zum "+(PN[p.bk.sys]||p.bk.sys)+"-Projekt „"+p.bk.n+"“ lösen? Das Projekt dort bleibt unverändert.","Verbindung lösen")){delete p.bk;up();prj()}};
  const ln=$("#pjln");if(ln)ln.onclick=()=>pjBodoDlg(p);
  $("#pjdel").onclick=async()=>{const n=AU.filter(j=>j.prj===p.id).length;if(!await askOk(n?"Projekt „"+p.n+"“ löschen? "+n+" Aufträge verlieren die Zuordnung und erscheinen unter „Ohne Projekt“.":"Projekt „"+p.n+"“ löschen?"))return;
    for(const j of AU.filter(x=>x.prj===p.id)){delete j.prj;try{await Store.update("jobs/"+j.id,{prj:null});LAST.set("jobs/"+j.id,jobSer(j))}catch(e){}}
    PJ=PJ.filter(x=>x!==p);PJSEL=null;schedule();prj();toast("Projekt gelöscht")};
  pjBindRows()}
function pjBindRows(){document.querySelectorAll("[data-pjj]").forEach(r=>r.onclick=()=>{const j=AU.find(x=>x.id===r.dataset.pjj);if(!j)return;if(j.ki)kiFresh(j).then(()=>resultModal(j));else jobModalK(j)})}
// Auftrag einem Projekt zuordnen (nur das Feld prj, damit laufende Claude-Sitzungen nicht gestört werden)
async function pjSetJob(j,id){if(id)j.prj=id;else delete j.prj;try{await Store.update("jobs/"+j.id,{prj:id||null});LAST.set("jobs/"+j.id,jobSer(j))}catch(e){schedule()}
  for(const k of teileVon(j).filter(Boolean)){if(id)k.prj=id;else delete k.prj;try{await Store.update("jobs/"+k.id,{prj:id||null});LAST.set("jobs/"+k.id,jobSer(k))}catch(e){}}
  toast(id?"Projekt „"+pj(id).n+"“ zugeordnet":"Projektzuordnung entfernt")}
function pjJobField(j){const o=jobOrg(j);if(j.parent)return "";return `<div class="pjsel"><label for="rprj">Projekt</label><select id="rprj">${pjOpts(o,j.prj&&pj(j.prj)?j.prj:"")}</select></div>`}
// Backend-Projekte (Bodo oder sellify) suchen: zum Verbinden eines Projekts (p) oder zum Übernehmen mehrerer (p = null)
const bodoPjSt=s=>s==="active"?"aktiv":s==="paused"?"pausiert":"abgeschlossen";
const sfPjSt=x=>x.done?"abgeschlossen":/paus|ruht|hold/i.test(((x.status||{}).name||{})["de-DE"]||"")?"pausiert":"aktiv";
const PJSYS=["bodo","sellify"];
// Treffer beider Systeme auf eine Form bringen: {id, title, url, st, owner, descr}
async function pjSuche(sys,om,q,alle){const R=[];
  if(sys==="bodo"){let cur=null;for(let i=0;i<4;i++){const inp={resourceType:"project",orgId:om.id,achsen:{status:alle?"alle":"aktiv"},limit:50};if(q)inp.query=q;if(cur)inp.cursor=cur;
      const r=await bodo("bodo_search",inp);((r&&r.items)||[]).forEach(x=>{const d=x.data||{};R.push({id:String(x.id),title:x.title||d.name||"",url:x.url||"",st:bodoPjSt(d.projectStatus),owner:d.ownerName||"",descr:d.description||""})});cur=r&&r.hasMore&&r.nextCursor;if(!cur)break}}
  else{let off=0;for(let i=0;i<4;i++){const params={limit:50,offset:off};if(!alle)params.done=false;if(q)params.q=q;
      const r=await sellify("sellify_project",{action:"list",params});((r&&r.items)||[]).forEach(x=>{const o=x.responsible||{};R.push({id:String(x.id),title:(x.name||"")+(x.number?" ("+x.number+")":""),n:x.name||"",url:x.webUrl||"",st:sfPjSt(x),owner:[o.firstName,o.lastName].filter(Boolean).join(" "),descr:x.description||""})});
      if(!(r&&r.hasMore))break;off=r.nextOffset||off+50}}
  return R}
function pjBodoDlg(p,sys0){const O=orgById(OC),M=ownOrgs(),dp=dienstVon(O,"projekt");
  let sys=sys0||(dp&&PJSYS.includes(dp.sys)?dp.sys:O.pjSys||(O.prod==="sellify"?"sellify":"bodo"));
  let om=M.find(m=>m.id===(dp&&dp.sys==="bodo"&&dp.orgId?dp.orgId:(O.pjBodo||"")))||M[0],q="",alle=false,R=[],busy=false,err="";
  const close=modalBox(`<div class="bhead"><h3>${p?"„"+esc(p.n)+"“ mit Backend-Projekt verbinden":"Projekte aus dem Backend übernehmen"}</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
    <div class="row"><div class="field"><label>System</label><div class="seg" id="pbs" style="margin:0">${PJSYS.map(k=>`<button data-pbs="${k}" class="${k===sys?"on":""}">${esc(SYSKAT[k].n)}</button>`).join("")}</div></div><div class="field" id="pbmf"></div></div>
    <div class="field"><label>Suche</label><input type="search" id="pbq" placeholder="Projektname …"></div>
    <label class="cb" style="margin:0 0 8px"><input type="checkbox" id="pba"> auch pausierte und abgeschlossene Projekte</label>
    <div id="pbl" class="pbl"></div>
    <div class="btns" style="margin-top:12px;justify-content:flex-end"><button class="btn" id="pbx">Abbrechen</button>${p?"":'<button class="btn p" id="pbok" disabled>Ausgewählte übernehmen</button>'}</div>`,true);
  $("#mclose").onclick=$("#pbx").onclick=close;
  const mand=()=>{const f=$("#pbmf");if(sys!=="bodo"){f.innerHTML=`<label>Mandant</label><div class="hint" style="margin:6px 0 0">sellify: ein System, kein Mandant</div>`;return}
    f.innerHTML=M.length?`<label>Bodo-Mandant</label><select id="pbm">${M.map(m=>`<option value="${m.id}" ${m===om?"selected":""}>${esc(m.name)}</option>`).join("")}</select>`:`<label>Bodo-Mandant</label><div class="warnbox">Keine eigenen Bodo-Mandanten hinterlegt – ⚙ Einstellungen › Anbindungen</div>`;
    const s=$("#pbm");if(s)s.onchange=e=>{om=M.find(m=>m.id===e.target.value);load()}};
  const verb=r=>PJ.find(x=>x.bk&&x.bk.sys===sys&&String(x.bk.id)===r.id);
  const draw=()=>{const b=$("#pbl");if(!b)return;if(busy){b.innerHTML=`<div class="hint">Lade Projekte aus ${esc(SYSKAT[sys].n)} …</div>`;return}if(err){b.innerHTML=`<div class="warnbox">${esc(err)}</div>`;return}
    b.innerHTML=R.length?R.map(r=>{const v=verb(r);return `<label class="pbr ${v?"dis":""}">${p?`<button class="btn sm" data-pbp="${esc(r.id)}" ${v?"disabled":""}>Verbinden</button>`:`<input type="checkbox" data-pbc="${esc(r.id)}" ${v?"disabled":""}>`}<span><b>${esc(r.title)}</b><small>${esc(r.st)}${r.owner?" · "+esc(r.owner):""}${v?" · bereits verbunden mit „"+esc(v.n)+"“":""}</small></span><a href="${esc(r.url||"#")}" target="_blank" rel="noopener" title="In ${esc(SYSKAT[sys].n)} öffnen">↗</a></label>`}).join(""):'<div class="hint">Keine Projekte gefunden.</div>';
    document.querySelectorAll("[data-pbp]").forEach(x=>x.onclick=e=>{e.preventDefault();const r=R.find(y=>y.id===x.dataset.pbp);p.bk=pjBkVon(r,sys,om);if(!p.beschr&&r.descr)p.beschr=r.descr;merk();schedule();close();prj();toast("Mit "+SYSKAT[sys].n+"-Projekt verbunden")});
    document.querySelectorAll("[data-pbc]").forEach(x=>x.onchange=()=>{$("#pbok").disabled=!document.querySelector("[data-pbc]:checked")})};
  const merk=()=>{O.pjSys=sys;if(sys==="bodo"&&om)O.pjBodo=om.id};
  let tq=null,lauf=0;const load=async()=>{const n=++lauf;busy=true;err="";R=[];draw();if(sys==="bodo"&&!om){busy=false;draw();return}
    try{const L=await pjSuche(sys,om,q,alle);if(n!==lauf)return;R=L}catch(e){if(n!==lauf)return;err=sys==="bodo"?mcpMsg(e):sfMsg(e)}busy=false;draw()};
  document.querySelectorAll("[data-pbs]").forEach(b=>b.onclick=()=>{sys=b.dataset.pbs;document.querySelectorAll("[data-pbs]").forEach(x=>x.classList.toggle("on",x===b));mand();load()});
  $("#pba").onchange=e=>{alle=e.target.checked;load()};
  $("#pbq").oninput=e=>{clearTimeout(tq);tq=setTimeout(()=>{q=e.target.value.trim();load()},400)};
  const ok=$("#pbok");if(ok)ok.onclick=()=>{const S=[...document.querySelectorAll("[data-pbc]:checked")].map(c=>R.find(r=>r.id===c.dataset.pbc)).filter(Boolean);
    S.forEach(r=>{const u=US.find(x=>x.aktiv!==false&&r.owner&&x.n===r.owner);PJ.push({id:uid("pj"),org:OC,n:r.n||r.title||"Projekt",st:r.st,beschr:r.descr||"",verantw:u?u.id:null,bk:pjBkVon(r,sys,om),angelegt:new Date().toISOString()})});
    merk();schedule();close();PJSEL=null;prj();toast(S.length+" Projekt"+(S.length===1?"":"e")+" aus "+SYSKAT[sys].n+" übernommen")};
  mand();load()}
const pjBkVon=(r,sys,m)=>sys==="bodo"?{sys:"bodo",orgId:m.id,orgN:m.name,id:r.id,n:r.n||r.title||"",url:r.url||"",at:new Date().toISOString()}:{sys,id:r.id,n:r.n||r.title||"",url:r.url||"",at:new Date().toISOString()};
// Kontext für Claude
function pjKontext(j){const P=pj(j.prj);if(!P)return "";const B=P.bk,S=B&&(PN[B.sys]||B.sys);
  const kopf="PROJEKT des Auftrags: „"+P.n+"“ (Company OS "+P.id+(P.kunde?", Kunde/Bezug: "+P.kunde:"")+")";
  if(!B)return kopf+". Noch nicht mit einem Backend-Projekt verbunden – nur zur Einordnung, System und Mandant wie sonst bestimmen.";
  const wo=B.sys==="bodo"?"Bodo-Projekt „"+B.n+"“ (projectId "+B.id+", Mandant "+(B.orgN||"")+" = orgId "+B.orgId+", "+B.url+")":"sellify-Projekt „"+B.n+"“ (Projekt-Id "+B.id+", Werkzeug sellify_project bzw. Bezug project, "+B.url+")";
  return kopf+". Verbunden mit "+wo+". Alles, was du für diesen Auftrag in "+S+" anlegst (Aufgaben, Notizen, Termine, Dokumente), in diesem Projekt anlegen bzw. mit ihm verknüpfen"+(B.sys==="bodo"?"; Mandant für diese Anlagen ist "+(B.orgN||B.orgId)+" (durch das Projekt eindeutig, keine Annahme)":"; Zielsystem ist damit sellify (durch das Projekt eindeutig, keine Annahme)")+". Im Ergebnis vermerken, dass am Projekt angelegt wurde."}
