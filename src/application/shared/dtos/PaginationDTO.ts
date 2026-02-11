export interface PaginationInputDTO {
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PaginatedResponseDTO<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponseDTO<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
