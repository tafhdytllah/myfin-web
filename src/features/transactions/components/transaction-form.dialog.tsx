"use client";

import { DialogFormActions } from "@/components/dialog-form-actions";
import { DialogFormHeader } from "@/components/dialog-form-header";
import { FormSection } from "@/components/form/form-section";
import { InfoNotice } from "@/components/info-notice";
import { SelectField } from "@/components/inputs/select-field";
import { TextField } from "@/components/inputs/text-field";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { CATEGORY_TYPES, CategoryType } from "@/features/categories/types/category.types";
import { useCreateTransaction, useUpdateTransaction } from "@/features/transactions/hooks/use-transaction-mutations";
import {
  createTransactionFormSchema,
  TransactionFormValues,
} from "@/features/transactions/schemas/transaction-form.schema";
import { Transaction } from "@/features/transactions/types/transaction.types";
import { ApiError } from "@/lib/api/api-error";
import { applyApiFieldErrors } from "@/lib/errors/apply-field-errors";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type TransactionFormDialogProps = {
  transaction?: Transaction | null
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransactionFormDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionFormDialogProps) {
  const { t } = useTranslations();

  const isEditMode = Boolean(transaction);

  const schema = useMemo(() => createTransactionFormSchema(t), [t]);

  const createMutation = useCreateTransaction();

  const updateMutation = useUpdateTransaction();

  const accountsQuery = useAccounts({ status: "active" });

  const categoriesQuery = useCategories({
    status: "active",
    type: "all",
    page: 1,
    size: 100,
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: CATEGORY_TYPES.INCOME,
      accountId: "",
      categoryId: "",
      amount: "0",
      description: "",
    },
  });



  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const activeAccounts = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data],
  );
  const activeCategories = useMemo(
    () =>
      (categoriesQuery.data?.items ?? []).filter((category) => category.type === selectedType),
    [categoriesQuery.data, selectedType],
  );
  const hasActiveAccounts = activeAccounts.length > 0;
  const hasMatchingCategories = activeCategories.length > 0;







  useEffect(() => {
    if (!open) {
      return;
    }

    if (transaction) {
      form.reset({
        type: transaction.type,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount.toString(),
        description: transaction.description,
      });
      return;
    }

    form.reset({
      type: CATEGORY_TYPES.INCOME,
      accountId: "",
      categoryId: "",
      amount: "0",
      description: "",
    });
  }, [transaction, form, open]);

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      if (transaction) {
        await updateMutation.mutateAsync({
          id: transaction.id,
          payload: {
            accountId: values.accountId,
            categoryId: values.categoryId,
            amount: Number(values.amount),
            type: values.type as CategoryType,
            description: values.description,
          }
        });
      } else {
        await createMutation.mutateAsync({
          accountId: values.accountId,
          categoryId: values.categoryId,
          amount: Number(values.amount),
          type: values.type as CategoryType,
          description: values.description,
        });
      }
      onOpenChange(false);
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return;
      }

      applyApiFieldErrors(
        error,
        ["accountId", "categoryId", "amount", "type", "description"],
        form.setError,
      );
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
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

        <FormSection onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <SelectField
                  label={t("common.type")}
                  placeholder={t("common.type")}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);

                    form.setValue("categoryId", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  error={fieldState.error?.message}
                  options={[
                    {
                      label: t("common.income"),
                      value: CATEGORY_TYPES.INCOME,
                    },
                    {
                      label: t("common.expense"),
                      value: CATEGORY_TYPES.EXPENSE,
                    },
                  ]}
                />
              )}
            />

            <Controller
              control={form.control}
              name="accountId"
              render={({ field, fieldState }) => (
                <SelectField
                  label={t("common.account")}
                  placeholder={t("transactions.accountPlaceholder")}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                  options={activeAccounts.map((account) => ({
                    label: account.name,
                    value: account.id,
                  }))}
                />
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <SelectField
                  label={t("common.category")}
                  placeholder={t("transactions.categoryPlaceholder")}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                  options={activeCategories.map((account) => ({
                    label: account.name,
                    value: account.id,
                  }))}
                />
              )}
            />

            <TextField
              id="transaction-amount"
              type="number"
              min={0}
              step="1"
              label={t("common.amount")}
              error={form.formState.errors.amount?.message}
              {...form.register("amount")}
              className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
            />
          </div>

          <TextField
            id="transaction-description"
            type="text"
            autoComplete="transaction-description"
            label={t("common.description")}
            placeholder={t("transactions.descriptionPlaceholder")}
            error={form.formState.errors.description?.message}
            {...form.register("description")}
            className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
          />

          <InfoNotice>
            {t("transactions.dateInfo")}
          </InfoNotice>

          <DialogFormActions
            cancelLabel={t("transactions.cancel")}
            submitLabel={isEditMode ? t("common.update") : t("common.save")}
            pendingLabel={t("transactions.saving")}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
            submitDisabled={
              isPending || !hasActiveAccounts || !hasMatchingCategories
            }
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  );
}
