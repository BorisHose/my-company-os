// ===== Speicher (db) =====
let DB=null,RO=false;const LAST=new Map();let tmr=null,busy=false,again=false;
// ===== Datenschicht: jeder Datenbankzugriff läuft über Store (eine Stelle für Abfragen, Sperren, spätere Umzüge) =====
const SCHEMA=3,ARCHIV_TAGE=90,OFFEN=["run","wait","inbox"],HOLDER="cos-"+Math.random().toString(36).slice(2,10);
const plain=o=>o==null?o:JSON.parse(JSON.stringify(o));
const Store={ok:()=>!!DB,
  async get(k){const d=await DB.doc(k).get();return d.exists?plain(d.data()):null},
  set:(k,v)=>DB.doc(k).set(v),update:(k,v)=>DB.doc(k).update(v),del:k=>DB.doc(k).delete(),
  query(c,o={}){let q=DB.collection(c);(o.where||[]).forEach(w=>{q=q.where(w[0],w[1],w[2])});if(o.orderBy)q=q.orderBy(o.orderBy[0],o.orderBy[1]||"asc");return q.limit(o.limit||1000)},
  async list(c,o){const s=await Store.query(c,o).get();return s.docs.map(d=>plain(d.data()))},
  watch(c,o,next,err){return Store.query(c,o).onSnapshot(s=>next(s.docs.map(d=>plain(d.data()))),err)},
  async lease(k,ms){try{const r=await DB.doc(k).acquire({holder:HOLDER,ttlMs:ms||8000});return !!(r&&r.acquired)}catch(e){return false}}};
const cutoffISO=()=>new Date(Date.now()-ARCHIV_TAGE*864e5).toISOString();
const neuSchema=()=>(SET.schema||0)>=2;
function vereinen(...L){const m=new Map();L.flat().forEach(o=>{if(o&&o.id)m.set(o.id,o)});return [...m.values()]}
// Aufträge: offene immer, erledigte/abgebrochene der letzten 90 Tage; Älteres liegt im Monatsarchiv
async function jobsLaden(){if(!neuSchema())return Store.list("jobs");const [a,b]=await Promise.all([Store.list("jobs",{where:[["st","in",OFFEN]]}),Store.list("jobs",{where:[["fertig",">=",cutoffISO()]]})]);return vereinen(a,b)}
function jobsBeobachten(next,err){if(!neuSchema())return Store.watch("jobs",{},next,err);
  const c=cutoffISO();let A=null,B=null,dead=false,t=null,u1=null,u2=null;
  const emit=()=>{if(!A||!B)return;clearTimeout(t);t=setTimeout(()=>{if(!dead)next(vereinen(A,B))},350)};
  const fail=e=>{if(dead)return;dead=true;clearTimeout(t);try{u1&&u1()}catch(x){}try{u2&&u2()}catch(x){}err&&err(e)};
  u1=Store.watch("jobs",{where:[["st","in",OFFEN]]},d=>{A=d;emit()},fail);u2=Store.watch("jobs",{where:[["fertig",">=",c]]},d=>{B=d;emit()},fail);
  return ()=>{dead=true;clearTimeout(t);try{u1()}catch(x){}try{u2()}catch(x){}}}
const isoNorm=s=>{const d=new Date(s);return +d?d.toISOString():null};
// Einmalige Umstellung auf Datenstand 2 (läuft unter einer Sperre nur in einem Fenster)
async function migrieren(){const m=await Store.get("meta/config"),s=(m&&m.settings)||{};if((s.schema||0)>=SCHEMA)return false;
  if(!await Store.lease("meta/umzug",60000))return false;if((s.schema||0)>=2){await umzug3(m,s);return true}
  const [J,A,F]=await Promise.all(["jobs","agents","flows"].map(c=>Store.list(c)));const orgs=s.orgs||[],og=p=>(orgs.find(o=>o.prod===p)||orgs[0]||{}).id;let max=99;
  for(const j of J){const p={},n=+String(j.id||"").slice(2)||0;if(n>max)max=n;
    if(j.st==="done"&&(j.log||[]).some(l=>/abgebrochen von/i.test((l&&l[1])||"")))p.st="cancel";
    if(j.fertig&&isoNorm(j.fertig)&&isoNorm(j.fertig)!==j.fertig)p.fertig=isoNorm(j.fertig);
    if(isEnd({st:p.st||j.st})){const e=endFelder({...j,...p});["fertig","fTag","fMon"].forEach(k=>{if(j[k]!==e[k])p[k]=e[k]})}
    const f=F.find(x=>x.id===j.fid);if(!j.org){const o=og(f&&f.p);if(o)p.org=o}
    const org=p.org||j.org,aid=j.aid||((f&&f.N||[]).find(x=>x.type==="task"&&x.aid)||{}).aid,a=A.find(x=>x.id===aid),pl=a&&a.pl&&a.pl[org];
    if(pl&&pl.abt&&!j.abt){p.abt=pl.abt;if(pl.team)p.team=pl.team}
    if(Object.keys(p).length)await Store.update("jobs/"+j.id,p)}
  const z=await Store.get("zaehler/auftrag");if(!z||(z.n||0)<max)await Store.set("zaehler/auftrag",{n:max});
  if(m)await Store.update("meta/config",{settings:{schema:2}});else await Store.set("meta/config",{settings:{schema:2}});await umzug3(await Store.get("meta/config"),s);return true}
// Produktname (v73): Instanzname „(My) Company OS …“ einmalig in „Organigraph …“ umbenennen
const nameMigrieren=()=>{const n=SET.inst&&SET.inst.n;if(!n||!/(My )?Company OS/.test(n))return false;SET.inst={...SET.inst,n:n.replace(/(My )?Company OS/,"Organigraph")};return true};
// Datenstand 3: bisher fest im Code hinterlegte Werte der Instanz von Boris in die Einstellungen übernehmen
async function umzug3(m,s){const alt=(s.orgs||[]).some(o=>o.id==="og-bodo"),p={schema:3};
  if(alt){if(!(s.bodoOrgs||[]).length)p.bodoOrgs=[{id:"k57bshnkdpahzs3fv4hvq6wz1s8aq2pm",name:"Bodo Solutions"},{id:"k5717wnvya5c7g26kr5jmgsx3x88edd1",name:"business//GmbH GmbH"}];
    if(!s.inhaber)p.inhaber="us-boris-hose";if(!s.inst)p.inst={n:"Organigraph business//acts"}}
  const R="„business//acts“, „Business Acts“, „BusinessActs“ u. ä. meint in Bodo den Mandanten business//GmbH GmbH (eindeutig, keine Annahme); „Bodo“ ohne Mandant meint Bodo Solutions",G=(m&&m.globals)||[];
  const upd={settings:p};if(alt&&!G.some(g=>g.includes("BusinessActs")))upd.globals=[...G,R];
  if(m)await Store.update("meta/config",upd);else await Store.set("meta/config",upd)}
// Archiv: nach 90 Tagen Kurzfassung in archiv/<Org>-<JJJJ-MM>, dann Auftrag samt Anhängen löschen
async function archivieren(){if(!neuSchema()||!await Store.lease("meta/archiv-lauf",120000))return 0;let n=0;
  const alt=await Store.list("jobs",{where:[["fertig","<",cutoffISO()]],limit:50});
  for(const j of alt){if(!isEnd(j))continue;const mon=j.fMon||String(j.fertig).slice(0,7),base="archiv/"+(j.org||"ohne")+"-"+mon;
    const kurz=plain({id:j.id,t:j.t||"",art:j.art||"",aid:j.aid||null,abt:j.abt||null,team:j.team||null,fertig:j.fertig,st:j.st,ok:j.ok||null,prj:j.prj||null,vb:vbArchiv(j),sum:j.sum||"",erg:(j.erg||[]).map(e=>({t:e.t||"",url:e.url||""}))});
    let k=base,a=null;for(let i=1;i<100;i++){k=base+(i>1?"-"+i:"");a=await Store.get(k);if(!a||(a.items||[]).some(x=>x.id===j.id)||JSON.stringify(a).length<200000)break}
    a=a||{org:j.org||null,mon,items:[]};if(!(a.items||[]).some(x=>x.id===j.id)){a.items=[...(a.items||[]),kurz];await Store.set(k,a)}
    const chk=await Store.get(k);if(!chk||!(chk.items||[]).some(x=>x.id===j.id))continue;
    for(const x of (j.anh||[]))for(let i=0;i<(x.n||0);i++)await Store.del("anhaenge/"+x.aid+"_"+i);
    await Store.del("jobs/"+j.id);n++}
  return n}
const OUT={depts:d=>d,users:u=>u,skills:s=>s,agents:a=>a,flows:f=>({...f,N:f.N.map(n=>{const {a,...r}=n;return {...r,aid:a?a.id:(r.aid??null)}})}),jobs:j=>{const {f,...r}=j;return {...r,fid:f?f.id:r.fid}},projects:p=>p};
function snapshot(){const m=new Map();[["users",US],["skills",SK],["agents",AG],["flows",FL],["jobs",AU],["depts",DP],["projects",PJ]].forEach(([c,arr])=>arr.forEach(o=>{if(!o.id)o.id=uid(c.slice(0,2));const k=c+"/"+o.id;
    if(EDIT&&EDIT.orig.has(k)){const v=EDIT.orig.get(k);if(v!==null)m.set(k,v);return}if(EDIT&&EDIT.newc&&EDIT.newc.includes(c))return;m.set(k,JSON.stringify(OUT[c](o)))}));
  if(EDIT)EDIT.orig.forEach((v,k)=>{if(v!==null&&k!=="meta/config"&&!m.has(k))m.set(k,v)}); // im Bearbeiten Gelöschtes erst beim Speichern löschen
  if(EDIT&&EDIT.orig.has("meta/config")){m.set("meta/config",EDIT.orig.get("meta/config"));return m}
  m.set("meta/config",JSON.stringify({groups:GR,globals:GLOBAL,settings:SET}));return m}
window.addEventListener("beforeunload",e=>{if(EDIT){e.preventDefault();e.returnValue=""}});
function setSave(s,t){const e=$("#save");e.className="tag"+(s==="ok"?" ok":s==="err"?" err":"");e.textContent=t}
function schedule(){if(!DB||RO)return;clearTimeout(tmr);tmr=setTimeout(flush,700)}
async function flush(){if(busy){again=true;return}busy=true;const cur=snapshot();let n=0;
  try{for(const [k,v] of cur)if(LAST.get(k)!==v){if(!n)setSave("","Speichert …");await Store.set(k,JSON.parse(v));LAST.set(k,v);n++}
      for(const k of [...LAST.keys()])if(!cur.has(k)){await Store.del(k);LAST.delete(k);n++}
      if(n)setSave("ok","Gespeichert")}
  catch(e){if(e&&e.code==="invalid_argument"&&!LAST.size){RO=true;setSave("err","Nur lesen")}else setSave("err",e&&e.code==="quota_exceeded"?"Speicher voll":"Nicht gespeichert – erneuter Versuch bei der nächsten Änderung")}
  busy=false;if(again){again=false;flush()}}
["input","change","click","pointerup","drop"].forEach(ev=>document.addEventListener(ev,()=>schedule()));
function hydrate(){FL.forEach(f=>f.N.forEach(n=>{if("aid" in n)n.a=AG.find(a=>a.id===n.aid)||null}));AU.forEach(j=>{j.f=FL.find(f=>f.id===j.fid)});
  NID=1+Math.max(0,...FL.flatMap(f=>f.N.map(n=>+(/^n(\d+)$/.exec(n.id)||[0,0])[1])))}
function emptyState(t,s){$("#lib").innerHTML=`<div class="empty"><b>${t}</b>${s}</div>`}
async function boot(){
  render();jobs();setSave("","Lädt …");try{hdr()}catch(e){}
  DB=window.claude?await window.claude.use("db"):null;
  if(!DB){RO=true;setSave("err","Speicher nicht verfügbar");emptyState("Speicher nicht verfügbar","Öffne das Cockpit angemeldet auf claude.ai, damit deine Daten geladen und gespeichert werden.");return}
  try{let umg=false;try{umg=await migrieren()}catch(e){console.warn("Umstellung auf Datenstand "+SCHEMA+" nicht möglich",e)}
    const m=await Store.get("meta/config");if(m&&m.settings)SET={...SET,...m.settings};
    const D=await Promise.all([Store.list("skills"),Store.list("agents"),Store.list("flows"),jobsLaden(),Store.list("users"),Store.list("depts"),Store.list("projects")]);
    [SK,AG,FL,AU,US,DP,PJ]=D;DP.sort((a,b)=>(a.ord??0)-(b.ord??0));US.sort((a,b)=>(a.ord??0)-(b.ord??0));if(m){const c=m;GR=[...(c.groups||[])];GLOBAL=[...(c.globals||[])];SET={...SET,...(c.settings||{})}}
    SK.sort((a,b)=>(a.ord??0)-(b.ord??0));AG.sort((a,b)=>(a.ord??0)-(b.ord??0));FL.sort((a,b)=>(a.ord??0)-(b.ord??0));AU.sort((a,b)=>(+b.id.slice(2)||0)-(+a.id.slice(2)||0));
    hydrate();const s0=snapshot();s0.forEach((v,k)=>LAST.set(k,v));if(migrateOrgs()){toast("Organisationen eingerichtet");schedule()}if(grMigrieren())schedule();if(nameMigrieren())schedule();[...GR,GR_OHNE].forEach(g=>COL.add(g.id));
    const f=agVis()[0];cur=f?f[1]:-1;fcur=FL.findIndex(x=>x.p===FF&&!x.frei);
    render();jobs();setSave("ok","Gespeichert");kiSubscribe();show("org");hdr();if(SET.inst&&SET.inst.n)document.title=SET.inst.n;if(umg)toast("Datenbestand auf Stand "+SCHEMA+" umgestellt");
    archivieren().then(n=>{if(n)toast(n+" alte Aufträge ins Archiv verschoben")}).catch(e=>console.warn("Archiv",e));
    if(!SK.length)emptyState("Noch keine Skills","Bitte Claude, die Startdaten einzuspielen – danach erscheinen hier deine Skills.");
  }catch(e){setSave("err","Laden fehlgeschlagen");emptyState("Laden fehlgeschlagen","Seite neu laden. Wenn es wieder passiert, Claude Bescheid geben.")}
}
