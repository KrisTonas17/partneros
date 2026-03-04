export interface ActivationPlanInput {
  partner_name: string;
  archetype: string;
  cities: string[];
  activation_channels: string[];
  staged_rollout: boolean;
}

export interface ActivationPlan {
  phases: { label: string; activities: string[] }[];
  talking_points: string[];
  client_intro_script: string;
}

export function generateActivationPlan(input: ActivationPlanInput): ActivationPlan {
  const { partner_name, archetype, cities, activation_channels, staged_rollout } = input;
  const city = cities[0] || 'primary market';
  const channels = activation_channels.map(c => c.toLowerCase());
  const hasRM = channels.some(c => c.includes('rm') || c.includes('relationship'));
  const hasEvents = channels.some(c => c.includes('event'));
  const hasPortal = channels.some(c => c.includes('portal'));

  let phases: { label: string; activities: string[] }[] = [];
  let talking_points: string[] = [];
  let client_intro_script = '';

  if (archetype.toLowerCase().includes('employer')) {
    phases = [
      {
        label: 'Week 1 — Internal Enablement',
        activities: [
          `Brief HR and executive sponsors on the benefit program`,
          `Configure membership blocks and employee-facing collateral`,
          `Set up reporting dashboard for HR team`,
          staged_rollout ? `Define cohort criteria for initial group in ${city}` : `Prepare full launch communication`,
        ],
      },
      {
        label: 'Week 2 — Soft Launch',
        activities: [
          staged_rollout ? `Send personalized benefit announcement to initial cohort in ${city}` : `Send benefit announcement to full executive population`,
          `HR point-of-contact available for questions`,
          `Track activation and early enrollment`,
        ],
      },
      {
        label: 'Weeks 3–4 — Engagement Drive',
        activities: [
          `Send follow-up communication to non-activated members`,
          `Host optional informational call or lunch-and-learn`,
          hasEvents ? `Coordinate first hosted experience to showcase the service` : `Share case study or testimonial from early adopters`,
        ],
      },
      {
        label: 'Month 2+ — Optimization',
        activities: [
          `Monthly reporting to HR sponsor`,
          `Identify power users for referral or expansion`,
          cities.length > 1 && staged_rollout ? `Begin planning expansion to ${cities.slice(1).join(', ')}` : `Review renewal discussion timeline`,
          `Quarterly business review with executive sponsor`,
        ],
      },
    ];

    talking_points = [
      `${partner_name} is investing in a meaningful travel benefit for their leadership team — not a perk, a professional infrastructure.`,
      `The benefit covers what matters most for executives: immediate access, no friction, consistent experience across cities.`,
      `HR doesn't manage this directly — we handle the service layer so your team stays focused on other priorities.`,
      `This is confidential at the executive level — it doesn't appear on a general benefits menu.`,
    ];

    client_intro_script = `Hi [executive first name] — I wanted to share something we've just launched as part of your company's benefits package. Starting [date], you'll have access to [service] in ${city}. There's no enrollment process — your access is already activated. Here's how to use it for the first time: [link or instructions]. If you have questions, here's your direct contact: [name].`;

  } else if (archetype.toLowerCase().includes('events') || archetype.toLowerCase().includes('hospitality')) {
    phases = [
      {
        label: 'Week 1 — Internal Enablement',
        activities: [
          `Brief ${partner_name} concierge and guest services team on the partnership`,
          `Define the service scope, response times, and escalation path`,
          `Configure any portal access or booking tools`,
          `Train front-desk and event staff on when and how to introduce the service`,
        ],
      },
      {
        label: 'Week 2 — Limited Launch',
        activities: [
          staged_rollout ? `Begin offering service to select VIP guests in ${city}` : `Full launch across guest touchpoints`,
          `Monitor early requests and response quality`,
          `Gather guest feedback within 48 hours of each activation`,
        ],
      },
      {
        label: 'Weeks 3–4 — Events Activation',
        activities: [
          hasEvents ? `Identify upcoming events where service adds the most value` : `Review concierge activity logs for optimization`,
          `Create a pre-event checklist to ensure seamless guest coverage`,
          `Share a monthly summary of activity and guest ratings with ${partner_name} leadership`,
        ],
      },
      {
        label: 'Month 2+ — Reporting and Expansion',
        activities: [
          `Monthly usage and satisfaction reports to ${partner_name}`,
          cities.length > 1 ? `Plan service expansion to ${cities.slice(1).join(', ')}` : `Explore adding properties or venues`,
          `Annual review and contract renewal discussion`,
        ],
      },
    ];

    talking_points = [
      `Your guests already expect excellence. This partnership ensures that extends to every logistical touchpoint during their stay or event.`,
      `Staff don't need to source solutions on the fly — they have a reliable, trained partner available when guests need support.`,
      `We start with a focused group in ${city} so we can dial in the experience before expanding.`,
      `Reporting gives you visibility into exactly how the service is performing and where it's adding the most value.`,
    ];

    client_intro_script = `Welcome to [property/event]. As part of your experience here, you have access to a dedicated service for [category] needs during your stay. If you need anything at any time, here's the direct contact: [number/app]. Our team typically responds within [SLA time]. We hope this makes your stay even more seamless.`;

  } else {
    // Affinity / Distribution
    phases = [
      {
        label: 'Week 1 — Internal Enablement',
        activities: [
          `Onboard ${partner_name} team leads and relationship managers`,
          `Distribute talking points, collateral, and introduction scripts`,
          hasPortal ? `Configure partner portal access for RMs` : `Set up shared communication protocol`,
          staged_rollout ? `Identify initial client cohort in ${city}` : `Build full client invitation list`,
        ],
      },
      {
        label: 'Week 2 — Client Introduction',
        activities: [
          staged_rollout ? `Begin outreach to curated client group in ${city} — targeting highest-fit profiles first` : `Launch full client invitation campaign`,
          hasRM ? `RMs make warm introductions via email or in upcoming client calls` : `Email-based introduction campaign to target segment`,
          `Track open rates, inquiries, and early activations`,
        ],
      },
      {
        label: 'Weeks 3–4 — Warm Activation',
        activities: [
          hasEvents ? `Host a co-branded client event in ${city} to showcase the partnership` : `Send follow-up to non-responders with social proof content`,
          hasRM ? `RMs follow up individually with top-priority clients` : `Send targeted follow-up email to high-engagement segment`,
          `First enrollment report shared with ${partner_name} leadership`,
        ],
      },
      {
        label: 'Month 2+ — Optimization',
        activities: [
          `Monthly dashboard review with ${partner_name} relationship lead`,
          `Identify power users and referral candidates`,
          cities.length > 1 && staged_rollout ? `Expand to ${cities.slice(1).join(', ')} after reviewing ${city} results` : `Discuss performance against minimum guarantee`,
          `Quarterly executive business review`,
        ],
      },
    ];

    talking_points = [
      `${partner_name}'s clients expect white-glove experiences — this partnership adds a meaningful dimension to the relationship they have with your firm.`,
      `RMs don't need to manage anything — we do the service delivery. They just make the introduction.`,
      `We design this to feel like a ${partner_name} benefit, not an external referral.`,
      staged_rollout ? `We start with a focused group in ${city} so you can validate the client response before we expand.` : `Full launch is coordinated so your team controls the narrative.`,
    ];

    client_intro_script = `Hi [client first name] — I wanted to share something we've arranged exclusively for clients like you. Given how much you travel and the kind of experience you expect, we've partnered with [service] to make [category] accessible in ${city}. A few of our clients have already had the chance to use it and the feedback has been exceptional. I'd love to set you up with access — it only takes two minutes. Can I send over the details?`;
  }

  return { phases, talking_points, client_intro_script };
}
