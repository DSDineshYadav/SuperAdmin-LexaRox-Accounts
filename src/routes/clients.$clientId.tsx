import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, Sparkles, Building2, CalendarDays, Pencil, Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { AiWritingTools } from "@/components/ai-writing-tools";
import { AskAiButton } from "@/components/app-chatbot";
import { DocumentsLibraryPanel } from "@/components/documents-library-panel";
import { AiInsight, ProgressBar, Section, StatusBadge, PriorityBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormDialog } from "@/components/form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clients, clientAmlRecords, clientDetailDocuments, clientDetailDocToDocItem, clientServices, tasks, type ClientService } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/clients/$clientId")({
  loader: ({ params }) => {
    const client = clients.find((c) => c.id === params.clientId);
    if (!client) throw notFound();
    return { client };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Client not found — LexaRox" }, { name: "robots", content: "noindex" }] };
    }
    const n = loaderData.client.name;
    return {
      meta: [
        { title: `${n} — Client · LexaRox Accounts` },
        { name: "description", content: `Onboarding, documents, tasks and AI insights for ${n}.` },
        { property: "og:title", content: `${n} — LexaRox Accounts` },
        { property: "og:description", content: `Client workspace and AI insights for ${n}.` },
      ],
    };
  },
  component: ClientDetail,
});

const checklist = [
  { label: "Business details completed", state: "done" },
  { label: "Director details completed", state: "done" },
  { label: "Identification uploaded", state: "done" },
  { label: "Bank statement missing", state: "warn" },
  { label: "Final verification", state: "todo" },
] as const;

function ClientDetail() {
  const { client } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const [editService, setEditService] = useState<ClientService | null>(null);
  const [editAmlOpen, setEditAmlOpen] = useState(false);
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const clientDocs = useMemo(
    () => clientDetailDocuments.filter((d) => d.client === client.name).map(clientDetailDocToDocItem),
    [client.name],
  );
  const clientTasks = tasks.filter((t) => t.client === client.name);
  const services = clientServices.filter((s) => s.client === client.name);
  const amlRecord =
    clientAmlRecords.find((r) => r.clientId === client.id) ?? {
      status: "Pending" as const,
      cddStatus: "Not started" as const,
      riskRating: "Low" as const,
      idVerification: "Not yet verified",
      amlAssessment: "Not yet completed",
      pepSanctions: "Not yet screened",
      lastReview: "—",
      nextReviewDue: "—",
      owner: client.manager,
      notes: "AML checks have not been started for this client.",
    };

  const tabs = [
    "Overview",
    "Services",
    "Documents",
    "AML",
    "Tasks",
    "Communications",
    "Activity",
  ] as const;

  return (
    <AppShell>
      <PageBackLink to="/clients" label="Back to Manage Clients" />
      <PageHeader
        title={client.name}
        subtitle={`${client.type} · Year end ${client.yearEnd} · Last activity ${client.lastActivity}`}
        actions={
          <>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Pencil className="h-4 w-4" /> Edit client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit client</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Client name</Label>
                    <Input defaultValue={client.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input defaultValue={client.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input defaultValue={client.phone} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account manager</Label>
                    <Input defaultValue={client.manager} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setEditOpen(false);
                      toast.success("Client updated");
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => toast("Opening WhatsApp thread")}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
            <Button variant="outline" onClick={() => toast("Dialling via click-to-call")}>
              <Phone className="h-4 w-4" /> Call
            </Button>
            <Button asChild>
              <Link to="/clients/onboarding" search={{ status: client.status, clientId: client.id, mode: "edit" }}>
                Continue onboarding
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile label="Status" value={<StatusBadge tone={toneForStatus(client.status)}>{client.status}</StatusBadge>} />
        <InfoTile label="Account manager" value={client.manager} />
        <InfoTile label="Contact" value={client.email} sub={client.phone} />
        <InfoTile
          label="Onboarding progress"
          value={`${client.progress}%`}
          extra={<ProgressBar value={client.progress} />}
        />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t.toLowerCase().replace(" ", "-")} className="text-xs sm:text-sm">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Section title="Client information">
              <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
                <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Entity type" value={client.type} />
                <Field icon={<CalendarDays className="h-3.5 w-3.5" />} label="Year end" value={client.yearEnd} />
                <Field label="UTR" value={client.utr} />
                <Field label="Preferred language" value={client.language} />
                <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={client.email} />
                <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={client.phone} />
              </dl>
            </Section>

            <Section title="Pending items" description="Blocking onboarding completion">
              <ul className="divide-y">
                {checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 px-4 py-3 text-sm sm:px-5">
                    <span
                      className={
                        c.state === "done"
                          ? "text-[var(--success)]"
                          : c.state === "warn"
                            ? "text-[var(--warning)]"
                            : "text-muted-foreground"
                      }
                    >
                      {c.state === "done" ? "✓" : c.state === "warn" ? "⚠" : "○"}
                    </span>
                    <span className={c.state === "done" ? "text-muted-foreground line-through" : ""}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Upcoming tasks" description={`${clientTasks.length} open items`}>
              <ul className="divide-y">
                {clientTasks.length === 0 && (
                  <li className="px-4 py-6 text-sm text-muted-foreground sm:px-5">No open tasks.</li>
                )}
                {clientTasks.map((t) => (
                  <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.assignee} · due {t.due} · source {t.source}
                      </p>
                    </div>
                    <PriorityBadge priority={t.priority} />
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="space-y-5">
            <AiInsight
              actions={
                <>
                  <Button size="sm" asChild>
                    <Link to="/ai-review">Review</Link>
                  </Button>
                  <AskAiButton
                    size="sm"
                    variant="outline"
                    draft={`What should I know about ${client.name}'s onboarding and missing documents?`}
                  />
                </>
              }
            >
              3 documents appear to be missing from this client's onboarding, and the last bank statement
              covers only part of the period.
            </AiInsight>

            <Section title="Recent activity">
              <ul className="divide-y text-sm">
                {[
                  ["AI categorised 6 uploaded files", "12 min ago"],
                  ["Onboarding step 3 completed by client", "2 hrs ago"],
                  ["Email sent: document request", "Yesterday"],
                  ["Client record created", "6 days ago"],
                ].map(([a, t]) => (
                  <li key={a} className="px-4 py-3 sm:px-5">
                    <p>{a}</p>
                    <p className="text-xs text-muted-foreground">{t}</p>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-5">
          <Section title="Subscribed services" description={`${services.filter((s) => s.status === "Active").length} active services`}>
            <ul className="divide-y">
              {services.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground sm:px-5">No services configured yet.</li>
              )}
              {services.map((s) => (
                <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.billing} · next due {s.nextDue} · {s.manager}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStatus(s.status === "Pending" ? "Awaiting Documents" : s.status)}>
                    {s.status}
                  </StatusBadge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditService(s)}
                  >
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <DocumentsLibraryPanel
            documents={clientDocs}
            showClientColumn={false}
            searchPlaceholder="Search documents…"
            showUploadButton
            onUpload={() => toast.success(`Upload queued for ${client.name} — Document Agent OCR engine initiated`)}
          />
        </TabsContent>

        <TabsContent value="aml" className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Section
              title="AML & compliance status"
              actions={
                <Button size="sm" variant="outline" onClick={() => setEditAmlOpen(true)}>
                  Edit
                </Button>
              }
            >
              <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
                <Field label="AML status" value={amlRecord.status} />
                <Field label="CDD status" value={amlRecord.cddStatus} />
                <Field label="Risk rating" value={amlRecord.riskRating} />
                <Field label="ID verification" value={amlRecord.idVerification} />
                <Field label="AML risk assessment" value={amlRecord.amlAssessment} />
                <Field label="PEP & sanctions" value={amlRecord.pepSanctions} />
                <Field label="Last review" value={amlRecord.lastReview} />
                <Field label="Next review due" value={amlRecord.nextReviewDue} />
              </dl>
            </Section>

            <Section title="Compliance notes">
              <p className="px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:px-5">{amlRecord.notes}</p>
            </Section>
          </div>

          <div className="space-y-5">
            <AiInsight
              actions={
                <>
                  <Button size="sm" asChild>
                    <Link to="/ai-review">Review</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditAmlOpen(true)}>
                    Open checklist
                  </Button>
                </>
              }
            >
              {amlRecord.cddStatus === "Complete"
                ? "All AML checks are complete. Next scheduled review is on track."
                : "Bank statement for October 2025 is still missing — this is blocking final CDD sign-off for this client."}
            </AiInsight>

            <Section title="AML activity">
              <ul className="divide-y text-sm">
                {[
                  ["Director passport verified", "Document Agent", "12 Aug 2026"],
                  ["AML risk assessment completed", "Andrea Whitfield", "12 Aug 2026"],
                  ["PEP & sanctions screening run", "Compliance workflow", "12 Aug 2026"],
                  ["Proof of address uploaded", "Client portal", "7 Aug 2026"],
                ].map(([a, s, t]) => (
                  <li key={a} className="px-4 py-3 sm:px-5">
                    <p>{a}</p>
                    <p className="text-xs text-muted-foreground">
                      {s} · {t}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-5">
          <Section
            title="Tasks"
            actions={
              <Button size="sm" className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold" asChild>
                <Link to="/clients/onboarding" search={{ status: client.status, clientId: client.id, mode: "edit" }}>
                  <Plus className="h-3.5 w-3.5" /> Add Client
                </Link>
              </Button>
            }
          >
            <ul className="divide-y">
              {clientTasks.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <Link
                      to="/tasks/$taskId"
                      params={{ taskId: t.id }}
                      className="truncate text-sm font-medium hover:text-[#3cadf1]"
                    >
                      {t.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {t.assignee} · {t.status} · due {t.due}
                    </p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="communications" className="mt-5 space-y-5">
          <AiWritingTools />
          <Section title="Communications">
            <div className="space-y-3 p-4 sm:px-5">
              <div className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="ai" dot>
                    Email prepared by AI
                  </StatusBadge>
                  <span className="text-xs text-muted-foreground">26 min ago</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  "Your annual accounts are ready for review. We've attached the draft financial statements
                  and a short summary of the key figures…"
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success("Email approved and sent")}>
                    Approve &amp; Send
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditEmailOpen(true)}>
                    Edit
                  </Button>
                  <AiWritingTools compact />
                </div>
              </div>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <Section title="Full activity log">
            <ul className="divide-y text-sm">
              {[
                ["AI categorised 6 uploaded files", "Document Agent", "12 min ago"],
                ["Onboarding step 3 completed", "Client portal", "2 hrs ago"],
                ["Document request email sent", "Communication Agent", "Yesterday"],
                ["Identity document verified", "Document Agent", "3 days ago"],
                ["Client record created", "Andrea Whitfield", "6 days ago"],
              ].map(([a, s, t]) => (
                <li key={a} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate">{a}</p>
                    <p className="text-xs text-muted-foreground">{s}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={!!editService}
        onOpenChange={(open) => !open && setEditService(null)}
        title={`Edit service · ${editService?.name ?? ""}`}
        description="Update service assignment and billing details for this client."
        onSave={() => toast.success(`${editService?.name} updated`)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Service name</Label>
            <Input defaultValue={editService?.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Billing</Label>
            <Input defaultValue={editService?.billing} />
          </div>
          <div className="space-y-1.5">
            <Label>Next due</Label>
            <Input defaultValue={editService?.nextDue} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={editService?.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Active", "Pending", "Paused"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Manager</Label>
            <Input defaultValue={editService?.manager} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editAmlOpen}
        onOpenChange={setEditAmlOpen}
        title="Edit AML record"
        description={`Update AML and compliance details for ${client.name}.`}
        onSave={() => toast.success("AML record updated")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>AML status</Label>
            <Select defaultValue={amlRecord.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Pending", "In progress", "Completed", "Review required"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Risk rating</Label>
            <Select defaultValue={amlRecord.riskRating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Compliance notes</Label>
            <Textarea rows={3} defaultValue={amlRecord.notes} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editEmailOpen}
        onOpenChange={setEditEmailOpen}
        title="Edit email draft"
        description="Review and edit the AI-prepared email before sending."
        saveLabel="Save draft"
        onSave={() => toast.success("Email draft saved")}
        size="lg"
      >
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input defaultValue="Your annual accounts are ready for review" />
        </div>
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea
            rows={5}
            defaultValue={`Your annual accounts are ready for review. We've attached the draft financial statements and a short summary of the key figures ahead of the filing deadline.`}
          />
        </div>
      </FormDialog>
    </AppShell>
  );
}

function InfoTile({
  label,
  value,
  sub,
  extra,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="card-soft p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 truncate text-sm font-medium">{value}</div>
      {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      {extra && <div className="mt-3">{extra}</div>}
    </div>
  );
}

function Field({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm">{value}</dd>
    </div>
  );
}
