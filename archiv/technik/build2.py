h=open('/tmp/cockpit/stage1.html').read()
def R(a,b,n=1):
    global h
    c=h.count(a);assert c==n,(a[:90],c);h=h.replace(a,b)
# --- job progress
R('''   <span class="flabel">Wo steht der Auftrag?''','''   ${j.st==="run"?`<div class="pbox"><b>Fortschritt pflegen</b> <span class="hint" style="margin:0">aktuell: ${esc(nlabel(c))}</span>
     <div class="btns">${f.E.map((e,i)=>[e,i]).filter(([e])=>e.f===c.id).map(([e,i])=>`<button class="btn ${e.back?'':'p'}" data-adv="${i}">${c.type==="dec"?"Entscheidung: "+esc(e.l||"weiter")+" → ":"✓ erledigt → "}${esc(nlabel(nodeOf(f,e.t)))}</button>`).join("")||'<span class="hint">Kein weiterer Schritt verbunden.</span>'}</div>
     <div class="btns"><button class="btn" id="addQ">Rückfrage erfassen</button><button class="btn" id="addN">Notiz zum Verlauf</button></div></div>`:""}
   <span class="flabel">Wo steht der Auftrag?''')
R('''  document.querySelectorAll("[data-ans]").forEach(b=>b.onclick=()=>answer(b.dataset.ans));''','''  document.querySelectorAll("[data-ans]").forEach(b=>b.onclick=()=>answer(b.dataset.ans));
  document.querySelectorAll("[data-adv]").forEach(b=>b.onclick=()=>{const e=f.E[+b.dataset.adv],t=nodeOf(f,e.t);j.path.push(t.id);
    j.log.push([now(),(c.type==="dec"?"Entscheidung „"+(c.label||"")+"“ → "+(e.l||"weiter")+": ":e.back?"↩ zurück zu ":"weiter: ")+nlabel(t)]);
    if(t.type==="human"){j.st="wait";j.q={kind:"Freigabe",from:c.a?.n||"Ablauf",text:t.label||"",why:"",opts:[]};j.log.push([now(),"wartet auf deine Entscheidung",1])}
    else if(t.type==="end"){j.st="done";j.log.push([now(),"Auftrag fertig"])}
    close();jobs();jobModal(j);schedule()});
  const aq=$("#addQ");if(aq)aq.onclick=async()=>{const t=await askText("Rückfrage erfassen – was ist offen?","");if(t){j.st="wait";j.q={kind:"Rückfrage",from:c.a?.n||"Ablauf",text:t,why:"",opts:[]};j.log.push([now(),"Rückfrage: "+t,1]);close();jobs();jobModal(j);schedule()}};
  const an=$("#addN");if(an)an.onclick=async()=>{const t=await askText("Notiz zum Verlauf","");if(t){j.log.push([now(),"Notiz: "+t]);close();jobModal(j);schedule()}};''')
R('''<div class="hint" style="margin:0">${esc(j.q.why)}</div>''','''${j.q.why?`<div class="hint" style="margin:0">${esc(j.q.why)}</div>`:""}''')
# --- skill modal infos
R('''   <div class="btns" style="margin-top:14px;justify-content:flex-end">${s.std?''','''   ${s.std?"":'<div class="infobox" style="margin-top:12px">Änderungen speichert das Cockpit. Dein Skill im Konto bleibt unverändert – zum Übernehmen Claude bitten.</div>'}
   <div class="btns" style="margin-top:14px;justify-content:flex-end">${s.std?''')
R('''   <div id="mpane"></div>''','''   <div id="mpane"></div>
   <div class="infobox" style="margin-top:12px">Vorschlag: Kern und Profile sind aus deinen echten Skills abgeleitet. Im Konto bleiben die Skills unverändert, bis du den Umbau freigibst.</div>''')
R('''${[["core","Gemeinsam (Kern)"],["bodo","Bodo-Profil"],["sellify","sellify-Profil"],["cmp","Vergleich"]].map(''','''${[["core","Gemeinsam (Kern)"],["bodo","Bodo-Profil"],["sellify","sellify-Profil"],["cmp","Vergleich"]].concat(s.orig?[["orig","Original-Skills"]]:[]).map(''')
R('''    if(tab==="cmp"){''','''    if(tab==="orig")return Object.entries(s.orig).map(([k,v])=>`<div class="field"><label>${esc(k)} – SKILL.md im Konto (nur lesen)</label><textarea readonly style="min-height:260px;font-family:ui-monospace,monospace;font-size:12px">${esc(v)}</textarea></div>`).join("");
    if(tab==="cmp"){''')
R('''    else if(tab!=="cmp"){W.prof[tab]''','''    else if(tab!=="cmp"&&tab!=="orig"){W.prof[tab]''')
# tile marker
R('''<span class="pb sellify">sellify${s.prof.sellify?.neu?" · neu":""}</span>`''','''<span class="pb sellify">sellify${s.prof.sellify?.neu?" · neu":""}</span>${s.src==="vorschlag"?' <span class="badge neu" title="Im Konto noch getrennte Skills">Vorschlag</span>':''}`''')
R('''<small>${a.s.length} Skills${a.mcp.length?' · '+a.mcp.join(", "):''}${a.note?' · 📝':''}</small>''','''<small>${a.s.length} Skills${a.mcp.length?' · '+a.mcp.join(", "):''}${a.note?' · 📝':''}${a.vorschlag?' · Vorschlag':''}</small>''')
R('''<small>${k} Schritte · ${d} Entscheidungen</small>''','''<small>${k} Schritte · ${d} Entscheidungen${f.vorschlag?' · Vorschlag':''}</small>''')
# --- CSS
R('.toast{','''.btn.sm{padding:2px 8px;font-size:12px;text-transform:none;letter-spacing:0;font-weight:500}
.pbox{border:1px solid var(--line);background:#f7f9fc;border-radius:10px;padding:10px 12px;margin:10px 0}.pbox .btns{margin-top:8px}
#dlg .box{max-width:460px}
.tag.ok{background:#2e7d4f}.tag.err{background:#b42318}
.empty{padding:28px;text-align:center;color:var(--mut)}.empty b{color:var(--ink);display:block;font-size:15px;margin-bottom:4px}
.toast{''',1)
# --- runtime: helpers + persistence + boot
RT=r'''
// ===== Dialoge (alert/confirm/prompt gibt es im Artefakt nicht) =====
function dlg(html){return new Promise(res=>{const d=document.createElement("div");d.id="dlg";d.innerHTML=`<div class="modal" style="z-index:40"><div class="box">${html}</div></div>`;document.body.appendChild(d);
  const done=v=>{d.remove();res(v)};d.querySelector("[data-no]").onclick=()=>done(null);d.querySelector("[data-yes]").onclick=()=>{const i=d.querySelector("input");done(i?i.value.trim():true)};
  const i=d.querySelector("input");if(i){i.focus();i.select();i.onkeydown=e=>{if(e.key==="Enter")done(i.value.trim());if(e.key==="Escape")done(null)}}})}
const askText=(t,v)=>dlg(`<h3 style="margin:0 0 10px;font-size:15px">${esc(t)}</h3><input type="text" id="dlgin" value="${esc(v||"")}"><div class="btns" style="margin-top:12px;justify-content:flex-end"><button class="btn" data-no>Abbrechen</button><button class="btn p" data-yes>OK</button></div>`);
const askOk=t=>dlg(`<p style="margin:0 0 12px">${esc(t)}</p><div class="btns" style="justify-content:flex-end"><button class="btn" data-no>Abbrechen</button><button class="btn d" data-yes>Ja, löschen</button></div>`).then(v=>!!v);
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg)}catch(e){const p=$("#pv");if(p){p.closest("details").open=true;const r=document.createRange();r.selectNodeContents(p);const s=getSelection();s.removeAllRanges();s.addRange(r)}toast("Kopieren nicht möglich – Text ist markiert")}}
const now=()=>{const d=new Date();return d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})};
const uid=p=>p+"-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
// ===== Speicher (db) =====
let DB=null,RO=false;const LAST=new Map();let tmr=null,busy=false,again=false;
const OUT={skills:s=>s,agents:a=>a,flows:f=>({...f,N:f.N.map(n=>{const {a,...r}=n;return {...r,aid:a?a.id:(r.aid??null)}})}),jobs:j=>{const {f,...r}=j;return {...r,fid:f?f.id:r.fid}}};
function snapshot(){const m=new Map();[["skills",SK],["agents",AG],["flows",FL],["jobs",AU]].forEach(([c,arr])=>arr.forEach(o=>{if(!o.id)o.id=uid(c.slice(0,2));m.set(c+"/"+o.id,JSON.stringify(OUT[c](o)))}));
  m.set("meta/config",JSON.stringify({groups:GR,globals:GLOBAL,settings:SET}));return m}
function setSave(s,t){const e=$("#save");e.className="tag"+(s==="ok"?" ok":s==="err"?" err":"");e.textContent=t}
function schedule(){if(!DB||RO)return;clearTimeout(tmr);tmr=setTimeout(flush,700)}
async function flush(){if(busy){again=true;return}busy=true;const cur=snapshot();let n=0;
  try{for(const [k,v] of cur)if(LAST.get(k)!==v){if(!n)setSave("","Speichert …");await DB.doc(k).set(JSON.parse(v));LAST.set(k,v);n++}
      for(const k of [...LAST.keys()])if(!cur.has(k)){await DB.doc(k).delete();LAST.delete(k);n++}
      if(n)setSave("ok","Gespeichert")}
  catch(e){if(e&&e.code==="invalid_argument"&&!LAST.size){RO=true;setSave("err","Nur lesen")}else setSave("err",e&&e.code==="quota_exceeded"?"Speicher voll":"Nicht gespeichert – erneuter Versuch bei der nächsten Änderung")}
  busy=false;if(again){again=false;flush()}}
["input","change","click","pointerup","drop"].forEach(ev=>document.addEventListener(ev,()=>schedule()));
function hydrate(){FL.forEach(f=>f.N.forEach(n=>{if("aid" in n)n.a=AG.find(a=>a.id===n.aid)||null}));AU.forEach(j=>{j.f=FL.find(f=>f.id===j.fid)});
  NID=1+Math.max(0,...FL.flatMap(f=>f.N.map(n=>+(/^n(\d+)$/.exec(n.id)||[0,0])[1])))}
function emptyState(t,s){$("#lib").innerHTML=`<div class="empty"><b>${t}</b>${s}</div>`}
async function boot(){
  render();jobs();setSave("","Lädt …");
  DB=window.claude?await window.claude.use("db"):null;
  if(!DB){RO=true;setSave("err","Speicher nicht verfügbar");emptyState("Speicher nicht verfügbar","Öffne das Cockpit angemeldet auf claude.ai, damit deine Daten geladen und gespeichert werden.");return}
  try{const [m,...cs]=await Promise.all([DB.doc("meta/config").get(),...["skills","agents","flows","jobs"].map(c=>DB.collection(c).limit(1000).get())]);
    const D=cs.map(q=>q.docs.map(d=>JSON.parse(JSON.stringify(d.data()))));
    [SK,AG,FL,AU]=D;if(m.exists){const c=m.data();GR=[...(c.groups||[])];GLOBAL=[...(c.globals||[])];SET={...SET,...(c.settings||{})}}
    SK.sort((a,b)=>(a.ord??0)-(b.ord??0));AG.sort((a,b)=>(a.ord??0)-(b.ord??0));FL.sort((a,b)=>(a.ord??0)-(b.ord??0));AU.sort((a,b)=>(+b.id.slice(2)||0)-(+a.id.slice(2)||0));
    hydrate();const s0=snapshot();s0.forEach((v,k)=>LAST.set(k,v));
    const f=agVis()[0];cur=f?f[1]:-1;fcur=FL.findIndex(x=>x.p===FF);
    render();jobs();setSave("ok","Gespeichert");
    if(!SK.length)emptyState("Noch keine Skills","Bitte Claude, die Startdaten einzuspielen – danach erscheinen hier deine Skills.");
  }catch(e){setSave("err","Laden fehlgeschlagen");emptyState("Laden fehlgeschlagen","Seite neu laden. Wenn es wieder passiert, Claude Bescheid geben.")}
}
'''
R('render();jobs();\n','/*RT*/\nboot();\n')
h=h.replace('/*RT*/',RT)
open('/tmp/cockpit/page.html','w').write(h)
print(len(h))
