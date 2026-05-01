import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'State of the World — Daily Global Intelligence',
  description: 'One data-backed word. Every day. Synthesizing global signals into a single, credible reflection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#070810] text-gray-100 font-sans overflow-x-hidden selection:bg-indigo-500/30`}>
        
        {/* Animated Background Grids */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="fixed inset-0 z-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108,99,255,0.18) 0%, transparent 70%)`
        }} />

        <div className="relative z-10 pt-8 flex flex-col min-h-screen">
          <header className="max-w-6xl mx-auto w-full px-6 pb-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="font-display text-xl tracking-[0.12em] text-white hover:opacity-80 transition-opacity">
              STATE<span className="text-indigo-500">.</span>WORLD
            </Link>
            <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Today</Link>
              <Link href="/history" className="hover:text-white transition-colors">History</Link>
              <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
            </nav>
          </header>

          <main className="flex-1 w-full">
            {children}
          </main>
          
          <footer className="max-w-6xl mx-auto w-full px-6 py-8 mt-12 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-500">
            <span>STATE.WORLD · Data Synthesizer Engine v0.1</span>
            <span className="space-x-4">
              <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
              <Link href="/history" className="hover:text-white transition-colors">History</Link>
            </span>
            <span>Not financial or political advice.</span>
          </footer>
        </div>

      </body>
    </html>
  )
}
