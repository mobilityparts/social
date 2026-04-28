import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

const PILLAR_FALLBACK_QUERIES = {
  tips:    ['car mechanic', 'auto repair', 'mechanic engine', 'car maintenance'],
  produit: ['car engine', 'mechanic tools', 'auto parts', 'car hood engine'],
  b2b:     ['car repair shop', 'automobile garage', 'mechanic team', 'auto service'],
  promo:   ['car workshop', 'mechanic working', 'garage repair', 'car service garage'],
  atelier: ['mechanic', 'car repair', 'auto workshop', 'mechanic hands car'],
};

async function buildPexelsQuery(captionText, pillarId) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const queries = PILLAR_FALLBACK_QUERIES[pillarId] || PILLAR_FALLBACK_QUERIES.tips;
    return queries[Math.floor(Math.random() * queries.length)];
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 20,
    messages: [{
      role: 'user',
      content: `Based on this Instagram post for an auto parts distributor, write a 2-3 word Pexels photo search query in English that matches the visual subject. Only output the query, nothing else.

Post: ${captionText.slice(0, 200)}`,
    }],
  });

  return msg.content[0].text.trim().replace(/["""]/g, '').slice(0, 50);
}

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=1&orientation=square`;

  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);

  const data = await res.json();
  if (!data.photos?.length) throw new Error(`Pexels: nessuna foto per "${query}"`);

  const photo = data.photos[Math.floor(Math.random() * data.photos.length)];
  const imageUrl = photo.src.large2x || photo.src.large;

  console.log(`  Pexels: "${query}" — ${photo.photographer}`);
  return imageUrl;
}

export async function generateImage({ pillar, captionText }) {
  if (process.env.PEXELS_API_KEY) {
    try {
      const query = await buildPexelsQuery(captionText || '', pillar.id);
      const imageUrl = await searchPexels(query);
      return { imageUrl, provider: 'pexels' };
    } catch (err) {
      console.warn(`  ⚠ Pexels: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  console.warn('  ⚠ Fallback stock image utilisée');
  return { imageUrl, provider: 'fallback' };
}
