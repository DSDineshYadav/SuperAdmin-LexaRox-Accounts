import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, UserCog, UserPlus, CheckCircle2, Clock, MoreHorizontal, Mail, Eye, Pencil, UserX, Send, KeyRound } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDialog } from "@/components/form-dialog";
import { staffUsers, type StaffUser } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Manage Staff — LexaRox Accounts" },
      {
        name: "description",
        content: "Onboard and manage internal staff users, roles and platform access across your firm.",
      },
    ],
  }),
  component: ManageStaffPage,
});

const platformAccessServices = ["Payroll", "Accounts", "Bookkeeping"] as const;

function CheckboxGroup({
  label,
  description,
  options,
  selected,
  onToggle,
  getId,
  getLabel,
}: {
  label: string;
  description?: string;
  options: ReadonlyArray<{ id: string; label: string; sub?: string }>;
  selected: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
  getId: (item: { id: string; label: string; sub?: string }) => string;
  getLabel: (item: { id: string; label: string; sub?: string }) => string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-semibold">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border bg-muted/20 p-2">
        {options.map((item) => {
          const id = getId(item);
          return (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50",
                selected.has(id) && "bg-[#3cadf1]/8",
              )}
            >
              <Checkbox
                checked={selected.has(id)}
                onCheckedChange={(checked) => onToggle(id, checked === true)}
                className="mt-0.5 border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-snug">{getLabel(item)}</span>
                {item.sub && <span className="block text-xs text-muted-foreground">{item.sub}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ManageStaffPage() {
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [assignModules, setAssignModules] = useState<Set<string>>(new Set());
  const [inviteModules, setInviteModules] = useState<Set<string>>(new Set());
  const [editStaff, setEditStaff] = useState<StaffUser | null>(null);
  const [deactivateStaff, setDeactivateStaff] = useState<StaffUser | null>(null);
  const [emailStaff, setEmailStaff] = useState<StaffUser | null>(null);

  const activeStaff = staffUsers.filter((s) => s.status === "Active").length;
  const pendingStaff = staffUsers.filter((s) => s.status === "Pending onboarding").length;
  const adminStaff = staffUsers.filter((s) => s.role === "Admin" || s.role === "Manager").length;

  const rows = useMemo(
    () =>
      staffUsers.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.email.toLowerCase().includes(query.toLowerCase()) ||
          s.department.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const assignServiceOptions = useMemo(
    () => platformAccessServices.map((service) => ({ id: service, label: service })),
    [],
  );

  const allVisibleSelected = rows.length > 0 && rows.every((s) => selectedStaff.has(s.id));

  const toggleStaff = (id: string, checked: boolean) => {
    setSelectedStaff((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedStaff((prev) => {
      const next = new Set(prev);
      rows.forEach((s) => {
        if (checked) next.add(s.id);
        else next.delete(s.id);
      });
      return next;
    });
  };

  const toggleSetItem = (setter: Dispatch<SetStateAction<Set<string>>>, id: string, checked: boolean) => {
    setter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const openAssignFor = (staffIds: string[]) => {
    setSelectedStaff(new Set(staffIds));
    setAssignModules(new Set());
    setAssignOpen(true);
  };

  const handleAssign = () => {
    if (selectedStaff.size === 0) {
      toast.error("Select at least one staff member to assign.");
      return;
    }
    if (assignModules.size === 0) {
      toast.error("Select at least one platform access service.");
      return;
    }

    const names = staffUsers.filter((s) => selectedStaff.has(s.id)).map((s) => s.name);
    setAssignOpen(false);
    setSelectedStaff(new Set());
    setAssignModules(new Set());
    toast.success(`Assigned ${assignModules.size} service(s) to ${names.join(", ")}`);
  };

  const selectedStaffNames = staffUsers.filter((s) => selectedStaff.has(s.id)).map((s) => s.name);

  return (
    <AppShell>
      <PageHeader
        title="Manage Staff"
        subtitle="Onboard and manage internal staff users — roles, access and onboarding status across your firm."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {selectedStaff.size > 0 && (
              <Button variant="outline" onClick={() => openAssignFor([...selectedStaff])}>
                <KeyRound className="h-4 w-4" />
                Assign access ({selectedStaff.size})
              </Button>
            )}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold">
                  <Plus className="h-4 w-4" /> Invite staff user
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Invite a staff user</DialogTitle>
                  <DialogDescription>
                    Send an onboarding invitation and assign platform access using the checkboxes below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input placeholder="e.g. James Porter" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Work email</Label>
                    <Input type="email" placeholder="name@yourfirm.co.uk" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <Select defaultValue="Accountancy Staff">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Admin", "Manager", "Accountancy Staff", "Onboarding Specialist"].map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Department</Label>
                      <Select defaultValue="Accounts">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Management", "Client Services", "Accounts", "Onboarding"].map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CheckboxGroup
                    label="Assign platform access"
                    description="Select one or more services this staff member can access"
                    options={assignServiceOptions}
                    selected={inviteModules}
                    onToggle={(id, checked) => toggleSetItem(setInviteModules, id, checked)}
                    getId={(item) => item.id}
                    getLabel={(item) => item.label}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setInviteOpen(false);
                      setInviteModules(new Set());
                      toast.success("Staff invitation sent — access assignments saved");
                    }}
                  >
                    Send invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign access</DialogTitle>
            <DialogDescription>
              Select platform services this staff member can access.
            </DialogDescription>
          </DialogHeader>

          {selectedStaffNames.length > 0 && (
            <div className="rounded-lg border bg-muted/30 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Selected staff</p>
              <p className="mt-1 text-sm font-medium">{selectedStaffNames.join(", ")}</p>
            </div>
          )}

          <div className="grid gap-4 py-1">
            <CheckboxGroup
              label="Assign platform access"
              description="Select one or more services this staff member can access"
              options={assignServiceOptions}
              selected={assignModules}
              onToggle={(id, checked) => toggleSetItem(setAssignModules, id, checked)}
              getId={(item) => item.id}
              getLabel={(item) => item.label}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Save assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Staff Users"
          value={String(staffUsers.length)}
          trend="Firm-wide"
          up={true}
          support="Internal platform accounts"
          icon={<UserCog className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Active Users"
          value={String(activeStaff)}
          trend="Signed in"
          up={true}
          support="Fully onboarded staff"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Pending Onboarding"
          value={String(pendingStaff)}
          trend="Invited"
          up={false}
          support="Awaiting first sign-in"
          icon={<UserPlus className="h-5 w-5" />}
          variant="amber"
        />
        <KpiCard
          label="Admins & Managers"
          value={String(adminStaff)}
          trend="Elevated access"
          up={true}
          support="Role-based permissions"
          icon={<Clock className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <div className="card-soft overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search staff by name, email or department…"
              className="h-9 border-transparent bg-muted pl-9"
            />
          </div>
          {selectedStaff.size > 0 && (
            <p className="text-xs font-semibold text-muted-foreground">{selectedStaff.size} staff selected</p>
          )}
        </div>

        {rows.length === 0 ? (
          <EmptyState title="No staff found" description="Try a different search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="w-10 px-4 py-2.5">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={(checked) => toggleAllVisible(checked === true)}
                      aria-label="Select all staff"
                      className="border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                    />
                  </th>
                  <th className="px-4 py-2.5 font-medium">Staff member</th>
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Department</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Last login</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((s) => (
                  <tr
                    key={s.id}
                    className={cn("transition-colors hover:bg-muted/40", selectedStaff.has(s.id) && "bg-[#3cadf1]/5")}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedStaff.has(s.id)}
                        onCheckedChange={(checked) => toggleStaff(s.id, checked === true)}
                        aria-label={`Select ${s.name}`}
                        className="border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to="/staff/$staffId"
                        params={{ staffId: s.id }}
                        className="flex items-center gap-3 hover:opacity-80"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3cadf1] text-xs font-bold text-white">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-[#3cadf1] hover:underline">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone="primary">{s.role}</StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.department}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        tone={toneForStatus(
                          s.status === "Pending onboarding" ? "Awaiting Documents" : s.status,
                        )}
                      >
                        {s.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.lastLogin}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/staff/$staffId" params={{ staffId: s.id }} className="flex items-center">
                              <Eye className="mr-2 h-3.5 w-3.5" />
                              View staff details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAssignFor([s.id])} className="flex items-center">
                            <KeyRound className="mr-2 h-3.5 w-3.5" />
                            Assign access
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditStaff(s)} className="flex items-center">
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit user
                          </DropdownMenuItem>
                          {s.status === "Active" ? (
                            <DropdownMenuItem onClick={() => setDeactivateStaff(s)} className="flex items-center">
                              <UserX className="mr-2 h-3.5 w-3.5" />
                              Deactivate staff
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => toast.success(`${s.name} activated`)}
                              className="flex items-center"
                            >
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                              Activate staff
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => toast(`Resending invitation to ${s.email}`)}
                            className="flex items-center"
                          >
                            <Send className="mr-2 h-3.5 w-3.5" />
                            Resend invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEmailStaff(s)} className="flex items-center">
                            <Mail className="mr-2 h-3.5 w-3.5" />
                            Send email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormDialog
        open={!!editStaff}
        onOpenChange={(open) => !open && setEditStaff(null)}
        title={`Edit user · ${editStaff?.name ?? ""}`}
        description="Update staff profile, role and department."
        onSave={() => toast.success(`${editStaff?.name} updated`)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Full name</Label>
            <Input defaultValue={editStaff?.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue={editStaff?.email} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input defaultValue={editStaff?.role} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Department</Label>
            <Input defaultValue={editStaff?.department} />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={!!deactivateStaff}
        onOpenChange={(open) => !open && setDeactivateStaff(null)}
        title={`Deactivate ${deactivateStaff?.name ?? "staff member"}`}
        description="This will revoke platform access until the account is reactivated."
        saveLabel="Deactivate"
        onSave={() => toast.warning(`${deactivateStaff?.name} deactivated`)}
      >
        <div className="space-y-1.5">
          <Label>Reason for deactivation</Label>
          <Select defaultValue="Left firm">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Left firm", "Temporary leave", "Access review", "Other"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <FormDialog
        open={!!emailStaff}
        onOpenChange={(open) => !open && setEmailStaff(null)}
        title={`Send email · ${emailStaff?.name ?? ""}`}
        description={`Compose an email to ${emailStaff?.email}.`}
        saveLabel="Send email"
        onSave={() => toast.success(`Email sent to ${emailStaff?.email}`)}
      >
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input placeholder="Email subject" />
        </div>
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea rows={4} placeholder="Write your message…" />
        </div>
      </FormDialog>
    </AppShell>
  );
}
