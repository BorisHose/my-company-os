// ===== Adapter-Basis: Anbindung an Backend-Systeme über claude.ai-Konnektoren (MCP) =====
// Grundsatz: Kein Teil des Organigraph spricht ein Backend-System direkt an. Projekte, Benutzer-Zuordnung und Anbindungen
// rufen ausschließlich die Funktionen eines Adapters auf. Ein neues System = eine neue Adapter-Datei (07x-adapter-<system>.js),
// die sich mit adapterRegistrieren() anmeldet. Die Reihenfolge der Registrierung ist die Anzeigereihenfolge.
//
// Vertrag eines Adapters (alle Felder Pflicht, Funktionen asynchron, wo angegeben):
//   id            Kennung im Datenbestand (z. B. "bodo"); nie ändern, steht in gespeicherten Zuordnungen und Projekten
//   n             Anzeigename
//   server        Name des claude.ai-Konnektors für Aufrufe aus der Seite
//   connector     Name des Konnektors in Hinweistexten
//   werkzeuge     Werkzeuge des Konnektors, die die Seite aufruft (= Berechtigungen der Seite, Grundlage für die Installation)
//   mand          true, wenn das System Mandanten kennt (dann gehört zu jeder Anbindung eine orgId)
//   kiUser        true, wenn das System KI-Benutzer (Agent als eigener, nicht-physischer Benutzer) kennt
//   neuZuerst     true, wenn Projektlisten nach Anlagedatum (neueste zuerst) geliefert werden
//   ent           je Dienst (crm, auftrag, projekt, zeit) die Entitäten als [[kennung, anzeigename], …]; leer = Dienst nicht verfügbar
//   rufe(tool, input, schreiben)      → Rohaufruf eines Konnektor-Werkzeugs (nur im Adapter selbst und in systemeigenen Oberflächen,
//                                       z. B. der Bodo-Benutzerverwaltung; schreiben = true umgeht den Zwischenspeicher)
//   fehler(e)                         → Fehlertext für die Oberfläche
//   mandanten()                       → [{id, name}] der eigenen Mandanten (leer, wenn mand = false)
//   pruefen(d, dienst, ctx)           → {st: "ok"|"err"|"info", t}  (d = Anbindung {sys, orgId, orgN, ent}; ctx = Zwischenspeicher je Prüflauf)
//   projekte({mand, q, alle, next})   → {items:[{id, title, n, url, st, owner, descr}], next, total, neuZuerst}  (eine Seite)
//   benutzerSuchen({mand, name, mail})→ [{name, email, membershipId, userId, status, roleNames}]  (nur eindeutige Treffer nach Name/E-Mail)
//   projektKontext(bk)                → {wo, ziel}  Texte für die Claude-Sitzung zu einem verbundenen Projekt
//   abgleichErsatz                    true: findet der Abgleich die gespeicherte Benutzer-Id nicht mehr, darf er einen anderen Treffer übernehmen
//   mandantenDlg                      optional: Funktion, die die eigenen Mandanten pflegen lässt (Knopf unter ⚙ Anbindungen)
//   pruefHinweis                      optional: Hinweistext, was die Seite bei diesem System nicht selbst prüfen kann

const LISTE_SEITE=25; // Grundsatz Backend-Listen (Boris 17.10.2026): seitenweise, 25 je Abruf, neueste zuerst wo möglich
const DIENSTE=[["crm","CRM","Kontakte, Organisationen, Verkaufschancen"],["auftrag","Auftragsmanagement","der kommerzielle Auftrag – in der Regel über das Projekt geführt"],["projekt","Projekt","Klammer für Aufgaben, Notizen und Termine eines Auftrags"],["zeit","Zeiterfassung","Zeiteinträge, z. B. für die Laufzeit der KI-Sitzungen"]];

// --- MCP-Verbindung der Seite (eine für alle Konnektoren) ---
let MCP=null;const mcpP=(window.claude?window.claude.use("mcp"):Promise.resolve(null)).then(m=>MCP=m).catch(()=>MCP=null);
const mcpBereit=()=>!!MCP;
// Aufruf eines Konnektor-Werkzeugs; liefert die Nutzlast (JSON wird ausgepackt). opts wird unverändert an callTool gegeben.
async function mcpRufe(server,tool,input,opts,name){await mcpP;if(!MCP)throw {code:"not_granted",message:(name||server)+"-Anbindung auf dieser Seite nicht verfügbar"};
  const r=await MCP.callTool(server,tool,input,opts);let p=r.payload;if(typeof p==="string"){try{p=JSON.parse(p)}catch(x){}}return p}
// Fehlertext für Konnektor-Fehler; name = Systemname in der Meldung, connector = Konnektorname in claude.ai
function mcpFehlerText(e,name,connector){const c=e&&e.code;
  return c==="server_not_connected"?name+"-Verbindung nicht gefunden – in claude.ai unter Einstellungen → Konnektoren „"+connector+"“ hinzufügen."
  :c==="needs_reauth"?name+"-Verbindung abgelaufen – in claude.ai unter Einstellungen → Konnektoren neu verbinden."
  :c==="not_in_manifest"||c==="not_granted"||c==="consent_required"?"Der Zugriff auf "+name+" wurde für diese Seite nicht erlaubt (Berechtigungen der Seite)."
  :c==="approval_required"?"Der Aufruf braucht deine Freigabe – bitte erneut versuchen und erlauben."
  :c==="selection_required"?"Mehrere "+name+"-Verbindungen vorhanden – bitte in claude.ai eine auswählen."
  :c==="server_unavailable"?name+" antwortet gerade nicht – kurz warten und erneut versuchen."
  :c==="tool_error"?name+" hat abgelehnt: "+(e.message||""):"Fehler bei "+name+" ("+(c||"unbekannt")+"): "+(e&&e.message||"")}

// --- Register ---
const ADAPTER={};
const ADAPTER_PFLICHT=["id","n","server","connector","werkzeuge","mand","kiUser","neuZuerst","ent","rufe","fehler","mandanten","pruefen","projekte","benutzerSuchen","projektKontext","abgleichErsatz"];
function adapterRegistrieren(a){const fehlt=ADAPTER_PFLICHT.filter(k=>!(k in a));if(fehlt.length)throw new Error("Adapter "+(a.id||"?")+" unvollständig: "+fehlt.join(", "));
  DIENSTE.forEach(([k])=>{if(!Array.isArray(a.ent[k]))throw new Error("Adapter "+a.id+": Entitäten für Dienst "+k+" fehlen")});ADAPTER[a.id]=Object.freeze(a)}
const adapter=id=>ADAPTER[id]||null;
const adapterListe=()=>Object.values(ADAPTER);
const sysName=id=>ADAPTER[id]?ADAPTER[id].n:id==="andere"?"Anderes System":String(id||"");
const entN=(s,d,e)=>((ADAPTER[s]&&ADAPTER[s].ent[d]||[]).find(x=>x[0]===e)||[e,e])[1];
// Berechtigungen der Seite, wie sie die Adapter brauchen (für Installation und Prüfung; Claude Code Remote kommt aus der Ausführung dazu)
const adapterWerkzeuge=()=>adapterListe().map(a=>({server:a.server,tools:[...a.werkzeuge]}));
