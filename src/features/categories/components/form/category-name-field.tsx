"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n/use-translations";
import { UseFormRegisterReturn } from "react-hook-form";

type CategoryNameFieldProps = {
  error?: string;
  registration: UseFormRegisterReturn;
};

export function CategoryNameField({
  error,
  registration,
}: CategoryNameFieldProps) {
  const { t } = useTranslations();

  return (
    <FormFieldItem
      label={t("categories.categoryName")}
      htmlFor="category-name"
      errors={error ? [{ message: error }] : []}
    >
      <Input
        id="category-name"
        {...registration}
        placeholder={t("categories.categoryNamePlaceholder")}
      />
    </FormFieldItem>
  );
}
