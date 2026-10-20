import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const output = path.resolve('out');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const documents = walk(output).filter(file => /\.(?:html|js|css|txt)$/.test(file)).map(file => fs.readFileSync(file, 'utf8'));
const duplicates = [
  ['projects/made-for-the-feed-v4/production-01.mp4', 'projects/made-for-the-feed-v4/fixed-story/production-video.mp4'],
  ['projects/made-for-the-feed-v4/platform-02-new.jpg', 'projects/made-for-the-feed-v4/fixed-story/platform-seoul.jpg'],
  ['projects/made-for-the-feed-v4/platform-02.jpg', 'projects/made-for-the-feed-v4/fixed-story/platform-seoul.jpg'],
];
const digest = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const [oldAsset, currentAsset] of duplicates) {
  const target = path.resolve(output, oldAsset);
  const retained = path.resolve(output, currentAsset);
  if (!target.startsWith(output + path.sep) || !retained.startsWith(output + path.sep)) throw new Error('Asset escaped export directory');
  if (!fs.existsSync(target)) continue;
  if (documents.some(text => text.includes(path.basename(oldAsset)))) throw new Error(`Legacy asset is still referenced: ${oldAsset}`);
  if (!fs.existsSync(retained) || digest(target) !== digest(retained)) throw new Error(`Asset is not an exact duplicate: ${oldAsset}`);
  // Only remove unused duplicates from generated output; public/ source files stay intact.
  fs.unlinkSync(target);
}
const bytes = walk(output).reduce((total, file) => total + fs.statSync(file).size, 0);
if (bytes >= 1_000_000_000) throw new Error(`Pages export exceeds 1 GB: ${bytes} bytes`);
console.log(`GitHub Pages export: ${(bytes / 1_000_000).toFixed(1)} MB`);
