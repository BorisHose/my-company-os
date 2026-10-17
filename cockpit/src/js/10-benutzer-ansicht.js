function users(){
  const L=US.map((u,i)=>[u,i]).filter(([u])=>UOLD||u.aktiv!==false);
  $("#ulist").innerHTML=(L.length?"":'<p class="hint">Noch keine Benutzer.</p>')+L.map(([u,i])=>{const ag=AG.filter(a=>a.owner===u.id).length;
    return `<div class="uitem ${i===ucur?'on':''} ${u.aktiv===false?'off':''}" data-u="${i}">${av(u,36)}<div class="t"><b>${esc(u.n)}</b><small>${esc(u.rolle||"")}${u.rolle?" · ":""}${(u.maps||[]).length} Zuordnung(en)${ag?" · verantwortlich für "+ag+" Agent(en)":""}${u.aktiv===false?" · ausgeschieden":""}</small></div></div>`}).join("");
  document.querySelectorAll("[data-u]").forEach(e=>e.onclick=()=>{if(+e.dataset.u!==ucur&&blocked())return;ucur=+e.dataset.u;users()});
  uedit();
}
function uedit(){
  const u=US[ucur];if(!u){$("#uedit").innerHTML='<p class="hint">Links einen Benutzer wählen oder neu anlegen.</p>';return}
  const ags=AG.filter(a=>a.owner===u.id),dep=AG.filter(a=>a.dep===u.id),ue=isEd("user",u.id);
  $("#uedit").classList.toggle("editing",ue);
  $("#uedit").innerHTML=`<div class="uhead">${av(u,72)}<div style="flex:1"><h2 style="margin:0 0 6px">Benutzer bearbeiten ${u.aktiv===false?'<span class="mark">Ausgeschieden</span>':'<span class="badge" style="background:var(--okbg);color:var(--ok);text-transform:none;letter-spacing:0">Aktiv</span>'}</h2>
     <div class="btns"><label class="btn sm" style="cursor:pointer">Bild hochladen<input type="file" id="uimg" accept="image/*" style="display:none"></label>${u.img?'<button class="btn sm" id="uimgx">Bild entfernen</button>':''}<span class="hint" style="margin:0;align-self:center">Kopf wird automatisch mittig ausgerichtet, danach anpassbar</span></div></div></div>
   <div class="etop" style="margin:4px 0 10px"><span class="flabel" style="margin:0;flex:1">Angaben und Zuordnungen ${ue?"":'<span class="hint" style="font-weight:400">– nur lesen</span>'}</span>${edBtns(ue,'id="uedbtn"')}</div>
   <fieldset ${ue?"":"disabled"}>
   <div class="row"><div class="field"><label>Name</label><input type="text" id="un" value="${esc(u.n)}"></div><div class="field"><label>Kürzel (für den Avatar ohne Bild)</label><input type="text" id="ukz" value="${esc(u.kz||"")}" placeholder="${esc(ini(u.n))}"></div></div>
   <div class="row"><div class="field"><label>Rolle / Funktion</label><input type="text" id="url" value="${esc(u.rolle||"")}" placeholder="z. B. Geschäftsführung, Vertrieb"></div><div class="field"><label>E-Mail</label><input type="text" id="um" value="${esc(u.mail||"")}"></div></div>
   <div class="field"><label>Gehört zu Organisation</label><div style="display:flex;gap:16px;flex-wrap:wrap">${ORGS().map(o=>`<label class="cb" style="margin:0"><input type="checkbox" data-uorg="${o.id}" ${(u.orgs||[]).includes(o.id)?'checked':''}> ${esc(o.n)}</label>`).join("")}</div><div class="hint">Bestimmt, wer im Organigramm dieser Organisation als Leitung zur Auswahl steht.</div></div>
   ${u.aktiv===false?'<div class="warnbox" style="margin:0 0 12px;font-size:13px"><b>Ausgeschieden.</b> Der Benutzer bleibt mit allen Zuordnungen erhalten, wird aber nicht mehr zur Auswahl angeboten.</div>':''}
   </fieldset>
   <div class="field" style="margin-top:12px"><span class="flabel">Vertreten in Zielsystemen <span class="hint" style="font-weight:400">– nur systemseitig, nicht von Hand änderbar</span></span>
    <div class="mapw"><table class="map"><thead><tr><th>System</th><th>Instanz / Mandant</th><th>Benutzer dort</th><th>E-Mail dort</th><th>Status</th><th>Kennungen</th><th></th></tr></thead><tbody>
    ${(u.maps||[]).map((m,i)=>`<tr><td>${esc(SYS[m.sys]||m.sys||"")}</td><td>${esc(m.inst||"")}</td><td>${esc(m.ext||"")}</td><td>${esc(m.mail||"")}</td><td style="white-space:nowrap">${stBadge(m)}${m.rollen?`<div class="hint" style="margin:2px 0 0">${esc(m.rollen)}</div>`:""}</td><td class="mids" title="${esc("Instanz-ID: "+(m.instId||"–")+"\nBenutzer-ID: "+(m.extId||"–")+(m.userId?"\nKonto-ID: "+m.userId:""))}"><code>${esc(String(m.instId||"–").slice(0,8))}…</code> / <code>${esc(String(m.extId||"–").slice(0,8))}…</code>${m.quelle?`<div class="hint" style="margin:2px 0 0">${esc(m.quelle)}${m.at?" · "+esc(new Date(m.at).toLocaleDateString("de-DE")):""}</div>`:""}</td><td>${ue?`<button class="ic" data-mx="${i}" title="Zuordnung lösen">×</button>`:""}</td></tr>`).join("")}
    ${uFehlt(u).map(f=>`<tr class="mfehlt"><td>Bodo</td><td>${esc(f.name)}</td><td colspan="3" class="hint">noch nicht zugeordnet</td><td colspan="2">${ue?"":`<button class="btn sm" data-mfind="${esc(f.id)}">In Bodo suchen</button>`}</td></tr>`).join("")}
    ${!(u.maps||[]).length&&!uFehlt(u).length?`<tr><td colspan="7" class="hint">Noch keine Zuordnung.</td></tr>`:""}
    </tbody></table></div>
    ${ue?"":(u.maps||[]).map((m,i)=>m.sys==="bodo"&&m.instId&&m.extId&&m.status==="unclaimed"?`<div class="hint" style="margin:6px 0 0">${esc(m.inst)}: Benutzer ohne Zugang – <button class="btn sm" data-inv="${i}" title="Einladung mit Mail aus Bodo schicken">Einladen …</button></div>`:"").join("")}
    ${ue?"":`<div class="btns" style="margin-top:6px"><button class="btn sm" id="mwiz">In weiteren Bodo-Mandanten anlegen …</button><button class="btn sm" id="msync">Mit Bodo abgleichen</button></div>`}
    <div class="hint">Je Benutzer gehört in jeden Bodo-Mandanten seiner Organigramme (⚙ Anbindungen) genau eine Zuordnung. Sie entsteht nur systemseitig: „Mit Bodo abgleichen“ liest bestehende Zuordnungen neu und ergänzt fehlende, wenn der Benutzer im Mandanten eindeutig gefunden wird; sonst „In Bodo suchen“ bzw. „In weiteren Bodo-Mandanten anlegen …“. Von Hand geänderte Kennungen würden die Zuordnung zerstören und sind daher gesperrt.</div></div>
   <div class="field"><span class="flabel">Verantwortlich für</span>${ags.length?ags.map(a=>`<span class="chip" style="display:inline-flex;margin:0 6px 6px 0">${esc(a.n)}</span>`).join(""):'<span class="hint">noch keinen Agenten</span>'}${dep.length?`<div class="hint">Vertretung für: ${dep.map(a=>esc(a.n)).join(", ")}</div>`:""}</div>
   <div class="btns" style="border-top:1px solid var(--line);padding-top:12px"><button class="btn p" id="uak">${u.aktiv===false?'Wieder aktiv setzen':'Als ausgeschieden markieren'}</button>
     <span class="hint" style="margin:0;align-self:center;flex:1">${u.aktiv===false?'':'Empfohlen statt Löschen – Verweise in Agenten und Abläufen bleiben gültig.'}</span>
     <button class="btn d" id="udel" ${ags.length||dep.length?'disabled title="Ist noch Agenten zugeordnet – stattdessen als ausgeschieden markieren"':''}>Endgültig löschen …</button></div>`;
  const up=()=>{users();schedule()};
  $("#un").onchange=e=>{u.n=e.target.value.trim()||u.n;up()};$("#ukz").onchange=e=>{u.kz=e.target.value.trim();up()};
  $("#url").onchange=e=>{u.rolle=e.target.value;up()};$("#um").onchange=e=>{u.mail=e.target.value.trim();schedule()};
  $("#uak").onclick=()=>{u.aktiv=u.aktiv===false;up();toast(u.aktiv?"Wieder aktiv":"Als ausgeschieden markiert"+(UOLD?"":" – in der Liste über „Ausgeschiedene zeigen“ sichtbar"))};
  $("#uimg").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;const r=await cropDlg(f);if(r){u.img=r;up();toast("Bild gespeichert")}};
  const ix=$("#uimgx");if(ix)ix.onclick=()=>{delete u.img;up()};
  document.querySelectorAll("[data-uorg]").forEach(c=>c.onchange=()=>{const s=new Set(u.orgs||[]);c.checked?s.add(c.dataset.uorg):s.delete(c.dataset.uorg);u.orgs=ORGS().map(o=>o.id).filter(x=>s.has(x));users()});
  document.querySelectorAll("[data-mfind]").forEach(b=>b.onclick=()=>uSuchen(u,b.dataset.mfind,b));
  document.querySelectorAll("[data-mx]").forEach(b=>b.onclick=async()=>{const m=u.maps[+b.dataset.mx];if(await askOk("Zuordnung „"+(SYS[m.sys]||m.sys)+(m.inst?" · "+m.inst:"")+"“ lösen? Der Benutzer im Zielsystem bleibt unverändert; neu zuordnen geht nur über „Mit Bodo abgleichen“ oder „In Bodo suchen“. Wirksam mit „Speichern“.","Zuordnung lösen")){u.maps.splice(+b.dataset.mx,1);users()}});
  const mw=$("#mwiz");if(mw){mw.onclick=()=>wizard(u);$("#msync").onclick=()=>syncUser(u)}
  const ub=$("#uedbtn");if(ub)ub.onclick=()=>{if(startEdit("user",u.id,null,["users/"+u.id]))users()};bindEd($("#uedit"),()=>users());
  document.querySelectorAll("[data-inv]").forEach(b=>b.onclick=()=>inviteDlg(u,u.maps[+b.dataset.inv]));
  $("#udel").onclick=()=>{const d=document.createElement("div");d.id="dlg";
    d.innerHTML=`<div class="modal" style="z-index:40"><div class="box"><h3 style="margin:0 0 10px;font-size:16px;color:#b42318">Benutzer endgültig löschen?</h3>
      <p style="margin:0 0 8px"><b>${esc(u.n)}</b> wird mit allen ${(u.maps||[]).length} Zuordnung(en) und dem Bild gelöscht. Das lässt sich <b>nicht rückgängig machen</b>.</p>
      ${u.aktiv!==false?'<p class="hint" style="margin:0 0 12px">Wenn die Person nur nicht mehr dabei ist, ist „Als ausgeschieden markieren“ die bessere Wahl.</p>':''}
      <label class="cb" style="margin:4px 0 12px"><input type="checkbox" id="delok"> Ja, ich möchte „${esc(u.n)}“ endgültig löschen.</label>
      <div class="btns" style="justify-content:flex-end"><button class="btn" data-c>Abbrechen</button>${u.aktiv!==false?'<button class="btn" data-a>Stattdessen ausgeschieden</button>':''}<button class="btn d" data-d disabled>Endgültig löschen</button></div></div></div>`;
    document.body.appendChild(d);const close=()=>d.remove();
    d.querySelector("#delok").onchange=e=>{d.querySelector("[data-d]").disabled=!e.target.checked};
    d.querySelector("[data-c]").onclick=close;
    const al=d.querySelector("[data-a]");if(al)al.onclick=()=>{close();u.aktiv=false;up();toast("Als ausgeschieden markiert")};
    d.querySelector("[data-d]").onclick=()=>{close();US.splice(ucur,1);ucur=-1;up();toast("Benutzer gelöscht")}};
}

// Soll-Zuordnungen: jeder Bodo-Mandant, den die Organigramme des Benutzers unter ⚙ Anbindungen nutzen; ohne Anbindungen die eigenen Bodo-Mandanten
function uSoll(u){const S=new Map();(u.orgs||[]).forEach(oid=>{const o=orgById(oid);if(!o)return;DIENSTE.forEach(([k])=>{const d=dienstVon(o,k);if(d&&d.sys==="bodo"&&d.orgId)S.set(d.orgId,d.orgN||d.orgId)})});
  if(!S.size)ownOrgs().forEach(m=>S.set(m.id,m.name));return [...S].map(([id,name])=>({id,name}))}
const uFehlt=u=>uSoll(u).filter(f=>!(u.maps||[]).some(m=>m.sys==="bodo"&&m.instId===f.id));
const uMapVon=(f,h)=>({sys:"bodo",inst:f.name,instId:f.id,ext:h.name||"",mail:h.email||"",extId:h.membershipId,userId:h.userId||"",status:h.status||"",rollen:(h.roleNames||[]).join(", "),quelle:"aus Bodo gelesen",at:new Date().toISOString()});
// Systemseitig zuordnen: im Mandanten nach E-Mail und Name suchen; eindeutiger Treffer wird übernommen, mehrere zur Auswahl, keiner → Hinweis auf „anlegen“
async function uSuchen(u,orgId,btn){const f=uSoll(u).find(x=>x.id===orgId)||{id:orgId,name:orgId};if(btn){btn.disabled=true;btn.textContent="sucht …"}
  try{const H=(await findSeats(orgId,u.mail,u.n)).filter(h=>!US.some(x=>x!==u&&(x.maps||[]).some(m=>m.sys==="bodo"&&m.instId===orgId&&m.extId===h.membershipId)));
    if(H.length===1){(u.maps=u.maps||[]).push(uMapVon(f,H[0]));schedule();users();toast("Zugeordnet: "+(H[0].name||u.n)+" in "+f.name);return}
    if(!H.length){users();toast("In „"+f.name+"“ nicht gefunden – über „In weiteren Bodo-Mandanten anlegen …“ anlegen");return}
    const v=await dlg(`<h3 style="margin:0 0 10px;font-size:15px">Welcher Benutzer in „${esc(f.name)}“ ist ${esc(u.n)}?</h3>${H.map((h,i)=>`<label class="cb"><input type="radio" name="usel" value="${i}" ${i?"":"checked"}> ${esc(h.name||"")} · ${esc(h.email||"")} <span class="hint" style="margin:0">${esc(ST[h.status]||h.status||"")}</span></label>`).join("")}<input type="hidden" id="dlgin" value="0"><div class="btns" style="margin-top:12px;justify-content:flex-end"><button class="btn" data-no>Abbrechen</button><button class="btn p" data-yes>Zuordnen</button></div>`);
    users();if(v==null)return;const i=+((document.querySelector('[name="usel"]:checked')||{}).value||0);(u.maps=u.maps||[]).push(uMapVon(f,H[i]));schedule();users();toast("Zugeordnet")}
  catch(e){users();toast(mcpMsg(e))}}
