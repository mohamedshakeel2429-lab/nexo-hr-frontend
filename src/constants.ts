import { Users, CreditCard, ShieldCheck, Briefcase } from 'lucide-react';

export const COMPANY_INFO = {
  name: 'NEXO HR Solutions',
  tagline: 'Where People & Workplaces Meet',
  experience: '10+ Years',
  phone: '7200721109',
  email: 'nexo.hrsolutions@gmail.com',
  location: 'Chennai, India',
};

export const SERVICES = [
  {
    id: 'recruitment',
    title: 'Recruitment',
    icon: Users,
    description: 'End-to-end talent acquisition strategy to find the perfect fit for your growth-stage company.',
    process: 'Sourcing → Screening → Selection',
    benefit: 'Reduce time-to-hire by 40%',
    featured: true,
    pillars: [
      { title: 'Talent Sourcing & Mapping', detail: 'Multi-channel sourcing via job boards, LinkedIn, employee referrals, and passive candidate outreach to build a qualified talent pipeline quickly.' },
      { title: 'Candidate Screening & Shortlisting', detail: 'Structured resume review, telephonic pre-screening, and skills-based shortlisting — only best-fit candidates reach your desk.' },
      { title: 'Interview Coordination', detail: 'End-to-end interview scheduling, panel briefings, and consolidated feedback collection to accelerate hiring decisions.' },
      { title: 'Offer & Negotiation Management', detail: 'Competitive offer roll-out with industry salary benchmarking, counteroffer handling, and acceptance tracking until day one.' },
      { title: 'Onboarding Support', detail: 'Day-one readiness: document verification, induction scheduling, and joining formalities managed seamlessly for every new hire.' },
    ],
  },
  {
    id: 'payroll',
    title: 'Payroll Management',
    icon: CreditCard,
    description: 'Accurate, timely, and secure payroll processing so you can focus on your business.',
    process: 'Disbursement → Tax Compliance → Reporting',
    benefit: 'Zero error tolerance',
    pillars: [
      { title: 'Salary Processing & Disbursement', detail: 'Accurate, on-time payroll runs with automated calculation of basic, HRA, allowances, and deductions for every employee.' },
      { title: 'TDS Deduction & Tax Compliance', detail: 'Monthly TDS computation under the latest tax slabs, Form 16 issuance, and year-end IT return support for your workforce.' },
      { title: 'PF, ESI & PT Administration', detail: 'Statutory contributions calculated, challan generated, and remitted on schedule — no penalties, no lapses, every month.' },
      { title: 'Payslip Generation & Distribution', detail: 'Professional digital payslips with complete earnings and deductions breakdowns, distributed securely to each employee.' },
      { title: 'Payroll Audit & Reconciliation', detail: 'Monthly reconciliation reports and audit-ready payroll registers that keep your finance team fully in control year-round.' },
    ],
  },
  {
    id: 'compliance',
    title: 'Statutory Compliance',
    icon: ShieldCheck,
    description: 'Stay ahead of legal requirements with our dedicated compliance advisory services.',
    process: 'Audits → Filings → Liaisoning',
    benefit: '100% legal safety net',
    pillars: [
      { title: 'Labour Law Advisory', detail: 'Expert guidance on PF, ESI, Minimum Wages Act, Shops & Establishments, and Factories Act obligations specific to your industry.' },
      { title: 'License & Registration Management', detail: 'End-to-end handling of registrations under all applicable labour statutes and timely renewals so you never lapse.' },
      { title: 'Statutory Returns Filing', detail: 'Accurate and on-time filing of all monthly, quarterly, and annual returns with relevant government authorities.' },
      { title: 'Contract Labour Compliance', detail: 'Principal employer and contractor compliance management, license maintenance, and audit readiness for your contract workforce.' },
      { title: 'Compliance Audit & Risk Assessment', detail: 'Proactive compliance health-checks with detailed gap analysis and a corrective action roadmap to eliminate legal risk.' },
    ],
  },
  {
    id: 'advisory',
    title: 'HR Advisory',
    icon: Briefcase,
    description: 'Expert guidance on organizational structure, policies, and employee engagement.',
    process: 'Assessment → Strategy → Implementation',
    benefit: 'Stronger workplace culture',
    pillars: [
      { title: 'Organizational Design & Structuring', detail: 'Role clarity mapping, reporting hierarchy design, and manpower planning aligned to your business growth trajectory.' },
      { title: 'HR Policy & Handbook Development', detail: 'Drafting and implementing comprehensive employee handbooks, leave policies, and HR SOPs tailored to your culture.' },
      { title: 'Performance Management Systems', detail: 'Goal-setting frameworks, KPI design, appraisal cycle structuring, and calibration processes that drive measurable output.' },
      { title: 'Employee Engagement Programs', detail: 'Pulse surveys, recognition programs, and data-driven retention strategies that reduce attrition and boost morale.' },
      { title: 'Workplace Dispute Resolution', detail: 'Structured HR mediation, disciplinary procedures, and exit management to protect your organization and your people.' },
    ],
  },
];

