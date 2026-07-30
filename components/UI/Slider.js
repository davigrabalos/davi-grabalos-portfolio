"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import Footer from "@/components/Layout/Footer";
import styles from "@/app/page.module.css";

export default function Slider({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  
  const imageWrapperRef = useRef(null);
  const lensWrapperRef = useRef(null);
  const bgTextRef = useRef(null);
  const mainContentRef = useRef(null);
  const gradientOrbRef = useRef(null);
  
  const redOffsetRef = useRef(null);
  const blueOffsetRef = useRef(null);

  // Intro Animation brutal e direta (Hard Cut)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
      gsap.set(mainContentRef.current, { opacity: 1 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 15) {
        handleTransition(e.deltaY > 0 ? 1 : -1);
      }
    };

    const handleMouseMove = (e) => {
      if (!imageWrapperRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      
      gsap.to(imageWrapperRef.current, {
        x: x,
        y: y,
        duration: 1.2,
        ease: "power2.out"
      });
      
      if (lensWrapperRef.current) {
        gsap.to(lensWrapperRef.current, {
          x: x,
          y: y,
          duration: 1.2,
          ease: "power2.out"
        });
      }
      
      if (bgTextRef.current) {
        const bgX = (e.clientX / window.innerWidth - 0.5) * -120;
        const bgY = (e.clientY / window.innerHeight - 0.5) * -120;
        gsap.to(bgTextRef.current, {
          x: bgX,
          y: bgY,
          duration: 1.2,
          ease: "power2.out"
        });
      }

      // Animação desacelerada do gradiente para seguir o mouse diretamente
      if (gradientOrbRef.current) {
        gsap.to(gradientOrbRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 2.5,
          ease: "power3.out"
        });
      }
      
      // Atualiza a posição da lente (clip-path)
      if (mainContentRef.current) {
        gsap.to(mainContentRef.current, {
          "--mouse-x": `${e.clientX}px`,
          "--mouse-y": `${e.clientY}px`,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isAnimating]);

  if (!projects || projects.length === 0) {
    return (
      <main className={styles.main}>
        <p>Nenhum projeto encontrado.</p>
      </main>
    );
  }

  const totalProjects = String(projects.length).padStart(3, '0');
  const currentProjectNum = String(currentIndex + 1).padStart(3, '0');
  const activeProject = projects[currentIndex];
  
  const nextProjectIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextProjectIndex];

  const handleTransition = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Liga o filtro SVG de glitch distorcido nas cores da marca
    gsap.set(imageWrapperRef.current, { filter: 'url(#rgb-glitch)' });
    
    const offsetMagnitude = 50;
    const yMagnitude = 20;

    gsap.to(redOffsetRef.current, {
      attr: { dx: direction === 1 ? offsetMagnitude : -offsetMagnitude, dy: direction === 1 ? -yMagnitude : yMagnitude },
      duration: 0.15,
      ease: "power4.in"
    });
    
    gsap.to(blueOffsetRef.current, {
      attr: { dx: direction === 1 ? -offsetMagnitude : offsetMagnitude, dy: direction === 1 ? yMagnitude : -yMagnitude },
      duration: 0.15,
      ease: "power4.in",
      onComplete: () => {
        // Hard Cut da imagem
        setCurrentIndex((prev) => {
          if (direction === 1) return (prev + 1) % projects.length;
          return (prev - 1 + projects.length) % projects.length;
        });
        
        gsap.set(redOffsetRef.current, { 
          attr: { dx: direction === 1 ? -offsetMagnitude : offsetMagnitude, dy: direction === 1 ? yMagnitude : -yMagnitude } 
        });
        gsap.set(blueOffsetRef.current, { 
          attr: { dx: direction === 1 ? offsetMagnitude : -offsetMagnitude, dy: direction === 1 ? -yMagnitude : yMagnitude } 
        });
        
        gsap.to(redOffsetRef.current, { attr: { dx: 0, dy: 0 }, duration: 0.2, ease: "power4.out" });
        gsap.to(blueOffsetRef.current, {
          attr: { dx: 0, dy: 0 },
          duration: 0.2,
          ease: "power4.out",
          onComplete: () => {
            // Desliga o filtro SVG para revelar as cores reais da nova imagem
            gsap.set(imageWrapperRef.current, { filter: 'none' });
            setIsAnimating(false);
          }
        });
      }
    });
  };

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <filter id="rgb-glitch" colorInterpolationFilters="sRGB">
          {/* Vermelho Brand Bruto: #d10026 */}
          <feFlood floodColor="#d10026" result="floodRed" />
          <feComposite in="floodRed" in2="SourceGraphic" operator="in" result="solidRed" />
          <feOffset ref={redOffsetRef} dx="0" dy="0" in="solidRed" result="redShift" />
          
          {/* Azul Brand Bruto: #0022FF */}
          <feFlood floodColor="#0022FF" result="floodBlue" />
          <feComposite in="floodBlue" in2="SourceGraphic" operator="in" result="solidBlue" />
          <feOffset ref={blueOffsetRef} dx="0" dy="0" in="solidBlue" result="blueShift" />
          
          {/* Empilha as camadas sem misturar as cores (sem roxo) e com a foto original por cima */}
          <feMerge>
            <feMergeNode in="blueShift" />
            <feMergeNode in="redShift" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="liquid-lens">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="intro-melt-text" x="-200%" y="-200%" width="500%" height="500%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="0; 1000" dur="0.5s" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </svg>

      <main className={styles.main}>
        
        {/* Orb de luz/sombra seguindo o mouse */}
        <div ref={gradientOrbRef} className={styles.gradientOrb} style={{ opacity: introFinished ? 1 : 0 }} />

        {!introFinished && (
          <div className={styles.backgroundTextContainer}>
            <div ref={bgTextRef} className={styles.backgroundTextIntro}>PORTFOLIO.</div>
          </div>
        )}
        
        <div ref={mainContentRef} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.counter}>
            <span className={styles.total}>{totalProjects}</span>
            <span className={styles.current}>{currentProjectNum}</span>
          </div>
          
          <div className={styles.imageContainer}>
            <div ref={imageWrapperRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Image 
                src={activeProject.image} 
                alt={activeProject.brand} 
                fill 
                style={{ objectFit: "contain" }} 
                quality={100}
                priority
              />
            </div>
          </div>
          
          {/* Camada da Lente Líquida que segue o cursor */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', filter: 'url(#liquid-lens)', clipPath: 'circle(120px at var(--mouse-x, -500px) var(--mouse-y, -500px))', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.imageContainer}>
              <div ref={lensWrapperRef} style={{ width: '100%', height: '100%', position: 'relative', transform: 'scale(1.05)' }}>
                <Image 
                  src={activeProject.image} 
                  alt={activeProject.brand} 
                  fill 
                  style={{ objectFit: "contain" }} 
                  quality={100}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preloader invisível para a próxima imagem */}
        <div style={{ display: 'none' }}>
          <Image 
            src={nextProject.image} 
            alt="preload" 
            fill 
            quality={100}
            priority
          />
        </div>
      </main>
      <Footer project={activeProject} />
    </>
  );
}
