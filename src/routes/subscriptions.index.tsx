import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Building2, PoundSterling, TrendingUp, Plus, Download } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { KpiCard, ListTablePagination, ListTablePrimaryCell, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { usePagination } from "@/hooks/use-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  firmBillingRecords,
  subscriberFirms,
  type PlatformSubscriptionPlan,
  type FirmBillingRecord,
} from "@/lib/platform-data";
import { downloadCsv } from "@/lib/export-csv";
import { getSubscriptionPlans, setSubscriptionPlans } from "@/lib/subscription-plans-store";
import { toast } from "sonner";

export const Route = createFileRoute("/subscriptions/")({
  head: () => ({
    meta: [
      { title: "Subscription Management — LexaRox Platform" },
      { name: "description", content: "Manage platform subscription plans and billing across all subscriber firms." },
    ],
  }),
  loader: () => getSubscriptionPlans(),
  component: SubscriptionManagementPage,
});

type PlanForm = {
  name: string;
  price: string;
  billingPeriod: PlatformSubscriptionPlan["billingPeriod"];
  clients: string;
  seats: string;
  description: string;
  status: PlatformSubscriptionPlan["status"];
};

const emptyPlanForm: PlanForm = {
  name: "",
  price: "£99",
  billingPeriod: "Monthly",
  clients: "100",
  seats: "3",
  description: "",
  status: "Active",
};

function SubscriptionManagementPage() {
  const loadedPlans = Route.useLoaderData();
  const [plans, setPlans] = useState(loadedPlans);
  const [billing] = useState(firmBillingRecords);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<FirmBillingRecord | null>(null);
  const [planForm, setPlanForm] = useState<PlanForm>(emptyPlanForm);

  const updatePlans = (updater: (prev: PlatformSubscriptionPlan[]) => PlatformSubscriptionPlan[]) => {
    setPlans((prev) => {
      const next = updater(prev);
      setSubscriptionPlans(next);
      return next;
    });
  };

  useEffect(() => {
    setPlans(loadedPlans);
  }, [loadedPlans]);

  const totalMrr = subscriberFirms.reduce((sum, f) => {
    const num = parseInt(f.mrr.replace(/[^\d]/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const failedBilling = billing.filter((b) => b.status === "Failed" || b.status === "Overdue").length;

  const plansPagination = usePagination(plans);
  const billingPagination = usePagination(billing);

  const exportBilling = () => {
    downloadCsv(
      "lexarox-platform-billing.csv",
      ["Invoice", "Firm", "Plan", "Amount", "Period", "Status", "Date"],
      billing.map((r) => [r.id, r.firmName, r.plan, r.amount, r.period, r.status, r.date]),
    );
    toast.success("Billing export downloaded");
  };

  const openEditPlan = (plan: PlatformSubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      billingPeriod: plan.billingPeriod,
      clients: String(plan.clients),
      seats: String(plan.seats),
      description: plan.description,
      status: plan.status,
    });
    setPlanDialogOpen(true);
  };

  const savePlan = (): boolean => {
    if (!planForm.name.trim()) {
      toast.error("Plan name is required");
      return false;
    }
    if (!editingPlanId) return false;

    const clients = parseInt(planForm.clients, 10) || 100;
    const seats = parseInt(planForm.seats, 10) || 3;
    updatePlans((prev) =>
      prev.map((p) =>
        p.id === editingPlanId
          ? {
              ...p,
              name: planForm.name.trim(),
              price: planForm.price.trim(),
              billingPeriod: planForm.billingPeriod,
              clients,
              seats,
              description: planForm.description.trim() || p.description,
              status: planForm.status,
            }
          : p,
      ),
    );
    toast.success("Plan updated");
    return true;
  };

  const openInvoice = (record: FirmBillingRecord) => {
    setSelectedInvoice(record);
    setInvoiceDialogOpen(true);
  };

  return (
    <AppShell>
      <PageHeader
        title="Subscription Management"
        subtitle="Manage platform subscription plans and billing across all subscriber firms."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportBilling}>
              <Download className="h-4 w-4" /> Export billing
            </Button>
            <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" asChild>
              <Link to="/subscriptions/create">
                <Plus className="h-4 w-4" /> Create plan
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Platform MRR" value={`£${totalMrr.toLocaleString()}`} trend="+8.4%" up={true} support="Recurring revenue" icon={<PoundSterling className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Active Plans" value={String(plans.filter((p) => p.status === "Active").length)} trend="5 tiers" up={true} support="Available to firms" icon={<CreditCard className="h-5 w-5" />} variant="green" />
        <KpiCard label="Subscriber Firms" value={String(subscriberFirms.length)} trend="+3 this month" up={true} support="On platform" icon={<Building2 className="h-5 w-5" />} variant="purple" />
        <KpiCard label="Billing Issues" value={String(failedBilling)} trend="Needs attention" up={false} support="Failed or overdue" icon={<TrendingUp className="h-5 w-5" />} variant="amber" />
      </div>

      <Section title="Subscription plans" description="Platform-wide plans available to subscriber firms">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[14rem]">Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Limits</TableHead>
              <TableHead>Firms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plansPagination.pageItems.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell><ListTablePrimaryCell title={plan.name} subtitle={plan.description} /></TableCell>
                <TableCell className="font-medium tabular-nums">{plan.price}/{plan.billingPeriod === "Monthly" ? "mo" : "yr"}</TableCell>
                <TableCell className="text-muted-foreground">{plan.clients} clients · {plan.seats} seats</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{plan.firmsSubscribed}</TableCell>
                <TableCell><StatusBadge tone={plan.status === "Active" ? "success" : "neutral"}>{plan.status}</StatusBadge></TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => openEditPlan(plan)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ListTablePagination
          page={plansPagination.page}
          totalPages={plansPagination.totalPages}
          totalItems={plansPagination.totalItems}
          rangeStart={plansPagination.rangeStart}
          rangeEnd={plansPagination.rangeEnd}
          onPageChange={plansPagination.setPage}
        />
      </Section>

      <Section title="Recent billing" description="Cross-firm billing activity" className="mt-5">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead className="min-w-[10rem]">Firm</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingPagination.pageItems.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{record.id}</TableCell>
                <TableCell>
                  <Link to="/firms/$firmId" params={{ firmId: record.firmId }} className="font-semibold hover:text-[#3cadf1] transition-colors">
                    {record.firmName}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{record.plan}</TableCell>
                <TableCell className="font-medium tabular-nums">{record.amount}</TableCell>
                <TableCell className="text-muted-foreground">{record.period}</TableCell>
                <TableCell><StatusBadge tone={toneForStatus(record.status)}>{record.status}</StatusBadge></TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => openInvoice(record)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ListTablePagination
          page={billingPagination.page}
          totalPages={billingPagination.totalPages}
          totalItems={billingPagination.totalItems}
          rangeStart={billingPagination.rangeStart}
          rangeEnd={billingPagination.rangeEnd}
          onPageChange={billingPagination.setPage}
        />
      </Section>

      <FormDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        title="Edit subscription plan"
        description="Update pricing, limits and availability for subscriber firms."
        saveLabel="Save changes"
        onSave={savePlan}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformFormField label="Plan name" htmlFor="plan-name" className="sm:col-span-2">
            <Input id="plan-name" value={planForm.name} onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))} placeholder="Lexarox Premium" />
          </PlatformFormField>
          <PlatformFormField label="Price" htmlFor="plan-price">
            <Input id="plan-price" value={planForm.price} onChange={(e) => setPlanForm((f) => ({ ...f, price: e.target.value }))} placeholder="£249" />
          </PlatformFormField>
          <PlatformFormField label="Billing period" htmlFor="plan-period">
            <Select value={planForm.billingPeriod} onValueChange={(v) => setPlanForm((f) => ({ ...f, billingPeriod: v as PlanForm["billingPeriod"] }))}>
              <SelectTrigger id="plan-period"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Client limit" htmlFor="plan-clients">
            <Input id="plan-clients" type="number" value={planForm.clients} onChange={(e) => setPlanForm((f) => ({ ...f, clients: e.target.value }))} />
          </PlatformFormField>
          <PlatformFormField label="Seat limit" htmlFor="plan-seats">
            <Input id="plan-seats" type="number" value={planForm.seats} onChange={(e) => setPlanForm((f) => ({ ...f, seats: e.target.value }))} />
          </PlatformFormField>
          <PlatformFormField label="Status" htmlFor="plan-status" className="sm:col-span-2">
            <Select value={planForm.status} onValueChange={(v) => setPlanForm((f) => ({ ...f, status: v as PlanForm["status"] }))}>
              <SelectTrigger id="plan-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Description" htmlFor="plan-desc" className="sm:col-span-2">
            <Textarea id="plan-desc" rows={3} value={planForm.description} onChange={(e) => setPlanForm((f) => ({ ...f, description: e.target.value }))} />
          </PlatformFormField>
        </div>
      </FormDialog>

      <FormDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        title={selectedInvoice ? `Invoice ${selectedInvoice.id}` : "Invoice"}
        description={selectedInvoice ? `${selectedInvoice.firmName} · ${selectedInvoice.period}` : undefined}
        saveLabel="Download PDF"
        onSave={() => {
          if (selectedInvoice) {
            downloadCsv(
              `${selectedInvoice.id}.csv`,
              ["Field", "Value"],
              [
                ["Invoice", selectedInvoice.id],
                ["Firm", selectedInvoice.firmName],
                ["Plan", selectedInvoice.plan],
                ["Amount", selectedInvoice.amount],
                ["Period", selectedInvoice.period],
                ["Status", selectedInvoice.status],
                ["Date", selectedInvoice.date],
              ],
            );
            toast.success("Invoice downloaded");
          }
          return true;
        }}
      >
        {selectedInvoice && (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt className="text-xs uppercase text-muted-foreground">Firm</dt><dd className="mt-1 font-medium">{selectedInvoice.firmName}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Amount</dt><dd className="mt-1 font-medium">{selectedInvoice.amount}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Plan</dt><dd className="mt-1">{selectedInvoice.plan}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge tone={toneForStatus(selectedInvoice.status)}>{selectedInvoice.status}</StatusBadge></dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Billing period</dt><dd className="mt-1">{selectedInvoice.period}</dd></div>
            <div><dt className="text-xs uppercase text-muted-foreground">Date</dt><dd className="mt-1">{selectedInvoice.date}</dd></div>
          </dl>
        )}
      </FormDialog>
    </AppShell>
  );
}
