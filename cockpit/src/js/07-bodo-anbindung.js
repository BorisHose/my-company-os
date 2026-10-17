// ===== Bodo-Anbindung (MCP) =====
const BODO="bodo solutions";
const DEF_ORGS=[]; // eigene Mandanten stehen in den Einstellungen (settings.bodoOrgs)
const ownOrgs=()=>(SET.bodoOrgs&&SET.bodoOrgs.length?SET.bodoOrgs:DEF_ORGS);
let MCP;const mcpP=(window.claude?window.claude.use("mcp"):Promise.resolve(null)).then(m=>MCP=m).catch(()=>MCP=null);
const ST={active:"aktiv",unclaimed:"ohne Zugang",invited:"eingeladen",suspended:"gesperrt",left:"ausgetreten"};
const stBadge=m=>m.sys!=="bodo"||!m.status?"":`<span class="stb ${m.status}">${ST[m.status]||esc(m.status)}</span>`;
function mcpMsg(e){const c=e&&e.code;return c==="server_not_connected"?"Bodo-Verbindung nicht gefunden – in claude.ai unter Einstellungen → Konnektoren „bodo solutions“ hinzufügen."
  :c==="needs_reauth"?"Bodo-Verbindung abgelaufen – in claude.ai unter Einstellungen → Konnektoren neu verbinden."
  :c==="not_in_manifest"||c==="not_granted"||c==="consent_required"?"Der Zugriff auf Bodo wurde für diese Seite nicht erlaubt (Berechtigungen der Seite)."
  :c==="approval_required"?"Der Aufruf braucht deine Freigabe – bitte erneut versuchen und erlauben."
  :c==="selection_required"?"Mehrere Bodo-Verbindungen vorhanden – bitte in claude.ai eine auswählen."
  :c==="server_unavailable"?"Bodo antwortet gerade nicht – kurz warten und erneut versuchen."
  :c==="tool_error"?"Bodo hat abgelehnt: "+(e.message||""):"Fehler bei Bodo ("+(c||"unbekannt")+"): "+(e&&e.message||"")}
async function bodo(tool,input,write){await mcpP;if(!MCP)throw {code:"not_granted",message:"Bodo-Anbindung auf dieser Seite nicht verfügbar"};
  const r=await MCP.callTool(BODO,tool,input,write?{cache:false}:undefined);let p=r.payload;if(typeof p==="string"){try{p=JSON.parse(p)}catch(x){}}return p}
const SELLIFY="sellify_mcp";
async function sellify(tool,input){await mcpP;if(!MCP)throw {code:"not_granted",message:"sellify-Anbindung auf dieser Seite nicht verfügbar"};
  const r=await MCP.callTool(SELLIFY,tool,input);let p=r.payload;if(typeof p==="string"){try{p=JSON.parse(p)}catch(x){}}return p}
const sfMsg=e=>mcpMsg(e).replace(/„bodo solutions“/g,"„sellify“").replace(/Bodo/g,"sellify");
async function findSeats(orgId,mail,name){const q=async s=>{const p=await bodo("bodo_search",{resourceType:"benutzer",orgId,query:s,limit:50});return (p&&p.items||[]).map(x=>x.data||{})};
  const L=[];const add=a=>a.forEach(x=>{if(!L.some(y=>y.membershipId===x.membershipId))L.push(x)});
  if(mail)add(await q(mail));if(name)add(await q(name));
  const m=(mail||"").toLowerCase(),nn=(name||"").toLowerCase();
  return L.filter(x=>x.status!=="left"&&((m&&(x.email||"").toLowerCase()===m)||(nn&&(x.name||"").toLowerCase()===nn)))}
// zweistufig: erster Aufruf, ggf. Vorschau mit confirmToken -> confirmFn entscheidet
async function bodoAction(orgId,action,fields,confirmFn){const base={resourceType:"benutzer",action,orgId,fields};
  let r=await bodo("bodo_action",base,1);
  if(r&&r.vollzug!=="ausgefuehrt"&&r.confirmToken){if(!await confirmFn(r))return {abgebrochen:true};r=await bodo("bodo_action",{...base,confirmToken:r.confirmToken},1)}
  if(!r||r.vollzug!=="ausgefuehrt")throw {code:"tool_error",message:(r&&(r.meldung||r.message||r.vollzug))||"nicht ausgeführt"};return r}
const confirmBodo=(titel)=>r=>dlg(`<h3 style="margin:0 0 10px;font-size:15px">${esc(titel)}</h3><p style="margin:0 0 8px">Bodo verlangt für diese Aktion eine Bestätigung.</p>${r.vorschau&&r.vorschau.wirkung?`<div class="infobox">${esc(r.vorschau.wirkung)}</div>`:""}<div class="btns" style="justify-content:flex-end"><button class="btn" data-no>Abbrechen</button><button class="btn p" data-yes>In Bodo bestätigen</button></div>`).then(v=>!!v);
function modalBox(html,wide){$("#modal").innerHTML=`<div class="modal"><div class="box wz ${wide?'wide':''}" id="box">${html}</div></div>`;return ()=>$("#modal").innerHTML=""}
// Eigene Mandanten festlegen
async function ownOrgsDlg(){const close=modalBox(`<div class="bhead"><h3>Eigene Bodo-Mandanten</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div><p class="hint" style="margin:0 0 10px">Nur diese Mandanten bietet der Benutzer-Assistent an. Kundensysteme bleiben außen vor.</p><div id="olist" class="hint">Lade Mandanten aus Bodo …</div><div class="btns" style="margin-top:12px;justify-content:flex-end"><button class="btn" id="mx">Abbrechen</button><button class="btn p" id="ms" disabled>Speichern</button></div>`);
  $("#mclose").onclick=close;$("#mx").onclick=close;
  try{const p=await bodo("bodo_list_orgs",{});const O=(p&&p.orgs)||[],sel=new Set(ownOrgs().map(o=>o.id));
    $("#olist").innerHTML=O.map(o=>`<label class="cb"><input type="checkbox" data-o="${o.orgId}" data-n="${esc(o.name)}" ${sel.has(o.orgId)?'checked':''}> ${esc(o.name)}${o.instanzArt?` <span class="badge">${esc(o.instanzArt)}</span>`:""}</label>`).join("");$("#ms").disabled=false;
    $("#ms").onclick=()=>{SET.bodoOrgs=[...document.querySelectorAll("[data-o]:checked")].map(c=>({id:c.dataset.o,name:c.dataset.n}));schedule();close();toast("Eigene Mandanten gespeichert")}}
  catch(e){$("#olist").innerHTML=`<div class="warnbox">${esc(mcpMsg(e))}</div>`}}
// Assistent Neuer Benutzer / weitere Mandanten
function wizard(exist){
  const W={step:exist?2:1,vn:"",nn:"",n:exist?exist.n:"",kz:exist?(exist.kz||""):"",mail:exist?(exist.mail||""):"",rolle:exist?(exist.rolle||""):"",orgs:new Set(),chk:{},dec:{},err:""};
  const has=o=>exist&&(exist.maps||[]).some(m=>m.sys==="bodo"&&m.instId===o.id);
  const steps=["Person","Mandanten","Prüfung in Bodo","Zusammenfassung"];
  let close;
  const head=()=>`<div class="bhead"><h3>${exist?"„"+esc(exist.n)+"“ in weiteren Bodo-Mandanten anlegen":"Neuer Benutzer"}</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
    <div class="steps2">${steps.map((s,i)=>`<span class="${i+1===W.step?'on':i+1<W.step?'ok':''}">${i+1} · ${s}</span>`).join("")}</div>`;
  const nm=()=>W.n||[W.vn,W.nn].filter(Boolean).join(" ");
  const render=async()=>{let b="",foot="";
    if(W.step===1){
      b=`<div class="row"><div class="field"><label>Vorname</label><input type="text" id="wvn" value="${esc(W.vn)}"></div><div class="field"><label>Nachname</label><input type="text" id="wnn" value="${esc(W.nn)}"></div></div>
       <div class="row"><div class="field"><label>E-Mail</label><input type="text" id="wm" value="${esc(W.mail)}" placeholder="vorname.nachname@businessacts.de"></div><div class="field"><label>Kürzel (optional, in Bodo je Mandant eindeutig)</label><input type="text" id="wkz" value="${esc(W.kz)}"></div></div>
       <div class="field"><label>Rolle / Funktion in Company OS (optional)</label><input type="text" id="wr" value="${esc(W.rolle)}"></div>
       <div id="wdup"></div>`;
      foot=`<button class="btn" id="wx">Abbrechen</button><button class="btn p" id="wn">Weiter</button>`}
    if(W.step===2){
      const O=ownOrgs();
      b=`<p class="hint" style="margin:0 0 10px">In welchen Bodo-Mandanten soll ${esc(nm())} vertreten sein? Es werden nur deine eigenen Mandanten angeboten (⚙ Eigene Bodo-Mandanten).</p>
       ${O.map(o=>`<label class="cb"><input type="checkbox" data-wo="${o.id}" ${W.orgs.has(o.id)?'checked':''} ${has(o)?'disabled':''}> ${esc(o.name)}${has(o)?' <span class="hint" style="margin:0">– bereits zugeordnet</span>':''}</label>`).join("")}
       <div class="hint" style="margin-top:10px">Ohne Auswahl wird ${exist?"nichts geändert":"der Benutzer nur in Company OS angelegt"}.</div>`;
      foot=`${exist?"":'<button class="btn" id="wb" style="margin-right:auto">Zurück</button>'}<button class="btn" id="wx">Abbrechen</button><button class="btn p" id="wn">${W.orgs.size?"In Bodo prüfen":"Weiter"}</button>`}
    if(W.step===3){
      b=`<p class="hint" style="margin:0 0 10px">Dublettenprüfung je Mandant nach E-Mail und Name. Es wird noch nichts angelegt.</p>`+[...W.orgs].map(id=>{const o=ownOrgs().find(x=>x.id===id),c=W.chk[id];
        if(!c)return `<div class="chkrow"><h4>${esc(o.name)}</h4><span class="hint">prüfe …</span></div>`;
        if(c.err)return `<div class="chkrow"><h4>${esc(o.name)}</h4><div class="warnbox">${esc(c.err)}</div><label class="cb"><input type="radio" name="d_${id}" value="skip" checked> diesen Mandanten auslassen</label></div>`;
        const d=W.dec[id];
        return `<div class="chkrow"><h4>${esc(o.name)}</h4>${c.hits.length?c.hits.map(h=>`<label class="cb"><input type="radio" name="d_${id}" value="use:${h.membershipId}" ${d==="use:"+h.membershipId?'checked':''}> Vorhandenen Benutzer übernehmen: <b>${esc(h.name)}</b> · ${esc(h.email||"ohne E-Mail")} · <span class="stb ${h.status}">${ST[h.status]||esc(h.status)}</span>${(h.roleNames||[]).length?" · "+esc(h.roleNames.join(", ")):""}</label>`).join(""):'<div class="hint" style="margin:0 0 4px">Kein passender Benutzer gefunden.</div>'}
          <label class="cb"><input type="radio" name="d_${id}" value="new" ${d==="new"?'checked':''}> Neu als <b>Benutzer ohne Zugang</b> anlegen (keine Einladung, keine Mail – einladen später im Benutzer)</label>
          <label class="cb"><input type="radio" name="d_${id}" value="skip" ${d==="skip"?'checked':''}> diesen Mandanten auslassen</label></div>`}).join("");
      foot=`<button class="btn" id="wb" style="margin-right:auto">Zurück</button><button class="btn" id="wx">Abbrechen</button><button class="btn p" id="wn" ${[...W.orgs].some(id=>!W.chk[id])?'disabled':''}>Weiter</button>`}
    if(W.step===4){
      const rows=[...W.orgs].map(id=>{const o=ownOrgs().find(x=>x.id===id),d=W.dec[id]||"skip",h=d.startsWith("use:")&&W.chk[id].hits.find(x=>"use:"+x.membershipId===d);
        return `<tr><td>${esc(o.name)}</td><td>${d==="new"?"Benutzer ohne Zugang anlegen (keine Mail)":h?"vorhandenen Benutzer übernehmen ("+esc(h.name)+")":"auslassen"}</td></tr>`}).join("");
      b=`<table class="nt" style="margin-bottom:12px"><tbody><tr><td><b>Company OS</b></td><td>${exist?"Benutzer bleibt, Zuordnungen werden ergänzt":"Benutzer anlegen: <b>"+esc(nm())+"</b>"+(W.mail?" · "+esc(W.mail):"")+(W.kz?" · Kürzel "+esc(W.kz):"")+(W.rolle?" · "+esc(W.rolle):"")}</td></tr>${rows}</tbody></table>
        <div class="infobox">Es geht keine Einladung und keine Mail raus. Einladen kannst du später im Benutzer je Mandant mit „Einladen …“.</div>${W.err?`<div class="warnbox">${esc(W.err)}</div>`:""}<div id="wlog" class="hint"></div>`;
      foot=`<button class="btn" id="wb" style="margin-right:auto">Zurück</button><button class="btn" id="wx">Abbrechen</button><button class="btn p" id="wgo">Anlegen</button>`}
    const html=head()+b+`<div class="btns" style="margin-top:14px;justify-content:flex-end">${foot}</div>`;
    if(!close)close=modalBox(html,1);else $("#box").innerHTML=html;
    $("#mclose").onclick=close;const wx=$("#wx");if(wx)wx.onclick=close;
    const g=id=>document.getElementById(id);
    if(W.step===1){["wvn","wnn","wm","wkz","wr"].forEach(id=>g(id).oninput=()=>{W.vn=g("wvn").value.trim();W.nn=g("wnn").value.trim();W.mail=g("wm").value.trim();W.kz=g("wkz").value.trim();W.rolle=g("wr").value.trim()});
      const dupc=()=>{const dup=US.filter(u=>(nm()&&u.n.toLowerCase()===nm().toLowerCase())||(W.mail&&(u.mail||"").toLowerCase()===W.mail.toLowerCase()));
        g("wdup").innerHTML=dup.length?`<div class="warnbox">Mögliche Dublette in Company OS: ${dup.map(u=>esc(u.n)+(u.aktiv===false?" (ausgeschieden)":"")).join(", ")} – bitte prüfen. Für weitere Mandanten eines bestehenden Benutzers dort „In weiteren Bodo-Mandanten anlegen“ nutzen.</div>`:""};
      ["wvn","wnn","wm"].forEach(id=>g(id).addEventListener("input",dupc));dupc();
      g("wn").onclick=()=>{W.vn=g("wvn").value.trim();W.nn=g("wnn").value.trim();W.mail=g("wm").value.trim();W.kz=g("wkz").value.trim();W.rolle=g("wr").value.trim();
        if(!W.vn||!W.nn)return toast("Bitte Vor- und Nachnamen angeben");if(W.mail&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(W.mail))return toast("E-Mail-Adresse prüfen");W.n="";W.step=2;render()}}
    if(W.step===2){document.querySelectorAll("[data-wo]").forEach(c=>c.onchange=()=>{c.checked?W.orgs.add(c.dataset.wo):W.orgs.delete(c.dataset.wo);render()});
      const wb=g("wb");if(wb)wb.onclick=()=>{W.step=1;render()};
      g("wn").onclick=async()=>{if(!W.orgs.size){W.step=4;return render()}W.step=3;W.chk={};render();
        await Promise.all([...W.orgs].map(async id=>{try{const hits=await findSeats(id,W.mail,nm());W.chk[id]={hits};W.dec[id]=W.dec[id]||(hits[0]?"use:"+hits[0].membershipId:"new")}catch(e){W.chk[id]={err:mcpMsg(e)};W.dec[id]="skip"}if(W.step===3)render()}))}}
    if(W.step===3){document.querySelectorAll("input[type=radio]").forEach(r=>r.onchange=()=>{W.dec[r.name.slice(2)]=r.value});g("wb").onclick=()=>{W.step=2;render()};g("wn").onclick=()=>{W.step=4;render()}}
    if(W.step===4){g("wb").onclick=()=>{W.step=W.orgs.size?3:2;render()};
      g("wgo").onclick=async()=>{g("wgo").disabled=true;W.err="";const log=t=>{const l=g("wlog");if(l)l.innerHTML+=esc(t)+"<br>"};
        let u=exist;if(!u){u={id:uid("us"),n:nm(),kz:W.kz,rolle:W.rolle,mail:W.mail,aktiv:true,maps:[],ord:US.length};US.push(u);log("Company OS: Benutzer angelegt")}
        u.maps=u.maps||[];const fail=[];
        for(const id of W.orgs){const o=ownOrgs().find(x=>x.id===id),d=W.dec[id]||"skip";if(d==="skip")continue;
          const q="Bodo per Assistent am "+new Date().toLocaleDateString("de-DE");
          try{let h;
            if(d==="new"){const f={name:nm()};if(W.vn)f.vorname=W.vn;if(W.nn)f.nachname=W.nn;if(W.kz)f.kuerzel=W.kz;if(W.mail)f.email=W.mail;
              const r=await bodoAction(id,"sitz_anlegen",f,confirmBodo("Benutzer ohne Zugang in „"+o.name+"“ anlegen"));if(r.abgebrochen){fail.push(o.name+": abgebrochen");continue}
              h=(await findSeats(id,W.mail,nm())).find(x=>x.status==="unclaimed")||{name:nm(),email:W.mail,status:"unclaimed"};log(o.name+": Benutzer ohne Zugang angelegt")}
            else{h=W.chk[id].hits.find(x=>"use:"+x.membershipId===d);log(o.name+": vorhandenen Benutzer übernommen")}
            u.maps.push({sys:"bodo",inst:o.name,instId:id,ext:h.name||nm(),mail:h.email||W.mail||"",extId:h.membershipId||"",userId:h.userId||"",status:h.status||"",rollen:(h.roleNames||[]).join(", "),quelle:q})}
          catch(e){fail.push(o.name+": "+mcpMsg(e))}}
        ucur=US.indexOf(u);schedule();users();
        if(fail.length){W.err="Nicht alles hat geklappt – "+fail.join(" · ")+". Der Rest ist gespeichert.";render()}else{close();toast(exist?"Zuordnungen ergänzt":"Benutzer angelegt")}}}
  };
  render();
}
// Einladen (Mail geht raus) – nur auf ausdrücklichen Klick
async function inviteDlg(u,m){const close=modalBox(`<div class="bhead"><h3>${esc(u.n)} in „${esc(m.inst)}“ einladen</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
   <div class="field"><label>E-Mail für die Einladung</label><input type="text" id="imail" value="${esc(m.mail||u.mail||"")}"><div class="hint">Muss beim Benutzer ohne Zugang in Bodo hinterlegt sein bzw. wird dorthin geschickt.</div></div>
   <div class="field"><span class="flabel">Rollen in diesem Mandanten</span><div id="irol" class="hint">Lade Rollen aus Bodo …</div></div>
   <div class="warnbox" style="font-size:13px"><b>Bodo schickt sofort eine Einladungs-Mail</b> an die angegebene Adresse.</div><div id="ierr"></div>
   <div class="btns" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="mx">Abbrechen</button><button class="btn p" id="igo" disabled>Einladung senden</button></div>`);
  $("#mclose").onclick=close;$("#mx").onclick=close;
  try{const p=await bodo("bodo_search",{resourceType:"rolle",orgId:m.instId,achsen:{aktiv:true}});const R=((p&&p.items)||[]).map(x=>x.data||{}).filter(r=>r.key!=="owner");
    $("#irol").innerHTML=R.map(r=>`<label class="cb"><input type="checkbox" data-r="${r._id}" data-rn="${esc(r.name)}"> ${esc(r.name)}</label>`).join("")||"Keine vergebbaren Rollen gefunden.";
    const chk=()=>$("#igo").disabled=!document.querySelector("#irol [data-r]:checked");document.querySelectorAll("#irol [data-r]").forEach(c=>c.onchange=chk);
    $("#igo").onclick=async()=>{$("#igo").disabled=true;const rollen=[...document.querySelectorAll("#irol [data-r]:checked")].map(c=>c.dataset.r),rn=[...document.querySelectorAll("#irol [data-r]:checked")].map(c=>c.dataset.rn);
      try{const r=await bodoAction(m.instId,"einladen",{sitzId:m.extId,rollen,name:u.n},confirmBodo("Einladung an "+u.n+" senden"));if(r.abgebrochen){$("#igo").disabled=false;return}
        m.status="invited";m.rollen=rn.join(", ");m.eingeladen=new Date().toISOString().slice(0,10);schedule();close();users();toast("Einladung verschickt")}
      catch(e){$("#ierr").innerHTML=`<div class="warnbox">${esc(mcpMsg(e))}</div>`;$("#igo").disabled=false}}}
  catch(e){$("#irol").innerHTML=`<div class="warnbox">${esc(mcpMsg(e))}</div>`}}
// Abgleich: Status/IDs aus Bodo nachziehen
async function syncUser(u){const B=(u.maps||[]).filter(m=>m.sys==="bodo"&&m.instId);if(!B.length)return toast("Keine Bodo-Zuordnung zum Abgleichen");toast("Gleiche mit Bodo ab …");let n=0,f=[];
  for(const m of B){try{const H=await findSeats(m.instId,m.mail||u.mail,m.ext||u.n);const h=H.find(x=>x.membershipId===m.extId)||H.find(x=>x.status==="active")||H[0];
      if(h){Object.assign(m,{ext:h.name,mail:h.email||m.mail,extId:h.membershipId,userId:h.userId||m.userId||"",status:h.status,rollen:(h.roleNames||[]).join(", ")});if(m.status==="unclaimed"&&h.offeneEinladung)m.status="invited";n++}else f.push(m.inst+": nicht gefunden")}
    catch(e){f.push(m.inst+": "+mcpMsg(e))}}
  schedule();users();toast(n+" Zuordnung(en) abgeglichen"+(f.length?" · "+f.join(" · "):""))}