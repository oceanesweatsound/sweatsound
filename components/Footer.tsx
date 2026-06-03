import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Sweat & Sound — Accueil">
          Sweat <em>&amp;</em> Sound
        </Link>

        <ul className={styles.links} role="list">
          <li><Link href="/#recettes" className={styles.link}>Recettes</Link></li>
          <li><Link href="/#univers" className={styles.link}>À propos</Link></li>
          <li><Link href="/communaute/proposer" className={styles.link}>Contact</Link></li>
          <li><Link href="#" className={styles.link}>Mentions légales</Link></li>
        </ul>

        <p className={styles.copy}>© {new Date().getFullYear()} Sweat &amp; Sound</p>
      </div>
    </footer>
  )
}
