// ===== Adapter Bodo (Konnektor „bodo solutions“) =====
// Bodo kennt Mandanten (orgId). Eigene Mandanten stehen in den Einstellungen (settings.bodoOrgs) und werden in ⚙ Anbindungen gepflegt.
const ownOrgs=()=>(SET.bodoOrgs&&SET.bodoOrgs.length?SET.bodoOrgs:[]);
adapterRegistrieren((()=>{
  const N="Bodo",SERVER="bodo solutions";
  const rufe=(tool,input,schreiben)=>mcpRufe(SERVER,tool,input,schreiben?{cache:false}:undefined,N);
  const fehler=e=>mcpFehlerText(e,N,SERVER);
  const pjStatus=s=>s==="active"?"aktiv":s==="paused"?"pausiert":"abgeschlossen";
  return {id:"bodo",n:N,server:SERVER,connector:SERVER,werkzeuge:["bodo_list_orgs","bodo_search","bodo_action"],
    mand:true,kiUser:false,neuZuerst:false,abgleichErsatz:true,
    ent:{crm:[["contact","Kontakt/Firma"],["member","Vertragsinhaber"],["opportunity","Verkaufschance"],["lead","Vertriebsanfrage"]],auftrag:[["order","Auftrag"],["opportunity","Verkaufschance"]],projekt:[["project","Projekt"]],zeit:[["timeEntry","Zeiteintrag"]]},
    rufe,fehler,mandanten:ownOrgs,mandantenDlg:()=>ownOrgsDlg(),
    // Mandant erreichbar, KI-Zugang aktiv, Entität lesbar; die Mandantenliste wird je Prüflauf nur einmal geholt (ctx)
    async pruefen(d,dienst,ctx){
      if(!ctx.bodoOrgs)ctx.bodoOrgs=((await rufe("bodo_list_orgs",{}))||{}).orgs||[];const m=ctx.bodoOrgs.find(x=>x.orgId===d.orgId);
      if(!m)return {st:"err",t:"Mandant „"+(d.orgN||d.orgId)+"“ ist für dieses Konto nicht erreichbar"};
      if(m.mcpAccess&&m.mcpAccess.allowed===false)return {st:"err",t:m.mcpAccess.message||"KI-Zugang im Mandanten gesperrt"};
      await rufe("bodo_search",{resourceType:d.ent,orgId:d.orgId,limit:1,fields:["_id"]});
      return {st:"ok",t:"Mandant „"+m.name+"“ erreichbar, "+entN("bodo",dienst,d.ent)+" lesbar"}},
    // Eine Seite Projekte; Bodo sortiert alphabetisch (keine Sortierung nach Anlagedatum in der Schnittstelle)
    async projekte({mand,q,alle,next}){const inp={resourceType:"project",orgId:mand.id,achsen:{status:alle?"alle":"aktiv"},limit:LISTE_SEITE};if(q)inp.query=q;if(next)inp.cursor=next;
      const r=await rufe("bodo_search",inp);
      return {items:((r&&r.items)||[]).map(x=>{const d=x.data||{};return {id:String(x.id),title:x.title||d.name||"",n:x.title||d.name||"",url:x.url||"",st:pjStatus(d.projectStatus),owner:d.ownerName||"",descr:d.description||""}}),
        next:r&&r.hasMore&&r.nextCursor||null,total:null,neuZuerst:false}},
    // Benutzer (Sitze) im Mandanten nach E-Mail und Name; nur exakte Treffer, ausgetretene nicht
    async benutzerSuchen({mand,name,mail}){const orgId=mand&&mand.id;const q=async s=>{const p=await rufe("bodo_search",{resourceType:"benutzer",orgId,query:s,limit:50});return (p&&p.items||[]).map(x=>x.data||{})};
      const L=[];const add=a=>a.forEach(x=>{if(!L.some(y=>y.membershipId===x.membershipId))L.push(x)});
      if(mail)add(await q(mail));if(name)add(await q(name));
      const m=(mail||"").toLowerCase(),nn=(name||"").toLowerCase();
      return L.filter(x=>x.status!=="left"&&((m&&(x.email||"").toLowerCase()===m)||(nn&&(x.name||"").toLowerCase()===nn)))},
    projektKontext:B=>({wo:"Bodo-Projekt „"+B.n+"“ (projectId "+B.id+", Mandant "+(B.orgN||"")+" = orgId "+B.orgId+", "+B.url+")",
      ziel:"Mandant für diese Anlagen ist "+(B.orgN||B.orgId)+" (durch das Projekt eindeutig, keine Annahme)"})}})());
