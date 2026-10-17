// ===== Anbindungen: vier Dienste je Organigramm (Etappe 4b, Teil 3) =====
// Je Organigramm o.dienste = {crm|auftrag|projekt|zeit: {sys, orgId, orgN, ent}}; Prüfergebnis o.chk = {at, erg:{dienst:{st:"ok"|"err"|"info", t}}}.
// Der Systemkatalog beschreibt, welche Dienste ein System mit welchen Entitäten anbietet. Neues System = neuer Katalogeintrag.
const DIENSTE=[["crm","CRM","Kontakte, Organisationen, Verkaufschancen"],["auftrag","Auftragsmanagement","der kommerzielle Auftrag – in der Regel über das Projekt geführt"],["projekt","Projekt","Klammer für Aufgaben, Notizen und Termine eines Auftrags"],["zeit","Zeiterfassung","Zeiteinträge, z. B. für die Laufzeit der KI-Sitzungen"]];
const SYSKAT={
  bodo:{n:"Bodo",mcp:"bodo solutions",mand:true,pruefbar:true,kiUser:false,ent:{crm:[["contact","Kontakt/Firma"],["member","Vertragsinhaber"],["opportunity","Verkaufschance"],["lead","Vertriebsanfrage"]],auftrag:[["order","Auftrag"],["opportunity","Verkaufschance"]],projekt:[["project","Projekt"]],zeit:[["timeEntry","Zeiteintrag"]]}},
  sellify:{n:"sellify",mcp:"sellify",mand:false,pruefbar:false,kiUser:false,ent:{crm:[["contact","Organisation"],["person","Person"],["sale","Chance"]],auftrag:[["sale","Chance"],["project","Projekt"]],projekt:[["project","Projekt"]],zeit:[]}}};
const ZEITTIP=s=>"Zeiterfassung ist mit "+SYSKAT[s].n+" nicht möglich. Soll ein anderes System für die Zeiterfassung angebunden werden? Bitte sprich uns als Hersteller an.";
const entN=(s,d,e)=>((SYSKAT[s]&&SYSKAT[s].ent[d]||[]).find(x=>x[0]===e)||[e,e])[1];
const dienstVon=(o,k)=>{o=typeof o==="string"?orgById(o):o;const d=o&&o.dienste&&o.dienste[k];return d&&d.sys&&SYSKAT[d.sys]?d:null};
function dienstEinst(C){const O=ORGS(),M=ownOrgs();
  const zeile=(o,[k,l,h])=>{const d=(o.dienste||{})[k]||{},S=SYSKAT[d.sys],E=S?S.ent[k]:[],c=o.chk&&o.chk.erg&&o.chk.erg[k];
    const sysOpt=`<option value="">– keins –</option>`+Object.entries(SYSKAT).map(([id,x])=>{const kann=x.ent[k].length>0;return `<option value="${id}" ${id===d.sys?"selected":""} ${kann?"":"disabled"} title="${kann?"":esc(ZEITTIP(id))}">${esc(x.n)}${kann?"":" – nicht verfügbar"}</option>`}).join("");
    const mand=S&&S.mand?`<select data-dm="${o.id}|${k}" aria-label="Mandant">${(M.some(m=>m.id===d.orgId)||!d.orgId?"":`<option value="${esc(d.orgId)}" selected>${esc(d.orgN||d.orgId)}</option>`)+`<option value="">– Mandant wählen –</option>`+M.map(m=>`<option value="${m.id}" ${m.id===d.orgId?"selected":""}>${esc(m.name)}</option>`).join("")}</select>`:S?`<span class="hint" style="margin:0">ein System, kein Mandant</span>`:"";
    const ent=S?`<select data-de="${o.id}|${k}" aria-label="Entität">${E.map(([e,n])=>`<option value="${e}" ${e===d.ent?"selected":""}>${esc(n)} (${e})</option>`).join("")}</select>`:"";
    const st=c?`<span class="dst ${c.st}" title="${esc(c.t)}">${c.st==="ok"?"✓":c.st==="err"?"⚠":"ⓘ"}</span>`:"";
    const zeit=k==="zeit"?`<label class="cb dzb" title="${esc(S&&!S.ent.zeit.length?ZEITTIP(d.sys):"Vorbereitet – die Laufzeit der KI-Sitzungen wird vorerst nur in Company OS erfasst (Entscheidung 17.10.2026).")}"><input type="checkbox" disabled> Laufzeit der KI-Sitzungen hier buchen</label>${(()=>{const so=!d.sys&&Object.values(o.dienste||{}).map(x=>x&&x.sys).find(s=>s&&SYSKAT[s]&&!SYSKAT[s].ent.zeit.length);return so?`<div class="hint dmsg">ⓘ ${esc(ZEITTIP(so))}</div>`:""})()}`:"";
    return `<div class="drow"><div class="dlab"><b>${l}</b><small>${esc(h)}</small></div><div class="dsel"><select data-ds="${o.id}|${k}" aria-label="System für ${l}">${sysOpt}</select>${mand}${ent}${st}</div>${zeit}${c&&c.st!=="ok"?`<div class="hint dmsg">${esc(c.t)}</div>`:""}</div>`};
  C.innerHTML=`<h2>Anbindungen</h2><div class="hint" style="margin:0 0 10px">Je Organigramm vier Dienste. Mehrere oder alle dürfen auf dasselbe System zeigen. Claude nutzt diese Zuordnung als Standard, wenn ein Auftrag kein System nennt; Projekte werden im Mandanten des Dienstes „Projekt“ gesucht.</div>
    ${O.map(o=>`<div class="dorg"><div class="dhd"><b>${o.logo?`<img class="olg" src="${o.logo}" alt="">`:""}${esc(o.n)}</b><span style="flex:1"></span>${o.chk?`<span class="hint" style="margin:0">geprüft ${esc(new Date(o.chk.at).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"}))}</span>`:""}<button class="btn sm" data-dchk="${o.id}">Verbindung prüfen</button></div>${DIENSTE.map(x=>zeile(o,x)).join("")}</div>`).join("")}
    <div class="flabel">Systemkatalog</div><table class="dkat"><thead><tr><th>System</th>${DIENSTE.map(d=>`<th>${d[1]}</th>`).join("")}<th>KI-Benutzer</th></tr></thead><tbody>${Object.values(SYSKAT).map(S=>`<tr><td><b>${esc(S.n)}</b></td>${DIENSTE.map(([k])=>`<td>${S.ent[k].length?S.ent[k].map(e=>esc(e[1])).join(", "):'<span class="hint" style="margin:0" title="'+esc(ZEITTIP(Object.keys(SYSKAT).find(x=>SYSKAT[x]===S)))+'">–</span>'}</td>`).join("")}<td>${S.kiUser?"ja":'<span class="hint" style="margin:0">noch nicht</span>'}</td></tr>`).join("")}</tbody></table>
    <div class="hint">KI-Benutzer: Agenten sollen künftig als eigener, nicht-physischer Benutzer im Backend buchen. Bodo und sellify unterstützen das noch nicht – vorbereitet, nicht umgesetzt. sellify ist aus dieser Seite nicht prüfbar; die Claude-Sitzung erreicht es über ihren Connector.</div>
    <div class="btns"><button class="btn sm" id="sbodo">⚙ Eigene Bodo-Mandanten</button></div>`;
  const D=(v)=>{const [oid,k]=v.split("|"),o=orgById(oid);o.dienste={...(o.dienste||{})};o.dienste[k]={...(o.dienste[k]||{})};return [o,k,o.dienste[k]]};
  document.querySelectorAll("[data-ds]").forEach(s=>s.onchange=()=>{const [o,k,d]=D(s.dataset.ds);if(!s.value){delete o.dienste[k]}else{d.sys=s.value;d.ent=SYSKAT[s.value].ent[k][0][0];if(!SYSKAT[s.value].mand){delete d.orgId;delete d.orgN}
      else if(!d.orgId){const andere=Object.values(o.dienste).find(x=>x&&x.sys===s.value&&x.orgId);if(andere){d.orgId=andere.orgId;d.orgN=andere.orgN}}}
    if(o.chk&&o.chk.erg)delete o.chk.erg[k];schedule();einst()});
  document.querySelectorAll("[data-dm]").forEach(s=>s.onchange=()=>{const [o,k,d]=D(s.dataset.dm);const m=M.find(x=>x.id===s.value);if(m){d.orgId=m.id;d.orgN=m.name}else{delete d.orgId;delete d.orgN}if(o.chk&&o.chk.erg)delete o.chk.erg[k];schedule();einst()});
  document.querySelectorAll("[data-de]").forEach(s=>s.onchange=()=>{const [o,k,d]=D(s.dataset.de);d.ent=s.value;if(o.chk&&o.chk.erg)delete o.chk.erg[k];schedule();einst()});
  document.querySelectorAll("[data-dchk]").forEach(b=>b.onclick=async()=>{b.disabled=true;b.textContent="prüfe …";await dienstPruefen(orgById(b.dataset.dchk));einst()});
  $("#sbodo").onclick=ownOrgsDlg}
async function dienstPruefen(o){const r={at:new Date().toISOString(),erg:{}};let orgs=null;
  for(const [k] of DIENSTE){const d=dienstVon(o,k);if(!d)continue;const S=SYSKAT[d.sys];
    if(!S.pruefbar){r.erg[k]={st:"info",t:S.n+" ist aus dieser Seite nicht prüfbar – die Claude-Sitzung nutzt den Connector „"+S.mcp+"“."};continue}
    if(S.mand&&!d.orgId){r.erg[k]={st:"err",t:"Kein Mandant gewählt"};continue}
    try{if(!orgs)orgs=((await bodo("bodo_list_orgs",{}))||{}).orgs||[];const m=orgs.find(x=>x.orgId===d.orgId);
      if(!m){r.erg[k]={st:"err",t:"Mandant „"+(d.orgN||d.orgId)+"“ ist für dieses Konto nicht erreichbar"};continue}
      if(m.mcpAccess&&m.mcpAccess.allowed===false){r.erg[k]={st:"err",t:m.mcpAccess.message||"KI-Zugang im Mandanten gesperrt"};continue}
      await bodo("bodo_search",{resourceType:d.ent,orgId:d.orgId,limit:1,fields:["_id"]});r.erg[k]={st:"ok",t:"Mandant „"+m.name+"“ erreichbar, "+entN(d.sys,k,d.ent)+" lesbar"}}
    catch(e){r.erg[k]={st:"err",t:mcpMsg(e)}}}
  o.chk=r;schedule();const n=Object.values(r.erg).filter(x=>x.st==="err").length;toast(Object.keys(r.erg).length?(n?n+" Dienst"+(n===1?"":"e")+" mit Problem":"Alle Dienste erreichbar"):"Keine Dienste zugeordnet");return r}
// Kontext für Claude: Standard-Zielsysteme des Organigramms
function dienstKontext(o){if(!o||!o.dienste)return "";const L=DIENSTE.map(([k,l])=>{const d=dienstVon(o,k);return d?l+" = "+SYSKAT[d.sys].n+(d.orgId?" (Mandant "+(d.orgN||"")+", orgId "+d.orgId+")":"")+", Entität "+d.ent:null}).filter(Boolean);
  return L.length?"ANBINDUNGEN des Organigramms (Standard, wenn der Auftrag kein System oder keinen Mandanten nennt; nennt der Auftrag ausdrücklich etwas anderes, gilt der Auftrag, bei Widerspruch nachfragen): "+L.join("; ")+".":""}
// Datenspur eines Auftrags (von Claude geschrieben: spur = [{dienst, sys, orgId, ent, id, url, akt}])
function spurHtml(j){const S=(j.spur||[]).filter(Boolean);if(!S.length)return "";const dn=k=>(DIENSTE.find(d=>d[0]===k)||[k,k==="sonst"?"Sonstiges":k||"–"])[1];
  return `<div class="flabel" style="margin-top:10px">Datenspur (${S.length})</div><div class="spur">${S.map(s=>`<div class="spr"><span class="sprd">${esc(dn(s.dienst))}</span><span>${esc((SYSKAT[s.sys]||{n:s.sys||""}).n)}${s.orgN?" · "+esc(s.orgN):""} · ${esc(s.ent||"")} ${s.akt?"· "+esc(s.akt):""}</span>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">↗</a>`:""}</div>`).join("")}</div>`}
