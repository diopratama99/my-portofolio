import type { Metadata } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Analytics } from '@vercel/analytics/react'

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'My Portofolio',
  description:
    'Portofolio Dio Pratama — Web & Mobile Developer, IT Support, CS Student. Passionate about Front-End and Flutter development.',
  openGraph: {
    title: 'My Portofolio — Dio Pratama',
    description:
      'Web & Mobile Developer passionate about Front-End and Flutter. Building clean, modern apps.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Portofolio — Dio Pratama',
    description: 'Web & Mobile Developer passionate about Front-End and Flutter.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
