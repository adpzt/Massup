"use strict";
/* ═══════════════════════════════════════════════════════════════
   MELATI v3 (23/08/2026) — LA MÊME app que MASSUP, pixel pour pixel :
   melati.css = copie générée de style.css (menthe→rose, cyan→lavande),
   mêmes classes, mêmes écrans (Bilan / Séances / Progression / LiveUp).
   4 séances : BOOTY (violet) · STRONGER (bleu) · SCULPT (orange) ·
   HOME (lavande, tapis + élastiques — 29/08). Objectif 3 séances/semaine. Orientation PERTE DE POIDS.
   Stockage : UNIQUEMENT `melati_db` + `melati_live`. Zéro fichier Adrien.
   ═══════════════════════════════════════════════════════════════ */

// ── IMAGES (mêmes assets que MASSUP + melati_* téléchargés de free-exercise-db) ──
var IMGS={
  hip_thrust:'imgs/hipthrust.jpg', presse:'imgs/legpress.gif', presse_uni:'imgs/legpress.gif',
  rdl:'imgs/melati_rdl_db.jpg', bulgare:'imgs/melati_bulgare.jpg', abduction:'imgs/abductor.jpg',
  gainage:'imgs/melati_plank2.jpg', gainage_lat:'imgs/melati_sideplank.jpg',
  leg_curl:'imgs/legcurl.gif', leg_ext:'imgs/legextension.gif',
  kickback:'imgs/melati_kickback.jpg', fentes_smith:'imgs/melati_smith.jpg',
  tirage:'imgs/latpulldown.gif', rowing:'imgs/seatedrow.gif', gobelet:'imgs/melati_gobelet.jpg',
  dev_epaules:'imgs/extras_dev_halt.jpg', elev_lat:'imgs/lateralraise.gif', face_pull:'imgs/facepull.gif',
  curl:'imgs/dumbbellcurl.gif', triceps:'imgs/tricepscable.gif', chest_press:'imgs/chestpress.gif',
  dead_bug_gainage:'imgs/deadbug.jpg', circuit:'imgs/deadbug.jpg', stepmill:'imgs/melati_stepmill.jpg',
  mollets:'imgs/mollets.jpg', adducteurs:'imgs/adductor.jpg',
  // HOME (29/08) — posters MuscleWiki (démonstratrice femme), vérifiés un par un avant d'être référencés
  ht_home:'imgs/home_hipthrust.jpg', rdl_band:'imgs/home_rdl.jpg', squat_band:'imgs/home_gobelet.jpg',
  bulgare_home:'imgs/home_bulgare.jpg', clam_band:'imgs/home_clam.jpg', kick_band:'imgs/home_kickback.jpg',
  row_band:'imgs/home_row2.jpg', pullapart:'imgs/home_pullapart.jpg', press_band:'imgs/home_press.jpg',
  lat_band:'imgs/home_latraise.jpg', curl_band:'imgs/home_curl.jpg', tri_band:'imgs/home_triceps.jpg',
  pushup_knees:'imgs/home_pushup.jpg', bridge_band:'imgs/home_bridge_band.jpg', abd_side_band:'imgs/home_abd_side.jpg'
};

// ── VIDÉOS DE DÉMO DES EXOS (29/09, étape 3) : clé d'exo → fichier imgs/vids/ex_*.mp4. Une vidéo remplace la
// photo dans la fiche (chargée seulement à l'ouverture) et à l'intro du LiveUp (lecture auto, muette, en boucle),
// avec le lecteur complet : ⏯ · ‹ 5 s · timeline · ralenti ×0,5. Vide tant que la source n'est pas tranchée.
var EXO_VID={};
function exoMedia(key,alt,live){
  var v=EXO_VID[key], img=IMGS[key];
  if(v){
    var poster=img?' poster="'+img+'"':'';
    var ev=' ontimeupdate="mvTime(this)" onplay="mvState(this)" onpause="mvState(this)" onclick="mvToggle(this)"';
    return mvWrap('<video '+(live?'src="'+v+'" autoplay':'data-src="'+v+'" preload="none"')+poster+ev+' muted loop playsinline style="width:100%;max-height:230px;object-fit:contain;border-radius:12px;display:block;"></video>');
  }
  return img?'<img src="'+img+'" alt="'+alt+'" loading="lazy" style="width:100%;height:100%;object-fit:contain;"/>':'';
}
// ── EXERCICES (contenu = brief 50-BRIEF-APP-SPORT-MELATI.md, inchangé) ──
// cue = LA clé · tips = sensation + objectif · errs = à éviter
var EXOS={
hip_thrust:{name:"Hip thrust",grps:["fessiers"],sets:4,lo:8,hi:12,rest:120,start:12,inc:2.5,imp:true,
 cue:"Pousse à travers les TALONS, monte jusqu'à l'alignement épaules-hanches-genoux, et serre les fesses 1 seconde FORT en haut.",
 bless:"Haltère posé sur les hanches (coussin dessous) pour commencer — la barre (20 kg) viendra en semaine 3-4.",
 tips:["La brûlure doit être dans les FESSES. Cuisses ? → avance les pieds. Bas du dos ? → tu montes trop haut : rentre légèrement le bassin au sommet.","15 ponts fessiers au sol AVANT la 1re série pour réveiller la zone.","🌟 Objectif 6 mois : 60 kg."],
 errs:["Cambrer au sommet","Pousser sur les pointes de pieds","Descendre trop vite","Regarder le plafond (regarde devant toi)"]},
presse:{name:"Presse à cuisses",grps:["fessiers","jambes"],sets:3,lo:10,hi:12,rest:120,start:50,inc:2.5,
 cue:"Pieds HAUTS et LARGES sur le plateau, pointes légèrement ouvertes — c'est ce placement qui envoie le travail dans les fessiers. Descends profond et contrôlé (2-3 s).",
 tips:["Étirement profond des fessiers en bas, poussée dans les talons. Que le devant des cuisses ? → pieds plus hauts.","Limite de descente : le bas du dos ne décolle JAMAIS du dossier.","🌟 Objectif 6 mois : 100-120 kg."],
 errs:["Mini-amplitude avec du lourd","Dos qui s'enroule en bas","Genoux qui rentrent","Verrouiller les genoux en haut"]},
rdl:{name:"Soulevé de terre roumain",grps:["fessiers","jambes"],sets:3,lo:10,hi:12,rest:90,start:8,inc:2,dumb:true,
 cue:"Une CHARNIÈRE de hanche, pas un squat : genoux légèrement fléchis qui ne bougent plus, fesses vers l'ARRIÈRE, haltères collés aux jambes. Dos plat du début à la fin.",
 tips:["Étirement net de l'arrière des cuisses à la descente, fesses qui « claquent » à la remontée.","C'est aussi de la souplesse déguisée — exactement ce qu'il faut pour ton écart.","🌟 Objectif 6 mois : 2×20-24 kg."],
 errs:["Dos rond (le plus grave)","Plier les genoux (ça devient un squat)","Haltères loin du corps","Regarder devant soi en bas"]},
bulgare:{name:"Fente bulgare",grps:["fessiers","jambes"],sets:3,lo:10,hi:10,rest:90,start:0,inc:2,dumb:true,side:true,
 cue:"Pied arrière lacets sur le banc, pied avant à 60-70 cm. Descends VERTICALEMENT, buste penché 15° vers l'avant — c'est ça qui cible les fessiers.",
 bless:"Poids du corps les 2 premières semaines, puis 2×6 kg.",
 tips:["À sentir : la fesse de la jambe AVANT. La cuisse ? → penche un peu plus le buste, allonge la foulée.","L'équilibre précaire du début est normal — réglé en 3 séances.","🌟 Objectif 6 mois : 2×14-16 kg."],
 errs:["Pied avant trop près du banc","Pousser sur la jambe arrière","Genou qui part en dedans"]},
abduction:{name:"Abduction machine",grps:["fessiers"],sets:3,lo:15,hi:20,rest:60,start:30,inc:2.5,imp:true,
 cue:"Dossier légèrement penché vers l'avant (moyen fessier mieux ciblé). Écarte contre la résistance, PAUSE 2 s en ouverture maximale, retour lent.",
 tips:["La brûlure sur le côté des fesses — les séries longues (15-20) sont le but, la brûlure est le signal.","🌟 Objectif 6 mois : 55-70 kg."],
 errs:["Expédier les reps à moitié","Retour qui claque"]},
gainage:{name:"Gainage (planche)",grps:["core"],sets:3,lo:30,hi:45,rest:45,time:true,
 cue:"Coudes sous les épaules, corps en ligne droite, FESSES SERRÉES et bassin légèrement rétroversé — ça efface la cambrure.",
 tips:["30 secondes parfaites valent mieux que 90 affaissées.","Le ventre reste gainé, la respiration continue.","🌟 Objectif 6 mois : 3×60-90 s."],
 errs:["S'affaisser pour durer plus longtemps","Creuser le bas du dos"]},
leg_curl:{name:"Leg curl",grps:["jambes"],sets:3,lo:12,hi:12,rest:60,start:20,inc:2.5,
 cue:"Axe de la machine aligné avec le genou. Fléchis les talons vers les fesses, 2 s de descente.",
 tips:["Pointes de pieds tirées vers les tibias = les ischios travaillent plus.","🌟 Objectif 6 mois : 35-45 kg."],
 errs:["Donner de l'élan","Descente relâchée"]},
leg_ext:{name:"Leg extension",grps:["jambes"],sets:3,lo:12,hi:15,rest:60,start:20,inc:2.5,
 cue:"Dos plaqué au dossier. Monte en 1 s, redescends en 2-3 s — c'est la descente qui dessine le quadriceps.",
 tips:["Le devant de la cuisse qui chauffe, sans à-coups.","🌟 Objectif 6 mois : 45 kg."],
 errs:["Claquer le poids","Donner de l'élan"]},
kickback:{name:"Kickback poulie",grps:["fessiers"],sets:3,lo:15,hi:15,rest:60,start:7.5,inc:1,side:true,
 cue:"Chevillère à la poulie basse, buste penché, appuie-toi sur le montant. Jambe tendue vers l'arrière-haut, SANS cambrer.",
 tips:["1 s de contraction en haut : la fesse qui serre, rien d'autre.","Exercice de finition — léger, strict, brûlant."],
 errs:["Cambrer le dos","Prendre lourd"]},
fentes_smith:{name:"Fentes à la Smith",grps:["fessiers","jambes"],sets:3,lo:10,hi:10,rest:90,start:10,inc:2.5,side:true,
 cue:"La version guidée de la fente bulgare : la barre est tenue par la machine, tu ne gères que la descente.",
 bless:"Barre + 10 kg pour commencer.",
 tips:["Même sensation à chercher que la bulgare : la fesse de la jambe avant.","Parfaite tant que la barre libre intimide."],
 errs:["Pied avant trop près","Genou qui rentre"]},
tirage:{name:"Tirage vertical",grps:["dos"],sets:4,lo:10,hi:12,rest:90,start:25,inc:2,imp:true,
 cue:"Commence par les OMOPLATES : abaisse-les avant de plier les bras (« range tes épaules dans tes poches arrière »), puis tire vers le haut de la poitrine, coudes vers le sol.",
 tips:["Les CÔTÉS du dos qui travaillent (les « ailes »), pas les bras.","Tes mains sont des crochets : tout part des coudes.","🌟 Objectif 6 mois : 40-45 kg."],
 errs:["Tirer avec les biceps","Se balancer en arrière","Demi-amplitude en haut","Jamais derrière la nuque"]},
rowing:{name:"Rowing assis",grps:["dos"],sets:3,lo:10,hi:12,rest:90,start:25,inc:2,
 cue:"Étire complètement devant, puis tire les coudes vers l'arrière près du corps. Au bout : SERRE les omoplates 1 seconde — comme pour tenir un crayon entre elles.",
 tips:["Le milieu du dos qui se contracte au serrage — le muscle qui combat les 8 h assise au bureau.","🌟 Objectif 6 mois : 40-50 kg."],
 errs:["Hausser les épaules","Buste qui se balance","Tirer vite sans le serrage final"]},
gobelet:{name:"Squat gobelet",grps:["jambes","fessiers"],sets:3,lo:10,hi:12,rest:120,start:10,inc:1,
 cue:"Haltère vertical contre le sternum, coudes dessous. Gaine, puis descends ENTRE tes jambes — cuisses parallèles au sol.",
 tips:["Cuisses ET fessiers. Le squat le plus facile à bien faire — et de la mobilité de hanche en prime.","🌟 Objectif 6 mois : 22-26 kg."],
 errs:["Talons qui décollent","Genoux qui rentrent","Dos qui s'enroule en bas"]},
dev_epaules:{name:"Développé épaules",grps:["epaules"],sets:3,lo:10,hi:12,rest:90,start:5,inc:1,dumb:true,
 cue:"Assise, dossier à 80°, haltères au niveau des oreilles. Pousse vers le haut légèrement vers l'avant, sans verrouiller les coudes.",
 tips:["Les épaules qui poussent SANS cambrure — si tu cambres, c'est trop lourd.","🌟 Objectif 6 mois : 2×12 kg."],
 errs:["Cambrer pour pousser plus lourd","Verrouiller les coudes en haut"]},
elev_lat:{name:"Élévations latérales",grps:["epaules"],sets:3,lo:12,hi:15,rest:60,start:3,inc:1,dumb:true,
 cue:"Micro-flexion des coudes qui ne change plus. Monte à l'horizontale « comme si tu versais deux carafes ». Descente en 2 s.",
 tips:["C'est la DESCENTE qui construit. Léger, toujours.","🌟 Objectif 6 mois : 2×8 kg."],
 errs:["Balancer le buste = trop lourd"]},
gainage_lat:{name:"Gainage latéral",grps:["core"],sets:3,lo:20,hi:30,rest:45,time:true,side:true,
 cue:"Coude sous l'épaule, corps aligné, hanches HAUTES.",
 tips:["C'est lui qui dessine les OBLIQUES — les lignes que tu veux.","🌟 Objectif 6 mois : 45 s par côté."],
 errs:["Bassin qui plonge"]},
face_pull:{name:"Face pull corde",grps:["dos","epaules"],sets:3,lo:15,hi:15,rest:60,start:12,inc:2,
 cue:"Corde à la poulie HAUTE, un pas de recul, pouces vers toi. Tire vers le VISAGE en écartant les mains, coudes hauts, 1 s de serrage.",
 tips:["L'arrière des épaules + le milieu du dos — le meilleur exercice posture anti-bureau.","🌟 Objectif 6 mois : 25 kg."],
 errs:["Coudes qui plongent = trop lourd"]},
curl:{name:"Curl biceps",grps:["bras"],sets:3,lo:12,hi:12,rest:60,start:5,inc:1,dumb:true,
 cue:"Coudes collés au corps — seul l'avant-bras bouge. Amplitude complète.",
 tips:["Descente complète et contrôlée, sans balancer.","🌟 Objectif 6 mois : 2×8-10 kg."],
 errs:["Balancer le buste"]},
triceps:{name:"Extension triceps poulie",grps:["bras"],sets:3,lo:12,hi:15,rest:60,start:12,inc:2,
 cue:"Coudes fixes collés au corps (seul l'avant-bras bouge), amplitude complète.",
 tips:["L'arrière du bras — ⅔ de son volume, c'est lui qui le dessine.","🌟 Objectif 6 mois : 20-25 kg."],
 errs:["Écarter les coudes","Utiliser le dos"]},
chest_press:{name:"Chest press",grps:["pecs"],sets:3,lo:12,hi:12,rest:90,start:15,inc:2,
 cue:"Poignées à hauteur de poitrine, omoplates plaquées au dossier. Pousse sans verrouiller les coudes.",
 tips:["Retour en 2 s sans laisser claquer.","En bonus, jamais en principal."],
 errs:["Laisser claquer le retour"]},
presse_uni:{name:"Presse unilatérale",grps:["fessiers","jambes"],sets:3,lo:10,hi:10,rest:90,start:20,inc:2.5,side:true,
 cue:"Une jambe à la fois sur la presse — pied haut, descente profonde contrôlée, pousse dans le talon.",
 tips:["La fesse et l'arrière de la cuisse de la jambe qui travaille.","Une jambe à la fois = les déséquilibres se corrigent."],
 errs:["Amplitude minuscule","Genou qui rentre"]},
dead_bug_gainage:{name:"Dead bug + gainage",grps:["core"],sets:3,lo:30,hi:30,rest:45,time:true,
 cue:"Dead bug : PLAQUE le bas du dos au sol, descends lentement bras droit + jambe gauche, expire en descendant. Puis planche : fesses serrées, bassin rétroversé.",
 tips:["La qualité du contact dos-sol EST l'exercice. Ça décolle ? → réduis l'amplitude.","La base du transverse — le ventre plat vient de là."],
 errs:["Cambrer","Aller vite"]},
circuit:{name:"Circuit ventre",grps:["core"],sets:3,lo:1,hi:1,rest:60,circuit:true,
 cue:"1 tour = dead bug 10/côté → gainage 40 s → gainage latéral 30 s/côté → hollow hold 15 s. 60 s de repos entre les tours.",
 tips:["Dead bug : bas du dos plaqué. Planche : fesses serrées. Latéral : hanches hautes. Hollow : plie les genoux si le bas du dos décolle.","10 min, profond, sans crunchs — c'est ÇA la séance « abdos »."],
 errs:["Le ventre qui « pointe » en dôme = trop dur, on réduit","Retenir sa respiration"]},
adducteurs:{name:"Adducteurs machine",grps:["jambes"],sets:3,lo:12,hi:15,rest:60,start:25,inc:2.5,
 cue:"Assise, jambes contre les coussins intérieurs. Serre les jambes l'une vers l'autre en 2 s, PAUSE 1 s serré, puis laisse rouvrir LENTEMENT jusqu'à l'étirement complet.",
 tips:["L'intérieur des cuisses — la zone que toutes demandent, et que presque rien d'autre ne travaille.","Bonus caché : renforcer les adducteurs en position étirée AIDE ton écart — c'est de la souplesse sous charge."],
 errs:["Laisser claquer le retour","Régler l'ouverture trop grande dès le départ"]},
mollets:{name:"Mollets (presse)",grps:["jambes"],sets:3,lo:12,hi:15,rest:45,start:30,inc:2.5,
 cue:"Sur la presse, pointes de pieds en bas du plateau, talons dans le vide. Pousse sur les pointes, PAUSE 1 s en haut, redescends LENTEMENT jusqu'à l'étirement complet.",
 tips:["Des mollets et des chevilles solides = plus de stabilité et de rebond en salsa 💃","C'est l'étirement en bas + la pause en haut qui font tout — pas la charge."],
 errs:["Rebondir sans contrôle","Demi-amplitude"]},
stepmill:{name:"StepMill / tapis incliné",grps:["cardio"],sets:1,lo:12,hi:15,rest:0,time:true,mins:true,
 cue:"StepMill niveau 8-10 ou tapis incliné 8-10 % — allure qui fait parler difficilement, sans sprinter.",
 tips:["Plafonné exprès : au-delà, ça mange ta récupération.","Le muscle sculpte, le cardio complète — jamais l'inverse."],
 errs:["En faire plus « pour brûler » — le cardio ne construira ni tes fesses, ni ton dos"]}
};

// ── HOME (29/08, demande Adrien) : les mêmes mouvements que la salle, version tapis + élastiques.
// band:true → la « charge » = un élastique (ou deux combinés) : les −/+ parcourent l'échelle BAND_RUNGS,
// la valeur stockée reste des kg (records, courbes, double progression inchangés).
Object.assign(EXOS,{
ht_home:{name:"Hip thrust maison",grps:["fessiers"],sets:4,lo:12,hi:15,rest:90,start:9.1,band:true,imp:true,
 cue:"Dos contre le canapé (bas des omoplates sur le bord), pieds à plat, élastique passé SUR les hanches et bloqué sous les deux pieds. Pousse dans les talons, monte jusqu'à l'alignement épaules-hanches-genoux, serre 1 seconde FORT en haut.",
 bless:"Sans élastique les 2 premières séries si l'équilibre est bizarre — puis Bleu.",
 tips:["Même brûlure qu'à la salle : dans les FESSES. Cuisses ? → avance les pieds. Bas du dos ? → tu montes trop haut.","Menton rentré, regard devant — pas le plafond.","4×15 faciles ? → élastique suivant, ou deux élastiques."],
 errs:["Cambrer au sommet","Pousser sur les pointes de pieds","Laisser l'élastique remonter sur le ventre (il reste sur l'os des hanches)"]},
rdl_band:{name:"Soulevé de terre roumain élastique",grps:["fessiers","jambes"],sets:3,lo:12,hi:15,rest:75,start:13.6,band:true,
 cue:"Debout SUR l'élastique (milieu sous les deux pieds), une boucle dans chaque main. Genoux à peine fléchis et qui ne bougent plus, fesses vers l'ARRIÈRE, dos plat, mains qui glissent le long des cuisses.",
 tips:["Étirement net de l'arrière des cuisses en bas, fesses qui « claquent » en haut.","L'élastique tire de plus en plus fort en haut : c'est là qu'on serre.","Trop facile ? → écarte un peu les pieds (l'élastique se raccourcit) ou passe au suivant."],
 errs:["Dos rond (le plus grave)","Plier les genoux (ça devient un squat)","Remonter en tirant avec les bras"]},
squat_band:{name:"Squat élastique",grps:["jambes","fessiers"],sets:3,lo:12,hi:15,rest:90,start:9.1,band:true,
 cue:"Debout sur l'élastique, boucles ramenées sur les épaules ou tenues contre le sternum (comme le gobelet). Gaine, puis descends ENTRE tes jambes, cuisses parallèles au sol.",
 tips:["La version maison du squat gobelet : cuisses ET fessiers.","Talons au sol, genoux qui suivent la direction des pieds."],
 errs:["Talons qui décollent","Genoux qui rentrent","Dos qui s'enroule en bas"]},
bulgare_home:{name:"Fente bulgare au canapé",grps:["fessiers","jambes"],sets:3,lo:10,hi:12,rest:75,start:0,band:true,side:true,
 cue:"Pied arrière lacets sur le canapé, pied avant à 60-70 cm. Descends VERTICALEMENT, buste penché 15° vers l'avant. Pour charger : élastique sous le pied avant, boucles dans les mains.",
 tips:["La fesse de la jambe AVANT. La cuisse ? → penche un peu plus le buste, allonge la foulée.","Poids du corps tant que l'équilibre n'est pas là."],
 errs:["Pied avant trop près du canapé","Pousser sur la jambe arrière","Genou qui part en dedans"]},
clam_band:{name:"Clamshell élastique",grps:["fessiers"],sets:3,lo:15,hi:20,rest:45,start:4.1,band:true,side:true,
 cue:"Allongée sur le côté, genoux pliés à 90°, élastique autour des cuisses juste au-dessus des genoux. Pieds collés, ouvre le genou du dessus vers le plafond, PAUSE 1 s, redescends lentement.",
 tips:["La version maison de l'abduction machine : brûlure sur le CÔTÉ de la fesse.","Le bassin ne bascule pas en arrière — pose une main dessus pour le sentir."],
 errs:["Rouler le bassin en arrière pour ouvrir plus","Retour qui claque"]},
kick_band:{name:"Kickback élastique",grps:["fessiers"],sets:3,lo:15,hi:15,rest:45,start:4.1,band:true,side:true,
 cue:"Debout face au canapé, mains posées dessus, élastique bloqué sous le pied d'appui et passé autour de l'autre cheville. Jambe tendue vers l'arrière-haut, 1 s de serrage, SANS cambrer.",
 tips:["Finition légère et stricte : seule la fesse serre.","Buste légèrement penché, ventre gainé."],
 errs:["Cambrer le dos","Donner de l'élan"]},
row_band:{name:"Rowing buste penché élastique",grps:["dos"],sets:4,lo:12,hi:15,rest:75,start:13.6,band:true,imp:true,
 cue:"Debout sur l'élastique, buste penché à 45°, dos plat, bras tendus. Tire les coudes vers l'ARRIÈRE le long du corps et SERRE les omoplates 1 s en haut — comme pour tenir un crayon entre elles.",
 tips:["La version maison du rowing assis : le milieu du dos qui se contracte au serrage.","Tes mains sont des crochets, tout part des coudes."],
 errs:["Hausser les épaules","Se redresser à chaque rep","Tirer vite sans le serrage final"]},
pullapart:{name:"Pull-apart élastique",grps:["dos","epaules"],sets:3,lo:15,hi:20,rest:45,start:4.1,band:true,
 cue:"Élastique tenu devant toi à hauteur de poitrine, bras tendus, mains écartées de la largeur des épaules. Écarte jusqu'à ce que l'élastique touche la poitrine, omoplates serrées 1 s, retour lent.",
 tips:["La version maison du face pull : arrière des épaules + milieu du dos, LE geste anti-bureau.","Coudes presque tendus, épaules basses."],
 errs:["Hausser les épaules","Cambrer pour finir le mouvement"]},
press_band:{name:"Développé épaules élastique",grps:["epaules"],sets:3,lo:12,hi:12,rest:60,start:4.1,band:true,
 cue:"Debout sur l'élastique, une boucle dans chaque main à hauteur des oreilles. Pousse vers le haut, légèrement vers l'avant, sans verrouiller les coudes. Ventre gainé.",
 tips:["Si tu cambres pour pousser : élastique trop dur, redescends d'un cran."],
 errs:["Cambrer pour pousser plus","Verrouiller les coudes en haut"]},
lat_band:{name:"Élévations latérales élastique",grps:["epaules"],sets:3,lo:12,hi:15,rest:45,start:4.1,band:true,
 cue:"Debout sur l'élastique, boucles dans les mains le long du corps. Monte les bras à l'horizontale « comme si tu versais deux carafes », descends en 2 s.",
 tips:["C'est la DESCENTE qui construit. Léger, toujours."],
 errs:["Balancer le buste = trop dur"]},
curl_band:{name:"Curl biceps élastique",grps:["bras"],sets:3,lo:12,hi:15,rest:45,start:4.1,band:true,
 cue:"Debout sur l'élastique, coudes collés au corps — seul l'avant-bras bouge. Amplitude complète, descente contrôlée.",
 tips:["L'élastique résiste surtout en haut : serre 1 s."],
 errs:["Balancer le buste","Avancer les coudes"]},
tri_band:{name:"Extension triceps élastique",grps:["bras"],sets:3,lo:12,hi:15,rest:45,start:4.1,band:true,
 cue:"Un pied sur l'élastique, l'autre boucle dans les mains derrière la tête. Coudes fixes près des oreilles, tends les bras au-dessus de la tête, redescends lentement.",
 tips:["L'arrière du bras — c'est lui qui le dessine."],
 errs:["Écarter les coudes","Cambrer"]},
pushup_knees:{name:"Pompes sur les genoux",grps:["pecs","bras"],sets:3,lo:8,hi:12,rest:60,start:0,band:true,
 cue:"Genoux au sol, mains un peu plus larges que les épaules, corps en ligne droite des genoux à la tête. Descends la poitrine vers le sol en 2 s, pousse.",
 bless:"Trop dur ? Mains sur le bord du canapé. Trop facile ? Élastique dans le dos, boucles sous les mains.",
 tips:["La version maison du chest press. Fesses serrées, ventre gainé tout le long."],
 errs:["Fesses qui montent","Coudes qui s'écartent à 90°"]},
bridge_band:{name:"Pont fessier élastique",grps:["fessiers"],sets:3,lo:15,hi:20,rest:45,start:4.1,band:true,
 cue:"Allongée sur le dos, genoux pliés, élastique au-dessus des genoux. Pousse dans les talons, monte les hanches, ÉCARTE les genoux contre l'élastique et serre 1 s en haut.",
 tips:["Parfait en activation avant le hip thrust maison, ou en finisher brûlant.","Les côtes restent basses : pas de cambrure, c'est le bassin qui monte."],
 errs:["Genoux qui se rapprochent","Monter avec le dos"]},
abd_side_band:{name:"Abduction couchée élastique",grps:["fessiers"],sets:3,lo:15,hi:20,rest:45,start:4.1,band:true,side:true,
 cue:"Allongée sur le côté, jambes tendues, élastique au-dessus des genoux. Lève la jambe du dessus, pointe du pied légèrement vers le bas, sans basculer le bassin. Descente lente.",
 tips:["Côté de la fesse (moyen fessier) — la zone qui arrondit la hanche."],
 errs:["Bassin qui roule en arrière","Aller vite"]}
});

// ── Les élastiques de Melati (29/08) : un exo band se charge avec UN élastique ou DEUX combinés ──
var BANDS=[{n:'Jaune',kg:4.1,e:'🟡'},{n:'Bleu',kg:9.1,e:'🔵'},{n:'Vert',kg:13.6,e:'🟢'},{n:'Noir',kg:18.1,e:'⚫'},{n:'Rouge',kg:22.7,e:'🔴'}];
var BAND_RUNGS=(function(){
  var r=[{kg:0,lbl:'Poids du corps',short:'sans élastique',e:''}];
  BANDS.forEach(function(b){ r.push({kg:b.kg,lbl:b.n,short:b.n,e:b.e}); });
  for(var i=0;i<BANDS.length;i++) for(var j=i+1;j<BANDS.length;j++)
    r.push({kg:Math.round((BANDS[i].kg+BANDS[j].kg)*10)/10,lbl:BANDS[i].n+' + '+BANDS[j].n,short:BANDS[i].n+'+'+BANDS[j].n,e:BANDS[i].e+BANDS[j].e,combo:true});
  r.sort(function(a,b){ return (a.kg-b.kg)||((a.combo?1:0)-(b.combo?1:0)); });
  // deux paliers à moins de 0,3 kg (Rouge 22,7 = Bleu+Vert 22,7 · Vert+Noir 31,7 ≈ Bleu+Rouge 31,8) : on garde le plus simple
  var out=[]; r.forEach(function(x){ if(out.length&&Math.abs(out[out.length-1].kg-x.kg)<0.3) return; out.push(x); });
  return out;
})();
function bandRung(kg){ for(var i=0;i<BAND_RUNGS.length;i++) if(Math.abs(BAND_RUNGS[i].kg-kg)<0.26) return BAND_RUNGS[i]; return null; }
function bandStep(kg,dir){
  var out=null;
  if(dir>0){ for(var i=0;i<BAND_RUNGS.length;i++) if(BAND_RUNGS[i].kg>kg+0.25){ out=BAND_RUNGS[i]; break; } if(!out) out=BAND_RUNGS[BAND_RUNGS.length-1]; }
  else { for(var j=BAND_RUNGS.length-1;j>=0;j--) if(BAND_RUNGS[j].kg<kg-0.25){ out=BAND_RUNGS[j]; break; } if(!out) out=BAND_RUNGS[0]; }
  return out.kg;
}
function fmtKg(v){ return String(v).replace('.',','); }
function roundW(e,v){ return e&&e.band?Math.round(v*10)/10:Math.round(v*2)/2; }
// Libellé d'une charge : exo élastique → « 🟢 Vert · 13,6 kg » (ou « Poids du corps ») · sinon « 2×8 kg »
function wTxt(e,v,short){
  if(e&&e.band){
    var r=bandRung(v);
    if(!r) return '≈ '+fmtKg(v)+' kg';
    if(r.kg===0) return 'Poids du corps';
    return r.e+' '+(short?r.short:r.lbl)+' · '+fmtKg(r.kg)+' kg';
  }
  return (e&&e.dumb?'2×':'')+fmtKg(v)+' kg';
}
// Le « champ poids » d'un exo élastique (remplace l'input numérique) : emoji + nom + kg
function bandHtml(v){
  var r=bandRung(v);
  if(!r) return '<span class="bl-name">≈ '+fmtKg(v)+' kg</span>';
  if(r.kg===0) return '<span class="bl-name">Poids du corps</span><span class="bl-kg">sans élastique</span>';
  return '<span class="bl-emo">'+r.e+'</span><span class="bl-name">'+r.lbl+'</span><span class="bl-kg">'+fmtKg(r.kg)+' kg</span>';
}

// ── SÉANCES : 4 cartes, une couleur chacune (slots MASSUP : legs violet · pull bleu · push orange · others jaune) ──
var DATA=[
 {id:'A',t:'legs',icon:'🍑',num:'Séance 1',name:'BOOTY',sub:'Fessiers · Jambes',dur:65,
  exos:[{key:'hip_thrust'},{key:'presse'},{key:'rdl'},{key:'bulgare'},{key:'abduction'},{key:'gainage'},
        {key:'leg_curl',bonus:true},{key:'leg_ext',bonus:true},{key:'kickback',bonus:true},{key:'fentes_smith',bonus:true},{key:'mollets',bonus:true,note:'Chevilles + rebond salsa 💃'}]},
 {id:'B',t:'pull',icon:'🦢',num:'Séance 2',name:'STRONGER',sub:'Dos · Épaules · Bras',dur:65,
  exos:[{key:'tirage'},{key:'rowing'},{key:'gobelet'},{key:'dev_epaules'},{key:'elev_lat'},{key:'gainage_lat'},
        {key:'face_pull',bonus:true},{key:'curl',bonus:true},{key:'triceps',bonus:true},{key:'chest_press',bonus:true}]},
 {id:'C',t:'push',icon:'✨',num:'Séance 3',name:'SCULPT',sub:'Fessiers bis · Ventre',dur:55,
  exos:[{key:'hip_thrust',sets:3,lo:12,hi:15,rest:90,wFactor:.9,note:'Charge de la 1 −10 % : séries plus longues, brûlure'},
        {key:'presse_uni'},{key:'leg_curl'},{key:'abduction'},{key:'circuit'},
        {key:'stepmill',bonus:true,note:'Fermeture cardio optionnelle — 12-15 min max'},{key:'kickback',bonus:true},{key:'fentes_smith',bonus:true},{key:'adducteurs',bonus:true,note:'Intérieur de cuisse — aide ton écart'}]},
 // HOME (29/08, demande Adrien) : tapis + élastiques, zéro machine, zéro poids — les mêmes mouvements en version maison
 {id:'H',t:'maison',icon:'🏠',num:'Séance 4',name:'HOME',sub:'Tapis + élastiques',dur:50,
  exos:[{key:'ht_home'},{key:'rdl_band'},{key:'squat_band'},{key:'clam_band'},{key:'row_band'},{key:'pullapart'},{key:'circuit'},
        {key:'bulgare_home',bonus:true},{key:'bridge_band',bonus:true,note:'Activation ou finisher 🔥'},{key:'kick_band',bonus:true},{key:'abd_side_band',bonus:true},
        {key:'press_band',bonus:true},{key:'lat_band',bonus:true},{key:'curl_band',bonus:true},{key:'tri_band',bonus:true},{key:'pushup_knees',bonus:true}]}
];
// legacy : anciennes séances encore dans l'historique (apprentissage v2, BURN v4.0)
var SNAME_LEGACY={appr:{name:'APPRENTISSAGE',icon:'🌱',t:'others',num:'Départ'},D:{name:'BURN',icon:'🔥',t:'others',num:'Express'}};
function seanceOf(sid){ return DATA.find(function(s){return s.id===sid;})||SNAME_LEGACY[sid]||null; }

// ── Échauffements (brief §7) — mêmes classes warmup-step que MASSUP ──
var WARMUP_MEL={
  legs:{title:"Échauffement BOOTY",sub:"Fessiers · Jambes — 8 min",steps:[
    {n:1,title:"Cardio léger",detail:"Vélo ou tapis, allure facile : juste monter la température.",time:"4 min"},
    {n:2,title:"Mobilité de hanche",detail:"Cercles de hanche · fente basse avec rotation · balancements de jambe.",time:"2 min"},
    {n:3,title:"🍑 Activation fessiers (élastique)",detail:"Monster walk 15 pas/sens · clamshell 15/côté · pont fessier ×15. Sans elle, le hip thrust muscle les cuisses, pas les fesses.",time:"2 min"},
    {n:4,title:"Séries d'approche",detail:"1-2 séries légères sur le 1er exercice avant de charger.",time:"1 série ×12-15"}]},
  pull:{title:"Échauffement STRONGER",sub:"Dos · Épaules · Bras — 6 min",steps:[
    {n:1,title:"Cardio léger",detail:"Vélo ou rameur, allure facile.",time:"3 min"},
    {n:2,title:"Rotations épaules + ouverture poitrine",detail:"Grands cercles lents, puis mains dans le dos, poitrine vers l'avant.",time:"1 min"},
    {n:3,title:"Activation omoplates",detail:"Bras écartés, serre les omoplates vers la colonne, tiens 2 s.",time:"10 reps lentes"},
    {n:4,title:"Série d'approche — tirage",detail:"1 série très légère, amplitude complète : sens tes dorsaux.",time:"1 série ×12-15"}]},
  others:{title:"Échauffement",sub:"5 min",steps:[
    {n:1,title:"Cardio léger",detail:"Monter la température, allure facile.",time:"3 min"},
    {n:2,title:"Mobilité hanches + chevilles",detail:"Cercles amples dans les deux sens.",time:"1 min"},
    {n:3,title:"Gainage court",detail:"20 s de planche pour réveiller le centre.",time:"20 s"}]}
};
WARMUP_MEL.push=WARMUP_MEL.legs; // SCULPT = fessiers aussi
WARMUP_MEL.maison={title:"Échauffement HOME",sub:"Tapis + élastique — 6 min",steps:[
  {n:1,title:"Monter la température",detail:"Montées de genoux sur place, talons-fesses, quelques squats sans charge.",time:"2 min"},
  {n:2,title:"Mobilité de hanche",detail:"Cercles de hanche · fente basse avec rotation · balancements de jambe.",time:"2 min"},
  {n:3,title:"🍑 Activation fessiers (élastique Jaune)",detail:"Pont fessier ×15 · clamshell 15/côté · pas de côté 15/sens. Sans ça, le hip thrust muscle les cuisses, pas les fesses.",time:"2 min"},
  {n:4,title:"Série d'approche",detail:"1 série de hip thrust maison sans élastique, amplitude complète.",time:"1 série ×15"}]};

// ── MOBILITÉ (Partie C du brief) — chaque position a sa FICHE complète (MOBI_DB) :
// photo vérifiée OU schéma SVG (jamais de carte sans visuel), pourquoi on la fait,
// les étapes numérotées niveau grande débutante, la dose en clair, ce qu'il faut
// sentir, les erreurs. Les durées « × 2 » n'existent plus : on écrit « côté droit,
// puis côté gauche » en toutes lettres.
var _SV='<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-height:190px;display:block;">';
var _FLOOR='<line x1="12" y1="118" x2="208" y2="118" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-linecap="round"/>';
var _BODY='<g stroke="#FF7EB6" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round">';
var MOBI_SVG={
rotth:_SV+_FLOOR+_BODY
 +'<line x1="150" y1="80" x2="78" y2="72"/><line x1="78" y1="72" x2="72" y2="114"/>'
 +'<line x1="150" y1="80" x2="150" y2="114"/><line x1="150" y1="114" x2="185" y2="114"/>'
 +'<polyline points="82,68 94,38 72,50"/></g>'
 +'<circle cx="52" cy="62" r="10" fill="#FF7EB6"/>'
 +'<path d="M120,50 A36 36 0 0 0 102,22" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round"/>'
 +'<polyline points="97,32 102,21 112,26" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
grenouille:_SV+_FLOOR
 +'<text x="110" y="16" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.55)" font-family="system-ui,sans-serif">vue de face — genoux très écartés</text>'
 +_BODY+'<line x1="110" y1="58" x2="110" y2="88"/>'
 +'<line x1="110" y1="62" x2="86" y2="70"/><line x1="86" y1="70" x2="80" y2="112"/>'
 +'<line x1="110" y1="62" x2="134" y2="70"/><line x1="134" y1="70" x2="140" y2="112"/>'
 +'<line x1="110" y1="88" x2="66" y2="110"/><line x1="66" y1="110" x2="48" y2="116"/>'
 +'<line x1="110" y1="88" x2="154" y2="110"/><line x1="154" y1="110" x2="172" y2="116"/></g>'
 +'<circle cx="110" cy="46" r="10" fill="#FF7EB6"/>'
 +'<polyline points="44,92 30,100 42,106" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
 +'<polyline points="176,92 190,100 178,106" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
n9090:_SV
 +'<text x="110" y="14" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.55)" font-family="system-ui,sans-serif">vue du dessus — tes jambes font deux équerres</text>'
 +'<rect x="34" y="24" width="152" height="94" rx="10" stroke="rgba(255,255,255,.15)" stroke-width="3" fill="none"/>'
 +_BODY+'<line x1="102" y1="60" x2="150" y2="60"/><line x1="150" y1="60" x2="150" y2="100"/>'
 +'<line x1="95" y1="66" x2="95" y2="104"/><line x1="95" y1="104" x2="55" y2="104"/></g>'
 +'<circle cx="95" cy="58" r="9" fill="#FF7EB6"/>'
 +'<path d="M141,60 L141,69 L150,69" stroke="#C88FE8" stroke-width="3" fill="none"/>'
 +'<path d="M95,95 L104,95 L104,104" stroke="#C88FE8" stroke-width="3" fill="none"/>'
 +'<text x="160" y="80" font-size="11" fill="#C88FE8" font-family="system-ui,sans-serif">90°</text>'
 +'<text x="108" y="92" font-size="11" fill="#C88FE8" font-family="system-ui,sans-serif">90°</text></svg>',
cercles:_SV+_FLOOR+_BODY
 +'<line x1="110" y1="36" x2="110" y2="70"/>'
 +'<polyline points="110,44 92,58 103,70"/><polyline points="110,44 128,58 117,70"/>'
 +'<line x1="110" y1="70" x2="96" y2="116"/><line x1="110" y1="70" x2="124" y2="116"/></g>'
 +'<circle cx="110" cy="26" r="10" fill="#FF7EB6"/>'
 +'<ellipse cx="110" cy="72" rx="38" ry="13" stroke="#C88FE8" stroke-width="4" fill="none" stroke-dasharray="7 7"/>'
 +'<polyline points="141,62 150,71 139,77" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
balance:_SV+_FLOOR
 +'<line x1="52" y1="68" x2="52" y2="116" stroke="rgba(255,255,255,.35)" stroke-width="5" stroke-linecap="round"/>'
 +'<line x1="42" y1="68" x2="62" y2="68" stroke="rgba(255,255,255,.35)" stroke-width="5" stroke-linecap="round"/>'
 +_BODY+'<line x1="98" y1="36" x2="98" y2="74"/><line x1="98" y1="46" x2="56" y2="66"/>'
 +'<line x1="98" y1="74" x2="98" y2="116"/><line x1="98" y1="74" x2="132" y2="102"/></g>'
 +'<line x1="98" y1="74" x2="64" y2="102" stroke="#FF7EB6" stroke-width="7" stroke-linecap="round" opacity=".3"/>'
 +'<circle cx="98" cy="26" r="10" fill="#FF7EB6"/>'
 +'<path d="M68,110 A46 46 0 0 0 130,110" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round"/>'
 +'<polyline points="62,102 67,111 76,107" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
 +'<polyline points="122,107 131,111 136,102" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
ecartmur:_SV+_FLOOR
 +'<text x="110" y="14" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.55)" font-family="system-ui,sans-serif">vue de face — fesses collées au mur</text>'
 +'<rect x="112" y="20" width="96" height="98" rx="6" fill="rgba(255,255,255,.06)"/>'
 +_BODY+'<line x1="58" y1="108" x2="140" y2="108"/>'
 +'<line x1="140" y1="108" x2="118" y2="30"/><line x1="140" y1="108" x2="180" y2="34"/></g>'
 +'<circle cx="44" cy="104" r="10" fill="#FF7EB6"/>'
 +'<polyline points="112,46 102,54 112,60" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
 +'<polyline points="184,50 196,56 188,66" stroke="#C88FE8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
happy:_SV+_FLOOR
 +'<text x="110" y="16" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.55)" font-family="system-ui,sans-serif">sur le dos — mains qui tiennent les pieds</text>'
 +_BODY+'<line x1="62" y1="110" x2="128" y2="108"/>'
 +'<line x1="128" y1="108" x2="118" y2="70"/><line x1="118" y1="70" x2="126" y2="42"/>'
 +'<line x1="150" y1="108" x2="158" y2="72" opacity=".35"/><line x1="158" y1="72" x2="166" y2="46" opacity=".35"/></g>'
 +'<line x1="70" y1="102" x2="122" y2="46" stroke="#FF7EB6" stroke-width="5" stroke-linecap="round"/>'
 +'<circle cx="127" cy="40" r="6" fill="#C88FE8"/>'
 +'<circle cx="167" cy="44" r="6" fill="#C88FE8" opacity=".35"/>'
 +'<circle cx="50" cy="106" r="10" fill="#FF7EB6"/></svg>'
};
var MOBI_DB={
chat:{img:'imgs/st_cat.jpg',vid:'imgs/vids/mobi_chat.mp4',
 why:"Réveille toute ta colonne, vertèbre par vertèbre, après la journée assise.",
 dose:"1 min en continu, très lentement",
 steps:["Mets-toi à quatre pattes : mains sous les épaules, genoux sous les hanches.",
  "En soufflant par la bouche, arrondis le dos vers le plafond, comme un chat qui s'étire. La tête se relâche vers le bas.",
  "En inspirant par le nez, fais l'inverse : creuse doucement le dos et regarde devant toi.",
  "Alterne les deux positions, lentement — environ 4 secondes chacune, pendant 1 minute."],
 feel:"Ton dos qui bouge morceau par morceau, du bassin jusqu'à la nuque.",
 errs:["Aller vite — c'est un réveil en douceur, pas du cardio","Bloquer ta respiration"]},
rotth:{svg:'rotth',vid:'imgs/vids/mobi_rotth.mp4',
 why:"Ouvre le haut du dos — celui qui se voûte devant l'écran toute la journée.",
 steps:["Mets-toi à quatre pattes, comme pour le chat-vache.",
  "Pose une main derrière ta tête, coude plié.",
  "Tourne lentement le haut du dos pour amener ce coude vers le plafond. Tes yeux suivent le coude.",
  "Redescends le coude lentement vers ton autre bras.",
  "Continue ce va-et-vient, sans à-coups, jusqu'à la fin du chrono. L'app te dira quand changer de côté."],
 feel:"Ça tourne et ça s'ouvre entre les omoplates. Ton bassin, lui, ne bouge pas du tout.",
 errs:["Tourner tout le corps au lieu du haut du dos","Tirer sur ta nuque avec la main"]},
fente:{img:'imgs/melati_hipflexor.jpg',vid:'imgs/vids/mobi_fente.mp4',
 why:"Étire le psoas, le muscle DEVANT la hanche, raccourci par les 8 h assise — c'est lui qui bascule ton bassin et pousse le ventre en avant.",
 steps:["Pose un genou au sol (mets un coussin dessous s'il est sensible), l'autre pied bien loin devant.",
  "Redresse le buste, mains sur la cuisse avant.",
  "Serre la fesse du côté du genou au sol, puis pousse doucement ton bassin vers l'AVANT. C'est tout le mouvement — quelques centimètres suffisent.",
  "Lève vers le plafond le bras du côté du genou au sol, et reste là en respirant.",
  "À chaque expiration, laisse le bassin avancer un tout petit peu plus."],
 feel:"Ça tire DEVANT la hanche de la jambe arrière, en haut de la cuisse. Inconfort 6-7/10 maximum, jamais de douleur.",
 errs:["Cambrer le bas du dos au lieu d'avancer le bassin","Pied avant trop près : le genou avant reste au-dessus de la cheville","Retenir ta respiration"]},
grenouille:{svg:'grenouille',
 why:"L'exercice n°1 de ton écart : il étire l'intérieur des cuisses en profondeur.",
 steps:["Mets-toi à quatre pattes, puis descends sur tes avant-bras.",
  "Écarte les genoux le plus possible, bien alignés. Les pieds suivent la ligne des genoux.",
  "Recule TRÈS doucement les fesses vers tes talons : l'intérieur des cuisses tire de plus en plus.",
  "Arrête-toi là où tu peux encore respirer calmement, et reste là sans bouger.",
  "À chaque expiration, recule d'un demi-centimètre si ton corps te laisse faire."],
 feel:"L'intérieur des deux cuisses qui tire. Si tu ne peux plus respirer calmement, tu es allée trop loin : reviens un peu.",
 errs:["Reculer d'un coup","Laisser le dos s'effondrer","Dépasser 7/10 d'inconfort"]},
papillon:{img:'imgs/melati_groin.jpg',vid:'imgs/vids/mobi_papillon.mp4',
 why:"Ouvre l'intérieur des cuisses et l'aine, en douceur.",
 steps:["Assieds-toi, colle les plantes de tes deux pieds l'une contre l'autre, talons ramenés vers toi.",
  "Attrape tes pieds avec les mains.",
  "Grandis-toi : imagine un fil qui tire le sommet de ta tête vers le plafond — c'est ça, le « dos long ».",
  "Laisse tes coudes appuyer doucement sur tes CUISSES (jamais sur les genoux) pour les rapprocher du sol.",
  "Reste là en respirant : à chaque expiration, les cuisses descendent un peu."],
 feel:"L'intérieur des cuisses qui s'ouvre. C'est le dos droit qui fait l'étirement, pas la tête qui plonge vers les pieds.",
 errs:["Appuyer sur les genoux au lieu des cuisses","Arrondir le dos","Faire rebondir les jambes"]},
n9090:{svg:'n9090',vid:'imgs/vids/mobi_9090.mp4',
 why:"Assouplit la rotation des hanches — celle des positions assises… et de tes tours de salsa.",
 steps:["Assieds-toi au sol, une jambe pliée en angle droit DEVANT toi (genou et pied posés au sol).",
  "Plie l'autre jambe en angle droit SUR LE CÔTÉ — tes deux jambes dessinent deux équerres, comme sur le schéma.",
  "Redresse le buste, droit et fier.",
  "Penche-toi lentement vers l'avant AU-DESSUS du genou avant, dos plat, mains posées au sol.",
  "Reste là en respirant, puis remonte doucement. L'app te dira quand changer de côté."],
 feel:"Ça tire dans la fesse de la jambe avant, côté extérieur. C'est normal : c'est exactement le muscle qu'on veut assouplir.",
 errs:["S'effondrer sur le côté au lieu de rester face au genou avant","Arrondir le dos en se penchant"]},
ischios:{img:'imgs/melati_ischios.jpg',
 why:"Étire l'arrière des cuisses — l'autre moitié de la souplesse des hanches. Une jambe à la fois : tu sens mieux, et chaque côté a sa vraie dose.",
 steps:["Allonge-toi sur le dos, les fesses proches d'un mur.",
  "Pose UNE jambe tendue sur le mur (le côté indiqué à l'écran). L'autre jambe reste pliée, pied au sol — ou allongée au sol si c'est plus confortable.",
  "Pas de mur libre ? Comme sur la photo : allongée, attrape la cuisse à deux mains et tends cette jambe vers le plafond.",
  "Relâche tout le reste : la nuque, les épaules, la mâchoire.",
  "Respire lentement. C'est la gravité qui travaille, pas toi. L'app te dira quand changer de jambe."],
 feel:"L'arrière de la cuisse qui tire doucement pendant que tout le reste se repose.",
 errs:["Plier les genoux pour tricher","Tirer fort avec les mains","Crisper les épaules"]},
enroul:{img:'imgs/melati_rolldown.jpg',vid:'imgs/vids/mobi_enroul.mp4',
 why:"Déplie tout le dos et détend — la meilleure façon de finir le travail debout.",
 dose:"45 s, très lentement",
 steps:["Debout, pieds écartés largeur du bassin, genoux légèrement pliés (jamais verrouillés).",
  "Laisse tomber la tête en avant, menton vers la poitrine.",
  "Enroule-toi vers le sol très lentement, comme si tu descendais vertèbre par vertèbre. Les bras pendent, tout mous.",
  "En bas, laisse-toi pendre 2-3 respirations, tête lourde. Peu importe où arrivent tes mains.",
  "Remonte encore plus lentement, en « rempilant » le dos morceau par morceau. La tête arrive en dernier."],
 feel:"Le dos qui se déroule cran par cran, la nuque complètement relâchée. Ça peut tirer un peu derrière les jambes : c'est normal.",
 errs:["Remonter d'un seul bloc, dos plat","Verrouiller les genoux","Forcer pour toucher le sol"]},
respi:{img:'imgs/melati_lyingknees.jpg',
 why:"Apprend à ton ventre ET à ton périnée à se relâcher — et prépare le sommeil.",
 dose:"6 grandes respirations lentes (~1 min 30)",
 steps:["Allonge-toi sur le dos, genoux pliés, pieds posés au sol (comme sur la photo).",
  "Pose une main sur ton ventre.",
  "Inspire par le nez pendant 4 secondes en gonflant le VENTRE : ta main doit monter, pas ta poitrine.",
  "Pendant l'inspiration, laisse la zone entre tes jambes (le périnée) se détendre et « descendre », sans jamais pousser.",
  "Expire lentement par la bouche pendant 6 secondes, comme dans une paille. Recommence."],
 feel:"Ta main qui monte et descend sur le ventre, les épaules immobiles, le cœur qui ralentit.",
 errs:["Respirer avec la poitrine","Forcer ou pousser — ici, tout est relâché"]},
kegel:{img:'imgs/melati_lyingknees.jpg',
 why:"Muscle ton périnée, le « plancher » de ton ventre. Utile à vie : gainage, grossesse un jour, plaisir.",
 dose:"8 contractions de 5 s, avec 5 s de repos entre chaque",
 steps:["Reste allongée, genoux pliés (assise, ça marche aussi).",
  "Contracte le périnée comme si tu retenais une envie de faire pipi. Rien d'autre ne bouge : ni les fesses, ni le ventre, ni les cuisses.",
  "Tiens 5 secondes, en continuant de respirer normalement.",
  "Relâche COMPLÈTEMENT pendant 5 secondes — le relâchement compte autant que la contraction.",
  "Recommence, 8 fois en tout. L'app chronomètre la minute pour toi."],
 feel:"Une petite remontée douce à l'intérieur du bassin, invisible de l'extérieur.",
 errs:["Serrer les fesses ou les abdos à la place","Bloquer ta respiration","Oublier de relâcher entre deux"]},
happy:{svg:'happy',vid:'imgs/vids/mobi_happy.mp4',
 why:"La position détente qui combine tout : hanches ouvertes, périnée relâché, bas du dos massé. Juste avant la tisane 🍵.",
 dose:"1 min 15, en respirant tranquillement",
 steps:["Allonge-toi sur le dos.",
  "Plie les genoux et ramène-les vers tes aisselles, de chaque côté du ventre.",
  "Attrape l'EXTÉRIEUR de tes pieds avec les mains (ou tes chevilles si c'est trop loin — aucune importance).",
  "Garde le bas du dos posé au sol et respire tranquillement.",
  "Si ça fait du bien, berce-toi doucement de droite à gauche."],
 feel:"Les hanches qui s'ouvrent sans effort, le bas du dos massé contre le sol. C'est censé être agréable — si ça tire fort, relâche un peu.",
 errs:["Décoller le bas du dos","Tirer sur la nuque pour attraper les pieds"]},
cercles:{svg:'cercles',
 why:"Réchauffe et déverrouille les hanches avant de les étirer — comme à l'échauffement d'un cours de danse.",
 dose:"1 min — 10 grands cercles dans un sens, puis 10 dans l'autre",
 steps:["Debout, pieds écartés largeur d'épaules, mains sur les hanches.",
  "Dessine de GRANDS cercles avec ton bassin, comme avec un hula hoop invisible. Le haut du corps reste tranquille.",
  "Fais 10 cercles dans un sens, puis 10 dans l'autre."],
 feel:"Les hanches qui chauffent et qui tournent de plus en plus rond à chaque tour.",
 errs:["Faire des petits cercles timides — vas-y franchement","Garder les genoux raides"]},
balance:{svg:'balance',vid:'imgs/vids/mobi_balance.mp4',
 why:"Réveille les hanches en mouvement : l'amplitude vient toute seule, sans forcer.",
 dose:"1 min 30 — 12 balancements par jambe, devant-derrière puis sur les côtés",
 steps:["Tiens-toi d'une main à un appui solide (dossier de chaise, mur).",
  "Balance une jambe tendue devant-derrière, comme un pendule, 12 fois. Souple et régulier, jamais lancé à fond.",
  "Puis balance la même jambe devant toi, de gauche à droite, 12 fois.",
  "Change de jambe et refais les deux."],
 feel:"La jambe qui monte un peu plus haut à chaque balancement, toute seule — c'est le mouvement qui ouvre, pas la force.",
 errs:["Balancer trop fort ou trop vite","Bouger tout le dos avec la jambe"]},
squatp:{img:'imgs/melati_deepsquat.jpg',vid:'imgs/vids/mobi_squatp.mp4',
 why:"La position accroupie complète : elle ouvre les hanches et les chevilles en même temps.",
 dose:"1 min 30 — 10 squats lents, 2 s en bas à chaque fois",
 steps:["Debout, pieds un peu plus écartés que les épaules, pointes légèrement vers l'extérieur.",
  "Descends TOUT en bas, comme pour t'asseoir entre tes talons. Les talons restent collés au sol.",
  "En bas, pousse doucement tes genoux vers l'extérieur avec tes coudes, buste fier.",
  "Reste 2 secondes en bas, puis remonte. Fais-en 10, lentement.",
  "Si tes talons décollent : écarte un peu plus les pieds, ou pose les talons sur un livre."],
 feel:"Les hanches qui s'ouvrent en position basse. C'est une position de repos que ton corps connaît depuis l'enfance.",
 errs:["Talons qui décollent","Descendre à moitié seulement","Regarder tes pieds — regarde devant toi"]},
pnf:{img:'imgs/melati_straddle.jpg',
 why:"La technique la plus efficace qui existe pour gagner de l'amplitude. C'est elle qui construit ton écart.",
 dose:"4 cycles guidés : 6 s de contraction, puis 25 s de relâchement",
 steps:["Assieds-toi jambes écartées au maximum CONFORTABLE, mains posées au sol devant toi.",
  "Quand l'app dit CONTRACTE : pendant 6 secondes, serre comme pour REFERMER les jambes — elles ne bougent pas, le sol résiste. À 50-60 % de ta force, pas plus.",
  "Quand l'app dit RELÂCHE : relâche tout d'un coup en expirant — ton corps « autorise » 2-3 cm de plus.",
  "Avance doucement les mains dans ce nouvel espace, et restes-y jusqu'au signal suivant.",
  "L'app enchaîne les 4 cycles toute seule : contente-toi de suivre."],
 feel:"Après chaque contraction, l'écart s'ouvre un peu plus, presque tout seul. Inconfort 6-7/10 max, jamais de douleur.",
 errs:["Contracter à 100 % (50-60 % suffit)","Rebondir","Te comparer à hier — compare-toi à il y a 3 semaines"]},
ecartmur:{svg:'ecartmur',
 why:"L'écart en toute sécurité : c'est la gravité qui travaille, impossible de forcer trop.",
 dose:"4 min, allongée, en respirant",
 steps:["Allonge-toi sur le dos, les fesses collées contre un mur, jambes tendues posées sur le mur.",
  "Laisse tes jambes s'écarter chacune de son côté, par leur propre poids. Tu n'as RIEN à faire.",
  "Pose les mains sur ton ventre et respire lentement.",
  "À chaque expiration, les jambes descendent d'un millimètre toutes seules. Reste comme ça 4 minutes.",
  "Pour sortir : ramène les jambes l'une vers l'autre avec les mains, puis roule sur le côté."],
 feel:"L'intérieur des cuisses qui tire doucement, de plus en plus bas au fil des minutes — sans aucun effort.",
 errs:["Appuyer sur tes jambes avec les mains pour accélérer","Retenir ta respiration","Si ça devient douloureux : rapproche un peu les jambes"]},
mollets:{img:'imgs/st_calf.jpg',vid:'imgs/vids/mobi_mollets.mp4',
 why:"Détend les mollets après la danse — tes chevilles te diront merci.",
 steps:["Face à un mur, pose tes deux mains dessus.",
  "Recule une jambe, bien tendue, le talon COLLÉ au sol. L'autre jambe est pliée devant.",
  "Avance doucement le bassin vers le mur, sans décoller le talon arrière.",
  "Reste là en respirant. L'app te dira quand changer de jambe."],
 feel:"Le mollet de la jambe arrière qui tire, du genou jusqu'au talon.",
 errs:["Talon arrière qui décolle","Pied arrière tourné vers l'extérieur — il doit pointer vers le mur"]}
};
// 28/09 (bug Melati « ça me dit jambe gauche et pas droite ») : pour chaque position D/G, QUELLE
// jambe/main travaille, en toutes lettres — « Côté droit » seul ne disait pas si c'est le genou au
// sol ou le pied devant, et la vidéo de démo ne montre qu'un seul côté.
var MOBI_SIDE={
 rotth:{droit:"Main DROITE derrière la tête : c'est ton coude droit qui monte vers le plafond.",gauche:"Main GAUCHE derrière la tête : c'est ton coude gauche qui monte vers le plafond."},
 fente:{droit:"Genou DROIT au sol, pied gauche devant : c'est l'avant de ta hanche droite qui s'étire.",gauche:"Genou GAUCHE au sol, pied droit devant : c'est l'avant de ta hanche gauche qui s'étire."},
 n9090:{droit:"Jambe DROITE pliée devant toi, la gauche sur le côté : penche-toi au-dessus du genou droit.",gauche:"Jambe GAUCHE pliée devant toi, la droite sur le côté : penche-toi au-dessus du genou gauche."},
 ischios:{droit:"Jambe DROITE tendue sur le mur, la gauche pliée au sol.",gauche:"Jambe GAUCHE tendue sur le mur, la droite pliée au sol."},
 mollets:{droit:"Jambe DROITE tendue en arrière, talon droit collé au sol.",gauche:"Jambe GAUCHE tendue en arrière, talon gauche collé au sol."}
};
var MOBI_SOIR=[
 {b:"Bloc 1 · Défaire la journée de bureau",items:[
  {k:'chat',n:"Chat-vache",d:60},
  {k:'rotth',n:"Rotation thoracique — droite",d:45},
  {k:'rotth',n:"Rotation thoracique — gauche",d:45}]},
 {b:"Bloc 2 · Les hanches & l'écart 🎯",items:[
  {k:'fente',n:"Fente basse + bras levé — droite",d:60},
  {k:'fente',n:"Fente basse + bras levé — gauche",d:60},
  {k:'grenouille',n:"Grenouille",d:120},
  {k:'papillon',n:"Papillon",d:90},
  {k:'n9090',n:"90/90 — droite",d:45},
  {k:'n9090',n:"90/90 — gauche",d:45}]},
 {b:"Bloc 3 · L'arrière du corps",items:[
  {k:'ischios',n:"Ischios au mur — droite",d:45},
  {k:'ischios',n:"Ischios au mur — gauche",d:45},
  {k:'enroul',n:"Enroulement debout",d:45}]},
 {b:"Bloc 4 · Périnée, respiration & sommeil",items:[
  {k:'respi',n:"Respiration diaphragmatique",d:90},
  {k:'kegel',n:"Kegel classique",d:60},
  {k:'happy',n:"Happy baby",d:75}]}
];
var MOBI_LONGUE=[
 {b:"Bloc 1 · Réchauffement articulaire",items:[
  {k:'cercles',n:"Cercles de hanches debout",d:60},
  {k:'balance',n:"Balancements de jambe",d:90},
  {k:'squatp',n:"Squats profonds",d:90}]},
 {b:"Bloc 2 · Les maintiens longs",items:[
  {k:'papillon',n:"Papillon",d:120},
  {k:'grenouille',n:"Grenouille",d:120},
  {k:'n9090',n:"90/90 — droite",d:120},
  {k:'n9090',n:"90/90 — gauche",d:120},
  {k:'fente',n:"Fente basse — droite",d:120},
  {k:'fente',n:"Fente basse — gauche",d:120}]},
 {b:"Bloc 3 · PNF contracté-relâché 🎯",items:[
  {k:'pnf',n:"Cycle 1 · contracte 6 s",d:6},
  {k:'pnf',n:"Cycle 1 · relâche + avance",d:25},
  {k:'pnf',n:"Cycle 2 · contracte 6 s",d:6},
  {k:'pnf',n:"Cycle 2 · relâche + avance",d:25},
  {k:'pnf',n:"Cycle 3 · contracte 6 s",d:6},
  {k:'pnf',n:"Cycle 3 · relâche + avance",d:25},
  {k:'pnf',n:"Cycle 4 · contracte 6 s",d:6},
  {k:'pnf',n:"Cycle 4 · relâche + avance",d:25}]},
 {b:"Bloc 4 · L'écart au mur",items:[
  {k:'ecartmur',n:"Écart au mur",d:240}]}
];
var SALSA_APRES=[
 {b:"Après le cours · muscles chauds 🔥",items:[
  {k:'mollets',n:"Mollets au mur — droite",d:45},
  {k:'mollets',n:"Mollets au mur — gauche",d:45},
  {k:'fente',n:"Fente basse psoas — droite",d:60},
  {k:'fente',n:"Fente basse psoas — gauche",d:60},
  {k:'papillon',n:"Papillon",d:90},
  {k:'ischios',n:"Ischios — droite",d:45},
  {k:'ischios',n:"Ischios — gauche",d:45},
  {k:'enroul',n:"Enroulé de dos",d:45}]}
];

// ══════════════════════ STATE & HELPERS ══════════════════════
var DBK='melati_db', LIVEK='melati_live';
var GOAL_KG=55, WEEK_GOAL=4, START_DATE='2026-08-11'; // objectif passé 3→4 séances/sem (Adrien, 04/09)
function $id(i){ return document.getElementById(i); }
function todayStr(d){ d=d||new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
var MOIS_FR=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function fmtDateFr(s){ if(!s) return '—'; var p=s.split('-'); return parseInt(p[2])+' '+MOIS_FR[parseInt(p[1])-1]+' '+p[0]; }
function fmtShort(s){ var p=s.split('-'); return p[2]+'/'+p[1]; }
function mondayOf(s){ var d=new Date(s+'T12:00:00'); var day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return todayStr(d); }
function addDays(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return todayStr(d); }
function formatTime(sec){ return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'); }
// Durée en français lisible : 45 → « 45 s », 90 → « 1 min 30 », 120 → « 2 min »
function fmtDur(s){ if(s<60) return s+' s'; var m=Math.floor(s/60),r=s%60; return r?m+' min '+(r<10?'0':'')+r:m+' min'; }

var DB;
try{ DB=JSON.parse(localStorage.getItem(DBK)||'null'); }catch(e){ DB=null; }
if(!DB) DB={v:3,weights:{},logs:[],mobiDays:{},tests:[],pesees:[],salsa:{},eau:{}};
// Clés garanties (aussi après adoption cloud / import de sauvegarde — voir dbNormalize)
//   mobiLog (26/08) : 'YYYY-MM-DD' -> [{id,n,ico,dur,min,at,feel,pain,pw,items:[{k,n,f}]}] — QUELLE routine,
//   ressenti global /5, douleur, et le ressenti facile/correct/dur/trop par position
//   pv (26/08) : « Nous deux » — mon petit mot pour Adrien {id,text,at} + id du dernier mot de lui que j'ai vu
function dbNormalize(){
  ['pesees','logs','tests'].forEach(function(k){ if(!DB[k]) DB[k]=[]; });
  ['salsa','eau','crea','mobiDays','weights','mobiLog'].forEach(function(k){ if(!DB[k]) DB[k]={}; });
  if(!DB.reminders) DB.reminders={};
  var reminderDefaults={enabled:false,hydrationEnabled:true,hydrationTimes:['08:30','14:30','19:00'],
    workoutEnabled:true,workoutNoonTime:'12:00',workoutEveningTime:'18:00',workoutStartedDate:'',
    sleepLogEnabled:false,bedtimeEnabled:false};
  Object.keys(reminderDefaults).forEach(function(k){
    if(DB.reminders[k]===undefined) DB.reminders[k]=Array.isArray(reminderDefaults[k])?reminderDefaults[k].slice():reminderDefaults[k];
  });
  var waterTimes=Array.isArray(DB.reminders.hydrationTimes)?DB.reminders.hydrationTimes.filter(function(time){
    return typeof time==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
  }):[];
  if(waterTimes.length>3){
    waterTimes=[0,1,2].map(function(i){ return waterTimes[Math.round((waterTimes.length-1)*i/2)]; });
  }
  DB.reminders.hydrationTimes=waterTimes.length?waterTimes:reminderDefaults.hydrationTimes.slice();
  if(!DB.health) DB.health={};
  if(!DB.healthMeta) DB.healthMeta={};
  if(!DB.pv) DB.pv={msg:null,seen:null};
  try{ melMigrateScores(); }catch(e){} // 28/09 : notes v2 gravées sur les séances d'avant (aussi après adoption cloud)
}
dbNormalize();
// 👟 Pas & activité (29/09) — module commun steps.js (chargé avant melati.js)
if(typeof STEPS!=='undefined') STEPS.init({app:'melati',db:function(){ return DB; },save:function(){ saveDB(); },toast:function(m){ showToast(m); },
  sb:function(){ return (typeof mlSb!=='undefined'&&mlSb&&_mlPullOk)?mlSb:null; },weekPtsMax:4,
  onChange:function(){ if(CURVIEW==='sante') renderAll(); }});
// Migration v3 : weights nombre → historique [{date,val}] (pour courbes + table progressions)
Object.keys(DB.weights).forEach(function(k){
  if(typeof DB.weights[k]==='number') DB.weights[k]=[{date:todayStr(),val:DB.weights[k]}];
});
// Seed charges de départ du programme (brief §6/§15) : baseline « départ → actuel » de la
// table de progression + options de courbe — one-shot, ne touche pas aux valeurs déjà saisies
Object.keys(EXOS).forEach(function(k){
  var e=EXOS[k];
  if(e.time||e.circuit||e.start==null) return;
  if(!DB.weights[k]||!DB.weights[k].length) DB.weights[k]=[{date:'2026-08-22',val:e.start}];
});
// Seed pesées (demande Adrien 23/08) : départ 71 kg le 11/08, 65 kg le 19/08 — one-shot, non destructif
if(!DB.seed2308){
  [{date:'2026-08-11',kg:71},{date:'2026-08-19',kg:65}].forEach(function(p){
    if(!DB.pesees.some(function(x){return x.date===p.date;})) DB.pesees.push(p);
  });
  DB.pesees.sort(function(a,b){return a.date.localeCompare(b.date);});
  DB.seed2308=true;
}
DB.v=3;
DB.app='melati'; // marqueur : la ligne user_state de CE compte appartient à l'app Melati
// Seed pesées v2 (dossier 00-PROFIL-MELATI 23/08) : 70 kg le 12/08 · 67 kg le 16/08 — non destructif
if(!DB.seed2308b){
  [{date:'2026-08-12',kg:70},{date:'2026-08-16',kg:67}].forEach(function(p){
    if(!DB.pesees.some(function(x){return x.date===p.date;})) DB.pesees.push(p);
  });
  DB.pesees.sort(function(a,b){return a.date.localeCompare(b.date);});
  DB.seed2308b=true;
}
// Pesées v3 (décision Adrien 24/08) : LA référence = les 2 InBody — 27/07 70,9 kg · 18/08 67,0 kg.
// Les valeurs approximatives d'autres balances (71 · 70 · 67 · 65) sont retirées une fois pour toutes ;
// tout ce que Melati a saisi APRÈS le 19/08 est conservé.
if(!DB.seed2408){
  DB.pesees=(DB.pesees||[]).filter(function(x){return x.date>'2026-08-19';});
  DB.pesees.push({date:'2026-07-27',kg:70.9},{date:'2026-08-18',kg:67});
  DB.pesees.sort(function(a,b){return a.date.localeCompare(b.date);});
  DB.seed2408=true;
}
// Chaque sauvegarde locale : ① numéro de version (le plus récent gagne côté cloud),
// ② écriture localStorage, ③ push cloud debouncé (si connectée)
function saveDB(){
  DB.rev=(DB.rev||0)+1;
  // (07/10, parité MASSUP) Garde anti-onglet périmé : si une AUTRE page (Safari / icône / onglet) a déjà
  // écrit une version plus récente sur ce téléphone, on ne l'écrase pas avec notre état vieux — on recharge.
  try{
    var s0=localStorage.getItem(DBK);
    if(s0){ var cur=JSON.parse(s0); if(cur&&(cur.rev||0)>DB.rev){ location.reload(); return; } }
  }catch(e){}
  try{ localStorage.setItem(DBK,JSON.stringify(DB)); }
  catch(e){ try{ showToast('⚠️ Sauvegarde sur le téléphone IMPOSSIBLE ('+((e&&e.name)||'erreur')+') — seule la synchro cloud te protège. Préviens Adrien !'); }catch(_e){} }
  try{ mlQueuePush(); }catch(e){}
}
saveDB();

function getW(k){ var a=DB.weights[k]; if(a&&a.length) return a[a.length-1].val; return EXOS[k]?(EXOS[k].start||0):0; }
function setW(k,v){
  v=Math.max(0,roundW(EXOS[k],v));
  var a=DB.weights[k]||[]; var t=todayStr();
  if(a.length&&a[a.length-1].date===t) a[a.length-1].val=v;
  else a.push({date:t,val:v});
  DB.weights[k]=a; saveDB();
}
function unite(e){ return e.time?(e.mins?'min':'s'):'kg'; }
function serieLabel(o,e){
  var n=o.sets||e.sets, lo=o.lo||e.lo, hi=o.hi||e.hi;
  var r=(lo===hi?lo:lo+'-'+hi);
  if(e.circuit) return n+' tours';
  return n+'×'+r+(e.time?(e.mins?' min':' s'):'')+(e.side?'/côté':'');
}
function weekStats(mon){
  var days=[]; for(var i=0;i<7;i++) days.push(addDays(mon,i));
  var logs=DB.logs.filter(function(l){return days.indexOf(l.date)>=0;});
  return {seances:logs.length,
    salsa:days.filter(function(d){return DB.salsa[d];}).length,
    eau:days.filter(function(d){return DB.eau[d];}).length,
    crea:days.filter(function(d){return DB.crea[d];}).length,
    mobi:days.filter(function(d){return DB.mobiDays[d];}).length,
    recs:logs.reduce(function(a,l){return a.concat(l.recs||[]);},[])};
}
function streakWeeks(){
  var n=0, m=mondayOf(todayStr());
  if(weekStats(m).seances>=WEEK_GOAL) n=1;
  for(;;){ var pm=addDays(m,-7); if(weekStats(pm).seances>=WEEK_GOAL){ n++; m=pm; } else break; }
  return n;
}
function suggestedSession(){
  var mains=DB.logs.filter(function(l){return ['A','B','C'].indexOf(l.sid)>=0;});
  if(!mains.length) return 'A';
  var last=mains[mains.length-1].sid;
  return last==='A'?'B':last==='B'?'C':'A';
}
// Meilleure perf passée d'un exo (poids max des logs · secondes/min max pour les exos au temps)
function bestPrev(k){
  var e=EXOS[k]; if(!e) return null;
  var best=null;
  DB.logs.forEach(function(l){ (l.exos||[]).forEach(function(x){
    if(x.k!==k||!(x.sets&&x.sets.length)) return;
    if(e.time){ var m=Math.max.apply(null,x.sets); if(best==null||m>best) best=m; }
    else if(x.w!=null&&(best==null||x.w>best)) best=x.w;
  });});
  return best;
}
function mobiStreak(){
  var n=0, d=new Date();
  if(!DB.mobiDays[todayStr()]) d.setDate(d.getDate()-1);
  for(;;){ var s=todayStr(d); if(DB.mobiDays[s]){ n++; d.setDate(d.getDate()-1); } else break; }
  return n;
}
// Confetti (one-shot, règle batterie) + toast MASSUP
var CF_COLORS=['#FF7EB6','#C88FE8','#9B8CFF','#FFC94D','#4D9DFF','#FF8452'];
function confetti(){
  var fx=$id('fx');
  for(var i=0;i<42;i++){
    var s=document.createElement('span');
    s.className='cf';
    s.style.left=(Math.random()*100)+'vw';
    s.style.background=CF_COLORS[i%CF_COLORS.length];
    s.style.animationDuration=(1.7+Math.random()*1.1)+'s';
    s.style.animationDelay=(Math.random()*.5)+'s';
    fx.appendChild(s);
  }
  setTimeout(function(){ fx.innerHTML=''; },3200);
}
var _toastT=null;
function showToast(msg){
  var t=$id('toast'); if(!t) return;
  t.innerHTML=msg; t.classList.add('show');
  if(_toastT) clearTimeout(_toastT);
  _toastT=setTimeout(function(){ t.classList.remove('show'); },2800);
  try{ if(navigator.vibrate) navigator.vibrate(40); }catch(e){}
}
// Chart.js lazy (comme MASSUP)
var _chartCbs=[],_chartLoading=false;
function loadChart(cb){
  if(window.Chart){ cb(); return; }
  _chartCbs.push(cb);
  if(_chartLoading) return;
  _chartLoading=true;
  var s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  s.onload=function(){ _chartCbs.forEach(function(f){ try{f();}catch(e){} }); _chartCbs=[]; };
  document.head.appendChild(s);
}

// ══════════════════════ NAVIGATION ══════════════════════
var CURVIEW='sante';
function switchView(name,btn){
  CURVIEW=name;
  document.querySelectorAll('.view').forEach(function(v){ v.classList.toggle('active',v.id==='view-'+name); });
  document.querySelectorAll('.bni').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderAll();
  window.scrollTo(0,0);
}
function renderHdate(){
  var el=$id('hdate'); if(!el) return;
  var jours=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  if(CURVIEW==='sante'){
    var lp=DB.pesees.length?DB.pesees[DB.pesees.length-1]:null;
    el.textContent='Bilan'+(lp?' · '+String(lp.kg).replace('.',',')+' kg':'');
  } else if(CURVIEW==='seances') el.textContent='Séances · '+jours[new Date().getDay()];
  else el.textContent='Progression';
}
function renderAll(){
  renderHdate();
  if(CURVIEW==='sante'){ renderBilanProfile(); renderBilanWeekNut(); try{ if(typeof STEPS!=='undefined') STEPS.renderCard(); }catch(e){} renderBilanLastWeek(); renderBilanSaison(); renderSanteChart(); renderSanteHisto(); renderBilanRecords();
    try{ if(typeof PV!=='undefined'){ PV.render(); PV.pull(false); } }catch(e){ console.warn('[Melati] PV:',e); } } // « Nous deux » 💞 tout en bas
  else if(CURVIEW==='seances'){ renderGymGreet(); }
  else { renderCal(); renderFreqChart(); renderMuscleVolume(); buildChartSelect(); renderProgressionTable(); renderLogSummary(); }
}

// ══════════════════════ BILAN ══════════════════════
// Barre de progression condensée de la carte profil (départ → objectif),
// jolie et simpliste — demande Adrien 23/08 soir
function miniSparkHtml(){
  var data=DB.pesees;
  if(!data.length) return '';
  var start=data[0].kg, cur=data[data.length-1].kg;
  var pct=Math.max(0,Math.min(100,(start-cur)/(start-GOAL_KG)*100));
  return '<div style="margin-top:.9rem;">'
    +'<div style="position:relative;height:10px;border-radius:100px;background:rgba(255,255,255,.08);overflow:visible;">'
    +'<div style="height:100%;width:'+pct.toFixed(1)+'%;border-radius:100px;background:var(--x-grad-2);"></div>'
    +'<div style="position:absolute;top:50%;left:'+pct.toFixed(1)+'%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#FF7EB6;border:2.5px solid #0B0D12;box-shadow:0 0 10px rgba(255,126,182,.6);"></div>'
    +'</div>'
    +'<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:.6rem;color:var(--mut);font-weight:600;margin-top:.45rem;">'
    +'<span>'+String(start).replace('.',',')+' kg</span>'
    +'<span>'+GOAL_KG+' kg</span>'
    +'</div></div>';
}
// Pesées OFFICIELLES toutes les 4 semaines (protocole 00-PROFIL §4) — les autres sont informatives
var OFFICIAL_PESEES=['2026-08-12','2026-09-09','2026-10-07','2026-11-04','2026-12-02','2026-12-30','2027-01-27','2027-02-24','2027-03-24','2027-04-21','2027-05-19','2027-06-16','2027-07-01'];
function nextOfficialPesee(){
  var t=todayStr();
  for(var i=0;i<OFFICIAL_PESEES.length;i++){ if(OFFICIAL_PESEES[i]>t) return fmtShort(OFFICIAL_PESEES[i]); }
  return '01/07 🏁';
}
function renderBilanProfile(){
  var el=$id('bilanProfile'); if(!el) return;
  var data=DB.pesees;
  var last=data.length?data[data.length-1]:null;
  var cur=last?last.kg:null;
  var h='<div class="bp-card bp-v2">'
    +'<div class="bp-head">'
    +'<div class="bp-avatar" style="font-size:1.35rem">👩🏻</div>'
    +'<div class="bp-id"><div class="bp-name">Melati</div>'
    +'<div class="bp-sub">21 ans · 164 cm · <strong style="color:var(--acc)">Perte de poids</strong></div></div>'
    +'</div>';
  if(cur!=null){
    h+='<div class="bp-weigh">'
      +'<div class="bp-weigh-main">'
      +'<div class="bp-weigh-lbl">DERNIÈRE PESÉE · '+fmtDateFr(last.date)+'</div>'
      +'<div style="font-size:.58rem;color:var(--mut);font-weight:600;margin:.15rem 0 .2rem;">📅 prochaine officielle : '+nextOfficialPesee()+'</div>'
      +'<div class="bp-weigh-v" style="font-size:2.3rem;color:var(--acc);text-shadow:0 0 22px rgba(255,126,182,.45);">'+String(cur).replace('.',',')+' <span class="bp-weigh-u">kg</span></div>'
      +'</div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pesée</button>'
      +'</div>';
    h+=miniSparkHtml();
  } else {
    h+='<div class="bp-weigh"><div class="bp-weigh-main"><div class="bp-weigh-lbl">AUCUNE PESÉE</div></div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pesée</button></div>';
  }
  h+='</div>';
  el.innerHTML=h;
}
// « Cette semaine » : salsa / eau / créatine — un tap = valider AUJOURD'HUI (données par date)
function renderBilanWeekNut(){
  var el=$id('bilanWeekNut'); if(!el) return;
  var wk=weekStats(mondayOf(todayStr()));
  var t=todayStr();
  function tile(kind,ico,count,denom,obj,name,objLbl){
    var on=!!DB[kind][t];
    var act=kind==='salsa'?'openSalsaPick()':"toggleDay('"+kind+"')";
    return '<button class="wn-tile'+(on?' on':'')+(count>=obj?' full':'')+'" onclick="'+act+'">'
      +'<span class="wn-ico">'+ico+'</span>'
      +'<span class="wn-count" style="margin:.2rem 0 .5rem;">'+count+'<small>/'+denom+'</small></span>'
      +'<span class="wn-lbl" style="color:var(--txt);font-weight:800;font-size:.68rem;letter-spacing:.02em;">'+name+'</span>'
      +'<span class="wn-lbl" style="margin-top:.15rem;">'+objLbl+'</span></button>';
  }
  // Bandeau mobilité compact sous les tuiles (la mobilité se valide via l'espace 🧘,
  // entre au calendrier et au bilan de semaine — pas de 4e tuile, demande Adrien 23/08)
  var mFill=Math.min(wk.mobi,5);
  var mSegs='';
  for(var i=0;i<5;i++) mSegs+='<span style="flex:1;height:5px;border-radius:100px;background:'+(i<mFill?'var(--x-grad-2)':'rgba(255,255,255,.09)')+';display:block;"></span>';
  el.innerHTML='<div class="wn-card">'
    +'<div class="wn-title">Cette semaine <span class="wn-hint">touche pour valider · salsa : tu choisis le jour</span></div>'
    +'<div class="wn-row">'
    +tile('salsa','💃',wk.salsa,3,3,'Salsa','obj : 3 / sem')
    +tile('eau','💧',wk.eau,7,7,'Eau','obj : 2,5 L / jour')
    +tile('crea','🧪',wk.crea,7,5,'Créatine','obj : 5 / sem')
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:.6rem;margin-top:.55rem;background:rgba(255,255,255,.035);border:1px solid var(--gb);border-radius:var(--x-r-md);padding:.55rem .8rem;">'
    +'<span style="font-size:.95rem;">🧘‍♀️</span>'
    +'<span style="font-size:.68rem;font-weight:800;">Mobilité</span>'
    +'<span style="flex:1;display:flex;gap:.3rem;align-items:center;">'+mSegs+'</span>'
    +'<span style="font-family:\'Saira\',system-ui,sans-serif;font-style:italic;font-weight:800;font-size:.9rem;">'+wk.mobi+'<small style="color:var(--mut);font-size:.62rem;font-weight:600;">/5</small></span>'
    +'</div>'
    +'</div>';
}
function toggleDay(kind){
  var t=todayStr();
  if(DB[kind][t]) delete DB[kind][t]; else DB[kind][t]=true;
  saveDB(); renderBilanWeekNut();
}
// ── Salsa : choix du JOUR (27/08, demande Adrien) ──
// La tuile ouvre un mini-calendrier : Melati touche le jour où elle a dansé. Données par date
// (DB.salsa[ds]=true) → une salsa max par jour, et un jour de la semaine dernière alimente la
// note de la semaine dernière (weekStats est par date), pas le compteur en cours.
var SP_Y=0,SP_M=0;
function openSalsaPick(){
  var d=new Date(); SP_Y=d.getFullYear(); SP_M=d.getMonth();
  renderSalsaPick(); $id('salsaModal').classList.add('open');
}
function closeSalsaPick(){ $id('salsaModal').classList.remove('open'); }
function salsaPrev(){ SP_M--; if(SP_M<0){SP_M=11;SP_Y--;} renderSalsaPick(); }
function salsaNext(){
  var d=new Date(); if(SP_Y>d.getFullYear()||(SP_Y===d.getFullYear()&&SP_M>=d.getMonth())) return;
  SP_M++; if(SP_M>11){SP_M=0;SP_Y++;} renderSalsaPick();
}
function renderSalsaPick(){
  var months=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  var mEl=$id('salsaMonth'); if(!mEl) return;
  mEl.textContent=months[SP_M]+' '+SP_Y;
  var now=new Date(), atNow=(SP_Y===now.getFullYear()&&SP_M===now.getMonth());
  var nb=$id('salsaNextBtn'); if(nb){ nb.style.opacity=atNow?'.3':'1'; nb.style.pointerEvents=atNow?'none':'auto'; }
  var grid=$id('salsaGrid'); grid.innerHTML='';
  ['L','M','M','J','V','S','D'].forEach(function(d){ var el=document.createElement('div'); el.className='cal-day-name'; el.textContent=d; grid.appendChild(el); });
  var first=new Date(SP_Y,SP_M,1).getDay(), offset=(first===0)?6:first-1;
  var days=new Date(SP_Y,SP_M+1,0).getDate();
  var today=todayStr(), mon=mondayOf(today), sun=addDays(mon,6);
  for(var i=0;i<offset;i++){ var em=document.createElement('div'); em.className='cal-day empty'; grid.appendChild(em); }
  for(var d=1;d<=days;d++){
    var ds=SP_Y+'-'+String(SP_M+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var el=document.createElement('div');
    var cls='cal-day'+(ds===today?' today':'');
    if(ds>today) cls+=' sp-future';
    else if(ds>=mon&&ds<=sun) cls+=' sp-wk';
    if(DB.salsa[ds]) cls+=' sp-on';
    el.className=cls; el.textContent=d;
    if(ds<=today){ el.dataset.date=ds; el.addEventListener('click',function(){ salsaToggleDate(this.dataset.date); }); }
    grid.appendChild(el);
  }
  var wk=weekStats(mon), lwk=weekStats(addDays(mon,-7));
  $id('salsaFoot').innerHTML='<span>Cette semaine <strong>'+wk.salsa+'</strong><small>/3</small></span>'
    +'<span>Semaine dernière <strong>'+lwk.salsa+'</strong><small>/3</small></span>';
}
function salsaToggleDate(ds){
  var today=todayStr(); if(!ds||ds>today) return;
  var added;
  if(DB.salsa[ds]){ delete DB.salsa[ds]; added=false; } else { DB.salsa[ds]=true; added=true; }
  saveDB();
  renderSalsaPick(); renderBilanWeekNut(); renderBilanLastWeek(); renderBilanSaison();
  if(CURVIEW!=='sante'&&$id('calGrid')) renderCal();
  var mon=mondayOf(today), lastMon=addDays(mon,-7);
  var when=ds===today?'aujourd’hui':'le '+fmtShort(ds);
  var where=ds>=mon?'':ds>=lastMon?' · comptée dans ta semaine dernière':' · comptée dans la semaine du '+fmtShort(mondayOf(ds));
  showToast(added?'💃 Salsa notée '+when+where:'Salsa retirée '+when);
}
// « Ta semaine dernière » — verdict HONNÊTE en langage simple (retour Adrien 23/08 :
// savoir dire ce qui ne va pas, à une débutante, sans culpabiliser)
// 29/09 (retour Adrien : « le truc note de semaine est nul, fais comme moi ») : la section « Notes /20 »
// de MASSUP à l'identique (bn-v2) — bandeau saison, semaine en cours en HÉROS, les 2 d'avant, le
// dernier mois, flèche vers les anciennes semaines. Couleur = règle Melati (4/4 gold · 3/4 vert).
function renderBilanLastWeek(){ var el=$id('bilanLastWeek'); if(el) el.innerHTML=''; }
var _bnMore=false;
function bnToggleMore(){ _bnMore=!_bnMore; renderBilanSaison(); }
var SEASON_MEL={start:'2026-08-11',end:'2027-07-01',k:'Saison 1',t:'SCULPT'};
function renderBilanSaison(){
  var el=$id('bilanSaison'); if(!el) return;
  var today=todayStr(), curWs=mondayOf(today);
  var nW=Math.round((new Date(SEASON_MEL.end)-new Date(SEASON_MEL.start))/604800000);
  var wkNum=Math.max(1,Math.min(nW,Math.floor((new Date(today)-new Date(SEASON_MEL.start))/604800000)+1));
  function noteHtml(n,cls){ return '<span class="bn-note '+cls+'">'+String(n).replace('.',',')+'<small>/20</small></span>'; }
  function det(w){ return w.salle+'/'+WEEK_GOAL+' séances · '+w.act+'/5 activités'+(w.stepAvg!=null?' · 👟 '+String(Math.round(w.stepAvg/100)/10).replace('.',',')+'k':'')+(w.avg!=null?' · exéc. '+String(Math.round(w.avg*10)/10).replace('.',',')+'/20':''); }
  function row(lbl,d,n,cls,click,compact){
    return '<div class="bn-row'+(compact?' compact':'')+'"'+(click?' onclick="'+click+'"':'')+'><span class="bn-lbl">'+lbl+'</span><span class="bn-detail">'+d+'</span>'+noteHtml(n,cls)+'</div>';
  }
  var B0=melWeekNote(curWs), c0=melWkCls(B0);
  var h='<div class="bn-card bn-v2">';
  h+='<div class="bn-season"><span class="bn-season-k">'+SEASON_MEL.k+'</span><span class="bn-season-t">'+SEASON_MEL.t+'</span>'
    +'<span class="bn-season-sub">11 août → 1er juil · semaine '+wkNum+'/'+nW+'</span></div>';
  h+='<div class="bn-hero" onclick="wkOpen(\''+curWs+'\')">'
    +'<div class="bn-hero-note '+c0+'"><span class="bn-hero-v">'+String(B0.note).replace('.',',')+'</span><span class="bn-hero-sur">/20</span></div>'
    +'<div class="bn-hero-side"><span class="bn-hero-lbl">Cette semaine</span>'
    +'<span class="bn-hero-det">'+det(B0)+'</span>'
    +'<span class="bn-hero-bar"><i class="'+c0+'" style="width:'+Math.max(4,Math.min(100,B0.note/20*100))+'%"></i></span></div>'
    +'<span class="bn-hero-arr">›</span></div>';
  for(var i=1;i<=2;i++){
    var ws=addDays(curWs,-7*i); if(ws<mondayOf(SEASON_MEL.start)) break;
    var B=melWeekNote(ws); if(!B.salle&&!B.salsa) continue;
    h+=row('Sem. du '+fmtShort(ws),det(B),B.note,melWkCls(B),'wkOpen(\''+ws+'\')');
  }
  var pm=new Date(parseInt(today.slice(0,4),10),parseInt(today.slice(5,7),10)-2,1);
  var pmk=pm.getFullYear()+'-'+String(pm.getMonth()+1).padStart(2,'0');
  var M=pmk>=SEASON_MEL.start.slice(0,7)?melMonthNote(pmk):null;
  if(M&&M.salle){
    h+='<div class="bn-sep">Dernier mois</div>';
    h+=row(MOIS_FR[pm.getMonth()].charAt(0).toUpperCase()+MOIS_FR[pm.getMonth()].slice(1)+' '+pm.getFullYear(),M.salle+' séances',M.note,note20Cls(M.note),'');
  }
  var older='';
  for(var j=3;j<=12;j++){
    var ws2=addDays(curWs,-7*j); if(ws2<mondayOf(SEASON_MEL.start)) break;
    var B2=melWeekNote(ws2); if(!B2.salle&&!B2.salsa) continue;
    older+=row(fmtShort(ws2),B2.salle+'/'+WEEK_GOAL+' · '+B2.act+'/5',B2.note,melWkCls(B2),'wkOpen(\''+ws2+'\')',true);
  }
  if(older){
    h+='<button class="bn-more" onclick="bnToggleMore()">'+(_bnMore?'▾ Masquer les anciennes semaines':'▸ Toutes les semaines de la saison')+'</button>';
    if(_bnMore) h+='<div class="bn-older">'+older+'</div>';
  }
  h+='<div style="font-size:.58rem;color:var(--mut);font-weight:600;margin-top:.55rem;line-height:1.5;">🥇 4/4 salles · 🟢 3/4 · 5 activités min (salle + salsa) · eau et créatine hors note</div>';
  h+='</div>';
  el.innerHTML=h;
}
// Courbe pesées (Chart.js, comme la vue Bilan MASSUP) + ligne objectif 55 en pointillés
var santeChart=null;
function renderSanteChart(){
  var wrap=$id('santeChart')?$id('santeChart').parentElement:null;
  var empty=$id('santeEmpty');
  if(!wrap) return;
  if(DB.pesees.length<2){
    wrap.style.display='none'; if(empty) empty.style.display='block';
    return;
  }
  wrap.style.display='block'; if(empty) empty.style.display='none';
  loadChart(function(){
    var labels=DB.pesees.map(function(p){return fmtShort(p.date);});
    var vals=DB.pesees.map(function(p){return p.kg;});
    var goal=vals.map(function(){return GOAL_KG;});
    var ctx=$id('santeChart').getContext('2d');
    if(santeChart){
      santeChart.data.labels=labels;
      santeChart.data.datasets[0].data=vals;
      santeChart.data.datasets[1].data=goal;
      santeChart.update('none');
      return;
    }
    santeChart=new Chart(ctx,{type:'line',
      data:{labels:labels,datasets:[
        {label:'Poids (kg)',data:vals,borderColor:'#FF7EB6',backgroundColor:'rgba(255,126,182,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#FF7EB6',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true},
        {label:'Objectif',data:goal,borderColor:'rgba(200,143,232,.6)',borderWidth:1.5,borderDash:[5,5],pointRadius:0,fill:false}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{filter:function(i){return i.datasetIndex===0;},callbacks:{label:function(c){return c.parsed.y+' kg';}}}},
        scales:{x:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  });
}
// Historique pesées — TOUT est modifiable (input) et supprimable (✕), demande Adrien 23/08
function toggleSanteHisto(){
  var s=$id('santeHistoSection'), t=$id('santeHistoToggle');
  var open=!s.classList.contains('open');
  s.classList.toggle('open',open); t.classList.toggle('open',open);
}
function renderSanteHisto(){
  var el=$id('santeHisto'); if(!el) return;
  if(!DB.pesees.length){ el.innerHTML='<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:.8rem;">Aucune pesée encore.</div>'; return; }
  var h='<div class="wh-list" style="padding:.2rem .85rem;">';
  DB.pesees.slice().reverse().forEach(function(p,i,arr){
    var prev=arr[i+1];
    var dl=prev?Math.round((p.kg-prev.kg)*10)/10:null;
    var dlStr=dl==null?'':'<span style="font-size:.64rem;color:'+(dl<0?'var(--acc)':dl>0?'#FF6B7A':'var(--mut)')+';font-weight:700;margin-right:.4rem">'+(dl>0?'+':'')+String(dl).replace('.',',')+'</span>';
    h+='<div class="wh-entry">'
      +'<span class="wh-entry-date">'+fmtDateFr(p.date)+'</span>'
      +dlStr
      +'<span class="wh-entry-val"><input class="wh-entry-input" type="number" step="0.1" min="30" value="'+p.kg+'" onblur="editPesee(\''+p.date+'\',this)" onkeydown="if(event.key===\'Enter\')this.blur()"/> kg</span>'
      +'<button class="wh-entry-del" onclick="deletePesee(\''+p.date+'\')" title="Supprimer">✕</button>'
      +'</div>';
  });
  h+='</div><div class="wh-edit-hint" style="padding:0 .85rem .5rem;">✏️ Touche une valeur pour corriger — tout reste modifiable.</div>';
  el.innerHTML=h;
}
function editPesee(date,input){
  var p=DB.pesees.find(function(x){return x.date===date;}); if(!p) return;
  var v=parseFloat(input.value);
  if(isNaN(v)||v<30||v>200){ input.value=p.kg; return; }
  v=Math.round(v*10)/10;
  if(v===p.kg) return;
  p.kg=v; saveDB();
  renderBilanProfile(); renderSanteChart(); renderSanteHisto(); renderHdate();
  showToast('✅ '+fmtShort(date)+' corrigé : '+String(v).replace('.',',')+' kg');
}
function deletePesee(date){
  DB.pesees=DB.pesees.filter(function(x){return x.date!==date;});
  saveDB();
  renderBilanProfile(); renderSanteChart(); renderSanteHisto(); renderHdate();
  showToast('Pesée du '+fmtShort(date)+' supprimée');
}
function renderBilanRecords(){
  var el=$id('bilanRecords'); if(!el) return;
  var recs=[];
  DB.logs.slice().reverse().some(function(l){
    (l.recs||[]).forEach(function(r){ if(recs.length<5) recs.push({date:l.date,msg:r}); });
    return recs.length>=5;
  });
  if(!recs.length){
    el.innerHTML='<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:1rem;line-height:1.6">Chaque charge validée s’affichera ici — une preuve que personne ne peut te retirer 💗</div>';
    return;
  }
  el.innerHTML=recs.map(function(r){
    return '<div class="mel-rec-row"><span class="d">'+fmtShort(r.date)+'</span><span>🏆 '+r.msg+'</span></div>';
  }).join('');
}
// ── Modal pesée (date + poids, comme MASSUP) ──
function openPeseeModal(){
  $id('peseeDate').value=todayStr();
  var lp=DB.pesees.length?DB.pesees[DB.pesees.length-1].kg:65;
  $id('peseeWeight').value=lp;
  $id('peseeModal').classList.add('open');
}
function closePeseeModal(){ $id('peseeModal').classList.remove('open'); }
function peseeAdjust(d){
  var i=$id('peseeWeight');
  i.value=String(Math.round((parseFloat(i.value||65)+d)*10)/10);
}
function savePesee(){
  var date=$id('peseeDate').value||todayStr();
  var v=parseFloat($id('peseeWeight').value);
  if(isNaN(v)||v<30||v>200){ showToast('Hmm, ce poids a l’air bizarre 🤔'); return; }
  v=Math.round(v*10)/10;
  var ex=DB.pesees.find(function(p){return p.date===date;});
  if(ex) ex.kg=v; else DB.pesees.push({date:date,kg:v});
  DB.pesees.sort(function(a,b){return a.date.localeCompare(b.date);});
  saveDB(); closePeseeModal();
  renderBilanProfile(); renderSanteChart(); renderSanteHisto(); renderHdate();
  showToast('⚖️ '+String(v).replace('.',',')+' kg enregistré');
}

// ══════════════════════ SÉANCES ══════════════════════
function renderGymGreet(){
  var el=$id('gymGreet'); if(!el) return;
  var count=weekStats(mondayOf(todayStr())).seances;
  var sub;
  if(count<=0) sub='C\'est parti pour la semaine ! 🌸';
  else if(count<WEEK_GOAL) sub='Plus que <strong>'+(WEEK_GOAL-count)+'</strong> pour valider ta semaine 🎯';
  else if(count>WEEK_GOAL) sub='En feu cette semaine ! 🔥';
  else sub='Objectif atteint, semaine validée ! ✅';
  el.innerHTML='<div class="gym-greet-count"><span class="ggc-num">'+count+'</span><span class="ggc-goal">/ '+WEEK_GOAL+'</span>'
    +'<span class="ggc-cap">séance'+(count>1?'s':'')+'<br>cette semaine</span></div>'
    +'<div class="gym-greet-sub">'+sub+'</div>'
    +'<div class="gg-actions">'
    +'<button class="gg-btn gg-live" onclick="asOpen()" title="LiveUp — nouvelle séance">＋</button>'
    +'<button class="gg-btn" onclick="dzOpen()" title="Mobilité — souplesse &amp; écart">🧘</button>'
    +'</div>';
}
function buildWarmup(sid,t){
  var w=WARMUP_MEL[t]; if(!w) return '';
  var steps=w.steps.map(function(s){
    return '<div class="warmup-step"><div class="ws-num">'+s.n+'</div>'
      +'<div class="ws-content"><div class="ws-title">'+s.title+'</div>'
      +'<div class="ws-detail">'+s.detail+'</div>'
      +'<div class="ws-time">'+s.time+'</div></div></div>';
  }).join('');
  return '<button class="warmup-btn" id="wubtn-'+sid+'" onclick="toggleWarmup(\''+sid+'\')">'
    +'🔥 Échauffement <span class="wb-arr">▾</span></button>'
    +'<div class="warmup-body" id="wubody-'+sid+'">'
    +'<div class="warmup-hdr"><div class="warmup-hdr-title">'+w.title+'</div>'
    +'<div class="warmup-hdr-sub">'+w.sub+'</div></div>'
    +'<div>'+steps+'</div>'
    +'<div class="warmup-note">L\'activation fessiers est l\'étape que tout le monde saute — et la plus importante pour TOI.</div>'
    +'</div>';
}
function toggleWarmup(sid){
  var btn=$id('wubtn-'+sid), body=$id('wubody-'+sid);
  if(!btn||!body) return;
  var open=body.classList.contains('open');
  btn.classList.toggle('open',!open); body.classList.toggle('open',!open);
}
function buildSeances(){
  var gridMain=$id('sgridMain'), gridMini=$id('sgridMini'), panelsDiv=$id('panels');
  if(!gridMain||!gridMini||!panelsDiv) return;
  gridMain.innerHTML=''; gridMini.innerHTML=''; panelsDiv.innerHTML='';
  gridMini.classList.toggle('cols3',DATA.length-1===3); // BOOTY héros + 3 petites (STRONGER · SCULPT · HOME)
  DATA.forEach(function(s,si){
    // BOOTY = LA séance : carte héros pleine largeur ; STRONGER + SCULPT en dessous, plus petites
    var mini=si>=1;
    var grid=mini?gridMini:gridMain;
    var card=document.createElement('div');
    card.className='sc'+(si===0?' active':'')+(mini?' sc-mini':'');
    card.dataset.t=s.t; card.dataset.id=s.id;
    card.addEventListener('click',function(){ selectSeance(s.id); });
    if(si===0){
      card.style.gridColumn='1 / -1';
      card.style.padding='1.45rem 1.3rem';
      card.innerHTML='<span class="sc-ico" style="font-size:2rem;">'+s.icon+'</span><div class="sc-name" style="font-size:1.35rem;">'+s.name+'</div><div class="sc-sub" style="font-size:.72rem;">'+s.sub+' · la séance n°1 de ton objectif</div>';
    } else {
      card.innerHTML='<span class="sc-ico">'+s.icon+'</span><div class="sc-name">'+s.name+'</div><div class="sc-sub">'+s.sub+'</div>';
    }
    grid.appendChild(card);

    var mainExos=s.exos.filter(function(e){return !e.bonus;});
    var bonusExos=s.exos.filter(function(e){return e.bonus;});
    var total=0; mainExos.forEach(function(o){ total+=o.sets||EXOS[o.key].sets; });

    function buildExo(o,ei,dispNum){
      var e=EXOS[o.key];
      var w=getW(o.key);
      var un=unite(e);
      var hasImg=IMGS[o.key]||EXO_VID[o.key];
      var isKg=!e.time&&!e.circuit;
      var n=o.sets||e.sets, lo=o.lo||e.lo, hi=o.hi||e.hi;
      var rlbl=(lo===hi?lo:lo+'-'+hi)+(e.time?(e.mins?' min':' s'):'')+(e.side?'/côté':'');
      var sets='';
      for(var k2=1;k2<=n;k2++) sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+k2+'" onclick="toggleSet(\''+s.id+'\','+ei+','+k2+','+n+','+(o.rest!=null?o.rest:e.rest)+')"><span>Série '+k2+'</span><span class="sbbl-r">'+rlbl+'</span></div>';
      var tips=(e.tips||[]).map(function(t2){return '<div class="tip"><div class="tdot"></div>'+t2+'</div>';}).join('');
      var errs=(e.errs||[]).map(function(er){return '<div class="erritem"><span class="errx">✕</span>'+er+'</div>';}).join('');
      var impTag=e.imp?'<span class="ex-imp-tag" title="Exercice clé pour ton profil">Clé</span>':'';
      var wchip=isKg?'<span class="chip cw" id="chip-w-'+s.id+'-'+o.key+'">⚖️ '+wTxt(e,w,true)+(e.side&&!e.dumb&&!e.band?'/côté':'')+'</span>':'';
      var wdArr=DB.weights[o.key];
      var wdate=(wdArr&&wdArr.length)?wdArr[wdArr.length-1].date:null;
      return '<div class="ex'+(o.bonus?' ex-bonus':'')+(e.imp?' ex-imp':'')+'" id="ex-'+s.id+'-'+ei+'">'
        +'<button class="exbtn" onclick="toggleEx(\''+s.id+'\','+ei+')">'
        +'<div class="exnum">'+dispNum+'</div>'
        +'<div class="exinf"><div class="exname">'+e.name+impTag+'</div>'
        +'<div class="exmeta">'+wchip+'<span class="chip cs">📊 '+serieLabel(o,e)+'</span>'+(o.note?'<span class="chip chip-'+s.t+'">'+o.note+'</span>':'')+'</div></div>'
        +'<div class="exarr">▾</div></button>'
        +'<div class="exbody"><div class="exinner'+(hasImg?'':' no-demo')+'">'
        +(hasImg?'<div class="demo'+(EXO_VID[o.key]?' demo-vid':'')+'">'+exoMedia(o.key,e.name,false)+(EXO_VID[o.key]?'':'<div class="demo-lbl">Démonstration</div>')+'</div>':'')
        +'<div class="exc">'
        +(isKg?('<div><div class="seclbl">'+(e.band?'Élastique actuel':'Poids actuel')+'</div>'
          +'<div class="weight-row"><button class="wbtn minus" onclick="changeWeight(\''+o.key+'\',-'+(e.inc||1)+',\''+s.id+'\')">−</button>'
          +(e.band?'<div class="weight-input band-lbl" id="wval-'+s.id+'-'+o.key+'">'+bandHtml(w)+'</div>'
            :'<input class="weight-input" id="wval-'+s.id+'-'+o.key+'" type="number" step="'+e.inc+'" min="0" value="'+w+'" onblur="setWeightDirect(this,\''+o.key+'\',\''+s.id+'\')" onkeydown="if(event.key===\'Enter\')this.blur()"/>'
            +'<span class="weight-unit">'+(e.dumb?'kg/main':'kg')+'</span>')
          +'<button class="wbtn plus" onclick="changeWeight(\''+o.key+'\','+(e.inc||1)+',\''+s.id+'\')">+</button></div>'
          +'<div class="weight-date" id="wdate-'+s.id+'-'+o.key+'">'+(wdate?'Dernière modif. : '+fmtDateFr(wdate):'Charge de départ du programme')+'</div></div>'):'')
        +'<div><div class="seclbl">Séries — clique pour cocher</div><div class="srow" id="srow-'+s.id+'-'+ei+'">'+sets+'</div></div>'
        +'<div class="rest-timer" id="timer-'+s.id+'-'+ei+'">'
        +'<div class="rt-circle"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="fg" id="rtfg-'+s.id+'-'+ei+'" cx="22" cy="22" r="18" fill="none" stroke="#FF7EB6" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"/></svg></div>'
        +'<div class="rt-info"><div class="rt-label">Repos</div><div class="rt-time" id="rtt-'+s.id+'-'+ei+'">'+formatTime(o.rest!=null?o.rest:e.rest)+'</div><div class="rt-msg">Série terminée !</div></div>'
        +'<button class="rt-stop" onclick="stopPanelTimer(\''+s.id+'\','+ei+')">✕</button>'
        +'</div>'
        +'<div class="cue"><div class="cuelbl">➡ La clé</div><div class="cuetxt">'+e.cue+'</div>'+(e.bless?'<div class="cue-bless">💡 '+e.bless+'</div>':'')+'</div>'
        +'<div><div class="seclbl">Conseils</div><div class="tips">'+tips+'</div></div>'
        +'<div class="errs"><div class="errlbl">⚠ Erreurs à éviter</div>'+errs+'</div>'
        +'</div></div></div></div>';
    }

    var mainHtml='', bonusHtml='', mainNo=0, bonusNo=0;
    s.exos.forEach(function(o,ei){
      if(o.bonus){ bonusNo++; bonusHtml+=buildExo(o,ei,'B'+bonusNo); }
      else { mainNo++; mainHtml+=buildExo(o,ei,('0'+mainNo).slice(-2)); }
    });
    var bonusBlock='';
    if(bonusExos.length){
      bonusBlock='<button class="bonus-btn" id="bonusbtn-'+s.id+'" onclick="toggleBonusBlk(\''+s.id+'\')">'
        +'⭐ Exercices bonus <span class="bb-ct">+'+bonusExos.length+'</span><span class="wb-arr">▾</span></button>'
        +'<div class="bonus-body" id="bonusbody-'+s.id+'">'+bonusHtml+'</div>';
    }
    var panel=document.createElement('div');
    panel.className='panel'+(si===0?' active':'');
    panel.id='panel-'+s.id; panel.dataset.t=s.t;
    panel.innerHTML='<div class="phdr"><div class="ptw"><div class="plbl">'+s.num+' · '+s.icon+'</div><div class="ptitle">'+s.name+'</div><div class="psub">'+s.sub+' · ~'+s.dur+' min</div></div>'
      +'<div class="pstats"><div><div class="sv">'+mainExos.length+'</div><div class="sl">Exercices</div></div><div><div class="sv">'+total+'</div><div class="sl">Séries</div></div></div></div>'
      +buildWarmup(s.id,s.t)
      +'<div class="exlist">'+mainHtml+bonusBlock+'</div>'
      +'<button class="launch-btn" onclick="asOpenWith(\''+s.id+'\')">▶ Lancer '+s.name+' en LiveUp</button>';
    panelsDiv.appendChild(panel);
  });
}
function selectSeance(id){
  document.querySelectorAll('.sc').forEach(function(c){c.classList.toggle('active',c.dataset.id===id);});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('active',p.id==='panel-'+id);});
  document.querySelectorAll('.ex').forEach(function(e){e.classList.remove('open');});
}
function toggleBonusBlk(sid){
  var btn=$id('bonusbtn-'+sid), body=$id('bonusbody-'+sid);
  if(!btn||!body) return;
  var open=body.classList.contains('open');
  btn.classList.toggle('open',!open); body.classList.toggle('open',!open);
}
function toggleEx(sid,idx){
  var card=$id('ex-'+sid+'-'+idx);
  var wasOpen=card.classList.contains('open');
  document.querySelectorAll('[id^="ex-'+sid+'-"]').forEach(function(c){ if(c.classList.contains('open')) mobiVidStop(c); c.classList.remove('open');});
  if(!wasOpen){ card.classList.add('open'); mobiVidStart(card); } // vidéo chargée seulement à l'ouverture (batterie/data)
}
function refreshWeightUI(key,sid){
  var e=EXOS[key], w=getW(key);
  DATA.forEach(function(s2){
    var inp=$id('wval-'+s2.id+'-'+key); if(inp){ if(e.band) inp.innerHTML=bandHtml(w); else inp.value=w; }
    var chip=$id('chip-w-'+s2.id+'-'+key); if(chip) chip.innerHTML='⚖️ '+wTxt(e,w,true)+(e.side&&!e.dumb&&!e.band?'/côté':'');
    var wd=$id('wdate-'+s2.id+'-'+key); if(wd) wd.textContent='Dernière modif. : '+fmtDateFr(todayStr());
  });
}
function changeWeight(key,delta,sid){
  var e=EXOS[key], w=getW(key);
  setW(key,e&&e.band?bandStep(w,delta>0?1:-1):w+delta); // élastique : palier suivant/précédent, pas ±inc
  refreshWeightUI(key,sid);
}
function setWeightDirect(input,key,sid){
  var v=parseFloat(input.value);
  if(isNaN(v)||v<0){ input.value=getW(key); return; }
  setW(key,v);
  refreshWeightUI(key,sid);
}
// Séries à cocher + chrono de repos dans le panel (comme MASSUP)
var _panelTimers={};
function toggleSet(sid,ei,k,n,rest){
  var el=$id('set-'+sid+'-'+ei+'-'+k); if(!el) return;
  var was=el.classList.contains('done');
  el.classList.toggle('done',!was);
  if(!was&&k<n&&rest>0) startPanelTimer(sid,ei,rest);
  if(!was&&k>=n) stopPanelTimer(sid,ei);
}
function startPanelTimer(sid,ei,rest){
  stopPanelTimer(sid,ei);
  var box=$id('timer-'+sid+'-'+ei); if(!box) return;
  box.classList.add('active');
  var end=Date.now()+rest*1000;
  var key=sid+'-'+ei;
  _panelTimers[key]=setInterval(function(){
    var left=Math.max(0,Math.ceil((end-Date.now())/1000));
    var t=$id('rtt-'+sid+'-'+ei); if(t) t.textContent=formatTime(left);
    var fg=$id('rtfg-'+sid+'-'+ei); if(fg) fg.style.strokeDashoffset=String(113*(1-left/rest));
    if(left<=0){ stopPanelTimer(sid,ei); try{ if(navigator.vibrate) navigator.vibrate([80,60,80]); }catch(e){} showToast('⏱ Repos terminé — série suivante !'); }
  },300);
}
function stopPanelTimer(sid,ei){
  var key=sid+'-'+ei;
  if(_panelTimers[key]){ clearInterval(_panelTimers[key]); delete _panelTimers[key]; }
  var box=$id('timer-'+sid+'-'+ei); if(box) box.classList.remove('active');
}

// ══════════════════════ PROGRESSION ══════════════════════
var calYear=new Date().getFullYear(), calMonth2=new Date().getMonth();
function calPrev(){ calMonth2--; if(calMonth2<0){calMonth2=11;calYear--;} renderCal(); }
function calNext(){ calMonth2++; if(calMonth2>11){calMonth2=0;calYear++;} renderCal(); }
function renderCal(){
  var months=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  var mEl=$id('calMonth'); if(!mEl) return;
  mEl.textContent=months[calMonth2]+' '+calYear;
  var grid=$id('calGrid'); grid.innerHTML='';
  ['L','M','M','J','V','S','D'].forEach(function(d){ var el=document.createElement('div'); el.className='cal-day-name'; el.textContent=d; grid.appendChild(el); });
  var first=new Date(calYear,calMonth2,1).getDay();
  var offset=(first===0)?6:first-1;
  var days=new Date(calYear,calMonth2+1,0).getDate();
  var today=todayStr();
  var map={};
  DB.logs.forEach(function(l){ if(!map[l.date]) map[l.date]=[]; map[l.date].push(l.sid); });
  // 04/09 (demande Adrien) : les semaines à cheval affichent les vrais jours du mois d'avant/d'après
  var trail=(7-(offset+days)%7)%7;
  for(var i=1-offset;i<=days+trail;i++){
    var dt=new Date(calYear,calMonth2,i);
    var other=dt.getMonth()!==calMonth2;
    var d=dt.getDate();
    var ds=dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var el=document.createElement('div');
    var sids=map[ds];
    var cls='cal-day'+(ds===today?' today':'')+(other?' other':'');
    if(sids){
      cls+=' has-session';
      if(sids.length>=2) cls+=' day-hi';
      var s=seanceOf(sids[0]);
      var t=s?s.t:'others';
      cls+=' day-'+(t==='legs'?'legs':t==='pull'?'pull':t==='push'?'push':t==='maison'?'maison':'others');
    }
    if(DB.salsa[ds]) cls+=' day-salsa'; // 💃 = une VRAIE couleur de jour (demande Adrien 29/08), plus d'emoji
    el.className=cls;
    el.textContent=d;
    if(DB.mobiDays[ds]){ var zk=document.createElement('span'); zk.className='cd-zen'; zk.innerHTML='🧘'; el.appendChild(zk); }
    if(sids||DB.mobiDays[ds]||DB.salsa[ds]||DB.eau[ds]||DB.pesees.some(function(p){return p.date===ds;})){
      el.dataset.date=ds;
      el.addEventListener('click',function(){ showDayModal(this.dataset.date); });
    }
    grid.appendChild(el);
  }
  renderCalLegend();
}
// Légende du calendrier (29/08) : une couleur par séance + salsa + mobilité
function renderCalLegend(){
  var el=$id('calLegend'); if(!el) return;
  var h=DATA.map(function(s){ return '<span class="cl-i"><i class="cl-dot d-'+s.t+'"></i>'+s.name+'</span>'; }).join('');
  h+='<span class="cl-i"><i class="cl-dot d-salsa"></i>Salsa</span><span class="cl-i"><i class="cl-zen">🧘</i>Mobilité</span>';
  el.innerHTML=h;
}
function renderFreqChart(){
  var barsEl=$id('freqMiniBars'); if(!barsEl) return;
  barsEl.innerHTML='';
  var mon=mondayOf(todayStr());
  for(var w=7;w>=0;w--){
    var m=addDays(mon,-7*w);
    var count=weekStats(m).seances;
    var cls=count>=WEEK_GOAL+1?'freq-bar gold':count>=WEEK_GOAL?'freq-bar valid':count>=WEEK_GOAL-1?'freq-bar mid':'freq-bar low';
    var lbl=w===0?'★':('S-'+w);
    var bar=document.createElement('div');
    bar.className=cls;
    bar.innerHTML='<span class="freq-bar-num">'+(count||'·')+'</span><span class="freq-bar-lbl">'+lbl+'</span>';
    barsEl.appendChild(bar);
  }
  var streakEl=$id('weekStreakInfo');
  if(streakEl){
    var streak=streakWeeks();
    if(streak>=2) streakEl.innerHTML='🔥 <strong style="color:var(--acc)">'+streak+' semaines</strong> consécutives à '+WEEK_GOAL+'+ séances !';
    else if(streak===1) streakEl.innerHTML='💪 1 semaine à '+WEEK_GOAL+'+ séances — continue le streak !';
    else streakEl.innerHTML='';
  }
}
// Hypertrophie hebdo — séries par muscle (1er groupe = plein, groupes secondaires = 0,5)
var VOL_GROUPS=[
  {label:'Fessiers',g:'fessiers'},{label:'Jambes',g:'jambes'},{label:'Dos',g:'dos'},
  {label:'Épaules',g:'epaules'},{label:'Bras',g:'bras'},{label:'Abdos',g:'core'}
];
function volAdd(vol,key,n){
  var e=EXOS[key]; if(!e||!n) return;
  (e.grps||[]).forEach(function(g,i){
    var grp=VOL_GROUPS.find(function(x){return x.g===g;});
    if(grp) vol[grp.label]=(vol[grp.label]||0)+n*(i===0?1:.5);
  });
}
function muscleVolume(start,end){
  var vol={};
  VOL_GROUPS.forEach(function(g){ vol[g.label]=0; });
  DB.logs.forEach(function(l){
    if(l.date<start||l.date>end) return;
    (l.exos||[]).forEach(function(x){ volAdd(vol,x.k,(x.sets||[]).length); });
  });
  return vol;
}
var _mvOff=0;
function mvNav(d){ _mvOff=Math.min(0,_mvOff+d); renderMuscleVolume(); }
// Barres de volume par muscle (onglet Progression + slide « muscles » du bilan de semaine)
function melVolBarsHtml(vol){
  var SCALE=16, h='';
  VOL_GROUPS.forEach(function(g){
    var v=vol[g.label]||0, pW=Math.min(100,v/SCALE*100), cls=v>=10?'gold':v>=6?'ok':'low';
    h+='<div class="mv-row"><span class="mv-name">'+g.label+'</span>'
      +'<div class="mv-bar"><div class="mv-fill '+cls+'" style="width:'+pW+'%"></div><span class="mv-t10"></span><span class="mv-t20"></span></div>'
      +'<span class="mv-val '+cls+'">'+Math.round(v)+'</span></div>';
  });
  return h;
}
function renderMuscleVolume(){
  var el=$id('muscleVolume'); if(!el) return;
  var monday=addDays(mondayOf(todayStr()),_mvOff*7);
  var end=_mvOff===0?todayStr():addDays(monday,6);
  var vol=muscleVolume(monday,end);
  var SCALE=16; // cibles du dossier 30-MUSCULATION §2 : fessiers 6-9 séries/sem, dos 6-9, jambes 5-7
  var h='<div style="font-size:.62rem;color:var(--mut);margin-bottom:.6rem;line-height:1.5;">'+(_mvOff===0?'Cette semaine':'Semaine du '+fmtShort(monday))
    +' — en perte de poids, <strong style="color:var(--txt)">c\'est le muscle qui sculpte</strong> : le cardio vide la balance, les séries dessinent la silhouette. Vise le rose sur Fessiers 🍑</div>';
  h+=melVolBarsHtml(vol);
  var fwd=$id('mvNavFwd'); if(fwd) fwd.disabled=_mvOff>=0;
  el.innerHTML=h;
}
// Évolution des poids (références DB.weights, comme MASSUP)
var weightChart=null;
function buildChartSelect(){
  var sel=$id('chartSelect'); if(!sel) return;
  var all=[];
  DATA.forEach(function(s){ s.exos.forEach(function(o){
    if(all.some(function(x){return x.key===o.key;})) return;
    all.push({key:o.key,name:EXOS[o.key].name});
  });});
  all.sort(function(a,b){
    var aA=DB.weights[a.key]||[], bA=DB.weights[b.key]||[];
    var aD=aA.length?aA[aA.length-1].date:''; var bD=bA.length?bA[bA.length-1].date:'';
    return bD.localeCompare(aD);
  });
  var cur=sel.value;
  sel.innerHTML='';
  all.forEach(function(e){ var opt=document.createElement('option'); opt.value=e.key; opt.textContent=e.name; sel.appendChild(opt); });
  if(cur&&all.some(function(x){return x.key===cur;})) sel.value=cur;
  renderWeightChart();
}
function renderWeightChart(){
  var sel=$id('chartSelect'); if(!sel||!sel.value) return;
  var key=sel.value;
  var arr=DB.weights[key]||[];
  var wrap=$id('weightChart').parentElement;
  var empty=$id('weightChartEmpty');
  var statsEl=$id('weightStats');
  var histEl=$id('weightHistory');
  if(!arr.length){
    wrap.style.display='none'; empty.style.display='block';
    statsEl.style.display='none'; histEl.innerHTML='';
    return;
  }
  wrap.style.display='block'; empty.style.display='none';
  var e=EXOS[key];
  var first=arr[0].val, cur=arr[arr.length-1].val;
  var gain=Math.round((cur-first)*10)/10;
  var gainCol=gain>0?'var(--acc)':gain<0?'var(--red)':'var(--mut)';
  var best=bestPrev(key);
  statsEl.style.display='grid';
  statsEl.innerHTML='<div class="wsr-card"><div class="wsr-val">'+cur+' <span class="wsr-unit">kg</span></div><div class="wsr-lbl">actuel</div></div>'
    +'<div class="wsr-card"><div class="wsr-val">'+first+' <span class="wsr-unit">kg</span></div><div class="wsr-lbl">départ</div></div>'
    +'<div class="wsr-card"><div class="wsr-val" style="color:'+gainCol+'">'+(gain>0?'+':'')+gain+'</div><div class="wsr-lbl">progression</div></div>'
    +'<div class="wsr-card"><div class="wsr-val">'+(best!=null?(e.time?best+(e.mins?' min':' s'):(e.band?wTxt(e,best,true):best+' kg')):'—')+'</div><div class="wsr-lbl">record 🏆</div></div>';
  loadChart(function(){
    var labels=arr.map(function(x){return fmtShort(x.date);});
    var vals=arr.map(function(x){return x.val;});
    var ctx=$id('weightChart').getContext('2d');
    if(weightChart){ weightChart.destroy(); weightChart=null; }
    weightChart=new Chart(ctx,{type:'line',
      data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#FF7EB6',backgroundColor:'rgba(255,126,182,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#FF7EB6',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.parsed.y+' kg';}}}},
        scales:{x:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  });
  var sorted=arr.slice().reverse();
  var listHtml='<div class="wh-toggle" id="whToggle" onclick="toggleWeightHistory()"><span class="wh-toggle-arr">▸</span> Historique ('+arr.length+' entrée'+(arr.length>1?'s':'')+')</div>'
    +'<div class="expand-anim" id="whListWrap"><div class="wh-list">';
  sorted.forEach(function(entry){
    listHtml+='<div class="wh-entry">'
      +'<span class="wh-entry-date">'+fmtDateFr(entry.date)+'</span>'
      +'<span class="wh-entry-val"><input class="wh-entry-input" type="number" step="0.5" min="0" value="'+entry.val+'" onblur="editWeightEntry(\''+key+'\',\''+entry.date+'\',this)" onkeydown="if(event.key===\'Enter\')this.blur()"/> kg</span>'
      +'<button class="wh-entry-del" onclick="deleteWeightEntry(\''+key+'\',\''+entry.date+'\')" title="Supprimer">✕</button>'
      +'</div>';
  });
  listHtml+='</div><div class="wh-edit-hint">✏️ Touche une valeur pour corriger.</div></div>';
  histEl.innerHTML=listHtml;
}
function toggleWeightHistory(){
  var wrap=$id('whListWrap'), toggle=$id('whToggle');
  if(!wrap) return;
  var open=!wrap.classList.contains('open');
  wrap.classList.toggle('open',open);
  if(toggle) toggle.classList.toggle('open',open);
}
function editWeightEntry(key,date,input){
  var arr=DB.weights[key]||[];
  var entry=arr.find(function(x){return x.date===date;}); if(!entry) return;
  var nw=parseFloat(input.value);
  if(isNaN(nw)||nw<0){ input.value=entry.val; return; }
  nw=roundW(EXOS[key],nw);
  if(nw===entry.val){ input.value=nw; return; }
  entry.val=nw; saveDB();
  renderWeightChart(); renderProgressionTable();
  showToast('✅ '+fmtShort(date)+' corrigé : '+nw+' kg');
}
function deleteWeightEntry(key,date){
  var arr=DB.weights[key]||[];
  if(arr.length<=1){ showToast('⚠ Impossible de supprimer la seule entrée'); return; }
  DB.weights[key]=arr.filter(function(x){return x.date!==date;});
  saveDB();
  renderWeightChart(); renderProgressionTable();
  showToast('Entrée du '+fmtShort(date)+' supprimée');
}
function toggleProgTable(){
  var s=$id('progTableSection'), t=$id('progTableToggle');
  var open=!s.classList.contains('open');
  s.classList.toggle('open',open); t.classList.toggle('open',open);
}
function renderProgressionTable(){
  var el=$id('progTable'); if(!el) return;
  var html='', seen={};
  DATA.forEach(function(s){
    var rows='';
    s.exos.forEach(function(o){
      if(seen[o.key]) return;
      var arr=DB.weights[o.key]||[];
      if(!arr.length) return;
      seen[o.key]=true;
      var e=EXOS[o.key];
      var start=arr[0], cur=arr[arr.length-1];
      var delta=Math.round((cur.val-start.val)*10)/10;
      var pct=start.val>0?Math.round((delta/start.val)*100):0;
      var sign=delta>0?'+':'';
      var col=delta>0?'var(--acc)':delta<0?'var(--red)':'var(--mut)';
      rows+='<div class="progtbl-row">'
        +'<div class="progtbl-name">'+e.name+'</div>'
        +'<div class="progtbl-vals"><span class="progtbl-start">'+start.val+' kg</span><span class="progtbl-arrow">→</span><span class="progtbl-cur">'+cur.val+' kg</span></div>'
        +'<div class="progtbl-delta" style="color:'+col+'">'+sign+delta+' ('+(pct!==0?sign+pct+'%':'=')+')</div>'
        +'</div>';
    });
    if(rows) html+='<div class="progtbl-section"><div class="progtbl-seance-hdr">'+s.icon+' '+s.name+'</div>'+rows+'</div>';
  });
  el.innerHTML=html||'<div style="color:var(--mut);padding:1.25rem;text-align:center;font-size:.8rem">Lance tes séances pour voir ta progression.</div>';
}
function renderLogSummary(){
  var el=$id('logSummary'), listEl=$id('recentLogs');
  if(!el) return;
  var now=new Date();
  var mstart=todayStr(new Date(now.getFullYear(),now.getMonth(),1));
  var thisMonth=DB.logs.filter(function(l){return l.date>=mstart;}).length;
  var total=DB.logs.length;
  if(!total){
    el.innerHTML='<div class="empty-state"><div class="empty-state-ico">📅</div><div class="empty-state-title">Aucune séance encore</div><div class="empty-state-sub">Lance ta première séance avec le ＋ de l\'onglet Séances 🌸</div></div>';
    listEl.innerHTML=''; listEl.style.display='none';
    return;
  }
  listEl.style.display='block';
  var months=['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  el.innerHTML='<div class="log-summary-grid">'
    +'<div class="ls-card accent"><div class="ls-val">'+thisMonth+'</div><div class="ls-lbl">ce mois ('+months[now.getMonth()]+')</div></div>'
    +'<div class="ls-card"><div class="ls-val">'+total+'</div><div class="ls-lbl">séances au total</div></div>'
    +'</div>';
  var h='';
  DB.logs.slice().reverse().slice(0,8).forEach(function(l){
    var s=seanceOf(l.sid);
    h+='<button class="mel-log-row" onclick="showDayModal(\''+l.date+'\')">'
      +'<span class="mel-log-ico">'+(s?s.icon:'🏋️')+'</span>'
      +'<span class="mel-log-name">'+(s?s.name:l.sid)+'</span>'
      +'<span class="mel-log-meta">'+fmtShort(l.date)+' · '+(l.exos||[]).length+' exos'+((l.recs||[]).length?' · 🏆'+l.recs.length:'')+'</span>'
      +'</button>';
  });
  listEl.innerHTML=h;
}
// ── Modal jour — 29/09 : la carte MASSUP à l'identique (hc-log : puce séance, note /20 en héros,
// méta, ligne LiveUp, « Détail de la séance » repliable, 📊 Bilan) ──
function melToggleDetail(id){
  var b=$id('dld-'+id), a=$id('dlda-'+id); if(!b) return;
  var open=b.style.display==='none'; b.style.display=open?'':'none'; if(a) a.textContent=open?'▾':'▸';
}
function showDayModal(date){
  var logs=DB.logs.filter(function(l){return l.date===date;});
  var pes=DB.pesees.find(function(p){return p.date===date;});
  var mlog=(DB.mobiLog&&DB.mobiLog[date])||[];
  var sub=logs.length?'':(DB.salsa[date]?'salsa':'aucune séance');
  $id('dayModalTitle').innerHTML='<div class="dm-date"><span class="dm-date-day">'+fmtDateFr(date)+'</span>'+(sub?'<span class="dm-date-sub">'+sub+'</span>':'')+'</div>'
    +'<button class="modal-close hc-close" onclick="closeDayModal()">✕</button>';
  var html='';
  logs.forEach(function(l){
    var s=seanceOf(l.sid), t=s?s.t:'others', sess=melSessFromLog(l), note=melLogScore(l);
    var chips='<span class="chip chip-'+t+'">'+(s?s.icon+' '+s.name:l.sid)+'</span>';
    var meta=[];
    if(l.dur) meta.push('⏱ '+l.dur+' min');
    if(l.energy) meta.push('⚡ '+l.energy+'/5');
    if(l.feeling) meta.push('⭐ '+l.feeling+'/5');
    if(l.pains&&l.pains.length) meta.push('🩹 '+painZonesTxt(l.pains));
    var mains=sess.exos.filter(function(x){return !x.bonus;});
    var dn=mains.filter(function(x){return x.sets.length;}).length, sk=mains.length-dn;
    var st=sess.exos.reduce(function(t2,x){return t2+x.sets.length;},0);
    var rows='';
    sess.exos.forEach(function(x){
      if(!x.sets.length){ rows+='<div class="dld-row"><span class="dld-name" style="color:var(--mut)">'+x.name+'</span><span class="dld-tag" style="color:var(--mut)">passé</span></div>'; return; }
      var sc=melScoreExo(x), col=sc>=4?'var(--acc)':sc>=2.5?'var(--yellow)':'var(--red)';
      rows+='<div class="dld-row"><span class="dld-name">'+(x.bonus?'⭐ ':'')+x.name+'</span>'
        +'<span class="dld-tag" style="color:'+col+';font-weight:800">'+String(sc).replace('.',',')+'<small style="font-weight:500;color:var(--mut)">/5</small></span>'
        +'<div class="dld-sets">'+melSetsLine(x)+'</div></div>';
    });
    (l.recs||[]).forEach(function(r){ rows+='<div style="font-size:.66rem;color:var(--yellow);margin-top:.35rem;">🏆 '+r+'</div>'; });
    html+='<div class="hc-log dm-t-'+t+'">'
      +'<div class="hc-chips">'+chips+'</div>'
      +'<div class="hc-hero">'
      +(note!=null
        ?'<div class="hc-pts"><span class="hc-pts-v '+note20Cls(note)+'">'+note+'<small style="font-size:.42em;font-weight:800;color:var(--mut);"> /20</small></span>'
          +'<span class="hc-pts-l">'+(note>=18?'🏆 séance en or':note>=14?'💪 grosse séance':note>=11?'✅ séance solide':note>=8?'😕 séance en retrait':'🚨 séance ratée')+'</span></div>'
        :'<div class="hc-pts"><span class="hc-pts-v" style="font-size:1.1rem;color:var(--mut);">bonus seulement</span><span class="hc-pts-l">aucun exercice principal fait</span></div>')
      +'</div>'
      +(meta.length?'<div class="hc-meta">'+meta.join(' · ')+'</div>':'')
      +(l.note?'<div class="dm-comment">« '+l.note+' »</div>':'')
      +'<div class="dm-live">▶ LiveUp · '+dn+' exo'+(dn>1?'s':'')+' · '+st+' séries'+(sk?' · '+sk+' passé'+(sk>1?'s':''):'')+'</div>'
      +(rows?'<button class="dld-toggle" onclick="melToggleDetail(\''+l.id+'\')">Détail de la séance <span id="dlda-'+l.id+'">▸</span></button>'
        +'<div class="dld-body" id="dld-'+l.id+'" style="display:none">'+rows+'</div>':'')
      +'<div class="dm-actrow"><button class="dm-report" onclick="rpOpen(\''+l.id+'\')">📊 Bilan</button></div>'
      +'</div>';
  });
  if(!logs.length&&!DB.salsa[date]&&!mlog.length&&!DB.mobiDays[date]&&!pes) html='<div class="dm-empty">Rien ce jour-là — et c\'est très bien aussi 🌷</div>';
  // Mobilité : la carte compacte « zen » de MASSUP, avec la routine, le ressenti et la douleur
  mlog.forEach(function(m){
    var chipsM=(m.items||[]).filter(function(it){return it.f;}).map(function(it){return '<span class="mf mf-'+it.f+'">'+it.n+'</span>';}).join(' ');
    html+='<div class="dm-zen">'+(m.ico||'🧘‍♀️')+' <strong>'+m.n+'</strong> <span class="dm-zen-sub">'+(m.min?m.min+' min':m.dur||'')+(m.at?' · '+m.at:'')+(m.feel?' · ⭐ '+m.feel+'/5':'')+'</span>'
      +(m.pain&&m.pain!=='non'?'<div style="font-size:.66rem;color:var(--yellow);margin-top:.3rem;">🩹 Douleur : '+(m.pain==='oui'?'oui':'un peu')+(m.pw?' — '+m.pw:'')+'</div>':'')
      +(chipsM?'<div style="margin-top:.35rem;display:flex;flex-wrap:wrap;gap:.25rem;">'+chipsM+'</div>':'')+'</div>';
  });
  if(DB.mobiDays[date]&&!mlog.length) html+='<div class="dm-zen">🧘‍♀️ <strong>Mobilité</strong> <span class="dm-zen-sub">routine non précisée</span></div>';
  var marks=[];
  if(DB.salsa[date]) marks.push('💃 salsa');
  if(DB.eau[date]) marks.push('💧 gourde ×2');
  if(DB.crea&&DB.crea[date]) marks.push('🧪 créatine');
  if(pes) marks.push('⚖️ '+String(pes.kg).replace('.',',')+' kg');
  if(marks.length) html+='<div class="dm-zen">'+marks.join(' · ')+'</div>';
  $id('dayModalContent').innerHTML=html;
  $id('dayModal').classList.add('open');
}
function closeDayModal(){ $id('dayModal').classList.remove('open'); }

// ══════════════════════ LIVEUP (mêmes écrans que le Mode Séance MASSUP) ══════════════════════
var AS=null,_asTimer=null,_asDir='fwd';
var AS_EXIT_SVG='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h5V4"/><path d="M20 9h-5V4"/><path d="M4 15h5v5"/><path d="M20 15h-5v5"/></svg>';
var AS_FEELS=[
  {v:'facile',ico:'😌',lbl:'Facile'},
  {v:'ok',ico:'👍',lbl:'Correct'},
  {v:'dur',ico:'🥵',lbl:'Dur'},
  {v:'echec',ico:'💥',lbl:'À l\'échec'}
];
var AS_INTER_REST=120;
var AS_HYPE=[
  'Chaque rep te rapproche de la toi de juillet.',
  'La régularité bat le talent — et t\'as les deux 🌸',
  'Personne ne le fera à ta place. GO.',
  'Le muscle sculpte, la balance suit.',
  'Ton futur toi te dit déjà merci.',
  'On construit. Brique par brique.',
  'Vise propre, pas parfait.',
  'La salle est à toi. Prends-la 💗'
];
var AS_BETWEEN_GOOD=['Solide. Enchaîne !','Ça, c\'est du travail propre 💗','Excellent — garde ce rythme.','Machine. Au suivant !'];
var AS_BETWEEN_ROUGH=['Pas grave — le prochain exo est une nouvelle chance.','Respire, bois un coup, on repart.','Même les jours moyens construisent.'];
function asPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function asSave(){ try{ if(AS) localStorage.setItem(LIVEK,JSON.stringify(AS)); else localStorage.removeItem(LIVEK); }catch(e){} }
function asLoad(){ try{ AS=JSON.parse(localStorage.getItem(LIVEK)||'null'); }catch(e){ AS=null; } if(AS&&AS.v!==3) AS=null; }
function asElapsedMin(){ return AS&&AS.startTs?Math.max(1,Math.round((Date.now()-AS.startTs)/60000)):0; }
function cntU(x){ return x.circuit?'tours':x.time?(x.mins?'min':'s'):'reps'; }
function cntShort(x,v){ return v+(x.circuit?(v>1?' tours':' tour'):x.time?(x.mins?' min':' s'):''); }
function cntStep(x){ return x.time&&!x.mins?5:1; }
function targetStr(x){
  return x.n+' série'+(x.n>1?'s':'')+' × '+(x.lo===x.hi?x.lo:x.lo+'-'+x.hi)+(x.time?(x.mins?' min':' s'):' reps')+(x.uni?' par côté':'')
    +(x.rest>0?' · repos '+(x.rest>=90?formatTime(x.rest):x.rest+'s'):'');
}
// Le niveau d'effort demandé ÉVOLUE avec son ancienneté (réponse « débutante, et dans 2 mois ? ») :
// sem. 1-2 apprentissage du geste · sem. 3-6 les 2 dernières reps dures · sem. 7+ dernière rep quasi impossible
function trainWeeks(){
  if(!DB.logs.length) return 0;
  return Math.floor((new Date(todayStr()+'T12:00:00')-new Date(DB.logs[0].date+'T12:00:00'))/(7*86400000))+1;
}
function effortMsg(x){
  var reps=(x.lo===x.hi?x.lo:x.lo+'-'+x.hi)+(x.time?(x.mins?' min':' secondes'):' répétitions');
  var w=trainWeeks();
  if(w<=2) return '💪 Va au bout de tes '+reps+', mais garde 2-3 reps en réserve : ces 2 premières semaines, tu apprends le GESTE — la charge viendra vite.';
  if(w<=6) return '💪 Donne-toi à FOND : va au bout de tes '+reps+' — '+(x.time?'les dernières secondes doivent brûler':'les 2 dernières reps doivent être DURES')+'. Si c\'est facile, ça ne travaille pas.';
  return '🔥 Tu n\'es plus débutante : sur tes '+reps+', la DERNIÈRE doit être presque impossible. C\'est elle qui transforme — les autres ne font que t\'y amener.';
}
function asMakeExo(o){
  var e=EXOS[o.key];
  var w0=getW(o.key);
  var w=o.wFactor?Math.round(w0*o.wFactor*2)/2:w0;
  return {key:o.key,name:e.name,n:o.sets||e.sets,lo:o.lo||e.lo,hi:o.hi||e.hi,reps:o.hi||e.hi,
    rest:(o.rest!=null?o.rest:e.rest),weight:w,w0:w0,inc:e.inc||1,unite:unite(e),
    uni:!!e.side,time:!!e.time,mins:!!e.mins,circuit:!!e.circuit,dumb:!!e.dumb,band:!!e.band,
    wFactor:o.wFactor||null,note:o.note||null,bonus:!!o.bonus,sets:[],skippedSets:0,status:'pending'};
}
// ── overlay / bubble ──
function asShowOverlay(){
  var ov=$id('asOverlay'); if(!ov) return;
  try{ if(typeof PV!=='undefined') PV.pull(false); }catch(e){} // un mot frais d'Adrien avant le GO ?
  ov.classList.add('open');
  document.body.style.overflow='hidden';
  asRender(); asRenderBubble();
  if(AS&&AS.restEnd) asEnsureTick();
}
function asHideOverlay(){
  var ov=$id('asOverlay'); if(ov) ov.classList.remove('open','as-exorest');
  document.body.style.overflow='';
}
function asMinimize(){ asHideOverlay(); asRenderBubble(); }
function asRenderBubble(){
  var b=$id('asBubble'); if(!b) return;
  var ov=$id('asOverlay');
  var open=ov&&ov.classList.contains('open');
  if(!AS||open){ b.style.display='none'; return; }
  var txt;
  if(AS.step==='setup'||AS.step==='setup2'||AS.step==='ready') txt='LiveUp en préparation';
  else if(AS.step==='warmup') txt=(AS.sname||'LiveUp')+' · échauffement';
  else if(AS.step==='end'||AS.step==='report') txt='Bilan du LiveUp en attente';
  else txt=(AS.sname||'LiveUp')+' · Exo '+(AS.cur+1)+'/'+AS.exos.length;
  b.style.display='flex';
  b.innerHTML='<span class="as-bubble-dot"></span><span class="as-bubble-txt">'+txt+'</span><span class="as-bubble-time" id="asBubbleTime">'+(AS.restEnd?formatTime(asRestRemain()):'')+'</span>';
}
function asOpen(){
  if(!AS) AS={v:3,step:'setup',sel:{sid:null,chosen:{}},exos:[],cur:0,setIdx:1,phase:'intro',introIdx:0,startTs:null,restEnd:null,restTotal:0,restOver:false,pend:null,end:{},recs:[],applied:[],savedLogId:null,hype:asPick(AS_HYPE)};
  asSave(); asShowOverlay();
}
function asOpenWith(sid){
  AS={v:3,step:'setup2',sel:{sid:sid,chosen:{}},exos:[],cur:0,setIdx:1,phase:'intro',introIdx:0,startTs:null,restEnd:null,restTotal:0,restOver:false,pend:null,end:{},recs:[],applied:[],savedLogId:null,hype:asPick(AS_HYPE)};
  asSave(); asShowOverlay();
}
function asDiscard(){
  updateMelatiWorkoutTimer(null);
  AS=null; asSave(); asHideOverlay(); asRenderBubble();
  if(_asTimer){ clearInterval(_asTimer); _asTimer=null; }
}
function asCancelSetup(){ if(AS&&AS.startTs){ asMinimize(); return; } asDiscard(); }
// ── repos (tick 250 ms seulement quand un chrono tourne — règle batterie) ──
function asStartRest(seconds,phase){
  AS.restEnd=Date.now()+seconds*1000; AS.restTotal=seconds; AS.restOver=false;
  if(phase) AS.phase=phase;
  updateMelatiWorkoutTimer(AS.restEnd,'Repos terminé','Lance ta prochaine série !');
  asEnsureTick();
}
function asStopRest(){ if(AS&&AS.restEnd) updateMelatiWorkoutTimer(null); AS.restEnd=null; AS.restOver=false; }
function asRestRemain(){ return AS&&AS.restEnd?Math.max(0,Math.ceil((AS.restEnd-Date.now())/1000)):0; }
function asEnsureTick(){ if(_asTimer) return; _asTimer=setInterval(asTickFn,250); }
// (07/10, parité MASSUP) Économie batterie : en arrière-plan on coupe le ticker ; le repos est basé
// sur un horodatage, donc au retour tout est recalculé juste (et la notif part du serveur).
document.addEventListener('visibilitychange',function(){
  if(document.hidden){ if(_asTimer){ clearInterval(_asTimer); _asTimer=null; } }
  else if(typeof AS!=='undefined'&&AS&&AS.restEnd){ asEnsureTick(); asTickFn(); }
});
function asTickFn(){
  if(!AS||!AS.restEnd){ clearInterval(_asTimer); _asTimer=null; return; }
  var rem=asRestRemain();
  var t=$id('as-rest-time'); if(t) t.textContent=formatTime(rem);
  var mt=$id('as-mini-rest'); if(mt) mt.textContent=formatTime(rem);
  var bt=$id('asBubbleTime'); if(bt) bt.textContent=formatTime(rem);
  var fg=$id('as-ring-fg');
  if(fg&&AS.restTotal){ var C=2*Math.PI*54; fg.style.strokeDashoffset=String((C*(1-rem/AS.restTotal)).toFixed(1)); }
  if(rem>0&&rem<=3&&_asLastTick!==rem){ _asLastTick=rem; mlSound('tick'); }
  if(rem<=0){
    AS.restEnd=null; AS.restOver=true;
    clearInterval(_asTimer); _asTimer=null;
    try{ if(navigator.vibrate) navigator.vibrate([80,60,80]); }catch(e){}
    _asLastTick=null; mlSound('done'); // sonnerie de fin de repos (retour Melati 26/08)
    asAfterRest();
  }
}
var _asLastTick=null;
function asAfterRest(){
  if(AS.phase==='rest'){ AS.phase='work'; asSave(); asRenderIfOpen(); }
  else if(AS.phase==='exorest'){ asGotoNextPending(); }
  else if(AS.phase==='ask'){ var h=$id('as-ask-hint'); if(h) h.innerHTML='⏱ Repos terminé — valide et enchaîne !'; asSave(); }
}
function asSkipRest(){
  if(AS.restEnd) updateMelatiWorkoutTimer(null);
  AS.restEnd=null; AS.restOver=false; asSave();
  if(AS.phase==='rest'){ AS.phase='work'; asRender(); }
  else if(AS.phase==='exorest'){ asGotoNextPending(); }
}
function asAddRest(sec){ if(AS.restEnd){ AS.restEnd+=sec*1000; AS.restTotal+=sec; updateMelatiWorkoutTimer(AS.restEnd,'Repos terminé','Lance ta prochaine série !'); asSave(); asEnsureTick(); } }
function asRenderIfOpen(){ var ov=$id('asOverlay'); if(ov&&ov.classList.contains('open')) asRender(); else asRenderBubble(); }
// ── rendu ──
function asRender(){
  var body=$id('asBody'); if(!body||!AS) return;
  var renderKey=AS.step+'|'+(AS.phase||'')+'|'+(AS.step==='report'?(AS.repIdx||0):'');
  var previousKey=body.getAttribute('data-render-key');
  var html='';
  if(AS.step==='setup') html=asRenderSetup();
  else if(AS.step==='setup2') html=asRenderSetup2();
  else if(AS.step==='ready') html=asRenderReady();
  else if(AS.step==='warmup') html=asRenderWarmup();
  else if(AS.step==='exo') html=asRenderExo();
  else if(AS.step==='end') html=asRenderEnd();
  else if(AS.step==='report') html=asRenderReport();
  if(typeof STEPS!=='undefined') STEPS.renderPreservingScroll(body,html,previousKey===renderKey);
  else body.innerHTML=html;
  body.setAttribute('data-render-key',renderKey);
  body.classList.remove('as-anim-fwd','as-anim-back');
  void body.offsetWidth;
  body.classList.add(_asDir==='back'?'as-anim-back':'as-anim-fwd');
  _asDir='fwd';
  // Bilan : cartes qui apparaissent en cascade (one-shot, règle batterie) + note qui monte (MASSUP)
  if(AS.step==='report'){
    animCountUpAll(body);
    var items=body.querySelectorAll('.as-rep-exo,.as-rep-note');
    for(var i=0;i<items.length;i++){ items[i].style.animation='fadein .35s ease both'; items[i].style.animationDelay=(0.05*i)+'s'; }
  }
  var ov=$id('asOverlay');
  if(ov){ ov.classList.toggle('as-exorest',AS.step==='exo'&&AS.phase==='exorest'); }
  asRenderBubble();
}
function asHeader(title,sub,showList){
  return '<div class="as-hdr">'
    +'<div class="as-hdr-left">'
    +'<button class="as-exit" onclick="asMinimize()" title="Réduire — la séance continue">'+AS_EXIT_SVG+'</button>'
    +(asCanBack()?'<button class="as-hbtn as-backbtn" onclick="asBack()" title="Retour">‹</button>':'')
    +'</div>'
    +'<div class="as-hdr-mid"><div class="as-hdr-title">'+title+'</div>'+(sub?'<div class="as-hdr-sub">'+sub+'</div>':'')+'</div>'
    +'<div class="as-hdr-right">'
    +(showList?'<button class="as-hbtn" onclick="asToggleSheet(true)" title="Liste des exercices">☰</button>':'')
    +'</div></div>';
}
// ── Retour en arrière (comme MASSUP) : rouvre la dernière série validée pour la CORRIGER
// (reps + ressenti), remonte série par série ; sur l'intro, revient de slide en slide.
function asCanBack(){
  if(!AS||AS.step!=='exo') return false;
  var x=AS.exos[AS.cur]; if(!x) return false;
  if(AS.phase==='ask'){ var p=AS.pend; return !!(p&&(p.editIdx==null||p.editIdx>0)); }
  if(AS.phase==='intro') return AS.introIdx>0||x.sets.length>0;
  if(AS.phase==='work'||AS.phase==='rest') return true;
  return false;
}
function asEditPend(x,idx){
  var s=x.sets[idx];
  return {reps:s.reps,feel:s.feel||null,setNo:idx+1,editIdx:idx};
}
function asBack(){
  if(!asCanBack()) return;
  var x=AS.exos[AS.cur];
  _asDir='back';
  if(AS.phase==='ask'&&AS.pend&&AS.pend.editIdx!=null){
    if(AS.pend.editIdx>0) AS.pend=asEditPend(x,AS.pend.editIdx-1);
  }
  else if(AS.phase==='ask'&&AS.pend){ AS.pend=null; AS.phase='work'; }
  else if(AS.phase==='intro'&&AS.introIdx>0){ AS.introIdx--; }
  else if(x.sets.length>0){ AS.pend=asEditPend(x,x.sets.length-1); AS.phase='ask'; }
  else if(AS.phase==='work'||AS.phase==='rest'){ asStopRest(); AS.phase='intro'; AS.introIdx=0; }
  asSave(); asRender();
}
function asDots(){
  var d='<div class="as-dots">';
  AS.exos.forEach(function(x,i){
    var c='as-dot';
    if(x.status==='done') c+=' done'; else if(x.status==='skipped') c+=' skip';
    if(i===AS.cur&&AS.step==='exo') c+=' cur';
    d+='<span class="'+c+'"></span>';
  });
  return d+'</div>';
}
function asSlideDots(n,cur,fn){
  var d='<div class="as-dots as-dots-slides">';
  for(var i=0;i<n;i++) d+='<span class="as-dot'+(i===cur?' cur':'')+'" onclick="'+fn+'('+i+')"></span>';
  return d+'</div>';
}
// ── écran 1 : choix (grandes cartes colorées) ──
function asRenderSetup(){
  var sug=suggestedSession();
  var h=asHeader('LiveUp','c\'est quoi le programme aujourd\'hui ?');
  h+='<div class="as-scroll"><div class="as-choose">';
  DATA.forEach(function(s){
    var mains=s.exos.filter(function(e){return !e.bonus;}).length;
    var bonus=s.exos.length-mains;
    h+='<button class="as-bigcard'+(AS.sel.sid===s.id?' on':'')+'" data-t="'+s.t+'" onclick="asChooseSeance(\''+s.id+'\')">'
      +'<span class="as-bigcard-ico">'+s.icon+'</span>'
      +'<span class="as-bigcard-txt"><span class="as-bigcard-name">'+s.name+(s.id===sug?' <em style="font-style:normal;font-size:.6rem;color:var(--acc);font-weight:800;"> · suggérée</em>':'')+'</span>'
      +'<span class="as-bigcard-sub">'+s.sub+'</span>'
      +'<span class="as-bigcard-ct">'+mains+' exos'+(bonus?' · '+bonus+' bonus':'')+' · ~'+s.dur+' min</span></span>'
      +'<span class="as-bigcard-go">›</span></button>';
  });
  h+='</div></div>';
  h+='<div class="as-foot"><button class="as-ghost-btn" onclick="asCancelSetup()">Annuler</button></div>';
  return h;
}
function asChooseSeance(sid){
  if(AS.sel.sid!==sid){ AS.sel.sid=sid; AS.sel.chosen={}; }
  AS.step='setup2'; asSave(); asRender();
}
// ── écran 1b : personnalisation ──
function asRenderSetup2(){
  var sel=AS.sel;
  var s=DATA.find(function(x){return x.id===sel.sid;});
  var h=asHeader(s.name,'personnalise ta séance');
  h+='<div class="as-scroll">';
  h+='<div class="as-sec sec-'+s.t+'">';
  h+='<div class="as-sec-head"><span>'+s.icon+' '+s.name+'</span><span class="as-sec-lock">🔒 ta séance</span></div>';
  h+='<div class="as-lbl">Exercices <span class="as-lbl-hint">décoche ce que tu ne feras pas</span></div>';
  h+='<div class="as-exo-picks">';
  s.exos.filter(function(e){return !e.bonus;}).forEach(function(o){
    var on=sel.chosen[o.key]!==false;
    h+='<button class="as-pick'+(on?' on':'')+'" onclick="asToggleExo(\''+o.key+'\',this)">'+(EXOS[o.key].imp?'<span class="as-pick-b">🔑</span>':'')+EXOS[o.key].name+'<span class="as-pick-tick">✓</span></button>';
  });
  h+='</div>';
  var bonusEx=s.exos.filter(function(e){return e.bonus;});
  if(bonusEx.length){
    h+='<div class="as-lbl">Bonus de la séance <span class="as-lbl-hint">si t\'as le temps et l\'énergie</span></div>';
    h+='<div class="as-exo-picks">';
    bonusEx.forEach(function(o){
      var on=sel.chosen[o.key]===true;
      h+='<button class="as-pick'+(on?' on':'')+' bonus" onclick="asToggleExo(\''+o.key+'\',this)">'+EXOS[o.key].name+'<span class="as-pick-tick">✓</span></button>';
    });
    h+='</div>';
  }
  h+='</div></div>';
  var count=asCountSelection();
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asBackToChoose()">‹</button>'
    +'<button class="as-cta" id="asSetup2Cta" '+(count?'':'disabled')+' onclick="asToReady()">Continuer ›<span class="as-cta-sub" id="asSetup2Sub">'+count+' exercice'+(count>1?'s':'')+'</span></button>'
    +'</div>';
  return h;
}
function asBackToChoose(){ _asDir='back'; AS.step='setup'; asSave(); asRender(); }
function asCountSelection(){
  var sel=AS.sel, s=DATA.find(function(x){return x.id===sel.sid;});
  if(!s) return 0;
  var c=0;
  s.exos.forEach(function(o){
    var on=sel.chosen[o.key]!==false&&(sel.chosen[o.key]===true||!o.bonus);
    if(on) c++;
  });
  return c;
}
function asToggleExo(key,btn){
  var s=DATA.find(function(x){return x.id===AS.sel.sid;});
  var o=s.exos.find(function(x){return x.key===key;});
  var cur=AS.sel.chosen[key];
  var isOn=cur!==false&&(cur===true||(o&&!o.bonus));
  AS.sel.chosen[key]=!isOn;
  if(btn) btn.classList.toggle('on',!isOn);
  var c=asCountSelection();
  var cta=$id('asSetup2Cta'); if(cta) cta.disabled=!c;
  var sub=$id('asSetup2Sub'); if(sub) sub.textContent=c+' exercice'+(c>1?'s':'');
  asSave();
}
function asToReady(){
  var sel=AS.sel, s=DATA.find(function(x){return x.id===sel.sid;});
  var list=[];
  s.exos.forEach(function(o){
    var on=sel.chosen[o.key]!==false&&(sel.chosen[o.key]===true||!o.bonus);
    if(on) list.push(asMakeExo(o));
  });
  if(!list.length) return;
  list.sort(function(a,b){ return (a.bonus?1:0)-(b.bonus?1:0); });
  AS.sname=s.name; AS.sid=s.id; AS.stype=s.t;
  AS.exos=list; AS.cur=0; AS.setIdx=1; AS.phase='intro'; AS.introIdx=0; AS.step='ready';
  asSave(); asRender();
}
// ── écran 2 : prêt ──
function asRenderReady(){
  var h=asHeader('Prête à envoyer ?',AS.sname+' · '+AS.exos.length+' exercices');
  h+='<div class="as-scroll as-center">';
  h+='<div class="as-hype-wrap"><div class="as-ready-hype">🌸</div><div class="as-hype-msg">« '+(AS.hype||AS_HYPE[0])+' »</div></div>';
  h+='<div class="as-lbl">Ordre des exercices <span class="as-lbl-hint">glisse avec ⣿ (ou appui long sur l\'exo) pour réordonner</span></div>';
  h+='<div class="as-order">';
  AS.exos.forEach(function(x,i){
    h+='<div class="as-orow" data-i="'+i+'" onpointerdown="asRowHold(event,'+i+')">'
      +'<span class="as-drag" onpointerdown="event.stopPropagation();asDragStart(event,'+i+',\'.as-orow\')" title="Glisser pour réordonner">⣿</span>'
      +'<span class="as-orow-name">'+x.name+(x.bonus?' <em>⭐</em>':'')+'</span>'
      +'<span class="as-orow-meta">'+(x.time||x.circuit?'':wTxt(EXOS[x.key],x.weight,true)+' · ')+x.n+'×'+cntShort(x,x.reps)+'</span></div>';
  });
  h+='</div></div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asBackToSetup()">‹ Retour</button>'
    +'<button class="as-cta as-cta-go" onclick="asGo()">GO 💗<span class="as-cta-sub">démarrer la séance</span></button>'
    +'</div>';
  return h;
}
function asBackToSetup(){ _asDir='back'; AS.step='setup2'; asSave(); asRender(); }
// « Nous deux » (26/08) : si Adrien a laissé un mot non lu → il s'ouvre en animation AVANT le GO
function asGo(){
  if(typeof PV!=='undefined'&&PV.hasUnread()){ mlAudio(); PV.showLove(asGoReal); return; }
  asGoReal();
}
function asGoReal(){
  mlAudio(); // contexte audio créé sur le tap (iOS) → sonnerie de fin de repos possible
  AS.startTs=Date.now(); AS.step='warmup';
  DB.reminders.workoutStartedDate=todayStr(); saveDB();
  asSave(); asRender();
}
// ── échauffement ──
function asRenderWarmup(){
  var first=AS.exos[0];
  var w=WARMUP_MEL[AS.stype]||WARMUP_MEL.others;
  var h=asHeader('Échauffement',w.sub);
  h+='<div class="as-scroll">';
  h+='<div class="as-warmup-note">🔥 Un muscle chaud pousse plus fort et se blesse moins. L\'activation fessiers est l\'étape que tout le monde saute — pas toi.</div>';
  h+='<div class="as-stretch-list" style="margin-top:.8rem;">';
  w.steps.forEach(function(it){
    h+='<div class="as-stretch-item"><div class="as-sti-body"><div class="as-sti-name">'+it.title+'</div>'
      +'<div class="as-sti-dur">⏱ '+it.time+'</div>'
      +'<div class="as-sti-cue">'+it.detail+'</div></div></div>';
  });
  h+='</div></div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asWarmupGo()">Passer</button>'
    +'<button class="as-cta as-cta-go" onclick="asWarmupGo()">Échauffée ✓<span class="as-cta-sub">exo 1 : '+(first?first.name:'')+'</span></button>'
    +'</div>';
  return h;
}
function asWarmupGo(){
  if(!AS.exos.some(function(x){return x.sets.length;})){ AS.cur=0; AS.setIdx=1; }
  AS.step='exo'; AS.phase='intro'; AS.introIdx=0;
  asSave(); asRender();
}
// ── écran exo ──
function asRenderExo(){
  var x=AS.exos[AS.cur];
  if(!x) return asRenderEnd();
  var sub='Exo '+(AS.cur+1)+'/'+AS.exos.length+' · '+asElapsedMin()+' min';
  var h=asHeader(AS.sname,sub,true);
  var fit=(AS.phase==='work'||AS.phase==='rest'||AS.phase==='exorest');
  h+='<div class="as-scroll'+(AS.phase!=='intro'?' as-center':'')+(fit?' as-fit':'')+'" data-t="'+(AS.stype||'')+'">';
  if(AS.phase==='intro') h+=asRenderIntro(x);
  else if(AS.phase==='work') h+=asRenderWork(x);
  else if(AS.phase==='ask') h+=asRenderAsk(x);
  else if(AS.phase==='rest') h+=asRenderRest(x,false);
  else if(AS.phase==='exorest') h+=asRenderRest(x,true);
  h+='</div>';
  h+=asDots();
  h+=asExoFoot(x);
  h+=asSheet();
  return h;
}
// ── Menu burger ☰ : liste des exos (drag ⣿ pour réordonner, ✕ retirer, ↻ reprendre un passé),
// ajout d'exercice, terminer maintenant, abandonner — comme le LiveUp MASSUP ──
var _asSheetOpen=false,_asSheetAdd=false;
function asToggleSheet(open){
  _asSheetOpen=!!open;
  if(!open) _asSheetAdd=false;
  asRender();
}
function asSheet(){
  var h='<div class="as-sheet'+(_asSheetOpen?' open':'')+'" id="asSheet" onclick="if(event.target===this)asToggleSheet(false)"><div class="as-sheet-in">';
  h+='<div class="as-sheet-grab"></div>';
  if(_asSheetAdd){ h+=asSheetAddView(); h+='</div></div>'; return h; }
  var doneCt=AS.exos.filter(function(x){return x.status==='done';}).length;
  h+='<div class="as-sheet-title"><span>Ton LiveUp<small>'+doneCt+'/'+AS.exos.length+' exos terminés · '+asElapsedMin()+' min</small></span><button class="as-hbtn" onclick="asToggleSheet(false)">✕</button></div>';
  h+='<div class="as-sheet-hint">▶ = faire cet exo maintenant (tu pourras revenir à l\'autre) · ⣿ ou appui long = déplacer</div>';
  AS.exos.forEach(function(x,i){
    var st=x.status==='done'?'✅':x.status==='skipped'?'⏭':(i===AS.cur?'▶':String(i+1));
    var cls=(i===AS.cur?' cur':'')+(x.status==='done'?' is-done':'')+(x.status==='skipped'&&!x.sets.length?' is-skip':'');
    // 28/09 (bug Melati « bloquée sur un exo ») : ▶ sur tout exo non terminé — parité asJumpTo MASSUP
    var sub=Math.min(x.sets.length,x.n)+'/'+x.n+' séries'+(x.time||x.circuit?'':' · '+wTxt(EXOS[x.key],x.weight,true))
      +(i===AS.cur&&x.status==='pending'?' · en cours':'')+(x.status==='pending'&&i!==AS.cur&&x.sets.length?' · à reprendre':'');
    h+='<div class="as-shrow'+cls+'" data-i="'+i+'" onpointerdown="asRowHold(event,'+i+')">'
      +'<span class="as-drag" onpointerdown="event.stopPropagation();asDragStart(event,'+i+')" title="Glisser pour réordonner">⣿</span>'
      +'<span class="as-shst">'+st+'</span>'
      +'<span class="as-shname">'+x.name+(x.bonus?' <em class="as-shb">⭐</em>':'')
      +'<small>'+sub+'</small></span>'
      +'<span class="as-shbtns">'
      +(x.status!=='done'&&i!==AS.cur?'<button class="go" onclick="asJumpTo('+i+')" title="Faire maintenant">▶</button>':'')
      +(x.status==='pending'&&i!==AS.cur&&!x.sets.length?'<button onclick="asSkipAt('+i+')" title="Sauter">⏭</button>':'')
      +(x.status==='pending'&&!x.sets.length&&i!==AS.cur?'<button class="del" onclick="asRemoveExo('+i+')" title="Retirer">✕</button>':'')
      +'</span></div>';
  });
  h+='<button class="as-carte-link" onclick="_asSheetAdd=true;asRender()">➕ Ajouter un exercice ›</button>';
  var anySets=AS.exos.some(function(x){return x.sets.length;});
  h+='<div class="as-foot" style="position:static;padding:.8rem 0 0;">'
    +(anySets?'<button class="as-ghost-btn" onclick="asFinishNow()">✅ Terminer maintenant</button>':'')
    +'<button class="as-ghost-btn" style="color:var(--red)" onclick="asAbandon()">🗑 Abandonner</button>'
    +'</div>';
  h+='</div></div>';
  return h;
}
function asSheetAddView(){
  var s=DATA.find(function(x){return x.id===AS.sid;});
  var inAS=AS.exos.map(function(x){return x.key;});
  var opts=s?s.exos.filter(function(o){return inAS.indexOf(o.key)<0;}):[];
  var h='<div class="as-sheet-title"><span>Ajouter un exercice<small>'+(s?s.name:'')+'</small></span><button class="as-hbtn" onclick="_asSheetAdd=false;asRender()">‹</button></div>';
  if(!opts.length) h+='<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:1rem;">Tous les exercices de la séance sont déjà dans ton LiveUp 💗</div>';
  opts.forEach(function(o){
    var e=EXOS[o.key];
    h+='<div class="as-shrow"><span class="as-shst">＋</span>'
      +'<span class="as-shname">'+e.name+(o.bonus?' <em class="as-shb">⭐</em>':'')+'<small>'+serieLabel(o,e)+'</small></span>'
      +'<span class="as-shbtns"><button class="as-hbtn" style="color:var(--acc)" onclick="asAddExo(\''+o.key+'\')">＋</button></span></div>';
  });
  return h;
}
function asAddExo(key){
  var s=DATA.find(function(x){return x.id===AS.sid;});
  var o=s?s.exos.find(function(e){return e.key===key;}):null;
  if(!o) return;
  AS.exos.push(asMakeExo(o));
  _asSheetAdd=false;
  showToast('＋ '+EXOS[key].name+' ajouté en fin de séance');
  asSave(); asRender();
}
function asRemoveExo(i){
  var x=AS.exos[i];
  if(!x||x.sets.length) return;
  if(!confirm('Retirer '+x.name+' de la séance ?')) return;
  AS.exos.splice(i,1);
  if(AS.cur>i) AS.cur--;
  asSave(); asRender();
}
// Entrer dans un exo (28/09) : UNE seule règle pour tous les chemins (▶ du menu, exo suivant, reprise).
// Un exo sans aucune série faite repart TOUJOURS à la série 1 — les « séries passées » d'un ancien
// passage ne comptent plus (bug « ça commence direct à la série 2 » : skippedSets jamais remis à 0).
function asEnterExo(i){
  var x=AS.exos[i]; if(!x) return;
  if(x.status==='skipped') x.status='pending';
  if(!x.sets.length) x.skippedSets=0;
  AS.cur=i; AS.setIdx=x.sets.length+x.skippedSets+1;
  AS.phase=x.sets.length?'work':'intro'; AS.introIdx=0; AS.pend=null;
  asStopRest();
}
// ▶ « faire maintenant » depuis le menu : l'exo en cours reste en attente avec ses séries (reprenable)
function asJumpTo(i){
  var x=AS.exos[i]; if(!x||x.status==='done'||i===AS.cur) return;
  var prev=AS.exos[AS.cur];
  asEnterExo(i);
  _asSheetOpen=false; _asSheetAdd=false;
  showToast('▶ '+x.name+(prev&&prev.status==='pending'?' — '+prev.name+' t\'attend dans le menu':''));
  asSave(); asRender();
}
function asSkipAt(i){
  var x=AS.exos[i]; if(!x||x.status!=='pending'||i===AS.cur||x.sets.length) return;
  x.status='skipped';
  asSave(); asRender();
}
// Appui long (350 ms) sur une ligne = attraper l'exo pour le déplacer (Melati glissait la ligne
// elle-même, pas la poignée ⣿ → ça sélectionnait le texte). Un mouvement avant = scroll normal.
var _asHold=null;
function asRowHold(ev,i){
  if(_asDrag||ev.button>0) return;
  if(ev.target.closest&&ev.target.closest('button,.as-drag')) return;
  var x0=ev.clientX,y0=ev.clientY,row=ev.currentTarget;
  function cancel(){ if(_asHold){ clearTimeout(_asHold.t); _asHold=null; } document.removeEventListener('pointermove',mv); document.removeEventListener('pointerup',cancel); document.removeEventListener('pointercancel',cancel); }
  function mv(e){ if(Math.abs(e.clientX-x0)>8||Math.abs(e.clientY-y0)>8) cancel(); }
  cancel();
  _asHold={t:setTimeout(function(){
    cancel();
    try{ if(navigator.vibrate) navigator.vibrate(25); }catch(e){}
    asDragStart({target:row,clientY:y0},i,row.classList.contains('as-orow')?'.as-orow':'.as-shrow');
  },350)};
  document.addEventListener('pointermove',mv,{passive:true});
  document.addEventListener('pointerup',cancel);
  document.addEventListener('pointercancel',cancel);
}
function asFinishNow(){
  if(!confirm('Terminer la séance maintenant ? Ce qui est fait sera enregistré.')) return;
  _asSheetOpen=false;
  asFinishWorkout();
}
function asAbandon(){
  var anySets=AS.exos.some(function(x){return x.sets.length;});
  if(!confirm(anySets?'Abandonner SANS enregistrer ? Les séries faites seront perdues.':'Abandonner la séance ?')) return;
  _asSheetOpen=false;
  asDiscard();
  showToast('Séance abandonnée 🌷');
}
// ── Drag & drop de réordonnancement — v2 portée de MASSUP (28/09, bug Melati « ça sélectionne
// juste / ça téléporte des exos en bas ») ──
// Avant : le DOM était déplacé PENDANT le geste et aucun pointercancel n'était écouté → sur iOS le
// geste était annulé (scroll), les écouteurs restaient accrochés et le lâcher suivant rejouait un
// vieil ordre sur une liste périmée. Maintenant : la ligne suit le doigt en transform, les autres
// glissent visuellement, l'ordre n'est commité qu'au lâcher, pointercancel = lâcher propre.
// Marche sur le burger (.as-shrow) et l'écran Prête (.as-orow).
var _asDrag=null;
function asDragStart(ev,i,sel){
  if(ev.preventDefault) ev.preventDefault();
  if(_asDrag) return;
  sel=sel||'.as-shrow';
  var row=ev.target&&ev.target.closest?ev.target.closest(sel):null; if(!row) return;
  var rows=Array.prototype.slice.call(row.parentNode.querySelectorAll(sel));
  var from=rows.indexOf(row); if(from<0) return;
  var r0=row.getBoundingClientRect();
  var step=rows.length>1?(rows[1].getBoundingClientRect().top-rows[0].getBoundingClientRect().top):r0.height+7;
  _asDrag={row:row,rows:rows,from:from,to:from,startY:ev.clientY,step:Math.max(step,r0.height),
    curObj:AS.exos[AS.cur]||null};
  row.classList.add('dragging');
  document.addEventListener('pointermove',asDragMove,{passive:false});
  document.addEventListener('pointerup',asDragEnd);
  document.addEventListener('pointercancel',asDragEnd);
}
// Écouteur permanent NON passif : iOS sait dès le touchstart qu'on peut bloquer le scroll pendant un drag
document.addEventListener('touchmove',function(e){ if(_asDrag) e.preventDefault(); },{passive:false});
function asDragMove(ev){
  if(!_asDrag) return;
  if(ev.preventDefault) ev.preventDefault();
  var d=_asDrag;
  if(!d.row.isConnected){ asDragEnd(); return; } // un re-render a détruit la liste → on lâche proprement
  var dy=ev.clientY-d.startY;
  d.row.style.transform='translateY('+dy+'px)';
  var to=Math.max(0,Math.min(d.rows.length-1,d.from+Math.round(dy/d.step)));
  if(to!==d.to){
    d.to=to;
    d.rows.forEach(function(r,k){
      if(r===d.row) return;
      var sh=0;
      if(k>d.from&&k<=to) sh=-d.step;
      else if(k<d.from&&k>=to) sh=d.step;
      r.style.transform=sh?'translateY('+sh+'px)':'';
    });
  }
}
function asDragEnd(){
  if(!_asDrag) return;
  var d=_asDrag; _asDrag=null;
  document.removeEventListener('pointermove',asDragMove);
  document.removeEventListener('pointerup',asDragEnd);
  document.removeEventListener('pointercancel',asDragEnd);
  d.row.classList.remove('dragging');
  d.rows.forEach(function(r){ r.style.transform=''; });
  if(AS&&d.to!==d.from&&d.from<AS.exos.length&&d.to<AS.exos.length){
    var moved=AS.exos.splice(d.from,1)[0];
    AS.exos.splice(d.to,0,moved);
    // En séance, l'exo EN COURS suit son déplacement ; avant le départ (écran Prête), la séance
    // commence toujours par le 1er de la liste (sinon déplacer l'exo 1 faisait démarrer ailleurs)
    if(AS.step==='exo'&&d.curObj){ var ci=AS.exos.indexOf(d.curObj); if(ci>=0) AS.cur=ci; }
    else AS.cur=0;
    asSave();
  }
  if(AS) asRender();
}
function asExoFoot(x){
  if(AS.phase!=='intro') return '';
  var last=AS.introIdx>=2;
  return '<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asIntroNav(-1)" '+(AS.introIdx===0?'disabled':'')+'>‹</button>'
    +'<button class="as-cta" onclick="'+(last?'asStartExo()':'asIntroNav(1)')+'">'
    +(last?'C\'est parti 💗<span class="as-cta-sub">série 1/'+x.n+'</span>':'Suivant ›<span class="as-cta-sub">'+(AS.introIdx===0?'les conseils':'les erreurs à éviter')+'</span>')
    +'</button>'
    +(last?'':'<button class="as-ghost-btn" onclick="asStartExo()" title="Passer l\'intro">⏩</button>')
    +'</div>';
}
function asIntroNav(d){
  _asDir=d<0?'back':'fwd';
  AS.introIdx=Math.max(0,Math.min(2,AS.introIdx+d));
  asSave(); asRender();
}
function asIntroGoto(i){ _asDir=i<AS.introIdx?'back':'fwd'; AS.introIdx=i; asSave(); asRender(); }
function asWeightRow(x,small){
  if(x.time||x.circuit) return '';
  return '<div class="as-wrow'+(small?' small':'')+'">'
    +'<button class="as-wbtn" onclick="asChgW(-1)">−</button>'
    +(x.band?'<div class="as-winput band-lbl" id="asW">'+bandHtml(x.weight)+'</div>'
      :'<input class="as-winput" id="asW" type="number" step="'+x.inc+'" min="0" value="'+x.weight+'" onblur="asSetW(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/>'
      +'<span class="as-wunit">'+(x.dumb?'kg/main':'kg')+'</span>')
    +'<button class="as-wbtn plus" onclick="asChgW(1)">+</button></div>';
}
function asChgW(dir){
  var x=AS.exos[AS.cur];
  x.weight=x.band?bandStep(x.weight,dir):Math.max(0,Math.round((x.weight+dir*x.inc)*2)/2);
  asSave();
  var inp=$id('asW'); if(inp){ if(x.band) inp.innerHTML=bandHtml(x.weight); else inp.value=x.weight; }
  var chip=$id('as-wchip'); if(chip) chip.textContent=wTxt(EXOS[x.key],x.weight,true);
}
function asSetW(input){
  var x=AS.exos[AS.cur];
  var v=parseFloat(input.value);
  if(isNaN(v)||v<0){ input.value=x.weight; return; }
  x.weight=Math.max(0,Math.round(v*2)/2);
  input.value=x.weight; asSave();
}
function asRenderIntro(x){
  var e=EXOS[x.key];
  var h='<div class="as-intro">';
  if(AS.introIdx===0){
    h+='<div class="as-exo-kicker">Exercice '+(AS.cur+1)+(x.bonus?' · ⭐ bonus':'')+'</div>';
    h+='<div class="as-exo-name xl">'+x.name+'</div>';
    h+='<div class="as-exo-target">'+targetStr(x)+(x.note?'<br><span style="color:var(--yellow)">'+x.note+'</span>':'')+'</div>';
    var bp=bestPrev(x.key);
    if(bp!=null) h+='<div class="as-record-chip">🏆 Record à battre : '+(x.time?bp+(x.mins?' min':' s'):wTxt(e,bp))+'</div>';
    else h+='<div class="as-record-chip first">🏆 Première fois — la perf du jour pose le record.</div>';
    if(EXO_VID[x.key]) h+='<div class="as-demo" style="max-height:none;display:block;">'+exoMedia(x.key,x.name,true)+'</div>';
    else if(IMGS[x.key]) h+='<div class="as-demo"><img src="'+IMGS[x.key]+'" alt="'+x.name+'" loading="lazy"/></div>';
    h+='<div class="as-cue">➡ '+e.cue+(e.bless?'<div class="cue-bless">💡 '+e.bless+'</div>':'')+'</div>';
    if(!x.circuit) h+='<div class="as-cue" style="border-color:rgba(255,201,77,.28);background:rgba(255,201,77,.06);"><div class="cuetxt" style="color:rgba(255,220,140,.92);">'+effortMsg(x)+'</div></div>';
    if(!x.time&&!x.circuit){
      h+='<div class="as-lbl" style="text-align:center;">Poids de travail <span class="as-lbl-hint">cette séance · réf. '+wTxt(e,x.w0,true)+(x.wFactor?' (−10 %)':'')+'</span></div>'+asWeightRow(x);
    }
  } else if(AS.introIdx===1){
    h+='<div class="as-exo-kicker">'+x.name+'</div>';
    h+='<div class="as-exo-name xl">✓ À faire</div>';
    h+='<div class="as-intro-list">';
    (e.tips||[]).forEach(function(t,i){ h+='<div class="as-do big" style="animation-delay:'+(i*0.08)+'s">'+t+'</div>'; });
    h+='</div>';
  } else {
    h+='<div class="as-exo-kicker">'+x.name+'</div>';
    h+='<div class="as-exo-name xl err">✕ À éviter</div>';
    h+='<div class="as-intro-list">';
    (e.errs||[]).forEach(function(t,i){ h+='<div class="as-dont big" style="animation-delay:'+(i*0.08)+'s">'+t+'</div>'; });
    h+='</div>';
  }
  h+='</div>'+asSlideDots(3,AS.introIdx,'asIntroGoto');
  return h;
}
function asStartExo(){
  var x=AS.exos[AS.cur];
  if(!x.sets.length) x.skippedSets=0; // depuis l'intro, un exo jamais commencé démarre à la série 1 (bug 28/09)
  AS.phase='work'; AS.setIdx=x.sets.length+x.skippedSets+1; asSave(); asRender();
}
function asRenderWork(x){
  var h='<div class="as-work">';
  h+='<div class="as-exo-kicker">'+AS.sname+'</div>';
  h+='<div class="as-exo-name lg">'+x.name+'</div>';
  h+='<div class="as-serie-big"><span class="as-serie-lbl">'+(x.circuit?'TOUR':'SÉRIE')+'</span><span class="as-serie-num">'+AS.setIdx+'<em>/'+x.n+'</em></span>'
    +'<span class="as-serie-target">objectif <strong>'+(x.lo===x.hi?cntShort(x,x.lo):x.lo+'-'+x.hi+(x.time?(x.mins?' min':' s'):''))+'</strong>'+(x.uni?' par côté':'')
    +(x.time||x.circuit?'':' · <span id="as-wchip">'+wTxt(EXOS[x.key],x.weight,true)+'</span>')+'</span></div>';
  h+=asWeightRow(x,true);
  h+='<button class="as-bigdone" onclick="asSetDone()">✓ '+(x.circuit?'Tour terminé':'Série terminée')+'</button>';
  h+='<div class="as-skip-row">'
    +'<button class="as-skip-pill" onclick="asSkipSet()">⏭ Sauter '+(x.circuit?'ce tour':'cette série')+'</button>'
    +'<button class="as-skip-pill" onclick="asSkipExo()">⏭⏭ Passer l\'exo</button>'
    +'</div>';
  // Chrono passé/oublié : le relancer sans rien perdre (comme MASSUP)
  if(!AS.restEnd&&x.sets.length>0&&x.rest>0){
    h+='<div class="as-skip-row"><button class="as-skip-pill" onclick="asRestartRest()">↺ Relancer le repos ('+(x.rest>=90?formatTime(x.rest):x.rest+'s')+')</button></div>';
  }
  h+='</div>';
  return h;
}
function asRestartRest(){
  var x=AS.exos[AS.cur]; if(!x||!x.rest) return;
  asStartRest(x.rest,'rest');
  asSave(); asRender();
}
function asSetDone(){
  var x=AS.exos[AS.cur];
  AS.pend={reps:x.reps,feel:null,setNo:AS.setIdx};
  var isLastSet=AS.setIdx>=x.n;
  var hasNext=asPendingAfter()>=0;
  if(!isLastSet&&x.rest>0) asStartRest(x.rest,'ask');
  else if(isLastSet&&hasNext) asStartRest(AS_INTER_REST,'ask');
  else { AS.phase='ask'; asStopRest(); }
  asSave(); asRender();
}
function asRenderAsk(x){
  var p=AS.pend||{reps:x.reps,feel:null};
  var h='<div class="as-mini-timer'+(AS.restEnd?'':' off')+'">⏱ <span id="as-mini-rest">'+formatTime(asRestRemain())+'</span> repos</div>';
  h+='<div class="as-exo-kicker">'+x.name+'</div>';
  h+='<div class="as-exo-name lg">'+(p.editIdx!=null?'✎ Corriger la '+(x.circuit?'tour':'série')+' '+p.setNo+'/'+x.n:(x.circuit?'Tour':'Série')+' '+p.setNo+'/'+x.n+' — alors ?')+'</div>';
  h+='<div class="as-ask-card">';
  h+='<div class="as-lbl">'+(x.circuit?'Tour complet ?':x.time?(x.mins?'Minutes faites':'Secondes tenues'):'Répétitions faites')+(x.uni?' <span class="as-lbl-hint">par côté</span>':'')+'</div>';
  var st=cntStep(x);
  h+='<div class="as-reps-row"><button class="as-wbtn" onclick="asPendReps(-'+st+')">−</button>'
    +'<span class="as-reps-val" id="asPendReps">'+cntShort(x,p.reps)+'</span>'
    +'<button class="as-wbtn plus" onclick="asPendReps('+st+')">+</button></div>';
  h+='<div class="as-lbl" style="margin-top:.9rem;">C\'était comment ?</div>';
  h+='<div class="as-feel-row">';
  AS_FEELS.forEach(function(f){
    h+='<button class="as-feel'+(p.feel===f.v?' on':'')+'" onclick="asPendFeel(\''+f.v+'\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
  });
  h+='</div>';
  var askHint=AS.restOver?'⏱ Repos terminé — valide et enchaîne !':'';
  if(p.feel==='facile') askHint='😌 Facile ? Alors c\'était trop léger — monte le poids ou ajoute 2 reps à la prochaine série 😉';
  h+='<div class="as-ask-hint" id="as-ask-hint">'+askHint+'</div>';
  h+='<button class="as-cta as-cta-full" '+(p.feel?'':'disabled')+' onclick="asValidateSet()">Valider ✓</button>';
  h+='</div>';
  return h;
}
function asPendReps(d){
  if(!AS.pend) return;
  AS.pend.reps=Math.max(0,AS.pend.reps+d);
  asSave();
  var x=AS.exos[AS.cur];
  var el=$id('asPendReps'); if(el) el.textContent=cntShort(x,AS.pend.reps);
}
function asPendFeel(v){ if(!AS.pend) return; AS.pend.feel=v; asSave(); asRender(); }
function asValidateSet(){
  var x=AS.exos[AS.cur], p=AS.pend;
  if(!p||!p.feel) return;
  // Correction EN PLACE d'une série déjà validée (via le bouton retour ‹)
  if(p.editIdx!=null){
    var s0=x.sets[p.editIdx];
    if(s0){ s0.reps=p.reps; s0.feel=p.feel; }
    AS.pend=null;
    if(x.status==='done'){
      var nx0=asPendingAfter();
      if(AS.restEnd&&nx0>=0){ AS.phase='exorest'; asSave(); asRender(); return; }
      if(nx0>=0){ asGotoNextPending(); return; }
      asFinishWorkout(); return;
    }
    AS.setIdx=x.sets.length+x.skippedSets+1;
    AS.phase=AS.restEnd?'rest':'work';
    asSave(); asRender(); return;
  }
  x.sets.push({reps:p.reps,feel:p.feel,w:x.weight});
  AS.pend=null;
  var isLast=x.sets.length+x.skippedSets>=x.n;
  if(!isLast){
    AS.setIdx=x.sets.length+x.skippedSets+1;
    AS.phase=AS.restEnd?'rest':'work';
  } else {
    x.status='done';
    asExoFinished(x);
    var nxt=asPendingAfter();
    if(nxt>=0){
      if(AS.restEnd){ AS.phase='exorest'; }
      else { asGotoNextPending(); return; }
    } else { asFinishWorkout(); return; }
  }
  asSave(); asRender();
}
function asExoFinished(x){
  var e=EXOS[x.key];
  var bp=bestPrev(x.key);
  var rec=null;
  if(x.time){ var m=Math.max.apply(null,x.sets.map(function(s){return s.reps;})); if(bp!=null&&m>bp) rec='Nouveau record : '+m+(x.mins?' min':' s')+' de '+x.name.toLowerCase()+' !'; }
  else if(!x.circuit&&bp!=null&&x.weight>bp) rec='Nouveau record au '+x.name.toLowerCase()+' : '+wTxt(EXOS[x.key],x.weight)+' !';
  if(rec){
    AS.recs.push(rec);
    confetti();
    showToast('🎉 '+rec);
  }
  // Double progression : toutes les séries au haut de fourchette → suggestion +inc au bilan
  if(!x.time&&!x.circuit&&x.sets.length>=x.n&&x.sets.every(function(s){return s.reps>=x.hi;})&&x.weight>=getW(x.key)*(x.wFactor||1)){
    x.suggest=x.band?bandStep(x.weight,1):Math.round((x.weight+x.inc)*2)/2;
    if(x.suggest<=x.weight) delete x.suggest; // déjà au dernier palier d'élastique
  }
}
// Prochain exo en attente : d'abord APRÈS l'exo en cours, puis on reboucle au début de la liste
// (28/09 : un exo laissé en route ou remis plus haut n'était jamais repris → « bloquée »)
function asPendingAfter(){
  var n=AS.exos.length;
  for(var k=1;k<n;k++){ var i=(AS.cur+k)%n; if(AS.exos[i].status==='pending') return i; }
  return -1;
}
function asGotoNextPending(){
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  asEnterExo(nxt);
  asSave(); asRenderIfOpen();
}
function asSkipSet(){
  var x=AS.exos[AS.cur];
  if(AS.setIdx>=x.n){
    x.skippedSets++;
    x.status=x.sets.length?'done':'skipped';
    if(x.status==='done') asExoFinished(x);
    var nxt=asPendingAfter();
    if(nxt<0){ asFinishWorkout(); return; }
    asStartRest(AS_INTER_REST,'exorest');
    asSave(); asRender(); return;
  }
  x.skippedSets++;
  AS.setIdx=x.sets.length+x.skippedSets+1;
  showToast('⏭ Série passée → série '+AS.setIdx+'/'+x.n);
  asSave(); asRender();
}
function asSkipExo(){
  var x=AS.exos[AS.cur];
  x.status='skipped';
  if(x.sets.length){ x.status='done'; asExoFinished(x); }
  showToast('⏭ '+x.name+(x.sets.length?' écourté ('+x.sets.length+'/'+x.n+')':' passé — ▶ dans le menu ☰ pour y revenir'));
  asStopRest();
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  asEnterExo(nxt);
  asSave(); asRender();
}
function asRenderRest(x,inter){
  var rem=asRestRemain();
  var C=2*Math.PI*54;
  var nxtIdx=inter?asPendingAfter():-1;
  var nxt=nxtIdx>=0?AS.exos[nxtIdx]:null;
  var h='<div class="as-rest-wrap'+(inter?' inter':'')+'">';
  h+='<div class="as-rest-lbl">'+(inter?'Exo terminé 🎉':'Repos')+'</div>';
  if(inter){
    var lastGood=x.sets.length&&x.sets.every(function(s){return s.feel!=='echec';});
    h+='<div class="as-between-msg">'+asPick(lastGood?AS_BETWEEN_GOOD:AS_BETWEEN_ROUGH)+'</div>';
  }
  h+='<div class="as-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="7"/>'
    +'<circle id="as-ring-fg" cx="60" cy="60" r="54" fill="none" stroke="'+(inter?'var(--yellow)':'var(--acc)')+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(AS.restTotal?(C*(1-rem/AS.restTotal)).toFixed(1):0)+'" transform="rotate(-90 60 60)"/></svg>'
    +'<div class="as-ring-center"><div class="as-ring-time" id="as-rest-time">'+formatTime(rem)+'</div><div class="as-ring-sub">'+(inter&&nxt?'ensuite :':'prochaine série')+'</div></div></div>';
  if(inter&&nxt) h+='<div class="as-next-exo">👉 '+nxt.name+'</div>';
  else if(!inter) h+='<div class="as-next-exo dim">Série '+AS.setIdx+'/'+x.n+(x.time||x.circuit?'':' · '+wTxt(EXOS[x.key],x.weight,true))+'</div>';
  h+='<div class="as-rest-btns"><button class="as-ghost-btn" onclick="asAddRest(30)">+30s</button>'
    +'<button class="as-ghost-btn" onclick="asSkipRest()">Passer ⏭</button></div>';
  h+='</div>';
  return h;
}
function asFinishWorkout(){
  AS.step='end'; asStopRest();
  if(!AS.end) AS.end={};
  asSave(); asRenderIfOpen();
}
// ── fin de séance : questions (comme MASSUP) ──
// Douleur (07/10, parité MASSUP) : « une douleur ? » non/oui → où + intensité 1-5 → exo raccourci à
// cause d'elle (optionnel). Un exo coché est jugé sur ses séries faites (−0,5 par série manquante,
// comme l'arrêt douleur de MASSUP) ; passé sans série à cause de la douleur = zéro malus.
var PAIN_ZONES=[['poignet','Poignet'],['coude','Coude'],['epaule','Épaule'],['nuque','Nuque / cou'],['hautdos','Haut du dos'],
  ['basdos','Bas du dos'],['hanche','Hanche'],['genou','Genou'],['cheville','Cheville / pied'],['autre','Autre']];
function painZoneLabel(z){ for(var i=0;i<PAIN_ZONES.length;i++) if(PAIN_ZONES[i][0]===z) return PAIN_ZONES[i][1]; return z; }
function painZonesTxt(pains){ return (pains||[]).map(function(p){ return painZoneLabel(p.z).toLowerCase()+(p.lvl?' '+p.lvl+'/5':''); }).join(', '); }
function asPainAnswered(e){ return e.painAny===false||(e.painAny===true&&(e.pains||[]).length>0&&e.pains.every(function(p){return p.lvl>=1;})); }
function asPainBlock(e){
  var h='<div class="as-lbl">🩹 Une douleur pendant la séance ?</div><div class="as-ctx-row">'
    +'<button class="as-ctx-btn'+(e.painAny===false?' on':'')+'" onclick="asPainAny(false)">👌 Non</button>'
    +'<button class="as-ctx-btn'+(e.painAny===true?' on':'')+'" onclick="asPainAny(true)">🩹 Oui</button></div>';
  if(e.painAny!==true) return h;
  var pains=e.pains||[];
  h+='<div class="as-lbl">Où ? <span class="as-lbl-hint">plusieurs zones possibles</span></div><div class="as-ctx-row">';
  PAIN_ZONES.forEach(function(z){
    var on=pains.some(function(p){return p.z===z[0];});
    h+='<button class="as-ctx-btn'+(on?' on':'')+'" onclick="asPainZone(\''+z[0]+'\')">'+z[1]+'</button>';
  });
  h+='</div>';
  pains.forEach(function(p){
    h+='<div class="as-lbl">'+painZoneLabel(p.z)+' — intensité</div><div class="as-scale-hint"><span>Légère</span><span>Forte</span></div><div class="as-scale">';
    for(var i=1;i<=5;i++) h+='<button class="as-scale-btn'+(p.lvl===i?' on':'')+'" onclick="asPainLvl(\''+p.z+'\','+i+')">'+i+'</button>';
    h+='</div>';
  });
  var cand=AS.exos.map(function(x,i){return {x:x,i:i};}).filter(function(o){
    var d=o.x.sets.length; if(o.x.pain) return true; if(!d&&o.x.bonus) return false; return d<(o.x.n||3); });
  h+='<div class="as-lbl">Un exo raccourci à cause de ça ? <span class="as-lbl-hint">optionnel — il sera jugé sur les séries faites</span></div>';
  if(!cand.length) h+='<div class="as-lbl-hint" style="margin:-.3rem 0 .9rem;">Aucun exo écourté aujourd’hui.</div>';
  else{
    h+='<div class="as-ctx-row">';
    cand.forEach(function(o){ h+='<button class="as-ctx-btn'+(o.x.pain?' on':'')+'" onclick="asPainExo('+o.i+')">'+o.x.name+' <small>'+o.x.sets.length+'/'+(o.x.n||3)+'</small></button>'; });
    h+='</div>';
  }
  return h;
}
function asKeepEndNote(){ var note=$id('asEndNote'); if(note) AS.end.note=note.value; }
function asPainAny(v){
  asKeepEndNote();
  AS.end.painAny=v;
  if(v===false){ AS.end.pains=[]; AS.exos.forEach(function(x){ x.pain=false; }); }
  else if(!AS.end.pains) AS.end.pains=[];
  asSave(); asRender();
}
function asPainZone(z){
  asKeepEndNote();
  var pains=AS.end.pains||(AS.end.pains=[]);
  var i=pains.findIndex(function(p){return p.z===z;});
  if(i>=0) pains.splice(i,1); else pains.push({z:z,lvl:null});
  asSave(); asRender();
}
function asPainLvl(z,v){ asKeepEndNote(); (AS.end.pains||[]).forEach(function(p){ if(p.z===z) p.lvl=v; }); asSave(); asRender(); }
function asPainExo(i){ asKeepEndNote(); var x=AS.exos[i]; if(!x) return; x.pain=!x.pain; asSave(); asRender(); }
function asRenderEnd(){
  var e=AS.end||{};
  var h=asHeader('Séance terminée 💗',asElapsedMin()+' min · '+AS.sname);
  h+='<div class="as-scroll">';
  function scale(lbl,field,hints){
    var v=e[field];
    var s='<div class="as-lbl">'+lbl+'</div><div class="as-scale-hint"><span>'+hints[0]+'</span><span>'+hints[1]+'</span></div><div class="as-scale">';
    for(var i=1;i<=5;i++) s+='<button class="as-scale-btn'+(v===i?' on':'')+'" onclick="asEndSet(\''+field+'\','+i+')">'+i+'</button>';
    return s+'</div>';
  }
  h+=scale('⚡ Énergie pendant la séance','energy',['À plat','En feu']);
  h+=scale('⭐ Ressenti global','feeling',['Très dur','Parfaite']);
  if(!AS.end) AS.end={};
  h+=asPainBlock(AS.end);
  h+='<div class="as-lbl">Note (optionnel)</div>';
  h+='<textarea class="as-note" id="asEndNote" rows="2" placeholder="Machine prise, ce qui a bien marché...">'+(e.note||'')+'</textarea>';
  h+='</div>';
  var ok=e.energy&&e.feeling&&asPainAnswered(AS.end);
  h+='<div class="as-foot">'
    +'<button class="as-cta" '+(ok?'':'disabled')+' onclick="asSaveAndReport()">Voir le bilan ›</button>'
    +'</div>';
  return h;
}
function asEndSet(field,v){
  var note=$id('asEndNote'); if(note) AS.end.note=note.value;
  AS.end[field]=v; asSave(); asRender();
}
function asSaveAndReport(){
  var note=$id('asEndNote'); if(note) AS.end.note=note.value;
  if(!AS.savedLogId) asPersistLog();
  AS.step='report'; asSave(); asRender();
}
function asPersistLog(){
  var done=AS.exos.filter(function(x){return x.sets.length;});
  // 28/09 : le log garde TOUT ce qu'il faut pour rejouer le bilan et noter comme MASSUP —
  // n/lo/hi prévus, poids de référence de départ (w0), poids PAR série (ws), ressentis,
  // et les exos PRINCIPAUX passés sans série (skip) : ils comptent 0 dans le /20.
  var log={id:Date.now(),date:todayStr(),sid:AS.sid,dur:asElapsedMin(),nv:2,
    exos:done.map(function(x){return {k:x.key,w:x.weight,w0:x.w0,n:x.n,lo:x.lo,hi:x.hi,
      sets:x.sets.map(function(s){return s.reps;}),feels:x.sets.map(function(s){return s.feel;}),
      ws:x.sets.map(function(s){return s.w!=null?s.w:x.weight;}),bonus:x.bonus||undefined,pain:x.pain||undefined};}),
    skip:AS.exos.filter(function(x){return !x.sets.length&&!x.bonus&&!x.pain;}).map(function(x){return x.key;}),
    painSkip:AS.exos.filter(function(x){return !x.sets.length&&x.pain;}).map(function(x){return x.key;}),
    painAny:AS.end.painAny,pains:(AS.end.pains||[]).filter(function(p){return p.lvl;}),
    recs:AS.recs.slice(),energy:AS.end.energy,feeling:AS.end.feeling,note:AS.end.note||''};
  var sess=melSessFromLog(log);
  log.sc=melScore20(sess);
  sess.exos.forEach(function(x,i){ if(log.exos[i]) log.exos[i].s5=melScoreExo(x); });
  DB.logs.push(log);
  DB.logs.sort(function(a,b){return a.date.localeCompare(b.date);});
  saveDB();
  AS.savedLogId=log.id;
}
// ══════════════════════ NOTATION v2 (28/09) — le moteur MASSUP adapté à Melati ══════════════════════
// Demande Adrien : « note comme pour moi, avec la même data, version Melati, pas trop indulgent ».
// L'ancienne version (04/09) jugeait sur le BAS de la fourchette, sans effondrement ni charge, et la
// « période de réglage » (3 premières fois non notées) cachait presque toutes les notes → supprimée.
// Qualité d'une série (0..1), fourchette lo-hi (la double progression de Melati) :
//  · reps ≥ bas de fourchette : « dur »/« échec » = 1 · « correct » = 0,9 (1 au sommet) · « facile » = 0,8 (0,85 au sommet)
//  · échec à ≤ tolérance sous la fourchette : 1 sur la DERNIÈRE série, 0,85 avant · plus bas = 0,45 (vrai raté)
//  · arrêtée sous la fourchette SANS aller à l'échec : 0,65 à 1 rep près, 0,5 dans la tolérance, 0,45 au-delà (0,4 si « facile »)
// Note /5 = moyenne sur les séries PRÉVUES (série manquante = 0,25)
//  × prorata de charge (séries portées sous le poids de départ, au carré, plancher 0,5 — comme MASSUP),
//  plafond 4,25 (affiché 4) si TOUT est « facile » au sommet de la fourchette (charge dominée). Affichage arrondi bas.
// /20 = moyenne BRUTE des principaux (un principal passé = 0) × 4, arrondie vers le bas,
//  20 réservé aux séances où aucun principal ne descend sous 4,75.
function melTol(t){ return Math.max(2,Math.round((t||0)*0.2)); }
function melSetQ(s,x,isLast){
  var lo=x.lo||1, hi=x.hi||lo, r=s.reps||0, f=s.feel;
  // Dans la fourchette : « dur »/« échec » = plein. S'arrêter à « correct » avant le haut = 0,9
  // (règle MASSUP « cible ou échec, jamais entre les deux »), « facile » = 0,8 (0,85 au sommet).
  if(r>=lo){ if(f==='facile') return r>=hi?0.85:0.8; if(f==='ok') return r>=hi?1:0.9; return 1; }
  var near=r>=lo-melTol(lo);
  if(f==='echec') return near?(isLast?1:0.85):0.45; // déclarer « échec » ne coûte jamais plus que s'arrêter avant
  if(f==='facile') return 0.4;
  return r>=lo-1?0.65:(near?0.5:0.45);
}
function melIsKg(x){ return !x.time&&!x.circuit; }
function melScoreExoRaw(x){
  var sets=(x.sets||[]).slice(0,x.n||3);
  if(!sets.length) return 0;
  var n=x.n||3;
  if(x.bonus) n=Math.max(1,sets.length); // un bonus se juge sur ce qui a été fait (règle MASSUP 18/08)
  var painMiss=0;
  if(x.pain){ painMiss=Math.max(0,n-sets.length); n=Math.max(1,sets.length); } // arrêt douleur : séries faites, −0,5/série manquante
  var q=0;
  sets.forEach(function(s,i){ q+=melSetQ(s,x,i===(x.n||3)-1); });
  q+=0.25*Math.max(0,n-sets.length);
  var base=5*q/n;
  // (Pas de malus « effondrement » : au banc de test il faisait BAISSER la note quand on ajoutait une
  // rep à la 1re série — la dernière série ratée est déjà payée par sa qualité.)
  // Prorata de charge : séries portées SOUS le poids de départ de la séance (w0, gravé depuis le 28/09)
  var ratio=1;
  if(melIsKg(x)&&x.w0>0&&!x.pain){
    var rs=0;
    sets.forEach(function(s){
      var sw=(s.w!=null?s.w:x.weight)||0;
      var r=sw>0?sw/x.w0:1;
      if(s.reps>0&&sw>0){ r=Math.max(r,(sw*(1+s.reps/30))/(x.w0*(1+(x.hi||x.lo||1)/30))); }
      r=Math.min(1,r); rs+=Math.max(0.5,r*r);
    });
    ratio=rs/sets.length;
  }
  var val=Math.max(0,base*ratio-0.5*painMiss);
  // Charge dominée : tout au sommet de la fourchette ET tout « facile » → le poids ne travaille plus
  if(sets.length>=(x.n||3)&&sets.every(function(s){return s.reps>=(x.hi||x.lo)&&s.feel==='facile';})) val=Math.min(val,4.25); // = 0,85 × 5 : plafond monotone (fuzz 29/09), affiché 4/5
  return Math.min(5,val);
}
function melScoreExo(x){ return Math.max(0,Math.floor(melScoreExoRaw(x)*2+1e-9)/2); }
function melScore20(sess){
  var mains=(sess.exos||[]).filter(function(x){return !x.bonus&&!(x.pain&&!(x.sets||[]).length);}); // passé pour douleur = zéro malus
  if(!mains.some(function(x){return (x.sets||[]).length;})) return null;
  var t=0,mn=5;
  mains.forEach(function(x){ var v=(x.sets||[]).length?melScoreExoRaw(x):0; t+=v; if(v<mn) mn=v; });
  var g=Math.floor(t/mains.length*4+1e-9);
  if(g>=20&&mn<4.75) g=19;
  return Math.max(0,Math.min(20,g));
}
// Note d'un log : gravée (nv 2) sinon recalculée à la volée (logs d'avant le 28/09, cloud pas encore migré)
function melLogScore(l){ if(!l) return null; if(l.nv>=2) return l.sc!=null?l.sc:null; return melScore20(melSessFromLog(l)); }
// La définition prévue d'un exo dans SA séance (overrides SCULPT inclus)
function melPlanOf(sid,key){
  var s=DATA.find(function(d){return d.id===sid;});
  var o=(s&&s.exos.find(function(e){return e.key===key;}))||{};
  var e=EXOS[key]||{};
  return {n:o.sets||e.sets||3,lo:o.lo||e.lo||1,hi:o.hi||e.hi||o.lo||e.lo||1,bonus:!!o.bonus};
}
function melExoShape(key,base){
  var e=EXOS[key]||{name:key};
  base.key=key; base.name=e.name;
  base.time=!!e.time; base.mins=!!e.mins; base.circuit=!!e.circuit; base.band=!!e.band; base.dumb=!!e.dumb; base.inc=e.inc||1;
  return base;
}
// Session normalisée depuis un log (live ou ancien) — c'est elle que TOUS les bilans lisent
function melSessFromLog(l){
  var exos=(l.exos||[]).map(function(x){
    var pl=melPlanOf(l.sid,x.k), ws=x.ws||[];
    return melExoShape(x.k,{n:x.n||pl.n,lo:x.lo||pl.lo,hi:x.hi||pl.hi,bonus:x.bonus!=null?!!x.bonus:pl.bonus,
      weight:x.w,w0:x.w0!=null?x.w0:null,status:'done',pain:!!x.pain,
      sets:(x.sets||[]).map(function(r,i){return {reps:r,feel:(x.feels||[])[i]||null,w:ws[i]!=null?ws[i]:x.w};})});
  });
  (l.skip||[]).forEach(function(k){
    var pl=melPlanOf(l.sid,k);
    exos.push(melExoShape(k,{n:pl.n,lo:pl.lo,hi:pl.hi,bonus:false,weight:getW(k),w0:null,status:'skipped',sets:[]}));
  });
  (l.painSkip||[]).forEach(function(k){
    var pl=melPlanOf(l.sid,k);
    exos.push(melExoShape(k,{n:pl.n,lo:pl.lo,hi:pl.hi,bonus:false,weight:getW(k),w0:null,status:'skipped',pain:true,sets:[]}));
  });
  return {id:l.id,date:l.date,sid:l.sid,dur:l.dur,recs:l.recs||[],energy:l.energy,feeling:l.feeling,note:l.note||'',exos:exos,
    painAny:l.painAny,pains:l.pains||[]};
}
// Migration douce : les logs d'avant le 28/09 reçoivent leurs notes v2 (une fois — ensuite elles sont figées)
function melMigrateScores(){
  (DB.logs||[]).forEach(function(l){
    if(l.nv>=2) return;
    var sess=melSessFromLog(l);
    l.sc=melScore20(sess);
    sess.exos.forEach(function(x,i){ if(l.exos&&l.exos[i]) l.exos[i].s5=melScoreExo(x); });
    l.nv=2;
  });
}
function melGradeInfo(sc){
  if(sc>=18) return {cls:'top',emoji:'🌟',title:'Séance en or'};
  if(sc>=15) return {cls:'good',emoji:'💪',title:'Séance solide'};
  if(sc>=12) return {cls:'ok',emoji:'👍',title:'Correct — il manque un cran'};
  if(sc>=8) return {cls:'mid',emoji:'🌱',title:'Séance moyenne'};
  return {cls:'bad',emoji:'🧭',title:'Séance difficile — on analyse et on repart'};
}
var MEL_FEEL_ICO={facile:'😌',ok:'👍',dur:'🥵',echec:'💥'};
function melCnt(x){ return x.circuit?' tours':x.time?(x.mins?' min':' s'):''; }
// « 12 kg · 12😌 12👍 10🥵 » — les séries avec leur ressenti (et le poids s'il a changé en cours d'exo)
function melSetsLine(x){
  var e=EXOS[x.key]||{};
  var wBase=x.sets.length&&x.sets[0].w!=null?x.sets[0].w:x.weight;
  var head=melIsKg(x)?wTxt(e,wBase,true)+' · ':'';
  return head+x.sets.map(function(s){
    var wChg=melIsKg(x)&&s.w!=null&&s.w!==wBase?'<small>@'+fmtKg(s.w)+'</small>':'';
    return s.reps+melCnt(x)+(MEL_FEEL_ICO[s.feel]||'')+wChg;
  }).join(' · ');
}
// Dernière exécution AVANT cette séance (pour « mieux / moins bien que la dernière fois »)
function melPrevOf(key,sess){
  var best=null;
  (DB.logs||[]).forEach(function(l){
    if(String(l.id)===String(sess.id)) return;
    if(l.date>sess.date||(l.date===sess.date&&l.id>sess.id)) return;
    var x=(l.exos||[]).find(function(e){return e.k===key&&(e.sets||[]).length;});
    if(x&&(!best||l.date>best.l.date||(l.date===best.l.date&&l.id>best.l.id))) best={l:l,x:x};
  });
  if(!best) return null;
  return melSessFromLog(best.l).exos.find(function(e){return e.key===key;});
}
function melE1(x){ // force estimée moyenne par série (Epley) · exos au temps : durée moyenne
  var sets=x.sets.slice(0,x.n||3); if(!sets.length) return 0;
  var t=0; sets.forEach(function(s){ var w=(s.w!=null?s.w:x.weight)||0; t+=melIsKg(x)&&w>0?w*(1+(s.reps||0)/30):(s.reps||0); });
  return t/sets.length;
}
// Analyse d'un exo : les faits qui nourrissent le coach, les charges et les phrases par exo
function melAnaExo(x,sess){
  var sets=x.sets.slice(0,x.n||3), lo=x.lo||1, tol=melTol(lo);
  var a={x:x,s5:sets.length?melScoreExo(x):0,done:sets.length,n:x.n||3};
  a.easy=sets.filter(function(s){return s.feel==='facile';}).length;
  a.under=sets.filter(function(s){return s.reps<lo&&s.feel!=='echec';}).length;
  a.hard=sets.filter(function(s){return s.feel==='echec'&&s.reps<lo-tol;}).length;
  a.early=sets.length>1&&sets[0].feel==='echec'&&sets[0].reps<(x.hi||lo);
  a.top=sets.length>=a.n&&sets.every(function(s){return s.reps>=(x.hi||lo);});
  a.allEasy=sets.length>=2&&a.easy===sets.length;
  a.lastFail=sets.length>=a.n&&sets[sets.length-1].feel==='echec'&&sets[sets.length-1].reps>=lo-tol;
  var p=melPrevOf(x.key,sess);
  a.prev=p;
  if(p&&p.sets.length&&sets.length){
    var d=melE1(x)-melE1(p);
    var ref=Math.max(1,melE1(p));
    a.trend=Math.abs(d)/ref<0.03?0:(d>0?1:-1);
    var wN=(sets[0].w!=null?sets[0].w:x.weight)||0, wP=(p.sets[0].w!=null?p.sets[0].w:p.weight)||0;
    a.dW=melIsKg(x)?Math.round((wN-wP)*10)/10:0;
    a.dR=sets.reduce(function(t,s){return t+s.reps;},0)-p.sets.slice(0,x.n||3).reduce(function(t,s){return t+s.reps;},0);
  }
  // Charges pour la prochaine fois : ↑ / = / ↓ (double progression + signaux d'échec)
  var e=EXOS[x.key]||{};
  var wNow=sets.length?((sets[sets.length-1].w!=null?sets[sets.length-1].w:x.weight)||0):x.weight;
  a.wNow=wNow;
  if(!melIsKg(x)||!sets.length){ a.move=null; }
  else if(a.hard>=2||(a.early&&a.under+a.hard>=1)){ a.move=-1; }
  else if((a.top&&!a.early)||(a.allEasy&&sets.every(function(s){return s.reps>=lo;}))){ a.move=1; }
  else a.move=0;
  if(a.move){
    var nv=x.band?bandStep(wNow,a.move):Math.max(0,Math.round((wNow+a.move*(x.inc||e.inc||1))*2)/2);
    if(nv===wNow) a.move=0; else a.wNext=nv;
  }
  return a;
}
function melAnaSess(sess){
  if(sess._ana) return sess._ana;
  var list=sess.exos.filter(function(x){return x.sets.length;}).map(function(x){return melAnaExo(x,sess);});
  var skipped=sess.exos.filter(function(x){return !x.sets.length&&!x.bonus&&!x.pain;});
  var planned=sess.exos.filter(function(x){return !x.bonus;}).reduce(function(t,x){return t+(x.n||3);},0);
  var doneSets=sess.exos.filter(function(x){return !x.bonus;}).reduce(function(t,x){return t+Math.min(x.sets.length,x.n||3);},0);
  sess._ana={exos:list,skipped:skipped,sc:melScore20(sess),planned:planned,doneSets:doneSets};
  return sess._ana;
}
function melNm(a){ return '<strong>'+a.x.name+'</strong>'; }
function melList(arr){ return arr.length<=1?arr.join(''):arr.slice(0,-1).join(', ')+' et '+arr[arr.length-1]; }
// ── Le mot du coach (1re page du bilan) : ce qui était bien, ce qui ne l'était pas, LA consigne ──
// Ton : direct et honnête, jamais culpabilisant (règle du dossier Melati) — on parle d'exécution,
// jamais du corps ni de la nourriture.
function melCoach(sess){
  var A=melAnaSess(sess), good=[], bad=[], focus=null;
  var mains=A.exos.filter(function(a){return !a.x.bonus;});
  // ✅ ce qui était bien
  (sess.recs||[]).slice(0,2).forEach(function(r){ good.push('🏆 '+r); });
  var up=A.exos.filter(function(a){return a.trend===1;});
  if(up.length) good.push('📈 Mieux que la dernière fois sur '+melList(up.slice(0,3).map(function(a){
    return melNm(a)+(a.dW>0?' (+'+fmtKg(a.dW)+' kg)':(a.dR>0?' (+'+a.dR+(a.x.time?' s':' reps')+')':''));}))+'.');
  var clean=mains.filter(function(a){return a.s5>=4.5;});
  if(clean.length) good.push('✅ Exécution au top sur '+melList(clean.slice(0,3).map(melNm))+' : objectif atteint, sans lever le pied.');
  var lastF=A.exos.filter(function(a){return a.lastFail&&a.hard===0&&!a.early;});
  if(lastF.length) good.push('💥 Échec gardé pour la DERNIÈRE série sur '+melList(lastF.slice(0,2).map(melNm))+' — c\'est exactement là qu\'il doit tomber.');
  if(!A.skipped.length&&A.planned&&A.doneSets>=A.planned) good.push('📋 Séance complète : tous les exercices, toutes les séries.');
  var painEx=sess.exos.filter(function(x){return x.pain;});
  if(painEx.length) good.push('🩹 Tu as écouté la douleur sur '+melList(painEx.map(function(x){return '<strong>'+x.name+'</strong>';}))+' — bonne décision : ça ne compte pas contre toi.');
  // ⚠️ ce qui n'allait pas (par ordre d'importance)
  if(A.skipped.length) bad.push('⏭ '+melList(A.skipped.map(function(x){return '<strong>'+x.name+'</strong>';}))+' pas fait'+(A.skipped.length>1?'s':'')+' : zone qui ne travaille pas cette semaine — et ça compte 0 dans la note.');
  var hard=A.exos.filter(function(a){return a.hard>=1||a.early;});
  if(hard.length) bad.push('💥 Trop lourd sur '+melList(hard.slice(0,3).map(melNm))+' : échec loin de l\'objectif'+(hard.some(function(a){return a.early;})?' dès la 1re série':'')+'. L\'échec se garde pour la dernière série.');
  var easy=A.exos.filter(function(a){return a.easy>=2;});
  if(easy.length) bad.push('😌 Trop facile sur '+melList(easy.slice(0,3).map(melNm))+' ('+easy.map(function(a){return a.easy;}).reduce(function(t,v){return t+v;},0)+' séries « facile »). Si ça ne brûle pas, ça ne change rien : tu peux plus lourd.');
  var under=A.exos.filter(function(a){return a.under>=1;});
  if(under.length) bad.push('📉 Séries arrêtées avant l\'objectif sans aller au bout sur '+melList(under.slice(0,3).map(melNm))+'. Soit tu vas jusqu\'à l\'échec, soit tu allèges — mais pas entre les deux.');
  var down=A.exos.filter(function(a){return a.trend===-1;});
  if(down.length) bad.push('↘️ Moins bien que la dernière fois sur '+melList(down.slice(0,3).map(melNm))+'. Une séance moins bonne arrive — si ça se répète, on regarde le sommeil et la récup.');
  if(A.planned&&A.doneSets<A.planned*0.6&&!A.skipped.length) bad.push('⏱ Séance écourtée : '+A.doneSets+' séries sur '+A.planned+' prévues.');
  // 🩹 douleur signalée : toujours en tête, avec la conduite à tenir
  var pz=(sess.pains||[]).filter(function(p){return p.lvl;});
  if(pz.length){
    var strong=pz.some(function(p){return p.lvl>=4;});
    bad.unshift('🩹 Douleur signalée : '+painZonesTxt(pz)+'. '+(strong
      ?'Ne charge pas cette zone à la prochaine séance (variante ou autre exo) — et si ça persiste au repos, on consulte.'
      :'Si elle revient au même endroit la prochaine fois, on allège ou on change d’exo.'));
  }
  // 🎯 LA consigne pour la prochaine fois
  var ups=A.exos.filter(function(a){return a.move===1;}), dns=A.exos.filter(function(a){return a.move===-1;});
  if(A.skipped.length) focus='Commence la prochaine séance par <strong>'+A.skipped[0].name+'</strong> — machine prise ? ▶ un autre exo dans le menu et reviens-y.';
  else if(dns.length) focus='Baisse <strong>'+dns[0].x.name+'</strong> à '+wTxt(EXOS[dns[0].x.key],dns[0].wNext,true)+' et va chercher toutes les reps proprement.';
  else if(ups.length) focus='Monte <strong>'+ups[0].x.name+'</strong> à '+wTxt(EXOS[ups[0].x.key],ups[0].wNext,true)+' — tu as validé la charge actuelle.';
  else if(easy.length) focus='Sur <strong>'+easy[0].x.name+'</strong> : les 2 dernières reps de chaque série doivent être DURES.';
  else focus='Même séance, même exigence : vise le haut de la fourchette sur chaque série.';
  if(!good.length) good.push('💗 Tu es venue et tu as fait le travail — c\'est la base de tout le reste.');
  if(!bad.length) bad.push('✨ Rien à redire aujourd\'hui : objectifs tenus, effort honnête.');
  return {good:good.slice(0,4),bad:bad.slice(0,4),focus:focus,sc:A.sc};
}
function melExoWhy(a){
  var x=a.x;
  if(x.pain) return a.done?'Arrêté sur douleur — jugé sur les séries faites.':'Passé à cause d’une douleur — zéro malus.';
  if(!a.done) return 'Pas fait.';
  if(a.hard||a.early) return 'Échec loin de l\'objectif — trop lourd aujourd\'hui.';
  if(a.allEasy) return 'Tout « facile » : la charge ne te fait plus travailler.';
  if(a.under) return a.under+' série'+(a.under>1?'s':'')+' arrêtée'+(a.under>1?'s':'')+' sous '+x.lo+(x.time?' s':' reps')+' sans aller au bout.';
  if(a.done<a.n&&!x.bonus) return a.done+'/'+a.n+' séries faites.';
  if(a.easy) return 'Solide — '+a.easy+' série'+(a.easy>1?'s':'')+' encore « facile ».';
  if(a.top) return 'Haut de fourchette partout : prête à monter.';
  return 'Objectif tenu, effort honnête.';
}
// ── Classement d'un exo parmi toutes ses exécutions (force estimée Epley, comme MASSUP) ──
function melRankOf(x,sess){
  var list=[];
  (DB.logs||[]).forEach(function(l){
    if(l.date>sess.date) return;
    (l.exos||[]).forEach(function(e,i){
      if(e.k!==x.key||!(e.sets||[]).length) return;
      var sx=melSessFromLog(l).exos[i];
      list.push({id:l.id,date:l.date,x:sx,v:melE1(sx),tot:sx.sets.reduce(function(t,s){return t+s.reps;},0)});
    });
  });
  list.sort(function(a,b){ return (b.v-a.v)||(b.tot-a.tot)||a.date.localeCompare(b.date); });
  var me=list.find(function(o){return String(o.id)===String(sess.id);});
  if(!me) return {rank:0,total:list.length,best:list[0]||null,me:null};
  // Rang = 1 + les séances STRICTEMENT meilleures : à séries identiques, c'est une égalité avec le record
  var better=list.filter(function(o){return o!==me&&(o.v>me.v+0.05||(Math.abs(o.v-me.v)<=0.05&&o.tot>me.tot));}).length;
  return {rank:better+1,total:list.length,best:better?list[0]:me,me:me};
}
// ── Rendu des 5 pages du bilan (live ET relecture) ──
// ══════════════════════ BILANS — PARITÉ MASSUP (29/09, retour Adrien : « trop de différences ») ══════════════════════
// Mêmes composants, mêmes classes et même mise en page que l'app d'Adrien (hc-*, as-ana-*, as-sugg-*,
// wr-*, bn-*). Seule adaptation voulue : la 1re page du bilan de séance = le mot du coach (demande 28/09),
// présenté comme la slide « Analyse » de MASSUP (tuiles + points clés).
function note20Cls(n){ if(n==null) return ''; return n>=18?'n-gold':n>=14?'n-blue':n>=11?'n-green':n>=8?'n-orange':'n-red'; }
function animCountUp(el,dur){
  var target=parseFloat(el.getAttribute('data-cu')); if(isNaN(target)) return;
  var dec=parseInt(el.getAttribute('data-cu-dec')||'0',10), t0=performance.now(); dur=dur||900;
  function step(t){ var p=Math.min(1,(t-t0)/dur); p=1-Math.pow(1-p,3); var v=target*p;
    el.textContent=dec?v.toFixed(dec).replace('.',','):String(Math.round(v)); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
function animCountUpAll(root){ try{ Array.prototype.forEach.call((root||document).querySelectorAll('[data-cu]'),function(el){ animCountUp(el); }); }catch(e){} }
function asAnaTile(lbl,val,unit,sub,tone){
  return '<div class="as-ana-tile t-'+tone+'"><span class="as-ana-lbl">'+lbl+'</span>'
    +'<span class="as-ana-val">'+val+(unit?'<small>'+unit+'</small>':'')+'</span><span class="as-ana-sub">'+sub+'</span></div>';
}
// Un point clé = emoji + accroche d'UNE ligne, tap = la phrase complète (comme asAnaRow MASSUP)
function melAnaRow(line){
  var sp=line.indexOf(' '), ico=sp>0&&sp<6?line.slice(0,sp):'📝', body=sp>0&&sp<6?line.slice(sp+1):line;
  var cut=-1; [' — ',' : ','. '].forEach(function(sep){ var i=body.indexOf(sep); if(i>15&&(cut<0||i<cut)) cut=i; });
  var head=cut>0?body.slice(0,cut):body, more=cut>0;
  return '<div class="as-ana-row'+(more?'':' nomore')+'"'+(more?' onclick="this.classList.toggle(\'open\')"':'')+'>'
    +'<span class="as-ana-ico">'+ico+'</span><span class="as-ana-body"><span class="as-ana-head">'+head+'</span><span class="as-ana-full">'+body+'</span></span>'
    +(more?'<span class="as-ana-arr">▾</span>':'')+'</div>';
}
// Tonnage (kg × reps, haltères ×2) et séance comparable précédente (même séance)
function melTonnage(sess){
  var t=0; sess.exos.forEach(function(x){ if(!melIsKg(x)) return; x.sets.forEach(function(s){ t+=((s.w!=null?s.w:x.weight)||0)*(x.dumb?2:1)*(s.reps||0); }); }); return t;
}
function melRepStats(sess){
  var A=melAnaSess(sess);
  var allSets=sess.exos.reduce(function(t,x){return t+x.sets.length;},0);
  var ton=melTonnage(sess), prev=null;
  (DB.logs||[]).forEach(function(l){ if(l.sid===sess.sid&&String(l.id)!==String(sess.id)&&(l.date<sess.date||(l.date===sess.date&&l.id<sess.id))&&(!prev||l.date>=prev.date)) prev=l; });
  var pT=prev?melTonnage(melSessFromLog(prev)):0;
  var mon=mondayOf(sess.date), wk=(DB.logs||[]).filter(function(l){return l.date>=mon&&(l.date<sess.date||(l.date===sess.date&&l.id<=sess.id));}).length;
  var mains=sess.exos.filter(function(x){return !x.bonus;});
  return {A:A,dur:sess.dur||0,allSets:allSets,pace:allSets?(sess.dur||0)/allSets:0,ton:ton,prevDiff:pT>0?Math.round((ton-pT)/pT*100):null,
    wk:wk,doneCt:mains.filter(function(x){return x.sets.length;}).length,eng:mains.length,skipCt:A.skipped.length};
}
var MEL_REP_TITLES=['Le mot du coach','Ta note','Note par exercice','Classements','Et maintenant ?'];
function melRepPage(sess,i,live){
  var A=melAnaSess(sess), h='';
  if(i===0){
    var S=melRepStats(sess), C=melCoach(sess);
    h+='<div class="as-rep-slide-title">🎙️ Le mot du coach</div>';
    h+='<div class="as-ana-grid">';
    var pv,pu,ps,pt;
    if(!S.allSets||!S.dur){ pv=S.dur||'—'; pu=' min'; ps='—'; pt='flat'; }
    else if(S.dur<30){ pv=S.dur; pu=' min'; ps='séance expresse ⚡'; pt='good'; }
    else { pv=String(Math.round(S.pace*10)/10).replace('.',','); pu=' min/série';
      if(S.pace<=4.5){ ps='repos tenus, rythme sain'; pt='good'; } else if(S.pace<=5.5){ ps='tranquille, dans les clous'; pt='mid'; } else { ps='temps morts — réorganise via ☰'; pt='warn'; } }
    h+=asAnaTile('⏱ Rythme',pv,pu,ps,pt);
    h+=asAnaTile('📋 Exos',S.doneCt+'/'+S.eng,'',S.skipCt?S.skipCt+' passé'+(S.skipCt>1?'s':''):'programme complet',S.skipCt>=2?'mid':(S.skipCt?'warn':'good'));
    if(S.ton>0){ var vs,vt;
      if(S.prevDiff==null){ vs='1re référence enregistrée'; vt='flat'; } else if(S.prevDiff>=8){ vs='+'+S.prevDiff+'% vs la dernière '+(seanceOf(sess.sid)?seanceOf(sess.sid).name:''); vt='good'; }
      else if(S.prevDiff<=-10){ vs=S.prevDiff+'% vs la dernière '+(seanceOf(sess.sid)?seanceOf(sess.sid).name:''); vt='warn'; } else { vs=(S.prevDiff>0?'+':'')+S.prevDiff+'% — stable'; vt='flat'; }
      h+=asAnaTile('🏋️ Volume',Math.round(S.ton).toLocaleString('fr-FR'),' kg',vs,vt);
    } else h+=asAnaTile('🏋️ Volume',S.allSets,' séries','élastiques / poids du corps','flat');
    h+=asAnaTile('📅 Semaine',S.wk+'/'+WEEK_GOAL,'',S.wk>=WEEK_GOAL?'objectif hebdo validé 🎉':'séance n°'+S.wk,S.wk>=WEEK_GOAL?'good':'flat');
    h+='</div>';
    h+='<div class="as-rep-note as-rep-coach">🎯 <strong>La prochaine fois</strong> — '+C.focus+'</div>';
    h+='<div class="as-rep-slide-title" style="font-size:.85rem;padding:.6rem 0 .5rem;">✅ Ce qui était bien <span class="as-rep-slide-hint">tape une ligne pour le détail</span></div>';
    h+='<div class="as-ana-rows">'+C.good.map(melAnaRow).join('')+'</div>';
    h+='<div class="as-rep-slide-title" style="font-size:.85rem;padding:.8rem 0 .5rem;">⚠️ Ce qui n\'allait pas</div>';
    h+='<div class="as-ana-rows">'+C.bad.map(melAnaRow).join('')+'</div>';
  } else if(i===1){
    var g=A.sc, S1=melRepStats(sess), gi=g!=null?melGradeInfo(g):null;
    var sum=g==null?'Aucun exercice principal fait — pas de note.'
      :(S1.doneCt+'/'+S1.eng+' exos principaux faits'+(S1.skipCt?' · '+S1.skipCt+' passé'+(S1.skipCt>1?'s':'')+' (0 dans la note)':'')+' · '+A.doneSets+'/'+A.planned+' séries prévues');
    h+='<div class="as-grade-wrap g-'+(gi?gi.cls:'good')+'">'
      +'<div class="as-grade-emoji">'+(gi?gi.emoji:'🌷')+'</div>'
      +(g!=null?'<div class="as-grade-note"><span class="as-grade-num" data-cu="'+g+'">0</span><span class="as-grade-sur">/20</span></div>'
        +'<div class="as-grade-title t-'+gi.cls+'">'+gi.title+'</div>':'')
      +'<div class="as-grade-sum">'+sum+'</div>'
      +'<div class="as-rep-stats">'
      +'<div class="as-rep-stat"><span>'+S1.doneCt+'/'+S1.eng+'</span>exos</div>'
      +'<div class="as-rep-stat"><span>'+S1.allSets+'</span>séries</div>'
      +'<div class="as-rep-stat"><span>'+(sess.dur||'?')+'</span>min</div>'
      +'<div class="as-rep-stat"><span>'+S1.skipCt+'</span>passés</div></div>'
      +((sess.recs||[]).length?'<div style="font-size:.68rem;color:var(--yellow);margin-top:.7rem;">🏆 '+sess.recs.join(' · ')+'</div>':'')
      +'</div>';
  } else if(i===2){
    h+='<div class="as-rep-slide-title">📋 Note par exercice</div>';
    A.exos.forEach(function(a){
      var sc=a.s5, tone=sc>=4.5?'up':sc>=3.5?'good':sc>=2.5?'mid':'down';
      var lines=[melExoWhy(a)];
      if(a.prev&&a.trend!=null) lines.push(a.trend===1?'📈 Mieux que la dernière fois'+(a.dW>0?' : +'+fmtKg(a.dW)+' kg':(a.dR>0?' : +'+a.dR+(a.x.time?' s':' reps'):'')):a.trend===-1?'↘️ Un peu en dessous de la dernière fois ('+melSetsLine(a.prev)+')':'➡️ Comme la dernière fois — le prochain cran se joue sur une rep de plus.');
      else if(!a.prev) lines.push('🆕 Première fois : cette séance devient ta référence.');
      h+='<div class="as-rep-exo tone-'+tone+'"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+(a.x.bonus?'⭐ ':'')+a.x.name+'</span>'
        +'<span class="as-rep-score s-'+(sc>=4?'good':sc>=2.5?'mid':'bad')+'">'+String(sc).replace('.',',')+'<small>/5</small></span></div>'
        +'<div class="as-rep-exo-w">'+melSetsLine(a.x)+(a.x.bonus?' · <em style="color:var(--mut);font-style:normal;">bonus — hors note /20</em>':'')+'</div>'
        +lines.map(function(l){return '<div class="as-rep-line">'+l+'</div>';}).join('')+'</div>';
    });
    A.skipped.forEach(function(x){
      h+='<div class="as-rep-exo tone-skip"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+x.name+'</span><span class="as-rep-score s-bad">0<small>/5</small></span></div><div class="as-rep-line">Principal passé — compte 0 dans la note /20.</div></div>';
    });
  } else if(i===3){
    h+='<div class="as-rep-slide-title">🏆 Classements — toutes charges</div>';
    var any=false;
    A.exos.forEach(function(a){
      if(a.x.circuit) return;
      var R=melRankOf(a.x,sess); if(!R.me) return;
      any=true;
      var isBest=R.rank===1, podium=!isBest&&R.rank<=3&&R.total>R.rank;
      var badge=R.total===1?'<span class="rec2-badge first">1re fois</span>'
        :isBest?'<span class="rec2-badge gold">🥇 record</span>'
        :podium&&R.rank===2?'<span class="rec2-badge silver">🥈 2<small>e</small> / '+R.total+'</span>'
        :podium?'<span class="rec2-badge bronze">🥉 3<small>e</small> / '+R.total+'</span>'
        :'<span class="rec2-badge">'+R.rank+'<small>e</small> / '+R.total+'</span>';
      var ws=a.x.sets.map(function(s){return s.w!=null?s.w:a.x.weight;}), mn=Math.min.apply(null,ws), mx=Math.max.apply(null,ws);
      var wr=melIsKg(a.x)?(mn===mx?wTxt(EXOS[a.x.key],mn,true):fmtKg(mn)+'→'+fmtKg(mx)+' kg'):'';
      h+='<div class="rec2-card'+(isBest&&R.total>1?' best':(podium?' podium':''))+'">'
        +'<div class="rec2-top"><span class="rec2-name">'+a.x.name+'</span><span class="rec2-w">'+wr+'</span>'+badge+'</div>'
        +'<div class="rec2-line"><span class="rec2-l-lbl">'+(live?'aujourd\'hui':'ce jour-là')+'</span><span class="rec2-sets">'+melSetsLine(a.x)+'</span></div>'
        +(R.total===1?'<div class="rec2-note">La référence est posée — c\'est elle qu\'il faudra battre.</div>'
          :isBest?'<div class="rec2-note gold">Ta meilleure version de cet exo — le sommet du classement est à toi.</div>'
          :'<div class="rec2-line"><span class="rec2-l-lbl">record</span><span class="rec2-sets dim">'+melSetsLine(R.best.x)+' <em>'+fmtShort(R.best.date)+'</em></span></div>')
        +'</div>';
    });
    if(!any) h+='<div class="as-rep-note">Pas encore de classement — les exos du jour n\'ont pas encore d\'historique comparable.</div>';
    else h+='<div class="as-rep-footer-note">Classement toutes charges confondues, par force estimée par série (poids × reps) — un « presque parfait » plus lourd bat un parfait plus léger.</div>';
  } else {
    // « Et maintenant ? » — exactement la slide suggestions de MASSUP : reco chiffrée, stepper − / +,
    // Appliquer, garde-fou anti double-application (la référence a déjà bougé = déjà consommé).
    h+='<div class="as-rep-slide-title">🚀 Et maintenant ?</div>';
    if(live&&!AS.suggestW) AS.suggestW={};
    var anyS=false;
    A.exos.forEach(function(a){
      if(!a.move) return;
      anyS=true;
      var x=a.x, e=EXOS[x.key], up=a.move>0;
      var hdr=up?'🔼 hausse validée':'🔽 baisse conseillée';
      h+='<div class="as-rep-exo tone-'+(up?'up':'down')+'"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+x.name+'</span>'
        +'<span class="as-rep-exo-w">'+hdr+' · reco '+wTxt(e,a.wNext,true)+'</span></div>'
        +'<div class="as-rep-line">'+(up?(a.top?'Toutes tes séries au sommet de la fourchette ('+x.hi+(x.time?' s':' reps')+') — c\'est le signal de la double progression : on monte d\'un cran et on repart du bas de la fourchette.'
            :'Tout était « facile » : ce poids ne te fait plus travailler. Un cran au-dessus, et les 2 dernières reps redeviennent dures.')
          :'Échecs loin de l\'objectif : un cran en dessous pour faire TOUTES tes séries dans la fourchette, proprement. On remonte dès que tout passe.')+'</div>';
      if(!live){ h+='</div>'; return; }
      if(AS.suggestW[x.key]==null) AS.suggestW[x.key]=a.wNext;
      var nw=AS.suggestW[x.key], curRef=getW(x.key);
      var refMoved=x.w0!=null&&Math.abs(curRef-x.w0)>0.01;
      var applied=AS.applied.indexOf(x.key)>=0||refMoved;
      if(applied) h+='<button class="as-apply done" disabled>✅ Appliqué — réf. actuelle '+wTxt(e,curRef,true)+'</button>';
      else h+='<div class="as-sugg-row">'
        +'<button class="as-wbtn" onclick="asSuggestChg(\''+x.key+'\',-1)">−</button>'
        +'<span class="as-sugg-val">'+(x.band?'<small>'+wTxt(e,nw,true)+'</small>':fmtKg(nw)+'<small> '+(x.dumb?'kg/main':'kg')+'</small>')+'</span>'
        +'<button class="as-wbtn plus" onclick="asSuggestChg(\''+x.key+'\',1)">+</button>'
        +'<button class="as-apply" '+(nw===curRef?'disabled':'')+' onclick="asApplySuggest(\''+x.key+'\')">Appliquer ✓</button></div>';
      h+='</div>';
    });
    if(!anyS) h+='<div class="as-rep-note">Pas d\'ajustement de poids suggéré aujourd\'hui — consolide les charges actuelles, la hausse viendra toute seule.</div>';
    if(!live) h+='<div class="as-rep-footer-note">Relecture : les suggestions de ce jour-là (rien n\'est modifié).</div>';
  }
  return h;
}
function asRenderReport(){
  var log=DB.logs.find(function(l){return String(l.id)===String(AS.savedLogId);});
  var sess=log?melSessFromLog(log):null;
  if(!sess) return asHeader('Bilan du LiveUp',AS.sname)+'<div class="as-scroll"><div class="as-rep-note">Bilan indisponible.</div></div><div class="as-foot"><button class="as-cta as-cta-go" onclick="asClose()">Terminer 🌷</button></div>';
  var i=AS.repIdx||0, N=MEL_REP_TITLES.length;
  var h=asHeader('Bilan du LiveUp',AS.sname+' · '+(sess.dur||asElapsedMin())+' min');
  h+='<div class="as-scroll'+(i===1?' as-center':'')+'">'+melRepPage(sess,i,true)+'</div>';
  h+=asSlideDots(N,i,'asRepGoto');
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asRepGoto('+(i-1)+')" '+(i===0?'disabled':'')+'>‹</button>'
    +(i<N-1?'<button class="as-cta" onclick="asRepGoto('+(i+1)+')">Suivant ›<span class="as-cta-sub">'+MEL_REP_TITLES[i+1].toLowerCase()+'</span></button>'
      :'<button class="as-cta" onclick="asClose()">Terminer 🎉</button>')
    +'</div>';
  return h;
}
function asRepGoto(i){ if(!AS) return; i=Math.max(0,Math.min(MEL_REP_TITLES.length-1,i)); _asDir=i<(AS.repIdx||0)?'back':'fwd'; AS.repIdx=i; asSave(); asRender(); }
function asSuggestChg(key,dir){
  if(!AS) return; if(!AS.suggestW) AS.suggestW={};
  var e=EXOS[key]||{}, v=AS.suggestW[key]!=null?AS.suggestW[key]:getW(key);
  AS.suggestW[key]=e.band?bandStep(v,dir):Math.max(0,Math.round((v+dir*(e.inc||1))*2)/2);
  asSave(); asRender();
}
function asApplySuggest(key){
  if(!AS||AS.applied.indexOf(key)>=0) return;
  var v=AS.suggestW&&AS.suggestW[key]; if(v==null) return;
  var x=AS.exos.find(function(e){return e.key===key;});
  if(x&&x.w0!=null&&Math.abs(getW(key)-x.w0)>0.01){ showToast('Référence déjà modifiée depuis le début de la séance'); asRender(); return; }
  setW(key,v); AS.applied.push(key); asSave();
  showToast('📈 Référence mise à jour : '+wTxt(EXOS[key],v));
  asRender();
}
// ── Relecture d'un bilan passé (📊 Bilan au jour du calendrier) — lecture seule ──
var RP=null;
function rpEnsure(){
  var ov=$id('rpOverlay'); if(ov) return ov;
  ov=document.createElement('div'); ov.className='as-overlay'; ov.id='rpOverlay';
  ov.innerHTML='<div class="as-frame" aria-hidden="true"></div><div class="as-body" id="rpBody"></div>';
  document.body.appendChild(ov); return ov;
}
function rpOpen(logId){
  var l=DB.logs.find(function(x){return String(x.id)===String(logId);}); if(!l) return;
  closeDayModal();
  RP={kind:'sess',sess:melSessFromLog(l),idx:0};
  rpEnsure().classList.add('open'); document.body.style.overflow='hidden'; rpRender();
}
function rpClose(){ RP=null; var ov=$id('rpOverlay'); if(ov) ov.classList.remove('open'); document.body.style.overflow=''; try{ renderAll(); }catch(e){} }
function rpGoto(i){ if(!RP) return; var N=RP.kind==='week'?5:MEL_REP_TITLES.length; RP.dir=i<RP.idx?'back':'fwd'; RP.idx=Math.max(0,Math.min(N-1,i)); rpRender(); }
function rpRender(){
  var body=$id('rpBody'); if(!body||!RP) return;
  var renderKey=RP.kind+'|'+(RP.idx||0);
  var previousKey=body.getAttribute('data-render-key');
  var h;
  if(RP.kind==='week') h=melWrRender(RP.mon,RP.idx);
  else {
    var i=RP.idx, N=MEL_REP_TITLES.length, s=seanceOf(RP.sess.sid);
    h='<div class="as-hdr"><div class="as-hdr-left"><button class="as-exit" onclick="rpClose()" title="Fermer">'+AS_EXIT_SVG+'</button></div>'
      +'<div class="as-hdr-mid"><div class="as-hdr-title">Bilan du LiveUp</div><div class="as-hdr-sub">'+(s?s.name:'')+' · '+fmtDateFr(RP.sess.date)+'</div></div><div class="as-hdr-right"></div></div>';
    h+='<div class="as-scroll'+(i===1?' as-center':'')+'">'+melRepPage(RP.sess,i,false)+'</div>';
    var d='<div class="as-dots as-dots-slides">'; for(var k=0;k<N;k++) d+='<span class="as-dot'+(k===i?' cur':'')+'" onclick="rpGoto('+k+')"></span>'; h+=d+'</div>';
    h+='<div class="as-foot"><button class="as-ghost-btn" onclick="rpGoto('+(i-1)+')" '+(i===0?'disabled':'')+'>‹</button>'
      +(i<N-1?'<button class="as-cta" onclick="rpGoto('+(i+1)+')">Suivant ›<span class="as-cta-sub">'+MEL_REP_TITLES[i+1].toLowerCase()+'</span></button>'
        :'<button class="as-cta" onclick="rpClose()">Fermer</button>')+'</div>';
  }
  if(typeof STEPS!=='undefined') STEPS.renderPreservingScroll(body,h,previousKey===renderKey);
  else body.innerHTML=h;
  body.setAttribute('data-render-key',renderKey);
  body.classList.remove('as-anim-fwd','as-anim-back'); void body.offsetWidth; body.classList.add(RP.dir==='back'?'as-anim-back':'as-anim-fwd'); RP.dir='fwd';
  animCountUpAll(body);
}
// ══════════════════════ NOTE DE SEMAINE (règles Melati 28/09) ══════════════════════
// Salle + salsa = 5 activités MINIMUM. Couleur = les salles : 4/4 GOLD · 3/4 VERT · 2 orange · 0-1 rouge.
// Eau et créatine HORS note. Note /20 = salle /8 + activités /3 + qualité des séances /5 + PAS /4 (29/09 :
// moyenne de la semaine ≥ 8 000). Semaine sans données de pas (< 4 jours renseignés) : la note est calculée
// sur les 16 autres points puis ramenée sur 20 — jamais de pénalité parce que le Raccourci n'a pas tourné.
function melWeekNote(mon){
  var days=[]; for(var i=0;i<7;i++) days.push(addDays(mon,i));
  var logs=DB.logs.filter(function(l){return days.indexOf(l.date)>=0;}).slice().sort(function(a,b){return a.date.localeCompare(b.date)||(a.id-b.id);});
  var salle=logs.length, salsa=days.filter(function(d){return DB.salsa[d];}).length, act=salle+salsa;
  var pSalle=salle>=4?8:salle===3?6:salle===2?3:salle===1?1:0;
  var pAct=act>=5?3:act===4?2:act===3?0.75:0;
  var scs=logs.map(melLogScore).filter(function(v){return v!=null;});
  var avg=scs.length?scs.reduce(function(t,v){return t+v;},0)/scs.length:null;
  var pQ=avg!=null?avg*5/20:0;
  var sw=typeof STEPS!=='undefined'?STEPS.week(mon):null, pPas=typeof STEPS!=='undefined'?STEPS.weekPts(mon,4):null;
  var raw=pSalle+pAct+pQ+(pPas!=null?pPas:0), tot=pPas!=null?raw:raw*20/16;
  var tier=salle>=WEEK_GOAL?'gold':salle>=WEEK_GOAL-1?'green':salle>=2?'orange':'red';
  return {mon:mon,logs:logs,salle:salle,salsa:salsa,act:act,avg:avg,pSalle:pSalle,pAct:pAct,pQ:pQ,pPas:pPas,stepAvg:sw?sw.avg:null,stepN:sw?sw.n:0,
    note:Math.max(0,Math.min(20,Math.floor(tot+1e-9))),tier:tier,cur:mon===mondayOf(todayStr()),
    mobi:days.filter(function(d){return DB.mobiDays[d];}).length};
}
// La couleur d'une semaine = ses salles (règle Melati), portée par les classes de note MASSUP
var MEL_TIER_CLS={gold:'n-gold',green:'n-vert',orange:'n-orange',red:'n-red'};
function melWkCls(w){ return MEL_TIER_CLS[w.tier]; }
function melMonthNote(mk){
  var mStart=mk+'-01', d=new Date(mStart+'T12:00:00'); d.setMonth(d.getMonth()+1); d.setDate(0);
  var mEnd=todayStr(d), ws=mondayOf(mStart); if(ws<mStart) ws=addDays(ws,7);
  var notes=[],salle=0;
  while(ws<=mEnd){ var w=melWeekNote(ws); notes.push(w.note); salle+=w.salle; ws=addDays(ws,7); }
  if(!notes.length) return null;
  return {note:Math.round(notes.reduce(function(a,b){return a+b;},0)/notes.length*2)/2,weeks:notes.length,salle:salle};
}
function melWkCoach(w){
  var good=[],bad=[],focus;
  if(w.salle>=WEEK_GOAL) good.push('🥇 '+w.salle+' séances de salle : l\'objectif est rempli.');
  else if(w.salle===WEEK_GOAL-1) good.push('🟢 '+w.salle+' séances de salle — il en manquait une pour le gold.');
  if(w.act>=5) good.push('💃 '+w.act+' activités (salle + salsa) : le minimum de 5 est là.');
  if(w.avg!=null&&w.avg>=15) good.push('💪 Séances de qualité : '+(Math.round(w.avg*10)/10).toString().replace('.',',')+'/20 de moyenne.');
  if(w.stepAvg!=null&&w.stepAvg>=8000) good.push('👟 '+Math.round(w.stepAvg).toLocaleString('fr-FR')+' pas de moyenne'+(w.stepAvg>=10000?' — semaine gold 🥇':' — objectif 8 000 tenu')+'.');
  if(w.stepAvg!=null&&w.stepAvg<8000&&w.stepN>=4) bad.push('👟 '+Math.round(w.stepAvg).toLocaleString('fr-FR')+' pas de moyenne — objectif 8 000. Une marche de 20 min = ~2 500 pas.');
  if(w.salle<WEEK_GOAL) bad.push('🏋️‍♀️ '+w.salle+'/'+WEEK_GOAL+' séances de salle'+(w.salle<=1?' — c\'est la régularité qui transforme, pas les séances parfaites de temps en temps.':'.'));
  if(w.act<5) bad.push('📅 '+w.act+' activité'+(w.act>1?'s':'')+' sur 5 minimum (salle + salsa).');
  if(w.avg!=null&&w.avg<12) bad.push('🎯 Qualité des séances à '+Math.round(w.avg)+'/20 : trop de séries « facile » ou arrêtées avant l\'objectif.');
  if(w.salle<WEEK_GOAL-1) focus='Cale tes '+WEEK_GOAL+' créneaux de salle dès lundi dans ton agenda, comme des rendez-vous.';
  else if(w.salle<WEEK_GOAL) focus='Il manquait UNE séance pour le gold — la HOME de 50 min à la maison compte aussi.';
  else if(w.act<5) focus='Les 4 salles y sont : ajoute la salsa pour passer les 5 activités.';
  else focus='Même rythme la semaine prochaine, et vise une note de séance au-dessus de '+Math.min(19,Math.round((w.avg||14))+1)+'/20.';
  return {good:good,bad:bad,focus:focus};
}
// Erreurs récurrentes de la semaine → PLAN chiffré par exo (même logique que topErrs MASSUP)
function melWkErrs(w){
  var by={};
  w.logs.forEach(function(l){ melSessFromLog(l).exos.forEach(function(x){
    if(!x.sets.length||x.circuit) return;
    var lo=x.lo||1, tol=melTol(lo), o=by[x.key]||(by[x.key]={name:x.name,soft:0,hard:0,easy:0,w:null,lo:lo,hi:x.hi,time:x.time,key:x.key});
    x.sets.forEach(function(s){ if(s.feel==='echec'&&s.reps<lo-tol) o.hard++; else if(s.reps<lo&&s.feel!=='echec') o.soft++; if(s.feel==='facile') o.easy++; });
    o.w=x.sets[x.sets.length-1].w!=null?x.sets[x.sets.length-1].w:x.weight;
  }); });
  return Object.keys(by).map(function(k){return by[k];}).filter(function(o){return o.soft+o.hard+(o.easy>=3?o.easy:0)>=2;})
    .sort(function(a,b){return (b.soft+b.hard+b.easy/2)-(a.soft+a.hard+a.easy/2);}).slice(0,3);
}
// ── Bilan de la semaine : les slides MASSUP (ouverture → séances → exécution → muscles → verdict) ──
function melWrRender(mon,i){
  var w=melWeekNote(mon), we=addDays(mon,6), prev=melWeekNote(addDays(mon,-7));
  var prs=[]; w.logs.forEach(function(l){ (l.recs||[]).forEach(function(r){ prs.push(r); }); });
  var gold=w.tier==='gold', green=w.tier==='green';
  var theme=(i===0||i===4)?(gold?' wr-th-gold':green?' wr-th-green':''):'';
  var h='<div class="as-hdr"><div class="as-hdr-left"><button class="as-exit" onclick="rpClose()" title="Fermer">'+AS_EXIT_SVG+'</button></div><div class="as-hdr-mid"></div><div class="as-hdr-right"></div></div>';
  h+='<div class="as-scroll wr-slide'+theme+'"><div class="wr-inner">';
  var foot='', CONF='<div class="wr-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  if(i===0){
    var hook=gold?(w.act>=5?'Quatre salles ET les cinq activités. C\'est exactement ça, une semaine qui transforme.':'Les quatre salles y sont — la salsa en plus et c\'était parfait.')
      :green?'Semaine verte. Il s\'en est fallu d\'une séance pour le gold — viens voir.'
      :w.salle>=2?'Semaine légère — on va voir ce qui s\'est passé.':w.salle>0?'Une seule séance… on en parle.':'Semaine blanche. On en parle, sans se mentir.';
    h+='<div class="wr-say">'+(w.cur?'Ta semaine en cours.':'Retour sur ta semaine.')+'</div>';
    h+='<div class="wr-title-xl">Ta semaine</div><div class="wr-sub">'+fmtDateFr(mon)+' → '+fmtDateFr(we)+'</div>';
    h+='<div class="wr-hero-wrap">'+(theme?'<div class="wr-halo"></div>':'')+(gold?CONF:'')
      +'<div class="wr-hero-num"><span class="wr-hero-v" data-cu="'+w.salle+'">0</span><span class="wr-hero-sur">/'+WEEK_GOAL+' séances</span></div></div>';
    if(gold) h+='<div class="wr-badge gold">👑 Semaine GOLD</div>'; else if(green) h+='<div class="wr-badge green">✅ Semaine verte</div>';
    h+='<div class="wr-hook">'+hook+'</div>';
    var chips=[];
    chips.push('<div class="wr-chip '+(w.act>=5?'n-vert':'n-orange')+'">💃 '+w.act+'/5 activités</div>');
    if(prs.length) chips.push('<div class="wr-chip n-gold">🏆 '+prs.length+' record'+(prs.length>1?'s':'')+'</div>');
    if(w.avg!=null) chips.push('<div class="wr-chip '+note20Cls(w.avg)+'">📝 '+String(Math.round(w.avg*10)/10).replace('.',',')+'/20 de moyenne</div>');
    chips.push('<div class="wr-chip '+(w.mobi>=5?'n-vert':w.mobi?'n-orange':'n-red')+'">🧘‍♀️ '+w.mobi+' soir'+(w.mobi>1?'s':'')+' de mobilité</div>');
    h+='<div class="wr-chips">'+chips.join('')+'</div>';
    foot='<button class="as-ghost-btn" onclick="rpClose()">Plus tard</button><button class="as-cta" onclick="rpGoto(1)">C\'est parti ›</button>';
  } else if(i===1){
    h+='<div class="wr-say">Tes séances, une par une.</div>';
    var J=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    if(!w.logs.length&&!w.salsa) h+='<div class="as-rep-note">Aucune activité cette semaine. La reprise commence par UNE séance programmée — pas par de la motivation.</div>';
    else {
      h+='<div class="wr-selist">';
      for(var k=0;k<7;k++){ var d=addDays(mon,k);
        w.logs.filter(function(l){return l.date===d;}).forEach(function(l){ var s=seanceOf(l.sid), sc=melLogScore(l);
          h+='<div class="wr-serow" onclick="rpOpen(\''+l.id+'\')" style="cursor:pointer;"><span class="wr-se-ico">'+(s?s.icon:'🏋️')+'</span><span class="wr-se-date">'+J[k]+' '+fmtShort(d)+' · '+(s?s.name:l.sid)+'</span>'
            +(sc!=null?'<span class="wr-se-note '+note20Cls(sc)+'">'+sc+'/20</span>':'<span class="wr-se-note mut">—</span>')+'</div>'; });
        if(DB.salsa[d]) h+='<div class="wr-serow"><span class="wr-se-ico">💃</span><span class="wr-se-date">'+J[k]+' '+fmtShort(d)+' · Salsa</span><span class="wr-se-note n-vert">activité</span></div>';
      }
      h+='</div>';
      var best=null; w.logs.forEach(function(l){ var sc=melLogScore(l); if(sc!=null&&(!best||sc>best.sc)) best={l:l,sc:sc}; });
      if(best) h+='<div class="as-rep-note">🏆 Ta meilleure séance : <strong>'+fmtDateFr(best.l.date)+'</strong> ('+best.sc+'/20)'+(best.sc>=18?' — une séance en or, la référence de ta semaine.':best.sc>=14?' — c\'est elle, ta référence de la semaine.':'.')+' <span style="color:var(--mut)">Touche une séance pour relire son bilan.</span></div>';
      if(prev.salle>0&&w.salle!==prev.salle) h+='<div class="as-rep-note">'+(w.salle>prev.salle?'📈 '+w.salle+' séances contre '+prev.salle+' la semaine d\'avant — la trajectoire est bonne.':'📉 '+w.salle+' séances contre '+prev.salle+' la semaine d\'avant — une semaine plus légère, ça arrive. Deux d\'affilée, ça s\'appelle une tendance.')+'</div>';
    }
    foot='<button class="as-ghost-btn" onclick="rpGoto(0)">‹</button><button class="as-cta" onclick="rpGoto(2)">Suivant ›<span class="as-cta-sub">ton exécution</span></button>';
  } else if(i===2){
    h+='<div class="wr-say">Maintenant, COMMENT tu as travaillé.</div>';
    if(w.avg!=null){
      var av=Math.round(w.avg*10)/10;
      h+='<div class="wr-hero-num small '+note20Cls(av)+'"><span class="wr-hero-v" data-cu="'+av+'" data-cu-dec="'+(av%1?1:0)+'">0</span><span class="wr-hero-sur">/20 de moyenne</span></div>';
      h+='<div class="wr-hook">'+(w.avg>=15?'Exécution de très haut niveau — c\'est ça qui fait monter les charges.':w.avg>=12?'Exécution correcte. Les détails ci-dessous valent des points.':'L\'exécution a coûté cher cette semaine — regarde bien ce qui suit.')+'</div>';
    }
    if(prs.length){
      h+='<div class="wr-pr"><div class="wr-pr-title">🏆 Records de la semaine</div>';
      prs.forEach(function(p){ h+='<div class="wr-pr-row"><span>'+p.replace(/^Nouveau record (au |: )?/,'')+'</span></div>'; });
      h+='<div class="wr-pr-sub">La surcharge progressive, c\'est EXACTEMENT ça.</div></div>';
    }
    var errs=melWkErrs(w);
    if(errs.length){
      h+='<div class="as-lbl">🎯 À corriger la semaine prochaine</div>';
      errs.forEach(function(e){
        var wt=e.w!=null&&!e.time?'<strong>'+wTxt(EXOS[e.key],e.w,true)+'</strong>':'';
        var plan;
        if(e.hard>=e.soft&&e.hard>0) plan=e.hard+' vrai'+(e.hard>1?'s':'')+' raté'+(e.hard>1?'s':'')+' (échec loin de l\'objectif). Le plan : un cran sous '+(wt||'ta référence')+', tu remplis toutes les séries à <strong>'+e.lo+'-'+e.hi+(e.time?' s':' reps')+'</strong> proprement, et tu remontes seulement quand tout passe.';
        else if(e.soft>0) plan=e.soft+' série'+(e.soft>1?'s':'')+' arrêtée'+(e.soft>1?'s':'')+' avant l\'objectif sans aller à l\'échec. Le plan : '+(wt?'à '+wt+', ':'')+'chaque série se termine à <strong>'+e.lo+'+'+(e.time?' s':' reps')+'</strong> OU à l\'échec réel — jamais entre les deux.';
        else plan=e.easy+' séries « facile ». Le plan : un cran au-dessus de '+(wt||'ta charge')+' — les 2 dernières reps doivent être DURES.';
        h+='<div class="as-rep-note tone-warn"><strong>'+e.name+'</strong><br>'+plan+'</div>';
      });
    } else if(w.logs.length) h+='<div class="as-rep-note tone-good">✨ Aucune erreur récurrente — séries menées au bout, charges respectées. Rare et précieux.</div>';
    if(w.logs.length&&w.mobi===0) h+='<div class="wr-alert"><div class="wr-alert-title">🚨 ZÉRO mobilité cette semaine</div><div class="wr-alert-sub">C\'est elle qui débloque ton écart et tes hanches — 15 min le soir devant une série, dès ce soir 🧘‍♀️</div></div>';
    else if(w.mobi>0) h+='<div class="as-rep-note tone-good">🧘‍♀️ '+w.mobi+' soir'+(w.mobi>1?'s':'')+' de mobilité cette semaine'+(w.mobi>=5?' — objectif rempli.':' — objectif 5.')+'</div>';
    foot='<button class="as-ghost-btn" onclick="rpGoto(1)">‹</button><button class="as-cta" onclick="rpGoto(3)">Suivant ›<span class="as-cta-sub">tes muscles</span></button>';
  } else if(i===3){
    h+='<div class="wr-say">Muscle par muscle, qui a travaillé ?</div>';
    var vol=muscleVolume(mon,we);
    h+='<div class="wr-volwrap">'+melVolBarsHtml(vol)+'</div>';
    h+='<div class="mv-hint" style="display:block;margin-top:.4rem;">6+ séries = ça construit · 10+ = zone rose</div>';
    if(w.logs.length){
      var top=VOL_GROUPS.map(function(g){return g.label;}).filter(function(lb){return (vol[lb]||0)>=10;});
      var zero=VOL_GROUPS.map(function(g){return g.label;}).filter(function(lb){return !(vol[lb]||0);});
      if(top.length) h+='<div class="as-rep-note tone-gold">🏆 Zone rose : <strong>'+top.join(', ')+'</strong> — le volume des semaines qui sculptent.</div>';
      if(zero.length) h+='<div class="as-rep-note tone-warn">💤 Délaissé'+(zero.length>1?'s':'')+' cette semaine : <strong>'+zero.join(', ')+'</strong>. Un bonus bien placé au prochain LiveUp répare ça.</div>';
      if(!zero.length) h+='<div class="as-rep-note tone-good">⚖️ Tous les muscles ont travaillé — zéro trou.</div>';
    }
    foot='<button class="as-ghost-btn" onclick="rpGoto(2)">‹</button><button class="as-cta" onclick="rpGoto(4)">Le verdict ›</button>';
  } else {
    var C=melWkCoach(w), nc=melWkCls(w);
    h+='<div class="wr-say">Le verdict de ta semaine.</div>';
    h+='<div class="wr-hero-wrap">'+(theme?'<div class="wr-halo"></div>':'')+(gold?CONF:'')
      +'<div class="wr-note20 '+nc+'"><span class="wr-note20-v" data-cu="'+w.note+'">0</span><span class="wr-note20-sur">/20</span></div></div>';
    if(gold) h+='<div class="wr-badge gold">👑 Semaine GOLD — 4/4 salles</div>'; else if(green) h+='<div class="wr-badge green">✅ Semaine verte — 3/4 salles</div>';
    h+='<div class="wr-hook">'+(w.note>=18?'C\'est exactement ça, une semaine qui transforme.':w.note>=14?'Grosse semaine. On enchaîne.':w.note>=11?'Semaine solide. La marche au-dessus se joue sur les détails.':w.note>=8?'Semaine en retrait — identifie LE maillon faible et corrige-le dès lundi.':'Semaine ratée. Pas de discours : une séance programmée MAINTENANT et on repart.')+'</div>';
    h+='<div class="wr-breakdown">'
      +'<div class="wr-b-row"><span>🏋️‍♀️ Salle — '+w.salle+'/'+WEEK_GOAL+' séances</span><span style="color:var(--acc)">'+fmtKg(w.pSalle)+' /8</span></div>'
      +'<div class="wr-b-row"><span>💃 Activités — '+w.act+'/5 (salle + salsa)</span><span style="color:var(--acc2)">'+fmtKg(w.pAct)+' /3</span></div>'
      +'<div class="wr-b-row"><span>📝 Qualité — '+(w.avg!=null?'moy. '+String(Math.round(w.avg*10)/10).replace('.',',')+'/20':'pas de LiveUp')+'</span><span style="color:var(--yellow)">'+String(Math.round(w.pQ*10)/10).replace('.',',')+' /5</span></div>'
      +'<div class="wr-b-row"><span>👟 Pas — '+(w.stepAvg!=null?'moy. '+Math.round(w.stepAvg).toLocaleString('fr-FR')+' / 8 000':'pas renseignés')+'</span><span style="color:var(--st-green,#3FD68A)">'+(w.pPas!=null?String(w.pPas).replace('.',',')+' /4':'— (note ramenée sur 20)')+'</span></div>'
      +'</div>';
    h+='<div class="wr-msgs"><div class="as-rep-note">🎯 '+C.focus+'</div>'+C.bad.slice(0,2).map(function(m){return '<div class="as-rep-note">'+m+'</div>';}).join('')+'</div>';
    h+='<div class="as-rep-footer-note">4/4 salles = gold · 3/4 = vert · l\'eau et la créatine ne comptent pas dans la note.</div>';
    foot='<button class="as-ghost-btn" onclick="rpGoto(3)">‹</button><button class="as-cta" onclick="rpClose()">Terminer 🎉</button>';
  }
  h+='</div></div>';
  var dd='<div class="as-dots as-dots-slides">'; for(var q=0;q<5;q++) dd+='<span class="as-dot'+(q===i?' cur':'')+'" onclick="rpGoto('+q+')"></span>'; h+=dd+'</div>';
  h+='<div class="as-foot">'+foot+'</div>';
  return h;
}
function wkOpen(mon){
  closeDayModal();
  RP={kind:'week',mon:mon,idx:0};
  rpEnsure().classList.add('open'); document.body.style.overflow='hidden'; rpRender();
}
function asClose(){
  AS=null; asSave(); asHideOverlay(); asRenderBubble();
  if(_asTimer){ clearInterval(_asTimer); _asTimer=null; }
  buildSeances(); renderAll();
}

// ══════════════════════ MOBILITÉ 🧘 (espace plein écran, style Détente MASSUP) ══════════════════════
var DZ_RUN=null,_dzTimer=null;
var DZ_RUNS={soir:MOBI_SOIR,longue:MOBI_LONGUE,salsaApres:SALSA_APRES};

// ── Sons (WebAudio, comme le LiveUp MASSUP) — retour Melati 26/08 : « une sonnerie pour
// la fin d'un exercice / d'un chrono ». Le contexte audio est créé sur un TAP (règle iOS),
// d'où mlAudio() appelé dans dzLaunch / dzNext / asGo. Préférence DB.snd (défaut : activé).
// ⚠ iOS : le bouton silencieux de l'iPhone coupe aussi ces sons — la vibration reste.
var _mlAudioCtx=null;
function mlAudio(){
  if(!_mlAudioCtx){ try{ _mlAudioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(_mlAudioCtx&&_mlAudioCtx.state==='suspended'){ try{ _mlAudioCtx.resume(); }catch(e){} }
  return _mlAudioCtx;
}
function mlBeep(freq,dur,delay,vol){
  var ctx=mlAudio(); if(!ctx) return;
  try{
    var t=ctx.currentTime+(delay||0);
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol||0.25,t+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+dur+0.05);
  }catch(e){}
}
function mlSoundOn(){ return !DB||DB.snd!==false; }
function mlSound(name){
  if(!mlSoundOn()) return;
  if(name==='tick'){ mlBeep(880,0.09,0,0.22); }                                   // 3-2-1
  else if(name==='go'){ mlBeep(784,0.2,0,0.32); }                                 // fin de la mise en place → le chrono part
  else if(name==='done'){ mlBeep(523,0.16,0,0.3); mlBeep(659,0.16,0.17,0.3); mlBeep(784,0.34,0.34,0.34); } // fin d'exo / de repos
  else if(name==='finish'){ mlBeep(523,0.14,0,0.3); mlBeep(659,0.14,0.15,0.3); mlBeep(784,0.14,0.3,0.3); mlBeep(1046,0.5,0.45,0.34); } // routine terminée
}
function mlToggleSound(){
  DB.snd=!mlSoundOn(); saveDB();
  if(mlSoundOn()){ mlAudio(); mlSound('tick'); }
  var b=$id('mlSndBtn'); if(b){ b.textContent=mlSoundOn()?'🔔':'🔕'; b.title=mlSoundOn()?'Sons activés':'Sons coupés'; }
}
function mlSndBtn(){ return '<button class="as-hbtn" id="mlSndBtn" onclick="mlToggleSound()" title="'+(mlSoundOn()?'Sons activés':'Sons coupés')+'">'+(mlSoundOn()?'🔔':'🔕')+'</button>'; }

// ── Contrôles vidéo maison (⏯ + timeline) — retour Melati 26/08 : « mettre pause et revenir
// en arrière sur les vidéos ». Handlers inline → survivent aux re-rendus innerHTML ; le
// `timeupdate` natif (~4 Hz) pilote la timeline, zéro setInterval supplémentaire (batterie).
function mvWrap(videoHtml){
  return '<div class="mv">'+videoHtml
    +'<div class="mv-ctl"><button class="mv-btn" onclick="mvToggle(this)" title="Lecture / pause">⏸</button>'
    +'<button class="mv-btn mv-sm" onclick="mvBack(this)" title="Revenir 5 secondes en arrière">‹ 5 s</button>'
    +'<input class="mv-seek" type="range" min="0" max="1000" value="0" oninput="mvSeek(this)" aria-label="Avancer / reculer la vidéo">'
    +'<button class="mv-btn mv-sm" onclick="mvSlow(this)" title="Ralenti">×0,5</button>'
    +'</div></div>';
}
// ‹ 5 s : revient en arrière (et relance si la vidéo était en pause, pour revoir le geste)
function mvBack(btn){
  var v=mvVideo(btn); if(!v) return;
  if(!v.getAttribute('src')&&v.getAttribute('data-src')) v.src=v.getAttribute('data-src');
  try{ v.currentTime=Math.max(0,(v.currentTime||0)-5); }catch(e){}
  var p=v.play(); if(p&&p.catch) p.catch(function(){});
}
// Ralenti ×0,5 ⇄ vitesse normale
function mvSlow(btn){
  var v=mvVideo(btn); if(!v) return;
  var slow=v.playbackRate>=1; v.playbackRate=slow?0.5:1; v.defaultPlaybackRate=v.playbackRate;
  btn.classList.toggle('on',slow);
}
function mvVideo(el){ var w=el.closest('.mv'); return w?w.querySelector('video'):null; }
function mvToggle(btn){
  var v=mvVideo(btn); if(!v) return;
  if(v.paused){ if(!v.getAttribute('src')&&v.getAttribute('data-src')) v.src=v.getAttribute('data-src'); var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  else v.pause();
}
function mvSeek(bar){
  var v=mvVideo(bar); if(!v||!isFinite(v.duration)||!v.duration) return;
  v.currentTime=v.duration*(bar.value/1000);
}
function mvTime(v){
  var w=v.closest('.mv'); if(!w) return;
  var bar=w.querySelector('.mv-seek');
  if(bar&&isFinite(v.duration)&&v.duration) bar.value=Math.round(1000*v.currentTime/v.duration);
}
function mvState(v){
  var w=v.closest('.mv'); if(!w) return;
  var b=w.querySelector('.mv-btn'); if(b) b.textContent=v.paused?'▶':'⏸';
}
function dzOpen(){
  var ov=$id('dzOverlay'); if(!ov) return;
  try{ if(typeof PV!=='undefined') PV.pull(false); }catch(e){} // un mot frais d'Adrien avant la routine ?
  ov.classList.add('open');
  document.body.style.overflow='hidden';
  dzRender();
}
function dzClose(){
  dzStopTimer();
  // Fermer depuis l'écran de fin = la routine EST finie : on la garde (sans les réponses non données)
  if(DZ_RUN&&DZ_RUN.step==='end'){ dzSaveEnd(true); return; }
  DZ_RUN=null; DZ_PREV=null; dzSyncWake();
  var ov=$id('dzOverlay'); if(ov) ov.classList.remove('open');
  document.body.style.overflow='';
  renderAll();
}
function dzHeader(title,sub,o){
  o=o||{};
  return '<div class="as-hdr">'
    +'<div class="as-hdr-left"><button class="as-exit" onclick="dzClose()" title="Fermer">'+AS_EXIT_SVG+'</button>'
    +(o.back?'<button class="as-hbtn as-backbtn" onclick="'+o.back+'" title="Retour">‹</button>':'')+'</div>'
    +'<div class="as-hdr-mid"><div class="as-hdr-title">'+title+'</div>'+(sub?'<div class="as-hdr-sub">'+sub+'</div>':'')+'</div>'
    +'<div class="as-hdr-right">'+(o.right||'')+'</div></div>';
}
function dzRow(id,ico,name,sub,tint){
  return '<button style="display:flex;align-items:center;gap:.85rem;width:100%;text-align:left;background:var(--x-glass);box-shadow:var(--x-inset);border:1px solid '+tint+';border-radius:var(--x-r-lg);padding:1.05rem 1.1rem;color:var(--txt);cursor:pointer;font-family:\'Manrope\',system-ui,sans-serif;" onclick="dzStart(\''+id+'\')">'
    +'<span style="font-size:1.5rem;flex-shrink:0;">'+ico+'</span>'
    +'<span style="flex:1;min-width:0;"><span style="display:block;font-family:\'Saira\',system-ui,sans-serif;font-style:italic;font-weight:800;font-size:.95rem;">'+name+'</span>'
    +'<span style="display:block;font-size:.66rem;color:var(--mut);font-weight:600;margin-top:.15rem;">'+sub+'</span></span>'
    +'<span style="font-size:1.1rem;color:var(--mut);">›</span></button>';
}
var _dzDir='fwd';
function dzApply(body,h){
  body.innerHTML=h;
  body.classList.remove('as-anim-fwd','as-anim-back');
  void body.offsetWidth;
  body.classList.add(_dzDir==='back'?'as-anim-back':'as-anim-fwd');
  _dzDir='fwd';
}
function dzRender(){
  dzSyncWake();
  var body=$id('dzBody'); if(!body) return;
  if(DZ_RUN){
    if(DZ_RUN.step==='rate'){ dzApply(body,dzRenderRate()); return; }
    if(DZ_RUN.step==='end'){ dzApply(body,dzRenderEnd()); return; }
    dzApply(body,dzRenderRun()); return;
  }
  if(DZ_PREV){ dzApply(body,dzRenderPreview()); return; }
  var stk=mobiStreak();
  var doneToday=!!DB.mobiDays[todayStr()];
  var h=dzHeader('Mobilité 🧘‍♀️','souplesse · écart');
  h+='<div class="as-scroll" style="display:flex;flex-direction:column;gap:.7rem;">';
  h+='<div style="font-size:.72rem;color:var(--mut);line-height:1.5;font-weight:600;">Ta souplesse a déjà existé — on ne fait que la rouvrir. Le détail de chaque position s\'affiche pendant la routine, laisse-toi guider.</div>';
  h+=dzRow('soir','🌙','Routine du soir','15 min · tous les soirs, sur ton tapis','rgba(201,123,255,.3)');
  h+=dzRow('longue','🧘','Séance longue','25 min · 2-3× par semaine max — c\'est elle qui fait gagner l\'écart','rgba(77,157,255,.3)');
  h+=dzRow('salsaApres','💃','Après la salsa','8-10 min · muscles chauds, la meilleure fenêtre — remplace la routine du soir ce jour-là','rgba(255,132,82,.3)');
  h+='<div style="font-size:.68rem;color:var(--mut);font-weight:700;text-align:center;margin-top:.2rem;">'
    +(doneToday?'✅ Mobilité du jour faite':(stk>0?'🔥 '+stk+' jour'+(stk>1?'s':'')+' d\'affilée — objectif 5 / semaine':'Objectif : 5 soirs / semaine'))+'</div>';
  h+='</div>';
  dzApply(body,h);
}
// Un tap sur une routine ouvre d'abord sa PRÉSENTATION (fiches par position :
// image, comment se placer, quoi sentir, erreurs) — le chrono ne part qu'au « Commencer »
var DZ_PREV=null;
function dzStart(id){ _dzDir='fwd'; DZ_PREV={id:id,open:null}; dzRender(); }
var DZ_NAMES={soir:{name:'Routine du soir',ico:'🌙',dur:'15 min'},longue:{name:'Séance longue',ico:'🧘',dur:'25 min'},salsaApres:{name:'Après la salsa',ico:'💃',dur:'8-10 min'}};
// Dépliage d'une fiche SANS re-render (sinon l'animation rejoue = « shake » et le
// scroll remonte en haut — retour Adrien 24/08). On toggle la classe .open en place,
// et on ne lance la vidéo (data-src) qu'à l'ouverture — jamais 18 vidéos qui chargent.
function dzTogglePrev(i){
  var body=$id('dzBody');
  var exs=body?body.querySelectorAll('.ex'):null;
  if(!exs||!exs[i]){ DZ_PREV.open=(DZ_PREV.open===i?null:i); dzRender(); return; }
  var was=DZ_PREV.open;
  if(was!=null&&was!==i&&exs[was]){ exs[was].classList.remove('open'); mobiVidStop(exs[was]); }
  if(was===i){ exs[i].classList.remove('open'); mobiVidStop(exs[i]); DZ_PREV.open=null; dzUpdateCta(); return; }
  exs[i].classList.add('open'); DZ_PREV.open=i;
  mobiVidStart(exs[i]);
  dzUpdateCta();
}
function mobiVidStart(el){
  var v=el.querySelector('video');
  if(!v) return;
  if(!v.getAttribute('src')&&v.getAttribute('data-src')) v.src=v.getAttribute('data-src');
  var p=v.play(); if(p&&p.catch) p.catch(function(){});
}
function mobiVidStop(el){ var v=el.querySelector('video'); if(v){ try{ v.pause(); }catch(e){} } }
// ── Helpers fiches mobilité ──
// La dose en toutes lettres — plus jamais de « 0:45 × 2 » : on écrit « 45 s le
// côté droit, puis 45 s le côté gauche ». Priorité au champ dose de la fiche.
function mobiDoseTxt(b,it){
  var db=MOBI_DB[it.k]||{};
  if(db.dose) return db.dose;
  var same=b.items.filter(function(x){return x.k===it.k;});
  if(same.length===2&&/ — droite$/.test(same[0].n)) return fmtDur(it.d)+' le côté droit, puis '+fmtDur(it.d)+' le côté gauche';
  if(same.length>1) return same.length+' passages de '+fmtDur(it.d);
  return fmtDur(it.d)+', sans changer de position';
}
// Visuel systématique : VIDÉO de démonstration quand elle existe (MuscleWiki, démo
// femme, vérifiées frame par frame), sinon photo vérifiée, sinon schéma SVG.
// live=true (écran guidé) : la vidéo démarre seule. Sinon (fiche accordéon) : elle
// attend l'ouverture de la fiche (data-src, cf. mobiVidStart) — batterie + data.
function mobiMedia(db,alt,live){
  if(db.vid){
    var poster=db.img?' poster="'+db.img+'"':'';
    var ev=' ontimeupdate="mvTime(this)" onplay="mvState(this)" onpause="mvState(this)" onclick="mvToggle(this)"';
    if(live) return mvWrap('<video src="'+db.vid+'"'+poster+ev+' autoplay muted loop playsinline preload="metadata" style="width:100%;max-height:200px;object-fit:contain;border-radius:12px;display:block;"></video>');
    return mvWrap('<video data-src="'+db.vid+'"'+poster+ev+' muted loop playsinline preload="none" style="width:100%;max-height:200px;object-fit:contain;border-radius:12px;display:block;"></video>');
  }
  if(db.img) return '<img src="'+db.img+'" alt="'+alt+'" loading="lazy" style="width:100%;height:100%;max-height:190px;object-fit:contain;"/>';
  if(db.svg&&MOBI_SVG[db.svg]) return MOBI_SVG[db.svg];
  return '';
}
function mobiVisual(db,alt){
  var m=mobiMedia(db,alt,false);
  if(!m) return '';
  return '<div class="demo" style="border-radius:12px;'+(db.vid?'':'min-height:150px;')+'margin-bottom:.2rem;'+(db.svg&&!db.vid&&!db.img?'padding:.4rem .2rem;':'')+'">'+m+'</div>';
}
// Les consignes en étapes numérotées, une action simple par ligne — aérées et lisibles
function mobiSteps(db){
  if(!db.steps) return '';
  return '<div class="cue"><div class="cuelbl">➡ Comment faire, étape par étape</div>'
    +db.steps.map(function(s,i){return '<div style="display:flex;gap:.55rem;align-items:flex-start;margin-top:.6rem;">'
      +'<span style="flex-shrink:0;width:1.25rem;height:1.25rem;border-radius:50%;background:rgba(255,126,182,.16);color:var(--acc);font-size:.66rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:.08rem;">'+(i+1)+'</span>'
      +'<span class="cuetxt" style="flex:1;font-size:.76rem;line-height:1.6;">'+s+'</span></div>';}).join('')+'</div>';
}
function dzRenderPreview(){
  var meta=DZ_NAMES[DZ_PREV.id];
  var h=dzHeader(meta.ico+' '+meta.name,meta.dur+' · lis une fois, ensuite laisse-toi guider');
  h+='<div class="as-scroll">';
  h+='<div style="font-size:.66rem;color:var(--mut);font-weight:600;line-height:1.5;margin:.2rem 0 .1rem;">💡 Ouvre une position : « Commencer ici » lance la routine à partir d\'elle.</div>';
  var idx=0,flat=0,total=0,elapsed=0;
  DZ_RUNS[DZ_PREV.id].forEach(function(b){ b.items.forEach(function(it){ total+=it.d; }); });
  DZ_PREV.starts=[]; // fiche i → 1er item de la routine à plat (pour « Commencer ici »)
  DZ_RUNS[DZ_PREV.id].forEach(function(b){
    h+='<div class="as-lbl" style="margin:.7rem 0 .35rem;">'+b.b+'</div>';
    var seen={};
    b.items.forEach(function(it){
      var myFlat=flat++, before=elapsed; elapsed+=it.d;
      if(seen[it.k]) return; // une fiche par position (pas droite + gauche + 4 cycles...)
      seen[it.k]=true;
      var db=MOBI_DB[it.k]||{};
      var i=idx++;
      var open=DZ_PREV.open===i;
      var name=it.n.replace(/ — (droite|gauche)$/,'').replace(/^Cycle 1 · .*$/,'PNF contracté-relâché');
      DZ_PREV.starts[i]={idx:myFlat,name:name,left:total-before};
      h+='<div class="ex'+(open?' open':'')+'" style="margin-bottom:.5rem;">'
        +'<button class="exbtn" style="padding:.8rem 1rem;" onclick="dzTogglePrev('+i+')">'
        +'<div class="exinf"><div class="exname" style="margin-bottom:.1rem;">'+name+'</div>'
        +'<div style="font-size:.62rem;color:var(--mut);font-weight:600;">'+mobiDoseTxt(b,it)+'</div></div>'
        +'<div class="exarr">▾</div></button>'
        +'<div class="exbody"><div class="exinner no-demo"><div class="exc" style="padding:1rem;display:flex;flex-direction:column;gap:.75rem;">'
        +mobiVisual(db,name)
        +(db.why?'<div style="font-size:.74rem;color:var(--acc);font-weight:700;line-height:1.55;background:rgba(255,126,182,.08);border-radius:10px;padding:.6rem .7rem;">💡 '+db.why+'</div>':'')
        +mobiSteps(db)
        +'<div><div class="seclbl">Ce que tu dois sentir</div><div class="tip"><div class="tdot"></div>'+(db.feel||'')+'</div></div>'
        +(db.errs?'<div class="errs"><div class="errlbl">⚠ À éviter</div>'+db.errs.map(function(er){return '<div class="erritem"><span class="errx">✕</span>'+er+'</div>';}).join('')+'</div>':'')
        +'</div></div></div></div>';
    });
  });
  h+='</div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="_dzDir=\'back\';DZ_PREV=null;dzRender()">‹ Retour</button>'
    +'<button class="as-cta as-cta-go" id="dzCta" onclick="dzLaunchFromOpen()">'+dzCtaHtml()+'</button>'
    +'</div>';
  return h;
}
// « Commencer ici » (retour Melati 26/08) : la fiche OUVERTE devient le point de départ —
// flow : routine du soir › Papillon › Commencer = la séance démarre à Papillon.
function dzCtaHtml(){
  var meta=DZ_NAMES[DZ_PREV.id];
  var o=DZ_PREV.open, s=(o!=null&&DZ_PREV.starts)?DZ_PREV.starts[o]:null;
  if(!s||!s.idx) return 'Commencer ▶<span class="as-cta-sub">'+meta.dur+' guidées · depuis le début</span>';
  return 'Commencer ici ▶<span class="as-cta-sub">à partir de « '+s.name+' » · '+fmtDur(s.left)+'</span>';
}
function dzUpdateCta(){ var b=$id('dzCta'); if(b) b.innerHTML=dzCtaHtml(); }
function dzLaunchFromOpen(){ var o=DZ_PREV.open, s=(o!=null&&DZ_PREV.starts)?DZ_PREV.starts[o]:null; dzLaunch(s?s.idx:0); }
// « Nous deux » (26/08) : un mot non lu d'Adrien s'ouvre en animation AVANT la routine
function dzLaunch(startIdx){
  mlAudio();
  if(typeof PV!=='undefined'&&PV.hasUnread()){ PV.showLove(function(){ dzLaunchReal(startIdx); }); return; }
  dzLaunchReal(startIdx);
}
function dzLaunchReal(startIdx){
  mlAudio(); // contexte audio créé sur le tap (règle iOS) → les sonneries pourront jouer
  if(!DZ_PREV) return;
  var id=DZ_PREV.id; DZ_PREV=null;
  var flat=[];
  DZ_RUNS[id].forEach(function(b){ b.items.forEach(function(it){ flat.push({bloc:b.b,n:it.n,d:it.d,k:it.k}); }); });
  // feels : ressenti par POSITION (clé k) — facile / ok / dur / trop (retour Adrien 26/08)
  DZ_RUN={id:id,items:flat,idx:Math.min(startIdx||0,flat.length-1),paused:false,end:0,left:0,step:'run',feels:{},startTs:Date.now(),fin:null};
  _dzDir='fwd';
  dzStepStart();
}
var MOBI_FEELS=[
  {v:'facile',ico:'😌',lbl:'Facile'},
  {v:'ok',ico:'👍',lbl:'Correct'},
  {v:'dur',ico:'🥵',lbl:'Dur'},
  {v:'trop',ico:'😵',lbl:'Trop difficile'}
];
var MOBI_FEEL_LBL={facile:'Facile',ok:'Correct',dur:'Dur',trop:'Trop difficile'};
function mobiCleanName(n){ return n.replace(/ — (droite|gauche)$/,'').replace(/^Cycle \d · .*$/,'PNF contracté-relâché'); }
// ── Écran « c'était comment ? » entre deux positions ──
function dzRenderRate(){
  var meta=DZ_NAMES[DZ_RUN.id];
  var cur=DZ_RUN.feels[DZ_RUN.rateK]||null;
  var nx=DZ_RUN.items[DZ_RUN.idx+1];
  var h=dzHeader('Mobilité 🧘‍♀️',meta.name+' · '+(DZ_RUN.idx+1)+'/'+DZ_RUN.items.length,{back:'dzPrev()',right:mlSndBtn()});
  h+='<div class="as-scroll as-center"><div class="dz-rate">';
  h+='<div class="as-exo-kicker">Position terminée ✓</div>';
  h+='<div class="as-exo-name lg">'+DZ_RUN.rateN+'</div>';
  h+='<div style="font-size:.8rem;color:var(--mut);font-weight:600;margin:.2rem 0 .6rem;">C\'était comment pour toi ?</div>';
  h+='<div class="as-feel-row">';
  MOBI_FEELS.forEach(function(f){ h+='<button class="as-feel'+(cur===f.v?' on':'')+'" onclick="dzRate(\''+f.v+'\')"><span>'+f.ico+'</span>'+f.lbl+'</button>'; });
  h+='</div>';
  h+='<div style="font-size:.66rem;color:var(--mut);line-height:1.5;max-width:360px;margin-top:.4rem;">« Trop difficile » = la position est à adapter la prochaine fois (moins loin, un coussin, moins longtemps). Aucune mauvaise réponse 🌷</div>';
  h+='</div></div>';
  h+='<div class="as-foot"><button class="as-ghost-btn" onclick="dzRate(null)">Passer<span style="display:block;font-size:.6rem;opacity:.7;">'+(nx?'→ '+mobiCleanName(nx.n):'→ terminer')+'</span></button></div>';
  return h;
}
function dzRate(v){
  if(!DZ_RUN||DZ_RUN.step!=='rate') return;
  if(v) DZ_RUN.feels[DZ_RUN.rateK]=v;
  mlAudio();
  dzAdvance();
}
function dzAdvance(){
  DZ_RUN.step='run';
  DZ_RUN.idx++;
  if(DZ_RUN.idx>=DZ_RUN.items.length){ dzFinish(); return; }
  _dzDir='fwd';
  dzStepStart();
}
// ── Écran de fin : « tu as bien ressenti ? » + « tu as eu mal ? » puis enregistrement ──
function dzRenderEnd(){
  var meta=DZ_NAMES[DZ_RUN.id];
  var e=DZ_RUN.fin||{};
  var min=Math.max(1,Math.round((Date.now()-DZ_RUN.startTs)/60000));
  var h=dzHeader('Routine terminée 🌸',meta.ico+' '+meta.name+' · '+min+' min');
  h+='<div class="as-scroll">';
  h+='<div class="as-lbl">🌷 Tu as bien ressenti la séance ?</div>'
    +'<div class="as-scale-hint"><span>Pas vraiment</span><span>À fond</span></div><div class="as-scale">';
  for(var i=1;i<=5;i++) h+='<button class="as-scale-btn'+(e.feel===i?' on':'')+'" onclick="dzEndSet(\'feel\','+i+')">'+i+'</button>';
  h+='</div>';
  h+='<div class="as-lbl" style="margin-top:1.1rem;">🩹 Tu as eu mal quelque part ?</div>';
  h+='<div class="dz-pain-row">'
    +'<button class="dz-pain-btn'+(e.pain==='non'?' on':'')+'" onclick="dzEndSet(\'pain\',\'non\')">🙂 Non</button>'
    +'<button class="dz-pain-btn'+(e.pain==='peu'?' on':'')+'" onclick="dzEndSet(\'pain\',\'peu\')">😬 Un peu</button>'
    +'<button class="dz-pain-btn'+(e.pain==='oui'?' on':'')+'" onclick="dzEndSet(\'pain\',\'oui\')">😣 Oui</button></div>';
  if(e.pain&&e.pain!=='non') h+='<input class="as-note" id="dzPw" type="text" maxlength="80" placeholder="Où ? (ex. genou droit, bas du dos…)" value="'+(e.pw||'').replace(/"/g,'&quot;')+'" oninput="DZ_RUN.fin.pw=this.value" style="margin-top:.5rem;width:100%;">'
    +'<div style="font-size:.64rem;color:var(--mut);line-height:1.5;margin-top:.4rem;">Une douleur (pas une tension qui tire) = on adapte la position la prochaine fois. Si ça revient 2 fois au même endroit, on en parle.</div>';
  // Récap des ressentis par position
  var seen={}, rows='';
  DZ_RUN.items.forEach(function(it){ if(seen[it.k]) return; seen[it.k]=true; var f=DZ_RUN.feels[it.k]; rows+='<div class="dld-row"><span class="dld-name">'+mobiCleanName(it.n)+'</span>'+(f?'<span class="mf mf-'+f+'">'+MOBI_FEEL_LBL[f]+'</span>':'<span style="font-size:.6rem;color:var(--mut);">—</span>')+'</div>'; });
  h+='<div class="as-lbl" style="margin-top:1.1rem;">📋 Position par position</div><div>'+rows+'</div>';
  h+='</div>';
  var ok=e.feel&&e.pain;
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="dzSaveEnd(true)">Passer</button>'
    +'<button class="as-cta as-cta-go" '+(ok?'':'disabled')+' onclick="dzSaveEnd(false)">Terminer 🌷<span class="as-cta-sub">enregistrer la routine</span></button></div>';
  return h;
}
function dzEndSet(field,v){
  if(!DZ_RUN||DZ_RUN.step!=='end') return;
  if(!DZ_RUN.fin) DZ_RUN.fin={};
  var pw=$id('dzPw'); if(pw) DZ_RUN.fin.pw=pw.value;
  DZ_RUN.fin[field]=v; dzRender();
}
function dzSaveEnd(skip){
  if(!DZ_RUN) return;
  var meta=DZ_NAMES[DZ_RUN.id], t=todayStr(), e=DZ_RUN.fin||{};
  var pw=$id('dzPw'); if(pw) e.pw=pw.value;
  var seen={}, items=[];
  DZ_RUN.items.forEach(function(it){ if(seen[it.k]) return; seen[it.k]=true; items.push({k:it.k,n:mobiCleanName(it.n),f:DZ_RUN.feels[it.k]||null}); });
  var now=new Date();
  var entry={id:DZ_RUN.id,n:meta.name,ico:meta.ico,dur:meta.dur,min:Math.max(1,Math.round((now-DZ_RUN.startTs)/60000)),
    at:String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'),
    feel:skip?(e.feel||null):e.feel,pain:skip?(e.pain||null):e.pain,pw:(e.pw||'').trim(),items:items};
  if(!DB.mobiLog) DB.mobiLog={};
  (DB.mobiLog[t]=DB.mobiLog[t]||[]).push(entry);
  // Toute routine terminée (soir, longue ou après-salsa) valide la mobilité du jour
  var already=!!DB.mobiDays[t];
  DB.mobiDays[t]=true; saveDB();
  DZ_RUN=null; DZ_PREV=null; dzSyncWake();
  if(!already){ confetti(); showToast('🧘‍♀️ Mobilité du jour validée ! La chaîne ne casse jamais 💗'); }
  else showToast('🧘‍♀️ Terminé — bien joué !');
  var ov=$id('dzOverlay');
  if(ov&&ov.classList.contains('open')){ _dzDir='fwd'; dzRender(); }
  else { document.body.style.overflow=''; renderAll(); }
}
// Chrono basé timestamp (DZ_RUN.end) : pause = on fige `left`, reprise = on recalcule `end`.
// L'intervalle est coupé quand l'onglet est caché (batterie) et recalé au retour.
var _dzLastTick=null;
var DZ_PREP=8; // 04/09 (demande Adrien) : 8 s pour se mettre en place AVANT le vrai chrono de chaque position
function dzStepStart(){
  var it=DZ_RUN.items[DZ_RUN.idx];
  DZ_RUN.paused=false; DZ_RUN.expired=false; DZ_RUN.prep=true; DZ_RUN.left=DZ_PREP; DZ_RUN.end=Date.now()+DZ_PREP*1000;
  _dzLastTick=null;
  dzRender();
  dzTick();
}
// Fin des 8 s de mise en place → le vrai chrono de la position démarre
function dzPrepDone(){
  var it=DZ_RUN.items[DZ_RUN.idx];
  DZ_RUN.prep=false; DZ_RUN.left=it.d; DZ_RUN.end=Date.now()+it.d*1000;
  _dzLastTick=null;
  mlSound('go');
  try{ if(navigator.vibrate) navigator.vibrate(40); }catch(e){}
  var t=$id('dz-run-time'); if(t){ t.textContent=formatTime(it.d); t.classList.remove('dz-prep'); }
  var p=$id('dz-prep-lbl'); if(p) p.hidden=true;
  var bar=$id('dz-run-bar'); if(bar) bar.style.width='0%';
}
function dzTick(){
  dzStopTimer();
  var it=DZ_RUN.items[DZ_RUN.idx];
  _dzTimer=setInterval(function(){
    if(!DZ_RUN||DZ_RUN.paused){ dzStopTimer(); return; }
    var left=Math.max(0,Math.ceil((DZ_RUN.end-Date.now())/1000));
    DZ_RUN.left=left;
    if(DZ_RUN.prep){ // mise en place : le temps affiché décompte 8 → 1, la barre ne bouge pas
      var tp=$id('dz-run-time'); if(tp) tp.textContent=String(left);
      if(left>0&&left<=3&&_dzLastTick!==left){ _dzLastTick=left; mlSound('tick'); }
      if(left<=0) dzPrepDone();
      return;
    }
    var t=$id('dz-run-time'); if(t) t.textContent=formatTime(left);
    var bar=$id('dz-run-bar'); if(bar) bar.style.width=(100*(1-left/it.d)).toFixed(1)+'%';
    if(left>0&&left<=3&&_dzLastTick!==left){ _dzLastTick=left; mlSound('tick'); }
    if(left<=0){ try{ if(navigator.vibrate) navigator.vibrate(80); }catch(e){} dzNext(true); }
  },300);
}
function dzStopTimer(){ if(_dzTimer){ clearInterval(_dzTimer); _dzTimer=null; } }
function dzPause(){
  if(!DZ_RUN) return;
  var body=$id('dzBody');
  if(DZ_RUN.paused){ DZ_RUN.paused=false; DZ_RUN.expired=false; DZ_RUN.end=Date.now()+DZ_RUN.left*1000; dzTick(); if(body) mobiVidStart(body); }
  else { DZ_RUN.paused=true; DZ_RUN.left=Math.max(0,Math.ceil((DZ_RUN.end-Date.now())/1000)); dzStopTimer(); if(body) mobiVidStop(body); }
  var b=$id('dzPauseBtn'); if(b){ b.textContent=DZ_RUN.paused?'▶ Reprendre':'⏸ Pause'; b.classList.toggle('on',DZ_RUN.paused); }
  var t=$id('dz-run-time'); if(t) t.classList.toggle('dz-paused',DZ_RUN.paused);
}
// Retour arrière (retour Melati 26/08) : position précédente, ou la présentation depuis la 1re
function dzPrev(){
  if(!DZ_RUN) return;
  dzStopTimer(); _dzDir='back';
  if(DZ_RUN.step==='rate'){ DZ_RUN.step='run'; dzStepStart(); return; } // depuis « c'était comment ? » → on rejoue la position
  if(DZ_RUN.idx===0){ var id=DZ_RUN.id; DZ_RUN=null; DZ_PREV={id:id,open:null}; dzRender(); return; }
  DZ_RUN.idx--; dzStepStart();
}
document.addEventListener('visibilitychange',function(){
  if(!DZ_RUN||DZ_RUN.paused||DZ_RUN.step!=='run') return;
  if(document.hidden){ dzStopTimer(); return; }
  if(DZ_RUN.prep){ if(DZ_RUN.end-Date.now()<=0) dzPrepDone(); dzTick(); return; } // mise en place expirée pendant l'absence → chrono repart de zéro
  // 28/09 : l'iPhone se verrouille seul pendant une position de 45-120 s → au retour, on ne saute
  // PLUS en silence au côté suivant (Melati se retrouvait « côté gauche » sans avoir vu le droit) :
  // la position s'arrête à 0 et attend son « Suivant ».
  if(DZ_RUN.end-Date.now()<=0){ DZ_RUN.paused=true; DZ_RUN.left=0; DZ_RUN.expired=true; dzRender(); }
  else dzTick();
});
// Écran maintenu allumé pendant une routine guidée (Wake Lock, iOS 16.4+) — c'est la mise en veille
// automatique qui coupait le chrono et les sonneries. Relâché dès que la routine s'arrête.
var _dzWake=null;
function dzSyncWake(){
  var want=!!(DZ_RUN&&DZ_RUN.step!=='end'&&!document.hidden);
  try{
    if(want&&!_dzWake&&navigator.wakeLock&&navigator.wakeLock.request){
      _dzWake='pending';
      navigator.wakeLock.request('screen').then(function(l){
        if(!(DZ_RUN&&DZ_RUN.step!=='end')){ l.release().catch(function(){}); _dzWake=null; return; }
        _dzWake=l; l.addEventListener('release',function(){ if(_dzWake===l) _dzWake=null; });
      }).catch(function(){ _dzWake=null; });
    } else if(!want&&_dzWake&&_dzWake!=='pending'){ var w=_dzWake; _dzWake=null; w.release().catch(function(){}); }
  }catch(e){ _dzWake=null; }
}
document.addEventListener('visibilitychange',function(){ if(!document.hidden) dzSyncWake(); });
function dzRenderRun(){
  var it=DZ_RUN.items[DZ_RUN.idx];
  var nx=DZ_RUN.items[DZ_RUN.idx+1];
  var db=MOBI_DB[it.k]||{};
  var side=/ — droite$/.test(it.n)?'droit':(/ — gauche$/.test(it.n)?'gauche':null);
  var nom=it.n.replace(/ — (droite|gauche)$/,'');
  var h=dzHeader('Mobilité 🧘‍♀️',it.bloc+' · '+(DZ_RUN.idx+1)+'/'+DZ_RUN.items.length,{back:'dzPrev()',right:mlSndBtn()});
  h+='<div class="as-scroll">';
  var media=mobiMedia(db,nom,true);
  if(media) h+='<div class="as-demo" style="margin:.3rem 0 .6rem;max-height:none;display:block;">'+media+'</div>';
  h+='<div class="as-exo-name '+(media?'lg':'xl')+'" style="text-align:center;">'+nom+'</div>';
  if(side){
    var sc=MOBI_SIDE[it.k]&&MOBI_SIDE[it.k][side];
    h+='<div class="dz-side"><span class="dz-side-pill">👉 Côté '+side.toUpperCase()+'</span>'
      +(sc?'<div class="dz-side-cue">'+sc+'</div>':'')
      +(db.vid?'<div class="dz-side-vid">La vidéo montre un seul côté — fais celui écrit ici.</div>':'')+'</div>';
  }
  if(DZ_RUN.expired) h+='<div class="dz-expired">⏱ Le temps s\'est écoulé pendant que ton écran était en veille. Appuie sur <strong>Suivant</strong> quand tu as fini'+(side?' ce côté':'')+'.</div>';
  var tShow=DZ_RUN.prep?DZ_RUN.left:(DZ_RUN.paused?formatTime(DZ_RUN.left):formatTime(it.d));
  h+='<div style="text-align:center;margin:.4rem 0 .2rem;"><span style="font-family:\'Saira\',system-ui,sans-serif;font-style:italic;font-weight:900;font-size:2.6rem;color:var(--acc);font-variant-numeric:tabular-nums;" id="dz-run-time" class="'+(DZ_RUN.prep?'dz-prep':'')+(DZ_RUN.paused?' dz-paused':'')+'">'+tShow+'</span></div>';
  h+='<div id="dz-prep-lbl" style="text-align:center;font-size:.72rem;font-weight:700;color:var(--yellow);margin:-.1rem 0 .3rem;" '+(DZ_RUN.prep?'':'hidden')+'>🧘‍♀️ Installe-toi… le chrono démarre après</div>';
  h+='<div style="height:5px;border-radius:100px;background:rgba(255,255,255,.08);overflow:hidden;max-width:280px;margin:0 auto .7rem;"><div id="dz-run-bar" style="height:100%;width:0%;background:var(--x-grad-2);border-radius:100px;"></div></div>';
  h+='<div style="max-width:420px;margin:0 auto;text-align:left;">'+mobiSteps(db)+'</div>';
  if(db.feel) h+='<div style="font-size:.74rem;color:var(--acc);text-align:center;line-height:1.5;margin:.55rem auto;max-width:400px;font-weight:600;">💗 '+db.feel+'</div>';
  h+='<div class="as-next-exo dim" style="text-align:center;">'+(nx?'Ensuite : '+nx.n:'Dernière position 🌸')+'</div>';
  h+='</div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="dzPrev()" title="Position précédente">‹</button>'
    +'<button class="as-ghost-btn dz-pause'+(DZ_RUN.paused?' on':'')+'" id="dzPauseBtn" onclick="dzPause()">'+(DZ_RUN.paused?'▶ Reprendre':'⏸ Pause')+'</button>'
    +'<button class="as-cta" onclick="dzNext()">Suivant ›<span class="as-cta-sub">'+(nx?nx.n:'terminer')+'</span></button></div>';
  h+='<button class="as-carte-link" style="margin:.4rem auto 0;padding:.3rem;border:none;font-size:.66rem;color:var(--mut);" onclick="dzQuit()">Arrêter la routine</button>';
  return h;
}
function dzNext(auto){
  if(!DZ_RUN||DZ_RUN.step!=='run') return;
  dzStopTimer(); mlAudio();
  var cur=DZ_RUN.items[DZ_RUN.idx], nx=DZ_RUN.items[DZ_RUN.idx+1];
  if(auto) mlSound('done'); // sonnerie de fin d'exercice (retour Melati 26/08)
  // Ressenti par POSITION (retour Adrien 26/08) : demandé quand la position change — pas entre
  // droite et gauche, ni entre deux cycles PNF du même exercice
  if(cur&&!(nx&&nx.k===cur.k)){
    DZ_RUN.step='rate'; DZ_RUN.rateK=cur.k; DZ_RUN.rateN=mobiCleanName(cur.n);
    _dzDir='fwd'; dzRender(); return;
  }
  dzAdvance();
}
function dzQuit(){ dzStopTimer(); _dzDir='back'; DZ_RUN=null; dzRender(); }
function dzFinish(){
  // Fin de routine → questions (ressenti global + douleur), l'enregistrement se fait dans dzSaveEnd
  mlSound('finish');
  DZ_RUN.step='end'; DZ_RUN.fin={feel:null,pain:null,pw:''};
  try{ if(navigator.vibrate) navigator.vibrate([60,40,60]); }catch(e){}
  _dzDir='fwd'; dzRender();
}

// ══════════════════════ SAUVEGARDE / RESTAURATION (filet local — pas de compte pour l'instant) ══════════════════════
function exportBackup(){
  try{
    var payload={app:'melati',v:DB.v,exported:todayStr(),db:DB};
    var blob=new Blob([JSON.stringify(payload,null,1)],{type:'application/json'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='melati-backup-'+todayStr()+'.json';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },800);
    showToast('📦 Sauvegarde prête — garde le fichier précieusement');
  }catch(e){ showToast('⚠ Export impossible : '+e.message); }
}
function importBackup(input){
  var f=input.files&&input.files[0];
  input.value='';
  if(!f) return;
  var r=new FileReader();
  r.onload=function(){
    try{
      var p=JSON.parse(r.result);
      var db=p&&p.app==='melati'&&p.db?p.db:p; // accepte le fichier complet ou le DB brut
      if(!db||!Array.isArray(db.pesees)||!Array.isArray(db.logs)) throw new Error('format inconnu');
      var cur=DB.logs.length+DB.pesees.length;
      var inc=db.logs.length+db.pesees.length;
      if(!confirm('Restaurer cette sauvegarde ?\n\nElle contient '+db.logs.length+' séance(s) et '+db.pesees.length+' pesée(s).\nElle REMPLACERA les données actuelles ('+DB.logs.length+' séance(s), '+DB.pesees.length+' pesée(s)).')) return;
      if(inc<cur&&!confirm('⚠️ La sauvegarde contient MOINS de données que l\'app actuelle. Vraiment remplacer ?')) return;
      DB=db; dbNormalize(); saveDB();
      buildSeances(); renderAll();
      confetti(); showToast('✅ Sauvegarde restaurée !');
    }catch(e){ showToast('⚠ Fichier invalide : '+e.message); }
  };
  r.readAsText(f);
}

// ══════════════════════ SYNCHRO CLOUD (même Supabase que l'app d'Adrien, compte séparé) ══════════════════════
// Snapshot complet de melati_db dans la table user_state (RLS par utilisateur — zéro SQL à ajouter).
// Gardes héritées de l'incident du 11/08 côté Adrien :
//   · on ne POUSSE jamais avant un pull cloud réussi (_mlPullOk)
//   · adoption du cloud seulement si local vierge ou rev cloud > rev local
//   · garde-fou anti-croisement : une ligne user_state sans marqueur app='melati'
//     (= le compte d'Adrien) n'est JAMAIS adoptée NI écrasée.
var ML_SB_URL='https://xtcmvbzjcpewivhnvvwz.supabase.co';
var ML_SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';
var mlSb=null,_mlAppShown=false,_mlPullOk=false,_mlPushTimer=null,_mlForeign=false;
function mlBadge(state){
  var el=$id('mlSync'); if(!el) return;
  if(state==='ok') el.textContent='☁️ ✓';
  else if(state==='pending') el.textContent='☁️ …';
  else if(state==='foreign') el.textContent='⚠️';
  else el.textContent='📴';
}
function mlShowApp(){
  _mlAppShown=true;
  var l=$id('login-screen'); if(l) l.style.display='none';
  var a=$id('main-app'); if(a) a.style.display='';
  var n=$id('main-nav'); if(n) n.style.display='';
  mlRenderPushSettings();
}
function mlShowLogin(){
  var l=$id('login-screen'); if(l) l.style.display='';
  var a=$id('main-app'); if(a) a.style.display='none';
  var n=$id('main-nav'); if(n) n.style.display='none';
}
function mlInit(){
  if(!window.supabase){ mlShowApp(); mlBadge('off'); return; } // CDN inaccessible → mode local
  mlSb=window.supabase.createClient(ML_SB_URL,ML_SB_KEY,{auth:{storageKey:'melati-auth'}});
  mlSb.auth.onAuthStateChange(function(ev,session){ if(ev==='SIGNED_IN'&&session&&!_mlAppShown) mlStart(); });
  mlSb.auth.getSession().then(function(res){
    if(res.data&&res.data.session) mlStart();
    else setTimeout(function(){ if(!_mlAppShown) mlShowLogin(); },800);
  });
  window.addEventListener('online',function(){ if(_mlAppShown&&!_mlPullOk) mlPull(); });
}
// (27/08) Relecture cloud au retour au premier plan : Safari et l'app épinglée ont chacun leur
// stockage ; mlPull() n'adopte le cloud que s'il est strictement plus récent (rev). Jamais pendant
// une séance LiveUp / une routine mobilité, ni avec un push en attente.
var _mlHiddenAt=0;
document.addEventListener('visibilitychange',function(){
  if(document.hidden){ _mlHiddenAt=Date.now(); return; }
  if(!_mlHiddenAt||Date.now()-_mlHiddenAt<15000) return;
  _mlHiddenAt=0;
  if(!mlSb||!_mlAppShown||!_mlPullOk||_mlForeign||navigator.onLine===false||_mlPushTimer) return;
  if(typeof AS!=='undefined'&&AS) return;
  if(typeof DZ_RUN!=='undefined'&&DZ_RUN) return;
  mlPull();
});
function mlStart(){
  if(_mlAppShown) return;
  mlShowApp(); mlBadge('pending');
  mlPull();
}
function mlErr(msg){ var e=$id('login-err'); if(e){ e.textContent=msg; e.style.display=''; } var o=$id('login-ok'); if(o) o.style.display='none'; }
function mlOk(msg){ var o=$id('login-ok'); if(o){ o.textContent=msg; o.style.display=''; } var e=$id('login-err'); if(e) e.style.display='none'; }
function mlSignIn(){
  var email=($id('login-email').value||'').trim(), pw=$id('login-password').value;
  if(!email){ $id('login-email').focus(); return; }
  if(!pw){ $id('login-password').focus(); return; }
  var btn=$id('login-btn'); btn.textContent='Connexion...'; btn.disabled=true;
  mlSb.auth.signInWithPassword({email:email,password:pw}).then(function(res){
    if(res.error){
      btn.textContent='Se connecter →'; btn.disabled=false;
      mlErr('Email ou mot de passe incorrect.');
    }
    // succès : onAuthStateChange → mlStart()
  });
}
function mlSignUp(){
  var email=($id('login-email').value||'').trim(), pw=$id('login-password').value;
  if(!email){ mlErr('Entre ton mail d\'abord.'); return; }
  if(!pw||pw.length<6){ mlErr('Choisis un mot de passe (6 caractères minimum).'); return; }
  mlSb.auth.signUp({email:email,password:pw,options:{emailRedirectTo:'https://massup-five.vercel.app/melati.html'}}).then(function(res){
    if(res.error){ mlErr(res.error.message.indexOf('already')>=0?'Ce mail a déjà un compte — connecte-toi.':'Erreur : '+res.error.message); return; }
    if(res.data&&res.data.session){ /* confirmation désactivée → connectée direct */ }
    else mlOk('Compte créé ! 📬 Ouvre le mail de confirmation, puis reviens te connecter.');
  });
}
function mlSignOut(){
  if(!mlSb){ return; }
  if(!confirm('Te déconnecter ? Tes données restent sur ce téléphone et dans le cloud.')) return;
  mlSb.auth.signOut().then(function(){ location.reload(); });
}
// Local considéré « vierge » : rien d'elle dedans (les seeds ne comptent pas)
function mlLocalVirgin(){
  return !DB.logs.length&&!DB.tests.length
    &&!Object.keys(DB.salsa).length&&!Object.keys(DB.eau).length
    &&!Object.keys(DB.crea).length&&!Object.keys(DB.mobiDays).length
    &&DB.pesees.length<=4;
}
function mlPull(){
  if(!mlSb) return;
  mlSb.auth.getUser().then(function(res){
    var uid=res.data&&res.data.user&&res.data.user.id;
    if(!uid){ mlBadge('off'); return; }
    mlSb.from('user_state').select('data,updated_at').eq('user_id',uid).maybeSingle().then(function(r){
      if(r.error){ mlBadge('off'); return; }
      var row=r.data;
      if(row&&row.data){
        if(row.data.app!=='melati'){
          // Ligne d'un AUTRE usage (ex. compte d'Adrien) : on ne touche à RIEN dans les deux sens
          _mlForeign=true; _mlPullOk=false; mlBadge('foreign');
          showToast('⚠️ Ce compte est déjà utilisé par une autre app MASSUP — la synchro est coupée pour protéger ses données.');
          return;
        }
        var cloudRev=row.data.rev||0, localRev=DB.rev||0;
        if(mlLocalVirgin()||cloudRev>localRev){
          DB=row.data; dbNormalize();
          try{ localStorage.setItem(DBK,JSON.stringify(DB)); }catch(e){}
          buildSeances(); renderAll(); // restauration silencieuse (demande Adrien 24/08)
          mlRenderPushSettings();
        }
      }
      _mlPullOk=true;
      mlBadge('ok');
      mlQueuePush(); // pousse l'état courant (crée la ligne au premier login)
      mlUpdateBackupInfo();
      try{ if(typeof PV!=='undefined') PV.pull(true); }catch(e){} // « Nous deux » : la semaine d'Adrien
    });
  });
}
function mlQueuePush(){
  if(!mlSb||!_mlPullOk||_mlForeign) return;
  mlBadge('pending');
  clearTimeout(_mlPushTimer);
  _mlPushTimer=setTimeout(function(){ _mlPushTimer=null; mlPushNow(); },1500); // (07/10) remis à null : sinon le pull au retour au premier plan était bloqué
}
function mlPushNow(){
  if(!mlSb||!_mlPullOk||_mlForeign) return;
  mlSb.auth.getUser().then(function(res){
    var uid=res.data&&res.data.user&&res.data.user.id;
    if(!uid){ mlBadge('off'); return; }
    mlSb.from('user_state')
      .upsert({user_id:uid,data:DB,updated_at:new Date().toISOString()},{onConflict:'user_id'})
      .then(function(r){ mlBadge(r.error?'off':'ok'); });
    // « Nous deux » (26/08) : MA ligne partner_state = résumé lecture seule pour Adrien (dérivé de DB)
    try{ if(typeof PV!=='undefined') PV.push(); }catch(e){}
  });
}

// ══════════════════════ NOUS DEUX 💞 (26/08) — adaptateur MELATI pour partner.js ══════════════════════
// Mode observation strict : je pousse un RÉSUMÉ lecture seule de mes jours (séances, salsa/eau/
// créatine, mobilité avec ressentis, pesées) dans MA ligne partner_state ; je LIS celui d'Adrien.
var PV_FEEL_ICO={facile:'😌',ok:'👍',dur:'🥵',echec:'💥'};
var PV_CTX_LBL={temps:'⏰ manque de temps',blessure:'🩹 blessure / douleur',energie:'😴 énergie / sommeil',malade:'🤒 malade'};
function pvNoteColor(n){ return n>=18?'var(--yellow)':n>=14?'var(--pull)':n>=11?'var(--acc)':n>=8?'var(--push)':'var(--red)'; }
function pvSnapshot(){
  var t=todayStr(), from=addDays(t,-63), days={};
  function D(d){ return days[d]||(days[d]={}); }
  DB.logs.forEach(function(l){
    if(!l.date||l.date<from||l.date>t) return;
    var s=seanceOf(l.sid);
    var ent={n:s?s.name:l.sid,ico:s?s.icon:'🏋️',t:s?s.t:'others',dur:l.dur||null,feel:l.feeling||null,en:l.energy||null,note:l.note||'',recs:(l.recs||[]).slice(),
      ex:(l.exos||[]).map(function(x){ var e=EXOS[x.k]||{}; return {n:e.name||x.k,w:(e.time||e.circuit)?null:(e.band?wTxt(e,x.w,true).replace(' · ',' ').replace(' kg',''):(e.dumb?'2×':'')+x.w),u:e.circuit?'tours':e.time?(e.mins?'min':'s'):'reps',bonus:!!x.bonus,sets:(x.sets||[]).slice(),feels:(x.feels||[]).slice()}; })};
    (D(l.date).s=D(l.date).s||[]).push(ent);
  });
  ['salsa','crea'].forEach(function(k){ Object.keys(DB[k]||{}).forEach(function(d){ if(d>=from&&d<=t&&DB[k][d]) D(d)[k]=1; }); }); // (eau non partagée — demande Adrien 26/08)
  Object.keys(DB.mobiDays||{}).forEach(function(d){
    if(d<from||d>t||!DB.mobiDays[d]) return;
    var L=(DB.mobiLog&&DB.mobiLog[d])||[];
    D(d).mobi=L.length?L.map(function(m){ return {n:m.n,ico:m.ico,dur:(m.min?m.min+' min':m.dur||''),feel:m.feel||null,pain:m.pain||null,pw:m.pw||'',items:(m.items||[]).map(function(it){return {n:it.n,f:it.f||null};})}; })
      :[{n:'Mobilité',ico:'🧘‍♀️',dur:''}];
  });
  DB.pesees.forEach(function(p){ if(p.date>=from&&p.date<=t) D(p.date).kg=p.kg; });
  return {app:'melati',name:'Melati',ico:'🌸',goal:WEEK_GOAL,days:days,msg:(DB.pv&&DB.pv.msg)||null,seen:(DB.pv&&DB.pv.seen)||null};
}
// Ce que je VOIS d'Adrien (forme produite par app.js → pvSnapshot côté Adrien) :
//   day = {s:[{n,t,note,dur,time,ctx,rep,ex:[{n,w,u,pain,side,sets:[{r,f,w}]}]}], st, pdj, crea, cardio, gel}
if(typeof PV!=='undefined') PV.init({
  me:'melati',other:'adrien',meName:'Melati',otherName:'Adrien',meIco:'🌸',otherIco:'🏋️',
  client:function(){ return mlSb||null; },
  canPush:function(){ return _mlPullOk&&!_mlForeign; },
  snapshot:pvSnapshot,
  toast:showToast,
  placeholder:'Un petit mot pour Adrien avant sa séance…',
  loveCta:'C\'est parti 💗',
  loveEmojis:['💙','💪','🔥','✨','💗'],
  getMsg:function(){ return DB.pv&&DB.pv.msg||null; },
  setMsg:function(m){ if(!DB.pv) DB.pv={}; DB.pv.msg=m; saveDB(); },
  getSeen:function(){ return DB.pv&&DB.pv.seen||null; },
  setSeen:function(id){ if(!DB.pv) DB.pv={}; DB.pv.seen=id; saveDB(); },
  hasContent:function(day){ return !!(day&&((day.s&&day.s.length)||day.st||day.pdj||day.crea||day.gel)); },
  // Case : colorée = sport · contour = étirements · les deux = les deux (pas d'emoji — demande Adrien 26/08)
  daySport:function(day){ return (day.s&&day.s.length)?(day.s[0].t||'maison'):null; },
  dayMobi:function(day){ return !!day.st; },
  tiles:function(days,dates,P){
    var c={s:0,pdj:0,crea:0,st:0};
    days.forEach(function(d){ if(!d) return; if(d.s) c.s+=d.s.length; if(d.pdj) c.pdj++; if(d.crea) c.crea++; if(d.st) c.st++; });
    var g=(P&&P.goal)||4;
    function tile(i,v,o,l){ return '<div class="pv-tile'+(v>=o?' full':'')+'"><span class="pv-tile-i">'+i+'</span><span class="pv-tile-v">'+v+'<small>/'+o+'</small></span><span class="pv-tile-l">'+l+'</span></div>'; }
    return tile('🏋️',c.s,g,'séances')+tile('🍳',c.pdj,5,'petits-déj')+tile('🧪',c.crea,5,'créatine')+tile('🧘',c.st,4,'étirements'); // (cardio non affiché — demande Adrien)
  },
  dayHtml:function(date,day){
    var E=PV.esc, h='';
    (day.s||[]).forEach(function(s){
      h+='<div class="pd-card t-'+(s.t||'maison')+'"><div class="pd-head"><span class="pd-name">'+E(s.n)+'</span>'
        +(s.note!=null?'<span class="pd-note" style="color:'+pvNoteColor(s.note)+'">'+s.note+'<small> /20</small></span>':'<span class="pd-meta">séance manuelle</span>')+'</div>'
        +'<div class="pd-meta" style="margin:.2rem 0 .35rem;">'+(s.time?'🕑 '+E(s.time):'')+(s.dur?' · ⏱ '+s.dur+' min':'')+(s.ctx&&PV_CTX_LBL[s.ctx]?' · '+PV_CTX_LBL[s.ctx]:'')+(s.rep?' · ❄ reprise':'')+'</div>';
      // Compact (retour Adrien 26/08) : une ligne par exo — nom · poids (→ si changé en cours d'exo) · reps
      (s.ex||[]).forEach(function(x){
        var ws=[]; (x.sets||[]).forEach(function(st){ var w=(st.w!=null?st.w:x.w); if(w!=null&&ws.indexOf(w)<0) ws.push(w); });
        var wTxt=ws.length?ws.join('→')+' '+E(x.u||'kg'):'';
        var reps=(x.sets||[]).map(function(st){ return st.r; }).join('·');
        h+='<div class="pd-row"><span class="n">'+(x.side?'⭐ ':'')+E(x.n)+(x.pain?' 🩹':'')+'</span><span class="v">'+wTxt+(wTxt&&reps?' · ':'')+reps+'</span></div>';
      });
      h+='</div>';
    });
    var marks=[];
    if(day.gel) marks.push('❄ jour gelé ('+(day.gel==='blessure'?'🩹 blessure':'🏖 vacances')+')');
    if(day.st) marks.push('🧘 étirements faits'); if(day.pdj) marks.push('🍳 petit-déj'); if(day.crea) marks.push('🧪 créatine');
    if(marks.length) h+='<div class="pd-marks">'+marks.join(' · ')+'</div>';
    return h;
  }
});
// Affiche le mail connecté + déconnexion dans la section Sauvegarde
function mlUpdateBackupInfo(){
  var el=$id('mlAccountInfo'); if(!el||!mlSb) return;
  mlSb.auth.getUser().then(function(res){
    var email=res.data&&res.data.user&&res.data.user.email;
    if(email) el.innerHTML='☁️ Sauvegarde cloud active — compte <strong style="color:var(--acc)">'+email+'</strong> · <button onclick="mlSignOut()" style="background:none;border:none;color:var(--mut);text-decoration:underline;cursor:pointer;font-size:.66rem;">se déconnecter</button>';
  });
}
function mlPushPublicBytes(value){
  var raw=window.atob(value.replace(/-/g,'+').replace(/_/g,'/'));
  var bytes=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  return bytes;
}
function mlTimeField(value,onChange){
  var parts=/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value||'')?value.split(':'):['08','00'];
  var html='<select aria-label="Heure" onchange="'+onChange+'"><option value="" disabled>hh</option>';
  for(var hour=0;hour<24;hour++){
    var hh=String(hour).padStart(2,'0');
    html+='<option value="'+hh+'"'+(hh===parts[0]?' selected':'')+'>'+hh+'</option>';
  }
  html+='</select><span aria-hidden="true">:</span><select aria-label="Minutes" onchange="'+onChange+'"><option value="" disabled>mm</option>';
  for(var minute=0;minute<60;minute++){
    var mm=String(minute).padStart(2,'0');
    html+='<option value="'+mm+'"'+(mm===parts[1]?' selected':'')+'>'+mm+'</option>';
  }
  html+='</select>';
  return html;
}
function mlTimeValue(id){
  var field=$id(id); if(!field) return null;
  var selects=field.querySelectorAll('select');
  if(selects.length!==2||!selects[0].value||!selects[1].value) return null;
  return selects[0].value+':'+selects[1].value;
}
function mlRenderPushSettings(){
  var options=$id('mlPushOptions'); if(!options) return;
  var r=DB.reminders;
  var enabled=!!r.enabled;
  var water=$id('mlWaterEnabled'), workout=$id('mlWorkoutEnabled');
  if(water) water.checked=!!r.hydrationEnabled;
  if(workout) workout.checked=!!r.workoutEnabled;
  var noon=$id('mlWorkoutNoon'), evening=$id('mlWorkoutEvening');
  if(noon) noon.innerHTML=mlTimeField(r.workoutNoonTime||'12:00','mlSaveWorkoutTime("workoutNoonTime")');
  if(evening) evening.innerHTML=mlTimeField(r.workoutEveningTime||'18:00','mlSaveWorkoutTime("workoutEveningTime")');
  var times=$id('mlWaterTimes');
  if(times) times.innerHTML=(r.hydrationTimes||[]).map(function(time,index){
    return '<label>Eau '+(index+1)+' <span class="ml-time-field" id="mlWaterTime'+index+'">'+mlTimeField(time,'mlSaveWaterTime('+index+')')+'</span></label>';
  }).join('');
  var button=$id('mlPushToggle');
  if(button) button.textContent=enabled?'Suspendre':'Activer';
  var status=$id('mlPushStatus');
  if(status) status.textContent=enabled?'Actif sur cet appareil · notifications à la fin des repos inclus':'Eau, séances et chrono de repos';
}
function mlSaveReminderOption(key,value){
  DB.reminders[key]=value;
  saveDB();
  mlRenderPushSettings();
  if(key==='workoutEnabled'&&!value) updateMelatiWorkoutTimer(null);
}
function mlSaveWaterTime(index,value){
  if(!Number.isInteger(index)||index<0||index>=3) return;
  value=mlTimeValue('mlWaterTime'+index);
  if(!value) return;
  DB.reminders.hydrationTimes[index]=value;
  saveDB();
}
function mlSaveWorkoutTime(key){
  if(key!=='workoutNoonTime'&&key!=='workoutEveningTime') return;
  var value=mlTimeValue(key==='workoutNoonTime'?'mlWorkoutNoon':'mlWorkoutEvening');
  if(!value) return;
  DB.reminders[key]=value;
  saveDB();
}
async function mlTogglePushNotifications(){
  if(DB.reminders.enabled){
    DB.reminders.enabled=false;
    saveDB();
    updateMelatiWorkoutTimer(null);
    mlRenderPushSettings();
    showToast('Notifications Melati suspendues');
    return;
  }
  try{
    if(!('Notification' in window)||!navigator.serviceWorker||!window.isSecureContext)
      throw new Error('Notifications push indisponibles dans ce navigateur');
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)
      &&!(navigator.standalone===true||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)))
      throw new Error('Sur iPhone, ouvre Melati depuis son icône sur l’écran d’accueil');
    if(!_mlPullOk||_mlForeign||!mlSb) throw new Error('Connecte-toi au compte Melati avant d’activer les notifications');
    var permission=Notification.permission;
    if(permission==='default') permission=await Notification.requestPermission();
    if(permission!=='granted') throw new Error('Autorisation de notification refusée');
    var configResponse=await fetch('/api/push-config',{cache:'no-store'});
    var config=await configResponse.json();
    if(!configResponse.ok||!config.enabled||!config.publicKey) throw new Error('Web Push non configuré côté serveur');
    var registration=await navigator.serviceWorker.ready;
    if(!registration.pushManager) throw new Error('Push API indisponible dans cette installation');
    var subscription=await registration.pushManager.getSubscription();
    var created=false;
    if(!subscription){
      subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:mlPushPublicBytes(config.publicKey)});
      created=true;
    }
    var userResult=await mlSb.auth.getUser();
    var user=userResult.data&&userResult.data.user;
    if(userResult.error||!user) throw new Error('Reconnecte-toi au compte Melati');
    var json=subscription.toJSON();
    var saved=await mlSb.from('push_subscriptions').upsert({
      endpoint:json.endpoint,user_id:user.id,p256dh:json.keys&&json.keys.p256dh,auth:json.keys&&json.keys.auth,
      time_zone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',updated_at:new Date().toISOString()
    },{onConflict:'endpoint'});
    if(saved.error){
      if(created) await subscription.unsubscribe();
      throw new Error('Enregistrement de l’abonnement impossible : '+saved.error.message);
    }
    DB.reminders.enabled=true;
    saveDB();
    mlRenderPushSettings();
    showToast('Notifications Melati activées sur cet appareil');
  }catch(error){
    console.warn('[MELATI] Web Push subscription:',error.message);
    showToast('Activation impossible : '+error.message);
  }
}
// Chrono de repos → push programmé côté serveur (module commun push_timer.js, 07/10/2026)
var _mlWorkoutPush=(typeof PushTimer!=='undefined')?PushTimer.create({
  url:ML_SB_URL,key:ML_SB_KEY,tag:'[MELATI]',
  client:function(){ return (mlSb&&_mlPullOk&&!_mlForeign)?mlSb:null; },
  enabled:function(){ var r=DB.reminders||{}; return !!r.enabled&&r.workoutEnabled!==false; },
  onError:function(){ showToast('Chrono lancé, mais rappel hors application indisponible'); }
}):null;
function updateMelatiWorkoutTimer(dueAt,title,body){
  if(!_mlWorkoutPush) return Promise.resolve();
  return _mlWorkoutPush.update(dueAt,title,body);
}

// ══════════════════════ BOOT ══════════════════════
// Verrouillage du zoom iOS : pinch bloqué (Safari ignore user-scalable=no) + garde
// anti double-tap sur les zones NON interactives uniquement (jamais sur les boutons/
// steppers/inputs — un preventDefault là-dessus casserait les taps rapides)
document.addEventListener('gesturestart',function(e){ e.preventDefault(); },{passive:false});
document.addEventListener('gesturechange',function(e){ e.preventDefault(); },{passive:false});
(function(){
  var lastT=0;
  var INTERACTIVE='button,input,select,textarea,a,label,[onclick],.cal-day,.sc,.sbbl';
  document.addEventListener('touchend',function(e){
    var now=Date.now();
    if(now-lastT<300&&e.target&&!(e.target.closest&&e.target.closest(INTERACTIVE))) e.preventDefault();
    lastT=now;
  },{passive:false});
})();
buildSeances();
renderAll();
asLoad();
if(AS&&!AS.startTs&&AS.step==='setup') AS=null;
asRenderBubble();
if(AS&&AS.restEnd) asEnsureTick();
mlInit(); // connexion + synchro cloud (affiche l'app ou l'écran de login)
