'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Badge, PageHeader, SectionLabel, CopyButton, Button, Input, Select, Textarea } from '@/components/ui';

const STYLES = [
  { value: 'Josh Braun', label: 'Josh Braun — Curiosity-driven, no pressure' },
  { value: 'John Barrows', label: 'John Barrows — Direct and value-forward' },
  { value: 'Lavender', label: 'Lavender — Short, modern, friendly' },
  { value: 'Becc Holland', label: 'Becc Holland — Research-forward, transparent' },
  { value: 'Nate Nasralla', label: 'Nate Nasralla — Champion-centric, internal buying' },
];

function OutreachPageInner() {
  const searchParams = useSearchParams();
  const prePartner = searchParams.get('partner') || '';

  const [partners, setPartners] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState(prePartner);
  const [form, setForm] = useState({ prospect_name: '', prospect_title: '', company: '', style: 'Josh Braun' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/partners').then(r => r.json()).then(setPartners); }, []);
  useEffect(() => {
    if (partnerId) {
      fetch(`/api/deals?partner_id=${partnerId}`).then(r => r.json()).then(setDeals);
      const p = partners.find(x => x.id === partnerId);
      if (p) setForm(f => ({ ...f, company: p.name }));
    }
  }, [partnerId, partners]);

  const update = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const generate = async () => {
    if (!partnerId || !form.prospect_name) return;
    setLoading(true);
    const latestDeal = deals[0];
    const partner = partners.find(p => p.id === partnerId);
    const res = await fetch('/api/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: partnerId,
        ...form,
        archetype: latestDeal?.archetype,
        staged_rollout: partner?.eligible_population > 2000,
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '900px' }}>
      <PageHeader title="Outreach Generator" subtitle="Generate LinkedIn + email sequences for any partnership prospect" />

      <Card style={{ marginBottom: '28px' }}>
        <SectionLabel>Configuration</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Partner</label>
            <select
              value={partnerId}
              onChange={e => setPartnerId(e.target.value)}
              style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: partnerId ? '#e2e2f0' : '#6b7280', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            >
              <option value="">Select partner...</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name} — {p.partner_type}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Input label="Prospect Name" name="prospect_name" value={form.prospect_name} onChange={update} placeholder="Jane Smith" required />
            <Input label="Title" name="prospect_title" value={form.prospect_title} onChange={update} placeholder="Head of Private Banking" />
            <Input label="Company" name="company" value={form.company} onChange={update} placeholder="Summit Private Bank" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Writing Style</label>
            <select
              name="style"
              value={form.style}
              onChange={update}
              style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: '#e2e2f0', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            >
              {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <Button onClick={generate} disabled={!partnerId || !form.prospect_name || loading} size="lg">
            {loading ? 'Generating...' : 'Generate Outreach'}
          </Button>
        </div>
      </Card>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Badge color="purple">{form.style}</Badge>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>for {form.prospect_name} at {form.company}</span>
          </div>

          {/* LinkedIn connect */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <SectionLabel>LinkedIn Connection Request</SectionLabel>
              <CopyButton text={result.linkedin_connect} />
            </div>
            <div style={{ fontSize: '14px', color: '#e2e2f0', lineHeight: 1.6, padding: '14px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
              {result.linkedin_connect}
            </div>
          </Card>

          {/* LinkedIn follow-ups */}
          <Card>
            <SectionLabel>LinkedIn Follow-ups</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.linkedin_followups?.map((msg: string, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '0.04em' }}>FOLLOW-UP {i + 1}</span>
                    <CopyButton text={msg} />
                  </div>
                  <div style={{ fontSize: '14px', color: '#e2e2f0', lineHeight: 1.6, padding: '14px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Subject lines */}
          <Card>
            <SectionLabel>Email Subject Lines</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.email_subjects?.map((subj: string, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                  <span style={{ fontSize: '14px', color: '#e2e2f0' }}>{subj}</span>
                  <CopyButton text={subj} />
                </div>
              ))}
            </div>
          </Card>

          {/* Email bodies */}
          <Card>
            <SectionLabel>Cold Email Versions</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {result.email_bodies?.map((body: string, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '0.04em' }}>VERSION {i + 1}</span>
                    <CopyButton text={body} />
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#e2e2f0', lineHeight: 1.7, padding: '16px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d', whiteSpace: 'pre-line' }}>
                    {body}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bump */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <SectionLabel>Bump Email</SectionLabel>
              <CopyButton text={result.bump_email} />
            </div>
            <div style={{ fontSize: '14px', color: '#e2e2f0', lineHeight: 1.6, padding: '14px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
              {result.bump_email}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function OutreachPage() {
  return <Suspense fallback={<div style={{ padding: '48px', color: '#6b7280' }}>Loading...</div>}><OutreachPageInner /></Suspense>;
}
