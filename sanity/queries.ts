import { defineQuery } from 'next-sanity'

// ── Fragment partagé pour les cartes recettes ─────────────────────────────
const CARD_FIELDS = `
  _id,
  "slug": slug.current,
  nom,
  univers,
  "universNom": select(
    univers == "film"    => film.titre,
    univers == "musique" => musique.titreAlbum,
    univers == "livre"   => livre.titre,
    ""
  ),
  description,
  humeur,
  temps,
  niveau,
  quantite,
  couleurBg,
  topDuMois,
  "photoUrl": photo.asset->url
`

// ── Toutes les recettes (avec filtres optionnels) ─────────────────────────
export const RECETTES_QUERY = defineQuery(`
  *[_type == "recette"
    && ($univers    == null || univers == $univers)
    && ($niveau     == null || niveau  == $niveau)
    && ($tempsMax   == null || temps   <= $tempsMax)
    && ($tempsMin   == null || temps   >= $tempsMin)
    && ($categorie  == null || film.categorie == $categorie)
  ] | order(select(univers=="film"=>0,univers=="musique"=>1,univers=="livre"=>2) asc, _createdAt desc) {
    ${CARD_FIELDS}
  }
`)

// ── Recettes top du mois (par univers) ────────────────────────────────────
export const TOP_DU_MOIS_QUERY = defineQuery(`
  *[_type == "recette" && topDuMois == true
    && ($univers == null || univers == $univers)
  ] | order(_createdAt desc)[0...3] {
    ${CARD_FIELDS}
  }
`)

// ── Slugs pour generateStaticParams ──────────────────────────────────────
export const SLUGS_QUERY = defineQuery(`
  *[_type == "recette" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// ── Recette complète par slug ─────────────────────────────────────────────
export const RECETTE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "recette" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    nom,
    univers,
    "universNom": select(
      univers == "film"    => film.titre,
      univers == "musique" => musique.titreAlbum,
      univers == "livre"   => livre.titre,
      ""
    ),
    description,
    humeur,
    temps,
    niveau,
    quantite,
    couleurBg,
    topDuMois,
    conseil,
    "photoUrl": photo.asset->url,
    "galerie": galerie[].asset->url,
    ingredients[] { quantite, nom },
    etapes[] {
      titre,
      description,
      tip,
      "photoUrl": photo.asset->url
    },
    film {
      titre, realisateur, annee, categorie, genre, pourquoi, plateformes, youtubeUrl,
      "pochetteUrl": pochette.asset->url
    },
    musique {
      artiste, titreAlbum, genre, ambiance, spotifyUrl, pourquoi
    },
    livre {
      titre, auteur, editeur, genre, resume,
      "couvertureUrl": couverture.asset->url,
      lienAcheter, pourquoi
    }
  }
`)

// ── Recettes similaires (même univers, hors slug courant) ─────────────────
export const SIMILAIRES_QUERY = defineQuery(`
  *[_type == "recette" && univers == $univers && slug.current != $slug
  ] | order(_createdAt desc)[0...3] {
    ${CARD_FIELDS}
  }
`)

// ── Recette mise en avant avec YouTube (film) ─────────────────────────────
export const FEATURED_FILM_QUERY = defineQuery(`
  *[_type == "recette" && univers == "film" && defined(film.youtubeUrl)
  ] | order(topDuMois desc, _createdAt desc)[0] {
    ${CARD_FIELDS},
    film { titre, realisateur, annee, pourquoi, youtubeUrl, plateformes }
  }
`)

// ── Recette mise en avant avec Spotify (musique) ──────────────────────────
export const FEATURED_MUSIQUE_QUERY = defineQuery(`
  *[_type == "recette" && univers == "musique" && defined(musique.spotifyUrl)
  ] | order(topDuMois desc, _createdAt desc)[0] {
    ${CARD_FIELDS},
    musique { artiste, titreAlbum, genre, ambiance, spotifyUrl, pourquoi }
  }
`)

// ── Recette mise en avant avec résumé livre ───────────────────────────────
export const FEATURED_LIVRE_QUERY = defineQuery(`
  *[_type == "recette" && univers == "livre" && defined(livre.resume)
  ] | order(topDuMois desc, _createdAt desc)[0] {
    ${CARD_FIELDS},
    livre { titre, auteur, editeur, resume, "couvertureUrl": couverture.asset->url, lienAcheter, pourquoi }
  }
`)

// ── Propositions communauté ───────────────────────────────────────────────
export const PROPOSITIONS_QUERY = defineQuery(`
  *[_type == "proposition" && statut != "rejete"
  ] | order(votes desc, _createdAt desc) {
    _id, type, titre, auteur, recetteSuggree, message, prenom, votes, statut
  }
`)

// ── Coups de cœur livres (mis à jour par agent automatique) ───────────────
export const COUPS_DE_COEUR_LIVRES_QUERY = defineQuery(`
  *[_type == "coupsDeCoeurLivres"][0] {
    livres[] {
      titre, auteur, editeur, dateParution, genre, description, couvertureUrl, lienFiche
    },
    miseAJour
  }
`)
