import json,re,sys
d,out,mp=sys.argv[1],sys.argv[2],(json.load(open(sys.argv[3])) if len(sys.argv)>3 else {})
o=json.load(open(d+'/project/deck.json'))['order']
parts=[]
for n in o:
    h=open(f'{d}/project/slides/{n}.html',encoding='utf-8').read()
    h=re.sub(r'<aside>[\s\S]*?</aside>','',h)
    for k,v in mp.items(): h=h.replace('/_blob/'+k,'file://'+v)
    h=h.replace('style="','style="position:relative;width:1920px;height:1080px;box-sizing:border-box;overflow:hidden;break-after:page;',1)
    parts.append(h)
open(out,'w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=IBM+Plex+Mono:wght@400;500&display=swap"><style>@page{size:1920px 1080px;margin:0}*{margin:0;box-sizing:border-box}body{margin:0}p,h1,h2,h3{margin:0}</style></head><body>'+''.join(parts)+'</body></html>')
