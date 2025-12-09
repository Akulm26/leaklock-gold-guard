import { useEffect, useState } from "react";
import { Logo } from "./Logo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "fadeOut">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase("text"), 800);
    const textTimer = setTimeout(() => setPhase("fadeOut"), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === "fadeOut" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Logo with scale animation */}
      <div
        className={`relative transition-all duration-700 ease-out ${
          phase === "logo"
            ? "scale-0 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <div className="relative">
          {/* Gold glow ring */}
          <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 blur-xl animate-spin-slow" />
          <Logo size="xl" />
        </div>
      </div>

      {/* App name with slide up animation */}
      <div
        className={`mt-8 text-center transition-all duration-700 delay-200 ${
          phase === "text" || phase === "fadeOut"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Leak<span className="text-primary">Lock</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Guard Your Subscriptions
        </p>
      </div>

      {/* Loading dots */}
      <div
        className={`mt-12 flex gap-2 transition-opacity duration-500 ${
          phase === "fadeOut" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
