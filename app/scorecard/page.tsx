import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Card, Badge, PageHeader, ScoreBar, SectionLabel } from '@/components/ui';
import { scorePartner } from '@/lib/scoring';

export default function ScorecardPage() {
  const db = getDb();
  const partners = db.prepare('SELECT * FROM partners ORDER BY score_total DESC').all() as any[];

  const recColor = (score: number) => score >= 3.5 ? 'green' : score >= 2.5 ? 'yellow' : 'red';
  const recLabel = (score: number) => score >= 3.5 ? 'Pursue' : score >= 2.5 ? 'Pursue With Constraints' : 'Do Not Pursue';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '1100px' }}>
      <PageHeader title="Partner Scorecard" subtitle="Opportunity scoring across all partnership dimensions" />

      {partners.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p>No partners scored yet.</p>
            <Link href="/partners/new" style={{ color: '#a5b4fc' }}>Add your first partner →</Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {partners.map((p) => {
            const scoreBreakdown = JSON.parse(p.score_breakdown || '{}');
            const cities = JSON.parse(p.primary_cities || '[]');
            const channels = JSON.parse(p.activation_channels || '[]');
            const reasoning = scorePartner({
              partner_type: p.partner_type,
              eligible_population: p.eligible_population,
              audience_profile: p.audience_profile,
              primary_cities: cities,
              activation_channels: channels,
              commitment_preference: p.commitment_preference,
              brand_tier: p.brand_tier,
            }).reasoning;

            return (
              <Card key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <Link href={`/partners/${p.id}`} style={{ fontSize: '18px', fontWeight: 600, color: '#e2e2f0', textDecoration: 'none' }}>
                        {p.name}
                      </Link>
                      <Badge color={recColor(p.score_total)}>{recLabel(p.score_total)}</Badge>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{p.partner_type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '44px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#a5b4fc', lineHeight: 1 }}>
                      {p.score_total?.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>/ 5.0</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <SectionLabel>Dimension Scores</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.entries(scoreBreakdown).map(([key, val]) => (
                        <div key={key}>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '3px', textTransform: 'capitalize' }}>
                            {key.replace(/_/g, ' ')}
                          </div>
                          <ScoreBar value={val as number} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Reasoning</SectionLabel>
                    <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {reasoning.map((r, i) => (
                        <li key={i} style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.5 }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
