import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to continue");
      return;
    }

    localStorage.setItem("userName", name);
    navigate("/action-select");
  };

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
          <div className="h-full w-2/4 bg-primary animate-shimmer bg-gradient-to-r from-primary via-primary/60 to-primary" 
               style={{ backgroundSize: "200% 100%" }} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome aboard</h1>
            <p className="text-muted-foreground">
              Let's set up your profile
            </p>
          </div>

          {/* Name Input */}
          <div className="glass-card rounded-2xl p-6">
            <label className="text-sm text-muted-foreground mb-2 block">
              Your Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 text-lg"
            />
          </div>

          {/* Privacy Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  LeakLock scans only subscription-related SMS. We do not read personal messages.
                  All data is processed locally on your device.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="privacy-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="privacy-agree"
                className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
              >
                I understand and agree to the privacy terms
              </label>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!name.trim() || !agreed}
        >
          Continue
        </Button>
      </div>
    </MobileLayout>
  );
}
