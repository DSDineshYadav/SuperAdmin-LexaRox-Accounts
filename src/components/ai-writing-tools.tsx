import { useState } from "react";
import { Sparkles, Wand2, RefreshCw, Briefcase, Minimize2, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AI_ACTIONS = [
  { id: "draft", label: "Draft Email with AI", icon: Sparkles },
  { id: "improve", label: "Improve Writing", icon: Wand2 },
  { id: "rewrite", label: "Rewrite", icon: RefreshCw },
  { id: "professional", label: "Make Professional", icon: Briefcase },
  { id: "shorten", label: "Shorten", icon: Minimize2 },
  { id: "update", label: "Generate Client Update", icon: MessageSquare },
  { id: "followup", label: "Generate Follow-up", icon: Bell },
] as const;

export function AiWritingTools({
  compact = false,
  onAction,
}: {
  compact?: boolean;
  onAction?: (actionId: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = (id: string, label: string) => {
    setLoading(id);
    onAction?.(id);
    setTimeout(() => {
      setLoading(null);
      toast.success(`${label} — draft ready for review`);
    }, 800);
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {AI_ACTIONS.slice(0, 4).map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            disabled={loading === id}
            onClick={() => handleAction(id, label)}
          >
            <Icon className="mr-1 h-3 w-3" />
            {label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#3cadf1]/20 bg-[#3cadf1]/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#3cadf1]" />
        <p className="text-sm font-semibold text-[#3cadf1]">AI Writing Assistant</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AI_ACTIONS.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            size="sm"
            variant="outline"
            className="text-xs"
            disabled={loading === id}
            onClick={() => handleAction(id, label)}
          >
            <Icon className="h-3.5 w-3.5" />
            {loading === id ? "Generating…" : label}
          </Button>
        ))}
      </div>
    </div>
  );
}
