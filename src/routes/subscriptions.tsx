import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Users, Sparkles, Building2, Download, RefreshCw } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, ProgressBar, Section, StatusBadge } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { firmSubscription, subscriptionInvoices } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscription Management — LexaRox Accounts" },
      {
        name: "description",
        content: "Manage your firm's subscription and billing with LexaRox — plan, usage and invoices.",
      },
    ],
  }),
  component: SubscriptionManagementPage,
});

function SubscriptionManagementPage() {
  const sub = firmSubscription;
  const seatUsage = Math.round((sub.seatsUsed / sub.seats) * 100);
  const clientUsage = Math.round((sub.clientsUsed / sub.clientsLimit) * 100);
  const aiUsage = Math.round((sub.aiActionsUsed / sub.aiActionsLimit) * 100);

  return (
    <AppShell>
      <PageHeader
        title="Subscription & Billing"
        subtitle="Your firm's LexaRox subscription — plan, billing cycle, payment information and invoices."
        actions={
          <Button variant="outline" onClick={() => toast("Billing portal opened")}>
            <RefreshCw className="h-4 w-4" /> Manage billing
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Current Plan"
          value={sub.plan}
          trend={sub.status}
          up={true}
          support={`${sub.amount} / ${sub.billingCycle.toLowerCase()}`}
          icon={<CreditCard className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Staff Seats"
          value={`${sub.seatsUsed} / ${sub.seats}`}
          trend={`${seatUsage}% used`}
          up={seatUsage < 90}
          support="Internal user licences"
          icon={<Users className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Client Accounts"
          value={`${sub.clientsUsed} / ${sub.clientsLimit}`}
          trend={`${clientUsage}% used`}
          up={clientUsage < 90}
          support="Portfolio capacity"
          icon={<Building2 className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="AI Actions (month)"
          value={`${sub.aiActionsUsed.toLocaleString()}`}
          trend={`${aiUsage}% of limit`}
          up={aiUsage < 90}
          support={`Limit: ${sub.aiActionsLimit.toLocaleString()}`}
          icon={<Sparkles className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Current plan" description={`${sub.firmName} · Renews ${sub.renewalDate}`}>
          <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plan</dt>
              <dd className="mt-1 text-sm font-semibold">{sub.plan}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Subscription status</dt>
              <dd className="mt-1">
                <StatusBadge tone="success">{sub.status}</StatusBadge>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Billing cycle</dt>
              <dd className="mt-1 text-sm font-semibold">{sub.billingCycle}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Billing amount</dt>
              <dd className="mt-1 text-sm font-semibold">
                {sub.amount} / {sub.billingCycle.toLowerCase()}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Renewal date</dt>
              <dd className="mt-1 text-sm">{sub.renewalDate}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Next billing date</dt>
              <dd className="mt-1 text-sm">{sub.nextBilling}</dd>
            </div>
          </dl>
        </Section>

        <Section title="Billing & payment information">
          <dl className="grid gap-4 p-4 sm:px-5">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Payment method</dt>
              <dd className="mt-1 text-sm font-medium">{sub.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Billing email</dt>
              <dd className="mt-1 text-sm">{sub.billingEmail}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Billing address</dt>
              <dd className="mt-1 text-sm">{sub.billingAddress}</dd>
            </div>
            <Button variant="outline" size="sm" className="w-fit" onClick={() => toast("Payment method update opened")}>
              Update payment method
            </Button>
          </dl>
        </Section>
      </div>

      <Section title="Available plans" description="Upgrade or downgrade your Lexarox subscription" className="mt-5">
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:px-5">
          {sub.availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-4 ${plan.current ? "border-[#3cadf1] bg-[#3cadf1]/5" : "border-border"}`}
            >
              <p className="text-sm font-bold">{plan.name}</p>
              <p className="mt-1 text-2xl font-black">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Up to {plan.clients} clients · {plan.seats} seats
              </p>
              {plan.description && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{plan.description}</p>
              )}
              {plan.current ? (
                <StatusBadge tone="primary" className="mt-3">
                  Current plan
                </StatusBadge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => toast.success(`Plan change to ${plan.name} requested`)}
                >
                  {plan.id === "top-level" ? "Upgrade" : "Switch plan"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Usage this billing period" className="mt-5">
        <div className="grid gap-5 p-4 sm:grid-cols-3 sm:px-5">
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Staff seats</span>
              <span>
                {sub.seatsUsed} / {sub.seats}
              </span>
            </div>
            <ProgressBar value={seatUsage} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Client accounts</span>
              <span>
                {sub.clientsUsed} / {sub.clientsLimit}
              </span>
            </div>
            <ProgressBar value={clientUsage} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">AI actions</span>
              <span>
                {sub.aiActionsUsed.toLocaleString()} / {sub.aiActionsLimit.toLocaleString()}
              </span>
            </div>
            <ProgressBar value={aiUsage} tone="ai" />
          </div>
        </div>
      </Section>

      <Section title="Billing history" description="LexaRox subscription invoices" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Invoice</th>
                <th className="px-4 py-2.5 font-medium">Period</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscriptionInvoices.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{inv.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.period}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                  <td className="px-4 py-3 font-semibold">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={inv.status === "Paid" ? "success" : "warning"}>{inv.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast(`Downloading ${inv.id}`)}>
                      <Download className="mr-1 h-3.5 w-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </AppShell>
  );
}
