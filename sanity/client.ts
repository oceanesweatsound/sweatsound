import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  // CDN activé uniquement en production — en dev, requêtes directes à l'API
  // pour voir les publications instantanément.
  useCdn: process.env.NODE_ENV === 'production',
})
