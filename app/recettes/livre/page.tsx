import { client } from '@/sanity/client'
import { RECETTES_QUERY, FEATURED_LIVRE_QUERY } from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecettesGrid from '@/components/RecettesGrid'
import FiltreBar from '@/components/FiltreBar'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { COUPS_DE_COEUR_LIVRES_QUERY } from '@/sanity/queries'

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
  title: 'Recettes Livre — Sweat & Sound',
  description: 'Des recettes de pâtisserie inspirées par des livres. Lis, pâtisse, savoure.',
}

export default async function RecettesLivrePage({ searchParams }: Props) {
  const { niveau, temps } = await searchParams
  const { min, max } = parseTemps(temps)

  const [recettes, featuredLivre, coupsDeCoeur] = await Promise.all([
    client.fetch<Recette[]>(RECETTES_QUERY, {
      univers: 'livre', niveau: niveau ? Number(niveau) : null,
      tempsMin: min, tempsMax: max, categorie: null,
    }, { next: { revalidate: 300 } }),
    client.fetch<Recette | null>(FEATURED_LIVRE_QUERY, {}, { next: { revalidate: 3600 } }),
    client.fetch(COUPS_DE_COEUR_LIVRES_QUERY, {}, process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : { next: { revalidate: 3600 } }).catch(() => null),
  ])
  type LivreCoup = { titre: string; auteur?: string; dateParution?: string; couvertureUrl?: string; lienFiche?: string }
  const newBooks: LivreCoup[] = coupsDeCoeur?.livres ?? []

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
          <p className={styles.eyebrow}>Univers Livre</p>
          <h1 className={styles.titre}>📚 Livres &amp; Pâtisserie</h1>
          <p className={styles.sub}>Ouvre un livre, allume le four. Les deux vont étonnamment bien ensemble.</p>
          <div className={styles.heroCtas}>
            <Link href="#recettes" className={styles.ctaBtn}>Voir les recettes</Link>
            <Link href="/communaute#proposer" className={styles.ctaSecondaire}>Proposer un livre</Link>
          </div>
        </div>
      </header>

      {/* ── LISTE + FILTRES ── */}
      <section className={styles.liste} id="recettes">
        <div className={styles.listeInner}>
          <nav className={styles.tabs} aria-label="Filtrer par univers">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href}
                className={`${styles.tab} ${t.href === '/recettes/livre' ? styles.tabActive : ''}`}
              >{t.label}</Link>
            ))}
          </nav>
          <FiltreBar />
          <RecettesGrid recettes={recettes} messageVide="Aucune recette livre pour le moment — reviens bientôt !" />
        </div>
      </section>

      {/* ── RÉSUMÉ DU LIVRE VEDETTE ── */}
      {featuredLivre?.livre && (
        <section className={styles.livreVedette}>
          <div className={styles.livreInner}>
            {featuredLivre.livre.couvertureUrl && (
              <div className={styles.livreCouverture}>
                <Image
                  src={featuredLivre.livre.couvertureUrl}
                  alt={featuredLivre.livre.titre ?? featuredLivre.nom}
                  width={200}
                  height={300}
                  className={styles.livreCouvertureImg}
                />
              </div>
            )}
            <div className={styles.livreTexte}>
              <p className={styles.eyebrow}>📚 Le livre du moment</p>
              <h2 className={styles.sectionTitre}>{featuredLivre.livre.titre}</h2>
              {featuredLivre.livre.auteur && (
                <p className={styles.livreAuteur}>par {featuredLivre.livre.auteur}</p>
              )}
              {featuredLivre.livre.genre && (
                <span className={styles.livreGenre}>{featuredLivre.livre.genre}</span>
              )}
              {featuredLivre.livre.resume && (
                <p className={styles.livreResume}>{featuredLivre.livre.resume}</p>
              )}
              {featuredLivre.livre.pourquoi && (
                <p className={styles.livrePourquoi}>« {featuredLivre.livre.pourquoi} »</p>
              )}
              <div className={styles.livreCtas}>
                <Link href={`/recettes/${featuredLivre.slug}`} className={styles.livreCtaRecette}>
                  Voir la recette associée →
                </Link>
                {featuredLivre.livre.lienAcheter && (
                  <a href={featuredLivre.livre.lienAcheter} target="_blank" rel="noopener noreferrer" className={styles.livreCtaAcheter}>
                    Commander le livre ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── NOUVEAUTÉS LIVRES (Google Books) ── */}
      {newBooks.length > 0 && (
        <section className={styles.sorties}>
          <div className={styles.sortiesInner}>
            <p className={styles.eyebrow}>Cette semaine</p>
            <h2 className={styles.sectionTitre}>Nouvelles parutions</h2>
            <p className={styles.sortiesSub}>Les dernières sorties littéraires en français.</p>
            <div className={styles.sortiesGrid}>
              {newBooks.map((book: LivreCoup) => {
                const inner = (
                  <>
                    {book.couvertureUrl ? (
                      <div className={styles.sortiesCover}>
                        <Image
                          src={book.couvertureUrl}
                          alt={book.titre}
                          width={128}
                          height={192}
                          className={styles.sortiesCoverImg}
                        />
                      </div>
                    ) : (
                      <div className={styles.sortiesCoverEmpty}>📚</div>
                    )}
                    <div className={styles.sortiesInfo}>
                      <p className={styles.sortiesDate}>{book.dateParution}</p>
                      <p className={styles.sortiesTitre}>{book.titre}</p>
                      {book.auteur && (
                        <p className={styles.sortiesAuteur}>{book.auteur}</p>
                      )}
                    </div>
                  </>
                )
                return book.lienFiche ? (
                  <a key={book.titre} href={book.lienFiche} target="_blank" rel="noopener noreferrer" className={styles.sortiesCard}>
                    {inner}
                  </a>
                ) : (
                  <div key={book.titre} className={styles.sortiesCard}>{inner}</div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
