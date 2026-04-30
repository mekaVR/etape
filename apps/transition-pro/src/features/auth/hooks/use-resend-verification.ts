import { useMutation } from "@etape/api-client/hooks";
import { resendVerification } from "@etape/api-client/auth";

export function useResendVerification() {
  return useMutation({
    mutationKey: ["resend-verification"],
    mutationFn: resendVerification,
  });
}
