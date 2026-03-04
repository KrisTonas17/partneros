// In-memory store — works on Vercel with zero configuration.
// Data persists as long as the serverless function is warm.

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

// Global in-memory store (persists across requests within same serverless instance)
const store: {
  partners: Map<string, Partner>;
  deals: Map<string, Deal>;
  outreach: Map<string, Outreach>;
} = (global as any).__partnerOsStore ?? {
  partners: new Map(),
  deals: new Map(),
  outreach: new Map(),
};
(global as any).__partnerOsStore = store;

export function getStore() {
  return store;
}
