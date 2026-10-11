const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1.5});
await p.goto('file:///tmp/claude-0/-home-claude/5db755db-81e4-5556-aa5e-7fdc40a9cf8b/scratchpad/fass/company-os-prototyp-pilot.html');
const c=async s=>{const el=await p.$(s);await p.evaluate(e=>e.click(),el);await p.waitForTimeout(150)};
await c('[data-co="bs"]');await c('[data-area="proj"]');await c('[data-proj="hagen"]');
await p.evaluate(()=>{document.getElementById('pop').hidden=true;document.getElementById('view').scrollTop=330});await p.waitForTimeout(300);
await p.screenshot({path:'/home/claude/ui-hagen.png'});await b.close()})();
