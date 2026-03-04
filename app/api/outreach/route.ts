import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { generateOutreach } from '@/lib/outreach';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { partners, outreach } = getStore();
    const body = await req.json();
    const { partner_id, prospect_name, prospect_title, company, style, archetype, staged_rollout } = body;

    const partner = partners.get(partner_id) as any;
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    const cities = JSON.parse(partner.primary_cities || '[]');

    const output = generateOutreach({
      prospect_name,
      prospect_title,
      company: company || partner.name,
      partner_type: partner.partner_type,
      primary_cities: cities,
      archetype,
      staged_rollout,
      style,
    });

    const id = uuidv4();
    const saved = {
      id,
      partner_id,
      prospect_name,
      prospect_title,
      company: company || partner.name,
      style,
      linkedin_connect: output.linkedin_connect,
      linkedin_followups: JSON.stringify(output.linkedin_followups),
      email_subjects: JSON.stringify(output.email_subjects),
      email_bodies: JSON.stringify(output.email_bodies),
      bump_email: output.bump_email,
      created_at: new Date().toISOString(),
    };

    outreach.set(id, saved);
    return NextResponse.json({ id, ...output });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { outreach } = getStore();
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partner_id');

    const results = Array.from(outreach.values())
      .filter(o => !partnerId || o.partner_id === partnerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
