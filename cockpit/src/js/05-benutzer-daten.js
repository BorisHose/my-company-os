// ===== Benutzer (Menschen) =====
let US=[],ucur=-1,UOLD=false;
const usr=id=>US.find(u=>u.id===id);
const ini=n=>String(n||"?").replace(/^(Dr\.|Prof\.)\s*/,"").split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join("").toUpperCase()||"?";
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
function av(u,size,agent){const z=size||32,fs=Math.round(z*.38),k=agent?`<span class="kib" title="KI-Agent">KI</span>`:"";
  if(!u)return `<span class="av none" style="width:${z}px;height:${z}px" title="Verantwortlich: offen"><svg viewBox="0 0 24 24" width="${Math.round(z*.6)}" height="${Math.round(z*.6)}" fill="currentColor"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c.8-4.4 4.3-7 8.5-7s7.7 2.6 8.5 7z"/></svg>${k}</span>`;
  const inner=u.img?`<img src="${u.img}" alt="">`:`<span class="in" style="background:hsl(${hue(u.id)},45%,42%);font-size:${fs}px">${esc(u.kz||ini(u.n))}</span>`;
  return `<span class="av" style="width:${z}px;height:${z}px" title="${esc(u.n)}">${inner}${k}</span>`}