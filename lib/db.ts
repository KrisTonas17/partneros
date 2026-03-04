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

type Store = {
  partners: Map<string, Partner>;
  deals: Map<string, Deal>;
  outreach: Map<string, Outreach>;
};

// eslint-disable-next-line no-var
declare var __partnerOsStore: Store | undefined;

const store: Store = (typeof globalThis !== 'undefined' && (globalThis as any).__partnerOsStore)
  ? (globalThis as any).__partnerOsStore
  : {
      partners: new Map<string, Partner>(),
      deals: new Map<string, Deal>(),
      outreach: new Map<string, Outreach>(),
    };

(globalThis as any).__partnerOsStore = store;

export function getStore(): Store {
  return store;
}
