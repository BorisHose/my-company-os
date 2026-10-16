// ===== Bild zuschneiden: Kopf automatisch mittig =====
let SAMPLE;const sampleP=(window.claude?window.claude.use("sample"):Promise.resolve(null)).then(s=>SAMPLE=s).catch(()=>SAMPLE=null);
const loadImg=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(f)});
async function findFace(im,blob){ // liefert {x,y,w,h} in Bildpixeln oder null, plus Quelle
  try{if("FaceDetector" in window){const fd=new FaceDetector({fastMode:true,maxDetectedFaces:3});const L=await fd.detect(im);
    if(L&&L.length){const b=L.sort((a,c)=>c.boundingBox.width*c.boundingBox.height-a.boundingBox.width*a.boundingBox.height)[0].boundingBox;return {box:{x:b.x,y:b.y,w:b.width,h:b.height},src:"Browser"}}}}catch(e){}
  await sampleP;if(!SAMPLE)return null;
  try{const j=await SAMPLE.json('Auf dem Bild ist (vermutlich) eine Person. Gib den Bereich ihres Kopfes (Haare bis Kinn) als JSON zurück, Werte relativ zur Bildbreite bzw. -höhe zwischen 0 und 1: {"kopf":{"x":links,"y":oben,"w":breite,"h":hoehe}}. Bei mehreren Personen die größte. Ist kein Kopf zu sehen: {"kopf":null}. Nur das JSON.',{images:[blob],modelTier:"quick"});
    const k=j&&j.kopf;if(k&&[k.x,k.y,k.w,k.h].every(v=>typeof v==="number"&&v>=0&&v<=1)&&k.w>0&&k.h>0)return {box:{x:k.x*im.width,y:k.y*im.height,w:k.w*im.width,h:k.h*im.height},src:"Claude"}}catch(e){}
  return null}
function cropDlg(file){return new Promise(async done=>{let im;try{im=await loadImg(file)}catch(e){toast("Bild konnte nicht gelesen werden");return done(null)}
  const W=im.width,H=im.height,MIN=Math.min(W,H);
  // Startwert ohne Erkennung: oberes Drittel, mittig
  const S={size:Math.min(MIN,Math.max(W,H)*.6),cx:W/2,cy:0};S.cy=Math.min(H-S.size/2,Math.max(S.size/2,H*.35));
  const clamp=()=>{S.size=Math.max(MIN*.12,Math.min(MIN,S.size));S.cx=Math.max(S.size/2,Math.min(W-S.size/2,S.cx));S.cy=Math.max(S.size/2,Math.min(H-S.size/2,S.cy))};
  const close=modalBox(`<div class="bhead"><h3>Bild ausrichten</h3><button class="ic" id="mclose" style="font-size:18px">✕</button></div>
    <div class="crop"><canvas id="cc" width="360" height="360"></canvas><div class="side2"><div class="pv"><canvas id="cp" width="112" height="112"></canvas></div>
    <div id="cst" class="hint" style="margin:0 0 10px">Suche den Kopf …</div>
    <div class="field"><label>Zoom</label><input type="range" id="cz" min="0" max="100" value="50" style="width:100%"></div>
    <div class="hint">Bild ziehen = Ausschnitt verschieben · Mausrad oder Regler = zoomen</div></div></div>
    <div class="btns" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="cx">Abbrechen</button><button class="btn p" id="cok">Übernehmen</button></div>`);
  const cc=$("#cc"),x=cc.getContext("2d"),cp=$("#cp").getContext("2d"),Z=$("#cz");
  const k=()=>Math.min(cc.width/W,cc.height/H); // ganze Bildansicht
  const draw=()=>{clamp();const s=k(),ox=(cc.width-W*s)/2,oy=(cc.height-H*s)/2;x.clearRect(0,0,cc.width,cc.height);x.drawImage(im,ox,oy,W*s,H*s);
    x.save();x.fillStyle="rgba(0,0,0,.55)";x.beginPath();x.rect(0,0,cc.width,cc.height);x.arc(ox+S.cx*s,oy+S.cy*s,S.size*s/2,0,Math.PI*2,true);x.fill("evenodd");
    x.strokeStyle="#fff";x.lineWidth=2;x.beginPath();x.arc(ox+S.cx*s,oy+S.cy*s,S.size*s/2,0,Math.PI*2);x.stroke();x.restore();
    cp.clearRect(0,0,112,112);cp.drawImage(im,S.cx-S.size/2,S.cy-S.size/2,S.size,S.size,0,0,112,112);
    Z.value=Math.round(100-(S.size-MIN*.12)/(MIN*.88)*100)};
  draw();
  Z.oninput=()=>{S.size=MIN*.12+(100-+Z.value)/100*MIN*.88;draw()};
  cc.onwheel=e=>{e.preventDefault();S.size*=e.deltaY>0?1.08:1/1.08;draw()};
  cc.onpointerdown=e=>{cc.setPointerCapture(e.pointerId);const x0=e.clientX,y0=e.clientY,c0=[S.cx,S.cy],r=cc.width/cc.getBoundingClientRect().width;
    cc.onpointermove=ev=>{S.cx=c0[0]+(ev.clientX-x0)*r/k();S.cy=c0[1]+(ev.clientY-y0)*r/k();draw()};cc.onpointerup=()=>{cc.onpointermove=null}};
  let open=true;const fin=v=>{if(!open)return;open=false;close();done(v)};
  $("#mclose").onclick=()=>fin(null);$("#cx").onclick=()=>fin(null);
  $("#cok").onclick=()=>{const c=document.createElement("canvas");c.width=c.height=160;c.getContext("2d").drawImage(im,S.cx-S.size/2,S.cy-S.size/2,S.size,S.size,0,0,160,160);fin(c.toDataURL("image/jpeg",.85))};
  const f=await findFace(im,file);if(!open)return;
  if(f){const b=f.box;S.cx=b.x+b.w/2;S.cy=b.y+b.h/2;S.size=Math.max(b.w,b.h)*1.9;draw();$("#cst").innerHTML=`<span class="okm">✓</span> Kopf erkannt und mittig ausgerichtet (${f.src==="Claude"?"Erkennung durch Claude":"Erkennung im Browser"}). Bei Bedarf anpassen.`}
  else $("#cst").textContent="Kein Kopf erkannt – bitte Ausschnitt selbst zurechtschieben."})}