// ===== Rückgabe an den Heimat-Anbieter (Claude): erst speichern, dann ausdrücklich freigeben =====
const PFLD={agents:{w:"Wann einsetzen?",bsp:"Beispielsätze",r:"Ziel",s:"Skills",own:"Regeln",m:"Modell",n:"Name"},skills:{d:"Beschreibung",lp:"Leitplanken",body:"Inhalt (SKILL.md)",prof:"Profile Bodo/sellify"}};
const provHome=(c,o)=>c==="agents"?(o.id==="ag-schulungsbegleiter"?"Plugin bodo-schulung":"Plugin organigraph-agenten"):(["konto","plugin"].includes(srcOf(o))?(srcOf(o)==="plugin"?"Plugin-Skill ":"Konto-Skill ")+KS(o).join(" + "):null);
const provVal=(c,f,v)=>{if(v==null||v==="")return "–";if(c==="agents"&&f==="s")return v.map(id=>sk(id)?sk(id).n:id).join(", ")||"–";if(Array.isArray(v))return v.join(" · ")||"–";if(typeof v==="object")return JSON.stringify(v).slice(0,300);return String(v)};
function markProv(c,o,old){if(!old||!provHome(c,o))return false;const F=Object.keys(PFLD[c]),pv=o.prov?{...o.prov,alt:{...o.prov.alt}}:{alt:{}};
  F.forEach(f=>{const a=JSON.stringify(old[f]??null),n=JSON.stringify(o[f]??null);if(a===n)return;if(!(f in pv.alt))pv.alt[f]=old[f]??null;if(JSON.stringify(pv.alt[f])===n)delete pv.alt[f]});
  if(!Object.keys(pv.alt).length){const had=!!o.prov;delete o.prov;return false}
  const changed=JSON.stringify(pv.alt)!==JSON.stringify(o.prov&&o.prov.alt);o.prov={alt:pv.alt,stat:changed||!o.prov?"offen":o.prov.stat,seit:new Date().toISOString().slice(0,10)};return changed}
const provList=()=>[...AG.map(a=>["agents",a]),...SK.map(s=>["skills",s])].filter(([c,o])=>o.prov);
function provConfirm(L){if(!L.length)return;const rows=L.map(([c,o],i)=>`<div class="provit"><div class="pvh"><b>${c==="agents"?"Agent":"Skill"} „${esc(o.n)}“</b><span class="hint" style="margin:0">→ ${esc(provHome(c,o))}</span></div>
     ${Object.keys(o.prov.alt).map(f=>`<div class="pvf"><span class="pvl">${esc(PFLD[c][f]||f)}</span><div class="pvd"><div class="pvo">${esc(provVal(c,f,o.prov.alt[f]))}</div><div class="pvn">${esc(provVal(c,f,o[f]))}</div></div></div>`).join("")}</div>`).join("");
  const close=modalBox(`<div class="bhead"><h3>Änderung an Claude zurückgeben?</h3><button class="ic" id="mclose" title="Schließen" style="font-size:18px">✕</button></div>
   <p style="margin:0 0 10px">Im Cockpit ist gespeichert. Diese Änderungen betreffen auch den Agenten bzw. Skill bei Claude. Sie gehen erst dorthin, wenn du sie hier freigibst – und werden beim nächsten <b>⟳ Abgleich</b> übertragen, dort noch einmal mit Freigabekarte.</p>
   ${rows}<div class="pvleg"><span class="pvo">bisher bei Claude</span> <span class="pvn">neu im Cockpit</span></div>
   <label class="cb" style="margin:12px 0 0"><input type="checkbox" id="pvok"> Ich habe die Änderung geprüft – sie soll so zu Claude.</label>
   <div class="btns" style="justify-content:flex-end;margin-top:14px"><button class="btn" id="pvno">Nur im Cockpit lassen</button><button class="btn p" id="pvyes" disabled>Zur Übertragung freigeben</button></div>`,true);
  $("#pvok").onchange=e=>$("#pvyes").disabled=!e.target.checked;
  $("#mclose").onclick=$("#pvno").onclick=()=>{close();toast("Nur im Cockpit – Freigabe später über ⟳ Abgleich möglich")};
  $("#pvyes").onclick=()=>{L.forEach(([c,o])=>{if(o.prov){o.prov.stat="frei";o.prov.frei=new Date().toISOString()}});close();render();schedule();toast("Freigegeben – wird beim nächsten Abgleich zu Claude übertragen")}}
function saveEdit(){if(!EDIT)return;const L=[];EDIT.orig.forEach((json,k)=>{const [c,id]=k.split("/");if(!PFLD[c]||!json)return;const o=COLL()[c].find(x=>x.id===id);if(o&&markProv(c,o,JSON.parse(json)))L.push([c,o])});
  EDIT=null;schedule();toast("Gespeichert");if(L.length)setTimeout(()=>provConfirm(L),60)}
function cancelEdit(){if(!EDIT)return;EDIT.orig.forEach((json,k)=>{
    if(k==="meta/config"){const o=JSON.parse(json);GR=[...o.groups];GLOBAL=[...o.globals];SET={...SET,...o.settings};return}
    const [c,id]=k.split("/"),arr=COLL()[c],i=arr.findIndex(x=>x.id===id);if(i<0){if(json)arr.push(JSON.parse(json));return}
    if(json===null){arr.splice(i,1);if(c==="agents")cur=-1;return}
    const ob=arr[i],o=JSON.parse(json);if(c==="flows")o.N.forEach(n=>{if("aid" in n)n.a=AG.find(a=>a.id===n.aid)||null});
    Object.keys(ob).forEach(x=>delete ob[x]);Object.assign(ob,o)});
  (EDIT.newc||[]).forEach(c=>{const arr=COLL()[c];for(let i=arr.length-1;i>=0;i--)if(!EDIT.orig.has(c+"/"+arr[i].id))arr.splice(i,1)});
  DP.sort((a,b)=>(a.ord??0)-(b.ord??0));EDIT=null;toast("Änderungen verworfen")}
const edBtns=(on,pre)=>on?`<button class="btn sm p" data-esave>Speichern</button><button class="btn sm" data-ecancel>Abbrechen</button>`:`<button class="btn sm ebtn" ${pre||""} title="Bereich bearbeiten">✎ Bearbeiten</button>`;
function bindEd(root,after){(root||document).querySelectorAll("[data-esave]").forEach(b=>b.onclick=e=>{e.stopPropagation();saveEdit();after()});
  (root||document).querySelectorAll("[data-ecancel]").forEach(b=>b.onclick=e=>{e.stopPropagation();cancelEdit();after()})}