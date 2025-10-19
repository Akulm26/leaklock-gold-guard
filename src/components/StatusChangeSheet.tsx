import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DetectedChange {
  subscriptionId: string;
  serviceName: string;
  detectedStatus: "canceled" | "paused";
  evidence: string;
  evidenceEvents?: Array<{
    type: "sms" | "email" | "no_debit" | "app_notification";
    confidence: "high" | "med";
    at: string;
    note?: string;
  }>;
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
  const [cancellationReason, setCancellationReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);

  if (!detectedChange) return null;

  const handleConfirmCanceled = async () => {
    if (!showReasonInput) {
      setShowReasonInput(true);
      return;
    }
    
    if (!cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    
    // Save the cancellation reason to database
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ cancellation_reason: cancellationReason.trim() })
        .eq('id', detectedChange.subscriptionId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving cancellation reason:', error);
    }
    
    onConfirm(detectedChange.subscriptionId, "canceled");
    setCancellationReason("");
    setShowReasonInput(false);
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
          {detectedChange.evidenceEvents && detectedChange.evidenceEvents.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">What we found</p>
              <div className="flex flex-wrap gap-2">
                {detectedChange.evidenceEvents.map((event, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-lg bg-muted/50 text-xs">
                    <span className="font-medium text-foreground">{event.type.toUpperCase()}</span>
                    {event.note && <span className="text-muted-foreground">: {event.note}</span>}
                    <span className="text-muted-foreground ml-1">• {new Date(event.at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : detectedChange.evidence && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              {detectedChange.evidence}
            </div>
          )}
        </SheetHeader>

        <div className="space-y-3">
          {showReasonInput && (
            <div className="space-y-2 animate-fade-in">
              <Label>Reason for cancellation *</Label>
              <Textarea
                placeholder="Please tell us why you're canceling..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
          <Button
            variant="destructive"
            className="w-full h-12 text-base"
            onClick={handleConfirmCanceled}
          >
            {showReasonInput ? "Submit & Confirm Canceled" : "Confirm Canceled"}
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
