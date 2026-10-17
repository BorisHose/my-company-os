// ===== Ebene 3: Abläufe (Prozessdiagramm) und Aufträge (Ausführungen) =====
const ag=n=>AG.find(a=>a.n===n);
let FF="bodo",fcur=0,SEL=null,ZM=null;
const fitZ=(w,W,H,maxH)=>Math.max(.35,Math.min(1,(w.clientWidth-12)/W,maxH?(maxH-12)/H:9));
const Z=()=>ZM||1;
function NTD(){return {mix:1,ev:{ask:[1,1,0],hold:[1,1,0],done:[1,1,0],err:[1,1,1]}}}
const CH=["📱 Handy (Push)","💻 Cowork-App","✉️ E-Mail"];
const EV=[["ask","Rückfrage, die die Agenten nicht klären konnten"],["hold","Deine Entscheidung / Freigabe"],["done","Auftrag fertig"],["err","Fehler / Auftrag hängt"]];
const HO=["Entscheidungen mit Begründung","Verweise auf die Dokumente","Offene Fragen","Was der Nächste darf / nicht darf"];
const NS={start:{w:46,h:46,l:"Start"},task:{w:170,h:70,l:"Agenten-Schritt"},dec:{w:150,h:86,l:"Entscheidung (Agent)"},human:{w:150,h:86,l:"Entscheidung (du)"},end:{w:46,h:46,l:"Ende"}};
let NID=1;const nid=()=>"n"+(NID++);
// lineare Vorlage -> Graph (Haltepunkt wird zur Entscheidung durch dich)
function lin(f,steps){
  const N=[],E=[];let x=20,y=190;const s={id:nid(),type:"start",x,y:y+12,label:"Start"};N.push(s);let prev=s;x+=90;
  steps.forEach(st=>{const t={id:nid(),type:"task",x,y,a:st.a,t:st.t,o:st.o,ho:[1,1,1,1]};N.push(t);E.push({f:prev.id,t:t.id,l:""});prev=t;x+=220;
    if(st.h){const hm={id:nid(),type:"human",x,y:y-8,label:"Freigabe: "+st.o+"?"};N.push(hm);E.push({f:t.id,t:hm.id,l:""});E.push({f:hm.id,t:t.id,l:"ändern",back:1,max:3});prev=hm;prev._out="freigeben";x+=200}});
  const e={id:nid(),type:"end",x,y:y+12,label:"Ergebnis an dich"};N.push(e);E.push({f:prev.id,t:e.id,l:prev._out||""});
  return {...f,N,E};
}
const A=n=>ag(n);
function ticketFlow(){
  const N=[
   {id:"s",type:"start",x:20,y:200,label:"Kundenwunsch"},
   {id:"t1",type:"task",x:100,y:188,a:A("Bodo Produkt & Tickets"),t:"Wunsch verstehen, auf vergleichbare Tickets prüfen",o:"Prüfergebnis",ho:[1,1,1,1]},
   {id:"d1",type:"dec",x:310,y:180,label:"Vergleichbares Ticket gefunden?",a:A("Bodo Produkt & Tickets")},
   {id:"t2",type:"task",x:510,y:60,a:A("Bodo Produkt & Tickets"),t:"Ergänzung zum bestehenden Ticket entwerfen",o:"Entwurf Ergänzung",ho:[1,1,1,1]},
   {id:"t3",type:"task",x:510,y:310,a:A("Bodo Produkt & Tickets"),t:"Ticket-Entwurf + Entwurfsbild erstellen",o:"Ticket-Entwurf + Bild",ho:[1,1,1,1]},
   {id:"h1",type:"human",x:740,y:180,label:"Deine Freigabe?"},
   {id:"t4",type:"task",x:960,y:60,a:A("Bodo Produkt & Tickets"),t:"Ticket anlegen bzw. Ergänzung eintragen (ohne Zuständigen)",o:"Ticket-Nummer",ho:[1,1,0,1]},
   {id:"t5",type:"task",x:1180,y:60,a:A("Vertriebsassistent Bodo"),t:"Kunden per Mail informieren",o:"Mail-Entwurf",ho:[1,1,1,1]},
   {id:"t6",type:"task",x:960,y:330,a:A("Vertriebsassistent Bodo"),t:"Kunden informieren, dass es nicht umgesetzt wird",o:"Mail-Entwurf",ho:[1,1,1,1]},
   {id:"e",type:"end",x:1400,y:200,label:"Erledigt"}];
  const E=[{f:"s",t:"t1",l:""},{f:"t1",t:"d1",l:""},{f:"d1",t:"t2",l:"ja"},{f:"d1",t:"t3",l:"nein"},{f:"t2",t:"h1",l:""},{f:"t3",t:"h1",l:""},
   {f:"h1",t:"t4",l:"freigeben"},{f:"h1",t:"t3",l:"ändern",back:1,max:3},{f:"h1",t:"t6",l:"verwerfen"},{f:"t4",t:"t5",l:""},{f:"t5",t:"e",l:""},{f:"t6",t:"e",l:""}];
  return {n:"Kundenwunsch → Ticket → Rückmeldung",p:"bodo",goal:"Ein Kundenwunsch wird sauber als Ticket erfasst (oder an ein bestehendes angehängt) und der Kunde informiert.",start:"Kundenmail oder Notiz, ggf. Screenshot",nt:NTD(),rec:"manuell",N,E};
}
let FL=[];

const fl=n=>FL.find(f=>f.n===n);
const nodeOf=(f,id)=>f.N.find(n=>n.id===id);
const nodesOfType=(f,t)=>f.N.filter(n=>n.type===t);
const nlabel=n=>n.type==="task"?(n.a?.n||(n.free?"Claude – frei":"?"))+(n.sk?" · "+skLbl(n):"")+": "+n.t:(n.label||NS[n.type].l);
// Aufträge: Weg durch den Graphen (path) + aktueller Knoten
function pathLin(f,k){const T=f.N.filter(n=>n.type!=="human"&&n.type!=="end");return T.slice(0,k+1).map(n=>n.id)}

const allPath=f=>{const P=[f.N[0].id];let c=f.N[0];for(let i=0;i<40;i++){const e=f.E.find(e=>e.f===c.id&&!e.back);if(!e)break;c=nodeOf(f,e.t);P.push(c.id)}return P};
let AU=[];
// ---------- Diagramm zeichnen ----------
const SIDE={r:[1,0],l:[-1,0],t:[0,-1],b:[0,1]};
function anc(n,s){const z=NS[n.type];return s==="r"?[n.x+z.w,n.y+z.h/2]:s==="l"?[n.x,n.y+z.h/2]:s==="t"?[n.x+z.w/2,n.y]:[n.x+z.w/2,n.y+z.h]}
function geo(f,e){
  const a=nodeOf(f,e.f),b=nodeOf(f,e.t);if(!a||!b)return null;
  const za=NS[a.type],zb=NS[b.type],ax=a.x+za.w/2,ay=a.y+za.h/2,bx=b.x+zb.w/2,by=b.y+zb.h/2,dx=bx-ax,dy=by-ay;
  let ss,ts;
  if(e.back||dx<-20){ss="b";ts="b"}
  else{ss=(a.type==="dec"||a.type==="human")&&Math.abs(dy)>40?(dy<0?"t":"b"):dx>20?"r":dy>0?"b":"t";
       ts=dx>20&&Math.abs(dx)>Math.abs(dy)*0.4?"l":dy>0?"t":"b"}
  const p0=anc(a,ss),p3=anc(b,ts);
  let p1,p2;
  if(ss==="b"&&ts==="b"){const ly=Math.max(p0[1],p3[1])+70;p1=[p0[0],ly];p2=[p3[0],ly]}
  else{const k=Math.max(40,Math.hypot(p3[0]-p0[0],p3[1]-p0[1])/2.2);p1=[p0[0]+SIDE[ss][0]*k,p0[1]+SIDE[ss][1]*k];p2=[p3[0]+SIDE[ts][0]*k,p3[1]+SIDE[ts][1]*k]}
  const m=[(p0[0]+3*p1[0]+3*p2[0]+p3[0])/8,(p0[1]+3*p1[1]+3*p2[1]+p3[1])/8];
  return {d:`M${p0} C${p1} ${p2} ${p3}`,m};
}
function nodeHTML(f,n,o){
  const st=o.state?o.state(n):"",sel=!o.ro&&SEL&&SEL.k==="n"&&SEL.id===n.id?"sel":"";
  const prod=n.a?.p||f.p,hd=o.ro||n.type==="end"?"":`<span class="hd" data-hd="${n.id}" title="Ziehen = verbinden">+</span>`;
  if(n.type==="task")return `<div class="node task p-${prod} ${st} ${sel}" data-n="${n.id}" style="left:${n.x}px;top:${n.y}px"><div class="ag">${esc(n.a?.n||(n.free?"Claude – frei":"Agent wählen"))}</div>${n.sk?`<div class="nsk ${skOk(n)?"":"bad"}" title="${skOk(n)?"Skill dieses Schritts":"Skill ist dem Agenten nicht mehr zugeordnet"}">${skOk(n)?"◆":"⚠"} ${esc(skLbl(n))}</div>`:""}<div>${esc(n.t||"Aufgabe …")}</div>${hd}</div>`;
  if(n.type==="dec"||n.type==="human"){const hu=n.type==="human";
    return `<div class="node dia ${n.type} ${st} ${sel}" data-n="${n.id}" style="left:${n.x}px;top:${n.y}px"><svg viewBox="0 0 150 86" preserveAspectRatio="none"><polygon points="75,2 148,43 75,84 2,43"/></svg><div class="dt">${hu?"👤 ":""}${esc(n.label||"Frage …")}</div>${hd}</div>`}
  return `<div class="node circ ${n.type} ${st} ${sel}" data-n="${n.id}" style="left:${n.x}px;top:${n.y}px"><span class="ci">${n.type==="start"?"▶":"■"}</span><div class="cap">${esc(n.label||"")}</div>${hd}</div>`;
}
function drawGraph(box,f,o={}){
  const W=Math.max(...f.N.map(n=>n.x+NS[n.type].w))+120,H=Math.max(...f.N.map(n=>n.y+NS[n.type].h))+130;
  let svg=`<svg class="edges" width="${W}" height="${H}"><defs>${["g","k","a"].map(c=>`<marker id="ar${c}${o.ro?'r':''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mk${c}"/></marker>`).join("")}</defs>`;
  let labs="";
  f.E.forEach((e,i)=>{const g=geo(f,e);if(!g)return;const tk=o.taken&&o.taken(e),sel=!o.ro&&SEL&&SEL.k==="e"&&SEL.i===i;
    const c=sel?"a":tk?"g":"k";
    svg+=`<path d="${g.d}" class="ed ${e.back?'back':''} ${tk?'tk':''} ${sel?'sel':''}" marker-end="url(#ar${c}${o.ro?'r':''})"/>`;
    if(!o.ro)svg+=`<path d="${g.d}" class="hit" data-e="${i}"/>`;
    if(e.l||e.back)labs+=`<div class="elab ${sel?'sel':''} ${tk?'tk':''}" data-e="${i}" style="left:${g.m[0]}px;top:${g.m[1]}px">${e.back?"↩ ":""}${esc(e.l||"zurück")}${e.back&&e.max?` <small>max ${e.max}×</small>`:""}</div>`});
  svg+=`<path id="tmp" class="ed tmp" d=""/></svg>`;
  box.dataset.w=W;box.dataset.h=H;box.innerHTML=`<div class="cv" style="width:${W}px;height:${H}px;zoom:${o.z||1}">${svg}${f.N.map(n=>nodeHTML(f,n,o)).join("")}${labs}</div>`;
}
// ---------- Ablauf-Editor ----------
function fseg(){
  $("#fseg").innerHTML=PK.map(([p,l])=>`<button data-p="${p}" class="${FF===p?'on':''}" title="${esc(PT[p])}">${l}<span class="n">${FL.filter(f=>f.p===p&&!f.frei).length}</span></button>`).join("");
  document.querySelectorAll("#fseg button").forEach(b=>b.onclick=()=>{if(blocked())return;FF=b.dataset.p;fcur=FL.findIndex(f=>f.p===FF&&!f.frei);SEL=null;ZM=null;flows()});
}
function flows(){
  fseg();
  const L=FL.map((f,i)=>[f,i]).filter(([f])=>f.p===FF&&!f.frei);
  $("#flist").innerHTML=(L.length?"":`<p class="hint">Noch keine ${PN[FF]}-Abläufe.</p>`)+L.map(([f,i])=>{const k=nodesOfType(f,"task").length,d=nodesOfType(f,"dec").length+nodesOfType(f,"human").length;
    return `<div class="aitem p-${f.p} ${i==fcur?'on':''}" data-fi="${i}"><div class="t"><b>${esc(f.n)}</b><small>${k} Schritte · ${d} Entscheidungen${f.vorschlag?' · Vorschlag':''}</small></div></div>`}).join("");
  document.querySelectorAll("[data-fi]").forEach(e=>e.onclick=()=>{if(+e.dataset.fi!==fcur&&blocked())return;fcur=+e.dataset.fi;SEL=null;ZM=null;flows()});
  fedit();
}
function fedit(){
  const f=FL[fcur];if(!f||f.p!==FF||f.frei){$("#fedit").innerHTML='<p class="hint">Kein Prozess ausgewählt.</p>';return}
  const fe=isEd("flow",f.id);if(!fe)SEL=null;$("#fedit").classList.toggle("editing",fe);
  $("#fedit").innerHTML=`<div class="fhead"><input type="text" id="fn" value="${esc(f.n)}" class="fname" ${fe?"":"disabled"}>${edBtns(fe,'id="fedbtn"')}${f.vorschlag?'<span class="mark">Vorschlag von Claude</span><button class="btn sm" id="takeF">Übernehmen</button>':''}</div>
   <div class="pal">${fe?"":'<span class="hint" style="margin:0">Nur lesen – zum Ändern „✎ Bearbeiten“.</span>'}<span class="hint ${fe?"":"hide"}" style="margin:0">Hinzufügen:</span>${fe?Object.entries(NS).map(([k,v])=>`<button class="btn" data-add="${k}"><span class="pi ${k}"></span>${v.l}</button>`).join(""):""}
     <span class="hint ${fe?"":"hide"}" style="margin:0">↩ Rücksprung = Verbindung zu einem früheren Schritt ziehen</span>
     <span class="zm"><button class="btn" data-z="-" title="verkleinern">−</button><span id="zv"></span><button class="btn" data-z="+" title="vergrößern">+</button><button class="btn" data-z="fit">Einpassen</button></span></div>
   <div class="fgrid" id="fgrid"><div class="cv-wrap" id="cvw"></div><div class="split" id="splitP" role="separator" aria-orientation="vertical" tabindex="0" title="Ziehen, um den Bereich breiter oder schmaler zu machen · Doppelklick = Standardbreite"></div><div class="props" id="props"></div></div>`;
  bindPSplit();
  drawGraph($("#cvw"),f);const w=$("#cvw");if(!ZM)ZM=Math.max(.75,fitZ(w,+w.dataset.w,+w.dataset.h));redraw(f);props(f);
  document.querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>{const v=b.dataset.z;ZM=v==="fit"?fitZ(w,+w.dataset.w,+w.dataset.h):Math.max(.3,Math.min(1.6,Z()+(v==="+"?.1:-.1)));redraw(f)});
  $("#fn").oninput=e=>{f.n=e.target.value;const b=document.querySelector(`[data-fi="${fcur}"] b`);if(b)b.textContent=f.n};
  const fb=$("#fedbtn");if(fb)fb.onclick=()=>{if(startEdit("flow",f.id,null,["flows/"+f.id]))fedit()};bindEd($("#fedit"),()=>flows());const tf=$("#takeF");if(tf)tf.onclick=()=>{f.vorschlag=false;fedit();schedule();toast("Prozess übernommen")};
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const t=b.dataset.add,w=$("#cvw");
    const n={id:nid(),type:t,x:Math.round((w.scrollLeft/Z()+60)/10)*10,y:Math.round((w.scrollTop/Z()+40)/10)*10,label:t==="dec"||t==="human"?"":t==="start"?"Start":t==="end"?"Ergebnis an dich":undefined};
    if(t==="task"){n.a=AG.find(a=>a.p===f.p)||AG[0];n.t="";n.o="";n.ho=[1,1,1,1]}
    if(t==="dec")n.a=AG.find(a=>a.p===f.p)||AG[0];
    f.N.push(n);SEL={k:"n",id:n.id};fedit();toast(NS[t].l+" hinzugefügt – an die richtige Stelle ziehen")});
}
function redraw(f){const w=$("#cvw"),sl=w.scrollLeft,st=w.scrollTop,ro=!isEd("flow",f.id);drawGraph(w,f,{z:Z(),ro});const zv=$("#zv");if(zv)zv.textContent=Math.round(Z()*100)+" %";w.scrollLeft=sl;w.scrollTop=st;if(!ro)bindCanvas(f)}
function bindCanvas(f){
  const w=$("#cvw");
  w.querySelectorAll(".node").forEach(el=>{
    el.onpointerdown=ev=>{if(ev.target.closest(".hd"))return;ev.preventDefault();const n=nodeOf(f,el.dataset.n),x0=ev.clientX,y0=ev.clientY,nx=n.x,ny=n.y;let mv=false;
      const mm=e=>{const dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)+Math.abs(dy)>3)mv=true;if(!mv)return;n.x=Math.max(0,Math.round((nx+dx/Z())/10)*10);n.y=Math.max(0,Math.round((ny+dy/Z())/10)*10);redrawLive(f,n)};
      const mu=()=>{removeEventListener("pointermove",mm);removeEventListener("pointerup",mu);SEL={k:"n",id:n.id};redraw(f);props(f)};
      addEventListener("pointermove",mm);addEventListener("pointerup",mu)}});
  w.querySelectorAll(".hd").forEach(h=>h.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();const a=nodeOf(f,h.dataset.hd),tmp=w.querySelector("#tmp"),cv=w.querySelector(".cv").getBoundingClientRect(),p0=anc(a,"r");
    const mm=e=>{tmp.setAttribute("d",`M${p0} L${(e.clientX-cv.left)/Z()},${(e.clientY-cv.top)/Z()}`)};
    const mu=e=>{removeEventListener("pointermove",mm);removeEventListener("pointerup",mu);tmp.setAttribute("d","");
      const t=document.elementFromPoint(e.clientX,e.clientY)?.closest(".node");if(!t||t.dataset.n===a.id){return}
      if(f.E.some(x=>x.f===a.id&&x.t===t.dataset.n))return toast("Diese Verbindung gibt es schon");
      const b=nodeOf(f,t.dataset.n),k=f.E.filter(x=>x.f===a.id).length,back=b.x<a.x-20;
      const l=a.type==="dec"?(["ja","nein"][k]||"Weg "+(k+1)):a.type==="human"?(["freigeben","ändern","verwerfen"][k]||"Weg "+(k+1)):"";
      f.E.push({f:a.id,t:b.id,l,back:back?1:0,max:back?3:undefined});SEL={k:"e",i:f.E.length-1};redraw(f);props(f);
      toast(back?"Rücksprung angelegt (höchstens 3 Runden)":"Verbindung angelegt")};
    addEventListener("pointermove",mm);addEventListener("pointerup",mu)});
  w.querySelectorAll("[data-e]").forEach(el=>el.onclick=ev=>{ev.stopPropagation();SEL={k:"e",i:+el.dataset.e};redraw(f);props(f)});
  w.querySelector(".cv").onclick=ev=>{if(ev.target.closest(".node,[data-e]"))return;if(SEL){SEL=null;redraw(f);props(f)}};
}
function redrawLive(f,n){const w=$("#cvw"),el=w.querySelector(`[data-n="${n.id}"]`);el.style.left=n.x+"px";el.style.top=n.y+"px";
  const svg=w.querySelector("svg.edges"),paths=svg.querySelectorAll("path.ed:not(.tmp)"),hits=svg.querySelectorAll("path.hit"),labs=w.querySelectorAll(".elab");let li=0;
  f.E.forEach((e,i)=>{const g=geo(f,e);if(!g)return;paths[i]&&paths[i].setAttribute("d",g.d);hits[i]&&hits[i].setAttribute("d",g.d);
    if(e.l||e.back){const L=[...labs].find(x=>+x.dataset.e===i);if(L){L.style.left=g.m[0]+"px";L.style.top=g.m[1]+"px"}}})}
const skOk=n=>!n.sk||!!(n.a&&n.a.s.includes(n.sk));
const skLbl=n=>n.sk?(sk(n.sk)?sk(n.sk).n:n.sk):"";
function skSel(n){if(!n.a)return "";const L=n.a.s.map(id=>[id,sk(id)?sk(id).n:id]);
  return `<div class="field"><label>Skill</label><select id="nsk"><option value="">Agent entscheidet selbst</option>${L.map(([id,l])=>`<option value="${esc(id)}" ${n.sk===id?'selected':''}>${esc(l)}</option>`).join("")}${n.sk&&!skOk(n)?`<option value="${esc(n.sk)}" selected>⚠ ${esc(skLbl(n))} (hat der Agent nicht mehr)</option>`:""}</select>${n.sk&&!skOk(n)?'<div class="warnbox">Dieser Skill ist dem Agenten nicht mehr zugeordnet – bitte neu wählen oder dem Agenten wieder hinzufügen.</div>':'<div class="hint">Legt fest, welche Fähigkeit des Agenten dieser Schritt nutzt. Die Aufgabe wird beim Wählen aus der Skill-Beschreibung vorbelegt.</div>'}</div>`}
function agentSel(f,cur,id,free){return `<select id="${id}">${free?`<option value="free" ${free===2?"selected":""}>Claude – frei (kein fester Agent)</option>`:""}${AG.filter(a=>a.p===f.p||a.p==="all").map(a=>`<option value="${AG.indexOf(a)}" ${cur===a?'selected':''}>${esc(a.n)}</option>`).join("")}</select>`}
function props(f){props0(f);if(!isEd("flow",f.id)){const P=$("#props");P.innerHTML=`<div class="lockhint">Nur lesen – zum Ändern oben „✎ Bearbeiten“.</div><fieldset disabled>${P.innerHTML}</fieldset>`}}
function props0(f){
  const P=$("#props");
  if(!SEL){ // Ablauf-Einstellungen
    P.innerHTML=`<h2>Prozess-Einstellungen</h2>
     <div class="field"><label>Bereich</label><select id="fp">${PK.map(([p,l])=>`<option value="${p}" ${f.p===p?'selected':''}>${l}</option>`).join("")}</select></div>
     <div class="field"><label>Start</label><select id="frec">${["manuell","täglich","wöchentlich","bei neuer Mail (später)"].map(r=>`<option ${f.rec===r?'selected':''}>${r}</option>`).join("")}</select></div>
     <div class="field"><label>Ziel – was ist am Ende erledigt?</label><textarea id="fg">${esc(f.goal)}</textarea></div>
     <div class="field"><label>Was brauche ich zum Start?</label><textarea id="fs">${esc(f.start)}</textarea></div>
     <div class="field"><span class="flabel">Rückfragen &amp; Benachrichtigung</span>
      <label class="cb"><input type="checkbox" id="fmix" ${f.nt.mix?'checked':''}> Agenten klären Fragen zuerst untereinander</label>
      <table class="nt"><thead><tr><th></th>${CH.map(c=>`<th title="${c}">${c.split(" ")[0]}</th>`).join("")}</tr></thead><tbody>
      ${EV.map(([k,l])=>`<tr><td>${l}</td>${CH.map((c,ci)=>`<td><input type="checkbox" data-ev="${k}" data-ch="${ci}" ${f.nt.ev[k][ci]?'checked':''}></td>`).join("")}</tr>`).join("")}</tbody></table>
      <div class="hint">📱 Handy · 💻 Cowork-App · ✉️ E-Mail</div></div>
     <button class="btn d" id="delF">Prozess löschen</button>
     <p class="hint">Tipp: Knoten oder Verbindung antippen, um sie zu bearbeiten.</p>`;
    $("#fp").onchange=e=>{f.p=e.target.value;FF=f.p;flows()};$("#frec").onchange=e=>f.rec=e.target.value;
    $("#fg").oninput=e=>f.goal=e.target.value;$("#fs").oninput=e=>f.start=e.target.value;$("#fmix").onchange=e=>f.nt.mix=e.target.checked?1:0;
    P.querySelectorAll("[data-ev]").forEach(e=>e.onchange=()=>f.nt.ev[e.dataset.ev][+e.dataset.ch]=e.checked?1:0);
    $("#delF").onclick=async()=>{if(await askOk("Prozess „"+f.n+"“ löschen?")){FL.splice(fcur,1);fcur=FL.findIndex(x=>x.p===FF&&!x.frei);flows()}};
    return}
  if(SEL.k==="e"){const e=f.E[SEL.i];if(!e){SEL=null;return props(f)}const a=nodeOf(f,e.f),b=nodeOf(f,e.t);
    P.innerHTML=`<h2>Verbindung</h2><p class="hint" style="margin-top:0">${esc(nlabel(a))}<br>→ ${esc(nlabel(b))}</p>
     <div class="field"><label>Beschriftung ${a.type==="dec"||a.type==="human"?"(Antwort auf die Frage)":"(optional)"}</label><input type="text" id="el" value="${esc(e.l||"")}"></div>
     <label class="cb"><input type="checkbox" id="eb" ${e.back?'checked':''}> Rücksprung (zurück zu einem früheren Schritt)</label>
     ${e.back?`<div class="field"><label>Höchstens so viele Runden, danach fragt der Prozess dich</label><input type="text" id="em" value="${e.max||3}"></div>`:""}
     <button class="btn d" id="edel">Verbindung löschen</button>`;
    $("#el").oninput=ev=>{e.l=ev.target.value;redraw(f)};
    $("#eb").onchange=ev=>{e.back=ev.target.checked?1:0;if(e.back&&!e.max)e.max=3;redraw(f);props(f)};
    const em=$("#em");if(em)em.oninput=ev=>{e.max=+ev.target.value||3;redraw(f)};
    $("#edel").onclick=async()=>{if(await askOk("Verbindung löschen?")){f.E.splice(SEL.i,1);SEL=null;redraw(f);props(f)}};return}
  const n=nodeOf(f,SEL.id);if(!n){SEL=null;return props(f)}
  const outs=f.E.map((e,i)=>[e,i]).filter(([e])=>e.f===n.id);
  const outHTML=n.type==="dec"||n.type==="human"?`<div class="field"><span class="flabel">Ausgänge</span>${outs.length?outs.map(([e,i])=>`<div class="outrow"><input type="text" data-ol="${i}" value="${esc(e.l||"")}"> → <span>${esc(nlabel(nodeOf(f,e.t)))}</span></div>`).join(""):'<div class="hint">Noch keine – am „+“ des Knotens ziehen.</div>'}</div>`:"";
  let body="";
  if(n.type==="task")body=`<div class="field"><label>Agent</label>${agentSel(f,n.a,"na",n.free&&!n.a?2:1)}</div>${skSel(n)}
    <div class="field"><label>Aufgabe</label><textarea id="nt" style="min-height:110px">${esc(n.t)}</textarea></div>
    <div class="field"><label>Ergebnis</label><input type="text" id="no" value="${esc(n.o||"")}"></div>
    <div class="field"><span class="flabel">Übergabe-Formular an den nächsten Schritt</span>${HO.map((h,i)=>`<label class="cb"><input type="checkbox" data-ho="${i}" ${n.ho[i]?'checked':''}> ${h}</label>`).join("")}</div>`;
  if(n.type==="dec")body=`<div class="field"><label>Wer entscheidet?</label>${agentSel(f,n.a,"na")}</div>
    <div class="field"><label>Frage, nach der entschieden wird</label><textarea id="nl">${esc(n.label||"")}</textarea></div>
    <div class="field"><label>Woran erkennt der Agent die Antwort? (Kriterien)</label><textarea id="nc" placeholder="z. B. gleicher Bereich und gleiche Funktion in einem offenen Ticket">${esc(n.c||"")}</textarea></div>
    <div class="hint">Ist sich der Agent nicht sicher, kommt die Frage als Rückfrage zu dir.</div>`;
  if(n.type==="human")body=`<div class="field"><label>Frage an dich</label><textarea id="nl">${esc(n.label||"")}</textarea></div>
    <div class="hint">Du bekommst sie laut Prozess-Einstellungen aufs Handy und in die Cowork-App – die Ausgänge erscheinen dort als Antwortknöpfe.</div>`;
  if(n.type==="start"||n.type==="end")body=`<div class="field"><label>Beschriftung</label><input type="text" id="nl" value="${esc(n.label||"")}"></div>`;
  P.innerHTML=`<h2>${NS[n.type].l}</h2>${body}${outHTML}<button class="btn d" id="ndel">Knoten löschen</button>`;
  const na=$("#na");if(na)na.onchange=e=>{if(e.target.value==="free"){n.a=null;n.aid=null;n.free=1;delete n.sk}else{n.a=AG[+e.target.value];delete n.free;if(n.sk&&!skOk(n))delete n.sk}redraw(f);props(f)};
  const nsk=$("#nsk");if(nsk)nsk.onchange=async e=>{const v=e.target.value;if(!v){delete n.sk}else{n.sk=v;const S=sk(v),D=S?((S.d||"").split(/\s*Nutzen bei\s*:/i)[0].match(/^.*?[.!?](\s|$)/)||[(S.d||"").split(/\s*Nutzen bei\s*:/i)[0]])[0].trim():"";if(D&&(!n.t||!n.t.trim()||await askOk("Aufgabe ersetzen durch: „"+D+"“?","Ja, ersetzen")))n.t=D}redraw(f);props(f)};
  const nt=$("#nt");if(nt)nt.oninput=e=>{n.t=e.target.value;redraw(f)};
  const no=$("#no");if(no)no.oninput=e=>n.o=e.target.value;
  const nl=$("#nl");if(nl)nl.oninput=e=>{n.label=e.target.value;redraw(f)};
  const nc=$("#nc");if(nc)nc.oninput=e=>n.c=e.target.value;
  P.querySelectorAll("[data-ho]").forEach(c=>c.onchange=()=>n.ho[+c.dataset.ho]=c.checked?1:0);
  P.querySelectorAll("[data-ol]").forEach(c=>c.oninput=()=>{f.E[+c.dataset.ol].l=c.value;redraw(f)});
  $("#ndel").onclick=async()=>{if(!await askOk("Knoten „"+nlabel(n)+"“ samt seinen Verbindungen löschen?"))return;f.N=f.N.filter(x=>x!==n);f.E=f.E.filter(e=>e.f!==n.id&&e.t!==n.id);SEL=null;redraw(f);props(f)};
}