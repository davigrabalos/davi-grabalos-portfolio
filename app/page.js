import ShowcaseHero from '@/components/UI/ShowcaseHero';
import { getAllProjects } from '@/lib/projects';

export const metadata = {
  title: 'Davi Grabalos | Art Director & Web Developer',
  description: 'Portfolio of Davi Grabalos — Art Director and Creative Web Developer.',
};

export default function Home() {
  const projects = getAllProjects();
  return <ShowcaseHero projects={projects} />;
}
