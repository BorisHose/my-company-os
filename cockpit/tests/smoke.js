// Smoke-Test für das Cockpit: baut eine Testseite aus dist/ mit Testdaten und
// einer nachgebildeten Datenbank und prüft die Hauptansichten ohne Fehler.
// Aufruf: node tests/smoke.js   (vorher: python3 build.py)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'dist', 'my-company-os.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'testdaten.json'), 'utf8'));
const mock = `<script>window.__W=[];window.__C=[];const D=${JSON.stringify(data).replace(/</g, '\\u003c')};
const S={};const mcp={callTool:async(s,tool,inp)=>{__C.push(tool);if(tool==="list_triggers")return {payload:{data:[]}};return {payload:{}}}};
const smp=async()=>({text:""});smp.json=async()=>({});
const col=c=>({limit:()=>({get:async()=>({docs:(D[c]||[]).map(x=>({data:()=>x}))}),onSnapshot:(n)=>{setTimeout(()=>n({docs:(D[c]||[]).map(x=>({data:()=>x})),docChanges:()=>[]}),0);return ()=>{}}}),doc:id=>doc(c+'/'+id)});
const doc=k=>({get:async()=>({exists:k==="meta/config"||!!S[k],data:()=>k==="meta/config"?D.meta:S[k]}),set:async v=>{S[k]=v;__W.push(k)},update:async v=>{S[k]={...(S[k]||{}),...v};__W.push(k)},delete:async()=>{delete S[k]},onSnapshot:()=>()=>{}});
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
  check('keine Laufzeitfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  fs.unlinkSync(tmp);
  const bad = CHECKS.filter(c => !c.ok).length;
  console.log(bad ? `\n${bad} von ${CHECKS.length} Prüfungen fehlgeschlagen` : `\nalle ${CHECKS.length} Prüfungen bestanden`);
  process.exit(bad ? 1 : 0);
})();
