import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Will Ashley for NYLON – Boldest Breakout Star',
  description: 'Vote for Will on Nylon for Boldest Breakout Star',
  openGraph: {
    title: 'Will Ashley for NYLON – Boldest Breakout Star',
    description: 'Vote for Will on Nylon for Boldest Breakout Star',
    url: 'https://nylon-boldest-breakout-star-will.vercel.app/',
    siteName: 'Vote Will Campaign',
    images: [
      {
        url: 'https://nylon-boldest-breakout-star-will.vercel.app/link-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'WILL ASHLEY FOR NYLON preview thumbnail',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vote Will on Nylon',
    description: 'Vote for Will on Nylon for Boldest Breakout Star',
    images: ['https://nylon-boldest-breakout-star-will.vercel.app/link-preview.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} p-6 antialiased sm:p-10 lg:p-16`}
      >
        {children}
      </body>
    </html>
  )
}
