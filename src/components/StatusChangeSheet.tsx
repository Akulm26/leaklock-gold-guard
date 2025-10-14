import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DetectedChange {
  subscriptionId: string;
  serviceName: string;
  detectedStatus: "canceled" | "paused";
  evidence: string;
}

interface StatusChangeSheetProps {
  open: boolean;
  detectedChange: DetectedChange | null;
  onConfirm: (subscriptionId: string, status: "canceled" | "paused") => void;
  onNotSure: (subscriptionId: string) => void;
  onClose: () => void;
}

export function StatusChangeSheet({
  open,
  detectedChange,
  onConfirm,
  onNotSure,
  onClose,
}: StatusChangeSheetProps) {
  if (!detectedChange) return null;

  const handleConfirmCanceled = () => {
    onConfirm(detectedChange.subscriptionId, "canceled");
    onClose();
  };

  const handleConfirmPaused = () => {
    onConfirm(detectedChange.subscriptionId, "paused");
    onClose();
  };

  const handleNotSure = () => {
    onNotSure(detectedChange.subscriptionId);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10 mt-1">
              <AlertCircle className="text-primary" size={20} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl mb-2">
                Status change detected
              </SheetTitle>
              <SheetDescription className="text-base">
                We found a {detectedChange.detectedStatus === "canceled" ? "cancellation" : "pausing"} signal for{" "}
                <span className="font-semibold text-foreground">{detectedChange.serviceName}</span>.
              </SheetDescription>
            </div>
          </div>
          {detectedChange.evidence && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              {detectedChange.evidence}
            </div>
          )}
        </SheetHeader>

        <div className="space-y-3">
          <Button
            variant="destructive"
            className="w-full h-12 text-base"
            onClick={handleConfirmCanceled}
          >
            Confirm Canceled
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleConfirmPaused}
          >
            Confirm Paused
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 text-base"
            onClick={handleNotSure}
          >
            Not sure
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
