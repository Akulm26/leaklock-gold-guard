import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

export default function SmsPermission() {
  const navigate = useNavigate();

  const handleGrant = () => {
    // Simulate permission grant
    toast.success("Permission granted.");
    navigate("/auto-sync");
  };

  const handleSkip = () => {
    toast.info("You can still add subscriptions manually.");
    navigate("/add-manual");
  };

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="large" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-6 rounded-full bg-primary/10 gold-glow animate-pulse-gold">
              <MessageSquare className="text-primary" size={48} />
            </div>
            <h1 className="text-3xl font-bold">Allow SMS access</h1>
            <p className="text-muted-foreground leading-relaxed">
              LeakLock needs permission to scan your messages for subscription-related transactions.
            </p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="glass-card rounded-xl p-4 flex items-start gap-3">
              <Shield className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-sm mb-1">Local Processing</h3>
                <p className="text-xs text-muted-foreground">
                  All scanning happens locally on your device. No data is sent to external servers.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex items-start gap-3">
              <Lock className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-sm mb-1">Subscription Only</h3>
                <p className="text-xs text-muted-foreground">
                  We only read messages from known subscription services. Personal messages are ignored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleGrant}
          >
            Grant Permission
          </Button>
          <Button
            variant="gold-outline"
            size="lg"
            className="w-full"
            onClick={handleSkip}
          >
            Not Now
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
