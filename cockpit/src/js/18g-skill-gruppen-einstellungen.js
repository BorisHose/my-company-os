// ===== Einstellungen › Skill-Gruppen: anlegen, umbenennen, ordnen, entfernen =====
// Änderungen nur über ✎ Bearbeiten → Speichern (wie überall). Entfernen einer Gruppe mit Skills schiebt diese nach „Ohne Gruppe“.
function grEinst(C){const ed=isEd("grp"),n=id=>SK.filter(s=>s.g===id).length,ohne=SK.filter(s=>!grById(s.g)).length;
  C.innerHTML=`<div class="etop"><h2 style="margin:0;flex:1">Skill-Gruppen</h2><span id="grped">${edBtns(ed)}</span></div>
    <div class="hint" style="margin:6px 0 12px">Die Reihenfolge gilt für den Skill-Katalog und die Skill-Auswahl der Agenten. Skills ordnest du unter „Skills“ über „✎ Gruppen ordnen“ (ziehen) oder ⚙ am Skill einer Gruppe zu.</div>
    <table class="grt"><thead><tr><th>Gruppe</th><th>Skills</th>${ed?"<th></th>":""}</tr></thead><tbody>
    ${GR.map((g,i)=>`<tr><td>${ed?`<input type="text" data-grn="${esc(g.id)}" value="${esc(g.n)}" aria-label="Name der Gruppe">`:esc(g.n)}</td><td>${n(g.id)}</td>${ed?`<td class="grk"><button class="ic" data-gru="${i}" ${i?"":"disabled"} title="nach oben">↑</button><button class="ic" data-grd="${i}" ${i<GR.length-1?"":"disabled"} title="nach unten">↓</button><button class="ic" data-grx="${esc(g.id)}" title="Gruppe entfernen">🗑</button></td>`:""}</tr>`).join("")}
    ${ohne?`<tr class="dim"><td>${esc(GR_OHNE.n)}</td><td>${ohne}</td>${ed?"<td></td>":""}</tr>`:""}</tbody></table>
    ${ed?'<button class="btn sm" id="grneu" style="margin-top:10px">+ Gruppe</button>':""}`;
  bindEd($("#grped"),()=>einst());
  const b=$("#grped [data-eopen], #grped .ebtn");if(b)b.onclick=()=>{if(startEdit("grp",null,null,["meta/config",...SK.map(s=>"skills/"+s.id)]))einst()};
  if(!ed)return;
  C.querySelectorAll("[data-grn]").forEach(i=>i.onchange=()=>{const g=grById(i.dataset.grn),v=i.value.trim();if(!v){i.value=g.n;return toast("Name darf nicht leer sein")}
    if(GR.some(x=>x!==g&&x.n.toLowerCase()===v.toLowerCase())){i.value=g.n;return toast("Diese Gruppe gibt es schon")}g.n=v});
  const tausch=(i,j)=>{const t=GR[i];GR[i]=GR[j];GR[j]=t;einst()};
  C.querySelectorAll("[data-gru]").forEach(x=>x.onclick=()=>tausch(+x.dataset.gru,+x.dataset.gru-1));
  C.querySelectorAll("[data-grd]").forEach(x=>x.onclick=()=>tausch(+x.dataset.grd,+x.dataset.grd+1));
  C.querySelectorAll("[data-grx]").forEach(x=>x.onclick=async()=>{const g=grById(x.dataset.grx),k=n(g.id);
    if(!await askOk("Gruppe „"+g.n+"“ entfernen?"+(k?" "+k+" Skill"+(k===1?"":"s")+" stehen danach unter „Ohne Gruppe“.":""),"Entfernen"))return;
    SK.forEach(s=>{if(s.g===g.id)s.g=""});GR.splice(GR.indexOf(g),1);COL.delete(g.id);einst()});
  $("#grneu").onclick=async()=>{const v=await askText("Name der neuen Gruppe","");if(v&&grAnlegen(v))einst()}}
