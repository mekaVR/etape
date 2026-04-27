import { useParams } from "react-router";
import { FicheEtablissementForm } from "../components/fiche-etablissement-form";

export default function FicheEtablissementEditPage() {
  const { siret } = useParams<{ siret: string }>();

  return (
    <div className="p-6">
      <FicheEtablissementForm
        paramSiret={siret}
        title="Modification de l'établissement"
      />
    </div>
  );
}
