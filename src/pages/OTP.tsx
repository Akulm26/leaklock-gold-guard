import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const phone = localStorage.getItem("phone");

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-validate when all filled
    if (index === 3 && value && newOtp.every((d) => d)) {
      validateOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const validateOtp = async (otpValue: string) => {
    // Ensure phone number exists from previous step
    if (!phone) {
      toast.error("Phone number not found. Please start over.");
      navigate("/");
      return;
    }

    setIsValidating(true);
    
    try {
      /**
       * STEP 1: Verify OTP with Supabase Auth
       * 
       * This validates the user-entered OTP against the one sent via SMS:
       * 1. Supabase checks if the OTP matches what was generated
       * 2. Verifies the OTP hasn't expired (typically 60 seconds validity)
       * 3. If valid, creates an authenticated session for the user
       * 4. Returns user object with session tokens (access_token, refresh_token)
       * 
       * Parameters:
       * - phone: The phone number that received the OTP (+91XXXXXXXXXX)
       * - token: The OTP code entered by user (e.g., "123456")
       * - type: 'sms' indicates this is phone-based OTP verification
       */
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otpValue,
        type: 'sms'
      });

      if (error) throw error;

      /**
       * STEP 2: Handle successful authentication
       * 
       * data.user contains:
       * - id: Unique user ID (UUID)
       * - phone: Verified phone number
       * - created_at: Account creation timestamp
       * - Session tokens are automatically stored by Supabase client
       */
      if (data.user) {
        toast.success("OTP verified successfully!");
        
        /**
         * STEP 3: Route user based on account status
         * 
         * Check if this is a new user or existing user:
         * - New user: Redirect to profile setup to collect name, preferences
         * - Existing user: Redirect directly to dashboard
         * 
         * Note: In production, you'd check this against a database table
         * instead of localStorage
         */
        const isNewUser = !localStorage.getItem("userName");
        
        if (isNewUser) {
          navigate("/profile-setup");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      /**
       * Common errors:
       * - "Invalid token": Wrong OTP entered
       * - "Token expired": OTP validity period (60s) has passed
       * - "Too many attempts": Rate limiting triggered
       */
      setError(true);
      setOtp(["", "", "", ""]); // Clear all OTP inputs
      inputRefs[0].current?.focus(); // Focus first input for retry
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phone) return;
    
    try {
      /**
       * RESEND OTP FLOW
       * 
       * This triggers the same OTP generation process as initial login:
       * 1. Invalidates any previous OTP for this phone number
       * 2. Generates a new random OTP code
       * 3. Sends new SMS via configured SMS provider
       * 
       * Rate limiting applies:
       * - Typically max 1 OTP per 60 seconds per phone number
       * - Prevents spam and abuse
       * - If rate limit hit, error will be thrown and caught below
       */
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
      
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <MobileLayout>
      <BackButton />
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-border/30 rounded-full mb-12 overflow-hidden">
          <div className="h-full w-1/4 bg-primary animate-shimmer bg-gradient-to-r from-primary via-primary/60 to-primary" 
               style={{ backgroundSize: "200% 100%" }} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
            <p className="text-muted-foreground">
              Enter the code sent to +91 {phone}
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-4 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-16 h-16 text-center text-2xl font-bold glass-card border-2 ${
                  error ? "border-destructive animate-shake" : "border-border/50 focus:border-primary"
                } transition-all`}
                disabled={isValidating}
              />
            ))}
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">
              Invalid OTP. Try again.
            </p>
          )}

          {isValidating && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pt-6">
            <Button variant="text" onClick={handleResendOtp} disabled={isValidating}>
              Resend OTP
            </Button>
            <Button variant="text" onClick={() => navigate(-1)} disabled={isValidating}>
              Change number
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
