'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Select, Textarea, Button, PageHeader, Badge, ScoreBar, SectionLabel } from '@/components/ui';

const PARTNER_TYPES = [
  { value: 'Employer', label: 'Employer' },
  { value: 'Affinity / Distribution — Bank', label: 'Affinity — Bank' },
  { value: 'Affinity / Distribution — Wealth Manager', label: 'Affinity — Wealth Manager' },
  { value: 'Affinity / Distribution — Luxury Loyalty', label: 'Affinity — Luxury Loyalty' },
  { value: 'Events / Hospitality — Luxury Resort', label: 'Events — Luxury Resort' },
  { value: 'Events / Hospitality — Event Firm', label: 'Events — Event Firm' },
  { value: 'Events / Hospitality — Production Company', label: 'Events — Production Company' },
];

const BRAND_TIERS = [
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Mid-Market', label: 'Mid-Market' },
  { value: 'Mass Market', label: 'Mass Market' },
];

const COMMITMENT_PREFS = [
  { value: 'Retainer', label: 'Retainer' },
  { value: 'Retainer converting to minimum guarantee', label: 'Retainer → Min Guarantee' },
  { value: 'Minimum guarantee only', label: 'Minimum Guarantee Only' },
  { value: 'Flexible', label: 'Flexible' },
];

export default function NewPartnerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', partner_type: '', eligible_population: '',
    audience_profile: '', primary_cities: '', activation_channels: '',
    commitment_preference: '', brand_tier: '', personalization_notes: '',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.partner_type) { setError('Name and partner type are required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const recColor = (score: number) => score >= 3.5 ? 'green' : score >= 2.5 ? 'yellow' : 'red';

  if (result) {
    const { partner, scorecard } = result;
    const breakdown = scorecard.score_breakdown;
    return (
      <div style={{ padding: '48px 48px 80px', maxWidth: '900px' }}>
        <PageHeader title={`${partner.name} — Scorecard`} subtitle="Partner created and scored successfully" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <Card>
            <SectionLabel>Overall Score</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '52px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#a5b4fc', lineHeight: 1 }}>
                {scorecard.score_total.toFixed(1)}
              </span>
              <span style={{ fontSize: '20px', color: '#6b7280', marginBottom: '8px' }}>/5.0</span>
            </div>
            <Badge color={recColor(scorecard.score_total)}>{scorecard.recommendation}</Badge>
          </Card>
          <Card>
            <SectionLabel>Score Breakdown</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(breakdown).map(([key, val]) => (
                <div key={key}>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', textTransform: 'capitalize' }}>
                    {key.replace(/_/g, ' ')}
                  </div>
                  <ScoreBar value={val as number} />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <SectionLabel>Reasoning</SectionLabel>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {scorecard.reasoning.map((r: string, i: number) => (
              <li key={i} style={{ color: '#9ca3af', fontSize: '14px' }}>{r}</li>
            ))}
          </ul>
        </Card>
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => router.push(`/partners/${partner.id}`)} style={{
            padding: '10px 20px', borderRadius: '8px', background: '#6366f1', color: '#fff',
            border: 'none', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
          }}>View Partner →</button>
          <button onClick={() => router.push('/deal-builder')} style={{
            padding: '10px 20px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
            border: '1px solid rgba(99,102,241,0.3)', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
          }}>Build a Deal →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '700px' }}>
      <PageHeader title="New Partner" subtitle="Intake a new partnership opportunity" />
      {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <SectionLabel>Basic Info</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Partner Name" name="name" value={form.name} onChange={update} placeholder="e.g. Summit Private Bank" required />
            <Select label="Partner Type" name="partner_type" value={form.partner_type} onChange={update} options={PARTNER_TYPES} required />
            <Input label="Eligible Population" name="eligible_population" value={form.eligible_population} onChange={update} type="number" placeholder="e.g. 3000" />
          </div>
        </Card>
        <Card>
          <SectionLabel>Audience & Geography</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Textarea label="Audience Profile" name="audience_profile" value={form.audience_profile} onChange={update} placeholder="Describe the audience (e.g. HNW clients with $5M+ AUM)" />
            <Input label="Primary Cities" name="primary_cities" value={form.primary_cities} onChange={update} placeholder="New York, Miami, San Francisco (comma-separated)" />
          </div>
        </Card>
        <Card>
          <SectionLabel>Activation & Deal Preferences</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Activation Channels" name="activation_channels" value={form.activation_channels} onChange={update} placeholder="Relationship managers, Events, Email, Portal (comma-separated)" />
            <Select label="Commitment Preference" name="commitment_preference" value={form.commitment_preference} onChange={update} options={COMMITMENT_PREFS} />
            <Select label="Brand Tier" name="brand_tier" value={form.brand_tier} onChange={update} options={BRAND_TIERS} />
          </div>
        </Card>
        <Card>
          <SectionLabel>Intelligence Notes</SectionLabel>
          <Textarea label="Personalization Nugget" name="personalization_notes" value={form.personalization_notes} onChange={update} placeholder="What's the internal context? What's the decision-maker focused on?" rows={4} />
        </Card>
        <Button type="submit" onClick={handleSubmit} disabled={loading} size="lg">
          {loading ? 'Scoring...' : 'Create Partner + Run Scorecard'}
        </Button>
      </div>
    </div>
  );
}
