import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Scan, Edit3 } from "lucide-react";

export default function ActionSelect() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="large" />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-border/30 rounded-full mb-12 overflow-hidden">
          <div className="h-full w-3/4 bg-primary animate-shimmer bg-gradient-to-r from-primary via-primary/60 to-primary" 
               style={{ backgroundSize: "200% 100%" }} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Track subscriptions</h1>
            <p className="text-muted-foreground">
              Choose how you want to add your plans
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            {/* Auto-Detect */}
            <button
              onClick={() => navigate("/sms-permission")}
              className="w-full glass-card rounded-2xl p-6 border-2 border-primary/50 gold-glow hover:border-primary hover:scale-[1.02] transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Scan className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Auto-Detect via SMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan your messages for subscriptions. Fast and secure.
                  </p>
                </div>
              </div>
            </button>

            {/* Manual Add */}
            <button
              onClick={() => navigate("/add-manual")}
              className="w-full glass-card rounded-2xl p-6 border-2 border-border/50 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary group-hover:bg-secondary/80 transition-colors">
                  <Edit3 className="text-foreground" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Add Manually</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter subscription details yourself. Full control over your data.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <Button
          variant="text"
          onClick={() => navigate("/dashboard")}
          className="w-full"
        >
          Skip for now
        </Button>
      </div>
    </MobileLayout>
  );
}
