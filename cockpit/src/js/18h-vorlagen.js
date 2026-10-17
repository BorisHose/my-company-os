// ===== Auftragsvorlagen (v79, Entscheidungen Boris 17.10.2026) =====
// Vorlagen gehören zu genau einer Organisation (damit zu Bodo oder sellify) und liegen in der Datenbank der Instanz (Sammlung „vorlagen“).
// Sichtbar für: „alle“ Benutzer der Instanz oder nur den Ersteller („ich“) – eine Ordnungshilfe, kein Zugriffsschutz (Anmeldung je Browser).
// Ändern: Ersteller und Inhaber der Instanz; alle anderen dürfen duplizieren. Schnellwahl „für alle“ je Organisation in den Einstellungen
// (settings.schnell), „meine“ am Benutzer (schnell, schnellAus). Der Auftrag merkt sich vorlage/vorlageN; spätere Änderungen an der Vorlage
// verändern bestehende Aufträge nicht.
let VL=[];const VLMAX=4;
const meId=()=>(ME()||{}).id||"";
const istInhaber=()=>!SET.inhaber||SET.inhaber===meId();
const vlSicht=v=>v&&(v.gilt!=="ich"||v.owner===meId());
const vlDarf=v=>!!v&&(v.owner===meId()||istInhaber());
const vlOrg=o=>VL.filter(v=>v.org===o&&vlSicht(v)).sort((a,b)=>String(a.n).localeCompare(String(b.n),"de"));
const vlNutz=v=>AU.filter(j=>j.vorlage===v.id);
const vlZuletzt=v=>{const L=vlNutz(v).map(j=>(j.log&&j.log[0]&&j.log[0][0])||"").filter(Boolean);return L[0]||""};
const vlPh=t=>[...new Set([...String(t||"").matchAll(/\[([^\]\n<>]{1,40})\](?!\()/g)].map(m=>m[1].trim()))];
function vlFehlt(v){const F=[];if(v.art==="agent"&&!AG.some(a=>a.id===v.aid))F.push("Agent");if(v.art==="abteilung"&&!dept(v.abt))F.push("Abteilung");if(v.art==="ablauf"&&!FL.some(f=>f.id===v.fid))F.push("Prozess");if(v.sk&&!sk(v.sk))F.push("Skill");return F}
function vlWer(v){if(v.art==="agent"){const a=AG.find(x=>x.id===v.aid);return a?a.n:"Agent (fehlt)"}if(v.art==="abteilung"){const d=dept(v.abt);return d?tlName(v.org,d.id,v.team||""):"Abteilung (fehlt)"}if(v.art==="ablauf"){const f=FL.find(x=>x.id===v.fid);return f?"Prozess „"+f.n+"“":"Prozess (fehlt)"}return "Claude direkt"+(v.sk&&sk(v.sk)?" · "+sk(v.sk).n:"")}
const vlAbt=v=>v.art==="abteilung"?v.abt:v.art==="agent"?((AG.find(a=>a.id===v.aid)&&PL(AG.find(a=>a.id===v.aid),v.org).abt)||""):"";
// Schnellwahl
const vlSchnellAlle=o=>((SET.schnell||{})[o]||[]).map(id=>VL.find(v=>v.id===id)).filter(v=>v&&v.gilt!=="ich"&&v.org===o);
const vlSchnellMein=o=>{const u=ME();return ((u&&u.schnell||{})[o]||[]).map(id=>VL.find(v=>v.id===id)).filter(v=>v&&vlSicht(v)&&v.org===o)};
const vlAlleAus=o=>{const u=ME();return !!(u&&u.schnellAus&&u.schnellAus[o])};
function vlLeiste(O,keep){const L=vlOrg(O.id);if(!L.length&&!keep.vl)return "";const v=keep.vl&&VL.find(x=>x.id===keep.vl);
  if(v)return `<div class="dx-banner on" id="jvlb">📋 <span>Vorlage: <b>${esc(v.n)}</b> – alles änderbar, die Vorlage selbst bleibt unverändert</span><span style="flex:1"></span><button class="dx-lnk" id="jvlw">andere Vorlage</button><button class="dx-lnk" id="jvlx">✕ entfernen</button></div>`;
  const A=vlAlleAus(O.id)?[]:vlSchnellAlle(O.id),M=vlSchnellMein(O.id).filter(x=>!A.includes(x));
  return `<div class="dx-banner" id="jvlb"><button class="btn sm" id="jvlw">📋 Vorlage wählen …</button>${A.length?`<span class="g">Für alle</span>${A.map(x=>`<button class="dx-chip" data-vlq="${x.id}" title="${esc(x.d||vlWer(x))}">${esc(x.n)}</button>`).join("")}`:""}${M.length?`<span class="g v">Meine</span>${M.map(x=>`<button class="dx-chip v" data-vlq="${x.id}" title="${esc(x.d||vlWer(x))}">${esc(x.n)}</button>`).join("")}`:""}<span style="flex:1"></span><button class="dx-lnk" id="jvlsa">✎ Schnellwahl anpassen</button></div>`}
// Bindung in „Neuer Auftrag“ (aufgerufen aus startModal); K = aktueller Formularstand
function vlBind(O,keep,K){const voll=()=>!!($("#jt").value.trim()||rtMd($("#ji")).trim());
  const nimm=async id=>{const v=VL.find(x=>x.id===id);if(!v)return;if(voll()&&!keep.vl&&!await askOk("Eingegebenes durch die Vorlage ersetzen?","Ersetzen",{text:"Kurzbezeichnung und Auftragstext werden durch die Vorlage „"+v.n+"“ ersetzt.",gefahr:false,nein:"Zurück"}))return;vlAnwenden(v,K())};
  document.querySelectorAll("#jvlb [data-vlq]").forEach(b=>b.onclick=()=>nimm(b.dataset.vlq));
  {const b=$("#jvlw");if(b)b.onclick=()=>vlWahl(O.id,nimm)}
  {const b=$("#jvlx");if(b)b.onclick=()=>startModal(null,K({vl:null,vlN:null}))}
  {const b=$("#jvlsa");if(b)b.onclick=()=>vlSchnell(O.id,()=>startModal(null,K()))}}
// Vorlage anwenden: Platzhalter abfragen, dann „Neuer Auftrag“ füllen
async function vlAnwenden(v,base){base=base||{};let t=v.t||"",i=v.in||"";const P=(v.ph||[]).filter(p=>vlPh(t+"\n"+i).includes(p.k));
  if(P.length){const r=await vlPhDialog(v,P);if(r===null)return;Object.entries(r).forEach(([k,w])=>{if(!w)return;const re=new RegExp("\\["+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\](?!\\()","g");t=t.replace(re,()=>w);i=i.replace(re,()=>w)})}
  const F=vlFehlt(v);if(F.length)toast("Aus der Vorlage nicht mehr vorhanden: "+F.join(", ")+" – bitte neu wählen");
  const due=v.faellig?new Date(Date.now()+v.faellig*864e5).toISOString().slice(0,10):(base.due||"");
  const keep={...base,org:v.org,art:v.art||"frei",abt:v.abt||null,team:v.team||"",aid:v.aid||null,sk:v.sk||"",tempo:v.tempo||"schnell",vorab:!!v.vorab,prj:v.prj&&pj(v.prj)?v.prj:(base.prj||""),t,i,vl:v.id,vlN:v.n,ki:true};
  if(base.sm||v.prio&&base.sm){keep.prio=v.prio||base.prio||"n";keep.due=due}else{keep.vlPrio=v.prio||"";keep.vlDue=due}
  if(base.sm&&keep.art!=="agent")keep.art="abteilung";
  startModal(v.art==="ablauf"?FL.find(f=>f.id===v.fid)||null:null,keep)}
function vlPhDialog(v,P){return new Promise(res=>{const d=document.createElement("div");d.id="dlg";
  d.innerHTML=`<div class="modal" style="z-index:40"><div class="box dx dx-dlg">${dlgKopf(v.n,"Bitte die Angaben für diesen Auftrag ergänzen")}<div class="dx-pad">${P.map((p,n)=>`<div class="field"><label class="dx-lbl" for="vlp${n}">${esc(p.k)}${p.pf?' <span style="color:#b42318">*</span>':""}</label><input type="text" id="vlp${n}" data-k="${esc(p.k)}"${p.h?` placeholder="${esc(p.h)}"`:""}>${p.h?`<div class="hint">${esc(p.h)}</div>`:""}</div>`).join("")}<button class="dx-lnk" data-skip>überspringen, später im Text ausfüllen</button></div>
   <div class="dx-foot"><span class="dx-sum"></span><button class="btn" data-no>Zurück</button><button class="btn p" data-yes>Übernehmen</button></div></div></div>`;document.body.appendChild(d);
  const done=v=>{d.remove();res(v)},val=()=>{const r={};d.querySelectorAll("[data-k]").forEach(i=>r[i.dataset.k]=i.value.trim());return r};
  d.querySelector("[data-no]").onclick=d.querySelector(".dx-x").onclick=()=>done(null);d.querySelector("[data-skip]").onclick=()=>done({});
  d.querySelector("[data-yes]").onclick=()=>{const r=val(),fe=P.filter(p=>p.pf&&!r[p.k]);if(fe.length){toast("Bitte ausfüllen: "+fe.map(p=>p.k).join(", "));return}done(r)};
  d.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();done(null)}if(e.key==="Enter"&&e.target.tagName==="INPUT"){e.preventDefault();d.querySelector("[data-yes]").click()}});
  const f=d.querySelector("input");if(f)f.focus()})}
// Pflicht-Platzhalter vor dem Start prüfen
async function vlPruefen(keep,t,i){const v=keep.vl&&VL.find(x=>x.id===keep.vl);if(!v)return true;const offen=(v.ph||[]).filter(p=>p.pf&&vlPh(t+"\n"+i).includes(p.k)).map(p=>p.k);
  if(!offen.length)return true;return askOk("Pflicht-Platzhalter noch offen","Trotzdem starten",{text:"Im Auftrag steht noch:",folgen:offen.map(k=>"["+k+"]"),nein:"Zurück zum Auftrag",gefahr:false})}
// Auswahlfenster
function vlWahl(o,pick,f0){const s={q:"",f:f0||"alle",sel:null};const box=document.createElement("div");box.id="vlw";document.body.appendChild(box);
  const zu=()=>box.remove();
  const draw=()=>{const O=orgById(o)||{},q=s.q.toLowerCase(),L=vlOrg(o).filter(v=>(s.f==="alle"||(s.f==="ich"?v.gilt==="ich":v.gilt!=="ich"))&&(!q||[v.n,v.d,v.t,vlWer(v)].some(x=>String(x||"").toLowerCase().includes(q))));
    if(!L.some(v=>v.id===s.sel))s.sel=(L[0]||{}).id||null;const V=VL.find(v=>v.id===s.sel);
    const G=[...new Set(L.map(v=>vlAbt(v)))].sort((a,b)=>(a?0:1)-(b?0:1)||String((dept(a)||{}).n).localeCompare(String((dept(b)||{}).n),"de"));
    box.innerHTML=`<div class="modal" style="z-index:36"><div class="box dx" style="max-width:900px">${dlgKopf("Vorlage wählen",esc(O.kurz||O.n||"")+(O.prod?" · "+esc(PN[O.prod]||""):""))}
     <div class="dx-body vlw-body"><div class="dx-main vlw-list">
      <input type="search" id="vlwq" placeholder="🔍 Vorlage suchen …" value="${esc(s.q)}">
      <div style="display:flex;gap:6px;margin:10px 0">${[["alle","Alle"],["alle2","Für alle"],["ich","Nur meine"]].map(([k,l])=>`<button class="dx-chip ${s.f===k?"on":""}" data-vlwf="${k}">${l}</button>`).join("")}</div>
      ${L.length?G.map(g=>`<div class="dx-lbl" style="margin-top:12px">${esc(g?(dept(g)||{}).n||"Abteilung":"Ohne Abteilung")}</div>${L.filter(v=>vlAbt(v)===g).map(v=>{const F=vlFehlt(v);return `<button class="vlrow ${v.id===s.sel?"on":""}" data-vlws="${v.id}"><span class="t"><b>${esc(v.n)}</b>${F.length?` <span class="dx-pill wait">⚠ ${esc(F.join(", "))} fehlt</span>`:""}${v.gilt==="ich"?' <span class="dx-pill inbox">persönlich</span>':""}<small>${esc(vlWer(v))}${(v.ph||[]).length?" · "+v.ph.length+" Platzhalter":""}</small></span><span class="hint" style="margin:0">${vlNutz(v).length}×</span></button>`}).join("")}`).join(""):`<div class="hint">${vlOrg(o).length?"Keine Vorlage passt zur Suche.":"Für diese Organisation gibt es noch keine Vorlagen – anlegen unter ⚙ Einstellungen › Auftragsvorlagen oder im Auftrag über ⋯ › „Als Vorlage speichern“."}</div>`}
     </div><div class="dx-side">${V?`<div class="dx-h">${esc(V.n)}</div>${V.d?`<div class="hint" style="margin:0 0 8px">${esc(V.d)}</div>`:""}
      <div class="dx-md" style="font-size:12.5px"><b>Wer:</b> ${esc(vlWer(V))}<br><b>Tempo:</b> ${esc(((RUNNERS[V.tempo||"schnell"]||{}).l||"").replace(/^\S+\s/,""))} · <b>Freigabe:</b> ${V.vorab?"ohne Rückfrage, wenn eindeutig":"immer"}${(V.ph||[]).length?`<br><b>Platzhalter:</b> ${V.ph.map(p=>`<span class="dx-ph">${esc(p.k)}</span>`).join(" ")}`:""}${V.prio&&V.prio!=="n"||V.faellig?`<br><b>Für den Eingang:</b> ${esc((PRIO.find(x=>x[0]===V.prio)||[0,"Normal"])[1])}${V.faellig?" · fällig in "+V.faellig+" Tag"+(V.faellig===1?"":"en"):""}`:""}<br><b>Sichtbar für:</b> ${V.gilt==="ich"?"nur "+esc((usr(V.owner)||{}).n||"Ersteller"):"alle Benutzer"}${usr(V.owner)?" · von "+esc(usr(V.owner).n):""}</div>
      ${V.in||V.t?`<div class="dx-card" style="margin-top:10px;font-size:12.5px">${V.t?`<b>${mdInline(V.t,{ph:1})}</b>`:""}<div class="dx-md cut" style="font-size:12.5px">${mdHtml(V.in||"",{ph:1})}</div></div>`:""}`:'<div class="hint">Keine Vorlage gewählt.</div>'}</div></div>
     <div class="dx-foot"><button class="dx-lnk" id="vlwv">⚙ Vorlagen verwalten</button><span class="dx-sum"></span><button class="btn" data-no>Abbrechen</button><button class="btn p" id="vlwok" ${V?"":"disabled"}>Vorlage verwenden</button></div></div></div>`;
    box.querySelector(".dx-x").onclick=box.querySelector("[data-no]").onclick=zu;
    const qi=box.querySelector("#vlwq");qi.oninput=()=>{s.q=qi.value;const p=qi.selectionStart;draw();const n=box.querySelector("#vlwq");n.focus();try{n.setSelectionRange(p,p)}catch(e){}};
    box.querySelectorAll("[data-vlwf]").forEach(b=>b.onclick=()=>{s.f=b.dataset.vlwf;draw()});
    box.querySelectorAll("[data-vlws]").forEach(b=>{b.onclick=()=>{s.sel=b.dataset.vlws;draw()};b.ondblclick=()=>{zu();pick(b.dataset.vlws)}});
    box.querySelector("#vlwok").onclick=()=>{if(!s.sel)return;zu();pick(s.sel)};
    box.querySelector("#vlwv").onclick=()=>{zu();$("#modal").innerHTML="";einst("vorl")}};
  box.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();zu()}});draw();setTimeout(()=>{const q=box.querySelector("#vlwq");if(q)q.focus()},0)}
// Schnellwahl anpassen: zwei Listen je Organisation
function vlSchnell(o,fertig){const u=ME();const A=[...((SET.schnell||{})[o]||[])].filter(id=>vlSchnellAlle(o).some(v=>v.id===id)),M=[...((u&&u.schnell||{})[o]||[])].filter(id=>vlSchnellMein(o).some(v=>v.id===id));let aus=vlAlleAus(o);
  const darfA=istInhaber(),box=document.createElement("div");box.id="vlsa";document.body.appendChild(box);const zu=()=>box.remove();
  const liste=(L,k,darf)=>`<div class="vlsl">${L.map((id,n)=>{const v=VL.find(x=>x.id===id);return `<div class="vlsi"><span class="t">${esc(v?v.n:id)}${v&&v.gilt==="ich"?' <span class="dx-pill inbox">persönlich</span>':""}</span>${darf?`<button class="ic" data-vlup="${k}|${n}" title="nach oben" ${n?"":"disabled"}>↑</button><button class="ic" data-vldn="${k}|${n}" title="nach unten" ${n<L.length-1?"":"disabled"}>↓</button><button class="ic" data-vlrm="${k}|${n}" title="entfernen">✕</button>`:""}</div>`}).join("")||'<div class="hint" style="margin:6px 4px">Noch keine Knöpfe.</div>'}
    ${darf&&L.length<VLMAX?`<select data-vladd="${k}"><option value="">+ Vorlage hinzufügen …</option>${vlOrg(o).filter(v=>!L.includes(v.id)&&(k==="m"||v.gilt!=="ich")).map(v=>`<option value="${v.id}">${esc(v.n)}${v.gilt==="ich"?" (persönlich)":""}</option>`).join("")}</select>`:darf?`<div class="hint">Höchstens ${VLMAX} Knöpfe.</div>`:""}</div>`;
  const draw=()=>{const O=orgById(o)||{};box.innerHTML=`<div class="modal" style="z-index:36"><div class="box dx" style="max-width:900px">${dlgKopf("Schnellwahl anpassen",esc(O.kurz||O.n||"")+(O.prod?" · "+esc(PN[O.prod]||""):""))}
    <div class="dx-pad" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px">
     <div><div class="dx-h">Für alle Benutzer<span class="hint" style="margin:0 0 0 auto;font-weight:400">${darfA?"gilt für jeden in dieser Instanz":"ändert: Inhaber der Instanz"}</span></div>${liste(A,"a",darfA)}</div>
     <div><div class="dx-h" style="color:#6941c6">Meine${u?" (nur für "+esc(u.n)+")":""}<span class="hint" style="margin:0 0 0 auto;font-weight:400">${M.length} von ${VLMAX}</span></div>${u?liste(M,"m",true)+`<label class="cb" style="margin-top:10px"><input type="checkbox" id="vlaus" ${aus?"checked":""}> „Für alle“-Knöpfe bei mir ausblenden</label>`:'<div class="hint">Kein Benutzer gewählt (⚙ Einstellungen › Darstellung › Angemeldet als).</div>'}</div></div>
    <div class="dx-foot"><span class="dx-sum">Vorschau: ${[...(aus?[]:A),...M.filter(x=>aus||!A.includes(x))].map(id=>`<span class="dx-chip ${A.includes(id)&&!aus?"":"v"}" style="cursor:default">${esc((VL.find(v=>v.id===id)||{}).n||"")}</span>`).join(" ")||"–"}</span><button class="btn" data-no>Abbrechen</button><button class="btn p" id="vlsok">Speichern</button></div></div></div>`;
    box.querySelector(".dx-x").onclick=box.querySelector("[data-no]").onclick=zu;
    const L=k=>k==="a"?A:M,mv=(k,n,d)=>{const x=L(k);[x[n],x[n+d]]=[x[n+d],x[n]];draw()};
    box.querySelectorAll("[data-vlup]").forEach(b=>b.onclick=()=>{const [k,n]=b.dataset.vlup.split("|");mv(k,+n,-1)});
    box.querySelectorAll("[data-vldn]").forEach(b=>b.onclick=()=>{const [k,n]=b.dataset.vldn.split("|");mv(k,+n,1)});
    box.querySelectorAll("[data-vlrm]").forEach(b=>b.onclick=()=>{const [k,n]=b.dataset.vlrm.split("|");L(k).splice(+n,1);draw()});
    box.querySelectorAll("[data-vladd]").forEach(s=>s.onchange=()=>{if(s.value){L(s.dataset.vladd).push(s.value);draw()}});
    {const c=box.querySelector("#vlaus");if(c)c.onchange=()=>{aus=c.checked;draw()}}
    box.querySelector("#vlsok").onclick=()=>{if(darfA){SET.schnell={...(SET.schnell||{}),[o]:A}}if(u){u.schnell={...(u.schnell||{}),[o]:M};u.schnellAus={...(u.schnellAus||{}),[o]:aus}}schedule();zu();toast("Schnellwahl gespeichert");if(fertig)fertig()}};
  box.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();zu()}});draw()}
// Editor (Anlegen/Bearbeiten) – gleicher Aufbau wie „Neuer Auftrag“
function vlEditor(v0,o,fertig){const neu=!v0||!VL.includes(v0);const E=JSON.parse(JSON.stringify(v0||{}));E.org=E.org||o;E.art=E.art||"frei";E.tempo=E.tempo||"schnell";E.gilt=E.gilt||"alle";E.ph=E.ph||[];
  const u=ME();let sA=!!(!neu&&vlSchnellAlle(E.org).some(x=>x.id===E.id)),sM=!!(!neu&&vlSchnellMein(E.org).some(x=>x.id===E.id));
  if(!neu&&!vlDarf(v0))return toast("Diese Vorlage dürfen nur der Ersteller und der Inhaber der Instanz ändern – „Duplizieren“ geht immer");
  const sync=()=>{const g=id=>document.getElementById(id);if(!g("vln"))return;E.n=g("vln").value.trim();E.d=g("vld").value.trim();E.t=g("vlt").value;E.in=rtMd(g("vled"));
    E.vorab=g("vlvorab").checked;const pr=document.querySelector("#vlprio .on");E.prio=pr?pr.dataset.p:"n";const fa=+g("vlfa").value;E.faellig=fa>0?Math.min(365,Math.round(fa)):null;E.prj=g("vlprj").checked&&g("vlprjs").value?g("vlprjs").value:null;
    const sa=g("vlsa"),sm=g("vlsm");if(sa)sA=sa.checked;if(sm)sM=sm.checked;
    const P=vlPh(E.t+"\n"+E.in);E.ph=P.map(k=>{const r=document.querySelector(`[data-phk="${CSS.escape(k)}"]`),alt=(E.ph||[]).find(p=>p.k===k)||{};return {k,h:r?r.querySelector("input[type=text]").value.trim():(alt.h||""),pf:r?r.querySelector("input[type=checkbox]").checked:!!alt.pf}})};
  const draw=()=>{const O=orgById(E.org)||{},AGO=AG.filter(a=>inOrg(a,O)),DPO=deptsOf(O.id),FLO=FL.filter(x=>!x.frei&&(x.p==="all"||!O.prod||x.p===O.prod));
    if(E.art==="agent"&&!AGO.some(a=>a.id===E.aid))E.aid=(AGO[0]||{}).id||null;if(E.art==="abteilung"&&!DPO.some(d=>d.id===E.abt))E.abt=(DPO[0]||{}).id||null;if(E.art==="ablauf"&&!FLO.some(f=>f.id===E.fid))E.fid=(FLO[0]||{}).id||null;
    const d=E.art==="abteilung"&&dept(E.abt),TMS=d?teamOpts(O.id,d):[],ag=E.art==="agent"&&AG.find(a=>a.id===E.aid);
    const SKL=E.art==="agent"?(ag?ag.s.map(id=>sk(id)).filter(Boolean):[]):E.art==="frei"?skOrg(O):[];
    const ART=[["frei","Claude direkt"],["abteilung","Abteilung"],["agent","Bestimmter Agent"],["ablauf","Prozess"]];
    $("#modal").innerHTML=`<div class="modal"><div class="box dx" id="vlbox"><div class="dx-head"><h3>${neu?"Neue Vorlage":"Vorlage bearbeiten"}</h3><div class="dx-ctx"><b>${esc(O.kurz||O.n||"")}</b>${O.prod?` <span class="dx-pill mut">${esc(PN[O.prod]||"")}</span>`:""}</div><button class="dx-x" id="vlx" title="Schließen">✕</button></div>
     <div class="dx-body"><div class="dx-main">
      <div class="row" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label class="dx-lbl" for="vln">Name der Vorlage</label><input type="text" id="vln" value="${esc(E.n||"")}" placeholder="z. B. Begleitmail zum Angebot"></div><div class="field"><label class="dx-lbl" for="vld">Kurzbeschreibung</label><input type="text" id="vld" value="${esc(E.d||"")}" placeholder="wofür die Vorlage gedacht ist"></div></div>
      <div class="field"><label class="dx-lbl" for="vlt">Kurzbezeichnung des Auftrags</label><input type="text" id="vlt" value="${esc(E.t||"")}" placeholder="z. B. Begleitmail Angebot [Kunde]"></div>
      <label class="dx-lbl">Auftragstext</label>${rtLeiste(1)}<div id="vled" class="dx-ed" contenteditable="true" role="textbox" aria-multiline="true" style="min-height:180px" data-ph="Text des späteren Auftrags. Stellen, die sich je Auftrag ändern, als Platzhalter wie [Kunde] schreiben.">${E.in?mdHtml(E.in,{ed:1,ph:1}):""}</div>
      <div class="dx-card" style="margin-top:12px" id="vlphb"><h4>Platzhalter<span class="hint">aus Kurzbezeichnung und Text erkannt</span></h4><div id="vlphl"></div></div>
     </div><div class="dx-side">
      <div class="dx-sec"><h4><span class="dx-num">1</span>Wer erledigt den Auftrag?</h4><div class="dx-opts" id="vlart">${ART.map(([k,l])=>`<button type="button" data-vla="${k}" class="${k===E.art?"on":""}"><span><b>${l}</b></span></button>`).join("")}</div>
       ${E.art==="abteilung"?`<div class="field"><label>Abteilung</label><select id="vlabt">${DPO.map(x=>`<option value="${x.id}" ${x.id===E.abt?"selected":""}>${esc(x.n)}</option>`).join("")}</select>${TMS.length?`<select id="vlteam" style="margin-top:6px"><option value="">Ganze Abteilung</option>${TMS.map(t=>`<option value="${t.id}" ${t.id===E.team?"selected":""}>Team ${esc(t.n)}</option>`).join("")}</select>`:""}</div>`:""}
       ${E.art==="agent"?`<div class="field"><label>Agent</label><select id="vlag">${AGO.map(a=>`<option value="${a.id}" ${a.id===E.aid?"selected":""}>${esc(a.n)}</option>`).join("")}</select></div>`:""}
       ${E.art==="ablauf"?`<div class="field"><label>Prozess</label><select id="vlf">${FLO.map(x=>`<option value="${x.id}" ${x.id===E.fid?"selected":""}>${esc(x.n)}</option>`).join("")}</select></div>`:""}
       ${E.art==="frei"||E.art==="agent"?`<div class="field"><label>Skill</label><select id="vlsk"><option value="">${E.art==="agent"?"Agent entscheidet selbst":"Claude wählt selbst"}</option>${skOpts(SKL,E.sk)}</select></div>`:""}</div>
      <div class="dx-sec"><h4><span class="dx-num">2</span>Tempo &amp; Freigabe</h4><div class="seg" id="vltp">${Object.entries(RUNNERS).map(([k,R])=>`<button type="button" data-tp="${k}" class="${k===E.tempo?"on":""}">${esc(R.l)}</button>`).join("")}</div><label class="cb" style="margin-top:8px"><input type="checkbox" id="vlvorab" ${E.vorab?"checked":""}> Ohne Rückfrage ausführen, wenn eindeutig</label></div>
      <div class="dx-sec dx-card v"><h4>📥 Für den Eingang</h4><label class="dx-lbl">Priorität</label><div class="seg" id="vlprio">${PRIO.map(([k,l])=>`<button type="button" data-p="${k}" class="${k===(E.prio||"n")?"on":""}">${l}</button>`).join("")}</div><label class="dx-lbl" style="margin-top:10px" for="vlfa">Fällig in … Tagen</label><input type="number" id="vlfa" min="0" max="365" value="${E.faellig||""}" placeholder="leer = keine Fälligkeit" style="width:100%"><div class="hint">gilt beim Sammeln in den Eingang</div></div>
      <div class="dx-sec dx-card"><h4>📋 Vorlage</h4><div class="hint" style="margin:0 0 8px">Organisation: <b>${esc(O.kurz||O.n||"")}</b>${O.prod?" · "+esc(PN[O.prod]||""):""} · fest</div>
       <label class="dx-lbl">Sichtbar für</label><div class="seg" id="vlgilt"><button type="button" data-g="alle" class="${E.gilt!=="ich"?"on":""}">alle Benutzer</button><button type="button" data-g="ich" class="${E.gilt==="ich"?"on":""}">nur mich</button></div>
       <label class="dx-lbl" style="margin-top:10px">Schnellwahl</label>${E.gilt!=="ich"&&istInhaber()?`<label class="cb"><input type="checkbox" id="vlsa" ${sA?"checked":""}> für alle Benutzer anzeigen</label>`:E.gilt!=="ich"?'<div class="hint" style="margin:0 0 4px">„Für alle“-Schnellwahl ändert der Inhaber der Instanz.</div>':""}${u?`<label class="cb"><input type="checkbox" id="vlsm" ${sM?"checked":""}> in meiner Schnellwahl</label>`:""}
       <label class="cb" style="margin-top:8px"><input type="checkbox" id="vlprj" ${E.prj?"checked":""}> Projekt vorbelegen</label><select id="vlprjs" ${E.prj?"":"hidden"}>${pjOpts(O.id,E.prj||"")}</select></div>
     </div></div>
     <div class="dx-foot"><span class="dx-sum">${!neu&&usr(E.von)?"zuletzt geändert von "+esc(usr(E.von).n)+(E.geaendert?" · "+esc(new Date(E.geaendert).toLocaleDateString("de-DE")):""):neu?"Neue Vorlage für "+esc(O.kurz||O.n||""):""}</span><button class="btn" id="vlab">Abbrechen</button><button class="btn" id="vltry" title="„Neuer Auftrag“ mit dieser Vorlage öffnen, ohne zu speichern">Ausprobieren ▶</button><button class="btn p" id="vlok">Vorlage speichern</button></div></div></div>`;
    const ed=$("#vled"),phl=()=>{if(!$("#vlphl"))return;sync();$("#vlphl").innerHTML=E.ph.length?`<div style="overflow-x:auto"><table class="avt" style="font-size:12.5px;min-width:0"><thead><tr><th>Name</th><th>Hinweis beim Ausfüllen</th><th>Pflicht</th></tr></thead><tbody>${E.ph.map(p=>`<tr data-phk="${esc(p.k)}"><td><span class="dx-ph">${esc(p.k)}</span></td><td><input type="text" value="${esc(p.h||"")}" placeholder="z. B. Firmenname, wie er im CRM steht" style="min-width:120px"></td><td><input type="checkbox" ${p.pf?"checked":""}></td></tr>`).join("")}</tbody></table></div>`:'<div class="hint" style="margin:0">Noch keine – mit „＋ Platzhalter“ einfügen oder [Name] in den Text schreiben.</div>'};
    rtBind(ed,$("#vlbox .dx-tb"),{onPh:phl});let pt=null;const lazy=()=>{clearTimeout(pt);pt=setTimeout(phl,500)};ed.addEventListener("input",lazy);$("#vlt").addEventListener("input",lazy);phl();
    const re=()=>{sync();draw()};
    document.querySelectorAll("[data-vla]").forEach(b=>b.onclick=()=>{sync();E.art=b.dataset.vla;E.sk="";draw()});
    {const s=$("#vlabt");if(s)s.onchange=()=>{E.abt=s.value;E.team="";re()}}{const s=$("#vlteam");if(s)s.onchange=()=>{E.team=s.value}}
    {const s=$("#vlag");if(s)s.onchange=()=>{E.aid=s.value;E.sk="";re()}}{const s=$("#vlf");if(s)s.onchange=()=>{E.fid=s.value}}{const s=$("#vlsk");if(s)s.onchange=()=>{E.sk=s.value}}
    document.querySelectorAll("#vltp [data-tp]").forEach(b=>b.onclick=()=>{E.tempo=b.dataset.tp;document.querySelectorAll("#vltp [data-tp]").forEach(x=>x.classList.toggle("on",x===b))});
    document.querySelectorAll("#vlprio [data-p]").forEach(b=>b.onclick=()=>{document.querySelectorAll("#vlprio [data-p]").forEach(x=>x.classList.toggle("on",x===b))});
    document.querySelectorAll("#vlgilt [data-g]").forEach(b=>b.onclick=()=>{sync();E.gilt=b.dataset.g;if(E.gilt==="ich")sA=false;draw()});
    $("#vlprj").onchange=()=>{$("#vlprjs").hidden=!$("#vlprj").checked};
    const zu=()=>{$("#modal").innerHTML="";if(fertig)fertig()};
    $("#vlx").onclick=$("#vlab").onclick=async()=>{sync();if(JSON.stringify(E)!==START&&!await askOk("Änderungen an der Vorlage verwerfen?","Verwerfen",{nein:"Weiter bearbeiten"}))return;zu()};
    $("#vltry").onclick=()=>{sync();$("#modal").innerHTML="";vlAnwenden({...E,id:null,n:E.n||"Entwurf"},{org:E.org})};
    $("#vlok").onclick=()=>{sync();if(!E.n)return toast("Bitte einen Namen für die Vorlage angeben");
      if(vlOrg(E.org).some(x=>x.id!==E.id&&x.n.toLowerCase()===E.n.toLowerCase()))return toast("Es gibt schon eine Vorlage mit diesem Namen");
      if(!E.id)E.id=uid("vl");if(!E.owner)E.owner=meId();E.von=meId();E.geaendert=new Date().toISOString();
      const v=VL.find(x=>x.id===E.id);if(v){Object.keys(v).forEach(k=>delete v[k]);Object.assign(v,E)}else VL.push(E);
      if(istInhaber()){const L=((SET.schnell||{})[E.org]||[]).filter(id=>id!==E.id);if(sA&&E.gilt!=="ich"&&L.length<VLMAX)L.push(E.id);SET.schnell={...(SET.schnell||{}),[E.org]:L}}
      if(u){const L=((u.schnell||{})[E.org]||[]).filter(id=>id!==E.id);if(sM&&L.length<VLMAX)L.push(E.id);u.schnell={...(u.schnell||{}),[E.org]:L}}
      schedule();zu();toast("Vorlage „"+E.n+"“ gespeichert")}};
  draw();sync();const START=JSON.stringify(E)}
// Aus einem Auftrag eine Vorlage machen (Menü ⋯ im Auftrag)
function vlAusAuftrag(j){vlEditor({n:j.t||"",org:jobOrg(j),art:j.art||"frei",abt:j.abt||null,team:j.team||"",aid:j.aid||null,fid:j.art==="ablauf"?j.fid:null,sk:j.sk||"",tempo:j.tempo||"schnell",vorab:!!j.vorab,t:j.t||"",in:j.in||"",gilt:"alle",prio:j.prio&&j.prio!=="n"?j.prio:"n"},jobOrg(j),()=>toast("Tipp: Kundenbezogenes im Text durch Platzhalter wie [Kunde] ersetzen"))}
// Verwaltung: ⚙ Einstellungen › Auftragsvorlagen
let VLS={org:null,q:"",g:"alle"};
function vlEinst(C){if(!orgById(VLS.org))VLS.org=OC||(ORGS()[0]||{}).id;const o=VLS.org,O=orgById(o)||{},q=VLS.q.toLowerCase();
  const L=vlOrg(o).filter(v=>(VLS.g==="alle"||(VLS.g==="ich"?v.gilt==="ich":v.gilt!=="ich"))&&(!q||[v.n,v.d,vlWer(v)].some(x=>String(x||"").toLowerCase().includes(q))));
  const SA=vlSchnellAlle(o).map(v=>v.id),SM=vlSchnellMein(o).map(v=>v.id);
  C.innerHTML=`<h2>Auftragsvorlagen</h2><div class="hint" style="margin:0 0 10px">Vorlagen füllen „Neuer Auftrag“ vor. Jede Vorlage gehört zu einer Organisation – Bodo- und sellify-Vorlagen werden nie gemischt. „Nur ich“ blendet eine Vorlage für andere aus (kein Zugriffsschutz: die Anmeldung wird je Browser gewählt).</div>
   <div class="dx-filter" style="border:1px solid var(--line);border-radius:10px;margin-bottom:10px">${ORGS().length>1?`<div class="seg">${ORGS().map(x=>`<button data-vlo="${x.id}" class="${x.id===o?"on":""}">${esc(x.kurz||x.n)}${x.prod?" · "+esc(PN[x.prod]||""):""}</button>`).join("")}</div>`:""}
    <input type="search" class="avq" id="vlq" placeholder="🔍 Suchen …" value="${esc(VLS.q)}"><div class="seg2">${[["alle","Alle"],["alle2","Für alle"],["ich","Nur meine"]].map(([k,l])=>`<button data-vlg="${k}" class="${VLS.g===k?"on":""}">${l}</button>`).join("")}</div>
    <span style="flex:1"></span><button class="btn sm" id="vlsch">✎ Schnellwahl anpassen</button><button class="btn sm p" id="vlneu">+ Neue Vorlage</button></div>
   <div class="avtw" style="max-height:none"><table class="avt"><thead><tr><th>Vorlage</th><th class="hm">Wer</th><th>Sichtbar für</th><th class="hm">Schnellwahl</th><th class="hm">Genutzt</th><th></th></tr></thead><tbody>
   ${L.length?L.map(v=>{const F=vlFehlt(v);return `<tr><td class="t"><b>${esc(v.n)}${F.length?` <span class="dx-pill wait">⚠ ${esc(F.join(", "))} fehlt</span>`:""}</b><small>${esc(v.d||"")}${v.d&&(v.ph||[]).length?" · ":""}${(v.ph||[]).length?v.ph.length+" Platzhalter":""}${usr(v.owner)?" · von "+esc(usr(v.owner).n):""}</small></td>
     <td class="hm sm">${esc(vlWer(v))}</td><td>${v.gilt==="ich"?`<span class="dx-pill inbox">nur ${esc((usr(v.owner)||{}).n||"Ersteller")}</span>`:'<span class="dx-pill run">alle Benutzer</span>'}</td>
     <td class="hm sm">${SA.includes(v.id)?"⚡ für alle":""}${SA.includes(v.id)&&SM.includes(v.id)?" · ":""}${SM.includes(v.id)?"⚡ meine":""}${!SA.includes(v.id)&&!SM.includes(v.id)?"–":""}</td><td class="hm sm">${vlNutz(v).length}×</td>
     <td class="ac"><details class="dx-dd"><summary class="btn sm">⋯</summary><div class="dx-pop">${vlDarf(v)?`<button data-vle="${v.id}">✎ Bearbeiten</button>`:""}<button data-vld="${v.id}">Duplizieren</button>${vlDarf(v)?`<button data-vlf="${v.id}">${v.gilt==="ich"?"Für alle Benutzer freigeben":"Nur für mich"}</button>`:""}${ORGS().length>1?`<button data-vlk="${v.id}">In andere Organisation kopieren …</button>`:""}<button data-vlt="${v.id}">Ausprobieren ▶</button>${vlDarf(v)?`<hr><button class="del" data-vlx="${v.id}">Löschen …</button>`:""}</div></details></td></tr>`}).join(""):`<tr><td colspan="6" class="avempty">${vlOrg(o).length?"Keine Vorlage passt zur Auswahl.":"Noch keine Vorlagen für "+esc(O.kurz||O.n||"")+". Mit „+ Neue Vorlage“ anlegen oder in einem fertigen Auftrag über ⋯ › „Als Vorlage speichern“."}</td></tr>`}
   </tbody></table></div>`;
  const re=()=>vlEinst(C);
  C.querySelectorAll("[data-vlo]").forEach(b=>b.onclick=()=>{VLS.org=b.dataset.vlo;re()});
  C.querySelectorAll("[data-vlg]").forEach(b=>b.onclick=()=>{VLS.g=b.dataset.vlg;re()});
  {const i=$("#vlq");i.oninput=()=>{VLS.q=i.value;const p=i.selectionStart;re();const n=$("#vlq");n.focus();try{n.setSelectionRange(p,p)}catch(e){}}}
  $("#vlneu").onclick=()=>vlEditor(null,o,re);$("#vlsch").onclick=()=>vlSchnell(o,re);
  const V=id=>VL.find(v=>v.id===id);
  C.querySelectorAll("[data-vle]").forEach(b=>b.onclick=()=>vlEditor(V(b.dataset.vle),o,re));
  C.querySelectorAll("[data-vld]").forEach(b=>b.onclick=()=>{const v=V(b.dataset.vld),k=JSON.parse(JSON.stringify(v));delete k.id;delete k.owner;delete k.von;delete k.geaendert;k.n=v.n+" (Kopie)";if(v.gilt!=="ich"&&!vlDarf(v))k.gilt="ich";vlEditor(k,o,re)});
  C.querySelectorAll("[data-vlf]").forEach(b=>b.onclick=()=>{const v=V(b.dataset.vlf);v.gilt=v.gilt==="ich"?"alle":"ich";if(v.gilt==="ich"&&SET.schnell&&SET.schnell[v.org])SET.schnell={...SET.schnell,[v.org]:SET.schnell[v.org].filter(id=>id!==v.id)};v.von=meId();v.geaendert=new Date().toISOString();schedule();re();toast(v.gilt==="ich"?"„"+v.n+"“ ist jetzt nur für dich sichtbar":"„"+v.n+"“ ist jetzt für alle Benutzer sichtbar")});
  C.querySelectorAll("[data-vlk]").forEach(b=>b.onclick=async()=>{const v=V(b.dataset.vlk),Z=ORGS().filter(x=>x.id!==v.org);let z=Z[0];
    if(Z.length>1){const n=await askText("In welche Organisation kopieren?",Z[0].kurz||Z[0].n,{bezug:"Möglich: "+Z.map(x=>x.kurz||x.n).join(", ")});z=Z.find(x=>(x.kurz||x.n).toLowerCase()===String(n||"").toLowerCase());if(!z)return n&&toast("Organisation nicht gefunden")}
    const k=JSON.parse(JSON.stringify(v));delete k.id;delete k.owner;delete k.von;delete k.geaendert;k.org=z.id;k.prj=null;k.n=v.n;if(k.art==="agent"&&!AG.some(a=>a.id===k.aid&&inOrg(a,z)))k.aid=null;if(k.art==="abteilung"){k.abt=null;k.team=""}if(k.art==="ablauf"){const f=FL.find(x=>x.id===k.fid);if(f&&f.p!=="all"&&z.prod&&f.p!==z.prod)k.fid=null}
    VLS.org=z.id;toast("Kopie für "+(z.kurz||z.n)+": Agent, Abteilung, Prozess und Projekt dort prüfen");vlEditor(k,z.id,re)});
  C.querySelectorAll("[data-vlt]").forEach(b=>b.onclick=()=>vlAnwenden(V(b.dataset.vlt),{org:o}));
  C.querySelectorAll("[data-vlx]").forEach(b=>b.onclick=async()=>{const v=V(b.dataset.vlx),n=vlNutz(v).length;
    if(!await askOk("Vorlage „"+v.n+"“ löschen?","Endgültig löschen",{text:"Die Vorlage verschwindet aus der Auswahl und aus allen Schnellwahl-Leisten. "+(n?n+" Aufträge, die damit angelegt wurden, bleiben unverändert.":"Bisher wurde kein Auftrag damit angelegt."),nein:"Behalten"}))return;
    VL=VL.filter(x=>x!==v);if(SET.schnell)Object.keys(SET.schnell).forEach(k=>SET.schnell[k]=SET.schnell[k].filter(id=>id!==v.id));US.forEach(u=>{if(u.schnell)Object.keys(u.schnell).forEach(k=>u.schnell[k]=u.schnell[k].filter(id=>id!==v.id))});schedule();re();toast("Vorlage gelöscht")});
  C.querySelectorAll("details.dx-dd").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)C.querySelectorAll("details.dx-dd[open]").forEach(x=>{if(x!==d)x.open=false})}))}
