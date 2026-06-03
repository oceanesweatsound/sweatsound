'use server'
import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function submitProposition(formData: FormData) {
  const type    = formData.get('type')    as string
  const titre   = formData.get('titre')   as string
  const auteur  = formData.get('auteur')  as string
  const prenom  = formData.get('prenom')  as string
  const message = formData.get('message') as string
  const email   = formData.get('email')   as string | null
  const recetteSuggree = formData.get('recetteSuggree') as string | null

  if (!type || !titre || !prenom) throw new Error('Champs requis manquants')

  await writeClient.create({
    _type: 'proposition',
    type,
    titre,
    auteur,
    prenom,
    message: message || undefined,
    email: email || undefined,
    recetteSuggree: recetteSuggree || undefined,
    votes: 0,
    statut: 'en_attente',
  })

  revalidatePath('/communaute')
}

export async function voteProposition(id: string) {
  await writeClient.patch(id).inc({ votes: 1 }).commit()
  revalidatePath('/communaute')
}
