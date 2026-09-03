import { useMemo, useState } from "react";
import { Search, FileText, Upload } from "lucide-react";
import { EmptyState, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DocCategory, type DocItem } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories: (DocCategory | "All")[] = [
  "All",
  "Identity",
  "Bank Statements",
  "Tax Documents",
  "Company Documents",
  "Contracts",
  "Other",
];

type DocumentsLibraryPanelProps = {
  documents: DocItem[];
  showClientColumn?: boolean;
  searchPlaceholder?: string;
  showUploadButton?: boolean;
  onUpload?: () => void;
};

export function DocumentsLibraryPanel({
  documents,
  showClientColumn = true,
  searchPlaceholder = "Search documents or clients…",
  showUploadButton = false,
  onUpload,
}: DocumentsLibraryPanelProps) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [ai, setAi] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      documents.filter(
        (d) =>
          (category === "All" || d.category === category) &&
          (ai === "all" || d.ai === ai) &&
          (d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.client.toLowerCase().includes(query.toLowerCase())),
      ),
    [documents, category, ai, query],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
              category === c
                ? "bg-[#3cadf1] text-white shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card-soft overflow-hidden">
        <div className="grid gap-2 border-b p-3 sm:flex sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 border-transparent bg-muted pl-9 text-xs"
            />
          </div>
          <Select value={ai} onValueChange={setAi}>
            <SelectTrigger className="h-9 w-full text-xs sm:w-52">
              <SelectValue placeholder="AI status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All AI statuses</SelectItem>
              {["Processing", "Processed", "Needs Review", "Verified"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showUploadButton && (
            <Button
              className="h-9 bg-[#3cadf1] font-semibold text-white hover:bg-[#3cadf1]/90 sm:ml-auto"
              onClick={() => {
                if (onUpload) {
                  onUpload();
                  return;
                }
                toast.success("Upload queued — Document Agent OCR engine initiated");
              }}
            >
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          )}
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="No documents found"
            description="Adjust the category, AI status or search term to see more results."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Document File</th>
                  {showClientColumn && <th className="px-4 py-3 font-medium">Client</th>}
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Upload Date</th>
                  <th className="px-4 py-3 font-medium">Uploaded By</th>
                  <th className="px-4 py-3 font-medium">AI Processing</th>
                  <th className="px-4 py-3 font-medium">Verification</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#3cadf1]/15 text-[#3cadf1]">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="block truncate text-left font-bold text-foreground hover:text-[#3cadf1]"
                            onClick={() => toast(`Opening ${d.name}`)}
                          >
                            {d.name}
                          </button>
                          <span className="font-mono text-xs text-muted-foreground">{d.size}</span>
                        </div>
                      </div>
                    </td>
                    {showClientColumn && (
                      <td className="px-4 py-3.5 font-medium text-foreground">{d.client}</td>
                    )}
                    <td className="px-4 py-3.5 text-muted-foreground">{d.category}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{d.uploaded}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{d.uploadedBy}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge tone={toneForStatus(d.ai)} dot>
                        {d.ai}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge tone={toneForStatus(d.verified)}>{d.verified}</StatusBadge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() => toast.success(`Downloading ${d.name}`)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-semibold"
                          onClick={() => toast(`Opening ${d.name}`)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
