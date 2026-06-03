import { client } from '@/sanity/client'
import { RECETTES_QUERY } from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecettesGrid from '@/components/RecettesGrid'
import FiltreBar from '@/components/FiltreBar'
import Link from 'next/link'
import styles from './page.module.css'

interface Props {
  searchParams: Promise<{ niveau?: string; temps?: string }>
}

function parseTemps(temps?: string): { min: number | null; max: number | null } {
  if (temps === 'rapide') return { min: null, max: 30 }
  if (temps === 'moyen')  return { min: 30,   max: 60 }
  if (temps === 'long')   return { min: 60,   max: null }
  return { min: null, max: null }
}

const UNIVERS_TABS = [
  { label: 'Toutes',   href: '/recettes',         univers: null },
  { label: '🎬 Films',   href: '/recettes/film',    univers: 'film' },
  { label: '🎵 Musique', href: '/recettes/musique', univers: 'musique' },
  { label: '📚 Livres',  href: '/recettes/livre',   univers: 'livre' },
]

export default async function RecettesPage({ searchParams }: Props) {
  const { niveau, temps } = await searchParams
  const { min, max } = parseTemps(temps)

  const recettes = await client.fetch<Recette[]>(
    RECETTES_QUERY,
    {
      univers:   null,
      niveau:    niveau ? Number(niveau) : null,
      tempsMin:  min,
      tempsMax:  max,
      categorie: null,
    },
    { next: { revalidate: 300 } }
  )

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Sweat &amp; Sound</p>
          <h1 className={styles.titre}>Toutes les recettes</h1>
          <p className={styles.sub}>
            {recettes.length} recette{recettes.length !== 1 ? 's' : ''} — Films, Musique &amp; Livres
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Onglets univers */}
        <nav className={styles.tabs} aria-label="Filtrer par univers">
          {UNIVERS_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.tab} ${tab.univers === null ? styles.tabActive : ''}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Filtres niveau & temps */}
        <FiltreBar />

        {/* Grille */}
        <RecettesGrid recettes={recettes} />
      </div>
    </main>
  )
}
