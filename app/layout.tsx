import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

// 使用系统字体，避免 Google Fonts 加载问题
// 如果需要使用 Google Fonts，可以取消注释下面的代码
// import { Inter, Poppins } from 'next/font/google'
// const inter = Inter({ 
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
//   fallback: ['system-ui', 'arial'],
// })
// const poppins = Poppins({ 
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700', '800'],
//   variable: '--font-poppins',
//   display: 'swap',
//   fallback: ['system-ui', 'arial'],
// })

export const metadata: Metadata = {
  title: '孙颖莎 - 世界冠军 | 人物志',
  description: '孙颖莎个人官方网站，展示职业生涯、成就和精彩瞬间',
  keywords: '孙颖莎, 乒乓球, 世界冠军, 奥运会, 中国乒乓球队',
  openGraph: {
    title: '孙颖莎 - 世界冠军',
    description: '孙颖莎个人官方网站，展示职业生涯、成就和精彩瞬间',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="font-sans antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
