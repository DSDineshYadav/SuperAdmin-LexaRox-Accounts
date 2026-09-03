import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  UserCog,
  Mail,
  ListChecks,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { KpiCard, Section, StatusBadge, toneForStatus } from "@/components/kit";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staffUsers, tasks, firmRoles, permissionModules, type PermissionAction } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/$staffId")({
  loader: ({ params }) => {
    const staff = staffUsers.find((s) => s.id === params.staffId);
    if (!staff) throw notFound();
    return { staff };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Staff not found — LexaRox" }] };
    }
    return {
      meta: [
        { title: `${loaderData.staff.name} — Staff · LexaRox Accounts` },
        { name: "description", content: `Staff profile, permissions, tasks and workload for ${loaderData.staff.name}.` },
      ],
    };
  },
  component: StaffDetailPage,
});

function StaffDetailPage() {
  const { staff } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const assignedTasks = tasks.filter((t) => t.assignee === staff.name);
  const openTasks = assignedTasks.filter((t) => t.status !== "Completed");
  const roleConfig = firmRoles.find((r) => r.name === staff.role) ?? firmRoles[2];
  const workloadPct = Math.min(100, Math.round((openTasks.length / 8) * 100) + 30);

  const hasPermission = (moduleId: string, action: PermissionAction) =>
    roleConfig.grants[moduleId]?.includes(action) ?? false;

  return (
    <AppShell>
      <PageBackLink to="/staff" label="Back to Manage Staff" />
      <PageHeader
        title={staff.name}
        subtitle={`${staff.role} · ${staff.department} · Last login ${staff.lastLogin}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit staff
            </Button>
            {staff.status === "Active" ? (
              <Button variant="outline" onClick={() => setDeactivateOpen(true)}>
                <XCircle className="h-4 w-4" /> Deactivate
              </Button>
            ) : (
              <Button onClick={() => toast.success(`${staff.name} activated`)}>
                <CheckCircle2 className="h-4 w-4" /> Activate
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Status"
          value={staff.status}
          trend={staff.role}
          up={staff.status === "Active"}
          support={`Onboarded ${staff.onboarded}`}
          icon={<UserCog className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Assigned Clients"
          value={String(staff.assignedClients)}
          trend="Portfolio"
          up={true}
          support="Active client accounts"
          icon={<Users className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Open Tasks"
          value={String(openTasks.length)}
          trend={`${assignedTasks.length} total`}
          up={openTasks.length < 5}
          support="Assigned to this staff member"
          icon={<ListChecks className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Workload"
          value={`${workloadPct}%`}
          trend={workloadPct > 85 ? "High" : "Normal"}
          up={workloadPct <= 85}
          support="Current capacity utilisation"
          icon={<Shield className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs sm:text-sm">
            Permissions
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">
            Assigned Tasks ({openTasks.length})
          </TabsTrigger>
          <TabsTrigger value="workload" className="text-xs sm:text-sm">
            Workload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Section title="Staff information">
            <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                <dd className="mt-1 text-sm font-medium">{staff.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
                <dd className="mt-1">
                  <StatusBadge tone="primary">{staff.role}</StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Department</dt>
                <dd className="mt-1 text-sm">{staff.department}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <StatusBadge tone={toneForStatus(staff.status === "Pending onboarding" ? "Awaiting Documents" : staff.status)}>
                    {staff.status}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Quick actions">
            <ul className="divide-y">
              {[
                { label: "Send email", icon: Mail, action: () => toast(`Email composer opened for ${staff.email}`) },
                { label: "Assign clients", icon: Users, action: () => toast("Assign clients dialog opened") },
                { label: "View all tasks", icon: ListChecks, action: () => toast("Navigating to tasks") },
              ].map(({ label, icon: Icon, action }) => (
                <li key={label} className="px-4 py-3 sm:px-5">
                  <Button variant="ghost" className="h-auto w-full justify-start gap-2 p-0 font-medium" onClick={action}>
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="permissions" className="mt-5">
          <Section title="Role & permissions" description={`${staff.role} — inherited from firm role configuration`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Module</th>
                    {(["view", "create", "edit", "manage", "upload", "download"] as PermissionAction[]).map((a) => (
                      <th key={a} className="px-3 py-2.5 text-center font-medium capitalize">
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {permissionModules.map((mod) => (
                    <tr key={mod.id}>
                      <td className="px-4 py-3 font-medium">{mod.label}</td>
                      {(["view", "create", "edit", "manage", "upload", "download"] as PermissionAction[]).map((action) => {
                        const applicable = mod.permissions.some((p) => p.id === action);
                        const granted = applicable && hasPermission(mod.id, action);
                        return (
                          <td key={action} className="px-3 py-3 text-center">
                            {applicable ? (
                              granted ? (
                                <CheckCircle2 className="mx-auto h-4 w-4 text-[var(--success)]" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )
                            ) : (
                              <span className="text-muted-foreground/20">·</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="tasks" className="mt-5">
          <Section title="Assigned tasks" description={`${assignedTasks.length} tasks assigned to ${staff.name}`}>
            <ul className="divide-y">
              {assignedTasks.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground sm:px-5">No tasks assigned.</li>
              )}
              {assignedTasks.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.client} · due {t.due}
                    </p>
                  </div>
                  <StatusBadge tone={toneForStatus(t.status)}>{t.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="workload" className="mt-5">
          <Section title="Workload overview" description="Current task distribution and capacity">
            <div className="space-y-4 p-4 sm:px-5">
              <div>
                <div className="mb-1.5 flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Capacity utilisation</span>
                  <span>{workloadPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[#8b5cf6] transition-all"
                    style={{ width: `${workloadPct}%` }}
                  />
                </div>
              </div>
              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <dt className="text-xs text-muted-foreground">Open</dt>
                  <dd className="text-xl font-bold">{openTasks.length}</dd>
                </div>
                <div className="rounded-lg border p-3">
                  <dt className="text-xs text-muted-foreground">In progress</dt>
                  <dd className="text-xl font-bold">
                    {assignedTasks.filter((t) => t.status === "In Progress").length}
                  </dd>
                </div>
                <div className="rounded-lg border p-3">
                  <dt className="text-xs text-muted-foreground">Completed</dt>
                  <dd className="text-xl font-bold">
                    {assignedTasks.filter((t) => t.status === "Completed").length}
                  </dd>
                </div>
              </dl>
            </div>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit staff · ${staff.name}`}
        description="Update staff profile, role and department."
        onSave={() => toast.success(`${staff.name} updated`)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Full name</Label>
            <Input defaultValue={staff.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue={staff.email} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input defaultValue={staff.role} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Department</Label>
            <Input defaultValue={staff.department} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={`Deactivate ${staff.name}`}
        description="This will revoke platform access until the account is reactivated."
        saveLabel="Deactivate"
        onSave={() => toast.warning(`${staff.name} deactivated`)}
      >
        <div className="space-y-1.5">
          <Label>Reason</Label>
          <Select defaultValue="Left firm">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Left firm", "Temporary leave", "Access review"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </AppShell>
  );
}
