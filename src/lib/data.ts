export type OnboardingStatus =
  | "Onboarding"
  | "Active"
  | "Review Required"
  | "Awaiting Documents"
  | "Completed";

export type Client = {
  id: string;
  name: string;
  type: "Limited Company" | "Sole Trader" | "Partnership" | "LLP";
  status: OnboardingStatus;
  documents: number;
  tasks: number;
  lastActivity: string;
  aiStatus: "Idle" | "Processing" | "Flagged" | "Up to date";
  manager: string;
  email: string;
  phone: string;
  utr: string;
  yearEnd: string;
  progress: number;
  language: string;
};

export const clients: Client[] = [
  {
    id: "brightside-consulting",
    name: "Brightside Consulting Ltd",
    type: "Limited Company",
    status: "Onboarding",
    documents: 12,
    tasks: 4,
    lastActivity: "12 minutes ago",
    aiStatus: "Processing",
    manager: "Andrea Whitfield",
    email: "finance@brightsideconsulting.co.uk",
    phone: "+44 20 7946 0812",
    utr: "48291 30017",
    yearEnd: "31 March",
    progress: 72,
    language: "English",
  },
  {
    id: "abc-ltd",
    name: "ABC Ltd",
    type: "Limited Company",
    status: "Awaiting Documents",
    documents: 8,
    tasks: 3,
    lastActivity: "1 hour ago",
    aiStatus: "Flagged",
    manager: "Daniel Okoye",
    email: "accounts@abc-ltd.co.uk",
    phone: "+44 161 496 0233",
    utr: "10394 88210",
    yearEnd: "31 December",
    progress: 54,
    language: "English",
  },
  {
    id: "xyz-ltd",
    name: "XYZ Trading Ltd",
    type: "Limited Company",
    status: "Review Required",
    documents: 26,
    tasks: 6,
    lastActivity: "3 hours ago",
    aiStatus: "Flagged",
    manager: "Priya Raman",
    email: "hello@xyztrading.com",
    phone: "+44 121 405 8890",
    utr: "77341 20984",
    yearEnd: "30 June",
    progress: 100,
    language: "English",
  },
  {
    id: "marisol-catering",
    name: "Marisol Catering",
    type: "Sole Trader",
    status: "Onboarding",
    documents: 5,
    tasks: 2,
    lastActivity: "Yesterday",
    aiStatus: "Processing",
    manager: "Priya Raman",
    email: "marisol@marisolcatering.es",
    phone: "+34 911 23 45 67",
    utr: "Pending",
    yearEnd: "5 April",
    progress: 38,
    language: "Spanish",
  },
  {
    id: "northgate-partners",
    name: "Northgate Partners LLP",
    type: "LLP",
    status: "Active",
    documents: 41,
    tasks: 1,
    lastActivity: "2 days ago",
    aiStatus: "Up to date",
    manager: "Andrea Whitfield",
    email: "partners@northgate.co.uk",
    phone: "+44 20 3355 1188",
    utr: "22910 43781",
    yearEnd: "31 October",
    progress: 100,
    language: "English",
  },
  {
    id: "kaya-logistics",
    name: "Kaya Logistics Ltd",
    type: "Limited Company",
    status: "Active",
    documents: 33,
    tasks: 2,
    lastActivity: "2 days ago",
    aiStatus: "Up to date",
    manager: "Daniel Okoye",
    email: "ops@kayalogistics.co.uk",
    phone: "+44 113 887 2201",
    utr: "58120 99341",
    yearEnd: "31 January",
    progress: 100,
    language: "Hindi",
  },
  {
    id: "aurora-dental",
    name: "Aurora Dental Practice",
    type: "Partnership",
    status: "Completed",
    documents: 29,
    tasks: 0,
    lastActivity: "4 days ago",
    aiStatus: "Idle",
    manager: "Priya Raman",
    email: "admin@auroradental.co.uk",
    phone: "+44 29 2018 4477",
    utr: "31882 55012",
    yearEnd: "31 May",
    progress: 100,
    language: "English",
  },
  {
    id: "sahar-textiles",
    name: "Sahar Textiles Ltd",
    type: "Limited Company",
    status: "Awaiting Documents",
    documents: 14,
    tasks: 5,
    lastActivity: "5 days ago",
    aiStatus: "Flagged",
    manager: "Daniel Okoye",
    email: "finance@sahartextiles.ae",
    phone: "+971 4 355 1120",
    utr: "90112 34558",
    yearEnd: "31 December",
    progress: 61,
    language: "Arabic",
  },
];

export const kpis = [
  {
    label: "Active Clients",
    value: "1,284",
    trend: "+3.2%",
    up: true,
    support: "42 added this quarter",
    icon: "clients",
  },
  {
    label: "Pending Onboarding",
    value: "24",
    trend: "-6",
    up: true,
    support: "9 waiting on the client",
    icon: "onboarding",
  },
  {
    label: "Documents Awaiting Review",
    value: "38",
    trend: "+12",
    up: false,
    support: "AI pre-processed 31 of them",
    icon: "documents",
  },
  {
    label: "Tasks Requiring Attention",
    value: "17",
    trend: "-4",
    up: true,
    support: "5 overdue across 3 clients",
    icon: "tasks",
  },
  {
    label: "AI Completed",
    value: "126",
    trend: "+18%",
    up: true,
    support: "Background actions today",
    icon: "ai",
  },
] as const;

export const aiActivity = [
  {
    agent: "Document Agent",
    action: "Processed 18 client documents and extracted 612 transactions",
    time: "8 min ago",
    status: "Completed" as const,
    review: false,
  },
  {
    agent: "Communication Agent",
    action: "Prepared 7 email drafts for year-end account approvals",
    time: "26 min ago",
    status: "Awaiting approval" as const,
    review: true,
  },
  {
    agent: "Document Agent",
    action: "Detected 4 missing documents across 3 onboarding clients",
    time: "48 min ago",
    status: "Needs review" as const,
    review: true,
  },
  {
    agent: "Document Agent",
    action: "Categorised 32 uploaded files into tax, bank and identity",
    time: "1 hr ago",
    status: "Completed" as const,
    review: false,
  },
  {
    agent: "Client Onboarding Agent",
    action: "Prepared multilingual onboarding instructions for 5 clients",
    time: "2 hrs ago",
    status: "Completed" as const,
    review: false,
  },
  {
    agent: "Accountancy Agent",
    action: "Flagged 3 ledger items for human review",
    time: "3 hrs ago",
    status: "Needs review" as const,
    review: true,
  },
];

export type Priority = "High" | "Medium" | "Low";

export const attention = [
  {
    id: "a1",
    kind: "Client document missing",
    title: "ABC Ltd is missing its bank statement",
    detail: "October 2025 statement was not included in the last upload batch.",
    priority: "High" as Priority,
    actions: ["Review"],
    client: "ABC Ltd",
  },
  {
    id: "a2",
    kind: "AI recommendation",
    title: "Unusual transaction detected for XYZ Trading Ltd",
    detail: "£18,400 payment to a new supplier falls outside normal patterns.",
    priority: "High" as Priority,
    actions: ["Review"],
    client: "XYZ Trading Ltd",
  },
  {
    id: "a3",
    kind: "Approval required",
    title: "Email prepared by AI for John Smith",
    detail: "Draft covering the 2025 annual accounts and filing deadline.",
    priority: "Medium" as Priority,
    actions: ["Approve", "Edit"],
    client: "Northgate Partners LLP",
  },
  {
    id: "a4",
    kind: "Onboarding exception",
    title: "Marisol Catering onboarding is incomplete",
    detail: "Client stalled at identity verification for 4 days.",
    priority: "Medium" as Priority,
    actions: ["View Client"],
    client: "Marisol Catering",
  },
  {
    id: "a5",
    kind: "AI recommendation",
    title: "VAT registration threshold approaching",
    detail: "Kaya Logistics Ltd is at 91% of the rolling 12-month threshold.",
    priority: "Low" as Priority,
    actions: ["Review"],
    client: "Kaya Logistics Ltd",
  },
  {
    id: "a6",
    kind: "Payroll discrepancy",
    title: "Aurora Dental Practice payroll variance detected",
    detail: "Monthly pension contribution offset differs by £480.",
    priority: "High" as Priority,
    actions: ["Review"],
    client: "Aurora Dental Practice",
  },
  {
    id: "a7",
    kind: "Tax filing deadline",
    title: "Brightside Consulting year-end audit due",
    detail: "Final statutory accounts require sign-off before Friday.",
    priority: "High" as Priority,
    actions: ["Approve"],
    client: "Brightside Consulting Ltd",
  },
  {
    id: "a8",
    kind: "Document verification",
    title: "Sahar Textiles multi-currency receipts uploaded",
    detail: "AI pre-processed 14 Arabic/English invoice receipts.",
    priority: "Medium" as Priority,
    actions: ["Verify"],
    client: "Sahar Textiles Ltd",
  },
  {
    id: "a9",
    kind: "Bank reconciliation",
    title: "Zenith Software unallocated £4,200 entry",
    detail: "Unmatched inbound transfer requires client category confirmation.",
    priority: "Medium" as Priority,
    actions: ["Review"],
    client: "Zenith Software Ltd",
  },
  {
    id: "a10",
    kind: "Compliance alert",
    title: "Apex Holdings confirmation statement due",
    detail: "Companies House annual confirmation statement due in 3 days.",
    priority: "Low" as Priority,
    actions: ["Review"],
    client: "Apex Holdings Ltd",
  },
];

export const CLIENT_DOCUMENT_TYPES = [
  "ANNUAL ACCOUNTS",
  "BANK STATEMENTS",
  "CONFIRMATION STATEMENTS",
  "CONTRACTS",
  "ID & AML & RISK ASSESSMENT",
  "LEXAROX INVOICES",
  "OTHER DOCUMENTS",
  "PAYE",
] as const;

export type ClientDocumentType = (typeof CLIENT_DOCUMENT_TYPES)[number];

export type ClientDetailDoc = {
  id: string;
  name: string;
  client: string;
  type: ClientDocumentType;
  uploaded: string;
  ai: "Processing" | "Processed" | "Needs Review" | "Verified";
  verified: "Verified" | "Unverified" | "Rejected";
  size: string;
};

const clientDocTypeToCategory: Record<ClientDocumentType, DocCategory> = {
  "ANNUAL ACCOUNTS": "Company Documents",
  "BANK STATEMENTS": "Bank Statements",
  "CONFIRMATION STATEMENTS": "Company Documents",
  CONTRACTS: "Contracts",
  "ID & AML & RISK ASSESSMENT": "Identity",
  "LEXAROX INVOICES": "Other",
  "OTHER DOCUMENTS": "Other",
  PAYE: "Tax Documents",
};

export function clientDetailDocToDocItem(doc: ClientDetailDoc): DocItem {
  return {
    id: doc.id,
    name: doc.name,
    client: doc.client,
    category: clientDocTypeToCategory[doc.type],
    uploaded: doc.uploaded,
    uploadedBy: "Client portal",
    ai: doc.ai,
    verified: doc.verified,
    size: doc.size,
    accessPermissions: "Assigned staff",
  };
}

export const clientDetailDocuments: ClientDetailDoc[] = [
  {
    id: "cdoc-1",
    name: "Draft_Annual_Accounts_FY25.pdf",
    client: "Brightside Consulting Ltd",
    type: "ANNUAL ACCOUNTS",
    uploaded: "10 Aug 2026",
    ai: "Processed",
    verified: "Unverified",
    size: "2.4 MB",
  },
  {
    id: "cdoc-2",
    name: "Barclays_Business_Statement_Sep25.pdf",
    client: "Brightside Consulting Ltd",
    type: "BANK STATEMENTS",
    uploaded: "9 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "1.6 MB",
  },
  {
    id: "cdoc-3",
    name: "Barclays_Business_Statement_Aug25.pdf",
    client: "Brightside Consulting Ltd",
    type: "BANK STATEMENTS",
    uploaded: "9 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "1.5 MB",
  },
  {
    id: "cdoc-4",
    name: "Confirmation_Statement_CS01_2026.pdf",
    client: "Brightside Consulting Ltd",
    type: "CONFIRMATION STATEMENTS",
    uploaded: "8 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "204 KB",
  },
  {
    id: "cdoc-5",
    name: "Engagement_Letter_2026.pdf",
    client: "Brightside Consulting Ltd",
    type: "CONTRACTS",
    uploaded: "6 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "890 KB",
  },
  {
    id: "cdoc-6",
    name: "Director_Passport_JSmith.jpg",
    client: "Brightside Consulting Ltd",
    type: "ID & AML & RISK ASSESSMENT",
    uploaded: "12 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "740 KB",
  },
  {
    id: "cdoc-7",
    name: "AML_Risk_Assessment_Brightside.pdf",
    client: "Brightside Consulting Ltd",
    type: "ID & AML & RISK ASSESSMENT",
    uploaded: "12 Aug 2026",
    ai: "Processed",
    verified: "Verified",
    size: "420 KB",
  },
  {
    id: "cdoc-8",
    name: "LexaRox_Invoice_INV-2026-084.pdf",
    client: "Brightside Consulting Ltd",
    type: "LEXAROX INVOICES",
    uploaded: "1 Aug 2026",
    ai: "Verified",
    verified: "Verified",
    size: "128 KB",
  },
  {
    id: "cdoc-9",
    name: "Utility_Bill_Proof_of_Address.pdf",
    client: "Brightside Consulting Ltd",
    type: "OTHER DOCUMENTS",
    uploaded: "7 Aug 2026",
    ai: "Processed",
    verified: "Verified",
    size: "310 KB",
  },
  {
    id: "cdoc-10",
    name: "PAYE_Summary_Aug2026.xlsx",
    client: "Brightside Consulting Ltd",
    type: "PAYE",
    uploaded: "5 Aug 2026",
    ai: "Needs Review",
    verified: "Unverified",
    size: "116 KB",
  },
  {
    id: "cdoc-11",
    name: "Draft_Annual_Accounts_FY24.pdf",
    client: "ABC Ltd",
    type: "ANNUAL ACCOUNTS",
    uploaded: "11 Aug 2026",
    ai: "Processed",
    verified: "Verified",
    size: "2.1 MB",
  },
  {
    id: "cdoc-12",
    name: "Barclays_Business_Statement_Oct25.pdf",
    client: "ABC Ltd",
    type: "BANK STATEMENTS",
    uploaded: "12 Aug 2026",
    ai: "Needs Review",
    verified: "Unverified",
    size: "1.8 MB",
  },
];

export type ClientService = {
  id: string;
  client: string;
  name: string;
  status: "Active" | "Pending" | "Not subscribed" | "Suspended";
  billing: string;
  nextDue: string;
  manager: string;
};

export const clientServices: ClientService[] = [
  {
    id: "svc-1",
    client: "Brightside Consulting Ltd",
    name: "Annual Accounts & Corporation Tax",
    status: "Active",
    billing: "£1,850 / year",
    nextDue: "31 Jan 2027",
    manager: "Andrea Whitfield",
  },
  {
    id: "svc-2",
    client: "Brightside Consulting Ltd",
    name: "VAT Returns",
    status: "Active",
    billing: "£95 / quarter",
    nextDue: "7 Nov 2026",
    manager: "Priya Raman",
  },
  {
    id: "svc-3",
    client: "Brightside Consulting Ltd",
    name: "Confirmation Statement",
    status: "Active",
    billing: "£45 / filing",
    nextDue: "14 Mar 2027",
    manager: "Andrea Whitfield",
  },
  {
    id: "svc-4",
    client: "Brightside Consulting Ltd",
    name: "Payroll (PAYE)",
    status: "Pending",
    billing: "£65 / month",
    nextDue: "Setup in progress",
    manager: "Daniel Okoye",
  },
  {
    id: "svc-5",
    client: "Brightside Consulting Ltd",
    name: "Bookkeeping",
    status: "Not subscribed",
    billing: "—",
    nextDue: "—",
    manager: "—",
  },
  {
    id: "svc-6",
    client: "Brightside Consulting Ltd",
    name: "Self Assessment (Director)",
    status: "Active",
    billing: "£320 / return",
    nextDue: "31 Jan 2027",
    manager: "Tomas Alvarez",
  },
];

export type AmlStatus =
  | "Pending"
  | "In Progress"
  | "Under Review"
  | "Completed"
  | "Follow-up Required"
  | "Review Due";

export type ClientAmlRecord = {
  id: string;
  client: string;
  clientId: string;
  status: AmlStatus;
  cddStatus: "Complete" | "In progress" | "Not started" | "Review required";
  riskRating: "Low" | "Medium" | "High";
  idVerification: string;
  amlAssessment: string;
  pepSanctions: string;
  lastReview: string;
  nextReviewDue: string;
  owner: string;
  notes: string;
};

export const clientAmlRecords: ClientAmlRecord[] = [
  {
    id: "aml-1",
    client: "Brightside Consulting Ltd",
    clientId: "brightside-consulting",
    status: "In Progress",
    cddStatus: "In progress",
    riskRating: "Low",
    idVerification: "Director ID verified · 12 Aug 2026",
    amlAssessment: "Risk assessment completed · Low risk profile",
    pepSanctions: "PEP & sanctions screening clear",
    lastReview: "12 Aug 2026",
    nextReviewDue: "12 Aug 2027",
    owner: "Andrea Whitfield",
    notes: "October 2025 bank statement outstanding — address verification pending for one director.",
  },
  {
    id: "aml-2",
    client: "ABC Ltd",
    clientId: "abc-ltd",
    status: "Review Due",
    cddStatus: "Review required",
    riskRating: "Medium",
    idVerification: "Director ID verified · 3 Jun 2026",
    amlAssessment: "Risk assessment due for refresh",
    pepSanctions: "PEP & sanctions screening clear",
    lastReview: "3 Jun 2025",
    nextReviewDue: "3 Jun 2026",
    owner: "Daniel Okoye",
    notes: "Annual AML review overdue by 2 months.",
  },
  {
    id: "aml-3",
    client: "XYZ Trading Ltd",
    clientId: "xyz-ltd",
    status: "Under Review",
    cddStatus: "Review required",
    riskRating: "Medium",
    idVerification: "Director ID verified · 1 Jul 2026",
    amlAssessment: "Enhanced due diligence in progress",
    pepSanctions: "PEP screening flagged — manual review",
    lastReview: "1 Jul 2026",
    nextReviewDue: "1 Jul 2027",
    owner: "Priya Raman",
    notes: "Unusual supplier payments flagged — enhanced CDD required.",
  },
  {
    id: "aml-4",
    client: "Northgate Partners LLP",
    clientId: "northgate-partners",
    status: "Completed",
    cddStatus: "Complete",
    riskRating: "Low",
    idVerification: "All partners verified · 15 Jan 2026",
    amlAssessment: "Risk assessment completed · Low risk",
    pepSanctions: "PEP & sanctions screening clear",
    lastReview: "15 Jan 2026",
    nextReviewDue: "15 Jan 2027",
    owner: "Andrea Whitfield",
    notes: "All AML checks complete. Next periodic review scheduled.",
  },
  {
    id: "aml-5",
    client: "Marisol Catering",
    clientId: "marisol-catering",
    status: "Pending",
    cddStatus: "Not started",
    riskRating: "Low",
    idVerification: "Not yet verified",
    amlAssessment: "Not yet completed",
    pepSanctions: "Not yet screened",
    lastReview: "—",
    nextReviewDue: "—",
    owner: "Grace Mbeki",
    notes: "AML checks pending — awaiting identity documents from client.",
  },
  {
    id: "aml-6",
    client: "Sahar Textiles Ltd",
    clientId: "sahar-textiles",
    status: "Follow-up Required",
    cddStatus: "In progress",
    riskRating: "High",
    idVerification: "Director ID verified · 20 Jul 2026",
    amlAssessment: "High-risk jurisdiction — enhanced monitoring",
    pepSanctions: "Sanctions screening clear · ongoing monitoring",
    lastReview: "20 Jul 2026",
    nextReviewDue: "20 Oct 2026",
    owner: "Daniel Okoye",
    notes: "Source of funds documentation requested — follow-up sent 28 Aug.",
  },
];

export type DocCategory =
  | "Identity"
  | "Bank Statements"
  | "Tax Documents"
  | "Company Documents"
  | "Contracts"
  | "Other";

export type DocItem = {
  id: string;
  name: string;
  client: string;
  category: DocCategory;
  uploaded: string;
  uploadedBy: string;
  ai: "Processing" | "Processed" | "Needs Review" | "Verified";
  verified: "Verified" | "Unverified" | "Rejected";
  size: string;
  accessPermissions: "Account manager only" | "Assigned staff" | "All staff" | "Admin only";
};

export const documents: DocItem[] = [
  {
    id: "doc-1",
    name: "Barclays_Business_Statement_Oct25.pdf",
    client: "ABC Ltd",
    category: "Bank Statements",
    uploaded: "12 Aug 2026",
    uploadedBy: "Client portal",
    ai: "Needs Review",
    verified: "Unverified",
    size: "1.8 MB",
    accessPermissions: "Assigned staff",
  },
  {
    id: "doc-2",
    name: "Director_Passport_JSmith.jpg",
    client: "Brightside Consulting Ltd",
    category: "Identity",
    uploaded: "12 Aug 2026",
    uploadedBy: "Grace Mbeki",
    ai: "Verified",
    verified: "Verified",
    size: "740 KB",
    accessPermissions: "Account manager only",
  },
  {
    id: "doc-3",
    name: "VAT_Return_Q2_2026.pdf",
    client: "XYZ Trading Ltd",
    category: "Tax Documents",
    uploaded: "11 Aug 2026",
    uploadedBy: "Priya Raman",
    ai: "Processed",
    verified: "Unverified",
    size: "320 KB",
    accessPermissions: "Assigned staff",
  },
  {
    id: "doc-4",
    name: "Certificate_of_Incorporation.pdf",
    client: "Marisol Catering",
    category: "Company Documents",
    uploaded: "11 Aug 2026",
    uploadedBy: "Client portal",
    ai: "Processing",
    verified: "Unverified",
    size: "512 KB",
    accessPermissions: "Assigned staff",
  },
  {
    id: "doc-5",
    name: "Supplier_Agreement_Northvale.pdf",
    client: "Northgate Partners LLP",
    category: "Contracts",
    uploaded: "10 Aug 2026",
    uploadedBy: "Daniel Okoye",
    ai: "Processed",
    verified: "Verified",
    size: "980 KB",
    accessPermissions: "All staff",
  },
  {
    id: "doc-6",
    name: "Payroll_Summary_July.xlsx",
    client: "Kaya Logistics Ltd",
    category: "Other",
    uploaded: "9 Aug 2026",
    uploadedBy: "Tomas Alvarez",
    ai: "Verified",
    verified: "Verified",
    size: "116 KB",
    accessPermissions: "Assigned staff",
  },
  {
    id: "doc-7",
    name: "HSBC_Statement_Sept25.pdf",
    client: "Sahar Textiles Ltd",
    category: "Bank Statements",
    uploaded: "8 Aug 2026",
    uploadedBy: "Client portal",
    ai: "Needs Review",
    verified: "Unverified",
    size: "2.1 MB",
    accessPermissions: "Account manager only",
  },
  {
    id: "doc-8",
    name: "Confirmation_Statement_CS01.pdf",
    client: "Aurora Dental Practice",
    category: "Company Documents",
    uploaded: "7 Aug 2026",
    uploadedBy: "Priya Raman",
    ai: "Verified",
    verified: "Verified",
    size: "204 KB",
    accessPermissions: "All staff",
  },
];

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";

export const taskBreakdownTemplates = [
  "N/A",
  "VAT return review checklist",
  "Year-end accounts preparation",
  "Client onboarding checklist",
  "AML document collection",
] as const;

export type Task = {
  id: string;
  name: string;
  client: string;
  assignee: string;
  monitorAssignee?: string;
  priority: Priority;
  due: string;
  source: "AI" | "Manual" | "Workflow";
  status: TaskStatus;
  view: "My Tasks" | "Team Tasks" | "AI Tasks";
  overdue?: boolean;
  quote?: string;
  timeEstimateHours?: number;
  progressNotes?: string;
  breakdown?: string;
  description?: string;
  notifyAssignee?: boolean;
  comments?: { author: string; text: string; date: string }[];
  notes?: string;
  attachments?: { name: string; size: string }[];
};

export const tasks: Task[] = [
  {
    id: "t1",
    name: "AI detected missing VAT documentation",
    client: "Brightside Consulting Ltd",
    assignee: "Andrea Whitfield",
    priority: "High",
    due: "Today",
    source: "AI",
    status: "To Do",
    view: "AI Tasks",
    comments: [{ author: "Document Agent", text: "VAT return Q2 missing from client vault.", date: "Today" }],
  },
  {
    id: "t2",
    name: "Review unusual supplier payment",
    client: "XYZ Trading Ltd",
    assignee: "Priya Raman",
    monitorAssignee: "N/A",
    priority: "High",
    due: "2026-08-19",
    source: "AI",
    status: "In Progress",
    view: "My Tasks",
    quote: "450",
    timeEstimateHours: 1,
    progressNotes: "Awaiting client confirmation on supplier legitimacy before sign-off.",
    breakdown: "Verify supplier registration\nReview payment trail\nDocument partner approval",
    description: "Review flagged supplier payment of £18,400 to Northvale Supplies and confirm supporting documentation.",
    notifyAssignee: true,
    notes: "£18,400 payment to Northvale Supplies — first-time supplier flagged by AI.",
  },
  {
    id: "t3",
    name: "Chase October bank statement",
    client: "ABC Ltd",
    assignee: "Daniel Okoye",
    priority: "Medium",
    due: "14 Aug",
    source: "Workflow",
    status: "To Do",
    view: "Team Tasks",
  },
  {
    id: "t4",
    name: "Complete identity verification",
    client: "Marisol Catering",
    assignee: "Priya Raman",
    priority: "Medium",
    due: "10 Aug",
    source: "AI",
    status: "To Do",
    view: "Team Tasks",
    overdue: true,
  },
  {
    id: "t5",
    name: "Approve AI-prepared year-end email",
    client: "Northgate Partners LLP",
    assignee: "Andrea Whitfield",
    priority: "Low",
    due: "16 Aug",
    source: "AI",
    status: "Review",
    view: "My Tasks",
    attachments: [{ name: "Year_end_draft_email.txt", size: "2 KB" }],
  },
  {
    id: "t6",
    name: "File confirmation statement",
    client: "Aurora Dental Practice",
    assignee: "Priya Raman",
    priority: "Low",
    due: "2 Aug",
    source: "Manual",
    status: "Completed",
    view: "Team Tasks",
  },
  {
    id: "t7",
    name: "Reconcile Q2 payroll journals",
    client: "Kaya Logistics Ltd",
    assignee: "Daniel Okoye",
    priority: "Medium",
    due: "18 Aug",
    source: "Manual",
    status: "In Progress",
    view: "Team Tasks",
  },
  {
    id: "t8",
    name: "Request Arabic onboarding walkthrough",
    client: "Sahar Textiles Ltd",
    assignee: "Priya Raman",
    priority: "High",
    due: "9 Aug",
    source: "AI",
    status: "To Do",
    view: "AI Tasks",
    overdue: true,
  },
];

export const agents = [
  {
    id: "document",
    name: "Document Agent",
    description: "Processes, categorises and analyses client documents.",
    status: "Active" as const,
    completed: "126 documents processed today",
    current: "Extracting transactions from HSBC statement",
    lastRun: "2 min ago",
  },
  {
    id: "onboarding",
    name: "Client Onboarding Agent",
    description: "Guides clients through onboarding in their own language.",
    status: "Active" as const,
    completed: "14 onboarding journeys assisted",
    current: "Explaining ID requirements to Marisol Catering",
    lastRun: "9 min ago",
  },
  {
    id: "communication",
    name: "Communication Agent",
    description: "Prepares emails and client communications for approval.",
    status: "Awaiting approval" as const,
    completed: "7 drafts prepared today",
    current: "Holding 7 drafts for human approval",
    lastRun: "26 min ago",
  },
  {
    id: "accountancy",
    name: "Accountancy Agent",
    description: "Supports ledger, VAT and year-end workflows.",
    status: "Active" as const,
    completed: "3 ledgers reconciled",
    current: "Checking VAT thresholds across 42 clients",
    lastRun: "34 min ago",
  },
  {
    id: "task",
    name: "Task Agent",
    description: "Creates, routes and prioritises work across the team.",
    status: "Active" as const,
    completed: "21 tasks created and routed",
    current: "Re-prioritising the overdue queue",
    lastRun: "1 hr ago",
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    description: "Supports campaigns, newsletters and client nurture.",
    status: "Paused" as const,
    completed: "0 actions today",
    current: "Paused pending content approval",
    lastRun: "Yesterday",
  },
];

export const reviewQueue = [
  {
    id: "r1",
    did: "Prepared a year-end accounts email for John Smith",
    why: "Outbound client communication always requires human approval.",
    recommendation: "Send as drafted — figures match the filed accounts.",
    confidence: 94,
    client: "Northgate Partners LLP",
    agent: "Communication Agent",
    action: "Approve & send",
  },
  {
    id: "r2",
    did: "Flagged an £18,400 payment to Northvale Supplies",
    why: "First payment to this supplier and 6x the typical value.",
    recommendation: "Confirm with the client before categorising as cost of sales.",
    confidence: 71,
    client: "XYZ Trading Ltd",
    agent: "Accountancy Agent",
    action: "Confirm with client",
  },
  {
    id: "r3",
    did: "Identified a missing month in the bank statement series",
    why: "October 2025 is absent between September and November.",
    recommendation: "Request the October statement from the client.",
    confidence: 98,
    client: "ABC Ltd",
    agent: "Document Agent",
    action: "Request document",
  },
  {
    id: "r4",
    did: "Categorised 32 uploaded files",
    why: "4 files scored below the auto-approval confidence threshold.",
    recommendation: "Accept 28 categorisations, review the remaining 4.",
    confidence: 82,
    client: "Multiple clients",
    agent: "Document Agent",
    action: "Review 4 files",
  },
  {
    id: "r5",
    did: "Drafted Spanish onboarding instructions",
    why: "Client-facing multilingual content is reviewed before sending.",
    recommendation: "Approve — terminology checked against the UK glossary.",
    confidence: 89,
    client: "Marisol Catering",
    agent: "Client Onboarding Agent",
    action: "Approve",
  },
];

export const surveyInsights = {
  firms: 148,
  responses: 1032,
  painPoints: [
    { label: "Chasing client documents", value: 82 },
    { label: "Manual data entry", value: 74 },
    { label: "Onboarding admin", value: 63 },
    { label: "Client communication volume", value: 57 },
    { label: "Compliance deadlines", value: 41 },
  ],
  adoption: [
    { label: "Using AI daily", value: 18 },
    { label: "Piloting AI", value: 31 },
    { label: "Evaluating", value: 27 },
    { label: "No plans", value: 24 },
  ],
  requested: [
    "Automatic document chasing",
    "AI bank statement processing",
    "Multilingual client onboarding",
    "Draft email preparation",
    "Exception-only review queues",
  ],
};

export const teamMembers = [
  { name: "Andrea Whitfield", role: "Admin", clients: 42, workload: 78, email: "andrea@lexarox.com", permission: "Full access" },
  { name: "Daniel Okoye", role: "Manager", clients: 51, workload: 64, email: "daniel@lexarox.com", permission: "Manager access" },
  { name: "Priya Raman", role: "Accountancy Staff", clients: 37, workload: 91, email: "priya@lexarox.com", permission: "Standard access" },
  { name: "Tomas Alvarez", role: "Accountancy Staff", clients: 29, workload: 45, email: "tomas@lexarox.com", permission: "Standard access" },
  { name: "Grace Mbeki", role: "Onboarding Specialist", clients: 18, workload: 52, email: "grace@lexarox.com", permission: "Onboarding access" },
];

export const languages = ["English", "Spanish", "French", "Hindi", "Arabic", "German"];

// Dashboard Chart Metrics (Lexarox Accounts CRM & Operations)
export const revenueLeadGrowth = [
  { month: "Jan", revenue: 42500, leads: 34, onboarding: 12, completed: 18 },
  { month: "Feb", revenue: 48900, leads: 42, onboarding: 16, completed: 22 },
  { month: "Mar", revenue: 54200, leads: 50, onboarding: 19, completed: 27 },
  { month: "Apr", revenue: 51800, leads: 48, onboarding: 15, completed: 24 },
  { month: "May", revenue: 63100, leads: 62, onboarding: 24, completed: 35 },
  { month: "Jun", revenue: 68400, leads: 70, onboarding: 28, completed: 39 },
  { month: "Jul", revenue: 74900, leads: 84, onboarding: 32, completed: 46 },
  { month: "Aug", revenue: 81500, leads: 92, onboarding: 38, completed: 52 },
];

export const portfolioStatusDistribution = [
  { name: "Active Accounts", value: 62, color: "#3cadf1" },
  { name: "Onboarding", value: 22, color: "#50b546" },
  { name: "Awaiting Docs", value: 16, color: "#e2008e" },
  { name: "Review Required", value: 10, color: "#a855f7" },
  { name: "Completed", value: 38, color: "#10b981" },
];

export const leadConversionVelocity = [
  { stage: "Leads Inflow", count: 120, conversion: "100%" },
  { stage: "Doc Chased", count: 94, conversion: "78%" },
  { stage: "AI Verified", count: 82, conversion: "68%" },
  { stage: "Review Approved", count: 72, conversion: "60%" },
  { stage: "Fully Active", count: 62, conversion: "51%" },
];

export const aiAutomationMetrics = [
  { name: "Automated (98.4%)", value: 126, color: "#3cadf1" },
  { name: "Requires Human Review", value: 18, color: "#50b546" },
  { name: "Flagged Anomalies", value: 4, color: "#e2008e" },
];

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Accountancy Staff" | "Onboarding Specialist";
  status: "Active" | "Pending onboarding" | "Suspended";
  department: string;
  lastLogin: string;
  onboarded: string;
  assignedClients: number;
};

export const staffAccessModules = [
  "Clients",
  "AML / Compliance",
  "Documents",
  "Tasks",
  "Services",
  "Proposals",
  "Reports",
  "Settings",
] as const;

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "manage"
  | "upload"
  | "download";

export type PermissionModule = {
  id: string;
  label: string;
  permissions: { id: PermissionAction; label: string }[];
};

export const permissionModules: PermissionModule[] = [
  {
    id: "clients",
    label: "Clients",
    permissions: [
      { id: "view", label: "View" },
      { id: "create", label: "Create" },
      { id: "edit", label: "Edit" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "aml",
    label: "AML",
    permissions: [
      { id: "view", label: "View" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "services",
    label: "Services",
    permissions: [
      { id: "view", label: "View" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "proposals",
    label: "Proposals",
    permissions: [
      { id: "view", label: "View" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "tasks",
    label: "Tasks",
    permissions: [
      { id: "view", label: "View" },
      { id: "create", label: "Create" },
      { id: "edit", label: "Edit" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    permissions: [
      { id: "view", label: "View" },
      { id: "upload", label: "Upload" },
      { id: "download", label: "Download" },
      { id: "manage", label: "Manage" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    permissions: [{ id: "view", label: "View" }],
  },
];

export type FirmRole = {
  id: string;
  name: string;
  description: string;
  grants: Record<string, PermissionAction[]>;
};

export const firmRoles: FirmRole[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full firm access including staff, billing and system settings",
    grants: {
      clients: ["view", "create", "edit", "manage"],
      aml: ["view", "manage"],
      services: ["view", "manage"],
      proposals: ["view", "manage"],
      tasks: ["view", "create", "edit", "manage"],
      documents: ["view", "upload", "download", "manage"],
      reports: ["view"],
    },
  },
  {
    id: "manager",
    name: "Manager",
    description: "Team oversight, approvals, reporting and exception handling",
    grants: {
      clients: ["view", "create", "edit", "manage"],
      aml: ["view", "manage"],
      services: ["view", "manage"],
      proposals: ["view", "manage"],
      tasks: ["view", "create", "edit", "manage"],
      documents: ["view", "upload", "download", "manage"],
      reports: ["view"],
    },
  },
  {
    id: "accountancy-staff",
    name: "Accountancy Staff",
    description: "Assigned clients, documents, tasks and client communications",
    grants: {
      clients: ["view", "edit"],
      aml: ["view"],
      services: ["view"],
      proposals: ["view"],
      tasks: ["view", "create", "edit"],
      documents: ["view", "upload", "download"],
      reports: ["view"],
    },
  },
  {
    id: "onboarding-specialist",
    name: "Onboarding Specialist",
    description: "Client onboarding, verification and document collection",
    grants: {
      clients: ["view", "create", "edit"],
      aml: ["view", "manage"],
      services: ["view"],
      proposals: ["view"],
      tasks: ["view", "create", "edit"],
      documents: ["view", "upload", "download"],
      reports: ["view"],
    },
  },
];

export const staffUsers: StaffUser[] = [
  {
    id: "staff-1",
    name: "Andrea Whitfield",
    email: "andrea@lexarox.com",
    role: "Admin",
    status: "Active",
    department: "Management",
    lastLogin: "12 minutes ago",
    onboarded: "14 Jan 2024",
    assignedClients: 42,
  },
  {
    id: "staff-2",
    name: "Daniel Okoye",
    email: "daniel@lexarox.com",
    role: "Manager",
    status: "Active",
    department: "Client Services",
    lastLogin: "1 hour ago",
    onboarded: "3 Mar 2024",
    assignedClients: 51,
  },
  {
    id: "staff-3",
    name: "Priya Raman",
    email: "priya@lexarox.com",
    role: "Accountancy Staff",
    status: "Active",
    department: "Accounts",
    lastLogin: "Today",
    onboarded: "18 Jun 2024",
    assignedClients: 37,
  },
  {
    id: "staff-4",
    name: "Tomas Alvarez",
    email: "tomas@lexarox.com",
    role: "Accountancy Staff",
    status: "Active",
    department: "Accounts",
    lastLogin: "Yesterday",
    onboarded: "9 Sep 2024",
    assignedClients: 29,
  },
  {
    id: "staff-5",
    name: "Grace Mbeki",
    email: "grace@lexarox.com",
    role: "Onboarding Specialist",
    status: "Active",
    department: "Onboarding",
    lastLogin: "3 hours ago",
    onboarded: "22 Nov 2024",
    assignedClients: 18,
  },
  {
    id: "staff-6",
    name: "James Porter",
    email: "james.porter@lexarox.com",
    role: "Accountancy Staff",
    status: "Pending onboarding",
    department: "Accounts",
    lastLogin: "—",
    onboarded: "Invited 28 Aug 2026",
    assignedClients: 0,
  },
];

export type FirmCatalogueService = {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  clientsSubscribed: number;
  defaultPrice: string;
};

export const firmServiceCatalogue: FirmCatalogueService[] = [
  {
    id: "cat-1",
    name: "Annual Accounts & Corporation Tax",
    category: "Compliance",
    description: "Year-end accounts preparation and CT600 filing for limited companies.",
    enabled: true,
    clientsSubscribed: 86,
    defaultPrice: "From £1,850 / year",
  },
  {
    id: "cat-2",
    name: "VAT Returns",
    category: "Compliance",
    description: "Quarterly or monthly VAT return preparation and submission.",
    enabled: true,
    clientsSubscribed: 64,
    defaultPrice: "From £95 / quarter",
  },
  {
    id: "cat-3",
    name: "Payroll (PAYE)",
    category: "Payroll",
    description: "Monthly payroll processing, RTI submissions and payslips.",
    enabled: true,
    clientsSubscribed: 41,
    defaultPrice: "From £65 / month",
  },
  {
    id: "cat-4",
    name: "Bookkeeping",
    category: "Advisory",
    description: "Monthly bookkeeping, bank reconciliation and management reports.",
    enabled: true,
    clientsSubscribed: 52,
    defaultPrice: "From £180 / month",
  },
  {
    id: "cat-5",
    name: "Confirmation Statement",
    category: "Compliance",
    description: "Companies House confirmation statement filing.",
    enabled: true,
    clientsSubscribed: 78,
    defaultPrice: "From £45 / filing",
  },
  {
    id: "cat-6",
    name: "Self Assessment",
    category: "Compliance",
    description: "Personal tax return preparation for directors and sole traders.",
    enabled: true,
    clientsSubscribed: 33,
    defaultPrice: "From £320 / return",
  },
  {
    id: "cat-7",
    name: "R&D Tax Credits",
    category: "Advisory",
    description: "Research & development tax relief claims and documentation.",
    enabled: false,
    clientsSubscribed: 0,
    defaultPrice: "From £1,200 / claim",
  },
  {
    id: "cat-8",
    name: "CIS Returns",
    category: "Compliance",
    description: "Construction Industry Scheme monthly returns and subcontractor verification.",
    enabled: false,
    clientsSubscribed: 0,
    defaultPrice: "From £75 / month",
  },
];

export type FirmServiceItem = {
  id: string;
  internalName: string;
  serviceName: string;
  clientTypes: string;
};

export const firmServiceItems: FirmServiceItem[] = [
  {
    id: "svc-1",
    internalName: "Annual Accounts & Corporation Tax Return 2024/25",
    serviceName: "Annual Accounts & Corporation Tax Return 2024/25",
    clientTypes: "Private Limited Company",
  },
  {
    id: "svc-2",
    internalName: "Annual Accounts & Corporation Tax Return 2025/2026",
    serviceName: "Annual Accounts & Corporation Tax Return 2025/2026",
    clientTypes: "Public Limited Company +2",
  },
  {
    id: "svc-3",
    internalName: "Annual Accounts & Corporation Tax Return 2026/27",
    serviceName: "Annual Accounts & Corporation Tax Return 2026/27",
    clientTypes: "Private Limited Company",
  },
  {
    id: "svc-4",
    internalName: "Annual Accounts Review",
    serviceName: "Annual Accounts Review",
    clientTypes: "Private Limited Company",
  },
  {
    id: "svc-5",
    internalName: "Appeal Of HMRC Penalty",
    serviceName: "Appeal Of HMRC Penalty",
    clientTypes: "Self Assessment",
  },
  {
    id: "svc-6",
    internalName: "Assets Depreciation",
    serviceName: "Assets Depreciation",
    clientTypes: "Private Limited Company",
  },
  {
    id: "svc-7",
    internalName: "Assets Registration",
    serviceName: "Assets Registration",
    clientTypes: "Public Limited Company +2",
  },
  {
    id: "svc-8",
    internalName: "Basic Business And Legal Guidance",
    serviceName: "Basic Business And Legal Guidance",
    clientTypes: "Public Limited Company +2",
  },
  {
    id: "svc-9",
    internalName: "Bill Payment",
    serviceName: "Bill Payment",
    clientTypes: "Self Assessment",
  },
];

export type FirmServicePackage = {
  id: string;
  serviceName: string;
  internalPackageName: string;
  serviceCount: number;
  serviceIds: string[];
};

export const firmServicePackages: FirmServicePackage[] = [
  {
    id: "pkg-1",
    serviceName: "Lexarox Essential",
    internalPackageName: "Lexarox Essential",
    serviceCount: 6,
    serviceIds: ["svc-1", "svc-4", "svc-5", "svc-6", "svc-8", "svc-9"],
  },
  {
    id: "pkg-2",
    serviceName: "Lexarox Premium",
    internalPackageName: "Lexarox Premium",
    serviceCount: 8,
    serviceIds: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5", "svc-6", "svc-7", "svc-8"],
  },
  {
    id: "pkg-3",
    serviceName: "Lexarox Top Level",
    internalPackageName: "Lexarox Top Level",
    serviceCount: 11,
    serviceIds: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5", "svc-6", "svc-7", "svc-8", "svc-9"],
  },
  {
    id: "pkg-4",
    serviceName: "Making Tax Digital",
    internalPackageName: "MTD Full Price",
    serviceCount: 5,
    serviceIds: ["svc-1", "svc-2", "svc-5", "svc-8", "svc-9"],
  },
  {
    id: "pkg-5",
    serviceName: "MTD Early Bird Offer",
    internalPackageName: "MTD",
    serviceCount: 5,
    serviceIds: ["svc-1", "svc-3", "svc-5", "svc-7", "svc-9"],
  },
];

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  clients: number;
  seats: number;
  description?: string;
  current?: boolean;
};

export const lexaroxSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "essential",
    name: "Lexarox Essential",
    price: "£99",
    clients: 100,
    seats: 3,
    description: "Core CRM, client management and document handling for small firms.",
  },
  {
    id: "premium",
    name: "Lexarox Premium",
    price: "£249",
    clients: 500,
    seats: 10,
    description: "Full Phase 1 modules — AML, proposals, tasks, AI communication and reports.",
    current: true,
  },
  {
    id: "top-level",
    name: "Lexarox Top Level",
    price: "£499",
    clients: 2000,
    seats: 25,
    description: "Maximum capacity, priority support and advanced firm operations.",
  },
  {
    id: "mtd",
    name: "Making Tax Digital",
    price: "£149",
    clients: 250,
    seats: 5,
    description: "MTD-compliant workflows, VAT returns and digital record keeping.",
  },
  {
    id: "mtd-early-bird",
    name: "MTD Early Bird Offer",
    price: "£99",
    clients: 250,
    seats: 5,
    description: "Limited-time MTD plan with introductory pricing for early adopters.",
  },
];

export const firmSubscription = {
  plan: "Lexarox Premium",
  status: "Active" as const,
  billingCycle: "Monthly",
  amount: "£249",
  renewalDate: "1 Sep 2026",
  nextBilling: "1 Sep 2026",
  paymentMethod: "Visa ···· 4242",
  billingEmail: "billing@whitfield-partners.co.uk",
  billingAddress: "14 Charterhouse Square, London EC1M 6AX",
  seats: 10,
  seatsUsed: 6,
  clientsLimit: 500,
  clientsUsed: 128,
  aiActionsLimit: 5000,
  aiActionsUsed: 3842,
  firmName: "Whitfield & Partners Accountancy Ltd",
  availablePlans: lexaroxSubscriptionPlans,
};

export type SubscriptionInvoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  period: string;
};

export const subscriptionInvoices: SubscriptionInvoice[] = [
  { id: "INV-2026-084", date: "1 Aug 2026", amount: "£249.00", status: "Paid", period: "Aug 2026" },
  { id: "INV-2026-071", date: "1 Jul 2026", amount: "£249.00", status: "Paid", period: "Jul 2026" },
  { id: "INV-2026-058", date: "1 Jun 2026", amount: "£249.00", status: "Paid", period: "Jun 2026" },
  { id: "INV-2026-045", date: "1 May 2026", amount: "£249.00", status: "Paid", period: "May 2026" },
];

export type ProposalTemplate = {
  id: string;
  name: string;
  services: string[];
  status: "Active" | "Draft" | "Archived";
  lastUsed: string;
  createdBy: string;
  uses: number;
};

export const proposalTemplates: ProposalTemplate[] = [
  {
    id: "prop-1",
    name: "Limited Company — Full Compliance Pack",
    services: ["Annual Accounts & Corporation Tax", "VAT Returns", "Confirmation Statement", "Payroll (PAYE)"],
    status: "Active",
    lastUsed: "2 days ago",
    createdBy: "Andrea Whitfield",
    uses: 34,
  },
  {
    id: "prop-2",
    name: "Sole Trader — Starter Package",
    services: ["Self Assessment", "Bookkeeping"],
    status: "Active",
    lastUsed: "1 week ago",
    createdBy: "Daniel Okoye",
    uses: 18,
  },
  {
    id: "prop-3",
    name: "VAT-Registered SME",
    services: ["VAT Returns", "Bookkeeping", "Annual Accounts & Corporation Tax"],
    status: "Active",
    lastUsed: "Yesterday",
    createdBy: "Andrea Whitfield",
    uses: 22,
  },
  {
    id: "prop-4",
    name: "Onboarding-Only Proposal",
    services: ["Confirmation Statement", "Self Assessment"],
    status: "Draft",
    lastUsed: "—",
    createdBy: "Grace Mbeki",
    uses: 0,
  },
  {
    id: "prop-5",
    name: "Legacy Partnership Template",
    services: ["Annual Accounts & Corporation Tax", "Self Assessment"],
    status: "Archived",
    lastUsed: "3 months ago",
    createdBy: "Daniel Okoye",
    uses: 9,
  },
];

export type ProposalStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected" | "Expired";

export type FirmProposal = {
  id: string;
  client: string;
  clientId: string;
  template: string;
  status: ProposalStatus;
  value: string;
  sentDate: string;
  owner: string;
  history: { date: string; action: string; by: string }[];
};

export const firmProposals: FirmProposal[] = [
  {
    id: "fp-1",
    client: "Brightside Consulting Ltd",
    clientId: "brightside-consulting",
    template: "Limited Company — Full Compliance Pack",
    status: "Viewed",
    value: "£4,200 / year",
    sentDate: "26 Aug 2026",
    owner: "Andrea Whitfield",
    history: [
      { date: "28 Aug 2026", action: "Viewed by client", by: "Client portal" },
      { date: "26 Aug 2026", action: "Proposal sent", by: "Andrea Whitfield" },
      { date: "25 Aug 2026", action: "Draft created", by: "Andrea Whitfield" },
    ],
  },
  {
    id: "fp-2",
    client: "Harbour Lane Studio Ltd",
    clientId: "harbour-lane",
    template: "Sole Trader — Starter Package",
    status: "Draft",
    value: "£1,680 / year",
    sentDate: "—",
    owner: "Daniel Okoye",
    history: [{ date: "30 Aug 2026", action: "Draft created", by: "Daniel Okoye" }],
  },
  {
    id: "fp-3",
    client: "Northgate Partners LLP",
    clientId: "northgate-partners",
    template: "VAT-Registered SME",
    status: "Accepted",
    value: "£3,600 / year",
    sentDate: "14 Aug 2026",
    owner: "Andrea Whitfield",
    history: [
      { date: "18 Aug 2026", action: "Accepted by client", by: "Client portal" },
      { date: "16 Aug 2026", action: "Viewed by client", by: "Client portal" },
      { date: "14 Aug 2026", action: "Proposal sent", by: "Andrea Whitfield" },
    ],
  },
  {
    id: "fp-4",
    client: "Kaya Logistics Ltd",
    clientId: "kaya-logistics",
    template: "Limited Company — Full Compliance Pack",
    status: "Rejected",
    value: "£5,100 / year",
    sentDate: "2 Aug 2026",
    owner: "Priya Raman",
    history: [
      { date: "8 Aug 2026", action: "Rejected by client", by: "Client portal" },
      { date: "2 Aug 2026", action: "Proposal sent", by: "Priya Raman" },
    ],
  },
  {
    id: "fp-5",
    client: "ABC Ltd",
    clientId: "abc-ltd",
    template: "VAT-Registered SME",
    status: "Sent",
    value: "£2,880 / year",
    sentDate: "29 Aug 2026",
    owner: "Daniel Okoye",
    history: [{ date: "29 Aug 2026", action: "Proposal sent", by: "Daniel Okoye" }],
  },
  {
    id: "fp-6",
    client: "Aurora Dental Practice",
    clientId: "aurora-dental",
    template: "Limited Company — Full Compliance Pack",
    status: "Expired",
    value: "£3,200 / year",
    sentDate: "1 Jul 2026",
    owner: "Priya Raman",
    history: [
      { date: "31 Jul 2026", action: "Proposal expired", by: "System" },
      { date: "1 Jul 2026", action: "Proposal sent", by: "Priya Raman" },
    ],
  },
];

/** @deprecated Use firmProposals — kept for oversight page compatibility */
export type OversightProposal = {
  id: string;
  client: string;
  template: string;
  status: "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";
  value: string;
  sentDate: string;
  owner: string;
};

export const oversightProposals: OversightProposal[] = firmProposals.map((p) => ({
  id: p.id,
  client: p.client,
  template: p.template,
  status: p.status === "Rejected" ? "Declined" : p.status === "Viewed" ? "Sent" : p.status,
  value: p.value,
  sentDate: p.sentDate,
  owner: p.owner,
}));

export const oversightWorkflows = [
  { name: "Client onboarding pipeline", active: 4, blocked: 1, completed: 62, owner: "Grace Mbeki" },
  { name: "Year-end accounts workflow", active: 12, blocked: 2, completed: 38, owner: "Priya Raman" },
  { name: "VAT return cycle", active: 8, blocked: 0, completed: 64, owner: "Tomas Alvarez" },
  { name: "AML review cycle", active: 3, blocked: 1, completed: 128, owner: "Andrea Whitfield" },
];

export const oversightFirmMetrics = [
  { label: "Documents processed (30d)", value: "842", trend: "+12%" },
  { label: "Open workflows", value: "27", trend: "4 blocked" },
  { label: "Proposals pending", value: "6", trend: "2 awaiting response" },
  { label: "Tasks overdue", value: "3", trend: "Needs attention" },
];

export const firmProfile = {
  name: "Whitfield & Partners Accountancy Ltd",
  address: "14 Charterhouse Square, London EC1M 6AX",
  phone: "+44 20 7946 0123",
  email: "admin@whitfield-partners.co.uk",
  timezone: "Europe/London (GMT+1)",
  companiesHouse: "OC123456",
};

export const amlRequiredChecklist = [
  { id: "id-doc", label: "Photo ID (passport or driving licence)", required: true },
  { id: "address", label: "Proof of address (utility bill or bank statement)", required: true },
  { id: "risk", label: "AML risk assessment form", required: true },
  { id: "source", label: "Source of funds declaration", required: false },
  { id: "pep", label: "PEP & sanctions screening", required: true },
];

export const amlFollowUps = [
  { client: "Sahar Textiles Ltd", type: "Source of funds", due: "5 Sep 2026", owner: "Daniel Okoye", status: "Scheduled" },
  { client: "ABC Ltd", type: "Periodic review", due: "3 Sep 2026", owner: "Daniel Okoye", status: "Overdue" },
  { client: "Brightside Consulting Ltd", type: "Bank statement", due: "10 Sep 2026", owner: "Andrea Whitfield", status: "Pending" },
];

export const activityReportEntries = [
  { action: "Client onboarding completed", client: "Northgate Partners LLP", staff: "Grace Mbeki", date: "28 Aug 2026" },
  { action: "AML review passed", client: "Northgate Partners LLP", staff: "Andrea Whitfield", date: "27 Aug 2026" },
  { action: "Proposal accepted", client: "Northgate Partners LLP", staff: "Andrea Whitfield", date: "18 Aug 2026" },
  { action: "Document verified", client: "Brightside Consulting Ltd", staff: "Document Agent", date: "12 Aug 2026" },
  { action: "Task completed", client: "Aurora Dental Practice", staff: "Priya Raman", date: "2 Aug 2026" },
];

