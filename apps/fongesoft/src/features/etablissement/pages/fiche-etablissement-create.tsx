import { FicheEtablissementForm } from "../components/fiche-etablissement-form";

export default function FicheEtablissementCreatePage() {
  return (
    <div className="p-6">
      <FicheEtablissementForm
        title="Création d'un nouvel établissement dans votre région"
        subtitle="Veuillez saisir le SIRET de l'établissement pour lequel vous souhaitez créer cette nouvelle fiche. Nous récupérons automatiquement les données ci-dessous, grâce à l'API Sirene."
      />
    </div>
  );
}
