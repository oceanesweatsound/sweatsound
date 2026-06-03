export type Univers = 'film' | 'musique' | 'livre'
export type Niveau  = 1 | 2 | 3

export interface Ingredient {
  quantite: string
  nom: string
}

export interface Etape {
  titre: string
  description: string
  tip?: string
  photoUrl?: string
}

export interface FilmInfos {
  titre?: string
  realisateur?: string
  annee?: number
  categorie?: string
  genre?: string
  pourquoi?: string
  plateformes?: string[]
  youtubeUrl?: string
  pochetteUrl?: string
}

export interface MusiqueInfos {
  artiste?: string
  titreAlbum?: string
  genre?: string
  ambiance?: string
  spotifyUrl?: string
  pourquoi?: string
}

export interface LivreInfos {
  titre?: string
  auteur?: string
  editeur?: string
  genre?: string
  resume?: string
  couvertureUrl?: string
  lienAcheter?: string
  pourquoi?: string
}

/** Recette telle que projetée par GROQ (champs aplatis) */
export interface Recette {
  _id: string
  slug: string
  nom: string
  univers: Univers
  /** Calculé par GROQ : film.titre | musique.artiste | livre.auteur */
  universNom?: string
  description?: string
  humeur?: string[]
  temps: number
  niveau: Niveau
  quantite?: string
  couleurBg?: string
  topDuMois?: boolean
  conseil?: string
  photoUrl?: string
  galerie?: string[]
  ingredients?: Ingredient[]
  etapes?: Etape[]
  film?: FilmInfos
  musique?: MusiqueInfos
  livre?: LivreInfos
}

export interface Proposition {
  _id: string
  type: Univers
  titre: string
  auteur?: string
  recetteSuggree?: string
  message?: string
  prenom?: string
  votes: number
  statut: 'en_attente' | 'retenu' | 'rejete'
}
