import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmActionSheetProps {
  open: boolean;
  subscription: { id: string; name: string; provider: string } | null;
  onConfirmCancel: () => void;
  onConfirmPause: () => void;
  onNotSure: () => void;
  onClose: () => void;
}

export function ConfirmActionSheet({
  open,
  subscription,
  onConfirmCancel,
  onConfirmPause,
  onNotSure,
  onClose,
}: ConfirmActionSheetProps) {
  if (!subscription) return null;

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
                Manage Subscription
              </SheetTitle>
              <SheetDescription className="text-base">
                What would you like to do with{" "}
                <span className="font-semibold text-foreground">{subscription.name || subscription.provider}</span>?
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-3">
          <Button
            variant="destructive"
            className="w-full h-12 text-base"
            onClick={onConfirmCancel}
          >
            Confirm Cancel
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={onConfirmPause}
          >
            Confirm Pause
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 text-base"
            onClick={onNotSure}
          >
            Not sure
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}