'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, PageHeader, SectionLabel, Badge, CopyButton, Button } from '@/components/ui';
import { runDealEngine } from '@/lib/deal-engine';

export default function TermSheetPage() {
  const searchParams = useSearchParams();
  const prePartner = searchParams.get('partner') || '';
  const preDeal = searchParams.get('deal') || '';

  const [partners, setPartners] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState(prePartner);
  const [dealId, setDealId] = useState(preDeal);
  const [termSheet, setTermSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/partners').then(r => r.json()).then(setPartners); }, []);
  useEffect(() => {
    if (partnerId) fetch(`/api/deals?partner_id=${partnerId}`).then(r => r.json()).then(setDeals);
  }, [partnerId]);

  const generate = async () => {
    setLoading(true);
    let partner = partners.find(p => p.id === partnerId);
    if (!partner) { setLoading(false); return; }

    let deal: any = deals.find(d => d.id === dealId);
    if (!deal && deals.length > 0) deal = deals[0];

    const cities = JSON.parse(partner.primary_cities || '[]');
    const channels = JSON.parse(partner.activation_channels || '[]');

    if (!deal) {
      const rec = runDealEngine({
        partner_type: partner.partner_type,
        eligible_population: partner.eligible_population,
        primary_cities: cities,
        activation_channels: channels,
        commitment_preference: partner.commitment_preference,
        brand_tier: partner.brand_tier,
      });
      deal = rec;
    } else {
      const riskFlags = JSON.parse(deal.risk_flags || '[]');
      const rationale = JSON.parse(deal.rationale || '[]');
      deal = { ...deal, risk_flags: riskFlags, rationale };
    }

    const cities2 = Array.isArray(deal.cities) ? deal.cities : JSON.parse(deal.cities || JSON.stringify(cities));

    setTermSheet({ partner, deal, cities: cities2, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
    setLoading(false);
  };

  const fmt = (n: number) => n > 0 ? `$${Number(n).toLocaleString()}` : 'N/A';

  const termSheetText = termSheet ? buildTermSheetText(termSheet) : '';

  return (
    <div style={{ padding: '48px 48px 80px', maxWidth: '900px' }}>
      <PageHeader title="Term Sheet" subtitle="Generate a deal summary document for any partner" />

      <Card style={{ marginBottom: '28px' }}>
        <SectionLabel>Configuration</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Partner</label>
            <select
              value={partnerId}
              onChange={e => { setPartnerId(e.target.value); setDealId(''); setDeals([]); }}
              style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: partnerId ? '#e2e2f0' : '#6b7280', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            >
              <option value="">Select partner...</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Deal (optional)</label>
            <select
              value={dealId}
              onChange={e => setDealId(e.target.value)}
              style={{ padding: '10px 14px', background: '#12121a', border: '1px solid #2a2a3d', borderRadius: '8px', color: dealId ? '#e2e2f0' : '#6b7280', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            >
              <option value="">Auto-generate from partner</option>
              {deals.map(d => <option key={d.id} value={d.id}>{d.archetype} — {new Date(d.created_at).toLocaleDateString()}</option>)}
            </select>
          </div>
          <Button onClick={generate} disabled={!partnerId || loading} size="lg">
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </Card>

      {termSheet && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
            <CopyButton text={termSheetText} />
            <button
              onClick={() => window.print()}
              style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid #2a2a3d', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Print / Save
            </button>
          </div>

          {/* Term Sheet Document */}
          <div style={{ background: '#1a1a26', border: '1px solid #2a2a3d', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid #2a2a3d', padding: '32px 40px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Partnership Term Sheet</div>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: '28px', color: '#e2e2f0' }}>
                {termSheet.partner.name}
              </h2>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>Prepared {termSheet.date} — Confidential</div>
            </div>

            <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Parties */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>01 — Parties</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Service Provider</div>
                    <div style={{ fontSize: '14px', color: '#e2e2f0', fontWeight: 500 }}>[Your Company Name]</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Partner</div>
                    <div style={{ fontSize: '14px', color: '#e2e2f0', fontWeight: 500 }}>{termSheet.partner.name}</div>
                  </div>
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Overview */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>02 — Partnership Overview</div>
                <div style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7 }}>
                  This term sheet outlines the proposed commercial structure for a <strong style={{ color: '#e2e2f0' }}>{termSheet.deal.archetype}</strong> partnership between [Your Company] and {termSheet.partner.name}.
                  The partnership is designed to deliver {termSheet.partner.partner_type?.toLowerCase().includes('employer') ? 'a premium executive travel benefit' : termSheet.partner.partner_type?.toLowerCase().includes('event') ? 'reliable guest services and on-demand hospitality support' : 'an exclusive membership benefit for high-value clients'} across {termSheet.cities.join(', ')}.
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Term */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>03 — Term and Renewal</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Initial Term', value: `${termSheet.deal.term_years || 1} year(s)` },
                    { label: 'Renewal', value: 'Auto-renew with 60-day notice' },
                    { label: 'Markets', value: termSheet.cities.join(', ') },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '14px 16px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e2f0' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Pricing */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>04 — Pricing Table</div>
                <div style={{ border: '1px solid #2a2a3d', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#12121a' }}>
                        {['Component', 'Structure', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid #2a2a3d' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        termSheet.deal.retainer > 0 && ['Annual Retainer', termSheet.deal.pricing_model, fmt(termSheet.deal.retainer)],
                        termSheet.deal.minimum_guarantee > 0 && ['Minimum Guarantee', 'Annual floor', fmt(termSheet.deal.minimum_guarantee)],
                        termSheet.deal.member_price > 0 && ['Membership Price', 'Per member / year', fmt(termSheet.deal.member_price)],
                        termSheet.deal.discount_pct > 0 && ['Partner Discount', 'Applied to membership', `${termSheet.deal.discount_pct}%`],
                      ].filter(Boolean).map((row: any, i, arr) => (
                        <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #2a2a3d' : 'none' }}>
                          {row.map((cell: string, j: number) => (
                            <td key={j} style={{ padding: '13px 16px', fontSize: '13.5px', color: j === 2 ? '#e2e2f0' : '#9ca3af', fontWeight: j === 2 ? 600 : 400 }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Bundle */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>05 — Included Bundle & Overages</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '14px 16px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Included Bundle</div>
                    <div style={{ fontSize: '13.5px', color: '#e2e2f0' }}>{termSheet.deal.included_bundle}</div>
                  </div>
                  <div style={{ padding: '14px 16px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Overage Rates</div>
                    <div style={{ fontSize: '13.5px', color: '#e2e2f0' }}>{termSheet.deal.overage_rates}</div>
                  </div>
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Obligations */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>06 — Activation Obligations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    `${termSheet.partner.name} will facilitate member introductions through designated activation channels`,
                    `Both parties will participate in a quarterly business review`,
                    `[Your Company] will provide monthly usage and performance reports`,
                    `${termSheet.partner.name} will maintain brand standards for all member-facing communications`,
                    `All pricing and deal terms are confidential between both parties`,
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: '13.5px', color: '#9ca3af' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div style={{ height: '1px', background: '#2a2a3d' }} />

              {/* Reporting */}
              <section>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>07 — Reporting Cadence</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { period: 'Monthly', items: 'Usage dashboard, activation metrics' },
                    { period: 'Quarterly', items: 'Performance review, optimization recommendations' },
                    { period: 'Annual', items: 'Full partnership review, renewal discussion' },
                  ].map(item => (
                    <div key={item.period} style={{ padding: '14px 16px', background: '#12121a', borderRadius: '8px', border: '1px solid #2a2a3d' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#a5b4fc', marginBottom: '6px' }}>{item.period}</div>
                      <div style={{ fontSize: '12.5px', color: '#9ca3af' }}>{item.items}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer note */}
              <div style={{ padding: '16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#fcd34d' }}>
                  This term sheet is non-binding and is intended for discussion purposes only. Final commercial terms are subject to executed agreement between both parties.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildTermSheetText(ts: any): string {
  const fmt = (n: number) => n > 0 ? `$${Number(n).toLocaleString()}` : 'N/A';
  return `PARTNERSHIP TERM SHEET — CONFIDENTIAL
Partner: ${ts.partner.name}
Date: ${ts.date}

PARTIES
Service Provider: [Your Company Name]
Partner: ${ts.partner.name}

PARTNERSHIP OVERVIEW
Archetype: ${ts.deal.archetype}
Markets: ${ts.cities.join(', ')}

TERM
Initial Term: ${ts.deal.term_years || 1} year(s)
Renewal: Auto-renew with 60-day notice

PRICING
Annual Retainer: ${fmt(ts.deal.retainer)}
Minimum Guarantee: ${fmt(ts.deal.minimum_guarantee)}
Membership Price: ${ts.deal.member_price > 0 ? fmt(ts.deal.member_price) : 'N/A'}
Partner Discount: ${ts.deal.discount_pct}%

INCLUDED BUNDLE
${ts.deal.included_bundle}

OVERAGE RATES
${ts.deal.overage_rates}

NOTE: This term sheet is non-binding and for discussion purposes only.
`;
}
