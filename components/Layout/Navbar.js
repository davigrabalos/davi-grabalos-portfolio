"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [time, setTime] = useState("");

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
      <div className={styles.col1}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoWord}>DAVI</span> <span className={styles.logoWord}>GRABALOS.</span>
        </Link>
      </div>
      <div className={styles.col2}>
        {time}
      </div>
      <div className={styles.col3}>
        <Link href="#projects" className={styles.link}>Projects</Link>
        <Link href="#journal" className={styles.link}>Journal</Link>
        <Link href="#information" className={styles.link}>Information</Link>
        <Link href="#careers" className={styles.link}>Careers</Link>
      </div>
      <div className={styles.col4}>
        <a href="mailto:email@bodeyco.com" className={styles.link}>Email</a>
        <a href="#" className={styles.link}>Instagram</a>
      </div>
    </nav>
  );
}
