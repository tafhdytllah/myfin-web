import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type DataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  previousLabel: string;
  nextLabel: string;
  onPageChange: (page: number) => void;
};

export function DataTablePagination({
  currentPage,
  totalPages,
  previousLabel,
  nextLabel,
  onPageChange,
}: DataTablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-6 justify-center md:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={previousLabel}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href="#"
            text={nextLabel}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
