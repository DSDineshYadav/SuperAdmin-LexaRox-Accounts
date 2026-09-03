import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PageBackLink } from "@/components/page-back-link";
import { PackageFormFields } from "@/components/services/service-forms";
import { FormPageActions } from "@/components/form-page-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/services/packages/create")({
  head: () => ({
    meta: [
      { title: "Create a package — LexaRox Accounts" },
      { name: "description", content: "Bundle firm services into a package for proposals and subscriptions." },
    ],
  }),
  component: CreatePackagePage,
});

function CreatePackagePage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageBackLink to="/services" search={{ tab: "packages" }} label="Back to Manage Services" />

      <PageHeader
        title="Create a package"
        subtitle="Bundle services into a package for proposals and subscriptions."
      />

      <PackageFormFields />

      <FormPageActions>
        <Button variant="ghost" className="text-[#3cadf1]" asChild>
          <Link to="/services" search={{ tab: "packages" }}>
            Cancel
          </Link>
        </Button>
        <Button
          className="bg-[#3cadf1] hover:bg-[#3cadf1]/90"
          onClick={() => {
            toast.success("Package created");
            navigate({ to: "/services", search: { tab: "packages" } });
          }}
        >
          Create
        </Button>
      </FormPageActions>
    </AppShell>
  );
}
