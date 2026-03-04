import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { scorePartner } from '@/lib/scoring';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const { partners } = getStore();
    const sorted = Array.from(partners.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { partners } = getStore();
    const body = await req.json();
    const id = uuidv4();

    const cities = Array.isArray(body.primary_cities)
      ? body.primary_cities
      : (body.primary_cities || '').split(',').map((c: string) => c.trim()).filter(Boolean);
    const channels = Array.isArray(body.activation_channels)
      ? body.activation_channels
      : (body.activation_channels || '').split(',').map((c: string) => c.trim()).filter(Boolean);

    const scoreResult = scorePartner({
      partner_type: body.partner_type,
      eligible_population: parseInt(body.eligible_population) || 0,
      audience_profile: body.audience_profile || '',
      primary_cities: cities,
      activation_channels: channels,
      commitment_preference: body.commitment_preference || '',
      brand_tier: body.brand_tier || '',
      personalization_notes: body.personalization_notes || '',
    });

    const partner = {
      id,
      name: body.name,
      partner_type: body.partner_type,
      eligible_population: parseInt(body.eligible_population) || 0,
      audience_profile: body.audience_profile || '',
      primary_cities: JSON.stringify(cities),
      activation_channels: JSON.stringify(channels),
      commitment_preference: body.commitment_preference || '',
      brand_tier: body.brand_tier || '',
      personalization_notes: body.personalization_notes || '',
      score_total: scoreResult.score_total,
      score_breakdown: JSON.stringify(scoreResult.score_breakdown),
      stage: 'prospect',
      created_at: new Date().toISOString(),
    };

    partners.set(id, partner);
    return NextResponse.json({ partner, scorecard: scoreResult });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
