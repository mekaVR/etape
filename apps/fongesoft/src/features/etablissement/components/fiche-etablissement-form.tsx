import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { useFicheEtablissement } from "../hooks/use-fiche-etablissement";
import { EtablissementFields } from "./etablissement-fields";
import { SiretInput } from "./siret-input";
import { SiretSearchStatus } from "./siret-search-status";
import { WarningDialog } from "./warning-dialog";

interface FicheEtablissementFormProps {
  paramSiret?: string;
  title: string;
  subtitle?: string;
}

export function FicheEtablissementForm({
  paramSiret,
  title,
  subtitle,
}: FicheEtablissementFormProps) {
  const h = useFicheEtablissement(paramSiret);
  const siretValue = h.form.watch("siret");
  const siretError = h.form.formState.errors.siret;

  return (
    <>
      <WarningDialog
        open={h.isWarningOpen}
        onClose={h.closeWarning}
        onConfirm={h.confirmWarning}
        isPending={h.isSaving}
      />

      <Card>
        <form onSubmit={h.onSubmit} className="space-y-6">
          <CardHeader className={"bg-sidebar-primary text-white"}>
            <CardTitle>{title}</CardTitle>
            {subtitle && (
              <CardDescription className={"text-white"}>
                {subtitle}
              </CardDescription>
            )}
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 p-6">
              <Field data-invalid={!!siretError}>
                <FieldLabel htmlFor="siret">
                  Saisir le SIRET de l'établissement
                </FieldLabel>
                <SiretInput
                  id="siret"
                  value={siretValue}
                  onDigitsChange={h.onSiretDigitsChange}
                  onRefresh={h.refreshSiretSearch}
                  disabled={h.mode === "edit"}
                  invalid={!!siretError}
                  isSearching={h.isSearchingSiret}
                />
                {siretError && <FieldError>{siretError.message}</FieldError>}
              </Field>

              <SiretSearchStatus
                status={h.siretSearchStatus}
                useFormulaireComplet={h.useFormulaireComplet}
                onUseFormulaireComplet={h.enableFormulaireComplet}
              />
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {h.showFormBody && (
                <>
                  <EtablissementFields
                    form={h.form}
                    apeList={h.apeList}
                    mandatoryFields={h.mandatoryFields}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={h.isSaving}>
                      {h.isSaving ? "Enregistrement..." : "Continuer"}
                    </Button>
                  </div>
                </>
              )}
            </FieldGroup>
          </CardContent>
        </form>
      </Card>
    </>
  );
}
