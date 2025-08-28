import { Poppins } from 'next/font/google'
import ClientWrapper from '@/components/ClientWrapper'

import './globals.css'

// Load Poppins font from Google Fonts
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // you can adjust which weights you need
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
      <body className={`${poppins.variable} p-6 antialiased sm:p-10 lg:p-16`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
