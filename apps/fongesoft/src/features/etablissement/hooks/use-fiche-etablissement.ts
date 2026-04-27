import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "@etape/api-client/hooks";
import {
  etablissementSchema,
  type EtablissementPayload,
  type TailleEntrepriseCode,
} from "@etape/types/schemas/etablissement";
import { etablissementDefaultValues } from "@etape/types/schemas/etablissement-defaults";
import {
  SIRET_SEARCH_STATUS,
  type ApeCode,
  type EtablissementGouvResponse,
  type SireneApiResponse,
  type SiretSearchStatus,
} from "@etape/types/types/etablissement";
import {
  createEtablissement,
  getApeList,
  searchEtablissementEffectif,
  searchSirene,
  updateEtablissement,
} from "../api/etablissement";
import { MANDATORY_FIELDS } from "../constants/mandatory-fields";
import { applyApiError } from "@/lib/apply-api-error";

type FicheEtablissementMode = "create" | "edit";

function extractHttpStatus(error: unknown): SiretSearchStatus {
  if (error instanceof AxiosError && error.response?.status) {
    return error.response.status as SiretSearchStatus;
  }
  return SIRET_SEARCH_STATUS.SERVER_ERROR;
}

function mapSireneToForm(
  sirene: SireneApiResponse,
  siret: string,
): Partial<EtablissementPayload> {
  const eta = sirene.etablissement;
  const adr = eta.adresseEtablissement;
  const ul = eta.uniteLegale;

  const adresse = [
    adr.numeroVoieEtablissement,
    adr.indiceRepetitionEtablissement,
    adr.typeVoieEtablissement,
    adr.libelleVoieEtablissement,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    siret,
    raison_sociale: ul.denominationUniteLegale,
    adresse,
    complement_adresse: adr.complementAdresseEtablissement ?? "",
    code_postal: adr.codePostalEtablissement,
    ville: adr.libelleCommuneEtablissement,
    ape: ul.activitePrincipaleUniteLegale.replace(".", ""),
    date_creation: eta.dateCreationEtablissement,
    taille_entreprise:
      eta.trancheEffectifsEtablissement as TailleEntrepriseCode,
    etat: ul.etatAdministratifUniteLegale,
  };
}

function extractEffectifMoyen(gouv: EtablissementGouvResponse): number {
  const list = gouv.data.effectifs_annuel ?? [];
  let effectif = 0;
  for (const row of list) {
    if (row.date_derniere_mise_a_jour && row.value !== null) {
      effectif = row.value;
    }
  }
  return effectif;
}

export function useFicheEtablissement(paramSiret: string | undefined) {
  const mode: FicheEtablissementMode = paramSiret ? "edit" : "create";

  const form = useForm<EtablissementPayload>({
    resolver: zodResolver(etablissementSchema),
    defaultValues: {
      ...etablissementDefaultValues,
      siret: paramSiret ?? "",
    },
  });

  const [siretSearchStatus, setSiretSearchStatus] = useState<SiretSearchStatus>(
    SIRET_SEARCH_STATUS.IDLE,
  );
  const [useFormulaireComplet, setUseFormulaireComplet] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const apeQuery = useQuery<ApeCode[]>({
    queryKey: ["ape-list"],
    queryFn: getApeList,
    staleTime: Infinity,
  });

  const searchSiretMutation = useMutation({
    mutationFn: async (siret: string) => {
      setSiretSearchStatus(SIRET_SEARCH_STATUS.LOADING);
      const [sireneResult, gouvResult] = await Promise.allSettled([
        searchSirene(siret),
        searchEtablissementEffectif(siret),
      ]);
      return { siret, sireneResult, gouvResult };
    },
    onSuccess: ({ siret, sireneResult, gouvResult }) => {
      if (sireneResult.status === "fulfilled") {
        setSiretSearchStatus(SIRET_SEARCH_STATUS.OK);
        form.reset({
          ...etablissementDefaultValues,
          ...mapSireneToForm(sireneResult.value, siret),
        });
      } else {
        setSiretSearchStatus(extractHttpStatus(sireneResult.reason));
        form.reset({ ...etablissementDefaultValues, siret });
      }

      if (gouvResult.status === "fulfilled") {
        form.setValue("effectif_moyen", extractEffectifMoyen(gouvResult.value));
      }
    },
  });

  useEffect(() => {
    if (mode === "edit" && paramSiret) {
      searchSiretMutation.mutate(paramSiret);
    }
    // On mount uniquement — paramSiret vient de l'URL et ne change pas pendant la vie du composant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSiretDigitsChange = useCallback(
    (rawDigits: string) => {
      form.setValue("siret", rawDigits);
      if (rawDigits.length === 14) {
        searchSiretMutation.mutate(rawDigits);
      } else {
        form.reset({ ...etablissementDefaultValues, siret: rawDigits });
        setSiretSearchStatus(SIRET_SEARCH_STATUS.IDLE);
        setUseFormulaireComplet(false);
      }
    },
    [form, searchSiretMutation],
  );

  const refreshSiretSearch = useCallback(() => {
    const current = form.getValues("siret");
    if (current.length === 14) {
      searchSiretMutation.mutate(current);
    }
  }, [form, searchSiretMutation]);

  const enableFormulaireComplet = useCallback(() => {
    setUseFormulaireComplet(true);
  }, []);

  const createMutation = useMutation({
    mutationFn: createEtablissement,
    onError: (error) => applyApiError(error, form.setError),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: EtablissementPayload) =>
      updateEtablissement(payload.siret, payload),
    onError: (error) => applyApiError(error, form.setError),
  });

  const onSubmit = form.handleSubmit((data) => {
    if (mode === "edit") {
      setIsWarningOpen(true);
    } else {
      createMutation.mutate(data);
    }
  });

  const confirmWarning = useCallback(() => {
    setIsWarningOpen(false);
    updateMutation.mutate(form.getValues());
  }, [form, updateMutation]);

  const closeWarning = useCallback(() => {
    setIsWarningOpen(false);
  }, []);

  const isSearchingSiret = searchSiretMutation.isPending;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const showFormBody =
    !isSearchingSiret &&
    (siretSearchStatus === SIRET_SEARCH_STATUS.OK || useFormulaireComplet);

  const savedEtablissement = createMutation.data ?? updateMutation.data ?? null;

  return {
    mode,
    form,

    onSiretDigitsChange,
    siretSearchStatus,
    isSearchingSiret,
    refreshSiretSearch,

    apeList: apeQuery.data ?? [],
    isLoadingApeList: apeQuery.isLoading,

    showFormBody,
    useFormulaireComplet,
    enableFormulaireComplet,

    mandatoryFields: MANDATORY_FIELDS,

    onSubmit,
    isSaving,
    savedEtablissement,

    isWarningOpen,
    closeWarning,
    confirmWarning,
  };
}

export type UseFicheEtablissementReturn = ReturnType<
  typeof useFicheEtablissement
>;
