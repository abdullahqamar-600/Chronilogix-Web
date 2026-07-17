import type { ArticleContent } from "../article-types";

export const content: ArticleContent = {
  slug: "from-identification-to-engagement",
  dek: "For health plans and ACOs, finding at-risk members has never been the hard part. Moving them from a risk score to a sustained relationship is where programs succeed or quietly stall.",
  blocks: [
    {
      type: "para",
      text: "Every health plan and ACO we speak with can already tell you who their at-risk members are. Claims histories, pharmacy fills, HCC coding, and stratification models have made identification close to a solved problem. The rosters exist. The gaps in care are named. And yet a large share of those members will go the entire year without ever meaningfully engaging the program built for them. The uncomfortable truth of population health is that identification and engagement are not two ends of the same pipeline. They are different disciplines, and most organizations have invested heavily in the first while treating the second as an afterthought.",
    },
    {
      type: "heading",
      text: "Identification was never the bottleneck",
    },
    {
      type: "para",
      text: "Risk stratification has matured to the point of commodity. A plan can rank its membership by predicted cost, flag rising-risk cohorts before they become high-cost ones, and route lists to care management with real precision. This is genuine progress, and it is worth protecting. But a name on a stratified list is not an engaged member. It is a hypothesis. The model has told you where the risk likely sits; it has told you nothing about whether that person will pick up the phone, open the portal, or trust the voice on the other end enough to change anything.",
    },
    {
      type: "para",
      text: "The evidence for this gap is not subtle. Across chronic and behavioral health programs, roughly half to two-thirds of members who would benefit are never reached by traditional outreach at all. They are correctly identified and then lost in the handoff to human capacity that does not scale.",
    },
    {
      type: "stat",
      value: "50–70%",
      label: "of members who would benefit are missed by traditional outreach models",
    },
    {
      type: "heading",
      text: "Engagement is a capacity problem, not a targeting problem",
    },
    {
      type: "para",
      text: "The reason engagement lags identification is structural. Reaching a member the way it actually works — a real conversation, repeated over time, responsive to what the person says rather than a script — is expensive and human-limited. Care management teams are finite. Outreach queues grow faster than staff can work them. So programs triage: the highest-acuity members get calls, everyone else gets a letter or an automated nudge, and the middle of the risk curve, where early intervention is cheapest and most effective, goes largely untouched.",
    },
    {
      type: "para",
      text: "The World Health Organization projects a global shortage of roughly 15 million health workers, and coaching and care-management roles sit squarely inside that shortfall. You cannot hire your way to full engagement of a stratified population. The math does not resolve. Which means the question for health plans and ACOs is not how to identify more members — it is how to hold a genuine, sustained conversation with the members already identified, at a scale human staffing will never reach.",
    },
    {
      type: "callout",
      text: "Identification tells you who is at risk. It does nothing to close the gap between a risk score and a member who is actually changing behavior.",
    },
    {
      type: "heading",
      text: "What the Aetna number actually shows",
    },
    {
      type: "para",
      text: "One of the most useful public data points on this problem comes from Aetna, which reported identifying and engaging an additional 25% of members after shifting how it communicated with them. What matters is the word additional. These were not newly discovered members. They were members the program could already see and had already failed to move. The change was not better targeting. It was a better conversation — coaching grounded in Motivational Interviewing, the evidence-based clinical method for helping people resolve their own ambivalence and commit to change, rather than being lectured toward compliance.",
    },
    {
      type: "stat",
      value: "+25%",
      label: "additional members engaged after shifting the method of the conversation",
      source: "Aetna",
    },
    {
      type: "para",
      text: "That result reframes the entire investment thesis. If a quarter of your already-identified population is recoverable through a change in how you communicate — not who you contact — then the highest-leverage work is no longer upstream in the model. It is downstream, in the interaction itself.",
    },
    {
      type: "heading",
      text: "Engagement is first-line claims mitigation",
    },
    {
      type: "para",
      text: "For a health plan or ACO, sustained engagement is not a member-satisfaction line item. It is the earliest and cheapest point of intervention in the cost curve. A member with diabetes who stays engaged with a coach adjusts diet, adheres to medication, and catches a rising A1c before it becomes an emergency department visit. A member managing depression who feels heard stays in treatment instead of disengaging and decompensating. The context is large: the CDC counts roughly 40 million Americans with diabetes and about 115 million with prediabetes. Every sustained conversation in that population is a claim that may never need to be filed.",
    },
    {
      type: "para",
      text: "The order of operations is what makes this work economically. Engagement mitigates before escalation. The value is realized when the intervention lands early enough to change a trajectory — not after an acute event has already generated the claim. That is why engagement, done at scale and sustained over months rather than a single outreach call, behaves like a first line of defense rather than a wellness perk.",
    },
    {
      type: "subheading",
      text: "What sustained engagement requires",
    },
    {
      type: "list",
      items: [
        "Reach that does not depend on adding headcount for every additional member contacted",
        "A method grounded in clinical evidence, not scripted compliance prompts that members tune out",
        "Continuity over time, so a member has an ongoing relationship rather than a one-off call",
        "Safe escalation paths, so the moments that need a human clinician reach one without delay",
      ],
    },
    {
      type: "heading",
      text: "Where Chronilogix fits",
    },
    {
      type: "para",
      text: "Chronilogix is built for exactly this second discipline — turning identified members into engaged ones, and keeping them engaged. Its coaching engine, Rooney AI, is built on the Motivational Interviewing research of Dr. Ken Resnicow, who has spent more than three decades in NIH-funded work establishing how MI changes health behavior. That is the same clinical foundation behind the kind of engagement lift Aetna reported, delivered with the consistency and reach that human-only staffing cannot match.",
    },
    {
      type: "para",
      text: "For health plans and ACOs, the implication is straightforward. The stratification work already done is not wasted; it is the input. Chronilogix takes the members a plan has already identified and does the harder, more valuable thing — holding a real conversation with each of them, sustaining it, and escalating to human clinicians when the moment calls for it. Identification told you where the risk was. Engagement is how the risk gets resolved, and it is where the return has been waiting all along.",
    },
  ],
};
