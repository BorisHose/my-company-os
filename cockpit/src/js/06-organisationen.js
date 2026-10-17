// ===== Organisationen (Unternehmen) – je eigenes Organigramm =====
const DEFORGS=[{id:"og-1",n:"Meine Organisation",kurz:"Meine Organisation",prod:"",gf:null,desc:""}]; // Startwert einer neuen Instanz; echte Organisationen stehen in den Einstellungen
const ORGS=()=>{if(!Array.isArray(SET.orgs)||!SET.orgs.length)SET.orgs=JSON.parse(JSON.stringify(DEFORGS));return SET.orgs};
const orgById=id=>ORGS().find(o=>o.id===id);
const inOrg=(a,o)=>{if(typeof o==="string")o=orgById(o);return !!o&&(a.p==="all"||o.prod===a.p)};
const agOrgs=a=>ORGS().filter(o=>inOrg(a,o));
const teamsOf=d=>d&&Array.isArray(d.teams)?d.teams:[];const dept=id=>DP.find(d=>d.id===id);
const deptsOf=o=>DP.filter(d=>d.org===o);
const PL=(a,o)=>(a.pl&&a.pl[o])||{};
const teamOf=(a,o)=>teamsOf(dept(PL(a,o).abt)).find(t=>t.id===PL(a,o).team)||null;
const moveAg=(a,o,abt,team)=>{a.pl={...(a.pl||{})};const d=abt&&dept(abt);if(d){o=d.org;a.pl[o]=team&&teamsOf(d).some(t=>t.id===team)?{abt,team}:{abt}}else delete a.pl[o]};
const placeTxt=a=>agOrgs(a).map(o=>{const d=dept(PL(a,o.id).abt),t=teamOf(a,o.id);return d?(agOrgs(a).length>1?o.kurz+": ":"")+d.n+(t?" / "+t.n:""):""}).filter(Boolean).join(" · ");
function migrateOrgs(){if(SET.orgMig)return false;SET.orgMig=1;ORGS();const map={};
  DP.filter(d=>!d.org).forEach(d=>{d.org="og-bodo";const c=JSON.parse(JSON.stringify(d));c.id=d.id+"-ba";c.org="og-ba";const tm={};c.teams=teamsOf(d).map(t=>{const n={...t,id:t.id+"-ba"};tm[t.id]=n.id;return n});if(!c.teams.length)delete c.teams;map[d.id]={id:c.id,tm};DP.push(c)});
  AG.forEach(a=>{if(a.pl)return;a.pl={};agOrgs(a).forEach(o=>{if(!a.abt)return;if(o.id==="og-bodo")a.pl[o.id]=a.team?{abt:a.abt,team:a.team}:{abt:a.abt};else if(map[a.abt]){const t=a.team&&map[a.abt].tm[a.team];a.pl[o.id]=t?{abt:map[a.abt].id,team:t}:{abt:map[a.abt].id}}});delete a.abt;delete a.team});
  US.forEach(u=>{if(u.orgs)return;const s=new Set();(u.maps||[]).forEach(m=>{const i=(m.inst||"").toLowerCase();if(i.includes("bodo solutions"))s.add("og-bodo");if(i.includes("business"))s.add("og-ba")});u.orgs=[...s]});
  return true}
const usersSel=(id,val,leer)=>`<select id="${id}"><option value="">${leer}</option>${US.filter(u=>u.aktiv!==false||u.id===val).map(u=>`<option value="${u.id}" ${u.id===val?'selected':''}>${esc(u.n)}${u.aktiv===false?' (ausgeschieden)':''}</option>`).join("")}</select>`;
function shrink(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const S=160,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d"),m=Math.min(im.width,im.height);
  x.drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,S,S);res(c.toDataURL("image/jpeg",.85))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}