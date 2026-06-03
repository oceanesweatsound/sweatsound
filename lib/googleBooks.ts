export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publishedDate?: string
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    categories?: string[]
    infoLink?: string
    language?: string
  }
}

async function booksFetch(params: Record<string, string>): Promise<GoogleBook[]> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY!)

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`Google Books error ${res.status}`)
  const data = await res.json()
  return data.items ?? []
}

export async function getNewBooks(subject = 'fiction', maxResults = 6): Promise<GoogleBook[]> {
  return booksFetch({
    q: `subject:${subject}`,
    orderBy: 'newest',
    langRestrict: 'fr',
    maxResults: String(maxResults),
    printType: 'books',
  })
}

// Grands éditeurs littéraires français — filtre l'auto-édition romance
const EDITEURS_LITTERAIRES =
  'inpublisher:gallimard inpublisher:seuil inpublisher:flammarion inpublisher:grasset inpublisher:actes inpublisher:minuit inpublisher:fayard inpublisher:albin'

export async function getNewFrenchBooks(maxResults = 6): Promise<GoogleBook[]> {
  const year = new Date().getFullYear()

  const results = await booksFetch({
    q: `roman ${year} ${EDITEURS_LITTERAIRES}`,
    orderBy: 'newest',
    langRestrict: 'fr',
    maxResults: '20',
    printType: 'books',
  })

  const filtered = results.filter((book) => {
    const date = book.volumeInfo.publishedDate ?? ''
    const pubYear = parseInt(date.slice(0, 4), 10)
    const hasCover = !!(
      book.volumeInfo.imageLinks?.thumbnail ||
      book.volumeInfo.imageLinks?.smallThumbnail
    )
    return hasCover && pubYear >= 2023
  })

  return filtered.slice(0, maxResults)
}

/** Retourne la miniature en HTTPS (Google renvoie parfois HTTP) */
export function bookCoverUrl(book: GoogleBook): string | null {
  const thumb =
    book.volumeInfo.imageLinks?.thumbnail ??
    book.volumeInfo.imageLinks?.smallThumbnail ??
    null
  if (!thumb) return null
  return thumb.replace(/^http:\/\//, 'https://')
}

export function formatBookDate(dateStr?: string): string {
  if (!dateStr) return ''
  // dateStr peut être "2026", "2026-05", ou "2026-05-15"
  const parts = dateStr.split('-')
  if (parts.length === 1) return parts[0]
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}
