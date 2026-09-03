import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageBackLinkProps = {
  to: LinkProps["to"];
  label: string;
  params?: LinkProps["params"];
  search?: LinkProps["search"];
};

export function PageBackLink({ to, label, params, search }: PageBackLinkProps) {
  return (
    <div className="mb-4">
      <Button variant="link" asChild className="h-auto px-0 text-[#3cadf1]">
        <Link to={to} params={params} search={search}>
          <ArrowLeft className="h-4 w-4" />
          {label}
        </Link>
      </Button>
    </div>
  );
}
