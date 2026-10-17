function inherited(a){ // Leitplanken aus Skills, gleiche Regel aus mehreren Skills zusammengefasst
  const m=new Map(),add=(r,src)=>{if(!m.has(r))m.set(r,[]);m.get(r).push(src)};
  a.s.forEach(id=>{const s=sk(id);if(!s)return;s.lp.forEach(r=>add(r,{s,l:s.n+(s.p==="multi"?" · Kern":"")}));
    if(s.p==="multi")(a.p==="all"?["bodo","sellify"]:[a.p]).forEach(k=>s.prof[k]&&s.prof[k].lp.forEach(r=>add(r,{s,l:s.n+" · "+PN[k]})))});
  return [...m.entries()];
}
// Regeln eines Skills für ein Produkt: [{r, l}] – die Leitplanken des Skills und bei Kern-Skills die des Produktprofils (l = Herkunft)
function skRegeln(s,p){const L=(s.lp||[]).map(r=>({r,l:s.p==="multi"?"Kern":""}));
  if(s.p==="multi")(p==="all"?["bodo","sellify"]:[p]).forEach(k=>s.prof&&s.prof[k]&&(s.prof[k].lp||[]).forEach(r=>L.push({r,l:PN[k]})));return L}
function md(a){
  const slug=a.n.toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const inh=inherited(a),gl=GLOBAL.filter((r,i)=>a.gl[i]);
  const bsp=(a.bsp||[]).filter(Boolean),desc=((a.w||a.r)+(bsp.length?" Beispiele: "+bsp.map(x=>"„"+x+"“").join(" "):"")).replace(/"/g,"'");
  return `---\nname: ${slug}\ndescription: "${desc}"\nmodel: ${a.m.toLowerCase()}\nskills: ${[...new Set(a.s.flatMap(id=>sk(id)?KS(sk(id)):[id]))].join(", ")}\n---\n\nDu bist der Agent „${a.n}“ für ${ICH()} (${ORGS().map(o=>o.n).join(" / ")}).\n\nAufgabe: ${a.r}\n\nSkills:\n${a.s.map(id=>"- "+(sk(id)?KS(sk(id)).join(" + ")||id:id)+" ("+(sk(id)?.n||"")+")"+(profOf(a,sk(id))?" – "+profOf(a,sk(id)):"")).join("\n")||"- (keine)"}\n${a.mcp.length?"\nZielsysteme (MCP): "+a.mcp.join(", ")+"\n":""}\n${usr(a.owner)?"Verantwortlich (Mensch): "+usr(a.owner).n+(usr(a.dep)?", Vertretung: "+usr(a.dep).n:"")+" – Freigaben und Rückfragen gehen an diese Person.\n\n":""}Regeln dieses Agenten:\n${a.own.map(r=>"- "+r).join("\n")||"- (keine)"}\n${gl.length?"\nAllgemeine Vorgaben von Boris:\n"+gl.map(r=>"- "+r).join("\n")+"\n":""}\n# Hinweis: Die ${inh.length} Leitplanken aus den Skills stehen in den Skills selbst und wirken automatisch, sobald ein Skill läuft.`;
}
function editor(){
  const a=AG[cur];if(!a||a.p!==AF){$("#editor").innerHTML=`<p class="hint">Keine ${PN[AF]}-Agenten vorhanden – links „+ Neuer Agent“ legt einen an.</p>`;return}
  const inh=inherited(a);
  const sec=(k,title,sum,body,noEdit,pre)=>{const ed=isEd("agent",a.id,k);return `<div class="esec ${EOPEN.has(k)||ed?'open':''} ${ed?'editing':''}" data-sec="${k}"><div class="eshead" data-st="${k}"><span class="caret">▾</span><b>${title}</b><span class="essum">${sum}</span>${noEdit?"":edBtns(ed,`data-eopen="${k}"`)}</div><div class="esbody">${pre||""}${noEdit?body:`<fieldset ${ed?"":"disabled"}>${body}</fieldset>`}</div></div>`};
  const ow=usr(a.owner),dp=usr(a.dep),bspn=(a.bsp||[]).filter(Boolean).length;
  const einsSum=!a.w||!bspn?'<span style="color:var(--warn)">offen – für Plugin nötig</span>':a.wv?'<span style="color:#8a5a00">Entwurf von Claude – bitte prüfen</span>':'<span class="okm">✓</span> festgelegt';
  $("#editor").innerHTML=`
  <div class="etop"><h2 style="margin:0;flex:1">Agent bearbeiten ${a.vorschlag?'<span class="mark">Vorschlag von Claude</span> <button class="btn sm" id="takeA">Übernehmen</button>':""}</h2>
    <button class="btn sm" id="eopenall" title="Alle Gruppen aufklappen">Alle auf</button><button class="btn sm" id="ecloseall" title="Alle Gruppen zuklappen">Alle zu</button>
    <button class="btn sm" id="libtg" title="Zur Skill-Übersicht">Skills ansehen ▸</button></div>
  <div class="ahead">${av(ow,96,1)}<div class="who"><b>${esc(a.n)}${a.prov?` <span class="pvb ${a.prov.stat}" style="font-size:11px;vertical-align:middle;cursor:pointer" data-pvag="${a.id}" title="Anklicken: Änderungen ansehen und freigeben">⇅ ${a.prov.stat==="frei"?"zur Übertragung freigegeben":"Änderung noch nicht bei Claude"}</span>`:""}</b><small>${ow?"Verantwortlich: "+esc(ow.n):"Verantwortlich: offen"} · ${dp?"Vertretung: "+esc(dp.n):"Vertretung: offen"} · ${PN[a.p]} · ${a.s.length} Skills</small></div></div>
  ${sec("verant","Verantwortung",(ow?esc(ow.n):'<span style="color:var(--warn)">offen</span>')+" · Vertretung: "+(dp?esc(dp.n):"offen"),`
    <div class="row"><div class="field"><label>Verantwortlich (Mensch)</label>${usersSel("aow",a.owner,"– offen –")}</div><div class="field"><label>Vertretung</label>${usersSel("adp",a.dep,"– offen –")}</div></div>
    <div class="hint" style="margin:-8px 0 4px">Das Bild am Agenten zeigt den verantwortlichen Menschen, das Abzeichen „KI“ den Agenten.${US.length?"":" Noch keine Benutzer – unter „Benutzer“ anlegen."}</div>`)}
  ${sec("basis","Grunddaten",(placeTxt(a)?esc(placeTxt(a))+" · ":"")+PN[a.p]+" · "+esc(a.m)+(a.r?" · "+esc(a.r.length>70?a.r.slice(0,68)+"…":a.r):""),`
    <div class="row"><div class="field"><label>Name</label><input type="text" id="an" value="${esc(a.n)}"></div><div>
    <div class="row"><div class="field"><label>Produkt</label><select id="ap">${["bodo","sellify","all"].map(p=>`<option value="${p}" ${a.p===p?'selected':''}>${PN[p]}</option>`).join("")}</select></div>
    <div class="field"><label>Modell</label><select id="am">${["Opus","Sonnet","Haiku"].map(m=>`<option ${m==a.m?'selected':''}>${m}</option>`).join("")}</select></div></div></div></div>
    ${agOrgs(a).map(o=>{const pl=PL(a,o.id),T=teamsOf(dept(pl.abt));return `<div class="row"><div class="field"><label>Abteilung · ${esc(o.kurz||o.n)}</label><select data-pabt="${o.id}"><option value="">– ohne Abteilung –</option>${deptsOf(o.id).map(d=>`<option value="${d.id}" ${pl.abt===d.id?'selected':''}>${esc(d.n)}</option>`).join("")}</select></div>
     <div class="field"><label>Team</label><select data-ptm="${o.id}" ${T.length?"":"disabled"}><option value="">${T.length?"– direkt in der Abteilung –":"– keine Teams –"}</option>${T.map(t=>`<option value="${t.id}" ${pl.team===t.id?'selected':''}>${esc(t.n)}${usr(t.lead)?" · Leitung "+esc(usr(t.lead).n):""}</option>`).join("")}</select></div></div>`}).join("")||'<div class="hint">Gehört zu keiner Organisation – Produkt prüfen.</div>'}
    <div class="hint" style="margin:-6px 0 10px">Produktunabhängige Agenten stehen in jeder Organisation an eigener Stelle. Abteilungen und Teams legst du im Organigramm an.</div>
    <div class="field"><label>Ziel – was erreicht der Agent?</label><textarea id="ar">${esc(a.r)}</textarea></div>`)}
  ${sec("einsatz","Einsatz",einsSum+(bspn?" · "+bspn+" Beispielsätze":""),`
    <div class="field"><label>Wann einsetzen? ${a.w?"":'<span class="need">für Plugin nötig</span>'}</label><textarea id="aw" placeholder="z. B. Wenn nach einem Erstgespräch Kontakt, Produktblatt, Angebot und Begleitmail für einen Interessenten braucht. Nicht für …">${esc(a.w||"")}</textarea>
     <div class="warnbox">Dieser Text entscheidet, wann Claude den installierten Agenten von selbst auswählt – konkret beschreiben, auch wofür er <b>nicht</b> gedacht ist.</div></div>
    <div class="field"><label>Beispielsätze – so würdest du ihn beauftragen (einer pro Zeile) ${bspn?"":'<span class="need">für Plugin nötig</span>'}</label><textarea id="abs" placeholder="z. B. Bereite das Angebot für den Mieterverein Duisburg vor.">${esc((a.bsp||[]).join("\n"))}</textarea></div>
    <div class="field"><label>Notizen – nur für dich, z. B. offene Punkte</label><textarea id="ano" placeholder="Was macht der Agent genau? Was fehlt noch?">${esc(a.note)}</textarea></div>`,0,a.wv&&!isEd("agent",a.id,"einsatz")?`<div class="lockhint" style="background:#fff4d6;color:#8a5a00"><b>Entwurf von Claude – bitte prüfen.</b> Passt der Text, mit „Passt so“ bestätigen, sonst über ✎ Bearbeiten anpassen. <button class="btn sm" id="wok">Passt so</button></div>`:"")}
  ${sec("skills","Skills",a.s.length+" Skill"+(a.s.length===1?"":"s")+(a.s.some(id=>bad(a,sk(id)))?' · <span style="color:#b42318">⚠ passt nicht zum Produkt</span>':""),`
    <div class="drop" id="drop">${a.s.map(id=>`<span class="chip ${bad(a,sk(id))?'bad':''}" title="${bad(a,sk(id))?'Gehört zu '+PN[sk(id).p]+' – passt nicht zum Produkt dieses Agenten':id}"><span data-gosk="${esc(id)}" style="cursor:pointer">${bad(a,sk(id))?'⚠ ':''}${esc(sk(id)?.n||id)}</span>${profOf(a,sk(id))?` <small class="prf">· ${profOf(a,sk(id))}</small>`:""}${isEd("agent",a.id,"skills")?`<button class="ic" data-r="${id}" title="entfernen">×</button>`:""}</span>`).join("")||'<span class="hint">noch keine Skills</span>'}</div>
    ${isEd("agent",a.id,"skills")?'<button class="btn" id="skadd" style="margin-top:8px">+ Skills hinzufügen …</button>':'<div class="hint" style="margin:6px 0 0">Zum Hinzufügen oder Entfernen oben „✎ Bearbeiten“ · Skill antippen = in der Skill-Übersicht öffnen</div>'}`)}
  ${sec("regeln","Verbindungen & Leitplanken",(a.mcp.length?a.mcp.join(", "):"keine Verbindung")+" · "+inh.length+" geerbt · "+a.own.length+" eigene",`
    <div class="field"><label>Verbindungen (MCP)</label><div style="display:flex;gap:16px">${adapterListe().map(x=>x.n).map(m=>`<label class="cb"><input type="checkbox" data-m="${m}" ${a.mcp.includes(m)?'checked':''}> ${m}</label>`).join("")}</div></div>
    <div class="field"><span class="flabel">Leitplanken – woher sie kommen</span><div class="lpwrap">
    <div class="lpsec"><h4>1 · Aus den Skills geerbt <span class="badge lp">${inh.length}</span><span class="hint" style="margin:0;font-weight:400">automatisch, nur im Skill änderbar</span></h4>
      ${inh.map(([r,srcs])=>`<div class="lprule"><span class="txt">${esc(r)}</span>${srcs.map(x=>`<span class="src" title="${x.s.id}" data-edit="${x.s.id}">⛨ ${esc(x.l)}</span>`).join(" ")}</div>`).join("")||'<div class="hint">Die gewählten Skills bringen keine Leitplanken mit.</div>'}</div>
    <div class="lpsec"><h4>2 · Eigene Regeln dieses Agenten <span class="badge">${a.own.length}</span></h4>
      ${a.own.map((r,i)=>`<div class="lprule"><span class="txt">${esc(r)}</span><button class="ic" data-ro="${i}" title="entfernen">×</button></div>`).join("")||'<div class="hint">Noch keine.</div>'}
      <div class="ownadd"><input type="text" id="ownin" placeholder="Neue Regel für diesen Agenten …"><button class="btn" id="ownbtn">Hinzufügen</button></div></div>
    <div class="lpsec"><h4>3 · Deine allgemeinen Vorgaben</h4><div class="hint" style="margin:0 0 6px">Gelten in Cowork sowieso immer. Häkchen = zusätzlich fest in den Agenten schreiben (wichtig, falls er außerhalb von Cowork läuft).</div>
      ${GLOBAL.map((r,i)=>`<label class="cb"><input type="checkbox" data-gl="${i}" ${a.gl[i]?'checked':''}> ${esc(r)}</label>`).join("")}</div>
    </div></div>`)}
  ${sec("def","Agent-Definition","so wird der Agent später erzeugt",`<pre id="pv"></pre>
    <div class="btns" style="margin-top:10px"><button class="btn p" id="copyA">Definition kopieren</button><button class="btn d" id="del">Agent löschen</button></div>`,1)}`;
  document.querySelectorAll("#editor [data-st]").forEach(h=>h.onclick=()=>{const k=h.dataset.st,el=h.parentElement;el.classList.toggle("open");el.classList.contains("open")?EOPEN.add(k):EOPEN.delete(k);saveUI()});
  $("#eopenall").onclick=()=>{document.querySelectorAll("#editor .esec").forEach(x=>{x.classList.add("open");EOPEN.add(x.dataset.sec)});saveUI()};
  $("#ecloseall").onclick=()=>{document.querySelectorAll("#editor .esec").forEach(x=>x.classList.remove("open"));EOPEN.clear();saveUI()};
  $("#libtg").onclick=()=>show("skills");
  document.querySelectorAll("#editor [data-eopen]").forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.eopen;
    if(!startEdit("agent",a.id,k,["agents/"+a.id]))return;EOPEN.add(k);saveUI();if(k==="skills")setTimeout(()=>{const b=$("#skadd");if(b)b.focus()},50);render()});
  bindEd($("#editor"),()=>render());
  upd();
  $("#an").oninput=e=>{a.n=e.target.value;alist();matrix();upd()};
  $("#ar").oninput=e=>{a.r=e.target.value;upd()};
  $("#aw").oninput=e=>{a.w=e.target.value;a.wv=false;upd()};const wok=$("#wok");if(wok)wok.onclick=()=>{a.wv=false;render();schedule();toast("Einsatz übernommen")};$("#aw").onchange=()=>editor();
  $("#abs").oninput=e=>{a.wv=false;a.bsp=e.target.value.split("\n").map(x=>x.trim()).filter(Boolean);upd()};$("#abs").onchange=()=>editor();$("#ano").oninput=e=>{a.note=e.target.value;alist()};
  {const pb=document.querySelector("[data-pvag]");if(pb)pb.onclick=()=>provConfirm([["agents",a]])}
  $("#am").onchange=e=>{a.m=e.target.value;upd()};document.querySelectorAll("[data-pabt]").forEach(s=>s.onchange=()=>{moveAg(a,s.dataset.pabt,s.value,"");render()});document.querySelectorAll("[data-ptm]").forEach(s=>s.onchange=()=>{moveAg(a,s.dataset.ptm,PL(a,s.dataset.ptm).abt,s.value);render()});
  $("#aow").onchange=e=>{a.owner=e.target.value||null;if(a.owner&&a.dep===a.owner)a.dep=null;render()};$("#adp").onchange=e=>{a.dep=e.target.value||null;render()};
  $("#ap").onchange=e=>{a.p=e.target.value;AF=a.p;if($("#follow").checked)PF=a.p;render()};
  $("#del").onclick=async()=>{if(await askOk("Agent „"+a.n+"“ löschen?")){AG.splice(cur,1);cur=-1;render();schedule()}};
  const ta=$("#takeA");if(ta)ta.onclick=()=>{a.vorschlag=false;render();schedule();toast("Agent übernommen")};
  $("#copyA").onclick=()=>copyText(md(a),"Agent-Definition kopiert");
  document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{a.s=a.s.filter(x=>x!==b.dataset.r);render()});
  document.querySelectorAll("[data-m]").forEach(c=>c.onchange=()=>{a.mcp=c.checked?[...a.mcp,c.dataset.m]:a.mcp.filter(x=>x!==c.dataset.m);alist();upd()});
  document.querySelectorAll("[data-gl]").forEach(c=>c.onchange=()=>{a.gl[+c.dataset.gl]=c.checked?1:0;upd()});
  document.querySelectorAll("#editor [data-edit]").forEach(b=>b.onclick=()=>skillModal(b.dataset.edit));
  document.querySelectorAll("[data-ro]").forEach(b=>b.onclick=async()=>{if(await askOk("Regel „"+a.own[+b.dataset.ro]+"“ entfernen?")){a.own.splice(+b.dataset.ro,1);editor()}});
  const add=()=>{const v=$("#ownin").value.trim();if(v){a.own.push(v);editor()}};$("#ownbtn").onclick=add;$("#ownin").onkeydown=e=>{if(e.key==="Enter")add()};
  {const b=$("#skadd");if(b)b.onclick=()=>skPick(a)}
  document.querySelectorAll("#editor [data-gosk]").forEach(e=>e.onclick=()=>{if(isEd("agent",a.id,"skills"))return;goSkill(a.id,e.dataset.gosk)});
}
function upd(){const p=$("#pv");if(p)p.textContent=md(AG[cur])}
function alist(){
  const L=agVis(),ae=isEd("abt");$("#apanel").classList.toggle("editing",ae);
  $("#abted").innerHTML=ae?edBtns(1):`<button class="btn sm ebtn" id="abtedit" title="Abteilungen anlegen, umbenennen und Agenten hineinziehen">✎ Abteilungen</button>`;
  const item=([a,i])=>`<div class="aitem p-${a.p} ${i==cur?'on':''}" data-i="${i}" ${ae?'draggable="true"':''}>${av(usr(a.owner),56,1)}<div class="t"><b>${esc(a.n)}</b>
   <small>${a.s.length} Skills${a.mcp.length?' · '+a.mcp.join(", "):''}${a.note?' · 📝':''}${a.vorschlag?' · Vorschlag':''}${a.w&&(a.bsp||[]).length?(a.wv?' · <span style="color:#8a5a00">Einsatz: Entwurf</span>':''):' · <span style="color:var(--warn)">Einsatz offen</span>'}${a.prov?` <span class="pvb ${a.prov.stat}" title="${a.prov.stat==="frei"?"Freigegeben – wird beim nächsten Abgleich zu Claude übertragen":"Im Cockpit geändert – noch nicht zur Übertragung an Claude freigegeben"}">⇅ ${a.prov.stat==="frei"?"freigegeben":"nicht bei Claude"}</span>`:""}</small></div>${ae?'<span class="hint" style="margin:0" title="Ziehen">⠿</span>':`<button class="ic" data-ren="${i}" title="Grunddaten bearbeiten">✎</button>`}</div>`;
  const LO=(AF!=="all"&&ORGS().find(o=>o.prod===AF))||orgById(LOS)||ORGS()[0],O=LO.id,ab=a=>PL(a,O).abt,tmA=a=>PL(a,O).team;
  const DD=deptsOf(O),known=new Set(DD.map(d=>d.id)),groups=[["",'Ohne Abteilung']].concat(DD.map(d=>[d.id,d.n]));
  let h=AF==="all"?`<div class="lorg">Abteilungen aus: ${ORGS().map(o=>`<button data-lo="${o.id}" class="${o.id===O?'on':''}" title="${esc(o.n)}">${esc(o.kurz||o.n)}</button>`).join("")}</div>`:`<div class="lorg" title="${esc(LO.n)}">Abteilungen aus: <b>${esc(LO.kurz||LO.n)}</b></div>`;
  groups.forEach(([id,n])=>{const A=L.filter(([a])=>id?ab(a)===id:!known.has(ab(a)));if(!A.length&&!ae)return;
    const T=id?teamsOf(dept(id)):[],dir=A.filter(([a])=>!T.some(t=>t.id===tmA(a)));
    h+=`<div class="abt" data-abt="${id}"><div class="abth"><span>${esc(n)}</span><span class="cnt">${A.length}</span>${ae&&id?`<button class="ic" data-abtren="${id}" title="Abteilung umbenennen">✎</button><button class="ic" data-abtdel="${id}" title="Abteilung löschen">🗑</button>`:""}</div>
      ${dir.map(item).join("")||(T.length?"":`<div class="hint" style="padding:4px 6px">${ae?"Agenten hierher ziehen":""}</div>`)}
      ${T.map(t=>{const TA=A.filter(([a])=>tmA(a)===t.id);if(!TA.length&&!ae)return "";const ld=usr(t.lead);return `<div class="tmh" title="${ld?"Teamleitung: "+esc(ld.n):"Teamleitung offen"}">${av(ld,20)}<span>Team ${esc(t.n)}</span><span class="cnt">${TA.length}</span></div><div class="tmg" data-abt="${id}" data-team="${t.id}">${TA.map(item).join("")||`<div class="hint" style="padding:4px 6px">${ae?"Agenten hierher ziehen":""}</div>`}</div>`}).join("")}</div>`});
  if(ae)h+=`<button class="btn sm" id="abtnew" style="width:100%;margin-top:6px">+ Abteilung</button><div class="hint">Abteilungen von ${esc(LO.n)} – dieselben wie im Organigramm. Agenten per Ziehen zuordnen.</div>`;
  $("#alist").innerHTML=(L.length?"":`<p class="hint">Noch keine ${PN[AF]}-Agenten.</p>`)+h;
  const abe=$("#abtedit");if(abe)abe.onclick=()=>{if(startEdit("abt",null,null,[...DP.map(d=>"depts/"+d.id),...AG.map(a=>"agents/"+a.id)],false,["depts"]))render()};
  bindEd($("#abted"),()=>render());
  document.querySelectorAll("[data-lo]").forEach(b=>b.onclick=()=>{LOS=b.dataset.lo;alist()});
  document.querySelectorAll(".aitem").forEach(b=>b.onclick=e=>{if(e.target.closest("[data-ren],input"))return;if(+b.dataset.i!==cur&&EDIT&&!ae&&blocked())return;cur=+b.dataset.i;if($("#follow").checked)PF=AG[cur].p;render()});
  document.querySelectorAll("[data-ren]").forEach(b=>b.onclick=e=>{e.stopPropagation();const i=+b.dataset.ren;if(i!==cur&&blocked())return;cur=i;if(!isEd("agent",AG[i].id,"basis")&&!startEdit("agent",AG[i].id,"basis",["agents/"+AG[i].id]))return;EOPEN.add("basis");render();const n=$("#an");if(n){n.focus();n.select()}});
  document.querySelectorAll(".aitem").forEach(b=>{b.ondragstart=e=>{if(ae)e.dataTransfer.setData("ag",AG[+b.dataset.i].id)};
    b.ondragover=e=>{if(ae)return;e.preventDefault();b.classList.add("over")};b.ondragleave=()=>b.classList.remove("over");
    b.ondrop=e=>{if(ae)return;e.preventDefault();b.classList.remove("over");const a=AG[+b.dataset.i],id=e.dataTransfer.getData("t");if(!a||!id||!sk(id))return;
      if(!isEd("agent",a.id,"skills"))return toast("Zum Zuordnen erst bei „"+a.n+"“ die Skills bearbeiten (✎)");
      if(a.s.includes(id))return toast("„"+sk(id).n+"“ ist bei „"+a.n+"“ schon dabei");a.s.push(id);render();toast("Zu „"+a.n+"“ hinzugefügt – Speichern nicht vergessen")}});
  if(ae){document.querySelectorAll(".abt").forEach(g=>{g.ondragover=e=>{e.preventDefault();g.classList.add("over")};g.ondragleave=e=>{if(!g.contains(e.relatedTarget))g.classList.remove("over")};
      g.ondrop=e=>{e.preventDefault();g.classList.remove("over");const a=AG.find(x=>x.id===e.dataTransfer.getData("ag"));if(!a)return;moveAg(a,O,g.dataset.abt,"");render()}});
    document.querySelectorAll(".tmg").forEach(g=>{g.ondragover=e=>{e.preventDefault();e.stopPropagation();g.classList.add("over")};g.ondragleave=e=>{if(!g.contains(e.relatedTarget))g.classList.remove("over")};
      g.ondrop=e=>{e.preventDefault();e.stopPropagation();g.classList.remove("over");const a=AG.find(x=>x.id===e.dataTransfer.getData("ag"));if(!a)return;moveAg(a,O,g.dataset.abt,g.dataset.team);render()}});
    $("#abtnew").onclick=async()=>{const n=await askText("Name der neuen Abteilung","");if(!n)return;if(DD.some(d=>d.n.toLowerCase()===n.toLowerCase()))return toast("Diese Abteilung gibt es schon");DP.push({id:uid("ab"),n,org:O,ord:DD.length});render()};
    document.querySelectorAll("[data-abtren]").forEach(b=>b.onclick=async()=>{const d=DP.find(x=>x.id===b.dataset.abtren),n=await askText("Abteilung umbenennen",d.n);if(n){d.n=n;render()}});
    document.querySelectorAll("[data-abtdel]").forEach(b=>b.onclick=async()=>{const d=DP.find(x=>x.id===b.dataset.abtdel),k=AG.filter(a=>ab(a)===d.id);
      if(await askOk("Abteilung „"+d.n+"“ löschen?"+(k.length?" "+k.length+" Agent(en) werden danach „Ohne Abteilung“ geführt.":""))){k.forEach(a=>moveAg(a,O,"",""));DP.splice(DP.indexOf(d),1);render()}})}
}
function startRename(i){renaming=i;cur=i;render();const r=$("#rn");r.focus();r.select();
  const done=()=>{if(renaming<0)return;AG[renaming].n=r.value||AG[renaming].n;renaming=-1;render()};
  r.onkeydown=e=>{if(e.key==="Enter")done();if(e.key==="Escape"){renaming=-1;render()}};r.onblur=done}
function matrix(){
  const AV=agVis();
  let h=`<table><thead><tr><th>Skill</th>${AV.map(([a])=>`<th>${esc(a.n)}</th>`).join("")}</tr></thead><tbody>`;
  grMitSkills(SK.filter(vis0)).forEach(({g,S:items})=>{
    h+=`<tr><td class="gr" colspan="${AV.length+1}">${esc(g.n)}</td></tr>`;
    items.forEach(s=>{const u=use(s.id);h+=`<tr><td><span class="pb ${s.p}">${PN[s.p]}</span> ${esc(s.n)}${isNeu(s)?' <span class="badge neu">Neu</span>':''} <span class="badge ${u?'':'zero'}">${u}</span></td>${AV.map(([a,i])=>`<td class="${a.s.includes(s.id)?'x':'e'}" data-a="${i}" data-s="${s.id}">${a.s.includes(s.id)?'●':'·'}</td>`).join("")}</tr>`})});
  $("#mtx").innerHTML=h+"</tbody></table>";
  const me=isEd("matrix");$("#mtx").closest(".panel").classList.toggle("editing",me);
  $("#mxed").innerHTML=me?`<span class="hint" style="margin:0 8px 0 0;text-transform:none;letter-spacing:0;font-weight:400">Klick schaltet um</span>`+edBtns(1):`<button class="btn sm ebtn" id="mxedit">✎ Zuordnungen bearbeiten</button>`;
  const mb=$("#mxedit");if(mb)mb.onclick=()=>{if(startEdit("matrix",null,null,AG.map(a=>"agents/"+a.id)))render()};bindEd($("#mxed"),()=>render());
  document.querySelectorAll("#mtx td[data-a]").forEach(td=>td.onclick=()=>{if(!me)return toast("Zum Umschalten erst „✎ Zuordnungen bearbeiten“");const a=AG[+td.dataset.a],id=td.dataset.s;a.s=a.s.includes(id)?a.s.filter(x=>x!==id):[...a.s,id];render()});
}
function render(){lib();alist();if(renaming<0)editor();matrix();$("#mf").textContent="Skills: "+PN[PF]+(GEN&&PF!=="all"?" + Andere":"")+" · Agenten: "+PN[AF]}
$("#q").oninput=lib;
$("#newU").onclick=()=>{if(!blocked())wizard(null)};$("#ownOrgs").onclick=ownOrgsDlg;
$("#uold").onchange=e=>{UOLD=e.target.checked;users()};
$("#gen").onchange=e=>{GEN=e.target.checked;render()};

$("#colAll").onclick=()=>{[...GR,GR_OHNE].forEach(g=>COL.add(g.id));lib()};
$("#expAll").onclick=()=>{COL.clear();lib()};
$("#sknew").onclick=draftModal;$("#sksync").onclick=syncModal;
$("#newG").onclick=async()=>{if(!isEd("lib"))return toast("Neue Gruppe: erst „✎ Gruppen ordnen“");const n=await askText("Name der neuen Gruppe","");if(n&&grAnlegen(n)){render();schedule();toast("Gruppe angelegt – Skills per Ziehen hinein")}};
$("#newA").onclick=()=>{if(blocked())return;const a={id:uid("ag"),n:"Neuer Agent",p:AF,owner:null,dep:null,r:"",w:"",bsp:[],note:"",s:[],mcp:[],m:"Sonnet",own:[],gl:GLOBAL.map((g,i)=>i<4?1:0),ord:AG.length};AG.push(a);cur=AG.length-1;
  startEdit("agent",a.id,"basis",["agents/"+a.id],true);EOPEN.add("basis");render();const n=$("#an");if(n){n.focus();n.select()}};
