import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, CreditCard, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { PlatformFormField } from "@/components/platform-form-field";
import { ProgressBar, Section } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  platformPlanAgents,
  type PlatformSubscriptionPlan,
} from "@/lib/platform-data";
import { addSubscriptionPlan } from "@/lib/subscription-plans-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriptions/create")({
  head: () => ({
    meta: [
      { title: "Create subscription plan — LexaRox Platform" },
      { name: "description", content: "Define pricing, limits and AI agent access for a new platform subscription plan." },
    ],
  }),
  component: CreateSubscriptionPlanPage,
});

const steps = [
  { id: 1, label: "Plan limits", icon: CreditCard },
  { id: 2, label: "Plan details", icon: Building2 },
  { id: 3, label: "AI agents", icon: Sparkles },
] as const;

type PlanForm = {
  name: string;
  price: string;
  billingPeriod: PlatformSubscriptionPlan["billingPeriod"];
  clients: string;
  seats: string;
  aiActionsLimit: string;
  description: string;
  status: PlatformSubscriptionPlan["status"];
  enabledAgents: Record<string, boolean>;
};

const defaultEnabledAgents = Object.fromEntries(
  platformPlanAgents.map((agent) => [agent.id, agent.id !== "marketing"]),
) as Record<string, boolean>;

const emptyPlanForm: PlanForm = {
  name: "",
  price: "£99",
  billingPeriod: "Monthly",
  clients: "100",
  seats: "3",
  aiActionsLimit: "5000",
  description: "",
  status: "Active",
  enabledAgents: defaultEnabledAgents,
};

function CreateSubscriptionPlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PlanForm>(emptyPlanForm);

  const clients = parseInt(form.clients, 10) || 0;
  const seats = parseInt(form.seats, 10) || 0;
  const aiActionsLimit = parseInt(form.aiActionsLimit, 10) || 0;
  const progress = Math.round((step / steps.length) * 100);

  const validateStep1 = () => {
    if (!form.name.trim()) {
      toast.error("Plan name is required");
      return false;
    }
    if (!seats || seats < 1) {
      toast.error("Seat limit must be at least 1");
      return false;
    }
    if (!clients || clients < 1) {
      toast.error("Client limit must be at least 1");
      return false;
    }
    if (aiActionsLimit < 0) {
      toast.error("AI actions limit cannot be negative");
      return false;
    }
    return true;
  };

  const createPlan = () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    const enabledAgents = platformPlanAgents
      .filter((agent) => form.enabledAgents[agent.id])
      .map((agent) => agent.id);

    const newPlan: PlatformSubscriptionPlan = {
      id: `plan-${Date.now()}`,
      name: form.name.trim(),
      price: form.price.trim(),
      billingPeriod: form.billingPeriod,
      clients: clients || 100,
      seats: seats || 3,
      aiActionsLimit: aiActionsLimit || 5000,
      description: form.description.trim() || "New subscription tier.",
      firmsSubscribed: 0,
      status: form.status,
      features: enabledAgents.map((id) => platformPlanAgents.find((a) => a.id === id)?.name ?? id),
      enabledAgents,
    };

    addSubscriptionPlan(newPlan);
    toast.success("Plan created");
    navigate({ to: "/subscriptions" });
  };

  return (
    <AppShell>
      <PageBackLink to="/subscriptions" label="Back to Subscription Management" />

      <PageHeader
        title="Create subscription plan"
        subtitle="Configure limits, pricing and AI agent access for subscriber firms."
      />

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {step} of {steps.length}
          </span>
          <span className="font-medium">{progress}% complete</span>
        </div>
        <ProgressBar value={progress} />
        <ol className="mt-4 flex flex-wrap gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const active = s.id === step;
            const done = s.id < step;
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium",
                  active && "border-[#3cadf1] bg-[#3cadf1]/10 text-[#3cadf1]",
                  done && !active && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
                  !active && !done && "text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </li>
            );
          })}
        </ol>
      </div>

      {step === 1 && (
        <Section title="Plan limits" description="Set the plan name, pricing and resource caps">
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5 sm:pb-5">
            <PlatformFormField label="Plan name" htmlFor="plan-name" className="sm:col-span-2">
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Lexarox Premium"
              />
            </PlatformFormField>

            <PlatformFormField label="Price" htmlFor="plan-price">
              <Input
                id="plan-price"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="£249"
              />
            </PlatformFormField>
            <PlatformFormField label="Billing period" htmlFor="plan-period">
              <Select
                value={form.billingPeriod}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, billingPeriod: v as PlanForm["billingPeriod"] }))
                }
              >
                <SelectTrigger id="plan-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </PlatformFormField>
            <PlatformFormField label="Seat limit" htmlFor="plan-seats">
              <Input
                id="plan-seats"
                type="number"
                min={1}
                value={form.seats}
                onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
              />
            </PlatformFormField>
            <PlatformFormField label="Client limit" htmlFor="plan-clients">
              <Input
                id="plan-clients"
                type="number"
                min={1}
                value={form.clients}
                onChange={(e) => setForm((f) => ({ ...f, clients: e.target.value }))}
              />
            </PlatformFormField>
            <PlatformFormField label="AI actions limit (monthly)" htmlFor="plan-ai-actions" className="sm:col-span-2">
              <Input
                id="plan-ai-actions"
                type="number"
                min={0}
                step={100}
                value={form.aiActionsLimit}
                onChange={(e) => setForm((f) => ({ ...f, aiActionsLimit: e.target.value }))}
                placeholder="5000"
              />
            </PlatformFormField>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Plan details" description="Availability and description for subscriber firms">
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5 sm:pb-5">
            <PlatformFormField label="Status" htmlFor="plan-status" className="sm:col-span-2">
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as PlanForm["status"] }))}
              >
                <SelectTrigger id="plan-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </PlatformFormField>
            <PlatformFormField label="Description" htmlFor="plan-desc" className="sm:col-span-2">
              <Textarea
                id="plan-desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Full Phase 1 modules — AML, proposals, tasks, AI communication and reports."
              />
            </PlatformFormField>
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section
          title="AI Agent Policy & Master Controls"
          description="Enable, pause, or adjust confidence thresholds for autonomous agents"
        >
          <ul className="divide-y">
            {platformPlanAgents.map((agent) => (
              <li
                key={agent.id}
                className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#3cadf1]/15 text-[#3cadf1]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <Switch
                  checked={form.enabledAgents[agent.id] ?? false}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({
                      ...f,
                      enabledAgents: { ...f.enabledAgents, [agent.id]: checked },
                    }))
                  }
                  aria-label={`Enable ${agent.name}`}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          Previous
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" className="text-[#3cadf1]" asChild>
            <Link to="/subscriptions">Cancel</Link>
          </Button>
          {step < steps.length ? (
            <Button
              className="bg-[#3cadf1] hover:bg-[#3cadf1]/90"
              onClick={() => {
                if (step === 1 && !validateStep1()) return;
                setStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={createPlan}>
              Create plan
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
