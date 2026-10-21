"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import styles from "./Navbar.module.css";

const TAB_ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/projects", label: "Projects", icon: "◫" },
  { href: "/about", label: "About", icon: "◎" },
  { href: "mailto:davigrabalos@gmail.com", label: "Email", icon: "✉", external: true },
];

export default function Navbar() {
  const [time, setTime] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) {
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isHome]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
      const dateString = now.toLocaleDateString("en-US", options);
      const timeString = now.toLocaleTimeString("en-US", { hour12: false, timeZoneName: "short" });
      setTime(`${dateString}, ${timeString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── Desktop / top navbar ── */}
      <nav className={styles.navbar}>
        <div className={`${styles.col1} ${isAbout ? styles.hiddenLogo : ""}`}>
          <TransitionLink
            href="/"
            className={`${styles.logo} ${isGlitching ? styles.logoGlitch : ""}`}
          >
            <span className={styles.logoWord}>DAVI</span>{" "}
            <span className={styles.logoWord}>GRABALOS.</span>
          </TransitionLink>
        </div>
        <div className={styles.col2}>{time}</div>
        <div className={styles.col3}>
          <TransitionLink href="/projects" className={styles.link}>Projects</TransitionLink>
          <TransitionLink href="/about" className={styles.link}>About</TransitionLink>
        </div>
        <div className={styles.col4}>
          <a href="mailto:davigrabalos@gmail.com" className={styles.link}>Email</a>
          <a
            href="https://instagram.com/davigrabalos"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Instagram
          </a>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav className={styles.bottomBar} aria-label="Mobile navigation">
        {TAB_ITEMS.map(({ href, label, icon, external }) => {
          const isActive = href === pathname;
          if (external) {
            return (
              <a
                key={label}
                href={href}
                className={`${styles.tabItem} ${isActive ? styles.active : ""}`}
                aria-label={label}
              >
                <span className={styles.tabIcon}>{icon}</span>
                <span className={styles.tabLabel}>{label}</span>
              </a>
            );
          }
          return (
            <TransitionLink
              key={label}
              href={href}
              className={`${styles.tabItem} ${isActive ? styles.active : ""}`}
              aria-label={label}
            >
              <span className={styles.tabIcon}>{icon}</span>
              <span className={styles.tabLabel}>{label}</span>
            </TransitionLink>
          );
        })}
      </nav>
    </>
  );
}
