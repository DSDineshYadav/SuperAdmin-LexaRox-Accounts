/* Super Admin — LexaRox Platform mock data */

export const platformAdmin = {
  name: "Sarah Chen",
  initials: "SC",
  email: "sarah.chen@lexarox.com",
  role: "Super Admin",
};

export type PlatformKpi = {
  id: string;
  label: string;
  value: string;
  trend: string;
  up: boolean;
  support: string;
};

export const platformKpis: PlatformKpi[] = [
  {
    id: "firms",
    label: "Subscriber Firms",
    value: "47",
    trend: "+3 this month",
    up: true,
    support: "Active on platform",
  },
  {
    id: "clients",
    label: "End Clients (all firms)",
    value: "6,842",
    trend: "+12%",
    up: true,
    support: "Across subscriber portfolio",
  },
  {
    id: "mrr",
    label: "Platform MRR",
    value: "£38,420",
    trend: "+8.4%",
    up: true,
    support: "Recurring subscription revenue",
  },
  {
    id: "inquiries",
    label: "Open Inquiries",
    value: "14",
    trend: "5 urgent",
    up: false,
    support: "Sales & support requests",
  },
  {
    id: "ai",
    label: "AI Actions (30d)",
    value: "284K",
    trend: "+22%",
    up: true,
    support: "Platform-wide automation",
  },
];

export type PlatformActivity = {
  id: string;
  type: "firm" | "billing" | "inquiry" | "system";
  title: string;
  detail: string;
  time: string;
};

export const platformActivity: PlatformActivity[] = [
  {
    id: "a1",
    type: "firm",
    title: "Harper & Lane LLP onboarded",
    detail: "Premium plan · 8 staff seats · London",
    time: "12 min ago",
  },
  {
    id: "a2",
    type: "billing",
    title: "Whitfield & Partners renewed Premium",
    detail: "£249/mo · Auto-renewal confirmed",
    time: "1 hr ago",
  },
  {
    id: "a3",
    type: "inquiry",
    title: "New sales inquiry — MTD Early Bird",
    detail: "Greenfield Accountancy · 12 staff",
    time: "2 hrs ago",
  },
  {
    id: "a4",
    type: "system",
    title: "Global proposal template updated",
    detail: "Limited Company — Full Compliance Pack v3",
    time: "3 hrs ago",
  },
  {
    id: "a5",
    type: "firm",
    title: "Northgate Partners suspended",
    detail: "Payment failure · grace period started",
    time: "Yesterday",
  },
];

export const platformFirmGrowth = [
  { month: "Jan", firms: 28, mrr: 42000, signups: 18 },
  { month: "Feb", firms: 31, mrr: 48000, signups: 22 },
  { month: "Mar", firms: 34, mrr: 52000, signups: 28 },
  { month: "Apr", firms: 36, mrr: 48000, signups: 32 },
  { month: "May", firms: 39, mrr: 58000, signups: 36 },
  { month: "Jun", firms: 41, mrr: 65000, signups: 40 },
  { month: "Jul", firms: 43, mrr: 72000, signups: 46 },
  { month: "Aug", firms: 45, mrr: 82000, signups: 52 },
];

export const platformPlanDistribution = [
  { name: "Essential", value: 12, color: "#3cadf1" },
  { name: "Premium", value: 24, color: "#50b546" },
  { name: "Top Level", value: 6, color: "#e2008e" },
  { name: "MTD", value: 5, color: "#f59e0b" },
];

export type SubscriberFirmStatus = "Active" | "Onboarding" | "Suspended" | "Trial";

export type SubscriberFirm = {
  id: string;
  name: string;
  status: SubscriberFirmStatus;
  plan: string;
  planId: string;
  location: string;
  staffCount: number;
  clientCount: number;
  mrr: string;
  joined: string;
  lastActivity: string;
  contactName: string;
  contactEmail: string;
  companiesHouse?: string;
  aiActions30d: number;
  enabledServices: string[];
  assignedTemplates: string[];
};

export const subscriberFirms: SubscriberFirm[] = [
  {
    id: "whitfield-partners",
    name: "Whitfield & Partners Accountancy Ltd",
    status: "Active",
    plan: "Lexarox Premium",
    planId: "premium",
    location: "London, UK",
    staffCount: 6,
    clientCount: 128,
    mrr: "£249",
    joined: "14 Jan 2025",
    lastActivity: "2 hours ago",
    contactName: "Andrea Whitfield",
    contactEmail: "andrea@whitfield-partners.co.uk",
    companiesHouse: "08472931",
    aiActions30d: 3842,
    enabledServices: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5", "svc-6", "svc-7"],
    assignedTemplates: ["t1", "t2", "t3", "t4", "t5", "t6"],
  },
  {
    id: "harper-lane",
    name: "Harper & Lane LLP",
    status: "Onboarding",
    plan: "Lexarox Premium",
    planId: "premium",
    location: "Manchester, UK",
    staffCount: 8,
    clientCount: 0,
    mrr: "£249",
    joined: "2 Sep 2026",
    lastActivity: "12 min ago",
    contactName: "James Harper",
    contactEmail: "james@harperlane.co.uk",
    aiActions30d: 12,
    enabledServices: ["svc-1", "svc-2", "svc-3"],
    assignedTemplates: ["t1", "t4"],
  },
  {
    id: "northgate-partners",
    name: "Northgate Partners LLP",
    status: "Suspended",
    plan: "Lexarox Essential",
    planId: "essential",
    location: "Leeds, UK",
    staffCount: 3,
    clientCount: 42,
    mrr: "£99",
    joined: "3 Jun 2024",
    lastActivity: "Yesterday",
    contactName: "Emma Northgate",
    contactEmail: "emma@northgate.co.uk",
    companiesHouse: "OC392847",
    aiActions30d: 0,
    enabledServices: ["svc-1", "svc-2", "svc-5"],
    assignedTemplates: ["t1", "t2"],
  },
  {
    id: "greenfield-accountancy",
    name: "Greenfield Accountancy",
    status: "Trial",
    plan: "MTD Early Bird",
    planId: "mtd-early-bird",
    location: "Bristol, UK",
    staffCount: 4,
    clientCount: 18,
    mrr: "£99",
    joined: "18 Aug 2026",
    lastActivity: "4 hours ago",
    contactName: "Tom Greenfield",
    contactEmail: "tom@greenfieldacct.co.uk",
    aiActions30d: 890,
    enabledServices: ["svc-2", "svc-7"],
    assignedTemplates: ["t1", "t4", "t6"],
  },
  {
    id: "summit-advisors",
    name: "Summit Financial Advisors Ltd",
    status: "Active",
    plan: "Lexarox Top Level",
    planId: "top-level",
    location: "Edinburgh, UK",
    staffCount: 22,
    clientCount: 890,
    mrr: "£499",
    joined: "9 Nov 2024",
    lastActivity: "30 min ago",
    contactName: "Fiona MacLeod",
    contactEmail: "fiona@summitadvisors.co.uk",
    companiesHouse: "SC671234",
    aiActions30d: 12400,
    enabledServices: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5", "svc-6", "svc-7", "svc-8"],
    assignedTemplates: ["t1", "t2", "t3", "t4", "t5", "t6"],
  },
  {
    id: "coastal-tax",
    name: "Coastal Tax Solutions",
    status: "Active",
    plan: "Making Tax Digital",
    planId: "mtd",
    location: "Brighton, UK",
    staffCount: 5,
    clientCount: 156,
    mrr: "£149",
    joined: "22 Mar 2025",
    lastActivity: "1 day ago",
    contactName: "Rachel Shore",
    contactEmail: "rachel@coastaltax.co.uk",
    aiActions30d: 2100,
    enabledServices: ["svc-2", "svc-7"],
    assignedTemplates: ["t1", "t4", "t6"],
  },
];

export type PlatformPlanAgent = {
  id: string;
  name: string;
  description: string;
};

export const platformPlanAgents: PlatformPlanAgent[] = [
  {
    id: "document",
    name: "Document Agent",
    description: "Processes, categorises and analyses client documents.",
  },
  {
    id: "onboarding",
    name: "Client Onboarding Agent",
    description: "Guides clients through onboarding in their own language.",
  },
  {
    id: "communication",
    name: "Communication Agent",
    description: "Prepares emails and client communications for approval.",
  },
  {
    id: "accountancy",
    name: "Accountancy Agent",
    description: "Supports ledger, VAT and year-end workflows.",
  },
  {
    id: "task",
    name: "Task Agent",
    description: "Creates, routes and prioritises work across the team.",
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    description: "Supports campaigns, newsletters and client nurture.",
  },
];

export type PlatformSubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  billingPeriod: "Monthly" | "Annual";
  clients: number;
  seats: number;
  aiActionsLimit: number;
  description: string;
  firmsSubscribed: number;
  status: "Active" | "Archived" | "Draft";
  features: string[];
  enabledAgents: string[];
};

export const platformSubscriptionPlans: PlatformSubscriptionPlan[] = [
  {
    id: "essential",
    name: "Lexarox Essential",
    price: "£99",
    billingPeriod: "Monthly",
    clients: 100,
    seats: 3,
    aiActionsLimit: 1000,
    description: "Core CRM, client management and document handling for small firms.",
    firmsSubscribed: 12,
    status: "Active",
    features: ["Client CRM", "Document management", "Basic tasks", "Email integration"],
    enabledAgents: ["document", "onboarding", "communication", "task"],
  },
  {
    id: "premium",
    name: "Lexarox Premium",
    price: "£249",
    billingPeriod: "Monthly",
    clients: 500,
    seats: 10,
    aiActionsLimit: 5000,
    description: "Full Phase 1 modules — AML, proposals, tasks, AI communication and reports.",
    firmsSubscribed: 24,
    status: "Active",
    features: ["Everything in Essential", "AML compliance", "AI communication", "Proposals", "Reports"],
    enabledAgents: ["document", "onboarding", "communication", "accountancy", "task"],
  },
  {
    id: "top-level",
    name: "Lexarox Top Level",
    price: "£499",
    billingPeriod: "Monthly",
    clients: 2000,
    seats: 25,
    aiActionsLimit: 15000,
    description: "Maximum capacity, priority support and advanced firm operations.",
    firmsSubscribed: 6,
    status: "Active",
    features: ["Everything in Premium", "Priority support", "Advanced analytics", "Custom integrations"],
    enabledAgents: ["document", "onboarding", "communication", "accountancy", "task", "marketing"],
  },
  {
    id: "mtd",
    name: "Making Tax Digital",
    price: "£149",
    billingPeriod: "Monthly",
    clients: 250,
    seats: 5,
    aiActionsLimit: 3000,
    description: "MTD-compliant workflows, VAT returns and digital record keeping.",
    firmsSubscribed: 5,
    status: "Active",
    features: ["MTD workflows", "VAT returns", "Digital records", "HMRC integration"],
    enabledAgents: ["document", "accountancy", "task"],
  },
  {
    id: "mtd-early-bird",
    name: "MTD Early Bird Offer",
    price: "£99",
    billingPeriod: "Monthly",
    clients: 250,
    seats: 5,
    aiActionsLimit: 3000,
    description: "Limited-time MTD plan with introductory pricing for early adopters.",
    firmsSubscribed: 3,
    status: "Active",
    features: ["MTD workflows", "Introductory pricing", "Migration support"],
    enabledAgents: ["document", "accountancy", "task"],
  },
];

export type FirmBillingRecord = {
  id: string;
  firmId: string;
  firmName: string;
  plan: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed" | "Overdue";
  period: string;
  date: string;
};

export const firmBillingRecords: FirmBillingRecord[] = [
  { id: "BIL-2026-184", firmId: "whitfield-partners", firmName: "Whitfield & Partners", plan: "Premium", amount: "£249.00", status: "Paid", period: "Sep 2026", date: "1 Sep 2026" },
  { id: "BIL-2026-183", firmId: "summit-advisors", firmName: "Summit Financial Advisors", plan: "Top Level", amount: "£499.00", status: "Paid", period: "Sep 2026", date: "1 Sep 2026" },
  { id: "BIL-2026-182", firmId: "northgate-partners", firmName: "Northgate Partners LLP", plan: "Essential", amount: "£99.00", status: "Failed", period: "Sep 2026", date: "1 Sep 2026" },
  { id: "BIL-2026-181", firmId: "coastal-tax", firmName: "Coastal Tax Solutions", plan: "MTD", amount: "£149.00", status: "Paid", period: "Sep 2026", date: "1 Sep 2026" },
  { id: "BIL-2026-180", firmId: "greenfield-accountancy", firmName: "Greenfield Accountancy", plan: "MTD Early Bird", amount: "£99.00", status: "Pending", period: "Sep 2026", date: "1 Sep 2026" },
];

export type StaticContentPage = {
  id: string;
  title: string;
  slug: string;
  category: "Legal" | "Help & Support" | "Marketing";
  status: "Published" | "Draft" | "Archived";
  lastUpdated: string;
  updatedBy: string;
  locale: string;
};

export const staticContentPages: StaticContentPage[] = [
  { id: "c1", title: "Terms of Service", slug: "/terms", category: "Legal", status: "Published", lastUpdated: "15 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c2", title: "Privacy Policy", slug: "/privacy", category: "Legal", status: "Published", lastUpdated: "15 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c3", title: "Cookie Policy", slug: "/cookies", category: "Legal", status: "Published", lastUpdated: "1 Jul 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c4", title: "Help Centre — Getting Started", slug: "/help/getting-started", category: "Help & Support", status: "Published", lastUpdated: "28 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c5", title: "Help Centre — Client Onboarding", slug: "/help/onboarding", category: "Help & Support", status: "Published", lastUpdated: "20 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c6", title: "Help Centre — AI Features", slug: "/help/ai", category: "Help & Support", status: "Draft", lastUpdated: "2 Sep 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c7", title: "Marketing — Homepage Hero", slug: "/", category: "Marketing", status: "Published", lastUpdated: "10 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c8", title: "Marketing — Pricing Page", slug: "/pricing", category: "Marketing", status: "Published", lastUpdated: "5 Aug 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
  { id: "c9", title: "Marketing — Demo Request Form", slug: "/demo", category: "Marketing", status: "Published", lastUpdated: "1 Sep 2026", updatedBy: "Sarah Chen", locale: "en-GB" },
];

export type PlatformCatalogueService = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "Active" | "Draft" | "Deprecated";
  firmsEnabled: number;
  defaultPrice: string;
  clientTypes: string[];
};

export const platformServiceCatalogue: PlatformCatalogueService[] = [
  { id: "svc-1", name: "Annual Accounts & Corporation Tax", category: "Compliance", description: "Year-end accounts and CT600 filing for limited companies.", status: "Active", firmsEnabled: 42, defaultPrice: "From £1,850 / year", clientTypes: ["Limited Company"] },
  { id: "svc-2", name: "VAT Returns", category: "Compliance", description: "Quarterly or monthly VAT return preparation and submission.", status: "Active", firmsEnabled: 38, defaultPrice: "From £120 / quarter", clientTypes: ["Limited Company", "Sole Trader"] },
  { id: "svc-3", name: "Self Assessment", category: "Compliance", description: "Personal tax return preparation and filing.", status: "Active", firmsEnabled: 45, defaultPrice: "From £350 / return", clientTypes: ["Sole Trader", "Individual"] },
  { id: "svc-4", name: "Payroll (PAYE)", category: "Advisory", description: "Monthly payroll processing, RTI submissions and payslips.", status: "Active", firmsEnabled: 31, defaultPrice: "From £45 / month", clientTypes: ["Limited Company"] },
  { id: "svc-5", name: "Confirmation Statement", category: "Compliance", description: "Annual confirmation statement filing with Companies House.", status: "Active", firmsEnabled: 40, defaultPrice: "From £75 / filing", clientTypes: ["Limited Company", "LLP"] },
  { id: "svc-6", name: "Bookkeeping", category: "Advisory", description: "Ongoing bookkeeping and management accounts.", status: "Active", firmsEnabled: 35, defaultPrice: "From £200 / month", clientTypes: ["Limited Company", "Sole Trader"] },
  { id: "svc-7", name: "MTD for VAT", category: "Compliance", description: "Making Tax Digital compliant VAT workflows.", status: "Active", firmsEnabled: 22, defaultPrice: "From £150 / quarter", clientTypes: ["Limited Company", "Sole Trader"] },
  { id: "svc-8", name: "R&D Tax Credits", category: "Advisory", description: "Research and development tax relief claims.", status: "Draft", firmsEnabled: 0, defaultPrice: "From £2,500 / claim", clientTypes: ["Limited Company"] },
];

export type GlobalTemplate = {
  id: string;
  name: string;
  type: "Email" | "Proposal";
  category: string;
  status: "Active" | "Draft" | "Archived";
  lastUpdated: string;
  updatedBy: string;
  firmsUsing: number;
};

export const globalTemplates: GlobalTemplate[] = [
  { id: "t1", name: "Client Welcome — Onboarding", type: "Email", category: "Onboarding", status: "Active", lastUpdated: "28 Aug 2026", updatedBy: "Sarah Chen", firmsUsing: 44 },
  { id: "t2", name: "Document Chase Reminder", type: "Email", category: "Operations", status: "Active", lastUpdated: "15 Aug 2026", updatedBy: "Sarah Chen", firmsUsing: 41 },
  { id: "t3", name: "AML Verification Request", type: "Email", category: "Compliance", status: "Active", lastUpdated: "10 Aug 2026", updatedBy: "Sarah Chen", firmsUsing: 38 },
  { id: "t4", name: "Limited Company — Full Compliance Pack", type: "Proposal", category: "Compliance", status: "Active", lastUpdated: "2 Sep 2026", updatedBy: "Sarah Chen", firmsUsing: 35 },
  { id: "t5", name: "Sole Trader — Starter Package", type: "Proposal", category: "Advisory", status: "Active", lastUpdated: "20 Jul 2026", updatedBy: "Sarah Chen", firmsUsing: 28 },
  { id: "t6", name: "VAT-Registered SME", type: "Proposal", category: "Compliance", status: "Active", lastUpdated: "5 Aug 2026", updatedBy: "Sarah Chen", firmsUsing: 22 },
  { id: "t7", name: "Trial Expiry Reminder", type: "Email", category: "Billing", status: "Draft", lastUpdated: "1 Sep 2026", updatedBy: "Sarah Chen", firmsUsing: 0 },
];

export type PlatformInquiry = {
  id: string;
  type: "Sales" | "Support" | "Partnership";
  subject: string;
  contactName: string;
  contactEmail: string;
  firmName?: string;
  status: "New" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  received: string;
  assignedTo?: string;
  message: string;
};

export const platformInquiries: PlatformInquiry[] = [
  { id: "INQ-1042", type: "Sales", subject: "MTD Early Bird — 12 staff firm", contactName: "Tom Greenfield", contactEmail: "tom@greenfieldacct.co.uk", firmName: "Greenfield Accountancy", status: "In Progress", priority: "High", received: "2 Sep 2026", assignedTo: "Sarah Chen", message: "Interested in MTD Early Bird plan for our Bristol practice. Need demo and migration timeline." },
  { id: "INQ-1041", type: "Support", subject: "Payment failure — account suspended", contactName: "Emma Northgate", contactEmail: "emma@northgate.co.uk", firmName: "Northgate Partners LLP", status: "New", priority: "Urgent", received: "2 Sep 2026", message: "Our account was suspended after card expiry. Need to update payment method urgently." },
  { id: "INQ-1040", type: "Sales", subject: "Enterprise plan enquiry", contactName: "David Walsh", contactEmail: "david@walshpartners.ie", firmName: "Walsh Partners", status: "New", priority: "Medium", received: "1 Sep 2026", message: "We have 35 staff across Dublin and Cork. Looking for Top Level or custom enterprise pricing." },
  { id: "INQ-1039", type: "Support", subject: "AI email drafts not appearing", contactName: "Andrea Whitfield", contactEmail: "andrea@whitfield-partners.co.uk", firmName: "Whitfield & Partners", status: "Resolved", priority: "Medium", received: "30 Aug 2026", assignedTo: "Support Team", message: "Drafts stopped appearing in AI-Assisted Communication since Thursday." },
  { id: "INQ-1038", type: "Partnership", subject: "Software reseller partnership", contactName: "Mark Stevens", contactEmail: "mark@accountech.co.uk", status: "In Progress", priority: "Low", received: "28 Aug 2026", assignedTo: "Partnerships", message: "AccounTech would like to discuss white-label or reseller arrangement for LexaRox." },
];

export type PlatformRole = {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
};

export const platformRoles: PlatformRole[] = [
  { id: "super-admin", name: "Super Admin", description: "Full platform access — firms, billing, content, system config.", users: 2, permissions: ["All modules"] },
  { id: "platform-admin", name: "Platform Admin", description: "Manage firms, subscriptions and support — no system config.", users: 4, permissions: ["Firms", "Subscriptions", "Inquiries", "Templates"] },
];

export type PlatformPermissionModule = {
  id: string;
  name: string;
  description: string;
};

export const platformPermissionModules: PlatformPermissionModule[] = [
  { id: "dashboard", name: "Dashboard", description: "View platform overview, KPIs and activity." },
  { id: "firms", name: "Firm Management", description: "Manage subscriber firms and onboarding." },
  { id: "inquiries", name: "Inquiry Management", description: "Handle sales, support and partnership inquiries." },
  { id: "services", name: "Manage Services", description: "Configure the platform service catalogue." },
  { id: "templates", name: "Template Management", description: "Manage global email and proposal templates." },
  { id: "subscriptions", name: "Subscription Management", description: "Create and manage subscription plans." },
  { id: "content", name: "Static Content", description: "Edit legal, help and marketing pages." },
  { id: "subadmin", name: "Subadmin Management", description: "Manage internal platform users and access." },
  { id: "settings", name: "System Administration", description: "Roles, integrations, onboarding and audit logs." },
];

const platformAdminDefaultPermissions = ["firms", "inquiries", "services", "templates", "subscriptions"];

export function getDefaultPermissionsForRole(roleId: string): string[] {
  if (roleId === "super-admin") {
    return platformPermissionModules.map((module) => module.id);
  }
  return [...platformAdminDefaultPermissions];
}

export function getPermissionModuleName(permissionId: string): string {
  return platformPermissionModules.find((module) => module.id === permissionId)?.name ?? permissionId;
}

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: "Active" | "Invited";
  added: string;
  enabled: boolean;
  permissions: string[];
};

export const platformUsers: PlatformUser[] = [
  {
    id: "pu-1",
    name: "Sarah Chen",
    email: "sarah.chen@lexarox.com",
    roleId: "super-admin",
    status: "Active",
    added: "Jan 2026",
    enabled: true,
    permissions: getDefaultPermissionsForRole("super-admin"),
  },
  {
    id: "pu-2",
    name: "James Okonkwo",
    email: "james.okonkwo@lexarox.com",
    roleId: "super-admin",
    status: "Active",
    added: "Mar 2026",
    enabled: true,
    permissions: getDefaultPermissionsForRole("super-admin"),
  },
  {
    id: "pu-3",
    name: "Emily Foster",
    email: "emily.foster@lexarox.com",
    roleId: "platform-admin",
    status: "Active",
    added: "Apr 2026",
    enabled: true,
    permissions: getDefaultPermissionsForRole("platform-admin"),
  },
  {
    id: "pu-4",
    name: "Daniel Hughes",
    email: "daniel.hughes@lexarox.com",
    roleId: "platform-admin",
    status: "Active",
    added: "May 2026",
    enabled: true,
    permissions: ["firms", "inquiries", "templates", "subscriptions"],
  },
  {
    id: "pu-5",
    name: "Priya Sharma",
    email: "priya.sharma@lexarox.com",
    roleId: "platform-admin",
    status: "Active",
    added: "Jun 2026",
    enabled: true,
    permissions: getDefaultPermissionsForRole("platform-admin"),
  },
  {
    id: "pu-6",
    name: "Michael Torres",
    email: "michael.torres@lexarox.com",
    roleId: "platform-admin",
    status: "Invited",
    added: "Aug 2026",
    enabled: true,
    permissions: ["firms", "inquiries"],
  },
];

export type PlatformDepartment = {
  id: string;
  name: string;
  description: string;
  firmsUsing: number;
  defaultForNewFirms: boolean;
};

export const platformDepartments: PlatformDepartment[] = [
  { id: "dept-1", name: "Compliance", description: "AML, statutory filings and regulatory workflows.", firmsUsing: 47, defaultForNewFirms: true },
  { id: "dept-2", name: "Advisory", description: "Bookkeeping, payroll and business advisory services.", firmsUsing: 44, defaultForNewFirms: true },
  { id: "dept-3", name: "Onboarding", description: "Client intake, KYC and document collection.", firmsUsing: 47, defaultForNewFirms: true },
  { id: "dept-4", name: "Operations", description: "Task management, communications and oversight.", firmsUsing: 46, defaultForNewFirms: true },
];

export type OnboardingStep = {
  id: string;
  name: string;
  required: boolean;
  order: number;
  enabled: boolean;
};

export const clientOnboardingConfig: OnboardingStep[] = [
  { id: "step-1", name: "Contact details & engagement letter", required: true, order: 1, enabled: true },
  { id: "step-2", name: "AML / KYC verification", required: true, order: 2, enabled: true },
  { id: "step-3", name: "Document collection", required: true, order: 3, enabled: true },
  { id: "step-4", name: "Service selection & proposal", required: true, order: 4, enabled: true },
  { id: "step-5", name: "Direct debit / payment setup", required: false, order: 5, enabled: true },
  { id: "step-6", name: "Portal access & welcome email", required: true, order: 6, enabled: true },
];

export type PlatformIntegration = {
  id: string;
  name: string;
  category: string;
  status: "Connected" | "Available" | "Deprecated";
  firmsConnected: number;
};

export const platformIntegrations: PlatformIntegration[] = [
  { id: "int-1", name: "Microsoft 365 / Outlook", category: "Email", status: "Connected", firmsConnected: 38 },
  { id: "int-2", name: "Companies House API", category: "Compliance", status: "Connected", firmsConnected: 45 },
  { id: "int-3", name: "HMRC MTD", category: "Compliance", status: "Connected", firmsConnected: 27 },
  { id: "int-4", name: "WhatsApp Business", category: "Communication", status: "Connected", firmsConnected: 22 },
  { id: "int-5", name: "Xero", category: "Accounting", status: "Available", firmsConnected: 0 },
  { id: "int-6", name: "QuickBooks", category: "Accounting", status: "Available", firmsConnected: 0 },
];

export type AuditLogEntry = {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ip: string;
};

export const auditLogs: AuditLogEntry[] = [
  { id: "log-1", action: "Firm suspended", actor: "Sarah Chen", target: "Northgate Partners LLP", timestamp: "2 Sep 2026, 09:14", ip: "81.2.xxx.xxx" },
  { id: "log-2", action: "Plan updated", actor: "Sarah Chen", target: "Whitfield & Partners → Premium", timestamp: "1 Sep 2026, 14:22", ip: "81.2.xxx.xxx" },
  { id: "log-3", action: "Template published", actor: "Sarah Chen", target: "Limited Company — Full Compliance Pack v3", timestamp: "2 Sep 2026, 11:05", ip: "81.2.xxx.xxx" },
  { id: "log-4", action: "Content updated", actor: "Sarah Chen", target: "Terms of Service", timestamp: "15 Aug 2026, 16:30", ip: "81.2.xxx.xxx" },
  { id: "log-5", action: "New firm onboarded", actor: "Sarah Chen", target: "Harper & Lane LLP", timestamp: "2 Sep 2026, 08:45", ip: "81.2.xxx.xxx" },
];

export type PlatformNotificationCategory = "Firm" | "Billing" | "Inquiry" | "System" | "Subscription";

export type PlatformNotification = {
  id: string;
  category: PlatformNotificationCategory;
  title: string;
  message: string;
  received: string;
  read: boolean;
  firmName?: string;
};

export const platformNotifications: PlatformNotification[] = [
  { id: "ntf-1", category: "Firm", title: "Harper & Lane LLP onboarded", message: "Premium plan · 8 staff seats · London", received: "12 min ago", read: false, firmName: "Harper & Lane LLP" },
  { id: "ntf-2", category: "Billing", title: "Northgate Partners — payment failed", message: "Card expired · grace period started · action required", received: "1 hr ago", read: false, firmName: "Northgate Partners LLP" },
  { id: "ntf-3", category: "Inquiry", title: "New sales inquiry — MTD Early Bird", message: "Greenfield Accountancy · 12 staff · demo requested", received: "2 hrs ago", read: false, firmName: "Greenfield Accountancy" },
  { id: "ntf-4", category: "Billing", title: "Whitfield & Partners renewed Premium", message: "£249/mo · auto-renewal confirmed for Sep 2026", received: "3 hrs ago", read: true, firmName: "Whitfield & Partners Accountancy Ltd" },
  { id: "ntf-5", category: "System", title: "Global proposal template updated", message: "Limited Company — Full Compliance Pack v3 published platform-wide", received: "4 hrs ago", read: true },
  { id: "ntf-6", category: "Subscription", title: "Summit Advisors approaching seat limit", message: "22 of 25 seats used · consider Top Level upgrade", received: "Yesterday", read: false, firmName: "Summit Financial Advisors Ltd" },
  { id: "ntf-7", category: "Firm", title: "Greenfield Accountancy trial ending soon", message: "MTD Early Bird trial expires in 5 days", received: "Yesterday", read: true, firmName: "Greenfield Accountancy" },
  { id: "ntf-8", category: "Inquiry", title: "Support inquiry — payment failure", message: "Emma Northgate · urgent account suspension follow-up", received: "Yesterday", read: false, firmName: "Northgate Partners LLP" },
  { id: "ntf-9", category: "Billing", title: "Coastal Tax Solutions invoice paid", message: "£149 MTD plan · Sep 2026 billing cycle", received: "2 days ago", read: true, firmName: "Coastal Tax Solutions" },
  { id: "ntf-10", category: "System", title: "Weekly platform summary ready", message: "MRR, firm count and activity digest for Super Admins", received: "3 days ago", read: true },
  { id: "ntf-11", category: "Subscription", title: "New plan draft created", message: "Lexarox Enterprise — awaiting review before publish", received: "4 days ago", read: true },
  { id: "ntf-12", category: "Firm", title: "Northgate Partners suspended", message: "Payment failure · client access restricted", received: "5 days ago", read: true, firmName: "Northgate Partners LLP" },
];
