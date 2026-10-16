// ===== Oberflächen-Zustand (nur in diesem Browser) =====
const UI=(()=>{try{return JSON.parse(localStorage.getItem("cos-ui")||"{}")}catch(e){return {}}})();
const EOPEN=new Set(UI.eopen||["basis","skills"]);let LIBON=UI.lib!==false;
function saveUI(){try{localStorage.setItem("cos-ui",JSON.stringify({eopen:[...EOPEN],lib:LIBON,agw:UI.agw,libw:UI.libw,kidone:UI.kidone,kiold:UI.kiold,pw:UI.pw}))}catch(e){}}
function setLib(on){on=false;LIBON=on;$("#build").classList.toggle("nolib",!on);const b=$("#libtg");if(b)b.textContent=on?"Bibliothek ausblenden ▸":"◂ Bibliothek einblenden";saveUI()}