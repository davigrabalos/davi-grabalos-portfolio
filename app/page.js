import fs from 'fs';
import path from 'path';
import Slider from '@/components/UI/Slider';

function formatName(str) {
  return str.split('-').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export default function Home() {
  const imagesDir = path.join(process.cwd(), 'public/images/projectspics');
  let files = [];
  try {
    files = fs.readdirSync(imagesDir);
  } catch (e) {
    console.error("Folder public/images/projectspics not found");
  }
  
  const projects = files
    .filter(file => file.includes('|') && !file.startsWith('.'))
    .map((file, index) => {
      const [brandPart, collectionPartWithExt] = file.split('|');
      
      // Remove a extensão do arquivo da segunda parte
      const parts = collectionPartWithExt.split('.');
      parts.pop(); // remove extensão (.png, .jpg, etc)
      const collectionPart = parts.join('.');
      
      return {
        id: index + 1,
        brand: formatName(brandPart),
        collection: formatName(collectionPart),
        image: encodeURI(`/images/projectspics/${file}`)
      };
    });

  // Ordena para colocar "cristo-reina" na primeira posição
  projects.sort((a, b) => {
    if (a.image.toLowerCase().includes('cristo-reina')) return -1;
    if (b.image.toLowerCase().includes('cristo-reina')) return 1;
    return 0;
  });

  return (
    <Slider projects={projects} />
  );
}
