import { FALLBACK_IMAGES } from './config.js';

const PEXELS_QUERIES = {
  tips: [
    'mechanic repairing car engine',
    'auto mechanic hands brake repair',
    'car workshop garage repair',
    'mechanic replacing car parts',
    'professional car maintenance',
  ],
  produit: [
    'car spare parts close up',
    'automotive engine components',
    'auto parts store',
    'car brake disc rotor',
    'automotive filters oil',
  ],
  b2b: [
    'automotive parts warehouse',
    'professional mechanic workshop',
    'car parts delivery logistics',
    'fleet vehicle maintenance',
    'auto parts wholesale',
  ],
  promo: [
    'mechanic tools garage',
    'car repair workshop',
    'automotive service center',
    'garage professional tools',
    'car parts workshop bench',
  ],
  atelier: [
    'car repair shop interior',
    'mechanic working on car',
    'professional garage workshop',
    'auto repair team',
    'mechanic lifting car',
  ],
};

async function searchPexels(pillarId) {
  const queries = PEXELS_QUERIES[pillarId] || PEXELS_QUERIES.tips;
  const query = queries[Math.floor(Math.random() * queries.length)];
  const page = Math.floor(Math.random() * 3) + 1;

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=${page}&orientation=square`;

  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);

  const data = await res.json();
  if (!data.photos?.length) throw new Error('Pexels: nessuna foto trovata');

  const photo = data.photos[Math.floor(Math.random() * data.photos.length)];
  const imageUrl = photo.src.large2x || photo.src.large;

  console.log(`  Pexels: "${query}" — ${photo.photographer} (${photo.url})`);
  return imageUrl;
}

export async function generateImage({ pillar }) {
  if (process.env.PEXELS_API_KEY) {
    try {
      const imageUrl = await searchPexels(pillar.id);
      return { imageUrl, provider: 'pexels' };
    } catch (err) {
      console.warn(`  ⚠ Pexels: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  console.warn('  ⚠ Fallback stock image utilisée');
  return { imageUrl, provider: 'fallback' };
}
