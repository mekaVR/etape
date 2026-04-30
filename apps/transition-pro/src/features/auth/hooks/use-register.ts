import { useMutation } from "@etape/api-client/hooks";
import { register } from "@etape/api-client/auth";
import { useNavigate } from "react-router";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { SignupFormData } from "@etape/types/schemas/auth";

export function useRegister(setError: UseFormSetError<SignupFormData>) {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: (_data, credentials) => {
      navigate("/check-email", { state: { email: credentials.email } });
    },
    onError: (error) => applyApiError(error, setError),
  });
}
