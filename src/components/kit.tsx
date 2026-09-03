import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- Status badge ---------------- */

const tones: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  primary: "bg-accent text-accent-foreground border-transparent",
  success: "bg-[var(--success-soft)] text-[var(--success)] border-transparent",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-transparent",
  danger: "bg-destructive/10 text-destructive border-transparent",
  ai: "bg-[var(--ai-soft)] text-[var(--ai)] border-transparent",
  info: "bg-[var(--info-soft)] text-[var(--info)] border-transparent",
};

export type Tone = keyof typeof tones;

export function StatusBadge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function toneForStatus(status: string): Tone {
  switch (status) {
    case "Active":
    case "Completed":
    case "Verified":
    case "Processed":
    case "Up to date":
    case "Accepted":
      return "success";
    case "Onboarding":
    case "Processing":
    case "In Progress":
    case "Sent":
    case "Viewed":
    case "To Do":
      return "info";
    case "Review Required":
    case "Needs Review":
    case "Awaiting Documents":
    case "Awaiting approval":
    case "Blocked":
    case "Under Review":
    case "Follow-up Required":
    case "Review Due":
    case "Pending":
    case "Draft":
    case "Review":
      return "warning";
    case "Overdue":
    case "Flagged":
    case "Rejected":
    case "Expired":
      return "danger";
    default:
      return "neutral";
  }
}

export function PriorityBadge({ priority }: { priority: "Urgent" | "High" | "Medium" | "Low" }) {
  const tone: Tone =
    priority === "Urgent" || priority === "High"
      ? "danger"
      : priority === "Medium"
        ? "warning"
        : "neutral";
  return (
    <StatusBadge tone={tone} dot>
      {priority}
    </StatusBadge>
  );
}

/* ---------------- KPI card ---------------- */

export function KpiCard({
  label,
  value,
  trend,
  up,
  support,
  icon,
  highlight,
  variant = "default",
}: {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  support: string;
  icon: ReactNode;
  highlight?: boolean;
  variant?: "cyan" | "green" | "magenta" | "amber" | "purple" | "default";
}) {
  const variantStyles = {
    cyan: {
      card: "bg-card border border-[#3cadf1]/40 shadow-sm hover:border-[#3cadf1] hover:shadow-md",
      icon: "bg-[#3cadf1]/15 text-[#0284c7] dark:text-[#3cadf1]",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: "bg-[#3cadf1]/15 text-[#0284c7] dark:text-[#3cadf1]",
    },
    green: {
      card: "bg-card border border-[#50b546]/40 shadow-sm hover:border-[#50b546] hover:shadow-md",
      icon: "bg-[#50b546]/15 text-[#2a8323] dark:text-[#6fdb65]",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: "bg-[#50b546]/15 text-[#2a8323] dark:text-[#6fdb65]",
    },
    magenta: {
      card: "bg-card border border-[#e2008e]/40 shadow-sm hover:border-[#e2008e] hover:shadow-md",
      icon: "bg-[#e2008e]/15 text-[#be0077] dark:text-[#f35ec3]",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: "bg-[#e2008e]/15 text-[#be0077] dark:text-[#f35ec3]",
    },
    amber: {
      card: "bg-card border border-[#f59e0b]/40 shadow-sm hover:border-[#f59e0b] hover:shadow-md",
      icon: "bg-[#f59e0b]/15 text-[#b45309] dark:text-[#fbbf24]",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: "bg-[#f59e0b]/15 text-[#b45309] dark:text-[#fbbf24]",
    },
    purple: {
      card: "bg-card border border-[#8b5cf6]/40 shadow-sm hover:border-[#8b5cf6] hover:shadow-md",
      icon: "bg-[#8b5cf6]/15 text-[#6d28d9] dark:text-[#c084fc]",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: "bg-[#8b5cf6]/15 text-[#6d28d9] dark:text-[#c084fc]",
    },
    default: {
      card: highlight ? "ai-surface border-indigo-300/40 dark:border-indigo-800/40" : "bg-card hover:border-cyan-500/30",
      icon: highlight ? "bg-[var(--ai)]/15 text-[var(--ai)] shadow-sm" : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400",
      label: "text-muted-foreground",
      value: "text-foreground",
      support: "text-muted-foreground",
      trend: up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div className={cn("card-soft card-hover flex flex-col justify-between gap-3 p-4 border rounded-2xl transition-all duration-200", style.card)}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn("truncate text-xs font-extrabold uppercase tracking-wider", style.label)}>
          {label}
        </span>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors font-bold", style.icon)}>
          {icon}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl sm:text-3xl font-black tracking-tight", style.value)}>{value}</span>
          <span className={cn("inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold", style.trend)}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        </div>
        <p className={cn("mt-1 text-xs font-medium", style.support)}>{support}</p>
      </div>
    </div>
  );
}

/* ---------------- AI insight panel ---------------- */

export function AiInsight({
  title = "AI Insight",
  children,
  actions,
  className,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ai-surface rounded-xl p-4", className)}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--ai)]/12 text-[var(--ai)]">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--ai)]">{title}</p>
          <div className="mt-1 text-sm text-foreground/85">{children}</div>
          {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- List table shell ---------------- */

export function ListTableCard({
  toolbar,
  children,
  className,
}: {
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-soft overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm",
        className,
      )}
    >
      {toolbar && (
        <div className="grid gap-3 border-b border-border/50 bg-muted/25 p-4 sm:flex sm:items-center sm:px-5 sm:py-4">
          {toolbar}
        </div>
      )}
      {children}
    </div>
  );
}

export function ListTablePrimaryCell({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex min-w-[12rem] max-w-md flex-col gap-1 py-0.5">
      <div className="text-sm font-semibold leading-snug text-foreground">{title}</div>
      {subtitle != null && subtitle !== "" && (
        <div className="text-xs leading-relaxed text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}

/* ---------------- Section ---------------- */

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-soft overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/50 bg-muted/25 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

/* ---------------- Progress bar ---------------- */

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "ai" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all", tone === "ai" ? "bg-[var(--ai)]" : "bg-primary")}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-14 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/* ---------------- List table pagination ---------------- */

export function ListTablePagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border/50 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-muted-foreground tabular-nums">
        Showing {rangeStart}–{rangeEnd} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="min-w-[5.5rem] text-center text-xs font-medium tabular-nums text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
