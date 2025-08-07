import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Options } from "nuqs";

interface MoviePaginationProps {
  page: number;
  setPage: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
}

const MoviePagination = ({ page, setPage }: MoviePaginationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              setPage((prev) => {
                if (prev === 0) {
                  return prev;
                }
                return prev - 1;
              })
            }
            href="#"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setPage((prev) => {
                return prev + 1;
              })
            }
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MoviePagination;
