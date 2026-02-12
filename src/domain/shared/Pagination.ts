export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
}

export function createPagination(page: number = 1, limit: number = 20): Pagination {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

export type DateRange = {
  readonly startDate: Date;
  readonly endDate: Date;
};

export function createDateRange(startDate: Date, endDate: Date): DateRange {
  if (endDate < startDate) {
    throw new Error('endDate must be greater than or equal to startDate');
  }
  return { startDate, endDate };
}

export function dateRangeContains(range: DateRange, date: Date): boolean {
  return date >= range.startDate && date <= range.endDate;
}
