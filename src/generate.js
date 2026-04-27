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

Règles sur les contacts (ne jamais inventer un numéro — utiliser uniquement le CTA fourni):
- RDV, disponibilité, recherche pièce, commande, premier contact → shop: ${BRAND.contacts.shop}
- Retour, suivi livraison, note de crédit, problème facturation → SAV: ${BRAND.contacts.sav}
- Partenariat, flotte, grand compte B2B → responsable: ${BRAND.contacts.sales} (ne jamais écrire "CEO")
- Ne pas mentionner le SAV si le contenu du post ne concerne pas le post-vente ou la comptabilité`,
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
