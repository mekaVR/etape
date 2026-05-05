import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RequiredFieldFooter } from "@workspace/ui/components/required-field-footer";
import { SearchableSelect } from "@workspace/ui/components/searchable-select";
import { mapProfileToForm } from "@/lib/profile-mappers.ts";
import { nationalitesList } from "@etape/types/schemas/nationalites";

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
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <FieldGroup className={"px-20"}>
        <Field data-invalid={!!errors.civilite}>
          <FieldLabel htmlFor="civilite">Civilité</FieldLabel>
          <Controller
            name="civilite"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="civilite" aria-invalid={!!errors.civilite}>
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
            <FieldLabel htmlFor="nom">Nom*</FieldLabel>
            <Input id="nom" aria-invalid={!!errors.nom} {...register("nom")} />
            <RequiredFieldFooter errorMessage={errors.nom?.message} />
          </Field>
          <Field data-invalid={!!errors.prenom}>
            <FieldLabel htmlFor="prenom">Prénom*</FieldLabel>
            <Input
              id="prenom"
              aria-invalid={!!errors.prenom}
              {...register("prenom")}
            />
            <RequiredFieldFooter errorMessage={errors.prenom?.message} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.dateNaissance}>
            <FieldLabel htmlFor="dateNaissance">Date de naissance*</FieldLabel>
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
            <RequiredFieldFooter errorMessage={errors.dateNaissance?.message} />
          </Field>
          <Field data-invalid={!!errors.lieuNaissance}>
            <FieldLabel htmlFor="lieuNaissance">Lieu de naissance*</FieldLabel>
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
              <SearchableSelect
                id="nationalite"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.nationalite}
                placeholder="Sélectionner une nationalité"
                placeholderEmpty="Aucune nationalité trouvée."
                data={nationalitesList}
              />
            )}
          />
          {errors.nationalite && (
            <FieldError>{errors.nationalite.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.numeroSecuriteSociale}>
          <FieldLabel htmlFor="numeroSecuriteSociale">
            Numéro de sécurité sociale*
          </FieldLabel>
          <Input
            id="numeroSecuriteSociale"
            placeholder="15 chiffres"
            inputMode="numeric"
            aria-invalid={!!errors.numeroSecuriteSociale}
            {...register("numeroSecuriteSociale")}
          />
          <RequiredFieldFooter
            errorMessage={errors.numeroSecuriteSociale?.message}
          />
        </Field>

        <Field orientation={"horizontal"} className={"justify-end"}>
          <Button type="submit" disabled={isPending} className={"w-60"}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
