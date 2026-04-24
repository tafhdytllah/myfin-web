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
import { Account } from "@/features/accounts/types/account-types";
import { routes } from "@/lib/constants/routes";
import { useTranslations } from "@/lib/i18n/use-translations";

type TransactionAccountFieldProps = {
  accounts: Account[];
  error?: string;
  onNavigateAway: () => void;
  onValueChange: (value: string | null) => void;
  value: string;
};

export function TransactionAccountField({
  accounts,
  error,
  onNavigateAway,
  onValueChange,
  value,
}: TransactionAccountFieldProps) {
  const { t } = useTranslations();
  const hasActiveAccounts = accounts.length > 0;
  const selectedAccountName = accounts.find((account) => account.id === value)?.name;

  return (
    <FormFieldItem
      label={t("common.account")}
      errors={error ? [{ message: error }] : []}
      description={
        !hasActiveAccounts ? (
          <FieldDescription>
            {t("transactions.noActiveAccounts")}{" "}
            <Link
              href={routes.accounts}
              className="font-medium text-primary underline-offset-4 hover:underline"
              onClick={onNavigateAway}
            >
              {t("transactions.goToAccounts")}
            </Link>
          </FieldDescription>
        ) : undefined
      }
    >
      <Select
        value={value}
        disabled={!hasActiveAccounts}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("transactions.accountPlaceholder")}>
            {selectedAccountName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldItem>
  );
}
