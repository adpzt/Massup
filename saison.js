"use strict";
/* ═══ 🗓️ SAISONS — source unique (04/11/2026, demande Adrien : « construis la sèche en backup, rien ne change maintenant ») ═══
   Prise de masse jusqu'au dimanche 3 janvier 2027 · SÈCHE du lundi 4 janvier au 1er juin 2027 (décisions 12/10, 19/10, 02/11).
   Une saison ne change QUE les objectifs et la notation, jamais les données (décision 02/11).

   Ce que la Sèche change (cadre : contexte/adrien.md › Sèche 2027) :
   · nutrition : ~2 450 kcal (déficit ~450, 2 600 max), 160 g de protéines, lipides 65 visés / 75 max ;
   · note de semaine : « jours dans le déficit » (2 100-2 600 kcal) au lieu de « ≥ 2 600 », protéines ≥ 150 g ;
     3 séances de muscu visées (+ la course) ;
   · objectifs de la semaine : + abdos (3 séances avec un exo abdo, automatique) ;
   · séance : la note récompense le MAINTIEN (1 rep sous la fourchette à la charge de référence = pleine valeur),
     plus d'alerte « il est temps de monter » ; jambes à chaque séance PUSH / PULL ;
   · bilans : poids −0,35 à −0,55 kg/sem = vert, plateau 2 semaines → cardio salle, photo du mois, tour de taille.

   MODE APERÇU (localStorage massup_seche_preview, par appareil) : la semaine en cours et la suite s'AFFICHENT en Sèche
   (Bilan, objectifs, nutrition, note de la semaine en cours, bilan hebdo). Rien n'est gravé avec le barème Sèche :
   la gravure ne concerne que les semaines closes, qui restent en masse ; les séances LiveUp gardent leurs règles réelles
   (realIdAt : jamais d'aperçu dans ce qui s'enregistre). */
var SAISON=(function(){
  var START='2027-01-04', END='2027-06-01', PK='massup_seche_preview';
  var CFG={
    masse:{id:'masse',lbl:'Prise de masse',banner:'PRISE DE MASSE',start:'2026-03-01',end:'2027-01-03',cible:76,
      nut:{kcal:{goal:3000,low:2600,kind:'min'},glu:{goal:410,low:300},prot:{goal:150,low:130},lip:{goal:75,max:85}},
      note:{kcalLo:2600,kcalHi:null,protDay:135},seances:null,abdos:0,legsEach:false,rate:null},
    seche:{id:'seche',lbl:'Sèche',banner:'SÈCHE',start:START,end:END,cible:68,gras:12,
      nut:{kcal:{goal:2450,max:2600,kind:'target'},glu:{goal:280,low:220},prot:{goal:160,low:140},lip:{goal:65,max:75}},
      note:{kcalLo:2100,kcalHi:2600,protDay:150},seances:3,abdos:3,legsEach:true,rate:[-0.55,-0.35]}
  };
  function today(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function monday(s){ var d=new Date(s+'T12:00:00'), w=d.getDay(); d.setDate(d.getDate()-(w===0?6:w-1));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function preview(){ try{ return localStorage.getItem(PK)==='1'; }catch(e){ return false; } }
  function setPreview(on){
    try{ if(on) localStorage.setItem(PK,'1'); else localStorage.removeItem(PK); }catch(e){}
    try{ if(typeof INTAKE!=='undefined'&&INTAKE.syncGoals) INTAKE.syncGoals(); }catch(e){}
    try{ if(typeof BILAN!=='undefined') BILAN.render(); }catch(e){}
    try{ if(typeof renderSettingsSeason==='function') renderSettingsSeason(); }catch(e){}
  }
  // Saison RÉELLE d'une date (ce qui s'enregistre : séances, gravures)
  function realIdAt(d){ return (d||today())>=START?'seche':'masse'; }
  // Saison AFFICHÉE : la réelle, ou la Sèche en aperçu à partir de la semaine en cours
  function idAt(d){ d=d||today(); if(d>=START) return 'seche'; if(preview()&&d>=monday(today())) return 'seche'; return 'masse'; }
  function cfg(d){ return CFG[idAt(d)]; }
  function is(id,d){ return idAt(d)===id; }
  // Aperçu en jeu pour cette date (affichage Sèche alors que la vraie saison est la masse)
  function previewAt(d){ return idAt(d)==='seche'&&realIdAt(d)==='masse'; }
  // Objectif de séances de salle d'une semaine : 3 en Sèche (3 muscu + 1 course), sinon celui du profil
  function weekGoal(ws,base){ var c=cfg(ws); return c.seances||base; }
  return {START:START,END:END,CFG:CFG,preview:preview,setPreview:setPreview,idAt:idAt,realIdAt:realIdAt,cfg:cfg,is:is,previewAt:previewAt,weekGoal:weekGoal,_monday:monday};
})();
