"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Account } from "@/features/accounts/types/account-types";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/features/accounts/hooks/use-account-queries";
import { ApiError } from "@/lib/api/types";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";

const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  openingBalance: z
    .string()
    .trim()
    .min(1)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0),
});

const updateAccountSchema = z.object({
  name: z.string().trim().min(1),
});

type AccountFormDialogProps = {
  account?: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CreateAccountValues = z.input<typeof createAccountSchema>;
type UpdateAccountValues = z.infer<typeof updateAccountSchema>;

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

export function AccountFormDialog({
  account,
  open,
  onOpenChange,
}: AccountFormDialogProps) {
  const { t } = useTranslations();
  const isEditMode = Boolean(account);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();

  const createForm = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      openingBalance: "0",
    },
  });

  const updateForm = useForm<UpdateAccountValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (account) {
      updateForm.reset({
        name: account.name,
      });
      return;
    }

    createForm.reset({
      name: "",
      openingBalance: "0",
    });
  }, [account, createForm, open, updateForm]);

  function handleCreateSubmit(values: CreateAccountValues) {
    createMutation.mutate(
      {
        payload: {
          name: values.name,
          openingBalance: Number(values.openingBalance),
        },
        onSuccess: () => onOpenChange(false),
      },
      {
        onError: (error) => {
          const nameError = getFieldError(error, "name");
          const openingBalanceError = getFieldError(error, "openingBalance");

          if (nameError) {
            createForm.setError("name", { message: nameError });
          }

          if (openingBalanceError) {
            createForm.setError("openingBalance", {
              message: openingBalanceError,
            });
          }
        },
      },
    );
  }

  function handleUpdateSubmit(values: UpdateAccountValues) {
    if (!account) {
      return;
    }

    updateMutation.mutate(
      {
        id: account.id,
        payload: {
          name: values.name,
          active: account.active,
        },
        onSuccess: () => onOpenChange(false),
      },
      {
        onError: (error) => {
          const nameError = getFieldError(error, "name");

          if (nameError) {
            updateForm.setError("name", { message: nameError });
          }
        },
      },
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t("accounts.editAccount") : t("accounts.addAccount")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("accounts.editDescription")
              : t("accounts.createDescription")}
          </DialogDescription>
        </DialogHeader>

        {isEditMode ? (
          <form
            className="space-y-5"
            onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}
          >
            <Field>
              <FieldLabel htmlFor="account-name">{t("accounts.accountName")}</FieldLabel>
              <FieldContent>
                <Input
                  id="account-name"
                  {...updateForm.register("name")}
                  placeholder={t("accounts.accountNamePlaceholder")}
                />
                <FieldError errors={[updateForm.formState.errors.name]} />
              </FieldContent>
            </Field>

            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("accounts.currentBalance")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatCurrency(account?.currentBalance ?? 0)}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("accounts.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("accounts.saving") : t("common.update")}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="space-y-5"
            onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          >
            <Field>
              <FieldLabel htmlFor="new-account-name">
                {t("accounts.accountName")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="new-account-name"
                  {...createForm.register("name")}
                  placeholder={t("accounts.accountNamePlaceholder")}
                />
                <FieldError errors={[createForm.formState.errors.name]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="opening-balance">
                {t("accounts.openingBalance")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="opening-balance"
                  min={0}
                  step="1"
                  type="number"
                  {...createForm.register("openingBalance")}
                />
                {createForm.formState.errors.openingBalance ? (
                  <FieldError errors={[createForm.formState.errors.openingBalance]} />
                ) : (
                  <FieldDescription>{t("accounts.openingBalanceHint")}</FieldDescription>
                )}
              </FieldContent>
            </Field>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("accounts.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("accounts.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
