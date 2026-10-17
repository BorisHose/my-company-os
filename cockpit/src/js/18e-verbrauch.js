// ===== Verbrauch je Auftrag und Projekt (Etappe 4b, Teil 2) =====
// Jede Claude-Sitzung misst vor ihrem letzten Schreibvorgang Laufzeit und Tokens aus ihrem eigenen Sitzungsprotokoll und hängt sie an j.verb an:
// {sess, art, start, ende, sek, tin, tcw, tcr, tout, model} bzw. {sess, fehler}. Erfasst wird nur in Company OS, nichts wird ins Backend gebucht.
const VBK=["sek","tin","tcw","tcr","tout"];
const VB0=()=>({n:0,sek:0,tin:0,tcw:0,tcr:0,tout:0,jobs:0,mit:0});
const vbOk=v=>v&&!v.fehler&&v.sek!=null;
function vbJob(j,tief=true){const a=VB0();a.jobs=1;const L=(j.verb||[]).filter(vbOk);L.forEach(v=>{a.n++;VBK.forEach(k=>a[k]+=Math.max(0,+v[k]||0))});
  if(!L.length&&j.vb){a.n=j.vb.n||0;VBK.forEach(k=>a[k]+=+j.vb[k]||0)}
  if(tief)teileVon(j).filter(Boolean).forEach(k=>{const b=vbJob(k,false);a.n+=b.n;VBK.forEach(x=>a[x]+=b[x])});a.mit=a.n?1:0;return a}
function vbSumme(L){const a=VB0();L.forEach(j=>{const b=vbJob(j);a.n+=b.n;a.jobs++;a.mit+=b.mit;VBK.forEach(k=>a[k]+=b[k])});return a}
const vbTok=a=>a.tin+a.tcw+a.tcr+a.tout;
const fmtDauer=s=>{s=Math.round(s||0);return s<60?s+" s":s<3600?Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" min":Math.floor(s/3600)+" h "+String(Math.round(s%3600/60)).padStart(2,"0")+" min"};
const fmtTok=n=>n>=1e6?(n/1e6).toLocaleString("de-DE",{maximumFractionDigits:1})+" Mio.":n>=1e4?Math.round(n/1e3).toLocaleString("de-DE")+" Tsd.":Math.round(n).toLocaleString("de-DE");
const vbKurz=a=>a.n?`⏱ ${fmtDauer(a.sek)} · ${fmtTok(vbTok(a))} Tokens`:"";
const vbAuf=a=>`Eingabe ${fmtTok(a.tin)} · Cache geschrieben ${fmtTok(a.tcw)} · Cache gelesen ${fmtTok(a.tcr)} · Ausgabe ${fmtTok(a.tout)}`;
const VBHINT="Gemessen von der jeweiligen Claude-Sitzung aus ihrem eigenen Protokoll; der letzte Schreibvorgang einer Sitzung ist nicht enthalten, die Werte sind daher leicht zu niedrig. Im Abo zählen Tokens gegen das Nutzungskontingent und werden nicht einzeln abgerechnet.";
// Ergebnisfenster eines Auftrags
function vbJobHtml(j){const a=vbJob(j),S=(j.sess||[]).length,F=(j.verb||[]).filter(v=>v&&v.fehler);if(!a.n&&!S)return "";
  const tl=Array.isArray(j.teile)?" (mit Teilaufträgen)":"";
  return `<div class="flabel" style="margin-top:10px">Verbrauch${tl}</div>${a.n?`<div class="vbbox"><b>${fmtDauer(a.sek)}</b> Laufzeit · <b>${fmtTok(vbTok(a))}</b> Tokens · ${a.n} Sitzung${a.n===1?"":"en"} gemessen<div class="hint" style="margin:2px 0 0">${vbAuf(a)}</div></div>`:`<div class="hint" style="margin:0">Nicht erfasst – Auftrag vor Version 59 oder die Sitzung hat keine Messung eingetragen.</div>`}${F.length?`<div class="hint" style="margin:2px 0 0">⚠ Messung nicht möglich: ${esc(F.map(v=>v.fehler).join("; "))}</div>`:""}`}
// Projekt bzw. „ohne Projekt“
function vbPjHtml(L){const a=vbSumme(L);if(!L.length)return `<div class="hint" style="margin:0">Noch keine Aufträge.</div>`;
  return `<div class="vbgrid"><div><small>Laufzeit</small><b>${a.n?fmtDauer(a.sek):"–"}</b></div><div><small>Tokens</small><b>${a.n?fmtTok(vbTok(a)):"–"}</b></div><div><small>Sitzungen</small><b>${a.n}</b></div><div><small>Aufträge gemessen</small><b>${a.mit} von ${a.jobs}</b></div></div>
    ${a.n?`<div class="hint" style="margin:4px 0 0">${vbAuf(a)}</div>`:""}<div class="hint" style="margin:4px 0 0">${VBHINT} Berücksichtigt sind die geladenen Aufträge (offen und erledigt der letzten 90 Tage); Teilaufträge zählen beim Hauptauftrag.</div>`}
// Kurzfassung fürs Archiv
const vbArchiv=j=>{const a=vbJob(j,false);return a.n?{n:a.n,sek:a.sek,tin:a.tin,tcw:a.tcw,tcr:a.tcr,tout:a.tout}:null};
