'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Badge, PageHeader, ScoreBar, SectionLabel } from '@/components/ui';
import { scorePartner } from '@/lib/scoring';

export default function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [partner, setPartner] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [outreachList, setOutreachList] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/partners/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push('/partners'); return; }
        setPartner(data.partner);
        setDeals(data.deals || []);
        setOutreachList(data.outreach || []);
      })
      .catch(() => router.push('/partners'));
  }, [id, router]);

  if (!partner) return <div style={{ padding: '48px', color: '#6b7280' }}>Loading...</div>;

  const cities = JSON.parse(partner.primary_cities || '[]');
  const channels = JSON.parse(partner.activation_channels || '[]');
  const scoreBreakdown = JSON.parse(partner.score_breakdown || '{}');
  const scoreResult = scorePartner({
    partner_type: partner.partner_type,
    eligible_population: partner.eligible_population,
    audience_profile: partner.audience_profile,
    primary_cities: cities,
    activation_channels: channels,
    commitment_preference: partner.commitment_preference,
    brand_tier: partner.brand_tier,
  });
  const recColor = (score: number) => score >= 3.5 ? 'green' : score >= 2.5 ? 'yellow' : 'red';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '8px' }}>
        <Link href="/partners" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>← Partners</Link>
      </div>
      <PageHeader
        title={partner.name}
        subtitle={partner.partner_type}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href={`/deal-builder?partner=${id}`} style={{
              padding: '9px 18px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)',
              color: '#a5b4fc', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
              border: '1px solid rgba(99,102,241,0.2)',
            }}>Build Deal</Link>
            <Link href={`/outreach?partner=${id}`} style={{
              padding: '9px 18px', borderRadius: '8px', background: '#6366f1',
              color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 500,
            }}>Generate Outreach</Link>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <Card>
          <SectionLabel>Score</SectionLabel>
          <div style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#a5b4fc', lineHeight: 1, marginBottom: '8px' }}>
            {partner.score_total?.toFixed(1)}
          </div>
          <Badge color={recColor(partner.score_total)}>{scoreResult.recommendation}</Badge>
        </Card>
        <Card>
          <SectionLabel>Population</SectionLabel>
          <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#e2e2f0', lineHeight: 1, marginBottom: '4px' }}>
            {partner.eligible_population?.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>eligible individuals</div>
        </Card>
        <Card>
          <SectionLabel>Markets</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {cities.map((c: string) => <Badge key={c}>{c}</Badge>)}
          </div>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <Card>
          <SectionLabel>Score Breakdown</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(scoreBreakdown).map(([key, val]) => (
              <div key={key}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </div>
                <ScoreBar value={val as number} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionLabel>Partner Profile</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Audience</div>
              <div style={{ fontSize: '13.5px', color: '#e2e2f0' }}>{partner.audience_profile || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Activation Channels</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {channels.map((c: string) => <Badge key={c} color="purple">{c}</Badge>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Commitment Preference</div>
              <div style={{ fontSize: '13.5px', color: '#e2e2f0' }}>{partner.commitment_preference || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Brand Tier</div>
              <div style={{ fontSize: '13.5px', color: '#e2e2f0' }}>{partner.brand_tier || '—'}</div>
            </div>
            {partner.personalization_notes && (
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Intelligence Notes</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.5 }}>{partner.personalization_notes}</div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Card style={{ marginBottom: '28px' }}>
        <SectionLabel>Scoring Rationale</SectionLabel>
        <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {scoreResult.reasoning.map((r, i) => (
            <li key={i} style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.5 }}>{r}</li>
          ))}
        </ul>
      </Card>
      {deals.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <SectionLabel>Deal History</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deals.map((d) => {
              const riskFlags = JSON.parse(d.risk_flags || '[]');
              return (
                <Card key={d.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e2f0', marginBottom: '6px' }}>{d.archetype}</div>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#9ca3af' }}>
                        {d.retainer > 0 && <span>Retainer: <strong style={{ color: '#e2e2f0' }}>${d.retainer?.toLocaleString()}</strong></span>}
                        {d.minimum_guarantee > 0 && <span>Min Guarantee: <strong style={{ color: '#e2e2f0' }}>${d.minimum_guarantee?.toLocaleString()}</strong></span>}
                        {d.member_price > 0 && <span>Member Price: <strong style={{ color: '#e2e2f0' }}>${d.member_price?.toLocaleString()}</strong></span>}
                        <span>Confidence: <strong style={{ color: '#a5b4fc' }}>{d.confidence_score}%</strong></span>
                      </div>
                    </div>
                    <Link href={`/term-sheet?deal=${d.id}`} style={{ fontSize: '12px', color: '#a5b4fc', textDecoration: 'none' }}>Term Sheet →</Link>
                  </div>
                  {riskFlags.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {riskFlags.map((f: string, i: number) => <Badge key={i} color="yellow">⚠ {f}</Badge>)}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
      {outreachList.length > 0 && (
        <div>
          <SectionLabel>Outreach History</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {outreachList.map((o) => (
              <Card key={o.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#e2e2f0' }}>
                    {o.prospect_name} — <span style={{ color: '#9ca3af' }}>{o.prospect_title}</span>
                  </div>
                  <Badge color="purple">{o.style}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
