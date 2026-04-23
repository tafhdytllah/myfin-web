import { PropsWithChildren, ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type FormFieldItemProps = PropsWithChildren<{
  label?: string;
  htmlFor?: string;
  errors?: Array<{ message?: string } | undefined>;
  description?: ReactNode;
}>;

export function FormFieldItem({
  label,
  htmlFor,
  errors,
  description,
  children,
}: FormFieldItemProps) {
  const hasErrors = Boolean(errors?.some((error) => error?.message));

  return (
    <Field>
      {label ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : null}
      <FieldContent>
        {children}
        {hasErrors ? <FieldError errors={errors} /> : description}
      </FieldContent>
    </Field>
  );
}
