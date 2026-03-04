import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Card, Badge, PageHeader, SectionLabel } from '@/components/ui';

export default function Dashboard() {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners ORDER BY created_at DESC').all() as any[];
  const deals = db.prepare('SELECT * FROM deals ORDER BY created_at DESC LIMIT 5').all() as any[];
  const outreachCount = db.prepare('SELECT COUNT(*) as c FROM outreach').get() as any;

  const pursue = partners.filter(p => p.score_total >= 3.5).length;
  const constraints = partners.filter(p => p.score_total >= 2.5 && p.score_total < 3.5).length;

  const recColor = (score: number) => score >= 3.5 ? 'green' : score >= 2.5 ? 'yellow' : 'red';
  const recLabel = (score: number) => score >= 3.5 ? 'Pursue' : score >= 2.5 ? 'With Constraints' : 'Do Not Pursue';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '1200px' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Strategic partnership pipeline overview"
        actions={
          <Link href="/partners/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '8px',
            background: '#6366f1', color: '#fff', textDecoration: 'none',
            fontSize: '13.5px', fontWeight: 500,
          }}>
            + New Partner
          </Link>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Total Partners', value: partners.length, icon: '◈' },
          { label: 'Pursue', value: pursue, icon: '▲', color: '#86efac' },
          { label: 'With Constraints', value: constraints, icon: '◑', color: '#fcd34d' },
          { label: 'Outreach Sets', value: outreachCount?.c || 0, icon: '⇗' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color || '#e2e2f0', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', letterSpacing: '0.04em' }}>{stat.label}</div>
              </div>
              <span style={{ fontSize: '20px', opacity: 0.3 }}>{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Partners list */}
        <div>
          <SectionLabel>Partner Pipeline</SectionLabel>
          <Card>
            {partners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>No partners yet.</p>
                <Link href="/partners/new" style={{ color: '#a5b4fc', fontSize: '13px' }}>Add your first partner →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {partners.slice(0, 6).map((p, i) => (
                  <Link key={p.id} href={`/partners/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 0',
                      borderBottom: i < Math.min(partners.length, 6) - 1 ? '1px solid #2a2a3d' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e2f0' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{p.partner_type}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Badge color={recColor(p.score_total)}>{recLabel(p.score_total)}</Badge>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc' }}>{p.score_total?.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <SectionLabel>Quick Actions</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { href: '/partners/new', icon: '+', label: 'Add New Partner', desc: 'Intake a new partnership opportunity' },
              { href: '/deal-builder', icon: '⟡', label: 'Build a Deal', desc: 'Run the deal intelligence engine' },
              { href: '/outreach', icon: '⇗', label: 'Generate Outreach', desc: 'Create LinkedIn + email sequences' },
              { href: '/activation-plan', icon: '▷', label: 'Create Activation Plan', desc: 'Build a launch plan for any partner' },
              { href: '/term-sheet', icon: '⊞', label: 'Generate Term Sheet', desc: 'Create a deal summary document' },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '10px',
                  background: '#1a1a26', border: '1px solid #2a2a3d',
                  transition: 'border-color 0.15s',
                }}>
                  <span style={{ fontSize: '18px', color: '#6366f1', opacity: 0.8 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#e2e2f0' }}>{a.label}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '1px' }}>{a.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
