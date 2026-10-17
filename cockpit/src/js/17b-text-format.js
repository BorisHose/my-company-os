// ===== Formatierter Auftragstext (v76): Speicherung als einfaches Markdown im Feld „in“ =====
// Erlaubt: **fett**, *kursiv*, Zwischenüberschrift (## …), Aufzählung (- …), Nummerierung (1. …), Links [Text](https://…).
// Alter Klartext bleibt gültig. Claude bekommt den Text unverändert (Markdown liest Claude direkt).
const MDLINK=/\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g;
function mdInline(s,o){o=o||{};let t=esc(s);
  t=t.replace(MDLINK,(m,a,h)=>`<a href="${h}" target="_blank" rel="noopener">${a}</a>`);
  t=t.replace(/\*\*(?=\S)([^*\n]+?)\*\*/g,(m,x)=>/\s$/.test(x)?m:"<b>"+x+"</b>").replace(/(^|[^*\w])\*(?=\S)([^*\n]+?)\*(?!\w)/g,(m,a,x)=>/\s$/.test(x)?m:a+"<i>"+x+"</i>");
  if(o.ph)t=t.replace(/\[([^\]\n<>]{1,40})\](?!\()/g,'<span class="dx-ph">[$1]</span>');
  return t}
// mdHtml(md,{ed,ph}): ed = für das Eingabefeld (eine Zeile je <div>), sonst Anzeige mit Absätzen
function mdHtml(md,o){o=o||{};const L=String(md||"").replace(/\r/g,"").split("\n"),H=[];let i=0;
  const OL=/^\s*(\d+)[.)]\s+/,olStart=k=>{const m=OL.exec(L[k]||"");return !!m&&+m[1]===1};
  const li=(re,tag)=>{const it=[];let n=1;while(i<L.length&&re.test(L[i])){if(tag==="ol"){const m=OL.exec(L[i]);if(+m[1]!==n)break;n++}it.push("<li>"+mdInline(L[i].replace(re,""),o)+"</li>");i++}H.push(`<${tag}>${it.join("")}</${tag}>`)};
  const blk=k=>/^\s*(#{1,4}|[-*•])\s+/.test(L[k])||olStart(k);
  while(i<L.length){const l=L[i];
    if(/^\s*#{1,4}\s+/.test(l)){H.push("<h3>"+mdInline(l.replace(/^\s*#{1,4}\s+/,""),o)+"</h3>");i++}
    else if(/^\s*[-*•]\s+/.test(l))li(/^\s*[-*•]\s+/,"ul");
    else if(olStart(i))li(OL,"ol");
    else if(o.ed){H.push("<div>"+(l.trim()?mdInline(l,o):"<br>")+"</div>");i++}
    else if(!l.trim())i++;
    else{const P=[];while(i<L.length&&L[i].trim()&&(!P.length||!blk(i))){P.push(mdInline(L[i],o));i++}H.push("<p>"+P.join("<br>")+"</p>")}}
  return H.join("")}
// htmlMd(element): Inhalt eines Eingabefelds (contenteditable) → Markdown
function htmlMd(root){const BL=/^(DIV|P|H[1-6]|UL|OL|LI|BLOCKQUOTE|PRE|TABLE|TR)$/;
  const inl=n=>{if(n.nodeType===3)return n.nodeValue.replace(/[\t\r\n ]+/g," ").replace(/ /g," ");if(n.nodeType!==1)return "";
    const t=n.tagName;if(t==="BR")return "\n";if(t==="STYLE"||t==="SCRIPT")return "";
    const c=[...n.childNodes].map(inl).join("");const w=x=>{const m=c.match(/^(\s*)([\s\S]*?)(\s*)$/);return m[2]?m[1]+x+m[2]+x+m[3]:c};
    if(t==="B"||t==="STRONG"||(t==="SPAN"&&/^(bold|[6-9]00)$/.test(n.style&&n.style.fontWeight)))return w("**");
    if(t==="I"||t==="EM")return w("*");
    if(t==="A"){const h=n.getAttribute("href")||"";return /^(https?:|mailto:)/i.test(h)&&c.trim()?"["+c.trim()+"]("+h+")":c}
    if(t==="TD"||t==="TH")return c.trim()+" | ";if(BL.test(t))return c+"\n";return c};
  const L=[];let cur="";const fl=()=>{if(cur!==""){cur.split("\n").forEach(x=>L.push(x));cur=""}};
  const walk=n=>{for(const c of n.childNodes){
    if(c.nodeType===1&&BL.test(c.tagName)){fl();const t=c.tagName;
      if(/^H/.test(t))L.push("## "+inl(c).replace(/\n+/g," ").trim());
      else if(t==="UL"||t==="OL"){let k=1;for(const li of c.querySelectorAll(":scope>li"))L.push((t==="OL"?(k++)+". ":"- ")+inl(li).replace(/\n+/g," ").trim())}
      else if(t==="LI")L.push("- "+inl(c).replace(/\n+/g," ").trim());
      else if([...c.children].some(x=>BL.test(x.tagName))){walk(c);fl()}
      else{inl(c).replace(/\n$/,"").split("\n").forEach(x=>L.push(x));if(t==="P")L.push("")}}
    else cur+=inl(c)}};
  walk(root);fl();
  return L.map(x=>x.replace(/^ +/,"").replace(/ \| *$/,"")).join("\n").replace(/[ \t]+$/gm,"").replace(/\n{3,}/g,"\n\n").trim()}
const rtMd=el=>el?(el.isContentEditable||el.getAttribute("contenteditable")?htmlMd(el):String(el.value||"")):"";
const mdText=md=>String(md||"").replace(MDLINK,"$1").replace(/\*\*(?=\S)([^*\n]+?)\*\*/g,"$1").replace(/(^|[^*\w])\*(?=\S)([^*\n]+?)\*(?!\w)/g,"$1$2").replace(/^\s*#{1,4}\s+/gm,"").replace(/^\s*[-*•]\s+/gm,"• ");
// Eingabefeld mit Leiste: Knöpfe [data-rt], Einfügen wird bereinigt; Bilder bleiben Sache des Aufrufers (onImage)
function rtBind(ed,bar,o){o=o||{};let rng=null;const keep=()=>{const s=getSelection();if(s.rangeCount&&ed.contains(s.anchorNode))rng=s.getRangeAt(0).cloneRange()};
  const back=()=>{ed.focus();if(rng){const s=getSelection();s.removeAllRanges();s.addRange(rng)}};
  ed.addEventListener("keyup",keep);ed.addEventListener("mouseup",keep);ed.addEventListener("blur",keep);
  try{document.execCommand("defaultParagraphSeparator",false,"div")}catch(e){}
  if(bar)bar.querySelectorAll("[data-rt]").forEach(b=>{b.onmousedown=e=>e.preventDefault();b.onclick=async()=>{const c=b.dataset.rt;
    if(c==="h"){back();const bl=(getSelection().anchorNode||{}).parentElement;document.execCommand("formatBlock",false,bl&&bl.closest&&bl.closest("h3")?"div":"h3")}
    else if(c==="link"){keep();const u=await askText("Link einfügen","https://",{ok:"Einfügen"});if(!u||!/^(https?:\/\/|mailto:)/i.test(u))return u&&toast("Bitte eine Adresse mit https:// angeben");back();if(getSelection().isCollapsed)document.execCommand("insertHTML",false,`<a href="${esc(u)}">${esc(u)}</a>`);else document.execCommand("createLink",false,u)}
    else if(c==="ph"&&o.onPh){keep();const n=await askText("Platzhalter einfügen","",{ph:"z. B. Kunde",ok:"Einfügen"});if(!n)return;back();document.execCommand("insertText",false,"["+n.replace(/[\[\]]/g,"")+"]");o.onPh()}
    else{back();document.execCommand(c,false,null)}
    keep();if(o.onChange)o.onChange()}});
  ed.addEventListener("paste",e=>{const cd=e.clipboardData;if(!cd)return;if([...(cd.items||[])].some(x=>x.type&&x.type.startsWith("image/")))return;
    e.preventDefault();const h=cd.getData("text/html");if(h){const d=document.createElement("template");d.innerHTML=h.replace(/<(script|style)[\s\S]*?<\/\1>/gi,"");document.execCommand("insertHTML",false,mdHtml(htmlMd(d.content),{ed:1}))}else document.execCommand("insertText",false,cd.getData("text/plain"))});
  if(o.onChange)ed.addEventListener("input",o.onChange)}
const rtLeiste=(ph)=>`<div class="dx-tb" role="toolbar" aria-label="Formatierung"><button type="button" data-rt="bold" title="Fett (Strg+B)"><b>B</b></button><button type="button" data-rt="italic" title="Kursiv (Strg+I)"><i>I</i></button><button type="button" data-rt="h" title="Zwischenüberschrift">H</button><button type="button" data-rt="insertUnorderedList" title="Aufzählung">• Liste</button><button type="button" data-rt="insertOrderedList" title="Nummerierung">1. Liste</button><button type="button" data-rt="link" title="Link">🔗 Link</button>${ph?'<span class="sp"></span><button type="button" data-rt="ph" title="Platzhalter wie [Kunde] einfügen">＋ Platzhalter</button>':""}</div>`;
