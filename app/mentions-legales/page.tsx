import styles from './page.module.css'

export const metadata = {
  title: 'Mentions légales — Sweat & Sound',
}

export default function MentionsLegalesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Légal</p>
          <h1 className={styles.titre}>Mentions légales</h1>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Éditeur du site</h2>
            <p>Sweat &amp; Sound — site personnel à vocation non commerciale.</p>
            <p>Responsable de la publication : Océane (contact via le formulaire communauté).</p>
          </section>

          <section className={styles.section}>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
          </section>

          <section className={styles.section}>
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, recettes, design) est protégé par le droit d'auteur. Toute reproduction partielle ou totale est interdite sans autorisation préalable.</p>
          </section>

          <section className={styles.section}>
            <h2>Données personnelles (RGPD)</h2>
            <p>Ce site peut collecter des adresses email dans le cadre de la newsletter. Ces données sont utilisées uniquement pour l'envoi de la newsletter Sweat &amp; Sound.</p>
            <p>Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit : contactez-nous via le formulaire communauté.</p>
            <p>Vous pouvez vous désinscrire à tout moment en cliquant sur le lien de désinscription présent dans chaque email.</p>
          </section>

          <section className={styles.section}>
            <h2>Cookies</h2>
            <p>Ce site n'utilise pas de cookies de tracking. Des cookies techniques peuvent être utilisés pour le bon fonctionnement du site.</p>
          </section>

          <section className={styles.section}>
            <h2>Liens externes</h2>
            <p>Ce site contient des liens vers des services tiers (Spotify, YouTube, FNAC, Amazon). Sweat &amp; Sound n'est pas responsable du contenu de ces sites externes.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
