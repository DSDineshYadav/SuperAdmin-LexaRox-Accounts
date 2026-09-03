import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { ServiceFormFields } from "@/components/services/service-forms";
import { FormPageActions } from "@/components/form-page-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/services/create")({
  head: () => ({
    meta: [
      { title: "Create a service — LexaRox Accounts" },
      { name: "description", content: "Create a new firm service for proposals and client billing." },
    ],
  }),
  component: CreateServicePage,
});

function CreateServicePage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageBackLink to="/services" search={{ tab: "services" }} label="Back to Manage Services" />

      <PageHeader
        title="Create a service"
        subtitle="Define service details, client types and pricing for proposals and billing."
      />

      <ServiceFormFields />

      <FormPageActions>
        <Button variant="ghost" className="text-[#3cadf1]" asChild>
          <Link to="/services" search={{ tab: "services" }}>
            Cancel
          </Link>
        </Button>
        <Button
          className="bg-[#3cadf1] hover:bg-[#3cadf1]/90"
          onClick={() => {
            toast.success("Service created");
            navigate({ to: "/services", search: { tab: "services" } });
          }}
        >
          Save
        </Button>
      </FormPageActions>
    </AppShell>
  );
}
