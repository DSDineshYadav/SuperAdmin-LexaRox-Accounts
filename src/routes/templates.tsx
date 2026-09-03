import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, FileSignature, Plus, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { EmptyState, KpiCard, ListTableCard, ListTablePagination, StatusBadge, toneForStatus } from "@/components/kit";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { globalTemplates, platformAdmin, type GlobalTemplate } from "@/lib/platform-data";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Template Management — LexaRox Platform" },
      { name: "description", content: "Maintain global email and proposal templates available to all subscriber firms." },
    ],
  }),
  component: TemplateManagementPage,
});

type TemplateForm = {
  name: string;
  type: GlobalTemplate["type"];
  category: string;
  status: GlobalTemplate["status"];
  body: string;
};

const emptyForm: TemplateForm = {
  name: "",
  type: "Email",
  category: "Operations",
  status: "Draft",
  body: "",
};

function TemplateManagementPage() {
  const [templates, setTemplates] = useState(globalTemplates);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [tab, setTab] = useState<"all" | "Email" | "Proposal">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);

  const emailTemplates = templates.filter((t) => t.type === "Email");
  const proposalTemplates = templates.filter((t) => t.type === "Proposal");

  const rows = useMemo(
    () =>
      templates.filter(
        (t) =>
          (tab === "all" || t.type === tab) &&
          (status === "all" || t.status === status) &&
          (t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase())),
      ),
    [templates, query, status, tab],
  );

  const pagination = usePagination(rows, { resetKey: `${query}-${status}-${tab}` });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, type: tab === "Proposal" ? "Proposal" : tab === "Email" ? "Email" : "Email" });
    setDialogOpen(true);
  };

  const openEdit = (template: GlobalTemplate) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      type: template.type,
      category: template.category,
      status: template.status,
      body: `Template content for "${template.name}". Firms can customise placeholders before sending.`,
    });
    setDialogOpen(true);
  };

  const saveTemplate = (): boolean => {
    if (!form.name.trim()) {
      toast.error("Template name is required");
      return false;
    }
    const today = "3 Sep 2026";
    if (editingId) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, name: form.name.trim(), type: form.type, category: form.category, status: form.status, lastUpdated: today, updatedBy: platformAdmin.name }
            : t,
        ),
      );
      toast.success("Template updated");
    } else {
      setTemplates((prev) => [
        {
          id: `t-${Date.now()}`,
          name: form.name.trim(),
          type: form.type,
          category: form.category,
          status: form.status,
          lastUpdated: today,
          updatedBy: platformAdmin.name,
          firmsUsing: 0,
        },
        ...prev,
      ]);
      toast.success("Template created");
    }
    return true;
  };

  return (
    <AppShell>
      <PageHeader
        title="Template Management"
        subtitle="Maintain global email and proposal templates available to all subscriber firms."
        actions={
          <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New template
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Email Templates" value={String(emailTemplates.length)} trend={`${emailTemplates.filter((t) => t.status === "Active").length} active`} up={true} support="Global email library" icon={<Mail className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Proposal Templates" value={String(proposalTemplates.length)} trend={`${proposalTemplates.filter((t) => t.status === "Active").length} active`} up={true} support="Global proposal library" icon={<FileSignature className="h-5 w-5" />} variant="green" />
        <KpiCard label="Firms Using" value={String(Math.max(...templates.map((t) => t.firmsUsing), 0))} trend="Max adoption" up={true} support="Most-used template" icon={<FileSignature className="h-5 w-5" />} variant="purple" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="all">All templates</TabsTrigger>
          <TabsTrigger value="Email">Email</TabsTrigger>
          <TabsTrigger value="Proposal">Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <ListTableCard
            toolbar={
              <>
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" className="h-10 border-transparent bg-background/80 pl-9 shadow-sm" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-10 w-full sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          >
            {rows.length === 0 ? (
              <EmptyState title="No templates found" description="Try adjusting your search or filters." />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[14rem]">Template</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Firms using</TableHead>
                      <TableHead className="hidden lg:table-cell">Last updated</TableHead>
                      <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.pageItems.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-semibold">{template.name}</TableCell>
                      <TableCell><StatusBadge tone={template.type === "Email" ? "info" : "primary"}>{template.type}</StatusBadge></TableCell>
                      <TableCell className="text-muted-foreground">{template.category}</TableCell>
                      <TableCell><StatusBadge tone={toneForStatus(template.status)}>{template.status}</StatusBadge></TableCell>
                      <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">{template.firmsUsing}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{template.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => openEdit(template)}>Edit</Button>
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
        </TabsContent>
      </Tabs>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingId ? "Edit template" : "New template"}
        description="Global templates are available to all subscriber firms."
        saveLabel={editingId ? "Save changes" : "Create template"}
        onSave={saveTemplate}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformFormField label="Template name" htmlFor="tpl-name" className="sm:col-span-2">
            <Input id="tpl-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Client Welcome — Onboarding" />
          </PlatformFormField>
          <PlatformFormField label="Type" htmlFor="tpl-type">
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as TemplateForm["type"] }))}>
              <SelectTrigger id="tpl-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Status" htmlFor="tpl-status">
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as TemplateForm["status"] }))}>
              <SelectTrigger id="tpl-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Category" htmlFor="tpl-cat" className="sm:col-span-2">
            <Input id="tpl-cat" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Onboarding, Compliance, Billing…" />
          </PlatformFormField>
          <PlatformFormField label="Template body" htmlFor="tpl-body" className="sm:col-span-2">
            <Textarea id="tpl-body" rows={6} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Write the default template content. Use {{placeholders}} for dynamic fields." />
          </PlatformFormField>
        </div>
      </FormDialog>
    </AppShell>
  );
}
