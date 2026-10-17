// ===== Dialoge (alert/confirm/prompt gibt es im Artefakt nicht) =====
// dlg(html,dx): kleines Fenster; mit dx im neuen Aufbau (Kopf, Inhalt, Fuß). Rückgabe: Text (Eingabefeld), true (Ja) oder null.
function dlg(html,dx){return new Promise(res=>{const d=document.createElement("div");d.id="dlg";d.innerHTML=`<div class="modal" style="z-index:40"><div class="box${dx?" dx dx-dlg":""}">${html}</div></div>`;document.body.appendChild(d);
  const done=v=>{d.remove();res(v)},i=d.querySelector("input[type=text],textarea"),val=()=>i.value.trim();
  d.querySelector("[data-no]").onclick=()=>done(null);const x=d.querySelector(".dx-x");if(x)x.onclick=()=>done(null);
  d.querySelector("[data-yes]").onclick=()=>done(i?val():true);
  d.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();done(null)}});
  if(i){i.focus();if(i.select&&i.tagName!=="TEXTAREA")i.select();i.onkeydown=e=>{if(e.key==="Enter"&&(i.tagName!=="TEXTAREA"||e.ctrlKey||e.metaKey)){e.preventDefault();done(val())}}}
  else{const y=d.querySelector("[data-yes]");if(y)y.focus()}})}
const dlgKopf=(t,sub)=>`<div class="dx-head"><h3>${esc(t)}${sub?`<span class="dx-sub">${sub}</span>`:""}</h3><button class="dx-x" title="Schließen">✕</button></div>`;
// askText(Titel, Vorgabe, {mehrzeilig, bezug, ph, ok})
const askText=(t,v,o)=>{o=o||{};return dlg(`${dlgKopf(t,o.bezug?esc(o.bezug):"")}<div class="dx-pad">${o.mehrzeilig?`<textarea id="dlgin" placeholder="${esc(o.ph||"")}">${esc(v||"")}</textarea><div class="hint">Strg+Enter speichert</div>`:`<input type="text" id="dlgin" value="${esc(v||"")}" placeholder="${esc(o.ph||"")}">`}</div><div class="dx-foot"><span class="dx-sum"></span><button class="btn" data-no>Abbrechen</button><button class="btn p" data-yes>${esc(o.ok||"OK")}</button></div>`,1)};
// askOk(Frage, Knopftext, {text, folgen:[…], nein, gefahr, titel}) – Titel = Frage bis zum ersten „?“, der Rest als Erklärung
const askOk=(t,l,o)=>{o=o||{};l=l||"Ja, löschen";const m=o.text||o.titel?null:String(t).match(/^(.*?\?)\s+(.+)$/s),ti=o.titel||(m?m[1]:t),tx=o.text||(m?m[2]:"");
  const gef=o.gefahr!==undefined?o.gefahr:/lösch|abbrech|verwerf|entfern|lösen/i.test(l);
  return dlg(`${dlgKopf(ti)}${tx||(o.folgen||[]).length?`<div class="dx-pad">${tx?`<p>${esc(tx)}</p>`:""}${(o.folgen||[]).length?`<ul class="dx-fol">${o.folgen.map(f=>`<li>${esc(f)}</li>`).join("")}</ul>`:""}</div>`:""}<div class="dx-foot"><span class="dx-sum"></span><button class="btn" data-no>${esc(o.nein||"Abbrechen")}</button><button class="btn ${gef?"dd":"p"}" data-yes>${esc(l)}</button></div>`,1).then(v=>!!v)};
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg)}catch(e){const p=$("#pv");if(p){p.closest("details").open=true;const r=document.createRange();r.selectNodeContents(p);const s=getSelection();s.removeAllRanges();s.addRange(r)}toast("Kopieren nicht möglich – Text ist markiert")}}
const now=()=>{const d=new Date();return d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})};
const uid=p=>p+"-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
// Großes Fenster (Assistenten, Auswahllisten); liefert die Schließen-Funktion
function modalBox(html,wide){$("#modal").innerHTML=`<div class="modal"><div class="box wz ${wide?'wide':''}" id="box">${html}</div></div>`;return ()=>$("#modal").innerHTML=""}
