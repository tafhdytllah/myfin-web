"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { categoriesKeys } from "@/features/categories/hooks/category-query-keys";
import { categoryService } from "@/features/categories/services/category-service";
import {
  Category,
  CategoryListFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/categories/types/category-types";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";

export function useCategories(filters: CategoryListFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: categoriesKeys.list(filters),
    queryFn: () => categoryService.getCategories(accessToken as string, filters),
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
    }) => categoryService.createCategory(accessToken as string, payload),
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
    }) => categoryService.updateCategory(accessToken as string, id, payload),
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
      categoryService.toggleCategoryStatus({
        accessToken: accessToken as string,
        category,
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
