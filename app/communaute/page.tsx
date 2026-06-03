import { client } from '@/sanity/client'
import { PROPOSITIONS_QUERY } from '@/sanity/queries'
import type { Proposition } from '@/types/recette'
import PropositionForm from '@/components/PropositionForm'
import VoteButton from '@/components/VoteButton'
import styles from './page.module.css'

export const metadata = {
  title: 'Communauté — Sweat & Sound',
  description: 'Propose un duo film/musique/livre + recette, vote pour les idées de la communauté.',
}

const ICONES: Record<string, string> = { film: '🎬', musique: '🎵', livre: '📚' }
const LABELS: Record<string, string> = { film: 'Film', musique: 'Musique', livre: 'Livre' }

export default async function CommunautePage() {
  const propositions = await client.fetch<Proposition[]>(
    PROPOSITIONS_QUERY, {},
    { next: { revalidate: 60 } }
  )

  const enVote    = propositions.filter((p) => p.statut === 'en_attente')
  const retenues  = propositions.filter((p) => p.statut === 'retenu')

  return (
    <main className={styles.main}>
      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Sweat &amp; Sound</p>
          <h1 className={styles.titre}>La communauté</h1>
          <p className={styles.sub}>
            Des idées de duos viennent de partout. Les meilleures finissent dans le site.
          </p>
        </div>
      </header>

      {/* ── PROPOSER UNE IDÉE ── */}
      <section className={styles.proposer} id="proposer">
        <div className={styles.proposerInner}>
          <div className={styles.proposerTexte}>
            <p className={styles.sectionEyebrow}>Participer</p>
            <h2 className={styles.sectionTitre}>Propose un duo</h2>
            <p className={styles.sectionSub}>
              Un film qui mérite une recette. Un album avec un goût particulier.
              Un livre qui donne faim. Envoie ton idée — si elle est retenue,
              ton prénom apparaît dans le Hall of Fame.
            </p>
            <ul className={styles.regles}>
              <li>✦ Film, Musique ou Livre — les trois univers sont ouverts</li>
              <li>✦ Suggère une recette si tu en as une en tête</li>
              <li>✦ La communauté vote, nous cuisinons les meilleures</li>
            </ul>
          </div>
          <div className={styles.proposerForm}>
            <PropositionForm />
          </div>
        </div>
      </section>

      {/* ── VOTES ── */}
      <section className={styles.votes} id="votes">
        <div className={styles.votesInner}>
          <div className={styles.votesHeader}>
            <p className={styles.sectionEyebrow}>Voter</p>
            <h2 className={styles.sectionTitre}>Les idées en vote</h2>
            <p className={styles.sectionSub}>Soutiens les idées qui te parlent. Chaque vote compte.</p>
          </div>

          {enVote.length === 0 ? (
            <div className={styles.vide}>
              <p>Aucune proposition pour le moment. Sois le premier à en soumettre une !</p>
            </div>
          ) : (
            <div className={styles.votesList}>
              {enVote.map((p) => (
                <div key={p._id} className={styles.voteCard}>
                  <div className={`${styles.voteType} ${styles[`voteType_${p.type}`]}`}>
                    <span aria-hidden="true">{ICONES[p.type]}</span>
                    <span>{LABELS[p.type]}</span>
                  </div>

                  <div className={styles.voteInfo}>
                    <p className={styles.voteNom}>{p.titre}</p>
                    {p.auteur && <p className={styles.voteMeta}>par {p.auteur}</p>}
                    {p.recetteSuggree && (
                      <p className={styles.voteRecette}>→ {p.recetteSuggree}</p>
                    )}
                    {p.message && <p className={styles.voteMessage}>{p.message}</p>}
                    {p.prenom && <p className={styles.voteAuteur}>Proposé par {p.prenom}</p>}
                  </div>

                  <VoteButton id={p._id} votes={p.votes} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HALL OF FAME ── */}
      {retenues.length > 0 && (
        <section className={styles.hof} id="hall-of-fame">
          <div className={styles.hofInner}>
            <p className={styles.sectionEyebrow}>Hall of Fame</p>
            <h2 className={styles.hofTitre}>🏆 Idées retenues</h2>
            <p className={styles.sectionSub}>Ces duos ont été cuisinés. Félicitations à leurs auteurs.</p>
            <div className={styles.hofGrid}>
              {retenues.map((p) => (
                <div key={p._id} className={styles.hofCard}>
                  <span className={styles.hofBadge}>✦ Retenu</span>
                  <span className={styles.hofEmoji} aria-hidden="true">{ICONES[p.type]}</span>
                  <p className={styles.hofNom}>{p.titre}</p>
                  {p.recetteSuggree && <p className={styles.hofRecette}>{p.recetteSuggree}</p>}
                  {p.prenom && <p className={styles.hofAuteur}>— {p.prenom}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
