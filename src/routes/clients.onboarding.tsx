import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Sparkles,
  Languages,
  MessageSquareText,
  Building2,
  Link2,
  User,
  Users,
  PoundSterling,
  Briefcase,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { AiInsight, ProgressBar, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormDialog } from "@/components/form-dialog";
import { clients, languages, teamMembers, type OnboardingStatus } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const onboardingStatusTabs: OnboardingStatus[] = [
  "Onboarding",
  "Awaiting Documents",
  "Review Required",
  "Active",
  "Completed",
];

export type OnboardingMode = "create" | "edit";

export const Route = createFileRoute("/clients/onboarding")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { status: OnboardingStatus; clientId?: string; mode: OnboardingMode } => {
    const status = search.status as OnboardingStatus;
    const mode: OnboardingMode = search.mode === "create" ? "create" : "edit";
    return {
      status: onboardingStatusTabs.includes(status) ? status : "Onboarding",
      clientId: mode === "edit" && typeof search.clientId === "string" ? search.clientId : undefined,
      mode,
    };
  },
  head: () => ({
    meta: [
      { title: "Client Onboarding — LexaRox Accounts" },
      {
        name: "description",
        content:
          "AI-guided, multilingual client onboarding with document checklists, verification and exception handling.",
      },
      { property: "og:title", content: "Client Onboarding — LexaRox Accounts" },
      { property: "og:description", content: "Guided onboarding where AI explains, chases and verifies." },
    ],
  }),
  component: OnboardingPage,
});

type StepStatus = "complete" | "active" | "todo";
type ChecklistState = "done" | "warn" | "todo";

const onboardingStepTemplates = [
  {
    id: "required-information",
    title: "Required Information",
    icon: FileText,
    items: [
      { label: "Client name entered", state: "done" },
      { label: "Client type selected", state: "done" },
      { label: "Partner assigned", state: "done" },
      { label: "Manager assigned", state: "done" },
      { label: "Credit check completed", state: "warn" },
    ],
  },
  {
    id: "quickbooks",
    title: "QuickBooks",
    icon: Link2,
    items: [
      { label: "QuickBooks connection linked", state: "todo" },
      { label: "Chart of accounts mapped", state: "todo" },
    ],
  },
  {
    id: "company-details",
    title: "Company Details",
    icon: Building2,
    items: [
      { label: "Companies House number verified", state: "todo" },
      { label: "Registered office address", state: "todo" },
      { label: "Incorporation date confirmed", state: "todo" },
      { label: "SIC code recorded", state: "todo" },
    ],
  },
  {
    id: "main-contact",
    title: "Main Contact",
    icon: User,
    items: [
      { label: "Contact name & title", state: "done" },
      { label: "Postal address captured", state: "warn" },
      { label: "Photo ID verified", state: "todo" },
      { label: "Address verified", state: "todo" },
    ],
  },
  {
    id: "aml-compliance",
    title: "AML / Compliance",
    icon: ShieldCheck,
    items: [
      { label: "AML check started", state: "done" },
      { label: "ID verification completed", state: "todo" },
      { label: "PEP & sanctions screening", state: "todo" },
      { label: "Risk assessment completed", state: "todo" },
      { label: "Source of funds declared", state: "todo" },
      { label: "AML sign-off", state: "todo" },
    ],
  },
  {
    id: "secondary-contact",
    title: "Secondary Contact",
    icon: Users,
    items: [
      { label: "Secondary contact name", state: "todo" },
      { label: "Contact email & phone", state: "todo" },
      { label: "Relationship to client", state: "todo" },
    ],
  },
  {
    id: "income-details",
    title: "Income Details",
    icon: PoundSterling,
    items: [
      { label: "Estimated annual turnover", state: "todo" },
      { label: "Income sources declared", state: "todo" },
      { label: "VAT registration status", state: "todo" },
    ],
  },
  {
    id: "previous-accountant",
    title: "Previous Accountant",
    icon: Briefcase,
    items: [
      { label: "Previous firm name", state: "todo" },
      { label: "Professional clearance requested", state: "todo" },
      { label: "Records transfer date", state: "todo" },
    ],
  },
  {
    id: "other-details",
    title: "Other Details",
    icon: FileText,
    items: [
      { label: "Referral source recorded", state: "todo" },
      { label: "Internal notes added", state: "todo" },
      { label: "Engagement terms signed", state: "todo" },
    ],
  },
] as const;

function buildOnboardingSteps(current: number, isCreate: boolean) {
  return onboardingStepTemplates.map((step, i) => ({
    ...step,
    status: (i === current ? "active" : i < current ? "complete" : "todo") as StepStatus,
    items: isCreate
      ? step.items.map((item) => ({ ...item, state: "todo" as ChecklistState }))
      : step.items.map((item) => ({ ...item })),
  }));
}

type OnboardingAction =
  | "companies-house"
  | "credit-check"
  | "quickbooks"
  | "aml-check"
  | "id-check"
  | "clearance"
  | "ai-chase";

function OnboardingPage() {
  const { status, clientId, mode } = Route.useSearch();
  const isCreate = mode === "create";
  const [current, setCurrent] = useState(0);
  const [language, setLanguage] = useState("English");
  const [conversation, setConversation] = useState(false);
  const [action, setAction] = useState<OnboardingAction | null>(null);

  const client = isCreate
    ? null
    : (clientId ? clients.find((c) => c.id === clientId) : undefined) ?? clients.find((c) => c.status === status) ?? clients[0]!;

  const steps = buildOnboardingSteps(current, isCreate);
  const step = steps[current]!;
  const completedSteps = steps.filter((s) => s.status === "complete").length;
  const progress = Math.round(((completedSteps + (step.status === "active" ? 0.5 : 0)) / steps.length) * 100);
  const formKey = `${mode}-${clientId ?? "new"}`;

  const partners = teamMembers.filter((m) => m.role === "Admin" || m.role === "Manager");
  const defaultPartner = partners[0]?.name ?? "Andrea Whitfield";

  const field = (value: string, placeholder?: string) =>
    isCreate ? { placeholder: placeholder ?? "Enter value" } : { defaultValue: value };

  return (
    <AppShell>
      <PageBackLink to="/clients" label="Back to Manage Clients" />

      <PageHeader
        title="Client Onboarding"
        subtitle={
          isCreate
            ? "Add a new client — start with required information"
            : `${client!.name} · AI-guided multilingual onboarding`
        }
      />

      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <Section
          title={isCreate ? "New Client" : client!.name}
          description={
            isCreate
              ? "Limited Company · Complete each step to onboard"
              : `${client!.type} · Account manager: ${client!.manager}`
          }
          actions={
            <StatusBadge tone={toneForStatus(isCreate ? "Onboarding" : client!.status)}>
              {isCreate ? "New" : client!.status}
            </StatusBadge>
          }
          className="min-w-0"
        >
          <div key={formKey} className="grid gap-6 p-4 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:px-5">
            {/* Left — vertical steps */}
            <nav className="space-y-1 border-b pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isComplete = s.status === "complete";
                const isActive = s.status === "active";
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all",
                      isActive && "bg-[#3cadf1] text-white shadow-sm",
                      !isActive && isComplete && "text-emerald-600 hover:bg-emerald-500/10",
                      !isActive && !isComplete && "text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-md",
                        isActive && "bg-white/20",
                        !isActive && isComplete && "bg-emerald-500/15",
                        !isActive && !isComplete && "bg-muted",
                      )}
                    >
                      {isComplete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="leading-snug">{s.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right — step content */}
            <div className="min-w-0 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  <div className="mt-3 mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Overall Completion</span>
                    <span className="text-[#3cadf1]">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} tone="ai" />
                </div>

                {step.id === "required-information" && (
                  <div className="space-y-4">
                    <Button
                      size="sm"
                      className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold"
                      onClick={() => setAction("companies-house")}
                    >
                      Autofill with Companies House
                    </Button>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Name</Label>
                        <Input {...field(client?.name ?? "", "Client name")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Client type</Label>
                        <Select defaultValue={isCreate ? undefined : client!.type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Limited Company", "Sole Trader", "Partnership", "LLP"].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Partner</Label>
                        <Select defaultValue={isCreate ? undefined : defaultPartner}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {partners.map((p) => (
                              <SelectItem key={p.email} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Manager</Label>
                        <Select defaultValue={isCreate ? undefined : client!.manager}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map((m) => (
                              <SelectItem key={m.email} value={m.name}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-[#3cadf1]" onClick={() => setAction("credit-check")}>
                      Complete Credit Check
                    </Button>
                  </div>
                )}

                {step.id === "quickbooks" && (
                  <div className="space-y-4 rounded-xl border border-dashed border-border/60 bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      Connect this client&apos;s QuickBooks account to sync bookkeeping data automatically.
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">Status: Not connected</p>
                    <Button size="sm" variant="outline" onClick={() => setAction("quickbooks")}>
                      Connect QuickBooks
                    </Button>
                  </div>
                )}

                {step.id === "company-details" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Companies House number</Label>
                      <Input placeholder="e.g. 12345678" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Incorporation date</Label>
                      <Input type="date" {...field("2019-03-15")} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Registered office address</Label>
                      <Textarea rows={2} placeholder="Full registered address" {...field("14 Harbour Lane, London EC2A 4NE")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>SIC code</Label>
                      <Input {...field("70229 — Management consultancy")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Year end</Label>
                      <Input {...field(client?.yearEnd ?? "", "e.g. 31 March")} />
                    </div>
                  </div>
                )}

                {step.id === "main-contact" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setAction("aml-check")}>
                        Start AML Check
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAction("id-check")}>
                        Start ID Check
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Select defaultValue={isCreate ? undefined : "Mr"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Mr", "Mrs", "Ms", "Dr"].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>First name</Label>
                        <Input {...field("James", "First name")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Middle name</Label>
                        <Input placeholder="Optional" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Last name</Label>
                        <Input {...field("Smith", "Last name")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Date of birth</Label>
                        <Input type="date" {...field("1985-06-12")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Preferred language</Label>
                        <Select defaultValue={isCreate ? undefined : client!.language}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Postal address</Label>
                        <Textarea rows={2} {...field("22 Riverside Court, London SW1A 1AA", "Postal address")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>NI number</Label>
                        <Input placeholder="QQ 12 34 56 C" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Personal UTR</Label>
                        <Input {...field(client?.utr ?? "", "Personal UTR")} />
                      </div>
                    </div>
                  </div>
                )}

                {step.id === "secondary-contact" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>First name</Label>
                      <Input placeholder="Contact first name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Last name</Label>
                      <Input placeholder="Contact last name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input type="email" placeholder="contact@company.co.uk" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone</Label>
                      <Input type="tel" placeholder="+44 7700 900000" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Relationship to client</Label>
                      <Select defaultValue={isCreate ? undefined : "Director"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Director", "Shareholder", "Bookkeeper", "Other"].map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step.id === "income-details" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Estimated annual turnover</Label>
                      <Input {...field("£420,000", "Estimated annual turnover")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>VAT registered</Label>
                      <Select defaultValue={isCreate ? undefined : "Yes"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Yes", "No", "Pending registration"].map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Primary income sources</Label>
                      <Textarea rows={2} {...field("Consultancy services, retainer contracts, project-based fees", "Primary income sources")} />
                    </div>
                  </div>
                )}

                {step.id === "previous-accountant" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Previous accountant / firm name</Label>
                      <Input placeholder="Previous firm name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Contact email</Label>
                      <Input type="email" placeholder="accounts@previousfirm.co.uk" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Records transfer date</Label>
                      <Input type="date" />
                    </div>
                    <div className="sm:col-span-2">
                      <Button size="sm" variant="outline" onClick={() => setAction("clearance")}>
                        Request professional clearance
                      </Button>
                    </div>
                  </div>
                )}

                {step.id === "other-details" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Referral source</Label>
                      <Select defaultValue={isCreate ? undefined : "Existing client"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Existing client", "Website", "Accountant referral", "Other"].map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Internal notes</Label>
                      <Textarea rows={3} placeholder="Any additional onboarding notes for the team…" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Terms signed date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                )}

                <ul className="space-y-2 border-t pt-4">
                  {step.items.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 text-sm"
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                          c.state === "done" && "bg-emerald-500/15 text-emerald-500",
                          c.state === "warn" && "bg-amber-500/15 text-amber-500",
                          c.state === "todo" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {c.state === "done" ? "✓" : c.state === "warn" ? "!" : "○"}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate font-medium",
                          c.state === "done" && "text-muted-foreground line-through",
                        )}
                      >
                        {c.label}
                      </span>
                      {c.state === "warn" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold"
                          onClick={() => setAction("ai-chase")}
                        >
                          Chase with AI
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className="text-xs font-semibold"
                  >
                    Previous Step
                  </Button>
                  <Button
                    className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold text-xs"
                    onClick={() => {
                      if (current === steps.length - 1) {
                        toast.success("Onboarding submitted for review");
                        return;
                      }
                      setCurrent((c) => Math.min(steps.length - 1, c + 1));
                    }}
                  >
                    {current === steps.length - 1
                      ? "Complete Onboarding"
                      : `Continue to ${steps[current + 1]?.title}`}
                  </Button>
                </div>
              </div>
            </div>
          </Section>

        <div className="flex min-w-0 flex-col gap-5">
          <section className="card-soft ai-surface h-full rounded-2xl border p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cadf1]/15 font-bold text-[#3cadf1]">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold text-foreground">AI Onboarding Assistant</h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {isCreate
                ? "Your AI assistant will guide the new client through onboarding — answering questions, clarifying document formats, and sending automatic reminders."
                : "Your AI assistant is actively guiding this client — answering questions, clarifying document formats, and sending automatic reminders."}
            </p>

            <div className="mt-4 space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Languages className="h-3.5 w-3.5 text-[#3cadf1]" /> Preferred Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-background text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isCreate && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                <p className="font-bold text-amber-500">Detected Blocker</p>
                <p className="mt-1 text-foreground/80">
                  Main Contact postal address and ID verification are still pending — the client has not completed the upload step.
                </p>
              </div>
            )}

            <Button
              className="mt-4 w-full bg-[#3cadf1] text-xs font-semibold text-white hover:bg-[#3cadf1]/90"
              onClick={() => setConversation(true)}
            >
              <MessageSquareText className="h-4 w-4" /> View AI Chat Transcript
            </Button>
          </section>

          <AiInsight title="Assistant Summary">
            {completedSteps} of {steps.length} steps complete. Currently on {step.title}
            {isCreate ? " — complete required information to continue." : " — credit check and main contact verification are the next priorities."}
          </AiInsight>
        </div>
      </div>

      <FormDialog
        open={action === "companies-house"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Autofill with Companies House"
        description={`Import registered details for ${client?.name ?? "the new client"} from Companies House.`}
        saveLabel="Import data"
        onSave={() => toast.success("Companies House data imported")}
      >
        <div className="space-y-1.5">
          <Label>Companies House number</Label>
          <Input placeholder="e.g. 12345678" {...field("12345678")} />
        </div>
        <div className="space-y-1.5">
          <Label>Company name to match</Label>
          <Input {...field(client?.name ?? "", "Company name")} />
        </div>
      </FormDialog>

      <FormDialog
        open={action === "credit-check"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Complete credit check"
        description="Run a credit check against the main contact for this client."
        saveLabel="Run credit check"
        onSave={() => toast.success("Credit check initiated")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Contact name</Label>
            <Input {...field("James Smith", "Contact name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Date of birth</Label>
            <Input type="date" {...field("1985-06-12")} />
          </div>
          <div className="space-y-1.5">
            <Label>Postal code</Label>
            <Input {...field("SW1A 1AA", "Postal code")} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={action === "quickbooks"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Connect QuickBooks"
        description="Link this client's QuickBooks account to sync bookkeeping data."
        saveLabel="Connect account"
        onSave={() => toast.success("QuickBooks connection started")}
      >
        <div className="space-y-1.5">
          <Label>QuickBooks company name</Label>
          <Input {...field(client?.name ?? "", "QuickBooks company name")} />
        </div>
        <div className="space-y-1.5">
          <Label>QuickBooks login email</Label>
          <Input type="email" placeholder="bookkeeper@company.co.uk" />
        </div>
        <div className="space-y-1.5">
          <Label>Connection type</Label>
          <Select defaultValue="OAuth">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OAuth">OAuth (recommended)</SelectItem>
              <SelectItem value="Manual">Manual API key</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <FormDialog
        open={action === "aml-check"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Start AML check"
        description="Configure and launch AML screening for the main contact."
        saveLabel="Start AML check"
        onSave={() => toast.success("AML check started")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Contact name</Label>
            <Input defaultValue="James Smith" />
          </div>
          <div className="space-y-1.5">
            <Label>Risk level</Label>
            <Select defaultValue="Standard">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Standard", "Enhanced", "High risk"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Screening type</Label>
            <Select defaultValue="Full">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Full CDD", "Simplified", "Enhanced due diligence"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={action === "id-check"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Start ID check"
        description="Verify the main contact's identity document and address."
        saveLabel="Start ID check"
        onSave={() => toast.success("ID check started")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Document type</Label>
            <Select defaultValue="Passport">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Passport", "Driving licence", "National ID card"].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Verification method</Label>
            <Select defaultValue="Upload">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Upload document", "Video verification", "In-person"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Contact name</Label>
            <Input defaultValue="James Smith" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea rows={2} placeholder="Any additional verification notes…" />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={action === "clearance"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Request professional clearance"
        description="Send a clearance request to the client's previous accountant."
        saveLabel="Send request"
        onSave={() => toast.success("Professional clearance request sent")}
      >
        <div className="space-y-1.5">
          <Label>Previous firm name</Label>
          <Input placeholder="Previous accountant / firm name" />
        </div>
        <div className="space-y-1.5">
          <Label>Contact email</Label>
          <Input type="email" placeholder="accounts@previousfirm.co.uk" />
        </div>
        <div className="space-y-1.5">
          <Label>Message to previous accountant</Label>
          <Textarea rows={3} defaultValue="We are taking over the accounting for this client and request professional clearance and transfer of records at your earliest convenience." />
        </div>
      </FormDialog>

      <FormDialog
        open={action === "ai-chase"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Chase with AI"
        description="Send an automated reminder via WhatsApp and email to the client."
        saveLabel="Send chase"
        onSave={() => toast.success("AI chase message sent via WhatsApp & Email")}
      >
        <div className="space-y-1.5">
          <Label>Missing item</Label>
          <Input defaultValue="Main Contact postal address and ID verification" />
        </div>
        <div className="space-y-1.5">
          <Label>Preferred language</Label>
          <Select defaultValue={language}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Chase message</Label>
          <Textarea rows={3} defaultValue="Hi — we're still waiting for your postal address confirmation and photo ID upload to complete onboarding. Please use the secure link to submit these documents." />
        </div>
      </FormDialog>

      <Sheet open={conversation} onOpenChange={setConversation}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-base font-bold">
              AI Onboarding Conversation · {isCreate ? "New Client" : client!.name}
            </SheetTitle>
            <SheetDescription className="text-xs">Live assistant transcript in {language}.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 p-4">
            {[
              ["client", "Which sections do I need to complete first?"],
              [
                "ai",
                "Start with Required Information — we need your company name, client type and assigned partner. Then move to Main Contact for AML and ID checks.",
              ],
              ["client", "Do I need to connect QuickBooks now?"],
              [
                "ai",
                "QuickBooks can be linked after Required Information. It helps us sync your bookkeeping automatically once onboarding is complete.",
              ],
              ["ai", "I've flagged Main Contact address verification as the current blocker for your accountant."],
            ].map(([who, text], i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-medium leading-relaxed",
                  who === "ai"
                    ? "bg-[#3cadf1]/15 border border-[#3cadf1]/30 text-foreground"
                    : "ml-auto bg-muted text-foreground",
                )}
              >
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {who === "ai" ? "Onboarding Agent" : "Client"}
                </p>
                {text}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
