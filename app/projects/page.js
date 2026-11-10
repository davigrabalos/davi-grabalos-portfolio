import ProjectsGrid from '@/components/UI/ProjectsGrid';
import { getCollectionSeasons } from '@/lib/projects';

export const metadata = {
  title: 'Projects | Davi Grabalos',
  description: 'Selected work by Davi Grabalos — Art Direction, Web Development, Brand Identity.',
};

export default function ProjectsPage() {
  const entries = getCollectionSeasons();
  return <ProjectsGrid entries={entries} />;
}
