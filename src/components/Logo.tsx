import { Lock } from "lucide-react";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const sizeClasses = size === "large" ? "text-3xl" : "text-2xl";
  const iconSize = size === "large" ? 32 : 24;
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Lock className="text-primary animate-pulse-gold" size={iconSize} strokeWidth={2.5} />
      </div>
      <span className={`${sizeClasses} font-bold tracking-tight`}>
        Leak<span className="text-primary">Lock</span>
      </span>
    </div>
  );
}
