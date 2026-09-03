import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { History } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { FormDialog } from "@/components/form-dialog";
import { Section, StatusBadge, toneForStatus } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { firmProposals, type ProposalStatus } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/proposals/$proposalId")({
  loader: ({ params }) => {
    const proposal = firmProposals.find((p) => p.id === params.proposalId);
    if (!proposal) throw notFound();
    return { proposal };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Proposal not found — LexaRox" }] };
    return {
      meta: [
        { title: `${loaderData.proposal.template} — Proposal · LexaRox Accounts` },
        { name: "description", content: `Proposal details and history for ${loaderData.proposal.client}.` },
      ],
    };
  },
  component: ProposalDetailPage,
});

function ProposalDetailPage() {
  const { proposal } = Route.useLoaderData();
  const [editOpen, setEditOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <AppShell>
      <PageBackLink to="/proposals" label="Back to Proposal Manager" />
      <PageHeader
        title={proposal.template}
        subtitle={`${proposal.client} · ${proposal.value} · ${proposal.owner}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit proposal
            </Button>
            {proposal.status === "Draft" && (
              <Button onClick={() => setSendOpen(true)}>Send proposal</Button>
            )}
          </div>
        }
      />

      <div className="mb-6">
        <StatusBadge tone={toneForStatus(proposal.status)} dot>
          {proposal.status}
        </StatusBadge>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Proposal details">
          <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Client</dt>
              <dd className="mt-1">
                <Link
                  to="/clients/$clientId"
                  params={{ clientId: proposal.clientId }}
                  className="text-sm font-medium text-[#3cadf1] hover:underline"
                >
                  {proposal.client}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Template</dt>
              <dd className="mt-1 text-sm">{proposal.template}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Value</dt>
              <dd className="mt-1 text-sm font-semibold">{proposal.value}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Sent date</dt>
              <dd className="mt-1 text-sm">{proposal.sentDate}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Owner</dt>
              <dd className="mt-1 text-sm">{proposal.owner}</dd>
            </div>
          </dl>
        </Section>

        <Section title="Proposal history" description="Status changes and client interactions">
          <ul className="divide-y">
            {proposal.history.map((h, i) => (
              <li key={i} className="flex gap-3 px-4 py-3 sm:px-5">
                <History className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{h.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.by} · {h.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit proposal · ${proposal.client}`}
        description="Update proposal details before sending or re-sending to the client."
        onSave={() => toast.success("Proposal updated")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Client</Label>
            <Input defaultValue={proposal.client} />
          </div>
          <div className="space-y-1.5">
            <Label>Template</Label>
            <Input defaultValue={proposal.template} />
          </div>
          <div className="space-y-1.5">
            <Label>Value</Label>
            <Input defaultValue={proposal.value} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={proposal.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired"] as ProposalStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea rows={3} placeholder="Internal notes about this proposal…" />
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        title="Send proposal to client"
        description={`Send this proposal to ${proposal.client} for review and acceptance.`}
        saveLabel="Send proposal"
        onSave={() => toast.success("Proposal sent to client")}
      >
        <div className="space-y-1.5">
          <Label>Recipient email</Label>
          <Input type="email" placeholder="contact@company.co.uk" />
        </div>
        <div className="space-y-1.5">
          <Label>Cover message</Label>
          <Textarea
            rows={4}
            defaultValue={`Please find attached our proposal for ${proposal.template}. We'd be happy to discuss the scope and answer any questions.`}
          />
        </div>
      </FormDialog>
    </AppShell>
  );
}
