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
  Area,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
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

const growthLegend = [
  { key: "mrr", label: "MRR (£)", color: "#3cadf1" },
  { key: "firms", label: "Subscriber firms", color: "#50b546" },
  { key: "signups", label: "New signups", color: "#e2008e" },
] as const;

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2.5 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      <ul className="space-y-1.5">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center justify-between gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums">
              {entry.dataKey === "mrr" ? `£${entry.value.toLocaleString()}` : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
          description="MRR, subscriber firms and new signups over time"
          className="lg:col-span-2"
        >
          <div className="p-4 pb-5 sm:px-5">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={platformFirmGrowth} margin={{ top: 8, right: 4, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="mrrAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3cadf1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3cadf1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="firmsBarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6fdb65" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#50b546" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border) / 0.55)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100000]}
                  ticks={[0, 25000, 50000, 75000, 100000]}
                  tickFormatter={(v) => `£${v / 1000}k`}
                  width={48}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#50b546" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  width={36}
                />
                <Tooltip content={<GrowthTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.25)" }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  name="MRR"
                  stroke="#3cadf1"
                  strokeWidth={2}
                  fill="url(#mrrAreaFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#3cadf1", stroke: "#fff", strokeWidth: 2 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="firms"
                  name="Subscriber firms"
                  fill="url(#firmsBarFill)"
                  barSize={26}
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="signups"
                  name="New signups"
                  stroke="#e2008e"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#fff", stroke: "#e2008e", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#e2008e", stroke: "#fff", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-1">
              {growthLegend.map((item) => (
                <span key={item.key} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
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
