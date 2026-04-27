import { apiClient } from "@etape/api-client/client";
import type {
  SireneApiResponse,
  EtablissementGouvResponse,
  ApeCode,
} from "@etape/types/types/etablissement";
import type { EtablissementPayload } from "@etape/types/schemas/etablissement";

export async function searchSirene(siret: string): Promise<SireneApiResponse> {
  const { data } = await apiClient.get<SireneApiResponse>(
    `/external/sirene/${siret}`,
  );
  return data;
}

export async function searchEtablissementEffectif(
  siret: string,
): Promise<EtablissementGouvResponse> {
  const { data } = await apiClient.get<EtablissementGouvResponse>(
    `/external/etablissement-effectif/${siret}`,
  );
  return data;
}

// TODO: endpoint NestJS à créer (/ape → liste des codes APE depuis la DB)
export async function getApeList(): Promise<ApeCode[]> {
  const { data } = await apiClient.get<ApeCode[]>("/ape");
  return data;
}

// TODO: endpoint NestJS à créer (POST /etablissements)
export async function createEtablissement(
  payload: EtablissementPayload,
): Promise<EtablissementPayload> {
  const { data } = await apiClient.post<EtablissementPayload>(
    "/etablissements",
    payload,
  );
  return data;
}

// TODO: endpoint NestJS à créer (PUT /etablissements/:siret)
export async function updateEtablissement(
  siret: string,
  payload: EtablissementPayload,
): Promise<EtablissementPayload> {
  const { data } = await apiClient.put<EtablissementPayload>(
    `/etablissements/${siret}`,
    payload,
  );
  return data;
}
