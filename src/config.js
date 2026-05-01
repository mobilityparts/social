export const BRAND = {
  name: 'Mobility Parts',
  tagline: 'Votre distributeur B2B de pièces auto à Bruxelles',
  delivery: 'Livraison rapide — J+1 selon disponibilité',
  references: '5M+ références au catalogue',
  vin_rate: '99.9%',
  contacts: {
    sav: '+32 480 20 64 10 (disponible via WhatsApp)',
    shop: 'wa.me/32470134550',
    sales: 'wa.me/32475204638',
  },
  catalog: 'mobility-parts-eu.odoo.com/formulaire-compte-pro',
};

export const PILLARS = [
  {
    id: 'tips',
    label: 'Conseil Méca',
    weight: 3,
    tone: 'expert, pédagogue, direct — un mécanicien expérimenté qui partage ce qu\'il sait vraiment, sans condescendance',
    cta: `Une question ou une pièce à trouver ? 👉 Lien en bio — rappel ou formulaire pièce`,
    contentAngles: [
      'Courroie de distribution : les signes d\'usure avant casse, les intervalles réels par type de moteur, ce qui arrive si on attend trop',
      'Diagnostic frein : comment distinguer plaquettes usées, disque voilé, ou étrier grippé — les vérifications concrètes à faire',
      'Filtre à huile : ce qu\'il y a à l\'intérieur d\'un Mann-Filter vs un générique, et ce qui se passe après 20 000 km avec le mauvais',
      'Batterie vs alternateur : comment diagnostiquer correctement lequel défaille — les tests que font les pros',
      'Suspension : symptômes d\'amortisseurs usés, rotules fatiguées, barre stabilisatrice — ce que le client décrit et ce que ça veut dire',
      'Filtre à air et consommation : l\'impact réel sur les performances et la conso, et quand insister auprès d\'un client qui refuse',
      'Bougies d\'allumage : iridium vs cuivre, les symptômes d\'usure, les intervalles selon le constructeur — ce que les garages ratent souvent',
      'Circuit de refroidissement : thermostat, pompe à eau, radiateur — ordre de défaillance typique et comment intervenir dans le bon ordre',
      'Vanne EGR : son rôle, comment l\'encrassement provoque la panne, quand nettoyer et quand remplacer définitivement',
      'Embrayage : comment diagnostiquer l\'usure avant rupture complète — ce que le client dit, ce que le mécanicien doit chercher',
    ],
  },
  {
    id: 'produit',
    label: 'Produit / Marque',
    weight: 2,
    tone: 'technique, précis, factuel — met en valeur la qualité avec des arguments concrets, pas des superlatifs',
    cta: `Tarifs B2B & catalogue → 👉 Lien en bio — formulaire compte pro`,
    contentAngles: [
      'Filtres Mann-Filter : ce qu\'il y a à l\'intérieur vs un générique — media filtrant, clapet de dérivation, tenue en pression',
      'Disques de frein Maxgear : traitement de surface, métallurgie, pourquoi ça dure plus longtemps qu\'un disque bas de gamme',
      'Kit courroie de distribution Gates : pourquoi remplacer tendeur + pompe à eau en même temps — l\'argument économique à expliquer au client',
      'Batteries Varta : ce que signifie le CCA (Cold Cranking Amps) dans un hiver belge, comment l\'expliquer à un client qui hésite',
      'Monroe vs KYB : la différence de comportement, confort vs tenue de route, quel amortisseur pour quel profil de conducteur',
      'Bilstein B4 vs B6 : remplacement d\'origine vs upgrade, pour quel client recommander l\'un plutôt que l\'autre',
      'Fusts d\'huile moteur : le calcul coût-par-litre pour un garage qui achète encore au détail — combien ça représente sur un an',
      'Batteries Bosch pour véhicules utilitaires : l\'argument de durabilité pour Sprinter, Crafter, Transit — ce que les flottes exigent',
      'Kits de filtration moteur Mahle : l\'application spécifique diesel vs essence, pourquoi le filtre adapté protège mieux',
      'Courroies Dayco vs Gates : où la différence de prix se justifie, où elle ne se justifie pas — la grille de décision honnête',
    ],
  },
  {
    id: 'b2b',
    label: 'Pro B2B',
    weight: 3,
    tone: 'direct, orienté ROI, sans langue de bois — parle d\'égal à égal avec des gérants de garage et responsables flotte qui n\'ont pas de temps à perdre',
    cta: `Un projet de partenariat ou une flotte à gérer ? 👉 Lien en bio — demandez un rappel commercial`,
    contentAngles: [
      'Le calcul ROI d\'un seul fournisseur fiable vs 4 fournisseurs tournants : temps perdu, erreurs, rappels de clients, vrai coût caché',
      'Gestion de flotte : comment un responsable de 50 véhicules suit les coûts pièces par unité, et ce que Mobility Parts change concrètement',
      'Le coût réel d\'une mauvaise pièce livrée : main d\'oeuvre perdue, client qui attend, re-commande, relationnel abîmé',
      'Ce que signifie un compte pro au quotidien : priorité de service, contact dédié, identification VIN sans erreur',
      'La référence introuvable : le scénario du Peugeot Expert bi-turbo 2009, de l\'Iveco Daily injecteur — comment on la trouve',
      'Stock urgent : la voiture bloquée, le client en attente depuis le matin — disponibilité locale et réponse le jour même',
      'Support devis avant commande : comment les garagistes utilisent Mobility Parts pour chiffrer un job avant de commander la pièce',
      'Pièces pour véhicules utilitaires : Sprinter, Crafter, Transit, Renault Master — la profondeur de catalogue que peu de distributeurs ont',
      'Pièces carrosserie : comment couvrir une réparation carrosserie complète via le même fournisseur que les pièces mécaniques',
      'Outillage professionnel : ponts élévateurs, outils de diagnostic, compresseurs — ce qu\'on peut équiper un atelier complet',
    ],
  },
  {
    id: 'promo',
    label: 'Promotion',
    weight: 1,
    tone: 'direct, concret, sense of opportunity — crée l\'envie d\'agir sans pression artificielle',
    cta: `Disponibilité & commande → 👉 Lien en bio — formulaire compte pro`,
    contentAngles: [
      'Préparation hiver : le check batterie + filtre habitacle + essuie-glaces — ce que les garages proposent en octobre et ce qu\'il faut avoir en stock',
      'Kit frein complet : l\'économie de commander disques + plaquettes ensemble vs séparément, et l\'argument pour le client final',
      'Kit courroie de distribution complet : le coût d\'un retour en atelier vs faire le kit entier du premier coup',
      'Fusts d\'huile : le garage qui a basculé sur l\'achat en fût et ce que ça a représenté sur sa marge annuelle',
      'Service printanier : filtre à air + filtre habitacle + bougies — ce qu\'on propose après l\'hiver et quand l\'aborder',
      'Compte pro flotte : ce que représente la discipline de prix pour un responsable de 30 à 150 véhicules',
      'Véhicules utilitaires : le segment Sprinter/Crafter/Transit que peu de distributeurs couvrent bien — et pourquoi c\'est une opportunité',
      'Outil de diagnostic : l\'outil qui se rembourse en 3 mois si on facture les diagnostics correctement',
      'Kit filtration moteur complet : toutes les pièces de la vidange en une seule commande, une seule livraison',
      'Références rapides : les pièces les plus commandées chaque semaine — disponibilité garantie, délai court',
    ],
  },
  {
    id: 'atelier',
    label: 'Vie Atelier',
    weight: 1,
    tone: 'authentique, humour sobre, entre pros — des situations que tout mécanicien reconnaît immédiatement',
    cta: `👉 Lien en bio`,
    contentAngles: [
      'Le lundi matin : 4 voitures en attente, 3 références urgentes différentes, et le fournisseur qui ne décroche pas',
      'La référence introuvable : le modèle que personne n\'a en stock, le coup de fil qui a tout réglé en 10 minutes',
      'Le vendredi soir : le tableau effacé, tous les jobs terminés, tous les clients appelés — cette satisfaction-là',
      'Le premier diagnostic solo de l\'apprenti : ce qu\'il a trouvé, ce qu\'il n\'a pas vu, ce que le chef a fait ensuite',
      'Le client certain que c\'était le moteur — c\'était un capteur à 40€. Comment expliquer sans vexer',
      'La mauvaise pièce livrée par l\'ancien fournisseur : le lundi que ça a causé, et pourquoi on a changé',
      'Deux mécaniciens, deux diagnostics différents sur la même voiture — le test qui a tranché',
      'Le garage qui travaillait avec 4 fournisseurs. Maintenant il en a un. Ce qui a changé',
      'La livraison arrivée avant le mécanicien : la voiture qui a pu démarrer dès 8h du matin',
      'Le mécanicien qui connaît toutes les références par coeur — et ce qui se passe quand il part en vacances',
    ],
  },
];

const WEIGHTED = PILLARS.flatMap(p => Array(p.weight).fill(p));

export function getNextPillar(postCount) {
  return WEIGHTED[postCount % WEIGHTED.length];
}

export function getPillarById(id) {
  return PILLARS.find(p => p.id === id) ?? PILLARS[0];
}

const IG_HASHTAG_SETS = [
  '#piecesauto #mecanicien #garage #bruxelles #mobilityparts #frein #carparts #garagiste',
  '#autoparts #reparationauto #belgique #mobilityparts #filtration #mecanique #carrepair #bxl',
  '#automotiveparts #garagiste #bruxelles #mobilityparts #distribution #pieceauto #b2bauto #technicien',
  '#piecesdetachees #mecanicien #belgique #mobilityparts #suspension #workshop #carparts #garagebelge',
  '#pieceauto #reparation #bxl #mobilityparts #moteur #autorepair #garagiste #aftermarket',
  '#carparts #mecanicien #bruxelles #mobilityparts #livraison #piecedetachee #garage #b2b',
  '#automotiveindustry #garagiste #belgique #mobilityparts #courroie #autoparts #technicien #pieceauto',
];

const FB_HASHTAG_SETS = [
  '#piecesauto #garage #bruxelles #mobilityparts #mecanique #garagiste',
  '#autoparts #carrepair #belgique #mobilityparts #piecedetachee #mecanicien',
  '#distribution #automotiveparts #bxl #mobilityparts #reparationauto #b2b',
];

export function getHashtags(platform, index) {
  const sets = platform === 'instagram' ? IG_HASHTAG_SETS : FB_HASHTAG_SETS;
  return sets[index % sets.length];
}

export const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&q=80',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1080&q=80',
  'https://images.unsplash.com/photo-1516382799247-87df95d790b7?w=1080&q=80',
  'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1080&q=80',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1080&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1080&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1080&q=80',
  'https://images.unsplash.com/photo-1600705722908-bae9c1cb4144?w=1080&q=80',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1080&q=80',
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=1080&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1080&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1080&q=80',
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1080&q=80',
  'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1080&q=80',
  'https://images.unsplash.com/photo-1676979842753-6ff97bb46e39?w=1080&q=80',
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1080&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1080&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45249d5f0?w=1080&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1080&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1080&q=80',
];
