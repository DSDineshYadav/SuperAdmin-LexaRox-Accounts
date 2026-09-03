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
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(size === "lg" && "max-w-2xl")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-2">{children}</div>
        <DialogFooter>
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
