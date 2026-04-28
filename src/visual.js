import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

const SHOT_STYLES = [
  'close-up of mechanic hands with a specific tool working on a clearly identifiable automotive part, natural fluorescent workshop light',
  'side-by-side on a metal workbench: worn/damaged part next to its brand-new replacement, flat neutral light, no background clutter',
  'overhead flat-lay of parts and tools laid out on a clean shop rag before installation, workbench surface showing real use',
  'wide shot of a car on a hydraulic lift in a European garage, mechanic visible from waist down or from behind only',
  'tight shot of a specific part mid-removal or mid-installation, identifiable European vehicle visible in background (Golf, Peugeot, Sprinter…)',
  'professional stockroom: rows of plain cardboard boxes on steel shelving, reference labels visible, realistic warehouse lighting',
  'mechanic checking a reference on a phone or tablet beside an open car hood — documentary, caught-in-the-act framing',
  'new part partially out of its plain unbranded cardboard packaging on a workbench, garage environment soft-focused behind',
  'educational close-up of a failed/worn part showing damage clearly — cracked rubber, scored metal, rust — diagnostic shot',
  'early morning garage scene: parts boxes stacked near a van or workbench, daylight just coming through the open roll-up door',
];

async function buildImagePrompt(captionText, pillar, postCount) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const shotStyle = SHOT_STYLES[postCount % SHOT_STYLES.length];

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 280,
    messages: [{
      role: 'user',
      content: `You are a photo editor for a B2B automotive trade account on Instagram. Write a FLUX image generation prompt for post #${postCount + 1} from Mobility Parts (auto parts distributor, Brussels).

Post content: ${captionText.slice(0, 200)}
Pillar: ${pillar.label}
Required shot: ${shotStyle}

WHAT TO SHOOT: Think like a mechanic who takes a photo in his own garage and posts it. Real parts that any professional would recognize immediately — brake disc, timing belt, oil filter, wheel bearing, alternator, air filter. Real workshop environment — hydraulic lift, concrete floor, steel tool chest, fluorescent tubes, metal workbench. European garage aesthetic (VW, Peugeot, Renault, Sprinter context when vehicles are visible).

LIGHTING: Natural workshop light ONLY — fluorescent overhead tubes or daylight through an open garage door. No dramatic shadows, no studio strobes, no atmospheric haze.

HARD RULES:
- NO full human faces — hands, forearms, silhouettes from behind at most
- ONE coherent subject — a specific real automotive part in a real context
- NO logos, text or brand names on any surface — all packaging is plain unbranded cardboard
- Photorealistic DSLR quality — NOT illustrated, NOT CGI, NOT cinematic
- NO artificial smoke, fog, steam or atmospheric effects
- Slight natural grain, honest colours, not heavily graded
- Square 1:1 composition

Reply with ONLY the prompt — 2-3 specific, grounded sentences. Name the exact part. Name the exact context.`,
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

export async function generateImage({ pillar, captionText, postCount }) {
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const prompt = await buildImagePrompt(captionText || '', pillar, postCount || 0);
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
