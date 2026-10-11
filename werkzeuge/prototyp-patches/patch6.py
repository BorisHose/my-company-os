import sys
p='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/ai-head-office-prototyp.html'
s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    if a not in s: sys.exit('MISSING '+a[:90])
    s=s.replace(a,b,1)
rep('["proc","↝","Prozesse & Projekte"]','["proj","▦","Projekte"],["proc","↝","Prozesse"]')
rep('projTab:"mine",','projTab:"mine",pjTab:"list",')
rep('proc:vProc,jobs:vJobs','proj:vProjArea,proc:vProc,jobs:vJobs')
# process area
rep('const T=[["mine","Meine Prozesse"],["tpl","Vorlagen"],["sug","Vorschläge"],["des","Designer"],["proj","Projekte"]];\n  const body=t==="tpl"?vTpl():t==="sug"?vSug():t==="des"?vDes():t==="proj"?vProj():vMine();',
    'const T=[["mine","Meine Prozesse"],["tpl","Prozessvorlagen"],["sug","Vorschläge"],["des","Prozess-Designer"]];\n  state.desMode="proc";\n  const body=t==="tpl"?vTpl():t==="sug"?vSug():t==="des"?vDes():vMine();')
rep('function vMine(){','''function vProjArea(){
  const t=state.pjTab;const T=[["list","Projekte"],["tpl","Projektvorlagen"],["des","Projekt-Designer"]];
  if(t==="des")state.desMode="proj";
  const body=t==="tpl"?vProjTpl():t==="des"?vDes():vProj();
  return `<div class="stack"><div class="tabs" role="tablist">${T.map(([k,l])=>`<button role="tab" aria-selected="${t===k}" data-pjtab="${k}">${l}</button>`).join("")}</div>${body}</div>`;
}
function vProjTpl(){
  const L=TPL.map((t,i)=>[t,i]).filter(([t])=>t.proj);
  return `<div class="card"><h2>Projektvorlagen</h2><div class="sub">Ein Projekt hat ein Ziel und ein Ende. Vorlagen legen fest, ob es in Phasen mit Meilensteinen läuft oder in Aufgabenpaketen ohne feste Reihenfolge, und welche Prozesse in den Phasen genutzt werden. Beim Start wird das Projekt im angeschlossenen System (Bodo bzw. sellify) angelegt. Inhalte sind Beispiele.</div></div>
  <div class="grid">${L.map(([t,i])=>`<div class="card"><div class="row" style="justify-content:space-between"><h3>${esc(t.n)}</h3><span class="pill p-run">Projektvorlage</span></div><div class="sub">${esc(t.d)}</div><div class="acts"><button class="btn sm pri" data-tpl="${i}">Projekt aus Vorlage starten</button><button class="btn sm" data-pjtab="des" data-desfill="1">Im Designer öffnen</button></div></div>`).join("")}
   <div class="card" style="border-style:dashed"><h3>+ Projektvorlage</h3><div class="sub">im Projekt-Designer mit KI entwerfen</div><div class="acts"><button class="btn sm" data-pjtab="des">Projekt-Designer</button></div></div></div>`;
}
function vMine(){''')
rep('<h2>Vorlagen</h2><div class="sub">Standards statt jedes Mal neu bauen.','<h2>Prozessvorlagen</h2><div class="sub">Ein Prozess ist ein wiederkehrender Ablauf aus Schritten, der immer wieder läuft. Standards statt jedes Mal neu bauen.')
rep('"Geschäftsführung","Projektvorlagen"];','"Geschäftsführung"];')
rep('<span class="pill ${t.proj?"p-run":"p-open"}">${t.proj?"Projektvorlage":"Prozess"}</span>','<span class="pill p-open">Prozess</span>')
# designer: no toggle, mode by area
rep('''<div style="flex:1;min-width:240px"><h2>BPM-Designer</h2><div class="sub">Ein Designer für beide Ebenen: Projekte (Phasen, Verzweigungen, Meilensteine) und Prozesse (Schritte mit Agenten). Der KI-Designer ist der Einstieg, danach passt du im Designer an.</div></div>
   <div class="seg"><button data-desmode="proc" aria-pressed="${m==="proc"}">Prozess</button><button data-desmode="proj" aria-pressed="${m==="proj"}">Projekt</button></div></div>''',
    '''<div style="flex:1;min-width:240px"><h2>${m==="proc"?"Prozess-Designer":"Projekt-Designer"}</h2><div class="sub">${m==="proc"?"Prozesse aus Schritten mit fest eingesetzten Agenten, Entscheidungen und Freigaben.":"Projektvorlagen mit Phasen, Verzweigungen und Meilensteinen; je Phase werden Prozesse zugeordnet."} Derselbe BPM-Designer für Projekte und Prozesse; der KI-Entwurf ist der Einstieg, danach passt du an.</div></div></div>''')
rep('<button class="btn" data-ptab="tpl">Mit Vorlage beginnen</button>','<button class="btn" ${m==="proc"?\'data-ptab="tpl"\':\'data-pjtab="tpl"\'}>Mit Vorlage beginnen</button>')
# project detail designer button
rep('<button class="btn" data-desmode="proj" data-ptab="des">Im Designer öffnen</button>','<button class="btn" data-pjtab="des" data-desfill="1">Im Designer öffnen</button>')
# handlers
rep('go({area:"proc"});return}','go({area:b.dataset.ptabgo==="proj"?"proj":"proc",pjTab:"list"});return}')
rep('if(b.dataset.ptab){','if(b.dataset.pjtab){state.pjTab=b.dataset.pjtab;if(state.pjTab==="des"){state.desMode="proj";state.desStage=b.hasAttribute("data-desfill")?1:0;state.desPrompt=""}if(state.area!=="proj")go({area:"proj"});else render();return}\n  if(b.dataset.ptab){')
# cockpit projects card
rep('  <div class="card"><h2>Prozesse</h2><div class="kpis">','''  <div class="card"><h2>Projekte</h2><div class="kpis"><div class="kpi"><b>${(PROJ[k]||[]).length}</b><span>laufend</span></div><div class="kpi"><b>${(PROJ[k]||[]).filter(x=>x.kind==="Phasen").length}</b><span>mit Phasen</span></div><div class="kpi"><b>${(PROJ[k]||[]).filter(x=>x.kind!=="Phasen").length}</b><span>mit Aufgabenpaketen</span></div></div><div class="acts" style="justify-content:flex-start"><button class="btn sm" data-ptabgo="proj">Projekte</button></div></div>
  <div class="card"><h2>Prozesse</h2><div class="kpis">''')
open(p,'w',encoding='utf-8').write(s);print('ok')
