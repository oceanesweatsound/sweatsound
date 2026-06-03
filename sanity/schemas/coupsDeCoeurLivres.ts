import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'coupsDeCoeurLivres',
  type: 'document',
  title: '📚 Coups de cœur Livres',
  fields: [
    defineField({
      name: 'livres',
      title: 'Sélection de la semaine',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'titre',       type: 'string', title: 'Titre' }),
            defineField({ name: 'auteur',      type: 'string', title: 'Auteur' }),
            defineField({ name: 'editeur',     type: 'string', title: 'Éditeur' }),
            defineField({ name: 'dateParution',type: 'string', title: 'Date de parution (ex: Mai 2026)' }),
            defineField({ name: 'genre',       type: 'string', title: 'Genre', options: {
              list: ['Roman littéraire', 'Polar & thriller', 'SF & fantastique', 'Essai & récit'],
            }}),
            defineField({ name: 'description', type: 'text',   title: 'Résumé court', rows: 3 }),
            defineField({ name: 'couvertureUrl', type: 'url',  title: 'URL de la couverture' }),
            defineField({ name: 'lienFiche',    type: 'url',  title: 'Lien fiche (Babelio, éditeur…)' }),
          ],
          preview: {
            select: { title: 'titre', subtitle: 'auteur' },
          },
        }),
      ],
    }),
    defineField({
      name: 'miseAJour',
      title: 'Dernière mise à jour',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'miseAJour' },
    prepare({ title }) {
      return { title: '📚 Coups de cœur Livres', subtitle: title ? `Mis à jour le ${new Date(title).toLocaleDateString('fr-FR')}` : 'Jamais mis à jour' }
    },
  },
})
