import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, FileText, Copy, MoreHorizontal, ScrollText } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDialog } from "@/components/form-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { proposalTemplates, firmProposals, clients, type ProposalStatus, type FirmProposal, type ProposalTemplate } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/proposals")({
  head: () => ({
    meta: [
      { title: "Proposals — LexaRox Accounts" },
      {
        name: "description",
        content: "Create and manage client proposals and reusable templates for service engagements.",
      },
    ],
  }),
  component: ProposalManagerPage,
});

function ProposalManagerPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("proposals");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editProposal, setEditProposal] = useState<FirmProposal | null>(null);
  const [editTemplate, setEditTemplate] = useState<ProposalTemplate | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const activeTemplates = proposalTemplates.filter((t) => t.status === "Active").length;
  const sentProposals = firmProposals.filter((p) => p.status === "Sent" || p.status === "Viewed").length;
  const acceptedProposals = firmProposals.filter((p) => p.status === "Accepted").length;

  const proposalRows = useMemo(
    () =>
      firmProposals.filter(
        (p) =>
          (statusFilter === "all" || p.status === statusFilter) &&
          (p.client.toLowerCase().includes(query.toLowerCase()) ||
            p.template.toLowerCase().includes(query.toLowerCase()) ||
            p.owner.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, statusFilter],
  );

  const templateRows = useMemo(
    () =>
      proposalTemplates.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.services.some((s) => s.toLowerCase().includes(query.toLowerCase())),
      ),
    [query],
  );

  return (
    <AppShell>
      <PageHeader
        title="Proposals"
        subtitle="Create client proposals, manage templates and track proposal status across your firm."
        actions={
          <Button
            className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> {tab === "proposals" ? "Create proposal" : "New template"}
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Proposals"
          value={String(firmProposals.length)}
          trend="Firm-wide"
          up={true}
          support="All client proposals"
          icon={<ScrollText className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Awaiting Response"
          value={String(sentProposals)}
          trend="Sent / viewed"
          up={sentProposals === 0}
          support="Pending client decision"
          icon={<FileText className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Accepted"
          value={String(acceptedProposals)}
          trend="Won"
          up={true}
          support="Client accepted proposals"
          icon={<Copy className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Active Templates"
          value={String(activeTemplates)}
          trend="Ready to use"
          up={true}
          support="Reusable proposal packs"
          icon={<FileText className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="proposals" className="text-xs sm:text-sm">
            Proposal List ({firmProposals.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm">
            Templates ({proposalTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-5">
          <div className="card-soft overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b p-3">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search proposals, clients or owners…"
                  className="h-9 border-transparent bg-muted pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {(["Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired"] as ProposalStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {proposalRows.length === 0 ? (
              <EmptyState title="No proposals found" description="Create a new proposal or adjust your search." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Client</th>
                      <th className="px-4 py-2.5 font-medium">Template</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Value</th>
                      <th className="px-4 py-2.5 font-medium">Sent</th>
                      <th className="px-4 py-2.5 font-medium">Owner</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {proposalRows.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <Link
                            to="/clients/$clientId"
                            params={{ clientId: p.clientId }}
                            className="font-medium hover:text-[#3cadf1]"
                          >
                            {p.client}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.template}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={toneForStatus(p.status)}>{p.status}</StatusBadge>
                        </td>
                        <td className="px-4 py-3 font-medium">{p.value}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.sentDate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.owner}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to="/proposals/$proposalId" params={{ proposalId: p.id }}>
                                  View details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditProposal(p)}>
                                Edit proposal
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast("Proposal history opened")}>
                                View history
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

        <TabsContent value="templates" className="mt-5">
          <div className="card-soft overflow-hidden">
            <div className="border-b p-3">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates or services…"
                  className="h-9 border-transparent bg-muted pl-9"
                />
              </div>
            </div>

            {templateRows.length === 0 ? (
              <EmptyState title="No templates found" description="Try a different search term or create a new template." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Template name</th>
                      <th className="px-4 py-2.5 font-medium">Services included</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Last used</th>
                      <th className="px-4 py-2.5 font-medium">Uses</th>
                      <th className="px-4 py-2.5 font-medium">Created by</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {templateRows.map((t) => (
                      <tr key={t.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium">{t.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <p className="max-w-xs truncate">{t.services.join(", ")}</p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={toneForStatus(t.status === "Draft" ? "Draft" : t.status)}>
                            {t.status}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{t.lastUsed}</td>
                        <td className="px-4 py-3 font-medium">{t.uses}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.createdBy}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditTemplate(t)}>Edit template</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Proposal created from "${t.name}"`)}>
                                Create proposal
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Duplicated "${t.name}"`)}>
                                Duplicate template
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
      </Tabs>

      <FormDialog
        open={!!editProposal}
        onOpenChange={(open) => !open && setEditProposal(null)}
        title={`Edit proposal · ${editProposal?.client ?? ""}`}
        description="Update proposal details before sending or re-sending to the client."
        onSave={() => toast.success(`Proposal ${editProposal?.id} updated`)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Client</Label>
            <Input defaultValue={editProposal?.client} />
          </div>
          <div className="space-y-1.5">
            <Label>Template</Label>
            <Input defaultValue={editProposal?.template} />
          </div>
          <div className="space-y-1.5">
            <Label>Value</Label>
            <Input defaultValue={editProposal?.value} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={editProposal?.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired"] as ProposalStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Owner</Label>
            <Input defaultValue={editProposal?.owner} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={!!editTemplate}
        onOpenChange={(open) => !open && setEditTemplate(null)}
        title={`Edit template · ${editTemplate?.name ?? ""}`}
        description="Update this reusable proposal template."
        onSave={() => toast.success(`Template "${editTemplate?.name}" updated`)}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Template name</Label>
            <Input defaultValue={editTemplate?.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Services included</Label>
            <Textarea rows={2} defaultValue={editTemplate?.services.join(", ")} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={editTemplate?.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Active", "Draft", "Archived"].map((s) => (
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
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={tab === "proposals" ? "Create proposal" : "New template"}
        description={
          tab === "proposals"
            ? "Create a new client proposal from a template."
            : "Create a reusable proposal template for your firm."
        }
        saveLabel={tab === "proposals" ? "Create proposal" : "Create template"}
        onSave={() => toast.success(tab === "proposals" ? "New proposal created" : "New template created")}
      >
        {tab === "proposals" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Client</Label>
              <Select defaultValue={clients[0]?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select defaultValue={proposalTemplates[0]?.id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proposalTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Proposal value</Label>
              <Input placeholder="e.g. £2,400/yr" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Owner</Label>
              <Input defaultValue="Andrea Whitfield" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Template name</Label>
              <Input placeholder="e.g. Annual accounts & tax" />
            </div>
            <div className="space-y-1.5">
              <Label>Services included</Label>
              <Textarea rows={2} placeholder="Bookkeeping, VAT returns, annual accounts…" />
            </div>
          </div>
        )}
      </FormDialog>
    </AppShell>
  );
}
