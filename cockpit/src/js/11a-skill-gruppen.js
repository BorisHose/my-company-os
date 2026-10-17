// ===== Skill-Gruppen =====
// meta/config.groups = [{id, n}] in Anzeigereihenfolge; jeder Skill verweist mit s.g auf die Gruppen-Id ("" = ohne Gruppe).
// Feste Ids statt Listenposition: Umbenennen, Umsortieren und Entfernen einer Gruppe verschiebt keinen Skill in eine falsche Gruppe.
// Ältere Daten (groups als Namen, s.g als Position) stellt grMigrieren() beim Laden einmalig um.
const GR_OHNE={id:"",n:"Ohne Gruppe"};
const grSlug=n=>"gr-"+(String(n).toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"gruppe");
function grNeuId(n){const b=grSlug(n);let id=b,i=2;while(GR.some(g=>g.id===id))id=b+"-"+i++;return id}
const grById=id=>GR.find(g=>g.id===id)||null;
const grIdx=id=>{const i=GR.findIndex(g=>g.id===id);return i<0?GR.length:i};
const grName=id=>(grById(id)||GR_OHNE).n;
// Gruppen mit ihren Skills aus L in Anzeigereihenfolge; „Ohne Gruppe“ am Ende, wenn sie Skills hat
const grMitSkills=L=>[...GR,GR_OHNE].map(g=>({g,S:L.filter(s=>(grById(s.g)?s.g:"")===g.id)})).filter(x=>x.S.length);
// Gruppe anlegen (Name muss neu sein); liefert die Gruppe oder null
function grAnlegen(n){n=String(n||"").trim();if(!n)return null;if(GR.some(g=>g.n.toLowerCase()===n.toLowerCase())){toast("Diese Gruppe gibt es schon");return null}const g={id:grNeuId(n),n};GR.push(g);return g}
// Verweis eines Skills auf eine Gruppe deuten: Id, ältere Listenposition oder Gruppenname
function grIdVon(g,alt){if(g==null||g==="")return "";if(GR.some(x=>x.id===g))return g;
  if(typeof g==="number"||/^\d+$/.test(String(g))){const x=(alt||GR)[+g];return x?(typeof x==="string"?(GR.find(y=>y.n===x)||{}).id||"":x.id):""}
  const m=GR.find(x=>x.n.toLowerCase()===String(g).toLowerCase());return m?m.id:""}
function grMigrieren(){let ch=false;const alt=GR.slice();
  if(GR.some(g=>typeof g==="string"||!g||!g.id)){const neu=[];GR=neu;alt.forEach(g=>{const n=typeof g==="string"?g:(g&&g.n)||"Gruppe";neu.push({id:grNeuId(n),n})});ch=true}
  SK.forEach(s=>{const id=grIdVon(s.g,alt);if(id!==s.g){s.g=id;ch=true}});return ch}
// <option>-Liste der Gruppen für Auswahlfelder
const grOpts=(cur,ohne)=>(ohne?`<option value="">${esc(GR_OHNE.n)}</option>`:"")+GR.map(g=>`<option value="${esc(g.id)}" ${g.id===cur?"selected":""}>${esc(g.n)}</option>`).join("");
