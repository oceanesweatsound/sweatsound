import styles from './SpotifyEmbed.module.css'

interface Props {
  url: string
  compact?: boolean
}

function getSpotifyEmbedUrl(url: string): string | null {
  // Convertit open.spotify.com/... → open.spotify.com/embed/...
  const match = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`
}

export default function SpotifyEmbed({ url, compact = false }: Props) {
  const embedUrl = getSpotifyEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height={compact ? 152 : 352}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className={styles.iframe}
      title="Lecteur Spotify"
    />
  )
}
