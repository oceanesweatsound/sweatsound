import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import {
  RECETTE_BY_SLUG_QUERY,
  SIMILAIRES_QUERY,
  SLUGS_QUERY,
} from '@/sanity/queries'
import type { Recette } from '@/types/recette'
import RecetteCard from '@/components/RecetteCard'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import SpotifyEmbed from '@/components/SpotifyEmbed'
import styles from './page.module.css'

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    SLUGS_QUERY,
    {},
    { next: { revalidate: 3600 } },
  )
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const recette = await client.fetch<Recette | null>(
    RECETTE_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  )
  if (!recette) return {}
  return {
    title: `${recette.nom} — Sweat & Sound`,
    description: recette.description,
  }
}

const NIVEAU_LABELS = ['', '★☆☆', '★★☆', '★★★']

const UNIVERS_EMOJI: Record<string, string> = {
  film: '🎬',
  musique: '🎵',
  livre: '📚',
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function RecettePage({ params }: Props) {
  const { slug } = await params

  const recette = await client.fetch<Recette | null>(
    RECETTE_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  )

  if (!recette) notFound()

  const similaires = await client.fetch<Recette[]>(
    SIMILAIRES_QUERY,
    { slug, univers: recette.univers },
    { next: { revalidate: 3600 } },
  )

  const emoji = UNIVERS_EMOJI[recette.univers] ?? '🍰'
  const isFilm    = recette.univers === 'film'
  const isMusique = recette.univers === 'musique'
  const isLivre   = recette.univers === 'livre'

  const badgeClass = isFilm
    ? styles.badgeFilm
    : isMusique
    ? styles.badgeMusique
    : styles.badgeLivre

  const badgeLabel = isFilm ? '🎬 Film' : isMusique ? '🎵 Musique' : '📚 Livre'

  const universHref = isFilm
    ? '/recettes/film'
    : isMusique
    ? '/recettes/musique'
    : '/recettes/livre'

  const universLabel = isFilm ? 'Films' : isMusique ? 'Musique' : 'Livres'

  return (
    <main>
      {/* ── HERO SPLITTÉ ──────────────────────────────── */}
      <section className={styles.hero}>
        <div
          className={styles.heroImage}
          style={{ background: recette.couleurBg ?? 'var(--choco)' }}
        >
          {recette.photoUrl ? (
            <Image
              src={recette.photoUrl}
              alt={recette.nom}
              fill
              style={{ objectFit: 'cover', opacity: 0.85 }}
              sizes="50vw"
              priority
            />
          ) : (
            <span
              className={styles.heroEmoji}
              role="img"
              aria-label={recette.univers}
            >
              {emoji}
            </span>
          )}
        </div>

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href={universHref}>{universLabel}</Link>
            <span aria-hidden="true">/</span>
            <span>{recette.nom}</span>
          </nav>

          <div className={styles.badges}>
            <span className={`${styles.badge} ${badgeClass}`}>
              {badgeLabel}
            </span>
            {recette.humeur?.map((h, i) => (
              <span
                key={h}
                className={styles.badgeHumeur}
                style={{ transform: `rotate(${i % 2 === 0 ? 1.5 : -1}deg)` }}
              >
                {h}
              </span>
            ))}
          </div>

          <h1 className={styles.titre}>{recette.nom}</h1>

          {recette.description && (
            <p className={styles.description}>{recette.description}</p>
          )}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{recette.temps} min</span>
              <span className={styles.statLabel}>Temps</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {recette.ingredients?.length ?? '—'}
              </span>
              <span className={styles.statLabel}>Ingrédients</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {NIVEAU_LABELS[recette.niveau]}
              </span>
              <span className={styles.statLabel}>Niveau</span>
            </div>
            {recette.quantite && (
              <div className={styles.stat}>
                <span className={styles.statValue}>{recette.quantite}</span>
                <span className={styles.statLabel}>Quantité</span>
              </div>
            )}
          </div>

          {/* ── Bloc univers ── */}
          <div className={styles.universBloc}>
            {isFilm && recette.film && (
              <div className={styles.universFilmLayout}>
                {/* Ligne 1 : affiche + identité du film */}
                <div className={styles.universFilmHeader}>
                  {recette.film.pochetteUrl && (
                    <div className={styles.universFilmPochette}>
                      <Image
                        src={recette.film.pochetteUrl}
                        alt={`Affiche — ${recette.film.titre ?? recette.nom}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="88px"
                      />
                    </div>
                  )}
                  <div className={styles.universFilmTexte}>
                    <p className={styles.universEyebrow}>🎬 Film</p>
                    <p className={styles.universTitre}>{recette.film.titre}</p>
                    {(recette.film.annee || recette.film.realisateur) && (
                      <p className={styles.universMeta}>
                        {[recette.film.annee, recette.film.realisateur]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ligne 2 : citation pleine largeur */}
                {recette.film.pourquoi && (
                  <p className={styles.universBlocText}>
                    « {recette.film.pourquoi} »
                  </p>
                )}

                {/* Plateformes */}
                {recette.film.plateformes &&
                  recette.film.plateformes.length > 0 && (
                    <p className={styles.universBlocSub}>
                      📺 {recette.film.plateformes.join(' · ')}
                    </p>
                  )}
              </div>
            )}

            {isMusique && recette.musique && (
              <>
                <p className={styles.universEyebrow}>🎵 Musique</p>
                <p className={styles.universTitre}>{recette.musique.artiste}</p>
                {recette.musique.titreAlbum && (
                  <p className={styles.universMeta}>{recette.musique.titreAlbum}</p>
                )}
                {recette.musique.pourquoi && (
                  <p className={styles.universBlocText}>
                    « {recette.musique.pourquoi} »
                  </p>
                )}
                {recette.musique.ambiance && (
                  <p className={styles.universBlocSub}>
                    Ambiance : {recette.musique.ambiance}
                  </p>
                )}
                {recette.musique.spotifyUrl ? (
                  <div className={styles.universEmbed}>
                    <SpotifyEmbed url={recette.musique.spotifyUrl} compact />
                  </div>
                ) : (
                  <p className={styles.spotifyPlaceholder}>
                    Cherche « {recette.musique.artiste} » sur Spotify 🎧
                  </p>
                )}
              </>
            )}

            {isLivre && recette.livre && (
              <>
                <p className={styles.universEyebrow}>📚 Livre</p>
                <p className={styles.universTitre}>{recette.livre.titre}</p>
                {recette.livre.auteur && (
                  <p className={styles.universMeta}>par {recette.livre.auteur}</p>
                )}
                {recette.livre.pourquoi && (
                  <p className={styles.universBlocText}>
                    « {recette.livre.pourquoi} »
                  </p>
                )}
                {recette.livre.resume && (
                  <p className={styles.livreResume}>{recette.livre.resume}</p>
                )}
                {recette.livre.lienAcheter && (
                  <a
                    href={recette.livre.lienAcheter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.livreLien}
                  >
                    🛒 Trouver ce livre →
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── CORPS RECETTE ─────────────────────────────── */}
      <section className={styles.corps}>
        <div className={styles.corpsInner}>
          {/* Sidebar ingrédients */}
          <aside className={styles.sidebar}>
            {recette.ingredients && recette.ingredients.length > 0 && (
              <div className={styles.sidebarCard}>
                <div className={styles.sidebarCardHeader}>
                  <h2 className={styles.sidebarTitle}>Ingrédients</h2>
                  <span className={styles.ingredientCount}>
                    {recette.ingredients.length}
                  </span>
                </div>
                <ul className={styles.ingredientsList}>
                  {recette.ingredients.map((ing, i) => (
                    <li key={i} className={styles.ingredientItem}>
                      {ing.quantite && (
                        <span className={styles.ingredientQuantite}>
                          {ing.quantite}
                        </span>
                      )}
                      <span className={styles.ingredientNom}>{ing.nom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.sidebarMeta}>
              <div className={styles.sidebarMetaRow}>
                <span className={styles.sidebarMetaLabel}>Niveau</span>
                <span className={styles.sidebarMetaValue}>
                  {NIVEAU_LABELS[recette.niveau]}
                </span>
              </div>
              <div className={styles.sidebarMetaRow}>
                <span className={styles.sidebarMetaLabel}>Durée</span>
                <span className={styles.sidebarMetaValue}>
                  {recette.temps} min
                </span>
              </div>
              {recette.quantite && (
                <div className={styles.sidebarMetaRow}>
                  <span className={styles.sidebarMetaLabel}>Quantité</span>
                  <span className={styles.sidebarMetaValue}>
                    {recette.quantite}
                  </span>
                </div>
              )}
            </div>
          </aside>

          {/* Étapes */}
          <div className={styles.etapes}>
            <h2 className={styles.etapesTitle}>Préparation</h2>

            {recette.etapes && recette.etapes.length > 0 ? (
              recette.etapes.map((etape, i) => (
                <div key={i} className={styles.etape}>
                  <div className={styles.etapeNumero} aria-hidden="true">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className={styles.etapeContent}>
                    <h3 className={styles.etapeTitre}>{etape.titre}</h3>
                    <p className={styles.etapeDesc}>{etape.description}</p>
                    {etape.tip && (
                      <div className={styles.etapeTip}>
                        <span aria-hidden="true">💡</span>
                        <p>{etape.tip}</p>
                      </div>
                    )}
                    {etape.photoUrl && (
                      <div className={styles.etapePhoto}>
                        <Image
                          src={etape.photoUrl}
                          alt={`Étape ${i + 1} — ${etape.titre}`}
                          width={600}
                          height={400}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: 'auto',
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {i < (recette.etapes?.length ?? 0) - 1 && (
                    <div
                      className={styles.etapeConnecteur}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className={styles.etapesEmpty}>
                Les étapes arrivent bientôt !
              </p>
            )}

            {recette.conseil && (
              <div className={styles.conseil}>
                <span className={styles.conseilEmoji} aria-hidden="true">
                  👨‍🍳
                </span>
                <div>
                  <p className={styles.conseilLabel}>
                    Conseil Sweat &amp; Sound
                  </p>
                  <p className={styles.conseilText}>{recette.conseil}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── VIDÉO FILM (bas de page) ─────────────────── */}
      {isFilm && recette.film?.youtubeUrl && (
        <section className={styles.videoSection}>
          <div className={styles.videoInner}>
            <div className={styles.videoTexte}>
              <p className={styles.videoEyebrow}>🎬 Le film</p>
              <h2 className={styles.videoTitre}>{recette.film.titre}</h2>
              {recette.film.pourquoi && (
                <p className={styles.videoCitation}>
                  « {recette.film.pourquoi} »
                </p>
              )}
              {recette.film.plateformes && recette.film.plateformes.length > 0 && (
                <p className={styles.videoPlateforme}>
                  📺 {recette.film.plateformes.join(' · ')}
                </p>
              )}
            </div>
            <div className={styles.videoEmbed}>
              <YoutubeEmbed
                url={recette.film.youtubeUrl}
                title={recette.film.titre ?? recette.nom}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIE ───────────────────────────────────── */}
      {recette.galerie && recette.galerie.length > 0 && (
        <section className={styles.galerie}>
          <div className={styles.galerieInner}>
            {recette.galerie.map((url, i) => (
              <div key={i} className={styles.galerieItem}>
                <Image
                  src={url}
                  alt={`${recette.nom} — photo ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PARTAGE ───────────────────────────────────── */}
      <section className={styles.partage}>
        <div className={styles.partageInner}>
          <p className={styles.partageLabel}>Partager cette recette</p>
          <div className={styles.partageButtons}>
            <a
              className={styles.partageBtn}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur Instagram"
            >
              📸 Instagram
            </a>
            <a
              className={styles.partageBtn}
              href="https://www.pinterest.fr/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur Pinterest"
            >
              📌 Pinterest
            </a>
            <a className={styles.partageBtn} href="#" aria-label="Copier le lien">
              🔗 Copier le lien
            </a>
          </div>
        </div>
      </section>

      {/* ── RECETTES SIMILAIRES ───────────────────────── */}
      {similaires.length > 0 && (
        <section className={styles.similaires}>
          <h2 className={styles.similairesTitle}>Dans le même univers</h2>
          <div className={styles.similairesGrid}>
            {similaires.map((r) => (
              <RecetteCard key={r._id} recette={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
