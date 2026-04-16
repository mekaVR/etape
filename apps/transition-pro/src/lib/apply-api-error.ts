import { AxiosError } from "axios";
import type { UseFormSetError } from "react-hook-form";
import type { ApiErrorResponse } from "@etape/types/types/api-error";

export function applyApiError(
  error: unknown,
  setError: UseFormSetError<any>,
): void {
  if (!(error instanceof AxiosError) || !error.response?.data) {
    return;
  }

  const data = error.response.data as ApiErrorResponse;

  if ("fields" in data && data.fields) {
    for (const [field, message] of Object.entries(data.fields)) {
      setError(field, { message });
    }
    return;
  }

  if ("message" in data) {
    setError("root.serverError", { message: data.message });
  }
}
