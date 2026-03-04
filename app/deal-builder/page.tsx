'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Select, Input, Button, Badge, PageHeader, SectionLabel, CopyButton } from '@/components/ui';

function DealBuilderPageInner() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('partner') || '';

  const [partners, setPartners] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState(preselected);
  const [termYears, setTermYears] = useState('1');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [overrides, setOverrides] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/partners').then(r => r.json()).then(setPartners);
  }, []);

  const runEngine = async () => {
    if (!partnerId) return;
    setLoading(true);
    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: partnerId, term_years: parseInt(termYears), ...overrides }),
    });
    const data = await res.json();
    setResult(data);
    setSaved(true);
    setLoading(false);
  };

  const override = (key: string, val: string) => setOverrides((o: any) => ({ ...o, [key]: val }));

  const fmt = (n: number) => n ? `$${n.toLocaleString()}` : '—';

  const selectedPartner = partners.find(p => p.id === partnerId);

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '1100px' }}>
      <PageHeader title="Deal Builder" subtitle="Run the deal intelligence engine and configure deal terms" />

      <Card style={{ marginBottom: '24px' }}>
        <SectionLabel>Select Partner</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'flex-end' }}>
          <select
            value={partnerId}
            onChange={e => setPartnerId(e.target.value)}
            style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: partnerId ? '#e2e2f0' : '#6b7280', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
          >
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name} — {p.partner_type}</option>)}
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Term (years)</label>
            <input
              type="number" min="1" max="5" value={termYears}
              onChange={e => setTermYears(e.target.value)}
              style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: '#e2e2f0', fontSize: '14px', fontFamily: 'var(--font-sans)', width: '100px' }}
            />
          </div>
          <Button onClick={runEngine} disabled={!partnerId || loading} size="lg">
            {loading ? 'Running...' : 'Run Engine'}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <Card>
              <SectionLabel>Archetype & Structure</SectionLabel>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#e2e2f0', marginBottom: '6px' }}>{result.recommendation.archetype}</div>
                <Badge color="purple">{result.recommendation.pricing_model}</Badge>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge>{result.recommendation.sla_tier} SLA</Badge>
                {(result.recommendation.cities || []).map((c: string) => <Badge key={c}>{c}</Badge>)}
              </div>
            </Card>
            <Card>
              <SectionLabel>Confidence</SectionLabel>
              <div style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'var(--font-display)', color: result.recommendation.confidence_score >= 70 ? '#86efac' : '#fcd34d', lineHeight: 1, marginBottom: '6px' }}>
                {result.recommendation.confidence_score}%
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                Conversion rate: {(result.recommendation.expected_conversion_rate * 100).toFixed(1)}%
              </div>
            </Card>
          </div>

          {/* Good / Better / Best */}
          <SectionLabel>Deal Options</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {(['good', 'better', 'best'] as const).map((tier) => {
              const opt = result.recommendation.options[tier];
              const colors = { good: '#86efac', better: '#a5b4fc', best: '#fcd34d' };
              const labels = { good: 'Good', better: 'Better', best: 'Best' };
              return (
                <Card key={tier}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: colors[tier], letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                    {labels[tier]}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {opt.retainer > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>RETAINER</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e2f0' }}>{fmt(opt.retainer)}</div>
                      </div>
                    )}
                    {opt.minimum_guarantee > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>MIN GUARANTEE</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e2f0' }}>{fmt(opt.minimum_guarantee)}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>DISCOUNT</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e2f0' }}>{opt.discount_pct}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>SLA</div>
                      <div style={{ fontSize: '14px', color: '#e2e2f0' }}>{opt.sla_tier}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Full deal terms */}
          <Card style={{ marginBottom: '20px' }}>
            <SectionLabel>Recommended Deal Terms</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Retainer', value: fmt(result.recommendation.retainer) },
                { label: 'Minimum Guarantee', value: fmt(result.recommendation.minimum_guarantee) },
                { label: 'Member Price', value: result.recommendation.member_price > 0 ? fmt(result.recommendation.member_price) : 'N/A' },
                { label: 'Discount', value: `${result.recommendation.discount_pct}%` },
                { label: 'SLA Tier', value: result.recommendation.sla_tier },
                { label: 'Conversion Est.', value: `${(result.recommendation.expected_conversion_rate * 100).toFixed(1)}%` },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#e2e2f0' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Included Bundle</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>{result.recommendation.included_bundle}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Overage Rates</div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>{result.recommendation.overage_rates}</div>
            </div>
          </Card>

          {/* Risk flags */}
          {result.recommendation.risk_flags?.length > 0 && (
            <Card style={{ marginBottom: '20px' }}>
              <SectionLabel>Risk Flags</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result.recommendation.risk_flags.map((flag: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#fcd34d', fontSize: '13.5px' }}>
                    <span>⚠</span><span>{flag}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Staged rollout */}
          {result.recommendation.staged_rollout && result.recommendation.rollout_phases && (
            <Card style={{ marginBottom: '20px' }}>
              <SectionLabel>Staged Rollout Plan</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.recommendation.rollout_phases.map((phase: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#a5b4fc', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <div style={{ fontSize: '13.5px', color: '#9ca3af', lineHeight: 1.5 }}>{phase}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Rationale */}
          <Card style={{ marginBottom: '20px' }}>
            <SectionLabel>Engine Rationale</SectionLabel>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {result.recommendation.rationale?.map((r: string, i: number) => (
                <li key={i} style={{ color: '#9ca3af', fontSize: '13.5px', lineHeight: 1.5 }}>{r}</li>
              ))}
            </ul>
          </Card>

          <div style={{ display: 'flex', gap: '12px' }}>
            <a href={`/term-sheet?partner=${partnerId}`} style={{
              padding: '10px 20px', borderRadius: '8px', background: '#6366f1', color: '#fff',
              textDecoration: 'none', fontSize: '13.5px', fontWeight: 500,
            }}>Generate Term Sheet →</a>
            <a href={`/activation-plan?partner=${partnerId}`} style={{
              padding: '10px 20px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
              textDecoration: 'none', fontSize: '13.5px', fontWeight: 500, border: '1px solid rgba(99,102,241,0.2)',
            }}>Build Activation Plan →</a>
          </div>
        </>
      )}
    </div>
  );
}

export default function DealBuilderPage() {
  return <Suspense fallback={<div style={{ padding: '48px', color: '#6b7280' }}>Loading...</div>}><DealBuilderPageInner /></Suspense>;
}
