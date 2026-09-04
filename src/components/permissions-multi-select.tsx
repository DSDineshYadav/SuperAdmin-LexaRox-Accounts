import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/kit";
import { Checkbox } from "@/components/ui/checkbox";
import { getPermissionModuleName, platformPermissionModules } from "@/lib/platform-data";
import { cn } from "@/lib/utils";

type PermissionsMultiSelectProps = {
  id?: string;
  selected: string[];
  onChange: (selected: string[]) => void;
};

export function PermissionsMultiSelect({ id, selected, onChange }: PermissionsMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const togglePermission = (permissionId: string, checked: boolean) => {
    onChange(
      checked ? [...selected, permissionId] : selected.filter((id) => id !== permissionId),
    );
  };

  const triggerLabel =
    selected.length === 0
      ? "Select permissions"
      : `${selected.length} permission${selected.length === 1 ? "" : "s"} selected`;

  return (
    <div className="space-y-2">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          selected.length === 0 && "text-muted-foreground",
        )}
      >
        <span className="truncate text-left">{triggerLabel}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((permissionId) => (
            <StatusBadge key={permissionId} tone="info">
              {getPermissionModuleName(permissionId)}
            </StatusBadge>
          ))}
        </div>
      )}

      {open && (
        <div className="overflow-hidden rounded-md border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {selected.length} of {platformPermissionModules.length} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-xs font-medium text-[#3cadf1] hover:underline"
                onClick={() => onChange(platformPermissionModules.map((module) => module.id))}
              >
                Select all
              </button>
              <button
                type="button"
                className="text-xs font-medium text-muted-foreground hover:underline"
                onClick={() => onChange([])}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
            <ul className="divide-y">
              {platformPermissionModules.map((module) => {
                const isSelected = selected.includes(module.id);
                return (
                  <li key={module.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40",
                        isSelected && "bg-[#3cadf1]/5",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          togglePermission(module.id, checked === true)
                        }
                        className="mt-0.5 border-[#3cadf1]/70 data-[state=checked]:border-[#3cadf1] data-[state=checked]:bg-[#3cadf1]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug">{module.name}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {module.description}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
