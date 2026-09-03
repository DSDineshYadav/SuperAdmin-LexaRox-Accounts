import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Search, Plus, ToggleLeft, CheckCircle2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { EmptyState, KpiCard, ListTableCard, ListTablePrimaryCell, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { platformServiceCatalogue, type PlatformCatalogueService } from "@/lib/platform-data";
import { toast } from "sonner";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Manage Services — LexaRox Platform" },
      {
        name: "description",
        content: "Configure the platform service catalogue available for subscriber firms to offer their clients.",
      },
    ],
  }),
  component: ManageServicesPage,
});

type ServiceForm = {
  name: string;
  category: string;
  description: string;
  defaultPrice: string;
  status: PlatformCatalogueService["status"];
  clientTypes: string;
};

const emptyForm: ServiceForm = {
  name: "",
  category: "Compliance",
  description: "",
  defaultPrice: "",
  status: "Draft",
  clientTypes: "Limited Company",
};

function ManageServicesPage() {
  const [services, setServices] = useState(platformServiceCatalogue);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const activeCount = services.filter((s) => s.status === "Active").length;
  const categories = [...new Set(services.map((s) => s.category))];

  const rows = useMemo(
    () =>
      services.filter(
        (s) =>
          (category === "all" || s.category === category) &&
          (statusFilter === "all" || s.status === statusFilter) &&
          (s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase())),
      ),
    [services, query, category, statusFilter],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (service: PlatformCatalogueService) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      defaultPrice: service.defaultPrice,
      status: service.status,
      clientTypes: service.clientTypes.join(", "),
    });
    setDialogOpen(true);
  };

  const saveService = (): boolean => {
    if (!form.name.trim()) {
      toast.error("Service name is required");
      return false;
    }
    const clientTypes = form.clientTypes.split(",").map((t) => t.trim()).filter(Boolean);
    if (editingId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, ...form, clientTypes: clientTypes.length ? clientTypes : s.clientTypes }
            : s,
        ),
      );
      toast.success("Service updated");
    } else {
      const newService: PlatformCatalogueService = {
        id: `svc-${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || "No description provided.",
        defaultPrice: form.defaultPrice.trim() || "TBC",
        status: form.status,
        firmsEnabled: 0,
        clientTypes: clientTypes.length ? clientTypes : ["Limited Company"],
      };
      setServices((prev) => [newService, ...prev]);
      toast.success("Service added to catalogue");
    }
    return true;
  };

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? ("Draft" as const) : ("Active" as const) }
          : s,
      ),
    );
    toast.success("Service availability updated");
  };

  return (
    <AppShell>
      <PageHeader
        title="Manage Services (Firm-Wide)"
        subtitle="Platform service catalogue — configure master services and enable them per firm for client offerings."
        actions={
          <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add service
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Catalogue Services" value={String(services.length)} trend={`${activeCount} active`} up={true} support="Platform-wide" icon={<Briefcase className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Categories" value={String(categories.length)} trend="Compliance & Advisory" up={true} support="Service groupings" icon={<ToggleLeft className="h-5 w-5" />} variant="green" />
        <KpiCard label="Firms Enabled" value={String(Math.max(...services.map((s) => s.firmsEnabled), 0))} trend="Max adoption" up={true} support="Most-used service" icon={<CheckCircle2 className="h-5 w-5" />} variant="purple" />
        <KpiCard label="Draft Services" value={String(services.filter((s) => s.status === "Draft").length)} trend="Pending launch" up={true} support="Not yet available" icon={<Briefcase className="h-5 w-5" />} variant="amber" />
      </div>

      <ListTableCard
        toolbar={
          <>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services…" className="h-10 border-transparent bg-background/80 pl-9 shadow-sm" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-full sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        {rows.length === 0 ? (
          <EmptyState title="No services found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[14rem]">Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Default price</TableHead>
                <TableHead>Client types</TableHead>
                <TableHead>Firms enabled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((service) => (
                <TableRow key={service.id}>
                  <TableCell><ListTablePrimaryCell title={service.name} subtitle={service.description} /></TableCell>
                  <TableCell className="text-muted-foreground">{service.category}</TableCell>
                  <TableCell className="text-muted-foreground">{service.defaultPrice}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {service.clientTypes.slice(0, 2).map((t) => (
                        <StatusBadge key={t} tone="neutral" className="text-[0.65rem]">{t}</StatusBadge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{service.firmsEnabled}</TableCell>
                  <TableCell><StatusBadge tone={toneForStatus(service.status)}>{service.status}</StatusBadge></TableCell>
                  <TableCell><Switch checked={service.status === "Active"} onCheckedChange={() => toggleStatus(service.id)} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => openEdit(service)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ListTableCard>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingId ? "Edit catalogue service" : "Add catalogue service"}
        description="Configure a platform-wide service that subscriber firms can offer to their clients."
        saveLabel={editingId ? "Save changes" : "Add service"}
        onSave={saveService}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformFormField label="Service name" htmlFor="svc-name" className="sm:col-span-2">
            <Input id="svc-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. VAT Returns" />
          </PlatformFormField>
          <PlatformFormField label="Category" htmlFor="svc-category">
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger id="svc-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Advisory">Advisory</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Status" htmlFor="svc-status">
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ServiceForm["status"] }))}>
              <SelectTrigger id="svc-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Default price" htmlFor="svc-price">
            <Input id="svc-price" value={form.defaultPrice} onChange={(e) => setForm((f) => ({ ...f, defaultPrice: e.target.value }))} placeholder="From £120 / quarter" />
          </PlatformFormField>
          <PlatformFormField label="Client types" htmlFor="svc-types" hint="Comma-separated list">
            <Input id="svc-types" value={form.clientTypes} onChange={(e) => setForm((f) => ({ ...f, clientTypes: e.target.value }))} placeholder="Limited Company, Sole Trader" />
          </PlatformFormField>
          <PlatformFormField label="Description" htmlFor="svc-desc" className="sm:col-span-2">
            <Textarea id="svc-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description of the service…" />
          </PlatformFormField>
        </div>
      </FormDialog>
    </AppShell>
  );
}
