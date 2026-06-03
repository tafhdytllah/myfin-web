  import { categoryTypeToUrl, urlToCategoryType } from "@/features/categories/types/category.types";
  import { TransactionListFilters } from "@/features/transactions/types/transaction.types";

  export function parseTransactionFilters(searchParams: URLSearchParams): TransactionListFilters {
    const pageValue = Number(searchParams.get("page") ?? "1");
    const sizeValue = Number(searchParams.get("size") ?? "10");

    const raw = searchParams.get("type");
    
    const type =
      raw && raw in urlToCategoryType
        ? urlToCategoryType[raw as keyof typeof urlToCategoryType]
        : "all";
        
    return {
      keyword: searchParams.get("keyword")?.trim() ?? "",
      accountId: searchParams.get("accountId") ?? "",
      type,
      categoryId: searchParams.get("categoryId") ?? "",
      startDate: searchParams.get("startDate") ?? "",
      endDate: searchParams.get("endDate") ?? "",
      page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
      size: Number.isFinite(sizeValue) && sizeValue > 0 ? sizeValue : 10,
    };
  }

  export function buildTransactionSearchParams(filters: TransactionListFilters) {
    const params = new URLSearchParams({
      page: String(filters.page),
      size: String(filters.size),
    });

    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.accountId) params.set("accountId", filters.accountId);
    if (filters.type && filters.type !== "all") params.set("type", categoryTypeToUrl[filters.type]);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    return params;
  }
