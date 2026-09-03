import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, StickyNote, Sparkles, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { AiWritingTools } from "@/components/ai-writing-tools";
import { KpiCard, Section, StatusBadge } from "@/components/kit";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/communications")({
  head: () => ({
    meta: [
      { title: "AI-Assisted Communication — LexaRox Accounts" },
      {
        name: "description",
        content: "Draft client emails and communications with AI assistance — review, edit and approve before sending.",
      },
      { property: "og:title", content: "AI-Assisted Communication — LexaRox Accounts" },
      { property: "og:description", content: "AI drafts client communications. Your team reviews and sends." },
    ],
  }),
  component: Communications,
});

const drafts = [
  {
    client: "Northgate Partners LLP",
    subject: "Your annual accounts are ready for review",
    body: "Your annual accounts are ready for review. We've attached the draft financial statements and a short summary of the key figures ahead of the filing deadline on 31 July.",
    lang: "English",
  },
  {
    client: "ABC Ltd",
    subject: "October bank statement required",
    body: "To complete your bookkeeping for the quarter we still need the October 2025 business current account statement. You can upload it securely using the link below.",
    lang: "English",
  },
  {
    client: "Marisol Catering",
    subject: "Documentos pendientes para tu alta",
    body: "Para completar tu alta necesitamos tu documento de identidad y un extracto bancario reciente. Te explico paso a paso cómo enviarlos.",
    lang: "Spanish",
  },
];

function Communications() {
  const [editDraft, setEditDraft] = useState<(typeof drafts)[number] | null>(null);
  const [whatsappClient, setWhatsappClient] = useState<string | null>(null);
  const [callTarget, setCallTarget] = useState<{ client: string; phone: string } | null>(null);
  const [approveDraft, setApproveDraft] = useState<(typeof drafts)[number] | null>(null);

  return (
    <AppShell>
      <PageHeader
        title="AI-Assisted Communication"
        subtitle="Draft client emails and communications with AI assistance — multilingual drafts held for human review before dispatch."
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="AI Drafts Awaiting Approval"
          value="3"
          trend="Ready"
          up={true}
          support="Pre-generated client communications"
          icon={<Sparkles className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Messages Sent Today"
          value="24"
          trend="+12%"
          up={true}
          support="Email & WhatsApp dispatches"
          icon={<Send className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Avg Client Response SLA"
          value="2.4 hrs"
          trend="-45 mins"
          up={true}
          support="Faster response with AI drafts"
          icon={<MessageSquare className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      <Tabs defaultValue="email">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="email" className="gap-1.5 text-xs sm:text-sm">
            <Mail className="h-3.5 w-3.5" /> Email ({drafts.length})
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5 text-xs sm:text-sm">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger value="phone" className="gap-1.5 text-xs sm:text-sm">
            <Phone className="h-3.5 w-3.5" /> Phone
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 text-xs sm:text-sm">
            <StickyNote className="h-3.5 w-3.5" /> Internal Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-5 space-y-4">
          <AiWritingTools />
          {drafts.map((d) => (
            <article key={d.client} className="card-soft card-hover p-5 border rounded-2xl transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <StatusBadge tone="ai" dot>
                    <Sparkles className="h-3.5 w-3.5" /> AI Draft ({d.lang})
                  </StatusBadge>
                  <span className="text-xs font-bold text-foreground">{d.client}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Auto-prepared by Comm Agent</span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-foreground">{d.subject}</p>
              <p className="mt-1.5 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/40 font-mono text-xs">
                "{d.body}"
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-[#3cadf1] hover:bg-[#3cadf1]/90 text-white font-semibold text-xs"
                    onClick={() => setApproveDraft(d)}
                  >
                    <Send className="h-3.5 w-3.5" /> Approve &amp; Send
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setEditDraft(d)}>
                    Edit Message
                  </Button>
                  <AiWritingTools compact />
                </div>
                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={() => toast.info("Regenerating with alternative tone...")}>
                  Regenerate with AI
                </Button>
              </div>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-5">
          <Section title="WhatsApp Business Portal" description="Instant messaging & document collection for active clients">
            <ul className="divide-y">
              {["Brightside Consulting Ltd", "Marisol Catering", "Sahar Textiles Ltd"].map((c) => (
                <li key={c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="truncate text-sm font-semibold text-foreground">{c}</p>
                      <p className="truncate text-xs text-muted-foreground">WhatsApp channel active</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-medium text-xs"
                    onClick={() => setWhatsappClient(c)}
                  >
                    Open Chat
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="phone" className="mt-5 grid gap-4 md:grid-cols-2">
          <Section title="Click-to-Call Dialer" description="Direct line access for account managers">
            <ul className="divide-y">
              {[
                ["Brightside Consulting Ltd", "+44 20 7946 0812"],
                ["ABC Ltd", "+44 161 496 0233"],
              ].map(([c, p]) => (
                <li key={c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{c}</p>
                    <p className="text-xs text-muted-foreground">{p}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setCallTarget({ client: c, phone: p })}>
                    <Phone className="h-3.5 w-3.5" /> Call Now
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Telephony Roadmap" description="Next generation AI voice features">
            <ul className="divide-y">
              {["VoIP calling integration", "Automated call recording", "AI call transcription", "AI call summary generator"].map((f) => (
                <li key={f} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span className="truncate text-sm font-medium text-muted-foreground">{f}</span>
                  <StatusBadge tone="neutral">Planned Q4</StatusBadge>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <Section title="Internal Practice Notes" description="Team notes and client communication logs">
            <ul className="divide-y text-sm">
              {[
                ["Client prefers phone contact before 10am.", "Priya Raman · 2 days ago"],
                ["Director changing in October — update records.", "Daniel Okoye · last week"],
              ].map(([n, m]) => (
                <li key={n} className="px-4 py-3.5 sm:px-5">
                  <p className="font-medium text-foreground">{n}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m}</p>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={!!editDraft}
        onOpenChange={(open) => !open && setEditDraft(null)}
        title={`Edit message · ${editDraft?.client ?? ""}`}
        description="Review and edit the AI-prepared draft before sending."
        saveLabel="Save draft"
        onSave={() => toast.success("Draft saved")}
        size="lg"
      >
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input defaultValue={editDraft?.subject} />
        </div>
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea rows={5} defaultValue={editDraft?.body} />
        </div>
      </FormDialog>

      <FormDialog
        open={!!approveDraft}
        onOpenChange={(open) => !open && setApproveDraft(null)}
        title={`Approve & send · ${approveDraft?.client ?? ""}`}
        description="Confirm this email is ready to send to the client."
        saveLabel="Approve & send"
        onSave={() => toast.success(`Email approved & sent to ${approveDraft?.client}`)}
      >
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input defaultValue={approveDraft?.subject} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>Preview</Label>
          <Textarea rows={4} defaultValue={approveDraft?.body} readOnly />
        </div>
      </FormDialog>

      <FormDialog
        open={!!whatsappClient}
        onOpenChange={(open) => !open && setWhatsappClient(null)}
        title={`WhatsApp · ${whatsappClient ?? ""}`}
        description="Send a WhatsApp message to this client."
        saveLabel="Send message"
        onSave={() => toast.success(`Message sent to ${whatsappClient} via WhatsApp`)}
      >
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea rows={4} placeholder="Type your WhatsApp message…" />
        </div>
      </FormDialog>

      <FormDialog
        open={!!callTarget}
        onOpenChange={(open) => !open && setCallTarget(null)}
        title={`Call · ${callTarget?.client ?? ""}`}
        description={`Dial ${callTarget?.phone} via click-to-call.`}
        saveLabel="Start call"
        onSave={() => toast.success(`Dialling ${callTarget?.phone}…`)}
      >
        <div className="space-y-1.5">
          <Label>Phone number</Label>
          <Input defaultValue={callTarget?.phone} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>Call notes</Label>
          <Textarea rows={2} placeholder="Optional notes for this call…" />
        </div>
      </FormDialog>
    </AppShell>
  );
}
