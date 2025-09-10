
export const metadata = { title: 'QuestLoop', description: 'Social × Game' };
import './globals.css';
import Link from 'next/link';


import { ThemeProvider } from './lib/theme';
import { MotionDiv } from './lib/motion';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen gradient">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/40 border-b border-white/50">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="text-2xl font-black">QuestLoop</Link>
            <nav className="flex gap-2 text-sm"><a href="/notifications" className="px-3 py-2 rounded-lg hover:bg-white/60">🔔</a>
              <Link href="/feed">Feed</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <Link href="/guilds">Guilds</Link>
              <Link href="/badges">Badges</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/auth/login" className="font-semibold">Login</Link>
              <Link href="/auth/signup" className="font-semibold">Sign up</Link>
            </nav><div className="hidden md:block"><!-- theme switch slot --></div>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="mt-16 py-10 text-center text-xs text-gray-600">© {new Date().getFullYear()} QuestLoop</footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
