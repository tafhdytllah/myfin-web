"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n/use-translations";
import { UseFormRegisterReturn } from "react-hook-form";

type AccountNameFieldProps = {
  error?: string;
  id: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
};

export function AccountNameField({
  error,
  id,
  placeholder,
  registration,
}: AccountNameFieldProps) {
  const { t } = useTranslations();

  return (
    <FormFieldItem
      label={t("accounts.accountName")}
      htmlFor={id}
      errors={error ? [{ message: error }] : []}
    >
      <Input id={id} {...registration} placeholder={placeholder} />
    </FormFieldItem>
  );
}
