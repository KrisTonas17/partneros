import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Card, Badge, PageHeader, SectionLabel, EmptyState } from '@/components/ui';

export default function PartnersPage() {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners ORDER BY score_total DESC').all() as any[];

  const recColor = (score: number) => score >= 3.5 ? 'green' : score >= 2.5 ? 'yellow' : 'red';
  const recLabel = (score: number) => score >= 3.5 ? 'Pursue' : score >= 2.5 ? 'With Constraints' : 'Do Not Pursue';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '1200px' }}>
      <PageHeader
        title="Partners"
        subtitle={`${partners.length} partner${partners.length !== 1 ? 's' : ''} in pipeline`}
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

      {partners.length === 0 ? (
        <Card>
          <EmptyState
            message="No partners yet. Add your first partnership opportunity."
            action={<Link href="/partners/new" style={{ color: '#a5b4fc', fontSize: '13px' }}>Add Partner →</Link>}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {partners.map((p) => {
            const cities = JSON.parse(p.primary_cities || '[]');
            const channels = JSON.parse(p.activation_channels || '[]');
            return (
              <Link key={p.id} href={`/partners/${p.id}`} style={{ textDecoration: 'none' }}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#e2e2f0' }}>{p.name}</h3>
                        <Badge color={recColor(p.score_total)}>{recLabel(p.score_total)}</Badge>
                        <Badge color="purple">{p.partner_type}</Badge>
                      </div>
                      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#9ca3af' }}>
                        <span>Population: <strong style={{ color: '#e2e2f0' }}>{p.eligible_population?.toLocaleString()}</strong></span>
                        <span>Cities: <strong style={{ color: '#e2e2f0' }}>{cities.join(', ') || '—'}</strong></span>
                        <span>Activation: <strong style={{ color: '#e2e2f0' }}>{channels.slice(0, 2).join(', ')}{channels.length > 2 ? '...' : ''}</strong></span>
                        <span>Brand: <strong style={{ color: '#e2e2f0' }}>{p.brand_tier}</strong></span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                      <div style={{ fontSize: '28px', fontWeight: 700, color: '#a5b4fc', fontFamily: 'var(--font-display)' }}>
                        {p.score_total?.toFixed(1)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '0.04em' }}>Score / 5.0</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
