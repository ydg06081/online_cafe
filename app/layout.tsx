import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Cafe ☕',
  description: '잠시 들렀다 가는 온라인 카페',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-amber-50 text-stone-800 antialiased">{children}</body>
    </html>
  );
}
