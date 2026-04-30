import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={
          visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center justify-center px-2.5 text-muted-foreground transition-colors hover:text-foreground outline-none rounded-r-lg focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
