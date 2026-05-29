import Link from "next/link";

type AuthFormFooterLinkProps = {
  prompt: string;
  href: string;
  label: string;
};

export function AuthFormFooterLink({
  prompt,
  href,
  label,
}: AuthFormFooterLinkProps) {
  return (
    <p className="mt-6 text-center text-sm text-(--color-foreground-muted) sm:text-left">
      {prompt}{" "}
      <Link
        className="font-semibold text-(--color-primary-strong)"
        href={href}
      >
        {label}
      </Link>
    </p>
  );
}
