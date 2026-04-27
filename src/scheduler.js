import 'dotenv/config';
import cron from 'node-cron';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Meilleurs créneaux B2B auto, Bruxelles (Europe/Brussels)
// Mardi 8h  : garages qui planifient leur semaine
// Jeudi 12h : pause déj, commandes de fin de semaine
// Samedi 9h : B2C + petits garages indépendants
const SCHEDULES = [
  { cron: '0 8 * * 2',  label: 'Mardi 8h' },
  { cron: '0 12 * * 4', label: 'Jeudi 12h' },
  { cron: '0 9 * * 6',  label: 'Samedi 9h' },
];

function publish() {
  console.log(chalk.bold(`\n[${new Date().toLocaleString('fr-BE')}] Lancement publication...`));
  try {
    execSync('node src/run.js --platform instagram,facebook', {
      cwd: ROOT,
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(chalk.red(`Erreur publication: ${err.message}`));
  }
}

console.log(chalk.bold('🗓  Mobility Parts Scheduler démarré (Europe/Brussels)\n'));
for (const { cron: expr, label } of SCHEDULES) {
  cron.schedule(expr, publish, { timezone: 'Europe/Brussels' });
  console.log(`  ✓ Scheduled: ${label}  [${expr}]`);
}
console.log('\nEn attente...');
