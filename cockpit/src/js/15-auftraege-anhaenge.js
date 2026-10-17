// ---------- Aufträge ----------
// ===== Anhänge (Screenshots) für KI-Aufträge – in der Datenbank, in Teilen ≤ 200 KB =====
let PEND=[];const ANHDATA=new Map();const CHUNK=200000;
function imgToJpeg(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{
  let w=im.naturalWidth,hh=im.naturalHeight;const mx=1800;if(Math.max(w,hh)>mx){const k=mx/Math.max(w,hh);w=Math.round(w*k);hh=Math.round(hh*k)}
  const cv=document.createElement("canvas");cv.width=w;cv.height=hh;const cx=cv.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,w,hh);cx.drawImage(im,0,0,w,hh);
  let q=.85,d=cv.toDataURL("image/jpeg",q);while(d.length>900000&&q>.4){q-=.1;d=cv.toDataURL("image/jpeg",q)}res({data:d.split(",")[1],w,h:hh})};im.src=fr.result};fr.readAsDataURL(file)})}
async function addPend(file,name){if(!file||!/^image\//.test(file.type))return toast("Nur Bilder (Screenshots) möglich");if(PEND.length>=5)return toast("Höchstens 5 Bilder je Auftrag");
  try{const r=await imgToJpeg(file);const aid=uid("an");PEND.push({aid,name:name||file.name||("Screenshot "+(PEND.length+1)),w:r.w,h:r.h,data:r.data});renderPend();toast("Bild angehängt")}catch(e){toast("Bild konnte nicht gelesen werden")}}
function renderPend(){const b=$("#janh");if(!b)return;b.innerHTML=PEND.map((a,i)=>`<div class="anhth" title="${esc(a.name)} · ${a.w}×${a.h}"><img src="data:image/jpeg;base64,${a.data}" alt=""><button class="ic" data-pdel="${i}" title="Entfernen">✕</button><span>Bild ${i+1}</span></div>`).join("");
  b.querySelectorAll("[data-pdel]").forEach(x=>x.onclick=()=>{PEND.splice(+x.dataset.pdel,1);renderPend()})}
// Auftragsnummer: Zähler zaehler/auftrag unter Sperre hochzählen; ohne Sperre lokale Nummer mit Existenzprüfung
let NOQ=Promise.resolve();function nextJobNo(){const p=NOQ.then(nextJobNo0);NOQ=p.catch(()=>{});return p} // im selben Fenster nacheinander
async function nextJobNo0(){const loc=Math.max(99,...AU.map(j=>+String(j.id).slice(2)||0))+1;if(!DB)return loc;const frei=async n=>{while(await Store.get("jobs/A-"+n))n++;return n};
  try{for(let i=0;i<6;i++){if(await Store.lease("zaehler/auftrag",5000)){const z=await Store.get("zaehler/auftrag");const n=await frei(Math.max((z&&z.n)||0,loc-1)+1);await Store.set("zaehler/auftrag",{n});return n}await new Promise(r=>setTimeout(r,300+Math.random()*700))}
    const z=await Store.get("zaehler/auftrag"),n=await frei(Math.max(loc,((z&&z.n)||0)+1));try{await Store.set("zaehler/auftrag",{n})}catch(e){}return n}catch(e){return loc}}
let GOBUSY=false;
async function anhSave(j){for(const a of (j.anh||[])){const d=ANHDATA.get(a.aid);if(!d)continue;for(let i=0;i<a.n;i++)await Store.set("anhaenge/"+a.aid+"_"+i,{job:j.id,aid:a.aid,i,n:a.n,name:a.name,mime:"image/jpeg",data:d.slice(i*CHUNK,(i+1)*CHUNK)});ANHDATA.delete(a.aid)}}
const ANHCACHE=new Map();
async function anhLoad(a){if(ANHCACHE.has(a.aid))return ANHCACHE.get(a.aid);if(ANHDATA.has(a.aid))return "data:image/jpeg;base64,"+ANHDATA.get(a.aid);let s="";for(let i=0;i<a.n;i++){const d=await Store.get("anhaenge/"+a.aid+"_"+i);if(!d)return null;s+=d.data}const u="data:image/jpeg;base64,"+s;ANHCACHE.set(a.aid,u);return u}
function anhHtml(j){return (j.anh||[]).length?`<div class="flabel">Anhänge (${j.anh.length})</div><div class="anhrow">${j.anh.map((a,i)=>`<a class="anhth big" data-anh="${a.aid}" title="${esc(a.name)} – anklicken zum Vergrößern"><img alt="Bild ${i+1}"><span>Bild ${i+1}</span></a>`).join("")}</div>`:""}
function anhBind(j){(j.anh||[]).forEach(a=>{const el=document.querySelector(`[data-anh="${a.aid}"]`);if(!el)return;anhLoad(a).then(u=>{if(u){el.querySelector("img").src=u;el.onclick=()=>{const w=window.open();if(w)w.document.write('<img src="'+u+'" style="max-width:100%">')}}})})}
const FREE=()=>FL.find(x=>x.frei);
// Teams einer Abteilung als Teamleiter-Bereiche; Agenten direkt in der Abteilung bilden das Team „Allgemein“ (_allg)
function teamOpts(o,d){const T=teamsOf(d);if(!T.length)return [];const L=T.map(t=>({id:t.id,n:t.n}));if(AG.some(a=>inOrg(a,o)&&PL(a,o).abt===d.id&&!T.some(t=>t.id===PL(a,o).team)))L.push({id:"_allg",n:"Allgemein"});return L}
function tlAgents(o,did,tm){const d=dept(did),T=teamsOf(d);return AG.filter(a=>{if(!inOrg(a,o))return false;const p=PL(a,o);if(p.abt!==did)return false;if(!tm)return true;if(tm==="_allg")return !T.some(t=>t.id===p.team);return p.team===tm})}
function tlName(o,did,tm){const d=dept(did);if(!tm)return "Abteilung "+((d||{}).n||"");if(tm==="_allg")return "Team Allgemein ("+((d||{}).n||"")+")";const t=teamsOf(d).find(x=>x.id===tm);return "Team "+(t?t.n:"?")+" ("+((d||{}).n||"")+")"}
const PRIO=[["d","Dringend"],["h","Hoch"],["n","Normal"],["l","Niedrig"]],PRN={d:0,h:1,n:2,l:3};
const skOrg=(o)=>SK.filter(x=>!["vorschlag","entwurf"].includes(srcOf(x))&&(!o||!o.prod||x.p===o.prod||x.p==="all"||x.p==="multi"));
function skOpts(L,cur){const G=[...new Set(L.map(x=>x.g))].sort((a,b)=>grIdx(a)-grIdx(b));return G.map(g=>`<optgroup label="${esc(grName(g))}">${L.filter(x=>x.g===g).map(x=>`<option value="${esc(x.id)}" ${x.id===cur?'selected':''}>${esc(x.n)}</option>`).join("")}</optgroup>`).join("")}
function jobLbl(j){if(!j.f)return "–";if(!j.f.frei)return j.f.n;const a=j.aid&&AG.find(x=>x.id===j.aid),S=j.sk&&sk(j.sk);return (j.art==="agent"&&a?a.n:j.art==="abteilung"?"Abteilung "+((dept(j.abt)||{}).n||"")+(a?" · "+a.n:" · KI-Teamleiter"):"Claude direkt")+(S?" · "+S.n:j.sk?" · "+j.sk:"")}
function startModal(f,keep){if(!keep)PEND=[];keep=keep||{};const SM=!!keep.sm;if(SM)keep.art=keep.art==="agent"&&keep.aid?"agent":"abteilung";
  const art=keep.art||(f&&!f.frei?"ablauf":"frei"),O=orgById(keep.org||OC)||ORGS()[0];
  const FLO=FL.filter(x=>!x.frei&&(x.p==="all"||!O.prod||x.p===O.prod));
  if(art==="ablauf"){f=f&&!f.frei&&FLO.includes(f)?f:FLO[0];if(!f){f=null}}else f=FREE();
  if(!f)return toast(art==="ablauf"?"Für diese Organisation gibt es noch keinen Prozess":"Systemablauf „Freie Aufgabe“ fehlt");
  const AGO=AG.filter(a=>inOrg(a,O)),ag=art==="agent"?(AGO.find(a=>a.id===keep.aid)||AGO[0]):null,PR=keep.prio||(SM&&keep.vlPrio)||"n";
  const SKL=art==="agent"?(ag?ag.s.map(id=>sk(id)).filter(Boolean).filter(x=>!["vorschlag","entwurf"].includes(srcOf(x))):[]):skOrg(O);
  const skc=SKL.some(x=>x.id===keep.sk)?keep.sk:"";
  const s=f.N.find(n=>n.type==="start");
  const DPO=deptsOf(O.id),abt=art==="abteilung"||SM?(DPO.find(d=>d.id===keep.abt)||DPO[0]||null):null,TMS=abt?teamOpts(O.id,abt):[],TM=art==="abteilung"&&TMS.some(t=>t.id===keep.team)?keep.team:"",ABA=abt?tlAgents(O.id,abt.id,TM):[];
  const ART=[["frei","Claude direkt","Eine Aufgabe direkt an Claude – ohne Prozess, optional mit einem bestimmten Skill"],["abteilung","Abteilung","Der KI-Teamleiter der Abteilung wählt den passenden Agenten"],["agent","Bestimmter Agent","Ein Agent übernimmt die Aufgabe mit seinem Ziel, seinen Regeln und Skills"],["ablauf","Prozess","Feste Schritte mit Entscheidungen und Freigaben"]];
  const TP=RUNNERS[keep.tempo]?keep.tempo:"schnell",PH="Was soll erledigt werden? So ausführlich wie nötig:\n• Kunde / Ansprechpartner\n• gewünschtes Ergebnis (Dokument, Mail, Datensatz …)\n• Unterlagen, Links, Fristen\n\nScreenshots einfach einfügen (Strg+V) oder hineinziehen.";
  const wer=SM?`<div class="field" style="margin-top:0"><label>Abteilung</label>${DPO.length?`<select id="jabt">${DPO.map(d=>`<option value="${d.id}" ${d===abt?'selected':''}>${esc(d.n)}</option>`).join("")}</select>`:'<div class="warnbox">Diese Organisation hat noch keine Abteilungen.</div>'}</div><div class="field"><label>Zuweisung</label><select id="jzu"><option value="">✦ KI-Teamleiter wählt</option>${ABA.map(a=>`<option value="${a.id}" ${art==="agent"&&ag&&ag.id===a.id?"selected":""}>${esc(a.n)}</option>`).join("")}</select><div class="hint">✦ Der KI-Teamleiter wählt aus: ${ABA.length?ABA.map(a=>esc(a.n)).join(", "):"– in dieser Abteilung ist noch kein Agent –"}</div></div>`
    :`<div class="dx-opts" id="jart">${ART.map(([k,l,t])=>`<button type="button" data-a="${k}" class="${k===art?'on':''}"><span><b>${l}</b><small>${esc(t)}</small></span></button>`).join("")}</div>
   ${art==="ablauf"?`<div class="field"><label>Prozess</label><select id="jf">${PK.map(([p,l])=>{const L=FLO.filter(x=>x.p===p);return L.length?`<optgroup label="${esc(l)}">${L.map(x=>`<option value="${x.id}" ${x===f?'selected':''}>${esc(x.n)}</option>`).join("")}</optgroup>`:""}).join("")}</select>${f.goal?`<div class="hint">${esc(f.goal)}</div>`:""}${s?"":'<div class="warnbox">Dieser Prozess hat noch keinen Start-Knoten – unter „Prozesse“ ergänzen.</div>'}</div>`:""}
   ${art==="agent"&&!SM?`<div class="field"><label>Agent</label>${AGO.length?`<select id="jag">${AGO.map(a=>`<option value="${a.id}" ${a===ag?'selected':''}>${esc(a.n)}</option>`).join("")}</select>${ag&&ag.r?`<div class="hint">${esc(ag.r)}</div>`:""}`:'<div class="warnbox">In dieser Organisation ist noch kein Agent platziert.</div>'}</div>`:""}
   ${art==="abteilung"||SM?`<div class="${SM?"row":""}"><div class="field"><label>Abteilung</label>${DPO.length?`<select id="jabt">${DPO.map(d=>`<option value="${d.id}" ${d===abt?'selected':''}>${esc(d.n)}</option>`).join("")}</select>${art==="abteilung"&&TMS.length?`<select id="jteam" style="margin-top:6px" aria-label="Team"><option value="">Ganze Abteilung – KI-Teamleiter der Abteilung</option>${TMS.map(t=>`<option value="${t.id}" ${t.id===TM?"selected":""}>Team ${esc(t.n)} – eigener KI-Teamleiter</option>`).join("")}</select>`:""}${SM?`</div><div class="field"><label>Zuweisung</label><select id="jzu"><option value="">✦ KI-Teamleiter wählt</option>${ABA.map(a=>`<option value="${a.id}" ${art==="agent"&&ag&&ag.id===a.id?"selected":""}>${esc(a.n)}</option>`).join("")}</select>`:""}<div class="hint">✦ Der KI-Teamleiter wählt aus: ${ABA.length?ABA.map(a=>esc(a.n)).join(", "):"– in dieser Abteilung ist noch kein Agent –"}</div>`:'<div class="warnbox">Diese Organisation hat noch keine Abteilungen.</div>'}</div></div>`:""}
   ${art!=="ablauf"&&art!=="abteilung"&&!SM?`<div class="field"><label for="jskq">Skill</label><div class="cbx" id="jskbox"><input type="text" id="jskq" role="combobox" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="🔍 Skill suchen oder auswählen …" value="${esc(skc&&sk(skc)?sk(skc).n:(art==="agent"?"Agent entscheidet selbst":"Claude wählt selbst"))}"><span class="cbx-car" aria-hidden="true">▾</span><div class="cbx-list" id="jsklist" role="listbox" hidden></div></div><input type="hidden" id="jsk" value="${esc(skc)}"><div class="hint">${art==="agent"?"Nur Skills dieses Agenten.":"Nur Skills, die für "+esc(O.kurz||O.n)+" gelten und im Konto aktiv sind (keine Entwürfe oder Vorschläge)."}${skc&&sk(skc)&&sk(skc).d?"<br>"+esc(sk(skc).d):""}</div></div>`:""}
   ${art==="ablauf"?`<label class="cb" style="margin:6px 0 0"><input type="checkbox" id="jki" ${keep.ki===false?'':'checked'}> Von Claude ausführen lassen</label><div class="hint">startet eine Sitzung in deinem Abo; ohne Häkchen pflegst du die Schritte selbst</div>`:""}`;
  $("#modal").innerHTML=`<div class="modal"><div class="box dx" id="jbox"><div class="dx-head"><h3>Neuer Auftrag${SM?' <span class="dx-pill inbox">📥 wird gesammelt</span>':""}</h3>
   <div class="dx-ctx"><span>Für</span><div class="seg" id="jorg">${ORGS().map(o=>`<button type="button" data-o="${o.id}" class="${o===O?'on':''}">${esc(o.kurz||o.n)}</button>`).join("")}</div><select id="jprj" aria-label="Projekt" title="${esc(pjOrg(O.id).length?"Projekt (optional). Mit Bodo verbundene Projekte: Claude legt alles dort am Projekt an.":"Noch keine Projekte – anlegen unter „Projekte“. Ohne Projekt geht es auch.")}">${pjOpts(O.id,pj(keep.prj)&&pj(keep.prj).org===O.id?keep.prj:"")}</select></div><button class="dx-x" id="mclose" title="Schließen">✕</button></div>
   ${vlLeiste(O,keep)}<div class="dx-body"><div class="dx-main">
    <div class="field"><label class="dx-lbl" for="jt">Kurzbezeichnung</label><input type="text" id="jt" placeholder="z. B. „Angebot Muster AG“" value="${esc(keep.t||"")}"></div>
    <label class="dx-lbl">${esc(art==="ablauf"?(f.start||"Eingabe"):"Auftrag")}</label>${rtLeiste()}<div id="ji" class="dx-ed" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Auftrag" data-ph="${esc(PH)}">${keep.i?mdHtml(keep.i,{ed:1,ph:1}):""}</div>
    <div class="dx-drop"><div class="anhrow" id="janh"></div><label class="btn sm" style="cursor:pointer">📎 Bild anhängen<input type="file" id="jfile" accept="image/*" multiple style="display:none"></label><span>oder ins Textfeld einfügen (Strg+V) bzw. hineinziehen · höchstens 5 Bilder</span></div>
   </div><div class="dx-side">
    <div class="dx-sec"><h4><span class="dx-num">1</span>Wer erledigt den Auftrag?</h4>${wer}</div>
    ${SM?`<div class="dx-sec dx-card v"><h4>📥 Für den Eingang</h4><label class="dx-lbl">Priorität</label><div class="seg" id="jprio">${PRIO.map(([k,l])=>`<button type="button" data-p="${k}" class="${k===PR?"on":""}">${l}</button>`).join("")}</div><label class="dx-lbl" style="margin-top:10px" for="jdue">Fällig bis</label><input type="date" id="jdue" value="${esc(keep.due||(SM&&keep.vlDue)||"")}"></div>`:""}
    <div class="dx-sec"><h4><span class="dx-num">2</span>Wie gründlich?</h4><div class="seg" id="jtp">${Object.entries(RUNNERS).map(([k,R])=>`<button type="button" data-tp="${k}" class="${k===TP?'on':''}">${esc(R.l)}</button>`).join("")}</div><input type="hidden" id="jtempo" value="${TP}"><div class="hint">Schnell: Datensätze, kurze Texte · Gründlich: Dokumente, Angebote, Analysen</div></div>
    <div class="dx-sec"><h4><span class="dx-num">3</span>Freigabe</h4><label class="cb" title="Nur für einfache CRM-Anlagen (Aufgabe, Kontakt, Notiz, Termin) mit eindeutigem System und Mandant."><input type="checkbox" id="jvorab" ${keep.vorab?'checked':''}> Ohne Rückfrage ausführen, wenn eindeutig <span style="cursor:help">ⓘ</span></label><div class="hint">Nur einfache CRM-Anlagen. E-Mails, Tickets, Änderungen und Löschen immer mit Freigabe.</div></div>
   </div></div>
   <div class="dx-foot"><span class="dx-sum" id="jsum"></span><button class="btn" id="mx">Abbrechen</button>${SM?'<button class="btn" id="jsmx" title="Doch nicht sammeln">Nicht sammeln</button><button class="btn" id="gonow">▶ Sammeln &amp; sofort starten</button><button class="btn p" id="go">📥 In Eingang sammeln</button>':`${art==="abteilung"||art==="agent"?'<button class="btn" id="jsm" title="In den Eingang der Abteilung legen statt sofort zu starten">📥 Nur sammeln</button>':""}<button class="btn p" id="go">▶ Auftrag starten</button>`}</div></div></div>`;
  const close=()=>$("#modal").innerHTML="";$("#mclose").onclick=close;$("#mx").onclick=close;
  renderPend();const ji=$("#ji");rtBind(ji,$("#jbox .dx-tb"));
  const sum=()=>{const e=$("#jsum");if(!e)return;const w=SM?(ag&&art==="agent"?ag.n:"Eingang "+(abt?abt.n:"")):art==="agent"?(ag?ag.n:"Agent"):art==="abteilung"?(abt?tlName(O.id,abt.id,$("#jteam")?$("#jteam").value:TM):"Abteilung"):art==="ablauf"?(f?f.n:"Prozess"):"Claude direkt";
    const tp=(RUNNERS[$("#jtempo").value]||{}).l||"";e.innerHTML=esc(O.kurz||O.n)+" · <b>"+esc(w)+"</b> · "+esc(tp.replace(/^\S+\s/,""))+" · "+($("#jvorab").checked?"ohne Rückfrage, wenn eindeutig":"mit Freigabe")+(SM?" · Priorität "+esc((PRIO.find(x=>x[0]===prio())||[])[1]||""):"")};
  document.querySelectorAll("#jtp [data-tp]").forEach(b=>b.onclick=()=>{$("#jtempo").value=b.dataset.tp;document.querySelectorAll("#jtp [data-tp]").forEach(x=>x.classList.toggle("on",x===b));sum()});
  $("#jvorab").onchange=sum;
  ji.addEventListener("paste",e=>{const it=[...(e.clipboardData&&e.clipboardData.items||[])].filter(x=>x.type&&x.type.startsWith("image/"));if(!it.length)return;e.preventDefault();it.forEach(x=>addPend(x.getAsFile(),"Screenshot "+(PEND.length+1)))});
  ji.addEventListener("dragover",e=>{e.preventDefault();ji.classList.add("drop")});ji.addEventListener("dragleave",()=>ji.classList.remove("drop"));
  ji.addEventListener("drop",e=>{e.preventDefault();ji.classList.remove("drop");[...(e.dataTransfer.files||[])].forEach(f=>addPend(f))});
  $("#jfile").onchange=e=>{[...e.target.files].forEach(f=>addPend(f));e.target.value=""};
  const prio=()=>{const b=document.querySelector("#jprio .on");return b?b.dataset.p:PR};
  const K=o=>({vl:keep.vl,vlN:keep.vlN,vlPrio:keep.vlPrio,vlDue:keep.vlDue,art,team:$("#jteam")?$("#jteam").value:TM,sm:SM,prio:SM?prio():keep.prio,due:$("#jdue")?$("#jdue").value:"",org:O.id,aid:ag&&ag.id,abt:abt&&abt.id,sk:$("#jsk")?$("#jsk").value:"",t:$("#jt").value,i:rtMd($("#ji")),tempo:$("#jtempo").value,vorab:$("#jvorab").checked,prj:$("#jprj")?$("#jprj").value:"",ki:$("#jki")?$("#jki").checked:true,...o});
  vlBind(O,keep,K);
  document.querySelectorAll("#jorg [data-o]").forEach(b=>b.onclick=()=>startModal(art==="ablauf"?f:null,K({org:b.dataset.o,sk:"",aid:null,prj:""})));
  document.querySelectorAll("#jart [data-a]").forEach(b=>b.onclick=()=>startModal(null,K({art:b.dataset.a,sk:""})));
  const jf=$("#jf");if(jf)jf.onchange=e=>startModal(FL.find(x=>x.id===e.target.value),K());
  const jab=$("#jabt");if(jab)jab.onchange=e=>startModal(null,K(SM?{abt:e.target.value,art:"abteilung",aid:null}:{abt:e.target.value}));
  const jtm=$("#jteam");if(jtm)jtm.onchange=e=>startModal(null,K({team:e.target.value}));
  const jzu=$("#jzu");if(jzu)jzu.onchange=e=>startModal(null,K({art:e.target.value?"agent":"abteilung",aid:e.target.value||null}));
  document.querySelectorAll("#jprio [data-p]").forEach(b=>b.onclick=()=>{document.querySelectorAll("#jprio [data-p]").forEach(x=>x.classList.toggle("on",x===b));sum()});
  {const b=$("#jsm");if(b)b.onclick=()=>startModal(null,K({sm:1,abt:art==="agent"&&ag?(PL(ag,O.id).abt||(DPO[0]||{}).id):(abt&&abt.id)}))}
  {const b=$("#jsmx");if(b)b.onclick=()=>startModal(null,K({sm:false,art:art==="agent"&&ag?"agent":"abteilung"}))}
  sum();
  const jag=$("#jag");if(jag)jag.onchange=e=>startModal(null,K({aid:e.target.value,sk:""}));
  {const jsk=$("#jsk"),q=$("#jskq"),L=$("#jsklist");if(jsk&&q){
    const none=art==="agent"?"Agent entscheidet selbst":"Claude wählt selbst",lab=()=>jsk.value&&sk(jsk.value)?sk(jsk.value).n:none;
    let act=0,items=[],openState=false;
    const draw=()=>{const t=q.dataset.typed?q.value:"",M=t?SKL.filter(x=>skMatch(x,t)):SKL;items=[{id:"",n:none}];let h=`<div class="cbx-i ${!jsk.value?'cur':''}" data-k="0">${esc(none)}</div>`;
      [...new Set(M.map(x=>x.g))].sort((a,b)=>grIdx(a)-grIdx(b)).forEach(g=>{h+=`<div class="cbx-g">${esc(grName(g))}</div>`;M.filter(x=>x.g===g).forEach(x=>{items.push(x);h+=`<div class="cbx-i ${jsk.value===x.id?'cur':''}" data-k="${items.length-1}" role="option" title="${esc(x.d||"")}">${esc(x.n)}</div>`})});
      if(M.length===0)h+='<div class="cbx-e">Kein Skill gefunden</div>';
      L.innerHTML=h;if(act>=items.length)act=items.length-1;mark(act>=0);
      L.querySelectorAll("[data-k]").forEach(d=>{d.onmousedown=e=>{e.preventDefault();pick(+d.dataset.k)};d.onmousemove=()=>{if(act!==+d.dataset.k){act=+d.dataset.k;mark(false)}}})};
    const mark=(scroll=true)=>{L.querySelectorAll("[data-k]").forEach(d=>d.classList.toggle("on",+d.dataset.k===act));const a=L.querySelector(`[data-k="${act}"]`);if(a&&scroll)a.scrollIntoView({block:"nearest"})};
    const open=()=>{if(openState)return;openState=true;delete q.dataset.typed;act=Math.max(0,items.findIndex(x=>x.id===jsk.value));L.hidden=false;q.setAttribute("aria-expanded","true");q.select();draw();act=Math.max(0,items.findIndex(x=>x.id===jsk.value));mark()};
    const close=()=>{openState=false;L.hidden=true;q.setAttribute("aria-expanded","false");delete q.dataset.typed;q.value=lab()};
    const pick=k=>{const it=items[k];if(!it)return;const ch=jsk.value!==it.id;jsk.value=it.id;close();if(ch)startModal(art==="ablauf"?f:null,K())};
    q.onfocus=open;q.onclick=open;
    q.oninput=()=>{q.dataset.typed=1;if(!openState){openState=true;L.hidden=false}act=-1;draw()};
    q.onkeydown=e=>{if(e.key==="ArrowDown"){e.preventDefault();if(!openState)open();act=act<0?(items.length>1&&q.dataset.typed?1:0):Math.min(items.length-1,act+1);mark()}
      else if(e.key==="ArrowUp"){e.preventDefault();act=Math.max(0,act-1);mark()}
      else if(e.key==="Enter"){e.preventDefault();if(openState)pick(act<0?(items.length>1?1:0):act)}
      else if(e.key==="Escape"){if(openState){e.preventDefault();e.stopPropagation();close();q.blur()}}
      else if(e.key==="Tab"){if(openState)close()}};
    q.onblur=()=>setTimeout(()=>{if(document.activeElement!==q&&openState)close()},120);
    draw()}}
  const go=async sofort=>{if(GOBUSY)return;if(!await vlPruefen(keep,$("#jt").value,rtMd($("#ji"))))return;if(!s)return toast("Der Prozess braucht einen Start-Knoten");if(art==="agent"&&!ag)return toast("Bitte einen Agenten wählen");if((art==="abteilung"||SM)&&!abt)return toast("Bitte eine Abteilung wählen");if(art==="abteilung"&&!ABA.length)return toast("In dieser Abteilung ist noch kein Agent – bitte zuerst einen platzieren");
    GOBUSY=true;let n;try{n=await nextJobNo()}finally{GOBUSY=false}const e=f.E.find(e=>e.f===s.id),nx=e&&nodeOf(f,e.t);
    const ki=art!=="ablauf"||$("#jki").checked,skv=$("#jsk")?$("#jsk").value:"";
    const j={id:"A-"+n,f,fid:f.id,art,org:O.id,...(SM?{prio:prio(),gesammelt:new Date().toISOString()}:{}),t:$("#jt").value||(art==="agent"?ag.n:art==="abteilung"?"Auftrag an "+tlName(O.id,abt.id,TM):art==="frei"?(skv&&sk(skv)?sk(skv).n:"Claude direkt"):"Neuer Auftrag"),in:rtMd($("#ji")),path:ki?[s.id]:[s.id].concat(nx?[nx.id]:[]),st:"run",log:ki?[[now(),"KI-Auftrag angelegt von "+ICH()+""+(art==="agent"?" – an "+ag.n:art==="abteilung"?" – an "+tlName(O.id,abt.id,TM)+" (KI-Teamleiter)":art==="frei"?" – Claude direkt":"")]]:[[now(),"Auftrag gestartet von "+ICH()+""],[now(),nx?nlabel(nx)+" – beginnt":"–"]]};
    if(SM){const d=$("#jdue").value;if(d)j.due=d;j.log=[[now(),"Aufgabe gesammelt von "+ICH()+""+(art==="agent"?" – für "+ag.n:" – für Abteilung "+abt.n)]];if(!sofort)j.st="inbox"}
    if(art==="agent")j.aid=ag.id;if(art==="abteilung"||SM)j.abt=abt.id;if(art==="abteilung"&&TM)j.team=TM;if(skv&&art!=="abteilung")j.sk=skv;{const pv=$("#jprj")&&$("#jprj").value;if(pv&&pj(pv)){j.prj=pv;j.log[0][1]+=" · Projekt „"+pj(pv).n+"“"}}
    if(keep.vl){j.vorlage=keep.vl;j.vorlageN=keep.vlN||"";j.log[0][1]+=" · mit Vorlage „"+(keep.vlN||"")+"“"}
    if(ki){j.ki=1;j.tempo=$("#jtempo").value;if($("#jvorab").checked)j.vorab=1}
    if(PEND.length){j.anh=PEND.map(a=>({aid:a.aid,name:a.name,w:a.w,h:a.h,n:Math.ceil(a.data.length/CHUNK),kb:Math.round(a.data.length*.75/1024)}));PEND.forEach(a=>ANHDATA.set(a.aid,a.data));PEND=[]}jobPlatz(j);AU.unshift(j);close();
    if(SM&&!sofort){try{await anhSave(j);await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j))}catch(e){schedule()}toast("📥 In den Eingang von „"+abt.n+"“ gelegt");if(!$("#org").classList.contains("hide"))org();avRefresh();return}
    show("jobs");if(ki)kiStart(j,"starten");else{anhSave(j).catch(()=>{});toast("Auftrag gestartet")}};
  $("#go").onclick=()=>go(false);const gn=$("#gonow");if(gn)gn.onclick=()=>go(true);
}
const curN=j=>nodeOf(j.f,j.path[j.path.length-1]);