import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { partners, deals, outreach } = getStore();
    const partner = partners.get(params.id);
    if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const partnerDeals = Array.from(deals.values())
      .filter(d => d.partner_id === params.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const partnerOutreach = Array.from(outreach.values())
      .filter(o => o.partner_id === params.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ partner, deals: partnerDeals, outreach: partnerOutreach });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { partners, deals, outreach } = getStore();
    // Remove related records
    for (const [key, deal] of deals) {
      if (deal.partner_id === params.id) deals.delete(key);
    }
    for (const [key, o] of outreach) {
      if (o.partner_id === params.id) outreach.delete(key);
    }
    partners.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
