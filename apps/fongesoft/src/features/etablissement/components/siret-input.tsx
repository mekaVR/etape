import { useRef, type ChangeEvent } from "react";
import { RefreshCw } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { extractSiretDigits, formatSiret } from "@/lib/format-siret";

interface SiretInputProps {
  value: string;
  onDigitsChange: (rawDigits: string) => void;
  onRefresh?: () => void;
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  isSearching?: boolean;
  "aria-describedby"?: string;
}

export function SiretInput({
  value,
  onDigitsChange,
  onRefresh,
  id,
  disabled,
  invalid,
  isSearching,
  ...aria
}: SiretInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const displayed = formatSiret(value);
  const showRefresh = value.length === 14 && !isSearching && !!onRefresh;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const selectionStart = e.target.selectionStart ?? raw.length;
    const digitsBeforeCursor = raw
      .slice(0, selectionStart)
      .replace(/\D/g, "").length;

    const digits = extractSiretDigits(raw);
    const formatted = formatSiret(digits);

    onDigitsChange(digits);

    requestAnimationFrame(() => {
      const input = ref.current;
      if (!input) return;
      let pos = formatted.length;
      let seen = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i]!)) seen += 1;
        if (seen >= digitsBeforeCursor) {
          pos = i + 1;
          break;
        }
      }
      input.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        value={displayed}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={invalid}
        placeholder="123 456 789 12345"
        className={cn(
          showRefresh && "pr-9",
          "text-white placeholder:text-white/70",
        )}
        {...aria}
      />
      {showRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Relancer la recherche"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
