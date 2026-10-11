import json,glob
D=json.load(open('/tmp/skilldata/skills.json'));M=json.load(open('/tmp/cockpit/mock.json'))
base=glob.glob('/root/.claude/skills/synced/*/')[0]
def orig(i):return open(base+i+'/SKILL.md').read()
skills=[];o=0
def add(s):
    global o;o+=1;s['ord']=o;skills.append(s)
def body_multi(i,n,d,core):
    return f"---\nname: {i}\ndescription: {d}\n---\n\n# {n}\n\n## Produkt bestimmen\nErmittle, ob es um Bodo oder sellify geht. Ist das nicht eindeutig, frag nach.\nLies dann bodo.md bzw. sellify.md und wende die Abweichungen an.\n\n## Gemeinsamer Ablauf\n"+"\n".join("- "+l.strip("- ").strip() for l in core.split("\n") if l.strip())+"\n"
MULTI=[("kontakt-anlegen","Kontakt im CRM anlegen",0,"Person und/oder Organisation in Bodo oder sellify anlegen – Ziel-Mandant per Abfrage, Dublettenprüfung je Mandant.",["kontakt-anlegen"]),
 ("einfuehrung-anlegen","Einführungsprojekt anlegen",1,"Neues Einführungsprojekt anlegen – bei Bodo für einen Mieterverein, bei sellify für einen Kunden; fragt alles Nötige ab.",["bodo-einfuehrung-anlegen"]),
 ("mandant-einrichten","Neuen Mandanten einrichten",1,"Ersteinrichtung eines neuen Mandanten Schritt für Schritt im Dialog – Bereich für Bereich mit Bestätigung.",["bodo-ersteinrichtung"]),
 ("ticket-anlegen","Entwicklungsticket erfassen",2,"Feature Request, Issue oder Entwicklungsticket für Bodo oder sellify anlegen.",["bodo-ticket-anlegen"]),
 ("angebot-erstellen","Angebot als One-Pager",3,"Einseitiges Angebot als PDF mit Positionskacheln, Preistabelle und Beauftragungsfeld.",["bodo-angebot"]),
 ("produktblatt-erstellen","Produktblatt erstellen (A4-PDF)",3,"Produktinhalte als Produktinformation im festen Produkt-Stil (A4-PDF) aufbereiten.",["bodo-produktinformation"]),
 ("szenenvideo","Szenenvideo produzieren",5,"Storyboard, KI-Szenen in Google Flow/Veo, echte Produkt-Screens, Titelseite, Abspann und Schnitt.",["bodo-video","sellify-video"])]
SINGLE=[("feature-request-screenshot","Entwurfsbild für Feature Request zeichnen",2),("email-erstellung","E-Mail in Boris' Stil schreiben",4),("mobil-optimierung","Webseite fürs Handy reparieren",6),("iphone-vorschau","Webseite im iPhone-Rahmen vorführen",6)]
order=["kontakt-anlegen","einfuehrung-anlegen","mandant-einrichten","ticket-anlegen","feature-request-screenshot","angebot-erstellen","produktblatt-erstellen","email-erstellung","szenenvideo","mobil-optimierung","iphone-vorschau"]
byid={}
for i,n,g,d,origs in MULTI:
    m=D['multi'][i]
    prof={}
    for k in ("bodo","sellify"):
        p=m[k];prof[k]={"from":p.get("from") or "","txt":p["txt"],"lp":p.get("rules",[])}
        if not p.get("from"):prof[k]["neu"]=1
    byid[i]={"id":i,"p":"multi","n":n,"g":g,"d":d,"lp":m["core_rules"],"body":body_multi(i,n,d,m["core_summary"]),"prof":prof,"orig":{x:orig(x) for x in origs},"src":"vorschlag"}
for i,n,g in SINGLE:
    od=D['originals'][i]
    byid[i]={"id":i,"p":"all","n":n,"g":g,"d":od["description"],"lp":od["rules"],"body":orig(i),"src":"konto"}
for i in order:add(byid[i])
STD=[("pdf","PDF lesen & erzeugen","PDFs lesen, zusammenführen, teilen, ausfüllen, erzeugen."),("docx","Word-Datei bearbeiten","Word-Dokumente erstellen und bearbeiten."),("xlsx","Excel-Tabelle bearbeiten","Tabellen lesen, bereinigen, erstellen."),("pptx","PowerPoint erstellen","PowerPoint-Dateien lesen und erstellen."),("docs","Claude-Doc schreiben","Gemeinsam bearbeitbare Dokumente in Claude Docs."),("google-workspace","Google-Dateien bearbeiten","Google Docs, Sheets und Slides erstellen und ändern."),("skill-creator","Skills bauen & testen","Neue Skills erstellen, verbessern und testen.")]
for i,n,d in STD:add({"id":i,"p":"all","n":n,"g":7,"d":d,"lp":[],"body":"","std":1,"src":"anthropic"})
agents=[];
for k,a in enumerate(M['agents']):a=dict(a);a['ord']=k;a['vorschlag']=True;agents.append(a)
flows=[]
for k,f in enumerate(M['flows']):f=dict(f);f['ord']=k;f['vorschlag']=True;flows.append(f)
jobs=[]
for j in M['jobs']:j=dict(j);j['beispiel']=True;jobs.append(j)
meta={"groups":M['groups'],"globals":M['globals'],"settings":{"autoApprove":True}}
seed={"skills":skills,"agents":agents,"flows":flows,"jobs":jobs,"meta":meta}
json.dump(seed,open('/tmp/cockpit/seed.json','w'),ensure_ascii=False)
print({k:len(v) for k,v in seed.items() if isinstance(v,list)}, max(len(json.dumps(s,ensure_ascii=False)) for s in skills))
