import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { DatePicker } from "@workspace/ui/components/date-picker";
import type { EtablissementPayload } from "@etape/types/schemas/etablissement";
import type { ApeCode, MandatoryField } from "@etape/types/types/etablissement";
import { TAILLE_ENTREPRISE_OPTIONS } from "../constants/taille-entreprise";
import { ApeCombobox } from "./ape-combobox";

interface EtablissementFieldsProps {
  form: UseFormReturn<EtablissementPayload>;
  apeList: ApeCode[];
  mandatoryFields: readonly MandatoryField[];
}

export function EtablissementFields({
  form,
  apeList,
  mandatoryFields,
}: EtablissementFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const required = (name: string) =>
    (mandatoryFields as readonly string[]).includes(name);
  const label = (name: string, text: string) =>
    required(name) ? `${text} *` : text;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={!!errors.raison_sociale}>
          <FieldLabel htmlFor="raison_sociale">
            {label("raison_sociale", "Nom / raison sociale")}
          </FieldLabel>
          <Input
            id="raison_sociale"
            placeholder="ex : France Travail"
            aria-invalid={!!errors.raison_sociale}
            {...register("raison_sociale")}
          />
          {errors.raison_sociale && (
            <FieldError>{errors.raison_sociale.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.adresse}>
          <FieldLabel htmlFor="adresse">
            {label("adresse", "Adresse")}
          </FieldLabel>
          <Input
            id="adresse"
            placeholder="ex : 31 rue de la Comédie"
            aria-invalid={!!errors.adresse}
            {...register("adresse")}
          />
          {errors.adresse && <FieldError>{errors.adresse.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.ape}>
          <FieldLabel htmlFor="ape">{label("ape", "Code APE")}</FieldLabel>
          <Controller
            name="ape"
            control={control}
            render={({ field }) => (
              <ApeCombobox
                id="ape"
                options={apeList}
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.ape}
              />
            )}
          />
          {errors.ape && <FieldError>{errors.ape.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.complement_adresse}>
          <FieldLabel htmlFor="complement_adresse">
            {label("complement_adresse", "Complément d'adresse")}
          </FieldLabel>
          <Input
            id="complement_adresse"
            placeholder="ex : Bâtiment 2"
            aria-invalid={!!errors.complement_adresse}
            {...register("complement_adresse")}
          />
          {errors.complement_adresse && (
            <FieldError>{errors.complement_adresse.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.date_creation}>
          <FieldLabel htmlFor="date_creation">
            {label("date_creation", "Date de création de l'entreprise")}
          </FieldLabel>
          <Controller
            name="date_creation"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="date_creation"
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.date_creation}
              />
            )}
          />
          {errors.date_creation && (
            <FieldError>{errors.date_creation.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.code_postal}>
          <FieldLabel htmlFor="code_postal">
            {label("code_postal", "Code postal")}
          </FieldLabel>
          <Input
            id="code_postal"
            placeholder="ex : 75001"
            aria-invalid={!!errors.code_postal}
            {...register("code_postal")}
          />
          {errors.code_postal && (
            <FieldError>{errors.code_postal.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.taille_entreprise}>
          <FieldLabel htmlFor="taille_entreprise">
            {label("taille_entreprise", "Taille de l'entreprise")}
          </FieldLabel>
          <Controller
            name="taille_entreprise"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="taille_entreprise"
                  aria-invalid={!!errors.taille_entreprise}
                  className="w-full"
                >
                  <SelectValue placeholder="ex : Unité Non employeuse" />
                </SelectTrigger>
                <SelectContent>
                  {TAILLE_ENTREPRISE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.codeInsee} value={opt.codeInsee}>
                      {opt.libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.taille_entreprise && (
            <FieldError>{errors.taille_entreprise.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.ville}>
          <FieldLabel htmlFor="ville">{label("ville", "Commune")}</FieldLabel>
          <Input
            id="ville"
            placeholder="ex : Paris"
            aria-invalid={!!errors.ville}
            {...register("ville")}
          />
          {errors.ville && <FieldError>{errors.ville.message}</FieldError>}
        </Field>

        <Controller
          name="effectif_moyen"
          control={control}
          render={({ field }) =>
            field.value > 0 ? (
              <Field>
                <FieldLabel htmlFor="effectif_moyen">Effectif moyen</FieldLabel>
                <Input
                  id="effectif_moyen"
                  type="number"
                  value={field.value}
                  readOnly
                  disabled
                />
              </Field>
            ) : (
              <></>
            )
          }
        />

        <Controller
          name="etat"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="etat">Statut de l'entreprise</FieldLabel>
              <Input
                id="etat"
                value={
                  field.value === "A"
                    ? "Active"
                    : field.value === "F"
                      ? "Fermée"
                      : ""
                }
                readOnly
                disabled
              />
            </Field>
          )}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Les champs d'un astérisque (*) sont obligatoires
      </p>
    </div>
  );
}
