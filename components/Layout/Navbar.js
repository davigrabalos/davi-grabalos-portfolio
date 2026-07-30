"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [time, setTime] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) {
      setIsGlitching(true);
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isHome]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, timeZoneName: 'short' });
      setTime(`${dateString}, ${timeString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.col1} ${isAbout ? styles.hiddenLogo : ""}`}>
        <TransitionLink href="/" className={`${styles.logo} ${isGlitching ? styles.logoGlitch : ""}`}>
          <span className={styles.logoWord}>DAVI</span> <span className={styles.logoWord}>GRABALOS.</span>
        </TransitionLink>
      </div>
      <div className={styles.col2}>
        {time}
      </div>
      <div className={styles.col3}>
        <TransitionLink href="/projects" className={styles.link}>Projects</TransitionLink>
        <TransitionLink href="/about" className={styles.link}>About</TransitionLink>
      </div>
      <div className={styles.col4}>
        <a href="mailto:davigrabalos@gmail.com" className={styles.link}>Email</a>
        <a href="https://instagram.com/davigrabalos" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
      </div>
    </nav>
  );
}
