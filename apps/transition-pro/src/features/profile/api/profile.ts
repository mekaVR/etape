import { apiClient } from "@/lib/api";
import type { BeneficiaireProfilePayload } from "@etape/types/schemas/beneficiaire-profile";
import type { BeneficiaireProfile } from "@etape/types/types/beneficiaire-profile";

export async function getMyProfile(): Promise<BeneficiaireProfile | null> {
  const { data } = await apiClient.get<BeneficiaireProfile | null>(
    "/users/me/profile",
  );
  return data;
}

export async function updateMyProfile(
  payload: BeneficiaireProfilePayload,
): Promise<BeneficiaireProfile> {
  const { data } = await apiClient.patch<BeneficiaireProfile>(
    "/users/me/profile",
    payload,
  );
  return data;
}
