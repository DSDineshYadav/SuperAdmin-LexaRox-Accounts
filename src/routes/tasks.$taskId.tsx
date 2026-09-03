import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MessageSquare, Paperclip, StickyNote } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { FormDialog } from "@/components/form-dialog";
import { PriorityBadge, Section, StatusBadge, toneForStatus } from "@/components/kit";
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
import { Textarea } from "@/components/ui/textarea";
import { tasks, staffUsers } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks/$taskId")({
  loader: ({ params }) => {
    const task = tasks.find((t) => t.id === params.taskId);
    if (!task) throw notFound();
    return { task };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Task not found — LexaRox" }] };
    return {
      meta: [
        { title: `${loaderData.task.name} — Task · LexaRox Accounts` },
        { name: "description", content: `Task details, comments and attachments for ${loaderData.task.name}.` },
      ],
    };
  },
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { task } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);

  return (
    <AppShell>
      <PageBackLink to="/tasks" label="Back to Task Management" />
      <PageHeader
        title={task.name}
        subtitle={`${task.client} · ${task.assignee} · due ${task.due}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {task.status !== "Completed" && (
              <Button onClick={() => setCompleteOpen(true)}>Mark complete</Button>
            )}
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit task
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge tone={toneForStatus(task.status)} dot>
          {task.status}
        </StatusBadge>
        <PriorityBadge priority={task.priority} />
        {task.overdue && <StatusBadge tone="danger">Overdue</StatusBadge>}
        <StatusBadge tone="neutral">{task.source}</StatusBadge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Task details">
            <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Client</dt>
                <dd className="mt-1 text-sm font-medium">{task.client}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Assignee</dt>
                <dd className="mt-1 text-sm">{task.assignee}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Due date</dt>
                <dd className="mt-1 text-sm">{task.due}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Priority</dt>
                <dd className="mt-1">
                  <PriorityBadge priority={task.priority} />
                </dd>
              </div>
            </dl>
          </Section>

          {task.notes && (
            <Section title="Notes">
              <p className="px-4 py-4 text-sm text-muted-foreground sm:px-5">{task.notes}</p>
            </Section>
          )}

          <Section title="Comments" description="Team discussion on this task">
            <ul className="divide-y">
              {(task.comments ?? []).length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground sm:px-5">No comments yet.</li>
              )}
              {(task.comments ?? []).map((c, i) => (
                <li key={i} className="flex gap-3 px-4 py-3 sm:px-5">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.author} · {c.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t p-4 sm:px-5">
              <Textarea placeholder="Add a comment…" className="mb-2 min-h-[80px]" />
              <Button size="sm" onClick={() => setCommentOpen(true)}>
                Post comment
              </Button>
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Assign staff">
            <ul className="divide-y">
              {staffUsers.slice(0, 4).map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-3 sm:px-5">
                  <span className="text-sm">{s.name}</span>
                  <Button
                    size="sm"
                    variant={s.name === task.assignee ? "default" : "outline"}
                    onClick={() => setAssignOpen(s.name)}
                  >
                    {s.name === task.assignee ? "Assigned" : "Assign"}
                  </Button>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Attachments">
            <ul className="divide-y">
              {(task.attachments ?? []).length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground sm:px-5">No attachments.</li>
              )}
              {(task.attachments ?? []).map((a) => (
                <li key={a.name} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.size}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => toast(`Downloading ${a.name}`)}>
                    Download
                  </Button>
                </li>
              ))}
            </ul>
            <div className="border-t p-4 sm:px-5">
              <Button size="sm" variant="outline" onClick={() => toast("Upload attachment")}>
                <Paperclip className="h-3.5 w-3.5" /> Add attachment
              </Button>
            </div>
          </Section>

          <Section title="Quick note">
            <div className="p-4 sm:px-5">
              <Textarea placeholder="Internal note…" className="mb-2 min-h-[60px]" />
              <Button size="sm" variant="outline" onClick={() => setNoteOpen(true)}>
                <StickyNote className="h-3.5 w-3.5" /> Save note
              </Button>
            </div>
          </Section>
        </div>
      </div>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit task"
        description="Update task details, assignee and due date."
        onSave={() => toast.success("Task updated")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Task name</Label>
            <Input defaultValue={task.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Input defaultValue={task.client} />
          </div>
          <div className="space-y-1.5">
            <Label>Assignee</Label>
            <Input defaultValue={task.assignee} />
          </div>
          <div className="space-y-1.5">
            <Label>Due date</Label>
            <Input defaultValue={task.due} />
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select defaultValue={task.priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High", "Urgent"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={task.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["To Do", "In Progress", "Review", "Completed"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        title="Mark task complete"
        description="Confirm this task is finished and notify the assignee."
        saveLabel="Mark complete"
        onSave={() => toast.success("Task marked complete")}
      >
        <div className="space-y-1.5">
          <Label>Completion notes</Label>
          <Textarea rows={3} placeholder="Optional notes about how this task was completed…" />
        </div>
      </FormDialog>

      <FormDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        title="Post comment"
        description="Add a comment visible to the team on this task."
        saveLabel="Post comment"
        onSave={() => toast.success("Comment added")}
      >
        <div className="space-y-1.5">
          <Label>Comment</Label>
          <Textarea rows={3} placeholder="Write your comment…" />
        </div>
      </FormDialog>

      <FormDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        title="Save note"
        description="Add an internal note to this task."
        saveLabel="Save note"
        onSave={() => toast.success("Note saved")}
      >
        <div className="space-y-1.5">
          <Label>Internal note</Label>
          <Textarea rows={3} placeholder="Internal note…" />
        </div>
      </FormDialog>

      <FormDialog
        open={!!assignOpen}
        onOpenChange={(open) => !open && setAssignOpen(null)}
        title="Assign task"
        description={`Assign this task to ${assignOpen}.`}
        saveLabel="Confirm assignment"
        onSave={() => toast.success(`Task assigned to ${assignOpen}`)}
      >
        <div className="space-y-1.5">
          <Label>Assignee</Label>
          <Input defaultValue={assignOpen ?? ""} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>Message to assignee</Label>
          <Textarea rows={2} placeholder="Optional message when assigning…" />
        </div>
      </FormDialog>
    </AppShell>
  );
}
