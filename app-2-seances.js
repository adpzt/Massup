// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
function init(){
  loadDB();
  try{ noteRegrade(); }catch(e){ console.warn('[MASSUP] noteRegrade:',e); }
  try{ noteRegradeTemps(); }catch(e){ console.warn('[MASSUP] noteRegradeTemps:',e); }
  try{ fixLongDurations(); }catch(e){ console.warn('[MASSUP] fixLongDurations:',e); }
  initWeights();
  initHealthLogs();
  initLogs();
  initReminders();
  rebuildPainLogFromLive(); // journal poignet recréé depuis le détail cloud des séances si purgé (11/08)
  // Restauration post-incident 11/08 : pesées connues (docs projet) + profil — one-shot,
  // merge non destructif (ne touche à rien de déjà saisi).
  if(!DB.profile.restore1108){
    mergeBackupIntoDB({
      profile:{name:'Adrien',height:172,goal:'masse',weekGoal:3},
      bodyWeight:[
        {date:'2026-03-11',weight_kg:62.85,note:'restauré (incident 11/08)'},
        {date:'2026-03-22',weight_kg:64.60,note:'restauré (incident 11/08)'},
        {date:'2026-04-01',weight_kg:65.70,note:'restauré (incident 11/08)'},
        {date:'2026-04-14',weight_kg:66.60,note:'restauré (incident 11/08)'},
        {date:'2026-07-30',weight_kg:72.00,note:'restauré (incident 11/08)'}
      ]
    });
    DB.profile.restore1108=true;
    saveDB();
  }
  // Restauration 11/08 (2e passe) — AOÛT reconstruit depuis les screens d'Adrien :
  // séances 30/07→10/08 (détail série par série pour 01/04/05-08, exact des captures),
  // hausses de charges d'août, déclarations hebdo, pesée 30/07 corrigée (71,6 — pas 72),
  // rythme 4 séances/sem (profil du 02/08). La séance du 11/08 vit déjà dans l'app.
  if(!DB.profile.restore1108b){
    var F='facile',O='ok',D='dur',E='echec';
    function _rs(arr){ return arr.map(function(s){return {reps:s[0],feel:s[1],w:s[2]};}); }
    function _rx(key,name,unite,n,reps,w0,w,sets,extra,status){
      return {key:key,name:name,w:w,w0:w0,n:n,reps:reps,unite:unite,cnt:null,
        status:status||'done',extra:!!extra,sets:sets,sk:0};
    }
    mergeBackupIntoDB({
      logs:[
        // ~30/07 — PUSH (3e séance de la semaine du 27/07, visible sur le profil du 02/08 ; jambes encore en pause → pas un LEGS)
        {id:20260730203000,date:'2026-07-30',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 01/08 — PULL (détail exact du screen : CLEAN SWEEP +100, PR Face Pull 22, série bonus Face Pull, MVP tirage)
        {id:20260801203000,date:'2026-08-01',time:'20:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('tirage_vert','Tirage Vertical (Dos)','kg',4,8,48,48,_rs([[8,O,48],[8,O,48],[8,D,48],[7,E,48]])),
            _rx('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,44,44,_rs([[7,O,44],[7,D,44],[7,D,44],[8,E,44]])),
            _rx('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs([[8,O,10],[8,D,10],[8,E,10],[6,E,10]])),
            _rx('elev_lat','Élévation Latérale','kg/main',4,12,8,8,_rs([[8,F,8],[8,O,8],[8,D,8],[7,E,8]]),true),
            _rx('curl_corde','Curl Corde Basse (neutre)','kg',4,8,12,12,_rs([[8,F,12],[5,E,12],[8,E,12],[8,E,12]])),
            _rx('face_pull','Face Pull','kg',3,15,20,22,_rs([[8,F,22],[8,F,22],[8,O,22],[8,D,22]])),
            _rx('rowing_uni','Rowing Unilatéral Poulie','kg',4,8,20,20,_rs([[8,O,20],[8,D,20],[6,E,20]]),true,'skipped')
          ],pain:null,painNote:'',context:null,stretch:false,warmup:true}},
        // 02/08 — PUSH (case orange du calendrier ; détail perdu)
        {id:20260802203000,date:'2026-08-02',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 04/08 — PULL + jambes/abdo (détail exact du screen)
        {id:20260804203000,date:'2026-08-04',time:'20:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,44,48,_rs([[8,F,44],[8,O,44],[8,O,44],[8,D,48]])),
            _rx('rowing_appui','Rowing Machine (appui pectoral)','kg',4,10,35,40,_rs([[10,F,35],[10,E,45],[10,E,40],[9,E,40]])),
            _rx('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs([[10,E,10],[10,D,10],[8,E,10],[7,E,10]])),
            _rx('curl_corde','Curl Corde Basse (neutre)','kg',4,8,12,10,_rs([[8,E,12],[8,E,12],[10,E,10],[10,E,10]])),
            _rx('face_pull','Face Pull','kg',3,15,22,22,_rs([[15,F,22],[15,E,22],[11,E,22]])),
            _rx('shrug_halt','Shrugs Haltères (trapèzes)','kg/main',3,12,20,22,_rs([[12,D,22],[12,D,22],[8,E,22]]),true),
            _rx('elev_lat','Élévation Latérale','kg/main',3,12,8,8,_rs([[12,D,8],[8,E,8],[6,E,8]])),
            _rx('leg_press','Leg Press','kg',3,10,80,80,_rs([[10,D,80],[10,O,80],[10,D,80]])),
            _rx('releve_chaise','Relevés de Jambes (chaise romaine)','reps',3,10,10,10,_rs([[10,O,10],[10,E,10],[10,E,10]]),true)
          ],pain:null,painNote:'',context:null,stretch:false,warmup:true}},
        // 05/08 — PUSH + abdo/jambes (détail exact du screen)
        {id:20260805203000,date:'2026-08-05',time:'20:30',sessions:['s1'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('dev_incline','Développé Incliné Haltères','kg/côté',4,8,18,20,_rs([[8,F,18],[8,O,18],[8,D,20],[8,E,20]])),
            _rx('chestpress_v','Chest Press Vertical','kg',4,8,50,50,_rs([[8,F,50],[8,D,50],[8,E,50],[8,D,50]])),
            _rx('pecdeck','Pec Deck','kg',4,10,49,44,_rs([[10,E,49],[10,E,49],[10,D,44],[10,D,44]])),
            _rx('elev_lat','Élévation Latérale','kg/main',4,12,8,8,_rs([[10,O,8],[10,D,8],[10,E,8],[10,E,8]])),
            _rx('triceps_corde','Triceps Poulie Corde','kg',4,10,22,22,_rs([[10,O,22],[9,E,22],[8,E,22],[6,E,22]])),
            _rx('crunch_poulie','Crunch Poulie à genoux','kg',3,12,20,22,_rs([[12,D,20],[12,F,18],[12,E,22]]),true),
            _rx('releve_chaise','Relevés de Jambes (chaise romaine)','reps',3,10,10,10,_rs([[10,D,10],[10,D,10],[8,E,10]]),true),
            _rx('leg_ext','Leg Extension (Quadriceps)','kg',4,12,40,40,_rs([[12,O,40],[12,E,40],[8,E,40],[12,E,35]])),
            _rx('dips_assist','Dips Assistée (machine)','kg',3,10,25,40,_rs([[10,F,25],[10,E,45],[10,D,40]]),true)
          ],pain:null,painNote:'',context:null,stretch:true,warmup:true}},
        // 06/08 — LEGS + abdos (crunch poulie, pallof) — détail perdu
        {id:20260806203000,date:'2026-08-06',time:'20:30',sessions:['s3','exo:crunch_poulie','exo:pallof'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 08/08 — PULL + leg curl + relevés chaise romaine + exos bonus — détail perdu
        {id:20260808203000,date:'2026-08-08',time:'20:30',sessions:['s2','exo:leg_curl','exo:releve_chaise'],comment:'Reconstituée (incident 11/08) — détail perdu (nombreux bonus)',feeling:null,energy:null,duration_min:null},
        // 10/08 — PUSH classique + leg press + relevés — détail perdu
        {id:20260810203000,date:'2026-08-10',time:'20:30',sessions:['s1','exo:leg_press','exo:releve_chaise'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null}
      ],
      // Hausses d'août lues sur les screens (fill par date, n'écrase rien)
      weights:{
        face_pull:[{date:'2026-08-01',val:22}],
        rowing_pb:[{date:'2026-08-04',val:48},{date:'2026-08-11',val:52}],
        rowing_appui:[{date:'2026-08-04',val:40}],
        shrug_halt:[{date:'2026-08-04',val:22}],
        dev_incline:[{date:'2026-08-05',val:20}],
        crunch_poulie:[{date:'2026-08-05',val:22}],
        pecdeck:[{date:'2026-08-05',val:44}],
        leg_ext:[{date:'2026-08-05',val:40}],
        dips_assist:[{date:'2026-08-05',val:40}],
        tirage_vert:[{date:'2026-08-11',val:56}]
      },
      // Déclarations hebdo : sem. 27/07 (screen profil 02/08 : 4 pdj, 2 shakers) · sem. 03/08 (dicté par Adrien)
      rank:{weekly:{'2026-07-27':{pdj:4,shaker:2,cardio:0},'2026-08-03':{pdj:4,shaker:2,cardio:1}}},
      // 2 jours étirés sem. 03-09/08 (dicté) — le 05 est visible sur le calendrier
      dz:{'2026-08-05':{stretch:true},'2026-08-08':{stretch:true}}
    });
    // Corrections directes (le merge ne remplace pas l'existant) :
    DB.profile.weekGoal=4; // screen profil 02/08 : « 4 séances/sem »
    (DB.bodyWeight||[]).forEach(function(b){ if(b.date==='2026-07-30'&&b.weight_kg===72){ b.weight_kg=71.6; } }); // vraie pesée du 30/07
    DB.profile.restore1108b=true;
    saveDB();
  }
  // Restauration 11/08 (3e passe) — corrections d'après les screens du 31/07 (calendrier juillet
  // + historique pesées) : la « séance du 30/07 » n'existait pas (la 3e de la semaine du 27/07
  // était la séance MAISON du 28/07, case violette) ; juillet réinjecté en entier (dates + types
  // exacts du calendrier) ; séance du 11/08 recréée (détail du screen — elle avait été perdue
  // entre l'entraînement et la première connexion) ; pesées mai-juillet complétées.
  if(!DB.profile.restore1108c){
    var F2='facile',O2='ok',D2='dur',E2='echec';
    function _rs2(arr){ return arr.map(function(s){return {reps:s[0],feel:s[1],w:s[2]};}); }
    function _rx2(key,name,unite,n,reps,w0,w,sets,extra,status){
      return {key:key,name:name,w:w,w0:w0,n:n,reps:reps,unite:unite,cnt:null,
        status:status||'done',extra:!!extra,sets:sets||[],sk:0};
    }
    // 1) Retirer la séance inventée du 30/07 (restore1108b)
    DB.logs=(DB.logs||[]).filter(function(l){ return String(l.id)!=='20260730203000'; });
    // 2) La séance du 11/08 : ne l'injecter QUE si aucune séance n'existe déjà ce jour-là
    var _has1108=(DB.logs||[]).some(function(l){ return l.date==='2026-08-11'; });
    var _logs=[
      // Juillet 2026 — dates/types EXACTS du screen calendrier (orange=PUSH, bleu=PULL, violet=MAISON)
      {id:20260702203000,date:'2026-07-02',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260704203000,date:'2026-07-04',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260705203000,date:'2026-07-05',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260707203000,date:'2026-07-07',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260708203000,date:'2026-07-08',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260710203000,date:'2026-07-10',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260712203000,date:'2026-07-12',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260713203000,date:'2026-07-13',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260715203000,date:'2026-07-15',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260717203000,date:'2026-07-17',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260720203000,date:'2026-07-20',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260721203000,date:'2026-07-21',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260723203000,date:'2026-07-23',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260725110000,date:'2026-07-25',time:'11:00',sessions:['sb'],comment:'Reconstituée (incident 11/08) — séance maison',feeling:null,energy:null,duration_min:null},
      {id:20260728110000,date:'2026-07-28',time:'11:00',sessions:['sb'],comment:'Reconstituée (incident 11/08) — séance maison',feeling:null,energy:null,duration_min:null}
    ];
    if(!_has1108){
      _logs.push({id:20260811183000,date:'2026-08-11',time:'18:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
        exos:[
          _rx2('tirage_vert','Tirage Vertical (Dos)','kg',4,8,50,56,_rs2([[8,O2,50],[10,O2,50],[9,D2,56],[8,E2,56]])),
          _rx2('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,48,52,_rs2([[8,O2,48],[8,O2,48],[8,D2,48],[6,E2,52]])),
          _rx2('rowing_appui','Rowing Machine (appui pectoral)','kg',4,10,40,40,_rs2([[10,D2,40],[10,E2,40],[10,E2,40],[9,E2,40]])),
          _rx2('curl_corde','Curl Corde Basse (neutre)','kg',4,10,12,12,_rs2([[10,D2,12],[10,D2,12],[10,E2,12],[8,E2,12]])),
          _rx2('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs2([[10,D2,10],[10,E2,10],[9,E2,10],[5,E2,10]])),
          _rx2('face_pull','Face Pull','kg',3,15,22,22,[],false,'skipped'),
          _rx2('leg_ext','Leg Extension (Quadriceps)','kg',4,12,40,40,[],true,'skipped')
        ],pain:null,painNote:'',context:'blessure',stretch:false,warmup:true}});
    }
    mergeBackupIntoDB({
      logs:_logs,
      // Tirage monté à 50 pendant la séance du 08/08 (base 50 kg au screen du 11/08), PR 56 & 52 le 11/08
      weights:{
        tirage_vert:[{date:'2026-08-08',val:50},{date:'2026-08-11',val:56}],
        rowing_pb:[{date:'2026-08-11',val:52}]
      },
      // Pesées : exactes (historique du screen du 31/07) + approximations lissées sur la courbe
      bodyWeight:[
        {date:'2026-04-26',weight_kg:66.9,note:'restauré (approx. courbe)'},
        {date:'2026-05-07',weight_kg:66.1,note:'restauré (approx. courbe)'},
        {date:'2026-06-06',weight_kg:68.2,note:'restauré (approx. — déduit du +1,3 du 13/06)'},
        {date:'2026-06-13',weight_kg:69.5,note:'restauré (screen 31/07)'},
        {date:'2026-06-19',weight_kg:69.85,note:'restauré (screen 31/07)'},
        {date:'2026-07-05',weight_kg:69.05,note:'restauré (screen 31/07)'},
        {date:'2026-07-14',weight_kg:70.2,note:'restauré (screen 31/07)'}
      ]
    });
    DB.profile.restore1108c=true;
    saveDB();
  }
  // Restauration 11/08 (4e passe) — retours Adrien sur la 3e :
  // · cases violettes du calendrier ≠ séance maison (sb = 0,5 séance) : violet/gris = jour ABDO
  //   (les exos abdo dominent la couleur) → 25 et 28/07 requalifiées en jours abdo (comptent 1) ;
  // · leg extension du 11/08 : exo jambes OBLIGATOIRE de la séance, pas un bonus → extra:false ;
  // · traction assistée : vraie trajectoire dictée (45 kg d'assistance début juin → 25 au 30/07
  //   (canonical) → 20 au 11/08) — remplace l'entrée auto erronée du premier boot.
  if(!DB.profile.restore1108d){
    (DB.logs||[]).forEach(function(l){
      if(String(l.id)==='20260725110000'||String(l.id)==='20260728110000'){
        l.sessions=['exo:crunch_poulie','exo:pallof','exo:releve_chaise'];
        l.comment='Reconstituée (incident 11/08) — jour abdos';
      }
      if(String(l.id)==='20260811183000'&&l.live&&l.live.exos){
        l.live.exos.forEach(function(x){ if(x.key==='leg_ext') x.extra=false; });
      }
    });
    var _taKeep=(DB.weights.traction_assist||[]).filter(function(e){ return e.date>'2026-08-11'; });
    DB.weights.traction_assist=[{date:'2026-06-01',val:45},{date:'2026-07-30',val:25},{date:'2026-08-11',val:20}].concat(_taKeep);
    DB.weightSetDate.traction_assist=DB.weights.traction_assist[DB.weights.traction_assist.length-1].date;
    DB.profile.restore1108d=true;
    saveDB();
  }
  // Restauration 12/08 (5e passe) — retours Adrien du soir :
  // · JUIN reconstruit sur les compteurs EXACTS du screen du 31/07 (sem. 08-14/06 = 4 ·
  //   15-21/06 = 3 · 22-28/06 = 4 · 29/06-05/07 = 4 avec 02+04+05/07 déjà en base → 1 séance
  //   le 30/06). Dates approximatives, alternance PUSH/PULL stricte (pas de LEGS, genoux).
  // · Poids relevés sur SES screens du 11/08 au soir (ses MAJ manuelles avaient pu sauter
  //   avec le bug de persistance) — datés sur les séances correspondantes.
  if(!DB.profile.restore1108e){
    mergeBackupIntoDB({
      logs:[
        {id:20260608203000,date:'2026-06-08',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260610203000,date:'2026-06-10',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260612203000,date:'2026-06-12',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260614203000,date:'2026-06-14',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260616203000,date:'2026-06-16',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260618203000,date:'2026-06-18',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260620203000,date:'2026-06-20',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260622203000,date:'2026-06-22',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260624203000,date:'2026-06-24',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260626203000,date:'2026-06-26',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260628203000,date:'2026-06-28',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260630203000,date:'2026-06-30',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null}
      ],
      weights:{
        leg_curl:[{date:'2026-08-08',val:30}],
        pecdeck:[{date:'2026-08-10',val:48}],
        triceps_corde:[{date:'2026-08-10',val:24}],
        cable_fly:[{date:'2026-08-10',val:12}],
        leg_press:[{date:'2026-08-10',val:85}],
        dips_assist:[{date:'2026-08-10',val:20}],
        curl_halt:[{date:'2026-08-10',val:8}]
      }
    });
    DB.profile.restore1108e=true;
    saveDB();
  }
  // Correction ponctuelle : Curl Marteau suit la même courbe que Curl Haltères, moins la dernière hausse (reste à 8kg).
  if(!DB.profile) DB.profile={};
  if(!DB.profile.martoFix){
    var halt=DB.weights['curl_halt'];
    if(halt&&halt.length){
      var copy=halt.slice(0,Math.max(1,halt.length-1)).map(function(x){return {date:x.date,val:x.val};});
      DB.weights['curl_marteau']=copy;
      DB.weightSetDate['curl_marteau']=copy[copy.length-1].date;
    }
    DB.profile.martoFix=true;
    saveDB();
  }
  // Fusion élévations (02/08, demande Adrien) : « Élévation Latérale (fin de PULL) » était une
  // clé séparée (elev_lat_pull) alors que c'est LE MÊME exercice → historique fusionné dans
  // elev_lat, logs retagués, anciennes entrées cloud purgées via deletedWeights.
  if(!DB.profile.elevMerge0208){
    var _ep=DB.weights['elev_lat_pull'];
    if(_ep&&_ep.length){
      var _eb=DB.weights['elev_lat']||[];
      _ep.forEach(function(en){ if(!_eb.some(function(b){return b.date===en.date;})) _eb.push({date:en.date,val:en.val}); });
      _eb.sort(function(a,b){return a.date.localeCompare(b.date);});
      DB.weights['elev_lat']=_eb;
      DB.deletedWeights=DB.deletedWeights||{};
      DB.deletedWeights['elev_lat_pull']=(DB.deletedWeights['elev_lat_pull']||[]).concat(_ep.map(function(en){return en.date;}));
    }
    delete DB.weights['elev_lat_pull'];
    if(DB.weightSetDate){
      if(DB.weightSetDate['elev_lat_pull']&&(!DB.weightSetDate['elev_lat']||DB.weightSetDate['elev_lat']<DB.weightSetDate['elev_lat_pull'])) DB.weightSetDate['elev_lat']=DB.weightSetDate['elev_lat_pull'];
      delete DB.weightSetDate['elev_lat_pull'];
    }
    (DB.logs||[]).forEach(function(l){
      if(l.sessions) l.sessions=l.sessions.map(function(s){return s==='exo:elev_lat_pull'?'exo:elev_lat':s;});
      if(l.live&&l.live.exos) l.live.exos.forEach(function(x){ if(x.key==='elev_lat_pull') x.key='elev_lat'; });
    });
    DB.profile.elevMerge0208=true;
    saveDB();
  }
  // Refonte PULL + élévations 6 kg (15/08, demande Adrien) : la RÉFÉRENCE élévations passe à
  // 6 kg pour le nouveau format 4×15. L'historique 8 kg reste intact — on AJOUTE une entrée,
  // on n'efface jamais rien (règle « données = sacré »).
  if(!DB.profile.pull1508){
    var _e6=DB.weights['elev_lat']||[];
    var _t6=todayStr();
    if(_e6.length&&_e6[_e6.length-1].date===_t6){ _e6[_e6.length-1].val=6; }
    else if(!_e6.length||_e6[_e6.length-1].val!==6){ _e6.push({date:_t6,val:6}); }
    DB.weights['elev_lat']=_e6;
    DB.weightSetDate['elev_lat']=_t6;
    DB.profile.pull1508=true;
    saveDB();
  }
  // 15/08 soir — NOTES FIGÉES (retour Adrien : « 10/20 et 20/20 que je ne comprends pas ») :
  // la refonte PULL a reclassé des exos principal↔bonus et le recalcul des notes passées avec
  // les flags du jour réécrivait l'histoire. On grave sur chaque log live : le statut `main`
  // de chaque exo tel qu'il était PENDANT la séance (= !extra, exact pour tous les LiveUps),
  // puis la note /20 recalculée sur CE statut — plus jamais recalculée ensuite.
  if(!DB.profile.noteFix1508){
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!(l.live.exos||[]).length) return;
      l.live.exos.forEach(function(x){ if(x.main==null) x.main=!x.extra; });
      if(l.live.note20==null){
        var _ex=liveNotedExos(l.live.exos);
        if(_ex.length){
          var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
          l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
        }
      }
    });
    DB.profile.noteFix1508=true;
    saveDB();
  }
  // 16/08 — genou (retour Adrien) : son Leg Press du LEGS du 16/08 (2/4 séries, arrêt sur vraie
  // douleur au genou) était barré et noté 0/5 : l'ancienne règle exigeait n−1 séries. Il passe en
  // « arrêt douleur » (compté, zéro malus) et la note /20 du log est re-gravée sur les statuts
  // figés — cas prévu par la règle du 15/08 : l'éditeur/une correction assumée re-grave, jamais
  // un recalcul silencieux.
  if(!DB.profile.kneeFix1608){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-16'||!l.live||!(l.live.exos||[]).length) return;
      var touched=false;
      l.live.exos.forEach(function(x){
        if(x.key==='leg_press'&&x.status==='skipped'&&(x.sets||[]).length===2){ x.pain=true; touched=true; }
      });
      if(!touched) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.kneeFix1608=true;
    saveDB();
  }
  // 16/08 soir — barème durci à la demande d'Adrien (« 20/20 trop gentil ») : le LEGS du 16/08
  // se re-juge avec ① arrêt douleur = −0,5 pt/série manquante (leg curl marqué douleur aussi —
  // c'était le genou), ② legday = tous les exos JAMBES jugés principaux (main=true figé).
  if(!DB.profile.legday1608){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-16'||!l.live||!(l.live.exos||[]).length) return;
      if((l.sessions||[]).indexOf('s3')<0) return;
      l.live.exos.forEach(function(x){
        if(x.key==='leg_curl'&&x.status==='skipped'&&(x.sets||[]).length===2) x.pain=true;
        if(rankGroupOf(x.key)==='Jambes') x.main=true;
      });
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.legday1608=true;
    saveDB();
  }
  // 18/08 — barème /5 v3 (retour Adrien : « y'a mieux à faire comme notation ») : échec propre en
  // dernière série = pleine valeur, bonus jugés sur les séries faites, prorata e1RM + correction
  // de charge en linéaire. La note /20 du PULL du 18/08 est re-gravée avec ce barème (sa demande
  // « et celle-là ») — les autres notes restent figées (règle du 15/08).
  if(!DB.profile.noteV3_1808){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-18'||!l.live||!(l.live.exos||[]).length) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.noteV3_1808=true;
    saveDB();
  }
  // 19/08 — audit complet du moteur de notation (demande Adrien « regarde toutes les séances,
  // trouve les erreurs ») : 3 erreurs d'arithmétique corrigées — ① double arrondi (le /20 moyennait
  // des /5 déjà arrondis vers le bas : jusqu'à ~2 pts perdus), ② malus « effondrement » armé par
  // des reps AU-DESSUS de la cible en série 1 (13·10·10·10 cible 10 = 4,5), ③ tolérance d'échec
  // fixe (2 reps) inadaptée aux cibles 15+ (12/15 à l'échec = « vrai raté » comme un 5/8).
  // Toutes les notes /20 sont re-gravées sur leurs statuts principal/bonus FIGÉS (correction
  // assumée, règle du 15/08) — l'arithmétique v3.1 étant partout ≥ l'ancienne, aucune ne baisse.
  if(!DB.profile.note20Raw1908){
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!(l.live.exos||[]).length) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.note20Raw1908=true;
    saveDB();
  }
  // 22/08/2026 — refonte abdos (décision Adrien) : le Pallof repasse en reps (3×10/côté, tenues
  // 2-3 s) et sa référence est calée sur son poids réel du jour : 10 kg (il l'a donné lui-même).
  // Crunch poulie / hollow → hidden dans DATA (historique intact), dead bug dé-masqué,
  // crunch lesté ajouté — rien à migrer côté données pour eux.
  if(!DB.profile.abdos2208){
    try{
      var _pw=(DB.weights&&DB.weights.pallof)||[];
      if(!_pw.length||_pw[_pw.length-1].val!==10) asApplyWeight('pallof',10);
    }catch(e){}
    DB.profile.abdos2208=true;
    saveDB();
  }
  // 31/08/2026 — pesée transmise après coup par Adrien : 6 août = 71,7 kg. Ajoutée si absente ;
  // la tombstone deletedBW est respectée (si elle est supprimée un jour, elle ne reviendra pas).
  if(!DB.profile.bw0608){
    if(!DB.bodyWeight) DB.bodyWeight=[];
    var _bwHas=DB.bodyWeight.some(function(b){return b.date==='2026-08-06';});
    var _bwDel=(DB.deletedBW||[]).indexOf('2026-08-06')>=0;
    if(!_bwHas&&!_bwDel){
      DB.bodyWeight.push({date:'2026-08-06',weight_kg:71.7,note:''});
      DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
    }
    DB.profile.bw0608=true;
    saveDB();
  }
  // Snapshot mensuel du rank (base du « as-tu évolué en rank ? » des bilans du mois)
  try{ mrSnapLadder(); }catch(e){}
  // Rappel backup JSON tous les 21 jours — le détail fin vit d'abord sur CE téléphone
  try{
    if(!DB.profile.lastBackupTs){ DB.profile.lastBackupTs=Date.now(); saveDB(); }
    else if(Date.now()-DB.profile.lastBackupTs>21*86400000){
      setTimeout(function(){ showToast('&#x1F4E6; Pense au backup JSON (Param&#xE8;tres) &#x2014; 2 secondes pour tout mettre &#xE0; l\'abri'); },2500);
      DB.profile.lastBackupTs=Date.now(); saveDB();
    }
  }catch(e){}
  // Correction ponctuelle (02/08/2026, demande Adrien) : la séance PULL du 01/08 stockait des
  // cibles d'AVANT le recalage du programme (tirage/rowing à 10 au lieu de 4×8) et Adrien
  // croyait tout à 4×8 (cibles pas encore affichées). On recale le log sur le vrai programme
  // et on épingle la revue du coach — c'est elle, LE bilan de cette séance (voir COACH.md 02/08).
  if(!DB.profile.pullFix0108){
    var pl=(DB.logs||[]).find(function(x){return x.date==='2026-08-01'&&x.live&&(x.live.exos||[]).length&&(x.sessions||[]).indexOf('s2')>=0;});
    if(pl){
      pl.live.exos.forEach(function(x){
        if(x.key==='tirage_vert'||x.key==='rowing_pb'){ x.reps=8; }
      });
      pl.live.coachNote='&#x1F9E0; <strong>Revue du coach (02/08)</strong> &#x2014; s&#xE9;ance faite en croyant toutes les cibles &#xE0; 4&#xD7;8 (elles n\'&#xE9;taient pas encore affich&#xE9;es) et jug&#xE9;e &#xE0; l\'&#xE9;poque sur d\'anciennes cibles. Recal&#xE9;e sur le vrai programme&#x202F;: <strong>Tirage Vertical quasi parfait (4,5/5)</strong>, Rowing &#xE0; 1 rep de la cible (3,5/5), volume complet et &#xE9;chec touch&#xE9; en fin d\'exo partout &#x2014; <strong>vraie valeur &#x2248; 14/20 dans son contexte</strong>. La le&#xE7;on &#xE0; garder&#x202F;: Face Pull = 15 reps propres AVANT de monter les kg (reps d\'abord, charge ensuite).';
    }
    DB.profile.pullFix0108=true;
    saveDB();
  }
  // v2 (02/08 soir, décision finale Adrien) : la séance du 01/08 est jugée à 100% dans SON
  // contexte — il visait 4×8 partout (cibles pas encore affichées dans l'app ce jour-là).
  // Toutes les cibles stockées du log passent à 8, la revue de coach épinglée est retirée :
  // les notes recalculées (exos + /20) RACONTENT le contexte, plus besoin d'encadré.
  // ⚠️ Sur-mesure pour CE log uniquement — le barème général et le programme ne bougent pas.
  if(!DB.profile.pullFix0108b){
    var pl2=(DB.logs||[]).find(function(x){return x.date==='2026-08-01'&&x.live&&(x.live.exos||[]).length&&(x.sessions||[]).indexOf('s2')>=0;});
    if(pl2){
      pl2.live.exos.forEach(function(x){ if(x.reps>8) x.reps=8; });
      delete pl2.live.coachNote;
    }
    DB.profile.pullFix0108b=true;
    saveDB();
  }
  // Traction Assistée : départ/actuel à 45kg (corrige l'ancien seed à 40 si non modifié)
  if(!DB.profile.tractionFix){
    var ta=DB.weights['traction_assist'];
    if(!ta || (ta.length===1 && ta[0].val===40)){
      DB.weights['traction_assist']=[{date:'2026-02-28',val:45}];
      DB.weightSetDate['traction_assist']='2026-02-28';
    }
    DB.profile.tractionFix=true;
    saveDB();
  }
  // Seated Dips (Machine) ajouté le 22 juin : corrige l'ancien seed à 0kg/28-fév (qui faussait aussi le compteur de séances)
  if(!DB.profile.dipsFix){
    var sd=DB.weights['seated_dips'];
    if(!sd || (sd.length===1 && sd[0].val===0)){
      var dts=todayStr();
      DB.weights['seated_dips']=[{date:dts,val:35}];
      DB.weightSetDate['seated_dips']=dts;
    }
    DB.profile.dipsFix=true;
    saveDB();
  }
  // 15 juin 2026 : Traction Assistée + Dips Assistée sont des exos récents — leur 1ère entrée de poids est le 15/06.
  // On ramène leur historique à une seule entrée à cette date (en gardant la valeur actuelle).
  if(!DB.profile.juin15Fix){
    ['traction_assist','seated_dips'].forEach(function(k){
      var arr=DB.weights[k];
      var val=(arr&&arr.length)?arr[arr.length-1].val:(CANONICAL_WEIGHTS[k]||0);
      DB.weights[k]=[{date:'2026-06-15',val:val}];
      DB.weightSetDate[k]='2026-06-15';
    });
    DB.profile.juin15Fix=true;
    saveDB();
  }
  // Correction "poids de départ" (juil. 2026) : certains exos bonus ajoutés en cours de route
  // avaient une 1ère entrée FABRIQUÉE au 28/02 à leur poids actuel (faux point de départ dans
  // le tableau de progression). On rétablit leur vraie date/valeur de départ (source progression.md).
  if(!DB.profile.startFix2607){
    var startFixes={
      tirage_pulldown:{date:'2026-03-14',val:40}, // Pulldown ajouté mars @40kg
      dev_militaire:  {date:'2026-03-14',val:20}  // Développé Militaire ajouté mars
    };
    Object.keys(startFixes).forEach(function(k){
      var arr=DB.weights[k];
      if(!arr||!arr.length||arr[0].date!=='2026-02-28') return; // ne touche que la fausse entrée seed
      var fix=startFixes[k];
      var curVal=arr[arr.length-1].val;
      if(arr.length===1){
        DB.weights[k] = (curVal!==fix.val)
          ? [{date:fix.date,val:fix.val},{date:'2026-04-04',val:curVal}]
          : [{date:fix.date,val:fix.val}];
      } else {
        arr[0]={date:fix.date,val:fix.val};
        DB.weights[k]=arr;
      }
      DB.weightSetDate[k]=DB.weights[k][DB.weights[k].length-1].date;
    });
    DB.profile.startFix2607=true;
    saveDB();
  }
  // 06/08/2026 : QUIPROQUO DIPS réglé (deux machines vivaient sous seated_dips).
  // seated_dips = la DIPS MACHINE assise (charge, plus = mieux) : 30 kg au 01/07 → 40 en saison 1.
  // dips_assist (nouveau) = la vraie Dips Assistée (assistance, moins = mieux) : 45 (juin) → 30 (fin S0).
  if(!DB.profile.dipsSplit0608){
    if(!DB.weights['dips_assist']||!DB.weights['dips_assist'].length){
      DB.weights['dips_assist']=[{date:'2026-06-15',val:45},{date:'2026-07-26',val:30}];
      DB.weightSetDate['dips_assist']='2026-07-26';
    }
    var _sd8=(DB.weights['seated_dips']||[]).filter(function(e){return e.date>='2026-08-01';});
    _sd8.unshift({date:'2026-07-01',val:30});
    if(_sd8[_sd8.length-1].val!==40) _sd8.push({date:todayStr(),val:40});
    DB.weights['seated_dips']=_sd8;
    DB.weightSetDate['seated_dips']=_sd8[_sd8.length-1].date;
    DB.profile.dipsSplit0608=true;
    saveDB();
  }
  // 08/08/2026 : DOUBLON TRICEPS FUSIONNÉ (demande Adrien, il avait fait l'exo sous l'ANCIENNE
  // clé le 06/08). « Poulie Triceps / Avant-bras » (poulie_triceps_av) et « Triceps Poulie Barre »
  // (triceps_barre) étaient le MÊME exercice saisi deux fois. Survivant : triceps_barre, renommé
  // « Extension Triceps Poulie (barre) ». Tout ce qui pointait vers l'ancienne clé est retagué —
  // poids, logs, séries en direct, séance préparée, séance LiveUp en cours. Rien n'est perdu.
  if(!DB.profile.tricepsMerge0808){
    var _tOld='poulie_triceps_av', _tNew='triceps_barre';
    var _tp=DB.weights[_tOld];
    if(_tp&&_tp.length){
      var _tn=DB.weights[_tNew]||[];
      _tp.forEach(function(en){
        var hit=null;
        for(var i=0;i<_tn.length;i++){ if(_tn[i].date===en.date){ hit=_tn[i]; break; } }
        // Même jour des deux côtés : c'est un seul exo, la vraie perf est la charge la plus lourde
        if(hit) hit.val=Math.max(hit.val,en.val);
        else _tn.push({date:en.date,val:en.val});
      });
      _tn.sort(function(a,b){return a.date.localeCompare(b.date);});
      DB.weights[_tNew]=_tn;
      DB.deletedWeights=DB.deletedWeights||{};
      DB.deletedWeights[_tOld]=(DB.deletedWeights[_tOld]||[]).concat(_tp.map(function(en){return en.date;}));
    }
    delete DB.weights[_tOld];
    if(DB.weightSetDate){
      if(DB.weightSetDate[_tOld]&&(!DB.weightSetDate[_tNew]||DB.weightSetDate[_tNew]<DB.weightSetDate[_tOld])) DB.weightSetDate[_tNew]=DB.weightSetDate[_tOld];
      delete DB.weightSetDate[_tOld];
    }
    var _tRetagSel=function(sel){
      if(!sel) return;
      if(sel.chosen&&sel.chosen[_tOld]){ sel.chosen[_tNew]=sel.chosen[_tOld]; delete sel.chosen[_tOld]; }
      if(sel.extras) sel.extras=sel.extras.map(function(k){return k===_tOld?_tNew:k;})
        .filter(function(k,i,a){return a.indexOf(k)===i;});
      if(sel.legsMain===_tOld) sel.legsMain=_tNew;
    };
    (DB.logs||[]).forEach(function(l){
      if(l.sessions){
        var _ss=l.sessions.map(function(s){return s==='exo:'+_tOld?'exo:'+_tNew:s;});
        l.sessions=_ss.filter(function(s,i){return _ss.indexOf(s)===i;}); // le retag peut créer un doublon
      }
      if(l.live&&l.live.exos){
        var _kept=null, _out=[];
        l.live.exos.forEach(function(x){
          if(x.key===_tOld) x.key=_tNew;
          if(x.key===_tNew){
            // Les DEUX clés dans la même séance → une seule entrée, séries cumulées
            if(_kept){ _kept.sets=(_kept.sets||[]).concat(x.sets||[]); _kept.n=Math.max(_kept.n||0,_kept.sets.length); return; }
            _kept=x;
          }
          _out.push(x);
        });
        l.live.exos=_out;
      }
    });
    if(DB.prepared) _tRetagSel(DB.prepared.sel);
    // Séance LiveUp en cours (stockée à part de DB) : elle aussi doit suivre
    try{
      var _asRaw=localStorage.getItem('massup_as');
      if(_asRaw&&_asRaw.indexOf(_tOld)>=0){
        var _as=JSON.parse(_asRaw);
        _tRetagSel(_as.sel);
        if(_as.exos) _as.exos.forEach(function(x){ if(x.key===_tOld){ x.key=_tNew; x.name='Extension Triceps Poulie (barre)'; } });
        localStorage.setItem('massup_as',JSON.stringify(_as));
      }
    }catch(e){}
    DB.profile.tricepsMerge0808=true;
    saveDB();
  }
  // 14/08/2026 : DÉVELOPPÉ MILITAIRE converti BARRE → HALTÈRES (retour Adrien : « je suis avec
  // haltères, j'arrive presque pas à 14 »). L'ancien historique était en kg TOTAL de barre, la
  // nouvelle unité est le kg PAR HALTÈRE : tout ce qui dépasse 16 (clairement l'échelle barre)
  // est converti ×0,7 (20 kg barre ≈ 14 kg/côté haltères — l'instabilité coûte ~30 %).
  // L'historique garde sa forme, la référence atterrit sur son vrai 14.
  if(!DB.profile.milHalt1408){
    var _mk='dev_militaire';
    var _mconv=function(v){ return (v!=null&&v>16)?Math.round(v*0.7):v; };
    var _ma=DB.weights[_mk];
    if(_ma&&_ma.length){ _ma.forEach(function(en){ en.val=_mconv(en.val); }); }
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!l.live.exos) return;
      l.live.exos.forEach(function(x){
        if(x.key!==_mk) return;
        x.w=_mconv(x.w); if(x.w0!=null) x.w0=_mconv(x.w0);
        (x.sets||[]).forEach(function(s){ if(s.w!=null) s.w=_mconv(s.w); });
      });
    });
    // LiveUp en cours : le poids de travail doit suivre aussi
    try{
      var _mAsRaw=localStorage.getItem('massup_as');
      if(_mAsRaw&&_mAsRaw.indexOf(_mk)>=0){
        var _mAs=JSON.parse(_mAsRaw);
        if(_mAs.exos) _mAs.exos.forEach(function(x){
          if(x.key!==_mk) return;
          x.weight=_mconv(x.weight); if(x.w0!=null) x.w0=_mconv(x.w0);
          x.name='Développé Militaire Haltères (assis)'; x.unite='kg/côté';
          (x.sets||[]).forEach(function(s){ if(s.w!=null) s.w=_mconv(s.w); });
        });
        localStorage.setItem('massup_as',JSON.stringify(_mAs));
      }
    }catch(e){}
    DB.weightSetDate[_mk]=todayStr();
    DB.profile.milHalt1408=true;
    saveDB();
  }
  // Système « une seule charge » (28/10, demande Adrien) : références recalées sur une charge
  // où la SÉRIE 1 finit à OK (vérifié sur tout l'historique). On AJOUTE une entrée datée du jour,
  // rien n'est effacé ; un exo déjà à la bonne valeur n'est pas touché.
  if(!DB.profile.oneLoad2810){
    var _ol={dev_incline:24,pecdeck:49,chestpress_v:50,elev_lat:6,shoulder_press:30,triceps_barre:18,
      triceps_corde:18,tirage_vert:56,traction_assist:16,rowing_pb:52,rowing_appui:40,face_pull:20,
      curl_marteau_croise:8,curl_incline_neutre:8,mollets:90,abduct:30,adduct:18,leg_press:85};
    Object.keys(_ol).forEach(function(k){
      var cur=getCurrentWeight(k);
      if(cur==null||Math.abs(cur-_ol[k])<0.01) return;
      var arr=DB.weights[k]||[], t=todayStr();
      if(arr.length&&arr[arr.length-1].date===t) arr[arr.length-1].val=_ol[k];
      else arr.push({date:t,val:_ol[k]});
      DB.weights[k]=arr; DB.weightSetDate[k]=t;
    });
    DB.profile.oneLoad2810=true;
    saveDB();
  }
  setHeader();
  buildSeances();
  // Mise de côté (15/08) : masque les sections statiques du HTML selon les flags FEATURE_*
  try{
    var _ff=function(id,on){ var e=document.getElementById(id); if(e) e.style.display=on?'':'none'; };
    _ff('lblNiveau',FEATURE_RADAR); _ff('secNiveau',FEATURE_RADAR);
    _ff('lblObjectifs',FEATURE_GOALS);
  }catch(e){}
  var d=getNow(); calYear=d.getFullYear(); calMonth2=d.getMonth();
  buildLogModal();
  renderSante();
  // Default view is Bilan — pre-load Chart.js so charts render immediately
  ensureChartJs(function(){
    try{ renderSanteChart(); }catch(e){}
  });
  try{ checkReminders(); }catch(e){}
  if(pushWatch) setTimeout(function(){ pushWatch.run(true); },1500);
  try{ asBoot(); }catch(e){ console.warn('[MASSUP] asBoot:',e); }
}

function setHeader(){
  updateHeaderCtx('sante');
}

function updateHeaderCtx(view){
  try{ document.body.setAttribute('data-view',view); }catch(e){} // en-tête DA : ↻ sur le Bilan, Recettes ailleurs
  var el=document.getElementById('hdate'); if(!el) return;
  var d=getNow();
  var days=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  var months=['Jan','F\u00e9v','Mar','Avr','Mai','Juin','Juil','Ao\u00fbt','Sep','Oct','Nov','D\u00e9c'];
  var monthsFull=['Janvier','F\u00e9vrier','Mars','Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'];
  if(view==='seances'){
    el.textContent='S\u00e9ances \u00b7 '+days[d.getDay()];
  } else if(view==='progression'){
    el.textContent='Progression \u00b7 '+monthsFull[d.getMonth()]+' '+d.getFullYear();
  } else if(view==='sante'){
    var bw=DB.bodyWeight||[];
    var lastBw=bw.length?bw[bw.length-1]:null;
    el.textContent='Bilan'+(lastBw?' \u00b7 '+lastBw.weight_kg+'\u00a0kg':'');
  } else if(view==='accueil'){
    el.textContent=days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()];
  }
}

// Message d'encouragement en haut de la vue Séances
function renderGymGreet(){
  var el=document.getElementById('gymGreet'); if(!el) return;
  var now=getNow();
  // Séances cette semaine (lundi -> dimanche) vers l'objectif de 4
  var wstart=new Date(now); var dow=wstart.getDay(); var off=dow===0?6:dow-1;
  wstart.setDate(wstart.getDate()-off); wstart.setHours(0,0,0,0);
  var count=weekValue((DB.logs||[]).filter(function(l){return new Date(l.date)>=wstart;}));
  var GOAL=(typeof SAISON!=='undefined')?SAISON.weekGoal(todayStr(),getWeekGoal()):getWeekGoal(), GOLD=GOAL+1; // 01/11 (Adrien) : affiché sur 5 (le gold), la semaine reste validée à 4
  var sub;
  if(count<=0) sub='C\'est parti pour la semaine&#x202F;!';
  else if(count<GOAL) sub='Plus que <strong>'+fmtSeances(GOAL-count)+'</strong> pour valider ta semaine &#x1F3AF;';
  else if(count>=GOLD) sub='Semaine gold&#x202F;! &#x1F947;';
  else sub='Valid&#xE9;e &#x2705; &#xB7; encore <strong>'+fmtSeances(GOLD-count)+'</strong> pour le gold&#xA0;&#x1F947;';
  el.innerHTML='<div class="gym-greet-count"><span class="ggc-num">'+fmtSeances(count)+'</span><span class="ggc-goal">/ '+GOLD+'</span>'
    +'<span class="ggc-cap">séance'+(count>1?'s':'')+'<br>cette semaine</span></div>'
    +'<div class="gym-greet-sub">'+sub+'</div>'
    // 04/08 (demande Adrien) : ＋ = LiveUp (l'entrée principale), 🧘 = espace Détente.
    // La séance manuelle vit en lien discret dans l'écran de choix du LiveUp.
    +'<div class="gg-actions">'
    +'<button class="gg-btn gg-live" onclick="asOpen()" title="LiveUp &#x2014; nouvelle s&#xE9;ance">&#xFF0B;</button>'
    +'<button class="gg-btn" onclick="dzOpen()" title="D&#xE9;tente &#x2014; posture &amp; &#xE9;tirements">&#x1F9D8;</button>'
    +'</div>';
}

// Objectifs & repères — barre 1er poids → cible, avec marqueur du niveau moyen attendu
function renderObjectifs(){
  var el=document.getElementById('objectifs'); if(!el) return;
  // Objectifs de poids mis de côté (15/08, demande Adrien) — GOALS_JAN et le moteur restent
  if(!FEATURE_GOALS){ el.innerHTML=''; return; }
  var wk=weeksUntilGoal();
  var bwt=getProfileBodyWeight();
  function progPct(start,cur,tgt){
    if(tgt<=start) return cur>=tgt?100:0;
    return Math.max(0,Math.min(100,Math.round((cur-start)/(tgt-start)*100)));
  }
  // Trait jaune (v4, 14/08) = où le rythme de la SAISON te place aujourd'hui : % des 22 semaines
  // écoulées (27/07 → 1er janvier), identique pour tous les exos. La barre part du poids de
  // DÉBUT DE SAISON — plus aucune ancre sur mars.
  var _objEnd=new Date(OBJECTIF_DATE+'T00:00:00').getTime();
  function timeFrac(firstDate){
    if(!firstDate) return null;
    var t0=new Date(firstDate+'T00:00:00').getTime();
    if(_objEnd<=t0) return 1;
    return Math.max(0,Math.min(1,(Date.now()-t0)/(_objEnd-t0)));
  }
  var _seasonStart=(function(){ try{ return rankCurrentSeason().start; }catch(e){ return '2026-07-27'; } })();
  var _seasonFrac=(function(){ try{ return goalPace(); }catch(e){ return null; } })();
  function objRow(name,start,cur,tgt,frac,unit){
    if(tgt==null){ // exos sans cible ni standard — juste la progression (0 est une VRAIE cible : dips à 0 assistance)
      var d=Math.round((cur-start)*10)/10;
      return '<div class="obj-row">'
        +'<div class="obj-row-top"><span class="obj-name">'+name+'</span><span class="obj-cur">'+cur+' <small>'+unit+'</small>'+(d>0?' <em class="obj-delta">+'+d+'</em>':'')+'</span></div></div>';
    }
    var inverse=tgt<start; // ex: Traction Assistée → baisser l'assistance = progresser
    // Le point de départ affiché suit la réalité : si le poids actuel est passé SOUS le départ
    // (recalage à la baisse), c'est lui le nouveau départ de la barre (retour Adrien 02/08)
    if(inverse) start=Math.max(start,cur); else start=Math.min(start,cur);
    var done=inverse?(cur<=tgt):(cur>=tgt);
    var pct=done?100:(inverse?Math.max(0,Math.min(100,Math.round((start-cur)/(start-tgt)*100))):progPct(start,cur,tgt));
    var mk=(frac!==null&&frac!==undefined)?Math.max(3,Math.min(97,frac*100)):null;
    var marker=(mk!==null)?'<div class="obj-marker" style="left:'+mk+'%" title="O&#xF9; tu devrais en &#xEA;tre aujourd\'hui"></div>':'';
    return '<div class="obj-row">'
      +'<div class="obj-row-top"><span class="obj-name">'+name+'</span><span class="obj-cur">'+(done?'&#x2705; ':'')+cur+' <small>'+unit+'</small></span></div>'
      +'<div class="obj-scale"><span class="obj-pt">'+start+'</span>'
      +'<div class="obj-bar-wrap"><div class="obj-bar'+(done?' done':'')+'" style="width:'+pct+'%"></div>'+marker+'</div>'
      +'<span class="obj-pt obj-pt-end">'+tgt+'</span></div>'
      +'</div>';
  }
  var html='<div class="bench-card obj-card">';
  html+='<div class="obj-countdown"><span class="obj-cd-num">'+(wk.days>0?wk.weeks:0)+'</span>'
    +'<span class="obj-cd-lbl">'+(wk.days>0?'semaines avant le '+OBJECTIF_LABEL:'échéance atteinte !')+'</span></div>';
  if(bwt){ html+=objRow('&#x2696;&#xFE0F; Poids de corps',BODYWEIGHT_START,bwt,BODYWEIGHT_GOAL,timeFrac((DB.bodyWeight&&DB.bodyWeight.length)?DB.bodyWeight[0].date:'2026-03-11'),'kg'); }
  DATA.forEach(function(s){
    html+='<div class="obj-seance-lbl">'+s.icon+' '+s.name+'</div>';
    s.exos.forEach(function(e){
      if(e.hidden) return; // exos mis de côté (blessure) — données conservées mais pas affichés
      var cur=getCurrentWeight(e.key);
      // v4 : le départ de la barre = le poids au début de la SAISON (27/07), pas le 1er poids de mars
      var start=weightAtDate(e.key,_seasonStart)||cur;
      var std=STRENGTH_STD[e.key];
      var frac=_seasonFrac;
      var tgt=(GOALS_JAN[e.key]!==undefined)?GOALS_JAN[e.key]:((std&&bwt)?Math.round(std.adv*bwt):null);
      var unit=/kg/.test(e.unite)?'kg':e.unite;
      html+=objRow(getExoName(e.key),start,cur,tgt,frac,unit);
    });
  });
  html+='</div>';
  el.innerHTML=html;
}

// Canonical weights — source of truth for current weights
// État réel au 30/07/2026 (compte rendu coaching). Ne sert qu'au premier démarrage :
// les données vivantes (localStorage + Supabase) ne sont jamais écrasées.
var CANONICAL_WEIGHTS = {
  'chestpress_v':50,'dev_incline':18,'pecdeck':54,'elev_lat':8,'triceps_corde':22,'seated_dips':40,'dips_assist':30,
  'tirage_vert':48,'rowing_pb':44,'rowing_uni':20,'rowing_appui':35,'curl_halt':12,'curl_poulie':16,'curl_corde':12,
  'shrug_halt':20,'cable_fly':9,'abduct':25,'adduct':25,
  'leg_press':80,'leg_ext':50,'leg_curl':25,'mollets':40,'hip_thrust':50,
  'curl_incline':8,'curl_incline_neutre':8,'curl_marteau':10,'curl_marteau_croise':10,'face_pull':20,
  'poulie_triceps_av':18,'dev_militaire':14,'triceps_barre':18,'tirage_pulldown':50,'shoulder_press':16,
  'traction_assist':25,
  'pompes':10,'gainage':40,'crunch':15,'gripper':20,
  'crunch_poulie':15,'releve_chaise':10,'pallof':10,'dead_bug':10,'hollow_hold':20,'crunch_leste':5,'crunch_decline':12,'crunch_decline_leste':2.5,'cardio_liss':20,'cardio_rameur':10,
  // MAISON (19/10) : objectifs de reps de départ (poids des haltères fixe)
  'm_floor_press':12,'m_rowing':12,'m_rdl':12,'m_marteau':12,'m_goblet':12,'m_triceps':12,'m_mollets':20,'m_releves':12,'m_posture_y':12,'m_fentes':10
};

// Full progression history seed (source: MASSUP_progression.md)
var WEIGHT_HISTORY_SEED = {
  'chestpress_v':  [{date:'2026-02-28',val:30},{date:'2026-03-14',val:34},{date:'2026-04-04',val:35},{date:'2026-04-11',val:40}],
  'dev_incline':   [{date:'2026-02-28',val:10},{date:'2026-03-14',val:12},{date:'2026-04-04',val:14},{date:'2026-04-11',val:16}],
  'pecdeck':       [{date:'2026-02-28',val:24},{date:'2026-03-14',val:29},{date:'2026-04-04',val:34}],
  'elev_lat':      [{date:'2026-02-28',val:3}, {date:'2026-03-21',val:4}, {date:'2026-04-04',val:6}],
  'triceps_corde': [{date:'2026-02-28',val:14},{date:'2026-04-04',val:16}],
  'tirage_vert':   [{date:'2026-02-28',val:30},{date:'2026-03-14',val:32},{date:'2026-03-21',val:36},{date:'2026-04-04',val:40},{date:'2026-04-15',val:45}],
  'rowing_pb':     [{date:'2026-02-28',val:28},{date:'2026-03-14',val:32},{date:'2026-04-04',val:36},{date:'2026-04-15',val:40}],
  'rowing_uni':    [{date:'2026-02-28',val:12},{date:'2026-03-14',val:16},{date:'2026-04-04',val:18},{date:'2026-04-11',val:20}],
  'curl_halt':     [{date:'2026-02-28',val:8}, {date:'2026-04-04',val:10}],
  'curl_poulie':   [{date:'2026-02-28',val:8}, {date:'2026-04-04',val:10},{date:'2026-04-15',val:12}],
  'curl_corde':    [{date:'2026-07-30',val:12}],
  'curl_marteau_croise':[{date:'2026-08-14',val:10}], // variante du marteau (14/08) — départ = même échelle que le marteau, un cran en dessous
  'curl_incline_neutre':[{date:'2026-08-15',val:8}], // nouveau principal PULL (refonte 15/08) — départ estimé, à caler à la 1re séance
  'rowing_appui':  [{date:'2026-08-01',val:35}],
  'abduct':        [{date:'2026-08-01',val:25}],
  'adduct':        [{date:'2026-08-01',val:25}],
  'shrug_halt':    [{date:'2026-08-01',val:20}],
  'cable_fly':     [{date:'2026-08-01',val:9}],
  'leg_press':     [{date:'2026-02-28',val:50},{date:'2026-03-14',val:60}],
  'leg_ext':       [{date:'2026-02-28',val:20},{date:'2026-03-14',val:25},{date:'2026-04-04',val:35}],
  'leg_curl':      [{date:'2026-02-28',val:18},{date:'2026-03-07',val:12},{date:'2026-03-21',val:25},{date:'2026-04-04',val:30}],
  'mollets':       [{date:'2026-02-28',val:40}],
  'hip_thrust':    [{date:'2026-06-15',val:50}],
  'tirage_vert_s4':[{date:'2026-02-28',val:30},{date:'2026-03-14',val:32},{date:'2026-03-21',val:36},{date:'2026-04-04',val:40}],
  'face_pull':     [{date:'2026-06-15',val:18}],
  'rowing_pb_s4':  [{date:'2026-02-28',val:28},{date:'2026-03-14',val:32},{date:'2026-04-04',val:36}],
  'curl_incline':  [{date:'2026-02-28',val:6}, {date:'2026-04-04',val:8}],
  'curl_marteau':  [{date:'2026-02-28',val:8}],
  'seated_dips':      [{date:'2026-07-01',val:30}],
  'dips_assist':      [{date:'2026-06-15',val:45},{date:'2026-07-26',val:30}],
  'pulldown_bonus':   [{date:'2026-03-14',val:40}],
  'poulie_triceps_av':[{date:'2026-03-14',val:18}],
  'dev_halt_debout':  [{date:'2026-03-14',val:8}],
  'triceps_barre':    [{date:'2026-03-14',val:18}],
  'vertical_row':     [{date:'2026-04-04',val:35}],
  'shoulder_press':   [{date:'2026-04-04',val:16}]
};

function initWeights(){
  var allKeys=[];
  DATA.forEach(function(s){s.exos.forEach(function(e){if(allKeys.indexOf(e.key)<0)allKeys.push(e.key);});});
  EXTRAS.forEach(function(e){if(allKeys.indexOf(e.key)<0)allKeys.push(e.key);});
  var needsSave=false;
  var needsSync=false;
  allKeys.forEach(function(key){
    var arr=DB.weights[key];
    var seed=WEIGHT_HISTORY_SEED[key];
    // Construire un index par date de l'existant
    var byDate={};
    if(arr&&arr.length) arr.forEach(function(e){ byDate[e.date]=e.val; });
    if(seed){
      if(!arr||!arr.length){
        // Premier démarrage uniquement : initialiser depuis le seed
        DB.weights[key]=seed.map(function(x){return {date:x.date,val:x.val};});
        DB.weightSetDate[key]=seed[seed.length-1].date;
        needsSave=true; needsSync=true;
      }
      // Si des données existent déjà, on fait confiance au DB (pas de réinjection du seed)
    } else if(!arr||!arr.length){
      DB.weights[key]=[{date:'2026-02-28',val:CANONICAL_WEIGHTS[key]||0}];
      DB.weightSetDate[key]='2026-02-28';
      needsSave=true; needsSync=true;
    }
    if(!DB.weightSetDate[key]&&arr&&arr.length){
      DB.weightSetDate[key]=arr[arr.length-1].date; needsSave=true;
    }
  });
  if(needsSave) saveDB();
  if(needsSync&&typeof sbClient!=='undefined'&&sbClient){
    sbClient.auth.getUser().then(function(res){
      var userId=res.data&&res.data.user&&res.data.user.id;
      if(userId) _doSyncToSupabase(userId);
    });
  }
}

function getCurrentWeight(key){
  var arr=DB.weights[key];
  if(!arr||!arr.length) return 0;
  return arr[arr.length-1].val;
}

function getDaysSinceWeightChange(key){
  var d=DB.weightSetDate[key];
  if(!d) return 0;
  var past=new Date(d), now=getNow();
  return Math.floor((now-past)/(1000*60*60*24));
}

// Localise l'exercice et sa séance à partir de sa clé
function findExoIndex(key){
  for(var i=0;i<DATA.length;i++){
    for(var j=0;j<DATA[i].exos.length;j++){
      if(DATA[i].exos[j].key===key) return {sid:DATA[i].id, ei:j, seance:DATA[i], exo:DATA[i].exos[j]};
    }
  }
  return null;
}


// Pondération d'une séance dans l'objectif hebdo :
// séance salle = 1 · séance Maison ('sb') ou autre sport ('autre:') = 0,5 (il en faut 2 pour valoir 1).
// Un exercice isolé ('exo:') n'a pas de poids propre : c'est le log entier (voir logWeight) qui
// décide si une sélection d'exos à la carte vaut une séance complète.
function sessionWeight(sid){
  if(sid==='sm') return 0; // ROUTINE MAISON (19/10) : petit plus des jours sans salle — jamais une séance de salle
  if(sid==='sb'||sid.indexOf('autre:')===0) return 0.5;
  if(sid.indexOf('exo:')===0) return 0;
  return 1;
}
// Pondération d'UN log (une entrée de séance) dans l'objectif hebdo.
// - séances nommées (push/pull/legs) = 1 chacune · Maison/autre sport = 0,5
// - une sélection d'exercices muscu à la carte ('exo:') = 1 séance complète
//   (peu importe le nombre d'exos choisis), MAIS jamais empilée par-dessus une
//   séance salle déjà comptée dans le même log.
function logWeight(l){
  if(l&&l.sport==='course') return 0; // course (12/10) : objectif « Courir », jamais une séance de gym
  var w=0, hasExo=false, home=(l&&l.sessions||[]).indexOf('sm')>=0;
  (l && l.sessions || []).forEach(function(sid){
    if(sid.indexOf('exo:')===0){ if(!exoIsCardio(sid.slice(4))) hasExo=true; } // 19/10 : du cardio seul n'est pas une séance de salle
    else w+=sessionWeight(sid);
  });
  if(hasExo && w<1 && !home) w=1; // un exo ajouté à la routine maison ne la transforme pas en séance
  return w;
}
// Valeur pondérée totale d'un ensemble de logs (peut être décimale, ex. 2,5)
function weekValue(logs){
  var t=0; (logs||[]).forEach(function(l){ t+=logWeight(l); });
  return Math.round(t*10)/10;
}
// Format FR d'un nombre de séances (virgule décimale, sans zéro superflu)
function fmtSeances(n){ return (Math.round(n*10)/10).toString().replace('.',','); }

// Objectif de séances/semaine — configurable dans Paramètres. Défaut 4.
// Réglages › Saison Sèche (04/11) : interrupteur d'APERÇU (saison.js) — immédiat, sans « Sauvegarder », par appareil
function renderSettingsSeason(){
  var el=document.getElementById('settingsSeason'); if(!el||typeof SAISON==='undefined') return;
  var real=SAISON.realIdAt(todayStr())==='seche', on=SAISON.preview();
  el.innerHTML=real?'<div style="font-size:.74rem;color:var(--mut);">La S&#xE8;che est en cours.</div>'
    :'<button type="button" class="btn-primary" style="margin:0;'+(on?'':'background:none;border:1px solid var(--gb);color:var(--txt);')+'" onclick="SAISON.setPreview('+(!on)+')">'+(on?'&#x1F441; Aper&#xE7;u actif &#xB7; le couper':'&#x1F441; Voir l\'aper&#xE7;u de la S&#xE8;che')+'</button>'
      +'<div style="font-size:.68rem;color:var(--mut);margin-top:.4rem;line-height:1.4;">Le Bilan, les objectifs, la nutrition et la note de la semaine s\'affichent en S&#xE8;che. Rien n\'est grav&#xE9;, tes s&#xE9;ances gardent les r&#xE8;gles actuelles.</div>';
}
function getWeekGoal(){
  var g=DB.profile&&DB.profile.weekGoal;
  return (g>=2&&g<=6)?g:4;
}

// Un exo d'une séance EN DIRECT compte dans la progression seulement s'il a été mené
// (presque) au bout : toutes les séries faites, ou skip à 1 série de la fin (ex. 3/4).
// Skip après 1-2 séries ou skip direct = PAS comptabilisé (mais le tag séance reste au calendrier).
// Règle de comptage (16/08, demande Adrien — Leg Press 2/4 barré alors que le travail est réel) :
// TOUT exo compte dès 2 séries (principal comme bonus — avant : n−1 pour les principaux).
// Les séries manquantes pèsent toujours dans la note /5, mais l'historique/progression les garde.
// Arrêt DOULEUR (x.pain) : compté dès la 1re série — la douleur n'efface jamais le travail fait.
function liveExoCounted(x){
  if(!x) return false;
  if(x.status==='done') return true;
  if(x.pain&&(x.sets||[]).length>=1) return true;
  var n=x.n||3;
  return (x.sets||[]).length>=Math.min(2,n); // cardio 1×20min : 1 « série » suffit
}

// Un exo "annexe" = bonus du programme OU ajouté en cours de séance (extra/added).
// Règle (31/07/2026) : un annexe ne compte JAMAIS comme abandon/échec — soit il est
// mené assez loin pour être compté (liveExoCounted), soit il est simplement ignoré
// du bilan (note /20, analyse) et du futur rank. ≥2 séries → visible dans le détail du jour.
function liveExoSide(x){
  if(!x) return false;
  if(x.main!=null) return !x.main; // statut FIGÉ à l'enregistrement (15/08) — insensible aux refontes du programme
  if(x.extra||x.added) return true;
  var info=findExoIndex(x.key);
  return !!(info&&info.exo&&info.exo.bonus);
}
// Exos "engagés" pour la notation : principaux toujours, annexes seulement si complétés.
function liveEngagedExos(list){
  return (list||[]).filter(function(x){ return !liveExoSide(x)||liveExoCounted(x); });
}
// Annexes tentés mais non comptés (pour affichage neutre, jamais en malus)
function liveSideAttempts(list){
  return (list||[]).filter(function(x){ return liveExoSide(x)&&!liveExoCounted(x)&&(x.sets||[]).length>0; });
}
// Note /20 d'un log live : FIGÉE à l'enregistrement (live.note20) — recalcul en secours pour
// les vieux logs. Leçon du 15/08 (retour Adrien « 10/20 et 20/20 incompréhensibles ») : recalculer
// avec les flags bonus/principal du JOUR réécrit l'histoire — la refonte PULL sortait rowing
// appui/marteau/corde de la note des séances passées. La note d'une séance ne doit plus jamais bouger.
function liveLogNote20(l){
  if(!l||!l.live) return null;
  if((l.sessions||[]).indexOf('sm')>=0&&l.live.note20==null) return null; // routine maison : ne se note pas (19/10)
  if(l.live.note20!=null) return l.live.note20;
  var ex=liveNotedExos(l.live.exos||[]);
  if(!ex.length) return null;
  var t=0; ex.forEach(function(x){ t+=asScoreExoRaw(x); });
  return Math.max(0,Math.min(20,Math.round(t/ex.length*4)));
}
// Échelle de couleurs des notes /20 (15/08, demande Adrien) :
// ≥18 = GOLD · 14-17 = bleu dynamique MASSUP · 11-13 = vert · 8-10 = orange · <8 = rouge
// Échelle de couleur v5 (DA Graphite Énergie, 02/11/2026 — décision Adrien « 5 couleurs ») : < 8 rouge sang ·
// 8-11,5 rouge · 12-13,5 gris · 14-17,5 bleu · ≥ 18 gold. Les noms de classe historiques restent (n-red = rouge sang,
// n-orange = rouge, n-green = gris) : les couleurs viennent de --x-note-1..5 (da.css). Affichage seulement : aucune note ne change.
function note20Cls(n){
  if(n==null) return '';
  return n>=18?'n-gold':n>=14?'n-blue':n>=12?'n-green':n>=8?'n-orange':'n-red';
}
// Exos qui NOTENT le /20 (règle Adrien 02/08) : les PRINCIPAUX uniquement — les bonus rapportent
// des points mais n'entrent jamais dans la note de séance (ni en bien ni en mal).
// Séance 100% à la carte (aucun principal) : les exos choisis SONT le programme du jour → tous notent.
function liveNotedExos(list){
  var eng=liveEngagedExos(list).filter(function(x){ return !exoIsCardio(x.key); }); // le cardio ne se note pas
  var mains=eng.filter(function(x){ return !liveExoSide(x); });
  return mains.length?mains:eng;
}

// Exos passés de PRINCIPAL à BONUS en cours de route : avant cette date, valider la séance
// entière les incluait — leurs compteurs/historiques doivent continuer à compter ces séances-là.
// (Bug corrigé 01/08 : rowing_uni affichait 2 séances au lieu de ~15 après son passage en bonus.)
var BONUS_SINCE={rowing_uni:'2026-08-01',curl_halt:'2026-08-01',mollets:'2026-07-30',hip_thrust:'2026-07-30',
  // Refonte PULL 15/08 : ces trois-là étaient PRINCIPAUX avant — leurs séances passées comptent
  rowing_appui:'2026-08-15',curl_marteau:'2026-08-15',curl_corde:'2026-08-15',curl_incline:'2026-08-15'};
function exoMainForLog(info,key,date){
  if(!info.exo.bonus) return true;
  var d=BONUS_SINCE[key];
  return !!d&&!!date&&date<d;
}
// Combien de séances loggées au poids ACTUEL (depuis la dernière hausse)
function getSessionsAtWeight(key){
  var arr=DB.weights[key]; if(!arr||!arr.length) return 0;
  var sinceDate=arr[arr.length-1].date;
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<sinceDate) return false;
    // Séance en direct : la liste live fait foi, exo par exo (règle liveExoCounted).
    if(l.live&&l.live.exos){
      var lx=null;
      l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    // Valider une séance entière compte ses exos principaux ; un bonus ne compte que s'il est explicitement
    // coché (exo:) — SAUF s'il était encore principal à la date du log (exoMainForLog).
    return (l.sessions||[]).some(function(sid){ return (sid===info.sid && exoMainForLog(info,key,l.date)) || sid==='exo:'+key; });
  }).length;
}

// ── Séries à la charge actuelle (01/11, demande Adrien — remplace « N séances à ce poids ») ──
// Combien de séries il a déjà faites à sa charge de référence (ou plus lourd ; assistance : ou moins),
// sur TOUT l'historique LiveUp. (Corrigé le 01/11 : la 1re version s'arrêtait à la première séance
// sans série à cette charge — une séance plus légère remettait le compteur à zéro : curl marteau
// croisé 3/56 au lieu de 38.) Objectif ADAPTÉ À L'EXO (01/11,
// Adrien : « élévation latérale, il en faut beaucoup plus ») : séances visées = 6 + 40 × (cran / charge),
// bornées 8-20, × séries prévues — pec deck 54 kg, cran 5 → 10 séances (40 séries) ; élévation 6 kg,
// cran 2 (+33 %) → 19 séances (76 séries). liveX = l'exo de la séance en cours (pas encore enregistrée).
// Paliers de reps (03/11, demande Adrien : « différencier 24 kg × 8, × 10, × 12 — même poids, je change l'échelle,
// ça peut stagner ») : à la même charge, monter de 2 reps EST une progression. Un palier = charge × niveau de reps
// (paliers de 2 depuis le bas de la fourchette : 8-10 → × 8 · × 10 · × 12 ; 12-15 → × 12 · × 14 · × 16). Le niveau
// d'une séance = moyenne arrondie de ses séries à la charge ; le palier ACTUEL = le meilleur niveau atteint à cette charge,
// et on compte depuis la 1re séance qui l'a atteint (les séances moins bonnes d'après comptent : c'est de la stagnation)
// → passer de × 8 à × 10 relance la barre. Exos comptés en secondes / minutes : pas de palier (comme avant).
function lcRepLevel(lo,r){ return lo+2*Math.floor((r-lo)/2); }
// ── Palier choisi + crédit partiel (06/11, demande Adrien) ──
// · Le palier = charge × reps VISÉES. En séance, la charge = le poids de travail du jour (avant : la réf.
//   — « 60 kg aujourd'hui, la barre affichait 56 kg ») et les reps se règlent sur l'intro de l'exo (x.gR).
// · Reps par défaut = tes 5 dernières séances de l'exo à cette charge (médiane des médianes, palier de 2,
//   jamais sous le bas de la fourchette) — « curl marteau : 12 × 8 affiché alors que l'exo c'est du 12 × 10 ».
//   Un choix fait en séance (gR gravé dans le log) reste le défaut tant que la charge ne change pas.
// · Une série vaut 1 si reps ≥ cible, ½ à 1 ou 2 reps près (cible 12 : 11 et 10 = ½, 9 = 0).
// · On compte depuis la 1re séance entrée dans ce palier (médiane de ses séries ≥ cible, ou palier visé exprès) :
//   passer à + 2 reps relance toujours la barre (règle du 03/11).
function lcCredit(r,R){ return r>=R?1:(r>=R-2?0.5:0); }
function lcNum(v){ return String(Math.round(v*2)/2).replace('.',','); }
function lcMed(a){ a=a.slice().sort(function(p,q){return p-q;}); var m=a.length>>1; return a.length%2?a[m]:(a[m-1]+a[m])/2; }
function loadCount(key,liveX,g){
  var d=asExoDef(key); if(!d||exoIsCardio(key)) return null;
  var ref=getCurrentWeight(key); if(ref==null) return null;
  if(!g&&liveX&&liveX.weight!=null) g={w:liveX.weight,r:liveX.gR};
  var W=(g&&g.w!=null)?g.w:ref;
  var n=asParseSerie(d.e).n||3, inv=asIsInverse(key);
  var stepK=fsStep({key:key,inc:d.e.inc}), sess=Math.max(8,Math.min(20,Math.round(6+40*stepK/Math.max(1,ref))));
  var target=sess*n;
  var at=function(w){ return w!=null&&(inv?w<=W:w>=W); };
  var setsAt=function(x){ return (x.sets||[]).filter(function(st){ return at(st.w!=null?st.w:(x.w!=null?x.w:x.weight)); }); };
  var lo=(!d.e.repTarget&&REP_RANGE[key])?REP_RANGE[key].r[0]:(d.e.repTarget?0:asParseSerie(d.e).reps);
  var byReps=lo>0&&(d.e.cnt||'reps')==='reps';
  var logs=(DB.logs||[]).filter(function(l){ return l.live&&l.live.exos&&(!liveX||(String(l.id)!==String(AS&&AS.savedLogId)&&String(l.id)!==String(AS&&AS.resumeLogId))); })
    .sort(function(a,b){ return b.date.localeCompare(a.date)||(b.time||'').localeCompare(a.time||''); });
  var sessAt=[]; // séances (de la plus récente à la plus ancienne) qui ont des séries à cette charge
  logs.forEach(function(l){
    var ss=[], gR=null; l.live.exos.forEach(function(x){ if(x.key===key&&liveExoCounted(x)){ ss=ss.concat(setsAt(x)); if(x.gR!=null&&x.w===W) gR=x.gR; } });
    if(ss.length) sessAt.push({ss:ss,gR:gR});
  });
  var R=null, auto=false;
  if(byReps){
    R=(g&&g.r!=null)?g.r:null;
    if(R==null) sessAt.some(function(o){ if(o.gR!=null){ R=o.gR; return true; } return false; }); // dernier palier choisi à cette charge
    if(R==null){
      auto=true;
      var meds=sessAt.slice(0,5).map(function(o){ return lcMed(o.ss.map(function(st){ return st.reps||0; })); });
      R=meds.length?Math.max(lo,lcRepLevel(lo,Math.round(lcMed(meds)))):lo;
    }
  }
  var from=sessAt.length-1;
  if(byReps){
    from=-1;
    for(var j=sessAt.length-1;j>=0;j--){
      var o=sessAt[j];
      if((o.gR!=null&&o.gR>=R)||Math.round(lcMed(o.ss.map(function(st){ return st.reps||0; })))>=R){ from=j; break; } // 1re séance (la plus ancienne) dans le palier
    }
  }
  var cr=function(ss){ var c=0; ss.forEach(function(st){ c+=byReps?lcCredit(st.reps||0,R):1; }); return c; };
  var done=0;
  if(liveX) done+=cr(setsAt(liveX)); // séance en cours : ses séries vont au palier choisi
  for(var k=0;k<=from;k++) done+=cr(sessAt[k].ss);
  var unite=d.e.unite||'kg';
  return {w:W,ref:ref,lvl:R,lo:byReps?lo:null,auto:auto,lbl:W+' '+unite+(R!=null?' &#xD7; '+R:''),done:done,doneTxt:lcNum(done),target:target,sess:sess,ratio:done/target,unite:unite};
}
// Alerte de stagnation : 75 % de l'objectif = « bientôt », 100 % = « il est temps »
function getProgressNudge(key){
  if(typeof SAISON!=='undefined'&&SAISON.realIdAt(todayStr())==='seche') return null; // Sèche : tenir la charge, c'est réussi (04/11)
  var lc=loadCount(key); if(!lc) return null;
  var lbl='<strong>'+lc.doneTxt+' / '+lc.target+' s&#xE9;ries</strong> &#xE0; '+lc.lbl;
  if(lc.ratio>=1) return {lvl:'hot',chip:'&#x1F534; '+lc.doneTxt+'/'+lc.target+' séries',msg:lbl+' &#x2014; l\'objectif de s&#xE9;ries est d&#xE9;pass&#xE9; sans monter&#x202F;: il est temps de charger plus (ou de changer d\'angle&#x202F;: tempo, +1 rep).'};
  if(lc.ratio>=0.75) return {lvl:'warn',chip:'&#x26A0; '+lc.doneTxt+'/'+lc.target+' séries',msg:lbl+' &#x2014; si tes s&#xE9;ries passent proprement, la hausse arrive bient&#xF4;t.'};
  return null;
}
// Même barre EN SÉANCE (01/11, demande Adrien : « avoir un œil dessus » à l'intro et pendant le repos) :
// plein = séries déjà faites à la charge, irisé = celles du jour, pointillé = celles qui restent prévues.
function lcLiveHtml(x){
  if(!x||exoIsCardio(x.key)) return '';
  var g={w:x.weight,r:x.gR}; // palier du jour : poids de travail × reps visées (06/11)
  var base=loadCount(x.key,{key:x.key,sets:[]},g); if(!base) return '';
  var withToday=loadCount(x.key,x,g)||base;
  var today=Math.max(0,withToday.done-base.done), T=base.target;
  var left=!x.bonusMode?Math.max(0,(x.n||0)-(x.sets||[]).length-(x.skippedSets||0)):0;
  var tot=base.done+today, r=tot/T;
  var pc=function(v){ return Math.max(0,Math.min(100,v/T*100)); };
  var wB=pc(base.done), wT=Math.min(100-wB,pc(today)), wL=Math.min(100-wB-wT,pc(left));
  var cls=r>=1?' hot':r>=0.75?' warn':'';
  return '<div class="lc-live'+cls+'" id="as-lc"><div class="lc-top"><span>&#x1F4CA; S&#xE9;ries &#xE0; '+base.lbl+'</span>'
    +'<strong>'+lcNum(tot)+' / '+T+'</strong></div>'
    +'<div class="lc-bar lc-bar3"><i class="lc-b" style="width:'+wB.toFixed(1)+'%"></i><i class="lc-t holo-fill" style="width:'+wT.toFixed(1)+'%"></i><i class="lc-l" style="width:'+wL.toFixed(1)+'%"></i></div>'
    +(r>=1?'<div class="lc-sub">'+((typeof SAISON!=='undefined'&&SAISON.realIdAt(todayStr())==='seche')?'S&#xE8;che&#x202F;: tenir cette charge, c\'est d&#xE9;j&#xE0; gagner.':'Objectif d&#xE9;pass&#xE9;&#x202F;: c\'est le moment de monter.')+'</div>':'')
    +'</div>';
}
// Barre « séries à cette charge » de la fiche d'un exo (toujours visible dès qu'il y a des séries)
function loadCountHtml(key){
  var lc=loadCount(key); if(!lc||!lc.done) return '';
  var cls=lc.ratio>=1?' hot':lc.ratio>=0.75?' warn':'';
  return '<div class="lc-box'+cls+'"><div class="lc-top"><span>&#x1F4CA; S&#xE9;ries &#xE0; '+lc.lbl+'</span><strong>'+lc.doneTxt+' / '+lc.target+'</strong></div>'
    +'<div class="lc-bar"><i style="width:'+Math.min(100,Math.round(lc.ratio*100))+'%"></i></div>'
    +'<div class="lc-sub">'+(lc.ratio>=1?'Objectif d&#xE9;pass&#xE9; sans monter&#x202F;: il est temps de changer quelque chose.':'Rep&#xE8;re pour cet exo&#x202F;: ~'+lc.target+' s&#xE9;ries ('+lc.sess+' s&#xE9;ances) par palier (charge &#xD7; reps), puis passe au suivant&#x202F;: +2 reps ou +1 cran.')+'</div></div>';
}

// Pour les exos Maison "repTarget" : la valeur saisie est l'objectif par série (3 séries)
// ── Unité de ce qu'on COMPTE par série (08/08, retour Adrien) ──────────────────
// Jusqu'ici l'app déduisait « reps ou secondes » de exo.unite, qui est l'unité de CHARGE.
// Faux dès qu'un exo se charge dans une unité et se compte dans une autre :
//   · Pallof Press → charge en kg, se compte en SECONDES de gainage anti-rotation
//   · Cardio zone 2 / rameur → « charge » en min, se compte en MINUTES (affichait « 20 reps »)
// exo.cnt porte désormais l'unité comptée ('reps' | 's' | 'min'), unite reste la charge.
// Les logs enregistrés AVANT le 08/08 n'ont pas de `cnt` : on retombe sur la définition de l'exo.
// C'est une CORRECTION d'étiquette, pas une réécriture — un Pallof s'est toujours tenu en secondes,
// c'est l'app qui l'appelait « reps ». Les objets sans clé (shims d'affichage) gardent l'ancien défaut.
var _CNT_BY_KEY=null;
function cntU(x){
  if(!x) return 'reps';
  if(x.cnt) return x.cnt;
  if(x.key){
    if(!_CNT_BY_KEY){
      _CNT_BY_KEY={};
      try{ DATA.forEach(function(s){ s.exos.forEach(function(e){ if(e.cnt&&!_CNT_BY_KEY[e.key]) _CNT_BY_KEY[e.key]=e.cnt; }); }); }catch(e){}
    }
    if(_CNT_BY_KEY[x.key]) return _CNT_BY_KEY[x.key];
  }
  return x.unite==='s'?'s':'reps';
}
function cntFmt(x,v){ var u=cntU(x); return u==='reps'?(v+' reps'):(u==='s'?(v+'s'):(v+' '+u)); }
function cntShort(x,v){ var u=cntU(x); return u==='s'?(v+'s'):(u==='reps'?String(v):(v+' '+u)); }
function cntStep(x){ var u=cntU(x); return u==='s'?5:1; }          // un hold se règle par crans de 5 s
function cntAsk(x){ var u=cntU(x);
  return u==='s'?'Combien de secondes tenues ?':(u==='min'?'Combien de minutes ?':'Combien de r&#xE9;p&#xE9;titions ?'); }
function repLabel(exo,val){ return cntShort(exo,val); }
// Nombre de séries d'un exo repTarget : lu dans `serie` (le cardio en fait 1, pas 3)
function repTargetN(exo){ var m=(exo.serie||'').match(/^(\d+)[×x]/); return m?parseInt(m[1],10):3; }
function csLabel(exo,val){ return repTargetN(exo)+' × '+(exo.unite==='s'?val+'s':(val+' '+exo.unite)); }
function updateRepTargetDisplay(key,val){
  var info=findExoIndex(key); if(!info||!info.exo.repTarget) return;
  var cs=document.getElementById('chip-s-'+key); if(cs) cs.innerHTML='&#x1F4CA; '+csLabel(info.exo,val);
  var srow=document.getElementById('srow-'+info.sid+'-'+info.ei);
  if(srow) srow.querySelectorAll('.sbbl-r').forEach(function(el){ el.textContent=repLabel(info.exo,val); });
}

// ══════════════════════════════════════════════════
// BUILD SEANCES
// ══════════════════════════════════════════════════
function buildSeances(){
  var gridMain=document.getElementById('sgridMain');
  var gridMini=document.getElementById('sgridMini');
  var panelsDiv=document.getElementById('panels');
  if(!gridMain||!gridMini||!panelsDiv) return;
  gridMain.innerHTML=''; gridMini.innerHTML=''; panelsDiv.innerHTML='';

  DATA.forEach(function(s,si){
    if(s.id==='sm') return; // ROUTINE MAISON (01/11, Adrien) : pas de bulle ici — elle se lance depuis le LiveUp
    var mini=si>=2; // PUSH + PULL en grand, le reste (Jambes, Others) en petites bulles
    var grid=mini?gridMini:gridMain;
    var card=document.createElement('div');
    card.className='sc'+(si===0?' active':'')+(mini?' sc-mini':'');
    card.dataset.t=s.t; card.dataset.id=s.id;
    card.addEventListener('click',function(){ selectSeance(s.id); });
    var visExos=s.exos.filter(function(e){return !e.hidden;});
    var mainExos=visExos.filter(function(e){return !e.bonus;});
    var bonusExos=visExos.filter(function(e){return e.bonus;});
    // Card v2 (02/08) : icône + nom + sous-titre, point — le numéro et le compte d'exos n'apportaient rien
    card.innerHTML='<span class="sc-ico">'+s.icon+'</span><div class="sc-name">'+s.name+'</div><div class="sc-sub">'+s.sub+'</div>';
    grid.appendChild(card);

    var total=0; mainExos.forEach(function(e){var m=e.serie.match(/^(\d+)/);if(m)total+=parseInt(m[1]);});

    function buildExo(e,ei,dispNum){
      var w=getCurrentWeight(e.key);
      var inc=e.inc||0.5;
      var isKg=/kg/.test(e.unite);
      var hasImg=e.img&&typeof IMGS!=='undefined'&&IMGS[e.img];
      var actLbl=isKg?'Poids actuel':'Valeur actuelle';
      // Séries : pour les exos "repTarget" (Maison), la valeur saisie est l'objectif par série.
      // Le nombre de séries vient de `serie` — le cardio n'en a qu'UNE (08/08), pas 3.
      var sets='';
      if(e.repTarget){
        var rtN=repTargetN(e);
        for(var i=1;i<=rtN;i++)sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+i+'" onclick="toggleSet(\''+s.id+'\','+ei+','+i+','+rtN+',\''+e.key+'\')"><span>Série '+i+'</span><span class="sbbl-r">'+repLabel(e,w)+'</span></div>';
      } else {
        var m=e.serie.match(/^(\d+)×(.+)$/);
        if(m){var n=parseInt(m[1]),r=m[2];for(var k=1;k<=n;k++)sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+k+'" onclick="toggleSet(\''+s.id+'\','+ei+','+k+','+n+',\''+e.key+'\')"><span>Série '+k+'</span><span class="sbbl-r">'+r+'</span></div>';}
      }
      var serieLabel=e.repTarget?csLabel(e,w):e.serie;
      if(!e.repTarget&&REP_RANGE[e.key]){ var _sm=(e.serie||'').match(/^(\d+)[×x]\d+(.*)$/); if(_sm) serieLabel=_sm[1]+'×'+REP_RANGE[e.key].r[0]+'-'+REP_RANGE[e.key].r[1]+_sm[2]; }
      var tips=e.tips.map(function(t){return '<div class="tip"><div class="tdot"></div>'+t+'</div>';}).join('');
      var errs=e.errs.map(function(er){return '<div class="erritem"><span class="errx">✕</span>'+er+'</div>';}).join('');
      var days=getDaysSinceWeightChange(e.key);
      var nudge=getProgressNudge(e.key); // encadré jaune (≥6) / rouge (≥10) dans la section dépliée — seule trace du compteur (retour Adrien)
      var staleHtml='<div class="lc-wrap" data-lc="'+e.key+'">'+loadCountHtml(e.key)+'</div>'; // séries à la charge actuelle (01/11)
      var prChip=days===0?'<span class="chip chip-up">&#x1F195; Mis à jour aujourd\'hui</span>':'';
      // Retour Adrien 01/08 : plus de compteur « N séances à ce poids » sur la ligne fermée (pas beau) —
      // le détail vit dans la section dépliée (staleHtml). Seul un point rouge discret signale un ≥10.
      var staleChip=(nudge&&nudge.lvl==='hot')?'<span class="stale-dot" title="10 s&#xE9;ances ou plus &#xE0; ce poids &#x2014; ouvre l\'exo pour le d&#xE9;tail">&#x1F534;</span>':'';
      var impCls=e.imp?' ex-imp':'';
      var impTag=e.imp?'<span class="ex-imp-tag" title="Exercice clé pour ton profil">Clé</span>':'';
      return '<div class="ex'+(e.bonus?' ex-bonus':'')+impCls+'" id="ex-'+s.id+'-'+ei+'">'
        +'<button class="exbtn" onclick="toggleEx(\''+s.id+'\','+ei+')">'
        +'<div class="exnum">'+dispNum+'</div>'
        +'<div class="exinf"><div class="exname">'+e.name+impTag+'</div>'
        +'<div class="exmeta"><span class="chip cw" id="chip-w-'+e.key+'">&#x2696;&#xFE0F; '+w+' '+e.unite+'</span><span class="chip cs" id="chip-s-'+e.key+'">&#x1F4CA; '+serieLabel+'</span>'+prChip+staleChip+'</div></div>'
        +'<div class="exarr">▾</div></button>'
        +'<div class="exbody"><div class="exinner'+(hasImg?'':' no-demo')+'">'
        +(hasImg?'<div class="demo"><img src="'+IMGS[e.img]+'" alt="'+e.name+'" style="width:100%;height:100%;object-fit:contain;"/><div class="demo-lbl">Démonstration</div></div>':'')
        +'<div class="exc">'
        +'<div><div class="seclbl">'+actLbl+'</div>'
        +'<div class="weight-row"><button class="wbtn minus" onclick="changeWeight(\''+e.key+'\',-'+inc+',\''+s.id+'\','+ei+',\''+e.unite+'\')">−</button><input class="weight-input" id="wval-'+e.key+'" type="number" step="'+inc+'" min="0" value="'+w+'" oninput="previewWeight(this,\''+e.key+'\',\''+e.unite+'\')" onblur="setWeightDirect(this,\''+e.key+'\',\''+s.id+'\','+ei+',\''+e.unite+'\')" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="weight-unit">'+e.unite+'</span><button class="wbtn plus" onclick="changeWeight(\''+e.key+'\','+inc+',\''+s.id+'\','+ei+',\''+e.unite+'\')">+</button></div>'
        +'<div class="weight-date" id="wdate-'+e.key+'">Dernière modif. : '+formatDateFr(DB.weightSetDate[e.key])+'</div>'
        +staleHtml+'</div>'
        +'<div class="rec-top" data-rectop="'+e.key+'">'+recTopHtml(e.key)+'</div>'
        +'<div><div class="seclbl">Séries — clique pour cocher</div><div class="srow" id="srow-'+s.id+'-'+ei+'">'+sets+'</div></div>'
        +'<div class="rest-timer" id="timer-'+s.id+'-'+ei+'">'
        +'<div class="rt-circle" id="rtc-'+s.id+'-'+ei+'"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="fg" cx="22" cy="22" r="18" fill="none" stroke="#71FFB4" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"/></svg></div>'
        +'<div class="rt-info"><div class="rt-label">Repos</div><div class="rt-time" id="rtt-'+s.id+'-'+ei+'">'+formatTime(e.rest)+'</div><div class="rt-msg" id="rtm-'+s.id+'-'+ei+'">Série terminée !</div></div>'
        +'<button class="rt-stop" onclick="stopTimer(\''+s.id+'\','+ei+')">✕</button>'
        +'</div>'
        +'<div class="cue"><div class="cuelbl">&#x27A1; Cue principal</div><div class="cuetxt">'+e.cue+'</div>'+(e.bless?'<div class="cue-bless">&#x1FA79; '+e.bless+'</div>':'')+'</div>'
        +'<div><div class="seclbl">Conseils</div><div class="tips">'+tips+'</div></div>'
        +'<div class="errs"><div class="errlbl">⚠ Erreurs à éviter</div>'+errs+'</div>'
        +'</div></div></div></div>';
    }

    var mainHtml='', bonusHtml='', mainNo=0, bonusNo=0;
    if(s.id==='sb'){
      // OTHERS : trié par catégorie avec en-têtes (Abdos · Poids de corps · Cardio)
      OTHERS_CATS.forEach(function(c){
        var catExos=s.exos.map(function(e,ei){return {e:e,ei:ei};}).filter(function(x){return !x.e.hidden&&(x.e.cat||'corps')===c.id;});
        if(!catExos.length) return;
        mainHtml+='<div class="oth-cat">'+c.ico+' '+c.lbl+'</div>';
        catExos.forEach(function(x){ mainNo++; mainHtml+=buildExo(x.e,x.ei,('0'+mainNo).slice(-2)); });
      });
    } else {
      s.exos.forEach(function(e,ei){
        if(e.hidden) return;
        if(e.bonus){ bonusNo++; bonusHtml+=buildExo(e,ei,'B'+bonusNo); }
        else { mainNo++; mainHtml+=buildExo(e,ei,('0'+mainNo).slice(-2)); }
      });
    }

    var bonusBlock='';
    if(bonusExos.length){
      bonusBlock='<button class="bonus-btn" id="bonusbtn-'+s.id+'" onclick="toggleBonus(\''+s.id+'\')">'
        +'&#x2B50; Exercices bonus <span class="bb-ct">+'+bonusExos.length+'</span><span class="wb-arr">&#x25BE;</span></button>'
        +'<div class="bonus-body" id="bonusbody-'+s.id+'">'+bonusHtml+'</div>';
    }

    var panel=document.createElement('div');
    panel.className='panel'+(si===0?' active':'');
    panel.id='panel-'+s.id; panel.dataset.t=s.t;
    panel.innerHTML='<div class="phdr"><div class="ptw"><div class="plbl">'+s.num+' \u00b7 '+s.icon+'</div><div class="ptitle">'+s.name+'</div><div class="psub">'+s.sub+'</div></div><div class="pstats"><div><div class="sv">'+mainExos.length+'</div><div class="sl">Exercices</div></div><div><div class="sv">'+total+'</div><div class="sl">S\u00e9ries</div></div></div></div>'
      +buildWarmup(s.id,s.t)+'<div class="exlist">'+mainHtml+bonusBlock+'</div>';
      // (section étirements retirée d'OTHERS le 04/08 — tout vit dans l'espace Détente 🧘)
    panelsDiv.appendChild(panel);
  });
}

function toggleStretch(id){
  var g=document.getElementById('stgrp-'+id);
  if(g) g.classList.toggle('open');
}

function selectSeance(id){
  document.querySelectorAll('.sc').forEach(function(c){c.classList.toggle('active',c.dataset.id===id);});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('active',p.id==='panel-'+id);});
  document.querySelectorAll('.ex').forEach(function(e){e.classList.remove('open');});
}

function toggleBonus(sid){
  var btn=document.getElementById("bonusbtn-"+sid);
  var body=document.getElementById("bonusbody-"+sid);
  if(!btn||!body) return;
  var open=body.classList.contains("open");
  btn.classList.toggle("open",!open);
  body.classList.toggle("open",!open);
}

function toggleEx(sid,idx){
  var card=document.getElementById('ex-'+sid+'-'+idx);
  var wasOpen=card.classList.contains('open');
  document.querySelectorAll('[id^="ex-'+sid+'-"]').forEach(function(c){c.classList.remove('open');});
  if(!wasOpen){
    card.classList.add('open');
    var rt=card.querySelector('[data-rectop]'); if(rt) rt.innerHTML=recTopHtml(rt.getAttribute('data-rectop')); // perfs à jour (séance du jour comprise)
    var lcw=card.querySelector('[data-lc]'); if(lcw) lcw.innerHTML=loadCountHtml(lcw.getAttribute('data-lc'));
  }
}

// ══════════════════════════════════════════════════
// WEIGHT MANAGEMENT
// ══════════════════════════════════════════════════
function changeWeight(key, delta, sid, ei, unite){
  var arr=DB.weights[key]||[];
  var cur=arr.length?arr[arr.length-1].val:0;
  var nw=Math.max(0, Math.round((cur+delta)*2)/2);
  var today=todayStr();
  if(arr.length && arr[arr.length-1].date===today){ arr[arr.length-1].val=nw; }
  else{ arr.push({date:today,val:nw}); }
  var wasPR=isPR(key,nw,arr);
  DB.weights[key]=arr;
  DB.weightSetDate[key]=today;
  saveDB();
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=nw; else wval.textContent=nw; }
  var chip=document.getElementById('chip-w-'+key);
  if(chip) chip.innerHTML='&#x2696;&#xFE0F; '+nw+' '+unite;
  var wdate=document.getElementById('wdate-'+key);
  if(wdate) wdate.textContent='Dernière modif. : '+formatDateFr(today);
  var nudge=document.getElementById('nudge-'+key);
  if(nudge) nudge.classList.remove('show');
  updateRepTargetDisplay(key,nw);
  asSyncOfficialWeight(key,nw);
  if(wasPR&&delta>0){ showPRCelebration(chip,nw,unite); }
  else{ showToast(delta>0?'&#x1F4AA; +'+delta+' '+unite:'&#x2193; '+nw+' '+unite); }
}
// Le poids OFFICIEL vient de changer : répercuter sur un LiveUp en cours (retour Adrien 02/08).
// La référence (w0) suit toujours ; le poids de travail suit seulement s'il n'a pas été
// personnalisé en séance (weight===ancienne référence).
function asSyncOfficialWeight(key,nw){
  try{
    if(!AS||!AS.exos||!AS.exos.length) return;
    var chg=false;
    AS.exos.forEach(function(x){
      if(x.key!==key) return;
      var untouched=x.weight===x.w0;
      x.w0=nw;
      if(untouched){ x.weight=nw; if(x.repT) x.reps=nw; }
      chg=true;
    });
    if(chg){
      asSave();
      var ov=document.getElementById('asOverlay');
      if(ov&&ov.classList.contains('open')) asRender();
      asRenderBubble();
    }
  }catch(e){}
}

function setWeightDirect(input, key, sid, ei, unite){
  var nw=parseFloat(input.value);
  if(isNaN(nw)||nw<0){input.value=getCurrentWeight(key);return;}
  nw=Math.round(nw*2)/2;
  input.value=nw;
  var arr=DB.weights[key]||[];
  var wasPR=isPR(key,nw,arr);
  var today=todayStr();
  if(arr.length&&arr[arr.length-1].date===today){arr[arr.length-1].val=nw;}
  else{arr.push({date:today,val:nw});}
  DB.weights[key]=arr; DB.weightSetDate[key]=today; saveDB();
  var chip=document.getElementById('chip-w-'+key);
  if(chip) chip.innerHTML='&#x2696;&#xFE0F; '+nw+' '+unite;
  var wdate=document.getElementById('wdate-'+key);
  if(wdate) wdate.textContent='Dernière modif. : '+formatDateFr(today);
  var nudge=document.getElementById('nudge-'+key);
  if(nudge) nudge.classList.remove('show');
  updateRepTargetDisplay(key,nw);
  asSyncOfficialWeight(key,nw);
  if(wasPR){ showPRCelebration(chip,nw,unite); }
  else{ showToast('&#x2705; '+nw+' '+unite+' enregistr\u00e9'); }
}

function previewWeight(input, key, unite) {
  var v = parseFloat(input.value);
  if (isNaN(v) || v < 0) return;
  var chip = document.getElementById('chip-w-' + key);
  if (chip) chip.innerHTML = '&#x2696;&#xFE0F; ' + Math.round(v * 2) / 2 + ' ' + unite;
}

function isPR(key,nw,arr){
  var prev=(arr||DB.weights[key]||[]).filter(function(e){return e.date!==todayStr();});
  if(!prev.length) return false;
  return nw>Math.max.apply(null,prev.map(function(e){return e.val;}));
}

function spawnConfetti(cx,cy){
  var colors=['#71FFB4','#4D9DFF','#FF8452','#C97BFF','#FFC94D'];
  for(var i=0;i<18;i++){
    var dot=document.createElement('div');
    dot.className='confetti-dot';
    dot.style.left=cx+'px'; dot.style.top=cy+'px';
    dot.style.background=colors[i%colors.length];
    var angle=(i/18)*Math.PI*2;
    var dist=60+Math.random()*60;
    dot.style.setProperty('--dx',Math.cos(angle)*dist+'px');
    dot.style.setProperty('--dy',Math.sin(angle)*dist+'px');
    document.body.appendChild(dot);
    setTimeout(function(d){d.remove();},800,dot);
  }
}

function showPRCelebration(el,nw,unite){
  showToast('&#x1F3C6; PR ! '+nw+' '+unite);
  if(el){
    el.classList.add('chip-pr-flash');
    var rect=el.getBoundingClientRect();
    spawnConfetti(rect.left+rect.width/2,rect.top+rect.height/2);
    setTimeout(function(){el.classList.remove('chip-pr-flash');},800);
  }
}

// ══════════════════════════════════════════════════
// SERIES & REST TIMER
// ══════════════════════════════════════════════════
function toggleSet(sid, ei, setIdx, totalSets, exoKey){
  var btn=document.getElementById('set-'+sid+'-'+ei+'-'+setIdx);
  if(!btn) return;
  var wasDone=btn.classList.contains('done');
  btn.classList.toggle('done',!wasDone);
  if(!wasDone){
    // Find rest duration
    var exo=null;
    DATA.forEach(function(s){ s.exos.forEach(function(e){ if(e.key===exoKey) exo=e; }); });
    var rest=exo?exo.rest:60;
    if(setIdx<totalSets){ startTimer(sid,ei,rest); }
    else{ showToast('&#x2705; Toutes les séries terminées !'); }
  } else {
    stopTimer(sid,ei);
  }
}

function startTimer(sid, ei, duration){
  // Stop any running timer
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  var id=sid+'-'+ei;
  timerExoId=id;
  timerEnd=Date.now()+duration*1000;
  updateWorkoutPushTimer(timerEnd,'Repos terminé','Lance ta prochaine série !');
  var timerEl=document.getElementById('timer-'+id);
  if(timerEl) timerEl.classList.add('active');
  var total=duration;
  updateTimerUI(id,duration,total);
  timerInterval=setInterval(function(){
    var rem=Math.ceil((timerEnd-Date.now())/1000);
    if(rem<=0){
      clearInterval(timerInterval); timerInterval=null;
      updateTimerUI(id,0,total);
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
      var msg=document.getElementById('rtm-'+id);
      if(msg) msg.textContent='C\'est parti ! &#x1F4A5;';
      showToast('&#x23F1; Repos terminé — Lance la série !');
      setTimeout(function(){ stopTimer(sid,ei,true); },2000);
    } else {
      updateTimerUI(id,rem,total);
    }
  },500);
}

function updateTimerUI(id, rem, total){
  var el=document.getElementById('rtt-'+id);
  if(el) el.textContent=formatTime(rem);
  var circle=document.getElementById('rtc-'+id);
  if(circle){
    var fg=circle.querySelector('.fg');
    if(fg){
      var pct=rem/total; var circ=113;
      fg.style.strokeDashoffset=String(circ*(1-pct));
      if(rem<=10){ fg.style.stroke='var(--yellow)'; circle.classList.add('urgent'); }
      else{ fg.style.stroke='#71FFB4'; circle.classList.remove('urgent'); }
    }
  }
}

function stopTimer(sid,ei,preservePush){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  if(!preservePush) updateWorkoutPushTimer(null);
  var id=sid+'-'+ei;
  var timerEl=document.getElementById('timer-'+id);
  if(timerEl) timerEl.classList.remove('active');
}

function formatTime(s){ return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60; }

// ══════════════════════════════════════════════════
// LOG / HISTORIQUE
// ══════════════════════════════════════════════════
function buildLogModal(){
  var d=getNow();
  document.getElementById('logDate').value=todayStr();
  var startD=sessionStartTime?new Date(sessionStartTime):d;
  document.getElementById('logTime').value=String(startD.getHours()).padStart(2,'0')+':'+String(startD.getMinutes()).padStart(2,'0');
  var el=document.getElementById('seanceCheckboxes'); el.innerHTML='';
  DATA.forEach(function(s){
    var div=document.createElement('div');
    div.className='sc-check'; div.dataset.sid=s.id;
    var main='<div class="sc-check-main" onclick="toggleScCheck(this.closest(\'.sc-check\'))">'
      +'<span class="sc-check-ico">'+s.icon+'</span>'
      +'<div class="sc-check-info"><span class="sc-check-name">'+s.name+'</span>'
      +'<span class="sc-check-sub">'+s.sub+'</span></div>'
      +'<span class="sc-check-tick">&#x2713;</span>'
      +'</div>';
    var visExos=s.exos.filter(function(e){return !e.hidden;});
    var mainExos=visExos.filter(function(e){return !e.bonus;});
    var bonusExos=visExos.filter(function(e){return e.bonus;});
    if(!s.exos.length){
      div.innerHTML=main;
    } else {
      function exoRow(e){
        return '<div class="sc-exo-item'+(e.bonus?' sc-exo-bonus':'')+'" data-exo="'+e.key+'" onclick="toggleExoSel(event,this)">'+e.name+'</div>';
      }
      var exoItems=mainExos.map(exoRow).join('');
      if(bonusExos.length){
        exoItems+='<div class="sc-exo-sep">Bonus</div>'+bonusExos.map(exoRow).join('');
      }
      div.innerHTML=main
        +'<button class="sc-bonus-btn" onclick="toggleScBonus(event,this)" title="Choisir un ou plusieurs exercices"><span>Exercices</span><span class="sc-bonus-arr">&#x25BE;</span></button>'
        +'<div class="sc-exo-list">'+exoItems+'</div>';
    }
    el.appendChild(div);
  });
}

function toggleScCheck(div){
  div.classList.toggle('sel');
  // La sélection de la séance est indépendante des exos bonus cochés.
}

function toggleScBonus(e, btn){
  e.stopPropagation();
  btn.closest('.sc-check').classList.toggle('bonus-open');
}

function toggleExoSel(e, item){
  e.stopPropagation();
  item.classList.toggle('sel');
  var card=item.closest('.sc-check');
  var anySelected=card.querySelectorAll('.sc-exo-item.sel').length>0;
  card.classList.toggle('partial-sel', anySelected && !card.classList.contains('sel'));
}

function openLogModal(){
  buildLogModal();
  var saveBtn=document.querySelector('#logModal .btn-primary');
  if(saveBtn){saveBtn.disabled=false;saveBtn.innerHTML='Enregistrer ✓';saveBtn.classList.remove('btn-save-anim');}
  // Pre-fill duration if session was started
  var durEl=document.getElementById('logDuration');
  if(durEl){ durEl.value=sessionStartTime?Math.round((Date.now()-sessionStartTime)/60000):''; }
  // Reset ratings
  logEnergy=null; logFeeling=null;
  document.querySelectorAll('#logModal .rating-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('energyLbl').textContent='';
  document.getElementById('feelingLbl').textContent='';
  var detSec=document.getElementById('logDetailsSection');
  var detBtn=document.getElementById('logDetailsToggle');
  if(detSec) detSec.style.display='none';
  if(detBtn) detBtn.classList.remove('open');
  renderTemplateChips();
  document.getElementById('logModal').classList.add('open');
}
function closeLogModal(){
  editingLogId=null;
  document.getElementById('logModal').classList.remove('open');
  document.getElementById('autreCheck').checked=false;
  document.getElementById('autreSport').style.display='none';
  document.getElementById('autreSport').value='';
  logEnergy=null; logFeeling=null;
  document.querySelectorAll('#logModal .rating-btn').forEach(function(b){b.classList.remove('active');});
  var detSec=document.getElementById('logDetailsSection');
  var detBtn=document.getElementById('logDetailsToggle');
  if(detSec) detSec.style.display='none';
  if(detBtn) detBtn.classList.remove('open');
  document.querySelectorAll('#seanceCheckboxes .sc-exo-item.sel').forEach(function(el){ el.classList.remove('sel'); });
  document.querySelectorAll('#seanceCheckboxes .sc-check').forEach(function(c){ c.classList.remove('sel','partial-sel','bonus-open'); });
  if(seanceTimerInterval){ clearInterval(seanceTimerInterval); seanceTimerInterval=null; }
  sessionStartTime=null;
}


function toggleLogDetails(){
  var sec=document.getElementById('logDetailsSection');
  var btn=document.getElementById('logDetailsToggle');
  var open=sec.style.display!=='none';
  sec.style.display=open?'none':'block';
  if(btn) btn.classList.toggle('open',!open);
}

function renderTemplateChips(){
  var wrap=document.getElementById('templateChips');
  if(!wrap) return;
  if(!DB.templates||!DB.templates.length){wrap.style.display='none';return;}
  wrap.style.display='flex';
  wrap.innerHTML=DB.templates.map(function(t,i){
    return '<span class="tpl-chip" onclick="applyTemplate('+i+')">'
      +t.name
      +'<span class="tpl-chip-del" onclick="event.stopPropagation();deleteTemplate('+i+')" title="Supprimer">&#x2715;</span>'
      +'</span>';
  }).join('');
}

function applyTemplate(idx){
  var t=DB.templates[idx]; if(!t) return;
  document.querySelectorAll('#seanceCheckboxes .sc-check').forEach(function(el){
    el.classList.toggle('sel', t.sessions.indexOf(el.dataset.sid)>=0);
  });
}

function saveCurrentAsTemplate(){
  var sessions=[];
  document.querySelectorAll('#seanceCheckboxes .sc-check.sel').forEach(function(el){sessions.push(el.dataset.sid);});
  if(!sessions.length){showToast('&#x26A0; S\u00e9lectionne au moins une s\u00e9ance');return;}
  var name=sessions.map(function(sid){var s=DATA.find(function(x){return x.id===sid;});return s?s.name:sid;}).join(' + ');
  var exists=DB.templates.find(function(t){return t.sessions.join(',')===sessions.join(',');});
  if(exists){showToast('Ce combo existe d\u00e9j\u00e0');return;}
  if(DB.templates.length>=6){showToast('&#x26A0; Maximum 6 templates');return;}
  DB.templates.push({name:name,sessions:sessions});
  saveDB();
  renderTemplateChips();
  showToast('&#x2B50; Template "'+name+'" sauvegard\u00e9');
}

function deleteTemplate(idx){
  DB.templates.splice(idx,1);
  saveDB();
  renderTemplateChips();
}

function toggleAutreSport(){
  var cb=document.getElementById('autreCheck');
  var inp=document.getElementById('autreSport');
  inp.style.display=cb.checked?'block':'none';
}

function saveLog(){
  var date=document.getElementById('logDate').value;
  var time=document.getElementById('logTime').value;
  var comment=document.getElementById('logComment').value.trim();
  var sessions=[];
  document.querySelectorAll('#seanceCheckboxes .sc-check.sel').forEach(function(el){ sessions.push(el.dataset.sid); });
  document.querySelectorAll('#seanceCheckboxes .sc-check:not(.sel) .sc-exo-item.sel').forEach(function(el){ sessions.push('exo:'+el.dataset.exo); });
  var autreCbV=document.getElementById('autreCheck');
  var hasAutre=autreCbV&&autreCbV.checked&&document.getElementById('autreSport').value.trim().length>0;
  if(!date||(sessions.length===0&&!hasAutre)){ showToast('&#x26A0; Choisis une s\u00e9ance ou renseigne un autre sport'); return; }
  var autreCb=document.getElementById('autreCheck');
  if(autreCb&&autreCb.checked){
    var autreSportVal=document.getElementById('autreSport').value.trim();
    if(autreSportVal) sessions.push('autre:'+autreSportVal);
  }
  var durEl=document.getElementById('logDuration');
  var durMin=durEl&&durEl.value?parseInt(durEl.value):null;
  if(durMin&&(isNaN(durMin)||durMin<=0)) durMin=null;
  var logId;
  if(editingLogId){
    logId=editingLogId;
    DB.logs=DB.logs.filter(function(l){return String(l.id)!==String(editingLogId);});
    editingLogId=null;
  } else {
    var existingSessions=[];
    DB.logs.filter(function(l){return l.date===date;}).forEach(function(l){existingSessions=existingSessions.concat(l.sessions);});
    var overlap=sessions.filter(function(s){return s.indexOf("autre:")<0&&existingSessions.indexOf(s)>=0;});
    if(overlap.length){
      var names=overlap.map(function(sid){var s=DATA.find(function(x){return x.id===sid;});return s?s.name:sid;}).join(", ");
      if(!confirm('Tu as déjà une séance "'+names+'" enregistrée ce jour. Continuer quand même ?')) return;
    }
    logId=Date.now();
  }
  DB.logs.push({id:logId,date:date,time:time,sessions:sessions,comment:comment,feeling:logFeeling||null,energy:logEnergy||null,duration_min:durMin||null});
  DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time));});
  saveDB();
  var saveBtn=document.querySelector('#logModal .btn-primary');
  if(saveBtn){saveBtn.disabled=true;saveBtn.innerHTML='&#x2705; Enregistr\u00e9\u00a0!';saveBtn.classList.add('btn-save-anim');}
  setTimeout(function(){
    closeLogModal();
    document.getElementById('logComment').value='';
    var durElSave=document.getElementById('logDuration');if(durElSave) durElSave.value='';
    renderHisto();
    try{ checkReminders(); }catch(e){}
    showToast('\u2705 S\u00e9ance enregistr\u00e9e !');
  },550);
}

function deleteLog(id){
  var sid=String(id);
  var deleted=DB.logs.find(function(l){return String(l.id)===sid;});
  DB.logs=DB.logs.filter(function(l){return String(l.id)!==sid;});
  // Tombstone (12/08) : sans elle, la s\u00e9ance revient du cloud au prochain chargement
  if(!DB.deletedLogs) DB.deletedLogs=[];
  if(DB.deletedLogs.indexOf(sid)<0) DB.deletedLogs.push(sid);
  saveDB(); renderHisto();
  closeDayModal();
  if(deleted){
    showToast('S\u00e9ance supprim\u00e9e', function(){
      DB.logs.push(deleted);
      DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time));});
      DB.deletedLogs=(DB.deletedLogs||[]).filter(function(x){return x!==sid;});
      saveDB(); renderHisto();
      showToast('\u21A9 S\u00e9ance restaur\u00e9e');
    });
  }
}

// ══════════════════════════════════════════════════
// CALENDAR
// ══════════════════════════════════════════════════
function calPrev(){ calMonth2--; if(calMonth2<0){calMonth2=11;calYear--;} renderCal(); }
function calNext(){ calMonth2++; if(calMonth2>11){calMonth2=0;calYear++;} renderCal(); }

function renderCal(){
  var months=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('calMonth').textContent=months[calMonth2]+' '+calYear;
  var grid=document.getElementById('calGrid'); grid.innerHTML='';
  ['L','M','M','J','V','S','D'].forEach(function(d){ var el=document.createElement('div'); el.className='cal-day-name'; el.textContent=d; grid.appendChild(el); });
  var first=new Date(calYear,calMonth2,1).getDay(); // 0=Sun
  var offset=(first===0)?6:first-1;
  var days=new Date(calYear,calMonth2+1,0).getDate();
  var today=todayStr();
  var sessionMap={}, runDays={};
  DB.logs.forEach(function(l){ if(!sessionMap[l.date]) sessionMap[l.date]=[]; sessionMap[l.date]=sessionMap[l.date].concat(l.sessions); if(cardioLogHasRun(l)) runDays[l.date]=true; });
  // 04/09 (demande Adrien) : plus de trous en début/fin de mois — les cases des semaines à cheval
  // affichent les VRAIS jours du mois d'avant/d'après (grisés .other, mêmes couleurs, cliquables).
  var trail=(7-(offset+days)%7)%7;
  for(var i=1-offset;i<=days+trail;i++){
    var dt=new Date(calYear,calMonth2,i);
    var other=dt.getMonth()!==calMonth2;
    var d=dt.getDate();
    var dateStr=dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var el=document.createElement('div');
    var sessions=sessionMap[dateStr];
    var cls='cal-day'+(dateStr===today?' today':'')+(other?' other':'');
    var frozen=false;
    try{ frozen=rankInPause(dateStr); }catch(e){}
    if(frozen) cls+=' day-frozen'; // jour en mode gel : style glace ❄
    if(sessions){
      cls+=' has-session';
      if(sessions.length>=2) cls+=' day-hi';
      // Une séance complète cochée (PUSH/PULL/LEGS) impose TOUJOURS sa couleur.
      // La comparaison exo vs exo ne joue que les jours sans séance complète.
      var seanceTypes=sessions.map(function(sid){
        if(sid.indexOf('exo:')===0||sid.indexOf('autre:')===0||sid==='sb') return null;
        var s=DATA.find(function(x){return x.id===sid;});return s?s.t:null;
      }).filter(Boolean);
      var exoTypes=sessions.map(function(sid){
        if(sid.indexOf('exo:')!==0) return null;
        var info=findExoIndex(sid.slice(4)); return info?info.seance.t:null;
      }).filter(Boolean);
      var types=seanceTypes.length?seanceTypes:exoTypes;
      var pushC=types.filter(function(t){return t==='push';}).length;
      var pullC=types.filter(function(t){return t==='pull'||t==='pull2';}).length;
      var legsC=types.filter(function(t){return t==='legs';}).length;
      var hasMaisonAutre=sessions.some(function(sid){return sid==='sb'||sid.indexOf('autre:')===0;})||types.indexOf('bonus')>=0;
      if(pushC>pullC&&pushC>legsC) cls+=' day-push';
      else if(pullC>pushC&&pullC>legsC) cls+=' day-pull';
      else if(legsC>pushC&&legsC>pullC) cls+=' day-legs';
      // Course seule ce jour-là (12/10) : jaune électrique ; avec une séance salle → pastille 🏃
      else if(runDays[dateStr]&&pushC===0&&pullC===0&&legsC===0&&!sessions.some(function(sid){return sid==='sb'||(sid.indexOf('autre:')===0&&sid!=='autre:Course');})) cls+=' day-course';
      else if(hasMaisonAutre&&pushC===0&&pullC===0&&legsC===0) cls+=' day-maison';
    }
    el.className=cls;
    el.textContent=d;
    if(frozen){ var fk=document.createElement('span'); fk.className='cd-frost'; fk.innerHTML='&#x2744;'; el.appendChild(fk); }
    if(runDays[dateStr]&&cls.indexOf('day-course')<0){ var rk=document.createElement('span'); rk.className='cd-run'; rk.innerHTML='&#x1F3C3;'; el.appendChild(rk); }
    // Étirements du jour (espace Détente) : petite bulle 🧘 compacte — la couleur de la case ne change pas
    var stretched=dzDayDone(dateStr); // étirements de séance OU routine matin/soir (26/08)
    if(stretched){ var zk=document.createElement('span'); zk.className='cd-zen'; zk.innerHTML='&#x1F9D8;'; el.appendChild(zk); }
    // 02/11 : tout jour passé est cliquable (la nutrition du jour s'affiche même sans séance)
    if(sessionMap[dateStr]||frozen||stretched||dateStr<=today){
      el.dataset.date=dateStr;
      el.addEventListener('click',function(){ showDayModal(this.dataset.date); });
    }
    grid.appendChild(el);
  }
}

// Détail complet d'une séance en direct (modal jour) : exos, séries, notes /5, /20.
// Règle annexes : principaux toujours affichés ; bonus/ajoutés seulement si ≥2 séries
// (ou complétés), jamais présentés comme des échecs.
function liveLogDetailHtml(l){
  if(!l.live||!(l.live.exos||[]).length) return '';
  var exos=l.live.exos;
  var noted=liveNotedExos(exos);
  // Note /20 : la note GRAVÉE (03/11 — le recalcul affichait 12/20 sous un 16/20 gravé) ; recalcul seulement pour les vieux logs
  var g=0;
  if(noted.length){
    var _gv=liveLogNote20(l);
    g=_gv!=null?_gv:asNote20From(exos,l.live.context,l.date);
  }
  var rows='';
  exos.forEach(function(x){
    var side=liveExoSide(x);
    var counted=liveExoCounted(x);
    var sets=x.sets||[];
    if(side&&!sets.length) return; // annexe jamais commencé → pas dans l'historique
    if(!side&&!sets.length&&x.status==='skipped') {
      rows+='<div class="dld-row"><span class="dld-name" style="color:var(--mut)">'+getExoName(x.key)+'</span><span class="dld-tag" style="color:var(--mut)">passé</span></div>';
      return;
    }
    // Cardio détaillé (19/10) : type de machine, paliers et stats au lieu de « 20 min »
    if(x.cardio&&sets.length){
      var _cr=x.cardio.res||cardioCalc(x.cardio,getProfileBodyWeight());
      rows+='<div class="dld-row"><span class="dld-name">'+cardioType(x.cardio.type).ico+' '+cardioType(x.cardio.type).name+'</span>'
        +'<span class="dld-tag" style="color:var(--mut)">'+(_cr.kcal?_cr.kcal+' kcal':'cardio')+'</span>'
        +'<div class="dld-sets">'+cardioSummary(x.cardio).split(' &#xB7; ').slice(1).join(' &#xB7; ')+'<br><span style="color:var(--mut)">'+cardioSegsTxt(x.cardio)+'</span></div></div>';
      return;
    }
    var setsTxt=fmtSetsW(x,sets);
    // Exos abdo : tag violet OTHERS + 🔥 au lieu de l'étoile (06/08, demande Adrien)
    var infA=findExoIndex(x.key);
    var isAbdo=!!(infA&&infA.exo&&infA.exo.cat==='abdo');
    var right='';
    if(side&&!counted){
      right='<span class="dld-tag" style="color:'+(isAbdo?'#9B8CFF':'var(--yellow)')+'">'+(isAbdo?'🔥':'⭐')+' bonus · '+sets.length+' série'+(sets.length>1?'s':'')+'</span>';
    } else {
      // la note /5 garde ses couleurs de score pour TOUS les exos (retour Adrien 06/08)
      var sc=asScoreExo(x);
      var col=sc>=4?'var(--acc)':sc>=2.5?'var(--yellow)':'var(--red)';
      right='<span class="dld-tag" style="color:'+col+';font-weight:800">'+String(sc).replace('.',',')+'<small style="font-weight:500;color:var(--mut)">/5</small></span>';
    }
    rows+='<div class="dld-row">'
      +'<span class="dld-name">'+(side?(isAbdo?'🔥 ':'⭐ '):'')+getExoName(x.key)+(counted&&x.status==='skipped'&&sets.length<(x.n||3)?' <small style="color:var(--mut)">'+(x.pain?'(arrêt douleur, compté)':'(écourté, compté)')+'</small>':'')+'</span>'
      +right
      +'<div class="dld-sets">'+(setsTxt||(x.w+' '+x.unite))+'</div>'
      +'</div>';
  });
  if(!rows) return '';
  var rpLine='',evLines='';
  if(FEATURE_RANK) try{
    var r=rankSeanceRP(l);
    rpLine=' &middot; <strong style="color:var(--acc)">+'+Math.max(1,Math.round(r.total/LADDER_ECO.seanceDiv))+' RP</strong>'
      +' <span style="color:var(--mut);font-weight:600">'+r.total.toLocaleString('fr-FR')+' pts d\'activit&#xE9;</span>';
    // Détail bonus / malus de la séance (demande Adrien 01/08)
    if(r.events&&r.events.length){
      evLines='<div class="dld-events">';
      r.events.slice(0,10).forEach(function(ev){
        evLines+='<div class="dld-ev'+(ev.rp<0?' neg':'')+'"><span>'+ev.ico+' '+ev.label+'</span><b>'+(ev.rp>0?'+':'')+ev.rp+'</b></div>';
      });
      evLines+='</div>';
    }
  }catch(e){}
  var ctxMap={temps:'&#x23F0; manque de temps',blessure:'&#x1FA79; blessure/douleur',energie:'&#x1F634; &#xE9;nergie/sommeil',malade:'&#x1F912; malade'};
  var ctxLine=(l.live.context&&ctxMap[l.live.context])?'<div style="font-size:.64rem;color:var(--yellow);margin-bottom:.4rem;">Contexte d&#xE9;clar&#xE9; : '+ctxMap[l.live.context]+' &#x2014; malus compens&#xE9;s</div>':'';
  var coachLine=l.live.coachNote?'<div class="dld-coach">'+l.live.coachNote+'</div>':'';
  return '<div class="dld-note">Note de séance <strong style="color:var(--txt)">'+g+'<small style="color:var(--mut)">/20</small></strong>'+rpLine+'</div>'+coachLine+ctxLine+evLines+rows;
}
function toggleLiveDetail(id){
  var el=document.getElementById('dld-'+id); if(!el) return;
  var open=el.style.display!=='none';
  el.style.display=open?'none':'';
  var arr=document.getElementById('dlda-'+id);
  if(arr&&arr.parentNode) arr.parentNode.classList.toggle('open',!open); // chevron qui pivote (CSS)
}

function showDayModal(date){
  var logs=DB.logs.filter(function(l){return l.date===date;});
  var frozen=false; try{ frozen=rankInPause(date); }catch(e){}
  var sub='';
  if(frozen) sub='\u2744 jour gel\u00e9';
  else if(!logs.length) sub='aucune s\u00e9ance';
  document.getElementById('dayModalTitle').innerHTML=
    '<div class="dm-date"><span class="dm-date-day">'+formatDateFr(date)+'</span>'
    +(sub?'<span class="dm-date-sub">'+sub+'</span>':'')+'</div>'
    +'<button class="modal-close hc-close" onclick="closeDayModal()">\u2715</button>';
  var html='';
  logs.forEach(function(l){
    // Course / autre sport (12/10) : carte dédiée avec toutes les stats (module sport.js)
    if(l.sport&&typeof SPORT!=='undefined'){ html+=SPORT.dayCardHtml(l); return; }
    // ── Normalisation : si TOUS les principaux d'une séance sont là en exos à la carte,
    // on affiche la chip de LA séance à la place (fix « 3 exos jambes ≠ séance LEGS ») ──
    var sess=(l.sessions||[]).slice();
    var exoKeys=sess.filter(function(x){return x.indexOf('exo:')===0;}).map(function(x){return x.slice(4);});
    DATA.forEach(function(sd){
      if(sd.id==='sb'||sess.indexOf(sd.id)>=0) return;
      var mains=sd.exos.filter(function(e){return !e.hidden&&!e.bonus;}).map(function(e){return e.key;});
      if(mains.length&&mains.every(function(k){return exoKeys.indexOf(k)>=0;})){
        sess=sess.filter(function(x){return !(x.indexOf('exo:')===0&&mains.indexOf(x.slice(4))>=0);});
        sess.unshift(sd.id);
      }
    });
    var chips='';
    sess.forEach(function(sid){
      if(sid.indexOf('autre:')==0){
        chips+='<span class="chip chip-maison">&#x1F938; '+sid.replace('autre:','')+'</span>';
      } else if(sid==='sb'){
        var sm=DATA.find(function(x){return x.id==='sb';});
        chips+='<span class="chip chip-maison">'+(sm?sm.icon:'&#x1F3E0;')+' '+(sm?sm.name:'MAISON')+'</span>';
      } else if(sid.indexOf('exo:')==0){
        var exoKey=sid.replace('exo:','');
        var exoParent=null,exoDef=null;
        DATA.forEach(function(ds){ds.exos.forEach(function(e){if(e.key===exoKey){exoParent=ds;exoDef=e;}});});
        if(exoParent){
          // pills : exo abdo = violet OTHERS (06/08, demande Adrien), le reste = couleur de sa séance
          var tc=(exoDef&&exoDef.cat==='abdo')?'maison':(exoParent.t==='pull2'?'pull':exoParent.t);
          chips+='<span class="chip chip-'+tc+'">'+getExoName(exoKey)+'</span>';
        }
        else{chips+='<span class="chip" style="background:rgba(77,157,255,.1);color:var(--acc2)">'+getExoName(exoKey)+'</span>';}
      } else {
        var s=DATA.find(function(x){return x.id===sid;});
        if(s){ var tc=s.t==='pull2'?'pull':s.t; chips+='<span class="chip chip-'+tc+'">'+s.icon+' '+s.name+'</span>'; }
      }
    });
    // Type dominant de la séance → accent couleur de la carte
    var _tc='';
    sess.forEach(function(sid){
      if(_tc) return;
      if(sid==='sb'||sid.indexOf('autre:')===0){ _tc='maison'; return; }
      if(sid.indexOf('exo:')===0){ var inf=findExoIndex(sid.slice(4)); if(inf) _tc=inf.seance.t==='pull2'?'pull':inf.seance.t; return; }
      var sd=DATA.find(function(x){return x.id===sid;}); if(sd) _tc=sd.t==='pull2'?'pull':sd.t;
    });
    if(_tc==='bonus') _tc='maison';
    // Héros (15/08, demande Adrien) : la NOTE /20 gravée de la séance — les RP/pts ne
    // s'affichent que si le rank est réactivé (FEATURE_RANK).
    var pts=0,ptsRP=0,ptsManual=false;
    if(FEATURE_RANK) try{ var _rp=rankSeanceRP(l); pts=_rp.total; ptsManual=!!_rp.manual; ptsRP=pts>0?Math.max(1,Math.round(pts/LADDER_ECO.seanceDiv)):0; }catch(e){}
    var note=liveLogNote20(l);
    var meta=['&#x1F551; '+l.time];
    if(l.duration_min) meta.push('&#x23F1; '+l.duration_min+' min');
    if(l.energy) meta.push('&#x26A1; '+l.energy+'/5');
    if(l.feeling) meta.push('&#x2B50; '+l.feeling+'/5');
    var liveLine='',detailBlock='';
    if(l.live){
      var _eng=liveEngagedExos(l.live.exos||[]);
      var _dn=_eng.filter(function(x){return x.status==='done'||liveExoCounted(x);}).length;
      var _sk=_eng.filter(function(x){return x.status==='skipped'&&!liveExoCounted(x);}).length;
      var _st=(l.live.exos||[]).reduce(function(a,x){return a+(x.sets?x.sets.length:0);},0);
      liveLine='<div class="dm-live">&#x25B6; LiveUp &middot; '+_dn+' exo'+(_dn>1?'s':'')+' &middot; '+_st+' s&#xE9;ries'
        +(_sk?' &middot; '+_sk+' pass&#xE9;'+(_sk>1?'s':''):'')
        +(function(){ var _pp=liveLogPains(l.live); return _pp.length?' &middot; &#x1FA79; '+painZonesTxt(_pp):''; })()+'</div>';
      var _detail=liveLogDetailHtml(l);
      if(_detail){
        detailBlock='<button class="dld-toggle" onclick="toggleLiveDetail(\''+l.id+'\')">D&#xE9;tail de la s&#xE9;ance <span id="dlda-'+l.id+'" aria-hidden="true">&#x203A;</span></button>'
          +'<div class="dld-body" id="dld-'+l.id+'" style="display:none">'+_detail+'</div>';
      }
    }
    var canResume=!!l.live&&l.date===todayStr();
    var hasLive=!!(l.live&&(l.live.exos||[]).length);
    var _cdx=note===null&&l.live?(l.live.exos||[]).find(function(x){ return x.cardio&&(x.sets||[]).length; }):null;
    var _cdr=_cdx?(_cdx.cardio.res||cardioCalc(_cdx.cardio,getProfileBodyWeight())):null;
    html+='<div class="hc-log'+(_tc?' dm-t-'+_tc:'')+'">'
      +'<div class="hc-chips">'+chips+'</div>'
      +'<div class="hc-hero">'
      +(_cdx
        ?'<div class="hc-pts"><span class="hc-pts-v sp-km'+(_cdx.cardio.type==='course'?'':' cd-kc')+'">'+(_cdr.km?cardioFr(_cdr.km,2)+'<small> km</small>':_cdr.kcal+'<small> kcal</small>')+'</span>'
          +'<span class="hc-pts-l">'+cardioType(_cdx.cardio.type).ico+' '+cardioType(_cdx.cardio.type).name+' &#xB7; hors note</span></div>'
      :note!==null
        ?'<div class="hc-pts"><span class="hc-pts-v '+note20Cls(note)+'">'+note+'<small style="font-size:.42em;font-weight:800;color:var(--mut);"> /20</small></span>'
          +'<span class="hc-pts-l">'+(note>=18?'&#x1F3C6; s&#xE9;ance en or':note>=14?'&#x1F4AA; grosse s&#xE9;ance':note>=11?'&#x2705; s&#xE9;ance solide':note>=8?'&#x1F615; s&#xE9;ance en retrait':'&#x1F6A8; s&#xE9;ance rat&#xE9;e')+'</span></div>'
        :'<div class="hc-pts"><span class="hc-pts-v" style="font-size:1.1rem;color:var(--mut);">s&#xE9;ance manuelle</span><span class="hc-pts-l">pas de d&#xE9;tail s&#xE9;rie par s&#xE9;rie</span></div>')
      +(FEATURE_RANK?'<div class="hc-note"><span class="hc-note-v">'+(ptsRP>0?'+':'')+ptsRP+'</span><span class="hc-note-l">RP'+(ptsManual?' &#xB7; forfait':'')+'</span></div>':'')
      +'</div>'
      +'<div class="hc-meta">'+meta.join('&#x2002;&#xB7;&#x2002;')+'</div>'
      +(l.comment?'<div class="dm-comment">&#xAB;&#x202F;'+l.comment+'&#x202F;&#xBB;</div>':'')
      +liveLine
      +detailBlock
      +'<div class="dm-actrow">'
      +(canResume?'<button class="dm-resume" onclick="asResumeLog(\''+l.id+'\')">&#x25B6; Reprendre</button>':'')
      +(hasLive?'<button class="dm-report" onclick="asViewReport(\''+l.id+'\')">&#x1F4CA; Bilan</button>':'')
      +'<button class="dle-edit" data-id="'+l.id+'">&#x270E; Modifier</button>'
      +'<button class="dle-del" data-id="'+l.id+'" title="Supprimer">&#x1F5D1;</button>'
      +'</div>'
      +'</div>';
  });
  // Jour gelé : bannière + dégel (même sans séance)
  var frozenBanner='';
  if(frozen){
    var _p=((DB.rank&&DB.rank.pauses)||[]).find(function(p){return p.start<=date&&date<=p.end;});
    frozenBanner='<div class="dm-frozen">&#x2744; Jour gel&#xE9;'+(_p?(_p.type==='blessure'?' &#xB7; &#x1FA79; blessure':' &#xB7; &#x1F3D6; vacances'):'')+' &#x2014; rank prot&#xE9;g&#xE9;, z&#xE9;ro malus'
      +'<button class="dm-unfreeze" onclick="delRankPauseByDate(\''+date+'\')">D&#xE9;geler</button></div>';
  }
  var nutHtml=(typeof INTAKE!=='undefined')?INTAKE.dayCardHtml(date):'';
  if(!logs.length&&!frozen&&!nutHtml&&!dzDayDone(date)){
    html='<div class="dm-empty">Rien ce jour-l&#xE0;.</div>';
  }
  html+=nutHtml;
  // Étirements du jour (espace Détente) — carte compacte sous les séances
  if(dzDayDone(date)){
    var _dz=DB.dz[date], _zl=[];
    if(_dz.stretch) _zl.push('<strong>&#xC9;tirements de s&#xE9;ance</strong>'+(_dz.stCt?' <span class="dm-zen-sub">plan sur '+_dz.stCt+' exercices</span>':''));
    if(_dz.am) _zl.push('&#x2600;&#xFE0F; <strong>Routine du matin</strong>');
    if(_dz.pm) _zl.push('&#x1F319; <strong>Routine du soir</strong>');
    html+='<div class="dm-zen">&#x1F9D8; '+_zl.join(' &#xB7; ')+'</div>';
  }
  document.getElementById('dayModalContent').innerHTML=frozenBanner+html;
  // (12/10) data-id sur chaque bouton : les cartes sport ont leur propre formulaire de modification
  document.querySelectorAll('#dayModalContent .dle-del').forEach(function(btn,i){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      deleteLog(btn.dataset.id||logs[i].id);
    });
  });
  document.querySelectorAll('#dayModalContent .dle-edit').forEach(function(btn,i){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      closeDayModal();
      var id=btn.dataset.id||logs[i].id;
      var lg=DB.logs.find(function(x){return String(x.id)===String(id);});
      if(lg&&lg.sport&&typeof SPORT!=='undefined') SPORT.edit(lg.id); else edOpen(id);
    });
  });
  document.getElementById('dayModal').classList.add('open');
}
function closeDayModal(){ document.getElementById('dayModal').classList.remove('open'); }

function renderHisto(){
  renderCal();
  renderNoTrainingBanner();
  var el=document.getElementById('logSummary');
  if(!el) return;
  var now=getNow();
  var mstart=new Date(now.getFullYear(),now.getMonth(),1);
  var thisMonth=DB.logs.filter(function(l){return new Date(l.date)>=mstart;}).length;
  var total=DB.logs.length;
  if(!total){
    el.innerHTML='<div class="empty-state"><div class="empty-state-ico">&#x1F4C5;</div><div class="empty-state-title">Aucune séance encore</div><div class="empty-state-sub">Enregistre ta première séance pour commencer !</div><button class="empty-state-btn" onclick="edOpen(null)">+ Enregistrer une séance</button></div>';
    return;
  }
  var months=['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  el.innerHTML='<div class="log-summary-grid">'
    +'<div class="ls-card accent"><div class="ls-val">'+thisMonth+'</div><div class="ls-lbl">ce mois ('+months[now.getMonth()]+')</div></div>'
    +'<div class="ls-card"><div class="ls-val">'+total+'</div><div class="ls-lbl">séances au total</div></div>'
    +'</div>';
}

// ══════════════════════════════════════════════════
// CHARTS & STATS
// ══════════════════════════════════════════════════
var _allChartOptions=[];
function buildChartSelect(){
  var all=[];
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!e.hidden&&!all.find(function(x){return x.key===e.key;})) all.push({key:e.key,name:e.name}); }); });
  EXTRAS.forEach(function(e){ if(!all.find(function(x){return x.key===e.key;})) all.push({key:e.key,name:e.name}); });
  all.sort(function(a,b){
    var aArr=DB.weights[a.key]||[]; var bArr=DB.weights[b.key]||[];
    var aD=aArr.length?aArr[aArr.length-1].date:''; var bD=bArr.length?bArr[bArr.length-1].date:'';
    return bD.localeCompare(aD);
  });
  _allChartOptions=all;
  _renderChartOptions('');
}

function _renderChartOptions(filter){
  var sel=document.getElementById('chartSelect'); sel.innerHTML='';
  var q=filter.toLowerCase().trim();
  var list=q?_allChartOptions.filter(function(e){return e.name.toLowerCase().indexOf(q)>=0;}):_allChartOptions;
  list.forEach(function(e){var opt=document.createElement('option');opt.value=e.key;opt.textContent=e.name;sel.appendChild(opt);});
  renderWeightChart();
}

function filterChartSelect(val){ _renderChartOptions(val); }

function getExoName(key){
  var found=null;
  DATA.forEach(function(s){s.exos.forEach(function(e){if(e.key===key) found=e.name;});});
  if(!found) EXTRAS.forEach(function(e){if(e.key===key) found=e.name;});
  return found||key;
}

function renderWeightChart(){
  if(typeof Chart==='undefined') return;
  var key=document.getElementById('chartSelect').value;
  var arr=DB.weights[key]||[];
  var wrap=document.getElementById('weightChart').parentElement;
  var empty=document.getElementById('weightChartEmpty');
  var alertEl=document.getElementById('weightAlert');
  var statsEl=document.getElementById('weightStats');
  if(!arr.length){
    if(wrap) wrap.style.display='none';
    if(empty) empty.style.display='block';
    if(alertEl) alertEl.innerHTML='';
    if(statsEl) statsEl.style.display='none';
    var sc0=document.getElementById('exoStatsCard'); if(sc0) sc0.innerHTML='';
    return;
  }
  if(wrap) wrap.style.display='block';
  if(empty) empty.style.display='none';
  // Build stats row
  if(statsEl){
    var first=arr[0].val;
    var cur=arr[arr.length-1].val;
    var gain=Math.round((cur-first)*10)/10;
    var gainStr=(gain>0?'+':'')+gain+' kg';
    // Assistances (traction/dips assistée) : moins = mieux → une baisse est verte (01/11, demande Adrien)
    var _inv=asIsInverse(key), good=function(d){ return _inv?d<0:d>0; }, bad=function(d){ return _inv?d>0:d<0; };
    var gainColor=good(gain)?'var(--acc)':bad(gain)?'var(--red)':'var(--mut)';
    var oneMonthAgo=new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
    var monthEntry=null; var minDiff=Infinity;
    arr.forEach(function(x){var diff=Math.abs(new Date(x.date)-oneMonthAgo);if(diff<minDiff){minDiff=diff;monthEntry=x;}});
    var monthDiff=monthEntry&&monthEntry.date!==arr[arr.length-1].date?Math.round((cur-monthEntry.val)*10)/10:null;
    var monthStr=monthDiff!==null?(monthDiff>0?'+':'')+monthDiff+' kg':'—';
    var monthColor=monthDiff!==null?(good(monthDiff)?'var(--acc)':bad(monthDiff)?'var(--red)':'var(--mut)'):'var(--mut)';
    statsEl.style.display='grid';
    statsEl.innerHTML='<div class="wsr-card"><div class="wsr-val">'+cur+' <span class="wsr-unit">kg</span></div><div class="wsr-lbl">'+(_inv?'assistance actuelle':'actuel')+'</div></div>'
      +'<div class="wsr-card"><div class="wsr-val" style="color:'+monthColor+'">'+monthStr+'</div><div class="wsr-lbl">ce mois</div></div>'
      +'<div class="wsr-card"><div class="wsr-val" style="color:'+gainColor+'">'+gainStr+'</div><div class="wsr-lbl">total</div></div>'
      +'<div class="wsr-card"><div class="wsr-val">'+arr.length+'</div><div class="wsr-lbl">mesure'+(arr.length>1?'s':'')+'</div></div>';
  }
  var labels=arr.map(function(x){return formatDateShort(x.date);});
  var vals=arr.map(function(x){return x.val;});
  _weightChartArr = arr;
  var ctx=document.getElementById('weightChart').getContext('2d');
  if(weightChart){
    weightChart.data.labels = labels;
    weightChart.data.datasets[0].data = vals;
    weightChart.update('none');
  } else {
    weightChart=new Chart(ctx,{
      type:'line',
      data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#71FFB4',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return formatDateFr(_weightChartArr[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var a=_weightChartArr;var i=c.dataIndex;if(!i)return'';var delta=Math.round((c.parsed.y-a[i-1].val)*10)/10;var days=Math.round((new Date(a[i].date)-new Date(a[i-1].date))/86400000);var t=days>=14?Math.round(days/7)+' sem.':days+'j';return(delta>=0?'+':'')+delta+' kg en '+t;}}}},scales:{x:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  }
  // Weight entry history list
  var histEl=document.getElementById('weightHistory');
  if(histEl){
    var sorted=arr.slice().reverse();
    var listHtml='<div class="wh-toggle" id="whToggle" onclick="toggleWeightHistory()">'
      +'<span class="wh-toggle-arr">&#x25B8;</span> Historique ('+arr.length+' entr\u00e9e'+(arr.length>1?'s':'')+')'
      +'</div>'
      +'<div class="expand-anim" id="whListWrap">'
      +'<div class="wh-list" id="whList">';
    sorted.forEach(function(entry){
      listHtml+='<div class="wh-entry">'
        +'<span class="wh-entry-date"><input class="wh-entry-dinp" type="date" value="'+entry.date+'" max="'+todayStr()+'" onchange="editWeightDate(\''+key+'\',\''+entry.date+'\',this)" aria-label="Date de cette charge"/></span>'
        +'<span class="wh-entry-val"><input class="wh-entry-input" type="number" step="0.5" min="0" value="'+entry.val+'" onblur="editWeightEntry(\''+key+'\',\''+entry.date+'\',this)" onkeydown="if(event.key===\'Enter\')this.blur()"/> kg</span>'
        +'<button class="wh-entry-del" onclick="deleteWeightEntry(\''+key+'\',\''+entry.date+'\')" title="Supprimer cette entrée">&#x2715;</button>'
        +'</div>';
    });
    listHtml+='</div><div class="wh-edit-hint">&#x270F;&#xFE0F; Touche une date ou une valeur pour corriger (ex. une charge que tu fais depuis plus longtemps)</div></div>';
    histEl.innerHTML=listHtml;
  }
  // Alerte basée sur le nombre de séances au même poids
  if(alertEl){
    var nu=getProgressNudge(key);
    if(nu){
      alertEl.innerHTML='<div class="weight-inline-alert"><div class="wia-ico">'+(nu.lvl==='hot'?'&#x1F534;':'&#x26A0;')+'</div><div>'
        +'<strong>'+getExoName(key)+'</strong> — '+nu.msg+'</div></div>';
    } else { alertEl.innerHTML=''; }
  }
}

function toggleWeightHistory(){
  var wrap=document.getElementById('whListWrap');
  var toggle=document.getElementById('whToggle');
  if(!wrap) return;
  var open=!wrap.classList.contains('open');
  wrap.classList.toggle('open',open);
  if(toggle) toggle.classList.toggle('open',open);
}

function editWeightEntry(key, date, input){
  var arr=DB.weights[key]||[];
  var entry=arr.find(function(x){return x.date===date;});
  if(!entry) return;
  var nw=parseFloat(input.value);
  if(isNaN(nw)||nw<0){ input.value=entry.val; return; }
  nw=Math.round(nw*2)/2;
  if(nw===entry.val){ input.value=nw; return; }
  entry.val=nw;
  DB.weights[key]=arr;
  saveDB();
  // Rafraîchit le panneau exo si visible
  var newCur=arr[arr.length-1].val;
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=newCur; else wval.textContent=newCur; }
  var chip=document.getElementById('chip-w-'+key);
  if(chip){ var ex=findExoIndex(key); if(ex) chip.innerHTML='&#x2696;&#xFE0F; '+newCur+' '+ex.exo.unite; }
  renderWeightChart();
  try{ renderProgressionTable(); renderObjectifs(); }catch(e){}
  showToast('&#x2705; '+formatDateFr(date)+' corrigé : '+nw+' kg');
}

// Corriger la DATE d'une entrée (01/11, demande Adrien : « pec deck 54 mis aujourd'hui, mais je le fais
// depuis mi-septembre »). L'entrée change de jour ; l'ancien jour reçoit une tombstone et sa ligne cloud
// est effacée (même chemin qu'une suppression), sinon la synchro le ressusciterait.
function editWeightDate(key, oldDate, input){
  var nd=input.value, arr=DB.weights[key]||[];
  var entry=arr.find(function(x){return x.date===oldDate;});
  if(!entry||!/^\d{4}-\d{2}-\d{2}$/.test(nd||'')||nd===oldDate){ input.value=oldDate; return; }
  if(nd>todayStr()){ input.value=oldDate; showToast('&#x26A0; Pas de date dans le futur'); return; }
  if(arr.some(function(x){return x.date===nd;})){ input.value=oldDate; showToast('&#x26A0; Il y a d&#xE9;j&#xE0; une entr&#xE9;e le '+formatDateFr(nd)+' &#x2014; corrige ou supprime-la d\'abord'); return; }
  entry.date=nd;
  arr.sort(function(a,b){return a.date.localeCompare(b.date);});
  DB.weights[key]=arr; DB.weightSetDate[key]=arr[arr.length-1].date;
  if(!DB.deletedWeights) DB.deletedWeights={};
  var tomb=DB.deletedWeights[key]||(DB.deletedWeights[key]=[]);
  if(tomb.indexOf(oldDate)<0) tomb.push(oldDate);
  DB.deletedWeights[key]=tomb.filter(function(d){return d!==nd;}); // le nouveau jour ne doit pas rester « supprimé »
  saveDB();
  whCloudDelete(key,oldDate);
  renderWeightChart();
  try{ buildSeances(); }catch(e){}
  showToast('&#x2705; '+entry.val+' kg d&#xE9;plac&#xE9; au '+formatDateFr(nd));
}
// Efface une ligne weight_history du cloud puis retire la tombstone une fois confirmé
function whCloudDelete(key,date){
  if(typeof sbClient==='undefined'||!sbClient) return;
  sbClient.auth.getUser().then(function(res){
    var userId=res.data&&res.data.user&&res.data.user.id;
    if(!userId) return;
    sbClient.from('weight_history').delete()
      .eq('user_id',userId).eq('exercise_id',key).eq('recorded_at',date)
      .then(function(r){
        if(r&&r.error){ console.warn('[MASSUP] weight delete:',r.error.message); return; }
        if(DB.deletedWeights&&DB.deletedWeights[key]){
          DB.deletedWeights[key]=DB.deletedWeights[key].filter(function(d){return d!==date;});
          saveDB();
        }
      })
      .catch(function(e){console.warn('[MASSUP] weight delete:',e.message);});
  });
}
function deleteWeightEntry(key, date){
  var arr=DB.weights[key]||[];
  if(arr.length<=1){showToast('&#x26A0; Impossible de supprimer la seule entrée');return;}
  DB.weights[key]=arr.filter(function(x){return x.date!==date;});
  var remaining=DB.weights[key];
  DB.weightSetDate[key]=remaining.length?remaining[remaining.length-1].date:'';
  // Mark deleted BEFORE saveDB so syncFromSupabase won't restore it on next refresh
  if(!DB.deletedWeights) DB.deletedWeights={};
  if(!DB.deletedWeights[key]) DB.deletedWeights[key]=[];
  if(DB.deletedWeights[key].indexOf(date)<0) DB.deletedWeights[key].push(date);
  saveDB();
  // Also delete the row from Supabase, then clear the marker once confirmed
  if(typeof sbClient!=='undefined'&&sbClient){
    sbClient.auth.getUser().then(function(res){
      var userId=res.data&&res.data.user&&res.data.user.id;
      if(!userId) return;
      sbClient.from('weight_history').delete()
        .eq('user_id',userId).eq('exercise_id',key).eq('recorded_at',date)
        .then(function(){
          if(DB.deletedWeights&&DB.deletedWeights[key]){
            DB.deletedWeights[key]=DB.deletedWeights[key].filter(function(d){return d!==date;});
            saveDB();
          }
        })
        .catch(function(e){console.warn('[MASSUP] weight delete:',e.message);});
    });
  }
  // Update weight-val input in the exercise panel if visible
  var newCur=remaining.length?remaining[remaining.length-1].val:0;
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=newCur; else wval.textContent=newCur; }
  var xval=document.getElementById('xwval-'+key);
  if(xval){ if(xval.tagName==='INPUT') xval.value=newCur; else xval.textContent=newCur; }
  renderWeightChart();
  showToast('Entrée du '+formatDateFr(date)+' supprimée');
}

function dateKeyLocal(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function renderFreqChart(){
  var barsEl=document.getElementById('freqMiniBars');
  if(!barsEl) return;
  barsEl.innerHTML='';
  var now=getNow();
  var dayNames=['L','M','M','J','V','S','D'];
  for(var w=7;w>=0;w--){
    var wstart=new Date(now);
    var dayOfWeek=wstart.getDay();
    var mondayOff=dayOfWeek===0?6:dayOfWeek-1;
    wstart.setDate(wstart.getDate()-mondayOff-w*7);
    wstart.setHours(0,0,0,0);
    var wend=new Date(wstart); wend.setDate(wend.getDate()+6); wend.setHours(23,59,59,999);
    var count=weekValue(DB.logs.filter(function(l){ var d=new Date(l.date); return d>=wstart&&d<=wend; }));
    var goal=getWeekGoal();
    var strict=false; // 01/11 : 3/4 = rouge dès le 02/11 → ANNULÉ le 09/11 (Adrien : trop sévère) : une séance sous l'objectif = gris
    var cls=count>=goal+1?'freq-bar gold':count>=goal?'freq-bar valid':(!strict&&count>=goal-1)?'freq-bar mid':'freq-bar low';
    var lbl=w===0?'★':('S-'+w);
    var bar=document.createElement('div');
    bar.className=cls;
    bar.innerHTML='<span class="freq-bar-num">'+(count?fmtSeances(count):'·')+'</span><span class="freq-bar-lbl">'+lbl+'</span>';
    bar.title=(w===0?'Cette semaine':'Il y a '+w+' sem.')+' · '+fmtSeances(count)+' séance'+(count>1?'s':'');
    barsEl.appendChild(bar);
  }
  var streakEl=document.getElementById('weekStreakInfo');
  if(streakEl){
    var streak=getWeekStreak();
    var wg=getWeekGoal();
    if(streak>=2) streakEl.innerHTML='&#x1F525; <strong style="color:var(--acc)">'+streak+' semaines</strong> consécutives à '+wg+'+ séances !';
    else if(streak===1) streakEl.innerHTML='&#x1F4AA; 1 semaine à '+wg+'+ séances — continue le streak !';
    else streakEl.innerHTML=''; // pas de phrase objectif (retour Adrien 02/08)
  }
}

// (Courbe RP supprimée le 14/08 — demande Adrien : « elle ne sert à rien »)

// ── Volume par muscle : séries dures sur une fenêtre [start..end] (02/08) ──
// Live = vraies séries des exos comptés ; logs manuels = estimation (séries prévues des principaux).
function muscleVolume(startDate,endDate){
  var vol={};
  RADAR_GROUPS.forEach(function(g){ vol[g.label]=0; });
  (DB.logs||[]).forEach(function(l){
    if(!l.date||l.date<startDate||l.date>endDate) return;
    if(l.live&&l.live.exos){
      l.live.exos.forEach(function(x){
        if(!liveExoCounted(x)&&!(liveExoSide(x)&&(x.sets||[]).length>0)) return;
        volAddSets(vol,x.key,(x.sets||[]).length);
      });
      return;
    }
    (l.sessions||[]).forEach(function(sid){
      if(sid.indexOf('exo:')===0){
        var k=sid.slice(4), info=findExoIndex(k);
        if(!info) return;
        volAddSets(vol,k,asParseSerie(info.exo).n);
      } else {
        var s=DATA.find(function(x){return x.id===sid;});
        if(!s||s.t==='bonus') return;
        s.exos.forEach(function(e){
          if(e.hidden||e.bonus) return;
          volAddSets(vol,e.key,asParseSerie(e).n);
        });
      }
    });
  });
  return vol;
}
// Barres HTML réutilisables (Progression + simulation du setup LiveUp + bilan hebdo).
// extra = séries PROJETÉES (sélection en cours) affichées en segment translucide.
// Seuils (01/11, demandes Adrien ; avant : 12 bleu · 17 gold) : sous 12 = ROUGE SANG (« vraiment pas
// bien ») · 12-15 gris · 16-19 bleu · 20+ gold · >25 orange (trop). Abdos jusqu'au 31/01/2027 :
// sous 8 rouge sang · 8-11 gris · 12-15 bleu · 16+ gold (le barème général ensuite).
function volScale(label){ return label==='Abdos'&&todayStr()<'2027-02-01'?{grey:8,blue:12,gold:16}:{grey:12,blue:16,gold:20}; }
function volBlueMin(label){ return volScale(label).blue; }
function volTier(label,tot){ var c=volScale(label); return tot>25?'over':tot>=c.gold?'gold':tot>=c.blue?'ok':tot>=c.grey?'low':'blood'; }
function muscleVolumeBarsHtml(vol,extra,compact,extraCls){
  var h='';
  var SCALE=25; // la barre va jusqu'à 25 (au-delà = volume poubelle)
  RADAR_GROUPS.forEach(function(g){
    var v=vol[g.label]||0, x=(extra&&extra[g.label])||0;
    var tot=v+x;
    var pW=Math.min(100,v/SCALE*100), xW=Math.min(100-pW,x/SCALE*100);
    var cls=volTier(g.label,tot);
    // les demi-séries du crédit « assistant » s'affichent arrondies (11,5 → 12)
    var vd=Math.round(v), xd=Math.round(x);
    h+='<div class="mv-row'+(compact?' compact':'')+'">'
      +'<span class="mv-name">'+g.label+'</span>'
      +'<div class="mv-bar"><div class="mv-fill '+cls+'" style="width:'+pW+'%"></div>'
      +(xW>0?'<div class="mv-fill '+(extraCls||'ghost')+'" style="width:'+xW+'%"></div>':'')
      +'<span class="mv-t10" style="left:'+(volScale(g.label).blue/SCALE*100)+'%"></span><span class="mv-t20" style="left:'+(volScale(g.label).gold/SCALE*100)+'%"></span></div>'
      +'<span class="mv-val '+cls+'">'+vd+(x?'<em>+'+xd+'</em>':'')+'</span>'
      +'</div>';
  });
  return h;
}
// Volume de TOUTE la séance en cours (16/08, demande Adrien — remplace « séries faites
// uniquement » du 15/08) : un exo encore prévu pèse ses séries PROGRAMMÉES (les faites si
// dépassées), un exo passé/écourté ne pèse que ses séries faites, un exo annulé = rien.
function asLivePlannedVol(){
  var v={};
  if(typeof AS==='undefined'||!AS||!AS.exos) return v;
  AS.exos.forEach(function(x){
    var done=(x.sets||[]).length;
    var n=x.status==='skipped'?done:Math.max(done,x.n||0);
    if(!n) return;
    volAddSets(v,x.key,n);
  });
  return v;
}
// Section Progression « Hypertrophie hebdo » : navigable semaine par semaine (‹ ›, 02/08 soir)
var _mvOff=0;
var _mvRange='week';
function mvNav(d){
  _mvOff=Math.min(0,_mvOff+d);
  renderMuscleVolume();
}
function mvSetRange(range){
  _mvRange=range==='month'?'month':'week';
  renderMuscleVolume();
}
// Vue 30 jours (01/11, demande Adrien : « que les couleurs veuillent dire la même chose ») : même barème
// que la semaine, converti EXACTEMENT : 30 jours = 30/7 ≈ 4,29 semaines → on colore la moyenne par
// semaine (total × 7/30). Seuils équivalents sur 30 jours : rouge < 51 · gris 51 · bleu 69 · gold 86 ·
// trop > 107 (abdos jusqu'à fin janvier : 34 / 51 / 69). Traits aux seuils bleu et gold de la ligne.
function muscleVolumeMonthBarsHtml(vol){
  var K=30/7, SCALE=25*K, h='';
  RADAR_GROUPS.forEach(function(g){
    var value=vol[g.label]||0, perWeek=value/K, cls=volTier(g.label,perWeek), sc=volScale(g.label);
    var valueLabel=Number.isInteger(value)?String(value):value.toFixed(1).replace('.',',');
    h+='<div class="mv-row mv-month">'
      +'<span class="mv-name">'+g.label+'</span>'
      +'<div class="mv-bar"><div class="mv-fill '+cls+'" style="width:'+Math.min(100,value/SCALE*100).toFixed(1)+'%"></div>'
      +'<span class="mv-t10" style="left:'+(sc.blue/25*100)+'%"></span><span class="mv-t20" style="left:'+(sc.gold/25*100)+'%"></span></div>'
      +'<span class="mv-val '+cls+'">'+valueLabel+'<em>'+String(Math.round(perWeek*10)/10).replace('.',',')+'/sem</em></span>'
      +'</div>';
  });
  return h;
}
function renderMuscleVolume(){
  var el=document.getElementById('muscleVolume'); if(!el) return;
  var today=todayStr(), monday=rankAddDays(rankMonday(today),_mvOff*7);
  var isMonth=_mvRange==='month';
  var start=isMonth?rankAddDays(today,-29):monday;
  var end=isMonth?today:(_mvOff===0?today:rankAddDays(monday,6));
  var vol=muscleVolume(start,end);
  // La séance EN COURS s'affiche en holo en vue semaine, sans gonfler les totaux enregistrés sur 30 jours.
  var live=null;
  if(!isMonth&&_mvOff===0){
    try{ if(typeof AS!=='undefined'&&AS&&AS.exos&&!AS.savedLogId){ var lv=asLivePlannedVol(); if(Object.keys(lv).length) live=lv; } }catch(e){}
  }
  var lbl=isMonth?'30 derniers jours':(_mvOff===0?'Cette semaine':'Sem. du '+formatDateShort(monday));
  var fwd=document.getElementById('mvNavFwd');
  if(fwd){ if(isMonth||_mvOff>=0) fwd.setAttribute('disabled',''); else fwd.removeAttribute('disabled'); }
  var nav=document.getElementById('mvNav');
  if(nav) nav.style.display=isMonth?'none':'flex';
  var weekBtn=document.getElementById('mvRangeWeek');
  var monthBtn=document.getElementById('mvRangeMonth');
  if(weekBtn) weekBtn.classList.toggle('active',!isMonth);
  if(monthBtn) monthBtn.classList.toggle('active',isMonth);
  var head='<div class="mv-head"><span>'+lbl;
  if(isMonth){
    head+='<span class="mv-hint">S&#xE9;ries comptabilis&#xE9;es &#xB7; du '+formatDateShort(start)+' au '+formatDateShort(end)+'</span></span></div>'
      +muscleVolumeMonthBarsHtml(vol)
      +'<div class="mv-month-note">M&#xEA;mes couleurs que la vue Semaine, calcul&#xE9;es sur la moyenne par semaine (total &#xF7; 4,3)&#x202F;: sous 51 s&#xE9;ries = rouge, 51 gris, 69 bleu, 86 gold (abdos jusqu\'&#xE0; f&#xE9;vrier&#x202F;: 34 / 51 / 69).</div>';
  }else{
    head+='<span class="mv-hint">sous 12 = rouge &#xB7; 12+ gris &#xB7; 16+ bleu &#xB7; 20+ gold &#xB7; &gt;25 = trop (abdos jusqu\'&#xE0; f&#xE9;vrier : 8 / 12 / 16)</span></span></div>'
      +muscleVolumeBarsHtml(vol,live,false,'holo');
  }
  el.innerHTML=head;
}

// ── Compteurs animés des bilans : tout élément [data-cu] « monte » vers sa valeur ──
function animCountUp(el,dur){
  var target=parseFloat(el.getAttribute('data-cu'));
  if(isNaN(target)) return;
  var dec=parseInt(el.getAttribute('data-cu-dec')||'0',10);
  var suf=el.getAttribute('data-cu-suf')||'';
  var pre=el.getAttribute('data-cu-pre')||'';
  var t0=performance.now(); dur=dur||900;
  function step(t){
    var p=Math.min(1,(t-t0)/dur);
    p=1-Math.pow(1-p,3);
    var v=target*p;
    el.textContent=pre+(dec?v.toFixed(dec).replace('.',','):Math.round(v).toLocaleString('fr-FR'))+suf;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animCountUpAll(root){
  try{
    var els=(root||document).querySelectorAll('[data-cu]');
    Array.prototype.forEach.call(els,function(el){ animCountUp(el); });
  }catch(e){}
}



// ══════════════════════════════════════════════════
// VIEW SWITCHING
// ══════════════════════════════════════════════════
var _scrollPos={};
var _currentView='sante';
var VIEW_ORDER=['sante','seances','progression','accueil']; // 'nutrition' mise de côté (juil. 2026)
function switchView(name, btn){
  var cur=document.querySelector('.view.active');
  if(cur) _scrollPos[cur.id]=window.scrollY;
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  document.querySelectorAll('.bni').forEach(function(b){b.classList.remove('active');});
  var newView=document.getElementById('view-'+name);
  newView.classList.add('active');
  btn.classList.add('active');
  if(_currentView!==name){
    var prevIdx=VIEW_ORDER.indexOf(_currentView);
    var nextIdx=VIEW_ORDER.indexOf(name);
    var slideClass=nextIdx>prevIdx?'slide-right':'slide-left';
    newView.classList.add(slideClass);
    newView.addEventListener('animationend',function handler(){newView.classList.remove(slideClass);newView.removeEventListener('animationend',handler);});
  }
  _currentView=name;
  window.scrollTo(0, _scrollPos['view-'+name]||0);
  updateHeaderCtx(name);
  if(name==='accueil'){ renderDashboard(); }
  if(name==='nutrition'){ renderNutrition(); }
  if(name==='seances'){ renderGymGreet(); }
  if(name==='progression'){
    renderHisto();
    try{ renderFreqChart(); }catch(e){ console.warn('[MASSUP] renderFreqChart error:',e); }
    try{ renderMuscleVolume(); }catch(e){ console.warn('[MASSUP] renderMuscleVolume error:',e); }
    try{ if(typeof FORCE!=='undefined') FORCE.render(); }catch(e){ console.warn('[MASSUP] FORCE:',e); }
    buildChartSelect();
    renderProgressionTable();
    try{ renderObjectifs(); }catch(e){ console.warn('[MASSUP] renderObjectifs:',e); }
    ensureChartJs(function(){
      try{ renderWeightChart(); }catch(e){ console.warn('[MASSUP] renderWeightChart error:',e); }
      try{ renderLevelRadar(); }catch(e){ console.warn('[MASSUP] renderLevelRadar error:',e); }
    });
  }
  if(name==='sante'){
    renderSante();
    updateHeaderCtx('sante');
    if(typeof Chart==='undefined'){
      ensureChartJs(function(){ try{renderSanteChart();}catch(e){} });
    }
  }
}

