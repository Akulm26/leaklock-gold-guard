import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { formatDate } from "date-fns";

interface AmazonRenewalNudgeProps {
  itemName: string;
  renewalDate: string;
  onSkip: () => void;
  onPause: () => void;
  onCancel: () => void;
  onKeep: () => void;
}

export function AmazonRenewalNudge({
  itemName,
  renewalDate,
  onSkip,
  onPause,
  onCancel,
  onKeep,
}: AmazonRenewalNudgeProps) {
  const formattedDate = formatDate(new Date(renewalDate), "MMM d");
  
  return (
    <div className="mt-3 p-4 rounded-lg glass-card border-primary/30 space-y-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <AlertCircle className="text-primary" size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">
            Amazon: {itemName} renews on {formattedDate}
          </p>
          <p className="text-xs text-muted-foreground">
            Want to skip this month?
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs border-primary/30 hover:bg-primary/10"
          onClick={onSkip}
        >
          Skip this month
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs border-primary/30 hover:bg-primary/10"
          onClick={onPause}
        >
          Pause 1–3 months
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-xs"
          onClick={onKeep}
        >
          Keep
        </Button>
      </div>
    </div>
  );
}