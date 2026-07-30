"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/UI/TransitionProvider';
import styles from './projects.module.css';

function formatName(str) {
  return str.split('-').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Data fetching moved to a separate async server component pattern
// We'll load projects client-side via static import from a data file
const PROJECTS_DATA_URL = '/api/projects';

export default function ProjectsIndex() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <p className={styles.count}>({projects.length} Projects)</p>
        <h1 className={styles.title}>
          <span className={styles.word}>SELECTED</span> <span className={styles.word}>PROJECTS.</span>
        </h1>
      </header>

      <div className={styles.grid}>
        {projects.map((project, index) => {
          const formattedIndex = String(index + 1).padStart(3, '0');
          return (
            <TransitionLink key={project.slug} href={`/projects/${encodeURIComponent(project.slug)}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  style={{ objectFit: 'contain' }}
                  quality={100}
                />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.index}>{formattedIndex}</span>
                <div className={styles.details}>
                  <span className={styles.brand}>{project.brand}</span>
                  <span className={styles.collection}>{project.collection}</span>
                </div>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </main>
  );
}
