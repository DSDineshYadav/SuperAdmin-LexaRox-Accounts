import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Building2, Users, Sparkles, Zap, Award } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, Section, AiInsight } from "@/components/kit";
import { surveyInsights } from "@/lib/data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Industry Insights — LexaRox Accounts" },
      {
        name: "description",
        content: "Survey research into the operational problems faced by accountancy firms and AI adoption.",
      },
      { property: "og:title", content: "Industry Insights — LexaRox Accounts" },
      { property: "og:description", content: "Internal product research across 148 accountancy firms." },
    ],
  }),
  component: Insights,
});

const painPointsChartData = surveyInsights.painPoints.map((p) => ({
  name: p.label,
  value: p.value,
}));

const adoptionChartData = surveyInsights.adoption.map((a) => ({
  name: a.label,
  value: a.value,
}));

const BAR_COLORS = ["#e2008e", "#f59e0b", "#3cadf1", "#8b5cf6", "#50b546"];

function Insights() {
  const s = surveyInsights;
  return (
    <AppShell>
      <PageHeader
        title="Industry Benchmark & Research Insights"
        subtitle="Empirical survey data collected from 148 UK & international accountancy firms."
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Firms Surveyed"
          value={String(s.firms)}
          trend="Multi-region"
          up={true}
          support="Independent accountancy practices"
          icon={<Building2 className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Total Responses"
          value={String(s.responses)}
          trend="Verified"
          up={true}
          support="Senior partners & practice leads"
          icon={<Users className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="AI Adoption Rate"
          value="49%"
          trend="+18% YoY"
          up={true}
          support="Firms actively using or piloting AI"
          icon={<Sparkles className="h-5 w-5" />}
          variant="green"
        />
      </div>

      <AiInsight title="Market Trend Analysis" className="mb-6">
        Over <strong>78%</strong> of surveyed practices cite <em>chasing client documents</em> as their single largest operational bottleneck. Accountancy firms implementing automated AI chasing report a <strong>4.2x faster onboarding turnaround time</strong>.
      </AiInsight>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pain Points Chart */}
        <Section title="Common Operational Pain Points" description="% of firms reporting each challenge as a primary blocker">
          <div className="h-72 w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={painPointsChartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Reporting Rate (%)">
                  {painPointsChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* AI Adoption Chart */}
        <Section title="AI Technology Adoption Maturity" description="Where accounting practices stand in their AI journey">
          <div className="h-72 w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoptionChartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#3cadf1" radius={[0, 4, 4, 0]} name="Adoption Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Most Requested Features */}
        <Section title="Top Requested AI Capabilities" description="Priority feature requests from practice owners" className="lg:col-span-2">
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
            {s.requested.map((r, i) => (
              <div
                key={r}
                className="card-soft card-hover flex items-start gap-3 rounded-xl border p-4 transition-all"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#3cadf1]/15 text-[#3cadf1] font-bold text-xs">
                  #{i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{r}</p>
                  <p className="mt-1 text-xs text-muted-foreground">High priority demand across surveyed firms</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
