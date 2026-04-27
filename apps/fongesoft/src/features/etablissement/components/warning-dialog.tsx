import { AlertTriangle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface WarningDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function WarningDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: WarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            <DialogTitle>Confirmer la mise à jour</DialogTitle>
          </div>
          <DialogDescription>
            Attention, en continuant vous allez mettre à jour les données de la
            fiche établissement, voulez-vous continuer la mise à jour de la
            fiche établissement ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Retour
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Enregistrement..." : "Continuer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
