// ===== Adapter sellify (Konnektor „sellify_mcp“) =====
// sellify ist ein System ohne Mandanten. Die Seite liest Projekte und Benutzer; alles Weitere erreicht die Claude-Sitzung über ihren Konnektor.
adapterRegistrieren((()=>{
  const N="sellify",SERVER="sellify_mcp",CONNECTOR="sellify";
  const rufe=(tool,input,schreiben)=>mcpRufe(SERVER,tool,input,schreiben?{cache:false}:undefined,N);
  const fehler=e=>mcpFehlerText(e,N,CONNECTOR);
  const pjStatus=x=>x.done?"abgeschlossen":/paus|ruht|hold/i.test(((x.status||{}).name||{})["de-DE"]||"")?"pausiert":"aktiv";
  const mail=p=>{const e=p&&p.emailAddress;return typeof e==="string"?e:e?(e.address||e.value||e.email||""):""};
  return {id:"sellify",n:N,server:SERVER,connector:CONNECTOR,werkzeuge:["sellify_project","sellify_user"],
    mand:false,kiUser:false,neuZuerst:true,abgleichErsatz:false,
    ent:{crm:[["contact","Organisation"],["person","Person"],["sale","Chance"]],auftrag:[["sale","Chance"],["project","Projekt"]],projekt:[["project","Projekt"]],zeit:[]},
    rufe,fehler,mandanten:()=>[],
    pruefHinweis:"Bei sellify prüft die Seite nur die Projekte; die übrigen Bereiche erreicht die Claude-Sitzung über ihren Connector.",
    // Prüfbar ist aus der Seite nur die Entität Projekt (Werkzeug sellify_project)
    async pruefen(d,dienst){if(d.ent!=="project")return {st:"info",t:N+" ist aus dieser Seite nicht prüfbar – die Claude-Sitzung nutzt den Connector „"+CONNECTOR+"“."};
      await rufe("sellify_project",{action:"list",params:{limit:1}});return {st:"ok",t:N+" erreichbar, "+entN("sellify",dienst,d.ent)+" lesbar"}},
    // Eine Seite Projekte, neueste zuerst (sort -registered), mit Gesamtzahl
    async projekte({q,alle,next}){const params={limit:LISTE_SEITE,offset:next||0,sort:"-registered"};if(!alle)params.done=false;if(q)params.q=q;
      const r=await rufe("sellify_project",{action:"list",params});
      return {items:((r&&r.items)||[]).map(x=>{const o=x.responsible||{};return {id:String(x.id),title:(x.name||"")+(x.number?" ("+x.number+")":""),n:x.name||"",url:x.webUrl||"",st:pjStatus(x),owner:[o.firstName,o.lastName].filter(Boolean).join(" "),descr:x.description||""}}),
        next:r&&r.hasMore?(r.nextOffset||(next||0)+LISTE_SEITE):null,total:r&&r.total!=null?r.total:null,neuZuerst:true}},
    // Benutzer nach Nachname suchen; Treffer nur bei gleichem vollen Namen oder gleicher E-Mail, gelöschte nicht
    async benutzerSuchen({name,mail:m}){const nn=String(name||"").trim().toLowerCase(),mm=String(m||"").trim().toLowerCase(),q=String(name||"").trim().split(/\s+/).pop()||"";if(!q)return [];
      const r=await rufe("sellify_user",{action:"list",params:{q,limit:25}});
      return ((r&&r.items)||[]).filter(x=>!x.deleted).map(x=>{const p=x.person||{};return {name:[p.firstName,p.lastName].filter(Boolean).join(" "),email:mail(p),membershipId:String(x.id),userId:x.login||"",status:x.retired||(p.retired)?"left":x.canLogin===false?"unclaimed":"active",roleNames:(x.roles||[]).filter(r=>!r.deleted).map(r=>r.name)}})
        .filter(h=>(mm&&h.email.toLowerCase()===mm)||(nn&&h.name.toLowerCase()===nn))},
    projektKontext:B=>({wo:"sellify-Projekt „"+B.n+"“ (Projekt-Id "+B.id+", Werkzeug sellify_project bzw. Bezug project, "+B.url+")",
      ziel:"Zielsystem ist damit sellify (durch das Projekt eindeutig, keine Annahme)"})}})());
