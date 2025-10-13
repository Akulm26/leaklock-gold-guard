import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
    setIsValidating(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (otpValue === "1234") {
      toast.success("OTP verified.");
      
      // Simulate checking if user exists
      const isNewUser = !localStorage.getItem("userName");
      
      if (isNewUser) {
        navigate("/profile-setup");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(true);
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
      toast.error("Invalid OTP. Try again.");
    }
    
    setIsValidating(false);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary/50"
          >
            <ArrowLeft size={20} />
          </Button>
          <Logo />
          <div className="w-10" /> {/* Spacer */}
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
            <Button variant="text" onClick={() => toast.info("OTP resent")}>
              Resend OTP
            </Button>
            <Button variant="text" onClick={() => navigate(-1)}>
              Change number
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
