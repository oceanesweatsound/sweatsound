import { defineField, defineType } from 'sanity'

export const recette = defineType({
  name: 'recette',
  title: 'Recette',
  type: 'document',

  groups: [
    { name: 'general',     title: '📋 Infos générales', default: true },
    { name: 'medias',      title: '📸 Photos' },
    { name: 'preparation', title: '🥣 Ingrédients & étapes' },
    { name: 'univers',     title: '🎬🎵📚 Univers associé' },
  ],

  fields: [
    // ── GÉNÉRAL ───────────────────────────────────────
    defineField({
      name: 'nom',
      title: 'Nom de la recette',
      type: 'string',
      group: 'general',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: { source: 'nom', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'univers',
      title: 'Univers associé',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: '🎬 Film',    value: 'film' },
          { title: '🎵 Musique', value: 'musique' },
          { title: '📚 Livre',   value: 'livre' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      group: 'general',
    }),
    defineField({
      name: 'humeur',
      title: 'Humeurs / tags',
      description: 'Ex : Cosy, Nostalgique, Festif…',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'general',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'temps',
      title: 'Temps de préparation (minutes)',
      type: 'number',
      group: 'general',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'niveau',
      title: 'Niveau de difficulté',
      type: 'number',
      group: 'general',
      options: {
        list: [
          { title: '★☆☆ Facile',         value: 1 },
          { title: '★★☆ Intermédiaire',   value: 2 },
          { title: '★★★ Difficile',       value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'quantite',
      title: 'Quantité produite',
      description: 'Ex : 12 cookies, 6 parts, 1 tarte',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'couleurBg',
      title: 'Couleur de fond (hex)',
      description: 'Ex : #F2C4A2 — utilisée sur la carte recette',
      type: 'string',
      group: 'general',
      initialValue: '#E8D8BE',
    }),
    defineField({
      name: 'topDuMois',
      title: '⭐ Top du mois',
      description: 'Mettre en avant dans la sélection du mois',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),
    defineField({
      name: 'conseil',
      title: 'Conseil Sweat & Sound',
      description: 'Le mot éditorial final — ambiance, moment de dégustation…',
      type: 'text',
      rows: 3,
      group: 'general',
    }),

    // ── MÉDIAS ────────────────────────────────────────
    defineField({
      name: 'photo',
      title: 'Photo principale',
      type: 'image',
      group: 'medias',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
      ],
    }),
    defineField({
      name: 'galerie',
      title: 'Galerie de photos',
      type: 'array',
      group: 'medias',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' })],
      }],
    }),

    // ── INGRÉDIENTS & ÉTAPES ──────────────────────────
    defineField({
      name: 'ingredients',
      title: 'Ingrédients',
      type: 'array',
      group: 'preparation',
      of: [{
        type: 'object',
        name: 'ingredient',
        fields: [
          defineField({ name: 'quantite', title: 'Quantité', type: 'string', description: 'Ex : 250 g, 3, 1 c. à s.' }),
          defineField({ name: 'nom',      title: 'Ingrédient', type: 'string', validation: (r) => r.required() }),
        ],
        preview: {
          select: { title: 'nom', subtitle: 'quantite' },
          prepare: ({ title, subtitle }) => ({ title, subtitle }),
        },
      }],
    }),
    defineField({
      name: 'etapes',
      title: 'Étapes de préparation',
      type: 'array',
      group: 'preparation',
      of: [{
        type: 'object',
        name: 'etape',
        fields: [
          defineField({ name: 'titre',       title: 'Titre',       type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: (r) => r.required() }),
          defineField({ name: 'tip',         title: '💡 Astuce',   type: 'text', rows: 2 }),
          defineField({ name: 'photo',       title: 'Photo de l\'étape', type: 'image', options: { hotspot: true } }),
        ],
        preview: {
          select: { title: 'titre', subtitle: 'description' },
          prepare: ({ title, subtitle }) => ({ title, subtitle }),
        },
      }],
    }),

    // ── UNIVERS : FILM ────────────────────────────────
    defineField({
      name: 'film',
      title: '🎬 Infos Film',
      type: 'object',
      group: 'univers',
      hidden: ({ document }) => document?.univers !== 'film',
      fields: [
        defineField({ name: 'titre',       title: 'Titre du film',           type: 'string' }),
        defineField({ name: 'realisateur', title: 'Réalisateur·ice',         type: 'string' }),
        defineField({ name: 'annee',       title: 'Année de sortie',         type: 'number' }),
        defineField({
          name: 'categorie',
          title: 'Catégorie',
          type: 'string',
          options: {
            list: [
              { title: '🎨 Animation',       value: 'Animation' },
              { title: '😄 Comédie',          value: 'Comédie' },
              { title: '🎭 Drame',            value: 'Drame' },
              { title: '🔪 Thriller',         value: 'Thriller' },
              { title: '👻 Horreur',          value: 'Horreur' },
              { title: '💕 Romance',          value: 'Romance' },
              { title: '🚀 Science-fiction',  value: 'Science-fiction' },
              { title: '⚔️ Aventure',         value: 'Aventure' },
              { title: '🧙 Fantaisie',        value: 'Fantaisie' },
              { title: '🎥 Documentaire',     value: 'Documentaire' },
            ],
            layout: 'radio',
          },
        }),
        defineField({ name: 'genre', title: 'Genre (libre)', type: 'string', description: 'Précisions supplémentaires' }),
        defineField({ name: 'pourquoi',    title: 'Pourquoi ce duo ?',       type: 'text', rows: 3 }),
        defineField({
          name: 'plateformes',
          title: 'Plateformes de streaming',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: ['Netflix', 'Prime Video', 'Disney+', 'Canal+', 'OCS', 'Apple TV+', 'MUBI', 'Ciné / DVD'],
          },
        }),
        defineField({ name: 'youtubeUrl', title: 'Lien YouTube (bande-annonce / extrait)', type: 'url' }),
        defineField({
          name: 'pochette',
          title: 'Pochette / Affiche du film',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
          ],
        }),
      ],
    }),

    // ── UNIVERS : MUSIQUE ─────────────────────────────
    defineField({
      name: 'musique',
      title: '🎵 Infos Musique',
      type: 'object',
      group: 'univers',
      hidden: ({ document }) => document?.univers !== 'musique',
      fields: [
        defineField({ name: 'artiste',     title: 'Artiste / Groupe',                type: 'string' }),
        defineField({ name: 'titreAlbum',  title: 'Titre album ou playlist',         type: 'string' }),
        defineField({ name: 'genre',       title: 'Genre musical',                   type: 'string', description: 'Ex : Lo-fi, Jazz, Électro…' }),
        defineField({
          name: 'ambiance',
          title: 'Ambiance',
          type: 'string',
          options: {
            list: ['Concentré', 'Festif', 'Mélancolique', 'Énergique', 'Romantique', 'Zen', 'Nostalgique'],
          },
        }),
        defineField({ name: 'spotifyUrl', title: 'Lien Spotify (album / playlist)', type: 'url' }),
        defineField({ name: 'pourquoi',   title: 'Pourquoi ce duo ?',               type: 'text', rows: 3 }),
      ],
    }),

    // ── UNIVERS : LIVRE ───────────────────────────────
    defineField({
      name: 'livre',
      title: '📚 Infos Livre',
      type: 'object',
      group: 'univers',
      hidden: ({ document }) => document?.univers !== 'livre',
      fields: [
        defineField({ name: 'titre',       title: 'Titre du livre',              type: 'string' }),
        defineField({ name: 'auteur',      title: 'Auteur·ice',                  type: 'string' }),
        defineField({ name: 'editeur',     title: 'Éditeur',                     type: 'string' }),
        defineField({ name: 'genre',       title: 'Genre littéraire',            type: 'string', description: 'Ex : Roman, Essai, BD, Manga…' }),
        defineField({ name: 'resume',      title: 'Résumé',                      type: 'text', rows: 5 }),
        defineField({ name: 'couverture',  title: 'Image de couverture',         type: 'image', options: { hotspot: true } }),
        defineField({ name: 'lienAcheter', title: "Lien d'achat (FNAC, Amazon…)", type: 'url' }),
        defineField({ name: 'pourquoi',    title: 'Pourquoi ce duo ?',           type: 'text', rows: 3 }),
      ],
    }),
  ],

  orderings: [
    { title: 'Plus récentes', name: 'recent', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Temps (rapide d\'abord)', name: 'tempsAsc', by: [{ field: 'temps', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'nom', univers: 'univers', media: 'photo' },
    prepare({ title, univers, media }) {
      const icones: Record<string, string> = { film: '🎬', musique: '🎵', livre: '📚' }
      return { title, subtitle: `${icones[univers] ?? ''} ${univers ?? ''}`, media }
    },
  },
})
