import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { ServiceFormFields } from "@/components/services/service-forms";
import { FormPageActions } from "@/components/form-page-actions";
import { Button } from "@/components/ui/button";
import { firmServiceItems } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const service = firmServiceItems.find((s) => s.id === params.serviceId);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Service not found — LexaRox" }] };
    return {
      meta: [
        { title: `${loaderData.service.serviceName} — Service · LexaRox Accounts` },
        { name: "description", content: `Edit service ${loaderData.service.serviceName}.` },
      ],
    };
  },
  component: EditServicePage,
});

function EditServicePage() {
  const { service } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageBackLink to="/services" search={{ tab: "services" }} label="Back to Manage Services" />

      <PageHeader
        title="Edit service"
        subtitle={service.internalName}
      />

      <ServiceFormFields service={service} />

      <FormPageActions>
        <Button variant="ghost" className="text-[#3cadf1]" asChild>
          <Link to="/services" search={{ tab: "services" }}>
            Cancel
          </Link>
        </Button>
        <Button
          className="bg-[#3cadf1] hover:bg-[#3cadf1]/90"
          onClick={() => {
            toast.success("Service updated");
            navigate({ to: "/services", search: { tab: "services" } });
          }}
        >
          Save
        </Button>
      </FormPageActions>
    </AppShell>
  );
}
