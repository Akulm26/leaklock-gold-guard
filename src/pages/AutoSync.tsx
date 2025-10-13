import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

const SYNC_STAGES = [
  { label: "Syncing messages locally", duration: 1500 },
  { label: "Scanning for subscriptions", duration: 2000 },
  { label: "Extracting app, amount, renewal", duration: 1800 },
  { label: "Normalizing and saving", duration: 1200 },
];

export default function AutoSync() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStage < SYNC_STAGES.length) {
      const stageDuration = SYNC_STAGES[currentStage].duration;
      const steps = 50;
      const stepDuration = stageDuration / steps;

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + (100 / steps);
        });
      }, stepDuration);

      const timeout = setTimeout(() => {
        if (currentStage < SYNC_STAGES.length - 1) {
          setCurrentStage((prev) => prev + 1);
          setProgress(0);
        } else {
          setIsComplete(true);
          // Store mock detected subscriptions
          const mockSubscriptions = [
            { id: "1", name: "Netflix", amount: 649, renewal: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), source: "auto" },
            { id: "2", name: "Spotify", amount: 119, renewal: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), source: "auto" },
            { id: "3", name: "Amazon Prime", amount: 1499, renewal: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), source: "auto" },
          ];
          localStorage.setItem("detectedSubscriptions", JSON.stringify(mockSubscriptions));
        }
      }, stageDuration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentStage]);

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="large" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center space-y-12">
          {/* Scanning Animation */}
          <div className="flex justify-center">
            {isComplete ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in gold-glow">
                  <Check className="text-primary" size={64} strokeWidth={3} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-border/20 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-t-primary border-primary/20 animate-spin" />
                </div>
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={48} />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-6">
            {isComplete ? (
              <div className="text-center space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold">Scan Complete</h2>
                <div className="glass-card rounded-xl p-4 inline-block">
                  <p className="text-3xl font-bold text-primary">3 subscriptions found</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-center">
                    {SYNC_STAGES[currentStage].label}...
                  </p>
                  <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-center gap-2">
                  {SYNC_STAGES.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index < currentStage
                          ? "bg-primary"
                          : index === currentStage
                          ? "bg-primary animate-pulse"
                          : "bg-border/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        {isComplete && (
          <Button
            variant="gold"
            size="lg"
            className="w-full animate-fade-in"
            onClick={() => navigate("/confirm-detected")}
          >
            Review Detected Plans
          </Button>
        )}
      </div>
    </MobileLayout>
  );
}
