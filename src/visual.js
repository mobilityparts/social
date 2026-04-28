import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { FALLBACK_IMAGES } from './config.js';

async function buildImagePrompt(captionText, pillar) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `Write a DALL-E 3 image prompt for an Instagram post from Mobility Parts, a professional auto parts distributor in Brussels.

Post content: ${captionText.slice(0, 200)}
Pillar: ${pillar.label}

Rules:
- Ultra photo-realistic, DSLR quality
- Professional European garage or workshop setting
- Auto parts or mechanics IN ACTION (not posed)
- Clean, neutral lighting, no color casts
- Square composition, Instagram-ready
- No text, no logos, no watermarks
- Real people only if needed, realistic skin tones

Reply with ONLY the prompt, nothing else.`,
    }],
  });
  return msg.content[0].text.trim();
}

async function generateWithDallE(prompt) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  });
  return response.data[0].url;
}

export async function generateImage({ pillar, captionText }) {
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = await buildImagePrompt(captionText || '', pillar);
      console.log(`  DALL-E 3 prompt: ${prompt.slice(0, 90)}...`);
      const imageUrl = await generateWithDallE(prompt);
      return { imageUrl, prompt, provider: 'dalle3' };
    } catch (err) {
      console.warn(`  ⚠ DALL-E 3: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  console.warn('  ⚠ Fallback stock image utilisée');
  return { imageUrl, provider: 'fallback' };
}
