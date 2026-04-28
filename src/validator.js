import chalk from 'chalk';

const RULES = [
  {
    id: 'no-ceo',
    desc: 'Mention CEO/directeur général interdite',
    check: ({ caption }) =>
      /\bceo\b|directeur\s+g[eé]n[eé]ral/i.test(caption),
  },
  {
    id: 'no-shop-number-direct',
    desc: 'Numéro shop direct interdit — utiliser "👉 Lien en bio"',
    check: ({ caption }) =>
      caption.includes('32470134550') || caption.includes('+32 470') || caption.includes('470 13'),
  },
  {
    id: 'sav-only-postsale',
    desc: 'SAV cité dans un post qui ne concerne pas le post-vente',
    check: ({ caption, pillar }) => {
      const postsalePillars = ['sav'];
      if (postsalePillars.includes(pillar)) return false;
      const hasSav = /\bsav\b/i.test(caption);
      const isPostsaleContext = /retour|livraison|note.{0,5}cr[eé]dit|r[eé]clamation/i.test(caption);
      return hasSav && !isPostsaleContext;
    },
  },
  {
    id: 'has-cta',
    desc: 'Aucun CTA trouvé dans la caption',
    check: ({ caption }) =>
      !caption.includes('👉') && !caption.includes('📲') && !caption.includes('🔗'),
  },
  {
    id: 'has-hashtags',
    desc: 'Pas de hashtags dans la caption',
    check: ({ caption }) => !caption.includes('#mobilityparts'),
  },
  {
    id: 'instagram-length',
    desc: 'Caption Instagram > 2200 caractères',
    check: ({ caption, platform }) =>
      platform === 'instagram' && caption.length > 2200,
  },
  {
    id: 'facebook-length',
    desc: 'Caption Facebook > 500 mots — trop long',
    check: ({ caption, platform }) =>
      platform === 'facebook' && caption.split(/\s+/).length > 500,
  },
  {
    id: 'no-fake-number',
    desc: 'Numéro de téléphone inventé détecté',
    check: ({ caption }) => {
      // Allow only known numbers
      const allowed = ['32480206410', '32475204638', '+32 480 20 64 10'];
      const found = caption.match(/(?:\+32|0032|032)[\s.]?\d{3}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}/g) || [];
      return found.some(n => !allowed.some(a => n.replace(/\s/g, '').includes(a.replace(/\s/g, ''))));
    },
  },
  {
    id: 'no-supplier-names',
    desc: 'Nom du réseau distributeur cité (Auto Partner / IDIR ne doivent pas apparaître)',
    check: ({ caption }) =>
      /\bauto\s*partner\b|\bidir\b/i.test(caption),
  },
];

export function validatePost({ caption, pillar, platform }) {
  const failures = RULES
    .filter(rule => rule.check({ caption, pillar, platform }))
    .map(rule => rule.desc);

  return {
    valid: failures.length === 0,
    failures,
  };
}

export function logValidation({ caption, pillar, platform }) {
  const { valid, failures } = validatePost({ caption, pillar, platform });

  if (valid) {
    console.log(chalk.green(`  ✓ Validation OK [${platform}]`));
  } else {
    console.log(chalk.red(`  ✗ Validation échouée [${platform}]:`));
    failures.forEach(f => console.log(chalk.red(`    — ${f}`)));
  }

  return { valid, failures };
}
