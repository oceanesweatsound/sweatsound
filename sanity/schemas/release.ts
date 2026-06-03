import { defineField, defineType } from 'sanity'

export const release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['Album', 'EP', 'Single', 'Mixtape'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Date de sortie',
      type: 'date',
    }),
    defineField({
      name: 'coverArt',
      title: 'Pochette',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'artists',
      title: 'Artistes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
    }),
    defineField({
      name: 'links',
      title: "Liens d'écoute",
      type: 'object',
      fields: [
        defineField({ name: 'spotify', type: 'url', title: 'Spotify' }),
        defineField({ name: 'appleMusic', type: 'url', title: 'Apple Music' }),
        defineField({ name: 'bandcamp', type: 'url', title: 'Bandcamp' }),
        defineField({ name: 'soundcloud', type: 'url', title: 'SoundCloud' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  orderings: [
    {
      title: 'Date de sortie (récent)',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
})
