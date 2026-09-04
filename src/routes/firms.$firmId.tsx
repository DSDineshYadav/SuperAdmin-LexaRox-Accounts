import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Building2,
  Users,
  CreditCard,
  Sparkles,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  ScrollText,
  Download,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { PageBackLink } from "@/components/page-back-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  subscriberFirms,
  platformSubscriptionPlans,
  platformServiceCatalogue,
  globalTemplates,
  auditLogs,
  type SubscriberFirm,
} from "@/lib/platform-data";
import { downloadCsv } from "@/lib/export-csv";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/firms/$firmId")({
  loader: ({ params }) => {
    const firm = subscriberFirms.find((f) => f.id === params.firmId);
    if (!firm) throw notFound();
    const plan = platformSubscriptionPlans.find((p) => p.id === firm.planId);
    return { firm, plan };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.firm.name ?? "Firm"} — LexaRox Platform` },
      { name: "description", content: "Configure and manage a subscriber firm on the LexaRox platform." },
    ],
  }),
  component: FirmDetailPage,
});

function FirmDetailPage() {
  const { firm, plan: initialPlan } = Route.useLoaderData();
  const [firmStatus, setFirmStatus] = useState<SubscriberFirm["status"]>(firm.status);
  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  const [activeTab, setActiveTab] = useState("overview");
  const [enabledServices, setEnabledServices] = useState(firm.enabledServices);
  const [assignedTemplates, setAssignedTemplates] = useState(firm.assignedTemplates);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(firm.planId);
  const [notifySubject, setNotifySubject] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");

  const exportAuditLog = () => {
    downloadCsv(
      "lexarox-platform-audit-log.csv",
      ["ID", "Action", "Actor", "Target", "Timestamp", "IP"],
      auditLogs.map((log) => [log.id, log.action, log.actor, log.target, log.timestamp, log.ip]),
    );
    toast.success("Audit log exported");
  };

  const toggleService = (id: string) => {
    setEnabledServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleTemplate = (id: string) => {
    setAssignedTemplates((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const saveConfiguration = () => {
    toast.success(`Configuration saved for ${firm.name}`);
  };

  const reactivateFirm = () => {
    setFirmStatus("Active");
    toast.success(`${firm.name} reactivated`);
  };

  const changePlan = (): boolean => {
    const newPlan = platformSubscriptionPlans.find((p) => p.id === selectedPlanId);
    if (!newPlan) {
      toast.error("Select a valid plan");
      return false;
    }
    setCurrentPlan(newPlan);
    toast.success(`${firm.name} moved to ${newPlan.name}`);
    return true;
  };

  const sendNotification = (): boolean => {
    if (!notifySubject.trim() || !notifyMessage.trim()) {
      toast.error("Subject and message are required");
      return false;
    }
    toast.success(`Notification sent to ${firm.contactEmail}`);
    setNotifySubject("");
    setNotifyMessage("");
    return true;
  };

  const quickActions = [
    {
      label: "Change subscription plan",
      action: () => {
        setSelectedPlanId(currentPlan?.id ?? firm.planId);
        setPlanDialogOpen(true);
      },
    },
    {
      label: "Configure enabled services",
      action: () => setActiveTab("configuration"),
    },
    {
      label: "Send account notification",
      action: () => {
        setNotifySubject("");
        setNotifyMessage("");
        setNotifyDialogOpen(true);
      },
    },
    {
      label: "View firm audit log",
      action: () => setActiveTab("audit"),
    },
  ];

  return (
    <AppShell>
      <PageBackLink to="/firms" label="Back to firms" />

      <PageHeader
        title={firm.name}
        subtitle={`${firm.location} · Joined ${firm.joined}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={toneForStatus(firmStatus)} dot>
              {firmStatus}
            </StatusBadge>
            {firmStatus === "Suspended" && (
              <Button size="sm" onClick={reactivateFirm}>Reactivate firm</Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setImpersonateDialogOpen(true)}>
              <ExternalLink className="h-4 w-4" /> View as firm
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="End Clients" value={String(firm.clientCount)} trend={firmStatus === "Onboarding" ? "Setup pending" : "Active portfolio"} up={firm.clientCount > 0} support="Managed by firm" icon={<Users className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Staff Seats" value={String(firm.staffCount)} trend={`Plan: ${currentPlan?.seats ?? "—"} max`} up={true} support="Licensed users" icon={<Building2 className="h-5 w-5" />} variant="green" />
        <KpiCard label="Monthly Revenue" value={firm.mrr} trend={currentPlan?.name ?? firm.plan} up={firmStatus !== "Suspended"} support="Platform subscription" icon={<CreditCard className="h-5 w-5" />} variant="purple" />
        <KpiCard label="AI Actions (30d)" value={firm.aiActions30d.toLocaleString()} trend="Platform usage" up={firm.aiActions30d > 0} support="Automation volume" icon={<Sparkles className="h-5 w-5" />} variant="amber" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Section title="Firm details">
              <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
                <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Primary contact</dt><dd className="mt-1 text-sm font-semibold">{firm.contactName}</dd></div>
                <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 text-sm">{firm.contactEmail}</dd></div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Location</dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{firm.location}</dd>
                </div>
                {firm.companiesHouse && <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Companies House</dt><dd className="mt-1 text-sm">{firm.companiesHouse}</dd></div>}
                <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Last activity</dt><dd className="mt-1 text-sm">{firm.lastActivity}</dd></div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Joined platform</dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{firm.joined}</dd>
                </div>
              </dl>
            </Section>

            <Section title="Quick actions">
              <ul className="divide-y">
                {quickActions.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40 sm:px-5"
                    >
                      {item.label}
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-5">
          <Section title="Current plan" description={`${currentPlan?.name ?? firm.plan} · ${firm.mrr}/month`}>
            {currentPlan ? (
              <>
                <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
                  <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt><dd className="mt-1 text-sm font-semibold">{currentPlan.name}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Billing</dt><dd className="mt-1 text-sm">{currentPlan.price} / {currentPlan.billingPeriod.toLowerCase()}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Client limit</dt><dd className="mt-1 text-sm">{firm.clientCount} / {currentPlan.clients}</dd></div>
                  <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Seat limit</dt><dd className="mt-1 text-sm">{firm.staffCount} / {currentPlan.seats}</dd></div>
                </dl>
                <div className="border-t px-4 py-3 sm:px-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Included features</p>
                  <ul className="flex flex-wrap gap-2">
                    {currentPlan.features.map((f) => (
                      <li key={f}><StatusBadge tone="info">{f}</StatusBadge></li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 border-t px-4 py-3 sm:px-5">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedPlanId(currentPlan.id); setPlanDialogOpen(true); }}>Change plan</Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/subscriptions">Manage in Subscription Management</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="p-4 text-sm text-muted-foreground sm:px-5">Plan details unavailable.</p>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="configuration" className="mt-5 space-y-5">
          <Section title="Enabled services" description="Select which platform catalogue services this firm offers to their end clients">
            <ul className="divide-y">
              {platformServiceCatalogue.filter((s) => s.status === "Active").map((service) => (
                <li key={service.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.category} · {service.defaultPrice}</p>
                  </div>
                  <Switch checked={enabledServices.includes(service.id)} onCheckedChange={() => toggleService(service.id)} />
                </li>
              ))}
            </ul>
            <div className="border-t px-4 py-2 sm:px-5">
              <p className="text-xs text-muted-foreground">
                {enabledServices.length} of {platformServiceCatalogue.filter((s) => s.status === "Active").length} active catalogue services enabled
              </p>
            </div>
          </Section>

          <Section title="Assigned templates" description="Global email and proposal templates available to this firm">
            <ul className="divide-y">
              {globalTemplates.filter((t) => t.status === "Active").map((template) => (
                <li key={template.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.type} · {template.category}</p>
                  </div>
                  <Switch checked={assignedTemplates.includes(template.id)} onCheckedChange={() => toggleTemplate(template.id)} />
                </li>
              ))}
            </ul>
          </Section>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={saveConfiguration}>Save configuration</Button>
            <Button size="sm" variant="outline" asChild><Link to="/services">Manage platform catalogue</Link></Button>
            <Button size="sm" variant="outline" asChild><Link to="/templates">Manage global templates</Link></Button>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-5">
          <Section title="Consolidated audit logs" description="Platform-wide administrative actions">
            <ul className="divide-y">
              {auditLogs.map((log) => (
                <li key={log.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        <ScrollText className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                        {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.actor} · {log.target}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <p>{log.timestamp}</p>
                      <p className="font-mono">{log.ip}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t px-4 py-3 sm:px-5">
              <Button size="sm" variant="outline" onClick={exportAuditLog}>
                <Download className="h-4 w-4" /> Export full audit log
              </Button>
            </div>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        title="Change subscription plan"
        description={`Select a new plan for ${firm.name}.`}
        saveLabel="Update plan"
        onSave={changePlan}
      >
        <PlatformFormField label="Subscription plan" htmlFor="firm-plan">
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger id="firm-plan"><SelectValue /></SelectTrigger>
            <SelectContent>
              {platformSubscriptionPlans.filter((p) => p.status === "Active").map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name} — {p.price}/{p.billingPeriod === "Monthly" ? "mo" : "yr"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PlatformFormField>
      </FormDialog>

      <FormDialog
        open={notifyDialogOpen}
        onOpenChange={setNotifyDialogOpen}
        title="Send account notification"
        description={`Email will be sent to ${firm.contactEmail} (${firm.contactName}).`}
        saveLabel="Send notification"
        onSave={sendNotification}
        size="lg"
      >
        <PlatformFormField label="Subject" htmlFor="notify-subject">
          <Input id="notify-subject" value={notifySubject} onChange={(e) => setNotifySubject(e.target.value)} placeholder="Important account update" />
        </PlatformFormField>
        <PlatformFormField label="Message" htmlFor="notify-message">
          <Textarea id="notify-message" rows={5} value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} placeholder="Write your message to the firm administrator…" />
        </PlatformFormField>
      </FormDialog>

      <FormDialog
        open={impersonateDialogOpen}
        onOpenChange={setImpersonateDialogOpen}
        title="View as firm"
        description={`Open ${firm.name}'s firm portal in read-only impersonation mode.`}
        saveLabel="Start impersonation"
        onSave={() => {
          toast.success(`Impersonation session started for ${firm.name} (prototype)`);
          return true;
        }}
      >
        <p className="text-sm text-muted-foreground">
          You will be logged in as a platform admin viewing <strong>{firm.name}</strong>. All actions are read-only and logged.
        </p>
      </FormDialog>
    </AppShell>
  );
}
