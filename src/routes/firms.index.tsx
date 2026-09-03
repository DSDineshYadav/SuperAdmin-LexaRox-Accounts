import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Building2, CheckCircle2, UserPlus, AlertTriangle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, ListTableCard, ListTablePagination, ListTablePrimaryCell, StatusBadge, toneForStatus } from "@/components/kit";
import { usePagination } from "@/hooks/use-pagination";
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
import { subscriberFirms } from "@/lib/platform-data";

export const Route = createFileRoute("/firms/")({
  head: () => ({
    meta: [
      { title: "Firm Management — LexaRox Platform" },
      {
        name: "description",
        content: "Onboard, configure and manage subscriber accountancy firms on the LexaRox platform.",
      },
    ],
  }),
  component: FirmsPage,
});

function FirmsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const activeFirms = subscriberFirms.filter((f) => f.status === "Active").length;
  const onboardingFirms = subscriberFirms.filter((f) => f.status === "Onboarding" || f.status === "Trial").length;
  const suspendedFirms = subscriberFirms.filter((f) => f.status === "Suspended").length;

  const rows = useMemo(
    () =>
      subscriberFirms.filter(
        (f) =>
          (status === "all" || f.status === status) &&
          (f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.contactName.toLowerCase().includes(query.toLowerCase()) ||
            f.location.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, status],
  );

  const pagination = usePagination(rows, { resetKey: `${query}-${status}` });

  const toolbar = (
    <>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search firms, contacts or location…"
          className="h-10 border-transparent bg-background/80 pl-9 shadow-sm"
        />
      </div>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-10 w-full sm:w-48">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Onboarding">Onboarding</SelectItem>
          <SelectItem value="Trial">Trial</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <AppShell>
      <PageHeader
        title="Firm Management"
        subtitle="Onboard, configure and manage subscriber accountancy firms on the LexaRox platform."
        actions={
          <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold" asChild>
            <Link to="/firms/onboarding">
              <Plus className="h-4 w-4" /> Onboard firm
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Firms"
          value={String(subscriberFirms.length)}
          trend="+3 this month"
          up={true}
          support="Subscriber companies"
          icon={<Building2 className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Active"
          value={String(activeFirms)}
          trend="Healthy"
          up={true}
          support="Fully operational"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Onboarding / Trial"
          value={String(onboardingFirms)}
          trend="In progress"
          up={true}
          support="Setup or evaluation"
          icon={<UserPlus className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Suspended"
          value={String(suspendedFirms)}
          trend="Action needed"
          up={false}
          support="Billing or compliance"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <ListTableCard toolbar={toolbar}>
        {rows.length === 0 ? (
          <EmptyState title="No firms found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[14rem]">Firm</TableHead>
                  <TableHead className="min-w-[9rem]">Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Clients</TableHead>
                  <TableHead className="hidden lg:table-cell">Staff</TableHead>
                  <TableHead className="hidden lg:table-cell">MRR</TableHead>
                  <TableHead className="hidden sm:table-cell min-w-[7rem]">Last activity</TableHead>
                  <TableHead className="text-right w-[7rem]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.pageItems.map((firm) => (
                <TableRow key={firm.id}>
                  <TableCell>
                    <ListTablePrimaryCell
                      title={
                        <Link
                          to="/firms/$firmId"
                          params={{ firmId: firm.id }}
                          className="hover:text-[#3cadf1] transition-colors"
                        >
                          {firm.name}
                        </Link>
                      }
                      subtitle={firm.location}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{firm.plan}</TableCell>
                  <TableCell>
                    <StatusBadge tone={toneForStatus(firm.status)}>{firm.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">
                    {firm.clientCount}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums text-muted-foreground">
                    {firm.staffCount}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-medium tabular-nums">{firm.mrr}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{firm.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-3" asChild>
                      <Link to="/firms/$firmId" params={{ firmId: firm.id }}>
                        Manage
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            <ListTablePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              rangeStart={pagination.rangeStart}
              rangeEnd={pagination.rangeEnd}
              onPageChange={pagination.setPage}
            />
          </>
        )}
      </ListTableCard>
    </AppShell>
  );
}
