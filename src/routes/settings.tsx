import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, Sparkles, Lock, Cpu, CheckCircle2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { KpiCard, Section } from "@/components/kit";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agents, languages, teamMembers, firmProfile } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LexaRox Accounts" },
      {
        name: "description",
        content: "Users, roles, AI agents, languages, data protection and integrations for LexaRox.",
      },
      { property: "og:title", content: "Settings — LexaRox Accounts" },
      { property: "og:description", content: "Administration, privacy controls and integrations." },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  ["firm", "Firm Profile"],
  ["agents", "AI Agents"],
  ["languages", "Languages"],
  ["privacy", "Data & Privacy"],
] as const;

function SettingsPage() {
  const [firmProfileOpen, setFirmProfileOpen] = useState(false);

  return (
    <AppShell>
      <PageHeader
        title="System Administration & Configuration"
        subtitle="User access management, AI agent policies, privacy controls and active integrations."
      />

      {/* KPI Summary Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KpiCard
          label="Active Users"
          value={String(teamMembers.length)}
          trend="Role Protected"
          up={true}
          support="Staff & admin accounts"
          icon={<Users className="h-5 w-5" />}
          variant="cyan"
        />
        <KpiCard
          label="AI Agents Running"
          value={String(agents.filter((a) => a.status !== "Paused").length)}
          trend="Active"
          up={true}
          support="Out of 6 configured agents"
          icon={<Cpu className="h-5 w-5" />}
          variant="green"
        />
        <KpiCard
          label="Connected Apps"
          value="4"
          trend="Healthy"
          up={true}
          support="Email, WhatsApp, Phone, AI"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="purple"
        />
        <KpiCard
          label="Security & Compliance"
          value="100%"
          trend="GDPR Compliant"
          up={true}
          support="Audit logs enabled"
          icon={<Lock className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      <Tabs defaultValue="firm">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {tabs.map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="text-xs sm:text-sm font-semibold">
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="firm" className="mt-5">
          <Section title="Firm profile" description="Your accountancy firm's core details">
            <dl className="grid gap-4 p-4 sm:grid-cols-2 sm:px-5">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Firm name</dt>
                <dd className="mt-1 text-sm font-semibold">{firmProfile.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Companies House</dt>
                <dd className="mt-1 text-sm">{firmProfile.companiesHouse}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Address</dt>
                <dd className="mt-1 text-sm">{firmProfile.address}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Timezone</dt>
                <dd className="mt-1 text-sm">{firmProfile.timezone}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                <dd className="mt-1 text-sm">{firmProfile.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Phone</dt>
                <dd className="mt-1 text-sm">{firmProfile.phone}</dd>
              </div>
            </dl>
            <div className="border-t px-4 py-3 sm:px-5">
              <Button size="sm" variant="outline" onClick={() => setFirmProfileOpen(true)}>
                Edit firm profile
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="agents" className="mt-5">
          <Section title="AI Agent Policy & Master Controls" description="Enable, pause, or adjust confidence thresholds for autonomous agents">
            <ul className="divide-y">
              {agents.map((a) => (
                <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#3cadf1]" />
                      <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                    </div>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">{a.description}</p>
                  </div>
                  <Switch
                    defaultChecked={a.status !== "Paused"}
                    onCheckedChange={(checked) => toast.success(`${a.name} ${checked ? "enabled" : "paused"}`)}
                  />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="languages" className="mt-5">
          <Section title="Multilingual Capabilities" description="Languages enabled for AI-guided client onboarding">
            <ul className="divide-y">
              {languages.map((l) => (
                <li key={l} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span className="truncate text-sm font-semibold text-foreground">{l}</span>
                  <Switch defaultChecked={l === "English" || l === "Spanish"} onCheckedChange={(c) => toast(`${l} translation ${c ? "enabled" : "disabled"}`)} />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="privacy" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Section title="Data Governance & Privacy" description="Retention rules, GDPR compliance and access logs">
            <ul className="divide-y text-sm">
              {[
                ["Document Retention Policy", "Client documents retained securely for 7 years, then queued for automated deletion."],
                ["Client Consent Registry", "Consent digitally captured during onboarding with immutable timestamp."],
                ["Restricted Document Access", "Document access enforced by account manager role scoping."],
                ["Audit Review Schedule", "Quarterly automated access permission audit for compliance."],
              ].map(([t, d]) => (
                <li key={t} className="px-4 py-3.5 sm:px-5">
                  <p className="font-bold text-foreground">{t}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="AI Action Audit & Traceability" description="Complete record of every autonomous decision">
            <div className="space-y-3 p-4 text-sm sm:px-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every AI action records the specific agent ID, input parameters, confidence score, and the staff member who reviewed or approved it. Audit logs are fully exportable for compliance.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-xs font-semibold" onClick={() => toast.success("Full system audit log export started")}>
                  Export Audit Log (CSV)
                </Button>
                <Button size="sm" variant="outline" className="text-xs font-semibold" onClick={() => toast.info("Data processing agreement loaded")}>
                  View Data Agreement
                </Button>
              </div>
            </div>
          </Section>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={firmProfileOpen}
        onOpenChange={setFirmProfileOpen}
        title="Edit firm profile"
        description="Update your accountancy firm's core details."
        onSave={() => toast.success("Firm profile updated")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Firm name</Label>
            <Input defaultValue={firmProfile.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Companies House number</Label>
            <Input defaultValue={firmProfile.companiesHouse} />
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Input defaultValue={firmProfile.timezone} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input defaultValue={firmProfile.address} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue={firmProfile.email} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input defaultValue={firmProfile.phone} />
          </div>
        </div>
      </FormDialog>
    </AppShell>
  );
}
