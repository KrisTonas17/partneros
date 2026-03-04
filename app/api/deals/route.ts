import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { runDealEngine } from '@/lib/deal-engine';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const store = await readDb();
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partner_id');
    const results = Object.values(store.deals)
      .filter(d => !partnerId || d.partner_id === partnerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const store = await readDb();
    const body = await req.json();
    const { partner_id, ...overrides } = body;

    const partner = store.partners[partner_id] as any;
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    const cities = JSON.parse(partner.primary_cities || '[]');
    const channels = JSON.parse(partner.activation_channels || '[]');

    const recommendation = runDealEngine({
      partner_type: partner.partner_type,
      eligible_population: partner.eligible_population,
      primary_cities: cities,
      activation_channels: channels,
      commitment_preference: partner.commitment_preference,
      brand_tier: partner.brand_tier,
      term_years: overrides.term_years || 1,
    });

    const deal = { ...recommendation, ...overrides, partner_id };
    const id = uuidv4();
    const saved = {
      id,
      partner_id,
      archetype: deal.archetype,
      pricing_model: deal.pricing_model,
      term_years: deal.term_years || 1,
      cities: JSON.stringify(deal.cities || cities),
      sla_tier: deal.sla_tier,
      retainer: deal.retainer,
      minimum_guarantee: deal.minimum_guarantee,
      discount_pct: deal.discount_pct,
      member_price: deal.member_price,
      included_bundle: deal.included_bundle,
      overage_rates: deal.overage_rates,
      expected_conversion_rate: deal.expected_conversion_rate,
      confidence_score: deal.confidence_score,
      risk_flags: JSON.stringify(deal.risk_flags),
      rationale: JSON.stringify(deal.rationale),
      created_at: new Date().toISOString(),
    };

    store.deals[id] = saved;
    await writeDb(store);
    return NextResponse.json({ deal: saved, recommendation });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
