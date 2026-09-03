import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Search, Globe, Scale, Megaphone } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { FormDialog } from "@/components/form-dialog";
import { PlatformFormField } from "@/components/platform-form-field";
import { EmptyState, KpiCard, ListTableCard, ListTablePrimaryCell, StatusBadge, toneForStatus } from "@/components/kit";
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
import { staticContentPages, platformAdmin, type StaticContentPage } from "@/lib/platform-data";
import { toast } from "sonner";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Static Content Management — LexaRox Platform" },
      { name: "description", content: "Manage platform-wide static content — terms, help pages and marketing content." },
    ],
  }),
  component: ContentManagementPage,
});

type ContentForm = {
  title: string;
  slug: string;
  category: StaticContentPage["category"];
  status: StaticContentPage["status"];
  body: string;
};

const emptyForm: ContentForm = {
  title: "",
  slug: "",
  category: "Help & Support",
  status: "Draft",
  body: "",
};

function ContentManagementPage() {
  const [pages, setPages] = useState(staticContentPages);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContentForm>(emptyForm);

  const published = pages.filter((p) => p.status === "Published").length;
  const drafts = pages.filter((p) => p.status === "Draft").length;

  const rows = useMemo(
    () =>
      pages.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.slug.toLowerCase().includes(query.toLowerCase())),
      ),
    [pages, query, category],
  );

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case "Legal":
        return Scale;
      case "Marketing":
        return Megaphone;
      default:
        return Globe;
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (page: StaticContentPage) => {
    setEditingId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      category: page.category,
      status: page.status,
      body: `Content body for ${page.title}. Update legal copy, help text or marketing messaging here.`,
    });
    setDialogOpen(true);
  };

  const savePage = (): boolean => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return false;
    }
    const today = "3 Sep 2026";
    if (editingId) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, title: form.title.trim(), slug: form.slug.trim(), category: form.category, status: form.status, lastUpdated: today, updatedBy: platformAdmin.name }
            : p,
        ),
      );
      toast.success("Page updated");
    } else {
      setPages((prev) => [
        {
          id: `c-${Date.now()}`,
          title: form.title.trim(),
          slug: form.slug.startsWith("/") ? form.slug.trim() : `/${form.slug.trim()}`,
          category: form.category,
          status: form.status,
          lastUpdated: today,
          updatedBy: platformAdmin.name,
          locale: "en-GB",
        },
        ...prev,
      ]);
      toast.success("Page created");
    }
    return true;
  };

  return (
    <AppShell>
      <PageHeader
        title="Static Content Management"
        subtitle="Manage platform-wide static content — terms of service, help & support pages, and marketing content."
        actions={
          <Button className="bg-[#3cadf1] hover:bg-[#3cadf1]/90" onClick={openCreate}>
            <Plus className="h-4 w-4" /> New page
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total Pages" value={String(pages.length)} trend="All locales" up={true} support="Platform content" icon={<FileText className="h-5 w-5" />} variant="cyan" />
        <KpiCard label="Published" value={String(published)} trend="Live on platform" up={true} support="Public-facing" icon={<Globe className="h-5 w-5" />} variant="green" />
        <KpiCard label="Drafts" value={String(drafts)} trend="In review" up={true} support="Pending publish" icon={<FileText className="h-5 w-5" />} variant="amber" />
      </div>

      <ListTableCard
        toolbar={
          <>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages or slugs…" className="h-10 border-transparent bg-background/80 pl-9 shadow-sm" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Help & Support">Help & Support</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        {rows.length === 0 ? (
          <EmptyState title="No pages found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[14rem]">Page</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell min-w-[11rem]">Last updated</TableHead>
                <TableHead className="text-right w-[5.5rem]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((page) => {
                const Icon = categoryIcon(page.category);
                return (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="flex items-start gap-3 py-0.5">
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted/80">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <ListTablePrimaryCell title={page.title} subtitle={page.category} />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{page.slug}</TableCell>
                    <TableCell className="text-muted-foreground">{page.category}</TableCell>
                    <TableCell><StatusBadge tone={toneForStatus(page.status)}>{page.status}</StatusBadge></TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {page.lastUpdated}
                      <span className="block text-xs">{page.updatedBy}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => openEdit(page)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </ListTableCard>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingId ? "Edit content page" : "New content page"}
        description="Manage platform-wide static pages visible to firms and the public."
        saveLabel={editingId ? "Save changes" : "Create page"}
        onSave={savePage}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformFormField label="Page title" htmlFor="page-title" className="sm:col-span-2">
            <Input id="page-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Terms of Service" />
          </PlatformFormField>
          <PlatformFormField label="URL slug" htmlFor="page-slug">
            <Input id="page-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="/terms" />
          </PlatformFormField>
          <PlatformFormField label="Category" htmlFor="page-cat">
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ContentForm["category"] }))}>
              <SelectTrigger id="page-cat"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Help & Support">Help & Support</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Status" htmlFor="page-status" className="sm:col-span-2">
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ContentForm["status"] }))}>
              <SelectTrigger id="page-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </PlatformFormField>
          <PlatformFormField label="Page content" htmlFor="page-body" className="sm:col-span-2">
            <Textarea id="page-body" rows={8} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Write or paste the page content…" />
          </PlatformFormField>
        </div>
      </FormDialog>
    </AppShell>
  );
}
