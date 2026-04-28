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
- NO full human faces ever — frame from shoulders down, or hands only
- RAW AUTHENTICITY: show the unglamourized reality of daily mechanic work
- AVOID: straight tools (wrenches, rulers, screwdrivers) — they distort in AI. Instead use:
- BEST SUBJECTS for realism (choose what fits the post content):
  * A thick golden stream of motor oil being poured from a black container into an open engine, splash detail visible
  * Gloved hands lifting a brand-new brake disc from a cardboard box, workshop floor visible below
  * Close-up of an engine oil filler cap removed, oil residue around the opening, engine bay in background
  * A used vs new oil filter side by side on a greasy metal workbench, dramatic lighting
  * Stack of spare parts boxes — brake pads, filters, belts — neatly arranged at a garage entrance
  * A mechanic's forearm in a blue work uniform reaching deep into an engine bay, engine components surrounding
  * Coolant being poured into a translucent reservoir, vapor visible, green liquid
  * A dirty, oil-coated engine block close-up — valve cover gasket being replaced, hands just out of frame
  * Brake caliper removed and sitting on concrete floor next to a new replacement, workshop background
  * Battery terminals being connected — copper clamps, white oxide residue on old terminals, close-up
  * Timing belt laid flat on a workbench next to a worn one — texture contrast
  * Cardboard delivery boxes from Mobility Parts stacked at the open roll-up door of a garage, morning light
  * An engine air filter housing open, dirty filter being pulled out by gloved hands
  * Motor oil draining from a plug into a black pan, golden stream, workshop floor
  * Spark plugs lined up on a cloth — old carbon-coated next to new, close-up macro detail
- Canon EOS R5, 35mm lens, f/2.0, shallow depth of field — sharp on subject, bokeh background
- Harsh realistic workshop lighting: fluorescent overhead mixed with a bit of natural light through a roll-up door
- Colors: slightly desaturated, high contrast, gritty — grease blacks, steel greys, concrete floors, worn orange or green work uniforms visible at the edges
- Grain: slight photographic grain for authenticity
- Square 1:1 composition, tightly framed
- Photorealistic documentary photography — NOT stock photo, NOT AI-looking, NOT clean or staged
- No text, no logos, no watermarks

This should look like a photo a real mechanic posted on their Instagram stories — raw, honest, professional.

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
