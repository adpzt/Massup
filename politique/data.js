// ============================================================
// QUIZ POLITIQUE 2027 — 100 questions + 13 candidats
// Module POLITIQUE — totalement isolé du module muscu.
// Plain browser JS (pas de build) — tout est exposé sous window.POL.*
// Score : 0 = droite radicale · 10 = gauche radicale
// ============================================================
(function () {
  'use strict';

  // ── 100 questions ──
  // { id, theme, question, explanation (HTML <strong> autorisé), options:[{text,score}] }
  var QUESTIONS = [
    {
      "id": 1,
      "theme": "eco",
      "question": "Impôts : en France, on paye trop ou pas assez ?",
      "explanation": "Les <strong>impôts</strong> sont les sommes que les citoyens et les entreprises versent à l'État pour financer les services publics (écoles, hôpitaux, routes, police). En France, l'ensemble des prélèvements représente environ <strong>43 à 45% de la richesse produite chaque année</strong> (le PIB), l'un des taux les plus élevés au monde. Pour la <strong>droite et les libéraux</strong>, ce niveau est trop lourd : il découragerait le travail et l'investissement, et il faudrait baisser les impôts quitte à réduire certaines dépenses. Pour la <strong>gauche</strong>, ces impôts financent un modèle social protecteur (santé, retraites, éducation quasi gratuites) et permettent de réduire les inégalités ; baisser l'impôt profiterait surtout aux plus aisés. Le débat oppose donc liberté économique et solidarité collective.",
      "options": [
        {
          "text": "Beaucoup trop. Baisse massive pour libérer l'économie.",
          "score": 0
        },
        {
          "text": "Trop. Une baisse ciblée et progressive serait bienvenue.",
          "score": 2.5
        },
        {
          "text": "À peu près correct, avec quelques ajustements.",
          "score": 5
        },
        {
          "text": "Bien calibré. Nos impôts financent des services essentiels.",
          "score": 7.5
        },
        {
          "text": "Pas assez pour les plus riches et les grandes entreprises.",
          "score": 10
        }
      ]
    },
    {
      "id": 2,
      "theme": "eco",
      "question": "Retraites : à quel âge doit-on pouvoir partir ?",
      "explanation": "L'<strong>âge de la retraite</strong> est l'âge auquel on peut cesser de travailler tout en touchant une pension. La réforme de 2023 a repoussé l'âge légal de 62 à <strong>64 ans</strong>, provoquant de fortes manifestations. Rebondissement : le budget de la Sécu 2026 a <strong>suspendu</strong> cette hausse jusqu'à janvier 2028 (l'âge est gelé autour de 62 ans et 9 mois pour les générations concernées) — c'est le prochain président qui tranchera. Le système fonctionne par <strong>répartition</strong> : les cotisations des actifs paient les pensions actuelles. Ceux qui défendent un âge plus élevé (souvent à <strong>droite</strong> : 64 ans confirmés, voire 65) invoquent l'allongement de la vie et le déficit du régime ; d'autres (au centre) préfèrent raisonner en <strong>durée de cotisation</strong> ou ajouter une part de capitalisation ; ceux qui veulent revenir à 62 ou 60 ans (souvent à <strong>gauche</strong> et au RN) y voient une question de justice pour les métiers pénibles.",
      "options": [
        {
          "text": "Repousser encore à 65 ou 67 ans, comme nos voisins.",
          "score": 0
        },
        {
          "text": "64 ans c'est raisonnable : rétablir la réforme de 2023 après la suspension.",
          "score": 3
        },
        {
          "text": "Revenir à 62 ans, avec un financement à trouver.",
          "score": 7
        },
        {
          "text": "Revenir à 60 ans. Travailler toute sa vie est une injustice.",
          "score": 10
        },
        {
          "text": "Un âge autour de 63 ans, mais surtout tenir compte de la pénibilité et des carrières longues.",
          "score": 5
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 3,
      "theme": "eco",
      "question": "SMIC : faut-il l'augmenter fortement ?",
      "explanation": "Le <strong>SMIC</strong> est le salaire minimum légal : aucun employeur n'a le droit de payer moins. En 2026, il s'élève à environ <strong>1 430 euros net par mois</strong> pour un temps plein, et concerne près de 3 millions de salariés. La question est de savoir s'il faut l'augmenter fortement, par exemple le porter vers 1 600 euros net. Les partisans (souvent à <strong>gauche</strong>) y voient un moyen direct d'améliorer le <strong>pouvoir d'achat</strong> des plus modestes et de rendre le travail plus attractif. Les opposants (souvent à <strong>droite</strong> et chez les économistes libéraux) craignent qu'un SMIC trop élevé n'augmente le <strong>coût du travail</strong>, poussant les entreprises à moins embaucher ou à délocaliser, ce qui pénaliserait justement les moins qualifiés.",
      "options": [
        {
          "text": "Le laisser suivre l'inflation automatiquement, sans hausse politique.",
          "score": 1
        },
        {
          "text": "Légère revalorisation progressive, sans brusquer les petites entreprises.",
          "score": 3.5
        },
        {
          "text": "Hausse significative à 1 600€ net — les entreprises s'adapteront.",
          "score": 7
        },
        {
          "text": "Hausse immédiate et forte. Les travailleurs pauvres n'attendent plus.",
          "score": 10
        },
        {
          "text": "Revalorisation régulière un peu au-dessus de l'inflation, négociée avec les branches.",
          "score": 5
        }
      ]
    },
    {
      "id": 4,
      "theme": "eco",
      "question": "Privatisations : l'État doit-il céder ses entreprises publiques ?",
      "explanation": "Une <strong>entreprise publique</strong> appartient en tout ou partie à l'État (par exemple EDF dans l'énergie, la SNCF dans le train). Une <strong>privatisation</strong>, c'est quand l'État vend ces entreprises à des investisseurs privés. La France en a beaucoup privatisé depuis les années 1980 (banques, autoroutes, France Télécom). Les défenseurs de la privatisation (souvent à <strong>droite</strong>) estiment que le privé gère mieux, plus efficacement, et que la vente rapporte de l'argent pour réduire la dette. Les opposants (souvent à <strong>gauche</strong>) répondent que ces entreprises assurent des <strong>services essentiels</strong> et que l'État perd le contrôle de secteurs stratégiques ; l'exemple des autoroutes, vendues puis très rentables pour le privé, est souvent cité comme une mauvaise affaire pour l'État.",
      "options": [
        {
          "text": "Privatiser davantage. Le marché est plus efficace que l'État.",
          "score": 0
        },
        {
          "text": "Quelques privatisations ciblées là où le privé fait mieux.",
          "score": 3
        },
        {
          "text": "Statu quo. Ni plus de privatisations, ni de nationalisations.",
          "score": 5
        },
        {
          "text": "Renforcer les services publics, stopper toute nouvelle privatisation.",
          "score": 7
        },
        {
          "text": "Renationaliser les grandes entreprises privatisées ces 30 dernières années.",
          "score": 10
        }
      ]
    },
    {
      "id": 5,
      "theme": "eco",
      "question": "Dette publique (~119 % du PIB) : urgence ou pas ?",
      "explanation": "La <strong>dette publique</strong>, c'est l'argent que l'État a emprunté au fil des ans et qu'il doit rembourser. Elle atteint désormais environ <strong>119 % du PIB</strong> (Insee, fin juin 2026), soit près de <strong>3 600 milliards d'euros</strong> : la France doit nettement plus que tout ce qu'elle produit en une année. Le déficit reste l'un des plus élevés de la zone euro (5,4 % en 2025, objectif 5 % pour 2026 dans un budget adopté au forceps par 49.3 en février 2026), et la charge des <strong>intérêts</strong> dépasse 60 milliards par an — plus que le budget de la Défense. Pour certains (souvent à <strong>droite</strong> et au centre), c'est une urgence : réduire les dépenses pour ne pas laisser un fardeau aux générations futures et rester crédible face aux marchés. Pour d'autres (souvent à <strong>gauche</strong>), tant que les taux restent soutenables, mieux vaut investir (santé, écologie) et faire contribuer les plus riches ; l'austérité casserait la croissance.",
      "options": [
        {
          "text": "Urgence absolue. Coupes budgétaires immédiates et sévères.",
          "score": 0
        },
        {
          "text": "Plan de réduction progressif sur 10 ans, sans casser les services.",
          "score": 3
        },
        {
          "text": "Maintenir les services publics, réduire très lentement.",
          "score": 6
        },
        {
          "text": "La dette n'est pas urgente. Investir d'abord dans l'avenir.",
          "score": 9
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 6,
      "theme": "eco",
      "question": "Protectionnisme : faut-il protéger notre économie de la concurrence étrangère ?",
      "explanation": "Le <strong>protectionnisme</strong> consiste à protéger les entreprises nationales de la concurrence étrangère, par exemple avec des <strong>droits de douane</strong> (taxes sur les produits importés) ou des normes. À l'inverse, le <strong>libre-échange</strong> laisse les marchandises circuler librement entre pays. Les partisans du protectionnisme (que l'on trouve à l'<strong>extrême droite</strong> comme à la <strong>gauche radicale</strong>) veulent défendre l'emploi et l'industrie françaises, éviter les délocalisations et ne plus dépendre de l'étranger. Les partisans du libre-échange (au <strong>centre</strong> et à droite libérale) répondent que les taxes renchérissent les produits pour les consommateurs, provoquent des représailles des autres pays et nuisent aux exportations françaises. C'est un débat entre protection des producteurs et pouvoir d'achat des consommateurs.",
      "options": [
        {
          "text": "Libre-échange total. La concurrence mondiale est bonne pour tout le monde.",
          "score": 0
        },
        {
          "text": "Libre-échange avec protections ciblées sur les secteurs stratégiques.",
          "score": 3
        },
        {
          "text": "Protectionnisme modéré, surtout contre les dumpings sociaux et écologiques.",
          "score": 6
        },
        {
          "text": "Fort protectionnisme. Acheter français, produire français.",
          "score": 10
        }
      ]
    },
    {
      "id": 7,
      "theme": "eco",
      "question": "Droit du travail : trop rigide ou pas assez protecteur ?",
      "explanation": "Le <strong>droit du travail</strong> regroupe toutes les règles qui encadrent la relation entre employeurs et salariés : contrats, licenciements, temps de travail, salaires. En France, il est réputé <strong>protecteur</strong> mais aussi complexe (le Code du travail fait des milliers de pages). Pour les libéraux et la <strong>droite</strong>, il est trop rigide : licencier coûte cher et fait peur, ce qui freinerait les embauches ; assouplir les règles créerait plus d'emplois. Pour la <strong>gauche</strong> et les syndicats, ces protections évitent que les salariés soient à la merci des employeurs ; les affaiblir précariserait les travailleurs sans garantie de créer des emplois de qualité. Le débat oppose <strong>flexibilité</strong> pour les entreprises et <strong>sécurité</strong> pour les salariés.",
      "options": [
        {
          "text": "Beaucoup trop rigide. Licencier doit être plus simple pour encourager l'embauche.",
          "score": 0
        },
        {
          "text": "Un peu trop rigide. Quelques assouplissements ciblés seraient utiles.",
          "score": 3
        },
        {
          "text": "Bien équilibré. Ne pas toucher aux acquis sociaux fondamentaux.",
          "score": 6
        },
        {
          "text": "Pas assez protecteur. Il faut renforcer les droits des salariés.",
          "score": 10
        }
      ]
    },
    {
      "id": 8,
      "theme": "eco",
      "question": "Énergie : nucléaire ou renouvelables ?",
      "explanation": "Pour produire de l'électricité sans trop de CO2, la France dispose de deux grandes options. Le <strong>nucléaire</strong> fournit déjà environ <strong>65% de son électricité</strong> grâce à ses centrales : peu d'émissions de CO2 et une production stable. Les <strong>renouvelables</strong> (éolien, solaire, hydraulique) utilisent des sources naturelles inépuisables. Les partisans du nucléaire soulignent sa fiabilité, son indépendance énergétique et son faible coût sur la durée, malgré la question des déchets radioactifs. Les partisans des renouvelables (souvent chez les <strong>écologistes</strong> et à gauche) mettent en avant l'absence de déchets dangereux, la rapidité d'installation et la baisse des coûts, tout en reconnaissant leur <strong>intermittence</strong> (pas d'électricité sans vent ni soleil). Beaucoup plaident aujourd'hui pour un mélange des deux.",
      "options": [
        {
          "text": "Relancer massivement le nucléaire, stopper les subventions aux renouvelables.",
          "score": 0
        },
        {
          "text": "Nouveau nucléaire + renouvelables en complément équilibré.",
          "score": 3
        },
        {
          "text": "Mix : renouvelables en priorité + maintenir le nucléaire existant.",
          "score": 6
        },
        {
          "text": "Sortir du nucléaire progressivement, tout miser sur les renouvelables.",
          "score": 10
        }
      ]
    },
    {
      "id": 9,
      "theme": "eco",
      "question": "Pouvoir d'achat : par où commencer ?",
      "explanation": "Le <strong>pouvoir d'achat</strong> désigne ce que l'on peut réellement s'offrir avec son revenu, une fois pris en compte la hausse des prix (l'<strong>inflation</strong>). Après la forte inflation de 2022-2023, il reste au cœur des préoccupations des Français, notamment pour l'alimentation, l'énergie et le logement. Les approches diffèrent : la <strong>gauche</strong> privilégie souvent la hausse des salaires et du SMIC, ou le blocage de certains prix. La <strong>droite</strong> et le centre misent plutôt sur la baisse des impôts et des charges, pour laisser davantage de revenu net. D'autres proposent d'agir sur les grosses dépenses contraintes (loyer, énergie, transports). Le débat porte donc sur le levier le plus efficace : <strong>augmenter les revenus</strong> ou <strong>réduire les dépenses et les taxes</strong>.",
      "options": [
        {
          "text": "Baisser les impôts pour que chacun garde plus de son salaire.",
          "score": 1
        },
        {
          "text": "Réduire les charges des entreprises pour qu'elles puissent augmenter les salaires.",
          "score": 3
        },
        {
          "text": "Bloquer les prix et taxer les marges abusives des grandes entreprises.",
          "score": 7
        },
        {
          "text": "Augmenter directement les salaires et les minima sociaux.",
          "score": 9
        },
        {
          "text": "Renforcer les services publics gratuits (transport, cantine, santé...).",
          "score": 10
        },
        {
          "text": "Un mix : baisse ciblée des cotisations salariales et revalorisation des minima, sans blocage des prix.",
          "score": 5
        }
      ]
    },
    {
      "id": 10,
      "theme": "eco",
      "question": "Héritage : faut-il taxer les grandes fortunes transmises ?",
      "explanation": "L'<strong>héritage</strong>, c'est le patrimoine (argent, maison, entreprise) transmis à ses proches au moment du décès. L'État prélève des <strong>droits de succession</strong> sur les grosses transmissions, mais de nombreux abattements existent : par exemple, on peut transmettre environ <strong>100 000 euros par enfant</strong> sans impôt. Les partisans d'une taxation plus forte des grandes fortunes (souvent à <strong>gauche</strong>) y voient un outil contre les inégalités : hériter d'une fortune sans effort perpétuerait les privilèges. Les opposants (souvent à <strong>droite</strong>) estiment qu'il est injuste de taxer un patrimoine déjà bâti avec des revenus imposés, et que cela pénalise la transmission des entreprises familiales et des maisons. Le débat oppose <strong>égalité des chances</strong> et <strong>liberté de transmettre à ses enfants</strong>.",
      "options": [
        {
          "text": "Non. Les gens ont le droit de transmettre ce qu'ils ont construit.",
          "score": 0
        },
        {
          "text": "L'impôt sur l'héritage actuel est suffisant.",
          "score": 3
        },
        {
          "text": "Légère hausse pour les très grandes fortunes (au-delà de 2M€).",
          "score": 6
        },
        {
          "text": "Taxation forte des grandes successions.",
          "score": 9
        },
        {
          "text": "Limiter drastiquement l'héritage. Chacun doit partir avec les mêmes chances.",
          "score": 10
        }
      ]
    },
    {
      "id": 11,
      "theme": "eco",
      "question": "Aides au chômage : trop généreuses ou trop strictes ?",
      "explanation": "Les <strong>aides au chômage</strong> (l'assurance chômage) versent un revenu de remplacement aux personnes qui perdent leur emploi, financé par les cotisations. En France, on peut être indemnisé jusqu'à environ <strong>18 mois</strong> (moins pour les jeunes, plus pour les seniors), selon des règles régulièrement durcies. Ceux qui les jugent trop généreuses (souvent à <strong>droite</strong>) pensent que des allocations élevées ou longues peuvent décourager la reprise d'un emploi ; les réduire inciterait à retravailler plus vite. Ceux qui les défendent (souvent à <strong>gauche</strong> et chez les syndicats) rappellent qu'elles protègent les gens dans une épreuve difficile et que le vrai problème est souvent le <strong>manque d'emplois disponibles</strong>, pas le manque de volonté des chômeurs.",
      "options": [
        {
          "text": "Trop généreuses. Les conditionner strictement et les réduire.",
          "score": 0
        },
        {
          "text": "Légère réduction pour inciter plus vite à reprendre un emploi.",
          "score": 3
        },
        {
          "text": "Le niveau actuel est bien. Ne pas y toucher.",
          "score": 5
        },
        {
          "text": "Les chômeurs ont droit à une aide digne, sans stigmatisation.",
          "score": 8
        },
        {
          "text": "Revenu universel pour tout le monde, travailleur ou pas.",
          "score": 10
        }
      ]
    },
    {
      "id": 12,
      "theme": "eco",
      "question": "Agriculture : comment soutenir les agriculteurs ?",
      "explanation": "L'<strong>agriculture</strong> française nourrit le pays et pèse lourd dans les exportations, mais beaucoup d'agriculteurs peinent à vivre de leur travail : revenus faibles, dettes, concurrence internationale et normes environnementales contraignantes. Les colères agricoles de 2024 ont marqué les esprits. Plusieurs pistes s'opposent ou se complètent : certains (souvent à <strong>droite</strong> et au centre) veulent alléger les normes et les taxes, et garantir des prix qui couvrent les coûts de production. D'autres (à <strong>gauche</strong> et chez les écologistes) veulent orienter les aides vers une agriculture plus <strong>durable</strong> et les petites exploitations, plutôt que les grandes. La plupart s'accordent sur la nécessité de mieux <strong>rémunérer</strong> les agriculteurs et de les protéger d'une concurrence étrangère jugée déloyale.",
      "options": [
        {
          "text": "Moins de normes et de réglementations. C'est ça le vrai problème.",
          "score": 1
        },
        {
          "text": "Aide ciblée + protections douanières contre la concurrence déloyale.",
          "score": 4
        },
        {
          "text": "Revenu garanti pour les agriculteurs + accompagnement vers le durable.",
          "score": 7
        },
        {
          "text": "Soutien fort à l'agroécologie et aux circuits courts.",
          "score": 10
        }
      ]
    },
    {
      "id": 13,
      "theme": "eco",
      "question": "Industrie : faut-il faire revenir les usines en France ?",
      "explanation": "La <strong>réindustrialisation</strong> désigne le fait de faire revenir des usines et des productions en France. Depuis des décennies, beaucoup d'usines ont fermé ou été <strong>délocalisées</strong> vers des pays où la main-d'œuvre coûte moins cher ; l'industrie ne représente plus qu'environ <strong>10% de l'économie</strong>, contre le double autrefois. Presque tous les camps veulent la relancer, mais avec des méthodes différentes. Certains (à <strong>droite</strong> et au centre) misent sur la baisse des impôts de production et des aides aux entreprises pour les rendre compétitives. D'autres (à <strong>gauche</strong>) veulent que l'État investisse et impose des contreparties (emplois, écologie) en échange des aides. Le débat porte aussi sur l'intérêt de retrouver une <strong>souveraineté</strong> (médicaments, puces électroniques) après les pénuries récentes.",
      "options": [
        {
          "text": "Réindustrialiser massivement avec aides d'État et protectionnisme.",
          "score": 7
        },
        {
          "text": "Réindustrialiser, mais uniquement les industries de pointe et vertes.",
          "score": 6
        },
        {
          "text": "Garder seulement les secteurs vraiment stratégiques.",
          "score": 4
        },
        {
          "text": "L'industrie du futur est numérique. Accepter la tertiarisation.",
          "score": 1
        }
      ]
    },
    {
      "id": 14,
      "theme": "eco",
      "question": "Planification : l'État doit-il piloter l'économie à long terme ?",
      "explanation": "La <strong>planification</strong>, c'est l'idée que l'État fixe des objectifs de long terme et oriente l'économie pour les atteindre, au lieu de tout laisser au marché. La France a connu un Commissariat au Plan après-guerre, aujourd'hui remplacé par un secrétariat dédié, notamment pour la <strong>transition écologique</strong>. Les partisans (souvent à <strong>gauche</strong> et chez les écologistes) estiment que face au défi climatique et aux grands investissements (énergie, transports), seul l'État peut coordonner et donner une direction sur 20 ou 30 ans. Les opposants (libéraux, <strong>droite</strong>) préfèrent laisser jouer le marché et l'initiative privée, jugés plus efficaces et innovants, et craignent qu'un État planificateur ne se trompe de choix ou n'alourdisse la bureaucratie. Le débat oppose <strong>État stratège</strong> et <strong>liberté du marché</strong>.",
      "options": [
        {
          "text": "Non. Le marché s'auto-régule mieux que n'importe quel État.",
          "score": 0
        },
        {
          "text": "L'État fixe de grandes orientations, les entreprises exécutent.",
          "score": 4
        },
        {
          "text": "Planification indicative forte avec investissements publics massifs.",
          "score": 7
        },
        {
          "text": "Planification écologique et sociale contraignante pour les entreprises.",
          "score": 10
        }
      ]
    },
    {
      "id": 15,
      "theme": "eco",
      "question": "Startups et innovation : l'État doit-il beaucoup aider ?",
      "explanation": "Les <strong>startups</strong> sont de jeunes entreprises innovantes, souvent dans la technologie, qui cherchent à grandir vite. L'<strong>innovation</strong> désigne la création de nouveaux produits, services ou technologies. Depuis dix ans, la France les soutient activement (label « French Tech », crédit d'impôt recherche, financements publics via la banque publique Bpifrance). Les partisans de ce soutien estiment que l'État doit prendre des risques pour faire émerger les futurs champions, créer des emplois et rester dans la course face aux États-Unis et à la Chine. Les plus <strong>réservés</strong> jugent que l'argent public profite parfois à des entreprises qui auraient réussi seules, ou qui échouent quand même, et qu'il vaudrait mieux financer directement la recherche ou d'autres priorités. Le débat porte sur le bon usage de l'<strong>argent public</strong>.",
      "options": [
        {
          "text": "L'État doit se retirer. Moins de réglementations, plus de liberté.",
          "score": 0
        },
        {
          "text": "Aides ciblées sur les secteurs stratégiques, pas d'arrosage général.",
          "score": 3
        },
        {
          "text": "Accompagnement fort avec financement public et formation.",
          "score": 6
        },
        {
          "text": "Priorité aux coopératives et à l'économie sociale plutôt qu'aux startups.",
          "score": 10
        }
      ]
    },
    {
      "id": 101,
      "theme": "eco",
      "w": 3,
      "question": "Taxe Zucman : un impôt plancher de 2 % sur les patrimoines de plus de 100 millions d'euros ?",
      "explanation": "La <strong>taxe Zucman</strong>, du nom de l'économiste Gabriel Zucman, est un <strong>impôt plancher de 2 % par an</strong> sur les patrimoines supérieurs à <strong>100 millions d'euros</strong> (environ 1 800 foyers). Idée : les ultra-riches paient aujourd'hui proportionnellement moins d'impôts que les classes moyennes, car leur fortune est logée dans des holdings et non distribuée. Votée par l'Assemblée en 2025, retoquée par le Sénat, elle est devenue le <strong>symbole du débat fiscal</strong> de la campagne : la gauche (PS, LFI, écologistes) en fait un marqueur, le centre et la droite la refusent en évoquant l'exil des capitaux et la taxation de l'outil professionnel (les fondateurs d'entreprises paieraient sur des actions qu'ils ne peuvent pas vendre). Des versions « aménagées » (seuil plus haut, exclusion des biens professionnels) sont discutées.",
      "options": [
        {
          "text": "Non. Ça ferait fuir les capitaux et les entrepreneurs, sans rapporter grand-chose.",
          "score": 0
        },
        {
          "text": "Non à cette taxe, mais lutter contre l'optimisation via les holdings.",
          "score": 3
        },
        {
          "text": "Oui, dans une version aménagée (seuil plus haut, outil professionnel exclu).",
          "score": 6
        },
        {
          "text": "Oui, telle quelle : 2 % dès 100 millions d'euros.",
          "score": 8.5
        },
        {
          "text": "Oui, et aller plus loin : rétablir l'ISF avec des taux plus élevés.",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 102,
      "theme": "eco",
      "w": 3,
      "question": "Retraites : introduire une part de capitalisation à côté de la répartition ?",
      "explanation": "Aujourd'hui la retraite française repose quasi entièrement sur la <strong>répartition</strong> : les cotisations des actifs paient les pensions des retraités. La <strong>capitalisation</strong> consiste à placer une partie des cotisations sur les marchés financiers pour financer sa propre pension future. Édouard Philippe en a fait la « pierre angulaire » de son programme (une dose collective d'environ <strong>15 %</strong>, inspirée du régime des cadres Agirc-Arrco), une partie de la droite et du centre y est favorable, et le sujet a été au cœur du « conclave » retraites de 2025. Les partisans y voient le seul moyen de garantir les pensions face au vieillissement et de faire profiter tous les salariés des rendements des marchés. Les opposants (gauche, syndicats, RN) y voient un cadeau à la finance, un système inégalitaire et risqué en cas de krach, qui affaiblirait la répartition en détournant des cotisations.",
      "options": [
        {
          "text": "Oui, basculer largement vers une capitalisation individuelle, comme ailleurs.",
          "score": 0
        },
        {
          "text": "Oui, une dose collective (~15 %) en complément de la répartition.",
          "score": 3
        },
        {
          "text": "Seulement un complément facultatif ; ne pas toucher à la répartition.",
          "score": 5.5
        },
        {
          "text": "Non : 100 % répartition, financée par les cotisations et le travail.",
          "score": 8
        },
        {
          "text": "Non, et faire cotiser dividendes et hauts revenus pour renforcer la répartition.",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 103,
      "theme": "eco",
      "w": 2,
      "question": "Fonction publique : faut-il supprimer des postes de fonctionnaires ?",
      "explanation": "La France compte environ <strong>5,7 millions d'agents publics</strong> (État, collectivités, hôpitaux). Réduire leur nombre est redevenu un thème central de la campagne : Gabriel Attal propose un plan de départs volontaires visant <strong>100 000 postes</strong> (7 milliards d'économies) en épargnant école, armées, justice et intérieur ; Bruno Retailleau vise <strong>250 000 à 300 000 postes</strong> grâce au numérique et à l'IA ; Édouard Philippe le non-remplacement d'une partie des départs et la fusion d'agences. À gauche, on répond que l'hôpital, l'école et la justice manquent déjà de bras, que l'essentiel des agents sont des enseignants, soignants et policiers, et que la qualité des services publics est le vrai enjeu. Le débat oppose <strong>maîtrise de la dépense</strong> et <strong>service rendu</strong>.",
      "options": [
        {
          "text": "Oui, massivement (250 000 à 300 000 postes) grâce au numérique et au non-remplacement.",
          "score": 0
        },
        {
          "text": "Oui, environ 100 000 postes, en préservant école, sécurité, justice et santé.",
          "score": 2.5
        },
        {
          "text": "Stabiliser les effectifs et réorganiser (moins d'agences, plus de terrain).",
          "score": 5
        },
        {
          "text": "Non : recruter là où ça manque (hôpital, école, justice).",
          "score": 7.5
        },
        {
          "text": "Non, embaucher massivement et titulariser les précaires du public.",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 16,
      "theme": "social",
      "question": "Hôpital public : est-il en train de s'effondrer ?",
      "explanation": "L'<strong>hôpital public</strong> soigne tout le monde, quels que soient ses revenus, et forme les médecins. Depuis plusieurs années, il traverse une crise : manque de personnel, lits fermés, <strong>urgences saturées</strong>, soignants épuisés qui démissionnent. On parle parfois d'effondrement, même si le système reste globalement de bonne qualité. Certains (souvent à <strong>gauche</strong>) réclament davantage de moyens : plus de budget, plus de personnel, de meilleurs salaires, et la fin d'une gestion trop comptable. D'autres (au <strong>centre</strong> et à droite) insistent sur les réformes d'organisation : mieux coordonner ville et hôpital, réduire la bureaucratie, revoir le financement à l'acte, sans forcément dépenser toujours plus. Presque tous reconnaissent la gravité de la situation ; le désaccord porte sur les <strong>solutions</strong>.",
      "options": [
        {
          "text": "Ouvrir plus au privé. La concurrence améliore la qualité.",
          "score": 0
        },
        {
          "text": "Réformer la gestion pour plus d'efficacité, sans forcément plus d'argent.",
          "score": 3
        },
        {
          "text": "Investissements importants + hausse des salaires des soignants.",
          "score": 7
        },
        {
          "text": "L'hôpital public doit être une priorité nationale absolue, peu importe le coût.",
          "score": 10
        },
        {
          "text": "Plus de moyens ciblés (urgences, personnel) ET une réorganisation profonde : les deux à la fois.",
          "score": 5
        }
      ]
    },
    {
      "id": 17,
      "theme": "social",
      "question": "Déserts médicaux : peut-on forcer les médecins à s'installer en zone rurale ?",
      "explanation": "Un <strong>désert médical</strong> est une zone (souvent rurale ou périphérique) où il y a trop peu de médecins : les habitants attendent des semaines pour un rendez-vous, voire n'ont pas de médecin traitant. Environ <strong>8 millions de Français</strong> n'ont pas de médecin traitant. La question est de savoir si l'on peut <strong>obliger</strong> les médecins à s'installer là où on manque de soignants. Les partisans de la contrainte estiment que la santé est un droit et que la liberté d'installation crée des inégalités inacceptables. Les opposants (dont beaucoup de médecins) répondent que forcer ne réglera rien : cela risquerait de décourager les vocations, et le vrai problème serait le <strong>nombre insuffisant de médecins</strong> formés pendant des décennies. Certains préfèrent des incitations (primes, aides à l'installation).",
      "options": [
        {
          "text": "Liberté totale d'installation. On ne peut pas forcer un professionnel libéral.",
          "score": 0
        },
        {
          "text": "Incitations financières très importantes (primes, logement, avantages fiscaux).",
          "score": 4
        },
        {
          "text": "Contrainte douce : ouvrir plus de médecins formés, développer le salariat.",
          "score": 6
        },
        {
          "text": "Obligation d'installation dans les déserts médicaux pour les nouveaux diplômés.",
          "score": 9
        }
      ]
    },
    {
      "id": 18,
      "theme": "social",
      "question": "Sécurité sociale : vers plus de privé ou rester 100% public ?",
      "explanation": "La <strong>Sécurité sociale</strong> est le système public qui rembourse les soins de tous les Français, financé par les cotisations sur les salaires. En pratique, une partie des remboursements est déjà complétée par les <strong>mutuelles</strong> privées (assurances santé). Le débat porte sur l'équilibre entre public et privé. Certains (souvent à <strong>gauche</strong>) veulent renforcer le public, par exemple avec une « Sécu à 100% » qui rembourserait tout et rendrait les mutuelles inutiles, au nom de l'égalité. D'autres (plutôt à <strong>droite</strong>) estiment qu'un recours accru au privé et aux assurances responsabiliserait les patients et allégerait les comptes publics. L'enjeu de fond : garantir un accès égal aux soins tout en maîtrisant des dépenses de santé qui augmentent avec le <strong>vieillissement</strong> de la population.",
      "options": [
        {
          "text": "Développer l'assurance privée, réduire la part de la Sécu.",
          "score": 0
        },
        {
          "text": "Maintenir la Sécu mais mieux contrôler les dépenses.",
          "score": 3
        },
        {
          "text": "Améliorer les remboursements, réduire les restes à charge des patients.",
          "score": 7
        },
        {
          "text": "Sécu à 100% : tout remboursé, zéro reste à charge.",
          "score": 10
        },
        {
          "text": "Garder l'équilibre actuel Sécu + complémentaires, en luttant surtout contre les dépassements d'honoraires.",
          "score": 5
        }
      ]
    },
    {
      "id": 19,
      "theme": "social",
      "question": "RSA : faut-il obliger les allocataires à travailler pour le percevoir ?",
      "explanation": "Le <strong>RSA</strong> (Revenu de Solidarité Active) est une aide versée aux personnes sans ressources ou presque : environ <strong>640 euros par mois</strong> pour une personne seule. Une réforme récente conditionne son versement à <strong>15 à 20 heures d'activité</strong> par semaine (formation, stage, recherche d'emploi accompagnée). Les partisans de cette obligation (souvent à <strong>droite</strong> et au centre) y voient un moyen de remettre les gens sur le chemin de l'emploi et d'éviter l'assistanat. Les opposants (souvent à <strong>gauche</strong>) craignent que l'on punisse des personnes déjà en difficulté, parfois malades ou isolées, et que sans emplois ni accompagnement réel, la mesure crée surtout des radiations. Le débat oppose <strong>devoir d'insertion</strong> et <strong>droit à un minimum vital inconditionnel</strong>.",
      "options": [
        {
          "text": "Oui, obligation d'activité. Suppression si non-respect.",
          "score": 0
        },
        {
          "text": "Oui, accompagnement obligatoire mais sans sanction immédiate.",
          "score": 3
        },
        {
          "text": "Non. Le conditionner est stigmatisant et peu efficace.",
          "score": 7
        },
        {
          "text": "Au contraire, l'augmenter et créer un revenu universel sans conditions.",
          "score": 10
        },
        {
          "text": "Un accompagnement renforcé (formation, insertion) avec des heures d'activité adaptées, sans suppression automatique.",
          "score": 5
        }
      ]
    },
    {
      "id": 20,
      "theme": "social",
      "question": "Dépendance des personnes âgées : qui doit financer ?",
      "explanation": "La <strong>dépendance</strong> désigne la perte d'autonomie des personnes âgées qui ne peuvent plus accomplir seules les gestes du quotidien et ont besoin d'aide à domicile ou en maison de retraite (EHPAD). Avec le <strong>vieillissement</strong> de la population, le nombre de personnes concernées va fortement augmenter, et le coût est élevé : une place en EHPAD dépasse souvent <strong>2 500 euros par mois</strong>, en grande partie à la charge des familles. La question est : qui doit payer ? Certains (souvent à <strong>gauche</strong>) veulent une prise en charge publique renforcée, financée par la solidarité nationale, pour que le grand âge ne ruine pas les familles. D'autres mettent en avant les assurances privées et la responsabilité individuelle, l'État ne pouvant pas tout financer. Le débat porte sur le partage entre <strong>solidarité collective</strong> et <strong>effort personnel</strong>.",
      "options": [
        {
          "text": "Les familles et le secteur privé d'abord, l'État aide les plus pauvres.",
          "score": 2
        },
        {
          "text": "Un mix public/privé avec une assurance dépendance obligatoire.",
          "score": 5
        },
        {
          "text": "Un grand service public de la dépendance financé par l'impôt.",
          "score": 8
        },
        {
          "text": "Priorité à l'aide à domicile, lutter contre les Ehpad privés lucratifs.",
          "score": 10
        }
      ]
    },
    {
      "id": 21,
      "theme": "social",
      "question": "Logement : comment résoudre la crise ?",
      "explanation": "La <strong>crise du logement</strong> désigne la difficulté croissante à se loger : prix d'achat très élevés dans les grandes villes, loyers en hausse, manque de logements sociaux (des centaines de milliers de demandes en attente) et de nombreux Français consacrant une part énorme de leur budget au logement. Les pistes divergent. La <strong>gauche</strong> privilégie souvent l'encadrement des loyers, la construction de logements sociaux et la lutte contre les logements vacants ou les locations touristiques type Airbnb. La <strong>droite</strong> et les libéraux misent plutôt sur la simplification des règles de construction et des incitations pour construire davantage, estimant que c'est le <strong>manque d'offre</strong> qui fait monter les prix. Le débat oppose <strong>réguler les prix</strong> et <strong>construire plus</strong>.",
      "options": [
        {
          "text": "Libérer le marché. Moins de réglementations = plus de construction.",
          "score": 1
        },
        {
          "text": "Incitations fiscales pour les propriétaires et constructeurs.",
          "score": 3
        },
        {
          "text": "Encadrement des loyers dans les zones tendues + plus de logements sociaux.",
          "score": 7
        },
        {
          "text": "Construire massivement du logement social + contrôle strict des loyers partout.",
          "score": 10
        },
        {
          "text": "Construire plus (simplification des normes) ET encadrer les loyers là où c'est vraiment tendu.",
          "score": 5
        }
      ]
    },
    {
      "id": 22,
      "theme": "social",
      "question": "Égalité femmes-hommes : faut-il des lois contraignantes ?",
      "explanation": "L'<strong>égalité femmes-hommes</strong> vise à garantir les mêmes droits et opportunités aux deux sexes. Malgré des progrès, des écarts persistent : les femmes gagnent en moyenne <strong>environ 15% de moins</strong> que les hommes à travail comparable, sont moins nombreuses aux postes de direction et assument davantage les tâches familiales. La question est de savoir s'il faut des <strong>lois contraignantes</strong> (quotas de femmes dirigeantes, sanctions financières contre les entreprises inégalitaires). Les partisans estiment que sans obligation, les changements sont trop lents et que les quotas ont déjà fait progresser la place des femmes. Les opposants préfèrent la sensibilisation et le mérite, craignant que les quotas ne soient perçus comme artificiels ou ne stigmatisent les femmes promues. Le débat oppose <strong>contrainte efficace</strong> et <strong>évolution des mentalités</strong>.",
      "options": [
        {
          "text": "L'égalité se fera naturellement. Trop de lois nuit aux entreprises.",
          "score": 0
        },
        {
          "text": "Renforcer la transparence salariale, mais pas de quotas imposés.",
          "score": 4
        },
        {
          "text": "Sanctions financières fortes pour les entreprises qui ne respectent pas l'égalité.",
          "score": 7
        },
        {
          "text": "Parité imposée dans tous les postes de direction + congé parental identique.",
          "score": 10
        }
      ]
    },
    {
      "id": 23,
      "theme": "social",
      "question": "Avortement : bien de l'avoir inscrit dans la Constitution ?",
      "explanation": "L'<strong>avortement</strong> (ou IVG, interruption volontaire de grossesse) est le droit pour une femme de mettre fin à une grossesse non désirée ; il est légal en France depuis la loi Veil de 1975. En <strong>2024</strong>, la France a inscrit la « liberté garantie » d'y recourir dans sa <strong>Constitution</strong>, une première mondiale, à la suite notamment du recul de ce droit aux États-Unis. Les partisans de cette inscription y voient une protection durable : un droit constitutionnel est bien plus difficile à remettre en cause qu'une simple loi. Les opposants (une minorité, plutôt à <strong>droite</strong> et dans les milieux conservateurs) estimaient que ce droit n'était pas menacé en France et que la Constitution n'avait pas vocation à y figurer. Le débat portait donc moins sur l'avortement lui-même que sur son <strong>niveau de protection juridique</strong>.",
      "options": [
        {
          "text": "C'était une erreur. L'avortement ne devrait pas être dans la Constitution.",
          "score": 0
        },
        {
          "text": "Le droit est bien, mais la constitutionnalisation était inutile.",
          "score": 3
        },
        {
          "text": "Bonne protection. Les droits peuvent toujours reculer.",
          "score": 8
        },
        {
          "text": "Excellente décision. Il faut renforcer encore l'accès à l'avortement.",
          "score": 10
        },
        {
          "text": "Le droit est acquis et protégé ; la constitutionnalisation était symbolique, ni bonne ni mauvaise.",
          "score": 5
        }
      ]
    },
    {
      "id": 24,
      "theme": "social",
      "question": "Fin de vie : la loi sur l'aide à mourir (adoptée en juillet 2026) — bonne chose ?",
      "explanation": "La <strong>fin de vie</strong> concerne l'accompagnement des personnes atteintes de maladies graves et incurables. Après deux ans de débats, le Parlement a <strong>définitivement adopté le 15 juillet 2026</strong> la loi créant un <strong>droit à l'aide à mourir</strong> (291 voix contre 241 à l'Assemblée, malgré trois rejets du Sénat) : elle est ouverte, sous cinq conditions cumulatives (majeur, affection grave et incurable en phase avancée, souffrances réfractaires, volonté libre et éclairée…), et le Conseil constitutionnel a été saisi. Les partisans (souvent à <strong>gauche</strong> et au centre, mais le sujet dépasse les clivages) invoquent la liberté de choisir une mort digne. Les opposants (milieux religieux, une partie des soignants, la <strong>droite</strong> et le RN) craignent des dérives, une pression sur les personnes vulnérables et rappellent le manque d'accès aux <strong>soins palliatifs</strong>. Plusieurs candidats promettent de revenir sur la loi, d'autres de l'élargir.",
      "options": [
        {
          "text": "Non. La vie est sacrée. Aucune exception.",
          "score": 0
        },
        {
          "text": "Seulement les soins palliatifs améliorés, pas l'euthanasie active.",
          "score": 3
        },
        {
          "text": "Aide à mourir encadrée et stricte pour les maladies incurables très douloureuses.",
          "score": 7
        },
        {
          "text": "Droit à mourir dans la dignité élargi. C'est un choix personnel.",
          "score": 10
        },
        {
          "text": "La loi est acceptable si les garde-fous sont stricts et les soins palliatifs vraiment financés partout.",
          "score": 5
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 25,
      "theme": "social",
      "question": "Cannabis : faut-il le légaliser ?",
      "explanation": "Le <strong>cannabis</strong> est une drogue aujourd'hui illégale en France, alors que sa consommation y est l'une des plus élevées d'Europe (des millions d'usagers). La <strong>légalisation</strong> consisterait à autoriser et encadrer sa vente, comme pour l'alcool ou le tabac. Ses partisans estiment que l'interdiction est un échec : elle n'empêche pas la consommation, alimente les <strong>trafics</strong> et la violence, et qu'un marché légal permettrait de contrôler la qualité, de protéger les mineurs et de rapporter des <strong>taxes</strong>. Ses opposants (souvent à <strong>droite</strong>) répondent que légaliser reviendrait à banaliser une drogue dangereuse pour la santé, surtout chez les jeunes, et enverrait un mauvais signal. Entre les deux, certains proposent la <strong>dépénalisation</strong> (ne plus punir l'usage sans pour autant autoriser la vente).",
      "options": [
        {
          "text": "Tolérance zéro. Réprimer encore plus fort.",
          "score": 0
        },
        {
          "text": "Maintenir l'interdiction mais dépénaliser la simple consommation.",
          "score": 3
        },
        {
          "text": "Légalisation encadrée par l'État (âge minimum, qualité contrôlée, taxation).",
          "score": 7
        },
        {
          "text": "Légalisation complète. L'État n'a pas à contrôler ce que les adultes consomment.",
          "score": 10
        },
        {
          "text": "Dépénaliser l'usage et expérimenter la légalisation dans quelques territoires avant de décider.",
          "score": 5
        }
      ]
    },
    {
      "id": 26,
      "theme": "social",
      "question": "Pauvreté : 9 millions de Français sous le seuil. Que faire ?",
      "explanation": "La <strong>pauvreté</strong> se mesure par un <strong>seuil</strong> : on considère comme pauvre une personne vivant avec moins de 60% du revenu médian, soit environ <strong>1 200 euros par mois</strong> pour une personne seule. En France, environ <strong>9 millions de personnes</strong> vivent sous ce seuil, dont de nombreux enfants et familles monoparentales. Les approches diffèrent. La <strong>gauche</strong> insiste sur des aides sociales plus élevées, des services publics gratuits et une revalorisation des bas salaires. La <strong>droite</strong> et le centre mettent l'accent sur le retour à l'emploi, la formation et l'incitation au travail, jugés plus efficaces qu'une hausse des aides. Beaucoup s'accordent sur l'importance de l'<strong>accès au logement, à la santé et à l'éducation</strong> pour sortir durablement de la pauvreté.",
      "options": [
        {
          "text": "Favoriser la croissance économique. Si l'économie va bien, la pauvreté recule.",
          "score": 1
        },
        {
          "text": "Mieux cibler les aides existantes pour éviter les abus et le gaspillage.",
          "score": 3
        },
        {
          "text": "Augmenter les minima sociaux et créer un bouclier contre la pauvreté.",
          "score": 7
        },
        {
          "text": "Redistribution massive : taxer fortement les riches pour donner aux pauvres.",
          "score": 10
        },
        {
          "text": "Mieux cibler les aides ET revaloriser les plus faibles : sortir de la pauvreté par le travail et l'accompagnement.",
          "score": 5
        }
      ]
    },
    {
      "id": 104,
      "theme": "social",
      "w": 2,
      "question": "« Année blanche » : geler les prestations sociales et les pensions pour réduire le déficit ?",
      "explanation": "Une <strong>« année blanche »</strong> consiste à ne pas revaloriser pendant un an les <strong>prestations sociales</strong> (allocations, RSA, APL…) et les <strong>pensions de retraite</strong>, alors qu'elles suivent normalement l'inflation. Proposée par François Bayrou pour le budget 2026, reprise sous une forme atténuée par le gouvernement Lecornu (sous-indexation) et défendue pour 2028 par Gabriel Attal, elle rapporte plusieurs milliards mais fait perdre du pouvoir d'achat à des millions de personnes. Ses défenseurs (centre, droite) y voient un effort partagé et indolore par rapport à des coupes ciblées ; ses opposants (gauche, RN, syndicats) dénoncent une baisse déguisée des retraites et des aides qui frappe d'abord les plus modestes, alors que d'autres recettes (hauts patrimoines, niches fiscales) sont possibles.",
      "options": [
        {
          "text": "Oui, geler plusieurs années : tout le monde doit participer à l'effort.",
          "score": 0
        },
        {
          "text": "Oui, une année blanche ponctuelle, le temps de redresser les comptes.",
          "score": 3
        },
        {
          "text": "Geler seulement les pensions et prestations les plus élevées.",
          "score": 6
        },
        {
          "text": "Non : indexer sur l'inflation, c'est un engagement envers les gens.",
          "score": 8
        },
        {
          "text": "Non, et revaloriser au-dessus de l'inflation les minima sociaux et petites retraites.",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 27,
      "theme": "immigration",
      "question": "Immigration légale (~380 000 titres/an) : trop ou pas assez ?",
      "explanation": "L'<strong>immigration légale</strong> désigne les personnes qui viennent vivre en France avec un titre de séjour en règle. En 2025, la France a délivré environ <strong>384 000 premiers titres de séjour</strong> (+11 % sur un an) : d'abord pour les <strong>études</strong> (31 %), puis pour des raisons familiales et humanitaires (24 % chacune), le travail restant minoritaire. Ceux qui trouvent ce chiffre <strong>trop élevé</strong> estiment que le pays a du mal à loger, former et intégrer autant de nouveaux arrivants, et veulent des quotas stricts votés par le Parlement, voire un référendum. Ceux qui le trouvent <strong>pas assez élevé</strong> rappellent que des secteurs (santé, BTP, agriculture, restauration) manquent de bras et que la population vieillit. Le débat porte autant sur le nombre que sur la <strong>capacité d'accueil</strong> réelle du pays.",
      "options": [
        {
          "text": "Beaucoup trop. Diviser drastiquement les flux (immigration zéro).",
          "score": 0
        },
        {
          "text": "Trop. Réduire nettement et être très sélectif.",
          "score": 2.5
        },
        {
          "text": "Correct, avec une meilleure sélection et un meilleur accompagnement.",
          "score": 5
        },
        {
          "text": "Ni trop ni pas assez. Mieux intégrer plutôt que couper les flux.",
          "score": 7.5
        },
        {
          "text": "Pas un problème. La France a besoin d'immigration pour fonctionner.",
          "score": 10
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 28,
      "theme": "immigration",
      "question": "Sans-papiers : expulser tout le monde ou régulariser ?",
      "explanation": "Un <strong>sans-papiers</strong> est une personne présente en France sans titre de séjour valide ; on en estime le nombre entre <strong>600 000 et 900 000</strong>, un chiffre par nature difficile à mesurer. Deux logiques s'opposent. Les partisans de l'<strong>expulsion</strong> jugent qu'on ne peut pas tolérer le séjour illégal, que cela affaiblit la loi et créerait un « appel d'air » attirant d'autres candidats ; ils veulent renforcer les <strong>reconduites à la frontière</strong> (aujourd'hui minoritaires par rapport aux mesures prononcées). Les partisans de la <strong>régularisation</strong> soulignent qu'expulser des centaines de milliers de personnes déjà installées, souvent qui travaillent, est irréaliste et coûteux, et qu'il vaut mieux régulariser au cas par cas ceux qui ont un emploi et des attaches.",
      "options": [
        {
          "text": "Expulsion systématique de tous les sans-papiers. Aucune régularisation.",
          "score": 0
        },
        {
          "text": "Expulser les délinquants, régulariser les autres au cas par cas.",
          "score": 3
        },
        {
          "text": "Régularisation large des personnes installées et intégrées depuis plusieurs années.",
          "score": 7
        },
        {
          "text": "Régularisation générale. La situation irrégulière est une construction politique injuste.",
          "score": 10
        },
        {
          "text": "Régulariser ceux qui travaillent dans les métiers en tension, expulser les refusés d'asile et les délinquants.",
          "score": 5
        }
      ]
    },
    {
      "id": 29,
      "theme": "immigration",
      "question": "Droit d'asile : la France doit-elle accueillir plus ou moins ?",
      "explanation": "Le <strong>droit d'asile</strong> permet à une personne fuyant des persécutions (guerre, dictature, menaces) de demander une protection dans un autre pays ; c'est un droit inscrit dans la <strong>Constitution</strong> française et dans des traités internationaux. La France reçoit autour de <strong>130 000 à 150 000 demandes par an</strong>, et en accepte environ un tiers. Ceux qui veulent <strong>accueillir davantage</strong> insistent sur le devoir humanitaire et sur les délais trop longs qui laissent les demandeurs dans la précarité. Ceux qui veulent <strong>accueillir moins</strong> estiment que le système est saturé, parfois détourné par des personnes qui ne fuient pas de réels dangers, et qu'il faut expulser plus vite les <strong>demandes rejetées</strong> pour préserver le droit d'asile lui-même.",
      "options": [
        {
          "text": "Réduire drastiquement. Traiter les demandes hors frontières françaises.",
          "score": 0
        },
        {
          "text": "Accélérer les procédures pour décider vite et expulser les refusés rapidement.",
          "score": 3
        },
        {
          "text": "Mieux accueillir, simplifier les procédures, augmenter le taux d'acceptation.",
          "score": 7
        },
        {
          "text": "Ouvrir les frontières à tous ceux qui fuient la guerre ou la misère.",
          "score": 10
        },
        {
          "text": "Garder le droit d'asile tel quel, mais des procédures plus rapides et une répartition européenne.",
          "score": 5
        }
      ]
    },
    {
      "id": 30,
      "theme": "immigration",
      "question": "Intégration : qu'est-ce qu'on attend vraiment d'un immigré ?",
      "explanation": "L'<strong>intégration</strong> désigne la façon dont un immigré trouve sa place dans la société d'accueil. Deux visions s'affrontent. L'<strong>assimilation</strong> attend de l'immigré qu'il adopte les codes, la langue et les valeurs françaises et que ses particularités (religion, origine) restent dans la sphère privée : c'est la tradition dite « républicaine ». Le <strong>multiculturalisme</strong> considère au contraire qu'une société peut accueillir plusieurs cultures qui coexistent et s'enrichissent, sans exiger l'effacement des différences. Les défenseurs de l'assimilation y voient la condition de l'<strong>unité nationale</strong> et de l'égalité. Ses critiques répondent qu'imposer l'uniformité peut être vécu comme une négation des identités et freiner, plutôt qu'aider, l'intégration réelle.",
      "options": [
        {
          "text": "S'assimiler totalement. Devenir français, c'est adopter la culture française.",
          "score": 0
        },
        {
          "text": "Parler français, respecter les lois et les valeurs républicaines laïques.",
          "score": 3
        },
        {
          "text": "S'intégrer économiquement. La culture et les traditions restent une affaire privée.",
          "score": 7
        },
        {
          "text": "Vivre comme on veut tant qu'on respecte les lois. Le multiculturalisme est une richesse.",
          "score": 10
        },
        {
          "text": "Parler français, travailler et respecter les lois ; les convictions restent libres dans la sphère privée.",
          "score": 5
        }
      ]
    },
    {
      "id": 31,
      "theme": "immigration",
      "question": "Regroupement familial : peut-on faire venir sa famille ?",
      "explanation": "Le <strong>regroupement familial</strong> autorise un étranger installé légalement en France à faire venir son conjoint et ses enfants mineurs, sous conditions de <strong>ressources</strong>, de <strong>logement</strong> et d'ancienneté de séjour. Il concerne environ <strong>12 000 à 15 000 personnes par an</strong>, une part modeste de l'immigration totale. Ses défenseurs rappellent que le <strong>droit à une vie familiale normale</strong> est protégé par la loi et les traités, et qu'une personne bien entourée s'intègre mieux. Ceux qui veulent le <strong>durcir</strong> estiment qu'il alimente une immigration non choisie, pèse sur le logement et les aides sociales, et proposent d'allonger les délais ou de relever les conditions de revenus et de maîtrise du français.",
      "options": [
        {
          "text": "Le supprimer ou le réduire drastiquement.",
          "score": 0
        },
        {
          "text": "Durcir fortement les conditions (ressources, logement, intégration préalable).",
          "score": 2
        },
        {
          "text": "Maintenir les règles actuelles, elles sont déjà assez strictes.",
          "score": 6
        },
        {
          "text": "L'assouplir. Séparer des familles est inhumain.",
          "score": 10
        }
      ]
    },
    {
      "id": 32,
      "theme": "immigration",
      "question": "Voile islamique : jusqu'où va la laïcité ?",
      "explanation": "La <strong>laïcité</strong> est le principe qui sépare l'État des religions et garantit à chacun de croire ou non ; en France, elle interdit les signes religieux à l'<strong>école publique</strong> (loi de 2004) et aux <strong>agents de l'État</strong>, mais les autorise dans la rue et pour les usagers des services publics. Le <strong>voile islamique</strong> cristallise le débat sur ces limites. Certains veulent <strong>l'étendre</strong> (par exemple l'interdire aux accompagnatrices scolaires ou à l'université), y voyant une protection contre la pression religieuse et pour l'égalité femmes-hommes. D'autres jugent qu'aller plus loin reviendrait à <strong>stigmatiser les musulmans</strong> et à restreindre la liberté de conscience, alors que la loi actuelle suffit. Le cœur du désaccord est de savoir où s'arrête la neutralité de l'État et où commence la liberté individuelle.",
      "options": [
        {
          "text": "Interdire le voile islamique dans tous les espaces publics.",
          "score": 0
        },
        {
          "text": "Maintenir l'interdiction dans la fonction publique uniquement.",
          "score": 4
        },
        {
          "text": "La règle actuelle est bien calibrée. Ne pas changer.",
          "score": 5
        },
        {
          "text": "Lever toutes les restrictions. C'est une liberté individuelle fondamentale.",
          "score": 10
        }
      ]
    },
    {
      "id": 33,
      "theme": "immigration",
      "question": "AME : faut-il soigner les sans-papiers malades ?",
      "explanation": "L'<strong>Aide Médicale d'État (AME)</strong> permet aux <strong>sans-papiers</strong> aux revenus très faibles de se faire soigner gratuitement ; elle couvre environ <strong>400 000 personnes</strong> pour un coût d'environ <strong>1,2 milliard d'euros par an</strong>, soit une petite fraction du budget de la santé. Ceux qui veulent la <strong>supprimer ou la réduire</strong> (souvent vers une simple « aide médicale d'urgence ») estiment qu'elle représente un coût et un possible facteur d'attraction pour l'immigration irrégulière. Ceux qui veulent la <strong>maintenir</strong> avancent un argument humanitaire, mais aussi de <strong>santé publique</strong> : soigner tôt évite des épidémies et des passages aux urgences bien plus coûteux. Le débat mêle donc éthique, finances publiques et efficacité sanitaire.",
      "options": [
        {
          "text": "La supprimer. Les sans-papiers ne peuvent pas bénéficier des soins publics.",
          "score": 0
        },
        {
          "text": "La remplacer par une aide d'urgence uniquement (cas vitaux).",
          "score": 3
        },
        {
          "text": "La maintenir telle quelle. La santé est un droit humain fondamental.",
          "score": 7
        },
        {
          "text": "L'élargir. Refuser des soins à des personnes malades est inhumain.",
          "score": 10
        },
        {
          "text": "La maintenir mais la recentrer sur les soins essentiels et lutter contre les abus.",
          "score": 5
        }
      ]
    },
    {
      "id": 34,
      "theme": "immigration",
      "question": "Est-ce que les immigrés prennent le travail des Français ?",
      "explanation": "L'idée que les immigrés « prendraient le travail des Français » est une crainte fréquente, mais les <strong>économistes</strong> la nuancent fortement. La plupart des études montrent que l'immigration n'augmente pas durablement le <strong>chômage</strong> global, car les immigrés créent aussi de la consommation, des entreprises et occupent souvent des <strong>métiers peu pourvus</strong> (aide à la personne, bâtiment, nettoyage). Ceux qui s'inquiètent soulignent qu'à court terme, dans certains secteurs peu qualifiés, une main-d'œuvre nombreuse peut <strong>tirer les salaires vers le bas</strong> et accroître la concurrence pour les emplois locaux. Ceux qui relativisent répondent que l'emploi n'est pas un « gâteau fixe » et que l'immigration comble surtout des <strong>pénuries</strong>. La réalité varie donc selon les secteurs et les périodes.",
      "options": [
        {
          "text": "Oui, clairement. Il faut donner la priorité aux Français à l'embauche.",
          "score": 0
        },
        {
          "text": "Dans certains secteurs oui. Mieux encadrer l'immigration économique.",
          "score": 3
        },
        {
          "text": "Non en général, mais mieux répartir les efforts d'intégration.",
          "score": 7
        },
        {
          "text": "Non. Ce mythe est instrumentalisé politiquement pour stigmatiser.",
          "score": 10
        },
        {
          "text": "Dans quelques secteurs il y a concurrence, dans d'autres l'immigration comble des manques : ni oui ni non.",
          "score": 5
        }
      ]
    },
    {
      "id": 35,
      "theme": "immigration",
      "question": "Y a-t-il une menace sur l'identité française ?",
      "explanation": "Le <strong>« grand remplacement »</strong> est une théorie selon laquelle la population française d'origine européenne serait progressivement « remplacée » par des populations immigrées, surtout musulmanes, de façon organisée. Popularisée par l'écrivain <strong>Renaud Camus</strong>, elle est portée par une partie de l'extrême droite. Ses partisans estiment que l'immigration et les différences de natalité menacent l'<strong>identité et la culture</strong> françaises. La très grande majorité des <strong>démographes</strong> la rejette comme infondée : les statistiques ne montrent pas de « remplacement », les origines se mélangent au fil des générations et parler d'un plan concerté relève du <strong>complotisme</strong>. Le débat oppose donc une inquiétude identitaire réelle chez une partie de la population à un constat scientifique qui la conteste.",
      "options": [
        {
          "text": "C'est une réalité. L'identité française est menacée. Il faut agir urgemment.",
          "score": 0
        },
        {
          "text": "Vraie question d'identité même si les théories extrêmes sont excessives.",
          "score": 3
        },
        {
          "text": "Théorie instrumentalisée politiquement qui stigmatise les immigrés.",
          "score": 7
        },
        {
          "text": "Une théorie du « grand remplacement » fausse et dangereuse, à rejeter fermement.",
          "score": 10
        },
        {
          "text": "L'identité française évolue, la question est légitime, mais on est loin d'une « menace ».",
          "score": 5
        }
      ]
    },
    {
      "id": 36,
      "theme": "immigration",
      "question": "Frontières extérieures de l'Europe : la politique de Frontex",
      "explanation": "<strong>Frontex</strong> est l'agence européenne chargée de surveiller les <strong>frontières extérieures</strong> de l'Union (mers, aéroports, frontières terrestres) et d'aider les États à contrôler les entrées et les retours. Son budget et ses effectifs ont fortement augmenté, l'UE visant un corps de <strong>10 000 garde-frontières</strong>. Ceux qui la soutiennent y voient l'outil indispensable d'une Europe « sans frontières intérieures » : mieux vaut un contrôle commun et solide aux portes de l'UE. Ses critiques, notamment des <strong>ONG</strong>, dénoncent des « refoulements » illégaux de migrants (les <strong>pushbacks</strong>) et un manque de respect du droit d'asile, reprochant à l'agence de transformer l'Europe en « forteresse ». Le débat oppose l'exigence de <strong>maîtrise des frontières</strong> au respect des droits des personnes.",
      "options": [
        {
          "text": "Fermeté maximale : stopper tous les passages irréguliers (Frontex renforcé ou retour aux contrôles nationaux).",
          "score": 0
        },
        {
          "text": "Frontex nécessaire mais avec un strict respect du droit international.",
          "score": 4
        },
        {
          "text": "Repenser la politique migratoire européenne avec plus d'accueil et de partage.",
          "score": 7
        },
        {
          "text": "Supprimer Frontex. Les migrations ne se gèrent pas avec des barbelés.",
          "score": 10
        }
      ]
    },
    {
      "id": 105,
      "theme": "immigration",
      "w": 3,
      "question": "Priorité nationale : réserver certains emplois, aides et logements aux Français ?",
      "explanation": "La <strong>priorité nationale</strong> consiste à réserver aux citoyens français (ou aux étrangers présents depuis longtemps) l'accès prioritaire à certains <strong>emplois</strong>, <strong>aides sociales</strong> et <strong>logements sociaux</strong>. C'est le cœur du programme du RN, qui veut l'inscrire dans la <strong>Constitution par référendum</strong> (avec, par exemple, un délai de cinq ans de travail en France pour toucher certaines prestations). La droite (Retailleau) propose un référendum sur l'immigration et des conditions de résidence plus longues, sans le mot « priorité nationale ». Le Conseil d'État et la plupart des juristes estiment la mesure contraire au principe d'<strong>égalité</strong> de la Constitution et au droit européen — d'où l'idée de référendum constitutionnel. À gauche et au centre, on y voit une discrimination selon la nationalité et une rupture avec l'idée républicaine.",
      "options": [
        {
          "text": "Oui, inscrire la priorité nationale dans la Constitution, par référendum.",
          "score": 0
        },
        {
          "text": "Oui pour certaines aides : un délai de résidence ou de travail de 5 ans.",
          "score": 2.5
        },
        {
          "text": "Non à la priorité nationale, mais des conditions de résidence un peu plus strictes.",
          "score": 5
        },
        {
          "text": "Non : c'est contraire à l'égalité républicaine et au droit européen.",
          "score": 8
        },
        {
          "text": "Non, et élargir les droits des étrangers en situation régulière (vote local).",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 106,
      "theme": "immigration",
      "w": 2,
      "question": "Droit du sol : faut-il le restreindre ?",
      "explanation": "Le <strong>droit du sol</strong> permet à un enfant né en France de parents étrangers de devenir français (automatiquement à 18 ans sous condition de résidence, ou plus tôt sur demande). Il a été <strong>durci à Mayotte</strong> en 2025 (condition de séjour régulier des deux parents pendant un an), et le débat s'est étendu à tout le territoire : le RN et Reconquête veulent le <strong>supprimer</strong> (nationalité par filiation uniquement), la droite le conditionner à une demande explicite et à la situation régulière des parents, tandis que le centre et la gauche défendent un principe républicain vieux de plus d'un siècle, gage d'intégration. Les défenseurs de la restriction y voient un frein à l'immigration irrégulière et une nationalité « qui se mérite » ; ses opposants rappellent que la France a toujours fait des Français à partir d'enfants nés sur son sol.",
      "options": [
        {
          "text": "Le supprimer : la nationalité ne se transmet que par filiation.",
          "score": 0
        },
        {
          "text": "Le durcir : demande explicite à 18 ans et parents en situation régulière.",
          "score": 3
        },
        {
          "text": "Le garder tel qu'il est aujourd'hui.",
          "score": 6.5
        },
        {
          "text": "Le renforcer : nationalité automatique dès la naissance pour tout enfant né en France.",
          "score": 10
        },
        {
          "text": "Le garder, en exigeant une démarche volontaire à la majorité.",
          "score": 5
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 37,
      "theme": "securite",
      "question": "Les juges français sont-ils trop indulgents ?",
      "explanation": "Beaucoup de Français ont le sentiment que la <strong>justice</strong> est trop clémente. En réalité, un juge doit appliquer la loi en tenant compte des faits et de la personnalité de l'accusé, et de nombreuses peines de prison courtes sont <strong>aménagées</strong> (bracelet électronique, travail d'intérêt général) plutôt qu'exécutées en cellule. Ceux qui trouvent les juges <strong>trop indulgents</strong> réclament des peines plancher, moins d'aménagements et une réponse plus ferme, surtout pour la récidive. Ceux qui contestent ce reproche rappellent que la France a un <strong>taux d'incarcération</strong> plutôt élevé en Europe, que la prison ne réduit pas toujours la récidive, et que le vrai problème est le <strong>manque de moyens</strong> de la justice (délais, effectifs). Le débat oppose donc la demande de fermeté à l'efficacité réelle des peines.",
      "options": [
        {
          "text": "Trop laxistes. Peines plancher automatiques pour les récidivistes.",
          "score": 0
        },
        {
          "text": "Un peu indulgents. Renforcer les peines pour les récidivistes dangereux.",
          "score": 3
        },
        {
          "text": "Correct. Mieux vaut investir dans la réinsertion que punir plus fort.",
          "score": 6
        },
        {
          "text": "Trop punitifs. L'incarcération massive fabrique plus de criminels qu'elle n'en empêche.",
          "score": 10
        }
      ]
    },
    {
      "id": 38,
      "theme": "securite",
      "question": "Violences policières : problème réel ou mythe médiatique ?",
      "explanation": "Les <strong>violences policières</strong> désignent l'usage excessif ou illégal de la force par des agents ; le sujet a pris de l'ampleur après plusieurs décès lors de contrôles ou d'interpellations et après les émeutes de 2023. Ceux qui y voient un <strong>problème réel</strong> pointent des cas documentés, des <strong>contrôles au faciès</strong> et un sentiment d'impunité, et réclament plus de contrôles indépendants de la police. Ceux qui parlent de <strong>mythe médiatique</strong> estiment que ces cas restent rares au regard des millions d'interventions, que les policiers font un métier dangereux et sont eux-mêmes visés par des violences, et qu'un discours accusateur généralisé décourage les forces de l'ordre. Le débat porte sur l'ampleur du phénomène et sur l'équilibre entre <strong>autorité</strong> et <strong>contrôle démocratique</strong> de la police.",
      "options": [
        {
          "text": "Les violences policières sont un mythe médiatique. Soutien total aux forces de l'ordre.",
          "score": 0
        },
        {
          "text": "Des dérapages individuels existent mais pas de problème systémique.",
          "score": 3
        },
        {
          "text": "Un vrai problème de formation et de contrôle interne à corriger.",
          "score": 7
        },
        {
          "text": "La violence policière est systémique et racialement ciblée.",
          "score": 10
        },
        {
          "text": "Des problèmes réels mais localisés : renforcer la formation et un contrôle indépendant, sans généraliser.",
          "score": 5
        }
      ]
    },
    {
      "id": 39,
      "theme": "securite",
      "question": "Narcotrafic : comment en sortir ?",
      "explanation": "Le <strong>narcotrafic</strong> est le commerce illégal de drogues ; il génère des milliards d'euros, alimente des <strong>règlements de comptes</strong> meurtriers (notamment à Marseille) et gangrène certains quartiers. Plusieurs approches s'opposent. La ligne <strong>répressive</strong> veut frapper plus fort les réseaux : plus de police, de saisies, de peines et de coopération internationale pour démanteler les filières et l'<strong>argent sale</strong>. Une autre approche juge la « guerre à la drogue » largement perdue et propose de s'attaquer à la <strong>demande</strong> (prévention, soins) voire d'encadrer légalement certaines drogues comme le <strong>cannabis</strong>, pour retirer le marché aux trafiquants. Beaucoup plaident pour combiner les deux, car la seule répression n'a pas fait disparaître un trafic très lucratif.",
      "options": [
        {
          "text": "Tolérance zéro. Opérations musclées, peines maximales.",
          "score": 0
        },
        {
          "text": "Renforcer massivement la police et la justice dans les zones touchées.",
          "score": 3
        },
        {
          "text": "Mix : répression des trafiquants + prévention + réduction des risques.",
          "score": 6
        },
        {
          "text": "Légalisation et encadrement pour assécher les marchés illicites.",
          "score": 10
        }
      ]
    },
    {
      "id": 40,
      "theme": "securite",
      "question": "Antiterrorisme : jusqu'où sacrifier des libertés ?",
      "explanation": "L'<strong>antiterrorisme</strong> regroupe les moyens de l'État pour prévenir les attentats : surveillance, renseignement, fichiers, contrôles. Après les attentats de 2015, la France a inscrit dans le droit courant des mesures issues de l'<strong>état d'urgence</strong> (assignations, perquisitions, fermetures de lieux). Le débat porte sur l'<strong>équilibre entre sécurité et libertés</strong>. Certains estiment qu'il faut donner plus de pouvoirs aux services (surveillance d'internet, algorithmes, fichage) car la menace reste élevée et une vie sauvée vaut cette contrainte. D'autres, dont des associations de <strong>défense des libertés</strong>, craignent une surveillance de masse, des mesures prises sans juge et une atteinte à la <strong>vie privée</strong> de tous, pas seulement des suspects. La question est de savoir combien de liberté une société accepte de céder pour se protéger.",
      "options": [
        {
          "text": "Toutes les mesures nécessaires, même si certaines libertés sont réduites.",
          "score": 0
        },
        {
          "text": "Outils renforcés mais avec un contrôle judiciaire strict à chaque étape.",
          "score": 4
        },
        {
          "text": "Ne pas sacrifier les libertés fondamentales pour une sécurité illusoire.",
          "score": 8
        },
        {
          "text": "La surveillance de masse est plus dangereuse que le terrorisme pour nos libertés.",
          "score": 10
        }
      ]
    },
    {
      "id": 41,
      "theme": "securite",
      "question": "Prisons à 140 % : construire plus ou emprisonner moins ?",
      "explanation": "Les prisons françaises sont <strong>surpeuplées</strong> : record de <strong>90 020 détenus au 1er septembre 2026</strong> (chiffres publiés début octobre) pour environ 63 300 places, soit un taux d'occupation de <strong>142 %</strong> — et près de <strong>175 % dans les maisons d'arrêt</strong>, où des détenus dorment sur des matelas au sol. La France a été condamnée pour ces conditions. Deux réponses s'opposent. <strong>Construire plus de places</strong> : le plan « 15 000 places » a pris du retard, la droite et le RN promettent des dizaines de milliers de places supplémentaires et des prisons de haute sécurité pour les narcotrafiquants (loi de 2025). <strong>Emprisonner moins</strong> : développer les <strong>peines alternatives</strong> (bracelet, TIG, sursis probatoire) pour les délits légers, car la prison courte favoriserait la récidive et coûte cher. Beaucoup jugent qu'il faut les deux, mais construire prend des années et les alternatives suscitent un débat sur la <strong>fermeté</strong>.",
      "options": [
        {
          "text": "Construire massivement de nouvelles prisons.",
          "score": 2
        },
        {
          "text": "Construire + développer les peines alternatives pour les délits mineurs.",
          "score": 5
        },
        {
          "text": "Priorité aux peines alternatives. La prison doit être le dernier recours.",
          "score": 7
        },
        {
          "text": "Réduire radicalement le recours à la prison. Elle fabrique des criminels.",
          "score": 10
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 42,
      "theme": "securite",
      "question": "Justice des mineurs : traiter un ado de 16 ans comme un adulte ?",
      "explanation": "En France, un mineur qui commet un délit est jugé par une <strong>justice spécialisée</strong> qui privilégie l'éducation sur la punition, avec des peines réduites par rapport aux adultes : c'est le principe de l'<strong>excuse de minorité</strong>. Face à des faits graves commis par des adolescents, certains veulent pouvoir traiter un jeune de <strong>16 ans comme un adulte</strong>, estimant qu'il est conscient de ses actes et que la fermeté protège les victimes et dissuade. D'autres défendent le maintien d'une justice adaptée, rappelant que le <strong>cerveau d'un adolescent</strong> n'est pas mature, que l'objectif doit rester la <strong>réinsertion</strong>, et qu'une prison ferme précoce fabrique souvent des récidivistes. Le débat oppose la protection de la société et la responsabilisation à la spécificité de l'enfance.",
      "options": [
        {
          "text": "Les juger comme des adultes à partir de 16 ans pour les crimes graves.",
          "score": 0
        },
        {
          "text": "Peines plus lourdes pour les mineurs récidivistes dangereux.",
          "score": 3
        },
        {
          "text": "Maintenir un droit des mineurs axé sur l'éducation et la réhabilitation.",
          "score": 7
        },
        {
          "text": "Investir massivement dans la prévention avant même que le jeune délinque.",
          "score": 10
        },
        {
          "text": "Garder la spécificité des mineurs, mais des réponses plus rapides et fermes pour les récidivistes.",
          "score": 5
        }
      ]
    },
    {
      "id": 43,
      "theme": "securite",
      "question": "Violences conjugales et féminicides : la réponse est-elle à la hauteur ?",
      "explanation": "Les <strong>violences conjugales</strong> sont les violences (physiques, sexuelles, psychologiques) au sein du couple ; un <strong>féminicide</strong> est le meurtre d'une femme parce qu'elle est une femme, souvent par un conjoint ou ex-conjoint. La France en compte environ <strong>100 à 150 par an</strong>, un chiffre qui ne baisse guère. Des outils existent (<strong>bracelet anti-rapprochement</strong>, téléphone « grave danger », ordonnances de protection), mais beaucoup jugent la réponse <strong>insuffisante</strong> : plaintes mal prises, manque de places d'hébergement, de moyens pour la police et la justice. Le débat porte moins sur l'objectif, que presque tous partagent, que sur les <strong>moyens</strong> : faut-il une loi-cadre et un budget massif, ou mieux appliquer les dispositifs existants ? La question est celle de l'efficacité concrète de la protection des victimes.",
      "options": [
        {
          "text": "Mieux appliquer les lois existantes. Le problème c'est l'exécution, pas les lois.",
          "score": 2
        },
        {
          "text": "Renforcer les peines pour les violences conjugales et les récidivistes.",
          "score": 4
        },
        {
          "text": "Grande cause nationale : moyens massifs pour la police, la justice, l'hébergement.",
          "score": 7
        },
        {
          "text": "Révolution culturelle : éducation à l'égalité dès l'école + répression forte.",
          "score": 10
        }
      ]
    },
    {
      "id": 44,
      "theme": "securite",
      "question": "Vidéosurveillance et reconnaissance faciale : jusqu'où aller ?",
      "explanation": "La <strong>vidéosurveillance</strong> filme l'espace public ; la <strong>reconnaissance faciale</strong> va plus loin en identifiant automatiquement des personnes à partir de leur visage. La France a autorisé, à titre expérimental, la <strong>vidéosurveillance algorithmique</strong> (détection automatique de comportements) notamment pour les Jeux olympiques de 2024. Ceux qui veulent <strong>aller plus loin</strong> y voient un outil efficace pour prévenir les attentats, retrouver des suspects et sécuriser les grands événements. Ceux qui veulent <strong>l'encadrer strictement</strong> alertent sur le risque d'une <strong>surveillance de masse</strong> à la chinoise, d'erreurs d'identification et de la fin de l'<strong>anonymat</strong> dans la rue. Le débat oppose le gain de sécurité au respect de la vie privée et au type de société que l'on souhaite.",
      "options": [
        {
          "text": "Déployer partout, y compris la reconnaissance faciale en temps réel.",
          "score": 0
        },
        {
          "text": "Plus de caméras mais pas de reconnaissance faciale automatique.",
          "score": 3
        },
        {
          "text": "Cadre légal très strict. La surveillance doit être ciblée, pas de masse.",
          "score": 7
        },
        {
          "text": "Réduire la vidéosurveillance. L'État ne doit pas nous tracer en permanence.",
          "score": 10
        },
        {
          "text": "Des caméras là où c'est utile, reconnaissance faciale seulement sur autorisation judiciaire et cas graves.",
          "score": 5
        }
      ]
    },
    {
      "id": 45,
      "theme": "securite",
      "question": "Armes à feu : assouplir ou maintenir la réglementation stricte ?",
      "explanation": "En France, la détention d'<strong>armes à feu</strong> est déjà très encadrée : elle exige un permis de chasse ou une licence de tir, un casier vierge et un enregistrement, contrairement à des pays comme les États-Unis. Une minorité (chasseurs, tireurs sportifs, certains ruraux) demande un <strong>assouplissement</strong> de démarches jugées lourdes, au nom de la liberté et de la légitime défense. La position majoritaire défend le <strong>maintien de règles strictes</strong>, voire leur renforcement, en soulignant que la circulation d'armes (souvent illégales, liées au trafic) alimente la criminalité et les féminicides, et qu'un accès plus large augmenterait les <strong>drames</strong>. Le débat, moins vif qu'ailleurs, porte surtout sur la lutte contre les <strong>armes illégales</strong> plus que sur les détenteurs déclarés.",
      "options": [
        {
          "text": "L'assouplir pour permettre la légitime défense armée à domicile.",
          "score": 0
        },
        {
          "text": "Maintenir la réglementation actuelle. Elle est bien calibrée.",
          "score": 4
        },
        {
          "text": "Renforcer encore les contrôles, surtout sur les armes semi-automatiques.",
          "score": 7
        },
        {
          "text": "Interdire toutes les armes civiles sauf exceptions très strictes.",
          "score": 10
        }
      ]
    },
    {
      "id": 46,
      "theme": "securite",
      "question": "Cybercriminalité : comment l'État doit-il répondre ?",
      "explanation": "La <strong>cybercriminalité</strong> regroupe les délits commis via internet : arnaques en ligne, vol de données, <strong>rançongiciels</strong> (logiciels qui bloquent un système contre une rançon) visant hôpitaux, entreprises et collectivités. Le phénomène explose et coûte des milliards, avec des attaques venant souvent de l'<strong>étranger</strong>. Certains veulent une réponse <strong>offensive</strong> : plus de moyens pour la police spécialisée et l'<strong>ANSSI</strong>, des sanctions lourdes et une meilleure coopération internationale contre les réseaux. D'autres insistent d'abord sur la <strong>prévention</strong> : former les citoyens et les administrations, sécuriser les systèmes, protéger les <strong>données personnelles</strong>. Le débat porte aussi sur l'équilibre entre efficacité de l'État et respect du <strong>chiffrement</strong> et de la vie privée.",
      "options": [
        {
          "text": "Donner des pouvoirs de surveillance massifs à la police sur internet.",
          "score": 1
        },
        {
          "text": "Unités spécialisées renforcées + coopération internationale.",
          "score": 4
        },
        {
          "text": "Investir massivement dans la cybersécurité et la formation des citoyens.",
          "score": 7
        },
        {
          "text": "Réguler fortement les grandes plateformes numériques avant tout.",
          "score": 9
        }
      ]
    },
    {
      "id": 47,
      "theme": "env",
      "question": "Le changement climatique : urgence absolue ou surestimé ?",
      "explanation": "Le <strong>changement climatique</strong> désigne le réchauffement de la planète, surtout dû aux gaz à effet de serre issus des énergies fossiles (pétrole, charbon, gaz). La Terre s'est déjà réchauffée d'environ <strong>1,3 à 1,4 °C</strong> depuis l'ère industrielle, 2024 ayant été l'année la plus chaude jamais mesurée, et le <strong>GIEC</strong> alerte sur des sécheresses, canicules et inondations plus fréquentes. Pour un premier camp, c'est une <strong>urgence absolue</strong> : il faut agir vite et fort, car chaque dixième de degré compte et l'inaction coûtera très cher. Pour un autre camp, le sujet serait <strong>exagéré ou instrumentalisé</strong> : la France ne pèse que 1 % des émissions mondiales, et des mesures trop brutales pénaliseraient l'économie et le pouvoir d'achat sans changer le climat global — un discours renforcé depuis le recul américain sur le climat.",
      "options": [
        {
          "text": "Surestimé. L'économie et les emplois passent avant l'écologie.",
          "score": 0
        },
        {
          "text": "Réel mais gérable grâce aux innovations technologiques sans grande contrainte.",
          "score": 3
        },
        {
          "text": "Très sérieux. Il faut des mesures ambitieuses mais socialement justes.",
          "score": 7
        },
        {
          "text": "La plus grande urgence du siècle. Tout doit y être subordonné.",
          "score": 10
        },
        {
          "text": "Très sérieux : agir fermement, mais en tenant compte du coût pour l'économie et les ménages.",
          "score": 5
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 48,
      "theme": "env",
      "question": "Voiture individuelle : liberté fondamentale ou problème à régler ?",
      "explanation": "La <strong>voiture individuelle</strong> reste le premier mode de déplacement des Français : elle est indispensable dans les campagnes et les zones peu desservies par les transports. Mais elle représente aussi une part importante des émissions de CO2 et de la pollution de l'air dans les villes. Pour un camp, la voiture est une <strong>liberté fondamentale</strong> : la contraindre (péages urbains, zones à faibles émissions, hausses de carburant) frappe surtout ceux qui n'ont pas d'alternative et vivent loin des centres. Pour un autre camp, c'est un <strong>problème à régler</strong> : il faut développer les transports en commun, le vélo et la voiture électrique pour réduire pollution et dépendance au pétrole. Le débat oppose souvent la <strong>France des métropoles</strong> et celle des territoires ruraux.",
      "options": [
        {
          "text": "Ne pas toucher à la voiture. C'est une liberté fondamentale.",
          "score": 0
        },
        {
          "text": "Transition vers les voitures électriques, sans interdire les thermiques.",
          "score": 3
        },
        {
          "text": "Taxer les véhicules polluants + investir massivement dans les transports en commun.",
          "score": 7
        },
        {
          "text": "Viser une France sans voiture individuelle dans les villes d'ici 2040.",
          "score": 10
        },
        {
          "text": "Accompagner la transition (électrique, transports) sans taxer ni interdire.",
          "score": 5
        }
      ]
    },
    {
      "id": 49,
      "theme": "env",
      "question": "Pesticides dans l'agriculture : stopper ou continuer ?",
      "explanation": "Les <strong>pesticides</strong> sont des produits chimiques utilisés par les agriculteurs pour protéger leurs cultures des insectes, maladies et mauvaises herbes. Ils augmentent les rendements, mais certains sont soupçonnés d'effets sur la <strong>santé</strong> (agriculteurs, riverains) et sur la <strong>biodiversité</strong>, notamment le déclin des abeilles. Le cas du <strong>glyphosate</strong>, herbicide très répandu, cristallise le débat. Pour un camp, il faut <strong>stopper ou réduire fortement</strong> leur usage pour protéger la santé et la nature, en aidant les agriculteurs à changer de méthodes. Pour un autre camp, il faut <strong>continuer</strong> tant qu'il n'existe pas d'alternative efficace : interdire en France ce qui reste autorisé ailleurs reviendrait à ruiner nos agriculteurs et à importer des produits traités de la même façon.",
      "options": [
        {
          "text": "Laisser les agriculteurs libres. Les normes les étranglent.",
          "score": 0
        },
        {
          "text": "Réduction progressive et douce sans pénaliser face à la concurrence étrangère.",
          "score": 3
        },
        {
          "text": "Calendrier de sortie des pesticides sur 10 ans avec accompagnement financier fort.",
          "score": 7
        },
        {
          "text": "Interdiction rapide. Transition forcée vers l'agriculture biologique.",
          "score": 10
        },
        {
          "text": "Réduire progressivement avec des objectifs contraignants mais du temps et des aides.",
          "score": 5
        }
      ]
    },
    {
      "id": 50,
      "theme": "env",
      "question": "Taxe carbone : juste outil ou impôt injuste sur les pauvres ?",
      "explanation": "La <strong>taxe carbone</strong> est un impôt qui renchérit les énergies polluantes (essence, gaz, fioul) proportionnellement au CO2 qu'elles émettent. L'idée : rendre le pollueur payeur pour pousser ménages et entreprises vers des choix plus propres. En France, sa hausse prévue a été l'un des déclencheurs de la crise des <strong>Gilets jaunes</strong> en 2018. Pour un camp, c'est un <strong>outil juste et efficace</strong>, surtout si les recettes sont redistribuées aux ménages modestes ou investies dans les transports propres. Pour un autre camp, c'est un <strong>impôt injuste</strong> qui frappe d'abord les personnes rurales et à faibles revenus, contraintes de rouler et de se chauffer, sans réelle solution de rechange abordable.",
      "options": [
        {
          "text": "Supprimer toutes les taxes vertes. C'est socialement injuste.",
          "score": 0
        },
        {
          "text": "Les maintenir mais redistribuer intégralement l'argent aux ménages modestes.",
          "score": 5
        },
        {
          "text": "Les augmenter progressivement avec une forte compensation pour les pauvres.",
          "score": 7
        },
        {
          "text": "Taxer massivement les entreprises polluantes plutôt que les ménages.",
          "score": 9
        }
      ]
    },
    {
      "id": 51,
      "theme": "env",
      "question": "Éoliennes et panneaux solaires : accélérer ou freiner ?",
      "explanation": "Les <strong>éoliennes</strong> et les <strong>panneaux solaires</strong> produisent de l'électricité sans émettre de CO2, à partir du vent et du soleil. On les appelle énergies <strong>renouvelables</strong>, par opposition au nucléaire et aux fossiles. En France, elles complètent le nucléaire, très présent, mais leur production dépend de la météo (pas de vent, pas de soleil = pas d'électricité). Pour un camp, il faut <strong>accélérer</strong> leur déploiement pour réduire les fossiles, gagner en indépendance énergétique et créer des emplois. Pour un autre camp, il faut <strong>freiner</strong> : les éoliennes défigureraient les paysages, gêneraient les riverains et resteraient irrégulières, la priorité devant plutôt aller au <strong>nucléaire</strong>, pilotable et décarboné.",
      "options": [
        {
          "text": "Stopper leur développement. Trop cher, trop intermittent, trop intrusif.",
          "score": 0
        },
        {
          "text": "Les développer prudemment en respectant les territoires et les paysages.",
          "score": 4
        },
        {
          "text": "Accélérer massivement. C'est une urgence climatique et économique.",
          "score": 7
        },
        {
          "text": "100% renouvelables d'ici 2045. Plan de guerre national.",
          "score": 10
        }
      ]
    },
    {
      "id": 52,
      "theme": "env",
      "question": "Les entreprises polluantes : punir ou inciter ?",
      "explanation": "Une <strong>entreprise polluante</strong> est une société dont l'activité rejette beaucoup de gaz à effet de serre ou de déchets (industrie lourde, chimie, transport, etc.). La question est de savoir comment l'amener à réduire son impact. Deux logiques s'opposent. Pour un camp, il faut <strong>punir</strong> : normes strictes, amendes, taxes et interdictions, car sans contrainte forte les entreprises ne changeraient pas assez vite. Pour un autre camp, il faut <strong>inciter</strong> : aides, crédits d'impôt et accompagnement pour financer leur transition, sous peine de voir les usines fermer ou <strong>partir à l'étranger</strong> (là où les règles sont plus souples), ce qui déplacerait la pollution sans réduire les émissions mondiales.",
      "options": [
        {
          "text": "Le marché régule naturellement via les consommateurs qui font des choix.",
          "score": 0
        },
        {
          "text": "Incitations fiscales : les aider à se transformer plutôt que les punir.",
          "score": 3
        },
        {
          "text": "Obligations légales strictes avec des amendes dissuasives.",
          "score": 7
        },
        {
          "text": "Responsabilité pénale des dirigeants pour les crimes environnementaux.",
          "score": 10
        },
        {
          "text": "Un mix : normes progressives + aides à la transition, amendes en dernier recours.",
          "score": 5
        }
      ]
    },
    {
      "id": 53,
      "theme": "env",
      "question": "S'adapter au dérèglement climatique : transformer nos villes et campagnes ?",
      "explanation": "S'<strong>adapter</strong> au dérèglement climatique consiste à préparer nos villes, campagnes et infrastructures aux effets déjà inévitables : canicules, sécheresses, inondations, montée des eaux. Cela complète la <strong>réduction des émissions</strong> (limiter la cause) par une logique de protection (gérer les conséquences). Concrètement : végétaliser les villes contre la chaleur, revoir la gestion de l'eau, adapter les bâtiments et l'agriculture, protéger les côtes. Pour un camp, c'est une <strong>priorité vitale</strong> : le réchauffement est déjà là, mieux vaut investir maintenant pour éviter des drames et des coûts bien plus lourds ensuite. Pour un autre camp, c'est un <strong>choix de moyens</strong> : ces transformations coûtent très cher, et il ne faudrait pas relâcher l'effort de réduction des émissions au profit de la seule adaptation.",
      "options": [
        {
          "text": "Adapter les infrastructures techniques sans transformer le modèle économique.",
          "score": 2
        },
        {
          "text": "Mix équilibré entre adaptation et réduction des émissions.",
          "score": 5
        },
        {
          "text": "Transformation profonde de nos villes et modes de vie.",
          "score": 8
        },
        {
          "text": "Planification nationale d'urgence contraignante.",
          "score": 10
        }
      ]
    },
    {
      "id": 54,
      "theme": "env",
      "question": "Bétonisation : faut-il arrêter de construire sur les terres naturelles ?",
      "explanation": "La <strong>bétonisation</strong>, ou artificialisation des sols, désigne le fait de recouvrir des terres naturelles ou agricoles par des constructions, routes et parkings. En France, l'équivalent d'un département disparaît environ tous les dix ans, ce qui détruit des sols, de la biodiversité et des terres nourricières. La loi <strong>ZAN</strong> (Zéro Artificialisation Nette) vise à réduire ce rythme puis à l'arrêter d'ici <strong>2050</strong>. Pour un camp, il faut <strong>tenir cet objectif</strong> pour préserver la nature et l'agriculture, en rénovant l'existant plutôt qu'en construisant du neuf. Pour un autre camp, cette règle est trop <strong>rigide</strong> : elle freinerait la construction de logements et le développement des communes rurales, à qui l'on demanderait de renoncer à des projets.",
      "options": [
        {
          "text": "Assouplir la loi ZAN. Construire est nécessaire pour vivre et travailler.",
          "score": 0
        },
        {
          "text": "La maintenir avec plus de flexibilité selon les territoires ruraux.",
          "score": 4
        },
        {
          "text": "L'appliquer strictement et restaurer les zones déjà dégradées.",
          "score": 7
        },
        {
          "text": "Aller plus loin : dé-bétonner certains espaces, rendre la nature aux villes.",
          "score": 10
        }
      ]
    },
    {
      "id": 55,
      "theme": "env",
      "question": "Mode de vie : faut-il consommer moins ?",
      "explanation": "La <strong>décroissance</strong> est l'idée qu'on ne peut pas consommer et produire toujours plus sur une planète aux ressources limitées : il faudrait donc volontairement réduire notre production et notre consommation. Elle s'oppose au modèle dominant fondé sur la <strong>croissance</strong> économique continue (le fameux PIB qui augmente). Ses partisans proposent de consommer <strong>moins mais mieux</strong> : moins de gaspillage, d'objets jetables et de surproduction, pour vivre dans les limites de la nature. Ses opposants estiment que la décroissance appauvrirait le pays, détruirait des emplois et pèserait sur les plus modestes ; ils misent plutôt sur la <strong>croissance verte</strong> et l'innovation technologique pour polluer moins tout en continuant à produire.",
      "options": [
        {
          "text": "C'est une liberté individuelle. L'État ne doit pas dicter nos modes de vie.",
          "score": 0
        },
        {
          "text": "Sensibiliser sans contraindre. L'information et l'éducation suffisent.",
          "score": 3
        },
        {
          "text": "Taxer les produits et comportements les plus polluants pour orienter les choix.",
          "score": 6
        },
        {
          "text": "Décroissance assumée. Il faut changer radicalement de modèle économique.",
          "score": 10
        }
      ]
    },
    {
      "id": 107,
      "theme": "env",
      "w": 2,
      "question": "Zones à faibles émissions (ZFE) : bonne idée ou punition des plus modestes ?",
      "explanation": "Les <strong>ZFE</strong> interdisent progressivement aux véhicules les plus polluants (vignettes Crit'Air 3, 4, 5) de circuler dans les grandes agglomérations, pour réduire la <strong>pollution de l'air</strong> responsable de dizaines de milliers de décès prématurés par an. Très contestées, elles ont été <strong>supprimées par l'Assemblée nationale en 2025</strong> à l'initiative de la droite et du RN avec des voix de gauche, au nom de la justice sociale : ce sont les ménages modestes et les habitants du périurbain qui roulent dans les voitures anciennes. Leurs défenseurs (écologistes, une partie du centre) y voient un outil de <strong>santé publique</strong> indispensable, à condition d'aides massives (leasing social, prime à la conversion) ; leurs opposants une écologie punitive qui assigne les pauvres à résidence.",
      "options": [
        {
          "text": "Bonne chose qu'elles soient supprimées : elles punissaient les plus modestes.",
          "score": 0.5
        },
        {
          "text": "Les remplacer par des incitations (aides à l'achat, leasing), sans interdiction.",
          "score": 3
        },
        {
          "text": "Les garder, mais avec beaucoup plus d'aides et d'exceptions pour les modestes.",
          "score": 7
        },
        {
          "text": "Les rétablir et les étendre : la santé publique passe d'abord.",
          "score": 10
        },
        {
          "text": "Les garder dans leur version allégée (Paris, Lyon…) avec de vraies aides aux modestes.",
          "score": 5
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 56,
      "theme": "europe",
      "question": "L'Union européenne : alliée indispensable ou carcan ?",
      "explanation": "L'<strong>Union européenne</strong> (UE) regroupe <strong>27 pays</strong> qui coopèrent sur l'économie, les lois, les frontières et bien d'autres domaines, avec un marché commun et, pour la plupart, une monnaie unique. La France en est un membre fondateur. Le débat porte sur la place que la France doit y tenir. Pour un camp, l'UE est une <strong>alliée indispensable</strong> : seule, la France pèserait peu face aux États-Unis ou à la Chine, et l'Europe apporte paix, marché et poids diplomatique. Pour un autre camp, l'UE serait un <strong>carcan</strong> : ses règles et sa bureaucratie limiteraient la souveraineté nationale (budget, immigration, normes), et il faudrait reprendre le contrôle ou renégocier les traités.",
      "options": [
        {
          "text": "Une contrainte imposée. La France doit récupérer sa pleine souveraineté (Frexit).",
          "score": 0
        },
        {
          "text": "Un projet utile mais trop éloigné des peuples. À réformer profondément.",
          "score": 3
        },
        {
          "text": "Un projet positif avec des défauts. Améliorer de l'intérieur.",
          "score": 7
        },
        {
          "text": "Notre avenir. Il faut plus d'intégration et de solidarité européenne.",
          "score": 10
        },
        {
          "text": "Utile, à réformer sérieusement (moins de normes, plus de contrôle démocratique) sans en sortir.",
          "score": 5
        }
      ]
    },
    {
      "id": 57,
      "theme": "europe",
      "question": "L'euro : faut-il en sortir ou le renforcer ?",
      "explanation": "L'<strong>euro</strong> est la monnaie commune partagée par une vingtaine de pays européens, dont la France, depuis 2002. Il facilite les échanges et les voyages, et une banque centrale indépendante (la <strong>BCE</strong>) fixe les taux d'intérêt pour toute la zone. Pour un camp, il faut le <strong>renforcer</strong> : l'euro protège la France de fortes turbulences monétaires, maintient des taux bas et donne du poids face au dollar. Pour un autre camp, il faudrait en <strong>sortir</strong> ou le réformer : une monnaie unique empêcherait la France de dévaluer pour soutenir son industrie et imposerait une politique unique à des économies très différentes. Attention : quitter l'euro serait une opération lourde et risquée, ce qui a conduit plusieurs partis critiques à y renoncer.",
      "options": [
        {
          "text": "Sortir de l'euro. La France doit retrouver sa monnaie nationale.",
          "score": 0
        },
        {
          "text": "L'euro nous contraint. Le réformer profondément ou créer une zone à deux vitesses.",
          "score": 3
        },
        {
          "text": "L'euro est imparfait mais il vaut mieux l'améliorer que l'abandonner.",
          "score": 6
        },
        {
          "text": "L'euro est un pilier de notre stabilité. Le renforcer et en faire plus.",
          "score": 10
        }
      ]
    },
    {
      "id": 58,
      "theme": "europe",
      "question": "Souveraineté numérique : faut-il résister aux GAFAM ?",
      "explanation": "La <strong>souveraineté numérique</strong>, c'est la capacité d'un pays à maîtriser ses données, ses technologies et ses outils informatiques, sans dépendre entièrement d'acteurs étrangers. Aujourd'hui, une grande partie de nos services (recherche, réseaux sociaux, cloud, smartphones) repose sur les <strong>GAFAM</strong> américains (Google, Apple, Facebook/Meta, Amazon, Microsoft). Pour un camp, il faut <strong>résister</strong> : soutenir des solutions européennes, mieux réguler ces géants et protéger les données personnelles, pour éviter une dépendance stratégique et fiscale. Pour un autre camp, ces outils sont <strong>très performants et bon marché</strong> : les contraindre ou vouloir les remplacer coûterait cher, ralentirait les entreprises et risquerait de priver les Français de services qu'ils utilisent au quotidien.",
      "options": [
        {
          "text": "Laisser faire. Ce sont des services utiles, le marché fonctionne.",
          "score": 0
        },
        {
          "text": "Mieux les taxer (taxe GAFAM) pour rééquilibrer la compétition.",
          "score": 3
        },
        {
          "text": "Les réguler strictement + investir dans des alternatives européennes.",
          "score": 7
        },
        {
          "text": "Les démanteler ou nationaliser leurs infrastructures européennes.",
          "score": 10
        },
        {
          "text": "Les taxer et appliquer strictement les règles européennes existantes (DSA/DMA).",
          "score": 5
        }
      ]
    },
    {
      "id": 59,
      "theme": "europe",
      "question": "Armée européenne : faut-il se défendre ensemble ?",
      "explanation": "Une <strong>armée européenne</strong> désignerait une capacité de défense commune aux pays de l'UE, capable d'agir sans dépendre entièrement des États-Unis. Aujourd'hui, chaque pays garde sa propre armée et la sécurité européenne repose largement sur l'<strong>OTAN</strong>, alliance dominée par les Américains. La guerre en <strong>Ukraine</strong> a relancé ce débat. Pour un camp, il faut se <strong>défendre ensemble</strong> : mutualiser moyens et industrie d'armement rendrait l'Europe plus forte et moins dépendante des choix de Washington. Pour un autre camp, une armée européenne serait <strong>illusoire ou dangereuse</strong> : les intérêts des 27 divergent, la France perdrait le contrôle de sa défense (et de sa <strong>dissuasion nucléaire</strong>), mieux vaudrait garder une armée pleinement nationale.",
      "options": [
        {
          "text": "Non. La défense reste exclusivement nationale et française.",
          "score": 0
        },
        {
          "text": "Coopération renforcée dans le cadre de l'OTAN existant.",
          "score": 3
        },
        {
          "text": "Créer une vraie capacité de défense européenne autonome.",
          "score": 7
        },
        {
          "text": "Europe fédérale avec armée commune et budget de défense partagé.",
          "score": 10
        },
        {
          "text": "Une coopération européenne renforcée, complémentaire de l'OTAN, chaque pays gardant son armée.",
          "score": 5
        }
      ]
    },
    {
      "id": 60,
      "theme": "europe",
      "question": "Ukraine : jusqu'où soutenir militairement ?",
      "explanation": "Depuis l'invasion russe de <strong>2022</strong>, l'<strong>Ukraine</strong> résiste avec l'aide militaire et financière des pays occidentaux, dont la France. Le retour de Donald Trump à la Maison-Blanche a fragilisé le soutien américain et poussé les Européens à prendre le relais (aide, garanties de sécurité, débat sur l'envoi de troupes en cas de cessez-le-feu). La question posée est : jusqu'où aller ? Pour un camp, il faut <strong>soutenir fortement</strong> l'Ukraine : laisser la Russie l'emporter menacerait la sécurité de toute l'Europe. Pour un autre, il faut être <strong>prudent</strong> : une aide trop importante coûterait cher, risquerait une escalade avec une puissance nucléaire, et il faudrait privilégier une <strong>solution négociée</strong>. Le curseur exact du soutien fait débat, y compris à l'intérieur de chaque camp.",
      "options": [
        {
          "text": "Arrêter le soutien. Ce n'est pas la guerre de la France.",
          "score": 3
        },
        {
          "text": "Soutien diplomatique et humanitaire uniquement, pas d'armes.",
          "score": 4
        },
        {
          "text": "Maintenir le soutien militaire actuel + pression diplomatique pour la paix.",
          "score": 6
        },
        {
          "text": "Renforcer massivement l'aide militaire. La démocratie se défend.",
          "score": 7
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 61,
      "theme": "europe",
      "question": "Accord UE-Mercosur (signé en 2026) : libre-échange ou protéger notre agriculture ?",
      "explanation": "Le <strong>Mercosur</strong> est un marché commun de pays d'Amérique du Sud (Brésil, Argentine, Uruguay, Paraguay). L'accord de libre-échange avec l'UE a été <strong>signé le 17 janvier 2026</strong> malgré l'opposition de la France, puis appliqué <strong>à titre provisoire depuis le 1er mai 2026</strong> ; le Parlement européen a toutefois saisi la Cour de justice de l'UE, ce qui suspend sa ratification définitive pour 12 à 18 mois. Il supprime la plupart des droits de douane : l'Europe exporterait plus de voitures et de machines, l'Amérique du Sud plus de <strong>viande</strong>, soja et céréales. Pour un camp, ce <strong>libre-échange</strong> ouvre des débouchés à l'industrie et renforce l'Europe face à la Chine et aux droits de douane américains. Pour un autre, il faut <strong>protéger notre agriculture</strong> : des produits soumis à des normes moins strictes (pesticides, élevage) créent une <strong>concurrence déloyale</strong> et aggravent la déforestation.",
      "options": [
        {
          "text": "Le signer. Le libre-échange crée de la richesse pour tout le monde.",
          "score": 2
        },
        {
          "text": "Le renégocier avec des 'clauses miroir' : mêmes normes pour les produits importés.",
          "score": 4
        },
        {
          "text": "S'y opposer fermement. Nos agriculteurs ne peuvent pas concurrencer ça.",
          "score": 7
        },
        {
          "text": "Sortir de tous les accords de libre-échange. Relocaliser l'économie.",
          "score": 9
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 62,
      "theme": "europe",
      "question": "Relations avec la Chine et les États-Unis : quelle indépendance ?",
      "explanation": "La <strong>Chine</strong> et les <strong>États-Unis</strong> sont les deux premières puissances mondiales, et la France dépend d'elles pour beaucoup de produits (technologies, médicaments, matières premières) et pour sa sécurité. La question est de savoir quelle <strong>indépendance</strong> la France peut viser entre ces géants. Pour un camp, il faut chercher une <strong>autonomie stratégique</strong> : ne pas se ranger automatiquement derrière Washington, diversifier nos partenaires et relocaliser des productions clés pour ne pas subir les rapports de force. Pour un autre camp, la France doit <strong>s'appuyer sur ses alliés</strong> occidentaux, notamment les États-Unis, face à une Chine autoritaire et à la Russie ; vouloir jouer seule serait irréaliste pour un pays de la taille de la France.",
      "options": [
        {
          "text": "S'aligner clairement sur les USA. Ce sont nos alliés naturels.",
          "score": 3.5
        },
        {
          "text": "Alliance atlantique mais avec plus d'autonomie stratégique française.",
          "score": 4.5
        },
        {
          "text": "Indépendance maximale. Une troisième voie européenne ni pro-USA ni pro-Chine.",
          "score": 7
        },
        {
          "text": "Pragmatisme total. Alliances flexibles selon les intérêts du moment.",
          "score": 5.5
        }
      ]
    },
    {
      "id": 63,
      "theme": "europe",
      "question": "Aide au développement (~0,7% du PIB) : réduire ou augmenter ?",
      "explanation": "L'<strong>aide au développement</strong> est l'argent qu'un pays riche verse à des pays plus pauvres pour financer santé, éducation, eau, agriculture ou lutte contre la pauvreté. Les Nations unies fixent une cible de <strong>0,7 % du PIB</strong> (la richesse nationale) ; la France s'en approche sans l'atteindre, autour de <strong>0,5 %</strong>. Pour un camp, il faut <strong>augmenter</strong> cette aide : elle réduit misère et instabilité, limite les causes de l'immigration et renforce l'influence de la France dans le monde. Pour un autre camp, il faut la <strong>réduire</strong> ou la conditionner : l'argent serait plus utile chez nous vu l'état des finances publiques, et cette aide serait parfois mal employée ou peu efficace.",
      "options": [
        {
          "text": "La réduire. Priorité absolue aux Français en difficulté.",
          "score": 0
        },
        {
          "text": "La maintenir mais mieux la cibler pour éviter les gaspillages.",
          "score": 4
        },
        {
          "text": "L'augmenter. La pauvreté mondiale nous concerne directement.",
          "score": 8
        },
        {
          "text": "Rembourser la dette historique des pays colonisés.",
          "score": 10
        }
      ]
    },
    {
      "id": 64,
      "theme": "europe",
      "question": "OTAN : rester dans l'Alliance ou s'en émanciper ?",
      "explanation": "L'<strong>OTAN</strong> est une alliance militaire fondée en 1949, regroupant les États-Unis, le Canada et de nombreux pays européens dont la France. Son principe clé : si un membre est attaqué, les autres doivent le défendre. Elle est fortement pilotée par les <strong>États-Unis</strong>. Pour un camp, il faut <strong>y rester</strong> : l'OTAN garantit la sécurité de l'Europe face à la Russie, et la quitter isolerait dangereusement la France. Pour un autre camp, il faut s'en <strong>émanciper</strong> (comme la France l'a été de 1966 à 2009) : cette alliance nous alignerait trop sur Washington et pourrait nous entraîner dans des conflits qui ne sont pas les nôtres, la France disposant de sa propre <strong>dissuasion nucléaire</strong>.",
      "options": [
        {
          "text": "Quitter l'OTAN. La France doit être militairement indépendante.",
          "score": 2
        },
        {
          "text": "Rester mais renégocier plus d'autonomie et moins de dépendance aux USA.",
          "score": 5
        },
        {
          "text": "Renforcer notre participation. L'OTAN protège l'Europe dans un monde dangereux.",
          "score": 6
        },
        {
          "text": "Transformer l'OTAN en alliance purement européenne, sans les USA.",
          "score": 7
        }
      ]
    },
    {
      "id": 108,
      "theme": "europe",
      "w": 3,
      "question": "Réarmement : porter le budget militaire à 3 %, voire 3,5 % du PIB ?",
      "explanation": "Face à la Russie et au désengagement américain, l'<strong>OTAN</strong> a fixé en 2025 un objectif de <strong>3,5 % du PIB</strong> de dépenses militaires (5 % avec la sécurité au sens large) d'ici 2035. La France est à environ <strong>2 %</strong> (loi de programmation militaire 2024-2030, ~50 milliards par an) et Emmanuel Macron a annoncé une accélération. Édouard Philippe, Raphaël Glucksmann et la droite visent 3 % (Glucksmann propose un emprunt européen de 500 milliards pour la défense) ; le RN veut réarmer mais « en national » ; LFI et une partie de la gauche s'opposent à une course aux armements au détriment du social et dénoncent l'alignement sur l'OTAN. La question : quel effort, financé comment (dette, coupes ailleurs, emprunt européen) ?",
      "options": [
        {
          "text": "Oui, 3,5 % voire plus, quitte à couper dans d'autres dépenses.",
          "score": 1.5
        },
        {
          "text": "Oui, 3 % progressivement, en partie financé par un emprunt européen commun.",
          "score": 4
        },
        {
          "text": "Un effort limité : prioriser la dissuasion nucléaire et l'industrie nationale.",
          "score": 5.5
        },
        {
          "text": "Non : rester autour de 2 % et miser sur la diplomatie.",
          "score": 7.5
        },
        {
          "text": "Non, réduire les dépenses militaires et sortir de la logique de blocs.",
          "score": 10
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 109,
      "theme": "europe",
      "w": 1,
      "question": "Palestine : la France a reconnu l'État de Palestine (septembre 2025). Bonne décision ?",
      "explanation": "Le <strong>22 septembre 2025</strong>, à l'ONU, Emmanuel Macron a officiellement <strong>reconnu l'État de Palestine</strong>, suivi par plusieurs pays occidentaux, dans le contexte de la guerre à Gaza déclenchée par les attaques du 7 octobre 2023 et de son bilan humanitaire très lourd. Pour ses partisans (gauche, une partie du centre, Dominique de Villepin), c'est le seul chemin vers une <strong>solution à deux États</strong> et un message de justice. Pour ses opposants (RN, Reconquête, une partie de la droite), c'est une <strong>récompense au Hamas</strong> tant que les otages ne sont pas tous libérés et qu'aucun accord de paix n'existe, et un geste qui fragilise la relation avec Israël. Au-delà, la question touche à la place de la France au Moyen-Orient et à sa <strong>diplomatie indépendante</strong>.",
      "options": [
        {
          "text": "Non : la sécurité d'Israël et la libération des otages passent avant tout.",
          "score": 2
        },
        {
          "text": "Prématuré : il fallait d'abord un accord de paix et le désarmement du Hamas.",
          "score": 4
        },
        {
          "text": "Oui, une décision juste et conforme à la position historique de la France.",
          "score": 7
        },
        {
          "text": "Oui, et aller plus loin : sanctions contre la colonisation et l'armée israélienne.",
          "score": 9.5
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 65,
      "theme": "institutions",
      "question": "Faut-il une VIe République ?",
      "explanation": "La France vit sous la <strong>Ve République</strong> depuis 1958, un régime où le <strong>président</strong> dispose de larges pouvoirs. Passer à une <strong>VIe République</strong> signifierait réécrire la Constitution pour changer en profondeur le fonctionnement des institutions. Pour un camp, c'est nécessaire : le pouvoir serait trop concentré entre les mains du président, et il faudrait <strong>renforcer le Parlement</strong>, la proportionnelle et la participation citoyenne pour une démocratie plus équilibrée. Pour un autre camp, la Ve République assure la <strong>stabilité</strong> et permet de décider vite ; tout bouleverser risquerait de créer de l'instabilité, comme sous les républiques précédentes, et les vrais problèmes seraient économiques et sociaux, pas institutionnels.",
      "options": [
        {
          "text": "La Ve fonctionne bien. Pas besoin de la changer.",
          "score": 1
        },
        {
          "text": "Quelques ajustements constitutionnels, mais garder le cadre général.",
          "score": 3
        },
        {
          "text": "Réforme constitutionnelle profonde pour rééquilibrer les pouvoirs.",
          "score": 7
        },
        {
          "text": "Tout changer : VIe République et assemblée constituante citoyenne élue.",
          "score": 10
        },
        {
          "text": "Garder la Ve République avec quelques réformes ciblées (proportionnelle, référendum).",
          "score": 5
        }
      ]
    },
    {
      "id": 66,
      "theme": "institutions",
      "question": "Proportionnelle : faut-il changer notre mode de scrutin ?",
      "explanation": "Le <strong>mode de scrutin</strong> détermine comment les votes se transforment en sièges de députés. Aujourd'hui, les législatives se font au scrutin <strong>majoritaire</strong> à deux tours : dans chaque circonscription, celui qui l'emporte prend le siège. La <strong>proportionnelle</strong> répartirait les sièges selon le score national de chaque parti. Depuis la dissolution de 2024 et l'Assemblée sans majorité (trois blocs, gouvernements Barnier, Bayrou puis Lecornu renversés ou fragiles), le débat a rebondi : l'Assemblée a voté en février 2026 une résolution demandant une réforme, et plusieurs candidats (RN, LFI, écologistes, une partie du centre) la promettent. Pour un camp, la proportionnelle est plus <strong>juste</strong> et représente toutes les sensibilités. Pour un autre, le scrutin majoritaire garantit des <strong>majorités stables</strong>, alors que la proportionnelle fragmenterait encore plus l'Assemblée. Des systèmes <strong>mixtes</strong> (dose de proportionnelle, modèle allemand) sont aussi proposés.",
      "options": [
        {
          "text": "Non. Le scrutin majoritaire donne des majorités stables pour gouverner.",
          "score": 1
        },
        {
          "text": "Une dose de proportionnelle (~20%) pour mieux représenter les petits partis.",
          "score": 4
        },
        {
          "text": "Proportionnelle intégrale. Chaque vote doit vraiment compter.",
          "score": 8
        },
        {
          "text": "Réforme complète avec des garde-fous pour éviter l'instabilité.",
          "score": 6
        }
      ],
      "updated": "2026-08"
    },
    {
      "id": 67,
      "theme": "institutions",
      "question": "Référendum : les Français doivent-ils voter directement sur les lois ?",
      "explanation": "Le <strong>référendum</strong> permet aux citoyens de voter directement oui ou non sur une question, au lieu de laisser décider les seuls élus. Le <strong>RIC</strong> (Référendum d'Initiative Citoyenne) irait plus loin : les citoyens pourraient eux-mêmes déclencher un vote pour proposer, abroger une loi ou révoquer un élu, s'ils réunissent assez de signatures. Réclamé notamment par les Gilets jaunes, il divise. Pour un camp, c'est un progrès <strong>démocratique</strong> : il rendrait le pouvoir au peuple et réduirait le sentiment de ne pas être écouté. Pour un autre camp, c'est <strong>risqué</strong> : des questions complexes seraient tranchées par oui/non, on pourrait voter sous le coup de l'émotion ou remettre en cause des droits fondamentaux, d'où la nécessité d'encadrer strictement l'outil.",
      "options": [
        {
          "text": "Rarement. Les élus sont élus pour décider. Le référendum est trop dangereux.",
          "score": 1
        },
        {
          "text": "Pour les grandes réformes constitutionnelles uniquement.",
          "score": 4
        },
        {
          "text": "Plus souvent. Le peuple doit avoir son mot à dire sur les grandes décisions.",
          "score": 7
        },
        {
          "text": "RIC total. Les citoyens peuvent proposer et voter sur n'importe quelle loi.",
          "score": 10
        }
      ]
    },
    {
      "id": 68,
      "theme": "institutions",
      "question": "Décentralisation : Paris doit-il tout décider ?",
      "explanation": "La <strong>décentralisation</strong> consiste à transférer des pouvoirs et des budgets de l'État central (Paris) vers les collectivités locales : régions, départements, communes. La France a une longue tradition <strong>centralisée</strong>, où beaucoup de décisions se prennent à Paris. Pour un camp, il faut décentraliser davantage : les élus locaux connaissent mieux les besoins du terrain (transports, écoles, santé), et cela rapprocherait la décision des citoyens. Pour un autre camp, il faut préserver un État fort pour garantir l'<strong>égalité entre les territoires</strong> : trop de décentralisation créerait des différences de traitement selon les régions et compliquerait l'action publique. Le débat porte aussi sur les <strong>moyens financiers</strong> réellement donnés aux collectivités.",
      "options": [
        {
          "text": "Maintenir la centralisation. L'unité de la République avant tout.",
          "score": 3
        },
        {
          "text": "Déléguer certaines compétences (formation, transports, santé) aux régions.",
          "score": 4.5
        },
        {
          "text": "Fort mouvement de décentralisation avec des budgets importants aux régions.",
          "score": 6
        },
        {
          "text": "Fédéralisme : les régions gèrent leur propre politique fiscale et sociale.",
          "score": 7
        }
      ]
    },
    {
      "id": 69,
      "theme": "institutions",
      "question": "Lobbies et conflits d'intérêts : les liens entre politique et business",
      "explanation": "Un <strong>lobby</strong> est un groupe (entreprise, secteur, association) qui cherche à influencer les décisions politiques dans son intérêt. Il y a <strong>conflit d'intérêts</strong> quand un responsable public a des liens personnels ou financiers avec ceux que ses décisions concernent. Le débat porte sur la transparence des relations entre <strong>politique et business</strong>. Pour un camp, il faut des règles bien plus strictes : encadrer le lobbying, éviter les <strong>allers-retours</strong> entre haute administration et grandes entreprises (le « pantouflage »), pour préserver la confiance et l'intérêt général. Pour un autre camp, le dialogue avec les acteurs économiques est <strong>normal et utile</strong> pour éclairer les décisions ; l'essentiel serait la transparence, pas l'interdiction, sous peine d'alourdir inutilement la vie publique.",
      "options": [
        {
          "text": "C'est normal. L'expertise du privé enrichit les décisions politiques.",
          "score": 0
        },
        {
          "text": "Mieux encadrer les conflits d'intérêts sans tout interdire.",
          "score": 4
        },
        {
          "text": "Loi anti-corruption forte, registre obligatoire, sanctions réelles.",
          "score": 7
        },
        {
          "text": "Interdiction totale du pantouflage et des lobbies dans les institutions.",
          "score": 10
        }
      ]
    },
    {
      "id": 70,
      "theme": "institutions",
      "question": "Vote obligatoire : comment lutter contre l'abstention massive ?",
      "explanation": "L'<strong>abstention</strong> désigne le fait de ne pas aller voter. Elle atteint des niveaux très élevés en France, surtout aux législatives et aux élections locales, ce qui pose la question de la légitimité des élus. Le <strong>vote obligatoire</strong>, en vigueur dans des pays comme la Belgique, obligerait chaque citoyen à se rendre aux urnes, sous peine d'amende. Pour un camp, il ferait remonter la participation et forcerait chacun à s'intéresser à la vie démocratique. Pour un autre camp, voter est une <strong>liberté</strong>, pas un devoir imposé : contraindre les gens ne réglerait pas les causes du désintérêt et gonflerait les votes blancs ou aléatoires. D'autres pistes existent, comme reconnaître le <strong>vote blanc</strong> ou faciliter le vote (procuration, vote par correspondance).",
      "options": [
        {
          "text": "Non. Voter est un droit, pas une obligation. La liberté inclut l'abstention.",
          "score": 4
        },
        {
          "text": "Obligation symbolique sans sanction pour responsabiliser les citoyens.",
          "score": 5
        },
        {
          "text": "Vote obligatoire avec une petite amende, comme en Belgique.",
          "score": 6
        },
        {
          "text": "Vote obligatoire + case 'vote blanc' officielle qui compte dans les résultats.",
          "score": 6.5
        }
      ]
    },
    {
      "id": 71,
      "theme": "institutions",
      "question": "Indépendance de la justice : les juges doivent-ils être totalement libres ?",
      "explanation": "L'<strong>indépendance de la justice</strong> signifie que les juges peuvent décider librement, sans subir de pressions du pouvoir politique. En France, ce principe est en partie limité pour les <strong>procureurs</strong> (magistrats qui décident des poursuites), rattachés au ministère de la Justice, ce qui nourrit un débat récurrent. Pour un camp, les juges doivent être <strong>totalement libres</strong> : c'est la garantie que tous, y compris les puissants, soient jugés équitablement, sans interférence du gouvernement. Pour un autre camp, une justice sans aucun contre-pouvoir pourrait devenir un <strong>gouvernement des juges</strong> non élus, imposant leurs choix aux représentants du peuple ; il faudrait donc maintenir un certain contrôle démocratique. L'équilibre entre indépendance et responsabilité est au cœur du débat.",
      "options": [
        {
          "text": "Le parquet sous autorité du gouvernement pour une politique pénale cohérente.",
          "score": 1
        },
        {
          "text": "Plus d'indépendance du parquet en gardant une politique pénale nationale.",
          "score": 4
        },
        {
          "text": "Indépendance totale de la justice vis-à-vis de tout pouvoir politique.",
          "score": 8
        },
        {
          "text": "Réforme profonde : justice participative avec plus de jurés citoyens.",
          "score": 10
        }
      ]
    },
    {
      "id": 72,
      "theme": "institutions",
      "question": "Sénat : utile ou chambre des notables à supprimer ?",
      "explanation": "Le <strong>Sénat</strong> est la deuxième chambre du Parlement, à côté de l'Assemblée nationale. Ses membres, les sénateurs, ne sont pas élus directement par les citoyens mais par de grands électeurs, surtout des <strong>élus locaux</strong> (maires, conseillers). Le Sénat examine les lois et représente les territoires. Pour un camp, il est <strong>utile</strong> : il apporte du recul, améliore les lois par une double lecture et défend les communes rurales face au pouvoir central. Pour un autre camp, ce serait une <strong>chambre des notables</strong> coûteuse et peu démocratique, élue indirectement et souvent conservatrice, qu'on pourrait supprimer ou remplacer par une assemblée aux missions différentes. En cas de désaccord persistant, c'est de toute façon l'Assemblée qui a le dernier mot.",
      "options": [
        {
          "text": "Le maintenir tel quel. Il apporte sagesse et pondération.",
          "score": 1
        },
        {
          "text": "Le réformer pour le rendre plus représentatif des citoyens.",
          "score": 5
        },
        {
          "text": "Lui retirer son pouvoir de blocage définitif des lois.",
          "score": 7
        },
        {
          "text": "Le supprimer. Une seule chambre élue au suffrage universel suffit.",
          "score": 10
        }
      ]
    },
    {
      "id": 73,
      "theme": "institutions",
      "question": "Cumul des mandats et mandats successifs",
      "explanation": "Le <strong>cumul des mandats</strong>, c'est le fait d'exercer plusieurs fonctions électives en même temps (par exemple député et maire). Une loi de 2014 l'a fortement limité en France. Se pose aussi la question des <strong>mandats successifs</strong> : peut-on rester élu au même poste pendant des décennies ? Pour un camp, il faut <strong>limiter</strong> cumul et durée : cela évite la concentration des pouvoirs, la <strong>professionnalisation</strong> de la politique et permet le renouvellement des élus. Pour un autre camp, cumuler un mandat local aide un parlementaire à rester <strong>ancré dans le terrain</strong>, et empêcher un élu compétent de se représenter priverait les citoyens de leur choix ; l'<strong>expérience</strong> serait aussi un atout pour gouverner.",
      "options": [
        {
          "text": "Autoriser le cumul. L'expérience locale enrichit le mandat national.",
          "score": 3.5
        },
        {
          "text": "Maintenir les règles actuelles sans aller plus loin.",
          "score": 4.5
        },
        {
          "text": "Interdire tout cumul, même partiel.",
          "score": 6
        },
        {
          "text": "Limiter aussi les mandats successifs. Pas plus de 2 fois le même poste.",
          "score": 6.5
        }
      ]
    },
    {
      "id": 74,
      "theme": "institutions",
      "question": "Financement des partis politiques : qui doit payer ?",
      "explanation": "Le <strong>financement des partis politiques</strong> désigne l'argent qui leur permet de fonctionner et de faire campagne. En France, il vient surtout de <strong>fonds publics</strong> (versés selon les résultats aux élections), des <strong>cotisations</strong> des adhérents et des <strong>dons de particuliers</strong> (plafonnés) ; les dons d'entreprises sont interdits depuis 1995. Pour un camp, le financement <strong>public</strong> est essentiel : il garantit l'égalité entre partis et évite qu'ils dépendent de <strong>gros donateurs</strong> ou d'intérêts privés. Pour un autre camp, cela coûterait cher au contribuable et figerait les partis en place ; il faudrait réduire cet argent public et laisser une plus grande part à l'<strong>engagement volontaire</strong> des citoyens. Le débat porte aussi sur la <strong>transparence</strong> et le contrôle des comptes.",
      "options": [
        {
          "text": "Supprimer le financement public. Les partis se financent seuls.",
          "score": 1
        },
        {
          "text": "Le maintenir mais le plafonner et le conditionner à une activité réelle.",
          "score": 4
        },
        {
          "text": "L'augmenter pour réduire l'influence des grandes fortunes privées.",
          "score": 8
        },
        {
          "text": "Interdire les dons privés. Uniquement du financement public transparent.",
          "score": 10
        }
      ]
    },
    {
      "id": 110,
      "theme": "institutions",
      "w": 2,
      "question": "Après le blocage 2024-2026 : un exécutif qui réforme par référendums et ordonnances, ou plus de pouvoir au Parlement ?",
      "explanation": "Depuis la dissolution de 2024, l'Assemblée est sans majorité et la France a connu <strong>quatre gouvernements</strong> (Barnier, Bayrou, Lecornu I et II), des budgets adoptés au forceps et des motions de censure à répétition. Deux réponses s'affrontent. La première : <strong>renforcer l'exécutif</strong> — Édouard Philippe promet de dissoudre l'Assemblée dès son élection et de lancer trois <strong>référendums</strong> (retraites, règle d'or, ordonnances pour réformer santé, école, justice) ; le RN et la droite veulent gouverner par référendum sur l'immigration. La seconde : <strong>redonner du pouvoir au Parlement</strong> — proportionnelle, culture de coalition à l'allemande, voire régime parlementaire ou VIe République (LFI, écologistes). Entre les deux, beaucoup veulent garder la Ve République en misant sur une majorité claire sortie des urnes.",
      "options": [
        {
          "text": "Un exécutif fort : référendums et ordonnances pour réformer vite malgré le Parlement.",
          "score": 1.5
        },
        {
          "text": "Garder la Ve République telle quelle et chercher une majorité claire dans les urnes.",
          "score": 3.5
        },
        {
          "text": "Rééquilibrer vers le Parlement : proportionnelle et coalitions négociées.",
          "score": 6.5
        },
        {
          "text": "Changer de régime : Parlement au centre, VIe République.",
          "score": 9
        },
        {
          "text": "Garder la Ve, mais avec une dose de proportionnelle et une vraie culture de compromis.",
          "score": 5
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 75,
      "theme": "societal",
      "question": "Mariage pour tous : une erreur ou une avancée normale ?",
      "explanation": "Le <strong>mariage pour tous</strong>, autorisé par la <strong>loi Taubira de 2013</strong>, permet à deux personnes de même sexe de se marier et d'adopter. Avant cette loi, seuls un homme et une femme pouvaient se marier civilement en France. Aujourd'hui, plusieurs milliers de mariages entre personnes de même sexe sont célébrés chaque année et le sujet est largement accepté dans l'opinion. Les <strong>partisans</strong> y voient une avancée d'égalité : les couples homosexuels obtiennent les mêmes droits que les autres (héritage, filiation, protection). Les <strong>opposants</strong>, souvent au nom de convictions religieuses ou d'une certaine idée de la famille, estiment que le mariage devait rester lié à un père et une mère, notamment pour l'enfant. Le débat porte donc surtout sur la définition de la famille et sur l'intérêt de l'enfant.",
      "options": [
        {
          "text": "Une erreur. Le mariage doit rester entre un homme et une femme.",
          "score": 0
        },
        {
          "text": "Acceptable, mais il ne fallait pas appeler ça 'mariage'.",
          "score": 2
        },
        {
          "text": "Une avancée normale. Les couples homosexuels méritent les mêmes droits.",
          "score": 7
        },
        {
          "text": "Une victoire. Il faut continuer à progresser sur les droits LGBTQ+.",
          "score": 10
        },
        {
          "text": "Une avancée qui est aujourd'hui acquise ; pas besoin d'aller plus loin ni de revenir en arrière.",
          "score": 5
        }
      ]
    },
    {
      "id": 76,
      "theme": "societal",
      "question": "PMA pour toutes : une avancée ou une erreur ?",
      "explanation": "La <strong>PMA</strong> (procréation médicalement assistée) regroupe les techniques médicales pour avoir un enfant, comme l'insémination ou la fécondation in vitro. La <strong>loi bioéthique de 2021</strong> l'a ouverte à toutes les femmes : couples de femmes et femmes seules, et non plus seulement aux couples hétérosexuels infertiles. Elle est désormais remboursée par la Sécurité sociale dans ce cadre. Les <strong>partisans</strong> défendent l'égalité d'accès à la parentalité et rappellent que ces enfants sont désirés et encadrés médicalement. Les <strong>opposants</strong> s'inquiètent de l'absence volontaire de père et estiment que la société organise ainsi des familles sans figure paternelle. En arrière-plan se pose aussi la question de la <strong>GPA</strong> (mères porteuses), elle, toujours interdite en France, que certains redoutent comme prochaine étape.",
      "options": [
        {
          "text": "Une erreur. La PMA doit rester réservée aux couples hétérosexuels infertiles.",
          "score": 0
        },
        {
          "text": "Acceptable pour les couples de femmes et les femmes seules, mais sans aller plus loin.",
          "score": 3
        },
        {
          "text": "Une avancée normale. Chaque femme doit pouvoir choisir.",
          "score": 7
        },
        {
          "text": "Il faut aller plus loin et légaliser la GPA (gestation pour autrui) encadrée.",
          "score": 10
        },
        {
          "text": "Une avancée acquise ; en revanche, pas de GPA.",
          "score": 5
        }
      ]
    },
    {
      "id": 77,
      "theme": "societal",
      "question": "Laïcité à l'école : jusqu'où interdire les signes religieux ?",
      "explanation": "La <strong>laïcité</strong> à l'école repose sur l'idée que l'école publique doit rester neutre en matière de religion. La <strong>loi de 2004</strong> interdit aux élèves les signes religieux ostensibles (voile, grande croix, kippa) ; en 2023, l'<strong>abaya</strong> (robe longue) a aussi été interdite. Les enseignants, eux, sont soumis à une neutralité stricte. Les <strong>partisans</strong> d'une ligne ferme y voient une protection : mettre tous les élèves à égalité, à l'abri des pressions religieuses et des tensions communautaires. Les <strong>opposants</strong> estiment que multiplier les interdits vise surtout les musulmans, stigmatise certaines familles et transforme la laïcité en outil de contrôle vestimentaire. Le débat oppose donc une laïcité de <strong>neutralité</strong> à une laïcité perçue comme trop <strong>restrictive</strong>.",
      "options": [
        {
          "text": "Étendre cette interdiction à tous les espaces publics.",
          "score": 0
        },
        {
          "text": "Maintenir la loi de 2004. Elle est bien calibrée.",
          "score": 3
        },
        {
          "text": "L'assouplir pour les lycéens. Ils sont assez grands pour choisir.",
          "score": 7
        },
        {
          "text": "Abroger cette loi. C'est une atteinte à la liberté de conscience.",
          "score": 10
        },
        {
          "text": "Maintenir la loi de 2004 et l'appliquer avec discernement, sans l'étendre ni l'abroger.",
          "score": 5
        }
      ]
    },
    {
      "id": 78,
      "theme": "societal",
      "question": "Identité nationale : qu'est-ce qui fait qu'on est vraiment français ?",
      "explanation": "L'<strong>identité nationale</strong> désigne ce qui définirait le fait d'être français : la nationalité juridique, mais aussi la langue, l'histoire, les valeurs ou la culture partagées. La France a une longue tradition d'<strong>assimilation</strong>, où l'on devient français en adhérant à des principes communs (République, laïcité, langue). Pour les <strong>tenants</strong> d'une vision exigeante, l'identité repose sur un socle culturel et historique à préserver, et l'immigration doit s'y intégrer clairement. Pour d'autres, être français est avant tout <strong>civique</strong> : cela tient au respect des lois et à l'attachement aux valeurs, quelles que soient les origines. Le débat oppose ainsi une identité vue comme un <strong>héritage</strong> à protéger et une identité vue comme un <strong>projet</strong> ouvert et pluriel.",
      "options": [
        {
          "text": "Partager une culture, une langue et une histoire communes — un héritage civilisationnel.",
          "score": 0
        },
        {
          "text": "Respecter les lois, parler français et adhérer aux valeurs républicaines laïques.",
          "score": 3
        },
        {
          "text": "Avoir la nationalité et vouloir vivre ensemble. Peu importe l'origine.",
          "score": 6
        },
        {
          "text": "Une identité plurielle et évolutive. La France s'est toujours enrichie de ses apports extérieurs.",
          "score": 10
        }
      ]
    },
    {
      "id": 79,
      "theme": "societal",
      "question": "Féminisme : allié nécessaire ou trop radical ?",
      "explanation": "Le <strong>féminisme</strong> désigne les mouvements qui défendent l'égalité entre femmes et hommes. Il a obtenu des avancées majeures (droit de vote en 1944, contraception, avortement, lois sur l'égalité salariale). Aujourd'hui, des écarts persistent : les femmes gagnent en moyenne nettement moins que les hommes et les violences conjugales restent nombreuses. Les <strong>partisans</strong> jugent le combat encore nécessaire face à ces inégalités et aux violences révélées par des mouvements comme #MeToo. Les <strong>critiques</strong> ne rejettent pas l'égalité mais reprochent à certaines franges d'être trop <strong>radicales</strong>, de généraliser en accusant tous les hommes ou de verser dans une police du langage. Le débat porte donc moins sur le principe d'égalité, largement partagé, que sur les <strong>méthodes</strong> et le ton de certains courants.",
      "options": [
        {
          "text": "Va trop loin. Le féminisme radical est contre-productif.",
          "score": 0
        },
        {
          "text": "Légitime sur les inégalités réelles, mais certains excès sont problématiques.",
          "score": 3
        },
        {
          "text": "Nécessaire. Les inégalités femmes-hommes sont encore très fortes.",
          "score": 7
        },
        {
          "text": "Fondamental. L'égalité totale est loin d'être atteinte.",
          "score": 10
        },
        {
          "text": "Nécessaire, avec des désaccords sur certaines méthodes.",
          "score": 5
        }
      ]
    },
    {
      "id": 80,
      "theme": "societal",
      "question": "Racisme et discriminations : problème systémique ou exceptions individuelles ?",
      "explanation": "Le <strong>racisme systémique</strong> désigne l'idée que les discriminations ne viennent pas seulement de personnes mal intentionnées, mais aussi de mécanismes ancrés dans la société : accès à l'emploi, au logement, contrôles de police plus fréquents selon l'origine. Des études (testings) montrent qu'à CV égal, un candidat au nom d'origine étrangère est souvent moins rappelé. Les <strong>tenants</strong> de cette approche estiment qu'il faut agir sur les structures (recrutement, justice, statistiques) et pas seulement punir des individus. Les <strong>opposants</strong> refusent le terme systémique, jugeant qu'il accuse toute la société et la République elle-même ; pour eux, il s'agit de <strong>comportements individuels</strong> condamnables mais isolés, déjà punis par la loi. Le débat oppose donc une lecture <strong>collective</strong> et une lecture <strong>individuelle</strong> des discriminations.",
      "options": [
        {
          "text": "Exagérées. La République traite tous les citoyens de façon égale.",
          "score": 0
        },
        {
          "text": "Réelles individuellement mais pas systémiques. Les lois existantes suffisent.",
          "score": 3
        },
        {
          "text": "Réelles et systémiques. Des politiques ciblées sont nécessaires.",
          "score": 7
        },
        {
          "text": "Systémiques et raciales. Il faut une approche antiraciste explicite dans toutes les politiques.",
          "score": 10
        },
        {
          "text": "Des discriminations réelles à combattre par le droit existant mieux appliqué (testing, sanctions).",
          "score": 5
        }
      ]
    },
    {
      "id": 81,
      "theme": "societal",
      "question": "Liberté d'expression : la France censure-t-elle trop ?",
      "explanation": "La <strong>liberté d'expression</strong> permet de dire, écrire et publier ses opinions, y compris critiques ou dérangeantes. En France elle est encadrée : sont interdits l'injure, la diffamation, l'incitation à la haine ou l'apologie du terrorisme. Le pays est aussi attaché au droit de <strong>caricature</strong>, illustré par le journal Charlie Hebdo. Ceux qui trouvent que la France <strong>censure trop</strong> dénoncent des poursuites, une pression des réseaux sociaux ou une « cancel culture » qui pousserait à l'autocensure sur des sujets sensibles. À l'inverse, d'autres estiment que ces limites sont <strong>nécessaires</strong> pour protéger les personnes et éviter que la haine ou les fausses informations ne se répandent librement. Le débat porte sur le juste équilibre entre <strong>liberté</strong> de dire et <strong>protection</strong> contre les abus.",
      "options": [
        {
          "text": "Ces lois brident trop la liberté d'expression. Il faut les assouplir.",
          "score": 0
        },
        {
          "text": "Elles sont bien calibrées. Pas trop de censure, pas trop de tolérance.",
          "score": 4
        },
        {
          "text": "Il faudrait renforcer les lois contre les discours de haine, surtout en ligne.",
          "score": 7
        },
        {
          "text": "Lutter radicalement contre tous les discours qui discriminent ou déshumanisent.",
          "score": 10
        }
      ]
    },
    {
      "id": 82,
      "theme": "societal",
      "question": "Droits des personnes trans : où fixer les limites ?",
      "explanation": "Les <strong>personnes trans</strong> sont celles dont l'identité de genre ne correspond pas au sexe indiqué à leur naissance. Les débats portent sur plusieurs points concrets : le changement d'état civil, l'accès aux soins (hormones, chirurgie), la situation des <strong>mineurs</strong>, et la participation aux compétitions sportives féminines. Les <strong>partisans</strong> d'une reconnaissance large insistent sur le respect, l'accès aux soins et la lutte contre les discriminations et violences que subissent ces personnes. Les <strong>prudents</strong> demandent des limites, notamment pour les mineurs (âge, accompagnement médical) et dans le sport, au nom de l'équité entre athlètes. Le sujet est récent et sensible, et les positions varient beaucoup selon qu'on met l'accent sur la <strong>liberté individuelle</strong> ou sur des <strong>garde-fous</strong> collectifs.",
      "options": [
        {
          "text": "La loi de 2017 est déjà allée trop loin. Il faudrait revenir en arrière.",
          "score": 0
        },
        {
          "text": "Maintenir la loi actuelle sans aller plus loin pour l'instant.",
          "score": 3
        },
        {
          "text": "Simplifier encore les procédures. Les personnes trans méritent respect et dignité.",
          "score": 7
        },
        {
          "text": "Pleine égalité des droits et reconnaissance légale des identités non-binaires.",
          "score": 10
        },
        {
          "text": "Maintenir la loi actuelle, en améliorant l'accueil et la protection contre les discriminations.",
          "score": 5
        }
      ]
    },
    {
      "id": 83,
      "theme": "societal",
      "question": "Colonisation : la France doit-elle s'excuser et réparer ?",
      "explanation": "La <strong>colonisation</strong> désigne la période où la France a dominé et exploité de nombreux territoires (Afrique, Asie, Antilles), avec l'esclavage puis les empires coloniaux jusqu'aux indépendances du XXe siècle, dont la guerre d'<strong>Algérie</strong> (1954-1962). Le débat porte sur la façon d'assumer ce passé : faut-il des <strong>excuses officielles</strong>, des réparations ou la restitution d'œuvres d'art ? Les <strong>partisans</strong> estiment qu'une reconnaissance claire est due aux descendants et aux anciennes colonies, pour apaiser les mémoires. Les <strong>opposants</strong> craignent une « repentance » permanente, jugent injuste de faire porter aux Français d'aujourd'hui les fautes du passé et redoutent des demandes financières sans fin. Le débat oppose ainsi un devoir de <strong>mémoire</strong> et une volonté de <strong>tourner la page</strong>.",
      "options": [
        {
          "text": "Non. La colonisation appartient à l'histoire. Pas de repentance nationale.",
          "score": 0
        },
        {
          "text": "Reconnaître les crimes sans réparations financières.",
          "score": 3
        },
        {
          "text": "Reconnaissance officielle complète + devoir de mémoire fort dans les programmes scolaires.",
          "score": 7
        },
        {
          "text": "Reconnaissance + réparations symboliques ou financières pour les pays concernés.",
          "score": 10
        },
        {
          "text": "Reconnaître clairement les faits, sans repentance ni réparations.",
          "score": 5
        }
      ]
    },
    {
      "id": 84,
      "theme": "societal",
      "question": "Religion dans l'espace public : où passe la ligne ?",
      "explanation": "La question de la <strong>religion dans l'espace public</strong> touche à ce qui est visible en dehors de chez soi : rue, administrations, entreprises, écoles. En France, la <strong>laïcité</strong> impose la neutralité de l'État et de ses agents, mais les citoyens, eux, peuvent en principe manifester leur religion. Les tensions portent sur des cas précis : port du voile en sortie scolaire, prières de rue, menus dans les cantines, signes religieux au travail. Les <strong>partisans</strong> d'une ligne stricte veulent limiter les signes religieux visibles pour préserver un espace commun neutre et l'égalité. Les <strong>opposants</strong> rappellent que la loi protège la liberté de croyance et craignent que trop d'interdits ne visent surtout l'islam. Le débat oppose une laïcité de <strong>séparation</strong> à une laïcité perçue comme <strong>d'exclusion</strong>.",
      "options": [
        {
          "text": "La religion doit rester strictement dans la sphère privée. Pas de religion visible.",
          "score": 2
        },
        {
          "text": "La laïcité actuelle est bien calibrée. Ne pas la durcir ni l'assouplir.",
          "score": 4
        },
        {
          "text": "Plus de dialogue entre laïcité et fait religieux. La religion fait partie de la société.",
          "score": 7
        },
        {
          "text": "La liberté religieuse doit primer sur la laïcité dans l'espace public.",
          "score": 10
        }
      ]
    },
    {
      "id": 111,
      "theme": "societal",
      "w": 1,
      "question": "Réseaux sociaux : les interdire aux moins de 15 ans ?",
      "explanation": "Emmanuel Macron, une large partie de la droite et du centre, mais aussi des élus de gauche, défendent une <strong>interdiction des réseaux sociaux aux moins de 15 ans</strong> (« majorité numérique »), sur le modèle de l'Australie, avec une <strong>vérification d'âge</strong> imposée aux plateformes ; la loi française de 2023 n'a jamais pu s'appliquer sans feu vert européen. Les partisans invoquent la santé mentale des adolescents, le harcèlement, l'exposition aux contenus violents ou pornographiques et les algorithmes addictifs. Les opposants doutent de la faisabilité (contournements, contrôle d'identité généralisé qui menace la vie privée de tous), estiment que l'éducation et la responsabilité des parents priment, ou préfèrent s'attaquer aux <strong>plateformes</strong> elles-mêmes (interdiction des algorithmes de recommandation pour les mineurs, amendes). Un sujet peu clivant gauche/droite.",
      "options": [
        {
          "text": "Non : c'est aux parents de décider, pas à l'État.",
          "score": 5.5
        },
        {
          "text": "Oui : majorité numérique à 15 ans avec une vérification d'âge stricte.",
          "score": 4.5
        },
        {
          "text": "Oui, et interdire aussi les smartphones au collège et les algorithmes addictifs pour les mineurs.",
          "score": 4
        },
        {
          "text": "Non aux interdictions individuelles : réguler durement les plateformes (GAFAM) elles-mêmes.",
          "score": 6.5
        }
      ],
      "updated": "2026-08",
      "isNew": true
    },
    {
      "id": 85,
      "theme": "education",
      "question": "École privée : faut-il lui couper les subventions publiques ?",
      "explanation": "En France, l'<strong>école privée</strong> est majoritairement « sous contrat » avec l'État : celui-ci paie les salaires des enseignants et verse des subventions, en échange du respect des programmes officiels. La plupart de ces établissements sont catholiques, mais ouverts à tous. Le débat rebondit régulièrement, notamment après des critiques sur le manque de <strong>mixité sociale</strong> dans certains établissements privés réputés. Les <strong>partisans</strong> de la coupe des subventions estiment que l'argent public devrait aller en priorité à l'école publique et que le privé trie parfois ses élèves. Les <strong>défenseurs</strong> du privé rappellent la <strong>liberté de choix</strong> des familles, le rôle historique de ces écoles et le fait qu'elles scolarisent près d'un élève sur cinq, allégeant la charge de l'État. Le débat oppose <strong>égalité</strong> et <strong>liberté de l'enseignement</strong>.",
      "options": [
        {
          "text": "Augmenter le financement du privé. La concurrence améliore le niveau général.",
          "score": 0
        },
        {
          "text": "Maintenir le financement actuel. Les familles ont le droit de choisir.",
          "score": 3
        },
        {
          "text": "Réduire progressivement le financement public du privé.",
          "score": 7
        },
        {
          "text": "Supprimer tout financement public à l'enseignement privé.",
          "score": 10
        },
        {
          "text": "Maintenir le financement du privé sous contrat en exigeant plus de mixité sociale en échange.",
          "score": 5
        }
      ]
    },
    {
      "id": 86,
      "theme": "education",
      "question": "Les profs sont-ils assez payés ?",
      "explanation": "La question du <strong>salaire des enseignants</strong> revient à chaque campagne. En France, un professeur débutant gagne un peu plus de 2 000 euros net par mois, un niveau jugé faible comparé à d'autres pays européens et à d'autres métiers exigeant cinq ans d'études. Des revalorisations récentes (dites « Grenelle » et « Pacte ») ont augmenté les débuts de carrière et proposé des primes contre des missions supplémentaires. Les <strong>partisans</strong> d'une hausse estiment qu'il faut mieux payer pour <strong>attirer</strong> des candidats, alors que certains concours manquent de postulants, et reconnaître un métier difficile. Les <strong>prudents</strong> rappellent le coût très élevé pour le budget de l'État (plus d'un million d'agents) et souhaitent lier les hausses à de nouvelles <strong>missions</strong> plutôt qu'une revalorisation générale. Le débat mêle attractivité, reconnaissance et finances publiques.",
      "options": [
        {
          "text": "Payés comme il faut. Le problème c'est la gestion et l'organisation.",
          "score": 1
        },
        {
          "text": "Légèrement sous-payés. Une revalorisation modeste suffirait.",
          "score": 4
        },
        {
          "text": "Très sous-payés. Une revalorisation importante est urgente.",
          "score": 7
        },
        {
          "text": "Urgence absolue : il faut doubler les salaires pour rendre le métier vraiment attractif.",
          "score": 10
        }
      ]
    },
    {
      "id": 87,
      "theme": "education",
      "question": "Fac gratuite ou payante : qui doit financer les études supérieures ?",
      "explanation": "En France, l'<strong>université publique</strong> est très peu payante : les étudiants versent des <strong>frais d'inscription</strong> de quelques centaines d'euros par an, l'État finançant l'essentiel du coût réel des études. Le débat porte sur qui doit payer : le contribuable, l'étudiant, ou les deux. Les <strong>partisans</strong> de la gratuité y voient une garantie d'égalité : un jeune modeste peut faire de longues études sans s'endetter, contrairement aux pays où les frais sont élevés. Les <strong>partisans</strong> de frais plus élevés (surtout pour les familles aisées ou les étrangers hors Europe) estiment que cela donnerait plus de moyens aux facs, souvent sous-financées, et responsabiliserait les étudiants. Le débat oppose une vision de l'éducation comme <strong>bien commun</strong> gratuit et une logique de <strong>participation</strong> au coût selon les moyens.",
      "options": [
        {
          "text": "Augmenter fortement les frais. Les universités ont besoin de moyens réels.",
          "score": 0
        },
        {
          "text": "Augmenter légèrement pour les familles les plus aisées.",
          "score": 3
        },
        {
          "text": "Les maintenir très bas. L'accès au savoir ne doit pas dépendre du portefeuille.",
          "score": 7
        },
        {
          "text": "Les supprimer complètement. L'université doit être totalement gratuite.",
          "score": 10
        },
        {
          "text": "Frais modulés selon les revenus des parents, gratuits pour les modestes.",
          "score": 5
        }
      ]
    },
    {
      "id": 88,
      "theme": "education",
      "question": "Smartphones et numérique à l'école : interdire ou intégrer ?",
      "explanation": "L'usage des <strong>smartphones et du numérique à l'école</strong> fait débat. Depuis une loi de 2018, le téléphone portable est interdit à l'école et au collège, et des expériences de « pause numérique » (téléphone rangé toute la journée) ont été étendues. En parallèle, tablettes et ordinateurs sont utilisés pour les cours. Les <strong>partisans</strong> de l'interdiction invoquent des études montrant que le portable nuit à la <strong>concentration</strong>, favorise le harcèlement et l'exposition aux écrans, et que le rangement améliore l'ambiance de classe. Les <strong>partisans</strong> d'une intégration estiment qu'il faut apprendre à utiliser ces outils, incontournables dans la vie et le travail, plutôt que de les diaboliser. Le débat oppose la <strong>protection</strong> de l'attention des élèves et l'<strong>éducation</strong> à un usage raisonné du numérique.",
      "options": [
        {
          "text": "Bannir tous les écrans. L'école doit être un espace préservé de concentration.",
          "score": 4.5
        },
        {
          "text": "Maintenir l'interdiction des smartphones, usage pédagogique encadré des tablettes.",
          "score": 5
        },
        {
          "text": "Intégrer intelligemment le numérique et l'IA avec une vraie pédagogie.",
          "score": 5.5
        },
        {
          "text": "L'IA va tout révolutionner. L'école doit s'y adapter pleinement et maintenant.",
          "score": 5.5
        }
      ]
    },
    {
      "id": 89,
      "theme": "education",
      "question": "IA dans les devoirs : tricher ou évoluer ?",
      "explanation": "L'<strong>intelligence artificielle</strong> comme ChatGPT peut rédiger des devoirs, résumer des textes ou résoudre des exercices en quelques secondes. Cela pose un problème inédit à l'école : comment noter un travail quand une machine peut le faire à la place de l'élève ? Les <strong>inquiets</strong> y voient une forme de <strong>triche</strong> qui empêche d'apprendre à réfléchir, écrire et raisonner par soi-même, et rend l'évaluation peu fiable. Les <strong>optimistes</strong> estiment qu'il faut au contraire <strong>apprendre à s'en servir</strong>, comme on a appris à utiliser la calculatrice ou Internet, car l'IA fera partie du monde du travail. Beaucoup proposent une voie médiane : encadrer son usage, privilégier les travaux en classe et enseigner l'<strong>esprit critique</strong> face aux réponses des machines, qui peuvent aussi se tromper.",
      "options": [
        {
          "text": "Interdire strictement l'IA dans tous les devoirs et examens.",
          "score": 4.5
        },
        {
          "text": "Interdire pour les examens, tolérer pour le travail préparatoire.",
          "score": 5
        },
        {
          "text": "Former les élèves à utiliser l'IA de façon critique et éclairée.",
          "score": 5.5
        },
        {
          "text": "L'IA va transformer l'éducation. Anticiper plutôt que résister.",
          "score": 6
        }
      ]
    },
    {
      "id": 90,
      "theme": "education",
      "question": "Culture et création : l'État doit-il financer les artistes ?",
      "explanation": "En France, l'<strong>État finance largement la culture</strong> : subventions aux théâtres, musées, cinéma, festivals, et aides aux artistes, dont le régime particulier des <strong>intermittents du spectacle</strong> qui touchent des indemnités entre deux contrats. Ce soutien public est ancien et considéré comme une spécificité française, l'un des budgets culturels les plus élevés du monde. Les <strong>partisans</strong> estiment que la culture ne peut pas dépendre seulement du marché : sans aides, seules les œuvres rentables existeraient, au détriment de la création, de la diversité et de l'accès de tous. Les <strong>critiques</strong> jugent que trop d'argent public va à des projets peu vus, réclament plus de contrôle des dépenses et estiment que les artistes devraient davantage vivre de leur <strong>public</strong>. Le débat oppose la culture comme <strong>service public</strong> et une logique plus <strong>marchande</strong>.",
      "options": [
        {
          "text": "Réduire. La culture doit se financer sur le marché comme les autres industries.",
          "score": 0
        },
        {
          "text": "Maintenir le budget actuel mais mieux le cibler vers la diversité culturelle.",
          "score": 4
        },
        {
          "text": "L'augmenter pour démocratiser l'accès à la culture dans toutes les régions.",
          "score": 7
        },
        {
          "text": "Doubler le budget culture. C'est essentiel pour la cohésion sociale.",
          "score": 10
        }
      ]
    },
    {
      "id": 91,
      "theme": "education",
      "question": "Langues régionales à l'école : défendre le breton, l'alsacien, l'occitan ?",
      "explanation": "Les <strong>langues régionales</strong> comme le breton, l'alsacien, le corse, le basque ou l'occitan sont des langues historiques de certains territoires, longtemps découragées par l'école républicaine au profit du seul français. Aujourd'hui elles peuvent être enseignées, notamment dans des écoles bilingues ou associatives (Diwan, Calandreta), mais leur statut reste fragile, le français étant la seule langue officielle. Les <strong>partisans</strong> veulent renforcer cet enseignement pour sauver un <strong>patrimoine</strong> menacé et transmettre une identité locale. Les <strong>opposants</strong> craignent que cela affaiblisse l'unité nationale autour du français ou détourne des moyens des savoirs fondamentaux. Le débat oppose la défense de la <strong>diversité culturelle</strong> et l'attachement à une République <strong>une et indivisible</strong> autour d'une langue commune.",
      "options": [
        {
          "text": "Non. Le français est la langue de la République. Pas de place pour les langues régionales.",
          "score": 2
        },
        {
          "text": "En option seulement, pour les familles qui le souhaitent.",
          "score": 4
        },
        {
          "text": "Les intégrer davantage dans les régions où la langue est encore vivante.",
          "score": 6
        },
        {
          "text": "Enseignement bilingue public dans les régions concernées.",
          "score": 8
        }
      ]
    },
    {
      "id": 92,
      "theme": "education",
      "question": "Sport à l'école : est-ce assez prioritaire ?",
      "explanation": "La place du <strong>sport à l'école</strong> est régulièrement jugée insuffisante. Les élèves français ont quelques heures d'<strong>éducation physique et sportive</strong> (EPS) par semaine, mais études et médecins alertent sur la <strong>sédentarité</strong> croissante des jeunes et la hausse du surpoids. Des mesures ont été lancées, comme les « 30 minutes d'activité physique quotidienne » à l'école primaire. Les <strong>partisans</strong> d'un renforcement estiment que le sport améliore la santé, la concentration, le bien-être et l'esprit d'équipe, et qu'il devrait être une vraie priorité, surtout après l'élan des <strong>Jeux olympiques de Paris 2024</strong>. Les <strong>prudents</strong> rappellent que le temps scolaire est limité et qu'ajouter du sport se fait au détriment d'autres matières, dans un contexte où les résultats en lecture et maths inquiètent. Le débat porte sur l'<strong>équilibre</strong> entre les apprentissages.",
      "options": [
        {
          "text": "C'est bien comme ça. Le sport relève de la famille et des associations.",
          "score": 3
        },
        {
          "text": "Quelques heures supplémentaires par semaine seraient bienvenues.",
          "score": 5
        },
        {
          "text": "Doubler les heures d'EPS. Le sport est fondamental pour l'apprentissage.",
          "score": 6
        },
        {
          "text": "Sport quotidien obligatoire à l'école. Grande cause nationale post-JO.",
          "score": 7
        }
      ]
    },
    {
      "id": 93,
      "theme": "education",
      "question": "Redoublement : utile ou inutile ?",
      "explanation": "Le <strong>redoublement</strong> consiste à faire recommencer une année à un élève en difficulté. Longtemps courant en France, il a fortement diminué car de nombreuses études le jugeaient peu efficace et coûteux, avant d'être en partie réhabilité par des réformes récentes qui redonnent du poids à l'avis des enseignants. Les <strong>opposants</strong> au redoublement s'appuient sur les recherches montrant qu'il améliore rarement les résultats, décourage l'élève et coûte cher, tout en creusant les inégalités (il touche plus les milieux modestes). Les <strong>partisans</strong> estiment qu'un élève trop en retard ne peut pas suivre l'année suivante et qu'une année de plus, bien accompagnée, vaut mieux qu'un passage automatique masquant les lacunes. Le débat oppose la <strong>lutte contre l'échec</strong> par le maintien et par un meilleur <strong>soutien</strong> en cours d'année.",
      "options": [
        {
          "text": "Le maintenir. Un élève qui ne maîtrise pas le niveau ne doit pas passer.",
          "score": 3
        },
        {
          "text": "Le garder seulement pour les cas les plus graves, pas systématiquement.",
          "score": 4.5
        },
        {
          "text": "L'éviter au maximum. Mieux vaut un accompagnement personnalisé.",
          "score": 6
        },
        {
          "text": "Le supprimer totalement. Il ne sert à rien et stigmatise les élèves.",
          "score": 7
        }
      ]
    },
    {
      "id": 94,
      "theme": "education",
      "question": "Service civique et engagement des jeunes : faut-il le rendre obligatoire ?",
      "explanation": "Le <strong>SNU</strong> (Service national universel), lancé en 2019, propose aux jeunes d'environ 15-17 ans un séjour collectif de quelques semaines mêlant vie en groupe, activités civiques et découverte de l'engagement, aujourd'hui sur la base du volontariat. Certains veulent le rendre <strong>obligatoire</strong> pour toute une classe d'âge. Les <strong>partisans</strong> y voient un moyen de renforcer le sentiment d'<strong>appartenance nationale</strong>, de favoriser la mixité sociale et de transmettre des valeurs civiques à tous les jeunes. Les <strong>opposants</strong> pointent un coût très élevé (plusieurs milliards s'il devient obligatoire), une utilité incertaine et une atteinte à la liberté, préférant financer l'école ou le <strong>service civique</strong> existant. Le débat oppose l'idée d'un <strong>brassage citoyen</strong> imposé et la crainte d'un dispositif coûteux et contraignant.",
      "options": [
        {
          "text": "Non. L'engagement doit rester volontaire. Forcer n'a aucun sens.",
          "score": 6
        },
        {
          "text": "Le développer fortement en restant sur le volontariat.",
          "score": 5.5
        },
        {
          "text": "Le rendre obligatoire sur quelques semaines comme expérience citoyenne.",
          "score": 4
        },
        {
          "text": "Service national obligatoire long (3-6 mois) comme par le passé.",
          "score": 2.5
        }
      ]
    },
    {
      "id": 95,
      "theme": "education",
      "question": "Orientation scolaire : le système d'orientation des élèves est-il juste ?",
      "explanation": "L'<strong>orientation scolaire</strong> désigne la façon dont les élèves sont dirigés vers une filière, un lycée ou des études supérieures. Au lycée et après le bac, la plateforme <strong>Parcoursup</strong> répartit les candidats dans les formations, ce qui suscite beaucoup de stress et de critiques sur son manque de transparence. Les <strong>critiques</strong> estiment que le système est <strong>injuste</strong> : les élèves des milieux favorisés, mieux informés et souvent dans de meilleurs établissements, obtiennent plus facilement les formations sélectives, tandis que d'autres subissent l'algorithme. Les <strong>défenseurs</strong> répondent qu'il faut bien répartir des places limitées, que le système a gagné en clarté et qu'il évite le tirage au sort d'avant. Le débat porte sur la manière de rendre l'orientation plus <strong>équitable</strong> et mieux <strong>accompagnée</strong>, dès le collège.",
      "options": [
        {
          "text": "Le système actuel est correct. Adapter les élèves à leurs capacités réelles.",
          "score": 1
        },
        {
          "text": "Améliorer les passerelles mais garder la spécialisation précoce.",
          "score": 4
        },
        {
          "text": "Retarder l'orientation, valoriser toutes les filières de façon égale.",
          "score": 7
        },
        {
          "text": "Réforme totale : tronc commun jusqu'à 18 ans, spécialisation uniquement après.",
          "score": 10
        }
      ]
    },
    {
      "id": 96,
      "theme": "education",
      "question": "Programmes scolaires : trop ou pas assez de place pour l'histoire coloniale ?",
      "explanation": "Les <strong>programmes scolaires</strong> fixent ce qui est enseigné, notamment en histoire. La place de l'<strong>histoire coloniale</strong> (esclavage, empires coloniaux, guerre d'Algérie) y fait débat : elle est présente, mais certains la jugent trop faible ou traitée trop vite. Les <strong>partisans</strong> d'un renforcement estiment que mieux enseigner ce passé aide à comprendre la société actuelle, ses diversités et ses tensions mémorielles, et rend justice à des pans oubliés de l'histoire. Les <strong>opposants</strong> craignent une lecture <strong>culpabilisante</strong> ou militante, qui insisterait sur les fautes de la France au détriment d'un récit national plus équilibré. Le débat porte donc sur le <strong>dosage</strong> et le ton : transmettre une histoire critique et complète, sans transformer le cours en procès ni en simple roman national.",
      "options": [
        {
          "text": "Trop de place déjà. L'histoire de France doit célébrer ses réussites.",
          "score": 0
        },
        {
          "text": "Équilibré. L'histoire coloniale est présente mais pas au détriment du reste.",
          "score": 3
        },
        {
          "text": "Pas assez. Les élèves devraient mieux connaître ces pages de l'histoire.",
          "score": 7
        },
        {
          "text": "Beaucoup plus. C'est fondamental pour comprendre les inégalités actuelles.",
          "score": 10
        },
        {
          "text": "Traiter la colonisation comme le reste : ni célébration ni surcharge, des faits et des débats.",
          "score": 5
        }
      ]
    },
    {
      "id": 97,
      "theme": "education",
      "question": "Mixité sociale à l'école : faut-il forcer des classes plus mélangées ?",
      "explanation": "La <strong>mixité sociale à l'école</strong> désigne le fait de mélanger, dans les mêmes établissements et classes, des élèves de milieux favorisés et modestes. Aujourd'hui, la <strong>carte scolaire</strong> et le choix du privé conduisent souvent à des écoles très homogènes, certaines concentrant les difficultés. Des expériences ont été menées pour rééquilibrer les recrutements entre collèges. Les <strong>partisans</strong> d'une mixité forcée s'appuient sur des études montrant qu'elle profite aux élèves fragiles sans pénaliser les autres, et qu'elle favorise la cohésion sociale. Les <strong>opposants</strong> défendent la <strong>liberté des familles</strong> de choisir l'école de leurs enfants et craignent que des mesures contraignantes ne poussent les plus aisés vers le privé, aggravant la fracture. Le débat oppose <strong>égalité</strong> des chances et <strong>liberté</strong> de choix.",
      "options": [
        {
          "text": "Non. La liberté de choix de l'école doit primer.",
          "score": 0
        },
        {
          "text": "Renforcer la carte scolaire existante et limiter les contournements.",
          "score": 4
        },
        {
          "text": "Politiques actives de mixité sociale avec des incitations fortes.",
          "score": 7
        },
        {
          "text": "Mixité sociale et économique obligatoire dans toutes les écoles publiques.",
          "score": 10
        }
      ]
    },
    {
      "id": 98,
      "theme": "education",
      "question": "Éducation aux médias et au numérique : assez enseignée à l'école ?",
      "explanation": "L'<strong>éducation aux médias et au numérique</strong> vise à apprendre aux élèves à s'informer, repérer les fausses informations, comprendre les réseaux sociaux et protéger leurs données. Dans un monde où les jeunes s'informent beaucoup en ligne, où circulent rumeurs et vidéos truquées (y compris par IA), cet enseignement est jugé de plus en plus important. Il existe déjà, à travers certaines matières et des semaines dédiées, mais reste souvent limité et inégal selon les établissements. Les <strong>partisans</strong> d'un renforcement estiment qu'apprendre l'<strong>esprit critique</strong> face à l'information est aujourd'hui aussi essentiel que lire ou compter. Les <strong>prudents</strong> rappellent que le temps scolaire est déjà chargé et que ces compétences peuvent être intégrées aux cours existants plutôt que de créer une nouvelle matière. Le débat porte sur la <strong>priorité</strong> à lui accorder.",
      "options": [
        {
          "text": "C'est suffisant. Les élèves apprennent à se débrouiller seuls.",
          "score": 4
        },
        {
          "text": "Quelques améliorations seraient utiles mais ce n'est pas la priorité.",
          "score": 5
        },
        {
          "text": "Ça devrait être une matière à part entière dès le primaire.",
          "score": 6
        },
        {
          "text": "Urgence absolue. La démocratie dépend de citoyens capables de vérifier l'info.",
          "score": 6.5
        }
      ]
    },
    {
      "id": 99,
      "theme": "education",
      "question": "Philosophie au lycée : garder ou réduire ?",
      "explanation": "La <strong>philosophie</strong> est enseignée en France en classe de <strong>terminale</strong>, année du bac, à tous les élèves. Elle vise à apprendre à réfléchir, argumenter et questionner de grandes notions (liberté, justice, vérité). Régulièrement, des propositions suggèrent de la <strong>réduire</strong>, de l'introduire plus tôt, ou au contraire de la renforcer. Les <strong>défenseurs</strong> y voient une spécificité précieuse de l'école française, un apprentissage de l'<strong>esprit critique</strong> et de l'autonomie de pensée, utile face à la désinformation. Les <strong>critiques</strong> jugent la matière trop abstraite, mal comprise par beaucoup d'élèves faute d'y être préparés avant la terminale, et voudraient revoir sa place ou sa méthode. Le débat porte moins sur la suppression que sur la <strong>manière</strong> de l'enseigner et le moment où l'introduire.",
      "options": [
        {
          "text": "La réduire ou la rendre optionnelle. Privilégier des matières plus pratiques.",
          "score": 4.5
        },
        {
          "text": "La maintenir comme elle est. C'est une spécificité française précieuse.",
          "score": 5
        },
        {
          "text": "La renforcer et l'étendre. La pensée critique se construit tôt.",
          "score": 5.5
        },
        {
          "text": "La philosophie doit être enseignée dès le collège, pas seulement en terminale.",
          "score": 6
        }
      ]
    },
    {
      "id": 100,
      "theme": "education",
      "question": "Bourses étudiantes : le système d'aide aux étudiants modestes est-il suffisant ?",
      "explanation": "Les <strong>bourses étudiantes</strong> sont des aides financières versées par l'État aux étudiants selon les revenus de leur famille, pour couvrir une partie du coût des études (logement, nourriture, transport). Elles concernent une part importante des étudiants, mais de nombreuses associations alertent sur la <strong>précarité étudiante</strong> : difficultés à se loger, à se nourrir, jobs à côté des cours. Les <strong>partisans</strong> d'un renforcement estiment que les montants sont trop faibles et les seuils trop stricts, et réclament une meilleure aide, voire une forme d'<strong>allocation autonomie</strong> pour tous les jeunes. Les <strong>prudents</strong> rappellent le coût pour les finances publiques et préfèrent cibler les aides sur les plus modestes plutôt que de les généraliser. Le débat porte sur l'ampleur du soutien et sur la façon la plus <strong>juste</strong> et <strong>soutenable</strong> d'aider les étudiants.",
      "options": [
        {
          "text": "Le système actuel est suffisant. La responsabilité revient aux familles.",
          "score": 0
        },
        {
          "text": "Quelques améliorations ciblées pour les plus précaires.",
          "score": 3
        },
        {
          "text": "Revalorisation significative des bourses + extension des critères.",
          "score": 7
        },
        {
          "text": "Allocation universelle d'autonomie pour tous les étudiants.",
          "score": 10
        },
        {
          "text": "Revaloriser les bourses existantes sans changer le système.",
          "score": 5
        }
      ]
    },
    {
      "id": 112,
      "theme": "education",
      "w": 1,
      "question": "Uniforme et autorité à l'école : généraliser la tenue unique ?",
      "explanation": "Expérimentée depuis 2024 dans une centaine d'établissements volontaires, la <strong>tenue unique</strong> (« uniforme ») est défendue par le RN, la droite (Retailleau) et une partie du centre comme un outil de <strong>restauration de l'autorité</strong>, de lutte contre le harcèlement lié aux marques et de laïcité. Ses détracteurs (gauche, syndicats enseignants) y voient une mesure symbolique et coûteuse (plusieurs centaines d'euros par élève) qui ne règle ni les inégalités, ni le manque de professeurs, ni les résultats en baisse dans les classements internationaux. Le débat renvoie à deux visions de l'école : celle de l'<strong>autorité et des fondamentaux</strong> (uniforme, redoublement, certificat d'études, cours de morale) et celle de la <strong>mixité et des moyens</strong> (plus de profs, petites classes, accompagnement).",
      "options": [
        {
          "text": "Oui, l'uniforme obligatoire partout, avec un retour ferme de l'autorité.",
          "score": 1
        },
        {
          "text": "Au choix de chaque établissement, sans l'imposer.",
          "score": 4
        },
        {
          "text": "Non, priorité aux moyens : plus de profs et de petites classes.",
          "score": 7
        },
        {
          "text": "Non : l'école doit s'attaquer aux inégalités par la mixité sociale et l'accompagnement.",
          "score": 9
        }
      ],
      "updated": "2026-08",
      "isNew": true
    }
  ];

  // ── Candidats & prétendants 2027 : positionnement + programme par thème ──
  //    (recherche datée de juillet 2026 ; scores 0=droite → 10=gauche par thème)
  //    Voir situation_politique.md pour le détail et les mises à jour.
  var CANDIDATES = [
    {"name":"Nathalie Arthaud","party":"Lutte ouvrière (LO)","status":"déclaré","color":"#B71C1C","oneLiner":"Porte-parole de Lutte ouvrière, candidate pour la 4e fois (« le camp des travailleurs ») : SMIC à 2 200 € net, interdiction des licenciements, réquisition des profits du grand patronat ; appelle les travailleurs à rejoindre la révolte lycéenne et refuse le « vote utile » Mélenchon ; 0,5-1 %.","program":{"eco":"Arthaud défend un programme communiste révolutionnaire de renversement du capitalisme et de contrôle ouvrier, présenté comme « un plan de combat » plutôt qu'un programme électoral. Elle réclame un SMIC à 2 200 euros net, l'indexation automatique de tous les salaires, pensions et allocations sur la hausse des prix, et l'interdiction pure et simple des licenciements avec répartition du travail entre tous sans perte de salaire. Elle propose la levée du secret des affaires et du secret bancaire pour que les travailleurs contrôlent les comptes des entreprises, la réquisition des profits et des grandes fortunes, et l'expropriation des banques et des grands groupes.","social":"Elle défend inconditionnellement les services publics utiles aux classes populaires, en particulier l'hôpital, financés par les profits des grandes entreprises plutôt que par l'austérité. Elle dénonce toutes les politiques d'austérité, de droite comme de gauche de gouvernement, et l'insuffisance des minima sociaux. Sa logique est d'imposer les besoins des travailleurs (santé, salaires, emploi) contre la logique du profit capitaliste.","immigration":"Arthaud rejette toute division entre travailleurs français et immigrés, avec ou sans papiers, au nom de la solidarité de classe. Elle est favorable à la régularisation des sans-papiers et combat la xénophobie et le nationalisme qu'elle présente comme des armes de la bourgeoisie pour diviser les exploités. Pour elle, les travailleurs du monde entier ont les mêmes intérêts, quelle que soit leur origine.","securite":"Elle inscrit la question dans une critique de l'État bourgeois, dénonçant la répression contre le monde du travail et les quartiers populaires plutôt que d'appeler au durcissement pénal. Elle s'oppose aux budgets militaires et à l'escalade guerrière. Sa priorité est la défense du droit de grève et des libertés syndicales face à l'appareil répressif.","env":"Arthaud lie systématiquement la crise écologique au capitalisme et à la recherche du profit, jugée incompatible avec la protection de l'environnement. Elle estime qu'aucune écologie réelle n'est possible sans que les travailleurs contrôlent la production. Elle refuse une écologie qui ferait porter les efforts sur les classes populaires (taxes, hausses de prix) et vise l'expropriation et la planification par les producteurs eux-mêmes.","europe":"Elle défend un internationalisme prolétarien opposé au nationalisme et rejette aussi bien l'Union européenne des capitalistes que les replis souverainistes. Elle dénonce l'OTAN, les interventions impérialistes et les budgets de guerre comme servant les intérêts du capital. Sa perspective est l'unité internationale des travailleurs, non un aménagement des institutions européennes.","institutions":"Arthaud ne propose pas de réforme institutionnelle classique (constituante, proportionnelle, référendum) car elle considère que les institutions bourgeoises ne changeront pas le rapport d'exploitation. Elle voit l'élection présidentielle avant tout comme une tribune pour le camp des travailleurs. Le pouvoir réel doit selon elle venir de la mobilisation et de l'auto-organisation des travailleurs.","societal":"Elle défend l'unité de la classe ouvrière par-delà les origines, les religions et les identités, tout en combattant le racisme et la xénophobie. Elle soutient les droits des femmes et l'égalité, en les rattachant à la lutte contre l'exploitation capitaliste plutôt qu'à une approche identitaire séparée. Elle refuse d'instrumentaliser la laïcité pour stigmatiser une partie des travailleurs.","education":"Arthaud défend l'école publique comme service public essentiel aux classes populaires et s'oppose aux suppressions de postes et à la dégradation des conditions d'enseignement. Elle réclame les moyens humains et matériels nécessaires, financés par les profits capitalistes."},"scores":{"eco":9,"social":8.5,"immigration":10,"securite":9,"env":7,"europe":6.5,"institutions":7,"societal":8.5,"education":8.5},"bloc":"exg","declared":"2025-12"},
    {"name":"Anasse Kazib","party":"Révolution Permanente","status":"déclaré","color":"#D32F2F","oneLiner":"Cheminot, porte-parole de Révolution Permanente, candidat déclaré (1er juin 2026) : SMIC à 2 000 €, semaine de 28 h, retraite à 60 ans ; tournée d'assemblées ouvertes et appel à étendre la révolte lycéenne jusqu'à la grève générale ; en quête des 500 parrainages.","program":{"eco":"Kazib porte une candidature « ouvrière, communiste et révolutionnaire » : SMIC à 2 000 euros net, indexation des salaires sur l'inflation, semaine de 28 heures sans baisse de salaire, interdiction des licenciements, fin de la sous-traitance et CDI pour toutes et tous. Il veut supprimer les aides publiques aux grandes entreprises et exproprier les secteurs stratégiques (énergie, transports, banques, santé), placés sous le contrôle des travailleurs, avec des prêts à taux zéro et la fin des agios. La production serait planifiée « au service des besoins », dans le respect de l'environnement.","social":"Il revendique la retraite à 60 ans, et à 55 ans pour les métiers pénibles, sans condition d'annuités, ainsi que des investissements massifs dans les services publics et des embauches à l'hôpital. Sur le logement, il veut exproprier les logements vides, plafonner et geler les loyers. Il défend l'avortement, la PMA et les transitions de genre libres et gratuits. Il met au premier plan la jeunesse précaire, les intérimaires, les livreurs et les habitants des quartiers populaires, avec une protection sociale financée par une ponction sur les profits.","immigration":"Kazib défend la régularisation de tous les sans-papiers et la liberté de circulation, avec une attention à la jeunesse précaire avec ou sans papiers. Il combat le racisme d'État et les contrôles au faciès, et refuse toute distinction entre travailleurs selon leur origine ou statut. Sa position est internationaliste : union des travailleurs immigrés et français contre le patronat.","securite":"C'est l'un de ses axes forts : il dénonce les violences policières et la répression dans les quartiers populaires, et sa colistière est une avocate qui défend les victimes de violences policières. Il réclame la dissolution des corps spéciaux de police (type BAC), l'abrogation des lois sécuritaires, l'amnistie des manifestants et syndicalistes réprimés, et une justice au service des exploités. Il défend inconditionnellement le droit de grève et de manifester.","env":"Kazib porte une écologie anticapitaliste (écosocialiste), considérant que la crise climatique est une crise du capitalisme et de la course au profit. Il défend une planification écologique sous contrôle démocratique des travailleurs et l'expropriation des grands pollueurs et multinationales de l'énergie. Il refuse une écologie qui pèserait sur les classes populaires via des taxes.","europe":"Il est anti-impérialiste et veut rompre avec l'Union européenne des traités et du capital ainsi qu'avec l'OTAN. Il refuse « aucun euro pour la guerre » : démantèlement de la machine de guerre française, retrait des troupes françaises stationnées à l'étranger, opposition au SNU et à la militarisation. Il soutient fermement la libération de la Palestine (position pour laquelle il est poursuivi pour apologie du terrorisme) et celle de la Kanaky. Sa boussole est l'internationalisme et la solidarité entre les travailleurs des différents pays.","institutions":"Kazib veut en finir avec la Ve République, le Sénat et la fonction présidentielle. Il ne mise pas sur une réforme par le haut mais sur l'auto-organisation, les assemblées de travailleurs et la grève générale. Sa candidature doit rendre visible la voix de la « nouvelle classe ouvrière », absente du champ électoral, avec pour horizon un pouvoir des travailleurs.","societal":"Il porte un programme antiraciste, féministe et de défense des droits LGBTQ+, articulé à la lutte des classes. Il veut abroger les lois « sécuritaires, racistes et islamophobes », « à commencer par la loi de 2004 » sur les signes religieux à l'école, et créer des commissions indépendantes contre les violences sexistes et sexuelles sur les lieux de travail et d'études. Il défend les habitants des quartiers populaires et les personnes issues de l'immigration contre les stigmatisations.","education":"Kazib défend une école publique dotée de moyens et combat les suppressions de postes et la dégradation des conditions d'enseignement. Il revendique un revenu étudiant aligné sur le SMIC, financé par le patronat, contre la précarité et la sélection sociale. Il refuse le SNU et la militarisation des écoles et des universités, et s'appuie fortement sur la jeunesse mobilisée, en appelant à étendre la révolte lycéenne au monde du travail."},"scores":{"eco":9,"social":8.5,"immigration":10,"securite":9,"env":7.5,"europe":6.5,"institutions":7.5,"societal":9,"education":8.5},"bloc":"exg","declared":"2026-06-01"},
    {"name":"Selma Labib","party":"Nouveau Parti anticapitaliste (NPA)","status":"déclaré","color":"#C4122F","oneLiner":"Conductrice de bus, candidate du NPA-Révolutionnaires (soutenue par Gaël Quirante) : +400 € pour tous les salaires et pensions, aucun revenu sous 2 000 € net, « pas un euro pour les guerres impérialistes » ; désaccords « fondamentaux » avec LFI et le PCF ; tournée pour arracher les 500 parrainages.","program":{"eco":"Candidate du NPA-Révolutionnaires et conductrice de bus, Labib défend un programme anticapitaliste de rupture, pour un monde sans frontières ni patrons. Elle réclame 400 euros de plus par mois pour tous les salaires et pensions, aucun revenu sous 2 000 euros net, payés par le patronat (hausse du brut et du « super-brut »). Elle veut une réduction drastique du temps de travail sans perte de salaire, avec partage du travail jusqu'à la fin du chômage, et l'interdiction des licenciements. Elle refuse la retraite par capitalisation et propose l'expropriation des grandes fortunes et des grandes entreprises, placées sous le contrôle des travailleurs.","social":"Elle défend une santé et une protection sociale intégralement financées par la ponction sur les profits, avec un fort renforcement de l'hôpital public. Elle réclame l'augmentation massive des minima sociaux et l'accès garanti au logement. Sa perspective écosocialiste subordonne les besoins sociaux au contrôle démocratique de la production par les travailleurs.","immigration":"C'est un axe central : Labib défend l'ouverture des frontières, la liberté de circulation et d'installation, la régularisation de tous les sans-papiers et l'abolition de l'agence Frontex. Elle s'oppose à toute distinction entre travailleurs selon leur origine ou statut légal. Sa campagne est explicitement placée sous le signe de l'internationalisme.","securite":"Elle réclame la dissolution des brigades anti-criminalité (BAC) et des unités comme la BRAV-M, le désarmement de la police et une justice populaire. Elle dénonce les violences policières et la répression des mouvements sociaux et des quartiers populaires. Elle défend inconditionnellement le droit de grève et de manifester.","env":"Labib porte un écosocialisme radical, analysant la crise climatique comme une crise du capitalisme, et réclame la sortie immédiate du nucléaire. Elle défend une planification écologique sous contrôle démocratique et l'expropriation des grands groupes énergétiques et industriels pollueurs. Elle refuse toute écologie de marché faisant payer les classes populaires.","europe":"Elle prône une rupture avec les traités européens, jugeant l'UE intrinsèquement capitaliste, et s'oppose à l'OTAN. Elle défend l'internationalisme, la solidarité avec les peuples opprimés et la cause palestinienne, contre l'impérialisme et l'économie de guerre. Sa perspective est celle des États-Unis socialistes d'Europe.","institutions":"Labib ne mise pas sur les institutions de la Ve République ni sur des réformes par le haut mais sur l'auto-organisation, les assemblées et la grève générale. Sa candidature vise à porter une voix ouvrière et révolutionnaire indépendante des partis de gauche institutionnels. L'objectif affiché est un pouvoir des travailleurs.","societal":"Le NPA porte un programme très progressiste sur les droits des femmes, des personnes LGBTQ+ et des minorités, contre toutes les oppressions. Labib combat le racisme, l'islamophobie et l'instrumentalisation de la laïcité contre les populations immigrées. Ces luttes sont pensées comme partie intégrante du combat anticapitaliste.","education":"Elle défend une école et une université publiques massivement financées, contre la sélection et la précarité étudiante, et s'appuie sur la jeunesse mobilisée. Elle combat les suppressions de postes et la dégradation des conditions d'enseignement, dans le refus global de l'austérité."},"scores":{"eco":9,"social":8.5,"immigration":10,"securite":9,"env":7.5,"europe":6.5,"institutions":7,"societal":8.5,"education":8.5},"bloc":"exg","declared":"2026-06"},
    {"name":"Jean-Luc Mélenchon","party":"La France insoumise (LFI)","status":"déclaré","color":"#CC2443","oneLiner":"Candidat LFI déclaré (4e fois), en tête de la gauche avec 15 à 19 % au 1er tour (Harris 5-8/10 : 18 %), mais battu 33-67 par Le Pen au 2nd tour. Campagne « vie chère » (blocage des prix, SMIC 1 700 € net, échelle mobile, annulation de la dette BCE, « état d'urgence sociale ») puis jeunesse (Clermont 11/10 : abolition de Parcoursup, vote à 16 ans) ; soutien offensif au mouvement lycéen ; censure promise du budget 2027 en cas de 49.3 ; nouvelle « Avenir en commun » le 6-7/11.","program":{"eco":"Mélenchon (LFI, programme L'Avenir en commun, nouvelle édition le 6 novembre 2026) veut décréter un « état d'urgence sociale » : blocage des prix (carburants, produits de base), des marges et des loyers, SMIC à 1 700 euros net et échelle mobile des salaires indexant les salaires sur les prix. Il rétablit un ISF renforcé à volet climatique, plafonne l'héritage autour de 12 millions d'euros et propose d'annuler (ou de convertir en dette perpétuelle à taux zéro) la part de la dette détenue par la BCE, environ 500 à 600 milliards d'euros. Il revient à la retraite à 62 ans puis à 60 ans « le plus vite possible » avec 40 annuités, maintient les 35 heures, conditionne les aides publiques (« pas d'aides sans contrepartie ») et crée un pôle public bancaire pour financer la planification écologique.","social":"Il vise le remboursement à 100% des soins prescrits par la Sécurité sociale et un plan d'urgence pour l'hôpital public avec recrutements massifs et fin de la tarification à l'activité. Il augmente les minima sociaux, revalorise le RSA et l'AAH et lutte contre les déserts médicaux par des centres de santé publics. Sur le logement, il encadre les loyers, construit massivement du logement social et instaure une garantie contre les expulsions. Il maintient l'Aide médicale d'État.","immigration":"Mélenchon défend une politique migratoire « humaniste et réaliste » : régularisation des travailleurs, étudiants et parents d'enfants scolarisés sans papiers, carte de séjour de dix ans comme titre de référence, visas facilités, suspension du règlement de Dublin, renégociation des accords du Touquet, sortie de « l'impasse » Schengen-Frontex et fin du « délit de solidarité ». Il abroge la loi asile-immigration et ses restrictions, notamment sur le regroupement familial, garantit le droit d'asile avec un guichet unique et assez de places d'hébergement, et crée une protection pour les déplacés climatiques. Il rétablit le droit du sol intégral, maintient l'AME et accorde aux étrangers résidents le droit de vote aux élections locales.","securite":"Il prône une déflation carcérale et privilégie la réinsertion aux peines automatiques, s'opposant aux peines planchers. Il remplace l'IGPN par une autorité indépendante de contrôle de la police et développe les alternatives à l'emprisonnement. Il maintient le principe éducatif de l'ordonnance de 1945 pour la justice des mineurs et défend l'application des mandats de la CPI, y compris contre des alliés.","env":"La planification écologique est la colonne vertébrale de son programme : 100 % d'énergies renouvelables en 2050 et sortie du nucléaire (abandon des EPR, démantèlement progressif), fin des subventions aux fossiles, taxation des superprofits pétroliers, moratoire sur les nouvelles autoroutes et investissements massifs dans le rail. Il veut faire reconnaître un crime d'écocide (« les pollueurs de masse doivent répondre de leurs actes ») et soutient un tribunal international de justice climatique. Il interdit le glyphosate et vise -50 % de pesticides d'ici 2030. Il rejette les ZFE telles qu'elles existent, jugées socialement injustes : les députés LFI ont voté leur suppression le 28 mai 2025 et demandent un moratoire tant qu'il n'y a pas de transports en commun suffisants.","europe":"Il défend la désobéissance aux traités européens « à chaque fois que c'est nécessaire » pour appliquer son programme, sans sortir de l'UE, ainsi que l'harmonisation fiscale et un protectionnisme écologique et solidaire avec le refus des accords de libre-échange (Mercosur, CETA). Il refuse « le principe de l'alliance militaire permanente » : sortie du commandement intégré puis de l'OTAN, défense nationale indépendante (renationalisation des industries d'armement, priorité aux équipements français), pas d'armée européenne. Il prône une diplomatie non alignée de « causes communes » : ONU renforcée, coopérations avec la Méditerranée, la francophonie et la Chine. Sur l'Ukraine, il privilégie une paix négociée et reste réservé sur l'escalade militaire. Il réclame des sanctions contre Israël, refuse les livraisons d'armes aux « régimes génocidaires » et réduit la présence militaire française en Afrique.","institutions":"Mélenchon veut convoquer par référendum (article 11) une Assemblée constituante, dont seraient exclus les parlementaires sortants, pour passer à une VIe République parlementaire ; la nouvelle Constitution serait soumise à référendum après deux ans de travaux. Il abolit le 49.3 et les « votes forcés », fait élire l'Assemblée à la proportionnelle départementale et instaure le RIC (proposer ou abroger une loi, modifier la Constitution, révoquer un élu). Il veut reconnaître le vote blanc, rendre le vote obligatoire et ouvrir le droit de vote à 16 ans. Contre « l'oligarchie », il interdit le pantouflage (remboursement de la formation sous dix ans de service, dix ans d'interdiction dans le même secteur) et l'accès des lobbyistes au Parlement, rend inéligible à vie toute personne condamnée pour corruption et plafonne les dons aux partis à 200 euros.","societal":"Il porte des positions très progressistes : légalisation encadrée du cannabis sous monopole public, IVG allongée à 14 semaines et intégralement remboursée, PMA pour toutes remboursée, aide à mourir ; il est opposé à la GPA. Sur la laïcité, il revendique « l'application stricte » de la loi de 1905 : abrogation du concordat d'Alsace-Moselle, interdiction aux élus et ministres d'assister ès qualités aux cérémonies religieuses, aucun financement public des cultes. Il défend en revanche la liberté des usagers des services publics de porter des signes religieux : LFI combat l'interdiction de l'abaya à l'école, sans proposer d'abroger la loi de 2004. Il défend la « créolisation », une approche antiraciste explicite, la pleine reconnaissance des droits des personnes trans et généralise l'éducation à la sexualité.","education":"Il promet d'abolir Parcoursup, qu'il qualifie d'« école du vice », et de mettre fin à la sélection à l'entrée de l'université, avec un revenu d'autonomie pour les jeunes. Il crée environ 190 000 postes dans l'Éducation nationale, titularise les contractuels et crée un corps de fonctionnaires pour les AESH. Il instaure la cantine bio gratuite pour tous les élèves, réforme la carte scolaire pour imposer la mixité sociale et s'oppose à l'uniforme obligatoire. Il défend le droit de vote à 16 ans."},"scores":{"eco":9.5,"social":9.5,"immigration":9,"securite":8.5,"env":8,"europe":6,"institutions":8.5,"societal":9,"education":9},"bloc":"gauche","declared":"2026-05-03"},
    {"name":"Raphaël Glucksmann","party":"Place publique","status":"déclaré","color":"#E5006D","oneLiner":"Eurodéputé, leader de Place publique : vainqueur dès le 1er tour de la primaire PS/PP/GRS le 11 octobre (66,13 %, 120 787 votants), candidat officiel de la gauche sociale-démocrate. « Rupture » avec le macronisme et avec LFI ; retraite à 62 ans, SMIC à 1 600 € net, baisse de la CSG financée par les héritages de plus de 2 M€, régularisation des travailleurs sans papiers, proportionnelle et assemblée constituante ; 9-12 % dans les sondages.","program":{"eco":"Son « obsession » est d'augmenter le salaire net : baisse de la CSG sur les salaires (jusqu'à environ 200 € nets par mois annoncés), financée par une taxation des « méga-héritages » au-delà de 2 millions d'euros. Le projet de Place publique prévoit aussi de porter le SMIC à 1 600 € net dans les deux ans, d'indexer le point d'indice des fonctionnaires sur l'inflation, un mécanisme automatique de taxation des superprofits des multinationales et des « profiteurs de guerre », et la suppression des niches fiscales inefficaces ; il soutient la taxe Zucman sur les ultra-riches. Il veut réorienter une partie des aides aux entreprises (conditionnées) pour réduire la dette et financer la réindustrialisation : « Buy European Act », fonds régionaux au capital d'entreprises clés, barrières douanières contre les surcapacités chinoises. Il menace de censurer le budget 2027 si la copie ne bouge pas.","social":"Il abroge la réforme des retraites de 2023, « injuste », et fixe l'âge légal à 62 ans (« On ne pourra pas faire 60 ans, ce sera 62 ans ») ; la réforme suivante sera fondée sur la pénibilité et l'espérance de vie en bonne santé : départs plus tôt pour les métiers pénibles et carrières hachées, plus tard pour ceux qui vivent plus longtemps en bonne santé, sous l'égide d'un Haut Conseil du pilotage des retraites où les partenaires sociaux seront majoritaires. Il abroge la réforme Macron de l'assurance chômage et ouvre une conférence sociale vers un minimum social unique accessible dès 18 ans. En santé, il veut en finir avec la tarification à l'acte à l'hôpital, contrer la financiarisation du système et favoriser l'exercice regroupé et mixte ville-hôpital contre les déserts médicaux ; il soutient l'aide à mourir.","immigration":"Glucksmann veut « assumer » le débat migratoire par une convention citoyenne sur l'immigration dont les conclusions seraient votées au Parlement. Il abroge la loi immigration de 2024, facilite la régularisation des travailleurs sans papiers (« nous le ferons et ce sera populaire »), ouvre le droit au travail dès l'enregistrement de la demande d'asile et généralise la carte de séjour pluriannuelle, avec des guichets uniques pour les primo-arrivants et des cours de français jusqu'au niveau A2. Au niveau européen : voies légales d'immigration de travail liées à des accords de réadmission, fin du système de Dublin au profit d'une répartition, refus de l'externalisation de l'asile et force européenne de sauvetage en mer. Il veut mettre fin à la « politique du chiffre » sur les OQTF tout en appliquant celles délivrées, et refuse le discours de la submersion.","securite":"Il défend une sécurité « sans déni » mais sans « coups de menton » : meilleures conditions de travail, formation et recentrage des policiers et gendarmes sur leur cœur de métier, police de proximité centrée sur la prévention et la médiation, application effective des OQTF. Il généralise les récépissés de contrôle d'identité et veut revoir la doctrine française du maintien de l'ordre. Côté justice : choc de justice de proximité (médiation, travaux d'intérêt général), doublement des Maisons de la justice et du droit, lutte contre la surpopulation carcérale par l'adaptation des peines, des prisons rénovées et des parcours de réinsertion. Il propose une convention citoyenne sur la politique des drogues.","env":"Il vise une baisse de 90 % des émissions en 2040 et la neutralité climatique en 2050. Énergie : « la France a besoin des deux » — un grand plan pluriannuel pour toutes les renouvelables et le nucléaire conforté, avec la « construction à temps de nouvelles unités » ; une partie de la facture d'électricité serait indexée sur le coût de production plutôt que sur le prix de marché. Il interdit les pesticides les plus néfastes (glyphosate, néonicotinoïdes) et les PFAS, crée des zones sans pesticides autour des captages et des écoles, s'oppose au Mercosur, et porte une loi contre la fast-fashion. Transports : fin des exonérations de taxe sur le kérosène, extension de l'interdiction des vols intérieurs, taxation des jets privés, yachts et SUV, moratoire sur les grands projets autoroutiers.","europe":"Européen convaincu à l'« ambition fédérale », il veut supprimer le droit de veto dans l'UE, un grand emprunt européen et une « défense européenne souveraine » : proposer d'étendre la dissuasion nucléaire française aux partenaires de l'Union, la France gardant seule la décision d'emploi, et un budget militaire en hausse vers 3 % du PIB. Il veut « augmenter drastiquement » l'aide militaire à l'Ukraine, saisir les avoirs publics russes gelés, refuse toute normalisation avec Poutine et veut que l'Europe cesse de « négocier à genoux » face à Trump. Il porte l'aide publique au développement à 0,7 % du RNB. Sur Gaza, il parle de crimes de guerre et contre l'humanité sans employer « génocide », veut que Netanyahou soit « déféré devant la justice internationale » et la remise en cause de l'accord UE-Israël.","institutions":"Il veut rééquilibrer le pouvoir vers le Parlement : Premier ministre investi par un vote de confiance, motion de censure « constructive » mettant fin au 49.3, suppression de l'article 16 et de l'article 40, proportionnelle instaurée « immédiatement » par circonscriptions régionales. Il crée un droit d'initiative citoyenne pouvant déclencher des référendums locaux et nationaux, généralise les conventions citoyennes et lance une grande convention citoyenne qui jettera les bases d'une assemblée constituante pour changer la Constitution. Il réforme le financement des partis par un « bon pour la démocratie » et limite la concentration des médias en réformant la loi de 1986.","societal":"Il défend une laïcité « principe d'émancipation » : neutralité des agents publics mais pas des usagers, laïcité garantie à l'école, abolition progressive des régimes dérogatoires à la loi de 1905. Il veut garantir l'autodétermination de genre et encadrer les parcours de transition, aligner les droits de filiation des couples LGBTQIA+ et interdire les thérapies de conversion dans l'UE. Il veut inscrire l'IVG dans la Charte européenne des droits fondamentaux. Sur le cannabis, il renvoie la question de la légalisation à une convention citoyenne sur les drogues. Contre les réseaux sociaux toxiques : interdiction avant 15 ans, autorité indépendante de protection des mineurs en ligne avec vérification d'âge, et bannissement de TikTok.","education":"Son « premier acte » serait une loi de programmation sur cinq ans pour l'école : revalorisation continue et planifiée des salaires de tous les enseignants, moins d'élèves par classe, rénovation du bâti face aux canicules, lutte contre les absences non remplacées et frein aux fermetures d'écoles rurales. Il intègre les établissements privés sous contrat à la carte scolaire pour renforcer la mixité sociale, sans couper leur financement. Il veut repenser en profondeur Parcoursup par une concertation, mieux encadrer l'enseignement supérieur privé lucratif, lancer une convention citoyenne pour l'École et instaurer un service civique obligatoire de dix mois pour tous les jeunes (la dimension militaire restant volontaire)."},"scores":{"eco":6.5,"social":7,"immigration":6.5,"securite":7,"env":7,"europe":7.5,"institutions":7,"societal":7,"education":6.5},"bloc":"gauche","declared":"2026-08-23"},
    {"name":"Olivier Faure","party":"Parti socialiste (PS)","status":"retiré","color":"#E91E63","oneLiner":"Premier secrétaire du PS : éliminé au 1er tour de la primaire le 11 octobre (14,48 %) après une campagne « à gauche toute » (livre « La Loi du plus juste » : Smic à 1 700 €, taxe Zucman, 62 ans, régularisation massive des sans-papiers, génocide à Gaza). Reste à la tête du PS et s'est engagé à soutenir Glucksmann.","program":{"eco":"Dans « La Loi du plus juste » (septembre 2026), Faure porte une ligne « à gauche toute » : Smic à 1 700 € net, conférence salariale où l'État conditionne ses aides aux hausses de salaires, et règle « un euro de dividende = au moins un euro pour les salariés » imposée par la loi. Le projet socialiste qu'il a fait adopter (juin 2026) ajoute un écart de salaires plafonné de 1 à 20 et la codétermination (la moitié des administrateurs salariés dans les entreprises de plus de 500 salariés). Il impose la taxe Zucman de 2 % au-delà de 100 millions d'euros (jugeant le seul retour de l'ISF insuffisant), crée un impôt sur les grandes successions (abattement unique de 200 000 € sur la vie), rend l'impôt sur les sociétés progressif et veut « faire cotiser l'IA » pour financer retraites et protection sociale. Il refuse toute baisse des cotisations et défend les 35 heures. Il abroge immédiatement la réforme Borne, revient à 62 ans, abaisse l'âge du taux plein de 67 à 65 ou 66 ans et refuse la capitalisation individuelle.","social":"Il propose une hausse du RSA et de l'AAH et une « Grande Sécu » : une mutuelle publique gérée par la Sécurité sociale rembourse intégralement un panier de soins et de médicaments essentiels, avec un reste à charge zéro. Contre les déserts médicaux, il régule l'installation des médecins libéraux (installation impossible dans les zones déjà bien pourvues sauf remplacement d'un départ) et développe les centres de santé avec médecins salariés. Sur le logement, il programme des constructions massives, encadre les loyers, simplifie la réquisition des logements vacants (ouverte aux collectivités) et s'oppose aux facilités d'expulsion. Il met en avant la sécurité sociale de l'alimentation et propose une convention citoyenne sur les drogues ouvrant la voie à une légalisation encadrée du cannabis, sous contrôle strict de l'État.","immigration":"Faure veut une régularisation massive des travailleurs sans papiers sur le modèle espagnol (un chiffre de 500 000 « ne le choque pas »), le projet PS prévoyant un titre de séjour pour tout étranger disposant d'un contrat de travail depuis au moins six mois ; « l'économie française ne tourne pas toute seule ». Il planifie l'immigration par une loi pluriannuelle et un secrétariat d'État rattaché au Premier ministre, renforce les voies légales d'entrée (étudiants, chercheurs, artistes) et vise « pas un mineur à la rue ». Il s'oppose à la réduction de l'immigration légale, à la suppression de l'AME et aux restrictions du droit du sol, et défend le regroupement familial. Il étend le droit de vote des étrangers extra-européens aux élections locales et veut réformer le règlement de Dublin avec une répartition obligatoire des demandeurs d'asile.","securite":"Il s'oppose aux peines planchers et au jugement des mineurs de 16 ans comme des majeurs, et affirme qu'il existe « un racisme structurel au sein des forces de police ». Il renforce l'indépendance du parquet (avis conforme du Conseil supérieur de la magistrature pour toutes les nominations) et défend une autorité indépendante pour les enquêtes sur les violences policières. Le projet PS promeut les peines alternatives en milieu ouvert et la réinsertion, tout en rénovant l'ensemble du parc pénitentiaire et en construisant de nouvelles places pour garantir la dignité de la détention. Contre le narcotrafic, il veut renforcer la police judiciaire et doter le parquet national anticriminalité organisée (PNACO) des moyens nécessaires.","env":"Faure fait du « socialisme écologique » le cœur de son projet : « règle d'or verte » interdisant tout investissement ou aide publique contraire aux objectifs climat et biodiversité, grand fonds d'investissement écologique et « sécurité sociale climatique » pour indemniser les victimes du dérèglement. Il vise un mix 100 % décarboné en 2050 selon la règle « le nucléaire autant que nécessaire, les renouvelables autant que possible », avec un parc nucléaire historique partiellement renouvelé. Le projet PS prévoit un leasing social de voitures électriques pour accompagner les ZFE, l'interdiction des vols intérieurs quand le train fait le trajet en moins de 4 heures, l'alignement de la taxe sur le kérosène et l'élimination du glyphosate, des néonicotinoïdes et des PFAS. Il veut reconnaître l'écocide dans le code pénal avec un parquet environnemental spécialisé.","europe":"Faure soutient l'Ukraine (défense aérienne, munitions, saisie des avoirs russes) pour une paix « pas à n'importe quel prix ». Il veut une Europe-puissance : budget européen triplé à 3 % du PIB européen, nouvel emprunt commun de 500 milliards d'euros, fin de la règle de l'unanimité, renforcement du « pilier européen de l'OTAN » et intégration européenne progressive des armées et de leur commandement. Il assume un protectionnisme sectoriel (droits de douane stricts pour l'automobile, la sidérurgie, la chimie, les médicaments face à la Chine et aux États-Unis) et refuse l'accord UE-Mercosur. Il qualifie la situation à Gaza de génocide, juge la reconnaissance de la Palestine « juste et tardive » et veut suspendre l'accord d'association UE-Israël, sanctionner les ministres de Netanyahou et les colons violents et imposer un embargo strict sur les armes. Il défend l'harmonisation fiscale européenne et une hausse de l'aide au développement.","institutions":"Le projet socialiste que porte Faure instaure une proportionnelle de type allemand aux législatives, abaisse le droit de vote à 16 ans et l'étend aux étrangers extra-européens aux élections locales. Il crée un référendum d'initiative citoyenne (RIC), préparé par un Conseil de la société civile comprenant 150 citoyens tirés au sort, abaisse le seuil du référendum d'initiative partagée à 1 million de signatures et expérimente le « préférendum ». Il « déprésidentialise » le régime : le Premier ministre devient chef de la majorité et détient le droit de dissolution, le 49.3 est supprimé hors budgets de l'État et de la Sécu, le vote bloqué et le recours aux ordonnances sont limités. Une élection où les votes blancs dépassent 50 % serait invalidée. Il limite aussi la concentration des médias.","societal":"Faure propose une commission « vérité et réconciliation » sur la colonisation ; le projet PS veut reconnaître la colonisation comme crime contre l'humanité et le 17 octobre 1961 comme crime d'État, et créer un musée national de l'histoire de la colonisation. Il assume le terme d'« islamophobie ». Il soutient l'aide à mourir, un accès à l'IVG universel et gratuit partout, et la rectification du genre à l'état civil par une procédure administrative rapide fondée sur l'autodétermination (modèle allemand), mais refuse et veut interdire la GPA. Sur la laïcité, il s'oppose à l'interdiction des signes religieux pour les usagers des services publics et défend l'éducation à la sexualité obligatoire.","education":"Il abroge Parcoursup au profit d'une procédure nationale, publique et transparente d'accès au supérieur, et fait de la mixité sociale une priorité : carte scolaire redéfinie avec la mixité comme critère, y compris pour le privé sous contrat, qu'il continue de financer « à condition qu'il y ait de la mixité sociale ». Il lance un plan d'urgence pour l'éducation avec revalorisation des enseignants et recrutements, et propose des États généraux par académie après la mobilisation lycéenne."},"scores":{"eco":7.5,"social":8,"immigration":7.5,"securite":7.5,"env":7,"europe":7,"institutions":7,"societal":7.5,"education":7},"bloc":"gauche"},
    {"name":"François Hollande","party":"Parti socialiste (PS)","status":"pressenti","color":"#F06292","oneLiner":"Ancien président, député de Corrèze : non déclaré, n'a pas concouru à la primaire ; livre-programme « Unir » (3 septembre : 63 ans, TVA à 24 %, baisse des cotisations salariales, contribution sur les successions > 10 M€, part de capitalisation) ; décision annoncée pour fin décembre. A félicité Glucksmann, qui veut l'intégrer à son équipe.","program":{"eco":"Dans « Unir » (3 septembre 2026, 80 à 100 propositions), Hollande assume une inflexion sociale-libérale et une « politique de l'offre » : baisse des cotisations salariales pour rapprocher le net du brut (salaires relevés d'environ 10 % selon lui), financée par une hausse progressive du taux normal de TVA de 20 à 24 %, la fin du taux réduit de 5,5 % (alimentation, énergie, carburants) et une contribution sur les grosses successions et les patrimoines de plus de 10 millions d'euros. Il rejette la taxe Zucman, « un slogan, pas une réponse », veut baisser les impôts de production en réduisant les aides aux entreprises et porter à 30 % la part d'administrateurs salariés. Il revendique le sérieux budgétaire et exclut toute coalition avec LFI.","social":"Hollande refuse le retour à 62 ans défendu par le PS : âge légal « aux alentours de 63 ans » au 1er janvier 2028, puis allongement progressif de la durée de cotisation, piloté par les partenaires sociaux et indexé sur l'espérance de vie. Il propose de plafonner la revalorisation des pensions à 1 % pendant cinq ans (désindexation partielle au-delà d'un seuil de revenus) et d'ajouter une part de capitalisation gérée par les partenaires sociaux. Il crée une dotation « entrée dans la vie » de 10 000 € pour les jeunes en service civique et défend les allocations familiales dès le premier enfant. Son bilan comprend la complémentaire santé généralisée, le tiers payant et le compte pénibilité.","immigration":"Hollande tient une ligne de fermeté républicaine tempérée par l'humanisme : il a qualifié la loi immigration de 2024 de « défaite pour la République » tout en reconnaissant des mesures utiles. Il s'est opposé à la déchéance de nationalité et à la suppression de l'AME. Durant son mandat, il a appliqué la circulaire Valls encadrant les régularisations au cas par cas. Il défend une politique migratoire maîtrisée, articulée avec l'intégration et le droit d'asile.","securite":"Hollande assume une ligne régalienne : sous son mandat, création de postes de policiers, gendarmes et magistrats, état d'urgence après 2015 et renforcement de l'arsenal antiterroriste. Il avait porté un temps la déchéance de nationalité pour les binationaux terroristes, avant de l'abandonner. Pour 2027, il met en avant la capacité de l'État à garantir l'ordre républicain. Il articule fermeté et respect de l'État de droit.","env":"Son bilan comprend la loi de transition énergétique de 2015 (objectif de 50% de nucléaire dans le mix) et la COP21 aboutissant à l'Accord de Paris. Il défend son bilan nucléaire comme atout de souveraineté et de décarbonation. Il prône une transition compatible avec l'industrie et l'emploi, refusant une écologie punitive. Il soutient les renouvelables tout en maintenant le nucléaire.","europe":"Européen convaincu, Hollande fait de 2027 une élection à enjeu européen et veut une France qui affirme son indépendance vis-à-vis des États-Unis comme de la Russie. Il soutient l'Ukraine, défend le renforcement de la défense européenne et reste attaché à la dissuasion nucléaire française. Il plaide pour une Europe puissance capable de peser face aux États-Unis, à la Russie et à la Chine, et pour une « union sacrée des démocrates » pro-européenne, sans compromis avec LFI.","institutions":"Fidèle à 2012, il soutient une dose de proportionnelle à l'Assemblée. Il a fait adopter la loi sur le non-cumul des mandats de 2014. Il défend les institutions de la Ve République et un président garant de la cohésion, sans rupture radicale. Il valorise le rassemblement d'une gauche républicaine et réformiste.","societal":"Il revendique le mariage pour tous (loi Taubira de 2013) comme une avancée majeure. Il défend une laïcité conçue comme « école du respect » et liberté de croire ou non, qu'il veut enseignée à l'école. Il se situe dans une gauche de progrès, attachée à l'égalité femmes-hommes et à la lutte contre les discriminations. Il refuse l'instrumentalisation identitaire de la laïcité.","education":"Il fait de l'éducation, des universités et de la recherche le cœur de son projet 2027. Son quinquennat a créé 60 000 postes, refondé l'école et réformé les rythmes scolaires et le collège. Il défend la priorité au primaire et la réduction des inégalités scolaires précoces. Il veut réinvestir dans l'enseignement supérieur et la recherche."},"scores":{"eco":5,"social":5.5,"immigration":5.5,"securite":5.5,"env":5.5,"europe":6.5,"institutions":5.5,"societal":5.5,"education":5.5},"bloc":"gauche"},
    {"name":"François Ruffin","party":"Debout ! (gauche populaire, ex-LFI)","status":"déclaré","color":"#E63946","oneLiner":"Député de la Somme (Debout !), candidat maintenu malgré la porte fermée par Glucksmann. Programme « Nous président ! » : SMIC à 1 600 €, retraite à 60 ans, salaires indexés, six EPR2, 200 000 logements publics par an, encadrement des loyers partout. Défense européenne par coopération entre nations, sans sortie de l'OTAN. Convergences avec Villepin (Parcoursup, LBD). Quasi plus testé par les sondeurs.","program":{"eco":"Ruffin (Debout !) porte une gauche « travailliste », populaire et patriote. Son cahier sur les « travailleurs essentiels » promet le SMIC à 1 600 euros net, l'indexation des salaires sur l'inflation « comme cela a existé jusqu'en 1982 », la retraite à 60 ans avec un trimestre de plus par année passée dans un métier pénible, et une forte majoration des heures avant 8 h et après 18 h. Il propose une taxe de 4 % sur les dividendes des grandes entreprises (soumise à référendum), une forte taxation des grandes fortunes et s'oppose aux licenciements dans les entreprises qui versent des dividendes. Il défend un protectionnisme ciblé (« plan des 100 » : droits de douane, quotas et aides publiques sur 100 produits prioritaires) et la réindustrialisation. Pour l'agriculture, il veut une « exception agricole » : prix minimums garantis, importations interdites sous ces prix planchers, sortie des traités de libre-échange (Mercosur, CETA).","social":"Il défend un renforcement massif des services publics (hausse d'environ 20 % du budget de la santé, recrutement d'infirmières), le remboursement à 100 % des soins et s'oppose à la gestion privée des services publics. Pour le logement, il veut étendre l'encadrement des loyers à toutes les agglomérations puis à tout le territoire, produire 200 000 logements publics à loyer abordable par an (un million de logements à loyer réduit en cinq ans), en finir avec les passoires thermiques d'ici 2032 et taxer les meublés touristiques de 40 à 70 %. Il porte un « statut des travailleurs essentiels » (aides à domicile, livreurs, intérimaires) et la cantine et les transports gratuits dans les zones rurales.","immigration":"Ruffin adopte une approche humaniste qui se distingue d'une partie de la gauche : il rejette l'idée d'une immigration choisie destinée à combler les manques de main-d'œuvre. Il s'oppose à la fin du droit du sol, défend le regroupement familial et l'accès à l'asile. Il se dit favorable à une fermeté ciblée sur les auteurs de délits graves.","securite":"Il défend une justice pénale progressiste, avec des peines alternatives pour les délits non violents et une opposition aux peines planchers. Il réclame un contrôle indépendant des violences policières via une autorité détachée du ministère de l'Intérieur. Il reconnaît en même temps les attentes de sécurité des habitants des quartiers populaires.","env":"Ruffin défend un « travaillisme écologique » qui ne sort pas du nucléaire : prolongation des centrales tant que l'autorité de sûreté le valide, construction de six EPR2 et décision sur huit de plus selon le devis d'EDF, avec un éolien relocalisé et l'hydraulique, pour produire environ 800 TWh en 2050. Il vise 600 000 à 800 000 rénovations d'ampleur par an (budget de l'État multiplié par quatre, environ 15 milliards d'euros par an), un leasing social de petites voitures électriques françaises pour 3 millions d'automobilistes, et plus de trains. Il soumettrait à référendum l'interdiction de la publicité pour les produits les plus polluants et celle des vols intérieurs quand le train fait moins de 4 heures ; les ZFE seraient décidées localement. Il prévoit de sortir des pesticides de synthèse et des néonicotinoïdes, sans calendrier chiffré, et s'oppose à la loi Duplomb.","europe":"Il défend une « déclaration d'indépendance » d'inspiration gaulliste : faire passer l'Europe « du libre-échange vers la protection », sans sortir de l'UE, et refuser le vote à la majorité qualifiée en diplomatie et en défense, qui « relèvent des États ». Il fait d'une défense de l'Europe la priorité, mais par « une coopération entre des nations volontaires » et non par la Commission. Il critique la réintégration du commandement intégré de l'OTAN sans réclamer la sortie de l'Alliance. Il soutient les livraisons d'armes à l'Ukraine en posant une paix durable comme préalable, refuse de « prendre parti entre ces deux impérialismes » (États-Unis, Chine) et met en avant la souveraineté industrielle.","institutions":"Ruffin réclame une VIe République qui renforce le Parlement face à l'exécutif, la suppression de l'article 49.3, la proportionnelle et le référendum d'initiative citoyenne (RIC). Son cahier « séparation de l'argent et de l'État » encadre strictement le pantouflage (aucun retour dans l'administration, dix ans de « refroidissement » pour les ministres), impose une « empreinte de décision » publique sur chaque texte important, interdit cadeaux et invitations des lobbies et crée une Haute Autorité à la Probité dotée d'un pouvoir de sanction. Un ministre mis en examen quitterait immédiatement le gouvernement, et le cumul d'un poste de ministre avec un mandat exécutif local serait interdit.","societal":"Il soutient l'inscription de l'IVG dans la Constitution et l'accès élargi à l'avortement, l'aide à mourir encadrée et la protection du bien-être animal. Il défend une laïcité d'apaisement plutôt que de stigmatisation et met en avant l'unité populaire par-delà les origines. Il exprime davantage de prudence sur certaines questions liées au genre.","education":"Ruffin veut supprimer Parcoursup (« l'avenir ne peut pas être géré par un algorithme ») et mettre « de l'humain » dans l'orientation : plus de CPE, de psychologues et de conseillers d'orientation. Il exige zéro suppression de poste dans l'Éducation nationale et la sanctuarisation de sa part dans le budget de l'État, financée par une baisse du crédit d'impôt recherche et une révision du pacte Dutreil. Il réclame un plan d'urgence de rénovation des bâtiments scolaires, défend le droit de vote à 16 ans, la mixité sociale et s'oppose à l'uniforme obligatoire."},"scores":{"eco":8.5,"social":8.5,"immigration":6.5,"securite":7,"env":7,"europe":6.5,"institutions":8,"societal":6.5,"education":7.5},"bloc":"gauche","declared":"2026-01"},
    {"name":"Clémentine Autain","party":"L'Après (ex-LFI)","status":"retiré","color":"#C2185B","oneLiner":"Députée écosocialiste (L'Après), retirée de la course depuis le 11 juillet 2026 après l'échec de la primaire unitaire ; au 12/10, aucun soutien public à un candidat trouvé.","program":{"eco":"Autain (mouvement L'Après) propose un impôt plancher sur la fortune de 2% sur les patrimoines supérieurs à 100 millions d'euros (15 à 25 milliards attendus par an). Elle défend une hausse du SMIC, un écart salarial maximal de 1 à 20 et le retour de la retraite à 60 ans par répartition. Elle s'oppose aux baisses de cotisations patronales et a voté pour la nationalisation d'ArcelorMittal. Elle prône un État stratège pilotant l'économie au service des besoins réels.","social":"Elle propose le remboursement à 100% des frais de santé et la création de centres de santé publics avec médecins salariés contre les déserts médicaux. Elle augmente fortement les minima sociaux, porte l'AAH au niveau du SMIC et supprime l'obligation d'activité de 15 heures conditionnant le RSA. Elle maintient l'Aide médicale d'État et défend un accès garanti à l'alimentation, au logement, à la santé et à la culture.","immigration":"Autain s'oppose totalement à la réduction de l'immigration légale et défend une politique d'accueil généreuse. Elle veut accueillir davantage de demandeurs d'asile et les autoriser à travailler pendant l'examen du dossier, et a voté contre la loi immigration de 2023. Elle défend le droit du sol, s'oppose aux expulsions systématiques et soutient le droit de vote des étrangers aux élections locales.","securite":"Elle privilégie les peines alternatives pour les délits non violents et s'oppose aux peines planchers et au jugement des mineurs de 16 ans comme des majeurs. Elle réclame une autorité indépendante pour enquêter sur les violences policières. Elle est opposée à la création de nouvelles places de prison, préférant combattre la surpopulation carcérale.","env":"Autain fait de la transformation écologique une priorité, avec un objectif de 100% d'électricité renouvelable d'ici 2050, et est plutôt opposée au nucléaire (vote contre l'EPR2). Elle met fin aux subventions aux fossiles, taxe les superprofits pétro-gaziers, interdit progressivement les pesticides et l'élevage intensif, et vise l'interdiction des véhicules thermiques neufs en 2035. Elle défend la relocalisation comme impératif écologique et social.","europe":"Elle est opposée à la sortie de l'UE mais prône la désobéissance aux traités restrictifs pour transformer l'Europe de l'intérieur. Elle est favorable à la sortie de l'OTAN et opposée à un budget de défense à 3% du PIB. Sur l'Ukraine, elle reconnaît le caractère essentiel de l'aide militaire face à l'agression russe tout en privilégiant une approche diplomatique et multilatérale.","institutions":"Autain propose une VIe République avec une assemblée constituante et la suppression de l'article 49.3. Elle renforce les pouvoirs du Parlement, instaure le RIC et la proportionnelle intégrale. Elle abaisse le droit de vote à 16 ans et l'étend aux étrangers résidant régulièrement pour les élections locales.","societal":"Elle porte un féminisme affirmé : congé menstruel remboursé, élargissement et allongement de l'accès à l'IVG. Elle est favorable à la PMA élargie mais opposée à la GPA. Sur la laïcité, elle s'oppose à l'interdiction des signes religieux pour les usagers des services publics et dénonce la police du vêtement. Elle soutient l'interdiction de la corrida et l'éducation à la sexualité obligatoire.","education":"Elle est favorable à la suppression de Parcoursup, qu'elle qualifie de sélection industrielle. Elle s'oppose à la suppression de la carte scolaire au nom de la mixité sociale et défend un investissement massif dans l'école publique avec des embauches. Elle est opposée à l'uniforme obligatoire."},"scores":{"eco":9.5,"social":9.5,"immigration":9.5,"securite":9.5,"env":9,"europe":6.5,"institutions":8.5,"societal":9,"education":9.5},"bloc":"gauche"},
    {"name":"Karim Bouamrane","party":"PS · La France humaine et forte","status":"déclaré","color":"#EC407A","oneLiner":"Maire PS de Saint-Ouen, candidat déclaré depuis juin 2026 hors primaire, sur une ligne sociale-démocrate républicaine et ferme sur l'autorité ; la victoire nette de Glucksmann le 11 octobre réduit son espace ; quasi absent des sondages (moins de 1 % quand il est testé).","program":{"eco":"Bouamrane défend une ligne sociale-démocrate pragmatique, réputée favorable aux entreprises, qui réconcilie justice sociale et attractivité : « Je veux que travailler paye et permette de vivre dignement », en visant ouvriers, artisans, soignants et livreurs. Il veut simplifier l'action publique en réduisant les doublons administratifs et les normes, réduire les dépendances énergétique, industrielle, numérique et alimentaire, et garder une maîtrise française de l'intelligence artificielle, mise au service de la santé, de la formation et de la protection. Il met en avant le désendettement de sa commune comme preuve de rigueur. Son manifeste ne contient pas de mesure chiffrée sur la fiscalité, le SMIC ou les retraites.","social":"Il fait de l'accès digne au logement une priorité (construction, rénovation, accompagnement). Il veut lutter contre les déserts médicaux et garantir des soins de qualité quel que soit le revenu, tout en préparant le système au vieillissement. Il défend la protection des personnes âgées, en situation de handicap et LGBT+. Sa vision associe émancipation par le travail et protection sociale forte.","immigration":"« Une politique migratoire juste repose sur trois exigences » : accueillir dignement ceux qui ont le droit de rester, agir à la source par le développement et la coopération, et reconduire ceux qui se maintiennent irrégulièrement sur le territoire. Il affirme que « la France est de longue date une terre d'asile et elle doit le rester ». Il présente les plus de trois millions de binationaux comme une force pour l'influence de la France et refuse que les immigrés ou les musulmans soient associés d'office à l'insécurité ; il s'était opposé à la déchéance de nationalité en 2015.","securite":"La sécurité est sa marque de fabrique : à Saint-Ouen, il a multiplié par dix la police municipale, inauguré un commissariat en 2023 et instauré en juillet 2025 un couvre-feu à 22 h pour les moins de 16 ans non accompagnés. Il veut « re-sanctuariser l'autorité », garantir la sécurité sur tout le territoire et faire de la lutte contre le narcotrafic une priorité. Il fait de la protection des enfants une grande cause nationale (plus de 160 000 enfants victimes de violences selon son manifeste) et renforce la protection des femmes victimes de violences conjugales et sexuelles.","env":"Il prône une transition écologique « juste » qui ne pèse pas sur les classes populaires, misant sur la rénovation thermique des logements modestes et des emplois durables. Il rejette une écologie punitive. Il défend les agriculteurs contre des règles jugées inéquitables et la souveraineté alimentaire. Il lie transition écologique et réindustrialisation verte.","europe":"Il défend une Europe « qui protège ses citoyens et défend ses frontières », qualifiée de « bien commun le plus précieux », en refusant la technocratie. « J'augmenterai l'effort de défense », écrit-il, en revendiquant le rang de la France comme membre permanent du Conseil de sécurité et puissance nucléaire. Il inscrit la réduction des dépendances (industrielle, numérique, énergétique, alimentaire) dans un cadre européen. Ses positions sur l'Ukraine, l'OTAN ou le Mercosur ne sont pas détaillées.","institutions":"Il fait confiance aux maires, aux acteurs économiques, aux associations et aux bénévoles comme piliers de la démocratie de terrain, et réaffirme qu'il n'y a « rien au-dessus de la République ». Il veut simplifier l'action publique plutôt que refonder les institutions. Rassembleur revendiqué d'une gauche non mélenchoniste, il renvoie dos à dos LFI et le RN, qui « montent » les Français « les uns contre les autres », et veut éviter un second tour RN-LFI. Il a refusé la primaire PS-Place publique et se dit « le recours à gauche ».","societal":"Il défend une laïcité « fraternellement laïque », appliquée « sans compromis et sans instrumentalisation », protectrice de la liberté de chacun. Il combat le racisme, l'antisémitisme, la haine anti-musulmans et les discriminations, et veut protéger les personnes âgées, handicapées et LGBT+. Il a dénoncé à Saint-Ouen une ville qu'on était « en train de ghettoïser » et « d'ethniciser » par la fuite des classes moyennes. Ses valeurs cardinales : républicanisme, universalisme, émancipation par le travail.","education":"Il fait de l'éducation le « levier central d'égalité des chances » et défend une « démocratisation de l'excellence » ouverte à tous. Il veut des formations adaptées aux transformations du siècle, préparant à un emploi choisi. Il défend l'accès à la culture et à des espaces publics de qualité. Sa vision associe méritocratie républicaine et lutte contre le déterminisme social."},"scores":{"eco":5,"social":6,"immigration":6,"securite":5.5,"env":5.5,"europe":6.5,"institutions":5,"societal":6,"education":5.5},"bloc":"gauche","declared":"2026-06-09"},
    {"name":"Jérôme Guedj","party":"Parti socialiste (PS)","status":"retiré","color":"#F48FB1","oneLiner":"Député PS de l'Essonne, gauche « républicaine, universaliste, laïque » : dernier de la primaire le 11 octobre (5,83 %) ; avait porté une « grande Sécu » à 100 %, une immigration planifiée (« préférence travail ») et une ligne ferme sur l'Ukraine et contre LFI ; salue la victoire « éclatante » de Glucksmann.","program":{"eco":"Guedj défend une gauche républicaine de gouvernement attachée à la justice fiscale : « la vraie révolution fiscale » serait de réintroduire de la progressivité dans l'impôt, en mettant davantage à contribution grandes fortunes, grandes entreprises et revenus du capital. Il veut conditionner les aides publiques aux entreprises à des hausses de salaires. Il propose un plan d'investissement vert pour l'emploi et la réindustrialisation, compatible avec une gestion responsable des finances publiques.","social":"Guedj fait de la « grande Sécu » sa mesure phare : une « Sécurité sociale intégrale » remboursant à 100 % les frais de santé (panier de soins essentiels), rendant la complémentaire inutile. Il soutient l'abrogation de la réforme de 2023 mais récuse l'âge légal pivot : la retraite reposerait sur un nombre de trimestres modulé selon la pénibilité « au regard de chacune des fiches de poste », avec un âge du taux plein abaissé de 67 à 65 ou 66 ans et sans capitalisation individuelle. Il propose un statut des familles monoparentales (logement, garde d'enfants) et des allocations familiales dès le premier enfant. Il fait du grand âge un engagement majeur (droit à vieillir dans la dignité, lutte contre l'isolement) et défend l'hôpital et les services publics.","immigration":"Guedj veut « planifier l'immigration » par une loi pluriannuelle ciblant les secteurs en manque de main-d'œuvre comme l'hôtellerie-restauration, en défendant la « préférence travail plutôt que la préférence nationale ». Il s'inscrit dans une tradition socialiste d'accueil articulée à l'intégration républicaine, refuse la priorité nationale et combat le racisme et l'antisémitisme. Il se démarque de LFI sur les questions identitaires.","securite":"Il défend une approche de gauche de gouvernement conciliant fermeté républicaine et respect de l'État de droit et des libertés. Il inscrit la sécurité dans la défense des principes républicains plutôt que dans la surenchère, revendiquant une posture de responsabilité.","env":"Guedj défend une transition écologique populaire qui protège les classes populaires et moyennes sans leur faire supporter seules les coûts de l'adaptation. Il juge le nucléaire « incontournable » et veut une voiture électrique à 10 000-15 000 euros accessible à tous. Il propose un plan d'investissement vert conciliant emploi, réindustrialisation et réduction des dépendances stratégiques, et rattache l'écologie à la justice sociale plutôt qu'à une écologie punitive.","europe":"Guedj veut que l'Ukraine gagne la guerre et décide des conditions du cessez-le-feu : envoi de missiles SCALP, protection du ciel ukrainien et saisie des 210 milliards d'euros d'avoirs russes ; il récuse toute « paix munichoise ». Il prône un pôle européen de défense et de souveraineté sur les armements, un « protectionnisme intelligent, européen » et la rupture avec les traités de libre-échange comme le Mercosur. Avec les États-Unis, il défend « l'émancipation » plutôt que la rupture. Au Proche-Orient, il soutient la solution à deux États, condamne le Hamas comme la colonisation et l'étranglement de Gaza.","institutions":"Guedj revendique une approche de gouvernement et le courage de la nuance, refusant la logique protestataire. Il estime que le prochain président n'aura pas de majorité naturelle et qu'il faudra « construire des compromis républicains », y compris avec la droite selon les sujets, tout en excluant toute alliance avec LFI, dont il juge le chef, Jean-Luc Mélenchon, un « boulet » pour battre le RN. Il combat frontalement le Rassemblement national et défend les institutions et l'État de droit républicain.","societal":"Il fait de la laïcité un axe central, présentée comme un principe d'émancipation, de liberté de conscience et d'unité civique, et s'oppose au communautarisme. Il est un défenseur affirmé de la lutte contre l'antisémitisme et critique la ligne de LFI sur ces sujets. Il défend l'universalisme républicain contre les approches identitaires.","education":"Il place l'école parmi les services publics prioritaires : réduire les effectifs par classe, mieux rémunérer les enseignants, rénover les bâtiments scolaires et instaurer des temps de dialogue dans chaque établissement après la mobilisation lycéenne, en revoyant les consignes de maintien de l'ordre. Il défend l'école républicaine et laïque comme instrument d'émancipation et d'égalité, et cite la création de postes d'enseignants comme acquis du quinquennat Hollande."},"declared":"2026-08-23","scores":{"eco":7,"social":8,"immigration":7,"securite":7,"env":7,"europe":6.5,"institutions":6.5,"societal":7,"education":7},"bloc":"gauche"},
    {"name":"Marine Tondelier","party":"Les Écologistes (ex-EELV)","status":"déclaré","color":"#22A868","oneLiner":"Secrétaire nationale des Écologistes, candidate officielle mais sous réserve d'un référendum interne (10-13/12) entre candidature autonome et soutien à un autre candidat de gauche ; après l'échec de la primaire unitaire, elle prône l'union (« personne ne gagnera seul ») et dénonce le « repli » de Glucksmann ; surtaxe héritages > 4 M€ pour la « grande transition » ; 2-4 %.","program":{"eco":"Tondelier propose un « ISF climatique » modulé selon l'empreinte carbone des patrimoines et une contribution de 10 % sur les héritages de plus de 4 millions d'euros (+10 % au-delà de 13 millions), avec réduction du pacte Dutreil, soit 10 à 15 milliards d'euros par an fléchés vers « la grande transition ». Elle taxe les superprofits des grands pollueurs, vise un SMIC à 2 000 euros brut assorti d'un plan d'aide aux TPE-PME, et environ 140 milliards d'euros d'investissements annuels pour la transition. Elle s'oppose à la baisse des taxes sur les carburants et défend une loi de programmation climat aux objectifs contraignants.","social":"Elle abroge la dernière réforme des retraites pour revenir à 62 ans, avec l'objectif de 60 ans pour les carrières longues et pénibles, financé en reprenant une partie des exonérations de cotisations. Elle recrute environ 50 000 soignants, rouvre des lits et lance un plan santé mentale. Pour « un pays à hauteur d'enfant », elle crée un ministère de l'Enfance, interdit le lucratif dans l'aide sociale à l'enfance avec un accompagnement jusqu'à 25 ans, rend imprescriptibles les crimes sexuels sur mineurs, crée des centres uniques pour les victimes et met fin aux expulsions de familles avec enfants.","immigration":"Elle conteste tout lien direct entre immigration et délinquance et pointe les conditions économiques et sociales. Elle défend une régularisation large des sans-papiers installés et des travailleurs des métiers en tension, des voies légales et sûres pour les réfugiés et le maintien de l'AME. Elle soutient le droit de vote des étrangers non européens aux élections locales et rejette la « préférence nationale » comme toute restriction du droit du sol. Elle veut renforcer la lutte contre les discriminations, et sa ligne s'oppose frontalement au durcissement porté par la droite et l'extrême droite.","securite":"Sa conception privilégie la prévention et le social plutôt que la répression, refusant l'amalgame immigration-insécurité. Elle met l'accent sur la « sécurité environnementale », le crime d'écocide et une police de proximité. Elle plaide pour plus de formation des policiers (notamment sur les discriminations) et le traitement des causes sociales. Elle demande qu'on cesse de traiter les militants écologistes comme des délinquants.","env":"L'écologie est son premier axe, structurée par une loi de programmation aux objectifs contraignants de baisse des émissions. Elle vise la neutralité carbone (horizon 2040) via la rénovation thermique, l'essor des renouvelables et une sortie progressive du nucléaire au fil du déploiement des renouvelables. Elle veut interdire les pesticides de synthèse d'ici 2030 et le bio dans les cantines. Elle défend des alternatives à la voiture pour les zones mal desservies.","europe":"Elle veut transformer l'UE en une « Union écologique et sociale », dans la tradition fédéraliste européenne revendiquée par son programme, avec des règles budgétaires réorientées vers la transition. Sur la défense, elle propose un « haut conseil militaire intégré » rattaché au Conseil européen et accepte la hausse des dépenses militaires, à condition qu'elle soit financée par la « solidarité nationale » (taxation des très grandes fortunes, avoirs russes gelés) plutôt que par des coupes sociales. Elle veut réduire la dépendance de la France envers la Russie comme envers les États-Unis. Elle propose un veto sur les traités de libre-échange nuisibles au climat (contre le CETA et le Mercosur) et un fonds d'environ 10 milliards d'euros par an pour l'adaptation des pays du Sud.","institutions":"Elle porte une « Première République écologique et citoyenne » (programme des Écologistes présenté le 13 juillet 2026), proche dans l'esprit d'une VIe République : fin du « présidentialisme », Parlement au centre du jeu, Assemblée élue à la proportionnelle intégrale et indépendance de la justice « sacralisée ». Elle veut inscrire dans la Constitution des « éléments indispensables à notre vie commune », dont les objectifs climatiques. Elle défend le référendum d'initiative citoyenne pour proposer ou abroger des lois, un contrôle renforcé des élus et une lutte stricte contre les lobbies. Elle prône une forte décentralisation, avec des budgets importants pour les régions, pour une démocratie plus participative.","societal":"Elle défend fermement les droits LGBTQIA+ et l'égalité réelle entre femmes et hommes, avec des sanctions contre les entreprises qui ne respectent pas l'égalité salariale (parité visée d'ici 2032) et un congé parental égalitaire. Elle soutient l'éducation à la vie affective et sexuelle dès la maternelle. Sur la laïcité, elle défend une lecture libérale de la loi de 1905 (neutralité de l'État, liberté de conscience) : elle ne propose pas d'abroger la loi de 2004 sur les signes religieux à l'école, mais refuse toute extension des interdictions vestimentaires, qu'elle juge stigmatisantes. Elle inscrit ces combats dans la lutte contre les discriminations, y compris le racisme systémique.","education":"Elle veut revaloriser fortement les salaires enseignants (environ +20%) et réduire les effectifs par classe (autour de 20 élèves). Elle propose un enseignement obligatoire sur le climat et la biodiversité dès le primaire. Elle défend une allocation d'autonomie et la gratuité des transports pour les 18-25 ans. Elle promeut l'accès élargi à la culture."},"scores":{"eco":8,"social":8,"immigration":9,"securite":8.5,"env":9.5,"europe":8,"institutions":8,"societal":9,"education":8},"bloc":"gauche","declared":"2025-10"},
    {"name":"Delphine Batho","party":"Génération Écologie","status":"déclaré","color":"#7CB342","oneLiner":"Ancienne ministre, présidente de Génération Écologie, candidate déclarée depuis novembre 2025 sur une écologie de la sobriété et « de gouvernement », indépendante des autres partis ; soutient les marches pour la « sécurité climatique » ; absente des sondages et des grands débats de la rentrée.","program":{"eco":"Batho place la « décroissance » au cœur de son projet, rompant avec la poursuite de la croissance du PIB jugée incapable de réduire les inégalités. Elle défend une économie organisée autour des besoins essentiels, du bien-être et de la santé plutôt que de la consommation illimitée, et récuse le productivisme comme le greenwashing. Elle promeut une « décroissance énergétique » par la sobriété. Elle articule décroissance et protection sociale pour réduire les inégalités.","social":"Sa priorité sociale passe par la santé environnementale : lutte contre les pesticides, transparence sur les risques sanitaires, alimentation saine et respectueuse du vivant. Elle soutient la souveraineté alimentaire et une agriculture sans chimie de synthèse, créatrice d'emplois. Elle lie protection sociale et modèle de décroissance, redéfinissant le bien-être hors du seul pouvoir d'achat. Sa « politique de la beauté » inclut des jardins partagés dans les quartiers populaires.","immigration":"Députée écologiste, elle a voté contre la loi immigration de 2023, jugée trop restrictive. Elle a refusé d'associer sa voix à une motion de rejet instrumentalisée par la droite et l'extrême droite. Sa ligne est humaniste et opposée à la surenchère sécuritaire. Elle inscrit l'accueil dans une approche de droits humains liée à sa « république terrestre ».","securite":"Ancienne ministre déléguée à la Justice (2012) et secrétaire nationale du PS chargée de la sécurité, elle revendique une expérience régalienne pour « une écologie capable de gouverner ». Elle défend une sécurité compatible avec les limites planétaires et la souveraineté écologique. Elle articule sécurité et réduction des dépendances stratégiques. Son approche reste républicaine et attachée à l'État de droit.","env":"Elle prône la sortie des fossiles, la protection de la biodiversité et la réduction de la consommation par la sobriété. Sur le nucléaire, elle défend une sortie progressive « pragmatique », sans fermeture brutale, mais s'oppose radicalement aux nouveaux réacteurs, qualifiant de « folie » le programme de six EPR qu'elle veut stopper. Elle combat l'agriculture industrielle chimique. Elle vise une « souveraineté écologique » réduisant les importations destructrices.","europe":"Elle promeut une « souveraineté écologique » française et européenne : réduire la dépendance aux ressources, aux fossiles et aux importations destructrices. Elle veut une Europe capable de protéger la nature et de réduire ses dépendances stratégiques. Elle s'oppose aux reculs environnementaux européens (pesticides). Sa vision lie construction européenne et préservation du vivant.","institutions":"Elle veut construire une « République écologique » (ou « république terrestre ») fondée sur la souveraineté populaire et la lutte contre les lobbies. Elle érige l'habitabilité de la Terre en principe fondamental. Elle s'oppose au 49.3 et à la dérive présidentialiste. Elle plaide pour redonner du pouvoir aux citoyens face aux intérêts industriels.","societal":"Son positionnement est écoféministe, républicain et laïque, opposé aux obscurantismes et aux dominations. Elle développe une « politique de la beauté » valorisant le paysage, l'esthétique urbaine et la qualité de vie comme méthode politique. Elle propose des jardins partagés, des projets artistiques et des événements culturels gratuits. Elle critique la surconsommation et le productivisme.","education":"Elle défend l'accessibilité de la culture pour tous, notamment par la gratuité d'événements culturels, pour associer plus de citoyens au débat écologique. Sa « politique de la beauté » fait de l'art et du cadre de vie des leviers d'éducation. Elle veut sensibiliser largement aux enjeux écologiques en reliant culture, territoire et vie quotidienne. Son approche privilégie l'émancipation culturelle."},"scores":{"eco":8,"social":8,"immigration":6.5,"securite":7.5,"env":9.5,"europe":6.5,"institutions":7.5,"societal":7,"education":7},"bloc":"gauche","declared":"2025-11-25"},
    {"name":"Gabriel Attal","party":"Renaissance","status":"déclaré","color":"#FFB020","oneLiner":"Ancien Premier ministre, candidat Renaissance, distancé par Philippe (8 % en duel, 15-17 % seul selon l'Ifop). Il relance sa campagne sur la jeunesse (meeting de Lyon le 10/10, « pacte pour la jeunesse », +200 à 500 € pour les profs). Il propose des États-Unis d'Europe, 150 Md€ d'économies avec un frein d'urgence de 15 Md€, et des retraites sans âge légal. Il réclame une primaire et un candidat unique du bloc central en janvier.","program":{"eco":"Son plan de désendettement (23/09) prévoit 150 Md€ d'économies sur le mandat, dont deux tiers sur les dépenses sociales, et un « frein d'urgence budgétaire » de 15 Md€ activé dès son élection, avec une année blanche des prestations. Il vise un déficit sous 3 % avant la fin du mandat, l'équilibre des comptes sociaux en 2032 et de l'ensemble des finances publiques en 2037, sous une « double règle d'or » constitutionnelle. Il veut réduire l'écart brut-net par une baisse des cotisations financée par des économies sur le chômage et les arrêts maladie, et s'oppose à toute hausse du coût du travail. Il refuse toute hausse de la fiscalité de l'assurance-vie et des successions et veut faciliter les donations. Il promet une loi de programmation du logement sur cinq ans dès l'été 2027.","social":"Sur les retraites, il veut un système universel où « un euro cotisé ouvre les mêmes droits », sans âge légal : chacun partirait quand il le souhaite dès qu'il atteint un montant de pension minimal. Le système serait piloté par la durée de cotisation, avec « une vraie décote si vous partez tôt, une vraie surcote si vous partez tard ». Il ajoute une part de capitalisation, dont un fonds alimenté par 1 000 € versés par l'État à chaque naissance, et juge dépassée la retraite à 65 ans proposée par Philippe. En santé, il avance une complémentaire publique à un euro par jour pour les retraités et les revenus modestes, et des franchises pour les rendez-vous médicaux non honorés. Il maintient le conditionnement du RSA à 15 heures d'activité contre les « trappes à inactivité » et promet une loi de programmation du logement sur cinq ans dès l'été 2027.","immigration":"Il privilégie l'immigration de travail avec des quotas par secteur votés chaque année, veut restreindre le regroupement familial et durcir les conditions d'accès au séjour, tout en défendant le droit du sol. Il revendique la fermeté des « frontières » comme l'un de ses quatre chantiers (avec l'école, les salaires et l'IA) et la loi immigration de 2024 qu'il a portée comme Premier ministre.","securite":"Il veut abaisser à 16 ans la comparution immédiate et instaurer une composition pénale dès 13 ans, avec des « travaux d'intérêt éducatif » pour les moins de 16 ans. Il propose des sanctions scolaires renforcées (internats, notation sur Parcoursup) et une responsabilisation des parents (amendes, TIG). Sur les écrans, il veut faire respecter l'âge légal de 15 ans pour les réseaux sociaux. Il cible le séparatisme islamiste.","env":"Son plan « Messmer II » veut faire passer les énergies fossiles de près de 60 % de la consommation finale à 40 %, puis sous 30 % en 2035, pour la neutralité carbone en 2050. Il prévoit de sécuriser les 14 EPR et de construire un réacteur par an, d'accélérer les renouvelables par « neutralité technologique » et de viser une électricité à environ 75 €/MWh (moins de 50 pour les industriels exposés). Il ouvrirait le leasing social aux véhicules électriques d'occasion et aux pompes à chaleur, et assume la « planification ». Il donne cinq ans maximum pour adapter tous les établissements scolaires au changement climatique.","europe":"Il juge que l'Europe à 27 « a atteint ses limites » et propose des « États-Unis d'Europe » : un noyau dur (Allemagne, Italie, Benelux, Espagne, Portugal, pays nordiques et baltes, Pologne) qui fusionnerait économie, fiscalité, droit du travail, union bancaire et marchés de capitaux. Le projet serait validé par un premier référendum européen simultané, avec un Parlement et un président élu au suffrage universel pan-européen ; le régalien resterait national. Il défend un soutien ferme à l'Ukraine, financé par les avoirs russes gelés, et accuse le RN de défendre « les intérêts du régime du Kremlin ».","institutions":"Il réclame une primaire et un candidat unique du bloc central désigné en janvier, et appelle à un « vrai et large rassemblement », de la gauche sociale-démocrate à la droite républicaine. Il privilégie la coalition et le compromis plutôt que le passage en force. À Lyon (10/10), il propose un « nouveau pacte générationnel » de droits et de devoirs, dont un mois d'engagement civique pour chaque jeune avant 25 ans. Il a aussi évoqué une réduction du nombre de parlementaires et le remplacement du principe de précaution par un principe de progrès.","societal":"Il se prononce pour une « GPA éthique », encadrée et non lucrative. Il veut l'inscrire dans les conventions de Renaissance et ne l'exclut pas de son projet présidentiel, rompant avec la ligne d'Emmanuel Macron. Sur la laïcité, Renaissance a proposé sous sa direction d'interdire le voile aux mineures de moins de 15 ans dans l'espace public (« une petite fille ne choisit pas »), tout en refusant la stigmatisation religieuse. Il veut « aller au bout » de l'interdiction des réseaux sociaux avant 15 ans et accuse LFI de faire de la jeunesse « de la chair à canon politique ». Il porte aussi un plan de formation à l'IA visant 20 millions de salariés.","education":"Son « pacte pour la jeunesse et l'éducation » (Lyon, 10/10) prévoit moins d'élèves par classe et plus de professeurs devant les élèves, +200 à 500 € nets pour les enseignants en milieu de carrière et le remplacement des absents. Il garde un ministre en poste cinq ans, le certificat d'études pour entrer au collège, le brevet obligatoire pour le lycée et une « année passerelle ». Il veut les fondamentaux le matin et la culture et le sport à partir de 15 h, faire évoluer Parcoursup sans le supprimer, et des études supérieures plus courtes et professionnalisantes en supprimant ou transformant les licences à fort décrochage. Il ajoute un mois d'engagement civique avant 25 ans."},"scores":{"eco":3,"social":4,"immigration":4,"securite":3.5,"env":4,"europe":6.5,"institutions":4.5,"societal":5.5,"education":5},"bloc":"centre","declared":"2026-05-22"},
    {"name":"Édouard Philippe","party":"Horizons","status":"déclaré","color":"#00A0A0","oneLiner":"Ancien Premier ministre, candidat Horizons, toujours en tête du bloc central : 16 % face à Attal, 21-24 % seul (Ifop, fin septembre), qualifié au second tour derrière Le Pen mais sans dynamique. Ligne : retraite à 65 ans et 45 annuités (29/09), immigration légale divisée par deux et moratoire sur le regroupement familial, 250 000 postes de fonctionnaires en moins, une vingtaine d'ordonnances dès juillet 2027 ; refuse la primaire et propose une rencontre de la droite et du centre en novembre.","program":{"eco":"Philippe fait du redressement des comptes sa priorité : ramener le déficit de plus de 5 % à 2 % du PIB en fin de quinquennat, avec une règle d'or constitutionnelle et un effort porté pour moitié par les dépenses sociales et pour un quart par les collectivités. Il propose un « pacte fiscal » (50 Md€ de baisse des impôts de production contre 50 Md€ d'aides publiques en moins), aucun nouvel impôt ni nouvelle norme sur le quinquennat, et le non-remplacement d'un fonctionnaire sur trois partant à la retraite (environ 250 000 postes en cinq ans). Pour gagner plus en travaillant plus, il défiscaliserait et exonérerait les heures supplémentaires (environ 1 000 €/an pour deux heures de plus par semaine au Smic) et laisserait les entreprises fixer leur durée du travail par accord. L'indemnisation chômage passerait de 18 à 12 mois.","social":"Retraites (projet du 29/09/2026) : reprendre la réforme de 2023, puis porter progressivement, en moins de dix ans, la durée de cotisation à 45 ans et l'âge légal à 65 ans « pour ceux qui le peuvent ». Un Français sur trois pourrait encore partir entre 60 et 64 ans ; les âges de départ pour handicap (55), incapacité (60) et invalidité (62) et l'annulation de la décote à 67 ans seraient maintenus. Il ajoute un pilier de capitalisation (10-15 % des pensions à terme) : fonds collectif obligatoire alimenté par les excédents de l'Agirc-Arrco, PER généralisé et 500 € versés par l'État au premier contrat de travail. Les partenaires sociaux gèreraient le régime, avec un gain estimé à 30 Md€/an. Famille : allocation unique de 350 €/mois dès le premier enfant, réduction d'impôt d'environ 3 000 € pour les familles qui travaillent, prêt à taux zéro à chaque naissance et temps partiel parental « 80 % payé 100 » pendant deux mois.","immigration":"Il veut diviser par deux l'immigration légale, sous 200 000 titres de séjour par an comme avant 2010, sans viser zéro, car la France a besoin d'immigration de travail (quotas économiques). Il propose un moratoire, pendant le quinquennat, sur l'immigration familiale (regroupement familial) et un protocole additionnel à la CEDH sur le droit à une vie familiale normale. Il veut aussi dénoncer l'accord franco-algérien de 1968, créer une liste « XXL » de pays sûrs dont les ressortissants ne pourraient pas demander l'asile, exiger une preuve de ressources des étudiants étrangers et expulser immédiatement les étrangers délinquants. Il n'exclut pas un référendum si la Constitution doit être modifiée et maintient le droit du sol, sauf à Mayotte où il le suspendrait.","securite":"Son programme « Pour une France plus sûre » veut refonder la Justice « de fond en comble » : recrutement des magistrats ouvert à d'autres profils, révision du CSM, « devoir de redevabilité » envers les victimes et autorité du garde des Sceaux sur le parquet, avec des instructions individuelles possibles aux procureurs. Il supprimerait le juge d'application des peines et rétablirait les courtes peines dès la première infraction, avec des peines planchers pour les infractions les plus graves. Contre le narcotrafic, il propose un « état d'urgence narco » limité dans le temps et l'espace (jusqu'à la reconnaissance faciale ciblée), une « fiche S financière », la mobilisation de la DGSI et pour les grands trafiquants un régime d'application des peines aligné sur celui des terroristes. Pour ces faits, l'excuse de minorité serait levée et les mineurs passeraient en comparution immédiate. Les maires recevraient un pouvoir de sanction pour les incivilités. Côté défense, il vise 250 000 réservistes (contre 45 000), 50 000 places de service militaire volontaire par an et une loi de programmation militaire « de la massification » (drones, munitions).","env":"Il défend une écologie « non punitive » adossée à un plan d'environ 80 milliards sur cinq ans (rénovation thermique, renouvelables). Il fait de la relance du nucléaire un pilier de la souveraineté énergétique (6 à 8 nouveaux EPR). Il inscrit l'énergie parmi les piliers de sa « souveraineté intégrale » européenne. Son approche privilégie l'investissement plutôt que la contrainte réglementaire.","europe":"Il prône une « souveraineté intégrale » européenne (technologie, défense, énergie, finance) : doubler en cinq ans la capacité de calcul européenne souveraine, achever le marché unique et bâtir une union des marchés de capitaux. Face à une concurrence chinoise jugée déloyale, il veut protéger le marché européen par des transferts de technologie, des quotas de production et des coentreprises dans les secteurs stratégiques, et faire émerger des champions européens (automobile, sidérurgie, nucléaire). Il défend un effort militaire porté vers 3 % du PIB et une préférence européenne dans la commande publique. Il fait du soutien à l'Ukraine un marqueur central et a exprimé sur France 2, le 8/10, un « désaccord majeur » avec la politique du gouvernement israélien à Gaza.","institutions":"Sa méthode : une fois élu, dissoudre l'Assemblée et présenter des candidats uniques de la droite et du centre dans les 577 circonscriptions, sous une bannière commune (« nouveau parti » ou « confédération de partis »). Il présenterait ensuite une vingtaine d'ordonnances lors d'une session extraordinaire en juillet 2027 (retraites, justice, école, santé). Le référendum reste possible (immigration, règle d'or) mais n'est plus central pour les retraites. Il refuse toute primaire avec Attal ou Retailleau et propose une rencontre des chefs de la droite et du centre début novembre. Il défend un président qui « préside et ne gouverne pas » et refuse la proportionnelle intégrale.","societal":"Il défend une laïcité d'exigence : neutralité absolue de la puissance publique, liberté de conscience et de pratique. Il se pose en réformateur rejetant le « moralisme de gauche » comme l'« identitarisme de droite ». Il reste opposé à la GPA, « une forme de marchandisation », et reconnaît ne pas avoir assez pris au sérieux les violences sexistes et sexuelles par le passé. Son programme fait de la protection de l'enfance une priorité : protection immédiate pour chaque plainte concernant un enfant, « droit de savoir » des parents sur les antécédents des adultes en contact avec leurs enfants (inspiré de la Sarah's law), crimes sur mineurs imprescriptibles, certificats d'honorabilité généralisés dans le périscolaire et fermeture des sites qui laissent prospérer le proxénétisme en ligne.","education":"L'école est l'une de ses trois priorités. Il veut faire des chefs d'établissement les « véritables patrons de l'école » (méthodes, horaires, uniforme, discipline, recrutement et évaluation des enseignants) et revaloriser « massivement » le métier de professeur, avec un nouveau recrutement et une nouvelle formation. Il propose des journées plus courtes, plus de sport et de culture, des vacances d'été raccourcies et un primaire recentré sur lire, écrire, compter. S'y ajoute un service public universel de soutien scolaire (assistant IA, brigades d'anciens professeurs et d'étudiants). Il juge Parcoursup « stressant » et certaines revendications lycéennes « légitimes »."},"scores":{"eco":2.5,"social":3.5,"immigration":3,"securite":3,"env":4,"europe":5.5,"institutions":3.5,"societal":4.5,"education":4},"bloc":"centre","declared":"2024-09-03"},
    {"name":"Bruno Retailleau","party":"Les Républicains (LR)","status":"déclaré","color":"#0066CC","oneLiner":"Candidat LR investi (avril 2026), réélu sénateur de Vendée le 27/09 (recours en cours). Ligne de « rupture » : pacte constitutionnel par référendum (le peuple pourra « censurer la censure »), suppression du droit du sol, retraite à 63 ans minimum et taux plein à 65 ans indexé, capitalisation pour les jeunes, -30 Md€ de charges ; refuse tout rassemblement derrière Philippe ; 7-10 % (Toluna-Harris, 5-8/10).","program":{"eco":"Il veut « renverser la table » : 100 à 150 Md€ d'économies sur la dépense publique sans hausse d'impôts (« L'impôt n'est pas la solution, il est le problème »), suppression de 250 000 à 300 000 postes de fonctionnaires grâce au numérique et à l'IA, baisse de l'aide au développement. Côté travail : 30 Md€ de baisse de charges dès la première heure, zéro cotisation à partir de la 36e heure (« brut = net »), sortie du cadre des 35 heures, suppression de la C3S, de la CVAE et du forfait social. Pouvoir d'achat : suppression des certificats d'économies d'énergie (≈ -15 c/l de carburant), fin des subventions aux renouvelables matures, barème kilométrique revalorisé. Il propose aussi de baisser les droits de succession et de supprimer massivement les normes.","social":"Retraites : âge minimal de départ à 63 ans avec une décote de 7 % par an, taux plein automatique à 65 ans (au lieu de 67) même sans toutes les annuités, puis indexé sur l'espérance de vie ; pénibilité négociée avec les partenaires sociaux ; 40 Md€ d'économies sur cinq ans ; pilier de capitalisation d'environ 25-30 % pour les jeunes actifs. Il réclame le retour de la réforme de 2023 dans le budget 2027 tout en refusant un « appauvrissement des retraités ». Allocation sociale unique plafonnée à 70 % du SMIC, aides conditionnées à cinq ans de résidence et de travail pour les étrangers. Logement et natalité : intérêts d'emprunt déductibles selon le nombre d'enfants (50/75/100 %), relance du PTZ, réforme de la loi SRU, objectif d'un million de logements en plus sur le marché en cinq ans.","immigration":"Cœur de son projet : faire décider la politique migratoire par les Français, par référendum après révision constitutionnelle. Il veut supprimer le droit du sol (« On ne peut pas devenir Français par hasard »), naturaliser seulement sur critère d'assimilation, fixer des plafonds migratoires, mettre fin au regroupement familial élargi, réserver les prestations aux étrangers présents depuis cinq ans, remplacer l'AME par une aide d'urgence et supprimer le droit au mariage pour les étrangers sous OQTF. Visas et aide au développement seraient conditionnés au retour des ressortissants expulsés, et un « bouclier constitutionnel » ferait primer le droit national sur le droit européen en matière migratoire. Il refuse toute alliance avec le RN.","securite":"Ancien ministre de l'Intérieur, il veut inscrire dans la Constitution une « Charte de l'ordre républicain » avec un droit à la sécurité, des peines minimales obligatoires pour les crimes et délits graves, la rétention de sûreté pour les personnes dangereuses et une sécurité renforcée en prison, puis faire voter une loi pénale par référendum. Il promet des places de prison supplémentaires, des prisons de haute sécurité pour les narcotrafiquants, la fin de l'excuse de minorité pour les crimes graves et des internats disciplinaires pour les élèves violents. Pendant les blocages de lycées, il a lancé le débat sur une interdiction de LFI, accusée de vouloir « organiser l'insurrection ».","env":"Il défend une écologie de droite et pronucléaire (« Produire en France, c'est la meilleure de toutes les solutions écologiques ») : relance du nucléaire, fin des subventions à l'éolien et au solaire jugés matures, abrogation de la PPE3 pour baisser la facture d'électricité. Il veut supprimer le principe de précaution de la Charte de l'environnement, supprimer l'Office français de la biodiversité, interdire les surtranspositions européennes, autoriser les retenues d'eau, les nouvelles techniques génomiques et les drones d'épandage, et supprimer le ZAN. Il dénonce les « écolos-bobos » qui feraient payer la transition aux plus modestes.","europe":"Il défend une Europe des nations, refuse une UE fédérale et de nouvelles normes contraignantes, et veut interdire les surtranspositions. Un « bouclier constitutionnel » ferait primer le droit national sur le droit européen en matière migratoire. Il veut reprendre le contrôle des frontières et réviser les règles migratoires européennes et Schengen. Il s'oppose à l'accord UE-Mercosur, jugé déloyal pour les agriculteurs. Attaché à l'Alliance atlantique avec plus d'autonomie stratégique, il soutient l'effort de réarmement.","institutions":"Il veut « renverser la table » avec un « pacte constitutionnel » soumis à référendum dès la rentrée 2027 pour « restaurer le régime » gaullien : une loi de révision et une « Charte de l'ordre républicain » (racines judéo-chrétiennes, droit constitutionnel à la sécurité). L'article 11 serait élargi à toute question législative et le seuil du référendum d'initiative partagée divisé par deux (≈2,5 millions de signatures). Après une censure du Conseil constitutionnel, le président pourrait redonner le dernier mot au peuple ou au Congrès pour « censurer la censure ». Un « bouclier constitutionnel » limiterait la primauté du droit européen. Il veut aussi supprimer des agences de l'État ou les obliger à se justifier tous les trois ans.","societal":"Il défend l'ordre, l'assimilation et les « racines judéo-chrétiennes de la France », qu'il veut inscrire dans une charte constitutionnelle avec la protection du patrimoine commun et des outils contre « toute forme de séparatisme et d'entrisme religieux ». Il veut interdire le voile, présenté comme un marqueur islamiste, dans les compétitions sportives, lors des sorties scolaires et dans les universités publiques, et cibler l'entrisme des Frères musulmans. Opposé à l'écriture inclusive et au « wokisme », il assume une réaffirmation du clivage droite-gauche ; son entourage évoque un référendum sur la loi sur l'aide à mourir.","education":"Il veut « refonder l'école » autour de quatre axes : les enseignants, la transmission des savoirs, la liberté des établissements et l'autorité (projet présenté le 31 août 2026). Il remet en cause le collège unique avec un examen d'entrée en sixième, des groupes de niveau, du rattrapage des acquis du primaire et la fin du passage automatique en classe supérieure. Il promet de rapprocher le salaire des enseignants de la moyenne européenne, en réformant des carrières aujourd'hui fondées sur l'ancienneté, et de créer 1 000 établissements publics « libres » sur la base du volontariat (programmes, rythmes, calendrier adaptés). Pour l'autorité : pouvoirs renforcés des chefs d'établissement et des conseils de discipline, établissements de réinsertion scolaire pour les moins de 16 ans exclus à répétition, internats disciplinaires, « contrat d'engagement des parents » et tenue commune. Il veut aussi combattre l'entrisme islamiste et le « wokisme » à l'école et à l'université, et revaloriser la voie professionnelle."},"scores":{"eco":1.5,"social":2.5,"immigration":1.5,"securite":1.5,"env":1.5,"europe":4.5,"institutions":3.5,"societal":2,"education":2.5},"bloc":"droite","declared":"2026-04-19"},
    {"name":"Xavier Bertrand","party":"Nous France (indépendant, ex-LR)","status":"conditionnel","color":"#1565C0","oneLiner":"Président des Hauts-de-France (Nous France, droite sociale) : a dit « Je le serai » mais n'est pas encore déclaré officiellement ; officialisation prévue entre mi-octobre et Noël, en indépendant, sans primaire ni ticket avec Philippe ; mise sur janvier pour s'imposer à droite et au centre.","program":{"eco":"Il défend une droite sociale et gaulliste, avec un recentrage de l'État sur ses missions essentielles. Il veut réduire la dépense publique et la dette tout en soutenant les entreprises et l'industrie. Il porte une « République des territoires » décentralisée face à un pouvoir jugé trop parisien. Il met l'accent sur le travail, le pouvoir d'achat et la réindustrialisation des régions.","social":"Il défend un modèle social protecteur mais responsabilisé : priorité aux classes moyennes et réduction des dépenses sociales (entretien au Figaro du 3 août 2026). Sur les retraites, il veut ajouter une part de capitalisation à la répartition. Il veut conditionner les aides et lutter contre la fraude. Ancien ministre de la Santé, il fait des déserts médicaux et de l'accès aux soins dans les territoires une priorité, avec un soutien à l'hôpital.","immigration":"Il porte une ligne ferme de maîtrise de l'immigration, recentrée sur les besoins du pays. Il veut expulser les étrangers délinquants et appliquer effectivement les obligations de quitter le territoire. Il défend le renforcement des frontières. Il lie sa fermeté à la lutte contre le terrorisme et l'islamisme.","securite":"Il fait de la sécurité une priorité régalienne. Il veut renforcer les effectifs de police et de justice, avec une grande fermeté pénale et un soutien aux forces de l'ordre et aux maires. Il cible la délinquance du quotidien et le narcotrafic. Il défend l'autorité de l'État partout sur le territoire.","env":"Il défend une écologie pragmatique et pronucléaire, s'appuyant sur le nucléaire pour la transition. Il porte une écologie des territoires accompagnant les industries et l'agriculture. Il refuse une écologie punitive. Il met en avant les solutions concrètes plutôt que les interdictions.","europe":"Position atypique à droite, il se dit favorable à un fédéralisme européen renforcé, à une défense commune et à une souveraineté stratégique de l'UE. Il veut une Europe plus intégrée sur le régalien et l'industrie. Il défend la fermeté sur les frontières extérieures. Il combine ambition européenne et défense des intérêts nationaux.","institutions":"Il porte une « République des territoires » et une forte décentralisation face à un État jugé « infichu de regarder au-delà du périphérique ». Il veut rapprocher les décisions du terrain et renforcer les collectivités. Il défend la restauration de l'autorité de l'État sur ses missions essentielles. Son mouvement Nous France se veut moderne et rassembleur.","societal":"Il défend l'autorité, la laïcité et le refus du communautarisme. Il se pose en opposant résolu à l'extrême droite. Il défend les valeurs républicaines et l'unité nationale. Il présente son mouvement comme jeune, moderne et rassembleur.","education":"Il veut restaurer l'autorité et le niveau scolaire et lutter contre le décrochage. Il défend l'égalité des chances dans les territoires, l'apprentissage et l'enseignement professionnel. Il porte la défense de la laïcité à l'école. Il met en avant l'exigence et la réussite de tous."},"scores":{"eco":3.5,"social":3.5,"immigration":3,"securite":2,"env":2,"europe":5,"institutions":4,"societal":3,"education":3.5},"bloc":"droite","declared":"2026-12"},
    {"name":"Laurent Wauquiez","party":"Les Républicains (LR)","status":"retiré","color":"#2874C4","oneLiner":"Président du groupe Droite républicaine à l'Assemblée, non candidat. Après avoir reconnu Retailleau comme « candidat légitime », il a tendu la main à Édouard Philippe le 1er juillet 2026 (il « peut incarner l'ordre et le sérieux »), sans soutien formel, et plaide pour une candidature unique de la droite (« Seul, LR ne gagnera pas »).","program":{"eco":"Président du groupe LR à l'Assemblée, il porte une ligne de rigueur budgétaire. Pour le budget 2027, il refuse la censure mais aussi toute hausse d'impôts sur les particuliers, les entreprises et les retraités, et propose 20 Md€ d'économies en plus des 43 Md€ du gouvernement : 50 000 postes de fonctionnaires en moins (3 Md€), 5 Md€ de coupes dans les agences « productrices de normes », RSA limité à deux ans pour ceux qui peuvent travailler (7 Md€), 5 Md€ sur les dépenses liées à l'immigration (hébergement d'urgence, AME transformée en aide d'urgence, aides conditionnées à deux ans de présence). Il veut fusionner les aides sociales en une aide unique plafonnée à 70 % du SMIC.","social":"Il veut lutter contre l'assistanat tout en préservant le modèle social. Le RSA serait limité à deux ans pour ceux qui peuvent travailler (7 Md€), les aides sociales fusionnées en une allocation unique plafonnée à 70 % du SMIC, et les aides aux étrangers conditionnées à deux ans de présence. Il défend la conditionnalité et la dégressivité des allocations, la lutte contre la fraude sociale et une réforme des retraites, mais refuse toute hausse de la fiscalité des retraités. Il veut maîtriser les dépenses sociales.","immigration":"Il porte une ligne très ferme, estimant possible d'économiser environ 5 milliards en régulant les dépenses sociales liées à l'immigration. Il veut restreindre l'aide médicale d'État et durcir les conditions de séjour et d'accès aux prestations. Il défend la réduction de l'immigration et les expulsions. Il veut durcir l'asile.","securite":"Il défend la fermeté pénale et le rétablissement de l'ordre, avec un fort soutien aux forces de l'ordre. Il veut des peines effectives, la construction de prisons et une tolérance zéro. Il lie insécurité et immigration irrégulière. Il met l'autorité de l'État au premier plan.","env":"Il défend une écologie pronucléaire et pragmatique, opposée à l'écologie punitive. Il soutient le nucléaire et l'agriculture et défend la ruralité. Il exprime des réserves sur le financement des renouvelables intermittents. Il privilégie les solutions industrielles et souveraines.","europe":"Il se situe sur une ligne souverainiste au sein de la droite, défendant une Europe des nations. Il refuse l'élargissement des compétences de Bruxelles et les normes contraignantes. Il veut reprendre le contrôle des frontières et défendre les intérêts français. Il prône la fermeté sur l'immigration au niveau européen.","institutions":"Président du groupe Droite républicaine à l'Assemblée, il n'est pas candidat. Il veut restaurer l'autorité de l'État et réduire fortement le nombre d'agences et d'opérateurs, avec 5 Md€ de coupes dans les agences « productrices de normes ». Après avoir reconnu Retailleau comme candidat légitime, il plaide depuis le 1er juillet 2026 (Le Figaro) pour « la logique du rassemblement » et une candidature unique de la droite et du centre. Il juge que « Seul, LR ne gagnera pas », que Retailleau est « en dessous de 10 % » et doit « savoir se retirer » si nécessaire, et qu'Édouard Philippe « peut incarner l'ordre et le sérieux » s'il s'émancipe de la macronie, sans lui apporter de soutien formel à ce stade. Sur le budget 2027, il refuse de censurer le gouvernement Lecornu et accuse le RN et la gauche de « chantage à la censure ».","societal":"Il défend les valeurs traditionnelles, la laïcité et l'identité française, avec une fermeté contre le communautarisme et l'islamisme. Il met en avant l'attachement à la ruralité et aux racines de la France. Il s'oppose au wokisme. Il inscrit son discours dans un conservatisme assumé.","education":"Il veut restaurer l'autorité, le niveau et le mérite à l'école, avec un retour aux fondamentaux et à la discipline. Il défend la revalorisation de l'apprentissage et de la voie professionnelle. Il porte la défense de la laïcité. Il met le mérite au centre du système éducatif."},"scores":{"eco":1.5,"social":2.5,"immigration":1.5,"securite":1.5,"env":1.5,"europe":4.5,"institutions":3.5,"societal":2,"education":2},"bloc":"droite"},
    {"name":"David Lisnard","party":"Nouvelle Énergie (ex-LR)","status":"déclaré","color":"#1E88E5","oneLiner":"Maire de Cannes et candidat de Nouvelle Énergie (ex-LR), émule revendiqué de Javier Milei (« déréguler, débureaucratiser, décentraliser », titres de séjour divisés par huit, retraite à 65 ans avec bascule vers la capitalisation, chèque-éducation). Il fait le buzz en octobre avec une cote d'environ 13 % sur Polymarket, mais reste entre 2 et 5 % dans les sondages (Ifop : 3,5 %). Il réclame une compétition ouverte de la droite et du centre et brigue un nouveau mandat à la tête de l'AMF.","program":{"eco":"Il résume son projet par « déréguler, débureaucratiser, décentraliser » et se réclame de la « rupture libérale » de Javier Milei. Il promet une réduction drastique de la dépense publique (objectif affiché : 200 Md€ d'économies) sans hausse des prélèvements, la suppression de la C3S et de la CVAE (11,5 Md€, pour diviser par deux les impôts de production, de 2 % à 1 % du PIB), une réforme des droits de succession sur les entreprises et la fin des surtranspositions européennes. Travail : un contrat unique remplaçant le CDI et le CDD, avec des indemnités de licenciement progressives, un Code du travail simplifié, des charges patronales négatives pour embaucher un allocataire du RSA depuis plus de deux ans, et un temps plein qui rapporte au moins 500 € de plus que le plus haut revenu d'assistance. Retraites : âge légal à 65 ans, socle par répartition avec un minimum vieillesse de 1 000 €/mois, et bascule progressive des autres régimes vers une capitalisation obligatoire (environ 116 Md€, près de 40 % des pensions à terme). Épargne : assurance-vie préservée et PEA assoupli.","social":"Il privilégie la responsabilisation et la subsidiarité. Les prestations non contributives seraient réservées aux étrangers ayant au moins cinq ans de séjour régulier, et des charges négatives remettraient au travail les allocataires du RSA. Le quotient familial serait déplafonné. Santé : doubler le nombre d'étudiants en médecine d'ici 2030, supprimer Parcoursup et les ARS (leurs moyens passant aux préfets et aux élus, les maires présidant les conseils d'administration des hôpitaux), garder la liberté d'installation des médecins mais avec un conventionnement différencié (actes mieux remboursés en zone sous-dotée), créer une maison de santé par canton et ouvrir l'accès direct aux infirmiers, kinés et pharmaciens. Logement : suppression de l'article 55 de la loi SRU (quotas de logements sociaux). Sur la fin de vie, il a salué l'opposition du pape Léon XIV à l'euthanasie (tribune du 5 octobre 2026).","immigration":"Il veut diviser par huit la délivrance de titres de séjour, fixer des quotas de main-d'œuvre qualifiée et faire trancher la politique migratoire par référendum. Il propose de revenir sur l'accord franco-algérien de 1968, de traiter les demandes d'asile dans les consulats à l'étranger, d'inscrire dans la Constitution la primauté du droit national en matière migratoire (sortie de la CEDH en dernier recours), de mettre fin à l'automaticité du droit du sol et de conditionner le regroupement familial à des ressources et à des tests d'intégration. Côté fermeté : rétablir le délit de séjour irrégulier, interdire la régularisation après une entrée clandestine, expulser systématiquement les étrangers condamnés pour délits graves et les fichés S, et porter la rétention à 24 mois avec davantage de centres. L'AME serait remplacée par une aide d'urgence (700 M€ d'économies) et les prestations non contributives conditionnées à cinq ans de séjour régulier.","securite":"Il veut supprimer les réductions de peine automatiques et les aménagements dès l'audience, rétablir les peines planchers pour les récidivistes, sanctionner dès la première infraction et doubler le nombre de procureurs, avec un budget de la justice séparé de celui de l'administration pénitentiaire. Pour les mineurs : majorité pénale abaissée à 16 ans, excuse de minorité inversée et comparution immédiate dès 13 ans pour les cas graves, internats disciplinaires fermés et travaux d'intérêt général dès le premier délit. Les communes volontaires pourraient armer leur police municipale, avec accès aux fichiers. Les forces de l'ordre devraient passer au moins 50 % de leur temps sur le terrain, appuyées par la vidéoprotection et l'IA de prévention, et des cellules anti-stupéfiants seraient placées sous l'autorité du préfet. Contre l'islamisme : interdire les Frères musulmans, contrôler les écoles hors contrat, expulser les prêcheurs radicaux et interdire le voile à l'université.","env":"Il défend une écologie « non punitive » et pronucléaire : prolonger les réacteurs jusqu'à 60 ans, construire de nouveaux EPR et des petits réacteurs modulaires, et ramener les renouvelables au droit commun, sans soutien spécifique. Plutôt que de nouvelles taxes, il prône une fiscalité carbone « pollueur-payeur » à prélèvements totaux constants, redistribuée aux perdants, et veut remplacer le principe de précaution par un principe de responsabilité. Président de l'AMF, il combat le ZAN au nom des territoires et critique les ZFE. Son projet territorial prévoit des « écorégions » organisées autour des bassins versants pour gérer l'eau et les ressources localement. Il refuse la décroissance et mise sur l'innovation (captage du CO₂, hydrogène), avec l'objectif de faire de la France le leader « bas carbone » du G20.","europe":"Il défend une Europe des nations et de la subsidiarité. Il veut négocier un « traité de démocratisation de l'Europe » qui redéfinit les compétences et renforce le Conseil européen et le Parlement, avec un référendum en cas de blocage de la souveraineté nationale par des règles supranationales. Il veut interdire les surtranspositions, imposer des clauses miroirs aux produits importés (d'où sa demande de renégocier le Mercosur), recentrer la PAC sur la souveraineté alimentaire et conditionner les transferts européens au respect de l'État de droit. Il propose des coopérations renforcées entre États volontaires (spatial, données, énergie décarbonée, recherche médicale) et un consortium pharmaceutique européen sur le modèle d'Airbus. Il ne remet en cause ni l'euro ni l'Alliance atlantique.","institutions":"Il porte une décentralisation radicale : transférer aux collectivités l'essentiel des compétences de l'État hors régalien, avec un pouvoir normatif local, et réduire le millefeuille à trois niveaux (État, grandes collectivités, bloc communal) par référendum constitutionnel. Son dernier schéma remplace les régions par treize « écorégions » calées sur les bassins versants. L'État serait recentré sur l'instruction, la sécurité, la justice, la diplomatie et la santé, avec des contraintes administratives divisées par deux, et le référendum trancherait les grandes questions (immigration, souveraineté). Sorti de LR le 31 mars 2026 pour être candidat sous l'étiquette Nouvelle Énergie, il réclame une grande compétition ouverte de la droite et du centre. Il brigue aussi un nouveau mandat à la tête de l'AMF (congrès du 23 au 25 novembre 2026).","societal":"Il est attaché aux libertés individuelles et locales, à la laïcité et à l'autorité. Il refuse le wokisme et le communautarisme. Il défend une France « respectée, indépendante et gagnante ». Il inscrit son projet dans une tradition libérale et républicaine.","education":"Il veut abroger la carte scolaire et instaurer progressivement un chèque-éducation utilisable dans le public comme dans le privé, avec la publication des résultats des établissements. Les chefs d'établissement recruteraient leurs équipes, géreraient leur budget et pourraient refuser des élèves, en contrepartie d'une évaluation publique. Les enseignants seraient augmentés de 20 % en cinq ans en échange d'une réorganisation du métier (présence accrue, formation continue, évaluation), et recrutés dans un corps unique de contractuels sur concours national. Il propose un certificat de fin de primaire conditionnant l'entrée au collège, un tronc commun exigeant (français, maths, langues, avec plus de place pour la philosophie, le sport et l'art), l'initiation au latin, au grec et à la philosophie dès le primaire, des classes d'excellence en maths et sciences dans chaque académie et le développement des bourses sociales et au mérite. Il défend aussi la neutralité religieuse des accompagnateurs scolaires et à l'université."},"scores":{"eco":0.5,"social":2,"immigration":2,"securite":2,"env":1.5,"europe":4,"institutions":3.5,"societal":3,"education":2.5},"bloc":"droite","declared":"2026-03-31"},
    {"name":"Gérald Darmanin","party":"Renaissance (ex-LR) · soutient Philippe","status":"retiré","color":"#F9A825","oneLiner":"Garde des Sceaux, non candidat depuis le 17 août et soutien d'Édouard Philippe, dont il défend l'aile « droite sociale » (opposé aux 67 ans). Il a durci la réponse pénale à la mobilisation lycéenne (circulaire du 2 octobre, responsabilité civile des parents).","program":{"eco":"Darmanin défend une ligne libérale de droite (moins d'impôts, moins de dépense, réduction du déficit) tout en assumant une inflexion sociale. Il soutient la poursuite de la réforme des retraites et a travaillé, avec Philippe, sur un plan de départs volontaires dans la fonction publique. Il justifie la discipline budgétaire par le coût de l'instabilité politique. Dans son projet de « droite sociale », il propose des mesures pour les familles comme une allocation dès le premier enfant.","social":"Avec son mouvement « Populaires », il se veut le héraut d'une « droite sociale » et d'un « nouveau contrat social » : natalité (allocation dès le premier enfant, scolarisation dès deux ans), santé mentale, parentalité. Sur les retraites, il s'oppose à un départ à 67 ans et juge réaliste un âge autour de 64 ans, « à quelques mois près ». Il dit vouloir en convaincre Édouard Philippe (entretien à La Voix du Nord). Il reste attaché à la maîtrise des comptes sociaux.","immigration":"Il est l'architecte de la loi du 26 janvier 2024 (durcissement du regroupement familial, restriction du titre « étranger malade »). Ministre de l'Intérieur, il a systématisé les OQTF et voulait « tarir l'immigration ». Il plaide pour une refonte du règlement de Dublin et un traité migratoire UE-Royaume-Uni sur la Manche. Il a évoqué un moratoire, des quotas et une remise en cause de certaines contraintes constitutionnelles et européennes.","securite":"Ministre de la Justice, il porte le projet de loi « SURE » qu'il présente comme une « révolution » pénale. Le texte rétablit les peines de moins d'un mois, supprime les aménagements automatiques, réserve le sursis simple aux primo-délinquants. Il simplifie l'échelle des peines de plus de 200 à quatre grands types. Il défend une ligne de fermeté et un renforcement des capacités carcérales.","env":"Il défend une écologie « pragmatique » adossée au nucléaire et rejette l'« écologie punitive ». Ministre de l'Intérieur, il a employé le terme d'« écoterrorisme » contre les militants radicaux (Sainte-Soline) et tenté la dissolution des Soulèvements de la Terre. Sa priorité relève surtout de l'ordre public. Il inscrit la transition dans une logique de souveraineté énergétique nationale.","europe":"Pro-européen de la majorité présidentielle, il met l'accent sur « l'Europe des frontières » et la maîtrise migratoire. Il réclame une réforme du règlement de Dublin et une position européenne commune (refuser les visas aux pays refusant les retours). Il a plaidé pour un traité migratoire UE-Royaume-Uni. Sa vision est celle d'une Europe protectrice sur le régalien.","institutions":"Garde des Sceaux, Darmanin a renoncé le 17 août à se présenter et soutient Édouard Philippe, « le mieux placé » du bloc central ; il a suspendu son adhésion à Renaissance. Il avait plaidé pour une primaire de la droite et du centre afin de battre l'extrême droite, et insiste sur la stabilité de la Ve République. Il se pose en représentant de l'aile « droite sociale » de la campagne de Philippe et a assorti son soutien de demandes de programme, notamment sur les retraites. Il défend un exécutif qui réforme vite, y compris par référendum sur l'immigration.","societal":"Il défend une laïcité de combat et la lutte contre le « séparatisme islamiste », thème de son manifeste de 2021. Catholique revendiqué, il met en avant l'ordre républicain et l'assimilation. Son virage « droite sociale » ajoute l'empathie, la natalité et le soutien aux familles. Il combine fermeté sur les valeurs et attention sociale.","education":"L'éducation est un axe central de son projet et de sa convention « Populaires ». Il propose la scolarisation obligatoire dès deux ans contre les inégalités précoces. Il inscrit l'école dans une logique d'autorité, de transmission et de laïcité. Il associe éducation, parentalité et natalité dans son « nouveau contrat social »."},"scores":{"eco":2.5,"social":3.5,"immigration":2.5,"securite":2,"env":3,"europe":5,"institutions":4.5,"societal":3.5,"education":3.5},"bloc":"centre"},
    {"name":"Nicolas Dupont-Aignan","party":"Debout la France (DLF)","status":"déclaré","color":"#144E8C","oneLiner":"Président de Debout la France, il a officialisé le 19 septembre 2026 à Yerres sa quatrième candidature, sous réserve des parrainages, en se présentant comme « le seul candidat » de la sortie de l'UE. Il prône la fin de l'aide à l'Ukraine, la sortie du marché européen de l'électricité et 40 centimes de moins sur le carburant (≈3 %).","program":{"eco":"Il défend un souverainisme économique : protectionnisme « intelligent », Made in France et commande publique orientée vers la production nationale (« Produire en France », objectif de 2 millions d'emplois relocalisés), avec le rétablissement du monopole public d'EDF et de la distribution du gaz. Pour le pouvoir d'achat, il veut augmenter de 8 % les salaires nets jusqu'à 3 SMIC en baissant les cotisations salariales, supprimer la TVA sur 50 produits de première nécessité et sur les taxes carburant (environ 40 centimes de moins par litre), et sortir du marché européen de l'électricité. Il rétablirait un impôt sur les très grandes fortunes (résidence principale exclue, investissements productifs en France déductibles), mais allégerait les successions (90 % de la valeur des entreprises transmises exonérée, résidence principale exonérée). Il vise un déficit sous 3 % grâce à 130 Md€ d'économies en cinq ans (contribution à l'UE, aide à l'Ukraine, agences et CESE supprimés, fraude). Il maintient l'âge de départ et la durée de cotisation à leur niveau actuel, et propose 10 000 € sur un livret retraite pour chaque nouveau-né.","social":"Il défend la Sécurité sociale et les services publics de proximité : arrêt des fermetures de lits, doublement des lits de réanimation (10 000), 12 000 médecins formés par an et une bourse en échange de 5 ans d'installation en zone sous-dotée. Il veut « nationaliser la politique de la dépendance » (+10 Md€ par an d'ici 2030, 80 000 postes en Ehpad, doublement des unités de soins palliatifs). Il indexerait les retraites au minimum sur l'inflation, et rendrait les allocations familiales universelles et indexées. En contrepartie, il plafonne les prestations des inactifs à 70 % du SMIC net et réserve les aides non contributives (RSA, aide au logement) aux étrangers ayant 5 ans de résidence (10 ans de cotisation pour le minimum vieillesse).","immigration":"Il veut rétablir les frontières nationales en sortant de Schengen (10 000 agents recrutés), supprimer le droit du sol par référendum, limiter strictement le regroupement familial et dénoncer l'accord franco-algérien de 1968. Il supprimerait l'AME, remplacée par un dispensaire d'urgence par département avant expulsion. L'asile ne pourrait être demandé qu'à la frontière, et plus aucun clandestin ni débouté ne serait régularisé. Il prévoit la double peine automatique pour toute condamnation à de la prison ferme, une immigration économique conditionnée au taux de chômage et un plafond annuel de naturalisations voté par le Parlement.","securite":"Sa ligne est très répressive : rétablir et étendre les peines planchers (agressions de policiers, gendarmes, pompiers, enseignants, soignants), instaurer une perpétuité réelle et organiser un référendum sur le rétablissement de la peine de mort pour les meurtres d'enfants. Il veut abroger l'ordonnance de 1945, abaisser la majorité pénale à 16 ans et suspendre les aides sociales des familles de mineurs délinquants. Il prévoit aussi la révocation automatique des sursis non respectés, la construction de prisons et un soutien total aux forces de l'ordre. Il lie la violence urbaine à un État trop faible et parle d'un « début de guerre civile ».","env":"Il est pronucléaire : maintenir au moins 70 % de nucléaire dans l'électricité, développer les réacteurs de génération IV et redéployer les 4 Md€ consacrés au solaire et à l'éolien. Il s'oppose aux grands parcs éoliens en mer. Il refuse l'écologie punitive : suppression des ZFE et des péages, aucune interdiction du thermique, et une prime aux véhicules sobres plutôt que des taxes. Il veut sortir du marché européen de l'électricité pour baisser les prix. Il défend une lutte « pragmatique » contre la bétonisation et protège les agriculteurs contre les normes européennes.","europe":"Il se présente comme « le seul candidat » de la sortie de l'Union européenne, « cette prison » : pétition puis référendum sur l'appartenance à l'UE, avec sortie si le peuple l'approuve, pour 15 Md€ d'économies par an. Il veut sortir de Schengen, du marché européen de l'électricité et du pacte asile-migration, rétablir la primauté du droit national et refuser définitivement le Mercosur. Il quitterait le commandement intégré de l'OTAN, sans quitter l'Alliance. Il porterait la défense à 2,5 % du PIB, en priorité pour la dissuasion et l'industrie nationale, et mettrait fin au SCAF. Il arrêterait toute aide militaire et financière à l'Ukraine au profit d'une paix négociée ; son programme ne tranche pas explicitement le sort de l'euro.","institutions":"La démocratie directe est au centre : un référendum d'initiative citoyenne sur la loi ou la Constitution dès un million de signatures (après six mois de débat), un référendum obligatoire pour toute révision constitutionnelle et un référendum révocatoire à mi-mandat, avec retour au septennat. Il veut que le vote blanc compte (scrutin reporté s'il est majoritaire) et que l'activation de la carte Vitale soit liée à la participation au vote. Il réduirait le Parlement à 500 députés et 300 sénateurs, et lierait la rémunération des élus à leur présence. Il veut aussi la neutralité politique des magistrats, avec des associations professionnelles à la place des syndicats.","societal":"Il défend la laïcité et l'assimilation contre le communautarisme et l'islamisme : interdiction de tous les signes religieux dans les administrations au sens large (écoles, universités, hôpitaux), et possibilité pour les entreprises de les interdire, mais pas d'interdiction du voile dans la rue. Sa ligne est conservatrice sur les questions de société : refus catégorique de la GPA, réserves sur la PMA pour toutes et sur l'aide à mourir, priorité aux soins palliatifs. Il met en avant l'identité, l'histoire et la cohésion nationales et refuse toute repentance.","education":"Il met l'autorité et l'exigence au centre : uniforme obligatoire, vouvoiement, interdiction des objets connectés et des signes religieux démonstratifs dans les établissements. Il prône le retour aux fondamentaux, des classes de niveau, un lycée réservé aux titulaires du brevet, l'apprentissage comme « cause nationale » et un enseignement de l'histoire recentré sur l'histoire de France. Il veut augmenter de 15 % en 4 ans le salaire net des professeurs, rétablir les bourses au mérite dès le lycée et créer des internats pour élèves méritants. Il accepterait les ouvertures de classes demandées par le privé."},"scores":{"eco":4.5,"social":4,"immigration":1,"securite":1.5,"env":2,"europe":4,"institutions":5.5,"societal":1.5,"education":3},"bloc":"droite","declared":"2025"},
    {"name":"Dominique de Villepin","party":"La France humaniste","status":"pressenti","color":"#5C6BC0","oneLiner":"Ancien Premier ministre, La France humaniste : pas encore déclaré mais revendique plusieurs centaines de parrainages ; positions marquées sur l'école (budget sanctuarisé, profs +10 %, mixité imposée au privé) et sur le maintien de l'ordre (fin des LBD contre les mineurs, aux côtés de Ruffin) ; 2,5-6 % selon les hypothèses.","program":{"eco":"Villepin, tenant d'un gaullisme social et d'un État stratège, défend une plus forte contribution des plus riches via un ISF adapté et soutient la logique d'une taxe Zucman ainsi qu'une contribution sur les successions supérieures à 2 millions. Il critique les quelque 80 milliards annuels d'exonérations de cotisations patronales. Il prône un fonds de souveraineté pour la décarbonation et la réindustrialisation. Historiquement, il a défendu un « revenu citoyen » garanti pour les personnes sans ressources.","social":"Il s'oppose à la réforme de 2023 et veut sortir du « traumatisme » des 64 ans : plutôt qu'un âge légal, il privilégie un nombre d'annuités et un système à points plus équitable. Sur la méthode, il propose une conférence sociale préparée par une commission de sages, une convention citoyenne et, au bout de dix-huit mois, un référendum possible. Il veut basculer plus de 200 Md€ de cotisations non contributives (famille, santé, handicap) vers une CSG élargie, qui inclurait les pensions de retraite, pour gagner environ 6 % de salaire réel (près de 90 €/mois au Smic) et baisser de 3 % le coût du travail. En santé, il propose un « bouclier sanitaire » qui plafonne le reste à charge selon les revenus, et un « revenu de transition » qui fusionne chômage et formation. Il prône aussi une construction massive de logements, dont 20 à 30 % sociaux et intermédiaires.","immigration":"Il s'oppose à une réduction drastique des flux et dénonce la « surenchère du durcissement », jugée inefficace et contraire aux valeurs humanistes. Il refuse l'abolition du droit du sol et défend un équilibre entre accueil, dignité et clarté des règles. Il critique la stigmatisation des étrangers pratiquée par le RN comme par une partie de la droite. Sa ligne s'inscrit dans une tradition républicaine d'ouverture.","securite":"Il défend l'ordre républicain et l'État de droit tout en refusant la surenchère pénale. Fidèle à une tradition gaullienne, il privilégie l'autorité de l'État accompagnée de prévention et de justice sociale. Il met en garde contre l'instrumentalisation politique de la sécurité et l'affaiblissement des libertés. Sa priorité reste la cohésion nationale.","env":"Il porte une « écologie intégrée » combinant nucléaire modernisé et développement massif des renouvelables, sans viser le 100% renouvelable. Il prône une sortie progressive des fossiles et une tarification du carbone aux niveaux national, européen et mondial. Il fixe -50% de pesticides d'ici 2030 et s'oppose aux nouvelles autoroutes. Il relie transition écologique et souveraineté via un fonds dédié.","europe":"Il prône un « sursaut euro-gaulliste » et une « Europe commune de la défense » sans armée commune : un Conseil de sécurité européen (Allemagne, Espagne, France, Italie, Pologne), une commande publique européenne et une « DARPA européenne ». Il ne veut pas quitter l'OTAN mais y « consolider le pilier européen », avec un projet de sécurité « dans l'OTAN, mais viable sans l'OTAN », et refuse tout désarmement nucléaire unilatéral. Pour l'Ukraine, il anticipe un cessez-le-feu ou une « paix armée », salue le prêt européen et envisage une adhésion accélérée ou un statut d'association renforcé. Il juge que des accords comme le Mercosur « ne font plus le poids », et défend la taxe carbone aux frontières et l'emprunt mutualisé par coalitions de volontaires. Sur Gaza, il soutient le mandat de la CPI contre Netanyahou et la reconnaissance de la Palestine.","institutions":"Villepin défend la Ve République, « née de la prescience des circonstances exceptionnelles », et une lecture gaulliste des institutions (« Le chemin gaulliste », 24/05/2026). Il propose de rendre les votes de confiance systématiques et d'instaurer une « motion de défiance constructive ». Il refuse un référendum qui donnerait le pouvoir de gouverner par ordonnances, comme l'usage de l'article 11 pour la priorité nationale, qu'il assimile à un changement de régime. Il met en garde contre une dissolution « pour dissoudre » et réserve l'article 16 aux crises aiguës. Il exclut toute primaire (« le dernier gadget des désespérés ») et confirmera sa candidature « une fois la campagne réellement engagée ».","societal":"Il défend une laïcité ouverte fondée sur la dignité humaine et s'oppose à l'interdiction des signes religieux pour les usagers des services publics. Il rejette la priorité nationale et toute hiérarchie des droits entre citoyens, étrangers et résidents. Il dénonce la concentration des médias entre quelques milliardaires comme une menace pour la démocratie, et a consacré une chronique à la place du spirituel dans la République lors de la visite du pape Léon XIV. Ses positions sur la fin de vie et l'IVG ne sont pas documentées dans les sources consultées.","education":"Il veut « refonder l'école pour refaire société » : budget de l'Éducation nationale sanctuarisé et indexé, +20 % de dépense réelle par élève en dix ans, revalorisation d'au moins 10 % de tous les personnels négociée en conférence sociale. Le privé sous contrat verrait son financement modulé selon le profil social de ses élèves, et l'éducation prioritaire serait financée selon l'indice de position sociale. Parcoursup redeviendrait un simple outil d'aide à la décision. Il propose des après-midis consacrés aux savoirs appliqués et aux arts, l'interdiction effective des téléphones et des évaluations nationales annuelles, et fait des maths une « priorité présidentielle »."},"scores":{"eco":5.5,"social":5,"immigration":6,"securite":5.5,"env":5.5,"europe":7,"institutions":5,"societal":5,"education":5.5},"bloc":"centre"},
    {"name":"François Asselineau","party":"Union populaire républicaine (UPR)","status":"déclaré","color":"#12326B","oneLiner":"Président de l'UPR, candidat déclaré (campagne officiellement lancée le 30/09/2026, « La Libération nationale ! ») : Frexit par l'article 50, sortie de l'euro et de l'OTAN, renationalisations et RIC. Son programme 2027 est en cours d'élaboration ; absent des sondages publiés.","program":{"eco":"Tout part du Frexit par l'article 50 et de la sortie de l'euro (retour au franc, Banque de France reprise en main). Son dernier programme (2022 ; celui de 2027 est « en cours d'élaboration ») prévoit de renationaliser, ou de cesser de privatiser, EDF, Enedis, le gaz, l'eau, La Poste, la SNCF, la RATP et les autoroutes (péages −10 %), avec un référendum pour inscrire la propriété nationale des grands services publics dans la Constitution. En fiscalité : baisse de la TVA sur les produits courants, deux nouvelles tranches d'impôt au-delà de 250 000 € et 500 000 €, impôt exceptionnel sur les très grandes fortunes, taxe sur les transactions financières, droits de succession réduits de 5 points sous 300 000 €, charges patronales des PME divisées par deux et plan anti-fraude de 60 à 80 Md€. Il propose un SMIC brut en hausse de 24 % sur le quinquennat, le gel des tarifs de l'électricité et du gaz pendant deux ans et la fin de la contribution française au budget de l'UE.","social":"Il veut inscrire la retraite par répartition dans la Constitution (la capitalisation restant facultative), revaloriser les pensions au moins au niveau de l'inflation et annuler la hausse de la CSG. Pour l'hôpital : +15 % de budget dès la première année, 30 000 lits rouverts, moratoire sur les fermetures d'hôpitaux et de maternités, fin des déremboursements et pôle public du médicament. Contre les déserts médicaux, les actes seraient majorés de 20 % pour les médecins qui s'y installent. Il prévoit la suppression des allocations chômage après deux refus d'offres d'emploi correspondant au profil du demandeur, et lie le redressement du modèle social à la sortie de l'UE.","immigration":"Il subordonne la politique migratoire à la souveraineté : sortie de Schengen et contrôle à toutes les frontières dès la première année, dénonciation du pacte de Marrakech et retrait de certains articles de la CEDH. Il vise au moins 75 % d'exécution effective des expulsions (contre moins de 20 %) et veut créer un délit d'aide au contournement de la loi visant les associations. Il soumettrait à référendum le regroupement familial et le droit du sol (cas de Mayotte et de la Guyane). Son approche se veut juridique et constitutionnelle plutôt qu'identitaire.","securite":"Il défend la fermeté pénale : peines planchers croissantes pour les récidivistes, prison même courte dès la première atteinte violente, fin de l'aménagement automatique des peines de moins d'un an et des crédits automatiques de réduction de peine. Il augmenterait de 20 % les budgets de la police et de la justice, rétablirait la police de proximité et rendrait le travail ou la formation obligatoires en prison. Il prévoit la perpétuité incompressible pour les crimes terroristes et la déchéance de nationalité pour les djihadistes. Il veut en même temps interdire dans la Constitution la surveillance généralisée (QR code, pass, identité numérique).","env":"Il défend une souveraineté énergétique fondée sur un EDF public (fin du projet Hercule de démembrement), la sortie du marché européen de l'électricité et le gel des tarifs pendant au moins deux ans. Il soutient la recherche sur l'énergie propre, notamment la fusion nucléaire, et refuse les contraintes énergétiques imposées par Bruxelles. Il remplacerait la PAC par une politique agricole nationale et créerait une écotaxe sur les poids lourds étrangers. Il privilégie l'indépendance énergétique à l'écologie punitive.","europe":"Le Frexit est le cœur de son projet : dénonciation des traités, sortie de l'UE par l'article 50, sortie de l'euro et de l'OTAN, fin de la PAC et dénonciation du CETA. Il arrêterait les versements de la France à l'Ukraine, prône une France indépendante et non alignée qui coopère avec toutes les nations (Francophonie, ONU) et veut rompre avec la « Françafrique ». Hors de l'OTAN, il redéploierait la défense vers le spatial, le maritime et le cyber, avec un budget d'au moins 3 % du PIB (programme 2022). Il fait du « non » au référendum de 2005 le fondement de sa démarche.","institutions":"Il veut créer un référendum d'initiative citoyenne, mais n'introduire qu'une proportionnelle partielle aux législatives. Il réduirait l'Assemblée à 500 députés (mandat de 4 ans) et le Sénat à une centaine de sénateurs, rétablirait le septennat et exigerait 60 % de présence pour les votes des deux chambres. Il remplacerait le Conseil constitutionnel par une Cour constitutionnelle de juristes professionnels élus par le Parlement pour 12 ans, interdirait les machines à voter et créerait une commission des conflits d'intérêts dotée d'un pouvoir d'injonction.","societal":"Son approche est laïque et républicaine universaliste : fin des subventions publiques aux groupes communautaristes, et possible inscription par référendum de la double tradition laïque et chrétienne dans la Constitution. Il veut interdire dans la Constitution la surveillance généralisée (QR code, pass sanitaire, portefeuille d'identité numérique) et les puces RFID implantées dans le corps. Son discours reste centré sur la souveraineté plutôt que sur les mœurs : son programme ne prend pas position sur le mariage, la PMA, la fin de vie ou le cannabis.","education":"Il veut rétablir le cadre national du baccalauréat, la notation, le classement et les remises de prix, et consacrer au moins 80 % du temps du primaire aux savoirs fondamentaux. Il interdirait les téléphones en cours, réduirait les écrans, encouragerait des « vêtements neutres » à l'école et proposerait des stages d'artisanat en 4e. Il rétablirait le régime déclaratif de l'instruction en famille, imposerait le français dans l'enseignement supérieur, revaloriserait les bourses de 25 % et pérenniserait le repas étudiant à 1 €."},"scores":{"eco":6,"social":5.5,"immigration":2.5,"securite":4.5,"env":3.5,"europe":4,"institutions":5.5,"societal":3.5,"education":5},"bloc":"droite","declared":"2026-03-21"},
    {"name":"Marine Le Pen","party":"Rassemblement national (RN)","status":"déclaré","color":"#1D4E89","oneLiner":"Candidate du RN, éligible tant que la Cour de cassation n'a pas tranché (arrêt visé d'ici début avril 2027). Toujours nette favorite (30-32 % chez Cluster17 et Ifop en septembre). Elle a présenté le 6 octobre un contre-budget : 140 Md€ nets d'économies d'ici 2032, déficit sous 3 % en 2030, règle d'or par référendum, retraite à 62 ans (60 pour les carrières longues) et un « pilier de capitalisation ». Elle fait bloc derrière Bardella dans l'affaire Mediapart.","program":{"eco":"Son contre-budget du 6 octobre 2026 promet 140 Md€ nets d'économies en 2032 par rapport à 2026, un déficit sous 3 % dès 2030, une dette ramenée à 112 % du PIB et une dépense publique sous 50 % du PIB, avec environ 30 Md€ nets de baisses d'impôts. Les économies viendraient surtout de la réorganisation de l'État (20,7 Md€ dès 2027 : suppression de la « quasi-totalité » des agences, non-remplacement d'une partie des départs en retraite, fusion Urssaf-DGFiP), des collectivités (8,2 Md€, suppression des EPCI et métropoles), de l'immigration (15 puis 29 Md€) et d'une baisse de la contribution à l'UE (environ 9 Md€). Côté fiscalité : taxe sur les rachats d'actions, TVA à 0 % sur 100 produits de première nécessité et réduite sur l'énergie, baisse des impôts de production, suppression de plus de 120 taxes, exonération d'impôt sur le revenu des moins de 30 ans ; le RN défendait aussi en 2025 un « impôt sur la fortune financière » à la place de la taxe Zucman. Elle refuse toute hausse politique du Smic, veut privatiser France Télévisions et Radio France (en gardant Arte, France Médias Monde et l'INA publics) et défend protectionnisme, patriotisme économique et la création d'un fonds souverain (proposée par Bardella au printemps 2026).","social":"Retraites : départ à 60 ans avec 40 annuités pour ceux qui ont commencé avant 20 ans, 62 ans et 42 annuités pour les autres. Elle annonce une « grande réforme de la capitalisation individuelle et collective » avec un « véritable pilier de capitalisation » (détail promis dans les semaines suivantes) et 15 à 20 Md€ d'économies à terme sur des mesures jugées « injustes ou inefficaces » ; les pensions restent indexées sur l'inflation. Le logement devient un « grand chantier » : priorité nationale dans les HLM et les résidences étudiantes, APL réservées aux Français, abrogation de la loi SRU, vente de HLM à leurs occupants, terrains publics gratuits pour les constructeurs, loi anti-squat. Elle s'oppose à la loi sur l'aide à mourir.","immigration":"Elle propose une réduction drastique de l'immigration par un premier référendum constitutionnel organisé dès son arrivée à l'Élysée, avec l'inscription de la priorité nationale dans la Constitution. Les prestations de solidarité seraient réservées aux étrangers ayant travaillé cinq ans en France, pour 15 Md€ d'économies en 2027 et 29 Md€ en année pleine selon son contre-budget. Elle veut supprimer le regroupement familial, le droit du sol et l'AME, restreindre l'asile et expulser systématiquement les étrangers délinquants et les personnes sous OQTF.","securite":"Elle défend une grande fermeté pénale, avec la fin de l'excuse de minorité, des peines plancher et la présomption de légitime défense pour les forces de l'ordre. Elle propose la construction de dizaines de milliers de places de prison. Elle veut une tolérance zéro et l'expulsion des délinquants étrangers. Elle veut renforcer les moyens de la police et de la justice.","env":"Elle défend une écologie « patriote » centrée sur le nucléaire (nouveaux EPR) et veut arrêter les « subventionnements à perte des énergies intermittentes » (éolien, solaire), avec un moratoire sur les nouveaux projets (environ 5 Md€ d'économies la première année). Elle combat l'interdiction des voitures thermiques neuves en 2035, a salué la suppression des ZFE et réclame la « neutralité technologique » et la fin des pénalités fiscales sur le thermique. Elle affiche pourtant un objectif de neutralité carbone avant 2050 et envisage un prêt à taux zéro pour les voitures propres. Elle veut supprimer le ZAN et le DPE, remplacer MaPrimeRénov' par un « 100 % rénov » à taux zéro, et défend localisme et circuits courts.","europe":"Elle défend une alliance européenne des nations plutôt qu'une UE fédérale, avec la renégociation des traités, la primauté du droit national sur le droit européen, une contribution nette au budget de l'UE ramenée à environ 5 Md€ et le contrôle national des frontières face à Schengen. Elle refuse l'élargissement, les politiques migratoires communes et l'armée européenne, et a abandonné la sortie de l'euro et le Frexit. Sur l'Ukraine, elle accepte de continuer à former et équiper l'armée ukrainienne mais refuse l'envoi de troupes et de missiles longue portée et juge que « financièrement, nous ne pouvons plus » suivre le niveau d'aide actuel. Elle prône la sortie du commandement intégré de l'OTAN (programme 2022), mais pas de l'Alliance, et veut porter l'effort de défense à 3 % du PIB (amendement RN voté en mai 2026). Elle s'oppose à l'accord UE-Mercosur et a condamné la reconnaissance de l'État de Palestine.","institutions":"Elle veut gouverner par référendums : d'abord sur l'immigration et la priorité nationale dès son arrivée, puis une « règle d'or » budgétaire dans les douze mois (déficit au moins 0,5 point sous le niveau qui stabilise la dette), et plus tard un référendum contre les idéologies islamistes. Elle propose un RIC (500 000 signatures) et une proportionnelle aux législatives assortie d'une prime majoritaire pour la liste arrivée en tête (la proportionnelle départementale de 1986 n'étant qu'un « moindre mal »). Aucune dépense ne serait plus reconduite automatiquement sans visa du ministre des Comptes publics, la TVA serait centralisée par l'État et le « millefeuille » territorial simplifié (suppression des EPCI et métropoles). Elle conteste l'exécution provisoire de sa condamnation et attend l'arrêt de la Cour de cassation.","societal":"Elle veut interdire le voile islamique « de manière progressive » : d'abord par décret dans les universités, les sorties scolaires, les fédérations sportives et les bâtiments publics, puis dans tout l'espace public par un référendum contre les « idéologies islamistes ». Ce référendum viserait aussi les financements étrangers, les mosquées radicales, les imams et l'interdiction des Frères musulmans. Elle défend la laïcité, l'assimilation, une politique familiale nataliste et refuse le communautarisme et le « wokisme ».","education":"Elle veut restaurer l'autorité, la laïcité et les savoirs fondamentaux (français, mathématiques, histoire), avec l'uniforme, l'interdiction du portable et du voile, le vouvoiement des professeurs et des méthodes traditionnelles. Son contre-budget maintient le budget de l'Éducation nationale malgré la baisse du nombre d'élèves, pour financer davantage de professeurs et une hausse de leurs salaires. Elle défend l'apprentissage, le mérite, le roman national et la culture française, et refuse d'étendre la place de l'histoire coloniale. Elle veut recentrer l'école publique sur la transmission plutôt que sur le choix ou la concurrence entre établissements."},"scores":{"eco":3.5,"social":4,"immigration":0,"securite":1.5,"env":1.5,"europe":4,"institutions":5,"societal":1.5,"education":3},"bloc":"exd","declared":"2026-07-07"},
    {"name":"Jordan Bardella","party":"Rassemblement national (RN)","status":"réserve","color":"#16406F","oneLiner":"Président du RN et Premier ministre désigné du duo Le Pen, seul candidat à sa réélection (vote des 112 000 adhérents jusqu'au 22 octobre, congrès d'Orléans les 24-25 octobre). Il a présenté avec elle le contre-budget du 6 octobre (140 Md€ d'économies). Fragilisé depuis le 28 septembre par les écrits antisémites de 2013 que Mediapart lui attribue (il nie et porte plainte), il recule à 30 % de popularité (-5, Cluster17).","program":{"eco":"Coauteur du contre-budget du RN (6 octobre 2026), il en présente la partie budgétaire, résumée par « réduire la dépense pour pouvoir baisser les impôts » : 140 Md€ nets d'économies d'ici 2032 (surtout dans les trois premières années), plus de 120 taxes supprimées, environ 30 Md€ nets de baisses d'impôts, exonération d'impôt sur le revenu des moins de 30 ans gagnant jusqu'à quatre Smic, et une contribution à l'UE réduite d'environ 9 Md€. Il défend la TVA à 5,5 % sur l'énergie, la baisse des impôts de production, la privatisation de France Télévisions et Radio France et un protectionnisme ciblé (droits de douane sur la Chine et les États-Unis). Il a proposé la création d'un fonds souverain. Il fait de la dette une priorité (« la France est ruinée ») et prévoit un budget rectificatif dès le premier semestre 2027 en cas de victoire.","social":"Il porte la ligne du contre-budget : retour de l'âge de départ à 62 ans avec 42 annuités, 60 ans pour ceux qui ont commencé avant 20 ans, et un « pilier de capitalisation » en complément de la répartition. Il se montre pourtant plus libéral que Le Pen : en mai 2026, il disait « examiner » un report de l'âge légal (FAZ) et juge que l'âge de départ « ne veut rien dire », le RN réfléchissant à ne garder qu'une durée de cotisation. Il refuse l'« année blanche » et veut maintenir l'indexation des pensions. Il porte la priorité nationale à l'emploi, au logement social et aux prestations (réservées aux étrangers ayant travaillé cinq ans), et défend l'accès aux soins et la lutte contre les déserts médicaux.","immigration":"Il défend une réduction drastique de l'immigration légale (objectif d'environ 10 000 entrées par an), la fin du regroupement familial et du droit du sol, et un référendum sur l'immigration à organiser rapidement. Le 4 septembre 2026, il a signé avec Nigel Farage (Reform UK) un protocole : les migrants traversant la Manche seraient interceptés, ramenés en France et renvoyés dans leur pays d'origine, sans pouvoir demander l'asile au Royaume-Uni. Il place la priorité nationale au cœur du projet (prestations réservées aux étrangers ayant travaillé cinq ans).","securite":"Il défend une grande fermeté pénale, avec la fin de l'excuse de minorité, des peines effectives et un fort soutien aux forces de l'ordre. Il veut construire des prisons et appliquer la tolérance zéro. Il prône l'expulsion des étrangers délinquants. Il fait du rétablissement de la sécurité partout une priorité.","env":"Il est pronucléaire, avec la relance de la filière et de nouveaux réacteurs, et défend le moratoire sur l'éolien et le solaire inscrit dans le contre-budget du RN. Il a fait campagne en 2024 contre l'interdiction des voitures thermiques neuves en 2035, dont le RN célèbre le recul en octobre 2026 en réclamant la « neutralité technologique ». Il refuse l'écologie punitive, les ZFE et les taxes vertes, et défend le localisme, les circuits courts, la souveraineté et la protection agricoles (opposition au Mercosur).","europe":"Il défend une Europe des nations et la primauté du droit français, avec la renégociation des règles budgétaires et migratoires, une contribution française au budget européen réduite et le contrôle national des frontières ; il refuse une intégration fédérale et l'armée européenne. Sur l'Ukraine, il veut qu'elle ait « les munitions et l'équipement » pour tenir, mais sa « ligne rouge » est la cobelligérance : ni missiles longue portée frappant la Russie, ni troupes françaises. Depuis 2024, il refuse de quitter le commandement intégré de l'OTAN « en temps de guerre » et soutient un effort de défense de 3 % du PIB. En septembre 2026, il cosigne avec Le Pen un communiqué refusant toute ingérence russe et dénonçant la saisie d'actifs d'entreprises françaises.","institutions":"Il propose une proportionnelle aux législatives avec prime majoritaire pour la liste arrivée en tête et un recours élargi au référendum, dont le RIC. Il défend une révision constitutionnelle par référendum pour inscrire la priorité nationale et la maîtrise de l'immigration, et une règle d'or budgétaire. Premier ministre désigné du tandem avec Le Pen, il prévoit un budget rectificatif dès 2027 et se présente seul à sa réélection à la présidence du RN (vote des adhérents jusqu'au 22 octobre, congrès d'Orléans les 24-25 octobre 2026). Il veut restaurer l'autorité de l'État et défend la souveraineté populaire.","societal":"Il défend la lutte contre l'islamisme et le communautarisme et la défense de la laïcité. Il est attaché à l'identité et à l'assimilation et refuse le wokisme. Il porte une politique familiale et nataliste. Il défend les valeurs de la civilisation française.","education":"Il veut restaurer l'autorité et le niveau par un « big bang de l'autorité » : uniforme au primaire et au collège, interdiction du portable, vouvoiement des professeurs, sanctions des absences et incivilités, centres spécialisés pour les élèves perturbateurs. Il défend un retour aux fondamentaux (français, mathématiques, histoire), la revalorisation des salaires des enseignants financée par un budget de l'Éducation maintenu malgré la baisse démographique, et moins de bureaucratie pour réduire les effectifs par classe. Il porte l'apprentissage, la laïcité et le mérite."},"scores":{"eco":3.5,"social":4,"immigration":0,"securite":1.5,"env":1.5,"europe":4,"institutions":5,"societal":1.5,"education":3},"bloc":"exd"},
    {"name":"Éric Zemmour","party":"Reconquête","status":"déclaré","color":"#1C1C3A","oneLiner":"Président de Reconquête, candidat déclaré depuis le 17 septembre 2026 (BFMTV), avec Sarah Knafo à ses côtés plutôt que candidate. Ligne de « remigration » (départ des étrangers après un an de chômage) ; il est crédité de 3-4,5 %.","program":{"eco":"Il défend une ligne libérale : forte baisse de l'impôt sur le revenu, de l'impôt sur les sociétés, des charges et des impôts de production, au bénéfice des PME et des classes moyennes, financée par des coupes massives dans les dépenses publiques. Sarah Knafo, qui fait campagne avec lui, chiffre à 130 Md€ par an les économies possibles (plus que le RN) et dénonce dans « Le Casse du siècle » (Fayard, septembre 2026) un État qui prélève 47 % de la richesse créée sur un salaire médian. Il refuse la taxe Zucman et toute hausse d'impôt sur le patrimoine ou l'héritage, veut assouplir le Code du travail et réduire fortement les effectifs publics. Il porte une réindustrialisation par la baisse des impôts et un protectionnisme ciblé sur les secteurs stratégiques, et veut remplacer une partie de la main-d'œuvre immigrée par l'automatisation.","social":"Il porte une politique nataliste forte (allocations familiales, quotient familial renforcé) pour relancer la démographie. Sur les retraites, son programme de 2022 relevait l'âge légal à 64 ans progressivement d'ici 2030 et alignait les régimes public et privé, avec un bonus-malus pour l'emploi des seniors ; Reconquête refuse le retour à 62 ans promis par le RN. Il veut réduire l'assistanat, conditionner le RSA à une activité et réserver les prestations sociales aux Français (sans le délai de cinq ans accordé aux étrangers par le RN). Il s'oppose à la loi sur l'aide à mourir et à la constitutionnalisation de l'IVG.","immigration":"L'immigration est le cœur de son projet : « zéro immigration » et « remigration », avec un ministère dédié aux retours volontaires et forcés. Il veut expulser les détenus et délinquants étrangers (y compris sous bracelet ou en TIG), les clandestins et les étrangers vivant des seules aides sociales, et qu'un étranger, même en règle, doive quitter la France après un an de chômage, au nom d'un article du code des étrangers selon lequel celui qui pèse sur les finances publiques doit être expulsé. Il propose de remplacer la main-d'œuvre immigrée par des robots. Il veut supprimer le regroupement familial, le droit du sol et l'AME, limiter fortement l'asile, instaurer une caution de visa et faire valider le tout par référendum ; il réserve les aides aux Français, sans délai de cinq ans pour les étrangers.","securite":"Il prône la tolérance zéro, avec des peines plancher, la fin de l'excuse de minorité et la construction de dizaines de milliers de places de prison. Il défend la présomption de légitime défense pour la police et l'expulsion des délinquants étrangers ainsi que la déchéance de nationalité. Il veut rétablir l'ordre et lutter contre l'islamisme. Il met la fermeté au centre de son projet régalien.","env":"Il est fortement pronucléaire, avec une relance massive et de nouveaux EPR, et s'oppose à l'éolien avec démantèlement. Il rejette l'écologie punitive et la décroissance. Il défend la souveraineté énergétique, l'industrie et l'automobile. Il conteste les objectifs climatiques contraignants.","europe":"Il défend une Europe des nations et la primauté du droit national, refusant l'UE fédérale et les juges européens, dont la CEDH. Il veut reprendre le contrôle des frontières, renégocier les traités et Schengen, et défend la souveraineté française sans sortir de l'euro. En 2022, il voulait sortir la France du commandement intégré de l'OTAN, qu'il jugeait en partie responsable de la guerre par son expansion, tout en condamnant l'invasion russe ; il refuse l'envoi de troupes en Ukraine et réclame un grand plan de défense nationale plutôt qu'une défense européenne. Il s'oppose à la reconnaissance de l'État de Palestine.","institutions":"Il propose un recours élargi au référendum via l'article 11, notamment sur l'immigration, la sécurité et la justice, ainsi qu'un RIC. Il veut réformer l'État et la justice et limiter le pouvoir des juges et du Conseil constitutionnel. Il défend la restauration de l'autorité présidentielle. Il veut rendre la parole au peuple.","societal":"Il défend l'identité française et l'assimilation et lutte contre l'islamisation et ce qu'il appelle le grand remplacement. Il propose la francisation des prénoms, une loi contre le voile dans l'espace public et une laïcité stricte. Il s'oppose au wokisme, à la théorie du genre et à la PMA pour toutes. Il défend les valeurs familiales et la natalité.","education":"Il veut restaurer l'autorité et l'instruction classique, avec un retour aux fondamentaux, la suppression du collège unique et l'uniforme. Il veut mettre fin au pédagogisme et au wokisme et valoriser le mérite et l'excellence. Il défend la transmission du roman national. Il met l'exigence au centre de l'école."},"scores":{"eco":1.5,"social":2,"immigration":0,"securite":1,"env":0.5,"europe":3.5,"institutions":4,"societal":0.5,"education":1.5},"bloc":"exd","declared":"2026-09-17"},
    {"name":"Florian Philippot","party":"Les Patriotes","status":"déclaré","color":"#283593","oneLiner":"Président des Patriotes, candidat déclaré depuis le 9 mai 2026, mais prêt à se retirer si Philippe de Villiers se présente. Programme publié en septembre 2026 : Frexit, sortie de l'euro, de l'OTAN et de l'OMS, RIC sur tout sujet, moratoire sur les éoliennes, sortie des GAFAM en 3 ans. Absent des sondages.","program":{"eco":"Le Frexit et la sortie de l'euro sont la condition de tout son projet : nouveau franc à parité 1 pour 1, Banque de France reprise en main et abrogation de la « loi de 1973 » pour emprunter directement auprès d'elle. Il chiffre à 15-20 Md€ par an la contribution nette à l'UE récupérée et à près de 75 Md€ par an les recettes nouvelles attendues. Il prône un protectionnisme « intelligent », la fin des accords de libre-échange, une planification économique souveraine et une Caisse nationale pour l'équipement et la réindustrialisation. Il veut renationaliser les autoroutes, rétablir les monopoles publics du rail et de l'électricité et diviser par trois le prix de l'électricité en quittant le marché européen. En fiscalité, il défend la justice fiscale pour les classes moyennes, l'allègement pour les indépendants et les TPE, la lutte contre l'optimisation des grands groupes et une moindre taxation des petits héritages.","social":"Il veut baisser l'âge de départ à la retraite, garder un système 100 % par répartition et défendre l'État-providence contre l'austérité « exigée par Bruxelles » : non aux rabotages de l'assurance chômage et aux déremboursements. En santé, il supprimerait les ARS et l'Ordre des médecins, créerait des centres de santé de proximité, redéploierait les effectifs hospitaliers vers les soignants et garantirait la liberté vaccinale pour tous. Il refuse « toute politique d'incitation à l'euthanasie » et réclame plus d'AESH et de places adaptées au handicap. Il fait de la pédocriminalité une grande cause nationale : peines alourdies, castration chimique automatique en cas de récidive, Aide sociale à l'enfance reprise par l'État.","immigration":"Il veut mettre fin à « l'immigration massive » avec des flux « extrêmement limités » : sortie de l'UE, de Schengen et de la CEDH, dissolution de Frontex (accusée d'organiser l'immigration clandestine) et rejet du pacte migratoire européen. Il veut exécuter les OQTF, renvoyer les clandestins, mettre fin à l'immigration de travail et aux travailleurs détachés. L'obtention de la nationalité serait conditionnée à la maîtrise du français et de l'histoire. Les étrangers devraient choisir « une parfaite assimilation à notre pays ou partir ».","securite":"Il veut recréer une police de proximité implantée dans les quartiers, recentrer les policiers sur la délinquance et engager le RAID et les CRS en appui dans les zones critiques. Il réinstaurerait les peines planchers, sanctionnerait dès la première infraction et supprimerait les réductions automatiques de peine. Pour les mineurs, il supprime l'excuse de minorité automatique (« qui tue comme un adulte doit être jugé comme un adulte ») et suspendrait les prestations sociales des parents de récidivistes. Il veut construire « les dizaines de milliers de places de prison qui manquent » et expulser les détenus étrangers.","env":"Il est pronucléaire : investissement massif dans le nucléaire de nouvelle génération et l'hydroélectricité, refus de la privatisation des barrages, et moratoire total et définitif sur les éoliennes terrestres et en mer, avec un plan de démantèlement. Il refuse l'interdiction des voitures thermiques en 2035 et rejette le « Pacte vert » et l'objectif de neutralité climatique imposés par l'UE. Il défend en revanche une écologie fondée sur le protectionnisme et les circuits courts : permaculture et bio à l'échelle locale, et un grand plan de protection de la faune et de la flore (haies replantées, espaces naturels sanctuarisés, lutte contre l'artificialisation). Il veut aussi la fin de l'abattage rituel sans étourdissement et des abattages massifs de cheptels.","europe":"Il veut « détruire l'UE avant qu'elle nous détruise » : Frexit par l'article 50 dès la victoire, et sortie de l'euro, de Schengen, de la CEDH, de l'OTAN et de l'OMS. Il veut cesser de financer la guerre en Ukraine, dénonce les sanctions contre la Russie « qui se sont retournées contre nous » et propose une initiative de paix. Il rejette toute armée européenne et tout partage de la dissuasion nucléaire, et prône une France non alignée coopérant aussi avec l'Asie, l'Amérique du Sud et le Moyen-Orient. Il veut une sortie programmée des GAFAM en 3 ans : données sensibles nationalisées, logiciels publics libres et auditables.","institutions":"Il veut créer un référendum d'initiative citoyenne (RIC) sur tout sujet, inscrit dans la Constitution, et ne permettre une révision constitutionnelle que par référendum, en supprimant la voie du Congrès. Contre la corruption, il prévoit l'inéligibilité à vie et l'interdiction de toute charge publique pour les élus condamnés, ainsi que la lutte contre les conflits d'intérêts et les lobbies. Il veut limiter le « gouvernement des juges » et supprimer des structures jugées inutiles comme l'Arcom. Il défend les libertés publiques : plus jamais de pass sanitaire, refus de l'identité numérique européenne et de l'euro numérique, argent liquide sanctuarisé.","societal":"Il veut « restaurer la liberté d'expression » en supprimant les lois qui la restreignent et en rejetant le règlement européen DSA. Il défend la laïcité, l'universalisme et l'assimilation contre le communautarisme, et fait de la culture française « le socle commun » : patrimoine restauré et « le Beau » remis au cœur de l'espace public. Il rejette la « société de contrôle » : pas d'identité numérique, de pass sanitaire ni d'euro numérique. Il défend une France « une et indivisible » et refuse un État de Nouvelle-Calédonie.","education":"Il prône le retour aux fondamentaux : la moitié du temps scolaire du primaire consacrée au français, puis le calcul, l'histoire, la géographie et les sciences. Il veut en finir avec le collège unique et proposer dès 14 ans des parcours différenciés, dont l'apprentissage, revaloriser la voie professionnelle et le salaire des enseignants, et restaurer leur autorité. L'école doit transmettre l'histoire et la culture françaises, la laïcité et l'assimilation, rester « un sanctuaire sans IA » pour les apprentissages fondamentaux et être libérée des normes européennes. Il veut aussi revenir sur les restrictions de l'instruction en famille."},"scores":{"eco":6,"social":5.5,"immigration":0,"securite":2,"env":2,"europe":4,"institutions":6,"societal":2.5,"education":4},"bloc":"exd","declared":"2026-03-09"},
    {"name":"Fabien Roussel","party":"Parti communiste français (PCF)","status":"déclaré","bloc":"gauche","color":"#E53935","declared":"2026-09-06","oneLiner":"Secrétaire national du PCF, candidat officiel depuis le 6/09 (72 %). « Gauche du travail » : SMIC à 1 700 €, salaires indexés, retraite à 60 ans, industrie et production électrique doublées (nucléaire + renouvelables), nationalisation de Total. Appelle à agir « dans la rue avant les urnes » (grève du 29/09, ronds-points, soutien aux pompiers). Refuse de s'effacer devant LFI ; 2-3 %.","program":{"eco":"Roussel défend une « gauche du travail » : SMIC à 1 700 euros net, +5 % pour tous les salaires et indexation des salaires sur les prix, retraite à 60 ans à taux plein pour 40 annuités, aucune pension sous le SMIC. Il veut doubler la part de l'industrie dans le PIB, nationaliser Total (« à titre de sanction »), Engie et EDF dans un pôle public de l'énergie, et baisser les taxes sur l'essence. Il taxe dividendes et superprofits, rétablit un ISF renforcé, fait de la lutte contre la fraude fiscale (100 milliards d'euros par an selon son équipe) un axe de campagne et conditionne les aides aux entreprises au maintien de l'emploi.","social":"Il veut un « 100 % Sécu » (remboursement intégral des soins par la Sécurité sociale, fin des complémentaires), la fin du numerus clausus et le recrutement massif de soignants, des centres de santé publics dans les déserts médicaux, la construction de 200 000 logements sociaux par an et le rétablissement de l'ISF pour financer la protection sociale. Il refuse toute année blanche et veut indexer pensions et minima sur l'inflation.","immigration":"Position d'équilibre à gauche : il refuse « l'immigration zéro » comme la « liberté totale », défend la régularisation des travailleurs sans-papiers, un traitement plus rapide et digne des demandes d'asile et une politique européenne de solidarité, mais insiste sur l'intégration par le travail, la langue et la laïcité, et assume de parler de contrôle des frontières et de coopération avec les pays d'origine.","securite":"Il revendique un « droit à la sécurité » pour les classes populaires : police de proximité recréée (plus de policiers formés, présents à pied dans les quartiers), moyens massifs pour la justice, lutte prioritaire contre le narcotrafic et le blanchiment, sanctions plus rapides pour les petits délits, mais refus des peines planchers et de la fin de l'excuse de minorité. Il défend un contrôle démocratique de la police et le rétablissement du récépissé de contrôle d'identité.","env":"Écologie « populaire » et industrielle : doubler la production d'électricité par le nucléaire (nouveaux EPR), les renouvelables et l'hydraulique, avec un plan climat de 500 milliards d'euros sur cinq ans (CDC et BPI), 2 millions de pompes à chaleur par an et des véhicules électriques à moins de 10 000 euros ou des aides à l'achat d'électriques d'occasion. Il refuse la « décroissance », veut baisser les taxes sur les carburants et a soutenu la suppression des ZFE au nom de la justice sociale. Il défend la souveraineté alimentaire avec des prix planchers pour les agriculteurs.","europe":"Souverainisme de gauche : désobéir aux règles budgétaires européennes, refuser les accords de libre-échange (Mercosur, CETA), mettre fin à la libéralisation de l'électricité et protéger les services publics de la concurrence, pour une Europe des coopérations. Il veut sortir du commandement intégré de l'OTAN puis travailler à sa dissolution, au profit d'un système de sécurité collective européen « de l'Atlantique à l'Oural », et refuse de partager la dissuasion nucléaire. Il condamne l'agression russe mais s'oppose à l'entrée de l'Ukraine dans l'OTAN, prône un statut de neutralité et une paix négociée, et refuse l'escalade militaire. Il oppose les milliards supplémentaires pour la défense aux besoins des retraités, et le PCF réclame un embargo total sur les armes vers Israël.","institutions":"Il propose la proportionnelle intégrale aux législatives, le référendum d'initiative citoyenne encadré, la limitation des pouvoirs présidentiels sans forcément une VIe République, la fin du 49.3 et un renforcement des droits du Parlement. Il défend la laïcité comme principe central de la République et refuse le communautarisme.","societal":"Progressiste sur les droits (mariage pour tous, PMA, aide à mourir qu'il a soutenue), il se distingue à gauche par une laïcité « stricte » (maintien de la loi de 2004), la lutte contre l'islamisme et le refus des logiques identitaires. Il veut durcir la loi Gayssot (prison, inéligibilité des élus condamnés pour racisme ou antisémitisme) et a demandé la démission de Jordan Bardella du Parlement européen si ses écrits antisémites étaient confirmés (1er octobre 2026). Il défend une politique culturelle populaire (fête, sport, associations) et les services publics comme ciment de la République.","education":"École publique renforcée : recrutement de 90 000 enseignants, revalorisation de 30 % des salaires, retour à des effectifs de 20 élèves par classe, mixité sociale via la carte scolaire et conditionnement des financements du privé, gratuité réelle (fournitures, cantine), pré-recrutement des enseignants payés pendant leurs études. Il veut sanctuariser le budget de la culture et défendre le service public audiovisuel."},"scores":{"eco":8.5,"social":8.5,"immigration":6.5,"securite":6,"env":6,"europe":6,"institutions":7.5,"societal":6,"education":8}},
    {"name":"Ségolène Royal","party":"Parti socialiste (PS)","status":"retiré","bloc":"gauche","color":"#D81B60","oneLiner":"Ancienne ministre, finaliste de 2007 : éliminée au 1er tour de la primaire le 11 octobre (7,62 %) après une campagne offensive contre Glucksmann (« stagiaire »), centrée sur le retour de l'ISF et une ligne de négociation sur l'Ukraine ; se dit « très déçue » et appelle au rassemblement, LFI non exclue.","program":{"eco":"Royal fait du rétablissement de l'ISF sa « première » mesure, « un minimum de justice fiscale », et soutient la taxe Zucman, tout en se disant favorable à certains allègements. Elle juge « dangereuse » la baisse de CSG proposée par Glucksmann et défend une conférence salariale après 2027, la hausse du Smic et des bas salaires et le conditionnement des aides publiques aux entreprises. Pour la dette, elle propose des économies sur les aides aux entreprises et les strates administratives. Elle soutient l'abrogation de la réforme de 2023 et le retour à 62 ans en refusant de « faire peur aux retraités ».","social":"Elle met en avant la santé et la dépendance : moyens pour l'hôpital public, lutte contre les déserts médicaux par des maisons de santé et des obligations de service, aide à l'autonomie des personnes âgées, logement social et encadrement des loyers. Elle défend les droits des femmes (égalité salariale contraignante) et refuse toute année blanche pour les petites retraites.","immigration":"Ligne républicaine et humaniste : respect du droit d'asile et accueil digne, régularisation des travailleurs sans-papiers dans les métiers en tension, mais fermeté contre les filières de passeurs et exigence d'intégration (langue, travail). Elle refuse la priorité nationale et la remise en cause du droit du sol.","securite":"Elle revendique une gauche de « l'ordre juste » : police de proximité, réponse rapide aux incivilités, encadrement des mineurs délinquants (elle avait proposé des structures à encadrement militaire en 2007), moyens pour la justice, tout en défendant la prévention et la réinsertion. Elle prend au sérieux la demande de sécurité des classes populaires.","env":"Ancienne ministre de l'Écologie (loi de transition énergétique de 2015, présidence de la COP21), elle fait de l'écologie un pilier : accélération des renouvelables, économies d'énergie, rénovation thermique, économie circulaire, protection de la biodiversité et des océans (elle a été ambassadrice des pôles), tout en gardant une part de nucléaire. Elle revendique une écologie « qui améliore la vie » et refuse l'« écologie punitive » : ministre, elle avait suspendu l'écotaxe poids lourds en 2014 et misé sur les aides (bonus, prime à la conversion des vieux véhicules) plutôt que sur de nouvelles taxes pour les ménages.","europe":"Pro-européenne, Royal veut « maintenir la défense de l'Ukraine » mais faire « le même effort pour arrêter cette guerre » : dialogue avec Poutine, « lieu permanent de négociation » réunissant États-Unis et Européens, forces d'interposition, une ligne que Guedj juge « naïve ». Sur Gaza, elle demande de « reconnaître le génocide » et soutient la remise en cause de l'accord d'association UE-Israël. Elle défend les agriculteurs face au Mercosur, une défense européenne renforcée et un rapprochement diplomatique avec l'Algérie.","institutions":"Figure de la démocratie participative depuis 2007 : jurys citoyens, référendums locaux, dose de proportionnelle, non-cumul, et rénovation des institutions vers plus de contrôle citoyen et une réforme du Sénat. Elle défend la laïcité et l'égalité entre les territoires.","societal":"Progressiste : droits des femmes, égalité réelle, lutte contre les discriminations, défense de la laïcité et de la mixité, soutien à la loi sur la fin de vie, protection de l'enfance et lutte contre les violences intrafamiliales.","education":"Ancienne ministre de l'Enseignement scolaire : priorité à l'école primaire, aide aux devoirs, mixité sociale, revalorisation des enseignants, lutte contre le harcèlement et le décrochage, et une école qui prépare aux métiers de la transition écologique."},"declared":"2026-07-10","scores":{"eco":7.5,"social":8,"immigration":7,"securite":7,"env":7.5,"europe":7,"institutions":6.5,"societal":7.5,"education":7}},
    {"name":"Philippe Brun","party":"Parti socialiste (PS)","status":"retiré","bloc":"gauche","color":"#F06EAA","oneLiner":"Député PS de l'Eure, vice-président de la commission des finances, auteur du programme « Produire » (salaire Brun par CSG progressive, retour de l'ISF, EDF public, capitalisation collective) : écarté de la primaire et suspendu du PS le 16/09/2026 après des accusations d'une ex-collaboratrice qu'il conteste ; débouté en référé, il a annoncé faire appel.","program":{"eco":"Son programme « Produire » veut faire de la France « la première puissance économique européenne » : électricité décarbonée la moins chère d'Europe avec retour au monopole public d'EDF et contrats de compétitivité nucléaire (environ 65 €/MWh), compagnie nationale des mines, investissement massif dans l'IA, plan France 2040, sortie du foncier industriel du ZAN et suppression de la C3S, compensée par le recentrage d'aides aux grandes entreprises. Le « salaire Brun » rend la CSG progressive (de 1 % au Smic à 9,2 % à partir de 4 000 € bruts, environ +150 €/mois au Smic), financé par une hausse de la CSG sur le capital, avec une super-participation obligatoire sur les profits exceptionnels. Il rétablit l'ISF sur les biens non professionnels, taxe à 0,3 % les grands patrimoines professionnels, supprime la flat tax et taxe les successions sur la somme des transmissions reçues. Il s'engage à repasser sous 3 % de déficit d'ici 2032 (120 à 150 milliards d'économies). Retraites : ouverture des droits maintenue à 62 ans, référendum sur un nouveau système tenant compte de la pénibilité, et dose de capitalisation collective via un Fonds de réserve des retraites transformé en fonds souverain.","social":"Il veut faire contribuer le privé lucratif en conditionnant l'argent public versé aux cliniques à des obligations de service public, rendre aux soignants le contrôle majoritaire du capital des établissements privés et supprimer les agences régionales de santé. Contre les déserts médicaux, il conditionne l'installation des spécialistes dans les zones bien dotées au départ d'un confrère. Sur le logement, il permet à tous les maires d'encadrer les loyers, de surtaxer les résidences secondaires et d'imposer des quotas de meublés touristiques, rend les frais de notaire progressifs et remplace les impôts fonciers par une contribution progressive sur les grands patrimoines immobiliers. Il généralise « Territoires zéro chômeur » et désindexe les pensions supérieures à 3 000 € bruts par foyer, en protégeant les petites retraites.","immigration":"Ligne PS : respect du droit d'asile, régularisation des travailleurs sans-papiers dans les métiers en tension, refus de la priorité nationale et du démantèlement du droit du sol, exigence d'intégration par le travail et la langue, et politique européenne commune.","securite":"Il défend une justice dotée de moyens (magistrats, greffiers), une police de proximité, la lutte contre le narcotrafic et le blanchiment (il travaille sur les circuits financiers), et des peines alternatives pour les petits délits ; il s'oppose aux peines planchers.","env":"Il propose une grande loi de programmation de l'adaptation environnementale : rénovation thermique et décarbonation du chauffage dans les parcs public et privé, rafraîchissement des espaces publics et développement du ferroviaire (petites lignes), financé par un fonds adossé aux recettes des autoroutes. Il poursuit la relance du nucléaire, y compris le nouveau nucléaire, et rattrape le retard des renouvelables, avec 20 % du capital des projets ouvert aux habitants. Il crée une taxe flottante sur le carburant qui baisse automatiquement quand les prix montent, supprime progressivement les niches fiscales « brunes » et les taux réduits de TVA sur l'aérien, et veut étendre le mécanisme d'ajustement carbone aux frontières.","europe":"Il veut que l'Europe adopte « la stratégie d'un pays émergent qui s'industrialise » : protectionnisme agricole et industriel au sein de l'UE, conditionnement de l'accès au marché intérieur, extension accélérée de la taxe carbone aux frontières et préférence au Made in France dans la commande publique (de 40 % à 60 % de biens manufacturés français), « sans exclure de déroger aux règles européennes néfastes ». Son programme ne détaille ni la défense ni l'Ukraine ; ses positions sur ces sujets suivent la ligne du PS (soutien à l'Ukraine, défense européenne).","institutions":"Dose de proportionnelle, transparence de la vie publique, encadrement des lobbies, renforcement du Parlement (il a été rapporteur budgétaire) et lutte contre l'abstention par une démocratie plus participative.","societal":"Progressiste sur les droits (fin de vie, PMA, égalité femmes-hommes, lutte contre les discriminations), attaché à la laïcité et à l'universalisme républicain.","education":"Il veut investir dans l'école en baissant les effectifs par classe tout en maintenant le nombre d'enseignants malgré la baisse démographique, et en revalorisant de 20 % le traitement des enseignants (environ 7 milliards d'euros). Il impose au privé sous contrat de nouvelles obligations de mixité sociale, développe les internats d'excellence et rétablit la place des mathématiques et des sciences au lycée pour former davantage d'ingénieurs et de techniciens."},"declared":"2026-06-30","scores":{"eco":6,"social":6,"immigration":6,"securite":5.5,"env":5.5,"europe":6,"institutions":5,"societal":6,"education":5.5}},
    {"name":"Emmanuel Maurel","party":"Gauche républicaine et socialiste (GRS)","status":"retiré","bloc":"gauche","color":"#B5294E","oneLiner":"Député du Val-d'Oise, animateur de la Gauche républicaine et socialiste (ex-PS) : candidat à la primaire sur une ligne de gauche républicaine, souverainiste et industrielle (grand emprunt de 300 Md€, Smic à 1 700 €, laïcité intransigeante, non-alignement) ; 4e au 1er tour du 11 octobre (5,92 %), il juge la gauche « partis sur de bons rails » et s'était engagé à soutenir le vainqueur.","program":{"eco":"Maurel fonde son projet sur « trois ruptures » : démondialiser, démarchandiser, démocratiser. Il lance dès 2027 un grand emprunt national pour un plan d'investissement de 300 milliards d'euros, crée un ministère de l'Industrie indépendant de Bercy, un fonds souverain, n'exclut pas des nationalisations et impose des clauses de « contenu local » sur les 170 milliards annuels de commande publique. Il sort la France du marché européen de l'électricité et ramène la TVA sur l'électricité à 5,5 %. Il rétablit l'ISF, porte la flat tax à 40 %, taxe les patrimoines de plus de 100 millions d'euros et revoit les 465 niches fiscales (environ 90 milliards), le crédit d'impôt recherche et le pacte Dutreil.","social":"Il porte le Smic à 1 700 € net dès la prochaine législature, indexe les salaires sur l'inflation, revalorise le point d'indice d'au moins 10 % sur le quinquennat et conditionne les aides aux entreprises à des hausses de salaires ; il refuse toute baisse des cotisations. Il maintient la retraite à 62 ans (60 ans pour les carrières longues), rétablit la pénibilité et s'oppose à la capitalisation. Il supprime la tarification à l'activité à l'hôpital, avec une hausse annuelle d'au moins 4 % des dotations, et « démarchandise » le médico-social : après les scandales des crèches et Ehpad privés, l'argent public sera réorienté vers des structures publiques ou associatives à but non lucratif. Il généralise l'encadrement des loyers et du foncier, vise 750 000 logements sociaux en cinq ans et crée un contrat d'alternance de trois ans payé au Smic pour 250 000 jeunes chômeurs.","immigration":"Il veut réduire les délais d'instruction de l'asile et des titres de séjour, financer massivement l'apprentissage du français pour tout arrivant et créer un service public de l'intégration. Il régularise les travailleurs sans papiers tout en donnant la priorité à l'éloignement des étrangers sous OQTF pour des infractions graves. Il maintient le droit du sol, « pilier du pacte civique ».","securite":"Il veut une « police républicaine au service de tous » et le retour d'une police de proximité ; s'il juge « insupportable » de dire « la police tue », il estime que les bornes de la violence légitime ont été dépassées à plusieurs reprises et que la doctrine doit être revue. Il renforce la police judiciaire contre le narcotrafic, avec des mesures de protection des mineurs (des éducateurs de rue aux centres éducatifs fermés) et de responsabilisation des parents, et vise la « tolérance zéro à la violence » (port d'armes blanches, sanctions sévères et rapides). Il soutient la loi intégrale contre les violences sexuelles et augmente les moyens de la justice (parquet, prisons insalubres, justice civile), jugeant la justice non pas « laxiste » mais trop lente.","env":"Il veut une écologie sans « régression du niveau de vie » ni « punition des classes populaires » : électricité décarbonée et abondante grâce à de nouvelles capacités nucléaires, hydroélectriques et renouvelables, sous gouvernance publique intégrée, et priorité à l'électrification des usages avec un leasing social de voitures électriques. Il renforce l'ONF, limite les coupes rases, soutient la reconstitution d'une forêt primaire en libre évolution et généralise la régie publique de l'eau. Contre l'hyperconsommation, il lutte contre la fast fashion et l'obsolescence programmée (garanties allongées ; à terme, seuls les appareils réparables et recyclables seraient acceptés) et plafonne l'agrandissement des exploitations agricoles à 1,5 fois la surface moyenne régionale.","europe":"Il soutient « sans réserve » l'aide militaire européenne à l'Ukraine et de nouvelles sanctions, mais refuse le « saut fédéral » : il exprime « les plus fortes réserves » à toute intégration européenne de la défense, juge une « OTAN sans les États-Unis » non crédible tout en reprenant le diagnostic d'une OTAN en « mort cérébrale », et assimile indépendance et non-alignement, hors des logiques de blocs. Il garantit un budget de défense à 3 % du PIB par une enveloppe nationale de 100 milliards d'euros (munitions, capacités, dissuasion). Il rejette les directives de libéralisation des services publics, veut remettre en cause la libre circulation des capitaux hors de l'UE et obtenir un rabais sur la contribution française. Après la reconnaissance de la Palestine, il veut agir contre la colonisation de la Cisjordanie et mettre à l'ordre du jour la suspension de l'accord commercial UE-Israël.","institutions":"Critique du « crétinisme présidentiel » et du « leader suprême », il rappelle que c'est le gouvernement qui conduit la politique de la Nation : il veut limiter, voire supprimer, le droit de dissolution du président et réduire fortement son pouvoir de nomination. Il crée une journée annuelle référendaire dont une partie des questions serait d'initiative citoyenne et associe davantage les corps intermédiaires. Il met les collectivités « en première ligne » du redressement, contre la baisse des dotations, dans le cadre de la décentralisation de 1982. Il généralise les administrateurs salariés (au moins 30 % dans les entreprises de plus de 50 salariés) et défend l'audiovisuel public.","societal":"Il défend une laïcité intransigeante : loi de 1905, neutralité des services publics et refus de « tout accommodement raisonnable » avec les activistes religieux. Il instaure la règle « 5-10-15 » sur les écrans (pas d'écran avant 5 ans, une heure maximum jusqu'à 10 ans, pas de smartphone avant 15 ans), interdit les lunettes-caméras connectées et veut une IA ouverte et souveraine contribuant à la création culturelle.","education":"Il donne la priorité aux savoirs fondamentaux, revalorise les enseignants et renforce leur formation, améliore le statut des AESH et allège les classes accueillant un élève handicapé. Il abroge Parcoursup et revient sur la réforme du bac de 2019. Il conditionne le financement public du privé à la mixité sociale avant de le réserver à terme au public, consacre 1 % du PIB à la recherche publique et augmente de 30 % la dépense par étudiant."},"scores":{"eco":8,"social":8,"immigration":6,"securite":6,"env":6,"europe":6,"institutions":7.5,"societal":6,"education":8},"declared":"2026-09-04"},
    {"name":"Bernard Cazeneuve","party":"La Convention","status":"pressenti","bloc":"gauche","color":"#AD1457","oneLiner":"Ancien Premier ministre (2016-2017), président de La Convention : « Lettre aux Français » du 16/07 (30 propositions) sans candidature formelle — durée de cotisation plutôt que recul de l'âge, règle d'or sociale, septennat, nucléaire assumé, OTAN « sans rien y abdiquer » ; refuse toute alliance avec LFI. Glucksmann veut l'intégrer à son équipe (12/10). Peu testé par les instituts.","program":{"eco":"Cazeneuve fait de la « vérité budgétaire et maîtrise de la dette » une contrainte nommée (117,5 % du PIB, intérêts devenus le premier poste du budget) et propose une fiscalité « juste mais pas punitive » : faire contribuer réellement les très grandes fortunes, les plus hauts revenus du capital et les rentes, rééquilibrer la taxation entre travail et capital, et simplifier l'impôt (moins de niches). Il finance une baisse des impôts de production par la réduction des aides fiscales aux entreprises. Il propose un plan de réindustrialisation sur dix ans (filières stratégiques sécurisées par l'État, règles stables, incitations ciblées sur la recherche et l'investissement), et une agriculture de souveraineté alimentaire avec des prix dignes pour les producteurs. Sur le pouvoir d'achat, il refuse toute « formule magique ».","social":"Les retraites restent dans la répartition mais sont réformées « sans brutalité » : la durée de cotisation devient le levier principal plutôt qu'un nouveau recul de l'âge légal (reprise négociée de la trajectoire de 2014), la pénibilité est rétablie (postures, charges, vibrations, risques chimiques) avec droit au départ anticipé, le dispositif carrières longues est corrigé et l'emploi des seniors encouragé (800 000 emplois en jeu selon lui). Sa « règle d'or sociale » rétablit la loi Veil (toute exonération compensée à l'euro près, rétroactivement depuis 2019) et impose l'équilibre des branches maladie, vieillesse et autonomie sur cinq ans. Il propose un grand plan social et écologique de construction et de rénovation de logements, la simplification et l'automatisation des aides, la santé mentale grande cause nationale et la prise en charge du grand âge garantie aux familles modestes.","immigration":"Il traite la question migratoire en dernier, parce qu'elle « ne se traite sérieusement qu'adossée à tout le reste », selon trois principes indissociables : humanité (le droit d'asile, « engagement de civilisation »), intégration (apprendre le français, respecter les lois communes et l'égalité femmes-hommes, « non négociable »), fermeté (lutte « sans faiblesse » contre l'immigration irrégulière et démantèlement des filières). Il veut une politique migratoire pensée à l'échelle européenne. Il refuse aussi bien « l'universalisme de façade » qui nie les discriminations que « l'assignation identitaire ».","securite":"« La sécurité n'est pas un thème de droite […] Elle est due au peuple » : police de proximité dotée d'effectifs formés, prévention (école, seconde chance) et, contre le narcotrafic, unités spécialisées, peines réellement exécutées, Parquet européen aux compétences élargies, gel des avoirs et traque des financements. Il veut sortir du « tout-comparution immédiate » et de « la prison par défaut », qu'il juge « fabrique de récidives ». La protection des vies est sa première priorité : cadre national unifié pour les crèches et le périscolaire, aucune plainte pour violence faite à un enfant sans réponse (rappel de magistrats retraités volontaires), lutte contre les violences faites aux femmes et les féminicides.","env":"L'écologie est « la condition de tout », mais ni punitive ni technophile naïve : une « écologie populaire et planifiée ». Énergie : « filière électronucléaire assumée », renouvellement du parc planifié, rationalisation des renouvelables, électrification des usages et sortie des fossiles. Sa mesure phare est le plan « École-Climat-Solidarité », engagement de dix ans pour rénover les établissements scolaires (cours désimperméabilisées, îlots de fraîcheur), piloté par une DATAR du climat rattachée au Premier ministre. Il veut aussi la rénovation massive des logements, des transports collectifs là où ils manquent et une agriculture qui protège ses sols et son foncier.","europe":"Constatant que « la protection américaine […] n'est plus garantie », il veut un réarmement « à proportion de la menace », une industrie de défense consolidée avec préférence aux productions nationales et européennes, rester dans l'OTAN « sans rien y abdiquer » et contribuer à l'Europe de la défense « sans prétendre s'y substituer », réfléchir avec le Royaume-Uni à l'apport de la dissuasion française et coordonner une défense antimissile du continent. L'Europe doit devenir « un contrat plutôt qu'un cadre de contraintes » : réforme budgétaire, politique industrielle commune, concurrence moins dogmatique, commerce moins naïf et fin de l'unanimité au profit de la majorité. Il condamne la politique de Netanyahou, veut à la fois la sécurité d'Israël et un État pour les Palestiniens, et défend le multilatéralisme (réforme du Conseil de sécurité).","institutions":"Il écarte le changement de régime mais veut corriger l'« ego-présidentialisme » : rétablissement du septennat, Premier ministre engageant sa responsabilité devant le Parlement dès son entrée en fonction, discipline sur le 49.3, les ordonnances et les procédures accélérées, dose de proportionnelle aux législatives et participation citoyenne à la fabrique de la loi. Il veut une justice dotée de moyens et à l'indépendance reconnue, une loi limitant la concentration capitalistique des médias, une haute fonction publique rendue à sa « vocation » contre le pantouflage, une décentralisation clarifiant « qui fait quoi » et une simplification à « deux normes supprimées pour une créée ». Il prône un rassemblement de la gauche républicaine au centre et renvoie dos à dos les « deux dégagismes » du RN et de LFI.","societal":"Il réaffirme la laïcité comme principe de liberté et de séparation, « un joyau à protéger des manipulations et du cynisme », instrumentalisée selon lui à la fois comme arme contre l'islam et abandonnée par crainte de paraître hostile. Il fait de l'antisémitisme le « baromètre » de la santé morale de la nation et veut que le féminisme « inspire les grandes politiques publiques » (écarts de salaire, retraites des carrières interrompues, plafonds de verre). Sur l'IA, il crée un droit de recours à l'intelligence humaine : aucun refus d'aide, de place ou de titre sans réexamen par un agent. Il n'a pas publié de mesures nouvelles sur la fin de vie, le cannabis ou les droits LGBT.","education":"L'école est « le lieu où la République commence concrètement » : des enseignants « mieux formés, mieux payés, mieux considérés », le retour aux humanités avec un effort égal pour les sciences, l'esprit critique dès le collège et la philosophie dès la Seconde, une formation massive au numérique et un service public de l'IA éducative. Il veut lutter contre la ségrégation scolaire et « l'évitement organisé », sans opposer public et privé. Pour la jeunesse : au moins 2 000 € d'aide supplémentaire pour les boursiers durant leurs deux premières années et une « avance jeunesse » de 3 000 € pour les 18-24 ans sans diplôme ni emploi. Il veut généraliser l'apprentissage, encadrer les stages et refaire du CDI la norme pour les jeunes."},"scores":{"eco":5,"social":6,"immigration":6,"securite":5.5,"env":5.5,"europe":6,"institutions":5,"societal":6,"education":5.5},"declared":null},
    {"name":"Bruno Le Maire","party":"Renaissance","status":"pressenti","bloc":"centre","color":"#8A6500","oneLiner":"Ancien ministre de l'Économie, non déclaré. Son « Manifeste pour une autre France » (23/08) prévoit une retraite de référence à 65 ans avec capitalisation, la désindexation des pensions et prestations jusqu'au retour sous 3 % de déficit et 2 à 3 points de TVA en plus pour baisser les charges. Il propose aussi de supprimer le 49.3 et la limite à deux mandats, et une fédération européenne à six. Il est testé dans les sondages de fin septembre.","program":{"eco":"Dans son « Manifeste pour une autre France » (23/08/2026), Le Maire veut revenir sous 3 % de déficit en cinq ans et désendetter en dix ans. Pensions, prestations et barème de l'impôt sur le revenu seraient désindexés jusque-là, sauf minima et petites retraites ; les surtaxes d'IS et d'IR seraient maintenues et une contribution exceptionnelle demandée chaque année aux plus grands patrimoines, hors outil de production. Il propose un « pacte fiscal » aux entreprises (moins d'aides contre moins de charges) et la suppression de la CVAE et de la C3S. La TVA augmenterait de 2 à 3 points (taux réduit maintenu), avec une taxe sur les importations et les produits polluants : environ 50 Md€ seraient reversés aux salariés en baisse de charges (« le net doit approcher le brut »). L'État céderait ses parts dans Orange, la FDJ ou Engie (au moins 30 Md€) pour investir dans les semi-conducteurs, l'IA et Mistral, et exonérerait jusqu'à dix ans les entreprises tech qui s'installent en France. Le Smic serait revalorisé selon les recommandations des partenaires sociaux et la prime d'activité supprimée à terme ; les codes du travail, de l'environnement et de la construction seraient réécrits en six mois.","social":"Une réforme des retraites associerait un âge de départ de référence à 65 ans, une part de capitalisation et la prise en compte de la pénibilité et des carrières des femmes. Le nouveau système, qui mêle répartition et capitalisation, serait géré par les partenaires sociaux sous une règle d'équilibre fixée par une loi organique. Pensions et prestations seraient désindexées jusqu'au retour sous 3 % de déficit, sauf les minima des plus fragiles. La Sécurité sociale couvrirait totalement les risques graves (cancer, Alzheimer), le reste relevant des mutuelles (« il ne remboursera plus le Doliprane »). L'assurance chômage serait plafonnée autour du salaire médian, au-delà relevant de l'assurance privée, et il veut « stopper toute aide à ceux qui ne travaillent pas par choix ». Le logement abordable serait « la grande politique sociale » du mandat : un pilote unique, un tri dans les normes et les aides, et un prêt garanti par l'État pour l'accès à la propriété des moins de 30 ans.","immigration":"Le Maire veut « mettre fin à une immigration hors de contrôle » : l'immigration doit répondre « à un seul critère : son utilité pour la France ». Il veut attirer chercheurs, scientifiques et entrepreneurs plutôt que des travailleurs au Smic ou des étudiants peu performants. Les exigences de ressources, de diplôme et de français seraient renforcées, et les prestations des étrangers en situation irrégulière réduites « au strict nécessaire ». Les règles de l'asile seraient durcies et révisées chaque année sous le contrôle de l'Assemblée nationale, et une loi de programmation sur dix ans financerait de nouvelles places en centres de rétention. La France doit devenir « parmi les plus strictes » d'Europe ; il ne se prononce ni sur le droit du sol ni sur la priorité nationale.","securite":"L'« autorité » est son premier choix : l'État doit se recentrer sur « la sécurité du territoire », la protection des personnes, l'Éducation et la Santé, et déléguer le reste. Une loi de programmation sur dix ans financerait les équipements et les personnels des armées et de la sécurité civile, ainsi que de nouvelles places de prison et de rétention. Les maires pourraient sanctionner directement la petite délinquance sans accord préalable du procureur. La Justice serait jugée sur la priorité donnée aux violences faites aux femmes et aux mineurs. Il ne veut plus laisser à la CNIL « toute latitude » sur les libertés publiques : le Conseil constitutionnel deviendrait le seul recours.","env":"Il prône la « réconciliation de l'économie et de la nature », ni décroissance ni « capitalisme sauvage », tout en dénonçant les « Savonarole du climat ». Il lancerait six nouveaux EPR en plus des tranches déjà décidées, accélérerait la recherche sur la fusion et développerait le stockage hydroélectrique. Une loi de programmation énergétique viserait l'électrification accélérée des transports, du bâtiment et de l'industrie. Le climat et l'adaptation, retenues d'eau comprises, auraient leur loi de programmation budgétaire sur dix ans, et la politique environnementale serait confiée aux régions, l'ADEME étant supprimée. Le principe de précaution serait remplacé dans la Constitution par un « principe de responsabilité ».","europe":"Pour lui, « le destin de la France et le destin de l'Europe ne font plus qu'un ». Il propose une fédération d'États-nations à six (France, Allemagne, Italie, Espagne, Pologne, Pays-Bas), avec sa capitale et sa Constitution, qui mettrait en commun semi-conducteurs et IA, diplômes, marchés financiers, politiques économiques et frontières, tout en restant dans l'UE à 27 pour y « imposer ses vues ». Il veut en finir avec « la chimère dangereuse du libre commerce » : droits de douane sur les produits carbonés ou très subventionnés et part de contenu européen obligatoire dans le high-tech, taxé à 30 % sinon. Il juge que les États-Unis « ne sont plus nos alliés indéfectibles », que la Russie reste une menace et que la Commission est devenue un « monstre technocratique ». Il veut un dialogue franc avec Berlin sur les investissements militaires et la dissuasion élargie, ainsi qu'une nouvelle dette européenne (IA, climat, défense) en échange d'un désendettement français.","institutions":"Son manifeste dessine « une nouvelle Cinquième République » autour d'un exécutif fort. La limite de deux mandats présidentiels serait supprimée, le domaine réservé (Défense, Affaires étrangères) inscrit dans la Constitution, le gouvernement réduit à dix ministres de plein exercice et le 49.3 supprimé, sauf pour le budget. Le gouvernement ne pourrait être renversé que par une majorité alternative, le droit d'amendement budgétaire serait limité et le Parlement consacrerait la moitié de son temps au contrôle. Le référendum serait étendu et pourrait être convoqué par le peuple, au niveau local comme national, avec un seuil d'initiative populaire abaissé. Il ne resterait que trois échelons (État, régions, communes) : départements fusionnés avec les régions, communes libres de fixer leurs taux d'impôt, fonction publique territoriale et agences « inutiles » supprimées. Non déclaré, il ne ferme pas la porte à une candidature.","societal":"Le Maire défend la laïcité (« aucune religion ne doit imposer ses règles ou ses coutumes à la vie commune ») et veut résoudre une « crise de la conscience historique » en réappropriant la culture française, sans proposer d'étendre les interdictions de signes religieux. Il défend la liberté de création et de critique : « aucune bride » ne doit lui être mise. En 2013, il s'était abstenu sur le mariage pour tous, puis s'était opposé à son abrogation en 2014. Son manifeste ne dit rien de la fin de vie, de la PMA ni de la GPA.","education":"Il veut revoir « tout le logiciel de l'Éducation nationale » : l'objectif ne serait plus 80 % d'une classe d'âge au bac mais « 100 % d'une classe d'âge avec un emploi », grâce à l'alternance et à la priorité donnée aux compétences sur le diplôme. Les chefs d'établissement auraient une « pleine autorité » sur les enseignants (formation, recrutement, remplacement). La rémunération des enseignants, surtout des plus méritants, serait revalorisée, et l'emploi à vie dans la fonction publique céderait la place à plus de souplesse. Les universités pourraient devenir des fondations de droit privé pour lever des fonds, et le CNRS serait réorganisé vers les débouchés industriels, avec priorité aux sciences dures."},"scores":{"eco":3,"social":4,"immigration":3.5,"securite":3.5,"env":4,"europe":6,"institutions":4.5,"societal":4.5,"education":4.5},"declared":null}
  ];

  var SECTIONS = ['eco', 'social', 'immigration', 'securite', 'env', 'europe', 'institutions', 'societal', 'education'];

  var SECTION_LABELS = {
    eco: 'Économie',
    social: 'Social & Santé',
    immigration: 'Immigration',
    securite: 'Sécurité & Justice',
    env: 'Environnement',
    europe: 'Europe & Monde',
    institutions: 'Institutions & Démocratie',
    societal: 'Société & Valeurs',
    education: 'Éducation & Culture'
  };

  // Couleur de badge par section (neutre, juste pour repérage visuel)
  var SECTION_COLORS = {
    eco: '#3B82F6',
    social: '#06B6D4',
    immigration: '#F59E0B',
    securite: '#EF4444',
    env: '#22C55E',
    europe: '#8B5CF6',
    institutions: '#EC4899',
    societal: '#14B8A6',
    education: '#F97316'
  };

  // ── Algorithme de matching ──
  // Distance euclidienne (RMSD) PAR THÈME, PONDÉRÉE par l'importance que
  // l'utilisateur accorde à chaque thème (themeWeights). Un thème jugé essentiel
  // pèse donc davantage dans la proximité avec un candidat.
  function computeMatch(userProfile, candidateScores, themeWeights) {
    var themes = SECTIONS.filter(function (k) {
      return userProfile[k] !== null && userProfile[k] !== undefined && candidateScores[k] !== undefined;
    });
    if (themes.length === 0) return 0;
    var acc = 0, wsum = 0;
    themes.forEach(function (k) {
      var w = (themeWeights && themeWeights[k] != null) ? themeWeights[k] : 1;
      if (w <= 0) w = 0.0001;
      acc += w * Math.pow(userProfile[k] - candidateScores[k], 2);
      wsum += w;
    });
    var rmsd = Math.sqrt(acc / wsum);
    return Math.round(Math.max(0, Math.min(100, 100 - rmsd * 10)));
  }

  // Facteur d'importance : échelle non linéaire pour que l'importance pèse fort.
  // défaut (3) = 1 · 5 = 3× · 1 = 0,3×
  function impFactor(imp) {
    var m = { 1: 0.3, 2: 0.6, 3: 1, 4: 1.8, 5: 3 };
    return m[imp] != null ? m[imp] : 1;
  }
  // Poids par thème = MOYENNE du facteur d'importance des questions répondues du thème.
  // Normalisé par le nombre de questions → avec une importance uniforme, tous les
  // thèmes pèsent pareil (matching équipondéré) ; l'importance est le seul moteur
  // des écarts entre thèmes. Un thème noté 5 pèse jusqu'à 10× un thème noté 1.
  function computeThemeWeights(answers, importance, questions) {
    importance = importance || {};
    var qs = questions || QUESTIONS;
    var sum = {}, cnt = {};
    SECTIONS.forEach(function (s) { sum[s] = 0; cnt[s] = 0; });
    qs.forEach(function (q) {
      if (answerScore(answers[q.id], q) == null) return;
      var imp = importance[q.id]; if (imp == null) imp = 3;
      sum[q.theme] += impFactor(imp); cnt[q.theme]++;
    });
    var w = {};
    SECTIONS.forEach(function (s) { w[s] = cnt[s] > 0 ? sum[s] / cnt[s] : 0; });
    return w;
  }

  // answers : { questionId: { optIdx, score } }  (forme stockée par quiz.js)
  //           ou { questionId: optionIndex }       (forme héritée / import)
  //           → profil { theme: moyenne | null }
  function answerScore(a, q) {
    if (a == null) return null;
    if (typeof a === 'object') {
      // On recalcule TOUJOURS le score depuis le barème ACTUEL de la question
      // (via l'index de l'option choisie), et non depuis le score figé au moment
      // de la réponse — ainsi tout recalibrage s'applique rétroactivement aux
      // réponses déjà enregistrées (ex. corrections du thème Europe).
      if (a.optIdx != null && q.options[a.optIdx]) return q.options[a.optIdx].score;
      if (a.score != null) return a.score;
      return null;
    }
    // a est un index numérique
    return q.options[a] ? q.options[a].score : null;
  }
  // ── Pondération des questions ──
  // Coefficient ÉDITORIAL de base par question (défaut 2). 3 = question centrale
  // et très clivante (elle pèse plus), 1 = question périphérique ou peu clivante
  // gauche/droite (elle pèse moins). Ex. sur l'immigration : le niveau global des
  // flux, les sans-papiers et l'asile pèsent 3 ; le voile ou « prennent-ils le
  // travail » pèsent 1. S'y ajoute l'importance PERSONNELLE (1-5) réglée par
  // l'utilisateur, qui multiplie ce coefficient (défaut 3 = neutre).
  // coef 3 = question ESSENTIELLE du thème (importance perso minimale = 3, réglages 1-2 grisés)
  // coef 1 = question périphérique / peu clivante gauche-droite
  var QUESTION_WEIGHTS = {
    // Actu 2026-2027 (ajoutées août 2026)
    101: 3, 102: 3, 103: 2, 104: 2, 105: 3, 106: 2, 107: 2, 108: 3, 109: 1, 110: 2, 111: 1, 112: 1,
    // Économie
    1: 3, 2: 3, 9: 3, 10: 3, 14: 1, 15: 1,
    // Social & Santé
    16: 3, 18: 3, 19: 3, 26: 3, 23: 1, 25: 1,
    // Immigration
    27: 3, 28: 3, 29: 3, 35: 3, 32: 1, 34: 1, 36: 1,
    // Sécurité & Justice
    37: 3, 39: 3, 41: 3, 45: 1, 46: 1,
    // Environnement
    47: 3, 48: 3, 55: 3, 53: 1, 54: 1,
    // Europe & Monde (on allège les questions géopolitiques « en fer à cheval »)
    56: 3, 57: 3, 58: 1, 60: 1, 61: 1, 62: 1, 63: 1, 64: 1,
    // Institutions (thème peu clivant gauche/droite → coefficients faibles)
    65: 3, 67: 3, 68: 1, 69: 1, 70: 1, 71: 1, 72: 1, 73: 1, 74: 1,
    // Société & Valeurs
    75: 3, 80: 3, 82: 3, 77: 1, 81: 1, 83: 1, 84: 1,
    // Éducation & Culture (questions pédagogiques non partisanes → faibles)
    85: 3, 87: 3, 88: 1, 89: 1, 91: 1, 92: 1, 93: 1, 94: 1, 95: 1, 96: 1, 98: 1, 99: 1
  };
  function baseCoef(id) { return QUESTION_WEIGHTS[id] || 2; }
  function isEssential(id) { return baseCoef(id) >= 3; }
  // Coefficient cumulable d'une question : barème d'importance × bonus essentielle.
  // importance 1→1 · 2→2 · 3→4 · 4→7 · 5→10 ; question essentielle : ×2.
  var IMP_SCALE = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 10 };
  function questionCoef(q, imp) {
    if (imp == null) imp = 3;
    var base = IMP_SCALE[imp] != null ? IMP_SCALE[imp] : 4;
    var ess = ((q.w || baseCoef(q.id)) >= 3) ? 2 : 1;   // essentielle ×2
    return base * ess;
  }

  // answers : { id: {optIdx, score} } · importance : { id: 1..5 } (optionnel)
  // questions : jeu de questions à utiliser (défaut = QUESTIONS ; le quiz sur-mesure passe le sien)
  function computeUserProfile(answers, importance, questions) {
    importance = importance || {};
    var qs = questions || QUESTIONS;
    var totals = {}, wsum = {};
    SECTIONS.forEach(function (s) { totals[s] = 0; wsum[s] = 0; });
    qs.forEach(function (q) {
      var sc = answerScore(answers[q.id], q);
      if (sc == null) return;
      var imp = importance[q.id];
      if (imp == null) imp = 3;
      // Coefficient CUMULABLE (multiplicatif) :
      //  · question essentielle du thème → ×2 (sinon ×1)
      //  · importance 4 → ×2 · importance 5 → ×3 (importance 1-3 → ×1)
      // Ex. question essentielle notée 5 = ×2 × ×3 = ×6.
      var w = questionCoef(q, imp);
      totals[q.theme] += sc * w;
      wsum[q.theme] += w;
    });
    var profile = {};
    SECTIONS.forEach(function (s) {
      profile[s] = wsum[s] > 0 ? totals[s] / wsum[s] : null;
    });
    return profile;
  }

  // Convention couleurs : DROITE = bleu, GAUCHE = rouge (usage FR).
  // Rappel score : 0 = droite, 10 = gauche.
  function positionLabel(score) {
    if (score <= 2)   return { label: 'Droite radicale', color: 'var(--pol-pos-dr)' };
    if (score <= 3.5) return { label: 'Droite',          color: 'var(--pol-pos-d)' };
    if (score <= 4.5) return { label: 'Centre-droit',    color: 'var(--pol-pos-cd)' };
    if (score <= 5.5) return { label: 'Centre',          color: 'var(--pol-pos-c)' };
    if (score <= 6.5) return { label: 'Centre-gauche',   color: 'var(--pol-pos-cg)' };
    if (score <= 8)   return { label: 'Gauche',          color: 'var(--pol-pos-g)' };
    return                   { label: 'Gauche radicale', color: 'var(--pol-pos-gr)' };
  }

  // ── Comptes rendus par thème (échelle 0=droite → 10=gauche) ──
  // Pour chaque thème, une phrase « tu penses / tu veux » selon la position.
  // emoji = petite illustration ; bands triés du plus à droite au plus à gauche.
  var THEME_STATEMENTS = {
    eco: { emoji: '💶', bands: [
      { max: 2,  t: "Tu es clairement libéral : moins d'impôts, moins d'État, laisser le marché et les entreprises créer la richesse." },
      { max: 4,  t: "Tu penches pour l'économie de marché : baisser les charges et responsabiliser, avec quelques garde-fous." },
      { max: 6,  t: "Tu cherches un équilibre entre marché et État, ni tout libéral ni tout public." },
      { max: 8,  t: "Tu veux un État qui régule et redistribue : taxer davantage les plus riches pour financer les services publics." },
      { max: 11, t: "Tu es franchement anticapitaliste : forte redistribution, services publics étendus, voire nationalisations." }
    ]},
    social: { emoji: '🏥', bands: [
      { max: 2,  t: "Pour toi, place au privé et à la responsabilité individuelle ; les aides doivent être ciblées et conditionnées." },
      { max: 4,  t: "Tu veux maîtriser les dépenses sociales et responsabiliser, tout en gardant un socle de protection." },
      { max: 6,  t: "Tu tiens à la protection sociale, mais tu veux qu'elle soit bien gérée." },
      { max: 8,  t: "Tu veux renforcer l'hôpital public, la Sécu et les aides, pour ne laisser personne de côté." },
      { max: 11, t: "Pour toi la santé et la protection sociale doivent être gratuites et inconditionnelles, financées par les plus riches." }
    ]},
    immigration: { emoji: '🌍', bands: [
      { max: 2,  t: "Tu veux une immigration très restreinte : fermeté aux frontières, expulsions, priorité aux Français." },
      { max: 4,  t: "Tu es pour une immigration maîtrisée et sélective, avec une intégration exigeante." },
      { max: 6,  t: "Tu cherches un équilibre : accueillir sans naïveté, et mieux intégrer." },
      { max: 8,  t: "Tu es plutôt favorable à l'accueil : régulariser les personnes intégrées, respecter le droit d'asile." },
      { max: 11, t: "Tu défends une immigration ouverte : liberté de circulation et régularisation large." }
    ]},
    securite: { emoji: '⚖️', bands: [
      { max: 2,  t: "Tu veux une justice ferme : plus de police, peines lourdes, tolérance zéro." },
      { max: 4,  t: "Tu penches pour la fermeté, avec des peines renforcées pour les récidivistes." },
      { max: 6,  t: "Tu veux un équilibre entre sanction et prévention." },
      { max: 8,  t: "Tu privilégies la prévention et la réinsertion, et tu es attentif aux libertés et aux dérives policières." },
      { max: 11, t: "Pour toi la répression aggrave les choses : priorité aux causes sociales, aux libertés et au contrôle de la police." }
    ]},
    env: { emoji: '🌱', bands: [
      { max: 2,  t: "Pour toi l'économie passe avant l'écologie ; tu te méfies des contraintes environnementales." },
      { max: 4,  t: "Tu veux une transition écologique douce, portée par la technologie, sans brider l'économie." },
      { max: 6,  t: "Tu veux agir pour le climat de façon ambitieuse mais socialement juste." },
      { max: 8,  t: "L'écologie est une priorité forte : sortir des fossiles, transformer en profondeur nos modes de vie." },
      { max: 11, t: "Tu es pour une écologie radicale : décroissance et rupture avec le productivisme." }
    ]},
    europe: { emoji: '🇪🇺', bands: [
      { max: 2,  t: "Tu es souverainiste : reprendre le contrôle national, quitte à sortir des traités (voire de l'UE ou de l'euro)." },
      { max: 4,  t: "Tu veux une Europe des nations et plus de souveraineté française face à Bruxelles." },
      { max: 6,  t: "Tu es pour une UE utile, mais à réformer." },
      { max: 8,  t: "Tu es pro-européen : plus de coopération et une Europe qui protège." },
      { max: 11, t: "Tu es fédéraliste : plus d'intégration, une Europe puissance et solidaire." }
    ]},
    institutions: { emoji: '🏛️', bands: [
      { max: 2,  t: "Tu es attaché aux institutions actuelles et à un exécutif fort (Ve République)." },
      { max: 4,  t: "Tu veux quelques ajustements, sans bouleverser la Ve République." },
      { max: 6,  t: "Tu es ouvert à des réformes démocratiques : dose de proportionnelle, plus de référendums." },
      { max: 8,  t: "Tu veux rééquilibrer les pouvoirs et donner davantage la parole aux citoyens." },
      { max: 11, t: "Tu veux tout refonder : VIe République, assemblée constituante, démocratie directe (RIC)." }
    ]},
    societal: { emoji: '🌈', bands: [
      { max: 2,  t: "Tu es conservateur : attaché aux valeurs et aux traditions, méfiant envers les évolutions sociétales rapides." },
      { max: 4,  t: "Tu es plutôt traditionnel, avec une ouverture prudente sur les questions de société." },
      { max: 6,  t: "Tu es modéré : ni militant progressiste, ni conservateur." },
      { max: 8,  t: "Tu es progressiste : égalité des droits, libertés individuelles, lutte contre les discriminations." },
      { max: 11, t: "Tu es très progressiste : féminisme, droits LGBTQ+ et antiracisme au cœur de ton engagement." }
    ]},
    education: { emoji: '🎓', bands: [
      { max: 2,  t: "Tu veux une école de l'autorité et du mérite : exigence, sélection, savoirs fondamentaux, soutien au privé." },
      { max: 4,  t: "Tu tiens à l'exigence et à l'autorité, avec une école publique solide." },
      { max: 6,  t: "Tu veux une école publique de qualité, équilibrée." },
      { max: 8,  t: "Tu veux une école publique renforcée, plus égalitaire et mieux dotée." },
      { max: 11, t: "Pour toi l'école doit être entièrement gratuite et égalitaire, avec des moyens massifs, contre toute sélection sociale." }
    ]}
  };
  function themeStatement(theme, score) {
    var cfg = THEME_STATEMENTS[theme]; if (!cfg) return '';
    for (var i = 0; i < cfg.bands.length; i++) { if (score <= cfg.bands[i].max) return cfg.bands[i].t; }
    return cfg.bands[cfg.bands.length - 1].t;
  }
  function themeEmoji(theme) { return ''; } // Direction A 01/09 : les thèmes s'identifient par libellé + couleur, plus d'emoji-icône

  // ── Sondages 1er tour (estimations, mi-2026) — ÉVOLUE dans le temps ──
  // Le Pen OU Bardella (un seul se présentera) ; % indicatifs, sources multiples.
  var POLLS_DATE = "mi-septembre → début octobre 2026 (15/09-08/10, avant la victoire de Glucksmann)";
  var POLLS_SOURCES = "Moyenne des hypothèses avec Raphaël Glucksmann candidat PS-PP (15 hypothèses) — Toluna Harris Interactive pour M6-RTL (8-10/09, 22-24/09, 5-8/10) · Ifop-Fiducial pour LCI-Le Figaro-Sud Radio (25-29/09) · YouGov pour Le HuffPost (17-21/09) · Cluster17 pour Politico (15-16/09) · Ipsos BVA pour Le Parisien et Le Monde-CEVIPOF (31/08-09/09) · OpinionWay pour le JDD et Les Échos (02-09/09). Philippe : 18 % seul candidat du bloc central, 13 % avec Attal. 2nd tour : Le Pen 56-44 face à Philippe, 67-33 face à Mélenchon, 59-41 face à Glucksmann (YouGov). Aucun sondage réalisé après le 11/10";
  var POLLS = {
        "Marine Le Pen": 34,
        "Jean-Luc Mélenchon": 17.5,
        "Édouard Philippe": 16,
        "Raphaël Glucksmann": 10.5,
        "Gabriel Attal": 10.5,
        "Bruno Retailleau": 8,
        "François Hollande": 7,
        "Éric Zemmour": 4.5,
        "Marine Tondelier": 3,
        "David Lisnard": 3,
        "Fabien Roussel": 2.5,
        "François Ruffin": 2.5,
        "Bruno Le Maire": 3,
        "Nicolas Dupont-Aignan": 2,
        "Dominique de Villepin": 2,
        "Xavier Bertrand": 1,
        "Nathalie Arthaud": 1,
        "Karim Bouamrane": 1,
        "Florian Philippot": 1,
        "François Asselineau": 0.7,
        "Anasse Kazib": 0.5,
        "Selma Labib": 0.5,
        "Delphine Batho": 0.5
  };
  var POLLS_RANGE = {
    "Marine Le Pen":[30,37],
    "Jean-Luc Mélenchon":[14,20],
    "Édouard Philippe":[10,24],
    "Raphaël Glucksmann":[8,14],
    "Gabriel Attal":[5,17],
    "Bruno Retailleau":[5,11],
    "François Hollande":[4,8],
    "Éric Zemmour":[3,6],
    "Marine Tondelier":[2,7],
    "David Lisnard": [2, 5.2],
    "Fabien Roussel":[1,3.5],
    "François Ruffin":[2,3],
    "Nicolas Dupont-Aignan":[1,4],
    "Dominique de Villepin":[2,3.5],
    "Nathalie Arthaud":[0.5,1]
  };
  // Calendrier de la campagne (dates connues au 29 août 2026)
  var KEY_DATES = [
    {"date":"2026-09-06","label":"Fabien Roussel désigné candidat du PCF (72 % des adhérents)"},
    {"date":"2026-09-16","label":"Cinq candidats validés pour la primaire PS / Place publique / GRS (Faure, Glucksmann, Guedj, Maurel, Royal) ; Philippe Brun écarté"},
    {"date":"2026-09-17","label":"Éric Zemmour annonce sa candidature (BFMTV) · début du mouvement lycéen"},
    {"date":"2026-09-19","label":"Nicolas Dupont-Aignan officialise sa 4e candidature"},
    {"date":"2026-09-27","label":"Élections sénatoriales : 1er groupe RN au Sénat, LFI y entre, Retailleau réélu en Vendée"},
    {"date":"2026-10-01","label":"Projet de loi de finances 2027 en Conseil des ministres (déficit visé 5 %, 54 Md€ d'efforts)"},
    {"date":"2026-10-06","label":"Contre-budget du RN (140 Md€ d'économies d'ici 2032) · manifestation lycéenne nationale"},
    {"date":"2026-10-11","label":"Raphaël Glucksmann remporte la primaire PS / Place publique / GRS dès le 1er tour (66 %) — vote prolongé après une cyberattaque · meeting de Mélenchon à Clermont-Ferrand"},
    {"date":"2026-10-13","label":"Début de l'examen du budget 2027 à l'Assemblée (vote solennel vers mi-novembre)"},
    {"date":"2026-10-24","label":"Congrès du RN à Orléans (24-25 octobre)"},
    {"date":"2026-11-06","label":"Nouvelle édition de « L'Avenir en commun » (LFI, 6-7 novembre)"},
    {"date":"2026-11-07","label":"Rencontre de la droite et du centre proposée par Édouard Philippe (début novembre ; Retailleau refuse) · convention d'investiture de Glucksmann envisagée (7-8/11)"},
    {"date":"2026-12-10","label":"Référendum des adhérents écologistes : candidature Tondelier ou ralliement (10-13 décembre)"},
    {"date":"2026-12-31","label":"Décision de François Hollande (fin décembre / début janvier) · officialisation attendue de Xavier Bertrand"},
    {"date":"2027-02-07","label":"Au plus tard : décret de convocation des électeurs, ouverture de la collecte des parrainages"},
    {"date":"2027-03-12","label":"Date limite de dépôt des 500 parrainages au Conseil constitutionnel"},
    {"date":"2027-04-01","label":"Au plus tard début avril : décision de la Cour de cassation sur le pourvoi de Marine Le Pen"},
    {"date":"2027-04-18","label":"1er tour de l'élection présidentielle"},
    {"date":"2027-05-02","label":"2nd tour de l'élection présidentielle"}
  ];
  var DATA_DATE = "12 octobre 2026";

  // (01/09) Questions retirées du quiz — les blocs restent dans QUESTIONS ci-dessus
  // (données/positions conservées, réponses stockées inoffensives), seul ce filtre les
  // sort du quiz. Réversible en vidant la liste.
  // · Audit doublons (retour Adrien « des questions se répètent ») : Q30 (intégration)
  //   ≈ Q78 (identité nationale), Q51 (éoliennes) ≈ Q8 (énergie), Q65 (VIe Rép) ≈ Q110,
  //   Q84 (religion espace public) ≈ Q32 (voile) + Q77 (laïcité école).
  // · Resserrage à 100 questions (retour Adrien 01/09 soir) : retrait des 8 questions les
  //   moins discriminantes (écart de scores ≤ 4 pts entre options, sujets secondaires) —
  //   Q73 cumul des mandats, Q88 smartphones à l'école, Q91 langues régionales, Q92 sport
  //   à l'école, Q93 redoublement, Q94 service civique, Q98 éducation aux médias, Q99 philo.
  var RETIRED_QIDS = [30, 51, 65, 84, 73, 88, 91, 92, 93, 94, 98, 99];
  QUESTIONS = QUESTIONS.filter(function (q) { return RETIRED_QIDS.indexOf(q.id) === -1; });

  // Expose tout sous un seul namespace isolé
  window.POL = {
    QUESTIONS: QUESTIONS,
    CANDIDATES: CANDIDATES,
    POLLS: POLLS,
    POLLS_DATE: POLLS_DATE,
    POLLS_SOURCES: POLLS_SOURCES,
    POLLS_RANGE: POLLS_RANGE,
    KEY_DATES: KEY_DATES,
    DATA_DATE: DATA_DATE,
    STATUS_ICONS: { 'déclaré': '', 'primaire': '', 'conditionnel': '', 'pressenti': '', 'retiré': '', 'réserve': '' },
    STATUS_LABELS: { 'déclaré': 'Officiellement déclaré', 'primaire': 'Candidat à la primaire PS/PP (oct.)', 'conditionnel': 'Quasi-déclaré', 'pressenti': 'Pressenti', 'retiré': 'Retiré', 'réserve': 'Plan B' },
    BLOC_LABELS: { exg: 'Extrême gauche', gauche: 'Gauche & écologistes', centre: 'Centre', droite: 'Droite & souverainistes', exd: 'Extrême droite' },
    isRunning: function (c) { return c.status !== 'retiré' && c.status !== 'réserve'; },
    SECTIONS: SECTIONS,
    SECTION_LABELS: SECTION_LABELS,
    SECTION_COLORS: SECTION_COLORS,
    computeMatch: computeMatch,
    answerScore: answerScore,
    computeUserProfile: computeUserProfile,
    computeThemeWeights: computeThemeWeights,
    baseCoef: baseCoef,
    isEssential: isEssential,
    questionCoef: questionCoef,
    positionLabel: positionLabel,
    themeStatement: themeStatement,
    themeEmoji: themeEmoji
  };
})();
