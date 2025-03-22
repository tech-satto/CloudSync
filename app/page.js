import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to CloudSync ☁️</h1>
        <p className={styles.description}>
          Your personal cloud storage at your fingertips. 📁
        </p>

        <div className={styles.ctas}>
          <Link href="/signup" className={`${styles.btn} ${styles.primary}`}>
            Get Started
          </Link>
          <Link href="/login" className={`${styles.btn} ${styles.secondary}`}>
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
