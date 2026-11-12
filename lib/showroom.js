// Design Showroom content.
//
// The archive lives in public/showroom/<folder>/. Run `npm run showroom` after changing it: that exports
// web-sized images to public/gallery/ and writes their sizes to showroom.generated.json.
// This file adds the words: room titles, descriptions, order, and a title for each piece (keyed by its
// file name; PDF pages are "<file>.pdf#01"). Anything not described here still shows up, titled from
// its folder or file name, so a new folder appears on the site as soon as the script has run.

import generated from './showroom.generated.json';

const info = {
  galpao: {
    title: 'Galpão Movement',
    discipline: 'Event posters & art direction',
    year: '2025 — 2026',
    description:
      'Key visuals for every edition of Galpão Movement, from the first service to Galpão Street: grain, torn layers, bold type and a red that carries the whole series.',
    cover: ['verbo&carne003.jpg', 'cristo-reina.jpg', 'AGrandeComissão004.jpg'],
    pieces: {
      'somoscorpo001.jpg': { title: 'Somos Corpo', medium: 'Event poster · Edição 001' },
      'vinde&vede002.jpg': { title: 'Vinde & Vede', medium: 'Event poster · Edição 002' },
      'verbo&carne003.jpg': { title: 'Verbo & Carne', medium: 'Event poster · Edição 003' },
      'AGrandeComissão004.jpg': { title: 'A Grande Comissão', medium: 'Event poster · Edição 004' },
      'CHAMADO.jpg': { title: 'Chamado', medium: 'Event poster' },
      'CHAMADO02.jpg': { title: 'Chamado II', medium: 'Event post' },
      'STREET01.jpg': { title: 'Galpão Street', medium: 'Event poster' },
      'Street02.jpg': { title: 'Galpão Street 2', medium: 'Event poster' },
      'ide.jpg': { title: 'Ide', medium: 'Event poster' },
      'cristo-reina.jpg': { title: 'Cristo Reina', medium: 'Poster' },
      'banner-insista.jpg': { title: 'Ensine, Insista', medium: 'Poster' },
    },
  },
  'strept.co': {
    title: 'Strept.co',
    discipline: 'Brand identity & social media',
    year: '2026',
    description:
      'Identity and social media for strept.co, a design and marketing studio for small businesses: the mark, the wordmark and a run of campaign posts.',
    cover: ['Post-02.png', 'Prancheta 2 - iCON.png', 'noname - cópia.png'],
    pieces: {
      'Prancheta 2 - iCON.png': { title: 'The mark', medium: 'Logo' },
      'Prancheta 1.png': { title: 'Wordmark', medium: 'Logo' },
      'Post-02.png': { title: 'Design é muito mais', medium: 'Social post' },
      'Post-02-02.jpg': { title: 'É sobre como você se comunica', medium: 'Social post' },
      'Post-02-03.png': { title: 'Às vezes o barato sai caro', medium: 'Social post' },
      'Post-02-04.png': { title: 'Faça a escolha certa', medium: 'Social post' },
      'Post-01.png': { title: 'Seu restaurante fatura', medium: 'Social post' },
      'Post-01-02.png': { title: 'Nós ajudamos donos como você', medium: 'Social post' },
      'noname - cópia.png': { title: 'Queimando seu dinheiro', medium: 'Social post' },
      'noname.png': { title: 'Primeira opção', medium: 'Social post' },
      '01.jpeg': { title: 'Depender de IA vai acabar', medium: 'Social post' },
      '02.jpg': { title: 'A IA chegou pra ajudar', medium: 'Social post' },
      '01.jpg': { title: 'Continue sem anunciar', medium: 'Social post' },
      'pexels-introspectivedsgn-18426524.jpg': { title: 'Método, conceito, estratégia', medium: 'Social post' },
      'pexels-mikhail-nilov-6969848.jpg': { title: 'Amplie o seu delivery', medium: 'Social post' },
    },
  },
  'circo.dos.sonhos': {
    title: 'Circo dos Sonhos',
    discipline: 'Event identity',
    year: '2026',
    description:
      'Identity for Circo dos Sonhos, a Projeto Ester show at Teatro Estação: the poster, the tickets and the posts that sold them.',
    cover: ['01.png', 'Circo dos Sonhos - Artboard 1.png', '02.png'],
    pieces: {
      'Circo dos Sonhos - Artboard 1.png': { title: 'Circo dos Sonhos', medium: 'Event poster' },
      'Convites.png': { title: 'Ingresso individual', medium: 'Ticket' },
      '01.png': { title: 'Ingressos disponíveis', medium: 'Social post' },
      '02.png': { title: 'Como funciona a venda', medium: 'Social post' },
    },
  },
  singles: {
    title: 'Singles',
    discipline: 'Cover art',
    year: '2025 — 2026',
    description: 'Cover art for my own releases as a songwriter and producer.',
    cover: ['Salmo13.jpg', 'Parasita - Reject.png', 'apostasia.jpg'],
    pieces: {
      'apostasia.jpg': { title: 'Apostasia', medium: 'Single cover' },
      'Parasita - Reject.png': { title: 'Parasita', medium: 'Single cover' },
      'Salmo13.jpg': { title: 'Salmo 13', medium: 'Single cover' },
      'CoverArt-LHAP.png': { title: 'Least Human As Possible', medium: 'Cover art' },
    },
  },
  tokyogogo: {
    title: 'Tokyo GoGo',
    discipline: 'Social media',
    year: '2026',
    description:
      'Social media for Tokyo GoGo, a sushi delivery restaurant: menu highlights, promos and seasonal campaigns that send people to order.',
    cover: ['Post11.jpg', 'Post4.png', 'Post9.jpg'],
    pieces: {
      'Post1.jpg': { title: 'Sushi de qualidade', medium: 'Social post' },
      'Post11.jpg': { title: 'Água na boca', medium: 'Social post' },
      'Post4.png': { title: 'Combinado Big', medium: 'Social post' },
      'Post7.jpeg': { title: 'Olha essa crocância', medium: 'Social post' },
      'Post8.png': { title: 'Rápido. Acessível. De qualidade.', medium: 'Social post' },
      'Post9.jpg': { title: 'Deu fome? Pede aqui', medium: 'Social post' },
      'Post5.jpg': { title: 'Dia das Mães', medium: 'Social post' },
    },
  },
  'ggc.construtora': {
    title: 'Sal & Sol Studios',
    discipline: 'Sales presentation',
    year: '2026',
    description:
      'A 20-slide showcase for Sal & Sol Studios, 16 studios near Praia do Mutá by Grabalos Galvão Construtora: brand, 3D renders, floor plan and location.',
    cover: ['SalESol.pdf#03', 'SalESol.pdf#01', 'SalESol.pdf#10'],
    pieces: {},
  },
};

// Room order on the page; folders not listed follow alphabetically
const order = ['strept.co', 'galpao','circo.dos.sonhos', 'singles', 'tokyogogo', 'ggc.construtora'];

// "circo.dos.sonhos" -> "Circo Dos Sonhos", "Post-02-03" -> "Post 02 03"
const titleCase = (s) =>
  s
    .replace(/\.[a-z0-9]+(#\d+)?$/i, (m, page) => (page ? ` ${page.slice(1)}` : ''))
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

const pageTitle = (file) => {
  const [, n] = file.split('#');
  return n ? `Slide ${n}` : null;
};

export const rooms = Object.entries(generated)
  .sort(([a], [b]) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib) || a.localeCompare(b);
  })
  .map(([folder, { slug, pieces }]) => {
    const meta = info[folder] ?? {};
    const described = Object.keys(meta.pieces ?? {});
    // Pieces in the order they are described, then any others in file order
    const ordered = [
      ...described.map((f) => pieces.find((p) => p.file === f)).filter(Boolean),
      ...pieces.filter((p) => !described.includes(p.file)),
    ].map((p) => ({
      ...p,
      title: meta.pieces?.[p.file]?.title ?? pageTitle(p.file) ?? titleCase(p.file),
      medium: meta.pieces?.[p.file]?.medium ?? (p.file.includes('.pdf#') ? 'Presentation' : 'Design'),
    }));
    const cover = (meta.cover ?? []).map((f) => ordered.find((p) => p.file === f)).filter(Boolean);
    return {
      slug,
      folder,
      title: meta.title ?? titleCase(folder),
      discipline: meta.discipline ?? 'Design',
      year: meta.year ?? '',
      description: meta.description ?? '',
      pieces: ordered,
      cover: cover.length ? cover : ordered.slice(0, 3),
    };
  });

export const pieceCount = rooms.reduce((n, r) => n + r.pieces.length, 0);

const find = (folder, file) => rooms.find((r) => r.folder === folder)?.pieces.find((p) => p.file === file);

// Pieces shown on the showroom entrance in the Selected Work section
export const featured = [
  find('circo.dos.sonhos', 'Circo dos Sonhos - Artboard 1.png'),
  find('singles', 'Parasita - Reject.png'),
  find('galpao', 'cristo-reina.jpg'),
].filter(Boolean);
