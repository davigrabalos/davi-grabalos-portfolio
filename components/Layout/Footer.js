import styles from "./Footer.module.css";

export default function Footer({ project }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.col1}>
        Art director, and Web Developer.
      </div>
      <div className={styles.col2}>
        {project && (
          <>
            <span className={styles.brand}>{project.brand}</span> <span className={styles.project}>{project.collection}</span>
          </>
        )}
      </div>
      <div className={styles.col3}>
        <span className={styles.email}>Email</span> <strong className={styles.strong}>Subscribe to Newsletter</strong>
      </div>
    </footer>
  );
}
