import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Showroom from '@/components/showroom/Showroom';

export const metadata = {
  title: 'Design Showroom — Davi Grabalos',
  description: 'Posters, cover art and art direction by Davi Grabalos, shown room by room.',
};

export default function ShowroomPage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Showroom />
        </div>
      </div>
    </>
  );
}
