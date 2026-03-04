'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⬡' },
  { href: '/partners/new', label: 'New Partner', icon: '+' },
  { href: '/partners', label: 'Partners', icon: '◈' },
  { href: '/scorecard', label: 'Scorecard', icon: '◎' },
  { href: '/deal-builder', label: 'Deal Builder', icon: '⟡' },
  { href: '/term-sheet', label: 'Term Sheet', icon: '⊞' },
  { href: '/activation-plan', label: 'Activation Plan', icon: '▷' },
  { href: '/outreach', label: 'Outreach', icon: '⇗' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '240px',
      background: '#12121a',
      borderRight: '1px solid #1e1e2e',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#e2e2f0', letterSpacing: '-0.02em' }}>
          PartnerOS
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Deal Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                color: isActive ? '#a5b4fc' : '#9ca3af',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.15s',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: '14px', opacity: 0.8, width: '16px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid #1e1e2e' }}>
        <div style={{ fontSize: '11px', color: '#4b5563' }}>v1.0 MVP</div>
      </div>
    </aside>
  );
}
