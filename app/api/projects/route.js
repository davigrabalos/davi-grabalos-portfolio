import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

function formatName(str) {
  return str.split('-').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public/images/projectspics');
  let files = [];
  try {
    files = fs.readdirSync(imagesDir);
  } catch (e) {
    console.error('Folder public/images/projectspics not found');
  }

  const projects = files
    .filter(file => file.includes('|') && !file.startsWith('.'))
    .map((file, index) => {
      const [brandPart, collectionPartWithExt] = file.split('|');
      const parts = collectionPartWithExt.split('.');
      parts.pop();
      const collectionPart = parts.join('.');
      const slug = file.replace(/\.[^/.]+$/, '');
      return {
        id: index + 1,
        slug,
        brand: formatName(brandPart),
        collection: formatName(collectionPart),
        image: encodeURI(`/images/projectspics/${file}`),
      };
    });

  // Garantir que Cristo Reina seja o primeiro
  projects.sort((a, b) => {
    if (a.image.toLowerCase().includes('cristo-reina')) return -1;
    if (b.image.toLowerCase().includes('cristo-reina')) return 1;
    return 0;
  });

  return NextResponse.json(projects);
}
