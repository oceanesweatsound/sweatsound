import Link from 'next/link'
import Image from 'next/image'
import type { Recette } from '@/types/recette'
import styles from './RecetteCard.module.css'

const NIVEAU_LABELS: Record<number, string> = { 1: 'Facile', 2: 'Moyen', 3: 'Difficile' }

export default function RecetteCard({ recette }: { recette: Recette }) {
  const isFilm    = recette.univers === 'film'
  const isMusique = recette.univers === 'musique'
  const emoji     = isFilm ? '🎬' : isMusique ? '🎵' : '📚'
  const label     = isFilm ? 'Film' : isMusique ? 'Musique' : 'Livre'

  const universNom =
    recette.universNom ??
    recette.film?.titre ??
    recette.musique?.artiste ??
    recette.livre?.titre ??
    ''

  return (
    <Link
      href={`/recettes/${recette.slug}`}
      className={styles.card}
      aria-label={`${recette.nom} — ${label} — ${recette.temps} minutes`}
    >
      {/* ── Image / fond ── */}
      <div className={styles.img} style={{ background: recette.couleurBg ?? '#E8D8BE' }}>
        {recette.photoUrl ? (
          <Image
            src={recette.photoUrl}
            alt={recette.nom}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className={styles.photo}
          />
        ) : (
          <span className={styles.emoji} aria-hidden="true">{emoji}</span>
        )}
        <div className={styles.corner} aria-hidden="true" />
      </div>

      {/* ── Corps texte ── */}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{recette.temps} min</span>
          {recette.niveau && (
            <span className={styles.niveau}>{NIVEAU_LABELS[recette.niveau]}</span>
          )}
        </div>
        <h3 className={styles.nom}>{recette.nom}</h3>
        {recette.humeur && recette.humeur.length > 0 && (
          <div className={styles.humeurs}>
            {recette.humeur.slice(0, 2).map((h) => (
              <span key={h} className={styles.humeurTag}>{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Association — bande colorée pleine largeur ── */}
      {universNom && (
        <div className={`${styles.assocBand} ${
          isFilm ? styles.assocFilm : isMusique ? styles.assocMusique : styles.assocLivre
        }`}>
          <span className={styles.assocEmoji} aria-hidden="true">{emoji}</span>
          <span className={styles.assocNom}>{universNom}</span>
          <span className={styles.assocArrow} aria-hidden="true">→</span>
        </div>
      )}
    </Link>
  )
}
