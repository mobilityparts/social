import 'dotenv/config';
import chalk from 'chalk';
import { getRecentPosts, getRealPostCount } from './logger.js';

const posts = getRecentPosts(10);
const total = getRealPostCount();

console.log(chalk.bold('\n📊 Mobility Parts — Status\n'));
console.log(`  Posts publiés (réels): ${chalk.green(total)}`);
console.log(`  Posts en log total   : ${posts.length}\n`);

if (posts.length === 0) {
  console.log(chalk.dim('  Aucun post encore.'));
} else {
  console.log(chalk.bold('  10 derniers posts:\n'));
  for (const p of [...posts].reverse()) {
    const icon = p.dryRun ? chalk.yellow('[DRY]') : chalk.green('[PUB]');
    const date = new Date(p.timestamp).toLocaleString('fr-BE', { dateStyle: 'short', timeStyle: 'short' });
    const pilier = p.pillar ? chalk.cyan(p.pillar.padEnd(8)) : '        ';
    const platform = (p.platform || '').padEnd(9);
    console.log(`  ${icon} ${date}  ${pilier}  ${platform}  ${p.text?.slice(0, 45) ?? ''}...`);
  }
}
console.log('');
