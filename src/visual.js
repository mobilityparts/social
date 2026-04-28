import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

const SHOT_STYLES = [
  'extreme macro close-up, f/1.8, only the subject sharp, everything else dissolved into bokeh',
  'dramatic low-angle shot, camera near floor level looking up, industrial ceiling visible',
  'overhead flat-lay, directly above, perfect square, parts arranged on oily workshop floor',
  'cinematic wide shot, subject small in frame, full garage environment surrounding it',
  'split-second action — liquid mid-pour or part mid-installation, slight motion blur on edges',
  'moody single hard light from left, deep shadows on right, high contrast chiaroscuro',
  'documentary candid — imperfect, slightly asymmetric framing, feels caught not staged',
  'dawn golden light through open roll-up door, long shadows, warm backlight on subject',
  'tight environmental — subject fills 70% of frame, authentic workspace visible around it',
  'before/after juxtaposition — worn part and new part side by side, stark visual contrast',
];

async function buildImagePrompt(captionText, pillar, postCount) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const shotStyle = SHOT_STYLES[postCount % SHOT_STYLES.length];

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    messages: [{
      role: 'user',
      content: `You are a creative director for a B2B automotive brand. Write a FLUX image prompt for Instagram post #${postCount + 1} from Mobility Parts (auto parts distributor, Brussels).

Post content: ${captionText.slice(0, 200)}
Pillar: ${pillar.label}
Required shot style: ${shotStyle}

CREATIVE MISSION: Imagine a unique, visually striking scene from the real world of auto parts or garage work. Go beyond the obvious — think about textures (worn gaskets, oily metal, concrete floors), light (steam from coolant, glint on chrome parts, fluorescent on steel shelving), scale (macro on a spark plug tip, wide shot of a full stockroom), moments (a delivery at dawn, hands sorting references, oil mid-drain).

HARD RULES:
- NO full human faces — hands, forearms, silhouettes at most
- ONE coherent scene — never combine unrelated objects
- NO logos, text or brand names on any surface — all packaging plain unbranded cardboard
- Photorealistic, NOT illustrated, NOT CGI
- Slight grain, authentic workshop lighting, gritty desaturated palette
- Square 1:1 composition

Reply with ONLY the prompt — 2-3 vivid, specific sentences.`,
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
