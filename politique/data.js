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
      "question": "Dette publique (~118 % du PIB) : urgence ou pas ?",
      "explanation": "La <strong>dette publique</strong>, c'est l'argent que l'État a emprunté au fil des ans et qu'il doit rembourser. Elle atteint désormais environ <strong>118 % du PIB</strong>, soit plus de <strong>3 500 milliards d'euros</strong> : la France doit nettement plus que tout ce qu'elle produit en une année. Le déficit reste l'un des plus élevés de la zone euro (5,4 % en 2025, objectif 5 % pour 2026 dans un budget adopté au forceps par 49.3 en février 2026), et la charge des <strong>intérêts</strong> dépasse 60 milliards par an — plus que le budget de la Défense. Pour certains (souvent à <strong>droite</strong> et au centre), c'est une urgence : réduire les dépenses pour ne pas laisser un fardeau aux générations futures et rester crédible face aux marchés. Pour d'autres (souvent à <strong>gauche</strong>), tant que les taux restent soutenables, mieux vaut investir (santé, écologie) et faire contribuer les plus riches ; l'austérité casserait la croissance.",
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
          "text": "Renforcer massivement Frontex. Stopper tous les passages irréguliers.",
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
      "explanation": "Les prisons françaises sont <strong>surpeuplées</strong> : record de <strong>89 668 détenus au 1er août 2026</strong> (+6,5 % sur un an, chiffres publiés le 1er septembre) pour environ 63 300 places, soit un taux d'occupation de <strong>141,6 %</strong> — et près de <strong>175 % dans les maisons d'arrêt</strong>, où des détenus dorment sur des matelas au sol. La France a été condamnée pour ces conditions. Deux réponses s'opposent. <strong>Construire plus de places</strong> : le plan « 15 000 places » a pris du retard, la droite et le RN promettent des dizaines de milliers de places supplémentaires et des prisons de haute sécurité pour les narcotrafiquants (loi de 2025). <strong>Emprisonner moins</strong> : développer les <strong>peines alternatives</strong> (bracelet, TIG, sursis probatoire) pour les délits légers, car la prison courte favoriserait la récidive et coûte cher. Beaucoup jugent qu'il faut les deux, mais construire prend des années et les alternatives suscitent un débat sur la <strong>fermeté</strong>.",
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
    {"name":"Nathalie Arthaud","party":"Lutte ouvrière (LO)","status":"déclaré","color":"#B71C1C","oneLiner":"Candidate communiste révolutionnaire portant la voix des travailleurs et l'expropriation du grand capital.","program":{"eco":"Arthaud défend un programme communiste révolutionnaire de renversement du capitalisme et de contrôle ouvrier. Elle réclame un SMIC à 2 000 euros net, l'indexation automatique de tous les salaires et pensions sur la hausse des prix, et l'interdiction pure et simple des licenciements avec répartition du travail entre tous sans perte de salaire. Elle propose la levée du secret des affaires et bancaire pour que les travailleurs contrôlent les comptes des entreprises, ainsi que l'expropriation des banques et des grands groupes.","social":"Elle défend inconditionnellement les services publics utiles aux classes populaires, en particulier l'hôpital, financés par les profits des grandes entreprises plutôt que par l'austérité. Elle dénonce toutes les politiques d'austérité, de droite comme de gauche de gouvernement, et l'insuffisance des minima sociaux. Sa logique est d'imposer les besoins des travailleurs (santé, salaires, emploi) contre la logique du profit capitaliste.","immigration":"Arthaud rejette toute division entre travailleurs français et immigrés, avec ou sans papiers, au nom de la solidarité de classe. Elle est favorable à la régularisation des sans-papiers et combat la xénophobie et le nationalisme qu'elle présente comme des armes de la bourgeoisie pour diviser les exploités. Pour elle, les travailleurs du monde entier ont les mêmes intérêts, quelle que soit leur origine.","securite":"Elle inscrit la question dans une critique de l'État bourgeois, dénonçant la répression contre le monde du travail et les quartiers populaires plutôt que d'appeler au durcissement pénal. Elle s'oppose aux budgets militaires et à l'escalade guerrière. Sa priorité est la défense du droit de grève et des libertés syndicales face à l'appareil répressif.","env":"Arthaud lie systématiquement la crise écologique au capitalisme et à la recherche du profit, jugée incompatible avec la protection de l'environnement. Elle estime qu'aucune écologie réelle n'est possible sans que les travailleurs contrôlent la production. Elle refuse une écologie qui ferait porter les efforts sur les classes populaires (taxes, hausses de prix) et vise l'expropriation et la planification par les producteurs eux-mêmes.","europe":"Elle défend un internationalisme prolétarien opposé au nationalisme et rejette aussi bien l'Union européenne des capitalistes que les replis souverainistes. Elle dénonce l'OTAN, les interventions impérialistes et les budgets de guerre comme servant les intérêts du capital. Sa perspective est l'unité internationale des travailleurs, non un aménagement des institutions européennes.","institutions":"Arthaud ne propose pas de réforme institutionnelle classique (constituante, proportionnelle, référendum) car elle considère que les institutions bourgeoises ne changeront pas le rapport d'exploitation. Elle voit l'élection présidentielle avant tout comme une tribune pour le camp des travailleurs. Le pouvoir réel doit selon elle venir de la mobilisation et de l'auto-organisation des travailleurs.","societal":"Elle défend l'unité de la classe ouvrière par-delà les origines, les religions et les identités, tout en combattant le racisme et la xénophobie. Elle soutient les droits des femmes et l'égalité, en les rattachant à la lutte contre l'exploitation capitaliste plutôt qu'à une approche identitaire séparée. Elle refuse d'instrumentaliser la laïcité pour stigmatiser une partie des travailleurs.","education":"Arthaud défend l'école publique comme service public essentiel aux classes populaires et s'oppose aux suppressions de postes et à la dégradation des conditions d'enseignement. Elle réclame les moyens humains et matériels nécessaires, financés par les profits capitalistes."},"scores":{"eco":10,"social":10,"immigration":10,"securite":8,"env":6,"europe":3,"institutions":8,"societal":10,"education":10},"bloc":"exg","declared":"2025-12"},
    {"name":"Anasse Kazib","party":"Révolution Permanente","status":"déclaré","color":"#D32F2F","oneLiner":"Cheminot et porte-parole de Révolution Permanente, candidat déclaré le 1er juin 2026 pour une rupture révolutionnaire anticapitaliste.","program":{"eco":"Kazib porte une candidature ouvrière, communiste et révolutionnaire d'inspiration trotskiste, centrée sur la nouvelle classe ouvrière précaire. Il réclame une forte hausse des salaires avec une échelle mobile indexée sur l'inflation, l'interdiction des licenciements (notamment dans les entreprises qui versent des dividendes) et le partage du travail. Il défend l'expropriation des grands groupes et des banques sous contrôle des travailleurs et le refus de la dette réclamée aux classes populaires.","social":"Il défend massivement les services publics, avec des embauches dans les hôpitaux et une opposition frontale à la réforme des retraites et au report de l'âge légal, revendiquant le retour à 60 ans. Il met au premier plan la jeunesse précaire, les intérimaires, les livreurs et les habitants des quartiers populaires. Il réclame un accès garanti à la santé et au logement financé par la ponction sur les profits.","immigration":"Kazib défend la régularisation de tous les sans-papiers et la liberté de circulation, avec une attention à la jeunesse précaire avec ou sans papiers. Il combat le racisme d'État et les contrôles au faciès, et refuse toute distinction entre travailleurs selon leur origine ou statut. Sa position est internationaliste : union des travailleurs immigrés et français contre le patronat.","securite":"C'est l'un de ses axes forts : il dénonce les violences policières et la répression dans les quartiers populaires, sa colistière étant une avocate défendant les victimes de violences policières. Il réclame le désarmement de la police, la dissolution de brigades comme la BAC et une justice au service des exploités. Il défend inconditionnellement le droit de grève et de manifester.","env":"Kazib porte une écologie anticapitaliste (écosocialiste), considérant que la crise climatique est une crise du capitalisme et de la course au profit. Il défend une planification écologique sous contrôle démocratique des travailleurs et l'expropriation des grands pollueurs et multinationales de l'énergie. Il refuse une écologie qui pèserait sur les classes populaires via des taxes.","europe":"Il est anti-impérialiste et défend une rupture avec l'Union européenne des traités et du capital, ainsi qu'avec l'OTAN. Il soutient fermement la cause palestinienne, position pour laquelle il a été poursuivi, et s'oppose aux interventions militaires et à l'économie de guerre. Sa boussole est l'internationalisme et la solidarité entre travailleurs des différents pays.","institutions":"Kazib ne mise pas sur une réforme institutionnelle par le haut mais sur l'auto-organisation, les assemblées de travailleurs et la grève générale. Il conçoit sa candidature comme un outil pour rendre visible la voix de la nouvelle classe ouvrière absente du champ électoral. Il vise à terme un pouvoir des travailleurs plutôt qu'un aménagement de la Ve République.","societal":"Il porte un programme antiraciste, féministe et de défense des droits LGBTQ+, articulé à la lutte des classes. Il défend les habitants des quartiers populaires et les personnes issues de l'immigration contre les stigmatisations, et refuse l'instrumentalisation de la laïcité à des fins racistes. Ces combats sont présentés comme indissociables du combat anticapitaliste.","education":"Kazib défend une école publique dotée de moyens, contre la précarité étudiante et la sélection sociale, et s'appuie fortement sur la jeunesse mobilisée. Il combat les suppressions de postes et la dégradation des conditions dans l'enseignement, dans la défense globale des services publics."},"scores":{"eco":10,"social":10,"immigration":10,"securite":9,"env":8,"europe":3,"institutions":9,"societal":10,"education":10},"bloc":"exg","declared":"2026-06-01"},
    {"name":"Selma Labib","party":"Nouveau Parti anticapitaliste (NPA)","status":"déclaré","color":"#C4122F","oneLiner":"Porte-parole du NPA-Révolutionnaires, candidate déclarée en juin 2026 : jeune génération anticapitaliste, écosocialiste et internationaliste.","program":{"eco":"Candidate du NPA-Révolutionnaires, conductrice de bus, Labib défend un programme anticapitaliste de rupture sous le mot d'ordre d'un monde sans frontières ni patrons. Elle réclame qu'aucun salaire ni revenu ne soit inférieur à 2 000 euros net, la semaine de 32 heures, l'interdiction des licenciements et le partage du travail. Elle propose l'expropriation des grandes fortunes et des grandes entreprises, nationalisées sous contrôle des travailleurs.","social":"Elle défend une santé et une protection sociale intégralement financées par la ponction sur les profits, avec un fort renforcement de l'hôpital public. Elle réclame l'augmentation massive des minima sociaux et l'accès garanti au logement. Sa perspective écosocialiste subordonne les besoins sociaux au contrôle démocratique de la production par les travailleurs.","immigration":"C'est un axe central : Labib défend l'ouverture des frontières, la liberté de circulation et d'installation, la régularisation de tous les sans-papiers et l'abolition de l'agence Frontex. Elle s'oppose à toute distinction entre travailleurs selon leur origine ou statut légal. Sa campagne est explicitement placée sous le signe de l'internationalisme.","securite":"Elle réclame la dissolution des brigades anti-criminalité (BAC) et des unités comme la BRAV-M, le désarmement de la police et une justice populaire. Elle dénonce les violences policières et la répression des mouvements sociaux et des quartiers populaires. Elle défend inconditionnellement le droit de grève et de manifester.","env":"Labib porte un écosocialisme radical, analysant la crise climatique comme une crise du capitalisme, et réclame la sortie immédiate du nucléaire. Elle défend une planification écologique sous contrôle démocratique et l'expropriation des grands groupes énergétiques et industriels pollueurs. Elle refuse toute écologie de marché faisant payer les classes populaires.","europe":"Elle prône une rupture avec les traités européens, jugeant l'UE intrinsèquement capitaliste, et s'oppose à l'OTAN. Elle défend l'internationalisme, la solidarité avec les peuples opprimés et la cause palestinienne, contre l'impérialisme et l'économie de guerre. Sa perspective est celle des États-Unis socialistes d'Europe.","institutions":"Labib ne mise pas sur les institutions de la Ve République ni sur des réformes par le haut mais sur l'auto-organisation, les assemblées et la grève générale. Sa candidature vise à porter une voix ouvrière et révolutionnaire indépendante des partis de gauche institutionnels. L'objectif affiché est un pouvoir des travailleurs.","societal":"Le NPA porte un programme très progressiste sur les droits des femmes, des personnes LGBTQ+ et des minorités, contre toutes les oppressions. Labib combat le racisme, l'islamophobie et l'instrumentalisation de la laïcité contre les populations immigrées. Ces luttes sont pensées comme partie intégrante du combat anticapitaliste.","education":"Elle défend une école et une université publiques massivement financées, contre la sélection et la précarité étudiante, et s'appuie sur la jeunesse mobilisée. Elle combat les suppressions de postes et la dégradation des conditions d'enseignement, dans le refus global de l'austérité."},"scores":{"eco":10,"social":10,"immigration":10,"securite":9,"env":9,"europe":3,"institutions":9,"societal":10,"education":10},"bloc":"exg","declared":"2026-06"},
    {"name":"Jean-Luc Mélenchon","party":"La France insoumise (LFI)","status":"déclaré","color":"#CC2443","oneLiner":"Chef de file de la gauche radicale, 4e candidature (déclarée le 3 mai 2026), refuse toute primaire ; campagne lancée aux AMFIS le 23 août (« la victoire est possible », censure promise du budget 2027, VIe République). 2e des sondages (16-19 %), mais perdant 67-33 face à Le Pen. Au débat du Medef : annulation de la dette BCE, retour aux 60 ans, « il faut des normes » — sifflé par les patrons.","program":{"eco":"Mélenchon (LFI, programme L'Avenir en commun) propose un SMIC à 1 600 euros net, le retour de la retraite à 60 ans après 40 ans de cotisation et le maintien des 35 heures. Il rétablit et renforce l'ISF avec un volet climatique, taxe fortement les hauts patrimoines (héritage plafonné autour de 12 millions d'euros) et supprime des exonérations de cotisations patronales. Il défend une économie planifiée par l'investissement public, avec la nationalisation d'EDF et de secteurs stratégiques, et interdit les délocalisations pendant 10 ans pour les entreprises aidées.","social":"Il vise le remboursement à 100% des soins prescrits par la Sécurité sociale et un plan d'urgence pour l'hôpital public avec recrutements massifs et fin de la tarification à l'activité. Il augmente les minima sociaux, revalorise le RSA et l'AAH et lutte contre les déserts médicaux par des centres de santé publics. Sur le logement, il encadre les loyers, construit massivement du logement social et instaure une garantie contre les expulsions. Il maintient l'Aide médicale d'État.","immigration":"Mélenchon défend une politique humaniste : régularisation des travailleurs sans papiers, rétablissement de la carte de séjour de 10 ans et facilitation du regroupement familial. Il rétablit le droit du sol intégral, accorde le droit de vote aux résidents étrangers aux élections locales et augmente les places d'accueil. Il abroge les lois asile-immigration jugées restrictives.","securite":"Il prône une déflation carcérale et privilégie la réinsertion aux peines automatiques, s'opposant aux peines planchers. Il remplace l'IGPN par une autorité indépendante de contrôle de la police et développe les alternatives à l'emprisonnement. Il maintient le principe éducatif de l'ordonnance de 1945 pour la justice des mineurs et défend l'application des mandats de la CPI, y compris contre des alliés.","env":"Il fait de la planification écologique la colonne vertébrale de son programme, avec 100% d'énergies renouvelables en 2050 et la sortie du nucléaire (abandon des EPR, démantèlement progressif). Il met fin aux subventions aux fossiles, taxe les superprofits pétroliers et instaure un moratoire sur les nouvelles autoroutes. Il interdit la vente de véhicules thermiques neufs en 2035, le glyphosate immédiatement et vise -50% de pesticides d'ici 2030.","europe":"Il défend la désobéissance aux traités européens sans sortie de l'UE, et l'harmonisation fiscale contre le dumping. Il propose la sortie du commandement intégré puis de l'OTAN et une diplomatie non-alignée. Sur l'Ukraine, il privilégie une solution négociée et se montre réservé sur l'accroissement de l'aide militaire. Il réduit la présence militaire française en Afrique.","institutions":"Il propose de convoquer une Assemblée constituante par référendum pour instaurer une VIe République parlementaire. Il supprime l'article 49.3, instaure la proportionnelle intégrale aux législatives et le référendum d'initiative citoyenne (RIC). Il abaisse le droit de vote à 16 ans et rend les mandats incompatibles avec des activités privées.","societal":"Il porte des positions très progressistes : légalisation encadrée du cannabis sous monopole public, allongement du délai de l'IVG à 14 semaines avec remboursement intégral, PMA universelle remboursée. Il est favorable à l'aide à mourir mais opposé à la GPA. Sur la laïcité, il défend la liberté des usagers des services publics de porter des signes religieux et généralise l'éducation à la sexualité.","education":"Il crée environ 190 000 postes dans l'Éducation nationale, titularise les contractuels et crée un corps de fonctionnaires pour les AESH. Il met fin aux suppressions de postes et réforme la carte scolaire pour imposer davantage de mixité sociale. Il s'oppose à l'uniforme obligatoire et à Parcoursup dans sa forme actuelle."},"scores":{"eco":9,"social":9,"immigration":8,"securite":8,"env":8,"europe":4,"institutions":10,"societal":9,"education":9},"bloc":"gauche","declared":"2026-05-03"},
    {"name":"Raphaël Glucksmann","party":"Place publique","status":"primaire","color":"#E5006D","oneLiner":"Eurodéputé Place publique, déclaré le 23 août au 20h de TF1 dans le cadre de la primaire PS/PP (9-17 octobre) dont il est le favori (soutiens de Vallaud, Delga, Mayer-Rossignol, Jadot) : « chasser l'esprit de défaite de la gauche », taxer les « méga-héritages » > 2 M€ pour hausser le net, abroger la réforme Borne, « nouveau contrat patriotique » face à la Chine ; 10-18 %.","program":{"eco":"Son « obsession » : augmenter la rémunération nette des travailleurs en baissant les prélèvements sur les salaires, financés par la taxation des superprofits, une fiscalité plus lourde sur les gros héritages, la suppression de niches fiscales et une contribution des retraités les plus aisés. Il porte un plan d'investissement public vert de 100 milliards d'euros sur dix ans pour réindustrialiser (éolien, solaire, batteries, hydrogène) et réduire la dépendance à la Chine. Sur les retraites, il ne fait pas de l'âge légal « un totem » et met l'accent sur la pénibilité.","social":"Il défend le reste à charge zéro en santé, des embauches massives à l'hôpital et un plan pluriannuel de recrutement des soignants. Il crée des centres de santé publics contre les déserts médicaux et augmente le RSA et l'AAH en s'opposant à leur conditionnalité punitive. Il propose la PMA intégralement remboursée, la contraception gratuite et la légalisation de l'aide à mourir.","immigration":"Glucksmann défend le contrôle des frontières tout en refusant le discours de la submersion et en créant des voies légales d'immigration à l'échelle européenne. Il soutient une immigration de travail dans les secteurs en tension, avec des quotas selon les besoins, et facilite le regroupement familial. Il s'oppose aux restrictions de l'AME et du droit du sol, et soutient un devoir de sauvetage en Méditerranée.","securite":"Il défend une sécurité sans naïveté, combinant répression des trafics et lutte contre les racines de la délinquance. Il concentre la police sur les criminels, les bandes et les mafias, applique strictement les OQTF et rénove les prisons contre la surpopulation. Il crée une autorité indépendante pour enquêter sur les violences policières.","env":"Il fixe un calendrier de sortie des fossiles (charbon 2030, gaz 2035, pétrole 2045) et vise 45% de renouvelables dans le mix européen en 2030, tout en maintenant le nucléaire comme énergie de transition. Il supprime les subventions aux fossiles, reconnaît le crime d'écocide, protège 30% des espaces d'ici 2030 et interdit les pesticides les plus nocifs. Il interdit les véhicules thermiques neufs dès 2035.","europe":"Européen convaincu : fonds de défense européen de 100 milliards et emprunt commun de 500 milliards pour l'industrie de défense, budget militaire français à 3 % du PIB, extension de la dissuasion nucléaire française à l'échelle européenne, soutien total à l'Ukraine et fermeté face à la Russie et à Trump. Il défend une Europe puissance, sociale et écologique, et l'adhésion de l'Ukraine à l'UE.","institutions":"Il propose une réforme vers plus de parlementarisme : suppression de l'article 49.3, investiture du Premier ministre par vote de confiance. Il instaure la proportionnelle, le référendum d'initiative citoyenne et généralise les conventions citoyennes. Il limite la concentration de la propriété des médias et interdit la reconnaissance faciale dans l'espace public.","societal":"Il défend une laïcité de neutralité des agents publics (mais pas des usagers) et des positions progressistes : légalisation du cannabis sous monopole public, reconnaissance d'une mention de genre neutre. Il veut inscrire l'IVG dans la Charte européenne des droits et rembourser intégralement la PMA. Il propose l'interdiction de la corrida et une taxe sur la fast fashion.","education":"Il ne supprime pas Parcoursup mais le repense avec une orientation personnalisée renforcée en amont. Il intègre les écoles privées sous contrat à la carte scolaire pour favoriser la mixité sociale et procède à des embauches massives avec revalorisation des enseignants. Il propose un service universel obligatoire (civique ou environnemental)."},"scores":{"eco":6,"social":6,"immigration":6,"securite":5,"env":7,"europe":9,"institutions":4,"societal":7,"education":6},"bloc":"gauche","declared":"2026-08-23"},
    {"name":"Olivier Faure","party":"Parti socialiste (PS)","status":"primaire","color":"#E91E63","oneLiner":"Premier secrétaire du PS : CANDIDAT à la primaire depuis le 30 août (20H de TF1 : « Je suis candidat à la présidence de la République ») — 5e candidat, outsider face à Glucksmann ; promet de « réparer » la France après « dix ans d'immense gâchis », exclut tout ralliement à Mélenchon, défend la taxation des héritages et promet la censure du budget Lecornu ; sondé à 4-5 %.","program":{"eco":"Faure (Premier secrétaire du PS) propose de rétablir l'ISF avec une taxation de 1% sur les patrimoines supérieurs à 10 millions d'euros, une taxe sur les superprofits des pétroliers et l'imposition des grandes successions au-delà de 2 millions. Il défend un écart salarial maximal de 1 à 20 et porte le SMIC à environ 1 690 euros net. Il défend les 35 heures et s'oppose aux exonérations de cotisations patronales. Sur les retraites, il abroge la réforme Borne et abaisse l'âge légal à 62 ans par répartition.","social":"Il propose une hausse du RSA et de l'AAH et un remboursement à 100% par la Sécurité sociale d'un panier de soins essentiels. Il crée des centres de santé publics avec médecins salariés, régule l'installation des médecins contre les déserts et instaure un congé menstruel remboursé. Sur le logement, il programme des constructions massives, encadre les loyers, réquisitionne les logements vacants et s'oppose aux facilités d'expulsion.","immigration":"Faure s'oppose à la réduction de l'immigration légale, à la suppression de l'AME et aux restrictions du droit du sol. Il est favorable à la régularisation par le travail (un contrat d'au moins 6 mois ouvrant droit à un titre de séjour), au regroupement familial et à un accueil renforcé des demandeurs d'asile. Il défend le droit de vote des résidents réguliers aux élections locales et une réforme du règlement de Dublin.","securite":"Il s'oppose aux peines planchers et au jugement des mineurs de 16 ans comme des majeurs. Il défend l'indépendance des juges et une autorité indépendante pour les enquêtes sur les violences policières. Il privilégie les peines alternatives (TIG, bracelet) pour les délits non violents et vise la réduction du taux carcéral.","env":"Faure vote contre la loi d'accélération du nucléaire (EPR2) et vise un mix 100% décarboné à 2050. Il met fin aux subventions aux fossiles, instaure un moratoire sur les nouvelles autoroutes et interdit les véhicules thermiques neufs d'ici 2035. Il interdit progressivement l'élevage intensif et les pesticides, inscrit le crime d'écocide dans le code pénal et défend le Zéro artificialisation nette.","europe":"Il est opposé à la sortie de l'UE comme de l'OTAN et soutient une défense européenne commune et l'harmonisation fiscale. Il défend un fort soutien militaire à l'Ukraine et s'oppose à des relations normales avec la Russie. Il applique les mandats de la CPI, y compris contre des alliés, et accroît l'aide au développement.","institutions":"Faure propose la suppression de l'article 49.3 et un renforcement des pouvoirs du Parlement. Il abaisse le seuil du référendum d'initiative partagée, crée un RIC et abaisse le droit de vote à 16 ans aux locales. Il élargit les incompatibilités parlementaires et limite la concentration de la propriété des médias.","societal":"Il soutient la reconnaissance d'un genre neutre à l'état civil et la PMA élargie. Il a voté pour la légalisation de l'aide à mourir en 2025 et défend l'IVG inscrite dans la Constitution avec un accès facilité. Sur la laïcité, il s'oppose à l'interdiction des signes religieux pour les usagers des services publics, tout en soutenant l'éducation à la sexualité obligatoire.","education":"Il propose de remplacer Parcoursup par un accès plus transparent et fait de la mixité sociale une priorité en renforçant la carte scolaire. Il lance un plan d'urgence pour l'éducation avec revalorisation des enseignants et recrutements massifs. Il défend l'école comme service public à préserver et renforcer."},"scores":{"eco":7,"social":7,"immigration":7,"securite":6,"env":7,"europe":7,"institutions":6,"societal":8,"education":7},"bloc":"gauche"},
    {"name":"François Hollande","party":"Parti socialiste (PS)","status":"pressenti","color":"#F06292","oneLiner":"Ancien président (2012-2017), député : PAS déclaré — refuse la primaire PS/PP, publie « Unir » le 3 septembre (63 ans puis durée de cotisation, TVA sociale, contribution > 10 M€, regroupement familial resserré, quotas sociaux dans le privé) et décidera « en décembre ». Face-à-face avec Philippe à Sens le 29/08 : « s'unir sur l'essentiel » contre RN et LFI. 7,5-12 % quand il est testé.","program":{"eco":"Ligne sociale-démocrate de gouvernement : sérieux budgétaire assumé (il revendique la baisse du déficit sous son mandat) mais refus de l'austérité, retour de l'âge légal à 62 ans avec 43 annuités modulées selon la pénibilité (position du PS), fiscalité plus juste sur les hauts patrimoines sans « matraquage », soutien à l'industrie et à l'apprentissage. Il se présente comme un rempart d'expérience face au RN et à LFI.","social":"Sur les retraites, il a plaidé pour une suspension temporaire de la réforme (report à 64 ans) afin de rouvrir un débat plus large. Son bilan comporte la généralisation de la complémentaire santé, le tiers payant, le compte pénibilité et les contrats aidés. Il s'est opposé à la suppression de l'AME prévue dans la loi immigration de 2024. Il défend un modèle protecteur reposant sur la Sécurité sociale et le dialogue social.","immigration":"Hollande tient une ligne de fermeté républicaine tempérée par l'humanisme : il a qualifié la loi immigration de 2024 de « défaite pour la République » tout en reconnaissant des mesures utiles. Il s'est opposé à la déchéance de nationalité et à la suppression de l'AME. Durant son mandat, il a appliqué la circulaire Valls encadrant les régularisations au cas par cas. Il défend une politique migratoire maîtrisée, articulée avec l'intégration et le droit d'asile.","securite":"Hollande assume une ligne régalienne : sous son mandat, création de postes de policiers, gendarmes et magistrats, état d'urgence après 2015 et renforcement de l'arsenal antiterroriste. Il avait porté un temps la déchéance de nationalité pour les binationaux terroristes, avant de l'abandonner. Pour 2027, il met en avant la capacité de l'État à garantir l'ordre républicain. Il articule fermeté et respect de l'État de droit.","env":"Son bilan comprend la loi de transition énergétique de 2015 (objectif de 50% de nucléaire dans le mix) et la COP21 aboutissant à l'Accord de Paris. Il défend son bilan nucléaire comme atout de souveraineté et de décarbonation. Il prône une transition compatible avec l'industrie et l'emploi, refusant une écologie punitive. Il soutient les renouvelables tout en maintenant le nucléaire.","europe":"Européen convaincu, Hollande veut une candidature de gauche pro-européenne, hostile aux compromis avec LFI. Face à Trump et aux guerres, il insiste sur une France qui « tient son rang », soutient l'Ukraine et défend le renforcement de la défense européenne. Il reste attaché à la dissuasion nucléaire française. Il plaide pour une Europe puissance capable de peser face aux USA, à la Russie et à la Chine.","institutions":"Fidèle à 2012, il soutient une dose de proportionnelle à l'Assemblée. Il a fait adopter la loi sur le non-cumul des mandats de 2014. Il défend les institutions de la Ve République et un président garant de la cohésion, sans rupture radicale. Il valorise le rassemblement d'une gauche républicaine et réformiste.","societal":"Il revendique le mariage pour tous (loi Taubira de 2013) comme une avancée majeure. Il défend une laïcité conçue comme « école du respect » et liberté de croire ou non, qu'il veut enseignée à l'école. Il se situe dans une gauche de progrès, attachée à l'égalité femmes-hommes et à la lutte contre les discriminations. Il refuse l'instrumentalisation identitaire de la laïcité.","education":"Il fait de l'éducation, des universités et de la recherche le cœur de son projet 2027. Son quinquennat a créé 60 000 postes, refondé l'école et réformé les rythmes scolaires et le collège. Il défend la priorité au primaire et la réduction des inégalités scolaires précoces. Il veut réinvestir dans l'enseignement supérieur et la recherche."},"scores":{"eco":5,"social":5,"immigration":5,"securite":4,"env":5,"europe":8,"institutions":4,"societal":7,"education":6},"bloc":"gauche"},
    {"name":"François Ruffin","party":"Debout ! (gauche populaire, ex-LFI)","status":"déclaré","color":"#E63946","oneLiner":"Député de la Somme, chef de Debout ! : candidat « primaire ou pas », campagne « proche des gens » (auto-stop) ; à Blois (29/08) il dénonce la primaire PS/PP, « suffrage censitaire » et « démarche presque antidémocratique », et plaide une primaire large gauche-écologistes ; 2-3 %.","program":{"eco":"Ruffin porte une gauche populaire et patriote (mouvement Debout!) axée sur les classes populaires et le made in France. Il réclame une forte taxation des grandes fortunes et s'oppose aux licenciements-dividendes dans les entreprises profitables. Il propose une hausse du SMIC autour de 1 700 euros net et le retour de la retraite à 60 ans avec une pension minimale de 1 200 euros. Il défend le protectionnisme, la réindustrialisation et le soutien aux petits producteurs et agriculteurs.","social":"Il défend un renforcement massif des services publics, avec une hausse d'environ 20% du budget de la santé et des recrutements d'infirmières et d'enseignants. Il propose le remboursement à 100% des soins et s'oppose à la gestion privée des services publics. Il porte des mesures de vie quotidienne comme la cantine et les transports gratuits en zones rurales, et défend les travailleurs invisibles (livreurs, intérimaires).","immigration":"Ruffin adopte une approche humaniste qui se distingue d'une partie de la gauche : il rejette l'idée d'une immigration choisie destinée à combler les manques de main-d'œuvre. Il s'oppose à la fin du droit du sol, défend le regroupement familial et l'accès à l'asile. Il se dit favorable à une fermeté ciblée sur les auteurs de délits graves.","securite":"Il défend une justice pénale progressiste, avec des peines alternatives pour les délits non violents et une opposition aux peines planchers. Il réclame un contrôle indépendant des violences policières via une autorité détachée du ministère de l'Intérieur. Il reconnaît en même temps les attentes de sécurité des habitants des quartiers populaires.","env":"Ruffin vote contre l'accélération du nucléaire et s'oppose à de nouveaux réacteurs, privilégiant les renouvelables. Il propose une rénovation énergétique gratuite pour environ 8 millions de logements mal isolés, financée par une taxe sur les fossiles. Il préfère la logique de quotas carbone à la taxe carbone, qu'il juge injuste. Il défend une transition qui protège les classes populaires.","europe":"Il défend une ligne d'indépendance d'inspiration gaulliste : renégociation profonde des traités européens sans sortie de l'UE. Il s'oppose à une réintégration accrue dans l'OTAN et défend l'autonomie militaire européenne vis-à-vis des États-Unis. Sur l'Ukraine, il soutient une aide tout en cherchant une issue diplomatique. Il met en avant la souveraineté industrielle et le patriotisme économique.","institutions":"Ruffin réclame une VIe République avec un renforcement des pouvoirs du Parlement face à l'exécutif. Il propose la suppression de l'article 49.3, la proportionnelle et le référendum d'initiative citoyenne (RIC). Il inscrit ces réformes dans une critique de la concentration présidentielle du pouvoir.","societal":"Il soutient l'inscription de l'IVG dans la Constitution et l'accès élargi à l'avortement, l'aide à mourir encadrée et la protection du bien-être animal. Il défend une laïcité d'apaisement plutôt que de stigmatisation et met en avant l'unité populaire par-delà les origines. Il exprime davantage de prudence sur certaines questions liées au genre.","education":"Ruffin propose l'abolition de Parcoursup et de son modèle d'accès sélectif à l'université. Il défend la mixité sociale et s'oppose aux dispositifs qui affaiblissent la carte scolaire. Il soutient l'éducation à la sexualité et le recrutement d'enseignants pour l'école publique."},"scores":{"eco":9,"social":9,"immigration":6,"securite":6,"env":8,"europe":4,"institutions":8,"societal":7,"education":8},"bloc":"gauche","declared":"2026-01"},
    {"name":"Clémentine Autain","party":"L'Après (ex-LFI)","status":"retiré","color":"#C2185B","oneLiner":"Députée écosocialiste (L'Après) : a RETIRÉ sa candidature le 11 juillet 2026 après l'enterrement de la primaire unitaire, dénonçant « l'empilement des candidatures » à gauche.","program":{"eco":"Autain (mouvement L'Après) propose un impôt plancher sur la fortune de 2% sur les patrimoines supérieurs à 100 millions d'euros (15 à 25 milliards attendus par an). Elle défend une hausse du SMIC, un écart salarial maximal de 1 à 20 et le retour de la retraite à 60 ans par répartition. Elle s'oppose aux baisses de cotisations patronales et a voté pour la nationalisation d'ArcelorMittal. Elle prône un État stratège pilotant l'économie au service des besoins réels.","social":"Elle propose le remboursement à 100% des frais de santé et la création de centres de santé publics avec médecins salariés contre les déserts médicaux. Elle augmente fortement les minima sociaux, porte l'AAH au niveau du SMIC et supprime l'obligation d'activité de 15 heures conditionnant le RSA. Elle maintient l'Aide médicale d'État et défend un accès garanti à l'alimentation, au logement, à la santé et à la culture.","immigration":"Autain s'oppose totalement à la réduction de l'immigration légale et défend une politique d'accueil généreuse. Elle veut accueillir davantage de demandeurs d'asile et les autoriser à travailler pendant l'examen du dossier, et a voté contre la loi immigration de 2023. Elle défend le droit du sol, s'oppose aux expulsions systématiques et soutient le droit de vote des étrangers aux élections locales.","securite":"Elle privilégie les peines alternatives pour les délits non violents et s'oppose aux peines planchers et au jugement des mineurs de 16 ans comme des majeurs. Elle réclame une autorité indépendante pour enquêter sur les violences policières. Elle est opposée à la création de nouvelles places de prison, préférant combattre la surpopulation carcérale.","env":"Autain fait de la transformation écologique une priorité, avec un objectif de 100% d'électricité renouvelable d'ici 2050, et est plutôt opposée au nucléaire (vote contre l'EPR2). Elle met fin aux subventions aux fossiles, taxe les superprofits pétro-gaziers, interdit progressivement les pesticides et l'élevage intensif, et vise l'interdiction des véhicules thermiques neufs en 2035. Elle défend la relocalisation comme impératif écologique et social.","europe":"Elle est opposée à la sortie de l'UE mais prône la désobéissance aux traités restrictifs pour transformer l'Europe de l'intérieur. Elle est favorable à la sortie de l'OTAN et opposée à un budget de défense à 3% du PIB. Sur l'Ukraine, elle reconnaît le caractère essentiel de l'aide militaire face à l'agression russe tout en privilégiant une approche diplomatique et multilatérale.","institutions":"Autain propose une VIe République avec une assemblée constituante et la suppression de l'article 49.3. Elle renforce les pouvoirs du Parlement, instaure le RIC et la proportionnelle intégrale. Elle abaisse le droit de vote à 16 ans et l'étend aux étrangers résidant régulièrement pour les élections locales.","societal":"Elle porte un féminisme affirmé : congé menstruel remboursé, élargissement et allongement de l'accès à l'IVG. Elle est favorable à la PMA élargie mais opposée à la GPA. Sur la laïcité, elle s'oppose à l'interdiction des signes religieux pour les usagers des services publics et dénonce la police du vêtement. Elle soutient l'interdiction de la corrida et l'éducation à la sexualité obligatoire.","education":"Elle est favorable à la suppression de Parcoursup, qu'elle qualifie de sélection industrielle. Elle s'oppose à la suppression de la carte scolaire au nom de la mixité sociale et défend un investissement massif dans l'école publique avec des embauches. Elle est opposée à l'uniforme obligatoire."},"scores":{"eco":9,"social":9,"immigration":8,"securite":8,"env":9,"europe":5,"institutions":9,"societal":10,"education":9},"bloc":"gauche"},
    {"name":"Karim Bouamrane","party":"PS · La France humaine et forte","status":"déclaré","color":"#EC407A","oneLiner":"Maire de Saint-Ouen, gauche républicaine, sociale et ferme sur l’autorité : candidat déclaré le 9 juin 2026, refuse la primaire PS/PP « fermée » (26/08) et veut une rupture « claire, nette, précise » avec LFI ; non testé par les instituts.","program":{"eco":"Bouamrane défend une ligne social-démocrate pragmatique, réputée proche de Hollande et Valls, réconciliant justice sociale et attractivité économique. Il place la valorisation du travail au centre (« travailler doit payer »), en visant ouvriers, artisans, soignants, livreurs. Il prône une réindustrialisation verte, la souveraineté (industrielle, numérique, énergétique, alimentaire) et l'investissement dans l'IA, avec une gestion rigoureuse des finances publiques. Sur le SMIC à 1 600 euros, il se montre pragmatique face à une majorité relative.","social":"Il fait de l'accès digne au logement une priorité (construction, rénovation, accompagnement). Il veut lutter contre les déserts médicaux et garantir des soins de qualité quel que soit le revenu, tout en préparant le système au vieillissement. Il défend la protection des personnes âgées, en situation de handicap et LGBT+. Sa vision associe émancipation par le travail et protection sociale forte.","immigration":"Il défend une politique migratoire « digne et ferme » : accueillir dignement ceux qui ont le droit de rester, agir à la source par le développement, et reconduire les personnes en situation irrégulière. Il valorise les binationaux comme un atout et refuse la stigmatisation. Il s'était opposé au projet de déchéance de nationalité de 2015. Sa ligne conjugue fermeté sur le droit et refus des instrumentalisations identitaires.","securite":"La sécurité est sa marque de fabrique : maire de Saint-Ouen, il a multiplié par dix la police municipale, inauguré un commissariat en 2023 et instauré en 2025 un couvre-feu à 22h pour les mineurs non accompagnés. Il fait du combat contre le narcotrafic une priorité et affirme l'autorité républicaine partout. Il renforce la protection des femmes victimes de violences. Il soutient que la sécurité est la condition de la justice sociale.","env":"Il prône une transition écologique « juste » qui ne pèse pas sur les classes populaires, misant sur la rénovation thermique des logements modestes et des emplois durables. Il rejette une écologie punitive. Il défend les agriculteurs contre des règles jugées inéquitables et la souveraineté alimentaire. Il lie transition écologique et réindustrialisation verte.","europe":"Il défend une Europe concrète « qui protège », gardienne de ses frontières face aux crises, en refusant la technocratie. Il soutient le renforcement de la défense pour une dissuasion crédible. Il inscrit la souveraineté (industrielle, numérique, énergétique) dans un cadre européen. Sa vision est celle d'une Europe puissance protectrice.","institutions":"Il place sa confiance dans les maires, les acteurs économiques et le tissu associatif comme piliers de la démocratie de terrain. Il insiste sur le respect mutuel et l'ancrage local. Il se positionne en rassembleur d'une gauche non-mélenchoniste, alternative à LFI comme au RN. Il valorise l'efficacité et la proximité plutôt qu'une refondation institutionnelle.","societal":"Il défend une laïcité « fraternelle », ferme sur les principes mais refusant leur instrumentalisation, protectrice de la liberté de tous. Il combat le racisme, l'antisémitisme, l'islamophobie et les discriminations, et protège les minorités. Il fait de la protection des enfants une priorité (violences sexuelles, inceste). Ses valeurs cardinales : républicanisme, universalisme et émancipation par le travail.","education":"Il fait de l'éducation le « levier central d'égalité des chances » et défend une « démocratisation de l'excellence » ouverte à tous. Il veut des formations adaptées aux transformations du siècle, préparant à un emploi choisi. Il défend l'accès à la culture et à des espaces publics de qualité. Sa vision associe méritocratie républicaine et lutte contre le déterminisme social."},"scores":{"eco":6,"social":7,"immigration":5,"securite":4,"env":6,"europe":7,"institutions":4,"societal":6,"education":7},"bloc":"gauche","declared":"2026-06-09"},
    {"name":"Jérôme Guedj","party":"Parti socialiste (PS)","status":"primaire","color":"#F48FB1","oneLiner":"Député de l’Essonne, spécialiste des questions sociales : après avoir voulu concourir hors primaire, il rejoint la primaire PS / Place publique le 23 août 2026 pour porter une « gauche républicaine, universaliste, laïque » et un « patriotisme économique ».","program":{"eco":"Guedj (PS) défend une gauche républicaine de gouvernement attachée à la justice fiscale. Il veut mettre davantage à contribution les grandes entreprises, les grandes fortunes et les revenus du capital, et s'oppose à la concentration des richesses. Il propose un plan d'investissement vert pour relancer l'emploi et la réindustrialisation, dans une logique de redistribution assumée mais compatible avec une gestion responsable des finances publiques.","social":"Il fait du grand âge son engagement majeur, défendant un droit à vieillir dans la dignité et la lutte contre l'isolement des personnes âgées. Il réclame le renforcement des services publics, notamment l'école, l'hôpital, la santé et la recherche. Il estime que la liberté réelle dépend de l'accès au logement, aux soins, à un travail digne et à la Sécurité sociale.","immigration":"Guedj défend une ligne de gauche républicaine et universaliste, attachée à la lutte contre le racisme et l'antisémitisme. Il ne met pas l'immigration au premier plan mais s'inscrit dans une tradition socialiste d'accueil articulée à l'intégration républicaine. Il se démarque de la ligne de LFI sur les questions identitaires.","securite":"Il défend une approche de gauche de gouvernement conciliant fermeté républicaine et respect de l'État de droit et des libertés. Il inscrit la sécurité dans la défense des principes républicains plutôt que dans la surenchère, revendiquant une posture de responsabilité.","env":"Guedj défend une transition écologique populaire qui protège les classes populaires et moyennes sans leur faire supporter seules les coûts de l'adaptation. Il propose un plan d'investissement vert conciliant emploi et réduction des dépendances stratégiques. Il rattache l'écologie à la justice sociale plutôt qu'à une écologie punitive.","europe":"Il défend une Europe souveraine, démocratique, sociale et écologique, capable de protéger son modèle social. Il s'inscrit dans une tradition socialiste pro-européenne, favorable à l'approfondissement de l'intégration et à une autonomie européenne face aux menaces extérieures.","institutions":"Guedj revendique une approche de gouvernement et le courage de la nuance, refusant la logique protestataire. Il combat frontalement le Rassemblement national et défend les institutions et l'État de droit républicain. Il se positionne comme une alternative de responsabilité au sein de la gauche.","societal":"Il fait de la laïcité un axe central, présentée comme un principe d'émancipation, de liberté de conscience et d'unité civique, et s'oppose au communautarisme. Il est un défenseur affirmé de la lutte contre l'antisémitisme et critique la ligne de LFI sur ces sujets. Il défend l'universalisme républicain contre les approches identitaires.","education":"Il place l'école parmi les services publics prioritaires à préserver et renforcer, aux côtés de la santé et de la recherche. Il défend l'école républicaine comme instrument d'émancipation et d'égalité, dans sa vision d'une République laïque et sociale."},"declared":"2026-08-23","scores":{"eco":7,"social":8,"immigration":7,"securite":6,"env":7,"europe":7,"institutions":6,"societal":8,"education":8},"bloc":"gauche"},
    {"name":"Marine Tondelier","party":"Les Écologistes (ex-EELV)","status":"déclaré","color":"#22A868","oneLiner":"Secrétaire nationale des Écologistes, candidate déclarée (~3-4 %) : propose des « rencontres bilatérales » au PS, au PCF et à LFI pour éviter « une élimination dès le premier tour », appelle Mélenchon « à l’humilité » ; au débat du Medef : SMIC à 2 000 € brut, « l’écologie est la condition de la liberté » (huée par les patrons). Primaire unitaire du 11/10 quasi enterrée.","program":{"eco":"Tondelier propose un « ISF climatique » modulant les taux selon l'empreinte carbone des patrimoines, avec une taxation accrue au-delà de 10 millions d'euros. Elle veut une taxation exceptionnelle des superprofits des grands pollueurs (TotalEnergies, Engie) pour financer la transition, avec environ 140 milliards d'investissements annuels. Elle défend un revenu minimum garanti (autour de 1 000 euros) financé par une réforme fiscale progressive. Le tout s'inscrit dans une loi de programmation climat aux objectifs contraignants.","social":"Elle veut recruter environ 50 000 soignants, revaloriser leurs salaires et rouvrir des lits. Elle promeut une « sécurité sociale écologique et alimentaire » et la « prescription sociale » contre l'isolement. Elle propose un plan santé mentale avec des psychologues dans les écoles et au travail, et un « congé climatique » de cinq jours par an face aux canicules. Elle prévoit 500 nouvelles maisons France Services.","immigration":"Elle conteste tout lien direct entre immigration et délinquance, pointant les conditions économiques et sociales. Elle défend la régularisation des travailleurs sans-papiers dans les secteurs en tension et des voies légales et sûres pour les réfugiés. Elle veut renforcer la lutte contre les discriminations. Sa ligne s'oppose frontalement au durcissement porté par la droite et l'extrême droite.","securite":"Sa conception privilégie la prévention et le social plutôt que la répression, refusant l'amalgame immigration-insécurité. Elle met l'accent sur la « sécurité environnementale », le crime d'écocide et une police de proximité. Elle plaide pour plus de formation des policiers (notamment sur les discriminations) et le traitement des causes sociales. Elle demande qu'on cesse de traiter les militants écologistes comme des délinquants.","env":"L'écologie est son premier axe, structurée par une loi de programmation aux objectifs contraignants de baisse des émissions. Elle vise la neutralité carbone (horizon 2040) via la rénovation thermique, l'essor des renouvelables et une sortie progressive du nucléaire au fil du déploiement des renouvelables. Elle veut interdire les pesticides de synthèse d'ici 2030 et le bio dans les cantines. Elle défend des alternatives à la voiture pour les zones mal desservies.","europe":"Elle veut transformer l'UE en une « Union écologique et sociale », réorientant ses règles budgétaires vers la transition. Elle propose un veto sur les traités de libre-échange nuisibles au climat (contre CETA et Mercosur). Elle défend une solidarité internationale renforcée (fonds d'environ 10 milliards par an pour l'adaptation des pays du Sud). Sa vision reste pro-intégration mais conditionnée à des exigences sociales et environnementales.","institutions":"Elle propose une VIe République plus parlementaire, avec une Assemblée élue à la proportionnelle intégrale. Elle défend le référendum d'initiative citoyenne (RIC) pour proposer ou abroger des lois. Elle veut renforcer le contrôle des élus et lutter contre les lobbies. L'objectif est une démocratie plus participative et déconcentrée.","societal":"Elle défend fermement les droits LGBTQIA+ et l'égalité réelle femmes-hommes, avec des sanctions contre les entreprises ne respectant pas l'égalité salariale (parité visée d'ici 2032). Elle soutient l'éducation à la vie affective et sexuelle dès la maternelle. Sur la laïcité, elle défend une lecture stricte et libérale de la loi de 1905 (neutralité de l'État, liberté individuelle). Elle inscrit ces combats dans la lutte contre les discriminations.","education":"Elle veut revaloriser fortement les salaires enseignants (environ +20%) et réduire les effectifs par classe (autour de 20 élèves). Elle propose un enseignement obligatoire sur le climat et la biodiversité dès le primaire. Elle défend une allocation d'autonomie et la gratuité des transports pour les 18-25 ans. Elle promeut l'accès élargi à la culture."},"scores":{"eco":8,"social":8,"immigration":8,"securite":7,"env":10,"europe":8,"institutions":8,"societal":9,"education":8},"bloc":"gauche","declared":"2025-10"},
    {"name":"Delphine Batho","party":"Génération Écologie","status":"déclaré","color":"#7CB342","oneLiner":"Ancienne ministre, présidente de Génération Écologie : candidate déclarée le 25 novembre 2025, écologie de la sobriété ; refuse toute candidature commune (« indépendante des formations qui ont échoué »).","program":{"eco":"Batho place la « décroissance » au cœur de son projet, rompant avec la poursuite de la croissance du PIB jugée incapable de réduire les inégalités. Elle défend une économie organisée autour des besoins essentiels, du bien-être et de la santé plutôt que de la consommation illimitée, et récuse le productivisme comme le greenwashing. Elle promeut une « décroissance énergétique » par la sobriété. Elle articule décroissance et protection sociale pour réduire les inégalités.","social":"Sa priorité sociale passe par la santé environnementale : lutte contre les pesticides, transparence sur les risques sanitaires, alimentation saine et respectueuse du vivant. Elle soutient la souveraineté alimentaire et une agriculture sans chimie de synthèse, créatrice d'emplois. Elle lie protection sociale et modèle de décroissance, redéfinissant le bien-être hors du seul pouvoir d'achat. Sa « politique de la beauté » inclut des jardins partagés dans les quartiers populaires.","immigration":"Députée écologiste, elle a voté contre la loi immigration de 2023, jugée trop restrictive. Elle a refusé d'associer sa voix à une motion de rejet instrumentalisée par la droite et l'extrême droite. Sa ligne est humaniste et opposée à la surenchère sécuritaire. Elle inscrit l'accueil dans une approche de droits humains liée à sa « république terrestre ».","securite":"Ancienne ministre déléguée à la Justice (2012) et secrétaire nationale du PS chargée de la sécurité, elle revendique une expérience régalienne pour « une écologie capable de gouverner ». Elle défend une sécurité compatible avec les limites planétaires et la souveraineté écologique. Elle articule sécurité et réduction des dépendances stratégiques. Son approche reste républicaine et attachée à l'État de droit.","env":"Elle prône la sortie des fossiles, la protection de la biodiversité et la réduction de la consommation par la sobriété. Sur le nucléaire, elle défend une sortie progressive « pragmatique », sans fermeture brutale, mais s'oppose radicalement aux nouveaux réacteurs, qualifiant de « folie » le programme de six EPR qu'elle veut stopper. Elle combat l'agriculture industrielle chimique. Elle vise une « souveraineté écologique » réduisant les importations destructrices.","europe":"Elle promeut une « souveraineté écologique » française et européenne : réduire la dépendance aux ressources, aux fossiles et aux importations destructrices. Elle veut une Europe capable de protéger la nature et de réduire ses dépendances stratégiques. Elle s'oppose aux reculs environnementaux européens (pesticides). Sa vision lie construction européenne et préservation du vivant.","institutions":"Elle veut construire une « République écologique » (ou « république terrestre ») fondée sur la souveraineté populaire et la lutte contre les lobbies. Elle érige l'habitabilité de la Terre en principe fondamental. Elle s'oppose au 49.3 et à la dérive présidentialiste. Elle plaide pour redonner du pouvoir aux citoyens face aux intérêts industriels.","societal":"Son positionnement est écoféministe, républicain et laïque, opposé aux obscurantismes et aux dominations. Elle développe une « politique de la beauté » valorisant le paysage, l'esthétique urbaine et la qualité de vie comme méthode politique. Elle propose des jardins partagés, des projets artistiques et des événements culturels gratuits. Elle critique la surconsommation et le productivisme.","education":"Elle défend l'accessibilité de la culture pour tous, notamment par la gratuité d'événements culturels, pour associer plus de citoyens au débat écologique. Sa « politique de la beauté » fait de l'art et du cadre de vie des leviers d'éducation. Elle veut sensibiliser largement aux enjeux écologiques en reliant culture, territoire et vie quotidienne. Son approche privilégie l'émancipation culturelle."},"scores":{"eco":7,"social":7,"immigration":6,"securite":6,"env":10,"europe":6,"institutions":8,"societal":7,"education":7},"bloc":"gauche","declared":"2025-11-25"},
    {"name":"Gabriel Attal","party":"Renaissance","status":"déclaré","color":"#FFB020","oneLiner":"Ancien Premier ministre, patron de Renaissance, déclaré le 22 mai 2026 : conteste désormais le statut de favori de Philippe (« il n’y a plus de favori », 25/08) tout en promettant le rassemblement début 2027 derrière le mieux placé ; 8 % face à Philippe, 14-15 % seul. Programme école (+200 €/mois, certificat d’études), retraites sans âge légal + capitalisation, référendum réseaux sociaux <15 ans ; très applaudi au débat du Medef.","program":{"eco":"Il propose de supprimer l'âge légal de départ à la retraite au profit de la seule durée de cotisation, avec décotes et surcotes, tout en défendant la réforme de 2023 qu'il a appliquée. Côté dépenses : plan de départs volontaires visant 100 000 postes de fonctionnaires (7 milliards d'économies) en épargnant école, armées, justice et intérieur, « année blanche » des prestations en 2028, et baisse ciblée de 2 milliards d'impôts pour les classes moyennes plutôt qu'une grande réforme fiscale. Il veut baisser les impôts de production et faire de l'intelligence artificielle un des quatre chantiers prioritaires.","social":"Sur les retraites, il propose un système universel où « un euro cotisé ouvre les mêmes droits ». En santé, il avance une complémentaire publique à un euro par jour pour les retraités et revenus modestes. Il maintient le conditionnement du RSA à 15h d'activité au nom de la lutte contre les « trappes à inactivité ». Il défend des franchises pour les rendez-vous médicaux non honorés.","immigration":"Il privilégie l'immigration de travail avec des quotas par secteur votés chaque année, veut restreindre le regroupement familial et durcir les conditions d'accès au séjour, tout en défendant le droit du sol. Il revendique la fermeté des « frontières » comme l'un de ses quatre chantiers (avec l'école, les salaires et l'IA) et la loi immigration de 2024 qu'il a portée comme Premier ministre.","securite":"Il veut abaisser à 16 ans la comparution immédiate et instaurer une composition pénale dès 13 ans, avec des « travaux d'intérêt éducatif » pour les moins de 16 ans. Il propose des sanctions scolaires renforcées (internats, notation sur Parcoursup) et une responsabilisation des parents (amendes, TIG). Sur les écrans, il veut faire respecter l'âge légal de 15 ans pour les réseaux sociaux. Il cible le séparatisme islamiste.","env":"Il défend une « nouvelle donne économique et climatique » (compétitivité, réindustrialisation, décarbonation) et revendique la baisse des émissions sous ses gouvernements. Il fait du nucléaire un pilier (trois quarts de l'énergie via nucléaire et renouvelables) et dénonce toute sortie du nucléaire. Il veut substituer un « principe de progrès » au principe de précaution. Il critique le climato-scepticisme.","europe":"Il porte une Europe de la compétitivité, de l'IA et de la réindustrialisation, avec une ambition en défense. Il défend un soutien ferme et continu à l'Ukraine face à la Russie. Il attaque le RN sur ses positions jugées pro-russes (votes au Parlement européen). Il inscrit la souveraineté européenne (technologie, défense, énergie) au cœur de son projet.","institutions":"Il propose de réduire le nombre de parlementaires. Il défend l'instauration du vote obligatoire, envisagé dès 16 ans. Il veut remplacer le principe de précaution par un principe de progrès. Son projet institutionnel reste centré sur l'efficacité et la simplification.","societal":"Il s'est prononcé pour la légalisation de la GPA, position minoritaire dans son camp. Il soutient l'interdiction de la chasse à courre et de la mise à mort dans les corridas. Sur la laïcité, il a proposé d'interdire le voile aux mineures dans l'espace public (« une petite fille ne choisit pas »), tout en refusant la stigmatisation religieuse. Il porte un plan de formation à l'IA visant 20 millions de salariés.","education":"L'école est son chantier prioritaire : loi de programmation pluriannuelle pilotée par un ministre « qui restera cinq ans », retour d'un certificat d'études en fin de primaire, groupes de niveau et pédagogie différenciée, revalorisation régulière du point d'indice des enseignants au-dessus de l'inflation, investissements massifs dans l'éducation prioritaire, uniforme expérimenté et interdiction du portable au collège."},"scores":{"eco":3,"social":4,"immigration":3,"securite":3,"env":5,"europe":8,"institutions":4,"societal":6,"education":4},"bloc":"centre","declared":"2026-05-22"},
    {"name":"Édouard Philippe","party":"Horizons","status":"déclaré","color":"#00A0A0","oneLiner":"Ancien Premier ministre, maire du Havre, candidat depuis septembre 2024 : mieux placé du bloc central (14-21 % selon qu'Attal est ou non candidat), rallié par Darmanin (rentrée commune à Tourcoing le 30/08). Ligne droite : « travailler plus » (âge indexé sur l'espérance de vie, capitalisation), chômage limité à 12 mois, -50 Md€ d'impôts de production, asile suspendu à Mayotte ; face à Hollande à Sens (29/08) : « jamais LFI, jamais RN ».","program":{"eco":"Philippe fait de la dette sa priorité : déficit sous 3 % du PIB d'ici 2030, « règle d'or » budgétaire inscrite dans la Constitution par référendum, baisse des impôts de production et de l'impôt sur les sociétés, suppression de niches fiscales, impôt sur le revenu simplifié pour les classes moyennes. Sur les retraites, la « pierre angulaire » : introduire environ 15 % de capitalisation collective (modèle Agirc-Arrco) à côté de la répartition, et « travailler un peu plus longtemps » au-delà de 64 ans, avec harmonisation des régimes spéciaux. Non-remplacement d'une partie des fonctionnaires partant en retraite et fusion d'agences.","social":"Sa mesure phare : une part de capitalisation collective (modèle Agirc-Arrco) en complément de la répartition, soumise à référendum, pour équilibrer les retraites. Il défend le fait de travailler plus longtemps (âge relevé, indexation sur les prix, réforme des régimes spéciaux). Sur la dépendance, il évoque une cinquième branche de la Sécu pour le grand âge et le recrutement de soignants. Il privilégie l'expérimentation locale.","immigration":"Il défend une politique « ferme et juste » : quotas d'immigration annuels votés par le Parlement par catégorie, capacité d'expulsion renforcée pour les sans-papiers et les délinquants étrangers, liste annuelle de « pays sûrs » pour accélérer le traitement de l'asile, immigration de travail choisie. Il maintient le droit du sol, ce qui le distingue nettement du RN.","securite":"Il propose le recrutement d'environ 15 000 policiers et gendarmes et la création de 10 000 places de prison. Il met l'accent sur l'efficacité et la « débureaucratisation » de la justice plutôt que sur la seule incarcération de masse. Il couple sécurité et immigration stricte (expulsion des délinquants étrangers). Il envisage des ordonnances pour réformer rapidement la justice.","env":"Il défend une écologie « non punitive » adossée à un plan d'environ 80 milliards sur cinq ans (rénovation thermique, renouvelables). Il fait de la relance du nucléaire un pilier de la souveraineté énergétique (6 à 8 nouveaux EPR). Il inscrit l'énergie parmi les piliers de sa « souveraineté intégrale » européenne. Son approche privilégie l'investissement plutôt que la contrainte réglementaire.","europe":"Il prône une « souveraineté intégrale » européenne autour de quatre piliers : technologie, défense, énergie, finance. Il propose de porter le budget militaire à 3% du PIB et de renforcer l'autonomie stratégique. Il défend une « préférence européenne » dans la commande publique. Il fait du soutien à l'Ukraine et de son adhésion à l'UE un marqueur central (déplacement à Kyiv).","institutions":"Il promet une méthode de rupture : dissoudre l'Assemblée dès son élection pour obtenir une majorité, puis trois référendums (dose de capitalisation retraite, règle d'or budgétaire, autorisation de réformer par ordonnances la santé, l'école et la justice). Il défend un exécutif fort dans le cadre de la Ve République, refuse la proportionnelle intégrale et veut réduire le nombre de parlementaires.","societal":"Il défend une laïcité d'exigence : neutralité absolue de la puissance publique, couplée à la liberté de conscience et de pratique. Il se pose en réformateur « sérieux » rejetant le « moralisme de gauche » et l'« identitarisme de droite ». Il aborde ces questions via des lieux symboliques dans son livre « Des lieux qui disent ». Sa ligne sociétale est pragmatique et modérée.","education":"Il qualifie l'école de chantier « le plus important et le plus urgent » et centre son projet sur les fondamentaux (lire, écrire, compter), assumant d'être « directif » sur le français. Il défend une forte autonomie des établissements tout en préservant le caractère national. Il propose une cinquantaine de lycées d'excellence et vise un million d'apprentis d'ici 2030. Il pose la question des rythmes scolaires et de la formation des enseignants."},"scores":{"eco":2,"social":3,"immigration":3,"securite":2,"env":4,"europe":8,"institutions":4,"societal":5,"education":3},"bloc":"centre","declared":"2024-09-03"},
    {"name":"Bruno Retailleau","party":"Les Républicains (LR)","status":"déclaré","color":"#0066CC","oneLiner":"Président de LR, investi le 19 avril 2026 (74 %) ; rentrée « bouchées doubles » à la Foire de Châlons (28/08) pour « perturber » Philippe (6-12 %). Rupture assumée avec le macronisme (« marre du en même temps ») : -250/300 000 fonctionnaires, zéro cotisation dès la 36e heure, baisse des droits de succession, AME supprimée, prestations sous 5 ans de présence, retraite indexée sur l’espérance de vie ; « n’a peur d’aucune » primaire.","program":{"eco":"Il veut « renverser la table » : 100 à 120 milliards d'euros d'économies sur les dépenses publiques sans hausse d'impôts, suppression de 250 000 à 300 000 postes de fonctionnaires grâce au numérique et à l'IA, révision du temps de travail des agents, baisse de 10 % de l'aide au développement. Sur les retraites, il défend le passage à 65 ans et le maintien de la réforme de 2023 contre sa suspension. Il propose de supprimer massivement les normes pesant sur les entreprises et de conditionner le RSA à une activité.","social":"Recentrage du modèle social et lutte contre l'assistanat, avec conditionnalité accrue des aides et lutte contre la fraude sociale. Il soutient un système de retraite par répartition avec allongement de la durée de cotisation. Il veut lutter contre les déserts médicaux et revaloriser l'hôpital et les soignants. La priorité est donnée au retour à l'emploi plutôt qu'aux prestations.","immigration":"Cœur de son projet : un référendum pour réduire « drastiquement » l'immigration et faire primer le droit national sur les normes européennes en matière migratoire, rétablissement de la double peine, fin du regroupement familial élargi, réforme du droit du sol (demande explicite, parents en situation régulière), délai de résidence pour les prestations sociales, expulsions systématiques des étrangers sous OQTF et des délinquants. Il refuse toute alliance avec le RN mais assume une concurrence frontale sur ce thème.","securite":"Ministre de l'Intérieur, il promet 10 000 places de prison supplémentaires, des prisons de haute sécurité pour les narcotrafiquants (loi de 2025), plus de policiers et gendarmes, des peines planchers, la fin de l'excuse de minorité pour les crimes graves et une justice « qui applique les peines ». Il veut un référendum sur la justice pour contourner les blocages et défend l'ordre dans les quartiers gangrenés par le trafic.","env":"Il défend une écologie de droite, pronucléaire, avec la relance du nucléaire et de nouveaux réacteurs (EPR). Il souhaite stopper le financement public de l'éolien et du solaire, qu'il juge intermittents et coûteux. Il critique l'écologie punitive et le wokisme dans le domaine environnemental. Il défend les agriculteurs et le monde rural face aux contraintes normatives.","europe":"Il défend une Europe des nations et la réaffirmation de la souveraineté française, refusant une UE fédérale et de nouvelles normes contraignantes. Il veut reprendre le contrôle des frontières et réviser les règles migratoires européennes et Schengen. Il exprime des réserves sur les accords de libre-échange comme le Mercosur. Il plaide pour une primauté renforcée du droit national.","institutions":"Il prône la restauration de l'autorité de l'État et de la fonction présidentielle. Il veut recourir davantage au référendum, notamment sur l'immigration, via une révision constitutionnelle. Il propose de réduire le nombre de parlementaires et de rationaliser le millefeuille administratif. Il veut réduire fortement le nombre d'agences et d'opérateurs de l'État.","societal":"Il défend l'ordre, la laïcité et les valeurs de civilisation françaises, avec une fermeté face à l'islamisme et au communautarisme. Il s'oppose à l'écriture inclusive et au wokisme dans les institutions. Il affirme un attachement à la famille, à la ruralité et à l'héritage chrétien de la France. Il inscrit son projet dans une réaffirmation du clivage droite-gauche.","education":"Il veut restaurer l'autorité et le niveau à l'école, avec un retour aux savoirs fondamentaux, à la discipline et à une tenue commune. Il entend lutter contre l'entrisme islamiste et le wokisme à l'école et à l'université. Il défend la revalorisation de l'enseignement professionnel. Il met le mérite au centre de sa vision éducative."},"scores":{"eco":2,"social":3,"immigration":1,"securite":1,"env":3,"europe":4,"institutions":2,"societal":1,"education":2},"bloc":"droite","declared":"2026-04-19"},
    {"name":"Xavier Bertrand","party":"Nous France (indépendant, ex-LR)","status":"conditionnel","color":"#1565C0","oneLiner":"Président des Hauts-de-France, mouvement Nous France : « Je le serai » (candidat), lancé le 27 août 2026 à la REF du Medef — puis « avant l’heure ce n’est pas l’heure » : officialisation fin 2026, en indépendant hors LR, refus de toute primaire et d’un duo avec Philippe. Droite gaulliste-sociale, capitalisation, mandat présidentiel unique (~3 %).","program":{"eco":"Il défend une droite sociale et gaulliste, avec un recentrage de l'État sur ses missions essentielles. Il veut réduire la dépense publique et la dette tout en soutenant les entreprises et l'industrie. Il porte une « République des territoires » décentralisée face à un pouvoir jugé trop parisien. Il met l'accent sur le travail, le pouvoir d'achat et la réindustrialisation des régions.","social":"Il est attaché à un modèle social protecteur mais responsabilisé. Il fait de la lutte contre les déserts médicaux et de l'accès aux soins dans les territoires une priorité, avec un soutien à l'hôpital. Il défend les retraites par répartition. Il veut conditionner les aides et lutter contre la fraude.","immigration":"Il porte une ligne ferme de maîtrise de l'immigration, recentrée sur les besoins du pays. Il veut expulser les étrangers délinquants et appliquer effectivement les obligations de quitter le territoire. Il défend le renforcement des frontières. Il lie sa fermeté à la lutte contre le terrorisme et l'islamisme.","securite":"Il fait de la sécurité une priorité régalienne. Il veut renforcer les effectifs de police et de justice, avec une grande fermeté pénale et un soutien aux forces de l'ordre et aux maires. Il cible la délinquance du quotidien et le narcotrafic. Il défend l'autorité de l'État partout sur le territoire.","env":"Il défend une écologie pragmatique et pronucléaire, s'appuyant sur le nucléaire pour la transition. Il porte une écologie des territoires accompagnant les industries et l'agriculture. Il refuse une écologie punitive. Il met en avant les solutions concrètes plutôt que les interdictions.","europe":"Position atypique à droite, il se dit favorable à un fédéralisme européen renforcé, à une défense commune et à une souveraineté stratégique de l'UE. Il veut une Europe plus intégrée sur le régalien et l'industrie. Il défend la fermeté sur les frontières extérieures. Il combine ambition européenne et défense des intérêts nationaux.","institutions":"Il porte une « République des territoires » et une forte décentralisation face à un État jugé « infichu de regarder au-delà du périphérique ». Il veut rapprocher les décisions du terrain et renforcer les collectivités. Il défend la restauration de l'autorité de l'État sur ses missions essentielles. Son mouvement Nous France se veut moderne et rassembleur.","societal":"Il défend l'autorité, la laïcité et le refus du communautarisme. Il se pose en opposant résolu à l'extrême droite. Il défend les valeurs républicaines et l'unité nationale. Il présente son mouvement comme jeune, moderne et rassembleur.","education":"Il veut restaurer l'autorité et le niveau scolaire et lutter contre le décrochage. Il défend l'égalité des chances dans les territoires, l'apprentissage et l'enseignement professionnel. Il porte la défense de la laïcité à l'école. Il met en avant l'exigence et la réussite de tous."},"scores":{"eco":3,"social":4,"immigration":2,"securite":2,"env":4,"europe":5,"institutions":3,"societal":3,"education":3},"bloc":"droite","declared":"2026-12"},
    {"name":"Laurent Wauquiez","party":"Les Républicains (LR)","status":"retiré","color":"#2874C4","oneLiner":"Président du groupe LR à l'Assemblée : a RENONCÉ à sa candidature et reconnu Retailleau comme « candidat légitime » de la droite (unité LR).","program":{"eco":"Il porte une ligne de rigueur budgétaire, avec un plan d'économies chiffré à 50 milliards d'euros. Ce plan inclut environ 13 milliards via la réduction des opérateurs et agences de l'État et environ 12 milliards sur les prestations sociales et la lutte contre l'assistanat. Il veut baisser les impôts et la dépense publique et réduire le déficit. Il défend la valeur travail, les PME et les territoires.","social":"Il veut lutter contre l'assistanat et responsabiliser les bénéficiaires d'aides tout en préservant le modèle social. Il propose la conditionnalité et la dégressivité des allocations. Il défend une réforme des retraites et la maîtrise des dépenses sociales. Il cible la fraude sociale.","immigration":"Il porte une ligne très ferme, estimant possible d'économiser environ 5 milliards en régulant les dépenses sociales liées à l'immigration. Il veut restreindre l'aide médicale d'État et durcir les conditions de séjour et d'accès aux prestations. Il défend la réduction de l'immigration et les expulsions. Il veut durcir l'asile.","securite":"Il défend la fermeté pénale et le rétablissement de l'ordre, avec un fort soutien aux forces de l'ordre. Il veut des peines effectives, la construction de prisons et une tolérance zéro. Il lie insécurité et immigration irrégulière. Il met l'autorité de l'État au premier plan.","env":"Il défend une écologie pronucléaire et pragmatique, opposée à l'écologie punitive. Il soutient le nucléaire et l'agriculture et défend la ruralité. Il exprime des réserves sur le financement des renouvelables intermittents. Il privilégie les solutions industrielles et souveraines.","europe":"Il se situe sur une ligne souverainiste au sein de la droite, défendant une Europe des nations. Il refuse l'élargissement des compétences de Bruxelles et les normes contraignantes. Il veut reprendre le contrôle des frontières et défendre les intérêts français. Il prône la fermeté sur l'immigration au niveau européen.","institutions":"Il veut restaurer l'autorité de l'État et réduire fortement le nombre d'agences et d'opérateurs publics. Il défend la rationalisation de la dépense et la lutte contre la bureaucratie. Il se dit favorable à une primaire élargie, jusqu'à Reconquête, pour rassembler la droite. Il porte une réforme de l'État.","societal":"Il défend les valeurs traditionnelles, la laïcité et l'identité française, avec une fermeté contre le communautarisme et l'islamisme. Il met en avant l'attachement à la ruralité et aux racines de la France. Il s'oppose au wokisme. Il inscrit son discours dans un conservatisme assumé.","education":"Il veut restaurer l'autorité, le niveau et le mérite à l'école, avec un retour aux fondamentaux et à la discipline. Il défend la revalorisation de l'apprentissage et de la voie professionnelle. Il porte la défense de la laïcité. Il met le mérite au centre du système éducatif."},"scores":{"eco":2,"social":3,"immigration":1,"securite":1,"env":3,"europe":4,"institutions":2,"societal":2,"education":2},"bloc":"droite"},
    {"name":"David Lisnard","party":"Nouvelle Énergie (ex-LR)","status":"déclaré","color":"#1E88E5","oneLiner":"Maire de Cannes, a quitté LR le 31 mars 2026 pour Nouvelle Énergie : droite libérale-conservatrice (« l’État-providence est mort »), réclame une « grande primaire ouverte » droite-centre (tribune Le Monde 25/08) ; campus « La Gagne » à Cannes les 29-30 août (~2-4 %).","program":{"eco":"Il défend une ligne libérale et décentralisatrice, avec la réduction de la dépense publique et de la fiscalité et la liberté d'entreprendre. Il veut alléger fortement les normes et la bureaucratie au nom de la subsidiarité. Il soutient les communes et l'initiative locale. Il fait de la libération de l'économie un axe central.","social":"Il privilégie la responsabilisation et la subsidiarité plutôt que l'assistanat, avec une gestion locale des politiques sociales. Il veut maîtriser les dépenses sociales et lutter contre la fraude. Il soutient une santé de proximité. Il défend l'efficacité par la gestion locale.","immigration":"Il porte une ligne ferme et régalienne de maîtrise de l'immigration. Il veut appliquer effectivement les expulsions et durcir l'asile. Il défend le contrôle des frontières. Il cible la lutte contre l'immigration irrégulière.","securite":"Il met l'autorité de l'État et le soutien aux maires en première ligne, avec une police municipale renforcée. Il défend la fermeté pénale et la lutte contre la délinquance du quotidien. Il promeut un continuum de sécurité entre niveaux local et national. Il valorise le rôle des élus locaux.","env":"Il défend une écologie pragmatique fondée sur le nucléaire et l'innovation, non punitive. Son projet phare est de remplacer les régions par treize « écorégions » organisées autour des bassins versants pour une gestion écologique territorialisée. Il met l'accent sur la gestion locale de l'eau et des ressources. Il refuse la décroissance.","europe":"Il défend une Europe des nations fondée sur la subsidiarité, refusant la surréglementation bruxelloise. Il défend la souveraineté française et les libertés locales. Il exprime des réserves sur les normes européennes contraignantes. Il veut recentrer l'UE sur l'essentiel.","institutions":"Il porte une décentralisation radicale et la subsidiarité, avec un transfert de compétences aux collectivités et la création de treize écorégions. Il veut réduire le poids de l'État central et de la technocratie. Il défend une grande primaire ouverte de la droite et du centre jusqu'à Reconquête. Il a quitté LR pour fonder Nouvelle Énergie.","societal":"Il est attaché aux libertés individuelles et locales, à la laïcité et à l'autorité. Il refuse le wokisme et le communautarisme. Il défend une France « respectée, indépendante et gagnante ». Il inscrit son projet dans une tradition libérale et républicaine.","education":"Il défend l'autonomie des établissements et la liberté et responsabilité locales. Il veut un retour aux savoirs fondamentaux et au mérite. Il défend la revalorisation des enseignants. Il porte l'exigence et la laïcité à l'école."},"scores":{"eco":1,"social":3,"immigration":2,"securite":2,"env":4,"europe":5,"institutions":4,"societal":4,"education":3},"bloc":"droite","declared":"2026-03-31"},
    {"name":"Gérald Darmanin","party":"Renaissance (ex-LR) · soutient Philippe","status":"retiré","color":"#F9A825","oneLiner":"Garde des Sceaux : a ANNONCÉ le 17 août 2026 qu'il ne serait pas candidat et soutient Édouard Philippe « pour ne pas rajouter de la division ».","program":{"eco":"Darmanin défend une ligne libérale de droite (moins d'impôts, moins de dépense, réduction du déficit) tout en assumant une inflexion sociale. Il soutient la poursuite de la réforme des retraites et a travaillé, avec Philippe, sur un plan de départs volontaires dans la fonction publique. Il justifie la discipline budgétaire par le coût de l'instabilité politique. Dans son projet de « droite sociale », il propose des mesures pour les familles comme une allocation dès le premier enfant.","social":"Via son mouvement « Populaires », il se pose en héraut d'une « droite sociale » prônant l'empathie envers les plus vulnérables et un « nouveau contrat social ». Il met en avant la natalité (allocation dès le premier enfant, scolarisation dès deux ans). Il veut intégrer la santé mentale, la parentalité et l'éco-anxiété. Il reste favorable à la réforme des retraites et à la maîtrise des comptes sociaux.","immigration":"Il est l'architecte de la loi du 26 janvier 2024 (durcissement du regroupement familial, restriction du titre « étranger malade »). Ministre de l'Intérieur, il a systématisé les OQTF et voulait « tarir l'immigration ». Il plaide pour une refonte du règlement de Dublin et un traité migratoire UE-Royaume-Uni sur la Manche. Il a évoqué un moratoire, des quotas et une remise en cause de certaines contraintes constitutionnelles et européennes.","securite":"Ministre de la Justice, il porte le projet de loi « SURE » qu'il présente comme une « révolution » pénale. Le texte rétablit les peines de moins d'un mois, supprime les aménagements automatiques, réserve le sursis simple aux primo-délinquants. Il simplifie l'échelle des peines de plus de 200 à quatre grands types. Il défend une ligne de fermeté et un renforcement des capacités carcérales.","env":"Il défend une écologie « pragmatique » adossée au nucléaire et rejette l'« écologie punitive ». Ministre de l'Intérieur, il a employé le terme d'« écoterrorisme » contre les militants radicaux (Sainte-Soline) et tenté la dissolution des Soulèvements de la Terre. Sa priorité relève surtout de l'ordre public. Il inscrit la transition dans une logique de souveraineté énergétique nationale.","europe":"Pro-européen de la majorité présidentielle, il met l'accent sur « l'Europe des frontières » et la maîtrise migratoire. Il réclame une réforme du règlement de Dublin et une position européenne commune (refuser les visas aux pays refusant les retours). Il a plaidé pour un traité migratoire UE-Royaume-Uni. Sa vision est celle d'une Europe protectrice sur le régalien.","institutions":"Il plaide pour une primaire de la droite et du centre afin de battre l'extrême droite. Il insiste sur le « risque institutionnel » et la stabilité de la Ve République. Redevenu député, il se présente en homme « libre » et vise les municipales de Tourcoing 2026. Il annonce « sept ou huit propositions très fortes » lors de sa convention.","societal":"Il défend une laïcité de combat et la lutte contre le « séparatisme islamiste », thème de son manifeste de 2021. Catholique revendiqué, il met en avant l'ordre républicain et l'assimilation. Son virage « droite sociale » ajoute l'empathie, la natalité et le soutien aux familles. Il combine fermeté sur les valeurs et attention sociale.","education":"L'éducation est un axe central de son projet et de sa convention « Populaires ». Il propose la scolarisation obligatoire dès deux ans contre les inégalités précoces. Il inscrit l'école dans une logique d'autorité, de transmission et de laïcité. Il associe éducation, parentalité et natalité dans son « nouveau contrat social »."},"scores":{"eco":3,"social":4,"immigration":2,"securite":2,"env":5,"europe":7,"institutions":4,"societal":4,"education":4},"bloc":"centre"},
    {"name":"Nicolas Dupont-Aignan","party":"Debout la France (DLF)","status":"déclaré","color":"#144E8C","oneLiner":"Président de Debout la France, candidat souverainiste et gaulliste de droite pour la 4e fois (~2 %).","program":{"eco":"Il défend un souverainisme économique fondé sur la réindustrialisation et un protectionnisme intelligent, le Made in France et la priorité aux marchés publics nationaux. Il propose un retour à une monnaie nationale ou une dévaluation compétitive et la contestation du marché européen de l'électricité. Il veut baisser les charges pour les PME et soutenir l'agriculture. Il vise le contrôle par la France de ses lois, de son budget et de ses choix économiques.","social":"Il défend le modèle social français et les services publics de proximité. Il veut revaloriser les petites retraites et le pouvoir d'achat. Il fait de la lutte contre les déserts médicaux une priorité. Il prône une priorité nationale pour certaines prestations.","immigration":"Il propose un moratoire et une forte réduction de l'immigration, validés par un référendum. Il veut rétablir des frontières strictes, mettre fin au regroupement familial subi et expulser les clandestins et étrangers délinquants. Il veut restreindre l'aide médicale d'État et l'asile. Il lie insécurité et faiblesse de l'État.","securite":"Il défend une lecture répressive avec plus de sanctions, moins d'impunité et la restauration de l'autorité. Il veut construire des prisons, garantir des peines effectives et soutenir les forces de l'ordre. Il lie la violence urbaine à un État jugé trop faible. Il prône la fin de l'impunité.","env":"Il est pronucléaire et veut sortir du marché européen de l'électricité pour faire baisser les prix. Il défend une réindustrialisation et une souveraineté énergétique. Il refuse l'écologie punitive et soutient l'agriculture et le nucléaire. Il privilégie la souveraineté sur les contraintes européennes.","europe":"La rupture avec l'UE est au cœur de son projet, avec la sortie de l'Union ou une renégociation profonde des traités et le retour à la souveraineté monétaire, budgétaire et frontalière. Il veut sortir du commandement intégré de l'OTAN. Il prône la coopération entre nations souveraines plutôt que le fédéralisme. Il défend une France indépendante.","institutions":"Il propose un référendum d'initiative citoyenne constitutionnel avec un seuil d'environ un million de signatures, ainsi qu'un référendum obligatoire en cas de modification constitutionnelle. Il défend la moralisation de la vie publique. Il veut restaurer la souveraineté populaire et l'autorité de l'État. Il met la démocratie directe au centre.","societal":"Il défend la laïcité, l'assimilation et les valeurs républicaines, avec un refus du communautarisme et de l'islamisme. Il met en avant l'identité et la cohésion nationales. Il porte une ligne conservatrice sur les questions de société. Il insiste sur l'unité de la nation.","education":"Il veut restaurer l'autorité, le niveau et l'instruction civique, avec un retour aux fondamentaux et au mérite. Il défend la laïcité et la transmission du roman national. Il veut revaloriser les enseignants et l'apprentissage. Il met l'exigence au centre de l'école."},"scores":{"eco":4,"social":4,"immigration":1,"securite":1,"env":4,"europe":1,"institutions":5,"societal":2,"education":2},"bloc":"droite","declared":"2025"},
    {"name":"Dominique de Villepin","party":"La France humaniste","status":"pressenti","color":"#5C6BC0","oneLiner":"Ancien Premier ministre gaulliste, parti La France humaniste : toujours pas déclaré (2,5-3,5 %), en quête de parrainages. Ses chroniques d’août détaillent un plan budgétaire (fermeture des 400 niches, 9 impôts, déficit < 3 % en 2031) et une bascule de 200 Md€ de cotisations vers la CSG ; populaire pour ses positions sur Gaza.","program":{"eco":"Villepin, tenant d'un gaullisme social et d'un État stratège, défend une plus forte contribution des plus riches via un ISF adapté et soutient la logique d'une taxe Zucman ainsi qu'une contribution sur les successions supérieures à 2 millions. Il critique les quelque 80 milliards annuels d'exonérations de cotisations patronales. Il prône un fonds de souveraineté pour la décarbonation et la réindustrialisation. Historiquement, il a défendu un « revenu citoyen » garanti pour les personnes sans ressources.","social":"Il s'oppose à l'âge légal à 64 ans et défend un système plus équitable, plutôt à points. En santé, il propose un « bouclier sanitaire » plafonnant le reste à charge selon les revenus. Il préconise un « revenu de transition » fusionnant chômage et formation, et une construction massive de logements (20 à 30% sociaux et intermédiaires). Son approche place le citoyen et la justice sociale au cœur de son parti La France Humaniste (2025).","immigration":"Il s'oppose à une réduction drastique des flux et dénonce la « surenchère du durcissement », jugée inefficace et contraire aux valeurs humanistes. Il refuse l'abolition du droit du sol et défend un équilibre entre accueil, dignité et clarté des règles. Il critique la stigmatisation des étrangers pratiquée par le RN comme par une partie de la droite. Sa ligne s'inscrit dans une tradition républicaine d'ouverture.","securite":"Il défend l'ordre républicain et l'État de droit tout en refusant la surenchère pénale. Fidèle à une tradition gaullienne, il privilégie l'autorité de l'État accompagnée de prévention et de justice sociale. Il met en garde contre l'instrumentalisation politique de la sécurité et l'affaiblissement des libertés. Sa priorité reste la cohésion nationale.","env":"Il porte une « écologie intégrée » combinant nucléaire modernisé et développement massif des renouvelables, sans viser le 100% renouvelable. Il prône une sortie progressive des fossiles et une tarification du carbone aux niveaux national, européen et mondial. Il fixe -50% de pesticides d'ici 2030 et s'oppose aux nouvelles autoroutes. Il relie transition écologique et souveraineté via un fonds dédié.","europe":"Fort de sa stature internationale, il prône un « sursaut euro-gaulliste » pour l'autonomie stratégique européenne, critiquant l'alignement sur les USA et l'imprévisibilité de l'OTAN. Il propose un Conseil de sécurité européen (Allemagne, Espagne, France, Italie, Pologne) plutôt qu'une armée commune, et refuse tout désarmement nucléaire unilatéral. Sur l'Ukraine, il privilégie la diplomatie. Sur Gaza, il soutient le mandat de la CPI contre Netanyahou et la reconnaissance de la Palestine.","institutions":"Il plaide pour une réforme institutionnelle profonde, voire une VIe République, pour rééquilibrer les pouvoirs. Il défend le renforcement du Parlement, la suppression du 49.3 et le référendum d'initiative citoyenne (RIC). Il présente son mouvement comme un espace de rassemblement républicain face à LFI et au RN. Il critique la concentration du pouvoir exécutif.","societal":"Il s'oppose à l'interdiction des signes religieux pour les usagers des services publics et défend une laïcité ouverte fondée sur la dignité humaine. Il est favorable à un accès élargi à l'IVG, à l'aide à mourir et à un remboursement élargi de la PMA. Il dénonce la concentration des médias entre quelques milliardaires comme une menace démocratique. Ses valeurs : solidarité, équité sociale et ouverture au monde.","education":"Il s'oppose à l'algorithme Parcoursup, jugé trop contraignant, et défend plus de liberté d'orientation. Il inscrit l'école dans un projet humaniste d'émancipation et de réduction des inégalités. Il valorise la transmission culturelle et l'ouverture au monde. Son approche relie éducation, justice sociale et refondation républicaine."},"scores":{"eco":4,"social":5,"immigration":4,"securite":4,"env":6,"europe":6,"institutions":4,"societal":6,"education":5},"bloc":"centre"},
    {"name":"François Asselineau","party":"Union populaire républicaine (UPR)","status":"déclaré","color":"#12326B","oneLiner":"Président de l'UPR, candidat déclaré le 21 mars 2026 : Frexit, sortie de l'euro et de l'OTAN.","program":{"eco":"Il fonde son projet sur la récupération de la souveraineté monétaire et budgétaire via le Frexit, avec la sortie de l'euro, le retour au franc et la reprise du contrôle de la Banque de France. Il défend une politique industrielle nationale, des nationalisations stratégiques et la protection des services publics. Il veut mettre fin à la contribution française au budget de l'UE. Il subordonne toute politique économique à la reconquête de la souveraineté.","social":"Il défend la reconstruction des services publics et de la Sécurité sociale, libérés des contraintes budgétaires européennes. Il veut un État protecteur et une réindustrialisation créatrice d'emplois. Il porte une souveraineté sociale nationale. Il lie la restauration du modèle social à la sortie de l'UE.","immigration":"Il subordonne la question migratoire au recouvrement de la souveraineté : hors de l'UE et de Schengen, la France maîtriserait à nouveau ses frontières et sa politique migratoire. Il défend le rétablissement du contrôle national des frontières. Il adopte une approche juridique et constitutionnelle plutôt qu'identitaire. Il met la souveraineté avant tout.","securite":"Il défend la restauration de l'autorité de l'État et l'indépendance de la justice. Il veut renforcer les moyens régaliens, rendus possibles selon lui par la sortie des contraintes européennes. Il porte un ordre républicain. Il inscrit la sécurité dans la reconquête de la souveraineté.","env":"Il défend une souveraineté énergétique fondée sur le nucléaire public et EDF, avec la sortie du marché européen de l'énergie. Il veut une politique énergétique décidée nationalement. Il refuse les contraintes énergétiques imposées par Bruxelles. Il privilégie l'indépendance énergétique.","europe":"Le Frexit est le cœur de son projet : sortie de l'UE par l'article 50, sortie de l'euro et de l'OTAN. Il prône une France indépendante et non alignée, coopérant librement avec toutes les nations. Il dénonce les traités européens. Il rappelle le référendum de 2005 comme fondement de sa démarche.","institutions":"Il défend une refondation démocratique par la reconquête de la souveraineté nationale et populaire. Il veut recourir au référendum et faire respecter la volonté populaire. Il fait de l'indépendance nationale le préalable à toute réforme. Il inscrit sa démarche dans une lecture constitutionnelle stricte.","societal":"Il adopte une approche laïque et républicaine universaliste, refusant les logiques communautaires. Il donne la priorité à l'unité nationale et à la citoyenneté. Son discours est centré sur la souveraineté plutôt que sur les questions sociétales. Il défend un cadre républicain classique.","education":"Il défend l'école républicaine, laïque et gratuite et la transmission des savoirs. Il veut une souveraineté éducative face aux normes européennes. Il valorise l'histoire et la culture françaises. Il met l'accent sur l'instruction et le patriotisme républicain."},"scores":{"eco":5,"social":5,"immigration":4,"securite":3,"env":4,"europe":0,"institutions":5,"societal":4,"education":4},"bloc":"droite","declared":"2026-03-21"},
    {"name":"Marine Le Pen","party":"Rassemblement national (RN)","status":"déclaré","color":"#1D4E89","oneLiner":"Candidate du RN, éligible depuis l'arrêt du 7 juillet 2026 (cassation : arrêt attendu début avril 2027). Nette favorite (33-38 %, gagnante de tous les seconds tours testés fin août, 52-48 face à Philippe chez Elabe). Au Medef (27/08) : retraite à 60 ans pour les carrières longues, 62 ans sinon, plan de 125 Md€ d'économies, règle d'or ; assume le départ de son conseiller libéral Durvye (« je l'ai souhaité ») : ligne sociale et souverainiste.","program":{"eco":"Elle fait du pouvoir d'achat une priorité, avec la baisse de la TVA de 20% à 5,5% sur l'énergie (électricité, gaz, carburants, fioul) et la suppression de la TVA sur une centaine de produits de première nécessité. Elle propose l'exonération d'impôt sur le revenu pour les moins de 30 ans et la priorité nationale à l'emploi. Elle défend un protectionnisme et un patriotisme économique. Elle soutient les PME et l'agriculture.","social":"Sur les retraites, elle défend le retour à 62 ans, puis 60 ans pour 40 à 42 années de cotisation (avec un débat interne : Bardella privilégie la durée de cotisation), un minimum retraite autour de 1 000 euros et la réindexation des pensions sur l'inflation. Elle veut réserver certaines prestations sociales et le logement social aux nationaux via la priorité nationale (délai de cinq ans de travail en France), lutter contre les déserts médicaux et revaloriser les soignants. Elle s'oppose à la loi sur l'aide à mourir.","immigration":"Elle propose une réduction drastique de l'immigration, validée par référendum, et l'inscription de la priorité nationale dans la Constitution. Elle veut supprimer le regroupement familial et le droit du sol et restreindre l'asile et l'aide médicale d'État. Elle prévoit l'expulsion systématique des étrangers délinquants et des personnes sous OQTF. Elle veut supprimer l'accès aux prestations pour les étrangers non actifs.","securite":"Elle défend une grande fermeté pénale, avec la fin de l'excuse de minorité, des peines plancher et la présomption de légitime défense pour les forces de l'ordre. Elle propose la construction de dizaines de milliers de places de prison. Elle veut une tolérance zéro et l'expulsion des délinquants étrangers. Elle veut renforcer les moyens de la police et de la justice.","env":"Elle défend une écologie patriote et le localisme, avec la relance du nucléaire (nouveaux EPR, filière hydrogène). Elle propose un moratoire et l'arrêt de l'éolien, avec démantèlement, et s'oppose au solaire subventionné. Elle défend les circuits courts, la protection des terres agricoles et la biodiversité. Elle soumet plusieurs de ces mesures à référendum.","europe":"Elle défend une alliance européenne des nations plutôt qu'une UE fédérale, avec la renégociation des traités et la primauté du droit national sur le droit européen. Elle veut réduire la contribution française au budget de l'UE et reprendre le contrôle des frontières face à Schengen. Elle refuse l'élargissement et les politiques migratoires communes. Elle a abandonné la sortie de l'euro et le Frexit.","institutions":"Elle propose un référendum d'initiative citoyenne (500 000 signatures), un recours élargi au référendum de l'article 11 pour contourner le Parlement, et la proportionnelle intégrale aux législatives. Elle veut une révision constitutionnelle par référendum pour inscrire la priorité nationale, la maîtrise de l'immigration et la primauté du droit national sur le droit européen.","societal":"Elle défend la laïcité et la lutte contre l'islamisme, avec l'interdiction du voile dans l'espace public et la fermeture des mosquées radicales. Elle est attachée à l'identité et à l'assimilation et refuse le communautarisme et le wokisme. Elle défend une politique familiale et nataliste. Elle promeut les valeurs de la civilisation française.","education":"Elle veut restaurer l'autorité, la laïcité et les savoirs fondamentaux, avec l'uniforme, l'interdiction du voile et des méthodes traditionnelles. Elle défend la revalorisation des enseignants et de l'apprentissage et la promotion du mérite. Elle défend le roman national et la culture française. Elle veut recentrer l'école sur la transmission."},"scores":{"eco":3,"social":3,"immigration":0,"securite":0,"env":2,"europe":2,"institutions":4,"societal":1,"education":2},"bloc":"exd","declared":"2026-07-07"},
    {"name":"Jordan Bardella","party":"Rassemblement national (RN)","status":"réserve","color":"#16406F","oneLiner":"Président du RN, plan B seulement : Marine Le Pen est la candidate. Le 29/08 à Châlons il fixe le duo — elle « candidate au poste de présidente », lui « candidat au poste de Premier ministre », campagne « côte à côte » — après la défaite de sa ligne libérale (départ du conseiller Durvye le 27/08). Programme « de redressement » et « nettoyage des finances publiques » annoncé pour septembre ; réélection au congrès d'Orléans (24-25 octobre).","program":{"eco":"Il porte un programme qu'il présente comme résolument pro-business tout en défendant le pouvoir d'achat, avec la baisse de la TVA de 20% à 5,5% sur l'énergie (gain estimé 200 à 400 euros par an et par ménage selon le RN). Il veut baisser les charges et les impôts sur le travail et les classes moyennes. Il défend un protectionnisme avec des droits de douane accrus sur les produits importés, notamment de Chine et des États-Unis. Il propose de financer le programme par la réduction des dépenses d'immigration, la lutte contre la fraude et la renégociation de la contribution à l'UE.","social":"Il défend une réforme des retraites avec retour à 62 ans et départ anticipé pour les carrières longues. Il porte la priorité nationale à l'emploi et au logement social. Il veut soutenir le pouvoir d'achat. Il défend l'accès aux soins et la lutte contre les déserts médicaux.","immigration":"Il défend une réduction drastique de l'immigration légale, avec un objectif d'environ 10 000 entrées par an contre environ 340 000 en 2025. Il veut mettre fin au regroupement familial, conditionner le droit au séjour à l'emploi et supprimer le droit du sol. Il propose une réforme restrictive de l'asile et des expulsions renforcées. Il inscrit la priorité nationale au cœur de son projet.","securite":"Il défend une grande fermeté pénale, avec la fin de l'excuse de minorité, des peines effectives et un fort soutien aux forces de l'ordre. Il veut construire des prisons et appliquer la tolérance zéro. Il prône l'expulsion des étrangers délinquants. Il fait du rétablissement de la sécurité partout une priorité.","env":"Il est pronucléaire, avec la relance de la filière et de nouveaux réacteurs, et s'oppose à l'éolien. Il défend le localisme et les circuits courts. Il refuse l'écologie punitive et l'interdiction du moteur thermique. Il défend la souveraineté et la protection agricoles.","europe":"Il défend une Europe des nations et la primauté du droit français, avec la renégociation des règles budgétaires et migratoires. Il veut réduire la contribution française au budget européen et reprendre le contrôle des frontières. Il défend un protectionnisme aux frontières de l'UE. Il refuse une intégration fédérale.","institutions":"Il propose la proportionnelle aux législatives et un recours élargi au référendum, dont le RIC. Il défend une révision constitutionnelle pour inscrire la priorité nationale et la maîtrise de l'immigration. Il veut restaurer l'autorité de l'État. Il défend la souveraineté populaire.","societal":"Il défend la lutte contre l'islamisme et le communautarisme et la défense de la laïcité. Il est attaché à l'identité et à l'assimilation et refuse le wokisme. Il porte une politique familiale et nataliste. Il défend les valeurs de la civilisation française.","education":"Il veut restaurer l'autorité et le niveau, avec un retour aux fondamentaux, l'uniforme et l'interdiction du portable. Il défend la revalorisation des enseignants et de l'apprentissage. Il porte la laïcité et le mérite. Il veut recentrer l'école sur les savoirs."},"scores":{"eco":3,"social":3,"immigration":0,"securite":0,"env":2,"europe":2,"institutions":4,"societal":1,"education":2},"bloc":"exd"},
    {"name":"Éric Zemmour","party":"Reconquête","status":"pressenti","color":"#1C1C3A","oneLiner":"Président de Reconquête : « j'y vais quoi qu'il arrive » disait-il, mais sa décision reste en suspens à l'été 2026 ; crédité de 3-4 %, bien en dessous de 2022.","program":{"eco":"Il défend une ligne libérale avec la baisse des impôts, la suppression des impôts de production, la baisse de l'impôt sur les sociétés et des charges, au bénéfice des PME et des classes moyennes. Il porte une réindustrialisation et un protectionnisme ciblé, avec des relocalisations par incitations fiscales et la protection des secteurs stratégiques. Il propose de financer ces baisses par la suppression de dépenses jugées inutiles. Il défend la valeur travail.","social":"Il porte une politique nataliste forte, avec le renforcement des allocations et du quotient familial pour relancer la démographie. Il défend les retraites et le travail. Il veut réduire l'assistanat et conditionner les aides. Il inscrit la priorité nationale dans les prestations.","immigration":"Il fait de l'immigration le cœur de son projet, avec l'objectif de « zéro immigration » et la création d'un ministère de la Remigration pour organiser des retours volontaires et forcés des étrangers non assimilés et délinquants. Il veut supprimer le regroupement familial, le droit du sol et l'aide médicale d'État, limiter fortement l'asile et instaurer une caution de visa. Il propose un référendum sur l'immigration. Il assume le terme de remigration.","securite":"Il prône la tolérance zéro, avec des peines plancher, la fin de l'excuse de minorité et la construction de dizaines de milliers de places de prison. Il défend la présomption de légitime défense pour la police et l'expulsion des délinquants étrangers ainsi que la déchéance de nationalité. Il veut rétablir l'ordre et lutter contre l'islamisme. Il met la fermeté au centre de son projet régalien.","env":"Il est fortement pronucléaire, avec une relance massive et de nouveaux EPR, et s'oppose à l'éolien avec démantèlement. Il rejette l'écologie punitive et la décroissance. Il défend la souveraineté énergétique, l'industrie et l'automobile. Il conteste les objectifs climatiques contraignants.","europe":"Il défend une Europe des nations et la primauté du droit national, refusant l'UE fédérale et les juges européens, dont la CEDH. Il veut reprendre le contrôle des frontières et renégocier les traités et Schengen. Il défend la souveraineté française sans sortir de l'euro. Il veut limiter l'emprise du droit européen.","institutions":"Il propose un recours élargi au référendum via l'article 11, notamment sur l'immigration, la sécurité et la justice, ainsi qu'un RIC. Il veut réformer l'État et la justice et limiter le pouvoir des juges et du Conseil constitutionnel. Il défend la restauration de l'autorité présidentielle. Il veut rendre la parole au peuple.","societal":"Il défend l'identité française et l'assimilation et lutte contre l'islamisation et ce qu'il appelle le grand remplacement. Il propose la francisation des prénoms, une loi contre le voile dans l'espace public et une laïcité stricte. Il s'oppose au wokisme, à la théorie du genre et à la PMA pour toutes. Il défend les valeurs familiales et la natalité.","education":"Il veut restaurer l'autorité et l'instruction classique, avec un retour aux fondamentaux, la suppression du collège unique et l'uniforme. Il veut mettre fin au pédagogisme et au wokisme et valoriser le mérite et l'excellence. Il défend la transmission du roman national. Il met l'exigence au centre de l'école."},"scores":{"eco":3,"social":2,"immigration":0,"securite":0,"env":2,"europe":2,"institutions":4,"societal":0,"education":1},"bloc":"exd"},
    {"name":"Florian Philippot","party":"Les Patriotes","status":"déclaré","color":"#283593","oneLiner":"Président des Patriotes, candidat déclaré le 9 mars 2026 : Frexit, sortie de l'euro et de l'OTAN, figure de la contestation « anti-système ».","program":{"eco":"Il défend un souverainisme économique via le Frexit, avec la sortie de l'euro, le retour au franc et la reprise de la souveraineté monétaire et budgétaire. Il chiffre à environ 15 milliards par an la contribution à l'UE récupérée, et défend le protectionnisme, les nationalisations et la réindustrialisation. Il propose de faire baisser fortement les prix de l'énergie par la sortie du marché européen (diviser par trois le prix de l'électricité). Il fait de la souveraineté la condition de la prospérité.","social":"Il défend le modèle social et les services publics, financés par la sortie des contraintes européennes. Il veut reconstruire l'hôpital public et s'oppose à toute contrainte sanitaire, ayant rejeté le pass sanitaire. Il porte une souveraineté sociale. Il défend la préservation du modèle social français.","immigration":"Il défend une forte réduction de l'immigration et le rétablissement des frontières nationales après sortie de Schengen. Il veut une fermeté sur l'asile et le regroupement familial et l'expulsion des clandestins. Il porte la priorité nationale. Il lie maîtrise migratoire et souveraineté.","securite":"Il défend la restauration de l'autorité de l'État et de l'ordre républicain. Il veut la fermeté pénale et le soutien aux forces de l'ordre. Il fait de la reprise du contrôle des frontières une condition de la sécurité. Il met l'autorité au premier plan.","env":"Il est pronucléaire et veut sortir du marché européen de l'électricité pour faire baisser les prix. Il défend une souveraineté énergétique nationale. Il refuse l'écologie punitive et les normes européennes. Il privilégie l'indépendance énergétique.","europe":"Il veut « détruire l'UE avant qu'elle nous détruise », avec le Frexit, la sortie de l'euro, de l'OTAN et de l'OMS. Il prône une France libre et non alignée, opposée à l'escalade guerrière et à la Commission européenne. Il défend la coopération entre nations souveraines. Il fait de la sortie de l'UE l'axe central de son projet.","institutions":"Il défend la restauration de la souveraineté populaire et nationale et le recours au référendum. Il porte une refondation démocratique par la sortie de l'UE. Il défend les libertés publiques et s'oppose aux mesures d'exception sanitaires. Il veut rendre le pouvoir au peuple.","societal":"Il défend la laïcité, la République et les libertés individuelles et refuse le communautarisme. Il s'oppose aux restrictions sanitaires et à la société de contrôle. Il est attaché à l'identité et à la souveraineté nationales. Il met en avant les libertés publiques.","education":"Il défend l'école républicaine et laïque et la transmission des savoirs et du patriotisme. Il veut une souveraineté éducative face aux normes européennes. Il défend la restauration de l'autorité et du niveau. Il met l'accent sur l'instruction."},"scores":{"eco":4,"social":4,"immigration":1,"securite":2,"env":3,"europe":0,"institutions":5,"societal":2,"education":3},"bloc":"exd","declared":"2026-03-09"},
    {"name":"Fabien Roussel","party":"Parti communiste français (PCF)","status":"conditionnel","bloc":"gauche","color":"#E53935","declared":"2026-09-06","oneLiner":"Secrétaire national du PCF, maire de Saint-Amand-les-Eaux : vote des adhérents du 3 au 6 septembre 2026, officialisation attendue le 6 (Ian Brossat directeur de campagne). Université d’été de Toulouse (22/08) : SMIC 1 700 € net, +5 % pour tous les salaires, plan climat 500 Md€ (renouvelables ET nucléaire), refus de s’effacer derrière LFI (~2-3 %).","program":{"eco":"Roussel défend une « gauche du travail » : SMIC à 2 000 euros brut, hausse générale des salaires par conférence sociale, retraite à 60 ans à taux plein pour 40 ans de cotisation, abrogation de la réforme de 2023, nationalisation des autoroutes et pôle public de l'énergie et de la banque. Il veut taxer les dividendes et les superprofits, rétablir un ISF renforcé, soumettre les revenus financiers aux cotisations sociales et conditionner les aides aux entreprises au maintien de l'emploi. Il se distingue de LFI par un discours sur la « valeur travail » et contre « la gauche des allocations ».","social":"Il veut un « 100 % Sécu » (remboursement intégral des soins par la Sécurité sociale, fin des complémentaires), la fin du numerus clausus et le recrutement massif de soignants, des centres de santé publics dans les déserts médicaux, la construction de 200 000 logements sociaux par an et le rétablissement de l'ISF pour financer la protection sociale. Il refuse toute année blanche et veut indexer pensions et minima sur l'inflation.","immigration":"Position d'équilibre à gauche : il refuse « l'immigration zéro » comme la « liberté totale », défend la régularisation des travailleurs sans-papiers, un traitement plus rapide et digne des demandes d'asile et une politique européenne de solidarité, mais insiste sur l'intégration par le travail, la langue et la laïcité, et assume de parler de contrôle des frontières et de coopération avec les pays d'origine.","securite":"Il revendique un « droit à la sécurité » pour les classes populaires : police de proximité recréée (plus de policiers formés, présents à pied dans les quartiers), moyens massifs pour la justice, lutte prioritaire contre le narcotrafic et le blanchiment, sanctions plus rapides pour les petits délits, mais refus des peines planchers et de la fin de l'excuse de minorité. Il défend un contrôle démocratique de la police et le rétablissement du récépissé de contrôle d'identité.","env":"Écologie « populaire » et industrielle : maintien et relance du nucléaire (nouveaux EPR) à côté des renouvelables, opposition à la « décroissance », rénovation thermique massive financée par un pôle public bancaire, TVA à 5,5 % sur l'énergie, retour à la souveraineté alimentaire avec des prix planchers pour les agriculteurs. Il a soutenu la suppression des ZFE au nom de la justice sociale et défend la voiture électrique française accessible.","europe":"Souverainisme de gauche : désobéir aux règles budgétaires européennes, refuser les accords de libre-échange (Mercosur, CETA), sortie du commandement intégré de l'OTAN, mais soutien à l'Ukraine et fermeté face à Poutine. Il défend une Europe des coopérations, la protection des services publics contre la concurrence et la fin de la libéralisation de l'électricité.","institutions":"Il propose la proportionnelle intégrale aux législatives, le référendum d'initiative citoyenne encadré, la limitation des pouvoirs présidentiels sans forcément une VIe République, la fin du 49.3 et un renforcement des droits du Parlement. Il défend la laïcité comme principe central de la République et refuse le communautarisme.","societal":"Progressiste sur les droits (mariage pour tous, PMA, fin de vie qu'il a soutenue), il se distingue à gauche par une insistance sur la laïcité « stricte », la lutte contre l'islamisme et le refus des logiques identitaires ; il défend une politique culturelle populaire (fête, sport, associations) et les services publics comme ciment de la République.","education":"École publique renforcée : recrutement de 90 000 enseignants, revalorisation de 30 % des salaires, retour à des effectifs de 20 élèves par classe, mixité sociale via la carte scolaire et conditionnement des financements du privé, gratuité réelle (fournitures, cantine), pré-recrutement des enseignants payés pendant leurs études. Il veut sanctuariser le budget de la culture et défendre le service public audiovisuel."},"scores":{"eco":8,"social":8,"immigration":5,"securite":4,"env":5,"europe":4,"institutions":6,"societal":6,"education":8}},
    {"name":"Ségolène Royal","party":"Parti socialiste (PS)","status":"primaire","bloc":"gauche","color":"#D81B60","oneLiner":"Ancienne ministre et finaliste de 2007 : candidate à la primaire PS / Place publique depuis le 10 juillet 2026, sur une ligne d’« ordre juste », d’écologie et de démocratie participative ; réclame « l’égalité des temps de parole » face à Glucksmann.","program":{"eco":"Royal défend une social-démocratie « de l'ordre juste » : hausse du SMIC et des bas salaires, conditionnement des aides publiques aux entreprises, fiscalité plus progressive avec taxation des très hauts patrimoines (elle soutient la taxe Zucman), retour à 62 ans avec prise en compte de la pénibilité, et soutien aux PME et aux territoires. Elle insiste sur la réindustrialisation verte et sur les « emplois d'avenir » pour les jeunes.","social":"Elle met en avant la santé et la dépendance : moyens pour l'hôpital public, lutte contre les déserts médicaux par des maisons de santé et des obligations de service, aide à l'autonomie des personnes âgées, logement social et encadrement des loyers. Elle défend les droits des femmes (égalité salariale contraignante) et refuse toute année blanche pour les petites retraites.","immigration":"Ligne républicaine et humaniste : respect du droit d'asile et accueil digne, régularisation des travailleurs sans-papiers dans les métiers en tension, mais fermeté contre les filières de passeurs et exigence d'intégration (langue, travail). Elle refuse la priorité nationale et la remise en cause du droit du sol.","securite":"Elle revendique une gauche de « l'ordre juste » : police de proximité, réponse rapide aux incivilités, encadrement des mineurs délinquants (elle avait proposé des structures à encadrement militaire en 2007), moyens pour la justice, tout en défendant la prévention et la réinsertion. Elle prend au sérieux la demande de sécurité des classes populaires.","env":"Ancienne ministre de l'Écologie (loi de transition énergétique de 2015), elle fait de l'écologie un pilier : accélération des renouvelables, rénovation thermique, économie circulaire, protection de la biodiversité et des océans (elle a été ambassadrice des pôles), tout en gardant une part de nucléaire. Elle veut une écologie « qui améliore la vie » plutôt que punitive.","europe":"Pro-européenne, elle veut une Europe sociale et écologique, la défense des agriculteurs face au Mercosur, une défense européenne renforcée et le soutien à l'Ukraine, tout en gardant une diplomatie française indépendante (elle a soutenu la reconnaissance de la Palestine).","institutions":"Figure de la démocratie participative depuis 2007 : jurys citoyens, référendums locaux, dose de proportionnelle, non-cumul, et rénovation des institutions vers plus de contrôle citoyen et une réforme du Sénat. Elle défend la laïcité et l'égalité entre les territoires.","societal":"Progressiste : droits des femmes, égalité réelle, lutte contre les discriminations, défense de la laïcité et de la mixité, soutien à la loi sur la fin de vie, protection de l'enfance et lutte contre les violences intrafamiliales.","education":"Ancienne ministre de l'Enseignement scolaire : priorité à l'école primaire, aide aux devoirs, mixité sociale, revalorisation des enseignants, lutte contre le harcèlement et le décrochage, et une école qui prépare aux métiers de la transition écologique."},"declared":"2026-07-10","scores":{"eco":6.5,"social":7,"immigration":6,"securite":5,"env":8,"europe":7,"institutions":6.5,"societal":8,"education":7}},
    {"name":"Philippe Brun","party":"Parti socialiste (PS)","status":"primaire","bloc":"gauche","color":"#F06EAA","oneLiner":"Député de l’Eure (34 ans), spécialiste du budget, artisan de la taxe Zucman : candidat à la primaire PS / Place publique depuis le 30 juin 2026 ; programme « Produire » (19/08) : cinq usines par département, monopole public d’EDF, ISF, et une retraite « mixte avec beaucoup de capitalisation » via un fonds souverain géré par les syndicats.","program":{"eco":"Brun incarne une gauche de la justice fiscale et du travail : taxe Zucman de 2 % sur les patrimoines au-dessus de 100 millions, lutte contre l'optimisation via les holdings, impôt sur les successions plus progressif, conditionnement des aides aux entreprises, hausse des bas salaires et retour à 62 ans avec 43 annuités modulées. Il défend une politique industrielle active (il a porté des propositions sur Renault et l'automobile) et la protection des PME face aux grands groupes.","social":"Il veut sauver l'hôpital public par des moyens et une planification des recrutements, lutter contre les déserts médicaux, garantir l'indexation des pensions et des prestations (refus de l'année blanche), et renforcer le logement social et l'encadrement des loyers.","immigration":"Ligne PS : respect du droit d'asile, régularisation des travailleurs sans-papiers dans les métiers en tension, refus de la priorité nationale et du démantèlement du droit du sol, exigence d'intégration par le travail et la langue, et politique européenne commune.","securite":"Il défend une justice dotée de moyens (magistrats, greffiers), une police de proximité, la lutte contre le narcotrafic et le blanchiment (il travaille sur les circuits financiers), et des peines alternatives pour les petits délits ; il s'oppose aux peines planchers.","env":"Planification écologique financée par la justice fiscale : rénovation thermique, transports du quotidien, soutien aux renouvelables en gardant le nucléaire existant, et transition de l'industrie automobile vers l'électrique produit en France.","europe":"Pro-européen, il veut une Europe qui protège : taxation minimale des multinationales et des ultra-riches à l'échelle européenne, défense européenne et soutien à l'Ukraine, refus du Mercosur en l'état, et réforme des règles budgétaires pour permettre l'investissement.","institutions":"Dose de proportionnelle, transparence de la vie publique, encadrement des lobbies, renforcement du Parlement (il a été rapporteur budgétaire) et lutte contre l'abstention par une démocratie plus participative.","societal":"Progressiste sur les droits (fin de vie, PMA, égalité femmes-hommes, lutte contre les discriminations), attaché à la laïcité et à l'universalisme républicain.","education":"Priorité à l'école publique : revalorisation des enseignants, mixité sociale, moyens pour l'éducation prioritaire, université gratuite et bourses renforcées, et formation aux métiers industriels et de la transition."},"declared":"2026-06-30","scores":{"eco":7.5,"social":6,"immigration":6,"securite":5,"env":7,"europe":7,"institutions":6,"societal":7,"education":7}}
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
  var POLLS_DATE = "fin août 2026 (26-28 août)";
  var POLLS_SOURCES = "Elabe 26-28 août pour BFMTV / La Tribune Dimanche · Ifop-Fiducial 24-25 août (7 hypothèses) · Toluna Harris Interactive 18-19 août (5 hypothèses) · Odoxa 26-27 août (crédibilité économique)";
  var POLLS = {
        "Marine Le Pen": 35,
        "Édouard Philippe": 17.5,
        "Jean-Luc Mélenchon": 16,
        "Gabriel Attal": 13.5,
        "Raphaël Glucksmann": 11.5,
        "François Hollande": 8.5,
        "Bruno Retailleau": 7.5,
        "Éric Zemmour": 3.5,
        "Marine Tondelier": 3.5,
        "Fabien Roussel": 3,
        "Dominique de Villepin": 3,
        "Xavier Bertrand": 3,
        "François Ruffin": 2.5,
        "Nicolas Dupont-Aignan": 2,
        "Olivier Faure": 2,
        "David Lisnard": 2,
        "Karim Bouamrane": 1,
        "Florian Philippot": 1,
        "Ségolène Royal": 1,
        "Nathalie Arthaud": 1,
        "François Asselineau": 0.7,
        "Jérôme Guedj": 0.5,
        "Philippe Brun": 0.5,
        "Anasse Kazib": 0.5,
        "Selma Labib": 0.5,
        "Delphine Batho": 0.5
  };
  var POLLS_RANGE = {
        "Marine Le Pen": [
              33,
              38
        ],
        "Édouard Philippe": [
              14,
              21
        ],
        "Jean-Luc Mélenchon": [
              14,
              19
        ],
        "Gabriel Attal": [
              8,
              15.5
        ],
        "Raphaël Glucksmann": [
              10,
              18
        ],
        "François Hollande": [
              7.5,
              12
        ],
        "Bruno Retailleau": [
              6,
              12
        ],
        "Éric Zemmour": [
              2.5,
              4
        ],
        "Marine Tondelier": [
              2,
              5
        ],
        "Fabien Roussel": [
              2,
              3
        ],
        "Dominique de Villepin": [
              2.5,
              3.5
        ],
        "Nicolas Dupont-Aignan": [
              1.5,
              3
        ],
        "Nathalie Arthaud": [
              0.5,
              1.5
        ]
  };
  // Calendrier de la campagne (dates connues au 29 août 2026)
  var KEY_DATES = [
        {
              "date": "2026-08-29",
              "label": "Face-à-face François Hollande – Édouard Philippe sur LCI (université d’été du Laboratoire de la République, Sens)"
        },
        {
              "date": "2026-08-30",
              "label": "Rentrée de Gérald Darmanin à Tourcoing avec Édouard Philippe (meeting « Populaires », 14 h) · clôture du campus « La Gagne » de Lisnard à Cannes"
        },
        {
              "date": "2026-09-02",
              "label": "Sortie du livre-programme de Sarah Knafo, « Le Casse du siècle » (Fayard) — rampe de lancement de la rentrée Reconquête"
        },
        {
              "date": "2026-09-03",
              "label": "Sortie du livre-programme de François Hollande, « Unir » (Robert Laffont, 80 propositions)"
        },
        {
              "date": "2026-09-05",
              "label": "Jean-Luc Mélenchon à la braderie de Lille"
        },
        {
              "date": "2026-09-06",
              "label": "Vote des militants PCF : officialisation attendue de la candidature de Fabien Roussel"
        },
        {
              "date": "2026-09-11",
              "label": "Fête de l’Humanité (11-13 septembre)"
        },
        {
              "date": "2026-09-15",
              "label": "Clôture du dépôt des candidatures à la primaire PS / Place publique (1er-15 septembre)"
        },
        {
              "date": "2026-09-27",
              "label": "Élections sénatoriales (renouvellement partiel) · visite du pape en France du 25 au 28 septembre"
        },
        {
              "date": "2026-09-30",
              "label": "Présentation du projet de loi de finances 2027 — budget « réversible » de premier semestre annoncé par Lecornu (censure promise par LFI et le PS)"
        },
        {
              "date": "2026-10-09",
              "label": "Primaire PS / Place publique — 1er tour (9-10 octobre)"
        },
        {
              "date": "2026-10-10",
              "label": "Meeting régional de Gabriel Attal à Lyon (« démonstration de force »)"
        },
        {
              "date": "2026-10-11",
              "label": "Primaire de la « gauche unitaire » (Tondelier, Ruffin) — toujours programmée mais très fragilisée · meeting de Mélenchon à Clermont-Ferrand"
        },
        {
              "date": "2026-10-16",
              "label": "Primaire PS / Place publique — 2nd tour (16-17 octobre)"
        },
        {
              "date": "2026-10-24",
              "label": "Congrès du RN à Orléans (24-25 oct.) : réélection de Bardella · décision de Bruno Le Maire attendue en octobre"
        },
        {
              "date": "2026-12-15",
              "label": "François Hollande décide « en décembre » · sondages d’automne censés départager Attal et Philippe (désistement début 2027)"
        },
        {
              "date": "2027-03-12",
              "label": "Date limite de dépôt des 500 parrainages au Conseil constitutionnel (18 h) — liste officielle fin mars"
        },
        {
              "date": "2027-04-01",
              "label": "Cour de cassation : arrêt sur le pourvoi de Marine Le Pen attendu « au plus tard début avril » (aucune audience fixée)"
        },
        {
              "date": "2027-04-18",
              "label": "1er tour de l’élection présidentielle"
        },
        {
              "date": "2027-05-02",
              "label": "2nd tour de l’élection présidentielle"
        }
  ];
  var DATA_DATE = "1er septembre 2026";

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
