"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegisterReturn } from "react-hook-form";

import { useTranslations } from "@/lib/i18n/use-translations";

type TransactionDescriptionFieldProps = {
  error?: string;
  registration: UseFormRegisterReturn;
};

export function TransactionDescriptionField({
  error,
  registration,
}: TransactionDescriptionFieldProps) {
  const { t } = useTranslations();

  return (
    <FormFieldItem
      label={t("common.description")}
      htmlFor="transaction-description"
      errors={error ? [{ message: error }] : []}
    >
      <Textarea
        id="transaction-description"
        {...registration}
        placeholder={t("transactions.descriptionPlaceholder")}
      />
    </FormFieldItem>
  );
}
