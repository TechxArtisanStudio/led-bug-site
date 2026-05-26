#!/usr/bin/env node
/** Copy en/messages.json to other locales (placeholder until translated). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = path.join(ROOT, 'src/i18n/en/messages.json');
const locales = ['zh-cn', 'zh-tw', 'zh-hk', 'es', 'fr', 'ja', 'it'];
const enText = fs.readFileSync(en, 'utf8');
for (const loc of locales) {
  const dir = path.join(ROOT, 'src/i18n', loc);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, 'messages.json');
  if (!fs.existsSync(dest)) fs.writeFileSync(dest, enText, 'utf8');
}
console.log('Scaffolded messages for:', locales.join(', '));
