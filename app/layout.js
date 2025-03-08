import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '每日打卡任务管理',
  description: '管理您的每日任务和打卡记录',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">每日打卡</div>
            <div className="space-x-4">
              <Link href="/" className="hover:text-gray-300">首页</Link>
              <Link href="/create" className="hover:text-gray-300">创建任务</Link>
              <Link href="/history" className="hover:text-gray-300">历史记录</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
