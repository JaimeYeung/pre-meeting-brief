import type { Metadata } from 'next'
import { Lora, Outfit } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Brief — Pre-Meeting Intelligence',
  description: 'AI-powered SDR pre-meeting brief generator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  )
}
