import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Check, CreditCard, Briefcase } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { ProgressBar, Section, StatusBadge } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { platformSubscriptionPlans, platformServiceCatalogue } from "@/lib/platform-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/firms/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboard Firm — LexaRox Platform" },
      {
        name: "description",
        content: "Onboard a new subscriber accountancy firm onto the LexaRox platform.",
      },
    ],
  }),
  component: FirmOnboardingPage,
});

const steps = [
  { id: 1, label: "Firm details", icon: Building2 },
  { id: 2, label: "Subscription plan", icon: CreditCard },
  { id: 3, label: "Service catalogue", icon: Briefcase },
  { id: 4, label: "Review & activate", icon: Check },
] as const;

function FirmOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [firmName, setFirmName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  const [planId, setPlanId] = useState("premium");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    platformServiceCatalogue.filter((s) => s.status === "Active").slice(0, 4).map((s) => s.id),
  );

  const selectedPlan = platformSubscriptionPlans.find((p) => p.id === planId);
  const progress = Math.round((step / steps.length) * 100);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleComplete = () => {
    toast.success(`${firmName || "New firm"} onboarded successfully`);
    navigate({ to: "/firms" });
  };

  return (
    <AppShell>
      <PageBackLink to="/firms" label="Back to firms" />

      <PageHeader
        title="Onboard subscriber firm"
        subtitle="Register a new accountancy firm, assign a plan and configure their service catalogue."
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
                  done && !active && "border-emerald-200 bg-emerald-50 text-emerald-700",
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
        <Section title="Firm details" description="Core information for the subscriber company">
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
            <div className="sm:col-span-2">
              <Label htmlFor="firmName">Firm name</Label>
              <Input id="firmName" value={firmName} onChange={(e) => setFirmName(e.target.value)} placeholder="e.g. Harper & Lane LLP" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="contactName">Primary contact</Label>
              <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="admin@firm.co.uk" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, UK" className="mt-1.5" />
            </div>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Subscription plan" description="Select the LexaRox plan for this firm">
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-5">
            {platformSubscriptionPlans.filter((p) => p.status === "Active").map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanId(plan.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all hover:border-[#3cadf1]/40",
                  planId === plan.id && "border-[#3cadf1] bg-[#3cadf1]/5 ring-1 ring-[#3cadf1]/30",
                )}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-1 text-sm text-[#3cadf1]">{plan.price}/mo</p>
                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{plan.seats} seats · {plan.clients} clients</p>
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section
          title="Service catalogue"
          description="Select which platform services this firm can offer to their end clients"
        >
          <ul className="divide-y">
            {platformServiceCatalogue.filter((s) => s.status !== "Deprecated").map((service) => (
              <li key={service.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.category} · {service.defaultPrice}</p>
                </div>
                <Switch
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {step === 4 && (
        <Section title="Review & activate" description="Confirm details before activating the firm">
          <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Firm</dt>
              <dd className="mt-1 text-sm font-semibold">{firmName || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Contact</dt>
              <dd className="mt-1 text-sm">{contactName || "—"} · {contactEmail || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt>
              <dd className="mt-1 text-sm">{selectedPlan?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Services enabled</dt>
              <dd className="mt-1 text-sm">{selectedServices.length} catalogue services</dd>
            </div>
          </dl>
          <div className="border-t px-4 py-3 sm:px-5">
            <StatusBadge tone="info">Firm will start in Onboarding status until setup is complete</StatusBadge>
          </div>
        </Section>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-2">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          Previous
        </Button>
        <div className="flex gap-2">
          {step < steps.length ? (
            <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={handleComplete}>
              Activate firm
            </Button>
          )}
          <Button variant="ghost" asChild>
            <Link to="/firms">Cancel</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
