import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { Input } from "@/components/ui/input";

type TextInputFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  id?: string;
  placeholder?: string;
  type?: React.ComponentProps<typeof Input>["type"];
  className?: string;
  description?: ReactNode;
};

export function TextInputField({
  label,
  registration,
  error,
  id,
  placeholder,
  type,
  className,
  description,
}: TextInputFieldProps) {
  return (
    <FormFieldItem
      label={label}
      htmlFor={id}
      errors={error ? [{ message: error }] : []}
      description={description}
    >
      <Input
        id={id}
        {...registration}
        type={type}
        className={className}
        placeholder={placeholder}
      />
    </FormFieldItem>
  );
}
