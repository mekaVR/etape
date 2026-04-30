import { useQuery } from "@etape/api-client/hooks";
import { verifyEmail } from "@etape/api-client/auth";

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      await verifyEmail({ token: token! });
      return true as const;
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
