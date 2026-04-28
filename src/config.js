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
    imageScenes: [
      'close-up of mechanic hands replacing brake pads on a car wheel, caliper visible, professional workshop floor',
      'mechanic inspecting a worn timing belt next to a new one on a workbench, sharp detail',
      'technician changing spark plugs on an engine bay, ratchet in hand, focused expression',
      'close-up of hands draining old engine oil, oil filter being removed, workshop setting',
      'mechanic replacing a cabin air filter, glove compartment open, interior shot',
      'technician checking brake disc thickness with a calliper gauge, close-up precision shot',
      'mechanic replacing a front shock absorber, car on a hydraulic lift, European garage',
      'hands installing a new alternator on an engine bay, wiring visible, professional setting',
      'close-up of a mechanic bleeding brake fluid, transparent tube, focused detail',
      'technician replacing a serpentine belt, hand pointing at the routing path on engine',
      'mechanic inspecting suspension ball joints with a flashlight under the car',
      'hands fitting a new clutch disc onto the flywheel, transmission on workbench',
      'mechanic changing a headlight bulb, car hood open, modern LED bulb in hand',
      'technician replacing a water pump, coolant residue visible, engine bay detail',
      'close-up of hands checking battery terminals with a multimeter, garage background',
      'mechanic replacing windshield wiper blades in light rain, outdoor garage entrance',
      'hands fitting new brake discs on a hub, torque wrench in use, floor-level angle',
      'technician inspecting a CV joint boot for cracks, axle visible under lifted car',
      'mechanic replacing an oxygen sensor, exhaust pipe close-up, engine bay',
      'hands installing a new thermostat housing, coolant hoses visible, focused close-up',
    ],
  },
  {
    id: 'produit',
    label: 'Produit / Marque',
    weight: 2,
    tone: 'technique, précis, confiant — met en valeur la qualité et la fiabilité',
    cta: `Compte pro & tarifs B2B → 👉 Lien en bio`,
    imageScenes: [
      'new brake disc next to a heavily worn rusted one on a clean grey workbench, studio lighting',
      'set of 4 new spark plugs perfectly aligned on white background, macro close-up',
      'brand new air filter beside a clogged dirty one, split comparison, neutral background',
      'timing belt kit laid out on a workbench — belt, tensioner, water pump, all components',
      'new shock absorber standing upright next to a leaking old one, clean studio shot',
      'clutch kit components arranged on grey background — disc, pressure plate, bearing',
      'new vs old oil filter cut in half showing internal filter media comparison',
      'complete brake kit — discs and pads — in open branded packaging on workbench',
      'new alternator with copper windings visible, studio product shot on dark surface',
      'close-up of a new CV joint axle, polished chrome finish, workshop bench',
      'fuel pump assembly removed from tank, new unit alongside old corroded one',
      'new radiator on workbench, aluminium fins sharp and clean, side lighting',
      'suspension arm — new vs bent old one — side by side on clean metal surface',
      'set of new ignition coils in a row, close-up showing connector details',
      'new exhaust manifold gasket alongside a blown one, extreme macro detail',
      'EGR valve — new clean part vs carbon-clogged used part — stark comparison',
      'new starter motor on white background, technical product photography',
      'wheel bearing kit with all components spread on workshop mat, organised layout',
      'new turbocharger on dark surface, dramatic side lighting showing fins and housing',
      'lambda sensor new vs black sooty old one, close-up on the sensor tip',
    ],
  },
  {
    id: 'b2b',
    label: 'Pro B2B',
    weight: 2,
    tone: 'direct, orienté ROI, professionnel — parle aux gérants de garage et responsables flotte',
    cta: `Un projet de partenariat ou une flotte à gérer ? Parlons-en.\n📲 ${BRAND.contacts.sales}`,
    imageScenes: [
      'professional parts advisor handing a boxed auto part to a garage owner across a counter',
      'fleet of identical company vans parked in a row, mechanic with clipboard inspecting one',
      'garage owner and parts supplier shaking hands over an open laptop showing order catalog',
      'well-organised auto parts warehouse with tall shelving, worker with scanner picking an order',
      'mechanic in branded uniform receiving a delivery box, checking invoice on tablet',
      'two professionals discussing over an open car bonnet in a clean modern workshop',
      'parts department reception desk, advisor on phone, shelves of parts boxes behind',
      'mechanic scanning a VIN barcode on a car dashboard with a professional scanner',
      'overhead view of a workshop with multiple cars on lifts, team working simultaneously',
      'delivery driver handing stack of parts boxes to a smiling garage technician',
      'close-up of a professional account manager reviewing parts catalogue with garage owner',
      'rows of colour-coded parts boxes on organised shelving in a professional stockroom',
      'mechanic using a tablet to place a parts order while standing next to the vehicle',
      'professional invoice and parts boxes on a desk, business meeting context',
      'aerial view of a parts distribution centre, forklifts and organised pallets',
      'garage owner looking satisfied reviewing fast delivery of parts, morning light',
      'team of mechanics at weekly briefing in front of cars on lifts, manager speaking',
      'close-up of a professional loyalty card and parts catalogue on garage desk',
      'B2B account dashboard on laptop screen in foreground, blurred garage in background',
      'parts delivery van being loaded at warehouse at dawn, efficient logistics setting',
    ],
  },
  {
    id: 'promo',
    label: 'Promotion',
    weight: 2,
    tone: 'urgent, attractif, direct — crée le sentiment d\'opportunité',
    cta: `Commandez avant 18h → livraison J+1\n👉 Lien en bio`,
    imageScenes: [
      'brake kit — discs and pads — displayed on orange-accented workbench, price tag in frame',
      'stack of identical parts boxes ready for dispatch, orange label, warehouse background',
      'seasonal car maintenance kit spread on workbench — filters, oil, plugs — organised display',
      'close-up of a special offer sticker on a parts box, hands holding it up',
      'delivery box being opened revealing neatly packed auto parts, excitement moment',
      'car lifted with all four wheels off, fresh brake kit fitted all around, dramatic angle',
      'before/after comparison of a car wheel — rusty old brakes vs shiny new setup',
      'mechanic giving thumbs up next to a fully serviced car, satisfied customer visible',
      'workshop calendar showing service dates, parts boxes stacked next to it',
      'close-up of a hand placing a boxed part into a car boot next to other service items',
      'multiple parts with orange price tags arranged on a clean display shelf',
      'van loaded with labelled delivery boxes, driver smiling at camera, sunrise background',
      'car going up on a lift for a service, parts ready on a trolley beside it',
      'workshop board showing waiting vehicles list, organised busy garage atmosphere',
      'technician unboxing a new part, expression of quality approval, workshop setting',
      'parts laid out next to car before installation — preparation shot, clean composition',
      'mechanic checking off a service checklist, car in background, professional setting',
      'fresh parts kit on a workbench with a clock showing time — urgency composition',
      'end-of-day garage scene, satisfied team, completed service jobs board full',
      'customer receiving car keys after service, mechanic explaining completed work',
    ],
  },
  {
    id: 'atelier',
    label: 'Vie Atelier',
    weight: 1,
    tone: 'humour, proximité, authentique — ambiance garage, entre pros',
    cta: `👉 Lien en bio`,
    imageScenes: [
      'mechanics sharing a laugh during coffee break in the garage, cars on lifts behind them',
      'apprentice mechanic concentrating hard on first solo repair, mentor watching proudly',
      'team of mechanics posing in front of a freshly serviced car, arms crossed, proud',
      'candid shot of a mechanic covered in grease giving a thumbs up to camera',
      'garage dog sitting on a parts trolley, mechanics smiling around him',
      'mechanic discovering an unexpected part failure under a car, surprised expression',
      'team Friday afternoon — mechanics cleaning tools together, good atmosphere',
      'mechanic carefully writing on a repair order form, focused at the service desk',
      'morning opening of the garage — mechanics arriving, lights coming on, cars waiting',
      'mechanic FaceTiming a colleague to ask for technical advice while under a car',
      'garage radio on loud, mechanic dancing slightly while working on an engine',
      'end of a long day — mechanic washing hands, satisfied look at completed jobs board',
      'mechanic explaining a worn part to a curious customer, educational moment',
      'two mechanics debating over a technical manual, pointing at different pages',
      'apprentice making first coffee for the team, garage morning ritual',
      'mechanic having lunch on workshop bench surrounded by parts, authentic moment',
      'team celebrating successful complex repair, high fives in the workshop',
      'mechanic surprised by unusual car modification discovered during service',
      'garage owner walking the floor, checking on all the bays, morning rounds',
      'mechanic carefully labelling and bagging removed parts for customer inspection',
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
