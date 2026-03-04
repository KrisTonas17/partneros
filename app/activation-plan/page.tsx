'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Badge, PageHeader, SectionLabel, CopyButton, Button } from '@/components/ui';

export default function ActivationPlanPage() {
  const searchParams = useSearchParams();
  const prePartner = searchParams.get('partner') || '';

  const [partners, setPartners] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState(prePartner);
  const [deals, setDeals] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/partners').then(r => r.json()).then(setPartners); }, []);
  useEffect(() => {
    if (partnerId) fetch(`/api/deals?partner_id=${partnerId}`).then(r => r.json()).then(setDeals);
  }, [partnerId]);

  const generate = async () => {
    if (!partnerId) return;
    setLoading(true);
    const partner = partners.find(p => p.id === partnerId);
    const latestDeal = deals[0];
    const res = await fetch('/api/activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: partnerId,
        archetype: latestDeal?.archetype,
        staged_rollout: latestDeal ? undefined : (partner?.eligible_population > 2000),
      }),
    });
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  const planText = plan ? buildPlanText(plan) : '';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '900px' }}>
      <PageHeader title="Activation Plan" subtitle="Generate a phased launch plan for any partner" />

      <Card style={{ marginBottom: '28px' }}>
        <SectionLabel>Select Partner</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <select
            value={partnerId}
            onChange={e => setPartnerId(e.target.value)}
            style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: partnerId ? '#e2e2f0' : '#6b7280', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
          >
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name} — {p.partner_type}</option>)}
          </select>
          <Button onClick={generate} disabled={!partnerId || loading} size="lg">
            {loading ? 'Generating...' : 'Generate Plan'}
          </Button>
        </div>
      </Card>

      {plan && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <CopyButton text={planText} />
          </div>

          {/* Phases */}
          <SectionLabel>Launch Timeline</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {plan.phases.map((phase: any, i: number) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: '#a5b4fc',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#e2e2f0', marginBottom: '10px' }}>{phase.label}</div>
                    <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {phase.activities.map((act: string, j: number) => (
                        <li key={j} style={{ fontSize: '13.5px', color: '#9ca3af', lineHeight: 1.5 }}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Talking points */}
          <Card style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <SectionLabel>Partner Introduction Talking Points</SectionLabel>
              <CopyButton text={plan.talking_points.join('\n')} />
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.talking_points.map((tp: string, i: number) => (
                <li key={i} style={{ fontSize: '13.5px', color: '#9ca3af', lineHeight: 1.6 }}>{tp}</li>
              ))}
            </ul>
          </Card>

          {/* Client intro script */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <SectionLabel>Client Introduction Script</SectionLabel>
              <CopyButton text={plan.client_intro_script} />
            </div>
            <div style={{
              fontSize: '14px', color: '#9ca3af', lineHeight: 1.7,
              padding: '16px', background: '#12121a', borderRadius: '8px',
              border: '1px solid #2a2a3d', fontStyle: 'italic',
            }}>
              {plan.client_intro_script}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function buildPlanText(plan: any): string {
  const lines: string[] = ['ACTIVATION PLAN\n'];
  for (const phase of plan.phases) {
    lines.push(`${phase.label}`);
    for (const act of phase.activities) lines.push(`  • ${act}`);
    lines.push('');
  }
  lines.push('TALKING POINTS');
  for (const tp of plan.talking_points) lines.push(`• ${tp}`);
  lines.push('');
  lines.push('CLIENT INTRODUCTION SCRIPT');
  lines.push(plan.client_intro_script);
  return lines.join('\n');
}
