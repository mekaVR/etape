import { Circle, CircleCheck } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AlertInfo } from "@workspace/ui/components/alert-info";
import { IdentitySection } from "../components/identity-section";
import { ContactSection } from "../components/contact-section";
import { ProfessionalSection } from "../components/professional-section";
import {
  useProfileCompletion,
  type ProfileSection,
} from "../hooks/use-profile-completion";

const tabs: { value: ProfileSection; label: string }[] = [
  { value: "identity", label: "Mon identité" },
  { value: "contact", label: "Mes coordonnées" },
  { value: "professional", label: "Ma situation professionnelle" },
];

export default function Profile() {
  const completion = useProfileCompletion();

  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">Mon Profil</h1>
      <AlertInfo
        alertTitle="Informations personnelles"
        alertDescription="Veuillez renseigner vos informations personnelles avec exactitude. Ces données serviront de base à la création de votre dossier."
      />
      <Tabs defaultValue="identity" orientation="vertical" className="gap-6">
        <TabsList className="h-fit min-w-56 flex-col gap-2 rounded-none border-r bg-transparent p-0">
          {tabs.map((tab) => {
            const Icon = completion[tab.value] ? CircleCheck : Circle;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full justify-start rounded-none border-0 border-r-2 border-transparent bg-transparent px-3 py-2 data-[state=active]:border-r-sidebar-active-indicator data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Icon
                  className={
                    completion[tab.value]
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value="identity">
          <IdentitySection />
        </TabsContent>
        <TabsContent value="contact">
          <ContactSection />
        </TabsContent>
        <TabsContent value="professional">
          <ProfessionalSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
