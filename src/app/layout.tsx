import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Analytics } from '@vercel/analytics/react'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Dio Pratama | Flutter Developer',
  description:
    'Portofolio Dio Pratama, Flutter mobile developer building clean, thoughtful apps with Flutter & Supabase.',
  openGraph: {
    title: 'Dio Pratama | Flutter Developer',
    description: 'Flutter mobile developer building clean, thoughtful apps.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dio Pratama | Flutter Developer',
    description: 'Flutter mobile developer building clean, thoughtful apps.',
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
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
