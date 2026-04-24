"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { DialogFormHeader } from "@/components/shared/dialog-form-header";
import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { FormLayout } from "@/components/shared/form-layout";
import { InfoNotice } from "@/components/shared/info-notice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccounts } from "@/features/accounts/hooks/use-account-queries";
import { useCategories } from "@/features/categories/hooks/use-category-queries";
import { CategoryType } from "@/features/categories/types/category-types";
import { TransactionAccountField } from "@/features/transactions/components/transaction-account-field";
import { TransactionAmountField } from "@/features/transactions/components/transaction-amount-field";
import { TransactionCategoryField } from "@/features/transactions/components/transaction-category-field";
import { TransactionDescriptionField } from "@/features/transactions/components/transaction-description-field";
import { TransactionTypeField } from "@/features/transactions/components/transaction-type-field";
import { useCreateTransaction } from "@/features/transactions/hooks/use-transaction-queries";
import {
  createTransactionFormSchema,
  TransactionFormValues,
} from "@/features/transactions/schemas/transaction-form.schema";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
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
  const activeCategories = useMemo(
    () =>
      (categoriesQuery.data ?? []).filter((category) => category.type === selectedType),
    [categoriesQuery.data, selectedType],
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
          applyApiFieldErrors(
            error,
            ["accountId", "categoryId", "amount", "type", "description"],
            form.setError,
          );
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

        <FormLayout onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <TransactionTypeField
              error={form.formState.errors.type?.message}
              value={selectedType}
              onValueChange={(value) =>
                form.setValue("type", value ?? "EXPENSE", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

            <TransactionAccountField
              accounts={activeAccounts}
              error={form.formState.errors.accountId?.message}
              value={selectedAccountId}
              onNavigateAway={() => onOpenChange(false)}
              onValueChange={(value) =>
                form.setValue("accountId", value ?? "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TransactionCategoryField
              categories={activeCategories}
              error={form.formState.errors.categoryId?.message}
              value={selectedCategoryId}
              onNavigateAway={() => onOpenChange(false)}
              onValueChange={(value) =>
                form.setValue("categoryId", value ?? "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

            <TransactionAmountField
              error={form.formState.errors.amount?.message}
              registration={form.register("amount")}
            />
          </div>

          <TransactionDescriptionField
            error={form.formState.errors.description?.message}
            registration={form.register("description")}
          />

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
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
}
