import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Filter, Check, X, Edit3 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, ProgressBar, StatusBadge } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { reviewQueue } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-review")({
  head: () => ({
    meta: [
      { title: "AI Review Queue — LexaRox Accounts" },
      {
        name: "description",
        content: "AI does the background work; humans review exceptions, recommendations and approvals.",
      },
      { property: "og:title", content: "AI Review Queue — LexaRox Accounts" },
      { property: "og:description", content: "Exception-only review for accountancy teams." },
    ],
  }),
  component: ReviewQueue,
});

function ReviewQueue() {
  const [items, setItems] = useState(reviewQueue);

  const resolve = (id: string, verb: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${verb} — item cleared from exception queue`);
  };

  const totalPending = items.length;
  const highConfidence = items.filter((i) => i.confidence >= 90).length;
  const reviewRequired = items.filter((i) => i.confidence < 90).length;

  return (
    <AppShell>
      <PageHeader
        title="AI Exception Review Queue"
        subtitle={`${items.length} high-priority recommendations waiting for human verification.`}
        actions={
          items.length > 0 ? (
            <Button
              className="bg-[#50b546] hover:bg-[#50b546]/90 text-white font-semibold"
              onClick={() => {
                setItems([]);
                toast.success("All items batch approved successfully!");
              }}
            >
              <Check className="h-4 w-4" /> Batch Approve All
            </Button>
          ) : undefined
        }
      />

      {/* KPI Summary Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Pending Exception Queue"
          value={String(totalPending)}
          trend="Real-time"
          up={false}
          support="Items requiring human sign-off"
          icon={<ShieldCheck className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="High Confidence (90%+)"
          value={String(highConfidence)}
          trend="Recommended"
          up={true}
          support="Safe one-click approvals"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Detailed Review Needed"
          value={String(reviewRequired)}
          trend="Lower Confidence"
          up={false}
          support="Manual document inspection recommended"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      {items.length === 0 ? (
        <div className="card-soft">
          <EmptyState
            title="All AI exceptions resolved!"
            description="Your AI queue is completely clear. Autonomous operations are running smoothly."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div key={r.id} className="card-soft card-hover p-5 border rounded-2xl transition-all">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="ai" dot>
                      <Sparkles className="h-3.5 w-3.5" /> {r.agent}
                    </StatusBadge>
                    <span className="text-xs font-semibold text-muted-foreground">{r.client}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-foreground">{r.did}</h3>
                  <div className="mt-2 space-y-1 rounded-xl bg-muted/40 p-3 text-xs">
                    <p className="text-foreground/90">
                      <span className="font-bold text-foreground">Why Review:</span> {r.why}
                    </p>
                    <p className="text-[#3cadf1] font-semibold">
                      <span className="font-bold text-foreground">AI Recommendation:</span> {r.recommendation}
                    </p>
                  </div>
                </div>
                <div className="w-36 shrink-0 rounded-xl border border-border/50 bg-card p-3 text-center shadow-xs">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Confidence Score</p>
                  <p className="mt-0.5 text-2xl font-black text-foreground">{r.confidence}%</p>
                  <div className="mt-1.5">
                    <ProgressBar value={r.confidence} tone="ai" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-[#50b546] hover:bg-[#50b546]/90 text-white font-semibold text-xs"
                    onClick={() => resolve(r.id, r.action)}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve · {r.action}
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => toast("Opened draft editor")}>
                    <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit Response
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10" onClick={() => resolve(r.id, "Rejected")}>
                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={() => toast("Full document & log preview opened")}>
                  View Full Document & Logs
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
