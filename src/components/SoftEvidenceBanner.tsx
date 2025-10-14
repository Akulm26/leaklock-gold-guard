import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SoftEvidenceBannerProps {
  missedCycles: number;
  onMarkPaused: () => void;
  onMarkCanceled: () => void;
  onKeepActive: () => void;
}

export function SoftEvidenceBanner({
  missedCycles,
  onMarkPaused,
  onMarkCanceled,
  onKeepActive,
}: SoftEvidenceBannerProps) {
  return (
    <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
        <p className="text-xs text-yellow-600 dark:text-yellow-400 flex-1">
          We didn't see charges on the last {missedCycles} renewal{missedCycles > 1 ? "s" : ""}. 
          Mark as paused/canceled?
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
          onClick={onMarkPaused}
        >
          Mark Paused
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
          onClick={onMarkCanceled}
        >
          Mark Canceled
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs flex-1"
          onClick={onKeepActive}
        >
          Keep Active
        </Button>
      </div>
    </div>
  );
}
