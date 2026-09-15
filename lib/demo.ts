import { SAMPLE_FREELANCE, SAMPLE_LEASE, SAMPLE_NDA } from "./samples";
import type {
  BriefingPack,
  ComparisonResult,
  DocumentAnalysis,
} from "./types";

export const DEMO_LEASE: DocumentAnalysis = {
  titleGuess: "Residential lease for Unit 4B, 18 Willow Street",
  kindGuess: "lease",
  oneSentence:
    "A one-year apartment lease with high late fees, broad landlord entry, remaining-rent liability if you leave early, and several waivers that are easy to miss.",
  plainSummary:
    "This is a one-year rental for Unit 4B. You pay $2,150 on the 1st, plus a $45 amenities fee, and a two-month deposit. If rent is late after the 3rd, fees stack daily. The landlord can enter without notice, can change lobby rules after you sign, and the text tries to make you pay the rest of the year's rent plus $1,500 if you leave early — even if someone else moves in. Several sentences ask you to give up tools people often assume they have, such as withholding rent for slow repairs or a two-way lawyer-fee rule. This is a reading of the sample, not advice about whether those sentences would stand up in court.",
  parties: ["Maple Court LLC (Landlord)", "Jordan Hale (Tenant)"],
  moneyTerms: [
    "$2,150 monthly rent due on the 1st",
    "$75 late fee after the 3rd plus $15/day",
    "$4,300 security deposit (two months)",
    "$45 monthly amenities fee",
    "Tenant pays repairs under $400",
    "$1,500 reletting fee plus remaining rent if you break the lease",
  ],
  datesAndDeadlines: [
    "Term: April 1, 2026 – March 31, 2027",
    "60 days' written notice if you do not want to renew",
    "Rent late after the 3rd",
    "Deposit return: up to 60 days after you leave",
    "3 days' notice on default before lockout language",
  ],
  clauses: [
    {
      title: "Automatic 12% bump if you stay without a new lease",
      originalExcerpt:
        "If Tenant stays after the end date without a new written lease, tenancy becomes month-to-month and rent increases by 12% automatically.",
      plainLanguage:
        "If the year ends and you keep living there without signing a new lease, it turns month-to-month and rent jumps 12% on its own.",
      tags: ["money", "deadline", "exit"],
      risk: "watch",
      whyItMatters:
        "Missing the 60-day notice window can lock you into a more expensive month-to-month stay.",
      questionsToAsk: [
        "What happens if I give notice a few days late?",
        "Is the 12% increase negotiable before I sign?",
      ],
    },
    {
      title: "Late fees stack quickly",
      originalExcerpt:
        "A late fee of $75 applies if rent is not received by the 3rd, plus $15 per day thereafter. Landlord may apply any payment first to late fees, then to rent.",
      plainLanguage:
        "If rent arrives after the 3rd, you owe $75 plus $15 every extra day. Payments can be counted toward fees first, which can keep rent looking unpaid.",
      tags: ["money", "you-must"],
      risk: "high",
      whyItMatters:
        "A short delay can become an expensive loop if payments are applied to fees instead of rent.",
      questionsToAsk: [
        "Are daily late fees capped in this state?",
        "Can we add a grace period in writing?",
      ],
    },
    {
      title: "Deposit can be used broadly",
      originalExcerpt:
        'Landlord may use the deposit for unpaid rent, cleaning beyond ordinary wear, and "any other amounts Landlord deems reasonably related to Tenant\'s occupancy."',
      plainLanguage:
        "The landlord can dip into your deposit for more than damage or unpaid rent — anything they say is reasonably related to you living there.",
      tags: ["money", "you-give-up"],
      risk: "watch",
      whyItMatters:
        "Vague deposit language often leads to disputes when you move out.",
      questionsToAsk: [
        "Can we limit the deposit to rent, documented damage, and unpaid utilities?",
        "Will I get an itemized list of deductions?",
      ],
    },
    {
      title: "Entry with or without notice",
      originalExcerpt:
        "Landlord may enter the unit at any time for inspections, showings, or repairs, with or without notice in Landlord's sole discretion.",
      plainLanguage:
        "The landlord can come in anytime for inspections, showings, or repairs and does not have to tell you first.",
      tags: ["you-give-up", "privacy"],
      risk: "high",
      whyItMatters:
        "This is unusually broad compared with many leases that require reasonable notice except in emergencies.",
      questionsToAsk: [
        "Can we require 24-hour notice except for emergencies?",
        "What counts as an emergency here?",
      ],
    },
    {
      title: "You cannot withhold rent for slow repairs",
      originalExcerpt:
        'Landlord will address habitability issues "within a commercially reasonable time." Tenant may not withhold rent for repair delays.',
      plainLanguage:
        "If something important is broken, the landlord only promises to fix it in a vaguely 'reasonable' time, and the lease says you still have to pay full rent while you wait.",
      tags: ["they-must", "you-must", "you-give-up"],
      risk: "high",
      whyItMatters:
        "Repair leverage and habitability rights are often regulated by local law; this clause tries to take that leverage away.",
      questionsToAsk: [
        "Does local law still allow repair-and-deduct or rent escrow despite this sentence?",
        "Can we put repair response times in writing (e.g., 24 hours for heat)?",
      ],
    },
    {
      title: "Breaking the lease still costs the full remaining rent",
      originalExcerpt:
        "If Tenant breaks the lease, Tenant owes the remaining rent for the full term, plus a $1,500 reletting fee, even if Landlord re-rents the unit. Tenant waives any duty of Landlord to mitigate damages.",
      plainLanguage:
        "If you leave early, you may still owe every month left on the lease plus $1,500, even if someone else moves in. The lease says the landlord does not have to try to re-rent.",
      tags: ["money", "exit", "you-give-up"],
      risk: "high",
      whyItMatters:
        "This is a major financial trap. Many places require landlords to try to re-rent; this text tries to waive that.",
      questionsToAsk: [
        "Is a waiver of the duty to mitigate enforceable where this unit is located?",
        "Can we replace this with a fixed early-termination fee?",
      ],
    },
    {
      title: "Fee-shifting even if the landlord loses",
      originalExcerpt:
        "Tenant will pay Landlord's attorney's fees in any action, whether or not Landlord prevails.",
      plainLanguage:
        "If there is a legal fight, you could owe the landlord's lawyer bills even if you win.",
      tags: ["dispute", "money", "you-give-up"],
      risk: "high",
      whyItMatters:
        "One-way attorney-fee clauses discourage tenants from raising disputes.",
      questionsToAsk: [
        "Can this be changed to 'prevailing party' fees only?",
        "Is a loser-pays-even-if-they-win clause valid here?",
      ],
    },
  ],
  overallWatchouts: [
    "Several waivers (mitigation, jury trial, rent withholding, entry without notice) stack in the landlord's favor.",
    "Building rules can change after you sign by a lobby posting.",
    "Oral promises from staff are said to be worthless — get everything in writing.",
  ],
  missingProtections: [
    "No stated cap on daily late fees.",
    "No required notice before entry except landlord discretion.",
    "No repair timeline that a tenant can actually use.",
    "No interest or shorter statutory timeline called out for the deposit.",
  ],
  inconsistencies: [
    "Staff oral promises are said to be non-binding, but lobby-posted rule changes become part of the lease without your signature.",
    "Landlord promises to fix habitability issues in a 'commercially reasonable time' while also banning rent withholding if that time stretches.",
    "Early-exit language charges remaining rent even if the unit is re-rented, which sits uneasily next to a $1,500 'reletting' fee (you may be paying twice for the same vacancy).",
  ],
  optionsInTheText: [
    "Stay the full term and give 60 days' written notice if you do not want to renew.",
    "Stay past March 31, 2027 without a new lease (the paper then makes it month-to-month with an automatic 12% rent increase).",
    "Ask in writing to change entry, late fees, mitigation, and attorney-fee clauses before signing — the paper says oral staff promises do not count.",
    "If something already looks unlivable, the text still tells you to keep paying rent; a local tenants' lawyer or clinic is the place to ask what options exist outside this paper.",
  ],
  actionChecklist: [
    "Calendar the 60-day renewal-notice date (about January 30, 2027 if the term ends March 31).",
    "Calendar rent due on the 1st and the late-fee cliff on the 3rd.",
    "List the five clauses you most want changed before any signature.",
    "Save the listing, emails, and any repair photos — the lease says lobby rules and oral promises are a trap.",
    "Print the Walk-in brief and take it to a licensed lawyer or tenants' clinic where the unit is.",
  ],
};

export const DEMO_FREELANCE: DocumentAnalysis = {
  titleGuess: "Independent contractor agreement with Northwind Analytics",
  kindGuess: "freelance",
  oneSentence:
    "A freelance contract that pays slowly, takes a very wide swath of IP, restricts future clients, and sharply limits your ability to get paid or sue if something goes wrong.",
  plainSummary:
    "You would bill $85 an hour. They have 45 days to pay and can hold money back even after using the work. They can change the job without changing the rate. The paper tries to own not only the deliverables but ideas you have during the term, even unrelated ones, and it blocks similar work for their clients and prospects for 18 months across North America. If they end the deal on 7 days' notice, unaccepted work is unpaid. If someone sues, you may have to cover them — including for their own negligence — and your window to bring a claim is 60 days, in Delaware arbitration. Reading only; a lawyer would have to say what is enforceable where you work.",
  parties: ["Northwind Analytics Inc. (Company)", "Sam Rivera (Contractor)"],
  moneyTerms: [
    "$85/hour",
    "Net-45 invoices",
    "Company may withhold disputed amounts even after using the work",
    "Unaccepted work-in-progress is unpaid on termination",
    "Company liability capped at fees from the prior 30 days",
  ],
  datesAndDeadlines: [
    "Effective June 15, 2026",
    "Invoices due in 45 days",
    "7 days' notice to end for convenience",
    "18-month non-solicit after the work ends",
    "48 hours to return/destroy confidential materials",
    "Claims must be brought within 60 days",
  ],
  clauses: [
    {
      title: "Scope can change; rate stays the same",
      originalExcerpt:
        "Company may change scope at any time; Contractor will perform changed work at the same hourly rate unless Company agrees otherwise in writing.",
      plainLanguage:
        "They can add or change the work whenever they want. You still get the same hourly rate unless they agree in writing to pay more.",
      tags: ["you-must", "money"],
      risk: "watch",
      whyItMatters: "Scope creep without a change-order process is a common freelance loss.",
      questionsToAsk: [
        "Can we require a written statement of work for material changes?",
        "Is there a weekly hour cap unless pre-approved?",
      ],
    },
    {
      title: "They can use the work and still withhold pay",
      originalExcerpt:
        "Company may withhold payment if it disputes any portion of an invoice, including after work has been used in production.",
      plainLanguage:
        "If they argue about a bill, they can hold money back even if they already shipped your work to customers.",
      tags: ["money", "you-give-up"],
      risk: "high",
      whyItMatters: "Payment leverage sits entirely with the company after delivery.",
      questionsToAsk: [
        "Can undisputed amounts be paid on time?",
        "Can use in production count as acceptance?",
      ],
    },
    {
      title: "IP assignment is unusually wide",
      originalExcerpt:
        'All work product, including drafts, notes, methods, and "anything conceived during the term, whether or not related to the Services," is work made for hire and assigned to Company.',
      plainLanguage:
        "They are not only taking the deliverables. The text tries to take ideas and methods you think up during the contract period, even if unrelated to this job. You also cannot put the work in your portfolio unless they say yes.",
      tags: ["you-give-up", "privacy"],
      risk: "high",
      whyItMatters:
        "Overbroad IP grabs can collide with your other clients and your own tools.",
      questionsToAsk: [
        "Can assignment be limited to deliverables paid for under this agreement?",
        "Can I keep pre-existing tools and a portfolio license?",
      ],
    },
    {
      title: "18-month North America non-solicit",
      originalExcerpt:
        "For 18 months after the Agreement ends, Contractor will not provide similar services to any Company client or prospective client that Contractor learned of during the engagement, anywhere in North America.",
      plainLanguage:
        "For a year and a half after you finish, you may be blocked from working with people you met through this gig — even prospects — across North America.",
      tags: ["exit", "you-give-up"],
      risk: "high",
      whyItMatters: "This can shrink your pipeline after a single project.",
      questionsToAsk: [
        "Can this be limited to named clients you actually billed?",
        "Is 18 months and North America typical or enforceable for a contractor here?",
      ],
    },
    {
      title: "You indemnify them even for their negligence",
      originalExcerpt:
        "Contractor indemnifies Company for any claim arising from the Services, including Company's own negligence.",
      plainLanguage:
        "If someone sues over the work, you may have to cover the company — even if the problem was their mistake.",
      tags: ["dispute", "you-give-up"],
      risk: "high",
      whyItMatters: "Indemnity for the other side's negligence is a serious risk-shift.",
      questionsToAsk: [
        "Can indemnity exclude the company's negligence or misconduct?",
        "Does my insurance even cover this?",
      ],
    },
  ],
  overallWatchouts: [
    "Short claim window (60 days) plus arbitration in Delaware and a class-action waiver.",
    "Termination for convenience leaves unaccepted work unpaid.",
    "No warranty from you is stated as to the services, but heavy indemnity still sits on you.",
  ],
  missingProtections: [
    "No kill fee or minimum notice pay.",
    "No late-payment interest.",
    "No portfolio license.",
    "No cap on indemnity aligned with fees actually paid.",
  ],
  inconsistencies: [
    "Services are described as provided with no warranty, yet you still indemnify the company for claims arising from those same services, including their negligence.",
    "You are labeled an independent contractor, but scope can be changed unilaterally and IP includes 'anything conceived during the term,' which is closer to employee-style control of your time and ideas.",
    "They may use work in production while still treating the invoice as disputed and unpaid.",
  ],
  optionsInTheText: [
    "Keep working under the current statements of work until someone gives 7 days' notice.",
    "Ask in writing for a narrower IP clause, a named-client non-solicit, and pay-on-use for undisputed amounts — the paper currently requires their written agreement to change the rate.",
    "Track hours and keep copies; claims older than 60 days are written out of court in this text.",
    "Check whether your insurance would even cover the indemnity before you rely on it.",
  ],
  actionChecklist: [
    "List pre-existing tools and portfolio pieces you must keep.",
    "Note every client name you would be blocked from under the 18-month sentence.",
    "Write a one-page ask: net-30, pay undisputed amounts, IP limited to paid deliverables.",
    "Calendar the 60-day claim window and 48-hour return-of-materials duty.",
    "Take the Walk-in brief to a lawyer who handles contractor agreements in your location.",
  ],
};

export const DEMO_NDA: DocumentAnalysis = {
  titleGuess: "Mutual NDA for a possible product collaboration",
  kindGuess: "nda",
  oneSentence:
    "A two-way NDA that looks mutual but quietly lets Harbor keep memory residuals and any product feedback you give.",
  plainSummary:
    "Both sides may share information to explore a collaboration. Confidentiality is broader than stamped files — tours and 'sensitive-feeling' information count. Each side may later use leftover ideas kept in unaided memory (residuals) without paying. The NDA lasts two years; most secrets are covered for five years after disclosure. Feedback you give about Harbor products can be used by Harbor for free. There is no deal obligation and no IP license. Useful if you are only listening; tighter language is worth discussing if you are sharing a core idea.",
  parties: ["Harbor Labs Ltd.", "Priya Shah"],
  moneyTerms: ["No license or payment obligation; feedback may be used without compensation."],
  datesAndDeadlines: [
    "Dated January 8, 2026",
    "Agreement lasts 2 years",
    "Confidentiality lasts 5 years after disclosure (trade secrets longer)",
  ],
  clauses: [
    {
      title: "Confidentiality is broader than labeled documents",
      originalExcerpt:
        'Means all information disclosed, including information that is not marked confidential, information observed during facility visits, and "any information a reasonable person would consider sensitive."',
      plainLanguage:
        "It is not only stamped 'Confidential' files. Things you see on a tour or that 'feel sensitive' can also be covered.",
      tags: ["you-must", "privacy"],
      risk: "watch",
      whyItMatters: "Broad definitions make accidental breach easier.",
      questionsToAsk: [
        "Can we require marking, or a follow-up email within a few days for oral disclosures?",
      ],
    },
    {
      title: "Residuals clause",
      originalExcerpt:
        "Each party may use Residual Knowledge (general ideas, know-how, and skills retained in unaided memory) without restriction or duty to pay.",
      plainLanguage:
        "If someone remembers your ideas later without looking at notes, they may be allowed to use those leftover thoughts freely.",
      tags: ["you-give-up", "privacy"],
      risk: "high",
      whyItMatters:
        "Residuals clauses are often the hidden hole in an NDA if you are sharing a novel idea.",
      questionsToAsk: [
        "Can we delete residuals or exclude my core product idea?",
        "Should I share less until there is a tighter agreement?",
      ],
    },
    {
      title: "Your feedback becomes theirs",
      originalExcerpt:
        "Any feedback Priya provides about Harbor products may be used by Harbor freely, without compensation or attribution.",
      plainLanguage:
        "If you comment on Harbor's product, they can use those comments however they want and owe you nothing.",
      tags: ["you-give-up"],
      risk: "watch",
      whyItMatters: "Fine if you are only listening; costly if you are contributing design ideas.",
      questionsToAsk: ["Can feedback rights be mutual, or limited to Harbor's existing products?"],
    },
  ],
  overallWatchouts: [
    "Labeled 'mutual' but feedback only flows to Harbor by name.",
    "Injunctive relief without bond is easier for the disclosing party.",
  ],
  missingProtections: [
    "No residuals carve-out for Priya's pre-existing inventions.",
    "No explicit residual ban on using the other party's unique product architecture.",
  ],
  inconsistencies: [
    "The title says 'mutual,' but the feedback clause names only Priya's comments flowing to Harbor.",
    "Confidential Information is defined very broadly, then a residuals clause lets remembered ideas be used freely — those two sentences pull in opposite directions.",
  ],
  optionsInTheText: [
    "Share only what you are willing to see reused as 'residuals' or feedback.",
    "Ask to delete residuals, make feedback mutual, and require marking of confidential oral disclosures.",
    "Wait to share a core invention until a tighter agreement exists — this paper creates no duty to do a deal.",
  ],
  actionChecklist: [
    "Mark what you will not say until residuals are narrowed.",
    "Keep your own dated notes of what you disclosed.",
    "Ask a lawyer whether a residuals + feedback combo is acceptable for your idea.",
  ],
};

export const DEMO_COMPARE: ComparisonResult = {
  headline:
    "The lease is harsher on exit and daily life; the freelance agreement is harsher on IP, future work, and getting paid.",
  findings: [
    {
      topic: "Getting out early",
      docA: "Remaining rent for the full year plus $1,500, and a waiver of the landlord's duty to re-rent.",
      docB: "Either side can end with 7 days' notice, but unpaid/unaccepted work is simply not paid.",
      whoBenefits: "B",
      practicalDifference:
        "Leaving the apartment looks far more expensive than walking away from the freelance gig — but the freelance walk-away can still leave you unpaid for work already done.",
      risk: "high",
    },
    {
      topic: "Money timing",
      docA: "Rent due on the 1st with stacking late fees after the 3rd.",
      docB: "You invoice; they have 45 days and can withhold disputed amounts even after using the work.",
      whoBenefits: "unclear",
      practicalDifference:
        "The lease punishes you for paying late. The freelance contract lets the company pay late (or not) with little penalty.",
      risk: "high",
    },
    {
      topic: "What you give up",
      docA: "Jury-trial waiver, one-way attorney fees, entry without notice, no rent withholding.",
      docB: "Broad IP assignment, non-solicit, indemnity including their negligence, arbitration and class waiver.",
      whoBenefits: "unclear",
      practicalDifference:
        "Different rights are being signed away. Neither document is a 'light' signature.",
      risk: "high",
    },
  ],
  whatToNegotiate: [
    "Lease: notice before entry, cap late fees, restore duty to mitigate, two-way attorney fees.",
    "Freelance: limit IP to paid deliverables, shorten non-solicit, pay undisputed invoices, cap indemnity.",
  ],
  inconsistencies: [
    "These are different kinds of deals, so they should not be merged — but both ask you to give up dispute rights (jury vs class/arbitration) in one-sided ways.",
    "Lease late fees punish you for paying slowly; freelance terms let the company pay slowly with no interest — opposite money pressure on the individual.",
  ],
};

export const DEMO_BRIEFING: BriefingPack = {
  situationInPlainEnglish:
    "You are looking at a fictional one-year lease with aggressive late fees, broad entry, and expensive early-exit terms. The goal of a lawyer meeting is to learn what is actually enforceable where the unit is, and what to try to change before you sign.",
  goalsToClarify: [
    "Are you trying to negotiate this lease, or decide whether to walk away?",
    "What can you realistically pay if you must leave mid-year?",
    "Do you need quiet enjoyment / limited entry because you work from home?",
  ],
  questionsForALawyer: [
    {
      question: "Is the waiver of the landlord's duty to mitigate damages enforceable in this city/state?",
      why: "Section 7 tries to make you pay remaining rent even if the unit is re-rented.",
    },
    {
      question: "Are daily late fees plus a $75 flat fee capped or considered a penalty?",
      why: "Fees can compound and payments may be applied to fees first.",
    },
    {
      question: "Can a lease lawfully allow entry at any time with no notice?",
      why: "Section 4 is unusually broad.",
    },
    {
      question: "Does 'no withholding rent' override local habitability remedies?",
      why: "Section 5 may conflict with housing rules.",
    },
    {
      question: "Is a clause that makes the tenant pay the landlord's lawyers even if the tenant wins allowed?",
      why: "Section 8 fee-shifting is one-way and extreme.",
    },
    {
      question: "What deposit rules apply — timeline, itemization, interest, two-months' rent limits?",
      why: "Deposit is two months and return is 60 days with vague deductions.",
    },
    {
      question: "If I need to break the lease for a job move or safety issue, what options usually exist?",
      why: "Helps you plan beyond the four corners of this text.",
    },
    {
      question: "What written changes are worth requesting before signing?",
      why: "Staff oral promises are said to be non-binding.",
    },
  ],
  documentsToBring: [
    "The full lease and any addenda, house rules, or emails with promises",
    "Listing or advertisement you relied on",
    "Your move-in dates and other housing options",
    "Notes on repairs or conditions you already know about",
  ],
  redFlagsToMention: [
    "No mitigation of damages",
    "Entry without notice",
    "Attorney fees even if landlord loses",
    "Lobby-posted rule changes become part of the lease",
    "Repairs under $400 shifted to tenant, including landlord appliances",
  ],
  nextStepsYouCanTake: [
    "Do not sign until you understand the early-exit and entry clauses — this is information, not a command about your case.",
    "Write a one-page timeline: when you need housing, when this lease starts, and the 60-day renewal notice.",
    "List the 5 changes you care about most so a lawyer can prioritize.",
    "Save copies of the listing and all messages.",
    "Consult a licensed lawyer or tenants' clinic in the unit's location about enforceability. Second Chair cannot do that for you.",
  ],
};

export function demoAnalysisFor(id: string): DocumentAnalysis | null {
  if (id === SAMPLE_LEASE.id) return DEMO_LEASE;
  if (id === SAMPLE_FREELANCE.id) return DEMO_FREELANCE;
  if (id === SAMPLE_NDA.id) return DEMO_NDA;
  return null;
}
