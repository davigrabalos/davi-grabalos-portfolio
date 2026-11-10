import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      {/* Rendered first so ScrollSmoother exists before any section creates its ScrollTriggers */}
      <SmoothScroll />
      <Nav />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Projects />
            <About />
            <Contact />
          </main>
        </div>
      </div>
    </>
  );
}
