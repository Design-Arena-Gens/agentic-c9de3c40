import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Fetch Agent',
  description: 'Simple agent to fetch data from various sources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
