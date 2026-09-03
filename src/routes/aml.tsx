import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormDialog } from "@/components/form-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientAmlRecords, amlRequiredChecklist, amlFollowUps, type AmlStatus, type ClientAmlRecord } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/aml")({
  head: () => ({
    meta: [
      { title: "AML / Compliance — LexaRox Accounts" },
      {
        name: "description",
        content: "Anti-money laundering compliance — due diligence, verification, reviews and follow-ups across your client portfolio.",
      },
    ],
  }),
  component: AmlManagementPage,
});

const AML_STATUSES: AmlStatus[] = [
  "Pending",
  "In Progress",
  "Under Review",
  "Completed",
  "Follow-up Required",
  "Review Due",
];

type AmlAction =
  | { type: "due-diligence"; record: ClientAmlRecord }
  | { type: "verification"; record: ClientAmlRecord }
  | { type: "follow-up"; client: string }
  | { type: "periodic-review"; client: string }
  | { type: "send-follow-up"; client: string; followType: string };

function AmlManagementPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [action, setAction] = useState<AmlAction | null>(null);

  const pending = clientAmlRecords.filter((r) => r.status === "Pending").length;
  const inProgress = clientAmlRecords.filter((r) => r.status === "In Progress" || r.status === "Under Review").length;
  const reviewDue = clientAmlRecords.filter((r) => r.status === "Review Due" || r.status === "Follow-up Required").length;
  const completed = clientAmlRecords.filter((r) => r.status === "Completed").length;

  const rows = useMemo(
    () =>
      clientAmlRecords.filter(
        (r) =>
          (statusFilter === "all" || r.status === statusFilter) &&
          (r.client.toLowerCase().includes(query.toLowerCase()) ||
            r.owner.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, statusFilter],
  );

  return (
    <AppShell>
      <PageHeader
        title="AML / Compliance"
        subtitle="Due diligence, verification, periodic reviews and follow-ups across your client portfolio."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Pending"
          value={String(pending)}
          trend="Not started"
          up={pending === 0}
          support="Awaiting initial checks"
          icon={<Clock className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="In Progress"
          value={String(inProgress)}
          trend="Active checks"
          up={true}
          support="CDD & verification underway"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Review / Follow-up"
          value={String(reviewDue)}
          trend="Needs attention"
          up={reviewDue === 0}
          support="Periodic or overdue reviews"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="Completed"
          value={String(completed)}
          trend="Compliant"
          up={true}
          support="All checks passed"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="clients" className="text-xs sm:text-sm">
            AML Client List ({clientAmlRecords.length})
          </TabsTrigger>
          <TabsTrigger value="due-diligence" className="text-xs sm:text-sm">
            Due Diligence
          </TabsTrigger>
          <TabsTrigger value="follow-ups" className="text-xs sm:text-sm">
            Follow-ups ({amlFollowUps.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">
            Activity History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-5">
          <div className="card-soft overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b p-3">
              <div className="relative min-w-0 flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by client or owner…"
                  className="h-9 border-transparent bg-muted pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {AML_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rows.length === 0 ? (
              <EmptyState title="No AML records found" description="Try adjusting your search or filters." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Client</th>
                      <th className="px-4 py-2.5 font-medium">AML Status</th>
                      <th className="px-4 py-2.5 font-medium">Risk Rating</th>
                      <th className="px-4 py-2.5 font-medium">CDD Status</th>
                      <th className="px-4 py-2.5 font-medium">Next Review</th>
                      <th className="px-4 py-2.5 font-medium">Owner</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <Link
                            to="/clients/$clientId"
                            params={{ clientId: r.clientId }}
                            className="font-medium hover:text-[#3cadf1]"
                          >
                            {r.client}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={toneForStatus(r.status)} dot>
                            {r.status}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            tone={r.riskRating === "High" ? "danger" : r.riskRating === "Medium" ? "warning" : "success"}
                          >
                            {r.riskRating}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.cddStatus}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.nextReviewDue}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.owner}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to="/clients/$clientId" params={{ clientId: r.clientId }}>
                                  View client AML
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setAction({ type: "due-diligence", record: r })}>
                                Start due diligence
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setAction({ type: "verification", record: r })}>
                                Verification / review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setAction({ type: "follow-up", client: r.client })}>
                                Schedule follow-up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="due-diligence" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Section title="Required information & documents" description="Standard AML due diligence checklist">
            <ul className="divide-y">
              {amlRequiredChecklist.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 sm:px-5">
                  <span className="text-sm">{item.label}</span>
                  <StatusBadge tone={item.required ? "warning" : "neutral"}>
                    {item.required ? "Required" : "Optional"}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Verification & review" description="Clients pending verification sign-off">
            <ul className="divide-y">
              {clientAmlRecords
                .filter((r) => r.status !== "Completed")
                .map((r) => (
                  <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <Link
                        to="/clients/$clientId"
                        params={{ clientId: r.clientId }}
                        className="text-sm font-medium hover:text-[#3cadf1]"
                      >
                        {r.client}
                      </Link>
                      <p className="text-xs text-muted-foreground">{r.idVerification}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setAction({ type: "verification", record: r })}>
                      Review
                    </Button>
                  </li>
                ))}
            </ul>
          </Section>
          <Section title="Periodic AML review" description="Scheduled and overdue reviews" className="lg:col-span-2">
            <ul className="divide-y">
              {clientAmlRecords.map((r) => (
                <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.client}</p>
                    <p className="text-xs text-muted-foreground">
                      Last review {r.lastReview} · Next due {r.nextReviewDue}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStatus(r.status)}>{r.status}</StatusBadge>
                  <Button size="sm" variant="outline" onClick={() => setAction({ type: "periodic-review", client: r.client })}>
                    Schedule review
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="follow-ups" className="mt-5">
          <Section title="AML follow-ups" description="Scheduled and overdue client follow-up actions">
            <ul className="divide-y">
              {amlFollowUps.map((f) => (
                <li key={f.client + f.type} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.type} · {f.owner} · due {f.due}
                    </p>
                  </div>
                  <StatusBadge tone={f.status === "Overdue" ? "danger" : "warning"}>{f.status}</StatusBadge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAction({ type: "send-follow-up", client: f.client, followType: f.type })}
                  >
                    Send follow-up
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <Section title="AML Activity History" description="Recent compliance actions across all clients">
            <ul className="divide-y text-sm">
              {[
                ["ABC Ltd — Annual review overdue", "Review Due flagged", "Daniel Okoye", "Today"],
                ["Sahar Textiles — Follow-up sent", "Source of funds requested", "Daniel Okoye", "28 Aug 2026"],
                ["Brightside Consulting — ID verified", "Director passport verified", "Document Agent", "12 Aug 2026"],
                ["XYZ Trading — Enhanced CDD started", "Unusual payments flagged", "Priya Raman", "1 Aug 2026"],
                ["Northgate Partners — Review completed", "Periodic AML review passed", "Andrea Whitfield", "15 Jan 2026"],
              ].map(([client, action, by, date]) => (
                <li key={client} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="font-medium">{client}</p>
                    <p className="text-xs text-muted-foreground">
                      {action} · {by}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={action?.type === "due-diligence"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Start due diligence · ${action?.type === "due-diligence" ? action.record.client : ""}`}
        description="Begin AML due diligence checklist for this client."
        saveLabel="Start due diligence"
        onSave={() => toast.success("Due diligence started")}
      >
        <div className="space-y-1.5">
          <Label>Client</Label>
          <Input defaultValue={action?.type === "due-diligence" ? action.record.client : ""} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>Checklist focus</Label>
          <Select defaultValue="Full CDD">
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
        <div className="space-y-1.5">
          <Label>Notes</Label>
          <Textarea rows={3} placeholder="Any initial due diligence notes…" />
        </div>
      </FormDialog>

      <FormDialog
        open={action?.type === "verification"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Verification review · ${action?.type === "verification" ? action.record.client : ""}`}
        description="Review and sign off client identity verification."
        saveLabel="Save review"
        onSave={() => toast.success("Verification review saved")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>ID verification</Label>
            <Input defaultValue={action?.type === "verification" ? action.record.idVerification : ""} />
          </div>
          <div className="space-y-1.5">
            <Label>CDD status</Label>
            <Input defaultValue={action?.type === "verification" ? action.record.cddStatus : ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Review notes</Label>
            <Textarea rows={3} placeholder="Verification review notes…" />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={action?.type === "follow-up"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Schedule follow-up · ${action?.type === "follow-up" ? action.client : ""}`}
        description="Schedule an AML follow-up action for this client."
        saveLabel="Schedule follow-up"
        onSave={() => toast.success("Follow-up scheduled")}
      >
        <div className="space-y-1.5">
          <Label>Follow-up type</Label>
          <Select defaultValue="Document request">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Document request", "Source of funds", "Periodic review", "Enhanced CDD"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Due date</Label>
          <Input type="date" />
        </div>
      </FormDialog>

      <FormDialog
        open={action?.type === "periodic-review"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Schedule periodic review · ${action?.type === "periodic-review" ? action.client : ""}`}
        saveLabel="Schedule review"
        onSave={() => toast.success("Periodic review scheduled")}
      >
        <div className="space-y-1.5">
          <Label>Review date</Label>
          <Input type="date" />
        </div>
        <div className="space-y-1.5">
          <Label>Assigned reviewer</Label>
          <Input defaultValue="Andrea Whitfield" />
        </div>
      </FormDialog>

      <FormDialog
        open={action?.type === "send-follow-up"}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Send follow-up · ${action?.type === "send-follow-up" ? action.client : ""}`}
        saveLabel="Send follow-up"
        onSave={() => toast.success("Follow-up sent")}
      >
        <div className="space-y-1.5">
          <Label>Follow-up type</Label>
          <Input defaultValue={action?.type === "send-follow-up" ? action.followType : ""} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>Message to client</Label>
          <Textarea rows={4} placeholder="Write the follow-up message…" />
        </div>
      </FormDialog>
    </AppShell>
  );
}
