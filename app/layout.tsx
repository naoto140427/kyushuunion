import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '精算アプリ',
  description: '精算アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
