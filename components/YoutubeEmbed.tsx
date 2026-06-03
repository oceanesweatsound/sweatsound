import styles from './YoutubeEmbed.module.css'

interface Props {
  url: string
  title?: string
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YoutubeEmbed({ url, title = 'Vidéo YouTube' }: Props) {
  const id = getYoutubeId(url)
  if (!id) return null

  return (
    <div className={styles.wrapper}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className={styles.iframe}
      />
    </div>
  )
}
