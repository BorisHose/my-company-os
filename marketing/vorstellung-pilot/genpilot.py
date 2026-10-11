import re,json,os
src=open('big/gen.py',encoding='utf-8').read()
pre,rest=src.split('\nS=[\n',1);body,post=rest.split('\n]\nfor s in S:',1)
ns={};exec(pre,ns);S=eval('['+body+']',ns)
PB={'tag':'eb0a740d30ef12be94e05a68e2737d6c','sitzungen':'5adc14cf7cc88a4d8bc8b07040f183b3','ueberblick':'c9bf7a7a959d0d4f856cd786061e319e','freigabe':'e9ff959b6cae76b8089f728a5f9b7b8e','auftrag':'ec3d1187988c8d187a5ab3879c386f90','auftraege':'a83a47d5af0ac9b074c5fc89fc67583a','assistent':'fecd422083d2d85614d547f3f74b275b','prozess':'d710e622906eab3413cf3dcd3f202e1e','schritt':'d1b5a274f799e4d9487967b04c8d808a','vorlagen':'151a7fad4536f80e884d7f1878caa4fc','vorschlaege':'fd99a305de9b35ad7262d75fd7112719','designer':'31e86676698cfb26d6f67c622396dc90','projekt':'906258fc8bdc0e19cf349efc0e5e0ad6','projektvorlagen':'e05740408d39c5c8c2d3d893e899389d','organigramm':'ba8b19a4e8ea472d02a72ce4920c2cad','agentenpool':'82fdf69aca9bdd091a5bd1a52a2b5db2','anschluesse':'4c36475d77cfa931bb533b7bf0646ceb','ki':'b4093f4ff1e1d98de43dc518648967ba','setup':'ee83dc55dc9c3a2a7a706be21aed560f'}
ns['B'].clear();ns['B'].update(PB)
PURL='https://claude.ai/artifact/WQY9F8gvWox6PKfiX9hnw7'
FOOT='Prototyp · Pilotdaten, teils echt aus Bodo (Stand 11.10.2026) – nur intern · <a href="'+PURL+'">Im Prototyp öffnen</a>'
SD='fass/pilotdeck/project/slides/'
def aside(k):
    f=SD+'ui-'+k+'.html'
    if not os.path.exists(f):return None
    m=re.search(r'<aside>(.*?)</aside>',open(f,encoding='utf-8').read(),re.S);return m.group(1) if m else None
OV={
 'projekt':'Bereich Projekte, getrennt vom Bereich Prozesse. Beispiel Entwicklungsprojekt Inkasso-Schnittstelle (Beispielwerte): Spezifikation, Konzept und Mockup, Umsetzung parallel zu Testfällen, Qualitätssicherung. Das echte Projekt „Einführung Mieterverein Hagen“ folgt auf der nächsten Folie.',
 'projektvorlagen':'Projekte → Projektvorlagen: Entwicklungsprojekt (Phasen) und Einführung Bodo beim Mieterverein (Aufgabenpakete) – aus dieser Vorlage stammt das Hagen-Projekt. Beim Start wird das Projekt in Bodo angelegt. Der Projekt-Designer ist derselbe BPM-Designer wie für Prozesse, im Projektmodus.',
 'designer':'Prozesse → Prozess-Designer: Prompt eingeben, Entwurf prüfen, anpassen. Im Bild der Entwurf „Lead-Gewinnung Mietervereine“ mit einer markierten Lücke (kein Agent mit Skill lead-bewertung). Derselbe Designer steht im Bereich Projekte als Projekt-Designer bereit.',
 'vorlagen':'Prozesse → Prozessvorlagen: Vorlagen beschreiben je Schritt die benötigten Fähigkeiten, nicht konkrete Agenten. Im Bild das Branchenpaket Mieterverein; Immobilienverwaltung ist in Vorbereitung. Projektvorlagen liegen jetzt im Bereich Projekte.',
}
for s in S:
    k=s[0];t=list(s)
    if k in OV:t[5]=OV[k]
    elif k=='prozess':x=aside(k) or t[5];t[5]=x if x.startswith('Bereich Prozesse') else 'Bereich Prozesse: wiederkehrende Abläufe aus Schritten. '+x
    else:t[5]=aside(k) or t[5]
    t.append(FOOT)
    open(SD+'ui-'+k+'.html','w',encoding='utf-8').write(ns['ui'](*t))
h=open(SD+'ui-hagen.html',encoding='utf-8').read()
h=re.sub(r'/_blob/[0-9a-f]{32}','/_blob/e482f1081ca24e66eebe325918ae7af7',h);open(SD+'ui-hagen.html','w',encoding='utf-8').write(h)
d=json.load(open('fass/pilotdeck/project/deck.json'));o=d['order']
for k in ['ui-projekt','ui-hagen']:o.remove(k)
i=o.index('ui-prozess');o[i:i]=['ui-projekt','ui-hagen','ui-projektvorlagen']
d['sections']['s2b']={'description':'So richten Sie es ein: Projekte (mit dem echten Projekt Hagen) und Projektvorlagen, Prozesse mit Vorlagen, Vorschlägen und Designer, Organigramm, Agentenpool und Anschlüsse','start':'ui-projekt'}
json.dump(d,open('fass/pilotdeck/project/deck.json','w'),ensure_ascii=False);print(len(o),o[12:22])
