import { put, list, del, getDownloadUrl } from '@vercel/blob';

export interface Partner {
  id: string;
  name: string;
  partner_type: string;
  eligible_population: number;
  audience_profile: string;
  primary_cities: string;
  activation_channels: string;
  commitment_preference: string;
  brand_tier: string;
  personalization_notes: string;
  score_total: number;
  score_breakdown: string;
  stage: string;
  created_at: string;
}

export interface Deal {
  id: string;
  partner_id: string;
  archetype: string;
  pricing_model: string;
  term_years: number;
  cities: string;
  sla_tier: string;
  retainer: number;
  minimum_guarantee: number;
  discount_pct: number;
  member_price: number;
  included_bundle: string;
  overage_rates: string;
  expected_conversion_rate: number;
  confidence_score: number;
  risk_flags: string;
  rationale: string;
  created_at: string;
}

export interface Outreach {
  id: string;
  partner_id: string;
  prospect_name: string;
  prospect_title: string;
  company: string;
  style: string;
  linkedin_connect: string;
  linkedin_followups: string;
  email_subjects: string;
  email_bodies: string;
  bump_email: string;
  created_at: string;
}

export interface DbStore {
  partners: Record<string, Partner>;
  deals: Record<string, Deal>;
  outreach: Record<string, Outreach>;
}

const BLOB_PATH = 'partneros-db.json';

export async function readDb(): Promise<DbStore> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length === 0) return { partners: {}, deals: {}, outreach: {} };

    const downloadUrl = await getDownloadUrl(blobs[0].url);
    const res = await fetch(downloadUrl, { cache: 'no-store' });
    if (!res.ok) return { partners: {}, deals: {}, outreach: {} };
    return await res.json();
  } catch (e) {
    console.error('readDb error:', e);
    return { partners: {}, deals: {}, outreach: {} };
  }
}

export async function writeDb(store: DbStore): Promise<void> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url));
    }

    await put(BLOB_PATH, JSON.stringify(store), {
      access: 'private',
      contentType: 'application/json',
    });
  } catch (e) {
    console.error('writeDb error:', e);
    throw e;
  }
}
