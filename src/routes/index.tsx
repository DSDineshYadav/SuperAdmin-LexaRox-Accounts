import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { agents, aiActivity, aiAutomationMetrics, kpis, leadConversionVelocity } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LexaRox Accounts — AI-First Accountancy Operations" },
      {
        name: "description",
        content:
          "LexaRox Accounts is an AI-first CRM and operations platform for accountancy firms — clients, documents, onboarding, tasks and AI review in one workspace.",
      },
      { property: "og:title", content: "LexaRox Accounts — AI-First Accountancy Operations" },
      {
        property: "og:description",
        content:
          "Automate document processing, client onboarding and communications. You review what matters.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Users,
    title: "Client CRM",
    description: "Manage 1,284+ active clients with live status, activity feeds and portfolio visibility across your firm.",
    color: "#3cadf1",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description: "AI processes, categorises and extracts transactions — 31 of 38 pending reviews already pre-processed.",
    color: "#e2008e",
    highlight: true,
  },
  {
    icon: UserPlus,
    title: "Smart Onboarding",
    description: "Guide new clients in their own language with AI-assisted document collection.",
    color: "#50b546",
    highlight: false,
  },
  {
    icon: ListChecks,
    title: "Task Operations",
    description: "Track deadlines, overdue items and exceptions with a unified task queue.",
    color: "#3cadf1",
    highlight: false,
  },
  {
    icon: Sparkles,
    title: "AI Workspace",
    description: "Ask AI, monitor agents and approve drafts from one calm workspace.",
    color: "#50b546",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    title: "Review Queue",
    description: "18 items awaiting human review — surfaced before they become problems.",
    color: "#e2008e",
    highlight: false,
  },
  {
    icon: MessageSquare,
    title: "Communications",
    description: "AI-prepared email drafts held for approval with full audit visibility.",
    color: "#3cadf1",
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Reports & Insights",
    description: "Revenue, lead growth and portfolio distribution in interactive dashboards.",
    color: "#50b546",
    highlight: false,
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Connect your firm",
    description: "Import clients, configure SSO and set review policies for your team.",
  },
  {
    step: "02",
    title: "Let AI agents work",
    description: "Documents processed, onboarding guided and emails drafted overnight.",
  },
  {
    step: "03",
    title: "Review & decide",
    description: "Approve exceptions and focus on high-value accountancy decisions.",
  },
] as const;

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Agents", href: "#agents" },
  { label: "Platform", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
] as const;

const demoHighlights = [
  {
    icon: UserPlus,
    title: "Guided client onboarding",
    description: "See how AI walks new clients through document collection in their own language.",
    color: "#50b546",
  },
  {
    icon: Sparkles,
    title: "Live AI agent walkthrough",
    description: "Watch document processing, email drafts and review queues in real time.",
    color: "#3cadf1",
  },
  {
    icon: Users,
    title: "Firm setup consultation",
    description: "We'll map your client volume, team structure and onboarding workflow.",
    color: "#e2008e",
  },
] as const;

const firmSizeOptions = [
  { value: "solo", label: "Solo practitioner" },
  { value: "2-10", label: "2–10 staff" },
  { value: "11-50", label: "11–50 staff" },
  { value: "51-200", label: "51–200 staff" },
  { value: "200+", label: "200+ staff" },
] as const;

function BrandHexagon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.15" />
      <polygon points="50,15 83,32.5 83,67.5 50,85 17,67.5 17,32.5" fill="url(#hexGrad)" opacity="0.9" />
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3cadf1" />
          <stop offset="50%" stopColor="#50b546" />
          <stop offset="100%" stopColor="#e2008e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SectionLabel({ children, color = "#3cadf1" }: { children: ReactNode; color?: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>
      {children}
    </p>
  );
}

type DemoFormState = {
  fullName: string;
  email: string;
  firmName: string;
  firmSize: string;
  phone: string;
  message: string;
};

const initialDemoForm: DemoFormState = {
  fullName: "",
  email: "",
  firmName: "",
  firmSize: "",
  phone: "",
  message: "",
};

function RequestDemoForm() {
  const [form, setForm] = useState<DemoFormState>(initialDemoForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof DemoFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.firmName.trim() || !form.firmSize) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      toast.success("Demo request received — we'll be in touch within 24 hours.", {
        description: "Check your inbox for a calendar invite from our onboarding team.",
      });
      setForm(initialDemoForm);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="demo-full-name" className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
            Full name <span className="text-[#e2008e]">*</span>
          </Label>
          <Input
            id="demo-full-name"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Andrea Mitchell"
            required
            className="h-11 rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus-visible:border-[#3cadf1]/45 focus-visible:ring-[#3cadf1]/15"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo-email" className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
            Work email <span className="text-[#e2008e]">*</span>
          </Label>
          <Input
            id="demo-email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="andrea@yourfirm.co.uk"
            required
            className="h-11 rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus-visible:border-[#3cadf1]/45 focus-visible:ring-[#3cadf1]/15"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="demo-firm-name" className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
            Firm name <span className="text-[#e2008e]">*</span>
          </Label>
          <Input
            id="demo-firm-name"
            value={form.firmName}
            onChange={(e) => updateField("firmName", e.target.value)}
            placeholder="Harbour Lane Studio Ltd"
            required
            className="h-11 rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus-visible:border-[#3cadf1]/45 focus-visible:ring-[#3cadf1]/15"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
            Firm size <span className="text-[#e2008e]">*</span>
          </Label>
          <Select value={form.firmSize} onValueChange={(value) => updateField("firmSize", value)} required>
            <SelectTrigger className="h-11 rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus:ring-[#3cadf1]/15">
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent>
              {firmSizeOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-phone" className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
          Phone <span className="font-medium normal-case tracking-normal text-[#2c2a35]/40">(optional)</span>
        </Label>
        <Input
          id="demo-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="+44 7700 900000"
          className="h-11 rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus-visible:border-[#3cadf1]/45 focus-visible:ring-[#3cadf1]/15"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-message" className="text-[0.7rem] font-bold uppercase tracking-wide text-[#2c2a35]/55">
          What would you like to see?{" "}
          <span className="font-medium normal-case tracking-normal text-[#2c2a35]/40">(optional)</span>
        </Label>
        <Textarea
          id="demo-message"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          placeholder="e.g. multilingual onboarding for 200+ clients, AI document review workflow…"
          rows={3}
          className="min-h-[5.5rem] resize-none rounded-xl border-[#2c2a35]/10 bg-white shadow-sm focus-visible:border-[#3cadf1]/45 focus-visible:ring-[#3cadf1]/15"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-[#3cadf1] text-sm font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(60,173,241,0.65)] transition-all hover:bg-[#35a3e3] hover:shadow-[0_14px_28px_-8px_rgba(60,173,241,0.7)] active:scale-[0.99] disabled:opacity-70"
      >
        {isSubmitting ? "Sending request…" : "Request your demo"}
        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
      </Button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-[#2c2a35]/50">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#50b546]" />
        No commitment required. We'll only use your details to schedule and prepare your personalised demo.
      </p>
    </form>
  );
}

const kpiIcons: Record<string, ReactNode> = {
  clients: <Users className="h-5 w-5" />,
  onboarding: <UserPlus className="h-5 w-5" />,
  documents: <FileText className="h-5 w-5" />,
  tasks: <ListChecks className="h-5 w-5" />,
  ai: <Sparkles className="h-5 w-5" />,
};

const kpiAccent: Record<string, string> = {
  clients: "#3cadf1",
  onboarding: "#50b546",
  documents: "#e2008e",
  tasks: "#3cadf1",
  ai: "#50b546",
};

function LandingPage() {
  const automationTotal = aiAutomationMetrics.reduce((sum, m) => sum + m.value, 0);

  return (
    <div className="min-h-[100dvh] scroll-smooth bg-[#eef1f6] text-[#2c2a35]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#2c2a35]/6 bg-white">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="/" className="flex min-w-0 items-center">
            <img src="/logo_black.png" alt="LexaRox Accounts" className="h-8 w-auto sm:h-8" />
          </a>

          <nav className="hidden items-center gap-1 rounded-full border border-[#2c2a35]/8 bg-[#f8f9fb] p-1 md:flex">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#2c2a35]/65 transition-all hover:bg-white hover:text-[#3cadf1] hover:shadow-sm"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#2c2a35]/12 bg-white px-4 font-semibold text-[#2c2a35] hover:bg-[#f4f6f9] sm:px-5"
            >
              <a href="#request-demo">Request demo</a>
            </Button>

            <Button
              asChild
              className="rounded-xl bg-[#3cadf1] px-4 font-bold shadow-[0_8px_22px_-6px_rgba(60,173,241,0.6)] hover:bg-[#35a3e3] sm:px-5"
            >
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(60,173,241,0.2),transparent_42%),radial-gradient(circle_at_88%_12%,rgba(80,181,70,0.14),transparent_38%),radial-gradient(circle_at_72%_88%,rgba(226,0,142,0.1),transparent_36%)]"
        />
        <BrandHexagon className="pointer-events-none absolute -right-16 top-24 h-64 w-64 text-[#3cadf1] opacity-40" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3cadf1]/30 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0284c7] shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#50b546] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#50b546]" />
              </span>
              AI-first accountancy operations
            </span>

            <h1 className="mt-7 max-w-2xl text-[2.15rem] font-bold leading-[1.08] tracking-tight sm:text-[2.85rem] lg:text-[3.15rem]">
              AI handles the work.
              <span className="mt-2 block bg-gradient-to-r from-[#3cadf1] via-[#50b546] to-[#e2008e] bg-clip-text text-transparent">
                You handle the decisions.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[#2c2a35]/68">
              LexaRox Accounts unifies clients, documents, onboarding, tasks and AI review in one calm
              workspace — the same platform powering your operations dashboard.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-[#3cadf1] px-8 font-bold shadow-[0_12px_28px_-8px_rgba(60,173,241,0.7)] hover:bg-[#35a3e3]"
              >
                <a href="#request-demo">
                  Request a demo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-[#2c2a35]/12 bg-white/90 px-7 font-semibold hover:bg-white"
              >
                <Link to="/login">Sign in to workspace</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 rounded-xl px-7 font-semibold text-[#2c2a35]/70 hover:bg-white/60 hover:text-[#3cadf1]"
              >
                <a href="#features">Explore features</a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#2c2a35]/55">
              {["SSO ready", "Audit logging", "Multilingual onboarding"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#50b546]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#3cadf1]/25 via-transparent to-[#e2008e]/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 shadow-[0_32px_80px_-24px_rgba(44,42,53,0.35)]">
              <img
                src="/login-hero.png"
                alt="Accountancy professional using LexaRox Accounts"
                className="aspect-[4/5] w-full object-cover object-[center_18%] lg:aspect-[5/6]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c2a35]/85 via-[#2c2a35]/20 to-transparent" />

              {/* Floating dashboard card */}
              <div className="absolute left-4 right-4 top-4 rounded-2xl border border-white/25 bg-white/12 p-4 backdrop-blur-xl sm:left-6 sm:right-auto sm:max-w-[260px]">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white/95 px-2 py-1">
                    <img src="/logo_black.png" alt="" className="h-4 w-auto" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Operations Dashboard</p>
                    <p className="text-[0.65rem] text-white/65">Live · Updated 2 min ago</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {kpis.slice(0, 2).map((kpi) => (
                    <div key={kpi.label} className="rounded-lg bg-white/10 px-2.5 py-2">
                      <p className="text-sm font-bold tabular-nums text-white">{kpi.value}</p>
                      <p className="text-[0.6rem] leading-tight text-white/70">{kpi.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                      <Sparkles className="h-4 w-4 text-[#3cadf1]" />
                      126 AI actions today
                    </p>
                    <p className="mt-1 text-xs text-white/75">18 awaiting your review</p>
                  </div>
                  <div className="hidden rounded-xl bg-[#50b546] px-3 py-2 text-right sm:block">
                    <p className="text-lg font-bold text-white">98.4%</p>
                    <p className="text-[0.65rem] font-semibold text-white/85">Automated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="relative border-y border-[#2c2a35]/6 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[#2c2a35]/8 sm:grid-cols-4 lg:grid-cols-5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white px-5 py-5 sm:px-6">
                <p className="text-2xl font-bold tabular-nums text-[#2c2a35]">{kpi.value}</p>
                <p className="mt-1 text-xs font-semibold text-[#2c2a35]/75">{kpi.label}</p>
                <p className={cn("mt-1 text-[0.68rem] font-bold", kpi.up ? "text-[#2a8323]" : "text-[#dc2626]")}>
                  {kpi.trend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Platform features</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-[2.5rem]">
              Everything your firm runs on, in one place
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#2c2a35]/65">
              From client CRM to AI review queues — the same modules you use after sign-in, designed for
              clarity and speed.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            {features.map(({ icon: Icon, title, description, color, highlight }) => (
              <article
                key={title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-[#2c2a35]/8 bg-[#fafbfd] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(60,173,241,0.35)]",
                  highlight ? "lg:col-span-6 lg:p-8" : "lg:col-span-3",
                )}
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl shadow-sm"
                  style={{ backgroundColor: `${color}16`, color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className={cn("mt-5 font-bold", highlight ? "text-xl" : "text-base")}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2c2a35]/65">{description}</p>
                {highlight && (
                  <p className="mt-4 inline-flex items-center gap-1 text-xs font-bold" style={{ color }}>
                    Included in dashboard
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents + Live feed */}
      <section id="agents" className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,#2c2a35_0%,#1a1824_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="text-white">
              <SectionLabel color="#3cadf1">AI operations layer</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-[2.5rem]">
                Four agents working while you sleep
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Document processing, onboarding guidance, client communications and ledger review — automated
                with human approval built in.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "98.4% of actions fully automated",
                  "Multilingual onboarding support",
                  "Audit logging on every AI decision",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-white/85">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6fdb65]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {agents.map((agent) => (
                  <article
                    key={agent.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.09]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cadf1]/20 text-[#3cadf1]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide",
                          agent.status === "Active"
                            ? "bg-[#50b546]/20 text-[#6fdb65]"
                            : "bg-[#e2008e]/20 text-[#f472b6]",
                        )}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-white">{agent.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">{agent.description}</p>
                    <p className="mt-2 text-xs font-semibold text-[#3cadf1]">{agent.completed}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Live activity feed */}
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Live AI activity</p>
                  <p className="text-xs text-white/50">Real feed from your operations dashboard</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#50b546]/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-[#6fdb65]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fdb65]" />
                  Live
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {aiActivity.slice(0, 5).map((item, i) => (
                  <li
                    key={`${item.agent}-${i}`}
                    className="rounded-xl border border-white/8 bg-[#2c2a35]/60 p-4 transition-colors hover:border-[#3cadf1]/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#3cadf1]">{item.agent}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/85">{item.action}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase",
                          item.review
                            ? "bg-[#e2008e]/20 text-[#f472b6]"
                            : "bg-[#50b546]/20 text-[#6fdb65]",
                        )}
                      >
                        {item.review ? "Review" : "Done"}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-[0.65rem] text-white/45">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform + automation + pipeline */}
      <section id="platform" className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(60,173,241,0.06),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(226,0,142,0.05),transparent_38%)]"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel color="#e2008e">Live operations data</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-[2.5rem]">
              Built for real accountancy workloads
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#2c2a35]/65">
              The same KPIs, automation split and lead pipeline you see after sign-in — designed for firms
              managing high client volume every day.
            </p>
          </div>

          {/* KPI cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((kpi) => {
              const accent = kpiAccent[kpi.icon] ?? "#3cadf1";
              return (
                <article
                  key={kpi.label}
                  className="group relative overflow-hidden rounded-2xl border border-[#2c2a35]/8 bg-[#fafbfd] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(60,173,241,0.28)]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                  />
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    {kpiIcons[kpi.icon]}
                  </span>
                  <p className="mt-4 text-2xl font-bold tabular-nums text-[#2c2a35]">{kpi.value}</p>
                  <p className="mt-1 text-xs font-semibold leading-snug text-[#2c2a35]/75">{kpi.label}</p>
                  <p className="mt-2 text-[0.68rem] leading-relaxed text-[#2c2a35]/50">{kpi.support}</p>
                  <p className={cn("mt-2 text-xs font-bold", kpi.up ? "text-[#2a8323]" : "text-[#dc2626]")}>
                    {kpi.trend}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Automation breakdown */}
            <div className="rounded-[1.35rem] border border-[#2c2a35]/8 bg-gradient-to-br from-white to-[#f4f8fc] p-7 shadow-[0_12px_40px_-20px_rgba(44,42,53,0.15)] lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#3cadf1]/12 text-[#3cadf1]">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">AI automation split</h3>
                  <p className="text-sm text-[#2c2a35]/55">{automationTotal} total actions today</p>
                </div>
              </div>

              <div className="relative mx-auto mt-8 grid h-44 w-44 place-items-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#3cadf1 0 ${(126 / automationTotal) * 100}%, #50b546 ${(126 / automationTotal) * 100}% ${((126 + 18) / automationTotal) * 100}%, #e2008e ${((126 + 18) / automationTotal) * 100}% 100%)`,
                  }}
                />
                <div className="absolute inset-[14%] rounded-full bg-[#fafbfd] shadow-inner" />
                <div className="relative text-center">
                  <p className="text-2xl font-bold tabular-nums text-[#2c2a35]">98.4%</p>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#2c2a35]/50">
                    Automated
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {aiAutomationMetrics.map((m) => (
                  <li
                    key={m.name}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#2c2a35]/6 bg-white/80 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="truncate text-sm font-medium text-[#2c2a35]/80">{m.name}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lead pipeline */}
            <div className="rounded-[1.35rem] border border-[#2c2a35]/8 bg-gradient-to-br from-white to-[#f4fbf4] p-7 shadow-[0_12px_40px_-20px_rgba(44,42,53,0.15)] lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#50b546]/12 text-[#50b546]">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Client conversion pipeline</h3>
                  <p className="text-sm text-[#2c2a35]/55">From lead to fully active client</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {leadConversionVelocity.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, #3cadf1, #50b546)`,
                        opacity: 1 - i * 0.1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-[#2c2a35]/85">{stage.stage}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-[#2c2a35]/50">{stage.count} clients</span>
                          <span className="font-bold tabular-nums text-[#3cadf1]">{stage.conversion}</span>
                        </div>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#eef1f6]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: stage.conversion,
                            background: `linear-gradient(90deg, #3cadf1, #50b546)`,
                            opacity: 1 - i * 0.1,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 rounded-xl border border-[#50b546]/20 bg-[#50b546]/8 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#50b546]" />
                <p className="text-sm text-[#2c2a35]/70">
                  <span className="font-bold text-[#2a8323]">51% conversion</span> from initial lead to fully
                  active client across your portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — timeline */}
      <section id="how-it-works" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <SectionLabel color="#50b546">How it works</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-[2.5rem]">
              Up and running in three steps
            </h2>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div
              aria-hidden
              className="absolute left-[16.67%] right-[16.67%] top-10 hidden h-0.5 bg-gradient-to-r from-[#3cadf1] via-[#50b546] to-[#e2008e] md:block"
            />
            {steps.map(({ step, title, description }) => (
              <article
                key={step}
                className="relative rounded-2xl border border-[#2c2a35]/8 bg-[#fafbfd] p-7 text-center shadow-sm"
              >
                <span className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#3cadf1] to-[#50b546] text-lg font-bold text-white shadow-lg">
                  {step}
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2c2a35]/65">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Request a demo — onboarding */}
      <section id="request-demo" className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(80,181,70,0.12),transparent_40%),radial-gradient(circle_at_92%_80%,rgba(60,173,241,0.1),transparent_38%),linear-gradient(180deg,#eef1f6_0%,#f8fafc_100%)]"
        />
        <BrandHexagon className="pointer-events-none absolute -left-20 bottom-12 h-56 w-56 text-[#50b546] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
            {/* Left — value proposition */}
            <div>
              <SectionLabel color="#50b546">User onboarding</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-[2.5rem]">
                See how your firm gets onboarded — in 30 minutes
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#2c2a35]/65">
                Book a personalised walkthrough with our team. We'll show you client onboarding, AI document
                processing and your operations dashboard — tailored to your firm size and workflow.
              </p>

              <ul className="mt-8 space-y-5">
                {demoHighlights.map(({ icon: Icon, title, description, color }) => (
                  <li key={title} className="flex gap-4">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm"
                      style={{ backgroundColor: `${color}14`, color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-[#2c2a35]">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#2c2a35]/60">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#2c2a35]/8 bg-white/80 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[#3cadf1]">
                    <Calendar className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-wide">Typical response</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-[#2c2a35]">Within 24 hrs</p>
                  <p className="mt-1 text-xs text-[#2c2a35]/55">Calendar invite sent to your inbox</p>
                </div>
                <div className="rounded-2xl border border-[#2c2a35]/8 bg-white/80 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[#50b546]">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-wide">Demo duration</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-[#2c2a35]">30 min</p>
                  <p className="mt-1 text-xs text-[#2c2a35]/55">Live screen-share with Q&amp;A</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-[#50b546]/20 bg-[#50b546]/8 px-5 py-4">
                <Building2 className="h-5 w-5 shrink-0 text-[#50b546]" />
                <p className="text-sm text-[#2c2a35]/75">
                  Trusted by accountancy firms managing{" "}
                  <span className="font-bold text-[#2a8323]">1,000+ active clients</span> on the platform.
                </p>
              </div>
            </div>

            {/* Right — form card */}
            <div className="overflow-hidden rounded-[1.75rem] border border-[#2c2a35]/8 bg-white shadow-[0_24px_64px_-28px_rgba(44,42,53,0.2)]">
              <div
                aria-hidden
                className="h-1.5 bg-gradient-to-r from-[#50b546] via-[#3cadf1] to-[#e2008e]"
              />

              <div className="p-7 sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3cadf1]">
                      Request a demo
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-[#2c2a35]">Start your firm onboarding</h3>
                    <p className="mt-1.5 text-sm text-[#2c2a35]/55">
                      Tell us about your firm and we'll prepare a tailored session.
                    </p>
                  </div>
                  <span className="hidden shrink-0 rounded-full border border-[#50b546]/25 bg-[#50b546]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-[#2a8323] sm:inline-flex">
                    Free · No credit card
                  </span>
                </div>

                <div className="mt-7">
                  <RequestDemoForm />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-5 border-t border-[#2c2a35]/6 pt-6 text-xs font-semibold text-[#2c2a35]/45">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Prefer a call? We'll reach out
                  </span>
                  <span className="hidden h-3 w-px bg-[#2c2a35]/12 sm:block" aria-hidden />
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#50b546]" />
                    GDPR-compliant data handling
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f7fb] to-white py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(60,173,241,0.1),transparent_42%),radial-gradient(circle_at_85%_40%,rgba(80,181,70,0.08),transparent_40%)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#2c2a35]/8 bg-white shadow-[0_24px_64px_-28px_rgba(44,42,53,0.18)]">
            <div
              aria-hidden
              className="h-1.5 bg-gradient-to-r from-[#3cadf1] via-[#50b546] to-[#e2008e]"
            />

            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
              <div>
                <img src="/logo_black.png" alt="LexaRox Accounts" className="h-11 w-auto sm:h-12" />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#2c2a35] sm:text-[2.35rem]">
                  Ready to enter your workspace?
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-[#2c2a35]/65 sm:text-lg">
                  Sign in to access your CRM dashboard, AI review queue and client operations — all in one
                  place.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-xl bg-[#3cadf1] px-8 font-bold text-white shadow-[0_10px_24px_-8px_rgba(60,173,241,0.55)] hover:bg-[#35a3e3]"
                  >
                    <Link to="/login">
                      Sign in now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl border-[#2c2a35]/12 bg-white px-8 font-semibold text-[#2c2a35] hover:bg-[#f4f6f9]"
                  >
                    <a href="#request-demo">Request a demo</a>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#2c2a35]/8 bg-[#fafbfd] p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3cadf1]">
                  What you get after sign-in
                </p>
                <ul className="mt-5 space-y-4">
                  {[
                    { label: "Operations dashboard", value: "Real-time KPIs & charts" },
                    { label: "AI review queue", value: "18 items awaiting approval" },
                    { label: "Client CRM", value: "1,284 active clients" },
                    { label: "AI automation", value: "126 actions completed today" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-4 border-b border-[#2c2a35]/6 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#50b546]" />
                        <span className="text-sm font-semibold text-[#2c2a35]/85">{item.label}</span>
                      </div>
                      <span className="text-right text-xs font-medium text-[#2c2a35]/50">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl bg-gradient-to-r from-[#3cadf1]/10 to-[#50b546]/10 px-4 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#2c2a35]/80">
                    <ShieldCheck className="h-4 w-4 text-[#3cadf1]" />
                    SSO & audit logging included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2c2a35]/8 bg-[#2c2a35] py-14 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="inline-flex rounded-xl bg-white px-4 py-2.5">
                <img src="/logo_black.png" alt="LexaRox Accounts" className="h-7 w-auto" />
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                AI-first accountancy operations — clients, documents, onboarding and review in one unified
                workspace.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3cadf1]">Platform</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/65">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#agents" className="transition-colors hover:text-white">AI Agents</a></li>
                <li><a href="#platform" className="transition-colors hover:text-white">Live data</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-white">How it works</a></li>
                <li><a href="#request-demo" className="transition-colors hover:text-white">Request a demo</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#50b546]">Access</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/65">
                <li>
                  <a href="#request-demo" className="transition-colors hover:text-white">
                    Request a demo
                  </a>
                </li>
                <li>
                  <Link to="/login" className="transition-colors hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="transition-colors hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/45">
              © {new Date().getFullYear()} LexaRox Accounts. All rights reserved.
            </p>
            <p className="text-xs text-white/35">Built for modern accountancy firms.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
