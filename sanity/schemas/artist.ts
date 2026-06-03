import { defineField, defineType } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artiste',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socials',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'spotify', type: 'url', title: 'Spotify' }),
        defineField({ name: 'soundcloud', type: 'url', title: 'SoundCloud' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
      ],
    }),
  ],
})
