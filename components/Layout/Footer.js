"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

export default function Footer({ project }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

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
        <form onSubmit={handleSubmit} className={styles.form}>
          {subscribed ? (
            <span className={styles.success}>Thanks for subscribing!</span>
          ) : (
            <>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Subscribe to Newsletter
              </button>
            </>
          )}
        </form>
      </div>
    </footer>
  );
}
