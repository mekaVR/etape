import { useMutation } from "@etape/api-client/hooks";
import { resetPassword } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { ResetPasswordFormData } from "@etape/types/schemas/auth";

export function useResetPassword(
  setError: UseFormSetError<ResetPasswordFormData>,
) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: resetPassword,
    onSuccess: () => navigate("/login?reset=success"),
    onError: (error) => applyApiError(error, setError),
  });
}
