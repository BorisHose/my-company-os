// ===== Agent im Organigramm anlegen oder bearbeiten (Assistent in 4 Schritten) =====
// Aufruf aus dem Organigramm: „+ Agent“ je Abteilung, Team oder „Ohne Abteilung“ und ✎ an jeder Agentenkarte.
// Produkt (aus der Organisation) und Platz (aus dem Knopf) stehen fest; verschoben wird im Organigramm über „✎ Bearbeiten“.
// Gearbeitet wird auf einem Entwurf (Kopie). Erst „Agent anlegen“ bzw. „Änderungen speichern“ übernimmt ihn und speichert;
// Abbrechen verwirft ihn. Die Ansicht „Agenten“ bleibt die Gesamtübersicht mit allen Feldern.
const AGW_SCHRITTE=[["grund","Grunddaten"],["skills","Skills"],["regeln","Regeln"],["fertig","Zusammenfassung"]];
const agLeer=p=>({id:uid("ag"),n:"",p,owner:null,dep:null,r:"",w:"",bsp:[],note:"",s:[],mcp:[],m:"Sonnet",own:[],gl:GLOBAL.map((g,i)=>i<4?1:0)});
// Prüfung vor „Weiter“ bzw. „Anlegen“: liefert einen Fehlertext oder ""
function agPruefen(E){const n=(E.n||"").trim();if(!n)return "Bitte einen Namen eingeben";
  if(AG.some(a=>a.id!==E.id&&a.n.trim().toLowerCase()===n.toLowerCase()))return "Einen Agenten „"+n+"“ gibt es schon – bitte einen anderen Namen wählen";return ""}
const agPlatzTxt=(E,O)=>{const pl=PL(E,O.id),d=dept(pl.abt),t=teamsOf(d).find(x=>x.id===pl.team);return d?d.n+(t?" · Team "+t.n:""):"ohne Abteilung"};
const skPasst=(s,p)=>p==="all"||s.p===p||s.p==="all"||s.p==="multi";

// --- KI-Vorschläge für Skills (Fähigkeit „sample“: fragt Claude über das Abo des Betrachters) ---
// Liefert [{id, warum}] nur mit Skills aus dem Katalog, die zum Produkt passen. Fehler werden als {code} weitergereicht.
async function agSkillVorschlag(E,O,opts){await sampleP;if(!SAMPLE)throw {code:"not_granted"};
  const K=SK.filter(s=>skPasst(s,E.p)),d=dept(PL(E,O.id).abt);
  const prompt=["Du hilfst, einen KI-Agenten in „My Company OS“ zusammenzustellen. Wähle aus dem Skill-Katalog die Skills, die der Agent für sein Ziel braucht – lieber wenige passende als viele.",
    "AGENT","Name: "+E.n,"Ziel: "+(E.r||"(nicht angegeben)"),"Organisation: "+O.n+(d?" · Abteilung: "+d.n:""),"Produkt: "+PN[E.p],
    "SKILL-KATALOG (id | Name | Gruppe | Beschreibung)",...K.map(s=>s.id+" | "+s.n+" | "+grName(s.g)+" | "+String(s.d||"").replace(/\s+/g," ").slice(0,220)),
    'Antworte nur mit JSON: {"vorschlaege":[{"id":"<id aus dem Katalog>","warum":"<ein kurzer Satz auf Deutsch>"}]} – höchstens 6 Einträge, die wichtigsten zuerst, nur ids aus dem Katalog.'].join("\n");
  const j=await SAMPLE.json(prompt,{modelTier:"quick",...(opts||{})});const L=(j&&Array.isArray(j.vorschlaege))?j.vorschlaege:[];const ok=new Set(K.map(s=>s.id)),seen=new Set();
  return L.map(x=>({id:String(x&&x.id||""),warum:String(x&&x.warum||"").slice(0,200)})).filter(x=>ok.has(x.id)&&!seen.has(x.id)&&seen.add(x.id)).slice(0,6)}
const KIV_FEHLER={rate_limited:"Gerade zu viele Anfragen an Claude – bitte später „Neu vorschlagen“.",invalid_json:"Der Vorschlag war nicht lesbar – „Neu vorschlagen“ versuchen.",refused:"Claude hat keinen Vorschlag gemacht – Ziel genauer beschreiben.",empty_completion:"Kein Vorschlag erhalten – Ziel genauer beschreiben.",session_expired:"Bitte in claude.ai neu anmelden.",upstream_error:"Claude war nicht erreichbar – „Neu vorschlagen“ versuchen."};
const KIV_AUS=new Set(["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"]);

// ziel = {org, abt, team} für einen neuen Agenten oder {org, aid} zum Bearbeiten
function agAssistent(ziel){if(blocked())return;const oid=ziel.org,O=orgById(oid);if(!O)return;
  const alt=ziel.aid?AG.find(x=>x.id===ziel.aid):null;if(ziel.aid&&!alt)return toast("Agent nicht gefunden");
  const E=alt?JSON.parse(JSON.stringify(alt)):agLeer(O.prod||"all");
  if(!alt){if(ziel.abt)moveAg(E,oid,ziel.abt,ziel.team||"");const a=adapter(E.p);if(a)E.mcp=[a.n];const me=ME();if(me&&(me.orgs||[]).includes(oid))E.owner=me.id}
  const START=JSON.stringify(E),SEL=new Set(E.s);let schritt=0,weit=alt?AGW_SCHRITTE.length-1:0;
  // KI-Vorschläge: kiv = {st:"leer"|"laeuft"|"ok"|"fehler"|"aus", L:[{id,warum}], t, key}
  const kiv={st:"leer",L:[],t:"",key:""};let kivCtl=null;
  const close0=modalBox(`<div class="bhead"><h3 id="gwh"></h3><button class="ic" id="mclose" style="font-size:18px" title="Abbrechen">✕</button></div>
    <div class="steps2" id="gwst"></div><div id="gwb"></div><div class="warnbox" id="gwerr" style="display:none;margin-top:10px"></div>
    <div class="btns" id="gwf" style="margin-top:14px;align-items:center"></div>`,true);
  const close=()=>{if(kivCtl)kivCtl.abort();close0()};
  const kopf=()=>{$("#gwh").textContent=alt?"Agent „"+alt.n+"“ bearbeiten":"Neuer Agent in „"+(dept(PL(E,oid).abt)?dept(PL(E,oid).abt).n:(O.kurz||O.n)+" · ohne Abteilung")+"“"};
  const fehler=t=>{const b=$("#gwerr");b.style.display=t?"":"none";b.textContent=t||""};
  const syncSkills=()=>{E.s=E.s.filter(x=>SEL.has(x)).concat([...SEL].filter(x=>!E.s.includes(x)))};
  const abbrechen=async()=>{if(JSON.stringify(E)!==START&&!await askOk(alt?"Änderungen an „"+alt.n+"“ verwerfen?":"Entwurf für den neuen Agenten verwerfen?","Verwerfen"))return;close()};
  $("#mclose").onclick=abbrechen;

  // --- Schritt 1: Grunddaten (Produkt und Platz stehen fest) ---
  const grund=B=>{
    B.innerHTML=`<div class="gwfest"><span><b>Produkt</b> ${esc(PN[E.p])}</span><span><b>Platz</b> ${esc(O.kurz||O.n)} · ${esc(agPlatzTxt(E,O))}</span></div>
      <div class="field"><label>Name <span class="need">Pflicht</span></label><input type="text" id="gwn" value="${esc(E.n)}" placeholder="z. B. Angebotsassistent"></div>
      <div class="field"><label>Ziel – was erreicht der Agent?</label><textarea id="gwr" placeholder="z. B. Erstellt nach einem Erstgespräch Angebot und Begleitmail für den Interessenten.">${esc(E.r)}</textarea>
        <div class="hint" style="margin:4px 0 0">Aus Name und Ziel schlägt Claude im nächsten Schritt passende Skills vor.</div></div>
      <div class="row"><div class="field"><label>Verantwortlich (Mensch)</label>${usersSel("gwo",E.owner,"– offen –")}</div><div class="field"><label>Vertretung</label>${usersSel("gwd",E.dep,"– offen –")}</div></div>
      <div class="row"><div class="field"><label>Modell</label><select id="gwm">${["Opus","Sonnet","Haiku"].map(m=>`<option ${m===E.m?"selected":""}>${m}</option>`).join("")}</select></div>
        <div class="field"><label>Verbindungen (MCP)</label><div style="display:flex;gap:16px;flex-wrap:wrap;padding-top:6px">${adapterListe().map(x=>`<label class="cb"><input type="checkbox" data-gwc="${esc(x.n)}" ${E.mcp.includes(x.n)?"checked":""}> ${esc(x.n)}</label>`).join("")}</div></div></div>`;
    $("#gwn").oninput=e=>{E.n=e.target.value;fehler("")};$("#gwr").oninput=e=>{E.r=e.target.value};$("#gwm").onchange=e=>{E.m=e.target.value};
    $("#gwo").onchange=e=>{E.owner=e.target.value||null;if(E.owner&&E.dep===E.owner){E.dep=null;zeige()}};$("#gwd").onchange=e=>{E.dep=e.target.value||null};
    B.querySelectorAll("[data-gwc]").forEach(c=>c.onchange=()=>{E.mcp=c.checked?[...E.mcp,c.dataset.gwc]:E.mcp.filter(x=>x!==c.dataset.gwc)});
    if(!alt)setTimeout(()=>{const n=$("#gwn");if(n)n.focus()},30)};

  // --- Schritt 2: Skills – oben die Vorschläge der KI, darunter der Katalog in Gruppen ---
  let K=null;
  const kivZeichnen=()=>{const b=$("#gwki");if(!b)return;
    const kopfz=`<div class="gwkih"><b>✦ Vorschläge von Claude</b><span class="hint" style="margin:0">aus Name und Ziel</span><span style="flex:1"></span>${kiv.st==="laeuft"?'<button class="btn sm" id="gwkis">Stopp</button>':kiv.st==="aus"?"":'<button class="btn sm" id="gwkin">Neu vorschlagen</button>'}${kiv.st==="ok"&&kiv.L.some(x=>!SEL.has(x.id))?'<button class="btn sm p" id="gwkia">Alle übernehmen</button>':""}</div>`;
    const rumpf=kiv.st==="laeuft"?'<div class="hint">Claude sucht passende Skills …</div>':kiv.st==="aus"?'<div class="hint">KI-Vorschläge sind in dieser Ansicht nicht verfügbar – bitte unten aus dem Katalog wählen.</div>':kiv.st==="fehler"?`<div class="hint">${esc(kiv.t)}</div>`:kiv.st==="ok"&&!kiv.L.length?'<div class="hint">Kein passender Skill im Katalog gefunden.</div>':kiv.st==="ok"?kiv.L.map(x=>{const s=sk(x.id),dr=SEL.has(x.id);return `<div class="gwkir ${dr?"on":""}"><button class="btn sm ${dr?"":"p"}" data-kiv="${esc(x.id)}">${dr?"✓ übernommen":"Übernehmen"}</button><div><b>${esc(s.n)}</b> ${srcBadge(s)}<small>${esc(x.warum)}</small></div></div>`}).join(""):'<div class="hint">Für Vorschläge in den Grunddaten einen Namen und am besten ein Ziel angeben.</div>';
    b.innerHTML=kopfz+rumpf;
    const st=$("#gwkis");if(st)st.onclick=()=>{if(kivCtl)kivCtl.abort()};const nn=$("#gwkin");if(nn)nn.onclick=()=>kivLaden(true);
    const al=$("#gwkia");if(al)al.onclick=()=>{kiv.L.forEach(x=>SEL.add(x.id));if(K)K.draw();auswahl()};
    b.querySelectorAll("[data-kiv]").forEach(x=>x.onclick=()=>{const id=x.dataset.kiv;SEL.has(id)?SEL.delete(id):SEL.add(id);if(K)K.draw();auswahl()})};
  const kivLaden=async neu=>{if(!E.n.trim()){kiv.st="leer";return kivZeichnen()}if(kivCtl)kivCtl.abort();const ctl=kivCtl=new AbortController();
    kiv.key=E.n+"|"+E.r+"|"+E.p;kiv.st="laeuft";kivZeichnen();
    try{const L=await agSkillVorschlag(E,O,{signal:ctl.signal,...(neu?{cache:false}:{})});if(kivCtl!==ctl)return;kiv.L=L;kiv.st="ok"}
    catch(e){if(kivCtl!==ctl)return;const c=e&&e.code;if(c==="cancelled"){kiv.st=kiv.L.length?"ok":"fehler";kiv.t="Abgebrochen – „Neu vorschlagen“ startet erneut."}else if(KIV_AUS.has(c))kiv.st="aus";else{kiv.st="fehler";kiv.t=KIV_FEHLER[c]||KIV_FEHLER.upstream_error}}
    if(kivCtl===ctl)kivCtl=null;kivZeichnen()};
  const auswahl=()=>{syncSkills();const n=$("#gwsn");if(!n)return;n.textContent="Ausgewählt ("+E.s.length+")";
    $("#gwsl").innerHTML=E.s.map(id=>{const s=sk(id),b=s&&bad(E,s),dim=s&&["entwurf","vorschlag"].includes(srcOf(s));return `<span class="chip ${b?"bad":""}" title="${b?"Gehört zu "+esc(PN[s.p])+" – passt nicht zum Produkt dieses Agenten":dim?"Noch nicht im Konto":""}"><span>${b?"⚠ ":""}${esc(s?s.n:id)}${dim?` <small class="prf">· ${srcOf(s)==="vorschlag"?"Vorschlag":"Entwurf"}</small>`:""}</span><button class="ic" data-gwx="${esc(id)}" title="entfernen">×</button></span>`}).join("")||'<span class="hint" style="margin:0">noch keine – Vorschläge übernehmen oder unten ankreuzen</span>';
    $("#gwsl").querySelectorAll("[data-gwx]").forEach(b=>b.onclick=()=>{SEL.delete(b.dataset.gwx);if(K)K.draw();auswahl()});kivZeichnen()};
  const skills=B=>{B.innerHTML=`<div class="gwki" id="gwki"></div><div class="gwselbar"><span class="flabel" id="gwsn"></span><div id="gwsl"></div></div><div class="flabel" style="margin-top:12px">Skill-Katalog</div><div id="gwkat"></div>`;
    K=skAuswahl($("#gwkat"),{p:E.p,SEL,onChange:auswahl,fokus:false});auswahl();
    if(kiv.st!=="aus"&&kiv.key!==E.n+"|"+E.r+"|"+E.p)kivLaden(false)};

  // --- Schritt 3: Regeln – die Regeln der gewählten Skills (nur Anzeige) und eigene Regeln ---
  const regeln=B=>{const S=E.s.map(sk).filter(Boolean).map(s=>({s,R:skRegeln(s,E.p)})),nR=S.reduce((n,x)=>n+x.R.length,0);
    B.innerHTML=`<div class="lpwrap"><div class="lpsec"><h4>Aus den gewählten Skills <span class="badge lp">${nR}</span><span class="hint" style="margin:0;font-weight:400">kommen aus dem Skill, dort änderbar</span></h4>
        ${S.length?S.map(({s,R})=>`<div class="gwrs"><div class="gwrsh">⛨ ${esc(s.n)}</div>${R.map(x=>`<div class="lprule"><span class="txt">${esc(x.r)}</span>${x.l?`<span class="src">${esc(x.l)}</span>`:""}</div>`).join("")||'<div class="hint" style="margin:0">keine Regeln</div>'}</div>`).join(""):'<div class="hint">Noch keine Skills gewählt.</div>'}</div>
      <div class="lpsec"><h4>Eigene Regeln dieses Agenten <span class="badge">${E.own.length}</span></h4>
        ${E.own.map((r,i)=>`<div class="lprule"><span class="txt">${esc(r)}</span><button class="ic" data-gwro="${i}" title="entfernen">×</button></div>`).join("")||'<div class="hint">Noch keine.</div>'}
        <div class="ownadd"><input type="text" id="gwown" placeholder="Neue Regel, z. B. „Angebote nie ohne Freigabe versenden“ …"><button class="btn" id="gwownb">Hinzufügen</button></div></div></div>`;
    const add=()=>{const v=$("#gwown").value.trim();if(!v)return;if(E.own.includes(v))return toast("Diese Regel gibt es schon");E.own.push(v);zeige();const i=$("#gwown");if(i)i.focus()};
    $("#gwownb").onclick=add;$("#gwown").onkeydown=e=>{if(e.key==="Enter")add()};
    B.querySelectorAll("[data-gwro]").forEach(b=>b.onclick=()=>{E.own.splice(+b.dataset.gwro,1);zeige()})};

  // --- Schritt 4: Zusammenfassung ---
  const fertig=B=>{const ow=usr(E.owner),dp=usr(E.dep),S=E.s.map(id=>sk(id)),nR=S.reduce((n,s)=>n+(s?skRegeln(s,E.p).length:0),0);
    const falsch=S.filter(s=>s&&bad(E,s)),entw=S.filter(s=>s&&["entwurf","vorschlag"].includes(srcOf(s)));
    const z=(k,v,warn)=>`<b>${k}</b><span${warn?' style="color:var(--warn)"':""}>${v}</span>`;
    B.innerHTML=`<div class="gwsum">${z("Name",esc(E.n))}${z("Platz",esc(O.kurz||O.n)+" · "+esc(agPlatzTxt(E,O)))}${z("Produkt · Modell",esc(PN[E.p])+" · "+esc(E.m))}
      ${z("Ziel",E.r?esc(E.r):"offen",!E.r)}${z("Verantwortlich",ow?esc(ow.n)+(dp?" · Vertretung "+esc(dp.n):" · Vertretung offen"):"offen",!ow)}${z("Verbindungen",E.mcp.length?esc(E.mcp.join(", ")):"keine")}
      ${z("Skills",S.length?S.map(s=>s?esc(s.n):"?").join(", "):"keine",!S.length)}${z("Regeln",nR+" aus den Skills · "+E.own.length+" eigene")}
      ${z("Einsatz",E.w&&(E.bsp||[]).length?"festgelegt":"„Wann einsetzen?“ und Beispielsätze offen – für das Plugin nötig, in der Ansicht „Agenten“ unter Einsatz ergänzen",!(E.w&&(E.bsp||[]).length))}</div>
      ${falsch.length?`<div class="warnbox" style="margin-top:10px">⚠ ${falsch.map(s=>esc(s.n)).join(", ")} ${falsch.length===1?"gehört":"gehören"} zu einem anderen Produkt.</div>`:""}
      ${entw.length?`<div class="hint" style="margin-top:8px">${entw.map(s=>esc(s.n)).join(", ")}: noch nicht im Konto (Entwurf bzw. Vorschlag) – der Agent kann ${entw.length===1?"diesen Skill":"diese Skills"} erst nutzen, wenn ${entw.length===1?"er":"sie"} übernommen ${entw.length===1?"ist":"sind"}.</div>`:""}`};

  // --- Anlegen bzw. Speichern ---
  const sichern=()=>{const f=agPruefen(E);if(f){schritt=0;zeige();return fehler(f)}E.n=E.n.trim();
    if(alt){const vor=JSON.parse(JSON.stringify(alt));Object.keys(alt).forEach(k=>delete alt[k]);Object.assign(alt,E);const pv=markProv("agents",alt,vor);schedule();close();org();toast("Agent „"+alt.n+"“ gespeichert");if(pv)setTimeout(()=>provConfirm([["agents",alt]]),60);return}
    E.ord=AG.length;AG.push(E);schedule();org();if(kivCtl)kivCtl.abort();
    $("#gwh").textContent="Agent „"+E.n+"“ ist angelegt";$("#gwst").innerHTML="";fehler("");
    $("#gwb").innerHTML=`<p style="margin:0 0 6px">Der Agent steht jetzt im Organigramm in „${esc(agPlatzTxt(E,O))}“. Alle Felder findest du auch in der Ansicht „Agenten“.</p>${E.w&&(E.bsp||[]).length?"":'<div class="hint">Für das Plugin fehlen noch „Wann einsetzen?“ und Beispielsätze.</div>'}`;
    $("#gwf").innerHTML=`<button class="btn" id="gwopen">Im Agenten öffnen</button><span style="flex:1"></span><button class="btn" id="gwdone">Fertig</button><button class="btn p" id="gwgo">▶ Ersten Auftrag geben</button>`;
    $("#mclose").onclick=$("#gwdone").onclick=close;$("#gwopen").onclick=()=>{close();goAgent(E.id)};
    $("#gwgo").onclick=()=>{close();startModal(null,{art:"agent",aid:E.id,org:oid})}};

  const ANS={grund,skills,regeln,fertig};
  const geh=i=>{if(i>schritt&&schritt===0){const f=agPruefen(E);if(f)return fehler(f)}fehler("");schritt=i;weit=Math.max(weit,i);zeige()};
  function zeige(){kopf();
    $("#gwst").innerHTML=AGW_SCHRITTE.map(([k,l],i)=>`<span class="${i===schritt?"on":i<=weit?"ok":""}" ${i<=weit&&i!==schritt?`data-gws="${i}" role="button" tabindex="0" title="Zu „${l}“"`:""}>${i+1} · ${l}</span>`).join("");
    $("#gwst").querySelectorAll("[data-gws]").forEach(s=>{s.onclick=()=>geh(+s.dataset.gws);s.onkeydown=e=>{if(e.key==="Enter")geh(+s.dataset.gws)}});
    K=null;ANS[AGW_SCHRITTE[schritt][0]]($("#gwb"));const letzt=schritt===AGW_SCHRITTE.length-1;
    $("#gwf").innerHTML=`<button class="btn" id="gwx">Abbrechen</button><span style="flex:1"></span>${schritt?'<button class="btn" id="gwz">◂ Zurück</button>':""}${letzt?`<button class="btn p" id="gwok">${alt?"Änderungen speichern":"Agent anlegen"}</button>`:`<button class="btn ${alt?"":"p"}" id="gww">Weiter ▸</button>`}${alt&&!letzt?'<button class="btn p" id="gwok">Speichern</button>':""}`;
    $("#gwx").onclick=abbrechen;const z=$("#gwz");if(z)z.onclick=()=>geh(schritt-1);const w=$("#gww");if(w)w.onclick=()=>geh(schritt+1);const ok=$("#gwok");if(ok)ok.onclick=sichern}
  zeige()}
