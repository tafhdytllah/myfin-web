"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n/use-translations";
import { UseFormRegisterReturn } from "react-hook-form";

type AccountOpeningBalanceFieldProps = {
  error?: string;
  registration: UseFormRegisterReturn;
};

export function AccountOpeningBalanceField({
  error,
  registration,
}: AccountOpeningBalanceFieldProps) {
  const { t } = useTranslations();

  return (
    <FormFieldItem
      label={t("accounts.openingBalance")}
      htmlFor="opening-balance"
      errors={error ? [{ message: error }] : []}
      description={
        <FieldDescription>{t("accounts.openingBalanceHint")}</FieldDescription>
      }
    >
      <Input
        id="opening-balance"
        min={0}
        step="1"
        type="number"
        {...registration}
      />
    </FormFieldItem>
  );
}
