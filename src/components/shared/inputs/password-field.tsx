import { ReactNode } from "react";
import { FormFieldItem } from "@/components/shared/form/form-field-item";
import { PasswordInput } from "@/components/shared/inputs/password-input";

type PasswordFieldProps = {
  label: string;
  error?: string;
  description?: ReactNode;
} & React.ComponentProps<typeof PasswordInput>;

export function PasswordField({
  label,
  error,
  description,
  id,
  ...props
}: PasswordFieldProps) {
  return (
    <FormFieldItem
      label={label}
      htmlFor={id}
      errors={error ? [{ message: error }] : []}
      description={description}
    >
      <PasswordInput
        id={id}
        {...props}
      />
    </FormFieldItem>
  );
}
