import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import {
  CalendarClock,
  FileText,
  ListChecks,
  Send,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CHATBOT_LOGO = "/chatbot-logo.png";
const CHATBOT_MASCOT = "/chatbot-mascot.png";

function ChatbotLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };
  return (
    <img
      src={CHATBOT_LOGO}
      alt=""
      className={cn(sizes[size], "object-contain", className)}
      aria-hidden
    />
  );
}

function ChatbotMascot({ className }: { className?: string }) {
  return (
    <img
      src={CHATBOT_MASCOT}
      alt="LexaRox Assistant"
      className={cn("h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(44,42,53,0.35)]", className)}
    />
  );
}

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi Sarah — I'm your LexaRox platform assistant. I can help with firm onboarding, subscription queries, inquiry triage and platform metrics. Pick a suggestion below or type your question.",
  time: "Just now",
};

const quickPrompts = [
  { label: "Open inquiries", prompt: "Show open inquiries", icon: CalendarClock },
  { label: "Firm status", prompt: "Summarise firm status", icon: Users },
  { label: "MRR summary", prompt: "Platform MRR summary", icon: FileText },
  { label: "Recent activity", prompt: "Show recent platform activity", icon: ListChecks },
] as const;

const staticReplies: Record<string, string> = {
  "show open inquiries":
    "14 open inquiries — 5 urgent. Northgate Partners payment failure (Support) and Greenfield MTD Early Bird (Sales) need attention today.",
  "summarise firm status":
    "47 subscriber firms: 38 active, 1 onboarding (Harper & Lane LLP), 1 suspended (Northgate Partners), 1 trial (Greenfield Accountancy).",
  "platform mrr summary":
    "Platform MRR is £38,420 (+8.4% MoM). Premium plan accounts for 62% of revenue. 3 firms on trial converting this month.",
  "show recent platform activity":
    "Latest: Harper & Lane LLP onboarded (12 min ago), Whitfield & Partners renewed Premium (1 hr ago), new MTD sales inquiry from Greenfield (2 hrs ago).",
};

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getReply(input: string) {
  const normalised = input.trim().toLowerCase();
  const matched = Object.entries(staticReplies).find(([key]) => normalised.includes(key.slice(0, 12)));
  if (matched) return matched[1];

  if (normalised.includes("client") || normalised.includes("onboard")) {
    return "Open Manage Clients to see onboarding progress, or Client Onboarding to continue a specific workflow. I can also flag missing documents per client.";
  }
  if (normalised.includes("task")) {
    return "Head to Task Management for your queue, or Add New Task to assign work. You currently have 2 items assigned to you and 2 firm-wide overdue tasks.";
  }
  if (normalised.includes("document")) {
    return "Documents are available per client in Manage Clients — open a client and use the Documents tab.";
  }

  return "Thanks — I've noted that. For now this is a preview assistant; connect live AI in a later release. Try a quick prompt below or ask about clients, tasks, or documents.";
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-border/40">
          <ChatbotLogo size="sm" className="h-full w-full" />
        </span>
      )}
      {isUser && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#2c2a35] text-xs font-bold text-white">
          AW
        </span>
      )}
      <div className={cn("min-w-0 max-w-[82%]", isUser && "text-right")}>
        <p className={cn("mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", isUser && "text-right")}>
          {isUser ? "You" : "LexaRox Assistant"}
        </p>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-tr-md bg-[linear-gradient(135deg,#3cadf1_0%,#2a9fd8_100%)] text-white"
              : "rounded-tl-md border border-border/60 bg-card text-foreground",
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className={cn("mt-1.5 text-[10px] font-medium text-muted-foreground", isUser && "text-right")}>
          {message.time}
        </p>
      </div>
    </div>
  );
}

const CHATBOT_SAFE_BOTTOM = "7rem";

type ChatbotContextValue = {
  open: boolean;
  openChatbot: (options?: { draft?: string }) => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
};

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function useAppChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useAppChatbot must be used within ChatbotProvider");
  }
  return context;
}

export function AskAiButton({
  draft,
  children = "Ask AI",
  ...props
}: ComponentProps<typeof Button> & { draft?: string }) {
  const { openChatbot } = useAppChatbot();

  return (
    <Button
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) {
          openChatbot(draft ? { draft } : undefined);
        }
      }}
    >
      {children}
    </Button>
  );
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [draftSeed, setDraftSeed] = useState<string | undefined>();

  const openChatbot = useCallback((options?: { draft?: string }) => {
    if (options?.draft) setDraftSeed(options.draft);
    setOpen(true);
  }, []);

  const closeChatbot = useCallback(() => setOpen(false), []);
  const toggleChatbot = useCallback(() => setOpen((value) => !value), []);

  return (
    <ChatbotContext.Provider value={{ open, openChatbot, closeChatbot, toggleChatbot }}>
      {children}
      <AppChatbot draftSeed={draftSeed} onDraftSeedApplied={() => setDraftSeed(undefined)} />
    </ChatbotContext.Provider>
  );
}

function AppChatbot({
  draftSeed,
  onDraftSeedApplied,
}: {
  draftSeed?: string | undefined;
  onDraftSeedApplied: () => void;
}) {
  const { open, closeChatbot, toggleChatbot } = useAppChatbot();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open && draftSeed) {
      setDraft(draftSeed);
      onDraftSeedApplied();
    }
  }, [open, draftSeed, onDraftSeedApplied]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: trimmed, time: nowLabel() },
    ]);
    setDraft("");
    setTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: getReply(trimmed), time: nowLabel() },
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-3 sm:p-5">
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-[min(100%,26rem)] flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-card shadow-[0_24px_60px_-12px_rgba(44,42,53,0.45)] ring-1 ring-black/5 transition-all duration-300 ease-out sm:max-w-[22rem]",
          open
            ? "mb-[5.25rem] min-h-[560px] max-h-[min(640px,calc(100dvh-5.5rem))] translate-y-0 opacity-100"
            : "pointer-events-none mb-0 min-h-0 max-h-0 translate-y-6 opacity-0",
        )}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/10 px-4 py-3.5 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#2c2a35_0%,#1a1820_55%,#243b4a_100%)]" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#3cadf1]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 left-8 h-24 w-24 rounded-full bg-[#50b546]/15 blur-2xl" />

          <div className="relative flex items-start gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-white/20">
              <ChatbotLogo size="lg" className="h-full w-full" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#2c2a35] bg-[#50b546]" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <p className="truncate text-base font-semibold">LexaRox Assistant</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#50b546]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7ee878]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#50b546]" />
                  Online
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/65">Clients · tasks · documents · onboarding</p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="relative h-8 w-8 shrink-0 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={closeChatbot}
              aria-label="Minimise chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] p-4 dark:bg-[linear-gradient(180deg,#1a1a22_0%,#14121a_100%)]"
        >
          <div className="flex justify-center">
            <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
              Today
            </span>
          </div>

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-border/40">
                <ChatbotLogo size="sm" className="h-full w-full" />
              </span>
              <div className="rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3cadf1] [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3cadf1] [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#3cadf1] [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="shrink-0 border-t bg-background px-3 py-2">
          <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Zap className="h-3 w-3 text-[#3cadf1]" />
            Suggested actions
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickPrompts.map(({ label, prompt, icon: Icon }) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={typing}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#3cadf1]/25 bg-[#3cadf1]/5 px-2.5 py-1 text-[10px] font-semibold text-foreground transition-colors hover:border-[#3cadf1]/45 hover:bg-[#3cadf1]/10 disabled:opacity-50"
              >
                <Icon className="h-3 w-3 shrink-0 text-[#3cadf1]" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          className="border-t bg-background p-3"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(draft);
          }}
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/50 p-1.5 pl-3 shadow-inner">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about clients, tasks, documents…"
              className="h-9 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
              disabled={typing}
              aria-label="Chat message"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl bg-[#3cadf1] shadow-md shadow-[#3cadf1]/30 hover:bg-[#3cadf1]/90"
              disabled={!draft.trim() || typing}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Preview mode · responses are simulated for demo
          </p>
        </form>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={toggleChatbot}
        className={cn(
          "pointer-events-auto absolute bottom-2 right-2 transition-all duration-300 sm:bottom-4 sm:right-4",
          open
            ? "grid h-14 w-14 place-items-center rounded-full bg-[#2c2a35] text-white shadow-lg hover:bg-[#3d3949]"
            : "h-[4rem] w-[4rem] hover:scale-105",
        )}
        aria-expanded={open}
        aria-label={open ? "Close LexaRox assistant" : "Open LexaRox assistant"}
      >
        {!open && (
          <span className="pointer-events-none absolute inset-2 animate-ping rounded-full bg-[#3cadf1]/15" />
        )}
        {open ? <X className="relative h-5 w-5" /> : <ChatbotMascot className="relative" />}
      </button>
    </div>
  );
}

export { CHATBOT_SAFE_BOTTOM };
