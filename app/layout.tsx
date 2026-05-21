import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/theme-context'
import DevSwitcher from '@/components/DevSwitcher'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'RIO Yoga',
  description: 'Pilates & Massage booking',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${spaceMono.variable}`}
    >
      <body>
        <ThemeProvider>
          {children}
          <DevSwitcher />
        </ThemeProvider>
      </body>
    </html>
  )
}
