import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { StatusBadge } from "@/components/kit";
import { emptyTaskForm, TaskFormFields } from "@/components/tasks/task-form-fields";
import { Button } from "@/components/ui/button";
import { FormPageActions } from "@/components/form-page-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks/create")({
  head: () => ({
    meta: [
      { title: "Add New Task — LexaRox Accounts" },
      { name: "description", content: "Create and assign a new task for your team." },
    ],
  }),
  component: CreateTaskPage,
});

function CreateTaskPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyTaskForm);
  const [starred, setStarred] = useState(false);

  const handleSave = (createAnother: boolean) => {
    toast.success(createAnother ? "Task saved — ready for another" : "Task created");
    if (createAnother) {
      setForm(emptyTaskForm());
      setStarred(false);
      return;
    }
    navigate({ to: "/tasks" });
  };

  return (
    <AppShell>
      <PageBackLink to="/tasks" label="Back to Task Management" />

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">Add New Task</h1>
          <button
            type="button"
            aria-label={starred ? "Remove from favourites" : "Add to favourites"}
            onClick={() => setStarred(!starred)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-background transition-colors hover:bg-muted"
          >
            <Star className={cn("h-4 w-4", starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          </button>
          <StatusBadge tone="info">New task</StatusBadge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign work to your team — select a client, set deadlines and add a task breakdown.
        </p>
      </header>

      <TaskFormFields form={form} setForm={setForm} />

      <FormPageActions>
        <Button variant="ghost" className="text-[#3cadf1]" asChild>
          <Link to="/tasks">Cancel</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="font-semibold" onClick={() => handleSave(true)}>
            Save &amp; Create New Task
          </Button>
          <Button className="bg-[#3cadf1] font-semibold hover:bg-[#3cadf1]/90" onClick={() => handleSave(false)}>
            Save
          </Button>
        </div>
      </FormPageActions>
    </AppShell>
  );
}
