import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  ListChecks,
  ScrollText,
  BarChart3,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  documents,
  oversightFirmMetrics,
  oversightProposals,
  oversightWorkflows,
  tasks,
} from "@/lib/data";

export const Route = createFileRoute("/oversight")({
  head: () => ({
    meta: [
      { title: "Oversight — LexaRox Accounts" },
      {
        name: "description",
        content: "Firm-level oversight — documents, workflows, proposal status and reporting across your practice.",
      },
    ],
  }),
  component: OversightPage,
});

function OversightPage() {
  const reviewDocs = documents.filter((d) => d.ai === "Needs Review").length;
  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const pendingProposals = oversightProposals.filter((p) => p.status === "Sent" || p.status === "Draft").length;

  return (
    <AppShell>
      <PageHeader
        title="Oversight"
        subtitle="Documents, workflows & tasks, proposal status and firm-level reporting — a single view across your practice."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {oversightFirmMetrics.map((m, i) => (
          <KpiCard
            key={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            up={!m.trend.includes("blocked") && !m.trend.includes("overdue")}
            support="Firm-wide · last 30 days"
            icon={
              i === 0 ? (
                <FileText className="h-5 w-5" />
              ) : i === 1 ? (
                <ListChecks className="h-5 w-5" />
              ) : i === 2 ? (
                <ScrollText className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )
            }
            variant={(["cyan", "green", "purple", "amber"] as const)[i]}
          />
        ))}
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="documents" className="gap-1.5 text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5" /> Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" className="gap-1.5 text-xs sm:text-sm">
            <ListChecks className="h-3.5 w-3.5" /> Workflows & Tasks ({openTasks})
          </TabsTrigger>
          <TabsTrigger value="proposals" className="gap-1.5 text-xs sm:text-sm">
            <ScrollText className="h-3.5 w-3.5" /> Proposals ({pendingProposals})
          </TabsTrigger>
          <TabsTrigger value="reporting" className="gap-1.5 text-xs sm:text-sm">
            <BarChart3 className="h-3.5 w-3.5" /> Firm Reporting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-5">
          <Section
            title="Document oversight"
            description={`${reviewDocs} documents need review · ${documents.length} total in firm library`}
            actions={
              <Button size="sm" variant="outline" asChild>
                <Link to="/clients">Open manage clients</Link>
              </Button>
            }
          >
            <ul className="divide-y">
              {documents.slice(0, 6).map((d) => (
                <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.client} · {d.category} · {d.uploaded}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStatus(d.ai)}>{d.ai}</StatusBadge>
                  <span className="text-xs text-muted-foreground">{d.verified}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="workflows" className="mt-5 space-y-5">
          <Section title="Active workflows" description="Firm-wide workflow pipelines and task queues">
            <ul className="divide-y">
              {oversightWorkflows.map((w) => (
                <li key={w.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-4 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="text-xs text-muted-foreground">Owner: {w.owner}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#3cadf1]">{w.active} active</span>
                  <span className="text-xs font-semibold text-amber-600">{w.blocked} blocked</span>
                  <span className="text-xs text-muted-foreground">{w.completed} completed</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Open tasks requiring attention"
            description={`${openTasks} open work items across the firm`}
            actions={
              <Button size="sm" variant="outline" asChild>
                <Link to="/tasks">Open task management</Link>
              </Button>
            }
          >
            <ul className="divide-y">
              {tasks
                .filter((t) => t.status !== "Completed")
                .slice(0, 5)
                .map((t) => (
                  <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.client} · {t.assignee} · due {t.due}
                      </p>
                    </div>
                    <StatusBadge tone={toneForStatus(t.status)}>{t.status}</StatusBadge>
                  </li>
                ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="proposals" className="mt-5">
          <Section
            title="Proposal status tracker"
            description="Track proposals sent, accepted and pending across your client portfolio"
            actions={
              <Button size="sm" variant="outline" asChild>
                <Link to="/proposals">Open proposal manager</Link>
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Client</th>
                    <th className="px-4 py-2.5 font-medium">Template</th>
                    <th className="px-4 py-2.5 font-medium">Value</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Sent</th>
                    <th className="px-4 py-2.5 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {oversightProposals.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{p.client}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.template}</td>
                      <td className="px-4 py-3 font-semibold">{p.value}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={toneForStatus(p.status === "Sent" ? "Awaiting Documents" : p.status)}>
                          {p.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.sentDate}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="reporting" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Section title="Firm performance snapshot">
            <ul className="divide-y text-sm">
              {[
                ["Client portfolio", "128 active accounts", "+14% vs last quarter"],
                ["Onboarding completion rate", "72% average", "3 clients blocked on documents"],
                ["Proposal conversion", "58% accepted", "6 proposals pending response"],
                ["Document processing", "842 files (30d)", "98.4% automated"],
                ["Staff utilisation", "66% average", "Priya Raman at 91% capacity"],
              ].map(([label, value, note]) => (
                <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3 sm:px-5">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{note}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#3cadf1]">{value}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Exception queue summary">
            <ul className="divide-y text-sm">
              {[
                ["Documents needing review", String(reviewDocs), "/clients"],
                ["AI review exceptions", "18 items", "/ai-review"],
                ["Overdue tasks", "3 items", "/tasks"],
                ["AML reviews due", "2 clients", "/clients"],
              ].map(([label, value, href]) => (
                <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="font-medium">{label}</span>
                  <span className="font-semibold">{value}</span>
                  <Button size="sm" variant="ghost" className="text-xs" asChild>
                    <Link to={href}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
            <div className="border-t px-4 py-3 sm:px-5">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-[#50b546]" />
                Firm-level reporting refreshes every 15 minutes
                <Sparkles className="h-3.5 w-3.5 text-[var(--ai)]" />
              </p>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
