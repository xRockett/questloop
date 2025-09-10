
import Link from 'next/link';
export default function Page() {
  return (
    <div className="mt-10 grid gap-6">
      <section className="card p-8 text-center"><div className="mb-4"><svg className="mx-auto" width="80" height="80"><circle cx="40" cy="40" r="30" fill="url(#g)" /><defs><radialGradient id="g"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#fde68a"/></radialGradient></defs></svg></div>
        <h1 className="text-4xl font-extrabold mb-3">Social × Game</h1>
        <p className="text-lg mb-6">Post, connect, and level up your profile. Earn XP for meaningful actions and climb the leaderboard.</p>
        <div className="flex gap-3 justify-center">
          <Link className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold" href="/auth/signup">Create an account</Link>
          <Link className="px-5 py-3 rounded-xl bg-white border" href="/feed">Explore the feed</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-6"><h3 className="font-bold text-xl mb-1">Earn XP</h3><p>Every action grants XP. Level up and unlock badges.</p></div>
        <div className="card p-6"><h3 className="font-bold text-xl mb-1">Beautiful by design</h3><p>Soft glassmorphism, pastel gradients, and micro-interactions.</p></div>
        <div className="card p-6"><h3 className="font-bold text-xl mb-1">Real time</h3><p>Likes and comments update live across the feed.</p></div>
      </section>
    </div>
  )
}
