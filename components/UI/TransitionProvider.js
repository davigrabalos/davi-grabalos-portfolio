"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const TransitionContext = createContext({
  navigate: (href) => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const flashRedRef = useRef(null);
  const flashBlueRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const el = document.getElementById("page-transition-container");
    if (el) {
      gsap.set(el, { opacity: 1, filter: "none" });
    }

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Fase 2: Acende na nova página (Entry)
    // Se estava azul da navegação anterior, ele mantém, pisca vermelho e apaga revelando a página.
    const tl = gsap.timeline();
    tl.set(flashBlueRef.current, { display: 'none' }, "+=0.07")
      .set(flashRedRef.current, { display: 'block' })
      .set(flashRedRef.current, { display: 'none' }, "+=0.07");
  }, [pathname]);

  const navigate = (href) => {
    if (!href || href === "#") return;
    if (pathname === href) return;

    // Fase 1: Apaga a página atual (Exit)
    const tl = gsap.timeline();
    tl.set(flashRedRef.current, { display: 'block' })
      .set(flashRedRef.current, { display: 'none' }, "+=0.07")
      .set(flashBlueRef.current, { display: 'block' }) // Trava no azul enquanto carrega a página
      .call(() => {
        router.push(href);
      });
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div 
        ref={flashRedRef} 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--accent-red)', zIndex: 99999, display: 'none' }} 
      />
      <div 
        ref={flashBlueRef} 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--accent-blue)', zIndex: 99999, display: 'none' }} 
      />
      {children}
    </TransitionContext.Provider>
  );
}

export function TransitionLink({ href, children, onClick, ...props }) {
  const { navigate } = useTransition();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    // Se for link externo ou target _blank, permite navegação normal
    if (props.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:")) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
