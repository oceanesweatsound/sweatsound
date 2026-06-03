import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Webhook appelé par Sanity à chaque publication / dépublication.
// Dans sanity.io/manage → API → Webhooks, configurer :
//   URL   : https://ton-site.vercel.app/api/revalidate
//   Secret: la valeur de SANITY_REVALIDATE_SECRET dans ton .env.local
//   Trigger on: "Create", "Update", "Delete"
//   Filter: _type == "recette" || _type == "proposition"

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  // Vérifie le secret pour éviter les appels non autorisés
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const type: string = body?._type ?? ''

    if (type === 'recette') {
      const slug: string | undefined = body?.slug?.current
      // Revalide toutes les pages qui affichent des recettes
      revalidatePath('/', 'page')
      revalidatePath('/recettes', 'page')
      revalidatePath('/recettes/film', 'page')
      revalidatePath('/recettes/musique', 'page')
      revalidatePath('/recettes/livre', 'page')
      if (slug) {
        revalidatePath(`/recettes/${slug}`, 'page')
      }
    } else if (type === 'proposition') {
      revalidatePath('/communaute', 'page')
    } else {
      // Type inconnu → revalide tout par sécurité
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type })
  } catch {
    return NextResponse.json({ message: 'Error parsing body' }, { status: 400 })
  }
}
