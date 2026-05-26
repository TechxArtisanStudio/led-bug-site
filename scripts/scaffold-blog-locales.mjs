#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'src/content/posts');
const locales = ['zh-cn', 'zh-tw', 'zh-hk', 'es', 'fr', 'ja', 'it'];

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('--en.md'))) {
  const enPath = path.join(dir, f);
  let en = fs.readFileSync(enPath, 'utf8');
  if (!/^locale:/m.test(en)) {
    en = en.replace(/^---\n/, '---\nlocale: en\n');
  }
  for (const loc of locales) {
    const out = path.join(dir, f.replace('--en.md', `--${loc}.md`));
    if (fs.existsSync(out)) continue;
    const outContent = en
      .replace(/^locale: en\s*$/m, `locale: ${loc}`)
      .replace(/^locale: en\n/m, `locale: ${loc}\n`);
    fs.writeFileSync(out, outContent, 'utf8');
  }
}
console.log('Blog locale scaffolds ready');
