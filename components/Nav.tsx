'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const LIENS = [
  { href: '/recettes/film',    label: '🎬 Films' },
  { href: '/recettes/musique', label: '🎵 Musique' },
  { href: '/recettes/livre',   label: '📚 Livres' },
  { href: '/communaute',       label: 'Communauté' },
  { href: '/a-propos',         label: 'À propos' },
]

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu lors d'un changement de page
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="Sweat & Sound — Accueil">
            Sweat <em>&amp;</em> Sound
          </Link>

          <ul className={styles.links} role="list">
            {LIENS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${pathname.startsWith(href) ? styles.linkActive : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/communaute#proposer" className={styles.cta}>
            Proposer
          </Link>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-label="Menu principal"
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          {LIENS.map(({ href, label }) => (
            <li key={href} className={styles.mobileItem}>
              <Link
                href={href}
                className={`${styles.mobileLink} ${pathname.startsWith(href) ? styles.mobileLinkActive : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/communaute#proposer" className={styles.mobileCta}>
          Proposer une idée →
        </Link>
      </div>
    </>
  )
}
