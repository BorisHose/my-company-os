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
const PRIO=[["d","Dringend"],["h","Hoch"],["n","Normal"],["l","Niedrig"]],PRN={d:0,h:1,n:2,l:3};
const skOrg=(o)=>SK.filter(x=>!["vorschlag","entwurf"].includes(srcOf(x))&&(!o||!o.prod||x.p===o.prod||x.p==="all"||x.p==="multi"));
const grName=g=>(g!=null&&g!==""&&GR[+g]!=null)?GR[+g]:(typeof g==="string"&&isNaN(+g)?g:"Ohne Gruppe");
function skOpts(L,cur){const G=[...new Set(L.map(x=>x.g))].sort((a,b)=>(+a)-(+b));return G.map(g=>`<optgroup label="${esc(grName(g))}">${L.filter(x=>x.g===g).map(x=>`<option value="${esc(x.id)}" ${x.id===cur?'selected':''}>${esc(x.n)}</option>`).join("")}</optgroup>`).join("")}
function jobLbl(j){if(!j.f)return "–";if(!j.f.frei)return j.f.n;const a=j.aid&&AG.find(x=>x.id===j.aid),S=j.sk&&sk(j.sk);return (j.art==="agent"&&a?a.n:j.art==="abteilung"?"Abteilung "+((dept(j.abt)||{}).n||"")+(a?" · "+a.n:" · KI-Teamleiter"):"Freie Aufgabe")+(S?" · "+S.n:j.sk?" · "+j.sk:"")}
function startModal(f,keep){if(!keep)PEND=[];keep=keep||{};const SM=!!keep.sm;if(SM)keep.art=keep.art==="agent"&&keep.aid?"agent":"abteilung";
  const art=keep.art||(f&&!f.frei?"ablauf":"frei"),O=orgById(keep.org||OC)||ORGS()[0];
  const FLO=FL.filter(x=>!x.frei&&(x.p==="all"||!O.prod||x.p===O.prod));
  if(art==="ablauf"){f=f&&!f.frei&&FLO.includes(f)?f:FLO[0];if(!f){f=null}}else f=FREE();
  if(!f)return toast(art==="ablauf"?"Für diese Organisation gibt es noch keinen Ablauf":"Systemablauf „Freie Aufgabe“ fehlt");
  const AGO=AG.filter(a=>inOrg(a,O)),ag=art==="agent"?(AGO.find(a=>a.id===keep.aid)||AGO[0]):null,PR=keep.prio||"n";
  const SKL=art==="agent"?(ag?ag.s.map(id=>sk(id)).filter(Boolean).filter(x=>!["vorschlag","entwurf"].includes(srcOf(x))):[]):skOrg(O);
  const skc=SKL.some(x=>x.id===keep.sk)?keep.sk:"";
  const s=f.N.find(n=>n.type==="start");
  const DPO=deptsOf(O.id),abt=art==="abteilung"||SM?(DPO.find(d=>d.id===keep.abt)||DPO[0]||null):null,ABA=abt?AG.filter(a=>inOrg(a,O)&&PL(a,O.id).abt===abt.id):[];
  const ART=[["frei","Freie Aufgabe","Eine Aufgabe an Claude – ohne Prozess, optional mit einem bestimmten Skill"],["abteilung","Abteilung beauftragen","Der KI-Teamleiter der Abteilung wählt den passenden Agenten und erledigt die Aufgabe mit ihm"],["agent","Agent beauftragen","Ein Agent übernimmt die Aufgabe mit seinem Ziel, seinen Regeln und Skills – ohne Prozess"],["ablauf","Ablauf starten","Ein Prozess mit festen Schritten, Entscheidungen und Freigaben"]];
  $("#modal").innerHTML=`<div class="modal"><div class="box"><div class="bhead"><h3>${SM?"📥 Aufgabe sammeln":"Neuer KI-Auftrag"}</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
   <div class="field" style="margin-top:10px"><label>Organisation</label><div class="seg" id="jorg" style="margin:0">${ORGS().map(o=>`<button data-o="${o.id}" class="${o===O?'on':''}">${esc(o.kurz||o.n)}</button>`).join("")}</div></div>
   ${SM?"":`<div class="field"><label>Art des Auftrags</label><div class="seg" id="jart" style="margin:0">${ART.map(([k,l,t])=>`<button data-a="${k}" class="${k===art?'on':''}" title="${esc(t)}">${l}</button>`).join("")}</div><div class="hint">${esc(ART.find(x=>x[0]===art)[2])}</div></div>`}
   ${art==="ablauf"?`<div class="field"><label>Ablauf</label><select id="jf">${PK.map(([p,l])=>{const L=FLO.filter(x=>x.p===p);return L.length?`<optgroup label="${esc(l)}">${L.map(x=>`<option value="${x.id}" ${x===f?'selected':''}>${esc(x.n)}</option>`).join("")}</optgroup>`:""}).join("")}</select>${f.goal?`<div class="hint">${esc(f.goal)}</div>`:""}${s?"":'<div class="warnbox">Dieser Ablauf hat noch keinen Start-Knoten – unter „Abläufe“ ergänzen.</div>'}</div>`:""}
   ${art==="agent"&&!SM?`<div class="field"><label>Agent</label>${AGO.length?`<select id="jag">${AGO.map(a=>`<option value="${a.id}" ${a===ag?'selected':''}>${esc(a.n)}</option>`).join("")}</select>${ag&&ag.r?`<div class="hint">${esc(ag.r)}</div>`:""}`:'<div class="warnbox">In dieser Organisation ist noch kein Agent platziert.</div>'}</div>`:""}
   ${art==="abteilung"||SM?`<div class="${SM?"row":""}"><div class="field"><label>Abteilung</label>${DPO.length?`<select id="jabt">${DPO.map(d=>`<option value="${d.id}" ${d===abt?'selected':''}>${esc(d.n)}</option>`).join("")}</select>${SM?`</div><div class="field"><label>Zuweisung</label><select id="jzu"><option value="">✦ KI-Teamleiter wählt</option>${ABA.map(a=>`<option value="${a.id}" ${art==="agent"&&ag&&ag.id===a.id?"selected":""}>${esc(a.n)}</option>`).join("")}</select>`:""}<div class="hint">✦ Der KI-Teamleiter wählt aus: ${ABA.length?ABA.map(a=>esc(a.n)).join(", "):"– in dieser Abteilung ist noch kein Agent –"}</div>`:'<div class="warnbox">Diese Organisation hat noch keine Abteilungen.</div>'}</div></div>`:""}
   ${SM?`<div class="row"><div class="field"><label>Priorität</label><div class="seg" id="jprio" style="margin:0">${PRIO.map(([k,l])=>`<button data-p="${k}" class="${k===PR?"on":""}">${l}</button>`).join("")}</div></div><div class="field"><label>Fällig bis</label><input type="date" id="jdue" value="${esc(keep.due||"")}"></div></div>`:""}
   ${art!=="ablauf"&&art!=="abteilung"&&!SM?`<div class="field"><label for="jskq">Skill</label><div class="cbx" id="jskbox"><input type="text" id="jskq" role="combobox" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="🔍 Skill suchen oder auswählen …" value="${esc(skc&&sk(skc)?sk(skc).n:(art==="agent"?"Agent entscheidet selbst":"Claude wählt selbst"))}"><span class="cbx-car" aria-hidden="true">▾</span><div class="cbx-list" id="jsklist" role="listbox" hidden></div></div><input type="hidden" id="jsk" value="${esc(skc)}"><div class="hint">${art==="agent"?"Nur Skills dieses Agenten.":"Nur Skills, die für "+esc(O.kurz||O.n)+" gelten und im Konto aktiv sind (keine Entwürfe oder Vorschläge)."}${skc&&sk(skc)&&sk(skc).d?"<br>"+esc(sk(skc).d):""}</div></div>`:""}
   <div class="field"><label>Kurzbezeichnung</label><input type="text" id="jt" placeholder="Kurzbezeichnung des Auftrags, z. B. „Angebot Muster AG“" value="${esc(keep.t||"")}"></div>
   <div class="field"><label>${esc(art==="ablauf"?(f.start||"Eingabe"):"Aufgabe")}</label><textarea id="ji" placeholder="Alles, was Claude für den Auftrag wissen muss (Kunde, Mandant, Unterlagen, Links). Screenshots einfach hier einfügen (Strg+V) oder hineinziehen.">${esc(keep.i||"")}</textarea>
     <div class="anhbar"><div class="anhrow" id="janh"></div><label class="btn sm" style="cursor:pointer">📎 Bild anhängen<input type="file" id="jfile" accept="image/*" multiple style="display:none"></label></div></div>
   ${art==="ablauf"?`<label class="cb" style="margin:6px 0 0"><input type="checkbox" id="jki" ${keep.ki===false?'':'checked'}> Von Claude ausführen lassen (startet eine Sitzung in deinem Abo)</label>`:""}
   <div class="row" style="margin-top:8px"><div class="field"><label>Tempo</label><select id="jtempo">${Object.entries(RUNNERS).map(([k,R])=>`<option value="${k}" ${k===(keep.tempo||"schnell")?'selected':''}>${R.l}</option>`).join("")}</select><div class="hint">Schnell reicht für Datensätze und kurze Texte; gründlich für Dokumente, Angebote, Analysen.</div></div>
   <div class="field"><label>Freigabe</label><label class="cb" style="margin:4px 0 0"><input type="checkbox" id="jvorab" ${keep.vorab?'checked':''}> Ohne Rückfrage ausführen, wenn eindeutig</label><div class="hint">Nur für einfache CRM-Anlagen (Aufgabe, Kontakt, Notiz, Termin) mit eindeutigem System und Mandant. E-Mails, Tickets, Änderungen und Löschen immer mit Freigabe.</div></div></div>
   <div class="btns" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="mx">Abbrechen</button>${SM?'<button class="btn" id="gonow">▶ Sammeln &amp; sofort starten</button><button class="btn p" id="go">📥 Sammeln</button>':'<button class="btn p" id="go">▶ Starten</button>'}</div></div></div>`;
  const close=()=>$("#modal").innerHTML="";$("#mclose").onclick=close;$("#mx").onclick=close;
  renderPend();const ji=$("#ji");
  ji.addEventListener("paste",e=>{const it=[...(e.clipboardData&&e.clipboardData.items||[])].filter(x=>x.type&&x.type.startsWith("image/"));if(!it.length)return;e.preventDefault();it.forEach(x=>addPend(x.getAsFile(),"Screenshot "+(PEND.length+1)))});
  ji.addEventListener("dragover",e=>{e.preventDefault();ji.classList.add("drop")});ji.addEventListener("dragleave",()=>ji.classList.remove("drop"));
  ji.addEventListener("drop",e=>{e.preventDefault();ji.classList.remove("drop");[...(e.dataTransfer.files||[])].forEach(f=>addPend(f))});
  $("#jfile").onchange=e=>{[...e.target.files].forEach(f=>addPend(f));e.target.value=""};
  const prio=()=>{const b=document.querySelector("#jprio .on");return b?b.dataset.p:PR};
  const K=o=>({art,sm:SM,prio:SM?prio():PR,due:$("#jdue")?$("#jdue").value:"",org:O.id,aid:ag&&ag.id,abt:abt&&abt.id,sk:$("#jsk")?$("#jsk").value:"",t:$("#jt").value,i:$("#ji").value,tempo:$("#jtempo").value,vorab:$("#jvorab").checked,ki:$("#jki")?$("#jki").checked:true,...o});
  document.querySelectorAll("#jorg [data-o]").forEach(b=>b.onclick=()=>startModal(art==="ablauf"?f:null,K({org:b.dataset.o,sk:"",aid:null})));
  document.querySelectorAll("#jart [data-a]").forEach(b=>b.onclick=()=>startModal(null,K({art:b.dataset.a,sk:""})));
  const jf=$("#jf");if(jf)jf.onchange=e=>startModal(FL.find(x=>x.id===e.target.value),K());
  const jab=$("#jabt");if(jab)jab.onchange=e=>startModal(null,K(SM?{abt:e.target.value,art:"abteilung",aid:null}:{abt:e.target.value}));
  const jzu=$("#jzu");if(jzu)jzu.onchange=e=>startModal(null,K({art:e.target.value?"agent":"abteilung",aid:e.target.value||null}));
  document.querySelectorAll("#jprio [data-p]").forEach(b=>b.onclick=()=>{document.querySelectorAll("#jprio [data-p]").forEach(x=>x.classList.toggle("on",x===b))});
  const jag=$("#jag");if(jag)jag.onchange=e=>startModal(null,K({aid:e.target.value,sk:""}));
  {const jsk=$("#jsk"),q=$("#jskq"),L=$("#jsklist");if(jsk&&q){
    const none=art==="agent"?"Agent entscheidet selbst":"Claude wählt selbst",lab=()=>jsk.value&&sk(jsk.value)?sk(jsk.value).n:none;
    let act=0,items=[],openState=false;
    const draw=()=>{const t=q.dataset.typed?q.value:"",M=t?SKL.filter(x=>skMatch(x,t)):SKL;items=[{id:"",n:none}];let h=`<div class="cbx-i ${!jsk.value?'cur':''}" data-k="0">${esc(none)}</div>`;
      [...new Set(M.map(x=>x.g))].sort((a,b)=>(+a)-(+b)).forEach(g=>{h+=`<div class="cbx-g">${esc(grName(g))}</div>`;M.filter(x=>x.g===g).forEach(x=>{items.push(x);h+=`<div class="cbx-i ${jsk.value===x.id?'cur':''}" data-k="${items.length-1}" role="option" title="${esc(x.d||"")}">${esc(x.n)}</div>`})});
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
  const go=async sofort=>{if(GOBUSY)return;if(!s)return toast("Der Ablauf braucht einen Start-Knoten");if(art==="agent"&&!ag)return toast("Bitte einen Agenten wählen");if((art==="abteilung"||SM)&&!abt)return toast("Bitte eine Abteilung wählen");if(art==="abteilung"&&!ABA.length)return toast("In dieser Abteilung ist noch kein Agent – bitte zuerst einen platzieren");
    GOBUSY=true;let n;try{n=await nextJobNo()}finally{GOBUSY=false}const e=f.E.find(e=>e.f===s.id),nx=e&&nodeOf(f,e.t);
    const ki=art!=="ablauf"||$("#jki").checked,skv=$("#jsk")?$("#jsk").value:"";
    const j={id:"A-"+n,f,fid:f.id,art,org:O.id,...(SM?{prio:prio(),gesammelt:new Date().toISOString()}:{}),t:$("#jt").value||(art==="agent"?ag.n:art==="abteilung"?"Auftrag an "+abt.n:art==="frei"?(skv&&sk(skv)?sk(skv).n:"Freie Aufgabe"):"Neuer Auftrag"),in:$("#ji").value,path:ki?[s.id]:[s.id].concat(nx?[nx.id]:[]),st:"run",log:ki?[[now(),"KI-Auftrag angelegt von Boris"+(art==="agent"?" – an "+ag.n:art==="abteilung"?" – an Abteilung "+abt.n+" (KI-Teamleiter)":art==="frei"?" – freie Aufgabe":"")]]:[[now(),"Auftrag gestartet von Boris"],[now(),nx?nlabel(nx)+" – beginnt":"–"]]};
    if(SM){const d=$("#jdue").value;if(d)j.due=d;j.log=[[now(),"Aufgabe gesammelt von Boris"+(art==="agent"?" – für "+ag.n:" – für Abteilung "+abt.n)]];if(!sofort)j.st="inbox"}
    if(art==="agent")j.aid=ag.id;if(art==="abteilung"||SM)j.abt=abt.id;if(skv&&art!=="abteilung")j.sk=skv;
    if(ki){j.ki=1;j.tempo=$("#jtempo").value;if($("#jvorab").checked)j.vorab=1}
    if(PEND.length){j.anh=PEND.map(a=>({aid:a.aid,name:a.name,w:a.w,h:a.h,n:Math.ceil(a.data.length/CHUNK),kb:Math.round(a.data.length*.75/1024)}));PEND.forEach(a=>ANHDATA.set(a.aid,a.data));PEND=[]}jobPlatz(j);AU.unshift(j);close();
    if(SM&&!sofort){try{await anhSave(j);await Store.set("jobs/"+j.id,JSON.parse(jobSer(j)));LAST.set("jobs/"+j.id,jobSer(j))}catch(e){schedule()}toast("📥 In den Eingang von „"+abt.n+"“ gelegt");if(!$("#org").classList.contains("hide"))org();avRefresh();return}
    show("jobs");if(ki)kiStart(j,"starten");else{anhSave(j).catch(()=>{});toast("Auftrag gestartet")}};
  $("#go").onclick=()=>go(false);const gn=$("#gonow");if(gn)gn.onclick=()=>go(true);
}
const curN=j=>nodeOf(j.f,j.path[j.path.length-1]);