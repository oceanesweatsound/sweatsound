import Link from 'next/link'
import Image from 'next/image'
import styles from './SortiesSection.module.css'
import { getUpcomingFilms, tmdbPosterUrl, formatReleaseDate } from '@/lib/tmdb'
import { client } from '@/sanity/client'
import { COUPS_DE_COEUR_LIVRES_QUERY } from '@/sanity/queries'

export default async function SortiesSection() {
  // Films via TMDB — 3 premiers pour la preview HP
  let upcomingFilms: Awaited<ReturnType<typeof getUpcomingFilms>> = []
  try {
    const all = await getUpcomingFilms()
    upcomingFilms = all.slice(0, 3)
  } catch {
    // fallback silencieux
  }

  // Livres via Sanity (mis à jour par agent automatique)
  const fetchOpts = process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' as const }
    : { next: { revalidate: 3600 } }
  const coupsDeCoeur = await client.fetch(
    COUPS_DE_COEUR_LIVRES_QUERY, {}, fetchOpts
  ).catch(() => null)
  type LivreCoup = { titre: string; auteur?: string; dateParution?: string; couvertureUrl?: string; lienFiche?: string }
  const newBooks: LivreCoup[] = (coupsDeCoeur?.livres ?? []).slice(0, 3)

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Cette semaine</p>
          <h2 className={styles.titre}>Sorties &amp; nouveautés</h2>
          <p className={styles.sub}>Films, musiques, livres — les sorties qui inspireront les prochaines recettes.</p>
        </div>

        <div className={styles.grid}>

          {/* ── FILMS (TMDB live) ── */}
          <div className={`${styles.card} ${styles.card_film}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji} aria-hidden="true">🎬</span>
              <h3 className={styles.cardTitre}>Films à l&apos;affiche</h3>
            </div>

            {upcomingFilms.length > 0 ? (
              <div className={styles.filmGrid}>
                {upcomingFilms.map((film) => {
                  const poster = tmdbPosterUrl(film.poster_path, 'w185')
                  return (
                    <div key={film.id} className={styles.filmItem}>
                      {poster ? (
                        <div className={styles.filmPoster}>
                          <Image
                            src={poster}
                            alt={film.title}
                            width={80}
                            height={120}
                            className={styles.filmPosterImg}
                          />
                        </div>
                      ) : (
                        <div className={styles.filmPosterEmpty}>🎬</div>
                      )}
                      <p className={styles.filmDate}>{formatReleaseDate(film.release_date)}</p>
                      <p className={styles.filmTitre}>{film.title}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <ul className={styles.cardList}>
                <li className={styles.cardItem}>
                  <span className={styles.cardItemTitre}>Nouvelles sorties cinéma</span>
                  <span className={styles.cardItemDetail}>Mise à jour chaque semaine</span>
                </li>
                <li className={styles.cardItem}>
                  <span className={styles.cardItemTitre}>Bandes-annonces & critiques</span>
                  <span className={styles.cardItemDetail}>Via TMDB API</span>
                </li>
              </ul>
            )}

            <div className={styles.cardFooter}>
              {upcomingFilms.length > 0 ? (
                <Link href="/recettes/film" className={styles.cardLien}>
                  Voir toutes les sorties →
                </Link>
              ) : (
                <>
                  <span className={styles.comingSoon}>Bientôt disponible</span>
                  <Link href="/recettes/film" className={styles.cardLien}>Voir les recettes →</Link>
                </>
              )}
            </div>
          </div>

          {/* ── MUSIQUE (placeholder) ── */}
          <div className={`${styles.card} ${styles.card_musique}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji} aria-hidden="true">🎵</span>
              <h3 className={styles.cardTitre}>Sorties musicales</h3>
            </div>
            <ul className={styles.cardList}>
              {[
                { titre: 'Nouveaux albums', detail: 'Mise à jour chaque semaine' },
                { titre: 'Singles & EP du moment', detail: 'Via Spotify API' },
                { titre: 'Playlists éditoriales', detail: 'Humeurs & genres' },
              ].map((item) => (
                <li key={item.titre} className={styles.cardItem}>
                  <span className={styles.cardItemTitre}>{item.titre}</span>
                  <span className={styles.cardItemDetail}>{item.detail}</span>
                </li>
              ))}
            </ul>
            <div className={styles.cardFooter}>
              <span className={styles.comingSoon}>Bientôt disponible</span>
              <Link href="/recettes/musique" className={styles.cardLien}>Voir les recettes →</Link>
            </div>
          </div>

          {/* ── LIVRES (Google Books live) ── */}
          <div className={`${styles.card} ${styles.card_livre}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji} aria-hidden="true">📚</span>
              <h3 className={styles.cardTitre}>Livres à paraître</h3>
            </div>

            {newBooks.length > 0 ? (
              <div className={styles.filmGrid}>
                {newBooks.map((book) => {
                  const inner = (
                    <>
                      {book.couvertureUrl ? (
                        <div className={styles.filmPoster}>
                          <Image
                            src={book.couvertureUrl}
                            alt={book.titre}
                            width={80}
                            height={120}
                            className={styles.filmPosterImg}
                          />
                        </div>
                      ) : (
                        <div className={styles.filmPosterEmpty}>📚</div>
                      )}
                      <p className={styles.filmDate}>{book.dateParution}</p>
                      <p className={styles.filmTitre}>{book.titre}</p>
                    </>
                  )
                  return book.lienFiche ? (
                    <a key={book.titre} href={book.lienFiche} target="_blank" rel="noopener noreferrer" className={styles.filmItem}>
                      {inner}
                    </a>
                  ) : (
                    <div key={book.titre} className={styles.filmItem}>{inner}</div>
                  )
                })}
              </div>
            ) : (
              <ul className={styles.cardList}>
                {[
                  { titre: 'Romans & essais du mois', detail: 'Mise à jour chaque semaine' },
                  { titre: 'Coups de coeur libraires', detail: 'Via Google Books API' },
                  { titre: 'Genres & nouveautés', detail: 'Fiction, SF, BD, Manga…' },
                ].map((item) => (
                  <li key={item.titre} className={styles.cardItem}>
                    <span className={styles.cardItemTitre}>{item.titre}</span>
                    <span className={styles.cardItemDetail}>{item.detail}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.cardFooter}>
              {newBooks.length > 0 ? (
                <Link href="/recettes/livre" className={styles.cardLien}>
                  Voir toutes les sorties →
                </Link>
              ) : (
                <>
                  <span className={styles.comingSoon}>Bientôt disponible</span>
                  <Link href="/recettes/livre" className={styles.cardLien}>Voir les recettes →</Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
