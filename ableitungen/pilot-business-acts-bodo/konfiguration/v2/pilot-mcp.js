/* Daten per MCP gelesen am 12.10.2026 (nur lesend).
   Bodo: Organisation „Bodo Solutions“ – echte Daten, nur intern.
   sellify: per MCP erreichbares System – enthält überwiegend Test- und Demodaten (Einschätzung), deshalb als Testdaten gekennzeichnet. */
const STAND="12.10.2026";
const BOU="https://bodo-app.com/o/k57bshnkdpahzs3fv4hvq6wz1s8aq2pm/";
const BS_COUNT={vertraege:1,benutzer:4,organisationen:32,personen:122};
/* Projekte in Bodo Solutions: [id, Name, Status, aktive Aufgaben, Aufgaben gesamt, Verantwortlich, Beschreibung] */
const BS_PROJ=[
 ["js7jm4cbk99fwprsngazz7a0ad8bbzjk","MIV Hagen Migration","Aktiv",9,15,"Boris Hose · Dominik Koppe","Datenmigration Mieterverein Hagen"],
 ["js7yhx046fsx5nnmnvt8y4vbgs8fvj9g","Bodo - Einführung bei MIV Hagen","Aktiv",0,0,"Boris Hose","Projekttyp Bodo-Einführung bei einem Mieterverein"],
 ["js7h1kf6qf6qcnbvnhhemfhe898ftt8f","Bergischer Mieterring Migration","Aktiv",0,0,"Boris Hose","Datenmigration Bergischer Mieterring e. V., Altsystem MIV4Windows"],
 ["js7r0kw04b897qmn1d2z6mrt898fttvq","Bodo - Einführung bei Bergischer Mieterring","Aktiv",0,0,"Boris Hose","Projekttyp Bodo-Einführung bei einem Mieterverein"],
 ["js7sg54p3q8az3dd85waf7t6nd8cp26s","Produktentwicklung - Optimierung","Aktiv",33,160,"Boris Hose · Dominik Koppe","Ablauf Produktentwicklung, Standardtyp Issue"],
 ["js7p0hmmxhzz8g25wkjzef8mnx8b9hv5","Produktentwicklung - Visionär","Aktiv",20,58,"Dominik Koppe","Steuerung der Software-Entwicklung"],
 ["js7zgtgj521anexm11ekb8nh558bgejq","Firmengründung","Aktiv",8,16,"Boris Hose · Dominik Koppe","vertraulich"],
 ["js7n00a2d8dnmy985wrt9kmpfd8et60z","MIV Software","Aktiv",0,2,"–",""],
 ["js7qhmn2gpeccyrvjv4xcdyv098cncfb","Produktentwicklung - Prozessanforderung","Abgeschlossen",0,10,"Dominik Koppe",""]];
/* Meine Arbeit (Boris Hose): [Eimer, Art, Nummer, Titel, fällig, Bezug, Status, Priorität, id] */
const BS_ARBEIT=[
 ["overdue","aufgabe","AG-128","MMV: Auftragsdatenverarbeitung – Dokumente erneuern","15.09.","–","Offen","high","v17czpyje2vwee31dkscgbn0gs8ebp1m"],
 ["overdue","aufgabe","AG-114","Prozessübergabe an Inkasso durchdenken und definieren","17.09.","MIV Hagen Migration","In Bearbeitung","high","v17142s34zjy8zfv767y7txvyh8e4h99"],
 ["overdue","aufgabe","AG-122","Landing Page für Andreas und Steffi fertigstellen","18.09.","–","Offen","normal","v17672y3kg08g1ejf7rqrcm5hs8e6c1q"],
 ["overdue","aufgabe","AG-126","Marc anrufen und Bodo vorstellen (Heizungsbau)","18.09.","–","Offen","normal","v173trkgzgqm4bc4mkeg2997vx8e8d7f"],
 ["overdue","aufgabe","AG-160","Kooperation nachfassen","24.09.","Oliver Winkelmann","Offen","high","v17e33pd1s0s5reck8k7tbbthh8ef5xg"],
 ["overdue","aufgabe","AG-103","DEMO Instanz für Michael Nöthen bereitstellen","28.09.","Michael Nöthen","In Bearbeitung","high","v17djwze60djdzzdx4srec1sjh8e33hr"],
 ["overdue","aufgabe","AG-195","Datenschutzvereinbarung für Datenimport aus MIV Hamburg in Demosystem einholen","30.09.","Mieter helfen Mietern Hamburg","Offen","high","v17d93ttmhwtrawfd6jrec28d98fc8yx"],
 ["overdue","aufgabe","AG-196","Datenschutzvereinbarung an Frau Bastheim senden","01.10.","Berit Bastheim","Offen","normal","v17104zjh146srzc7w9dafp7qs8fcxb3"],
 ["overdue","aufgabe","AG-172","Entwicklungsroadmap für sellify bei secunet als HTML designen","02.10.","–","Offen","high","v17872dyg25r4ra7qyt25782ks8ercrb"],
 ["overdue","aufgabe","AG-223","E-Mail-Bestätigung Dokumentenübernahme und Zusatzfunktionen an Herrn Wintersohle","04.10.","Stefan Wintersohle","Offen","normal","v1773eb44ygabn34m0x9nn25n98fkp0w"],
 ["overdue","aufgabe","AG-194","Kaspers (Bergisch Gladbach) nachfassen – IT-Veränderungen besprechen","05.10.","Kaspers GmbH","Offen","normal","v1735t4b3tzx9zjf1mjb1cmk898fcxwz"],
 ["overdue","aufgabe","AG-216","Herrn van den Abbeele anrufen und weiteres Vorgehen nachfassen","05.10.","DMB Wuppertal","Offen","normal","v176cmnv80dvf1p2st205nb2y98fhe3c"],
 ["overdue","aufgabe","AG-221","Entscheidungsvorlage KI-Belegerkennung & sellify AI Integration Kit nachtelefonieren","05.10.","Manuel Hager","Offen","high","v17fh93eekqz7hh1t82z3hndh18fgy07"],
 ["overdue","aufgabe","AG-213","Bodo „diktieren“ beim Mieterverein vorstellen","06.10.","–","Offen","normal","v177s446j43n63nr5qdc77hfh58ffm0w"],
 ["overdue","aufgabe","AG-217","Nachfassen und Demo-Installation besprechen","06.10.","Jens Kapitza","Offen","normal","v178vqj2d99wy6y9bchbxvvxn18fhpkz"],
 ["overdue","aufgabe","AG-234","Otten + Freckmann: Website-Interesse an sellify nachfassen – mit Bodo ansprechen","06.10.","Otten + Freckmann GmbH","Offen","high","v1713d89yere2kygcmxd0rd4rs8fj6sd"],
 ["overdue","aufgabe","AG-290","Ticket für den Aufruf aus der Chronik spezifizieren","08.10.","Produktentwicklung - Optimierung","Backlog","normal","v1720fgb53wqm2y59yb34vkw8x8fx41e"],
 ["overdue","aufgabe","AG-239","Vali (Arbex) Informationsmaterial schicken","09.10.","Arbex","Offen","normal","v1704p3d4415damw0na5sfbq2n8fkwsm"],
 ["overdue","termin","","Anforderungsanalyse (verpasst)","06.10. 10:00","Maria Pantelopulu","Termin","normal",""],
 ["overdue","termin","","sellify Produktiv Update (verpasst)","09.10. 14:30","Marco Quade","Termin","normal",""],
 ["today","termin","","Anforderungsanalyse und GoLive-Absprache","12.10. 10:00","Dominik Koppe","Termin","normal",""],
 ["tomorrow","aufgabe","AG-270","Nachfassen: Martin Herden – Lemm Werbeagentur GmbH","13.10.","Martin Herden","Offen","normal","v175jyk2qv47m37a68j5td51f98fs7xj"],
 ["thisWeek","aufgabe","AG-288","AVV mit Hetzner auch für business//acts","14.10.","–","Offen","normal","v1784cn78kffpby7s8yshjkezn8fvdeh"],
 ["thisWeek","termin","","Bodo Erstpräsentation – GEWA","15.10. 15:00","GEWA Projektmanagement","Termin","normal",""],
 ["thisWeek","aufgabe","AG-155","Besuch in Waiblingen planen","15.10.","Kennenlernen und Supportzusage","Offen","normal","v1712n58b6bbt13fx9y066xjyh8efcxx"],
 ["thisWeek","aufgabe","AG-236","Thomas Wang auf Kooperation beim Vertrieb von sellify an Industrieversicherungsmakler ansprechen","16.10.","Thomas Wang","Offen","normal","v1760c38x9f3byktvwy80epn258fj4tv"]];
const BS_EIMER={overdue:21,today:1,tomorrow:1,thisWeek:4};
/* Verkaufschancen Bodo Solutions: [Nummer, Titel, Organisation, Phase, Wahrscheinlichkeit, einmalig €, jährlich €, Status, id] */
const BS_CHANCEN=[
 ["CH-2026-0016","Bodo-Einführung – Eggerbauer","Eggerbauer Bauprojektierung","Anbahnung",20,0,6000,"open","k97n149zzmp2qjp077rzgkmkms8fxqqv"],
 ["CH-2026-0015","Bodo Einführung – AMONOVA","AMONOVA GmbH","Anbahnung",20,3000,3000,"open","k97z1rkbzn3qhphtqen73jkv3h8fwyr2"],
 ["CH-2026-0014","Bodo-Einführung Bergischer Mieterring","Bergischer Mieterring e. V.","Anbahnung",20,0,5985,"open","k97n4nbxkv0f01zhdetzzazr5h8fv3np"],
 ["CH-2026-0013","Bodo Einführung – GEWA","GEWA Projektmanagement","Anbahnung",20,0,4200,"open","k97gtvg4k7vvk322rh3kv4n7js8fvrzq"],
 ["CH-2026-0012","Bodo Einführung – Lemm Werbeagentur","Lemm Werbeagentur GmbH","Anbahnung",20,0,24000,"open","k97g3xvwkt5d9xzkh3arxtxsph8fsmp9"],
 ["CH-2026-0011","Bodo Einführung – Kaspers","Kaspers GmbH","Anbahnung",20,0,0,"open","k97zaqp7b4efxy83135mnfhvad8fj90r"],
 ["CH-2026-0010","Bodo Einführung – Otten + Freckmann","Otten + Freckmann GmbH","Anbahnung",20,0,0,"open","k97hmqxrwmqrs6jxdkhgyq9qxx8fkpvr"],
 ["CH-2026-0009","Bodo Einführung – Mieterbund Darmstadt","Mieterbund Darmstadt Region Südhessen","Anbahnung",20,0,18112.5,"open","k97tqkbvdgsapgqp9ev01sp36d8fk0zn"],
 ["CH-2026-0008","Bodo Einführung – Haus & Grund Göppingen","Haus & Grund Göppingen","Anbahnung",20,0,6500,"open","k97ny0z1g8nqse67mg3vvjm7958fa6yw"],
 ["CH-2026-0007","Mieterverein Hagen – Bitfarm-Archivübernahme + Komfortfunktionen","Mietervereine Hagen","Angebot",90,15750,0,"open","k97psqxtfja9mntc59ce3b0nw98f10f0"],
 ["CH-2026-0006","Bodo Einführung – DMB Mieterverein Waiblingen","DMB Mieterverein Waiblingen","Testphase",40,0,6772.5,"open","k97jxbvam4q466xsk2ndq5f9pd8ef6vt"],
 ["CH-2026-0005","CRM mit Spendenverwaltung – Albert Schweitzer Stiftung","Albert Schweitzer Stiftung","Anbahnung",20,0,0,"open","k97vft5teqf6a8j8h1fag4e1g98ecz7t"],
 ["CH-2026-0004","Bodo Einführung – Berliner MieterGemeinschaft","Berliner MieterGemeinschaft e. V.","Anbahnung",20,0,39000,"open","k97yswepjnfz80zwy8hn2bt4r18e6kta"],
 ["CH-2026-0003","Bodo Einführung – Mieterschutzverein Groß-Duisburg","Mieterschutzverein Groß-Duisburg e. V.","Testphase",40,0,700,"open","k97r16ca5dsq94fttydxtp1f358e6jzy"],
 ["CH-2026-0002","Bodo Einführung – Mieter helfen Mietern Hamburg","Mieter helfen Mietern Hamburg","Testphase",40,0,25000,"open","k97prddr43rxnze2xb6fag339h8e7eeh"],
 ["CH-2026-0001","Bodo für den Maklervertrieb","BKP Leasing und Factoring OHG","Anbahnung",20,0,12000,"lost","k97ke09tbar69wcsrys4sqvavd8e4vmv"]];
/* MIV Hagen Migration – Aufgaben: [Nummer, Titel, Status, fällig, id] */
const BS_HAGEN=[
 ["AG-1","Aktuelle Daten aus MIV Hagen Datenbank holen","Erledigt","","v17dzd7w2rggdesxn66rgq2jtx8bacj2"],
 ["AG-2","MIV Hagen Datenbank in Bodo importieren und als Dev Convex zur Verfügung stellen","Erledigt","02.08.","v174y97xq72pdxdc362ektx3vh8ba467"],
 ["AG-81","Sachbearbeiter Klärung – welche User sind aktiv","Erledigt","","v17bj8k7h28trdzcwn6yf87wah8dv1je"],
 ["AG-90","Migration von „Hinweisen“ am Kontakt","Erledigt","","v17b95pxpdah39anm9qy3sv4358dvrzn"],
 ["AG-100","Terminaufzeichnungen 8.9.26 teilen","Erledigt","08.09.","v1732ppjyxhgtpbh266dym6f7n8e1f7t"],
 ["AG-101","Neue Teams-Termin-Einladung für 15.09. rausschicken","Erledigt","25.09.","v17ehsaezwnsncj11v5mc659ph8e1f5r"],
 ["AG-114","Prozessübergabe an Inkasso durchdenken und definieren","In Bearbeitung","17.09.","v17142s34zjy8zfv767y7txvyh8e4h99"],
 ["AG-87","Bitfarm Dokumenten Migration","In Bearbeitung","18.09.","v175czw98stjcjyt5xndca5md58dttx3"],
 ["AG-183","Nummernkreis-Übergabe MIV Hagen – Kontakt vs. Vertrag","In Bearbeitung","01.10.","v171x32ex93v601cy043bg4jrh8f5cr5"],
 ["AG-82","Lastschrift Oktober simulieren","Offen","","v17dbfm3k52qhqq1v80effp6c98dt9b3"],
 ["AG-83","2 Jahre Kündigungsfrist an Verträgen festhalten","Offen","","v178x48779ebjtma439j8xkzmh8dtv52"],
 ["AG-84","Artikel zu Gewerbetarif bündeln","Offen","","v174q7b50z7h4ew1vy951j1e358dt55h"],
 ["AG-85","Suchvorlagen & Listenexport (pdf / xlsx)","Offen","","v17dc3692tjz6sq9vbf2jb64398dvskq"],
 ["AG-86","Auswertungen","Offen","","v179gzs5xkhew5z8xg90n9h5118dt9dj"],
 ["AG-88","Meldungen an den Landesverband","Offen","","v178dd7062hngs4t5x5224yyvn8dvzq7"]];
/* sellify (per MCP) – Testdaten */
const SF_COUNT={chancenOffen:118,projekteOffen:38,aufgabenMeine:28};
const SF_CHANCEN=[["10396","Testchance ANLE","–","Angebotserstellung",50,1000],["10098","Ausschreibung Servicevertrag – Fischer Maschinenbau e.K.","Fischer Maschinenbau e.K.","Angebotserstellung",0,9079],["10350","TEST – Chance per MCP","1. FC Köln GmbH & Co. KGaA","–",0,1000],["10243","Softwarelizenzen 2026 – Roth Logistik GmbH","Roth Logistik GmbH","Bedarfsanalyse",0,261834.08],["10234","Rahmenvertrag Ersatzteile – Busch Energietechnik KG","Busch Energietechnik KG","Zusage",0,277048],["10224","Neue Steuerungstechnik – Neumann Handel SE","Neumann Handel SE","Verhandlung",0,326372.53],["10229","Modernisierung Fertigungslinie – Richter Antriebstechnik e.K.","Richter Antriebstechnik e.K.","Bedarfsanalyse",0,56161.91],["10220","Ausbau Standort – Lehmann Bau e.K.","Lehmann Bau e.K.","Angebotserstellung",0,113271.94]];
const SF_PROJ=[["10109","Produktentwicklung - Optimierung","Intern","Aktiv"],["10046","Prozessoptimierung Angebotswesen 2026","Intern","Aktiv"],["10053","Website-Relaunch 2026","Marketingprojekt","Aktiv"],["10049","Einführung Ticketsystem 2026","Verwaltung","In Planung"],["10060","Vertriebsschulung Q3 2026","Veranstaltung","Aktiv"],["10202","Ausschreibung #1","Veranstaltung","In Planung"]];
const SF_AUFG=[["02.10.","Angebotspräsentation – Walter Consulting SE","Walter Consulting SE",true],["03.10.","Vertragsverhandlung – Engel Anlagenbau GmbH","Engel Anlagenbau GmbH",true],["06.10.","Angebot nachfassen (REST-Test)","Arnold Logistik UG",true],["06.10.","Angebotspräsentation – Günther Elektrotechnik SE","Günther Elektrotechnik SE",true],["08.10.","Kick-off – Walter & Weiß GmbH & Co. KG","Walter & Weiß GmbH & Co. KG",true],["11.10.","Abstimmung Lieferplan – Heinrich Antriebstechnik GmbH","Heinrich Antriebstechnik GmbH",true],["13.10.","Messebesuch – Möller Maschinenbau GmbH & Co. KG","Möller Maschinenbau GmbH & Co. KG",false],["16.10.","Angebotspräsentation – Simon Antriebstechnik e.K.","Simon Antriebstechnik e.K.",false]];
