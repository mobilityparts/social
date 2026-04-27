import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, '../logs/posts.json');

function readLogs() {
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

export function getRealPostCount() {
  return readLogs().filter(l => !l.dryRun).length;
}

export function getHashtagIndex() {
  return readLogs().filter(l => !l.dryRun && l.platform === 'instagram').length;
}

export function logPost(entry) {
  const logs = readLogs();
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
}

export function getRecentPosts(n = 10) {
  return readLogs().slice(-n);
}
