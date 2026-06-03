const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export interface TmdbFilm {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
  vote_average: number
  genre_ids: number[]
}

async function tmdbFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('language', 'fr-FR')
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 86400 }, // cache 24h
  })

  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${path}`)
  return res.json()
}

export async function getUpcomingFilms(): Promise<TmdbFilm[]> {
  const data = await tmdbFetch<{ results: TmdbFilm[] }>('/movie/upcoming', {
    region: 'FR',
    page: '1',
  })
  return data.results.slice(0, 6)
}

export function tmdbPosterUrl(posterPath: string | null, size = 'w342'): string | null {
  if (!posterPath) return null
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

export function formatReleaseDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
