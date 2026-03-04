import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { generateActivationPlan } from '@/lib/activation';

export async function POST(req: NextRequest) {
  try {
    const { partners } = getStore();
    const body = await req.json();
    const { partner_id, archetype, staged_rollout } = body;

    const partner = partners.get(partner_id) as any;
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    const cities = JSON.parse(partner.primary_cities || '[]');
    const channels = JSON.parse(partner.activation_channels || '[]');

    const plan = generateActivationPlan({
      partner_name: partner.name,
      archetype: archetype || 'Affinity / Distribution',
      cities,
      activation_channels: channels,
      staged_rollout: staged_rollout ?? (partner.eligible_population > 2000),
    });

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
