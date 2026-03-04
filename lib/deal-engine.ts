export interface DealEngineInput {
  partner_type: string;
  eligible_population: number;
  primary_cities: string[];
  activation_channels: string[];
  commitment_preference: string;
  brand_tier: string;
  term_years?: number;
}

export interface DealRecommendation {
  archetype: string;
  pricing_model: string;
  sla_tier: string;
  cities: string[];
  retainer: number;
  minimum_guarantee: number;
  member_price: number;
  discount_pct: number;
  included_bundle: string;
  overage_rates: string;
  expected_conversion_rate: number;
  confidence_score: number;
  risk_flags: string[];
  rationale: string[];
  staged_rollout: boolean;
  rollout_phases?: string[];
  options: {
    good: Partial<DealRecommendation>;
    better: Partial<DealRecommendation>;
    best: Partial<DealRecommendation>;
  };
}

export function runDealEngine(input: DealEngineInput): DealRecommendation {
  const type = (input.partner_type || '').toLowerCase();
  const channels = (input.activation_channels || []).map(c => c.toLowerCase());
  const cities = input.primary_cities || [];
  const population = input.eligible_population || 0;
  const termYears = input.term_years || 1;

  // Determine archetype
  let archetype = 'Affinity / Distribution';
  if (type.includes('employer') || type.includes('corporate')) archetype = 'Employer Executive Benefit';
  else if (type.includes('resort') || type.includes('event') || type.includes('hospitality')) archetype = 'Events / Hospitality';

  // Conversion rate
  let conversionRate = 0.05;
  if (archetype === 'Employer Executive Benefit') conversionRate = 0.60;
  else if (archetype === 'Events / Hospitality') conversionRate = 0.02;
  else {
    const hasRM = channels.some(c => c.includes('rm') || c.includes('relationship'));
    const hasEvents = channels.some(c => c.includes('event'));
    if (hasRM || hasEvents) conversionRate = 0.08;
  }

  // Member price
  let memberPrice = 0;
  if (archetype === 'Affinity / Distribution') memberPrice = 3500;
  else if (archetype === 'Events / Hospitality') memberPrice = 2500;
  else memberPrice = 0;

  // SLA tier
  let slaTier = 'Next Day';
  const hasRM = channels.some(c => c.includes('rm') || c.includes('relationship'));
  const hasPortal = channels.some(c => c.includes('portal'));
  const hasEvents = channels.some(c => c.includes('event'));
  if (hasRM && hasPortal && hasEvents) slaTier = '2 Hour';
  else if (hasRM || hasEvents) slaTier = '6 Hour';

  // SLA multiplier
  const slaMultiplier = slaTier === '2 Hour' ? 1.4 : slaTier === '6 Hour' ? 1.2 : 1.0;

  // City multiplier
  const cityCount = cities.length;
  const cityMultiplier = cityCount >= 3 ? 1.5 : cityCount === 2 ? 1.25 : 1.0;

  // Complexity multiplier
  let complexityMultiplier = 1.0;
  if (hasRM && hasPortal && hasEvents) complexityMultiplier = 1.3;
  else if (hasRM && hasPortal) complexityMultiplier = 1.2;
  else if (hasRM || hasPortal) complexityMultiplier = 1.1;

  // Retainer base
  let retainerBase = 0;
  if (archetype === 'Affinity / Distribution') retainerBase = 250000;
  else if (archetype === 'Events / Hospitality') retainerBase = 300000 * cityCount;

  const retainer = Math.round(retainerBase * slaMultiplier * cityMultiplier * complexityMultiplier);

  // Expected revenue
  const expectedRevenue = population * conversionRate * memberPrice;

  // Risk factor
  let riskFactor = 1.0;
  const activationStrength = channels.length >= 3 ? 'strong' : channels.length === 1 ? 'weak' : 'medium';
  if (activationStrength === 'strong') riskFactor = 0.8;
  else if (activationStrength === 'weak') riskFactor = 1.2;

  const targetFloor = retainer * 0.5;
  const minGuarantee = archetype === 'Employer Executive Benefit' ? 0 : Math.round(Math.max(targetFloor, expectedRevenue * riskFactor));

  // Discount
  let discount = 10;
  if (minGuarantee > 500000) discount += 3;
  if (termYears >= 2) discount += 3;
  if (activationStrength === 'strong') discount += 4;
  discount = Math.min(20, discount);

  // Included bundle
  let includedBundle = '';
  if (archetype === 'Employer Executive Benefit') includedBundle = '10 memberships included; additional at $2,800/each';
  else if (archetype === 'Affinity / Distribution') includedBundle = '5 complimentary memberships for internal use';
  else includedBundle = '3 hosted experiences per quarter included';

  // Overage rates
  let overageRates = '';
  if (archetype === 'Events / Hospitality') overageRates = '$250/request above included bundle; billed monthly';
  else overageRates = 'N/A for this structure';

  // Staged rollout
  const stagedRollout = population > 2000;
  const rolloutPhases = stagedRollout ? [
    `Phase 1: Launch in ${cities[0] || 'primary city'} with initial cohort of ${Math.round(population * 0.2)} members`,
    `Phase 2: Expand to ${cities.slice(1).join(', ') || 'secondary city'} after 90-day review`,
    `Phase 3: Full rollout across all markets — target ${population} members`,
  ] : undefined;

  // Confidence score
  let confidence = 60;
  if (archetype === 'Employer Executive Benefit') confidence = 85;
  if (activationStrength === 'strong') confidence += 10;
  if (activationStrength === 'weak') confidence -= 10;
  if (cities.length >= 2) confidence += 5;
  confidence = Math.min(95, Math.max(30, confidence));

  // Risk flags
  const riskFlags: string[] = [];
  if (archetype === 'Affinity / Distribution' && !hasRM) riskFlags.push('No relationship manager channel — conversion risk is elevated');
  if (population < 200) riskFlags.push('Small addressable population — minimum guarantee is essential protection');
  if (cities.length > 3) riskFlags.push('Multi-city complexity — ensure SLA coverage is confirmed in each market');
  if (termYears === 1) riskFlags.push('1-year term — consider multi-year incentive to improve economics');
  if (archetype === 'Events / Hospitality') riskFlags.push('Demand is event-driven — plan for seasonality in activation calendar');

  // Rationale
  const rationale: string[] = [
    `${archetype} structure selected based on partner type: ${input.partner_type}`,
    `Estimated conversion rate: ${(conversionRate * 100).toFixed(1)}% based on activation channels`,
    `Retainer reflects ${slaTier} SLA tier, ${cityCount} city deployment, ${activationStrength} activation complexity`,
    stagedRollout ? 'Staged rollout recommended due to population size — reduces operational risk' : 'Direct full launch is appropriate given manageable population size',
    `Discount of ${discount}% reflects ${termYears}-year term and ${activationStrength} activation commitment`,
  ];

  const pricing_model = archetype === 'Employer Executive Benefit'
    ? 'Membership Block Purchase'
    : archetype === 'Affinity / Distribution'
    ? 'Retainer + Minimum Guarantee'
    : 'Access Retainer + Included Bundle';

  const base: DealRecommendation = {
    archetype,
    pricing_model,
    sla_tier: slaTier,
    cities,
    retainer,
    minimum_guarantee: minGuarantee,
    member_price: memberPrice,
    discount_pct: discount,
    included_bundle: includedBundle,
    overage_rates: overageRates,
    expected_conversion_rate: conversionRate,
    confidence_score: confidence,
    risk_flags: riskFlags,
    rationale,
    staged_rollout: stagedRollout,
    rollout_phases: rolloutPhases,
    options: {
      good: {},
      better: {},
      best: {},
    },
  };

  // Good / Better / Best options
  base.options = {
    good: {
      retainer: Math.round(retainer * 0.85),
      minimum_guarantee: Math.round(minGuarantee * 0.9),
      discount_pct: Math.min(20, discount + 3),
      sla_tier: 'Next Day',
      included_bundle: '3 complimentary memberships for internal use',
    },
    better: {
      retainer,
      minimum_guarantee: minGuarantee,
      discount_pct: discount,
      sla_tier: slaTier,
      included_bundle: includedBundle,
    },
    best: {
      retainer: Math.round(retainer * 1.1),
      minimum_guarantee: Math.round(minGuarantee * 1.1),
      discount_pct: Math.max(0, discount - 3),
      sla_tier: '2 Hour',
      included_bundle: includedBundle + '; dedicated account manager included',
    },
  };

  return base;
}
