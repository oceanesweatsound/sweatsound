import type { Metadata } from 'next'
import { Playfair_Display, DM_Mono, Libre_Baskerville, Kalam } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-kalam',
  display: 'swap',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sweat & Sound — Pâtisserie · Musique · Films',
  description: 'Des recettes de pâtisserie associées à un film ou une playlist Spotify.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${dmMono.variable} ${kalam.variable} ${libreBaskerville.variable}`}
    >
      <body suppressHydrationWarning>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
