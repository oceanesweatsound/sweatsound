'use client'
import { Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './FiltreBar.module.css'

const NIVEAUX = [
  { label: 'Facile',    value: '1' },
  { label: 'Moyen',     value: '2' },
  { label: 'Difficile', value: '3' },
]

const TEMPS = [
  { label: '≤ 30 min',  value: 'rapide' },
  { label: '30–60 min', value: 'moyen'  },
  { label: '+ 60 min',  value: 'long'   },
]

interface FiltreBarProps {
  categories?: string[]
  categorieLabel?: string
}

function FiltreBarre({ categories, categorieLabel = 'Catégorie' }: FiltreBarProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const pathname     = usePathname()

  const niveau    = searchParams.get('niveau')    ?? ''
  const temps     = searchParams.get('temps')     ?? ''
  const categorie = searchParams.get('categorie') ?? ''

  const hasFilters = !!(niveau || temps || categorie)

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) params.delete(key)
    else params.set(key, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function toggle(key: string, value: string, current: string) {
    setParam(key, current === value ? '' : value)
  }

  function reset() {
    router.push(pathname, { scroll: false })
  }

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        {/* Difficulté */}
        <div className={styles.group}>
          <span className={styles.label}>Difficulté</span>
          <div className={styles.chips}>
            {NIVEAUX.map((n) => (
              <button
                key={n.value}
                className={`${styles.chip} ${niveau === n.value ? styles.active : ''}`}
                onClick={() => toggle('niveau', n.value, niveau)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Temps */}
        <div className={styles.group}>
          <span className={styles.label}>Temps</span>
          <div className={styles.chips}>
            {TEMPS.map((t) => (
              <button
                key={t.value}
                className={`${styles.chip} ${temps === t.value ? styles.active : ''}`}
                onClick={() => toggle('temps', t.value, temps)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button className={styles.reset} onClick={reset} aria-label="Effacer les filtres">
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Catégorie — ligne séparée, visible uniquement si des catégories sont passées */}
      {categories && categories.length > 0 && (
        <div className={styles.groupCategorie}>
          <span className={styles.label}>{categorieLabel}</span>
          <div className={styles.chips}>
            {categories.map((c) => (
              <button
                key={c}
                className={`${styles.chip} ${styles.chipCategorie} ${categorie === c ? styles.activeCategorie : ''}`}
                onClick={() => toggle('categorie', c, categorie)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FiltreBar(props: FiltreBarProps) {
  return (
    <Suspense fallback={<div className={styles.placeholder} />}>
      <FiltreBarre {...props} />
    </Suspense>
  )
}
