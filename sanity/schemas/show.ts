import { defineField, defineType } from 'sanity'

export const show = defineType({
  name: 'show',
  title: 'Concert',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de l\'événement',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Salle',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'Ville',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'country',
      title: 'Pays',
      type: 'string',
      initialValue: 'France',
    }),
    defineField({
      name: 'ticketLink',
      title: 'Lien billetterie',
      type: 'url',
    }),
    defineField({
      name: 'artists',
      title: 'Artistes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
    }),
    defineField({
      name: 'isSoldOut',
      title: 'Sold out',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Date (prochain)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
})
