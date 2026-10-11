const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1.25});
await p.goto('file:///tmp/loop_all.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
const n=await p.$$eval('section',s=>s.length);
for(let i=0;i<n;i++){const s=(await p.$$('section'))[i];await s.screenshot({path:`/home/claude/loop/${String(i+1).padStart(2,'0')}.png`});}
console.log(n);await b.close()})();
