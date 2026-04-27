import Anthropic from '@anthropic-ai/sdk';
import { BRAND, getHashtags } from './config.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateCaption({ pillar, platform, hashtagIndex }) {
  const platformRules = platform === 'instagram'
    ? `- 1 à 3 phrases, hook ultra-fort sur la première ligne (visible sans "voir plus")
- 150 caractères max avant les hashtags
- 1-2 emojis max, pertinents`
    : `- 3 à 5 phrases, légèrement plus développé qu'Instagram
- Ton communautaire, peut poser une question à la fin
- 2-3 emojis max`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `Tu es le copywriter de Mobility Parts, distributeur B2B de pièces auto à Bruxelles.
Brand: ${BRAND.delivery} | ${BRAND.references} | Identification VIN ${BRAND.vin_rate}

Règles absolues sur les contacts:
- Pour TOUT contact client (RDV, dispo, commande, question) → toujours utiliser le numéro shop: ${BRAND.contacts.shop}
- Ne JAMAIS écrire "SAV", "service après-vente" ou "service client" dans un post — le SAV est un contact interne
- Ne JAMAIS inventer un contact ou un numéro — utiliser uniquement le CTA fourni`,
    messages: [{
      role: 'user',
      content: `Rédige une caption ${platform} pour le pilier "${pillar.label}".

Ton: ${pillar.tone}
CTA à inclure en fin de post: ${pillar.cta}

Règles:
${platformRules}
- Langue: français
- Pas de hashtags (ajoutés automatiquement)
- Format: texte brut uniquement

Rédige uniquement la caption.`,
    }],
  });

  const text = message.content[0].text.trim();
  const hashtags = getHashtags(platform, hashtagIndex);

  return {
    caption: `${text}\n\n${hashtags}`,
    text,
  };
}
