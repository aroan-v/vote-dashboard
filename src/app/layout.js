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
  title: 'Vote Will on Nylon',
  description: 'Vote for Will on Nylon for Boldest Breakout Star',
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
