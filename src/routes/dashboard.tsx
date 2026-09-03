import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  UserPlus,
  FileText,
  ListChecks,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  Layers,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
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
import { AppShell } from "@/components/app-shell";
import { KpiCard, Section, StatusBadge, PriorityBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  aiActivity,
  attention,
  kpis,
  clients,
  agents,
  revenueLeadGrowth,
  portfolioStatusDistribution,
  leadConversionVelocity,
  aiAutomationMetrics,
} from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "CRM & Operations Dashboard — LexaRox Accounts" },
      {
        name: "description",
        content:
          "Enterprise CRM & Operations Dashboard: interactive charts, exception queues, client leads pipeline, AI automation activity and real-time operations.",
      },
      { property: "og:title", content: "CRM & Operations Dashboard — LexaRox Accounts" },
      {
        property: "og:description",
        content: "Enterprise CRM & Operations Dashboard: interactive charts, exception queues, client leads pipeline, AI automation activity and real-time operations.",
      },
    ],
  }),
  component: Dashboard,
});

const icons: Record<string, React.ReactNode> = {
  clients: <Users className="h-5 w-5" />,
  onboarding: <UserPlus className="h-5 w-5" />,
  documents: <FileText className="h-5 w-5" />,
  tasks: <ListChecks className="h-5 w-5" />,
  ai: <Sparkles className="h-5 w-5" />,
};

function Dashboard() {
  const [timeRange, setTimeRange] = useState("This Month");
  const [chartMetric, setChartMetric] = useState<"revenue" | "leads">("revenue");
  const [showRevenue, setShowRevenue] = useState(true);
  const [showLeads, setShowLeads] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [attentionFilter, setAttentionFilter] = useState("All");
  const [attentionSearch, setAttentionSearch] = useState("");

  const totalClients = clients.length;
  const activeClientsCount = clients.filter((c) => c.status === "Active" || c.status === "Completed").length;
  const onboardingCount = clients.filter((c) => c.status === "Onboarding").length;
  const awaitingDocsCount = clients.filter((c) => c.status === "Awaiting Documents").length;

  return (
    <AppShell>
      {/* 1. Header Banner & Quick Filter (2-Color Brand Gradient: #3cadf1 and #50b546) */}
      <div className="relative mb-6 overflow-hidden">
        {/* 2 Ambient Glows (#3cadf1 & #50b546) */}


        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-baseline lg:justify-between">
          <div className="max-w-2xl space-y-2.5">
            {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 px-3.5 py-1 text-xs font-bold text-[#0284c7] dark:text-[#3cadf1] backdrop-blur-md border border-[#3cadf1]/40 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-[#3cadf1] animate-pulse" />
              <span>CRM & Accounting Operations Platform</span>
            </div> */}
            <h1 className="text-1xl font-[400] tracking-tight text-[#2c2a35] dark:text-white sm:text-3xl lg:text-3xl mb-0">
              Welcome back, Andrea
            </h1>
            <p className="text-sm text-slate-700 dark:text-slate-200 sm:text-[14px] leading-relaxed font-medium">
              You have <span className="font-extrabold text-[#0284c7] dark:text-[#3cadf1] dark:bg-[#3cadf1]/25">18 pending items</span> in your review queue and <span className="font-extrabold text-[#2a8323] dark:text-[#6fdb65]">126 automated actions</span> completed today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl bg-white/70 dark:bg-white/10 p-1 text-xs font-semibold text-slate-700 dark:text-slate-200 backdrop-blur-md border border-slate-300/60 dark:border-white/15 shadow-sm">
              {["Today", "This Week", "This Month"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-lg px-3.5 py-1.5 transition-all ${timeRange === range
                    ? "bg-[#3caff2] text-white shadow-md font-bold"
                    : "hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white dark:bg-white/15 dark:hover:bg-white/25 text-slate-900 dark:text-white border border-slate-200 dark:border-none gap-1.5 font-bold shadow-sm" asChild>
              <Link to="/ai-review">
                <ShieldCheck className="h-4 w-4 text-[#50b546]" />
                Review Queue (18)
              </Link>
            </Button>
          </div>
        </div>

        {/* Banner KPI Highlights with 2 Brand Colors */}
        {/* <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-900/10 dark:border-white/15 pt-6 sm:grid-cols-4 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Client Portfolio</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalClients}</p>
            <p className="flex items-center gap-1 text-xs text-[#2a8323] dark:text-[#6fdb65] font-bold">
              <TrendingUp className="h-3 w-3" /> +14.2% vs last month
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Active Onboarding</p>
            <p className="text-2xl font-black text-[#0284c7] dark:text-[#3cadf1]">{onboardingCount}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Avg completion 4.2 days</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Awaiting Documents</p>
            <p className="text-2xl font-black text-[#0284c7] dark:text-[#3cadf1]">{awaitingDocsCount}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Auto-chased by AI</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">AI Automation Efficiency</p>
            <p className="text-2xl font-black text-[#2a8323] dark:text-[#6fdb65]">98.4%</p>
            <p className="flex items-center gap-1 text-xs text-[#0284c7] dark:text-[#3cadf1] font-bold">
              <Sparkles className="h-3 w-3" /> 62 hrs saved this week
            </p>
          </div>
        </div> */}
      </div>

      {/* 2. Top Metric Cards (5 Distinct Solid Light Shade Colors: Cyan, Green, Magenta, Amber, Purple - No Gradient) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k, index) => {
          const variants = ["cyan", "green", "magenta", "amber", "purple"] as const;
          const variant = variants[index % variants.length]!;
          return (
            <KpiCard
              key={k.label}
              label={k.label}
              value={k.value}
              trend={k.trend}
              up={k.up}
              support={k.support}
              icon={icons[k.icon]}
              variant={variant}
            />
          );
        })}
      </div>

      {/* 3. Interactive Charts Section (Dreams ERP CRM Layout Style) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Compact & Self-Explanatory Growth Chart (2 Columns) */}
        <div className="card-soft p-5 lg:col-span-2 flex flex-col justify-between rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all">
          <div>
            {/* Sleek Minimal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#3cadf1]" />
                    Revenue & Lead Growth Trends
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#3cadf1]/10 px-2 py-0.5 text-[10px] font-bold text-[#0284c7] dark:text-[#3cadf1]">
                    Avg £60.3k/mo
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Monthly billing (£) & lead conversion velocity</p>
              </div>

              {/* Interactive Series Toggle Pills */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <button
                  onClick={() => setShowRevenue(!showRevenue)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all border ${showRevenue
                    ? "bg-transparent text-[#0284c7] dark:text-[#3cadf1] border-[#3cadf1]"
                    : "bg-transparent text-muted-foreground border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${showRevenue ? "bg-[#3cadf1]" : "bg-muted-foreground"}`} />
                  Revenue (£)
                </button>

                <button
                  onClick={() => setShowLeads(!showLeads)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all border ${showLeads
                    ? "bg-transparent text-[#2a8323] dark:text-[#6fdb65] border-[#50b546]"
                    : "bg-transparent text-muted-foreground border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-sm ${showLeads ? "bg-[#50b546]" : "bg-muted-foreground"}`} />
                  Leads
                </button>

                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all border ${showCompleted
                    ? "bg-transparent text-[#be0077] dark:text-[#f35ec3] border-[#e2008e]"
                    : "bg-transparent text-muted-foreground border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${showCompleted ? "bg-[#e2008e]" : "bg-muted-foreground"}`} />
                  Completed
                </button>
              </div>
            </div>

            {/* Crisp & Full Height Composed Chart */}
            <div className="mt-4 h-[310px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueLeadGrowth} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenueCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3cadf1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3cadf1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLeadsCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#50b546" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#50b546" stopOpacity={0.35} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    yAxisId="left"
                    stroke="#0284c7"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `£${val / 1000}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#50b546"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 }}
                    wrapperStyle={{ outline: "none" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-2xl backdrop-blur-md text-xs">
                            <p className="font-extrabold text-[#0284c7] border-b border-slate-100 pb-1 mb-2">
                              {label} Performance
                            </p>
                            <div className="space-y-1.5">
                              {payload.map((entry: any) => (
                                <div key={entry.name} className="flex items-center justify-between gap-4 font-semibold">
                                  <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    {entry.name}
                                  </span>
                                  <span className="font-black text-slate-900">
                                    {entry.name.includes("Revenue") ? `£${entry.value.toLocaleString()}` : entry.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Revenue Area Curve */}
                  {showRevenue && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#3cadf1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRevenueCompact)"
                    />
                  )}

                  {/* Leads Inflow Column Bars */}
                  {showLeads && (
                    <Bar
                      yAxisId="right"
                      dataKey="leads"
                      name="Leads Inflow"
                      fill="url(#colorLeadsCompact)"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    />
                  )}

                  {/* Onboarding Completed Curve */}
                  {showCompleted && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stroke="#e2008e"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#e2008e", strokeWidth: 1.5, stroke: "#fff" }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Portfolio Status Donut Pie Chart (1 Column - Sleek & Compact) */}
        <div className="card-soft p-5 flex flex-col justify-between rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-[#e2008e]" />
                  Portfolio Breakdown
                </h2>
                <p className="text-xs text-muted-foreground">Accounts status segmentation</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#50b546]/10 px-2 py-0.5 text-[10px] font-bold text-[#2a8323] dark:text-[#6fdb65]">
                146 Total
              </span>
            </div>

            {/* Compact Donut Chart with Dynamic Hole Stat */}
            <div className="relative mt-2 h-[155px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    activeShape={false}
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    {portfolioStatusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                        className="transition-all duration-200 cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={false}
                    contentStyle={{ backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 }}
                    wrapperStyle={{ outline: "none" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length && payload[0] && payload[0].payload) {
                        const data = payload[0];
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white/95 p-2 px-3 text-slate-900 shadow-xl backdrop-blur-md text-xs font-bold pointer-events-none">
                            <span className="flex items-center gap-1.5" style={{ color: data.payload.color }}>
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.payload.color }} />
                              {data.name}: {data.value} clients
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Dynamic Overlay in Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {activePieIndex !== null && portfolioStatusDistribution[activePieIndex] ? portfolioStatusDistribution[activePieIndex].value : 146}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground max-w-[80px] truncate">
                  {activePieIndex !== null && portfolioStatusDistribution[activePieIndex] ? portfolioStatusDistribution[activePieIndex].name : "Clients"}
                </span>
              </div>
            </div>
          </div>

          {/* Compact 2-Column Grid Chips (Minimal Text, Max Info) */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 border-t pt-3">
            {portfolioStatusDistribution.map((item, idx) => {
              const totalVal = 146;
              const percent = ((item.value / totalVal) * 100).toFixed(0);
              const isHovered = activePieIndex === idx;

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  className={`flex items-center justify-between rounded-lg p-1.5 px-2 text-xs font-bold transition-all cursor-pointer border ${isHovered
                    ? "bg-muted/80 border-border ring-1 ring-border shadow-sm"
                    : "bg-muted/30 border-transparent hover:bg-muted/60"
                    }`}
                >
                  <span className="flex items-center gap-1.5 truncate min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-foreground text-[11px]">{item.name}</span>
                  </span>
                  <span
                    className="ml-1 rounded px-1.5 py-0.2 text-[10px] font-black shrink-0"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CRM Pipeline Velocity Bar Chart & AI System Performance */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">



        {/* Pipeline Stage Velocity Bar Chart */}
        <div className="card-soft p-5 flex flex-col justify-between rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all lg:col-span-2">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#50b546]" />
                  Lead Conversion & Velocity
                </h2>
                <p className="text-xs text-muted-foreground">Stage progression efficiency</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#50b546]/10 px-2.5 py-1 text-xs font-bold text-[#2a8323] dark:text-[#6fdb65]">
                <CheckCircle2 className="h-3.5 w-3.5" /> 51% Final Conversion
              </span>
            </div>

            {/* Clean & Uncluttered Vertical Bar Chart */}
            <div className="mt-3 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadConversionVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
                  <XAxis dataKey="stage" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 }}
                    wrapperStyle={{ outline: "none" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length && payload[0] && payload[0].payload) {
                        const data = payload[0];
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white/95 p-2.5 px-3.5 text-slate-900 shadow-xl backdrop-blur-md text-xs font-bold">
                            <span className="text-[#0284c7]">{data.payload.stage}:</span> {data.value} clients ({data.payload.conversion} conversion)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" name="Clients" radius={[6, 6, 0, 0]} barSize={30}>
                    {leadConversionVelocity.map((_, index) => {
                      const barColors = ["#3cadf1", "#0284c7", "#50b546", "#a855f7", "#e2008e"];
                      return <Cell key={`bar-${index}`} fill={barColors[index % barColors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Relevant Pipeline Velocity Metrics */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t pt-3">
            <div className="rounded-xl border bg-muted/20 p-2 px-2.5">
              <span className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Avg Velocity</span>
              <span className="text-xs font-black text-[#3cadf1]">4.2 Days <span className="text-[9px] text-[#2a8323] dark:text-[#6fdb65] font-extrabold">(-1.1d)</span></span>
            </div>
            <div className="rounded-xl border bg-muted/20 p-2 px-2.5">
              <span className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Stage Dropoff</span>
              <span className="text-xs font-black text-[#e2008e]">12% Max <span className="text-[9px] text-muted-foreground font-extrabold">(Docs)</span></span>
            </div>
            <div className="rounded-xl border bg-muted/20 p-2 px-2.5">
              <span className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">AI Verified</span>
              <span className="text-xs font-black text-[#50b546]">68% Auto <span className="text-[9px] text-[#2a8323] dark:text-[#6fdb65] font-extrabold">(Fast)</span></span>
            </div>
            <div className="rounded-xl border bg-muted/20 p-2 px-2.5">
              <span className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">SLA Target</span>
              <span className="text-xs font-black text-[#a855f7]">98.4% <span className="text-[9px] text-[#2a8323] dark:text-[#6fdb65] font-extrabold">On-Track</span></span>
            </div>
          </div>
        </div>

        {/* AI Autonomous Monitor */}
        <div className="card-soft p-5 flex flex-col justify-between ">
          <div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--ai)]" />
                  AI Autonomous Agents
                </h2>
                <p className="text-xs text-muted-foreground">Active agents running background tasks</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold" asChild>
                <Link to="/ai-workspace">View All</Link>
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {agents.slice(0, 4).map((agent) => (
                <div key={agent.id} className="flex items-start gap-3 rounded-xl border p-3 bg-card/60 hover:bg-card transition-colors">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--ai)]/10 text-[var(--ai)]">
                    <Activity className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{agent.name}</p>
                      <StatusBadge tone={agent.status === "Active" ? "success" : "warning"} className="text-[10px] px-2 py-0">
                        {agent.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{agent.current}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-3 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold">All 6 agents operating smoothly</span>
            </div>
            <Link to="/ai-workspace" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center">
              Logs <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>


      </div>

      {/* 5. Split Dashboard Grid: Attention Items & AI Activity Stream */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Needs Your Attention (Interactive High-Density Exception Table - 2 Columns) */}
        <div className="card-soft p-5 lg:col-span-2 flex flex-col justify-between rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
              <div>
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#e2008e]" />
                  Needs Your Attention
                </h2>
                <p className="text-xs text-muted-foreground">High-priority exception queue & AI approval warnings</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e2008e]/10 px-2.5 py-0.5 text-xs font-bold text-[#be0077] dark:text-[#f35ec3]">
                  {attention.filter((a) => a.priority === "High").length} Urgent Items
                </span>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold" asChild>
                  <Link to="/tasks">View All Tasks</Link>
                </Button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center rounded-xl bg-muted/60 p-1 text-xs font-medium text-muted-foreground border border-border/40">
                {[
                  { label: "All", count: attention.length },
                  { label: "High Priority", count: attention.filter((a) => a.priority === "High").length },
                  { label: "Approvals", count: attention.filter((a) => a.kind.includes("Approval")).length },
                  { label: "Documents", count: attention.filter((a) => a.kind.includes("document")).length },
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setAttentionFilter(f.label)}
                    className={`rounded-lg px-3 py-1 text-xs transition-all ${attentionFilter === f.label
                      ? "bg-[#007978] text-white shadow-sm font-bold"
                      : "hover:text-foreground font-medium"
                      }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search exception or client..."
                  value={attentionSearch}
                  onChange={(e) => setAttentionSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-[#007978]/20 focus:border-[#007978] transition-all font-normal placeholder:text-muted-foreground/60 shadow-inner"
                />
              </div>
            </div>

            {/* Ultra-Premium Data Table */}
            <div className="mt-3.5 overflow-x-auto rounded-xl border border-border/70 shadow-sm bg-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-100/80 dark:bg-slate-900/80 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                    <th className="py-2.5 px-3.5">Priority</th>
                    <th className="py-2.5 px-3.5">Client Name</th>
                    <th className="py-2.5 px-3.5">Category</th>
                    <th className="py-2.5 px-3.5">Issue & Description</th>
                    <th className="py-2.5 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs">
                  {attention
                    .filter((item) => {
                      if (attentionFilter === "High Priority") return item.priority === "High";
                      if (attentionFilter === "Approvals") return item.kind.includes("Approval");
                      if (attentionFilter === "Documents") return item.kind.includes("document");
                      return true;
                    })
                    .filter((item) => {
                      if (!attentionSearch) return true;
                      const query = attentionSearch.toLowerCase();
                      return (
                        item.client.toLowerCase().includes(query) ||
                        item.title.toLowerCase().includes(query) ||
                        item.kind.toLowerCase().includes(query) ||
                        item.detail.toLowerCase().includes(query)
                      );
                    })
                    .slice(0, 10)
                    .map((item) => {
                      const clientInitials = item.client
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
                        >
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <PriorityBadge priority={item.priority} />
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md bg-[#007978]/10 text-[#007978] dark:bg-[#007978]/25 dark:text-[#3cadf1] text-[10px] font-bold">
                                {clientInitials}
                              </span>
                              <span className="font-semibold text-foreground text-xs">{item.client}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {item.kind}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 min-w-[240px]">
                            <p className="font-semibold text-foreground text-xs truncate max-w-[280px]" title={item.title}>
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-normal truncate max-w-[280px] mt-0.5" title={item.detail}>
                              {item.detail}
                            </p>
                          </td>
                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.actions.map((a, i) => (
                                <Button
                                  key={a}
                                  size="sm"
                                  variant={i === 0 ? "default" : "outline"}
                                  className={
                                    i === 0
                                      ? "h-6.5 px-2.5 text-[11px] font-bold bg-[#007978] hover:bg-[#006362] text-white border-none shadow-sm"
                                      : "h-6.5 px-2.5 text-[11px] font-medium border-slate-200 dark:border-slate-700"
                                  }
                                  asChild
                                >
                                  <Link to="/ai-review">{a}</Link>
                                </Button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between border-t border-border/60 pt-3 gap-2 text-xs">
              <p className="text-muted-foreground font-semibold text-[11px]">
                Showing <span className="font-extrabold text-foreground">1 to 10</span> of <span className="font-extrabold text-foreground">28</span> exception items
              </p>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs font-bold" disabled>
                  Previous
                </Button>
                <Button size="sm" className="h-7 w-7 p-0 text-xs font-extrabold bg-[#007978] text-white border-none">
                  1
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-xs font-bold">
                  2
                </Button>
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-xs font-bold">
                  3
                </Button>
                <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs font-bold">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time AI Activity Stream (1 Column) */}
        <div className="card-soft p-5 flex flex-col justify-between rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="border-b pb-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold flex items-center gap-2 truncate">
                  <Sparkles className="h-4 w-4 text-[#3cadf1] animate-pulse shrink-0" />
                  <span className="truncate">Real-Time AI Activity</span>
                </h2>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#3cadf1]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#0284c7] dark:text-[#3cadf1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3cadf1] animate-ping" /> Live
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-extrabold" asChild>
                    <Link to="/ai-workspace">
                      Workspace <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Background automated tasks executed today</p>
            </div>

            {/* Timeline Stream List */}
            <div className="mt-3 space-y-2.5">
              {aiActivity.slice(0, 6).map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border bg-muted/20 p-2.5 hover:bg-muted/50 transition-all"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#3cadf1]/15 text-[#0284c7] dark:text-[#3cadf1] font-bold text-xs shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground tracking-tight">{a.agent}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3 text-[#3cadf1]" /> {a.time}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug font-normal line-clamp-1">{a.action}</p>

                    <div className="mt-1.5 flex items-center justify-between">
                      <StatusBadge tone={toneForStatus(a.status)} className="text-[10px] px-2 py-0.5">
                        {a.status}
                      </StatusBadge>

                      {a.review && (
                        <Button
                          size="sm"
                          className="h-6 px-2 text-[10px] font-extrabold bg-[#3cadf1] hover:bg-[#2fa0e6] text-white shadow-sm border-none"
                          asChild
                        >
                          <Link to="/ai-review">Review</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live System Operating Banner */}
          <div className="mt-3 rounded-xl bg-[#3cadf1]/10 p-2.5 px-3 border border-[#3cadf1]/20 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-[#0284c7] dark:text-[#3cadf1]">
              <CheckCircle2 className="h-4 w-4 text-[#50b546]" />
              <span>126 Tasks Executed Today</span>
            </div>
            <Link to="/ai-workspace" className="text-[#0284c7] dark:text-[#3cadf1] hover:underline flex items-center gap-1">
              Logs <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
