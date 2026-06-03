'use client'
import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  return (
    <>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()} aria-label="Formulaire d'inscription newsletter">
        <label htmlFor="nl-email" className="sr-only">Adresse email</label>
        <input
          type="email"
          id="nl-email"
          placeholder="ton@email.com"
          className={styles.input}
          autoComplete="email"
          required
        />
        <button type="submit" className={styles.btn}>S'abonner</button>
      </form>
      <p className={styles.note}>Gratuit · Désinscription en 1 clic · Zéro spam</p>
    </>
  )
}
