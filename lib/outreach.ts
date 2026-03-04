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

const cityPhrase = (cities: string[]) =>
  cities.length > 0 ? cities[0] : 'your key markets';

const firstCity = (cities: string[]) => cities[0] || 'your market';

function getContextByArchetype(archetype: string | undefined, cities: string[]): {
  valueFrame: string;
  audienceRef: string;
  locationHook: string;
} {
  const a = (archetype || '').toLowerCase();
  if (a.includes('employer')) {
    return {
      valueFrame: 'executive travel coverage',
      audienceRef: 'your leadership team',
      locationHook: `across your offices in ${cityPhrase(cities)}`,
    };
  }
  if (a.includes('affinity') || a.includes('distribution')) {
    return {
      valueFrame: 'VIP client experience',
      audienceRef: 'your highest-value clients',
      locationHook: `in ${cityPhrase(cities)}`,
    };
  }
  return {
    valueFrame: 'guest coverage and operational reliability',
    audienceRef: 'your guests and attendees',
    locationHook: `during events in ${cityPhrase(cities)}`,
  };
}

export function generateOutreach(input: OutreachInput): OutreachOutput {
  const { prospect_name, prospect_title, company, primary_cities, archetype, staged_rollout, style } = input;
  const firstName = prospect_name.split(' ')[0];
  const city = firstCity(primary_cities);
  const ctx = getContextByArchetype(archetype, primary_cities);
  const startPhrase = staged_rollout ? `start with a focused group in ${city}` : `get something running in ${city}`;

  switch (style) {
    case 'Josh Braun': return joshBraun({ firstName, company, ctx, startPhrase, prospect_title });
    case 'John Barrows': return johnBarrows({ firstName, company, ctx, startPhrase, prospect_title });
    case 'Lavender': return lavenderStyle({ firstName, company, ctx, startPhrase, prospect_title });
    case 'Becc Holland': return beccHolland({ firstName, company, ctx, startPhrase, prospect_title });
    case 'Nate Nasralla': return nateNasralla({ firstName, company, ctx, startPhrase, prospect_title });
    default: return joshBraun({ firstName, company, ctx, startPhrase, prospect_title });
  }
}

type StyleInput = {
  firstName: string;
  company: string;
  ctx: ReturnType<typeof getContextByArchetype>;
  startPhrase: string;
  prospect_title: string;
};

function joshBraun({ firstName, company, ctx, startPhrase }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — came across ${company} while thinking through ${ctx.valueFrame} options for organizations like yours. Wanted to connect.`,
    linkedin_followups: [
      `${firstName} — not trying to pitch you. I just kept noticing ${company}'s focus on ${ctx.audienceRef} and thought there might be something worth 10 minutes. No agenda beyond that.`,
      `Realized I never heard back — totally fine if the timing's off. If ${ctx.valueFrame} ever becomes a real priority, happy to share what we've seen work ${ctx.locationHook}. Either way, hope things are going well.`,
    ],
    email_subjects: [
      `A question about ${company}`,
      `${firstName} — honest question`,
      `Probably not the right time, but...`,
    ],
    email_bodies: [
      `${firstName},\n\nNot going to pretend I have perfect intel on what ${company} is working through right now.\n\nBut I've been thinking about ${ctx.audienceRef} and what great ${ctx.valueFrame} looks like ${ctx.locationHook} — and your name came up in that conversation.\n\nWorth a quick call to compare notes?\n\n— [Your Name]`,
      `${firstName},\n\nMost leaders I talk to in your space aren't short on ideas about ${ctx.valueFrame}. What they're short on is a partner who can actually deliver it ${ctx.locationHook} without creating new work for their team.\n\nI'd love to ${startPhrase} and show you what that looks like in practice.\n\nOpen to a 20-minute call?\n\n— [Your Name]`,
    ],
    bump_email: `${firstName} — going to let this one go after this note. If ${ctx.valueFrame} ever becomes a priority for ${ctx.audienceRef}, happy to reconnect. Good luck with everything at ${company}.`,
  };
}

function johnBarrows({ firstName, company, ctx, startPhrase }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — I work with organizations looking to upgrade ${ctx.valueFrame} for ${ctx.audienceRef}. Thought it made sense to connect directly.`,
    linkedin_followups: [
      `${firstName} — quick follow-up. We've helped similar organizations ${startPhrase} and see meaningful results within the first quarter. Would love to share what that looked like.`,
      `Last reach-out from me, ${firstName}. If improving how ${company} supports ${ctx.audienceRef} ${ctx.locationHook} is on your radar this year, I'd love 20 minutes. If not, no hard feelings.`,
    ],
    email_subjects: [
      `How ${company} could strengthen ${ctx.valueFrame}`,
      `${firstName} — quick idea for ${company}`,
      `Re: ${ctx.audienceRef} at ${company}`,
    ],
    email_bodies: [
      `${firstName},\n\nI'll keep this short.\n\nWe partner with organizations like ${company} to improve ${ctx.valueFrame} for ${ctx.audienceRef} ${ctx.locationHook}.\n\nMost of our partnerships start small — we ${startPhrase}, validate the model, then scale.\n\nWould it make sense to spend 20 minutes seeing if there's a fit?\n\n[Your Name]`,
      `${firstName},\n\nThe organizations we work with aren't looking for another vendor. They want a partner who can take ${ctx.valueFrame} off their plate and actually deliver it ${ctx.locationHook}.\n\nHappy to share a few examples of what that looks like in practice. Would Thursday or Friday work for a quick call?\n\n[Your Name]`,
    ],
    bump_email: `${firstName} — one more shot before I move on. If ${ctx.valueFrame} for ${ctx.audienceRef} is something ${company} wants to get right this year, I'd love to be part of that conversation. If the timing's wrong, completely understood.`,
  };
}

function lavenderStyle({ firstName, company, ctx, startPhrase }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `Hey ${firstName} — noticed ${company}'s work with ${ctx.audienceRef} and thought it was worth connecting around ${ctx.valueFrame}.`,
    linkedin_followups: [
      `Hey ${firstName} — hope the week's been good. Quick thought: we've been helping teams like yours ${startPhrase} without adding complexity. Curious if that's on your radar.`,
      `${firstName} — circling back one more time. We work with a handful of organizations on ${ctx.valueFrame} ${ctx.locationHook} and the results have been solid. Happy to share what we've seen if useful.`,
    ],
    email_subjects: [
      `Quick thought for ${company}`,
      `${firstName} — something worth 5 min?`,
      `${ctx.valueFrame} at ${company}`,
    ],
    email_bodies: [
      `Hey ${firstName},\n\nReally quick — we help organizations like ${company} build better ${ctx.valueFrame} for ${ctx.audienceRef} ${ctx.locationHook}.\n\nWe usually ${startPhrase} and go from there. Light lift on your end.\n\nWorth a quick call?\n\n[Your Name]`,
      `Hey ${firstName},\n\nI keep coming back to ${company} when I think about who's doing interesting work with ${ctx.audienceRef}.\n\nWe've been building ${ctx.valueFrame} solutions that don't require a lot from the partner side — mainly we just need your buy-in and a few intros.\n\nOpen to a 15-minute call this week?\n\n[Your Name]`,
    ],
    bump_email: `Hey ${firstName} — just a quick bump in case this got buried. Happy to connect whenever the timing's right.`,
  };
}

function beccHolland({ firstName, company, ctx, startPhrase }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — I found ${company} while researching organizations focused on ${ctx.audienceRef}. The work you're doing around ${ctx.valueFrame} caught my attention.`,
    linkedin_followups: [
      `${firstName} — I wanted to follow up because I genuinely think there's a fit here. The way ${company} supports ${ctx.audienceRef} maps closely to what we've been building ${ctx.locationHook}. Worth 15 minutes?`,
      `${firstName} — I know you're busy, so I'll be direct: I think we could help ${company} ${startPhrase} in a way that doesn't create more work for you. If that's interesting, I'd love a call. If not, I appreciate your time.`,
    ],
    email_subjects: [
      `Why I reached out to you specifically, ${firstName}`,
      `${company} + ${ctx.valueFrame}`,
      `${firstName} — I did my homework`,
    ],
    email_bodies: [
      `${firstName},\n\nI want to be upfront about why I'm reaching out.\n\nI specifically looked at ${company} because of how you support ${ctx.audienceRef} — and I think there's a real opportunity to make ${ctx.valueFrame} a stronger part of that story ${ctx.locationHook}.\n\nI'd love to ${startPhrase} and build from there. Would you be open to 20 minutes?\n\n[Your Name]`,
      `${firstName},\n\nMost of the organizations I work with tell me the same thing: they want to offer something exceptional for ${ctx.audienceRef}, but they don't have the infrastructure to pull it off reliably ${ctx.locationHook}.\n\nThat's exactly what we've built. Happy to walk you through how it works at ${company}'s scale.\n\n[Your Name]`,
    ],
    bump_email: `${firstName} — I realize I've reached out a few times without a response. I'll respect your inbox after this. But if ${ctx.valueFrame} for ${ctx.audienceRef} ever becomes a priority, I'd genuinely love to be the first call you make.`,
  };
}

function nateNasralla({ firstName, company, ctx, startPhrase }: StyleInput): OutreachOutput {
  return {
    linkedin_connect: `${firstName} — building a business case internally for something like this is hard. Wanted to connect in case it's useful to have someone in your corner on the ${ctx.valueFrame} side.`,
    linkedin_followups: [
      `${firstName} — following up because I work with a lot of people in your position who are trying to get internal buy-in for upgrading ${ctx.valueFrame} ${ctx.locationHook}. Happy to share what's worked for others if that's helpful.`,
      `${firstName} — last follow-up from me. If the internal conversation around ${ctx.valueFrame} for ${ctx.audienceRef} gains momentum, I'd love to be a resource. My contact info is below whenever you're ready.`,
    ],
    email_subjects: [
      `The internal case for ${ctx.valueFrame} at ${company}`,
      `Who's your champion for this internally, ${firstName}?`,
      `${firstName} — building alignment at ${company}`,
    ],
    email_bodies: [
      `${firstName},\n\nThe hardest part of improving ${ctx.valueFrame} at a place like ${company} isn't the vendor decision — it's getting the right people aligned internally.\n\nWe've helped teams like yours ${startPhrase} in a way that makes it easy to show early wins and build momentum with stakeholders.\n\nWould it help to talk through what that process looks like? Happy to keep it informal.\n\n[Your Name]`,
      `${firstName},\n\nI'll get to the point: if you're the person at ${company} who cares most about what ${ctx.audienceRef} experience ${ctx.locationHook}, then I want to work with you.\n\nWe build ${ctx.valueFrame} solutions designed to make people like you look great to the people above you. No fluff, no long implementations.\n\nWorth a call?\n\n[Your Name]`,
    ],
    bump_email: `${firstName} — going quiet after this one. If the timing ever shifts and you want a thought partner on the ${ctx.valueFrame} side, I'm easy to find. Best of luck at ${company}.`,
  };
}
