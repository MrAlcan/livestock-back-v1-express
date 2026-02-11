export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: PaginationQuery): ParsedPagination {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(String(query.limit || '20'), 10) || 20));
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}
