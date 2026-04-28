import Anthropic from '@anthropic-ai/sdk';
import { BRAND, getHashtags } from './config.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const HOOK_STYLES = [
  'Open with a specific problem a mechanic faced this week — make it feel real and relatable',
  'Open with a counter-intuitive or surprising fact about a common car issue',
  'Open with a direct provocative question that challenges how garages currently work',
  'Open with a short sharp statement that instantly creates urgency or curiosity (max 8 words)',
  'Open with a concrete scenario: "Un client arrive avec X, tu commandes Y, et..."',
  'Open with a number or stat that immediately establishes credibility',
];

const BRAND_STRATEGY = `
BRAND POSITIONING:
Mobility Parts is THE reliable B2B partner for independent garages, fleet managers and resellers in Brussels and Belgium. Not a marketplace, not a big-box retailer — a precision parts specialist that mechanics trust when they can't afford to be wrong.

TARGET AUDIENCE (speak directly to them):
- Independent garage owners: 1-5 mechanics, stressed about margins, delivery delays, wrong parts
- Fleet managers: managing 20-200 vehicles, need reliability above everything
- Auto parts resellers: need a wholesaler with depth of catalog and fast fulfillment
- Their core fear: ordering the wrong part, wasting time, disappointing their client

KEY DIFFERENTIATORS (use sparingly but precisely):
- 99.9% VIN identification accuracy → they get the RIGHT part, FIRST time, every time
- 5M+ references → they find what they need without calling 6 suppliers
- Next-day delivery before 18:00 → their client's car is done by tomorrow
- Brussels-based → local, fast, human support — not a call center abroad

PSYCHOLOGY OF THE TARGET:
- Mechanics respect expertise and concrete facts — not marketing fluff
- They're skeptical of suppliers who overpromise
- They share useful content with colleagues (= organic reach)
- B2B buyers on Instagram are in discovery mode — they're not ready to buy yet, but the right post makes them think "I should try these guys"

CONTENT OBJECTIVES (prioritized):
1. Build TRUST → position as the expert partner who understands their job
2. Generate DESIRE → make them want the reliability Mobility Parts offers
3. Drive ACTION → get them to click the link in bio (WhatsApp)

TONE: Direct, expert, peer-to-peer. Like a trusted colleague who also happens to run a parts distribution operation. Never corporate. Never generic. Always specific.`;

export async function generateCaption({ pillar, platform, hashtagIndex }) {
  const hookStyle = HOOK_STYLES[Math.floor(Math.random() * HOOK_STYLES.length)];

  const platformRules = platform === 'instagram'
    ? `FORMAT (Instagram):
- 3-4 lines max total
- Line 1: THE HOOK — must stop the scroll, visible before "see more", max 90 characters
- Lines 2-3: 1-2 punchy sentences that deliver the value or insight
- Last line: the CTA
- 1-2 emojis max, placed where they add meaning — not decorative`
    : `FORMAT (Facebook):
- 4-6 sentences
- More developed than Instagram, can tell a mini-story
- Can ask a question at the end to drive comments
- 2-3 emojis max`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: `You are the lead copywriter for Mobility Parts, a B2B auto parts distributor in Brussels.
${BRAND_STRATEGY}

CONTACT RULES (non-negotiable):
- First contact, appointment, part search, order → ONLY "👉 Lien en bio" (WhatsApp link is in bio)
- Return, delivery follow-up, credit note → SAV: ${BRAND.contacts.sav}
- Partnership, fleet deal, major account → ${BRAND.contacts.sales} (NEVER write "CEO" or "directeur général")
- Only mention SAV when post is explicitly about after-sales or billing issues

ABSOLUTE PROHIBITIONS:
- No URLs in the caption (no odoo.com, no wa.me, nothing)
- No markdown formatting (no **, no __, no #headers)
- No "Chez Mobility Parts" as opener
- No "qualité garantie", "service impeccable", "nous sommes là pour vous", "passionnés"
- No bullet lists separated by | or •
- No vague adjectives: "rapide", "fiable", "efficace" without concrete evidence
- No mention of CEO, director, or management roles`,

    messages: [{
      role: 'user',
      content: `Write a caption in French for pillar: "${pillar.label}"

Hook approach: ${hookStyle}
Pillar tone: ${pillar.tone}
CTA to end with: ${pillar.cta}

${platformRules}

Write ONLY the caption. Plain text. No markdown. No hashtags.`,
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
