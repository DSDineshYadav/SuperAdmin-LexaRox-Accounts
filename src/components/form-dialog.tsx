import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
  onSave?: () => void | boolean;
  size?: "default" | "lg";
  scrollable?: boolean;
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
  onSave,
  size = "default",
  scrollable = false,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          size === "lg" && "max-w-2xl",
          scrollable && "flex max-h-[90vh] flex-col overflow-hidden",
        )}
      >
        <DialogHeader className={cn(scrollable && "shrink-0")}>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div
          className={cn(
            "grid gap-4 py-2",
            scrollable && "min-h-0 flex-1 overflow-y-auto",
          )}
        >
          {children}
        </div>
        <DialogFooter className={cn(scrollable && "shrink-0 border-t pt-4")}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          {onSave && (
            <Button
              onClick={() => {
                const result = onSave();
                if (result !== false) onOpenChange(false);
              }}
            >
              {saveLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
