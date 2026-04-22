"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createCategory,
  getCategories,
  updateCategory,
} from "@/features/categories/api/categories-api";
import {
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/categories/types/category-types";
import { ApiError } from "@/lib/api/types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export const categoriesKeys = {
  all: ["categories"] as const,
  list: (filters: CategoryListFilters) =>
    ["categories", "list", filters] as const,
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function useCategories(filters: CategoryListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => getCategories(accessToken as string, filters),
    enabled: Boolean(accessToken),
  });
}

export function useCreateCategory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      payload,
    }: {
      payload: CreateCategoryPayload;
      onSuccess?: () => void;
    }) => createCategory(accessToken as string, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      toast.success(t("categories.createSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("categories.createError")));
    },
  });
}

export function useUpdateCategory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
      onSuccess?: () => void;
    }) => updateCategory(accessToken as string, id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      toast.success(t("categories.updateSuccess"));
      variables.onSuccess?.();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t("categories.updateError")));
    },
  });
}

export function useToggleCategoryStatus() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      category,
      active,
    }: {
      category: Category;
      active: boolean;
      onSuccess?: () => void;
    }) =>
      updateCategory(accessToken as string, category.id, {
        name: category.name,
        type: category.type,
        active,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      toast.success(
        variables.active
          ? t("categories.activateSuccess")
          : t("categories.deactivateSuccess"),
      );
      variables.onSuccess?.();
    },
    onError: (error, variables) => {
      toast.error(
        getApiErrorMessage(
          error,
          variables.active
            ? t("categories.activateError")
            : t("categories.deactivateError"),
        ),
      );
    },
  });
}
