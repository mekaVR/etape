import { useMutation, useQueryClient } from "@etape/api-client/hooks";
import { updateMyProfile } from "../api/profile";
import { applyApiError } from "@/lib/apply-api-error.ts";
import type { FieldValues, UseFormSetError } from "react-hook-form";

export function useUpdateMyProfile<T extends FieldValues>(
  setError: UseFormSetError<T>,
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
