import { client } from '@/sanity/client'
import { RECETTES_QUERY } from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecettesGrid from '@/components/RecettesGrid'
import FiltreBar from '@/components/FiltreBar'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { getUpcomingFilms, tmdbPosterUrl, formatReleaseDate } from '@/lib/tmdb'

const CATEGORIES_FILM = [
  'Animation', 'Comédie', 'Drame', 'Thriller',
  'Horreur', 'Romance', 'Science-fiction', 'Aventure', 'Fantaisie', 'Documentaire',
]

interface Props {
  searchParams: Promise<{ niveau?: string; temps?: string; categorie?: string }>
}

function parseTemps(temps?: string) {
  if (temps === 'rapide') return { min: null, max: 30 }
  if (temps === 'moyen')  return { min: 30,   max: 60 }
  if (temps === 'long')   return { min: 60,   max: null }
  return { min: null, max: null }
}

export const metadata = {
  title: 'Recettes Film — Sweat & Sound',
  description: 'Des recettes de pâtisserie inspirées par les films. Chaque duo est une expérience sensorielle.',
}

export default async function RecettesFilmPage({ searchParams }: Props) {
  const { niveau, temps, categorie } = await searchParams
  const { min, max } = parseTemps(temps)

  const [recettes, upcomingFilms] = await Promise.all([
    client.fetch<Recette[]>(RECETTES_QUERY, {
      univers: 'film', niveau: niveau ? Number(niveau) : null,
      tempsMin: min, tempsMax: max,
      categorie: categorie ?? null,
    }, { next: { revalidate: 300 } }),
    getUpcomingFilms(),
  ])

  const TABS = [
    { label: 'Toutes',   href: '/recettes' },
    { label: '🎬 Films',   href: '/recettes/film' },
    { label: '🎵 Musique', href: '/recettes/musique' },
    { label: '📚 Livres',  href: '/recettes/livre' },
  ]

  return (
    <main className={styles.main}>
      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Univers Film</p>
          <h1 className={styles.titre}>🎬 Films &amp; Pâtisserie</h1>
          <p className={styles.sub}>
            Chaque recette est née d'un film. Prépare, regarde, déguste.
          </p>
          <div className={styles.heroCtas}>
            <Link href="#recettes" className={styles.ctaBtn}>Voir les recettes</Link>
            <Link href="/communaute#proposer" className={styles.ctaSecondaire}>Proposer un film</Link>
          </div>
        </div>
      </header>

      {/* ── LISTE + FILTRES ── */}
      <section className={styles.liste} id="recettes">
        <div className={styles.listeInner}>
          <nav className={styles.tabs} aria-label="Filtrer par univers">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href}
                className={`${styles.tab} ${t.href === '/recettes/film' ? styles.tabActive : ''}`}
              >{t.label}</Link>
            ))}
          </nav>
          <FiltreBar categories={CATEGORIES_FILM} categorieLabel="Catégorie" />
          <RecettesGrid recettes={recettes} messageVide="Aucun film pour le moment — reviens bientôt !" />
        </div>
      </section>

      {/* ── SORTIES CINÉMA (TMDB) ── */}
      {upcomingFilms.length > 0 && (
        <section className={styles.sorties}>
          <div className={styles.sortiesInner}>
            <p className={styles.eyebrow}>Cette semaine</p>
            <h2 className={styles.sectionTitre}>À l'affiche</h2>
            <p className={styles.sortiesSub}>Les prochaines sorties cinéma en France.</p>
            <div className={styles.sortiesGrid}>
              {upcomingFilms.map((film) => {
                const poster = tmdbPosterUrl(film.poster_path)
                return (
                  <div key={film.id} className={styles.sortiesCard}>
                    {poster ? (
                      <div className={styles.sortiesPoster}>
                        <Image
                          src={poster}
                          alt={film.title}
                          width={140}
                          height={210}
                          className={styles.sortiesPosterImg}
                        />
                      </div>
                    ) : (
                      <div className={styles.sortiesPosterEmpty}>🎬</div>
                    )}
                    <div className={styles.sortiesInfo}>
                      <p className={styles.sortiesDate}>{formatReleaseDate(film.release_date)}</p>
                      <p className={styles.sortiesTitre}>{film.title}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.sortiesFooter}>
              <a
                href="https://www.allocine.fr/film/agenda/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sortiesLienExtterne}
              >
                Toutes les sorties sur AlloCiné ↗
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
