import type { LegalDocument } from "./types";

export const SAMPLE_LEASE: LegalDocument = {
  id: "sample-lease",
  name: "Sample residential lease (fictional)",
  kind: "lease",
  source: "sample",
  text: `RESIDENTIAL LEASE AGREEMENT (FICTIONAL SAMPLE — NOT A REAL CONTRACT)

This Lease is made on March 1, 2026 between Maple Court LLC ("Landlord") and Jordan Hale ("Tenant") for Unit 4B at 18 Willow Street, Springfield.

1. TERM. The term begins April 1, 2026 and ends March 31, 2027. Tenant must give 60 days' written notice before the end of the term if Tenant does not wish to renew. If Tenant stays after the end date without a new written lease, tenancy becomes month-to-month and rent increases by 12% automatically.

2. RENT. Rent is $2,150 per month, due on the 1st. A late fee of $75 applies if rent is not received by the 3rd, plus $15 per day thereafter. Landlord may apply any payment first to late fees, then to rent.

3. SECURITY DEPOSIT. Tenant will pay $4,300 (two months' rent). Landlord may use the deposit for unpaid rent, cleaning beyond ordinary wear, and "any other amounts Landlord deems reasonably related to Tenant's occupancy." Landlord will return any remaining deposit within 60 days after Tenant vacates, without interest.

4. UTILITIES AND ACCESS. Tenant pays electricity, internet, and a $45 monthly "building amenities fee." Landlord may enter the unit at any time for inspections, showings, or repairs, with or without notice in Landlord's sole discretion.

5. REPAIRS. Tenant must keep the unit in good condition and is responsible for all repairs under $400, including appliances provided by Landlord. Landlord will address habitability issues "within a commercially reasonable time." Tenant may not withhold rent for repair delays.

6. GUESTS AND USE. No guests may stay more than 7 nights in any 30-day period. No pets. No home business, including remote client meetings that generate visitor traffic. Smoking of any kind is prohibited; violation is grounds for immediate termination.

7. EARLY TERMINATION. If Tenant breaks the lease, Tenant owes the remaining rent for the full term, plus a $1,500 reletting fee, even if Landlord re-rents the unit. Tenant waives any duty of Landlord to mitigate damages.

8. DEFAULT. If Tenant defaults, Landlord may terminate with 3 days' notice, lock out Tenant, and store belongings at Tenant's expense. Tenant waives jury trial and agrees that any dispute will be heard only in Springfield and that Tenant will pay Landlord's attorney's fees in any action, whether or not Landlord prevails.

9. RULES. Landlord may change building rules at any time by posting in the lobby. Changed rules become part of this Lease.

10. ENTIRE AGREEMENT. This document is the entire agreement. Tenant acknowledges they have read it and had an opportunity to consult counsel. Oral promises by property staff are not binding.
`,
};

export const SAMPLE_FREELANCE: LegalDocument = {
  id: "sample-freelance",
  name: "Sample freelance services agreement (fictional)",
  kind: "freelance",
  source: "sample",
  text: `INDEPENDENT CONTRACTOR AGREEMENT (FICTIONAL SAMPLE — NOT A REAL CONTRACT)

This Agreement is between Northwind Analytics Inc. ("Company") and Sam Rivera ("Contractor"), effective June 15, 2026.

1. SERVICES. Contractor will provide data visualization and dashboard work as described in statements of work. Company may change scope at any time; Contractor will perform changed work at the same hourly rate unless Company agrees otherwise in writing.

2. PAYMENT. Company will pay $85/hour. Invoices are due net 45. Company may withhold payment if it disputes any portion of an invoice, including after work has been used in production. No interest accrues on late payment.

3. INTELLECTUAL PROPERTY. All work product, including drafts, notes, methods, and "anything conceived during the term, whether or not related to the Services," is work made for hire and assigned to Company. Contractor waives moral rights. Contractor may not display the work in a portfolio without Company's prior written consent, which Company may withhold for any reason.

4. NON-SOLICIT. For 18 months after the Agreement ends, Contractor will not provide similar services to any Company client or prospective client that Contractor learned of during the engagement, anywhere in North America.

5. CONFIDENTIALITY. Confidential Information includes any non-public information and this Agreement's terms. Obligations last indefinitely. Contractor must return or destroy materials on request within 48 hours.

6. TERM AND TERMINATION. Either party may terminate for convenience with 7 days' notice. Upon termination, Company pays only for work it has accepted in writing. Work in progress that Company does not accept is unpaid. Sections 3, 4, 5, and 8 survive.

7. STATUS. Contractor is an independent contractor, not an employee, and is not entitled to benefits. Contractor must carry $1,000,000 liability insurance and name Company as additional insured.

8. LIABILITY. Contractor's services are provided with no warranty. Contractor indemnifies Company for any claim arising from the Services, including Company's own negligence. Company's total liability to Contractor is limited to fees paid in the prior 30 days. Contractor may not bring a claim more than 60 days after the event giving rise to it.

9. DISPUTE. Binding arbitration in Delaware, on an individual basis only. Contractor waives class actions and the right to go to court, except that Company may seek injunctive relief in any court.
`,
};

export const SAMPLE_NDA: LegalDocument = {
  id: "sample-nda",
  name: "Sample mutual NDA (fictional)",
  kind: "nda",
  source: "sample",
  text: `MUTUAL NON-DISCLOSURE AGREEMENT (FICTIONAL SAMPLE — NOT A REAL CONTRACT)

Between Harbor Labs Ltd. and Priya Shah, dated January 8, 2026.

1. Purpose. The parties may share information to explore a possible product collaboration.

2. Confidential Information. Means all information disclosed, including information that is not marked confidential, information observed during facility visits, and "any information a reasonable person would consider sensitive." Does not include information that is public, independently developed, or rightfully received from a third party.

3. Obligations. The receiving party will use Confidential Information only for the Purpose and will not disclose it except to employees and advisors who have a need to know. Standard of care is the same as for its own confidential information, but not less than reasonable care.

4. Residuals. Notwithstanding anything else, each party may use Residual Knowledge (general ideas, know-how, and skills retained in unaided memory) without restriction or duty to pay.

5. Term. This Agreement lasts 2 years. Confidentiality obligations last 5 years after disclosure, except that trade secrets remain protected for so long as they remain trade secrets.

6. Compelled disclosure. A party may disclose if required by law, after giving as much notice as practicable, unless legally prohibited.

7. No license. No IP license is granted. No obligation to proceed with a transaction.

8. Feedback. Any feedback Priya provides about Harbor products may be used by Harbor freely, without compensation or attribution.

9. Injunction. Breach may cause irreparable harm; the disclosing party is entitled to injunctive relief without bond.
`,
};

export const SAMPLES: LegalDocument[] = [
  SAMPLE_LEASE,
  SAMPLE_FREELANCE,
  SAMPLE_NDA,
];

export function excerpt(text: string, max = 14000) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[Document truncated for analysis length.]`;
}
