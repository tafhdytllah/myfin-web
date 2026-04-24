"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFormActions } from "@/components/shared/dialog-form-actions";
import { DialogFormHeader } from "@/components/shared/dialog-form-header";
import { FormLayout } from "@/components/shared/form-layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AccountCurrentBalanceNotice } from "@/features/accounts/components/account-current-balance-notice";
import { AccountNameField } from "@/features/accounts/components/account-name-field";
import { AccountOpeningBalanceField } from "@/features/accounts/components/account-opening-balance-field";
import {
  CreateAccountFormValues,
  UpdateAccountFormValues,
  createAccountFormSchema,
  createUpdateAccountFormSchema,
} from "@/features/accounts/schemas/account-form.schema";
import {
  useCreateAccount,
  useUpdateAccount,
} from "@/features/accounts/hooks/use-account-queries";
import { Account } from "@/features/accounts/types/account-types";
import { applyApiFieldErrors } from "@/lib/api/apply-field-errors";
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
          applyApiFieldErrors(
            error,
            ["name", "openingBalance"],
            createForm.setError,
          );
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
          applyApiFieldErrors(error, ["name"], updateForm.setError);
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
        <DialogFormHeader
          title={isEditMode ? t("accounts.editAccount") : t("accounts.addAccount")}
          description={
            isEditMode
              ? t("accounts.editDescription")
              : t("accounts.createDescription")
          }
        />

        {isEditMode ? (
          <FormLayout onSubmit={updateForm.handleSubmit(handleUpdateSubmit)}>
            <AccountNameField
              error={updateForm.formState.errors.name?.message}
              id="account-name"
              placeholder={t("accounts.accountNamePlaceholder")}
              registration={updateForm.register("name")}
            />

            <AccountCurrentBalanceNotice balance={account?.currentBalance ?? 0} />

            <DialogFormActions
              cancelLabel={t("accounts.cancel")}
              submitLabel={t("common.update")}
              pendingLabel={t("accounts.saving")}
              isPending={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </FormLayout>
        ) : (
          <FormLayout onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
            <AccountNameField
              error={createForm.formState.errors.name?.message}
              id="new-account-name"
              placeholder={t("accounts.accountNamePlaceholder")}
              registration={createForm.register("name")}
            />

            <AccountOpeningBalanceField
              error={createForm.formState.errors.openingBalance?.message}
              registration={createForm.register("openingBalance")}
            />

            <DialogFormActions
              cancelLabel={t("accounts.cancel")}
              submitLabel={t("common.save")}
              pendingLabel={t("accounts.saving")}
              isPending={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </FormLayout>
        )}
      </DialogContent>
    </Dialog>
  );
}
