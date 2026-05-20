import './globals.css';
import type { Metadata } from 'next';
import { Gaegu } from 'next/font/google';

const gaegu = Gaegu({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  preload: false,
  variable: '--font-gaegu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Online Cafe ☕',
  description: '잠시 들렀다 가는 온라인 카페',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={gaegu.variable}>
      <body className="bg-amber-50 text-stone-800 antialiased">{children}</body>
    </html>
  );
}
