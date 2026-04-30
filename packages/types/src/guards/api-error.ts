import type { ApiCodedError } from "../types/api-error.js";

export function isApiCodedError(value: unknown): value is ApiCodedError {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.code === "string" && typeof v.message === "string";
}
