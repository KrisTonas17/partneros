export interface PartnerData {
  partner_type: string;
  eligible_population: number;
  audience_profile: string;
  primary_cities: string[];
  activation_channels: string[];
  commitment_preference: string;
  brand_tier: string;
  personalization_notes?: string;
}

export interface ScoreBreakdown {
  distribution_power: number;
  audience_fit: number;
  activation_capability: number;
  operational_complexity: number;
  brand_alignment: number;
  deal_velocity_likelihood: number;
}

export interface ScorecardResult {
  score_total: number;
  score_breakdown: ScoreBreakdown;
  recommendation: 'Pursue' | 'Pursue With Constraints' | 'Do Not Pursue';
  reasoning: string[];
}

export function scorePartner(data: PartnerData): ScorecardResult {
  const breakdown: ScoreBreakdown = {
    distribution_power: scoreDistributionPower(data),
    audience_fit: scoreAudienceFit(data),
    activation_capability: scoreActivationCapability(data),
    operational_complexity: scoreOperationalComplexity(data),
    brand_alignment: scoreBrandAlignment(data),
    deal_velocity_likelihood: scoreDealVelocity(data),
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0) / 6;
  const reasoning: string[] = [];

  // Distribution power reasoning
  if (data.eligible_population > 5000) reasoning.push('Large addressable population creates strong distribution upside.');
  else if (data.eligible_population > 500) reasoning.push('Mid-size population provides solid foundation for revenue model.');
  else reasoning.push('Smaller population limits scale — minimum guarantee structure is critical.');

  // Audience fit
  const type = data.partner_type?.toLowerCase() || '';
  if (type.includes('bank') || type.includes('wealth')) reasoning.push('High-net-worth audience profile aligns well with premium membership positioning.');
  if (type.includes('employer')) reasoning.push('Executive audience profile is ideal for employer-benefit deal structure.');
  if (type.includes('resort') || type.includes('event')) reasoning.push('Events and hospitality context creates natural demand triggers.');

  // Activation channels
  const channels = (data.activation_channels || []).map(c => c.toLowerCase());
  if (channels.some(c => c.includes('relationship') || c.includes('rm'))) reasoning.push('Relationship manager channel is highest-conversion activation path.');
  if (channels.some(c => c.includes('event'))) reasoning.push('Events activation drives high-intent introductions.');
  if (channels.length === 1 && channels[0].includes('email')) reasoning.push('Email-only activation is weakest channel — negotiate for RM or events access.');

  // Commitment
  if (data.commitment_preference?.toLowerCase().includes('retainer')) reasoning.push('Retainer preference signals financial commitment and reduces risk.');

  // Brand
  if (data.brand_tier?.toLowerCase() === 'luxury' || data.brand_tier?.toLowerCase() === 'premium') {
    reasoning.push('Premium brand tier ensures audience quality and protects brand integrity.');
  }

  // City rollout
  if (data.primary_cities?.length >= 3) reasoning.push('Multi-city presence supports phased national rollout strategy.');

  let recommendation: 'Pursue' | 'Pursue With Constraints' | 'Do Not Pursue';
  if (total >= 3.5) recommendation = 'Pursue';
  else if (total >= 2.5) recommendation = 'Pursue With Constraints';
  else recommendation = 'Do Not Pursue';

  return { score_total: parseFloat(total.toFixed(2)), score_breakdown: breakdown, recommendation, reasoning };
}

function scoreDistributionPower(data: PartnerData): number {
  const pop = data.eligible_population || 0;
  if (pop >= 5000) return 5;
  if (pop >= 2000) return 4;
  if (pop >= 500) return 3;
  if (pop >= 100) return 2;
  return 1;
}

function scoreAudienceFit(data: PartnerData): number {
  const type = (data.partner_type || '').toLowerCase();
  const profile = (data.audience_profile || '').toLowerCase();
  if (type.includes('bank') || type.includes('wealth') || type.includes('family office')) return 5;
  if (type.includes('employer') && (profile.includes('executive') || profile.includes('c-suite'))) return 5;
  if (type.includes('luxury') || type.includes('resort')) return 4;
  if (type.includes('employer')) return 3;
  if (type.includes('event') || type.includes('hospitality')) return 3;
  return 2;
}

function scoreActivationCapability(data: PartnerData): number {
  const channels = (data.activation_channels || []).map(c => c.toLowerCase());
  let score = 2;
  if (channels.some(c => c.includes('relationship') || c.includes('rm'))) score += 1.5;
  if (channels.some(c => c.includes('event'))) score += 1;
  if (channels.some(c => c.includes('portal'))) score += 0.5;
  return Math.min(5, score);
}

function scoreOperationalComplexity(data: PartnerData): number {
  // Higher = less complex (better score)
  const channels = (data.activation_channels || []).map(c => c.toLowerCase());
  const cities = (data.primary_cities || []).length;
  let score = 5;
  if (cities >= 3) score -= 1;
  if (channels.length >= 3) score -= 0.5;
  const hasRM = channels.some(c => c.includes('rm') || c.includes('relationship'));
  const hasPortal = channels.some(c => c.includes('portal'));
  const hasEvents = channels.some(c => c.includes('event'));
  if (hasRM && hasPortal && hasEvents) score -= 1;
  return Math.max(1, score);
}

function scoreBrandAlignment(data: PartnerData): number {
  const tier = (data.brand_tier || '').toLowerCase();
  if (tier === 'luxury') return 5;
  if (tier === 'premium') return 4;
  if (tier === 'mid-market') return 3;
  if (tier === 'mass market') return 2;
  return 3;
}

function scoreDealVelocity(data: PartnerData): number {
  let score = 3;
  const commitment = (data.commitment_preference || '').toLowerCase();
  if (commitment.includes('retainer')) score += 1;
  if (commitment.includes('quick') || commitment.includes('fast')) score += 0.5;
  const type = (data.partner_type || '').toLowerCase();
  if (type.includes('employer')) score += 0.5;
  return Math.min(5, score);
}
