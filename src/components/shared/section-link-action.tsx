import Link from "next/link";

import { Button } from "@/components/ui/button";

type SectionLinkActionProps = {
  href: string;
  label: string;
};

export function SectionLinkAction({
  href,
  label,
}: SectionLinkActionProps) {
  return (
    <Button asChild variant="outline" className="rounded-full max-sm:w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
