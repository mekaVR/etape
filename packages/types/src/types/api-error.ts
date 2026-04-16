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

export type ApiErrorResponse = ApiValidationError | ApiBusinessError;
