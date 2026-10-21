import Slider from '@/components/UI/Slider';
import { getAllProjects } from '@/lib/projects';

export default function Home() {
  return (
    <Slider projects={getAllProjects()} />
  );
}
