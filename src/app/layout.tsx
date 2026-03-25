import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['700', '900'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | The Itapoá Times',
    default: 'The Itapoá Times — Notícias de Itapoá, SC',
  },
  description: 'Portal de notícias independente de Itapoá, litoral norte de Santa Catarina.',
  metadataBase: new URL('https://itapoatimes.com.br'),
  openGraph: {
    siteName: 'The Itapoá Times',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://itapoatimes.com.br',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'The Itapoá Times',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@itapoatimes',
  },
  alternates: {
    canonical: 'https://itapoatimes.com.br',
  },
  keywords: ['Itapoá', 'notícias', 'Santa Catarina', 'litoral norte SC', 'Itapoá SC'],
  authors: [{ name: 'The Itapoá Times' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
