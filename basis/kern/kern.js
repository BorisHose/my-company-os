/* ===== Company OS · Kern (Entwurf v2) =====
   Allgemeiner Rahmen und Seitentypen. Enthält keine Kundendaten.
   Eine Ableitung ruft K.start(cfg) mit Mandant, Menü, Tagesleiste, Ansichten und KI-Assistent auf. */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const K={st:{v:null,id:null,tab:{},q:""},cfg:null,
 /* ---------- Bausteine ---------- */
 chip:(t,tone="",dot=false)=>`<span class="k-chip ${tone}">${dot?'<span class="d"></span>':""}${t}</span>`,
 btn:(t,attr="",p=false,sm=false)=>`<button class="k-btn${p?" p":""}${sm?" sm":""}" ${attr}>${t}</button>`,
 kv:rows=>`<div class="k-kv">${rows.map(([k,v])=>`<span class="k">${k}</span><span>${v}</span>`).join("")}</div>`,
 person:(ini,n,role="")=>`<div class="k-pp"><span class="k-pa">${esc(ini)}</span>${esc(n)}${role?`<span class="k-role">${esc(role)}</span>`:""}</div>`,
 agent:(n,role="")=>`<div class="k-pp"><span class="k-ag" aria-hidden="true">✦</span>${esc(n)}${role?`<span class="k-role">${esc(role)}</span>`:""}</div>`,
 go:(v,id)=>`data-go="${v}${id!=null?"|"+id:""}"`,
 ini:n=>String(n).split(/[\s·]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase(),
 table(cols,rows,{rowGo,empty="Keine Einträge."}={}){
  if(!rows.length)return `<div class="k-sb k-note">${empty}</div>`;
  return `<div class="k-tw"><table class="k-t"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map((r,i)=>{const g=rowGo&&rowGo(i);return `<tr ${g?`class="k-row" ${g}`:""}>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`}).join("")}</tbody></table></div>`},
 tabs(view,items){const cur=K.st.tab[view]??items[0][0];return `<div class="k-tabs" role="tablist">${items.map(([k,l,n])=>`<button class="k-tab" role="tab" aria-selected="${k===cur}" data-tab="${view}|${k}">${l}${n!=null?` <small>${n}</small>`:""}</button>`).join("")}</div>`},
 tab:(view,def)=>K.st.tab[view]??def,
 timeline:items=>items.map(([st,sym,html,tm])=>`<div class="k-tli"><span class="k-st ${st}">${sym}</span><div>${html}</div>${tm?`<span class="tm">${tm}</span>`:""}</div>`).join(""),
 /* ---------- Seitentypen ---------- */
 pageHead:(title,{chips=[],actions=""}={})=>`<div class="k-card k-ph"><h1>${title}</h1>${chips.join("")}<span class="k-sp"></span>${actions}</div>`,
 dash({hello,sub,stand,groups}){return `<div class="k-card k-hello"><div><h1>${hello}</h1><div class="k-note">${sub}</div></div><span class="k-sp"></span><span class="k-lbl">${stand}</span></div>
  ${groups.map(g=>`<div class="k-sect">${g.t}<span>${g.s||""}</span></div><div class="k-tiles">${g.tiles.map(t=>`<button class="k-card k-tile" style="--c:${t.c||"var(--brand)"}" ${t.go||""}><h3>${t.t}<small>${t.k||""}</small></h3>${t.kp?`<div class="kp">${t.kp.map(([n,l])=>`<div><span class="big">${n}</span><span class="k-lbl">${l}</span></div>`).join("")}</div>`:`<span class="big">${t.n}</span>`}<span class="k-note">${t.d||""}</span></button>`).join("")}</div>`).join("")}`},
 list({title,chips=[],actions="",view,tabs,tools="",cols,rows,rowGo,note,count}){
  return `${K.pageHead(title,{chips,actions})}${tabs?K.tabs(view,tabs):""}<div class="k-card"><div class="k-lh"><b>${count??rows.length} ${esc(title.replace(/^Übersicht\s*/,""))}</b>${tools}</div>${K.table(cols,rows,{rowGo})}<div class="k-pg"><span>1–${rows.length} von ${count??rows.length}</span><span>${note||""}</span></div></div>`},
 detail({title,num,chips=[],actions="",cards=[],sections=[],empty=[]}){
  const S=sections.filter(s=>!s.hide);
  return `<div class="k-card k-ph"><h1>${title}</h1>${num?`<span class="k-num">· ${num}</span>`:""}${chips.join("")}<span class="k-sp"></span>${actions}</div>
  ${cards.length?`<div class="k-sum">${cards.map(c=>`<div class="k-card k-sc"><h2>${c.t}${c.r?`<span>${c.r}</span>`:""}</h2>${c.b}</div>`).join("")}</div>`:""}
  <nav class="k-jump" aria-label="Sprungmarken">${S.map((s,i)=>`<button class="k-jm" data-jump="${s.id}" aria-current="${i===0}">${s.t}${s.n!=null?` <small>${s.n}</small>`:""}</button>`).join("")}${empty.length?`<span class="k-vs"></span><button class="k-jm off" data-empty="${esc(empty.join("|"))}">Ohne Einträge <small>${empty.length}</small></button>`:""}<span class="k-sp"></span><button class="k-jm" data-toast="Reihenfolge der Bereiche anpassen (Prototyp)" title="Bereiche anordnen">⇅</button></nav>
  ${S.map(s=>`<section class="k-card k-sec" id="sec-${s.id}"><div class="k-sh"><h3>${s.t}</h3>${s.n!=null?`<span class="c">${s.n}</span>`:""}<span class="k-sp"></span>${s.a||""}</div><div class="k-sb ${s.flush?"flush":""}">${s.b}</div></section>`).join("")}`},
 inbox({head,tabs,list,detail}){return `${head}${tabs||""}<div class="k-split"><div class="k-card k-pane" aria-label="Liste">${list}</div><div class="k-card k-pane" aria-label="Detail"><div class="scroll" id="k-det">${detail}</div></div></div>`},
 /* ---------- Rahmen ---------- */
 shell(){const c=K.cfg,m=c.mandant;
  /* nur in den eigenen Container schreiben – Stile und Skripte der Seite bleiben erhalten */
  const root=document.getElementById("k-root")||document.body.appendChild(Object.assign(document.createElement("div"),{id:"k-root"}));
  root.innerHTML=`<div class="k-app"><aside class="k-side" id="k-side">${K.wsHtml()}
   <button class="k-fi" id="k-find"><span>⌕&nbsp; Finden…</span><span class="k-kb">Strg F</span></button><button class="k-neu" id="k-new"><span>＋&nbsp; ${esc(c.neu||"Neu")}</span><span class="k-kb">N</span></button>
   <nav id="k-nav" aria-label="Menü"></nav><div class="k-foot"><span>${esc(c.fuss||"")}</span><span>⇅ Menü anordnen</span></div></aside>
   <div class="k-main"><div class="k-top"><button class="k-ib k-menu" id="k-menu" aria-label="Menü">☰</button><span id="k-tl"></span><span class="sp"></span><button class="k-ib wide" data-hist="-1" aria-label="Zurück">‹</button><button class="k-ki" id="k-kibtn">✦ KI-Assistent</button><button class="k-ib" data-toast="Benachrichtigungen (Prototyp)" aria-label="Benachrichtigungen">🔔</button><button class="k-av" aria-label="Profil" ${K.go("profil")}>${esc(m.user)}</button></div>
   <main class="k-page" id="k-page"></main></div></div>
   <div id="k-modal"></div><div class="k-toast" id="k-toast" hidden></div>
   <section class="k-card k-chat" id="k-chat" hidden><header><b>✦ KI-Assistent</b><span id="k-chatm">${K.chip(esc(m.name))}</span><span class="k-sp"></span><button class="k-ib" id="k-chatx" aria-label="Schließen">×</button></header><div class="k-msgs" id="k-msgs"></div><div class="k-chips" id="k-chips"></div><form class="k-comp" id="k-comp"><input id="k-in" placeholder="Frage oder Auftrag …" aria-label="Nachricht"><button class="k-btn p">Senden</button></form></section>
   ${c.badge?`<div class="k-badge">${c.badge}</div>`:""}`;
  document.documentElement.style.setProperty("--brand",m.brand||m.farbe)},
 /* Mandant: ein fester (cfg.mandant) oder umschaltbar (cfg.mandanten = {schlüssel:{…}}, Start mit cfg.mstart) */
 wsHtml(){const m=K.cfg.mandant,sw=!!K.cfg.mandanten;const inner=`<div class="k-wsl" style="background:${m.farbe}">${esc(m.ini)}</div><div><b>${esc(m.name)}</b><small>${esc(m.rolle)}</small></div>`;
  return sw?`<button class="k-ws sw" id="k-ws" aria-haspopup="true" title="Unternehmen wechseln">${inner}<span class="car">▾</span></button>`:`<div class="k-ws">${inner}</div>`},
 setM(k){const c=K.cfg;if(!c.mandanten||!c.mandanten[k])return;K.st.m=k;c.mandant=c.mandanten[k];const w=$("#k-side .k-ws");if(w)w.outerHTML=K.wsHtml();
  $("#k-chatm").innerHTML=K.chip(esc(c.mandant.name));document.documentElement.style.setProperty("--brand",c.mandant.brand||c.mandant.farbe);K.st.tab={};
  const v=c.views[K.st.v]&&!K.st.id?K.st.v:c.start;K.hist=[];K.st.v=v;K.st.id=null;K.render();$("#k-page").scrollTop=0;if(c.onMandant)c.onMandant(k)},
 nav(){const c=K.cfg;$("#k-nav").innerHTML=c.menu.map(g=>`<div class="k-grp">${g.t}</div>${g.items.map(it=>{const n=it.n?it.n():null;const cur=it.v===K.st.v||(it.also||[]).includes(K.st.v);return `<button class="k-ni" ${K.go(it.v)} aria-current="${cur}"><span class="i">${it.i}</span>${it.l}${n?`<span class="n ${it.g?"g":""}">${n}</span>`:""}</button>`}).join("")}`).join("");
  $("#k-tl").innerHTML=c.tagesleiste()},
 hist:[],
 open(v,id,{keep=false}={}){if(!keep&&K.st.v)K.hist.push([K.st.v,K.st.id]);K.st.v=v;K.st.id=id??null;K.render();if(!keep)$("#k-page").scrollTop=0;$("#k-side").classList.remove("open")},
 render(){const c=K.cfg,f=c.views[K.st.v]||c.views[c.start];const r=f(K.st.id);const pg=$("#k-page");pg.classList.toggle("fix",!!(r&&r.fix));pg.innerHTML=typeof r==="string"?r:r.html;K.nav();K.spy();if(r&&r.after)r.after()},
 refresh(){const pg=$("#k-page"),s=pg.scrollTop,d=$("#k-det"),ds=d?d.scrollTop:0,l=document.querySelector(".k-pane .scroll"),ls=l?l.scrollTop:0;K.render();pg.scrollTop=s;const d2=$("#k-det");if(d2)d2.scrollTop=ds;const l2=document.querySelector(".k-pane .scroll");if(l2)l2.scrollTop=ls},
 spy(){const pg=$("#k-page"),secs=[...pg.querySelectorAll(".k-sec")];if(!secs.length)return;
  const upd=()=>{let cur=secs[0].id;const top=pg.getBoundingClientRect().top+80;secs.forEach(s=>{if(s.getBoundingClientRect().top<=top)cur=s.id});pg.querySelectorAll(".k-jm[data-jump]").forEach(b=>b.setAttribute("aria-current","sec-"+b.dataset.jump===cur))};
  pg.onscroll=upd;upd()},
 toast(t){const e=$("#k-toast");e.textContent=t;e.hidden=false;clearTimeout(K.toast.t);K.toast.t=setTimeout(()=>e.hidden=true,2800)},
 modal(html){$("#k-modal").innerHTML=html?`<div class="k-modal" data-mclose><div class="k-card" role="dialog" aria-modal="true">${html}</div></div>`:""},
 pop(anchor,html){K.closePop();const r=anchor.getBoundingClientRect();const p=document.createElement("div");p.className="k-pop";p.id="k-pop";p.innerHTML=html;document.body.appendChild(p);p.style.top=(r.bottom+6)+"px";p.style.left=Math.max(8,Math.min(innerWidth-290,r.left))+"px"},
 closePop(){const p=$("#k-pop");if(p)p.remove()},
 /* ---------- KI-Assistent ---------- */
 chat(open){const c=$("#k-chat");c.hidden=!open;if(open&&!$("#k-msgs").innerHTML){K.ai(K.cfg.ki.hallo)}$("#k-chips").innerHTML=Object.keys(K.cfg.ki.script).map(k=>`<button data-ask="${esc(k)}">${esc(k)}</button>`).join("")},
 me(t){$("#k-msgs").insertAdjacentHTML("beforeend",`<div class="k-msg me">${esc(t)}</div>`)},
 ai(h){$("#k-msgs").insertAdjacentHTML("beforeend",`<div class="k-msg ai">${h}</div>`);$("#k-msgs").scrollTop=1e6},
 ask(t){K.me(t);setTimeout(()=>K.ai(K.cfg.ki.script[t]||K.cfg.ki.sonst),300)},
 /* ---------- Finden ---------- */
 find(){K.modal(`<h2 style="margin:0;font-size:16px">Finden</h2><input class="k-search" id="k-fq" placeholder="Name, Nummer, Begriff …" autofocus><div id="k-fr"></div>`);const i=$("#k-fq");const run=()=>{const q=i.value.trim().toLowerCase();const R=q?K.cfg.suche().filter(x=>x[0].toLowerCase().includes(q)).slice(0,12):[];$("#k-fr").innerHTML=R.map(([n,typ,go])=>`<button class="k-mi" ${go}><span>${esc(n)}</span><span class="k-lbl">${typ}</span></button>`).join("")||`<div class="k-note">${q?"Nichts gefunden.":"Suchbegriff eingeben."}</div>`};i.addEventListener("input",run);run();setTimeout(()=>i.focus(),50)},
 /* ---------- Start und Ereignisse ---------- */
 start(cfg){K.cfg=cfg;if(cfg.mandanten){K.st.m=cfg.mstart||Object.keys(cfg.mandanten)[0];cfg.mandant=cfg.mandanten[K.st.m]}K.shell();K.st.v=cfg.start;K.render();
  document.addEventListener("click",e=>{const b=e.target.closest("button,[data-go],[data-mclose]");if(!b){K.closePop();return}const d=b.dataset;
   if(d.mclose!==undefined){if(e.target===b)K.modal("");return}
   if(!b.closest("#k-pop")&&!d.empty)K.closePop();
   if(cfg.onClick&&cfg.onClick(b,d,e)===true)return;
   if(d.go){const [v,id]=d.go.split("|");K.modal("");K.closePop();if(innerWidth<900)K.chat(false);K.open(v,id);return}
   if(d.tab){const [v,k]=d.tab.split("|");K.st.tab[v]=k;K.refresh();return}
   if(d.jump){const s=$("#sec-"+d.jump);if(s)s.scrollIntoView({behavior:"smooth",block:"start"});return}
   if(d.empty){K.pop(b,`<b style="padding:4px 8px">Bereiche ohne Einträge</b>${d.empty.split("|").map(n=>`<button class="k-mi" data-toast="Bereich „${esc(n)}“ hinzugefügt – direkt zur Eingabe (Prototyp)"><span>${esc(n)}</span><span>＋</span></button>`).join("")}<div class="k-note" style="padding:4px 8px">Bereich anklicken: wird zur Ansicht hinzugefügt.</div>`);return}
   if(d.mand){K.closePop();K.setM(d.mand);return}
   if(b.id==="k-ws"){const M=cfg.mandanten;K.pop(b,`<b style="padding:4px 8px">Unternehmen wechseln</b>${Object.keys(M).map(k=>`<button class="k-mi" data-mand="${k}" aria-current="${k===K.st.m}"><span style="display:flex;gap:8px;align-items:center"><span class="k-wsl sm" style="background:${M[k].farbe}">${esc(M[k].ini)}</span>${esc(M[k].name)}</span><span class="k-lbl">${esc(M[k].kurz||"")}</span></button>`).join("")}`);return}
   if(d.toast){K.toast(d.toast);return}
   if(d.ask){K.ask(d.ask);return}
   if(d.hist){const h=K.hist.pop();if(h){K.st.v=h[0];K.st.id=h[1];K.render()}return}
   if(b.id==="k-find"){K.find();return}
   if(b.id==="k-new"){cfg.neu&&cfg.onNeu?cfg.onNeu():K.toast("Neu (Prototyp)");return}
   if(b.id==="k-kibtn"){K.chat($("#k-chat").hidden);return}
   if(b.id==="k-chatx"){K.chat(false);return}
   if(b.id==="k-menu"){$("#k-side").classList.toggle("open");return}
  });
  document.addEventListener("keydown",e=>{const tag=(e.target.tagName||"");if(e.key==="Escape"){K.modal("");K.closePop();$("#k-side").classList.remove("open");return}
   if(/INPUT|TEXTAREA/.test(tag))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="f"){e.preventDefault();K.find()}else if(e.key.toLowerCase()==="n"&&!e.ctrlKey&&!e.metaKey&&cfg.onNeu){cfg.onNeu()}});
  $("#k-comp").addEventListener("submit",e=>{e.preventDefault();const v=$("#k-in").value.trim();if(!v)return;$("#k-in").value="";K.ask(v)});
 }
};
