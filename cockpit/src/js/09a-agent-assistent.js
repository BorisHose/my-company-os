// ===== Agent im Organigramm anlegen oder bearbeiten (Assistent in 4 Schritten) =====
// Aufruf aus dem Organigramm: „+ Agent“ je Abteilung, Team oder „Ohne Abteilung“ und ✎ an jeder Agentenkarte.
// Gearbeitet wird auf einem Entwurf (Kopie). Erst „Agent anlegen“ bzw. „Änderungen speichern“ übernimmt ihn und speichert;
// Abbrechen verwirft ihn. Die Ansicht „Agenten“ bleibt die Gesamtübersicht mit allen Feldern.
const AGW_SCHRITTE=[["grund","Grunddaten"],["skills","Skills"],["regeln","Regeln"],["fertig","Zusammenfassung"]];
// Produkte, die ein Agent in dieser Organisation haben kann – sonst erschiene er dort nicht (inOrg): das Produkt der Organisation oder produktunabhängig
const agProdukte=O=>O&&O.prod?[O.prod,"all"]:["all"];
const agLeer=p=>({id:uid("ag"),n:"",p,owner:null,dep:null,r:"",w:"",bsp:[],note:"",s:[],mcp:[],m:"Sonnet",own:[],gl:GLOBAL.map((g,i)=>i<4?1:0)});
// Prüfung vor „Weiter“ bzw. „Anlegen“: liefert einen Fehlertext oder ""
function agPruefen(E){const n=(E.n||"").trim();if(!n)return "Bitte einen Namen eingeben";
  if(AG.some(a=>a.id!==E.id&&a.n.trim().toLowerCase()===n.toLowerCase()))return "Einen Agenten „"+n+"“ gibt es schon – bitte einen anderen Namen wählen";return ""}

// ziel = {org, abt, team} für einen neuen Agenten oder {org, aid} zum Bearbeiten
function agAssistent(ziel){if(blocked())return;const oid=ziel.org,O=orgById(oid);if(!O)return;
  const alt=ziel.aid?AG.find(x=>x.id===ziel.aid):null;if(ziel.aid&&!alt)return toast("Agent nicht gefunden");
  const E=alt?JSON.parse(JSON.stringify(alt)):agLeer(agProdukte(O)[0]);
  if(!alt){if(ziel.abt)moveAg(E,oid,ziel.abt,ziel.team||"");const a=adapter(E.p);if(a)E.mcp=[a.n];const me=ME();if(me&&(me.orgs||[]).includes(oid))E.owner=me.id}
  const START=JSON.stringify(E),SEL=new Set(E.s);let schritt=0,weit=alt?AGW_SCHRITTE.length-1:0;
  const close=modalBox(`<div class="bhead"><h3 id="gwh"></h3><button class="ic" id="mclose" style="font-size:18px" title="Abbrechen">✕</button></div>
    <div class="steps2" id="gwst"></div><div id="gwb"></div><div class="warnbox" id="gwerr" style="display:none;margin-top:10px"></div>
    <div class="btns" id="gwf" style="margin-top:14px;align-items:center"></div>`,true);
  const kopf=()=>{$("#gwh").textContent=alt?"Agent „"+alt.n+"“ bearbeiten":"Neuer Agent in "+(dept(PL(E,oid).abt)?"„"+dept(PL(E,oid).abt).n+"“":"„"+(O.kurz||O.n)+"“ · ohne Abteilung")};
  const fehler=t=>{const b=$("#gwerr");b.style.display=t?"":"none";b.textContent=t||""};
  const syncSkills=()=>{E.s=E.s.filter(x=>SEL.has(x)).concat([...SEL].filter(x=>!E.s.includes(x)))};
  const abbrechen=async()=>{if(JSON.stringify(E)!==START&&!await askOk(alt?"Änderungen an „"+alt.n+"“ verwerfen?":"Entwurf für den neuen Agenten verwerfen?","Verwerfen"))return;close()};
  $("#mclose").onclick=abbrechen;

  // --- Schritt 1: Grunddaten ---
  const grund=B=>{const pl=PL(E,oid),T=teamsOf(dept(pl.abt)),P=agProdukte(O).includes(E.p)?agProdukte(O):[E.p,...agProdukte(O)];
    B.innerHTML=`<div class="field"><label>Name <span class="need">Pflicht</span></label><input type="text" id="gwn" value="${esc(E.n)}" placeholder="z. B. Angebotsassistent"></div>
      <div class="field"><label>Ziel – was erreicht der Agent?</label><textarea id="gwr" placeholder="z. B. Erstellt nach einem Erstgespräch Angebot und Begleitmail für den Interessenten.">${esc(E.r)}</textarea></div>
      <div class="row"><div class="field"><label>Produkt</label><select id="gwp">${P.map(p=>`<option value="${p}" ${E.p===p?"selected":""}>${esc(PN[p])}</option>`).join("")}</select></div>
        <div class="field"><label>Modell</label><select id="gwm">${["Opus","Sonnet","Haiku"].map(m=>`<option ${m===E.m?"selected":""}>${m}</option>`).join("")}</select></div></div>
      <div class="hint" style="margin:-6px 0 10px">${O.prod?"Vorbelegt mit dem Produkt der Organisation. „"+esc(PN.all)+"“ = produktunabhängig, erscheint in jeder Organisation.":"Die Organisation hat kein Produkt – der Agent ist produktunabhängig und erscheint in jeder Organisation."}</div>
      <div class="row"><div class="field"><label>Abteilung · ${esc(O.kurz||O.n)}</label><select id="gwa"><option value="">– ohne Abteilung –</option>${deptsOf(oid).map(d=>`<option value="${d.id}" ${pl.abt===d.id?"selected":""}>${esc(d.n)}</option>`).join("")}</select></div>
        <div class="field"><label>Team</label><select id="gwt" ${T.length?"":"disabled"}><option value="">${T.length?"– direkt in der Abteilung –":"– keine Teams –"}</option>${T.map(t=>`<option value="${t.id}" ${pl.team===t.id?"selected":""}>${esc(t.n)}</option>`).join("")}</select></div></div>
      <div class="row"><div class="field"><label>Verantwortlich (Mensch)</label>${usersSel("gwo",E.owner,"– offen –")}</div><div class="field"><label>Vertretung</label>${usersSel("gwd",E.dep,"– offen –")}</div></div>
      <div class="field"><label>Verbindungen (MCP)</label><div style="display:flex;gap:16px;flex-wrap:wrap">${adapterListe().map(x=>`<label class="cb"><input type="checkbox" data-gwc="${esc(x.n)}" ${E.mcp.includes(x.n)?"checked":""}> ${esc(x.n)}</label>`).join("")}</div></div>`;
    $("#gwn").oninput=e=>{E.n=e.target.value;fehler("")};$("#gwr").oninput=e=>{E.r=e.target.value};$("#gwm").onchange=e=>{E.m=e.target.value};
    $("#gwp").onchange=e=>{E.p=e.target.value};
    $("#gwa").onchange=e=>{moveAg(E,oid,e.target.value,"");kopf();zeige()};$("#gwt").onchange=e=>{moveAg(E,oid,PL(E,oid).abt,e.target.value)};
    $("#gwo").onchange=e=>{E.owner=e.target.value||null;if(E.owner&&E.dep===E.owner){E.dep=null;zeige()}};$("#gwd").onchange=e=>{E.dep=e.target.value||null};
    B.querySelectorAll("[data-gwc]").forEach(c=>c.onchange=()=>{E.mcp=c.checked?[...E.mcp,c.dataset.gwc]:E.mcp.filter(x=>x!==c.dataset.gwc)});
    if(!alt)setTimeout(()=>{const n=$("#gwn");if(n)n.focus()},30)};

  // --- Schritt 2: Skills aus dem Katalog ---
  const skills=B=>{B.innerHTML=`<div class="gwsk"><div id="gwkat"></div><div class="gwsel"><div class="flabel" id="gwsn"></div><div id="gwsl"></div></div></div>`;
    const auswahl=()=>{syncSkills();$("#gwsn").textContent="Ausgewählt ("+E.s.length+")";
      $("#gwsl").innerHTML=E.s.map(id=>{const s=sk(id),b=s&&bad(E,s),dim=s&&["entwurf","vorschlag"].includes(srcOf(s));return `<span class="chip ${b?"bad":""}" title="${b?"Gehört zu "+esc(PN[s.p])+" – passt nicht zum Produkt dieses Agenten":dim?"Noch nicht im Konto":""}"><span>${b?"⚠ ":""}${esc(s?s.n:id)}${dim?` <small class="prf">· ${srcOf(s)==="vorschlag"?"Vorschlag":"Entwurf"}</small>`:""}</span><button class="ic" data-gwx="${esc(id)}" title="entfernen">×</button></span>`}).join("")||'<span class="hint">Noch keine Skills – links ankreuzen.</span>';
      $("#gwsl").querySelectorAll("[data-gwx]").forEach(b=>b.onclick=()=>{SEL.delete(b.dataset.gwx);K.draw();auswahl()})};
    const K=skAuswahl($("#gwkat"),{p:E.p,SEL,onChange:auswahl});auswahl()};

  // --- Schritt 3: Regeln ---
  const regeln=B=>{const inh=inherited(E);
    B.innerHTML=`<div class="lpwrap"><div class="lpsec"><h4>Eigene Regeln dieses Agenten <span class="badge">${E.own.length}</span></h4>
        ${E.own.map((r,i)=>`<div class="lprule"><span class="txt">${esc(r)}</span><button class="ic" data-gwro="${i}" title="entfernen">×</button></div>`).join("")||'<div class="hint">Noch keine.</div>'}
        <div class="ownadd"><input type="text" id="gwown" placeholder="Neue Regel, z. B. „Angebote nie ohne Freigabe versenden“ …"><button class="btn" id="gwownb">Hinzufügen</button></div></div>
      <div class="lpsec"><h4>Aus den Skills geerbt <span class="badge lp">${inh.length}</span><span class="hint" style="margin:0;font-weight:400">automatisch, nur im Skill änderbar</span></h4>
        ${inh.map(([r,srcs])=>`<div class="lprule"><span class="txt">${esc(r)}</span>${srcs.map(x=>`<span class="src" title="${esc(x.s.id)}">⛨ ${esc(x.l)}</span>`).join(" ")}</div>`).join("")||'<div class="hint">Die gewählten Skills bringen keine Leitplanken mit.</div>'}</div>
      <div class="lpsec"><h4>Deine allgemeinen Vorgaben</h4><div class="hint" style="margin:0 0 6px">Gelten in Cowork sowieso immer. Häkchen = zusätzlich fest in den Agenten schreiben.</div>
        ${GLOBAL.map((r,i)=>`<label class="cb"><input type="checkbox" data-gwgl="${i}" ${E.gl[i]?"checked":""}> ${esc(r)}</label>`).join("")}</div></div>`;
    const add=()=>{const v=$("#gwown").value.trim();if(!v)return;if(E.own.includes(v))return toast("Diese Regel gibt es schon");E.own.push(v);zeige();const i=$("#gwown");if(i)i.focus()};
    $("#gwownb").onclick=add;$("#gwown").onkeydown=e=>{if(e.key==="Enter")add()};
    B.querySelectorAll("[data-gwro]").forEach(b=>b.onclick=()=>{E.own.splice(+b.dataset.gwro,1);zeige()});
    B.querySelectorAll("[data-gwgl]").forEach(c=>c.onchange=()=>{E.gl[+c.dataset.gwgl]=c.checked?1:0})};

  // --- Schritt 4: Zusammenfassung ---
  const fertig=B=>{const pl=PL(E,oid),d=dept(pl.abt),t=teamsOf(d).find(x=>x.id===pl.team),ow=usr(E.owner),dp=usr(E.dep),inh=inherited(E);
    const S=E.s.map(id=>sk(id)),falsch=S.filter(s=>s&&bad(E,s)),entw=S.filter(s=>s&&["entwurf","vorschlag"].includes(srcOf(s)));
    const z=(k,v,warn)=>`<b>${k}</b><span${warn?' style="color:var(--warn)"':""}>${v}</span>`;
    B.innerHTML=`<div class="gwsum">${z("Name",esc(E.n))}${z("Platz",esc(O.kurz||O.n)+" · "+(d?esc(d.n)+(t?" · Team "+esc(t.n):""):"ohne Abteilung"))}${z("Produkt · Modell",esc(PN[E.p])+" · "+esc(E.m))}
      ${z("Ziel",E.r?esc(E.r):"offen",!E.r)}${z("Verantwortlich",ow?esc(ow.n)+(dp?" · Vertretung "+esc(dp.n):" · Vertretung offen"):"offen",!ow)}${z("Verbindungen",E.mcp.length?esc(E.mcp.join(", ")):"keine")}
      ${z("Skills",S.length?S.map(s=>s?esc(s.n):"?").join(", "):"keine",!S.length)}${z("Regeln",E.own.length+" eigene · "+inh.length+" aus Skills geerbt")}
      ${z("Einsatz",E.w&&(E.bsp||[]).length?"festgelegt":"„Wann einsetzen?“ und Beispielsätze offen – für das Plugin nötig, in der Ansicht „Agenten“ unter Einsatz ergänzen",!(E.w&&(E.bsp||[]).length))}</div>
      ${falsch.length?`<div class="warnbox" style="margin-top:10px">⚠ ${falsch.map(s=>esc(s.n)).join(", ")} ${falsch.length===1?"gehört":"gehören"} zu einem anderen Produkt.</div>`:""}
      ${entw.length?`<div class="hint" style="margin-top:8px">${entw.map(s=>esc(s.n)).join(", ")}: noch nicht im Konto (Entwurf bzw. Vorschlag) – der Agent kann ${entw.length===1?"diesen Skill":"diese Skills"} erst nutzen, wenn ${entw.length===1?"er":"sie"} übernommen ${entw.length===1?"ist":"sind"}.</div>`:""}`};

  // --- Anlegen bzw. Speichern ---
  const sichern=()=>{const f=agPruefen(E);if(f){schritt=0;zeige();return fehler(f)}E.n=E.n.trim();
    if(alt){const vor=JSON.parse(JSON.stringify(alt));Object.keys(alt).forEach(k=>delete alt[k]);Object.assign(alt,E);const pv=markProv("agents",alt,vor);schedule();close();org();toast("Agent „"+alt.n+"“ gespeichert");if(pv)setTimeout(()=>provConfirm([["agents",alt]]),60);return}
    E.ord=AG.length;AG.push(E);schedule();org();
    $("#gwh").textContent="Agent „"+E.n+"“ ist angelegt";$("#gwst").innerHTML="";fehler("");
    $("#gwb").innerHTML=`<p style="margin:0 0 6px">Der Agent steht jetzt im Organigramm${dept(PL(E,oid).abt)?" in „"+esc(dept(PL(E,oid).abt).n)+"“":""}. Alle Felder findest du auch in der Ansicht „Agenten“.</p>${E.w&&(E.bsp||[]).length?"":'<div class="hint">Für das Plugin fehlen noch „Wann einsetzen?“ und Beispielsätze.</div>'}`;
    $("#gwf").innerHTML=`<button class="btn" id="gwopen">Im Agenten öffnen</button><span style="flex:1"></span><button class="btn" id="gwdone">Fertig</button><button class="btn p" id="gwgo">▶ Ersten Auftrag geben</button>`;
    $("#mclose").onclick=$("#gwdone").onclick=close;$("#gwopen").onclick=()=>{close();goAgent(E.id)};
    $("#gwgo").onclick=()=>{close();startModal(null,{art:"agent",aid:E.id,org:oid})}};

  const ANS={grund,skills,regeln,fertig};
  const geh=i=>{if(i>schritt&&schritt===0){const f=agPruefen(E);if(f)return fehler(f)}fehler("");schritt=i;weit=Math.max(weit,i);zeige()};
  function zeige(){kopf();
    $("#gwst").innerHTML=AGW_SCHRITTE.map(([k,l],i)=>`<span class="${i===schritt?"on":i<=weit?"ok":""}" ${i<=weit&&i!==schritt?`data-gws="${i}" role="button" tabindex="0" title="Zu „${l}“"`:""}>${i+1} · ${l}</span>`).join("");
    $("#gwst").querySelectorAll("[data-gws]").forEach(s=>{s.onclick=()=>geh(+s.dataset.gws);s.onkeydown=e=>{if(e.key==="Enter")geh(+s.dataset.gws)}});
    ANS[AGW_SCHRITTE[schritt][0]]($("#gwb"));const letzt=schritt===AGW_SCHRITTE.length-1;
    $("#gwf").innerHTML=`<button class="btn" id="gwx">Abbrechen</button><span style="flex:1"></span>${schritt?'<button class="btn" id="gwz">◂ Zurück</button>':""}${letzt?`<button class="btn p" id="gwok">${alt?"Änderungen speichern":"Agent anlegen"}</button>`:`<button class="btn ${alt?"":"p"}" id="gww">Weiter ▸</button>`}${alt&&!letzt?'<button class="btn p" id="gwok">Speichern</button>':""}`;
    $("#gwx").onclick=abbrechen;const z=$("#gwz");if(z)z.onclick=()=>geh(schritt-1);const w=$("#gww");if(w)w.onclick=()=>geh(schritt+1);const ok=$("#gwok");if(ok)ok.onclick=sichern}
  zeige()}
