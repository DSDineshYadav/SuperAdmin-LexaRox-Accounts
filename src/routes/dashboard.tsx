import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Users,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  platformKpis,
  platformActivity,
  platformFirmGrowth,
  platformPlanDistribution,
  subscriberFirms,
  platformInquiries,
} from "@/lib/platform-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Platform Dashboard — LexaRox" },
      {
        name: "description",
        content: "Consolidated view of platform-wide activity, subscriber firms and key metrics.",
      },
    ],
  }),
  component: PlatformDashboard,
});

const kpiIcons: Record<string, React.ReactNode> = {
  firms: <Building2 className="h-5 w-5" />,
  clients: <Users className="h-5 w-5" />,
  mrr: <CreditCard className="h-5 w-5" />,
  inquiries: <MessageSquare className="h-5 w-5" />,
  ai: <Sparkles className="h-5 w-5" />,
};

const kpiVariants = ["cyan", "green", "purple", "amber", "cyan"] as const;

function PlatformDashboard() {
  const [timeRange, setTimeRange] = useState("This Month");

  const urgentInquiries = platformInquiries.filter((i) => i.priority === "Urgent" || i.status === "New").length;
  const activeFirms = subscriberFirms.filter((f) => f.status === "Active").length;
  const onboardingFirms = subscriberFirms.filter((f) => f.status === "Onboarding" || f.status === "Trial").length;

  return (
    <AppShell>
      <PageHeader
        title="Platform Dashboard"
        subtitle="Consolidated view of platform-wide activity, subscriber firms and key metrics."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {["This Week", "This Month", "This Quarter", "This Year"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" asChild>
              <Link to="/firms">
                Manage firms <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {platformKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            up={kpi.up}
            support={kpi.support}
            icon={kpiIcons[kpi.id]}
            variant={kpiVariants[i % kpiVariants.length]}
          />
        ))}
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        <Section
          title="Platform growth"
          description="Subscriber firms and MRR over time"
          className="lg:col-span-2"
        >
          <div className="h-72 p-4 sm:px-5">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={platformFirmGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "mrr" ? [`£${value.toLocaleString()}`, "MRR"] : [value, "Firms"]
                  }
                />
                <Legend />
                <Bar yAxisId="left" dataKey="firms" name="Subscriber firms" fill="#3cadf1" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="mrr" name="MRR (£)" stroke="#50b546" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Plan distribution" description="Firms by subscription plan">
          <div className="flex flex-col items-center p-4 sm:px-5">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformPlanDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {platformPlanDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 grid w-full gap-1.5">
              {platformPlanDistribution.map((p) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <span className="font-medium tabular-nums">{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Recent subscriber firms"
          description={`${activeFirms} active · ${onboardingFirms} onboarding or trial`}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/firms">View all</Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {subscriberFirms.slice(0, 5).map((firm) => (
              <li key={firm.id}>
                <Link
                  to="/firms/$firmId"
                  params={{ firmId: firm.id }}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{firm.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {firm.plan} · {firm.clientCount} clients · {firm.location}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStatus(firm.status)}>{firm.status}</StatusBadge>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Platform activity"
          description="Recent events across the platform"
          actions={
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Live feed
            </span>
          }
        >
          <ul className="divide-y">
            {platformActivity.map((item) => (
              <li key={item.id} className="px-4 py-3 sm:px-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        title="Attention required"
        description={`${urgentInquiries} inquiries need action`}
        className="mt-5"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/inquiries">Open inquiries</Link>
          </Button>
        }
      >
        <ul className="divide-y">
          {platformInquiries
            .filter((i) => i.status === "New" || i.priority === "Urgent")
            .slice(0, 4)
            .map((inq) => (
              <li key={inq.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{inq.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {inq.type} · {inq.contactName}
                    {inq.firmName ? ` · ${inq.firmName}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge tone={inq.priority === "Urgent" ? "danger" : "warning"}>{inq.priority}</StatusBadge>
                  <StatusBadge tone={toneForStatus(inq.status)}>{inq.status}</StatusBadge>
                </div>
              </li>
            ))}
        </ul>
      </Section>
    </AppShell>
  );
}
