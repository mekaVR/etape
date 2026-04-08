import {
  QueryClientProvider,
  createQueryClient,
} from "@etape/api-client/hooks";

const queryClient = createQueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
