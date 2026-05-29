"use client";

import { DialogFormActions } from "@/components/dialog-form-actions";
import { DialogFormHeader } from "@/components/dialog-form-header";
import { FormCurrentBalanceNotice } from "@/components/form/form-current-balance-notice";
import { FormSection } from "@/components/form/form-section";
import { TextField } from "@/components/inputs/text-field";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/features/accounts/hooks/use-account-mutations";
import {
  CreateAccountFormValues,
  UpdateAccountFormValues,
  createAccountFormSchema,
  updateAccountFormSchema,
} from "@/features/accounts/schemas/account-form.schema";
import { Account } from "@/features/accounts/types/account.types";
import { ApiError } from "@/lib/api/api-error";
import { applyApiFieldErrors } from "@/lib/errors/apply-field-errors";
import { useTranslations } from "@/lib/i18n/use-translations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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
  const updateSchema = useMemo(() => updateAccountFormSchema(t), [t]);
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

  const form = isEditMode ? updateForm : createForm;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && account) {
      updateForm.reset({
        name: account.name,
      });
      return;
    }

    createForm.reset({
      name: "",
      openingBalance: "0",
    });
  }, [account, createForm, updateForm, isEditMode, open]);

  const onCreateSubmit = async (values: CreateAccountFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        openingBalance: Number(values.openingBalance),
      });

      onOpenChange(false);
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return;
      }

      applyApiFieldErrors(
        error,
        ["name", "openingBalance"],
        form.setError
      );
    }
  }

  const onUpdateSubmit = async (values: UpdateAccountFormValues) => {
    if (!account) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: account.id,
        payload: {
          name: values.name,
        }
      });

      onOpenChange(false);
    } catch (error) {
      if (!ApiError.isApiError(error)) {
        return;
      }

      applyApiFieldErrors(
        error,
        ["name"],
        form.setError
      );
    }
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
        <DialogFormHeader
          title={isEditMode ? t("accounts.editAccount") : t("accounts.addAccount")}
          description={isEditMode ? t("accounts.editDescription") : t("accounts.createDescription")}
        />

        <FormSection
          onSubmit={
            isEditMode
              ? updateForm.handleSubmit(onUpdateSubmit)
              : createForm.handleSubmit(onCreateSubmit)
          }
        >
          <TextField
            id="account-name"
            type="text"
            autoComplete="account-name"
            label={t("accounts.accountName")}
            placeholder={t("accounts.accountNamePlaceholder")}
            error={isEditMode
              ? updateForm.formState.errors.name?.message
              : createForm.formState.errors.name?.message
            }
            {...(isEditMode
              ? updateForm.register("name")
              : createForm.register("name"))
            }
            className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
          />

          {!isEditMode && (
            <TextField
              id="account-opening-balance"
              type="number"
              min={0}
              step="1"
              label={t("accounts.openingBalance")}
              error={createForm.formState.errors.openingBalance?.message}
              {...createForm.register("openingBalance")}
              className="h-12 rounded-2xl border-(--color-border-strong) bg-white px-4 dark:bg-transparent"
            />
          )}

          {isEditMode && (
            <FormCurrentBalanceNotice
              label={t("accounts.currentBalance")}
              balance={account?.currentBalance ?? 0}
            />
          )}

          <DialogFormActions
            cancelLabel={t("accounts.cancel")}
            submitLabel={
              isEditMode
                ? t("common.update")
                : t("common.create")
            }
            pendingLabel={t("accounts.saving")}
            isPending={isSubmitting}
            submitDisabled={!form.formState.isDirty}
            onCancel={() => onOpenChange(false)}
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  );
}
