import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HerbalAI - Penerapan AI Speech-to-Text pada Aplikasi Pencarian Tanaman Obat",
  description:
    "Aplikasi pencarian tanaman obat dengan teknologi AI Speech-to-Text untuk meningkatkan aksesibilitas dan akurasi identifikasi tanaman obat melalui input suara.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
