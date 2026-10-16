// ===== Organigramm (nur Ansicht) =====
let OC="",LOS="";
function org(){
  const oe=isEd("org");$("#org").classList.toggle("editing",oe);
  if(!orgById(OC))OC=ORGS()[0].id;const O=orgById(OC);
  $("#orged").innerHTML=oe?`<span class="hint" style="text-transform:none;letter-spacing:0;font-weight:400;margin:0 10px 0 0">Agenten ziehen · Abteilungen, Teams und Organisationen anlegen</span>`+edBtns(1):`<button class="btn sm" id="orgav" title="Offene und erledigte Aufträge aller Abteilungen">🕘 Aufträge &amp; Verlauf</button> <button class="btn sm ebtn" id="orgedit" title="Agenten verschieben, Abteilungen, Teams und Organisationen anlegen">✎ Bearbeiten</button>`;
  $("#oseg").innerHTML=ORGS().map(o=>`<button data-oc="${o.id}" class="${o.id===OC?'on':''}" title="${esc(o.n+(o.desc?" – "+o.desc:"")+(o.prod?"\nProdukt: "+PN[o.prod]:""))}">${esc(o.kurz||o.n)}</button>`).join("")+(oe?`<button class="add" id="onew" title="Neue Organisation (Unternehmen) mit eigenem Organigramm">+ Organisation</button>`:"");
  document.querySelectorAll("[data-oc]").forEach(b=>b.onclick=()=>{OC=b.dataset.oc;org()});$("#oskills").onchange=org;
  $("#ohint").textContent=O.n+(O.prod?" · Produkt "+PN[O.prod]+" – zeigt "+PN[O.prod]+"-Agenten und produktunabhängige":" · ohne Produkt – zeigt nur produktunabhängige Agenten");
  const showS=$("#oskills").checked,A=AG.filter(a=>inOrg(a,OC)),D=deptsOf(OC),known=new Set(D.map(d=>d.id));
  const gf=usr(O.gf),ab=a=>PL(a,OC).abt,tm=a=>PL(a,OC).team;
  const card=a=>{const ow=usr(a.owner);return `<div class="oag p-${a.p}" data-oa="${a.id}" ${oe?'draggable="true" title="Ziehen = in andere Abteilung oder anderes Team"':''}><div class="oh" ${oe?'':`data-goa="${a.id}" title="Agent „${esc(a.n)}“ öffnen"`}>${av(ow,50,1)}<div><b>${esc(a.n)}</b><small>${PN[a.p]}${ow?" · "+esc(ow.n):" · Verantwortlich offen"}</small></div>${oe?"":`<button class="oplay" data-play="${a.id}" title="Auftrag direkt an „${esc(a.n)}“ geben" aria-label="Auftrag an ${esc(a.n)}">▶</button>`}</div>
      ${showS?`<div class="oskl">${a.s.map(id=>sk(id)).filter(Boolean).map(s=>`<span ${oe?'':`data-gos="${a.id}|${s.id}"`} title="${oe?"":"Skill in der Bibliothek zeigen · "}${esc(KS(s).join(", "))}">${esc(s.n)}</span>`).join("")||'<span style="background:#eef0f4;color:var(--mut)">keine Skills</span>'}</div>`:""}${!oe&&runCnt(a.id)?`<button class="orun" data-orun="${a.id}" title="Laufende Aufträge dieses Agenten zeigen">● ${runCnt(a.id)} läuft</button>`:""}</div>`};
  const uopts=v=>{const M=US.filter(x=>(x.aktiv!==false&&(x.orgs||[]).includes(OC))||x.id===v),L=M.length?M:US.filter(x=>x.aktiv!==false||x.id===v);return `<option value="">– offen –</option>`+L.map(x=>`<option value="${x.id}" ${x.id===v?'selected':''}>${esc(x.n)}</option>`).join("")};
  const lead=(kind,id,uidv,label)=>{const u=usr(uidv);if(oe)return `<div class="olead">${av(u,26)}<span>${label}:</span><select data-lead="${kind}" data-lid="${id}">${uopts(uidv)}</select></div>`;
    return `<div class="olead">${av(u,26)}<span>${label}: <b>${u?esc(u.n):"offen"}</b></span></div>`};
  const dz=(abt,team,L,empty)=>`<div class="odz" data-dz-abt="${abt}" data-dz-team="${team}">${L.map(card).join("")||(empty?`<div class="hint" style="margin:0;padding:4px 2px">${empty}</div>`:"")}</div>`;
  const col=d=>{const L=A.filter(a=>ab(a)===d.id),T=teamsOf(d),direct=L.filter(a=>!T.some(t=>t.id===tm(a)));
    return `<div class="odept"><div class="odh"><b>${esc(d.n)}</b><span class="cnt">${L.length} Agent${L.length===1?"":"en"}</span>${oe?`<button class="ic" data-dren="${d.id}" title="Abteilung umbenennen">✎</button><button class="ic" data-ddel="${d.id}" title="Abteilung löschen">🗑</button>`:""}</div>
     <div class="odb">${oe?"":`<div class="oact"><button class="btn sm p" data-oabt="${d.id}" title="Auftrag an die Abteilung – der KI-Teamleiter wählt den passenden Agenten">▶ Abteilung beauftragen</button><button class="btn sm" data-oav="${d.id}" title="Aufträge dieser Abteilung">🕘 Verlauf</button></div>`}${lead("d",d.id,d.lead,"Leitung")}
      ${T.map(t=>{const TL=L.filter(a=>tm(a)===t.id);return `<div class="oteam"><div class="oth"><span>Team ${esc(t.n)}</span><span class="cnt">${TL.length}</span>${oe?`<button class="ic" data-tren="${d.id}|${t.id}" title="Team umbenennen">✎</button><button class="ic" data-tdel="${d.id}|${t.id}" title="Team löschen">🗑</button>`:""}</div>
        ${lead("t",d.id+"|"+t.id,t.lead,"Teamleitung")}${dz(d.id,t.id,TL,oe?"Agenten hierher ziehen":"–")}</div>`}).join("")}
      ${T.length&&(direct.length||oe)?`<div class="odlab">Direkt in der Abteilung</div>`:""}${dz(d.id,"",direct,oe?"Agenten hierher ziehen":(T.length?"":"–"))}
      ${oe?`<button class="btn sm" data-tnew="${d.id}">+ Team</button>`:""}</div></div>`};
  let cols=D.map(col).join("");
  const none=A.filter(a=>!known.has(ab(a)));
  if(none.length||oe)cols+=`<div class="odept none"><div class="odh"><b>Ohne Abteilung</b><span class="cnt">${none.length} Agent${none.length===1?"":"en"}</span></div><div class="odb">${dz("","",none,oe?"Agenten hierher ziehen = aus Abteilung lösen":"–")}</div></div>`;
  if(oe)cols+=`<div class="orgnew" id="dnew">+ Abteilung</div>`;
  const nT=D.reduce((n,d)=>n+teamsOf(d).length,0);
  const top=oe?`<div class="obox">${av(gf,40)}<div><b>${esc(O.n)}</b> <button class="ic" id="oren" title="Organisation umbenennen">✎</button>${ORGS().length>1?`<button class="ic" id="odel" title="Organisation löschen">🗑</button>`:""}
      <div class="orow2">Geschäftsführung: <select id="ogf">${uopts(O.gf)}</select></div>
      <div class="orow2">Produkt: <select id="oprod"><option value="">– keins –</option>${["bodo","sellify"].map(p=>`<option value="${p}" ${O.prod===p?'selected':''}>${PN[p]}</option>`).join("")}</select></div></div></div>`
    :`<div class="obox">${av(gf,40)}<div><b>${esc(O.n)}</b><small>Geschäftsführung: ${gf?esc(gf.n):"offen"} · ${A.length} Agenten in ${D.length} Abteilungen${nT?" · "+nT+" Teams":""}</small></div></div>`;
  $("#orgv").innerHTML=`<div class="orgwrap"><div class="otop">${top}</div><div class="otrunk"></div><div class="orow">${cols}</div></div>`;
  const row=$("#orgv .orow"),ds=row.querySelectorAll(".odept");if(ds.length>1){const f=ds[0],l=ds[ds.length-1];row.style.setProperty("--l",(f.offsetLeft+f.offsetWidth/2)+"px");row.style.setProperty("--r",(row.scrollWidth-l.offsetLeft-l.offsetWidth/2)+"px")}else{row.style.setProperty("--l","50%");row.style.setProperty("--r","50%")}
  const ob=$("#orgedit");if(ob)ob.onclick=()=>{if(startEdit("org",null,null,["meta/config",...DP.map(d=>"depts/"+d.id),...AG.map(a=>"agents/"+a.id),...US.map(u=>"users/"+u.id)],false,["depts"]))org()};
  bindEd($("#orged"),()=>org());
  document.querySelectorAll("[data-oa]").forEach(e=>{e.ondragstart=ev=>{if(oe)ev.dataTransfer.setData("ag",e.dataset.oa)}});
  if(!oe){document.querySelectorAll("[data-goa]").forEach(e=>e.onclick=ev=>{if(ev.target.closest("[data-play]"))return;goAgent(e.dataset.goa)});
    document.querySelectorAll("[data-play]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();startModal(null,{art:"agent",aid:b.dataset.play,org:OC})});
    document.querySelectorAll("[data-orun]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();const a=AG.find(x=>x.id===b.dataset.orun);if(a)avOpen({org:OC,only:a,tab:"offen"})});
    document.querySelectorAll("[data-oabt]").forEach(b=>b.onclick=()=>startModal(null,{art:"abteilung",abt:b.dataset.oabt,org:OC}));
    document.querySelectorAll("[data-oav]").forEach(b=>b.onclick=()=>avOpen({org:OC,d:[b.dataset.oav]}));
    const oav=$("#orgav");if(oav)oav.onclick=()=>avOpen({org:OC});
    document.querySelectorAll("[data-gos]").forEach(e=>e.onclick=ev=>{ev.stopPropagation();const [ai,si]=e.dataset.gos.split("|");goSkill(ai,si)})}
  if(!oe)return;
  document.querySelectorAll(".odz").forEach(z=>{z.ondragover=e=>{e.preventDefault();e.stopPropagation();z.classList.add("over")};z.ondragleave=e=>{if(!z.contains(e.relatedTarget))z.classList.remove("over")};
    z.ondrop=e=>{e.preventDefault();e.stopPropagation();z.classList.remove("over");const a=AG.find(x=>x.id===e.dataTransfer.getData("ag"));if(!a)return;moveAg(a,OC,z.dataset.dzAbt,z.dataset.dzTeam);org();
      const d=dept(ab(a)),t=teamOf(a,OC);toast("„"+a.n+"“ → "+(d?d.n+(t?" · Team "+t.n:""):"ohne Abteilung"))}});
  document.querySelectorAll("[data-lead]").forEach(s=>s.onchange=()=>{const v=s.value||null;if(s.dataset.lead==="d"){const d=dept(s.dataset.lid);if(v)d.lead=v;else delete d.lead}else{const [di,ti]=s.dataset.lid.split("|"),t=teamsOf(dept(di)).find(x=>x.id===ti);if(v)t.lead=v;else delete t.lead}org()});
  $("#ogf").onchange=e=>{O.gf=e.target.value||null;org()};
  $("#oprod").onchange=e=>{const n=e.target.value;if(n&&ORGS().some(o=>o!==O&&o.prod===n))toast("Hinweis: "+PN[n]+" hängt jetzt an zwei Organisationen");O.prod=n;org()};
  $("#oren").onclick=async()=>{const n=await askText("Organisation umbenennen (voller Name)",O.n);if(!n)return;const k=await askText("Kurzname für den Umschalter",O.kurz||n);O.n=n;O.kurz=k||n;org()};
  const od=$("#odel");if(od)od.onclick=async()=>{const D2=deptsOf(OC);if(!await askOk("Organisation „"+O.n+"“ mit ihrem Organigramm"+(D2.length?" ("+D2.length+" Abteilungen)":"")+" löschen? Agenten und Benutzer bleiben erhalten."))return;
    D2.forEach(d=>DP.splice(DP.indexOf(d),1));AG.forEach(a=>{if(a.pl&&a.pl[OC]){a.pl={...a.pl};delete a.pl[OC]}});US.forEach(u=>{if(u.orgs)u.orgs=u.orgs.filter(x=>x!==OC)});SET.orgs=ORGS().filter(o=>o!==O);OC="";org()};
  $("#onew").onclick=async()=>{const n=await askText("Name der neuen Organisation (Unternehmen)","");if(!n)return;if(ORGS().some(o=>o.n.toLowerCase()===n.toLowerCase()))return toast("Diese Organisation gibt es schon");const o={id:uid("og"),n,kurz:n,prod:"",gf:null};SET.orgs=[...ORGS(),o];OC=o.id;org();toast("Organisation angelegt – Geschäftsführung, Produkt und Abteilungen festlegen")};
  $("#dnew").onclick=async()=>{const n=await askText("Neue Abteilung in „"+O.kurz+"“","");if(!n)return;if(D.some(d=>d.n.toLowerCase()===n.toLowerCase()))return toast("Diese Abteilung gibt es hier schon");DP.push({id:uid("ab"),n,org:OC,ord:D.length});org()};
  document.querySelectorAll("[data-dren]").forEach(b=>b.onclick=async()=>{const d=dept(b.dataset.dren),n=await askText("Abteilung umbenennen",d.n);if(n){d.n=n;org()}});
  document.querySelectorAll("[data-ddel]").forEach(b=>b.onclick=async()=>{const d=dept(b.dataset.ddel),k=AG.filter(a=>ab(a)===d.id);
    if(await askOk("Abteilung „"+d.n+"“"+(teamsOf(d).length?" samt "+teamsOf(d).length+" Team(s)":"")+" löschen?"+(k.length?" "+k.length+" Agent(en) werden danach „Ohne Abteilung“ geführt.":""))){k.forEach(a=>moveAg(a,OC,"",""));DP.splice(DP.indexOf(d),1);org()}});
  document.querySelectorAll("[data-tnew]").forEach(b=>b.onclick=async()=>{const d=dept(b.dataset.tnew),n=await askText("Name des neuen Teams in „"+d.n+"“","");if(!n)return;if(teamsOf(d).some(t=>t.n.toLowerCase()===n.toLowerCase()))return toast("Dieses Team gibt es schon");d.teams=[...teamsOf(d),{id:uid("tm"),n}];org();toast("Team angelegt – Agenten hineinziehen, Teamleitung wählen")});
  document.querySelectorAll("[data-tren]").forEach(b=>b.onclick=async()=>{const [di,ti]=b.dataset.tren.split("|"),t=teamsOf(dept(di)).find(x=>x.id===ti),n=await askText("Team umbenennen",t.n);if(n){t.n=n;org()}});
  document.querySelectorAll("[data-tdel]").forEach(b=>b.onclick=async()=>{const [di,ti]=b.dataset.tdel.split("|"),d=dept(di),t=teamsOf(d).find(x=>x.id===ti),k=AG.filter(a=>ab(a)===di&&tm(a)===ti);
    if(await askOk("Team „"+t.n+"“ löschen?"+(k.length?" "+k.length+" Agent(en) bleiben direkt in „"+d.n+"“.":""))){k.forEach(a=>moveAg(a,OC,di,""));d.teams=teamsOf(d).filter(x=>x!==t);org()}});
}
function goAgent(id){const i=AG.findIndex(a=>a.id===id);if(i<0)return false;if(EDIT&&blocked())return false;cur=i;AF=AG[i].p;if(AF==="all")LOS=OC;if($("#follow").checked)PF=AF;show("build");
  setTimeout(()=>{const el=document.querySelector(`.aitem[data-i="${i}"]`);if(el){el.scrollIntoView({block:"nearest",behavior:"smooth"});el.classList.remove("hit");void el.offsetWidth;el.classList.add("hit")}},80);return true}
function goSkill(aid,sid){const s=sk(sid);if(!s)return;if(EDIT&&blocked())return;SKSEL=sid;SKORG="";SKSRC="";AFIL="all";$("#q").value="";COL.delete(s.g);show("skills");
  setTimeout(()=>{const el=document.querySelector(`#lib .skill[data-id="${CSS.escape(sid)}"]`);if(!el)return;el.scrollIntoView({block:"center",behavior:"smooth"});el.classList.remove("hit");void el.offsetWidth;el.classList.add("hit")},120)}