import { IdentitySection } from "../components/identity-section";
import { ContactSection } from "../components/contact-section";
import { ProfessionalSection } from "../components/professional-section";

export default function Profile() {
  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">Mon Profil</h1>
      <IdentitySection />
      <ContactSection />
      <ProfessionalSection />
    </div>
  );
}
