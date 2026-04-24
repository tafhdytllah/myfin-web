"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { Input } from "@/components/ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

import { useTranslations } from "@/lib/i18n/use-translations";

type TransactionAmountFieldProps = {
  error?: string;
  registration: UseFormRegisterReturn;
};

export function TransactionAmountField({
  error,
  registration,
}: TransactionAmountFieldProps) {
  const { t } = useTranslations();

  return (
    <FormFieldItem
      label={t("common.amount")}
      htmlFor="transaction-amount"
      errors={error ? [{ message: error }] : []}
    >
      <Input
        id="transaction-amount"
        min={0}
        step="1"
        type="number"
        {...registration}
        placeholder={t("transactions.amountPlaceholder")}
      />
    </FormFieldItem>
  );
}
