import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  Settings2,
  Search,
  ToggleLeft,
  Plus,
  ArrowUpDown,
  Copy,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  firmServiceCatalogue,
  firmServiceItems,
  firmServicePackages,
  type FirmServiceItem,
  type FirmServicePackage,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type ServicesSearch = {
  tab?: "services" | "packages";
};

export const Route = createFileRoute("/services/")({
  validateSearch: (search: Record<string, unknown>): ServicesSearch => ({
    tab:
      search.tab === "services" || search.tab === "packages" ? search.tab : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Manage Services — LexaRox Accounts" },
      {
        name: "description",
        content: "Select and configure which services from the LexaRox platform catalogue your firm offers to clients.",
      },
    ],
  }),
  component: ManageServicesPage,
});

const clientTypeFilters = [
  "All",
  "Private Limited Company",
  "Public Limited Company",
  "Self Assessment",
] as const;

function PanelToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-5">
      {children}
    </div>
  );
}

function DataTableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {children}
    </div>
  );
}

function ManageServicesPage() {
  const { tab: searchTab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = searchTab ?? "services";

  const [services, setServices] = useState(firmServiceItems);
  const [packages, setPackages] = useState(firmServicePackages);
  const [servicesQuery, setServicesQuery] = useState("");
  const [servicesFilter, setServicesFilter] = useState<(typeof clientTypeFilters)[number]>("All");
  const [packagesQuery, setPackagesQuery] = useState("");

  const setTab = (value: string) => {
    navigate({
      to: "/services",
      search: { tab: value as ServicesSearch["tab"] },
      replace: true,
    });
  };

  const enabledCount = firmServiceCatalogue.filter((s) => s.enabled).length;
  const totalSubscribers = firmServiceCatalogue.reduce((sum, s) => sum + s.clientsSubscribed, 0);

  const serviceRows = useMemo(() => {
    const q = servicesQuery.toLowerCase();
    return services.filter((s) => {
      const matchesQuery =
        s.internalName.toLowerCase().includes(q) ||
        s.serviceName.toLowerCase().includes(q) ||
        s.clientTypes.toLowerCase().includes(q);
      const matchesFilter =
        servicesFilter === "All" ||
        s.clientTypes.toLowerCase().includes(servicesFilter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [services, servicesQuery, servicesFilter]);

  const packageRows = useMemo(() => {
    const q = packagesQuery.toLowerCase();
    return packages.filter(
      (p) =>
        p.serviceName.toLowerCase().includes(q) ||
        p.internalPackageName.toLowerCase().includes(q),
    );
  }, [packages, packagesQuery]);

  const duplicateService = (item: FirmServiceItem) => {
    const copy: FirmServiceItem = {
      ...item,
      id: `svc-${Date.now()}`,
      internalName: `${item.internalName} (Copy)`,
      serviceName: `${item.serviceName} (Copy)`,
    };
    setServices((prev) => [...prev, copy]);
    toast.success(`Duplicated "${item.serviceName}"`);
  };

  const deleteService = (item: FirmServiceItem) => {
    setServices((prev) => prev.filter((s) => s.id !== item.id));
    toast.success(`Deleted "${item.serviceName}"`);
  };

  const duplicatePackage = (item: FirmServicePackage) => {
    const copy: FirmServicePackage = {
      ...item,
      id: `pkg-${Date.now()}`,
      serviceName: `${item.serviceName} (Copy)`,
      internalPackageName: `${item.internalPackageName} (Copy)`,
    };
    setPackages((prev) => [...prev, copy]);
    toast.success(`Duplicated "${item.serviceName}"`);
  };

  const deletePackage = (item: FirmServicePackage) => {
    setPackages((prev) => prev.filter((p) => p.id !== item.id));
    toast.success(`Deleted "${item.serviceName}"`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Manage Services"
        subtitle="Select and configure which services from the platform's service catalogue your firm offers to its clients."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Catalogue Services"
          value={String(firmServiceCatalogue.length)}
          trend="Platform-wide"
          up={true}
          support="Available from LexaRox"
          icon={<Briefcase className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Enabled for Firm"
          value={String(enabledCount)}
          trend={`${Math.round((enabledCount / firmServiceCatalogue.length) * 100)}% active`}
          up={true}
          support="Offered to your clients"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Client Subscriptions"
          value={String(totalSubscribers)}
          trend="Across portfolio"
          up={true}
          support="Active service assignments"
          icon={<ToggleLeft className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="Disabled Services"
          value={String(firmServiceCatalogue.length - enabledCount)}
          trend="Not offered"
          up={true}
          support="Available to enable"
          icon={<Settings2 className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList className="mb-1 flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-muted/50 p-1.5">
          <TabsTrigger
            value="services"
            className="rounded-lg px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
          >
            Services
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            className="rounded-lg px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
          >
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-4">
          <DataTableShell>
            <PanelToolbar>
              <div className="relative min-w-[200px] flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={servicesQuery}
                  onChange={(e) => setServicesQuery(e.target.value)}
                  placeholder="Search…"
                  className="h-9 border-border/60 bg-background pl-9"
                />
              </div>
              <Select value={servicesFilter} onValueChange={(v) => setServicesFilter(v as typeof servicesFilter)}>
                <SelectTrigger className="h-9 w-[180px] border-border/60 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clientTypeFilters.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                asChild
                className="ml-auto bg-[#3cadf1] font-semibold text-white hover:bg-[#3cadf1]/90"
              >
                <Link to="/services/create">
                  <Plus className="h-4 w-4" />
                  Create service
                </Link>
              </Button>
            </PanelToolbar>

            {serviceRows.length === 0 ? (
              <EmptyState title="No services match" description="Try a different search or filter." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        Internal name <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      </span>
                    </TableHead>
                    <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        Service name <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      </span>
                    </TableHead>
                    <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Client types
                    </TableHead>
                    <TableHead className="w-[150px] px-5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRows.map((s) => (
                    <TableRow key={s.id} className="border-border/40 hover:bg-muted/20">
                      <TableCell className="px-5 py-3.5">
                        <Link
                          to="/services/$serviceId"
                          params={{ serviceId: s.id }}
                          className="text-sm font-medium text-[#3cadf1] underline-offset-2 hover:underline"
                        >
                          {s.internalName}
                        </Link>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-sm">{s.serviceName}</TableCell>
                      <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">{s.clientTypes}</TableCell>
                      <TableCell className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="text-sm font-medium text-[#3cadf1] hover:underline"
                            onClick={() => duplicateService(s)}
                          >
                            Duplicate
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteService(s)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTableShell>
        </TabsContent>

        <TabsContent value="packages" className="mt-4">
          <DataTableShell>
            <PanelToolbar>
              <div className="relative min-w-[200px] flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={packagesQuery}
                  onChange={(e) => setPackagesQuery(e.target.value)}
                  placeholder="Search…"
                  className="h-9 border-border/60 bg-background pl-9"
                />
              </div>
              <Button
                asChild
                className="ml-auto bg-[#3cadf1] font-semibold text-white hover:bg-[#3cadf1]/90"
              >
                <Link to="/services/packages/create">
                  <Plus className="h-4 w-4" />
                  Create package
                </Link>
              </Button>
            </PanelToolbar>

            {packageRows.length === 0 ? (
              <EmptyState title="No packages match" description="Try a different search term." />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                      <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          Service name <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        </span>
                      </TableHead>
                      <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          Internal package name <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        </span>
                      </TableHead>
                      <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Number of services
                      </TableHead>
                      <TableHead className="w-[130px] px-5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packageRows.map((p) => (
                      <TableRow key={p.id} className="border-border/40 hover:bg-muted/20">
                        <TableCell className="px-5 py-3.5 text-sm font-medium">{p.serviceName}</TableCell>
                        <TableCell className="px-5 py-3.5 text-sm">{p.internalPackageName}</TableCell>
                        <TableCell className="px-5 py-3.5 text-sm tabular-nums">{p.serviceCount}</TableCell>
                        <TableCell className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => duplicatePackage(p)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
                              <Link to="/services/packages/$packageId" params={{ packageId: p.id }}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => deletePackage(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 text-sm text-muted-foreground">
                  <p>
                    Showing <span className="font-semibold text-foreground">1 – {packageRows.length}</span> of{" "}
                    <span className="font-semibold text-foreground">{packageRows.length}</span> items
                  </p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-muted">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DataTableShell>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
