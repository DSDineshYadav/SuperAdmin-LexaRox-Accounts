import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  Headphones,
  LifeBuoy,
  ListChecks,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { AskAiButton } from "@/components/app-chatbot";
import { KpiCard, Section, StatusBadge } from "@/components/kit";
import { FormDialog } from "@/components/form-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — LexaRox Platform" },
      {
        name: "description",
        content: "Help centre and support for LexaRox platform administrators.",
      },
    ],
  }),
  component: HelpSupportPage,
});

const guides = [
  {
    id: "firms",
    title: "Firm management",
    description: "Onboard subscriber firms, configure plans and monitor firm health across the platform.",
    href: "/firms",
    icon: Users,
    tag: "Platform",
  },
  {
    id: "subscriptions",
    title: "Subscription management",
    description: "Manage platform plans, billing tiers and cross-firm subscription records.",
    href: "/subscriptions",
    icon: Users,
    tag: "Billing",
  },
  {
    id: "services",
    title: "Platform service catalogue",
    description: "Configure services available for firms to offer their end clients.",
    href: "/services",
    icon: ListChecks,
    tag: "Catalogue",
  },
  {
    id: "templates",
    title: "Template management",
    description: "Maintain global email and proposal templates for all subscriber firms.",
    href: "/templates",
    icon: MessageCircle,
    tag: "Catalogue",
  },
  {
    id: "inquiries",
    title: "Inquiry management",
    description: "Handle sales, support and partnership inquiries from the platform.",
    href: "/inquiries",
    icon: ShieldCheck,
    tag: "Platform",
  },
  {
    id: "content",
    title: "Static content",
    description: "Manage terms, help pages and marketing content across the platform.",
    href: "/content",
    icon: FileText,
    tag: "Content",
  },
  {
    id: "settings",
    title: "System administration",
    description: "Roles, departments, onboarding config, integrations and audit logs.",
    href: "/settings",
    icon: Settings,
    tag: "Administration",
  },
  {
    id: "ai-assistant",
    title: "LexaRox Assistant",
    description: "Ask about firm status, open inquiries, MRR and platform activity.",
    href: null,
    icon: Sparkles,
    tag: "Intelligence",
  },
] as const;

const faqs = [
  {
    id: "faq-1",
    question: "How do I onboard a new subscriber firm?",
    answer:
      "Open Firm Management and click Onboard firm. Complete firm details, select a subscription plan, choose catalogue services the firm will offer to clients, then activate. The firm starts in Onboarding status until setup is complete.",
  },
  {
    id: "faq-2",
    question: "How do I configure which services a firm offers?",
    answer:
      "Open Firm Management, select the firm and go to the Configuration tab. Enable or disable services from the platform catalogue and assign global templates. You can also manage the master catalogue from Manage Services.",
  },
  {
    id: "faq-3",
    question: "How do I manage subscription plans and billing?",
    answer:
      "Subscription Management shows all platform plans, firm subscription counts and cross-firm billing records. You can create plans, edit tiers and review failed or overdue payments from subscriber firms.",
  },
  {
    id: "faq-4",
    question: "How do I handle sales and support inquiries?",
    answer:
      "Inquiry Management lists all inbound platform inquiries. Filter by type (Sales, Support, Partnership), open an inquiry to view details, assign it and mark as resolved when complete.",
  },
  {
    id: "faq-5",
    question: "Where do I manage static content and templates?",
    answer:
      "Static Content Management covers terms, help pages and marketing content. Template Management maintains global email and proposal templates available to all subscriber firms.",
  },
  {
    id: "faq-6",
    question: "Who can I contact for platform support?",
    answer:
      "Email platform@lexarox.com or use the LexaRox Assistant from the header. For subscriber firm issues, use Inquiry Management or view the firm's detail page in Firm Management.",
  },
] as const;

function HelpSupportPage() {
  const [query, setQuery] = useState("");
  const [ticketOpen, setTicketOpen] = useState(false);

  const normalisedQuery = query.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    if (!normalisedQuery) return guides;
    return guides.filter(
      (g) =>
        g.title.toLowerCase().includes(normalisedQuery) ||
        g.description.toLowerCase().includes(normalisedQuery) ||
        g.tag.toLowerCase().includes(normalisedQuery),
    );
  }, [normalisedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!normalisedQuery) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(normalisedQuery) ||
        f.answer.toLowerCase().includes(normalisedQuery),
    );
  }, [normalisedQuery]);

  return (
    <AppShell>
      <PageHeader
        title="Help & Support"
        subtitle="Documentation, guides and contact options for platform administrators."
        actions={
          <AskAiButton className="gap-1.5 bg-[#3cadf1] font-semibold text-white hover:bg-[#3cadf1]/90">
            <Sparkles className="h-4 w-4" />
            Ask AI
          </AskAiButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Guides available"
          value="8"
          trend="Updated"
          up={true}
          support="Firms, billing, templates & admin"
          icon={<BookOpen className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="Avg. response time"
          value="< 4 hrs"
          trend="Business hours"
          up={true}
          support="Mon–Fri · 9:00–17:30 GMT"
          icon={<Clock className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Support channels"
          value="3"
          trend="Live"
          up={true}
          support="Email, ticket & AI assistant"
          icon={<Headphones className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="System status"
          value="Operational"
          trend="All services healthy"
          up={true}
          support="Last checked just now"
          icon={<LifeBuoy className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <div className="relative mb-6 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides and FAQs…"
          className="h-10 pl-9"
        />
      </div>

      <Section title="Guides & documentation" description="Step-by-step help for everyday workflows">
        {filteredGuides.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground sm:px-5">
            No guides match your search. Try a different keyword or contact support below.
          </p>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              const card = (
                <div
                  className={cn(
                    "flex h-full flex-col rounded-xl border bg-muted/20 p-4 transition-all hover:border-[#3cadf1]/30 hover:bg-[#3cadf1]/5 hover:shadow-sm",
                    guide.href && "group cursor-pointer",
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#3cadf1]/10 text-[#3cadf1]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <StatusBadge tone="neutral">{guide.tag}</StatusBadge>
                  </div>
                  <p className="text-sm font-bold text-foreground">{guide.title}</p>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{guide.description}</p>
                  {guide.href ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#3cadf1] group-hover:underline">
                      Open guide <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <AskAiButton
                      size="sm"
                      variant="outline"
                      className="mt-3 w-fit text-xs font-semibold"
                      draft="How can the LexaRox assistant help my team?"
                    >
                      Open assistant
                    </AskAiButton>
                  )}
                </div>
              );

              return guide.href ? (
                <Link key={guide.id} to={guide.href} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={guide.id}>{card}</div>
              );
            })}
          </div>
        )}
      </Section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Section title="Frequently asked questions" description="Quick answers to common questions">
          {filteredFaqs.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground sm:px-5">
              No FAQs match your search.
            </p>
          ) : (
            <Accordion type="single" collapsible className="px-4 sm:px-5">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Section>

        <Section title="Contact support" description="We're here to help your practice">
          <div className="space-y-4 p-4 sm:px-5">
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#3cadf1]" />
                <div>
                  <p className="text-sm font-semibold">Email support</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">support@lexarox.com</p>
                  <Button
                    size="sm"
                    variant="link"
                    className="mt-1 h-auto p-0 text-xs font-semibold text-[#3cadf1]"
                    onClick={() => toast.success("Support email copied to clipboard")}
                  >
                    Copy address
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#3cadf1]" />
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">platform@lexarox.com</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Mon–Fri · 9:00–17:30 GMT</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#3cadf1]" />
                <div>
                  <p className="text-sm font-semibold">LexaRox Assistant</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Instant answers about clients, tasks and documents.
                  </p>
                  <AskAiButton size="sm" variant="outline" className="mt-2 text-xs font-semibold">
                    Chat now
                  </AskAiButton>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#3cadf1] font-semibold hover:bg-[#3cadf1]/90" onClick={() => setTicketOpen(true)}>
              Submit a support ticket
            </Button>
          </div>
        </Section>
      </div>

      <FormDialog
        open={ticketOpen}
        onOpenChange={setTicketOpen}
        title="Submit a support ticket"
        description="Describe your issue and our team will respond within one business day."
        onSave={() => toast.success("Support ticket submitted — reference HELP-1042")}
      >
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input placeholder="Brief summary of your issue" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="e.g. Onboarding, Tasks, AI review, Billing" />
          </div>
          <div className="space-y-1.5">
            <Label>Details</Label>
            <Textarea rows={5} placeholder="Tell us what happened and what you expected…" />
          </div>
        </div>
      </FormDialog>
    </AppShell>
  );
}
