import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxItem,
} from "@workspace/ui/components/combobox";

interface SearchableSelectProps<T extends string> {
  data: readonly T[];
  value?: T;
  onChange?: (value: T | undefined) => void;
  placeholder: string;
  placeholderEmpty: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function SearchableSelect<T extends string>({
  data,
  value,
  onChange,
  placeholder,
  placeholderEmpty,
  id,
  ...rest
}: SearchableSelectProps<T>) {
  return (
    <Combobox
      items={data}
      value={value ?? null}
      onValueChange={(v: T | null) => onChange?.(v ?? undefined)}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={rest["aria-invalid"]}
        aria-describedby={rest["aria-describedby"]}
        showClear
      />
      <ComboboxContent className="max-h-72">
        <ComboboxEmpty>{placeholderEmpty}</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
