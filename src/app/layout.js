import './globals.css'

export const metadata = {
  title: 'BSO Status',
  description: 'Check the status of BSO services'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
