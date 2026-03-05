export interface OutreachInput {
  prospect_name: string;
  prospect_title: string;
  company: string;
  partner_type: string;
  primary_cities: string[];
  archetype?: string;
  staged_rollout?: boolean;
  style: string;
}

export interface OutreachOutput {
  linkedin_connect: string;
  linkedin_followups: string[];
  email_subjects: string[];
  email_bodies: string[];
  bump_email: string;
}

const firstCity = (cities: string[]) => cities[0] || 'your market';
const cityPhrase = (cities: string[]) => cities.length > 0 ? cities[0] : 'your key markets';

function getPersonaBucket(title: string): 'hr' | 'wealth' | 'hospitality' | 'csuite' {
  const t = title.toLowerCase();
  if (t.includes('hr') || t.includes('human resources') || t.includes('people') || t.includes('benefits') || t.includes('talent') || t.includes('workforce')) return 'hr';
  if (t.includes('wealth') || t.includes('bank') || t.includes('financial') || t.includes('family office') || t.includes('private client') || t.includes('investment') || t.includes('advisor')) return 'wealth';
  if (t.includes('hospitality') || t.includes('event') || t.includes('hotel') || t.includes('resort') || t.includes('guest') || t.includes('experience') || t.includes('partnership') || t.includes('concierge')) return 'hospitality';
  return 'csuite';
}

type PersonaContext = {
  painPoint: string;
  differentiator: string;
  valueFrame: string;
  audienceRef: string;
  pilotLine: string;
};

function getPersonaContext(bucket: 'hr' | 'wealth' | 'hospitality' | 'csuite', cities: string[], staged_rollout?: boolean): PersonaContext {
  const city = firstCity(cities);
  const startPhrase = staged_rollout ? `start with a pilot group in ${city}` : `get it running in ${city}`;

  switch (bucket) {
    case 'hr':
      return {
        painPoint: `When an executive gets sick at 11pm or needs urgent care on a travel day, the ER is not a real answer — and most benefits packages quietly leave that gap open`,
        differentiator: `Sollis gives your leadership team a dedicated medical team on call 24/7 — no waiting rooms, no insurance gatekeeping, same-day or in-home care for urgent situations`,
        valueFrame: `24/7 executive medical access`,
        audienceRef: `your leadership team`,
        pilotLine: `We can ${startPhrase} with a focused group and show you exactly what the member experience looks like before any broader commitment`,
      };
    case 'wealth':
      return {
        painPoint: `Your clients have private banking, private aviation, private clubs — but when something medical happens, they're navigating the same ER as everyone else`,
        differentiator: `Sollis closes that gap — a 24/7 private medical team that handles urgent care immediately, in-home or at a private facility, with no waiting rooms and no insurance friction`,
        valueFrame: `private medical access for high-net-worth clients`,
        audienceRef: `your clients`,
        pilotLine: `We typically ${startPhrase} with a curated client group so you can see the response before rolling it out more broadly`,
      };
    case 'hospitality':
      return {
        painPoint: `A medical situation during a high-profile event or stay — handled poorly — becomes the story. Most venues don't have a real answer for what happens next`,
        differentiator: `Sollis provides a dedicated medical team available on-site or on-call 24/7, handling urgent situations immediately so your team never has to improvise`,
        valueFrame: `on-demand medical coverage for guests and events`,
        audienceRef: `your guests`,
        pilotLine: `We can ${startPhrase} for a specific property or event series and build from there`,
      };
    case 'csuite':
      return {
        painPoint: `Most leadership teams have strong benefits — until someone needs urgent medical care on a weekend or while traveling, and the only real option is the ER`,
        differentiator: `Sollis is a 24/7 private medical membership — dedicated care team, no waiting rooms, in-home or at a private facility — designed specifically for people who expect a different standard`,
        valueFrame: `private medical access for executives`,
        audienceRef: `your leadership team`,
        pilotLine: `We can ${startPhrase} and have the program running within a few weeks`,
      };
  }
}

export function generateOutreach(input: OutreachInput): OutreachOutput {
  const { prospect_name, prospect_title, company, primary_cities, staged_rollout, style } = input;
  const firstName = prospect_name.split(' ')[0];
  const bucket = getPersonaBucket(prospect_title);
  const ctx = getPersonaContext(bucket, primary_cities, staged_rollout);

  switch (style) {
    case 'Josh Braun': return joshBraun({ firstName, company, ctx, bucket });
    case 'John Barrows': return johnBarrows({ firstName, company, ctx, bucket });
    case 'Lavender': return lavenderStyle({ firstName, company, ctx, bucket });
    case 'Becc Holland': return beccHolland({ firstName, company, ctx, bucket });
    case 'Nate Nasralla': return nateNasralla({ firstName, company, ctx, bucket });
    default: return joshBraun({ firstName, company, ctx, bucket });
  }
}

type StyleInput = {
  firstName: string;
  company: string;
  ctx: PersonaContext;
  bucket: 'hr' | 'wealth' | 'hospitality' | 'csuite';
};

function joshBraun({ firstName, company, ctx, bucket }: StyleInput): OutreachOutput {
  const connectLines: Record<string, string> = {
    hr: `${firstName} — working with a few HR teams on how they handle urgent medical access for executives. Thought it made sense to connect.`,
    wealth: `${firstName} — working with a few firms on a gap most wealth managers haven't fully solved yet. Thought it made sense to connect.`,
    hospitality: `${firstName} — working with a few hospitality and events teams on how they handle medical situations for guests. Thought it made sense to connect.`,
    csuite: `${firstName} — working with a few leadership teams on executive medical access. Thought it made sense to connect.`,
  };
  const followup1Lines: Record<string, string> = {
    hr: `${firstName} — not pitching you. Genuine question: when one of your executives needs urgent medical care after hours, what's the actual plan? Most companies don't have a clean answer. We might be able to help.`,
    wealth: `${firstName} — not pitching you. Genuine question: when one of your clients has a medical situation while traveling or after hours, what do they do? Most firms don't have a real answer to that. We might be able to help.`,
    hospitality: `${firstName} — not pitching you. Genuine question: when a guest at one of your properties or events has a medical situation, what's the actual protocol? Most venues are improvising in that moment. We might be able to help.`,
    csuite: `${firstName} — not pitching you. Genuine question: when someone on your leadership team needs urgent medical care on a weekend, what's the plan? Most companies don't have a real answer. We might be able to help.`,
  };

  return {
    linkedin_connect: connectLines[bucket],
    linkedin_followups: [
      followup1Lines[bucket],
      `Leaving it here after this. If the question of what ${company} does when someone needs urgent medical care ever becomes worth a conversation, I'm easy to find.`,
    ],
    email_subjects: [
      bucket === 'hr' ? `A question about ${company}'s leadership team` :
      bucket === 'wealth' ? `What your clients do when something medical happens` :
      bucket === 'hospitality' ? `When a guest needs medical care at ${company}` :
      `What happens when an exec needs care at 11pm`,
      `${firstName} — honest question`,
      `The gap most ${bucket === 'wealth' ? 'firms' : bucket === 'hospitality' ? 'venues' : 'companies'} leave open`,
    ],
    email_bodies: [
      `${firstName},\n\n${ctx.painPoint}.\n\n${ctx.differentiator}.\n\n${ctx.pilotLine}.\n\nWorth a quick conversation?`,
      `${firstName},\n\nMost of the ${bucket === 'hr' ? 'HR leaders' : bucket === 'wealth' ? 'wealth managers' : bucket === 'hospitality' ? 'hospitality leaders' : 'executives'} I talk to say the same thing: they've thought about ${ctx.valueFrame}, but haven't found something that actually fits.\n\nSollis is built specifically for this. ${ctx.pilotLine}.\n\nOpen to 20 minutes?`,
    ],
    bump_email: `${firstName} — last note. If the question of ${ctx.valueFrame} at ${company} ever becomes a priority, I'd welcome the conversation.`,
  };
}

function johnBarrows({ firstName, company, ctx, bucket }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — helping ${bucket === 'hr' ? 'companies close the gap in executive medical access' : bucket === 'wealth' ? 'wealth management firms give clients private medical access' : bucket === 'hospitality' ? 'hospitality teams solve the guest medical coverage problem' : 'leadership teams replace the ER with something better'}. Thought a direct conversation made sense.`,
    linkedin_followups: [
      `${firstName} — quick follow-up. The ${bucket === 'hr' ? 'companies' : bucket === 'wealth' ? 'firms' : 'organizations'} we work with have strong programs overall but one consistent gap: ${ctx.painPoint.toLowerCase()}. Sollis fixes exactly that. Worth 20 minutes?`,
      `Last one from me, ${firstName}. If closing the gap on ${ctx.valueFrame} is something ${company} wants to get right, I'd like to be part of that conversation.`,
    ],
    email_subjects: [
      `The gap in ${company}'s ${bucket === 'hr' ? 'executive benefits' : bucket === 'wealth' ? 'client offering' : bucket === 'hospitality' ? 'guest coverage' : 'leadership benefits'}`,
      `${firstName} — a specific problem and a direct solution`,
      `Closing the medical access gap at ${company}`,
    ],
    email_bodies: [
      `${firstName},\n\n${ctx.painPoint}.\n\nSollis is a 24/7 private medical membership that handles urgent care immediately — in-person, in-home, or on the phone — with no waiting rooms and no insurance friction.\n\n${ctx.pilotLine}.\n\nWould it make sense to spend 20 minutes on this?`,
      `${firstName},\n\nI'll be direct: Sollis exists because the ER is not an acceptable answer for ${ctx.audienceRef} who expect a different level of service in every other part of their lives.\n\n${ctx.differentiator}.\n\nHappy to share what this looks like at ${company}'s scale. Thursday or Friday work?`,
    ],
    bump_email: `${firstName} — one more before I move on. If ${ctx.valueFrame} is something ${company} wants to solve, I'm ready when you are.`,
  };
}

function lavenderStyle({ firstName, company, ctx, bucket }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — came across ${company} while thinking through how ${bucket === 'hr' ? 'companies handle urgent medical access for their people' : bucket === 'wealth' ? 'firms support clients when something medical happens' : bucket === 'hospitality' ? 'hospitality teams cover guests medically' : 'leadership teams handle after-hours medical situations'}. Worth connecting.`,
    linkedin_followups: [
      `${firstName} — quick one: ${ctx.painPoint.toLowerCase()}. Sollis is the alternative most ${bucket === 'hr' ? 'HR leaders' : bucket === 'wealth' ? 'wealth managers' : bucket === 'hospitality' ? 'hospitality operators' : 'executives'} didn't know existed. Could be worth 15 minutes.`,
      `${firstName} — one more. We help ${bucket === 'hr' ? 'companies' : bucket === 'wealth' ? 'firms' : 'organizations'} like ${company} give ${ctx.audienceRef} 24/7 private medical access — no waiting rooms, no insurance friction. Happy to share more if useful.`,
    ],
    email_subjects: [
      `Quick thought on ${company}'s ${bucket === 'hr' ? 'executive benefits' : bucket === 'wealth' ? 'client experience' : bucket === 'hospitality' ? 'guest coverage' : 'leadership team'}`,
      `The medical access gap at ${company}`,
      `${firstName} — something worth 10 minutes`,
    ],
    email_bodies: [
      `${firstName},\n\n${ctx.painPoint}.\n\nSollis gives ${ctx.audienceRef} a better option — a dedicated medical team available 24/7 that handles most urgent situations immediately, in-home or at a private facility.\n\n${ctx.pilotLine}.\n\nWorth a quick call?`,
      `${firstName},\n\nSollis is essentially a private ER experience for members — 24/7 access to a dedicated medical team, no waiting rooms, no insurance gatekeeping.\n\nFor ${ctx.audienceRef} at ${company}, it closes a real gap. ${ctx.pilotLine}.\n\nOpen to 15 minutes this week?`,
    ],
    bump_email: `${firstName} — just a final note. If ${ctx.valueFrame} is ever worth a conversation at ${company}, I'm easy to reach.`,
  };
}

function beccHolland({ firstName, company, ctx, bucket }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — reached out specifically because of how ${company} invests in ${ctx.audienceRef}. There's a gap most ${bucket === 'hr' ? 'benefits programs' : bucket === 'wealth' ? 'client offerings' : bucket === 'hospitality' ? 'guest experience programs' : 'leadership benefits'} leave open that I think is directly relevant to what you're building.`,
    linkedin_followups: [
      `${firstName} — want to be specific about why I'm following up. ${ctx.painPoint}. That's the gap Sollis was built to close — and I think it maps directly to what ${company} cares about.`,
      `${firstName} — I'll be straight: I think there's a real fit here. If protecting ${ctx.audienceRef} with ${ctx.valueFrame} is something ${company} takes seriously, I'd like 20 minutes to show you what that looks like.`,
    ],
    email_subjects: [
      `Why I reached out to you specifically, ${firstName}`,
      `The gap I keep seeing at ${bucket === 'hr' ? 'companies' : bucket === 'wealth' ? 'firms' : 'organizations'} like ${company}`,
      `${firstName} — a specific problem worth solving`,
    ],
    email_bodies: [
      `${firstName},\n\nI'm reaching out because of a specific gap I see at ${bucket === 'hr' ? 'companies' : bucket === 'wealth' ? 'firms' : 'organizations'} like ${company}.\n\n${ctx.painPoint}.\n\nSollis closes that gap — 24/7 dedicated medical team, no ER, no insurance friction, in-home or at a private facility.\n\n${ctx.pilotLine}.\n\nWould you be open to 20 minutes?`,
      `${firstName},\n\nMost ${bucket === 'hr' ? 'HR leaders' : bucket === 'wealth' ? 'wealth managers' : bucket === 'hospitality' ? 'hospitality leaders' : 'executives'} I talk to have done serious work building strong programs for ${ctx.audienceRef}. But when I ask what happens when someone needs urgent medical care after hours, the honest answer is usually "the ER."\n\nSollis is the answer to that question — and I think it fits what ${company} is trying to build.\n\nCan I show you how it works?`,
    ],
    bump_email: `${firstName} — I've reached out a few times because I genuinely think this is relevant to ${company}. If ${ctx.valueFrame} is ever on the table, I'd be glad to be the first call.`,
  };
}

function nateNasralla({ firstName, company, ctx, bucket }: StyleInput): OutreachOutput {
  const internalBuyerRef = bucket === 'hr' ? 'getting leadership to approve a new benefits category'
    : bucket === 'wealth' ? 'getting internal buy-in to add a medical access benefit for clients'
    : bucket === 'hospitality' ? 'getting stakeholders aligned on a guest medical coverage program'
    : 'making the case internally for a new executive benefit';

  return {
    linkedin_connect: `${firstName} — ${internalBuyerRef} is a harder conversation than it should be. Wanted to connect in case it's useful to have someone in your corner on the ${ctx.valueFrame} side.`,
    linkedin_followups: [
      `${firstName} — a lot of the ${bucket === 'hr' ? 'benefits leaders' : bucket === 'wealth' ? 'client-facing leaders' : bucket === 'hospitality' ? 'hospitality leaders' : 'executives'} I work with say the same thing: they know the ER isn't a real answer, but they haven't found a solution that's easy to get approved. That's exactly what Sollis is designed to make easier.`,
      `${firstName} — last follow-up. If building the case for ${ctx.valueFrame} at ${company} gains traction, I'd like to help you make it. I'm easy to find.`,
    ],
    email_subjects: [
      `The internal case for ${ctx.valueFrame} at ${company}`,
      `${firstName} — making this easy to say yes to`,
      `Who owns this decision at ${company}?`,
    ],
    email_bodies: [
      `${firstName},\n\nThe hardest part of adding ${ctx.valueFrame} isn't finding the right solution — it's getting the right people aligned internally.\n\nSollis is built to make that easier: ${ctx.pilotLine}, prove the value with a small group, then expand. No large upfront commitment.\n\nWould it help to talk through what that process looks like at ${company}?`,
      `${firstName},\n\nIf you're the person at ${company} who cares most about what happens when ${ctx.audienceRef} needs urgent medical care — I want to work with you.\n\n${ctx.differentiator}.\n\nWe make the internal conversation straightforward: pilot, prove it, scale it.\n\nWorth a call?`,
    ],
    bump_email: `${firstName} — going quiet after this. If the conversation around ${ctx.valueFrame} moves forward at ${company}, I'd welcome being part of it.`,
  };
}
