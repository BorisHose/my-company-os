// Smoke-Test für das Cockpit: baut eine Testseite aus dist/ mit Testdaten und
// einer nachgebildeten Datenbank und prüft die Hauptansichten ohne Fehler.
// Aufruf: node tests/smoke.js   (vorher: python3 build.py)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'dist', 'my-company-os.html'), 'utf8');
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
const mcp={callTool:async(s,tool,inp)=>{__C.push(tool);if(tool==="list_triggers")return {payload:{data:[]}};return {payload:{}}}};
const smp=async()=>({text:""});smp.json=async()=>({});
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
    check('Ansicht ' + v + ' sichtbar', await p.$eval('#' + v, e => getComputedStyle(e).display !== 'none'));
  }
  await p.evaluate(() => show('jobs')); await p.waitForTimeout(300);
  check('KI-Aufträge zeigen Kacheln', (await p.$$('#kb .kc, #kb .kmini')).length > 0);
  await p.evaluate(() => startModal(null)); await p.waitForTimeout(300);
  check('Fenster Neuer KI-Auftrag öffnet', !!(await p.$('#modal .box #ji')));
  await p.evaluate(() => { document.getElementById('modal').innerHTML = '' });
  // ----- Datenstand 2 -----
  const st = await p.evaluate(() => { const S = window.__S, j = k => S['jobs/' + k] || null;
    return { schema: (S['meta/config'].settings || {}).schema, a190: j('A-190'), a191: j('A-191'), a150: j('A-150'), z: S['zaehler/auftrag'],
      arch: Object.keys(S).filter(k => k.startsWith('archiv/')).map(k => S[k]), ohneOrg: Object.keys(S).filter(k => k.startsWith('jobs/') && !S[k].org).length,
      geladen: AU.map(x => x.id), subs: window.__L.size }; });
  check('Umstellung: Datenstand 2', st.schema === 2);
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
  check('Neuer KI-Auftrag: Nummer vom Zähler, Protokoll 2, Claude angestoßen', neu.k === 'jobs/A-208' && neu.j.pv === 2 && neu.fired, JSON.stringify([neu.k, neu.j && neu.j.pv, neu.fired, tst]));
  check('keine Laufzeitfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  fs.unlinkSync(tmp);
  const bad = CHECKS.filter(c => !c.ok).length;
  console.log(bad ? `\n${bad} von ${CHECKS.length} Prüfungen fehlgeschlagen` : `\nalle ${CHECKS.length} Prüfungen bestanden`);
  process.exit(bad ? 1 : 0);
})();
