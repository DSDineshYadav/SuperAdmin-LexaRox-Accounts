import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Activity, Clock, ArrowRight, ShieldCheck, Zap, Bot, CheckCircle2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { agents, aiActivity } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai-workspace")({
  head: () => ({
    meta: [
      { title: "AI Workspace — LexaRox Accounts" },
      {
        name: "description",
        content:
          "The AI command centre for accountancy: agents, live activity and the intelligent operations layer.",
      },
      { property: "og:title", content: "AI Workspace — LexaRox Accounts" },
      { property: "og:description", content: "Your intelligent operations layer for accountancy." },
    ],
  }),
  component: AiWorkspace,
});

function AiWorkspace() {
  return (
    <AppShell>
      <PageHeader
        title="AI Command Centre"
        subtitle="Autonomous agents, document intelligence & exception queues for your accounting practice."
        actions={
          <Button asChild className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold">
            <Link to="/ai-review">
              <ShieldCheck className="h-4 w-4" /> Open Review Queue
            </Link>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="AI Actions Completed"
          value="126"
          trend="+18 today"
          up={true}
          support="Auto-processed workflows"
          icon={<Zap className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Pending Exception Queue"
          value="18"
          trend="Review Req."
          up={false}
          support="Requires human validation"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Auto-Acceptance Rate"
          value="94%"
          trend="+2.1%"
          up={true}
          support="High confidence accuracy"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Manual Hours Saved"
          value="31 hrs"
          trend="This week"
          up={true}
          support="Estimated staff capacity gain"
          icon={<Bot className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Autonomous AI Agents</h2>
        <span className="text-xs font-semibold text-muted-foreground">{agents.length} Agents active</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <article key={a.id} className="card-soft card-hover flex flex-col gap-3 p-5 transition-all">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#3cadf1]/15 text-[#3cadf1] font-bold shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-foreground">{a.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                  a.status === "Active" && "bg-emerald-500/15 text-emerald-500",
                  a.status === "Awaiting approval" && "bg-amber-500/15 text-amber-500",
                  a.status === "Paused" && "bg-muted text-muted-foreground",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {a.status}
              </span>
            </div>

            <p className="text-xs font-bold text-foreground/80">{a.completed}</p>

            <div className="space-y-1.5 rounded-xl border border-border/50 bg-muted/40 p-3 text-xs">
              <p className="flex items-start gap-2 font-medium text-foreground">
                <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3cadf1]" /> {a.current}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" /> Last execution: {a.lastRun}
              </p>
            </div>

            <div className="mt-auto flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast(`${a.name} activity log opened`)}>
                View Activity Log
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => toast.success(`${a.name} ${a.status === "Paused" ? "resumed" : "paused"}`)}
              >
                {a.status === "Paused" ? "Resume" : "Pause"}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Section
          title="Live Agent Execution Stream"
          description="Real-time timeline of AI actions processed across your practice"
          actions={
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-[#3cadf1]">
              <Link to="/ai-review">
                Review Queue <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {aiActivity.map((a, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#3cadf1]" />
                    <p className="text-xs font-extrabold text-[#3cadf1]">{a.agent}</p>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">{a.action}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-muted-foreground sm:inline">{a.time}</span>
                  <StatusBadge tone={toneForStatus(a.status)}>{a.status}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </AppShell>
  );
}
