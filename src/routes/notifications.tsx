import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Search, MailOpen, Mail, AlertCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import {
  EmptyState,
  KpiCard,
  ListTableCard,
  ListTablePagination,
  ListTablePrimaryCell,
  StatusBadge,
} from "@/components/kit";
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
import { platformNotifications, type PlatformNotification } from "@/lib/platform-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — LexaRox Platform" },
      {
        name: "description",
        content: "Platform alerts for firms, billing, inquiries and system events.",
      },
    ],
  }),
  component: NotificationsPage,
});

function categoryTone(category: PlatformNotification["category"]) {
  switch (category) {
    case "Billing":
      return "warning" as const;
    case "Inquiry":
      return "info" as const;
    case "Firm":
      return "success" as const;
    case "Subscription":
      return "primary" as const;
    default:
      return "neutral" as const;
  }
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState(platformNotifications);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const unreadCount = notifications.filter((item) => !item.read).length;
  const todayCount = notifications.filter((item) =>
    ["min ago", "hr ago", "hrs ago"].some((part) => item.received.includes(part)),
  ).length;
  const billingAlerts = notifications.filter((item) => item.category === "Billing" && !item.read).length;

  const rows = useMemo(
    () =>
      notifications.filter((item) => {
        const search = query.trim().toLowerCase();
        const matchesSearch =
          !search ||
          [item.title, item.message, item.firmName ?? "", item.category]
            .join(" ")
            .toLowerCase()
            .includes(search);
        const matchesCategory = category === "all" || item.category === category;
        const matchesRead =
          readFilter === "all" ||
          (readFilter === "unread" && !item.read) ||
          (readFilter === "read" && item.read);
        return matchesSearch && matchesCategory && matchesRead;
      }),
    [notifications, query, category, readFilter],
  );

  const pagination = usePagination(rows, { resetKey: `${query}-${category}-${readFilter}` });

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    toast.success("Notification marked as read");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    toast.success("All notifications marked as read");
  };

  const toolbar = (
    <>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notifications, firms or messages…"
          className="h-10 border-transparent bg-background/80 pl-9 shadow-sm"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-10 w-full sm:w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="Firm">Firm</SelectItem>
          <SelectItem value="Billing">Billing</SelectItem>
          <SelectItem value="Inquiry">Inquiry</SelectItem>
          <SelectItem value="Subscription">Subscription</SelectItem>
          <SelectItem value="System">System</SelectItem>
        </SelectContent>
      </Select>
      <Select value={readFilter} onValueChange={setReadFilter}>
        <SelectTrigger className="h-10 w-full sm:w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        subtitle="Platform alerts for firm activity, billing events, inquiries and system updates."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={markAllRead}>
              <MailOpen className="h-4 w-4" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total notifications"
          value={String(notifications.length)}
          trend="Platform inbox"
          up
          support="All alerts"
          icon={<Bell className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Unread"
          value={String(unreadCount)}
          trend="Needs review"
          up={unreadCount === 0}
          support="Awaiting action"
          icon={<Mail className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Recent"
          value={String(todayCount)}
          trend="Last 24 hours"
          up
          support="Fresh alerts"
          icon={<Bell className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="Billing alerts"
          value={String(billingAlerts)}
          trend="Unread billing"
          up={billingAlerts === 0}
          support="Payment & renewals"
          icon={<AlertCircle className="h-5 w-5" />}
          variant="green"
        />
      </div>

      <ListTableCard toolbar={toolbar}>
        {rows.length === 0 ? (
          <EmptyState title="No notifications found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[14rem]">Notification</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Firm</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                  <TableHead className="text-right w-[7rem]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.pageItems.map((item) => (
                  <TableRow key={item.id} className={cn(!item.read && "bg-[#3cadf1]/5")}>
                    <TableCell>
                      <ListTablePrimaryCell title={item.title} subtitle={item.message} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={categoryTone(item.category)}>{item.category}</StatusBadge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {item.firmName ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={item.read ? "neutral" : "info"} dot>
                        {item.read ? "Read" : "Unread"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{item.received}</TableCell>
                    <TableCell className="text-right">
                      {!item.read ? (
                        <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => markAsRead(item.id)}>
                          Mark read
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
