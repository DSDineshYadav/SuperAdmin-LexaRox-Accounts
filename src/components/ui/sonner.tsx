import { Toaster as Sonner } from "sonner";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

function ToastStatusIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span className={cn("lexarox-toast-icon grid h-7 w-7 shrink-0 place-items-center rounded-md text-white", className)}>
      {children}
    </span>
  );
}

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      closeButton
      offset={{ top: "5rem", right: "1.25rem" }}
      gap={10}
      visibleToasts={4}
      className="lexarox-toaster"
      icons={{
        success: (
          <ToastStatusIcon className="bg-[#22c55e]">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </ToastStatusIcon>
        ),
        info: (
          <ToastStatusIcon className="bg-[#3b82f6]">
            <Info className="h-3.5 w-3.5" strokeWidth={2.5} />
          </ToastStatusIcon>
        ),
        warning: (
          <ToastStatusIcon className="bg-[#f59e0b]">
            <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.5} />
          </ToastStatusIcon>
        ),
        error: (
          <ToastStatusIcon className="bg-[#ef4444]">
            <X className="h-3.5 w-3.5" strokeWidth={3} />
          </ToastStatusIcon>
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "lexarox-toast",
          title: "lexarox-toast-title",
          description: "lexarox-toast-description",
          closeButton: "lexarox-toast-close",
          icon: "lexarox-toast-icon-wrap",
          content: "lexarox-toast-content",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
