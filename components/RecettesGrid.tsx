import type { Recette } from '@/types/recette'
import RecetteCard from './RecetteCard'
import styles from './RecettesGrid.module.css'

interface Props {
  recettes: Recette[]
  messageVide?: string
}

export default function RecettesGrid({ recettes, messageVide = 'Aucune recette pour le moment. Reviens bientôt !' }: Props) {
  if (recettes.length === 0) {
    return (
      <div className={styles.vide}>
        <span className={styles.videEmoji} aria-hidden="true">🍪</span>
        <p className={styles.videTexte}>{messageVide}</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {recettes.map((r) => (
        <RecetteCard key={r._id} recette={r} />
      ))}
    </div>
  )
}
