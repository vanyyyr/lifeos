import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LifeOS - Твой персональный AI-ассистент',
  description: 'AI-powered персональный ассистент для трекинга и развития личности. Сон, спорт, питание, саморазвитие, продуктивность - всё в одном месте.',
  keywords: 'LifeOS, AI, трекинг, здоровье, продуктивность, привычки, саморазвитие',
  openGraph: {
    title: 'LifeOS - Твой персональный AI-ассистент',
    description: 'Трекинг жизни с AI-коучем',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}