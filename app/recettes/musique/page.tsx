import { client } from '@/sanity/client'
import { RECETTES_QUERY, FEATURED_MUSIQUE_QUERY } from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecettesGrid from '@/components/RecettesGrid'
import FiltreBar from '@/components/FiltreBar'
import SpotifyEmbed from '@/components/SpotifyEmbed'
import Link from 'next/link'
import styles from './page.module.css'

interface Props {
  searchParams: Promise<{ niveau?: string; temps?: string }>
}

function parseTemps(temps?: string) {
  if (temps === 'rapide') return { min: null, max: 30 }
  if (temps === 'moyen')  return { min: 30,   max: 60 }
  if (temps === 'long')   return { min: 60,   max: null }
  return { min: null, max: null }
}

export const metadata = {
  title: 'Recettes Musique — Sweat & Sound',
  description: 'Des recettes de pâtisserie à écouter. Chaque duo avec une playlist ou un album.',
}

export default async function RecettesMusiqueePage({ searchParams }: Props) {
  const { niveau, temps } = await searchParams
  const { min, max } = parseTemps(temps)

  const [recettes, featuredMusique] = await Promise.all([
    client.fetch<Recette[]>(RECETTES_QUERY, {
      univers: 'musique', niveau: niveau ? Number(niveau) : null,
      tempsMin: min, tempsMax: max, categorie: null,
    }, { next: { revalidate: 300 } }),
    client.fetch<Recette | null>(FEATURED_MUSIQUE_QUERY, {}, { next: { revalidate: 3600 } }),
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
          <p className={styles.eyebrow}>Univers Musique</p>
          <h1 className={styles.titre}>🎵 Musique &amp; Pâtisserie</h1>
          <p className={styles.sub}>Lance la playlist. Préchauffe le four. Laisse la musique guider tes gestes.</p>
          <div className={styles.heroCtas}>
            <Link href="#recettes" className={styles.ctaBtn}>Voir les recettes</Link>
            <Link href="/communaute#proposer" className={styles.ctaSecondaire}>Proposer une playlist</Link>
          </div>
        </div>
      </header>

      {/* ── LISTE + FILTRES ── */}
      <section className={styles.liste} id="recettes">
        <div className={styles.listeInner}>
          <nav className={styles.tabs} aria-label="Filtrer par univers">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href}
                className={`${styles.tab} ${t.href === '/recettes/musique' ? styles.tabActive : ''}`}
              >{t.label}</Link>
            ))}
          </nav>
          <FiltreBar />
          <RecettesGrid recettes={recettes} messageVide="Aucune recette musique pour le moment — reviens bientôt !" />
        </div>
      </section>

      {/* ── LECTEUR SPOTIFY ── */}
      {featuredMusique?.musique?.spotifyUrl && (
        <section className={styles.spotify}>
          <div className={styles.spotifyInner}>
            <div className={styles.spotifyText}>
              <p className={styles.eyebrow}>🎵 À écouter</p>
              <h2 className={styles.sectionTitre}>{featuredMusique.musique.artiste}</h2>
              {featuredMusique.musique.titreAlbum && (
                <p className={styles.spotifyAlbum}>{featuredMusique.musique.titreAlbum}</p>
              )}
              {featuredMusique.musique.pourquoi && (
                <p className={styles.spotifySub}>{featuredMusique.musique.pourquoi}</p>
              )}
              {featuredMusique.musique.ambiance && (
                <span className={styles.spotifyAmbiance}>{featuredMusique.musique.ambiance}</span>
              )}
              <Link href={`/recettes/${featuredMusique.slug}`} className={styles.spotifyLien}>
                Voir la recette associée →
              </Link>
            </div>
            <div className={styles.spotifyPlayer}>
              <SpotifyEmbed url={featuredMusique.musique.spotifyUrl} />
            </div>
          </div>
        </section>
      )}

      {/* ── NOUVEAUTÉS MUSICALES (placeholder) ── */}
      <section className={styles.sorties}>
        <div className={styles.sortiesInner}>
          <p className={styles.eyebrow}>Cette semaine</p>
          <h2 className={styles.sectionTitre}>Nouveautés musicales</h2>
          <p className={styles.sortiesSub}>Les sorties musicales seront bientôt affichées via l'API Spotify.</p>
          <div className={styles.sortiesPlaceholder}>
            {['Nouveaux albums', 'Singles du moment', 'Playlists éditoriales'].map((item) => (
              <div key={item} className={styles.sortiesCard}>
                <span className={styles.sortiesEmoji}>🎵</span>
                <p className={styles.sortiesLabel}>{item}</p>
                <span className={styles.sortiesBientot}>Bientôt disponible</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
