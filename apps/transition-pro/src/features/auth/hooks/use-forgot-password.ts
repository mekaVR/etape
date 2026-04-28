import { useMutation } from "@etape/api-client/hooks";
import { forgotPassword } from "@etape/api-client/auth";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { ForgotPasswordPayload } from "@etape/types/schemas/auth";

export function useForgotPassword(
  setError: UseFormSetError<ForgotPasswordPayload>,
) {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
    onError: (error) => applyApiError(error, setError),
  });
}
