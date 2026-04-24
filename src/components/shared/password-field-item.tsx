import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { PasswordInput } from "@/components/shared/password-input";

type PasswordFieldItemProps = {
  label: string;
  registration: UseFormRegisterReturn;
  toggleLabel: string;
  error?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  description?: ReactNode;
};

export function PasswordFieldItem({
  label,
  registration,
  toggleLabel,
  error,
  id,
  placeholder,
  className,
  description,
}: PasswordFieldItemProps) {
  return (
    <FormFieldItem
      label={label}
      htmlFor={id}
      errors={error ? [{ message: error }] : []}
      description={description}
    >
      <PasswordInput
        id={id}
        {...registration}
        className={className}
        placeholder={placeholder}
        toggleLabel={toggleLabel}
      />
    </FormFieldItem>
  );
}
