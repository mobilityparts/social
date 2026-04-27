import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function buildFluxPrompt(pillar, captionText) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `Write a FLUX image generation prompt for a Mobility Parts (auto parts distributor, Brussels) social media post.

Pillar: ${pillar.label}
Visual style hint: ${pillar.imageStyle}
Caption context: ${captionText.slice(0, 120)}

Requirements:
- Professional commercial photography style
- Square 1:1 format, Instagram-ready
- Orange accent color (#F97316) in the scene if natural
- No text, no logos, no watermarks
- High quality, sharp, well-lit

Reply with ONLY the prompt (no explanation).`,
    }],
  });
  return message.content[0].text.trim();
}

async function generateWithReplicate(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        num_outputs: 1,
        output_format: 'jpg',
        output_quality: 85,
        go_fast: true,
      },
    }),
  });

  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);

  const prediction = await res.json();
  if (prediction.status === 'succeeded') return prediction.output[0];
  return await pollReplicate(prediction.urls.get);
}

async function pollReplicate(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') return data.output[0];
    if (data.status === 'failed') throw new Error(`Replicate prediction failed: ${data.error}`);
  }
  throw new Error('Replicate timed out');
}

async function generateWithStability(prompt) {
  const form = new FormData();
  form.append('prompt', prompt);
  form.append('aspect_ratio', '1:1');
  form.append('output_format', 'jpeg');

  const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      Accept: 'application/json',
    },
    body: form,
  });

  if (!res.ok) throw new Error(`Stability ${res.status}: ${await res.text()}`);

  const data = await res.json();
  // Returns base64 image — upload to imgbb to get a public URL
  return await uploadToImgbb(data.image);
}

async function uploadToImgbb(base64) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error('IMGBB_API_KEY manquant pour héberger l\'image Stability AI');

  const form = new FormData();
  form.append('key', key);
  form.append('image', base64);

  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error(`imgbb ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data.url;
}

export async function generateImage({ pillar, captionText, postCount }) {
  const prompt = await buildFluxPrompt(pillar, captionText);
  console.log(`  FLUX prompt: ${prompt.slice(0, 90)}...`);

  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const imageUrl = await generateWithReplicate(prompt);
      return { imageUrl, prompt, provider: 'replicate' };
    } catch (err) {
      console.warn(`  ⚠ Replicate: ${err.message}`);
    }
  }

  if (process.env.STABILITY_API_KEY) {
    try {
      const imageUrl = await generateWithStability(prompt);
      return { imageUrl, prompt, provider: 'stability' };
    } catch (err) {
      console.warn(`  ⚠ Stability: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[postCount % FALLBACK_IMAGES.length];
  console.warn(`  ⚠ Fallback stock image utilisée`);
  return { imageUrl, prompt, provider: 'fallback' };
}
