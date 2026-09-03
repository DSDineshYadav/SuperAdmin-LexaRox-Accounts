import { useState } from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { firmServiceItems, type FirmServiceItem } from "@/lib/data";
import { cn } from "@/lib/utils";

export const LexaRoxServices = ["Payroll", "Accounts", "Bookkeeping"] as const;

export const clientTypeOptions = [
  "Private Limited Company",
  "Public Limited Company",
  "Limited Liability Partnership",
  "Self Assessment",
  "Sole Trader",
] as const;

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-slate-900 px-5 py-3 text-sm font-semibold text-white">{title}</div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  );
}

export function ServiceFormFields({ service }: { service?: FirmServiceItem }) {
  return (
    <div className="space-y-5">
      <FormSection title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>
              Name<span className="text-destructive">*</span>
            </Label>
            <Input defaultValue={service?.serviceName} placeholder="Name displayed to your clients" />
            <p className="text-xs text-muted-foreground">
              Name displayed to your clients in external documents.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>
              Internal name<span className="text-destructive">*</span>
            </Label>
            <Input defaultValue={service?.internalName} placeholder="Unique internal identifier" />
            <p className="text-xs text-muted-foreground">
              Only used in Propose allowing you to have unique service identifiers.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Service variation">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>LexaRox Services</Label>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {LexaRoxServices.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Enter client types<span className="text-destructive">*</span>
            </Label>
            <Select defaultValue={service?.clientTypes.split(" ")[0] ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {clientTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label>
              Fee frequency<span className="text-destructive">*</span>
            </Label>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {["One-off", "Monthly", "Quarterly", "Annually"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Currency<span className="text-destructive">*</span>
            </Label>
            <Select defaultValue="GBP">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Fee<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                £
              </span>
              <Input className="pl-7" placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>VAT Rate</Label>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {["Standard (20%)", "Reduced (5%)", "Zero (0%)", "Exempt"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked />
          Include VAT
        </label>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Catch-up fees are only available for monthly, and quarterly frequency.
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea rows={5} placeholder="Describe this service for proposals and client-facing documents…" />
        </div>
      </FormSection>
    </div>
  );
}

export function PackageFormFields({
  packageName = "",
  internalName = "",
  initialServiceIds = [],
}: {
  packageName?: string;
  internalName?: string;
  initialServiceIds?: string[];
}) {
  const [showServices, setShowServices] = useState(initialServiceIds.length > 0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialServiceIds));

  const toggleService = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>
              Package name<span className="text-destructive">*</span>
            </Label>
            <Input defaultValue={packageName} placeholder="e.g. Lexarox Essential" />
          </div>
          <div className="space-y-1.5">
            <Label>
              Internal name<span className="text-destructive">*</span>
            </Label>
            <Input defaultValue={internalName} placeholder="e.g. Lexarox Essential" />
          </div>
        </div>

        <button
          type="button"
          className="mt-4 text-sm font-semibold text-[#3cadf1] hover:underline"
          onClick={() => setShowServices((v) => !v)}
        >
          + Add service(s)
          {selectedIds.size > 0 && (
            <span className="ml-1 font-normal text-muted-foreground">({selectedIds.size} selected)</span>
          )}
        </button>

        {showServices && (
          <div className="mt-4 overflow-hidden rounded-lg border">
            <div className="border-b bg-muted/40 px-4 py-2.5">
              <p className="text-sm font-semibold text-[#3cadf1]">Add your services</p>
            </div>
            <div className="max-h-64 divide-y overflow-y-auto">
              {firmServiceItems.map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30",
                    selectedIds.has(s.id) && "bg-[#3cadf1]/5",
                  )}
                >
                  <Checkbox
                    checked={selectedIds.has(s.id)}
                    onCheckedChange={(checked) => toggleService(s.id, checked === true)}
                    className="border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                  />
                  <span className="text-sm">{s.internalName}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}