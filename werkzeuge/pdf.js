const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.argv[2],{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
console.log('fonts',await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).join(',')));
const over=await p.evaluate(()=>[...document.querySelectorAll('section')].map(s=>{let m=0;s.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect(),sr=s.getBoundingClientRect();if(e.tagName!=='ASIDE'&&r.height>0)m=Math.max(m,r.bottom-sr.top,r.right-sr.left-1920+1920)});return s.id+':'+Math.round(m)}));console.log(over.join(' '));
await p.pdf({path:process.argv[3],width:'1920px',height:'1080px',printBackground:true});

await b.close();})();
