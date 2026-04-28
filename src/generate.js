import Anthropic from '@anthropic-ai/sdk';
import { BRAND, getHashtags } from './config.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const HOOK_STYLES = [
  'Open with a specific real scenario a garage owner faces: wrong part delivered, client waiting, pressure',
  'Open with a concrete operational fact about speed or accuracy that changes a mechanic\'s day',
  'Open with a sharp question about a daily frustration: sourcing, availability, delivery delays',
  'Open with a short statement that reframes how garages think about their parts supplier',
  'Open with a number or stat that creates instant credibility with a professional audience',
  'Open with "Tu commandes X, tu reçois Y, en J+1" — a concrete delivery or sourcing scenario',
];

const BRAND_STRATEGY = `
YOU ARE: A senior B2B marketing strategist with 15 years in automotive aftermarket. You write copy that makes garage owners stop scrolling, nod, and DM for a quote.

MOBILITY PARTS — WHO THEY REALLY ARE:
Not a catalog. Not a warehouse. A PARTNER. Mobility Parts is the B2B operation that independent Belgian garages call when they need the right part, right now, no mistakes. Their value isn't price — it's RELIABILITY and SPEED in a sector where one wrong part = one angry client = one lost account.

WHAT THEY ACTUALLY DO (make this feel real in every post):
- They SEARCH the right part by VIN — 99.9% accuracy means the mechanic gets exactly what fits, first time
- They DELIVER to the garage door, next day, if ordered before 18:00
- They're AVAILABLE to answer part compatibility questions in real time — like an expert on call
- They QUOTE fast — a garage can get a parts estimate before they even call their client back
- They stock 5M+ references — independent garages don't need 3 suppliers anymore

TARGET (write FOR them, not AT them):
- Independent garage owner in Belgium: 2-5 mechanics, fighting margins, needs reliable suppliers
- Fleet manager: 30-150 vehicles, zero tolerance for wrong parts or delays
- Auto parts reseller: needs a wholesaler with depth and delivery discipline
- Their real pain: wasted time on wrong deliveries, hunting rare references, suppliers that don't pick up

WHAT MAKES THEM CHOOSE MOBILITY PARTS (not features — emotions + logic combined):
- "I ordered at 17:30 and it was there at 8am" — reliability creates loyalty
- "They found the right alternator for a 2009 Peugeot Expert with the twin-turbo engine, first try" — expertise builds trust
- "I used to call 4 suppliers. Now I call one." — simplicity has value

CONTENT MISSION:
Every post must do ONE of these three things:
1. EDUCATE → give mechanics knowledge that makes their job easier (builds authority)
2. DEMONSTRATE → show the operational reality of Mobility Parts (builds desire)
3. CONVERT → create urgency for garages to open a pro account (drives action)

TONE BIBLE:
✓ Direct, concrete, expert — like a colleague who has 20 years in parts distribution
✓ Belgian/French market tone — professional but not cold, human but not informal
✓ Specific > vague. Always. "Livraison à 8h15" beats "livraison rapide"
✗ Never: "passionné", "qualité garantie", "à votre service", "nous sommes là pour vous"
✗ Never: generic adjectives without proof — "fiable", "rapide" without a specific fact
✗ Never: brand name as opener ("Chez Mobility Parts, ...")`;

export async function generateCaption({ pillar, platform, hashtagIndex }) {
  const hookStyle = HOOK_STYLES[Math.floor(Math.random() * HOOK_STYLES.length)];

  const platformRules = platform === 'instagram'
    ? `INSTAGRAM FORMAT:
- Max 4 lines total
- Line 1 (THE HOOK): must stop the scroll — max 85 characters, no fluff, instant value
- Lines 2-3: the proof, the operational detail, the insight — specific and concrete
- Line 4: the CTA
- 1-2 emojis maximum — only if they add meaning, not decoration
- NO bullet points, NO pipes (|), NO dashes as separators`
    : `FACEBOOK FORMAT:
- 5-7 sentences, can develop a mini-story or scenario
- More conversational, can end with a question to drive comments
- 2-3 emojis max`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: `${BRAND_STRATEGY}

CONTACT RULES (strict — never invent a number or URL):
- First contact, quote request, part search, order → ONLY: "👉 Lien en bio"
- Return, delivery issue, credit note → SAV: ${BRAND.contacts.sav}
- Partnership, fleet contract, major B2B → ${BRAND.contacts.sales} (NEVER write "CEO" or "directeur")
- Only mention SAV when the post topic is explicitly after-sales or billing

ABSOLUTE NO-GO:
- No URLs anywhere in the caption (no odoo.com, no wa.me, nothing)
- No markdown (**, __, #headers)
- No "Chez Mobility Parts" opener
- No vague marketing language without proof
- No mention of management titles`,

    messages: [{
      role: 'user',
      content: `Write a caption in French for pillar: "${pillar.label}"

Hook approach: ${hookStyle}
Pillar tone: ${pillar.tone}
End with this CTA: ${pillar.cta}

${platformRules}

Plain text only. No markdown. No hashtags. Write ONLY the caption.`,
    }],
  });

  const raw = message.content[0].text.trim();
  const text = raw
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/_{2}(.*?)_{2}/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  const hashtags = getHashtags(platform, hashtagIndex);

  return {
    caption: `${text}\n\n${hashtags}`,
    text,
  };
}
