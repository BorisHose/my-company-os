import sys
D='/tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/'
p=D+'ai-head-office-prototyp.html'
s=open(p,encoding='utf-8').read()
tag=open(D+'v17/tag.js',encoding='utf-8').read()
def rep(a,b):
    global s
    if a not in s: sys.exit('MISSING '+a[:80])
    s=s.replace(a,b,1)
rep('const AREAS=[["cockpit","◎","Cockpit"],','const AREAS=[["tag","☀","Mein Tag"],["cockpit","◎","Cockpit"],')
rep('let state={co:"all",area:"cockpit",','let state={co:"all",area:"tag",dayTab:"heute",showRest:false,')
rep('if(state.co==="all"&&!["cockpit","settings"].includes(state.area))','if(state.co==="all"&&!["tag","cockpit","settings"].includes(state.area))')
rep('const V={cockpit:','const V={tag:vTag,cockpit:')
rep('/* ---------- Chat ---------- */',tag+'\n/* ---------- Chat ---------- */')
# top bar bell + pop
rep('<button class="btn" id="newJob">+ Neuer Auftrag</button>','<button class="btn bell" id="bell" aria-label="Benachrichtigungen">🔔<span class="cnt">5</span></button><button class="btn" id="newJob">+ Neuer Auftrag</button>')
rep('<div class="toast" id="toast" hidden></div>','<div class="toast" id="toast" hidden></div>\n<div class="pop" id="pop" hidden role="status"><span class="spark">✦</span><div><b>Sitzung „Elevator Pitch – Kostenfolie“ ist fertig</b><small>Ergebnis prüfen und freigeben</small></div><button class="btn sm" data-gotag="sess">Ansehen</button><button class="ib" data-popx aria-label="Schließen">×</button></div>')
# settings tab Mein Tag
rep('[["profil","Profil"],["firmen","Unternehmen"],','[["profil","Profil"],["tag","Mein Tag"],["firmen","Unternehmen"],')
rep('  if(t==="agents")return `<div class="stack">${tabs}${vAgents()}</div>`;','''  if(t==="tag")return `<div class="stack">${tabs}<div class="card"><h2>Mein Tag</h2><div class="sub">Persönliche Einstellungen für Übersichten, Benachrichtigungen und Sitzungen. Werte sind Beispiele.</div>
   <div class="perm"><span><b>Morgenübersicht</b><br><span class="sub">Uhrzeit 7:30</span></span><div class="seg"><button data-opt aria-pressed="true">nur in der App</button><button data-opt aria-pressed="false">E-Mail über Bodo/sellify</button><button data-opt aria-pressed="false" disabled style="opacity:.45" title="kommt mit dem Mobil-Projekt">Handy (später)</button></div></div>
   <div class="perm"><span><b>Tagesabschluss</b><br><span class="sub">Uhrzeit 17:30</span></span><div class="seg"><button data-opt aria-pressed="true">nur in der App</button><button data-opt aria-pressed="false">E-Mail über Bodo/sellify</button><button data-opt aria-pressed="false" disabled style="opacity:.45" title="kommt mit dem Mobil-Projekt">Handy (später)</button></div></div>
   <div class="perm"><span><b>Benachrichtigungen</b><br><span class="sub">aufpoppen und gebündelt unter der Glocke</span></span><div class="seg"><button data-opt aria-pressed="true">sofort</button><button data-opt aria-pressed="false">gebündelt stündlich</button></div></div>
   <div class="perm"><span><b>Ruhend nach</b></span><span class="lv">3 Tagen ohne Aktivität</span></div>
   <div class="perm"><span><b>Hinweis „zu viel parallel“</b></span><span class="lv">ab 10 aktiven Sitzungen</span></div>
   <div class="perm"><span><b>Sitzungsquellen</b></span><span class="sub">Cowork / Claude-App ✓ · Claude Code ✓ · Handy-Chats ✓ · geplante Aufgaben ✓</span></div>
   <div class="perm"><span><b>Zuordnung zu Unternehmen und Projekt</b></span><span class="sub">automatisch durch die KI, sonst nachfragen</span></div>
   <div class="perm"><span><b>Wartende Sitzungen als Aufgabe im CRM</b><br><span class="sub">Bodo „Meine Arbeit“ bzw. Gegenstück in sellify – offen, mit Dominik zu entscheiden; nur möglich, wenn der MCP-Server es kann</span></span><span class="pill p-open">noch nicht verfügbar</span></div></div>
   <div class="card"><h2>Wie AI Head Office den Stand der Sitzungen erfährt</h2><div class="sub">Technisch noch zu prüfen. Vorgesehen: A – Sitzungen aus AI Head Office starten · B – Sitzungen melden sich per Standard-Skill selbst (Stand, nächster Schritt, Ergebnis, Link) · C – von Hand erfassen.</div></div></div>`;
  if(t==="agents")return `<div class="stack">${tabs}${vAgents()}</div>`;''')
# events
rep('  if(b.dataset.ptabgo){','''  if(b.dataset.daytab){state.dayTab=b.dataset.daytab;render();return}
  if(b.dataset.sact){const [i,a]=b.dataset.sact.split(":");const x=SESS[+i];
    if(a==="open"){if(x.l==="rest"){x.l="run";render()}toast("Öffnet die Sitzung „"+x.t+"“ in Claude (Prototyp)");return}
    if(a==="done"){x.l="done";render();toast("„"+x.t+"“ erledigt – erscheint im Tagesabschluss (Prototyp)");return}
    if(a==="park"){x.l="rest";render();toast("Geparkt – unter „Ruhend“ (Prototyp)");return}
    if(a==="arch"){x.l="arch";render();toast("Übergabenotiz geschrieben, Sitzung archiviert (Prototyp)");return}
    if(a==="del"){x.l="del";render();toast("Sitzung gelöscht (Prototyp)");return}}
  if(b.dataset.sassign){const [i,v]=b.dataset.sassign.split(":");const x=SESS[+i];x.as=x.ask[+v];render();toast("Zugeordnet: "+x.as+" (Prototyp)");return}
  if(b.hasAttribute("data-resttoggle")){state.showRest=!state.showRest;render();return}
  if(b.id==="bell"){bellModal();return}
  if(b.hasAttribute("data-popx")){$("#pop").hidden=true;return}
  if(b.dataset.gotag!==undefined){$("#modal").innerHTML="";$("#pop").hidden=true;state.dayTab=b.dataset.gotag||"heute";go({area:"tag"});return}
  if(b.dataset.ptabgo){''')
rep('render();\n</script>','render();\nsetTimeout(popNote,3500);\n</script>')
# css
rep('@media (prefers-reduced-motion:reduce)','''.bell{position:relative;padding:6px 10px}.bell .cnt{position:absolute;top:-6px;right:-6px;font-family:var(--f-mono);font-size:10.5px;background:var(--accent);color:#fff;border-radius:999px;padding:0 6px}
.pop{position:fixed;top:16px;right:20px;z-index:45;background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;box-shadow:0 14px 36px rgba(10,14,28,.22);padding:12px 14px;display:flex;gap:12px;align-items:center;max-width:min(460px,calc(100vw - 32px))}
.pop .spark{width:30px;height:30px;border-radius:50%;background:var(--accent);color:#fff;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.pop b{display:block;font-size:13px}.pop small{color:var(--muted);font-size:12px}
.pop .ib{border:0;background:none;font-size:18px;color:var(--muted)}
.modal.top{align-items:flex-start;justify-content:flex-end;padding-top:64px}
.srct{font-size:11.5px;font-weight:600;color:var(--muted);font-family:var(--f-mono)}
.sess h3{font-size:14.5px}
.sess.big{border-left:4px solid var(--accent)}.sess.big h3{font-size:17px}
.kv{display:grid;grid-template-columns:86px 1fr;gap:4px 10px;font-size:13px}
.kv .k{font-family:var(--f-mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding-top:2px}
.askbox{border:1px dashed var(--accent);border-radius:9px;padding:8px 10px;font-size:12.5px;display:flex;flex-direction:column;gap:6px;background:var(--accent-soft)}
.lanes{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));align-items:start}
.lane{background:var(--sunk);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:10px}
.lane-h{display:flex;justify-content:space-between;align-items:center;padding:2px 4px}
.daycard{border-top:4px solid var(--ink)}
.lnk{border:0;background:none;padding:0;color:var(--info);text-align:left;font:inherit;text-decoration:underline;cursor:pointer}
.tline{display:flex;flex-direction:column;gap:8px}
.tl-row{display:grid;grid-template-columns:50px 1fr;gap:10px;align-items:start}
.tm{font-family:var(--f-mono);font-size:12px;color:var(--muted);padding-top:8px}
.slot{border-radius:9px;padding:8px 11px;display:flex;flex-direction:column;gap:2px;font-size:12.5px}
.slot.cal{background:var(--ink-soft);border-left:4px solid var(--ink)}
.slot.free{border:1px dashed var(--line);color:var(--muted)}.slot.free b{color:var(--fg)}
@media (prefers-reduced-motion:reduce)''')
open(p,'w',encoding='utf-8').write(s);print('ok',len(s))
