import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await readDb();
    const partner = store.partners[params.id];
    if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const deals = Object.values(store.deals)
      .filter(d => d.partner_id === params.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const outreach = Object.values(store.outreach)
      .filter(o => o.partner_id === params.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ partner, deals, outreach });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const store = await readDb();
    Object.keys(store.deals).forEach(k => { if (store.deals[k].partner_id === params.id) delete store.deals[k]; });
    Object.keys(store.outreach).forEach(k => { if (store.outreach[k].partner_id === params.id) delete store.outreach[k]; });
    delete store.partners[params.id];
    await writeDb(store);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
