import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'À propos — Sweat & Sound',
  description: 'Le concept Sweat & Sound : des recettes de pâtisserie associées à un film, une musique ou un livre.',
}

const ETAPES = [
  { num: '01', titre: 'Choisir son univers', texte: 'Un film que tu as envie de regarder, une playlist qui tourne en boucle ou un livre qui traîne sur ta table de nuit.' },
  { num: '02', titre: 'Trouver la recette', texte: 'Chaque film, chaque album, chaque livre a sa recette. Une association pensée pour l\'ambiance, les couleurs, les émotions.' },
  { num: '03', titre: 'Cuisiner & savourer', texte: 'Lance la bande-annonce. Mets la playlist. Ouvre le livre. Et prépare ta recette pendant — ou juste avant.' },
]

const UNIVERS = [
  { emoji: '🎬', label: 'Film', desc: 'Des recettes nées de scènes iconiques, de palettes de couleurs, d\'atmosphères cinématographiques.', href: '/recettes/film' },
  { emoji: '🎵', label: 'Musique', desc: 'La playlist qui rythme tes gestes. Le tempo qui donne envie de faire tourner le beurre.', href: '/recettes/musique' },
  { emoji: '📚', label: 'Livre', desc: 'Les saveurs qui habitent les pages. La recette que le personnage aurait cuisinée.', href: '/recettes/livre' },
]

export default function AProposPage() {
  return (
    <main className={styles.main}>
      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Le projet</p>
          <h1 className={styles.titre}>Sweat<em className={styles.amp}>&amp;</em>Sound</h1>
          <p className={styles.tagline}>Pâtisserie × Musique × Cinéma × Littérature</p>
        </div>
      </header>

      {/* ── MANIFESTE ── */}
      <section className={styles.manifeste}>
        <div className={styles.manifesteInner}>
          <div className={styles.manifesteTexte}>
            <h2 className={styles.manifesteTitre}>Pourquoi Sweat &amp; Sound ?</h2>
            <p className={styles.manifestePara}>
              Tout a commencé avec une évidence : certains films ont un goût. Certaines musiques ont une texture.
              Certains livres donnent envie de faire de la pâtisserie.
            </p>
            <p className={styles.manifestePara}>
              Sweat &amp; Sound, c'est l'endroit où ces deux univers se rencontrent. Des recettes pensées pour accompagner un film, une playlist ou un livre — ou l'inverse, un film trouvé parce qu'on cherchait une recette.
            </p>
            <p className={styles.manifestePara}>
              Pas de recettes de chef étoilé. Pas de techniques intimidantes. Des recettes qu'on fait en sweat, avec une bonne ambiance sonore ou visuelle, pour le plaisir du moment.
            </p>
          </div>
          <div className={styles.manifesteCitation}>
            <blockquote className={styles.citation}>
              « La pâtisserie est à la cuisine ce que la poésie est à la prose. »
            </blockquote>
            <p className={styles.citationSource}>— Marie-Antoine Carême</p>
          </div>
        </div>
      </section>

      {/* ── LES 3 UNIVERS ── */}
      <section className={styles.univers}>
        <div className={styles.universInner}>
          <h2 className={styles.sectionTitre}>Les trois univers</h2>
          <div className={styles.universGrid}>
            {UNIVERS.map((u) => (
              <Link key={u.label} href={u.href} className={styles.universCard}>
                <span className={styles.universEmoji} aria-hidden="true">{u.emoji}</span>
                <h3 className={styles.universLabel}>{u.label}</h3>
                <p className={styles.universDesc}>{u.desc}</p>
                <span className={styles.universLien}>Explorer →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className={styles.comment}>
        <div className={styles.commentInner}>
          <h2 className={styles.sectionTitre}>Comment ça marche ?</h2>
          <div className={styles.etapes}>
            {ETAPES.map((e) => (
              <div key={e.num} className={styles.etape}>
                <span className={styles.etapeNum}>{e.num}</span>
                <div>
                  <h3 className={styles.etapeTitre}>{e.titre}</h3>
                  <p className={styles.etapeTexte}>{e.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitre}>Prêt·e à cuisiner ?</h2>
          <p className={styles.ctaSub}>Choisis ton univers et trouve la recette qui te correspond.</p>
          <div className={styles.ctaBtns}>
            <Link href="/recettes" className={styles.ctaBtn}>Voir toutes les recettes</Link>
            <Link href="/communaute" className={styles.ctaSecondaire}>Proposer une idée</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
