export const BRAND = {
  name: 'Mobility Parts',
  tagline: 'Votre distributeur B2B de pièces auto à Bruxelles',
  delivery: 'Livraison J+1 (commande avant 18h)',
  references: '5M+ références',
  vin_rate: '99.9%',
  contacts: {
    // Support post-vente : retours, suivi livraison, notes de crédit, réclamations
    sav: '+32 480 20 64 10 (disponible via WhatsApp)',
    // Premier contact client : RDV, disponibilité, recherche pièces, commandes, toutes demandes
    shop: 'wa.me/32470134550',
    // Responsable partenariats & grands comptes B2B (flottes, revendeurs) — ne pas mentionner CEO
    sales: 'wa.me/32475204638',
  },
  catalog: 'mobility-parts-eu.odoo.com/formulaire-compte-pro',
};

export const PILLARS = [
  {
    id: 'tips',
    label: 'Conseil Méca',
    weight: 3,
    tone: 'expert, pédagogue, accessible — comme un mecanicien qui explique à un confrère',
    cta: `Une question ou un RDV ? 👉 Lien en bio`,
    imageStyle: 'mechanic working on a car engine, professional workshop, detailed close-up of hands and tools',
  },
  {
    id: 'produit',
    label: 'Produit / Marque',
    weight: 2,
    tone: 'technique, précis, confiant — met en valeur la qualité et la fiabilité',
    cta: `5M+ références disponibles\n🔗 ${BRAND.catalog}`,
    imageStyle: 'automotive spare part on clean white background, studio lighting, professional product photography',
  },
  {
    id: 'b2b',
    label: 'Pro B2B',
    weight: 2,
    tone: 'direct, orienté ROI, professionnel — parle aux gérants de garage et responsables flotte',
    cta: `Un projet de partenariat ou une flotte à gérer ? Parlons-en.\n📲 ${BRAND.contacts.sales}`,
    imageStyle: 'professional auto parts warehouse, organized shelves, business setting, Bruxelles',
  },
  {
    id: 'promo',
    label: 'Promotion',
    weight: 2,
    tone: 'urgent, attractif, direct — crée le sentiment d\'opportunité',
    cta: `Commandez avant 18h → livraison J+1\n👉 Lien en bio`,
    imageStyle: 'automotive parts with orange accent lighting, promotional photography, dynamic composition',
  },
  {
    id: 'atelier',
    label: 'Vie Atelier',
    weight: 1,
    tone: 'humour, proximité, authentique — ambiance garage, entre pros',
    cta: `👉 Lien en bio`,
    imageStyle: 'busy car repair workshop atmosphere, mechanics at work, authentic garage environment',
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
  '#piecesauto #garage #mecanique #bruxelles #mobilityparts #carparts #autoparts #technicien',
  '#piecesdetachees #carrepair #mecanicien #workshop #belgique #mobilityparts #voiture #garage',
  '#automotiveparts #carpartsbelgium #mecaauto #bxl #mobilityparts #pieceauto #livraisonauto #b2bauto',
];

const FB_HASHTAG_SETS = [
  '#piecesauto #garage #bruxelles #mobilityparts #mecanique',
  '#autoparts #carrepair #belgique #mobilityparts #piecedetachee',
];

export function getHashtags(platform, index) {
  const sets = platform === 'instagram' ? IG_HASHTAG_SETS : FB_HASHTAG_SETS;
  return sets[index % sets.length];
}

// Fallback stock images si Replicate et Stability échouent
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
