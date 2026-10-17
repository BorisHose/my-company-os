// ===== Auftrag öffnen (v77): ein Fenster für alle Zustände – ersetzt „Ergebnis“ (resultModal) und „Details“ (jobModal) =====
// Links: was zu tun ist (Freigabe/Rückfrage/Plan, Claude arbeitet, nächster Schritt, Eingang), Rückmeldung, Ergebnisse, Teilaufträge, Auftragstext.
// Rechts: Fortschritt als Schrittliste (Ablaufbild aufklappbar), Sitzungen, Verlauf, Datenspur, Verbrauch.
function jvSchritte(j){const f=j.f;if(!f||!Array.isArray(f.N))return [];const st=f.N.find(n=>n.type==="start");if(!st)return [];
  const seen=new Set(),order=[];(function walk(id){if(seen.has(id))return;seen.add(id);const n=nodeOf(f,id);if(!n)return;order.push(n);f.E.filter(e=>e.f===id&&!e.back).forEach(e=>walk(e.t))})(st.id);
  const P=new Set(j.path||[]),cur=(j.path||[])[(j.path||[]).length-1],end=isEnd(j);
  return order.filter(n=>n.type!=="start"&&n.type!=="end").map(n=>{const s=n.id===cur&&!end?(j.st==="wait"?"wait":"now"):(P.has(n.id)||end&&j.st==="done"&&j.ok!=="nein")?"done":"todo";
    const titel=n.type==="task"?(f.frei?"Auftrag erledigen":(n.t||"Schritt")):n.type==="human"?(/^\s*(👤\s*)?freigabe/i.test(n.label||"")?n.label.replace(/^\s*👤\s*/,""):"Freigabe: "+(n.label||"")):(n.label||NS[n.type]&&NS[n.type].l||"Entscheidung");
    const wer=n.type==="task"?((n.a&&n.a.n)||(f.frei?(jobWho(j)||{}).n:"Claude direkt")):n.type==="human"?ICH():"";return {s,titel,wer}})}
function jobView(j,opt){opt=opt||{};KINEW.delete(j.id);const f=j.f,c=f&&j.path&&j.path.length?curN(j):null,[cls,lab]=okTxt(j),E=j.erg||[],W=j.st==="wait"&&j.q,Q=j.q||{},PLAN=istPlan(j),man=!j.ki,end=isEnd(j),O=orgById(jobOrg(j));
  const humanOpts=W&&man&&c&&c.type==="human"?f.E.filter(e=>e.f===c.id).map(e=>e.l||"weiter"):[];
  const kiOpts=W&&!man?(Q.opts||[]).filter(o=>!/^abbrechen/i.test(String(o).trim())):[];
  const res=L=>L.map(e=>`<div class="dx-res"><span style="font-size:18px">${e.url?"🔗":"📄"}</span><div class="t"><b>${esc(e.t||"Ergebnis")}</b>${e.art?` <span class="hint" style="margin:0">${esc(e.art)}</span>`:""}${e.url?`<small>${esc(e.url)}</small>`:""}</div>${e.url?`<a class="btn sm p" href="${esc(e.url)}" target="_blank" rel="noopener">Öffnen ↗</a>`:""}${e.vorschau?`<div class="v">${esc(e.vorschau)}</div>`:""}</div>`).join("");
  const nt=f&&f.nt&&W?CH.filter((x,ci)=>(f.nt.ev[Q.kind==="Freigabe"?"hold":"ask"]||[])[ci]).join(" · "):"";
  let todo="";
  if(W&&PLAN)todo=`<div class="dx-card y"><h4>✦ Plan zur Freigabe</h4>${planHtml(j)}<div class="dx-ans"><button class="btn p" id="plgo">▶ Plan freigeben &amp; starten</button><textarea id="rchgt" placeholder="Was soll der Teamleiter anders planen? z. B. ohne Video, anderer Agent für Schritt 2 …"></textarea><button class="btn" id="rchgok">Änderung senden</button></div></div>`;
  else if(W)todo=`<div class="dx-card y"><h4>${esc(Q.kind||"Rückfrage")} · ${esc(Q.from||"Claude")}${man&&c&&c.type==="human"?": "+esc(c.label||""):""}${nt?`<span class="hint">benachrichtigt über ${esc(nt)}</span>`:""}</h4><div style="white-space:pre-wrap;font-size:14px;line-height:1.55">${esc(Q.text||"")}</div>${Q.why?`<div class="hint">${esc(Q.why)}</div>`:""}${E.length?res(E):""}
    <div class="dx-ans">${man?humanOpts.map((o,i)=>`<button class="btn ${i?"":"p"}" data-ans="${esc(o)}">${esc(o)}</button>`).join(""):kiOpts.map((o,i)=>`<button class="btn ${i?"":"p"}" data-rans="${esc(o)}">${i?"":"✓ "}${esc(o)}</button>`).join("")}</div>
    <div class="dx-ans">${man?`<input type="text" id="free" placeholder="… oder eigene Antwort schreiben und Enter">`:`<textarea id="rchgt" placeholder="Änderung wünschen … z. B. anderer Mandant, anderer Titel, Fälligkeit"></textarea><button class="btn" id="rchgok">Änderung senden</button>`}</div></div>`;
  else if(!man&&j.st==="run")todo=`<div class="dx-card b"><h4>Claude arbeitet<span class="hint">aktualisiert sich alle 30 Sekunden</span></h4><div class="dx-ans" style="margin:0"><button class="btn" id="kirl2">⟳ Stand laden</button><button class="btn" id="kire">▶ Erneut anstoßen</button></div></div>`;
  else if(j.st==="inbox")todo=`<div class="dx-card v"><h4>📥 Im Eingang${j.prio&&j.prio!=="n"?prioB(j):""}${j.due?`<span class="hint">fällig ${esc(new Date(j.due+"T12:00").toLocaleDateString("de-DE"))}</span>`:""}</h4><div class="hint" style="margin:0 0 8px">${(j.nach||[]).length?"wartet auf "+esc(j.nach.join(", ")):"Noch nicht gestartet."}</div><button class="btn p" id="jvgo">▶ Jetzt starten</button></div>`;
  if(man&&j.st==="run"&&c)todo+=`<div class="dx-card"><h4>Nächster Schritt<span class="hint">aktuell: ${esc(nlabel(c))}</span></h4><div class="dx-ans" style="margin:0">${f.E.map((e,i)=>[e,i]).filter(([e])=>e.f===c.id).map(([e,i])=>`<button class="btn ${e.back?'':'p'}" data-adv="${i}">${c.type==="dec"?"Entscheidung: "+esc(e.l||"weiter")+" → ":"✓ erledigt → "}${esc(nlabel(nodeOf(f,e.t)))}</button>`).join("")||'<span class="hint">Kein weiterer Schritt verbunden.</span>'}</div><div class="dx-ans"><button class="btn" id="addQ">Rückfrage erfassen</button><button class="btn" id="addN">Notiz zum Verlauf</button></div></div>`;
  if(man&&!end)todo+=`<div class="dx-ans" style="margin:0 0 14px"><button class="btn" id="kigo" title="Diesen Auftrag ab dem aktuellen Schritt von Claude ausführen lassen">▶ Von Claude ausführen lassen</button></div>`;
  const sumCls=j.st==="done"?(j.ok==="nein"?"y":j.ok==="teilweise"?"y":"g"):j.st==="cancel"?"":"b";
  const S=jvSchritte(j),LOG=(j.log||[]),LK=opt.log?LOG:LOG.slice(-6);
  const menu=`<details class="dx-dd" id="jvmenu"><summary class="btn sm" title="Weitere Aktionen">⋯</summary><div class="dx-pop">${typeof vlAusAuftrag==="function"&&!j.parent?'<button id="jvvl">📋 Als Vorlage speichern …</button>':""}${S.length?'<button id="jvgr">Ablaufbild anzeigen</button>':""}${!end?'<hr><button class="del" id="stop">Auftrag löschen …</button>':""}</div></details>`;
  const html=`<div class="modal"><div class="box dx" id="box"><div class="dx-head"><h3>${esc(j.t)} <span class="okb ${cls}">${lab}</span><span class="dx-sub">${esc(j.id)} · ${esc(jobLbl(j))}${O?" · "+esc(O.kurz||O.n):""}${f&&!f.frei&&PN[f.p]?" · "+esc(PN[f.p]):""}${LOG.length?" · zuletzt "+esc(LOG[LOG.length-1][0]):""}${teilTxt(j)?" · "+esc(teilTxt(j)):""}</span></h3>
     <div class="dx-ctx">${pjJobField(j)}${menu}</div><button class="dx-x" id="mclose" title="Schließen">✕</button></div>
    <div class="dx-body"><div class="dx-main">${todo}
      ${j.sum?`<div class="dx-card ${sumCls}"><h4>Rückmeldung von Claude</h4><div style="font-size:14px;line-height:1.5">${esc(j.sum)}</div></div>`:""}
      ${E.length&&!W?`<div class="dx-h">Ergebnisse (${E.length})</div>${res(E)}`:""}
      ${teileHtml(j)?`<div style="margin-top:14px">${teileHtml(j)}</div>`:""}
      <div class="dx-h" style="margin-top:16px">${esc(f&&!f.frei&&f.start?f.start:"Auftrag")}</div>${j.in?`<div class="dx-md">${mdHtml(j.in)}</div>`:'<div class="hint" style="margin:0">Kein Auftragstext.</div>'}${anhHtml(j)}
    </div><div class="dx-side">
      ${S.length?`<div class="dx-h">Fortschritt</div><ul class="dx-steps">${S.map((s,i)=>`<li class="${s.s}"><span class="d">${s.s==="done"?"✓":s.s==="wait"?"!":i+1}</span><div><b>${esc(s.titel)}</b>${s.wer||s.s==="wait"?`<small>${esc(s.wer||"")}${s.s==="wait"?" · wartet auf dich":s.s==="now"?" · läuft":""}</small>`:""}</div></li>`).join("")}</ul><details id="jvgraph"${opt.graph?" open":""}><summary class="dx-lnk">Ablaufbild ${opt.graph?"":"anzeigen"}</summary><div class="cv-wrap ro" id="jcv" style="margin-top:8px"></div></details>`:""}
      ${(j.sess||[]).length?`<div class="dx-h">Claude-Sitzungen</div><div class="sessl">${j.sess.map((s,i)=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">🔗 Sitzung ${i+1} – ${s.art==="fortsetzen"?"Fortsetzung":s.art==="ohne Rückmeldung"?"⚠ ohne Rückmeldung":s.art==="abgelegt"?"abgelegt":"Start"}${s.at?" · "+esc(new Date(s.at).toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"})):""}</a>`).join("")}</div>`:j.ki&&!end?`<div class="dx-h">Claude-Sitzungen</div><div class="hint" style="margin:0">Noch keine – Claude trägt die Sitzung beim Start ein (dauert 1–2 Minuten).</div>`:""}
      <div class="dx-h">Verlauf</div><div class="dx-log">${LK.map(l=>`<time>${esc(l[0])}</time><span class="${l[2]?"me":""}">${esc(l[1])}</span>`).join("")}</div>${LOG.length>LK.length?`<button class="dx-lnk" id="jvlog" style="margin-top:6px">alle ${LOG.length} Einträge</button>`:""}
      ${spurHtml(j)}${vbJobHtml(j)}
    </div></div>
    <div class="dx-foot"><span class="dx-sum">${nt&&!W?"Benachrichtigung über "+esc(nt):""}</span>${!man&&!end?'<button class="btn d" id="rcan">Auftrag abbrechen</button>':""}<button class="btn p" id="rclose">Schließen</button></div></div></div>`;
  $("#modal").innerHTML=html;anhBind(j);
  const close=()=>{$("#modal").innerHTML="";if(opt.zurueck)opt.zurueck();else if(!$("#projects").classList.contains("hide"))prj();else jobs()};
  const zu=()=>{$("#modal").innerHTML=""};const neu=o=>{zu();jobView(j,o)};
  $("#mclose").onclick=$("#rclose").onclick=close;
  {const rp=$("#rprj");if(rp)rp.onchange=e=>pjSetJob(j,e.target.value)}
  document.querySelectorAll("[data-plk]").forEach(e=>e.onclick=()=>{const k=AU.find(x=>x.id===e.dataset.plk);if(k){zu();(k.ki?kiFresh(k):Promise.resolve()).then(()=>jobView(k))}});
  const gr=$("#jvgraph"),draw=()=>{const w=$("#jcv");if(!w||w.dataset.gez)return;w.dataset.gez=1;const P=new Set(j.path||[]),pairs=new Set((j.path||[]).slice(1).map((id,i)=>j.path[i]+">"+id));
    const jo={ro:true,taken:e=>pairs.has(e.f+">"+e.t),state:n=>c&&n.id===c.id&&!end?(j.st==="wait"?"cur wait":"cur"):P.has(n.id)||end?"done":"todo"};drawGraph(w,f,jo);drawGraph(w,f,{...jo,z:fitZ(w,+w.dataset.w,+w.dataset.h,400)})};
  if(gr){gr.ontoggle=()=>{if(gr.open)draw()};if(gr.open)setTimeout(draw,0)}
  {const b=$("#jvgr");if(b)b.onclick=()=>{$("#jvmenu").open=false;if(gr){gr.open=true;gr.scrollIntoView({block:"nearest"})}}}
  {const b=$("#jvlog");if(b)b.onclick=()=>neu({...opt,log:1})}
  {const b=$("#jvvl");if(b)b.onclick=()=>{zu();vlAusAuftrag(j)}}
  if(W&&PLAN)planBind(j,zu);
  // Antworten
  const answer=async a=>{if(j.ki){zu();kiAnswer(j,a);return}
    j.log.push([now(),""+ICH()+": "+a,1]);j.st="run";
    if(c&&c.type==="human"){const e=f.E.find(e=>e.f===c.id&&(e.l||"weiter")===a);if(e){const t=nodeOf(f,e.t);j.path.push(t.id);j.log.push([now(),(e.back?"↩ zurück zu ":"weiter: ")+nlabel(t)]);if(t.type==="end"){j.st="done";markDone(j)}}}
    else if(c)j.log.push([now(),nlabel(c)+" – macht weiter"]);
    delete j.q;zu();jobs();jobView(j);schedule();toast("Antwort übermittelt")};
  document.querySelectorAll("[data-rans]").forEach(b=>b.onclick=()=>{zu();kiAnswer(j,b.dataset.rans)});
  document.querySelectorAll("[data-ans]").forEach(b=>b.onclick=()=>answer(b.dataset.ans));
  {const fr=$("#free");if(fr)fr.onkeydown=e=>{if(e.key==="Enter"&&fr.value.trim())answer(fr.value.trim())}}
  {const ok=$("#rchgok");if(ok)ok.onclick=()=>{const t=$("#rchgt").value.trim();if(!t)return toast("Bitte die Änderung beschreiben");zu();kiAnswer(j,(PLAN?"Plan ändern: ":"Ändern: ")+t)}}
  {const b=$("#rcan");if(b)b.onclick=async()=>{if(await kiCancel(j)){zu();jobs()}}}
  {const b=$("#jvgo");if(b)b.onclick=async()=>{zu();await eingangStarten([j.id]);jobs()}}
  // manuelle Aufträge
  document.querySelectorAll("[data-adv]").forEach(b=>b.onclick=()=>{const e=f.E[+b.dataset.adv],t=nodeOf(f,e.t);j.path.push(t.id);
    j.log.push([now(),(c.type==="dec"?"Entscheidung „"+(c.label||"")+"“ → "+(e.l||"weiter")+": ":e.back?"↩ zurück zu ":"weiter: ")+nlabel(t)]);
    if(t.type==="human"){j.st="wait";j.q={kind:"Freigabe",from:c.a?.n||"Ablauf",text:t.label||"",why:"",opts:[]};j.log.push([now(),"wartet auf deine Entscheidung",1])}
    else if(t.type==="end"){j.st="done";markDone(j);j.log.push([now(),"Auftrag fertig"])}
    zu();jobs();jobView(j);schedule()});
  {const b=$("#addQ");if(b)b.onclick=async()=>{const t=await askText("Rückfrage erfassen","",{mehrzeilig:1,bezug:"zu „"+j.t+"“ · der Auftrag wechselt auf „wartet auf dich“",ph:"Was ist offen? z. B. „Wartungsvertrag 3 oder 5 Jahre?“",ok:"Rückfrage speichern"});if(t){j.st="wait";j.q={kind:"Rückfrage",from:c&&c.a?.n||"Ablauf",text:t,why:"",opts:[]};j.log.push([now(),"Rückfrage: "+t,1]);zu();jobs();jobView(j);schedule()}}}
  {const b=$("#addN");if(b)b.onclick=async()=>{const t=await askText("Notiz zum Verlauf","",{mehrzeilig:1,bezug:"zu „"+j.t+"“",ok:"Notiz speichern"});if(t){j.log.push([now(),"Notiz: "+t]);zu();jobView(j);schedule()}}}
  {const b=$("#kigo");if(b)b.onclick=()=>{zu();kiStart(j,"starten")}}
  {const b=$("#kirl2");if(b)b.onclick=async()=>{await kiFresh(j);zu();jobs();jobView(j)}}
  {const b=$("#kire");if(b)b.onclick=()=>{zu();kiStart(j,(j.sess||[]).length?"fortsetzen":"starten")}}
  {const b=$("#stop");if(b)b.onclick=async()=>{$("#jvmenu").open=false;const F=[(j.log||[]).length+" Einträge im Verlauf",...(E.length?[E.length+" eingetragene Ergebnisse (die Datensätze im Backend bleiben bestehen)"]:[]),...((j.anh||[]).length?[(j.anh.length)+" angehängte Bilder"]:[]),...(teileVon(j).filter(Boolean).length?[teileVon(j).filter(Boolean).length+" Teilaufträge verlieren ihren Hauptauftrag"]:[])];
    if(await askOk("Auftrag „"+j.t+"“ endgültig löschen?","Endgültig löschen",{text:j.id+" wird aus dem Organigraph entfernt. Das lässt sich nicht rückgängig machen. Verloren gehen:",folgen:F,nein:"Behalten"})){AU=AU.filter(x=>x!==j);zu();jobs();schedule();toast("Auftrag "+j.id+" gelöscht")}}}
  document.addEventListener("click",function zuKl(e){const m=$("#jvmenu");if(!m){document.removeEventListener("click",zuKl);return}if(m.open&&!m.contains(e.target))m.open=false})}
