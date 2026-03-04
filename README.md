# PartnerOS

**Partnership Deal Intelligence + GTM Assistant**

PartnerOS helps Directors of Partnerships design, evaluate, and launch scalable strategic partnerships — with a rule-based deal intelligence engine, partner scorecard, term sheet generator, activation plans, and outreach sequences.

---

## Features

- **Partner Scorecard** — Scores every opportunity across 6 dimensions, with reasoning and a Pursue / Pursue With Constraints / Do Not Pursue recommendation
- **Deal Intelligence Engine** — Recommends archetype, pricing model, retainer, minimum guarantee, SLA tier, and rollout structure based on partner type
- **Good / Better / Best Options** — Three deal tiers for every partner
- **Term Sheet Generator** — Renders a clean, copyable term sheet in-browser (no PDF dependency)
- **Activation Plan Generator** — Phased launch plan with talking points and client intro scripts
- **Outreach Generator** — LinkedIn + email sequences in 5 styles (Josh Braun, John Barrows, Lavender, Becc Holland, Nate Nasralla)
- **Sample Data** — 3 pre-seeded partners (Aurelius Capital, Summit Private Bank, Velora Resorts)

---

## Run Locally

```bash
# Install dependencies
npm install

# Seed sample data
npm run seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: GitHub + Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click Deploy

> **Note on database**: The app uses SQLite locally. On Vercel, each serverless function invocation gets a fresh file system, so data won't persist between cold starts. For production persistence, swap `better-sqlite3` for [Turso](https://turso.tech) (edge SQLite) or Supabase — the schema is fully compatible.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## Project Structure

```
partneros/
├── app/
│   ├── api/              # API routes (partners, deals, outreach, activation)
│   ├── dashboard/
│   ├── partners/         # List + detail + new partner form
│   ├── scorecard/
│   ├── deal-builder/
│   ├── term-sheet/
│   ├── activation-plan/
│   └── outreach/
├── components/
│   ├── layout/           # Sidebar
│   └── ui/               # Cards, buttons, inputs, score bars
├── lib/
│   ├── db.ts             # SQLite connection
│   ├── scoring.ts        # Partner scoring engine
│   ├── deal-engine.ts    # Deal intelligence engine
│   ├── outreach.ts       # Outreach generator (5 styles)
│   └── activation.ts     # Activation plan generator
├── scripts/
│   └── seed.js           # Seeds 3 sample partners
└── data/                 # SQLite database (local, gitignored)
```

---

## Partnership Archetypes Supported

| Archetype | Examples | Default Model |
|---|---|---|
| Employer Executive Benefit | Corporations | Membership block purchase |
| Affinity / Distribution | Banks, wealth managers, loyalty platforms | Retainer + minimum guarantee |
| Events / Hospitality | Luxury resorts, event firms | Access retainer + included bundle |

---

## No paid APIs required

All core features work without any external API keys. The optional AI enhancement described in the spec can be added by wiring the OpenAI API key input to the outreach generator endpoints.
