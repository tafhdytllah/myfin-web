"use client";

import { FormFieldItem } from "@/components/shared/form-field-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFormValues } from "@/features/categories/schemas/category-form.schema";
import { useTranslations } from "@/lib/i18n/use-translations";

type CategoryTypeFieldProps = {
  error?: string;
  onValueChange: (value: CategoryFormValues["type"] | null) => void;
  value: CategoryFormValues["type"];
};

export function CategoryTypeField({
  error,
  onValueChange,
  value,
}: CategoryTypeFieldProps) {
  const { t } = useTranslations();
  const selectedTypeLabel =
    value === "INCOME" ? t("common.income") : t("common.expense");

  return (
    <FormFieldItem label={t("common.type")} errors={error ? [{ message: error }] : []}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("common.type")}>
            {selectedTypeLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INCOME">{t("common.income")}</SelectItem>
          <SelectItem value="EXPENSE">{t("common.expense")}</SelectItem>
        </SelectContent>
      </Select>
    </FormFieldItem>
  );
}
