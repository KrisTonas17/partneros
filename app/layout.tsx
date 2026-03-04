import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'PartnerOS — Partnership Deal Intelligence',
  description: 'Design, evaluate, and launch scalable strategic partnerships.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', background: '#0a0a0f' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
