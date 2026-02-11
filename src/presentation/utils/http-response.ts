import { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
    stack?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response {
  const totalPages = Math.ceil(total / limit);
  const response: ApiPaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
  return res.status(200).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>,
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(response);
}
