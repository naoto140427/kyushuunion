import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ReportsProvider } from '../contexts/ReportsContext';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

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
    <html lang="ja" className={notoSansJP.variable}>
      <body>
        <ReportsProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ReportsProvider>
      </body>
    </html>
  )
}
