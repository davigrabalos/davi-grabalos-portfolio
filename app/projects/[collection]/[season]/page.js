import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TransitionLink } from '@/components/UI/TransitionProvider';
import { getCollectionSeason, getCollectionSeasons } from '@/lib/projects';
import styles from './collection.module.css';

// Only folders that exist in public/work are valid pages
export const dynamicParams = false;

export function generateStaticParams() {
  return getCollectionSeasons().map(({ collection, season }) => ({
    collection: collection.slug,
    season: season.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { collection: collectionSlug, season: seasonSlug } = await params;
  const data = getCollectionSeason(collectionSlug, seasonSlug);
  if (!data) return {};
  return { title: `${data.collection.title} ${data.season.title} | Davi Grabalos` };
}

export default async function CollectionPage({ params }) {
  const { collection: collectionSlug, season: seasonSlug } = await params;
  const data = getCollectionSeason(collectionSlug, seasonSlug);

  if (!data) {
    notFound();
  }

  const { collection, season } = data;
  const description = season.description ?? collection.description;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.tag}>Collection</span>
          <h1 className={styles.title}>{collection.title}</h1>
          <p className={styles.collection}>{season.title}</p>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.label}>Season</span>
            <span className={styles.value}>{season.title}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.label}>Projects</span>
            <span className={styles.value}>{String(season.projects.length).padStart(3, '0')}</span>
          </div>
        </div>
      </header>

      {season.projects.map((project, index) => (
        <section key={project.slug} id={project.slug} className={styles.project}>
          <div className={styles.projectHeader}>
            <span className={styles.index}>{String(index + 1).padStart(3, '0')}</span>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            {project.role && <span className={styles.projectRole}>{project.role}</span>}
          </div>
          {project.description && <p className={styles.description}>{project.description}</p>}

          <div className={styles.mediaContainer}>
            {project.images.map((src, imageIndex) => (
              <div key={src} className={styles.mainImageWrapper}>
                <Image
                  src={src}
                  alt={`${project.title} ${imageIndex + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  quality={100}
                  priority={index === 0 && imageIndex === 0}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

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
