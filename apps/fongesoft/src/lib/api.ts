import { createApiClient } from "@etape/api-client/client";

export const apiClient = createApiClient(`${import.meta.env.VITE_API_URL}/api`);
