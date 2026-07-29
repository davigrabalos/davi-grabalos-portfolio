"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import Footer from "@/components/Layout/Footer";
import styles from "@/app/page.module.css";

export default function Slider({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      // Pequeno threshold para evitar toques acidentais em trackpads
      if (Math.abs(e.deltaY) > 15) {
        handleTransition(e.deltaY > 0 ? 1 : -1);
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isAnimating]); // Re-binda apenas quando a animação liga/desliga

  if (!projects || projects.length === 0) {
    return (
      <main className={styles.main}>
        <p>Nenhum projeto encontrado. Adicione imagens na pasta public/images no formato nome|colecao.jpg</p>
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
    
    // Fase 1: Perde o foco e dissolve
    gsap.to(imageWrapperRef.current, {
      filter: "blur(20px)",
      opacity: 0,
      scale: direction === 1 ? 1.05 : 0.95, // Zooms in for next, out for prev
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        // Troca a fonte da imagem baseado na direção usando estado funcional
        setCurrentIndex((prev) => {
          if (direction === 1) return (prev + 1) % projects.length;
          return (prev - 1 + projects.length) % projects.length;
        });
        
        // Fase 2: Crava o foco na nova foto
        gsap.to(imageWrapperRef.current, {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          onComplete: () => setIsAnimating(false)
        });
      }
    });
  };

  return (
    <>
      <main className={styles.main}>
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
              priority
            />
          </div>
        </div>

        {/* Preloader invisível para a próxima imagem */}
        <div style={{ display: 'none' }}>
          <Image 
            src={nextProject.image} 
            alt="preload" 
            fill 
            priority
          />
        </div>
      </main>
      <Footer project={activeProject} />
    </>
  );
}
