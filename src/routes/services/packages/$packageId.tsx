import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { PackageFormFields } from "@/components/services/service-forms";
import { FormPageActions } from "@/components/form-page-actions";
import { Button } from "@/components/ui/button";
import { firmServicePackages } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/services/packages/$packageId")({
  loader: ({ params }) => {
    const pkg = firmServicePackages.find((p) => p.id === params.packageId);
    if (!pkg) throw notFound();
    return { pkg };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Package not found — LexaRox" }] };
    return {
      meta: [
        { title: `${loaderData.pkg.serviceName} — Package · LexaRox Accounts` },
        { name: "description", content: `Edit package ${loaderData.pkg.serviceName}.` },
      ],
    };
  },
  component: EditPackagePage,
});

function EditPackagePage() {
  const { pkg } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageBackLink to="/services" search={{ tab: "packages" }} label="Back to Manage Services" />

      <PageHeader title="Edit package" subtitle={pkg.serviceName} />

      <PackageFormFields
        packageName={pkg.serviceName}
        internalName={pkg.internalPackageName}
        initialServiceIds={pkg.serviceIds}
      />

      <FormPageActions>
        <Button variant="ghost" className="text-[#3cadf1]" asChild>
          <Link to="/services" search={{ tab: "packages" }}>
            Cancel
          </Link>
        </Button>
        <Button
          className="bg-[#3cadf1] hover:bg-[#3cadf1]/90"
          onClick={() => {
            toast.success("Package updated");
            navigate({ to: "/services", search: { tab: "packages" } });
          }}
        >
          Save
        </Button>
      </FormPageActions>
    </AppShell>
  );
}
