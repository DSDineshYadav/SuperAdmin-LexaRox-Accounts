import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormPageActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5", className)}>
      {children}
    </div>
  );
}
