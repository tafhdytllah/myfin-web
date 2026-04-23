"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";

import { DialogFormHeader } from "@/components/shared/dialog-form-header";
import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { FormFieldItem } from "@/components/shared/form-field-item";
import { InfoNotice } from "@/components/shared/info-notice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { CategoryType } from "@/features/categories/types/category-types";
import { useCreateTransaction } from "@/features/transactions/hooks/use-transaction-queries";
import {
  createTransactionFormSchema,
  TransactionFormValues,
} from "@/features/transactions/schemas/transaction-form.schema";
import { getApiFieldError } from "@/lib/api/error-fields";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransactionFormDialog({
  open,
  onOpenChange,
}: TransactionFormDialogProps) {
  const { t } = useTranslations();
  const schema = useMemo(() => createTransactionFormSchema(t), [t]);
  const createMutation = useCreateTransaction();
  const accountsQuery = useAccounts({ status: "active" });
  const categoriesQuery = useCategories({ status: "active", type: "all" });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "EXPENSE",
      accountId: "",
      categoryId: "",
      amount: "",
      description: "",
    },
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });
  const selectedAccountId = useWatch({
    control: form.control,
    name: "accountId",
  });
  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const activeAccounts = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data],
  );
  const selectedTypeLabel = selectedType === "INCOME" ? t("common.income") : t("common.expense");
  const selectedAccountName = useMemo(
    () => activeAccounts.find((account) => account.id === selectedAccountId)?.name,
    [activeAccounts, selectedAccountId],
  );
  const activeCategories = useMemo(
    () =>
      (categoriesQuery.data ?? []).filter((category) => category.type === selectedType),
    [categoriesQuery.data, selectedType],
  );
  const selectedCategoryName = useMemo(
    () =>
      activeCategories.find((category) => category.id === selectedCategoryId)?.name,
    [activeCategories, selectedCategoryId],
  );
  const hasActiveAccounts = activeAccounts.length > 0;
  const hasMatchingCategories = activeCategories.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      type: "EXPENSE",
      accountId: "",
      categoryId: "",
      amount: "",
      description: "",
    });
  }, [form, open]);

  useEffect(() => {
    form.setValue("categoryId", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form, selectedType]);

  function handleSubmit(values: TransactionFormValues) {
    createMutation.mutate(
      {
        payload: {
          accountId: values.accountId,
          categoryId: values.categoryId,
          amount: Number(values.amount),
          type: values.type as CategoryType,
          description: values.description,
        },
        onSuccess: () => onOpenChange(false),
      },
      {
        onError: (error) => {
          const accountError = getApiFieldError(error, "accountId");
          const categoryError = getApiFieldError(error, "categoryId");
          const amountError = getApiFieldError(error, "amount");
          const typeError = getApiFieldError(error, "type");
          const descriptionError = getApiFieldError(error, "description");

          if (accountError) form.setError("accountId", { message: accountError });
          if (categoryError) form.setError("categoryId", { message: categoryError });
          if (amountError) form.setError("amount", { message: amountError });
          if (typeError) form.setError("type", { message: typeError });
          if (descriptionError) {
            form.setError("description", { message: descriptionError });
          }
        },
      },
    );
  }

  const isSubmitting = createMutation.isPending;
  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-2xl">
        <DialogFormHeader
          title={t("transactions.addTransaction")}
          description={t("transactions.createDescription")}
        />

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormFieldItem label={t("common.type")} errors={[form.formState.errors.type]}>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  form.setValue("type", value as TransactionFormValues["type"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
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

            <FormFieldItem
              label={t("common.account")}
              errors={[form.formState.errors.accountId]}
              description={
                !hasActiveAccounts ? (
                  <FieldDescription>
                    {t("transactions.noActiveAccounts")}{" "}
                    <Link
                      href={routes.accounts}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      onClick={() => onOpenChange(false)}
                    >
                      {t("transactions.goToAccounts")}
                    </Link>
                  </FieldDescription>
                ) : undefined
              }
            >
              <Select
                value={selectedAccountId}
                disabled={!hasActiveAccounts}
                onValueChange={(value) =>
                  form.setValue("accountId", value ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("transactions.accountPlaceholder")}>
                    {selectedAccountName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldItem>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormFieldItem
              label={t("common.category")}
              errors={[form.formState.errors.categoryId]}
              description={
                !hasMatchingCategories ? (
                  <FieldDescription>
                    {t("transactions.noMatchingCategories")}{" "}
                    <Link
                      href={routes.categories}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      onClick={() => onOpenChange(false)}
                    >
                      {t("transactions.goToCategories")}
                    </Link>
                  </FieldDescription>
                ) : undefined
              }
            >
              <Select
                value={selectedCategoryId}
                disabled={!hasMatchingCategories}
                onValueChange={(value) =>
                  form.setValue("categoryId", value ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("transactions.categoryPlaceholder")}>
                    {selectedCategoryName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldItem>

            <FormFieldItem
              label={t("common.amount")}
              htmlFor="transaction-amount"
              errors={[form.formState.errors.amount]}
            >
              <Input
                id="transaction-amount"
                min={0}
                step="1"
                type="number"
                {...form.register("amount")}
                placeholder={t("transactions.amountPlaceholder")}
              />
            </FormFieldItem>
          </div>

          <FormFieldItem
            label={t("common.description")}
            htmlFor="transaction-description"
            errors={[form.formState.errors.description]}
          >
            <Textarea
              id="transaction-description"
              {...form.register("description")}
              placeholder={t("transactions.descriptionPlaceholder")}
            />
          </FormFieldItem>

          <InfoNotice>
            {t("transactions.dateInfo")}
          </InfoNotice>

          <DialogFormActions
            cancelLabel={t("transactions.cancel")}
            submitLabel={t("common.save")}
            pendingLabel={t("transactions.saving")}
            isPending={isSubmitting}
            onCancel={() => onOpenChange(false)}
            submitDisabled={
              isSubmitting || !hasActiveAccounts || !hasMatchingCategories
            }
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
