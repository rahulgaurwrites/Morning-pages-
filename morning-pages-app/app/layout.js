import './globals.css'

export const metadata = {
  title: 'Morning Pages',
  description: '750 words. Every day. Before the world gets in.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
