import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  contactFormSchema,
  type ContactFormData,
} from "@etape/types/schemas/beneficiaire-profile";
import { contactFormDefaultValues } from "@etape/types/schemas/profile-defaults";
import { useAuth } from "@/app/provider/auth-provider";
import { useMyProfile } from "../hooks/use-my-profile";
import { useUpdateMyProfile } from "../hooks/use-update-my-profile";
import { mapContactToForm } from "@/lib/profile-mappers.ts";
import { RequiredFieldFooter } from "@workspace/ui/components/required-field-footer";

export function ContactSection() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaultValues,
    values: profile ? mapContactToForm(profile) : undefined,
  });

  const { mutate, isPending } = useUpdateMyProfile(setError);

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <FieldGroup className={"px-20"}>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" value={user?.email ?? ""} disabled />
          <FieldDescription>
            Pour modifier votre email, contactez le support.
          </FieldDescription>
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field
            data-invalid={!!errors.adresseNumero}
            className="md:col-span-1"
          >
            <FieldLabel htmlFor="adresseNumero">Numéro</FieldLabel>
            <Input
              id="adresseNumero"
              aria-invalid={!!errors.adresseNumero}
              {...register("adresseNumero")}
            />
            {errors.adresseNumero && (
              <FieldError>{errors.adresseNumero.message}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors.adresseVoie} className="md:col-span-3">
            <FieldLabel htmlFor="adresseVoie">Voie</FieldLabel>
            <Input
              id="adresseVoie"
              aria-invalid={!!errors.adresseVoie}
              {...register("adresseVoie")}
            />
            {errors.adresseVoie && (
              <FieldError>{errors.adresseVoie.message}</FieldError>
            )}
          </Field>
        </div>

        <Field data-invalid={!!errors.adresseComplement}>
          <FieldLabel htmlFor="adresseComplement">
            Complément d'adresse
          </FieldLabel>
          <Input
            id="adresseComplement"
            aria-invalid={!!errors.adresseComplement}
            {...register("adresseComplement")}
          />
          {errors.adresseComplement && (
            <FieldError>{errors.adresseComplement.message}</FieldError>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field data-invalid={!!errors.codePostal} className="md:col-span-1">
            <FieldLabel htmlFor="codePostal">Code postal</FieldLabel>
            <Input
              id="codePostal"
              inputMode="numeric"
              aria-invalid={!!errors.codePostal}
              {...register("codePostal")}
            />
            {errors.codePostal && (
              <FieldError>{errors.codePostal.message}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors.ville} className="md:col-span-2">
            <FieldLabel htmlFor="ville">Ville</FieldLabel>
            <Input
              id="ville"
              aria-invalid={!!errors.ville}
              {...register("ville")}
            />
            {errors.ville && <FieldError>{errors.ville.message}</FieldError>}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.telephoneFixe}>
            <FieldLabel htmlFor="telephoneFixe">Téléphone fixe</FieldLabel>
            <Input
              id="telephoneFixe"
              type="tel"
              inputMode="tel"
              aria-invalid={!!errors.telephoneFixe}
              {...register("telephoneFixe")}
            />
            <RequiredFieldFooter
              errorMessage={errors.telephonePortable?.message}
              description="Au moins un téléphone (fixe ou portable) est requis"
            />
          </Field>
          <Field data-invalid={!!errors.telephonePortable}>
            <FieldLabel htmlFor="telephonePortable">
              Téléphone portable
            </FieldLabel>
            <Input
              id="telephonePortable"
              type="tel"
              inputMode="tel"
              aria-invalid={!!errors.telephonePortable}
              {...register("telephonePortable")}
            />
            <RequiredFieldFooter
              errorMessage={errors.telephonePortable?.message}
              description="Au moins un téléphone (fixe ou portable) est requis"
            />
          </Field>
        </div>

        <Field orientation={"horizontal"} className={"justify-end"}>
          <Button type="submit" disabled={isPending} className={"w-60"}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
