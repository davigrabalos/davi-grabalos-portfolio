// All site copy lives here. Entries marked TODO still need real values.

export const profile = {
  first: 'Davi',
  last: 'Grabalos',
  name: 'Davi Grabalos',
  fullName: 'Davi Grabalos Galvão',
  roles: ['Software Developer', 'Product Engineer', 'UI/UX Designer'],
  location: 'Porto Seguro, Bahia, Brazil',
  availability: 'Open to internships, junior roles & freelance',
  tagline:
    'I build products from the ground up, from architecture to interface, with React Native, Next.js and TypeScript.',
  bio: "I'm a software developer and product engineer with a designer's eye, studying Information Systems at FIAP. I take products from idea to shipped code: architecture, back-end, interface and visuals. Years of art direction and music production taught me that the details are the product.",
  email: 'davigrabalos@gmail.com',
  cv: '/davi-grabalos-cv.pdf',
};

export const socials = [
  { label: 'GitHub', href: 'https://github.com/davigrabalos' },
  { label: 'LinkedIn', href: '#' }, // TODO: LinkedIn profile URL
];

export const projects = [
  {
    title: 'Checkout System',
    short: 'SHOP',
    role: 'Full-stack + Product Design',
    stack: ['Next.js', 'TypeScript', 'Database'],
    when: 'Now',
    color: '#AD5417',
    href: '#', // Confidential: screenshots on request
  },
  {
    title: 'Kola',
    short: 'KOLA',
    role: 'Product + UI/UX',
    stack: ['Career growth app', 'Prototype'],
    when: 'In progress',
    color: '#010101',
    href: '#',
  },
  {
    title: 'Conecta Saúde',
    short: 'CNS',
    role: 'Full-stack Development',
    stack: ['Dashboard', 'Maps', 'Data structures'],
    when: 'FIAP',
    color: '#5E6B57',
    href: '#',
  },
  {
    title: 'Client Websites',
    short: 'WEB',
    role: 'Front-end + UI Design',
    stack: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    when: 'Freelance',
    color: '#3B2A1F',
    href: '#',
  },
  {
    title: 'This Portfolio',
    short: 'DG',
    role: 'Design + Development',
    stack: ['Next.js', 'GSAP'],
    when: '2026',
    color: '#C98A4B',
    href: '#top',
  },
];

export const experience = [
  {
    period: 'Present',
    role: 'Freelance Full-Stack Developer',
    company: 'Remote',
    summary:
      'Built a checkout system and e-commerce site end to end (architecture, front-end, back-end, database and design), plus sites for a sushi restaurant, a marketing agency, a dance school and churches.',
  },
  {
    period: '2025 — 2028',
    role: 'Information Systems',
    company: 'FIAP · 4th semester',
    summary: 'Front-End Developer certification. Full-stack and visual lead on Conecta Saúde, a public hospital management project.',
  },
  {
    period: 'Ongoing',
    role: 'Freelance Designer',
    company: 'Remote',
    summary: 'Banners and visual assets for clients, with a distinct art direction of my own.',
  },
  {
    period: 'Artist',
    role: 'Music Producer & Songwriter',
    company: 'Davi Grabalos',
    summary: 'Wrote and produced singles, an EP and two albums, released on all major streaming platforms.',
  },
];

export const skills = [
  { label: 'Development', items: ['React Native', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'HTML'] },
  { label: 'Product & UI/UX', items: ['Product design', 'Prototyping', 'Interface design', 'Art direction'] },
  { label: 'Tools', items: ['VS Code', 'Claude Code', 'Antigravity'] },
  { label: 'Languages', items: ['Portuguese (native)', 'English (C1)'] },
];
