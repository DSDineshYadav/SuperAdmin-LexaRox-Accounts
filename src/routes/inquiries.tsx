import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Search, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, ListTableCard, ListTablePagination, ListTablePrimaryCell, PriorityBadge, Section, StatusBadge, toneForStatus } from "@/components/kit";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { platformInquiries, platformAdmin, type PlatformInquiry } from "@/lib/platform-data";
import { toast } from "sonner";

export const Route = createFileRoute("/inquiries")({
  head: () => ({
    meta: [
      { title: "Inquiry Management — LexaRox Platform" },
      {
        name: "description",
        content: "Manage inbound platform-level inquiries — sales, support and partnership requests.",
      },
    ],
  }),
  component: InquiryManagementPage,
});

function InquiryManagementPage() {
  const [inquiries, setInquiries] = useState(platformInquiries);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<PlatformInquiry | null>(null);

  const openCount = inquiries.filter((i) => i.status === "New" || i.status === "In Progress").length;
  const urgentCount = inquiries.filter((i) => i.priority === "Urgent").length;
  const resolvedCount = inquiries.filter((i) => i.status === "Resolved" || i.status === "Closed").length;

  const rows = useMemo(
    () =>
      inquiries.filter(
        (i) =>
          (type === "all" || i.type === type) &&
          (status === "all" || i.status === status) &&
          (i.subject.toLowerCase().includes(query.toLowerCase()) ||
            i.contactName.toLowerCase().includes(query.toLowerCase()) ||
            (i.firmName?.toLowerCase().includes(query.toLowerCase()) ?? false)),
      ),
    [inquiries, query, type, status],
  );

  const pagination = usePagination(rows, { resetKey: `${query}-${type}-${status}` });

  const updateInquiry = (id: string, patch: Partial<PlatformInquiry>) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const assignInquiry = () => {
    if (!selected) return;
    updateInquiry(selected.id, { status: "In Progress", assignedTo: platformAdmin.name });
    toast.success(`${selected.id} assigned to ${platformAdmin.name}`);
  };

  const resolveInquiry = () => {
    if (!selected) return;
    updateInquiry(selected.id, { status: "Resolved" });
    toast.success(`${selected.id} marked resolved`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Inquiry Management"
        subtitle="Manage inbound platform-level inquiries — sales demos, support requests and partnership enquiries."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Inquiries" value={String(openCount)} trend={`${urgentCount} urgent`} up={urgentCount === 0} support="Needs response" icon={<MessageSquare className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Urgent" value={String(urgentCount)} trend="Priority queue" up={false} support="Immediate attention" icon={<AlertCircle className="h-5 w-5" />} variant="amber" />
        <KpiCard label="In Progress" value={String(inquiries.filter((i) => i.status === "In Progress").length)} trend="Assigned" up={true} support="Being handled" icon={<Clock className="h-5 w-5" />} variant="purple" />
        <KpiCard label="Resolved" value={String(resolvedCount)} trend="This month" up={true} support="Closed inquiries" icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </div>

      <ListTableCard
        toolbar={
          <>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inquiries, contacts or firms…" className="h-10 border-transparent bg-background/80 pl-9 shadow-sm" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10 w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        {rows.length === 0 ? (
          <EmptyState title="No inquiries found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[7.5rem]">Reference</TableHead>
                  <TableHead className="min-w-[14rem]">Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[10rem]">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Received</TableHead>
                  <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.pageItems.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inq.id}</TableCell>
                  <TableCell><ListTablePrimaryCell title={inq.subject} subtitle={inq.firmName} /></TableCell>
                  <TableCell><StatusBadge tone="neutral">{inq.type}</StatusBadge></TableCell>
                  <TableCell><PriorityBadge priority={inq.priority} /></TableCell>
                  <TableCell><StatusBadge tone={toneForStatus(inq.status)}>{inq.status}</StatusBadge></TableCell>
                  <TableCell className="hidden md:table-cell"><ListTablePrimaryCell title={inq.contactName} subtitle={inq.contactEmail} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{inq.received}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => setSelected(inq)}>View</Button>
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.subject}</SheetTitle>
                <SheetDescription>{selected.id} · {selected.type} · Received {selected.received}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={selected.priority} />
                  <StatusBadge tone={toneForStatus(selected.status)}>{selected.status}</StatusBadge>
                </div>
                <Section title="Contact">
                  <dl className="grid gap-3 p-4 sm:px-5">
                    <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt><dd className="mt-1 text-sm font-medium">{selected.contactName}</dd></div>
                    <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 text-sm">{selected.contactEmail}</dd></div>
                    {selected.firmName && <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Firm</dt><dd className="mt-1 text-sm">{selected.firmName}</dd></div>}
                    {selected.assignedTo && <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Assigned to</dt><dd className="mt-1 text-sm">{selected.assignedTo}</dd></div>}
                  </dl>
                </Section>
                <Section title="Message">
                  <p className="p-4 text-sm leading-relaxed text-muted-foreground sm:px-5">{selected.message}</p>
                </Section>
                <div className="flex flex-wrap gap-2">
                  {selected.status !== "Resolved" && selected.status !== "Closed" && (
                    <>
                      <Button size="sm" onClick={assignInquiry} disabled={selected.status === "In Progress"}>
                        {selected.status === "In Progress" ? "Assigned" : "Assign & respond"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resolveInquiry}>Mark resolved</Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
