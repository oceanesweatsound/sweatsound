import { defineField, defineType } from 'sanity'

export const proposition = defineType({
  name: 'proposition',
  title: 'Proposition communauté',
  type: 'document',

  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
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
      name: 'titre',
      title: 'Titre (film / album / livre)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'auteur',
      title: 'Auteur·ice / Artiste / Réalisateur·ice',
      type: 'string',
    }),
    defineField({
      name: 'recetteSuggree',
      title: 'Recette suggérée',
      description: "La recette que l'utilisateur imagine pour ce duo",
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: "Message de l'utilisateur",
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'prenom',
      title: 'Prénom',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email (optionnel, non affiché publiquement)',
      type: 'string',
    }),
    defineField({
      name: 'votes',
      title: 'Votes',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'statut',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: '⏳ En attente', value: 'en_attente' },
          { title: '✅ Retenu',      value: 'retenu' },
          { title: '❌ Rejeté',      value: 'rejete' },
        ],
        layout: 'radio',
      },
      initialValue: 'en_attente',
    }),
  ],

  orderings: [
    { title: 'Plus votés',  name: 'votesDesc', by: [{ field: 'votes', direction: 'desc' }] },
    { title: 'Plus récents', name: 'recent',   by: [{ field: '_createdAt', direction: 'desc' }] },
  ],

  preview: {
    select: { title: 'titre', subtitle: 'type', statut: 'statut', prenom: 'prenom' },
    prepare({ title, subtitle, statut, prenom }) {
      const icones: Record<string, string> = { film: '🎬', musique: '🎵', livre: '📚' }
      const statuts: Record<string, string> = { en_attente: '⏳', retenu: '✅', rejete: '❌' }
      return {
        title: `${icones[subtitle] ?? ''} ${title}`,
        subtitle: `${prenom ? `par ${prenom} · ` : ''}${statuts[statut] ?? ''}`,
      }
    },
  },
})
