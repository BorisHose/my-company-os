/* ---------- Vorführmodus „Musterfirma“ (erfundene Daten) ---------- */
let DEMO=true;
const ORIG=structuredClone({CO,WAIT,RUN,ORG,GF,PKG,SESS,SUG,SETUP,SCRIPT,NOTE,JOBS,CAL});
const setArr=(a,b)=>a.splice(0,a.length,...structuredClone(b));
const setObj=(o,b)=>{Object.keys(o).forEach(k=>delete o[k]);Object.assign(o,structuredClone(b))};
const DMAP=[
 ["Setup als Projekt in der business//acts-Instanz, weil es Bodo Solutions und sellify betrifft. Verknüpfbar mit den Projekten in den Kundeninstanzen.","Einführung von AI Head Office als Projekt mit Aufgabenpaketen."],
 ["„Company OS einführen“ liegt in business//acts und ist verknüpft mit dem Einführungsprojekt beim Kunden in Bodo Solutions.","Projekte verschiedener Unternehmen lassen sich miteinander verknüpfen."],
 ["Projekt „MIV Hagen Migration“, 10.10.2026","Beispieldaten"],
 ["Kontakttyp Mieterverein, Interessent","Interessent, Branche Handwerk"],
 ["Lead-Gewinnung von Mietervereinen","Lead-Gewinnung von Handwerksbetrieben"],
 ["Lead-Gewinnung Mietervereine","Lead-Gewinnung Handwerk"],
 ["Mietervereine NRW","Handwerksbetriebe Region Nord"],
 ["Einführung Mieterverein Hagen","Einführung bei Kunde Beispiel GmbH"],
 ["Beispiel Mieterverein Hagen","Beispiel Muster GmbH"],
 ["Mieterverein Hagen","Kunde Beispiel GmbH"],
 ["Mieterverein Musterstadt, 2.400 Mitglieder","Musterkunde Süd, 120 Mitarbeitende"],
 ["Mieterverein Musterstadt","Musterkunde Süd"],
 ["Infomaterial Bodo","Infomaterial"],
 ["Inkasso-Schnittstelle","Kundenportal"],
 ["Prozessübergabe an Inkasso","Schnittstelle zum ERP"],
 ["Bitfarm-Dokumentenmigration (AG-87)","Dokumente aus dem Archiv (T-12)"],
 ["AG-114","T-14"],["AG-87","T-12"],
 ["Dominik Koppe","Leitung Entwicklung"],
 ["Vorschlag Florian","Beispiel"],
 ["Jinsheng Federn","Musterkunde Nord"],
 ["sellify Integration Kit","Servicepaket Plus"],
 ["Company OS einführen","AI Head Office einführen"],
 ["Onboarding sellify-Kunde","Onboarding Neukunde"],
 ["Onboarding-Agent sellify","Onboarding-Agent"],
 ["Vertriebsassistent sellify","Vertriebsassistent Handel"],
 ["Vertriebsassistent Bodo","Vertriebsassistent"],
 ["Vertrieb sellify","Vertrieb"],
 ["Produktübersicht Bodo","Produktübersicht"],["Angebot Bodo","Angebot"],["Layout Bodo-Navy","Layout im Hausstil"],
 ["Prüfbericht Betriebskosten","Antwortvorlage Kundenservice"],["Ergebnis „Betriebskosten prüfen“","Antworten im Kundenservice"],
 ["Vereinssystem","Kundensystem"],
 ["Organisation „Bodo Solutions“","Mandant „Muster GmbH“"],["Mandant „business//acts“","Mandant „Muster Handel“"],
 ["Bodo Solutions","Muster GmbH"],["business//acts","Muster Handel GmbH"]
];
function demoTxt(s){if(!DEMO||typeof s!=="string")return s;for(const [a,b] of DMAP)s=s.split(a).join(b);return s}
const D_PKG=[
 {n:"Datenübernahme",c:"#147a5c",v:"Projektleitung",b:"Boris Hose",due:"31.10.",st:["p-run","läuft"],t:[["T-1","Daten aus dem Altsystem exportieren","p-ok","erledigt"],["T-2","Import ins Testsystem","p-ok","erledigt"],["T-3","Dubletten bereinigen","p-ok","erledigt"],["T-4","Aktive Benutzer klären","p-ok","erledigt"],["T-12","Dokumente aus dem Archiv übernehmen","p-bad","überfällig"],["T-5","Rechnungslauf simulieren","p-open","offen"]]},
 {n:"Setup definieren",c:"#2457c5",v:"Boris Hose",b:"Projektleitung",due:"07.11.",st:["p-run","läuft"],t:[["T-6","Nummernkreise festlegen","p-bad","überfällig"],["T-7","Suchvorlagen & Listenexport","p-open","offen"],["T-8","Auswertungen","p-open","offen"],["T-9","Artikel und Preise bündeln","p-open","offen"],["T-10","Kündigungsfristen hinterlegen","p-open","offen"]]},
 {n:"Anforderungen & Change Requests",c:"#c8641a",v:"Boris Hose",b:"Leitung Entwicklung",due:"14.11.",st:["p-wait","Bewertung offen"],t:[["T-14","Schnittstelle zum ERP","p-bad","überfällig"],["T-11","Export an den Steuerberater","p-open","offen"]],ev:true},
 {n:"Dokumentvorlagen",c:"#6a4fb3",v:"offen",b:"–",due:"–",st:["p-open","nicht geplant"],t:[]},
 {n:"Benutzerschulung",c:"#8a5a12",v:"offen",b:"–",due:"–",st:["p-open","nicht geplant"],t:[]},
 {n:"Übergabe Dev → Produktiv",c:"#14213d",v:"Boris Hose",b:"Leitung Entwicklung",due:"–",st:["p-wait","blockiert"],t:[],block:"KI-Zugang im Kundensystem fehlt"},
 {n:"Projektsteuerung & Abstimmung",c:"#5d6579",v:"Boris Hose",b:"Projektleitung",due:"laufend",st:["p-run","laufend"],t:[["T-15","Kickoff-Protokoll geteilt","p-ok","erledigt"],["T-16","Abstimmungstermin 15.09.","p-ok","erledigt"]]}
];
const D_SESS=[
 {t:"Preisliste für Angebot klären",src:"cw",l:"wait",as:"Muster Handel GmbH · Vertrieb",st:"Angebot an Musterkunde Nord vorbereitet, Preisliste unklar.",nx:"Entscheiden: Standardpreise oder Projektpreise",res:"Angebotsentwurf",ago:"vor 12 Min."},
 {t:"Ticket-Entwurf: Export-Funktion",src:"mob",l:"wait",as:null,ask:["Entwicklungsprojekt Kundenportal","projektübergreifend"],st:"Ticket-Entwurf fertig, Dublettenprüfung ohne Treffer.",nx:"Entwurf lesen und freigeben",res:"Ticket-Entwurf (noch nicht angelegt)",ago:"vor 40 Min."},
 {t:"Newsletter Oktober",src:"cw",l:"check",as:"Muster GmbH · Marketing",st:"Text und Betreffzeilen entworfen.",nx:"Lesen und freigeben",res:"Entwurf Newsletter",ago:"vor 25 Min."},
 {t:"Quartalsbericht Q3",src:"cw",l:"check",as:"Muster GmbH · Geschäftsführung",st:"Kennzahlen zusammengestellt, Kommentar entworfen.",nx:"Prüfen, ergänzen oder kommentieren",res:"Dokument „Quartalsbericht Q3“",ago:"gestern"},
 {t:"Tagesbriefing",src:"plan",l:"check",as:"projektübergreifend",st:"Morgenübersicht um 7:30 erstellt.",nx:"Lesen",res:"Morgenübersicht",ago:"7:30"},
 {t:"Lead-Recherche Handwerk",src:"cw",l:"run",as:"Muster GmbH · Vertrieb",st:"32 von 50 Leads recherchiert.",nx:"nichts – läuft",res:"–",ago:"gerade eben"},
 {t:"Repository Kundenportal aufsetzen",src:"cc",l:"run",as:"Muster GmbH · Entwicklung",st:"Grundgerüst angelegt, Tests laufen.",nx:"nichts – läuft",res:"–",ago:"vor 8 Min."},
 {t:"Messeplanung 2027",src:"cw",l:"rest",as:"Muster GmbH · Marketing",st:"Messeliste mit Kosten erstellt.",nx:"weitermachen oder archivieren",res:"Messeliste",ago:"vor 9 Tagen"},
 {t:"Lieferantenvergleich Drucker",src:"cw",l:"rest",as:"Muster GmbH · Einkauf",st:"Drei Angebote verglichen.",nx:"weitermachen oder archivieren",res:"Vergleichstabelle",ago:"vor 5 Tagen"},
 {t:"Imagevideo Storyboard",src:"cw",l:"rest",as:"Muster Handel GmbH · Marketing",st:"Storyboard-Entwurf mit 6 Szenen.",nx:"weitermachen oder archivieren",res:"Storyboard",ago:"vor 12 Tagen"}
];
const D_SUG=[
 {n:"Angebote nachfassen",src:"Vorlagen Vertrieb",why:"offene Angebote ohne Rückmeldung",s:"offen"},
 {n:"Anfrage einordnen und beantworten",src:"Vorlagen Kundenservice",why:"viele gleichartige Anfragen",s:"offen"},
 {n:"Eingangsrechnung prüfen",src:"Vorlagen Buchhaltung",why:"hoher Zeitaufwand je Beleg",s:"offen"},
 {n:"Mahnwesen",src:"Vorlagen Buchhaltung",why:"Erinnerungen gehen heute unter",s:"offen"},
 {n:"Infomaterial auf Anfrage",src:"Gespräch mit dem KI-Assistenten",why:"Material liegt in der Bibliothek bereit",s:"offen"},
 {n:"Onboarding",src:"Gespräch mit dem KI-Assistenten",why:"„Neue Kolleginnen und Kollegen brauchen zu lange.“",s:"offen"},
 {n:"Wochenbericht",src:"eigener Prompt",why:"„Jeden Freitag ein Überblick für die Geschäftsführung“",s:"offen"}
];
const D_NOTE=[["Newsletter Oktober","fertig – zu prüfen"],["Ticket-Entwurf: Export-Funktion","wartet auf deine Freigabe"],["Preisliste für Angebot klären","wartet auf deine Entscheidung"],["Prozess Lead-Gewinnung","Testlauf nötig (Agent geändert)"],["Tagesbriefing","Morgenübersicht erstellt"]];
const D_SCRIPT={
 "Wie steht die Einführung bei Kunde Beispiel GmbH?":`Stand aus dem CRM (Beispieldaten): <ul><li>15 Aufgaben: 6 erledigt, 3 in Bearbeitung, 6 offen</li><li>Überfällig: T-12 Dokumente aus dem Archiv, T-14 Schnittstelle zum ERP, T-6 Nummernkreise</li><li>Blocker: KI-Zugang im Kundensystem fehlt</li><li>Ohne Aufgaben: Dokumentvorlagen, Schulung</li></ul>Soll ich die drei überfälligen Punkte den Verantwortlichen melden?`,
 "Lege einen Feature Request für die ERP-Schnittstelle an":`Ich habe vorher nach vergleichbaren Tickets gesucht: keins gefunden. Entwurf:<div class="prev"><b>Entwicklungsauftrag · GitLab</b><span><b>Ziel:</b> Aufträge nach Abschluss an das ERP übergeben</span><span><b>Zuständig:</b> niemand (Entwicklung übernimmt selbst)</span><span><b>Bewertung:</b> kostenpflichtig? – bitte entscheiden</span></div><div class="acts" style="margin-top:6px"><button class="btn sm acc" data-toast="Ticket angelegt (Prototyp: nichts ausgeführt)">Freigeben & anlegen</button><button class="btn sm">Ändern</button></div>`,
 "Entwirf einen Prozess für die Lead-Gewinnung":ORIG.SCRIPT["Entwirf einen Prozess für die Lead-Gewinnung"],
 "Schlag mir weitere Prozesse vor":ORIG.SCRIPT["Schlag mir weitere Prozesse vor"],
 "Was wartet heute auf mich?":`Über beide Unternehmen und deine KI-Sitzungen:<ul><li>Sitzungen: „Preisliste für Angebot klären“ wartet auf deine Entscheidung, Ticket-Entwurf Export-Funktion auf Freigabe</li><li>Muster GmbH: Freigabe 14 Leads · Bewertung T-14</li><li>Muster Handel GmbH: Rückfrage Preisliste Musterkunde Nord</li></ul><div class="acts" style="margin-top:6px"><button class="btn sm acc" data-gotag>Zu „Mein Tag“</button></div>`
};
function demoSetup(){
  const S=structuredClone(ORIG.SETUP);const set=(name,rows)=>{const e=S.find(x=>x[0]===name);if(e)e[1]=rows};
  set("Inhaber-System",[["Kunde im eigenen CRM","Bodo · Ihr Anbieter → Muster GmbH (K-0001)"],["Bezug","Kunde des Anbieters"]]);
  set("Projekte",[["Hauptprojekt","Einführung AI Head Office"],["Weitere Projekte","Datenübernahme Altsystem"],["Verwaltung","Projekte, Meilensteine und Aufgaben bleiben im CRM – AI Head Office zeigt sie an und steuert die Arbeit"]]);
  set("Anschlüsse & Rollen",[["CRM","Bodo · Testsystem Muster GmbH (Einrichtung), Produktivsystem folgt"],["Entwicklung","GitLab (Issue)"],["Bibliothek","Cloud-Ordner (OneDrive/SharePoint oder Google Drive)"],["ERP · weitere Systeme","nicht angeschlossen – bei Bedarf per MCP"],["KI-Zugang im Kundensystem","fehlt – Freigabe im CRM nachholen"]]);
  set("Abteilungen & Organigramm",[["Verwaltet","Vertrieb · Kundenservice · Projekte · Buchhaltung"],["Je Abteilung","eine Leitung, eine Vertretung, Mitarbeitende, Agenten"]]);
  set("Branchenpaket",[["Paket","Standardvorlagen – Branchenpakete z. B. Mieterverein, Immobilienverwaltung in Vorbereitung"],["Liefert","Organigramm-Vorlage, Vorschlagsliste mit Prozessen und Projektvorlagen, Standard-Agenten und Skills"]]);
  set("Menschen",[["Mitarbeitende","je Abteilung, verknüpft mit dem CRM-Benutzer"]]);
  set("Übergabewege",[["Entwicklungsaufträge","→ GitLab, Methode: Skill gitlab-issue-anlegen"],["Auftrag nach Abschluss an ERP","kein ERP angeschlossen"],["Abweichung je Projekt","möglich"]]);
  set("Bibliothek & Vorlagenquellen",[["Aus dem Kundensystem","E-Mail- und Dokumentvorlagen aus dem CRM (über den Anschluss)"],["Cloud-Ordner","OneDrive/SharePoint oder Google Drive – kein lokaler Ordner"]]);
  set("Agenten & Skills",[["Agentenpool","Recherche-Agent · Angebots-Agent · Annahme-Agent · Ticket-Agent"],["Prozessführung","je Prozess ein Prozessverantwortlicher Agent (Standard-Skill „Prozess führen“)"],["Regel","Agenten werden beim Entwerfen fest eingesetzt – keine Ausleihe zur Laufzeit"]]);
  set("Recht & Datenschutz",[["AVV Kunde ↔ Anbieter von AI Head Office","bestätigt"],["Regeln","je Regel: hart (keine Hintertür) oder übersteuerbar durch eine festgelegte Rolle, protokolliert"],["Agenten dürfen nie","Verträge unterschreiben · Geld bewegen"]]);
  return S;
}
function applyMode(){
  setObj(CO,ORIG.CO);setObj(WAIT,ORIG.WAIT);setObj(RUN,ORIG.RUN);setObj(ORG,ORIG.ORG);setObj(GF,ORIG.GF);setArr(PKG,ORIG.PKG);setArr(SESS,ORIG.SESS);setArr(SUG,ORIG.SUG);setArr(SETUP,ORIG.SETUP);setObj(SCRIPT,ORIG.SCRIPT);setArr(NOTE,ORIG.NOTE);setObj(JOBS,ORIG.JOBS);setArr(CAL,ORIG.CAL);
  if(DEMO){
    CO.bs.name="Muster GmbH";CO.bs.sys="Bodo · Mandant „Muster GmbH“";CO.ba.name="Muster Handel GmbH";CO.ba.sys="sellify · Mandant „Muster Handel“";
    setArr(PKG,D_PKG);setArr(SESS,D_SESS);setArr(SUG,D_SUG);setArr(NOTE,D_NOTE);setObj(SCRIPT,D_SCRIPT);setArr(SETUP,demoSetup());
    Object.values(ORG).forEach(L=>L.forEach(d=>{if(d.lead[0]==="DK")d.lead[0]="LE";d.ppl.forEach(p=>{if(p[0]==="DK")p[0]="LE"})}));
    state.tplF="Vertrieb";
  }else state.tplF="Branchenpaket Mieterverein";
  sugSel.clear();state.projSel=null;state.procView="list";
  $("#msgs").innerHTML="";$("#chips").innerHTML="";
  $("#pop b").textContent=DEMO?"Sitzung „Newsletter Oktober“ ist fertig":"Sitzung „Elevator Pitch – Kostenfolie“ ist fertig";
  $("#modeTxt").textContent=DEMO?"Vorführung „Musterfirma“ · erfundene Daten · nichts wird gespeichert oder ausgeführt":"Pilotdaten (intern) · teils echte Daten aus Bodo · nichts wird gespeichert oder ausgeführt";
  $("#modeBtn").textContent=DEMO?"Pilotdaten zeigen":"Musterfirma zeigen";
}
document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(b&&b.id==="modeBtn"){DEMO=!DEMO;applyMode();render();toast(DEMO?"Vorführmodus „Musterfirma“":"Pilotdaten (intern)");return}
  const m=$("#modal");if(DEMO&&m.innerHTML){const t=demoTxt(m.innerHTML);if(t!==m.innerHTML)m.innerHTML=t}
});
applyMode();
