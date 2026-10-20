// Mechanical crop and proportional resizing of the supplied image; no redrawing.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const source = path.join(__dirname, '../public/icons/flower-source.png');
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    if (data[i] < 128 && data[i + 3] > 128) {
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  const side = Math.max(right - left + 1, bottom - top + 1) + 16;
  const crop = { left: Math.round((left + right + 1 - side) / 2), top: Math.round((top + bottom + 1 - side) / 2), width: side, height: side };
  const sizes = [16, 32, 48], images = [];
  for (const size of sizes) {
    const png = await sharp(source).extract(crop).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer();
    await fs.writeFile(path.join(__dirname, `../public/icons/favicon-${size}.png`), png);
    images.push(png);
  }
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    header[entry] = size; header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[index].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  await fs.writeFile(path.join(__dirname, '../public/favicon.ico'), Buffer.concat([header, ...images]));
  console.log({ crop, sizes, preservedSource: source });
}
main().catch(error => { console.error(error); process.exitCode = 1; });
