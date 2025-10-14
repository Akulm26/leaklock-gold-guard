import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Welcome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    // Validate phone number has at least 10 digits
    if (phone.length < 10) return;
    
    setIsLoading(true);
    
    /**
     * STEP 1: Format phone number to E.164 international format
     * E.164 format is required by Supabase: +[country_code][phone_number]
     * Example: +919876543210
     */
    const formattedPhone = `+91${phone}`;
    
    try {
      /**
       * STEP 2: Trigger OTP generation via Supabase Auth
       * 
       * This calls Supabase backend which:
       * 1. Generates a random OTP code (typically 6 digits)
       * 2. Stores it temporarily in Supabase auth system
       * 3. Sends SMS via configured SMS provider (Twilio/MessageBird/Vonage/Textlocal)
       * 
       * IMPORTANT: SMS provider MUST be configured in backend settings:
       * - Go to: Authentication → Providers → Phone
       * - Enable phone provider
       * - Add SMS provider credentials (API keys, sender ID, etc.)
       * - Supported providers: Twilio, MessageBird, Vonage, Textlocal
       * 
       * Without SMS provider configuration, this will fail with error.
       */
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      /**
       * STEP 3: Store phone number for OTP verification page
       * The OTP page needs to know which phone number to verify against
       */
      localStorage.setItem("phone", formattedPhone);
      
      // Show success message to user
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      
      // Navigate to OTP entry page
      navigate("/otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      
      /**
       * Common errors:
       * - "SMS provider not configured": No SMS service set up in backend
       * - "Invalid phone number": Wrong format or unsupported country code
       * - "Rate limit exceeded": Too many OTP requests in short time
       */
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-12 pt-8">
          <Logo size="large" />
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Bring your money back in sight.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Track hidden charges, trials, and subscriptions effortlessly.
          </p>
        </div>

        {/* Phone Input */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground border-r border-border/50 pr-3">
                <Phone size={18} />
                <span className="text-sm font-medium">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg"
              />
            </div>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={phone.length < 10 || isLoading}
          >
            {isLoading ? "Sending OTP..." : "Continue"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
