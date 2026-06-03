import Link from 'next/link'
import { client } from '@/sanity/client'
import {
  RECETTES_QUERY,
  TOP_DU_MOIS_QUERY,
  FEATURED_FILM_QUERY,
  FEATURED_MUSIQUE_QUERY,
  FEATURED_LIVRE_QUERY,
} from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecetteCard from '@/components/RecetteCard'
import NewsletterForm from '@/components/NewsletterForm'
import SortiesSection from '@/components/SortiesSection'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import SpotifyEmbed from '@/components/SpotifyEmbed'
import styles from './page.module.css'

export default async function HomePage() {
  const [recettes, topDuMois, featuredFilm, featuredMusique, featuredLivre] = await Promise.all([
    client.fetch<Recette[]>(RECETTES_QUERY, { univers: null, niveau: null, tempsMin: null, tempsMax: null, categorie: null }, { next: { revalidate: 3600 } }),
    client.fetch<Recette[]>(TOP_DU_MOIS_QUERY, { univers: null }, { next: { revalidate: 3600 } }),
    client.fetch<Recette | null>(FEATURED_FILM_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<Recette | null>(FEATURED_MUSIQUE_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch<Recette | null>(FEATURED_LIVRE_QUERY, {}, { next: { revalidate: 3600 } }),
  ])

  const selection = topDuMois.length > 0 ? topDuMois : recettes.slice(0, 3)

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Pâtisserie × Musique × Cinéma × Littérature</p>

          <h1 className={styles.heroTitle}>
            Sweat <em className={styles.amp}>&amp;</em> Sound
          </h1>

          <svg
            className={styles.wave}
            viewBox="0 0 400 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 16 C20 4 36 28 52 16 C68 4 84 28 100 16 C116 4 132 28 148 16 C164 4 180 28 196 16 C212 4 228 28 244 16 C260 4 276 28 292 16 C308 4 324 28 340 16 C356 4 372 28 388 16"
              stroke="var(--roux)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="600"
              className={styles.wavePath}
            />
          </svg>

          <p className={styles.heroTagline}>
            Des recettes qui vont avec un film, une playlist ou un livre
          </p>

          <div className={styles.heroCtas}>
            <Link href="/recettes" className={styles.ctaPrimary}>Explorer les recettes</Link>
            <Link href="/communaute#proposer" className={styles.ctaSecondary}>Proposer un duo</Link>
          </div>
        </div>

        <div className={styles.tornEdge} aria-hidden="true">
          <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,48 L0,28 C12,10 24,42 36,22 C48,4 60,38 72,20 C84,2 96,40 108,18 C120,0 132,36 144,24 C156,12 168,44 180,22 C192,4 204,38 216,20 C228,2 240,40 252,18 C264,0 276,36 288,24 C300,14 312,46 324,24 C336,6 348,38 360,20 C372,4 384,40 396,18 C408,0 420,36 432,24 C444,14 456,44 468,22 C480,4 492,38 504,20 C516,2 528,40 540,18 C552,0 564,36 576,24 C588,14 600,46 612,24 C624,6 636,38 648,20 C660,4 672,40 684,18 C696,0 708,36 720,24 C732,14 744,44 756,22 C768,4 780,38 792,20 C804,2 816,40 828,18 C840,0 852,36 864,24 C876,14 888,46 900,24 C912,6 924,38 936,20 C948,4 960,40 972,18 C984,0 996,36 1008,24 C1020,14 1032,44 1044,22 C1056,4 1068,38 1080,20 C1092,2 1104,40 1116,18 C1128,0 1140,36 1152,24 C1164,14 1176,46 1188,24 C1200,6 1212,38 1224,20 C1236,4 1248,40 1260,18 C1272,0 1284,36 1296,24 C1308,14 1320,44 1332,22 C1344,4 1356,38 1368,20 C1380,2 1392,40 1404,18 C1416,0 1428,36 1440,24 L1440,48 Z" fill="var(--creme)"/>
          </svg>
        </div>
      </section>

      {/* ── PRÉSENTATION DU CONCEPT ──────────────────────── */}
      <section className={styles.concept}>
        <div className={styles.conceptInner}>
          <div className={styles.conceptTexte}>
            <p className={styles.eyebrow}>Le concept</p>
            <h2 className={styles.sectionTitre}>Une recette pour chaque univers</h2>
            <p className={styles.conceptSub}>
              Sweat &amp; Sound, c'est l'endroit où la pâtisserie rencontre la culture.
              Chaque recette est associée à un film, un album ou un livre. Cuisine pendant que tu regardes, écoutes ou lis.
            </p>
          </div>
          <div className={styles.conceptCards}>
            {[
              { emoji: '🎬', label: 'Films', desc: 'Des recettes nées d\'une scène, d\'une ambiance, d\'une palette de couleurs.', href: '/recettes/film', color: 'var(--choco)' },
              { emoji: '🎵', label: 'Musique', desc: 'La playlist qui guide tes gestes. Le tempo qui fait tourner le beurre.', href: '/recettes/musique', color: 'var(--roux)' },
              { emoji: '📚', label: 'Livres', desc: 'Les saveurs qui habitent les pages. La recette du personnage.', href: '/recettes/livre', color: 'var(--choco-2)' },
            ].map((c) => (
              <Link key={c.label} href={c.href} className={styles.conceptCard} style={{ '--card-color': c.color } as React.CSSProperties}>
                <span className={styles.conceptEmoji} aria-hidden="true">{c.emoji}</span>
                <h3 className={styles.conceptLabel}>{c.label}</h3>
                <p className={styles.conceptDesc}>{c.desc}</p>
                <span className={styles.conceptArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SÉLECTION DE RECETTES ────────────────────────── */}
      <section className={styles.grille} id="recettes">
        <div className={styles.grilleInner}>
          <div className={styles.grilleHeader}>
            <h2 className={styles.sectionTitre}>
              {topDuMois.length > 0 ? '⭐ Top du mois' : 'Les recettes'}
            </h2>
            <p className={styles.sectionSub}>Chaque duo est une expérience sensorielle.</p>
          </div>

          {selection.length > 0 ? (
            <div className={styles.grilleGrid}>
              {selection.map((r) => <RecetteCard key={r._id} recette={r} />)}
            </div>
          ) : (
            <div className={styles.grillePlaceholder}>
              <p>Les recettes arrivent bientôt — ajoutes-en via le Studio Sanity !</p>
            </div>
          )}

          <div className={styles.grilleMore}>
            <Link href="/recettes" className={styles.btnOutline}>Toutes les recettes →</Link>
          </div>
        </div>
      </section>

      {/* ── SORTIES (API) ────────────────────────────────── */}
      <SortiesSection />

      {/* ── SECTION VIDÉO (Film) ─────────────────────────── */}
      {featuredFilm?.film?.youtubeUrl && (
        <section className={styles.videoSection}>
          <div className={styles.videoInner}>
            <div className={styles.videoTexte}>
              <p className={styles.eyebrow}>🎬 Films</p>
              <h2 className={styles.sectionTitre}>{featuredFilm.film.titre}</h2>
              {featuredFilm.film.pourquoi && (
                <p className={styles.videoCitation}>« {featuredFilm.film.pourquoi} »</p>
              )}
              <Link href={`/recettes/${featuredFilm.slug}`} className={styles.videoLien}>
                Voir la recette associée →
              </Link>
              <Link href="/recettes/film" className={styles.videoAll}>
                Toutes les recettes film →
              </Link>
            </div>
            <div className={styles.videoEmbed}>
              <YoutubeEmbed url={featuredFilm.film.youtubeUrl} title={featuredFilm.film.titre} />
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION MUSIQUE (Spotify) ─────────────────────── */}
      {featuredMusique?.musique?.spotifyUrl && (
        <section className={styles.musiqueSection}>
          <div className={styles.musiqueInner}>
            <div className={styles.musiqueTexte}>
              <p className={styles.eyebrow}>🎵 Musique</p>
              <h2 className={styles.musiqueArtiste}>{featuredMusique.musique.artiste}</h2>
              {featuredMusique.musique.titreAlbum && (
                <p className={styles.musiqueAlbum}>{featuredMusique.musique.titreAlbum}</p>
              )}
              {featuredMusique.musique.pourquoi && (
                <p className={styles.musicSub}>{featuredMusique.musique.pourquoi}</p>
              )}
              <Link href={`/recettes/${featuredMusique.slug}`} className={styles.videoLien}>
                Voir la recette associée →
              </Link>
              <Link href="/recettes/musique" className={styles.videoAll}>
                Toutes les recettes musique →
              </Link>
            </div>
            <div className={styles.musiquePlayer}>
              <SpotifyEmbed url={featuredMusique.musique.spotifyUrl} compact />
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION LIVRE ────────────────────────────────── */}
      {featuredLivre?.livre && (
        <section className={styles.livreSection}>
          <div className={styles.livreInner}>
            <div className={styles.livreTexte}>
              <p className={styles.eyebrow}>📚 Livres</p>
              <h2 className={styles.sectionTitre}>{featuredLivre.livre.titre}</h2>
              {featuredLivre.livre.auteur && (
                <p className={styles.livreAuteur}>par {featuredLivre.livre.auteur}</p>
              )}
              {featuredLivre.livre.resume && (
                <p className={styles.livreResume}>{featuredLivre.livre.resume}</p>
              )}
              <Link href={`/recettes/${featuredLivre.slug}`} className={styles.videoLien}>
                Voir la recette associée →
              </Link>
              <Link href="/recettes/livre" className={styles.videoAll}>
                Toutes les recettes livre →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA COMMUNAUTÉ ───────────────────────────────── */}
      <section className={styles.ctaCommunaute}>
        <div className={styles.ctaInner}>
          <span className={styles.ctaEmoji} aria-hidden="true">👩‍🍳</span>
          <h2 className={styles.ctaTitle}>Tu as un duo en tête&nbsp;?</h2>
          <p className={styles.ctaText}>
            Un film qui mérite une recette. Une playlist qui a un goût particulier.
            Partage ton idée — si elle est retenue, tu rejoins le Hall of Fame.
          </p>
          <Link href="/communaute#proposer" className={styles.ctaBtn}>
            Proposer un duo →
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <h2 className={styles.newsletterTitle}>
              Une recette par semaine,<br />dans ta boîte mail.
            </h2>
            <p className={styles.newsletterSub}>
              Avec la playlist ou le film qui va avec. Évidemment.
            </p>
          </div>
          <div className={styles.newsletterForm}>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  )
}
