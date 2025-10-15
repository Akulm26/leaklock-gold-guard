import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, CreditCard, MessageCircle, X } from "lucide-react";

interface RecoverySheetProps {
  open: boolean;
  subscription: {
    id: string;
    name: string;
    provider: string;
    expiredSince?: string;
    lastEvidence?: string;
  } | null;
  onRenewNow: (subscriptionId: string) => void;
  onUpdatePayment: (subscriptionId: string) => void;
  onAskLLM: (subscriptionId: string) => void;
  onTriedRenewing: (subscriptionId: string) => void;
  onMarkCanceled: (subscriptionId: string) => void;
  onClose: () => void;
}

export function RecoverySheet({
  open,
  subscription,
  onRenewNow,
  onUpdatePayment,
  onAskLLM,
  onTriedRenewing,
  onMarkCanceled,
  onClose,
}: RecoverySheetProps) {
  if (!subscription) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "recently";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-card/95 backdrop-blur-xl border-t border-primary/20">
        <SheetHeader className="text-left mb-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mt-1">
              <AlertCircle className="text-yellow-500" size={22} />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl mb-2 text-foreground">
                Restore your subscription
              </SheetTitle>
              <SheetDescription className="text-base text-muted-foreground">
                We detected a payment failure on{" "}
                <span className="font-semibold text-foreground">{formatDate(subscription.expiredSince)}</span>
                {" "}for{" "}
                <span className="font-semibold text-foreground">{subscription.name}</span>.
              </SheetDescription>
            </div>
          </div>

          {subscription.lastEvidence && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">Last evidence</p>
              <p className="text-sm text-foreground">{subscription.lastEvidence}</p>
            </div>
          )}

          <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> Expired subscriptions don't count as savings.
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-2.5">
          {/* Primary actions */}
          <Button
            variant="default"
            className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            onClick={() => {
              onRenewNow(subscription.id);
              onClose();
            }}
          >
            <ExternalLink className="mr-2" size={18} />
            Renew now
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 text-base border-primary/30"
            onClick={() => {
              onUpdatePayment(subscription.id);
              onClose();
            }}
          >
            <CreditCard className="mr-2" size={18} />
            Update payment method
          </Button>

          {/* Secondary actions */}
          <div className="pt-2 space-y-2">
            <Button
              variant="ghost"
              className="w-full h-11 text-sm"
              onClick={() => {
                onAskLLM(subscription.id);
                onClose();
              }}
            >
              <MessageCircle className="mr-2" size={16} />
              Ask LLM Assistant
            </Button>

            <Button
              variant="ghost"
              className="w-full h-11 text-sm text-green-500 hover:text-green-600 hover:bg-green-500/10"
              onClick={() => {
                onTriedRenewing(subscription.id);
                onClose();
              }}
            >
              I've tried renewing
            </Button>

            <Button
              variant="ghost"
              className="w-full h-11 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onMarkCanceled(subscription.id);
                onClose();
              }}
            >
              <X className="mr-2" size={16} />
              Mark as canceled
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
