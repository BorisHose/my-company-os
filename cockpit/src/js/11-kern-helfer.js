// aus Boris' gespeicherten Vorgaben (gekürzt)
let GLOBAL=[],SET={autoApprove:true};
let AG=[];
let cur=0,renaming=-1;
const $=s=>document.querySelector(s),esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const sk=id=>SK.find(s=>s.id===id),use=id=>AG.filter(a=>a.s.includes(id)).length;
function toast(t){document.querySelectorAll(".toast").forEach(x=>x.remove());const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

let SKSEL=null,SKORG="",SKSRC="";
const SRCS=[["","Alle"],["konto","Konto"],["plugin","Plugin"],["anthropic","Anthropic"],["entwurf","Entwurf"],["vorschlag","Vorschlag"]];
const skOrgOk=(s,o)=>{if(!o)return true;o=typeof o==="string"?orgById(o):o;return !o||!o.prod||s.p===o.prod||s.p==="all"||s.p==="multi"};
const fzNorm=t=>String(t||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss");
function fzHit(hay,q){q=fzNorm(q).trim();if(!q)return true;const H=fzNorm(hay),H2=H.replace(/[\s\-_/·.,:;()„“"']+/g,"");
  return q.split(/\s+/).every(w=>{if(H.includes(w)||H2.includes(w))return true;if(w.length<6)return false;
    for(let i=3;i<=w.length-3;i++){if(H.includes(w.slice(0,i))&&H.includes(w.slice(i)))return true}return false})}
const skMatch=(s,q)=>!q||fzHit([s.id,s.n,s.d,grName(s.g),...KS(s)].join(" "),q);
const skVis=s=>skOrgOk(s,SKORG)&&(!SKSRC||srcOf(s)===SKSRC)&&(AFIL==="ohne"?!use(s.id):AFIL==="used"?use(s.id)>0:true);