// Builds the Design Showroom from the archive in public/showroom/<project>/.
//
//   npm run showroom
//
// Every project folder becomes a room. Images (jpg/png/webp) and PDF pages become its pieces. Each one is
// exported as a web-sized JPEG to public/gallery/<room>/, and their sizes are written to
// lib/showroom.generated.json, which the site reads. Titles, descriptions and order live in lib/showroom.js.
// Unchanged files are skipped, so re-running after adding a folder only processes what is new.
// PDF pages are rendered with macOS PDFKit (scripts/pdf-pages.swift).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, 'public/showroom');
const OUT = path.join(ROOT, 'public/gallery');
const MANIFEST = path.join(ROOT, 'lib/showroom.generated.json');
const IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;
const INK = '#010101';

// Accents, '&' and dots become plain URL-safe slugs: "verbo&carne003.jpg" -> "verbo-e-carne003"
const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, '-e-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const fresh = (src, out) => fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

async function exportImage(src, out) {
  if (!fresh(src, out)) {
    let img = sharp(src, { limitInputPixels: false }).rotate();
    const { hasAlpha } = await img.metadata();
    // Transparent artwork (logos, wordmarks) is set on ink and trimmed to its content
    if (hasAlpha) {
      const trimmed = await img.flatten({ background: INK }).trim({ background: INK }).png().toBuffer();
      const { width: tw, height: th } = await sharp(trimmed, { limitInputPixels: false }).metadata();
      const pad = Math.round(Math.min(tw, th) * 0.3); // breathing room around the mark
      const flat = await sharp(trimmed, { limitInputPixels: false })
        .extend({ top: pad, bottom: pad, left: pad, right: pad, background: INK })
        .png()
        .toBuffer();
      img = sharp(flat, { limitInputPixels: false });
    }
    const { width, height } = await img.metadata();
    const wide = width / height > 2.5;
    await img
      .resize(
        wide
          ? { width: 3000, withoutEnlargement: true }
          : { width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true },
      )
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
  }
  const { width, height } = await sharp(out).metadata();
  return { w: width, h: height };
}

function renderPdf(src) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'showroom-pdf-'));
  execFileSync('swift', [path.join(ROOT, 'scripts/pdf-pages.swift'), src, dir, '2000'], { stdio: 'ignore' });
  return fs
    .readdirSync(dir)
    .sort()
    .map((f) => path.join(dir, f));
}

const rooms = {};
const keep = new Set();

for (const folder of fs.readdirSync(ARCHIVE).sort()) {
  const dir = path.join(ARCHIVE, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  const room = slug(folder);
  const outDir = path.join(OUT, room);
  const pieces = [];
  const files = fs.readdirSync(dir).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const used = new Set();
  for (const file of files) {
    const src = path.join(dir, file);
    // "01.jpg" and "01.jpeg" in one folder would export to the same name: keep the extension on the second
    let base = slug(path.parse(file).name);
    if (used.has(base)) base = slug(file);
    used.add(base);

    if (IMAGE.test(file)) {
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, `${base}.jpg`);
      pieces.push({ file, src: `/gallery/${room}/${base}.jpg`, ...(await exportImage(src, out)) });
      keep.add(out);
    } else if (/\.pdf$/i.test(file)) {
      fs.mkdirSync(outDir, { recursive: true });
      // Re-render only when the PDF changed; otherwise reuse the exported pages
      const pages = fresh(src, path.join(outDir, `${base}-01.jpg`)) ? null : renderPdf(src);
      const count = pages ? pages.length : fs.readdirSync(outDir).filter((f) => f.startsWith(`${base}-`)).length;
      for (let i = 0; i < count; i++) {
        const n = String(i + 1).padStart(2, '0');
        const out = path.join(outDir, `${base}-${n}.jpg`);
        const size = await exportImage(pages ? pages[i] : out, out);
        pieces.push({ file: `${file}#${n}`, src: `/gallery/${room}/${base}-${n}.jpg`, ...size });
        keep.add(out);
      }
    }
  }

  if (pieces.length) rooms[folder] = { slug: room, pieces };
  console.log(`${folder.padEnd(20)} ${pieces.length ? `${pieces.length} pieces` : 'empty, skipped'}`);
}

// Drop exports whose source file is gone
if (fs.existsSync(OUT)) {
  for (const room of fs.readdirSync(OUT)) {
    const dir = path.join(OUT, room);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) if (!keep.has(path.join(dir, f))) fs.rmSync(path.join(dir, f));
    if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
  }
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(rooms, null, 2)}\n`);
console.log(`\nWrote ${path.relative(ROOT, MANIFEST)}`);
