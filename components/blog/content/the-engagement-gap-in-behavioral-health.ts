import type { ArticleContent } from "../article-types";

export const content: ArticleContent = {
  slug: "the-engagement-gap-in-behavioral-health",
  dek: "Most members who need behavioral or chronic care are never reached, and costs compound in the silence between visits. Here is why traditional programs cap out — and what it takes to reach the unreached at population scale.",
  blocks: [
    {
      type: "para",
      text: "Every health plan and employer already knows who its highest-risk members are. The claims data is clear, the risk scores are calculated, and the outreach lists are generated on schedule. And yet, for most behavioral health and chronic care programs, the majority of the people on those lists are never meaningfully engaged. The gap is not a failure of identification. It is a failure of reach — and it is where the cost, and the human toll, quietly accumulate.",
    },
    {
      type: "heading",
      text: "The gap is not who we find. It is who we reach.",
    },
    {
      type: "para",
      text: "The industry has spent two decades getting very good at finding the members who need help. Predictive models flag rising risk, stratification tools rank populations, and care-management platforms hand coordinators a queue of names by Monday morning. The problem begins after the name is found. Between the moment a member is identified and the moment they are actually engaged in ongoing support, most programs lose the majority of the people they set out to help.",
    },
    {
      type: "para",
      text: "Traditional outreach depends on a live human connecting with a member at the right moment, in the right channel, in the right frame of mind — often after several unanswered calls to a number the member no longer recognizes. Even generous estimates put the share of eligible members who never enroll or drop off early at somewhere between half and two thirds. The care is designed. The staff is trained. The member is simply never reached.",
    },
    {
      type: "stat",
      value: "50-70%",
      label: "of eligible members are missed by traditional behavioral and chronic care programs",
    },
    {
      type: "heading",
      text: "Why costs compound between the visits",
    },
    {
      type: "para",
      text: "Behavioral and chronic conditions are not managed in the appointment. They are managed in the thousand small decisions that happen between appointments — whether a medication gets refilled, whether a difficult night gets talked through instead of buried, whether a new symptom prompts a call or a shrug. A member with diabetes sees a clinician for perhaps a few hours a year and lives with the condition for the other 8,760. The disease progresses in that gap, not in the exam room.",
    },
    {
      type: "para",
      text: "This is what makes the engagement gap so expensive. An unreached member does not stay static; they deteriorate on a predictable curve. Prediabetes becomes diabetes. A missed depression screening becomes a crisis. A chronic condition that could have been coached toward stability instead surfaces months later in an emergency department, at a cost measured in orders of magnitude. The scale of the exposed population is not marginal.",
    },
    {
      type: "stat",
      value: "~38M",
      label: "U.S. adults living with diabetes, with roughly 98M more prediabetic",
      source: "CDC",
    },
    {
      type: "callout",
      text: "Every member you identify but never reach is not a neutral outcome. It is a cost that compounds, quietly, until it arrives all at once.",
    },
    {
      type: "heading",
      text: "Why traditional programs cap out",
    },
    {
      type: "para",
      text: "The instinct, when engagement is low, is to hire more coaches. It rarely works at the scale the problem demands, for a structural reason: the supply of qualified behavioral coaches is nowhere near the size of the population that needs them, and it cannot be conjured on a quarterly timeline. The World Health Organization has estimated a global shortfall on the order of fifteen million health workers, and behavioral coaching sits squarely inside that shortage.",
    },
    {
      type: "stat",
      value: "~15M",
      label: "estimated global shortage of health workers, including behavioral coaches",
      source: "WHO",
    },
    {
      type: "para",
      text: "A live-coaching model is bounded by arithmetic. A coach can hold only so many meaningful conversations in a week, and each one is expensive. That constraint forces every program into the same set of compromises, all of which widen the gap rather than close it:",
    },
    {
      type: "list",
      items: [
        "Triage the panel, so only the highest-acuity members get sustained contact and everyone earlier on the risk curve waits until they are sicker.",
        "Shorten and script the interactions, so the same staff can cover more names — at the cost of the trust that makes members actually change behavior.",
        "Push contact to business hours, when the member's hardest moments almost always fall at night, on weekends, and between shifts.",
        "Accept long waits, where a member ready to engage this week is offered a callback that lands one to two weeks out, long after the window has closed.",
      ],
    },
    {
      type: "para",
      text: "None of these are failures of effort or intent. They are the unavoidable consequences of trying to solve a population-scale problem with a resource that does not scale. Add more staff and the economics break before the coverage does. Ration the staff you have and the gap reopens beneath you. This is the ceiling every traditional program eventually hits.",
    },
    {
      type: "heading",
      text: "Proof that the ceiling can move",
    },
    {
      type: "para",
      text: "The encouraging part is that the engagement gap is not a law of nature. It responds — dramatically — to how members are actually spoken to. When Aetna partnered with Dr. Kenneth Resnicow, a pioneer of Motivational Interviewing, and retrained its care teams to hold real conversations rather than run scripts, the program did not simply retain the members it already had. It reached members it had previously been unable to engage at all.",
    },
    {
      type: "stat",
      value: "+25%",
      label: "additional members identified and engaged after adopting a Motivational Interviewing approach",
      source: "Aetna",
    },
    {
      type: "para",
      text: "That figure matters because it is additive. It is not a better retention rate on the members who were always going to pick up the phone. It is a share of the previously unreached population brought into care by changing the nature of the conversation itself. The method worked. What it could not do, on its own, was scale — because it still ran on the same finite supply of trained human coaches. Aetna proved the ceiling could move. It did not remove the ceiling.",
    },
    {
      type: "callout",
      text: "The method that closes the engagement gap is well established. The unsolved problem has always been delivering it to everyone, at any hour, without running out of coaches.",
    },
    {
      type: "heading",
      text: "Reaching the unreached at population scale",
    },
    {
      type: "para",
      text: "This is the specific problem Chronilogix was built to solve. Rather than asking how to hire enough coaches to cover a population, it asks a different question: how do you deliver the same evidence-based conversation to every member who needs it, at the moment they need it, without the arithmetic of live staffing setting the limit?",
    },
    {
      type: "para",
      text: "The answer is to operationalize the method itself. Chronilogix takes Dr. Resnicow's thirty years of NIH-funded Motivational Interviewing research and encodes it into the coaching engine at the core of the platform, so the empathy, autonomy, and genuine dialogue that produced Aetna's results are available to an entire member population rather than a triaged fraction of it. The member who is ready at 2 a.m. is met at 2 a.m. The member earlier on the risk curve is engaged before the crisis, not after it. The conversations that used to be rationed become the default.",
    },
    {
      type: "para",
      text: "The result is a change in the shape of the coverage curve. Identification stops being the end of the funnel and becomes the beginning of a relationship that scales with the population instead of collapsing under it. For the plan sponsor, the broker, or the employer footing the downstream cost, that is the difference that matters: not a marginally better version of the outreach that already misses most of its members, but a way to reach the ones every traditional program was structurally built to leave behind — and to reach them while intervention still changes the outcome.",
    },
  ],
};
