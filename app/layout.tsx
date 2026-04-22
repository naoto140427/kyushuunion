import './globals.css'
import type { Metadata } from 'next'
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ReportsProvider } from '../contexts/ReportsContext';

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
