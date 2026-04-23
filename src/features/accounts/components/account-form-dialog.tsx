"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { FormFieldItem } from "@/components/shared/form-field-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createAccountFormSchema,
  createUpdateAccountFormSchema,
  CreateAccountFormValues,
  UpdateAccountFormValues,
} from "@/features/accounts/schemas/account-form.schema";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/features/accounts/hooks/use-account-queries";
import { Account } from "@/features/accounts/types/account-types";
import { getApiFieldError } from "@/lib/api/error-fields";
import { formatCurrency } from "@/lib/formatters/currency";
import { useTranslations } from "@/lib/i18n/use-translations";

type AccountFormDialogProps = {
  account?: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AccountFormDialog({
  account,
  open,
  onOpenChange,
}: AccountFormDialogProps) {
  const { t } = useTranslations();
  const isEditMode = Boolean(account);
  const createSchema = useMemo(() => createAccountFormSchema(t), [t]);
  const updateSchema = useMemo(() => createUpdateAccountFormSchema(t), [t]);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();

  const createForm = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      openingBalance: "0",
    },
  });

  const updateForm = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateSchema),
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

  function handleCreateSubmit(values: CreateAccountFormValues) {
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
          const nameError = getApiFieldError(error, "name");
          const openingBalanceError = getApiFieldError(error, "openingBalance");

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

  function handleUpdateSubmit(values: UpdateAccountFormValues) {
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
          const nameError = getApiFieldError(error, "name");

          if (nameError) {
            updateForm.setError("name", { message: nameError });
          }
        },
      },
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <FormFieldItem
              label={t("accounts.accountName")}
              htmlFor="account-name"
              errors={[updateForm.formState.errors.name]}
            >
              <Input
                id="account-name"
                {...updateForm.register("name")}
                placeholder={t("accounts.accountNamePlaceholder")}
              />
            </FormFieldItem>

            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t("accounts.currentBalance")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatCurrency(account?.currentBalance ?? 0)}
              </p>
            </div>

            <DialogFormActions
              cancelLabel={t("accounts.cancel")}
              submitLabel={t("common.update")}
              pendingLabel={t("accounts.saving")}
              isPending={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        ) : (
          <form
            className="space-y-5"
            onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          >
            <FormFieldItem
              label={t("accounts.accountName")}
              htmlFor="new-account-name"
              errors={[createForm.formState.errors.name]}
            >
              <Input
                id="new-account-name"
                {...createForm.register("name")}
                placeholder={t("accounts.accountNamePlaceholder")}
              />
            </FormFieldItem>

            <FormFieldItem
              label={t("accounts.openingBalance")}
              htmlFor="opening-balance"
              errors={[createForm.formState.errors.openingBalance]}
              description={<FieldDescription>{t("accounts.openingBalanceHint")}</FieldDescription>}
            >
              <Input
                id="opening-balance"
                min={0}
                step="1"
                type="number"
                {...createForm.register("openingBalance")}
              />
            </FormFieldItem>

            <DialogFormActions
              cancelLabel={t("accounts.cancel")}
              submitLabel={t("common.save")}
              pendingLabel={t("accounts.saving")}
              isPending={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
