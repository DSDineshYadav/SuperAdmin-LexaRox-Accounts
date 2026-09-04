import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shield, Users, Plug, Bell, ScrollText, Lock, Download } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { KpiCard, Section, StatusBadge } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  platformRoles,
  platformIntegrations,
  auditLogs,
  platformAdmin,
  type PlatformIntegration,
} from "@/lib/platform-data";
import { getPlatformUsers } from "@/lib/platform-users-store";
import { downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "System Administration — LexaRox Platform" },
      {
        name: "description",
        content: "Platform roles, integrations, notifications and audit logs.",
      },
    ],
  }),
  component: SettingsPage,
});

const defaultNotifications = [
  { id: "n1", name: "Firm onboarding complete", desc: "Notify platform admins when a firm finishes setup", enabled: true },
  { id: "n2", name: "Billing failure alert", desc: "Immediate alert when firm payment fails", enabled: true },
  { id: "n3", name: "New inquiry received", desc: "Sales/support inquiry routing notification", enabled: true },
  { id: "n4", name: "Weekly platform summary", desc: "MRR, firm count and activity digest to Super Admins", enabled: true },
  { id: "n5", name: "Security audit events", desc: "Critical security events and role changes", enabled: true },
];

function SettingsPage() {
  const platformUserCount = getPlatformUsers().length;
  const [integrations, setIntegrations] = useState(platformIntegrations);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState<PlatformIntegration | null>(null);
  const [apiKey, setApiKey] = useState("");

  const openConnect = (integration: PlatformIntegration) => {
    setConnectingIntegration(integration);
    setApiKey("");
    setConnectDialogOpen(true);
  };

  const connectIntegration = (): boolean => {
    if (!connectingIntegration) return false;
    if (!apiKey.trim()) {
      toast.error("API key or credentials are required");
      return false;
    }
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === connectingIntegration.id ? { ...i, status: "Connected" as const, firmsConnected: i.firmsConnected || 1 } : i,
      ),
    );
    toast.success(`${connectingIntegration.name} connected`);
    return true;
  };

  const exportAuditLog = () => {
    downloadCsv(
      "lexarox-platform-audit-log.csv",
      ["ID", "Action", "Actor", "Target", "Timestamp", "IP"],
      auditLogs.map((log) => [log.id, log.action, log.actor, log.target, log.timestamp, log.ip]),
    );
    toast.success("Audit log exported");
  };

  return (
    <AppShell>
      <PageHeader
        title="System Administration"
        subtitle="Roles & permissions, integrations, notifications and audit logs."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Platform Roles" value={String(platformRoles.length)} trend="RBAC configured" up={true} support="Access control" icon={<Shield className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Platform Users" value={String(platformUserCount)} trend="LexaRox staff" up={true} support="Internal accounts" icon={<Users className="h-5 w-5" />} variant="green" />
        <KpiCard label="Integrations" value={String(integrations.filter((i) => i.status === "Connected").length)} trend="Connected" up={true} support="Platform connectors" icon={<Plug className="h-5 w-5" />} variant="purple" />
        <KpiCard label="Audit Events" value={String(auditLogs.length)} trend="Recent activity" up={true} support="Consolidated logs" icon={<ScrollText className="h-5 w-5" />} variant="amber" />
      </div>

      <Tabs defaultValue="roles">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-5">
          <Section title="Platform administrator" description="Signed-in Super Admin account">
            <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
              <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt><dd className="mt-1 text-sm font-semibold">{platformAdmin.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 text-sm">{platformAdmin.email}</dd></div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
                <dd className="mt-1">
                  <StatusBadge tone="primary"><Lock className="mr-1 h-3 w-3" />{platformAdmin.role}</StatusBadge>
                </dd>
              </div>
            </dl>
          </Section>
        </TabsContent>

        <TabsContent value="integrations" className="mt-5">
          <Section title="Platform integrations" description="Connectors available across the platform">
            <ul className="divide-y">
              {integrations.map((integration) => (
                <li key={integration.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="font-semibold">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {integration.firmsConnected > 0 && (
                      <span className="text-xs text-muted-foreground">{integration.firmsConnected} firms</span>
                    )}
                    <StatusBadge tone={integration.status === "Connected" ? "success" : integration.status === "Available" ? "info" : "neutral"}>
                      {integration.status}
                    </StatusBadge>
                    {integration.status === "Available" && (
                      <Button size="sm" variant="outline" onClick={() => openConnect(integration)}>Connect</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <Section title="Platform notifications" description="System-wide notification policies">
            <ul className="divide-y">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[#3cadf1]" />
                    <div>
                      <p className="text-sm font-medium">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={n.enabled}
                    onCheckedChange={(checked) => {
                      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, enabled: checked } : item)));
                      toast.success(`${n.name} ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="audit" className="mt-5">
          <Section title="Consolidated audit logs" description="Platform-wide administrative actions">
            <ul className="divide-y">
              {auditLogs.map((log) => (
                <li key={log.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        <ScrollText className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                        {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.actor} · {log.target}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <p>{log.timestamp}</p>
                      <p className="font-mono">{log.ip}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t px-4 py-3 sm:px-5">
              <Button size="sm" variant="outline" onClick={exportAuditLog}>
                <Download className="h-4 w-4" /> Export full audit log
              </Button>
            </div>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        title={connectingIntegration ? `Connect ${connectingIntegration.name}` : "Connect integration"}
        description="Enter API credentials to enable this connector platform-wide."
        saveLabel="Connect"
        onSave={connectIntegration}
      >
        <PlatformFormField label="API key / credentials" htmlFor="int-key">
          <Input id="int-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API key" />
        </PlatformFormField>
      </FormDialog>
    </AppShell>
  );
}
