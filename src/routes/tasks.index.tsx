import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Sparkles,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Users,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, PriorityBadge, ProgressBar, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasks, teamMembers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks/")({
  head: () => ({
    meta: [
      { title: "Task Management — LexaRox Accounts" },
      {
        name: "description",
        content: "Assign, monitor and manage staff workload and work items across your accountancy firm.",
      },
      { property: "og:title", content: "Task Management — LexaRox Accounts" },
      { property: "og:description", content: "Staff workload, task queues and AI-generated work items in one place." },
    ],
  }),
  component: TasksPage,
});

const views = ["My Tasks", "Team Tasks", "AI Tasks", "Completed", "Overdue"] as const;

function TasksPage() {
  const [view, setView] = useState<(typeof views)[number]>("My Tasks");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"tasks" | "workload">("tasks");

  const totalTasks = tasks.length;
  const myTasks = tasks.filter((t) => t.view === "My Tasks").length;
  const overdueTasks = tasks.filter((t) => t.overdue && t.status !== "Completed").length;

  const rows = useMemo(
    () =>
      tasks.filter((t) => {
        const matchesView =
          view === "Completed"
            ? t.status === "Completed"
            : view === "Overdue"
              ? t.overdue && t.status !== "Completed"
              : t.view === view;
        return (
          matchesView &&
          (t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.client.toLowerCase().includes(query.toLowerCase()))
        );
      }),
    [view, query],
  );

  return (
    <AppShell>
      <PageHeader
        title="Task Management"
        subtitle="Assign, monitor and manage staff workload — My Tasks, Team Tasks, AI Tasks and workload overview."
        actions={
          <Button className="bg-[#3cadf1] font-semibold text-white hover:bg-[#3cadf1]/90" asChild>
            <Link to="/tasks/create">
              <Plus className="h-4 w-4" /> Add Task
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Work Items"
          value={String(totalTasks)}
          trend="Firm backlog"
          up={true}
          support="Open and in-progress tasks"
          icon={<ListChecks className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Assigned to Me"
          value={String(myTasks)}
          trend="Personal queue"
          up={true}
          support="Your next deliverables"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Staff at Capacity"
          value={String(teamMembers.filter((m) => m.workload > 85).length)}
          trend={`${teamMembers.length} team members`}
          up={false}
          support="Above 85% utilisation"
          icon={<Users className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="Overdue"
          value={String(overdueTasks)}
          trend="Needs attention"
          up={overdueTasks === 0}
          support="Past due date"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "tasks" | "workload")} className="mb-4">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">
            Task list
          </TabsTrigger>
          <TabsTrigger value="workload" className="text-xs sm:text-sm">
            Workload overview
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "workload" ? (
        <Section title="Staff workload overview" description="Capacity and open tasks per team member">
          <ul className="divide-y">
            {teamMembers.map((m) => (
              <li key={m.email} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.role} · {m.clients} clients ·{" "}
                    {tasks.filter((t) => t.assignee === m.name && t.status !== "Completed").length} open tasks
                  </p>
                </div>
                <div className="w-36">
                  <div className="mb-1 flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Load</span>
                    <span className={m.workload > 85 ? "text-amber-600" : ""}>{m.workload}%</span>
                  </div>
                  <ProgressBar value={m.workload} tone={m.workload > 85 ? "ai" : "primary"} />
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Workload rebalanced for ${m.name}`)}>
                  Reassign
                </Button>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <>
          <div className="mb-4 grid gap-2 sm:flex sm:items-center sm:justify-between">
            <Tabs value={view} onValueChange={(v) => setView(v as (typeof views)[number])}>
              <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
                {views.map((v) => (
                  <TabsTrigger key={v} value={v} className="text-xs sm:text-sm">
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="h-9 border-transparent bg-muted pl-9"
              />
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="card-soft">
              <EmptyState title="Nothing here" description="No tasks match this view and search combination." />
            </div>
          ) : (
            <div className="card-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Task</th>
                      <th className="px-4 py-2.5 font-medium">Client</th>
                      <th className="px-4 py-2.5 font-medium">Assignee</th>
                      <th className="px-4 py-2.5 font-medium">Due</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Priority</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((t) => (
                      <tr key={t.id} className="transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-2">
                            {t.source === "AI" && (
                              <StatusBadge tone="ai" dot className="mt-0.5 shrink-0">
                                <Sparkles className="h-3 w-3" /> AI
                              </StatusBadge>
                            )}
                            <Link
                              to="/tasks/$taskId"
                              params={{ taskId: t.id }}
                              className="min-w-0 font-medium hover:text-[#3cadf1]"
                            >
                              {t.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{t.client}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.assignee}</td>
                        <td className="px-4 py-3">
                          <span className={cn(t.overdue && t.status !== "Completed" && "font-semibold text-rose-600")}>
                            {t.due}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <StatusBadge tone={toneForStatus(t.status)}>{t.status}</StatusBadge>
                            {t.overdue && t.status !== "Completed" && (
                              <StatusBadge tone="danger">Overdue</StatusBadge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={t.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to="/tasks/$taskId" params={{ taskId: t.id }}>
                                View details
                              </Link>
                            </Button>
                            {t.status !== "Completed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toast.success(`"${t.name}" marked complete`)}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
