import Link from 'next/link';
import { LiveCount } from '@/components/LiveCount';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="text-7xl mb-4">☕</div>
      <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--cafe-brown)' }}>
        Online Cafe
      </h1>
      <p className="text-lg text-stone-600 mb-2">잠시 들렀다 가는 온라인 카페</p>
      <LiveCount />
      <Link
        href="/enter"
        className="px-8 py-4 rounded-full bg-[var(--cafe-accent)] text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform"
      >
        카페 입장하기 →
      </Link>
    </main>
  );
}