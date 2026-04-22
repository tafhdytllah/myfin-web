"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  accountId: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
  amount: z
    .string()
    .trim()
    .min(1)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0),
  description: z.string().trim().optional(),
});

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TransactionFormValues = z.infer<typeof transactionSchema>;

function getFieldError(error: unknown, field: string) {
  if (!(error instanceof ApiError)) {
    return undefined;
  }

  const detail = error.details?.[field];
  if (Array.isArray(detail)) {
    return detail[0];
  }

  return detail;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
}: TransactionFormDialogProps) {
  const { t } = useTranslations();
  const createMutation = useCreateTransaction();
  const accountsQuery = useAccounts({ status: "active" });
  const categoriesQuery = useCategories({ status: "active", type: "all" });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
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
          const accountError = getFieldError(error, "accountId");
          const categoryError = getFieldError(error, "categoryId");
          const amountError = getFieldError(error, "amount");
          const typeError = getFieldError(error, "type");
          const descriptionError = getFieldError(error, "description");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("transactions.addTransaction")}</DialogTitle>
          <DialogDescription>
            {t("transactions.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("common.type")}</Label>
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
                  <SelectValue placeholder={t("common.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">{t("common.income")}</SelectItem>
                  <SelectItem value="EXPENSE">{t("common.expense")}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.type.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>{t("common.account")}</Label>
              <Select
                value={selectedAccountId}
                onValueChange={(value) =>
                  form.setValue("accountId", value ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("transactions.accountPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {activeAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.accountId?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.accountId.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("common.category")}</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) =>
                  form.setValue("categoryId", value ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("transactions.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {activeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-amount">{t("common.amount")}</Label>
              <Input
                id="transaction-amount"
                min={0}
                step="1"
                type="number"
                {...form.register("amount")}
                placeholder={t("transactions.amountPlaceholder")}
              />
              {form.formState.errors.amount?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-description">{t("common.description")}</Label>
            <Textarea
              id="transaction-description"
              {...form.register("description")}
              placeholder={t("transactions.descriptionPlaceholder")}
            />
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            {t("transactions.dateInfo")}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("transactions.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("transactions.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
