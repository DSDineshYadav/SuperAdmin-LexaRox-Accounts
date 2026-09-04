import { useEffect, useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { KeyRound, Search, Shield, Sparkles, Trash2, UserPlus, Users } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PermissionsMultiSelect } from "@/components/permissions-multi-select";
import { PlatformFormField } from "@/components/platform-form-field";
import { EmptyState, KpiCard, ListTablePagination, Section, StatusBadge } from "@/components/kit";
import { usePagination } from "@/hooks/use-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPermissionModuleName,
  platformPermissionModules,
  type PlatformUser,
} from "@/lib/platform-data";
import {
  addPlatformUser,
  deletePlatformUser,
  getPlatformUsers,
  updatePlatformUser,
} from "@/lib/platform-users-store";
import { showSubadminManagement } from "@/lib/platform-navigation";
import { toast } from "sonner";

export const Route = createFileRoute("/subadmin-management")({
  beforeLoad: () => {
    if (!showSubadminManagement) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Subadmin Management — LexaRox Platform" },
      {
        name: "description",
        content: "Manage LexaRox platform users, roles and account access.",
      },
    ],
  }),
  loader: () => getPlatformUsers(),
  component: SubadminManagementPage,
});

type UserForm = {
  name: string;
  email: string;
  permissions: string[];
  status: PlatformUser["status"];
};

const emptyUserForm: UserForm = {
  name: "",
  email: "",
  permissions: [],
  status: "Invited",
};

function userInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SubadminManagementPage() {
  const loadedUsers = Route.useLoaderData();
  const [users, setUsers] = useState(loadedUsers);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<PlatformUser | null>(null);

  useEffect(() => {
    setUsers(loadedUsers);
  }, [loadedUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const searchable = [
        user.name,
        user.email,
        user.status,
        ...user.permissions.map((permissionId) => getPermissionModuleName(permissionId)),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [users, searchQuery]);

  const enabledCount = users.filter((u) => u.enabled).length;
  const usersPagination = usePagination(filteredUsers, { resetKey: searchQuery });

  const openAddUser = () => {
    setUserForm(emptyUserForm);
    setUserDialogOpen(true);
  };

  const saveUser = (): boolean => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast.error("Name and email are required");
      return false;
    }
    if (!userForm.email.includes("@")) {
      toast.error("Enter a valid work email");
      return false;
    }
    if (userForm.permissions.length === 0) {
      toast.error("Select at least one permission");
      return false;
    }
    if (users.some((u) => u.email.toLowerCase() === userForm.email.trim().toLowerCase())) {
      toast.error("A user with this email already exists");
      return false;
    }

    const newUser: PlatformUser = {
      id: `pu-${Date.now()}`,
      name: userForm.name.trim(),
      email: userForm.email.trim().toLowerCase(),
      roleId: "platform-admin",
      status: userForm.status,
      added: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      enabled: true,
      permissions: [...userForm.permissions],
    };

    addPlatformUser(newUser);
    setUsers(getPlatformUsers());
    toast.success(`Invitation sent to ${newUser.email}`);
    setUserForm(emptyUserForm);
    return true;
  };

  const toggleUserEnabled = (user: PlatformUser, enabled: boolean) => {
    updatePlatformUser(user.id, { enabled });
    setUsers(getPlatformUsers());
    toast.success(`${user.name} ${enabled ? "enabled" : "disabled"}`);
  };

  const openEditPermissions = (user: PlatformUser) => {
    setEditingUser(user);
    setPermissionDraft(
      Object.fromEntries(
        platformPermissionModules.map((module) => [module.id, user.permissions.includes(module.id)]),
      ),
    );
    setPermissionDialogOpen(true);
  };

  const savePermissions = (): boolean => {
    if (!editingUser) return false;
    const permissions = platformPermissionModules
      .filter((module) => permissionDraft[module.id])
      .map((module) => module.id);
    if (permissions.length === 0) {
      toast.error("Select at least one permission");
      return false;
    }
    updatePlatformUser(editingUser.id, { permissions });
    setUsers(getPlatformUsers());
    toast.success(`Permissions updated for ${editingUser.name}`);
    return true;
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    deletePlatformUser(userToDelete.id);
    setUsers(getPlatformUsers());
    toast.success(`${userToDelete.name} removed from platform users`);
    setUserToDelete(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Subadmin Management"
        subtitle="Manage LexaRox internal platform users and control their access."
        actions={
          <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={openAddUser}>
            <UserPlus className="h-4 w-4" /> Add user
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Platform users"
          value={String(users.length)}
          trend="LexaRox staff"
          up
          support="Internal accounts"
          icon={<Users className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Enabled"
          value={String(enabledCount)}
          trend="Active access"
          up
          support="Can sign in"
          icon={<Shield className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Disabled"
          value={String(users.length - enabledCount)}
          trend="Access revoked"
          up={users.length - enabledCount === 0}
          support="Sign-in blocked"
          icon={<Users className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <Section
        title="Platform users"
        description="Internal LexaRox staff — view permissions, edit access and enable or disable sign-in"
        actions={
          <div className="relative w-44 sm:w-64 lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users…"
              className="h-9 border-transparent bg-background/80 pl-9 shadow-sm"
            />
          </div>
        }
      >
        {filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try a different search term or add a new platform user."
          />
        ) : (
          <>
        <div className="hidden border-b bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_auto] sm:gap-4 sm:px-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_minmax(0,1fr)]">
          <span>User</span>
          <span>Permissions</span>
          <span className="text-right">Access</span>
        </div>
        <ul className="divide-y">
          {usersPagination.pageItems.map((user) => (
            <li
              key={user.id}
              className="flex flex-col gap-3 px-4 py-3.5 sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-4 sm:px-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_minmax(0,1fr)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3cadf1]/15 text-xs font-bold text-[#3cadf1]">
                  {userInitials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="min-w-0 sm:px-0">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground sm:hidden">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.permissions.map((permissionId) => (
                    <StatusBadge key={permissionId} tone="info">
                      {getPermissionModuleName(permissionId)}
                    </StatusBadge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-3">
                <StatusBadge tone={user.status === "Active" ? "success" : "warning"}>{user.status}</StatusBadge>
                <span className="hidden text-xs text-muted-foreground lg:inline">{user.added}</span>
                <Button variant="outline" size="sm" onClick={() => openEditPermissions(user)}>
                  <KeyRound className="h-3.5 w-3.5" />
                  Edit permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setUserToDelete(user)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {user.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    checked={user.enabled}
                    onCheckedChange={(checked) => toggleUserEnabled(user, checked)}
                    aria-label={`${user.enabled ? "Disable" : "Enable"} ${user.name}`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ListTablePagination
          page={usersPagination.page}
          totalPages={usersPagination.totalPages}
          totalItems={usersPagination.totalItems}
          rangeStart={usersPagination.rangeStart}
          rangeEnd={usersPagination.rangeEnd}
          onPageChange={usersPagination.setPage}
        />
          </>
        )}
      </Section>

      <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete platform user?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete
                ? `This will remove ${userToDelete.name} (${userToDelete.email}) from platform users. They will lose access immediately.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteUser}
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FormDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        title="Add platform user"
        description="Create a new LexaRox internal account with module permissions and account status."
        saveLabel="Create user"
        onSave={saveUser}
        size="lg"
        scrollable
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformFormField label="Full name" htmlFor="user-name" className="sm:col-span-2">
            <Input
              id="user-name"
              value={userForm.name}
              onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Alex Morgan"
            />
          </PlatformFormField>
          <PlatformFormField label="Work email" htmlFor="user-email" className="sm:col-span-2">
            <Input
              id="user-email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="alex.morgan@lexarox.com"
            />
          </PlatformFormField>
          <PlatformFormField label="Permissions" htmlFor="user-permissions" className="sm:col-span-2">
            <PermissionsMultiSelect
              id="user-permissions"
              selected={userForm.permissions}
              onChange={(permissions) => setUserForm((form) => ({ ...form, permissions }))}
            />
          </PlatformFormField>
          <PlatformFormField label="Status" htmlFor="user-status" className="sm:col-span-2">
            <Select
              value={userForm.status}
              onValueChange={(value) =>
                setUserForm((f) => ({ ...f, status: value as PlatformUser["status"] }))
              }
            >
              <SelectTrigger id="user-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Invited">Invited</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
        </div>
      </FormDialog>

      <FormDialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        title="Edit permissions"
        description={
          editingUser
            ? `Choose which platform modules ${editingUser.name} can access.`
            : "Choose platform module access."
        }
        saveLabel="Save permissions"
        onSave={savePermissions}
        size="lg"
        scrollable
      >
        <ul className="divide-y rounded-lg border">
          {platformPermissionModules.map((module) => (
            <li
              key={module.id}
              className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#3cadf1]/15 text-[#3cadf1]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{module.name}</p>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
              </div>
              <Switch
                checked={permissionDraft[module.id] ?? false}
                onCheckedChange={(checked) =>
                  setPermissionDraft((prev) => ({ ...prev, [module.id]: checked }))
                }
                aria-label={`Allow ${module.name}`}
              />
            </li>
          ))}
        </ul>
      </FormDialog>
    </AppShell>
  );
}
