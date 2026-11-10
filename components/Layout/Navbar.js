"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/UI/TransitionProvider";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

const MOBILE_TABS = [
  { href: "/", label: "Home", symbol: "⌂" },
  { href: "/projects", label: "Work", symbol: "◫" },
  { href: "/about", label: "Info", symbol: "◎" },
  { href: "mailto:davigrabalos@gmail.com", label: "Email", symbol: "✉", external: true },
];

export default function Navbar() {
  const [time, setTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── Desktop top bar ── */}
      <header className={styles.bar}>
        <div className={styles.barLeft}>
          <TransitionLink href="/" className={styles.logo}>
            DAVI<span className={styles.logoRed}>.</span>
          </TransitionLink>
        </div>

        <nav className={styles.barCenter} aria-label="Primary navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <TransitionLink
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname.startsWith(href) ? styles.navLinkActive : ""}`}
            >
              {label}
            </TransitionLink>
          ))}
        </nav>

        <div className={styles.barRight}>
          <span className={styles.clock} aria-label="Current time">{time}</span>
          <a href="mailto:davigrabalos@gmail.com" className={styles.ctaLink}>
            Get in touch ↗
          </a>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <nav className={styles.mobileBar} aria-label="Mobile navigation">
        {MOBILE_TABS.map(({ href, label, symbol, external }) => {
          const isActive = href === pathname;
          const Comp = external ? "a" : TransitionLink;
          return (
            <Comp
              key={label}
              href={href}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              aria-label={label}
            >
              <span className={styles.tabSymbol}>{symbol}</span>
              <span className={styles.tabLabel}>{label}</span>
            </Comp>
          );
        })}
      </nav>
    </>
  );
}
