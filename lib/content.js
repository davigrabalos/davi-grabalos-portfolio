// All site copy lives here. Entries marked TODO are placeholders to replace.

export const profile = {
  first: 'Davi',
  last: 'Grabalos',
  name: 'Davi Grabalos',
  roles: ['Software Developer', 'Product Engineer', 'UI/UX Designer'],
  availability: 'Available for new projects',
  tagline:
    'I design and build digital products end to end, from the first wireframe to the last line of production code.',
  bio: "I'm a software developer and product engineer with a background in art direction. I care about the whole product: the problem, the interface and the code that ships it. I like small teams, short feedback loops and the details that make software feel considered.",
  email: 'hello@example.com', // TODO: real email
  cv: '/cv.pdf', // TODO: add the PDF to public/cv.pdf
};

export const socials = [
  { label: 'GitHub', href: 'https://github.com/davigrabalos' },
  { label: 'LinkedIn', href: '#' }, // TODO
  { label: 'Instagram', href: '#' }, // TODO
];

// TODO: placeholder projects
export const projects = [
  {
    title: 'Pulse Analytics',
    short: 'PLS',
    role: 'Product Engineering',
    stack: ['Next.js', 'TypeScript', 'D3'],
    year: '2026',
    color: '#AD5417',
    href: '#',
  },
  {
    title: 'Kiln Design System',
    short: 'KLN',
    role: 'UI/UX + Front-end',
    stack: ['React', 'Storybook', 'Figma'],
    year: '2025',
    color: '#010101',
    href: '#',
  },
  {
    title: 'Tide Banking App',
    short: 'TDE',
    role: 'UX Research + Prototyping',
    stack: ['React Native', 'Figma'],
    year: '2025',
    color: '#5E6B57',
    href: '#',
  },
  {
    title: 'Ledger API',
    short: 'LDG',
    role: 'Backend Engineering',
    stack: ['Node.js', 'PostgreSQL', 'Docker'],
    year: '2024',
    color: '#3B2A1F',
    href: '#',
  },
  {
    title: 'Atlas Booking',
    short: 'ATL',
    role: 'Full-stack Development',
    stack: ['Next.js', 'Prisma', 'Stripe'],
    year: '2024',
    color: '#C98A4B',
    href: '#',
  },
];

// TODO: placeholder experience
export const experience = [
  {
    period: '2024 — Now',
    role: 'Product Engineer',
    company: 'Company Name',
    summary: 'Own features from discovery to release across web and mobile.',
  },
  {
    period: '2022 — 2024',
    role: 'Front-end Developer',
    company: 'Agency Name',
    summary: 'Built design systems and marketing sites for product teams.',
  },
  {
    period: '2019 — 2022',
    role: 'Art Director',
    company: 'Studio Name',
    summary: 'Led visual identity and campaign work for brands and artists.',
  },
];

export const skills = [
  { label: 'Engineering', items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL'] },
  { label: 'Product', items: ['Discovery', 'Prototyping', 'Analytics', 'A/B testing'] },
  { label: 'Design', items: ['Figma', 'Design systems', 'Motion', 'Art direction'] },
];
