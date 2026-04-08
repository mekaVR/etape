import {
  QueryClientProvider,
  createQueryClient,
} from "@etape/api-client/hooks";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./auth-provider";

const queryClient = createQueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
