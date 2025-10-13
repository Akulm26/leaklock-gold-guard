import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface DetectedSub {
  id: string;
  name: string;
  amount: number;
  renewal: string;
  source: string;
}

export default function ConfirmDetected() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<DetectedSub[]>([]);
  const [tracking, setTracking] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const detected = JSON.parse(localStorage.getItem("detectedSubscriptions") || "[]");
    setSubscriptions(detected);
    
    // Initialize all as tracked
    const trackingState: Record<string, boolean> = {};
    detected.forEach((sub: DetectedSub) => {
      trackingState[sub.id] = true;
    });
    setTracking(trackingState);
  }, []);

  const handleConfirm = () => {
    const accepted = subscriptions.filter((sub) => tracking[sub.id]);
    
    if (accepted.length === 0) {
      toast.info("No subscriptions selected");
      navigate("/dashboard");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    localStorage.setItem("subscriptions", JSON.stringify([...existing, ...accepted]));
    
    toast.success(`${accepted.length} plan${accepted.length > 1 ? 's' : ''} confirmed`);
    navigate("/dashboard");
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `in ${days} days`;
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft size={20} />
          </Button>
          <Logo />
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold mb-2">Review Detected Plans</h1>
            <p className="text-muted-foreground">
              Select which subscriptions to track
            </p>
          </div>

          {/* Subscription List */}
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="glass-card rounded-xl p-4 animate-fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      ₹{sub.amount} • Renews {formatDate(sub.renewal)}
                    </p>
                    <div className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      Auto-detected
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Switch
                      checked={tracking[sub.id]}
                      onCheckedChange={(checked) =>
                        setTracking((prev) => ({ ...prev, [sub.id]: checked }))
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      {tracking[sub.id] ? "Track" : "Ignore"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6">
          <div className="text-center text-sm text-muted-foreground mb-2">
            {Object.values(tracking).filter(Boolean).length} of {subscriptions.length} selected
          </div>
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleConfirm}
          >
            Confirm Selected Plans
          </Button>
          <Button
            variant="text"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Skip
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
