// ===== Einstellungen (⚙), Kopfzeile mit Datum/Uhrzeit und angemeldetem Benutzer, Darstellung hell/dunkel (Etappe 4a) =====
// Angemeldeter Benutzer: je Browser gewählt (UI.me); ohne Wahl der Inhaber der Instanz bzw. die Geschäftsführung der ersten Organisation.
const ME=()=>usr(UI.me)||usr(SET.inhaber)||usr((ORGS()[0]||{}).gf)||US.find(u=>u.aktiv!==false)||null;
const ICH=()=>{const u=ME();return u?String(u.n).split(" ")[0]:"Inhaber"};
function themeSet(t){UI.theme=t;document.documentElement.dataset.theme=t;saveUI()}
document.documentElement.dataset.theme=UI.theme||"light";
function uhr(){const e=$("#clock");if(!e)return;const d=new Date();e.textContent=d.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})+" · "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});e.title=d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
setInterval(uhr,15000);
function hdr(){uhr();const m=$("#me");if(m){const u=ME();m.innerHTML=av(u,30);m.title=u?"Angemeldet als "+u.n+" – Einstellungen öffnen":"Benutzer wählen";m.onclick=()=>einst("darst")}
  const g=$("#gear");if(g)g.onclick=()=>einst();const ub=$("#ub");if(ub)ub.onclick=()=>einst("users")}
const SETSEC=[["darst","Darstellung"],["inst","Instanz"],["orgs","Organigramme"],["users","Benutzer"],["ausf","Ausführung"],["dienste","Anbindungen"]];
function einst(sec){if(sec)UI.sets=sec;if(!SETSEC.some(s=>s[0]===UI.sets))UI.sets="darst";saveUI();if($("#settings").classList.contains("hide")){show("settings");return}
  const S=UI.sets;$("#setnav").innerHTML=SETSEC.map(([k,l])=>`<button class="setn ${k===S?"on":""}" data-sets="${k}">${l}</button>`).join("");
  document.querySelectorAll("[data-sets]").forEach(b=>b.onclick=()=>{if(b.dataset.sets==="users"){UI.sets="users";saveUI();show("users");return}einst(b.dataset.sets)});
  const C=$("#setc"),uopt=(v,leer)=>`<option value="">${leer}</option>`+US.filter(u=>u.aktiv!==false||u.id===v).map(u=>`<option value="${u.id}" ${u.id===v?"selected":""}>${esc(u.n)}</option>`).join("");
  if(S==="darst"){const t=UI.theme||"light";
    C.innerHTML=`<h2>Darstellung</h2><div class="field"><label>Farbschema</label><div class="seg" id="sthm" style="margin:0">${[["light","☀ Hell"],["dark","☾ Dunkel"],["auto","Automatisch"]].map(([k,l])=>`<button data-thm="${k}" class="${k===t?"on":""}">${l}</button>`).join("")}</div><div class="hint">„Automatisch“ folgt der Einstellung des Geräts. Gilt für diesen Browser.</div></div>
     <div class="field"><label>Angemeldet als</label><select id="sme">${uopt(UI.me||"","– Inhaber der Instanz –")}</select><div class="hint">Gilt für diesen Browser. Der Name erscheint in Verläufen, z. B. „abgebrochen von ${esc(ICH())}“.</div></div>`;
    document.querySelectorAll("[data-thm]").forEach(b=>b.onclick=()=>{themeSet(b.dataset.thm);einst()});
    $("#sme").onchange=e=>{UI.me=e.target.value||undefined;saveUI();hdr();einst()}}
  else if(S==="inst"){const I=SET.inst||{};
    C.innerHTML=`<h2>Instanz</h2><div class="field"><label>Name der Instanz</label><input type="text" id="sin" value="${esc(I.n||"")}" placeholder="z. B. Company OS business//acts"></div>
     <div class="field"><label>Inhaber</label><select id="sinh">${uopt(SET.inhaber||"","– noch nicht festgelegt –")}</select><div class="hint">Wer die Instanz verantwortet und Aufträge freigibt. Jede Instanz gehört genau einem Kunden und hat ihre eigene Datenbank.</div></div>
     <div class="field"><label>Version</label><div class="hint" style="margin:0">Company OS ${esc(String(VER))} · Datenstand ${esc(String(SET.schema||"–"))}</div></div>`;
    $("#sin").oninput=e=>{SET.inst={...(SET.inst||{}),n:e.target.value.trim()};document.title=(SET.inst.n||"My Company OS")};
    $("#sinh").onchange=e=>{SET.inhaber=e.target.value||undefined;hdr()}}
  else if(S==="orgs"){
    C.innerHTML=`<h2>Organigramme</h2><div class="hint" style="margin:0 0 10px">Je Organigramm Name, Kurzname für den Umschalter und Logo. Abteilungen, Teams und Agenten bearbeitest du im Organigramm über „✎ Bearbeiten“.</div>
     ${ORGS().map(o=>`<div class="setorg" data-so="${o.id}"><div class="sologo">${o.logo?`<img src="${o.logo}" alt="Logo ${esc(o.kurz||o.n)}">`:'<span class="hint" style="margin:0">kein Logo</span>'}</div>
      <div class="sof"><div class="row"><div class="field"><label>Name</label><input type="text" data-son="${o.id}" value="${esc(o.n||"")}"></div><div class="field"><label>Kurzname (Umschalter)</label><input type="text" data-sok="${o.id}" value="${esc(o.kurz||"")}"></div></div>
       <div class="row"><div class="field"><label>Produkt</label><select data-sop="${o.id}"><option value="">– keins –</option>${["bodo","sellify"].map(p=>`<option value="${p}" ${o.prod===p?"selected":""}>${PN[p]}</option>`).join("")}</select></div><div class="field"><label>Geschäftsführung</label><select data-sog="${o.id}">${uopt(o.gf||"","– offen –")}</select></div></div>
       <div class="btns" style="margin:0"><label class="btn sm" style="cursor:pointer">🖼 Logo wählen<input type="file" accept="image/*" data-sol="${o.id}" style="display:none"></label>${o.logo?`<button class="btn sm" data-solx="${o.id}">Logo entfernen</button>`:""}</div></div></div>`).join("")}
     <div class="hint">Mit Logo zeigt der Umschalter Logo und Kurzname, sonst nur den Kurznamen. Später kann das Logo aus dem angebundenen Mandanten übernommen werden (kommt mit den Anbindungen).</div>`;
    const O=id=>orgById(id);
    document.querySelectorAll("[data-son]").forEach(i=>i.oninput=()=>{O(i.dataset.son).n=i.value.trim()});
    document.querySelectorAll("[data-sok]").forEach(i=>i.oninput=()=>{O(i.dataset.sok).kurz=i.value.trim()});
    document.querySelectorAll("[data-sop]").forEach(i=>i.onchange=()=>{O(i.dataset.sop).prod=i.value});
    document.querySelectorAll("[data-sog]").forEach(i=>i.onchange=()=>{O(i.dataset.sog).gf=i.value||null});
    document.querySelectorAll("[data-sol]").forEach(i=>i.onchange=async()=>{const f=i.files&&i.files[0];if(!f)return;try{const u=await logoKlein(f);if(u.length>150000)return toast("Logo ist zu groß – bitte ein kleineres Bild wählen");O(i.dataset.sol).logo=u;schedule();einst()}catch(e){toast("Bild konnte nicht gelesen werden")}});
    document.querySelectorAll("[data-solx]").forEach(b=>b.onclick=()=>{delete O(b.dataset.solx).logo;schedule();einst()})}
  else if(S==="ausf"){const T=SET.trig||{};
    C.innerHTML=`<h2>Ausführung</h2><div class="hint" style="margin:0 0 10px">Aufträge laufen als Claude-Sitzungen über zwei geplante Aufgaben im Claude-Konto dieser Instanz.</div>
     ${Object.entries(RUNNERS).map(([k,R])=>`<div class="field"><label>${esc(R.l)} – Kennung der geplanten Aufgabe</label><input type="text" data-trg="${k}" value="${esc(T[k]||R.tid)}" placeholder="trig_…"></div>`).join("")}
     <div class="btns"><button class="btn sm" id="sruns">Letzten Lauf prüfen</button></div>`;
    document.querySelectorAll("[data-trg]").forEach(i=>i.onchange=()=>{const v=i.value.trim();SET.trig={...(SET.trig||{})};if(/^trig_\w+$/.test(v))SET.trig[i.dataset.trg]=v;else{delete SET.trig[i.dataset.trg];toast("Ungültige Kennung – Standard bleibt")}});
    $("#sruns").onclick=kiRuns}
  else if(S==="dienste")dienstEinst(C)
}
// Logo einlesen: in 320×96 einpassen, Transparenz behalten (PNG)
function logoKlein(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,320/im.width,96/im.height),w=Math.max(1,Math.round(im.width*k)),h=Math.max(1,Math.round(im.height*k)),c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(im,0,0,w,h);res(c.toDataURL("image/png"))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
