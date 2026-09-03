import { useMemo, type Dispatch, type SetStateAction } from "react";
import { FormSection, clientTypeOptions } from "@/components/services/service-forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { clients, staffUsers, taskBreakdownTemplates, type Client, type TaskStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const taskStatuses: TaskStatus[] = ["To Do", "In Progress", "Review", "Completed"];

const taskClientTypeFilter: Record<(typeof clientTypeOptions)[number], Client["type"][]> = {
  "Private Limited Company": ["Limited Company"],
  "Public Limited Company": ["Limited Company"],
  "Limited Liability Partnership": ["LLP"],
  "Self Assessment": ["Sole Trader", "Partnership"],
  "Sole Trader": ["Sole Trader"],
};

export type TaskFormState = {
  clientTypes: Set<string>;
  clientId: string;
  quote: string;
  status: TaskStatus;
  timeEstimateHours: string;
  progressNotes: string;
  taskName: string;
  notifyAssignee: boolean;
  assignTo: string;
  monitorAssignee: string;
  deadline: string;
  breakdown: string;
  breakdownTemplate: string;
  description: string;
};

export const emptyTaskForm = (): TaskFormState => ({
  clientTypes: new Set<string>(),
  clientId: "",
  quote: "",
  status: "In Progress",
  timeEstimateHours: "1",
  progressNotes: "",
  taskName: "",
  notifyAssignee: false,
  assignTo: staffUsers[0]?.name ?? "N/A",
  monitorAssignee: "N/A",
  deadline: "",
  breakdown: "",
  breakdownTemplate: "N/A",
  description: "",
});

export function TaskFormFields({
  form,
  setForm,
}: {
  form: TaskFormState;
  setForm: Dispatch<SetStateAction<TaskFormState>>;
}) {
  const monitorOptions = useMemo(() => ["N/A", ...staffUsers.map((s) => s.name)], []);

  const filteredClients = useMemo(() => {
    if (form.clientTypes.size === 0) return clients;

    const allowedTypes = new Set<Client["type"]>();
    for (const type of form.clientTypes) {
      const mapped = taskClientTypeFilter[type as (typeof clientTypeOptions)[number]];
      if (mapped) mapped.forEach((t) => allowedTypes.add(t));
    }

    return clients.filter((client) => allowedTypes.has(client.type));
  }, [form.clientTypes]);

  const toggleClientType = (type: string, checked: boolean) => {
    setForm((prev) => {
      const nextTypes = new Set(prev.clientTypes);
      if (checked) nextTypes.add(type);
      else nextTypes.delete(type);

      const allowedTypes = new Set<Client["type"]>();
      for (const selected of nextTypes) {
        const mapped = taskClientTypeFilter[selected as (typeof clientTypeOptions)[number]];
        if (mapped) mapped.forEach((t) => allowedTypes.add(t));
      }

      const clientStillValid =
        !prev.clientId || clients.some((c) => c.id === prev.clientId && (nextTypes.size === 0 || allowedTypes.has(c.type)));

      return {
        ...prev,
        clientTypes: nextTypes,
        clientId: clientStillValid ? prev.clientId : "",
      };
    });
  };

  const applyBreakdownTemplate = (template: string) => {
    const templates: Record<string, string> = {
      "N/A": "",
      "VAT return review checklist":
        "Collect VAT return draft\nReview box 1–9 figures\nConfirm EC sales list if applicable\nPartner sign-off",
      "Year-end accounts preparation":
        "Trial balance review\nAdjusting journals\nManagement accounts draft\nDirectors report notes",
      "Client onboarding checklist":
        "Required information complete\nAML / ID verification\nEngagement letter signed\nHandover to account manager",
      "AML document collection":
        "Photo ID verified\nProof of address\nSource of funds declaration\nRisk assessment completed",
    };
    setForm((prev) => ({
      ...prev,
      breakdownTemplate: template,
      breakdown: templates[template] ?? prev.breakdown,
    }));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-5">
        <FormSection title="Client types">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Select client type(s)
            </Label>
            <div className="space-y-1 rounded-lg border bg-muted/20 p-2">
              {clientTypeOptions.map((type) => (
                <label
                  key={type}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50",
                    form.clientTypes.has(type) && "bg-[#3cadf1]/8",
                  )}
                >
                  <Checkbox
                    checked={form.clientTypes.has(type)}
                    onCheckedChange={(checked) => toggleClientType(type, checked === true)}
                    className="border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                  />
                  <span className="text-sm font-medium">{type}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Optional — narrows the client list below. Leave empty to show all clients.
            </p>
          </div>
        </FormSection>

        <FormSection title="Client">
          <div className="space-y-1.5">
            <Label>Select client</Label>
            <Select
              value={form.clientId || undefined}
              onValueChange={(value) => setForm((prev) => ({ ...prev, clientId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.clientTypes.size > 0 && filteredClients.length === 0 && (
              <p className="text-xs text-amber-600">No clients match the selected client types.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-quote">Task quote</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                £
              </span>
              <Input
                id="task-quote"
                value={form.quote}
                onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Task status">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as TaskStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="time-estimate">Time estimate</Label>
            <div className="flex items-center gap-2">
              <Input
                id="time-estimate"
                type="number"
                min={0}
                step={0.5}
                value={form.timeEstimateHours}
                onChange={(e) => setForm((prev) => ({ ...prev, timeEstimateHours: e.target.value }))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">hour(s)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="progress-notes">Progress notes</Label>
            <Textarea
              id="progress-notes"
              rows={5}
              value={form.progressNotes}
              onChange={(e) => setForm((prev) => ({ ...prev, progressNotes: e.target.value }))}
              placeholder="Add progress updates for this task…"
            />
          </div>
        </FormSection>
      </div>

      <FormSection title="Details">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="task-name">Task name</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="notify-assignee" className="text-xs font-normal text-muted-foreground">
                Notify assignee
              </Label>
              <Switch
                id="notify-assignee"
                checked={form.notifyAssignee}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, notifyAssignee: checked }))}
              />
            </div>
          </div>
          <Input
            id="task-name"
            value={form.taskName}
            onChange={(e) => setForm((prev) => ({ ...prev, taskName: e.target.value }))}
            placeholder="Enter task name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Assign to</Label>
            <Select
              value={form.assignTo}
              onValueChange={(value) => setForm((prev) => ({ ...prev, assignTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {staffUsers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.name}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Assign monitor to</Label>
            <Select
              value={form.monitorAssignee}
              onValueChange={(value) => setForm((prev) => ({ ...prev, monitorAssignee: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monitorOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="task-breakdown">Task breakdown (new line for each checkbox)</Label>
            <div className="flex min-w-[10rem] flex-1 items-center gap-2 sm:max-w-[14rem] sm:flex-none">
              <Label className="shrink-0 text-xs text-muted-foreground">Breakdown templates</Label>
              <Select value={form.breakdownTemplate} onValueChange={applyBreakdownTemplate}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskBreakdownTemplates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            id="task-breakdown"
            rows={5}
            value={form.breakdown}
            onChange={(e) => setForm((prev) => ({ ...prev, breakdown: e.target.value }))}
            placeholder="Enter each checklist item on a new line…"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Full task description and context…"
          />
        </div>
      </FormSection>
    </div>
  );
}
