import Image from 'next/image';
import { TransitionLink } from '@/components/UI/TransitionProvider';
import { getCollectionSeasons } from '@/lib/projects';
import styles from './projects.module.css';

export default function ProjectsIndex() {
  const entries = getCollectionSeasons();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <p className={styles.count}>({entries.length} Collections)</p>
        <h1 className={styles.title}>
          <span className={styles.word}>SELECTED</span> <span className={styles.word}>PROJECTS.</span>
        </h1>
      </header>

      <div className={styles.grid}>
        {entries.map(({ collection, season, href }, index) => {
          const formattedIndex = String(index + 1).padStart(3, '0');
          const projectCount = season.projects.length;
          return (
            <TransitionLink key={href} href={href} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={season.projects[0].cover}
                  alt={collection.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  quality={100}
                />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.index}>{formattedIndex}</span>
                <div className={styles.details}>
                  <span className={styles.brand}>{collection.title}</span>
                  <span className={styles.collection}>
                    {season.title} · {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                  </span>
                </div>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </main>
  );
}
