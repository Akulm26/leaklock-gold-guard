import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md min-h-screen bg-gradient-background shadow-2xl relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
