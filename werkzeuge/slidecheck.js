const {chromium}=require('playwright');const fs=require('fs');
const [,,dir,map]=process.argv;const M=map?JSON.parse(fs.readFileSync(map,'utf8')):{};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
const files=fs.readdirSync(dir+'/project/slides').filter(f=>f.endsWith('.html'));
for(const f of files){let h=fs.readFileSync(dir+'/project/slides/'+f,'utf8');for(const k in M)h=h.split('/_blob/'+k).join('file://'+M[k]);h=h.replace(/<aside>[\s\S]*?<\/aside>/,'');
h=h.replace('<section ','<section data-x="1" ').replace(/style="/,'style="position:relative;width:1920px;height:1080px;box-sizing:border-box;overflow:hidden;');
await p.setContent('<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=IBM+Plex+Mono:wght@400;500&display=swap"><style>*{margin:0;box-sizing:border-box}p,h1,h2,h3{margin:0}</style></head><body style="margin:0">'+h+'</body></html>',{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);
const bad=await p.evaluate(()=>[...document.querySelectorAll('section *')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>1000||r.right>1800||e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible'}).filter(e=>!(e.tagName==='P'&&e.style.position==='absolute')).map(e=>e.tagName+':'+(e.textContent||'').slice(0,30)+':'+Math.round(e.getBoundingClientRect().bottom)).slice(0,3));
if(bad.length)console.log(f,bad);await p.screenshot({path:dir+'/png/'+f.replace('.html','.png')});}
await b.close()})();
