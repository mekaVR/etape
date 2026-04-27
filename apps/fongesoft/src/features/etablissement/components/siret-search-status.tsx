import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  SIRET_SEARCH_STATUS,
  type SiretSearchStatus,
} from "@etape/types/types/etablissement";
import { SIRENE_STATUS_MESSAGES } from "../constants/sirene-status";

interface SiretSearchStatusProps {
  status: SiretSearchStatus;
  useFormulaireComplet: boolean;
  onUseFormulaireComplet: () => void;
}

export function SiretSearchStatus({
  status,
  useFormulaireComplet,
  onUseFormulaireComplet,
}: SiretSearchStatusProps) {
  if (status === SIRET_SEARCH_STATUS.IDLE) {
    return (
      <p className="text-sm text-muted-foreground">
        {SIRENE_STATUS_MESSAGES[SIRET_SEARCH_STATUS.IDLE]}
      </p>
    );
  }

  if (status === SIRET_SEARCH_STATUS.LOADING) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{SIRENE_STATUS_MESSAGES[SIRET_SEARCH_STATUS.LOADING]}</span>
      </div>
    );
  }

  if (
    status === SIRET_SEARCH_STATUS.OK ||
    status === SIRET_SEARCH_STATUS.OK_ALT
  ) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span>{SIRENE_STATUS_MESSAGES[status]}</span>
      </div>
    );
  }

  const message =
    SIRENE_STATUS_MESSAGES[status] ?? `Erreur inconnue : code ${status}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-5 w-5" />
        <span>{message}</span>
      </div>
      {!useFormulaireComplet && (
        <Button variant="outline" size="sm" onClick={onUseFormulaireComplet}>
          Utiliser le formulaire de création
        </Button>
      )}
    </div>
  );
}
