import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sweat & Sound — Pâtisserie · Musique · Films'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1008',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Grain / texture overlay via radial gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, #3d1f0a 0%, #1a1008 100%)',
            display: 'flex',
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(193,110,52,0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(193,110,52,0.1)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            zIndex: 1,
            padding: '0 80px',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 18,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#c16e34',
              display: 'flex',
            }}
          >
            RECETTES · CULTURE · SAVEURS
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#f5efe6',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Sweat &amp; Sound
          </div>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 3,
              background: '#c16e34',
              borderRadius: 2,
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: '#c9a87a',
              display: 'flex',
              gap: 20,
            }}
          >
            <span>🎬 Films</span>
            <span style={{ color: '#c16e34' }}>·</span>
            <span>🎵 Musique</span>
            <span style={{ color: '#c16e34' }}>·</span>
            <span>📚 Livres</span>
          </div>

          {/* Sub */}
          <div
            style={{
              fontSize: 22,
              color: '#8a7560',
              marginTop: 8,
              display: 'flex',
            }}
          >
            Des recettes de pâtisserie inspirées par ta culture
          </div>
        </div>

        {/* URL badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 16,
            color: '#5a4a38',
            display: 'flex',
          }}
        >
          sweatsound.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
