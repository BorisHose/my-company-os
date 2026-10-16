boot();
// Breitenregler Ablauf-Eigenschaften (rechts)
function bindPSplit(){const sp=$("#splitP"),g=$("#fgrid");if(!sp||!g)return;const MIN=290;
  const MAX=()=>Math.max(MIN,Math.min(820,g.getBoundingClientRect().width-320));
  const set=w=>{w=Math.round(Math.min(MAX(),Math.max(MIN,w)));g.style.setProperty("--pw",w+"px");UI.pw=w;sp.setAttribute("aria-valuenow",w)};
  const cur=()=>$("#props").getBoundingClientRect().width;
  if(UI.pw)set(UI.pw);
  sp.onpointerdown=e=>{e.preventDefault();sp.setPointerCapture(e.pointerId);sp.classList.add("drag");document.body.classList.add("resizing");const x0=e.clientX,w0=cur();
    sp.onpointermove=ev=>set(w0-(ev.clientX-x0));sp.onpointerup=()=>{sp.onpointermove=null;sp.classList.remove("drag");document.body.classList.remove("resizing");saveUI()}};
  sp.ondblclick=()=>{g.style.removeProperty("--pw");delete UI.pw;saveUI()};
  sp.onkeydown=e=>{if(e.key==="ArrowLeft"){set(cur()+20);saveUI();e.preventDefault()}if(e.key==="ArrowRight"){set(cur()-20);saveUI();e.preventDefault()}};
}
// Breitenregler Agentenliste
(function(){
  const sp=$("#split0"),main=$("#build"),MIN=170,MAX=460;
  const set=w=>{w=Math.round(Math.min(MAX,Math.max(MIN,w)));main.style.setProperty("--agw",w+"px");UI.agw=w;sp.setAttribute("aria-valuenow",w)};
  const cur=()=>$("#apanel").getBoundingClientRect().width;
  if(UI.agw)set(UI.agw);
  sp.onpointerdown=e=>{e.preventDefault();sp.setPointerCapture(e.pointerId);sp.classList.add("drag");document.body.classList.add("resizing");const x0=e.clientX,w0=cur();
    sp.onpointermove=ev=>set(w0+ev.clientX-x0);sp.onpointerup=()=>{sp.onpointermove=null;sp.classList.remove("drag");document.body.classList.remove("resizing");saveUI()}};
  sp.ondblclick=()=>{main.style.removeProperty("--agw");delete UI.agw;saveUI()};
  sp.onkeydown=e=>{if(e.key==="ArrowLeft"){set(cur()-20);saveUI();e.preventDefault()}if(e.key==="ArrowRight"){set(cur()+20);saveUI();e.preventDefault()}};
})();
setLib(false);