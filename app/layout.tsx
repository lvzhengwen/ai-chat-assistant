import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 聊天助手',
  description: '基于 DeepSeek API 的智能对话系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
