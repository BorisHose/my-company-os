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
   <div class="field" style="margin-top:12px"><span class="flabel">Vertreten in Zielsystemen</span>
    <table class="map"><thead><tr><th>System</th><th>Instanz / Mandant</th><th>Instanz-ID</th><th>Benutzer dort</th><th>E-Mail dort</th><th>Benutzer-ID dort</th><th>Status</th><th></th></tr></thead><tbody>
    ${(u.maps||[]).map((m,i)=>`<tr><td><select data-mf="sys" data-mi="${i}">${Object.entries(SYS).map(([k,l])=>`<option value="${k}" ${m.sys===k?'selected':''}>${l}</option>`).join("")}</select></td>
      ${["inst","instId","ext","mail","extId"].map(f=>`<td><input type="text" data-mf="${f}" data-mi="${i}" value="${esc(m[f]||"")}"></td>`).join("")}<td style="white-space:nowrap">${stBadge(m)}</td><td><button class="ic" data-mx="${i}" title="Zuordnung entfernen">×</button></td></tr>`).join("")||`<tr><td colspan="8" class="hint">Noch keine Zuordnung.</td></tr>`}
    </tbody></table>
    <div class="btns edonly" style="margin-top:6px"><button class="btn sm" id="madd">+ Zuordnung von Hand</button></div></fieldset>
    ${ue?"":(u.maps||[]).map((m,i)=>m.sys==="bodo"&&m.instId&&m.extId&&m.status==="unclaimed"?`<div class="hint" style="margin:6px 0 0">${esc(m.inst)}: Benutzer ohne Zugang – <button class="btn sm" data-inv="${i}" title="Einladung mit Mail aus Bodo schicken">Einladen …</button></div>`:"").join("")}
    ${ue?"":`<div class="btns" style="margin-top:6px"><button class="btn sm" id="mwiz">In weiteren Bodo-Mandanten anlegen …</button><button class="btn sm" id="msync">Mit Bodo abgleichen</button></div>`}
    <div class="hint">Ein Benutzer kann in mehreren Systemen und Mandanten vertreten sein, auch mehrfach im selben System. Die IDs braucht Company OS später, um Aufgaben und Freigaben beim richtigen Benutzer im Zielsystem abzulegen.${(u.maps||[]).some(m=>m.quelle)?"<br>Zuordnungen mit Quelle wurden per MCP aus dem Zielsystem gelesen.":""}</div></div>
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
  document.querySelectorAll("[data-mf]").forEach(el=>el.onchange=()=>{u.maps[+el.dataset.mi][el.dataset.mf]=el.value.trim();schedule()});
  document.querySelectorAll("[data-mx]").forEach(b=>b.onclick=async()=>{const m=u.maps[+b.dataset.mx];if(await askOk("Zuordnung „"+(SYS[m.sys]||m.sys)+(m.inst?" · "+m.inst:"")+"“ entfernen?")){u.maps.splice(+b.dataset.mx,1);up()}});
  const mw=$("#mwiz");if(mw){mw.onclick=()=>wizard(u);$("#msync").onclick=()=>syncUser(u)}
  const ub=$("#uedbtn");if(ub)ub.onclick=()=>{if(startEdit("user",u.id,null,["users/"+u.id]))users()};bindEd($("#uedit"),()=>users());
  document.querySelectorAll("[data-inv]").forEach(b=>b.onclick=()=>inviteDlg(u,u.maps[+b.dataset.inv]));
  $("#madd").onclick=()=>{(u.maps=u.maps||[]).push({sys:"bodo",inst:"",instId:"",ext:u.n,mail:u.mail||"",extId:""});up()};
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
