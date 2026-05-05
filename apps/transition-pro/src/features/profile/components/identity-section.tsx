import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  identityFormSchema,
  type IdentityFormData,
} from "@etape/types/schemas/beneficiaire-profile";
import { identityFormDefaultValues } from "@etape/types/schemas/profile-defaults";
import { useMyProfile } from "../hooks/use-my-profile";
import { useUpdateMyProfile } from "../hooks/use-update-my-profile";
import { DatePicker } from "@workspace/ui/components/date-picker";
import { NationaliteCombobox } from "./nationalite-combobox";
import { mapProfileToForm } from "@/lib/profile-mappers.ts";

export function IdentitySection() {
  const { data: profile } = useMyProfile();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identityFormSchema),
    defaultValues: identityFormDefaultValues,
    values: profile ? mapProfileToForm(profile) : undefined,
  });

  const { mutate, isPending } = useUpdateMyProfile(setError);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon identité</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <FieldGroup>
            <Field data-invalid={!!errors.civilite}>
              <FieldLabel htmlFor="civilite">Civilité</FieldLabel>
              <Controller
                name="civilite"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="civilite"
                      aria-invalid={!!errors.civilite}
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MADAME">Madame</SelectItem>
                      <SelectItem value="MONSIEUR">Monsieur</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.civilite && (
                <FieldError>{errors.civilite.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={!!errors.nom}>
                <FieldLabel htmlFor="nom">Nom</FieldLabel>
                <Input
                  id="nom"
                  aria-invalid={!!errors.nom}
                  {...register("nom")}
                />
                {errors.nom && <FieldError>{errors.nom.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.prenom}>
                <FieldLabel htmlFor="prenom">Prénom</FieldLabel>
                <Input
                  id="prenom"
                  aria-invalid={!!errors.prenom}
                  {...register("prenom")}
                />
                {errors.prenom && (
                  <FieldError>{errors.prenom.message}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={!!errors.dateNaissance}>
                <FieldLabel htmlFor="dateNaissance">
                  Date de naissance
                </FieldLabel>
                <Controller
                  name="dateNaissance"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="dateNaissance"
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={!!errors.dateNaissance}
                    />
                  )}
                />
                {errors.dateNaissance && (
                  <FieldError>{errors.dateNaissance.message}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.lieuNaissance}>
                <FieldLabel htmlFor="lieuNaissance">
                  Lieu de naissance
                </FieldLabel>
                <Input
                  id="lieuNaissance"
                  placeholder="Ville"
                  aria-invalid={!!errors.lieuNaissance}
                  {...register("lieuNaissance")}
                />
                {errors.lieuNaissance && (
                  <FieldError>{errors.lieuNaissance.message}</FieldError>
                )}
              </Field>
            </div>

            <Field data-invalid={!!errors.nationalite}>
              <FieldLabel htmlFor="nationalite">Nationalité</FieldLabel>
              <Controller
                name="nationalite"
                control={control}
                render={({ field }) => (
                  <NationaliteCombobox
                    id="nationalite"
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={!!errors.nationalite}
                  />
                )}
              />
              {errors.nationalite && (
                <FieldError>{errors.nationalite.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.numeroSecuriteSociale}>
              <FieldLabel htmlFor="numeroSecuriteSociale">
                Numéro de sécurité sociale
              </FieldLabel>
              <Input
                id="numeroSecuriteSociale"
                placeholder="15 chiffres"
                inputMode="numeric"
                aria-invalid={!!errors.numeroSecuriteSociale}
                {...register("numeroSecuriteSociale")}
              />
              {errors.numeroSecuriteSociale && (
                <FieldError>{errors.numeroSecuriteSociale.message}</FieldError>
              )}
            </Field>

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
