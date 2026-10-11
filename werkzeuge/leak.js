const {chromium}=require('playwright');
const BAD=/Mieterverein|Hagen|AG-\d|Koppe|Dominik|Florian|Jinsheng|Bodo Solutions|business\/\/acts|businessacts|Inkasso|Boris|Mitglied/;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/ai-head-office-prototyp.html');
await p.waitForTimeout(4000);
const hits=new Map();
const chk=async(ctx)=>{const t=await p.evaluate(()=>document.body.innerText);t.split('\n').forEach(l=>{if(BAD.test(l)){const k=l.trim().slice(0,140);if(!hits.has(k))hits.set(k,ctx)}})};
const click=async s=>{const el=await p.$(s);if(!el)return false;await p.evaluate(e=>e.click(),el);await p.waitForTimeout(60);return true};
const closeAll=async()=>{await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelectorAll('.modal,.ov,#modal').forEach(m=>{m.hidden=true})});await p.keyboard.press('Escape')};
// collect selectors of nav-type attributes
const attrs=['data-area','data-ptab','data-co','data-stab','data-proc','data-tpl','data-projgo','data-job','data-sess','data-sug','data-step','data-jtab','data-ag','data-pkg','data-tab','data-view','data-open','data-phase','data-conn','data-gotag'];
await chk('start');
const areas=await p.$$eval('[data-area]',e=>e.map(x=>x.dataset.area));
for(const a of [...new Set(areas)]){await click(`[data-area="${a}"]`);await chk(a);
  for(const at of attrs){const vals=await p.$$eval(`#view [${at}]`,(e,at)=>e.map(x=>x.getAttribute(at)),at);
    for(const v of [...new Set(vals)].slice(0,12)){await click(`[data-area="${a}"]`);
      // reselect parent tab context not tracked; just click
      if(await click(`#view [${at}="${v}"]`)){await chk(a+' '+at+'='+v);await closeAll();}}}}
await click('#meBtn');const st=await p.$$eval('[data-stab]',e=>e.map(x=>x.dataset.stab));
for(const s of st){await click(`[data-stab="${s}"]`);await chk('settings '+s);}
await click('#bell')||await click('#bellBtn');await chk('bell');await closeAll();
await click('#chatBtn');const asks=await p.$$eval('[data-ask]',e=>e.map(x=>x.dataset.ask));for(const a of asks){await click(`[data-ask="${a}"]`);await p.waitForTimeout(700);}await chk('chat');
console.log([...hits].map(([k,v])=>v+' :: '+k).join('\n')||'NO LEAKS');console.log(errs.slice(0,5));await b.close()})();
