// ===== Benutzer-Zuordnung zu den Zielsystemen (systemseitig, nie von Hand) =====
// Eine Zuordnung u.maps[i] = {sys, inst, instId, ext, mail, extId, userId, status, rollen, quelle, at} verbindet einen Organigraph-Benutzer
// mit seinem Benutzer in einem System bzw. Mandanten. Gesucht und gelesen wird ausschließlich über die Adapter.
const ST={active:"aktiv",unclaimed:"ohne Zugang",invited:"eingeladen",suspended:"gesperrt",left:"ausgetreten"};
const stBadge=m=>!adapter(m.sys)||!m.status?"":`<span class="stb ${m.status}">${ST[m.status]||esc(m.status)}</span>`;

// Soll je Benutzer, je System:
// – Systeme mit Mandanten: jeder Mandant, den die Organigramme des Benutzers unter ⚙ Anbindungen nutzen; ohne solche Anbindung die eigenen Mandanten des Systems.
// – Systeme ohne Mandanten: einmal, wenn eines seiner Organigramme das System anbindet oder als Produkt hat.
// Ergebnis: [{sys, id, name}] (bei Systemen ohne Mandanten ist id = sys).
function uSoll(u){const L=[];
  adapterListe().forEach(a=>{const M=new Map();let genutzt=false;
    (u.orgs||[]).forEach(oid=>{const o=orgById(oid);if(!o)return;if(o.prod===a.id)genutzt=true;
      DIENSTE.forEach(([k])=>{const d=dienstVon(o,k);if(!d||d.sys!==a.id)return;genutzt=true;if(a.mand&&d.orgId)M.set(d.orgId,d.orgN||d.orgId)})});
    if(a.mand){if(!M.size)a.mandanten().forEach(m=>M.set(m.id,m.name));M.forEach((name,id)=>L.push({sys:a.id,id,name}))}
    else if(genutzt)L.push({sys:a.id,id:a.id,name:a.n})});
  return L}
const uGleich=(m,f)=>m.sys===f.sys&&(!adapter(f.sys)||!adapter(f.sys).mand||m.instId===f.id);
const uHat=(u,f)=>(u.maps||[]).some(m=>uGleich(m,f));
const uFehlt=u=>uSoll(u).filter(f=>!uHat(u,f));
const uMapVon=(f,h)=>({sys:f.sys,inst:f.name,instId:f.id,ext:h.name||"",mail:h.email||"",extId:h.membershipId,userId:h.userId||"",status:h.status||"",rollen:(h.roleNames||[]).join(", "),quelle:"aus "+sysName(f.sys)+" gelesen",at:new Date().toISOString()});
const uSeats=(f,u)=>adapter(f.sys).benutzerSuchen({mand:{id:f.id,name:f.name},name:u.n,mail:u.mail});
// Treffer, die schon einem anderen Organigraph-Benutzer im selben System/Mandanten zugeordnet sind, nicht anbieten
const uFrei=(f,u,H)=>H.filter(h=>!US.some(x=>x!==u&&(x.maps||[]).some(m=>uGleich(m,f)&&m.extId===h.membershipId)));
const uErr=(f,e)=>adapter(f.sys)?adapter(f.sys).fehler(e):String(e&&e.message||e);

// „In … suchen“: eindeutiger Treffer wird übernommen, mehrere zur Auswahl, keiner → Hinweis
async function uSuchen(u,key,btn){const [sys,id]=key.split("|"),f=uSoll(u).find(x=>x.sys===sys&&x.id===id)||{sys,id,name:id};if(btn){btn.disabled=true;btn.textContent="sucht …"}
  try{const H=uFrei(f,u,await uSeats(f,u));
    if(H.length===1){(u.maps=u.maps||[]).push(uMapVon(f,H[0]));schedule();users();toast("Zugeordnet: "+(H[0].name||u.n)+" in "+f.name);return}
    if(!H.length){users();toast("In „"+f.name+"“ nicht gefunden"+(f.sys==="bodo"?" – über „In weiteren Bodo-Mandanten anlegen …“ anlegen":" – bitte den Benutzer in "+sysName(f.sys)+" anlegen bzw. Name/E-Mail angleichen"));return}
    let sel=0;const pd=dlg(`<h3 style="margin:0 0 10px;font-size:15px">Welcher Benutzer in „${esc(f.name)}“ ist ${esc(u.n)}?</h3>${H.map((h,i)=>`<label class="cb"><input type="radio" name="usel" value="${i}" ${i?"":"checked"}> ${esc(h.name||"")} · ${esc(h.email||h.userId||"")} <span class="hint" style="margin:0">${esc(ST[h.status]||h.status||"")}</span></label>`).join("")}<div class="btns" style="margin-top:12px;justify-content:flex-end"><button class="btn" data-no>Abbrechen</button><button class="btn p" data-yes>Zuordnen</button></div>`);
    // Auswahl merken, solange das Fenster offen ist (nach dem Schließen ist es entfernt)
    document.querySelectorAll('#dlg [name="usel"]').forEach(r=>r.onchange=()=>{if(r.checked)sel=+r.value});
    const v=await pd;if(v==null){users();return}(u.maps=u.maps||[]).push(uMapVon(f,H[sel]));schedule();users();toast("Zugeordnet")}
  catch(e){users();toast(uErr(f,e))}}

// „Abgleichen“: bestehende Zuordnungen neu lesen und fehlende eindeutige ergänzen
async function syncUser(u){const B=(u.maps||[]).filter(m=>{const a=adapter(m.sys);return a&&(!a.mand||m.instId)}),FE=uFehlt(u);
  if(!B.length&&!FE.length)return toast("Keine Systeme zum Abgleichen");toast("Gleiche ab …");let n=0,neu=0;const f=[];
  for(const x of FE){try{const H=uFrei(x,u,await uSeats(x,u));if(H.length===1){(u.maps=u.maps||[]).push(uMapVon(x,H[0]));neu++}else f.push(x.name+": "+(H.length?H.length+" Treffer – bitte „In "+sysName(x.sys)+" suchen“":"nicht gefunden"))}catch(e){f.push(x.name+": "+uErr(x,e))}}
  for(const m of B){const a=adapter(m.sys);
    try{const H=await a.benutzerSuchen({mand:{id:m.instId,name:m.inst},name:m.ext||u.n,mail:m.mail||u.mail});
      const h=H.find(x=>x.membershipId===m.extId)||(a.abgleichErsatz?(H.find(x=>x.status==="active")||H[0]):null);
      if(h){Object.assign(m,{ext:h.name,mail:h.email||m.mail,extId:h.membershipId,userId:h.userId||m.userId||"",status:h.status,rollen:(h.roleNames||[]).join(", "),quelle:"aus "+sysName(m.sys)+" gelesen",at:new Date().toISOString()});if(m.status==="unclaimed"&&h.offeneEinladung)m.status="invited";n++}
      else f.push((m.inst||sysName(m.sys))+": nicht gefunden")}
    catch(e){f.push((m.inst||sysName(m.sys))+": "+a.fehler(e))}}
  schedule();users();toast(n+" Zuordnung(en) abgeglichen"+(neu?", "+neu+" neu zugeordnet":"")+(f.length?" · "+f.join(" · "):""))}
