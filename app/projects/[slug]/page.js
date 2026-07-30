import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TransitionLink } from '@/components/UI/TransitionProvider';
import styles from './project.module.css';

function formatName(str) {
  return str.split('-').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const imagesDir = path.join(process.cwd(), 'public/images/projectspics');
  let files = [];
  try {
    files = fs.readdirSync(imagesDir);
  } catch (e) {
    console.error("Folder public/images/projectspics not found");
  }

  const matchingFile = files.find(f => f.replace(/\.[^/.]+$/, "") === decodedSlug);
  
  if (!matchingFile) {
    notFound();
  }

  const [brandPart, collectionPartWithExt] = matchingFile.split('|');
  const parts = collectionPartWithExt.split('.');
  parts.pop();
  const collectionPart = parts.join('.');

  const brand = formatName(brandPart);
  const collection = formatName(collectionPart);
  const imagePath = encodeURI(`/images/projectspics/${matchingFile}`);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.tag}>Case Study</span>
          <h1 className={styles.title}>{brand}</h1>
          <p className={styles.collection}>{collection}</p>
        </div>

        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>Art Direction & Web Development</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.label}>Year</span>
            <span className={styles.value}>2026</span>
          </div>
        </div>
      </header>

      <section className={styles.mediaContainer}>
        <div className={styles.mainImageWrapper}>
          <Image
            src={imagePath}
            alt={brand}
            fill
            style={{ objectFit: 'contain' }}
            quality={100}
            priority
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <TransitionLink href="/projects" className={styles.backLink}>
          ← Back to Projects Index
        </TransitionLink>
        <TransitionLink href="/" className={styles.homeLink}>
          Back to Homepage →
        </TransitionLink>
      </footer>
    </main>
  );
}
