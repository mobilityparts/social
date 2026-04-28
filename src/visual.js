import { FALLBACK_IMAGES } from './config.js';

const PEXELS_QUERIES = {
  tips:    ['car mechanic', 'auto repair', 'mechanic engine', 'car maintenance'],
  produit: ['car engine', 'mechanic tools', 'auto parts', 'car hood engine'],
  b2b:     ['car repair shop', 'automobile garage', 'mechanic team', 'auto service'],
  promo:   ['car workshop', 'mechanic working', 'garage repair', 'car service garage'],
  atelier: ['mechanic', 'car repair', 'auto workshop', 'mechanic hands car'],
};

async function searchPexels(pillarId) {
  const queries = PEXELS_QUERIES[pillarId] || PEXELS_QUERIES.tips;
  const query = queries[Math.floor(Math.random() * queries.length)];

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=1&orientation=square`;

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
