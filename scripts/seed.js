const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(process.cwd(), 'data', 'partneros.db');
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    partner_type TEXT NOT NULL,
    eligible_population INTEGER,
    audience_profile TEXT,
    primary_cities TEXT,
    activation_channels TEXT,
    commitment_preference TEXT,
    brand_tier TEXT,
    personalization_notes TEXT,
    score_total REAL,
    score_breakdown TEXT,
    stage TEXT DEFAULT 'prospect',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL,
    archetype TEXT,
    pricing_model TEXT,
    term_years INTEGER,
    cities TEXT,
    sla_tier TEXT,
    retainer REAL,
    minimum_guarantee REAL,
    discount_pct REAL,
    member_price REAL,
    included_bundle TEXT,
    overage_rates TEXT,
    expected_conversion_rate REAL,
    confidence_score REAL,
    risk_flags TEXT,
    rationale TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
  );
  CREATE TABLE IF NOT EXISTS outreach (
    id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL,
    prospect_name TEXT,
    prospect_title TEXT,
    company TEXT,
    style TEXT,
    linkedin_connect TEXT,
    linkedin_followups TEXT,
    email_subjects TEXT,
    email_bodies TEXT,
    bump_email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (partner_id) REFERENCES partners(id)
  );
`);

const seeds = [
  {
    id: uuidv4(),
    name: 'Aurelius Capital',
    partner_type: 'Employer',
    eligible_population: 120,
    audience_profile: 'Senior executives, managing directors, and C-suite leaders',
    primary_cities: ['New York', 'Miami'],
    activation_channels: ['HR benefit enrollment', 'Email', 'Internal portal'],
    commitment_preference: 'Retainer',
    brand_tier: 'Luxury',
    personalization_notes: 'CEO is focused on retention benefits for top performers heading into comp season.',
    score_breakdown: { distribution_power: 2, audience_fit: 5, activation_capability: 3, operational_complexity: 4, brand_alignment: 5, deal_velocity_likelihood: 4 },
    score_total: 3.83,
  },
  {
    id: uuidv4(),
    name: 'Summit Private Bank',
    partner_type: 'Affinity / Distribution — Bank',
    eligible_population: 3000,
    audience_profile: 'Private banking clients with $5M+ in assets under management',
    primary_cities: ['New York', 'San Francisco', 'Chicago'],
    activation_channels: ['Relationship managers', 'Events', 'Client portal'],
    commitment_preference: 'Retainer converting to minimum guarantee',
    brand_tier: 'Premium',
    personalization_notes: 'Head of Private Banking is building a differentiated client experience program and needs external partners to anchor it.',
    score_breakdown: { distribution_power: 5, audience_fit: 5, activation_capability: 4.5, operational_complexity: 3.5, brand_alignment: 4, deal_velocity_likelihood: 4 },
    score_total: 4.33,
  },
  {
    id: uuidv4(),
    name: 'Velora Resorts',
    partner_type: 'Events / Hospitality — Luxury Resort',
    eligible_population: 800,
    audience_profile: 'High-net-worth leisure and corporate guests, average 3.5 nights per stay',
    primary_cities: ['Aspen', 'Miami Beach'],
    activation_channels: ['Concierge', 'Events', 'Pre-arrival email'],
    commitment_preference: 'Access retainer',
    brand_tier: 'Luxury',
    personalization_notes: 'GM wants to add meaningful guest services without increasing internal headcount.',
    score_breakdown: { distribution_power: 3, audience_fit: 4, activation_capability: 3.5, operational_complexity: 4, brand_alignment: 5, deal_velocity_likelihood: 3.5 },
    score_total: 3.83,
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO partners (id, name, partner_type, eligible_population, audience_profile, primary_cities, activation_channels, commitment_preference, brand_tier, personalization_notes, score_total, score_breakdown, stage)
  VALUES (@id, @name, @partner_type, @eligible_population, @audience_profile, @primary_cities, @activation_channels, @commitment_preference, @brand_tier, @personalization_notes, @score_total, @score_breakdown, 'prospect')
`);

for (const seed of seeds) {
  insert.run({
    ...seed,
    primary_cities: JSON.stringify(seed.primary_cities),
    activation_channels: JSON.stringify(seed.activation_channels),
    score_breakdown: JSON.stringify(seed.score_breakdown),
  });
}

console.log('Seeded 3 sample partners: Aurelius Capital, Summit Private Bank, Velora Resorts');
db.close();
