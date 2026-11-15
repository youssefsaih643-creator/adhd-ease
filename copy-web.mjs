import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const out = resolve(root, 'www');
const files = [
  'index.html',
  'install.html',
  'manifest.webmanifest',
  'supabase.js',
  'sw.js',
  'vercel.json',
  'icons'
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of files) {
  await cp(resolve(root, file), resolve(out, file), { recursive: true });
}

console.log('ADHD Ease web assets copied to ./www');
