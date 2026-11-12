// Design Showroom content. Each room is a body of visual work; pieces hang in its gallery in this order.
// Images live in public/showroom/<room>/. w/h are the file's pixel size (keeps frames at the right ratio).

export const rooms = [
  {
    slug: 'galpao',
    title: 'Galpão Movement',
    discipline: 'Posters & art direction',
    year: '2026',
    description:
      'A poster series and event key visuals for Galpão Movement: grain, torn layers, bold type and a red that carries the whole set.',
    pieces: [
      { src: '/showroom/galpao/cristo-reina.jpg', w: 1350, h: 1800, title: 'Cristo Reina', medium: 'Poster' },
      { src: '/showroom/galpao/ide.jpg', w: 1440, h: 1800, title: 'Ide', medium: 'Event poster' },
      { src: '/showroom/galpao/banner-issoe.jpg', w: 1350, h: 1800, title: 'Isso é Galpão', medium: 'Poster' },
      { src: '/showroom/galpao/banner-insista.jpg', w: 1349, h: 1800, title: 'Ensine, Insista', medium: 'Poster' },
    ],
  },
  {
    slug: 'apostasia',
    title: 'Apostasia',
    discipline: 'Cover art',
    year: '2026',
    description: 'Cover art for Apostasia, a single I wrote and performed, released on 18 June 2026.',
    pieces: [{ src: '/showroom/apostasia/apostasia.jpg', w: 1800, h: 1800, title: 'Apostasia', medium: 'Single cover' }],
  },
];

export const pieceCount = rooms.reduce((n, r) => n + r.pieces.length, 0);

// Pieces shown on the showroom entrance in the Selected Work section
export const featured = [rooms[0].pieces[1], rooms[1].pieces[0], rooms[0].pieces[0]];
