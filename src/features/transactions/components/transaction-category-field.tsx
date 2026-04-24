"use client";

import Link from "next/link";

import { FormFieldItem } from "@/components/shared/form-field-item";
import { FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/features/categories/types/category-types";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";

type TransactionCategoryFieldProps = {
  categories: Category[];
  error?: string;
  onNavigateAway: () => void;
  onValueChange: (value: string | null) => void;
  value: string;
};

export function TransactionCategoryField({
  categories,
  error,
  onNavigateAway,
  onValueChange,
  value,
}: TransactionCategoryFieldProps) {
  const { t } = useTranslations();
  const hasMatchingCategories = categories.length > 0;
  const selectedCategoryName = categories.find((category) => category.id === value)?.name;

  return (
    <FormFieldItem
      label={t("common.category")}
      errors={error ? [{ message: error }] : []}
      description={
        !hasMatchingCategories ? (
          <FieldDescription>
            {t("transactions.noMatchingCategories")}{" "}
            <Link
              href={routes.categories}
              className="font-medium text-primary underline-offset-4 hover:underline"
              onClick={onNavigateAway}
            >
              {t("transactions.goToCategories")}
            </Link>
          </FieldDescription>
        ) : undefined
      }
    >
      <Select
        value={value}
        disabled={!hasMatchingCategories}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("transactions.categoryPlaceholder")}>
            {selectedCategoryName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldItem>
  );
}
