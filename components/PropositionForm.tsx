'use client'
import { useState, useTransition } from 'react'
import { submitProposition } from '@/app/actions/submitProposition'
import styles from './PropositionForm.module.css'

const TABS: { value: 'film' | 'musique' | 'livre'; label: string }[] = [
  { value: 'film',    label: '🎬 Film' },
  { value: 'musique', label: '🎵 Musique' },
  { value: 'livre',   label: '📚 Livre' },
]

export default function PropositionForm() {
  const [type, setType] = useState<'film' | 'musique' | 'livre'>('film')
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('type', type)

    startTransition(async () => {
      try {
        await submitProposition(formData)
        setSent(true)
      } catch {
        setError('Une erreur est survenue. Réessaie dans un moment.')
      }
    })
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <span className={styles.successEmoji} aria-hidden="true">🎉</span>
        <p className={styles.successTitre}>Merci pour ta proposition !</p>
        <p className={styles.successSub}>Elle sera examinée et soumise au vote très bientôt.</p>
        <button className={styles.resetBtn} onClick={() => setSent(false)}>
          Proposer une autre idée
        </button>
      </div>
    )
  }

  const placeholder = {
    film:    { titre: 'Ex : Amélie Poulain, La La Land…', auteur: 'Ex : Jean-Pierre Jeunet' },
    musique: { titre: 'Ex : Kind of Blue, Currents…', auteur: 'Ex : Miles Davis, Tame Impala' },
    livre:   { titre: 'Ex : La Passe-Miroir, 1984…', auteur: 'Ex : Christelle Dabos, Orwell' },
  }[type]

  return (
    <div className={styles.wrapper}>
      {/* Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Type de proposition">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={type === t.value}
            className={`${styles.tab} ${type === t.value ? styles.tabActive : ''}`}
            onClick={() => setType(t.value)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Titre {type === 'film' ? 'du film' : type === 'musique' ? 'de l\'album / playlist' : 'du livre'} *
          </span>
          <input
            name="titre"
            type="text"
            required
            placeholder={placeholder.titre}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            {type === 'film' ? 'Réalisateur·ice' : type === 'musique' ? 'Artiste / Groupe' : 'Auteur·ice'}
          </span>
          <input
            name="auteur"
            type="text"
            placeholder={placeholder.auteur}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>La recette que tu imagines</span>
          <input
            name="recetteSuggree"
            type="text"
            placeholder="Ex : Tarte au citron, Cookies noisette…"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Ton message (pourquoi ce duo ?)</span>
          <textarea
            name="message"
            rows={3}
            placeholder="Explique-nous pourquoi cette association fait sens…"
            className={`${styles.input} ${styles.textarea}`}
          />
        </label>

        <div className={styles.row}>
          <label className={`${styles.field} ${styles.fieldHalf}`}>
            <span className={styles.fieldLabel}>Ton prénom *</span>
            <input name="prenom" type="text" required placeholder="Ex : Océane" className={styles.input} />
          </label>
          <label className={`${styles.field} ${styles.fieldHalf}`}>
            <span className={styles.fieldLabel}>Ton email (optionnel)</span>
            <input name="email" type="email" placeholder="pour te tenir informé·e" className={styles.input} />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Envoi en cours…' : 'Envoyer mon idée →'}
        </button>
      </form>
    </div>
  )
}
