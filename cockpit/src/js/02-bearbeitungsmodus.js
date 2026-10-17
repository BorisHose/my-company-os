// ===== Bearbeitungsmodus: nichts ändert sich ohne ✎ → Speichern =====
let EDIT=null; // {kind,id,sec,orig:Map(schlüssel → JSON vor dem Bearbeiten | null = neu angelegt)}
let DP=[]; // Abteilungen (später Organigramm)
const COLL=()=>({users:US,skills:SK,agents:AG,flows:FL,depts:DP,projects:PJ});
function curJSON(k){if(k==="meta/config")return JSON.stringify({groups:GR,globals:GLOBAL,settings:SET});const [c,id]=k.split("/"),o=COLL()[c].find(x=>x.id===id);return o?JSON.stringify(OUT[c](o)):null}
const isEd=(kind,id,sec)=>!!EDIT&&EDIT.kind===kind&&(id==null||EDIT.id===id)&&(sec==null||EDIT.sec===sec);
function blocked(){if(!EDIT)return false;toast("Erst den Bereich in Bearbeitung speichern oder abbrechen");const el=document.querySelector(".editing");if(el)el.scrollIntoView({block:"nearest",behavior:"smooth"});return true}
function startEdit(kind,id,sec,keys,neu,newc){if(blocked())return false;const o=new Map();keys.forEach(k=>o.set(k,neu?null:curJSON(k)));EDIT={kind,id,sec,orig:o,newc:newc||[]};return true}