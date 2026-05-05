import { IdentitySection } from "../components/identity-section";
import { ContactSection } from "../components/contact-section";
import { ProfessionalSection } from "../components/professional-section";
import { AlertInfo } from "@workspace/ui/components/alert-info";

export default function Profile() {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">Mon Profil</h1>
      <AlertInfo
        alertTitle={"Informations personnelles"}
        alertDescription={
          "Veuillez renseigner vos informations personnelles avec exactitude. Ces données serviront de base à la création de votre dossier."
        }
      />
      <IdentitySection />
      <ContactSection />
      <ProfessionalSection />
    </div>
  );
}
