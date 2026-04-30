import type { AuthErrorCode } from "../constants/api-errors.js";

export interface ApiValidationError {
  statusCode: 400;
  error: "Validation failed";
  fields: Record<string, string>;
}

export interface ApiBusinessError {
  statusCode: 401 | 403 | 404 | 409;
  error: string;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiCodedError {
  statusCode: number;
  code: AuthErrorCode;
  message: string;
}

export type ApiErrorResponse =
  | ApiValidationError
  | ApiBusinessError
  | ApiCodedError;
