// ===== Speicher (db) =====
let DB=null,RO=false;const LAST=new Map();let tmr=null,busy=false,again=false;
const OUT={depts:d=>d,users:u=>u,skills:s=>s,agents:a=>a,flows:f=>({...f,N:f.N.map(n=>{const {a,...r}=n;return {...r,aid:a?a.id:(r.aid??null)}})}),jobs:j=>{const {f,...r}=j;return {...r,fid:f?f.id:r.fid}}};
function snapshot(){const m=new Map();[["users",US],["skills",SK],["agents",AG],["flows",FL],["jobs",AU],["depts",DP]].forEach(([c,arr])=>arr.forEach(o=>{if(!o.id)o.id=uid(c.slice(0,2));const k=c+"/"+o.id;
    if(EDIT&&EDIT.orig.has(k)){const v=EDIT.orig.get(k);if(v!==null)m.set(k,v);return}if(EDIT&&EDIT.newc&&EDIT.newc.includes(c))return;m.set(k,JSON.stringify(OUT[c](o)))}));
  if(EDIT)EDIT.orig.forEach((v,k)=>{if(v!==null&&k!=="meta/config"&&!m.has(k))m.set(k,v)}); // im Bearbeiten Gelöschtes erst beim Speichern löschen
  if(EDIT&&EDIT.orig.has("meta/config")){m.set("meta/config",EDIT.orig.get("meta/config"));return m}
  m.set("meta/config",JSON.stringify({groups:GR,globals:GLOBAL,settings:SET}));return m}
window.addEventListener("beforeunload",e=>{if(EDIT){e.preventDefault();e.returnValue=""}});
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
  try{const [m,...cs]=await Promise.all([DB.doc("meta/config").get(),...["skills","agents","flows","jobs","users","depts"].map(c=>DB.collection(c).limit(1000).get())]);
    const D=cs.map(q=>q.docs.map(d=>JSON.parse(JSON.stringify(d.data()))));
    [SK,AG,FL,AU,US,DP]=D;DP.sort((a,b)=>(a.ord??0)-(b.ord??0));US.sort((a,b)=>(a.ord??0)-(b.ord??0));if(m.exists){const c=m.data();GR=[...(c.groups||[])];GLOBAL=[...(c.globals||[])];SET={...SET,...(c.settings||{})}}
    SK.sort((a,b)=>(a.ord??0)-(b.ord??0));AG.sort((a,b)=>(a.ord??0)-(b.ord??0));FL.sort((a,b)=>(a.ord??0)-(b.ord??0));AU.sort((a,b)=>(+b.id.slice(2)||0)-(+a.id.slice(2)||0));
    hydrate();GR.forEach((g,i)=>COL.add(i));const s0=snapshot();s0.forEach((v,k)=>LAST.set(k,v));if(migrateOrgs()){toast("Organisationen eingerichtet");schedule()}
    const f=agVis()[0];cur=f?f[1]:-1;fcur=FL.findIndex(x=>x.p===FF&&!x.frei);
    render();jobs();setSave("ok","Gespeichert");kiSubscribe();show("org");
    if(!SK.length)emptyState("Noch keine Skills","Bitte Claude, die Startdaten einzuspielen – danach erscheinen hier deine Skills.");
  }catch(e){setSave("err","Laden fehlgeschlagen");emptyState("Laden fehlgeschlagen","Seite neu laden. Wenn es wieder passiert, Claude Bescheid geben.")}
}
