import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

async function buildImagePrompt(captionText, pillar) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Write a FLUX image generation prompt for an Instagram post from Mobility Parts, a B2B auto parts distributor in Brussels.

Post content: ${captionText.slice(0, 200)}
Pillar: ${pillar.label}

STRICT VISUAL RULES:
- NO human faces, NO people — focus entirely on parts, products, environment
- Documentary photojournalism style: raw, real, unglamourized
- Show the OPERATIONAL REALITY: auto parts on shelves, parts being delivered in boxes, spare parts laid out on a workbench, engine components close-up, parts catalog or scanner, delivery boxes at a garage door, mechanic tools and hardware
- Canon EOS R5, 35mm or 50mm lens, f/2.8, natural or workshop fluorescent lighting
- Shallow depth of field, sharp focus on the subject
- Neutral, slightly desaturated colors — real workshop environment, no artificial warmth
- Square 1:1 composition, Instagram-ready
- Hyper-realistic photography — NOT illustrated, NOT CGI, NOT painted, NOT AI-looking
- No text, no logos, no watermarks, no brand identifiers

Focus on what Mobility Parts actually does: sourcing, delivering, stocking the right automotive parts.

Reply with ONLY the prompt, nothing else.`,
    }],
  });
  return msg.content[0].text.trim();
}

async function generateWithFluxPro(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
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
        output_format: 'jpg',
        output_quality: 90,
        safety_tolerance: 2,
        prompt_upsampling: true,
      },
    }),
  });

  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);

  const prediction = await res.json();
  if (prediction.status === 'succeeded') return prediction.output;
  return await pollReplicate(prediction.urls.get);
}

async function pollReplicate(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed') throw new Error(`Replicate failed: ${data.error}`);
  }
  throw new Error('Replicate timeout');
}

export async function generateImage({ pillar, captionText }) {
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const prompt = await buildImagePrompt(captionText || '', pillar);
      console.log(`  FLUX Pro prompt: ${prompt.slice(0, 90)}...`);
      const imageUrl = await generateWithFluxPro(prompt);
      return { imageUrl, prompt, provider: 'flux-pro' };
    } catch (err) {
      console.warn(`  ⚠ FLUX Pro: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  console.warn('  ⚠ Fallback stock image utilisée');
  return { imageUrl, provider: 'fallback' };
}
