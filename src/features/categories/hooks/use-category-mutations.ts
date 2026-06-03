"use client";

import { categoriesKeys } from "@/features/categories/hooks/category-query-keys";
import { categoryService } from "@/features/categories/services/category.service";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateStatusCategoryRequest
} from "@/features/categories/types/category.types";
import { useTranslations } from "@/lib/i18n/use-translations";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateCategory() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) =>
      categoryService.createCategory(
        accessToken as string,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });
      toast.success(t("categories.createSuccess"));
    },
  });
}

export function useUpdateCategory() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const queryClient = useQueryClient();
  const { t } = useTranslations();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryRequest;
    }) =>
      categoryService.updateCategory(
        accessToken as string,
        id,
        payload,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });
      toast.success(t("categories.updateSuccess"));
    },
  });
}

export function useToggleCategoryStatus(
  onSuccess?: () => void
) {
  const { t } = useTranslations();
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStatusCategoryRequest;
    }) => {
      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      return await categoryService.updateStatusCategory(
        accessToken,
        id,
        payload
      );
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: categoriesKeys.lists(),
      });

      toast.success(
        variables.payload.active
          ? t("categories.activateSuccess")
          : t("categories.deactivateSuccess"),
      );

      if (onSuccess) {
        onSuccess();
      }
    },
  });
}
