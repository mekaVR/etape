import { useMutation, useQueryClient } from "@etape/api-client/hooks";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { UseFormSetError } from "react-hook-form";
import type { BeneficiaireProfilePayload } from "@etape/types/schemas/beneficiaire-profile";
import { updateMyProfile } from "@/features/profile/api/profile.ts";

export function useUpdateMyProfile(
  setError: UseFormSetError<BeneficiaireProfilePayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["my-profile"], data);
    },
    onError: (error) => applyApiError(error, setError),
  });
}
