import re,json
src=open('/mnt/user-data/outputs/skill-agent-cockpit-entwurf.html').read()
L=src.split('\n')
def idx(prefix,start=0):
    for i in range(start,len(L)):
        if L[i].startswith(prefix):return i
    raise Exception(prefix)
def block_end(i):
    for j in range(i,len(L)):
        if L[j]=='];':return j
    raise Exception('end')
# data blocks -> empty
i=idx('let GR=[');L[i]='let GR=[];'
i=idx('const SK=[');j=block_end(i);L[i:j+1]=['let SK=[];']
i=idx('SK.forEach(s=>s.body=');L[i]=''
i=idx('const GLOBAL=[');L[i]='let GLOBAL=[],SET={autoApprove:true};'
i=idx('let AG=[');j=block_end(i);L[i:j+1]=['let AG=[];']
i=idx('let FL=[');j=block_end(i);L[i:j+1]=['let FL=[];']
i=idx('fcur=FL.findIndex(f=>f.n.startsWith');L[i]=''
i=idx('const F2=fl(');L[i]=''
i=idx('let AU=[');j=block_end(i);L[i:j+1]=['let AU=[];']
h='\n'.join(L)
def R(a,b,n=1):
    global h
    c=h.count(a)
    assert c==n,(a[:90],c)
    h=h.replace(a,b)
# document wrapper
R('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Skill- & Agenten-Cockpit (Entwurf v9)</title>','<title>My AI Factory</title>')
R('</head>\n<body>\n','')
R('</body>\n</html>','')
R(':root{--bg:#f5f6f8;',':root{color-scheme:light;--bg:#f5f6f8;')
R('<h1>Skill- &amp; Agenten-Cockpit</h1><span class="tag">Entwurf v9 zum Kommentieren</span>','<h1>My AI Factory</h1><span class="tag" id="save">Lädt …</span>')
R('<h2>Abläufe <span class="mark">Beispiele von Claude</span></h2>','<h2>Abläufe</h2>')
R('<section class="panel"><h2>Aufträge <span class="mark">Beispieldaten</span></h2>','<section class="panel"><h2>Aufträge <span id="exjobs"></span></h2>')
R('<span class="mark">Beispiele von Claude</span></label><textarea id="slp"','</label><textarea id="slp"')
# agent editor mark + buttons
R('<h2>Agent bearbeiten <span class="mark">Beispiel von Claude</span></h2>','<h2>Agent bearbeiten ${a.vorschlag?\'<span class="mark">Vorschlag von Claude</span> <button class="btn sm" id="takeA">Übernehmen</button>\':""}</h2>')
i=h.index('<div class="btns"><button class="btn p" onclick="toast(\'Im Entwurf ohne Funktion\')">In Cowork installieren</button>')
j=h.index('</div>',h.index('id="del"',i))
h=h[:i]+'<div class="btns"><button class="btn p" id="copyA">Definition kopieren</button><button class="btn d" id="del">Agent löschen</button><span class="hint" style="margin:0;align-self:center">Installieren als Cowork-Plugin folgt in Stufe 2.</span>'+h[j:]
R('''  $("#del").onclick=()=>{if(confirm("Agent „"+a.n+"“ löschen?")){AG.splice(cur,1);cur=0;render()}};''',
  '''  $("#del").onclick=async()=>{if(await askOk("Agent „"+a.n+"“ löschen?")){AG.splice(cur,1);cur=-1;render();schedule()}};
  const ta=$("#takeA");if(ta)ta.onclick=()=>{a.vorschlag=false;render();schedule();toast("Agent übernommen")};
  $("#copyA").onclick=()=>copyText(md(a),"Agent-Definition kopiert");''')
# prompts
R('''forEach(b=>b.onclick=()=>{const n=prompt("Gruppe umbenennen:",GR[+b.dataset.rg]);if(n){GR[+b.dataset.rg]=n;render()}});''',
  '''forEach(b=>b.onclick=async()=>{const n=await askText("Gruppe umbenennen",GR[+b.dataset.rg]);if(n){GR[+b.dataset.rg]=n;render();schedule()}});''')
R('''$("#sg").onchange=e=>{if(e.target.value==="new"){const n=prompt("Name der neuen Gruppe:");''','''$("#sg").onchange=async e=>{if(e.target.value==="new"){const n=await askText("Name der neuen Gruppe","");''')
R('''$("#newG").onclick=()=>{const n=prompt("Name der neuen Gruppe:");if(n){GR.push(n);render();''','''$("#newG").onclick=async()=>{const n=await askText("Name der neuen Gruppe","");if(n){GR.push(n);render();schedule();''')
R('''$("#delF").onclick=()=>{if(confirm("Ablauf „"+f.n+"“ löschen?")){''','''$("#delF").onclick=async()=>{if(await askOk("Ablauf „"+f.n+"“ löschen?")){''')
R('''const sb=$("#stop");if(sb)sb.onclick=()=>{if(confirm("Auftrag abbrechen?")){AU=AU.filter(x=>x!==j);close();jobs()}};''',
  '''const sb=$("#stop");if(sb)sb.onclick=async()=>{if(await askOk("Auftrag „"+j.t+"“ löschen?")){AU=AU.filter(x=>x!==j);close();jobs();schedule()}};''')
R('''<button class="btn d" id="stop">Auftrag abbrechen</button>''','''<button class="btn d" id="stop">Auftrag löschen</button>''')
# flow mark
R('''<span class="mark">Beispiel von Claude</span>
     <button class="btn p" id="runF">''','''${f.vorschlag?'<span class="mark">Vorschlag von Claude</span><button class="btn sm" id="takeF">Übernehmen</button>':''}
     <button class="btn p" id="runF">''')
R('''  $("#runF").onclick=()=>startModal(f);''','''  $("#runF").onclick=()=>startModal(f);const tf=$("#takeF");if(tf)tf.onclick=()=>{f.vorschlag=false;fedit();schedule();toast("Ablauf übernommen")};''')
# timestamps "jetzt"
h=h.replace('["jetzt",','[now(),')
# new flow / agent / job ids
R('''FL.push({n:"Neuer Ablauf",p:FF,''','''FL.push({id:uid("fl"),n:"Neuer Ablauf",p:FF,''')
R('''$("#newA").onclick=()=>{AG.push({n:"Neuer Agent",p:AF,''','''$("#newA").onclick=()=>{AG.push({id:uid("ag"),n:"Neuer Agent",p:AF,''')
R('''AU.unshift({id:"A-"+n,f,''','''AU.unshift({id:"A-"+n,f,fid:f.id,''')
R('''const n=Math.max(...AU.map(j=>+j.id.slice(2)))+1,''','''const n=Math.max(99,...AU.map(j=>+j.id.slice(2)||0))+1,''')
# jobs: guard missing flow + example marker
R('''const col=(st,title,cls)=>{const L=AU.filter(j=>j.st===st);''','''const ex=AU.filter(j=>j.beispiel).length;$("#exjobs").innerHTML=ex?`<span class="mark">${ex} Beispiel-Aufträge</span> <button class="btn sm" id="delEx">Beispiele löschen</button>`:"";
  const de=$("#delEx");if(de)de.onclick=async()=>{if(await askOk("Alle "+ex+" Beispiel-Aufträge löschen?")){AU=AU.filter(j=>!j.beispiel);jobs();schedule()}};
  const col=(st,title,cls)=>{const L=AU.filter(j=>j.st===st&&j.f);''')
R('''return `<div class="jcard p-${j.f.p}" data-j="${j.id}"><b>${esc(j.t)}</b>''','''return `<div class="jcard p-${j.f.p}" data-j="${j.id}"><b>${esc(j.t)}${j.beispiel?' <span class="badge neu">Beispiel</span>':''}</b>''')
open('/tmp/cockpit/stage1.html','w').write(h)
print(len(h))
