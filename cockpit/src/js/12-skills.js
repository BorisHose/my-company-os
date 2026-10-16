function lib(){
  if(!$("#lib"))return;const q=$("#q").value.toLowerCase().trim();let h="";
  GR.forEach((g,gi)=>{
    const all=SK.filter(s=>s.g===gi&&skVis(s)),items=all.filter(s=>skMatch(s,q));
    if(!all.length&&!isEd("lib"))return;
    if(q&&!items.length)return;
    const col=!q&&COL.has(gi);
    h+=`<div class="grp ${col?'col':''}" data-g="${gi}"><div class="ghead" data-tg="${gi}"><span class="caret">▾</span>${esc(g)} <span class="cnt">(${q?items.length+"/":""}${all.length})</span>${isEd("lib")?`<button class="ic" data-rg="${gi}" title="Gruppe umbenennen">✎</button>`:""}</div><div class="gbody">`;
    items.forEach(s=>{const u=use(s.id);
      h+=`<div class="skill p-${s.p} ${s.neu?'neu':''} ${SKSEL===s.id?'sel':''}" ${isEd("lib")?'draggable="true"':''} data-id="${s.id}"><div class="t"><b>${esc(s.n)}</b>${s.p==="multi"?`<span class="pb multi">Kern</span> <span class="pb bodo">Bodo</span> <span class="pb sellify">sellify${s.prof&&s.prof.sellify&&s.prof.sellify.neu?" · neu":""}</span>`:`<span class="pb ${s.p}">${PN[s.p]}</span>`} ${srcBadge(s)}${s.prov?` <span class="pvb ${s.prov.stat}" title="${s.prov.stat==="frei"?"Freigegeben – wird beim nächsten Abgleich zu Claude übertragen":"Im Cockpit geändert – noch nicht zur Übertragung an Claude freigegeben"}">⇅ ${s.prov.stat==="frei"?"freigegeben":"nicht bei Claude"}</span>`:""}<small>${esc(s.d)}</small>${ksLine(s)}</div>
      <div class="side"><button class="ic" data-edit="${s.id}" title="Skill bearbeiten">⚙</button><span class="badge ${s.std?'std':''} ${u?'':'zero'}" title="${u?'Wird von '+u+' Agent(en) genutzt':'Von keinem Agenten genutzt'}">in ${u} Ag.</span>${allLp(s)?`<span class="badge lp" title="${allLp(s)} Leitplanke(n)">⛨ ${allLp(s)}</span>`:''}</div></div>`});
    if(!items.length)h+=`<div class="hint" style="padding:6px 4px">leer – Skills hierher ziehen</div>`;
    h+=`</div></div>`});
  {const S=SET.sync,ne=SK.filter(s=>srcOf(s)==="entwurf").length;$("#syncline").innerHTML=(S&&S.at?`Letzter Abgleich mit ${esc(provName(S.prov||"claude"))}: <b>${esc(new Date(S.at).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"}))}</b>`:"Noch kein Abgleich mit dem Konto")+(ne?` · <b>${ne} Entwurf${ne>1?"e":""}</b> wartet auf Anlage`:"")+(provList().length?` · <b>${provList().length} Änderung${provList().length>1?"en":""}</b> für Claude`:"")}
  const le=isEd("lib");$("#libp").classList.toggle("editing",le);$("#newG").style.display=le?"":"none";$("#libed").innerHTML=le?edBtns(1):`<button class="btn sm ebtn" id="libedit" title="Gruppen anlegen, umbenennen und Skills per Ziehen umsortieren">✎ Gruppen ordnen</button>`;
  const lb=$("#libedit");if(lb)lb.onclick=()=>{if(startEdit("lib",null,null,["meta/config",...SK.map(s=>"skills/"+s.id)])){COL.clear();render();toast("Skills auf eine Gruppe ziehen = umsortieren")}};bindEd($("#libed"),()=>render());
  $("#lib").innerHTML=h||`<p class="hint">${AFIL==="ohne"?"Alle passenden Skills sind mindestens einem Agenten zugeordnet.":"Keine Skills für diesen Filter."}</p>`;seg();skDetail();
  document.querySelectorAll("[data-tg]").forEach(e=>e.onclick=ev=>{if(ev.target.closest("[data-rg]"))return;const g=+e.dataset.tg;COL.has(g)?COL.delete(g):COL.add(g);lib()});
  document.querySelectorAll("#lib .skill").forEach(e=>{
    e.ondragstart=ev=>ev.dataTransfer.setData("t",e.dataset.id);
    e.onclick=ev=>{if(ev.target.closest("[data-edit]"))return;SKSEL=e.dataset.id;document.querySelectorAll("#lib .skill.sel").forEach(x=>x.classList.remove("sel"));e.classList.add("sel");skDetail()}});
  document.querySelectorAll("#lib [data-edit]").forEach(b=>b.onclick=()=>skillModal(b.dataset.edit));
  document.querySelectorAll("[data-rg]").forEach(b=>b.onclick=async ev=>{ev.stopPropagation();if(!isEd("lib"))return toast("Gruppen umbenennen: erst „✎ Gruppen ordnen“");const n=await askText("Gruppe umbenennen",GR[+b.dataset.rg]);if(n){GR[+b.dataset.rg]=n;render();schedule()}});
  document.querySelectorAll(".grp").forEach(g=>{
    g.ondragover=e=>{if(!isEd("lib"))return;e.preventDefault();g.classList.add("over")};g.ondragleave=()=>g.classList.remove("over");
    g.ondrop=e=>{e.preventDefault();g.classList.remove("over");if(!isEd("lib"))return;const s=sk(e.dataTransfer.getData("t"));if(s){s.g=+g.dataset.g;COL.delete(s.g);render();toast("Verschoben nach „"+GR[s.g]+"“")}}});
}
function skDetail(){const P=$("#skdet");if(!P)return;const s=SKSEL&&sk(SKSEL);
  if(!s){P.innerHTML='<h2>Details</h2><p class="hint">Links einen Skill antippen – hier erscheinen Beschreibung, Leitplanken, Inhalt und die Agenten, die ihn nutzen.</p>';return}
  const A=AG.filter(a=>a.s.includes(s.id)),O=ORGS().filter(o=>skOrgOk(s,o)),lp=[...(s.lp||[])];
  P.innerHTML=`<h2 style="justify-content:space-between"><span>${esc(s.n)}</span><button class="btn sm" id="skdedit">⚙ Bearbeiten</button></h2>
   <div>${s.p==="multi"?'<span class="pb multi">Kern</span> <span class="pb bodo">Bodo</span> <span class="pb sellify">sellify</span>':`<span class="pb ${s.p}">${PN[s.p]}</span>`} ${srcBadge(s)}</div>
   <div class="kv"><b>Gruppe</b><span>${esc(grName(s.g))}</span><b>Im Konto</b><span>${esc(KS(s).join(", ")||"– noch nicht im Konto –")}</span><b>Gilt für</b><span>${O.map(o=>esc(o.kurz||o.n)).join(" · ")||"–"}</span><b>Verwendet von</b><span>${A.map(a=>`<span class="chip" data-goag="${a.id}" style="cursor:pointer">${esc(a.n)}</span>`).join(" ")||'<span class="hint" style="margin:0">keinem Agenten</span>'}</span>${s.seit?`<b>Seit</b><span>${esc(s.seit)}</span>`:""}</div>
   <div class="field"><label>Beschreibung – wann Claude den Skill benutzt</label><div>${esc(s.d||"–")}</div></div>
   ${lp.length?`<div class="field"><label>Leitplanken</label><ul style="margin:0;padding-left:18px">${lp.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
   ${s.p==="multi"&&s.prof?Object.entries(s.prof).map(([k,v])=>`<div class="field"><label>Profil ${esc(PN[k]||k)}${v.neu?" (neu)":""}</label><pre>${esc(v.txt||"–")}</pre></div>`).join(""):""}
   ${s.body?`<details><summary>Inhalt (SKILL.md)</summary><pre>${esc(s.body)}</pre></details>`:""}`;
  $("#skdedit").onclick=()=>skillModal(s.id);
  P.querySelectorAll("[data-goag]").forEach(c=>c.onclick=()=>goAgent(c.dataset.goag))}
function skPick(a){const OLD=new Set(a.s),SEL=new Set(a.s);let q="",only=true;
  const okA=s=>a.p==="all"||s.p===a.p||s.p==="all"||s.p==="multi";
  const close=modalBox(`<div class="bhead"><h3>Skills für „${esc(a.n)}“</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
   <input type="search" id="pkq" placeholder="🔍 Skill suchen (Name, Beschreibung, Gruppe, Konto-Name) …" autocomplete="off">
   <label class="cb" style="margin:8px 0 0"><input type="checkbox" id="pkonly" checked> Nur Skills, die zum Produkt des Agenten passen (${esc(PN[a.p])}${a.p==="all"?"":" + produktneutral"})</label>
   <div class="pkwrap"><table class="pkt" id="pkt"></table></div>
   <div class="btns" style="margin-top:12px;align-items:center"><span id="pkcnt" class="hint" style="margin:0;flex:1"></span><button class="btn" id="pkno">Abbrechen</button><button class="btn p" id="pkok">Übernehmen</button></div>`,true);
  const draw=()=>{const L=SK.filter(s=>(!only||okA(s)||SEL.has(s.id))&&skMatch(s,q));let h="";
    [...new Set(L.map(s=>s.g))].sort((x,y)=>(+x)-(+y)).forEach(g=>{const G=L.filter(s=>s.g===g),n=G.filter(s=>SEL.has(s.id)).length;
      h+=`<tr class="gh"><td style="width:28px"><input type="checkbox" data-pkg="${g}" ${n===G.length?"checked":""} title="Ganze Gruppe auswählen"></td><td colspan="2">${esc(grName(g))} <span class="hint" style="margin:0;font-weight:400">${n}/${G.length}</span></td></tr>`;
      G.forEach(s=>{const dim=["entwurf","vorschlag"].includes(srcOf(s));h+=`<tr class="${dim?"dim":""}"><td><input type="checkbox" data-pks="${esc(s.id)}" ${SEL.has(s.id)?"checked":""}></td><td><b style="color:var(--ink)">${esc(s.n)}</b>${dim?' <span class="hint" style="margin:0">(noch nicht im Konto)</span>':""}<small>${esc((s.d||"").split(/\s*Nutzen bei\s*:/i)[0].slice(0,160))}</small></td><td style="white-space:nowrap">${srcBadge(s)}</td></tr>`})});
    $("#pkt").innerHTML=h||'<tr><td class="hint">Kein Skill gefunden.</td></tr>';
    const add=[...SEL].filter(x=>!OLD.has(x)).length,rem=[...OLD].filter(x=>!SEL.has(x)).length;$("#pkcnt").textContent=SEL.size+" ausgewählt · "+add+" hinzu · "+rem+" entfernt";
    document.querySelectorAll("[data-pks]").forEach(c=>c.onchange=()=>{c.checked?SEL.add(c.dataset.pks):SEL.delete(c.dataset.pks);draw()});
    document.querySelectorAll("[data-pkg]").forEach(c=>c.onchange=()=>{L.filter(s=>String(s.g)===c.dataset.pkg).forEach(s=>c.checked?SEL.add(s.id):SEL.delete(s.id));draw()})};
  draw();const qi=$("#pkq");qi.focus();qi.oninput=()=>{q=qi.value.toLowerCase().trim();draw()};$("#pkonly").onchange=e=>{only=e.target.checked;draw()};
  $("#mclose").onclick=$("#pkno").onclick=close;
  $("#pkok").onclick=()=>{a.s=a.s.filter(x=>SEL.has(x)).concat([...SEL].filter(x=>!OLD.has(x)));close();render();const add=[...SEL].filter(x=>!OLD.has(x)).length,rem=[...OLD].filter(x=>!SEL.has(x)).length;toast((add||rem)?(add+" hinzugefügt · "+rem+" entfernt – Speichern nicht vergessen"):"Keine Änderung")}}

function seg(){
  const sv=s=>(!SKSRC||srcOf(s)===SKSRC);
  $("#seg").innerHTML=[["","Alle"]].concat(ORGS().map(o=>[o.id,o.kurz||o.n])).map(([k,l])=>`<button data-so="${k}" class="${SKORG===k?'on':''}">${esc(l)}<span class="n">${SK.filter(s=>skOrgOk(s,k)).length}</span></button>`).join("");
  document.querySelectorAll("#seg [data-so]").forEach(b=>b.onclick=()=>{SKORG=b.dataset.so;lib()});
  $("#srcf").innerHTML=SRCS.map(([k,l])=>`<button data-ss="${k}" class="${SKSRC===k?'on':''}">${l}<span class="n">${SK.filter(s=>skOrgOk(s,SKORG)&&(!k||srcOf(s)===k)).length}</span></button>`).join("");
  document.querySelectorAll("#srcf [data-ss]").forEach(b=>b.onclick=()=>{SKSRC=b.dataset.ss;lib()});
  $("#afil").innerHTML=[["all","Alle"],["used","In Agenten verwendet"],["ohne","Ohne Agent"]].map(([k,l])=>`<button data-af="${k}" class="${AFIL===k?'on':''}">${l}<span class="n">${SK.filter(s=>skOrgOk(s,SKORG)&&sv(s)&&(k==="all"||(k==="used"?use(s.id)>0:!use(s.id)))).length}</span></button>`).join("");
  document.querySelectorAll("#afil button").forEach(b=>b.onclick=()=>{AFIL=b.dataset.af;lib()});
  $("#aseg").innerHTML=PK.map(([p,l])=>`<button data-p="${p}" class="${AF===p?'on':''}" title="${esc(PT[p])}">${l}<span class="n">${AG.filter(a=>a.p===p).length}</span></button>`).join("");
  document.querySelectorAll("#aseg button").forEach(b=>b.onclick=()=>{if(AF!==b.dataset.p&&blocked())return;AF=b.dataset.p;const f=agVis()[0];cur=f?f[1]:-1;if($("#follow").checked)PF=AF;render()});
}
function draftModal(){
  if(blocked())return;const close=modalBox(`<div class="bhead"><h3>Neuer Skill – Entwurf</h3><button class="ic" id="mclose" title="Schließen" style="font-size:18px">✕</button></div>
   <div class="hint" style="margin:0 0 12px">Der Entwurf liegt zunächst nur im Cockpit. Beim nächsten <b>⟳ Abgleich</b> schlägt Claude ihn dir als echten Skill im Konto vor – erst nach deiner Freigabe wird er angelegt.</div>
   <div class="row"><div class="field"><label>Name</label><input type="text" id="dn" placeholder="z. B. sellify Angebot erstellen"></div>
   <div class="field"><label>Produkt</label><select id="dp">${["bodo","sellify","all"].map(p=>`<option value="${p}" ${PF===p?'selected':''}>${PN[p]}</option>`).join("")}</select></div></div>
   <div class="row"><div class="field"><label>Gruppe</label><select id="dg">${GR.map((g,i)=>`<option value="${i}">${esc(g)}</option>`).join("")}</select></div>
   <div class="field"><label>Anlegen bei</label><select id="dv">${PROV.map(([k,l,on])=>`<option value="${k}" ${on?'':'disabled'}>${l}${on?'':' (später)'}</option>`).join("")}</select></div></div>
   <div class="field"><label>Beschreibung – wann soll der Skill benutzt werden?</label><textarea id="dd" placeholder="z. B. Wenn für einen sellify-Interessenten ein Angebot erstellt werden soll …"></textarea></div>
   <div class="field"><label>Was soll der Skill tun? (Stichpunkte, Vorlagen, Quellen)</label><textarea id="di" style="min-height:110px" placeholder="Ablauf, benötigte Daten, Vorlagen, Zielsystem …"></textarea></div>
   <div class="field"><label>Leitplanken – eine pro Zeile</label><textarea id="dl" placeholder="z. B. Angebot nie ohne Freigabe versenden"></textarea></div>
   <div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" id="dno">Abbrechen</button><button class="btn p" id="dok">Entwurf speichern</button></div>`,true);
  $("#mclose").onclick=$("#dno").onclick=close;$("#dn").focus();
  $("#dok").onclick=()=>{const n=$("#dn").value.trim();if(!n)return toast("Bitte einen Namen eingeben");
    const slug=n.toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    let id=slug||uid("sk");while(sk(id))id=slug+"-"+Math.random().toString(36).slice(2,5);
    const s={id,n,d:$("#dd").value.trim(),p:$("#dp").value,g:+$("#dg").value,lp:$("#dl").value.split("\n").map(x=>x.trim()).filter(Boolean),src:"entwurf",ks:[],seit:new Date().toISOString().slice(0,10),entw:{prov:$("#dv").value,inh:$("#di").value.trim(),stat:"offen"}};
    SK.push(s);COL.delete(s.g);close();render();schedule();toast("Entwurf gespeichert – wird beim Abgleich vorgeschlagen")}}
function syncModal(){
  const S=SET.sync||{},pv=SET.prov||"claude",dr=SK.filter(s=>srcOf(s)==="entwurf");
  const close=modalBox(`<div class="bhead"><h3>⟳ Abgleich mit dem Konto</h3><button class="ic" id="mclose" title="Schließen" style="font-size:18px">✕</button></div>
   <div class="field"><label>Anbieter (Konnektor)</label><div class="provrow">${PROV.map(([k,l,on])=>`<button data-pv="${k}" class="${pv===k?'on':''}" ${on?'':'disabled title="Konnektor kommt später"'}>${l}${on?'':' · später'}</button>`).join("")}</div></div>
   <p style="margin:0 0 8px">Das Cockpit kann die Skills im ${esc(provName(pv))}-Konto nicht selbst lesen oder ändern. Den Abgleich macht deshalb ${esc(provName(pv))} in einer Sitzung – auf Zuruf oder per geplanter Aufgabe.</p>
   <div class="warnbox" style="margin:0 0 10px"><b>So geht's:</b> In Cowork sagen: <i>„Company OS abgleichen“</i>. Claude liest dann deine Skills und Plugins, zeigt die Unterschiede, legt deine Entwürfe als echte Skills an, überträgt die hier <b>freigegebenen</b> Änderungen – jeweils erst nach deiner Freigabekarte – und trägt das Ergebnis hier ein. Nicht freigegebene Änderungen bleiben nur im Cockpit.</div>
   <div class="hint"><b>Letzter Abgleich:</b> ${S.at?esc(new Date(S.at).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"}))+(S.note?" – "+esc(S.note):""):"noch keiner"}</div>
   ${S.changes&&S.changes.length?`<ul class="synclist">${S.changes.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>`:""}
   <div class="hint" style="margin-top:10px"><b>Wartende Entwürfe (${dr.length}):</b> ${dr.length?dr.map(s=>esc(s.n)).join(", "):"keine"}</div>
   <div class="hint" style="margin-top:10px"><b>Änderungen für Claude (${provList().length}):</b>${provList().length?"":" keine"}</div>
   ${provList().map(([c,o],i)=>`<div class="provit" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span style="flex:1;min-width:180px"><b>${c==="agents"?"Agent":"Skill"} „${esc(o.n)}“</b> <span class="hint" style="margin:0">${Object.keys(o.prov.alt).map(f=>esc(PFLD[c][f]||f)).join(", ")}</span></span><span class="pvb ${o.prov.stat}">${o.prov.stat==="frei"?"freigegeben":"nicht freigegeben"}</span><button class="btn sm" data-pvshow="${i}">${o.prov.stat==="frei"?"Ansehen":"Prüfen & freigeben"}</button><button class="btn sm d" data-pvback="${i}" title="Cockpit auf den Stand bei Claude zurücksetzen">Zurücknehmen …</button></div>`).join("")}
   <div class="btns" style="justify-content:flex-end;margin-top:14px"><button class="btn" id="sclose">Schließen</button><button class="btn p" id="scopy">Auftrag kopieren</button></div>`);
  $("#mclose").onclick=$("#sclose").onclick=close;
  document.querySelectorAll("[data-pv]").forEach(b=>b.onclick=()=>{SET.prov=b.dataset.pv;schedule();syncModal()});
  $("#scopy").onclick=()=>copyText("Company OS abgleichen","Auftrag kopiert – in Cowork einfügen");
  const PL2=provList();document.querySelectorAll("[data-pvshow]").forEach(b=>b.onclick=()=>{close();provConfirm([PL2[+b.dataset.pvshow]])});
  document.querySelectorAll("[data-pvback]").forEach(b=>b.onclick=async()=>{const [c,o]=PL2[+b.dataset.pvback];if(!await askOk("Änderungen an „"+o.n+"“ zurücknehmen? Das Cockpit erhält wieder den Stand von Claude ("+Object.keys(o.prov.alt).map(f=>PFLD[c][f]||f).join(", ")+").","Ja, zurücknehmen"))return;
    Object.entries(o.prov.alt).forEach(([f,v])=>{if(v===null)delete o[f];else o[f]=v});delete o.prov;render();schedule();syncModal();toast("Zurückgenommen")})}
function skillModal(id){
  const s=sk(id);if(s.p==="multi")return multiModal(s);const OLD=JSON.parse(JSON.stringify(s));
  $("#modal").innerHTML=`<div class="modal"><div class="box" id="box">
   <div class="bhead"><h3>Skill bearbeiten</h3><button class="ic" id="mmax" title="Dialog vergrößern" style="font-size:18px">⤢</button><button class="ic" id="mclose" title="Schließen" style="font-size:18px">✕</button></div>
   <div class="hint" style="margin:0 0 12px"><code>${s.id}</code> · ${srcBadge(s)}${s.neu?' · <b>Neu – existiert noch nicht</b>':''}${s.std?' · Standard-Skill von Anthropic – Inhalt nicht änderbar':''}</div>
   <div class="row"><div class="field"><label>Anzeigename im Cockpit <span class="mark">Vorschlag Claude</span></label><input type="text" id="sn" value="${esc(s.n)}"></div>
   <div class="field"><label>Produkt</label><select id="sp">${["bodo","sellify","all"].map(p=>`<option value="${p}" ${s.p===p?'selected':''}>${PN[p]}</option>`).join("")}</select></div></div>
   <div class="row"><div class="field"><label>Gruppe</label><select id="sg">${GR.map((g,i)=>`<option value="${i}" ${i===s.g?'selected':''}>${esc(g)}</option>`).join("")}<option value="new">+ Neue Gruppe …</option></select></div>
   <div class="field"><label>Echter Skill im Konto bzw. Plugin</label><input type="text" id="sks" value="${esc(KS(s).join(", "))}" ${s.std?'disabled':''}><div class="hint">Mehrere mit Komma trennen. Plugin-Skills als <code>plugin:skill</code>.</div></div></div>
   <div class="field"><label>Beschreibung – wann Claude den Skill benutzt</label><textarea id="sd" ${s.std?'disabled':''}>${esc(s.d)}</textarea>
     <div class="warnbox">Diese Beschreibung steuert, wann Claude den Skill automatisch auswählt. Der Anzeigename oben ist dagegen nur Kosmetik.</div></div>
   <div class="field"><label>Leitplanken dieses Skills – eine pro Zeile </label><textarea id="slp" ${s.std?'disabled':''} placeholder="z. B. Vor Anlage auf Dubletten prüfen">${esc(s.lp.join("\n"))}</textarea>
     <div class="hint">Gelten immer, wenn der Skill läuft – und werden in jedem Agenten mit diesem Skill angezeigt.</div></div>
   <details ${s.std?'':'open'}><summary>Inhalt (SKILL.md)</summary><textarea id="sb" style="min-height:160px;font-family:ui-monospace,monospace;font-size:12px" ${s.std?'disabled':''}>${esc(s.body)}</textarea></details>
   ${s.std?"":'<div class="infobox" style="margin-top:12px">Änderungen speichert das Cockpit. Dein Skill im Konto bleibt unverändert – zum Übernehmen Claude bitten.</div>'}
   <div class="btns" style="margin-top:14px;justify-content:flex-end">${s.std?'':'<button class="btn" id="split" style="margin-right:auto">In Kern + Profile aufteilen</button>'}<button class="btn" id="mx">Abbrechen</button><button class="btn p" id="ms">Speichern</button></div>
  </div></div>`;
  const close=()=>$("#modal").innerHTML="";
  const sp=$("#split");if(sp)sp.onclick=()=>{const o=s.p;s.p="multi";s.prof={bodo:{txt:o==="bodo"?"(bisherige Bodo-Besonderheiten hierher verschieben)":"",lp:[]},sellify:{txt:o==="sellify"?"(bisherige sellify-Besonderheiten hierher verschieben)":"",lp:[],neu:o!=="sellify"?1:0}};render();multiModal(s);toast("Aufgeteilt in Kern + Bodo + sellify")};
  $("#mmax").onclick=()=>{const b=$("#box");b.classList.toggle("max");$("#mmax").textContent=b.classList.contains("max")?"⤡":"⤢";$("#mmax").title=b.classList.contains("max")?"Dialog verkleinern":"Dialog vergrößern"};
  $("#mclose").onclick=close;$("#mx").onclick=close;
  $("#sg").onchange=async e=>{if(e.target.value==="new"){const n=await askText("Name der neuen Gruppe","");if(n){GR.push(n);e.target.add(new Option(n,GR.length-1,true,true),e.target.options.length-1)}else e.target.value=s.g}};
  $("#ms").onclick=()=>{s.n=$("#sn").value;s.g=+$("#sg").value;s.p=$("#sp").value;if(!s.std){s.ks=$("#sks").value.split(",").map(x=>x.trim()).filter(Boolean);s.d=$("#sd").value;s.body=$("#sb").value;s.lp=$("#slp").value.split("\n").map(x=>x.trim()).filter(Boolean)}close();const ch=markProv("skills",s,OLD);render();schedule();toast("Gespeichert");if(ch)setTimeout(()=>provConfirm([["skills",s]]),60)};
}

function multiModal(s){const OLD=JSON.parse(JSON.stringify(s));
  const W=JSON.parse(JSON.stringify({n:s.n,g:s.g,d:s.d,lp:s.lp,body:s.body,prof:s.prof}));let tab="core";
  const ta=(id,v,ph,mono)=>`<textarea id="${id}" ${ph?`placeholder="${ph}"`:''} style="${mono?'min-height:150px;font-family:ui-monospace,monospace;font-size:12px':''}">${esc(v)}</textarea>`;
  const pane=()=>{
    if(tab==="core")return `<div class="infobox">✎ Änderungen hier wirken auf <b>Bodo und sellify</b>.</div>
      <pre class="tree">${s.id}/\n├─ SKILL.md     ← Kern (gemeinsam)\n├─ bodo.md      ← nur Bodo\n└─ sellify.md   ← nur sellify</pre>
      <div class="field"><label>Beschreibung – wann Claude den Skill benutzt</label>${ta("md_d",W.d)}<div class="warnbox">Steuert, wann Claude den Skill auswählt – gilt für beide Produkte.</div></div>
      <div class="field"><label>Gemeinsame Leitplanken – eine pro Zeile</label>${ta("md_lp",W.lp.join("\n"))}</div>
      <details open><summary>SKILL.md (Kern)</summary>${ta("md_b",W.body,"",1)}</details>`;
    if(tab==="orig")return Object.entries(s.orig).map(([k,v])=>`<div class="field"><label>${esc(k)} – SKILL.md im Konto (nur lesen)</label><textarea readonly style="min-height:260px;font-family:ui-monospace,monospace;font-size:12px">${esc(v)}</textarea></div>`).join("");
    if(tab==="cmp"){const col=k=>`<div class="cmpcol p-${k}"><h4>${PN[k]}${W.prof[k].neu?' <span class="badge neu">neu</span>':''}</h4><div class="hint" style="margin:0 0 6px">${k}.md${W.prof[k].from?" · bisher: "+W.prof[k].from:""}</div>
        <div class="cmptxt">${esc(W.prof[k].txt||"–").replace(/\n/g,"<br>")}</div>${W.prof[k].lp.length?`<div class="hint" style="margin-top:8px"><b>Nur hier:</b> ${W.prof[k].lp.map(esc).join(" · ")}</div>`:""}</div>`;
      return `<div class="cmpcore"><b>Gemeinsam (Kern):</b> ${esc(W.d)}${W.lp.length?`<br><span class="hint">Leitplanken: ${W.lp.map(esc).join(" · ")}</span>`:""}</div><div class="cmp">${col("bodo")}${col("sellify")}</div>`}
    const P=W.prof[tab];
    return `<div class="infobox p-${tab}">Nur was bei <b>${PN[tab]}</b> anders ist – Datei <code>${tab}.md</code>${P.from?` · zusammengeführt aus <code>${P.from}</code>`:""}${P.neu?' · <span class="badge neu">neu – existiert noch nicht</span>':""}</div>
      <div class="field"><label>Abweichungen für ${PN[tab]}</label>${ta("md_pt",P.txt,"z. B. Stil, Preise, Zielsystem, Texte",1)}</div>
      <div class="field"><label>Leitplanken nur für ${PN[tab]} – eine pro Zeile</label>${ta("md_plp",P.lp.join("\n"))}</div>
      <div class="hint">Tipp: Was sich nur in Kleinigkeiten unterscheidet, besser in den Kern mit einem Hinweis – je kleiner die Profile, desto weniger läuft auseinander.</div>`;
  };
  const grab=()=>{const g=id=>document.getElementById(id);
    if(tab==="core"){W.d=g("md_d").value;W.lp=g("md_lp").value.split("\n").map(x=>x.trim()).filter(Boolean);W.body=g("md_b").value}
    else if(tab!=="cmp"&&tab!=="orig"){W.prof[tab].txt=g("md_pt").value;W.prof[tab].lp=g("md_plp").value.split("\n").map(x=>x.trim()).filter(Boolean)}};
  $("#modal").innerHTML=`<div class="modal"><div class="box" id="box">
   <div class="bhead"><h3>Skill bearbeiten</h3><button class="ic" id="mmax" title="Dialog vergrößern" style="font-size:18px">⤢</button><button class="ic" id="mclose" title="Schließen" style="font-size:18px">✕</button></div>
   <div class="hint" style="margin:0 0 12px"><code>${s.id}</code> · ${srcBadge(s)} · ein Skill mit gemeinsamem Kern und Produkt-Profilen · im Konto: ${KS(s).map(x=>`<code>${esc(x)}</code>`).join(" + ")||"noch keiner"}</div>
   <div class="row"><div class="field"><label>Anzeigename im Cockpit</label><input type="text" id="sn" value="${esc(W.n)}"></div>
    <div class="field"><label>Gruppe</label><select id="sg">${GR.map((g,i)=>`<option value="${i}" ${i===W.g?'selected':''}>${esc(g)}</option>`).join("")}</select></div></div>
   <div class="tabs" id="mtabs">${[["core","Gemeinsam (Kern)"],["bodo","Bodo-Profil"],["sellify","sellify-Profil"],["cmp","Vergleich"]].concat(s.orig?[["orig","Original-Skills"]]:[]).map(([k,l])=>`<button data-tab="${k}" class="${k}">${l}</button>`).join("")}</div>
   <div id="mpane"></div>
   <div class="infobox" style="margin-top:12px">Vorschlag: Kern und Profile sind aus deinen echten Skills abgeleitet. Im Konto bleiben die Skills unverändert, bis du den Umbau freigibst.</div>
   <div class="btns" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="mx">Abbrechen</button><button class="btn p" id="ms">Speichern</button></div></div></div>`;
  const show=()=>{$("#mpane").innerHTML=pane();document.querySelectorAll("#mtabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab))};
  document.querySelectorAll("#mtabs button").forEach(b=>b.onclick=()=>{grab();tab=b.dataset.tab;show()});show();
  const close=()=>$("#modal").innerHTML="";$("#mclose").onclick=close;$("#mx").onclick=close;
  $("#mmax").onclick=()=>{const b=$("#box");b.classList.toggle("max");$("#mmax").textContent=b.classList.contains("max")?"⤡":"⤢"};
  $("#ms").onclick=()=>{grab();Object.assign(s,{n:$("#sn").value,g:+$("#sg").value,d:W.d,lp:W.lp,body:W.body,prof:W.prof});close();const ch=markProv("skills",s,OLD);render();schedule();if(ch)setTimeout(()=>provConfirm([["skills",s]]),60);toast(tab==="core"?"Gespeichert – gilt für Bodo und sellify":"Gespeichert")};
}
