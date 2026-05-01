import 'dotenv/config';
import chalk from 'chalk';
import { getNextPillar, getPillarById } from './config.js';
import { generateCaption, generateHeadline } from './generate.js';
import { generateImage } from './visual.js';
import { renderBrandedImage } from './render.js';
import { uploadImage } from './upload.js';
import { publishToInstagram, publishToFacebook } from './meta.js';
import { getRealPostCount, getHashtagIndex, logPost } from './logger.js';
import { logValidation } from './validator.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const pilierArg = args.includes('--pilier') ? args[args.indexOf('--pilier') + 1] : null;
const platforms = args.includes('--platform')
  ? args[args.indexOf('--platform') + 1].split(',').map(p => p.trim())
  : ['instagram', 'facebook'];

async function run() {
  const postCount = getRealPostCount();
  const hashtagIndex = getHashtagIndex();
  const pillar = pilierArg ? getPillarById(pilierArg) : getNextPillar(postCount);

  console.log(chalk.bold(`\n🔧 Mobility Parts Social Publisher`));
  console.log(`   Pilier     : ${chalk.cyan(pillar.label)}`);
  console.log(`   Plateformes: ${chalk.cyan(platforms.join(', '))}`);
  console.log(`   Post #${postCount + 1}${dryRun ? chalk.yellow('  [DRY-RUN]') : ''}\n`);

  // 1. Génération caption (même texte de base, adapté par plateforme dans generate.js)
  console.log(chalk.dim('→ Génération caption...'));
  const igContent = platforms.includes('instagram')
    ? await generateCaption({ pillar, platform: 'instagram', hashtagIndex, postCount })
    : null;
  const fbContent = platforms.includes('facebook')
    ? await generateCaption({ pillar, platform: 'facebook', hashtagIndex, postCount })
    : null;

  const captionText = (igContent || fbContent).text;

  // 2. Génération image
  console.log(chalk.dim('→ Génération image...'));
  const { imageUrl, prompt, provider } = await generateImage({ pillar, captionText, postCount });
  console.log(`  Image (${provider}): ${imageUrl.slice(0, 60)}...`);

  // 2b. Headline pour le template visuel
  console.log(chalk.dim('→ Génération headline visuel...'));
  const { headline, sub } = await generateHeadline(captionText);
  console.log(`  Template #${(postCount % 20) + 1} — "${headline}"`);

  // 2c. Render template brandé
  console.log(chalk.dim('→ Render template brandé...'));
  let brandedImageUrl = imageUrl;
  try {
    const { buffer, templateIndex } = await renderBrandedImage({ imageUrl, headline, sub, postCount });
    console.log(chalk.dim('→ Upload image brandée...'));
    brandedImageUrl = await uploadImage(buffer);
    console.log(`  Brandé (template ${templateIndex + 1}): ${brandedImageUrl.slice(0, 60)}...`);
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠ Render/upload échoué, fallback image FLUX brute: ${err.message}`));
  }

  // 3. Validation + Aperçu
  console.log(chalk.dim('→ Validation...'));
  let validationFailed = false;
  if (igContent) {
    const v = logValidation({ caption: igContent.caption, pillar: pillar.id, platform: 'instagram' });
    if (!v.valid) validationFailed = true;
  }
  if (fbContent) {
    const v = logValidation({ caption: fbContent.caption, pillar: pillar.id, platform: 'facebook' });
    if (!v.valid) validationFailed = true;
  }

  if (igContent) {
    console.log(chalk.bold('\n📱 Instagram:'));
    console.log(igContent.caption);
  }
  if (fbContent) {
    console.log(chalk.bold('\n📘 Facebook:'));
    console.log(fbContent.caption);
  }
  console.log('');

  if (validationFailed && !dryRun) {
    console.error(chalk.red('✗ Publication annulée — validation échouée. Relancer en --dry-run pour voir le contenu.'));
    process.exit(1);
  }

  if (dryRun) {
    console.log(chalk.yellow('✓ Dry-run terminé — rien publié.'));
    for (const platform of platforms) {
      const content = platform === 'instagram' ? igContent : fbContent;
      if (content) {
        logPost({ id: 'dry-run', platform, dryRun: true, pillar: pillar.id, text: content.text.slice(0, 80), imageUrl: brandedImageUrl, fluxImageUrl: imageUrl, provider, headline });
      }
    }
    return;
  }

  // 4. Publication
  for (const platform of platforms) {
    try {
      const content = platform === 'instagram' ? igContent : fbContent;
      if (!content) continue;

      let result;
      if (platform === 'instagram') {
        result = await publishToInstagram({ caption: content.caption, imageUrl: brandedImageUrl });
      } else {
        result = await publishToFacebook({ caption: content.caption, imageUrl: brandedImageUrl });
      }

      console.log(chalk.green(`✓ ${platform} — id: ${result.id}`));
      logPost({ id: result.id, platform, dryRun: false, pillar: pillar.id, text: content.text.slice(0, 80), imageUrl: brandedImageUrl, fluxImageUrl: imageUrl, provider, fluxPrompt: prompt, headline });
    } catch (err) {
      console.error(chalk.red(`✗ ${platform} — ${err.message}`));
      if (platform === 'instagram') process.exit(1);
      // Facebook non-fatal — continue sans bloquer
    }
  }
}

run();
