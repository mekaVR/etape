import { useQuery } from "@etape/api-client/hooks";
import { getMyProfile } from "@/features/profile/api/profile.ts";

export function useMyProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
}
