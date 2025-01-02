import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'BSO Status',
  description: 'Check the status of BSO services'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <SpeedInsights />
      <body>{children}</body>
    </html>
  )
}
