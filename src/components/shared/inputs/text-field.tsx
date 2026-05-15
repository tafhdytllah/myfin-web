import { ReactNode } from "react";
import { FormFieldItem } from "@/components/shared/form/form-field-item";
import { Input } from "@/components/ui/input";

type TextFieldProps = {
  label?: string;
  error?: string;
  description?: ReactNode;
} & React.ComponentProps<typeof Input>;

export function TextField({
  label,
  error,
  description,
  id,
  ...props
}: TextFieldProps) {
  return (
    <FormFieldItem
      label={label}
      htmlFor={id}
      errors={error ? [{ message: error }] : []}
      description={description}
    >
      <Input
        id={id}
        {...props}
      />
    </FormFieldItem>
  );
}
