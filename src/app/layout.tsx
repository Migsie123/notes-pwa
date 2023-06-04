import './globals.scss'
import { Jost } from 'next/font/google'

const inter = Jost({ subsets: ['latin'] })

export const metadata = {
  title: 'Notes',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
