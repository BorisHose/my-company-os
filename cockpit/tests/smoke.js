// Smoke-Test für das Cockpit: baut eine Testseite aus dist/ mit Testdaten und
// einer nachgebildeten Datenbank und prüft die Hauptansichten ohne Fehler.
// Aufruf: node tests/smoke.js   (vorher: python3 build.py)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'dist', 'organigraph.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'testdaten.json'), 'utf8'));
// Zusätzliche Fälle für Datenstand 2: abgebrochen ohne Datum, erledigt ohne Datum, alter Auftrag fürs Archiv
const tage = n => new Date(Date.now() - n * 864e5).toISOString();
const dm = d => { const x = new Date(d); return String(x.getDate()).padStart(2, '0') + '.' + String(x.getMonth() + 1).padStart(2, '0') + '. 10:15'; };
data.meta.settings = { ...data.meta.settings }; delete data.meta.settings.schema;
data.jobs.push(
  { id: 'A-190', t: 'Abgebrochener Test', art: 'frei', fid: data.jobs[0].fid, st: 'done', ok: 'nein', ki: 1, log: [[dm(tage(2)), 'KI-Auftrag angelegt von Boris'], [dm(tage(2)), 'Auftrag abgebrochen von Boris', 1]], path: [] },
  { id: 'A-191', t: 'Erledigt ohne Datum', art: 'frei', fid: data.jobs[0].fid, st: 'done', ok: 'ja', ki: 1, log: [[dm(tage(3)), 'Auftrag fertig']], path: [] },
  { id: 'A-150', t: 'Alter Auftrag', art: 'frei', org: 'og-bodo', fid: data.jobs[0].fid, st: 'done', ok: 'ja', ki: 1, fertig: tage(200), sum: 'Alt.', erg: [{ t: 'X', url: 'https://example.org/x', vorschau: 'lang' }], log: [], path: [] });
const mock = `<script>window.__W=[];window.__C=[];const D=${JSON.stringify(data).replace(/</g, '\\u003c')};
const S={};S["meta/config"]=D.meta;["skills","agents","flows","jobs","users","depts"].forEach(c=>(D[c]||[]).forEach(x=>{S[c+"/"+x.id]=JSON.parse(JSON.stringify(x))}));window.__S=S;
const mcp={callTool:async(s,tool,inp)=>{__C.push(tool);(window.__CI=window.__CI||[]).push(inp);if(tool==="list_triggers")return {payload:{data:[]}};if(tool==="sellify_user")return {payload:{total:1,items:[{id:429,login:"Ho",person:{firstName:"Boris",lastName:"Hose",emailAddress:{}},canLogin:true,deleted:false,roles:[{name:"Full access",deleted:false}]}],hasMore:false}};if(tool==="bodo_search"&&inp&&inp.resourceType==="benutzer")return {payload:{items:[{data:{membershipId:"mb-"+inp.orgId.slice(0,4),userId:"us-x",name:"Boris Hose",email:"boris.hose@muster-haustechnik.example",status:"active",roleNames:["Administrator"]}}]}};if(tool==="sellify_project"&&inp.params&&inp.params.q==="viele"){const o=inp.params.offset||0,n=o?5:25;return {payload:{total:30,items:Array.from({length:n},(_,i)=>({id:1000+o+i,name:"Viele "+(o+i),done:false,webUrl:"https://sellify.example/e/projects/"+(1000+o+i)})),hasMore:!o,nextOffset:o?null:25}}}if(tool==="sellify_project")return {payload:{total:2,items:[{id:3,name:"Prozessoptimierung Muster",number:"10019",done:false,status:{name:{"de-DE":"Aktiv"}},responsible:{firstName:"Boris",lastName:"Hose"},description:"Test",webUrl:"https://sellify.example/e/projects/3"},{id:5,name:"Debug Muster",number:"10021",done:false,webUrl:"https://sellify.example/e/projects/5"}],hasMore:false}};if(tool==="bodo_list_orgs")return {payload:{orgs:(window.__S["meta/config"].settings.bodoOrgs||[]).map(o=>({orgId:o.id,name:o.name,mcpAccess:{allowed:true}}))}};if(tool==="bodo_search"&&inp&&inp.resourceType==="project")return {payload:{items:[{id:"bp1",title:"Einführung Musterverein",url:"https://bodo-app.com/o/x/projekte/bp1",data:{projectStatus:"active",ownerName:"Boris Hose",description:"Test"}},{id:"bp2",title:"Migration Musterverein",url:"https://bodo-app.com/o/x/projekte/bp2",data:{projectStatus:"active"}}],hasMore:false}};return {payload:{}}}};
const smp=async()=>({text:""});smp.json=async(p)=>{window.__SMP=(window.__SMP||0)+1;window.__SMPP=String(p);return String(p).includes("SKILL-KATALOG")?{vorschlaege:[{id:"kontakt-anlegen",warum:"Legt Kontakte an."},{id:"gibt-es-nicht",warum:"x"},{id:"angebot-erstellen",warum:"Erstellt Angebote."}]}:{}};
const OPS={"==":(a,b)=>a===b,"!=":(a,b)=>a!==b,"<":(a,b)=>a<b,"<=":(a,b)=>a<=b,">":(a,b)=>a>b,">=":(a,b)=>a>=b,"in":(a,b)=>b.includes(a),"not-in":(a,b)=>!b.includes(a)};
const L=new Set(),LS={};window.__L=L;window.__LS=LS;
const run=q=>{let r=Object.keys(S).filter(k=>k.split("/").length===2&&k.startsWith(q.c+"/")).map(k=>S[k]);q.w.forEach(([f,o,v])=>{r=r.filter(x=>x[f]!==undefined&&OPS[o](x[f],v))});
  if(q.o){const [f,d]=q.o;r.sort((a,b)=>(a[f]>b[f]?1:a[f]<b[f]?-1:0)*(d==="desc"?-1:1))}return r.slice(0,q.n).map(x=>({data:()=>JSON.parse(JSON.stringify(x))}))};
const notify=()=>setTimeout(()=>L.forEach(l=>l.next({docs:run(l.q),docChanges:()=>[]})),0);
const mkq=q=>({where:(f,o,v)=>mkq({...q,w:[...q.w,[f,o,v]]}),orderBy:(f,d)=>mkq({...q,o:[f,d||"asc"]}),limit:n=>mkq({...q,n}),
  get:async()=>({docs:run(q)}),onSnapshot:(next,err)=>{const l={q,next};L.add(l);setTimeout(()=>next({docs:run(q),docChanges:()=>[]}),0);return ()=>L.delete(l)}});
const col=c=>({...mkq({c,w:[],n:1000}),doc:id=>doc(c+'/'+id)});
const merge=(a,b)=>{const o={...a};Object.entries(b).forEach(([k,v])=>{o[k]=v&&typeof v==="object"&&!Array.isArray(v)&&o[k]&&typeof o[k]==="object"&&!Array.isArray(o[k])?merge(o[k],v):v});return o};
const doc=k=>({get:async()=>({exists:!!S[k],data:()=>S[k]?JSON.parse(JSON.stringify(S[k])):undefined}),set:async v=>{S[k]=JSON.parse(JSON.stringify(v));__W.push(k);notify()},
  update:async v=>{if(!S[k])throw {code:"invalid_argument"};S[k]=merge(S[k],JSON.parse(JSON.stringify(v)));__W.push(k);notify()},delete:async()=>{delete S[k];__W.push("-"+k);notify()},
  acquire:async({holder,ttlMs})=>{const n=Date.now(),c=LS[k];if(c&&c.h!==holder&&c.e>n)return {acquired:false};LS[k]={h:holder,e:n+(ttlMs||30000)};return {acquired:true,holder}},onSnapshot:()=>()=>{}});
window.claude={use:async n=>n==="sample"?smp:n==="mcp"?mcp:n==="db"?{doc,collection:col}:null};</script>`;
const page = '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">' + mock + html;
const tmp = path.join(ROOT, 'tests', '.testseite.html');
fs.writeFileSync(tmp, page);
const CHECKS = [];
const check = (name, ok, info = '') => { CHECKS.push({ name, ok }); console.log((ok ? 'ok   ' : 'FEHLER ') + name + (info ? '  ' + info : '')); };
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + tmp); await p.waitForTimeout(1500);
  check('startet im Organigramm', await p.$eval('#org', e => getComputedStyle(e).display !== 'none'));
  check('Organigramm zeigt Abteilungen', (await p.$$('.odept')).length > 0);
  check('Organigramm zeigt Agenten', (await p.$$('.oag')).length > 0);
  for (const v of ['jobs', 'flows', 'build', 'skills', 'users', 'matrix', 'org']) {
    await p.evaluate(v => show(v), v); await p.waitForTimeout(250);
    check('Ansicht ' + v + ' sichtbar', await p.$eval(v === 'users' ? '#setu' : '#' + v, e => getComputedStyle(e).display !== 'none' && !e.closest('.hide')));
  }
  await p.evaluate(() => show('jobs')); await p.waitForTimeout(300);
  check('KI-Aufträge zeigen Kacheln', (await p.$$('#kb .kc, #kb .kmini')).length > 0);
  await p.evaluate(() => startModal(null)); await p.waitForTimeout(300);
  check('Fenster Neuer KI-Auftrag öffnet', !!(await p.$('#modal .box #ji')));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  // ----- Etappe 1: Organigramm-Aktionen und Dialog „Aufträge & Verlauf“ -----
  const SHOT = process.env.SHOTS;
  await p.evaluate(() => show('org')); await p.waitForTimeout(300);
  check('Organigramm: ▶ an jedem Agenten', (await p.$$('.oag [data-play]')).length === (await p.$$('.oag')).length && (await p.$$('.oag')).length > 0);
  check('Organigramm: Knopf „Aufträge & Verlauf“ und Verlauf je Abteilung', !!(await p.$('#orgav')) && (await p.$$('[data-oav]')).length > 0);
  const lauf = await p.evaluate(() => [...document.querySelectorAll('[data-orun]')].map(e => e.textContent.trim()));
  check('Organigramm: nur „● n läuft“ an Agenten mit laufenden Aufträgen', lauf.every(t => /^● \d+ läuft$/.test(t)), JSON.stringify(lauf));
  if (SHOT) await p.screenshot({ path: SHOT + '/e1-organigramm.png', fullPage: false });
  await p.click('.oag [data-play]'); await p.waitForTimeout(300);
  const vb = await p.evaluate(() => ({ art: (document.querySelector('#jart .on') || {}).dataset?.a, ag: (document.querySelector('#jag') || {}).value, first: document.querySelector('.oag [data-play]').dataset.play }));
  check('▶ öffnet „Neuer KI-Auftrag“ mit diesem Agenten vorbelegt', vb.art === 'agent' && vb.ag === vb.first, JSON.stringify(vb));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  // ----- Abteilung beauftragen (KI-Teamleiter wählt den Agenten) -----
  check('Organigramm: „▶ Abteilung beauftragen“ je Abteilung', (await p.$$('[data-oabt]')).length === (await p.$$('[data-oav]')).length && (await p.$$('[data-oabt]')).length > 0);
  const dab = await p.$eval('[data-oabt]', e => e.dataset.oabt);
  await p.click(`[data-oabt="${dab}"]`); await p.waitForTimeout(300);
  const vm = await p.evaluate(() => ({ art: (document.querySelector('#jart .on') || {}).dataset?.a, abt: (document.querySelector('#jabt') || {}).value, skill: !!document.querySelector('#jskq'), hint: (document.querySelector('#jabt + .hint') || {}).textContent || '' }));
  check('Fenster vorbelegt: Art Abteilung, diese Abteilung, kein Skill-Feld, Agentenliste', vm.art === 'abteilung' && vm.abt === dab && !vm.skill && /KI-Teamleiter wählt aus: \S/.test(vm.hint), JSON.stringify(vm));
  if (SHOT) await p.screenshot({ path: SHOT + '/e1-abteilung.png' });
  await p.fill('#modal #ji', 'Bitte Angebot für Herrn Beispiel vorbereiten'); await p.click('#modal #go'); await p.waitForTimeout(1200);
  const ja = await p.evaluate(d => { const j = AU.find(x => x.art === 'abteilung'); const t = (window.__CI || []).filter(x => x && x.text).map(x => x.text).pop() || ''; return { id: j && j.id, abt: j && j.abt, aid: j && j.aid, who: j && jobWho(j).n, ctx: t.includes('ABTEILUNG BEAUFTRAGT') && t.includes('KI-TEAMLEITER'), d }; }, dab);
  check('Auftrag an Abteilung: abt gesetzt, noch kein Agent, Kontext für den Teamleiter', ja.id && ja.abt === ja.d && !ja.aid && ja.who === '✦ KI-Teamleiter' && ja.ctx, JSON.stringify(ja));
  // ----- Etappe 3: Plan des KI-Teamleiters -----
  const pl = await p.evaluate(async () => { const j = AU.find(x => x.art === 'abteilung' && x.st === 'run'); const o = jobOrg(j);
    const own = AG.filter(a => inOrg(a, o) && PL(a, o).abt === j.abt), other = AG.find(a => inOrg(a, o) && PL(a, o).abt && PL(a, o).abt !== j.abt);
    await Store.update('jobs/' + j.id, { st: 'wait', plan: { sum: 'Testbegründung', steps: [{ t: 'Kontakte anlegen', aid: own[0].id, sk: '', nach: [] }, { t: 'Angebot erstellen', aid: own[0].id, nach: [1] }, { t: 'Reklamation prüfen', aid: other.id, nach: [] }] },
      q: { kind: 'Plan', from: 'KI-Teamleiter', text: '1 · …', why: 'Test', opts: ['Plan freigeben & starten'] }, log: [...j.log, ['17.10. 09:00', 'Plan erstellt (3 Teilaufträge)', 1]] });
    return { id: j.id, other: other.id }; });
  await p.waitForTimeout(1200);
  await p.evaluate(id => resultModal(AU.find(j => j.id === id)), pl.id); await p.waitForTimeout(300);
  const pv = await p.evaluate(() => ({ steps: document.querySelectorAll('#modal .plstep').length, sel: document.querySelectorAll('#modal [data-plag]').length, ab: document.querySelectorAll('#modal .plab').length, go: !!document.querySelector('#plgo'), lab: (document.querySelector('#modal .okb') || {}).textContent }));
  check('Plan-Fenster: 3 Schritte mit Agentenwahl, fremde Abteilung markiert, Freigabe-Knopf', pv.steps === 3 && pv.sel === 3 && pv.ab === 1 && pv.go && /Plan/.test(pv.lab), JSON.stringify(pv));
  if (SHOT) await p.screenshot({ path: SHOT + '/e3-plan.png' });
  const fz0 = await p.evaluate(() => __C.filter(t => t === 'fire_trigger').length);
  await p.click('#plgo'); await p.waitForTimeout(2000);
  const pf = await p.evaluate(id => { const P = AU.find(j => j.id === id), K = (P.teile || []).map(t => AU.find(x => x.id === t)); return { st: P.st, n: K.length, kst: K.map(k => k.st), nach: K[1] && K[1].nach, par: K.every(k => k.parent === id && k.art === 'agent'), saved: K.every(k => !!window.__S['jobs/' + k.id]), fired: __C.filter(t => t === 'fire_trigger').length, log: P.log.slice(-2).map(l => l[1]) }; }, pl.id);
  check('Freigabe: 3 Teilaufträge angelegt, unabhängige gestartet, abhängiger wartet', pf.st === 'run' && pf.n === 3 && pf.par && pf.saved && pf.kst[0] === 'run' && pf.kst[1] === 'inbox' && pf.kst[2] === 'run' && pf.fired === fz0 + 2 && /Zustimmung/.test(pf.log.join('|')), JSON.stringify(pf));
  await p.evaluate(async id => { const P = AU.find(j => j.id === id); await Store.update('jobs/' + P.teile[0], { st: 'done', ok: 'ja', fertig: new Date().toISOString(), sum: 'Kontakte angelegt.', erg: [{ t: 'Liste', url: 'https://example.org/l' }] }); }, pl.id);
  await p.waitForTimeout(2200);
  const pw = await p.evaluate(id => { const P = AU.find(j => j.id === id), k = AU.find(x => x.id === P.teile[1]); return { st: k.st, inV: /Ergebnisse der Vorschritte/.test(k.in), fired: __C.filter(t => t === 'fire_trigger').length }; }, pl.id);
  check('Nach Vorschritt: abhängiger Teil startet automatisch mit dessen Ergebnis', pw.st === 'run' && pw.inV && pw.fired === fz0 + 3, JSON.stringify(pw));
  await p.evaluate(async id => { const P = AU.find(j => j.id === id); for (const t of P.teile.slice(1)) await Store.update('jobs/' + t, { st: 'done', ok: 'ja', fertig: new Date().toISOString(), sum: 'ok' }); }, pl.id);
  await p.waitForTimeout(2200);
  const pe = await p.evaluate(id => { const P = AU.find(j => j.id === id); return { st: P.st, ok: P.ok, sum: P.sum, erg: (P.erg || []).length, db: window.__S['jobs/' + id].st }; }, pl.id);
  check('Alle Teile fertig: Hauptauftrag erledigt mit Zusammenfassung', pe.st === 'done' && pe.ok === 'ja' && pe.db === 'done' && /3 erledigt/.test(pe.sum) && pe.erg === 1, JSON.stringify(pe));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  // ----- Teamleiter je Team -----
  const tmI = await p.evaluate(() => { const o = OC, d = deptsOf(o).find(x => AG.filter(a => inOrg(a, o) && PL(a, o).abt === x.id).length >= 2); const A = AG.filter(a => inOrg(a, o) && PL(a, o).abt === d.id);
    d.teams = [{ id: 'tm-test', n: 'Angebote' }]; A[0].pl = { ...A[0].pl, [o]: { abt: d.id, team: 'tm-test' } }; show('org'); return { d: d.id, a0: A[0].id, a1: A[1].id }; });
  await p.waitForTimeout(300);
  check('Organigramm: ▶ je Team und für „Allgemein“', (await p.$$(`[data-otm="${tmI.d}|tm-test"]`)).length === 1 && (await p.$$(`[data-otm="${tmI.d}|_allg"]`)).length === 1);
  await p.click(`[data-otm="${tmI.d}|tm-test"]`); await p.waitForTimeout(300);
  const tmv = await p.evaluate(() => ({ team: (document.querySelector('#jteam') || {}).value, hint: (document.querySelector('#jabt') || {}).parentElement.querySelector('.hint').textContent }));
  check('Team beauftragen: Team vorgewählt, nur dessen Agenten zur Wahl', tmv.team === 'tm-test' && !tmv.hint.includes(',') , JSON.stringify(tmv));
  await p.fill('#modal #ji', 'Teamauftrag'); await p.click('#modal #go'); await p.waitForTimeout(1200);
  const tmj = await p.evaluate(i => { const j = AU.find(x => x.in === 'Teamauftrag'); const t = (window.__CI || []).filter(x => x && x.text).map(x => x.text).pop() || ''; return { team: j && j.team, ctx: t.includes('Team Angebote') && t.includes(i.a0) && !t.includes('(' + i.a1 + ')') }; }, tmI);
  check('Teamauftrag: team gespeichert, Kontext nennt nur Agenten des Teams', tmj.team === 'tm-test' && tmj.ctx, JSON.stringify(tmj));
  // ----- Etappe 2: Sammeln und Eingang -----
  await p.evaluate(() => show('org')); await p.waitForTimeout(200);
  check('Organigramm: „📥 n“ und „+ Sammeln“ je Abteilung', (await p.$$('[data-oin]')).length > 0 && (await p.$$('[data-osm]')).length === (await p.$$('[data-oin]')).length);
  const dsm = await p.$eval('[data-osm]', e => e.dataset.osm);
  const sammle = async (t, prio, due, sofort) => { await p.click(`[data-osm="${dsm}"]`); await p.waitForTimeout(250);
    await p.fill('#modal #jt', t); await p.fill('#modal #ji', 'Testaufgabe ' + t); if (prio) await p.click(`#jprio [data-p="${prio}"]`); if (due) await p.fill('#jdue', due);
    await p.click(sofort ? '#modal #gonow' : '#modal #go'); await p.waitForTimeout(700); };
  const sm0 = await p.evaluate(() => ({ h: document.querySelector('#modal h3') ? 1 : 0 }));
  await p.click(`[data-osm="${dsm}"]`); await p.waitForTimeout(250);
  const smv = await p.evaluate(() => ({ h: document.querySelector('#modal h3').textContent, art: !!document.querySelector('#jart'), zu: (document.querySelector('#jzu') || {}).value, prio: (document.querySelector('#jprio .on') || {}).dataset?.p, due: !!document.querySelector('#jdue'), btn: !!document.querySelector('#gonow') }));
  check('Sammeln-Fenster: Titel, Zuweisung „KI-Teamleiter“, Priorität Normal, Fälligkeit, zwei Knöpfe', /sammeln/i.test(smv.h) && !smv.art && smv.zu === '' && smv.prio === 'n' && smv.due && smv.btn, JSON.stringify(smv));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  const fired0 = await p.evaluate(() => __C.filter(t => t === 'fire_trigger').length);
  await sammle('Niedrig spät', 'l', '2026-12-01'); await sammle('Dringend', 'd', '2026-11-20'); await sammle('Hoch früh', 'h', '2026-10-20');
  const ib = await p.evaluate(d => { const L = AU.filter(j => j.st === 'inbox'); return { n: L.length, ok: L.every(j => j.abt === d && j.art === 'abteilung' && !j.fired && window.__S['jobs/' + j.id] && window.__S['jobs/' + j.id].st === 'inbox'), cnt: document.querySelector(`[data-oin="${d}"]`).textContent.trim(), fired: __C.filter(t => t === 'fire_trigger').length }; }, dsm);
  check('Gesammelt: im Eingang gespeichert, nichts gestartet, Zähler an der Abteilung', ib.n === 3 && ib.ok && ib.cnt === '📥 3' && ib.fired === fired0, JSON.stringify(ib));
  await p.click(`[data-oin="${dsm}"]`); await p.waitForTimeout(300);
  const ord1 = await p.$$eval('#avdlg tbody tr.ib .t b', r => r.map(x => x.textContent));
  check('Eingang: sortiert nach Priorität, darin Fälligkeit', JSON.stringify(ord1) === JSON.stringify(['Dringend', 'Hoch früh', 'Niedrig spät']), ord1.join(' | '));
  await p.click('[data-avso="due"]'); await p.waitForTimeout(200);
  const ord2 = await p.$$eval('#avdlg tbody tr.ib .t b', r => r.map(x => x.textContent));
  check('Eingang: umschaltbar auf Fälligkeit, darin Priorität', JSON.stringify(ord2) === JSON.stringify(['Hoch früh', 'Dringend', 'Niedrig spät']), ord2.join(' | '));
  if (SHOT) await p.screenshot({ path: SHOT + '/e2-eingang.png' });
  const first = await p.$eval('#avdlg tbody tr.ib [data-avgo]', b => b.dataset.avgo);
  await p.click(`[data-avgo="${first}"]`); await p.waitForTimeout(900);
  const st1 = await p.evaluate(id => ({ st: AU.find(j => j.id === id).st, fired: __C.filter(t => t === 'fire_trigger').length }), first);
  check('▶ Starten aus dem Eingang startet Claude', st1.st === 'run' && st1.fired === fired0 + 1, JSON.stringify(st1));
  const drop = await p.$eval('#avdlg tbody tr.ib [data-avdrop]', b => b.dataset.avdrop);
  await p.click(`[data-avdrop="${drop}"]`); await p.waitForTimeout(200); await p.click('#dlg [data-yes]'); await p.waitForTimeout(500);
  check('Verwerfen: Zustand abgebrochen, bleibt im Verlauf', await p.evaluate(id => { const j = AU.find(x => x.id === id); return j.st === 'cancel' && window.__S['jobs/' + id].st === 'cancel' }, drop));
  await p.evaluate(() => avClose());
  await sammle('Sofort', 'h', '', true);
  check('„Sammeln & sofort starten“ startet direkt', await p.evaluate(() => { const j = AU.find(x => x.t === 'Sofort'); return j && j.st === 'run' && j.prio === 'h' }));
  await p.evaluate(() => show('org'));
  await p.click('#orgav'); await p.waitForTimeout(300);
  check('Dialog öffnet mit Tab Offen', !!(await p.$('#avdlg .avbox')) && await p.$eval('[data-avt="offen"]', e => e.classList.contains('on')));
  const offen = await p.$$eval('#avdlg tbody tr[data-avj]', r => r.map(x => x.dataset.avj));
  check('Offen: wartende zuerst, keine erledigten', offen.length > 0 && await p.evaluate(ids => ids.every(id => !isEnd(AU.find(x => x.id === id))) && AU.find(x => x.id === ids[0]).st === 'wait', offen), offen.join(','));
  check('Offen: „Prüfen & freigeben“ bei wartenden', (await p.$$('#avdlg [data-avres]')).length === await p.evaluate(() => AU.filter(j => j.st === 'wait' && jobOrg(j) === AVS().org).length));
  if (SHOT) await p.screenshot({ path: SHOT + '/e1-offen.png' });
  await p.click('[data-avt="erledigt"]'); await p.waitForTimeout(200);
  check('Erledigt startet auf Heute (gespeichert: heute)', await p.evaluate(() => AVS().zeit === 'heute'));
  await p.click('[data-avz="woche"]'); await p.waitForTimeout(200);
  const ab0 = await p.$$eval('#avdlg tbody tr', r => r.map(x => x.textContent).join('|'));
  check('Abgebrochene standardmäßig ausgeblendet', !/abgebrochen/.test(ab0));
  await p.click('#avabg'); await p.waitForTimeout(200);
  const ab1 = await p.$$eval('#avdlg tbody tr', r => r.map(x => x.textContent).join('|'));
  check('Abgebrochene einblendbar', /abgebrochen/.test(ab1));
  if (SHOT) await p.screenshot({ path: SHOT + '/e1-erledigt.png' });
  const n1 = (await p.$$('#avdlg tbody tr[data-avj]')).length;
  await p.click('#avkeine'); await p.waitForTimeout(200);
  check('Einschränken „Keine“ leert die Tabelle', (await p.$$('#avdlg tbody tr[data-avj]')).length === 0 && n1 > 0);
  await p.click('#avalle'); await p.waitForTimeout(200);
  const d0 = await p.$eval('[data-avd]', e => e.dataset.avd);
  await p.click(`[data-avd="${d0}"]`); await p.waitForTimeout(200);
  check('Abteilung abwählen wirkt und wird gemerkt', await p.evaluate(d => { const S = avSel(AVS().org); return S.d && !S.d.includes(d) && JSON.parse(localStorage.getItem('cos-ui') || '{}').av.sel }, d0));
  await p.click('[data-avz="aelter"]'); await p.waitForTimeout(800);
  check('Älter lädt das Archiv (A-150)', await p.$$eval('#avdlg tbody tr.arch', r => r.some(x => x.textContent.includes('A-150'))) || await p.evaluate(() => (AVARCH || []).some(x => x.id === 'A-150')));
  await p.click('#avalle'); await p.waitForTimeout(200);
  await p.fill('#avq', 'A-150'); await p.waitForTimeout(200);
  check('Suche im Dialog behält den Fokus', await p.evaluate(() => document.activeElement.id === 'avq'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  check('Escape schließt den Dialog', !(await p.$('#avdlg')));
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => avOpen({ tab: 'offen' })); await p.waitForTimeout(300);
  const ov = await p.evaluate(() => { const W = window.innerWidth, bad = [...document.querySelectorAll('#avdlg *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > W + 1 || r.left < -1) && !e.closest('.avtw') }); return { n: bad.length, x: bad.slice(0, 4).map(e => e.className || e.tagName) } });
  check('Dialog bei 390 px: nichts ragt über den Rand', ov.n === 0, JSON.stringify(ov));
  if (SHOT) await p.screenshot({ path: SHOT + '/e1-mobil.png' });
  await p.evaluate(() => avClose()); await p.setViewportSize({ width: 1440, height: 900 });
  // ----- Etappe 4a: Kopfzeile, Einstellungen, Darstellung, Logos -----
  await p.evaluate(() => show('org')); await p.waitForTimeout(200);
  const hd = await p.evaluate(() => ({ clock: (document.querySelector('#clock') || {}).textContent || '', me: !!document.querySelector('#me .av'), gear: !!document.querySelector('#gear'), users: !!document.querySelector('nav [data-v="users"]') }));
  check('Kopfzeile: Datum/Uhrzeit, Avatar, Zahnrad; Benutzer nicht mehr in der Leiste', /\d\d\.\d\d\.\d{4} · \d\d:\d\d/.test(hd.clock) && hd.me && hd.gear && !hd.users, JSON.stringify(hd));
  await p.click('#gear'); await p.waitForTimeout(250); await p.evaluate(() => einst('darst')); await p.waitForTimeout(100);
  const se = await p.evaluate(() => ({ vis: !document.querySelector('#settings').classList.contains('hide'), nav: [...document.querySelectorAll('[data-sets]')].map(b => b.dataset.sets) }));
  check('Einstellungen öffnen mit allen Bereichen', se.vis && ['darst', 'inst', 'orgs', 'users', 'ausf', 'dienste'].every(k => se.nav.includes(k)), JSON.stringify(se));
  await p.click('[data-thm="dark"]'); await p.waitForTimeout(150);
  const dk = await p.evaluate(() => ({ t: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor, pan: getComputedStyle(document.querySelector('#setc')).backgroundColor }));
  check('Dunkel-Modus schaltet um', dk.t === 'dark' && dk.bg !== 'rgb(245, 246, 248)' && dk.pan !== 'rgb(255, 255, 255)', JSON.stringify(dk));
  if (SHOT) await p.screenshot({ path: SHOT + '/e4-einst-dunkel.png' });
  await p.evaluate(() => { show('org') }); await p.waitForTimeout(200);
  if (SHOT) await p.screenshot({ path: SHOT + '/e4-org-dunkel.png' });
  await p.evaluate(() => { show('jobs') }); await p.waitForTimeout(200);
  if (SHOT) await p.screenshot({ path: SHOT + '/e4-jobs-dunkel.png' });
  await p.evaluate(() => themeSet('light'));
  await p.evaluate(() => einst('orgs')); await p.waitForTimeout(200);
  await p.evaluate(() => { const o = ORGS()[0]; o.logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; einst('orgs'); });
  if (SHOT) await p.screenshot({ path: SHOT + '/e4-einst-orgs.png' });
  await p.evaluate(() => show('org')); await p.waitForTimeout(200);
  check('Logo erscheint im Umschalter und in der Kopfbox', !!(await p.$('#oseg img.olg')) && !!(await p.$('.obox img.olgb')));
  await p.evaluate(() => document.querySelector('#me').click()); await p.waitForTimeout(250);
  await p.evaluate(() => { const s = document.querySelector('#sme'); s.value = US.find(u => u.aktiv !== false && u.id !== ME().id).id; s.dispatchEvent(new Event('change')) }); await p.waitForTimeout(150);
  const nm = await p.evaluate(() => ICH());
  check('Angemeldeter Benutzer umschaltbar, Name wird übernommen', nm && nm !== 'Boris', nm);
  await p.evaluate(() => { UI.me = undefined; saveUI(); hdr(); show('org') });
  // ----- v57: Kopfzeile aufgeräumt -----
  const nv = await p.evaluate(() => [...document.querySelectorAll('nav button')].map(b => b.textContent.replace(/\d+$/, '').trim()));
  check('Kopfzeile: Organigramm · Aufträge · Projekte · Prozesse · Agenten ▾', JSON.stringify(nv) === JSON.stringify(['Organigramm', 'Aufträge', 'Projekte', 'Prozesse', 'Agenten ▾']), JSON.stringify(nv));
  await p.click('nav [data-v="agrp"]'); await p.waitForTimeout(200);
  const mo = await p.evaluate(() => ({ auf: !document.querySelector('#agmenu').hidden, exp: document.querySelector('#agbtn').getAttribute('aria-expanded'), hdr: document.querySelector('header').offsetHeight }));
  await p.click('#agmenu [data-sv="skills"]'); await p.waitForTimeout(250);
  const sn = await p.evaluate(m => ({ sub: m.auf && m.exp === 'true' && document.querySelector('#agmenu').hidden, sk: !document.querySelector('#skills').classList.contains('hide'), on: document.querySelector('nav [data-v="agrp"]').classList.contains('on'), agv: JSON.parse(localStorage.getItem('cos-ui')).agv, hdrGleich: document.querySelector('header').offsetHeight === m.hdr }), mo);
  check('Agenten ▾: öffnet Auswahlliste, Wahl schließt sie, Skills sichtbar, Kopfzeile bleibt gleich hoch, gemerkt', sn.sub && sn.sk && sn.on && sn.agv === 'skills' && sn.hdrGleich, JSON.stringify(sn));
  if (SHOT) await p.screenshot({ path: SHOT + '/e5-kopf-skills.png' });
  await p.evaluate(() => show('org')); await p.waitForTimeout(150);
  check('Agenten ▾: Klick daneben und Escape schließen, ✓ am aktuellen Reiter', await p.evaluate(() => { show('skills'); const b = document.querySelector('#agbtn'), m = document.querySelector('#agmenu'); b.click(); const a = !m.hidden && m.querySelector('.on').dataset.sv === 'skills'; document.body.click(); const z1 = m.hidden; b.click(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return a && z1 && m.hidden }));
  await p.evaluate(() => { themeSet('dark') });
  check('Farbschema wird gespeichert', await p.evaluate(() => JSON.parse(localStorage.getItem('cos-ui')).theme === 'dark'));
  await p.evaluate(() => { themeSet('light'); show('org') });
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200);
  const mob = await p.evaluate(() => ({ hdrH: document.querySelector('header').offsetHeight, over: [...document.querySelectorAll('header *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('nav') }).length }));
  check('Handy: Kopfzeile ohne Überlauf (Leiste wischbar)', mob.over === 0 && mob.hdrH < 140, JSON.stringify(mob));
  if (SHOT) await p.screenshot({ path: SHOT + '/e5-kopf-mobil.png' });
  await p.setViewportSize({ width: 1440, height: 900 });
  // ----- Datenstand 2 -----
  const st = await p.evaluate(() => { const S = window.__S, j = k => S['jobs/' + k] || null;
    return { schema: (S['meta/config'].settings || {}).schema, a190: j('A-190'), a191: j('A-191'), a150: j('A-150'), z: S['zaehler/auftrag'],
      arch: Object.keys(S).filter(k => k.startsWith('archiv/')).map(k => S[k]), ohneOrg: Object.keys(S).filter(k => k.startsWith('jobs/') && !S[k].org).length,
      geladen: AU.map(x => x.id), subs: window.__L.size }; });
  check('Umstellung: Datenstand 3', st.schema === 3);
  check('Datenstand 3: Mandanten, Inhaber und Mandantenregel aus dem Code in die Einstellungen', await p.evaluate(() => { const c = window.__S['meta/config']; return (c.settings.bodoOrgs || []).length === 2 && c.settings.inhaber === 'us-boris-hose' && (c.globals || []).some(g => g.includes('BusinessActs')) }));
  check('Umstellung: Abbruch wird Zustand cancel', st.a190 && st.a190.st === 'cancel' && /^\d{4}-\d\d-\d\d$/.test(st.a190.fTag || ''), JSON.stringify(st.a190 && [st.a190.st, st.a190.fTag]));
  check('Umstellung: Erledigt bekommt Datum aus dem Verlauf', st.a191 && !!st.a191.fertig && st.a191.fMon === st.a191.fTag.slice(0, 7));
  check('Umstellung: alle Aufträge haben eine Organisation', st.ohneOrg === 0, String(st.ohneOrg));
  check('Umstellung: Zähler steht auf höchster Nummer', st.z && st.z.n >= 203, JSON.stringify(st.z));
  check('Archiv: alter Auftrag verschoben und gelöscht', !st.a150 && st.arch.some(a => (a.items || []).some(x => x.id === 'A-150' && !x.vorschau)), JSON.stringify(st.arch).slice(0, 120));
  check('Laden: offene und neue erledigte Aufträge da, altes Archiv nicht', st.geladen.includes('A-201') && st.geladen.includes('A-190') && !st.geladen.includes('A-150'));
  check('Beobachten: zwei Abfragen laufen', st.subs === 2, String(st.subs));
  check('Anzeige: Abgebrochen', await p.evaluate(() => okTxt(AU.find(j => j.id === 'A-190'))[1].includes('Abgebrochen')));
  const nums = await p.evaluate(async () => Promise.all([nextJobNo(), nextJobNo(), nextJobNo()]));
  check('Auftragsnummern eindeutig und fortlaufend', new Set(nums).size === 3 && Math.min(...nums) > 203, nums.join(','));
  const fremd = await p.evaluate(async () => { window.__LS['zaehler/auftrag'] = { h: 'anderes-fenster', e: Date.now() + 60000 }; const t = Date.now(); const n = await nextJobNo(); return { n, ms: Date.now() - t, ex: !!window.__S['jobs/A-' + n] }; });
  check('Auftragsnummer bei fremder Sperre: wartet, dann Ausweichweg ohne Dublette', !fremd.ex && fremd.n > Math.max(...nums) && fremd.ms > 1500, JSON.stringify(fremd));
  await p.evaluate(async () => { await Store.update('jobs/A-202', { st: 'done', ok: 'ja', log: [['16.10. 10:00', 'Auftrag fertig']] }); });
  await p.waitForTimeout(1500);
  const a202 = await p.evaluate(() => ({ db: window.__S['jobs/A-202'], ui: (AU.find(j => j.id === 'A-202') || {}).st }));
  check('Fertig vom Runner ohne Datum: Datum nachgetragen, bleibt sichtbar, nichts gelöscht', a202.db && a202.db.fTag && a202.ui === 'done', JSON.stringify([a202.db && a202.db.fTag, a202.ui]));
  await p.evaluate(() => { const j = AU.find(j => j.id === 'A-203'); j.st = 'cancel'; markDone(j); schedule(); }); await p.waitForTimeout(1500);
  check('Speichern löscht keine Aufträge', await p.evaluate(() => !__W.some(k => k.startsWith('-jobs/') && k !== '-jobs/A-150')), '');
  await p.evaluate(() => { delete window.__LS['zaehler/auftrag']; document.getElementById('modal').innerHTML = ''; startModal(null); }); await p.waitForTimeout(300);
  await p.fill('#modal #ji', 'Testauftrag aus dem Smoke-Test'); await p.click('#modal #go'); await p.waitForTimeout(1500);
  const tst = await p.evaluate(() => (document.querySelector('.toast') || {}).textContent || '');
  const neu = await p.evaluate(() => { const k = Object.keys(window.__S).filter(k => /^jobs\/A-2\d\d$/.test(k)).sort().pop(); return { k, j: window.__S[k], fired: __C.includes('fire_trigger') }; });
  check('Neuer KI-Auftrag: Nummer vom Zähler, Protokoll 2, Claude angestoßen', +neu.k.slice(7) > 207 && neu.j.pv === 2 && neu.fired, JSON.stringify([neu.k, neu.j && neu.j.pv, neu.fired, tst]));
  // ----- v58 Projekte -----
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; OC = ORGS()[0].id; show('projects') }); await p.waitForTimeout(300);
  check('Projekte: Reiter sichtbar mit „Ohne Projekt“', await p.evaluate(() => !document.querySelector('#projects').classList.contains('hide') && !!document.querySelector('[data-pj="_ohne"]')));
  await p.evaluate(() => pjBackendDlg(null)); await p.waitForTimeout(500);
  check('Projekte: Bodo-Projekte werden gelistet', (await p.$$('#modal [data-pbc]')).length === 2);
  await p.evaluate(() => { document.querySelectorAll('#modal [data-pbc]').forEach(c => { c.checked = true; c.dispatchEvent(new Event('change')) }); document.querySelector('#pbok').click() }); await p.waitForTimeout(1200);
  const pjI = await p.evaluate(() => ({ n: PJ.length, bk: PJ.every(x => x.bk && x.bk.sys === 'bodo' && x.bk.orgId), db: Object.keys(window.__S).filter(k => k.startsWith('projects/')).length, cards: document.querySelectorAll('#pjl [data-pj]').length, inp: (window.__CI || []).filter(x => x && x.resourceType === 'project').pop() }));
  check('Projekte: Übernahme legt verbundene Projekte an und speichert sie', pjI.n === 2 && pjI.bk && pjI.db === 2 && pjI.cards === 3 && pjI.inp.achsen.status === 'aktiv', JSON.stringify(pjI));
  if (SHOT) await p.screenshot({ path: SHOT + '/e6-projekte.png' });
  await p.evaluate(() => { const x = PJ[0]; startModal(null, { org: x.org, prj: x.id }) }); await p.waitForTimeout(300);
  check('Projekte: Startfenster übernimmt das Projekt', await p.evaluate(() => document.querySelector('#jprj').value === PJ[0].id));
  await p.fill('#modal #ji', 'Projektauftrag'); await p.click('#modal #go'); await p.waitForTimeout(1500);
  const pjA = await p.evaluate(() => { const j = AU.find(x => x.in === 'Projektauftrag'), t = (window.__CI || []).filter(x => x && x.text).map(x => x.text).pop() || ''; return { prj: j && j.prj, db: j && (window.__S['jobs/' + j.id] || {}).prj, ctx: t.includes('PROJEKT des Auftrags') && t.includes('projectId ' + PJ[0].bk.id), id: j && j.id } });
  check('Projekte: Auftrag trägt Projekt, Claude bekommt Projekt und Bodo-Projekt-ID', pjA.prj === pjA.db && !!pjA.prj && pjA.ctx, JSON.stringify(pjA));
  await p.evaluate(() => { show('projects'); PJSEL = PJ[0].id; prj() }); await p.waitForTimeout(300);
  check('Projekte: Detail listet den Auftrag offen', await p.evaluate(id => !!document.querySelector('#pjd [data-pjj="' + id + '"]'), pjA.id));
  await p.evaluate(id => resultModal(AU.find(j => j.id === id)), pjA.id); await p.waitForTimeout(300);
  await p.evaluate(() => { const s = document.querySelector('#rprj'); s.value = PJ[1].id; s.dispatchEvent(new Event('change')) }); await p.waitForTimeout(500);
  check('Projekte: Zuordnung im Ergebnisfenster ändern speichert nur prj', await p.evaluate(id => window.__S['jobs/' + id].prj === PJ[1].id, pjA.id));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; show('projects'); PJSEL = '_ohne'; prj() }); await p.waitForTimeout(300);
  check('Projekte: „Ohne Projekt“ zeigt Aufträge ohne Zuordnung', await p.evaluate(() => document.querySelectorAll('#pjd [data-pjj]').length > 0));
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200);
  check('Projekte: Handy ohne seitliches Scrollen', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '');
  await p.setViewportSize({ width: 1440, height: 900 });
  // ----- v59 Verbrauch -----
  const vbr = await p.evaluate(async id => { const j = AU.find(x => x.id === id); j.verb = [{ sess: 'x', art: 'start', sek: 125, tin: 10, tcw: 2000, tcr: 50000, tout: 800 }, { sess: 'y', art: 'fortsetzen', sek: 65, tin: 5, tcw: 1000, tcr: 20000, tout: 400 }, { sess: 'z', fehler: 'kein Protokoll' }];
    resultModal(j); await new Promise(r => setTimeout(r, 200)); const t = document.querySelector('#box').textContent; document.getElementById('modal').innerHTML = '';
    show('projects'); PJSEL = j.prj; prj(); const d = document.querySelector('#pjd').textContent; return { a: vbJob(j), tok: vbTok(vbJob(j)), t: t.includes('3:10 min') && t.includes('2 Sitzungen gemessen') && t.includes('kein Protokoll'), d: d.includes('3:10 min') && d.includes('1 von 1'), arch: vbArchiv(j) } }, pjA.id);
  check('Verbrauch: Summe je Auftrag, Anzeige im Ergebnis und im Projekt, Archiv-Kurzfassung', vbr.a.sek === 190 && vbr.tok === 74215 && vbr.t && vbr.d && vbr.arch.sek === 190, JSON.stringify(vbr));
  if (SHOT) await p.screenshot({ path: SHOT + '/e7-verbrauch.png' });
  // ----- v60 Anbindungen -----
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; show('settings'); einst('dienste') }); await p.waitForTimeout(300);
  const an0 = await p.evaluate(() => { const o = ORGS()[0], q = s => document.querySelector(s);
    const z = q(`[data-ds="${o.id}|zeit"] option[value="sellify"]`); return { rows: document.querySelectorAll('.drow').length, zeitSellifyAus: !!z && z.disabled && /Hersteller/.test(z.title) } });
  check('Anbindungen: vier Dienste je Organigramm, Zeiterfassung mit sellify ausgegraut mit Hinweis', an0.rows === 4 * (await p.evaluate(() => ORGS().length)) && an0.zeitSellifyAus, JSON.stringify(an0));
  await p.evaluate(() => { const o = ORGS()[0], set = (sel, v) => { const e = document.querySelector(sel); e.value = v; e.dispatchEvent(new Event('change')) };
    set(`[data-ds="${o.id}|crm"]`, 'bodo'); set(`[data-dm="${o.id}|crm"]`, ownOrgs()[0].id); set(`[data-ds="${o.id}|projekt"]`, 'bodo'); set(`[data-ds="${o.id}|auftrag"]`, 'sellify') }); await p.waitForTimeout(200);
  const an1 = await p.evaluate(async () => { const o = ORGS()[0]; const r = await dienstPruefen(o); return { d: o.dienste, r: r.erg, ctx: dienstKontext(o) } });
  check('Anbindungen: Mandant wird für weitere Bodo-Dienste übernommen, Entität vorbelegt', an1.d.crm.ent === 'contact' && an1.d.projekt.orgId === an1.d.crm.orgId && an1.d.auftrag.sys === 'sellify' && !an1.d.auftrag.orgId, JSON.stringify(an1.d));
  check('Anbindungen: Verbindung prüfen (Bodo ok, sellify nur Hinweis) und Kontext für Claude', an1.r.crm.st === 'ok' && an1.r.projekt.st === 'ok' && an1.r.auftrag.st === 'info' && an1.ctx.includes('ANBINDUNGEN') && an1.ctx.includes('Entität contact'), JSON.stringify([an1.r, an1.ctx]));
  if (SHOT) { await p.evaluate(() => einst('dienste')); await p.waitForTimeout(200); await p.screenshot({ path: SHOT + '/e8-anbindungen.png', fullPage: true }) }
  check('Datenspur im Ergebnisfenster', await p.evaluate(() => { const j = AU.find(x => x.ki); j.spur = [{ dienst: 'projekt', sys: 'bodo', orgN: 'Bodo Solutions', ent: 'task', id: 't1', url: 'https://bodo-app.com/x', akt: 'angelegt' }]; resultModal(j); const ok = document.querySelector('#box').textContent.includes('Datenspur (1)'); document.getElementById('modal').innerHTML = ''; return ok }));
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => einst('dienste')); await p.waitForTimeout(200);
  check('Anbindungen: Handy ohne seitliches Scrollen', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await p.setViewportSize({ width: 1440, height: 900 });
  // ----- v61 Etappe 4c: Handy -----
  await p.setViewportSize({ width: 360, height: 800 });
  const m4c = await p.evaluate(async () => { const R = {}; for (const v of ['org', 'jobs', 'projects', 'flows', 'build', 'skills', 'matrix', 'users', 'settings']) { document.getElementById('modal').innerHTML = ''; show(v); await new Promise(r => setTimeout(r, 150)); R[v] = document.documentElement.scrollWidth } show('org'); await new Promise(r => setTimeout(r, 150));
    const d = [...document.querySelectorAll('.odept')].map(e => e.getBoundingClientRect()); return { R, stacked: d.length > 1 && d[1].top > d[0].bottom - 1 && d.every(b => b.right <= innerWidth + 1), w: innerWidth } });
  check('Handy (360 px): Organigramm untereinander, keine Ansicht scrollt seitlich', m4c.stacked && Object.values(m4c.R).every(x => x <= m4c.w + 1), JSON.stringify(m4c));
  await p.setViewportSize({ width: 1440, height: 900 }); await p.evaluate(() => show('org'));
  check('Breit: Organigramm bleibt nebeneinander', await p.evaluate(() => { const d = [...document.querySelectorAll('.odept')].map(e => e.getBoundingClientRect()); return d.length > 1 && Math.abs(d[1].top - d[0].top) < 2 }));
  // ----- v62 sellify-Projekte -----
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; show('projects'); pjBackendDlg(null, 'sellify') }); await p.waitForTimeout(500);
  check('sellify-Projekte: Liste aus sellify, kein Mandant nötig', await p.evaluate(() => document.querySelectorAll('#modal [data-pbc]').length === 2 && /kein Mandant/.test(document.querySelector('#pbmf').textContent)));
  await p.evaluate(() => { document.querySelectorAll('#modal [data-pbc]').forEach(c => { c.checked = true; c.dispatchEvent(new Event('change')) }); document.querySelector('#pbok').click() }); await p.waitForTimeout(800);
  const sfp = await p.evaluate(() => { const x = PJ.find(q => q.bk && q.bk.sys === 'sellify'); const j = { prj: x && x.id }; return { n: PJ.filter(q => q.bk && q.bk.sys === 'sellify').length, id: x && x.bk.id, ctx: x ? pjKontext(j) : '', inp: (window.__CI || []).filter(i => i && i.action === 'list').pop() } });
  check('sellify-Projekte: übernommen, verbunden, Kontext nennt sellify-Projekt-Id', sfp.n === 2 && sfp.id === '3' && sfp.ctx.includes('sellify-Projekt') && sfp.ctx.includes('Projekt-Id 3') && sfp.inp.params.done === false, JSON.stringify(sfp));
  await p.evaluate(() => { pjBackendDlg(null, 'sellify') }); await p.waitForTimeout(500);
  check('sellify-Projekte: bereits verbundene sind gesperrt', await p.evaluate(() => [...document.querySelectorAll('#modal [data-pbc]')].every(c => c.disabled)));
  const sfc = await p.evaluate(async () => { document.getElementById('modal').innerHTML = ''; const o = ORGS()[0]; o.dienste.projekt = { sys: 'sellify', ent: 'project' }; const r = await dienstPruefen(o); return r.erg.projekt });
  check('Anbindungen: sellify-Projekt wird geprüft', sfc.st === 'ok', JSON.stringify(sfc));
  // ----- v63 Seitenweise laden -----
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; pjBackendDlg(null, 'sellify') }); await p.waitForTimeout(400);
  await p.fill('#pbq', 'viele'); await p.waitForTimeout(900);
  const pg1 = await p.evaluate(() => ({ n: document.querySelectorAll('#modal [data-pbc]').length, more: !!document.querySelector('#pbmore'), inp: (window.__CI || []).filter(i => i && i.params && i.params.q === 'viele').pop() }));
  check('Paging: erste Seite 25, neueste zuerst (sort -registered), „Weitere laden“', pg1.n === 25 && pg1.more && pg1.inp.params.limit === 25 && pg1.inp.params.sort === '-registered' && pg1.inp.params.offset === 0, JSON.stringify(pg1));
  await p.evaluate(() => { const c = document.querySelector('#modal [data-pbc]'); c.checked = true; c.dispatchEvent(new Event('change')); document.querySelector('#pbmore').click() }); await p.waitForTimeout(500);
  const pg2 = await p.evaluate(() => ({ n: document.querySelectorAll('#modal [data-pbc]').length, more: !!document.querySelector('#pbmore'), keep: document.querySelector('#modal [data-pbc]').checked, txt: document.querySelector('.pbfoot').textContent, off: (window.__CI || []).filter(i => i && i.params && i.params.q === 'viele').pop().params.offset }));
  check('Paging: zweite Seite angehängt, Auswahl bleibt, Ende erkannt', pg2.n === 30 && !pg2.more && pg2.keep && pg2.off === 25 && pg2.txt.includes('30 von 30'), JSON.stringify(pg2));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = ''; pjBackendDlg(null, 'bodo') }); await p.waitForTimeout(500);
  check('Paging Bodo: 25 je Abruf, Hinweis zur Reihenfolge', await p.evaluate(() => { const i = (window.__CI || []).filter(x => x && x.resourceType === 'project').pop(); return i.limit === 25 && !i.cursor && /alphabetisch/.test(document.querySelector('.pbfoot').textContent) }));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  // ----- v64 Projekt: Ansicht und Bearbeiten -----
  const pjE = await p.evaluate(async () => { document.getElementById('modal').innerHTML = ''; show('projects'); const x = PJ[0]; PJSEL = x.id; prj(); const R = {};
    R.view = !document.querySelector('#pjn') && !!document.querySelector('#pjed') && !!document.querySelector('#pjgo');
    document.querySelector('#pjed').click(); R.edit = !!document.querySelector('#pjn') && !document.querySelector('#pjgo');
    const alt = x.n; const n = document.querySelector('#pjn'); n.value = 'Umbenannt'; n.dispatchEvent(new Event('input'));
    R.blockt = (() => { const b = document.querySelector('[data-pjo]'); const oc = OC; b.click(); return OC === oc && !!EDIT })();
    document.querySelector('[data-ecancel]').click(); R.zurueck = x.n === alt && !document.querySelector('#pjn');
    document.querySelector('#pjed').click(); const m = document.querySelector('#pjn'); m.value = 'Gespeichert X'; m.dispatchEvent(new Event('input'));
    document.querySelector('[data-esave]').click(); await new Promise(r => setTimeout(r, 1200)); R.saved = (window.__S['projects/' + x.id] || {}).n === 'Gespeichert X' && !EDIT;
    const vor = PJ.length; document.querySelector('#pjnew').click(); R.neuEdit = PJ.length === vor + 1 && !!document.querySelector('#pjn'); const nid = PJSEL;
    document.querySelector('[data-ecancel]').click(); await new Promise(r => setTimeout(r, 900)); R.neuWeg = PJ.length === vor && !window.__S['projects/' + nid];
    return R });
  check('Projekt: startet in der Ansicht, ✎ Bearbeiten, Abbrechen verwirft, Speichern speichert, Wechsel gesperrt, Neues Projekt im Bearbeiten', Object.values(pjE).every(Boolean), JSON.stringify(pjE));
  // ----- v65 Agenten-Menü auf dem Handy -----
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => show('org')); await p.waitForTimeout(200);
  const mm = await p.evaluate(() => { const b = document.querySelector('#agbtn'); b.scrollIntoView({ inline: 'nearest' }); b.click(); const r = document.querySelector('#agmenu').getBoundingClientRect(), br = b.getBoundingClientRect(); const ok = !document.querySelector('#agmenu').hidden && r.left >= 0 && r.right <= innerWidth && r.top >= br.bottom; document.body.click(); return { ok, r: [r.left, r.right, r.top], b: [br.left, br.bottom] } });
  check('Agenten ▾ auf dem Handy: Liste unter dem Knopf, ganz sichtbar', mm.ok, JSON.stringify(mm));
  if (SHOT) { await p.evaluate(() => document.querySelector('#agbtn').click()); await p.screenshot({ path: SHOT + '/e9-agmenu-mobil.png' }); await p.evaluate(() => document.body.click()) }
  await p.setViewportSize({ width: 1440, height: 900 });
  // ----- v66 Benutzer in den Einstellungen -----
  const bu = await p.evaluate(async () => { show('settings'); einst('darst'); document.querySelector('[data-sets="users"]').click(); await new Promise(r => setTimeout(r, 150));
    const R = { nav: document.querySelectorAll('#setnav [data-sets]').length === SETSEC.length && SETSEC.length === 7, on: document.querySelector('#setnav .on').dataset.sets === 'users', liste: document.querySelectorAll('#setu #ulist .uitem').length > 0, edit: !!document.querySelector('#setu #uedit .etop'), setcAus: document.querySelector('#setc').hidden, kein: !document.querySelector('main#users') };
    document.querySelector('[data-sets="ausf"]').click(); R.zurueck = !document.querySelector('#setc').hidden && document.querySelector('#setu').hidden && /Ausführung/.test(document.querySelector('#setc').textContent); return R });
  check('Benutzer eingebettet: Menü links bleibt, Liste und Bearbeitung rechts, Wechsel zurück', Object.values(bu).every(Boolean), JSON.stringify(bu));
  // ----- v67 Benutzerliste gleich hoch, Scrollbar bei vielen -----
  const uh = await p.evaluate(async () => { show('settings'); einst('users'); await new Promise(r => setTimeout(r, 150));
    const h = () => [document.querySelector('#ulp').getBoundingClientRect().height, document.querySelector('#uedit').getBoundingClientRect().height];
    const [a1, b1] = h(); const n0 = US.length; for (let i = 0; i < 30; i++) US.push({ id: 'tmp-u' + i, n: 'Test ' + i, maps: [] }); users(); await new Promise(r => setTimeout(r, 100));
    const [a2, b2] = h(), L = document.querySelector('#ulist'), sc = L.scrollHeight > L.clientHeight + 5; US.splice(n0); users();
    return { gleich1: Math.abs(a1 - b1) < 2, gleich2: Math.abs(a2 - b2) < 2, nichtGewachsen: Math.abs(b2 - b1) < 2, sc, h: [a1, b1, a2, b2] } });
  check('Benutzer: Liste so hoch wie „Benutzer bearbeiten“, bei vielen Benutzern Scrollbar', uh.gleich1 && uh.gleich2 && uh.nichtGewachsen && uh.sc, JSON.stringify(uh));
  // ----- v68 Zuordnungen nur systemseitig -----
  const zu = await p.evaluate(async () => { show('settings'); einst('users'); ucur = US.findIndex(u => u.n === 'Boris Hose'); const u = US[ucur]; u.maps = []; users(); await new Promise(r => setTimeout(r, 100));
    const R = { keineFelder: !document.querySelector('#uedit table.map input, #uedit table.map select'), keinHand: !document.querySelector('#madd'), fehlt: document.querySelectorAll('#uedit tr.mfehlt').length >= 1 };
    const soll = uSoll(u).length; document.querySelector('[data-mfind]').click(); await new Promise(r => setTimeout(r, 400));
    R.zugeordnet = u.maps.length === 1 && u.maps[0].quelle === 'aus Bodo gelesen' && !!u.maps[0].extId; R.restFehlt = document.querySelectorAll('#uedit tr.mfehlt').length === soll - 1;
    document.querySelector('#uedbtn').click(); R.editOhneFelder = !document.querySelector('#uedit table.map input') && !!document.querySelector('#uedit [data-mx]'); document.querySelector('[data-ecancel]').click();
    u.maps = []; await syncUser(u); R.abgleichFuellt = u.maps.length === soll; u.maps = []; users(); return R });
  check('Zuordnungen: nicht von Hand änderbar, fehlende Mandanten sichtbar, systemseitig suchen und abgleichen', Object.values(zu).every(Boolean), JSON.stringify(zu));
  // ----- v69 sellify-Benutzer -----
  const sfu = await p.evaluate(async () => { show('settings'); einst('users'); ucur = US.findIndex(u => u.n === 'Boris Hose'); const u = US[ucur]; u.maps = []; const o = ORGS()[0]; o.dienste = { ...(o.dienste || {}), auftrag: { sys: 'sellify', ent: 'sale' } }; u.orgs = [o.id]; users(); await new Promise(r => setTimeout(r, 100));
    const b = document.querySelector('[data-mfind^="sellify|"]'); const R = { zeile: !!b && /sellify/.test(b.textContent) }; b.click(); await new Promise(r => setTimeout(r, 400));
    const m = u.maps.find(x => x.sys === 'sellify'); R.map = !!m && m.extId === '429' && m.userId === 'Ho' && m.quelle === 'aus sellify gelesen';
    const inp = (window.__CI || []).filter(i => i && i.action === 'list' && i.params && i.params.q === 'Hose').pop(); R.suche = !!inp;
    u.maps = []; await syncUser(u); R.abgleich = u.maps.some(x => x.sys === 'sellify') && u.maps.some(x => x.sys === 'bodo'); u.maps = []; users(); return R });
  check('sellify-Benutzer: fehlende Zuordnung sichtbar, Suche über sellify, Abgleich ergänzt Bodo und sellify', Object.values(sfu).every(Boolean), JSON.stringify(sfu));
  // ----- v70 Adapter -----
  const BER = JSON.parse(fs.readFileSync(path.join(ROOT, 'berechtigungen.json'), 'utf8'));
  const ad = await p.evaluate(async (ber) => { const R = {};
    const L = adapterListe(); R.anzahl = L.length >= 2 && L.map(a => a.id).join() === 'bodo,sellify';
    R.vertrag = L.every(a => ADAPTER_PFLICHT.every(k => k in a) && DIENSTE.every(([k]) => Array.isArray(a.ent[k])) && Object.isFrozen(a));
    R.unvollstaendig = (() => { try { adapterRegistrieren({ id: 'x' }); return false } catch (e) { return /unvollständig/.test(e.message) && !adapter('x') } })();
    R.berechtigt = adapterWerkzeuge().every(w => { const s = ber.mcp.servers.find(x => x.server === w.server); return s && w.tools.every(t => s.tools.includes(t)) });
    R.namen = sysName('bodo') === 'Bodo' && sysName('sellify') === 'sellify' && sysName('andere') === 'Anderes System';
    const M = ADAPTER.bodo.mandanten()[0];
    const pb = await ADAPTER.bodo.projekte({ mand: M, q: '', alle: false, next: null }); R.bodoPj = pb.items.length === 2 && pb.items[0].id === 'bp1' && pb.items[0].st === 'aktiv' && pb.items[0].owner === 'Boris Hose' && !pb.neuZuerst && pb.next === null;
    const ps = await ADAPTER.sellify.projekte({ q: '', alle: false, next: null }); R.sfPj = ps.items.length === 2 && ps.items[0].title === 'Prozessoptimierung Muster (10019)' && ps.items[0].owner === 'Boris Hose' && ps.neuZuerst && ps.total === 2;
    const bs = await ADAPTER.bodo.benutzerSuchen({ mand: M, name: 'Boris Hose', mail: '' }); R.bodoU = bs.length === 1 && bs[0].status === 'active';
    const ss = await ADAPTER.sellify.benutzerSuchen({ name: 'Boris Hose', mail: '' }); R.sfU = ss.length === 1 && ss[0].membershipId === '429' && ss[0].roleNames[0] === 'Full access';
    const ctx = {}; const c1 = await ADAPTER.bodo.pruefen({ sys: 'bodo', orgId: M.id, orgN: M.name, ent: 'project' }, 'projekt', ctx); R.bodoPruef = c1.st === 'ok' && Array.isArray(ctx.bodoOrgs);
    R.sfPruef = (await ADAPTER.sellify.pruefen({ sys: 'sellify', ent: 'project' }, 'projekt', {})).st === 'ok' && (await ADAPTER.sellify.pruefen({ sys: 'sellify', ent: 'sale' }, 'crm', {})).st === 'info';
    R.fehler = /Konnektoren „sellify“/.test(ADAPTER.sellify.fehler({ code: 'server_not_connected' })) && /„bodo solutions“/.test(ADAPTER.bodo.fehler({ code: 'server_not_connected' }));
    const kb = ADAPTER.bodo.projektKontext({ sys: 'bodo', id: 'bp1', n: 'X', orgId: 'o1', orgN: 'Muster', url: 'u' }); R.kontext = /projectId bp1/.test(kb.wo) && /Mandant für diese Anlagen ist Muster/.test(kb.ziel);
    return R }, BER);
  check('Adapter: Vertrag vollständig, Berechtigungen passen, Projekte/Benutzer/Prüfung/Fehler/Kontext je System richtig', Object.values(ad).every(Boolean), JSON.stringify(ad));
  // ----- v71 Agenten im Organigramm anlegen und bearbeiten -----
  await p.setViewportSize({ width: 1400, height: 900 });
  const ga = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const R = {}; const $q = s => document.querySelector(s);
    document.getElementById('modal').innerHTML = ''; show('org'); OC = ORGS()[0].id; org(); const O = orgById(OC), d = deptsOf(OC)[0];
    R.knoepfe = document.querySelectorAll('#orgv .oadd').length > deptsOf(OC).length - 1 && document.querySelectorAll('#orgv .oedit').length === document.querySelectorAll('#orgv .oag').length;
    const vor = AG.length; $q(`[data-oadd="${d.id}|"]`).click(); await w(100);
    R.titel = /Neuer Agent in „/.test($q('#gwh').textContent) && $q('#gwh').textContent.includes(d.n);
    R.produkt = !$q('#gwp') && !$q('#gwa') && $q('.gwfest').textContent.includes(PN[O.prod || 'all']) && $q('.gwfest').textContent.includes(d.n);
    $q('#gww').click(); R.pflicht = $q('#gwerr').style.display !== 'none' && !!$q('#gwn');
    const n = $q('#gwn'); n.value = 'Testagent Assistent'; n.dispatchEvent(new Event('input')); const r = $q('#gwr'); r.value = 'Prüft den Assistenten.'; r.dispatchEvent(new Event('input'));
    $q('#gww').click(); await w(80); R.zugeklappt = !$q('#gwkat [data-pks]') && document.querySelectorAll('#gwkat [data-pko]').length > 1;
    R.kiVorschlag = document.querySelectorAll('#gwki [data-kiv]').length === 2 && /SKILL-KATALOG/.test(window.__SMPP) && window.__SMPP.includes('Prüft den Assistenten.');
    $q('#gwki [data-kiv="kontakt-anlegen"]').click(); R.kiUebernommen = $q('#gwsn').textContent === 'Ausgewählt (1)' && /übernommen/.test($q('#gwki [data-kiv="kontakt-anlegen"]').textContent);
    $q('#gwki [data-kiv="kontakt-anlegen"]').click(); R.kiZurueck = $q('#gwsn').textContent === 'Ausgewählt (0)';
    $q('#gwkat [data-pko]').click(); const c = $q('#gwkat [data-pks]'); R.katalog = !!c && !!$q('#pkq') && !!$q('#pkonly');
    c.checked = true; c.dispatchEvent(new Event('change')); R.gewaehlt = $q('#gwsn').textContent === 'Ausgewählt (1)';
    $q('#gwsl [data-gwx]').click(); R.entfernt = $q('#gwsn').textContent === 'Ausgewählt (0)' && !$q('#gwkat [data-pks]').checked;
    const c2 = $q('#gwkat [data-pks]'); c2.checked = true; c2.dispatchEvent(new Event('change'));
    const nR = skRegeln(sk(c2.dataset.pks), O.prod || 'all').length;
    $q('#gww').click(); R.skillRegeln = document.querySelectorAll('.gwrs').length === 1 && document.querySelectorAll('.gwrs .lprule').length === nR && !document.querySelector('[data-gwgl]');
    const o = $q('#gwown'); o.value = 'Nie ohne Freigabe versenden'; o.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); R.regel = document.querySelectorAll('[data-gwro]').length === 1;
    $q('#gww').click(); R.zusammen = $q('.gwsum').textContent.includes('Testagent Assistent') && $q('.gwsum').textContent.includes(d.n);
    R.nochNicht = AG.length === vor; $q('#gwok').click(); await w(1300);
    const a = AG.find(x => x.n === 'Testagent Assistent'); R.angelegt = !!a && AG.length === vor + 1 && PL(a, OC).abt === d.id && a.s.length === 1 && a.own.length === 1 && a.r === 'Prüft den Assistenten.';
    R.gespeichert = !!window.__S['agents/' + a.id]; R.imOrg = !!document.querySelector(`#orgv [data-oa="${a.id}"]`);
    $q('#gwgo').click(); await w(150); R.auftrag = !!$q('#modal').innerHTML && !$q('#gwh');
    document.getElementById('modal').innerHTML = ''; org();
    // Abbrechen verwirft den Entwurf
    $q(`[data-oadd="${d.id}|"]`).click(); await w(50); const n2 = $q('#gwn'); n2.value = 'Wird verworfen'; n2.dispatchEvent(new Event('input')); $q('#gwx').click(); await w(50);
    $q('#dlg [data-yes]').click(); await w(50); R.verworfen = !AG.some(x => x.n === 'Wird verworfen') && !$q('#gwh');
    // doppelter Name wird abgewiesen
    $q(`[data-oadd="${d.id}|"]`).click(); await w(50); const n3 = $q('#gwn'); n3.value = 'testagent assistent'; n3.dispatchEvent(new Event('input')); $q('#gww').click(); R.doppelt = /gibt es schon/.test($q('#gwerr').textContent) && !!$q('#gwn');
    document.getElementById('modal').innerHTML = '';
    // Bearbeiten über ✎: gleiche Kopie, Speichern übernimmt, Objekt bleibt dasselbe
    $q(`#orgv [data-oed="${a.id}"]`).click(); await w(50); R.bearbTitel = /bearbeiten/.test($q('#gwh').textContent) && document.querySelectorAll('#gwst [data-gws]').length === 3;
    const n4 = $q('#gwn'); n4.value = 'Testagent Umbenannt'; n4.dispatchEvent(new Event('input')); R.nichtSofort = a.n === 'Testagent Assistent';
    $q('#gwok').click(); await w(1300); R.bearbeitet = AG.includes(a) && a.n === 'Testagent Umbenannt' && (window.__S['agents/' + a.id] || {}).n === 'Testagent Umbenannt';
    document.getElementById('modal').innerHTML = ''; const dl = $q('#dlg'); if (dl) dl.remove();
    // im Bearbeitungsmodus des Organigramms keine Assistent-Knöpfe
    $q('#orgedit').click(); R.editAus = !document.querySelector('#orgv .oadd') && !document.querySelector('#orgv .oedit'); $q('#orged [data-ecancel]').click();
    // Skill-Auswahl im Agenten-Editor nutzt dieselbe Komponente
    skPick(a); await w(50); $q('#pkauf').click(); const c3 = [...document.querySelectorAll('#pkt [data-pks]')].find(x => !x.checked); c3.checked = true; c3.dispatchEvent(new Event('change')); R.skPick = /1 hinzu/.test($q('#pkcnt').textContent); $q('#pkno').click(); R.skPickUnveraendert = a.s.length === 1;
    AG.splice(AG.indexOf(a), 1); schedule(); org(); return R });
  check('Agent im Organigramm: + Agent, 4 Schritte, Pflichtname, Skills aus dem Katalog, Regeln, Anlegen erst bei Bestätigung, Auftrag, Abbrechen, Bearbeiten über ✎', Object.values(ga).every(Boolean), JSON.stringify(ga));
  // ----- v72 Skill-Gruppen: feste Ids, Aufklappen, Einstellungen -----
  const gr = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const R = {}; const $q = s => document.querySelector(s);
    document.getElementById('modal').innerHTML = '';
    R.migriert = GR.length === 9 && GR.every(g => g && typeof g.id === 'string' && g.n) && SK.every(s => grById(s.g)) && sk('kontakt-anlegen').g === GR[0].id && sk('xlsx').g === GR[7].id;
    await w(1200); R.gespeichert = (window.__S['meta/config'].groups || []).every(g => g && g.id) && window.__S['skills/kontakt-anlegen'].g === GR[0].id;
    show('skills'); [...GR, GR_OHNE].forEach(g => COL.add(g.id)); lib(); R.libZu = document.querySelectorAll('#lib .grp.col').length === document.querySelectorAll('#lib .grp').length;
    $q('#lib [data-tg]').click(); R.libAuf = document.querySelectorAll('#lib .grp:not(.col)').length === 1;
    // Einstellungen › Skill-Gruppen
    show('settings'); einst('sgr'); R.ansicht = document.querySelectorAll('.grt tbody tr').length === 9 && !$q('[data-grn]');
    $q('#grped .ebtn').click(); R.edit = document.querySelectorAll('[data-grn]').length === 9;
    const g0 = GR[0], g1 = GR[1]; $q('[data-grd="0"]').click(); R.ordnen = GR[0] === g1 && GR[1] === g0;
    const i = $q(`[data-grn="${g0.id}"]`); i.value = 'Umbenannt'; i.dispatchEvent(new Event('change')); R.umbenannt = g0.n === 'Umbenannt';
    $q('[data-ecancel]').click(); R.verworfen = GR[0].n !== 'Umbenannt' && GR[0].id === g0.id && grById(g0.id).n !== 'Umbenannt';
    $q('#grped .ebtn').click(); const k = SK.filter(s => s.g === GR[2].id).length, gid = GR[2].id; $q(`[data-grx="${gid}"]`).click(); await w(50); $q('#dlg [data-yes]').click(); await w(50);
    R.entfernt = !grById(gid) && SK.filter(s => s.g === '').length === k && document.querySelector('.grt tr.dim') !== null;
    $q('#grneu').click(); await w(50); const ti = $q('#dlgin'); ti.value = 'Neue Testgruppe'; $q('#dlg [data-yes]').click(); await w(50);
    R.neu = GR.some(g => g.n === 'Neue Testgruppe' && /^gr-neue-testgruppe/.test(g.id));
    $q('[data-esave]').click(); await w(1200); R.saved = (window.__S['meta/config'].groups || []).some(g => g.n === 'Neue Testgruppe') && !EDIT;
    // Auswahl im Agenten-Editor: zugeklappt, Suche öffnet Gruppen mit Treffern
    const a = AG[0]; skPick(a); await w(50); R.pickZu = !document.querySelector('#pkt [data-pks]'); const q = $q('#pkq'); q.value = 'Kontakt'; q.dispatchEvent(new Event('input'));
    R.sucheAuf = document.querySelectorAll('#pkt [data-pks]').length >= 1; $q('#pkno').click();
    return R });
  check('Skill-Gruppen: Umstellung auf feste Ids und gespeichert, Gruppen auf-/zuklappbar, Einstellungen (ordnen, umbenennen, verwerfen, entfernen, anlegen, speichern), Suche öffnet Gruppen', Object.values(gr).every(Boolean), JSON.stringify(gr));
  // ----- v73 Produktname „Organigraph“ -----
  const pn = await p.evaluate(() => { const R = {}; R.h1 = document.querySelector('header h1').textContent === 'Organigraph';
    R.titel = document.title.startsWith('Organigraph'); R.org = document.querySelector('#orged').parentElement.textContent.includes('Unternehmensorganigramm');
    R.navKurz = document.querySelector('nav [data-v="org"]').textContent === 'Organigramm';
    R.inst = window.__S['meta/config'].settings.inst.n === 'Organigraph business//acts';
    const alt = SET.inst; SET.inst = { n: 'Company OS business//acts' }; R.umbenannt = nameMigrieren() === true && SET.inst.n === 'Organigraph business//acts';
    SET.inst = { n: 'My Company OS' }; R.my = nameMigrieren() && SET.inst.n === 'Organigraph'; R.zweimal = nameMigrieren() === false; SET.inst = alt;
    R.absender = SYSFROM('Company OS') && SYSFROM('Organigraph') && !SYSFROM('Boris');
    R.kein = !document.body.innerText.includes('Company OS'); return R });
  check('Produktname Organigraph: Titel, Kopfzeile, Seitenüberschrift, Instanzname umgestellt, alte Absender erkannt', Object.values(pn).every(Boolean), JSON.stringify(pn));
  check('keine Laufzeitfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  if (process.env.KEEP) fs.copyFileSync(tmp, path.join(ROOT, 'tests', '.keep.html')); fs.unlinkSync(tmp);
  const bad = CHECKS.filter(c => !c.ok).length;
  console.log(bad ? `\n${bad} von ${CHECKS.length} Prüfungen fehlgeschlagen` : `\nalle ${CHECKS.length} Prüfungen bestanden`);
  process.exit(bad ? 1 : 0);
})();
