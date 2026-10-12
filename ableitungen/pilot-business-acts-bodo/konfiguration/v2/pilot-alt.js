/* Bisherige Pilotdaten (Bodo Solutions · business//acts) aus basis/company-os-prototyp.html, Stand Commit vor Kern v2 (11.10.2026).
   Einmalig übernommen, damit die neue Fassung nicht mehr von der alten Datei abhängt. Teils echte Bodo-Daten – nur intern. */
const CO={
 all:{name:"Übersicht",color:"#5d6579",sys:"alle Unternehmen"},
 bs:{name:"Bodo Solutions",color:"#1f3a5f",sys:"Bodo · Organisation „Bodo Solutions“"},
 ba:{name:"business//acts",color:"#30ABE2",sys:"sellify · business//acts"}
};
const AREAS=[["tag","☀","Mein Tag"],["cockpit","◎","Cockpit"],["proj","▦","Projekte"],["proc","↝","Prozesse"],["jobs","☰","Aufträge"]];
let state={co:"all",area:"tag",dayTab:"heute",showRest:false,projTab:"mine",pjTab:"list",setTab:"profil",procSel:null,procView:"list",tplF:"Branchenpaket Mieterverein",projSel:null,phaseSel:"p2",desMode:"proc",desStage:0,desPrompt:"",showNo:false,orgCo:null};
let assistStage=0;

/* ---------- Daten ---------- */
const WAIT={
 bs:[
  {k:"Freigabe",t:"14 recherchierte Leads nach Bodo übertragen",d:"Prozess Lead-Gewinnung · Schritt 4 · Recherche-Agent",c:[["Zielsystem","Bodo · Bodo Solutions"],["Aktion","14 Organisationen (Kontakttyp Mieterverein, Interessent) anlegen"],["Prüfung","Dublettenprüfung: 2 bereits vorhanden, werden nicht angelegt"]]},
  {k:"Change Request",t:"AG-114 Prozessübergabe an Inkasso bewerten",d:"Einführung · Mieterverein Hagen",c:[["Frage","Kostenpflichtig ja/nein? Angebotsbezug? Wertigkeit?"],["Hinweis","In Bodo noch ohne Beschreibung"]]}
 ],
 ba:[
  {k:"Rückfrage",t:"Welche Preisliste gilt für das Angebot Jinsheng Federn?",d:"Vertrieb sellify · Angebots-Agent",c:[["Optionen","Standard 2026 · Projektpreise · Rückfrage an Boris"]]}
 ]
};
const RUN={
 bs:[["50 Leads Mietervereine NRW","Prozess Lead-Gewinnung · ◆ Lead-Prozessagent · Schritt 2 von 4","p-run","läuft"],["Entwicklungsprojekt Inkasso-Schnittstelle","Projekt · Phase 2 Konzept & Mockup · Meilenstein 29.10.","p-run","läuft"],["Einführung Mieterverein Hagen","Projekt · Aufgabenpakete aus Bodo","p-run","läuft"],["Bitfarm-Dokumentenmigration (AG-87)","überfällig seit 18.09.","p-bad","Eskalation"]],
 ba:[["Company OS einführen","Projekt · Setup-Pakete","p-run","läuft"],["Angebot sellify Integration Kit","Prozess Angebot erstellen · wartet auf Rückfrage","p-wait","wartet"]]
};
const ORG={
 bs:[
  {n:"Vertrieb",c:"#1f3a5f",lead:["BH","Boris Hose"],dep:"Vertretung: offen",ppl:[["VI","Vertriebsinnendienst"]],pa:[["Lead-Prozessagent","führt: Lead-Gewinnung"],["Vertriebs-Prozessagent","führt: Vertrieb · Lead bis Abschluss"]],ag:["Recherche-Agent","Aufbereitungs-Agent","Vertriebsassistent Bodo","Produktinformations-Agent","Angebots-Agent"],al:"2 Freigaben warten"},
  {n:"Einführung",c:"#147a5c",lead:["BH","Boris Hose"],dep:"Vertretung: Dominik Koppe",ppl:[["DK","Dominik Koppe · unterstützt"],["PL","Projektleitung"]],pa:[["Anforderungs-Prozessagent","führt: Anforderung aufnehmen und bewerten"]],ag:["Lösungs-Agent","Einführungs-Agent","Einrichtungs-Agent","Datenübernahme-Agent","Vorlagen-Agent"],al:"3 Aufgaben überfällig im Pilot"},
  {n:"Kundenservice",c:"#6a4fb3",lead:["KS","Leitung offen"],dep:"Vertretung: offen",ppl:[["SU","Support"]],pa:[["Service-Prozessagent","führt: Betrieb · Anfrage bis Rückmeldung"]],ag:["Annahme-Agent","Ticket-Agent"],ok:"Alles im Plan"},
  {n:"Produktentwicklung",c:"#8a5a12",lead:["DK","Dominik Koppe"],dep:"Vertretung: offen",ppl:[["EN","Entwicklung"]],pa:[["Projekt-Agent Entwicklung","projektverantwortlich: Entwicklungsprojekt Inkasso-Schnittstelle"]],ag:["Ticket-Agent · unterstützt"],ok:"Nimmt Tickets aus dem Betrieb entgegen"}
 ],
 ba:[
  {n:"Vertrieb sellify",c:"#30ABE2",lead:["BH","Boris Hose"],dep:"Vertretung: offen",ppl:[["VT","Vertrieb"]],pa:[["Angebots-Prozessagent","führt: Angebot erstellen"]],ag:["Vertriebsassistent sellify","Angebots-Agent","Video-Agent"],al:"1 Rückfrage offen"},
  {n:"Beratung & Projekte",c:"#2457c5",lead:["PL","Leitung offen"],dep:"Vertretung: offen",ppl:[["BE","Berater:in"]],pa:[["Onboarding-Prozessagent","führt: Onboarding sellify-Kunde (Entwurf)"]],ag:["Onboarding-Agent sellify","Einrichtungs-Agent","Lösungs-Agent · unterstützt"],ok:"Company OS einführen läuft"}
 ]
};
const GF={bs:{dep:"Vertretung: Dominik Koppe (Beispiel)"},ba:{dep:"Vertretung: offen"}};
const PSK=[["E-Mails vorbereiten","Entwürfe in deinem Stil, Versand nach Freigabe",1],["Tagesbriefing","Morgens: was wartet, was ist überfällig",1],["Termine & Wiedervorlagen","in Bodo bzw. sellify anlegen und nachhalten",1],["Freigaben bündeln","alle offenen Freigaben auf einen Blick",1],["Angebote erstellen","nach Vorlage aus der Bibliothek",0],["Kontakte anlegen","mit Dublettenprüfung",0],["Tickets anlegen","Feature Requests und Issues ohne Dubletten",0],["Produktinformationen","Produktblätter im Hausstil",0],["Präsentationen","Foliensätze vorbereiten",0]];
const B="https://bodo-app.com/o/k57bshnkdpahzs3fv4hvq6wz1s8aq2pm/aufgaben/";
const PKG=[
 {n:"Datenübernahme",c:"#147a5c",v:"Dominik Koppe",b:"Boris Hose",due:"31.10.",ag:"Datenübernahme-Agent",st:["p-bad","1 überfällig"],t:[["AG-1","Aktuelle Daten aus MIV Hagen Datenbank holen","p-ok","erledigt","",""],["AG-2","MIV Hagen Datenbank in Bodo importieren und als Dev Convex zur Verfügung stellen","p-ok","erledigt","02.08.","Dominik Koppe"],["AG-90","Migration von „Hinweisen“ am Kontakt","p-ok","erledigt","","Dominik Koppe"],["AG-81","Sachbearbeiter Klärung – welche User sind aktiv","p-ok","erledigt","",""],["AG-87","Bitfarm Dokumenten Migration","p-bad","in Bearbeitung · überfällig","18.09.","Dominik Koppe"],["AG-82","Lastschrift Oktober simulieren","p-open","offen","",""]]},
 {n:"Setup definieren",c:"#2457c5",v:"Boris Hose",b:"Dominik Koppe",due:"07.11.",ag:"Einrichtungs-Agent",st:["p-bad","1 überfällig"],t:[["AG-183","Nummernkreis-Übergabe MIV Hagen – Kontakt vs. Vertrag","p-bad","in Bearbeitung · überfällig","01.10.","Dominik Koppe"],["AG-85","Suchvorlagen & Listenexport (pdf / xlsx)","p-open","offen","",""],["AG-86","Auswertungen","p-open","offen","",""],["AG-84","Artikel zu Gewerbetarif bündeln","p-open","offen","","Dominik Koppe"],["AG-83","2 Jahre Kündigungsfrist an Verträgen festhalten","p-open","offen","",""]]},
 {n:"Anforderungen & Change Requests",c:"#c8641a",v:"Boris Hose",b:"Dominik Koppe",due:"14.11.",ag:"◆ Anforderungs-Prozessagent",st:["p-wait","Bewertung offen"],t:[["AG-114","Prozessübergabe an Inkasso durchdenken und definieren","p-bad","in Bearbeitung · überfällig","17.09.","Boris Hose"],["AG-88","Meldungen an den Landesverband","p-open","offen","",""]],ev:true},
 {n:"Dokumentvorlagen",c:"#6a4fb3",v:"offen",b:"–",due:"–",ag:"Vorlagen-Agent",st:["p-open","nicht geplant"],t:[]},
 {n:"Benutzerschulung",c:"#8a5a12",v:"offen",b:"–",due:"–",ag:"Einführungs-Agent",st:["p-open","nicht geplant"],t:[]},
 {n:"Übergabe Dev → Produktiv",c:"#14213d",v:"Boris Hose",b:"Dominik Koppe",due:"–",ag:"Einrichtungs-Agent",st:["p-wait","blockiert"],t:[],block:"KI-Zugang im Vereinssystem fehlt (Angabe zur Rechtsberatung)"},
 {n:"Projektsteuerung & Abstimmung",c:"#5d6579",v:"Boris Hose",b:"Dominik Koppe",due:"laufend",ag:"Persönlicher KI-Assistent",st:["p-run","laufend"],t:[["AG-100","Terminaufzeichnungen 8.9.26 mit Dominik teilen","p-ok","erledigt","08.09.","Boris Hose"],["AG-101","Neue Teams Termin Einladung für 15.09. rausschicken","p-ok","erledigt","25.09.","Boris Hose"]]}
];
const BO="https://bodo-app.com/o/k57bshnkdpahzs3fv4hvq6wz1s8aq2pm/";
const BLINK=[["MIV Hagen Migration",BO+"projekte/js7jm4cbk99fwprsngazz7a0ad8bbzjk"],["Bodo - Einführung bei MIV Hagen",BO+"projekte/js7yhx046fsx5nnmnvt8y4vbgs8fvj9g"],["K-0037",BO+"parties/kh7ayp3a941n1ft1fewvgkfq0d8ewt1x"]];
const HAGEN={stand:"11.10.2026",kunde:["Mietervereine Hagen","K-0037",BO+"parties/kh7ayp3a941n1ft1fewvgkfq0d8ewt1x"],kontakte:[["Kirsten Horn","Verwaltungsleitung",BO+"parties/kh7e8yxee73en3rf3tqt23bw0x8fdyna"],["Stefan Wintersohle","Rechtsanwalt",BO+"parties/kh74gnthgmgb2t8aafbnk6nbb18fg2tt"]],
 proj:[["MIV Hagen Migration","15 Aufgaben",BO+"projekte/js7jm4cbk99fwprsngazz7a0ad8bbzjk"],["Bodo - Einführung bei MIV Hagen","Projekttyp Bodo-Einführung, noch ohne Aufgaben",BO+"projekte/js7yhx046fsx5nnmnvt8y4vbgs8fvj9g"]],
 hot:[["AG-114","Prozessübergabe an Inkasso durchdenken und definieren","Boris Hose","17.09.","Feature Request · Priorität hoch · noch ohne Beschreibung","◆ Anforderungs-Prozessagent: Beschreibung als Entwurf schreiben, Kosten und Angebotsbezug bewerten, dir zur Freigabe vorlegen"],
      ["AG-87","Bitfarm Dokumenten Migration","Dominik Koppe","18.09.","Priorität hoch","Persönlicher KI-Assistent: Stand bei Dominik Koppe erfragen, neue Frist vorschlagen und in Bodo eintragen"],
      ["AG-183","Nummernkreis-Übergabe MIV Hagen – Kontakt vs. Vertrag","Dominik Koppe","01.10.","Priorität normal","Einrichtungs-Agent: Entscheidungsvorlage Kontaktnummer vs. Vertragsnummer vorbereiten"]]};

const ids={"AG-1":"v17dzd7w2rggdesxn66rgq2jtx8bacj2","AG-2":"v174y97xq72pdxdc362ektx3vh8ba467","AG-90":"v17b95pxpdah39anm9qy3sv4358dvrzn","AG-81":"v17bj8k7h28trdzcwn6yf87wah8dv1je","AG-87":"v175czw98stjcjyt5xndca5md58dttx3","AG-82":"v17dbfm3k52qhqq1v80effp6c98dt9b3","AG-183":"v171x32ex93v601cy043bg4jrh8f5cr5","AG-85":"v17dc3692tjz6sq9vbf2jb64398dvskq","AG-86":"v179gzs5xkhew5z8xg90n9h5118dt9dj","AG-84":"v174q7b50z7h4ew1vy951j1e358dt55h","AG-83":"v178x48779ebjtma439j8xkzmh8dtv52","AG-114":"v17142s34zjy8zfv767y7txvyh8e4h99","AG-88":"v178dd7062hngs4t5x5224yyvn8dvzq7","AG-100":"v1732ppjyxhgtpbh266dym6f7n8e1f7t","AG-101":"v17ehsaezwnsncj11v5mc659ph8e1f5r"};
const VT=[["Leads recherchieren","Recherche-Agent · Mensch: Vertrieb","→ Bodo: Kontakte"],["Erstkontakt & Bedarf","Vertriebsassistent","→ Bodo: Chance, Termin"],["Demo vorbereiten","Produktinfo-Agent","→ Bodo: Demo-Organisation"],["Angebot","Angebots-Agent","→ Bodo: Dokument, E-Mail"],["Abschluss","Vertriebsassistent","startet Einführung"]];
const BT=[["Anfrage annehmen","Annahme-Agent","→ Chronik"],["Einordnen","Annahme-Agent","Dublettenprüfung"],["Lösen oder Ticket","Ticket-Agent · Mensch: Support","→ Bodo: Ticket"],["Rückmeldung","Annahme-Agent","→ E-Mail mit Signatur"]];
const SETUP=[
 ["Inhaber-System",[["Kunde im eigenen CRM","Bodo · Bodo Solutions → Mietervereine Hagen (K-0037)"],["Bezug","Kunde von Bodo Solutions"]]],
 ["Projekte",[["Hauptprojekt","Bodo - Einführung bei MIV Hagen (Name in Bodo)"],["Weitere Projekte","MIV Hagen Migration"],["Verwaltung","Projekte, Meilensteine und Aufgaben bleiben in Bodo – Company OS zeigt sie an und steuert die Arbeit"]]],
 ["Anschlüsse & Rollen",[["CRM","Bodo · Dev-System Mieterverein Hagen e.V. (Einrichtung), Produktivsystem wird später festgelegt"],["Entwicklung","Bodo (Feature Request / Issue)"],["Bibliothek","Cloud-Ordner (OneDrive/SharePoint oder Google Drive)"],["ERP · weitere Systeme","nicht angeschlossen – bei Bedarf per MCP"],["KI-Zugang im Kundensystem","fehlt – Angabe zur Rechtsberatung nachholen"]]],
 ["KI-Anbieter & Haupt-KI",[["Haupt-KI (Pflicht)","Claude – nur von uns freigegebene Anbieter wählbar"],["Weitere Anbieter","registrieren, nur mit bestätigter AVV"],["KI-Profile","zunächst alle auf die Haupt-KI, später verfeinern"],["Datenstufe je Anbieter","0 ohne Personendaten · 1 pseudonymisiert · 2 personenbezogen"],["Budget je Anbieter","bei Erreichen: anhalten und benachrichtigen"]]],
 ["Abteilungen & Organigramm",[["Verwaltet","Vorstand · Verwaltung · Rechtsberatung · Buchhaltung"],["Je Abteilung","eine Leitung, eine Vertretung, Mitarbeitende, Agenten"]]],
 ["Branchenpaket",[["Paket","Mieterverein"],["Liefert","Organigramm-Vorlage, Vorschlagsliste mit Prozessen und Projektvorlagen, Standard-Agenten und Skills"]]],
 ["Menschen",[["Mitarbeitende","je Abteilung, verknüpft mit Bodo-Benutzer"]]],
 ["Prozesse & Projekte",[["Vorschlagsliste","aus dem Branchenpaket: Prozesse und Projektvorlagen – direkt übernehmen, anpassen, ablehnen oder später"],["Je Schritt","Arbeitsanweisung · Agent und Ersatz-Agent · KI-Profil · Datenstufe"],["Je Prozess","Prozessverantwortlicher Agent · ergebnisverantwortlicher Mensch"],["Übernommenes","startet als Entwurf, aktiv erst nach Testlauf"]]],
 ["Übergabewege",[["Entwicklungsaufträge","→ Bodo, Methode: Skill bodo-ticket-anlegen"],["Auftrag nach Abschluss an ERP","kein ERP angeschlossen"],["Abweichung je Projekt","möglich"]]],
 ["Bibliothek & Vorlagenquellen",[["Aus dem Kundensystem","Bodo: E-Mail- und Dokumentvorlagen (über den Anschluss)"],["Cloud-Ordner","OneDrive/SharePoint oder Google Drive – kein lokaler Ordner"]]],
 ["Agenten & Skills",[["Agentenpool","Annahme-Agent · Termin-Agent · Beitrags-Agent · Prüf-Agent"],["Prozessführung","je Prozess ein Prozessverantwortlicher Agent (Standard-Skill „Prozess führen“)"],["Regel","Agenten werden beim Entwerfen fest eingesetzt – keine Ausleihe zur Laufzeit"]]],
 ["Freigaben & Benachrichtigung",[["Außenwirkung","Freigabe nötig, im Auftrag aufhebbar"],["Ruhezeit","20–7 Uhr"],["Kanäle","App · E-Mail je Person · Handy (Mobil-Projekt)"]]],
 ["Zugriff",[["Rollen","Vorstand · Abteilungsleitung · Mitarbeitende"]]],
 ["Recht & Datenschutz",[["AVV Kunde ↔ Anbieter von Company OS","bestätigt"],["Regeln","je Regel: hart (keine Hintertür) oder übersteuerbar durch eine festgelegte Rolle, protokolliert"],["Agenten dürfen nie","Rechtsberatung erteilen · Geld bewegen"]]],
 ["KI-Assistent & Übersicht",[["KI-Assistent (Company-Chat)","aktiv, je Unternehmen"],["Mein Tag","Morgenübersicht und Tagesabschluss je Person einstellbar"],["Kennzahlen","überfällige Pakete · wartende Freigaben · Prozesse aktiv/im Test · KI-Kosten"]]],
 ["Abschluss",[["Prüfung","Verbindungstest Anschlüsse und KI-Anbieter · Probelauf · Setup-Protokoll in der Kundenakte"]]]
];
let setupStep=0;
const S=(n,dep,ag,ers,fr)=>({n,dep,ag,ers,fr});
const STC={"aktiv":"p-ok","im Test":"p-run","Entwurf":"p-open"};
const PROC={
 bs:[
  {id:"lead",n:"Lead-Gewinnung",dep:"Vertrieb",st:"aktiv",v:"v3",pa:"Lead-Prozessagent",er:"Boris Hose",run:"1 Auftrag läuft",note:"Der Aufbereitungs-Agent wurde in seiner Heimat-Abteilung geändert (v2 → v3). Testlauf nötig, bevor dieser Prozess die neue Version übernimmt – bis dahin arbeitet er mit v2.",steps:[S("Leads ermitteln","Vertrieb","Recherche-Agent","Vertriebsassistent Bodo",""),S("Leads aufbereiten","Vertrieb","Aufbereitungs-Agent","Recherche-Agent",""),S("Dubletten prüfen","Vertrieb","Recherche-Agent","–",""),S("Ins CRM übergeben","Vertrieb","Recherche-Agent","Vertriebsassistent Bodo","Freigabe: Leitung Vertrieb")]},
  {id:"vt",n:"Vertrieb · vom Lead zum Abschluss",dep:"Vertrieb",st:"aktiv",v:"v2",pa:"Vertriebs-Prozessagent",er:"Boris Hose",run:"kein Auftrag aktiv",steps:[S("Leads recherchieren","Vertrieb","Recherche-Agent","Vertriebsassistent Bodo","Mensch: Vertriebsinnendienst"),S("Erstkontakt & Bedarf","Vertrieb","Vertriebsassistent Bodo","–",""),S("Demo vorbereiten","Vertrieb","Produktinformations-Agent","–",""),S("Angebot","Vertrieb","Angebots-Agent","–","Freigabe vor Versand"),S("Abschluss","Vertrieb","Vertriebsassistent Bodo","–","startet Projekt „Einführung“")]},
  {id:"bt",n:"Betrieb · Anfrage bis Rückmeldung",dep:"Kundenservice",st:"aktiv",v:"v2",pa:"Service-Prozessagent",er:"Support",run:"1 Auftrag läuft",steps:[S("Anfrage annehmen","Kundenservice","Annahme-Agent","–",""),S("Einordnen","Kundenservice","Annahme-Agent","–","Dublettenprüfung"),S("Lösen oder Ticket","Kundenservice","Ticket-Agent","–","Mensch: Support"),S("Rückmeldung","Kundenservice","Annahme-Agent","–","E-Mail mit Signatur")]},
  {id:"anf",n:"Anforderung → Lösung → Angebot",dep:"Einführung",st:"im Test",v:"v2",pa:"Anforderungs-Prozessagent",er:"Boris Hose",run:"Testlauf im Dev-System",note:"Ablauf neu (v2): Lösungs-Agent erstellt Konzept, klickbaren Prototyp, Lösungsdokument, Angebot und Kundenunterlagen; nach dem Auftrag programmiert der Entwicklungs-Agent, sichert die Qualität und dokumentiert für den Kunden und im Quellcode. Testlauf nötig.",steps:[S("Anforderungen des Kunden übernehmen, auf Vorhandenes prüfen","Einführung","Einführungs-Agent","–","Dublettenprüfung"),S("Lösungsidee einsprechen","Einführung","–","–","Mensch: Consultant"),S("Konzept und klickbarer Prototyp","Einführung","Lösungs-Agent","–",""),S("Abgleich: Anforderungen und Lösungsidee vollständig abgedeckt?","Einführung","Lösungs-Agent","Anforderungs-Prozessagent","Lücken zurück an Consultant"),S("Lösungsdokument: Ausgangslage, Lösung, Nutzen","Einführung","Lösungs-Agent","–",""),S("Aufwand schätzen","Entwicklung","–","–","Mensch: Entwicklung"),S("Angebot und Kundenunterlagen","Einführung","Lösungs-Agent","Angebots-Agent",""),S("Paket prüfen, an den Kunden senden","Einführung","–","–","Freigabe: Consultant"),S("Freigabe und Auftrag","Einführung","–","–","Mensch: Kunde"),S("Ticket anlegen, Umsetzung programmieren","Entwicklung","Entwicklungs-Agent","–","Übergabeweg: Bodo-Ticket, ohne Zuständigen"),S("Testen und Qualität sichern","Entwicklung","Entwicklungs-Agent","Ticket-Agent","Testlauf im Dev-System"),S("Dokumentation für den Kunden und im Quellcode","Entwicklung","Lösungs-Agent","–",""),S("Geprüften Stand zur Abnahme senden","Einführung","–","–","Freigabe: Consultant, Abnahme: Kunde")]}
 ],
 ba:[
  {id:"ang",n:"Angebot erstellen",dep:"Vertrieb sellify",st:"aktiv",v:"v2",pa:"Angebots-Prozessagent",er:"Boris Hose",run:"1 Auftrag wartet",steps:[S("Bedarf aufnehmen","Vertrieb sellify","Vertriebsassistent sellify","–",""),S("Angebot aus Vorlage entwerfen","Vertrieb sellify","Angebots-Agent","–",""),S("Freigabe","Vertrieb sellify","–","–","Boris Hose"),S("Versand & Wiedervorlage","Vertrieb sellify","Angebots-Agent","Vertriebsassistent sellify","")]},
  {id:"anfba",n:"Anforderung → Lösung → Angebot",dep:"Beratung & Projekte",st:"Entwurf",v:"v1",pa:"Anforderungs-Prozessagent",er:"Boris Hose",run:"–",steps:[S("Anforderungen des Kunden übernehmen, auf Vorhandenes prüfen","Beratung & Projekte","Einführungs-Agent","–","Dublettenprüfung"),S("Lösungsidee einsprechen","Beratung & Projekte","–","–","Mensch: Berater:in"),S("Konzept und klickbarer Prototyp","Beratung & Projekte","Lösungs-Agent","–",""),S("Abgleich: Anforderungen und Lösungsidee vollständig abgedeckt?","Beratung & Projekte","Lösungs-Agent","Anforderungs-Prozessagent","Lücken zurück an Berater:in"),S("Lösungsdokument: Ausgangslage, Lösung, Nutzen","Beratung & Projekte","Lösungs-Agent","–",""),S("Aufwand schätzen","Entwicklung","–","–","Mensch: Entwicklung"),S("Angebot und Kundenunterlagen","Beratung & Projekte","Lösungs-Agent","Angebots-Agent",""),S("Paket prüfen, an den Kunden senden","Beratung & Projekte","–","–","Freigabe: Berater:in"),S("Freigabe und Auftrag","Beratung & Projekte","–","–","Mensch: Kunde"),S("Ticket anlegen, Umsetzung programmieren","Entwicklung","Entwicklungs-Agent","–","Übergabeweg: GitLab-Issue, ohne Zuständigen"),S("Testen und Qualität sichern","Entwicklung","Entwicklungs-Agent","Ticket-Agent","Testlauf im Dev-System"),S("Dokumentation für den Kunden und im Quellcode","Entwicklung","Lösungs-Agent","–",""),S("Geprüften Stand zur Abnahme senden","Beratung & Projekte","–","–","Freigabe: Berater:in, Abnahme: Kunde")]},
  {id:"onb",n:"Onboarding sellify-Kunde",dep:"Beratung & Projekte",st:"Entwurf",v:"v1",pa:"Onboarding-Prozessagent",er:"Leitung offen",run:"–",steps:[S("Kickoff vorbereiten","Beratung & Projekte","Onboarding-Agent sellify","–",""),S("Mandant einrichten","Beratung & Projekte","Einrichtungs-Agent","–","Freigabe: Berater:in")]}
 ]
};
const TPLF=["Branchenpaket Mieterverein","Vertrieb","Marketing","Kundenservice","Buchhaltung & Finanzen","Personal","Geschäftsführung","Beratung & Entwicklung"];
const TPL=[
 {f:"Branchenpaket Mieterverein",n:"Neuaufnahme Mitglied",d:"Antrag prüfen → Mitglied anlegen → Begrüßung senden",sk:["antrag-pruefen","kontakt-anlegen","email-erstellung"]},
 {f:"Branchenpaket Mieterverein",n:"Betriebskostenabrechnung vorprüfen",d:"Unterlagen anfordern → prüfen → Prüfbericht zur Freigabe",sk:["betriebskosten-pruefen","email-erstellung"]},
 {f:"Branchenpaket Mieterverein",n:"Beratungstermin",d:"Anliegen aufnehmen → Termin vereinbaren → erinnern",sk:["termin-vereinbaren","email-erstellung"]},
 {f:"Branchenpaket Mieterverein",n:"Kündigung und Rückgewinnung",d:"Kündigungsgrund erkennen → Rückgewinnung anbieten → Wiedervorlage",sk:["kuendigung-auswerten","email-erstellung"]},
 {f:"Vertrieb",n:"Lead-Gewinnung",d:"ermitteln → aufbereiten → Dubletten prüfen → ins CRM übergeben",sk:["lead-recherche","lead-aufbereiten","kontakt-anlegen"]},
 {f:"Vertrieb",n:"Angebot erstellen",d:"Bedarf → Entwurf aus Vorlage → Freigabe → Versand → Wiedervorlage",sk:["bodo-angebot","email-erstellung"]},
 {f:"Vertrieb",n:"Angebote nachfassen",d:"offene Angebote finden → Erinnerung entwerfen → Wiedervorlage",sk:["wiedervorlage","email-erstellung"]},
 {f:"Marketing",n:"Newsletter / Kampagne",d:"Thema → Text → Freigabe → Versand → Auswertung",sk:["texte-schreiben","email-erstellung"]},
 {f:"Marketing",n:"Infomaterial auf Anfrage",d:"Anfrage erkennen → Material aus der Bibliothek → Versand",sk:["bibliothek-versand","email-erstellung"]},
 {f:"Marketing",n:"Social-Media-Beitrag",d:"Thema → Text und Bild → Freigabe",sk:["texte-schreiben","bild-erstellen"]},
 {f:"Kundenservice",n:"Anfrage einordnen und beantworten",d:"Eingang → einordnen → Antwortentwurf → Freigabe → senden → dokumentieren",sk:["anfrage-einordnen","email-erstellung"]},
 {f:"Kundenservice",n:"Beschwerde bearbeiten",d:"aufnehmen → Ursache klären → Antwort → nachfassen",sk:["anfrage-einordnen","email-erstellung"]},
 {f:"Kundenservice",n:"Termin vereinbaren und erinnern",d:"Wunschtermin → Kalender → Erinnerung",sk:["termin-vereinbaren"]},
 {f:"Buchhaltung & Finanzen",n:"Eingangsrechnung prüfen",d:"Eingang → prüfen → vorkontieren → Freigabe",sk:["rechnung-pruefen"]},
 {f:"Buchhaltung & Finanzen",n:"Mahnwesen",d:"offene Posten → Erinnerung → Mahnstufe → Inkasso-Übergabe",sk:["mahnung-erstellen","email-erstellung"]},
 {f:"Buchhaltung & Finanzen",n:"Rechnung stellen",d:"Leistung erfassen → Rechnung → Versand",sk:["rechnung-erstellen"]},
 {f:"Personal",n:"Bewerbungen vorsortieren",d:"Eingang → Kriterien prüfen → Vorschlag an die Leitung (Datenstufe beachten)",sk:["bewerbung-sichten"]},
 {f:"Personal",n:"Onboarding",d:"Zugänge → Unterlagen → Einarbeitungsplan",sk:["onboarding-planen","email-erstellung"]},
 {f:"Personal",n:"Abwesenheiten",d:"Antrag → Vertretung prüfen → Freigabe",sk:["termin-vereinbaren"]},
 {f:"Geschäftsführung",n:"Wochenbericht",d:"Kennzahlen sammeln → Bericht → Versand",sk:["bericht-erstellen"]},
 {f:"Geschäftsführung",n:"Besprechung vorbereiten und protokollieren",d:"Agenda → Unterlagen → Protokoll → Aufgaben",sk:["protokoll-schreiben","email-erstellung"]},
 {f:"Beratung & Entwicklung",n:"Anforderung → Lösung → Angebot",d:"Anforderungen übernehmen → Lösungsidee einsprechen → Konzept und klickbarer Prototyp → Abdeckung prüfen → Lösungsdokument → Angebot und Kundenunterlagen → Freigabe → Ticket nach Auftrag",sk:["anforderung-konzipieren","prototyp-erstellen","loesungsdokument","bodo-angebot","bodo-ticket-anlegen"]},
 {f:"Projektvorlagen",n:"Entwicklungsprojekt",d:"Phasen: Anforderungsanalyse & Spezifikation → Konzept & Mockup → Umsetzung (parallel: Testfälle vorbereiten) → Qualitätssicherung · Abnahme je Phase = Meilenstein",sk:["prozess-fuehren"],proj:true},
 {f:"Projektvorlagen",n:"Einführung Bodo beim Mieterverein",d:"Aufgabenpakete ohne feste Reihenfolge: Datenübernahme, Setup, Vorlagen, Schulung, Übergabe Dev → Produktiv",sk:["bodo-einfuehrung-anlegen","bodo-ersteinrichtung"],proj:true}
];
const tplSk=n=>(TPL.find(t=>t.n===n)||{sk:[]}).sk;
const SUG=[
 {n:"Neuaufnahme Mitglied",src:"Branchenpaket Mieterverein",why:"häufigster Vorgang im Verein",s:"offen"},
 {n:"Betriebskostenabrechnung vorprüfen",src:"Branchenpaket Mieterverein",why:"hoher Zeitaufwand je Fall",s:"offen"},
 {n:"Beratungstermin",src:"Branchenpaket Mieterverein",why:"viele Rückfragen per Telefon",s:"offen"},
 {n:"Kündigung und Rückgewinnung",src:"Branchenpaket Mieterverein",why:"Kündigungsgründe werden heute nicht ausgewertet",s:"offen"},
 {n:"Angebote nachfassen",src:"Gespräch mit dem KI-Assistenten",why:"„Wir vergessen oft nachzufassen.“",s:"offen"},
 {n:"Infomaterial auf Anfrage",src:"Gespräch mit dem KI-Assistenten",why:"Material liegt in der Bibliothek bereit",s:"offen"},
 {n:"Wochenbericht",src:"eigener Prompt",why:"„Jeden Freitag ein Überblick für die Geschäftsführung“",s:"offen"}
];
let sugSel=new Set();
const PROJ={
 bs:[{id:"hagen",n:"Einführung Mieterverein Hagen",kind:"Aufgabenpakete",sys:"Bodo",pv:["Mensch","Boris Hose"],tpl:"Einführung Bodo beim Mieterverein",flow:"manuell"},
     {id:"dev",n:"Entwicklungsprojekt Inkasso-Schnittstelle",kind:"Phasen",sys:"Bodo",pv:["KI-Agent","Projekt-Agent Entwicklung"],tpl:"Entwicklungsprojekt",flow:"automatisch",ex:true}],
 ba:[{id:"cos",n:"Company OS einführen",kind:"Aufgabenpakete",sys:"sellify",pv:["Mensch","Boris Hose"],tpl:"–",flow:"manuell"}]
};
const PH=[
 {id:"p1",n:"Anforderungsanalyse & Spezifikation",st:"done",from:"01.10.",to:"15.10.",er:"Boris Hose",pr:[["Anforderung → Lösung → Angebot","12 von 12 Läufen"],["Spezifikation erstellen","1 von 1"]],ms:["Spezifikation abgenommen","15.10.",true]},
 {id:"p2",n:"Konzept & Mockup",st:"run",from:"16.10.",to:"29.10.",er:"Boris Hose",pr:[["Umsetzungskonzept erstellen","1 von 1"],["Klickbares Mockup erstellen und abstimmen","1 von 2 · Feedbackrunde 2 läuft"]],ms:["Konzept und Mockup vom Kunden freigegeben","29.10.",false]},
 {id:"p3",n:"Umsetzung",st:"open",par:1,from:"30.10.",to:"10.12.",er:"Leitung Produktentwicklung",pr:[["Entwicklungsticket umsetzen","0 von 22 Tickets"]],ms:["Alle Tickets erledigt, Stand im Testsystem","10.12.",false]},
 {id:"p3b",n:"Testfälle vorbereiten",st:"open",par:1,from:"30.10.",to:"03.12.",er:"Boris Hose",pr:[["Testfall aus echtem Prozess ableiten","0 von 15 Testfällen"]],ms:["Testfälle mit dem Kunden abgestimmt","03.12.",false]},
 {id:"p4",n:"Qualitätssicherung",st:"open",from:"11.12.",to:"19.12.",er:"Boris Hose",pr:[["Echten Prozess gegen die Entwicklung verproben","0 von 15"],["Fehler melden → Ticket in der Umsetzung","bei Bedarf"]],ms:["Kundenabnahme – danach Übergabe Dev → Produktiv","19.12.",false]}
];
const PHS={done:["p-ok","abgenommen"],run:["p-run","läuft"],open:["p-open","geplant"]};
const JOBS={
 bs:[["50 Leads Mietervereine NRW bis 31.10.","Prozess Lead-Gewinnung · ◆ Lead-Prozessagent · Schritt 2 von 4","intern · ohne Projekt","p-run","läuft"],
     ["Mockup – Feedbackrunde 2","Prozess Klickbares Mockup abstimmen · Phase 2","im Projekt: Entwicklungsprojekt Inkasso-Schnittstelle","p-wait","wartet auf Kunde"],
     ["Anforderung AG-114 bewerten","Prozess Anforderung → Lösung → Angebot · ◆ Anforderungs-Prozessagent","im Projekt: Einführung Mieterverein Hagen","p-bad","Eskalation"],
     ["AG-87 nachhalten: neue Frist mit Dominik Koppe klären","Einzelaufgabe · Persönlicher KI-Assistent","im Projekt: Einführung Mieterverein Hagen","p-wait","wartet auf Antwort"],
     ["Entscheidungsvorlage AG-183 Nummernkreis","Einzelaufgabe · Einrichtungs-Agent","im Projekt: Einführung Mieterverein Hagen","p-run","läuft"],
     ["Kundenwunsch → Ticket → Rückmeldung","Prozess Betrieb · Schritt 3 von 4","intern · ohne Projekt","p-run","läuft"]],
 ba:[["Angebot sellify Integration Kit","Prozess Angebot erstellen · ◆ Angebots-Prozessagent · wartet auf Rückfrage","intern · ohne Projekt","p-wait","wartet"],
     ["Setup-Paket „Kundensystem anbinden“","manuell im Projekt ausgelöst","im Projekt: Company OS einführen","p-run","läuft"]]
};
const SKC={"code-umsetzen":["Anforderung im Quellcode umsetzen",0,0],"tests-schreiben":["Tests schreiben und ausführen",0,0],"code-dokumentieren":["Dokumentation im Quellcode",0,0],"anforderung-konzipieren":["Anforderungen strukturieren und Lösungskonzept schreiben",1,0],"prototyp-erstellen":["klickbaren Prototyp (Mock-up) bauen",0,0],"loesungsdokument":["Dokument Ausgangslage, Lösung, Nutzen im Hausstil",1,0],"kontakt-anlegen":["Kontakte anlegen mit Dublettenprüfung",2,1],"bodo-angebot":["Angebot als PDF im Bodo-Stil",1,1],"email-erstellung":["E-Mails im Stil des Absenders",1,1],"bodo-ersteinrichtung":["Bodo-Mandant Bereich für Bereich einrichten",0,1],"bodo-einfuehrung-anlegen":["Einführungsprojekt anlegen",0,1],"bodo-ticket-anlegen":["Feature Requests und Issues ohne Dubletten",0,1],"feature-request-screenshot":["Entwurfs-Screenshots zeichnen",0,0],"bodo-video":["Szenenvideos für Bodo",0,0],"sellify-video":["Szenenvideos für sellify",0,0],"bodo-produktinformation":["Produktblatt im Hausstil",0,0],"lead-recherche":["Leads recherchieren",0,0],"lead-aufbereiten":["Leads aufbereiten und bewerten",1,0],"anfrage-einordnen":["Anfragen einordnen",1,0],"termin-vereinbaren":["Termine vereinbaren und erinnern",1,0],"prozess-fuehren":["Prozess führen: Schritte vergeben, prüfen, eskalieren",0,0]};
const AG=[
 {n:"Recherche-Agent",d:"Vertrieb",t:"Leads recherchieren, Dubletten prüfen",sk:["kontakt-anlegen","lead-recherche"],lim:-1,prof:"Schnell & günstig",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Lead-Gewinnung","Vertrieb · Lead bis Abschluss"],ver:"v4",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Aufbereitungs-Agent",d:"Vertrieb",t:"Leads aufbereiten und bewerten",sk:["lead-aufbereiten"],lim:-1,prof:"Texte",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Lead-Gewinnung"],ver:"v3 · geändert",p:{lesen:1,anlegen:0,mail:0,loeschen:0}},
 {n:"Lead-Prozessagent",d:"Vertrieb",t:"führt den Prozess Lead-Gewinnung",sk:["prozess-fuehren"],lim:-1,prof:"Gründlich prüfen",resp:"Boris Hose (ergebnisverantwortlich)",r:"Prozessverantwortlich",inn:["Lead-Gewinnung"],ver:"v1",p:{lesen:1,anlegen:0,mail:0,loeschen:0}},
 {n:"Angebots-Agent",d:"Vertrieb",t:"Angebote nach Vorlage",sk:["bodo-angebot","email-erstellung"],lim:-1,prof:"Texte",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:["Vertrieb · Lead bis Abschluss","Angebot erstellen"],ver:"v2",p:{lesen:1,anlegen:1,mail:1,loeschen:0}},
 {n:"Annahme-Agent",d:"Kundenservice",t:"Anfragen annehmen und einordnen",sk:["anfrage-einordnen","email-erstellung"],lim:-1,prof:"Schnell & günstig",resp:"Support",r:"Mitarbeiter",inn:["Betrieb · Anfrage bis Rückmeldung"],ver:"v2",p:{lesen:1,anlegen:1,mail:1,loeschen:0}},
 {n:"Einrichtungs-Agent",d:"Einführung",t:"Kataloge Bereich für Bereich einrichten",sk:["bodo-ersteinrichtung"],lim:0,prof:"Gründlich prüfen",resp:"Projektleitung",r:"Mitarbeiter",inn:["Onboarding sellify-Kunde"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Einführungs-Agent",d:"Einführung",t:"Einführungsprojekt anlegen, Anforderungen aufnehmen",sk:["bodo-einfuehrung-anlegen","termin-vereinbaren"],lim:-1,prof:"Schnell & günstig",resp:"Projektleitung",r:"Mitarbeiter",inn:["Anforderung aufnehmen und bewerten"],ver:"v2",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Lösungs-Agent",d:"Einführung",t:"Konzept, klickbarer Prototyp, Lösungsdokument, Angebot und Kundenunterlagen aus Anforderungen und Lösungsidee",sk:["anforderung-konzipieren","prototyp-erstellen","loesungsdokument","bodo-angebot"],lim:-1,prof:"Gründlich prüfen",resp:"Boris Hose (ergebnisverantwortlich)",r:"Mitarbeiter",inn:["Anforderung → Lösung → Angebot"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Entwicklungs-Agent",d:"Produktentwicklung",t:"setzt freigegebene Anforderungen um, testet und dokumentiert im Quellcode",sk:["code-umsetzen","tests-schreiben","code-dokumentieren"],lim:-1,prof:"Gründlich prüfen",resp:"Leitung Produktentwicklung",r:"Mitarbeiter",inn:["Anforderung → Lösung → Angebot"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Ticket-Agent",d:"Kundenservice / Produktentwicklung",t:"Tickets ohne Dubletten, mit Screenshot",sk:["bodo-ticket-anlegen","feature-request-screenshot"],lim:-1,prof:"Gründlich prüfen",resp:"Support",r:"Mitarbeiter",inn:["Betrieb · Anfrage bis Rückmeldung","Anforderung aufnehmen und bewerten"],ver:"v3",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Projekt-Agent Entwicklung",d:"Produktentwicklung",t:"projektverantwortlich für das Entwicklungsprojekt Inkasso-Schnittstelle",sk:["prozess-fuehren"],lim:-1,prof:"Gründlich prüfen",resp:"Abnahmen: ergebnisverantwortliche Menschen je Phase",r:"Projektverantwortlich",inn:["Entwicklungsprojekt Inkasso-Schnittstelle"],ver:"v1",p:{lesen:1,anlegen:1,mail:0,loeschen:0}},
 {n:"Video-Agent",d:"Vertrieb",t:"Szenenvideos",sk:["bodo-video","sellify-video"],lim:0,prof:"Bilder",resp:"Leitung Vertrieb",r:"Mitarbeiter",inn:[],ver:"v1",p:{lesen:1,anlegen:0,mail:0,loeschen:0}}
];
const CONN={
 bs:[["CRM","B","#1f3a5f","Bodo","Organisation „Bodo Solutions“","Kontakt, Aufgabe, Termin, Dokument, E-Mail, Projekt, Meilenstein, Katalog","p-ok","verbunden"],["Entwicklung","B","#1f3a5f","Bodo","Aufgabentyp Feature Request / Issue","Entwicklungsauftrag","p-ok","verbunden"],["Bibliothek","☁","#2457c5","OneDrive","Ordner Vertrieb/Material","Material, Vorlage","p-ok","verbunden"]],
 ba:[["CRM","s","#30ABE2","sellify","Mandant „business//acts“","Kontakt, Aufgabe, Termin, Dokument, E-Mail, Projekt","p-ok","verbunden"],["Entwicklung","G","#c8641a","GitLab","Projekt noch festzulegen (Vorschlag Florian)","Entwicklungsauftrag","p-wait","einzurichten"],["Bibliothek","☁","#2457c5","OneDrive","Ordner Vertrieb/Material","Material, Vorlage","p-ok","verbunden"]]
};
const ROUTES={
 bs:[["Entwicklungsaufträge","Bodo · Feature Request / Issue","Skill bodo-ticket-anlegen","p-ok","aktiv"],["Auftrag nach Abschluss an ERP","kein ERP angeschlossen","–","p-open","vorgesehen"],["Daten an weiteres Prozess- und Datensystem","noch kein System angeschlossen","–","p-open","vorgesehen"]],
 ba:[["Entwicklungsaufträge","GitLab · Issue","Skill gitlab-issue-anlegen (neu)","p-wait","einzurichten"],["Auftrag nach Abschluss an ERP","kein ERP angeschlossen","–","p-open","vorgesehen"],["Daten an weiteres Prozess- und Datensystem","noch kein System angeschlossen","–","p-open","vorgesehen"]]
};
const SRC={cw:["◧","Cowork"],cc:["⌘","Claude Code"],mob:["▯","Handy-Chat"],plan:["◷","Geplante Aufgabe"]};
const SESS=[
 {t:"Namensfindung & Arbeitstitel",src:"cw",l:"wait",as:"Produkt Company OS · business//acts",st:"Vorschläge für Methode und Arbeitstitel liegen vor.",nx:"Kombination auswählen, z. B. „Steuern statt Machen“ + „Projekt 2T“",res:"Antwort im Chat",ago:"vor 12 Min."},
 {t:"Bodo-Ticket AG-114 beschreiben",src:"mob",l:"wait",as:null,ask:["Einführung Mieterverein Hagen","projektübergreifend"],st:"Ticket-Entwurf fertig, Dublettenprüfung ohne Treffer.",nx:"Entwurf lesen und freigeben",res:"Ticket-Entwurf (noch nicht angelegt)",ago:"vor 40 Min."},
 {t:"Elevator Pitch – Kostenfolie",src:"cw",l:"check",as:"Produkt Company OS · business//acts",st:"Folie 5 neu: Delegation an die KI, 9.660 € Ersparnis als Highlight.",nx:"Folie ansehen und freigeben",res:"Präsentation „Elevator Pitch“ · 7 Folien",ago:"vor 25 Min."},
 {t:"Umsetzungskonzept",src:"cw",l:"check",as:"Produkt Company OS · business//acts",st:"Alle 9 Abschnitte gefüllt, Architektur und Referenzen ergänzt.",nx:"Lesen, direkt bearbeiten oder kommentieren",res:"Dokument „Company OS – Umsetzungskonzept“",ago:"gestern"},
 {t:"Tagesbriefing",src:"plan",l:"check",as:"projektübergreifend",st:"Morgenübersicht um 7:30 erstellt.",nx:"Lesen",res:"Morgenübersicht",ago:"7:30"},
 {t:"Prototyp – Mein Tag",src:"cw",l:"run",as:"Produkt Company OS · business//acts",st:"Bereich „Mein Tag“ wird gebaut.",nx:"nichts – läuft",res:"–",ago:"gerade eben"},
 {t:"Repository my-company-os aufsetzen",src:"cc",l:"run",as:"Produkt Company OS · business//acts",st:"Grundgerüst angelegt, Tests laufen.",nx:"nichts – läuft",res:"–",ago:"vor 8 Min."},
 {t:"Homepage Bodo – Konzept",src:"cw",l:"rest",as:"Bodo Solutions",st:"Konzept zur Freigabe vorgelegt, keine Rückmeldung.",nx:"weitermachen oder archivieren",res:"Konzeptseite",ago:"vor 9 Tagen"},
 {t:"Jinsheng Federn – Prozessaufnahme",src:"cw",l:"rest",as:"business//acts · Kundenprojekt",st:"Handlungsfelder notiert.",nx:"weitermachen oder archivieren",res:"Notizen",ago:"vor 5 Tagen"},
 {t:"sellify-Video Storyboard",src:"cw",l:"rest",as:"business//acts",st:"Storyboard-Entwurf mit 6 Szenen.",nx:"weitermachen oder archivieren",res:"Storyboard",ago:"vor 12 Tagen"}
];
const LANES=[["wait","Wartet auf mich","p-wait"],["check","Fertig – zu prüfen","p-run"],["run","Läuft","p-open"]];
const CAL=[["09:00","09:30","Jour fixe Entwicklung","Bodo"],["11:00","12:00","Abstimmung Mieterverein Hagen","Bodo"],["14:00","15:00","Demo Company OS für Interessent","sellify"]];
const NOTE=[["Elevator Pitch – Kostenfolie","fertig – zu prüfen"],["Bodo-Ticket AG-114 beschreiben","wartet auf deine Freigabe"],["Namensfindung & Arbeitstitel","wartet auf deine Entscheidung"],["Prozess Lead-Gewinnung","Testlauf nötig (Agent geändert)"],["Tagesbriefing","Morgenübersicht erstellt"]];
const SCRIPT={
 "Wie steht die Einführung in Hagen?":`Stand aus Bodo (11.10.2026), Projekt MIV Hagen Migration: <ul><li>15 Aufgaben: 6 erledigt, 3 in Bearbeitung, 6 offen</li><li>Überfällig: AG-114 Inkasso (fällig 17.09., Boris Hose), AG-87 Dokumentenmigration (18.09., Dominik Koppe), AG-183 Nummernkreis (01.10., Dominik Koppe)</li><li>Blocker: KI-Zugang im Vereinssystem fehlt</li><li>Ohne Aufgaben: Dokumentvorlagen, Schulung</li></ul>Soll ich die drei überfälligen Punkte den Verantwortlichen melden?`,
 "Lege einen Feature Request für Inkasso an":`Ich habe vorher nach vergleichbaren Tickets gesucht: keins gefunden. Entwurf:<div class="prev"><b>Feature Request · Bodo Solutions</b><span><b>Ziel:</b> Übergabe offener Forderungen an ein Inkassobüro</span><span><b>Zuständig:</b> niemand (Entwicklung übernimmt selbst)</span><span><b>Tags:</b> UX</span><span><b>Bewertung:</b> kostenpflichtig? – bitte entscheiden</span></div><div class="acts" style="margin-top:6px"><button class="btn sm acc" data-toast="Ticket angelegt (Prototyp: nichts ausgeführt)">Freigeben & anlegen</button><button class="btn sm">Ändern</button></div>`,
 "Entwirf einen Prozess für die Lead-Gewinnung":`Ich habe einen Entwurf im Designer vorbereitet: 5 Schritte, Agenten aus dem Pool mit Begründung, eine Lücke (kein Agent mit Skill „lead-bewertung“). Prozessverantwortlich: Lead-Prozessagent, ergebnisverantwortlich: du (Vorschlag).<div class="acts" style="margin-top:6px"><button class="btn sm acc" data-ptabgo="des" data-desgo="1">Im Designer öffnen</button></div>`,
 "Schlag mir weitere Prozesse vor":`Aus deinem Organigramm und dem Branchenpaket kämen dazu infrage:<ul><li>Mahnwesen bis Inkasso-Übergabe (Buchhaltung)</li><li>Beschwerde bearbeiten (Kundenservice)</li></ul>Soll ich beide auf die Vorschlagsliste setzen?`,
 "Was wartet heute auf mich?":`Über beide Unternehmen und deine KI-Sitzungen:<ul><li>Sitzungen: „Namensfindung“ wartet auf deine Entscheidung, Bodo-Ticket AG-114 auf Freigabe</li><li>Bodo Solutions: Freigabe 14 Leads · Bewertung AG-114</li><li>business//acts: Rückfrage Preisliste Jinsheng Federn</li></ul><div class="acts" style="margin-top:6px"><button class="btn sm acc" data-gotag>Zu „Mein Tag“</button></div>`
};