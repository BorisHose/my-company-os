let GR=[];
const COL=new Set();
let PF="bodo",AF="bodo",GEN=false;
const PK=[["bodo","Bodo"],["sellify","sellify"],["all","Andere"]];
const PN={bodo:"Bodo",sellify:"sellify",all:"Andere",multi:"Bodo + sellify"};
const VER="__VERSION__";
// Produktbereiche: fest im Programm hinterlegt (Entscheidung Boris 09.10.2026), keine Konfiguration in der Datenbank
const PT={bodo:"Produktbereich Bodo (Bodo Solutions, Mitgliederverwaltung) – alles, was für Bodo-Kunden und das Bodo-System gebraucht wird. Fest im Programm hinterlegt.",sellify:"Produktbereich sellify (business//acts, CRM-Plattform) – alles, was für sellify-Kunden und das sellify-System gebraucht wird. Fest im Programm hinterlegt.",all:"Andere = produktunabhängig, z. B. Web-QA, E-Mail, Word/PDF. Fest im Programm hinterlegt."};
let AFIL="all";
const vis0=s=>s.p===PF||(s.p==="multi"&&PF!=="all")||(GEN&&PF!=="all"&&s.p==="all");
const curA=()=>{const a=AG[cur];return a&&a.p===AF?a:null};
const vis=s=>{if(AFIL==="agent"){const a=curA();return !!a&&a.s.includes(s.id)}return vis0(s)&&(AFIL!=="ohne"||!use(s.id))};
// Herkunft und echte Konto-Skills
const SRC={konto:"Konto",plugin:"Plugin",anthropic:"Anthropic",vorschlag:"Vorschlag",entwurf:"Entwurf"};
const SRCT={konto:"Echter Skill in deinem Konto",plugin:"Skill aus einem installierten Plugin",anthropic:"Standard-Skill von Anthropic",vorschlag:"Gibt es nur im Cockpit – im Konto noch getrennte Skills",entwurf:"Im Cockpit angelegt – wird beim nächsten Abgleich von Claude als echter Skill vorgeschlagen"};
// Anbieter (Konnektoren) – Claude zuerst, weitere später umschaltbar
const PROV=[["claude","Claude",true],["chatgpt","ChatGPT",false]];const provName=k=>(PROV.find(x=>x[0]===k)||[k,k])[1];
const srcOf=s=>s.src||(s.std?"anthropic":"konto");
const KS=s=>{if(Array.isArray(s.ks)&&s.ks.length)return s.ks;if(typeof s.ks==="string"&&s.ks)return [s.ks];if(s.orig&&Object.keys(s.orig).length)return Object.keys(s.orig);return ["vorschlag","entwurf"].includes(srcOf(s))?[]:[s.id]};
const srcBadge=s=>{const k=srcOf(s);return `<span class="srcb ${k}" title="${SRCT[k]||""}">${SRC[k]||k}</span>`};
const ksLine=s=>{const L=KS(s),k=srcOf(s);if(!L.length)return `<div class="ks">Im Konto: noch kein Skill</div>`;return `<div class="ks">${k==="vorschlag"?"Fasst zusammen":k==="plugin"?"Im Plugin":"Im Konto"}: ${L.map(x=>`<code>${esc(x)}</code>`).join(" + ")}</div>`};
const isNeu=s=>s.neu||(s.prof&&Object.values(s.prof).some(x=>x.neu));
const allLp=s=>s.lp.length+(s.prof?Object.values(s.prof).reduce((n,x)=>n+x.lp.length,0):0);
const profOf=(a,s)=>s.p!=="multi"?"":a.p==="all"?"Profil per Rückfrage":PN[a.p]+"-Profil";
const agVis=()=>AG.map((a,i)=>[a,i]).filter(([a])=>a.p===AF);
const bad=(a,s)=>a.p!=="all"&&s.p!=="all"&&s.p!=="multi"&&s.p!==a.p;
let SK=[];